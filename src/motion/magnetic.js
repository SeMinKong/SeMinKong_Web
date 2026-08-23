import { clamp, springStep } from './utils.js';

const MAX_PULL_X = 8;
const MAX_PULL_Y = 6;

export const initMagnetic = (environment, selector = '.button, .nav-resume, .resume-back') => {
  const elements = Array.from(document.querySelectorAll(selector));
  if (!elements.length) return;

  const states = new Map();
  let frame = 0;
  let lastTime = 0;
  let enabled = false;
  let destroyed = false;

  const step = (time) => {
    frame = 0;
    if (destroyed) return;
    const dt = Math.min(0.04, Math.max(0.001, (time - (lastTime || time)) / 1000));
    lastTime = time;
    let active = false;

    states.forEach((state, element) => {
      [state.x, state.vx] = springStep(state.x, state.vx, state.targetX, dt, 190, 22);
      [state.y, state.vy] = springStep(state.y, state.vy, state.targetY, dt, 190, 22);
      [state.s, state.vs] = springStep(state.s, state.vs, state.targetS, dt, 260, 24);

      const resting = state.targetX === 0 && state.targetY === 0 && state.targetS === 1
        && Math.abs(state.x) < 0.05 && Math.abs(state.y) < 0.05
        && Math.abs(state.vx) < 0.05 && Math.abs(state.vy) < 0.05
        && Math.abs(state.s - 1) < 0.002;

      if (resting) {
        element.style.transform = '';
        states.delete(element);
        return;
      }

      element.style.transform = `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, 0) scale(${state.s.toFixed(3)})`;
      active = true;
    });

    if (active) frame = requestAnimationFrame(step);
  };

  const schedule = () => {
    if (!frame) {
      lastTime = 0;
      frame = requestAnimationFrame(step);
    }
  };

  const getState = (element) => {
    let state = states.get(element);
    if (!state) {
      state = { x: 0, y: 0, vx: 0, vy: 0, targetX: 0, targetY: 0, s: 1, vs: 0, targetS: 1 };
      states.set(element, state);
    }
    return state;
  };

  const release = () => {
    states.forEach((state) => {
      state.targetX = 0;
      state.targetY = 0;
      state.targetS = 1;
    });
    schedule();
  };

  const onMove = (event) => {
    if (!enabled) return;
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const relX = (event.clientX - rect.left - (rect.width / 2)) / (rect.width / 2);
    const relY = (event.clientY - rect.top - (rect.height / 2)) / (rect.height / 2);
    const state = getState(element);
    state.targetX = clamp(relX, -1, 1) * MAX_PULL_X;
    state.targetY = clamp(relY, -1, 1) * MAX_PULL_Y;
    schedule();
  };

  const onSettle = (event) => {
    const state = states.get(event.currentTarget);
    if (!state) return;
    state.targetX = 0;
    state.targetY = 0;
    state.targetS = 1;
    schedule();
  };

  const onPress = (event) => {
    if (!enabled) return;
    const state = getState(event.currentTarget);
    state.targetS = 0.97;
    schedule();
  };

  const onRelease = (event) => {
    const state = states.get(event.currentTarget);
    if (!state) return;
    state.targetS = 1;
    schedule();
  };

  elements.forEach((element) => {
    element.addEventListener('pointermove', onMove);
    element.addEventListener('pointerleave', onSettle);
    element.addEventListener('pointerdown', onPress);
    element.addEventListener('pointerup', onRelease);
  });

  const sync = () => {
    enabled = environment.motion === 'full';
    if (!enabled) release();
  };

  const onVisibilityChange = () => {
    if (document.hidden) release();
  };

  window.addEventListener('portfolio:environment-change', sync);
  document.addEventListener('visibilitychange', onVisibilityChange);

  sync();

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      enabled = false;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      elements.forEach((element) => {
        element.removeEventListener('pointermove', onMove);
        element.removeEventListener('pointerleave', onSettle);
        element.removeEventListener('pointerdown', onPress);
        element.removeEventListener('pointerup', onRelease);
        element.style.transform = '';
      });
      window.removeEventListener('portfolio:environment-change', sync);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      states.clear();
    }
  };
};
