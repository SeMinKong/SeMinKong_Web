import Matter from 'matter-js';
import { evaluatePortSnap, rotatePoint, solveMovingPortPose, worldPort, wrapAngle } from './kinetic-math.js';
import { SNAP_DWELL, SNAP_DURATION } from './robot-config.js';

const { Body, Sleeping } = Matter;
const poseOf = (body) => ({ ...body.position, angle: body.angle });
const portKey = (body, port) => `${body.id}:${port.id}`;
const samePair = (a, b) => a && b && a.movingBody === b.movingBody
  && a.targetBody === b.targetBody && a.movingPort === b.movingPort && a.targetPort === b.targetPort;

// Rigid interpolation keeps previously assembled joints together at every step.
export const blendSnapPose = (pose, pivot, solved, progress) => {
  const rotation = solved.deltaAngle * progress;
  const offset = rotatePoint({ x: pose.x - pivot.x, y: pose.y - pivot.y }, rotation);
  return {
    x: pivot.x + (solved.x - pivot.x) * progress + offset.x,
    y: pivot.y + (solved.y - pivot.y) * progress + offset.y,
    angle: pose.angle + rotation
  };
};

// The fixed physics clock owns capture timing and body poses. Rendering only
// reads progress; it never animates a Matter body independently.
export const createRobotSnap = ({
  dynamicBodies, bodyMeta, occupiedPorts, getComponent, getTuning, getPointer,
  canPlace, onStart, onConnect, onCancel, onProgress
}) => {
  let hint = null;
  let steady = null;
  let capture = null;

  const restoreCollisionGroups = (state) => {
    for (const [body, group] of state.groups) body.collisionFilter.group = group;
  };

  const available = (pair) => pair
    && pair.movingPort.family === pair.targetPort.family
    && pair.movingPort.polarity !== pair.targetPort.polarity
    && !occupiedPorts.has(portKey(pair.movingBody, pair.movingPort))
    && !occupiedPorts.has(portKey(pair.targetBody, pair.targetPort))
    && !getComponent(pair.movingBody).includes(pair.targetBody);

  const evaluate = (pair, distance, angle) => available(pair) && evaluatePortSnap(
    poseOf(pair.movingBody), pair.movingPort, poseOf(pair.targetBody), pair.targetPort,
    { maxDistance: distance, maxAngle: angle }
  );

  const find = (root, distance, angle, preferred = hint) => {
    const component = getComponent(root);
    if (preferred && component.includes(preferred.movingBody)
      && evaluate(preferred, distance, angle)?.eligible) return preferred;
    const componentSet = new Set(component);
    let best = null;
    for (const movingBody of component) {
      for (const movingPort of bodyMeta.get(movingBody).ports) {
        if (occupiedPorts.has(portKey(movingBody, movingPort))) continue;
        for (const targetBody of dynamicBodies) {
          if (componentSet.has(targetBody)) continue;
          for (const targetPort of bodyMeta.get(targetBody).ports) {
            const pair = { movingBody, movingPort, targetBody, targetPort };
            const result = evaluate(pair, distance, angle);
            if (!result?.eligible) continue;
            const score = result.distance + result.angleError * 16;
            if (!best || score < best.score) best = { ...pair, score };
          }
        }
      }
    }
    return best;
  };

  const reset = () => {
    const interrupted = capture;
    capture = hint = steady = null;
    onProgress(null);
    if (interrupted) {
      restoreCollisionGroups(interrupted);
      onCancel();
    }
  };

  const begin = (pair) => {
    const tuning = getTuning();
    if (!evaluate(pair, tuning.distance, tuning.angle)?.eligible) return false;
    const pivot = poseOf(pair.movingBody);
    const poses = new Map(getComponent(pair.movingBody).map((body) => [body, poseOf(body)]));
    const solved = solveMovingPortPose(pivot, pair.movingPort, poseOf(pair.targetBody), pair.targetPort);
    // Check the entire arc, including long, already connected branches.
    if ([0.25, 0.5, 0.75, 1].some((progress) => !canPlace(new Map(
      [...poses].map(([body, pose]) => [body, blendSnapPose(pose, pivot, solved, progress)])
    ), pair))) return false;
    const pointer = getPointer();
    const anchor = worldPort(pivot, pair.movingPort);
    const groups = new Map([...poses.keys(), ...getComponent(pair.targetBody)]
      .map((body) => [body, body.collisionFilter.group]));
    const captureGroup = Body.nextGroup(true);
    for (const body of groups.keys()) body.collisionFilter.group = captureGroup;
    capture = {
      pair, poses, pivot, groups, targetPose: poseOf(pair.targetBody), elapsed: 0,
      pointerOffset: pointer ? { x: anchor.x - pointer.target.x, y: anchor.y - pointer.target.y } : null
    };
    steady = null;
    hint = pair;
    onStart();
    return true;
  };

  const request = (root) => {
    if (capture) return true;
    const tuning = getTuning();
    const shown = hint && getComponent(root).includes(hint.movingBody) ? hint : null;
    return begin(shown ?? find(root, tuning.distance, tuning.angle));
  };

  const advanceCapture = (delta) => {
    const { pair, pivot, poses, pointerOffset, targetPose } = capture;
    const tuning = getTuning();
    const target = worldPort(poseOf(pair.targetBody), pair.targetPort);
    const pointer = getPointer();
    const movedAway = pointer && pointerOffset && Math.hypot(
      pointer.target.x + pointerOffset.x - target.x,
      pointer.target.y + pointerOffset.y - target.y
    ) > tuning.distance + tuning.exitMargin;
    const targetMoved = Math.hypot(
      pair.targetBody.position.x - targetPose.x, pair.targetBody.position.y - targetPose.y
    ) > tuning.exitMargin || Math.abs(wrapAngle(pair.targetBody.angle - targetPose.angle))
      > tuning.hintAngle - tuning.angle;
    const component = getComponent(pair.movingBody);
    const changedBranch = component.length !== poses.size || component.some((body) => !poses.has(body));
    if (!available(pair) || movedAway || targetMoved || changedBranch
      || pointer?.skipSnapUntilRelease || pointer?.flexConnection) { reset(); return; }
    capture.elapsed = Math.min(SNAP_DURATION, capture.elapsed + delta);
    const progress = capture.elapsed / SNAP_DURATION;
    const eased = 1 - (1 - progress) ** 3;
    const solved = solveMovingPortPose(pivot, pair.movingPort, poseOf(pair.targetBody), pair.targetPort);
    const next = new Map([...poses].map(([body, pose]) => [body, blendSnapPose(pose, pivot, solved, eased)]));
    if (!canPlace(next, pair)) { reset(); return; }
    for (const [body, pose] of next) {
      Body.setPosition(body, pose);
      Body.setAngle(body, pose.angle);
      Body.setVelocity(body, { x: 0, y: 0 });
      Body.setAngularVelocity(body, 0);
      body.constraintImpulse.x = body.constraintImpulse.y = body.constraintImpulse.angle = 0;
      body.positionImpulse.x = body.positionImpulse.y = 0;
      Sleeping.set(body, false);
    }
    onProgress({ pair, progress });
    if (progress === 1) {
      restoreCollisionGroups(capture);
      capture = hint = steady = null;
      onConnect(pair);
    }
  };

  const update = (delta) => {
    if (capture) { advanceCapture(delta); return; }
    const pointer = getPointer();
    if (!pointer || pointer.phase !== 'dragging' || pointer.flexConnection
      || pointer.skipSnapUntilRelease || pointer.snappedDuringDrag) {
      hint = steady = null;
      return;
    }
    const tuning = getTuning();
    hint = find(pointer.body, tuning.distance, tuning.angle)
      ?? find(pointer.body, tuning.hintDistance, tuning.hintAngle);
    if (!evaluate(hint, tuning.distance, tuning.angle)?.eligible) { steady = null; return; }
    if (!samePair(steady?.pair, hint) || Math.hypot(
      pointer.target.x - steady.point.x, pointer.target.y - steady.point.y
    ) > tuning.steadyTravel) {
      steady = { pair: hint, point: { ...pointer.target }, elapsed: 0 };
    }
    steady.elapsed += delta;
    if (steady.elapsed >= SNAP_DWELL && !begin(hint)) steady = null;
  };

  return {
    update, request, reset,
    get active() { return !!capture; },
    get hint() { return hint; },
    controls: (body) => capture?.poses.has(body) ?? false
  };
};
