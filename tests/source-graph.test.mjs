import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { listSourceFiles, readSourceGraph } from '../scripts/lib/source-graph.mjs';

const fixture = async (t, files) => {
  const directory = await mkdtemp(join(tmpdir(), 'portfolio-source-graph-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await Promise.all(Object.entries(files).map(([name, source]) => writeFile(join(directory, name), source)));
  return directory;
};

test('source graph follows static, re-export and lazy imports through cycles in CSS order', async (t) => {
  const directory = await fixture(t, {
    'entry.js': `import './first.css';
      import { value } from './shared.js';
      export * from './exports.js';
      export { value as other } from './shared.js';
      import './second.css';
      const load = () => import('./lazy.js?mode=preview');`,
    'shared.js': `import './entry.js'; export const value = 1;`,
    'exports.js': `export const name = 'portfolio';`,
    'lazy.js': `import './lazy.css'; import 'animejs';`,
    'first.css': '', 'second.css': '', 'lazy.css': ''
  });
  const entry = join(directory, 'entry.js');
  const graph = await readSourceGraph([entry]);
  assert.equal(graph.modules.size, 4);
  assert.deepEqual(graph.modules.get(entry).imports, [
    'first.css', 'shared.js', 'exports.js', 'shared.js', 'second.css', 'lazy.js'
  ].map((name) => join(directory, name)));
  assert.deepEqual([...graph.styles], ['first.css', 'second.css', 'lazy.css'].map((name) => join(directory, name)));
});

test('comments, strings, templates and regular expressions are not module dependencies', async (t) => {
  const directory = await fixture(t, {
    'entry.js': [
      `// import './comment.js';`,
      `/* export * from './block.js'; */`,
      `const example = "import('./string.js')";`,
      'const template = `import("./template.js")`;',
      String.raw`const pattern = /import\('.\/regex.js'\)/;`,
      `export const load = () => import('./real.js');`
    ].join('\n'),
    'real.js': 'export const value = 1;'
  });
  const graph = await readSourceGraph([join(directory, 'entry.js')]);
  assert.equal(graph.modules.size, 2);
  assert.deepEqual(graph.modules.get(join(directory, 'entry.js')).imports, [join(directory, 'real.js')]);
});

test('source graph rejects missing modules and computed imports rather than silently skipping them', async (t) => {
  const directory = await fixture(t, {
    'missing.js': `import './absent.js';`,
    'computed.js': `export const load = (name) => import(name);`
  });
  await assert.rejects(readSourceGraph([join(directory, 'missing.js')]), { code: 'ENOENT' });
  await assert.rejects(readSourceGraph([join(directory, 'computed.js')]), /literal module specifiers/);
});

test('source inventory includes nested unused files for reachability verification', async (t) => {
  const directory = await fixture(t, { 'entry.js': '' });
  await mkdir(join(directory, 'nested'));
  await writeFile(join(directory, 'nested', 'unused.js'), '');
  assert.deepEqual((await listSourceFiles(directory)).sort(), [
    join(directory, 'entry.js'), join(directory, 'nested', 'unused.js')
  ].sort());
});
