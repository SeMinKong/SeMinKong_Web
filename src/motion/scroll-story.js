import { loadGsap } from './gsap-loader.js';

const DESKTOP = '(min-width: 961px)';

const buildScenes = (gsap, ScrollTrigger, section, items, options) => {
  const { pinLength, stageClass, onChapter } = options;
  section.classList.add(stageClass);

  const readout = document.createElement('div');
  readout.className = 'scene-readout';
  readout.setAttribute('aria-hidden', 'true');
  readout.innerHTML = `<strong>01</strong><span>/ ${String(items.length).padStart(2, '0')}</span><i>${items
    .map(() => '<b></b>').join('')}</i>`;
  section.appendChild(readout);
  const counter = readout.querySelector('strong');
  const ticks = Array.from(readout.querySelectorAll('b'));

  gsap.set(items, { autoAlpha: 0, yPercent: 6 });
  gsap.set(items[0], { autoAlpha: 1, yPercent: 0 });

  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: section,
      start: 'top top',
      end: `+=${pinLength}`,
      pin: true,
      pinType: 'fixed',
      scrub: 0.5,
      snap: {
        snapTo: 1 / (items.length - 1),
        duration: { min: 0.25, max: 0.55 },
        ease: 'power2.inOut'
      },
      onUpdate: (self) => {
        const index = Math.min(items.length - 1, Math.round(self.progress * (items.length - 1)));
        counter.textContent = String(index + 1).padStart(2, '0');
        ticks.forEach((tick, i) => tick.classList.toggle('is-on', i <= index));
        onChapter?.(index);
      }
    }
  });

  items.forEach((item, index) => {
    if (index === 0) return;
    const at = index - 1;
    timeline.to(items[index - 1], { autoAlpha: 0, yPercent: -6, duration: 0.42 }, at + 0.29);
    timeline.fromTo(item, { autoAlpha: 0, yPercent: 6 }, { autoAlpha: 1, yPercent: 0, duration: 0.42 }, at + 0.58);
  });
  timeline.to({}, { duration: 0.42 });

  return timeline;
};

export const initScrollStory = (environment) => {
  if (environment.motion !== 'full') return;
  if (!window.matchMedia(DESKTOP).matches) return;

  const demoSection = document.querySelector('.thing-demo-section');
  const focusSection = document.querySelector('.focus-section');
  const countTargets = Array.from(document.querySelectorAll(
    '.project-card__facts li strong, .work-row__proofs dt, .case-facts dd'
  ));

  if (!demoSection && !focusSection && !countTargets.length) return;

  loadGsap().then(({ gsap, ScrollTrigger }) => {
    // ---- THING demo scenes ----
    if (demoSection) {
      const cards = Array.from(demoSection.querySelectorAll('.thing-demo-list > li'));
      if (cards.length > 1) {
        const videos = cards.map((card) => card.querySelector('video'));
        let active = -1;
        buildScenes(gsap, ScrollTrigger, demoSection, cards, {
          pinLength: `${(cards.length - 1) * 90}%`,
          stageClass: 'thing-scenes-pinned',
          onChapter: (index) => {
            if (index === active) return;
            active = index;
            videos.forEach((video, i) => {
              if (!video) return;
              if (i === index) {
                video.muted = true;
                const playing = video.play?.();
                playing?.catch?.(() => {});
              } else if (!video.paused) {
                video.pause();
              }
            });
          }
        });
        ScrollTrigger.create({
          trigger: demoSection,
          start: 'top bottom',
          end: 'bottom top',
          onLeave: () => videos.forEach((video) => video && !video.paused && video.pause()),
          onLeaveBack: () => videos.forEach((video) => video && !video.paused && video.pause())
        });
      }
    }

    // ---- Home Focus chapters ----
    if (focusSection) {
      const rows = Array.from(focusSection.querySelectorAll('.focus-list > div'));
      if (rows.length > 1) {
        buildScenes(gsap, ScrollTrigger, focusSection, rows, {
          pinLength: `${(rows.length - 1) * 85}%`,
          stageClass: 'focus-chapters-pinned'
        });
      }
    }

    // ---- Proof number count-up ----
    countTargets.forEach((el) => {
      const raw = el.textContent.trim();
      const match = raw.match(/^(\d+(?:\.\d+)?)(.*)$/s);
      if (!match) return;
      const target = parseFloat(match[1]);
      const suffix = match[2] ?? '';
      const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
      const state = { value: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          gsap.to(state, {
            value: target,
            duration: 1.1,
            ease: 'power2.out',
            onUpdate: () => {
              el.textContent = state.value.toFixed(decimals) + suffix;
            },
            onComplete: () => {
              el.textContent = raw;
            }
          });
        }
      });
    });

    const teardownGuard = window.matchMedia(DESKTOP);
    teardownGuard.addEventListener('change', () => {
      if (!teardownGuard.matches) ScrollTrigger.refresh();
    });
  });
};
