# Static portfolio evidence register

Reviewed 2026-09-12. Current output is the nine-page edition described in [portfolio-migration.md](portfolio-migration.md). The former 27-page technical explanations are retained in the six repositories' READMEs and linked implementation documents. The source records below remain evidence for those documents; historical page numbers and bounded reproductions do not describe the current PDF layout or establish fresh hardware, model-quality or production-performance results.

## Current editorial structure

A4 landscape, nine pages: introduction, contact, education, two qualifications and four awards (1); implementation experience and a text-only tool list (2); THING (3), AQIS (4), Briefit (5), MRI (6), Prompt (7), Alkkagi (8); repository reading guide and contact (9). Each project uses a real source image, personal scope, three implementation points, two code-supported design choices, validation limits and direct README/detail/web links. Existing portrait and project imagery are retained. No invented historical incident, skill rating, new benchmark or clinical/hardware validation is added.

## Tech Stack selection — 2026-09-12

The compact PDF carries the sixteen tools from the reviewed dev proposal, grouped into Robotics/Simulation, Languages, AI/Computer Vision, LLM/Backend and Platform/Collaboration. Ratings are omitted because no scoring rubric is established. The website is unchanged in this scope: current main's About lists sixteen tools with existing star markers, while Resume retains its thirteen-tool icon list. Aligning these two web sections or defining a rating rubric is separate work. A listed study tool does not extend project-specific ownership or prove proficiency. Earlier decisions about the icon-only PDF's final page are superseded by this compact edition.

## Evidence interpretation

The implementation notes distinguish THING's move/home target synchronization from its separate torque toggle, AQIS callback-created broadcast events from the callback thread itself, Briefit's paragraph chunking from guaranteed token-safe chunks, independent MRI model outputs from validated diagnostic performance, Prompt's round/tag condition from a maximum-three-round rule, and Alkkagi's configured update rate from measured FPS. Former MRI scores remain identified as unverified historical reports in the repository. Source comparisons and document rendering are editorial verification; no new model or physical-device experiment was performed.

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
- The initial plan limits hardware use to the final three days. This is a documented planning constraint, not a measured actual deployment duration. The PDF links this constraint to the implemented adapter/API separation.
- Strong integration issue: moving target coordinates become stale; use a detection after stop request and configured wait. [Main event flow](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/server/app/main.py), [related tests](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/server/tests/test_real_monitoring.py).
- Isolated local tests were run during the visual revision: 26 passed and two existing calibration-expectation tests failed. See reproduction scope below. Do not infer physical stop confirmation, classification success rate, cycle time, Nav2 completion or persistent database implementation. Demo contains speed-up segments.
- Current PDF verification table covers duplicate detections, STOPPED monitoring and timestamped stale input, supported by original tests plus prior bounded Mock reproduction. A missing timestamp passes freshness checking; the automatic path does not gate the next stage on conveyor stop failure; missing depth can use fixed coordinates. Process exit code zero is the resume condition, not sensed grasp success. Hardware cycle time, repeated sorting success and outage recovery remain unmeasured. See pinned source `9f6530a2acffa0555f9df2eb628b40e4d01b6341`.

## Added vector technical plates — 2026-09-08

Current visualization revision: angle vectors and calibrated encoder interpolation, asynchronous arrival/20Hz/50Hz timing, dedupe and pending windows, proportional token strips, mask/contour/coordinate conversion, state transitions and collision geometry. Numerical examples and diagram spacing illustrate configured calculations, not measurements. The same MRI enters two independently called models; training articles and decoder labels enter distinct KoBART paths.

## AQIS digital twin and telemetry expansion — 2026-09-08

- Rechecked [60951747](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/tree/60951747fac753eb521fd80efce3fbade0eda101); executable code matches the prior pinned source. RoboDK uses the UR5/AQIS.rdk scene, named-object/position detection, MoveJ targets and object reparenting. AGV motion interpolates nav1–nav6 scene frames. This is kinematic process simulation, not contact-force or autonomous Nav2 validation.
- Browser REST requests append commands to a queue; the RoboDK script consumes by HTTP polling, then returns status/events for server WebSocket broadcast. `script_id` filters command/event sessions. RoboDK scene/process/Simulation Dashboard belong to the teammate; Kong built server integration and adjusted the AGV path ([personal commit](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/commit/eb5b8a973e26bd6cf9d5a39c26d8806a3e6c6cdb)).
- ROS `/map` OccupancyGrid is converted to PNG plus origin/resolution with a two-second minimum event gap. React stores map state and displays update time but does not render the PNG. The public composite demonstrates RViz map/sensors alongside RealOps and the physical robot.
- TF map→base_footprint/base_link is queried at a 0.1s configured interval, with fresh TF/AMCL priority and odom fallback. The fallback is not transformed into the map frame. No custom SLAM or completed automatic Nav2 mission claim.
- JointState `position` radians become server `position_rad`/degree fields, then dobot_status → WebSocket → React → URDF axis rotation with mimic multiplier/offset. This actual Dobot viewer is separate from RoboDK's simulated UR5. ROS must be enabled; no dynamics or measured delay claim.

## Earlier additive plate source notes

The owner explicitly requested additions without removing existing content. The new plates show the hand landmark topology and motor-call sequence, camera/robot coordinate conversion, seq2seq training versus generation, mask/polygon representation, dialogue states, and collision position/impulse calculations. Equations and short pseudocode are derived from the pinned sources below; hand/contour/collision drawings are explanatory schematics, not captured inputs, predictions or experimental measurements.

- AQIS u/v are the detection center rescaled to the depth grid; d is in metres. X/Y and optional Z use affine coefficients before metre→millimetre conversion and millimetre offsets. Camera Z is not used directly as the robot height.
- Briefit generation uses the postprocessing version at da4ea1b: inputs of at most 1024 tokens take one generation call; longer inputs use paragraph grouping, per-chunk generation, concatenation and generation again. `_clean_tail` is applied inside every generation call, including partial summaries.
- Prompt incomplete success stays in_progress. Only handled errors return to pending with the prior round; prior generated results are not cleared. At least one generated result permits synthesis regardless of completion status.
- Alkkagi equations cover distinct centres (D > 0). Equal-half positional correction precedes the separating-velocity check. Diagram arrows show the normal and position correction, not measured velocities. Inverse mass affects impulses; ten substeps and 60Hz remain settings.

## Earlier source-backed technical pages — 2026-09-07

Pages 4/8/11/13/15/17 replace the previous architecture commentary within the same 18-page edition. The implementation sources were re-read at the pinned commits; no training, LLM, hardware or load run was added.

- THING: `compute_hand_targets` separates five flexion axes from thumb opposition/abduction, then applies deadband, low-pass filtering and slew limiting. `command_manager` distinguishes mimic/teleop/manual; guard validates commands and the operating driver uses encoder mapping, thumb functional poses and Sync Write. These are team mechanisms; Kong's motor-check scripts and mechanical integration remain separate. [Hand mapping](https://github.com/SeMinKong/THING/blob/2381e8e3cb46c083be6ce024a3eb88bc75674f12/thing_ws/src/thing_vision/thing_vision/hand_target_node.py#L183), [driver](https://github.com/SeMinKong/THING/blob/2381e8e3cb46c083be6ce024a3eb88bc75674f12/thing_ws/src/thing_hardware/src/motor_driver_node.cpp#L908).
- AQIS: team vision filters detection centers by pick ROI, uses the median of valid local depth and camera intrinsics for deprojection, and restricts repeated events with the same label/location bucket. Kong's bridge schedules ROS callbacks on asyncio; the server expands/normalizes payloads, updates state and broadcasts to the UI. Adapter interfaces separate hardware transport; camera X/Y conversion uses affine coefficients, units and offsets, not complete 3D extrinsic calibration. [Vision](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/9f6530a2acffa0555f9df2eb628b40e4d01b6341/aqis_ws/src/integrate_prac/integrate_prac/realsense_yolo_node.py#L215), [bridge](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/9f6530a2acffa0555f9df2eb628b40e4d01b6341/server/app/services/ros_bridge.py#L147).
- Briefit: the 2025 `preprocess_fn` maps article `text` to encoder inputs and reference `summary` to decoder labels for Seq2SeqTrainer. Generation uses beam search; long-input partial summaries are concatenated and summarized again, with truncation still possible. The source establishes configured training/generation/evaluation code, not completed training or measured improvement. [Training](https://github.com/capstone-btd/Briefit_AI/blob/714502c017f0c57ebebd634b60ea77a102945d81/Kobart/Scripts/Train.py#L25).
- MRI: classification folders and segmentation image/polygon pairs feed separate pretrained cls/seg models. `mask_to_polygons` binarizes, closes/opens, filters external contours and normalizes vertices by image width/height. Integrated inference overlays the classification label/score on the segmentation rendering; it does not gate segmentation or reconcile disagreement. Existing test-as-val, patient independence and clinical limits remain.
- Prompt: each model call composes the domain instructions, project description and that domain's history. The initial question also counts toward the round threshold; completion requires round >= 3 and `[GENERATE_PROMPT]`. `handle_finalize` collects domains with `generated_prompt`, not necessarily all six or only `status == completed`; at least one result permits synthesis. [Domain runner](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/blob/1972aa05d5caca05869a6ba588bf4b7573a7f678/dimensions/runner.py#L14), [synthesis](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/blob/1972aa05d5caca05869a6ba588bf4b7573a7f678/server/graph_runner.py#L93).
- Alkkagi: `flick` input is constrained on the authoritative server; ten substeps update motion/collision before `gameStateUpdate`. Equal-half positional correction is distinct from inverse-mass impulse response. Friction uses `Math.pow(FRICTION, stepFactor)`; board exits trigger scoring/respawn and radius/mass updates. The 60Hz setting is not measured frame-rate performance. [Physics](https://github.com/SeMinKong/Alkkagi/blob/530229c524a432c0016a28376a5c6fccd8f8e5b5/server/physics.ts#L31).

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

- Briefit long inputs: the owner's initial `smart_summarize` groups paragraphs, summarizes chunks and summarizes their concatenation. It checks length after adding a paragraph, and `generate_summary` truncates input: this does not preserve all long paragraphs or guarantee lossless context. [Original GenerateJson.py](https://github.com/capstone-btd/Briefit_AI/blob/8c48def1e623a69fbb28e3b085a2d49dc1dc003c/Kobart/Scripts/GenerateJson.py#L43). Collection uses Crawl4AI / BeautifulSoup and one run-shared URL set; no restart-persistent deduplication claim.
- MRI `mask_to_polygons` removes small components and keeps external contours; small lesions / interior holes can be lost. `run_integrated_test` runs segmentation regardless of the classification label and does not reconcile inconsistent outputs. [Training](https://github.com/SeMinKong/BrainMRISegmentation_YOLO/blob/3c9a0694dde759390c5813b60b60b5911448d716/src/training/train.py#L25), [inference](https://github.com/SeMinKong/BrainMRISegmentation_YOLO/blob/3c9a0694dde759390c5813b60b60b5911448d716/src/testing/test.py#L76).
- Prompt completion requires both the round threshold and generation tag; this is a state condition, not a quality score. On handled RuntimeError / ValueError / OSError, the server decrements the round and returns the domain to waiting. History is appended after a successful call; this is not full transaction rollback or automatic retry. [Completion](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/blob/1972aa05d5caca05869a6ba588bf4b7573a7f678/dimensions/runner.py#L48), [error handling](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/blob/1972aa05d5caca05869a6ba588bf4b7573a7f678/server/graph_runner.py#L22).

- AQIS: configurable stop-request delay (default 0.6 seconds), timestamped detection maximum age (3 seconds), depth-bearing detection preference. Missing timestamps are accepted; this is not a universal freshness guarantee. Deduplication defaults are IoU 0.5, center distance 70px and an 8-second window; duplicates refresh time/position. These are code settings, not measured outcomes. [Configuration](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/server/app/config.py), [Deduper](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/server/app/services/detection_deduper.py).
- Briefit, from the pinned personal commits above: 10-item target batches and a run-shared URL set; comment URL filtering and rejection of bodies shorter than 100 characters after tag cleanup; seed 42 with default 8:1:1 train/valid/test JSONL; generated/reference summary pairs for ROUGE. Trailing short/repeated sentence cleanup is rule-based and does not guarantee meaning preservation. Configured collection targets are not collected totals.
- Alkkagi, from the pinned physics/server sources above: equal overlap correction; skip impulse when separating along the collision normal; inverse-mass impulse; radius +0.8 and mass +0.05 per kill point (absorbed opponent points can make one elimination worth several points); input speed cap 0.45 board size before division by mass; substep friction `FRICTION ** stepFactor`. These are implementation values, not benchmarks.

## 2026-09-08 기술 원리 6쪽의 계산·분기 근거

고정 커밋의 소스를 재검토해 추가된 6쪽을 심화했다. 아래 수치는 설정값이나 계산 예시이며 새 실물·모델·부하 시험 결과가 아니다.

- **THING / p5**: `2381e8e3`의 hand_target_node.py L183·L915, vision.yaml L21·L40, motor_driver_node.cpp L542·L569·L745, motors.yaml L31·L60, thumb_motion_controller.cpp L198. 관절 굽힘은 `(pi-theta)/radians(125)`, 근위/원위 가중치 0.65/0.35. 엄지 대립은 거리/손바닥 폭의 0.20~1.25 역정규화, 외전은 손바닥 평면 투영 뒤 10~65도 정규화다. 입력은 world_landmarks가 아닌 영상 정규화 좌표다. 첫 보정 표본 이후 deadband .02, alpha .25, callback당 delta .08. 검지 home1740/closed4300에서 q=.5의 최종 목표는3020 pulse. 엄지는 네 기능 자세 후보를 선택하고 MIMIC 수신3회·거리margin.1로 전환을 안정화한다. 명령20Hz·쓰기50Hz·읽기20Hz, 유효표본250ms 공백 폐기. 드라이버는 steady dt를 최대.25초로 자르고 profile_velocity*.229*4096/60과 speed_limit으로 엔코더 이동량을 정한다. 단일 spin·순차 버스 I/O라 주기 유지 보장은 아니다. 활성 speed_limit은1.0이며 control.yaml의 과거 .25 주석과 구분한다. 엄지 외전 보정은 재보정 전 범위다. 모두 팀 운영 제어이며 본인은 독립 모터 점검·기구 통합을 담당했다.
- **AQIS / p10**: `9f6530a2`의 detection_deduper.py L26, main.py L212, config.py L46, dobot_pick_place.py L142. 주입된 중복 창8초, IoU≥.5·중심거리≤70px·명시적ID 중 하나와 key일치를 검사하며 중복 시각/위치를 갱신한다. 같은 불량의 양쪽 기하정보 누락도 중복 처리한다. pending은 dedupe보다 먼저 검사하고 대기 중에는 항상 반환한다. ready=t0+.6초, timestamp≥ready·age≤3초, 누락 timestamp허용·깊이우선·최초ID고정없음. 비전은 이벤트 발행 시 time.time()을 넣으므로 촬영 시각으로 설명하지 않는다. 정지 응답 실패는 자동 차단하지 않는다. 재개는 exit_code=0과 resume 설정을 함께 만족해야 한다. 좌표는 카메라X/Y의 affine m→mm변환이며 완전한3D외부보정이 아니다.
- **Briefit / p14**: Train.py·Evaluate.py `714502c0`, GenerateJson.py `da4ea1b0`. 학습 기사384/labels256토큰, 생성 입력1024·단일 출력상한1024·부분/재요약 출력상한512, beam4·length_penalty1.2. 문단을 더한 뒤 길이를 검사하고 모든 생성에 입력 truncation과 clean_tail을 적용한다. ROUGE는1024→128 raw생성 경로라 부분요약/후처리 결과를 측정하지 않는다. 평가 코드의1024는 문자 슬라이싱이 아닌 토큰ID한도다.
- **MRI / p17**: `3c9a0694` train.py L25·L40·L136, test.py L117. mask>1→5x5 closing/opening→RETR_EXTERNAL/CHAIN_APPROX_SIMPLE→점≥3·윤곽면적≥.001WH→x/W,y/H의 소수6자리 라벨. 작은 병변·내부 구멍 손실, 고정커널의 해상도 의존성을 설명한다. 분류→분할을 독립 입력으로 순차 호출하며 분류 결과에 따른 분할 차단·출력 충돌 보정은 없다. test/val 연결 때문에 독립 평가 완료를 주장하지 않는다.
- **Prompt / p20**: `1972aa05` dimensions/runner.py L29, server/graph_runner.py L40·L93, server/app.py L121. 영역지침→프로젝트→해당history→선택적 새입력. gather로 초기질문병렬·to_thread로 동기invoke실행. 성공후 이력추가, round≥3+태그로 완료, 처리대상오류 시round--·pending. 미완료성공은in_progress유지. 최종합성은 저장결과가 있는 모든영역의 목록(동명이름도포함)이며1개도허용. 실패한수정후 이전결과유지·연결종료시세션삭제.
- **Alkkagi / p23**: `530229c5` server/index.ts L99·L139, physics.ts L26·L79. 입력500ms쿨다운·크기.45B제한·질량1+.05kills로나눔. B600/input(300,400)/m1.5→v(108,144)는 계산예시. 10소단계는p+=.1v·v*=.8^.1·축별절삭·충돌·득점후재배치 순서이며 마지막에전체상태전송. 보드이탈은삭제가아닌재배치다. 겹침절반위치보정 후vn>0이면충격량생략, 그외e=.7·역질량합으로속도갱신.1000/60ms는설정이며초단위dt보정은없다.

각 근거 파일은 해당 PDF 페이지 하단에서 전체 SHA가 포함된 GitHub blob 링크로 연결한다. 세 명의 읽기 전용 검토 결과를 반영해 후보 없는 AQIS 집기, 토큰/문자 혼동, 선택적 Prompt 입력, Alkkagi 이탈 처리 등 축약 오류를 교정했다.
