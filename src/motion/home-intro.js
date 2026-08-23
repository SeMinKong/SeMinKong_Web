import { createDrawable, createTimeline } from 'animejs';
import { buildWritingWord, DISPLAY_NAME, mountHeroWordmark } from './home-intro-wordmark.js';

const INTRO_BLOCKED_KEYS = new Set([
  'Tab',
  'Escape',
  'Enter',
  ' ',
  'Backspace',
  'ArrowDown',
  'ArrowUp',
  'ArrowLeft',
  'ArrowRight',
  'PageDown',
  'PageUp',
  'Home',
  'End'
]);

const fontsReady = () => {
  if (!document.fonts) return Promise.resolve();

  return Promise.race([
    document.fonts.load('680 1em "Manrope Variable"', DISPLAY_NAME),
    new Promise((resolve) => window.setTimeout(resolve, 520))
  ]);
};

const getNavigationType = () => performance.getEntriesByType?.('navigation')?.[0]?.type;

export const initHomeIntro = (environment) => {
  const root = document.documentElement;
  const intro = document.querySelector('[data-home-intro]');
  const heroName = document.querySelector('.hero-identity__name');
  mountHeroWordmark(heroName);
  if (!intro) {
    root.classList.remove('home-intro-pending', 'home-intro-active', 'home-intro-locked');
    window.__homeIntroGate?.cancelFallback?.();
    window.__homeIntroGate?.unlock?.();
    return null;
  }

  const veil = intro.querySelector('[data-home-intro-veil]');
  const brand = intro.querySelector('[data-home-intro-brand]');
  const heroCopy = document.querySelector('[data-hero-copy]');
  const heroFluid = document.querySelector('[data-hero-fluid]');
  const navigation = document.querySelector('[data-site-nav]');
  const shouldPlay = environment.motion !== 'reduced'
    && !window.location.hash
    && !document.hidden
    && !window.__homeIntroTimedOut
    && window.scrollY <= 1
    && getNavigationType() !== 'back_forward'
    && veil
    && brand
    && heroName;

  let timeline = null;
  let animatedWordmark = null;
  let watchdog = 0;
  let restoreScrollFrame = 0;
  let finished = false;
  let pageLocked = false;
  let lockedElements = [];
  let previousBodyBusy = null;
  let resolveFinished;
  const lockedScrollX = window.scrollX;
  const lockedScrollY = window.scrollY;
  const finishedPromise = new Promise((resolve) => {
    resolveFinished = resolve;
  });

  const lockPage = () => {
    pageLocked = true;
    previousBodyBusy = document.body.getAttribute('aria-busy');
    if (previousBodyBusy === null) document.body.setAttribute('data-home-intro-busy', '');
    document.body.setAttribute('aria-busy', 'true');
    lockedElements = Array.from(document.body.children)
      .filter((element) => element !== intro && element.tagName !== 'SCRIPT')
      .map((element) => ({
        element,
        wasInert: element.hasAttribute('inert')
      }));

    lockedElements.forEach(({ element, wasInert }) => {
      if (!wasInert) element.setAttribute('data-home-intro-inert', '');
      element.setAttribute('inert', '');
    });
    const activeElement = document.activeElement;
    if (activeElement && lockedElements.some(({ element }) => element.contains(activeElement))) {
      activeElement.blur?.();
    }
    root.classList.add('home-intro-locked');
  };

  const unlockPage = () => {
    if (pageLocked) {
      lockedElements.forEach(({ element, wasInert }) => {
        if (!wasInert) element.removeAttribute('inert');
        element.removeAttribute('data-home-intro-inert');
      });
      lockedElements = [];

      if (previousBodyBusy === null) document.body.removeAttribute('aria-busy');
      else document.body.setAttribute('aria-busy', previousBodyBusy);
      document.body.removeAttribute('data-home-intro-busy');
      pageLocked = false;
    }
    window.__homeIntroGate?.cancelFallback?.();
    window.__homeIntroGate?.unlock?.();
    root.classList.remove('home-intro-locked');
  };

  const removeListeners = () => {
    window.removeEventListener('wheel', blockInput, true);
    window.removeEventListener('pointerdown', blockInput, true);
    window.removeEventListener('touchstart', blockInput, true);
    window.removeEventListener('touchmove', blockInput, true);
    window.removeEventListener('click', blockInput, true);
    window.removeEventListener('scroll', holdScroll, true);
    window.removeEventListener('keydown', handleKeydown, true);
    window.removeEventListener('pagehide', finish);
    window.removeEventListener('pageshow', handlePageShow);
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('portfolio:environment-change', handleEnvironmentChange);
    window.removeEventListener('portfolio:home-intro-timeout', finish);
  };

  const cleanupStyles = () => {
    heroName?.style.removeProperty('opacity');
    heroCopy?.style.removeProperty('opacity');
    heroFluid?.style.removeProperty('opacity');
    navigation?.style.removeProperty('opacity');
  };

  const commitAnimatedWordmark = () => {
    if (!animatedWordmark || !heroName) return;

    heroName.querySelector('.hero-identity__wordmark')?.remove();
    animatedWordmark.classList.remove('home-intro__writing');
    animatedWordmark.classList.add('hero-identity__wordmark');
    animatedWordmark.removeAttribute('style');
    animatedWordmark.querySelectorAll('.home-intro__writing-letter').forEach((letter) => {
      letter.classList.remove('home-intro__writing-letter');
      letter.removeAttribute('style');
    });
    animatedWordmark.querySelectorAll('.handwritten-wordmark__stroke').forEach((path) => {
      path.removeAttribute('style');
    });
    heroName.append(animatedWordmark);
  };

  function finish(event) {
    if (finished) return;
    finished = true;
    const deferSmoothScroll = event?.type === 'pagehide';
    if (watchdog) window.clearTimeout(watchdog);
    if (restoreScrollFrame) window.cancelAnimationFrame(restoreScrollFrame);
    try {
      timeline?.cancel?.();
      if (event?.type === 'timeline-complete') commitAnimatedWordmark();
    } finally {
      timeline = null;
      removeListeners();
      cleanupStyles();
      root.classList.remove('home-intro-pending', 'home-intro-active');
      unlockPage();
      intro.remove();
      window.dispatchEvent(new CustomEvent('portfolio:home-intro-complete'));
      resolveFinished?.({ deferSmoothScroll });
    }
  }

  finishedPromise.destroy = () => finish();

  function blockInput(event) {
    if (event.cancelable) event.preventDefault();
    event.stopImmediatePropagation();
  }

  function holdScroll() {
    if (finished || restoreScrollFrame) return;
    if (Math.abs(window.scrollX - lockedScrollX) < 1 && Math.abs(window.scrollY - lockedScrollY) < 1) return;

    restoreScrollFrame = window.requestAnimationFrame(() => {
      restoreScrollFrame = 0;
      window.scrollTo(lockedScrollX, lockedScrollY);
    });
  }

  function handleKeydown(event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (INTRO_BLOCKED_KEYS.has(event.key)) blockInput(event);
  }

  function handlePageShow(event) {
    if (event.persisted || document.hidden || window.scrollY > 1) finish(event);
  }

  function handleVisibility() {
    if (document.hidden) finish();
  }

  function handleEnvironmentChange(event) {
    if (event.detail.motion === 'reduced') finish(event);
  }

  if (!shouldPlay) {
    finish();
    return finishedPromise;
  }

  intro.hidden = false;
  heroName.style.opacity = '0';
  if (heroCopy) heroCopy.style.opacity = '0';
  if (heroFluid) heroFluid.style.opacity = '0';
  if (navigation) navigation.style.opacity = '0';
  root.classList.add('home-intro-active');
  lockPage();

  window.addEventListener('wheel', blockInput, { capture: true, passive: false });
  window.addEventListener('pointerdown', blockInput, { capture: true, passive: false });
  window.addEventListener('touchstart', blockInput, { capture: true, passive: false });
  window.addEventListener('touchmove', blockInput, { capture: true, passive: false });
  window.addEventListener('click', blockInput, { capture: true, passive: false });
  window.addEventListener('scroll', holdScroll, { capture: true, passive: true });
  window.addEventListener('keydown', handleKeydown, true);
  window.addEventListener('pagehide', finish);
  window.addEventListener('pageshow', handlePageShow);
  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('portfolio:environment-change', handleEnvironmentChange);
  window.addEventListener('portfolio:home-intro-timeout', finish);
  const full = environment.motion === 'full';
  const writeStart = full ? 100 : 80;
  const writingDuration = full ? 1350 : 820;
  const writingEnd = writeStart + writingDuration;
  const revealStart = writingEnd + (full ? 50 : 40);
  const revealDuration = full ? 880 : 720;
  const moveStart = writingEnd + (full ? 275 : 205);
  const moveDuration = full ? 570 : 490;
  const entryScale = full ? 1.16 : 1.1;
  const introScale = full ? 1.32 : 1.18;
  const assemblyStart = writingEnd + (full ? 270 : 190);
  const navigationDelay = full ? 90 : 70;
  const timelineEnd = revealStart + revealDuration;
  watchdog = window.setTimeout(finish, timelineEnd + 1300);

  fontsReady().then(() => {
    if (finished) return;

    const { writing, letters, strokes } = buildWritingWord(brand);
    animatedWordmark = writing;

    const brandRect = brand.getBoundingClientRect();
    const writingRect = writing.getBoundingClientRect();
    const targetRect = heroName.querySelector('.hero-identity__wordmark')?.getBoundingClientRect();
    if (!brandRect.width || !writingRect.width || !targetRect?.width) {
      finish();
      return;
    }

    const brandCenterX = brandRect.left + (brandRect.width / 2);
    const brandCenterY = brandRect.top + (brandRect.height / 2);
    const writingCenterX = writingRect.left + (writingRect.width / 2);
    const writingCenterY = writingRect.top + (writingRect.height / 2);
    const targetScale = Math.min(
      targetRect.width / writingRect.width,
      targetRect.height / writingRect.height
    );
    const targetX = (targetRect.left + (targetRect.width / 2))
      - (brandCenterX + ((writingCenterX - brandCenterX) * targetScale));
    const targetY = (targetRect.top + (targetRect.height / 2))
      - (brandCenterY + ((writingCenterY - brandCenterY) * targetScale));
    const drawableStrokes = createDrawable(strokes.map(({ path }) => path));
    const totalStrokeWeight = strokes.reduce((total, { weight }) => total + weight, 0);
    const letterEndTimes = new Map();
    let strokeCursor = writeStart;
    timeline = createTimeline({
      autoplay: false,
      onComplete: () => finish({ type: 'timeline-complete' })
    });
    timeline
      .add(brand, {
        opacity: [0, 1],
        duration: 1,
        ease: 'linear'
      }, 0)
      .add(brand, {
        scale: [entryScale, introScale],
        duration: writeStart + writingDuration,
        ease: 'out(3)'
      }, 0);

    strokes.forEach(({ letter, weight }, index) => {
      const duration = writingDuration * (weight / totalStrokeWeight);
      timeline.add(drawableStrokes[index], {
        draw: ['0 0', '0 1'],
        duration,
        ease: 'inOut(2)'
      }, strokeCursor);
      strokeCursor += duration;
      letterEndTimes.set(letter, strokeCursor);
    });

    letters.forEach((letter) => {
      const letterEnd = letterEndTimes.get(letter) ?? writeStart;
      const riseDuration = full ? 85 : 65;
      const settleDuration = full ? 225 : 165;
      const bounceY = full ? -7 : -4;
      const bounceScale = full ? 1.055 : 1.035;
      const bounceStart = letterEnd - (full ? 35 : 24);

      timeline
        .add(letter, {
          y: [0, bounceY],
          scale: [1, bounceScale],
          duration: riseDuration,
          ease: 'out(3)'
        }, bounceStart)
        .add(letter, {
          y: [bounceY, 0],
          scale: [bounceScale, 1],
          duration: settleDuration,
          ease: 'outElastic(1, .6)'
        }, bounceStart + riseDuration);
    });

    timeline
      .add(veil, {
        opacity: [1, 0],
        duration: revealDuration,
        ease: 'inOut(2)'
      }, revealStart)
      .add(brand, {
        x: [0, targetX],
        y: [0, targetY],
        scale: [introScale, targetScale],
        duration: moveDuration,
        ease: 'inOut(3)'
      }, moveStart);

    if (heroCopy) {
      timeline.add(heroCopy, {
        opacity: [0, 1],
        duration: timelineEnd - assemblyStart,
        ease: 'out(3)'
      }, assemblyStart);
    }

    if (heroFluid) {
      timeline.add(heroFluid, {
        opacity: [0, 1],
        duration: timelineEnd - assemblyStart,
        ease: 'out(3)'
      }, assemblyStart);
    }

    if (navigation) {
      timeline.add(navigation, {
        opacity: [0, 1],
        duration: timelineEnd - (assemblyStart + navigationDelay),
        ease: 'out(3)'
      }, assemblyStart + navigationDelay);
    }

    timeline.play();
  }).catch(finish);

  return finishedPromise;
};
