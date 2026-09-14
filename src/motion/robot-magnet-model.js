export const MAGNET_CONTACT_DURATION = 140;

const ARC_SHAPES = [
  [0, 0.7, -0.95, 0.5, -0.6, 0.85, 0],
  [0, -0.8, 0.6, -0.95, 0.75, -0.45, 0],
  [0, 0.4, -0.7, 0.9, -0.5, 0.6, 0]
];
const clampUnit = (value) => Math.max(0, Math.min(1, value));

// Three stable shapes create a brief crackle without frame-by-frame randomness.
export const getMagnetArcs = (a, b, progress, lite = false) => {
  const p = clampUnit(progress);
  const dx = b.x - a.x, dy = b.y - a.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 0.6 || p === 0 || p === 1) return [];
  const shape = ARC_SHAPES[Math.min(2, Math.floor(p * 3))];
  const amplitude = Math.min(lite ? 4 : 6, distance * 0.13);
  const count = lite ? 5 : 7;
  const points = Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    const bend = shape[Math.round(t * 6)] * amplitude;
    return { x: a.x + dx * t - dy / distance * bend, y: a.y + dy * t + dx / distance * bend };
  });
  const alpha = 0.92 * Math.min(1, p * 6) * Math.min(1, (1 - p) * 8);
  const arcs = [{ points, alpha }];
  if (!lite && distance >= 10) {
    // A shorter fork rejoins the target rather than wandering outside the joint.
    const origin = points[2];
    const fork = [origin, ...[0.28, 0.6].map((t, index) => ({
      x: origin.x + (b.x - origin.x) * t + dy / distance * amplitude * (index ? -0.45 : 0.9),
      y: origin.y + (b.y - origin.y) * t - dx / distance * amplitude * (index ? -0.45 : 0.9)
    })), { x: b.x, y: b.y }];
    arcs.push({ points: fork, alpha: alpha * 0.62 });
  }
  return arcs;
};

export const getMagnetContact = (anchor, elapsed, lite = false) => {
  const p = clampUnit(elapsed / MAGNET_CONTACT_DURATION);
  const alpha = (1 - p) ** 1.4;
  const count = lite ? 3 : 5;
  const inner = 5 + p * 7;
  const length = (lite ? 7 : 9) * (1 - p);
  const sparks = Array.from({ length: count }, (_, index) => {
    const angle = -2.55 + index * Math.PI * 2 / count + (index % 2 ? 0.13 : -0.08);
    const direction = { x: Math.cos(angle), y: Math.sin(angle) };
    const point = (radius, bend = 0) => ({
      x: anchor.x + direction.x * radius - direction.y * bend,
      y: anchor.y + direction.y * radius + direction.x * bend
    });
    return [point(inner), point(inner + length * 0.5, (index % 2 ? -1 : 1) * length * 0.22), point(inner + length)];
  });
  return { radius: 6 + p * 9, alpha, sparks };
};

// Only the existing runtime clock advances effects; no timers survive a reset.
export const createMagnetEffectState = () => {
  let capture = null;
  let contact = null;
  let lite = false;
  return {
    progress(state) { capture = state; contact = null; },
    connect(pair) { capture = null; contact = { pair, elapsed: 0 }; },
    clear() { capture = contact = null; },
    setQuality(simplified) { lite = Boolean(simplified); },
    update(delta) {
      if (!contact) return;
      contact.elapsed += Math.max(0, delta);
      if (contact.elapsed >= MAGNET_CONTACT_DURATION) contact = null;
    },
    get active() { return Boolean(capture || contact); },
    get capture() { return capture; },
    get contact() { return contact; },
    get lite() { return lite; }
  };
};
