import { animate, createTimeline, stagger } from 'animejs';
import './style.css';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const hasFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
let motionEnabled = !prefersReducedMotion;
let fieldEnabled = true;
let depthEffectsEnabled = !prefersReducedMotion;
document.documentElement.classList.toggle('motion-effects-on', motionEnabled);
document.documentElement.classList.toggle('motion-effects-off', !motionEnabled);
document.documentElement.classList.toggle('depth-effects-off', !depthEffectsEnabled);

const splitCharacters = (element) => {
  const nodes = Array.from(element.childNodes);
  nodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const fragment = document.createDocumentFragment();
      [...node.textContent].forEach((character) => {
        const span = document.createElement('span');
        span.className = character === ' ' ? 'char char-space' : 'char';
        span.textContent = character === ' ' ? '\u00A0' : character;
        fragment.appendChild(span);
      });
      node.replaceWith(fragment);
    } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName !== 'BR') {
      splitCharacters(node);
    }
  });
};

document.querySelectorAll('.split-text').forEach((element) => {
  const accessibleText = element.innerText.replace(/\s+/g, ' ').trim();
  element.setAttribute('aria-label', accessibleText);
  splitCharacters(element);
  element.querySelectorAll('.char').forEach((character) => character.setAttribute('aria-hidden', 'true'));
});

const motionLoops = [];
let loopsInitialized = false;
let introTimeline = null;

const registerLoop = (scope, animation) => motionLoops.push({ scope, animation });
const loopCanRun = (scope) => motionEnabled && !document.hidden && (scope !== 'field' || fieldEnabled);

const ensureMotionLoops = () => {
  if (loopsInitialized) return;
  loopsInitialized = true;

  [
    animate('.orbit-ring--outer', { rotate: '1turn', duration: 26000, loop: true, ease: 'linear' }),
    animate('.orbit-ring--middle', { rotate: '-1turn', duration: 18000, loop: true, ease: 'linear' }),
    animate('.orbit-ring--inner', { rotate: '1turn', duration: 14000, loop: true, ease: 'linear' }),
    animate('.orbit-core', { rotate: '-1turn', duration: 12000, loop: true, ease: 'linear' }),
    animate('.orbit-glow', { scale: [0.86, 1.1], opacity: [0.55, 1], duration: 3200, loop: true, alternate: true, ease: 'inOut(2)' })
  ].forEach((animation) => registerLoop('field', animation));

  [
    animate('.availability-dot', { scale: [0.75, 1.55], opacity: [1, .35], duration: 1700, loop: true, alternate: true, ease: 'inOut(2)' }),
    animate('.spatial-orbit--one', { rotate: '1turn', duration: 12500, loop: true, ease: 'linear' }),
    animate('.spatial-orbit--two', { rotate: '-1turn', duration: 8500, loop: true, ease: 'linear' }),
    animate('.method-orb', { rotate: '1turn', duration: 28000, loop: true, ease: 'linear' }),
    animate('.ambient-signals i', {
      x: (_, index) => (index % 2 ? 1 : -1) * (24 + index * 5),
      y: (_, index) => ((index % 3) - 1) * (34 + index * 4),
      scale: [.7, 1.55],
      opacity: [.12, .62],
      duration: (_, index) => 5200 + index * 610,
      delay: stagger(180),
      loop: true,
      alternate: true,
      ease: 'inOut(2)'
    }),
    animate('.ticker-track', { x: ['0%', '-50%'], duration: 24000, loop: true, ease: 'linear' })
  ].forEach((animation) => registerLoop('ambient', animation));

  const fieldReadout = document.querySelector('.orbit-readout--top strong');
  const fieldState = { value: 1.42 };
  registerLoop('field', animate(fieldState, {
    value: 9.86,
    duration: 6800,
    loop: true,
    alternate: true,
    ease: 'inOut(2)',
    onUpdate: () => { fieldReadout.textContent = fieldState.value.toFixed(2).padStart(5, '0'); }
  }));

  const waveformHeights = [.22, .46, .72, .38, .86, .55, .3, .92, .66, .42, .77, .28, .59, .88, .48, .2];
  document.querySelectorAll('.wave-bar').forEach((bar, index) => {
    registerLoop('ambient', animate(bar, {
      scaleY: [0.13, waveformHeights[index]],
      duration: 800 + (index % 5) * 130,
      delay: index * 38,
      loop: true,
      alternate: true,
      ease: 'inOut(3)'
    }));
  });
};

const syncLoopPlayback = () => {
  if (motionEnabled) ensureMotionLoops();
  motionLoops.forEach(({ scope, animation }) => {
    if (loopCanRun(scope)) animation.resume();
    else animation.pause();
  });
};

const motionToggle = document.querySelector('.motion-toggle');
const syncMotionToggle = () => {
  motionToggle.setAttribute('aria-pressed', String(motionEnabled));
  motionToggle.querySelector('span').textContent = motionEnabled ? 'Motion on' : 'Motion off';
  motionToggle.setAttribute('aria-label', motionEnabled ? 'Disable site motion' : 'Enable site motion');
  document.documentElement.classList.toggle('motion-effects-on', motionEnabled);
  document.documentElement.classList.toggle('motion-effects-off', !motionEnabled);
};

syncMotionToggle();

if (motionEnabled) {
  introTimeline = createTimeline({ defaults: { ease: 'out(4)' } });
  introTimeline
    .add('.nav-shell', { opacity: [0, 1], y: [-18, 0], duration: 700 }, 80)
    .add('.hero .char', { opacity: [0, 1], y: ['1.05em', 0], rotate: [5, 0], filter: ['blur(7px)', 'blur(0px)'], duration: 1050, delay: stagger(25, { from: 'first' }) }, 120)
    .add('.hero .reveal-item', { opacity: [0, 1], y: [24, 0], duration: 800, delay: stagger(100) }, 380)
    .add('.orbit-system', { opacity: [0, 1], scale: [.82, 1], rotate: ['-7deg', '0deg'], duration: 1250 }, 260)
    .add('.signal-arc', { strokeDashoffset: [1, 0], duration: 1100 }, 690)
    .add('.orbit-readout, .orbit-toggle, .hero-index', { opacity: [0, 1], duration: 650, delay: stagger(70) }, 820);

  ensureMotionLoops();
} else {
  document.querySelectorAll('.reveal-item, .nav-shell, .orbit-system, .hero .char, .orbit-readout, .orbit-toggle, .hero-index').forEach((element) => {
    element.style.opacity = '1';
    element.style.transform = 'none';
  });
  document.querySelector('.signal-arc').style.strokeDashoffset = '0';
}

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const target = entry.target;
    if (!motionEnabled) {
      target.style.opacity = '1';
      target.style.transform = 'none';
    } else {
      animate(target, { opacity: [0, 1], y: [target.classList.contains('project-card') ? 54 : 30, 0], duration: 950, ease: 'out(4)' });
    }
    observer.unobserve(target);
  });
}, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

document.querySelectorAll('.reveal-group').forEach((element) => revealObserver.observe(element));

const routeObserver = new IntersectionObserver(([entry], observer) => {
  if (!entry?.isIntersecting) return;
  if (motionEnabled) {
    animate('.route-line', { scaleX: [0, 1], duration: 1600, ease: 'inOut(3)' });
    animate('.route-node', { scale: [0, 1], backgroundColor: ['#f2efe8', '#8c7cff'], delay: stagger(320, { start: 180 }), duration: 620, ease: 'out(4)' });
  } else {
    document.querySelector('.route-line').style.transform = 'scaleX(1)';
  }
  observer.disconnect();
}, { threshold: .45 });

routeObserver.observe(document.querySelector('.method-route'));

const orbitStage = document.querySelector('.orbit-stage');
const gravityTargets = [...orbitStage.querySelectorAll('.orbit-node, .core-point')];

orbitStage.addEventListener('pointermove', (event) => {
  if (!motionEnabled || !fieldEnabled || event.pointerType === 'touch') return;
  const bounds = orbitStage.getBoundingClientRect();
  const x = (event.clientX - bounds.left) / bounds.width - .5;
  const y = (event.clientY - bounds.top) / bounds.height - .5;
  animate('.orbit-system', { x: x * 14, y: y * 14, rotateX: y * -3, rotateY: x * 3, duration: 650, ease: 'out(3)' });
  animate('.orbit-glow', { x: x * -24, y: y * -24, duration: 850, ease: 'out(3)' });

  gravityTargets.forEach((target) => {
    const targetBounds = target.getBoundingClientRect();
    const deltaX = event.clientX - (targetBounds.left + targetBounds.width / 2);
    const deltaY = event.clientY - (targetBounds.top + targetBounds.height / 2);
    const distance = Math.hypot(deltaX, deltaY);
    const force = Math.max(0, 1 - distance / Math.min(bounds.width * .42, 280));
    animate(target, {
      x: deltaX * force * .18,
      y: deltaY * force * .18,
      scale: 1 + force * .65,
      duration: 320,
      ease: 'out(3)'
    });
  });
});

orbitStage.addEventListener('pointerleave', () => {
  if (!motionEnabled) return;
  animate('.orbit-system, .orbit-glow', { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 900, ease: 'out(4)' });
  animate(gravityTargets, { x: 0, y: 0, scale: 1, duration: 700, ease: 'out(4)' });
});

orbitStage.addEventListener('pointerdown', (event) => {
  if (!motionEnabled || !fieldEnabled || !hasFinePointer || event.button !== 0 || event.target.closest('button, a')) return;
  const bounds = orbitStage.getBoundingClientRect();
  const ripple = document.createElement('span');
  ripple.className = 'gravity-ripple';
  ripple.setAttribute('aria-hidden', 'true');
  ripple.style.left = `${event.clientX - bounds.left}px`;
  ripple.style.top = `${event.clientY - bounds.top}px`;
  orbitStage.appendChild(ripple);

  animate(ripple, {
    scale: [.2, 9],
    opacity: [.9, 0],
    duration: 1050,
    ease: 'out(4)',
    onComplete: () => ripple.remove()
  });
  animate('.core-halo', {
    scale: [1, 1.28],
    opacity: [1, .3],
    duration: 340,
    ease: 'out(3)',
    onComplete: () => animate('.core-halo', { scale: 1, opacity: 1, duration: 520, ease: 'out(4)' })
  });
});

const toggle = document.querySelector('.orbit-toggle');
toggle.addEventListener('click', () => {
  fieldEnabled = !fieldEnabled;
  toggle.setAttribute('aria-pressed', String(fieldEnabled));
  toggle.setAttribute('aria-label', fieldEnabled ? 'Pause field motion' : 'Play field motion');
  toggle.querySelector('.toggle-label').textContent = fieldEnabled ? 'Pause field' : 'Play field';
  syncLoopPlayback();
});

const projectViewport = document.querySelector('.project-viewport');
const universeProgress = document.querySelector('.universe-progress span');
const depthScenes = new Map();
let universeProgressFrame = null;
let universeGlide = null;
let isUniverseDragging = false;
let hasUniverseDragged = false;
let dragStartX = 0;
let dragStartScroll = 0;
let dragLastX = 0;
let dragLastTime = 0;
let dragVelocity = 0;

const resetDepthScene = (root = document, duration = 680) => {
  depthScenes.forEach((scene, card) => {
    if (root !== document && root !== card && !root.contains(card)) return;
    scene.targetX = 0;
    scene.targetY = 0;
    scene.targetHover = 0;
    scene.response = duration <= 300 ? 18 : 11;
    scene.schedule();
  });
};

const depthToggle = document.querySelector('.depth-toggle');
const syncDepthToggle = () => {
  depthToggle.setAttribute('aria-pressed', String(depthEffectsEnabled));
  depthToggle.querySelector('span').textContent = depthEffectsEnabled ? 'Depth on' : 'Depth off';
  depthToggle.setAttribute('aria-label', depthEffectsEnabled ? 'Disable 2.5D depth effect' : 'Enable 2.5D depth effect');
  document.documentElement.classList.toggle('depth-effects-off', !depthEffectsEnabled);
};

depthToggle.addEventListener('click', () => {
  depthEffectsEnabled = !depthEffectsEnabled;
  syncDepthToggle();
  if (!depthEffectsEnabled) {
    resetDepthScene(document, 240);
    animate('.project-visual-shell', { skewX: 0, scaleX: 1, duration: 360, ease: 'out(3)' });
    return;
  }

  if (!motionEnabled) return;
  const firstScene = depthScenes.values().next().value;
  firstScene.targetX = .42;
  firstScene.targetY = -.08;
  firstScene.targetHover = 1;
  firstScene.schedule();
  window.setTimeout(() => {
    if (!depthEffectsEnabled) return;
    firstScene.targetX = 0;
    firstScene.targetY = 0;
    firstScene.targetHover = 0;
    firstScene.schedule();
  }, 430);
});

syncDepthToggle();

const updateUniverseProgress = () => {
  const maxScroll = projectViewport.scrollWidth - projectViewport.clientWidth;
  const progress = maxScroll > 0 ? projectViewport.scrollLeft / maxScroll : 1;
  universeProgress.style.transform = `scaleX(${Math.max(.12, progress)})`;
  universeProgressFrame = null;
};

const queueUniverseProgress = () => {
  if (!universeProgressFrame) universeProgressFrame = requestAnimationFrame(updateUniverseProgress);
};

const glideUniverseTo = (destination, duration = 900) => {
  if (universeGlide) universeGlide.pause();
  const maximum = Math.max(0, projectViewport.scrollWidth - projectViewport.clientWidth);
  const scrollState = { position: projectViewport.scrollLeft };
  projectViewport.classList.add('is-gliding');
  universeGlide = animate(scrollState, {
    position: Math.max(0, Math.min(maximum, destination)),
    duration,
    ease: 'out(4)',
    onUpdate: () => { projectViewport.scrollLeft = scrollState.position; },
    onComplete: () => projectViewport.classList.remove('is-gliding')
  });
};

projectViewport.addEventListener('pointerdown', (event) => {
  if (event.pointerType === 'touch' || event.button !== 0) return;
  if (universeGlide) universeGlide.pause();
  isUniverseDragging = true;
  hasUniverseDragged = false;
  dragStartX = event.clientX;
  dragStartScroll = projectViewport.scrollLeft;
  dragLastX = event.clientX;
  dragLastTime = event.timeStamp;
  dragVelocity = 0;
  projectViewport.classList.remove('is-gliding');
  projectViewport.setPointerCapture(event.pointerId);
});

projectViewport.addEventListener('pointermove', (event) => {
  if (!isUniverseDragging) return;
  const movement = event.clientX - dragStartX;
  if (!hasUniverseDragged && Math.abs(movement) < 5) return;
  if (!hasUniverseDragged) {
    hasUniverseDragged = true;
    projectViewport.classList.add('is-dragging');
    resetDepthScene(document, 280);
  }
  const now = event.timeStamp;
  const elapsed = Math.max(1, now - dragLastTime);
  dragVelocity = (dragLastX - event.clientX) / elapsed;
  projectViewport.scrollLeft = dragStartScroll - movement;
  if (motionEnabled && depthEffectsEnabled && hasFinePointer) {
    const skew = Math.max(-7, Math.min(7, dragVelocity * -2.4));
    const stretch = 1 + Math.min(.028, Math.abs(dragVelocity) * .009);
    animate('.project-visual-shell', { skewX: skew, scaleX: stretch, duration: 150, ease: 'out(2)' });
  }
  dragLastX = event.clientX;
  dragLastTime = now;
});

const finishUniverseDrag = (event) => {
  if (!isUniverseDragging) return;
  isUniverseDragging = false;
  if (projectViewport.hasPointerCapture(event.pointerId)) projectViewport.releasePointerCapture(event.pointerId);
  projectViewport.classList.remove('is-dragging');
  if (depthEffectsEnabled) animate('.project-visual-shell', { skewX: 0, scaleX: 1, duration: 760, ease: 'out(4)' });
  if (hasUniverseDragged && motionEnabled) glideUniverseTo(projectViewport.scrollLeft + dragVelocity * 420, 980);
};

projectViewport.addEventListener('pointerup', finishUniverseDrag);
projectViewport.addEventListener('pointercancel', finishUniverseDrag);
projectViewport.addEventListener('scroll', queueUniverseProgress, { passive: true });
projectViewport.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
  event.preventDefault();
  const maximum = projectViewport.scrollWidth - projectViewport.clientWidth;
  const destination = event.key === 'Home'
    ? 0
    : event.key === 'End'
      ? maximum
      : projectViewport.scrollLeft + (event.key === 'ArrowRight' ? 1 : -1) * projectViewport.clientWidth * .72;
  glideUniverseTo(destination, motionEnabled ? 720 : 1);
});

const renderDepthScene = (scene, now) => {
  const deltaSeconds = Math.min(.05, Math.max(.001, (now - scene.lastTime) / 1000));
  scene.lastTime = now;
  const damping = 1 - Math.exp(-scene.response * deltaSeconds);

  scene.currentX += (scene.targetX - scene.currentX) * damping;
  scene.currentY += (scene.targetY - scene.currentY) * damping;
  scene.currentHover += (scene.targetHover - scene.currentHover) * damping;

  scene.visual.style.setProperty('--card-rx', `${scene.currentY * -10}deg`);
  scene.visual.style.setProperty('--card-ry', `${scene.currentX * 14}deg`);
  scene.visual.style.setProperty('--card-scale', String(1 + scene.currentHover * .022));
  scene.shine.style.opacity = String(scene.currentHover * .82);
  scene.edge.style.opacity = String(scene.currentHover * .5);

  scene.depthLayers.forEach((layer) => {
    const depth = Number(layer.dataset.depth || 0);
    layer.style.setProperty('--depth-x', `${scene.currentX * depth * 1.22}px`);
    layer.style.setProperty('--depth-y', `${scene.currentY * depth * .96}px`);
  });

  const remaining = Math.max(
    Math.abs(scene.targetX - scene.currentX),
    Math.abs(scene.targetY - scene.currentY),
    Math.abs(scene.targetHover - scene.currentHover)
  );

  if (remaining > .001) {
    scene.frame = requestAnimationFrame((time) => renderDepthScene(scene, time));
  } else {
    scene.currentX = scene.targetX;
    scene.currentY = scene.targetY;
    scene.currentHover = scene.targetHover;
    scene.frame = null;
  }
};

const scheduleDepthScene = (scene) => {
  if (scene.frame !== null) return;
  scene.lastTime = performance.now();
  scene.frame = requestAnimationFrame((time) => renderDepthScene(scene, time));
};

document.querySelectorAll('.project-card').forEach((card) => {
  const visual = card.querySelector('.project-visual');
  const visualShell = document.createElement('div');
  visualShell.className = 'project-visual-shell';
  visual.before(visualShell);
  visualShell.appendChild(visual);
  const depthLayers = [...visual.querySelectorAll('[data-depth]')];
  const shine = document.createElement('span');
  const edge = document.createElement('span');
  const vignette = document.createElement('span');
  shine.className = 'tilt-shine';
  edge.className = 'tilt-edge';
  vignette.className = 'depth-vignette';
  visual.append(vignette, shine, edge);

  const scene = {
    visual,
    shine,
    edge,
    depthLayers,
    currentX: 0,
    currentY: 0,
    currentHover: 0,
    targetX: 0,
    targetY: 0,
    targetHover: 0,
    response: 11,
    lastTime: performance.now(),
    frame: null,
    schedule: null
  };
  scene.schedule = () => scheduleDepthScene(scene);
  depthScenes.set(card, scene);

  visual.addEventListener('pointermove', (event) => {
    if (!motionEnabled || !depthEffectsEnabled || !hasFinePointer || event.pointerType === 'touch' || isUniverseDragging || projectViewport.classList.contains('is-gliding')) return;
    const bounds = visual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    const normalizedX = x - .5;
    const normalizedY = y - .5;
    visual.style.setProperty('--tilt-x', `${x * 100}%`);
    visual.style.setProperty('--tilt-y', `${y * 100}%`);
    visual.style.setProperty('--glare-angle', `${Math.atan2(normalizedY, normalizedX) * 180 / Math.PI + 90}deg`);
    scene.targetX = normalizedX;
    scene.targetY = normalizedY;
    scene.targetHover = 1;
    scene.response = 13;
    scene.schedule();
  });

  visual.addEventListener('pointerleave', () => {
    resetDepthScene(card, 720);
  });
});

const contactSection = document.querySelector('.contact');
const contactTrail = document.querySelector('.contact-trail');
let lastTrailPoint = null;
let trailIndex = 0;

contactSection.addEventListener('pointerenter', () => { lastTrailPoint = null; });
contactSection.addEventListener('pointermove', (event) => {
  if (!motionEnabled || !hasFinePointer || event.pointerType === 'touch') return;
  const point = { x: event.clientX, y: event.clientY };
  if (lastTrailPoint && Math.hypot(point.x - lastTrailPoint.x, point.y - lastTrailPoint.y) < 18) return;
  lastTrailPoint = point;

  const bounds = contactSection.getBoundingClientRect();
  const particle = document.createElement('span');
  particle.className = `trail-particle${trailIndex % 3 === 0 ? ' is-iris' : ''}`;
  particle.style.left = `${event.clientX - bounds.left}px`;
  particle.style.top = `${event.clientY - bounds.top}px`;
  if (contactTrail.childElementCount >= 24) contactTrail.firstElementChild.remove();
  contactTrail.appendChild(particle);

  const drift = (trailIndex % 5 - 2) * 7;
  trailIndex += 1;
  animate(particle, {
    opacity: [.92, 0],
    scale: [1.15, 0],
    x: [0, drift],
    y: [0, -34 - (trailIndex % 4) * 5],
    duration: 900,
    ease: 'out(3)',
    onComplete: () => particle.remove()
  });
});

updateUniverseProgress();

document.querySelectorAll('.magnetic').forEach((element) => {
  element.addEventListener('pointermove', (event) => {
    if (!motionEnabled || event.pointerType === 'touch') return;
    const bounds = element.getBoundingClientRect();
    animate(element, { x: (event.clientX - bounds.left - bounds.width / 2) * .16, y: (event.clientY - bounds.top - bounds.height / 2) * .16, duration: 420, ease: 'out(3)' });
  });
  element.addEventListener('pointerleave', () => animate(element, { x: 0, y: 0, duration: 680, ease: 'out(4)' }));
});

const cursorHalo = document.querySelector('.cursor-halo');
const haloState = { x: 0, y: 0, targetX: 0, targetY: 0, frame: null, lastTime: performance.now() };

const renderCursorHalo = (now) => {
  const deltaSeconds = Math.min(.05, Math.max(.001, (now - haloState.lastTime) / 1000));
  haloState.lastTime = now;
  const damping = 1 - Math.exp(-18 * deltaSeconds);
  haloState.x += (haloState.targetX - haloState.x) * damping;
  haloState.y += (haloState.targetY - haloState.y) * damping;
  cursorHalo.style.transform = `translate3d(${haloState.x}px, ${haloState.y}px, 0)`;

  if (Math.hypot(haloState.targetX - haloState.x, haloState.targetY - haloState.y) > .35 && motionEnabled) {
    haloState.frame = requestAnimationFrame(renderCursorHalo);
  } else {
    haloState.frame = null;
  }
};

window.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'touch' || !hasFinePointer || !motionEnabled) return;
  cursorHalo.style.opacity = '1';
  if (haloState.frame === null && haloState.x === 0 && haloState.y === 0) {
    haloState.x = event.clientX;
    haloState.y = event.clientY;
  }
  haloState.targetX = event.clientX;
  haloState.targetY = event.clientY;
  if (haloState.frame === null) {
    haloState.lastTime = performance.now();
    haloState.frame = requestAnimationFrame(renderCursorHalo);
  }
}, { passive: true });

let scrollTicking = false;
const updateScrollProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  const heroTravel = Math.min(window.scrollY, window.innerHeight * 1.15);
  const rootStyle = document.documentElement.style;
  document.querySelector('.scroll-progress span').style.transform = `scaleY(${progress})`;
  rootStyle.setProperty('--hero-scroll-y', motionEnabled ? `${heroTravel * .075}px` : '0px');
  rootStyle.setProperty('--orbit-scroll-y', motionEnabled ? `${heroTravel * -.055}px` : '0px');
  rootStyle.setProperty('--grid-scroll-y', motionEnabled ? `${heroTravel * .12}px` : '0px');
  scrollTicking = false;
};

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(updateScrollProgress);
    scrollTicking = true;
  }
}, { passive: true });

motionToggle.addEventListener('click', () => {
  motionEnabled = !motionEnabled;
  syncMotionToggle();

  if (!motionEnabled) {
    introTimeline?.complete?.();
    introTimeline = null;
    if (universeGlide) {
      universeGlide.pause();
      universeGlide = null;
    }
    projectViewport.classList.remove('is-gliding');
    resetDepthScene(document, 220);
    animate('.project-visual-shell', { skewX: 0, scaleX: 1, duration: 1 });
    animate('.orbit-system, .orbit-glow', { x: 0, y: 0, rotateX: 0, rotateY: 0, duration: 1 });
    animate(gravityTargets, { x: 0, y: 0, scale: 1, duration: 1 });
    animate('.magnetic', { x: 0, y: 0, duration: 1 });
    document.querySelectorAll('.trail-particle').forEach((particle) => particle.remove());
    cursorHalo.style.opacity = '0';
    if (haloState.frame !== null) cancelAnimationFrame(haloState.frame);
    haloState.frame = null;
  }

  syncLoopPlayback();
  updateScrollProgress();
});

document.addEventListener('visibilitychange', syncLoopPlayback);
window.addEventListener('resize', () => {
  queueUniverseProgress();
  updateScrollProgress();
}, { passive: true });

updateScrollProgress();
