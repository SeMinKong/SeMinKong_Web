import './styles/tokens.css';
import './styles/base.css';
import './styles/about.css';
import './styles/motion.css';

import { initEnvironment } from './motion/environment.js';
import { initPageTransitions } from './motion/page-transitions.js';
import { initIntro, initReveals } from './motion/reveal.js';
import { initSmoothScroll } from './motion/smooth-scroll.js';
import { initNavigation } from './ui/navigation.js';
import { initMagnetic } from './motion/magnetic.js';
import { initNameEmphasis } from './motion/name-emphasis.js';
import { initSignalThread } from './motion/signal-thread.js';
import { initToolLogos } from './ui/tool-logos.js';

const environment = initEnvironment();

initToolLogos();
initSmoothScroll(environment);
initNavigation(environment);
initMagnetic(environment);
initNameEmphasis(environment);
initSignalThread(environment);
initPageTransitions(environment);
initIntro(environment, '[data-about-intro]');
initReveals(environment, '[data-about-reveal]', { distance: 28, threshold: 0.08 });
