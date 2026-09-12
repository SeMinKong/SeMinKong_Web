import { readFile } from 'node:fs/promises';
import { basename, extname, relative, resolve } from 'node:path';
import { SITE_ROUTES } from '../config/site-routes.js';
import { listSourceFiles, readSourceGraph } from './lib/source-graph.mjs';

// CSS order is part of the cascade; route entries explicitly own their layers.
const entryStyles = {
  'about.js': ['tokens.css', 'base.css', 'about.css', 'tech-stack.css', 'gallery-surface.css', 'motion.css'],
  'case-study.js': ['tokens.css', 'base.css', 'case-study.css', 'gallery-surface.css', 'motion.css'],
  'home.js': ['tokens.css', 'base.css', 'portfolio-shared.css', 'home.css', 'kinetic-home.css', 'gallery-surface.css', 'motion.css'],
  'legal.js': ['tokens.css', 'base.css', 'legal.css', 'gallery-surface.css', 'motion.css'],
  'resume.js': ['tokens.css', 'base.css', 'resume.css', 'gallery-surface.css', 'motion.css'],
  'work.js': ['tokens.css', 'base.css', 'portfolio-shared.css', 'work.css', 'gallery-surface.css', 'motion.css']
};
const moduleScriptPattern = /<script\b(?=[^>]*\btype=["']module["'])[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;
const pages = new Map();

for (const route of SITE_ROUTES) {
  const html = await readFile(route.source, 'utf8');
  pages.set(route.kind, html);
  const entries = [...html.matchAll(moduleScriptPattern)].map((match) => match[1]);
  if (entries.length !== 1 || entries[0] !== route.entry) {
    throw new Error(`${route.source} must load only ${route.entry}.`);
  }
  if (route.kind !== 'home' && /<canvas\b/i.test(html)) {
    throw new Error(`${route.source} must not load the Home canvas.`);
  }
}

const entryPaths = [...new Set(SITE_ROUTES.map((route) => route.entry.slice(1)))];
const graph = await readSourceGraph(entryPaths);

for (const entry of entryPaths) {
  const { imports } = graph.modules.get(resolve(entry));
  const styles = imports.filter((path) => extname(path) === '.css').map((path) => basename(path));
  const expected = entryStyles[basename(entry)];
  if (!expected || styles.join('|') !== expected.join('|')) {
    throw new Error(`${entry} CSS order changed: ${styles.join(', ')}.`);
  }
}

// Unreachable source is an actionable cleanup error, without a growing blacklist
// of historical filenames or assertions about private implementation spelling.
const sourceFiles = await listSourceFiles(resolve('src'));
const unused = sourceFiles.filter((path) => (
  (extname(path) === '.js' && !graph.modules.has(path))
  || (extname(path) === '.css' && !graph.styles.has(path))
));
if (unused.length) {
  throw new Error(`Unused source files:\n${unused.map((path) => relative(process.cwd(), path)).join('\n')}`);
}

const home = pages.get('home');
const canvases = home.match(/<canvas\b[^>]*>/gi) ?? [];
if (canvases.length !== 1 || !/data-kinetic-canvas/.test(canvases[0])
  || !/aria-hidden="true"/.test(canvases[0]) || /\btabindex=/.test(canvases[0])) {
  throw new Error('Home must retain one decorative, non-focusable robot canvas.');
}
const hero = home.match(/<section class="hero-story"[\s\S]*?<\/section>/)?.[0] ?? '';
if (!hero.includes('data-hero-surface') || /<fieldset|<input|<button/i.test(hero)) {
  throw new Error('Home must retain its static surface and automatic motion behavior.');
}

const thing = await readFile('work/thing/index.html', 'utf8');
for (const story of ['demos', 'prototype', 'pipeline', 'architecture']) {
  const tag = thing.match(new RegExp(`<section\\b(?=[^>]*data-thing-story=["']${story}["'])[^>]*>`, 'i'))?.[0];
  if (!tag || /data-reveal/i.test(tag)) {
    throw new Error(`THING ${story} needs a single story controller, separate from generic reveal.`);
  }
}

console.log(`Verified ${SITE_ROUTES.length} routes, ${graph.modules.size} reachable modules and ${graph.styles.size} stylesheet boundaries.`);
