export const initNavigation = (environment) => {
  const navigation = document.querySelector('[data-site-nav]');
  let frame = 0;

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

  const update = () => {
    frame = 0;
    const scrollTop = Math.max(0, window.scrollY || document.documentElement.scrollTop);
    navigation?.classList.toggle('is-scrolled', scrollTop > 24);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(update);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('pageshow', update);
  update();

  return {
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('pageshow', update);
    }
  };
};
