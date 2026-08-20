import { loadGsap } from './gsap-loader.js';

const DESKTOP = '(min-width: 961px)';

export const initSignalThread = (environment) => {
  if (environment.motion === 'reduced') return;
  if (!window.matchMedia(DESKTOP).matches) return;

  const main = document.querySelector('main');
  if (!main) return;

  const topLevel = (root) => Array.from(root.querySelectorAll('section, article')).filter((el) => {
    let parent = el.parentElement;
    while (parent && parent !== root) {
      if (parent.matches('section, article')) return false;
      parent = parent.parentElement;
    }
    return parent === root;
  });

  let scope = main;
  let sections = topLevel(scope);
  for (let depth = 0; sections.length === 1 && depth < 3; depth++) {
    scope = sections[0];
    sections = topLevel(scope);
  }
  if (sections.length < 2) return;

  let teardown = null;

  (async () => {
    const { gsap, ScrollTrigger } = await loadGsap();

    const rail = document.createElement('div');
    rail.className = 'signal-thread';
    rail.setAttribute('aria-hidden', 'true');
    const fill = document.createElement('i');
    fill.className = 'signal-thread__fill';
    rail.appendChild(fill);

    const nodes = sections.map(() => {
      const node = document.createElement('i');
      node.className = 'signal-thread__node';
      rail.appendChild(node);
      return node;
    });

    document.body.appendChild(rail);

    const layout = () => {
      const mainRect = main.getBoundingClientRect();
      const mainTop = mainRect.top + window.scrollY;
      rail.style.top = `${Math.round(mainTop + 24)}px`;
      rail.style.height = `${Math.round(main.offsetHeight - 48)}px`;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const offset = (rect.top + window.scrollY) - mainTop - 24;
        nodes[index].style.top = `${Math.max(0, Math.round(offset + 14))}px`;
      });
    };

    layout();

    const triggers = [];

    triggers.push(ScrollTrigger.create({
      trigger: main,
      start: 'top 24%',
      end: 'bottom 76%',
      scrub: 0.6,
      animation: gsap.fromTo(fill, { scaleY: 0 }, { scaleY: 1, ease: 'none' })
    }));

    sections.forEach((section, index) => {
      triggers.push(ScrollTrigger.create({
        trigger: section,
        start: 'top 62%',
        onEnter: () => nodes[index].classList.add('is-lit'),
        onLeaveBack: () => nodes[index].classList.remove('is-lit')
      }));
    });

    ScrollTrigger.addEventListener('refresh', layout);

    teardown = () => {
      ScrollTrigger.removeEventListener('refresh', layout);
      triggers.forEach((trigger) => trigger.kill());
      rail.remove();
      teardown = null;
    };
  })();

  const guard = window.matchMedia(DESKTOP);
  const onGuardChange = () => {
    if (!guard.matches) teardown?.();
  };
  guard.addEventListener('change', onGuardChange);

  window.addEventListener('portfolio:environment-change', (event) => {
    if (event.detail.motion === 'reduced') teardown?.();
  });
};
