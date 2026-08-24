import { clamp } from './utils.js';
import {
  getNextPressureInkQuality,
  MAX_QUIET_RECTS,
  PRESSURE_INK_QUALITY,
  selectPressureInkQuality,
  shouldDowngradePressureInkQuality
} from './pressure-ink-config.js';
import { createPressureInkRenderer } from './pressure-ink-renderer.js';
import { packFluidObstacles } from './site-fluid-obstacles.js';
import {
  createLiteProgram,
  LITE_BLOB_BLUEPRINTS,
  MAX_LITE_BLOBS
} from './hero-fluid-lite-shader.js';
import { getSiteFluidProfile } from './site-fluid-profiles.js';

const MAX_POINTER_SPLATS = 12;
const FULL_FRAME_INTERVAL = 1000 / 60;
const FULL_IDLE_FRAME_INTERVAL = 1000 / 30;
const LITE_FRAME_INTERVAL = 1000 / 30;
const GLOBAL_SCROLL_DAMPING = 0.35;
const FLUID_OBSTACLE_EVENT = 'portfolio:fluid-obstacle-change';
const ACTIVATION_SELECTOR = [
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'summary',
  'video',
  '[role="button"]',
  '[contenteditable="true"]'
].join(', ');

const getViewportSize = () => ({
  width: document.documentElement.clientWidth || window.innerWidth,
  height: document.documentElement.clientHeight || window.innerHeight
});

const limitVector = (x, y, maximum) => {
  const magnitude = Math.hypot(x, y);
  if (magnitude <= maximum || magnitude === 0) return { x, y };
  const scale = maximum / magnitude;
  return { x: x * scale, y: y * scale };
};

const createLayer = (profile) => {
  let wrapper = document.querySelector('[data-site-fluid], [data-hero-fluid]');
  const generated = !wrapper;
  const originalParent = wrapper?.parentNode || null;
  const originalNextSibling = wrapper?.nextSibling || null;
  const base = document.createElement('div');
  base.className = `site-fluid-base site-fluid-base--${profile.theme}`;
  base.setAttribute('data-site-fluid-base', '');
  base.setAttribute('aria-hidden', 'true');
  base.innerHTML = '<span class="site-fluid__grain"></span>';

  if (!wrapper) {
    wrapper = document.createElement('div');
    wrapper.innerHTML = '<canvas class="hero-fluid__canvas site-fluid__canvas" data-hero-fluid-canvas data-fluid-composite="ink"></canvas>';
  }

  wrapper.classList.add('hero-fluid', 'site-fluid', `site-fluid--${profile.theme}`);
  wrapper.setAttribute('data-site-fluid', '');
  wrapper.setAttribute('aria-hidden', 'true');
  wrapper.dataset.fluidRoute = profile.name;

  let canvas = wrapper.querySelector('[data-hero-fluid-canvas]');
  let originalCanvas = null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'hero-fluid__canvas site-fluid__canvas';
    canvas.setAttribute('data-hero-fluid-canvas', '');
    canvas.dataset.fluidComposite = 'ink';
    wrapper.prepend(canvas);
  } else if (canvas.dataset.fluidComposite !== 'ink') {
    originalCanvas = canvas;
    const replacement = document.createElement('canvas');
    replacement.className = canvas.className;
    replacement.setAttribute('data-hero-fluid-canvas', '');
    replacement.dataset.fluidComposite = 'ink';
    canvas.replaceWith(replacement);
    canvas = replacement;
  }
  canvas.classList.add('site-fluid__canvas');

  const legacyGrain = wrapper.querySelector('.hero-fluid__paper-grain');
  legacyGrain?.classList.add('site-fluid__legacy-grain');

  document.body.prepend(base, wrapper);
  return {
    base,
    canvas,
    generated,
    legacyGrain,
    originalCanvas,
    originalNextSibling,
    originalParent,
    wrapper
  };
};

const readProfileQuality = () => selectPressureInkQuality({
  viewportWidth: window.innerWidth,
  deviceMemory: navigator.deviceMemory,
  hardwareConcurrency: navigator.hardwareConcurrency
});

export const initSiteFluid = (environment, {
  profile: profileName = 'about',
  ready = Promise.resolve()
} = {}) => {
  const profile = getSiteFluidProfile(profileName);
  const layer = createLayer(profile);
  const { wrapper, canvas } = layer;
  const contextOptions = {
    alpha: true,
    antialias: false,
    depth: false,
    premultipliedAlpha: false,
    stencil: false,
    preserveDrawingBuffer: false,
    powerPreference: 'high-performance'
  };
  const blobs = LITE_BLOB_BLUEPRINTS.map((blob) => ({
    ...blob,
    anchorX: blob.x,
    anchorY: blob.y,
    vx: 0,
    vy: 0
  }));
  const blobUniformData = new Float32Array(MAX_LITE_BLOBS * 4);
  const quietRects = new Float32Array(MAX_QUIET_RECTS * 4);
  const pointer = {
    x: 0.5,
    y: 0.5,
    vx: 0,
    vy: 0,
    energy: 0,
    lastTime: 0,
    directionX: 0,
    directionY: 0
  };
  const impulse = { x: 0.5, y: 0.5, age: 10, strength: 0 };

  let gl = null;
  let program = null;
  let pressureInk = null;
  let rendererMode = 'static';
  let vertexArray = null;
  let uniforms = null;
  let frame = 0;
  let resizeFrame = 0;
  let obstacleFrame = 0;
  let ambientTimer = 0;
  let lastFrameTime = 0;
  let lastRenderedTime = 0;
  let elapsed = 0;
  let pageActive = true;
  let readyComplete = false;
  let contextLost = false;
  let destroyed = false;
  let scrollProgress = 0;
  let touchStart = null;
  let suspendedAt = 0;
  let liteActiveUntil = 0;
  let quality = readProfileQuality();
  let qualitySamples = [];
  let qualityCooldownUntil = 0;
  let quietCount = 0;

  const markFallback = () => {
    rendererMode = 'static';
    wrapper.dataset.fluidMode = 'static';
    wrapper.dataset.fluidQuality = 'none';
    wrapper.dataset.fluidState = 'static';
    delete wrapper.dataset.fluidStorage;
    wrapper.classList.remove('is-rendered');
    wrapper.classList.add('is-static-fallback');
  };

  const releaseGraphics = () => {
    if (gl && !contextLost) {
      pressureInk?.destroy();
      if (vertexArray) gl.deleteVertexArray(vertexArray);
      if (program) gl.deleteProgram(program);
    }
    pressureInk = null;
    vertexArray = null;
    program = null;
    uniforms = null;
  };

  const setupLiteGraphics = () => {
    program = createLiteProgram(gl);
    vertexArray = gl.createVertexArray();
    if (!vertexArray) throw new Error('Unable to create the Site Fluid vertex array.');
    gl.bindVertexArray(vertexArray);
    gl.useProgram(program);
    uniforms = {
      resolution: gl.getUniformLocation(program, 'uResolution'),
      time: gl.getUniformLocation(program, 'uTime'),
      blobs: gl.getUniformLocation(program, 'uBlobs[0]'),
      blobCount: gl.getUniformLocation(program, 'uBlobCount'),
      pointer: gl.getUniformLocation(program, 'uPointer'),
      pointerVelocity: gl.getUniformLocation(program, 'uPointerVelocity'),
      pointerEnergy: gl.getUniformLocation(program, 'uPointerEnergy'),
      quietRects: gl.getUniformLocation(program, 'uQuietRects[0]'),
      quietCount: gl.getUniformLocation(program, 'uQuietCount'),
      impulse: gl.getUniformLocation(program, 'uImpulse'),
      scroll: gl.getUniformLocation(program, 'uScroll'),
      ink: gl.getUniformLocation(program, 'uInk'),
      signal: gl.getUniformLocation(program, 'uSignal'),
      intensity: gl.getUniformLocation(program, 'uIntensity')
    };
    rendererMode = 'lite';
    quality = PRESSURE_INK_QUALITY.baseline;
  };

  const exposeRenderer = () => {
    wrapper.dataset.fluidMode = rendererMode;
    wrapper.dataset.fluidQuality = rendererMode === 'stable' ? quality.name : 'baseline';
    if (rendererMode !== 'stable') delete wrapper.dataset.fluidStorage;
    wrapper.classList.remove('is-static-fallback');
    wrapper.classList.add('is-rendered');
  };

  const setupGraphics = () => {
    if (environment.motion === 'reduced') return false;

    try {
      if (!gl) gl = canvas.getContext('webgl2', contextOptions);
      if (!gl) throw new Error('WebGL2 is unavailable.');
      releaseGraphics();

      if (environment.motion === 'full' && environment.depth === 'interactive') {
        quality = readProfileQuality();
        pressureInk = createPressureInkRenderer(gl, canvas, {
          quality,
          style: profile,
          continuousAmbient: profile.continuousAmbient
        });
        rendererMode = 'stable';
      } else {
        setupLiteGraphics();
      }

      exposeRenderer();
      return true;
    } catch (error) {
      console.warn('Site Fluid is using its static fallback.', error);
      releaseGraphics();
      gl = null;
      markFallback();
      return false;
    }
  };

  const updateObstacle = () => {
    const viewport = getViewportSize();
    const seen = new Set();
    const rects = [];
    const appendRects = (selector, priority) => {
      if (!selector) return;
      document.querySelectorAll(selector).forEach((element) => {
        if (seen.has(element)) return;
        const clientRects = [...element.getClientRects()];
        if (clientRects.length === 0) return;
        seen.add(element);
        const elementPriority = priority + (element.matches('h1, h2, h3') ? 1 : 0);
        clientRects.forEach((rect) => {
          rects.push({
            bottom: rect.bottom,
            height: rect.height,
            left: rect.left,
            paddingX: priority >= 4 ? 8 : undefined,
            paddingY: priority >= 4 ? 7 : undefined,
            priority: elementPriority,
            right: rect.right,
            top: rect.top,
            width: rect.width
          });
        });
      });
    };

    appendRects(profile.protectSelector, 5);
    appendRects(':focus-visible', 10);
    appendRects(profile.quietSelector, 1);
    const packed = packFluidObstacles(rects, {
      viewportWidth: viewport.width,
      viewportHeight: viewport.height
    });
    quietRects.set(packed.data);
    quietCount = packed.count;
    wrapper.dataset.fluidObstacles = String(quietCount);
    pressureInk?.updateQuiet(quietRects, quietCount);
  };

  const scheduleObstacleUpdate = () => {
    if (obstacleFrame || destroyed) return;
    obstacleFrame = window.requestAnimationFrame(() => {
      obstacleFrame = 0;
      updateObstacle();
      // Ambient routes sleep with their last composite on screen. One tick
      // refreshes the moved/disabled quiet zone, then returns to idle.
      if (readyComplete && !frame) start();
    });
  };

  const switchToLite = (error) => {
    console.warn('Pressure Ink is using its lightweight renderer.', error);
    pressureInk?.destroy();
    pressureInk = null;
    setupLiteGraphics();
    exposeRenderer();
  };

  const resize = () => {
    resizeFrame = 0;
    updateObstacle();
    if (!gl || rendererMode === 'static') return;

    if (rendererMode === 'stable' && pressureInk) {
      let candidate = quality;
      let allocated = false;
      let allocationError = null;

      while (!allocated) {
        const viewport = getViewportSize();
        const dpr = Math.min(window.devicePixelRatio || 1, candidate.maximumDpr) * candidate.canvasScale;
        const width = Math.max(1, Math.round(viewport.width * dpr));
        const height = Math.max(1, Math.round(viewport.height * dpr));
        if (canvas.width !== width) canvas.width = width;
        if (canvas.height !== height) canvas.height = height;
        pressureInk.setQuality(candidate);
        try {
          pressureInk.resize(width, height, quietRects, quietCount);
          quality = candidate;
          allocated = true;
          wrapper.dataset.fluidQuality = quality.name;
          wrapper.dataset.fluidStorage = pressureInk.profile;
          gl.viewport(0, 0, width, height);
        } catch (error) {
          allocationError = error;
          const next = getNextPressureInkQuality(candidate.name);
          if (next.name === candidate.name) break;
          candidate = next;
        }
      }

      if (allocated) return;
      try {
        switchToLite(allocationError);
      } catch (fallbackError) {
        console.warn('Site Fluid is using its static fallback.', fallbackError);
        releaseGraphics();
        gl = null;
        markFallback();
        return;
      }
    }

    const maximumDpr = environment.motion === 'full' ? 1.4 : 1.2;
    const renderScale = environment.motion === 'full' ? 0.8 : 0.74;
    const dpr = Math.min(window.devicePixelRatio || 1, maximumDpr) * renderScale;
    const viewport = getViewportSize();
    const width = Math.max(1, Math.round(viewport.width * dpr));
    const height = Math.max(1, Math.round(viewport.height * dpr));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const scheduleResize = () => {
    if (resizeFrame || destroyed) return;
    resizeFrame = window.requestAnimationFrame(resize);
  };

  const queuePressureSplat = (splat) => pressureInk?.queueSplat(splat) ?? false;

  const queuePlume = (x, y, strength = 1) => {
    if (!pressureInk) return;
    const phase = ((x * 17.17) + (y * 31.31)) * Math.PI;
    const directionX = Math.cos(phase);
    const directionY = Math.sin(phase);
    const normalX = -directionY;
    const normalY = directionX;
    const viewport = getViewportSize();
    const aspect = viewport.width / Math.max(viewport.height, 1);
    const scaledStrength = strength * profile.interaction;

    for (let index = 0; index < 6; index += 1) {
      const progress = index / 5;
      const lateral = Math.sin(progress * Math.PI) * (index % 2 === 0 ? 1 : -1);
      queuePressureSplat({
        x: x - ((directionX * progress * 0.065) / aspect) + ((normalX * lateral * 0.016) / aspect),
        y: y - (directionY * progress * 0.065) + (normalY * lateral * 0.016),
        radius: 0.026 + ((1 - progress) * 0.018),
        strength: scaledStrength * (1.2 - (progress * 0.34)),
        forceX: (directionX * 0.42) + (normalX * lateral * 0.2),
        forceY: (directionY * 0.42) + (normalY * lateral * 0.2),
        graphite: (0.34 + ((1 - progress) * 0.24)) * profile.interaction,
        signal: index < 2 ? 0.075 * scaledStrength : 0
      });
    }
  };

  const queueAmbientWake = (strength = profile.seedStrength) => {
    if (rendererMode === 'stable') {
      const fromLeft = Math.floor(elapsed * 10) % 2 === 0;
      queuePressureSplat({
        x: fromLeft ? 0.018 : 0.982,
        y: 0.2 + ((elapsed * 0.173) % 0.6),
        radius: 0.065,
        strength,
        forceX: fromLeft ? 0.2 : -0.2,
        forceY: Math.sin(elapsed * 0.7) * 0.08,
        graphite: 0.24 * profile.interaction,
        signal: 0.02 * profile.interaction
      });
      return;
    }
    impulse.x = Math.floor(elapsed * 10) % 2 === 0 ? 0.08 : 0.92;
    impulse.y = 0.28 + ((elapsed * 0.173) % 0.44);
    impulse.age = 0;
    impulse.strength = strength;
    liteActiveUntil = performance.now() + 2200;
  };

  const triggerImpulse = (x, y, strength = 1) => {
    if (rendererMode === 'stable') {
      queuePlume(x, y, strength);
      return;
    }
    impulse.x = clamp(x, 0, 1);
    impulse.y = clamp(y, 0, 1);
    impulse.age = 0;
    impulse.strength = strength * profile.interaction;
    liteActiveUntil = performance.now() + 2400;
  };

  const updateBlobState = (dt) => {
    pointer.energy *= Math.exp(-1.8 * dt);
    pointer.vx *= Math.exp(-2.6 * dt);
    pointer.vy *= Math.exp(-2.6 * dt);
    impulse.age += dt;

    const blobCount = environment.motion === 'full' ? MAX_LITE_BLOBS : 4;
    for (let index = 0; index < blobCount; index += 1) {
      const blob = blobs[index];
      const driftX = Math.sin((elapsed * blob.speed) + blob.phase) * (blob.pigment ? 0.025 : 0.048);
      const driftY = Math.cos((elapsed * blob.speed * 0.81) + (blob.phase * 1.37)) * 0.038;
      const targetX = blob.anchorX + driftX;
      const targetY = blob.anchorY + driftY;
      const spring = blob.pigment ? 1.2 : 0.72;
      const drag = blob.pigment ? 2.8 : 2.15;

      blob.vx += (targetX - blob.x) * spring * dt;
      blob.vy += (targetY - blob.y) * spring * dt;
      if (environment.motion === 'full' && pointer.energy > 0.002) {
        const distanceSquared = ((blob.x - pointer.x) ** 2) + ((blob.y - pointer.y) ** 2);
        const influence = Math.exp(-distanceSquared / 0.095) * pointer.energy;
        blob.vx += pointer.vx * influence * 0.095 * dt;
        blob.vy += pointer.vy * influence * 0.095 * dt;
      }
      blob.vx *= Math.exp(-drag * dt);
      blob.vy *= Math.exp(-drag * dt);
      blob.x += blob.vx * dt;
      blob.y += blob.vy * dt;
    }
  };

  const draw = () => {
    if (!gl || contextLost) return;
    if (rendererMode === 'stable' && pressureInk) {
      pressureInk.render(elapsed);
      return;
    }
    if (!program || !uniforms) return;

    const blobCount = environment.motion === 'full' ? MAX_LITE_BLOBS : 4;
    blobUniformData.fill(0);
    for (let index = 0; index < blobCount; index += 1) {
      const blob = blobs[index];
      const offset = index * 4;
      blobUniformData[offset] = blob.x;
      blobUniformData[offset + 1] = blob.y;
      blobUniformData[offset + 2] = blob.radius;
      blobUniformData[offset + 3] = blob.pigment;
    }

    gl.useProgram(program);
    gl.bindVertexArray(vertexArray);
    gl.disable(gl.BLEND);
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform4fv(uniforms.blobs, blobUniformData);
    gl.uniform1i(uniforms.blobCount, blobCount);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform2f(uniforms.pointerVelocity, pointer.vx, pointer.vy);
    gl.uniform1f(uniforms.pointerEnergy, pointer.energy);
    gl.uniform4fv(uniforms.quietRects, quietRects);
    gl.uniform1i(uniforms.quietCount, quietCount);
    gl.uniform4f(uniforms.impulse, impulse.x, impulse.y, impulse.age, impulse.strength);
    gl.uniform1f(uniforms.scroll, scrollProgress);
    gl.uniform3fv(uniforms.ink, profile.palette.ink);
    gl.uniform3fv(uniforms.signal, profile.palette.signal);
    gl.uniform1f(uniforms.intensity, profile.intensity);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const shouldRun = () => readyComplete
    && !destroyed
    && pageActive
    && !document.hidden
    && !contextLost
    && environment.motion !== 'reduced'
    && Boolean(gl && (
      (rendererMode === 'stable' && pressureInk)
      || (rendererMode === 'lite' && program)
    ));

  const clearAmbientTimer = () => {
    if (ambientTimer) window.clearTimeout(ambientTimer);
    ambientTimer = 0;
  };

  const start = () => {
    if (!shouldRun() || frame) return;
    clearAmbientTimer();
    wrapper.dataset.fluidState = 'active';
    lastFrameTime = 0;
    lastRenderedTime = 0;
    frame = window.requestAnimationFrame(tick);
  };

  const scheduleAmbient = () => {
    if (profile.continuousAmbient || ambientTimer || !shouldRun()) return;
    wrapper.dataset.fluidState = 'idle';
    ambientTimer = window.setTimeout(() => {
      ambientTimer = 0;
      if (!shouldRun()) return;
      queueAmbientWake();
      start();
    }, profile.ambientDelay);
  };

  const downgradeQuality = () => {
    if (!pressureInk || performance.now() < qualityCooldownUntil) return;
    const nextQuality = getNextPressureInkQuality(quality.name);
    if (nextQuality.name === quality.name) return;
    quality = nextQuality;
    qualityCooldownUntil = performance.now() + 12000;
    qualitySamples = [];
    pressureInk.setQuality(quality);
    resize();
    pressureInk?.clear();
    pressureInk?.seed();
  };

  const observeFrameQuality = (interval, active) => {
    if (!active || rendererMode !== 'stable' || interval < 8) return;
    qualitySamples.push(Math.min(interval, 250));
    if (qualitySamples.length < 60) return;
    const shouldDowngrade = shouldDowngradePressureInkQuality(qualitySamples);
    qualitySamples = qualitySamples.slice(-20);
    if (shouldDowngrade) downgradeQuality();
  };

  function tick(time) {
    frame = 0;
    if (!shouldRun()) return;

    const stableActive = rendererMode === 'stable' && pressureInk?.isActive(time);
    const liteActive = rendererMode === 'lite' && time < liteActiveUntil;
    if (!profile.continuousAmbient && !stableActive && !liteActive) {
      draw();
      scheduleAmbient();
      return;
    }

    const frameInterval = rendererMode === 'stable'
      ? stableActive ? FULL_FRAME_INTERVAL : FULL_IDLE_FRAME_INTERVAL
      : LITE_FRAME_INTERVAL;
    const interval = lastRenderedTime ? time - lastRenderedTime : 0;
    if (lastRenderedTime && interval < frameInterval - 1) {
      frame = window.requestAnimationFrame(tick);
      return;
    }

    observeFrameQuality(interval, stableActive);
    const dt = Math.min(1 / 30, Math.max(0.001, (time - (lastFrameTime || time)) / 1000));
    lastFrameTime = time;
    lastRenderedTime = time;
    elapsed += dt;
    if (rendererMode === 'stable') {
      pressureInk.step(dt, elapsed, scrollProgress * GLOBAL_SCROLL_DAMPING);
    }
    else updateBlobState(dt);
    draw();
    frame = window.requestAnimationFrame(tick);
  }

  const stop = ({ suspended = false } = {}) => {
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    clearAmbientTimer();
    lastFrameTime = 0;
    lastRenderedTime = 0;
    qualitySamples = [];
    if (suspended) suspendedAt = performance.now();
    wrapper.dataset.fluidState = suspended ? 'suspended' : 'idle';
    pointer.vx = 0;
    pointer.vy = 0;
    pointer.energy = 0;
    pointer.lastTime = 0;
    pointer.directionX = 0;
    pointer.directionY = 0;
    touchStart = null;
  };

  const pointerToUv = (event) => ({
    x: clamp(event.clientX / Math.max(1, getViewportSize().width), 0, 1),
    y: clamp(1 - (event.clientY / Math.max(1, getViewportSize().height)), 0, 1)
  });

  const queuePointerSegment = (from, to, seconds, pressed) => {
    const viewport = getViewportSize();
    const aspect = viewport.width / Math.max(viewport.height, 1);
    const velocity = limitVector((to.x - from.x) / seconds, (to.y - from.y) / seconds, 2.8);
    const screenVelocityX = velocity.x * aspect;
    const screenSpeed = Math.hypot(screenVelocityX, velocity.y);
    const energy = Math.pow(clamp(screenSpeed / 1.55, 0, 1), 1.55) * profile.interaction;
    const distance = Math.hypot((to.x - from.x) * aspect, to.y - from.y);
    const radius = 0.021 + (energy * 0.034);
    const steps = Math.min(6, Math.max(1, Math.ceil(distance / Math.max(radius * 0.35, 0.008))));
    const forceScale = (0.08 + (energy * 0.16)) * (pressed ? 1.42 : 1);
    const strength = (0.5 + (energy * 1.08)) * (pressed ? 1.18 : 1) * profile.interaction;
    const signal = energy > 0.48 ? Math.pow((energy - 0.48) / 0.52, 1.35) * 0.16 : 0;

    if (rendererMode === 'stable') {
      for (let index = 1; index <= steps; index += 1) {
        const progress = index / steps;
        if (!queuePressureSplat({
          x: from.x + ((to.x - from.x) * progress),
          y: from.y + ((to.y - from.y) * progress),
          radius,
          strength,
          forceX: velocity.x * aspect * forceScale,
          forceY: velocity.y * forceScale,
          graphite: 0.2 + (energy * 0.52),
          signal
        })) break;
      }
    }

    pointer.vx += (velocity.x - pointer.vx) * 0.36;
    pointer.vy += (velocity.y - pointer.vy) * 0.36;
    pointer.energy = Math.max(pointer.energy, energy);
    liteActiveUntil = performance.now() + 1800;
  };

  const processPointerSample = (sample) => {
    const next = pointerToUv(sample);
    if (!pointer.lastTime || sample.timeStamp - pointer.lastTime > 140) {
      pointer.x = next.x;
      pointer.y = next.y;
      pointer.vx = 0;
      pointer.vy = 0;
      pointer.lastTime = sample.timeStamp;
      return;
    }
    const seconds = clamp((sample.timeStamp - pointer.lastTime) / 1000, 0.008, 0.05);
    queuePointerSegment({ x: pointer.x, y: pointer.y }, next, seconds, (sample.buttons || 0) > 0);
    pointer.x = next.x;
    pointer.y = next.y;
    pointer.lastTime = sample.timeStamp;
  };

  const isActivationTarget = (event) => event.target.closest?.(ACTIVATION_SELECTOR);

  const handlePointerMove = (event) => {
    if (!readyComplete || environment.motion !== 'full' || event.pointerType === 'touch') return;
    const samples = event.getCoalescedEvents?.() || [];
    (samples.length ? samples : [event]).slice(-MAX_POINTER_SPLATS).forEach(processPointerSample);
    start();
  };

  const handlePointerDown = (event) => {
    if (!readyComplete || isActivationTarget(event)) return;
    const position = pointerToUv(event);
    if (event.pointerType === 'touch') {
      touchStart = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        time: event.timeStamp,
        position
      };
      return;
    }
    if (environment.motion === 'full') {
      triggerImpulse(position.x, position.y, 1.08);
      start();
    }
  };

  const handlePointerUp = (event) => {
    if (!touchStart || event.pointerType !== 'touch' || event.pointerId !== touchStart.pointerId) return;
    const distance = Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y);
    const duration = event.timeStamp - touchStart.time;
    if (distance < 10 && duration < 420 && !isActivationTarget(event)) {
      triggerImpulse(touchStart.position.x, touchStart.position.y, 0.58);
      start();
    }
    touchStart = null;
  };

  const handlePointerCancel = (event) => {
    if (touchStart && event.pointerId !== touchStart.pointerId) return;
    touchStart = null;
  };

  const handleScroll = () => {
    const scrollRange = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    scrollProgress = clamp(window.scrollY / scrollRange, 0, 1);
    scheduleObstacleUpdate();
  };

  const handleEnvironmentChange = () => {
    stop({ suspended: true });
    if (!readyComplete) return;
    if (environment.motion === 'reduced') {
      releaseGraphics();
      gl = null;
      markFallback();
      return;
    }
    if (!pageActive || !setupGraphics()) return;
    resize();
    queueAmbientWake();
    draw();
    start();
  };

  const handleVisibility = () => {
    if (document.hidden) stop({ suspended: true });
    else start();
  };

  const handlePageHide = () => {
    pageActive = false;
    stop({ suspended: true });
  };

  const handlePageShow = () => {
    pageActive = true;
    if (!readyComplete || environment.motion === 'reduced' || contextLost) return;
    if (!gl && !setupGraphics()) return;
    if (suspendedAt && performance.now() - suspendedAt > 5000 && pressureInk) {
      pressureInk.clear();
      pressureInk.seed();
    }
    suspendedAt = 0;
    resize();
    draw();
    start();
  };

  const handleContextLost = (event) => {
    event.preventDefault();
    contextLost = true;
    stop({ suspended: true });
    gl = null;
    pressureInk = null;
    program = null;
    vertexArray = null;
    uniforms = null;
    markFallback();
  };

  const handleContextRestored = () => {
    contextLost = false;
    if (!pageActive || !setupGraphics()) return;
    resize();
    queueAmbientWake();
    draw();
    start();
  };

  window.addEventListener('pointermove', handlePointerMove, { capture: true, passive: true });
  window.addEventListener('pointerdown', handlePointerDown, { passive: true });
  window.addEventListener('pointerup', handlePointerUp, { passive: true });
  window.addEventListener('pointercancel', handlePointerCancel, { passive: true });
  window.addEventListener('portfolio:environment-change', handleEnvironmentChange);
  window.addEventListener(FLUID_OBSTACLE_EVENT, scheduleObstacleUpdate);
  window.addEventListener('resize', scheduleResize, { passive: true });
  window.addEventListener('scroll', handleScroll, { passive: true });
  window.addEventListener('pagehide', handlePageHide);
  window.addEventListener('pageshow', handlePageShow);
  document.addEventListener('visibilitychange', handleVisibility);
  document.addEventListener('focusin', scheduleObstacleUpdate);
  document.addEventListener('focusout', scheduleObstacleUpdate);
  canvas.addEventListener('webglcontextlost', handleContextLost);
  canvas.addEventListener('webglcontextrestored', handleContextRestored);

  document.fonts?.ready?.then(() => {
    if (!destroyed) scheduleResize();
  }).catch(() => {});

  Promise.resolve(ready).then(() => {
    if (destroyed) return;
    readyComplete = true;
    updateObstacle();
    if (environment.motion === 'reduced') {
      markFallback();
      return;
    }
    if (!pageActive || !setupGraphics()) return;
    resize();
    queueAmbientWake();
    liteActiveUntil = performance.now() + 2500;
    draw();
    start();
  }).catch((error) => {
    if (destroyed) return;
    console.warn('Site Fluid waited for an incomplete page gate and used its static fallback.', error);
    markFallback();
  });

  return {
    setProgress(progress) {
      scrollProgress = clamp(progress, 0, 1);
    },
    refreshObstacle: scheduleObstacleUpdate,
    wake(strength = profile.seedStrength) {
      queueAmbientWake(strength);
      start();
    },
    destroy() {
      destroyed = true;
      stop();
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      if (obstacleFrame) window.cancelAnimationFrame(obstacleFrame);
      window.removeEventListener('pointermove', handlePointerMove, true);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('portfolio:environment-change', handleEnvironmentChange);
      window.removeEventListener(FLUID_OBSTACLE_EVENT, scheduleObstacleUpdate);
      window.removeEventListener('resize', scheduleResize);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibility);
      document.removeEventListener('focusin', scheduleObstacleUpdate);
      document.removeEventListener('focusout', scheduleObstacleUpdate);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      releaseGraphics();
      layer.base.remove();
      if (layer.generated) {
        wrapper.remove();
      } else if (layer.originalParent) {
        if (layer.originalCanvas && canvas.isConnected) canvas.replaceWith(layer.originalCanvas);
        layer.originalParent.insertBefore(wrapper, layer.originalNextSibling);
        layer.legacyGrain?.classList.remove('site-fluid__legacy-grain');
        wrapper.classList.remove('site-fluid', `site-fluid--${profile.theme}`);
        wrapper.removeAttribute('data-site-fluid');
      }
    }
  };
};
