# QA checklist

## 2026-08-10 — Home portfolio overview verification

- [x] At 1280x720 and 1280x600, both the Hero identity and the real THING overview panel remain fully inside the sticky viewport without clipping.

- [x] `npm.cmd run verify` builds 84 modules and validates all 14 deployment entries.
- [x] Home source has one H1; its visible section order is Hero → Selected Work → Focus → About → Contact.
- [x] At 1280x900, the Hero loads the real THING preview beside the identity and project actions with no horizontal overflow.
- [x] At 768x900, the overview panel remains a 705x315px readable split layout and Selected Work follows in the same viewport range.
- [x] At 390x844, the preview panel becomes a single-column 343px-wide layout, all text remains accessible, and horizontal overflow is absent.
- [x] `?motion=reduced` pauses the Hero preview; browser console warnings and errors are empty after responsive checks.

Verification record: 2026-07-14 — identity-first Hero and Dexterous Hand update

Environment: Windows, npm, Vite production build and preview

Manual QA overrides: `?motion=full`, `?motion=lite`, `?motion=reduced`

## Build and source

- [x] `npm.cmd run build` succeeds with Home, Work, five case studies, and Resume
- [x] `npm.cmd ls --depth=0` resolves the npm dependency tree
- [x] Active JavaScript modules pass `node --check`
- [x] `git diff --check` reports no whitespace errors
- [x] Anime.js remains the primary intro, reveal, Hero, and page-transition library
- [x] Dongle and Gowun Dodum are self-hosted through npm; Manrope remains self-hosted only for invisible handwritten-signature metrics
- [x] Real project images and videos are bundled from `src/assets/projects/`
- [x] All compiled asset references resolve to files in `dist/`
- [x] Desktop/full alone uses Lenis wheel smoothing; touchmove, scroll-snap, body scroll lock, syncTouch, and gesture interception are absent

## Routes and content

- [x] Production preview returns HTTP 200 for all nine HTML routes
- [x] All 75 internal source links resolve to an existing route
- [x] `/` presents the name and positioning first, then About, actual AQIS evidence, three selected projects, Focus, and Contact
- [x] `/work/` presents all five projects as an editorial list with role, year, outcome, technology, and real media
- [x] Every project has a separate case-study route and repository or live-product evidence
- [x] AQIS and Briefit distinguish the user's role from the full team product
- [x] MRI metrics are described as internal evaluation, not clinical validation
- [x] `/resume/` is a readable page rather than a forced download
- [x] Template microcopy such as `Scroll to inspect` and generic final `Links` sections was removed

## Semantics and keyboard source checks

- [x] Every route has exactly one H1 and one main element
- [x] The skip link is the first focusable control on every route
- [x] No duplicate IDs or positive `tabindex` values were found
- [x] Work uses one keyboard tab stop per project; duplicate media and arrow links remain pointer-clickable but leave the tab order
- [x] Home selected work also uses one keyboard tab stop per project; media links remain pointer-clickable but leave the tab order
- [x] Controlled case-study videos are not managed as autoplay videos
- [x] Project media has project-specific alternative text or an accessible parent label
- [x] Focus-visible styling is defined globally
- [x] No phone number or birth date is present in public markup

## Motion, depth, and lifecycle source checks

- [x] Full desktop uses Lenis wheel transport with restrained media inertia and a time-based pointer spring; keyboard and touch remain native
- [x] Lite/coarse-pointer layouts retain native scroll and static depth
- [x] Reduced mode removes Hero sticky choreography, inertia, depth, autoplay, and page-exit delay
- [x] Continuous media/depth work pauses or settles when hidden or offscreen
- [x] Dexterous Hand uses one coordinated cube/joint/tendon manipulation timeline independent from Hero scroll
- [x] Dexterous Hand pauses offscreen/hidden/pagehide and resumes when visible/pageshow; reduced motion preserves the first static grip
- [x] Fine-pointer tracking uses one rAF spring, and touch keeps native vertical scrolling without wheel/touchmove interception
- [x] Short-height desktop, tablet, and mobile layouts receive dedicated hand, cube, and spacing reductions
- [x] Case-study videos with controls are excluded from pointer tilt and automatic playback
- [x] Same-origin page exit uses one 210ms graphite Anime.js curtain; hash, mail, external, download, target, and modifier-click links are excluded
- [x] Page progress continues to its actual target after large keyboard or scrollbar jumps

## Real-browser visual verification

The browser-control plugin could not attach (`Cannot redefine property: process`), so the same installed Chrome was controlled through the bundled Playwright runtime. Screenshots were visually inspected at exact CSS viewports.

- [x] 1280x900: refined hand silhouette, full Motion, interactive Depth, reduced mode, console, and horizontal overflow
- [x] 768x900: static-depth fallback, separated finger silhouette, navigation spacing, console, and horizontal overflow
- [x] 390x844: responsive Hero, simplified hand detail, CTA hit areas, console, and horizontal overflow
- [x] Keyboard: skip links remain first in source order, sampled header links show focus outlines, and the new About/Resume skip targets accept programmatic focus
- [x] Reduced motion: OS emulation and `?motion=reduced` keep the cube and finger pose static and set Depth to flat
- [x] Motion/Depth defaults: cube transforms change in full mode; 1280px reports interactive Depth while 768px and 390px report static Depth
- [x] Production build and preview: all nine HTML routes return one H1 and one main element; representative Home, About, Resume, and case layouts have no page errors or horizontal overflow
- [ ] Lifecycle: source guards were checked, but background/restore timing was not manually observed in a visible browser window

## 2026-07-14 — `develop` hand-only Hero verification

- [x] `develop` was created from the clean deployed `main`; no commit, push, merge, or deployment was performed.
- [x] `npm.cmd run build`, `npm.cmd run verify:dist`, `npm.cmd ls --depth=0`, all active `node --check` calls, and `git diff --check` pass.
- [x] Production preview returns HTTP 200 for Home, Work, five case studies, and Resume.
- [x] The active Hero markup contains no `.robot-forearm`; the compact wrist, palm, and five digit silhouettes remain.
- [x] 1280×900 production preview: the enlarged hand is balanced in the right column, the cube overlaps the palm bounds, default Motion is `full`, Depth is `interactive`, and there is no horizontal overflow.
- [x] 768×900 production preview: the enlarged static-depth fallback stays below the Hero copy without clipping; default Motion is `lite`, Depth is `static`, and there is no horizontal overflow.
- [x] 390×844 production preview: the hand-only silhouette, palm cube, CTA row, and native page flow remain readable with no horizontal overflow.
- [x] Fine-pointer hover produced an observed X offset above `8px` at a sampled point, compared with the previous mathematical maximum near `2px`; cube drag executed and released without a stuck dragging state or console error.
- [x] `?motion=reduced` reports Motion `reduced` and Depth `flat`; cube transforms stayed identical across an 800ms sample and pointer movement left both interactive offsets at zero.
- [x] Moving directly to `#selected-work` placed the hand well outside the observer margin and its cube transform stayed identical across an 850ms sample, confirming offscreen pause.
- [x] The skip link remains first in the accessibility snapshot; sampled skip and brand links receive a visible 2px solid keyboard focus outline.
- [x] Browser console error log is empty after responsive, pointer, drag, reduced-motion, and offscreen checks.
- [ ] Background-tab hide/restore timing remains unverified in a visible browser window; source guards are unchanged.

## 2026-07-14 — About, inertial scroll, transition, original Resume verification

- [x] `npm.cmd run build` and `npm.cmd run verify:dist` pass; 13 deployment entries include About and the PDF, DOCX, and resume page PNG.
- [x] Production preview returns HTTP 200 for Home, About, Work, five case studies, Resume, PDF, DOCX, and PNG; file MIME types are correct.
- [x] 1280×900: Home statement is one line, Lenis is active only in full/interactive mode, and one 720px wheel input continued from Y 87 → 367 → 577 → 644 over 660ms.
- [x] 768×900: statement is one 655px line, Motion is lite, Depth is static, Lenis is absent, both Work and About remain visible, and horizontal overflow is zero.
- [x] 390×844: statement wraps to two readable lines, Home, About, Contact, and Resume have no horizontal overflow, and all header links fit.
- [x] About has one H1, four profile facts, three work-method items, current tools, Work/Resume/Contact paths, and responsive 1280px/390px layouts.
- [x] Contact is a real information panel with email, GitHub, Resume, and location; the old “이메일로 부탁드립니다” copy and top-nav Email item are absent.
- [x] Resume keeps all HTML sections and adds a loaded 1241×1754 page preview plus working PDF download, PDF new-tab, and DOCX download links.
- [x] The source PDF is a one-page A4 tagged Word export; the 150dpi render was visually checked for clipping and overlap.
- [x] Full-mode internal navigation shows a graphite `rgba(8, 12, 10, 0.94)` curtain at 210ms; no signal-green full-screen flash remains.
- [x] `?motion=reduced` reports Motion reduced, Depth flat, no Lenis class/data attribute, relative Hero layout, visible intro content, and no page curtain.
- [x] Browser console logs are empty after Home, About, Resume, transition, responsive, inertia, and reduced-motion checks.
- [x] Focus-visible sampling reports a solid outline on a header Work link; source order still places skip links first and no positive tabindex was added.
- [x] Original Resume privacy: deployment was explicitly requested with the existing downloadable Resume, so its phone number and birth date remain unchanged.
- [ ] Background-tab hide/restore timing was not manually observed; stop/start source guards were reviewed.

## 2026-07-14 — Hand 2.5D depth verification

- [x] `npm.cmd run build` succeeds and `git diff --check` reports no whitespace errors after the hand depth pass.
- [x] 1280×900: palm and link thickness, per-digit depth bands, projected cube shadow, and desktop pointer parallax are visible; Motion is `full`, Depth is `interactive`, and horizontal overflow is absent.
- [x] 768×900: the relaxed `1080px` perspective keeps the static hand volume readable below the Hero copy; Motion is `lite`, Depth is `static`, and horizontal overflow is absent.
- [x] 390×844: the `1200px` perspective and reduced side-wall/shadow contrast keep the hand legible without clipping or horizontal overflow.
- [x] The thumb remains at z-index `11` / depth `72px`, above the cube at z-index `8` / depth `29px`; the cube remains elevated at `top: 35%`.
- [x] `?motion=reduced` reports Motion `reduced` and Depth `flat`; root tilt and the added parallax layer resolve to zero while the static CSS volume remains.
- [x] The decorative hand remains `aria-hidden` with no focusable descendants, and browser logs contain no warnings or errors beyond Vite connection debug messages.

## 2026-07-14 — Tapered palm release verification

- [x] 1280×900: the palm narrows toward the wrist, the center recess separates the bright shell, and the thinner side wall remains visibly 2.5D.
- [x] 768×900 and 390×844: the simplified palm keeps its tapered silhouette without clipping or horizontal overflow.
- [x] Cube height, thumb-over-cube layering, finger roots, wrist coupling, Motion/Depth defaults, and native mobile scrolling remain unchanged.

## 2026-08-10 — THING priority and exploration navigation verification

- [x] `npm.cmd run verify` builds 84 modules and verifies 14 deployment entries, including `/work/thing/`.
- [x] Static route audit finds 10 HTML routes, six projects, exactly one H1 and one main per route, valid internal links, no duplicate IDs, and no positive `tabindex` values.
- [x] Home, Work, About, and Resume present THING as the first project; all case counters and previous/next links use the new `01 / 06` through `06 / 06` order.
- [x] Home at 1280×900, 768×900, and 390×844 shows THING first with both Hero project actions visible, no horizontal overflow, no console errors, and a fixed navigation that stays at `top: 0` after scrolling.
- [x] At 390×844, the selected-work card has one focusable project link, a visible 2px signal focus ring, and a full-card pointer target that navigates to `/work/thing/`.
- [x] Project cards and Work rows expose a persistent `프로젝트 살펴보기` label; the stretched link keeps one keyboard stop per project, and mobile navigation controls resolve to at least 44px high in source styles.
- [x] The stretched-link overlay and existing 2.5D media interaction share a card-level pointer target; tilt is applied only while the pointer remains inside the media bounds.
- [x] `?motion=reduced` keeps Motion reduced, Depth flat, the Hero object static, project actions visible, navigation fixed, and horizontal overflow at zero.
- [x] THING copy and the custom system visual are based on repository documentation; private Git LFS media is not hotlinked and the GitHub access limitation is stated on the case page.
- [ ] The in-app browser's automatic security review blocked the final follow-up after the last CTA cascade/depth-input patch. Those two patches passed build, `node --check`, cascade source review, and `git diff --check`, but final Work-row color and live pointer tilt were not re-observed in the browser.

## 2026-08-10 THING public-media verification

- [x] `npm.cmd run verify` succeeds after adding the public THING final-demo video and two repository photos; 14 deployment entries are verified.
- [x] Home and Work load the 1080x1920 final demonstration video as a muted lifecycle-managed preview, with the integrated-hand photo as its poster.
- [x] The THING case page preserves the full portrait demonstration (`9:16`) with native playback controls and does not autoplay it.
- [x] At 1280x900, 768x900, and 390x844 the case video and both project-specific evidence photos load at their natural dimensions without horizontal overflow or console warnings/errors.
- [x] At 768x900 the evidence photos use two balanced columns; at 390x844 they collapse to a single readable column.
- [x] At 390x844, Home and Work load the real preview video without overflow; Work retains the persistent signal-green `프로젝트 살펴보기 →` call to action.
- [x] `?motion=reduced` pauses the Home project-preview video while retaining the accessible project link and static poster.

## 2026-08-10 Home Hero hand restoration verification

- [x] `npm.cmd run build` succeeds after restoring the Hero hand and removing the unused Hero media panel.
- [x] At 1280×720, the animated hand is visible in the Hero's right column, the Hero media panel is absent, and the Featured THING video remains below the Hero.
- [x] At 768×900 and 390×844, the hand remains visible with zero horizontal overflow; the mobile Hero actions remain 48px high.

## 2026-08-11 THING portrait preview and browsing verification

- [x] `npm.cmd run verify` succeeds and the removed `system-flow.svg` is absent from the production bundle.
- [x] At 1280px, 768px, and 390px, the Home and Work THING videos preserve the full 9:16 frame with `object-fit: contain` and no inner depth translation.
- [x] The Hero hand remains visible while the shorter track brings Selected Work closer to the first viewport without breaking scroll-seek or reduced motion.
- [x] THING case actions reach the final demonstration, public GitHub repository, and textual system path; the old synthetic preview is absent.
- [x] Autoplay previews use `preload="none"`, pause offscreen/hidden/reduced, and do not introduce console errors or horizontal overflow.
- [x] Project cards expose descriptive accessible names; secondary links and footer links resolve to at least 44px high.
- [x] Project Prompt Generator reports its demo as offline instead of linking to the confirmed 404 deployment.

## 2026-08-11 Mobile Hero hand centering verification

- [x] `npm.cmd run verify` succeeds (84 modules, 14 deployment entries) and `git diff --check` reports no whitespace errors.
- [x] Bright-silhouette pixel bounds center within `-1px` at 390×844, `0px` at the supplied screenshot's 577×1183 ratio, and `-3.5px` at 768×1024.
- [x] Short layouts remain centered within `1.5px` at 390×700 and `0.5px` at 768×700; all five layouts have zero horizontal overflow.
- [x] The production preview keeps mobile/tablet Motion `lite` and Depth `static`; `?motion=reduced` keeps Motion `reduced`, Depth `flat`, the hand visible, and zero overflow.
- [x] At 1280×800 the desktop rig retains its original `60%` anchor, Motion `full`, Depth `interactive`, and zero horizontal overflow.
- [x] The production preview reports no browser warnings or errors.

## 2026-08-11 Home Hero copy trim verification

- [x] The repeated THING system sentence and its unused `.hero-identity__lead` styles are absent from source and rendered DOM.
- [x] At 390×844, 768×1024, and 1280×800 both project actions and the hand remain visible with zero horizontal overflow.
- [x] Mobile keeps a deliberate 22px statement-to-action gap; tablet and desktop keep 34px.
- [x] Default mobile/tablet/desktop Motion and Depth modes remain unchanged, and reduced motion keeps both actions and the hand visible.
- [x] `npm.cmd run verify` succeeds with 84 modules and 14 deployment entries; browser warnings and errors are empty.

## 2026-08-11 Evidence-led editorial redesign verification

- [x] 1280×800 Home keeps the signature hand, two-line value statement, two visible project actions, fixed navigation, and zero horizontal overflow.
- [x] 768×1024 and 390×844 keep the Hero copy and hand separated, centered, and fully visible with Motion lite and Depth static.
- [x] Home Selected Work presents THING as an uncropped 9:16 feature with 21 / 7 / ROS 2 proof; the feature keeps one project link.
- [x] Work uses the large archive title, a centered 9:16 THING row, and 16:10 evidence rails for the other projects without horizontal overflow.
- [x] THING case shows the 1080×1920 video in a full 9:16 frame with the matched 720×1280 poster at 1280px and 390px.
- [x] THING desktop body keeps a sticky public-evidence aside and upright prototype evidence; the small layout stacks the same information in source order.
- [x] Contact uses the full-width signal ending and all contact links remain taller than 44px.
- [x] Reduced motion returns the mobile hand to document flow with a 76px gap before Selected Work and keeps the preview video paused.
- [x] `npm.cmd run verify`, route semantics, console logs, single-tab-stop focus styling, and final 390 / 768 / 1280 overflow checks pass after the final patch.
- [x] 390×568 keeps a 20px action-to-hand gap, while the THING case remains overflow-free through the 840 / 841px one-column seam.

## 2026-08-11 Mobile Hero lower-field placement verification

- [x] At 390×844 the rendered bright-hand center differs from the annotated target by only `+0.4px` horizontally and `-2.7px` vertically.
- [x] 360×640, 390×568, 390×700, 430×932, and 720×900 keep the hand inside the Hero field with no horizontal overflow at the required 390px-and-up sizes.
- [x] 768×1024 and 1280×800 retain their existing in-flow tablet and desktop composition.
- [x] Mobile Motion remains `lite`, Depth remains `static`, and reduced motion keeps the same lower-field placement with zero overflow.
- [x] `npm.cmd run verify` succeeds with 84 modules and 14 deployment entries; browser warnings and errors are empty.

## 2026-08-11 THING visible demonstration archive verification

- [x] THING Hero shows the human hand and robot hand together in the 9:16 live-mimic poster and video without cropping.
- [x] Four gallery scenes render as a balanced 2×2 grid at 1280px and 768px, then a centered single column at 390px with zero horizontal overflow.
- [x] All five controlled videos are 720×1280 H.264 SDR files with local WebP posters and `preload="none"`.
- [x] Starting a second demonstration pauses the first; hidden and `pagehide` states pause every manual demonstration.
- [x] `npm.cmd run verify`, `git diff --check`, internal anchors, console logs, heading order, and reduced-motion checks pass after the gallery change.

## 2026-08-11 Copyright and deployment verification

- [x] Every public HTML route includes rights metadata and a visible footer link to the Copyright page.
- [x] `/copyright/` distinguishes permitted personal non-commercial reference from prohibited copying, redistribution, modification, AI training, and commercial use.
- [x] Separate repository licenses, team-project rights, third-party rights, and applicable-law exceptions are stated without claiming exclusive ownership over them.
- [x] The Copyright page and all footer links remain readable, keyboard accessible, and overflow-free at 390px, 768px, and 1280px.
- [x] `npm.cmd run verify` succeeds with 15 deployment entries and the deployed Pages URL returns the new Copyright route.

## 2026-08-11 Home Hero navigation CTA verification

- [x] Home Hero shows exactly `프로젝트` and `About` as its two actions.
- [x] The actions resolve to `/work/` and `/about/`, remain fully visible at 390px, 768px, and 1280px, and create no horizontal overflow.
- [x] `npm.cmd run verify`, browser console, and keyboard focus checks pass after the CTA change.

## 2026-08-11 Sequential Home Hero verification

- [x] At scroll position 0, 1280×800, 768×1024, and 390×844 show the name while the role, two statement lines, and actions start at opacity 0; the signature hand remains visible.
- [x] Desktop scroll sampling shows the role first, then line 1 while line 2 remains hidden, then line 2, and finally the actions; reverse progress uses the same timeline.
- [x] Hero buttons render at 15.36px / 14.592px / 14.4px across 1280 / 768 / 390, use weight 650, retain 48px height, and create no horizontal overflow.
- [x] Keyboard focus immediately settles all staged copy before showing the project-link focus ring; hidden actions do not accept pointer input.
- [x] Reduced motion keeps one `SeMinKong` h1, exposes all copy and actions, removes the enhanced track state, and stacks the static hand with zero overflow.
- [x] At 390×568 the final CTA and hand retain a 31px gap; 1280×600 keeps the complete copy, actions, and hand inside the viewport.
- [x] Browser console logs are empty for normal, lite, short-height, and reduced-motion previews.

## 2026-08-11 Centered Hero lift verification

- [x] After the two-second enhancement watchdog, scroll position 0 still shows only the name and unchanged hand graphic at 1280px, 768px, and 390px.
- [x] At 1280×800 the combined name/hand horizontal midpoint stays within 8px of the viewport center with zero horizontal overflow.
- [x] Scroll sampling confirms the identity wrapper reaches `-32px`, the hand wrapper reaches `-24px`, and role → line 1 → line 2 → actions remain sequential and reversible.
- [x] Tablet, mobile, short-height, keyboard-settled, and reduced-motion states keep the copy and hand separated without clipping or hidden focus targets.
- [x] Production build, console, and 390px / 768px / 1280px overflow checks pass.

## 2026-08-14 Modern system deck verification

- [x] `npm.cmd run build` succeeds with the new `project-deck.js` module and all public routes.
- [x] 1280×900 default mode reports Motion `full`, Depth `interactive`; the three cards stack inside the stage and spread to X 40 / 463 / 885 without horizontal overflow.
- [x] Pointer hover expands and identifies the active slot; keyboard focus on the THING link immediately expands the same deck and preserves a single project tab stop.
- [x] 768×900 reports Motion `lite`, Depth `static` and presents a transform-free two-column layout with the third card centered below.
- [x] 390×844 presents three 343px-wide, 510px-high cards in one column with no card-content clipping and zero document/body overflow.
- [x] `?motion=reduced` reports Motion `reduced`, Depth `flat`, exposes the complete Hero copy, and renders all three cards as an opacity-1, transform-free static Grid.
- [x] Home, Work, About, Resume, and THING detail retain the cobalt/cyan tokens, visible navigation, and zero overflow in representative 390px, 768px, and 1280px browser checks.
- [x] Browser warning/error logs are empty after responsive, interaction, reduced-motion, and representative route checks.

## 2026-08-14 Contemporary gallery v3 verification

- [x] `npm.cmd run build` succeeds for 88 modules, `npm.cmd run verify:dist` verifies all 15 deployment entries, and `git diff --check` reports no whitespace errors.
- [x] 1280×900 keeps the Home deck inside the page grid; keyboard focus and pointer hover spread the cards to X 40 / 463 / 885, the final edge ends at 1225, and focus remains visibly outlined.
- [x] 768×1024 renders a transform-free 2-column deck with a centered third card; every 343px card contains its full copy and CTA.
- [x] 390×844 renders a transform-free 1-column deck with three 343×510px cards, 12px metadata, a 375px navigation row, and zero document/body overflow.
- [x] `?motion=reduced` reports Motion `reduced` and Depth `flat`, exposes all Hero copy and actions, and keeps all project cards opacity-1 with no transform.
- [x] Work, About, Resume, and THING use the intended paper catalogue or dark gallery theme at 1280px and 390px with zero horizontal overflow; representative media retains restrained 1–2px framing and offscreen videos remain unloaded.
- [x] Key text contrast is at least 4.5:1: paper ultramarine 4.77:1, dark-card ultramarine 5.00:1, and Contact secondary text 4.86:1.
- [x] Browser warning/error logs remain empty after responsive, deck interaction, route, and reduced-motion checks.

## 2026-08-14 Chromatic restraint verification

- [x] The rendered Home route contains no computed cobalt, cyan, violet, or legacy lime UI colours; project media remains unchanged.
- [x] 1280×800 keeps the desktop deck inside the page grid and spreads it to X 40 / 463 / 885 with keyboard and pointer parity and zero horizontal overflow.
- [x] 768×900 renders a transform-free 2-column deck and 390×844 renders three 343×510px cards in one column; both have zero horizontal overflow.
- [x] Home Contact is graphite with a 2px vermilion rule instead of a full-colour field. Work, About, Resume, Copyright, and THING use synchronized paper or dark theme metadata and surfaces.
- [x] Meaningful palette pairs meet WCAG AA for normal text: dark signal 4.70:1, light signal 5.70:1, paper muted 4.70:1, Contact secondary 9.08:1, and paper text 15.72:1.
- [x] The dark About panel primary CTA resolves to bone text on graphite with visible hover/focus treatment; browser logs contain no warnings or errors.

## 2026-08-14 Deck entry, tool catalogue, and visibility detail verification

- [x] At 1280×800, entering the closed deck through the exposed lower edge starts the spread with zero active slots, the original `3 / 2 / 1` stacking order, and no inner-card lift. After settling, slots end at X `40 / 463 / 885`, all inner transforms remain neutral, and horizontal overflow is zero.
- [x] Moving across a settled spread activates only the hovered slot and raises it to z-index 20. Keyboard focus on THING expands immediately, raises slot 01, and shows a 2px vermilion outline.
- [x] At 768×1024 the deck is a transform-free two-column Grid, and at 390×844 it is a transform-free one-column Grid with three 343×510 cards. Every CTA remains inside its card and both sizes have zero horizontal overflow.
- [x] `?motion=reduced` reports Motion `reduced` and Depth `flat`, exposes all Hero information, and keeps all three deck slots transform-free without interactive deck mode.
- [x] Home role, both statement lines, and actions render at opacity 1 and accept pointer input at scroll position zero in 1280px, 768px, and 390px checks.
- [x] About renders ten bundled monochrome SVG marks and the two intended `RS` / `DB` monograms with twelve visible names. The catalogue uses four columns at 1280px and 768px, two columns at 390px, and has no clipped labels or horizontal overflow.
- [x] Meaningful leaf text below 12px is absent in representative Home, Work, Resume, Copyright, and THING scans. About tool names render at 12.8px; only decorative `aria-hidden` monograms and deck-edge text remain smaller.
- [x] Copyright button arrows inherit bone text rather than the muted legal label style, inline `LICENSE` keeps body typography, and the THING Resume hover resolves to charcoal on bone.
- [x] Production builds complete with 90 modules, responsive route checks produce no browser warnings or errors, and the temporary preview server is stopped after QA.
- [x] `npm.cmd audit --omit=dev` reports zero runtime vulnerabilities. The full audit still reports two high-severity advisories in the existing `nanoid` and `postcss` development dependency chain; no automatic dependency rewrite was applied.

## 2026-08-14 Requested stack catalogue verification

- [x] About renders the requested 13 visible names in the order `Robotics → Code → AI / Agents → Systems`, with the path `ROS 2 → Simulation → Local AI / Delivery`.
- [x] The production bundle renders 12 monochrome SVG marks, reuses the NVIDIA mark for Isaac Sim and Isaac Lab, and keeps one unclipped `L.CPP` fallback for `llama.cpp`.
- [x] 1280×900 and 768×1024 use four catalogue columns; 390×844 uses two columns. All three widths report zero label clipping, zero labels below 12px, and zero horizontal overflow.
- [x] Columns with three and four tools share the same final 18px bottom inset; their rows distribute to 116px and 87px respectively instead of leaving an empty final cell.
- [x] The tool catalogue adds no focusable controls, keeps every name as visible text, and preserves default Motion/Depth modes (`full`/`interactive` desktop, `lite`/`static` tablet/mobile).
- [x] The 390px reduced-motion route reports Motion `reduced`, Depth `flat`, 13 visible names, 12 SVG marks, one `L.CPP` fallback, two columns, and zero overflow.
- [x] `npm.cmd run build` succeeds with 90 modules, and browser warning/error logs are empty after responsive and reduced-motion checks.

## 2026-08-14 Direct copy hierarchy verification

- [x] Home exposes the noun-led hierarchy `Projects`, `Focus`, `About`, and `Contact`; all project cards retain visible names, factual role/year metadata, concise technology summaries, and `상세 보기` actions.
- [x] Visible source copy contains no `Exhibit`, `Exhibition deck`, `Selected /`, `Project archive`, `Practice`, `Field notes`, `Catalogue`, `Evidence / Public`, or `Demonstrations /` labels. The only punctuation-ending heading match is the factual product name `Alkkagi.io`.
- [x] At 1280×900 the keyboard-focused Home deck spreads to X `40 / 463 / 885`, raises only THING, and renders a 2px focus outline; at 768×1024 and 390×844 every card uses a transform-free fallback with its action contained inside the card.
- [x] Home role, both word-led statement lines, and actions are visible at opacity 1 on first paint at 1280px, 768px, and 390px. The reduced-motion 390px route reports Motion `reduced`, Depth `flat`, and leaves every card and Hero item visible with no transform.
- [x] Work, About, Resume, Copyright, THING, and AQIS were checked at representative 1280px and 390px sizes. Headings remain visible, empty media-label rails collapse, file/contact actions stay inside their containers, and horizontal overflow is zero.
- [x] About retains 13 visible technology names with no clipping: four columns at 1280px and two columns at 390px, with a minimum tool-name size of 12.8px.
- [x] Browser warning/error logs are empty. `npm.cmd run build` succeeds with 90 modules, `npm.cmd run verify:dist` verifies 15 deployment entries, and `git diff --check` reports no whitespace errors.

## 2026-08-14 Opening divider removal verification

- [x] The Home Hero decorative pseudo-element resolves to `background-image: none` at 1280×900, 768×1024, and 390×844, so the former full-height 64% guide cannot render or fall back to the earlier grid texture.
- [x] The same pseudo-element remains disabled on the 390px reduced-motion route.
- [x] The About Hero decorative pseudo-element resolves to `content: none`; visual inspection at 1280×900 shows one uninterrupted paper field with no 58% vertical seam.
- [x] Home, Work, About, Resume, Copyright, and all six case-study routes were audited at 1280×900 and 390×844; representative page types were also checked at 768×1024. No viewport-scale 1px gradient pseudo, background grid, or full-height panel seam remains.
- [x] Component-level borders on cards, media, facts, metrics, tool rails, and next links remain intact because they communicate local information structure rather than dividing the viewport.
- [x] The robotic hand, Hero actions, default Motion/Depth modes, reduced-motion fallback, and document-level horizontal overflow remain unchanged.
- [x] `npm.cmd run build` succeeds with 90 modules and browser warning/error logs are empty.

## 2026-08-14 Deployment package and MRI media verification

- [x] The static worker forwards requests directly to the hosting asset binding, and `npm.cmd run verify:dist` verifies the worker plus all 15 user-facing deployment entries.
- [x] The Brain Tumor MRI demonstration preserves its 1320×1032 frame, 30 fps rate, 51.53-second duration, H.264/AAC browser-compatible streams, and fast-start playback metadata.
- [x] The optimized MRI asset is 3.64 MB rather than 37.38 MB and scores 0.9962 full-frame SSIM against the original encode.

## 2026-08-14 Project preview navigation verification

- [x] Home's three previews and Work's six previews map to existing detail routes through each card or row's single stretched title link.
- [x] Decorative preview media does not intercept pointer input; image, silent-video, title, summary, and CTA clicks resolve to the same destination.
- [x] No duplicate media anchor was added, so every project retains one keyboard tab stop, one accessible link name, and the existing card-level focus outline.
- [x] The Work copy wrapper remains transform-free after its row reveal, keeping the stretched title-link overlay relative to the full row instead of the copy column.
- [x] Headless Edge completed 12 center-point navigation checks: all nine Home/Work previews at 390px touch, Home at 768px, and expanded Home deck plus Work at 1280px. Every hit target resolved to the expected anchor with zero horizontal overflow or browser errors.

## 2026-08-18 Site-wide typography and Resume synchronization verification

- [x] Home, Work, About, Resume, Copyright, and all six case studies were checked at 1280×900, 768×1024, and 390×844: all 33 route-width combinations have zero horizontal overflow, no detected text clipping, and loaded local fonts.
- [x] Body copy resolves to weight 450, page and case titles resolve to 650–680, the support/meta/action tokens are defined, and long titles including `Project Prompt Generator` remain inside the mobile page grid.
- [x] The Home deck keeps every card action inside its fixed or responsive height, keyboard focus expands the desktop deck with a visible 2px vermilion outline, and tablet/mobile retain the static layout.
- [x] The CSS-generated `SELECTED / 2026` subtitle resolves to `content: none` at all three widths.
- [x] Desktop reports Motion `full` and Depth `interactive`; tablet/mobile report `lite` and `static`. The 390px reduced route reports `reduced` and `flat`, exposes all Hero copy, keeps deck transforms disabled, and has zero overflow after static-hand centering.
- [x] All six case titles settle to opacity 1 within the intro duration at all three widths; browser warning/error logs are empty.
- [x] The HTML Resume and downloadable DOCX/PDF/page preview place THING first. The PDF is one A4 page with English language metadata, six live links, no encryption/forms/JavaScript, and a render pixel-identical to the 1241×1754 preview PNG.
- [x] The THING links in the DOCX and PDF target `https://seminkong.github.io/SeMinKong_Web/work/thing/`; the replaced private-domain URL is absent.
- [x] Local preview requests return HTTP 200 for the PDF, DOCX, and PNG with the expected file sizes and MIME type where provided.
- [x] Deployment was explicitly requested with the existing downloadable Resume; its public phone number and date of birth remain unchanged.
- [x] `npm.cmd run build` succeeds with 90 modules, `npm.cmd run verify:dist` verifies 16 deployment entries, and `git diff --check` reports no whitespace errors.

## 2026-08-18 Home greeting verification

- [x] The Home Hero contains no visible role/location element and presents `안녕하세요!` followed by `새로운 것을 배우고 직접 만드는 일이 즐겁습니다.`
- [x] At 390×844, 768×1024, and 1280×900, both greeting lines remain fully visible with no positive horizontal overflow and no overlap with the robotic hand or Hero actions.
- [x] Keyboard focus retains its visible 2px outline, browser warning/error logs are empty, and 390px reduced-motion mode keeps both greeting lines visible with the hand separated from the statement.
- [x] The `Projects` heading uses a 1.04 line-height at 390px, 768px, and 1280px so the `j` descender remains fully visible after reveal; all three widths retain zero horizontal overflow and empty warning/error logs.
- [x] `npm.cmd run build` succeeds with 90 modules, `npm.cmd run verify:dist` verifies 16 deployment entries, and `git diff --check` reports no whitespace errors.

## 2026-08-18 Profile, THING period, and brand-mark verification

- [x] Home, About, and browser Resume use broad candidate identity copy; general Profile and role areas no longer describe THING or use `AI & Robotics Software Developer`.
- [x] THING shows the verified Jul–Aug 2026 period on Home, Work, its case page, browser Resume, DOCX, PDF, and preview PNG.
- [x] The header mark and favicon use the same `SK` monogram, remain legible on dark and paper routes, and do not compress navigation at 390px.
- [x] The regenerated DOCX and one-page PDF contain the broad profile and correct period; the PDF keeps six live links, English language metadata, and matches the 1241×1754 preview PNG without clipping.
- [x] At 390px, 768px, and 1280px, Home, About, Resume, Work, and THING have zero horizontal overflow, visible keyboard focus, and empty browser warning/error logs.
- [x] `npm.cmd run build`, `npm.cmd run verify:dist`, and `git diff --check` succeed.

## 2026-08-18 Copyright readability verification

- [x] Copyright section headings contain no decorative `01–04` labels.
- [x] The introductory statement breaks by meaning on wide layouts and wraps naturally at 390px.
- [x] Permission and restriction lists show one marker per item with no Markdown syntax or duplicate browser marker.
- [x] At 390px, 768px, and 1280px, the page has no horizontal overflow; the shared 2px keyboard focus rule remains intact and browser warning/error logs are empty.
- [x] `npm.cmd run build`, `npm.cmd run verify:dist`, and `git diff --check` succeed.
## 2026-08-18 Browser-tab favicon verification

- [x] All 11 HTML routes reference `/favicon.svg?v=20260818-2` with SVG type and `sizes="any"`.
- [x] The favicon source uses a high-contrast bone `S` and vermilion `K` on graphite with no legacy outline-square or lime marker.
- [x] `npm.cmd run build`, `npm.cmd run verify:dist`, and `git diff --check` succeed.

## 2026-08-18 Hero scroll continuity verification

- [x] At the first statement, second statement, and CTA timeline boundaries, computed Y positions change continuously with no downward snap.
- [x] Forward and reverse scrolling preserve stable spacing between the name, greeting lines, and actions at 390px, 768px, and 1280px.
- [x] Keyboard settlement and reduced-motion expose every Hero action without residual transforms.
- [x] The Hero and following Projects section have zero horizontal overflow; browser warning/error logs are empty.
- [x] `npm.cmd run build`, `npm.cmd run verify:dist`, and `git diff --check` succeed.

## 2026-08-18 Name-first Hero and hand-edge verification

- [x] At scroll zero in full/lite motion, only the name and robotic hand are visible; the name sits near the optical middle without overlapping the hand.
- [x] Forward and reverse scrolling reveal both greeting lines and actions continuously while the outer wrappers end at the established completed layout.
- [x] At 390px, 768px, and 1280px, the completed Hero has no clipping, overlap, or horizontal overflow; the Projects section releases normally.
- [x] Resizing or rotating across the 900px Hero breakpoint preserves the current scroll state while applying the correct responsive start offsets.
- [x] The hand ambient light has no visible rectangular top, side, or bottom edge in default, static-depth, and reduced-motion states.
- [x] Tab settlement and reduced motion expose the complete Hero with active actions and no residual wrapper transforms.
- [x] Browser warning/error logs are empty, `npm.cmd run build` and `npm.cmd run verify:dist` succeed, and `git diff --check` reports no whitespace errors.

## 2026-08-18 Hero reading-hold and cube-finale verification

- [x] At timeline units `4100` and `4920`, the completed greeting and actions have identical settled transforms, remain readable, and accept pointer input.
- [x] Full motion reaches cumulative Y rotations of `1`, `3.5`, and `4` turns at `5280`, `5640`, and `5820`; lite motion reaches `0.5`, `1.75`, and `2` turns at the same boundaries.
- [x] The flourish lifts and tumbles without scaling or materially moving the hand, then remains visually settled from `5820–6000`.
- [x] Forward and reverse scrolling cross `4100`, `4920`, `5280`, `5640`, and `5820` without copy, hand, or cube jumps.
- [x] At 1280px, 768px, and 390px, the Hero uses the applicable `175 / 165 / 160svh` track, releases Projects normally, and has no clipping, overlap, or horizontal overflow.
- [x] Tab settlement and `?motion=reduced` expose the complete Hero with active actions, no flourish playback, and no residual flourish transform.
- [x] Browser warning/error logs are empty; `npm.cmd run build`, `npm.cmd run verify:dist`, and `git diff --check` succeed.

## 2026-08-18 Cube-finale rotation-count correction verification

- [x] Full motion reaches Y `135deg / 472.5deg / 540deg` at the three flourish boundaries and lite/mobile reaches `90deg / 315deg / 360deg`.
- [x] The smaller turn count preserves continuous forward/reverse seeking, the completed-copy reading hold, and the autonomous-loop pause; full holds its half-turned endpoint while lite/mobile lands at identity.
- [x] At 1280px, 768px, and 390px, the cube remains inside the hand composition with zero horizontal overflow; reduced motion remains static.
- [x] Tab settlement exposes complete copy/actions while keeping the flourish at identity, without a visible half-turn jump.
- [x] Browser warning/error logs are empty; `npm.cmd run build`, `npm.cmd run verify:dist`, and `git diff --check` succeed.

## 2026-08-18 Continuous cube-finale pacing verification

- [x] Copy and actions remain visually identical and interactive throughout the `4100–5000` reading hold.
- [x] Full Y rotation follows one continuous `inOut(2)` tween from `0deg` to `540deg` over `5000–6600`; lite/mobile follows the same curve to `360deg`.
- [x] Crossing `5500` and `6200` introduces no Y-axis position or velocity kink; those boundaries affect only X/Z/lift.
- [x] X/Z/lift respect their existing limits, return to zero at `6600`, and the applicable Y endpoint remains unchanged through `6800`.
- [x] Forward/reverse seeking, manipulation pause/resume, keyboard-neutral settlement, and reduced-motion fallback remain continuous and static where required.
- [x] At 1280px, 768px, and 390px there is no clipping, overlap, horizontal overflow, or browser error; build, deployment verification, and `git diff --check` succeed.

## 2026-08-18 Cube-finale loop-handoff verification

This section supersedes the current-behavior interpretation of earlier checked items that require the autonomous loop or composed cube to remain static through the final hold; those entries remain historical verification records.

- [x] Holding progress below `6400` during the flourish keeps the inner manipulation transforms unchanged over time; crossing `6400` resumes them from the preserved phase rather than the first grip pose.
- [x] The `6400–6600` overlap introduces no visible pose snap, direction reversal, stop-and-restart, or rapid pause/resume churn at the boundary.
- [x] Pointer spring, press, and drag remain blocked until the outer flourish completes at `6600`, even though the base master resumes at `6400`.
- [x] At `6600`, outer X/Z/lift resolve to zero and outer Y remains full `540deg` or lite/mobile `360deg`, while the inner cube axes, fingers, and tendons continue changing through `6800` and after scroll input stops.
- [x] Reverse scrolling below `6400` pauses the master without resetting its pose, and crossing below `5000` resumes the original loop without a discontinuity.
- [x] Resizing across the full/lite breakpoint preserves the manipulation loop's normalized phase instead of returning to the first grip pose.
- [x] Tab settlement remains neutral and static; `?motion=reduced`, failed enhancement, hidden, and offscreen states also remain static or paused as specified.
- [x] Full motion at 1280px and lite motion at 768px and 390px retain coordinated hand contact, zero horizontal overflow, and normal Projects release; browser warning/error logs are empty.
- [x] `npm.cmd run build`, `npm.cmd run verify:dist`, and `git diff --check` succeed.

## 2026-08-18 Copyright source-only AI easter-egg verification

- [x] Source and built `/copyright/` HTML contain exactly one `#ai-visitor-note` `<template>` with the approved text.
- [x] The template has no CSS or JavaScript consumers, creates no visible layout box or focus target, and leaves the Copyright reading order unchanged.
- [x] `npm.cmd run build`, `npm.cmd run verify:dist`, and `git diff --check` succeed.

## 2026-08-21 Progress cleanup and Work chapter verification

> Historical snapshot. The current progress, chapter-label, and THING sticky-demo contract is superseded by `2026-08-24 Perceptible exhibition choreography verification` below.

- [x] Home, Work, THING, and About contain no top page-progress bar, side signal thread, Hero progress line, scene readout, or pinned Focus/Demos class at 1280px, 768px, and 390px.
- [x] Home Focus renders only `Vision`, `Robotics`, and `Systems` in a static three-column desktop index and compact one-column tablet/mobile rows; no subtitle, overlap, raw counter, or horizontal overflow remains.
- [x] THING Demos uses the base two-column desktop and one-column mobile gallery, small metadata badges, native controls, and no auto chapter pin. The Repository aside no longer competes with a viewport-fixed demo stage.
- [x] Work desktop full renders six normal-flow chapters with alternating sticky media and reversible GSAP scrub. Forward and reverse wheel checks preserve finite transforms and continuous opacity; no snap, tick, counter, or scroll interception is present.
- [x] Work at 768px and 390px is a transform-free static list with native vertical scroll. `?motion=reduced` reports reduced/flat, shows all six project links, and leaves all outer row transforms at `none`.
- [x] Resizing Work from 1280px to 768px removes the story class and every GSAP inline style, retains zero overflow, and rebuilds cleanly when returning to 1280px.
- [x] Each Work project row retains one semantic link; keyboard-focused THING shows a 2px link outline and 2px row outline.
- [x] About replaces the tall numbered method cards with responsive Retargeting, Sim-to-real, and Local AI question rows. Copy is framed as current study/exploration rather than unverified achievement.
- [x] Browser warning/error logs are empty for Home, Work, THING, and About. `npm.cmd run verify` verifies all 16 deployment entries, and `git diff --check` reports no whitespace errors.

## 2026-08-21 Final visual polish verification

> Historical snapshot. Later 2026-08-24 choreography deliberately replaces the no-counter/no-progress and two-column THING demo results recorded here.

- [x] Work at 1280×900 shows THING at 340×604, UI evidence at uncropped 16:9, and Alkkagi at 1:1. Briefit's left title and all dashboard/diagram edges remain visible.
- [x] Work at 1280×720 keeps the complete 275×490 THING frame between the fixed navigation and viewport bottom with zero horizontal overflow. All project copy resolves to opacity 1 throughout the scrub.
- [x] The media handoff leaves the outgoing chapter at 6% opacity before the incoming chapter becomes dominant; index/arrow timing extends the normalized timeline to 100%. Reverse/forward transforms remain finite.
- [x] Work at 768×1024 and 390×844 remains a static native-scroll list with no story class or GSAP inline styles. Alkkagi renders as a square frame and exposes a 27KB poster before its 9.39MB video is ready.
- [x] Resizing the same Work tab 1280→768→1280 removes and rebuilds the story cleanly, recreates full/interactive Motion and active Lenis, and updates the scrub after returning to desktop.
- [x] Home Focus uses one `ol` with three `li` items. Row heights are 204px desktop, 112px tablet, and about 110px mobile; the removed subtitles leave no excessive desktop void.
- [x] About questions use two columns at 768px (`topic | question + note`) and one column at 390px. Both widths have zero horizontal overflow.
- [x] Work and all six case-study skip targets use `tabindex="-1"`; activating sampled Work and THING skip links moves focus to the target section/main. The focused THING project retains one link, a 2px link outline, and a 2px row outline.
- [x] THING Demos remains a two-column desktop/one-column mobile gallery with no pinned class or readout, and the source/license note follows the gallery instead of crowding its heading.
- [x] Browser warning/error logs are empty. `npm.cmd run verify` builds 103 modules and verifies all 16 deployment entries; `git diff --check` reports no whitespace errors.

## 2026-08-21 Stacked project scenes and About tool-color verification

> Historical snapshot. The current Work height gate is 640px and enhanced scenes now include a 2px rail plus chapter labels.

- [x] Home Projects and Focus, all six Work rows, all four THING demo cards, and all four About tool groups contain no decorative ordinal labels. Dates, durations, versions, and measured results remain intact.
- [x] Work at 1280×720 uses one sticky composition per project: media, title, metadata, description, stack, and CTA enter and recede together. There is no progress indicator, snap, wheel interception, or media-only trailing effect.
- [x] Every Work composition remains exactly one semantic project link. Its media and copy resolve to the same hit target, and keyboard focus exposes the complete scene with visible 2px link and row outlines.
- [x] Work at 768×1024 and 390×844 uses the static asymmetric two-column or native one-column fallback with zero horizontal overflow. At 1280×650, reduced motion, and lite motion, no sticky story or residual GSAP inline style remains.
- [x] Resizing the same Work page 1280→768→1280 removes and recreates the story without stale transforms, hidden copy, or duplicate listeners.
- [x] About uses Retargeting, Sim-to-real, and Edge inference terminology while retaining current-study framing. The question layout remains readable at 1280px and 390px with zero horizontal overflow.
- [x] About renders 12 Simple Icons SVG marks in their brand colors and keeps the llama.cpp monogram fallback. Fine-pointer full motion adds a restrained lift, tint, and rotation; reduced motion remains static, and non-action tool items stay outside the tab order.
- [x] `npm.cmd run verify` builds 103 modules and verifies all 16 deployment entries; `git diff --check` reports no whitespace errors.

## 2026-08-21 Native-ratio video and separate-caption verification

> Historical snapshot. Native video ratios and controls remain valid; enhanced THING desktop layout is now the later sticky chapter sequence.

- [x] Every source MP4 has explicit intrinsic dimensions in HTML: THING 720×1280, AQIS 1280×720, Alkkagi 1276×1270, and Brain MRI 1320×1032.
- [x] Work THING and Alkkagi previews have transparent, borderless, overflow-visible media wrappers. Their rendered aspect ratios follow the source or poster within sub-pixel rounding, and their evidence captions occupy separate rows below the video.
- [x] Work native-video stages report `clip-path: none` throughout the GSAP story. The whole composition handoff remains active at 1280×720, while 768×1024, 390×844, and `?motion=reduced` remain static with no residual transform or clip.
- [x] THING Hero and all four Demos remove frame padding, border, and fill. Demos remain a two-column desktop and one-column mobile gallery; each description follows its video in normal flow.
- [x] AQIS, Alkkagi, and Brain MRI detail videos render at source ratio without a 16:9 or square container. Their captions use an independent rule-and-label row rather than sharing a filled media surface.
- [x] Work, THING, AQIS, Alkkagi, and Brain MRI have zero horizontal overflow at 1280×720, 768×1024, and 390×844.
- [x] Case video reveal uses opacity plus a 14px Y settle with no clip-path. Keyboard-focused Alkkagi video retains the shared 2px outline and 4px offset because its figure overflow is visible.
- [x] Vite reports only expected HMR/page reloads with no transform or stylesheet errors. `npm.cmd run verify` builds 103 modules and verifies all 16 deployment entries; `git diff --check` reports no whitespace errors.

## 2026-08-21 About tool catalogue alignment verification

- [x] At 1280×900 the catalogue uses the full 1185px page width instead of the former 676px right column. Four groups render at equal 296px widths with 58px icon boxes and aligned 108px tool rows.
- [x] At 768×900 the catalogue becomes a two-column grid with 352px groups; at 390×844 it becomes one 343px column. All 13 names remain at least 15px, no label is clipped, and document width stays within the viewport scrollbar width.
- [x] Three-item groups no longer stretch their rows independently from the four-item AI / Agents group. Their first three icon, name, and divider baselines match, with any remaining space following the final tool.
- [x] The tool catalogue adds no links, buttons, pointer cursor, or tab stops. `?motion=reduced` reports reduced/flat with icon transform `none`; browser logs contain only expected Vite debug messages and no warning or error.
- [x] `npm.cmd run build`, `npm.cmd run verify`, and `git diff --check` succeed; Vite builds 103 modules and the distribution verifier checks all 16 entries.

## 2026-08-21 About large-logo wall verification

- [x] The prior four-column catalogue chrome is absent. About contains one semantic tool list with 13 items, no category-cell borders or badge backgrounds, and no tool links, buttons, pointer cursor, or tab stops.
- [x] At 1280×900 the title aligns with a right-side 560×803px three-column wall. Simple Icons render at 100px and the 13th Docker item occupies the center column.
- [x] At 768×900 the wall stacks below the title at 620px wide with 84px marks. At 390×844 it remains a 343px three-column wall with marks up to 70px, names at 12px, a centered final item, and zero horizontal overflow.
- [x] Full fine-pointer hover raises the sampled ROS 2 mark by 4px, scales it to 1.1, rotates it by 1 degree, adds a brand-tinted drop shadow, and exposes the name. Lite keeps the static marks while labels remain available on hover.
- [x] `?motion=reduced` reports reduced/flat and keeps the hovered mark at `transform: none`, `filter: none`, and zero-duration icon/name transitions. Touch/mobile names are statically visible.
- [x] Browser logs contain only expected Vite connection/HMR debug entries. `npm.cmd run verify` builds 103 modules and verifies all 16 distribution entries; `git diff --check` succeeds.

## 2026-08-21 THING Prototype evidence verification

- [x] 두 source 이미지는 1200×1600과 1600×1200 intrinsic 크기를 HTML에 명시하고, CSS가 강제 crop이나 aspect ratio 없이 원본 3:4·4:3 비율을 유지한다.
- [x] 1280px 이상에서 evidence grid는 최대 600px의 `9fr / 16fr` 구도를 사용한다. 실제 표시 크기 207×276px과 369×276px으로 이미지 상·하단과 caption 시작선이 일치한다.
- [x] Figure의 border, fill, overflow clip을 제거해 가로 사진 아래의 검은 빈 frame이 남지 않는다. Caption은 사진 밖 정상 흐름의 rule-and-label 행이다.
- [x] 768px에서는 600px 한 줄 구도가 본문 아래에 놓이고, 390px에서는 206×274px portrait와 343×257px landscape가 한 열로 쌓인다. 두 viewport 모두 수평 overflow가 없다.
- [x] Full motion과 `?motion=reduced`에서 사진과 caption의 위치가 동일하며, Prototype 아래 Pipeline 섹션과 겹치지 않는다.

## 2026-08-21 About compact tool matrix verification

- [x] About 기술 스택은 13개 도구를 Robotics 3개, Code 3개, AI / Agents 4개, Systems 3개의 네 labelled region과 semantic list로 제공한다.
- [x] 1280×900에서 matrix는 page-width 1185px와 44px mark를 사용하며 높이는 349px이다. 이전 560×803px logo wall보다 절반 이하로 줄고, 모든 기술명이 hover 없이 표시된다.
- [x] 768×900에서는 38px mark와 네 도구 열을 유지해 matrix 높이 317px로 표시된다. `NVIDIA Isaac Sim`만 자연스럽게 두 줄이고 다른 기술명은 잘리거나 겹치지 않는다.
- [x] 390×844에서는 32px mark와 분류별 두 도구 열을 사용한다. 343px 안에서 네 분류와 13개 이름이 표시되고 문서 수평 overflow가 없다.
- [x] Tool item은 링크·버튼·tab stop·pointer cursor·title tooltip을 추가하지 않는다. 장식 SVG는 `aria-hidden`, 실제 이름은 DOM text로 유지한다.
- [x] `?motion=reduced`는 `motion=reduced`, `depth=flat`, icon transform/filter `none`, transition `0s`, name opacity `1`을 보고한다.
- [x] Browser warning/error log는 비어 있다. `npm.cmd run verify`가 103 modules를 build하고 16개 deployment entry를 검증하며, `git diff --check`가 성공한다.

## 2026-08-21 llama.cpp official mark verification

- [x] About의 `L.CPP` fallback을 llama.cpp 공식 `llama1-icon-transparent.svg` 기반의 로컬 asset으로 교체했다. SVG는 250×250 intrinsic size와 투명 배경을 가지며 첨부 PNG의 흰 사각형을 가져오지 않는다.
- [x] 1280×900, 768×900, 390×844에서 mark는 각각 기존 matrix 규칙의 44px, 38px, 32px wrapper에 맞춰 표시된다. Fallback border와 fill은 없고 인접한 `llama.cpp` 이름은 항상 12px 이상으로 보인다.
- [x] 세 viewport 모두 문서 수평 overflow가 없고 기술 목록에는 link, button, `tabindex`가 추가되지 않았다. Browser log에는 Vite 연결 debug 외 warning/error가 없다.
- [x] `?motion=reduced`에서 mark wrapper의 transform과 filter는 `none`, transition duration은 `0s`이며 SVG는 정상 로드된다.
- [x] `npm.cmd run verify`가 103 modules를 build하고 16개 deployment entry를 검증하며, `git diff --check`가 성공한다.

## 2026-08-21 Home FLIP-entry intro verification

- [x] 1280px direct top entry에서 warm-paper 중앙 이름이 한 덩어리로 나타나고 실제 Hero h1의 40px left axis와 glyph line box에 착지한다. Crossfade 전 overlay word와 실제 target의 표시 폭은 443.94px로 같다.
- [x] 768px과 390px은 lite FLIP을 사용한다. 390px 이동 중 이름은 paper와 graphite 양쪽에서 대비를 유지하며, 최종 16px left axis의 h1·인사말·CTA·손으로 직접 이어진다.
- [x] Intro 종료 직후 1280px, 768px, 390px 모두 greeting line과 CTA opacity가 1이고 CTA pointer input이 활성화된다. Overlay, pending class, name/copy/navigation inline opacity가 남지 않는다.
- [x] Hero scroll 0→10px에서 copy와 hand transform은 identity, greeting과 CTA는 opacity 1을 유지하며 역방향 jump가 없다.
- [x] End 조기 종료와 intro 중 1280→768 resize가 overlay와 모든 임시 opacity를 즉시 정리하고 완성된 Hero를 노출한다. Reduced motion, hash entry, BFCache 복귀도 intro를 생략하거나 원자적으로 정리한다.
- [x] Head prepaint cover와 stable scrollbar gutter는 첫 paint의 Hero 선노출 및 종료 순간 가로축 이동을 막는다. 세 viewport 모두 수평 overflow가 없다.
- [x] Final `npm.cmd run verify` builds 105 modules and verifies all 16 deployment entries; `git diff --check` reports no whitespace errors.

## 2026-08-21 Home handwritten intro verification

- [x] Full 1280px entry reveals the nine `SeMinKong` letters left-to-right with a slanted ink mask; the small nib follows the active edge and is gone before the Hero handoff completes.
- [x] Lite 768px and 390px entries preserve the same writing order with the shorter timing. At 175ms the mobile sequence has reached five letters rather than revealing the complete word at once.
- [x] The exact word layer replaces the temporary writing layer before FLIP. At 390px the landing overlay and actual h1 share the same left/top/width within sub-pixel rounding.
- [x] Natural completion removes the overlay and body-level nib, exposes name/copy/CTA at opacity 1, and leaves zero horizontal overflow. Scroll interruption also removes both temporary nodes and clears Hero inline opacity.
- [x] Reduced motion creates neither intro nor nib and exposes the complete Hero immediately.
- [x] Final `npm.cmd run verify` builds 105 modules and verifies all 16 deployment entries. `git diff --check` succeeds and Browser logs contain no warning or error.

## 2026-08-22 About personal Hero statement verification

- [x] About Hero uses `배우고, 만들고, 검증하는 과정을 즐깁니다.` as the personal opening statement while retaining `Software Developer · Seoul`; the removed technology list remains represented by the existing Focus, narrative, questions, and tool matrix.
- [x] At 1280×900 the statement wraps to two lines; at 768×1024 it fits on one line; at 390×844 it wraps to two lines. All three viewports keep the statement and metadata separate with zero horizontal overflow.
- [x] Desktop default capability resolves to `motion=full` and `depth=interactive`, the intro settles at opacity 1 with an identity transform, and a keyboard-focused navigation link retains its visible 2px outline.
- [x] At 390×844, `?motion=reduced` resolves to `motion=reduced` and `depth=flat`; the Hero statement remains visible with opacity 1 and no transform, and tool icon transforms and filters remain disabled.
- [x] Browser warning/error logs are empty. `npm.cmd run verify` builds 105 modules and verifies all 16 deployment entries; `git diff --check` succeeds.

## 2026-08-22 Home intro reading-beat verification

- [x] 1280px 기본 capability는 `motion=full`로 동작한다. 이름은 약 1.55초에 완성된 뒤 2.2초 시점까지 중앙에서 정지하며, 3.4초에는 커튼·FLIP·Hero copy 조립이 진행되고 약 4.9초 안에 overlay와 임시 opacity가 모두 정리된다.
- [x] 768px `motion=lite`는 약 1.1초에 완성 이름을 보여 주고 2.1초에는 전환 중이며, 3.5초에는 overlay·nib·pending class 없이 완성된 Hero를 노출한다.
- [x] 390×844 기본 capability는 `motion=lite`, `depth=static`으로 자동 축약된다. 완성 이름의 정지 구간을 유지하고 종료 후 name, copy, navigation, CTA가 opacity 1과 `pointer-events: auto`이며 수평 overflow가 없다.
- [x] 완성 이름 정지 중 Escape 입력은 intro를 즉시 종료하고 완성된 Hero로 원자적으로 복구한다. `?motion=reduced`는 `reduced/flat`으로 intro와 nib을 만들지 않으며, `#contact` 직접 진입도 intro를 생략하고 목적지로 이동한다.
- [x] 키보드로 Hero 프로젝트 CTA에 포커스했을 때 2px 주황색 outline이 유지된다. Browser warning/error log는 비어 있다.
- [x] `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증한다. `git diff --check`는 whitespace error 없이 성공한다.

## 2026-08-22 Home SVG stroke-order intro verification

- [x] 1280×900 full entry는 12개 SVG path를 `S → e → M → i stem → i dot → n → K stem → K upper → K lower → o → n → g` 순서로 `draw 0 → 1` 처리한다. 중간 프레임에서 다음 획은 `0 1010`, 진행 획은 부분 dasharray, 완료 획은 `1000 0`으로 확인되어 가로 polygon wipe가 아니다.
- [x] Intro DOM과 CSS에는 `.home-intro__nib` 또는 pen/cursor 장식이 없다. 각 글자는 완료 순간 full 최대 약 `scale 1.055 / y -7px`, lite 최대 약 `scale 1.035 / y -4px`로 한 번 튄 뒤 모두 identity에 정착한다.
- [x] 1280px 중앙 이름은 필기 초반 542.6px에서 완료 시 586px로 커지고, Hero target은 443.9px다. FLIP 막바지 표시 폭은 444.6px로 target과 0.7px 차이며, text line-box 기준 위치로 연속 축소·이동한 뒤 실제 h1로 교대한다.
- [x] 768px lite와 390×844 기본 `lite/static`에서도 같은 획순과 축약 bounce를 유지한다. 390px 중앙 이름은 314.5px로 viewport의 32px safe inset 안에 있고, 세 viewport 자연 종료 후 SVG·overlay·pending class·임시 opacity가 남지 않으며 수평 overflow는 0이다.
- [x] 획 중간 Escape, 완성 이름 hold의 pointerdown, 재생 중 1280→768 resize가 다음 프레임 수준으로 overlay와 SVG를 제거하고 name/copy/CTA를 완성 상태로 복구한다. 늦은 callback으로 writing SVG가 재등장하지 않는다.
- [x] `?motion=reduced`는 `reduced/flat`으로 SVG와 intro를 만들지 않고, `#contact` 직접 진입도 intro를 생략한다. Hero 프로젝트 CTA의 2px 주황색 keyboard outline이 유지되고 Browser warning/error log는 비어 있다.
- [x] `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증한다. `git diff --check`는 whitespace error 없이 성공한다.

## 2026-08-22 Persistent handwritten Hero and spaced-name verification

- [x] 11개 runtime HTML route의 title, metadata, header wordmark, footer와 본문 공개 이름을 `Se Min Kong`으로 통일했다. 남은 `SeMinKong`은 GitHub 계정·저장소 URL과 resume asset 이름뿐이다.
- [x] 1280×900 full에서 Intro와 Hero SVG가 같은 `0 0 1000 190` viewBox와 동일한 12개 path data를 사용한다. 완성 hold와 FLIP 중 Intro SVG opacity는 `1`, 숨은 metric Manrope word는 `0`이며 Hero에 `.name-letter`가 생성되지 않는다.
- [x] 초기 HTML부터 Hero에 12개 정적 SVG path가 있으며 h1이 직접 접근 가능한 이름 `Se Min Kong`을 제공한다. 자연 종료 뒤에도 같은 SVG가 남고, 768×1024 lite와 390×844 lite에서 각각 282.9px / 266.8px 폭으로 렌더링되며 page·header 수평 overflow는 0이다.
- [x] `?motion=reduced`는 `reduced/flat`으로 Intro 없이 같은 정적 Hero SVG를 표시한다. `#contact` 직접 진입과 필기 중 Escape skip도 overlay·pending state를 제거하고 Hero name/copy를 opacity 1로 복구한다.
- [x] 390px About route는 title `About — Se Min Kong`, wordmark와 aria-label, footer 저작권을 모두 띄어 쓴 이름으로 표시하며 page·header overflow가 없다.
- [x] Hero 프로젝트 CTA는 keyboard key input으로 focus했을 때 2px vermilion solid outline과 4px offset을 유지한다.
- [x] `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증한다. `git diff --check`도 whitespace error 없이 성공한다.

## 2026-08-22 Asta Sans / Geist Mono typography verification

- [x] 1280×900 About에서 body와 h1의 computed family는 `Asta Sans Variable`, metadata는 `Geist Mono Variable`이며 두 variable font가 로드된다. 화면과 문서의 수평 overflow는 0이다.
- [x] 390×844 About, Work, Resume에서 새 제목·본문·metadata 위계가 유지된다. About의 세 긴 질문, Work의 `Brain Tumor MRI`·`Project Prompt Generator`, Resume의 `semin1224@gmail.com`은 각 container 안에서 줄바꿈되고 수평 overflow는 0이다.
- [x] Intro 재생 중 숨은 measure와 최종 Hero fallback의 computed family는 `Manrope Variable`이다. Intro/Hero는 동일한 12개 path data를 사용하며 최종 SVG 폭은 1280px에서 466.0px, 768px에서 282.1px, 390px에서 266.8px다.
- [x] 390×844 `?motion=reduced`는 `motion=reduced`, `depth=flat`으로 진입해 Intro를 활성화하지 않고 정적 12-path Hero SVG, opacity 1 copy, `transform: none`을 표시한다. 새 Asta Sans 본문과 0 horizontal overflow도 유지된다.
- [x] Keyboard focus는 2px vermilion solid outline과 4px offset을 유지한다. 최종 Vite session에는 warning/error가 없고 HMR error overlay도 없다.
- [x] `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증한다. `git diff --check`는 whitespace error 없이 성공한다.

## 2026-08-22 Dongle / Gowun Dodum typography verification

- [x] Display, heading, navigation과 주요 action은 `Dongle`; 긴 본문과 metadata는 `Gowun Dodum`; Intro/Hero의 투명 측정 글자는 `Manrope Variable` 680과 `-0.055em`을 사용하도록 source에서 분리했다.
- [x] Asta Sans와 Geist Mono package/import를 제거하고 Dongle 400/700 및 Gowun Dodum 400 Korean/Latin WOFF2만 production asset으로 생성한다. 외부 runtime font request는 없다.
- [x] Header wordmark hover는 Dongle 700을 고정한 lift wave로 바뀌었고, Hero의 동일한 12-path SVG와 Intro timeline에는 변경이 없다.
- [x] 제목 tracking은 최대 약 `-0.012em`, 한글 heading은 0에 가깝게 완화했으며 navigation/action의 Dongle 글자 크기는 기존 44px 이상 hit area 안에서 보정했다.
- [x] `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증했으며, 현재 `http://127.0.0.1:5173/` preview가 HTTP 200으로 응답한다.
- [x] 1280px, 768px, 390px real-browser에서 Home, About, Work의 wrapping, horizontal overflow와 computed font를 육안·수치로 확인했다.

## 2026-08-23 Shared-signature handoff and typography verification

- [x] 390×844, 768×1024, 1280×720에서 Intro의 animated SVG와 Hero target rect를 비교했다. 완료 직전 최대 차이는 각각 0.37px, 0.06px, 0.18px이며 완료 후에는 동일 rect다.
- [x] 세 viewport 모두 필기 SVG reference와 완료 후 `.hero-identity__wordmark`가 같은 DOM node다. Intro 전후 font-size도 각각 48.75px, 57.6px, 88.55px로 바뀌지 않고 문서 horizontal overflow는 0이다.
- [x] 두 half panel, 중앙 seam과 SVG opacity crossfade가 없다. 단일 paper veil은 방향성 wipe 없이 fade하고, 서명은 dark ink에서 off-white로 대비를 유지하며 Hero copy·hand·navigation은 후반에 조립된다.
- [x] Home, About, Work를 세 viewport에서 확인해 header left/right safe inset, page-width 정렬, About 긴 질문과 Work 긴 제목의 wrapping을 검증했다. 모든 title element는 container overflow가 없다.
- [x] Intro 중 Escape는 overlay와 pending state를 제거하고 name/copy/hand/navigation을 opacity 1로 복구한다. `?motion=reduced`는 `reduced/flat`, Intro 없음, 정적 12-path SVG, horizontal overflow 0이다.
- [x] Hero primary CTA의 keyboard focus는 2px vermilion outline과 4px offset을 유지하며 Browser warning/error log는 비어 있다.
- [x] `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증했다. `git diff --check`는 whitespace error 없이 성공한다.

## 2026-08-23 One-second post-writing handoff verification

- [x] 실제 브라우저에서 마지막 path의 computed dash가 `1000px, 0px`가 된 시점부터 Intro DOM 제거까지 측정했다. 1280×720 full은 `920ms`, 768×1024 lite는 `801ms`, 390×844 lite는 `761ms`로 모두 `1s` 이내다.
- [x] 세 viewport 모두 단일 veil opacity가 역행 없이 감소하고, 완료 후 Intro/pending/active state는 남지 않으며 Hero wordmark는 하나, name opacity는 1, horizontal overflow는 0이다.
- [x] 1280×720의 중간 fade frame을 육안으로 확인해 마지막 bounce 뒤 완성된 이름과 희미해지는 paper 아래 Hero가 연속적으로 이어지고 방향성 curtain이나 seam이 다시 생기지 않았음을 확인했다.
- [x] `?motion=reduced`는 390×844에서 Intro 없이 `reduced/flat`과 정적 Hero wordmark 하나로 시작한다. 재생 중 Escape는 Intro를 즉시 정리하고 name/copy/hand/navigation을 모두 opacity 1로 복구한다.
- [x] 개발 브라우저의 warning/error log는 비어 있고 `npm.cmd run build`는 105 modules를 성공적으로 build한다. `git diff --check`도 whitespace error 없이 성공한다.

## 2026-08-23 Responsive typography scale verification

- [x] Home, About, Work, Resume, Copyright와 6개 case route를 390·768·1280px 실제 브라우저에서 검사했다. 33개 조합 모두 제목·본문·link의 viewport 이탈이 없고 document horizontal overflow가 없다. Home의 body 폭만 3D hand rig가 clip 영역 밖으로 16px 확장하지만 root scroll width는 viewport client width에 고정된다.
- [x] About title은 390·768·1280px에서 `80 / 102.22 / 139.08px`, Work title은 `75.2 / 94.31 / 121.44px`, Case section heading은 `24 / 26.5 / 29.6px`로 단조 증가한다. Resume label은 같은 폭에서 `14 / 14.19 / 14.71px`이다.
- [x] 경계 폭을 직접 확인했다. About 699·700·701px, Home·Work 719·720·721px, Home 899·900·901px의 720px 높이, Legal·THING 599·600·601px, Resume·Legal 819·820·821px, Prompt case 839·840·841px, Work 959·960·961px 모두 font-size 역행과 text overflow가 없다.
- [x] 320px에서 Home, About, Work, Resume, Copyright, THING, Prompt case의 제목·본문·header text가 viewport를 벗어나지 않는다. 390px Prompt의 긴 제목은 `Project Prompt / Generator` 두 줄로 자연스럽게 유지된다.
- [x] Computed font family는 display·heading이 Dongle, 본문·metadata가 Gowun Dodum으로 유지된다. Home의 SVG wordmark와 Intro motion source는 수정하지 않았다.
- [x] 390px `?motion=reduced`는 `reduced/flat`, tool transform `none`, transition `0s`이고 1280px 기본 About은 `full/interactive`다. Browser log에는 Vite 연결 debug 외 warning/error가 없다.
- [x] `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증했다. `git diff --check`도 whitespace error 없이 성공한다.

## 2026-08-23 150% global typography verification

- [x] Home, About, Work, Resume, Copyright와 6개 case route를 390·768·1280px 실제 브라우저에서 다시 검사했다. 33개 조합 모두 body computed size가 `24px`이며 제목·본문·link의 viewport 이탈과 document horizontal overflow가 없다.
- [x] About h1은 390·768·1280px에서 `120 / 153.32 / 208.62px`, Work h1은 `112.8 / 141.46 / 182.17px`, case h1은 `84.56 / 121.42 / 171.34px`로 커지면서 단조 증가한다. 긴 `Project Prompt Generator`도 390px에서 container 안의 세 줄로 유지된다.
- [x] 390px Home은 최종 SVG 서명이 `57px` metric과 약 `300px` 표시 폭으로 16px 왼쪽 inset 안에 머문다. 1280px은 `132.83px` metric과 약 `493px` 표시 폭을 사용한다. Intro와 Hero는 같은 font-size·12개 path를 공유하고 자연 종료 후 overlay나 horizontal overflow가 남지 않는다.
- [x] Header 720·721px, About 699·700·701px, Work 719·720·721px 및 959·960·961px, Resume 819·820·821px, Legal 599·600·601px, case 839·840·841px 전환 전후를 검사했다. 2행 header, 1열 Work, stacked Resume date, 2열 tool matrix가 예정된 경계에서 적용되며 text overflow가 없다.
- [x] 1280px 기본 Home은 `motion=full`, `depth=interactive`; 390px 기본 Home은 `motion=lite`, `depth=static`; `?motion=reduced`는 `reduced/flat`으로 intro 없이 완성된 Hero를 표시한다. Font 확대는 획순·bounce·1초 이내 handoff timeline을 수정하지 않는다.
- [x] 실제 브라우저 화면으로 390px Home·About·Prompt, 768px Work, 961px Work 전환, 1280px Home·Resume를 확인했다. 개발 브라우저 log에는 Vite 연결 debug 외 warning/error가 없다.
- [x] 최종 `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증했다. `git diff --check`도 whitespace error 없이 성공한다.

## 2026-08-23 Balanced 120% typography and signature-ratio verification

- [x] Home, About, Work, Resume, Copyright와 6개 case route를 390·768·1280px 실제 브라우저에서 다시 검사했다. 33개 조합 모두 body computed size가 `19.2px`이며 title·본문·link의 viewport 이탈과 document horizontal overflow가 없다.
- [x] About h1은 390·768·1280px에서 `96 / 122.66 / 166.90px`, Work h1은 `90.24 / 113.17 / 145.73px`, case h1은 `67.65 / 97.13 / 137.07px`로 단조 증가한다. 390px `Project Prompt Generator`는 container 안의 자연스러운 두 줄로 정리된다.
- [x] Home의 최종 name metric은 390px에서 `51.75px`, 1280px에서 `106.26px`다. 390px 표시 path는 약 `256 × 42.6px`, 1280px은 약 `464 × 77.2px`이며 모두 동일한 약 `6.0133:1` path-bounds 비율을 유지한다.
- [x] 정적 Home SVG를 390·768·1280px에서 측정한 path-bounds 비율 spread는 약 `0.000001`이다. 1280px full의 필기·handoff·착지 spread는 약 `0.000775`이고, intro parent transform은 `matrix(1.2643, 0, 0, 1.2643, …)`처럼 X/Y가 같은 균일 배율이다. 390px lite도 필기부터 착지까지 같은 비율을 유지한다.
- [x] Header 358·359·360·390·600·720·721px, About 699·700·701px, Work 959·960·961px, Resume 819·820·821px, case 839·840·841px 경계를 검사했다. 360px부터 header는 한 행, 359px 이하는 두 행이며 모든 필수 검사 폭에서 text overflow가 없다.
- [x] 1280px 기본 Home은 `full/interactive`, 390px 기본 Home은 `lite/static`, 390px `?motion=reduced`는 `reduced/flat`과 Intro 없는 정적 `xMidYMid meet` SVG로 동작한다. 개발 브라우저 log에는 Vite 연결 debug 외 warning/error가 없다.
- [x] 최종 `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증했다. `node --check src/motion/home-intro.js`와 `git diff --check`도 오류 없이 성공한다.

## 2026-08-23 Pressure Ink Hero verification

- [x] 1280×900 full/interactive에서 data-fluid-mode=stable, compact half-float profile이며 빠른 이동, drag, 급반전과 click plume이 서로 다른 persistent wake를 만든다.
- [x] 서명·문장·CTA quiet obstacle 안으로 dye가 번지지 않는다. 입력 전후 동일 12-path Se Min Kong은 559.25 × 95.63px, computed transform none으로 유지된다.
- [x] 768×1024와 390×844은 lite renderer이며 세 viewport 모두 document horizontal overflow가 0이다. 1280↔768 runtime resize도 stable↔lite로 오류 없이 교대한다.
- [ ] 실제 touch device에서 native pan과 같은 pointer id의 짧은 tap impulse를 확인한다. Source에는 passive pointer listener, touch move 제외와 pointerId matching이 적용되어 있다.
- [x] ?motion=reduced는 canvas display none, static marbling, wordmark 1개와 완성 Hero를 즉시 표시한다. CTA는 visible/enabled이며 keyboard focus에서 2px vermilion outline과 4px offset을 유지한다.
- [x] Hero를 5초 이상 offscreen에 둔 뒤 복귀해 stable mode, horizontal overflow 0, stale burst 없음과 빈 warning/error log를 확인했다.
- [ ] 실제 WEBGL_lose_context 또는 브라우저 GPU reset으로 context loss/restoration fallback을 확인한다. Source의 loss/restore 재생성 경로는 정적 감사했다.
- [x] 두 motion module의 node --check, npm.cmd run verify의 106-module build와 16개 deployment entry 검사, git diff --check가 성공한다.

## 2026-08-23 Paper Current Hero verification

- [x] Home HTML에서 robotic hand/cube DOM을 제거하고 full-bleed `aria-hidden` canvas를 semantic h1·인사말·CTA 뒤에 배치했다. Intro와 Hero는 기존 `0 0 1000 190`, `xMidYMid meet`, 12-path 서명을 계속 공유한다.
- [x] Fluid canvas는 `pointer-events: none`이고 Hero의 passive pointer listener는 link/button을 제외한다. Touch move를 취소하거나 pointer capture하지 않으며 mobile tap은 짧은 pointerup만 impulse로 처리한다.
- [x] Full/lite/reduced, WebGL 실패·context loss, hidden/offscreen pause와 Intro Promise wake 경로가 source에 분리되어 있다. Reduced는 canvas를 표시하지 않고 정적 paper/graphite/vermilion fallback을 사용한다.
- [x] `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증했으며 local Home route가 HTTP 200으로 응답한다.
- [x] 390px, 768px, 1280px 실제 브라우저에서 중앙 정렬, quiet zone, 서명 비율, 수평 overflow, CTA focus/click과 fluid runtime console을 최종 확인했다.

## 2026-08-23 Mandatory Home intro completion verification

- [x] 1280×720 full에서 Intro 초반에 실제 Escape, Tab, PageDown과 overlay click을 연속 입력했다. Intro는 계속 `pending / active / locked`, body는 `aria-busy=true`, 배경 direct child 4개는 `inert`, active element는 body, `scrollY=0`을 유지한다.
- [x] 같은 입력을 768×1024와 390×844 lite에서도 반복했다. 두 화면 모두 입력 직후 Intro가 남고 scroll이 0이며, 자연 완료 뒤 Intro·locked class·busy·inert가 모두 사라진다.
- [x] 자연 완료 후 name/copy/fluid/navigation computed opacity는 모두 1이다. Hero wordmark는 1개와 기존 12 path만 남고, 1280px full은 그 뒤에 smooth scroll을 시작하며 PageDown이 다시 정상적으로 문서를 이동한다.
- [x] 390px `?motion=reduced`는 `reduced/flat`으로 Intro·lock 없이 정적 12-path Hero를 즉시 표시한다. `#contact` 직접 진입도 Intro, inert, busy state를 만들지 않는다.
- [x] 기본 1280px full 재생 중 viewport를 390×844로 바꿔 motion tier가 lite가 되어도 Intro가 조기 종료되지 않는다. 자연 종료 후 wordmark 1개, 12 path, transform none, horizontal overflow 0이며 lock 흔적이 없다.
- [x] Head gate는 module 이전 입력을 막고 4초 fallback이 자체 listener와 `data-home-intro-inert/busy` marker를 제거한다. Module `finish()`는 `finally`에서 같은 cleanup을 수행해 timeline/commit 예외에도 영구 lock이 남지 않게 한다.
- [x] 브라우저 log에는 Vite 연결 debug 외 warning/error가 없다.
- [x] 최종 `npm.cmd run verify`가 105 modules를 build하고 16개 deployment entry를 검증했다. `node --check src/motion/home-intro.js`와 `git diff --check`도 오류 없이 성공한다.

## 2026-08-23 Route-aware refactor verification

- [x] `config/site-routes.js`의 11개 route가 6개 entry와 일치하고, `verify:source`가 삭제된 legacy entry·`site.css`·Hand/Cube selector의 재등장을 거부한다.
- [x] Home은 `portfolio-shared + home`, Work는 `portfolio-shared + work`, case study는 `case-study` page CSS만 로드한다. Work production HTML에는 `portfolio-*`, case HTML에는 `portfolio-*` 또는 `work-*` asset이 없다.
- [x] Home/Work/case/About/Resume/Copyright를 390·768·1280px 실제 브라우저에서 확인했다. 33개 route/width 조합 모두 기존 typography·정렬·wrapping을 유지하고 document horizontal overflow가 0이다.
- [x] Home full은 Intro 자연 완료 뒤 Stable/compact Fluid와 Lenis를 시작한다. 768px lite는 Lite Fluid와 native scroll, 390px reduced는 Lenis·WebGL canvas 없이 Static Hero를 표시한다.
- [x] Home Intro 도중 Work로 이탈한 뒤 Back/Forward를 두 번 반복했다. 복귀 Home은 Intro lock 없이 Stable Fluid·wordmark 1개, Work는 story active row 1개를 유지하고 중복 초기화·overflow·browser log가 없다.
- [x] Lenis async setup은 shared loading Promise, generation token과 `try/catch`로 native-scroll fail-open을 보장하고, HMR/runtime destroy는 controller를 역순으로 정리하도록 source 감사했다.
- [ ] 실제 Lenis chunk fetch 실패와 Vite HMR dispose를 강제로 주입해 unhandled rejection·중복 listener가 없는지 확인한다.
- [x] Contract test가 공개 이름, 9 letter group·12 path 순서, target bucket, Pressure Jacobi 14회, 최대 12 splat과 192/512 solver size를 고정한다. 실제 브라우저에서 Stable → Lite → Static tier도 확인했다.
- [x] `npm.cmd run verify`, `git diff --check`, browser warning/error log, 2px/4px keyboard focus와 모든 production local reference 검사가 통과한다.

## 2026-08-23 Site-wide Fluid and adaptive-resolution verification

- [x] Home, Work, About, Resume, Copyright와 6개 case route를 1280×900, 768×1024, 390×844 실제 브라우저에서 검사했다. 33개 조합 모두 fixed Site Fluid layer/canvas가 정확히 1개이고 document horizontal overflow가 0이다.
- [x] 1280px full/interactive는 모든 route에서 `stable/high/compact`, 768px과 390px lite/static-depth는 `lite/baseline`이다. Canvas backing과 CSS viewport aspect 차이는 모든 조합에서 0.0006 이하이다.
- [x] Home·Work·About의 warm paper profile과 THING dark case profile을 실제 화면으로 확인했다. 읽기 영역 quiet zone, nav/content/media/page-curtain stacking과 이름 SVG의 원래 비율이 유지된다.
- [x] Contract test가 `high 256/768`, `balanced 224/640`, `baseline 192/512`, maximum 1536과 390×844 / 768×1024 / 1280×900의 aspect-preserving 16px bucket target을 고정한다.
- [x] 한 Home 문서에서 1280→768→390→1280 live resize를 실행해 `stable/high → lite/baseline → lite/baseline → stable/high`으로 전환했으며 layer 중복, overflow와 browser warning/error가 없다.
- [x] About는 initial seed 뒤 `data-fluid-state=idle`로 rAF sleep하고 fine-pointer 이동 직후 `active`로 깨어난다. Home은 continuous `active`를 유지하며 hidden/pagehide용 timer/frame cleanup은 source에서 확인했다.
- [x] Home Intro 180ms 시점은 canvas 기본 300×150이고 fluid mode가 아직 없으며 page가 locked다. 자연 완료 뒤에만 1139×810 Stable/high를 할당하고 lock을 해제한다.
- [x] `?motion=reduced`는 Intro lock과 WebGL allocation 없이 `static/none`, canvas display none, 300×150 기본 buffer를 유지한다. Mobile About의 native scroll 뒤에도 fixed layer top은 0이고 viewport height를 유지한다.
- [x] Home→Work→Back 복원 뒤 Home은 layer와 wordmark가 각각 1개, Stable/high active, Intro lock 없음, overflow 0이다.
- [x] `npm.cmd run verify`가 119 modules를 build하고 16개 deployment file을 검증했다. `git diff --check`와 개발 브라우저 warning/error log도 비어 있다.
- [ ] 실제 touch 기기에서 vertical pan, long press, 서로 다른 pointer id와 같은 pointer id의 short-tap impulse를 확인한다. Source는 passive listener, touchmove 제외, 10px/420ms threshold와 pointer-id match를 사용한다.
- [ ] 강제 framebuffer allocation failure와 실제 `WEBGL_lose_context`로 high→balanced→baseline→Lite→Static 및 context restoration을 관찰한다. Resource cleanup과 fallback 순서는 source와 pure sizing/quality contract로 검증했다.

## 2026-08-24 Transparent Fluid Ink and interaction verification

- [x] 1280×900 Home full/interactive는 `stable/high/active`, 독립 obstacle 5개로 실행되며 blank 영역의 긴 pointer path 뒤 graphite plume이 Hero 아래에 명확하게 남는다.
- [x] 1280×720 Work의 project anchor 내부 text 위에서 pointer path가 `idle → active`로 전환되고, overlay는 `pointer-events: none`이라 실제 project-card click이 `/work/thing/`로 이동한다.
- [x] 390×844과 768×900 Work는 `lite/baseline`, 보이는 media와 heading을 각각 독립 obstacle로 보호하고 anchor 내부 pointer path에도 active를 유지한다. 세 폭 모두 document horizontal overflow는 0이다.
- [x] Paper/grain base와 transparent Ink canvas는 각각 1개이며 z0 base → z1 main → z2 Ink → navigation/curtain/focus UI 순서를 유지한다. THING dark Hero와 Prototype evidence 이미지 두 개는 pointer 입력 뒤에도 덮이지 않는다.
- [x] Home deck은 collapsed → expanded transform의 update/completion마다 quiet geometry를 갱신한다. Work keyboard focus는 visible control을 최우선 obstacle로 다시 측정하고 2px focus outline을 유지한다.
- [x] 제목·nav·button·project surface의 computed `user-select`는 none이고 Home/Resume 연락처, evidence/source link와 장문 본문은 auto라 복사 가능하다.
- [x] `?motion=reduced`는 `reduced/flat`, `static/none`, canvas display none이며 paper base만 유지한다. 브라우저 warning/error log는 Vite debug 외 0건이다.
- [x] `npm.cmd run verify`가 120 modules를 build하고 11 route·16 deployment entry를 검증한다. Contract test 6개, JS syntax check와 `git diff --check`도 통과한다.
- [ ] 실제 touch 기기 short-tap/native vertical pan과 강제 `WEBGL_lose_context` restore는 이번 브라우저 세션에서 주입하지 않았다. Passive touch, context-loss cleanup과 restore 순서는 source 재감사했다.

## 2026-08-24 Production Home Fluid cascade verification

- [x] `npm.cmd run verify`가 6개 contract test, 11개 route source boundary, 120-module production build와 16개 deployment entry를 모두 통과했다.
- [x] Production preview의 Home을 390×844, 768×1024, 1280×720 실제 브라우저에서 확인했다. 세 폭 모두 Site Fluid wrapper/base가 각각 하나이고 wrapper는 body 직계 자식, `position: fixed`, `z-index: 2`, viewport 높이, transparent background이며 document horizontal overflow가 0이다.
- [x] 390px과 768px은 `lite/baseline`, 1280px은 `stable/high`로 기존 capability fallback을 유지한다. 모든 폭에서 obstacle 5개와 active state가 확인되고 browser warning/error log는 비어 있다.
- [x] 390×844 `?motion=reduced`는 `reduced/flat`, `static/none`, fixed wrapper, 숨은 canvas와 horizontal overflow 0을 유지한다.
- [x] Production CSS에서 scoped legacy selector와 fixed Site Fluid contract를 직접 검증한다. broad `.home-page .hero-fluid` root selector의 재도입은 source와 dist verification에서 모두 실패한다.
- [x] 1280×720 Home 첫 화면을 육안으로 확인해 graphite/vermilion Ink가 Hero copy 주변에 보이고 navigation, 서명과 CTA가 가려지지 않는 것을 확인했다.
- [ ] 실제 touch 기기와 강제 WebGL context loss는 CSS selector 범위만 바꾼 이번 수정에서 다시 주입하지 않았다. 관련 passive input, fallback과 lifecycle 코드는 변경하지 않았다.

## 2026-08-24 Quiet Gallery surface and typography verification

- [x] Source와 production bundle에 Site Fluid, Pressure Ink, Hero Fluid, cursor follower, magnetic, name wave, depth tilt와 별도 media scroll-kinetics runtime이 남지 않는다. Full desktop의 page-level Lenis smooth scroll은 유지한다.
- [x] Asta Sans는 visible display/body/navigation에, Geist Mono는 영문 metadata/technical label에 적용되고 Dongle/Gowun Dodum dependency와 font token은 남지 않는다.
- [x] Home Intro는 정적 hero surface 위에서 자연 완료되고 reduced 진입은 완성된 동일 12-path 서명을 즉시 표시한다.
- [x] Home project deck은 실제 hover와 keyboard focus에서 펼쳐지고, 서로 다른 pointer 좌표에서도 card transform이 동일하며 focus/leave 뒤 정상적으로 접힌다.
- [x] Home, Work, About, Resume, Copyright와 THING·Prompt case를 390px, 768px, 1280px 실제 브라우저에서 확인했다. 21개 조합 모두 title/text viewport 이탈과 horizontal overflow가 0이고, Work focus와 THING native video controls가 안정적이다.
- [x] `npm.cmd run verify`, `git diff --check`와 browser warning/error 검사가 통과한다.
- [ ] 실제 touch hardware의 vertical pan은 이번 세션에서 재검사하지 않았다. 390px static-depth 환경에는 Fluid/touch listener와 deck pointer mode가 없고 case video는 native controls를 유지한다.

## 2026-08-24 Curatorial GSAP choreography verification

- [x] Home 1280×900 full에서 Intro 완료 전에는 story가 비활성이고, 완료 뒤 `data-scroll-story-active`가 생긴다. Hero 중간값과 최종값, reverse scroll의 `opacity 1 / transform identity` 복귀를 실제 브라우저에서 확인했다.
- [x] Work 1280×900 full에서 six chapter와 list progress rail이 활성화된다. AQIS reading beat에서 필수 copy opacity는 모두 1이고 rotation/filter 없이 stage와 title이 identity에 정착한다.
- [x] Work 1280×630과 768×1024는 static list로 전환되고 active class, `--work-progress`와 descendant inline style이 모두 제거된다. 768→1280 왕복 뒤 story가 한 번 다시 활성화된다.
- [x] THING 1280×900 full에서 네 Demo, 두 Prototype figure, 네 Pipeline 행과 네 Architecture item이 순서대로 scrub된다. 네 `video`는 inline transform/opacity 없이 native `controls`를 유지한다. 실제 video focus에서 item `:focus-within`이 media/caption을 opacity 1, transform none으로 복구하고 바깥 section도 clip/transform none이다.
- [x] THING 1280→768→1280 왕복에서 `thing-story-enabled`, active class와 모든 owned target inline style이 완전히 정리·재생성된다. 처음 발견한 `gsap.set()` 잔여 style은 explicit owned-property cleanup으로 수정하고 inline 0개를 재확인했다.
- [x] 1280×900에서 Work→THING→Back→Forward history 복원을 실행했다. 복귀 Work는 story와 active chapter가 한 번 활성화되고, THING은 story 한 번·video inline style 0개를 유지하며 두 route 모두 overflow가 0이다.
- [x] Home, Work, THING을 390×844, 768×1024, 1280×900에서 검사했다. Document horizontal overflow는 모두 0이며 reduced에서는 GSAP active class와 owned inline style이 0이다.
- [x] Contract test는 Intro-ready gate, route 등록, no pin/snap, Work rotation/filter 제거, THING의 video 비대상화와 loader retry를 고정한다. Source verification과 production build가 통과했다.
- [x] Contract test는 THING owned section 제목이 generic prepaint tint에서 제외되는지와, hidden Work가 이미 활성인 context의 expanded geometry를 보존하는지도 고정한다.
- [ ] 실제 touch hardware의 native vertical pan과 HMR 도중 pending dynamic import 실패 주입은 이번 세션에서 실행하지 않았다. Source의 generation guard, native controls와 static cleanup은 확인했다.

## 2026-08-24 Perceptible exhibition choreography verification

이 항목은 위의 Curatorial GSAP 결과 중 짧은 scrub, no-label/no-progress, 700px height gate와 2열 THING demo 결과를 대체한다.

- [x] Home 1280×900 첫 화면에서 `SCROLL TO ENTER THE EXHIBITION · 01 / 06` label과 2px vermilion hairline이 보인다. 495px handoff 중간에서 CTA → 두 문장 → 서명이 서로 다른 opacity/Y 상태로 철수하고, reverse scroll은 progress 0, CTA opacity 1과 pointer auto로 복귀한다.
- [x] Home 1280×650에서도 story가 활성화되고 358px travel을 확보한다. 종료 지점의 투명 CTA는 pointer none이며, 실제 keyboard focus를 주면 focus-within으로 opacity 1, pointer auto와 solid focus outline이 즉시 복구된다.
- [x] Home 768×1024와 390×844은 각각 정확히 100svh의 static Hero이고 active attribute, story inline style, cue와 dead travel이 없다. 1280×900 `?motion=reduced`도 reduced/flat, 100svh, visible CTA, zero overflow다.
- [x] Work 1280×900과 1280×650에서 2px progress rail, `01 / 06`–`06 / 06` wall label과 강화된 mat entry/exit가 활성화된다. 1280×630, 768×1024와 390×844은 story class/progress/descendant inline style 없이 static이며 모든 크기에서 horizontal overflow가 0이다.
- [x] THING 1280×650과 경계 폭 1024×640에서 sticky demo, `01 / 04` label과 video 바깥 decorative frame이 보인다. 1024×640의 첫 demo card는 598×540px 안에 있고 portrait video는 268×477px로 native controls까지 viewport 안에 남는다.
- [x] THING demo media wrapper의 computed transform은 none, opacity는 1이고 inline style은 `--demo-frame-progress`만 가진다. 모든 native video는 inline style 없이 controls를 유지하며 768×1024·390×844 fallback에서는 chapter label과 모든 owned inline style이 제거되고 overflow가 0이다.
- [x] Home·Work·THING controller는 활성 document가 hidden/pagehide 될 때 expanded geometry를 보존하고 visible 복귀 시 capability 평가와 refresh를 수행하도록 source와 독립 review에서 확인했다. 수동 demo video는 viewport 이탈·hidden·pagehide 때 pause하고 자동 resume하지 않는다.
- [x] 최신 `npm.cmd run verify`는 contract test 4개, route source 11개, production module 105개와 deployment entry 16개를 통과했다. 실제 브라우저 log는 Vite debug/HMR 외 warning·error가 없다.
- [ ] 실제 touch hardware의 native vertical pan과 HMR 중 pending dynamic import 실패 주입은 실행하지 않았다. Static/coarse capability gate, generation guard와 cleanup은 source contract로 검증했다.

## 2026-08-25 Work horizontal exhibition rail verification

이 항목은 Work에 관한 위의 vertical sticky chapter 결과를 대체한다. Home과 THING 검증은 그대로 유효하다.

- [x] 1280×900 full/interactive에서 `[data-work-viewport]` pin spacer가 정확히 하나이고 6329px track이 5064px travel 동안 왼쪽으로 진행한다. Showroom header는 navigation 아래 고정되고 2px progress와 `01 / 06`–`06 / 06` readout이 실제 card center에 맞춰 갱신된다.
- [x] 첫 THING 장면, AQIS reading beat와 마지막 Prompt Generator 장면을 실제 화면으로 확인했다. AQIS media stage와 title은 중앙에서 opacity 1, transform identity, clip inset 0에 정착하며 마지막 card 뒤에는 pin이 풀리고 Contact/Footer가 정상 문서 흐름으로 이어진다.
- [x] 마지막 Prompt link와 첫 THING link를 keyboard focus 대상으로 직접 왕복했다. Smooth-scroll immediate settlement 뒤 두 card는 viewport 안에 완전히 들어오고 readout은 각각 06/01, title opacity 1과 단일 2px vermilion focus outline을 유지한다.
- [x] 768×1024, 390×844, 1280×630과 1280×900 `?motion=reduced`는 pin spacer, enhanced class와 owned inline style이 0인 세로 static list다. 모든 화면에서 document horizontal overflow가 0이며 390px navigation, Hero copy와 showcase header가 viewport 안에 남는다.
- [x] 1280×630→900→630→900 live resize에서 pin spacer 수가 `0→1→0→1`, owned inline target 수가 `0→43→0→43`으로 정리·재생성되고 중복 pin과 overflow가 없다. About 왕복 뒤에도 pin과 active row는 각각 하나다.
- [x] Browser warning/error log가 비어 있고 `npm.cmd run verify`가 contract test 4개, route source 11개, production module 105개와 deployment entry 16개를 통과했다.
- [ ] 실제 touch hardware의 vertical pan은 이번 세션에서 실행하지 않았다. 390px/coarse 환경은 GSAP loader 전에 static gate를 통과하고 Work controller에는 wheel/touch listener와 preventDefault가 없다.

## 2026-08-25 Work continuous typographic contents rail verification

이 항목은 바로 위 Work card-rail의 폭, 작은 title reveal과 no-SplitText 결과를 대체한다.

- [x] 1280×720 full/interactive 실제 브라우저에서 pinned viewport와 pin spacer가 각각 하나다. Continuous track은 8718px, 실제 travel은 7453px이고 여섯 borderless scene이 `01 / 06`부터 `06 / 06`까지 끊김 없이 진행하며 document horizontal overflow는 0이다.
- [x] THING, AQIS, Brain Tumor MRI, Alkkagi.io, Briefit와 Project Prompt Generator의 중앙 reading beat를 육안으로 확인했다. 대형 title·실제 media·mono placard가 각기 다른 위치에서 앞뒤 장면과 교차하며, 반복 card border와 2-column placard 구도는 보이지 않는다.
- [x] Transition 중 title char는 서로 다른 `rotateX / rotation / x / yPercent / opacity` 값을 가지며 중앙에서는 identity로 조립된다. AQIS·Brain·Alkkagi·Briefit·Prompt의 title과 필수 copy가 잘리지 않고 실제 media 비율이 유지된다.
- [x] 마지막 Prompt link와 첫 THING link를 실제 keyboard focus 대상으로 왕복했다. Immediate focus settlement 뒤 readout은 06/01로 바뀌고 모든 split char는 `opacity 1 / transform none`, media와 placard는 완성 상태, project anchor 하나만 2px vermilion outline을 가진다.
- [x] 두 Work preview `video`에는 inline style이 없고 artifact wrapper만 움직인다. 마지막 scene 뒤 progress 1에서 pin이 풀리고 Contact와 Footer가 정상 문서 흐름으로 이어진다.
- [x] 1280×720 `?motion=reduced`는 pin spacer, enhanced class, SplitText char와 owned inline style이 모두 0인 세로 static list이며 horizontal overflow도 0이다.
- [x] Browser warning/error log는 비어 있고 최신 `npm.cmd run verify`가 contract test 4개, route source 11개, production module 106개와 deployment entry 16개를 통과한다. SplitText는 Work용 별도 `7.06 kB raw / 3.26 kB gzip` chunk다.
- [ ] 390px, 768px과 1280×630 actual viewport는 이번 브라우저 세션에서 다시 만들 수 없어 재실행하지 않았다. Enhanced selector는 runtime class 아래에만 있고 기존 961px/640px gate와 static DOM/CSS는 유지되며 source/build contract가 이를 확인한다. 바로 위 horizontal rail QA의 해당 viewport 결과는 변경 전 fallback에 대해 유효하다.
- [ ] 실제 touch hardware의 native vertical pan과 HMR 중 pending SplitText import 실패 주입은 실행하지 않았다. Controller에는 wheel/touch listener와 preventDefault가 없고 loader retry, generation guard와 SplitText revert는 source contract로 확인했다.

## 2026-08-25 Jua / Signika typography verification

- [x] Home, Work, About, Resume, Copyright와 여섯 case study, 총 11개 route를 390px, 768px, 1280px 실제 브라우저에서 확인했다. 모든 route에서 `document.fonts.status=loaded`, Signika/Jua font check가 true이고 document horizontal overflow와 browser warning/error가 0이다.
- [x] Visible CSS의 font-family 선언 79곳이 `Signika Variable → Jua → Korean system fallback` token으로 수렴한다. Asta Sans·Geist Mono·Dongle·Gowun Dodum은 source token, dependency와 production font asset에 남지 않는다.
- [x] Root 120% 기준 기본 body 19.2px, 본문 최대 640px measure를 유지했다. Home statement, About의 긴 혼합 언어 질문, Resume의 긴 project title/body, Legal 장문과 case copy가 390/768/1280px에서 자연스럽게 감기고 잘리거나 겹치지 않는다.
- [x] Signika 폭으로 넘치던 AQIS `Integration`, Briefit `Contribution`·`Product Integration`, THING `Prototype`·`Architecture`는 desktop 최소 200px heading 열과 840px 이하 1열 전환으로 해소했다. 390px MRI `92.7%`도 자체 150px 영역 안에 맞는다.
- [x] Jua는 실제 400 한 굵기로 렌더링되고 `font-synthesis: none`을 유지한다. 한글 heading/body 위계는 크기, 색, line-height와 spacing으로 구분되며 가짜 bold를 만들지 않는다.
- [x] Work 1280×720 enhanced rail은 Signika font-ready 뒤 61개 title char를 SplitText로 다시 계산하고 8718px track, 첫/마지막 focus 완성 상태와 horizontal overflow 0을 유지한다. Reduced/static 경로에는 split char와 pin이 없다.
- [x] `npm.cmd run verify`가 contract test 4개, 11개 route source boundary, 106-module production build와 16개 deployment entry를 통과했다. Production에는 Manrope 24.83kB, Signika 42.24kB, Jua 368.17kB WOFF2만 포함된다.
- [ ] 실제 touch hardware의 native vertical pan은 폰트 교체 범위에서 다시 실행하지 않았다. 390px/coarse static fallback과 touch scroll 비가로채기 계약은 실제 viewport와 source에서 확인했다.

## 2026-08-25 Work optical typography correction verification

- [x] 1280×720 enhanced rail에서 THING은 약 133px, 나머지 다섯 title은 약 101px로 수렴한다. 기존 THING 183px·Prompt 86px의 2.1배 격차가 약 1.31배의 featured hierarchy로 줄었다.
- [x] 여섯 project link를 keyboard focus로 순서대로 정착시켰다. AQIS title/meta의 왼쪽은 37px, Alkkagi는 36px이고 모든 title, meta, summary와 focus outline이 viewport 안에 있다. Prompt title도 101px 한 줄로 fit하고 document horizontal overflow는 0이다.
- [x] 390×844과 768×1024 static fallback에서 Work story class, pin과 SplitText char가 없다. 768px Hero 설명은 기존 4행에서 2행, 390px은 3행에서 2행으로 줄고 두 폭 모두 local/document overflow가 없다.
- [x] Static featured summary는 약 18px/29px, 일반 summary는 약 17–17.5px/27–28px다. 390px Prompt만 자연스러운 2행이고 768px project title과 summary는 모두 1행이다.
- [x] 1280×720 `?motion=reduced`는 pin spacer·SplitText char가 0이고 기존 semantic title/static list를 유지한다. Browser log는 Vite 연결 debug 외 warning/error가 없다.
- [x] `npm.cmd run verify`가 contract test 4개, 11개 route source boundary, 106-module production build와 16개 deployment entry를 통과했다.
- [ ] 실제 touch hardware의 native vertical pan은 typography/scene 폭 수정 후 다시 실행하지 않았다. Static/coarse gate와 preventDefault 없는 Work controller는 유지된다.

## 2026-08-25 Home exhibition cue removal verification

- [x] 1280×720 full/interactive Home에서 Intro 완료 뒤 story는 활성화되지만 frame/sticky `::after` content가 모두 `none`이고 `--hero-progress` inline/custom property가 없다. 안내 문구와 하단 2px line이 보이지 않는다.
- [x] Hero 중간 scroll에서 CTA, 문장과 서명 opacity/transform handoff가 기존 순서대로 진행되고 document horizontal overflow는 0이다.
- [x] `?motion=reduced`에서도 cue text, progress property와 story active state가 모두 없고 정적 Hero가 정상 표시된다.
- [x] Browser log는 Vite 연결 debug 외 warning/error가 없고 `npm.cmd run verify`가 test 4개, source 11 route, production 106 modules와 deployment entry 16개를 통과한다.

## 2026-08-25 Work editorial reading rhythm verification

- [x] 1280×720 full/interactive에서 8490px track과 7225px travel, pin spacer 하나를 확인했다. 여섯 project center에서 stage는 `x/y 0 · scale 1 · opacity 1`, title/detail은 `transform identity · opacity 1`이며 중심 오차는 최대 3px다.
- [x] 첫 THING endpoint는 progress 0/current 01과 완성 상태, 마지막 Prompt endpoint는 progress 1/current 06과 완성 상태다. 마지막 pin 이후 Contact와 Footer는 viewport에 정상 진입하고 document horizontal overflow는 0이다.
- [x] 장면 경계에서 퇴장 stage는 실측 `x -55.44px / y -16.1px / scale .969 / opacity .492`, 다음 entrance preset은 `x 70.84px / y 22.3px / scale .94 / opacity .28` 범위다. 기존 ±140–150px scatter와 중앙 counter-motion 없이 두 작품이 끊기지 않고 인계된다.
- [x] 빠른 scroll jump 중 rendered track `.43126`, CSS progress `.4313`, current/active `03`으로 일치했다. 별도 root 측정에서도 transition 초기에 rendered/CSS가 `.5523/.5523`, 정착 후 `.75/.75`로 동일해 raw scroll 선행 시 번호가 먼저 바뀌지 않는다.
- [x] Browse instruction은 progress 0에서 visible/opacity 1이고 6% 뒤 hidden/opacity 0이며 역스크롤에서 복구된다. Scene connector는 정착 시 scale 1이고 first/last endpoint에 blank frame이 없다.
- [x] Enhanced AQIS keyboard focus 직후 stage/title/copy/arrow가 identity로 복구되고 anchor outline은 2px/offset -8px, row outline none, current 02와 scrollX 0이다. Arrow는 즉시와 1초 뒤 모두 transform/translate/rotate/scale none이다.
- [x] 390px, 768px과 1280px reduced에서 enhanced/pin/SplitText/owned inline style은 0, semantic link는 6/6이고 local/document overflow는 0이다. THING·Alkkagi native video의 원본 비율, clip none, inner transform none과 visible-play/offscreen-pause 또는 reduced-pause 계약도 유지된다.
- [x] App-origin browser warning/error는 0이며 `node --check`, `git diff --check`와 `npm.cmd run verify`가 통과했다. Verify는 test 4개, source 11 route, production 106 modules와 deployment entry 16개를 확인했고 기존 GSAP/ScrollTrigger/SplitText chunk 외 dependency 증가는 없다.
- [ ] 실제 touch hardware의 native vertical pan과 의도적인 GSAP/SplitText/font load failure 주입은 이번 세션에서 실행하지 않았다. Coarse/static gate, wheel/touch listener·preventDefault 부재, Promise generation guard와 fail-open cleanup은 source contract로 검증했다.

## 2026-08-25 Work minimal content and hidden-entry transition verification

- [x] Work Hero의 분야 strap과 추상 소개, wall header, scroll instruction, 전체/현재 번호가 없다. 여섯 scene은 각각 미디어·제목·고유한 한국어 한 줄 소개·`상세 보기`만 제공하고 전체 composition link와 상세 route를 유지한다.
- [x] 1280×720 enhanced 초기 상태에서 첫 scene만 완성 상태다. 두 번째부터 여섯 번째 stage는 `opacity 0 / visibility hidden`, 모든 SplitText char와 summary는 `opacity 0`으로 대기해 trigger 전 사전 노출이 없다.
- [x] 첫→두 번째 전환 직전 row 2가 viewport 밖 `x=1296.87px`일 때 stage opacity는 `.0669`, title·summary는 `0`이다. viewport edge 진입 시 stage/title은 이미 진행 중이며 이전 scene도 같은 구간에서 퇴장해 visible preset 뒤의 늦은 animation start가 없다.
- [x] 전환 중 두 scene의 stage, title과 summary가 연속 opacity로 교차하고, 새 scene이 정착하면 identity가 된다. Briefit keyboard focus settlement에서 row가 viewport 안에 들어오고 stage `opacity 1 / transform none`, title char `opacity 1`, 단일 focus outline을 유지한다.
- [x] 768×1024과 390×844은 enhanced class, pin spacer와 split char가 0이고 semantic link는 6/6이다. 768px에서 여섯 summary가 한 줄, 390px에서 한두 줄로 자연스럽게 감기며 document horizontal overflow가 없다.
- [x] 1280×720 reduced도 pin/split/enhanced 없이 6개 링크를 유지한다. 실제 브라우저 warning/error는 0이고 `npm.cmd run verify`가 test 4개, source route 11개, production module 106개와 deployment entry 16개를 통과한다.
- [x] 자연 scroll 마지막 endpoint에서 마지막 row는 `-39.82..1225.18px`, title `99.11..1086.24px`, summary `99.11..480.30px`, CTA `99.11..181.51px`, stage `402.08..1086.24px`로 모두 viewport 안에 있고 opacity 1이다.
- [x] Prompt focus 250ms와 1.8s 후 row left·track transform이 각각 `0.18px / -6719px`로 동일하고, Briefit도 `-12.62px / -5441.5px`에서 drift 0이다. 두 경우 active link, identity content와 focus outline을 유지한다.
- [ ] 실제 touch hardware의 native vertical pan과 의도적인 GSAP/SplitText/font failure 주입은 실행하지 않았다. 기존 coarse/static gate, native input 비가로채기와 fail-open cleanup 계약은 유지한다.

## 2026-08-31 Evidence-first portfolio release verification

이 항목은 2026-07-14·2026-08-18의 개인정보 포함 원본 Resume 공개와 greeting-only/역할 비노출 Home 결과를 대체한다.

- [x] Home 첫 화면은 `AI & Robotics Software Developer` 역할, 제공 가치, 두 개의 다음 행동과 실제 THING 근거 이미지를 함께 노출한다. 서명 모션은 화면·입력·접근성 트리를 잠그지 않으며 첫 wheel·pointer·touch·keyboard 입력을 소비하지 않고 즉시 완료한다.
- [x] 1280×720 full, 390×844 lite와 `?motion=reduced`에서 Home copy·CTA·대표 근거가 보이고 document horizontal overflow는 0이다. Reduced route는 story/curtain/input lock 없이 정적 완성 상태다.
- [x] 980×720·1000×720 full/interactive에서도 Home은 relative 1열 static flow, active story 0과 visible proof를 유지한다. 1001×720부터만 138svh/sticky story가 활성화되어 CSS 1000px breakpoint와 JS capability gate 사이의 1px scroll collapse가 없다.
- [x] Work는 여섯 프로젝트 Fast track을 제공한다. 390×844·768×900에서는 설명이 media보다 먼저 읽히고 static native flow를 사용하며, 1280×720에서는 기존 GSAP/SplitText horizontal story만 활성화된다.
- [x] Enhanced Work에서 프로젝트 링크에 focus한 뒤 1280px→390px live resize로 story를 정리해도 같은 링크가 `preventScroll` focus를 유지한다. Contract test가 cleanup 후 focus 복원과 mobile copy-first 순서를 함께 고정한다.
- [x] 여섯 Case는 Hero 한 문장 lede, 증거/구현/회고로 이동하는 sticky local navigation, 명시적 media geometry와 `preload="none"` demo를 제공한다. THING·AQIS desktop/mobile과 나머지 네 Case mobile에서 anchor, one-column fallback과 overflow를 확인했다.
- [x] 390×844 Work의 두 auto preview는 lite mode에서 `paused=true`, `readyState=0`으로 대용량 video를 요청하지 않고 poster를 유지한다. 모든 controls video는 `data-demo-video` 계약으로 한 번에 하나만 재생하고 offscreen/hidden/pagehide에서 pause한다.
- [x] Resume는 HTML Profile이 먼저이며 PDF·DOCX·preview PNG 공개 링크와 배포 항목이 없다. 개인정보 포함 원본 세 파일은 ignored `.private/resume/`에 보관했고 production `dist/resume/`에는 `index.html` 하나만 있다. Build는 `emptyOutDir`를 명시하고 dist verifier가 Resume의 추가 파일을 거부한다.
- [x] 11개 route에 고유 canonical, robots, Open Graph와 Twitter metadata가 있고, 1200×630 social preview와 11개 URL sitemap이 production manifest에 포함된다. Home에는 Person JSON-LD가 있다.
- [x] `prefers-contrast: more`와 forced-colors fallback, fine-pointer desktop 전용 cross-document View Transition, Home/Work moderate prefetch-only 규칙, `pagehide/pageshow` media cleanup을 source contract로 확인했다. 새 runtime dependency와 Three.js는 추가하지 않았다.
- [x] 실제 브라우저에서 11개 route × 390×844·768×900·1280×720 총 33개 조합을 전수 확인했다. 모두 local font loaded, H1/main 각 1개, horizontal overflow 0이며 console에는 Vite 연결 debug 외 warning/error가 없다.
- [x] `npm.cmd run verify`가 contract test 7개, source route/style boundary 11개, production module 105개와 deployment entry 15개를 통과했고 `git diff --check`에 whitespace error가 없다.
- [ ] 실제 touch hardware의 native vertical pan, background-tab hide/restore timing과 native cross-document View Transition 지원 브라우저는 이번 세션에서 직접 관찰하지 않았다. Coarse/reduced capability gate, input 비가로채기, BFCache lifecycle과 Anime fallback은 source 및 현재 브라우저 fallback 경로로 검증했다.
- [ ] Production publish는 수행하지 않았다. Repository 지침상 commit/push는 사용자의 명시적 요청이 필요하며, 현재 결과는 검증된 local working tree와 `dist/`에 있다.

## 2026-08-31 Work typography, stable transition, and Signal Lab verification

- [x] 1280×720 enhanced Work에서 THING title `101.2px`, summary system body stack `19.889px / 500 / 31.822px`를 실측했다. Title·summary의 x는 `393.56px`, CTA는 signal inset에 맞춘 `412px`이며 CTA까지의 빈 row가 사라졌다.
- [x] 390×844·768×900 static Work는 story/pending/SplitText 0, semantic project link 6/6, `scrollWidth <= innerWidth`다. Summary는 각각 `19.2px / 2줄`, `19.53px / 1줄`이고 copy-first → CTA → media native flow와 44px CTA를 유지한다.
- [x] Production Home→Work navigation은 blocking extracted CSS와 inline prepaint를 사용하고 destination은 styled 상태, `work-story-ready=true`, `pending=false`, `expired=false`로 한 번에 정착했다. Production HTML에서 prepaint script/style이 module 및 stylesheet link보다 앞에 있고 runtime은 first refresh 뒤 pending을 제거한다.
- [x] Home 390×844·768×900·1280×720에서 `Flagship` 문구 0, radio/panel 3/3, active panel 1, 단계별 trace `0.12 / 0.52 / 1`, 44px 선택 영역과 horizontal overflow 0을 확인했다. Browser accessibility snapshot은 fieldset group, 세 native radio의 label/checked state와 active region만 노출한다.
- [x] Reduced Home은 story 0, panel animation `none`, trace transition `0s`이면서 radio 선택과 panel/trace 상태를 즉시 갱신한다. Reduced Work는 story/pending/split 0, project link 6/6이다.
- [x] `npm.cmd run verify`가 contract test 7개, source route/style boundary 11개, production module 106개와 deployment entry 15개를 통과했다. Production preview에서 self-hosted font와 THING image가 loaded이고 1280px Home/Work 모두 horizontal overflow가 없다. `git diff --check`는 whitespace error가 없다.
- [ ] 실제 network throttling으로 1500ms watchdog을 만료시키거나 GSAP/SplitText/font failure를 주입하지 않았다. Timeout 뒤 `data-work-story-expired`가 late upgrade를 차단하는 동작은 inline/runtime/source contract test로 검증했다.
- [ ] 실제 touch hardware의 native vertical pan과 physical keyboard의 Tab/Space/arrow radio 전환은 실행하지 않았다. Native radio group, visible label focus rule, 44px target, coarse/reduced static gate와 pointer-event 비가로채기는 accessibility snapshot과 source contract로 확인했다.
- [ ] Production publish는 수행하지 않았다. Repository 지침상 commit/push는 사용자의 명시적 요청이 필요하며, 현재 결과는 검증된 local working tree와 `dist/`에 있다.

## 2026-08-31 Home greeting copy restoration verification

- [x] Home Hero의 보이는 역할 라벨과 support 문장이 없고 `안녕하세요! / 새로운 것을 배우고 직접 만드는 일이 즐겁습니다.`가 정확히 복원됐다. `즐겁습니다.`만 강조된다.
- [x] Primary CTA는 `프로젝트 →`로 `/work/`, secondary CTA는 `Contact →`로 Home `#contact`에 연결된다.
- [x] 역할 라벨이 없어도 1280×720 full 환경에서 Home story가 활성화되고 `hero-pending`이 남지 않는다. 390×844과 768×1024는 정적 flow를 사용한다.
- [x] 390×844, 768×1024, 1280×720에서 두 greeting line과 CTA가 보이고 document horizontal overflow는 0이다.
- [x] 1280×720 `?motion=reduced`에서 story가 비활성화되고 greeting과 CTA는 완성 상태로 보인다. Console warning/error는 0이다.
- [x] `npm.cmd run verify`가 contract test 7개, source route/style boundary 11개, production module 106개와 deployment entry 15개를 통과했다. `git diff --check` whitespace error는 0이다.

## 2026-08-31 Centered Kinetic field verification

- [x] Home Hero에는 canvas 1개와 추상 오브제 7개만 있고 THING, Signal Lab, fieldset/radio, `GRAB / THROW`, reset·pause·scatter control이 없다. Canvas는 `aria-hidden=true`, `tabindex=-1`이며 accessibility snapshot의 navigation → H1 → greeting → 프로젝트/Contact 순서에 나타나지 않는다.
- [x] 1280×720, 768×1024, 390×844 실제 브라우저에서 Hero 높이가 각각 viewport와 같은 `720 / 1024 / 844px`이고 document horizontal overflow는 0이다. 이름·인사·CTA는 중앙에 보이며 Projects가 바로 다음 문서 흐름을 소유한다.
- [x] 1280×720에서 돌 오브제를 실제 pointer drag 후 throw했다. 오브제가 release velocity로 이동하고 다른 오브제·viewport·navigation·이름·문장·CTA collision boundary에서 튕기며 Kinetic state가 running으로 복귀한다.
- [x] 390×844에서 native-style vertical scroll로 Hero를 지나 Projects 아래까지 이동했고 scroll position이 증가했다. Canvas CSS는 `touch-action: pan-y pinch-zoom`, pointer listener는 passive이며 pointer capture와 pointer gesture `preventDefault()`가 없다.
- [x] 1280px backing buffer는 `1898×1080`으로 약 2.05MP, DPR cap 1.5 안에 있고 390px은 `375×844`, DPR 1이다. 초기 움직임은 air friction/sleeping으로 끝나고 state가 sleeping이 되면 Pixi ticker가 정지한다.
- [x] Local `?motion=reduced`에서 state는 static, canvas는 초기 `300×150` 그대로이며 `display:none`, CSS fallback opacity 1이다. Runtime capability gate가 reduced와 forced colors를 WebGL import 전에 거부한다.
- [x] 실제 drag·resize·scroll·reduced 왕복 동안 console warning/error는 0이고 Vite 연결 debug만 존재한다.
- [x] `npm.cmd run verify`가 contract test 7개, source route 11개·stylesheet 12개, production module 764개와 deployment entry 15개를 통과했다. Production preview 1280×720도 canvas 1개, Hero 720px, overflow 0, warning/error 0이다. `git diff --check` whitespace error는 0이고 기존 Windows line-ending 안내만 있다.
- [ ] 실제 touch hardware의 수평 flick/세로 pan 경쟁, background tab hide/restore, BFCache, WebGL context loss/restore와 의도적 dynamic-import failure는 이번 브라우저 세션에서 직접 주입하지 않았다. Passive touch contract, observer/page lifecycle, 1회 recover와 static fail-open은 source test로 검증한다.
- [ ] Production publish는 수행하지 않았다. Commit/push/deploy는 사용자의 명시적 요청이 필요하다.

## 2026-08-31 Kinetic interpolation, text collision, and fixed-light verification

- [x] 1280×720, 768×1024, 390×844 실제 브라우저에서 Hero 높이는 각각 viewport와 같은 `720 / 1024 / 844px`이고 `scrollWidth === clientWidth`다. 세 폭 모두 canvas opacity 1, `data-kinetic-light="fixed-upper-left"`, warning/error 0을 유지한다.
- [x] 이름의 아홉 SVG letter, 인사말의 여덟 non-whitespace word와 CTA 두 개가 총 19개의 독립 정적 body로 측정된다. 폭이 약 `0.05px`인 Signika `i` stroke도 padding을 포함한 collision body를 가지며 보이지 않는 단어 사이 공백은 하나의 큰 사각형으로 막지 않는다.
- [x] 1280px에서 오브제를 CTA 방향으로 직접 drag·throw한 뒤 state가 `running`으로 복귀하고 scroll/focus를 탈취하지 않으며 console warning/error가 없다. Runtime은 content restitution보다 오브제별 restitution을 유지해 문자에서 재질별로 튕긴다.
- [x] 60Hz outer step, 두 번의 8.33ms substep, 이전·현재 pose 보간, frame/catch-up cap과 최근 입력 시간 가중 throw를 source 및 unit contract로 확인했다. 대각선 throw는 축별이 아니라 전체 magnitude `14.5`에서 제한된다.
- [x] 모든 재질의 highlight/shade와 그림자가 viewport 좌상단 바깥 하나의 point light를 사용한다. 그림자는 global shadow layer에 있고 object surface보다 항상 아래에서 합성되며, light vector는 body 회전과 독립적이다.
- [x] Pixi init이 넣는 inline `touch-action:none`을 즉시 `pan-y pinch-zoom`으로 복구한다. 실제 세 viewport computed style과 source contract 모두 동일하고 pointer listener는 passive, pointer capture와 gesture `preventDefault()`는 없다.
- [x] 390×844 `?motion=reduced`는 state static, canvas `display:none / 300×150`, CSS fallback opacity 1이고 WebGL light·collision dataset을 만들지 않는다. 정적 fallback의 재질 조명은 같은 좌상단 방향을 유지한다.
- [x] `npm.cmd run verify`가 11개 test, source route 11개·stylesheet 12개, production module 765개와 deployment entry 15개를 통과했다. Kinetic runtime은 `202.59 kB raw / 59.57 kB gzip`이고 `git diff --check` whitespace error는 0이다.
- [ ] 실제 touch hardware의 빠른 flick/세로 pan 경쟁, 120Hz 물리 pose의 육안 비교, background tab·BFCache와 WebGL context loss/restore는 이번 세션에서 직접 주입하지 않았다. 관련 magnitude, interpolation, passive input, lifecycle과 static recovery 계약은 source/test로 확인했다.
- [ ] Production publish는 수행하지 않았다. 이번 요청은 local 구현과 검증 범위이며 commit/push/deploy는 별도 명시 요청이 필요하다.

## 2026-09-01 Home handwritten signature pacing verification

- [x] Home Intro는 `SIGNATURE_DURATION = 1500`을 단일 source of truth로 사용한다. 기존 entry delay 뒤 12개 path에 실제 길이 비율로 분배되는 필기 시간은 full 약 `1455ms`, compact 약 `1475ms`다.
- [x] 이름의 12-path 획순, `inOut(2)` drawable easing, 짧은 opacity/Y settle과 semantic H1 geometry는 변경하지 않았다.
- [x] Wheel, pointerdown, touchstart와 keydown은 passive/capture listener에서 원래 입력을 소비하지 않고 `finish()`만 호출한다. Reduced motion, hash, hidden, scroll restoration과 BFCache의 즉시 완성 조건도 유지한다.
- [x] `npm.cmd run verify`가 test 11개, source route 11개·stylesheet 12개, production module 765개와 deployment entry 15개를 통과했고 `git diff --check` whitespace error는 0이다.
- [ ] 이번 timing 수정은 브라우저 stopwatch로 별도 재측정하지 않았다. 1.5초 상수, path 길이 비례 합계와 조기완료 동작은 source/test contract로 검증했다.

## 2026-09-02 Original Resume preview republication verification

- [x] `/resume/` source에서 1241×1754 원본 PNG 프리뷰가 HTML Profile 앞에 있고 PDF 새 탭 보기, PDF 다운로드와 DOCX 다운로드 링크가 모두 승인된 세 파일을 가리킨다.
- [x] 600px 이하에서 세 파일 행동을 한 열로 만드는 CSS, 이미지 intrinsic ratio, 명시적 focus 상태와 44px touch target을 source contract로 확인했다.
- [x] Production `dist/resume/`에는 `index.html`과 승인된 PNG·PDF·DOCX만 있으며 세 asset의 SHA-256이 보관 원본과 일치한다. 다른 Resume 파일은 allowlist 검증이 거부한다.
- [x] `npm.cmd run verify`가 test 11개, source route 11개·stylesheet 12개, production module 765개와 deployment entry 18개를 통과했고 `git diff --check` whitespace error는 0이다.
- [x] GitHub Pages 배포 뒤 Resume HTML, 432186-byte PNG, 75264-byte PDF와 11779-byte DOCX가 모두 HTTP 200이다. MIME type은 각각 `text/html`, `image/png`, `application/pdf`, `application/vnd.openxmlformats-officedocument.wordprocessingml.document`로 제공된다.
- [ ] Sites 지침상 별도 요청 없는 브라우저 시각 QA는 실행하지 않았다. 390px·768px·1280px의 프리뷰 레이아웃은 기존 동일 UI의 검증 기록과 이번 source 반응형 계약을 사용한다.

## 2026-09-02 Resume Hero contact rhythm verification

- [x] Fine pointer에서 email·GitHub·location 세 행은 추가 gap 없이 동일한 `36px` 높이를 사용하고 line-height는 `1.35`다.
- [x] Coarse pointer에서 두 링크는 `44px` target을 유지하며 세 항목은 `overflow-wrap: anywhere`로 좁은 폭의 overflow를 방지한다.
- [x] `npm.cmd run verify`가 test 11개, source route 11개·stylesheet 12개, production module 765개와 deployment entry 18개를 통과했고 `git diff --check` whitespace error는 0이다.
- [x] GitHub Pages 재배포 뒤 공개 `resume-BFH3i-0V.css`에서 `gap: 0`, `line-height: 1.35`, 세 행 `36px`와 coarse-pointer 링크 `44px` 규칙을 확인했다.

## 2026-09-02 Original Resume optical centering verification

- [x] `.resume-original__content`는 두 grid column 전체를 사용하고 최대 `808px` 폭으로 중앙 정렬되며 label은 별도 첫 행에 남는다.
- [x] 808px보다 좁은 layout에서는 content가 가용 폭 100%를 사용하고 이미지 비율·44px file actions·600px 이하 한 열 행동을 유지한다.
- [x] `npm.cmd run verify`가 test 11개, source route 11개·stylesheet 12개, production module 765개와 deployment entry 18개를 통과했고 `git diff --check` whitespace error는 0이다.
- [x] GitHub Pages 재배포 뒤 공개 `resume-H_tnEH7l.css`에서 full-span grid, 최대 `808px`, `justify-self: center`와 `24px` row gap을 확인했다.

## 2026-09-03 Home greeting typography verification

- [x] Home Hero의 두 줄 인사말은 `프로젝트` CTA와 동일한 `Signika Variable, Jua, ...` display stack을 사용하고, `즐겁습니다.`를 포함한 전체 두 번째 줄은 동일한 색과 굵기로 렌더링된다.
- [x] Hero markup과 Home stylesheet에 인사말용 `em` element·selector가 남아 있지 않으며, 두 개의 `data-hero-line`, 기존 문구와 CTA 경로는 유지된다.
- [x] 실제 production preview의 390×844, 768×1024, 1280×720에서 인사말과 CTA가 모두 보이고 horizontal overflow는 0이다. 390px forced-reduced는 static, 768px 기본 환경은 lite/sleeping, 1280px 기본 환경은 full/sleeping Kinetic 상태를 유지한다.
- [x] 390×844 reduced 환경에서 canvas는 숨겨지고 정적 fallback이 유지된다. 키보드로 `프로젝트` CTA에 도달했을 때 2px solid vermilion outline과 4px offset이 보인다.
- [x] 세 viewport의 browser warning/error log는 비어 있다. `npm.cmd run verify`가 test 11개, source route 11개·stylesheet 12개, production module 765개와 deployment entry 18개를 통과했고 `git diff --check` whitespace error는 0이다.
- [x] GitHub Pages run `33724181411`이 commit `a527491`에서 성공했다. 공개 URL은 HTTP 200으로 평문 인사말과 `portfolio-CPalX13I.css`를 제공하며, 실제 1280×720 브라우저에서 인사말·`프로젝트`의 font stack 일치, `em` 0개, horizontal overflow 0, warning/error 0을 확인했다.

## 2026-09-03 Resume Awards evidence modal verification

- [x] 제공된 Drive의 네 PDF와 같은 byte size의 로컬 원본을 직접 렌더링해 공식 수상명, 등급, 발급기관과 날짜를 대조했다. HTML과 DOCX/PDF/PNG에는 SSAFY 공통 프로젝트 우수상(2026-08-10), IT 프로젝트 프로리그 장려상(2025-11-22), IT대학 소프트웨어 공모전 금상(2025-08-18), 제15회 숭실 캡스톤디자인 경진대회 장려상(2025-10-01)이 동기화됐다.
- [x] 공개 WebP 네 장은 `1240×1755`, `1240×1755`, `1239×1758`, `1240×1755`의 실제 portrait geometry다. 후속 확대 검수에서 발견한 캡스톤의 `재, 권나래,`와 소프트웨어 공모전의 `민,` 잔여 글자를 추가 마스킹해 수상자 중 `공세민`만 보인다. 발급자명과 증서번호는 허용 기준대로 유지하고, 모든 학번은 불투명하게 가렸다.
- [x] 최종 네 이미지의 SHA-256을 source contract에 고정했다. 캡스톤·소프트웨어 공모전은 무손실 WebP로 저장했으며 검증 스크립트상 새 마스크 밖의 변경 픽셀 0개, 마스크 안의 비검정 픽셀 0개다.
- [x] 업데이트한 PDF는 A4 portrait, rotation 0의 1 page이며 150dpi PNG 프리뷰는 `1241×1754`다. DOCX와 PDF의 정규화한 본문 3,258자는 완전히 일치하고 공개/비공개 보관 사본의 세 파일은 각각 byte-identical이다.
- [x] 실제 브라우저 390×844, 768×1024, 1280×900에서 dialog와 이미지의 렌더 높이가 폭보다 크고 모든 모서리가 viewport 안에 있다. 각 root의 `scrollWidth <= clientWidth`로 horizontal overflow가 없다.
- [x] 열 때 닫기 버튼으로 focus가 이동하며 단일 focus target의 Tab이 modal 안에서 순환한다. PageDown 중 배경 `scrollY`는 고정되고, Escape와 실제 backdrop 클릭은 정확한 opener로 focus를 복귀시킨다. 이미지 내부 클릭은 닫히지 않으며 다른 수상 재개방 시 title/src/alt가 함께 교체된다.
- [x] `?motion=reduced`에서 dialog, panel과 backdrop의 computed animation은 모두 `none / 0s`다. 직접 Resume 페이지의 warning/error console log는 비어 있다.
- [x] `npm.cmd run verify`가 test 11개, source route 11개·stylesheet 12개, production module 766개와 deployment entry 22개를 통과했고 `git diff --check` whitespace error는 0이다.

## 2026-09-04 Award gallery redaction verification

- [x] 4개 공개 이미지와 확대 경계를 직접 확인했다. 일련번호가 있는 세 상장은 번호 전체를 가렸고, 프로리그의 타인 이름 상단 잔여도 가렸다. 공세민 이름·발급자·상명·날짜는 유지됐다.
- [x] 4개 이미지에서 지정 마스크·허용 복구 영역 밖 변경 0픽셀, 새 마스크 내부 비검정 0픽셀. SW 공모전 이름 복구 영역은 원본 PDF raster와 0픽셀 차이다. SHA-256을 source contract에 갱신했다.
- [x] 실제 production preview의 390×844, 768×1024, 1280×900에서 modal은 각각 약 355×646, 620×986, 620×866px이다. 모든 경계가 viewport 안에 있고 이미지도 portrait이며 horizontal overflow가 없다.
- [x] 4개 버튼의 제목·이미지 경로 교체, 이미지 로드, 닫기 버튼 focus, Tab 순환, PageDown 중 배경 scrollY 고정, Escape 후 opener focus 복귀를 확인했다.
- [x] 390px `?motion=reduced`에서 modal·panel·backdrop animation은 모두 none이며 warning/error console log는 0이다.
- [x] 상장 작업의 `npm.cmd run verify`: 11 tests, 11 routes, 22 deployment entries 통과. 이후 문구·PDF 연결 변경도 최종 통합 검증 대상으로 둔다.

## 2026-09-04 Static portfolio verification

- [x] A4 세로 14쪽, 회전 0°, CropBox=MediaBox, 페이지별 책갈피 14개를 검사했다. 전체 페이지의 한글 텍스트가 추출되고 빈 페이지·대체문자·페이지 밖 텍스트와 링크는 없다. 나눔고딕은 subset 내장, 영문 Helvetica는 PDF Standard 14 font다.
- [x] 세 쪽 시안과 최종 14쪽 PNG를 직접 확인했다. 잘림·겹침·한글 깨짐이 없다. 마지막 mailto 인코딩 수정 뒤 14쪽을 재렌더링했고 앞서 육안 확인한 PNG와 모두 SHA-256이 일치한다.
- [x] 본인 커밋·프로젝트 기록과 1–8쪽, 9–14쪽을 별도 교차 검토했다. 미검증 성과 수치, 팀 작업의 개인 귀속, 개인정보·일련번호·비공개 Drive 링크가 없다. PDF에는 첨부·JavaScript·자동실행·입력 폼이 없다.
- [x] 링크 44개: 공개 HTTPS 42개와 `mailto:semin1224@gmail.com` 2개. 한국어 GitHub 경로는 UTF-8 percent encoding, 이메일 @는 보존했다. QR 옆에 사람이 읽을 수 있는 전체 웹 URL을 함께 표시했다.
- [x] 최종 PDF는 10,060,384 bytes이며 SHA-256 `90485E34BA9EC00CF1F6DEF27626549674DBFD9B2C7E7CAD6F9563926B538556`이다. 공개 사본과 편집 출력 사본의 hash가 일치하고 자동 계약에 고정했다.
- [x] 실제 브라우저에서 Resume·Home의 390×844, 768×1024, 1280×900 horizontal overflow가 없다. Resume 두 PDF 버튼은 44px 이상이고 좁은 화면에서 한 열로 표시된다. 키보드 이동과 2px focus outline, 정상 href·download filename·새 탭 target을 확인했다.
- [x] 최종 `npm.cmd run verify`: tests 12개, source routes 11개·stylesheets 12개, production modules 766개, deployment entries 23개 통과. PDF는 초기 페이지 요청에 미리 내려받지 않는 일반 파일 링크이며 새 runtime dependency는 없다.
- [x] Drive의 지정 폴더 아래 `Portfolio`를 만들고 최종 PDF를 업로드했다. metadata 재조회에서 MIME `application/pdf`, 10,060,384 bytes, 올바른 parent와 소유자 한 명·shared=false를 확인했다. 원본 상장과 기존 공유 권한은 유지했다.
- [ ] QR의 실제 카메라 스캔, OS 메일 앱 실행, 모든 외부 링크의 일괄 HTTP 검사는 수행하지 않았다. 코드 근거는 조사 단계에서 열람했고 웹/PDF 링크 문법·영역을 검증했다. IAB의 새 탭 PDF 뷰어 UI는 노출되지 않아 별도 OS PDF viewer 동작은 확인하지 않았다.

## 2026-09-04 Home signature interruption verification

- [x] 실제 controller를 실행하는 회귀 테스트 15개를 추가했다. Wheel·pointerdown·touchstart·keydown·scroll·hashchange·pagehide, 자연 완료·watchdog·hidden·persisted pageshow·reduced 전환·destroy, 정적 진입과 부분 setup 실패에서 12개 path 속성과 style, listener·timer 정리 및 한 번의 완료를 확인했다.
- [x] 실제 Anime를 사용하는 ignored 로컬 harness에서 첫 획만 시작하고 나머지 11개는 `draw="0 0"`인 시점에 native scroll·Tab·anchor 이동을 수행했다. 전체 12개 path의 drawable 속성 잔여 0, computed dash `none`, linecap `round`이며 원래 스크롤·focus·hash 이동도 실행된다.
- [x] 같은 harness의 자연 완료 후 전체 이름과 `i`의 점을 육안 확인했다. 완료 직후와 추가 시간이 지난 뒤에도 속성 잔여는 0이다.
- [x] 실제 production preview 1280×900에서 필기 도중 About 이동 후 뒤로가기를 수행했고, 복귀한 Home은 전체 이름·속성 잔여 0·horizontal overflow 없음·기본 full motion/interactive depth다.
- [x] Production preview 390×844와 768×1024의 기본 lite 진입에서 11개 미시작 획을 확인한 뒤 각각 PageDown·Tab으로 중단했다. 전체 12개 획이 복구되고 overflow가 없다. Tab은 skip link로 이동하고 focus outline도 유지한다. 768px 완성 화면을 육안 확인했다.
- [x] 390×844 `?motion=reduced`는 처음부터 12개 완성 획, drawable 속성 잔여 0, flat depth와 overflow 없음이며 화면을 육안 확인했다. Warning/error console log는 0이다.
- [x] `npm.cmd run verify`: tests 27개, source routes 11개·stylesheets 12개, production modules 766개, deployment entries 23개 통과. 새 runtime dependency와 공개 asset 변경은 없다.
- [ ] 실제 터치 하드웨어, OS reduced-motion 전환, 실제 BFCache 저장 여부는 별도 검증하지 않았다. 해당 lifecycle 이벤트는 자동 테스트로 검사했다. IAB의 일부 viewport 변경 직후 reload/CDP 연결이 timeout되어 새 탭과 분리된 viewport 설정으로 고정 폭 검수를 마쳤으며 연속 resize는 완료로 주장하지 않는다.

## 2026-09-04 Dense landscape portfolio revision verification

- [x] A4 가로 18쪽, 회전 0°, CropBox=MediaBox, 책갈피 18개를 검사했다. 소개와 About의 첫 두 쪽에는 프로젝트명·프로젝트 수상·프로젝트 연계 강점이 없다. THING에 SSAFY 공통 프로젝트 우수상, Briefit에 나머지 세 상을 배치했다.
- [x] 전체 18쪽과 내용 보강 후 변경 페이지의 렌더를 직접 확인했다. 별도 검토자가 전체 추출 본문과 주요 9쪽을 교차 검토했다. 마지막 AQIS 출처 링크 추가 후 9쪽도 다시 렌더링해 확인했다. 본문·이미지의 겹침, 잘림과 한글 깨짐을 발견하지 않았다.
- [x] `scripts/portfolio/verify_portfolio.py`에서 텍스트 및 링크의 페이지 경계, 6개 내부 이동·59개 외부 링크, 4개 공개 상장 이미지 링크, layout rectangle overlap 0개를 확인했다. PDF에 첨부·JavaScript·자동실행·입력 폼·비공개 Drive 링크가 없다. 최소 글자는 출처/푸터 7.3pt이고 본문은 10.4pt다.
- [x] 최종 파일은 10,100,328 bytes, SHA-256 `45D1EEB6E828639A7FAD4E336CB002B794D0F7E1A3BA91D39D5A447CED7E21DC`다. 편집 출력·public·production build 사본이 일치하고 웹 계약 테스트에 고정했다. 로컬 preview의 PDF 응답은 HTTP 200, MIME `application/pdf`, Content-Length `10100328`이다.
- [x] 실제 브라우저의 Resume 390×844, 768×1024, 1280×900에서 horizontal overflow는 0이다. 다운로드와 새 탭 버튼은 높이 44px이며 390px에서는 세로로 배치된다. 메타데이터 줄바꿈과 전체 버튼 영역을 육안 확인했다.
- [x] 키보드 Tab으로 새 탭 링크에 이동하고 2px focus outline을 확인했다. href·download filename·target이 올바르다. 1280px 기본 full/interactive, 768px·390px 기본 lite/static, 390px `?motion=reduced`의 reduced/flat과 보이는 링크를 확인했다. warning/error 로그는 비어 있다.
- [x] `npm.cmd run verify`가 tests 27개, source routes 11개·stylesheets 12개, production modules 766개와 deployment entries 23개를 통과했다. 새 runtime dependency, motion/CSS 변경과 원본 Resume PDF·DOCX·PNG 변경은 없다.
- [x] Drive의 기존 `SeMinKong-Portfolio.pdf` 파일 ID를 유지해 최종 PDF로 갱신했다. metadata 재조회에서 10,100,328 bytes, `application/pdf`, 기존 Portfolio parent, 소유자 한 명·shared=false를 확인했다. 원본 상장과 공유 권한은 변경하지 않았다.
- [ ] 이번 턴은 로컬 구현 및 기존 Drive 파일 갱신 범위다. Commit·push·공개 웹 배포는 수행하지 않았다. QR의 실제 카메라 스캔, OS 메일 앱 실행, IAB PDF 새 탭 뷰어 UI와 모든 외부 링크의 일괄 HTTP 응답은 검사하지 않았다. Home은 변경하지 않았으므로 이번 반응형 시각 검수 범위는 Resume다.

## 2026-09-04 Source/reproduction visual revision verification

- [x] 20쪽 A4 가로 PDF의 최종 렌더 전체를 직접 확인했다. 도식 화살표, 사진 EXIF 방향, 한글, 페이지 번호, 링크 구역, 합성 마스크 패널, 사진 압축 후 선명도에 잘림·겹침을 발견하지 않았다. THING·웹·ML 담당 독립 검토자의 원본/코드 대조 의견을 반영했다.
- [x] `verify_portfolio.py`: 20쪽·책갈피 20개, 외부 링크 64개·내부 링크 6개, 레이아웃 겹침 0개, 페이지 경계 정상. 최소 글자 7.3pt. 소개·About에 프로젝트/수상 연계 없음, THING 1개·Briefit 3개 수상, mock/합성 입력/추론 미재현 표시를 검사했다. PDF 첨부·JavaScript·자동실행·폼·비공개 Drive 링크 없음.
- [x] 최종 SHA-256 `51557C78507C235EB04C9C3E91576B35DDE3797A5C0F6F65C521644EE1ADF0AC`, 9,996,780 bytes. 최종 렌더 이후 작업용 자산 메타데이터를 제거해도 PDF가 같은 해시로 재현된다. output/public/dist 세 파일의 바이트·해시 일치를 독립 검사했다. 로컬 PDF 응답 HTTP 200, application/pdf, Content-Length 9996780.
- [x] 원본 THING 구성도·Prompt 설계도는 원본 해시와 일치. 작업용 THING 사진 2개는 원본과 디코딩 픽셀이 일치하며 EXIF orientation만 남기고 GPS/XMP를 제거했다. 원본은 ignored clone에 보존한다. AQIS PNG도 EXIF/text/XMP가 없고 정제 호출 내 전후 픽셀 일치 assertion이 통과했다. 정제 전 별도 사본이 없어 AQIS 픽셀의 독립 사후 비교는 미완료로 구분한다.
- [x] Alkkagi 실제 두 브라우저 플레이와 서버/물리 검사, AQIS 차단된 mock HTTP/WS와 상태 조회, Prompt 빈 키 초기 화면을 확인했다. THING offline 5개 통과, AQIS 원본 테스트 26개 통과/2개 좌표 기대값 실패를 기록했다. Alkkagi upstream production TS 오류 3개는 수정하지 않았으며 dev 실행과 혼동하지 않는다.
- [x] Briefit 원본 후처리 함수 합성 4사례와 20건 16/2/2 동일 분할, MRI 원본 변환 함수 합성 마스크 1018/1017/1026/1024 픽셀과 한 polygon을 기록했다. 재현 JSON은 작업용 자료이며 public/dist에 들어가지 않는다. 모델 학습·추론, 외부 LLM·뉴스 API, 실물 장치와 민감키 사용 없음.
- [x] 최종 production Resume 390×844·768×1024·1280×900에서 수평 overflow 0, 두 action 높이 44px, 새 판수/용량/버튼을 육안 확인했다. 390px은 버튼 세로, 768px 이상은 가로 배치. 키보드 Tab으로 새 탭 링크에 포커스 이동하며 2px outline 유지. 390/768 기본 lite/static, 1280 기본 full/interactive, 390 reduced/flat과 링크 가시성을 확인했다. warning/error console 로그 0.
- [x] `npm.cmd run verify`: 테스트 27개, 소스 경로 11개·스타일 경계 12개, production 모듈 766개·배포 entry 23개 통과. `git diff --check` 통과. 런타임 의존성·CSS·모션·원본 Resume·상장 파일을 변경하지 않았다.
- [x] 기존 Drive 파일 ID/Portfolio parent를 유지하여 9,996,780 bytes의 application/pdf로 갱신했다. 재조회에서 소유자 1명·shared=false 유지 확인. 기존 링크와 원본 상장, 공유 권한을 변경하지 않았다.
- [ ] Git commit/push 및 공개 배포는 하지 않았다. 모델 전체 추론·실장비·동시접속 부하/FPS·OS reduced-motion 변경·실물 터치·QR 카메라 스캔·메일 앱 실행·PDF 뷰어 상호작용·모든 외부 링크 HTTP는 검증 범위 밖이다. 모든 임시 재현 서버를 종료하고 브라우저 viewport를 복원했다. 사용자 `tmp/pdfs/skhynix-jd/` 파일은 보존했다.

## 2026-09-04 README video still revision verification

- [x] 사용자 허용에 따라 THING·AQIS·MRI·Alkkagi 동영상에서 장면을 추출했다. 선정한 네 장의 원본 비율·프레임 시간·출처·크롭/보정 없음과 개인정보를 직접 확인했다. 프로젝트별 독립 검토자가 영상 출처와 프레임 선택을 교차 검토했다. 얼굴 일부·개인 경로가 보이는 후보는 제외했다.
- [x] AQIS·Alkkagi는 README 원격 영상 재다운로드와 로컬 MP4 SHA-256 일치를 확인했다. THING은 기존 웹 변환본임을 구분하고, MRI는 원격 403으로 바이트 동일성이 미검증임을 작업 근거에 남겼다. 원본 시연과 신규 재현을 구분하며 AQIS·Alkkagi 로컬 캡처도 유지했다. MRI의 진단 소견 로딩 상태를 완료 기능으로 주장하지 않았다.
- [x] 전체 20쪽을 새로 렌더했다. 변경된 7·8·14·17쪽을 직접 확인해 잘림·한글 깨짐·캡션/이미지 겹침이 없음을 확인했고, 나머지 16쪽 PNG는 앞서 시각 검수한 렌더와 바이트 동일함을 확인했다. `verify_portfolio.py`가 20쪽·책갈피20·외부링크64·내부링크6·layout overlap0 및 네 영상 타임스탬프 표시를 통과했다.
- [x] 최종 8,469,645 bytes, SHA-256 `D1107AA5A76A0B832C62A26753A57C42F268A5A3E2ABB21163BEAF7CB7DC1C70`. output/public/dist 해시 일치, 로컬 PDF HTTP200·application/pdf·Content-Length8469645 확인. 웹 metadata 20쪽·8.5MB와 PDF 계약을 갱신했다.
- [x] `npm.cmd run verify` 통과: 테스트27, 소스경로11·스타일경계12, production 모듈766·배포entry23. Resume 390×844·768×1024·1280×900 실제 브라우저에서 8.5MB 줄바꿈·44px action·overflow0·키보드 Tab focus2px·기본 lite/static 및 full/interactive를 확인했다. 390px reduced/flat과 가시성도 확인했다. warning/error 로그0. viewport 복원·임시 탭/preview 종료.
- [x] 기존 Drive PDF를 같은 ID로 교체하고 metadata 재조회에서 8,469,645 bytes·application/pdf·기존 parent·shared=false·owner1 유지 확인. 공유 설정과 상장·원본 Resume·모션 코드는 그대로다.
- [ ] 공개 웹 배포·Git commit/push는 하지 않았다. 원격 MRI 영상 바이트 일치, THING 정확한 원본 변환 명령, 실제 PDF viewer·QR 카메라·OS 모션설정·실물 터치 등은 재검증하지 않았다. 새 모델 추론/하드웨어 실행은 하지 않았다.

## 2026-09-04 설명 중심 시각자료 개정 검수

- [x] 전체 20쪽을 다시 렌더했다. 4–19쪽은 최종 화면 또는 동일 픽셀의 검토 화면을 직접 확인했고, 1·2·3·20쪽은 이전 검수 렌더와 동일하다. 세 독립 검토자가 THING/AQIS, ML, 웹 프로젝트를 나눠 검토했다. MRI 화살표, THING 기록 위치·스풀 설명, Briefit 기준 요약 표현, Prompt 그룹 경계를 반영한 5·6·12·14·19쪽도 마지막에 다시 확인했다.
- [x] PDF는 20쪽·책갈피20·외부링크64·내부링크6, 본문/사진 겹침0과 페이지 경계 검사를 통과한다. 사진 위 편집 번호만 의도한 겹침으로 허용한다. 소개·About 분리, THING1/Briefit3 수상, 예시 표기, 후처리 전 평가, 독립 MRI 모델, 임상 검증 미수행 조건과 영상/로컬 출처 라벨 제거를 계약으로 확인했다.
- [x] 원본 그림·사진·캡처와 실행 근거 JSON 13개가 기존 manifest SHA-256과 일치한다. 원본 파일을 변경하지 않고 PDF에서만 비율 유지 확대/클리핑과 번호·화살표를 적용했다. 클리핑 영역은 내부 출처 문서에 기록했다.
- [x] 최종 PDF는 6,138,051 bytes, SHA-256 `D8CA46FCB84B5D0C9F08C2F8BCCBA7EB39C2A27D4BDEF639046D7091C4C13046`. 재빌드가 같은 해시이며 output/public/dist 일치. 다운로드 응답 HTTP200·application/pdf·Content-Length6138051과 웹 안내 6.1MB를 확인했다.
- [x] `npm.cmd run verify` 통과: 테스트27, 소스경로11·스타일경계12, production 모듈766·배포entry23. `git diff --check` 통과. 390×844·768×1024·1280×900 실제 브라우저에서 줄바꿈·44px action·overflow0, 모바일/데스크톱 키보드 포커스, lite/static 및 full/interactive 기본 상태를 확인했다. warning/error 로그0. 임시 탭과 preview를 종료하고 viewport를 복원했다.
- [x] 기존 비공개 Drive 파일 ID/parent를 유지해 6,138,051 bytes의 application/pdf로 교체하고 metadata 재조회했다. shared=false·owner1, 원본 Resume·상장·웹 모션을 유지한다.
- [ ] 공개 배포·Git commit/push는 수행하지 않았다. 이번 개정은 시각자료 편집으로, 추가 모델 추론·LLM 호출·실장비 실행과 OS reduced-motion 변경·실물 터치·QR 스캔·PDF viewer 상호작용·전체 외부 링크 HTTP는 재검증하지 않았다. 기존 내부 출처/실행 한계는 유지하며 사용자 `tmp/pdfs/skhynix-jd/` 파일은 보존했다.

## 2026-09-04 사용자 승인 배포 사전 검사

- [x] 사용자가 웹 연결·Drive 업로드·공개 웹 배포를 명시적으로 요청했다. Home/Resume의 상대 다운로드 링크는 기존 GitHub Pages 프로젝트 하위 `portfolio/SeMinKong-Portfolio.pdf`로 해석된다.
- [x] 최종 20쪽·6,138,051 bytes PDF의 output/public/dist SHA-256이 `D8CA46FCB84B5D0C9F08C2F8BCCBA7EB39C2A27D4BDEF639046D7091C4C13046`로 일치한다. PDF 구조 검사 및 `npm.cmd run verify`를 다시 실행해 테스트27·경로11·스타일12·모듈766·배포entry23 통과했다. 화면/CSS/모션은 직전 검수 상태와 같다.
- [x] Drive의 기존 파일을 최종 바이트로 재업로드하고 metadata 재조회에서 크기·PDF MIME·기존 parent·shared=false·owner1을 확인했다.
- [x] 독립 사전 검사에서 배포물에 작업 clone·렌더·metadata가 포함되지 않음을 확인했다. 임시 파일 및 사용자 `tmp/pdfs/skhynix-jd/`는 명시적 staging 대상에서 제외한다. GitHub Pages의 원격 배포 성공과 실제 공개 URL의 파일 동일성은 업로드 후 별도 확인한다.

## 2026-09-04 정적 PDF 타이포그래피·PDF 전용 프로필 검수

- [x] 최종 20쪽을 렌더했다. 변경된 1·2·4·6·7·8·11·14쪽을 직접 확인하고 독립 검토자의 승인을 받았다. 나머지 12쪽은 이전 검수 PNG와 바이트 동일하다. 사진 비율·자기소개 위계·2×2 개인 정보·의미 단위 줄바꿈에 겹침과 잘림이 없다.
- [x] `verify_portfolio.py` 통과: 20쪽·책갈피20·외부링크64·내부링크6·레이아웃 겹침0. 다섯 사진 캡션의 이미지 시작선·폭·10pt 간격, 열한 문단의 끝줄 길이/폭과 프로필 비율을 추가 검사했다. 글꼴/크기·수상 귀속·프라이버시·원본 시각자료/도식은 유지한다.
- [x] 최종 PDF는 8,836,654 bytes, SHA-256 `F526C7400A85B464C5DAB34823E496B6A102C9170F4B7A586920615C36F0004D`. 검수 뒤 재생성해도 같으며 output/public/dist 사본이 일치한다. 웹의 용량 안내와 해시 계약을 동기화했다.
- [x] 사용자의 최종 지시대로 프로필은 PDF 첫 자기소개 페이지에만 포함한다. 웹 Home HTML/CSS의 Git 정규화 내용은 HEAD와 동일하다. 원본 사진은 ignored `.private/portfolio/`에만 두고 public/dist의 별도 이미지나 웹 코드 참조가 없음을 검사했다.
- [x] 실제 production Resume 390×844·768×1024·1280×900의 8.8MB 안내·44px 다운로드 action·줄바꿈·수평 overflow0을 확인했다. Tab 이동과 2px focus outline, 기본 lite/static 및 full/interactive, 390px reduced/flat과 링크 가시성을 확인했다. 앱 warning/error는 없으며 Chrome의 기존 지갑 확장 프로그램 경고는 검증 대상과 구분했다.
- [x] `npm.cmd run verify` 통과: 테스트27·소스경로11·스타일경계12·production 모듈766·배포entry23. `git diff --check` 통과. 런타임 의존성·웹 모션·원본 Resume와 상장은 변경하지 않았다.
- [x] 기존 Drive PDF를 같은 ID로 갱신하고 재조회에서 8,836,654 bytes·application/pdf·기존 Portfolio parent·shared=false·owner1을 확인했다. 사진 원본과 다른 Drive 파일/공유 권한은 변경하지 않았다.
- [ ] 실제 OS reduced-motion 변경·실물 터치·QR 스캔·메일 앱·PDF viewer 상호작용·전체 외부 링크 HTTP는 이번 검증 범위 밖이다. 공개 배포 성공과 live PDF 동일성은 GitHub Pages 완료 후 별도 확인한다.

## 2026-09-04 PDF 증명사진 중앙 정렬 검수

- [x] 첫 페이지 최종 렌더를 직접 확인했다. 사진은 180×240pt를 유지하며 255pt 오른쪽 영역 중앙에 위치한다. 좌우 여백은 각각 37.5pt이고 실제 PDF 이미지 좌표 및 layout 기록의 중심 x=675.5pt 검사가 통과한다. 사진 아래 정보·본문·웹의 사진 미노출 방침은 유지한다.
- [x] 독립 비교에서 layout 기록의 유일한 차이는 p1 사진 x548→585.5pt이다. p1 내용 스트림도 사진 x좌표 두 곳만 변경됐고 p2–20 스트림은 동일하다. 전체 텍스트·이미지 픽셀 데이터·링크 URI·metadata가 유지된다.
- [x] PDF 검사: 20쪽·책갈피20·외부링크64·내부링크6·레이아웃 겹침0·캡션5·문단 끝줄11 통과. 최종 8,836,658 bytes, SHA-256 `C8B093C0389A68CA402051EE635A29B544285BCDE47EB4C07804D2FBC6C1361F`로 output/public/dist가 일치하고 재생성 해시도 같다.
- [x] `npm.cmd run verify`: 테스트27·경로11·스타일12·production 모듈766·배포entry23 통과. 웹의 HTML/CSS/JS는 수정하지 않고 기존 PDF 다운로드 파일과 검증 계약을 교체했다. 표시 용량 8.8MB·20쪽·날짜는 동일하다.
- [x] 실제 production Resume 390·768·1280px에서 overflow0, 모바일 한 열·태블릿/데스크톱 가로 action 배치와 44px 높이, 다운로드 URL/filename/새 탭 속성을 확인했다. Tab 포커스 2px, lite/static 및 full/interactive, 390px reduced/flat과 링크 가시성이 정상이다. 앱 warning/error는 없고 기존 Chrome 지갑 확장 경고는 구분했다. 검수 탭을 닫고 viewport를 복원했다.
- [x] Drive의 기존 PDF ID·parent·비공개 권한을 유지해 교체하고 재조회에서 8,836,658 bytes, application/pdf, shared=false·owner1을 확인했다. 사용자 임시 파일과 사진 원본을 배포 범위에서 제외한다.
- [ ] GitHub Pages 성공과 공개 다운로드 동일성은 푸시 후 별도 확인한다. 실물 터치·OS 모션 설정·QR 카메라·메일 앱·외부 링크 전체 HTTP·PDF viewer 조작은 이번 검증 범위 밖이다.

## 2026-09-04 정적 PDF의 제목·장식 정리 검수

- [x] 전체 20쪽 렌더를 직접 확인하고 독립 편집 검토를 받았다. 문장형 제목은 구체적인 명사형으로, 표지 강조 인사말은 평문으로 정리했다. 반복 영문 머리말·Portfolio/날짜 footer·장식 번호·문서 사용법 안내를 제거했고, 소개의 마지막 한 문장을 축약한 최종 표지도 다시 렌더해 확인했다. 나머지 19쪽은 검수 PNG와 바이트 동일하다.
- [x] 이미지 픽셀 데이터·배치, MRI 숫자 도식 위치와 페이지별 링크 URI는 이전본과 같다. THING 1개/Briefit 3개 수상, Briefit 분할 수치·후처리 전 ROUGE·짧은 문장 손실·예시, MRI 독립 모델·비임상/평가 한계·예시, AQIS 0.6초·정지 센서 미확인, Alkkagi 목표 루프·입력 제한·검증 한계, Prompt 메모리 세션 한계를 독립 대조했다.
- [x] `verify_portfolio.py`: 20쪽·책갈피20·외부링크64·내부링크6·레이아웃 겹침0·캡션5·문단 끝줄11·중앙 정렬 사진 통과. 장식 머리말/푸터 금지와 단순 쪽수, Briefit의 세 독립 경로에 장식 번호가 없음을 회귀 검사한다. 최소 글자 8.5pt이며 유용한 사실 라벨과 출처 크기는 각각 10pt·9pt다.
- [x] 최종 PDF는 8,818,944 bytes, SHA-256 `0054AF88D0E14587999A9447D9A951178E48AC35CB83197AD9B1643341B54D0F`. 재생성·output/public/dist 해시가 일치하고 다운로드 계약을 갱신했다. 웹 안내의 반올림 용량 8.8MB·20쪽·날짜는 동일하다.
- [x] `npm.cmd run verify`: 테스트27·경로11·스타일12·production 모듈766·배포entry23 통과. 실제 production Resume 390·768·1280px에서 overflow0, 44px 링크·모바일 한 열/큰 화면 가로 배치·Tab focus2px·정상 URL/filename/target, lite/static 및 full/interactive와 390px reduced/flat을 확인했다. 콘솔 warning/error0. viewport 복원·검수 탭 종료.
- [x] Drive는 기존 파일 ID·parent·비공개 설정을 유지해 갱신하고 재조회에서 8,818,944 bytes·application/pdf·shared=false·owner1을 확인했다. 원본 사진·원본 Resume·상장·웹 HTML/CSS/모션과 사용자 tmp는 변경하지 않는다.
- [ ] GitHub Pages 배포 성공과 공개 PDF 동일성은 푸시 후 별도 확인한다. QR 실물 스캔·OS 모션 설정·실물 터치·메일 앱·전체 외부 링크 HTTP·OS PDF viewer 조작은 이번 검증 범위 밖이다.

## 2026-09-04 현재 거주지 Suwon 정정 검수

- [x] Home Contact, About 역할/위치와 Based in, Resume 연락처, PDF 표지의 현재 거주지 다섯 곳을 Suwon으로 통일했다. 원본 Resume PDF/DOCX/미리보기에는 Seoul 표기가 없어 유지한다. 과거 학교/수상 기관 및 당시 결정 기록은 변경하지 않는다.
- [x] PDF 표지 최종 렌더의 줄바꿈·정렬을 직접 확인했다. 독립 비교에서 p1 내용 스트림 및 layout의 Seoul→Suwon 한 문자열만 변경됐으며 p2–20, 모든 이미지 픽셀·링크 URI/영역·내부 목차·메타데이터는 동일하다. PDF 구조 검사와 겹침0·캡션5·문단 끝줄11·중앙 정렬 사진 검사도 통과한다.
- [x] 최종 PDF 8,818,945 bytes, SHA-256 `5DDF97C453E4F5AC00BDB0A67B6E831C946C3A121F176FAF4305AD9D7A99F747`로 output/public/dist가 일치한다. 용량 8.8MB·날짜 안내는 동일하며 해시/바이트 계약 및 웹·PDF 거주지 회귀 검사를 갱신했다.
- [x] `npm.cmd run verify` 통과: 테스트28·소스경로11·스타일경계12·production 모듈766·배포entry23. 실제 production Home/About/Resume를 390·768·1280px에서 확인해 Suwon 표기·Seoul 부재·수평 overflow0, lite/static 및 full/interactive를 확인했다. 대표 화면을 육안 검수했으며 Resume 다운로드 Tab focus2px, 390px reduced/flat, 콘솔 warning/error0을 확인했다. HTML 텍스트 외 CSS/JS/모션 변경은 없다.
- [x] Drive 기존 파일 ID·Portfolio parent·비공개 설정을 유지해 같은 PDF로 갱신하고 재조회에서 8,818,945 bytes·application/pdf·shared=false·owner1을 확인했다. 비공개 사진 원본·원본 Resume·상장·사용자 tmp는 배포 범위에서 제외한다.
- [ ] 공개 페이지 Suwon 표기와 배포 PDF 해시는 GitHub Pages 파이프라인 완료 후 확인한다. 실물 터치·OS 모션 설정·PDF viewer 조작·메일 앱·전체 외부 링크 검증은 이번 범위 밖이다.
