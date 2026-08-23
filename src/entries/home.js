import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/portfolio-shared.css';
import '../styles/home.css';
import '../styles/site-fluid.css';
import '../styles/motion.css';

import { createPageRuntime } from '../app/create-page-runtime.js';
import { initCursorLabel } from '../motion/cursor-label.js';
import { initHeroFluid } from '../motion/hero-fluid.js';
import { initHeroStory } from '../motion/hero-story.js';
import { initHomeIntro } from '../motion/home-intro.js';
import { initProjectDeck } from '../motion/project-deck.js';
import { initReveals } from '../motion/reveal.js';
import { initSiteFluid } from '../motion/site-fluid.js';

const runtime = createPageRuntime();
const { environment } = runtime;
const homeIntro = runtime.register(initHomeIntro(environment));
const siteFluid = runtime.register(initSiteFluid(environment, {
  profile: 'home',
  ready: homeIntro
}));

runtime.start({ smoothScrollAfter: homeIntro });
runtime.register(initCursorLabel(environment));
runtime.register(initHeroFluid(siteFluid));
runtime.register(initHeroStory(environment));
runtime.register(initReveals(environment, '[data-reveal]', { threshold: 0.08 }));
runtime.register(initProjectDeck(environment));

if (import.meta.hot) import.meta.hot.dispose(() => runtime.destroy());
