const queries = {
  reduced: window.matchMedia('(prefers-reduced-motion: reduce)'),
  finePointer: window.matchMedia('(hover: hover) and (pointer: fine)'),
  desktop: window.matchMedia('(min-width: 961px)')
};

const localHosts = new Set(['localhost', '127.0.0.1']);
const localMotionOverride = localHosts.has(window.location.hostname)
  ? new URLSearchParams(window.location.search).get('motion')
  : null;

const getState = () => {
  if (localMotionOverride === 'full') {
    return { motion: 'full', depth: queries.desktop.matches ? 'interactive' : 'static' };
  }

  if (localMotionOverride === 'lite') {
    return { motion: 'lite', depth: 'static' };
  }

  if (localMotionOverride === 'reduced') {
    return { motion: 'reduced', depth: 'flat' };
  }

  if (queries.reduced.matches) {
    return { motion: 'reduced', depth: 'flat' };
  }

  if (queries.finePointer.matches && queries.desktop.matches) {
    return { motion: 'full', depth: 'interactive' };
  }

  return { motion: 'lite', depth: 'static' };
};

export const initEnvironment = () => {
  const root = document.documentElement;
  let state = getState();

  const apply = (announce = false) => {
    const next = getState();
    const changed = next.motion !== state.motion || next.depth !== state.depth;
    state = next;
    root.dataset.motion = state.motion;
    root.dataset.depth = state.depth;

    if (announce && changed) {
      window.dispatchEvent(new CustomEvent('portfolio:environment-change', { detail: { ...state } }));
    }
  };

  const listeners = Object.values(queries).map((query) => {
    const handler = () => apply(true);
    query.addEventListener('change', handler);
    return { query, handler };
  });

  apply();

  return {
    get motion() {
      return state.motion;
    },
    get depth() {
      return state.depth;
    },
    destroy() {
      listeners.forEach(({ query, handler }) => query.removeEventListener('change', handler));
    }
  };
};
