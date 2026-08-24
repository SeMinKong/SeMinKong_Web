import { access, readFile, readdir } from 'node:fs/promises';
import { basename, resolve } from 'node:path';
import { SITE_ROUTES } from '../config/site-routes.js';

const entryStyleContracts = {
  'about.js': ['tokens.css', 'base.css', 'about.css', 'site-fluid.css', 'motion.css'],
  'case-study.js': ['tokens.css', 'base.css', 'case-study.css', 'site-fluid.css', 'motion.css'],
  'home.js': ['tokens.css', 'base.css', 'portfolio-shared.css', 'home.css', 'site-fluid.css', 'motion.css'],
  'legal.js': ['tokens.css', 'base.css', 'legal.css', 'site-fluid.css', 'motion.css'],
  'resume.js': ['tokens.css', 'base.css', 'resume.css', 'site-fluid.css', 'motion.css'],
  'work.js': ['tokens.css', 'base.css', 'portfolio-shared.css', 'work.css', 'site-fluid.css', 'motion.css']
};

const retiredSourceFiles = [
  'src/about.js',
  'src/legal.js',
  'src/main.js',
  'src/project.js',
  'src/resume.js',
  'src/motion/dexterous-hand.js',
  'src/styles/site.css'
];

const moduleScriptPattern = /<script\b(?=[^>]*\btype=["']module["'])[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
const cssImportPattern = /^import\s+["']([^"']+\.css)["'];?$/gm;
const legacyStylePattern = /(?:dexterous-hand|control-cube|hero-hand-start|robot-stage|robot-arm|robot-hand\b)/i;

for (const route of SITE_ROUTES) {
  const html = await readFile(resolve(route.source), 'utf8');
  const entries = [...html.matchAll(moduleScriptPattern)].map((match) => match[1]);

  if (entries.length !== 1 || entries[0] !== route.entry) {
    throw new Error(
      `${route.source} must load only ${route.entry}; found ${entries.join(', ') || 'none'}.`
    );
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
}

const homeStyles = await readFile(resolve('src/styles/home.css'), 'utf8');
const siteFluidStyles = await readFile(resolve('src/styles/site-fluid.css'), 'utf8');
const scopedLegacyHeroFluidPattern = /\.home-page\s+\.hero-story__sticky\s*>\s*\.hero-fluid:not\(\.site-fluid\)\s*\{/;
const broadLegacyHeroFluidPattern = /(?:^|\n)\.home-page\s+\.hero-fluid\s*\{/;
const siteFluidLayer = siteFluidStyles.match(/\.site-fluid\.site-fluid\s*\{([^}]*)\}/)?.[1] || '';

if (!scopedLegacyHeroFluidPattern.test(homeStyles)) {
  throw new Error('Home legacy Fluid styles must stay scoped to the pre-runtime sticky placeholder.');
}

if (broadLegacyHeroFluidPattern.test(homeStyles)) {
  throw new Error('Home legacy Fluid styles must not match the fixed Site Fluid runtime layer.');
}

for (const declaration of ['position: fixed', 'z-index: 2', 'background: transparent']) {
  if (!siteFluidLayer.includes(declaration)) {
    throw new Error(`Site Fluid layer contract is missing: ${declaration}.`);
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
