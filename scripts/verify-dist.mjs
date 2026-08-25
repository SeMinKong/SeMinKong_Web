import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import {
  EXPECTED_DEPLOYMENT_FILES,
  SITE_ROUTES
} from '../config/site-routes.js';

const distDirectory = resolve('dist');
const distAssetDirectory = resolve(distDirectory, 'assets');
const rootAbsoluteAssetPattern = /(?:href|src|poster)=["']\/(?!\/)/gi;
const referencePattern = /(?:href|src|poster)=["']([^"']+)["']/gi;
const externalReferencePattern = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;
const retiredPointerTokens = [
  'site-fluid',
  'hero-fluid',
  'cursor-label',
  'pressure-ink',
  'name-emphasis',
  'scroll-kinetics',
  'data-depth-card',
  'data-inertia'
];

const isInsideDist = (target) => {
  const pathFromDist = relative(distDirectory, target);
  return !isAbsolute(pathFromDist) && !pathFromDist.startsWith('..');
};

const resolveLocalReferences = (html, htmlPath) => {
  const references = [];

  for (const match of html.matchAll(referencePattern)) {
    const rawReference = match[1].replaceAll('&amp;', '&');
    if (externalReferencePattern.test(rawReference)) continue;

    const fileReference = rawReference.split(/[?#]/, 1)[0];
    if (!fileReference) continue;

    let decodedReference;
    try {
      decodedReference = decodeURIComponent(fileReference);
    } catch {
      throw new Error(`Invalid URL encoding in ${htmlPath}: ${rawReference}`);
    }

    const target = resolve(dirname(htmlPath), decodedReference);
    if (!isInsideDist(target)) {
      throw new Error(`Reference escapes dist/ in ${htmlPath}: ${rawReference}`);
    }

    references.push({ rawReference, target });
  }

  return references;
};

const verifyPageBundleBoundary = (route, references) => {
  const assetNames = references
    .map(({ rawReference }) => rawReference.split(/[?#]/, 1)[0].split('/').at(-1))
    .filter(Boolean);

  const forbiddenPrefixes = route.kind === 'work'
    ? ['portfolio-']
    : route.kind === 'case-study'
      ? ['portfolio-', 'work-']
      : [];

  const leakedAssets = assetNames.filter((assetName) => (
    forbiddenPrefixes.some((prefix) => assetName.startsWith(prefix)) &&
    !(route.kind === 'work' && assetName.startsWith('portfolio-shared-'))
  ));

  if (leakedAssets.length) {
    throw new Error(
      `${route.output} includes page-specific assets from another route: ${leakedAssets.join(', ')}`
    );
  }
};

const verifyGallerySurface = async (route, html, references) => {
  if (route.kind !== 'home') return;

  const cssTargets = references
    .filter(({ target }) => target.endsWith('.css'))
    .map(({ target }) => target);
  const compiledCss = (await Promise.all(
    cssTargets.map((target) => readFile(target, 'utf8'))
  )).join('\n');
  const gallerySurfaceLayer = compiledCss.match(/body:before\{([^}]*)\}/)?.[1] || '';

  if (!html.includes('data-hero-surface') || !compiledCss.includes('.hero-surface')) {
    throw new Error('Built Home lost its static hero gallery surface.');
  }

  if (/data-hero-fluid|<canvas\b/i.test(html)) {
    throw new Error('Built Home restored the Fluid canvas layer.');
  }

  for (const declaration of ['position:fixed', 'pointer-events:none', 'z-index:0']) {
    if (!gallerySurfaceLayer.includes(declaration)) {
      throw new Error(`Built gallery surface contract is missing: ${declaration}.`);
    }
  }
};

await Promise.all(
  EXPECTED_DEPLOYMENT_FILES.map((file) => access(resolve(distDirectory, file)))
);

const distAssetEntries = await readdir(distAssetDirectory, { withFileTypes: true });
const compiledAssetEntries = distAssetEntries
  .filter((entry) => entry.isFile() && /\.(?:css|js)$/.test(entry.name));
const compiledAssetNames = compiledAssetEntries.map((entry) => entry.name);
const compiledFontNames = distAssetEntries
  .filter((entry) => entry.isFile() && entry.name.endsWith('.woff2'))
  .map((entry) => entry.name);
const compiledAssetFiles = compiledAssetEntries
  .map((entry) => resolve(distAssetDirectory, entry.name));
const compiledAssetSource = (await Promise.all(
  compiledAssetFiles.map((target) => readFile(target, 'utf8'))
)).join('\n');

const gsapCoreAssets = compiledAssetNames.filter((name) => /^gsap-(?!loader).*\.js$/i.test(name));
const scrollTriggerAssets = compiledAssetNames.filter((name) => /^ScrollTrigger-.*\.js$/i.test(name));
const gsapLoaderAssets = compiledAssetNames.filter((name) => /^gsap-loader-.*\.js$/i.test(name));
const splitTextAssets = compiledAssetNames.filter((name) => /^SplitText-.*\.js$/i.test(name));

if (
  gsapCoreAssets.length !== 1
  || scrollTriggerAssets.length !== 1
  || gsapLoaderAssets.length !== 1
  || splitTextAssets.length !== 1
) {
  throw new Error(
    'Production must keep one shared GSAP core, ScrollTrigger, loader, and Work-only SplitText asset.'
  );
}

const optionalGsapAssets = compiledAssetNames.filter(
  (name) => /^(?:Flip|ScrollSmoother)-.*\.js$/i.test(name)
);
if (optionalGsapAssets.length) {
  throw new Error(`Unapproved optional GSAP plugins entered production: ${optionalGsapAssets.join(', ')}`);
}

for (const requiredFont of ['signika-latin-wght-normal', 'jua-korean-400-normal', 'manrope-latin-wght-normal']) {
  if (!compiledFontNames.some((name) => name.startsWith(requiredFont))) {
    throw new Error(`Production is missing required self-hosted font asset: ${requiredFont}.`);
  }
}

const retiredFontAssets = compiledFontNames.filter((name) => (
  /asta-sans|geist-mono|dongle|gowun-dodum/i.test(name)
));
if (retiredFontAssets.length) {
  throw new Error(`Production restored retired visible font assets: ${retiredFontAssets.join(', ')}`);
}

for (const retiredToken of retiredPointerTokens) {
  if (compiledAssetSource.includes(retiredToken)) {
    throw new Error(`Production assets restored retired pointer effect code: ${retiredToken}.`);
  }
}

const missingReferences = [];

for (const route of SITE_ROUTES) {
  const htmlPath = resolve(distDirectory, route.output);
  const html = await readFile(htmlPath, 'utf8');

  if (/(?:href|src)=["'][^"']*(?:gsap-(?!loader)|ScrollTrigger-|SplitText-)[^"']*\.js/i.test(html)) {
    throw new Error(`${route.output} eagerly references the GSAP animation runtime.`);
  }

  if (rootAbsoluteAssetPattern.test(html)) {
    throw new Error(`Root-absolute asset path remains in ${route.output}.`);
  }
  rootAbsoluteAssetPattern.lastIndex = 0;

  const references = resolveLocalReferences(html, htmlPath);
  verifyPageBundleBoundary(route, references);
  await verifyGallerySurface(route, html, references);

  for (const reference of references) {
    try {
      await access(reference.target);
    } catch {
      missingReferences.push(`${route.output} -> ${reference.rawReference}`);
    }
  }
}

if (missingReferences.length) {
  throw new Error(`Missing local deployment references:\n${missingReferences.join('\n')}`);
}

console.log(
  `Verified ${SITE_ROUTES.length} routes and ${EXPECTED_DEPLOYMENT_FILES.length} deployment entries in dist/.`
);
