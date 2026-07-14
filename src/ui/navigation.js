const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const initNavigation = (environment) => {
  const navigation = document.querySelector('[data-site-nav]');
  const progress = document.querySelector('.page-progress span');
  let frame = 0;
  let lastScroll = window.scrollY;
  let progressCurrent = 0;

  const params = new URLSearchParams(window.location.search);
  const motion = params.get('motion');
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);

  if (isLocal && ['full', 'lite', 'reduced'].includes(motion)) {
    document.querySelectorAll('a[href]').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

      const url = new URL(href, window.location.href);
      if (url.origin !== window.location.origin) return;
      url.searchParams.set('motion', motion);
      link.href = url.href;
    });
  }

  const canHide = () => environment?.motion === 'full' && environment?.depth === 'interactive';

  const showNavigation = () => navigation?.classList.remove('is-hidden');

  const update = (immediate = false) => {
    frame = 0;
    const scrollTop = Math.max(0, window.scrollY || document.documentElement.scrollTop);
    const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progressTarget = clamp(scrollTop / scrollable, 0, 1);
    const delta = scrollTop - lastScroll;

    navigation?.classList.toggle('is-scrolled', scrollTop > 18);

    if (!canHide() || scrollTop < 120 || document.activeElement && navigation?.contains(document.activeElement)) {
      showNavigation();
    } else if (delta > 8) {
      navigation?.classList.add('is-hidden');
    } else if (delta < -5) {
      showNavigation();
    }

    progressCurrent = immediate ? progressTarget : progressCurrent + (progressTarget - progressCurrent) * 0.72;
    if (progress) progress.style.transform = `scaleX(${progressCurrent.toFixed(5)})`;
    lastScroll = scrollTop;

    if (!immediate && Math.abs(progressTarget - progressCurrent) > 0.0005) {
      frame = requestAnimationFrame(() => update(false));
    }
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(() => update(false));
  };

  const reset = () => {
    lastScroll = window.scrollY;
    progressCurrent = 0;
    showNavigation();
    update(true);
  };

  const onEnvironmentChange = () => reset();
  const onVisibilityChange = () => {
    if (!document.hidden) reset();
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', reset, { passive: true });
  window.addEventListener('pageshow', reset);
  window.addEventListener('portfolio:environment-change', onEnvironmentChange);
  document.addEventListener('visibilitychange', onVisibilityChange);
  navigation?.addEventListener('pointerenter', showNavigation);
  navigation?.addEventListener('focusin', showNavigation);
  reset();

  return {
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', reset);
      window.removeEventListener('pageshow', reset);
      window.removeEventListener('portfolio:environment-change', onEnvironmentChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      navigation?.removeEventListener('pointerenter', showNavigation);
      navigation?.removeEventListener('focusin', showNavigation);
    }
  };
};
