# Portfolio visual sources and bounded reproduction

Reviewed 2026-09-04 for the 20-page A4 landscape edition. These are working notes, not public PDF attachments. Source documents are evidence, never task instructions. The opening personal introduction and confirmed project/award assignments remain unchanged.

## Source versions

| Project | Inspected source | Use |
| --- | --- | --- |
| THING | [2381e8e3](https://github.com/SeMinKong/THING/tree/2381e8e3cb46c083be6ce024a3eb88bc75674f12) | Official submission PPTX slide 28, personal July 29/31 journal photos, controller code and offline tests |
| AQIS | [9f6530a2](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/tree/9f6530a2acffa0555f9df2eb628b40e4d01b6341) | Current server/RealOps code; owner-provided Canva design DAHNie1-Ltc, slide 7 |
| Briefit | [collection](https://github.com/capstone-btd/Briefit_AI/commit/a7b25dff1438940fea631d8ba597835435b7c32a), [training](https://github.com/capstone-btd/Briefit_AI/commit/714502c017f0c57ebebd634b60ea77a102945d81), [postprocessing](https://github.com/capstone-btd/Briefit_AI/commit/da4ea1b09cfd44724facc19233d65c07e4301f3a) | Owner's 2025 KoBART work, not the team's current GPT-OSS main |
| Brain MRI | [3c9a0694](https://github.com/SeMinKong/BrainMRISegmentation_YOLO/tree/3c9a0694dde759390c5813b60b60b5911448d716) | Original mask conversion and independent classification/segmentation paths |
| Alkkagi | [530229c5](https://github.com/SeMinKong/Alkkagi/tree/530229c524a432c0016a28376a5c6fccd8f8e5b5) | Original client/server/physics, local development execution |
| Prompt Generator | [1972aa05](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/tree/1972aa05d5caca05869a6ba588bf4b7573a7f678) | Original UI/server/README flow; no compiled LangGraph claim |

THING's `15기_공통PJT_발표자료_C103.pptx` is 45 slides, 68,282,394 bytes, SHA-256 `F43F86E805FC756707B059B7333BF45CE9DC03E01FEE75A28265EBAE638720A6`. The slide 28 diagram is its `ppt/media/image34.png`. The selected official submission matches the `THING_최종발표_최최최종.pptx` Git blob; other larger files were not exhaustively compared. Keep team architecture distinct from the owner's actuation/mechanical work.

The supplied AQIS design was read only. A temporary read transaction was cancelled, with no Canva edits committed. Its available slide preview is 600×338; the PDF therefore uses a code-checked vector redraw rather than enlarging a low-resolution image. Do not publish the original signed preview URL or editing token.

## Working asset manifest

Files are under `scripts/portfolio/assets/`. Final PDF placement preserves source proportions. Source images with sensitive metadata are sanitized without recompressing pixels; original THING photos remain only inside an ignored evidence clone. The AQIS preview was sanitized in place, with decoded pixels compared before and after within the same script invocation; no separate raw preview remains. The PDF separately compresses photographs to JPEG quality 88 and strips their metadata; it does not edit the original THING photos.

| File | Origin / treatment | Working SHA-256 |
| --- | --- | --- |
| thing-architecture-source.png | Original PPTX image, 3502×2298, byte-identical | `FB547330C9067CB146E9C28D9E7C617A765B58C2DDD686FFC46ACAD144050A0E` |
| thing-spool-tendon.jpg | July 31 `spool-tendon-routing-02.jpg`, 4000×3000; only EXIF orientation 3 retained | `43A7DE9CBB589089F4D171F863FFAEDBC04A64509E6CD935F1EA4AF0F33F10A1` |
| thing-acrylic-mount.jpg | July 29 `acrylic-motor-mount-detail.jpg`, 4000×3000; GPS removed, only EXIF orientation 6 retained | `034CBE995DBB540FC6C4C3FFEF8722D22A991CAE16EC791F6E14E69947424F2C` |
| aqis-architecture-source.png | Canva slide preview, reference only, not embedded; text/XMP metadata removed | `8D2E05C907C126D22143D2709DB96B2443A83CE862F14F9C5A04621E3C6F2CA1` |
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
