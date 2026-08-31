import '../styles/tokens.css';
import '../styles/base.css';
import '../styles/portfolio-shared.css';
import '../styles/home.css';
import '../styles/kinetic-home.css';
import '../styles/gallery-surface.css';
import '../styles/motion.css';

import { createPageRuntime } from '../app/create-page-runtime.js';
import { initHomeIntro } from '../motion/home-intro.js';
import { initKineticSandbox } from '../motion/kinetic-sandbox.js';
import { initProjectDeck } from '../motion/project-deck.js';
import { initReveals } from '../motion/reveal.js';

const runtime = createPageRuntime();
const { environment } = runtime;
const homeIntro = runtime.register(initHomeIntro(environment));

runtime.start({ smoothScrollAfter: homeIntro });
runtime.register(initKineticSandbox(environment, { ready: homeIntro }));
runtime.register(initReveals(environment, '[data-reveal]', { threshold: 0.08 }));
runtime.register(initProjectDeck(environment));

if (import.meta.hot) import.meta.hot.dispose(() => runtime.destroy());
