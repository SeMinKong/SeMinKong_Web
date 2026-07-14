import { createTimeline } from 'animejs';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const initHeroStory = (environment) => {
  const track = document.querySelector('[data-hero-story]');
  const sticky = track?.querySelector('[data-hero-sticky]');
  const copy = track?.querySelector('[data-hero-copy]');
  const statementLines = track ? Array.from(track.querySelectorAll('[data-hero-line]')) : [];
  const progress = track?.querySelector('[data-hero-progress]');

  if (!track || !sticky || !copy || !progress) return;

  let timeline = null;
  let frame = 0;
  let targetProgress = 0;
  let currentProgress = 0;
  let lastTime = 0;
  let visible = true;

  const buildTimeline = () => {
    if (timeline || environment.motion === 'reduced') return;

    timeline = createTimeline({ autoplay: false })
      .add(copy, {
        opacity: [1, 0.9],
        y: [0, -8],
        duration: 1000,
        ease: 'inOut(3)'
      }, 0);

    statementLines.forEach((line, index) => {
      timeline.add(line, {
        opacity: [index === 0 ? 0.66 : 0.24, 1],
        y: [12 + (index * 12), 0],
        duration: 760,
        ease: 'out(4)'
      }, index * 150);
    });

    timeline
      .add(progress, {
        scaleX: [0, 1],
        duration: 1000,
        ease: 'linear'
      }, 0);

    timeline.seek(0, true);
  };

  const render = (value) => {
    if (!timeline) return;
    timeline.seek(timeline.duration * clamp(value, 0, 1), true);
  };

  const updateTarget = () => {
    if (!timeline) return;
    const travel = Math.max(1, track.offsetHeight - sticky.offsetHeight);
    const scrollProgress = clamp(-track.getBoundingClientRect().top / travel, 0, 1);
    targetProgress = clamp(scrollProgress / 0.92, 0, 1);
  };

  const tick = (time) => {
    frame = 0;
    if (!timeline || !visible || document.hidden) return;

    const dt = Math.min(0.05, Math.max(0.001, (time - (lastTime || time)) / 1000));
    lastTime = time;
    const damping = environment.motion === 'full' ? 12 : 18;
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
    updateTarget();
    if (!frame) {
      lastTime = 0;
      frame = requestAnimationFrame(tick);
    }
  };

  const syncImmediately = () => {
    if (!timeline) return;
    updateTarget();
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
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', syncImmediately);

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
};
