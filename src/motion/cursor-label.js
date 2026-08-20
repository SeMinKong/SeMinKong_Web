import { springStep } from './utils.js';

const OFFSET_X = 20;
const OFFSET_Y = 24;

export const initCursorLabel = (environment, selector = '.work-row, .project-card--deck') => {
  const targets = Array.from(document.querySelectorAll(selector));
  if (!targets.length) return;

  const chip = document.createElement('div');
  chip.className = 'cursor-label';
  chip.setAttribute('aria-hidden', 'true');
  chip.innerHTML = '<span></span><i>↗</i>';
  document.body.appendChild(chip);
  const label = chip.querySelector('span');

  const state = { x: 0, y: 0, vx: 0, vy: 0, targetX: 0, targetY: 0 };
  let frame = 0;
  let lastTime = 0;
  let visible = false;
  let enabled = false;

  const step = (time) => {
    frame = 0;
    const dt = Math.min(0.04, Math.max(0.001, (time - (lastTime || time)) / 1000));
    lastTime = time;
    [state.x, state.vx] = springStep(state.x, state.vx, state.targetX, dt, 210, 24);
    [state.y, state.vy] = springStep(state.y, state.vy, state.targetY, dt, 210, 24);
    chip.style.transform = `translate3d(${state.x.toFixed(1)}px, ${state.y.toFixed(1)}px, 0)`;

    const resting = !visible
      && Math.abs(state.x - state.targetX) < 0.3 && Math.abs(state.y - state.targetY) < 0.3;
    if (!resting) frame = requestAnimationFrame(step);
  };

  const schedule = () => {
    if (!frame) {
      lastTime = 0;
      frame = requestAnimationFrame(step);
    }
  };

  const hide = () => {
    if (!visible) return;
    visible = false;
    chip.classList.remove('is-visible');
  };

  const onMove = (event) => {
    if (!enabled) return;
    state.targetX = event.clientX + OFFSET_X;
    state.targetY = event.clientY + OFFSET_Y;
    schedule();
  };

  const onEnter = (event) => {
    if (!enabled) return;
    label.textContent = event.currentTarget.dataset.cursorLabel || 'VIEW';
    state.x = event.clientX + OFFSET_X;
    state.y = event.clientY + OFFSET_Y;
    state.targetX = state.x;
    state.targetY = state.y;
    state.vx = 0;
    state.vy = 0;
    visible = true;
    chip.classList.add('is-visible');
    schedule();
  };

  targets.forEach((target) => {
    target.addEventListener('pointerenter', onEnter);
    target.addEventListener('pointermove', onMove);
    target.addEventListener('pointerleave', hide);
    target.addEventListener('pointerdown', hide);
  });

  const sync = () => {
    enabled = environment.motion === 'full';
    if (!enabled) hide();
  };

  window.addEventListener('portfolio:environment-change', sync);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) hide();
  });
  window.addEventListener('scroll', hide, { passive: true });

  sync();
};
