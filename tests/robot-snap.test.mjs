import test from 'node:test';
import assert from 'node:assert/strict';
import Matter from 'matter-js';
import { createRobotSnap, blendSnapPose } from '../src/motion/robot-snap.js';
import { getSnapTuning } from '../src/motion/robot-config.js';
import { worldPort } from '../src/motion/kinetic-math.js';

const { Bodies, Body } = Matter;
const deg = (n) => n * Math.PI / 180;
const poseOf = (body) => ({ ...body.position, angle: body.angle });
const close = (a, b) => assert.ok(Math.abs(a - b) < 1e-8, `${a} ≠ ${b}`);

const harness = ({ angle = 30, coarse = false, canPlace = () => true, branch = false } = {}) => {
  const moving = Bodies.rectangle(215, 300, 40, 30, { angle: deg(angle) });
  const target = Bodies.rectangle(300, 300, 40, 30);
  const child = Bodies.rectangle(170, 330, 20, 20, { angle: deg(-20) });
  const plug = { id: 'plug', x: 20, y: 0, normal: 0, family: 'neck', polarity: 'plug' };
  const socket = { id: 'socket', x: -20, y: 0, normal: Math.PI, family: 'neck', polarity: 'socket' };
  const bodies = branch ? [moving, target, child] : [moving, target];
  const meta = new Map([[moving, { ports: [plug] }], [target, { ports: [socket] }], [child, { ports: [] }]]);
  const occupied = new Map();
  let pointer = { body: moving, phase: 'dragging', target: { ...moving.position } };
  const events = { start: 0, cancel: 0, commit: 0, progress: [] };
  const snap = createRobotSnap({
    dynamicBodies: bodies, bodyMeta: meta, occupiedPorts: occupied,
    getComponent: (body) => branch && body !== target ? [moving, child] : [body],
    getTuning: () => getSnapTuning(coarse, 1.4), getPointer: () => pointer, canPlace,
    onStart() { events.start++; }, onCancel() { events.cancel++; },
    onConnect(pair) {
      events.commit++;
      occupied.set(`${pair.movingBody.id}:${pair.movingPort.id}`, pair);
      occupied.set(`${pair.targetBody.id}:${pair.targetPort.id}`, pair);
      if (pointer) pointer.snappedDuringDrag = true;
    },
    onProgress(value) { if (value) events.progress.push(value.progress); }
  });
  return { snap, moving, target, child, plug, socket, occupied, events, bodies, meta,
    get pointer() { return pointer; }, set pointer(next) { pointer = next; },
    advance(ms, step = 10) { for (let t = 0; t < ms; t += step) snap.update(Math.min(step, ms - t)); }
  };
};

test('angle assistance advertises a wider range than it accepts', () => {
  const h = harness({ angle: 39 });
  h.advance(100);
  assert.ok(h.snap.hint);
  assert.equal(h.snap.active, false);
  assert.equal(h.snap.request(h.moving), false);
  const touch = harness({ angle: 39, coarse: true });
  assert.equal(touch.snap.request(touch.moving), true);
  const reversed = harness({ angle: 120 });
  reversed.advance(200);
  assert.equal(reversed.snap.hint, null);
});

test('80ms steady approach starts one capture, then commits only after 180ms', () => {
  const h = harness();
  h.advance(70); assert.equal(h.snap.active, false);
  h.advance(10); assert.equal(h.snap.active, true);
  h.advance(170); assert.equal(h.events.commit, 0);
  h.advance(10); assert.equal(h.events.commit, 1);
  h.advance(500); assert.equal(h.events.commit, 1);
  assert.equal(h.events.start, 1);
  const a = worldPort(poseOf(h.moving), h.plug), b = worldPort(poseOf(h.target), h.socket);
  close(a.x, b.x); close(a.y, b.y); close(h.moving.angle, 0);
});

test('fast pointer passes reset dwell instead of capturing', () => {
  const h = harness();
  for (let i = 0; i < 20; i++) {
    h.pointer.target.x += 15;
    h.snap.update(10);
  }
  assert.equal(h.events.start, 0);
});

test('leaving and returning to a candidate requires a fresh dwell', () => {
  const h = harness();
  h.advance(60);
  Body.setPosition(h.moving, { x: 50, y: 300 }); h.snap.update(10);
  Body.setPosition(h.moving, { x: 215, y: 300 }); h.advance(70);
  assert.equal(h.events.start, 0);
  h.advance(10); assert.equal(h.events.start, 1);
});

test('a nearby eligible joint replaces an older hint outside capture range', () => {
  const h = harness(); Body.setPosition(h.moving, { x: 197, y: 300 }); h.advance(10);
  assert.equal(h.snap.hint.targetBody, h.target);
  const closer = Bodies.rectangle(260, 300, 40, 30);
  h.bodies.push(closer); h.meta.set(closer, { ports: [{ ...h.socket, id: 'closer' }] });
  h.advance(80);
  assert.equal(h.snap.hint.targetBody, closer);
  assert.equal(h.snap.active, true);
});

test('release starts immediately and can finish with no pointer', () => {
  const h = harness();
  h.pointer = null;
  assert.equal(h.snap.request(h.moving), true);
  assert.equal(h.events.commit, 0);
  h.advance(180);
  assert.equal(h.events.commit, 1);
});

test('release during alignment preserves progress and finishes exactly once', () => {
  const h = harness(); h.advance(140);
  h.pointer = null;
  assert.equal(h.snap.request(h.moving), true);
  h.advance(120);
  assert.equal(h.events.start, 1); assert.equal(h.events.commit, 1);
});

test('a released capture cancels if its target moves or turns away', () => {
  for (const moveTarget of [
    (body) => Body.setPosition(body, { x: 600, y: 300 }),
    (body) => Body.setAngle(body, Math.PI / 2)
  ]) {
    const h = harness(); h.pointer = null; h.snap.request(h.moving); h.advance(60);
    moveTarget(h.target); h.advance(120);
    assert.equal(h.events.commit, 0); assert.equal(h.events.cancel, 1);
  }
});

test('temporary collision exclusion is restored on both cancel and completion', () => {
  for (const cancel of [true, false]) {
    const h = harness({ branch: true });
    h.moving.collisionFilter.group = h.child.collisionFilter.group = -123;
    h.target.collisionFilter.group = -456;
    h.snap.request(h.moving);
    assert.equal(h.moving.collisionFilter.group, h.target.collisionFilter.group);
    assert.equal(h.child.collisionFilter.group, h.target.collisionFilter.group);
    if (cancel) h.snap.reset(); else h.advance(180);
    assert.equal(h.moving.collisionFilter.group, -123);
    assert.equal(h.child.collisionFilter.group, -123);
    assert.equal(h.target.collisionFilter.group, -456);
  }
});

test('detaching during capture cancels before another connection can be committed', () => {
  const h = harness(); h.advance(130);
  h.pointer.skipSnapUntilRelease = true; h.advance(200);
  assert.equal(h.events.cancel, 1); assert.equal(h.events.commit, 0);
});

test('pointer retreat cancels capture and returns control without connecting', () => {
  const h = harness(); h.advance(120);
  h.pointer.target.x -= 100; h.snap.update(10);
  assert.equal(h.snap.active, false); assert.equal(h.events.cancel, 1);
  assert.equal(h.events.commit, 0);
});

test('reset cancels capture and discards accumulated dwell across lifecycle changes', () => {
  const h = harness(); h.advance(70); h.snap.reset(); h.advance(70);
  assert.equal(h.events.start, 0);
  h.advance(30); h.snap.reset(); h.pointer = null; h.advance(400);
  assert.equal(h.events.cancel, 1); assert.equal(h.events.commit, 0);
  assert.equal(h.snap.hint, null);
});

test('occupied or incompatible ports cannot become candidates or commit mid-capture', () => {
  const h = harness(); h.socket.family = 'knee'; h.advance(300);
  assert.equal(h.events.start, 0);
  h.socket.family = 'neck'; h.socket.polarity = 'plug'; h.advance(300);
  assert.equal(h.events.start, 0);
  h.socket.polarity = 'socket'; h.advance(100);
  h.occupied.set(`${h.target.id}:${h.socket.id}`, {}); h.advance(200);
  assert.equal(h.events.cancel, 1); assert.equal(h.events.commit, 0);
});

test('flex posing and a just-detached gesture never attract a new joint', () => {
  for (const flag of ['flexConnection', 'skipSnapUntilRelease', 'snappedDuringDrag']) {
    const h = harness(); h.pointer[flag] = true; h.advance(400);
    assert.equal(h.events.start, 0, flag);
  }
});

test('an assembled branch preserves its shape throughout magnetic alignment', () => {
  const h = harness({ branch: true });
  const distance = Math.hypot(h.child.position.x - h.moving.position.x, h.child.position.y - h.moving.position.y);
  const relativeAngle = h.child.angle - h.moving.angle;
  h.snap.request(h.moving);
  for (let i = 0; i < 18; i++) {
    h.snap.update(10);
    close(Math.hypot(h.child.position.x - h.moving.position.x, h.child.position.y - h.moving.position.y), distance);
    close(h.child.angle - h.moving.angle, relativeAngle);
  }
  assert.equal(h.events.commit, 1);
});

test('blocked rotation paths are rejected before any body is moved', () => {
  const h = harness({ canPlace: () => false });
  const before = poseOf(h.moving);
  assert.equal(h.snap.request(h.moving), false);
  assert.deepEqual(poseOf(h.moving), before);
  assert.equal(h.events.start, 0);
});

test('elapsed-time timing is stable at 30, 60 and 120 updates per second', () => {
  for (const hz of [30, 60, 120]) {
    const h = harness(); let time = 0;
    while (h.events.commit === 0 && time < 500) { h.snap.update(1000 / hz); time += 1000 / hz; }
    assert.equal(h.events.commit, 1);
    assert.ok(time >= 260 - 1e-8 && time <= 260 + 2000 / hz);
  }
});

test('rigid interpolation uses the supplied shortest angular solution', () => {
  const result = blendSnapPose({ x: 10, y: 0, angle: deg(170) }, { x: 0, y: 0 },
    { x: 20, y: 30, deltaAngle: deg(20) }, 1);
  close(result.x, 20 + 10 * Math.cos(deg(20)));
  close(result.angle, deg(190));
});
