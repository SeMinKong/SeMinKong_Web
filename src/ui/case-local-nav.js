export const initCaseLocalNav = (environment) => {
  const nav = document.querySelector('.case-local-nav');
  const scroller = nav?.querySelector(':scope > div');
  if (!nav || !scroller) return;

  const items = Array.from(nav.querySelectorAll('a[href^="#"]'))
    .map((link) => {
      const id = link.getAttribute('href')?.slice(1);
      const target = id ? document.getElementById(id) : null;
      return target ? { id, link, target } : null;
    })
    .filter(Boolean);

  if (items.length < 2) return;

  let activeId = null;
  let frame = 0;

  const setActive = (nextId) => {
    if (!nextId || nextId === activeId) return;
    activeId = nextId;

    let activeLink = null;
    for (const { id, link } of items) {
      if (id === nextId) {
        link.setAttribute('aria-current', 'location');
        activeLink = link;
      } else {
        link.removeAttribute('aria-current');
      }
    }

    if (activeLink && scroller.scrollWidth > scroller.clientWidth) {
      const targetLeft = activeLink.offsetLeft - (scroller.clientWidth - activeLink.offsetWidth) / 2;
      const clampedLeft = Math.max(0, Math.min(targetLeft, scroller.scrollWidth - scroller.clientWidth));
      scroller.scrollTo({
        left: clampedLeft,
        behavior: environment?.motion === 'reduced' ? 'auto' : 'smooth'
      });
    }
  };

  const computeActive = () => {
    frame = 0;
    const navRect = nav.getBoundingClientRect();
    const threshold = navRect.bottom + 48;

    let candidate = items[0].id;
    for (const { id, target } of items) {
      const rect = target.getBoundingClientRect();
      if (rect.top <= threshold) {
        candidate = id;
      }
    }

    const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 24;
    if (nearBottom) {
      candidate = items[items.length - 1].id;
    }

    setActive(candidate);
  };

  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(computeActive);
  };

  const observer = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver(schedule, { rootMargin: '-18% 0px -55% 0px', threshold: [0, 0.25] })
    : null;

  for (const { target } of items) {
    observer?.observe(target);
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('hashchange', schedule);
  computeActive();

  return {
    destroy() {
      if (frame) cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
      for (const { link } of items) {
        link.removeAttribute('aria-current');
      }
    }
  };
};
