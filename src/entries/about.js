import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/about.css';
import '../styles/tech-stack.css';
import '../styles/gallery-surface.css';
import '../styles/motion.css';

import { createPageRuntime } from '../app/create-page-runtime.js';
import { initIntro, initReveals } from '../motion/reveal.js';
import { initLearningStackAnchor } from '../ui/learning-stack-anchor.js';

const runtime = createPageRuntime();
const { environment } = runtime;

const stackAnchor = runtime.register(initLearningStackAnchor('now-title'));
runtime.start({ smoothScrollAfter: stackAnchor?.ready });
if (!stackAnchor) runtime.register(initIntro(environment, '[data-about-intro]'));
runtime.register(initReveals(environment, '[data-about-reveal]', { threshold: 0.08 }));

if (import.meta.hot) import.meta.hot.dispose(() => runtime.destroy());
