import { clamp } from './utils.js';

const PROGRESS_EVENT = 'portfolio:hero-progress';

export const initHeroStory = (environment) => {
  const track = document.querySelector('[data-hero-story]');
  const sticky = track?.querySelector('[data-hero-sticky]');

  if (!track || !sticky) {
    document.documentElement.classList.remove('hero-pending');
    return;
  }

  let frame = 0;
  let lastProgress = -1;
  let destroyed = false;

  const readProgress = () => {
    if (environment.motion === 'reduced') return 0;

    const travel = Math.max(1, track.offsetHeight - sticky.offsetHeight);
    return clamp(-track.getBoundingClientRect().top / travel, 0, 1);
  };

  const render = () => {
    frame = 0;
    if (destroyed) return;
    const progress = readProgress();
    if (Math.abs(progress - lastProgress) < 0.0005) return;

    lastProgress = progress;
    track.style.setProperty('--hero-scroll-progress', progress.toFixed(4));
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT, { detail: { progress } }));
  };

  const schedule = () => {
    if (!frame) frame = window.requestAnimationFrame(render);
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.addEventListener('pageshow', schedule);
  window.addEventListener('portfolio:environment-change', schedule);

  render();
  document.documentElement.classList.remove('hero-pending');

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('pageshow', schedule);
      window.removeEventListener('portfolio:environment-change', schedule);
      track.style.removeProperty('--hero-scroll-progress');
    }
  };
};
