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
- [x] Manrope Variable, Noto Sans KR Variable, and JetBrains Mono Variable are self-hosted through npm
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
