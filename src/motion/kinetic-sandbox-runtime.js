import { Application, Container, Graphics, Rectangle } from 'pixi.js';
import Matter from 'matter-js';
import {
  clamp,
  evaluatePortSnap,
  getWorldLight,
  interpolatePose,
  pointInRotatedRect,
  rotatePoint,
  smoothThrowVelocity,
  solveMovingPortPose,
  worldPort,
  wrapAngle
} from './kinetic-math.js';

const { Body, Bodies, Composite, Constraint, Engine, Sleeping, Vector } = Matter;

const FIXED_STEP = 1000 / 60;
const PHYSICS_SUBSTEPS = 2;
const PHYSICS_SUBSTEP = FIXED_STEP / PHYSICS_SUBSTEPS;
const MAX_CATCH_UP = FIXED_STEP * 3;
const MAX_FRAME_DELTA = 50;
const WALL_THICKNESS = 160;
const MAX_THROW_SPEED = 11.5;
const SETTLE_DURATION = 760;
const ROTATION_STEP = Math.PI / 6;
const REQUIRED_CONNECTIONS = 10;
const CELEBRATION_DURATION = 1780;
const BOARD = 0xded6ca;
const PAPER = 0xf1eee6;
const INK = 0x24211d;
const SIGNAL = 0xa73524;
const SHADOW = 0x171512;
const PORT = Object.freeze({ PLUG: 'plug', SOCKET: 'socket' });

const PART_SPECS = [
  {
    id: 'head', role: 'head', kind: 'head', tone: 'board', x: 0.1, y: 0.22,
    width: 34, height: 40, angle: Math.PI / 3,
    ports: [{ id: 'neck', family: 'neck', polarity: PORT.PLUG, x: 0, y: 0.5, normal: Math.PI / 2 }]
  },
  {
    id: 'chest', role: 'chest', kind: 'chest', tone: 'ink', x: 0.82, y: 0.22,
    width: 50, height: 58, angle: -Math.PI / 6,
    ports: [
      { id: 'neck', family: 'neck', polarity: PORT.SOCKET, x: 0, y: -0.5, normal: -Math.PI / 2 },
      { id: 'waist', family: 'waist', polarity: PORT.SOCKET, x: 0, y: 0.5, normal: Math.PI / 2 },
      { id: 'shoulder-left', family: 'shoulder', polarity: PORT.SOCKET, x: -0.5, y: -0.2, normal: Math.PI },
      { id: 'shoulder-right', family: 'shoulder', polarity: PORT.SOCKET, x: 0.5, y: -0.2, normal: 0 }
    ]
  },
  {
    id: 'pelvis', role: 'pelvis', kind: 'pelvis', tone: 'board', x: 0.91, y: 0.42,
    width: 46, height: 24, angle: Math.PI / 6,
    ports: [
      { id: 'waist', family: 'waist', polarity: PORT.PLUG, x: 0, y: -0.5, normal: -Math.PI / 2 },
      { id: 'hip-left', family: 'hip', polarity: PORT.SOCKET, x: -0.27, y: 0.5, normal: Math.PI / 2 },
      { id: 'hip-right', family: 'hip', polarity: PORT.SOCKET, x: 0.27, y: 0.5, normal: Math.PI / 2 }
    ]
  },
  {
    id: 'upper-arm-a', role: 'upper-arm', kind: 'limb', tone: 'board', x: 0.07, y: 0.49,
    width: 18, height: 42, angle: -Math.PI / 3,
    ports: [
      { id: 'shoulder', family: 'shoulder', polarity: PORT.PLUG, x: 0, y: -0.5, normal: -Math.PI / 2 },
      { id: 'elbow', family: 'elbow', polarity: PORT.SOCKET, x: 0, y: 0.5, normal: Math.PI / 2 }
    ]
  },
  {
    id: 'upper-arm-b', role: 'upper-arm', kind: 'limb', tone: 'ink', x: 0.86, y: 0.61,
    width: 18, height: 42, angle: Math.PI * 2 / 3,
    ports: [
      { id: 'shoulder', family: 'shoulder', polarity: PORT.PLUG, x: 0, y: -0.5, normal: -Math.PI / 2 },
      { id: 'elbow', family: 'elbow', polarity: PORT.SOCKET, x: 0, y: 0.5, normal: Math.PI / 2 }
    ]
  },
  {
    id: 'forearm-a', role: 'forearm', kind: 'limb', tone: 'ink', x: 0.2, y: 0.65,
    width: 16, height: 40, angle: Math.PI / 6,
    ports: [{ id: 'elbow', family: 'elbow', polarity: PORT.PLUG, x: 0, y: -0.5, normal: -Math.PI / 2 }]
  },
  {
    id: 'forearm-b', role: 'forearm', kind: 'limb', tone: 'board', x: 0.68, y: 0.83,
    width: 16, height: 40, angle: -Math.PI * 2 / 3,
    ports: [{ id: 'elbow', family: 'elbow', polarity: PORT.PLUG, x: 0, y: -0.5, normal: -Math.PI / 2 }]
  },
  {
    id: 'thigh-a', role: 'thigh', kind: 'limb', tone: 'ink', x: 0.1, y: 0.82,
    width: 20, height: 45, angle: Math.PI / 3,
    ports: [
      { id: 'hip', family: 'hip', polarity: PORT.PLUG, x: 0, y: -0.5, normal: -Math.PI / 2 },
      { id: 'knee', family: 'knee', polarity: PORT.SOCKET, x: 0, y: 0.5, normal: Math.PI / 2 }
    ]
  },
  {
    id: 'thigh-b', role: 'thigh', kind: 'limb', tone: 'board', x: 0.57, y: 0.21,
    width: 20, height: 45, angle: -Math.PI / 6,
    ports: [
      { id: 'hip', family: 'hip', polarity: PORT.PLUG, x: 0, y: -0.5, normal: -Math.PI / 2 },
      { id: 'knee', family: 'knee', polarity: PORT.SOCKET, x: 0, y: 0.5, normal: Math.PI / 2 }
    ]
  },
  {
    id: 'shin-a', role: 'shin', kind: 'limb', tone: 'board', x: 0.34, y: 0.86,
    width: 17, height: 46, angle: Math.PI * 2 / 3,
    ports: [{ id: 'knee', family: 'knee', polarity: PORT.PLUG, x: 0, y: -0.5, normal: -Math.PI / 2 }]
  },
  {
    id: 'shin-b', role: 'shin', kind: 'limb', tone: 'ink', x: 0.91, y: 0.79,
    width: 17, height: 46, angle: -Math.PI / 3,
    ports: [{ id: 'knee', family: 'knee', polarity: PORT.PLUG, x: 0, y: -0.5, normal: -Math.PI / 2 }]
  }
];

const MATERIALS = {
  board: { elevation: 5, shadowAlpha: 0.14, edgeAlpha: 0.22 },
  ink: { elevation: 7, shadowAlpha: 0.17, edgeAlpha: 0.18 }
};

const getScale = (width) => clamp(width / 1280, 0.72, 1.06);
const toneColor = (tone) => tone === 'ink' ? INK : BOARD;

const tracePart = (graphics, spec, width, height) => {
  if (spec.kind === 'head') return graphics.ellipse(0, 0, width / 2, height / 2);
  if (spec.kind === 'chest') {
    return graphics.poly([
      -width / 2, -height / 2, width / 2, -height / 2,
      width * 0.34, height / 2, -width * 0.34, height / 2
    ]);
  }
  if (spec.kind === 'pelvis') {
    return graphics.poly([
      -width * 0.4, -height / 2, width * 0.4, -height / 2,
      width / 2, height / 2, -width / 2, height / 2
    ]);
  }
  return graphics.poly([
    -width * 0.38, -height / 2, width * 0.38, -height / 2,
    width / 2, height / 2, -width / 2, height / 2
  ]);
};

const drawFilledPart = (spec, width, height, color, alpha = 1) => {
  const graphics = new Graphics();
  tracePart(graphics, spec, width, height).fill({ color, alpha });
  return graphics;
};

const createSurface = (spec, width, height) => {
  const surface = drawFilledPart(spec, width, height, toneColor(spec.tone));
  const stroke = spec.tone === 'ink' ? PAPER : INK;
  tracePart(surface, spec, width, height).stroke({
    color: stroke,
    alpha: spec.tone === 'ink' ? 0.32 : 0.34,
    width: 1.4
  });
  if (spec.kind === 'limb') {
    surface
      .moveTo(-width * 0.2, -height * 0.17)
      .lineTo(width * 0.2, -height * 0.17)
      .stroke({ color: stroke, alpha: 0.18, width: 1 });
  }
  return surface;
};

const createPortMarker = (port, spec, scale) => {
  const marker = new Graphics();
  const radius = Math.max(2.8, 3.8 * scale);
  if (port.polarity === PORT.SOCKET) {
    marker
      .circle(port.x, port.y, radius)
      .fill({ color: toneColor(spec.tone), alpha: 1 })
      .stroke({ color: SIGNAL, alpha: 0.9, width: Math.max(1.2, 1.5 * scale) });
  } else {
    marker
      .circle(port.x, port.y, radius)
      .fill({ color: SIGNAL, alpha: 0.88 })
      .stroke({ color: PAPER, alpha: 0.52, width: 1 });
  }
  return marker;
};

const createView = (spec, width, height, ports, scale) => {
  const root = new Container();
  const farShadow = drawFilledPart(spec, width, height, SHADOW);
  const nearShadow = drawFilledPart(spec, width, height, SHADOW);
  const surface = createSurface(spec, width, height);
  const highlight = new Graphics()
    .moveTo(-width * 0.2, -height * 0.3)
    .lineTo(width * 0.13, -height * 0.3)
    .stroke({ color: 0xffffff, alpha: 1, width: 1.2 });
  const portMarkers = new Map();
  farShadow.scale.set(1.035);
  farShadow.alpha = 0;
  nearShadow.alpha = 0;
  highlight.alpha = 0;
  root.addChild(surface, highlight);

  if (spec.role === 'chest') {
    root.addChild(new Graphics()
      .circle(0, 1.5 * scale, 5.2 * scale)
      .fill({ color: SIGNAL, alpha: 0.68 })
      .circle(0, 1.5 * scale, 8.6 * scale)
      .stroke({ color: SIGNAL, alpha: 0.18, width: 1 }));
  }
  for (const port of ports) {
    const marker = createPortMarker(port, spec, scale);
    portMarkers.set(port.id, marker);
    root.addChild(marker);
  }
  return {
    farShadow,
    height,
    highlight,
    material: MATERIALS[spec.tone],
    nearShadow,
    portMarkers,
    root,
    spec,
    width
  };
};

const updateViewLighting = (view, pose, viewport) => {
  const light = getWorldLight(pose, viewport, view.material.elevation);
  const localLight = rotatePoint(light.toward, -pose.angle);
  const offset = Math.min(view.width, view.height) * 0.12;
  view.farShadow.position.set(pose.x + light.farShadow.x, pose.y + light.farShadow.y);
  view.nearShadow.position.set(pose.x + light.nearShadow.x, pose.y + light.nearShadow.y);
  view.farShadow.rotation = pose.angle;
  view.nearShadow.rotation = pose.angle;
  view.farShadow.alpha = view.material.shadowAlpha * 0.28 * light.intensity;
  view.nearShadow.alpha = view.material.shadowAlpha * 0.62 * light.intensity;
  view.root.position.set(pose.x, pose.y);
  view.root.rotation = pose.angle;
  view.highlight.position.set(localLight.x * offset, localLight.y * offset);
  view.highlight.alpha = view.material.edgeAlpha * light.intensity;
};

const createBody = (spec, x, y, width, height) => Bodies.rectangle(x, y, width, height, {
  label: `kinetic:part:${spec.id}`,
  angle: spec.angle,
  density: spec.role === 'chest' || spec.role === 'pelvis' ? 0.0032 : 0.0024,
  friction: 0.18,
  frictionAir: 0.032,
  frictionStatic: 0.25,
  restitution: 0.28,
  sleepThreshold: 72,
  slop: 0.025,
  chamfer: {
    radius: spec.kind === 'head'
      ? Math.min(width, height) * 0.42
      : Math.min(width, height) * 0.14
  }
});

const portKey = (body, port) => `${body.id}:${port.id}`;
const easeOutCubic = (value) => 1 - Math.pow(1 - clamp(value, 0, 1), 3);
const easeInOutCubic = (value) => {
  const progress = clamp(value, 0, 1);
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

export const mountKineticSandbox = async (stage, { mode = 'full', onFailure } = {}) => {
  const canvas = stage.querySelector('[data-kinetic-canvas]');
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('The kinetic canvas is missing.');
  const initialRect = stage.getBoundingClientRect();
  if (initialRect.width < 2 || initialRect.height < 2) throw new Error('The kinetic stage has no renderable area.');

  const app = new Application();
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const resolution = Math.min(window.devicePixelRatio || 1, mode === 'full' && !coarsePointer ? 1.5 : 1);
  try {
    await app.init({
      canvas,
      width: Math.round(initialRect.width),
      height: Math.round(initialRect.height),
      preference: 'webgl',
      powerPreference: 'high-performance',
      backgroundAlpha: 0,
      antialias: mode === 'full' && !coarsePointer,
      autoDensity: true,
      resolution,
      autoStart: false,
      sharedTicker: false,
      clearBeforeRender: true
    });
  } catch (error) {
    try {
      app.destroy({ removeView: false }, { children: true });
    } catch {
      // A partially initialized Pixi application may not own a renderer yet.
    }
    throw error;
  } finally {
    // Pixi applies `touch-action: none` inline during init, including some
    // failure paths. Native vertical scrolling always wins on this canvas.
    canvas.style.touchAction = 'pan-y pinch-zoom';
  }

  const engine = Engine.create({
    enableSleeping: true,
    positionIterations: 8,
    velocityIterations: 6,
    constraintIterations: 4
  });
  engine.gravity.x = 0;
  engine.gravity.y = 0;
  engine.gravity.scale = 0;

  const bodyMeta = new Map();
  const bodyToView = new Map();
  const idToBody = new Map();
  const dynamicBodies = [];
  const poseStates = new Map();
  const occupiedPorts = new Map();
  const connections = [];
  let accumulator = 0;
  let activePointer = null;
  let celebration = null;
  let destroyed = false;
  let hasCelebrated = false;
  let height = initialRect.height;
  let running = false;
  let settledDuration = 0;
  let walls = [];
  let width = initialRect.width;

  const scale = getScale(width);
  const ambientLayer = new Container();
  const shadowLayer = new Container();
  const objectLayer = new Container();
  const effectLayer = new Container();
  const ambientGlow = new Graphics();
  const jointEffects = new Graphics();
  ambientLayer.addChild(ambientGlow);
  effectLayer.addChild(jointEffects);
  app.stage.addChild(ambientLayer, shadowLayer, objectLayer, effectLayer);

  const getTopBoundary = () => {
    const stageRect = stage.getBoundingClientRect();
    const navRect = document.querySelector('.site-nav')?.getBoundingClientRect();
    return navRect
      ? clamp(navRect.bottom - stageRect.top + 4, 0, height * 0.2)
      : 0;
  };

  const inset = coarsePointer ? 14 : width <= 1000 ? 22 : 30;
  for (const spec of PART_SPECS) {
    const bodyWidth = spec.width * scale;
    const bodyHeight = spec.height * scale;
    const topBoundary = getTopBoundary();
    const x = clamp(width * spec.x, inset + bodyWidth / 2, width - inset - bodyWidth / 2);
    const y = clamp(height * spec.y, topBoundary + inset + bodyHeight / 2, height - inset - bodyHeight / 2);
    const body = createBody(spec, x, y, bodyWidth, bodyHeight);
    const ports = spec.ports.map((port) => ({
      ...port,
      x: port.x * bodyWidth,
      y: port.y * bodyHeight
    }));
    const view = createView(spec, bodyWidth, bodyHeight, ports, scale);
    Body.setVelocity(body, { x: 0, y: 0 });
    Body.setAngularVelocity(body, 0);
    dynamicBodies.push(body);
    bodyMeta.set(body, { height: bodyHeight, ports, spec, width: bodyWidth });
    bodyToView.set(body, view);
    idToBody.set(spec.id, body);
    poseStates.set(body, {
      previous: { x: body.position.x, y: body.position.y, angle: body.angle },
      current: { x: body.position.x, y: body.position.y, angle: body.angle }
    });
    shadowLayer.addChild(view.farShadow, view.nearShadow);
    objectLayer.addChild(view.root);
  }
  Composite.add(engine.world, dynamicBodies);

  const dragConstraint = Constraint.create({
    label: 'kinetic:drag',
    pointA: { x: 0, y: 0 },
    pointB: { x: 0, y: 0 },
    bodyB: null,
    length: 0,
    stiffness: 0.18,
    damping: 0.24
  });
  Composite.add(engine.world, dragConstraint);

  const resetPoseStates = () => {
    for (const body of dynamicBodies) {
      const state = poseStates.get(body);
      if (!state) continue;
      state.previous.x = body.position.x;
      state.previous.y = body.position.y;
      state.previous.angle = body.angle;
      state.current.x = body.position.x;
      state.current.y = body.position.y;
      state.current.angle = body.angle;
    }
  };

  const getComponent = (startBody) => {
    const found = new Set([startBody]);
    const queue = [startBody];
    while (queue.length) {
      const current = queue.shift();
      for (const connection of connections) {
        const next = connection.bodyA === current
          ? connection.bodyB
          : connection.bodyB === current ? connection.bodyA : null;
        if (next && !found.has(next)) {
          found.add(next);
          queue.push(next);
        }
      }
    }
    return [...found];
  };

  const wakeComponent = (body) => {
    for (const part of getComponent(body)) Sleeping.set(part, false);
  };

  const assignCollisionGroups = () => {
    for (const body of dynamicBodies) body.collisionFilter.group = 0;
    const visited = new Set();
    for (const body of dynamicBodies) {
      if (visited.has(body)) continue;
      const component = getComponent(body);
      component.forEach((part) => visited.add(part));
      if (component.length < 2) continue;
      const group = Body.nextGroup(true);
      component.forEach((part) => {
        part.collisionFilter.group = group;
      });
    }
  };

  const syncPortMarkers = () => {
    for (const [body, view] of bodyToView) {
      const meta = bodyMeta.get(body);
      for (const port of meta.ports) {
        const marker = view.portMarkers.get(port.id);
        const occupied = occupiedPorts.has(portKey(body, port));
        marker.alpha = occupied ? 1 : 0.74;
        marker.scale.set(occupied ? 1.14 : 1);
      }
    }
  };

  const isPuzzleComplete = () => connections.length === REQUIRED_CONNECTIONS
    && getComponent(idToBody.get('chest')).length === PART_SPECS.length;

  const updatePuzzleState = () => {
    const state = isPuzzleComplete() ? 'complete' : connections.length ? 'assembling' : 'scattered';
    stage.dataset.kineticPuzzle = state;
    stage.dataset.kineticConnections = String(connections.length);
  };

  const rebuildWalls = () => {
    for (const wall of walls) Composite.remove(engine.world, wall);
    const half = WALL_THICKNESS / 2;
    const topBoundary = getTopBoundary();
    walls = [
      Bodies.rectangle(width / 2, topBoundary - half, width + WALL_THICKNESS * 2, WALL_THICKNESS, { isStatic: true, label: 'kinetic:wall-top' }),
      Bodies.rectangle(width / 2, height + half, width + WALL_THICKNESS * 2, WALL_THICKNESS, { isStatic: true, label: 'kinetic:wall-bottom' }),
      Bodies.rectangle(-half, height / 2, WALL_THICKNESS, height + WALL_THICKNESS * 2, { isStatic: true, label: 'kinetic:wall-left' }),
      Bodies.rectangle(width + half, height / 2, WALL_THICKNESS, height + WALL_THICKNESS * 2, { isStatic: true, label: 'kinetic:wall-right' })
    ];
    Composite.add(engine.world, walls);
  };

  const setStageState = (state) => {
    if (!destroyed) stage.dataset.kineticState = state;
  };

  const syncViews = (alpha = 1) => {
    for (const [body, view] of bodyToView) {
      const state = poseStates.get(body);
      const pose = state
        ? interpolatePose(state.previous, state.current, alpha)
        : { x: body.position.x, y: body.position.y, angle: body.angle };
      updateViewLighting(view, pose, { width, height });
    }
  };

  const updatePoseStatesFromBodies = () => {
    for (const body of dynamicBodies) {
      const state = poseStates.get(body);
      state.previous.x = state.current.x;
      state.previous.y = state.current.y;
      state.previous.angle = state.current.angle;
      state.current.x = body.position.x;
      state.current.y = body.position.y;
      state.current.angle = body.angle;
    }
  };

  const connectionEdge = (connection, fromBody) => connection.bodyA === fromBody
    ? { body: connection.bodyB, fromPort: connection.portA, toPort: connection.portB }
    : { body: connection.bodyA, fromPort: connection.portB, toPort: connection.portA };

  const getBranch = (parentBranch, parentBody, fromPort, childBody) => {
    if (parentBody === idToBody.get('chest') && fromPort.id === 'shoulder-left') return 'left-arm';
    if (parentBody === idToBody.get('chest') && fromPort.id === 'shoulder-right') return 'right-arm';
    if (parentBody === idToBody.get('pelvis') && fromPort.id === 'hip-left') return 'left-leg';
    if (parentBody === idToBody.get('pelvis') && fromPort.id === 'hip-right') return 'right-leg';
    if (bodyMeta.get(childBody).spec.role === 'head') return 'head';
    if (bodyMeta.get(childBody).spec.role === 'pelvis') return 'pelvis';
    return parentBranch;
  };

  const targetAngleFor = (role, branch, raised) => {
    if (role === 'chest') return -0.04;
    if (role === 'head') return 0.09;
    if (role === 'pelvis') return 0.02;
    if (role === 'upper-arm') {
      if (branch === 'left-arm') return 0.17;
      return raised ? -2.62 : -0.17;
    }
    if (role === 'forearm') {
      if (branch === 'left-arm') return -0.02;
      return raised ? -2.92 : 0.02;
    }
    if (role === 'thigh') return branch === 'left-leg' ? 0.055 : -0.055;
    if (role === 'shin') return branch === 'left-leg' ? -0.025 : 0.025;
    return 0;
  };

  const placePoseTargets = (targets) => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const [body, pose] of targets) {
      const meta = bodyMeta.get(body);
      const radius = Math.hypot(meta.width, meta.height) / 2;
      minX = Math.min(minX, pose.x - radius);
      maxX = Math.max(maxX, pose.x + radius);
      minY = Math.min(minY, pose.y - radius);
      maxY = Math.max(maxY, pose.y + radius);
    }
    const poseWidth = maxX - minX;
    const poseHeight = maxY - minY;
    const margin = width <= 720 ? 14 : 26;
    const topBoundary = getTopBoundary();
    const desiredCenterX = width - margin - poseWidth / 2;
    const desiredCenterY = width <= 820
      ? height - margin - poseHeight / 2
      : topBoundary + (height - topBoundary) * 0.55;
    const currentCenterX = (minX + maxX) / 2;
    const currentCenterY = (minY + maxY) / 2;
    const dx = clamp(desiredCenterX - currentCenterX, margin - minX, width - margin - maxX);
    const dy = clamp(
      desiredCenterY - currentCenterY,
      topBoundary + margin - minY,
      height - margin - maxY
    );
    for (const pose of targets.values()) {
      pose.x += dx;
      pose.y += dy;
    }
    return targets;
  };

  const buildCompletionTargets = (raised = false) => {
    const chest = idToBody.get('chest');
    const targets = new Map([[chest, {
      x: 0,
      y: 0,
      angle: targetAngleFor('chest', 'root', raised)
    }]]);
    const branchByBody = new Map([[chest, 'root']]);
    const queue = [chest];
    while (queue.length) {
      const parent = queue.shift();
      const parentPose = targets.get(parent);
      const parentBranch = branchByBody.get(parent);
      for (const connection of connections) {
        if (connection.bodyA !== parent && connection.bodyB !== parent) continue;
        const edge = connectionEdge(connection, parent);
        if (targets.has(edge.body)) continue;
        const branch = getBranch(parentBranch, parent, edge.fromPort, edge.body);
        const childMeta = bodyMeta.get(edge.body);
        const angle = targetAngleFor(childMeta.spec.role, branch, raised);
        const anchor = worldPort(parentPose, edge.fromPort);
        const childOffset = rotatePoint(edge.toPort, angle);
        targets.set(edge.body, {
          x: anchor.x - childOffset.x,
          y: anchor.y - childOffset.y,
          angle
        });
        branchByBody.set(edge.body, branch);
        queue.push(edge.body);
      }
    }
    return placePoseTargets(targets);
  };

  const createCelebrationParticles = () => Array.from({ length: 12 }, (_, index) => {
    const angle = -Math.PI * 0.88 + index / 11 * Math.PI * 0.76;
    const speed = 38 + (index % 4) * 9;
    const size = 2.4 + (index % 3) * 0.7;
    const graphic = new Graphics()
      .poly([0, -size, size * 0.72, 0, 0, size, -size * 0.72, 0])
      .fill({ color: [SIGNAL, INK, BOARD][index % 3], alpha: 0.92 });
    graphic.visible = false;
    effectLayer.addChild(graphic);
    return {
      graphic,
      spin: (index % 2 ? -1 : 1) * (1.7 + index * 0.07),
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed
    };
  });

  const clearEffects = () => {
    ambientGlow.clear();
    jointEffects.clear();
    if (!celebration) return;
    for (const particle of celebration.particles) particle.graphic.destroy();
  };

  const applyTargetBlend = (fromTargets, toTargets, progress) => {
    for (const body of dynamicBodies) {
      const from = fromTargets.get(body);
      const to = toTargets.get(body);
      if (!from || !to) continue;
      Body.setPosition(body, {
        x: from.x + (to.x - from.x) * progress,
        y: from.y + (to.y - from.y) * progress
      });
      Body.setAngle(body, from.angle + wrapAngle(to.angle - from.angle) * progress);
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
    }
    updatePoseStatesFromBodies();
  };

  const finishCelebration = (applyFinalPose = true) => {
    if (!celebration) return;
    if (applyFinalPose) applyTargetBlend(celebration.raisedTargets, celebration.raisedTargets, 1);
    clearEffects();
    celebration = null;
    for (const body of dynamicBodies) {
      body.constraintImpulse.x = 0;
      body.constraintImpulse.y = 0;
      body.constraintImpulse.angle = 0;
      Sleeping.set(body, true);
    }
  };

  const startCelebration = () => {
    if (hasCelebrated || celebration || !isPuzzleComplete()) return;
    hasCelebrated = true;
    const startTargets = new Map(dynamicBodies.map((body) => [body, {
      x: body.position.x,
      y: body.position.y,
      angle: body.angle
    }]));
    celebration = {
      elapsed: 0,
      neutralTargets: buildCompletionTargets(false),
      particles: createCelebrationParticles(),
      raisedTargets: buildCompletionTargets(true),
      startTargets
    };
    for (const body of dynamicBodies) {
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
      Sleeping.set(body, false);
    }
  };

  const updateCelebration = (frameDelta) => {
    celebration.elapsed += frameDelta;
    const elapsed = celebration.elapsed;
    if (elapsed <= 620) {
      applyTargetBlend(celebration.startTargets, celebration.neutralTargets, easeOutCubic(elapsed / 620));
    } else {
      applyTargetBlend(
        celebration.neutralTargets,
        celebration.raisedTargets,
        easeInOutCubic((elapsed - 620) / 520)
      );
    }

    const chest = idToBody.get('chest');
    const head = idToBody.get('head');
    const glowProgress = clamp((elapsed - 180) / 620, 0, 1);
    const fade = 1 - clamp((elapsed - 1160) / 500, 0, 1);
    ambientGlow.clear();
    if (glowProgress > 0 && fade > 0) {
      ambientGlow
        .circle(chest.position.x, chest.position.y, 36 + glowProgress * 48)
        .fill({ color: PAPER, alpha: 0.075 * fade });
    }

    jointEffects.clear();
    connections.forEach((connection, index) => {
      const pulse = clamp((elapsed - 260 - index * 48) / 260, 0, 1);
      if (pulse <= 0 || pulse >= 1) return;
      const anchor = worldPort({
        x: connection.bodyA.position.x,
        y: connection.bodyA.position.y,
        angle: connection.bodyA.angle
      }, connection.portA);
      jointEffects.circle(anchor.x, anchor.y, 4 + Math.sin(pulse * Math.PI) * 4.5).stroke({
        color: SIGNAL,
        alpha: Math.sin(pulse * Math.PI) * 0.4,
        width: 1.5
      });
    });

    const particleTime = (elapsed - 720) / 1000;
    for (const particle of celebration.particles) {
      const visible = particleTime >= 0 && particleTime <= 1;
      particle.graphic.visible = visible;
      if (!visible) continue;
      particle.graphic.position.set(
        head.position.x + particle.vx * particleTime,
        head.position.y - 12 * scale + particle.vy * particleTime + 42 * particleTime * particleTime
      );
      particle.graphic.rotation = particle.spin * particleTime;
      particle.graphic.alpha = 1 - easeOutCubic(particleTime);
    }
    if (elapsed >= CELEBRATION_DURATION) finishCelebration(true);
  };

  const stop = () => {
    if (destroyed || !running) return;
    if (activePointer) {
      dragConstraint.bodyB = null;
      dragConstraint.pointB = { x: 0, y: 0 };
      activePointer = null;
    }
    canvas.style.cursor = 'default';
    if (celebration) finishCelebration(true);
    running = false;
    app.stop();
    accumulator = 0;
    settledDuration = 0;
    resetPoseStates();
    syncViews(1);
    setStageState(dynamicBodies.every((body) => body.isSleeping) ? 'sleeping' : 'paused');
  };

  const start = () => {
    if (destroyed || running) return;
    running = true;
    accumulator = 0;
    settledDuration = 0;
    resetPoseStates();
    syncViews(1);
    setStageState('running');
    app.start();
  };

  const advancePhysics = () => {
    for (const state of poseStates.values()) {
      state.previous.x = state.current.x;
      state.previous.y = state.current.y;
      state.previous.angle = state.current.angle;
    }
    for (let index = 0; index < PHYSICS_SUBSTEPS; index += 1) {
      if (activePointer?.phase === 'dragging') {
        const response = 1 - Math.exp(-42 * (PHYSICS_SUBSTEP / 1000));
        dragConstraint.pointA.x += (activePointer.target.x - dragConstraint.pointA.x) * response;
        dragConstraint.pointA.y += (activePointer.target.y - dragConstraint.pointA.y) * response;
      }
      Engine.update(engine, PHYSICS_SUBSTEP);
      if (activePointer?.phase === 'dragging'
        && !activePointer.snappedDuringDrag
        && !activePointer.skipSnapUntilRelease) {
        activePointer.snappedDuringDrag = trySnap(activePointer.body);
      }
    }
    updatePoseStatesFromBodies();
  };

  const handleTick = (ticker) => {
    try {
      const frameDelta = clamp(ticker.deltaMS, 0, MAX_FRAME_DELTA);
      if (celebration) {
        updateCelebration(frameDelta);
        syncViews(1);
      } else {
        accumulator = Math.min(accumulator + frameDelta, MAX_CATCH_UP);
        while (accumulator >= FIXED_STEP) {
          advancePhysics();
          accumulator -= FIXED_STEP;
        }
        syncViews(accumulator / FIXED_STEP);
      }
      const settled = !celebration
        && !activePointer
        && dynamicBodies.every((body) => body.isSleeping || (body.speed < 0.035 && Math.abs(body.angularSpeed) < 0.012));
      settledDuration = settled ? settledDuration + frameDelta : 0;
      if (settledDuration >= SETTLE_DURATION) {
        dynamicBodies.forEach((body) => Sleeping.set(body, true));
        stop();
      }
    } catch (error) {
      stop();
      onFailure?.(error);
    }
  };

  app.ticker.add(handleTick);
  rebuildWalls();
  syncPortMarkers();
  updatePuzzleState();
  syncViews(1);
  app.stage.hitArea = new Rectangle(0, 0, width, height);
  app.render();
  stage.dataset.kineticLight = 'fixed-upper-left';
  stage.dataset.kineticPieceCount = String(PART_SPECS.length);
  setStageState('ready');

  const toWorldPoint = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (width / Math.max(1, rect.width)),
      y: (clientY - rect.top) * (height / Math.max(1, rect.height))
    };
  };

  const findBody = (point) => {
    const padding = coarsePointer ? 15 : 5;
    let closest = null;
    let closestScore = Infinity;
    for (let index = dynamicBodies.length - 1; index >= 0; index -= 1) {
      const body = dynamicBodies[index];
      const meta = bodyMeta.get(body);
      const pose = { x: body.position.x, y: body.position.y, angle: body.angle };
      if (!pointInRotatedRect(point, pose, meta.width, meta.height, padding)) continue;
      const exact = pointInRotatedRect(point, pose, meta.width, meta.height, 0);
      const distance = Math.hypot(point.x - body.position.x, point.y - body.position.y);
      const score = distance + (exact ? -1000 : 0);
      if (score < closestScore) {
        closest = body;
        closestScore = score;
      }
    }
    return closest;
  };

  const rotateComponent = (body, delta = ROTATION_STEP) => {
    const pivot = { ...body.position };
    for (const part of getComponent(body)) {
      const offset = rotatePoint(Vector.sub(part.position, pivot), delta);
      Body.setPosition(part, { x: pivot.x + offset.x, y: pivot.y + offset.y });
      Body.setAngle(part, part.angle + delta);
      Body.setVelocity(part, { x: 0, y: 0 });
      Body.setAngularVelocity(part, 0);
      Sleeping.set(part, false);
    }
    resetPoseStates();
  };

  const placeGrabAtPoint = (body, localPoint, point) => {
    const grabOffset = rotatePoint(localPoint, body.angle);
    const translation = {
      x: point.x - body.position.x - grabOffset.x,
      y: point.y - body.position.y - grabOffset.y
    };
    for (const part of getComponent(body)) Body.translate(part, translation);
    resetPoseStates();
  };

  const compatiblePorts = (portA, portB) => portA.family === portB.family
    && portA.polarity !== portB.polarity;

  const alignComponent = (component, movingBody, movingPort, targetBody, targetPort) => {
    const movingPose = { x: movingBody.position.x, y: movingBody.position.y, angle: movingBody.angle };
    const targetPose = { x: targetBody.position.x, y: targetBody.position.y, angle: targetBody.angle };
    const solved = solveMovingPortPose(movingPose, movingPort, targetPose, targetPort);
    const pivot = { ...movingBody.position };
    for (const body of component) {
      const offset = rotatePoint(Vector.sub(body.position, pivot), solved.deltaAngle);
      Body.setPosition(body, { x: solved.x + offset.x, y: solved.y + offset.y });
      Body.setAngle(body, body.angle + solved.deltaAngle);
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
      Sleeping.set(body, false);
    }
  };

  const trySnap = (movingRoot) => {
    const component = getComponent(movingRoot);
    const componentSet = new Set(component);
    let best = null;
    const maxDistance = (coarsePointer ? 34 : 28) * scale;
    const maxAngle = coarsePointer ? Math.PI / 6 : Math.PI / 8;
    for (const movingBody of component) {
      const movingMeta = bodyMeta.get(movingBody);
      for (const movingPort of movingMeta.ports) {
        if (occupiedPorts.has(portKey(movingBody, movingPort))) continue;
        for (const targetBody of dynamicBodies) {
          if (componentSet.has(targetBody)) continue;
          const targetMeta = bodyMeta.get(targetBody);
          for (const targetPort of targetMeta.ports) {
            if (occupiedPorts.has(portKey(targetBody, targetPort))) continue;
            if (!compatiblePorts(movingPort, targetPort)) continue;
            const result = evaluatePortSnap(
              { x: movingBody.position.x, y: movingBody.position.y, angle: movingBody.angle },
              movingPort,
              { x: targetBody.position.x, y: targetBody.position.y, angle: targetBody.angle },
              targetPort,
              { maxDistance, maxAngle }
            );
            if (!result.eligible) continue;
            const score = result.distance + result.angleError * 16;
            if (!best || score < best.score) {
              best = { movingBody, movingPort, score, targetBody, targetPort };
            }
          }
        }
      }
    }
    if (!best) return false;

    alignComponent(component, best.movingBody, best.movingPort, best.targetBody, best.targetPort);
    const constraint = Constraint.create({
      label: `kinetic:joint:${best.movingPort.family}`,
      bodyA: best.movingBody,
      pointA: rotatePoint(best.movingPort, best.movingBody.angle),
      bodyB: best.targetBody,
      pointB: rotatePoint(best.targetPort, best.targetBody.angle),
      length: 0,
      stiffness: 0.68,
      damping: 0.16
    });
    const connection = {
      bodyA: best.movingBody,
      bodyB: best.targetBody,
      constraint,
      portA: best.movingPort,
      portB: best.targetPort
    };
    connections.push(connection);
    occupiedPorts.set(portKey(best.movingBody, best.movingPort), connection);
    occupiedPorts.set(portKey(best.targetBody, best.targetPort), connection);
    Composite.add(engine.world, constraint);
    assignCollisionGroups();
    syncPortMarkers();
    updatePuzzleState();
    resetPoseStates();
    if (isPuzzleComplete()) startCelebration();
    return true;
  };

  const removeConnection = (connection) => {
    const index = connections.indexOf(connection);
    if (index < 0) return;
    Composite.remove(engine.world, connection.constraint);
    connections.splice(index, 1);
    occupiedPorts.delete(portKey(connection.bodyA, connection.portA));
    occupiedPorts.delete(portKey(connection.bodyB, connection.portB));
    assignCollisionGroups();
    syncPortMarkers();
    updatePuzzleState();
  };

  const getBreakCandidate = (body, localPoint) => {
    const meta = bodyMeta.get(body);
    const maximum = (coarsePointer ? 18 : 12) * scale;
    let best = null;
    for (const port of meta.ports) {
      const connection = occupiedPorts.get(portKey(body, port));
      if (!connection) continue;
      const distance = Math.hypot(localPoint.x - port.x, localPoint.y - port.y);
      if (distance <= maximum && (!best || distance < best.distance)) {
        const otherBody = connection.bodyA === body ? connection.bodyB : connection.bodyA;
        const separation = Vector.sub(body.position, otherBody.position);
        const magnitude = Vector.magnitude(separation);
        best = {
          connection,
          direction: magnitude > 0.001
            ? Vector.mult(separation, 1 / magnitude)
            : rotatePoint({ x: 0, y: -1 }, body.angle),
          distance
        };
      }
    }
    return best;
  };

  const beginDrag = (pointer, point) => {
    pointer.phase = 'dragging';
    pointer.target = { ...point };
    dragConstraint.bodyB = pointer.body;
    dragConstraint.angleB = pointer.body.angle;
    dragConstraint.pointA = { ...point };
    dragConstraint.pointB = rotatePoint(pointer.localPoint, pointer.body.angle);
    wakeComponent(pointer.body);
    canvas.style.cursor = 'grabbing';
    start();
  };

  const releasePointer = (event, applyGesture = true) => {
    if (!activePointer || event.pointerId !== activePointer.id) return;
    const pointer = activePointer;
    const body = pointer.body;
    const point = toWorldPoint(event.clientX, event.clientY);
    const travel = Math.hypot(point.x - pointer.start.x, point.y - pointer.start.y);
    pointer.samples.push({ ...point, time: performance.now() });
    dragConstraint.bodyB = null;
    dragConstraint.pointB = { x: 0, y: 0 };
    activePointer = null;
    canvas.style.cursor = 'default';
    if (!applyGesture || pointer.phase === 'scrolling') return;

    if (pointer.phase === 'dragging' && travel >= 7) {
      placeGrabAtPoint(body, pointer.localPoint, point);
    }

    let snapped = false;
    if (pointer.phase === 'pending' || travel < 7) {
      rotateComponent(body);
      snapped = trySnap(body);
    } else if (pointer.phase === 'dragging') {
      snapped = pointer.snappedDuringDrag
        || (!pointer.skipSnapUntilRelease && trySnap(body));
      if (!snapped) {
        const velocity = smoothThrowVelocity(pointer.samples, body.velocity, {
          fixedStep: FIXED_STEP,
          maxSpeed: MAX_THROW_SPEED,
          windowMs: 100,
          pointerWeight: 0.8
        });
        const torque = pointer.localPoint.x * velocity.y - pointer.localPoint.y * velocity.x;
        for (const part of getComponent(body)) {
          Body.setVelocity(part, velocity);
          Body.setAngularVelocity(part, clamp(torque * 0.00062, -0.11, 0.11));
          Sleeping.set(part, false);
        }
      }
    }
    if (snapped) wakeComponent(body);
    start();
  };

  const handlePointerDown = (event) => {
    if (destroyed || activePointer || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const point = toWorldPoint(event.clientX, event.clientY);
    const body = findBody(point);
    if (!body) return;
    if (celebration) finishCelebration(false);

    const localPoint = rotatePoint(Vector.sub(point, body.position), -body.angle);
    activePointer = {
      body,
      breakCandidate: getBreakCandidate(body, localPoint),
      id: event.pointerId,
      localPoint,
      phase: event.pointerType === 'touch' ? 'pending' : 'dragging',
      pointerType: event.pointerType,
      samples: [{ ...point, time: performance.now() }],
      skipSnapUntilRelease: false,
      snappedDuringDrag: false,
      start: point,
      target: { ...point }
    };
    if (event.pointerType !== 'touch') beginDrag(activePointer, point);
  };

  const handlePointerMove = (event) => {
    const point = toWorldPoint(event.clientX, event.clientY);
    if (!activePointer) {
      if (event.pointerType !== 'touch') canvas.style.cursor = findBody(point) ? 'grab' : 'default';
      return;
    }
    if (event.pointerId !== activePointer.id) return;

    const dx = point.x - activePointer.start.x;
    const dy = point.y - activePointer.start.y;
    const travel = Math.hypot(dx, dy);
    if (activePointer.phase === 'pending' && travel >= 8) {
      if (Math.abs(dy) > Math.abs(dx) * 1.08) activePointer.phase = 'scrolling';
      else beginDrag(activePointer, point);
    }
    if (activePointer.phase !== 'dragging') return;

    activePointer.target.x = point.x;
    activePointer.target.y = point.y;
    const breakCandidate = activePointer.breakCandidate;
    const outwardTravel = breakCandidate
      ? dx * breakCandidate.direction.x + dy * breakCandidate.direction.y
      : 0;
    const crossTravel = breakCandidate
      ? Math.abs(dx * breakCandidate.direction.y - dy * breakCandidate.direction.x)
      : Infinity;
    if (breakCandidate
      && outwardTravel >= 34 * scale
      && outwardTravel >= crossTravel * 0.72) {
      removeConnection(breakCandidate.connection);
      activePointer.breakCandidate = null;
      activePointer.skipSnapUntilRelease = true;
      wakeComponent(activePointer.body);
    }
    const now = performance.now();
    activePointer.samples.push({ ...point, time: now });
    activePointer.samples = activePointer.samples
      .filter((sample) => now - sample.time <= 120)
      .slice(-24);
  };

  const handlePointerUp = (event) => releasePointer(event, true);
  const handlePointerCancel = (event) => releasePointer(event, false);
  const handlePointerLeave = () => {
    if (!activePointer) canvas.style.cursor = 'default';
  };

  canvas.addEventListener('pointerdown', handlePointerDown, { passive: true });
  canvas.addEventListener('pointerleave', handlePointerLeave, { passive: true });
  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerup', handlePointerUp, { passive: true });
  window.addEventListener('pointercancel', handlePointerCancel, { passive: true });

  const fitComponentInsideViewport = (component) => {
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const body of component) {
      minX = Math.min(minX, body.bounds.min.x);
      minY = Math.min(minY, body.bounds.min.y);
      maxX = Math.max(maxX, body.bounds.max.x);
      maxY = Math.max(maxY, body.bounds.max.y);
    }
    const fitInset = 8;
    const top = getTopBoundary() + fitInset;
    const right = width - fitInset;
    const bottom = height - fitInset;
    const availableWidth = right - fitInset;
    const availableHeight = bottom - top;
    let dx = 0;
    let dy = 0;
    if (maxX - minX > availableWidth) dx = width / 2 - (minX + maxX) / 2;
    else if (minX < fitInset) dx = fitInset - minX;
    else if (maxX > right) dx = right - maxX;
    if (maxY - minY > availableHeight) dy = top + availableHeight / 2 - (minY + maxY) / 2;
    else if (minY < top) dy = top - minY;
    else if (maxY > bottom) dy = bottom - maxY;
    if (!dx && !dy) return;
    for (const body of component) Body.translate(body, { x: dx, y: dy });
  };

  const resize = () => {
    if (destroyed) return;
    const rect = stage.getBoundingClientRect();
    const nextWidth = Math.max(2, Math.round(rect.width));
    const nextHeight = Math.max(2, Math.round(rect.height));
    if (nextWidth === Math.round(width) && nextHeight === Math.round(height)) return;

    if (activePointer) {
      dragConstraint.bodyB = null;
      dragConstraint.pointB = { x: 0, y: 0 };
      activePointer = null;
    }
    canvas.style.cursor = 'default';
    if (celebration) finishCelebration(true);
    width = nextWidth;
    height = nextHeight;
    app.renderer.resize(width, height, resolution);
    app.stage.hitArea = new Rectangle(0, 0, width, height);
    rebuildWalls();

    const visited = new Set();
    for (const body of dynamicBodies) {
      if (visited.has(body)) continue;
      const component = getComponent(body);
      component.forEach((part) => visited.add(part));
      fitComponentInsideViewport(component);
    }
    resetPoseStates();
    syncViews(1);
    app.render();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);

  const handleContextLost = (event) => {
    event.preventDefault();
    stop();
    setStageState('static');
  };

  const handleContextRestored = () => {
    if (!destroyed) stage.dispatchEvent(new CustomEvent('kinetic:recover'));
  };
  canvas.addEventListener('webglcontextlost', handleContextLost);
  canvas.addEventListener('webglcontextrestored', handleContextRestored);

  const nudgeAt = (clientX, clientY) => {
    if (destroyed) return;
    const point = toWorldPoint(clientX, clientY);
    let body = findBody(point);
    if (!body) {
      body = dynamicBodies.reduce((closest, candidate) => {
        if (!closest) return candidate;
        return Vector.magnitudeSquared(Vector.sub(point, candidate.position))
          < Vector.magnitudeSquared(Vector.sub(point, closest.position)) ? candidate : closest;
      }, null);
    }
    if (!body) return;

    const direction = Vector.normalise(Vector.sub(body.position, point));
    const safeDirection = Number.isFinite(direction.x) ? direction : { x: 0.7, y: -0.7 };
    for (const part of getComponent(body)) {
      Sleeping.set(part, false);
      Body.setVelocity(part, {
        x: clamp(safeDirection.x * 3 + (point.x < width / 2 ? 0.8 : -0.8), -4.6, 4.6),
        y: clamp(safeDirection.y * 3 - 0.8, -4.6, 4.6)
      });
      Body.setAngularVelocity(part, point.x < body.position.x ? 0.035 : -0.035);
    }
    start();
  };

  return {
    nudgeAt,
    resize,
    start,
    stop,
    destroy() {
      if (destroyed) return;
      stop();
      destroyed = true;
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      app.ticker.remove(handleTick);
      dragConstraint.bodyB = null;
      if (celebration) finishCelebration(false);
      Composite.clear(engine.world, false, true);
      Engine.clear(engine);
      bodyMeta.clear();
      bodyToView.clear();
      idToBody.clear();
      occupiedPorts.clear();
      connections.length = 0;
      poseStates.clear();
      dynamicBodies.length = 0;
      app.destroy({ removeView: false }, { children: true });
      canvas.style.removeProperty('cursor');
      canvas.style.removeProperty('touch-action');
      delete stage.dataset.kineticConnections;
      delete stage.dataset.kineticLight;
      delete stage.dataset.kineticPieceCount;
      delete stage.dataset.kineticPuzzle;
      stage.dataset.kineticState = 'static';
    }
  };
};
