export const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

export const wrapAngle = (angle) => {
  const turn = Math.PI * 2;
  return ((angle + Math.PI) % turn + turn) % turn - Math.PI;
};

export const rotatePoint = ({ x = 0, y = 0 }, angle = 0) => ({
  x: x * Math.cos(angle) - y * Math.sin(angle),
  y: x * Math.sin(angle) + y * Math.cos(angle)
});

export const worldPort = (pose, port) => {
  const offset = rotatePoint(port, pose?.angle ?? 0);
  return {
    x: (pose?.x ?? 0) + offset.x,
    y: (pose?.y ?? 0) + offset.y,
    normal: wrapAngle((pose?.angle ?? 0) + (port?.normal ?? 0))
  };
};

export const evaluatePortSnap = (
  movingPose,
  movingPort,
  targetPose,
  targetPort,
  { maxDistance = 18, maxAngle = Math.PI / 9 } = {}
) => {
  const moving = worldPort(movingPose, movingPort);
  const target = worldPort(targetPose, targetPort);
  const distance = Math.hypot(moving.x - target.x, moving.y - target.y);
  const angleError = Math.abs(wrapAngle(moving.normal - target.normal - Math.PI));
  return {
    eligible: distance <= maxDistance && angleError <= maxAngle,
    distance,
    angleError,
    moving,
    target
  };
};

export const solveMovingPortPose = (movingPose, movingPort, targetPose, targetPort) => {
  const target = worldPort(targetPose, targetPort);
  const angle = wrapAngle(target.normal + Math.PI - (movingPort?.normal ?? 0));
  const offset = rotatePoint(movingPort, angle);
  return {
    x: target.x - offset.x,
    y: target.y - offset.y,
    angle,
    deltaAngle: wrapAngle(angle - (movingPose?.angle ?? 0))
  };
};

export const calculateJointServo = ({
  parentAngle = 0,
  childAngle = 0,
  restAngle = 0,
  centerAngle,
  limitAngle,
  relativeVelocity = 0,
  softLimit = Math.PI,
  centerStrength = 0,
  limitStrength = 0,
  damping = 0,
  maxCorrection = 0.02
} = {}) => {
  const relativeAngle = wrapAngle(childAngle - parentAngle);
  const centerTarget = centerAngle ?? restAngle;
  const limitTarget = limitAngle ?? restAngle;
  const error = wrapAngle(relativeAngle - centerTarget);
  const limitError = wrapAngle(relativeAngle - limitTarget);
  const limit = Math.max(0, softLimit);
  const excess = Math.sign(limitError) * Math.max(0, Math.abs(limitError) - limit);
  const rawCorrection = error * centerStrength
    + excess * limitStrength
    + relativeVelocity * damping;
  return {
    correction: clamp(rawCorrection, -Math.abs(maxCorrection), Math.abs(maxCorrection)),
    error,
    limitError,
    excess
  };
};

export const projectJointLimit = ({
  parentAngle = 0,
  childAngle = 0,
  limitAngle = 0,
  softLimit = Math.PI,
  inverseParent = 0,
  inverseChild = 0
} = {}) => {
  const relativeAngle = wrapAngle(childAngle - parentAngle);
  const limitError = wrapAngle(relativeAngle - limitAngle);
  const limit = Math.max(0, softLimit);
  const boundedError = clamp(limitError, -limit, limit);
  const correction = limitError - boundedError;
  const inverseTotal = inverseParent + inverseChild;

  if (inverseTotal <= 0 || Math.abs(correction) < 1e-9) {
    return {
      boundedError,
      childAngle,
      correction: 0,
      limitError,
      parentAngle,
      projected: false
    };
  }

  return {
    boundedError,
    childAngle: childAngle - correction * inverseChild / inverseTotal,
    correction,
    limitError,
    parentAngle: parentAngle + correction * inverseParent / inverseTotal,
    projected: true
  };
};

export const limitRelativeAngularVelocity = ({
  socketVelocity = 0,
  plugVelocity = 0,
  inverseSocket = 0,
  inversePlug = 0,
  maxRelativeVelocity = Infinity
} = {}) => {
  const inverseTotal = inverseSocket + inversePlug;
  const relativeVelocity = plugVelocity - socketVelocity;
  const limit = Math.max(0, maxRelativeVelocity);
  if (inverseTotal <= 0 || !Number.isFinite(limit)) {
    return { socketVelocity, plugVelocity, relativeVelocity };
  }

  const limitedRelativeVelocity = clamp(relativeVelocity, -limit, limit);
  const correction = relativeVelocity - limitedRelativeVelocity;
  return {
    socketVelocity: socketVelocity + correction * inverseSocket / inverseTotal,
    plugVelocity: plugVelocity - correction * inversePlug / inverseTotal,
    relativeVelocity: limitedRelativeVelocity
  };
};

export const pointInRotatedRect = (point, pose, width, height, padding = 0) => {
  const local = rotatePoint({
    x: (point?.x ?? 0) - (pose?.x ?? 0),
    y: (point?.y ?? 0) - (pose?.y ?? 0)
  }, -(pose?.angle ?? 0));
  return Math.abs(local.x) <= width / 2 + padding
    && Math.abs(local.y) <= height / 2 + padding;
};

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
