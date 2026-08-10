import { access, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const expectedFiles = [
  'index.html',
  'favicon.svg',
  'work/index.html',
  'work/thing/index.html',
  'work/aqis/index.html',
  'work/brain-tumor-mri/index.html',
  'work/alkkagi/index.html',
  'work/briefit/index.html',
  'work/project-prompt-generator/index.html',
  'about/index.html',
  'resume/index.html',
  'resume/SeMinKong-Resume.pdf',
  'resume/SeMinKong-Resume.docx',
  'resume/SeMinKong-Resume-page-1.png'
];

const distDirectory = resolve('dist');
const absoluteAssetPattern = /(?:href|src)=["']\/(?!\/)/g;

await Promise.all(expectedFiles.map((file) => access(resolve(distDirectory, file))));

const htmlFiles = expectedFiles.filter((file) => file.endsWith('.html'));
const invalidFiles = [];

for (const file of htmlFiles) {
  const html = await readFile(resolve(distDirectory, file), 'utf8');
  if (absoluteAssetPattern.test(html)) invalidFiles.push(file);
  absoluteAssetPattern.lastIndex = 0;
}

if (invalidFiles.length) {
  throw new Error(`Root-absolute asset paths remain in: ${invalidFiles.join(', ')}`);
}

console.log(`Verified ${expectedFiles.length} deployment entries in dist/.`);
