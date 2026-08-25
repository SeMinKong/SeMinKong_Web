export const initSmoothScroll = (environment) => {
  let lenis = null;
  let loadingPromise = null;
  let setupVersion = 0;
  let destroyed = false;
  const scrollListeners = new Set();

  const shouldEnhance = () => environment.motion === 'full' && environment.depth === 'interactive';

  const loadLenis = () => {
    if (!loadingPromise) {
      loadingPromise = Promise.all([
        import('lenis'),
        import('lenis/dist/lenis.css')
      ]).then(([{ default: Lenis }]) => Lenis)
        .finally(() => {
          loadingPromise = null;
        });
    }

    return loadingPromise;
  };

  const stop = () => {
    setupVersion += 1;
    scrollListeners.forEach((listener) => lenis?.off('scroll', listener));
    lenis?.destroy();
    lenis = null;
    delete document.documentElement.dataset.smoothScroll;
  };

  const start = async () => {
    if (destroyed || lenis || !shouldEnhance()) return;

    const version = ++setupVersion;
    try {
      const Lenis = await loadLenis();
      if (destroyed || version !== setupVersion || !shouldEnhance() || lenis) return;

      lenis = new Lenis({
        autoRaf: true,
        anchors: { offset: -84 },
        lerp: 0.115,
        smoothWheel: true,
        stopInertiaOnNavigate: true,
        syncTouch: false,
        wheelMultiplier: 0.9
      });

      scrollListeners.forEach((listener) => lenis.on('scroll', listener));
      document.documentElement.dataset.smoothScroll = 'active';
      if (document.hidden) lenis.stop();
    } catch (error) {
      if (destroyed || version !== setupVersion) return;
      lenis?.destroy();
      lenis = null;
      delete document.documentElement.dataset.smoothScroll;
      console.warn('Smooth scrolling is unavailable; native scrolling remains active.', error);
    }
  };

  const reconcile = () => {
    if (destroyed) return;
    if (shouldEnhance()) start();
    else stop();
  };

  const onVisibilityChange = () => {
    if (!lenis) return;
    if (document.hidden) lenis.stop();
    else lenis.start();
  };

  const onScroll = (listener) => {
    if (typeof listener !== 'function' || destroyed) return () => {};
    scrollListeners.add(listener);
    lenis?.on('scroll', listener);

    return () => {
      scrollListeners.delete(listener);
      lenis?.off('scroll', listener);
    };
  };

  const scrollTo = (target, { immediate = true } = {}) => {
    if (!Number.isFinite(target) || destroyed) return;
    if (lenis) {
      lenis.scrollTo(target, { force: true, immediate });
      return;
    }
    window.scrollTo({ top: target, behavior: immediate ? 'auto' : 'smooth' });
  };

  window.addEventListener('portfolio:environment-change', reconcile);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', reconcile);
  document.addEventListener('visibilitychange', onVisibilityChange);

  reconcile();

  return {
    onScroll,
    scrollTo,
    destroy() {
      if (destroyed) return;
      destroyed = true;
      window.removeEventListener('portfolio:environment-change', reconcile);
      window.removeEventListener('pagehide', stop);
      window.removeEventListener('pageshow', reconcile);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      stop();
      scrollListeners.clear();
    }
  };
};
