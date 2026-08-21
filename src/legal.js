import './styles/tokens.css';
import './styles/base.css';
import './styles/legal.css';
import './styles/motion.css';

import { initEnvironment } from './motion/environment.js';
import { initPageTransitions } from './motion/page-transitions.js';
import { initIntro, initReveals } from './motion/reveal.js';
import { initSmoothScroll } from './motion/smooth-scroll.js';
import { initNavigation } from './ui/navigation.js';
import { initMagnetic } from './motion/magnetic.js';
import { initNameEmphasis } from './motion/name-emphasis.js';

const environment = initEnvironment();

initSmoothScroll(environment);
initNavigation(environment);
initMagnetic(environment);
initNameEmphasis(environment);
initPageTransitions(environment);
initIntro(environment, '[data-legal-intro]');
initReveals(environment, '[data-legal-reveal]', { distance: 24, threshold: 0.08 });
