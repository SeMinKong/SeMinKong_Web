import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/resume.css';
import '../styles/motion.css';

import { createPageRuntime } from '../app/create-page-runtime.js';
import { initIntro, initReveals } from '../motion/reveal.js';

const runtime = createPageRuntime();
const { environment } = runtime;

runtime.start();
runtime.register(initIntro(environment, '[data-resume-intro]'));
runtime.register(initReveals(environment, '[data-resume-reveal]', { threshold: 0.08 }));

if (import.meta.hot) import.meta.hot.dispose(() => runtime.destroy());
