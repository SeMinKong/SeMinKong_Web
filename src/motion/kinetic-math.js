export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const normalise = ({ x, y }, fallback = { x: -0.58, y: -0.82 }) => {
  const magnitude = Math.hypot(x, y);
  return magnitude > 0.0001
    ? { x: x / magnitude, y: y / magnitude }
    : { ...fallback };
};

export const WORLD_LIGHT_ANCHOR = Object.freeze({ x: -0.12, y: -0.18 });

export const capVectorMagnitude = (vector, maxMagnitude) => {
  const maximum = Math.max(0, maxMagnitude ?? 0);
  const magnitude = Math.hypot(vector?.x ?? 0, vector?.y ?? 0);
  if (!magnitude || magnitude <= maximum) return { x: vector?.x ?? 0, y: vector?.y ?? 0 };
  const scale = maximum / magnitude;
  return { x: vector.x * scale, y: vector.y * scale };
};

export const interpolatePose = (previous, current, alpha) => {
  const progress = clamp(alpha, 0, 1);
  if (progress === 0) return { ...previous };
  if (progress === 1) return { ...current };
  return {
    x: previous.x + (current.x - previous.x) * progress,
    y: previous.y + (current.y - previous.y) * progress,
    angle: previous.angle + (current.angle - previous.angle) * progress
  };
};

export const getWorldLight = (position, viewport, elevation = 8) => {
  const lift = Math.max(0, elevation);
  const lightPosition = {
    x: Math.max(1, viewport?.width ?? 1) * WORLD_LIGHT_ANCHOR.x,
    y: Math.max(1, viewport?.height ?? 1) * WORLD_LIGHT_ANCHOR.y
  };
  const toward = normalise({
    x: lightPosition.x - (position?.x ?? 0),
    y: lightPosition.y - (position?.y ?? 0)
  });
  const away = { x: -toward.x, y: -toward.y };
  const diagonal = Math.max(1, Math.hypot(viewport?.width ?? 1, viewport?.height ?? 1));
  const distance = Math.hypot(lightPosition.x - (position?.x ?? 0), lightPosition.y - (position?.y ?? 0));
  const lightHeight = diagonal * 0.72;
  const projectedLength = clamp(distance * lift / Math.max(1, lightHeight - lift), 3, 14);

  return {
    lightPosition,
    toward,
    away,
    intensity: clamp(1.04 - (distance / diagonal) * 0.2, 0.78, 1),
    nearShadow: { x: away.x * projectedLength * 0.58, y: away.y * projectedLength * 0.58 },
    farShadow: { x: away.x * projectedLength * 1.32, y: away.y * projectedLength * 1.32 }
  };
};

export const toStageCollisionRects = (clientRects, stageRect, padding = 0) => clientRects
  .map((rect) => ({
    x: rect.left - stageRect.left + rect.width / 2,
    y: rect.top - stageRect.top + rect.height / 2,
    width: rect.width + padding * 2,
    height: rect.height + padding * 2
  }))
  .filter(({ width, height }) => width >= 4 && height >= 4);

export const smoothThrowVelocity = (
  samples,
  currentVelocity,
  { fixedStep, maxSpeed, windowMs = 100, pointerWeight = 0.84 } = {}
) => {
  const newest = samples.at(-1);
  if (!newest || samples.length < 2 || !fixedStep || !maxSpeed) {
    return capVectorMagnitude(currentVelocity, maxSpeed);
  }

  const recent = samples.filter((sample) => newest.time - sample.time <= windowMs);
  let totalWeight = 0;
  let velocityX = 0;
  let velocityY = 0;

  for (let index = 1; index < recent.length; index += 1) {
    const previous = recent[index - 1];
    const current = recent[index];
    const elapsed = Math.max(4, current.time - previous.time);
    const age = newest.time - current.time;
    const recency = 1 - clamp(age / windowMs, 0, 1);
    const weight = 0.55 + recency * 1.45;

    velocityX += ((current.x - previous.x) / elapsed) * fixedStep * weight;
    velocityY += ((current.y - previous.y) / elapsed) * fixedStep * weight;
    totalWeight += weight;
  }

  if (!totalWeight) return capVectorMagnitude(currentVelocity, maxSpeed);

  const retainedWeight = 1 - pointerWeight;
  return capVectorMagnitude({
    x: (velocityX / totalWeight) * pointerWeight + (currentVelocity?.x ?? 0) * retainedWeight,
    y: (velocityY / totalWeight) * pointerWeight + (currentVelocity?.y ?? 0) * retainedWeight
  }, maxSpeed);
};
