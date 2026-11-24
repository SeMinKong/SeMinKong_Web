import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/case-study.css';
import '../styles/gallery-surface.css';
import '../styles/motion.css';

import { createPageRuntime } from '../app/create-page-runtime.js';
import { initMediaPlayback } from '../motion/media-playback.js';
import { initIntro, initReveals } from '../motion/reveal.js';
import { initThingStory } from '../motion/thing-story.js';
import { initArchitectureLightbox } from '../ui/architecture-lightbox.js';
import { initCaseLocalNav } from '../ui/case-local-nav.js';

const runtime = createPageRuntime();
const { environment } = runtime;

const smoothScroll = runtime.start();
runtime.register(initThingStory(environment, { smoothScroll }));
runtime.register(initIntro(environment, '[data-intro]'));
runtime.register(initReveals(environment, '[data-reveal]', { threshold: 0.08 }));
runtime.register(initMediaPlayback(environment));
runtime.register(initCaseLocalNav(environment));
runtime.register(initArchitectureLightbox());

if (import.meta.hot) import.meta.hot.dispose(() => runtime.destroy());
