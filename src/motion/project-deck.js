import { animate, set } from 'animejs';

const CLOSED_ROTATIONS = [-1.35, 0.65, 1.15];
const FLUID_OBSTACLE_EVENT = 'portfolio:fluid-obstacle-change';

export const initProjectDeck = (environment) => {
  const root = document.querySelector('[data-project-deck]');
  if (!root) return;

  const stage = root.querySelector('[data-deck-stage]');
  const cards = Array.from(root.querySelectorAll('[data-deck-card]'));
  if (!stage || cards.length < 2) return;

  let enabled = false;
  let expanded = false;
  let pointerInside = false;
  let inView = true;
  let closeTimer = 0;
  let activeAnimation = null;

  const notifyObstacleChange = () => {
    window.dispatchEvent(new CustomEvent(FLUID_OBSTACLE_EVENT));
  };

  const shouldEnable = () => environment.motion === 'full' && environment.depth === 'interactive';

  const clearCloseTimer = () => {
    window.clearTimeout(closeTimer);
    closeTimer = 0;
  };

  const cancelAnimation = () => {
    activeAnimation?.cancel?.();
    activeAnimation = null;
    root.classList.remove('is-animating');
  };

  const getPositions = (nextExpanded) => {
    const stageWidth = stage.clientWidth;
    const cardWidth = cards[0]?.offsetWidth || 0;
    const openStep = cards.length > 1 ? Math.max(0, (stageWidth - cardWidth) / (cards.length - 1)) : 0;
    const closedStep = Math.min(26, Math.max(20, cardWidth * 0.075));

    return cards.map((_, index) => ({
      x: nextExpanded ? openStep * index : closedStep * index,
      y: nextExpanded ? 0 : index * 8,
      rotate: nextExpanded ? 0 : (CLOSED_ROTATIONS[index] ?? index * 0.5)
    }));
  };

  const applyState = (nextExpanded, immediate = false) => {
    if (!enabled) return;

    expanded = nextExpanded;
    root.classList.toggle('is-expanded', expanded);
    cancelAnimation();

    const positions = getPositions(expanded);
    const properties = {
      x: (_, index) => positions[index].x,
      y: (_, index) => positions[index].y,
      rotate: (_, index) => positions[index].rotate
    };

    if (immediate || document.hidden || !inView) {
      set(cards, properties);
      notifyObstacleChange();
      return;
    }

    root.classList.add('is-animating');
    const animation = animate(cards, {
      ...properties,
      duration: expanded ? 620 : 500,
      delay: (_, index) => expanded ? index * 54 : (cards.length - 1 - index) * 30,
      ease: expanded ? 'out(4)' : 'inOut(3)',
      composition: 'replace',
      onUpdate: notifyObstacleChange,
      onComplete: () => {
        if (activeAnimation !== animation) return;
        activeAnimation = null;
        root.classList.remove('is-animating');
        notifyObstacleChange();
      }
    });

    activeAnimation = animation;
  };

  const clearActiveCard = () => {
    cards.forEach((card) => card.classList.remove('is-active'));
  };

  const activateCard = (target) => {
    const activeCard = target?.closest?.('[data-deck-card]');
    if (!activeCard || !root.contains(activeCard)) return;
    clearActiveCard();
    activeCard.classList.add('is-active');
    notifyObstacleChange();
  };

  const enable = () => {
    if (enabled) return;
    enabled = true;
    expanded = false;
    root.classList.add('is-deck-mode');
    applyState(false, true);
    root.classList.add('is-ready');
  };

  const disable = () => {
    if (!enabled) return;
    enabled = false;
    expanded = false;
    clearCloseTimer();
    cancelAnimation();
    clearActiveCard();
    cards.forEach((card) => card.style.removeProperty('transform'));
    root.classList.remove('is-deck-mode', 'is-ready', 'is-expanded');
    notifyObstacleChange();
  };

  const syncEnvironment = () => {
    if (shouldEnable()) enable();
    else disable();
  };

  const onPointerOver = (event) => {
    if (!enabled) return;
    const activeCard = event.target?.closest?.('[data-deck-card]');
    if (!activeCard || !root.contains(activeCard)) return;
    pointerInside = true;
    clearCloseTimer();

    if (!expanded) {
      clearActiveCard();
      applyState(true);
      return;
    }

    if (activeAnimation) return;
    activateCard(event.target);
  };

  const onPointerLeave = () => {
    if (!enabled) return;
    pointerInside = false;
    clearCloseTimer();
    closeTimer = window.setTimeout(() => {
      if (root.contains(document.activeElement)) return;
      clearActiveCard();
      applyState(false);
    }, 110);
  };

  const onPointerMove = (event) => {
    if (!enabled || !expanded || activeAnimation) return;
    activateCard(event.target);
  };

  const onFocusIn = (event) => {
    if (!enabled) return;
    clearCloseTimer();
    activateCard(event.target);
    applyState(true, true);
  };

  const onFocusOut = () => {
    if (!enabled) return;
    window.requestAnimationFrame(() => {
      if (root.contains(document.activeElement) || pointerInside) return;
      clearActiveCard();
      applyState(false, true);
    });
  };

  const onEnvironmentChange = () => syncEnvironment();
  const onVisibilityChange = () => {
    if (document.hidden && enabled) applyState(expanded, true);
  };
  const onPageHide = () => cancelAnimation();

  const resizeObserver = new ResizeObserver(() => {
    if (enabled) applyState(expanded, true);
  });
  resizeObserver.observe(stage);

  const visibilityObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
        inView = entry?.isIntersecting ?? true;
        if (!inView && enabled) applyState(expanded, true);
      }, { rootMargin: '120px 0px' })
    : null;
  visibilityObserver?.observe(root);

  root.addEventListener('pointerover', onPointerOver);
  root.addEventListener('pointermove', onPointerMove);
  root.addEventListener('pointerleave', onPointerLeave);
  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('focusout', onFocusOut);
  window.addEventListener('portfolio:environment-change', onEnvironmentChange);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);

  syncEnvironment();

  return {
    destroy() {
      root.removeEventListener('pointerover', onPointerOver);
      root.removeEventListener('pointermove', onPointerMove);
      root.removeEventListener('pointerleave', onPointerLeave);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
      window.removeEventListener('portfolio:environment-change', onEnvironmentChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      resizeObserver.disconnect();
      visibilityObserver?.disconnect();
      disable();
    }
  };
};
