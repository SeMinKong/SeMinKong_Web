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
- [ ] Original Resume privacy: the requested source includes a phone number and birth date. Confirm that both may be public before deploying.
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
