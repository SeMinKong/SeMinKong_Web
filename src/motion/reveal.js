import { animate } from 'animejs';

const settle = (element) => {
  element.style.opacity = '1';
  element.style.filter = 'none';
  element.style.clipPath = 'none';
  if (!element.matches('[data-depth-root], [data-depth-card]')) {
    element.style.transform = 'none';
  }
};

const fontsReady = () => Promise.race([
  document.fonts?.ready ?? Promise.resolve(),
  new Promise((resolve) => window.setTimeout(resolve, 180))
]);

export const initIntro = (environment, selector) => {
  const elements = Array.from(document.querySelectorAll(selector));
  if (!elements.length) return;

  if (environment.motion === 'reduced') {
    elements.forEach(settle);
    return;
  }

  elements.forEach((element) => {
    element.style.opacity = '0';
  });

  const animations = [];
  let cancelled = false;

  fontsReady().then(() => {
    if (cancelled) return;
    elements.forEach((element, index) => {
      const isTitle = element.matches('h1, .hero-identity__name');
      const isMeta = element.matches('.hero-identity__role, .case-hero__meta, .eyebrow');
      animations.push(animate(element, {
        opacity: [0, 1],
        y: [isTitle ? 34 : isMeta ? 12 : 20, 0],
        duration: isTitle ? 880 : isMeta ? 440 : 680,
        delay: index * 62,
        ease: 'out(4)'
      }));
    });
  });

  const onEnvironmentChange = (event) => {
    if (event.detail.motion !== 'reduced') return;
    cancelled = true;
    animations.forEach((animation) => animation.cancel?.());
    elements.forEach(settle);
    window.removeEventListener('portfolio:environment-change', onEnvironmentChange);
  };

  window.addEventListener('portfolio:environment-change', onEnvironmentChange);
};

export const initReveals = (environment, selector, options = {}) => {
  const elements = Array.from(document.querySelectorAll(selector));
  if (!elements.length) return;

  const activeAnimations = new Set();
  const threshold = options.threshold ?? 0.1;

  if (environment.motion === 'reduced' || !('IntersectionObserver' in window)) {
    elements.forEach(settle);
    return;
  }

  elements.forEach((element) => {
    const type = element.dataset.reveal || 'text';
    element.style.opacity = '0';

    if (type === 'media') {
      element.style.clipPath = 'inset(7% 0 7% 0 round 14px)';
    } else {
      element.style.transform = `translateY(${type === 'row' ? 18 : 22}px)`;
      if (type === 'text') element.style.clipPath = 'inset(0 0 14% 0)';
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const element = entry.target;

      if (!entry.isIntersecting) {
        if (entry.boundingClientRect.bottom < 0) {
          settle(element);
          observer.unobserve(element);
        }
        return;
      }

      const type = element.dataset.reveal || 'text';
      const properties = {
        opacity: [0, 1],
        duration: type === 'media' ? 940 : type === 'row' ? 720 : 780,
        ease: 'out(4)'
      };

      if (type === 'media') {
        properties.clipPath = ['inset(7% 0 7% 0 round 14px)', 'inset(0% 0 0% 0 round 14px)'];
      } else {
        properties.y = [type === 'row' ? 18 : 22, 0];
        if (type === 'text') {
          properties.clipPath = ['inset(0 0 14% 0)', 'inset(0 0 0% 0)'];
        }
      }

      const animation = animate(element, properties);
      activeAnimations.add(animation);

      if (type === 'row') {
        const rowDetails = Array.from(element.children).filter((child) => !child.matches('[data-depth-card]'));
        const detailAnimation = animate(rowDetails, {
          opacity: [0, 1],
          y: [9, 0],
          delay: (_, index) => index * 48,
          duration: 620,
          ease: 'out(4)'
        });
        activeAnimations.add(detailAnimation);
      }

      observer.unobserve(element);
    });
  }, { threshold, rootMargin: '0px 0px -9% 0px' });

  elements.forEach((element) => observer.observe(element));

  const onEnvironmentChange = (event) => {
    if (event.detail.motion !== 'reduced') return;
    observer.disconnect();
    activeAnimations.forEach((animation) => animation.cancel?.());
    activeAnimations.clear();
    elements.forEach(settle);
    window.removeEventListener('portfolio:environment-change', onEnvironmentChange);
  };

  window.addEventListener('portfolio:environment-change', onEnvironmentChange);
};
