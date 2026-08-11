import { createTimeline } from 'animejs';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const initHeroStory = (environment) => {
  const track = document.querySelector('[data-hero-story]');
  const sticky = track?.querySelector('[data-hero-sticky]');
  const copy = track?.querySelector('[data-hero-copy]');
  const role = track?.querySelector('[data-hero-role]');
  const statementLines = track ? Array.from(track.querySelectorAll('[data-hero-line]')) : [];
  const actions = track?.querySelector('[data-hero-actions]');
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

  const stagedElements = [role, ...statementLines, actions].filter(Boolean);

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
    track.removeAttribute('data-hero-enhanced');
    track.removeAttribute('data-hero-actions-ready');
    actionsReady = false;
  };

  const buildTimeline = () => {
    if (timeline || environment.motion === 'reduced') return;

    timeline = createTimeline({ autoplay: false });

    if (role) {
      timeline.add(role, {
        opacity: [0, 1],
        y: [12, 0],
        duration: 720,
        ease: 'out(3)'
      }, 240);
    }

    statementLines.forEach((line, index) => {
      timeline.add(line, {
        opacity: [0, 1],
        y: [30, 0],
        clipPath: ['inset(0 0 100% 0)', 'inset(0 0 0% 0)'],
        duration: 1180,
        ease: 'out(3)'
      }, 780 + (index * 1220));
    });

    if (actions) {
      timeline.add(actions, {
        opacity: [0, 1],
        y: [18, 0],
        duration: 860,
        ease: 'out(4)'
      }, 3440);
    }

    timeline.add(progress, {
      scaleX: [0, 1],
      duration: 4400,
      ease: 'linear'
    }, 0);

    timeline.seek(0, true);
    track.setAttribute('data-hero-enhanced', '');
    setActionsReady(false);
  };

  const render = (value) => {
    if (!timeline) return;
    const normalized = clamp(value, 0, 1);
    timeline.seek(timeline.duration * normalized, true);
    setActionsReady(keyboardSettled || normalized >= 0.78);
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

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
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
