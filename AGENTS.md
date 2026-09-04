# Repository guidance

## Toolchain

- Use npm only. Do not use pnpm or yarn.
- In Windows PowerShell, prefer `npm.cmd` because script execution policy may block `npm.ps1`.
- Development: `npm.cmd run dev`
- Production build: `npm.cmd run build`
- Preview: `npm.cmd run preview`
- Never edit `node_modules/` or `dist/` directly.

## Source of truth

- Read `docs/design-brief.md` before changing the visual direction or page structure.
- Read `docs/motion-spec.md` before changing animation behavior.
- Record decisions that affect later work in `docs/decisions.md`.
- Use `docs/qa-checklist.md` for final verification.

## Collaboration

- The main agent owns requirements, integration, final edits, and final verification.
- Delegate independent research, audits, and tests to subagents.
- Only one agent may edit a given file at a time.
- Use a separate Git worktree for parallel code-writing tasks.
- Subagents must return concise findings, changed files, verification evidence, and remaining risks.
- Do not commit, push, or open a pull request unless the user explicitly asks. The standing deployment authorization below is an explicit exception for scoped website/static portfolio releases; it does not authorize unrelated changes or pull requests.

## Publication workflow

- Standing user instruction (2026-09-04): whenever requested work changes the website or static portfolio PDF, complete verification and deploy to the existing GitHub Pages site at `https://seminkong.github.io/SeMinKong_Web/` without requiring a separate deployment request.
- This authorizes the scoped commits and pushes necessary for that deployment. Include only reviewed changes belonging to the requested work; never publish unrelated edits, private originals, credentials, scratch files, or unverified drafts.
- For PDF changes, regenerate and visually verify the final PDF, synchronize the public download copy and its size/date/hash contracts, then build and deploy the website so the live download serves the same final file.
- Use the existing deployment pipeline, wait for its result, and verify the live pages/downloads before reporting deployment complete. If validation or deployment is blocked, explain what remains unpublished rather than claiming success or bypassing checks.
- A review, diagnosis, or planning request alone does not authorize content changes. Documentation-only preference updates do not require a website release. An explicit later instruction to keep work local, defer deployment, or not publish overrides this default.

## Design constraints

- Use reference sites for principles, not for direct copying of branding, copy, layout, or assets.
- Keep Anime.js as the default motion library for entrance, hover, and timeline work. GSAP (with ScrollTrigger/SplitText) is approved by the owner (2026-08-20) for cases where it is clearly stronger — scrubbed scroll choreography, pinned sequences, or repeated text splitting — and should be introduced per-pattern with a bundle-size note, not as a wholesale migration.
- Prefer lightweight 2.5D effects over adding a full Three.js stack unless the user changes this decision.
- Apply motion and depth automatically when supported; do not expose manual Motion or Depth on/off buttons.
- Preserve `prefers-reduced-motion` and automatically simplify depth for touch, coarse-pointer, and constrained layouts.
- Pause continuous motion when the page is hidden or the animated region is offscreen.
- Keep touch interactions native and avoid trapping vertical page scrolling.

## Verification

- Run `npm.cmd run build` after source changes.
- Check 390px, 768px, and 1280px layouts in a real browser.
- Check console errors, horizontal overflow, keyboard focus, default Motion/Depth behavior, capability fallbacks, and reduced motion.
- Report what was verified and anything that remains unverified.
