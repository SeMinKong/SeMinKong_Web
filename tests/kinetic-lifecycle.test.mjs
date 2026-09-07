import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const facadeSource = await readFile(new URL('../src/motion/kinetic-sandbox.js', import.meta.url), 'utf8');
// Replace only the module boundary so the real facade runs against a deferred
// renderer factory; no WebGL or browser globals are needed in this lifecycle test.
const isolatedSource = facadeSource
  .replace('export const initKineticSandbox =', 'const initKineticSandbox =')
  .replace("import('./kinetic-sandbox-runtime.js')", 'loadRuntime()')
  + '\ninitKineticSandbox;';

class Target {
  listeners = new Map();

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatchEvent(event) {
    for (const listener of [...(this.listeners.get(event.type) ?? [])]) listener(event);
  }
}

const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

const createHarness = async ({ deferredMount = false } = {}) => {
  const environment = { motion: 'full', depth: 'interactive' };
  const window = new Target();
  const document = new Target();
  const stage = new Target();
  const canvas = new Target();
  const forcedColors = Object.assign(new Target(), { matches: false });
  const idle = new Map();
  let idleId = 0;
  let resolveMount;
  const mountGate = deferredMount ? new Promise((resolve) => { resolveMount = resolve; }) : null;
  const calls = { mounts: 0, starts: 0, stops: 0, destroys: 0, modes: [], warnings: [] };
  const controller = {
    setMode(mode) { calls.modes.push(mode); },
    start() { calls.starts += 1; },
    stop() { calls.stops += 1; },
    destroy() { calls.destroys += 1; },
    nudgeAt() {}
  };

  stage.dataset = {};
  canvas.style = { cursor: 'grab', removeProperty(name) { delete this[name]; } };
  stage.querySelector = (selector) => selector === '[data-kinetic-canvas]' ? canvas : null;
  document.hidden = false;
  document.querySelector = (selector) => selector === '[data-kinetic-stage]' ? stage : null;
  window.matchMedia = () => forcedColors;
  window.requestIdleCallback = (callback) => { idle.set(++idleId, callback); return idleId; };
  window.cancelIdleCallback = (id) => idle.delete(id);

  const initKineticSandbox = runInNewContext(isolatedSource, {
    window,
    document,
    console: { warn: (...args) => calls.warnings.push(args) },
    loadRuntime: async () => ({
      mountKineticSandbox: async () => {
        calls.mounts += 1;
        if (mountGate) await mountGate;
        return controller;
      }
    })
  });
  const facade = initKineticSandbox(environment);
  await flushPromises();

  return {
    calls,
    stage,
    canvas,
    idle,
    async runIdle() {
      for (const [id, callback] of [...idle]) { idle.delete(id); callback(); }
      await flushPromises();
    },
    changeMotion(motion) {
      environment.motion = motion;
      environment.depth = motion === 'full' ? 'interactive' : motion === 'reduced' ? 'flat' : 'static';
      window.dispatchEvent({ type: 'portfolio:environment-change', detail: { ...environment } });
    },
    async finishMount() { resolveMount?.(); await flushPromises(); },
    destroy() { facade.destroy(); }
  };
};

test('full/lite changes retain the mounted puzzle controller', async (t) => {
  const harness = await createHarness();
  t.after(() => harness.destroy());
  await harness.runIdle();
  harness.changeMotion('lite');
  harness.changeMotion('full');
  await harness.runIdle();

  assert.equal(harness.calls.mounts, 1);
  assert.equal(harness.calls.destroys, 0);
  assert.deepEqual(harness.calls.modes, ['full', 'lite', 'full']);
  assert.ok(harness.calls.starts > 0);
  assert.equal(harness.idle.size, 0);
  assert.equal(harness.calls.warnings.length, 0);
});

test('full/lite changes during initialization keep one mount and apply the latest mode', async (t) => {
  const harness = await createHarness({ deferredMount: true });
  t.after(() => harness.destroy());
  await harness.runIdle();
  assert.equal(harness.calls.mounts, 1);
  assert.equal(harness.calls.starts, 0);

  for (const motion of ['lite', 'full', 'lite']) {
    harness.changeMotion(motion);
    await harness.runIdle();
    assert.equal(harness.calls.mounts, 1, 'a pending renderer must not overlap another mount');
  }
  await harness.finishMount();

  assert.equal(harness.calls.destroys, 0);
  assert.deepEqual(harness.calls.modes, ['lite']);
  assert.equal(harness.calls.starts, 1);
  assert.equal(harness.idle.size, 0);
  assert.equal(harness.calls.warnings.length, 0);
});

test('reduced motion destroys the mounted controller and exposes the static fallback', async (t) => {
  const harness = await createHarness();
  t.after(() => harness.destroy());
  await harness.runIdle();
  harness.changeMotion('reduced');
  await harness.runIdle();

  assert.equal(harness.calls.mounts, 1);
  assert.equal(harness.calls.destroys, 1);
  assert.equal(harness.stage.dataset.kineticState, 'static');
  assert.equal(harness.canvas.style.cursor, undefined);
  assert.equal(harness.idle.size, 0);
  assert.equal(harness.calls.warnings.length, 0);
});
