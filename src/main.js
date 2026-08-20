import './styles/tokens.css';
import './styles/base.css';
import './styles/site.css';
import './styles/motion.css';

import { initEnvironment } from './motion/environment.js';
import { initDepthEffects } from './motion/depth.js';
import { initHeroStory } from './motion/hero-story.js';
import { initMediaPlayback } from './motion/media-playback.js';
import { initPageTransitions } from './motion/page-transitions.js';
import { initProjectDeck } from './motion/project-deck.js';
import { initDexterousHand } from './motion/dexterous-hand.js';
import { initIntro, initReveals } from './motion/reveal.js';
import { initScrollKinetics } from './motion/scroll-kinetics.js';
import { initSmoothScroll } from './motion/smooth-scroll.js';
import { initNavigation } from './ui/navigation.js';
import { initMagnetic } from './motion/magnetic.js';
import { initNameEmphasis } from './motion/name-emphasis.js';
import { initCursorLabel } from './motion/cursor-label.js';

const environment = initEnvironment();

initSmoothScroll(environment);
initNavigation(environment);
initMagnetic(environment);
initNameEmphasis(environment);
initCursorLabel(environment);
initPageTransitions(environment);
initDexterousHand(environment);
initHeroStory(environment);
initIntro(environment, '[data-intro]');
initReveals(environment, '[data-reveal]', { distance: 36, threshold: 0.08 });
initProjectDeck(environment);
initDepthEffects(environment);
initScrollKinetics(environment);
initMediaPlayback(environment);
