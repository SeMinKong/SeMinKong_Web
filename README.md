# Se Min Kong Portfolio

AI, Robotics, Computer Vision, and software projects presented through Home, About, Work, case-study, and Resume pages in Vite.

## Local development

Requirements: Node.js 24 and npm.

```powershell
npm.cmd ci
npm.cmd run dev
```

Production verification:

```powershell
npm.cmd run verify
npm.cmd run preview
```

## Source architecture

Each route loads only the entry and stylesheet layers it owns. Shared page behavior is registered through `src/app/create-page-runtime.js`; optional Lenis and GSAP code is loaded only when the active route and capability tier need it.

| Route | Entry | Page styles |
| --- | --- | --- |
| Home | `src/entries/home.js` | `portfolio-shared.css`, `home.css` |
| Work | `src/entries/work.js` | `portfolio-shared.css`, `work.css` |
| Six case studies | `src/entries/case-study.js` | `case-study.css` |
| About | `src/entries/about.js` | `about.css` |
| Resume | `src/entries/resume.js` | `resume.css` |
| Copyright | `src/entries/legal.js` | `legal.css` |

`config/site-routes.js` is the source of truth for Vite inputs and deployment verification. `npm.cmd run verify` checks route/entry/style boundaries, builds production assets, and validates every local deployment reference.

## GitHub Flow

1. Create a short-lived branch from `main`.
2. Implement one coherent change and update `CHANGELOG.md` when it affects a release.
3. Open a pull request to `main`.
4. Merge only after the `CI / build` check succeeds.
5. A merge to `main` builds `dist/` and deploys it through GitHub Pages.

The detailed release and versioning procedure is documented in [docs/release-process.md](docs/release-process.md).

## Deployment

The repository uses GitHub Actions to deploy the generated `dist/` artifact. The expected project-site URL is:

`https://seminkong.github.io/SeMinKong_Web/`

GitHub Pages must use **GitHub Actions** as its source. Private-repository Pages availability depends on the GitHub plan; repository visibility should be changed only after an explicit decision.
