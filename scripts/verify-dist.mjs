import { access, readFile } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import {
  EXPECTED_DEPLOYMENT_FILES,
  SITE_ROUTES
} from '../config/site-routes.js';

const distDirectory = resolve('dist');
const rootAbsoluteAssetPattern = /(?:href|src|poster)=["']\/(?!\/)/gi;
const referencePattern = /(?:href|src|poster)=["']([^"']+)["']/gi;
const externalReferencePattern = /^(?:[a-z][a-z\d+.-]*:|\/\/|#)/i;

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
    forbiddenPrefixes.some((prefix) => assetName.startsWith(prefix))
  ));

  if (leakedAssets.length) {
    throw new Error(
      `${route.output} includes page-specific assets from another route: ${leakedAssets.join(', ')}`
    );
  }
};

await Promise.all(
  EXPECTED_DEPLOYMENT_FILES.map((file) => access(resolve(distDirectory, file)))
);

const missingReferences = [];

for (const route of SITE_ROUTES) {
  const htmlPath = resolve(distDirectory, route.output);
  const html = await readFile(htmlPath, 'utf8');

  if (rootAbsoluteAssetPattern.test(html)) {
    throw new Error(`Root-absolute asset path remains in ${route.output}.`);
  }
  rootAbsoluteAssetPattern.lastIndex = 0;

  const references = resolveLocalReferences(html, htmlPath);
  verifyPageBundleBoundary(route, references);

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
