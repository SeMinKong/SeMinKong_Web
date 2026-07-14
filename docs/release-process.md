# Release process

## Branch and pull request flow

1. Start from an up-to-date `main` branch.
2. Create a short-lived `feature/`, `fix/`, or `codex/` branch.
3. Keep one coherent change per pull request.
4. Run `npm.cmd run verify` and the browser checks in `docs/qa-checklist.md`.
5. Open a pull request to `main` and merge only after `CI / build` succeeds.
6. Delete the merged branch. A `main` push automatically starts the Pages deployment workflow.

## Version numbers

- Patch (`1.0.1`): bug, copy, styling, accessibility, or performance correction without a new feature.
- Minor (`1.1.0`): new project, page, or backward-compatible interaction.
- Major (`2.0.0`): information architecture, routing, or design-system change that materially resets the experience.

Update the package and lockfile in the release pull request:

```powershell
npm.cmd version patch --no-git-tag-version
```

Use `minor` or `major` instead of `patch` when appropriate, and move the relevant `CHANGELOG.md` entries from `Unreleased` into the new version.

## Tag and release

After the release pull request is merged and Pages succeeds, tag the exact `main` commit:

```powershell
git switch main
git pull --ff-only
git tag -a v1.0.0 -m "SeMinKong portfolio v1.0.0"
git push origin v1.0.0
gh release create v1.0.0 --verify-tag --generate-notes --title "v1.0.0"
```

## One-time repository settings

- Settings → Pages → Build and deployment → Source: **GitHub Actions**.
- Keep `main` deployable and require the `CI / build` status check when branch rules are available.
- Prefer squash merges, linear history, automatic branch deletion, and resolved conversations before merge.
- GitHub Pages is free for public repositories. A private repository requires a GitHub plan that includes private Pages.
