import { springStep } from './utils.js';

export const initDepthEffects = (environment) => {
  const elements = Array.from(document.querySelectorAll('[data-depth-root], [data-depth-card]'))
    .filter((element) => !element.matches('.case-media--video'));
  if (!elements.length) return;

  const entries = elements.map((element) => ({
    element,
    pointerTarget: element.closest('.project-card, .work-row') || element,
    layers: Array.from(element.querySelectorAll('[data-depth-layer]')),
    strength: Math.min(2.2, Math.max(0.5, Number(element.dataset.depthStrength) || 1)),
    active: true,
    x: 0,
    y: 0,
    scale: 1,
    vx: 0,
    vy: 0,
    vs: 0,
    targetX: 0,
    targetY: 0,
    targetScale: 1,
    handlers: null
  }));

  let frame = 0;
  let lastTime = 0;
  let observer = null;
  let destroyed = false;

  const render = (entry) => {
    entry.element.style.setProperty('--root-rx', `${(-entry.y * 1.5 * entry.strength).toFixed(3)}deg`);
    entry.element.style.setProperty('--root-ry', `${(entry.x * 2 * entry.strength).toFixed(3)}deg`);
    entry.element.style.setProperty('--root-scale', entry.scale.toFixed(4));

    entry.layers.forEach((layer) => {
      const depth = Number(layer.dataset.depthLayer) || 0;
      const layerStrength = Math.min(entry.strength, 1.35);
      layer.style.setProperty('--depth-x', `${(entry.x * depth * 0.9 * layerStrength).toFixed(2)}px`);
      layer.style.setProperty('--depth-y', `${(entry.y * depth * 0.75 * layerStrength).toFixed(2)}px`);
    });
  };

  const reset = (entry, immediate = false) => {
    entry.targetX = 0;
    entry.targetY = 0;
    entry.targetScale = 1;

    if (immediate) {
      entry.x = 0;
      entry.y = 0;
      entry.scale = 1;
      entry.vx = 0;
      entry.vy = 0;
      entry.vs = 0;
      entry.element.classList.remove('is-depth-active');
      render(entry);
    }
  };

  const settleAll = () => entries.forEach((entry) => reset(entry, true));

  const tick = (time) => {
    frame = 0;
    if (destroyed) return;
    if (document.hidden || environment.depth !== 'interactive') {
      settleAll();
      return;
    }

    const dt = Math.min(0.05, Math.max(0.001, (time - (lastTime || time)) / 1000));
    lastTime = time;
    let moving = false;

    entries.forEach((entry) => {
      if (!entry.active) return;

      [entry.x, entry.vx] = springStep(entry.x, entry.vx, entry.targetX, dt, 132, 21);
      [entry.y, entry.vy] = springStep(entry.y, entry.vy, entry.targetY, dt, 132, 21);
      [entry.scale, entry.vs] = springStep(entry.scale, entry.vs, entry.targetScale, dt, 132, 21);
      render(entry);

      const unsettled =
        Math.abs(entry.targetX - entry.x) > 0.001 ||
        Math.abs(entry.targetY - entry.y) > 0.001 ||
        Math.abs(entry.targetScale - entry.scale) > 0.0001 ||
        Math.abs(entry.vx) > 0.002 ||
        Math.abs(entry.vy) > 0.002 ||
        Math.abs(entry.vs) > 0.0002;

      if (unsettled) {
        moving = true;
        entry.element.classList.add('is-depth-active');
      } else {
        entry.element.classList.remove('is-depth-active');
      }
    });

    if (moving) frame = requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (frame || document.hidden || environment.depth !== 'interactive') return;
    lastTime = 0;
    frame = requestAnimationFrame(tick);
  };

  entries.forEach((entry) => {
    const onPointerMove = (event) => {
      if (environment.depth !== 'interactive' || !entry.active) return;
      const bounds = entry.element.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;

      const isOverMedia =
        event.clientX >= bounds.left &&
        event.clientX <= bounds.right &&
        event.clientY >= bounds.top &&
        event.clientY <= bounds.bottom;

      if (!isOverMedia) {
        reset(entry);
        schedule();
        return;
      }

      entry.targetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      entry.targetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      entry.targetScale = 1.006;
      schedule();
    };

    const onPointerLeave = () => {
      reset(entry);
      schedule();
    };

    entry.pointerTarget.addEventListener('pointermove', onPointerMove, { passive: true });
    entry.pointerTarget.addEventListener('pointerleave', onPointerLeave, { passive: true });
    entry.pointerTarget.addEventListener('pointercancel', onPointerLeave, { passive: true });
    entry.handlers = { onPointerMove, onPointerLeave };
    render(entry);
  });

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((observed) => {
      observed.forEach((item) => {
        const entry = entries.find((candidate) => candidate.element === item.target);
        if (!entry) return;
        entry.active = item.isIntersecting;
        if (!entry.active) reset(entry, true);
      });
    }, { rootMargin: '12% 0px' });
    entries.forEach((entry) => observer.observe(entry.element));
  }

  const onEnvironmentChange = (event) => {
    if (event.detail.depth !== 'interactive') settleAll();
  };

  const onVisibilityChange = () => {
    if (!document.hidden) return;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    settleAll();
  };

  window.addEventListener('portfolio:environment-change', onEnvironmentChange);
  document.addEventListener('visibilitychange', onVisibilityChange);

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      observer?.disconnect();
      entries.forEach((entry) => {
        const { onPointerMove, onPointerLeave } = entry.handlers ?? {};
        if (onPointerMove) entry.pointerTarget.removeEventListener('pointermove', onPointerMove);
        if (onPointerLeave) {
          entry.pointerTarget.removeEventListener('pointerleave', onPointerLeave);
          entry.pointerTarget.removeEventListener('pointercancel', onPointerLeave);
        }
      });
      window.removeEventListener('portfolio:environment-change', onEnvironmentChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      settleAll();
    }
  };
};
