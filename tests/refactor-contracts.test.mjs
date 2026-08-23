import assert from 'node:assert/strict';
import test from 'node:test';
import {
  EXPECTED_DEPLOYMENT_FILES,
  SITE_ROUTES
} from '../config/site-routes.js';
import {
  DISPLAY_NAME,
  INTRO_WORDMARK_STROKES
} from '../src/motion/home-intro-wordmark.js';
import {
  getPressureInkTargetSize,
  hasPressureInkTargetSize
} from '../src/motion/pressure-ink-size.js';
import { VELOCITY_SPLAT_SHADER } from '../src/motion/pressure-ink-shaders.js';
import {
  DYE_SHORT_SIDE,
  MAX_SPLATS,
  PRESSURE_ITERATIONS,
  SIMULATION_SHORT_SIDE
} from '../src/motion/pressure-ink-config.js';

test('route manifest keeps unique build inputs and outputs', () => {
  assert.equal(SITE_ROUTES.length, 11);
  assert.equal(new Set(SITE_ROUTES.map(({ name }) => name)).size, SITE_ROUTES.length);
  assert.equal(new Set(SITE_ROUTES.map(({ source }) => source)).size, SITE_ROUTES.length);
  assert.equal(new Set(SITE_ROUTES.map(({ output }) => output)).size, SITE_ROUTES.length);
  assert.equal(SITE_ROUTES.filter(({ kind }) => kind === 'case-study').length, 6);
  assert.equal(EXPECTED_DEPLOYMENT_FILES.length, 16);
});

test('handwritten wordmark preserves its public name and stroke order', () => {
  assert.equal(DISPLAY_NAME, 'Se Min Kong');
  assert.deepEqual(
    INTRO_WORDMARK_STROKES.map(({ letter }) => letter),
    ['S', 'e', 'M', 'i', 'n', 'K', 'o', 'n', 'g']
  );

  const strokes = INTRO_WORDMARK_STROKES.flatMap(({ strokes: letterStrokes }) => letterStrokes);
  assert.equal(strokes.length, 12);
  const totalWeight = strokes.reduce((total, { weight }) => total + weight, 0);
  assert.ok(Math.abs(totalWeight - 9.4) < 1e-10);
  assert.ok(strokes.every(({ d, weight }) => d.startsWith('M') && weight > 0));
});

test('Pressure Ink target sizing keeps its bucket and clamp contract', () => {
  assert.deepEqual(
    { MAX_SPLATS, PRESSURE_ITERATIONS, SIMULATION_SHORT_SIDE, DYE_SHORT_SIDE },
    { MAX_SPLATS: 12, PRESSURE_ITERATIONS: 14, SIMULATION_SHORT_SIDE: 192, DYE_SHORT_SIDE: 512 }
  );
  assert.deepEqual(getPressureInkTargetSize(192, 1280, 720), {
    width: 336,
    height: 192
  });
  assert.deepEqual(getPressureInkTargetSize(192, 390, 844), {
    width: 192,
    height: 416
  });
  assert.deepEqual(getPressureInkTargetSize(192, 100000, 1), {
    width: 1024,
    height: 192
  });

  const target = { width: 336, height: 192 };
  assert.equal(hasPressureInkTargetSize(target, { width: 336, height: 192 }), true);
  assert.equal(hasPressureInkTargetSize(target, { width: 352, height: 192 }), false);
  assert.equal(hasPressureInkTargetSize(null, { width: 336, height: 192 }), false);
  assert.match(VELOCITY_SPLAT_SHADER, /uniform vec4 uSplatData\[12\]/);
});
