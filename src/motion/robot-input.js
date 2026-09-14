// Browser gesture ownership is decided at touch start. Separate moving targets
// let parts accept two-dimensional dragging while the empty canvas keeps pan-y.
export const createRobotInput = ({ stage, canvas, partIds, onDown, onMove, onUp, onCancel, onHover, onLeave }) => {
  const layer = document.createElement('div');
  layer.className = 'kinetic-stage__targets';
  layer.setAttribute('aria-hidden', 'true');
  const targets = new Map();
  const layouts = new Map();
  for (const id of partIds) {
    const target = document.createElement('div');
    target.className = 'kinetic-stage__target';
    target.dataset.robotPart = id;
    layer.append(target);
    targets.set(id, target);
  }
  stage.append(layer);

  const touches = new Set();
  let owner = null;
  let blocked = false;
  let nativeTouchCount = 0;
  let destroyed = false;
  const release = () => {
    const previous = owner;
    owner = null;
    if (previous?.element.hasPointerCapture?.(previous.id)) {
      try { previous.element.releasePointerCapture(previous.id); } catch { /* The UA may already have cancelled it. */ }
    }
  };
  const cancel = () => {
    release();
    onCancel();
  };
  const trackTouch = (event) => {
    if (event.pointerType !== 'touch') return;
    touches.add(event.pointerId);
    if (touches.size > 1 && !blocked) {
      blocked = true;
      cancel();
    }
  };
  const endTouch = (event) => {
    if (event.pointerType !== 'touch') return;
    touches.delete(event.pointerId);
    if (!touches.size && !nativeTouchCount) blocked = false;
  };
  // Pinch emits pointercancel and may never emit pointerup. Native touchend
  // remains available, so keep the gate closed until the actual last finger lifts.
  const trackNativeTouches = (event) => {
    nativeTouchCount = event.touches.length;
    if (nativeTouchCount > 1 && !blocked) {
      blocked = true;
      cancel();
    } else if (!nativeTouchCount) {
      touches.clear();
      blocked = false;
    }
  };
  const down = (event) => {
    if (destroyed || blocked || owner || (event.pointerType === 'touch' && !event.isPrimary)) return;
    const target = event.target.closest?.('[data-robot-part]');
    const partId = target && targets.get(target.dataset.robotPart) === target ? target.dataset.robotPart : null;
    // A canvas hit has pan-y semantics. Only a pre-existing part target may
    // start a touch drag; changing touch-action here would be too late.
    if (event.pointerType === 'touch' && !partId) return;
    if (!onDown(event, partId)) return;
    const element = target ?? canvas;
    owner = { id: event.pointerId, element };
    try { element.setPointerCapture(event.pointerId); } catch { /* Window listeners still receive uncaptured input. */ }
  };
  const move = (event) => {
    if (!blocked && owner?.id === event.pointerId) onMove(event);
  };
  const up = (event) => {
    if (owner?.id === event.pointerId) {
      release();
      if (!blocked) onUp(event);
    }
    endTouch(event);
  };
  const pointerCancel = (event) => {
    if (owner?.id === event.pointerId) cancel();
    endTouch(event);
  };
  const lostCapture = (event) => {
    if (owner?.id === event.pointerId) cancel();
  };
  const blur = () => { touches.clear(); nativeTouchCount = 0; blocked = false; cancel(); };
  const bindings = [
    [document, 'pointerdown', trackTouch, { passive: true, capture: true }],
    [document, 'touchstart', trackNativeTouches], [document, 'touchend', trackNativeTouches],
    [document, 'touchcancel', trackNativeTouches],
    [layer, 'pointerdown', down], [canvas, 'pointerdown', down],
    [layer, 'pointermove', onHover], [canvas, 'pointermove', onHover],
    [layer, 'pointerleave', onLeave], [canvas, 'pointerleave', onLeave],
    [layer, 'lostpointercapture', lostCapture], [canvas, 'lostpointercapture', lostCapture],
    [window, 'pointermove', move], [window, 'pointerup', up],
    [window, 'pointercancel', pointerCancel], [window, 'blur', blur]
  ];
  for (const [element, type, listener, options = { passive: true }] of bindings) {
    element.addEventListener(type, listener, options);
  }
  return {
    sync(id, pose, width, height, coarse) {
      const target = targets.get(id);
      if (!target) return;
      const padding = coarse ? 8 : 0;
      const next = { width: width + padding * 2, height: height + padding * 2,
        x: pose.x, y: pose.y, angle: pose.angle };
      const previous = layouts.get(id);
      if (previous?.width !== next.width) target.style.width = `${next.width}px`;
      if (previous?.height !== next.height) target.style.height = `${next.height}px`;
      if (previous?.x !== next.x || previous?.y !== next.y || previous?.angle !== next.angle) {
        target.style.transform = `translate(${pose.x}px, ${pose.y}px) rotate(${pose.angle}rad) translate(-50%, -50%)`;
      }
      layouts.set(id, next);
    },
    reset(clearTouches = false) {
      release();
      if (clearTouches) { touches.clear(); nativeTouchCount = 0; blocked = false; }
    },
    destroy() {
      destroyed = true;
      release();
      touches.clear();
      for (const [element, type, listener, options = { passive: true }] of bindings) {
        element.removeEventListener(type, listener, options);
      }
      layer.remove();
      targets.clear();
      layouts.clear();
    }
  };
};

export const isRobotTap = ({ pointerType, maxTravel, startedAt }, now) => (
  maxTravel < 6 && (pointerType !== 'touch' || now - startedAt <= 250)
);

export const getRobotReleaseTuning = (touch) => touch
  ? { maxSpeed: 5.5, pointerWeight: 0.55, torqueScale: 0.0003, maxSpin: 0.045 }
  : { maxSpeed: 11.5, pointerWeight: 0.8, torqueScale: 0.00062, maxSpin: 0.11 };
