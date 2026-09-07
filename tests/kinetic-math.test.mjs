import assert from 'node:assert/strict';
import Matter from 'matter-js';
import test from 'node:test';
import {
  WORLD_LIGHT_ANCHOR,
  capVectorMagnitude,
  evaluatePortSnap,
  getWorldLight,
  interpolatePose,
  pointInRotatedRect,
  rotatePoint,
  solveMovingPortPose,
  smoothThrowVelocity,
  worldPort,
  wrapAngle
} from '../src/motion/kinetic-math.js';

const { Bodies, Composite, Constraint, Engine } = Matter;

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

test('joint ports require both proximity and opposing angles', () => {
  const socket = { x: 10, y: 0, normal: 0 };
  const plug = { x: -10, y: 0, normal: Math.PI };
  const aligned = evaluatePortSnap(
    { x: 100, y: 100, angle: 0 },
    socket,
    { x: 120, y: 100, angle: 0 },
    plug,
    { maxDistance: 1, maxAngle: 0.01 }
  );
  assert.equal(aligned.eligible, true);
  assert.ok(aligned.distance < 1e-9);
  assert.ok(aligned.angleError < 1e-9);

  const wrongDirection = evaluatePortSnap(
    { x: 100, y: 100, angle: 0 },
    socket,
    { x: 120, y: 100, angle: Math.PI },
    plug,
    { maxDistance: 25, maxAngle: 0.1 }
  );
  assert.equal(wrongDirection.eligible, false);
  assert.ok(wrongDirection.angleError > 3);
});

test('snap solving aligns ports across the negative-pi boundary', () => {
  const targetPose = { x: 50, y: 40, angle: -Math.PI + 0.02 };
  const targetPort = { x: 8, y: 0, normal: 0 };
  const movingPort = { x: -6, y: 0, normal: Math.PI };
  const solved = solveMovingPortPose(
    { x: 0, y: 0, angle: Math.PI - 0.02 },
    movingPort,
    targetPose,
    targetPort
  );
  const targetWorld = worldPort(targetPose, targetPort);
  const solvedWorld = worldPort(solved, movingPort);

  assert.ok(Math.abs(wrapAngle(Math.PI + 0.02) - (-Math.PI + 0.02)) < 1e-9);
  assert.ok(Math.hypot(targetWorld.x - solvedWorld.x, targetWorld.y - solvedWorld.y) < 1e-9);
  assert.ok(Math.abs(wrapAngle(solvedWorld.normal - targetWorld.normal - Math.PI)) < 1e-9);
});

test('Matter constraints preserve aligned ports on rotated bodies', () => {
  const engine = Engine.create();
  engine.gravity.scale = 0;
  const movingPort = { x: 0, y: 20, normal: Math.PI / 2 };
  const targetPort = { x: 0, y: -29, normal: -Math.PI / 2 };
  const targetPose = { x: 200, y: 180, angle: -Math.PI / 6 };
  const solved = solveMovingPortPose(
    { x: 0, y: 0, angle: Math.PI / 3 },
    movingPort,
    targetPose,
    targetPort
  );
  const movingBody = Bodies.rectangle(solved.x, solved.y, 34, 40, {
    angle: solved.angle,
    isSensor: true
  });
  const targetBody = Bodies.rectangle(targetPose.x, targetPose.y, 50, 58, {
    angle: targetPose.angle,
    isStatic: true,
    isSensor: true
  });
  const joint = Constraint.create({
    bodyA: movingBody,
    pointA: rotatePoint(movingPort, movingBody.angle),
    bodyB: targetBody,
    pointB: rotatePoint(targetPort, targetBody.angle),
    length: 0,
    stiffness: 1
  });
  Composite.add(engine.world, [movingBody, targetBody, joint]);

  for (let tick = 0; tick < 10; tick += 1) Engine.update(engine, 1000 / 60);

  const movingWorld = worldPort({
    x: movingBody.position.x,
    y: movingBody.position.y,
    angle: movingBody.angle
  }, movingPort);
  const targetWorld = worldPort({
    x: targetBody.position.x,
    y: targetBody.position.y,
    angle: targetBody.angle
  }, targetPort);
  assert.ok(Math.hypot(movingWorld.x - targetWorld.x, movingWorld.y - targetWorld.y) < 0.01);
  Engine.clear(engine);
});

test('small limbs keep a padded hit area without changing geometry', () => {
  const pose = { x: 100, y: 100, angle: Math.PI / 2 };
  assert.equal(pointInRotatedRect({ x: 100, y: 118 }, pose, 16, 40, 0), false);
  assert.equal(pointInRotatedRect({ x: 100, y: 118 }, pose, 16, 40, 12), true);
  assert.equal(pointInRotatedRect({ x: 140, y: 140 }, pose, 16, 40, 12), false);
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
