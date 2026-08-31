const IDLE_TIMEOUT = 480;

const scheduleIdle = (callback) => {
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT });
    return () => window.cancelIdleCallback(id);
  }

  const id = window.setTimeout(callback, 24);
  return () => window.clearTimeout(id);
};

export const initKineticSandbox = (environment, { ready } = {}) => {
  const stage = document.querySelector('[data-kinetic-stage]');
  const canvas = stage?.querySelector('[data-kinetic-canvas]');
  if (!stage || !canvas) return null;

  const forcedColors = window.matchMedia('(forced-colors: active)');
  let cancelIdle = null;
  let controller = null;
  let destroyed = false;
  let generation = 0;
  let intersecting = true;
  let loading = false;
  let pageActive = !document.hidden;
  let queuedIntent = null;
  let retryCount = 0;

  const isEligible = () => environment.motion !== 'reduced' && !forcedColors.matches;
  const canRun = () => isEligible() && intersecting && pageActive;

  const setState = (state) => {
    if (!destroyed) stage.dataset.kineticState = state;
  };

  const showFallback = (state = 'static') => {
    setState(state);
    canvas.style.removeProperty('cursor');
  };

  const stopController = () => {
    controller?.stop?.();
  };

  const destroyController = () => {
    generation += 1;
    cancelIdle?.();
    cancelIdle = null;
    loading = false;
    controller?.destroy?.();
    controller = null;
  };

  const handleRuntimeFailure = () => {
    destroyController();
    showFallback('failed');
  };

  const mount = async () => {
    if (destroyed || loading || controller || !canRun()) return;
    loading = true;
    const currentGeneration = ++generation;
    setState('loading');

    try {
      const { mountKineticSandbox } = await import('./kinetic-sandbox-runtime.js');
      if (destroyed || currentGeneration !== generation || !isEligible()) return;

      const nextController = await mountKineticSandbox(stage, {
        mode: environment.motion,
        onFailure: handleRuntimeFailure
      });

      if (destroyed || currentGeneration !== generation || !isEligible()) {
        nextController.destroy();
        return;
      }

      controller = nextController;
      loading = false;

      if (queuedIntent) {
        controller.nudgeAt(queuedIntent.x, queuedIntent.y);
        queuedIntent = null;
      }

      if (canRun()) controller.start();
      else controller.stop();
    } catch (error) {
      loading = false;
      if (destroyed || currentGeneration !== generation) return;
      console.warn('The kinetic field could not start; the static composition remains.', error);
      showFallback('failed');
    }
  };

  const scheduleMount = () => {
    if (destroyed || loading || controller || cancelIdle || !canRun()) return;
    cancelIdle = scheduleIdle(() => {
      cancelIdle = null;
      mount();
    });
  };

  const sync = () => {
    if (!isEligible()) {
      destroyController();
      showFallback('static');
      return;
    }

    if (!intersecting || !pageActive) {
      cancelIdle?.();
      cancelIdle = null;
      stopController();
      return;
    }

    if (controller) controller.start();
    else scheduleMount();
  };

  const handleEarlyIntent = (event) => {
    if (controller || !isEligible()) return;
    queuedIntent = { x: event.clientX, y: event.clientY };
  };

  const handleVisibilityChange = () => {
    pageActive = !document.hidden;
    sync();
  };

  const handlePageHide = () => {
    pageActive = false;
    stopController();
  };

  const handlePageShow = () => {
    pageActive = !document.hidden;
    sync();
  };

  const handleEnvironmentChange = () => {
    retryCount = 0;
    destroyController();
    showFallback('static');
    sync();
  };

  const handleForcedColorsChange = () => {
    destroyController();
    showFallback('static');
    sync();
  };

  const observer = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
        intersecting = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.08);
        sync();
      }, { threshold: [0, 0.08, 0.25] })
    : null;

  const handleRecoverableFailure = () => {
    if (retryCount >= 1 || !canRun()) {
      handleRuntimeFailure();
      return;
    }

    retryCount += 1;
    destroyController();
    showFallback('static');
    scheduleMount();
  };

  stage.addEventListener('kinetic:recover', handleRecoverableFailure);
  canvas.addEventListener('pointerdown', handleEarlyIntent, { passive: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('pagehide', handlePageHide);
  window.addEventListener('pageshow', handlePageShow);
  window.addEventListener('portfolio:environment-change', handleEnvironmentChange);
  forcedColors.addEventListener('change', handleForcedColorsChange);
  observer?.observe(stage);

  Promise.resolve(ready).catch(() => {}).then(() => {
    if (!destroyed) sync();
  });

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      destroyController();
      observer?.disconnect();
      stage.removeEventListener('kinetic:recover', handleRecoverableFailure);
      canvas.removeEventListener('pointerdown', handleEarlyIntent);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('portfolio:environment-change', handleEnvironmentChange);
      forcedColors.removeEventListener('change', handleForcedColorsChange);
      stage.dataset.kineticState = 'static';
      canvas.style.removeProperty('cursor');
    }
  };
};
