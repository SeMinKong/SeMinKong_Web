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
- Do not commit, push, or open a pull request unless the user explicitly asks.

## Design constraints

- Use reference sites for principles, not for direct copying of branding, copy, layout, or assets.
- Preserve Anime.js as the primary motion library.
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
