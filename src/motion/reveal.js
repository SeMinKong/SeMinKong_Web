import { animate } from 'animejs';

const LINE_STAGGER = 90;
const LINE_OFFSET = '118%';

const splitRegistry = new Map();

const escapeText = (value) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const canSplitLines = (element) => element.children.length === 0 && element.textContent.trim().length > 0;

const splitLines = (element) => {
  const original = element.textContent;
  const words = original.trim().split(/\s+/);
  element.setAttribute('aria-label', original.trim());
  element.innerHTML = words
    .map((word) => `<span class="reveal-word" style="display:inline-block">${escapeText(word)}</span>`)
    .join(' ');

  const lines = [];
  let lastTop = null;
  element.querySelectorAll('.reveal-word').forEach((word) => {
    if (word.offsetTop !== lastTop) {
      lines.push([]);
      lastTop = word.offsetTop;
    }
    lines[lines.length - 1].push(word.textContent);
  });

  element.innerHTML = lines
    .map((line) => `<span class="reveal-line" aria-hidden="true"><span class="reveal-line__inner">${escapeText(line.join(' '))}</span></span>`)
    .join('');

  const inners = Array.from(element.querySelectorAll('.reveal-line__inner'));
  inners.forEach((inner) => {
    inner.style.transform = `translateY(${LINE_OFFSET})`;
  });
  splitRegistry.set(element, original);
  return inners;
};

const restoreLines = (element) => {
  if (!splitRegistry.has(element)) return;
  element.textContent = splitRegistry.get(element);
  element.removeAttribute('aria-label');
  splitRegistry.delete(element);
};

const settle = (element) => {
  restoreLines(element);
  element.classList.add('is-revealed');
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

const animateLines = (element, inners, baseDelay, duration) => {
  element.style.opacity = '1';
  return animate(inners, {
    y: [LINE_OFFSET, '0%'],
    duration,
    delay: (_, index) => baseDelay + (index * LINE_STAGGER),
    ease: 'out(4)',
    onComplete: () => {
      restoreLines(element);
      element.classList.add('is-revealed');
    }
  });
};

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
      if (environment.motion === 'full' && element.matches('.hero-identity__name')) return;
      const isTitle = element.matches('h1, .hero-identity__name');
      const isMeta = element.matches('.hero-identity__role, .case-hero__meta, .eyebrow');

      if (environment.motion === 'full' && element.matches('h1') && canSplitLines(element)) {
        animations.push(animateLines(element, splitLines(element), index * 62, 860));
        return;
      }

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

  return {
    destroy() {
      cancelled = true;
      animations.forEach((animation) => animation.cancel?.());
      elements.forEach(settle);
      window.removeEventListener('portfolio:environment-change', onEnvironmentChange);
    }
  };
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

    if (type === 'title') return;

    if (type === 'media') {
      element.style.clipPath = 'inset(7% 0 7% 0 round 14px)';
    } else {
      element.style.transform = `translateY(${type === 'video' ? 14 : type === 'row' ? 18 : 22}px)`;
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

      if (type === 'title' && environment.motion === 'full' && canSplitLines(element)) {
        activeAnimations.add(animateLines(element, splitLines(element), 0, 780));
        observer.unobserve(element);
        return;
      }

      const properties = {
        opacity: [0, 1],
        duration: type === 'media' ? 940 : type === 'video' ? 840 : type === 'row' ? 720 : 780,
        ease: 'out(4)',
        onComplete: () => element.classList.add('is-revealed')
      };

      if (type === 'media') {
        properties.clipPath = ['inset(7% 0 7% 0 round 14px)', 'inset(0% 0 0% 0 round 14px)'];
      } else {
        properties.y = [type === 'video' ? 14 : type === 'row' ? 18 : 22, 0];
        if (type === 'text') {
          properties.clipPath = ['inset(0 0 14% 0)', 'inset(0 0 0% 0)'];
        }
      }

      const animation = animate(element, properties);
      activeAnimations.add(animation);

      if (type === 'row') {
        const rowDetails = Array.from(element.children).filter(
          (child) => !child.matches('[data-depth-card], .work-row__copy')
        );
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

  return {
    destroy() {
      observer.disconnect();
      activeAnimations.forEach((animation) => animation.cancel?.());
      activeAnimations.clear();
      elements.forEach(settle);
      window.removeEventListener('portfolio:environment-change', onEnvironmentChange);
    }
  };
};
