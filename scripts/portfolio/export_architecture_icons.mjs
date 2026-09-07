// Exact transparent brand paths from the repository's pinned Simple Icons package.
import * as icons from 'simple-icons';
import { mkdir, writeFile } from 'node:fs/promises';
const names = ['Python', 'React', 'Typescript', 'Nodedotjs', 'Express', 'Socketdotio',
  'Pytorch', 'Opencv', 'Ultralytics', 'Huggingface', 'Fastapi', 'Langchain',
  'Html5', 'Css', 'Javascript', 'Markdown'];
const root = new URL('./assets/architecture/icons/', import.meta.url);
await mkdir(root, { recursive: true });
for (const name of names) {
  const icon = icons[`si${name}`];
  const color = name === 'Huggingface' ? 'C38C00' : icon.hex;
  const svg = icon.svg.replace('<svg ', `<svg fill="#${color}" `);
  await writeFile(new URL(`${name.toLowerCase()}.svg`, root), svg + '\n');
}
await writeFile(new URL('../icons-source.json', root), JSON.stringify({
  package: 'simple-icons', version: '16.28.0', license: 'CC0-1.0',
  source: 'https://github.com/simple-icons/simple-icons',
  icons: names.map(name => ({ name, source: icons[`si${name}`].source }))
}, null, 2) + '\n');
