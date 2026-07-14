import { animate, createTimeline } from 'animejs';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const springStep = (value, velocity, target, dt, stiffness = 120, damping = 19) => {
  const acceleration = ((target - value) * stiffness) - (velocity * damping);
  const nextVelocity = velocity + (acceleration * dt);
  return [value + (nextVelocity * dt), nextVelocity];
};

const poses = [
  {
    time: 0,
    cube: { x: 0, y: 8, rx: -18, ry: 28, rz: 8 },
    hand: { y: 0, rz: -0.6 },
    joints: [[-3, 0, -2], [0, 4, 4], [0, 2, 2], [0, 0, 0], [0, -2, -2]],
    tension: [0.92, 0.9, 0.84, 0.5, 0.42],
    bus: 0.58
  },
  {
    time: 2200,
    cube: { x: 8, y: 2, rx: 28, ry: 118, rz: 24 },
    hand: { y: -2, rz: 0.5 },
    joints: [[-9, 0, -8], [-2, 1, 1], [2, 4, 3], [-2, -2, -2], [-3, -4, -3]],
    tension: [0.98, 0.85, 0.72, 0.6, 0.5],
    bus: 0.72
  },
  {
    time: 4800,
    cube: { x: 2, y: 8, rx: 92, ry: 202, rz: -14 },
    hand: { y: 1, rz: -0.2 },
    joints: [[-1, 0, -1], [-5, -2, -2], [4, 7, 6], [3, 4, 3], [2, 2, 2]],
    tension: [0.7, 0.45, 0.9, 0.95, 0.88],
    bus: 0.82
  },
  {
    time: 7400,
    cube: { x: -8, y: 4, rx: 180, ry: 296, rz: 30 },
    hand: { y: -1, rz: 0.7 },
    joints: [[1, 0, 1], [6, 10, 8], [1, 3, 2], [-3, -3, -2], [-2, -3, -2]],
    tension: [0.55, 0.98, 0.86, 0.7, 0.58],
    bus: 0.68
  },
  {
    time: 9600,
    cube: { x: 0, y: 8, rx: 342, ry: 388, rz: 8 },
    hand: { y: 0, rz: -0.6 },
    joints: [[-3, 0, -2], [0, 4, 4], [0, 2, 2], [0, 0, 0], [0, -2, -2]],
    tension: [0.92, 0.9, 0.84, 0.5, 0.42],
    bus: 0.58
  }
];

export const initDexterousHand = (environment) => {
  const root = document.querySelector('[data-dexterous-hand]');
  const scene = root?.querySelector('[data-hand-scene]');
  const cube = root?.querySelector('[data-hand-cube]');
  const cubeFloat = root?.querySelector('[data-cube-float]');
  const cubeInteractive = root?.querySelector('[data-cube-interactive]');
  const cubeImpulse = root?.querySelector('[data-cube-impulse]');
  const cubeAxisX = root?.querySelector('[data-cube-axis-x]');
  const cubeAxisY = root?.querySelector('[data-cube-axis-y]');
  const cubeBody = root?.querySelector('[data-cube-body]');
  const handIdle = root?.querySelector('[data-hand-idle]');

  if (!root || !scene || !cube || !cubeFloat || !cubeInteractive || !cubeImpulse || !cubeAxisX || !cubeAxisY || !cubeBody || !handIdle) return;

  const fingerStates = Array.from(root.querySelectorAll('[data-hand-finger]')).map((response) => {
    const mount = response.closest('.robot-digit');
    return {
      response,
      mount,
      tip: mount?.querySelector('.robot-link--distal') || response,
      tendons: mount ? Array.from(mount.querySelectorAll('[data-hand-tendon]')) : [],
      direction: Number(response.dataset.flexDirection) || 1,
      weight: Number(response.dataset.flexWeight) || 1,
      x: 0,
      y: 0,
      value: 0,
      velocity: 0,
      target: 0
    };
  }).filter((finger) => finger.mount);

  const fingerTendons = new Set(fingerStates.flatMap((finger) => finger.tendons));
  const structuralTendons = Array.from(root.querySelectorAll('[data-hand-tendon]'))
    .filter((tendon) => !fingerTendons.has(tendon));

  let manipulation = null;
  let cubeFeedback = null;
  let feedbackTimer = 0;
  let visible = true;
  let frame = 0;
  let lastTime = 0;
  let geometry = null;
  let geometryFrame = 0;
  let geometryUpdatedAt = 0;

  const cubeState = {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    targetX: 0,
    targetY: 0
  };

  const setManipulationSpeed = (speed) => {
    if (manipulation) manipulation.speed = speed;
  };

  const renderInteraction = () => {
    cubeInteractive.style.setProperty('--cube-x', `${cubeState.x.toFixed(2)}px`);
    cubeInteractive.style.setProperty('--cube-y', `${cubeState.y.toFixed(2)}px`);
    fingerStates.forEach((finger) => {
      finger.response.style.setProperty('--finger-flex', `${finger.value.toFixed(2)}deg`);
    });
  };

  const resetInteraction = (immediate = false) => {
    cubeState.targetX = 0;
    cubeState.targetY = 0;
    fingerStates.forEach((finger) => {
      finger.target = 0;
    });
    setManipulationSpeed(1);

    if (!immediate) return;

    cubeState.x = 0;
    cubeState.y = 0;
    cubeState.vx = 0;
    cubeState.vy = 0;
    fingerStates.forEach((finger) => {
      finger.value = 0;
      finger.velocity = 0;
    });
    renderInteraction();
  };

  const tick = (time) => {
    frame = 0;
    if (!visible || document.hidden || environment.motion === 'reduced') return;

    const dt = Math.min(0.05, Math.max(0.001, (time - (lastTime || time)) / 1000));
    lastTime = time;

    [cubeState.x, cubeState.vx] = springStep(cubeState.x, cubeState.vx, cubeState.targetX, dt, 112, 19);
    [cubeState.y, cubeState.vy] = springStep(cubeState.y, cubeState.vy, cubeState.targetY, dt, 112, 19);

    let moving =
      Math.abs(cubeState.targetX - cubeState.x) > 0.01 ||
      Math.abs(cubeState.targetY - cubeState.y) > 0.01 ||
      Math.abs(cubeState.vx) > 0.02 ||
      Math.abs(cubeState.vy) > 0.02;

    fingerStates.forEach((finger) => {
      [finger.value, finger.velocity] = springStep(finger.value, finger.velocity, finger.target, dt, 132, 21);
      if (Math.abs(finger.target - finger.value) > 0.01 || Math.abs(finger.velocity) > 0.02) moving = true;
    });

    renderInteraction();
    if (moving) frame = requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (frame || !visible || document.hidden || environment.motion === 'reduced') return;
    lastTime = 0;
    frame = requestAnimationFrame(tick);
  };

  const applyPose = (pose) => {
    cubeFloat.style.transform = `translate3d(${pose.cube.x}px, ${pose.cube.y}px, 0)`;
    cubeAxisX.style.transform = `rotateX(${pose.cube.rx}deg)`;
    cubeAxisY.style.transform = `rotateY(${pose.cube.ry}deg)`;
    cubeBody.style.transform = `rotateZ(${pose.cube.rz}deg)`;
    handIdle.style.transform = `translate3d(0, ${pose.hand.y}px, 0) rotateZ(${pose.hand.rz}deg)`;

    fingerStates.forEach((finger, index) => {
      const joints = pose.joints[index] || [0, 0, 0];
      finger.mount.style.setProperty('--proximal-cycle', `${joints[0]}deg`);
      finger.mount.style.setProperty('--middle-cycle', `${joints[1]}deg`);
      finger.mount.style.setProperty('--distal-cycle', `${joints[2]}deg`);
      finger.tendons.forEach((tendon) => {
        tendon.style.opacity = String(pose.tension[index] ?? 0.62);
      });
    });

    structuralTendons.forEach((tendon) => {
      tendon.style.opacity = String(pose.bus);
    });
  };

  const clearTransient = () => {
    cubeFeedback?.revert?.();
    cubeFeedback = null;
    if (feedbackTimer) window.clearTimeout(feedbackTimer);
    feedbackTimer = 0;
    resetInteraction(true);
  };

  const clearMotion = () => {
    manipulation?.revert?.();
    manipulation = null;
    clearTransient();
  };

  const addSegment = (timeline, from, to, duration, offset) => {
    const ease = 'inOut(3)';

    timeline
      .add(cubeFloat, {
        x: [from.cube.x, to.cube.x],
        y: [from.cube.y, to.cube.y],
        duration,
        ease
      }, offset)
      .add(cubeAxisX, {
        rotateX: [`${from.cube.rx}deg`, `${to.cube.rx}deg`],
        duration,
        ease
      }, offset)
      .add(cubeAxisY, {
        rotateY: [`${from.cube.ry}deg`, `${to.cube.ry}deg`],
        duration,
        ease
      }, offset)
      .add(cubeBody, {
        rotateZ: [`${from.cube.rz}deg`, `${to.cube.rz}deg`],
        duration,
        ease
      }, offset)
      .add(handIdle, {
        y: [from.hand.y, to.hand.y],
        rotateZ: [`${from.hand.rz}deg`, `${to.hand.rz}deg`],
        duration,
        ease
      }, offset);

    fingerStates.forEach((finger, index) => {
      const fromJoints = from.joints[index] || [0, 0, 0];
      const toJoints = to.joints[index] || [0, 0, 0];
      timeline.add(finger.mount, {
        '--proximal-cycle': [`${fromJoints[0]}deg`, `${toJoints[0]}deg`],
        '--middle-cycle': [`${fromJoints[1]}deg`, `${toJoints[1]}deg`],
        '--distal-cycle': [`${fromJoints[2]}deg`, `${toJoints[2]}deg`],
        duration,
        ease
      }, offset);

      if (finger.tendons.length) {
        timeline.add(finger.tendons, {
          opacity: [from.tension[index], to.tension[index]],
          duration,
          ease
        }, offset);
      }
    });

    if (structuralTendons.length) {
      timeline.add(structuralTendons, {
        opacity: [from.bus, to.bus],
        duration,
        ease
      }, offset);
    }
  };

  const buildMotion = () => {
    clearMotion();
    applyPose(poses[0]);
    if (environment.motion === 'reduced') return;

    const timeScale = environment.motion === 'full' ? 1 : 1.5;
    manipulation = createTimeline({ autoplay: false, loop: true });

    for (let index = 1; index < poses.length; index += 1) {
      const from = poses[index - 1];
      const to = poses[index];
      addSegment(
        manipulation,
        from,
        to,
        (to.time - from.time) * timeScale,
        from.time * timeScale
      );
    }

    if (visible && !document.hidden) manipulation.resume();
    requestGeometryUpdate();
  };

  const cacheGeometry = () => {
    if (geometryFrame) cancelAnimationFrame(geometryFrame);
    geometryFrame = 0;
    const sceneRect = scene.getBoundingClientRect();
    const cubeRect = cubeImpulse.getBoundingClientRect();
    geometry = {
      scene: sceneRect,
      cube: {
        x: cubeRect.left + (cubeRect.width / 2),
        y: cubeRect.top + (cubeRect.height / 2),
        radius: Math.max(52, Math.max(cubeRect.width, cubeRect.height) * 1.55)
      },
      fingers: fingerStates.map((finger) => {
        const rect = finger.tip.getBoundingClientRect();
        return {
          x: rect.left + (rect.width / 2),
          y: rect.top + (rect.height / 2),
          radius: Math.max(28, Math.max(rect.width, rect.height) * 1.65)
        };
      })
    };
    geometryUpdatedAt = performance.now();
  };

  function requestGeometryUpdate() {
    if (geometryFrame) cancelAnimationFrame(geometryFrame);
    geometryFrame = requestAnimationFrame(cacheGeometry);
  }

  const getPointerGeometry = (event, forceRefresh = false) => {
    if (forceRefresh || !geometry || performance.now() - geometryUpdatedAt > 120) cacheGeometry();
    if (!geometry) return null;
    const dx = event.clientX - geometry.cube.x;
    const dy = event.clientY - geometry.cube.y;
    const distance = Math.hypot(dx, dy);
    return { dx, dy, distance, force: clamp(1 - (distance / geometry.cube.radius), 0, 1) };
  };

  const onPointerMove = (event) => {
    if (environment.depth !== 'interactive' || environment.motion === 'reduced' || event.pointerType === 'touch') return;
    const pointer = getPointerGeometry(event);
    if (!pointer) return;

    if (pointer.force > 0) {
      cubeState.targetX = clamp((-pointer.dx / geometry.cube.radius) * 8 * pointer.force, -8, 8);
      cubeState.targetY = clamp((-pointer.dy / geometry.cube.radius) * 6 * pointer.force, -6, 6);
      setManipulationSpeed(0.78);
    } else {
      cubeState.targetX = 0;
      cubeState.targetY = 0;
      setManipulationSpeed(1);
    }

    fingerStates.forEach((finger, index) => {
      const hit = geometry.fingers[index];
      const proximity = hit
        ? clamp(1 - (Math.hypot(event.clientX - hit.x, event.clientY - hit.y) / hit.radius), 0, 1)
        : 0;
      finger.target = finger.direction * ((pointer.force * 3.5) - (proximity * 6.5)) * finger.weight;
    });
    schedule();
  };

  const onPointerLeave = () => {
    resetInteraction();
    schedule();
  };

  const onPointerDown = (event) => {
    if (environment.depth !== 'interactive' || environment.motion === 'reduced' || event.pointerType === 'touch' || event.button !== 0) return;
    const pointer = getPointerGeometry(event, true);
    if (!pointer) return;

    let nearestFinger = null;
    geometry.fingers.forEach((hit, index) => {
      const distance = Math.hypot(event.clientX - hit.x, event.clientY - hit.y);
      const score = distance / hit.radius;
      if (!nearestFinger || score < nearestFinger.score) nearestFinger = { index, distance, score };
    });

    const cubeScore = pointer.distance / geometry.cube.radius;
    let handled = false;

    if (cubeScore <= 1 && (!nearestFinger || cubeScore <= nearestFinger.score)) {
      const direction = pointer.dx >= 0 ? -1 : 1;
      cubeFeedback?.revert?.();
      cubeFeedback = animate(cubeImpulse, {
        x: [0, direction * 7, -direction * 2, 0],
        y: [0, -6, 1, 0],
        rotateX: ['0deg', `${direction * 9}deg`, '0deg'],
        rotateZ: ['0deg', `${direction * 14}deg`, `${-direction * 4}deg`, '0deg'],
        duration: 560,
        ease: 'out(3)'
      });
      setManipulationSpeed(0.62);
      handled = true;
    } else if (nearestFinger && nearestFinger.score <= 1.35) {
        const finger = fingerStates[nearestFinger.index];
        finger.target = -finger.direction * 9 * finger.weight;
        finger.velocity += -finger.direction * 18 * finger.weight;
        handled = true;
    }

    if (!handled) return;

    if (feedbackTimer) window.clearTimeout(feedbackTimer);
    feedbackTimer = window.setTimeout(() => {
      resetInteraction();
      schedule();
    }, 620);
    schedule();
  };

  const pauseMotion = () => {
    manipulation?.pause?.();
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  };

  const resumeMotion = () => {
    if (!visible || document.hidden || environment.motion === 'reduced') return;
    manipulation?.resume?.();
  };

  scene.addEventListener('pointerenter', requestGeometryUpdate, { passive: true });
  scene.addEventListener('pointermove', onPointerMove, { passive: true });
  scene.addEventListener('pointerleave', onPointerLeave, { passive: true });
  scene.addEventListener('pointercancel', onPointerLeave, { passive: true });
  scene.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('resize', requestGeometryUpdate, { passive: true });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) {
        requestGeometryUpdate();
        resumeMotion();
      } else {
        pauseMotion();
        clearTransient();
      }
    }, { rootMargin: '8% 0px' });
    observer.observe(root);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pauseMotion();
      clearTransient();
    } else {
      requestGeometryUpdate();
      resumeMotion();
    }
  });

  window.addEventListener('pagehide', () => {
    pauseMotion();
    clearTransient();
  });
  window.addEventListener('pageshow', () => {
    requestGeometryUpdate();
    resumeMotion();
  });
  window.addEventListener('portfolio:environment-change', buildMotion);

  resetInteraction(true);
  buildMotion();
};
