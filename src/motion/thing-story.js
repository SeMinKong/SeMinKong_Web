import { loadGsap } from './gsap-loader.js';

const STORY_VIEWPORT = window.matchMedia('(min-width: 1021px) and (min-height: 640px)');

export const initThingStory = (environment, { smoothScroll } = {}) => {
  const root = document.querySelector('.case-page--thing .case-study');
  if (!root) return;

  const demoItems = Array.from(root.querySelectorAll('#thing-scenes .thing-demo-list > li'));
  const evidenceGrid = root.querySelector('.thing-evidence-grid');
  const evidenceFigures = evidenceGrid
    ? Array.from(evidenceGrid.querySelectorAll('.thing-evidence-media'))
    : [];
  const pipeline = root.querySelector('#system-path');
  const pipelineRows = pipeline ? Array.from(pipeline.querySelectorAll('.case-flow > div')) : [];
  const pipelineLabels = pipelineRows
    .map((row) => row.querySelector('strong'))
    .filter(Boolean);
  const architecture = root.querySelector('#system-design');
  const architectureItems = architecture
    ? Array.from(architecture.querySelectorAll('.case-list > li'))
    : [];

  if (!demoItems.length && !evidenceFigures.length && !pipelineRows.length && !architectureItems.length) {
    return;
  }

  const activeElements = [
    ...demoItems,
    evidenceGrid,
    pipeline,
    architecture
  ].filter(Boolean);
  const animatedElements = [
    ...demoItems.flatMap((item) => [
      item.querySelector('.thing-demo-card__media'),
      item.querySelector('figcaption')
    ]),
    ...evidenceFigures,
    ...pipelineRows,
    ...pipelineLabels,
    ...architectureItems
  ].filter(Boolean);

  let context = null;
  let scrollTriggerApi = null;
  let disconnectSmoothScroll = null;
  let refreshFrame = 0;
  let setupVersion = 0;
  let pageActive = !document.hidden;
  let destroyed = false;

  const shouldEnhance = () => (
    pageActive
    && environment.motion === 'full'
    && environment.depth === 'interactive'
    && STORY_VIEWPORT.matches
  );

  const stop = () => {
    setupVersion += 1;
    if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    refreshFrame = 0;
    disconnectSmoothScroll?.();
    disconnectSmoothScroll = null;
    context?.revert();
    context = null;
    scrollTriggerApi = null;
    root.classList.remove('thing-story-enabled');
    activeElements.forEach((element) => element.classList.remove('is-thing-active'));
    animatedElements.forEach((element) => {
      element.style.removeProperty('color');
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
      element.style.removeProperty('visibility');
      element.style.removeProperty('--demo-frame-progress');
      if (!element.style.cssText) element.removeAttribute('style');
    });
    pipeline?.style.removeProperty('--flow-progress');
    if (pipeline && !pipeline.style.cssText) pipeline.removeAttribute('style');
  };

  const queueRefresh = () => {
    if (!context || !scrollTriggerApi || !pageActive) return;
    if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    const version = setupVersion;
    refreshFrame = window.requestAnimationFrame(() => {
      refreshFrame = 0;
      if (!destroyed && version === setupVersion && context && pageActive) {
        scrollTriggerApi.refresh();
      }
    });
  };

  const start = async () => {
    if (destroyed || context || !shouldEnhance()) return;

    const version = ++setupVersion;
    try {
      const { gsap, ScrollTrigger } = await loadGsap();
      if (destroyed || version !== setupVersion || context || !shouldEnhance()) return;

      scrollTriggerApi = ScrollTrigger;
      disconnectSmoothScroll = smoothScroll?.onScroll(ScrollTrigger.update) ?? null;
      root.classList.add('thing-story-enabled');

      const nextContext = gsap.context(() => {}, root);
      context = nextContext;
      nextContext.add(() => {
        demoItems.forEach((item) => {
          const media = item.querySelector('.thing-demo-card__media');
          const caption = item.querySelector('figcaption');
          if (!media || !caption) return;

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: item,
              start: 'top 86%',
              end: 'bottom 14%',
              scrub: 0.6,
              invalidateOnRefresh: true,
              onToggle: ({ isActive }) => item.classList.toggle('is-thing-active', isActive)
            }
          });

          timeline
            .fromTo(media, { '--demo-frame-progress': 0 }, {
              '--demo-frame-progress': 1,
              duration: 0.3
            }, 0)
            .fromTo(caption, { autoAlpha: 0.15, y: 28 }, {
              autoAlpha: 1,
              duration: 0.3,
              y: 0
            }, 0.08)
            .to(media, {
              '--demo-frame-progress': 0.18,
              duration: 0.24
            }, 0.76)
            .to(caption, {
              autoAlpha: 0.35,
              duration: 0.22,
              y: -12
            }, 0.78);
        });

        if (evidenceGrid && evidenceFigures.length) {
          gsap.set(evidenceFigures, {
            autoAlpha: 0.3,
            scale: 1.015,
            y: 18
          });
          gsap.to(evidenceFigures, {
            autoAlpha: 1,
            ease: 'none',
            scale: 1,
            stagger: 0.14,
            y: 0,
            scrollTrigger: {
              trigger: evidenceGrid,
              start: 'top 84%',
              end: 'bottom 38%',
              scrub: 0.4,
              invalidateOnRefresh: true,
              onToggle: ({ isActive }) => evidenceGrid.classList.toggle('is-thing-active', isActive)
            }
          });
        }

        if (pipeline && pipelineRows.length) {
          const pipelineTimeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: pipeline,
              start: 'top 72%',
              end: 'bottom 32%',
              scrub: 0.5,
              invalidateOnRefresh: true,
              onToggle: ({ isActive }) => pipeline.classList.toggle('is-thing-active', isActive)
            }
          });

          pipelineTimeline.fromTo(pipeline, {
            '--flow-progress': 0
          }, {
            '--flow-progress': 1,
            duration: 1
          }, 0);

          pipelineRows.forEach((row, index) => {
            const label = pipelineLabels[index];
            const position = 0.08 + (index * 0.17);
            pipelineTimeline.fromTo(row, {
              autoAlpha: 0.22,
              y: 20
            }, {
              autoAlpha: 1,
              duration: 0.22,
              y: 0
            }, position);
            if (label) {
              pipelineTimeline.fromTo(label, {
                color: 'var(--muted)'
              }, {
                color: 'var(--project-accent)',
                duration: 0.16
              }, position + 0.03);
            }
          });
        }

        if (architecture && architectureItems.length) {
          gsap.set(architectureItems, {
            autoAlpha: 0.62,
            y: 10
          });
          gsap.to(architectureItems, {
            autoAlpha: 1,
            ease: 'none',
            stagger: 0.07,
            y: 0,
            scrollTrigger: {
              trigger: architecture,
              start: 'top 78%',
              end: 'bottom 38%',
              scrub: 0.35,
              invalidateOnRefresh: true,
              onToggle: ({ isActive }) => architecture.classList.toggle('is-thing-active', isActive)
            }
          });
        }
      });

      queueRefresh();
    } catch (error) {
      if (destroyed || version !== setupVersion) return;
      stop();
      console.warn('THING evidence choreography is unavailable; the static case study remains active.', error);
    }
  };

  const reconcile = () => {
    if (destroyed) return;
    // Keep the 4 × 108svh chapter geometry while a live document is hidden.
    // Reverting to the compact gallery here can clamp a deep scroll position.
    if (!pageActive) {
      if (!context) stop();
      return;
    }
    if (shouldEnhance()) {
      if (context) queueRefresh();
      else start();
    }
    else stop();
  };

  const onPageHide = () => {
    pageActive = false;
    reconcile();
  };

  const onPageShow = () => {
    pageActive = !document.hidden;
    reconcile();
  };

  const onVisibilityChange = () => {
    pageActive = !document.hidden;
    reconcile();
  };

  window.addEventListener('portfolio:environment-change', reconcile);
  window.addEventListener('pagehide', onPageHide);
  window.addEventListener('pageshow', onPageShow);
  document.addEventListener('visibilitychange', onVisibilityChange);
  STORY_VIEWPORT.addEventListener('change', reconcile);
  reconcile();

  return {
    destroy() {
      if (destroyed) return;
      destroyed = true;
      window.removeEventListener('portfolio:environment-change', reconcile);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('pageshow', onPageShow);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      STORY_VIEWPORT.removeEventListener('change', reconcile);
      stop();
    }
  };
};
