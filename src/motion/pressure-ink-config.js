export const MAX_SPLATS = 12;
export const MAX_QUIET_RECTS = 6;
export const PRESSURE_ITERATIONS = 14;

export const PRESSURE_INK_QUALITY_ORDER = ['high', 'balanced', 'baseline'];

export const PRESSURE_INK_QUALITY = Object.freeze({
  high: Object.freeze({
    name: 'high',
    simulationShortSide: 256,
    dyeShortSide: 768,
    maximumTextureDimension: 1536,
    canvasScale: 0.9,
    maximumDpr: 1.5
  }),
  balanced: Object.freeze({
    name: 'balanced',
    simulationShortSide: 224,
    dyeShortSide: 640,
    maximumTextureDimension: 1536,
    canvasScale: 0.85,
    maximumDpr: 1.4
  }),
  baseline: Object.freeze({
    name: 'baseline',
    simulationShortSide: 192,
    dyeShortSide: 512,
    maximumTextureDimension: 1536,
    canvasScale: 0.82,
    maximumDpr: 1.35
  })
});

// Public aliases describe the preferred desktop profile. The renderer can
// step down without changing the visual system's source-of-truth values.
export const SIMULATION_SHORT_SIDE = PRESSURE_INK_QUALITY.high.simulationShortSide;
export const DYE_SHORT_SIDE = PRESSURE_INK_QUALITY.high.dyeShortSide;

export const selectPressureInkQuality = ({
  viewportWidth = 0,
  deviceMemory = 8,
  hardwareConcurrency = 8
} = {}) => {
  const memory = Number.isFinite(deviceMemory) ? deviceMemory : 8;
  const cores = Number.isFinite(hardwareConcurrency) ? hardwareConcurrency : 8;

  if (memory <= 4 || cores <= 4) return PRESSURE_INK_QUALITY.baseline;
  if (viewportWidth >= 1280 && memory >= 6 && cores >= 6) {
    return PRESSURE_INK_QUALITY.high;
  }
  return PRESSURE_INK_QUALITY.balanced;
};

export const getNextPressureInkQuality = (qualityName) => {
  const index = PRESSURE_INK_QUALITY_ORDER.indexOf(qualityName);
  if (index < 0) return PRESSURE_INK_QUALITY.baseline;
  return PRESSURE_INK_QUALITY[
    PRESSURE_INK_QUALITY_ORDER[Math.min(index + 1, PRESSURE_INK_QUALITY_ORDER.length - 1)]
  ];
};

export const shouldDowngradePressureInkQuality = (samples) => {
  if (!Array.isArray(samples) || samples.length < 60) return false;
  const windowed = samples.slice(-60).map((value) => Math.min(Math.max(value, 0), 250));
  const average = windowed.reduce((sum, value) => sum + value, 0) / windowed.length;
  const sustainedSlowFrames = windowed.filter((value) => value > 38).length;
  const severeFrames = windowed.filter((value) => value > 70).length;

  // A 30 Hz display settles near 33 ms without indicating GPU pressure. Step
  // down only when the session repeatedly misses even that conservative pace.
  return (average > 36 && sustainedSlowFrames >= 15) || severeFrames >= 20;
};
