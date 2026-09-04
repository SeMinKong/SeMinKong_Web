# Static portfolio evidence register

Reviewed 2026-09-04. This is an editorial working record. Bounded local reproductions are documented below; neither the diagrams nor local smoke tests establish hardware, model-quality or production-performance claims.

## Editorial structure

A4 landscape, 20 pages: personal introduction; About / education / current learning; project index; THING overview / source architecture / implementation / results and award; AQIS overview / architecture / coordinate timing; Briefit overview / data pipeline / postprocessing and three awards; MRI overview / method and evaluation / synthetic mask preprocessing; Alkkagi overview / physics; Prompt Generator; contact. The opening two pages contain no project names or project-linked strengths. This visual revision extends the locally prepared 18-page edition; GitHub Pages deployment is separate.

Use warm paper, near-black text, one vermilion accent, compact 38pt margins, thin rules and real project artifacts. Metadata rails, two/three-column explanations and implementation notes create dense technical pages. Use a readable Korean body face instead of stretching the website's display face into long paragraphs. No synthetic project screenshots, skill percentages, invented impact numbers or decorative terminal windows. References inform hierarchy, not copied layout or branding.

## THING

- Team context: six people; 21 hand landmarks, seven logical axes, ROS 2 command arbitration and guard, DYNAMIXEL tendon actuation. [README](https://github.com/SeMinKong/THING/blob/main/README.md)
- Personal work: motor communication environment and U2D2; seven-motor scan, individual/keyboard/home/stop scripts; acrylic motor mount fabrication; spool/tendon integration. [07-27](https://github.com/SeMinKong/THING/blob/main/docs/daily-reports/2026-07-27/2026-07-27-공세민.md), [07-28](https://github.com/SeMinKong/THING/blob/main/docs/daily-reports/2026-07-28/2026-07-28-공세민.md), [07-29](https://github.com/SeMinKong/THING/blob/main/docs/daily-reports/2026-07-29/2026-07-29-공세민.md), [07-31](https://github.com/SeMinKong/THING/blob/main/docs/daily-reports/2026-07-31/2026-07-31-공세민.md).
- Keep team safety architecture distinct from personal ownership. [Architecture](https://github.com/SeMinKong/THING/blob/main/docs/architecture.md), [safety manager](https://github.com/SeMinKong/THING/blob/main/docs/safety_manager.md).
- Grasp procedure has a ten-trial/three-second protocol but blank results. Do not present a success rate. [Procedure](https://github.com/SeMinKong/THING/blob/main/tests/procedures/grasp-test.md).
- Source versions disagree about three versus four recording files; do not include an exact artifact count or strict landmark-schema validation claim in PDF. No measured latency, durability or industrial safety certification claim.

## AQIS

- Two people; Kong is team lead and Full-stack/Robot Integration owner. Main development 2026-06-01 to 06-26, initial planning in May. [Roles and schedule](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/docs/07-roles-and-schedule.md).
- Own work: RealOps, FastAPI REST/WebSocket, ROS 2 bridge, conveyor HTTP, Dobot sequence, LLM command/fallback. Model training/Roboflow/CAD/simulation are separate teammate work, not personal claims.
- Strong decision: develop common REST/WS with mock adapters before hardware access. [Day 1](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/docs/day1-decisions.md).
- Strong integration issue: moving target coordinates become stale; use a detection after stop request and configured wait. [Main event flow](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/server/app/main.py), [related tests](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/server/tests/test_real_monitoring.py).
- Isolated local tests were run during the visual revision: 26 passed and two existing calibration-expectation tests failed. See reproduction scope below. Do not infer physical stop confirmation, classification success rate, cycle time, Nav2 completion or persistent database implementation. Demo contains speed-up segments.

## MRI

- Two independent YOLO11 models (classification and segmentation), not U-Net or a jointly trained multi-task model. Mask binarization/morphology/contours/normalized polygon conversion and combined inference visualization are implemented. [train.py](https://github.com/SeMinKong/BrainMRISegmentation_YOLO/blob/3c9a0694dde759390c5813b60b60b5911448d716/src/training/train.py), [test.py](https://github.com/SeMinKong/BrainMRISegmentation_YOLO/blob/3c9a0694dde759390c5813b60b60b5911448d716/src/testing/test.py).
- README reports 99.4% / 92.7%, but public weights, logs and results.csv are absent. Training uses test as val. Omit headline metrics from PDF rather than imply independent final-test performance.
- BRISC describes 6,000 classification images and 4,793 segmentation image-mask pairs; these are source dataset sizes, not verified project run counts. Patient identifiers are unavailable and subject independence is not guaranteed. Non-tumorous includes non-tumor lesions, not exclusively healthy brains. Research/benchmark use, not clinical diagnostic validation. [BRISC paper](https://arxiv.org/html/2506.14318v5).

## Alkkagi

- Authoritative in-memory server state; target 60Hz interval; ten physical substeps; impulses, overlap correction, friction, mass/radius growth; 500ms input cooldown. [Server](https://github.com/SeMinKong/Alkkagi/blob/530229c524a432c0016a28376a5c6fccd8f8e5b5/server/index.ts), [physics](https://github.com/SeMinKong/Alkkagi/blob/530229c524a432c0016a28376a5c6fccd8f8e5b5/server/physics.ts).
- No measured sustained FPS, RTT, concurrency, prediction or reconciliation claim. The client uses DOM/SVG, not HTML Canvas. Test script is a placeholder.

## Briefit

- Six-person team, two AI members. Kong is AI member. [Team](https://github.com/capstone-btd/.github/blob/main/profile/README.md).
- Personal commits establish collection batching/URL filtering/deduplication, KoBART dataset split/training/generation/ROUGE scripts, repeated sentence-ending postprocessing. [Collection](https://github.com/capstone-btd/Briefit_AI/commit/a7b25dff1438940fea631d8ba597835435b7c32a), [KoBART](https://github.com/capstone-btd/Briefit_AI/commit/714502c017f0c57ebebd634b60ea77a102945d81), [postprocess](https://github.com/capstone-btd/Briefit_AI/commit/da4ea1b09cfd44724facc19233d65c07e4301f3a).
- Distinguish 2025 contribution from current team's GPT-OSS main pipeline. No bias-removal, accuracy-improvement or nationwide daily coverage claims. Team product screenshot is not Kong's UI-design attribution.

## Prompt Generator

- Six domain-specific dialogue states, parallel initial questions with asyncio.gather, FastAPI WebSocket and LangChain ChatUpstage solar-pro. [Server](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/blob/1972aa05d5caca05869a6ba588bf4b7573a7f678/server/app.py), [state](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/blob/1972aa05d5caca05869a6ba588bf4b7573a7f678/state.py).
- No LangGraph StateGraph import/construction/compile/invoke in public executable source. The dependency/repo title alone is insufficient; PDF should say domain-specific state management, not LangGraph implementation.
- Three rounds is a generation threshold, not a hard conversation maximum. Sessions are memory-only and deleted on disconnect. No quantified productivity claim.

## Publication / privacy

The following privacy and delivery rules apply to both the published edition and the locally implemented revision below.

- PDF links to the canonical web URL, six case pages and public code/evidence. Searchable embedded Korean text, bookmarks and link annotations. QR has readable URL alternative.
- No phone number, birth date, third-party recipient data, certificate serial numbers or private Drive links in the PDF. Awards are a concise list with a web display-gallery link.
- Stable public PDF target: `public/portfolio/SeMinKong-Portfolio.pdf`. Keep editable source in `scripts/portfolio/`; rendering/QA intermediates are not public assets.
- Do not expose a design sample as the final download. Validate complete PDF before public linking and upload the same final bytes into a private Portfolio folder under the user-designated Drive folder. Preserve original awards in Drive.

## Reference review

[Moon, 6-page Korean developer PDF](https://zooxop.github.io/zooxop/resume/SW_DEV_MCH_portfolio.pdf), [Sujaan](https://sujaan.me/), [Benjamin Di Buono](https://benjamindibuono.com/projects), [Amith Polineni](https://amithp.com/portfolio/Amith_Polineni_Project_Portfolio.pdf), [Northwestern robotics portfolios](https://www.mccormick.northwestern.edu/robotics/curriculum/featured-project-portfolios.html). Borrow the principles of selective cases, explicit ownership and real artifacts, not branding or assets.

## Implemented revision — owner-confirmed requirements (2026-09-04)

- Keep the introduction and About personal: introduce Kong, education/training and known interests without project names, project achievements or project-linked descriptions of strengths. Do not invent personal motivations or personality traits.
- Prioritize the self-introduction in the opening and use a dense but readable layout. Project cases follow later as a separate section. Following the owner's implementation request, the revision uses 18 A4 landscape pages.
- For project cases, use the problem / constraints / decision / implementation / result / reflection narrative principle from [Ryu's portfolio](https://ryubyeongsun.github.io/bs_00.github.io/portfolio.pdf) and the compact metadata organization principle from Moon's portfolio. Do not copy branding, wording or assets.
- Place awards inside the associated project cases, with links to the existing privacy-redacted web gallery. The owner explicitly confirmed the project associations below; certificate review establishes award names and dates, not every project association on its own.

| Project | Award | Date |
| --- | --- | --- |
| THING | SSAFY 공통 프로젝트 우수상 | 2026-08-10 |
| Briefit | 2025 IT대학 소프트웨어 공모전 금상 | 2025-08-18 |
| Briefit | 제15회 숭실 캡스톤디자인 경진대회 장려상 | 2025-10-01 |
| Briefit | 2025 IT 프로젝트 프로리그 장려상 | 2025-11-22 |

The owner subsequently requested implementation. The initial 18-page implementation was extended to 20 pages by the source/reproduction visual revision below, pending separate website deployment. Validate with `scripts/portfolio/verify_portfolio.py`, visually inspect rendered pages, and keep the reviewed PDF byte count/hash in the web contract test. Do not publish source notes, layout JSON or draft PDFs.

## Source and reproduction visual revision

The owner requested local reproduction where hardware is unnecessary, reuse of THING/AQIS source architecture and code-based diagrams for the other projects. Implemented source selection, pinned commits, image hashes, sensitive metadata removal and precise execution limits are recorded in [portfolio-visual-sources.md](portfolio-visual-sources.md). Following the readability request, the 20-page PDF uses functional captions instead of separate video/local-run labels; provenance remains in the source notes. Synthetic explanatory inputs are labeled as examples. This is not a new hardware run or full ML reproduction.

## Additional implementation detail checked for the revision

- AQIS: configurable stop-request delay (default 0.6 seconds), timestamped detection maximum age (3 seconds), depth-bearing detection preference. Missing timestamps are accepted; this is not a universal freshness guarantee. Deduplication defaults are IoU 0.5, center distance 70px and an 8-second window; duplicates refresh time/position. These are code settings, not measured outcomes. [Configuration](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/server/app/config.py), [Deduper](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/server/app/services/detection_deduper.py).
- Briefit, from the pinned personal commits above: 10-item target batches and a run-shared URL set; comment URL filtering and rejection of bodies shorter than 100 characters after tag cleanup; seed 42 with default 8:1:1 train/valid/test JSONL; generated/reference summary pairs for ROUGE. Trailing short/repeated sentence cleanup is rule-based and does not guarantee meaning preservation. Configured collection targets are not collected totals.
- Alkkagi, from the pinned physics/server sources above: equal overlap correction; skip impulse when separating along the collision normal; inverse-mass impulse; radius +0.8 and mass +0.05 per kill point (absorbed opponent points can make one elimination worth several points); input speed cap 0.45 board size before division by mass; substep friction `FRICTION ** stepFactor`. These are implementation values, not benchmarks.
