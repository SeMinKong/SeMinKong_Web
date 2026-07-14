import './styles/tokens.css';
import './styles/base.css';
import './styles/about.css';
import './styles/motion.css';

import { initEnvironment } from './motion/environment.js';
import { initPageTransitions } from './motion/page-transitions.js';
import { initIntro, initReveals } from './motion/reveal.js';
import { initSmoothScroll } from './motion/smooth-scroll.js';
import { initNavigation } from './ui/navigation.js';

const environment = initEnvironment();

initSmoothScroll(environment);
initNavigation(environment);
initPageTransitions(environment);
initIntro(environment, '[data-about-intro]');
initReveals(environment, '[data-about-reveal]', { distance: 28, threshold: 0.08 });
