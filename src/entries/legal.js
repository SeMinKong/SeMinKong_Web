import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/legal.css';
import '../styles/site-fluid.css';
import '../styles/motion.css';

import { createPageRuntime } from '../app/create-page-runtime.js';
import { initIntro, initReveals } from '../motion/reveal.js';
import { initSiteFluid } from '../motion/site-fluid.js';

const runtime = createPageRuntime();
const { environment } = runtime;

runtime.start();
runtime.register(initSiteFluid(environment, { profile: 'legal' }));
runtime.register(initIntro(environment, '[data-legal-intro]'));
runtime.register(initReveals(environment, '[data-legal-reveal]', { threshold: 0.08 }));

if (import.meta.hot) import.meta.hot.dispose(() => runtime.destroy());
