export const initLearningStackAnchor = (id) => {
  const target = document.getElementById(id);
  const hash = `#${id}`;
  if (!target || window.location.hash !== hash
    || performance.getEntriesByType('navigation')[0]?.type === 'back_forward') return null;

  let frame = 0;
  let finished = false;
  let resolveReady;
  const ready = new Promise((resolve) => { resolveReady = resolve; });
  const interrupts = ['wheel', 'pointerdown', 'touchstart', 'keydown', 'hashchange', 'pagehide'];

  const finish = () => {
    if (finished) return;
    finished = true;
    if (frame) cancelAnimationFrame(frame);
    window.removeEventListener('load', afterLoad);
    interrupts.forEach((event) => window.removeEventListener(event, finish));
    resolveReady();
  };

  const align = () => {
    frame = 0;
    if (!finished && window.location.hash === hash) {
      const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      window.scrollTo({
        top: Math.max(0, target.getBoundingClientRect().top + window.scrollY - padding),
        behavior: 'instant'
      });
    }
    finish();
  };

  const afterLoad = () => {
    // Read font readiness after load so late stylesheet fonts are included.
    Promise.resolve(document.fonts?.ready).then(() => {
      if (!finished) frame = requestAnimationFrame(align);
    });
  };

  interrupts.forEach((event) => window.addEventListener(event, finish, { passive: true }));
  if (document.readyState === 'complete') afterLoad();
  else window.addEventListener('load', afterLoad, { once: true });

  return { ready, destroy: finish };
};
