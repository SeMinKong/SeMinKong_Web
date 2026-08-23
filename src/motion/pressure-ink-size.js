const roundToBucket = (value, bucket, minimum, maximum) => Math.max(
  minimum,
  Math.min(maximum, Math.round(value / bucket) * bucket)
);

export const getPressureInkTargetSize = (
  shortSide,
  width,
  height,
  { maximum = 1536, minimum = 64, bucket = 16 } = {}
) => {
  const safeWidth = Math.max(1, width);
  const safeHeight = Math.max(1, height);
  const aspect = safeWidth / safeHeight;
  let targetWidth = aspect >= 1 ? shortSide * aspect : shortSide;
  let targetHeight = aspect >= 1 ? shortSide : shortSide / aspect;

  const longestSide = Math.max(targetWidth, targetHeight);
  if (longestSide > maximum) {
    const scale = maximum / longestSide;
    targetWidth *= scale;
    targetHeight *= scale;
  }

  return {
    width: roundToBucket(targetWidth, bucket, minimum, maximum),
    height: roundToBucket(targetHeight, bucket, minimum, maximum)
  };
};

export const hasPressureInkTargetSize = (target, size) => Boolean(
  target && target.width === size.width && target.height === size.height
);
