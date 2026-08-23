import { clamp } from './utils.js';
import { createPressureInkRenderer } from './pressure-ink-renderer.js';
import {
  createLiteProgram,
  LITE_BLOB_BLUEPRINTS,
  MAX_LITE_BLOBS
} from './hero-fluid-lite-shader.js';

const MAX_POINTER_SPLATS = 12;
const FULL_FRAME_INTERVAL = 1000 / 60;
const FULL_IDLE_FRAME_INTERVAL = 1000 / 30;
const LITE_FRAME_INTERVAL = 1000 / 30;
const INTERACTIVE_SELECTOR = 'a, button, input, select, textarea, [role="button"]';

const limitVector = (x, y, maximum) => {
  const magnitude = Math.hypot(x, y);
  if (magnitude <= maximum || magnitude === 0) return { x, y };
  const scale = maximum / magnitude;
  return { x: x * scale, y: y * scale };
};

export const initHeroFluid = (environment, homeIntro) => {
  const story = document.querySelector('[data-hero-story]');
  const sticky = story?.querySelector('[data-hero-sticky]');
  const wrapper = story?.querySelector('[data-hero-fluid]');
  const canvas = wrapper?.querySelector('[data-hero-fluid-canvas]');
  const copy = story?.querySelector('[data-hero-copy]');

  if (!story || !sticky || !wrapper || !canvas || !copy) return null;

  const contextOptions = {
    alpha: false,
    antialias: false,
    depth: false,
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
  const quiet = new Float32Array([0.5, 0.5, 0.36, 0.22]);
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
  const impulse = {
    x: 0.5,
    y: 0.5,
    age: 10,
    strength: 0
  };

  let gl = null;
  let program = null;
  let pressureInk = null;
  let rendererMode = 'static';
  let vertexArray = null;
  let uniforms = null;
  let frame = 0;
  let lastFrameTime = 0;
  let lastRenderedTime = 0;
  let elapsed = 0;
  let visible = true;
  let pageActive = true;
  let introComplete = false;
  let contextLost = false;
  let destroyed = false;
  let scrollProgress = 0;
  let stickyRect = sticky.getBoundingClientRect();
  let touchStart = null;
  let pausedAt = 0;

  const markFallback = () => {
    rendererMode = 'static';
    wrapper.dataset.fluidMode = 'static';
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
      quiet: gl.getUniformLocation(program, 'uQuiet'),
      impulse: gl.getUniformLocation(program, 'uImpulse'),
      scroll: gl.getUniformLocation(program, 'uScroll')
    };
    rendererMode = 'lite';
  };

  const exposeRenderer = () => {
    wrapper.dataset.fluidMode = rendererMode;
    if (rendererMode !== 'stable') delete wrapper.dataset.fluidProfile;
    wrapper.classList.remove('is-static-fallback');
    wrapper.classList.add('is-rendered');
  };

  const setupGraphics = () => {
    if (environment.motion === 'reduced') return false;

    try {
      gl = canvas.getContext('webgl2', contextOptions);
      if (!gl) throw new Error('WebGL2 is unavailable.');

      releaseGraphics();
      if (environment.motion === 'full' && environment.depth === 'interactive') {
        try {
          pressureInk = createPressureInkRenderer(gl, canvas);
          rendererMode = 'stable';
        } catch (error) {
          console.warn('Pressure Ink is using its lightweight renderer.', error);
          pressureInk = null;
          setupLiteGraphics();
        }
      } else {
        setupLiteGraphics();
      }

      exposeRenderer();
      return true;
    } catch (error) {
      console.warn('Hero fluid renderer is using its static fallback.', error);
      releaseGraphics();
      gl = null;
      markFallback();
      return false;
    }
  };

  const updateQuietZone = () => {
    stickyRect = sticky.getBoundingClientRect();
    const readingNodes = [
      copy.querySelector('[data-handwritten-wordmark]'),
      ...copy.querySelectorAll('[data-hero-line]')
    ].filter(Boolean);
    const actionNodes = [...copy.querySelectorAll('[data-hero-actions] a')];
    const readElementRect = (element) => {
      if (!element.matches('[data-hero-line]')) return element.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(element);
      const rect = range.getBoundingClientRect();
      range.detach?.();
      return rect;
    };
    const readingRects = readingNodes.map(readElementRect).filter((rect) => rect.width && rect.height);
    const actionRects = actionNodes.map(readElementRect).filter((rect) => rect.width && rect.height);
    const contentRects = [...readingRects, ...actionRects];

    if (!stickyRect.width || !stickyRect.height || !readingRects.length || !contentRects.length) return;

    const horizontalBounds = contentRects.reduce((bounds, rect) => ({
      left: Math.min(bounds.left, rect.left),
      right: Math.max(bounds.right, rect.right),
    }), {
      left: contentRects[0].left,
      right: contentRects[0].right
    });
    const verticalBounds = contentRects.reduce((bounds, rect) => ({
      top: Math.min(bounds.top, rect.top),
      bottom: Math.max(bounds.bottom, rect.bottom)
    }), {
      top: contentRects[0].top,
      bottom: contentRects[0].bottom
    });

    const horizontalPadding = clamp(stickyRect.width * 0.045, 28, 80);
    const verticalPadding = clamp(stickyRect.height * 0.035, 22, 52);
    const contentWidth = horizontalBounds.right - horizontalBounds.left;
    const contentHeight = verticalBounds.bottom - verticalBounds.top;
    const maximumHalfWidth = stickyRect.width <= 480 ? 0.46 : 0.47;
    quiet[0] = clamp((horizontalBounds.left + (contentWidth / 2) - stickyRect.left) / stickyRect.width, 0, 1);
    quiet[1] = clamp(1 - ((verticalBounds.top + (contentHeight / 2) - stickyRect.top) / stickyRect.height), 0, 1);
    quiet[2] = clamp(((contentWidth / 2) + horizontalPadding) / stickyRect.width, 0.2, maximumHalfWidth);
    quiet[3] = clamp(((contentHeight / 2) + verticalPadding) / stickyRect.height, 0.14, 0.44);
    pressureInk?.updateQuiet(quiet);
  };

  const resize = () => {
    updateQuietZone();
    if (!gl || rendererMode === 'static') return;

    const maximumDpr = rendererMode === 'stable' ? 1.35 : environment.motion === 'full' ? 1.4 : 1.15;
    const renderScale = rendererMode === 'stable' ? 0.82 : environment.motion === 'full' ? 0.76 : 0.68;
    const dpr = Math.min(window.devicePixelRatio || 1, maximumDpr) * renderScale;
    const width = Math.max(1, Math.round(stickyRect.width * dpr));
    const height = Math.max(1, Math.round(stickyRect.height * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    if (rendererMode === 'stable' && pressureInk) {
      try {
        pressureInk.resize(width, height, quiet);
        wrapper.dataset.fluidProfile = pressureInk.profile;
      } catch (error) {
        console.warn('Pressure Ink targets are unavailable; using the lightweight renderer.', error);
        pressureInk.destroy();
        pressureInk = null;
        try {
          setupLiteGraphics();
          exposeRenderer();
        } catch (fallbackError) {
          console.warn('Hero fluid renderer is using its static fallback.', fallbackError);
          releaseGraphics();
          gl = null;
          markFallback();
          return;
        }
      }
    }
    gl.viewport(0, 0, width, height);
  };

  const queuePressureSplat = (splat) => pressureInk?.queueSplat(splat) ?? false;

  const queuePlume = (x, y, strength = 1) => {
    if (!pressureInk) return;
    const phase = ((x * 17.17) + (y * 31.31)) * Math.PI;
    const directionX = Math.cos(phase);
    const directionY = Math.sin(phase);
    const normalX = -directionY;
    const normalY = directionX;
    const aspect = stickyRect.width / Math.max(stickyRect.height, 1);

    for (let index = 0; index < 6; index += 1) {
      const progress = index / 5;
      const lateral = Math.sin(progress * Math.PI) * (index % 2 === 0 ? 1 : -1);
      queuePressureSplat({
        x: x - ((directionX * progress * 0.065) / aspect) + ((normalX * lateral * 0.016) / aspect),
        y: y - (directionY * progress * 0.065) + (normalY * lateral * 0.016),
        radius: 0.026 + ((1 - progress) * 0.018),
        strength: strength * (1.2 - (progress * 0.34)),
        forceX: (directionX * 0.42) + (normalX * lateral * 0.2),
        forceY: (directionY * 0.42) + (normalY * lateral * 0.2),
        graphite: 0.34 + ((1 - progress) * 0.24),
        signal: index < 2 ? 0.075 * strength : 0
      });
    }
  };

  const queueQuietWake = (strength = 1) => {
    if (!pressureInk) return;
    const left = clamp(quiet[0] - quiet[2] - 0.018, 0.02, 0.98);
    const right = clamp(quiet[0] + quiet[2] + 0.018, 0.02, 0.98);
    const top = clamp(quiet[1] + quiet[3] + 0.02, 0.02, 0.98);
    const bottom = clamp(quiet[1] - quiet[3] - 0.02, 0.02, 0.98);
    [
      { x: left, y: quiet[1] - 0.1, forceX: 0.35, forceY: 0.22, signal: 0 },
      { x: left, y: quiet[1] + 0.1, forceX: 0.36, forceY: -0.2, signal: 0.05 },
      { x: right, y: quiet[1] - 0.08, forceX: -0.34, forceY: -0.2, signal: 0 },
      { x: right, y: quiet[1] + 0.09, forceX: -0.36, forceY: 0.21, signal: 0 },
      { x: quiet[0] - 0.16, y: top, forceX: 0.21, forceY: -0.3, signal: 0 },
      { x: quiet[0] + 0.17, y: bottom, forceX: -0.19, forceY: 0.29, signal: 0 }
    ].forEach((splat, index) => queuePressureSplat({
      ...splat,
      radius: index < 4 ? 0.052 : 0.04,
      strength,
      graphite: index < 4 ? 0.38 : 0.28
    }));
  };

  const triggerImpulse = (x, y, strength = 1) => {
    if (rendererMode === 'stable') {
      queuePlume(x, y, strength);
      return;
    }
    impulse.x = clamp(x, 0, 1);
    impulse.y = clamp(y, 0, 1);
    impulse.age = 0;
    impulse.strength = strength;
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
    gl.uniform2f(uniforms.resolution, canvas.width, canvas.height);
    gl.uniform1f(uniforms.time, elapsed);
    gl.uniform4fv(uniforms.blobs, blobUniformData);
    gl.uniform1i(uniforms.blobCount, blobCount);
    gl.uniform2f(uniforms.pointer, pointer.x, pointer.y);
    gl.uniform2f(uniforms.pointerVelocity, pointer.vx, pointer.vy);
    gl.uniform1f(uniforms.pointerEnergy, pointer.energy);
    gl.uniform4fv(uniforms.quiet, quiet);
    gl.uniform4f(uniforms.impulse, impulse.x, impulse.y, impulse.age, impulse.strength);
    gl.uniform1f(uniforms.scroll, scrollProgress);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const shouldRun = () => introComplete
    && !destroyed
    && pageActive
    && visible
    && !document.hidden
    && !contextLost
    && environment.motion !== 'reduced'
    && Boolean(gl && (
      (rendererMode === 'stable' && pressureInk)
      || (rendererMode === 'lite' && program)
    ));

  const tick = (time) => {
    frame = 0;
    if (!shouldRun()) return;

    const frameInterval = rendererMode === 'stable'
      ? pressureInk.isActive(time) ? FULL_FRAME_INTERVAL : FULL_IDLE_FRAME_INTERVAL
      : LITE_FRAME_INTERVAL;
    if (lastRenderedTime && time - lastRenderedTime < frameInterval - 1) {
      frame = window.requestAnimationFrame(tick);
      return;
    }

    const dt = Math.min(1 / 30, Math.max(0.001, (time - (lastFrameTime || time)) / 1000));
    lastFrameTime = time;
    lastRenderedTime = time;
    elapsed += dt;
    if (rendererMode === 'stable') {
      pressureInk.step(dt, elapsed, scrollProgress);
    } else {
      updateBlobState(dt);
    }
    draw();
    frame = window.requestAnimationFrame(tick);
  };

  const stop = () => {
    if (!pausedAt) pausedAt = performance.now();
    if (frame) window.cancelAnimationFrame(frame);
    frame = 0;
    lastFrameTime = 0;
    lastRenderedTime = 0;
    pointer.vx = 0;
    pointer.vy = 0;
    pointer.energy = 0;
    pointer.lastTime = 0;
    pointer.directionX = 0;
    pointer.directionY = 0;
    impulse.age = 10;
    impulse.strength = 0;
  };

  const start = () => {
    if (!shouldRun() || frame) return;
    if (rendererMode === 'stable' && pressureInk && pausedAt && performance.now() - pausedAt > 5000) {
      pressureInk.clear();
      pressureInk.seed();
    }
    pausedAt = 0;
    lastFrameTime = 0;
    lastRenderedTime = 0;
    frame = window.requestAnimationFrame(tick);
  };

  const pointerToUv = (event) => ({
    x: clamp((event.clientX - stickyRect.left) / Math.max(1, stickyRect.width), 0, 1),
    y: clamp(1 - ((event.clientY - stickyRect.top) / Math.max(1, stickyRect.height)), 0, 1)
  });

  const queuePointerSegment = (from, to, seconds, pressed) => {
    const aspect = stickyRect.width / Math.max(stickyRect.height, 1);
    const velocity = limitVector((to.x - from.x) / seconds, (to.y - from.y) / seconds, 2.8);
    const screenVelocityX = velocity.x * aspect;
    const screenSpeed = Math.hypot(screenVelocityX, velocity.y);
    const energy = Math.pow(clamp(screenSpeed / 1.55, 0, 1), 1.55);
    const distanceX = (to.x - from.x) * aspect;
    const distanceY = to.y - from.y;
    const distance = Math.hypot(distanceX, distanceY);
    const radius = 0.021 + (energy * 0.034);
    const steps = Math.min(6, Math.max(1, Math.ceil(distance / Math.max(radius * 0.35, 0.008))));
    const forceScale = (0.08 + (energy * 0.16)) * (pressed ? 1.42 : 1);
    const strength = (0.5 + (energy * 1.08)) * (pressed ? 1.18 : 1);
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

      if (screenSpeed > 0.001) {
        const directionX = screenVelocityX / screenSpeed;
        const directionY = velocity.y / screenSpeed;
        const previousLength = Math.hypot(pointer.directionX, pointer.directionY);
        if (previousLength > 0.1) {
          const directionDot = (directionX * pointer.directionX) + (directionY * pointer.directionY);
          const turn = clamp((0.45 - directionDot) / 1.45, 0, 1) * energy;
          if (turn > 0.08) {
            const normalX = -directionY;
            const normalY = directionX;
            const offset = radius * 1.25;
            [-1, 1].forEach((side) => queuePressureSplat({
              x: to.x + ((normalX * offset * side) / aspect),
              y: to.y + (normalY * offset * side),
              radius: radius * 0.72,
              strength: 0.72 + turn,
              forceX: (normalX * side * 0.68) + (screenVelocityX * 0.08),
              forceY: (normalY * side * 0.68) + (velocity.y * 0.08),
              graphite: 0.18 + (turn * 0.32),
              signal: side > 0 ? signal * 0.75 : 0
            }));
          }
        }
        pointer.directionX = directionX;
        pointer.directionY = directionY;
      }
    }

    pointer.vx += (velocity.x - pointer.vx) * 0.36;
    pointer.vy += (velocity.y - pointer.vy) * 0.36;
    pointer.energy = Math.max(pointer.energy, energy);
  };

  const processPointerSample = (sample) => {
    const next = pointerToUv(sample);
    if (!pointer.lastTime || sample.timeStamp - pointer.lastTime > 140) {
      pointer.x = next.x;
      pointer.y = next.y;
      pointer.vx = 0;
      pointer.vy = 0;
      pointer.lastTime = sample.timeStamp;
      pointer.directionX = 0;
      pointer.directionY = 0;
      return;
    }

    const seconds = clamp((sample.timeStamp - pointer.lastTime) / 1000, 0.008, 0.05);
    queuePointerSegment(
      { x: pointer.x, y: pointer.y },
      next,
      seconds,
      (sample.buttons || 0) > 0
    );
    pointer.x = next.x;
    pointer.y = next.y;
    pointer.lastTime = sample.timeStamp;
  };

  const handlePointerMove = (event) => {
    if (!introComplete || environment.motion !== 'full' || event.pointerType === 'touch') return;
    if (event.target.closest?.(INTERACTIVE_SELECTOR)) {
      pointer.lastTime = 0;
      pointer.directionX = 0;
      pointer.directionY = 0;
      return;
    }
    const samples = event.getCoalescedEvents?.() || [];
    (samples.length ? samples : [event]).slice(-MAX_POINTER_SPLATS).forEach(processPointerSample);
    start();
  };

  const handlePointerDown = (event) => {
    if (!introComplete) return;
    if (event.target.closest?.(INTERACTIVE_SELECTOR)) return;
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
    if (
      !introComplete
      || !touchStart
      || event.pointerType !== 'touch'
      || event.pointerId !== touchStart.pointerId
    ) return;

    const distance = Math.hypot(event.clientX - touchStart.x, event.clientY - touchStart.y);
    const duration = event.timeStamp - touchStart.time;
    if (distance < 10 && duration < 420 && !event.target.closest?.(INTERACTIVE_SELECTOR)) {
      triggerImpulse(touchStart.position.x, touchStart.position.y, 0.58);
      start();
    }
    touchStart = null;
  };

  const handlePointerCancel = (event) => {
    if (touchStart && event.pointerId !== touchStart.pointerId) return;
    touchStart = null;
  };

  const handleProgress = (event) => {
    const nextProgress = clamp(event.detail?.progress ?? 0, 0, 1);
    const progressDelta = nextProgress - scrollProgress;
    scrollProgress = nextProgress;
    quiet[1] = clamp(
      quiet[1] + ((progressDelta * 30) / Math.max(stickyRect.height, 1)),
      0,
      1
    );
    pressureInk?.updateQuiet(quiet);
  };

  const handleEnvironmentChange = () => {
    stop();
    if (!introComplete) {
      if (environment.motion === 'reduced') {
        releaseGraphics();
        gl = null;
        markFallback();
      }
      return;
    }
    if (environment.motion === 'reduced') {
      releaseGraphics();
      gl = null;
      markFallback();
      return;
    }

    if (!pageActive) return;

    if (!setupGraphics()) return;
    resize();
    draw();
    start();
  };

  const handleVisibility = () => {
    if (document.hidden) {
      stop();
      return;
    }
    start();
  };

  const handlePageHide = () => {
    pageActive = false;
    stop();
  };

  const handlePageShow = () => {
    pageActive = true;
    if (!introComplete || environment.motion === 'reduced' || contextLost) return;

    if (!gl && !setupGraphics()) return;
    resize();
    draw();
    start();
  };

  const handleContextLost = (event) => {
    event.preventDefault();
    contextLost = true;
    stop();
    gl = null;
    pressureInk = null;
    program = null;
    vertexArray = null;
    uniforms = null;
    markFallback();
  };

  const handleContextRestored = () => {
    contextLost = false;
    if (!pageActive) return;
    if (!setupGraphics()) return;
    resize();
    draw();
    start();
  };

  sticky.addEventListener('pointermove', handlePointerMove, { passive: true });
  sticky.addEventListener('pointerdown', handlePointerDown, { passive: true });
  sticky.addEventListener('pointerup', handlePointerUp, { passive: true });
  sticky.addEventListener('pointercancel', handlePointerCancel, { passive: true });
  window.addEventListener('portfolio:hero-progress', handleProgress);
  window.addEventListener('portfolio:environment-change', handleEnvironmentChange);
  window.addEventListener('resize', resize, { passive: true });
  window.addEventListener('pagehide', handlePageHide);
  window.addEventListener('pageshow', handlePageShow);
  document.addEventListener('visibilitychange', handleVisibility);
  canvas.addEventListener('webglcontextlost', handleContextLost);
  canvas.addEventListener('webglcontextrestored', handleContextRestored);

  const resizeObserver = 'ResizeObserver' in window
    ? new ResizeObserver(resize)
    : null;
  resizeObserver?.observe(sticky);
  resizeObserver?.observe(copy);

  const intersectionObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    }, { rootMargin: '8% 0px' })
    : null;
  intersectionObserver?.observe(story);

  document.fonts?.ready?.then(() => {
    if (!destroyed) resize();
  }).catch(() => {});
  Promise.resolve(homeIntro).then(() => {
    if (destroyed) return;
    introComplete = true;
    pointer.vx = 0;
    pointer.vy = 0;
    pointer.energy = 0;
    pointer.lastTime = 0;
    updateQuietZone();

    if (environment.motion === 'reduced') {
      markFallback();
      return;
    }

    if (!pageActive) return;

    if (!setupGraphics()) return;
    resize();
    if (rendererMode === 'stable') {
      queueQuietWake(0.88);
    } else {
      triggerImpulse(quiet[0], quiet[1], environment.motion === 'full' ? 0.72 : 0.42);
    }
    draw();
    start();
  }).catch((error) => {
    if (destroyed) return;
    console.warn('Hero fluid waited for an incomplete intro and used its static fallback.', error);
    markFallback();
  });

  return {
    destroy() {
      destroyed = true;
      stop();
      resizeObserver?.disconnect();
      intersectionObserver?.disconnect();
      sticky.removeEventListener('pointermove', handlePointerMove);
      sticky.removeEventListener('pointerdown', handlePointerDown);
      sticky.removeEventListener('pointerup', handlePointerUp);
      sticky.removeEventListener('pointercancel', handlePointerCancel);
      window.removeEventListener('portfolio:hero-progress', handleProgress);
      window.removeEventListener('portfolio:environment-change', handleEnvironmentChange);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pagehide', handlePageHide);
      window.removeEventListener('pageshow', handlePageShow);
      document.removeEventListener('visibilitychange', handleVisibility);
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
      releaseGraphics();
    }
  };
};
