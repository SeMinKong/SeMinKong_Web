import assert from 'node:assert/strict';
import Matter from 'matter-js';
import test from 'node:test';
import {
  WORLD_LIGHT_ANCHOR,
  alignPosePositionToPort,
  calculateJointServo,
  capVectorMagnitude,
  evaluatePortSnap,
  getWorldLight,
  interpolatePose,
  limitRelativeAngularVelocity,
  pointInRotatedRect,
  projectJointLimit,
  rotatePoint,
  solveMovingPortPose,
  smoothThrowVelocity,
  worldPort,
  wrapAngle
} from '../src/motion/kinetic-math.js';

const { Body, Bodies, Composite, Constraint, Engine } = Matter;

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

test('joint servo wraps relative angles and caps soft-limit correction', () => {
  const wrapped = calculateJointServo({
    parentAngle: 3.1,
    childAngle: -3.1,
    centerStrength: 0.1,
    maxCorrection: 0.02
  });
  assert.ok(wrapped.error > 0.08 && wrapped.error < 0.09);
  assert.ok(wrapped.correction > 0);

  const limited = calculateJointServo({
    parentAngle: 0,
    childAngle: 2.4,
    softLimit: 0.9,
    centerStrength: 0,
    limitStrength: 0.1,
    maxCorrection: 0.017
  });
  assert.ok(Math.abs(limited.excess - 1.5) < 1e-9);
  assert.equal(limited.correction, 0.017);

  const damped = calculateJointServo({
    relativeVelocity: -0.08,
    damping: 0.2,
    maxCorrection: 0.02
  });
  assert.equal(damped.error, 0);
  assert.ok(damped.correction < 0);

  const positiveRestOffset = calculateJointServo({
    parentAngle: 0.4,
    childAngle: 0.4 + Math.PI / 2 + 0.2,
    restAngle: Math.PI / 2,
    centerStrength: 0.1,
    maxCorrection: 0.03
  });
  const negativeRestOffset = calculateJointServo({
    parentAngle: 0.4,
    childAngle: 0.4 - Math.PI / 2 - 0.2,
    restAngle: -Math.PI / 2,
    centerStrength: 0.1,
    maxCorrection: 0.03
  });
  assert.ok(positiveRestOffset.correction > 0);
  assert.ok(negativeRestOffset.correction < 0);

  const freeInsideLimit = calculateJointServo({
    childAngle: 0.5,
    softLimit: 0.9,
    centerStrength: 0,
    limitStrength: 0.1,
    damping: 0
  });
  assert.equal(freeInsideLimit.correction, 0);

  const heldPoseWithFixedLimit = calculateJointServo({
    parentAngle: 0,
    childAngle: 0.62,
    centerAngle: 0.52,
    limitAngle: 0,
    softLimit: 0.7,
    centerStrength: 0.1,
    limitStrength: 0.2,
    damping: 0,
    maxCorrection: 0.05
  });
  assert.ok(Math.abs(heldPoseWithFixedLimit.error - 0.1) < 1e-9);
  assert.ok(Math.abs(heldPoseWithFixedLimit.limitError - 0.62) < 1e-9);
  assert.equal(heldPoseWithFixedLimit.excess, 0);
  assert.ok(heldPoseWithFixedLimit.correction > 0);

  const heldPoseBeyondFixedLimit = calculateJointServo({
    parentAngle: 0,
    childAngle: 0.9,
    centerAngle: 0.9,
    limitAngle: 0,
    softLimit: 0.7,
    centerStrength: 0.1,
    limitStrength: 0.2,
    damping: 0,
    maxCorrection: 0.05
  });
  assert.equal(heldPoseBeyondFixedLimit.error, 0);
  assert.ok(Math.abs(heldPoseBeyondFixedLimit.excess - 0.2) < 1e-9);
  assert.ok(heldPoseBeyondFixedLimit.correction > 0);
});

test('joint relative velocity limiter preserves pair momentum', () => {
  const inverseSocket = 0.25;
  const inversePlug = 0.5;
  const socketVelocity = 0.2;
  const plugVelocity = 0.5;
  const beforeMomentum = socketVelocity / inverseSocket + plugVelocity / inversePlug;
  const limited = limitRelativeAngularVelocity({
    socketVelocity,
    plugVelocity,
    inverseSocket,
    inversePlug,
    maxRelativeVelocity: 0.06
  });
  const afterMomentum = limited.socketVelocity / inverseSocket
    + limited.plugVelocity / inversePlug;

  assert.ok(Math.abs(limited.relativeVelocity - 0.06) < 1e-12);
  assert.ok(Math.abs(limited.plugVelocity - limited.socketVelocity - 0.06) < 1e-12);
  assert.ok(Math.abs(afterMomentum - beforeMomentum) < 1e-12);
});

test('joint projection enforces a fixed base limit with inertia weighting', () => {
  const projection = projectJointLimit({
    parentAngle: 0.2,
    childAngle: 1.4,
    limitAngle: 0.1,
    softLimit: 0.7,
    inverseParent: 0.25,
    inverseChild: 0.75
  });

  assert.equal(projection.projected, true);
  assert.ok(Math.abs(projection.correction - 0.4) < 1e-12);
  assert.ok(Math.abs(wrapAngle(
    projection.childAngle - projection.parentAngle - 0.1
  ) - 0.7) < 1e-12);
  assert.ok(Math.abs(projection.parentAngle - 0.3) < 1e-12);
  assert.ok(Math.abs(projection.childAngle - 1.1) < 1e-12);

  const insideLimit = projectJointLimit({
    parentAngle: -0.2,
    childAngle: 0.15,
    limitAngle: 0,
    softLimit: 0.7,
    inverseParent: 0.25,
    inverseChild: 0.75
  });
  assert.equal(insideLimit.projected, false);
  assert.equal(insideLimit.parentAngle, -0.2);
  assert.equal(insideLimit.childAngle, 0.15);
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

test('completion pose alignment keeps articulated anchors joined at large angles', () => {
  const shoulderSocket = { x: 30, y: -12, normal: 0 };
  const shoulderPlug = { x: 0, y: -44, normal: -Math.PI / 2 };
  const elbowSocket = { x: 0, y: 44, normal: Math.PI / 2 };
  const elbowPlug = { x: 0, y: -43, normal: -Math.PI / 2 };
  const chest = { x: 240, y: 210, angle: -0.04 };
  const upperArm = alignPosePositionToPort(
    { x: 0, y: 0, angle: -2.62 },
    shoulderPlug,
    chest,
    shoulderSocket
  );
  const forearm = alignPosePositionToPort(
    { x: 0, y: 0, angle: -2.92 },
    elbowPlug,
    upperArm,
    elbowSocket
  );

  const shoulderAnchor = worldPort(chest, shoulderSocket);
  const upperShoulderAnchor = worldPort(upperArm, shoulderPlug);
  const elbowAnchor = worldPort(upperArm, elbowSocket);
  const forearmElbowAnchor = worldPort(forearm, elbowPlug);

  assert.ok(Math.hypot(
    shoulderAnchor.x - upperShoulderAnchor.x,
    shoulderAnchor.y - upperShoulderAnchor.y
  ) < 1e-9);
  assert.ok(Math.hypot(
    elbowAnchor.x - forearmElbowAnchor.x,
    elbowAnchor.y - forearmElbowAnchor.y
  ) < 1e-9);
  assert.equal(upperArm.angle, -2.62);
  assert.equal(forearm.angle, -2.92);
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
    stiffness: 0.84,
    damping: 0.24
  });
  Composite.add(engine.world, [movingBody, targetBody, joint]);
  Body.translate(movingBody, { x: 6, y: -4 });
  Body.setVelocity(movingBody, { x: 2.4, y: -1.6 });

  for (let tick = 0; tick < 60; tick += 1) {
    Engine.update(engine, 1000 / 120);
    Engine.update(engine, 1000 / 120);
  }

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
  assert.ok(Math.hypot(movingWorld.x - targetWorld.x, movingWorld.y - targetWorld.y) < 0.25);
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
