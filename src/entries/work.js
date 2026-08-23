import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/portfolio-shared.css';
import '../styles/work.css';
import '../styles/motion.css';

import { createPageRuntime } from '../app/create-page-runtime.js';
import { initCursorLabel } from '../motion/cursor-label.js';
import { initDepthEffects } from '../motion/depth.js';
import { initMediaPlayback } from '../motion/media-playback.js';
import { initIntro, initReveals } from '../motion/reveal.js';
import { initScrollKinetics } from '../motion/scroll-kinetics.js';
import { initWorkStory } from '../motion/work-story.js';

const runtime = createPageRuntime();
const { environment } = runtime;

const smoothScroll = runtime.start();
runtime.register(initWorkStory(environment, { smoothScroll }));
runtime.register(initCursorLabel(environment));
runtime.register(initIntro(environment, '[data-intro]'));
runtime.register(initReveals(environment, '[data-reveal]', { threshold: 0.08 }));
runtime.register(initDepthEffects(environment));
runtime.register(initScrollKinetics(environment));
runtime.register(initMediaPlayback(environment));

if (import.meta.hot) import.meta.hot.dispose(() => runtime.destroy());
