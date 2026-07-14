const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const initScrollKinetics = (environment) => {
  const elements = Array.from(document.querySelectorAll('[data-inertia]'));
  if (!elements.length) return;

  const active = new Set();
  let frame = 0;
  let lastTime = 0;
  let lastScroll = window.scrollY;
  let target = 0;
  let current = 0;

  const enabled = () => environment.motion === 'full' && environment.depth === 'interactive' && !document.hidden;

  const render = (value) => {
    elements.forEach((element) => {
      const max = Number(element.dataset.inertia) || 12;
      const amount = active.has(element) && enabled() ? clamp(value, -max, max) : 0;
      element.style.setProperty('--inertia-y', `${amount.toFixed(2)}px`);
    });
  };

  const reset = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    target = 0;
    current = 0;
    lastScroll = window.scrollY;
    render(0);
  };

  const tick = (time) => {
    frame = 0;
    if (!enabled() || !active.size) {
      reset();
      return;
    }

    const dt = Math.min(0.05, Math.max(0.001, (time - (lastTime || time)) / 1000));
    lastTime = time;
    const follow = 1 - Math.exp(-10.5 * dt);
    current += (target - current) * follow;
    target *= Math.exp(-7.5 * dt);

    if (Math.abs(target) < 0.02) target = 0;
    if (Math.abs(current) < 0.02 && target === 0) current = 0;
    render(current);

    if (current !== 0 || target !== 0) frame = requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (frame || !enabled() || !active.size) return;
    lastTime = 0;
    frame = requestAnimationFrame(tick);
  };

  const onScroll = () => {
    const nextScroll = window.scrollY;
    const delta = nextScroll - lastScroll;
    lastScroll = nextScroll;
    if (!enabled() || !active.size) return;
    target = clamp(target - delta * 0.72, -22, 22);
    schedule();
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) active.add(entry.target);
        else active.delete(entry.target);
      });
      if (!active.size) reset();
    }, { rootMargin: '18% 0px' });
    elements.forEach((element) => observer.observe(element));
  } else {
    elements.forEach((element) => active.add(element));
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pageshow', reset);
  window.addEventListener('portfolio:environment-change', reset);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) reset();
    else lastScroll = window.scrollY;
  });

  render(0);
};
