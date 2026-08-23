export const initMediaPlayback = (environment) => {
  const videos = Array.from(document.querySelectorAll('video[data-auto-video]'));
  const demoVideos = Array.from(document.querySelectorAll('video[data-demo-video]'));
  if (!videos.length && !demoVideos.length) return;

  const demoPlayHandlers = new Map();
  let observer = null;

  const pauseDemoVideos = (except = null) => {
    demoVideos.forEach((video) => {
      if (video !== except) video.pause();
    });
  };

  demoVideos.forEach((video) => {
    const onPlay = () => pauseDemoVideos(video);
    demoPlayHandlers.set(video, onPlay);
    video.addEventListener('play', onPlay);
  });

  const pauseWhenHidden = () => {
    if (document.hidden) pauseDemoVideos();
  };
  const pauseOnPageHide = () => pauseDemoVideos();

  document.addEventListener('visibilitychange', pauseWhenHidden);
  window.addEventListener('pagehide', pauseOnPageHide);

  if (!videos.length) {
    return {
      destroy() {
        demoPlayHandlers.forEach((handler, video) => video.removeEventListener('play', handler));
        document.removeEventListener('visibilitychange', pauseWhenHidden);
        window.removeEventListener('pagehide', pauseOnPageHide);
        pauseDemoVideos();
      }
    };
  }

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
    observer = new IntersectionObserver((entries) => {
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

  return {
    destroy() {
      observer?.disconnect();
      demoPlayHandlers.forEach((handler, video) => video.removeEventListener('play', handler));
      document.removeEventListener('visibilitychange', pauseWhenHidden);
      document.removeEventListener('visibilitychange', syncAll);
      window.removeEventListener('pagehide', pauseOnPageHide);
      window.removeEventListener('portfolio:environment-change', syncAll);
      videos.forEach((video) => video.pause());
      pauseDemoVideos();
      visible.clear();
    }
  };
};
