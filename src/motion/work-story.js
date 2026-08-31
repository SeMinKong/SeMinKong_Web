import { loadGsapWithSplitText } from './gsap-loader.js';

const STORY_VIEWPORT = window.matchMedia('(min-width: 961px) and (min-height: 640px)');
const RAIL_SCRUB = 0.62;
const SCENE_BEATS = Object.freeze({
  titleIn: 0.02,
  summaryIn: 0.08,
  actionIn: 0.14,
  hold: 0.3,
  handoff: 0.52,
  detailsOut: 0.53,
  titleOut: 0.54
});

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const waitForTitleFont = () => (
  typeof document.fonts?.load === 'function'
    ? document.fonts.load('700 1em "Signika Variable"', 'THING')
    : Promise.resolve()
);

export const initWorkStory = (environment, { smoothScroll } = {}) => {
  const root = document.documentElement;
  const showcase = document.querySelector('[data-work-showcase]');
  const viewport = showcase?.querySelector('[data-work-viewport]');
  const list = showcase?.querySelector('[data-work-track]');
  const chapters = list ? Array.from(list.querySelectorAll('.work-row')) : [];
  if (!showcase || !viewport || !list || chapters.length < 2) {
    root.classList.remove('work-story-pending');
    return;
  }

  // The horizontal story owns the project entrance. Static fallbacks keep every
  // row in normal document flow and use the generic one-shot reveal instead.
  chapters.forEach((chapter) => chapter.removeAttribute('data-reveal'));

  let context = null;
  let scrollTriggerApi = null;
  let horizontalTween = null;
  let masterTrigger = null;
  let disconnectSmoothScroll = null;
  let focusConnected = false;
  let focusFrame = 0;
  let refreshFrame = 0;
  let revealFrame = 0;
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
    && !root.hasAttribute('data-work-story-expired')
    && (
      root.classList.contains('work-story-pending')
      || root.hasAttribute('data-work-story-ready')
    )
  );

  const getTravel = () => Math.max(1, list.scrollWidth - viewport.clientWidth);

  const setActiveChapter = (index) => {
    const nextIndex = clamp(index, 0, chapters.length - 1);
    if (nextIndex === activeIndex) return;

    activeIndex = nextIndex;
    chapters.forEach((chapter, chapterIndex) => {
      chapter.classList.toggle('is-work-active', chapterIndex === nextIndex);
    });
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
    updateActiveChapter(renderedProgress);
  };

  const handleFocusIn = (event) => {
    const chapter = event.target.closest('.work-row');
    if (!context || !masterTrigger || !chapter || !list.contains(chapter)) return;

    const index = chapters.indexOf(chapter);
    if (index < 0) return;

    const travel = getTravel();
    const chapterCenter = chapter.offsetLeft + (chapter.offsetWidth / 2);
    const targetX = clamp(chapterCenter - (viewport.clientWidth / 2), 0, travel);
    const progress = targetX / travel;
    const targetScroll = masterTrigger.start + ((masterTrigger.end - masterTrigger.start) * progress);

    const scrollToTarget = () => {
      if (typeof smoothScroll?.scrollTo === 'function') {
        smoothScroll.scrollTo(targetScroll, { immediate: true });
      } else {
        window.scrollTo({ top: targetScroll, behavior: 'auto' });
      }
    };
    const settleTrack = () => {
      scrollTriggerApi?.update();
      masterTrigger?.getTween?.()?.progress(1);
      horizontalTween?.progress(progress);
      updateStoryProgress(progress);
      setActiveChapter(index);
    };

    if (focusFrame) window.cancelAnimationFrame(focusFrame);
    scrollToTarget();
    settleTrack();

    // Native focus scrolling happens after focusin in some browsers. Reapply
    // the exact mapped position on the next two frames without intercepting Tab.
    let remainingFrames = 2;
    const finishFocusSettlement = () => {
      scrollToTarget();
      settleTrack();
      remainingFrames -= 1;
      if (remainingFrames > 0) {
        focusFrame = window.requestAnimationFrame(finishFocusSettlement);
      } else {
        focusFrame = 0;
      }
    };
    focusFrame = window.requestAnimationFrame(finishFocusSettlement);
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
    const focusedElement = list.contains(document.activeElement) ? document.activeElement : null;
    const focusedHref = focusedElement?.getAttribute?.('href') ?? null;
    setupVersion += 1;
    if (focusFrame) window.cancelAnimationFrame(focusFrame);
    focusFrame = 0;
    if (refreshFrame) window.cancelAnimationFrame(refreshFrame);
    refreshFrame = 0;
    if (revealFrame) window.cancelAnimationFrame(revealFrame);
    revealFrame = 0;
    disconnectFocus();
    disconnectSmoothScroll?.();
    disconnectSmoothScroll = null;

    const refreshApiAfterStop = scrollTriggerApi;
    const activeContext = context;
    context = null;
    activeContext?.revert();
    revertSplits();

    horizontalTween = null;
    masterTrigger = null;
    scrollTriggerApi = null;
    activeIndex = -1;
    chapters.forEach((chapter) => {
      chapter.classList.remove('is-work-active');
      if (!chapter.style.cssText) chapter.removeAttribute('style');
    });
    showcase.classList.remove('work-story-enabled');
    list.classList.remove('work-story-enabled');
    root.classList.remove('work-story-pending');
    list.style.removeProperty('transform');
    list.querySelectorAll('[data-work-artifact], [data-work-title], [data-work-placard] > *, .work-row__title-char').forEach((element) => {
      element.style.removeProperty('clip-path');
      element.style.removeProperty('opacity');
      element.style.removeProperty('transform');
      element.style.removeProperty('translate');
      element.style.removeProperty('rotate');
      element.style.removeProperty('scale');
      element.style.removeProperty('visibility');
      if (!element.style.cssText) element.removeAttribute('style');
    });
    if (!showcase.style.cssText) showcase.removeAttribute('style');
    if (!list.style.cssText) list.removeAttribute('style');

    if (focusedElement) {
      const restoredFocus = focusedElement.isConnected
        ? focusedElement
        : Array.from(list.querySelectorAll('a[href]'))
          .find((link) => link.getAttribute('href') === focusedHref);
      restoredFocus?.focus({ preventScroll: true });
    }

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
        waitForTitleFont()
      ]);
      if (destroyed || version !== setupVersion || !shouldEnhance() || context) return;

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
          const summary = copy?.querySelector('.work-row__summary');
          const action = copy?.querySelector('.work-row__cta');
          const usesNativeVideo = stage?.classList.contains('work-row__media-stage--native');
          if (!stage || !copy || !title || !summary || !action) return;

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
              start: 'left 102%',
              end: 'right 4%',
              scrub: true,
              invalidateOnRefresh: true
            }
          });

          // Every scene uses the same normalized clock so long and short titles
          // share identical reading and handoff windows.
          timeline.to(sceneClock, { duration: 1, ease: 'none', progress: 1 }, 0);

          const stageFrom = {
            autoAlpha: 0,
            scale: 0.96,
            x: () => Math.min(56, viewport.clientWidth * 0.044),
            y: () => clamp(viewport.clientHeight * 0.028, 14, 20)
          };
          const stageIdentity = {
            autoAlpha: 1,
            duration: 0.2,
            ease: 'power3.out',
            scale: 1,
            x: 0,
            y: 0
          };
          const titleFrom = {
            opacity: 0,
            rotateX: -20,
            rotation: 0,
            x: 8,
            yPercent: 32
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
            timeline.set([summary, action], { opacity: 1, x: 0, y: 0 }, 0);
          } else {
            // Prepaint every incoming scene at a fully hidden state. The old
            // non-zero presets left the next project visible for hundreds of
            // pixels before its delayed beat began.
            gsap.set(stage, stageFrom);
            gsap.set(titleChars, titleFrom);
            gsap.set(summary, { opacity: 0, x: 18, y: 10 });
            gsap.set(action, { opacity: 0, x: 12, y: 6 });

            timeline.to(stage, stageIdentity, 0);
            timeline.to(titleChars, {
              opacity: 1,
              rotateX: 0,
              rotation: 0,
              x: 0,
              yPercent: 0,
              duration: 0.18,
              ease: 'power3.out',
              stagger: { amount: 0.06, from: 'start' }
            }, SCENE_BEATS.titleIn);
            timeline.to(summary, {
              opacity: 1,
              duration: 0.16,
              ease: 'power3.out',
              x: 0,
              y: 0
            }, SCENE_BEATS.summaryIn);
            timeline.to(action, {
              opacity: 1,
              duration: 0.14,
              ease: 'power3.out',
              x: 0,
              y: 0
            }, SCENE_BEATS.actionIn);
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
          timeline.set([summary, action], { opacity: 1, x: 0, y: 0 }, SCENE_BEATS.hold);

          if (index < chapters.length - 1) {
            const stageExit = {
              autoAlpha: 0,
              duration: 0.22,
              ease: 'power2.in',
              scale: 0.97,
              x: () => -Math.min(52, viewport.clientWidth * 0.041),
              y: () => -clamp(viewport.clientHeight * 0.024, 12, 18)
            };
            if (!usesNativeVideo) stageExit.clipPath = 'inset(6% 4% round 2px)';

            timeline.to(stage, stageExit, SCENE_BEATS.handoff);
            timeline.to(titleChars, {
              opacity: 0,
              rotateX: 10,
              rotation: 0,
              x: -14,
              yPercent: -14,
              duration: 0.18,
              stagger: { amount: 0.05, from: 'end' }
            }, SCENE_BEATS.titleOut);
            timeline.to(summary, {
              opacity: 0,
              duration: 0.16,
              x: -18,
              y: -7
            }, SCENE_BEATS.detailsOut);
            timeline.to(action, {
              opacity: 0,
              duration: 0.14,
              x: -12,
              y: -5
            }, SCENE_BEATS.detailsOut);
          }
        });
      });

      list.addEventListener('focusin', handleFocusIn);
      focusConnected = true;
      setActiveChapter(0);
      root.dataset.workStoryReady = '';
      queueRefresh();
      revealFrame = window.requestAnimationFrame(() => {
        revealFrame = 0;
        if (!destroyed && version === setupVersion && context) {
          root.classList.remove('work-story-pending');
        }
      });
    } catch (error) {
      if (destroyed || version !== setupVersion) return;
      root.dataset.workStoryExpired = '';
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
      root.removeAttribute('data-work-story-ready');
      root.removeAttribute('data-work-story-expired');
    }
  };
};
