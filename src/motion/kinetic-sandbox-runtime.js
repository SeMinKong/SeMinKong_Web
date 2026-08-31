import { Application, Graphics, Rectangle } from 'pixi.js';
import Matter from 'matter-js';

const {
  Body,
  Bodies,
  Composite,
  Constraint,
  Engine,
  Query,
  Sleeping,
  Vector
} = Matter;

const FIXED_STEP = 1000 / 60;
const MAX_CATCH_UP = FIXED_STEP * 3;
const WALL_THICKNESS = 160;
const MAX_THROW_SPEED = 18;
const PAPER = 0xf1eee6;
const INK = 0x24211d;
const SIGNAL = 0xa73524;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const OBJECT_SPECS = [
  {
    id: 'stone', kind: 'circle', x: 0.1, y: 0.24, width: 94, height: 94,
    color: INK, stroke: 0xf1eee6, strokeAlpha: 0.34,
    velocity: { x: 2.4, y: 0.4 }, angularVelocity: 0.018,
    density: 0.0042, restitution: 0.56
  },
  {
    id: 'signal', kind: 'circle', x: 0.84, y: 0.67, width: 80, height: 80,
    color: SIGNAL, stroke: 0xfff8ed, strokeAlpha: 0.38,
    velocity: { x: -2.8, y: -1.8 }, angularVelocity: -0.026,
    density: 0.0024, restitution: 0.76
  },
  {
    id: 'glass', kind: 'ring', x: 0.78, y: 0.23, width: 114, height: 114,
    color: 0xffffff, stroke: 0x8f8a82, strokeAlpha: 0.48,
    velocity: { x: -1.8, y: 1.1 }, angularVelocity: 0.014,
    density: 0.0018, restitution: 0.62
  },
  {
    id: 'paper', kind: 'paper', x: 0.15, y: 0.7, width: 116, height: 82,
    color: 0xfffaf0, stroke: INK, strokeAlpha: 0.2,
    angle: -0.2, velocity: { x: 1.6, y: -1.2 }, angularVelocity: -0.018,
    density: 0.0012, restitution: 0.52
  },
  {
    id: 'bar', kind: 'bar', x: 0.91, y: 0.34, width: 136, height: 34,
    color: 0x4d4943, stroke: 0xf1eee6, strokeAlpha: 0.18,
    angle: 1.2, velocity: { x: -1.4, y: 2 }, angularVelocity: 0.032,
    density: 0.0038, restitution: 0.48, mobile: false
  },
  {
    id: 'capsule', kind: 'capsule', x: 0.61, y: 0.79, width: 118, height: 46,
    color: 0xd8b46b, stroke: INK, strokeAlpha: 0.26,
    angle: 0.24, velocity: { x: 1.1, y: -2.2 }, angularVelocity: -0.024,
    density: 0.0022, restitution: 0.66
  },
  {
    id: 'tile', kind: 'tile', x: 0.05, y: 0.43, width: 70, height: 70,
    color: 0x779386, stroke: INK, strokeAlpha: 0.24,
    angle: 0.78, velocity: { x: 2.1, y: 1.4 }, angularVelocity: 0.038,
    density: 0.0028, restitution: 0.7, mobile: false
  }
];

const getScale = (width) => clamp(width / 1280, 0.7, 1.06);

const drawRoundedShape = (graphics, x, y, width, height, radius, fill, alpha = 1) => {
  graphics.roundRect(x - width / 2, y - height / 2, width, height, radius).fill({ color: fill, alpha });
};

const createView = (spec, width, height) => {
  const graphics = new Graphics();
  const shadow = 0x171512;

  if (spec.kind === 'circle') {
    graphics.circle(5, 9, width / 2).fill({ color: shadow, alpha: 0.15 });
    graphics
      .circle(0, 0, width / 2)
      .fill({ color: spec.color })
      .stroke({ color: spec.stroke, alpha: spec.strokeAlpha, width: 2 });
  } else if (spec.kind === 'ring') {
    graphics.circle(5, 9, width / 2).fill({ color: shadow, alpha: 0.12 });
    graphics
      .circle(0, 0, width / 2)
      .fill({ color: spec.color, alpha: 0.32 })
      .stroke({ color: spec.stroke, alpha: spec.strokeAlpha, width: 2 })
      .circle(0, 0, width * 0.28)
      .cut();
    graphics.circle(0, 0, width * 0.28).stroke({ color: 0xffffff, alpha: 0.7, width: 2 });
  } else if (spec.kind === 'tile') {
    const points = [0, -height / 2, width / 2, 0, 0, height / 2, -width / 2, 0];
    graphics.poly(points.map((value, index) => value + (index % 2 === 0 ? 5 : 9)), true).fill({ color: shadow, alpha: 0.14 });
    graphics
      .poly(points, true)
      .fill({ color: spec.color })
      .stroke({ color: spec.stroke, alpha: spec.strokeAlpha, width: 2 });
  } else {
    const radius = spec.kind === 'capsule' ? height / 2 : spec.kind === 'paper' ? 6 : 4;
    drawRoundedShape(graphics, 5, 9, width, height, radius, shadow, 0.14);
    graphics
      .roundRect(-width / 2, -height / 2, width, height, radius)
      .fill({ color: spec.color })
      .stroke({ color: spec.stroke, alpha: spec.strokeAlpha, width: 1.5 });
  }

  graphics.hitArea = new Rectangle(-width / 2, -height / 2, width, height);
  return graphics;
};

const createBody = (spec, x, y, width, height) => {
  const common = {
    label: `kinetic:${spec.id}`,
    angle: spec.angle ?? 0,
    density: spec.density,
    friction: 0.16,
    frictionAir: 0.016,
    frictionStatic: 0.22,
    restitution: spec.restitution,
    sleepThreshold: 50
  };

  if (spec.kind === 'circle' || spec.kind === 'ring') {
    return Bodies.circle(x, y, width / 2, common);
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

  const engine = Engine.create({ enableSleeping: true });
  engine.gravity.x = 0;
  engine.gravity.y = 0;
  engine.gravity.scale = 0;

  const bodyToView = new Map();
  const dynamicBodies = [];
  let accumulator = 0;
  let activePointer = null;
  let contentBodies = [];
  let destroyed = false;
  let height = initialRect.height;
  let running = false;
  let sleepingFrames = 0;
  let walls = [];
  let width = initialRect.width;

  const dragConstraint = Constraint.create({
    label: 'kinetic:drag',
    pointA: { x: 0, y: 0 },
    pointB: { x: 0, y: 0 },
    bodyB: null,
    length: 0,
    stiffness: 0.2,
    damping: 0.14
  });
  Composite.add(engine.world, dragConstraint);

  const specs = OBJECT_SPECS.filter((spec) => !coarsePointer || spec.mobile !== false);
  const scale = getScale(width);
  const inset = coarsePointer ? 16 : width <= 1000 ? 24 : 32;

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
    app.stage.addChild(view);
  }

  Composite.add(engine.world, dynamicBodies);

  const rebuildContentBodies = () => {
    for (const body of contentBodies) Composite.remove(engine.world, body);
    const stageRect = stage.getBoundingClientRect();
    const obstacles = [
      { element: document.querySelector('.hero-identity__name'), padding: 16 },
      { element: document.querySelector('.hero-identity__statement'), padding: 14 },
      { element: document.querySelector('.hero-story__actions'), padding: 12 }
    ];

    contentBodies = obstacles.flatMap(({ element, padding }) => {
      if (!element) return [];
      const rect = element.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return [];
      return [Bodies.rectangle(
        rect.left - stageRect.left + rect.width / 2,
        rect.top - stageRect.top + rect.height / 2,
        rect.width + padding * 2,
        rect.height + padding * 2,
        {
          isStatic: true,
          label: 'kinetic:content-boundary',
          friction: 0.08,
          restitution: 0.72
        }
      )];
    });
    Composite.add(engine.world, contentBodies);
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

  const syncViews = () => {
    for (const [body, view] of bodyToView) {
      view.position.set(body.position.x, body.position.y);
      view.rotation = body.angle;
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
    setStageState(dynamicBodies.every((body) => body.isSleeping) ? 'sleeping' : 'paused');
  };

  const start = () => {
    if (destroyed || running) return;
    running = true;
    accumulator = 0;
    sleepingFrames = 0;
    setStageState('running');
    app.start();
  };

  const handleTick = (ticker) => {
    try {
      accumulator = Math.min(accumulator + ticker.deltaMS, MAX_CATCH_UP);
      while (accumulator >= FIXED_STEP) {
        Engine.update(engine, FIXED_STEP);
        accumulator -= FIXED_STEP;
      }
      syncViews();

      const settled = !activePointer && dynamicBodies.every((body) => body.isSleeping || (body.speed < 0.035 && Math.abs(body.angularSpeed) < 0.012));
      sleepingFrames = settled ? sleepingFrames + 1 : 0;
      if (sleepingFrames > 48) {
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
  syncViews();
  app.stage.hitArea = new Rectangle(0, 0, width, height);
  app.render();
  setStageState('ready');

  const toWorldPoint = (clientX, clientY) => {
    const rect = canvas.getBoundingClientRect();
    return {
      x: (clientX - rect.left) * (width / Math.max(1, rect.width)),
      y: (clientY - rect.top) * (height / Math.max(1, rect.height))
    };
  };

  const findBody = (point) => Query.point(dynamicBodies, point)[0] ?? null;

  const releasePointer = (event, applyThrow = true) => {
    if (!activePointer || event.pointerId !== activePointer.id) return;
    const body = activePointer.body;
    const point = toWorldPoint(event.clientX, event.clientY);
    activePointer.samples.push({ ...point, time: performance.now() });
    const samples = activePointer.samples;
    const newest = samples.at(-1);
    const oldest = samples.find((sample) => newest.time - sample.time <= 90) ?? samples[0];
    const elapsed = Math.max(16, newest.time - oldest.time);
    const travel = Math.hypot(newest.x - activePointer.start.x, newest.y - activePointer.start.y);

    dragConstraint.bodyB = null;
    dragConstraint.pointB = { x: 0, y: 0 };

    if (applyThrow && travel >= 7) {
      const velocity = {
        x: clamp(((newest.x - oldest.x) / elapsed) * FIXED_STEP, -MAX_THROW_SPEED, MAX_THROW_SPEED),
        y: clamp(((newest.y - oldest.y) / elapsed) * FIXED_STEP, -MAX_THROW_SPEED, MAX_THROW_SPEED)
      };
      Body.setVelocity(body, velocity);
      Body.setAngularVelocity(body, clamp(velocity.x * 0.012 + activePointer.localPoint.y * 0.0007, -0.24, 0.24));
    } else if (applyThrow && activePointer.pointerType === 'touch') {
      Body.setVelocity(body, {
        x: point.x < width / 2 ? 4.8 : -4.8,
        y: -6.2
      });
      Body.setAngularVelocity(body, point.x < width / 2 ? 0.06 : -0.06);
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
    Body.setVelocity(body, { x: body.velocity.x * 0.35, y: body.velocity.y * 0.35 });
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
      start: point
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

    dragConstraint.pointA.x = point.x;
    dragConstraint.pointA.y = point.y;
    const now = performance.now();
    activePointer.samples.push({ ...point, time: now });
    activePointer.samples = activePointer.samples.filter((sample) => now - sample.time <= 110).slice(-6);
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
    syncViews();
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
      x: clamp(safeDirection.x * 7 + (point.x < width / 2 ? 2 : -2), -9, 9),
      y: clamp(safeDirection.y * 7 - 2.5, -9, 9)
    });
    Body.setAngularVelocity(body, point.x < body.position.x ? 0.08 : -0.08);
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
      dynamicBodies.length = 0;
      app.destroy({ removeView: false }, { children: true });
      canvas.style.removeProperty('cursor');
      stage.dataset.kineticState = 'static';
    }
  };
};
