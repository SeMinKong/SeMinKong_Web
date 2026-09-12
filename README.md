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
| Home | `src/entries/home.js` | `portfolio-shared.css`, `home.css`, `kinetic-home.css` |
| Work | `src/entries/work.js` | `portfolio-shared.css`, `work.css` |
| Six case studies | `src/entries/case-study.js` | `case-study.css` |
| About | `src/entries/about.js` | `about.css` |
| Resume | `src/entries/resume.js` | `resume.css` |
| Copyright | `src/entries/legal.js` | `legal.css` |

`config/site-routes.js` is the source of truth for Vite inputs and deployment verification. `npm.cmd run verify` runs behavior tests, checks route/import/style boundaries and unused source files, builds production assets, and validates local deployment references.

The Home robot lives in `src/motion/`:

| Module | Responsibility |
| --- | --- |
| `kinetic-sandbox.js` | Lazy loading, capability changes, visibility and fallback |
| `kinetic-sandbox-runtime.js` | Scene lifecycle, input, puzzle connections and simulation |
| `robot-config.js` | Part configuration, physics settings and responsive scatter |
| `robot-kit.js` | Geometry, ports and static assembly |
| `robot-artwork.js` | Textures, shadows and interaction hints |
| `robot-completion.js` | Connected completion poses and celebration graphics |
| `kinetic-math.js` | Pure geometry, snap, interpolation and joint calculations |

`home.css` owns the Home navigation and sections below the Hero. `kinetic-home.css` owns the entire Hero, signature and robot fallback. Continuous effects use the shared runtime and automatically pause or simplify with the page environment.

## Working guide

Read [design-brief.md](docs/design-brief.md) for the current design, [motion-spec.md](docs/motion-spec.md) for interaction rules and [decisions.md](docs/decisions.md) for implementation boundaries. Use [qa-checklist.md](docs/qa-checklist.md) before publishing. Prior specifications and verification records are kept in [docs/history/](docs/history/).

`scripts/portfolio/` contains the source tooling for the approved nine-page static portfolio PDF. Each project summary links to its repository README and detailed implementation document; [portfolio-migration.md](docs/portfolio-migration.md) records where the former 27-page edition's technical content now lives. Evidence is documented in [portfolio-evidence.md](docs/portfolio-evidence.md), with publication rules in `AGENTS.md`.

To regenerate the PDF, install ReportLab, Pillow, pypdf and pdfplumber in a Python environment; provide NanumGothic Regular/Bold through `PORTFOLIO_FONT_DIR` or an installed font directory, and retain the approved portrait in `.private/portfolio/`. Run `python scripts/portfolio/build_portfolio.py` followed by `python scripts/portfolio/verify_portfolio.py`. Review every rendered page before copying the final PDF to `public/portfolio/` and synchronizing the Resume metadata and download contract. Private originals and generated review files are not published. `tmp/` is ignored local scratch space; generated `dist/` and `node_modules/` are never edited directly.

## Deployment

The repository uses GitHub Actions to deploy the generated `dist/` artifact:

[seminkong.github.io/SeMinKong_Web](https://seminkong.github.io/SeMinKong_Web/)

Follow `AGENTS.md`: requested website changes are verified and deployed through the existing Pages workflow, using only the scoped commits and pushes needed for that release. Create pull requests only when explicitly requested. See [release-process.md](docs/release-process.md) for versioning and release records.
