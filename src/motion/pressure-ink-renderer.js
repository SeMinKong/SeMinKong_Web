import {
  MAX_SPLATS,
  PRESSURE_INK_QUALITY,
  PRESSURE_ITERATIONS,
} from './pressure-ink-config.js';
import {
  ADVECTION_SHADER,
  CURL_SHADER,
  DISPLAY_SHADER,
  DIVERGENCE_SHADER,
  DYE_SPLAT_SHADER,
  GRADIENT_SHADER,
  PRESSURE_DECAY_SHADER,
  PRESSURE_SHADER,
  VELOCITY_SPLAT_SHADER,
  VORTICITY_SHADER
} from './pressure-ink-shaders.js';
import {
  allocatePressureInkTargets,
  createPressureInkPass,
  deletePressureInkTargets
} from './pressure-ink-webgl.js';
import {
  getPressureInkTargetSize,
  hasPressureInkTargetSize
} from './pressure-ink-size.js';

const SPLAT_UNIFORM_NAMES = [
  'uSource',
  'uSplatData[0]',
  'uSplatForce[0]',
  'uSplatInk[0]',
  'uSplatCount',
  'uQuiet',
  'uAspect'
];

export const createPressureInkRenderer = (gl, canvas, {
  quality: initialQuality = PRESSURE_INK_QUALITY.baseline,
  style,
  continuousAmbient = true
} = {}) => {
  if (!gl.getExtension('EXT_color_buffer_float')) {
    throw new Error('EXT_color_buffer_float is unavailable.');
  }

  const vertexArray = gl.createVertexArray();
  if (!vertexArray) throw new Error('Unable to create a Pressure Ink vertex array.');

  const passes = {};
  try {
    passes.velocitySplat = createPressureInkPass(gl, VELOCITY_SPLAT_SHADER, SPLAT_UNIFORM_NAMES);
    passes.dyeSplat = createPressureInkPass(gl, DYE_SPLAT_SHADER, SPLAT_UNIFORM_NAMES);
    passes.advection = createPressureInkPass(gl, ADVECTION_SHADER, [
      'uSource',
      'uVelocity',
      'uSourceSize',
      'uDt',
      'uDissipation',
      'uVelocityField',
      'uQuiet',
      'uAspect'
    ]);
    passes.curl = createPressureInkPass(gl, CURL_SHADER, ['uVelocity', 'uTexel', 'uQuiet', 'uAspect']);
    passes.vorticity = createPressureInkPass(gl, VORTICITY_SHADER, [
      'uVelocity',
      'uCurl',
      'uTexel',
      'uDt',
      'uCurlStrength',
      'uQuiet',
      'uAspect'
    ]);
    passes.divergence = createPressureInkPass(gl, DIVERGENCE_SHADER, ['uVelocity', 'uTexel', 'uQuiet', 'uAspect']);
    passes.pressureDecay = createPressureInkPass(gl, PRESSURE_DECAY_SHADER, ['uPressure', 'uDecay', 'uQuiet', 'uAspect']);
    passes.pressure = createPressureInkPass(gl, PRESSURE_SHADER, [
      'uPressure',
      'uDivergence',
      'uTexel',
      'uQuiet',
      'uAspect'
    ]);
    passes.gradient = createPressureInkPass(gl, GRADIENT_SHADER, [
      'uPressure',
      'uVelocity',
      'uTexel',
      'uQuiet',
      'uAspect'
    ]);
    passes.display = createPressureInkPass(gl, DISPLAY_SHADER, [
      'uDye',
      'uDyeSize',
      'uResolution',
      'uTime',
      'uPaper',
      'uRaisedPaper',
      'uInk',
      'uSignal',
      'uIntensity',
      'uQuiet',
      'uAspect'
    ]);
  } catch (error) {
    Object.values(passes).forEach((pass) => gl.deleteProgram(pass.program));
    gl.deleteVertexArray(vertexArray);
    throw error;
  }

  const splatData = new Float32Array(MAX_SPLATS * 4);
  const splatForce = new Float32Array(MAX_SPLATS * 2);
  const splatInk = new Float32Array(MAX_SPLATS * 2);
  const quiet = new Float32Array([0.5, 0.5, 0.42, 0.24]);
  const pendingSplats = [];

  let targets = null;
  let simulationSize = { width: 0, height: 0 };
  let dyeSize = { width: 0, height: 0 };
  let aspect = 1;
  let ambientClock = 0;
  let ambientIndex = 0;
  let activeUntil = 0;
  let destroyed = false;
  let quality = initialQuality;

  const bindTexture = (uniform, texture, unit) => {
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(uniform, unit);
  };

  const setQuietUniforms = (uniforms) => {
    gl.uniform4fv(uniforms.uQuiet, quiet);
    gl.uniform1f(uniforms.uAspect, aspect);
  };

  const setStyleUniforms = (uniforms) => {
    gl.uniform3fv(uniforms.uPaper, style.palette.paper);
    gl.uniform3fv(uniforms.uRaisedPaper, style.palette.raised);
    gl.uniform3fv(uniforms.uInk, style.palette.ink);
    gl.uniform3fv(uniforms.uSignal, style.palette.signal);
    gl.uniform1f(uniforms.uIntensity, style.intensity);
  };

  const beginPass = (pass, target, width, height) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target?.framebuffer || null);
    gl.viewport(0, 0, width, height);
    gl.useProgram(pass.program);
    gl.bindVertexArray(vertexArray);
  };

  const finishPass = () => {
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const clearTarget = (target) => {
    gl.bindFramebuffer(gl.FRAMEBUFFER, target.framebuffer);
    gl.viewport(0, 0, target.width, target.height);
    gl.clearColor(0, 0, 0, 1);
    gl.clear(gl.COLOR_BUFFER_BIT);
  };

  const clear = () => {
    if (!targets || destroyed) return;
    [
      targets.velocity.read,
      targets.velocity.write,
      targets.dye.read,
      targets.dye.write,
      targets.pressure.read,
      targets.pressure.write,
      targets.divergence,
      targets.curl
    ].forEach(clearTarget);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    pendingSplats.length = 0;
    ambientClock = 0;
  };

  const queueSplat = (splat, activate = true) => {
    if (destroyed || pendingSplats.length >= MAX_SPLATS) return false;
    pendingSplats.push({
      x: Math.min(1, Math.max(0, splat.x)),
      y: Math.min(1, Math.max(0, splat.y)),
      radius: Math.min(0.16, Math.max(0.012, splat.radius || 0.035)),
      strength: Math.min(2.4, Math.max(0, splat.strength ?? 1)),
      forceX: Math.min(2.8, Math.max(-2.8, splat.forceX || 0)),
      forceY: Math.min(2.8, Math.max(-2.8, splat.forceY || 0)),
      graphite: Math.min(1.2, Math.max(0, splat.graphite ?? 0.2)),
      signal: Math.min(0.45, Math.max(0, splat.signal || 0))
    });
    if (activate) activeUntil = performance.now() + 2500;
    return true;
  };

  const seed = () => {
    const initial = [
      { x: 0.02, y: 0.22, forceX: 0.22, forceY: 0.07, radius: 0.12, graphite: 0.46 },
      { x: 0.98, y: 0.78, forceX: -0.23, forceY: -0.06, radius: 0.125, graphite: 0.42 },
      { x: 0.18, y: 0.98, forceX: 0.1, forceY: -0.21, radius: 0.1, graphite: 0.38 },
      { x: 0.82, y: 0.02, forceX: -0.07, forceY: 0.2, radius: 0.11, graphite: 0.4 },
      { x: 0.04, y: 0.72, forceX: 0.21, forceY: -0.1, radius: 0.064, graphite: 0.24, signal: 0.08 }
    ];
    initial.forEach((splat) => queueSplat({ ...splat, strength: 0.82 }));
  };

  const uploadSplats = (pass, includeForce) => {
    splatData.fill(0);
    splatForce.fill(0);
    splatInk.fill(0);

    pendingSplats.forEach((splat, index) => {
      const dataOffset = index * 4;
      const vectorOffset = index * 2;
      splatData[dataOffset] = splat.x;
      splatData[dataOffset + 1] = splat.y;
      splatData[dataOffset + 2] = splat.radius;
      splatData[dataOffset + 3] = splat.strength;
      splatForce[vectorOffset] = splat.forceX;
      splatForce[vectorOffset + 1] = splat.forceY;
      splatInk[vectorOffset] = splat.graphite;
      splatInk[vectorOffset + 1] = splat.signal;
    });

    gl.uniform4fv(pass.uniforms['uSplatData[0]'], splatData);
    gl.uniform1i(pass.uniforms.uSplatCount, pendingSplats.length);
    if (includeForce) {
      gl.uniform2fv(pass.uniforms['uSplatForce[0]'], splatForce);
    } else {
      gl.uniform2fv(pass.uniforms['uSplatInk[0]'], splatInk);
    }
  };

  const applySplats = () => {
    if (!pendingSplats.length) return;

    const velocityPass = passes.velocitySplat;
    beginPass(velocityPass, targets.velocity.write, simulationSize.width, simulationSize.height);
    bindTexture(velocityPass.uniforms.uSource, targets.velocity.read.texture, 0);
    setQuietUniforms(velocityPass.uniforms);
    uploadSplats(velocityPass, true);
    finishPass();
    targets.velocity.swap();

    const dyePass = passes.dyeSplat;
    beginPass(dyePass, targets.dye.write, dyeSize.width, dyeSize.height);
    bindTexture(dyePass.uniforms.uSource, targets.dye.read.texture, 0);
    setQuietUniforms(dyePass.uniforms);
    uploadSplats(dyePass, false);
    finishPass();
    targets.dye.swap();

    pendingSplats.length = 0;
  };

  const injectAmbient = (dt, time, scrollProgress) => {
    if (!continuousAmbient) return;
    if (scrollProgress > 0.82 || pendingSplats.length > MAX_SPLATS - 2) return;
    ambientClock += dt * (1 - scrollProgress);
    if (ambientClock < 0.72) return;
    ambientClock = 0;

    const phase = (ambientIndex * 1.61803398875) + (time * 0.04);
    const fromLeft = ambientIndex % 2 === 0;
    const y = 0.16 + (((ambientIndex * 0.37) % 1) * 0.68);
    queueSplat({
      x: fromLeft ? 0.012 : 0.988,
      y,
      radius: 0.07 + (0.018 * Math.sin(phase)),
      strength: 0.5,
      forceX: fromLeft ? 0.13 : -0.13,
      forceY: Math.sin(phase) * 0.065,
      graphite: 0.13,
      signal: ambientIndex % 7 === 5 ? 0.022 : 0
    }, false);
    ambientIndex += 1;
  };

  const resize = (width, height, nextQuiet) => {
    if (destroyed) return;
    aspect = width / Math.max(height, 1);
    quiet.set(nextQuiet);

    const sizeOptions = { maximum: quality.maximumTextureDimension };
    const nextSimulationSize = getPressureInkTargetSize(
      quality.simulationShortSide,
      width,
      height,
      sizeOptions
    );
    const nextDyeSize = getPressureInkTargetSize(
      quality.dyeShortSide,
      width,
      height,
      sizeOptions
    );
    const sizesMatch = hasPressureInkTargetSize(targets?.velocity?.read, nextSimulationSize)
      && hasPressureInkTargetSize(targets?.dye?.read, nextDyeSize);

    simulationSize = nextSimulationSize;
    dyeSize = nextDyeSize;
    if (sizesMatch) return;

    const nextTargets = allocatePressureInkTargets(gl, simulationSize, dyeSize);
    deletePressureInkTargets(gl, targets);
    targets = nextTargets;
    clear();
    seed();
  };

  const updateQuiet = (nextQuiet) => {
    quiet.set(nextQuiet);
  };

  const step = (dt, time, scrollProgress) => {
    if (!targets || destroyed) return;
    injectAmbient(dt, time, scrollProgress);
    applySplats();

    const simulationTexel = [1 / simulationSize.width, 1 / simulationSize.height];
    const scrollDrag = 0.84 + (scrollProgress * 1.1);

    const advectionPass = passes.advection;
    beginPass(advectionPass, targets.velocity.write, simulationSize.width, simulationSize.height);
    bindTexture(advectionPass.uniforms.uSource, targets.velocity.read.texture, 0);
    bindTexture(advectionPass.uniforms.uVelocity, targets.velocity.read.texture, 1);
    gl.uniform2f(advectionPass.uniforms.uSourceSize, simulationSize.width, simulationSize.height);
    gl.uniform1f(advectionPass.uniforms.uDt, dt);
    gl.uniform1f(advectionPass.uniforms.uDissipation, Math.exp(-scrollDrag * dt));
    gl.uniform1f(advectionPass.uniforms.uVelocityField, 1);
    setQuietUniforms(advectionPass.uniforms);
    finishPass();
    targets.velocity.swap();

    const curlPass = passes.curl;
    beginPass(curlPass, targets.curl, simulationSize.width, simulationSize.height);
    bindTexture(curlPass.uniforms.uVelocity, targets.velocity.read.texture, 0);
    gl.uniform2f(curlPass.uniforms.uTexel, simulationTexel[0], simulationTexel[1]);
    setQuietUniforms(curlPass.uniforms);
    finishPass();

    const vorticityPass = passes.vorticity;
    beginPass(vorticityPass, targets.velocity.write, simulationSize.width, simulationSize.height);
    bindTexture(vorticityPass.uniforms.uVelocity, targets.velocity.read.texture, 0);
    bindTexture(vorticityPass.uniforms.uCurl, targets.curl.texture, 1);
    gl.uniform2f(vorticityPass.uniforms.uTexel, simulationTexel[0], simulationTexel[1]);
    gl.uniform1f(vorticityPass.uniforms.uDt, dt);
    gl.uniform1f(vorticityPass.uniforms.uCurlStrength, 55);
    setQuietUniforms(vorticityPass.uniforms);
    finishPass();
    targets.velocity.swap();

    const divergencePass = passes.divergence;
    beginPass(divergencePass, targets.divergence, simulationSize.width, simulationSize.height);
    bindTexture(divergencePass.uniforms.uVelocity, targets.velocity.read.texture, 0);
    gl.uniform2f(divergencePass.uniforms.uTexel, simulationTexel[0], simulationTexel[1]);
    setQuietUniforms(divergencePass.uniforms);
    finishPass();

    const pressureDecayPass = passes.pressureDecay;
    beginPass(pressureDecayPass, targets.pressure.write, simulationSize.width, simulationSize.height);
    bindTexture(pressureDecayPass.uniforms.uPressure, targets.pressure.read.texture, 0);
    gl.uniform1f(pressureDecayPass.uniforms.uDecay, 0.78);
    setQuietUniforms(pressureDecayPass.uniforms);
    finishPass();
    targets.pressure.swap();

    const pressurePass = passes.pressure;
    for (let iteration = 0; iteration < PRESSURE_ITERATIONS; iteration += 1) {
      beginPass(pressurePass, targets.pressure.write, simulationSize.width, simulationSize.height);
      bindTexture(pressurePass.uniforms.uPressure, targets.pressure.read.texture, 0);
      bindTexture(pressurePass.uniforms.uDivergence, targets.divergence.texture, 1);
      gl.uniform2f(pressurePass.uniforms.uTexel, simulationTexel[0], simulationTexel[1]);
      setQuietUniforms(pressurePass.uniforms);
      finishPass();
      targets.pressure.swap();
    }

    const gradientPass = passes.gradient;
    beginPass(gradientPass, targets.velocity.write, simulationSize.width, simulationSize.height);
    bindTexture(gradientPass.uniforms.uPressure, targets.pressure.read.texture, 0);
    bindTexture(gradientPass.uniforms.uVelocity, targets.velocity.read.texture, 1);
    gl.uniform2f(gradientPass.uniforms.uTexel, simulationTexel[0], simulationTexel[1]);
    setQuietUniforms(gradientPass.uniforms);
    finishPass();
    targets.velocity.swap();

    beginPass(advectionPass, targets.dye.write, dyeSize.width, dyeSize.height);
    bindTexture(advectionPass.uniforms.uSource, targets.dye.read.texture, 0);
    bindTexture(advectionPass.uniforms.uVelocity, targets.velocity.read.texture, 1);
    gl.uniform2f(advectionPass.uniforms.uSourceSize, dyeSize.width, dyeSize.height);
    gl.uniform1f(advectionPass.uniforms.uDt, dt);
    gl.uniform1f(advectionPass.uniforms.uDissipation, Math.exp(-(0.18 + (scrollProgress * 0.72)) * dt));
    gl.uniform1f(advectionPass.uniforms.uVelocityField, 0);
    setQuietUniforms(advectionPass.uniforms);
    finishPass();
    targets.dye.swap();
  };

  const render = (time) => {
    if (!targets || destroyed) return;
    const displayPass = passes.display;
    beginPass(displayPass, null, canvas.width, canvas.height);
    bindTexture(displayPass.uniforms.uDye, targets.dye.read.texture, 0);
    gl.uniform2f(displayPass.uniforms.uDyeSize, dyeSize.width, dyeSize.height);
    gl.uniform2f(displayPass.uniforms.uResolution, canvas.width, canvas.height);
    gl.uniform1f(displayPass.uniforms.uTime, time);
    setQuietUniforms(displayPass.uniforms);
    setStyleUniforms(displayPass.uniforms);
    finishPass();
  };

  const setQuality = (nextQuality) => {
    if (!nextQuality || quality.name === nextQuality.name) return false;
    quality = nextQuality;
    return true;
  };

  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    deletePressureInkTargets(gl, targets);
    targets = null;
    Object.values(passes).forEach((pass) => gl.deleteProgram(pass.program));
    gl.deleteVertexArray(vertexArray);
    pendingSplats.length = 0;
  };

  return {
    resize,
    setQuality,
    updateQuiet,
    queueSplat,
    seed,
    clear,
    step,
    render,
    destroy,
    isActive(now = performance.now()) {
      return pendingSplats.length > 0 || now < activeUntil;
    },
    get profile() {
      return targets?.profile || 'unallocated';
    },
    get quality() {
      return quality.name;
    }
  };
};
