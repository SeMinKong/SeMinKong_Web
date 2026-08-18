# Changelog

All notable changes to this project are recorded here. The project follows Semantic Versioning.

## [Unreleased]

### Changed

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

[Unreleased]: https://github.com/SeMinKong/SeMinKong_Web/compare/v1.3.0...HEAD
[1.3.0]: https://github.com/SeMinKong/SeMinKong_Web/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/SeMinKong/SeMinKong_Web/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/SeMinKong/SeMinKong_Web/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/SeMinKong/SeMinKong_Web/releases/tag/v1.0.0
