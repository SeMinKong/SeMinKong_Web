const toColor = (red, green, blue) => new Float32Array([red / 255, green / 255, blue / 255]);

export const SITE_FLUID_PALETTES = Object.freeze({
  light: Object.freeze({
    paper: toColor(241, 238, 230),
    raised: toColor(250, 248, 243),
    ink: toColor(23, 21, 18),
    signal: toColor(167, 53, 36)
  }),
  dark: Object.freeze({
    paper: toColor(17, 16, 14),
    raised: toColor(29, 27, 23),
    ink: toColor(241, 238, 230),
    signal: toColor(222, 72, 48)
  })
});

const createProfile = (name, options) => Object.freeze({
  name,
  palette: SITE_FLUID_PALETTES[options.theme],
  theme: options.theme,
  intensity: options.intensity,
  interaction: options.interaction,
  seedStrength: options.seedStrength,
  continuousAmbient: options.continuousAmbient,
  ambientDelay: options.ambientDelay,
  quietSelector: options.quietSelector
});

export const SITE_FLUID_PROFILES = Object.freeze({
  home: createProfile('home', {
    theme: 'light',
    intensity: 1,
    interaction: 1,
    seedStrength: 0.9,
    continuousAmbient: true,
    ambientDelay: 0,
    quietSelector: '[data-hero-copy]'
  }),
  work: createProfile('work', {
    theme: 'light',
    intensity: 0.58,
    interaction: 0.68,
    seedStrength: 0.54,
    continuousAmbient: false,
    ambientDelay: 3200,
    quietSelector: '.work-index__title, .work-index__intro'
  }),
  about: createProfile('about', {
    theme: 'light',
    intensity: 0.48,
    interaction: 0.54,
    seedStrength: 0.46,
    continuousAmbient: false,
    ambientDelay: 4300,
    quietSelector: '.about-hero__title, .about-hero__statement'
  }),
  resume: createProfile('resume', {
    theme: 'light',
    intensity: 0.34,
    interaction: 0.4,
    seedStrength: 0.34,
    continuousAmbient: false,
    ambientDelay: 6500,
    quietSelector: '.resume-hero > div, .resume-hero__inner'
  }),
  legal: createProfile('legal', {
    theme: 'light',
    intensity: 0.28,
    interaction: 0.34,
    seedStrength: 0.3,
    continuousAmbient: false,
    ambientDelay: 8000,
    quietSelector: '.legal-hero > *'
  }),
  'case-study': createProfile('case-study', {
    theme: 'dark',
    intensity: 0.44,
    interaction: 0.52,
    seedStrength: 0.42,
    continuousAmbient: false,
    ambientDelay: 4800,
    quietSelector: '.case-hero h1, .case-hero__summary'
  })
});

export const getSiteFluidProfile = (name) => SITE_FLUID_PROFILES[name] || SITE_FLUID_PROFILES.about;
