import { access, readFile, readdir } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { SITE_ROUTES } from '../config/site-routes.js';

const entryStyleContracts = {
  'about.js': ['tokens.css', 'base.css', 'about.css', 'gallery-surface.css', 'motion.css'],
  'case-study.js': ['tokens.css', 'base.css', 'case-study.css', 'gallery-surface.css', 'motion.css'],
  'home.js': ['tokens.css', 'base.css', 'portfolio-shared.css', 'home.css', 'kinetic-home.css', 'gallery-surface.css', 'motion.css'],
  'legal.js': ['tokens.css', 'base.css', 'legal.css', 'gallery-surface.css', 'motion.css'],
  'resume.js': ['tokens.css', 'base.css', 'resume.css', 'gallery-surface.css', 'motion.css'],
  'work.js': ['tokens.css', 'base.css', 'portfolio-shared.css', 'work.css', 'gallery-surface.css', 'motion.css']
};

const entryRuntimeContracts = {
  'about.js': ['initIntro', 'initReveals'],
  'case-study.js': ['initThingStory', 'initIntro', 'initReveals', 'initMediaPlayback'],
  'home.js': ['initHomeIntro', 'initKineticSandbox', 'initReveals', 'initProjectDeck'],
  'legal.js': ['initIntro', 'initReveals'],
  'resume.js': ['initIntro', 'initReveals'],
  'work.js': ['initWorkStory', 'initReveals', 'initMediaPlayback']
};

const retiredSourceFiles = [
  'src/about.js',
  'src/legal.js',
  'src/main.js',
  'src/project.js',
  'src/resume.js',
  'src/motion/cursor-label.js',
  'src/motion/depth.js',
  'src/motion/dexterous-hand.js',
  'src/motion/hero-fluid-lite-shader.js',
  'src/motion/hero-fluid.js',
  'src/motion/magnetic.js',
  'src/motion/name-emphasis.js',
  'src/motion/pressure-ink-config.js',
  'src/motion/pressure-ink-renderer.js',
  'src/motion/pressure-ink-shaders.js',
  'src/motion/pressure-ink-size.js',
  'src/motion/pressure-ink-webgl.js',
  'src/motion/scroll-kinetics.js',
  'src/motion/site-fluid-obstacles.js',
  'src/motion/site-fluid-profiles.js',
  'src/motion/site-fluid.js',
  'src/styles/site-fluid.css',
  'src/styles/site.css'
];

const moduleScriptPattern = /<script\b(?=[^>]*\btype=["']module["'])[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
const cssImportPattern = /^import\s+["']([^"']+\.css)["'];?$/gm;
const legacyStylePattern = /(?:dexterous-hand|control-cube|hero-hand-start|robot-stage|robot-arm|robot-hand\b)/i;
const retiredPointerMarkupPattern = /data-(?:site-fluid|hero-fluid|depth-root|depth-card|depth-layer|inertia)|cursor-label/i;

for (const route of SITE_ROUTES) {
  const html = await readFile(resolve(route.source), 'utf8');
  const entries = [...html.matchAll(moduleScriptPattern)].map((match) => match[1]);

  if (entries.length !== 1 || entries[0] !== route.entry) {
    throw new Error(
      `${route.source} must load only ${route.entry}; found ${entries.join(', ') || 'none'}.`
    );
  }

  const retiredPointerMarkup = html.match(retiredPointerMarkupPattern);
  if (retiredPointerMarkup) {
    throw new Error(`${route.source} restored retired pointer markup: ${retiredPointerMarkup[0]}.`);
  }

  if (route.kind !== 'home' && /<canvas\b/i.test(html)) {
    throw new Error(`${route.source} must not ship a route-level canvas.`);
  }
}

for (const [entryName, expectedStyles] of Object.entries(entryStyleContracts)) {
  const source = await readFile(resolve('src/entries', entryName), 'utf8');
  const importedStyles = [...source.matchAll(cssImportPattern)]
    .map((match) => basename(match[1]));

  if (importedStyles.join('|') !== expectedStyles.join('|')) {
    throw new Error(
      `${entryName} CSS contract changed. Expected ${expectedStyles.join(', ')}; ` +
      `found ${importedStyles.join(', ') || 'none'}.`
    );
  }

  if (!source.includes('runtime.start(')) {
    throw new Error(`${entryName} must start the shared page runtime.`);
  }

  for (const controller of entryRuntimeContracts[entryName]) {
    if (!source.includes(`runtime.register(${controller}`)) {
      throw new Error(`${entryName} lost required narrative controller: ${controller}.`);
    }
  }
}

const pageRuntimeSource = await readFile(resolve('src/app/create-page-runtime.js'), 'utf8');
for (const sharedController of ['initNavigation', 'initPageTransitions']) {
  if (!pageRuntimeSource.includes(`register(${sharedController}(environment))`)) {
    throw new Error(`Shared page runtime lost required controller: ${sharedController}.`);
  }
}

if (!pageRuntimeSource.includes('scheduleSmoothScroll(smoothScrollAfter)')) {
  throw new Error('Shared page runtime lost the smooth-scroll scheduling contract.');
}

const homeHtml = await readFile(resolve('index.html'), 'utf8');
const thingHtml = await readFile(resolve('work/thing/index.html'), 'utf8');
const homeStyles = await readFile(resolve('src/styles/home.css'), 'utf8');
const kineticStyles = await readFile(resolve('src/styles/kinetic-home.css'), 'utf8');
const kineticFacade = await readFile(resolve('src/motion/kinetic-sandbox.js'), 'utf8');
const kineticRuntime = await readFile(resolve('src/motion/kinetic-sandbox-runtime.js'), 'utf8');
const gallerySurfaceStyles = await readFile(resolve('src/styles/gallery-surface.css'), 'utf8');
const typographyTokens = await readFile(resolve('src/styles/tokens.css'), 'utf8');
const heroSurfaceLayer = homeStyles.match(
  /\.home-page\s+\.hero-story__sticky\s*>\s*\.hero-surface\s*\{([^}]*)\}/
)?.[1] || '';
const gallerySurfaceLayer = gallerySurfaceStyles.match(/body::before\s*\{([^}]*)\}/)?.[1] || '';

if (!homeHtml.includes('data-hero-surface')) {
  throw new Error('Home must keep a static hero surface for the intro reveal.');
}

if (/data-hero-fluid/i.test(homeHtml)) {
  throw new Error('Home must not restore the retired Fluid canvas layer.');
}

const homeCanvases = homeHtml.match(/<canvas\b[^>]*>/gi) ?? [];
if (
  homeCanvases.length !== 1
  || !/data-kinetic-canvas/.test(homeCanvases[0])
  || !/aria-hidden="true"/.test(homeCanvases[0])
  || !/tabindex="-1"/.test(homeCanvases[0])
) {
  throw new Error('Home must keep one inaccessible, hero-local Kinetic canvas.');
}

const heroSection = homeHtml.match(/<section class="hero-story"[\s\S]*?<\/section>/)?.[0] || '';
if (/THING|signal-lab|data-hero-proof|<fieldset|<input|<button/i.test(heroSection)) {
  throw new Error('Home Kinetic hero must remain project-neutral and control-free.');
}

if (!/position: absolute/.test(kineticStyles) || /position: fixed/.test(kineticStyles)) {
  throw new Error('Home Kinetic field must be absolutely scoped to the hero, never fixed globally.');
}

for (const contract of [
  "import('./kinetic-sandbox-runtime.js')",
  "environment.motion !== 'reduced'",
  'new IntersectionObserver',
  "addEventListener('visibilitychange'",
  "addEventListener('pagehide'",
  "addEventListener('pageshow'"
]) {
  if (!kineticFacade.includes(contract)) {
    throw new Error(`Home Kinetic facade contract is missing: ${contract}.`);
  }
}

for (const contract of [
  "from 'pixi.js'",
  "from 'matter-js'",
  "preference: 'webgl'",
  'Engine.update(engine, FIXED_STEP)',
  'new ResizeObserver',
  'webglcontextlost',
  'webglcontextrestored'
]) {
  if (!kineticRuntime.includes(contract)) {
    throw new Error(`Home Kinetic runtime contract is missing: ${contract}.`);
  }
}

for (const declaration of ['position: absolute', 'pointer-events: none']) {
  if (!heroSurfaceLayer.includes(declaration)) {
    throw new Error(`Home hero surface contract is missing: ${declaration}.`);
  }
}

for (const declaration of ['position: fixed', 'pointer-events: none', 'z-index: 0']) {
  if (!gallerySurfaceLayer.includes(declaration)) {
    throw new Error(`Gallery surface contract is missing: ${declaration}.`);
  }
}

for (const family of ['Signika Variable', 'Jua']) {
  if (!typographyTokens.includes(family)) {
    throw new Error(`Typography token contract is missing: ${family}.`);
  }
}

if (/Asta Sans Variable|Geist Mono Variable|Dongle|Gowun Dodum/.test(typographyTokens)) {
  throw new Error('Retired visible typography was restored in font tokens.');
}

for (const story of ['demos', 'prototype', 'pipeline', 'architecture']) {
  const openingTag = thingHtml.match(
    new RegExp(`<section\\b(?=[^>]*data-thing-story=["']${story}["'])[^>]*>`, 'i')
  )?.[0];

  if (!openingTag) {
    throw new Error(`THING lost its ${story} story ownership marker.`);
  }

  if (/data-reveal/i.test(openingTag)) {
    throw new Error(`THING ${story} must not share its outer section with the generic reveal.`);
  }
}

const styleFiles = (await readdir(resolve('src/styles'), { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.css'));

for (const styleFile of styleFiles) {
  const source = await readFile(resolve('src/styles', styleFile.name), 'utf8');
  const legacyMatch = source.match(legacyStylePattern);
  if (legacyMatch) {
    throw new Error(`${styleFile.name} still contains legacy selector text: ${legacyMatch[0]}`);
  }
}

for (const retiredFile of retiredSourceFiles) {
  try {
    await access(resolve(retiredFile));
    throw new Error(`Retired source file was restored: ${retiredFile}`);
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
}

console.log(`Verified ${SITE_ROUTES.length} route entries and ${styleFiles.length} stylesheet boundaries.`);
