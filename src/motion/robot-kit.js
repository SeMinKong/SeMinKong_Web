// SVG-space bearing centers: artwork, physics and static assembly share this contract.
const port = (id, family, polarity, x, y, normal) => ({ id, family, polarity, x, y, normal });
const up = -Math.PI / 2;
const down = Math.PI / 2;

export const ROBOT_GEOMETRY = Object.freeze({
  head: { width: 32, height: 34, ports: [port('neck', 'neck', 'plug', 16, 28, down)] },
  chest: { width: 68, height: 64, ports: [
    port('neck', 'neck', 'socket', 34, 6, up),
    port('waist', 'waist', 'socket', 34, 58, down),
    port('shoulder-left', 'shoulder', 'socket', 6, 16, Math.PI),
    port('shoulder-right', 'shoulder', 'socket', 62, 16, 0)
  ] },
  pelvis: { width: 48, height: 28, ports: [
    port('waist', 'waist', 'plug', 24, 6, up),
    port('hip-left', 'hip', 'socket', 8, 21, down),
    port('hip-right', 'hip', 'socket', 40, 21, down)
  ] },
  'upper-arm': { width: 22, height: 44, ports: [
    port('shoulder', 'shoulder', 'plug', 11, 7, up),
    port('elbow', 'elbow', 'socket', 11, 37, down)
  ] },
  forearm: { width: 24, height: 50, ports: [port('elbow', 'elbow', 'plug', 12, 7, up)] },
  thigh: { width: 30, height: 50, ports: [
    port('hip', 'hip', 'plug', 15, 7, up),
    port('knee', 'knee', 'socket', 15, 43, down)
  ] },
  shin: { width: 28, height: 58, ports: [port('knee', 'knee', 'plug', 14, 7, up)] }
});

const ROBOT_ASSEMBLY = [
  { id: 'chest', asset: 'chest', x: 0, y: 0, angle: 0 },
  { id: 'head', asset: 'head', parent: 'chest', socket: 'neck', plug: 'neck', angle: 0 },
  { id: 'pelvis', asset: 'pelvis', parent: 'chest', socket: 'waist', plug: 'waist', angle: 0 },
  { id: 'upper-arm-a', asset: 'upper-arm', parent: 'chest', socket: 'shoulder-left', plug: 'shoulder', angle: 0.17 },
  { id: 'upper-arm-b', asset: 'upper-arm', parent: 'chest', socket: 'shoulder-right', plug: 'shoulder', angle: -0.17 },
  { id: 'forearm-a', asset: 'forearm', parent: 'upper-arm-a', socket: 'elbow', plug: 'elbow', angle: 0 },
  { id: 'forearm-b', asset: 'forearm', parent: 'upper-arm-b', socket: 'elbow', plug: 'elbow', angle: 0 },
  { id: 'thigh-a', asset: 'thigh', parent: 'pelvis', socket: 'hip-left', plug: 'hip', angle: 0 },
  { id: 'thigh-b', asset: 'thigh', parent: 'pelvis', socket: 'hip-right', plug: 'hip', angle: 0 },
  { id: 'shin-a', asset: 'shin', parent: 'thigh-a', socket: 'knee', plug: 'knee', angle: 0 },
  { id: 'shin-b', asset: 'shin', parent: 'thigh-b', socket: 'knee', plug: 'knee', angle: 0 }
];

export const localRobotPort = (geometry, bearing, scale = 1) => ({
  ...bearing,
  x: (bearing.x - geometry.width / 2) * scale,
  y: (bearing.y - geometry.height / 2) * scale
});

export const getRobotAssembly = () => {
  const poses = new Map();
  const rotate = (point, angle) => ({
    x: point.x * Math.cos(angle) - point.y * Math.sin(angle),
    y: point.x * Math.sin(angle) + point.y * Math.cos(angle)
  });
  for (const piece of ROBOT_ASSEMBLY) {
    const geometry = ROBOT_GEOMETRY[piece.asset];
    let pose = { ...piece, ...geometry };
    if (piece.parent) {
      const parent = poses.get(piece.parent);
      const socket = rotate(localRobotPort(parent, parent.ports.find((p) => p.id === piece.socket)), parent.angle);
      const plug = rotate(localRobotPort(geometry, geometry.ports.find((p) => p.id === piece.plug)), piece.angle);
      pose = { ...pose, x: parent.x + socket.x - plug.x, y: parent.y + socket.y - plug.y };
    }
    poses.set(piece.id, pose);
  }
  return [...poses.values()];
};
