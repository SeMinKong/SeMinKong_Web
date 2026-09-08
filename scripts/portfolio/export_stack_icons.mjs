// Shared, transparent SVG assets for the website and PDF Tech Stack page.
import * as icons from 'simple-icons';
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const root = new URL('../../src/assets/tech-stack/', import.meta.url);
await mkdir(root, { recursive: true });
const names = ['Cplusplus', 'Python', 'Ros', 'Pytorch', 'Opencv', 'Ultralytics', 'Huggingface',
  'Fastapi', 'Langchain', 'React', 'Typescript', 'Nodedotjs', 'Socketdotio',
  'Git', 'Ubuntu', 'Docker'];
const colors = { React: '168DA8', Huggingface: 'A97800', Langchain: '1C3C3C' };
for (const name of names) {
  const icon = icons[`si${name}`];
  const svg = icon.svg.replace('<svg ', `<svg fill="#${colors[name] ?? icon.hex}" `);
  await writeFile(new URL(`${name.toLowerCase()}.svg`, root), svg + '\n');
}

// Technology pictograms, not brand marks: these have no dedicated Simple Icon.
const pictograms = {
  dynamixel: '<rect x="4" y="6" width="16" height="13" rx="2"/><circle cx="12" cy="12.5" r="3.5"/><path d="M12 9v7M8.5 12.5h7M7 6V3m10 3V3M8 19v2m8-2v2"/>',
  websocket: '<path d="M4 8h15l-4-4m4 4-4 4M20 16H5l4 4m-4-4 4-4"/>',
  asyncio: '<path d="M20 10a8 8 0 1 0-2 7M20 4v6h-6"/><path d="M12 7v5l3 2"/>'
};
for (const [name, paths] of Object.entries(pictograms)) {
  await writeFile(new URL(`${name}.svg`, root),
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#625e56" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>\n`);
}

const packageRoot = new URL('../../node_modules/simple-icons/', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', packageRoot), 'utf8'));
const files = [...names.map(name => name.toLowerCase()), ...Object.keys(pictograms)].sort();
const sources = [];
for (const name of files) {
  const custom = name in pictograms;
  const bytes = await readFile(new URL(`${name}.svg`, root));
  sources.push({
    file: `${name}.svg`,
    kind: custom ? 'original functional pictogram' : 'Simple Icons brand mark',
    source: custom ? 'scripts/portfolio/export_stack_icons.mjs'
      : `https://github.com/simple-icons/simple-icons/blob/${version}/icons/${name}.svg`,
    sha256: createHash('sha256').update(bytes).digest('hex')
  });
}
await writeFile(new URL('sources.json', root), JSON.stringify({
  simple_icons_version: version, brand_paths_license: 'CC0-1.0', icons: sources
}, null, 2) + '\n');
await copyFile(new URL('LICENSE.md', packageRoot), new URL('LICENSE-simple-icons.md', root));
