export const MAX_LITE_BLOBS = 6;

const VERTEX_SHADER = `#version 300 es
precision highp float;

out vec2 vUv;

void main() {
  vec2 position = vec2(
    (gl_VertexID == 1) ? 3.0 : -1.0,
    (gl_VertexID == 2) ? 3.0 : -1.0
  );
  vUv = position * 0.5 + 0.5;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 outColor;

uniform vec2 uResolution;
uniform float uTime;
uniform vec4 uBlobs[${MAX_LITE_BLOBS}];
uniform int uBlobCount;
uniform vec2 uPointer;
uniform vec2 uPointerVelocity;
uniform float uPointerEnergy;
uniform vec4 uQuiet;
uniform vec4 uImpulse;
uniform float uScroll;
uniform vec3 uPaper;
uniform vec3 uRaisedPaper;
uniform vec3 uInk;
uniform vec3 uSignal;
uniform float uIntensity;

float hash(vec2 point) {
  return fract(sin(dot(point, vec2(127.1, 311.7))) * 43758.5453123);
}

vec2 fluidWarp(vec2 point, float time) {
  vec2 broad = vec2(
    sin((point.y * 3.7) + time) + sin(((point.x + point.y) * 2.15) - (time * 0.7)),
    cos((point.x * 3.2) - (time * 0.82)) + sin(((point.x - point.y) * 2.6) + (time * 0.55))
  );
  vec2 detail = vec2(
    sin(((point.y + broad.y * 0.08) * 7.1) - (time * 0.36)),
    cos(((point.x + broad.x * 0.08) * 6.4) + (time * 0.31))
  );
  return (broad * 0.38) + (detail * 0.12);
}

float roundedBoxSdf(vec2 point, vec2 halfSize, float radius) {
  vec2 edge = abs(point) - halfSize + radius;
  return min(max(edge.x, edge.y), 0.0) + length(max(edge, 0.0)) - radius;
}

vec2 safeNormalize(vec2 value) {
  return value * inversesqrt(max(dot(value, value), 0.0001));
}

float currentBand(vec2 point, float offset, float width, float phase) {
  float center = offset
    + sin((point.x * 2.25) + phase) * 0.105
    + sin((point.x * 5.4) - (phase * 0.7)) * 0.034;
  return 1.0 - smoothstep(width, width + 0.105, abs(point.y - center));
}

void main() {
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 point = vec2((vUv.x - 0.5) * aspect, vUv.y - 0.5);
  vec2 pointer = vec2((uPointer.x - 0.5) * aspect, uPointer.y - 0.5);
  vec2 pointerVelocity = vec2(uPointerVelocity.x * aspect, uPointerVelocity.y);
  vec2 quietCenter = vec2((uQuiet.x - 0.5) * aspect, uQuiet.y - 0.5);
  vec2 quietHalfSize = vec2(uQuiet.z * aspect, uQuiet.w);

  vec2 firstWarp = fluidWarp(point * 1.18, uTime * 0.075);
  vec2 flowedPoint = point + (firstWarp * 0.15);

  vec2 pointerDelta = flowedPoint - pointer;
  float pointerFalloff = exp(-dot(pointerDelta, pointerDelta) / 0.052) * uPointerEnergy;
  flowedPoint -= pointerVelocity * pointerFalloff * 0.052;
  flowedPoint += vec2(-pointerDelta.y, pointerDelta.x) * pointerFalloff * 0.095;

  float quietDistance = roundedBoxSdf(point - quietCenter, quietHalfSize, 0.055);
  float nearQuiet = 1.0 - smoothstep(-0.018, 0.14, quietDistance);
  flowedPoint += safeNormalize(point - quietCenter) * nearQuiet * 0.045;

  vec2 impulseCenter = vec2((uImpulse.x - 0.5) * aspect, uImpulse.y - 0.5);
  vec2 impulseDelta = point - impulseCenter;
  float impulseDistance = length(impulseDelta);
  float impulseEnvelope = exp(-uImpulse.z * 1.65) * uImpulse.w;
  float impulseWave = sin((impulseDistance * 44.0) - (uImpulse.z * 8.5))
    * exp(-impulseDistance * 4.2)
    * impulseEnvelope;
  flowedPoint += safeNormalize(impulseDelta) * impulseWave * 0.026;

  float graphiteField = 0.0;
  float signalField = 0.0;

  for (int index = 0; index < ${MAX_LITE_BLOBS}; index++) {
    if (index >= uBlobCount) break;

    vec4 blob = uBlobs[index];
    vec2 center = vec2((blob.x - 0.5) * aspect, blob.y - 0.5);
    vec2 delta = flowedPoint - center;
    float radiusSquared = blob.z * blob.z;
    float influence = radiusSquared / (dot(delta, delta) + (radiusSquared * 0.075));

    graphiteField += influence * (1.0 - blob.w);
    signalField += influence * blob.w;
  }

  mat2 firstTurn = mat2(0.906, -0.423, 0.423, 0.906);
  mat2 secondTurn = mat2(0.819, 0.574, -0.574, 0.819);
  float broadCurrent = currentBand(firstTurn * flowedPoint, -0.18, 0.11, uTime * 0.055);
  float upperCurrent = currentBand(secondTurn * flowedPoint, 0.31, 0.075, 2.4 - (uTime * 0.042));
  graphiteField += (broadCurrent * 0.34) + (upperCurrent * 0.22);

  float body = smoothstep(0.92, 1.58, graphiteField);
  float wash = smoothstep(0.30, 1.04, graphiteField);
  float signal = smoothstep(0.76, 1.42, signalField);
  float clearMask = smoothstep(-0.012, 0.105, quietDistance);
  float scrollVisibility = 1.0;

  body *= clearMask * scrollVisibility;
  wash *= clearMask * scrollVisibility;
  signal *= clearMask * scrollVisibility;

  float paperLift = (1.0 - vUv.y) * 0.22 + (1.0 - smoothstep(-0.02, 0.2, quietDistance)) * 0.16;
  vec3 color = mix(uPaper, uRaisedPaper, paperLift);
  float graphiteAmount = min(0.25, (wash * 0.075) + (body * 0.18)) * uIntensity;
  color = mix(color, uInk, graphiteAmount);
  color = mix(color, uSignal, min(0.18, signal * 0.18 * uIntensity));

  float grain = (hash(gl_FragCoord.xy) - 0.5) * 0.006;
  outColor = vec4(color + grain, 1.0);
}
`;

export const LITE_BLOB_BLUEPRINTS = [
  { x: -0.03, y: 0.20, radius: 0.32, pigment: 0, phase: 0.2, speed: 0.31 },
  { x: 0.13, y: 0.82, radius: 0.27, pigment: 0, phase: 1.7, speed: 0.24 },
  { x: 0.43, y: 1.01, radius: 0.24, pigment: 0, phase: 3.4, speed: 0.28 },
  { x: 0.78, y: 0.08, radius: 0.135, pigment: 1, phase: 2.8, speed: 0.34 },
  { x: 0.88, y: 0.78, radius: 0.30, pigment: 0, phase: 4.9, speed: 0.22 },
  { x: 1.02, y: 0.22, radius: 0.33, pigment: 0, phase: 6.1, speed: 0.26 }
];

const compileShader = (gl, type, source) => {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Unable to create Hero fluid shader.');

  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || 'Unknown shader compilation error.';
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
};
export const createLiteProgram = (gl) => {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  let fragmentShader = null;
  let program = null;

  try {
    fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    program = gl.createProgram();
    if (!program) throw new Error('Unable to create Hero fluid program.');

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || 'Unknown shader link error.';
      throw new Error(message);
    }

    return program;
  } catch (error) {
    if (program) gl.deleteProgram(program);
    throw error;
  } finally {
    gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
  }
};
