import { createTimeline } from 'animejs';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const initHeroStory = (environment) => {
  const track = document.querySelector('[data-hero-story]');
  const sticky = track?.querySelector('[data-hero-sticky]');
  const copy = track?.querySelector('[data-hero-copy]');
  const role = track?.querySelector('[data-hero-role]');
  const statementLines = track ? Array.from(track.querySelectorAll('[data-hero-line]')) : [];
  const actions = track?.querySelector('[data-hero-actions]');
  const hand = track?.querySelector('[data-dexterous-hand]');
  const progress = track?.querySelector('[data-hero-progress]');

  if (!track || !sticky || !copy || !progress) return;

  let timeline = null;
  let frame = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let lastTime = 0;
  let visible = true;
  let keyboardSettled = false;
  let actionsReady = false;
  let targetDirty = true;
  let stageOffsetsKey = '';

  const stagedElements = [role, ...statementLines, actions].filter(Boolean);
  const shiftedElements = [copy, hand].filter(Boolean);

  const readStageOffset = (property) => {
    const value = Number.parseFloat(getComputedStyle(track).getPropertyValue(property));
    return Number.isFinite(value) ? value : 0;
  };

  const setActionsReady = (ready) => {
    if (actionsReady === ready) return;
    actionsReady = ready;
    track.toggleAttribute('data-hero-actions-ready', ready);
  };

  const clearStageStyles = () => {
    stagedElements.forEach((element) => {
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
      element.style.removeProperty('clip-path');
    });
    shiftedElements.forEach((element) => element.style.removeProperty('transform'));
    track.removeAttribute('data-hero-enhanced');
    track.removeAttribute('data-hero-actions-ready');
    actionsReady = false;
  };

  const readStageOffsets = () => {
    const copyStartY = readStageOffset('--hero-copy-start-y');
    const handStartX = readStageOffset('--hero-hand-start-x');
    const handStartY = readStageOffset('--hero-hand-start-y');

    return {
      copyStartY,
      handStartX,
      handStartY,
      key: `${copyStartY}:${handStartX}:${handStartY}`
    };
  };

  const buildTimeline = () => {
    if (environment.motion === 'reduced') return false;

    const offsets = readStageOffsets();
    if (timeline && offsets.key === stageOffsetsKey) return false;

    timeline?.revert?.();
    timeline = null;
    stageOffsetsKey = offsets.key;

    const { copyStartY, handStartX, handStartY } = offsets;

    timeline = createTimeline({ autoplay: false });

    timeline.add(copy, {
      y: [copyStartY, 0],
      duration: 3000,
      ease: 'inOut(2)'
    }, 0);

    if (hand) {
      timeline.add(hand, {
        x: [handStartX, 0],
        y: [handStartY, 0],
        duration: 3000,
        ease: 'inOut(2)'
      }, 0);
    }

    if (role) {
      timeline.add(role, {
        opacity: [0, 1],
        y: [12, 0],
        duration: 620,
        ease: 'out(3)'
      }, 420);
    }

    statementLines.forEach((line, index) => {
      timeline.add(line, {
        opacity: [0, 1],
        y: [18, 0],
        duration: index === 0 ? 1000 : 1150,
        ease: 'out(3)'
      }, 900 + (index * 1050));
    });

    if (actions) {
      timeline.add(actions, {
        opacity: [0, 1],
        y: [12, 0],
        duration: 800,
        ease: 'out(4)'
      }, 3300);
    }

    timeline.add(progress, {
      scaleX: [0, 1],
      duration: 4400,
      ease: 'linear'
    }, 0);

    timeline.seek(timeline.duration * clamp(currentProgress, 0, 1), true);
    track.setAttribute('data-hero-enhanced', '');
    setActionsReady(false);
    return true;
  };

  const render = (value) => {
    if (!timeline) return;
    const normalized = clamp(value, 0, 1);
    timeline.seek(timeline.duration * normalized, true);
    setActionsReady(keyboardSettled || normalized >= 0.75);
  };

  const updateTarget = () => {
    if (!timeline) return;
    const travel = Math.max(1, track.offsetHeight - sticky.offsetHeight);
    const scrollProgress = clamp(-track.getBoundingClientRect().top / travel, 0, 1);
    targetProgress = keyboardSettled ? 1 : scrollProgress;
  };

  const tick = (time) => {
    frame = 0;
    if (!timeline || !visible || document.hidden) return;

    if (targetDirty) {
      updateTarget();
      targetDirty = false;
    }

    const dt = Math.min(0.05, Math.max(0.001, (time - (lastTime || time)) / 1000));
    lastTime = time;
    const damping = environment.motion === 'full' ? 8 : 12;
    const alpha = 1 - Math.exp(-damping * dt);
    currentProgress += (targetProgress - currentProgress) * alpha;

    if (Math.abs(targetProgress - currentProgress) < 0.0007) {
      currentProgress = targetProgress;
    }

    render(currentProgress);
    if (currentProgress !== targetProgress) frame = requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (!timeline || !visible || document.hidden) return;
    targetDirty = true;
    if (!frame) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }
  };

  const syncImmediately = () => {
    if (!timeline) return;
    updateTarget();
    targetDirty = false;
    currentProgress = targetProgress;
    render(currentProgress);
  };

  const removeEnhancement = () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    timeline?.revert?.();
    timeline = null;
    currentProgress = 0;
    targetProgress = 0;
    targetDirty = true;
    keyboardSettled = false;
    stageOffsetsKey = '';
    clearStageStyles();
  };

  const settleForKeyboard = (event) => {
    if (!timeline || (event.type === 'keydown' && event.key !== 'Tab')) return;
    keyboardSettled = true;
    targetDirty = false;
    targetProgress = 1;
    currentProgress = 1;
    render(1);
  };

  const handleResize = () => {
    if (buildTimeline()) {
      syncImmediately();
      return;
    }
    schedule();
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', handleResize, { passive: true });
  window.addEventListener('pageshow', syncImmediately);
  window.addEventListener('keydown', settleForKeyboard, { capture: true });
  actions?.addEventListener('focusin', settleForKeyboard);

  window.addEventListener('portfolio:environment-change', (event) => {
    if (event.detail.motion === 'reduced') {
      removeEnhancement();
      return;
    }
    buildTimeline();
    syncImmediately();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      return;
    }
    syncImmediately();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible && frame) {
        cancelAnimationFrame(frame);
        frame = 0;
      }
      if (visible) syncImmediately();
    }, { rootMargin: '8% 0px' });
    observer.observe(track);
  }

  buildTimeline();
  syncImmediately();
  document.documentElement.classList.remove('hero-pending');
};
