import { initEnvironment } from '../motion/environment.js';
import { initMagnetic } from '../motion/magnetic.js';
import { initNameEmphasis } from '../motion/name-emphasis.js';
import { initPageTransitions } from '../motion/page-transitions.js';
import { initSmoothScroll } from '../motion/smooth-scroll.js';
import { initNavigation } from '../ui/navigation.js';

const hasDestroy = (controller) => typeof controller?.destroy === 'function';

const destroyController = (controller) => {
  try {
    controller.destroy();
  } catch (error) {
    console.error('A page controller could not be cleaned up.', error);
  }
};

export const createPageRuntime = () => {
  const controllers = [];
  const environment = initEnvironment();
  let deferredSmoothStart = null;
  let destroyed = false;
  let smoothScrollController = null;
  let started = false;

  const register = (controller) => {
    if (!hasDestroy(controller)) return controller;

    if (destroyed) {
      destroyController(controller);
      return controller;
    }

    controllers.push(controller);
    return controller;
  };

  register(environment);

  const startSmoothScroll = () => {
    if (destroyed || smoothScrollController) return smoothScrollController;
    smoothScrollController = register(initSmoothScroll(environment));
    return smoothScrollController;
  };

  const scheduleSmoothScroll = (smoothScrollAfter) => {
    if (!smoothScrollAfter) {
      startSmoothScroll();
      return;
    }

    Promise.resolve(smoothScrollAfter).then(
      ({ deferSmoothScroll } = {}) => {
        if (destroyed) return;

        if (!deferSmoothScroll) {
          startSmoothScroll();
          return;
        }

        deferredSmoothStart = () => {
          deferredSmoothStart = null;
          startSmoothScroll();
        };
        window.addEventListener('pageshow', deferredSmoothStart, { once: true });
      },
      startSmoothScroll
    );
  };

  const start = ({ smoothScrollAfter } = {}) => {
    if (started || destroyed) return smoothScrollController;
    started = true;

    scheduleSmoothScroll(smoothScrollAfter);
    register(initNavigation(environment));
    register(initMagnetic(environment));
    register(initNameEmphasis(environment));
    register(initPageTransitions(environment));
    return smoothScrollController;
  };

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;

    if (deferredSmoothStart) {
      window.removeEventListener('pageshow', deferredSmoothStart);
      deferredSmoothStart = null;
    }

    for (const controller of controllers.splice(0).reverse()) {
      destroyController(controller);
    }
  };

  return { destroy, environment, register, start };
};
