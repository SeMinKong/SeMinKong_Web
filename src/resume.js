import './styles/tokens.css';
import './styles/base.css';
import './styles/resume.css';
import './styles/motion.css';

import { initEnvironment } from './motion/environment.js';
import { initPageTransitions } from './motion/page-transitions.js';
import { initIntro, initReveals } from './motion/reveal.js';
import { initSmoothScroll } from './motion/smooth-scroll.js';
import { initNavigation } from './ui/navigation.js';
import { initMagnetic } from './motion/magnetic.js';
import { initNameEmphasis } from './motion/name-emphasis.js';
import { initSignalThread } from './motion/signal-thread.js';

const environment = initEnvironment();

initSmoothScroll(environment);
initNavigation(environment);
initMagnetic(environment);
initNameEmphasis(environment);
initSignalThread(environment);
initPageTransitions(environment);
initIntro(environment, '[data-resume-intro]');
initReveals(environment, '[data-resume-reveal]', { distance: 22, threshold: 0.08 });
