import test from 'node:test';
import assert from 'node:assert/strict';
import { createMagnetEffectState, getMagnetArcs, getMagnetContact, MAGNET_CONTACT_DURATION } from '../src/motion/robot-magnet-model.js';

test('electrical paths stay anchored and shrink safely as the bearings meet', () => {
  const a = { x: 20, y: 40 }, b = { x: 90, y: 105 };
  for (const lite of [false, true]) {
    for (const progress of [0.15, 0.45, 0.8]) {
      const arcs = getMagnetArcs(a, b, progress, lite);
      assert.equal(arcs.length, lite ? 1 : 2);
      assert.deepEqual(arcs[0].points[0], a);
      for (const arc of arcs) {
        assert.deepEqual(arc.points.at(-1), b);
        assert.ok(arc.points.length <= 7);
        assert.ok(arc.alpha > 0 && arc.alpha <= 1);
        assert.ok(arc.points.every((point) => Number.isFinite(point.x) && Number.isFinite(point.y)));
      }
    }
    assert.deepEqual(getMagnetArcs(a, a, 0.5, lite), []);
    assert.deepEqual(getMagnetArcs(a, b, 1, lite), []);
  }
});

test('crackle has stable geometry within each of its three phases', () => {
  const a = { x: 0, y: 0 }, b = { x: 100, y: 0 };
  const first = getMagnetArcs(a, b, 0.2)[0].points;
  assert.deepEqual(getMagnetArcs(a, b, 0.3)[0].points, first);
  const second = getMagnetArcs(a, b, 0.5)[0].points;
  const third = getMagnetArcs(a, b, 0.8)[0].points;
  assert.notDeepEqual(first, second);
  assert.notDeepEqual(second, third);
});

test('contact feedback is bounded and uses fewer sparks on touch and lite mode', () => {
  const anchor = { x: 300, y: 400 };
  for (const lite of [false, true]) {
    const first = getMagnetContact(anchor, 0, lite);
    const middle = getMagnetContact(anchor, 70, lite);
    const last = getMagnetContact(anchor, MAGNET_CONTACT_DURATION, lite);
    assert.equal(first.sparks.length, lite ? 3 : 5);
    assert.ok(middle.alpha < first.alpha && middle.alpha > 0);
    assert.equal(last.alpha, 0);
    for (const contact of [first, middle, last]) {
      assert.ok(contact.radius <= 15);
      for (const point of contact.sparks.flat()) {
        assert.ok(Math.hypot(point.x - anchor.x, point.y - anchor.y) <= 16);
      }
    }
  }
});

test('capture cancellation clears pending contact and never leaves an active effect', () => {
  const state = createMagnetEffectState();
  const pair = {};
  state.progress({ pair, progress: 0.5 });
  assert.equal(state.active, true);
  state.progress(null);
  assert.equal(state.active, false);
  state.connect(pair);
  state.progress(null);
  assert.equal(state.contact, null);
  assert.equal(state.active, false);
  state.connect(pair);
  state.clear();
  state.update(500);
  assert.equal(state.active, false);
});

test('contact lifetime uses elapsed time and remains queryable until completion', () => {
  for (const hz of [30, 60, 120]) {
    const state = createMagnetEffectState();
    state.setQuality(true);
    state.connect({});
    let elapsed = 0;
    while (elapsed + 1000 / hz < MAGNET_CONTACT_DURATION) {
      state.update(1000 / hz);
      elapsed += 1000 / hz;
      assert.equal(state.active, true);
    }
    state.update(MAGNET_CONTACT_DURATION - elapsed + 1e-8);
    assert.equal(state.active, false);
    assert.equal(state.lite, true);
  }
});
