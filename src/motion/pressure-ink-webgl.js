import { PRESSURE_VERTEX_SHADER } from './pressure-ink-shaders.js';

const compileShader = (gl, type, source) => {
  const compiled = gl.createShader(type);
  if (!compiled) throw new Error('Unable to create Pressure Ink shader.');

  gl.shaderSource(compiled, source);
  gl.compileShader(compiled);
  if (!gl.getShaderParameter(compiled, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(compiled) || 'Unknown Pressure Ink shader error.';
    gl.deleteShader(compiled);
    throw new Error(message);
  }

  return compiled;
};

const createProgram = (gl, fragmentSource) => {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, PRESSURE_VERTEX_SHADER);
  let fragment = null;
  let program = null;

  try {
    fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
    program = gl.createProgram();
    if (!program) throw new Error('Unable to create Pressure Ink program.');

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      const message = gl.getProgramInfoLog(program) || 'Unknown Pressure Ink link error.';
      throw new Error(message);
    }

    return program;
  } catch (error) {
    if (program) gl.deleteProgram(program);
    throw error;
  } finally {
    gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
  }
};

const getUniforms = (gl, program, names) => Object.fromEntries(
  names.map((name) => [name, gl.getUniformLocation(program, name)])
);

export const createPressureInkPass = (gl, fragmentSource, uniformNames) => {
  const program = createProgram(gl, fragmentSource);
  return {
    program,
    uniforms: getUniforms(gl, program, uniformNames)
  };
};

const deleteTarget = (gl, target) => {
  if (!target) return;
  if (target.framebuffer) gl.deleteFramebuffer(target.framebuffer);
  if (target.texture) gl.deleteTexture(target.texture);
};

const createTarget = (gl, width, height, descriptor) => {
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  if (!texture || !framebuffer) {
    if (texture) gl.deleteTexture(texture);
    if (framebuffer) gl.deleteFramebuffer(framebuffer);
    throw new Error('Unable to allocate a Pressure Ink framebuffer.');
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    descriptor.internalFormat,
    width,
    height,
    0,
    descriptor.format,
    gl.HALF_FLOAT,
    null
  );

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
  if (status !== gl.FRAMEBUFFER_COMPLETE) {
    gl.deleteFramebuffer(framebuffer);
    gl.deleteTexture(texture);
    throw new Error('Pressure Ink framebuffer format is incomplete.');
  }

  return { texture, framebuffer, width, height };
};

const createDoubleTarget = (gl, width, height, descriptor) => {
  const read = createTarget(gl, width, height, descriptor);
  try {
    const write = createTarget(gl, width, height, descriptor);
    return {
      read,
      write,
      swap() {
        const previousRead = this.read;
        this.read = this.write;
        this.write = previousRead;
      }
    };
  } catch (error) {
    deleteTarget(gl, read);
    throw error;
  }
};

const deleteDoubleTarget = (gl, target) => {
  if (!target) return;
  deleteTarget(gl, target.read);
  deleteTarget(gl, target.write);
};

export const deletePressureInkTargets = (gl, targets) => {
  if (!targets) return;
  deleteDoubleTarget(gl, targets.velocity);
  deleteDoubleTarget(gl, targets.dye);
  deleteDoubleTarget(gl, targets.pressure);
  deleteTarget(gl, targets.divergence);
  deleteTarget(gl, targets.curl);
};

export const allocatePressureInkTargets = (gl, simulationSize, dyeSize) => {
  const profiles = [
    {
      name: 'compact',
      vector: { internalFormat: gl.RG16F, format: gl.RG },
      scalar: { internalFormat: gl.R16F, format: gl.RED }
    },
    {
      name: 'rgba',
      vector: { internalFormat: gl.RGBA16F, format: gl.RGBA },
      scalar: { internalFormat: gl.RGBA16F, format: gl.RGBA }
    }
  ];

  let lastError = null;
  for (const profile of profiles) {
    const candidate = {};
    try {
      candidate.velocity = createDoubleTarget(gl, simulationSize.width, simulationSize.height, profile.vector);
      candidate.dye = createDoubleTarget(gl, dyeSize.width, dyeSize.height, profile.vector);
      candidate.pressure = createDoubleTarget(gl, simulationSize.width, simulationSize.height, profile.scalar);
      candidate.divergence = createTarget(gl, simulationSize.width, simulationSize.height, profile.scalar);
      candidate.curl = createTarget(gl, simulationSize.width, simulationSize.height, profile.scalar);
      candidate.profile = profile.name;
      return candidate;
    } catch (error) {
      lastError = error;
      deletePressureInkTargets(gl, candidate);
    }
  }

  throw lastError || new Error('Pressure Ink targets are unavailable.');
};
