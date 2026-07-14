import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

export const initSmoothScroll = (environment) => {
  let lenis = null;

  const shouldEnhance = () => environment.motion === 'full' && environment.depth === 'interactive';

  const stop = () => {
    lenis?.destroy();
    lenis = null;
    delete document.documentElement.dataset.smoothScroll;
  };

  const start = () => {
    if (lenis || !shouldEnhance()) return;

    lenis = new Lenis({
      autoRaf: true,
      anchors: { offset: -84 },
      lerp: 0.115,
      smoothWheel: true,
      stopInertiaOnNavigate: true,
      syncTouch: false,
      wheelMultiplier: 0.9
    });

    document.documentElement.dataset.smoothScroll = 'active';
    if (document.hidden) lenis.stop();
  };

  const reconcile = () => {
    if (shouldEnhance()) start();
    else stop();
  };

  window.addEventListener('portfolio:environment-change', reconcile);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', reconcile);
  document.addEventListener('visibilitychange', () => {
    if (!lenis) return;
    if (document.hidden) lenis.stop();
    else lenis.start();
  });

  reconcile();

  return { destroy: stop };
};
