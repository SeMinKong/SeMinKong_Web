import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { runInNewContext } from 'node:vm';

// Execute the actual controller against a small DOM/timeline fixture. The
// drawable fixture mirrors Anime's SVG attributes; browser QA uses Anime itself.
const controllerSource = (await readFile(new URL('../src/motion/home-intro.js', import.meta.url), 'utf8'))
  .replace(/^import .*;\r?\n/gm, '')
  .replace('export const initHomeIntro', 'const initHomeIntro');
const ownedAttributes = ['draw', 'pathLength', 'stroke-dasharray', 'stroke-dashoffset'];

const eventTarget = () => {
  const listeners = new Map();
  return {
    listeners,
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) {
      listeners.get(type)?.delete(listener);
      if (!listeners.get(type)?.size) listeners.delete(type);
    },
    dispatchEvent(event) {
      for (const listener of [...(listeners.get(event.type) ?? [])]) listener(event);
      return !event.defaultPrevented;
    }
  };
};

const element = () => {
  const attributes = new Map();
  const styles = new Map();
  return {
    attributes,
    style: {
      get cssText() { return [...styles].join(';'); },
      setProperty: (name, value) => styles.set(name, value),
      removeProperty: (name) => styles.delete(name)
    },
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute(name) {
      attributes.delete(name);
      if (name === 'style') styles.clear();
    },
    getTotalLength: () => 100
  };
};

const fixture = ({ motion = 'full', hash = '', hidden = false, scrollY = 0, navigation = 'navigate', failure, stale = false } = {}) => {
  const paths = Array.from({ length: 12 }, element);
  if (stale) paths.forEach((path) => ownedAttributes.forEach((name) => path.setAttribute(name, '0')));
  if (failure === 'geometry') paths[0].getTotalLength = () => { throw new Error('Unavailable path geometry'); };
  const letters = Array.from({ length: 9 }, element);
  const hero = element();
  hero.querySelectorAll = (selector) => selector.endsWith('__stroke') ? paths : letters;
  const timers = new Map();
  let nextTimer = 0;
  const window = Object.assign(eventTarget(), {
    location: { hash }, scrollY,
    setTimeout(fn) { timers.set(++nextTimer, fn); return nextTimer; },
    clearTimeout(id) { timers.delete(id); }
  });
  const rootClasses = new Set(['home-intro-pending', 'home-intro-active', 'home-intro-locked']);
  const document = Object.assign(eventTarget(), {
    hidden,
    documentElement: { classList: { remove: (...names) => names.forEach((name) => rootClasses.delete(name)) } },
    querySelector: () => hero
  });
  let cancelled = 0;
  let completed = 0;
  let setupCount = 0;
  let timeline;
  const completionListener = () => { completed++; };
  window.addEventListener('portfolio:home-intro-complete', completionListener);
  const init = runInNewContext(`${controllerSource}\ninitHomeIntro;`, {
    window, document,
    performance: { getEntriesByType: () => [{ type: navigation }] },
    CustomEvent: class { constructor(type) { this.type = type; } },
    mountHeroWordmark: () => {},
    createDrawable(elements) {
      setupCount++;
      elements.forEach((path, index) => {
        path.setAttribute('pathLength', '1000');
        path.setAttribute('draw', index === 0 ? '0 0.4' : '0 0');
        path.setAttribute('stroke-dasharray', index === 0 ? '400 610' : '0 1010');
        path.setAttribute('stroke-dashoffset', '0');
        path.style.setProperty('stroke-linecap', 'butt');
      });
      if (failure === 'drawable') throw new Error('Partial drawable setup');
      return elements;
    },
    createTimeline(options) {
      timeline = {
        complete: options.onComplete,
        add() { if (failure === 'add') throw new Error('Timeline setup'); },
        play() { hero.style.setProperty('opacity', '0.35'); },
        cancel() { cancelled++; }
      };
      return timeline;
    }
  });
  const ready = init({ motion });
  return {
    ready, paths, hero, window, document, timers, rootClasses,
    get timeline() { return timeline; },
    get cancelled() { return cancelled; },
    get completed() { return completed; },
    get setupCount() { return setupCount; },
    assertSettled() {
      for (const path of paths) {
        for (const attribute of ownedAttributes) assert.equal(path.attributes.has(attribute), false, attribute);
        assert.equal(path.style.cssText, '');
      }
      assert.equal(hero.style.cssText, '');
      assert.equal(rootClasses.size, 0);
      assert.equal(timers.size, 0);
      assert.equal(completed, 1);
      assert.deepEqual([...window.listeners.keys()], ['portfolio:home-intro-complete']);
      assert.equal(document.listeners.size, 0);
    }
  };
};

for (const type of ['wheel', 'pointerdown', 'touchstart', 'keydown', 'scroll', 'hashchange', 'pagehide']) {
  test(`signature interruption by ${type} restores all 12 solid strokes`, async () => {
    const f = fixture();
    assert.ok(f.paths.every((path) => path.attributes.has('stroke-dasharray')));
    const event = { type, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    f.window.dispatchEvent(event);
    assert.equal(event.defaultPrevented, false);
    assert.equal((await f.ready).deferSmoothScroll, type === 'pagehide');
    f.ready.destroy();
    f.timeline.complete();
    f.assertSettled();
    assert.equal(f.cancelled, 1);
  });
}

for (const reason of ['natural', 'watchdog', 'hidden', 'pageshow', 'reduced-change', 'destroy']) {
  test(`signature ${reason} completion uses the same static cleanup`, async () => {
    const f = fixture();
    if (reason === 'natural') f.timeline.complete();
    if (reason === 'watchdog') [...f.timers.values()][0]();
    if (reason === 'hidden') { f.document.hidden = true; f.document.dispatchEvent({ type: 'visibilitychange' }); }
    if (reason === 'pageshow') f.window.dispatchEvent({ type: 'pageshow', persisted: true });
    if (reason === 'reduced-change') f.window.dispatchEvent({ type: 'portfolio:environment-change', detail: { motion: 'reduced' } });
    if (reason === 'destroy') f.ready.destroy();
    await f.ready;
    f.assertSettled();
  });
}

test('static entry never starts drawing or leaves stale state', async () => {
  for (const options of [{ motion: 'reduced' }, { hash: '#contact' }, { hidden: true }, { scrollY: 200 }, { navigation: 'back_forward' }]) {
    const f = fixture({ ...options, stale: true });
    await f.ready;
    assert.equal(f.setupCount, 0);
    f.assertSettled();
  }
});

test('partial drawable, geometry and timeline setup failures reveal the full static name', async () => {
  for (const failure of ['drawable', 'geometry', 'add']) {
    const f = fixture({ failure });
    await f.ready;
    f.assertSettled();
  }
});
