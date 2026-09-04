import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { SITE_ROUTES } from '../config/site-routes.js';

const ORIGIN = 'https://seminkong.github.io';
const BASE_PATH = '/SeMinKong_Web';
const SOCIAL_IMAGE = `${ORIGIN}${BASE_PATH}/social/portfolio-1200x630.jpg`;

const sourceUrl = (path) => new URL(`../${path}`, import.meta.url);
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const exactlyOne = (html, pattern, label) => {
  const matches = html.match(new RegExp(pattern, 'g')) ?? [];
  assert.equal(matches.length, 1, `${label} should exist exactly once`);
  return matches[0];
};
const contentOf = (tag) => tag.match(/\bcontent="([^"]*)"/)?.[1] ?? '';
const hrefOf = (tag) => tag.match(/\bhref="([^"]*)"/)?.[1] ?? '';
const canonicalFor = ({ output }) => {
  const routePath = output === 'index.html' ? '/' : `/${output.replace(/index\.html$/, '')}`;
  return `${ORIGIN}${BASE_PATH}${routePath}`;
};

const sha256Of = async (file) => createHash('sha256')
  .update(await readFile(sourceUrl(file)))
  .digest('hex')
  .toUpperCase();

const readWebpDimensions = async (file) => {
  const buffer = await readFile(sourceUrl(file));
  assert.equal(buffer.toString('ascii', 0, 4), 'RIFF', `${file} must be RIFF`);
  assert.equal(buffer.toString('ascii', 8, 12), 'WEBP', `${file} must be WebP`);

  let offset = 12;
  while (offset + 8 <= buffer.length) {
    const type = buffer.toString('ascii', offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const dataOffset = offset + 8;

    if (type === 'VP8 ') {
      assert.equal(buffer.toString('hex', dataOffset + 3, dataOffset + 6), '9d012a');
      return {
        width: buffer.readUInt16LE(dataOffset + 6) & 0x3fff,
        height: buffer.readUInt16LE(dataOffset + 8) & 0x3fff
      };
    }

    if (type === 'VP8X') {
      return {
        width: buffer.readUIntLE(dataOffset + 4, 3) + 1,
        height: buffer.readUIntLE(dataOffset + 7, 3) + 1
      };
    }

    if (type === 'VP8L') {
      assert.equal(buffer[dataOffset], 0x2f, `${file} must have a valid VP8L signature`);
      const dimensions = buffer.readUInt32LE(dataOffset + 1);
      return {
        width: (dimensions & 0x3fff) + 1,
        height: ((dimensions >>> 14) & 0x3fff) + 1
      };
    }

    offset = dataOffset + size + (size % 2);
  }

  assert.fail(`${file} has no supported WebP dimensions chunk`);
};

test('every route ships one canonical and complete share metadata', async () => {
  const canonicals = new Set();

  for (const route of SITE_ROUTES) {
    const html = await readFile(sourceUrl(route.source), 'utf8');
    const title = exactlyOne(html, '<title>[^<]+</title>', `${route.name} title`)
      .replace(/^<title>|<\/title>$/g, '');
    const description = contentOf(exactlyOne(
      html,
      '<meta name="description" content="[^"]+" \/>',
      `${route.name} description`
    ));
    const canonical = hrefOf(exactlyOne(
      html,
      '<link rel="canonical" href="[^"]+" \/>',
      `${route.name} canonical`
    ));

    assert.equal(canonical, canonicalFor(route));
    assert.ok(canonical.endsWith('/'));
    assert.ok(!canonicals.has(canonical), `${canonical} should be unique`);
    canonicals.add(canonical);

    const requiredMeta = new Map([
      ['name="robots"', 'index,follow,max-image-preview:large'],
      ['property="og:site_name"', 'Se Min Kong Portfolio'],
      ['property="og:locale"', 'ko_KR'],
      ['property="og:title"', title],
      ['property="og:description"', description],
      ['property="og:url"', canonical],
      ['property="og:image"', SOCIAL_IMAGE],
      ['property="og:image:type"', 'image/jpeg'],
      ['property="og:image:width"', '1200'],
      ['property="og:image:height"', '630'],
      ['name="twitter:card"', 'summary_large_image'],
      ['name="twitter:image"', SOCIAL_IMAGE]
    ]);

    for (const [selector, expected] of requiredMeta) {
      const tag = exactlyOne(
        html,
        `<meta ${escapeRegExp(selector)} content="[^"]+" \\/>`,
        `${route.name} ${selector}`
      );
      assert.equal(contentOf(tag), expected);
    }

    assert.match(html, /<meta property="og:image:alt" content="[^"]+" \/>/);
    assert.match(html, /<meta name="twitter:title" content="[^"]+" \/>/);
    assert.match(html, /<meta name="twitter:description" content="[^"]+" \/>/);
    assert.match(html, /<meta name="twitter:image:alt" content="[^"]+" \/>/);
  }

  const sitemap = await readFile(sourceUrl('public/sitemap.xml'), 'utf8');
  const locations = new Set(Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), ([, url]) => url));
  assert.deepEqual(locations, canonicals);
  await access(sourceUrl('public/social/portfolio-1200x630.jpg'));
});

test('media geometry, loading, and approved public Resume files stay explicit', async () => {
  for (const route of SITE_ROUTES) {
    const html = await readFile(sourceUrl(route.source), 'utf8');

    for (const image of html.match(/<img\b[^>]*>/g) ?? []) {
      assert.match(image, /\bwidth="\d+"/, `${route.name} image needs width`);
      assert.match(image, /\bheight="\d+"/, `${route.name} image needs height`);
    }

    for (const video of html.match(/<video\b[^>]*>/g) ?? []) {
      assert.match(video, /\bwidth="\d+"/, `${route.name} video needs width`);
      assert.match(video, /\bheight="\d+"/, `${route.name} video needs height`);
      assert.match(video, /\bplaysinline\b/, `${route.name} video needs playsinline`);
      assert.match(video, /\bpreload="none"/, `${route.name} video should not preload`);
      if (/\bcontrols\b/.test(video)) {
        assert.match(video, /\bposter="[^"]+"/, `${route.name} controlled video needs poster`);
        assert.match(video, /\baria-label="[^"]+"/, `${route.name} controlled video needs a label`);
        assert.match(video, /\bdata-demo-video\b/, `${route.name} controlled video needs lifecycle management`);
      }
      if (/\bdata-auto-video\b/.test(video)) {
        assert.match(video, /\bmuted\b/);
        assert.match(video, /\bloop\b/);
        assert.match(video, /\baria-hidden="true"/);
      }
    }
  }

  const [resume, resumeStyles, resumeEntry, awardDialogSource] = await Promise.all([
    readFile(sourceUrl('resume/index.html'), 'utf8'),
    readFile(sourceUrl('src/styles/resume.css'), 'utf8'),
    readFile(sourceUrl('src/entries/resume.js'), 'utf8'),
    readFile(sourceUrl('src/ui/award-proof-dialog.js'), 'utf8')
  ]);
  assert.match(resume, /\.\/SeMinKong-Resume\.pdf/);
  assert.match(resume, /\.\/SeMinKong-Resume\.docx/);
  assert.match(resume, /\.\/SeMinKong-Resume-page-1\.png/);
  assert.match(resume, /href="\.\/SeMinKong-Resume\.pdf" download="Se-Min-Kong-Resume\.pdf"/);
  assert.match(resume, /href="\.\/SeMinKong-Resume\.docx" download="Se-Min-Kong-Resume\.docx"/);
  assert.match(resume, /href="\.\/SeMinKong-Resume\.pdf" target="_blank" rel="noreferrer"/);
  assert.match(resume, /aria-label="원본 이력서 PDF를 새 탭에서 열기"/);
  assert.match(resume, /width="1241" height="1754" loading="lazy" decoding="async"/);
  assert.doesNotMatch(resume, /개인정보를 최소화/);
  assert.match(resumeStyles, /\.resume-contact\s*\{[^}]*gap:\s*0;[^}]*line-height:\s*1\.35;/s);
  assert.match(resumeStyles, /\.resume-contact\s*>\s*a,[^{]*\.resume-contact\s*>\s*span\s*\{[^}]*min-height:\s*36px;[^}]*overflow-wrap:\s*anywhere;/s);
  assert.match(resumeStyles, /@media\s*\(pointer:\s*coarse\)\s*\{\s*\.resume-contact a\s*\{[^}]*min-height:\s*44px;/s);
  assert.match(resumeStyles, /\.resume-block\.resume-original\s*\{[^}]*row-gap:\s*24px;/s);
  assert.match(resumeStyles, /\.resume-original__content\s*\{[^}]*grid-column:\s*1\s*\/\s*-1;[^}]*width:\s*min\(100%,\s*808px\);[^}]*justify-self:\s*center;/s);
  assert.equal(resume.match(/<dialog\b/g)?.length, 1);
  assert.match(resume, /<dialog class="award-dialog"[^>]*data-award-dialog[^>]*data-lenis-prevent[^>]*aria-labelledby="award-dialog-title"[^>]*aria-describedby="award-dialog-caption"/);
  assert.match(resume, /data-award-dialog-image width="1240" height="1755"/);
  assert.match(resumeEntry, /runtime\.register\(initAwardProofDialog\(\)\)/);
  assert.match(awardDialogSource, /typeof dialog\.showModal !== 'function'/);
  assert.match(awardDialogSource, /closeButton\.focus\(\{ preventScroll: true \}\)/);
  assert.match(awardDialogSource, /triggerToRestore\.focus\(\{ preventScroll: true \}\)/);
  assert.match(awardDialogSource, /!panel\.contains\(event\.target\)/);
  assert.match(awardDialogSource, /document\.addEventListener\('pointerdown', onPointerDown, true\)/);
  assert.match(awardDialogSource, /event\.key !== 'Tab'/);
  assert.match(awardDialogSource, /event\.preventDefault\(\)/);
  assert.match(resumeStyles, /\.award-dialog__image\s*\{[^}]*width:\s*auto;[^}]*height:\s*auto;[^}]*object-fit:\s*contain;/s);
  assert.match(resumeStyles, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.award-dialog::backdrop\s*\{[^}]*animation:\s*none;/);

  const proofButtons = resume.match(/<button\b[^>]*data-award-proof[^>]*>/g) ?? [];
  assert.equal(proofButtons.length, 4);
  assert.equal((resume.match(/>상장 보기 /g) ?? []).length, 4);
  assert.doesNotMatch(resume, /증빙 보기|수상 증빙|증빙 이미지/);
  assert.match(resume, /Award gallery/);
  assert.doesNotMatch(resume, /Award evidence/i);
  assert.doesNotMatch(awardDialogSource, /수상 증빙|증빙 이미지/);
  for (const button of proofButtons) {
    assert.match(button, /type="button"/);
    assert.match(button, /aria-haspopup="dialog"/);
    assert.match(button, /aria-controls="award-proof-dialog"/);
    assert.match(button, /data-proof-title="[^"]+"/);
    assert.match(button, /data-proof-caption="[^"]*전시용 이미지입니다\.[^"]+"/);
  }

  const awardFiles = [
    ['award-ssafy-common-project.webp', 1240, 1755, 'CFEA27E549987D9EF3758E66AC3534F2F55DBD2462D0AB035E9AAAC0B9999A9F'],
    ['award-it-project-pro-league.webp', 1240, 1755, '610CD537EAAFEBE5610003A7941E2F058E1C04B82129569015D584287A3AA983'],
    ['award-capstone-design.webp', 1239, 1758, '149AA5AEE5EBA3058E89065F5DF095DB0558FCBDBB29A6C03E325A984F642A69'],
    ['award-software-competition.webp', 1240, 1755, '5868CA69CAAF69751580FD464890E587294DFCD9727FB10DF05A35A10C83C20B']
  ];
  for (const [filename, expectedWidth, expectedHeight, expectedHash] of awardFiles) {
    const reference = proofButtons.find((button) => button.includes(`data-proof-src="./${filename}"`));
    assert.ok(reference, `${filename} needs one proof trigger`);
    assert.match(reference, new RegExp(`data-proof-width="${expectedWidth}"`));
    assert.match(reference, new RegExp(`data-proof-height="${expectedHeight}"`));
    const dimensions = await readWebpDimensions(`public/resume/${filename}`);
    assert.deepEqual(dimensions, { width: expectedWidth, height: expectedHeight });
    assert.ok(dimensions.height > dimensions.width, `${filename} must be portrait`);
    assert.equal(await sha256Of(`public/resume/${filename}`), expectedHash, `${filename} must match the manually audited redaction`);
  }

  for (const file of [
    'public/resume/SeMinKong-Resume.pdf',
    'public/resume/SeMinKong-Resume.docx',
    'public/resume/SeMinKong-Resume-page-1.png',
    ...awardFiles.map(([filename]) => `public/resume/${filename}`)
  ]) {
    await access(sourceUrl(file));
  }

  const [viteConfig, distVerifier] = await Promise.all([
    readFile(sourceUrl('vite.config.js'), 'utf8'),
    readFile(sourceUrl('scripts/verify-dist.mjs'), 'utf8')
  ]);
  assert.match(viteConfig, /emptyOutDir:\s*true/);
  assert.match(distVerifier, /Production Resume directory contains private or unapproved files/);
});

test('progressive navigation and motion remain optional and non-blocking', async () => {
  const [homeHtml, workHtml, homeIntro, kineticFacade, kineticRuntime, mediaPlayback, transitionSource, motionStyles, homeStyles, kineticStyles, workStyles, workStory, workEntry, sharedStyles] = await Promise.all([
    readFile(sourceUrl('index.html'), 'utf8'),
    readFile(sourceUrl('work/index.html'), 'utf8'),
    readFile(sourceUrl('src/motion/home-intro.js'), 'utf8'),
    readFile(sourceUrl('src/motion/kinetic-sandbox.js'), 'utf8'),
    readFile(sourceUrl('src/motion/kinetic-sandbox-runtime.js'), 'utf8'),
    readFile(sourceUrl('src/motion/media-playback.js'), 'utf8'),
    readFile(sourceUrl('src/motion/page-transitions.js'), 'utf8'),
    readFile(sourceUrl('src/styles/motion.css'), 'utf8'),
    readFile(sourceUrl('src/styles/home.css'), 'utf8'),
    readFile(sourceUrl('src/styles/kinetic-home.css'), 'utf8'),
    readFile(sourceUrl('src/styles/work.css'), 'utf8'),
    readFile(sourceUrl('src/motion/work-story.js'), 'utf8'),
    readFile(sourceUrl('src/entries/work.js'), 'utf8'),
    readFile(sourceUrl('src/styles/portfolio-shared.css'), 'utf8')
  ]);

  const heroSection = homeHtml.match(/<section class="hero-story"[\s\S]*?<\/section>/)?.[0] ?? '';

  assert.doesNotMatch(homeHtml, /AI &amp; Robotics Software Developer/);
  assert.match(homeHtml, /<span data-hero-line>안녕하세요!<\/span>/);
  assert.match(homeHtml, /<span data-hero-line>새로운 것을 배우고 직접 만드는 일이 즐겁습니다\.<\/span>/);
  assert.doesNotMatch(heroSection, /<em>/);
  assert.match(kineticStyles, /\.home-page \.hero-identity__statement \{[\s\S]*?font-family: var\(--font-display\)/);
  assert.doesNotMatch(homeStyles, /\.hero-identity__statement em/);
  assert.doesNotMatch(kineticStyles, /\.home-page \.hero-identity__statement em/);
  assert.match(homeHtml, /href="\.\/work\/" aria-label="프로젝트 목록 보기">프로젝트/);
  assert.match(homeHtml, /href="#contact" aria-label="연락처 바로가기">Contact/);
  assert.doesNotMatch(homeHtml, /hero-identity__support/);
  assert.doesNotMatch(homeHtml, /Flagship/i);
  assert.match(heroSection, /data-kinetic-stage/);
  assert.equal(heroSection.match(/data-kinetic-canvas/g)?.length, 1);
  assert.equal(heroSection.match(/class="kinetic-object /g)?.length, 7);
  assert.doesNotMatch(heroSection, /THING|Signal Lab|signal-lab|data-hero-proof|<fieldset|<input|<button/i);
  assert.doesNotMatch(heroSection, /GRAB|THROW|RESET|PAUSE|SCATTER/i);
  assert.match(kineticStyles, /place-items: center/);
  assert.match(kineticStyles, /\.kinetic-stage \{[\s\S]*?position: absolute/);
  assert.match(kineticStyles, /\.kinetic-stage__canvas \{[\s\S]*?touch-action: pan-y pinch-zoom/);
  assert.match(kineticFacade, /Promise\.resolve\(ready\)/);
  assert.match(kineticFacade, /environment\.motion !== 'reduced'/);
  assert.match(kineticRuntime, /OBJECT_SPECS/);
  assert.match(kineticRuntime, /gravity\.scale = 0/);
  assert.doesNotMatch(homeHtml, /data-home-intro|__homeIntroGate|aria-busy/);
  assert.doesNotMatch(homeIntro, /preventDefault|stopImmediatePropagation|setAttribute\('inert'/);
  assert.match(homeIntro, /passive: true/);
  assert.match(homeIntro, /const SIGNATURE_DURATION = 1500;/);
  assert.match(homeIntro, /const totalDuration = SIGNATURE_DURATION;/);

  for (const html of [homeHtml, workHtml]) {
    const script = exactlyOne(
      html,
      '<script type="speculationrules">[\\s\\S]*?<\/script>',
      'speculation rules'
    );
    const rules = JSON.parse(script.replace(/^<script type="speculationrules">|<\/script>$/g, '').trim());
    assert.ok(Array.isArray(rules.prefetch));
    assert.equal(rules.prefetch[0].eagerness, 'moderate');
    assert.equal('prerender' in rules, false);
  }

  assert.match(transitionSource, /'CSSViewTransitionRule' in window/);
  assert.match(motionStyles, /@view-transition\s*\{\s*navigation: auto;/s);
  assert.match(motionStyles, /prefers-reduced-motion: no-preference/);
  assert.match(mediaPlayback, /addEventListener\('pagehide', pauseOnPageHide\)/);
  assert.match(mediaPlayback, /addEventListener\('pageshow', syncOnPageShow\)/);
  assert.match(mediaPlayback, /environment\.motion === 'full'/);
  assert.match(workStyles, /\.work-row__media-stage,[\s\S]*?grid-row: 2;/);
  assert.match(workStyles, /\.work-row__copy,[\s\S]*?grid-row: 1;/);
  assert.match(sharedStyles, /\.work-row__copy > p \{[\s\S]*?font-family: var\(--font-body\)/);
  assert.match(workStyles, /--work-title-featured-size: clamp\(4\.25rem, 8vw, 5\.42rem\)/);
  assert.match(workHtml, /work-story-pending/);
  assert.match(workHtml, /workStoryExpired/);
  assert.match(workHtml, /}, 1500\);/);
  assert.doesNotMatch(workHtml, /<h1 data-intro lang="en">Projects<\/h1>/);
  assert.doesNotMatch(workEntry, /initIntro/);
  assert.match(workStory, /document\.fonts\.load\('700 1em "Signika Variable"', 'THING'\)/);
  assert.doesNotMatch(workStory, /document\.fonts\?\.ready/);
  assert.match(workStory, /focus\(\{ preventScroll: true \}\)/);
});
