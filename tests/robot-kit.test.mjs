import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import Matter from 'matter-js';
import { ROBOT_GEOMETRY, getRobotAssembly, localRobotPort } from '../src/motion/robot-kit.js';
import { evaluatePortSnap, rotatePoint, worldPort } from '../src/motion/kinetic-math.js';
import { getSnapTuning } from '../src/motion/robot-config.js';

test('the authored bearing centers coincide with the physical joint axes', async () => {
  for (const [asset, geometry] of Object.entries(ROBOT_GEOMETRY)) {
    const svg = await readFile(new URL(`../src/assets/kinetic-robot/${asset}.svg`, import.meta.url), 'utf8');
    assert.match(svg, new RegExp(`viewBox="0 0 ${geometry.width} ${geometry.height}"`));
    assert.doesNotMatch(svg, /<(?:image|script|text|filter|foreignObject|pattern)\b/);
    for (const port of geometry.ports) {
      const circle = svg.match(new RegExp(`<circle\\b(?=[^>]*data-joint="${port.id}")[^>]*>`))?.[0];
      assert.ok(circle, `${asset}/${port.id} has an authored bearing`);
      assert.equal(Number(circle.match(/\bcx="([\d.]+)"/)?.[1]), port.x, `${asset}/${port.id} x`);
      assert.equal(Number(circle.match(/\bcy="([\d.]+)"/)?.[1]), port.y, `${asset}/${port.id} y`);
      assert.ok(port.x > 0 && port.x < geometry.width && port.y > 0 && port.y < geometry.height);
    }
  }
});

test('all ten joints remain coincident in the static assembled pose', () => {
  const pieces = getRobotAssembly();
  const byId = new Map(pieces.map((piece) => [piece.id, piece]));
  assert.equal(pieces.length, 11);
  for (const child of pieces.filter((piece) => piece.parent)) {
    const parent = byId.get(child.parent);
    const a = worldPort(parent, localRobotPort(parent, parent.ports.find((p) => p.id === child.socket)));
    const b = worldPort(child, localRobotPort(child, child.ports.find((p) => p.id === child.plug)));
    assert.ok(Math.hypot(a.x - b.x, a.y - b.y) < 1e-9, `${child.id} remains attached`);
  }
});

test('inset bearing pairs are reachable before rectangle collisions block the snap', () => {
  const pieces = getRobotAssembly();
  const byId = new Map(pieces.map((piece) => [piece.id, piece]));
  for (const scale of [1.55, 1.75, 2, 2.06]) {
    for (const coarse of [false, true]) for (const child of pieces.filter((piece) => piece.parent)) {
      const tuning = getSnapTuning(coarse, Math.min(scale, 1.4));
      for (const angleError of [0, -tuning.angle, tuning.angle]) {
        const parent = byId.get(child.parent);
        const socket = localRobotPort(parent, parent.ports.find((p) => p.id === child.socket), scale);
        const plug = localRobotPort(child, child.ports.find((p) => p.id === child.plug), scale);
        const normal = { x: Math.cos(socket.normal), y: Math.sin(socket.normal) };
        const angle = socket.normal + Math.PI - plug.normal + angleError;
        const movingOffset = rotatePoint(plug, angle);
        const shape = (piece, a) => Matter.Bodies.rectangle(0, 0, piece.width * scale, piece.height * scale,
          { angle: a, chamfer: { radius: Math.min(piece.width, piece.height) * scale * 0.14, quality: 4 } });
        const project = (p) => p.x * normal.x + p.y * normal.y;
        const targetExtent = Math.max(...shape(parent, 0).vertices.map(project));
        const movingExtent = -Math.min(...shape(child, angle).vertices.map(project));
        const targetInset = targetExtent - socket.x * normal.x - socket.y * normal.y;
        const movingInset = movingExtent + movingOffset.x * normal.x + movingOffset.y * normal.y;
        const gap = targetInset + movingInset + 0.5;
        const movingPose = { x: socket.x - movingOffset.x + normal.x * gap, y: socket.y - movingOffset.y + normal.y * gap, angle };
        const result = evaluatePortSnap(movingPose, plug, { x: 0, y: 0, angle: 0 }, socket,
          { maxDistance: tuning.distance, maxAngle: tuning.angle + 1e-9 });
        assert.ok(result.eligible, `${child.id} at scale ${scale}, angle ${angleError}: ${result.distance.toFixed(2)}px before contact`);
      }
    }
  }
});
