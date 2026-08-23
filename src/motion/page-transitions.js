import { animate } from 'animejs';

export const initPageTransitions = (environment) => {
  const curtain = document.querySelector('[data-page-curtain]');
  if (!curtain) return;

  let navigating = false;
  let navigationTimer = 0;

  const reset = () => {
    navigating = false;
    curtain.style.opacity = '0';
    curtain.style.visibility = 'hidden';
    curtain.style.transform = 'scale(1.012)';
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

  const onDocumentClick = (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link || navigating) return;

    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;

    const url = new URL(link.href, window.location.href);
    if (!shouldHandle(event, link, url)) return;

    event.preventDefault();
    navigating = true;
    curtain.style.visibility = 'visible';
    let completed = false;
    const navigate = () => {
      if (completed) return;
      completed = true;
      window.location.assign(url.href);
    };

    animate(curtain, {
      opacity: [0, 1],
      scale: [1.012, 1],
      duration: 210,
      ease: 'out(3)',
      onComplete: navigate
    });

    navigationTimer = window.setTimeout(navigate, 250);
  };

  const onEnvironmentChange = (event) => {
    if (event.detail.motion !== 'full') reset();
  };

  document.addEventListener('click', onDocumentClick);
  window.addEventListener('pageshow', reset);
  window.addEventListener('portfolio:environment-change', onEnvironmentChange);

  reset();

  return {
    destroy() {
      document.removeEventListener('click', onDocumentClick);
      window.removeEventListener('pageshow', reset);
      window.removeEventListener('portfolio:environment-change', onEnvironmentChange);
      window.clearTimeout(navigationTimer);
      navigationTimer = 0;
      reset();
    }
  };
};
