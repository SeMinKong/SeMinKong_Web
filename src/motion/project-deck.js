const AUTO_SPEED = 7;
const FRICTION = 0.976;
const MIN_VELOCITY = 0.015;
const MAX_VELOCITY = 11;
const SNAP_VELOCITY = 0.18;
const VELOCITY_SMOOTHING = 0.42;
const CLICK_SLOP = 6;
const RING_GAP = 140;
const RING_REACH = 0.85;
const SETTLE_RATE = 0.16;
const FACING_LIMIT = 70;

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const wrapAngle = (value) => ((value % 360) + 360) % 360;

const signedAngle = (value) => {
  const wrapped = wrapAngle(value);
  return wrapped > 180 ? wrapped - 360 : wrapped;
};

export const initProjectDeck = (environment) => {
  const root = document.querySelector('[data-project-deck]');
  if (!root) return;

  const stage = root.querySelector('[data-deck-stage]');
  const originals = Array.from(root.querySelectorAll('[data-deck-card]'));
  if (!stage || originals.length < 2) return;

  let slots = originals;
  let clones = [];
  let step = 360 / originals.length;
  let radius = 0;
  let degreesPerPixel = 0;
  let copies = 0;

  let enabled = false;
  let angle = 0;
  let velocity = 0;
  let target = null;

  let frame = 0;
  let lastTime = 0;
  let running = false;

  let pointerInside = false;
  let inView = true;

  let dragging = false;
  let dragPointerId = null;
  let dragOriginX = 0;
  let dragOriginAngle = 0;
  let dragPreviousX = 0;
  let dragPreviousTime = 0;
  let dragDistance = 0;
  let snapPending = false;

  const shouldEnable = () => environment.motion === 'full' && environment.depth === 'interactive';

  // The ring has to out-reach the viewport, which spaces six cards far too thinly,
  // so inert copies fill it in and every project comes round several times.
  const planRing = () => {
    const cardWidth = originals[0]?.offsetWidth || 0;
    const spacing = cardWidth + RING_GAP;
    const reach = Math.max(stage.clientWidth * RING_REACH, spacing * 2);
    const needed = Math.ceil(Math.PI / Math.asin(Math.min(0.9, spacing / (2 * reach))));
    return { copies: Math.max(2, Math.ceil(needed / originals.length)), radius: Math.round(reach) };
  };

  const buildRing = (count) => {
    clones = [];
    copies = count;

    for (let copy = 1; copy < count; copy += 1) {
      originals.forEach((original) => {
        const clone = original.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.dataset.deckClone = '';
        clone.querySelectorAll('a, button, input, select, textarea, [tabindex]').forEach((node) => {
          node.tabIndex = -1;
        });
        stage.append(clone);
        clones.push(clone);
      });
    }

    slots = [...originals, ...clones];
    step = 360 / slots.length;
  };

  const teardownRing = () => {
    clones.forEach((clone) => clone.remove());
    clones = [];
    copies = 0;
    slots = originals;
    step = 360 / originals.length;
  };

  const measure = () => {
    const plan = planRing();
    if (plan.copies !== copies) {
      teardownRing();
      buildRing(plan.copies);
    }

    radius = plan.radius;
    // One pixel of pointer travel moves the front face exactly one pixel, so the
    // ring tracks the hand instead of racing ahead of it.
    degreesPerPixel = 180 / (Math.PI * radius);

    slots.forEach((slot, index) => {
      slot.style.transform = `rotateY(${(index * step).toFixed(3)}deg) translateZ(${radius}px)`;
    });
  };

  const render = () => {
    stage.style.transform = `translateZ(${-radius}px) rotateY(${angle.toFixed(3)}deg)`;

    let frontIndex = 0;
    let frontDistance = Infinity;

    slots.forEach((slot, index) => {
      const theta = signedAngle(angle + index * step);
      const distance = Math.abs(theta);

      if (distance < frontDistance) {
        frontDistance = distance;
        frontIndex = index;
      }

      const facing = Math.max(0, Math.cos((theta * Math.PI) / 180));
      slot.style.opacity = (facing ** 0.8).toFixed(3);
      slot.style.pointerEvents = distance < FACING_LIMIT ? 'auto' : 'none';
    });

    slots.forEach((slot, index) => slot.classList.toggle('is-active', index === frontIndex));
  };

  const nearestDetent = () => Math.round(angle / step) * step;

  const advance = (elapsed) => {
    const frames = elapsed / 16.7;

    if (target !== null) {
      const delta = signedAngle(target - angle);
      velocity = 0;

      if (Math.abs(delta) < 0.15) {
        angle = target;
        target = null;
      } else {
        angle += delta * Math.min(1, SETTLE_RATE * frames);
      }

      return;
    }

    if (Math.abs(velocity) > MIN_VELOCITY) {
      angle += velocity * frames;
      velocity *= FRICTION ** frames;

      // Once the throw has spent itself, hand the last few degrees to the detent.
      if (snapPending && Math.abs(velocity) <= SNAP_VELOCITY) {
        snapPending = false;
        target = nearestDetent();
      }

      return;
    }

    velocity = 0;

    if (snapPending) {
      snapPending = false;
      target = nearestDetent();
      return;
    }

    // Hovering hands the ring over to the pointer: idle drift stops until it leaves.
    if (!pointerInside && inView) angle += AUTO_SPEED * (elapsed / 1000);
  };

  const tick = (time) => {
    frame = window.requestAnimationFrame(tick);
    const elapsed = lastTime ? Math.min(80, time - lastTime) : 16.7;
    lastTime = time;

    if (!dragging) advance(elapsed);

    angle = wrapAngle(angle);
    render();
  };

  const startLoop = () => {
    if (running || !enabled) return;
    running = true;
    lastTime = 0;
    frame = window.requestAnimationFrame(tick);
  };

  const stopLoop = () => {
    if (!running) return;
    running = false;
    window.cancelAnimationFrame(frame);
    frame = 0;
  };

  const onPointerEnter = () => {
    pointerInside = true;
    // Drift stops the moment the pointer arrives, so let it stop on a card
    // rather than wherever it happened to be.
    if (!dragging) snapPending = true;
  };

  const onPointerLeave = () => {
    if (dragging) return;
    pointerInside = false;
  };

  const onPointerDown = (event) => {
    if (!enabled) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    dragging = true;
    dragPointerId = event.pointerId;
    dragOriginX = event.clientX;
    dragOriginAngle = angle;
    dragPreviousX = event.clientX;
    dragPreviousTime = event.timeStamp;
    dragDistance = 0;
    velocity = 0;
    target = null;
    snapPending = false;
    pointerInside = true;
    root.classList.add('is-dragging');
    stage.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!dragging || event.pointerId !== dragPointerId) return;

    const travelled = event.clientX - dragOriginX;
    angle = dragOriginAngle + travelled * degreesPerPixel;
    dragDistance = Math.max(dragDistance, Math.abs(travelled));

    const frameTravel = event.clientX - dragPreviousX;
    const frameElapsed = Math.max(8, event.timeStamp - dragPreviousTime);
    const instant = (frameTravel * degreesPerPixel * 16.7) / frameElapsed;
    velocity = clamp(
      velocity * (1 - VELOCITY_SMOOTHING) + instant * VELOCITY_SMOOTHING,
      -MAX_VELOCITY,
      MAX_VELOCITY
    );
    dragPreviousX = event.clientX;
    dragPreviousTime = event.timeStamp;
  };

  const endDrag = (event) => {
    if (!dragging || (event && event.pointerId !== dragPointerId)) return;

    dragging = false;
    dragPointerId = null;
    snapPending = true;
    root.classList.remove('is-dragging');
    pointerInside = root.matches(':hover');
  };

  const onDragStart = (event) => event.preventDefault();

  // A drag that finishes on a card must not also follow that card's link.
  const onClickCapture = (event) => {
    if (dragDistance <= CLICK_SLOP) return;
    event.preventDefault();
    event.stopPropagation();
    dragDistance = 0;
  };

  const onFocusIn = (event) => {
    if (!enabled) return;
    const slot = event.target?.closest?.('[data-deck-card]');
    const index = slot ? slots.indexOf(slot) : -1;
    if (index < 0) return;
    velocity = 0;
    target = -index * step;
  };

  const onKeyDown = (event) => {
    if (!enabled || event.metaKey || event.ctrlKey || event.altKey) return;

    if (event.key === 'ArrowRight') target = (target ?? angle) - step;
    else if (event.key === 'ArrowLeft') target = (target ?? angle) + step;
    else return;

    velocity = 0;
    event.preventDefault();
  };

  const enable = () => {
    if (enabled) return;
    enabled = true;
    angle = 0;
    velocity = 0;
    target = null;
    root.classList.add('is-carousel');
    measure();
    render();
    root.classList.add('is-ready');
    resizeObserver.observe(stage);
    startLoop();
  };

  const disable = () => {
    if (!enabled) return;
    enabled = false;
    stopLoop();
    resizeObserver.unobserve(stage);
    endDrag();
    pointerInside = false;
    snapPending = false;
    target = null;
    velocity = 0;

    slots.forEach((slot) => {
      slot.classList.remove('is-active');
      slot.style.removeProperty('transform');
      slot.style.removeProperty('opacity');
      slot.style.removeProperty('pointer-events');
    });

    stage.style.removeProperty('transform');
    root.classList.remove('is-carousel', 'is-ready', 'is-dragging');
    teardownRing();
  };

  const syncEnvironment = () => {
    if (shouldEnable()) enable();
    else disable();
  };

  const onEnvironmentChange = () => syncEnvironment();

  const onVisibilityChange = () => {
    if (document.hidden) stopLoop();
    else if (enabled && inView) startLoop();
  };

  const onPageHide = () => stopLoop();

  const resizeObserver = new ResizeObserver(() => {
    if (!enabled) return;
    measure();
    render();
  });

  const visibilityObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver(([entry]) => {
        inView = entry?.isIntersecting ?? true;
        if (!enabled) return;
        if (inView && !document.hidden) startLoop();
        else stopLoop();
      }, { rootMargin: '160px 0px' })
    : null;
  visibilityObserver?.observe(root);

  root.addEventListener('pointerenter', onPointerEnter);
  root.addEventListener('pointerleave', onPointerLeave);
  stage.addEventListener('pointerdown', onPointerDown);
  stage.addEventListener('pointermove', onPointerMove);
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  stage.addEventListener('dragstart', onDragStart);
  root.addEventListener('click', onClickCapture, true);
  root.addEventListener('focusin', onFocusIn);
  root.addEventListener('keydown', onKeyDown);
  window.addEventListener('portfolio:environment-change', onEnvironmentChange);
  document.addEventListener('visibilitychange', onVisibilityChange);
  window.addEventListener('pagehide', onPageHide);

  syncEnvironment();

  return {
    destroy() {
      root.removeEventListener('pointerenter', onPointerEnter);
      root.removeEventListener('pointerleave', onPointerLeave);
      stage.removeEventListener('pointerdown', onPointerDown);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerup', endDrag);
      stage.removeEventListener('pointercancel', endDrag);
      stage.removeEventListener('dragstart', onDragStart);
      root.removeEventListener('click', onClickCapture, true);
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('portfolio:environment-change', onEnvironmentChange);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      window.removeEventListener('pagehide', onPageHide);
      resizeObserver.disconnect();
      visibilityObserver?.disconnect();
      disable();
    }
  };
};
