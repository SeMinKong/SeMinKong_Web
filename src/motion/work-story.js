import { loadGsap } from './gsap-loader.js';

const STORY_VIEWPORT = window.matchMedia('(min-width: 961px) and (min-height: 700px)');

export const initWorkStory = (environment, { smoothScroll } = {}) => {
  const list = document.querySelector('.work-list');
  const chapters = list ? Array.from(list.querySelectorAll('.work-row')) : [];
  if (!list || chapters.length < 2) return;

  // Work chapters are either owned by this scrubbed story or shown as a
  // complete static list. The generic one-shot row reveal must not compete
  // with ScrollTrigger for the outer row transform.
  chapters.forEach((chapter) => chapter.removeAttribute('data-reveal'));

  let context = null;
  let scrollTrigger = null;
  let disconnectSmoothScroll = null;
  let setupVersion = 0;
  let destroyed = false;

  const shouldEnhance = () => (
    environment.motion === 'full'
    && environment.depth === 'interactive'
    && STORY_VIEWPORT.matches
  );

  const stop = () => {
    setupVersion += 1;
    disconnectSmoothScroll?.();
    disconnectSmoothScroll = null;
    context?.revert();
    context = null;
    chapters.forEach((chapter) => chapter.classList.remove('is-work-active'));
    list.querySelectorAll('.work-row__composition, .work-row__media-stage, .work-row__title-text, .work-row__copy > *, .work-row__arrow').forEach((element) => {
      if (!element.getAttribute('style')) element.removeAttribute('style');
    });
    list.classList.remove('work-story-enabled');
    scrollTrigger?.refresh();
  };

  const start = async () => {
    if (destroyed || context || !shouldEnhance()) return;

    const version = ++setupVersion;
    try {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (destroyed || version !== setupVersion || !shouldEnhance() || context) return;

      scrollTrigger = ScrollTrigger;
      disconnectSmoothScroll = smoothScroll?.onScroll(ScrollTrigger.update) ?? null;
      list.classList.add('work-story-enabled');

      context = gsap.context(() => {
        chapters.forEach((chapter, index) => {
          const composition = chapter.querySelector('.work-row__composition');
          const stage = chapter.querySelector('.work-row__media-stage');
          const copy = chapter.querySelector('.work-row__copy');
          const title = chapter.querySelector('.work-row__title-text');
          const arrow = chapter.querySelector('.work-row__arrow');
          const usesNativeVideo = stage?.classList.contains('work-row__media-stage--native');
          const details = copy
            ? Array.from(copy.children).filter((element) => !element.matches('h2'))
            : [];
          if (!composition || !stage || !copy || !title) return;

          const direction = index % 2 === 0 ? -1 : 1;
          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: chapter,
              start: 'top 92%',
              end: 'bottom 8%',
              scrub: 0.6,
              invalidateOnRefresh: true,
              onToggle: ({ isActive }) => chapter.classList.toggle('is-work-active', isActive)
            }
          });

          timeline.fromTo(composition, {
            filter: 'brightness(0.9) saturate(0.82)',
            rotation: direction * 0.45,
            scale: 0.965,
            x: direction * Math.min(window.innerWidth * 0.04, 52),
            y: 58
          }, {
            duration: 0.34,
            ease: 'power3.out',
            filter: 'brightness(1) saturate(1)',
            rotation: 0,
            scale: 1,
            x: 0,
            y: 0
          }, 0);

          const stageFrom = {
            autoAlpha: 0.42,
            scale: 0.91,
            x: direction * 48
          };
          const stageTo = {
            autoAlpha: 1,
            duration: 0.34,
            ease: 'power3.out',
            scale: 1,
            x: 0
          };

          if (!usesNativeVideo) {
            stageFrom.clipPath = 'inset(8% 6% 8% 6% round 4px)';
            stageTo.clipPath = 'inset(0% 0% 0% 0% round 0px)';
          }

          timeline.fromTo(stage, stageFrom, stageTo, 0.02);

          timeline.fromTo(title, { yPercent: 112 }, {
            duration: 0.24,
            ease: 'power3.out',
            yPercent: 0
          }, 0.08);

          if (details.length) {
            timeline.fromTo(details, { autoAlpha: 0.08, y: 22 }, {
              autoAlpha: 1,
              duration: 0.2,
              ease: 'power2.out',
              stagger: 0.025,
              y: 0
            }, 0.11);
          }

          if (arrow) {
            timeline.fromTo(arrow, { opacity: 0.18, rotation: -28, x: -10, y: 10 }, {
              duration: 0.2,
              ease: 'power3.out',
              opacity: 1,
              rotation: 0,
              x: 0,
              y: 0
            }, 0.16);
          }

          timeline.to(composition, {
            duration: 0.28,
            ease: 'power2.inOut',
            filter: 'brightness(0.82) saturate(0.74)',
            rotation: direction * -0.28,
            scale: 0.975,
            y: () => -Math.min(window.innerHeight * 0.04, 34)
          }, 0.72);

          const stageExit = {
            duration: 0.28,
            ease: 'power2.inOut',
            scale: 0.985,
            x: direction * -18
          };

          if (!usesNativeVideo) {
            stageExit.clipPath = 'inset(3% 2% 3% 2% round 3px)';
          }

          timeline.to(stage, stageExit, 0.72);

          if (arrow) {
            timeline.to(arrow, {
              duration: 0.14,
              opacity: 0.42,
              rotation: 18,
              x: 8,
              y: -8
            }, 0.86);
          }
        });
      }, list);

      ScrollTrigger.refresh();
    } catch {
      if (version === setupVersion) stop();
    }
  };

  const reconcile = () => {
    if (destroyed) return;
    if (shouldEnhance()) start();
    else stop();
  };

  window.addEventListener('portfolio:environment-change', reconcile);
  window.addEventListener('pagehide', stop);
  window.addEventListener('pageshow', reconcile);
  STORY_VIEWPORT.addEventListener('change', reconcile);
  reconcile();

  return {
    destroy() {
      destroyed = true;
      window.removeEventListener('portfolio:environment-change', reconcile);
      window.removeEventListener('pagehide', stop);
      window.removeEventListener('pageshow', reconcile);
      STORY_VIEWPORT.removeEventListener('change', reconcile);
      stop();
    }
  };
};
