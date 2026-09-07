import { ROBOT_GEOMETRY } from './robot-kit.js';
import { clamp } from './kinetic-math.js';

// Physical response and interaction thresholds for the eleven-piece kit.
export const FIXED_STEP = 1000 / 60;
export const PHYSICS_SUBSTEPS = 2;
export const PHYSICS_SUBSTEP = FIXED_STEP / PHYSICS_SUBSTEPS;
export const MAX_CATCH_UP = FIXED_STEP * 3;
export const MAX_FRAME_DELTA = 50;
export const WALL_THICKNESS = 160;
export const MAX_THROW_SPEED = 11.5;
export const SETTLE_DURATION = 760;
export const ROTATION_STEP = Math.PI / 6;
export const REQUIRED_CONNECTIONS = 10;
export const CELEBRATION_DURATION = 1780;
export const BOARD = 0xded6ca;
export const PAPER = 0xf1eee6;
export const INK = 0x24211d;
export const SIGNAL = 0xa73524;
export const SHADOW = 0x171512;
export const PORT = Object.freeze({ PLUG: 'plug', SOCKET: 'socket' });
export const DETENT_STEP = Math.PI / 12;
export const POSE_JOINT_PRIORITIES = Object.freeze({
  head: Object.freeze(['neck']),
  chest: Object.freeze([]),
  pelvis: Object.freeze(['waist', 'hip']),
  'upper-arm': Object.freeze(['shoulder', 'elbow']),
  forearm: Object.freeze(['elbow']),
  thigh: Object.freeze(['hip', 'knee']),
  shin: Object.freeze(['knee'])
});
export const POSE_GRIP_DIRECTION = Object.freeze({
  head: -1,
  pelvis: 1,
  'upper-arm': 1,
  forearm: 1,
  thigh: 1,
  shin: 1
});

export const JOINT_SERVO_PROFILES = Object.freeze({
  neck: {
    softLimit: 0.24, centerStrength: 0.012, dragHoldStrength: 0.026,
    limitStrength: 0.038, damping: 0.24, maxCorrection: 0.016, maxRelativeVelocity: 0.05
  },
  waist: {
    softLimit: 0.18, centerStrength: 0.013, dragHoldStrength: 0.028,
    limitStrength: 0.04, damping: 0.26, maxCorrection: 0.017, maxRelativeVelocity: 0.045
  },
  shoulder: {
    softLimit: 1.05, centerStrength: 0.0045, dragHoldStrength: 0.011,
    limitStrength: 0.026, damping: 0.19, maxCorrection: 0.018, maxRelativeVelocity: 0.07
  },
  elbow: {
    softLimit: 1.22, centerStrength: 0.005, dragHoldStrength: 0.012,
    limitStrength: 0.03, damping: 0.21, maxCorrection: 0.019, maxRelativeVelocity: 0.075
  },
  hip: {
    softLimit: 0.66, centerStrength: 0.0055, dragHoldStrength: 0.013,
    limitStrength: 0.032, damping: 0.21, maxCorrection: 0.019, maxRelativeVelocity: 0.065
  },
  knee: {
    softLimit: 0.96, centerStrength: 0.0055, dragHoldStrength: 0.013,
    limitStrength: 0.032, damping: 0.22, maxCorrection: 0.019, maxRelativeVelocity: 0.07
  }
});

export const PART_SPECS = [
  { id: 'head', asset: 'head', x: 0.1, y: 0.22, angle: Math.PI / 3 },
  { id: 'chest', asset: 'chest', x: 0.82, y: 0.22, angle: -Math.PI / 6 },
  { id: 'pelvis', asset: 'pelvis', x: 0.91, y: 0.42, angle: Math.PI / 6 },
  { id: 'upper-arm-a', asset: 'upper-arm', x: 0.07, y: 0.49, angle: -Math.PI / 3 },
  { id: 'upper-arm-b', asset: 'upper-arm', x: 0.86, y: 0.61, angle: Math.PI * 2 / 3 },
  { id: 'forearm-a', asset: 'forearm', x: 0.2, y: 0.65, angle: Math.PI / 6 },
  { id: 'forearm-b', asset: 'forearm', x: 0.68, y: 0.83, angle: -Math.PI * 2 / 3 },
  { id: 'thigh-a', asset: 'thigh', x: 0.1, y: 0.82, angle: Math.PI / 3 },
  { id: 'thigh-b', asset: 'thigh', x: 0.57, y: 0.21, angle: -Math.PI / 6 },
  { id: 'shin-a', asset: 'shin', x: 0.34, y: 0.86, angle: Math.PI * 2 / 3 },
  { id: 'shin-b', asset: 'shin', x: 0.91, y: 0.79, angle: -Math.PI / 3 }
].map((spec) => ({ ...spec, ...ROBOT_GEOMETRY[spec.asset] }));

const COMPACT_SCATTER = {
  head: [0.16, 0.19], chest: [0.78, 0.21], pelvis: [0.53, 0.33],
  'upper-arm-a': [0.17, 0.34], 'upper-arm-b': [0.83, 0.34],
  'forearm-a': [0.16, 0.77], 'forearm-b': [0.67, 0.90],
  'thigh-a': [0.22, 0.90], 'thigh-b': [0.44, 0.17],
  'shin-a': [0.50, 0.78], 'shin-b': [0.84, 0.77]
};
const TABLET_SCATTER = {
  pelvis: [0.91, 0.35], 'upper-arm-b': [0.86, 0.72],
  'forearm-a': [0.20, 0.72], 'thigh-b': [0.47, 0.21]
};

export const getScale = (width) => clamp(1.55 + (width - 390) * (0.45 / 890), 1.5, 2.06);

export const getRobotDensity = (asset, scale) => (
  asset === 'chest' || asset === 'pelvis' ? 0.0032 : 0.0024
) / (scale * scale);

export const getRobotBodyOptions = (spec, width, height, scale) => ({
  label: `kinetic:part:${spec.id}`,
  angle: spec.angle,
  density: getRobotDensity(spec.asset, scale),
  friction: 0.18,
  frictionAir: 0.032,
  frictionStatic: 0.25,
  restitution: 0.28,
  sleepThreshold: 72,
  slop: 0.025,
  chamfer: {
    radius: Math.min(width, height) * 0.14,
    quality: 4
  }
});

export const getInitialRobotPose = (spec, { width, height, scale, coarsePointer, topBoundary }) => {
  const inset = coarsePointer ? 14 : width <= 1000 ? 22 : 30;
  const [scatterX, scatterY] = (width <= 720 ? COMPACT_SCATTER : width <= 1000 ? TABLET_SCATTER : {})[spec.id]
    ?? [spec.x, spec.y];
  const bodyWidth = spec.width * scale;
  const bodyHeight = spec.height * scale;
  const rotatedHalfWidth = (
    Math.abs(Math.cos(spec.angle)) * bodyWidth
    + Math.abs(Math.sin(spec.angle)) * bodyHeight
  ) / 2;
  const rotatedHalfHeight = (
    Math.abs(Math.sin(spec.angle)) * bodyWidth
    + Math.abs(Math.cos(spec.angle)) * bodyHeight
  ) / 2;
  const edgeSafety = 8;
  const x = clamp(
    width * scatterX,
    inset + edgeSafety + rotatedHalfWidth,
    width - inset - edgeSafety - rotatedHalfWidth
  );
  const y = clamp(
    height * scatterY,
    topBoundary + inset + edgeSafety + rotatedHalfHeight,
    height - inset - edgeSafety - rotatedHalfHeight
  );
  return { x, y, angle: spec.angle };
};
