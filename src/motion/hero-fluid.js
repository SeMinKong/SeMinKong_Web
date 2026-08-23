export const initHeroFluid = (siteFluid) => {
  const story = document.querySelector('[data-hero-story]');
  if (!story || !siteFluid) return null;

  const handleProgress = (event) => {
    siteFluid.setProgress(event.detail?.progress ?? 0);
    siteFluid.refreshObstacle();
  };

  window.addEventListener('portfolio:hero-progress', handleProgress);

  return {
    destroy() {
      window.removeEventListener('portfolio:hero-progress', handleProgress);
    }
  };
};
