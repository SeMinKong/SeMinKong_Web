import './styles/tokens.css';
import './styles/base.css';
import './styles/site.css';
import './styles/case-study.css';
import './styles/motion.css';

import { initEnvironment } from './motion/environment.js';
import { initDepthEffects } from './motion/depth.js';
import { initMediaPlayback } from './motion/media-playback.js';
import { initPageTransitions } from './motion/page-transitions.js';
import { initIntro, initReveals } from './motion/reveal.js';
import { initScrollKinetics } from './motion/scroll-kinetics.js';
import { initSmoothScroll } from './motion/smooth-scroll.js';
import { initNavigation } from './ui/navigation.js';

const environment = initEnvironment();

initSmoothScroll(environment);
initNavigation(environment);
initPageTransitions(environment);
initIntro(environment, '[data-intro]');
initReveals(environment, '[data-reveal]', { distance: 34, threshold: 0.08 });
initDepthEffects(environment);
initScrollKinetics(environment);
initMediaPlayback(environment);
