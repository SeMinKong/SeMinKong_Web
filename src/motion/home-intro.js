import { createTimeline } from 'animejs';

const fontsReady = () => {
  if (!document.fonts) return Promise.resolve();

  return Promise.race([
    document.fonts.load('680 1em "Manrope Variable"', 'SeMinKong'),
    new Promise((resolve) => window.setTimeout(resolve, 520))
  ]);
};

const getNavigationType = () => performance.getEntriesByType?.('navigation')?.[0]?.type;

const getTextRect = (element) => {
  const rect = element.getBoundingClientRect();
  const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight);
  const height = Number.isFinite(lineHeight) ? lineHeight : rect.height;

  return {
    left: rect.left,
    top: rect.top + ((rect.height - height) / 2),
    width: rect.width,
    height
  };
};

const buildWritingWord = (brand, heroName) => {
  const text = (heroName.getAttribute('aria-label') ?? heroName.textContent).trim();
  const word = document.createElement('span');
  const writing = document.createElement('span');
  const nib = document.createElement('span');

  word.className = 'home-intro__word';
  writing.className = 'home-intro__writing';
  nib.className = 'home-intro__nib';
  writing.setAttribute('aria-hidden', 'true');
  nib.setAttribute('aria-hidden', 'true');

  if (heroName.children.length) {
    word.replaceChildren(...Array.from(heroName.children, (letter) => letter.cloneNode(true)));
  } else {
    word.textContent = text;
  }

  Array.from(text).forEach((character) => {
    const letter = document.createElement('span');
    letter.className = 'home-intro__writing-letter';
    letter.textContent = character;
    writing.append(letter);
  });

  brand.replaceChildren(word, writing);
  document.body.append(nib);
  return { word, writing, nib, letters: Array.from(writing.children) };
};

export const initHomeIntro = (environment) => {
  const root = document.documentElement;
  const startingMotion = environment.motion;
  const intro = document.querySelector('[data-home-intro]');
  if (!intro) {
    root.classList.remove('home-intro-pending', 'home-intro-active');
    return null;
  }

  const panels = Array.from(intro.querySelectorAll('[data-home-intro-panel]'));
  const brand = intro.querySelector('[data-home-intro-brand]');
  const heroName = document.querySelector('.hero-identity__name');
  const heroCopy = document.querySelector('[data-hero-copy]');
  const navigation = document.querySelector('[data-site-nav]');
  const shouldPlay = environment.motion !== 'reduced'
    && !window.location.hash
    && !document.hidden
    && window.scrollY <= 1
    && getNavigationType() !== 'back_forward'
    && panels.length === 2
    && brand
    && heroName;

  let timeline = null;
  let writingNib = null;
  let watchdog = 0;
  let finished = false;
  let resolveFinished;
  const finishedPromise = new Promise((resolve) => {
    resolveFinished = resolve;
  });

  const removeListeners = () => {
    window.removeEventListener('wheel', finish, true);
    window.removeEventListener('pointerdown', finish, true);
    window.removeEventListener('touchstart', finish, true);
    window.removeEventListener('scroll', finish, true);
    window.removeEventListener('resize', finish);
    window.removeEventListener('keydown', handleKeydown, true);
    window.removeEventListener('pagehide', finish);
    window.removeEventListener('pageshow', handlePageShow);
    document.removeEventListener('visibilitychange', handleVisibility);
    window.removeEventListener('portfolio:environment-change', handleEnvironmentChange);
  };

  const cleanupStyles = () => {
    heroName?.style.removeProperty('opacity');
    heroCopy?.style.removeProperty('opacity');
    navigation?.style.removeProperty('opacity');
  };

  function finish(event) {
    if (finished) return;
    finished = true;
    const deferSmoothScroll = event?.type === 'pagehide';
    if (watchdog) window.clearTimeout(watchdog);
    timeline?.cancel?.();
    timeline = null;
    writingNib?.remove();
    writingNib = null;
    removeListeners();
    cleanupStyles();
    root.classList.remove('home-intro-pending', 'home-intro-active');
    intro.remove();
    window.dispatchEvent(new CustomEvent('portfolio:home-intro-complete'));
    resolveFinished?.({ deferSmoothScroll });
  }

  function handleKeydown(event) {
    if (['Tab', 'Escape', 'Enter', ' ', 'ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'PageDown', 'PageUp', 'Home', 'End'].includes(event.key)) finish();
  }

  function handlePageShow(event) {
    if (event.persisted || document.hidden || window.scrollY > 1) finish(event);
  }

  function handleVisibility() {
    if (document.hidden) finish();
  }

  function handleEnvironmentChange(event) {
    if (event.detail.motion !== startingMotion) finish();
  }

  if (!shouldPlay) {
    finish();
    return finishedPromise;
  }

  intro.hidden = false;
  heroName.style.opacity = '0';
  if (heroCopy) heroCopy.style.opacity = '0';
  if (navigation) navigation.style.opacity = '0';
  root.classList.add('home-intro-active');

  window.addEventListener('wheel', finish, { capture: true, passive: true });
  window.addEventListener('pointerdown', finish, { capture: true, passive: true });
  window.addEventListener('touchstart', finish, { capture: true, passive: true });
  window.addEventListener('scroll', finish, { capture: true, passive: true });
  window.addEventListener('resize', finish, { passive: true });
  window.addEventListener('keydown', handleKeydown, true);
  window.addEventListener('pagehide', finish);
  window.addEventListener('pageshow', handlePageShow);
  document.addEventListener('visibilitychange', handleVisibility);
  window.addEventListener('portfolio:environment-change', handleEnvironmentChange);
  watchdog = window.setTimeout(finish, 2300);

  const full = environment.motion === 'full';
  const writeStart = full ? 12 : 8;
  const letterDuration = full ? 150 : 120;
  const letterStagger = full ? 42 : 34;
  const swapStart = full ? 500 : 400;
  const swapDuration = full ? 50 : 40;
  const splitStart = full ? 560 : 450;
  const splitDuration = full ? 820 : 570;
  const moveStart = full ? 610 : 485;
  const moveDuration = full ? 710 : 485;
  const handoffStart = moveStart + moveDuration;
  const handoffDuration = full ? 60 : 50;
  const settledScale = 1;
  const assemblyStart = full ? 1120 : 760;

  fontsReady().then(() => {
    if (finished) return;

    const { word, writing, nib, letters } = buildWritingWord(brand, heroName);
    writingNib = nib;

    const brandRect = brand.getBoundingClientRect();
    const writingRect = writing.getBoundingClientRect();
    const targetRect = getTextRect(heroName);
    if (!brandRect.width || !targetRect.width) {
      finish();
      return;
    }

    if (writingRect.width) {
      writing.style.transform = `scaleX(${brandRect.width / writingRect.width})`;
    }

    const targetX = (targetRect.left + (targetRect.width / 2))
      - (brandRect.left + (brandRect.width / 2));
    const targetY = (targetRect.top + (targetRect.height / 2))
      - (brandRect.top + (brandRect.height / 2));
    const targetScale = targetRect.width / brandRect.width;
    const writingDuration = letterDuration + (Math.max(0, letters.length - 1) * letterStagger);
    nib.style.left = `${brandRect.left - 1}px`;
    nib.style.top = `${brandRect.top + (brandRect.height * 0.76)}px`;
    timeline = createTimeline({ autoplay: false, onComplete: finish });
    timeline
      .add(brand, {
        opacity: [0, 1],
        duration: 1,
        ease: 'linear'
      }, 0)
      .add(letters, {
        opacity: [0.48, 1],
        clipPath: [
          'polygon(-8% -12%, -8% -12%, -18% 112%, -18% 112%)',
          'polygon(-8% -12%, 112% -12%, 102% 112%, -18% 112%)'
        ],
        duration: letterDuration,
        delay: (_, index) => index * letterStagger,
        ease: 'out(3)'
      }, writeStart)
      .add(nib, {
        opacity: [0, 0.82],
        duration: full ? 70 : 50,
        ease: 'out(2)'
      }, writeStart)
      .add(nib, {
        x: [-3, brandRect.width + 3],
        y: [1, -1],
        duration: writingDuration,
        ease: 'inOut(1)'
      }, writeStart)
      .add(nib, {
        opacity: [0.82, 0],
        duration: full ? 84 : 68,
        ease: 'out(2)'
      }, swapStart - (full ? 24 : 18))
      .add(writing, {
        opacity: [1, 0],
        duration: swapDuration,
        ease: 'linear'
      }, swapStart)
      .add(word, {
        opacity: [0, 1],
        duration: swapDuration,
        ease: 'linear'
      }, swapStart)
      .add(panels[0], {
        x: ['0%', '-100.5%'],
        duration: splitDuration,
        ease: 'inOut(3)'
      }, splitStart)
      .add(panels[1], {
        x: ['0%', '100.5%'],
        duration: splitDuration,
        ease: 'inOut(3)'
      }, splitStart)
      .add(brand, {
        x: [0, targetX],
        y: [0, targetY],
        scale: [settledScale, targetScale],
        duration: moveDuration,
        ease: 'inOut(3)'
      }, moveStart)
      .add(brand, {
        opacity: [1, 0],
        duration: handoffDuration,
        ease: 'linear'
      }, handoffStart)
      .add(heroName, {
        opacity: [0, 1],
        duration: handoffDuration,
        ease: 'linear'
      }, handoffStart);

    if (heroCopy) {
      timeline.add(heroCopy, {
        opacity: [0, 1],
        duration: handoffStart - assemblyStart,
        ease: 'out(3)'
      }, assemblyStart);
    }

    if (navigation) {
      timeline.add(navigation, {
        opacity: [0, 1],
        duration: (splitStart + splitDuration) - (assemblyStart + (full ? 80 : 40)),
        ease: 'out(3)'
      }, assemblyStart + (full ? 80 : 40));
    }

    timeline.play();
  }).catch(finish);

  return finishedPromise;
};
