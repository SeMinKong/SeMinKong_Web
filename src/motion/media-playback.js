export const initMediaPlayback = (environment) => {
  const videos = Array.from(document.querySelectorAll('video[data-auto-video]'));
  if (!videos.length) return;

  const visible = new Map(videos.map((video) => [video, false]));

  const sync = (video) => {
    const mayPlay = environment.motion !== 'reduced' && !document.hidden && visible.get(video);
    if (mayPlay) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const syncAll = () => videos.forEach(sync);

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        visible.set(entry.target, entry.isIntersecting && entry.intersectionRatio > 0.12);
        sync(entry.target);
      });
    }, { threshold: [0, 0.12, 0.5] });

    videos.forEach((video) => observer.observe(video));
  } else {
    videos.forEach((video) => visible.set(video, false));
    syncAll();
  }

  document.addEventListener('visibilitychange', syncAll);
  window.addEventListener('portfolio:environment-change', syncAll);
};
