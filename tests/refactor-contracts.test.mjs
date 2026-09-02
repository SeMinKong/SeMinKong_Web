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
  assert.equal(EXPECTED_DEPLOYMENT_FILES.length, SITE_ROUTES.length + 7);
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
  assert.doesNotMatch(homeHtml, /data-hero-fluid/i);
  assert.equal(homeHtml.match(/<canvas\b/g)?.length, 1);
  assert.match(homeHtml, /<canvas\b(?=[^>]*data-kinetic-canvas)(?=[^>]*aria-hidden="true")(?=[^>]*tabindex="-1")[^>]*>/i);
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

test('motion runtimes stay route-scoped and keep static fallbacks', async () => {
  const [homeEntry, caseEntry, thingHtml, workHtml, homeStyles, kineticStyles, workStyles, caseStyles, kineticFacade, kineticRuntime, workStory, thingStory, gsapLoader, mediaPlayback, smoothScroll] = await Promise.all([
    readFile(new URL('../src/entries/home.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/entries/case-study.js', import.meta.url), 'utf8'),
    readFile(new URL('../work/thing/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../work/index.html', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/home.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/kinetic-home.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/work.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/styles/case-study.css', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/kinetic-sandbox.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/kinetic-sandbox-runtime.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/work-story.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/thing-story.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/gsap-loader.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/media-playback.js', import.meta.url), 'utf8'),
    readFile(new URL('../src/motion/smooth-scroll.js', import.meta.url), 'utf8')
  ]);

  assert.match(homeEntry, /initKineticSandbox\(environment, \{ ready: homeIntro \}\)/);
  assert.doesNotMatch(homeEntry, /initHeroStory|gsap-loader/);
  assert.match(caseEntry, /initThingStory\(environment, \{ smoothScroll \}\)/);
  assert.match(kineticFacade, /import\('\.\/kinetic-sandbox-runtime\.js'\)/);
  assert.match(kineticFacade, /environment\.motion !== 'reduced'/);
  assert.match(kineticFacade, /forced-colors: active/);
  assert.match(kineticFacade, /new IntersectionObserver/);
  assert.match(kineticFacade, /addEventListener\('visibilitychange'/);
  assert.match(kineticFacade, /addEventListener\('pagehide'/);
  assert.match(kineticFacade, /addEventListener\('pageshow'/);
  assert.match(kineticFacade, /queuedIntent/);
  assert.match(kineticRuntime, /from 'pixi\.js'/);
  assert.match(kineticRuntime, /from 'matter-js'/);
  assert.match(kineticRuntime, /preference: 'webgl'/);
  assert.match(kineticRuntime, /autoStart: false/);
  assert.match(kineticRuntime, /const PHYSICS_SUBSTEPS = 2/);
  assert.match(kineticRuntime, /Engine\.update\(engine, PHYSICS_SUBSTEP\)/);
  assert.match(kineticRuntime, /interpolatePose\(state\.previous, state\.current, alpha\)/);
  assert.match(kineticRuntime, /handwritten-wordmark__letter/);
  assert.match(kineticRuntime, /getTextFragmentRects/);
  assert.match(kineticRuntime, /hero-story__actions \.button/);
  assert.match(kineticRuntime, /const shadowLayer = new Container/);
  assert.match(kineticRuntime, /getWorldLight\(pose, viewport/);
  assert.match(kineticRuntime, /enableSleeping: true/);
  assert.match(kineticRuntime, /new ResizeObserver/);
  assert.match(kineticRuntime, /canvas\.style\.touchAction = 'pan-y pinch-zoom'/);
  assert.match(kineticRuntime, /webglcontextlost/);
  assert.match(kineticRuntime, /webglcontextrestored/);
  assert.doesNotMatch(kineticRuntime, /setPointerCapture|requestAnimationFrame/);
  assert.doesNotMatch(kineticRuntime, /handlePointer(?:Down|Move|Up|Cancel)[\s\S]{0,700}preventDefault\(/);
  assert.match(kineticStyles, /height: 100svh/);
  assert.match(kineticStyles, /touch-action: pan-y pinch-zoom/);
  assert.match(kineticStyles, /html\[data-motion="reduced"\] \.kinetic-stage__canvas/);
  assert.doesNotMatch(kineticStyles, /position: fixed|138svh|155svh/);
  assert.doesNotMatch(homeEntry + kineticFacade + kineticRuntime, /loadGsap|ScrollTrigger|SplitText/);
  assert.doesNotMatch(homeStyles, /SCROLL TO ENTER THE EXHIBITION/);
  assert.match(workHtml, /data-work-showcase/);
  assert.match(workHtml, /data-work-viewport/);
  assert.match(workHtml, /data-work-track/);
  assert.doesNotMatch(workHtml, /work-row__chapter|data-work-current|Scroll to browse|06 projects/);
  assert.equal(workHtml.match(/data-work-beat/g)?.length, 6);
  assert.equal(workHtml.match(/data-work-artifact/g)?.length, 6);
  assert.equal(workHtml.match(/data-work-title/g)?.length, 6);
  assert.equal(workHtml.match(/data-work-placard/g)?.length, 6);
  assert.equal(workHtml.match(/class="work-row__summary"/g)?.length, 6);
  assert.equal(workHtml.match(/class="work-row__cta"/g)?.length, 6);
  assert.equal(workHtml.match(/class="work-row__composition"/g)?.length, 6);
  assert.doesNotMatch(workHtml, /work-row__proofs|aria-label="주요 기술"|work-row__media-caption|work-row__arrow/);
  assert.match(workHtml, /id="work-list" tabindex="-1" data-work-viewport/);
  assert.match(workStory, /min-width: 961px/);
  assert.match(workStory, /min-height: 640px/);
  assert.match(workStory, /Promise\.all\(\[[\s\S]*?loadGsapWithSplitText\(\),[\s\S]*?waitForTitleFont\(\)/);
  assert.match(workStory, /document\.fonts\.load\('700 1em "Signika Variable"', 'THING'\)/);
  assert.doesNotMatch(workStory, /document\.fonts\?\.ready/);
  assert.match(workStory, /SplitText\.create\(title/);
  assert.match(workStory, /split\.revert\(\)/);
  assert.match(workStory, /const RAIL_SCRUB = 0\.62/);
  assert.doesNotMatch(workStory, /SCENE_SCRUB/);
  assert.match(workStory, /hold: 0\.3/);
  assert.match(workStory, /handoff: 0\.52/);
  assert.match(workStory, /x: \(\) => -getTravel\(\)/);
  assert.match(workStory, /pin: true/);
  assert.match(workStory, /pinSpacing: true/);
  assert.match(workStory, /containerAnimation: horizontalTween/);
  assert.match(workStory, /start: 'left 102%'/);
  assert.match(workStory, /containerAnimation: horizontalTween,[\s\S]*?scrub: true/);
  assert.match(workStory, /updateStoryProgress\(this\.progress\(\)\)/);
  assert.match(workStory, /horizontalTween\?\.progress\(progress\)/);
  assert.match(workStory, /masterTrigger\?\.getTween\?\.\(\)\?\.progress\(1\)/);
  assert.match(workStory, /remainingFrames = 2/);
  assert.doesNotMatch(workStory, /index === activeIndex/);
  assert.match(workStory, /timeline\.to\(sceneClock, \{ duration: 1, ease: 'none', progress: 1 \}, 0\)/);
  assert.match(workStory, /list\.addEventListener\('focusin', handleFocusIn\)/);
  assert.match(workStory, /list\.removeEventListener\('focusin', handleFocusIn\)/);
  assert.match(workStory, /focus\(\{ preventScroll: true \}\)/);
  assert.match(workStory, /smoothScroll\.scrollTo\(targetScroll, \{ immediate: true \}\)/);
  assert.match(workStory, /window\.scrollTo\(\{ top: targetScroll, behavior: 'auto' \}\)/);
  assert.match(smoothScroll, /lenis\.scrollTo\(target, \{ force: true, immediate \}\)/);
  assert.match(smoothScroll, /window\.scrollTo\(\{ top: target, behavior: immediate \? 'auto' : 'smooth' \}\)/);
  assert.match(workStory, /autoAlpha: 0,[\s\S]*?scale: 0\.96/);
  assert.match(workStory, /gsap\.set\(stage, stageFrom\)/);
  assert.match(workStory, /stageFrom\.clipPath = 'inset\(8% 6% round 2px\)'/);
  assert.match(workStory, /stageExit\.clipPath = 'inset\(6% 4% round 2px\)'/);
  assert.match(workStory, /rotateX:/);
  assert.match(workStory, /stagger: \{ amount: 0\.06, from: 'start' \}/);
  assert.match(workStory, /stagger: \{ amount: 0\.05, from: 'end' \}/);
  assert.doesNotMatch(workStory, /stagger: \{ each:/);
  assert.doesNotMatch(workStory, /opacity: 0\.(?:22|25|28|32|35|42)/);
  assert.doesNotMatch(workStory, /-92|\b82\b|\* 2\.4/);
  assert.match(workStory, /querySelector\('\[data-work-artifact\]'\)/);
  assert.doesNotMatch(workStory, /querySelector(?:All)?\([^)]*(?:video|img)/);
  assert.match(workStyles, /\.work-showcase\.work-story-enabled \.work-showcase__viewport \{[\s\S]*?height: calc\(100svh - var\(--nav-height\)\);[\s\S]*?overflow: clip/);
  assert.match(workStyles, /\.work-list\.work-story-enabled \{[\s\S]*?width: max-content;[\s\S]*?display: flex/);
  assert.doesNotMatch(workStyles, /work-showcase__header|--work-progress|--work-connector-progress/);
  assert.match(workStyles, /\.work-row:focus-within[\s\S]*?translate: none !important;[\s\S]*?rotate: none !important;[\s\S]*?scale: none !important;[\s\S]*?transition: none !important/);
  assert.match(workStyles, /flex: 0 0 clamp\(1000px, 102vw, 1420px\)/);
  assert.match(workStyles, /\.work-list\.work-story-enabled \.work-row:last-child \{\s*flex-basis: clamp\(1000px, 100vw, 1420px\)/);
  assert.match(workStyles, /padding-inline: max\(40px, calc\(\(100vw - var\(--page-max\)\) \/ 2\)\);/);
  assert.match(workStyles, /\.work-list\.work-story-enabled \.work-row__copy \{\s*display: contents/);
  assert.match(workStyles, /--work-title-size: clamp\(3\.75rem, 6\.6vw, 5rem\)/);
  assert.match(workStyles, /--work-title-featured-size: clamp\(4\.25rem, 8vw, 5\.42rem\)/);
  assert.match(workStyles, /\.work-list\.work-story-enabled \.work-row__summary \{[\s\S]*?grid-column: 8 \/ 12/);
  assert.match(workStyles, /\.work-list\.work-story-enabled \.work-row__cta \{[\s\S]*?grid-row: 4 \/ 5/);
  assert.match(workStyles, /\.work-row__summary \{[\s\S]*?font-family: var\(--font-body\);[\s\S]*?font-weight: var\(--weight-support\)/);
  assert.match(workHtml, /work-story-pending/);
  assert.match(workHtml, /workStoryExpired/);
  assert.match(workStory, /data-work-story-expired/);
  assert.match(workStory, /data-work-story-ready/);
  assert.match(workStyles, /@media \(max-width: 840px\) \{[\s\S]*?\.work-index__hero \{[\s\S]*?grid-template-columns: minmax\(0, 1fr\)/);
  assert.doesNotMatch(workStyles, /14\.5vw|9\.6vw|7\.3vw|6\.8vw/);
  assert.doesNotMatch(workStyles, /border-right: 1px solid var\(--line-strong\)/);
  assert.doesNotMatch(workStory, /--work-progress|--work-connector-progress/);
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
  for (const source of [thingStory]) {
    assert.doesNotMatch(source, /pin:/);
    assert.doesNotMatch(source, /SplitText/);
  }
  for (const source of [workStory, thingStory]) {
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
