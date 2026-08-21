import { animate } from 'animejs';

const fontsReady = () => Promise.race([
  document.fonts?.ready ?? Promise.resolve(),
  new Promise((resolve) => window.setTimeout(resolve, 180))
]);

const splitLetters = (element) => {
  const original = element.textContent;
  element.setAttribute('aria-label', original.trim());
  element.innerHTML = original
    .split('')
    .map((ch) => (ch.trim() === ''
      ? ch
      : `<span class="name-letter" aria-hidden="true">${ch}</span>`))
    .join('');
  return Array.from(element.querySelectorAll('.name-letter'));
};

export const initNameEmphasis = (environment) => {
  if (environment.motion !== 'full') return;

  const targets = [];
  const registry = new Map();

  const heroName = document.querySelector('.hero-identity__name');
  if (heroName) {
    targets.push({
      element: heroName,
      trigger: heroName.closest('h1') ?? heroName,
      entrance: false,
      maskTarget: heroName.closest('h1') ?? heroName,
      lift: 6,
      weightPeak: 800,
      weightBase: 680,
      waveDuration: 520,
      stagger: 36
    });
  }

  const wordmarkText = document.querySelector('.wordmark > span:not(.wordmark__signal)');
  if (wordmarkText) {
    targets.push({
      element: wordmarkText,
      trigger: wordmarkText.closest('.wordmark') ?? wordmarkText,
      entrance: false,
      lift: 3,
      weightPeak: 780,
      weightBase: 650,
      waveDuration: 420,
      stagger: 30
    });
  }

  if (!targets.length) return;

  let disabled = false;

  const restore = (target) => {
    const state = registry.get(target.element);
    if (!state) return;
    state.animations.forEach((animation) => animation.cancel?.());
    target.element.textContent = state.original;
    target.element.removeAttribute('aria-label');
    (target.maskTarget ?? target.element).classList.remove('name-mask');
    target.element.style.opacity = '';
    registry.delete(target.element);
  };

  targets.forEach((target) => {
    const { element } = target;
    const original = element.textContent;
    const letters = splitLetters(element);
    if (!letters.length) {
      element.textContent = original;
      return;
    }
    const state = { original, letters, busy: false, animations: new Set() };
    registry.set(element, state);

    const wave = () => {
      if (disabled || state.busy) return;
      state.busy = true;
      const animation = animate(letters, {
        y: [0, -target.lift, 0],
        fontWeight: [target.weightBase, target.weightPeak, target.weightBase],
        duration: target.waveDuration,
        delay: (_, index) => index * target.stagger,
        ease: 'inOut(2)',
        onComplete: () => {
          state.busy = false;
          letters.forEach((letter) => {
            letter.style.transform = '';
            letter.style.fontWeight = '';
          });
        }
      });
      state.animations.add(animation);
    };

    if (target.entrance) {
      const maskTarget = target.maskTarget ?? element;
      maskTarget.classList.add('name-mask');
      letters.forEach((letter) => {
        letter.style.transform = 'translateY(114%)';
      });
      fontsReady().then(() => {
        if (disabled || !registry.has(element)) return;
        element.style.opacity = '1';
        const animation = animate(letters, {
          y: ['114%', '0%'],
          duration: 880,
          delay: (_, index) => 60 + (index * 34),
          ease: 'out(4)',
          onComplete: () => {
            maskTarget.classList.remove('name-mask');
            letters.forEach((letter) => {
              letter.style.transform = '';
            });
          }
        });
        state.animations.add(animation);
      });
    }

    target.trigger.addEventListener('pointerenter', wave);
    target.trigger.addEventListener('focus', wave, true);
  });

  const teardown = () => {
    disabled = true;
    targets.forEach(restore);
  };

  window.addEventListener('portfolio:environment-change', (event) => {
    if (event.detail.motion !== 'full') teardown();
  });
};
