# Portfolio visual sources and bounded reproduction

## Tech Stack SVG sources — 2026-09-08

The website and PDF share 18 transparent SVGs in `src/assets/tech-stack/`, exported by `scripts/portfolio/export_stack_icons.mjs`. Fifteen brand paths come from the installed Simple Icons package (CC0-1.0); their geometry is unchanged. React, Hugging Face and LangChain use darker fills on the warm paper surface. Transformers is represented by the Hugging Face mark and YOLO by the Ultralytics mark. DYNAMIXEL, WebSocket and asyncio use original functional pictograms, not invented official logos. PDF embedding stays vector-only with searchable separate labels; web icons have empty alt text next to visible technology names. See the adjacent `sources.json` for package version, sources and file hashes. Original architecture sources are untouched.

## Web architecture copies — 2026-09-08

The approved returned PNGs for Briefit, MRI, Prompt and Alkkagi are copied to `src/assets/projects/{briefit,brain-mri,prompt-generator,alkkagi}/architecture.webp` as lossless WebP. All four decode to the exact same RGBA pixels at their original 2400px width; no resampling, redrawing or cropping was performed. Their combined file size is approximately 1.95MB. The web uses lazy loading, original proportions and links to the full-size files. Separate in-progress SVG/Excalidraw/icon changes are excluded.

## Current edition — 2026-09-08 visual engineering and AQIS expansion

The current PDF is 27 pages: introduction 1, Tech Stack 2, index 3, THING 4–8, AQIS 9–14, Briefit 15–17, MRI 18–20, Prompt 21–23, Alkkagi 24–26, contact 27. Original architecture images remain on pages 5/10/16/19/22/25. The five owner-returned RGBA PNGs retain all pixels, alpha, proportions and source hashes; only destination page numbers change in the manifest. All project introductions, source imagery and technical coverage are retained. The latest revision adjusts title size, explanation width, word wrapping, equation emphasis and connector alignment throughout the book. The stack addition preserves the previous 25 non-index page bodies pixel-for-pixel; the index only changes page references.

Pages 6/11/17/20/23/26 use `technical_pages.py` for searchable vectors, timing/length plots, equations and state transitions. The diagrams are explanatory representations, not new camera captures, model outputs or experiments. Each page links to at least three pinned implementation sources. `aqis_pages.py` adds RoboDK and SLAM/URDF pages. Existing raster source imagery is unchanged.

### New AQIS public media

Source: `docs/assets/portfolio/` at AQIS commit `60951747fac753eb521fd80efce3fbade0eda101`. Only the published GIF/PNG derivatives are used; private internal originals are excluded.

| Asset | Source / conversion | SHA-256 |
| --- | --- | --- |
| simulation-demo.gif | Public 10-second source | `42D052FFA71ACA47F9A913485328D2E0DD8967F4A7CB4B06FF3C5718DA6133B6` |
| slam-demo.gif | Public 10-second source | `A3117AC3D670D0CF0DCDA79A37A7FE833977D89211B93CF1D21C893F89739AEA` |
| Web simulation-demo.mp4 | H.264, 720×406, SAR 1:1; 720×405 source padded one bottom pixel | `C75DB0628FE79ACACCA011DE3E3D7D6715E772E742D1E232450AE368E2B9E7CF` |
| Web slam-demo.mp4 | H.264, 720×406; same one-pixel pad | `BFA6A993AF7131491DF33275207CA458BC3048364E9436C8E53F230AB1C38C9E` |
| Web slam-navigation.png | Byte-identical public still | `5F266ADC5289684822FADE2A9E54FA78E28C2C65C22016BAD386EFC76D00A0C5` |
| PDF aqis-simulation.png | RGB pixels of source GIF frame 45; no crop/retouch | `2DF2543B443CD73DF62B4BCCD13EB716B0145006F9A3CF016764E3684CD4542E` |
| PDF aqis-slam.png | Same RGB pixels as public still | `60AC0EDE982E6FCF743EB59BEB6E9CA98B7489B0B3A729B53431A7BD3CF0B466` |

Web videos use native controls, no autoplay, `preload="none"` and the existing offscreen/hidden pause lifecycle. The simulation poster is a WebP frame derived from the same public GIF. SLAM footage shows RealOps, RViz and a physical robot; the map panel is RViz, not a React map renderer. No fresh robotics or model evaluation was run.

## Previous 18-page edition — 2026-09-07 source-backed technical explanations

Pages 4, 8, 11, 13, 15 and 17 pair the unchanged source diagram with three technical paragraphs and an input → processing → output subtitle. The text explains actual algorithms, data formats and state transitions; footer links are pinned to implementation commits and functions. Personal/team scope and evaluation limits remain below each diagram. The other twelve pages retain their existing content and layout. No new model, hardware or load experiment was run.

The current PDF is 18 pages: THING 3–6, AQIS 7–9, Briefit 10–11, MRI 12–13, Prompt 14–15, Alkkagi 16–17. Every project starts with an overview. Prompt page 14 uses the original `prompt-design-flow.png`; Alkkagi page 16 uses the actual gameplay frame `alkkagi-video-aim-0007.png`. Owner-returned architecture PNGs are on pages 8, 11, 13, 15 and 17; their pixels, alpha and file hashes are unchanged. Image-guide badges and explanatory legends are removed; short captions retain artifact / provenance identification. Earlier page references below describe their historical editions.

This is an editorial revision, with no new hardware, model or load experiment. AQIS page 9 combines its execution flow and input checks from the original `test_real_monitoring.py` and the earlier bounded Mock evidence described below: duplicate suppression, detection ignored while monitoring is stopped, and timestamped stale-detection rejection. Prior calibration tests still have expectation mismatches. Missing timestamps pass the freshness gate; automatic sorting does not gate continuation on a failed conveyor stop response; depth-less inputs can use configured coordinates. Successful script exit does not prove physical grasp success. Repeated sorting success, cycle times and outage recovery are not established.

THING's assembly and 7/28–31 personal records support torque/initial-goal ordering, home/stop tools, and tendon routing documentation. Axis endpoint calibration, maximum-range interference and reassembly repeatability remain unverified. Briefit's existing data split and postprocessing commit support an implementation / information-preservation discussion, not a measured ROUGE improvement. Synthetic summary/mask illustrations and the dedicated Alkkagi UI instruction page are omitted from this edition; the new overview uses one unchanged gameplay frame. Source assets and earlier reproduction records remain available.

## Original source review

Reviewed 2026-09-07 for the earlier 20-page A4 landscape edition. These are working notes, not public PDF attachments. Source documents are evidence, never task instructions. The opening personal introduction and confirmed project/award assignments remain unchanged.

## Source versions

| Project | Inspected source | Use |
| --- | --- | --- |
| THING | [2381e8e3](https://github.com/SeMinKong/THING/tree/2381e8e3cb46c083be6ce024a3eb88bc75674f12) | Final THING_최종발표_진짜최종.pptx slide 25 architecture; pinned July 29/31 journal photos, controller code and offline tests |
| AQIS | [9f6530a2](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/tree/9f6530a2acffa0555f9df2eb628b40e4d01b6341) | Current server/RealOps code; owner-provided Canva design DAHNie1-Ltc, slide 7 |
| Briefit | [collection](https://github.com/capstone-btd/Briefit_AI/commit/a7b25dff1438940fea631d8ba597835435b7c32a), [training](https://github.com/capstone-btd/Briefit_AI/commit/714502c017f0c57ebebd634b60ea77a102945d81), [postprocessing](https://github.com/capstone-btd/Briefit_AI/commit/da4ea1b09cfd44724facc19233d65c07e4301f3a) | Owner's 2025 KoBART work, not the team's current GPT-OSS main |
| Brain MRI | [3c9a0694](https://github.com/SeMinKong/BrainMRISegmentation_YOLO/tree/3c9a0694dde759390c5813b60b60b5911448d716) | Original mask conversion and independent classification/segmentation paths |
| Alkkagi | [530229c5](https://github.com/SeMinKong/Alkkagi/tree/530229c524a432c0016a28376a5c6fccd8f8e5b5) | Original client/server/physics, local development execution |
| Prompt Generator | [1972aa05](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/tree/1972aa05d5caca05869a6ba588bf4b7573a7f678) | Original UI/server/README flow; no compiled LangGraph claim |

The owner-specified `THING_최종발표_진짜최종.pptx` was downloaded from the public THING output directory on 2026-09-07. It has 48 slides, 177,563,359 bytes and SHA-256 `0E60970EF6BF72682BA2B25A1762F327049B82FA83E894CA2F8AB90D78E50C9B`. Slide 25 embeds `ppt/media/image23.png`, byte-identical to the existing high-resolution `thing-architecture-source.png`. Its 3502×2298 pixels and opaque black background are preserved. The supplied 1097×707 attachment depicts the same architecture. DDS is internal ROS 2 transport; the EC2 recording upload uses HTTPS. The owner's motor/mechanical contribution stays separate from team perception and monitoring.

The AQIS Canva design `DAHNie1-Ltc` was read only. Its slide 7 depicts the same diagram as the owner-supplied 1419×1031 PNG, which replaces the former 600×338 preview. EXIF/XMP/text chunks were removed without recompressing image data or changing decoded pixels. The original local file remains untouched. The diagram includes expansion plans: TurtleBot SLAM/camera/status monitoring is distinguished from future automatic missions. The PDF links to the public repository; neither signed preview URLs nor Canva editing tokens are published.

## Working asset manifest

Files are under `scripts/portfolio/assets/`. Final PDF placement preserves source proportions. Source images with sensitive metadata are sanitized without recompressing pixels; original THING photos remain only inside an ignored evidence clone. The AQIS working copy is the owner-supplied image with metadata removed, with decoded pixels compared before and after in the same invocation. The PDF separately compresses photographs to JPEG quality 88 and strips their metadata; it does not edit the original THING photos.

| File | Origin / treatment | Working SHA-256 |
| --- | --- | --- |
| thing-architecture-source.png | Original PPTX image, 3502×2298, byte-identical | `FB547330C9067CB146E9C28D9E7C617A765B58C2DDD686FFC46ACAD144050A0E` |
| thing-spool-tendon.jpg | July 31 `spool-tendon-routing-02.jpg`, 4000×3000; only EXIF orientation 3 retained | `43A7DE9CBB589089F4D171F863FFAEDBC04A64509E6CD935F1EA4AF0F33F10A1` |
| thing-acrylic-mount.jpg | July 29 `acrylic-motor-mount-detail.jpg`, 4000×3000; GPS removed, only EXIF orientation 6 retained | `034CBE995DBB540FC6C4C3FFEF8722D22A991CAE16EC791F6E14E69947424F2C` |
| aqis-architecture-source.png | Owner-supplied Canva slide 7 architecture, 1419×1031, embedded in full; metadata removed, pixels unchanged | `234498EAA2A7EF7C00037477A5CDF8672E88C91D0EA715F669C7EE2B97DBC1C3` |
| aqis-local-mock.jpg | Actual local RealOps browser capture, 1280×720; sensors disconnected, STOPPED, status query | `0383DB778CF3A5D5E2EDB28E42242EA5487C684C40735E15754D9E14F4A1B98F` |
| alkkagi-local-play.jpg | Actual local two-client game capture, 774×778, after drag movement | `67462F64F0C57BA8C524E7AC50109C8738D90A5C3B480642746BBDF6480A4EF8` |
| prompt-design-flow.png | Original [README attachment](https://github.com/user-attachments/assets/544fb920-d9ec-48fb-ae9d-02ec5c374bfb), 1184×531, byte-identical | `05DDF8489E9A135F0E73BDF041843B4625799A0BD9C2EEB57F3A3194E4083A06` |
| prompt-local-start.jpg | Actual local UI with empty API-key input, 1280×720; visible key string is a placeholder | `9A9FEDE8C69CBEF51BD565D73915B4A7CD70AB31AA78EA94156E6236F56BFC83` |
| reproduction-evidence.json | Actual Briefit/MRI synthetic-input results, source hashes, counts and mask run-length arrays | `BC263392BAAFF10036D45FD618A7F00E2D7273F6858995A16E583C0FBA998CAC` |
| thing-video-can-0010.jpg | Web-converted grasp video at 00:10, 720×1280, no crop | `43BE65FA9D80F428F39624626C35FB11FA56C702CE275F41C8C97B7785591C78` |
| aqis-video-inspection-0010.jpg | README original at 00:10, 1280×720, no crop | `1F0E000280FB766D251E85E322C14954247A347F5D02241BD1457FB4F9FB62F1` |
| mri-video-overlay-007733.png | Existing demo, frame 232 / 7.733s, 1320×1032, lossless frame export | `694FB29F1C97A33FB34AB9C3E95117EAF25BEAFF5CD8CF4C4B22A62C626BD120` |
| alkkagi-video-aim-0007.png | README original at 00:07, 1276×1270, lossless frame export | `A787166B37C538FAD7BD8BC1DCEF457B48FDD3C9B34A09561B95E935C25C52A4` |

Original pre-sanitization hashes: spool `6F142F8F8D9535BC682AD41D1F9B2A73632A1288CEC8875B40781403C40230A1`; acrylic `22E7FA40452953BC1187C793D2381CEA1C113E826B0C3355D6BC1E966C8159A1`; AQIS preview `371376C13F15A7BAFE625951E33F9F199D0B714F88945C198FF83FE3E078658A`. `sanitize_source_metadata.py` verifies unchanged decoded pixels and dimensions and retains JPEG orientation only. No location values are recorded here.

## Executed scope and limitations

- **THING:** Original offline hand-motion tests: 5 passed using a fake motor SDK. No serial port or physical motor was used. The work photos and grasp demo are historical source evidence, not new hardware runs.
- **AQIS:** Local wrapper disables dotenv, ROS, external HTTP, camera streams and subprocess/hardware launch; all adapters are mock. Original test modules: 26 passed, 2 existing dynamic calibration expectations failed (x 230.258 vs 228.606; with offset 235.258 vs 233.606). HTTP health and eight initial WS event types passed; start requests were blocked with 503. Actual browser received STOPPED state and a keyword status reply. Separate synthetic detection events are test inputs, not vision predictions. Original frontend production build passed. No physical classification/cycle-time claims.
- **Alkkagi:** Original dev client and server ran locally with two actual browser clients. Join, equal state receipt, drag/flick movement and disconnect passed. Standalone physics tests covered overlap (90/110 → 85/115), velocity impulse (10/0 → 1.5/8.5), friction (10 → 8) and 10-point growth (radius 23, mass 1.5). These are smoke/unit checks, not performance benchmarks. The upstream production build still has three existing TypeScript issues (nullable React ref and two unused React imports); none were silently fixed. Only the isolated clone's listener was bound to loopback.
- **Prompt:** Original FastAPI/UI startup, health HTTP 200, six default domains and empty-key HTTP 400 were verified. No key was read or submitted; no external LLM call or generated conversation is shown. The README flow is design intent, not evidence of a compiled LangGraph. Runtime uses domain state, asyncio.gather and LangChain; sessions are deleted on disconnect.
- **Briefit:** Executed original `_clean_tail` against four authored synthetic sentences, including the valid-short-sentence deletion limitation. Original split function produced 16/2/2 from 20 synthetic records twice identically with seed 42. Counted committed JSONL records as 2819/352/353 (total 3524); this is file metadata, not collection coverage/quality. Service generation ends in printed cleaned text; evaluation compares raw generation to references with no `_clean_tail` stage. No news API calls, model download, training or inference. Credential-like source files were not read or copied.
- **MRI:** Executed original `mask_to_polygons` with only image input replaced by a synthetic 64×64 array. Real OpenCV 4.12/NumPy 2.3.5 processing: nonzero 1018 → threshold 1017 → 5×5 closing 1026 → opening 1024, yielding one four-vertex polygon. Page 16 is drawn from recorded run-length arrays, not an AI-created image. No model weights/inference or medical performance claims. The existing demo on page 14 is explicitly labeled historical prediction examples, not this run.

All reproduction services were stopped after capture. Reproduction clones, dependencies and raw logs remain ignored under `tmp/portfolio-visuals/`; they are not web assets. User-owned `tmp/pdfs/skhynix-jd/` files were left untouched.

## README video frame revision (owner approved)

The owner subsequently allowed video frame extraction. Pages 7, 8, 14 and 17 now include selected historical video frames. AQIS and Alkkagi retain separate, explicitly labeled local reproduction thumbnails. All frames preserve the video's dimensions, proportions and visible content without cropping, retouching or compositing. Source footage is not a new hardware/model run. Four external footer links now point to the original videos rather than only the case pages.

| Video | Source and provenance | Local video SHA-256 |
| --- | --- | --- |
| THING can-grasp | README [모방캔파지.mp4](https://github.com/SeMinKong/THING/blob/main/media/videos/모방캔파지.mp4); local `src/assets/projects/thing/demos/can-grasp.mp4`, 2,354,793 bytes, 11.67s. Earlier 2026-08-11 decision records 720×1280 H.264/SDR conversion from HEVC/HLG. Not byte-identical to the 17,835,588-byte LFS original; exact conversion command provenance was not recovered. | `ACEA26CA90CA8040803772EF96797921FF99A079EAAE704DDBB77C2DCF1A36A3` |
| AQIS | [README attachment](https://github.com/user-attachments/assets/70017e3e-594d-43b2-bcef-59bb4a8f0c32); freshly downloaded original matches `src/assets/projects/aqis/process-demo.mp4` byte-for-byte, 34.17s. Source says waiting segments are accelerated; do not derive cycle time from the timestamp. | `571789C66F31953B93A840AEEBF6164265296A4D95FBB00B0A9554B48752129E` |
| MRI | [README attachment](https://github.com/user-attachments/assets/9994b0b3-187b-4c12-bfd3-170f6bb8dda5); local `src/assets/projects/brain-mri/demo.mp4`, 3,644,830 bytes, 51.53s. Remote request returned 403, so byte identity was not reverified. Caption identifies the existing web demo; displayed augmented filename does not establish a BRISC sample. | `8537FB12ADD7524D6059B59AA48A855C5DA46F44E78D35EA3BAF8D69A22DC79F` |
| Alkkagi | [README attachment](https://github.com/user-attachments/assets/20bc9007-97ea-4cc4-948a-e1d901ea8f4b); freshly downloaded original matches `src/assets/projects/alkkagi/demo.mp4` byte-for-byte, 9,386,496 bytes, 11.70s. A viewpoint switch near 5s makes 1s→7s unsuitable as a continuous same-player sequence; only a labeled single frame is used. | `5690C65A46EF9FA46074FFC3468E85EA8167CFA61B6CFCD99BB1EEBB0C355115` |

Frame extraction: FFmpeg 7.1 from the official PyPI `imageio-ffmpeg==0.6.0` wheel in the ignored video-tools folder; seek to 10 or 7 seconds, map only the selected video frame, `-map_metadata -1`, JPEG quality 2 for THING/AQIS or lossless PNG for Alkkagi. MRI uses OpenCV VideoCapture frame 232, lossless PNG. No resizing or color correction was requested during extraction. Working source hashes above record the exact outputs used in the PDF.

Privacy review excluded THING mimic frames with a partial face and MRI's 15.47s file chooser exposing a local path. Selected frames show no identifiable faces, real names, contact information, API keys or patient identifiers. THING has only a hand and a commercial product barcode; MRI only a dataset-style filename. The MRI UI's AI opinion remains loading and is explicitly not presented as a completed/verified feature. Source UI diagnostic language is not a clinical validation claim. Briefit and Prompt READMEs had no usable video links, so their existing evidence visuals remain.

## Readability revision (supersedes viewer-facing provenance labels above)

The owner requested visuals that a first-time reader can understand and explicitly allowed video frames to replace weaker screenshots without separately labeling their medium. The PDF now uses functional captions and numbered editorial annotations; all source hashes, footage provenance and execution limitations above remain authoritative internal records.

- THING p5 replaces the logo-heavy source diagram with a Korean functional flow. The actuators/mechanical connection is highlighted as the owner's scope; perception, arbitration/safety, monitoring and recording remain team work. Jetson records/organizes data and EC2 stores it. P6 enlarges the two work photographs with motor/spool/tendon/mount callouts. P7 makes can-grasp the main image.
- AQIS p8 removes the redundant mock thumbnail and labels inspection region, results/queue and robot/conveyor. P9 uses role-first component names. P10 illustrates why an earlier X1 position must be refreshed after the stop-request wait; it does not claim sensor-confirmed stopping.
- Briefit p12 separates training, service generation and raw-generation evaluation. Dataset counts remain 2819/352/353. P13 is still an authored synthetic sentence executed through the real function, labeled `예시`, not an actual generated article summary.
- MRI p14 displays only the existing comparison panel. It does not expose the loading AI-opinion panel or claim it is complete. P15 shows independent classification/segmentation. P16 uses recorded threshold/close/open matrices and the four-vertex output as an explanatory example, not MRI/model performance.
- Alkkagi p17 removes the tiny local thumbnail and numbers the controlled stone, aiming vector and opponent. P18 shows authoritative server state broadcasting to both browsers. P19 removes Prompt's API-key modal and the English source diagram; a grouped six-domain Korean flow explains implementation rather than pretending to show a generated conversation/document.

PDF-only display regions (normalized against the oriented full source): THING can-grasp `(0.08, 0.25, 0.95, 0.94)`; MRI comparison `(476/1320, 195/1032, 1217/1320, 815/1032)`. ReportLab clips the placed full image, preserving aspect ratio and source bytes. All other images remain full-frame. Number circles and leader arrows are native PDF overlays, not edits to the application UI. The unused source diagrams and local screenshots remain in working assets for traceability; they are not duplicated as tiny reader-facing evidence panels.

## PDF-only owner portrait (2026-09-04)

- The owner selected `공세민_증명사진` from the supplied private Drive folder and subsequently limited its use to the static PDF, not the website. The original is a 1086×1448 PNG, 1,682,635 bytes, with no EXIF or PNG metadata entries. It is placed on page 1 at 180×240pt with no crop or retouching.
- The full-resolution source stays at ignored `.private/portfolio/se-min-kong-profile.png`. It is not a repository asset, website image or separate production download; do not relocate it into `scripts/portfolio/assets`, `src/assets` or `public`. To regenerate the PDF on another authorized machine, obtain the same owner-provided original and place it in that private path. The normal website build does not run the PDF authoring script.

## 2026-09-07 software architecture replacement

Pages 5/9 preserve the owner's THING/AQIS diagrams. Pages 12/15/18/19 use `scripts/portfolio/architecture_diagrams.py`, with transparent Simple Icons brand SVGs and native PDF vectors/searchable text. The same scene definitions export four editable `.excalidraw` files and four self-contained `.svg` files under `scripts/portfolio/assets/architecture/`. Logo source URLs and license are in `icons-source.json`; no remote assets are required to open the scenes. PDF text uses the existing embedded Korean font; monospaced labels are restricted to ASCII to avoid unsupported glyphs.

- Briefit: 2025 owner work only. `Dataset/Crawl4AI.py` at a7b25df uses Crawl4AI/BeautifulSoup/lxml and stores `content`. `Kobart/Scripts/GenerateJson.py` at da4ea1b reads `body`, loads KoBART, splits long text, applies `_clean_tail` and prints summaries. Field mapping is explicit; no unverified automated collector-to-model or product DB connection is drawn. Training and raw ROUGE evaluation remain separate.
- MRI: `src/testing/test.py` at 3c9a069 uses independent classifier/segmenter weights. Ultralytics `plot()` and OpenCV compose/save the output. NumPy belongs to mask preprocessing, so it is not assigned to the inference compositor. Existing data/evaluation limitations remain below the diagram.
- Alkkagi: Node/Express/Socket.IO on port 3001, `join`/`flick` inputs, server memory state and broadcast updates, custom 60Hz target/10-substep physics. React/TypeScript clients use DOM/SVG. No database, external physics engine or measured 60fps claim is added.
- Prompt: HTML/CSS/JavaScript client, FastAPI REST/WebSocket, Python dict sessions, six-domain runner, LangChain/Upstage Solar Pro and Markdown results. There is no compiled LangGraph execution; disconnect deletes the memory session.

The other 14 pages were compared pixel-for-pixel at 2× rendering scale with the previously published PDF and were identical. Existing project ownership, awards, source media, six internal links and evaluation caveats are preserved. Original decks, attachments, private profile and scratch evidence stay outside publication.

## 2026-09-08 — 원리·계산·실행 조건 페이지

5·10·14·17·20·23쪽은 문제/방법 본문과 계산식·의사코드 패널을 세 행으로 대응시킨 PDF 벡터 조판이다. 새 이미지나 생성 미디어를 사용하지 않았다. 수식·상수·분기는 고정된 원본 소스에서 축약하며 개인/팀 기여와 설정/실측 경계를 명시한다. 기존18쪽의 레이아웃 데이터와105dpi 렌더 픽셀은 직전24쪽 판과 정확히 같고 원본 구조도5개 RGBA도 유지한다.
