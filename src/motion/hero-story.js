import { loadGsap } from './gsap-loader.js';

const STORY_VIEWPORT = window.matchMedia('(min-width: 961px) and (min-height: 620px)');

export const initHeroStory = (environment, { ready } = {}) => {
  const track = document.querySelector('[data-hero-story]');
  const sticky = track?.querySelector('[data-hero-sticky]');
  const identity = track?.querySelector('.hero-identity');
  const name = track?.querySelector('.hero-identity__name');
  const lines = Array.from(track?.querySelectorAll('[data-hero-line]') ?? []);
  const actions = track?.querySelector('[data-hero-actions]');
  const surface = track?.querySelector('[data-hero-surface]');

  if (!track || !sticky || !identity || !name || !lines.length || !actions || !surface) {
    document.documentElement.classList.remove('hero-pending');
    return;
  }

  let context = null;
  let scrollTriggerApi = null;
  let refreshFrame = 0;
  let setupVersion = 0;
  let readySettled = !ready;
  let pageActive = !document.hidden;
  let destroyed = false;

  const shouldEnhance = () => (
    readySettled
    && pageActive
    && environment.motion === 'full'
    && environment.depth === 'interactive'
    && STORY_VIEWPORT.matches
  );

  const stop = () => {
    setupVersion += 1;
    if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    refreshFrame = 0;
    context?.revert();
    context = null;
    scrollTriggerApi = null;
    track.removeAttribute('data-scroll-story-active');
    [track, identity, name, ...lines, actions, surface].forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('pointer-events');
      element.style.removeProperty('transform');
      element.style.removeProperty('transform-origin');
      element.style.removeProperty('visibility');
      if (!element.style.cssText) element.removeAttribute('style');
    });
  };

  const queueRefresh = () => {
    if (!context || !scrollTriggerApi || !pageActive) return;
    if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    const version = setupVersion;
    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = 0;
      if (!destroyed && version === setupVersion && context && pageActive) {
        scrollTriggerApi.refresh();
      }
    });
  };

  const start = async () => {
    if (destroyed || context || !shouldEnhance()) return;

    const version = ++setupVersion;
    try {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (destroyed || version !== setupVersion || context || !shouldEnhance()) return;

      scrollTriggerApi = ScrollTrigger;
      const nextContext = gsap.context(() => {}, track);
      context = nextContext;
      track.setAttribute('data-scroll-story-active', '');

      nextContext.add(() => {
        const timeline = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: track,
            start: 'top top',
            end: () => `+=${Math.max(1, track.offsetHeight - sticky.offsetHeight)}`,
            scrub: 0.4,
            invalidateOnRefresh: true
          }
        });

        timeline
          .to(actions, {
            opacity: 0,
            duration: 0.2,
            y: -18
          }, 0.14)
          .set(actions, {
            pointerEvents: 'none'
          }, 0.34)
          .to(lines, {
            autoAlpha: 0,
            duration: 0.28,
            stagger: 0.06,
            y: -26
          }, 0.24)
          .to(name, {
            autoAlpha: 0.08,
            duration: 0.4,
            scale: 0.92,
            transformOrigin: 'center center',
            y: -64
          }, 0.42);
      });

      queueRefresh();
    } catch (error) {
      if (destroyed || version !== setupVersion) return;
      stop();
      console.warn('Home scroll choreography is unavailable; the static hero remains active.', error);
    }
  };

  const reconcile = () => {
    if (destroyed || !readySettled) return;
    // Keep the expanded story geometry while a live document is hidden so
    // returning to the tab cannot shift the user's restored scroll position.
    if (!pageActive) {
      if (!context) stop();
      return;
    }
    if (shouldEnhance()) {
      if (context) queueRefresh();
      else start();
    }
    else stop();
  };

  const onPageHide = () => {
    pageActive = false;
    reconcile();
  };

  const onPageShow = () => {
    pageActive = !document.hidden;
    reconcile();
  };

  const onVisibilityChange = () => {
    pageActive = !document.hidden;
    reconcile();
  };

  window.addEventListener('portfolio:environment-change', reconcile);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  document.addEventListener('visibilitychange', onVisibilityChange);
  STORY_VIEWPORT.addEventListener('change', reconcile);

  Promise.resolve(ready).catch(() => {}).then(() => {
    if (destroyed) return;
    readySettled = true;
    reconcile();
  });

  document.documentElement.classList.remove('hero-pending');

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      window.removeEventListener('portfolio:environment-change', reconcile);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      STORY_VIEWPORT.removeEventListener('change', reconcile);
      stop();
    }
  };
};
