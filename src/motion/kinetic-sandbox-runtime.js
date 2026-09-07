import { animate } from 'animejs';
import { ROBOT_GEOMETRY, localRobotPort } from './robot-kit.js';
import { Application, Assets, Container, Graphics, Rectangle, Sprite } from 'pixi.js';
import Matter from 'matter-js';
import chestAssetUrl from '../assets/kinetic-robot/chest.svg?url';
import forearmAssetUrl from '../assets/kinetic-robot/forearm.svg?url';
import headAssetUrl from '../assets/kinetic-robot/head.svg?url';
import pelvisAssetUrl from '../assets/kinetic-robot/pelvis.svg?url';
import shinAssetUrl from '../assets/kinetic-robot/shin.svg?url';
import thighAssetUrl from '../assets/kinetic-robot/thigh.svg?url';
import upperArmAssetUrl from '../assets/kinetic-robot/upper-arm.svg?url';
import {
  alignPosePositionToPort,
  calculateJointServo,
  clamp,
  evaluatePortSnap,
  getWorldLight,
  interpolatePose,
  limitRelativeAngularVelocity,
  pointInRotatedRect,
  projectJointLimit,
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
const DETENT_STEP = Math.PI / 12;
const POSE_JOINT_PRIORITIES = Object.freeze({
  head: Object.freeze(['neck']),
  chest: Object.freeze([]),
  pelvis: Object.freeze(['waist', 'hip']),
  'upper-arm': Object.freeze(['shoulder', 'elbow']),
  forearm: Object.freeze(['elbow']),
  thigh: Object.freeze(['hip', 'knee']),
  shin: Object.freeze(['knee'])
});
const POSE_GRIP_DIRECTION = Object.freeze({
  head: -1,
  pelvis: 1,
  'upper-arm': 1,
  forearm: 1,
  thigh: 1,
  shin: 1
});

const ROBOT_TEXTURE_ALIASES = Object.freeze({
  head: 'kinetic-robot/head',
  chest: 'kinetic-robot/chest',
  pelvis: 'kinetic-robot/pelvis',
  'upper-arm': 'kinetic-robot/upper-arm',
  forearm: 'kinetic-robot/forearm',
  thigh: 'kinetic-robot/thigh',
  shin: 'kinetic-robot/shin'
});

const ROBOT_ASSETS = Object.freeze([
  ['head', headAssetUrl], ['chest', chestAssetUrl], ['pelvis', pelvisAssetUrl],
  ['upper-arm', upperArmAssetUrl], ['forearm', forearmAssetUrl],
  ['thigh', thighAssetUrl], ['shin', shinAssetUrl]
].map(([asset, src]) => ({
  alias: ROBOT_TEXTURE_ALIASES[asset], src,
  data: { width: ROBOT_GEOMETRY[asset].width, height: ROBOT_GEOMETRY[asset].height, resolution: 3, parseAsGraphicsContext: false }
})));

let robotTexturesPromise;
const loadRobotTextures = () => {
  if (!robotTexturesPromise) {
    robotTexturesPromise = Assets.load(ROBOT_ASSETS).catch((error) => {
      robotTexturesPromise = null;
      throw error;
    });
  }
  return robotTexturesPromise;
};

const JOINT_SERVO_PROFILES = Object.freeze({
  neck: { softLimit: 0.24, centerStrength: 0.012, dragHoldStrength: 0.026, limitStrength: 0.038, damping: 0.24, maxCorrection: 0.016, maxRelativeVelocity: 0.05 },
  waist: { softLimit: 0.18, centerStrength: 0.013, dragHoldStrength: 0.028, limitStrength: 0.04, damping: 0.26, maxCorrection: 0.017, maxRelativeVelocity: 0.045 },
  shoulder: { softLimit: 1.05, centerStrength: 0.0045, dragHoldStrength: 0.011, limitStrength: 0.026, damping: 0.19, maxCorrection: 0.018, maxRelativeVelocity: 0.07 },
  elbow: { softLimit: 1.22, centerStrength: 0.005, dragHoldStrength: 0.012, limitStrength: 0.03, damping: 0.21, maxCorrection: 0.019, maxRelativeVelocity: 0.075 },
  hip: { softLimit: 0.66, centerStrength: 0.0055, dragHoldStrength: 0.013, limitStrength: 0.032, damping: 0.21, maxCorrection: 0.019, maxRelativeVelocity: 0.065 },
  knee: { softLimit: 0.96, centerStrength: 0.0055, dragHoldStrength: 0.013, limitStrength: 0.032, damping: 0.22, maxCorrection: 0.019, maxRelativeVelocity: 0.07 }
});

const PART_SPECS = [
  { id: 'head', asset: 'head', x: 0.1, y: 0.22, angle: Math.PI / 3 },
  { id: 'chest', asset: 'chest', x: 0.82, y: 0.22, angle: -Math.PI / 6 },
  { id: 'pelvis', asset: 'pelvis', x: 0.91, y: 0.42, angle: Math.PI / 6 },
  { id: 'upper-arm-a', asset: 'upper-arm', x: 0.07, y: 0.49, angle: -Math.PI / 3 },
  { id: 'upper-arm-b', asset: 'upper-arm', x: 0.86, y: 0.61, angle: Math.PI * 2 / 3 },
  { id: 'forearm-a', asset: 'forearm', x: 0.2, y: 0.65, angle: Math.PI / 6 },
  { id: 'forearm-b', asset: 'forearm', x: 0.68, y: 0.83, angle: -Math.PI * 2 / 3 },
  { id: 'thigh-a', asset: 'thigh', x: 0.1, y: 0.82, angle: Math.PI / 3 },
  { id: 'thigh-b', asset: 'thigh', x: 0.57, y: 0.21, angle: -Math.PI / 6 },
  { id: 'shin-a', asset: 'shin', x: 0.34, y: 0.86, angle: Math.PI * 2 / 3 },
  { id: 'shin-b', asset: 'shin', x: 0.91, y: 0.79, angle: -Math.PI / 3 }
].map((spec) => ({ ...spec, ...ROBOT_GEOMETRY[spec.asset], role: spec.asset, kind: spec.asset }));

const COMPACT_SCATTER = {
  head: [0.16, 0.19], chest: [0.78, 0.21], pelvis: [0.53, 0.33],
  'upper-arm-a': [0.17, 0.34], 'upper-arm-b': [0.83, 0.34],
  'forearm-a': [0.16, 0.77], 'forearm-b': [0.67, 0.90],
  'thigh-a': [0.22, 0.90], 'thigh-b': [0.44, 0.17],
  'shin-a': [0.50, 0.78], 'shin-b': [0.84, 0.77]
};
const TABLET_SCATTER = {
  pelvis: [0.91, 0.35], 'upper-arm-b': [0.86, 0.72],
  'forearm-a': [0.20, 0.72], 'thigh-b': [0.47, 0.21]
};

const ROBOT_MATERIAL = { elevation: 6, shadowAlpha: 0.14 };

const getScale = (width) => clamp(1.55 + (width - 390) * (0.45 / 890), 1.5, 2.06);
const createArtwork = (texture, width, height) => {
  const artwork = new Sprite(texture);
  artwork.anchor.set(0.5);
  artwork.scale.set(width / texture.width, height / texture.height);
  return artwork;
};

// Artwork owns the bearings. These rings exist only as contextual interaction feedback.
const createPortMarker = (port, scale) => {
  const marker = new Graphics()
    .circle(0, 0, 6 * scale)
    .stroke({ color: SIGNAL, alpha: 0.86, width: 1.05 * scale });
  marker.position.set(port.x, port.y);
  marker.alpha = 0;
  return marker;
};

const createView = (spec, width, height, ports, scale, texture) => {
  const root = new Container();
  // The same alpha silhouette preserves the open rails and gripper gaps in every layer.
  const farShadow = createArtwork(texture, width, height);
  const nearShadow = createArtwork(texture, width, height);
  const artwork = createArtwork(texture, width, height);
  farShadow.tint = SHADOW;
  nearShadow.tint = SHADOW;
  const portMarkers = new Map();
  farShadow.alpha = 0;
  nearShadow.alpha = 0;
  root.addChild(artwork);
  for (const port of ports) {
    const marker = createPortMarker(port, scale);
    portMarkers.set(port.id, marker);
    root.addChild(marker);
  }
  return { farShadow, height, material: ROBOT_MATERIAL, nearShadow, portMarkers, root, spec, width };
};

const updateViewLighting = (view, pose, viewport) => {
  const light = getWorldLight(pose, viewport, view.material.elevation);
  view.farShadow.position.set(pose.x + light.farShadow.x, pose.y + light.farShadow.y);
  view.nearShadow.position.set(pose.x + light.nearShadow.x, pose.y + light.nearShadow.y);
  view.farShadow.rotation = pose.angle;
  view.nearShadow.rotation = pose.angle;
  view.farShadow.alpha = view.material.shadowAlpha * 0.28 * light.intensity;
  view.nearShadow.alpha = view.material.shadowAlpha * 0.62 * light.intensity;
  view.root.position.set(pose.x, pose.y);
  view.root.rotation = pose.angle;
};

const createBody = (spec, x, y, width, height, scale) => Bodies.rectangle(x, y, width, height, {
  label: `kinetic:part:${spec.id}`,
  angle: spec.angle,
  density: (spec.role === 'chest' || spec.role === 'pelvis' ? 0.0032 : 0.0024) / (scale * scale),
  friction: 0.18,
  frictionAir: 0.032,
  frictionStatic: 0.25,
  restitution: 0.28,
  sleepThreshold: 72,
  slop: 0.025,
  chamfer: {
    radius: Math.min(width, height) * 0.14,
    quality: 4
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
  let coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  let resolution = Math.min(window.devicePixelRatio || 1, mode === 'full' && !coarsePointer ? 1.5 : 1);
  let robotTextures;
  try {
    robotTextures = await loadRobotTextures();
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
    // This scene owns pointer input natively; detach Pixi's document-level
    // hit-testing listeners and system event ticker after renderer setup.
    app.renderer.events?.setTargetElement(null);
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
  let hasInteracted = false;

  let scale = getScale(width);
  let interactionScale = clamp(scale, 1, 1.4);
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

  const getInitialPose = (spec) => {
    const inset = coarsePointer ? 14 : width <= 1000 ? 22 : 30;
    const [scatterX, scatterY] = (width <= 720 ? COMPACT_SCATTER : width <= 1000 ? TABLET_SCATTER : {})[spec.id]
      ?? [spec.x, spec.y];
    const bodyWidth = spec.width * scale;
    const bodyHeight = spec.height * scale;
    const rotatedHalfWidth = (
      Math.abs(Math.cos(spec.angle)) * bodyWidth
      + Math.abs(Math.sin(spec.angle)) * bodyHeight
    ) / 2;
    const rotatedHalfHeight = (
      Math.abs(Math.sin(spec.angle)) * bodyWidth
      + Math.abs(Math.cos(spec.angle)) * bodyHeight
    ) / 2;
    const edgeSafety = 8;
    const topBoundary = getTopBoundary();
    const x = clamp(
      width * scatterX,
      inset + edgeSafety + rotatedHalfWidth,
      width - inset - edgeSafety - rotatedHalfWidth
    );
    const y = clamp(
      height * scatterY,
      topBoundary + inset + edgeSafety + rotatedHalfHeight,
      height - inset - edgeSafety - rotatedHalfHeight
    );
    return { x, y, angle: spec.angle };
  };

  for (const spec of PART_SPECS) {
    const bodyWidth = spec.width * scale;
    const bodyHeight = spec.height * scale;
    const { x, y } = getInitialPose(spec);
    const body = createBody(spec, x, y, bodyWidth, bodyHeight, scale);
    const ports = spec.ports.map((port) => localRobotPort(spec, port, scale));
    const texture = robotTextures[ROBOT_TEXTURE_ALIASES[spec.asset]];
    if (!texture) throw new Error(`The ${spec.asset} robot artwork failed to load.`);
    const view = createView(spec, bodyWidth, bodyHeight, ports, scale, texture);
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
    stiffness: 0.3,
    damping: 0.34,
    angularStiffness: 0.88
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

  const getComponent = (startBody, excludedConnection = null) => {
    const found = new Set([startBody]);
    const queue = [startBody];
    while (queue.length) {
      const current = queue.shift();
      for (const connection of connections) {
        if (connection === excludedConnection) continue;
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

  const getConnectionPort = (connection, body) => connection.bodyA === body
    ? connection.portA
    : connection.portB;

  const getPortAnchor = (body, port) => worldPort({
    x: body.position.x,
    y: body.position.y,
    angle: body.angle
  }, port);

  const rotateChildBranch = (connection, rotation) => {
    const joint = connection.angular;
    const childBranch = getComponent(joint.plugBody, connection);
    if (childBranch.includes(joint.socketBody)) return null;
    const socketPort = getConnectionPort(connection, joint.socketBody);
    const plugPort = getConnectionPort(connection, joint.plugBody);
    const socketAnchor = getPortAnchor(joint.socketBody, socketPort);
    for (const body of childBranch) {
      const offset = rotatePoint(Vector.sub(body.position, socketAnchor), rotation);
      Body.setPosition(body, {
        x: socketAnchor.x + offset.x,
        y: socketAnchor.y + offset.y
      });
      Body.setAngle(body, body.angle + rotation);
    }
    const plugAnchor = getPortAnchor(joint.plugBody, plugPort);
    const anchorCorrection = Vector.sub(socketAnchor, plugAnchor);
    for (const body of childBranch) Body.translate(body, anchorCorrection);
    return childBranch;
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

  let hintedMarkers = new Set();
  const hintAnimations = new Map();
  const renderHints = () => { if (!destroyed && !running) app.render(); };
  const setPortHints = (entries = [], intent = 'none', immediate = false) => {
    const next = new Set(entries.map(([body, port]) => bodyToView.get(body)?.portMarkers.get(port.id)).filter(Boolean));
    if (stage.dataset.kineticIntent !== intent) stage.dataset.kineticIntent = intent;
    for (const marker of new Set([...hintedMarkers, ...next])) {
      if (!immediate && hintedMarkers.has(marker) === next.has(marker)) continue;
      hintAnimations.get(marker)?.cancel();
      hintAnimations.delete(marker);
      const alpha = next.has(marker) ? 1 : 0;
      if (immediate) marker.alpha = alpha;
      else hintAnimations.set(marker, animate(marker, {
        alpha, duration: 140, ease: 'outQuad', onUpdate: renderHints,
        onComplete: () => hintAnimations.delete(marker)
      }));
    }
    hintedMarkers = next;
    if (immediate) {
      for (const [marker, animation] of hintAnimations) { animation.cancel(); marker.alpha = 0; }
      hintAnimations.clear();
      renderHints();
    }
  };
  const syncPortMarkers = () => setPortHints([], 'none', true);

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
    const root = idToBody.get('chest');
    const visited = new Set(root ? [root] : []);
    const queue = root ? [root] : [];
    while (queue.length) {
      const parent = queue.shift();
      for (const connection of connections) {
        if (connection.bodyA !== parent && connection.bodyB !== parent) continue;
        const edge = connectionEdge(connection, parent);
        if (visited.has(edge.body)) continue;
        const aligned = alignPosePositionToPort(
          { x: edge.body.position.x, y: edge.body.position.y, angle: edge.body.angle },
          edge.toPort,
          { x: parent.position.x, y: parent.position.y, angle: parent.angle },
          edge.fromPort
        );
        Body.setPosition(edge.body, aligned);
        visited.add(edge.body);
        queue.push(edge.body);
      }
    }
    updatePoseStatesFromBodies();
  };

  const rebaseJointAngles = () => {
    for (const connection of connections) {
      const joint = connection.angular;
      if (!joint) continue;
      joint.baseAngle = wrapAngle(joint.plugBody.angle - joint.socketBody.angle);
      joint.poseAngle = joint.baseAngle;
    }
  };

  const finishCelebration = (applyFinalPose = true) => {
    if (!celebration) return;
    if (applyFinalPose) applyTargetBlend(celebration.raisedTargets, celebration.raisedTargets, 1);
    rebaseJointAngles();
    clearEffects();
    celebration = null;
    settledDuration = SETTLE_DURATION;
    for (const body of dynamicBodies) {
      body.constraintImpulse.x = 0;
      body.constraintImpulse.y = 0;
      body.constraintImpulse.angle = 0;
      body.positionImpulse.x = 0;
      body.positionImpulse.y = 0;
      Sleeping.set(body, true);
    }
  };

  const startCelebration = () => {
    if (hasCelebrated || celebration || activePointer || !isPuzzleComplete()) return;
    setPortHints([], 'none', true);
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
    if (destroyed) return;
    setPortHints([], 'none', true);
    if (!running) return;
    if (activePointer) {
      dragConstraint.bodyB = null;
      dragConstraint.pointB = { x: 0, y: 0 };
      dragConstraint.angularStiffness = 0.88;
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
    app.render();
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

  const applyJointServos = () => {
    const draggedComponent = activePointer?.phase === 'dragging'
      ? new Set(getComponent(activePointer.body))
      : null;
    for (const connection of connections) {
      const joint = connection.angular;
      if (!joint || (joint.socketBody.isSleeping && joint.plugBody.isSleeping)) continue;
      const profile = JOINT_SERVO_PROFILES[joint.family];
      if (!profile) continue;
      const relativeVelocity = joint.plugBody.angularVelocity - joint.socketBody.angularVelocity;
      const movingTogether = draggedComponent?.has(joint.socketBody)
        && draggedComponent.has(joint.plugBody);
      const isFlexible = movingTogether && activePointer?.flexConnection === connection;
      const heldAngle = movingTogether ? activePointer?.jointHolds?.get(connection) : undefined;
      const result = calculateJointServo({
        parentAngle: joint.socketBody.angle,
        childAngle: joint.plugBody.angle,
        centerAngle: heldAngle ?? joint.poseAngle,
        limitAngle: joint.baseAngle,
        relativeVelocity,
        ...profile,
        centerStrength: movingTogether
          ? isFlexible ? profile.centerStrength * 0.35 : profile.dragHoldStrength
          : profile.centerStrength
      });
      if (Math.abs(result.excess) < 0.0001
        && Math.abs(result.error) < 0.025
        && Math.abs(relativeVelocity) < 0.004) continue;
      const needsVelocityLimit = Math.abs(relativeVelocity) > profile.maxRelativeVelocity;
      if (Math.abs(result.correction) < 0.00001 && !needsVelocityLimit) continue;

      const inverseSocket = joint.socketBody.inverseInertia;
      const inversePlug = joint.plugBody.inverseInertia;
      const inverseTotal = inverseSocket + inversePlug;
      if (inverseTotal <= 0) continue;
      Sleeping.set(joint.socketBody, false);
      Sleeping.set(joint.plugBody, false);
      const limitedVelocity = limitRelativeAngularVelocity({
        socketVelocity: joint.socketBody.angularVelocity
          + result.correction * inverseSocket / inverseTotal,
        plugVelocity: joint.plugBody.angularVelocity
          - result.correction * inversePlug / inverseTotal,
        inverseSocket,
        inversePlug,
        maxRelativeVelocity: profile.maxRelativeVelocity
      });
      Body.setAngularVelocity(joint.socketBody, limitedVelocity.socketVelocity);
      Body.setAngularVelocity(joint.plugBody, limitedVelocity.plugVelocity);
    }
  };

  const projectJointLimits = () => {
    for (const connection of connections) {
      const joint = connection.angular;
      const profile = joint && JOINT_SERVO_PROFILES[joint.family];
      if (!joint || !profile) continue;
      const projection = projectJointLimit({
        parentAngle: joint.socketBody.angle,
        childAngle: joint.plugBody.angle,
        limitAngle: joint.baseAngle,
        softLimit: profile.softLimit,
        inverseParent: 0,
        inverseChild: 1
      });
      if (!projection.projected) continue;

      const childBranch = rotateChildBranch(connection, -projection.correction);
      if (!childBranch) continue;

      const relativeVelocity = joint.plugBody.angularVelocity - joint.socketBody.angularVelocity;
      if (projection.limitError * relativeVelocity > 0) {
        const angularDelta = joint.socketBody.angularVelocity - joint.plugBody.angularVelocity;
        for (const body of childBranch) {
          Body.setAngularVelocity(body, body.angularVelocity + angularDelta);
        }
      }

    }
  };

  const jointServosSettled = () => connections.every((connection) => {
    const joint = connection.angular;
    const profile = joint && JOINT_SERVO_PROFILES[joint.family];
    if (!joint || !profile) return true;
    const error = Math.abs(wrapAngle(
      joint.plugBody.angle - joint.socketBody.angle - joint.poseAngle
    ));
    const limitError = Math.abs(wrapAngle(
      joint.plugBody.angle - joint.socketBody.angle - joint.baseAngle
    ));
    const relativeVelocity = Math.abs(
      joint.plugBody.angularVelocity - joint.socketBody.angularVelocity
    );
    return error <= 0.055
      && limitError <= profile.softLimit + 0.02
      && relativeVelocity < 0.008;
  });

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
      applyJointServos();
      Engine.update(engine, PHYSICS_SUBSTEP);
      projectJointLimits();
      if (activePointer?.phase === 'dragging'
        && !activePointer.snappedDuringDrag
        && !activePointer.skipSnapUntilRelease) {
        activePointer.snappedDuringDrag = trySnap(activePointer.body);
      }
    }
    updateDragHints();
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
        && jointServosSettled()
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

  const findSnapCandidate = (movingRoot, maxDistance, maxAngle) => {
    const component = getComponent(movingRoot);
    const componentSet = new Set(component);
    let best = null;
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
    return best;
  };

  const updateDragHints = () => {
    if (!activePointer) return;
    if (activePointer.phase !== 'dragging' || celebration
      || activePointer.skipSnapUntilRelease || activePointer.snappedDuringDrag) {
      setPortHints();
      return;
    }
    if (activePointer.flexConnection) {
      const joint = activePointer.flexConnection.angular;
      setPortHints([[joint.plugBody, getConnectionPort(activePointer.flexConnection, joint.plugBody)]], 'pose');
      return;
    }
    const best = findSnapCandidate(activePointer.body,
      (coarsePointer ? 58 : 52) * interactionScale, coarsePointer ? Math.PI / 6 : Math.PI / 8);
    setPortHints(best ? [[best.movingBody, best.movingPort], [best.targetBody, best.targetPort]] : [], best ? 'connect' : 'move');
  };

  const trySnap = (movingRoot) => {
    const best = findSnapCandidate(movingRoot, (coarsePointer ? 34 : 30) * interactionScale,
      coarsePointer ? Math.PI / 6 : Math.PI / 8);
    if (!best) return false;
    const component = getComponent(movingRoot);

    alignComponent(component, best.movingBody, best.movingPort, best.targetBody, best.targetPort);
    const constraint = Constraint.create({
      label: `kinetic:joint:${best.movingPort.family}`,
      bodyA: best.movingBody,
      pointA: rotatePoint(best.movingPort, best.movingBody.angle),
      bodyB: best.targetBody,
      pointB: rotatePoint(best.targetPort, best.targetBody.angle),
      length: 0,
      stiffness: 0.84,
      damping: 0.24
    });
    const baseAngle = wrapAngle(
      (best.movingPort.polarity === PORT.PLUG ? best.movingBody : best.targetBody).angle
        - (best.movingPort.polarity === PORT.SOCKET ? best.movingBody : best.targetBody).angle
    );
    const connection = {
      angular: {
        baseAngle,
        family: best.movingPort.family,
        poseAngle: baseAngle,
        plugBody: best.movingPort.polarity === PORT.PLUG ? best.movingBody : best.targetBody,
        socketBody: best.movingPort.polarity === PORT.SOCKET ? best.movingBody : best.targetBody
      },
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
    const maximum = (coarsePointer ? 18 : 12) * interactionScale;
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

  const getFlexConnection = (body, localPoint) => {
    const meta = bodyMeta.get(body);
    const gripDirection = POSE_GRIP_DIRECTION[meta.spec.role];
    if (!gripDirection || localPoint.y * gripDirection < meta.height * 0.12) return null;
    const priorities = POSE_JOINT_PRIORITIES[meta.spec.role] ?? [];
    for (const family of priorities) {
      for (const port of meta.ports) {
        if (port.family !== family) continue;
        const connection = occupiedPorts.get(portKey(body, port));
        if (connection?.angular?.plugBody === body) return connection;
      }
    }
    return null;
  };

  const applyFlexGesture = (pointer, point) => {
    const connection = pointer.flexConnection;
    if (!connection || !connections.includes(connection)) return;
    const joint = connection.angular;
    const profile = JOINT_SERVO_PROFILES[joint.family];
    if (!profile) return;
    const socketPort = getConnectionPort(connection, joint.socketBody);
    const pivot = getPortAnchor(joint.socketBody, socketPort);
    const pointerAngle = Math.atan2(point.y - pivot.y, point.x - pivot.x);
    const angleDelta = wrapAngle(pointerAngle - pointer.flexStartPointerAngle);
    const targetDelta = clamp(
      wrapAngle(pointer.flexStartJointAngle + angleDelta - joint.baseAngle),
      -profile.softLimit,
      profile.softLimit
    );
    const targetAngle = wrapAngle(joint.baseAngle + targetDelta);
    const currentAngle = wrapAngle(joint.plugBody.angle - joint.socketBody.angle);
    const childBranch = rotateChildBranch(connection, wrapAngle(targetAngle - currentAngle));
    if (!childBranch) return;
    pointer.jointHolds.set(connection, targetAngle);
    for (const body of childBranch) {
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
      Sleeping.set(body, false);
    }
  };

  const beginDrag = (pointer, point) => {
    pointer.phase = 'dragging';
    pointer.target = { ...point };
    const component = new Set(getComponent(pointer.body));
    pointer.jointHolds = new Map(connections
      .filter((connection) => component.has(connection.bodyA) && component.has(connection.bodyB))
      .map((connection) => [
        connection,
        wrapAngle(connection.angular.plugBody.angle - connection.angular.socketBody.angle)
      ]));
    pointer.flexConnection = pointer.breakCandidate
      ? null
      : getFlexConnection(pointer.body, pointer.localPoint);
    if (pointer.flexConnection) {
      const joint = pointer.flexConnection.angular;
      const socketPort = getConnectionPort(pointer.flexConnection, joint.socketBody);
      const pivot = getPortAnchor(joint.socketBody, socketPort);
      pointer.flexStartJointAngle = wrapAngle(joint.plugBody.angle - joint.socketBody.angle);
      pointer.flexStartPointerAngle = Math.atan2(point.y - pivot.y, point.x - pivot.x);
    }
    dragConstraint.bodyB = pointer.flexConnection ? null : pointer.body;
    dragConstraint.angleB = pointer.body.angle;
    dragConstraint.pointA = { ...point };
    dragConstraint.pointB = rotatePoint(pointer.localPoint, pointer.body.angle);
    dragConstraint.angularStiffness = 0.88;
    wakeComponent(pointer.body);
    canvas.style.cursor = 'grabbing';
    start();
  };

  const settleFlexPose = (pointer) => {
    const connection = pointer.flexConnection;
    if (!connection || !connections.includes(connection)) return;
    const joint = connection.angular;
    const profile = JOINT_SERVO_PROFILES[joint.family];
    if (!profile) return;
    const relativeAngle = wrapAngle(joint.plugBody.angle - joint.socketBody.angle);
    const delta = clamp(
      wrapAngle(relativeAngle - joint.baseAngle),
      -profile.softLimit,
      profile.softLimit
    );
    let detent = Math.round(delta / DETENT_STEP) * DETENT_STEP;
    if (!detent && Math.abs(delta) >= profile.softLimit * 0.55) {
      detent = Math.sign(delta) * profile.softLimit;
    }
    joint.poseAngle = wrapAngle(
      joint.baseAngle + clamp(detent, -profile.softLimit, profile.softLimit)
    );
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
    dragConstraint.angularStiffness = 0.88;
    activePointer = null;
    setPortHints([], 'none', true);
    canvas.style.cursor = 'default';
    if (!applyGesture || pointer.phase === 'scrolling') {
      if (isPuzzleComplete()) startCelebration();
      return;
    }
    if (pointer.phase === 'dragging' && pointer.flexConnection) {
      settleFlexPose(pointer);
      wakeComponent(body);
      if (isPuzzleComplete()) startCelebration();
      start();
      return;
    }

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
    if (isPuzzleComplete()) startCelebration();
    start();
  };

  const handlePointerDown = (event) => {
    if (destroyed || celebration || activePointer || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const point = toWorldPoint(event.clientX, event.clientY);
    const body = findBody(point);
    if (!body) return;
    hasInteracted = true;

    const localPoint = rotatePoint(Vector.sub(point, body.position), -body.angle);
    setPortHints([], 'none', true);
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
    if (!activePointer || event.pointerId !== activePointer.id) return;
    const point = toWorldPoint(event.clientX, event.clientY);

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
      && outwardTravel >= 34 * interactionScale
      && outwardTravel >= crossTravel * 0.72) {
      removeConnection(breakCandidate.connection);
      activePointer.breakCandidate = null;
      activePointer.flexConnection = null;
      dragConstraint.bodyB = activePointer.body;
      dragConstraint.angleB = activePointer.body.angle;
      dragConstraint.pointA = { ...point };
      dragConstraint.pointB = rotatePoint(activePointer.localPoint, activePointer.body.angle);
      dragConstraint.angularStiffness = 0.88;
      activePointer.skipSnapUntilRelease = true;
      wakeComponent(activePointer.body);
    } else if (activePointer.flexConnection) {
      applyFlexGesture(activePointer, point);
    }
    const now = performance.now();
    activePointer.samples.push({ ...point, time: now });
    activePointer.samples = activePointer.samples
      .filter((sample) => now - sample.time <= 120)
      .slice(-24);
  };

  const handleHoverPointerMove = (event) => {
    if (destroyed || celebration || activePointer || event.pointerType === 'touch') return;
    const point = toWorldPoint(event.clientX, event.clientY);
    const body = findBody(point);
    if (!body) { canvas.style.cursor = 'default'; setPortHints(); return; }
    const localPoint = rotatePoint(Vector.sub(point, body.position), -body.angle);
    const flex = getBreakCandidate(body, localPoint) ? null : getFlexConnection(body, localPoint);
    canvas.style.cursor = flex ? 'crosshair' : 'grab';
    setPortHints(flex ? [[body, getConnectionPort(flex, body)]] : [], flex ? 'pose' : 'move');
  };

  const handlePointerUp = (event) => releasePointer(event, true);
  const handlePointerCancel = (event) => releasePointer(event, false);
  const handlePointerLeave = () => {
    if (!activePointer) { canvas.style.cursor = 'default'; setPortHints([], 'none', true); }
  };

  canvas.addEventListener('pointerdown', handlePointerDown, { passive: true });
  canvas.addEventListener('pointermove', handleHoverPointerMove, { passive: true });
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

  const resizeParts = (nextScale) => {
    if (Math.abs(nextScale - scale) < 0.001) return;
    const ratio = nextScale / scale;
    const visited = new Set();
    for (const body of dynamicBodies) {
      if (visited.has(body)) continue;
      const component = getComponent(body);
      component.forEach((part) => visited.add(part));
      const pivot = component.reduce((sum, part) => ({
        x: sum.x + part.position.x / component.length,
        y: sum.y + part.position.y / component.length
      }), { x: 0, y: 0 });
      for (const part of component) {
        Body.setPosition(part, {
          x: pivot.x + (part.position.x - pivot.x) * ratio,
          y: pivot.y + (part.position.y - pivot.y) * ratio
        });
      }
    }

    for (const body of dynamicBodies) {
      Body.scale(body, ratio, ratio);
      const meta = bodyMeta.get(body);
      meta.width *= ratio;
      meta.height *= ratio;
      for (const port of meta.ports) {
        port.x *= ratio;
        port.y *= ratio;
      }
      const baseDensity = meta.spec.role === 'chest' || meta.spec.role === 'pelvis'
        ? 0.0032
        : 0.0024;
      Body.setDensity(body, baseDensity / (nextScale * nextScale));
      body.constraintImpulse.x = 0;
      body.constraintImpulse.y = 0;
      body.constraintImpulse.angle = 0;
      body.positionImpulse.x = 0;
      body.positionImpulse.y = 0;

      const view = bodyToView.get(body);
      view.root.scale.set(view.root.scale.x * ratio, view.root.scale.y * ratio);
      view.farShadow.scale.set(view.farShadow.scale.x * ratio, view.farShadow.scale.y * ratio);
      view.nearShadow.scale.set(view.nearShadow.scale.x * ratio, view.nearShadow.scale.y * ratio);
    }
    for (const connection of connections) {
      connection.constraint.pointA.x *= ratio;
      connection.constraint.pointA.y *= ratio;
      connection.constraint.pointB.x *= ratio;
      connection.constraint.pointB.y *= ratio;
    }
    scale = nextScale;
    interactionScale = clamp(scale, 1, 1.4);
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
      dragConstraint.angularStiffness = 0.88;
      activePointer = null;
    }
    canvas.style.cursor = 'default';
    setPortHints([], 'none', true);
    if (celebration) finishCelebration(true);
    width = nextWidth;
    height = nextHeight;
    resizeParts(getScale(width));
    app.renderer.resize(width, height, resolution);
    app.stage.hitArea = new Rectangle(0, 0, width, height);
    rebuildWalls();

    if (!hasInteracted && connections.length === 0) {
      for (const body of dynamicBodies) {
        const pose = getInitialPose(bodyMeta.get(body).spec);
        Body.setPosition(body, pose);
        Body.setAngle(body, pose.angle);
        Body.setVelocity(body, { x: 0, y: 0 });
        Body.setAngularVelocity(body, 0);
      }
    }

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

  const setMode = (nextMode) => {
    if (destroyed) return;
    coarsePointer = window.matchMedia('(pointer: coarse)').matches;
    resolution = Math.min(window.devicePixelRatio || 1, nextMode === 'full' && !coarsePointer ? 1.5 : 1);
    resize();
    app.renderer.resize(width, height, resolution);
    if (!running) app.render();
  };

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
    if (destroyed || celebration) return;
    hasInteracted = true;
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
    setMode,
    start,
    stop,
    destroy() {
      if (destroyed) return;
      stop();
      destroyed = true;
      resizeObserver.disconnect();
      canvas.removeEventListener('pointerdown', handlePointerDown);
      canvas.removeEventListener('pointermove', handleHoverPointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      app.ticker.remove(handleTick);
      dragConstraint.bodyB = null;
      dragConstraint.angularStiffness = 0.88;
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
      delete stage.dataset.kineticIntent;
      stage.dataset.kineticState = 'static';
    }
  };
};
