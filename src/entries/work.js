import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/portfolio-shared.css';
import '../styles/work.css';
import '../styles/gallery-surface.css';
import '../styles/motion.css';

import { createPageRuntime } from '../app/create-page-runtime.js';
import { initReveals } from '../motion/reveal.js';
import { initWorkStory } from '../motion/work-story.js';

const runtime = createPageRuntime();
const { environment } = runtime;

const smoothScroll = runtime.start();
runtime.register(initWorkStory(environment, { smoothScroll }));
runtime.register(initReveals(environment, '[data-reveal]', { threshold: 0.08 }));

if (import.meta.hot) import.meta.hot.dispose(() => runtime.destroy());
