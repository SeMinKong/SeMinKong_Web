import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/case-study.css';
import '../styles/motion.css';

import { createPageRuntime } from '../app/create-page-runtime.js';
import { initDepthEffects } from '../motion/depth.js';
import { initMediaPlayback } from '../motion/media-playback.js';
import { initIntro, initReveals } from '../motion/reveal.js';

const runtime = createPageRuntime();
const { environment } = runtime;

runtime.start();
runtime.register(initIntro(environment, '[data-intro]'));
runtime.register(initReveals(environment, '[data-reveal]', { threshold: 0.08 }));
runtime.register(initDepthEffects(environment));
runtime.register(initMediaPlayback(environment));

if (import.meta.hot) import.meta.hot.dispose(() => runtime.destroy());
