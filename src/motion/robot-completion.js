import Matter from 'matter-js';
import { Graphics } from 'pixi.js';
import { alignPosePositionToPort, clamp, rotatePoint, worldPort, wrapAngle } from './kinetic-math.js';
import { BOARD, INK, PAPER, SIGNAL } from './robot-config.js';

const { Body } = Matter;

export const easeOutCubic = (value) => 1 - Math.pow(1 - clamp(value, 0, 1), 3);
export const easeInOutCubic = (value) => {
  const progress = clamp(value, 0, 1);
  return progress < 0.5
    ? 4 * progress * progress * progress
    : 1 - Math.pow(-2 * progress + 2, 3) / 2;
};

const connectionEdge = (connection, fromBody) => connection.bodyA === fromBody
  ? { body: connection.bodyB, fromPort: connection.portA, toPort: connection.portB }
  : { body: connection.bodyA, fromPort: connection.portB, toPort: connection.portA };

const getBranch = ({ idToBody, bodyMeta }, parentBranch, parentBody, fromPort, childBody) => {
  if (parentBody === idToBody.get('chest') && fromPort.id === 'shoulder-left') return 'left-arm';
  if (parentBody === idToBody.get('chest') && fromPort.id === 'shoulder-right') return 'right-arm';
  if (parentBody === idToBody.get('pelvis') && fromPort.id === 'hip-left') return 'left-leg';
  if (parentBody === idToBody.get('pelvis') && fromPort.id === 'hip-right') return 'right-leg';
  if (bodyMeta.get(childBody).spec.asset === 'head') return 'head';
  if (bodyMeta.get(childBody).spec.asset === 'pelvis') return 'pelvis';
  return parentBranch;
};

const targetAngleFor = (asset, branch, raised) => {
  if (asset === 'chest') return -0.04;
  if (asset === 'head') return 0.09;
  if (asset === 'pelvis') return 0.02;
  if (asset === 'upper-arm') {
    if (branch === 'left-arm') return 0.17;
    return raised ? -2.62 : -0.17;
  }
  if (asset === 'forearm') {
    if (branch === 'left-arm') return -0.02;
    return raised ? -2.92 : 0.02;
  }
  if (asset === 'thigh') return branch === 'left-leg' ? 0.055 : -0.055;
  if (asset === 'shin') return branch === 'left-leg' ? -0.025 : 0.025;
  return 0;
};

const placePoseTargets = (targets, bodyMeta, { width, height, topBoundary }) => {
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const [body, pose] of targets) {
    const meta = bodyMeta.get(body);
    const radius = Math.hypot(meta.width, meta.height) / 2;
    minX = Math.min(minX, pose.x - radius);
    maxX = Math.max(maxX, pose.x + radius);
    minY = Math.min(minY, pose.y - radius);
    maxY = Math.max(maxY, pose.y + radius);
  }
  const poseWidth = maxX - minX;
  const poseHeight = maxY - minY;
  const margin = width <= 720 ? 14 : 26;
  const desiredCenterX = width - margin - poseWidth / 2;
  const desiredCenterY = width <= 820
    ? height - margin - poseHeight / 2
    : topBoundary + (height - topBoundary) * 0.55;
  const currentCenterX = (minX + maxX) / 2;
  const currentCenterY = (minY + maxY) / 2;
  const dx = clamp(desiredCenterX - currentCenterX, margin - minX, width - margin - maxX);
  const dy = clamp(
    desiredCenterY - currentCenterY,
    topBoundary + margin - minY,
    height - margin - maxY
  );
  for (const pose of targets.values()) {
    pose.x += dx;
    pose.y += dy;
  }
  return targets;
};

export const buildCompletionTargets = ({ bodyMeta, idToBody, connections }, viewport, raised = false) => {
  const chest = idToBody.get('chest');
  const targets = new Map([[chest, {
    x: 0,
    y: 0,
    angle: targetAngleFor('chest', 'root', raised)
  }]]);
  const branchByBody = new Map([[chest, 'root']]);
  const queue = [chest];
  while (queue.length) {
    const parent = queue.shift();
    const parentPose = targets.get(parent);
    const parentBranch = branchByBody.get(parent);
    for (const connection of connections) {
      if (connection.bodyA !== parent && connection.bodyB !== parent) continue;
      const edge = connectionEdge(connection, parent);
      if (targets.has(edge.body)) continue;
      const branch = getBranch({ idToBody, bodyMeta }, parentBranch, parent, edge.fromPort, edge.body);
      const childMeta = bodyMeta.get(edge.body);
      const angle = targetAngleFor(childMeta.spec.asset, branch, raised);
      const anchor = worldPort(parentPose, edge.fromPort);
      const childOffset = rotatePoint(edge.toPort, angle);
      targets.set(edge.body, {
        x: anchor.x - childOffset.x,
        y: anchor.y - childOffset.y,
        angle
      });
      branchByBody.set(edge.body, branch);
      queue.push(edge.body);
    }
  }
  return placePoseTargets(targets, bodyMeta, viewport);
};

export const applyCompletionBlend = ({ dynamicBodies, idToBody, connections }, fromTargets, toTargets, progress) => {
  for (const body of dynamicBodies) {
    const from = fromTargets.get(body);
    const to = toTargets.get(body);
    if (!from || !to) continue;
    Body.setPosition(body, {
      x: from.x + (to.x - from.x) * progress,
      y: from.y + (to.y - from.y) * progress
    });
    Body.setAngle(body, from.angle + wrapAngle(to.angle - from.angle) * progress);
    Body.setVelocity(body, { x: 0, y: 0 });
    Body.setAngularVelocity(body, 0);
  }
  const root = idToBody.get('chest');
  const visited = new Set(root ? [root] : []);
  const queue = root ? [root] : [];
  while (queue.length) {
    const parent = queue.shift();
    for (const connection of connections) {
      if (connection.bodyA !== parent && connection.bodyB !== parent) continue;
      const edge = connectionEdge(connection, parent);
      if (visited.has(edge.body)) continue;
      const aligned = alignPosePositionToPort(
        { x: edge.body.position.x, y: edge.body.position.y, angle: edge.body.angle },
        edge.toPort,
        { x: parent.position.x, y: parent.position.y, angle: parent.angle },
        edge.fromPort
      );
      Body.setPosition(edge.body, aligned);
      visited.add(edge.body);
      queue.push(edge.body);
    }
  }
};

// Effect objects are owned here; puzzle timing and input locking remain in the runtime.
export const createCelebrationEffects = (ambientLayer, effectLayer) => {
  const ambientGlow = new Graphics();
  const jointEffects = new Graphics();
  let particles = [];
  ambientLayer.addChild(ambientGlow);
  effectLayer.addChild(jointEffects);

  const start = () => {
    particles = Array.from({ length: 12 }, (_, index) => {
      const angle = -Math.PI * 0.88 + index / 11 * Math.PI * 0.76;
      const speed = 38 + (index % 4) * 9;
      const size = 2.4 + (index % 3) * 0.7;
      const graphic = new Graphics()
        .poly([0, -size, size * 0.72, 0, 0, size, -size * 0.72, 0])
        .fill({ color: [SIGNAL, INK, BOARD][index % 3], alpha: 0.92 });
      graphic.visible = false;
      effectLayer.addChild(graphic);
      return {
        graphic,
        spin: (index % 2 ? -1 : 1) * (1.7 + index * 0.07),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed
      };
    });
  };

  const clear = () => {
    ambientGlow.clear();
    jointEffects.clear();
    for (const particle of particles) particle.graphic.destroy();
    particles = [];
  };

  const update = (elapsed, chest, head, connections, scale) => {
    const glowProgress = clamp((elapsed - 180) / 620, 0, 1);
    const fade = 1 - clamp((elapsed - 1160) / 500, 0, 1);
    ambientGlow.clear();
    if (glowProgress > 0 && fade > 0) {
      ambientGlow
        .circle(chest.position.x, chest.position.y, 36 + glowProgress * 48)
        .fill({ color: PAPER, alpha: 0.075 * fade });
    }

    jointEffects.clear();
    connections.forEach((connection, index) => {
      const pulse = clamp((elapsed - 260 - index * 48) / 260, 0, 1);
      if (pulse <= 0 || pulse >= 1) return;
      const anchor = worldPort({
        x: connection.bodyA.position.x,
        y: connection.bodyA.position.y,
        angle: connection.bodyA.angle
      }, connection.portA);
      jointEffects.circle(anchor.x, anchor.y, 4 + Math.sin(pulse * Math.PI) * 4.5).stroke({
        color: SIGNAL,
        alpha: Math.sin(pulse * Math.PI) * 0.4,
        width: 1.5
      });
    });

    const particleTime = (elapsed - 720) / 1000;
    for (const particle of particles) {
      const visible = particleTime >= 0 && particleTime <= 1;
      particle.graphic.visible = visible;
      if (!visible) continue;
      particle.graphic.position.set(
        head.position.x + particle.vx * particleTime,
        head.position.y - 12 * scale + particle.vy * particleTime + 42 * particleTime * particleTime
      );
      particle.graphic.rotation = particle.spin * particleTime;
      particle.graphic.alpha = 1 - easeOutCubic(particleTime);
    }
  };

  return { start, clear, update };
};
