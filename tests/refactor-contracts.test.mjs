import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import {
  EXPECTED_DEPLOYMENT_FILES,
  SITE_ROUTES
} from '../config/site-routes.js';
import {
  DISPLAY_NAME,
  INTRO_WORDMARK_STROKES
} from '../src/motion/home-intro-wordmark.js';

test('route manifest keeps unique build inputs and outputs', () => {
  assert.equal(SITE_ROUTES.length, 11);
  assert.equal(new Set(SITE_ROUTES.map(({ name }) => name)).size, SITE_ROUTES.length);
  assert.equal(new Set(SITE_ROUTES.map(({ source }) => source)).size, SITE_ROUTES.length);
  assert.equal(new Set(SITE_ROUTES.map(({ output }) => output)).size, SITE_ROUTES.length);
  assert.equal(SITE_ROUTES.filter(({ kind }) => kind === 'case-study').length, 6);
  assert.equal(EXPECTED_DEPLOYMENT_FILES.length, 16);
});

test('handwritten wordmark preserves its public name and stroke order', () => {
  assert.equal(DISPLAY_NAME, 'Se Min Kong');
  assert.deepEqual(
    INTRO_WORDMARK_STROKES.map(({ letter }) => letter),
    ['S', 'e', 'M', 'i', 'n', 'K', 'o', 'n', 'g']
  );

  const strokes = INTRO_WORDMARK_STROKES.flatMap(({ strokes: letterStrokes }) => letterStrokes);
  assert.equal(strokes.length, 12);
  const totalWeight = strokes.reduce((total, { weight }) => total + weight, 0);
  assert.ok(Math.abs(totalWeight - 9.4) < 1e-10);
  assert.ok(strokes.every(({ d, weight }) => d.startsWith('M') && weight > 0));
});

test('gallery direction keeps static surfaces and restrained typography', async () => {
  const [homeHtml, galleryStyles, tokenStyles, deckSource] = await Promise.all([
    readFile(new URL('../index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/gallery-surface.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/tokens.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/project-deck.js', import.meta.url), 'utf8')
  ]);

  assert.match(homeHtml, /data-hero-surface/);
  assert.doesNotMatch(homeHtml, /data-hero-fluid|<canvas\b/i);
  assert.match(galleryStyles, /body::before/);
  assert.match(galleryStyles, /repeating-linear-gradient/);
  assert.match(tokenStyles, /Signika Variable/);
  assert.match(tokenStyles, /font-weight: 300 700/);
  assert.match(tokenStyles, /Jua/);
  assert.match(tokenStyles, /jua-korean-400-normal\.woff2/);
  assert.doesNotMatch(tokenStyles, /Asta Sans Variable|Geist Mono Variable|Dongle|Gowun Dodum/);
  assert.match(deckSource, /pointerover/);
  assert.match(deckSource, /focusin/);
  assert.match(deckSource, /restoreInputState/);
  assert.match(deckSource, /pointerInside = false/);
  assert.doesNotMatch(deckSource, /pointermove|FLUID_OBSTACLE_EVENT/);
});

test('GSAP choreography stays route-scoped and keeps static fallbacks', async () => {
  const [homeEntry, caseEntry, thingHtml, workHtml, homeStyles, workStyles, caseStyles, heroStory, workStory, thingStory, gsapLoader, mediaPlayback, smoothScroll] = await Promise.all([
    readFile(new URL('../src/entries/home.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/entries/case-study.js', import.meta.url), 'utf8'),
    readFile(new URL('../work/thing/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../work/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/home.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/work.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/case-study.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/hero-story.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/work-story.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/thing-story.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/gsap-loader.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/media-playback.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/smooth-scroll.js', import.meta.url), 'utf8')
  ]);

  assert.match(homeEntry, /initHeroStory\(environment, \{ ready: homeIntro \}\)/);
  assert.match(caseEntry, /initThingStory\(environment, \{ smoothScroll \}\)/);
  assert.match(heroStory, /await loadGsap\(\)/);
  assert.match(heroStory, /readySettled\s*&&\s*pageActive/);
  assert.match(heroStory, /Promise\.resolve\(ready\)/);
  assert.match(heroStory, /data-scroll-story-active/);
  assert.match(heroStory, /min-width: 961px/);
  assert.match(heroStory, /min-height: 620px/);
  assert.match(homeStyles, /height: 155svh/);
  assert.doesNotMatch(homeStyles, /SCROLL TO ENTER THE EXHIBITION/);
  assert.doesNotMatch(heroStory, /\.to\(actions,\s*\{\s*autoAlpha:\s*0/s);
  assert.match(heroStory, /\.set\(actions, \{\s*pointerEvents: 'none'/s);
  assert.match(heroStory, /removeProperty\('pointer-events'\)/);
  assert.match(homeStyles, /focus-within \[data-hero-actions\][\s\S]*?pointer-events: auto !important/);
  assert.match(homeStyles, /\.home-page \.hero-story \{[\s\S]*?height: 100svh/);
  assert.match(homeStyles, /\.home-page \.hero-story\[data-scroll-story-active\] \{[\s\S]*?height: 155svh/);
  assert.doesNotMatch(homeStyles, /data-scroll-story-active\] \.hero-story__sticky::after/);
  assert.match(heroStory, /removeAttribute\('data-scroll-story-active'\)/);
  assert.doesNotMatch(heroStory, /--hero-progress/);
  assert.match(workHtml, /data-work-showcase/);
  assert.match(workHtml, /data-work-viewport/);
  assert.match(workHtml, /data-work-track/);
  assert.equal(workHtml.match(/class="work-row__chapter"/g)?.length, 6);
  assert.equal(workHtml.match(/data-work-beat/g)?.length, 6);
  assert.equal(workHtml.match(/data-work-artifact/g)?.length, 6);
  assert.equal(workHtml.match(/data-work-title/g)?.length, 6);
  assert.equal(workHtml.match(/data-work-placard/g)?.length, 6);
  assert.match(workHtml, /id="work-list" tabindex="-1" data-work-viewport/);
  assert.match(workStory, /min-width: 961px/);
  assert.match(workStory, /min-height: 640px/);
  assert.match(workStory, /Promise\.all\(\[[\s\S]*?loadGsapWithSplitText\(\),[\s\S]*?document\.fonts\?\.ready/);
  assert.match(workStory, /SplitText\.create\(title/);
  assert.match(workStory, /split\.revert\(\)/);
  assert.match(workStory, /const RAIL_SCRUB = 0\.62/);
  assert.match(workStory, /const SCENE_SCRUB = 0\.35/);
  assert.match(workStory, /hold: 0\.38/);
  assert.match(workStory, /handoff: 0\.7/);
  assert.match(workStory, /x: \(\) => -getTravel\(\)/);
  assert.match(workStory, /pin: true/);
  assert.match(workStory, /pinSpacing: true/);
  assert.match(workStory, /containerAnimation: horizontalTween/);
  assert.match(workStory, /updateStoryProgress\(this\.progress\(\)\)/);
  assert.match(workStory, /horizontalTween\?\.progress\(progress\)/);
  assert.match(workStory, /timeline\.to\(sceneClock, \{ duration: 1, ease: 'none', progress: 1 \}, 0\)/);
  assert.match(workStory, /list\.addEventListener\('focusin', handleFocusIn\)/);
  assert.match(workStory, /list\.removeEventListener\('focusin', handleFocusIn\)/);
  assert.match(workStory, /smoothScroll\.scrollTo\(targetScroll, \{ immediate: true \}\)/);
  assert.match(workStory, /window\.scrollTo\(\{ top: targetScroll, behavior: 'auto' \}\)/);
  assert.match(smoothScroll, /lenis\.scrollTo\(target, \{ force: true, immediate \}\)/);
  assert.match(smoothScroll, /window\.scrollTo\(\{ top: target, behavior: immediate \? 'auto' : 'smooth' \}\)/);
  assert.match(workStory, /stageFrom\.clipPath = 'inset\(8% 6% round 2px\)'/);
  assert.match(workStory, /stageExit\.clipPath = 'inset\(6% 4% round 2px\)'/);
  assert.match(workStory, /rotateX:/);
  assert.match(workStory, /stagger: \{ amount: 0\.08, from: 'start' \}/);
  assert.doesNotMatch(workStory, /stagger: \{ each:/);
  assert.doesNotMatch(workStory, /-92|\b82\b|\* 2\.4/);
  assert.match(workStory, /querySelector\('\[data-work-artifact\]'\)/);
  assert.doesNotMatch(workStory, /querySelector(?:All)?\([^)]*(?:video|img)/);
  assert.match(workStyles, /\.work-showcase\.work-story-enabled \.work-showcase__viewport \{[\s\S]*?height: calc\(100svh - var\(--nav-height\)\);[\s\S]*?overflow: clip/);
  assert.match(workStyles, /\.work-list\.work-story-enabled \{[\s\S]*?width: max-content;[\s\S]*?display: flex/);
  assert.match(workStyles, /\.work-showcase__header::after \{[\s\S]*?height: 2px;[\s\S]*?scaleX\(var\(--work-progress, 0\)\)/);
  assert.match(workStyles, /\.work-row__composition::after \{[\s\S]*?scaleX\(var\(--work-connector-progress, 0\.12\)\)/);
  assert.match(workStyles, /\.work-row:focus-within[\s\S]*?translate: none !important;[\s\S]*?rotate: none !important;[\s\S]*?scale: none !important;[\s\S]*?transition: none !important/);
  assert.match(workStyles, /flex: 0 0 clamp\(1000px, 102vw, 1420px\)/);
  assert.match(workStyles, /\.work-list\.work-story-enabled \.work-row__copy \{\s*display: contents/);
  assert.match(workStyles, /--work-title-size: clamp\(4\.75rem, 8vw, 7rem\)/);
  assert.match(workStyles, /--work-title-featured-size: clamp\(5\.75rem, 10\.5vw, 8\.25rem\)/);
  assert.match(workStyles, /@media \(max-width: 840px\) \{[\s\S]*?\.work-index__hero \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/);
  assert.doesNotMatch(workStyles, /14\.5vw|9\.6vw|7\.3vw|6\.8vw/);
  assert.doesNotMatch(workStyles, /border-right: 1px solid var\(--line-strong\)/);
  assert.match(workStory, /removeProperty\('--work-progress'\)/);
  assert.match(workStory, /removeProperty\('--work-connector-progress'\)/);
  assert.match(workStory, /removeProperty\('translate'\)/);
  assert.match(workStory, /refreshApiAfterStop\.refresh\(\)/);
  assert.match(workStory, /classList\.remove\('work-story-enabled'\)/);
  assert.match(workStory, /if \(!pageActive\) \{\s*if \(!context\) stop\(\);\s*return;/s);
  assert.doesNotMatch(workStory, /filter: 'brightness|preventDefault\(|snap:/);
  assert.match(thingStory, /\.thing-demo-card__media/);
  assert.match(thingStory, /\.thing-evidence-media/);
  assert.match(thingStory, /min-width: 1021px/);
  assert.match(thingStory, /min-height: 640px/);
  assert.match(thingStory, /--flow-progress/);
  assert.match(caseStyles, /min-height: max\(760px, 108svh\)/);
  assert.match(caseStyles, /\.case-section \{[\s\S]*?grid-template-columns: minmax\(200px, 0\.48fr\) minmax\(0, 1\.52fr\)/);
  assert.match(caseStyles, /@media \(max-width: 840px\) \{[\s\S]*?\.case-section,[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(caseStyles, /\.case-metrics strong \{\s*font-size: clamp\(2\.35rem, 12\.5vw, 2\.8rem\)/);
  assert.match(caseStyles, /\.thing-story-enabled \.thing-demo-card \{[\s\S]*?position: sticky/);
  assert.match(caseStyles, /\.thing-story-enabled \.thing-demo-card__chapter \{[\s\S]*?display: block/);
  assert.match(caseStyles, /\.thing-story-enabled \.thing-demo-card__media::before \{[\s\S]*?var\(--demo-frame-progress\)/);
  assert.match(caseStyles, /\.thing-story-enabled \.thing-demo-card__media video \{[\s\S]*?max-height: calc\(100svh - var\(--nav-height\) - 90px\)/);
  assert.match(caseStyles, /\.thing-story-enabled #system-path \.case-flow::before \{[\s\S]*?width: 2px;[\s\S]*?scaleY\(var\(--flow-progress, 0\)\)/);
  assert.equal(thingHtml.match(/thing-demo-card__chapter/g)?.length, 4);
  for (const chapter of ['01 / 04', '02 / 04', '03 / 04', '04 / 04']) {
    assert.match(thingHtml, new RegExp(chapter.replace('/', '\\/')));
  }
  assert.match(thingStory, /\.fromTo\(media, \{ '--demo-frame-progress': 0 \}/);
  assert.doesNotMatch(thingStory, /\.fromTo\(media,\s*\{[^}]*\b(?:autoAlpha|opacity|scale|y)\b/s);
  assert.doesNotMatch(thingStory, /\.to\(media,\s*\{[^}]*\b(?:autoAlpha|opacity|scale|y)\b/s);
  assert.doesNotMatch(thingStory, /\bvideo\b/i);
  assert.match(mediaPlayback, /demoObserver = new IntersectionObserver/);
  assert.match(mediaPlayback, /entry\.target\.pause\(\)/);
  assert.match(thingStory, /removeProperty\('visibility'\)/);
  assert.match(thingStory, /removeProperty\('--demo-frame-progress'\)/);
  assert.match(thingStory, /removeProperty\('--flow-progress'\)/);
  assert.match(thingStory, /classList\.remove\('thing-story-enabled'\)/);
  assert.match(workStory, /removeProperty\('clip-path'\)/);
  for (const source of [heroStory, thingStory]) {
    assert.doesNotMatch(source, /pin:/);
    assert.doesNotMatch(source, /SplitText/);
  }
  for (const source of [heroStory, workStory, thingStory]) {
    assert.doesNotMatch(source, /snap:|ScrollSmoother|\bFlip\b/);
    assert.match(source, /addEventListener\('visibilitychange', onVisibilityChange\)/);
    assert.match(source, /removeEventListener\('visibilitychange', onVisibilityChange\)/);
    assert.match(source, /if \(!pageActive\) \{\s*if \(!context\) stop\(\);\s*return;/s);
  }
  for (const story of ['demos', 'prototype', 'pipeline', 'architecture']) {
    const section = thingHtml.match(
      new RegExp(`<section\\b(?=[^>]*data-thing-story=["']${story}["'])[^>]*>`, 'i')
    )?.[0];
    assert.ok(section);
    assert.doesNotMatch(section, /data-reveal/i);
  }
  assert.match(
    caseStyles,
    /html\.js \.case-section:not\(\.is-revealed\):not\(\[data-thing-story\]\) h2/
  );
  assert.match(gsapLoader, /promise = null;/);
  assert.match(gsapLoader, /\.catch\(\(error\) =>\s*\{\s*promise = null;/s);
  assert.match(gsapLoader, /import\('gsap\/SplitText\.js'\)/);
  assert.match(gsapLoader, /splitTextPromise = null;/);
  assert.match(gsapLoader, /\.catch\(\(error\) =>\s*\{\s*splitTextPromise = null;/s);
  assert.doesNotMatch(gsapLoader, /Flip|ScrollSmoother/);
});
