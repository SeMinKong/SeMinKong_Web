const roundToBucket = (value) => Math.max(64, Math.min(1024, Math.round(value / 16) * 16));

export const getPressureInkTargetSize = (shortSide, width, height) => {
  const aspect = width / Math.max(height, 1);
  if (aspect >= 1) {
    return {
      width: roundToBucket(shortSide * aspect),
      height: roundToBucket(shortSide)
    };
  }

  return {
    width: roundToBucket(shortSide),
    height: roundToBucket(shortSide / Math.max(aspect, 0.01))
  };
};

export const hasPressureInkTargetSize = (target, size) => Boolean(
  target && target.width === size.width && target.height === size.height
);
