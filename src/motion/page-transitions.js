import { animate } from 'animejs';

export const initPageTransitions = (environment) => {
  const curtain = document.querySelector('[data-page-curtain]');
  if (!curtain) return;

  let navigating = false;

  const reset = () => {
    navigating = false;
    curtain.style.transform = 'translate3d(0, 102%, 0)';
  };

  const shouldHandle = (event, link, url) => {
    if (environment.motion !== 'full' || event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download') || link.hasAttribute('data-no-transition')) return false;
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== window.location.origin) return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return false;
    return true;
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || navigating) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const url = new URL(link.href, window.location.href);
    if (!shouldHandle(event, link, url)) return;

    event.preventDefault();
    navigating = true;
    let completed = false;
    const navigate = () => {
      if (completed) return;
      completed = true;
      window.location.assign(url.href);
    };

    animate(curtain, {
      y: ['102%', '0%'],
      duration: 300,
      ease: 'inOut(3)',
      onComplete: navigate
    });

    window.setTimeout(navigate, 340);
  });

  window.addEventListener('pageshow', reset);
  window.addEventListener('portfolio:environment-change', (event) => {
    if (event.detail.motion !== 'full') reset();
  });

  reset();
};
