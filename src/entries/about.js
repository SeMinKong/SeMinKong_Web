import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/about.css';
import '../styles/site-fluid.css';
import '../styles/motion.css';

import { createPageRuntime } from '../app/create-page-runtime.js';
import { initIntro, initReveals } from '../motion/reveal.js';
import { initSiteFluid } from '../motion/site-fluid.js';
import { initToolLogos } from '../ui/tool-logos.js';

const runtime = createPageRuntime();
const { environment } = runtime;

initToolLogos();
runtime.start();
runtime.register(initSiteFluid(environment, { profile: 'about' }));
runtime.register(initIntro(environment, '[data-about-intro]'));
runtime.register(initReveals(environment, '[data-about-reveal]', { threshold: 0.08 }));

if (import.meta.hot) import.meta.hot.dispose(() => runtime.destroy());
