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
import {
  DISPLAY_SHADER,
  VELOCITY_SPLAT_SHADER
} from '../src/motion/pressure-ink-shaders.js';
import {
  DYE_SHORT_SIDE,
  getNextPressureInkQuality,
  MAX_QUIET_RECTS,
  MAX_SPLATS,
  PRESSURE_INK_QUALITY,
  PRESSURE_ITERATIONS,
  selectPressureInkQuality,
  shouldDowngradePressureInkQuality,
  SIMULATION_SHORT_SIDE
} from '../src/motion/pressure-ink-config.js';
import { packFluidObstacles } from '../src/motion/site-fluid-obstacles.js';
import { SITE_FLUID_PROFILES } from '../src/motion/site-fluid-profiles.js';

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

test('Pressure Ink quality profiles keep their adaptive resolution contract', () => {
  assert.deepEqual(
    { MAX_QUIET_RECTS, MAX_SPLATS, PRESSURE_ITERATIONS, SIMULATION_SHORT_SIDE, DYE_SHORT_SIDE },
    {
      MAX_QUIET_RECTS: 6,
      MAX_SPLATS: 12,
      PRESSURE_ITERATIONS: 14,
      SIMULATION_SHORT_SIDE: 256,
      DYE_SHORT_SIDE: 768
    }
  );
  assert.deepEqual(
    Object.fromEntries(Object.entries(PRESSURE_INK_QUALITY).map(([name, value]) => [name, [
      value.simulationShortSide,
      value.dyeShortSide,
      value.maximumTextureDimension
    ]])),
    {
      high: [256, 768, 1536],
      balanced: [224, 640, 1536],
      baseline: [192, 512, 1536]
    }
  );
  assert.equal(selectPressureInkQuality({ viewportWidth: 1280 }).name, 'high');
  assert.equal(selectPressureInkQuality({ viewportWidth: 1100 }).name, 'balanced');
  assert.equal(selectPressureInkQuality({ viewportWidth: 1600, deviceMemory: 4 }).name, 'baseline');
  assert.equal(getNextPressureInkQuality('high').name, 'balanced');
  assert.equal(getNextPressureInkQuality('balanced').name, 'baseline');
  assert.equal(getNextPressureInkQuality('baseline').name, 'baseline');
  assert.equal(shouldDowngradePressureInkQuality(Array(60).fill(16.7)), false);
  assert.equal(shouldDowngradePressureInkQuality(Array(60).fill(33.3)), false);
  assert.equal(shouldDowngradePressureInkQuality([
    ...Array(52).fill(16.7),
    ...Array(8).fill(120)
  ]), false);
  assert.equal(shouldDowngradePressureInkQuality(Array(60).fill(45)), true);
  assert.equal(shouldDowngradePressureInkQuality(Array(60).fill(120)), true);
});

test('Pressure Ink target sizing preserves viewport aspect while capping both axes', () => {
  const cases = [
    [390, 844, 'high', [256, 560], [704, 1536]],
    [390, 844, 'balanced', [224, 480], [640, 1392]],
    [390, 844, 'baseline', [192, 416], [512, 1104]],
    [768, 1024, 'high', [256, 336], [768, 1024]],
    [768, 1024, 'balanced', [224, 304], [640, 848]],
    [768, 1024, 'baseline', [192, 256], [512, 688]],
    [1280, 900, 'high', [368, 256], [1088, 768]],
    [1280, 900, 'balanced', [320, 224], [912, 640]],
    [1280, 900, 'baseline', [272, 192], [736, 512]]
  ];

  for (const [width, height, qualityName, simulation, dye] of cases) {
    const quality = PRESSURE_INK_QUALITY[qualityName];
    const options = { maximum: quality.maximumTextureDimension };
    assert.deepEqual(
      Object.values(getPressureInkTargetSize(quality.simulationShortSide, width, height, options)),
      simulation
    );
    assert.deepEqual(
      Object.values(getPressureInkTargetSize(quality.dyeShortSide, width, height, options)),
      dye
    );
  }

  const target = { width: 368, height: 256 };
  assert.equal(hasPressureInkTargetSize(target, { width: 368, height: 256 }), true);
  assert.equal(hasPressureInkTargetSize(target, { width: 352, height: 256 }), false);
  assert.equal(hasPressureInkTargetSize(null, { width: 368, height: 256 }), false);
  assert.match(VELOCITY_SPLAT_SHADER, /uniform vec4 uSplatData\[12\]/);
  assert.match(VELOCITY_SPLAT_SHADER, /uniform vec4 uQuietRects\[6\]/);
  assert.match(DISPLAY_SHADER, /outColor = alpha > 0\.0001 \? vec4\(color, alpha\) : vec4\(0\.0\)/);
});

test('Site Fluid packs six independent viewport obstacles without a giant union', () => {
  const rects = [
    { left: 100, right: 200, top: 100, bottom: 200, width: 100, height: 100, priority: 5 },
    ...Array.from({ length: 7 }, (_, index) => ({
      left: 260 + (index * 50),
      right: 300 + (index * 50),
      top: 220,
      bottom: 260,
      width: 40,
      height: 40,
      priority: 1
    })),
    { left: -200, right: -100, top: 20, bottom: 80, width: 100, height: 60, priority: 10 }
  ];
  const packed = packFluidObstacles(rects, { viewportWidth: 1000, viewportHeight: 500 });

  assert.equal(packed.count, 6);
  assert.equal(packed.data.length, MAX_QUIET_RECTS * 4);
  assert.ok(Math.abs(packed.data[0] - 0.15) < 1e-6);
  assert.ok(Math.abs(packed.data[1] - 0.7) < 1e-6);
  assert.ok(packed.data[2] < 0.08);
  assert.ok(packed.data[3] < 0.13);
});

test('Site Fluid profiles keep Home dominant and dark case studies palette-aware', () => {
  assert.deepEqual(Object.keys(SITE_FLUID_PROFILES), [
    'home', 'work', 'about', 'resume', 'legal', 'case-study'
  ]);
  assert.equal(SITE_FLUID_PROFILES.home.intensity, 1);
  assert.equal(SITE_FLUID_PROFILES.home.continuousAmbient, true);
  assert.equal(SITE_FLUID_PROFILES['case-study'].theme, 'dark');
  assert.ok(SITE_FLUID_PROFILES.work.intensity > SITE_FLUID_PROFILES.about.intensity);
  assert.ok(SITE_FLUID_PROFILES.about.intensity > SITE_FLUID_PROFILES.resume.intensity);
  assert.ok(SITE_FLUID_PROFILES.resume.intensity > SITE_FLUID_PROFILES.legal.intensity);
  assert.match(SITE_FLUID_PROFILES.work.protectSelector, /\.work-row \.work-row__media/);
  assert.doesNotMatch(SITE_FLUID_PROFILES.work.protectSelector, /is-work-active/);
  assert.match(SITE_FLUID_PROFILES.resume.protectSelector, /\.resume-original__actions/);
  assert.match(SITE_FLUID_PROFILES['case-study'].protectSelector, /\.thing-evidence-media/);
  assert.match(SITE_FLUID_PROFILES.home.quietSelector, /\.home-contact \.site-footer/);
});
