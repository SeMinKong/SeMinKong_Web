import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const projects = [
  { name: 'thing', width: 3502, height: 2298, anchor: 'system-design', hash: 'FB547330C9067CB146E9C28D9E7C617A765B58C2DDD686FFC46ACAD144050A0E' },
  { name: 'aqis', width: 1419, height: 1031, anchor: 'aqis-architecture', hash: '234498EAA2A7EF7C00037477A5CDF8672E88C91D0EA715F669C7EE2B97DBC1C3' }
];
const read = (path, encoding) => readFile(new URL(`../${path}`, import.meta.url), encoding);

for (const { name, width, height, anchor, hash } of projects) {
  test(`${name} architecture keeps the approved PNG bytes and native full-size links`, async () => {
    const asset = `src/assets/projects/${name}/architecture.png`;
    const [png, original, html] = await Promise.all([
      read(asset), read(`scripts/portfolio/assets/${name}-architecture-source.png`), read(`work/${name}/index.html`, 'utf8')
    ]);
    assert.deepEqual(png, original, 'publish the preserved source, not a redrawn or recompressed copy');
    assert.equal(createHash('sha256').update(png).digest('hex').toUpperCase(), hash);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), width);
    assert.equal(png.readUInt32BE(20), height);

    const figures = [...html.matchAll(/<figure class="case-architecture"[^>]*>[\s\S]*?<\/figure>/g)];
    assert.equal(figures.length, 1);
    const figure = figures[0][0];
    const image = figure.match(/<img\b[^>]*>/)?.[0] ?? '';
    assert.ok(image.includes(`src="/${asset}"`));
    assert.ok(image.includes(`width="${width}" height="${height}"`));
    assert.match(image, /alt="[^"]+"/);
    assert.match(image, /loading="lazy" decoding="async"/);
    const links = [...figure.matchAll(/<a\b[^>]*>/g)].map(([tag]) => tag);
    assert.equal(links.length, 2, 'both image and caption open the full-size asset');
    for (const link of links) {
      assert.ok(link.includes(`href="/${asset}"`));
      assert.match(link, /target="_blank" rel="noopener"/);
    }
    assert.match(links[0], /aria-label="[^"]+원본 크기로 보기"/);
    assert.ok(html.includes(`href="#${anchor}"`));
    assert.ok(html.includes(`id="${anchor}"`));
  });
}
