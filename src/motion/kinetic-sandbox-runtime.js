import { Application, Container, Graphics, Rectangle } from 'pixi.js';
import Matter from 'matter-js';
import {
  clamp,
  getWorldLight,
  interpolatePose,
  smoothThrowVelocity,
  toStageCollisionRects
} from './kinetic-math.js';

const {
  Body,
  Bodies,
  Bounds,
  Composite,
  Constraint,
  Engine,
  Sleeping,
  Vector,
  Vertices
} = Matter;

const FIXED_STEP = 1000 / 60;
const PHYSICS_SUBSTEPS = 2;
const PHYSICS_SUBSTEP = FIXED_STEP / PHYSICS_SUBSTEPS;
const MAX_CATCH_UP = FIXED_STEP * 3;
const MAX_FRAME_DELTA = 50;
const WALL_THICKNESS = 160;
const MAX_THROW_SPEED = 14.5;
const SETTLE_DURATION = 760;
const PAPER = 0xf1eee6;
const INK = 0x24211d;
const SIGNAL = 0xa73524;
const SHADOW = 0x171512;

const MATERIAL_SPECS = {
  stone: { elevation: 8, shadowAlpha: 0.17, specularAlpha: 0.09, shadeAlpha: 0.16 },
  signal: { elevation: 10, shadowAlpha: 0.17, specularAlpha: 0.2, shadeAlpha: 0.12 },
  glass: { elevation: 13, shadowAlpha: 0.1, specularAlpha: 0.72, shadeAlpha: 0.16 },
  paper: { elevation: 5, shadowAlpha: 0.12, edgeAlpha: 0.28, shadeAlpha: 0.08 },
  bar: { elevation: 7, shadowAlpha: 0.15, edgeAlpha: 0.14, shadeAlpha: 0.18 },
  capsule: { elevation: 10, shadowAlpha: 0.16, edgeAlpha: 0.26, specularAlpha: 0.16, shadeAlpha: 0.12 },
  tile: { elevation: 8, shadowAlpha: 0.15, edgeAlpha: 0.24, shadeAlpha: 0.14 }
};

const OBJECT_SPECS = [
  {
    id: 'stone', kind: 'circle', x: 0.1, y: 0.24, width: 94, height: 94,
    color: INK, stroke: 0xf1eee6, strokeAlpha: 0.34,
    velocity: { x: 2.4, y: 0.4 }, angularVelocity: 0.018,
    density: 0.0042, restitution: 0.44, friction: 0.18, frictionAir: 0.014
  },
  {
    id: 'signal', kind: 'circle', x: 0.84, y: 0.67, width: 80, height: 80,
    color: SIGNAL, stroke: 0xfff8ed, strokeAlpha: 0.38,
    velocity: { x: -2.8, y: -1.8 }, angularVelocity: -0.026,
    density: 0.0024, restitution: 0.6, friction: 0.16, frictionAir: 0.015
  },
  {
    id: 'glass', kind: 'ring', x: 0.78, y: 0.23, width: 114, height: 114,
    color: 0xffffff, stroke: 0x8f8a82, strokeAlpha: 0.48,
    velocity: { x: -1.8, y: 1.1 }, angularVelocity: 0.014,
    density: 0.0018, restitution: 0.52, friction: 0.08, frictionAir: 0.012
  },
  {
    id: 'paper', kind: 'paper', x: 0.15, y: 0.7, width: 116, height: 82,
    color: 0xfffaf0, stroke: INK, strokeAlpha: 0.2,
    angle: -0.2, velocity: { x: 1.6, y: -1.2 }, angularVelocity: -0.018,
    density: 0.0012, restitution: 0.38, friction: 0.24, frictionAir: 0.026
  },
  {
    id: 'bar', kind: 'bar', x: 0.91, y: 0.34, width: 136, height: 34,
    color: 0x4d4943, stroke: 0xf1eee6, strokeAlpha: 0.18,
    angle: 1.2, velocity: { x: -1.4, y: 2 }, angularVelocity: 0.032,
    density: 0.0038, restitution: 0.4, friction: 0.18, frictionAir: 0.013, mobile: false
  },
  {
    id: 'capsule', kind: 'capsule', x: 0.61, y: 0.79, width: 118, height: 46,
    color: 0xd8b46b, stroke: INK, strokeAlpha: 0.26,
    angle: 0.24, velocity: { x: 1.1, y: -2.2 }, angularVelocity: -0.024,
    density: 0.0022, restitution: 0.5, friction: 0.14, frictionAir: 0.016
  },
  {
    id: 'tile', kind: 'tile', x: 0.05, y: 0.43, width: 70, height: 70,
    color: 0x779386, stroke: INK, strokeAlpha: 0.24,
    angle: 0.78, velocity: { x: 2.1, y: 1.4 }, angularVelocity: 0.038,
    density: 0.0028, restitution: 0.54, friction: 0.14, frictionAir: 0.015, mobile: false
  }
];

const getScale = (width) => clamp(width / 1280, 0.7, 1.06);

const getRadius = (spec, height) => spec.kind === 'capsule'
  ? height / 2
  : spec.kind === 'paper'
    ? 6
    : 4;

const drawShapeFill = (graphics, spec, width, height, color, alpha = 1) => {
  if (spec.kind === 'circle') {
    graphics.circle(0, 0, width / 2).fill({ color, alpha });
  } else if (spec.kind === 'ring') {
    graphics
      .circle(0, 0, width / 2)
      .fill({ color, alpha })
      .circle(0, 0, width * 0.28)
      .cut();
  } else if (spec.kind === 'tile') {
    graphics.roundRect(-width / 2, -height / 2, width, height, 6).fill({ color, alpha });
  } else {
    graphics
      .roundRect(-width / 2, -height / 2, width, height, getRadius(spec, height))
      .fill({ color, alpha });
  }
  return graphics;
};

const createSurface = (spec, width, height) => {
  const graphics = drawShapeFill(
    new Graphics(),
    spec,
    width,
    height,
    spec.color,
    spec.kind === 'ring' ? 0.26 : 1
  );

  if (spec.kind === 'circle' || spec.kind === 'ring') {
    graphics.circle(0, 0, width / 2).stroke({ color: spec.stroke, alpha: spec.strokeAlpha, width: 2 });
    if (spec.kind === 'ring') {
      graphics.circle(0, 0, width * 0.28).stroke({ color: 0xffffff, alpha: 0.56, width: 1.5 });
    }
  } else if (spec.kind === 'tile') {
    graphics
      .roundRect(-width / 2, -height / 2, width, height, 6)
      .stroke({ color: spec.stroke, alpha: spec.strokeAlpha, width: 2 });
  } else {
    graphics
      .roundRect(-width / 2, -height / 2, width, height, getRadius(spec, height))
      .stroke({ color: spec.stroke, alpha: spec.strokeAlpha, width: 1.5 });
  }
  return graphics;
};

const getEdgePoints = (width, height) => [
  { x: -width / 2, y: -height / 2 },
  { x: width / 2, y: -height / 2 },
  { x: width / 2, y: height / 2 },
  { x: -width / 2, y: height / 2 }
];

const createEdgeLighting = (layer, width, height) => {
  const points = getEdgePoints(width, height);
  return points.map((start, index) => {
    const end = points[(index + 1) % points.length];
    const deltaX = end.x - start.x;
    const deltaY = end.y - start.y;
    const length = Math.max(1, Math.hypot(deltaX, deltaY));
    const normal = { x: deltaY / length, y: -deltaX / length };
    const dark = new Graphics()
      .moveTo(start.x, start.y)
      .lineTo(end.x, end.y)
      .stroke({ color: SHADOW, alpha: 1, width: 1.8 });
    const light = new Graphics()
      .moveTo(start.x, start.y)
      .lineTo(end.x, end.y)
      .stroke({ color: 0xffffff, alpha: 1, width: 1.6 });
    dark.alpha = 0;
    light.alpha = 0;
    layer.addChild(dark, light);
    return { dark, light, normal };
  });
};

const createView = (spec, width, height) => {
  const material = MATERIAL_SPECS[spec.id] ?? MATERIAL_SPECS.stone;
  const root = new Container();
  const farShadow = drawShapeFill(new Graphics(), spec, width, height, SHADOW);
  const nearShadow = drawShapeFill(new Graphics(), spec, width, height, SHADOW);
  const surface = createSurface(spec, width, height);
  const lighting = new Container();
  const edgeLighting = (spec.kind === 'circle' || spec.kind === 'ring' || spec.kind === 'capsule')
    ? []
    : createEdgeLighting(lighting, width, height);
  let highlight = null;
  let shade = null;

  farShadow.scale.set(1.05);
  farShadow.alpha = 0;
  nearShadow.alpha = 0;

  if (spec.kind === 'circle') {
    highlight = new Graphics()
      .ellipse(0, 0, width * 0.16, height * 0.09).fill({ color: 0xffffff, alpha: 0.48 })
      .ellipse(-width * 0.025, -height * 0.015, width * 0.095, height * 0.052).fill({ color: 0xffffff, alpha: 0.52 });
    shade = new Graphics().ellipse(0, 0, width * 0.21, height * 0.11).fill({ color: SHADOW, alpha: 0.78 });
  } else if (spec.kind === 'ring') {
    highlight = new Graphics().arc(0, 0, width * 0.39, -0.72, 0.72).stroke({ color: 0xffffff, alpha: 1, width: Math.max(2, width * 0.045) });
    shade = new Graphics().arc(0, 0, width * 0.39, Math.PI - 0.58, Math.PI + 0.58).stroke({ color: SHADOW, alpha: 1, width: Math.max(2, width * 0.05) });
  } else if (spec.kind === 'capsule') {
    highlight = new Graphics()
      .ellipse(0, 0, width * 0.15, height * 0.12).fill({ color: 0xffffff, alpha: 0.5 })
      .ellipse(-width * 0.018, -height * 0.012, width * 0.09, height * 0.07).fill({ color: 0xffffff, alpha: 0.5 });
    shade = new Graphics().ellipse(0, 0, width * 0.19, height * 0.14).fill({ color: SHADOW, alpha: 0.58 });
  }

  if (shade) {
    shade.alpha = 0;
    lighting.addChild(shade);
  }
  if (highlight) {
    highlight.alpha = 0;
    lighting.addChild(highlight);
  }

  root.addChild(surface, lighting);
  root.hitArea = new Rectangle(-width / 2, -height / 2, width, height);

  return {
    edgeLighting,
    farShadow,
    height,
    highlight,
    lighting,
    material,
    nearShadow,
    root,
    shade,
    spec,
    surface,
    width
  };
};

const updateViewLighting = (view, pose, viewport) => {
  const light = getWorldLight(pose, viewport, view.material.elevation);
  const localLight = Vector.rotate(light.toward, -pose.angle);
  const lightAngle = Math.atan2(localLight.y, localLight.x);

  view.farShadow.position.set(pose.x + light.farShadow.x, pose.y + light.farShadow.y);
  view.nearShadow.position.set(pose.x + light.nearShadow.x, pose.y + light.nearShadow.y);
  view.farShadow.rotation = pose.angle;
  view.nearShadow.rotation = pose.angle;
  view.farShadow.alpha = view.material.shadowAlpha * 0.34 * light.intensity;
  view.nearShadow.alpha = view.material.shadowAlpha * 0.72 * light.intensity;
  view.surface.rotation = pose.angle;
  view.lighting.rotation = pose.angle;

  if (view.highlight) {
    const offset = view.spec.kind === 'ring' ? 0 : Math.min(view.width, view.height) * 0.17;
    view.highlight.position.set(localLight.x * offset, localLight.y * offset);
    view.highlight.rotation = lightAngle + (view.spec.kind === 'ring' ? 0 : Math.PI / 4);
    view.highlight.alpha = (view.material.specularAlpha ?? 0) * light.intensity;
  }

  if (view.shade) {
    const isRing = view.spec.kind === 'ring';
    const offset = isRing ? 0 : Math.min(view.width, view.height) * 0.18;
    view.shade.position.set(-localLight.x * offset, -localLight.y * offset);
    view.shade.rotation = isRing ? lightAngle : lightAngle + Math.PI / 4;
    view.shade.alpha = (view.material.shadeAlpha ?? 0) * light.intensity;
  }

  for (const edge of view.edgeLighting) {
    const facing = edge.normal.x * localLight.x + edge.normal.y * localLight.y;
    edge.light.alpha = Math.max(0, facing) * (view.material.edgeAlpha ?? 0) * light.intensity;
    edge.dark.alpha = Math.max(0, -facing) * (view.material.shadeAlpha ?? 0) * light.intensity;
  }
};

const createBody = (spec, x, y, width, height) => {
  const common = {
    label: `kinetic:${spec.id}`,
    angle: spec.angle ?? 0,
    density: spec.density,
    friction: spec.friction ?? 0.14,
    frictionAir: spec.frictionAir ?? 0.014,
    frictionStatic: (spec.friction ?? 0.14) + 0.06,
    restitution: spec.restitution,
    sleepThreshold: 96,
    slop: 0.035
  };

  if (spec.kind === 'circle') {
    return Bodies.circle(x, y, width / 2, common);
  }

  if (spec.kind === 'ring') {
    const segmentCount = 12;
    const middleRadius = width * 0.39;
    const thickness = width * 0.21;
    const segmentLength = (Math.PI * 2 * middleRadius / segmentCount) * 1.08;
    const parts = Array.from({ length: segmentCount }, (_, index) => {
      const angle = index / segmentCount * Math.PI * 2;
      return Bodies.rectangle(
        x + Math.cos(angle) * middleRadius,
        y + Math.sin(angle) * middleRadius,
        segmentLength,
        thickness,
        {
          ...common,
          angle: angle + Math.PI / 2,
          label: `${common.label}:segment`,
          chamfer: { radius: thickness * 0.42 }
        }
      );
    });
    return Body.create({ ...common, parts });
  }

  if (spec.kind === 'tile') {
    return Bodies.polygon(x, y, 4, width / Math.sqrt(2), common);
  }

  const chamfer = spec.kind === 'capsule'
    ? { radius: Math.max(2, height / 2 - 1) }
    : spec.kind === 'paper'
      ? { radius: 6 }
      : { radius: 3 };

  return Bodies.rectangle(x, y, width, height, { ...common, chamfer });
};

const getElementRects = (elements) => [...elements]
  .map((element) => element.getBoundingClientRect())
  .filter((rect) => rect.width >= 0.01 && rect.height >= 2);

const getTextFragmentRects = (element) => {
  if (!element) return [];
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const range = document.createRange();
  const rects = [];
  let node = walker.nextNode();

  while (node) {
    const text = node.nodeValue ?? '';
    for (const match of text.matchAll(/\S+/gu)) {
      const start = match.index ?? 0;
      range.setStart(node, start);
      range.setEnd(node, start + match[0].length);
      rects.push(...range.getClientRects());
    }
    node = walker.nextNode();
  }

  range.detach?.();
  return rects.filter((rect) => rect.width >= 2 && rect.height >= 2);
};

export const mountKineticSandbox = async (stage, { mode = 'full', onFailure } = {}) => {
  const canvas = stage.querySelector('[data-kinetic-canvas]');
  if (!(canvas instanceof HTMLCanvasElement)) throw new Error('The kinetic canvas is missing.');

  const initialRect = stage.getBoundingClientRect();
  if (initialRect.width < 2 || initialRect.height < 2) throw new Error('The kinetic stage has no renderable area.');

  const app = new Application();
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const resolution = Math.min(window.devicePixelRatio || 1, mode === 'full' && !coarsePointer ? 1.5 : 1);

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
  // Pixi's event system applies `touch-action: none` inline during init.
  // Restore the native vertical gesture contract owned by the canvas CSS.
  canvas.style.touchAction = 'pan-y pinch-zoom';

  const engine = Engine.create({
    enableSleeping: true,
    positionIterations: 8,
    velocityIterations: 6,
    constraintIterations: 4
  });
  engine.gravity.x = 0;
  engine.gravity.y = 0;
  engine.gravity.scale = 0;

  const bodyToView = new Map();
  const dynamicBodies = [];
  const poseStates = new Map();
  let accumulator = 0;
  let activePointer = null;
  let contentBodies = [];
  let destroyed = false;
  let height = initialRect.height;
  let running = false;
  let settledDuration = 0;
  let walls = [];
  let width = initialRect.width;

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

  const specs = OBJECT_SPECS.filter((spec) => !coarsePointer || spec.mobile !== false);
  const scale = getScale(width);
  const inset = coarsePointer ? 16 : width <= 1000 ? 24 : 32;
  const shadowLayer = new Container();
  const objectLayer = new Container();
  app.stage.addChild(shadowLayer, objectLayer);

  for (const spec of specs) {
    const bodyWidth = spec.width * scale;
    const bodyHeight = spec.height * scale;
    const x = clamp(width * spec.x, inset + bodyWidth / 2, width - inset - bodyWidth / 2);
    const y = clamp(height * spec.y, inset + bodyHeight / 2, height - inset - bodyHeight / 2);
    const body = createBody(spec, x, y, bodyWidth, bodyHeight);
    const view = createView(spec, bodyWidth, bodyHeight);

    Body.setVelocity(body, spec.velocity);
    Body.setAngularVelocity(body, spec.angularVelocity);
    dynamicBodies.push(body);
    bodyToView.set(body, view);
    poseStates.set(body, {
      previous: { x: body.position.x, y: body.position.y, angle: body.angle },
      current: { x: body.position.x, y: body.position.y, angle: body.angle }
    });
    shadowLayer.addChild(view.farShadow, view.nearShadow);
    objectLayer.addChild(view.root);
  }

  Composite.add(engine.world, dynamicBodies);

  const rebuildContentBodies = () => {
    for (const body of contentBodies) Composite.remove(engine.world, body);
    const stageRect = stage.getBoundingClientRect();
    const nameElement = document.querySelector('.hero-identity__name');
    const nameGlyphRects = getElementRects(document.querySelectorAll('.handwritten-wordmark__letter'));
    const groups = [
      {
        label: 'kinetic:text:name',
        padding: 4,
        rects: nameGlyphRects.length
          ? nameGlyphRects
          : getElementRects(nameElement ? [nameElement] : [])
      },
      {
        label: 'kinetic:text:statement',
        padding: 5,
        rects: getTextFragmentRects(document.querySelector('.hero-identity__statement'))
      },
      {
        label: 'kinetic:text:action',
        padding: 7,
        rects: getElementRects(document.querySelectorAll('.hero-story__actions .button'))
      }
    ];

    contentBodies = groups.flatMap(({ label, padding, rects }) => (
      toStageCollisionRects(rects, stageRect, padding).map((rect) => Bodies.rectangle(
        rect.x,
        rect.y,
        rect.width,
        rect.height,
        {
          isStatic: true,
          label,
          friction: 0.22,
          frictionStatic: 0.28,
          restitution: 0.08,
          slop: 0.025,
          chamfer: { radius: clamp(Math.min(rect.width, rect.height) * 0.22, 2, 10) }
        }
      ))
    ));
    Composite.add(engine.world, contentBodies);
    stage.dataset.kineticObstacles = String(contentBodies.length);
  };

  const rebuildWalls = () => {
    for (const wall of walls) Composite.remove(engine.world, wall);
    const half = WALL_THICKNESS / 2;
    const stageRect = stage.getBoundingClientRect();
    const navRect = document.querySelector('.site-nav')?.getBoundingClientRect();
    const topBoundary = navRect
      ? clamp(navRect.bottom - stageRect.top + 4, 0, height * 0.2)
      : 0;
    walls = [
      Bodies.rectangle(width / 2, topBoundary - half, width + WALL_THICKNESS * 2, WALL_THICKNESS, { isStatic: true, label: 'kinetic:wall-top' }),
      Bodies.rectangle(width / 2, height + half, width + WALL_THICKNESS * 2, WALL_THICKNESS, { isStatic: true, label: 'kinetic:wall-bottom' }),
      Bodies.rectangle(-half, height / 2, WALL_THICKNESS, height + WALL_THICKNESS * 2, { isStatic: true, label: 'kinetic:wall-left' }),
      Bodies.rectangle(width + half, height / 2, WALL_THICKNESS, height + WALL_THICKNESS * 2, { isStatic: true, label: 'kinetic:wall-right' })
    ];
    Composite.add(engine.world, walls);
  };

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

  const advancePhysics = () => {
    for (const state of poseStates.values()) {
      state.previous.x = state.current.x;
      state.previous.y = state.current.y;
      state.previous.angle = state.current.angle;
    }

    for (let index = 0; index < PHYSICS_SUBSTEPS; index += 1) {
      if (activePointer) {
        const response = 1 - Math.exp(-42 * (PHYSICS_SUBSTEP / 1000));
        dragConstraint.pointA.x += (activePointer.target.x - dragConstraint.pointA.x) * response;
        dragConstraint.pointA.y += (activePointer.target.y - dragConstraint.pointA.y) * response;
      }
      Engine.update(engine, PHYSICS_SUBSTEP);
    }

    for (const body of dynamicBodies) {
      const state = poseStates.get(body);
      if (!state) continue;
      state.current.x = body.position.x;
      state.current.y = body.position.y;
      state.current.angle = body.angle;
    }
  };

  const syncViews = (alpha = 1) => {
    for (const [body, view] of bodyToView) {
      const state = poseStates.get(body);
      const pose = state
        ? interpolatePose(state.previous, state.current, alpha)
        : { x: body.position.x, y: body.position.y, angle: body.angle };
      view.root.position.set(pose.x, pose.y);
      updateViewLighting(view, pose, { width, height });
    }
  };

  const setStageState = (state) => {
    if (!destroyed) stage.dataset.kineticState = state;
  };

  const stop = () => {
    if (destroyed || !running) return;
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

  const handleTick = (ticker) => {
    try {
      const frameDelta = clamp(ticker.deltaMS, 0, MAX_FRAME_DELTA);
      accumulator = Math.min(accumulator + frameDelta, MAX_CATCH_UP);
      while (accumulator >= FIXED_STEP) {
        advancePhysics();
        accumulator -= FIXED_STEP;
      }
      syncViews(accumulator / FIXED_STEP);

      const settled = !activePointer && dynamicBodies.every((body) => body.isSleeping || (body.speed < 0.035 && Math.abs(body.angularSpeed) < 0.012));
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
  rebuildContentBodies();
  syncViews(1);
  app.stage.hitArea = new Rectangle(0, 0, width, height);
  app.render();
  stage.dataset.kineticLight = 'fixed-upper-left';
  setStageState('ready');

  const toWorldPoint = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (width / Math.max(1, rect.width)),
      y: (clientY - rect.top) * (height / Math.max(1, rect.height))
    };
  };

  const findBody = (point) => dynamicBodies.find((body) => {
    const parts = body.parts.length > 1 ? body.parts.slice(1) : [body];
    return parts.some((part) => Bounds.contains(part.bounds, point) && Vertices.contains(part.vertices, point));
  }) ?? null;

  const releasePointer = (event, applyThrow = true) => {
    if (!activePointer || event.pointerId !== activePointer.id) return;
    const body = activePointer.body;
    const point = toWorldPoint(event.clientX, event.clientY);
    activePointer.samples.push({ ...point, time: performance.now() });
    const samples = activePointer.samples;
    const travel = Math.hypot(point.x - activePointer.start.x, point.y - activePointer.start.y);

    dragConstraint.bodyB = null;
    dragConstraint.pointB = { x: 0, y: 0 };

    if (applyThrow && travel >= 7) {
      const velocity = smoothThrowVelocity(samples, body.velocity, {
        fixedStep: FIXED_STEP,
        maxSpeed: MAX_THROW_SPEED,
        windowMs: 100,
        pointerWeight: 0.84
      });
      Body.setVelocity(body, velocity);
      const releaseTorque = activePointer.localPoint.x * velocity.y - activePointer.localPoint.y * velocity.x;
      Body.setAngularVelocity(body, clamp(releaseTorque * 0.00085 + body.angularVelocity * 0.18, -0.18, 0.18));
    } else if (applyThrow && activePointer.pointerType === 'touch') {
      Body.setVelocity(body, {
        x: point.x < width / 2 ? 3.2 : -3.2,
        y: -4.2
      });
      Body.setAngularVelocity(body, point.x < width / 2 ? 0.045 : -0.045);
    }

    Sleeping.set(body, false);
    activePointer = null;
    canvas.style.cursor = 'default';
    start();
  };

  const handlePointerDown = (event) => {
    if (destroyed || activePointer || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const point = toWorldPoint(event.clientX, event.clientY);
    const body = findBody(point);
    if (!body) return;

    const offset = Vector.sub(point, body.position);
    const localPoint = Vector.rotate(offset, -body.angle);
    Sleeping.set(body, false);
    Body.setVelocity(body, { x: body.velocity.x * 0.5, y: body.velocity.y * 0.5 });
    dragConstraint.bodyB = body;
    dragConstraint.angleB = body.angle;
    dragConstraint.pointA = { ...point };
    dragConstraint.pointB = localPoint;
    activePointer = {
      body,
      id: event.pointerId,
      localPoint,
      pointerType: event.pointerType,
      samples: [{ ...point, time: performance.now() }],
      start: point,
      target: { ...point }
    };
    canvas.style.cursor = 'grabbing';
    start();
  };

  const handlePointerMove = (event) => {
    const point = toWorldPoint(event.clientX, event.clientY);
    if (!activePointer) {
      if (event.pointerType !== 'touch') canvas.style.cursor = findBody(point) ? 'grab' : 'default';
      return;
    }
    if (event.pointerId !== activePointer.id) return;

    activePointer.target.x = point.x;
    activePointer.target.y = point.y;
    const now = performance.now();
    activePointer.samples.push({ ...point, time: now });
    activePointer.samples = activePointer.samples.filter((sample) => now - sample.time <= 120).slice(-24);
  };

  const handlePointerUp = (event) => releasePointer(event, true);
  const handlePointerCancel = (event) => releasePointer(event, false);
  const handlePointerLeave = () => {
    if (!activePointer) canvas.style.cursor = 'default';
  };

  canvas.addEventListener('pointerdown', handlePointerDown, { passive: true });
  canvas.addEventListener('pointermove', handlePointerMove, { passive: true });
  canvas.addEventListener('pointerleave', handlePointerLeave, { passive: true });
  window.addEventListener('pointerup', handlePointerUp, { passive: true });
  window.addEventListener('pointercancel', handlePointerCancel, { passive: true });

  const resize = () => {
    if (destroyed) return;
    const rect = stage.getBoundingClientRect();
    const nextWidth = Math.max(2, Math.round(rect.width));
    const nextHeight = Math.max(2, Math.round(rect.height));
    if (nextWidth === Math.round(width) && nextHeight === Math.round(height)) return;

    width = nextWidth;
    height = nextHeight;
    app.renderer.resize(width, height, resolution);
    app.stage.hitArea = new Rectangle(0, 0, width, height);
    rebuildWalls();
    rebuildContentBodies();

    for (const body of dynamicBodies) {
      const halfWidth = (body.bounds.max.x - body.bounds.min.x) / 2;
      const halfHeight = (body.bounds.max.y - body.bounds.min.y) / 2;
      Body.setPosition(body, {
        x: clamp(body.position.x, halfWidth, width - halfWidth),
        y: clamp(body.position.y, halfHeight, height - halfHeight)
      });
    }
    resetPoseStates();
    syncViews(1);
    app.render();
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(stage);
  document.fonts?.ready?.then(() => {
    if (!destroyed) rebuildContentBodies();
  });

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
    Sleeping.set(body, false);
    Body.setVelocity(body, {
      x: clamp(safeDirection.x * 4.6 + (point.x < width / 2 ? 1.4 : -1.4), -6.2, 6.2),
      y: clamp(safeDirection.y * 4.6 - 1.6, -6.2, 6.2)
    });
    Body.setAngularVelocity(body, point.x < body.position.x ? 0.055 : -0.055);
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
      canvas.removeEventListener('pointermove', handlePointerMove);
      canvas.removeEventListener('pointerleave', handlePointerLeave);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      app.ticker.remove(handleTick);
      dragConstraint.bodyB = null;
      Composite.clear(engine.world, false, true);
      Engine.clear(engine);
      bodyToView.clear();
      poseStates.clear();
      dynamicBodies.length = 0;
      app.destroy({ removeView: false }, { children: true });
      canvas.style.removeProperty('cursor');
      canvas.style.removeProperty('touch-action');
      delete stage.dataset.kineticLight;
      delete stage.dataset.kineticObstacles;
      stage.dataset.kineticState = 'static';
    }
  };
};
