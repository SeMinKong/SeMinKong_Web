export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const springStep = (value, velocity, target, dt, stiffness, damping) => {
  const acceleration = ((target - value) * stiffness) - (velocity * damping);
  const nextVelocity = velocity + (acceleration * dt);
  return [value + (nextVelocity * dt), nextVelocity];
};
