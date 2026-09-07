import { animate } from 'animejs';
import { Assets, Container, Graphics, Sprite } from 'pixi.js';
import { ROBOT_GEOMETRY } from './robot-kit.js';
import { getWorldLight } from './kinetic-math.js';
import { SHADOW, SIGNAL } from './robot-config.js';
import chestAssetUrl from '../assets/kinetic-robot/chest.svg?url';
import forearmAssetUrl from '../assets/kinetic-robot/forearm.svg?url';
import headAssetUrl from '../assets/kinetic-robot/head.svg?url';
import pelvisAssetUrl from '../assets/kinetic-robot/pelvis.svg?url';
import shinAssetUrl from '../assets/kinetic-robot/shin.svg?url';
import thighAssetUrl from '../assets/kinetic-robot/thigh.svg?url';
import upperArmAssetUrl from '../assets/kinetic-robot/upper-arm.svg?url';

export const ROBOT_TEXTURE_ALIASES = Object.freeze({
  head: 'kinetic-robot/head',
  chest: 'kinetic-robot/chest',
  pelvis: 'kinetic-robot/pelvis',
  'upper-arm': 'kinetic-robot/upper-arm',
  forearm: 'kinetic-robot/forearm',
  thigh: 'kinetic-robot/thigh',
  shin: 'kinetic-robot/shin'
});

const ROBOT_ASSETS = Object.freeze([
  ['head', headAssetUrl], ['chest', chestAssetUrl], ['pelvis', pelvisAssetUrl],
  ['upper-arm', upperArmAssetUrl], ['forearm', forearmAssetUrl],
  ['thigh', thighAssetUrl], ['shin', shinAssetUrl]
].map(([asset, src]) => ({
  alias: ROBOT_TEXTURE_ALIASES[asset], src,
  data: { width: ROBOT_GEOMETRY[asset].width, height: ROBOT_GEOMETRY[asset].height, resolution: 3, parseAsGraphicsContext: false }
})));

let robotTexturesPromise;
export const loadRobotTextures = () => {
  if (!robotTexturesPromise) {
    robotTexturesPromise = Assets.load(ROBOT_ASSETS).catch((error) => {
      robotTexturesPromise = null;
      throw error;
    });
  }
  return robotTexturesPromise;
};

const ROBOT_MATERIAL = { elevation: 6, shadowAlpha: 0.14 };

const createArtwork = (texture, width, height) => {
  const artwork = new Sprite(texture);
  artwork.anchor.set(0.5);
  artwork.scale.set(width / texture.width, height / texture.height);
  return artwork;
};

// Artwork owns the bearings. These rings exist only as contextual interaction feedback.
const createPortMarker = (port, scale) => {
  const marker = new Graphics()
    .circle(0, 0, 6 * scale)
    .stroke({ color: SIGNAL, alpha: 0.86, width: 1.05 * scale });
  marker.position.set(port.x, port.y);
  marker.alpha = 0;
  return marker;
};

export const createRobotView = (width, height, ports, scale, texture) => {
  const root = new Container();
  // The same alpha silhouette preserves the open rails and gripper gaps in every layer.
  const farShadow = createArtwork(texture, width, height);
  const nearShadow = createArtwork(texture, width, height);
  const artwork = createArtwork(texture, width, height);
  farShadow.tint = SHADOW;
  nearShadow.tint = SHADOW;
  const portMarkers = new Map();
  farShadow.alpha = 0;
  nearShadow.alpha = 0;
  root.addChild(artwork);
  for (const port of ports) {
    const marker = createPortMarker(port, scale);
    portMarkers.set(port.id, marker);
    root.addChild(marker);
  }
  return { farShadow, material: ROBOT_MATERIAL, nearShadow, portMarkers, root };
};

export const updateViewLighting = (view, pose, viewport) => {
  const light = getWorldLight(pose, viewport, view.material.elevation);
  view.farShadow.position.set(pose.x + light.farShadow.x, pose.y + light.farShadow.y);
  view.nearShadow.position.set(pose.x + light.nearShadow.x, pose.y + light.nearShadow.y);
  view.farShadow.rotation = pose.angle;
  view.nearShadow.rotation = pose.angle;
  view.farShadow.alpha = view.material.shadowAlpha * 0.28 * light.intensity;
  view.nearShadow.alpha = view.material.shadowAlpha * 0.62 * light.intensity;
  view.root.position.set(pose.x, pose.y);
  view.root.rotation = pose.angle;
};

// A sleeping scene requests a render without restarting its physics ticker.
export const createPortHints = (stage, bodyToView, renderHints) => {
  let hintedMarkers = new Set();
  const hintAnimations = new Map();
  const setPortHints = (entries = [], intent = 'none', immediate = false) => {
    const next = new Set(entries.map(([body, port]) => bodyToView.get(body)?.portMarkers.get(port.id)).filter(Boolean));
    if (stage.dataset.kineticIntent !== intent) stage.dataset.kineticIntent = intent;
    for (const marker of new Set([...hintedMarkers, ...next])) {
      if (!immediate && hintedMarkers.has(marker) === next.has(marker)) continue;
      hintAnimations.get(marker)?.cancel();
      hintAnimations.delete(marker);
      const alpha = next.has(marker) ? 1 : 0;
      if (immediate) marker.alpha = alpha;
      else hintAnimations.set(marker, animate(marker, {
        alpha, duration: 140, ease: 'outQuad', onUpdate: renderHints,
        onComplete: () => hintAnimations.delete(marker)
      }));
    }
    hintedMarkers = next;
    if (immediate) {
      for (const [marker, animation] of hintAnimations) {
        animation.cancel();
        marker.alpha = 0;
      }
      hintAnimations.clear();
      renderHints();
    }
  };
  return setPortHints;
};
