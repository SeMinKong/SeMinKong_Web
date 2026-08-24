import { MAX_QUIET_RECTS } from './pressure-ink-config.js';

const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

export const packFluidObstacles = (rects, {
  viewportWidth,
  viewportHeight,
  maximum = MAX_QUIET_RECTS
}) => {
  const width = Math.max(1, viewportWidth);
  const height = Math.max(1, viewportHeight);
  const visible = rects
    .filter((rect) => rect.width > 0 && rect.height > 0)
    .filter((rect) => rect.right > 0 && rect.left < width && rect.bottom > 0 && rect.top < height)
    .sort((first, second) => (second.priority || 0) - (first.priority || 0));
  const data = new Float32Array(MAX_QUIET_RECTS * 4);
  const selected = visible.slice(0, Math.min(maximum, MAX_QUIET_RECTS));

  selected.forEach((rect, index) => {
    const left = clamp(rect.left, 0, width);
    const right = clamp(rect.right, 0, width);
    const top = clamp(rect.top, 0, height);
    const bottom = clamp(rect.bottom, 0, height);
    const paddingX = clamp(rect.paddingX ?? width * 0.012, 8, 28);
    const paddingY = clamp(rect.paddingY ?? height * 0.01, 7, 20);
    const offset = index * 4;

    data[offset] = clamp(((left + right) * 0.5) / width, 0, 1);
    data[offset + 1] = clamp(1 - (((top + bottom) * 0.5) / height), 0, 1);
    data[offset + 2] = clamp((((right - left) * 0.5) + paddingX) / width, 0.015, 0.49);
    data[offset + 3] = clamp((((bottom - top) * 0.5) + paddingY) / height, 0.012, 0.46);
  });

  return { count: selected.length, data };
};
