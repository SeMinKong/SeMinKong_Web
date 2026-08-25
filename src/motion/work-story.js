import { loadGsapWithSplitText } from './gsap-loader.js';

const STORY_VIEWPORT = window.matchMedia('(min-width: 961px) and (min-height: 640px)');
const RAIL_SCRUB = 0.62;
const SCENE_SCRUB = 0.35;
const SCENE_BEATS = Object.freeze({
  titleIn: 0.08,
  contextIn: 0.16,
  evidenceIn: 0.22,
  actionIn: 0.28,
  hold: 0.38,
  handoff: 0.7,
  titleOut: 0.72,
  detailsOut: 0.74,
  end: 0.94
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const initWorkStory = (environment, { smoothScroll } = {}) => {
  const showcase = document.querySelector('[data-work-showcase]');
  const viewport = showcase?.querySelector('[data-work-viewport]');
  const list = showcase?.querySelector('[data-work-track]');
  const chapters = list ? Array.from(list.querySelectorAll('.work-row')) : [];
  const instruction = showcase?.querySelector('.work-showcase__instruction');
  const currentLabel = showcase?.querySelector('[data-work-current]');
  if (!showcase || !viewport || !list || chapters.length < 2) return;

  // The horizontal story owns the project entrance. Static fallbacks keep every
  // row in normal document flow and use the generic one-shot reveal instead.
  chapters.forEach((chapter) => chapter.removeAttribute('data-reveal'));

  let context = null;
  let gsapApi = null;
  let scrollTriggerApi = null;
  let horizontalTween = null;
  let masterTrigger = null;
  let currentLabelTween = null;
  let disconnectSmoothScroll = null;
  let focusConnected = false;
  let refreshFrame = 0;
  let setupVersion = 0;
  let activeIndex = -1;
  let splitInstances = [];
  let pageActive = !document.hidden;
  let destroyed = false;

  const shouldEnhance = () => (
    pageActive
    && environment.motion === 'full'
    && environment.depth === 'interactive'
    && STORY_VIEWPORT.matches
  );

  const getTravel = () => Math.max(1, list.scrollWidth - viewport.clientWidth);

  const setActiveChapter = (index) => {
    const nextIndex = clamp(index, 0, chapters.length - 1);
    if (nextIndex === activeIndex) return;

    const previousIndex = activeIndex;
    activeIndex = nextIndex;
    chapters.forEach((chapter, chapterIndex) => {
      chapter.classList.toggle('is-work-active', chapterIndex === nextIndex);
    });
    if (currentLabel) {
      currentLabel.textContent = String(nextIndex + 1).padStart(2, '0');
      if (gsapApi && context) {
        currentLabelTween?.kill();
        currentLabelTween = gsapApi.fromTo(currentLabel, {
          autoAlpha: 0.28,
          yPercent: previousIndex < 0 || nextIndex > previousIndex ? 46 : -46
        }, {
          autoAlpha: 1,
          duration: 0.28,
          ease: 'power3.out',
          overwrite: true,
          yPercent: 0
        });
      }
    }
  };

  const updateActiveChapter = (progress) => {
    const viewportCenter = (getTravel() * progress) + (viewport.clientWidth / 2);
    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    chapters.forEach((chapter, index) => {
      const chapterCenter = chapter.offsetLeft + (chapter.offsetWidth / 2);
      const distance = Math.abs(chapterCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    setActiveChapter(closestIndex);
  };

  const updateStoryProgress = (progress) => {
    const renderedProgress = clamp(progress, 0, 1);
    showcase.style.setProperty('--work-progress', renderedProgress.toFixed(4));
    if (instruction) {
      const departure = clamp(renderedProgress / 0.06, 0, 1);
      instruction.style.opacity = (1 - departure).toFixed(3);
      instruction.style.transform = `translateY(${-6 * departure}px)`;
      instruction.style.visibility = departure >= 1 ? 'hidden' : 'visible';
    }
    updateActiveChapter(renderedProgress);
  };

  const handleFocusIn = (event) => {
    const chapter = event.target.closest('.work-row');
    if (!context || !masterTrigger || !chapter || !list.contains(chapter)) return;

    const index = chapters.indexOf(chapter);
    if (index < 0 || index === activeIndex) return;

    const travel = getTravel();
    const chapterCenter = chapter.offsetLeft + (chapter.offsetWidth / 2);
    const targetX = clamp(chapterCenter - (viewport.clientWidth / 2), 0, travel);
    const progress = targetX / travel;
    const targetScroll = masterTrigger.start + ((masterTrigger.end - masterTrigger.start) * progress);

    if (typeof smoothScroll?.scrollTo === 'function') {
      smoothScroll.scrollTo(targetScroll, { immediate: true });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'auto' });
    }
    horizontalTween?.progress(progress);
    scrollTriggerApi?.update();
    updateStoryProgress(progress);
    setActiveChapter(index);
  };

  const disconnectFocus = () => {
    if (!focusConnected) return;
    list.removeEventListener('focusin', handleFocusIn);
    focusConnected = false;
  };

  const revertSplits = () => {
    const activeSplits = splitInstances;
    splitInstances = [];
    activeSplits.forEach((split) => split.revert());
  };

  const stop = () => {
    setupVersion += 1;
    if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    refreshFrame = 0;
    disconnectFocus();
    disconnectSmoothScroll?.();
    disconnectSmoothScroll = null;
    currentLabelTween?.kill();
    currentLabelTween = null;
    if (currentLabel && gsapApi) gsapApi.killTweensOf(currentLabel);

    const refreshApiAfterStop = scrollTriggerApi;
    const activeContext = context;
    context = null;
    activeContext?.revert();
    revertSplits();

    horizontalTween = null;
    masterTrigger = null;
    scrollTriggerApi = null;
    gsapApi = null;
    activeIndex = -1;
    chapters.forEach((chapter) => {
      chapter.classList.remove('is-work-active');
      chapter.style.removeProperty('--work-connector-progress');
      if (!chapter.style.cssText) chapter.removeAttribute('style');
    });
    showcase.classList.remove('work-story-enabled');
    list.classList.remove('work-story-enabled');
    showcase.style.removeProperty('--work-progress');
    list.style.removeProperty('transform');
    list.querySelectorAll('[data-work-artifact], [data-work-title], [data-work-placard] > *, .work-row__title-char, .work-row__arrow, .work-row__chapter').forEach((element) => {
      element.style.removeProperty('clip-path');
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
      element.style.removeProperty('translate');
      element.style.removeProperty('rotate');
      element.style.removeProperty('scale');
      element.style.removeProperty('visibility');
      if (!element.style.cssText) element.removeAttribute('style');
    });
    instruction?.style.removeProperty('opacity');
    instruction?.style.removeProperty('transform');
    instruction?.style.removeProperty('visibility');
    if (instruction && !instruction.style.cssText) instruction.removeAttribute('style');
    currentLabel?.style.removeProperty('opacity');
    currentLabel?.style.removeProperty('transform');
    currentLabel?.style.removeProperty('translate');
    currentLabel?.style.removeProperty('rotate');
    currentLabel?.style.removeProperty('scale');
    currentLabel?.style.removeProperty('visibility');
    if (currentLabel && !currentLabel.style.cssText) currentLabel.removeAttribute('style');
    if (!showcase.style.cssText) showcase.removeAttribute('style');
    if (!list.style.cssText) list.removeAttribute('style');
    if (currentLabel) currentLabel.textContent = '01';
    if (refreshApiAfterStop && pageActive) {
      refreshFrame = window.requestAnimationFrame(() => {
        refreshFrame = 0;
        refreshApiAfterStop.refresh();
      });
    }
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
      const [{ gsap, ScrollTrigger, SplitText }] = await Promise.all([
        loadGsapWithSplitText(),
        document.fonts?.ready ?? Promise.resolve()
      ]);
      if (destroyed || version !== setupVersion || !shouldEnhance() || context) return;

      gsapApi = gsap;
      scrollTriggerApi = ScrollTrigger;
      disconnectSmoothScroll = smoothScroll?.onScroll(ScrollTrigger.update) ?? null;
      showcase.classList.add('work-story-enabled');
      list.classList.add('work-story-enabled');

      const nextContext = gsap.context(() => {}, showcase);
      context = nextContext;
      nextContext.add(() => {
        const navOffset = () => {
          const value = Number.parseFloat(
            window.getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
          );
          return Number.isFinite(value) ? value : 64;
        };

        horizontalTween = gsap.to(list, {
          x: () => -getTravel(),
          ease: 'none',
          onUpdate() {
            updateStoryProgress(this.progress());
          },
          scrollTrigger: {
            trigger: viewport,
            start: () => 'top top+=' + navOffset(),
            end: () => '+=' + getTravel(),
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: RAIL_SCRUB,
            invalidateOnRefresh: true,
            onRefresh: ({ progress }) => {
              const renderedProgress = horizontalTween?.progress();
              updateStoryProgress(Number.isFinite(renderedProgress) ? renderedProgress : progress);
            }
          }
        });

        masterTrigger = horizontalTween.scrollTrigger;

        chapters.forEach((chapter, index) => {
          const stage = chapter.querySelector('[data-work-artifact]');
          const copy = chapter.querySelector('[data-work-placard]');
          const title = chapter.querySelector('[data-work-title]');
          const chapterLabel = chapter.querySelector('.work-row__chapter');
          const arrow = chapter.querySelector('.work-row__arrow');
          const usesNativeVideo = stage?.classList.contains('work-row__media-stage--native');
          const details = copy
            ? Array.from(copy.children).filter((element) => !element.matches('h2'))
            : [];
          const contextDetails = details.filter((element) => (
            element.matches('p') || element.matches('span:not(.work-row__cta)')
          ));
          const evidenceDetails = details.filter((element) => (
            element.matches('ul') || element.classList.contains('work-row__proofs')
          ));
          const action = details.find((element) => element.classList.contains('work-row__cta'));
          if (!stage || !copy || !title) return;

          const split = SplitText.create(title, {
            type: 'words,chars',
            wordsClass: 'work-row__title-word',
            charsClass: 'work-row__title-char',
            aria: 'auto'
          });
          splitInstances.push(split);
          const titleChars = split.chars.length ? split.chars : [title];
          const sceneClock = { progress: 0 };

          const timeline = gsap.timeline({
            defaults: { ease: 'none' },
            scrollTrigger: {
              trigger: chapter,
              containerAnimation: horizontalTween,
              start: 'left 96%',
              end: 'right 4%',
              scrub: SCENE_SCRUB,
              invalidateOnRefresh: true
            }
          });

          // Every scene uses the same normalized clock so long and short titles
          // share identical reading and handoff windows.
          timeline.to(sceneClock, { duration: 1, ease: 'none', progress: 1 }, 0);
          timeline.set(chapter, { '--work-connector-progress': index === 0 ? 1 : 0.12 }, 0);

          const stageFrom = {
            autoAlpha: 0.28,
            scale: 0.94,
            x: () => Math.min(72, viewport.clientWidth * 0.056),
            y: () => clamp(viewport.clientHeight * 0.034, 16, 24)
          };
          const stageIdentity = {
            autoAlpha: 1,
            duration: 0.22,
            ease: 'power3.out',
            scale: 1,
            x: 0,
            y: 0
          };

          if (!usesNativeVideo) {
            stageFrom.clipPath = 'inset(8% 6% round 2px)';
            stageIdentity.clipPath = 'inset(0% 0% round 0px)';
          }

          if (index === 0) {
            timeline.set(stage, {
              autoAlpha: 1,
              clipPath: usesNativeVideo ? undefined : 'inset(0% 0% round 0px)',
              scale: 1,
              x: 0,
              y: 0
            }, 0);
            timeline.set(titleChars, {
              opacity: 1,
              rotateX: 0,
              rotation: 0,
              x: 0,
              yPercent: 0
            }, 0);
            if (details.length) timeline.set(details, { opacity: 1, x: 0, y: 0 }, 0);
            if (arrow) timeline.set(arrow, { opacity: 0.75, x: 0, y: 0 }, 0);
            if (chapterLabel) timeline.set(chapterLabel, { opacity: 1, y: 0 }, 0);
          } else {
            timeline.fromTo(stage, stageFrom, stageIdentity, 0);
            timeline.fromTo(titleChars, {
              opacity: 0.22,
              rotateX: -28,
              rotation: 0,
              x: 10,
              yPercent: 44
            }, {
              opacity: 1,
              rotateX: 0,
              rotation: 0,
              x: 0,
              yPercent: 0,
              duration: 0.16,
              ease: 'power3.out',
              stagger: { amount: 0.08, from: 'start' }
            }, SCENE_BEATS.titleIn);
            if (contextDetails.length) {
              timeline.fromTo(contextDetails, {
                opacity: 0.42,
                x: 24,
                y: 14
              }, {
                opacity: 1,
                duration: 0.14,
                ease: 'power3.out',
                stagger: { amount: 0.04, from: 'start' },
                x: 0,
                y: 0
              }, SCENE_BEATS.contextIn);
            }
            if (evidenceDetails.length) {
              timeline.fromTo(evidenceDetails, {
                opacity: 0.42,
                x: 20,
                y: 10
              }, {
                opacity: 1,
                duration: 0.13,
                ease: 'power3.out',
                stagger: { amount: 0.03, from: 'start' },
                x: 0,
                y: 0
              }, SCENE_BEATS.evidenceIn);
            }
            if (action) {
              timeline.fromTo(action, { opacity: 0.32, x: 16, y: 8 }, {
                opacity: 1,
                duration: 0.1,
                ease: 'power3.out',
                x: 0,
                y: 0
              }, SCENE_BEATS.actionIn);
            }
            if (arrow) {
              timeline.fromTo(arrow, { opacity: 0.25, x: 10, y: 8 }, {
                duration: 0.1,
                ease: 'power3.out',
                opacity: 0.75,
                x: 0,
                y: 0
              }, SCENE_BEATS.actionIn);
            }
            if (chapterLabel) {
              timeline.fromTo(chapterLabel, { opacity: 0.35, y: 6 }, {
                opacity: 1,
                duration: 0.12,
                ease: 'power3.out',
                y: 0
              }, SCENE_BEATS.contextIn);
            }
            timeline.to(chapter, {
              '--work-connector-progress': 1,
              duration: 0.2,
              ease: 'power2.out'
            }, SCENE_BEATS.evidenceIn);
          }

          // Freeze every reading target at an exact identity through the hold.
          timeline.set(stage, {
            autoAlpha: 1,
            clipPath: usesNativeVideo ? undefined : 'inset(0% 0% round 0px)',
            scale: 1,
            x: 0,
            y: 0
          }, SCENE_BEATS.hold);
          timeline.set(titleChars, {
            opacity: 1,
            rotateX: 0,
            rotation: 0,
            x: 0,
            yPercent: 0
          }, SCENE_BEATS.hold);
          if (details.length) timeline.set(details, { opacity: 1, x: 0, y: 0 }, SCENE_BEATS.hold);
          if (arrow) timeline.set(arrow, { opacity: 0.75, x: 0, y: 0 }, SCENE_BEATS.hold);
          if (chapterLabel) timeline.set(chapterLabel, { opacity: 1, y: 0 }, SCENE_BEATS.hold);

          if (index < chapters.length - 1) {
            const stageExit = {
              autoAlpha: 0.42,
              duration: 0.24,
              ease: 'power2.in',
              scale: 0.965,
              x: () => -Math.min(64, viewport.clientWidth * 0.05),
              y: () => -clamp(viewport.clientHeight * 0.028, 14, 20)
            };
            if (!usesNativeVideo) stageExit.clipPath = 'inset(6% 4% round 2px)';

            timeline.to(stage, stageExit, SCENE_BEATS.handoff);
            timeline.to(titleChars, {
              opacity: 0.38,
              rotateX: 14,
              rotation: 0,
              x: -18,
              yPercent: -18,
              duration: 0.16,
              stagger: { amount: 0.06, from: 'end' }
            }, SCENE_BEATS.titleOut);
            if (details.length) {
              timeline.to(details, {
                opacity: 0.5,
                duration: 0.14,
                stagger: { amount: 0.04, from: 'start' },
                x: -22,
                y: -8
              }, SCENE_BEATS.detailsOut);
            }
            if (arrow) {
              timeline.to(arrow, {
                duration: 0.12,
                opacity: 0.18,
                x: 6,
                y: -6
              }, SCENE_BEATS.detailsOut);
            }
            if (chapterLabel) {
              timeline.to(chapterLabel, {
                duration: 0.12,
                opacity: 0.45,
                y: -4
              }, SCENE_BEATS.detailsOut);
            }
          }
        });
      });

      list.addEventListener('focusin', handleFocusIn);
      focusConnected = true;
      setActiveChapter(0);
      queueRefresh();
    } catch (error) {
      if (destroyed || version !== setupVersion) return;
      stop();
      console.warn('Work showcase choreography is unavailable; the static project list remains active.', error);
    }
  };

  const reconcile = () => {
    if (destroyed) return;
    // Preserve the pin spacer while a live document is hidden so a deep scroll
    // position cannot be clamped before the tab or BFCache entry returns.
    if (!pageActive) {
      if (!context) stop();
      return;
    }
    if (shouldEnhance()) {
      if (context) queueRefresh();
      else start();
    } else stop();
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
