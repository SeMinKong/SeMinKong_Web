import assert from 'node:assert/strict';
import test from 'node:test';
import Matter from 'matter-js';
import { worldPort } from '../src/motion/kinetic-math.js';
import { getRobotAssembly, localRobotPort } from '../src/motion/robot-kit.js';
import {
  PART_SPECS,
  REQUIRED_CONNECTIONS,
  getInitialRobotPose,
  getRobotBodyOptions,
  getScale
} from '../src/motion/robot-config.js';
import {
  applyCompletionBlend,
  buildCompletionTargets
} from '../src/motion/robot-completion.js';

const { Bodies, Body } = Matter;
const TOLERANCE = 1e-9;
const VIEWPORTS = [
  { width: 390, height: 844, topBoundary: 64 },
  { width: 768, height: 1024, topBoundary: 64 },
  { width: 1280, height: 720, topBoundary: 64 }
];

const createPart = (spec, scale, pose) => Bodies.rectangle(
  pose.x, pose.y, spec.width * scale, spec.height * scale,
  { ...getRobotBodyOptions(spec, spec.width * scale, spec.height * scale, scale), angle: pose.angle }
);

const createPuzzle = (viewport, reverseConnections = false) => {
  const scale = getScale(viewport.width);
  const bodyMeta = new Map();
  const idToBody = new Map();
  const dynamicBodies = [];
  const assembly = getRobotAssembly();

  for (const spec of PART_SPECS) {
    const pose = getInitialRobotPose(spec, { ...viewport, scale, coarsePointer: false });
    const body = createPart(spec, scale, pose);
    bodyMeta.set(body, { spec, width: spec.width * scale, height: spec.height * scale });
    idToBody.set(spec.id, body);
    dynamicBodies.push(body);
  }

  const connections = assembly.filter((piece) => piece.parent).map((piece, index) => {
    const parent = assembly.find((candidate) => candidate.id === piece.parent);
    const bodyA = idToBody.get(parent.id);
    const bodyB = idToBody.get(piece.id);
    const portA = localRobotPort(parent, parent.ports.find((port) => port.id === piece.socket), scale);
    const portB = localRobotPort(piece, piece.ports.find((port) => port.id === piece.plug), scale);

    // Assembly must work independently of the body ordering stored by snapping.
    return reverseConnections && index % 2 === 0
      ? { bodyA: bodyB, bodyB: bodyA, portA: portB, portB: portA }
      : { bodyA, bodyB, portA, portB };
  });
  if (reverseConnections) connections.reverse();

  return { dynamicBodies, bodyMeta, idToBody, connections };
};

const bodyPose = (body) => ({ ...body.position, angle: body.angle });
const targetsById = (puzzle, targets) => [...puzzle.idToBody]
  .map(([id, body]) => ({ id, ...targets.get(body) }));

const assertConnectedAnchors = (puzzle) => {
  for (const { bodyA, bodyB, portA, portB } of puzzle.connections) {
    const a = worldPort(bodyPose(bodyA), portA);
    const b = worldPort(bodyPose(bodyB), portB);
    assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < TOLERANCE, `${portA.family} anchor separated`);
  }
};

test('responsive scatter keeps rotated Matter parts inside the stage and below navigation', () => {
  for (const viewport of VIEWPORTS) {
    for (const coarsePointer of [false, true]) {
      const scale = getScale(viewport.width);
      for (const spec of PART_SPECS) {
        const pose = getInitialRobotPose(spec, { ...viewport, scale, coarsePointer });
        const body = createPart(spec, scale, pose);
        const label = `${viewport.width}px ${coarsePointer ? 'coarse' : 'fine'} ${spec.id}`;
        assert.ok(body.bounds.min.x >= 8, `${label}: left edge`);
        assert.ok(body.bounds.max.x <= viewport.width - 8, `${label}: right edge`);
        assert.ok(body.bounds.min.y >= viewport.topBoundary + 8, `${label}: navigation overlap`);
        assert.ok(body.bounds.max.y <= viewport.height - 8, `${label}: bottom edge`);
      }
    }
  }
});

test('robot mass stays stable as the same part grows across responsive scales', () => {
  for (const spec of PART_SPECS) {
    const baseline = createPart(spec, 1, { x: 0, y: 0, angle: 0 }).mass;
    for (const width of [390, 768, 1280, 1600]) {
      const body = createPart(spec, getScale(width), { x: 0, y: 0, angle: 0 });
      assert.ok(Math.abs(body.mass - baseline) < TOLERANCE, `${spec.id} mass changed at ${width}px`);
    }
  }
});

test('completion targets contain all eleven parts and ignore connection direction or insertion order', () => {
  for (const viewport of VIEWPORTS) {
    const forward = createPuzzle(viewport);
    const reversed = createPuzzle(viewport, true);
    assert.equal(forward.dynamicBodies.length, 11);
    assert.equal(forward.connections.length, REQUIRED_CONNECTIONS);

    for (const raised of [false, true]) {
      const targets = buildCompletionTargets(forward, viewport, raised);
      const reversedTargets = buildCompletionTargets(reversed, viewport, raised);
      assert.equal(targets.size, 11);
      assert.deepEqual(targetsById(forward, targets), targetsById(reversed, reversedTargets));
      applyCompletionBlend(forward, targets, targets, 1);
      assertConnectedAnchors(forward);

      for (const body of forward.dynamicBodies) {
        assert.ok(Number.isFinite(body.position.x) && Number.isFinite(body.position.y) && Number.isFinite(body.angle));
        assert.ok(body.bounds.min.x >= -TOLERANCE && body.bounds.max.x <= viewport.width + TOLERANCE);
        assert.ok(body.bounds.min.y >= viewport.topBoundary - TOLERANCE && body.bounds.max.y <= viewport.height + TOLERANCE);
      }
    }
  }
});

test('completion blending holds every joint together while raising the right arm', () => {
  for (const viewport of VIEWPORTS) {
    for (const reverseConnections of [false, true]) {
      const puzzle = createPuzzle(viewport, reverseConnections);
      const scattered = new Map(puzzle.dynamicBodies.map((body) => [body, bodyPose(body)]));
      const neutral = buildCompletionTargets(puzzle, viewport, false);
      const raised = buildCompletionTargets(puzzle, viewport, true);

      for (const [from, to] of [[scattered, neutral], [neutral, raised]]) {
        for (const progress of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
          // Completion replaces the live solver's momentum with its controlled pose.
          for (const body of puzzle.dynamicBodies) {
            Body.setVelocity(body, { x: 3, y: -2 });
            Body.setAngularVelocity(body, 0.1);
          }
          applyCompletionBlend(puzzle, from, to, progress);
          assertConnectedAnchors(puzzle);
          for (const body of puzzle.dynamicBodies) {
            assert.ok(Math.hypot(body.velocity.x, body.velocity.y) < TOLERANCE);
            assert.ok(Math.abs(body.angularVelocity) < TOLERANCE);
          }
        }
      }

      const rightHand = puzzle.idToBody.get('forearm-b');
      const leftHand = puzzle.idToBody.get('forearm-a');
      const chest = puzzle.idToBody.get('chest');
      assert.ok(rightHand.position.y < chest.position.y, 'right hand should finish above the chest');
      assert.ok(leftHand.position.y > chest.position.y, 'left hand should remain lowered');
      assert.ok(rightHand.position.y < neutral.get(rightHand).y, 'right hand must rise from its neutral pose');
    }
  }
});
