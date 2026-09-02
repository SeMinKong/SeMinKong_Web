# Changelog

All notable changes to this project are recorded here. The project follows Semantic Versioning.

## [Unreleased]

### Changed

- Restored the original one-page Resume preview together with its PDF and DOCX actions after the owner explicitly approved republishing the original files.
- Tightened the Resume Hero contact cluster into three consistent rows while preserving larger link targets on touch devices.
- Centered the original Resume preview and its file actions independently of the left-hand section label column.

## [2.0.1] - 2026-08-24

### Fixed

- Kept the Home Site Fluid layer fixed above structural content in production by limiting the legacy Hero fluid surface to its pre-runtime sticky placeholder, removing the development-versus-build CSS ordering dependency.
- Pinned the local Vite server to `127.0.0.1:5173` with strict port handling so stale IPv4/IPv6 development processes cannot silently present different builds on the same numeric port.

### Changed

- Updated the Vite patch dependency from 8.2.1 to 8.2.2.

## [2.0.0] - 2026-08-24

### Added

- Added a Lannino-inspired micro-interaction layer (phase 1): line-masked title reveals for plain-text page and Home section headings that restore the original text after settling, spring-based magnetic pull on primary CTAs (full motion, fine pointer only), and a left-to-right underline slide on text links — all inert under reduced motion. Documented the adaptation boundaries in `docs/lannino-design-reference.md`.
- Added a name-emphasis layer: the Hero name enters letter by letter through a transient mask and, together with the header wordmark, plays a variable-weight hover wave; Focus keywords ignite a vermilion underline once revealed via a reusable `is-revealed` state class. Full-motion only; reduced keeps a static final state.
- Added pinned scroll scenes on desktop full motion: the THING demo gallery pins and swaps its four demonstrations as chapters with a progress readout and per-chapter muted autoplay, the Home Focus section pins into three display-type chapters, and numeric proof facts count up on first reveal — mobile, lite, and reduced motion keep the existing static layouts.
- Added a site-wide signal thread: a vermilion progress rail in the left margin that fills with scroll via GSAP ScrollTrigger (first approved GSAP use, lazily loaded on desktop non-reduced sessions only) and ignites a node as each section arrives, reversibly.
- Harmonized the Hero cube palette to warm charcoals with a single vermilion top face — the idle cycle reads calm, the scroll finale lands on the signal face — and removed the legacy green face declarations that no longer render.
- Completed the restrained micro-interaction suite: a cursor-follower `VIEW` chip over Work rows and Home deck cards, a 1.03x hover zoom on their media (case-study evidence frames excluded), reveal-driven ignition color on case-section labels and About method numerals via the `is-revealed` state, staggered Contact rows, and a press dip on magnetic buttons — all full-motion only with unchanged static states.
- Relaxed the motion-library rule with owner approval: Anime.js stays the default, and GSAP may be introduced per-pattern where it is clearly stronger (scrubbed scroll choreography, pinned sequences, repeated text splitting).

### Changed

- Extended the Paper Current material into one fixed, route-aware Site Fluid background across all eleven pages, with a dominant Home playground, restrained light-page profiles, and a dedicated dark case-study palette.
- Raised Pressure Ink to adaptive high/balanced/baseline simulation and dye resolutions with aspect-preserving 1536px caps, allocation fallback, sustained-frame-time downgrade, and complete idle sleep between ambient bursts on non-Home routes.
- Replaced the monolithic page bootstrap with six route-owned entries and a shared destroyable runtime, while preserving the existing Home, Work, case-study, About, Resume, and Copyright behavior.
- Upgraded Vite from 7.3.6 to 8.2.1 and refreshed the production dependencies and GitHub Actions used by the verified build and deployment pipeline.
- Split the former site-wide portfolio stylesheet into Home, Work, and intentional Home/Work shared layers; removed the remaining superseded Hand/Cube/Hero cascade and limited reduced-motion rules to the routes that use them.
- Made Lenis capability-gated and lazy, connected Work Story to it explicitly, and hardened async setup, HMR teardown, repeated BFCache lifecycle, and Home Intro-to-Fluid page transitions.
- Split the handwritten Intro, lite-fluid shader, and Pressure Ink renderer into readable wordmark, shader, configuration, WebGL-resource, sizing, and controller modules without changing their public contracts or rendering order.
- Centralized all eleven build routes in one manifest and expanded verification to reject stale entries, legacy CSS, cross-route bundle leakage, root-absolute deployment URLs, and missing local links or assets.
- Replaced the Home Hero robotic hand and cube finale with a centered `Paper Current` playground: a dependency-free WebGL2 ink field responds to pointer velocity and pressure waves while protecting the handwritten name and CTA with a measured quiet zone; lite, reduced-motion, offscreen, and WebGL-failure fallbacks remain scroll-safe.
- Replaced the rigid visible type system with locally hosted Dongle for rounded handwritten display/UI and Gowun Dodum for calm long-form text and metadata, while retaining Manrope only as the invisible metric for the unchanged handwritten Intro-to-Hero SVG handoff.
- Rebuilt the Home first-load wordmark as twelve ordered SVG strokes with a restrained letter-settle bounce, removed the pen-like nib, and enlarged the centered name before it shrinks into the Hero h1; the same handwritten geometry now remains in the final Hero without a font swap, and the public display name is consistently spaced as `Se Min Kong` while technical identifiers remain unchanged.
- Replaced the About Hero's repeated technology list with a personal Korean statement about enjoying learning, making, and validation.
- Balanced the Home Hero greeting so wide viewports no longer strand a single word on its last line, and let stacked project cards below 960px size to their content instead of holding the fixed deck height.
- Unified small mono-label tracking at 0.08em (display numerals keep 0.12em), consolidated body text onto shared `--type-body` tokens, and capped long-form paragraphs on case, resume, and copyright routes at a 640px `--measure`.
- Warmed the case-study and project media letterboxes from legacy green-tinted blacks to the charcoal palette, evened the contact-panel arrow spacing, and removed the orphaned Hero role styles.

- Removed the two inactive `max-width: 0px` style archives (the legacy tendon-driven hand geometry and the superseded precision-detail experiment) together with every selector no route renders — the pre-deck featured-work and proofs layout, the deck hint, the unused frame-label affordance, and leftover About/Resume/case-study styles — reducing the shipped CSS from 213 KB to 182 KB without changing any computed style.
- Dropped the design tokens and hand-local custom properties that only the removed legacy styles consumed.
- Removed the three THING source photos that the 1600px WebP and portrait delivery assets superseded.
- Consolidated the duplicated `clamp` and `springStep` helpers into a shared `src/motion/utils.js` while keeping every spring tuning value identical.

- Added a source-only `AI VISITOR NOTE` easter egg to the Copyright page without changing its visible layout or accessibility tree.

- Let the Home Hero cube flow from its scroll-synchronized finale into the existing coordinated manipulation loop through a short overlap, preserving continuous motion after scrolling ends without adding another turn.

- Extended the name-first Home Hero with a longer reading hold and a restrained scroll-synchronized cube finale, using one continuous eased Y rotation of one-and-a-half turns in full motion and one turn in lite/mobile while remaining static for reduced motion.

- Rebuilt the Home Hero around a name-and-hand opening state that rearranges into the full greeting and actions on scroll, while removing the robotic hand's visible ambient-light box.

- Reworked the browser-tab favicon into a high-contrast `SK` tile and versioned its URL across every route so browsers replace the cached legacy icon.

- Simplified the Copyright page by removing decorative section numbers, balancing the introductory copy, and eliminating duplicated list markers.

- Reframed the Resume profile around broad software, vision, robotics, backend, and hardware-integration experience; corrected THING to Jul–Aug 2026 across the site and synchronized downloadable Resume artifacts.
- Replaced the legacy signal-square brand mark with a shared `SK` monogram in the site header and favicon, and removed the old AI-and-robotics role wording from general page identity.
- Increased the Home section-title line box so descenders such as the `j` in `Projects` remain fully visible after the reveal animation.
- Replaced the Home Hero's role-and-location label and abstract capability slogan with a concise Korean greeting about enjoying learning and making new things.
- Strengthened the site-wide typographic hierarchy with bolder display, heading, action, body, and metadata weights while preserving responsive title fit and Korean readability.
- Synchronized the browser Resume and downloadable DOCX, PDF, and preview image, placing THING first with verified team-level robotics and edge-AI details, correcting the English PDF language metadata, and routing THING to the public GitHub Pages case study.
- Removed the remaining CSS-generated `SELECTED / 2026` subtitle from Home and centered the static mobile Hero hand so reduced-motion mode cannot create horizontal overflow.
- Simplified the Home Hero actions to a project archive link and an About link while keeping THING featured immediately below.
- Increased Home Hero action typography and replaced the simultaneous intro with a reversible scroll sequence that centers the initial name/hand pair, lifts both outer wrappers slightly, and reveals the role, two statement lines, and actions in order.
- Reframed the portfolio as a contemporary digital gallery with charcoal, bone paper, graphite, and restrained vermilion wayfinding accents.
- Converted the Home project deck into matte exhibition folios, the Work/About/Resume routes into paper catalogues, and case-study media into restrained gallery evidence frames without changing the existing interaction model.
- Stabilized lower-edge deck entry so rear cards no longer jump above the stack during the opening stagger.
- Replaced the About tool pills with a grouped monochrome logo catalogue, then refreshed it with the requested robotics, Isaac simulation, local-AI, and delivery stack plus an honest `llama.cpp` monogram fallback.
- Made essential Hero information visible on first paint and strengthened small captions, proof labels, file actions, and low-contrast interface details.
- Replaced curatorial exhibition labels and sentence-form display copy with concise, factual noun headings across Home, Work, About, Resume, Copyright, and every project case study.
- Removed full-height decorative dividers from the Home and About Heroes so both opening compositions use uninterrupted background fields.
- Added the minimal static-asset worker entry required for the validated Vite build to deploy without changing route behavior.
- Re-encoded the 51.53-second Brain Tumor MRI demonstration for web delivery at its original 1320×1032 frame, reducing it from 37.38 MB to 3.64 MB with fast-start playback.
- Routed pointer clicks on every Home and Work project preview through the card's existing single detail link.

## [1.3.0] - 2026-08-11

### Added

- Added a site-wide Copyright link and a bilingual copyright/use-policy page that permits personal non-commercial reference while defining restricted reuse.
- Added public THING final-demo video plus integrated-hand and Jetson MediaPipe evidence to the portfolio.
- Added an upright THING evidence photo and a 9:16 poster matched to the portrait demonstration.
- Added a visible-first THING demonstration gallery for motion range, finger wave, rigid can grasp, and soft-object grasp.

### Changed

- Added rights metadata to every route and identified the THING demonstration source media, team ownership, and repository license notice without overriding its own terms.
- Replaced the THING case Hero evidence with the side-by-side human-to-robot mimic scene and converted all five THING demonstrations from HEVC/HDR to compact 720×1280 H.264/SDR delivery files.
- Made manual THING demonstrations load on demand, pause one another, and stop when the page is hidden.
- Reworked Home, Work, and the THING case study into a numbered, evidence-led editorial system with stronger typography, project frames, proof rows, and a full-width signal Contact ending.
- Placed the THING demonstration beside its title, actions, and verified facts on desktop while preserving the full portrait frame on tablet and mobile.
- Reframed the portrait THING demonstration at its native 9:16 ratio on Home and Work, added implementation proof, and removed the old synthetic system-flow preview.
- Restored the signature dexterous-hand graphic to the Home Hero, shortened its scroll track, and kept Selected Work directly after it.
- Visually centered the asymmetric Hero hand silhouette and placed it in the approved lower mobile field without changing its motion layers.
- Removed the repeated THING system summary from the Hero to keep the opening hierarchy focused.
- Deferred offscreen autoplay video loading, replaced multi-megabyte THING photos with 1600px WebP delivery assets, enlarged secondary link targets, and marked the unavailable Prompt Generator demo as offline.

## [1.2.0] - 2026-08-10

### Added

- Added THING as the featured robotics project with a dedicated case study and an original source-backed system-flow visual.

### Changed

- Reordered Home, Work, About, and HTML Resume content around THING as project `01 / 06`.
- Replaced implicit title-only project affordances with persistent CTAs and one full-card keyboard link per project.
- Kept the primary navigation visible while scrolling and increased navigation contrast and target size.

## [1.1.0] - 2026-07-14

### Changed

- Removed the Hero hand's lower forearm, enlarged and rebalanced the remaining hand, and moved the cube onto the palm.
- Refined the Hero palm into a tapered, thinner mechanical chassis with a clearer central recess and rail structure.
- Expanded fine-pointer hover response and added bounded mouse dragging while retaining native touch scrolling and reduced-motion fallbacks.
- Reduced the Hero statement and kept it on one line from tablet through desktop.
- Added restrained desktop wheel inertia, reduced media lag, and replaced the green page flash with a short graphite transition.
- Simplified the header to Work, About, and Resume, and replaced repeated email prompts with a structured Contact panel.

### Added

- Dedicated About page with profile, working approach, current focus, and navigation to Work, Resume, and Contact.
- Original Resume page preview with PDF open/download and DOCX download while preserving the existing HTML Resume.

## [1.0.0] - 2026-07-14

### Added

- Identity-first portfolio home page with Anime.js motion and responsive depth behavior.
- Multi-page Work directory, five project case studies, and a browser-readable Resume page.
- Refined dexterous robotic-hand Hero object with continuous cube manipulation.
- Reduced-motion, touch, keyboard, responsive, and lifecycle safeguards.
- GitHub Flow CI, GitHub Pages deployment workflow, and automated dependency update configuration.

[Unreleased]: https://github.com/SeMinKong/SeMinKong_Web/compare/v2.0.1...HEAD
[2.0.1]: https://github.com/SeMinKong/SeMinKong_Web/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/SeMinKong/SeMinKong_Web/compare/v1.3.0...v2.0.0
[1.3.0]: https://github.com/SeMinKong/SeMinKong_Web/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/SeMinKong/SeMinKong_Web/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/SeMinKong/SeMinKong_Web/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/SeMinKong/SeMinKong_Web/releases/tag/v1.0.0
