import test from 'node:test';
import assert from 'node:assert/strict';
import { createRobotInput, getRobotReleaseTuning, isRobotTap } from '../src/motion/robot-input.js';

class Surface {
  children = [];
  dataset = {};
  style = {};
  listeners = new Map();
  captures = new Set();
  append(child) { this.children.push(child); child.parent = this; }
  setAttribute() {}
  closest() { return this.dataset.robotPart ? this : null; }
  remove() { this.parent.children = this.parent.children.filter((child) => child !== this); }
  addEventListener(type, callback) {
    const callbacks = this.listeners.get(type) ?? new Set();
    callbacks.add(callback); this.listeners.set(type, callbacks);
  }
  removeEventListener(type, callback) { this.listeners.get(type)?.delete(callback); }
  dispatch(type, event = {}) { for (const callback of this.listeners.get(type) ?? []) callback(event); }
  setPointerCapture(id) { this.captures.add(id); }
  hasPointerCapture(id) { return this.captures.has(id); }
  releasePointerCapture(id) { this.captures.delete(id); }
}

const setup = (t) => {
  const saved = { document: globalThis.document, window: globalThis.window };
  const doc = new Surface(), win = new Surface(), stage = new Surface(), canvas = new Surface();
  doc.createElement = () => new Surface();
  globalThis.document = doc; globalThis.window = win;
  const events = [];
  const input = createRobotInput({ stage, canvas, partIds: ['head', 'chest'],
    onDown: (e, id) => { events.push(['down', id]); return true; },
    onMove: () => events.push(['move']), onUp: () => events.push(['up']),
    onCancel: () => events.push(['cancel']), onHover() {}, onLeave() {}
  });
  const layer = stage.children[0], target = layer.children[0];
  const event = (overrides = {}) => ({ pointerId: 1, pointerType: 'touch', isPrimary: true, target, ...overrides });
  const down = (overrides = {}) => {
    const e = event(overrides);
    doc.dispatch('pointerdown', e);
    (e.target === canvas ? canvas : layer).dispatch('pointerdown', e);
    return e;
  };
  t.after(() => { input.destroy(); Object.assign(globalThis, saved); });
  return { input, doc, win, stage, canvas, layer, target, events, event, down };
};

test('touch starting on a part keeps moves outside the part; empty canvas never starts a touch drag', (t) => {
  const h = setup(t);
  h.down({ target: h.canvas });
  assert.equal(h.events.length, 0);
  h.win.dispatch('pointerup', h.event());
  h.down();
  assert.ok(h.target.hasPointerCapture(1));
  h.win.dispatch('pointermove', h.event({ target: h.canvas, clientX: -40, clientY: 500 }));
  h.win.dispatch('pointerup', h.event());
  assert.deepEqual(h.events, [['down', 'head'], ['move'], ['up']]);
  assert.equal(h.target.hasPointerCapture(1), false);
});

test('mouse canvas interaction is still routed without a touch target', (t) => {
  const h = setup(t);
  h.down({ pointerType: 'mouse', target: h.canvas });
  h.win.dispatch('pointermove', h.event({ pointerType: 'mouse' }));
  h.win.dispatch('pointerup', h.event({ pointerType: 'mouse' }));
  assert.deepEqual(h.events, [['down', null], ['move'], ['up']]);
});

test('pinch cancellation waits for native all-fingers-up even after both pointer streams end', (t) => {
  const h = setup(t);
  h.down(); h.doc.dispatch('touchstart', { touches: [1] });
  h.down({ pointerId: 2, isPrimary: false });
  h.doc.dispatch('touchstart', { touches: [1, 2] });
  h.win.dispatch('pointercancel', h.event());
  h.win.dispatch('pointercancel', h.event({ pointerId: 2 }));
  h.doc.dispatch('touchend', { touches: [1] });
  h.win.dispatch('pointermove', h.event());
  h.down({ pointerId: 3 });
  assert.deepEqual(h.events, [['down', 'head'], ['cancel']]);
  h.doc.dispatch('touchend', { touches: [] });
  h.down({ pointerId: 4 });
  assert.deepEqual(h.events.at(-1), ['down', 'head']);
  h.win.dispatch('pointerup', h.event({ pointerId: 4 }));
  assert.deepEqual(h.events.at(-1), ['up']);
});

test('capture loss or pointer cancellation discards ownership and permits the next gesture', (t) => {
  const h = setup(t);
  for (const reason of ['lostpointercapture', 'pointercancel']) {
    h.down();
    (reason === 'lostpointercapture' ? h.layer : h.win).dispatch(reason, h.event());
    h.win.dispatch('pointermove', h.event());
    h.win.dispatch('pointerup', h.event());
  }
  assert.deepEqual(h.events, [['down', 'head'], ['cancel'], ['down', 'head'], ['cancel']]);
  assert.equal(h.target.hasPointerCapture(1), false);
});

test('reset clears a captured pending touch and stale multi-touch state without committing it', (t) => {
  const h = setup(t);
  h.down(); h.doc.dispatch('touchstart', { touches: [1] });
  h.down({ pointerId: 2, isPrimary: false });
  h.doc.dispatch('touchstart', { touches: [1, 2] });
  h.input.reset(true);
  h.down({ pointerId: 3 });
  assert.deepEqual(h.events.at(-1), ['down', 'head']);
  h.input.reset(true);
  h.win.dispatch('pointerup', h.event({ pointerId: 3 }));
  assert.equal(h.events.some(([name]) => name === 'up'), false);
  assert.equal(h.target.captures.size, 0);
});

test('blur cancels and destruction removes all listeners, targets, and capture', (t) => {
  const h = setup(t);
  h.down(); h.win.dispatch('blur');
  assert.deepEqual(h.events.at(-1), ['cancel']);
  h.down(); h.input.destroy();
  h.win.dispatch('pointermove', h.event()); h.win.dispatch('pointerup', h.event());
  assert.deepEqual(h.events.at(-1), ['down', 'head']);
  assert.equal(h.target.captures.size, 0);
  assert.equal(h.stage.children.length, 0);
  assert.equal([...h.doc.listeners.values(), ...h.win.listeners.values()].some((s) => s.size), false);
});

test('mobile long holds and out-and-back drags cannot become tap rotations', () => {
  const gesture = { pointerType: 'touch', maxTravel: 3, startedAt: 100 };
  assert.equal(isRobotTap(gesture, 200), true);
  assert.equal(isRobotTap(gesture, 700), false);
  assert.equal(isRobotTap({ ...gesture, maxTravel: 90 }, 200), false);
  assert.equal(isRobotTap({ ...gesture, maxTravel: 6 }, 200), false);
});

test('touch releases cap translation and spin below mouse while keeping mouse response', () => {
  const touch = getRobotReleaseTuning(true), mouse = getRobotReleaseTuning(false);
  assert.ok(touch.maxSpeed < mouse.maxSpeed * 0.5);
  assert.ok(touch.maxSpin < mouse.maxSpin * 0.5);
  assert.ok(touch.pointerWeight < mouse.pointerWeight);
  assert.equal(mouse.maxSpeed, 11.5);
});
