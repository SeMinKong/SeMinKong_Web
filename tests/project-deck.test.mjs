import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = (await readFile(new URL('../src/motion/project-deck.js', import.meta.url), 'utf8'))
  .replace('export const initProjectDeck =', 'const initProjectDeck =') + '\ninitProjectDeck;';

class Target {
  listeners = new Map();
  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }
  removeEventListener(type, listener) { this.listeners.get(type)?.delete(listener); }
  dispatch(type, overrides = {}) {
    const event = {
      type, target: this, pointerId: 1, pointerType: 'mouse', isPrimary: true, button: 0,
      clientX: 100, clientY: 100, timeStamp: 10, detail: 1, defaultPrevented: false, stopped: false,
      preventDefault() { this.defaultPrevented = true; },
      stopPropagation() { this.stopped = true; }, ...overrides
    };
    for (const listener of [...(this.listeners.get(type) ?? [])]) listener(event);
    return event;
  }
}

const makeNode = () => {
  const node = new Target();
  const classes = new Set();
  node.classList = {
    add: (...names) => names.forEach((name) => classes.add(name)),
    remove: (...names) => names.forEach((name) => classes.delete(name)),
    contains: (name) => classes.has(name),
    toggle: (name, active) => active ? classes.add(name) : classes.delete(name)
  };
  node.style = { removeProperty(name) { delete this[name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())]; } };
  node.dataset = {};
  node.offsetWidth = 300;
  node.setAttribute = () => {};
  node.querySelectorAll = () => [];
  node.cloneNode = makeNode;
  node.remove = () => {};
  return node;
};

const createHarness = (motion = 'full') => {
  const root = makeNode();
  const stage = makeNode();
  const originals = Array.from({ length: 6 }, makeNode);
  const window = new Target();
  const document = new Target();
  const environment = { motion, depth: motion === 'full' ? 'interactive' : 'static' };
  const captures = [];
  const releases = [];
  const captured = new Set();
  const frames = new Map();
  let frameId = 0;
  let clock = 0;
  root.querySelector = () => stage;
  root.querySelectorAll = () => originals;
  root.matches = () => true;
  stage.clientWidth = 1280;
  stage.append = () => {};
  stage.setPointerCapture = (id) => { captures.push(id); captured.add(id); };
  stage.hasPointerCapture = (id) => captured.has(id);
  stage.releasePointerCapture = (id) => {
    releases.push(id);
    captured.delete(id);
    stage.dispatch('lostpointercapture', { pointerId: id });
  };
  document.querySelector = () => root;
  document.hidden = false;
  window.requestAnimationFrame = (callback) => { frames.set(++frameId, callback); return frameId; };
  window.cancelAnimationFrame = (id) => frames.delete(id);
  class ResizeObserver { observe() {} unobserve() {} disconnect() {} }
  const init = runInNewContext(source, { document, window, ResizeObserver });
  const controller = init(environment);
  return {
    root, stage, originals, window, document, captures, releases, frames,
    tick() {
      clock += 16.7;
      for (const [id, callback] of [...frames]) { frames.delete(id); callback(clock); }
    },
    drag() {
      stage.dispatch('pointerdown');
      window.dispatch('pointermove', { clientX: 120, timeStamp: 30 });
    },
    changeMotion(next) {
      environment.motion = next;
      environment.depth = next === 'full' ? 'interactive' : 'flat';
      window.dispatch('portfolio:environment-change');
    },
    destroy() { controller.destroy(); }
  };
};

test('stationary and 6px presses preserve native clicks without capturing or moving the ring', (t) => {
  const h = createHarness();
  t.after(() => h.destroy());
  const initial = h.stage.style.transform;
  h.stage.dispatch('pointerdown');
  h.root.dispatch('focusin', { target: { closest: () => h.originals[2] } });
  h.window.dispatch('pointermove', { clientX: 106 });
  h.tick();
  assert.equal(h.stage.style.transform, initial, 'pointer focus must not move the pressed card');
  assert.deepEqual(h.captures, []);
  assert.equal(h.root.classList.contains('is-dragging'), false);
  h.window.dispatch('pointerup');
  assert.equal(h.root.dispatch('click').defaultPrevented, false);
  assert.equal(h.root.dispatch('click', { detail: 0, pointerId: -1 }).defaultPrevented, false);
});

test('confirmed drag captures once and suppresses only its matching pointer click', (t) => {
  const h = createHarness();
  t.after(() => h.destroy());
  const initial = h.stage.style.transform;
  h.drag();
  h.window.dispatch('pointermove', { clientX: 150, timeStamp: 50 });
  h.tick();
  assert.deepEqual(h.captures, [1]);
  assert.notEqual(h.stage.style.transform, initial);
  h.window.dispatch('pointerup');
  assert.deepEqual(h.releases, [1]);
  assert.equal(h.root.classList.contains('is-dragging'), false);
  assert.equal(h.root.dispatch('click', { detail: 0, pointerId: -1 }).defaultPrevented, false);
  assert.equal(h.root.dispatch('click', { pointerId: 2 }).defaultPrevented, false);
  const click = h.root.dispatch('click');
  assert.equal(click.defaultPrevented, true);
  assert.equal(click.stopped, true);
  assert.equal(h.root.dispatch('click').defaultPrevented, false);
});

test('release outside the stage clears an uncaptured press', (t) => {
  const h = createHarness();
  t.after(() => h.destroy());
  h.stage.dispatch('pointerdown');
  h.window.dispatch('pointerup');
  h.window.dispatch('pointermove', { clientX: 180 });
  assert.deepEqual(h.captures, []);
  h.drag();
  assert.deepEqual(h.captures, [1]);
});

test('vertical dragging does not turn the ring or activate the pressed link', (t) => {
  const h = createHarness();
  t.after(() => h.destroy());
  const initial = h.stage.style.transform;
  h.stage.dispatch('pointerdown');
  h.window.dispatch('pointermove', { clientY: 200, timeStamp: 30 });
  h.tick();
  assert.deepEqual(h.captures, [1]);
  assert.equal(h.stage.style.transform, initial);
  h.window.dispatch('pointerup');
  assert.equal(h.root.dispatch('click').defaultPrevented, true);
  h.stage.dispatch('pointerdown');
  h.window.dispatch('pointerup');
  assert.equal(h.root.dispatch('click').defaultPrevented, false);
});

test('transferring implicit capture from a descendant does not cancel the stage drag', (t) => {
  const h = createHarness();
  t.after(() => h.destroy());
  h.drag();
  h.stage.dispatch('lostpointercapture', { target: h.originals[0] });
  assert.equal(h.root.classList.contains('is-dragging'), true);
  assert.deepEqual(h.releases, []);
  h.window.dispatch('pointerup');
  assert.equal(h.root.dispatch('click').defaultPrevented, true);
});

for (const reason of ['pointercancel', 'lostpointercapture', 'blur', 'hidden', 'pagehide', 'disable', 'destroy']) {
  test(`${reason} clears drag capture and does not poison the next click or Enter`, (t) => {
    const h = createHarness();
    if (reason !== 'destroy') t.after(() => h.destroy());
    h.drag();
    if (reason === 'lostpointercapture') h.stage.dispatch(reason);
    else if (reason === 'hidden') { h.document.hidden = true; h.document.dispatch('visibilitychange'); }
    else if (reason === 'disable') h.changeMotion('reduced');
    else if (reason === 'destroy') h.destroy();
    else h.window.dispatch(reason);
    assert.equal(h.root.classList.contains('is-dragging'), false);
    assert.deepEqual(h.releases, [1]);
    assert.equal(h.root.dispatch('click').defaultPrevented, false);
    assert.equal(h.root.dispatch('click', { detail: 0, pointerId: -1 }).defaultPrevented, false);
  });
}

test('fresh presses reset stale click suppression when a drag generated no click', (t) => {
  const h = createHarness();
  t.after(() => h.destroy());
  h.drag();
  h.window.dispatch('pointerup');
  h.stage.dispatch('pointerdown');
  h.window.dispatch('pointerup');
  assert.equal(h.root.dispatch('click').defaultPrevented, false);
});

test('modified clicks, non-primary buttons and secondary pointers remain native', (t) => {
  const h = createHarness();
  t.after(() => h.destroy());
  for (const overrides of [{ ctrlKey: true }, { metaKey: true }, { shiftKey: true }, { altKey: true }, { button: 1 }, { button: 2 }, { isPrimary: false }]) {
    h.stage.dispatch('pointerdown', overrides);
    h.window.dispatch('pointermove', { clientX: 130 });
    h.window.dispatch('pointerup');
    assert.equal(h.root.dispatch('click', overrides).defaultPrevented, false);
  }
  assert.deepEqual(h.captures, []);
  h.stage.dispatch('pointerdown');
  h.stage.dispatch('pointerdown', { pointerId: 2, clientX: 200 });
  h.window.dispatch('pointermove', { pointerId: 2, clientX: 250 });
  h.window.dispatch('pointerup', { pointerId: 2 });
  h.window.dispatch('pointermove', { clientX: 120 });
  assert.deepEqual(h.captures, [1]);
});

test('keyboard focus still aligns cards; lite/reduced keep static native links', (t) => {
  const h = createHarness();
  t.after(() => h.destroy());
  const initial = h.stage.style.transform;
  h.root.dispatch('focusin', { target: { closest: () => h.originals[2] } });
  h.tick();
  assert.notEqual(h.stage.style.transform, initial);
  for (const motion of ['lite', 'reduced']) {
    h.changeMotion(motion);
    h.drag();
    h.window.dispatch('pointerup');
    assert.equal(h.root.classList.contains('is-carousel'), false);
    assert.equal(h.root.dispatch('click').defaultPrevented, false);
  }
  assert.deepEqual(h.captures, []);
});

test('destroy removes global gesture listeners and animation frames', () => {
  const h = createHarness();
  h.drag();
  h.destroy();
  for (const target of [h.root, h.stage, h.window, h.document]) {
    for (const listeners of target.listeners.values()) assert.equal(listeners.size, 0);
  }
  assert.equal(h.frames.size, 0);
});
