import assert from 'node:assert/strict';
import test from 'node:test';
import {
  WORLD_LIGHT_ANCHOR,
  capVectorMagnitude,
  getWorldLight,
  interpolatePose,
  smoothThrowVelocity,
  toStageCollisionRects
} from '../src/motion/kinetic-math.js';

test('kinetic pose interpolation stays clamped and continuous', () => {
  const previous = { x: 10, y: 20, angle: -0.4 };
  const current = { x: 30, y: 60, angle: 0.8 };

  assert.deepEqual(interpolatePose(previous, current, -1), previous);
  assert.deepEqual(interpolatePose(previous, current, 1.5), current);
  const midpoint = interpolatePose(previous, current, 0.5);
  assert.equal(midpoint.x, 20);
  assert.equal(midpoint.y, 40);
  assert.ok(Math.abs(midpoint.angle - 0.2) < 1e-9);
});

test('throw smoothing caps diagonal magnitude and respects long sample gaps', () => {
  const capped = capVectorMagnitude({ x: 14, y: 14 }, 14);
  assert.ok(Math.abs(Math.hypot(capped.x, capped.y) - 14) < 1e-9);

  const velocity = smoothThrowVelocity([
    { x: 0, y: 0, time: 0 },
    { x: 100, y: 0, time: 100 }
  ], { x: 0, y: 0 }, {
    fixedStep: 1000 / 60,
    maxSpeed: 50,
    windowMs: 120,
    pointerWeight: 1
  });

  assert.ok(velocity.x > 16 && velocity.x < 17);
  assert.equal(velocity.y, 0);
});

test('stage collision rects preserve whitespace between text fragments', () => {
  const rects = toStageCollisionRects([
    { left: 100, top: 50, width: 20, height: 18 },
    { left: 140, top: 50, width: 20, height: 18 }
  ], { left: 80, top: 30 }, 4);

  assert.equal(rects.length, 2);
  assert.deepEqual(rects.map(({ x, y, width, height }) => ({ x, y, width, height })), [
    { x: 30, y: 29, width: 28, height: 26 },
    { x: 70, y: 29, width: 28, height: 26 }
  ]);
  assert.ok(rects[0].x + rects[0].width / 2 < rects[1].x - rects[1].width / 2);
});

test('all materials resolve against one fixed upper-left world light', () => {
  assert.deepEqual(WORLD_LIGHT_ANCHOR, { x: -0.12, y: -0.18 });
  const first = getWorldLight({ x: 320, y: 240 }, { width: 1280, height: 720 }, 10);
  const second = getWorldLight({ x: 320, y: 240 }, { width: 1280, height: 720 }, 10);

  assert.deepEqual(first, second);
  assert.ok(first.lightPosition.x < 0 && first.lightPosition.y < 0);
  assert.ok(first.toward.x < 0 && first.toward.y < 0);
  assert.ok(first.farShadow.x > 0 && first.farShadow.y > 0);
  assert.ok(Math.hypot(first.farShadow.x, first.farShadow.y) <= 18.5);
});
