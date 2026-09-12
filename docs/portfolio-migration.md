# Portfolio content migration

2026-09-12. 기존 27쪽 PDF의 상세 기술 내용을 각 프로젝트 저장소에 먼저 반영한 뒤, 9쪽 PDF에서 README와 상세 문서를 직접 연결했다. README는 개요·역할·핵심 구현·실행 방법의 진입점이며 계산식·상태 전이·예외·검증 근거는 같은 저장소의 링크된 기술 문서에서 읽는다.

## 이전 내용의 위치

이전 쪽수는 2026.09.08 공개 PDF(27쪽, SHA-256 `23424C7BCB051CE18A63F00EC28F021F843CED852BF4F53553E800D1E3A38C00`) 기준이다. 새 PDF는 소개(1) → 구현 경험·기술 스택(2) → 프로젝트 여섯 개(3–8) → 상세 문서 안내·연락처(9)다.

| 프로젝트 | 이전 PDF | 새 PDF | README | 상세 기술 문서 | 보존한 내용 |
| --- | --- | --- | --- | --- | --- |
| THING | 3–7 | 3 | [README](https://github.com/SeMinKong/THING/blob/main/README.md) | [구현 설명](https://github.com/SeMinKong/THING/blob/main/docs/engineering-notes.md) | 랜드마크·필터·엔코더·제어 주기, 모터 점검·중앙각 복귀·Torque OFF, 기구 통합과 실물 시험 범위 |
| AQIS | 8–13 | 4 | [README](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/README.md) | [구현 설명](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/blob/main/docs/engineering-notes.md) | 정지 요청 뒤 검출 갱신, 중복 처리·좌표 변환, ROS/asyncio·Mock, RoboDK·SLAM·관제와 정지/파지 확인 한계 |
| Briefit | 14–16 | 5 | [README](https://github.com/capstone-btd/Briefit_AI/blob/main/README.md) | [구현 설명](https://github.com/capstone-btd/Briefit_AI/blob/main/docs/2025-kobart-implementation.md) | 2025 KoBART 수집·학습·생성·평가·후처리 경로, 토큰 설정·부분 요약·재요약과 현재 GPT-OSS 경로 구분 |
| Brain Tumor MRI | 17–19 | 6 | [README](https://github.com/SeMinKong/BrainMRISegmentation_YOLO/blob/main/README.md) | [구현 설명](https://github.com/SeMinKong/BrainMRISegmentation_YOLO/blob/main/DETAILS.md) | mask > 1·형태학 처리·외부 윤곽·polygon, 독립 분류/분할·평가 분리 한계와 과거 보고 점수의 근거 상태 |
| Project Prompt Generator | 20–22 | 7 | [README](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/blob/main/README.md) | [구현 설명](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/blob/main/DETAILS.md) | 비동기 호출·라운드/태그 완료 조건·선택적 복원·부분 합성·연결 종료와 세션 수명 |
| Alkkagi | 23–25 | 8 | [README](https://github.com/SeMinKong/Alkkagi/blob/main/README.md) | [구현 설명](https://github.com/SeMinKong/Alkkagi/blob/main/DETAILS.md) | 입력 제한·질량, 위치 보정·충격량·소단계 마찰, 서버 판정·득점·재배치·60Hz 설정 |

## 반영 기록

각 저장소의 기존 main 트리를 기반으로 문서만 변경했다. 기존 코드·미디어·기여자·실행 경로를 검토했고, 개인 기여와 팀 구현을 분리했다. 기존 영문 문서가 있는 저장소는 함께 갱신했다. 변경은 다음 커밋에 고정되며, 공개 main에서 문서 21개의 내용이 검수본과 동일함을 다시 확인했다.

| 저장소 | 문서 수 | 반영 커밋 |
| --- | --- | --- |
| SeMinKong/THING | 3 | [eb54923](https://github.com/SeMinKong/THING/commit/eb549237f20e86bf7c75cf8401c771124e7f5391) |
| SSAFY-15th-HK/AQIS-for-SmartFactory | 4 | [8210703](https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/commit/8210703771872d7a7e2e6bf200e8dce804492a9b) |
| capstone-btd/Briefit_AI | 2 | [29c0608](https://github.com/capstone-btd/Briefit_AI/commit/29c06082e90a437e080d573ccdc6ca0e7b452c85) |
| SeMinKong/BrainMRISegmentation_YOLO | 4 | [3fcca10](https://github.com/SeMinKong/BrainMRISegmentation_YOLO/commit/3fcca107c0cb77b61d2831e4aacf2d0d03376e04) |
| SeMinKong/ProjectPromptGenerator_LangGraph | 4 | [55885bf](https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/commit/55885bf479c2786de8b299b8d8cf20ca03ac0d88) |
| SeMinKong/Alkkagi | 4 | [a6c4d8e](https://github.com/SeMinKong/Alkkagi/commit/a6c4d8e5dedef5e487871db0abbe701f58ff772c) |

## 검증과 편집 기준

- 원래 포트폴리오의 설명을 현재 코드와 대조해 보존하고, 잘못된 조건·실행 명령·검증 표현은 바로잡았다. 코드가 보여주는 동작을 실제 발생한 장애나 개인의 당시 의사결정으로 새로 만들지 않았다.
- README와 상세 문서 등 Markdown 파일 21개를 Markdown으로 렌더링했고 Mermaid 도식 24개를 Chrome에서 렌더·육안 검수했다. Prompt 상태도의 겹친 전이 라벨은 의미를 유지하며 정리했다.
- Briefit의 과거 KoBART 기여를 현재 GPT-OSS 경로와 구분했다. MRI의 과거 보고 점수는 검증되지 않은 보고치로 상세 문서에 보존하며 새 PDF의 성과로 쓰지 않았다. Alkkagi의 60Hz 설정을 실측 FPS로 표현하지 않았다.
- 팀 로봇 운영 제어와 개인 점검 도구를 구분했다. THING의 이동 명령은 토크 ON 전에 목표값을 기록하지만 별도 토크 토글까지 같은 동작으로 확대하지 않는다. AQIS는 정지 요청과 센서로 확인된 정지를 구분한다.
- 새 하드웨어·모델 학습·임상·부하 실험은 실행하지 않았다. 실제 미디어와 원본 자료는 기존 저장소·웹 상세에서 계속 제공하며 별도 private 원본은 공개하지 않는다.

## 최종 PDF

- 버전: 2026.09.12, A4 가로 9쪽, 4,522,300 bytes.
- SHA-256: `BAE1E4981D34F094133CA4F5DA3FBBEDE2E502951F1E2FC2E079A614E0315747`.
- [공개 다운로드](https://seminkong.github.io/SeMinKong_Web/portfolio/SeMinKong-Portfolio.pdf).
- 제작과 검증: `scripts/portfolio/build_portfolio.py`, `project_pages.py`, `verify_portfolio.py`. 기존 27쪽 제작 자료·실제 이미지·증빙은 Git 이력과 기존 자산에 보존한다.
