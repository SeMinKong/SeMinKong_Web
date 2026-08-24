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
  quietSelector: options.quietSelector,
  protectSelector: options.protectSelector || ''
});

export const SITE_FLUID_PROFILES = Object.freeze({
  home: createProfile('home', {
    theme: 'light',
    intensity: 1,
    interaction: 1,
    seedStrength: 0.9,
    continuousAmbient: true,
    ambientDelay: 0,
    quietSelector: [
      '.hero-identity__name',
      '.hero-identity__statement > span',
      '.hero-story__actions .button',
      '.section-heading > *',
      '.project-card--deck .project-card__copy',
      '.focus-list h3',
      '.home-about h2',
      '.home-about__copy > p',
      '.home-contact h2',
      '.home-contact__details > *',
      '.home-contact .site-footer'
    ].join(', '),
    protectSelector: '.project-card--deck .project-card__media'
  }),
  work: createProfile('work', {
    theme: 'light',
    intensity: 0.58,
    interaction: 0.68,
    seedStrength: 0.54,
    continuousAmbient: false,
    ambientDelay: 3200,
    quietSelector: [
      '.work-index__hero h1',
      '.work-row .work-row__copy > p',
      '.work-row .work-row__copy h2',
      '.work-row .work-row__copy > span',
      '.work-row .work-row__proofs',
      '.work-row .work-row__copy ul',
      '.work-row .work-row__cta',
      '.directory-contact a'
    ].join(', '),
    protectSelector: '.work-row .work-row__media'
  }),
  about: createProfile('about', {
    theme: 'light',
    intensity: 0.48,
    interaction: 0.54,
    seedStrength: 0.46,
    continuousAmbient: false,
    ambientDelay: 4300,
    quietSelector: [
      '.about-hero h1',
      '.about-hero__statement p',
      '.about-hero__statement > span',
      '.about-facts',
      '.about-narrative h2',
      '.about-narrative > p',
      '.about-questions__topic',
      '.about-questions__list h3',
      '.about-questions__list p',
      '.about-now h2',
      '.tool-group h3',
      '.about-next h2',
      '.about-next nav'
    ].join(', '),
    protectSelector: '.about-profile img'
  }),
  resume: createProfile('resume', {
    theme: 'light',
    intensity: 0.34,
    interaction: 0.4,
    seedStrength: 0.34,
    continuousAmbient: false,
    ambientDelay: 6500,
    quietSelector: [
      '.resume-hero h1',
      '.resume-role',
      '.resume-contact > *',
      '.resume-label',
      '.resume-summary p',
      '.resume-item__head',
      '.resume-list article > p',
      '.resume-projects ul',
      '.skill-groups > div',
      '.resume-cta h2',
      '.resume-cta > div'
    ].join(', '),
    protectSelector: '.resume-document, .resume-original__preview, .resume-original__actions'
  }),
  legal: createProfile('legal', {
    theme: 'light',
    intensity: 0.28,
    interaction: 0.34,
    seedStrength: 0.3,
    continuousAmbient: false,
    ambientDelay: 8000,
    quietSelector: [
      '.legal-hero h1',
      '.legal-hero__lede > span',
      '.legal-hero__summary dl > div',
      '.legal-section h2',
      '.legal-section > div:last-child > *',
      '.legal-english h2',
      '.legal-english > p'
    ].join(', ')
  }),
  'case-study': createProfile('case-study', {
    theme: 'dark',
    intensity: 0.44,
    interaction: 0.52,
    seedStrength: 0.42,
    continuousAmbient: false,
    ambientDelay: 4800,
    quietSelector: [
      '.case-hero__meta',
      '.case-hero h1',
      '.case-facts > div',
      '.case-hero__actions',
      '.case-section h2',
      '.case-section__copy > p',
      '.case-list li',
      '.case-flow > div',
      '.case-metrics > div',
      '.thing-demo-card figcaption',
      '.source-link',
      '.case-aside > :not(.button)',
      '.case-next a'
    ].join(', '),
    protectSelector: '.case-media, .case-video, .thing-demo-card img, .thing-demo-card video, .thing-evidence-media'
  })
});

export const getSiteFluidProfile = (name) => SITE_FLUID_PROFILES[name] || SITE_FLUID_PROFILES.about;
