import { createDrawable, createTimeline } from 'animejs';
import { mountHeroWordmark } from './home-intro-wordmark.js';

const INTENT_EVENTS = ['wheel', 'pointerdown', 'touchstart', 'keydown'];

const getNavigationType = () => performance.getEntriesByType?.('navigation')?.[0]?.type;

export const initHomeIntro = (environment) => {
  const root = document.documentElement;
  const heroName = document.querySelector('.hero-identity__name');
  mountHeroWordmark(heroName);

  const paths = Array.from(heroName?.querySelectorAll('.handwritten-wordmark__stroke') ?? []);
  const shouldPlay = environment.motion !== 'reduced'
    && paths.length > 0
    && !window.location.hash
    && !document.hidden
    && window.scrollY <= 1
    && getNavigationType() !== 'back_forward';

  let timeline = null;
  let watchdog = 0;
  let finished = false;
  let resolveFinished;
  const finishedPromise = new Promise((resolve) => {
    resolveFinished = resolve;
  });

  const removeListeners = () => {
    INTENT_EVENTS.forEach((type) => window.removeEventListener(type, finish, true));
    window.removeEventListener('pagehide', finish);
    window.removeEventListener('pageshow', handlePageShow);
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('portfolio:environment-change', handleEnvironmentChange);
  };

  const cleanupStyles = () => {
    heroName?.style.removeProperty('opacity');
    heroName?.style.removeProperty('transform');
    paths.forEach((path) => path.removeAttribute('style'));
    heroName?.querySelectorAll('.handwritten-wordmark__letter').forEach((letter) => {
      letter.removeAttribute('style');
    });
    if (heroName && !heroName.style.cssText) heroName.removeAttribute('style');
  };

  function finish(event) {
    if (finished) return;
    finished = true;
    if (watchdog) window.clearTimeout(watchdog);
    try {
      timeline?.cancel?.();
    } finally {
      timeline = null;
      removeListeners();
      cleanupStyles();
      root.classList.remove('home-intro-pending', 'home-intro-active', 'home-intro-locked');
      window.dispatchEvent(new CustomEvent('portfolio:home-intro-complete'));
      resolveFinished?.({ deferSmoothScroll: event?.type === 'pagehide' });
    }
  }

  function handlePageShow(event) {
    if (event.persisted || document.hidden || window.scrollY > 1) finish(event);
  }

  function handleVisibility() {
    if (document.hidden) finish({ type: 'visibilitychange' });
  }

  function handleEnvironmentChange(event) {
    if (event.detail.motion === 'reduced') finish(event);
  }

  finishedPromise.destroy = () => finish();

  if (!shouldPlay) {
    finish();
    return finishedPromise;
  }

  // Complete the decorative signature on user intent without consuming the event.
  INTENT_EVENTS.forEach((type) => {
    window.addEventListener(type, finish, { capture: true, passive: true, once: true });
  });
  window.addEventListener('pagehide', finish);
  window.addEventListener('pageshow', handlePageShow);
  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('portfolio:environment-change', handleEnvironmentChange);

  const full = environment.motion === 'full';
  const totalDuration = full ? 780 : 560;
  const entryDelay = full ? 45 : 25;
  const writingDuration = totalDuration - entryDelay;
  const drawablePaths = createDrawable(paths);
  const weights = paths.map((path) => Math.max(10, path.getTotalLength?.() ?? 10));
  const totalWeight = weights.reduce((total, weight) => total + weight, 0);
  let cursor = entryDelay;

  timeline = createTimeline({
    autoplay: false,
    onComplete: () => finish({ type: 'timeline-complete' })
  });
  timeline.add(heroName, {
    opacity: [0.35, 1],
    y: [4, 0],
    duration: Math.min(420, writingDuration),
    ease: 'out(3)'
  }, 0);

  drawablePaths.forEach((drawable, index) => {
    const duration = writingDuration * (weights[index] / totalWeight);
    timeline.add(drawable, {
      draw: ['0 0', '0 1'],
      duration,
      ease: 'inOut(2)'
    }, cursor);
    cursor += duration;
  });

  watchdog = window.setTimeout(() => finish({ type: 'watchdog' }), totalDuration + 700);
  timeline.play();

  return finishedPromise;
};
