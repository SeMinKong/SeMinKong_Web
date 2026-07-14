import './styles/tokens.css';
import './styles/base.css';
import './styles/resume.css';
import './styles/motion.css';

import { initEnvironment } from './motion/environment.js';
import { initPageTransitions } from './motion/page-transitions.js';
import { initIntro, initReveals } from './motion/reveal.js';
import { initNavigation } from './ui/navigation.js';

const environment = initEnvironment();

initNavigation(environment);
initPageTransitions(environment);
initIntro(environment, '[data-resume-intro]');
initReveals(environment, '[data-resume-reveal]', { distance: 22, threshold: 0.08 });
