import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const originals = [
  { name: 'thing', width: 3502, height: 2298, anchor: 'system-design', hash: 'FB547330C9067CB146E9C28D9E7C617A765B58C2DDD686FFC46ACAD144050A0E' },
  { name: 'aqis', width: 1419, height: 1031, anchor: 'aqis-architecture', hash: '234498EAA2A7EF7C00037477A5CDF8672E88C91D0EA715F669C7EE2B97DBC1C3' }
];
const read = (path, encoding) => readFile(new URL(`../${path}`, import.meta.url), encoding);

for (const { name, width, height, hash } of originals) {
  test(`${name} original architecture PNG remains preserved`, async () => {
    const asset = `src/assets/projects/${name}/architecture.png`;
    const [png, original] = await Promise.all([
      read(asset), read(`scripts/portfolio/assets/${name}-architecture-source.png`)
    ]);
    assert.deepEqual(png, original, 'keep the source PNG alongside the new display SVG');
    assert.equal(createHash('sha256').update(png).digest('hex').toUpperCase(), hash);
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a');
    assert.equal(png.readUInt32BE(16), width);
    assert.equal(png.readUInt32BE(20), height);
  });
}

const projects = [
  { name: 'thing', route: 'thing', width: 3502, height: 2298, photos: 6, hash: 'b26d5f32ab7ea4ddc3ead11ebc55a16d7f6874df49da15e3fa0960b23917b88b' },
  { name: 'aqis', route: 'aqis', width: 1419, height: 1031, photos: 0, hash: '9fcfd52ed853fe569ccd59354fc4cb1f65531641d65138074b172954237f74ca' },
  { name: 'alkkagi', route: 'alkkagi', width: 5556, height: 4064, photos: 0, hash: '6fd9998a5e56cc7df5b9d7385be3f27734c10a5448f2fc67d1ec3590a49875ab' },
  { name: 'briefit', route: 'briefit', width: 5560, height: 4052, photos: 0, hash: 'f1f3c2ae2758d349eb68d9bbdd18a884a5bb320095aff162bf6798a9faea0c00' },
  { name: 'brain-mri', route: 'brain-tumor-mri', width: 5336, height: 4036, photos: 0, hash: 'e9af4fc9a978e36324370550cae6bdfda4a62c9f77f6e5786cbbe9ad0312e615' },
  { name: 'prompt-generator', route: 'project-prompt-generator', width: 5416, height: 4110, photos: 0, hash: '3ff9c6920a99cdf4a10bad7824a6e92fb9ff6254a39e6d264cc1973d86419212' }
];

for (const { name, route, width, height, photos, hash } of projects) {
  test(`${name} displays its approved standalone SVG directly`, async () => {
    const asset = `src/assets/projects/${name}/architecture.svg`;
    const [svg, html] = await Promise.all([read(asset, 'utf8'), read(`work/${route}/index.html`, 'utf8')]);
    assert.equal(createHash('sha256').update(svg).digest('hex'), hash);
    assert.ok(svg.includes(`viewBox="0 0 ${width} ${height}"`));
    assert.match(svg, /<path\b/);
    assert.match(svg, /<title\b/);
    assert.doesNotMatch(svg, /<script\b|<foreignObject\b|\son[a-z]+\s*=|<!DOCTYPE|<!ENTITY/i);
    const embedded = [...svg.matchAll(/\b(?:href|xlink:href)="([^"]+)"/g)];
    assert.equal((svg.match(/<image\b/g) ?? []).length, photos);
    assert.equal(embedded.length, photos);
    for (const [, href] of embedded) assert.match(href, /^data:image\/png;base64,[A-Za-z0-9+/=]+$/);

    const figures = [...html.matchAll(/<figure class="case-architecture"[^>]*>[\s\S]*?<\/figure>/g)];
    assert.equal(figures.length, 1);
    const figure = figures[0][0];
    const image = figure.match(/<img\b[^>]*>/)?.[0] ?? '';
    assert.ok(image.includes(`src="/${asset}"`));
    assert.ok(image.includes(`width="${width}" height="${height}"`));
    assert.match(image, /alt="[^"]+"/);
    assert.match(image, /loading="eager" decoding="async"/);
    assert.match(figure, /^<figure class="case-architecture">\s*<img\b[^>]*>\s*<\/figure>$/);
    assert.doesNotMatch(figure, /data-reveal|<a\b|<figcaption\b/);
    const original = originals.find(item => item.name === name);
    if (original) {
      assert.ok(html.includes(`href="#${original.anchor}"`));
      assert.ok(html.includes(`id="${original.anchor}"`));
    }
  });
}
