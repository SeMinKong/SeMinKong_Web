# Design brief

## 2026-08-10 — Home Hero hand restoration

The Home opening must communicate the portfolio as a browsable body of work, not only an identity statement. The Hero keeps only the role, name, one core statement, and two project actions; the repeated THING system summary is left to Selected Work and the case study. It preserves the animated dexterous-hand graphic as the Hero's signature visual; on mobile the copy stays at the top and the hand occupies the centered lower field indicated in the approved reference. The real THING demonstration appears in the immediately following Featured Selected Work card. The portrait demonstration keeps its native 9:16 composition beside concise project proof, and the shortened Hero lets Selected Work enter with less empty scroll. The About teaser follows the project and capability evidence.

Status: Approved for implementation — 2026-07-14

## Confirmed identity

- Site name: `Se Min Kong`
- Type: 개인 포트폴리오
- Owner: 공세민 / Se Min Kong
- Target role: 개발 직무 전반. Robotics를 우선 선호하지만 AI, Software, 일반 IT 개발 직무도 열어 둔다.
- Language: 한국어를 기본 설명 언어로 사용하고 영어를 역할명, 섹션명, 기술명에 문맥적으로 혼용한다.
- Existing Orbital Studio content: 실험용 플레이스홀더이므로 유지 의무 없음
- Resume source: Google Drive의 `Se Min Kong.docx`, 확인일 2026-07-14
- Public contact: `semin1224@gmail.com`, `github.com/SeMinKong`
- Resume: 다운로드보다 사이트 내부 `/resume/` 페이지에서 읽는 방식을 우선한다.
- Privacy: 일반 사이트 markup에는 전화번호와 생년월일을 노출하지 않는다. 사용자가 제공한 원본 Resume는 예외지만 실제 배포 전 공개 여부를 다시 확인한다.

## Objective

Se Min Kong이 진행해 온 프로젝트와 경험을 설득력 있게 보여주고, 개발자를 찾는 방문자가 역량과 관심 분야를 이해한 뒤 협업 또는 채용 연락을 보내도록 만든다.

사이트는 단순한 모션 데모가 아니라 다음 질문에 답해야 한다.

- 어떤 문제를 어떤 범위까지 직접 해결했는가?
- AI, 컴퓨터 비전, 로봇, 백엔드, 인터페이스를 어떻게 하나의 시스템으로 연결했는가?
- Robotics가 아닌 일반 Software / IT 팀에서도 어떤 기여를 기대할 수 있는가?
- 결과를 신뢰할 수 있는 역할, 산출물, 수치, 링크가 있는가?

## Core audience

### Primary

- Robotics, AI, Computer Vision, Software 직무의 채용 담당자와 기술 면접관
- 작은 팀에서 하드웨어와 소프트웨어 사이를 연결할 개발자를 찾는 기술 리드 또는 창업자

### Secondary

- 일반 IT / Software 개발자를 찾는 팀
- AI·로보틱스 프로젝트의 기술 협업자를 찾는 사람

Robotics 선호를 첫인상으로 분명히 하되, 지나치게 좁은 전문가처럼 보이지 않도록 end-to-end software 역량을 프로젝트로 증명한다.

## Core message

추천 핵심 문장:

> AI가 인식한 것을 실제 시스템의 움직임으로 연결하는 개발자.

추천 영문 보조 문장:

> Software developer connecting perception, software, and physical action.

Hero 첫 상태에서는 5초 안에 이름·역할·행동이 보여야 하고, 기술 범위는 pinned 문장의 system path와 바로 이어지는 AQIS에서 구체화한다.

- 이름: Se Min Kong
- 역할: AI & Robotics Software Developer
- 범위: Perception → Decision → Physical Action → Interface, 이후 AQIS에서 Computer Vision·ROS 2·Backend·Hardware Integration을 증명
- 행동: 대표 프로젝트 보기 또는 연락하기

`Physical AI`는 이미 확립된 전문 자격처럼 과장하지 않고, 실제 AQIS 경험에서 출발한 관심과 다음 성장 방향으로 표현한다.

## Evidence from resume

### 1. THING Human-Mimetic Robot Hand — flagship

- Role: Team project. 공개 저장소 문서에 개인별 역할 분담이 없어 세부 직책은 표기하지 않는다.
- Stack: ROS 2, MediaPipe Hands, OpenCV, Jetson, Raspberry Pi 5, DYNAMIXEL XL330, React, Django, AWS EC2
- Story: 21개 손 landmark를 엄지 3축과 네 손가락 4축의 7축 명령으로 변환해 텐던 로봇 핸드를 실시간 구동하고, 안전 제어·관제·실험 데이터 기록까지 연결한 시스템
- Portfolio value: perception → guarded command → physical action → observability와 data까지 연결한 가장 최근의 end-to-end robotics 사례
- Public evidence: 공개 GitHub 저장소의 최종 시연 영상, 통합 텐던 핸드 사진, Jetson·MediaPipe 시험 사진을 사용한다. 제어 경로는 별도 합성 그래픽 없이 본문의 `Perception → Retargeting → Safe actuation → Observability` 텍스트로 설명한다.

### 2. AQIS for Smart Factory — robot integration case

- Role: Team Lead, Full-Stack & Robot Integration, 2인 팀
- Stack: ROS 2, FastAPI, WebSocket, React, RealSense, Dobot, YOLOv5
- Story: RealSense와 YOLOv5 검사 결과가 컨베이어 정지와 Dobot 진공 pick-and-place로 이어지는 스마트 팩토리 시스템
- Contribution: RealOps dashboard, REST/WebSocket 서비스, ROS 2 bridge, device adapters, LLM command integration
- Portfolio value: AI 인식부터 물리적 행동과 운영 UI까지 연결한 가장 강한 대표 사례

### 3. Brain Tumor MRI Classification & Segmentation

- Role: Personal project
- Stack: Python, PyTorch, YOLO11, OpenCV, NumPy
- Result in resume: Top-1 99.4%, Mask mAP50 92.7%
- Portfolio value: Computer Vision 모델링, 데이터 변환, 정량 결과를 보여주는 사례
- Verification needed: dataset, split, evaluation method, leakage control, reproducible result context

### 4. Alkkagi.io

- Role: Personal project
- Stack: React 19, TypeScript, Node.js, Express, Socket.io
- Contribution: server-authoritative 60 FPS physics, collision, friction, momentum, correction, dynamic mass/radius
- Portfolio value: Robotics 밖에서도 실시간 시스템과 full-stack 구현이 가능함을 보여주는 사례

### 5. Briefit

- Role: Team AI Engineer
- Stack: Python, aiohttp, BeautifulSoup, Transformers, KoBART
- Contribution: 비동기 다중 뉴스 수집, 유사도 그룹화, 중립 요약 실험
- Portfolio value: NLP와 데이터 파이프라인 경험을 보완하는 사례
- Verification needed: team size, 처리 규모, 평가 또는 사용자 결과

### Experience and credentials

- SSAFY Robotics Track trainee, Jan 2026–Present
- Soongsil University, B.Eng. in Software, AI & Big Data 관련 전공, Feb 2026 졸업
- 2025 IT Project Pro League Encouragement Award
- Software Competition Gold Prize — 날짜와 연결 프로젝트 확인 필요
- Capstone Design Competition Encouragement Award — 날짜와 연결 프로젝트 확인 필요
- OPIc IH, valid through Oct 2027

GPA, 초·중학교, 군 복무 상세는 메인 페이지에서 강조하지 않는다. 필요한 경우 이력서 또는 압축된 타임라인에서만 제공한다.

## Working positioning

주 역할 라벨은 `AI & Robotics Software Developer`로 사용한다. 일반 개발 직무 확장성을 설명할 때는 `End-to-End Software Engineer` 또는 `Software Developer`를 보조 표현으로 사용한다.

관심사를 나열하기보다 아래 한 흐름으로 역량을 설명한다.

`Perception → Decision → Physical Action → Interface`

이 흐름은 THING의 손동작 인식·안전 제어·텐던 구동·관제 구조를 대표 사례로 하고, AQIS와 다른 프로젝트에서 각 단계가 어떻게 달라지는지 보여준다.

## Confirmed content structure

사이트는 한 문서에 모든 설명을 쌓지 않고 정적 멀티페이지로 구성한다.

1. `/` — Home
   - 이름, 역할, 한 문장, Name-first scroll Hero
   - THING을 최우선 대표 작업으로 두고 AQIS, Brain Tumor MRI를 이어 보여준다.
   - 공개 저장소의 실제 최종 시연 영상을 원본 9:16 비율의 preview로 사용하고, 구조는 읽기 쉬운 텍스트 흐름으로 설명한다.
   - 짧은 소개 teaser와 이메일·GitHub·Resume를 모은 Contact 정보 패널을 둔다.
2. `/work/` — Work index
   - 공개 근거가 있는 프로젝트 전체를 이미지 중심으로 비교한다.
   - 역할과 한 문장 외의 구현 설명은 상세 페이지로 이동한다.
3. `/work/thing/` — 21 landmark → 7축 command → 안전 제어 → 텐던 구동 → 기록으로 이어지는 구조와 저장소 접근 범위
4. `/work/aqis/` — 실제 로봇 구동 영상, RealOps 화면, 역할, 구현 범위, 결과, 팀 저장소
5. `/work/brain-tumor-mri/` — 실제 분류 화면과 통합 데모 영상, 내부 평가 수치와 검증 범위, 저장소
6. `/work/alkkagi/` — 실제 플레이 영상, server-authoritative 60 FPS 구현, 저장소
7. `/work/briefit/` — 공식 팀 제품 이미지와 AI 담당 범위를 분리해 표시하고 팀 저장소에 연결
8. `/work/project-prompt-generator/` — 실제 LangGraph 흐름도, 구현 구조, 라이브 데모와 저장소
9. `/about/` — 프로필 사실, 개발 관점, 작업 방식, 현재 학습 범위와 기술
10. `/resume/` — 경력, 교육, 기술, 수상, 프로젝트 링크와 원본 Resume 미리보기·다운로드

About은 별도 페이지로 제공하고 Contact는 Home의 정보 패널로 유지한다. backend 없는 별도 Contact form/page는 만들지 않는다.

## Resume experience

- Hero 영역 상단의 고정 내비게이션과 Contact에 `Resume / 이력서 보기` 링크를 제공한다.
- 링크는 별도 내부 경로 `/resume/`로 이동한다.
- 브라우저에서 바로 읽을 수 있는 반응형 HTML 이력서로 구성한다.
- 프로젝트, 경력, 교육, 기술, 수상 정보를 본문과 동일한 사실 기준으로 유지한다.
- 문서 다운로드를 주 행동으로 강조하지 않는다.
- Resume 페이지에는 포트폴리오로 돌아가는 명확한 링크와 이메일·GitHub 연락 경로를 둔다.

실제 추가 콘텐츠가 생기기 전까지 별도 `Experiments / Lab` 섹션은 만들지 않는다.

## Language strategy

- English: 이름, 역할명, 내비게이션, 섹션 제목, 기술 스택, 짧은 상태 라벨
- Korean: 프로젝트 맥락, 문제, 본인 기여, 결과, 자기소개
- 같은 문장을 한국어와 영어로 모두 반복하지 않는다.
- CTA는 용도가 즉시 이해되도록 `프로젝트 보기`, `Contact`처럼 짧게 사용한다.

## Confirmed visual direction — Name to Action

기존 `Signal to Action`의 시스템 흐름을 유지하되, 포트폴리오의 주인과 대표 작업이 먼저 기억되는 `Name to Action` 방향으로 정리한다.

- 밝은 off-white 바탕, near-black 텍스트, cobalt blue 중심 신호색, 제한적인 signal green
- 넓은 여백, 강한 타이포 위계, 얇은 측정선과 명확한 grid
- 첫 화면은 장식보다 큰 `SeMinKong` 워드마크가 지배하고, 스크롤 문장은 한 줄씩 누적해 핵심 메시지를 각인한다.
- 이름만 display scale의 최상위로 두고 AQIS·프로젝트·About·Contact 제목은 한 단계씩 작게 제한해 모든 섹션이 Hero처럼 보이지 않게 한다.
- 기준 type scale은 이름 최대 128px, AQIS wordmark 최대 152px, 일반 section 제목 최대 96px, 프로젝트 제목 최대 104px 범위로 유지한다.
- 장식용 우주·네온 대신 센서 입력, 처리 경로, 좌표, 상태 변화의 시각 언어
- Home과 Work index는 실제 화면이 큰 비중을 차지하는 preview로 구성하고, 상세 설명은 각 프로젝트 페이지에서만 제공한다.
- 상세 페이지는 AQIS dark industrial, MRI icy clinical, Alkkagi cobalt kinetic, Briefit light editorial처럼 첫 장면을 구분하되 타이포 위계와 grid는 일관되게 유지한다.
- 깔끔한 기본 화면 위에 스크롤할 때 구조가 조립되고 상태가 변하는 역동성을 추가
- 3D 런타임 대신 깊이 차, perspective, mask, blur, scale을 사용하는 2.5D

분위기 우선순위는 `깔끔함 → 기술적 정밀함 → 역동성 → 미래지향성`이다. 차갑거나 복잡한 HUD, 과한 네온, 게임 UI처럼 보이는 연출은 피한다.

## Existing elements

### Keep and reinterpret

- Anime.js 모션 엔진
- Motion 및 Depth 접근성 상태
- 부드러운 2.5D 감쇠와 포인터 반응
- 동적인 화면 전환과 스크롤 액션
- 실제 프로젝트 상태와 연결할 수 있는 신호, 파형, 경로 표현

### Remove or reduce

- Orbital Studio 브랜드와 복수형 카피
- 가상 프로젝트 Echo / Near Far / Common Frequency
- 무작위 배경 파티클과 의미 없는 궤도 수치
- 키네틱 티커의 상시 반복
- Contact 커서 트레일
- 과한 카드 tilt와 커서 halo
- 데스크톱에서 정보 탐색을 방해하는 가로 드래그 중심 구조

## Must be original

- Sunny Patel의 카피, 레트로 컴퓨터, 색상 조합, 레이아웃, 프로젝트 카드 외형을 복제하지 않는다.
- 기존 Orbital의 가상 스튜디오 카피를 실제 정보처럼 사용하지 않는다.
- AI·로봇·Physical AI를 흔한 회로 패턴이나 무의미한 네온 장식만으로 표현하지 않는다.
- 실제 3D보다 목적이 있는 2.5D 레이어와 Anime.js 동작을 우선한다.

## Content follow-ups for richer case studies

- AQIS에서 본인이 직접 작성한 범위와 팀원의 범위, LLM 명령 기능의 완성 수준, 공개 가능한 성능 수치는 무엇인가?
- Brain Tumor의 데이터셋, train/validation/test 방식과 결과 평가 맥락은 무엇인가?
- Software Competition Gold Prize와 Capstone 수상의 날짜, 프로젝트, 주최 기관은 무엇인가?
- 공개 이름은 `Se Min Kong`으로 띄어 쓴다. GitHub 계정·저장소 URL·파일명 같은 기술 식별자는 기존 `SeMinKong`을 유지한다.

확인된 공개 자료:

- AQIS 팀 저장소와 실제 구동 영상·RealOps 화면
- Brain MRI classification·segmentation 개인 저장소와 실제 웹 데모
- Alkkagi 개인 저장소와 실제 플레이 영상
- Briefit 공식 팀 프로필·AI 저장소·제품 이미지
- Project Prompt Generator 저장소·흐름도·라이브 데모

## Acceptance criteria

- 첫 화면에서 5초 안에 이름, 선호 직무, AI·Robotics 중심 역량을 이해할 수 있다.
- 첫 화면의 명시적인 CTA에서 THING 상세 또는 전체 프로젝트 목록으로 바로 이동할 수 있다.
- 고정 내비게이션은 스크롤 방향과 관계없이 계속 보이고, Home 카드와 Work row 전체가 하나의 명확한 프로젝트 링크로 동작한다.
- THING을 통해 `인식 → 안전한 명령 → 물리적 행동 → 관제·데이터` 역량을 확인할 수 있다.
- AQIS를 통해 Computer Vision, backend, 로봇 통합 역량을 추가로 확인할 수 있다.
- 나머지 프로젝트가 Computer Vision, NLP, real-time full-stack 역량의 폭을 증명한다.
- 네 프로젝트 chapter는 배경, 색, 조형 언어가 구분되지만 하나의 포트폴리오로 읽힌다.
- 한국어와 영어가 장식적으로 섞이지 않고 각각 명확한 역할을 가진다.
- 레퍼런스 및 기존 Orbital 데모와 시각적으로 명확히 구분된다.
- 장식 모션마다 정보 전달 또는 피드백 목적이 있다.
- 모바일과 키보드 환경에서도 주요 콘텐츠와 연락 CTA를 사용할 수 있다.
- 일반 HTML markup에는 전화번호와 생년월일이 없다. 요청받은 원본 Resume asset은 예외이며 배포 전에 공개 여부를 확인한다.
- `Resume / 이력서 보기` 링크가 `/resume/`로 이동하고 390px에서도 별도 다운로드 없이 읽을 수 있다.

## 2026-07-14 — 레퍼런스 재검토 후 편집 디자인 정리

이 항목은 앞서 정한 과대형 제목 범위와 긴 Hero 연출 값을 대체한다. Sunny Patel의 사이트는 카피, 색, 자산, 레이아웃을 복제하지 않고 다음 원칙만 참고한다.

- 큰 제목 하나, 짧은 본문 하나, 실제 결과물 하나가 한 화면에서 명확한 우선순위를 갖는다.
- 제목의 크기보다 본문 폭, 메타 정보, 이미지 비율, 섹션 간격을 일정하게 관리해 읽는 리듬을 만든다.
- Home은 `Hero → Selected Work → Focus → Current → Contact` 순서로 짧게 읽히고, 세부 설명은 Work와 각 case study로 넘긴다.
- Work index는 동일한 카드 묶음 대신 프로젝트 번호, 제목, 역할, 한 줄 결과, 실제 미디어를 갖는 편집형 목록으로 구성한다.
- Case study는 `Context → My role → Decisions → Evidence → Outcome`의 공통 정보 구조를 사용하되 프로젝트별 강조색과 미디어 비율을 다르게 둔다.
- Resume는 상세 페이지를 반복하지 않고 경험, 역할, 결과를 한두 문장으로 압축한다.

### Typography

- Latin display: Manrope Variable
- Korean body: Noto Sans KR Variable
- Metadata and technical labels: JetBrains Mono Variable
- Hero name: `clamp(3.1rem, 6vw, 4.75rem)`
- Hero statement: `clamp(2.2rem, 4.8vw, 4rem)`
- Section heading: `clamp(1.9rem, 3.4vw, 2.75rem)`
- Case title: `clamp(2.8rem, 5vw, 3.9rem)`
- Body: 16–18px, line-height 1.6–1.75
- Metadata: 12–13px. 10px 이하의 장식용 설명 문구는 사용하지 않는다.

### Visual system

- 배경은 green-black에 가까운 graphite, 본문은 따뜻한 off-white, 강조색은 signal lime과 제한적인 cool cyan을 사용한다.
- 카드처럼 분리된 박스를 반복하기보다 hairline, 여백, 정렬, 큰 실제 미디어로 구획을 만든다.
- 실제 대시보드와 데모 화면은 상세 페이지에서 `contain`을 우선해 정보가 잘리지 않게 한다.
- Home 첫 화면에서 이름과 핵심 문장 옆에 AQIS 실제 화면을 배치해 역량의 증거가 즉시 보이게 한다.
- 레퍼런스의 graphite/ember 조합, 문구, terminal 장식, 3D PC, 동일한 카드 형태는 사용하지 않는다.

## 2026-07-14 — Identity-first Hero와 Perception Core

이 항목은 위의 `AQIS 실제 화면이 함께 보이는 Hero`와 `Hero → Selected Work → Focus → Current` 순서를 대체한다.

- Home은 `Hero → About / Now → Selected Work → Focus → Contact` 순서로 읽힌다.
- 첫 화면은 프로젝트를 먼저 설명하지 않고 `SeMinKong`, 역할, 어떤 시스템을 만들고 싶은 사람인지에 집중한다.
- Hero 핵심 문장은 `모델을 만드는 데서 멈추지 않고, 실제 장치가 움직이는 순간까지 구현합니다.`로 사용한다.
- Hero 본문은 Computer Vision과 ROS 2를 공부하는 현재 위치, software와 hardware가 만나는 Robotics와 Physical AI로 넓히는 관심을 한 문장으로 설명한다.
- AQIS 실제 화면은 첫 viewport에서 제외하되 `Selected Work`의 첫 프로젝트로 계속 가장 크게 노출한다.
- 빈 자리는 실제 제품을 가장하지 않는 추상 2.5D `Perception Core`로 채운다. 중앙 lens는 인식, 중간 처리 ring은 software, 바깥 gimbal은 physical action을 뜻한다.
- Core는 장식 요소로 `aria-hidden` 처리하며, 같은 의미를 About과 Focus의 실제 텍스트로 다시 제공한다.
- 작은 HUD 문구나 임의의 성능 수치를 추가하지 않는다. Core 주변 텍스트는 세 단계 범례만 남긴다.
- About은 전공, 현재 SSAFY Robotics Track, 선호하는 시스템 범위와 개발 직무를 두 문단과 세 개의 사실 행으로 정리한다.

### Updated Hero acceptance

- 5초 안에 이름, `AI & Robotics Software Developer`, Robotics / Physical AI 관심을 이해할 수 있다.
- 이름이 가장 큰 타이포그래피로 남고 문장, Core, CTA가 이름과 경쟁하지 않는다.
- 스크롤 전에도 이름과 CTA가 읽히며, 스크롤하는 동안 문장과 Core가 완성된 뒤 About으로 자연스럽게 이어진다.
- 2.5D 객체는 프로젝트 증거를 대신하지 않으며, 실제 작업물은 바로 다음 정보 구간의 `Selected Work`에서 확인할 수 있다.

## 2026-07-14 — About, Contact, Resume 정보 구조 override

- 전체 route는 `Home · Work · About · Resume · five case studies`로 구성한다.
- Home 상단 내비게이션은 Work, About, Resume만 노출하고 Email은 Contact 패널 내부 정보로 이동한다.
- Home의 About / Now는 짧은 teaser로 유지하고 `/about/`에서 프로필 사실, 개발 관점, 작업 방식, 현재 학습 범위와 기술을 상세히 설명한다.
- About은 참고 사이트의 구체적인 레이아웃·문구·자산을 복제하지 않고, 큰 제목과 짧은 프로필 facts, 읽기 쉬운 narrative라는 편집 원칙만 사용한다.
- Contact는 form 제출 기능을 가장하지 않는다. 이메일, GitHub, Resume, Seoul 위치를 하나의 정보 패널로 제공한다.
- Resume는 현재 HTML 내용을 계속 먼저 읽을 수 있고, 바로 이어지는 `Original Resume`에서 PDF 다운로드, 새 탭 보기, DOCX 다운로드, page image 미리보기를 제공한다.
- 원본 Resume에는 전화번호와 생년월일이 포함된다. 이는 사용자가 제공한 원본을 공개하라는 명시적 요청에 따른 예외이며, 배포 전 privacy 확인 항목으로 남긴다.

### Hero statement sizing override

- `모델을 만드는 데서 멈추지 않고, 실제 장치가 움직이는 순간까지 구현합니다.`는 1280px과 768px에서 한 줄로 보이도록 display 크기를 줄인다.
- 390px에서는 본문 가독성과 가로 overflow 방지를 우선해 자연스러운 두 줄을 허용한다.

## 2026-07-14 — Dexterous robotic hand Hero visual override

이 항목은 위의 `Perception Core` 시각 객체에 관한 결정을 대체한다. Hero의 identity-first 정보 구조와 실제 프로젝트를 `Selected Work`에서 보여 주는 원칙은 유지한다.

- 오른쪽 객체는 사람의 해부학적 뼈손이 아니라 Dactyl / Shadow Dexterous Hand 계열에서 원리를 가져온 열린 다관절 로봇 손이다. 레퍼런스의 정확한 제품 외형, 글자 큐브, 색 배치는 복제하지 않는다.
- 손가락은 좁은 금속 링크, 독립된 원형 피벗, 어두운 볼트, 노출된 signal lime / cool cyan 케이블로 구성한다. 손바닥은 골격 덩어리가 아니라 열린 rail과 plate 구조로 읽혀야 한다.
- 손목 뒤에는 짧은 actuator housing과 coupler를 두되 손가락의 링크와 관절을 가리는 큰 외장 커버는 사용하지 않는다.
- 불투명한 정육면체는 손바닥 위에 따로 떠 있지 않고 엄지·검지·중지·약지 사이에 잡힌다. 앞 손가락, 큐브, 뒤 손가락의 depth band를 나눠 실제 grasp occlusion을 만든다.
- 큐브 면에는 레퍼런스의 문자나 로고를 넣지 않고 portfolio palette의 lime, cyan, deep green만 사용한다.
- 별도의 HUD, 범례, 성능 수치, 조작 안내 문구는 추가하지 않는다. 객체 자체가 Robotics와 Physical AI에 대한 관심을 보여 주는 시각적 서명이어야 한다.
- 객체 전체는 장식 요소로 `aria-hidden` 처리한다. 의미와 경력 정보는 Hero, About, Focus의 실제 텍스트로 전달한다.
- Three.js나 외부 3D 모델을 추가하지 않고 DOM, CSS 3D, Anime.js로 만든 가벼운 2.5D 객체를 유지한다.

### Updated visual acceptance

- 1280px에서는 다섯 손가락의 링크와 원형 관절, 케이블, palm frame, actuator housing, 불투명 큐브가 한눈에 구분된다.
- 768px와 390px에서는 같은 실루엣을 유지하되 장면 전체를 축소하며 Hero 문구나 CTA를 침범하지 않는다.
- 큐브는 스크롤 위치와 무관하게 손 안에서 계속 방향을 바꾸고, 손가락들은 접촉을 교대해 실제 manipulation loop처럼 보인다.
- fine pointer 환경에서는 큐브 근처의 마우스 이동과 손/큐브 누르기에 반응하지만, 이 반응이 페이지 세로 스크롤을 가로채지 않는다.

## 2026-07-14 - Dexterous hand exterior refinement

This refinement replaces the earlier detail-first mechanical treatment with a silhouette-first product render.

- The hand must read as five distinct digits, a tapered palm, a wrist, and a forearm before any fastener or tendon detail is noticed.
- Palm mass is reduced and tapered toward the wrist; the four MCP roots form a visible fan instead of a vertical pile of bearings.
- One compact bearing is used at each joint boundary. Duplicate pulleys, stacked bearing rings, and floating fingertip pads are excluded.
- Large shell surfaces carry roughly 70% of the visual weight, articulated structure 25%, and lime/cyan accents no more than 5%.
- Four shallow metacarpal channels connect the finger roots to the palm without turning the surface into a HUD or exposed exoskeleton.
- Desktop presents the object as a 3/4 product render. Tablet and mobile keep the same silhouette while hiding secondary palm channels and surface detail.

Visual acceptance: at 1280px every digit and fingertip must be separately readable; at 768px and 390px the object must remain recognizable without covering the name, statement, or CTA.

## 2026-07-14 — Hand-only Hero composition override

This direction replaces the forearm requirement in the previous hand silhouette decisions.

- Remove the lower forearm shell from the Hero object. Keep only the five digits, tapered palm, and a compact wrist coupler so the object reads as a robotic hand rather than a full arm.
- Recenter and enlarge the remaining hand to use the space released by the forearm at desktop, tablet, and mobile sizes.
- Place the cube over the palm surface instead of behind the hand. The palm stays behind the cube while the thumb and index contact regions remain in front to preserve grasp occlusion.
- Keep the cube within the palm footprint during both the autonomous manipulation loop and pointer interaction.
- Fine-pointer environments may expose a grab cursor and direct cube drag, but no instruction HUD or focusable decorative control is added.

Visual acceptance: the hand-only silhouette is balanced in the right side of the Hero at 1280px, remains clearly readable at 768px and 390px, and the cube consistently appears supported by the palm rather than detached behind it.

## 2026-08-11 — Evidence-led editorial system override

- Home의 첫 위계는 role status, large name, two-line value statement, primary THING action, text-level all-project action, signature hand 순서다.
- Home의 본문은 01 Selected Work, 02 Focus, 03 Current, 04 Contact 번호 체계를 사용한다. 각 구간은 큰 제목 하나, 명확한 근거, 한 개의 다음 행동을 우선한다.
- Selected Work의 THING은 native 9:16 시연을 자르지 않고 세 수치 proof와 병치한다. 다른 project preview는 자체 metadata rail을 가진 16:10 evidence window로 표시하되 실제 UI screenshot을 덮는 장식은 최소화한다.
- Work index는 큰 archive title 뒤에 line-separated rows가 바로 이어져야 한다. 첫 THING row는 더 큰 portrait media와 21 / 7 / ROS 2 proof를 사용하고, 모든 row는 project detail로 향하는 하나의 stretched link만 유지한다.
- THING case 첫 구간은 제목, short summary, three actions, four verified facts, full portrait demonstration을 동시에 이해할 수 있는 2-column evidence Hero다. 작은 화면에서는 이 순서대로 한 열로 쌓는다.
- THING body는 narrative main column과 public evidence aside를 사용한다. aside는 공개 저장소로 연결하며 공개 근거가 없는 개인 역할이나 성과 수치를 만들지 않는다.
- Contact는 signal lime full-width ending으로 사용해 페이지의 마지막 행동을 분명히 하되 form처럼 보이는 장식은 추가하지 않는다.
- 이 방향은 참고 사이트의 branding, CRT effect, 구체적 composition, copy, asset을 복제하지 않고 typography scale, evidence framing, numbered hierarchy, hairline rhythm 원칙만 현재 portfolio identity로 번역한다.

## 2026-08-11 — THING visible demonstration override

- THING Hero의 첫 영상은 사람 손과 로봇 손을 동시에 보여 주어 입력과 결과를 설명 없이도 비교할 수 있어야 한다.
- Context 다음에는 motion range, finger wave, rigid grasp, soft grasp 네 장면을 동일한 9:16 evidence frame으로 보여 준다. desktop과 tablet은 2열, 600px 이하는 1열이다.
- 각 장면은 poster, 짧은 행동 중심 제목, 화면에서 확인되는 결과 설명, 재생 길이를 갖는다. 기술명과 시스템 구성은 뒤의 System path와 evidence aside에 남긴다.
- 장면 frame은 native video controls를 존중하며 overlay는 작은 순번만 사용한다. 별도 play 장식, autoplay, depth tilt, hover crop은 추가하지 않는다.
- 공개 원본 전체 목록으로 가는 링크를 유지해 네 장면 밖의 추가 시연도 확인할 수 있게 한다.

## 2026-07-14 — Hand 2.5D depth refinement

- Desktop presents the hand from a restrained 3/4 angle with a shorter hand-specific perspective than the rest of the page.
- The palm and finger links use visible back slabs, side walls, directional highlights, and contact shadows so the object reads as a layered mechanical volume rather than a flat illustration.
- Each digit occupies a slightly different depth band and yaw angle while the thumb keeps the highest contact layer above the cube.
- The floating cube carries a soft projected shadow toward the palm to make its height legible without adding another object or a full 3D renderer.
- Tablet and mobile relax the perspective and reduce side-wall/shadow contrast while preserving the same hand-only silhouette.

Visual acceptance: depth is clearly visible at 1280px, remains clean at 768px and 390px, and never changes the cube's elevated position or the thumb-over-cube occlusion.

## 2026-07-14 — Tapered palm chassis refinement

- The palm flares toward the four finger roots and narrows toward the wrist instead of ending as a wide rounded block.
- Front, back, and side shells share a sharper tapered outline, with corner radii and side-wall offsets reduced so the volume reads as machined structure rather than padding.
- A graphite center recess and stronger metacarpal rails divide the bright front plate into smaller mechanical zones on desktop.
- Tablet and mobile may hide the center recess, but must retain the tapered silhouette and thinner side wall.

Visual acceptance: the palm remains large enough to support the cube, but its wrist-side mass is visibly narrower at 1280px, 768px, and 390px. Finger roots, thumb saddle, wrist, and cube remain separate at a glance.

## 2026-08-11 — Staged Home Hero hierarchy

- The Home Hero begins with the `SeMinKong` name as its only visible copy while retaining the signature hand as the visual anchor. The two-column pair stays optically centered inside the shared page grid rather than centering each silhouette independently.
- Scrolling reveals the role, the two value-statement lines, and the Projects/About actions in that order; each stage accumulates rather than replacing the previous one.
- The existing hand geometry, responsive rig offsets, and manipulation loop remain unchanged. Only the free outer identity and hand wrappers move slightly upward as the hidden copy becomes visible.
- Hero action labels use a stronger 650 weight and a responsive 14–15px size, while the primary/secondary contrast remains unchanged.
- The complete semantic copy always remains in the document. Keyboard use, reduced motion, and failed enhancement expose the full final state immediately.

## 2026-08-14 — Modern system deck override

- 전역 색상은 `#090a10` midnight background, `#151824` surface, `#7c8cff` signal, `#62ded3` cyan, `#b18cff` violet을 기준으로 한다. lime은 더 이상 브랜드 signal로 사용하지 않는다.
- Manrope는 navigation, button, title, CTA를 담당하고 JetBrains Mono는 번호, 연도, 기술값 같은 짧은 metadata에만 사용한다. 작은 metadata는 약 12px 아래로 줄이지 않는다.
- Home의 대표 프로젝트는 실제 미디어 → 역할·연도 → 제목 → 두 줄 요약 → 두 가지 근거 → Case study 순서의 동일한 evidence card 세 장으로 구성한다.
- 접힌 카드의 노출 edge에는 번호와 프로젝트명만 남기고, 펼침 여부와 관계없이 카드의 핵심 정보는 DOM과 keyboard 순서에 항상 존재해야 한다.
- desktop의 stack은 signature interaction 하나로 제한한다. Focus는 세 개의 차분한 surface card, Current는 하나의 bordered panel, Contact는 cobalt-cyan의 강한 editorial ending으로 사용한다.
- 721–960px은 정적 2열과 가운데 정렬된 마지막 카드, 720px 이하는 정적 1열이다. Work index와 case study는 카드 덱을 반복하지 않고 기존 evidence-led editorial 구조를 유지한다.
- 실제 프로젝트 asset만 사용하며 hologram, game stat, Pokémon branding, 과도한 tilt·glow·glass 반복은 사용하지 않는다.

## 2026-08-14 — Contemporary gallery visual override

이 항목은 `Modern system deck`의 색·재질·표면 결정을 대체한다. 정보 구조, 단계형 Hero, 로봇 손, 프로젝트 덱의 stack/spread 동작과 정적 fallback은 유지한다.

- 전체 경험은 `검은 전시장 → 웜 아이보리 아카이브 → 검은 practice room → 아이보리 field notes → 울트라마린 contact room`의 명암 리듬으로 구성한다.
- 기본 팔레트는 museum black `#0c0c0b`, graphite `#171614`, plaster `#ece9e1`, warm hairline, ultramarine을 사용한다. 작은 텍스트 대비를 위해 ultramarine은 dark surface용 밝은 톤과 paper surface용 짙은 톤으로 나눈다.
- glow, gradient text, glass surface, 큰 pill과 과도한 shadow를 제거한다. radius는 1–8px, 버튼과 내비게이션은 평면 fill 또는 hairline으로 제한한다.
- Home deck은 광택 수집 카드가 아니라 무광 전시 카탈로그 folio로 보인다. 실제 프로젝트 미디어가 유일한 다색 요소이며 `Exhibit / year / role / evidence` 캡션 체계를 사용한다.
- Focus는 세 개의 독립 카드가 아닌 하나의 연속된 3열 plinth, Current는 panel이 아닌 rule 기반 essay, Contact는 단색 ultramarine field로 구성한다.
- Work, About, Resume, Copyright는 웜 페이퍼 카탈로그 테마를 사용하고 case study는 어두운 전시실과 full-bleed evidence frame을 사용한다.
- Manrope display는 약 500 weight, Noto Sans KR은 긴 본문, JetBrains Mono는 작품 번호·연도·기술값에만 사용한다. 의미 있는 캡션은 12px 아래로 줄이지 않는다.

## 2026-08-14 — Chromatic restraint override

This section supersedes only the colour decisions in the contemporary gallery override. Layout, typography, evidence framing, and interaction remain unchanged.

- Use charcoal `#11100e` and graphite `#171614` for dark rooms; use bone paper `#f1eee6` and ink `#171512` for catalogue surfaces.
- Replace ultramarine, cyan, and violet UI accents with one vermilion family: `#e84a32` on dark surfaces, `#a73524` on light surfaces, and `#b33423` for filled/decorative depth.
- Keep chromatic UI colour below roughly 8% of a viewport. Project media may remain naturally multicoloured, but navigation, metadata, rules, and controls use the neutral system.
- Contact is a graphite room with a 2px vermilion rule rather than a full-colour field. Red is reserved for exhibit numbers, evidence values, focus states, and directional cues.
- Maintain at least 4.5:1 for meaningful small text: dark vermilion 4.70:1, paper vermilion 5.70:1, and paper muted text 4.70:1.

## 2026-08-14 — Visible-first catalogue detail override

This section supersedes the hidden opening state in the staged Hero hierarchy while preserving its subtle scroll movement.

- The Home Hero must show the role, two-line value statement, and both primary actions on first paint. Scroll motion may translate this copy slightly, but must not make essential information transparent, clipped, or temporarily non-interactive.
- Meaningful labels, captions, proof descriptions, file actions, and catalogue metadata use a minimum rendered size of 12px and contrast appropriate to their surface.
- About `Now / Tools` is a four-part catalogue index ordered by current focus: Robotics, Code, AI / Agents, and Systems. Each tool uses a monochrome mark plus an always-visible name; brand colour is not used as decoration.
- ROS 2, NVIDIA Isaac Sim, Isaac Lab, C++, Python, FastAPI, PyTorch, Ollama, LangChain, Ubuntu, Git, and Docker use recognizable Simple Icons marks. Both Isaac products share the NVIDIA mark and retain distinct visible names. `llama.cpp` uses an honest `L.CPP` monogram because no matching mark is available in the selected library.
- The catalogue path reads `ROS 2 → Simulation → Local AI / Delivery`, and Robotics retains the single vermilion focus rule.
- The tool index is four columns on desktop/tablet and two columns at 520px and below. Variable item counts distribute across each column's available height so all four catalogue rails end on the same baseline. It remains readable when JavaScript or icon enhancement is unavailable.

## 2026-08-14 — Direct copy hierarchy override

This section supersedes the curatorial naming in the contemporary gallery override. The gallery's spacing, material palette, evidence framing, deck motion, and responsive fallbacks remain unchanged.

- Visible display headings use short nouns or compact noun phrases instead of sentence-form slogans.
- Remove decorative labels such as `Exhibit`, `Exhibition deck`, `Selected`, `Project archive`, `Practice`, `Field notes`, and `Evidence / Public`. Do not replace them with new catalogue jargon.
- Home uses the direct section vocabulary `Projects`, `Focus`, `About`, and `Contact`. Project detail pages use factual headings such as `Pipeline`, `Architecture`, `Validation`, and `Result`.
- Keep recruiter-relevant facts visible: project name, team or personal scope, domain, year, technology, metric, result, and action.
- Compact summaries may use dot-separated factual keywords. Explanatory prose remains in body copy, captions, accessible names, and alt text where complete sentences improve comprehension.
- Empty decorative media-label rails must collapse so removed copy does not leave a blank strip.

## 2026-08-18 — Typographic hierarchy and Resume synchronization

This section supersedes the lighter display-weight guidance in the contemporary gallery override. The font families, noun-led copy, colour system, spacing, and interaction model remain unchanged.

- Keep Manrope for display and interface text, Noto Sans KR for Korean body copy, and JetBrains Mono for compact factual metadata.
- Use an assertive but readable hierarchy: display text around weight 680, section and item headings around 650, interface actions around 630, metadata around 580, and body copy around 450.
- Relax the previous extremely tight display tracking and compressed line heights so heavier titles remain legible without clipping. Korean headings use restrained negative tracking and keep words intact.
- Preserve a minimum 12px rendered size for meaningful metadata. Mobile navigation keeps its compact size and gains weight instead of width-consuming scale.
- The browser Resume and its downloadable DOCX, PDF, and preview PNG form one synchronized artifact set. THING appears first as a team project, and every description stays within publicly verifiable team-level scope.

## 2026-08-18 — Home greeting override

- Remove the visible `AI & Robotics Software Developer · Seoul` line from the Home Hero. Job positioning remains available through project evidence, metadata, About, and Resume instead of occupying the opening composition.
- Replace the abstract `Vision · Robotics / Systems` statement with the direct Korean greeting `안녕하세요! 새로운 것을 배우고 직접 만드는 일이 즐겁습니다.`
- Keep the existing two-stage statement markup and scroll choreography. The greeting must remain readable without clipping or hand overlap at 390px, 768px, and 1280px.

## 2026-08-18 — Candidate profile and brand-mark override

- General profile copy leads with Software Engineering, the breadth from Computer Vision and ROS 2 to backend and hardware integration, and enjoyment of learning, making, and validation. It must not read as a THING feature summary.
- Keep THING as the first project and strongest robotics evidence, but confine its 21-point perception, guarded command, seven-axis actuation, monitoring, and experiment-record details to project contexts.
- Display the verified THING period as `Jul–Aug 2026` in compact web metadata and `Jul 2026 - Aug 2026` in Resume documents.
- Use one restrained `SK` monogram for the navigation mark and favicon. The adjacent `SeMinKong` wordmark remains visible, so the monogram is identity reinforcement rather than an icon-only navigation control.
- General identity uses `Software Developer` rather than the narrower `AI & Robotics Software Developer`; domain specialization remains visible through About facts, tools, and project evidence.

## 2026-08-18 — Copyright readability override

- Remove decorative `01–04` labels from Copyright sections while preserving semantic headings and content order.
- Break the introductory statement by meaning on wide layouts and allow natural wrapping on small screens.
- Use exactly one custom list marker; browser-default markers must be reset so the page never resembles broken Markdown.
## 2026-08-18 — Browser-tab mark override

- The browser-tab icon uses a borderless, high-contrast `SK` tile optimized for 16px rather than reproducing the more detailed navigation mark.
- Every route references one versioned SVG favicon URL so a released icon change is not hidden by a cached legacy asset.

## 2026-08-18 — Hero scroll continuity override

- Visible Hero copy must not acquire a new offset only when a delayed scroll segment begins.
- Preserve the staged settling rhythm, but hold every delayed element at its start pose during pre-roll so forward and reverse scrolling remain continuous.

## 2026-08-18 — Name-first Hero composition override

This section supersedes the Home-only visibility requirement in `Visible-first catalogue detail override`, the visible-copy assumption in `Hero scroll continuity override`, and any earlier Core message or acceptance criterion requiring the Home role, greeting, or CTA to be visible at scroll position zero or within the first five seconds.

- Full and lite motion begin with `SeMinKong` and the robotic hand as the only visible Hero content. The greeting and actions remain in the document flow but are visually staged until scrolling reveals them.
- The name starts near the optical middle of the opening composition. As the greeting accumulates, the outer identity and hand wrappers move into the existing completed two-column or stacked layout without changing the internal hand rig, cube, finger, or depth transforms.
- The completed state preserves the current greeting, actions, spacing, and responsive layout. Keyboard entry, reduced motion, and failed enhancement expose the complete state immediately.
- Ambient light behind the hand must fade to full transparency before the local scene boundary so the decorative object never reads as a rectangular image tile.

## 2026-08-18 — Hero reading hold and cube-finale override

This section supersedes, only during the final Hero stage, the earlier requirement that Hero scroll never changes a cube transform. The name-first opening, completed layout, hand rig, and accessibility fallbacks remain unchanged.

- Extend the scroll-seek story to `6000` units. The greeting and actions finish by `4100`, remain fully settled and readable through `4920`, and stay visible for the rest of the Hero.
- Use `4920–5820` for a cube-only flourish above the palm: four Y-axis turns plus an X-axis tumble that peaks at a half turn in full motion, and two Y-axis turns without tumble in lite/mobile. Lift the cube by at most `10px`, keep the hand visually steady, and return the flourish wrapper to its identity pose before release.
- Hold the settled result from `5820–6000` before releasing into Projects. Keyboard settlement, reduced motion, and failed enhancement show the completed copy and a static cube without replaying the flourish.
- Use Hero track heights of `175svh` desktop, `170svh` at `960px` and below, `165svh` at `900px` and below, and `160svh` at `720px` and below. Short mobile viewports at `760px` height and below retain at least `1020px` of track height so the hold and flourish do not collapse into a flick.

## 2026-08-18 — Hero cube rotation-count correction

This section supersedes the rotation counts, full-mode X tumble peak, and full-mode identity endpoint in `Hero reading hold and cube-finale override`; its reading hold, track height, ownership, and reduced-motion fallback remain unchanged.

- Full motion uses `1.5` Y-axis turns; lite/mobile uses `1` Y-axis turn; reduced motion remains static.
- Preserve the existing `25% → 87.5% → 100%` three-phase acceleration, whip, and landing rhythm. Reduce the full-mode X tumble peak from `180deg` to `90deg` so Y remains the primary gesture.
- Full motion deliberately holds its half-turned `540deg` endpoint through the final hold; lite/mobile finishes at its identity orientation. Keyboard settlement skips the decorative flourish and uses the neutral pose, while reduced motion and enhancement failure remain neutral and static.

## 2026-08-18 — Hero finale pacing override

This section supersedes the `6000`-unit timing and three-phase Y-axis rhythm in the preceding Hero finale overrides. Rotation counts and all visual/accessibility limits remain unchanged.

- Use a `6800`-unit scroll timeline: completed copy holds from `4100–5000`, the cube flourish runs from `5000–6600`, and the settled result holds from `6600–6800`.
- Animate Y as one continuous `inOut(2)` rotation: `1.5` turns in full motion and one turn in lite/mobile.
- Keep X/Z/lift subordinate to Y, using auxiliary phases at `5000–5500`, `5500–6200`, and `6200–6600`. Preserve the `90deg` full-mode X peak, `10px` lift limit, stationary hand, and zeroed auxiliary transforms at landing.
- Existing track heights, keyboard-neutral settlement, reduced motion, failed-enhancement fallback, and lifecycle safeguards remain unchanged.

## 2026-08-18 — Hero cube loop-handoff override

This section supersedes only the static final-hold and autonomous-pause-through-release requirements in the preceding Hero finale overrides. The `6800`-unit timeline, copy timing, `5000–6600` flourish, rotation counts, axis limits, outer endpoints, responsive geometry, and accessibility fallbacks remain unchanged.

- Pause the existing coordinated manipulation master only from `5000–6400`.
- At `6400`, resume that same master from its preserved playhead while the outer flourish completes its eased landing through `6600`. Keep pointer and drag responses locked during this overlap so the handoff has one predictable motion source per wrapper.
- From `6600–6800` and after the Hero releases, keep the outer flourish at full `540deg` or lite/mobile `360deg` while the existing cube, finger, tendon, and hand loop continues at its established pace.
- Do not normalize the outer endpoint, add another turn, create a second infinite spinner, or reset the coordinated loop to its first grip pose.
- A full/lite breakpoint change rebuilds the loop at the same normalized phase so resizing does not expose the first grip pose between the flourish and ambient motion.
- Reverse scrolling below `6400` pauses the base loop again for deterministic flourish seeking; crossing below `5000` restores the normal autonomous loop. Keyboard settlement, reduced motion, failed enhancement, hidden, and offscreen states retain their established static or paused behavior.

Visual acceptance: the cube does not freeze when the Hero reaches its final scroll position, and the flourish flows into the familiar manipulation loop without a pose snap, direction reversal, added rotation, or pointer interruption.

## 2026-08-21 — 읽기 중심 페이지 흐름 정리

이 항목은 전역 시그널 스레드와 Home Focus·THING Demos의 핀 챕터 구성을 대체한다.

- 문서 진행도를 나타내는 상단 bar, 좌측 rail/node, Home Hero 하단 line을 모든 route에서 제거한다. 스크롤 위치는 브라우저 기본 scrollbar로만 확인한다.
- Home Focus는 `Vision / Robotics / Systems` 세 키워드와 소형 번호만 남긴 정적인 editorial index로 사용한다. 키워드 아래의 요약 문구와 핀 전환·readout은 사용하지 않는다.
- THING Demos는 작은 순번 badge, native video controls, 2열/모바일 1열 갤러리를 유지한다. 상세 페이지에서 scene pin, 자동 chapter 전환, 별도 counter를 사용하지 않는다.
- Work index만 프로젝트별 scroll chapter를 가진다. 실제 미디어와 프로젝트 정보는 정상 문서 순서에 남고, 데스크톱에서만 좌우가 교차하는 큰 chapter로 전개한다.
- About의 추상적인 `개발 방식` 3단계 대신 `요즘 붙잡고 있는 질문`을 사용한다. Retargeting, Sim-to-real, Local AI를 현재 공부하고 탐색하는 질문으로 표현하며 완성된 전문성처럼 과장하지 않는다.

## 2026-08-21 — Work 증거 프레임 정교화

- Work index의 실제 제품 화면은 동일 비율로 억지 crop하지 않는다. dashboard·분류 결과·제품 cover·diagram은 전체 interface가 보이는 16:9 contain, 게임은 1:1, THING은 9:16으로 원본 성격을 유지한다.
- chapter의 시각적 전환은 미디어에 집중하고 프로젝트 제목, 역할, 요약, 기술, CTA는 어떤 scroll 위치에서도 완전한 대비로 읽혀야 한다.
- 세로 미디어는 desktop viewport 높이에 맞춰 제한하며 720px 높이에서도 fixed navigation 아래에 전체 frame이 들어와야 한다.
- poster가 없는 큰 autoplay preview는 첫 frame 공백을 피할 수 있도록 실제 video frame에서 만든 가벼운 poster를 제공한다.

## 2026-08-21 — 순서 번호 제거와 프로젝트 장면화 override

이 항목은 Home·Work·About·THING에서 장식용 `01–06`을 유지하던 앞선 결정을 대체한다.

- 실제 읽기 순서가 HTML과 문서 흐름으로 이미 분명한 곳에는 장식용 순번을 표시하지 않는다. Home project deck, Focus, Work 목록, About 기술 분류, THING Demos의 `01–06`은 제거한다.
- 날짜·연도·버전·영상 길이·landmark와 axis 수·성능처럼 프로젝트 근거인 숫자는 그대로 유지한다.
- Work desktop은 썸네일 하나가 따라오는 구성이 아니라 미디어, 제목, 역할, 요약, 기술, CTA가 한 화면의 `project scene`으로 함께 머무르고 전환된다.
- Saffron의 전체 sticky stage와 Mathis Biabiany의 비대칭 편집 구도에서 원리만 참고한다. 두 사이트의 WebGL, 브랜딩, 자산, 카피, 구체적인 카드 외형은 복제하지 않는다.
- THING portrait, dashboard 16:9, game square, editorial cover, diagram의 실제 비율 차이를 장면의 구도 차이로 사용한다. 모든 프로젝트를 같은 크기의 카드로 평준화하지 않는다.

## 2026-08-21 — About 기술 언어와 컬러 도구 표식

- `요즘 붙잡고 있는 질문`은 Retargeting, Sim-to-real, Edge inference를 현재 탐구하는 문제로 유지하되 `7-DoF`, `joint limit`, `domain gap`, `latency`, `memory budget`, `observability`처럼 실제 검증 대상을 구체적으로 드러낸다.
- 기술 스택은 기존 Simple Icons SVG를 사용하고 각 브랜드 색은 아이콘과 얕은 배경에만 제한한다. 기술명과 분류 제목은 중립 잉크색으로 유지한다.
- 기술 항목은 링크나 버튼이 아니므로 가짜 pointer cursor나 `tabindex`를 추가하지 않는다. full-motion fine pointer에서만 작은 lift와 회전을 제공하고 lite/reduced에서는 정적으로 표시한다.
- llama.cpp는 정확한 공개 아이콘이 없으므로 `L.CPP` monogram을 유지하고 Isaac Sim·Isaac Lab은 NVIDIA 표식을 공유한다.

## 2026-08-21 — 원본 비율 영상과 독립 캡션 override

이 항목은 `Work 증거 프레임 정교화`의 고정 video frame 결정을 영상에 한해 대체한다. Dashboard screenshot, diagram, product cover 같은 정적 evidence의 기존 contain 규칙은 유지한다.

- 모든 video는 실제 source의 `width`와 `height`를 HTML에 명시하고 `height: auto`로 표시한다. 720×1280 THING, 1280×720 AQIS, 1276×1270 Alkkagi, 1320×1032 MRI의 비율을 임의의 16:9·1:1 box로 바꾸지 않는다.
- Video figure와 preview에서 inset border, frame padding, 채움용 background, box shadow를 제거한다. 세로 영상의 최대 폭과 Work viewport 높이 제한은 비율을 바꾸지 않는 responsive size constraint로만 사용한다.
- `figcaption`은 video와 같은 figure 안에서 의미 관계를 유지하되, 영상 아래 정상 문서 흐름의 독립 행으로 표시한다. 얇은 rule, 여백, metadata typography만 사용하고 영상 배경이나 외곽선 안에 포함하지 않는다.
- Work의 THING과 Alkkagi preview에는 영상 아래 별도 evidence caption을 둔다. 프로젝트 설명과 링크는 계속 copy column이 담당하며, preview caption은 프로젝트당 하나인 semantic link에 focusable control을 추가하지 않는다.
- THING Demos는 desktop 2열과 mobile 1열을 유지하되 각 video는 원본 9:16 그대로 표시하고 설명 블록은 영상 다음에 이어진다.

## 2026-08-21 — About 기술 스택 크기와 정렬 override

이 항목은 기술 스택을 About 제목 옆의 좁은 우측 영역에 두고 tablet까지 4열로 유지하던 앞선 catalogue 배치를 대체한다. 도구 목록, 브랜드 색 범위, 비상호작용 의미 구조는 유지한다.

- `기술 스택` 제목과 catalogue를 같은 page-width 세로축에 놓고, catalogue는 제목 아래의 전체 폭을 사용한다.
- 901px 이상은 네 기술 분류를 4열로, 521–900px은 2열로, 520px 이하는 1열로 표시한다.
- 각 도구는 58px icon과 항상 보이는 기술명을 한 행에 배치한다. 분류 제목, icon, 기술명은 모든 열에서 같은 시작선과 간격을 공유한다.
- 3개와 4개 항목을 가진 목록을 각자 남은 높이로 늘리지 않는다. Desktop/tablet 행은 108px, mobile 행은 100px의 공통 리듬을 사용하고, 짧은 목록의 여백은 마지막 항목 뒤에만 남긴다.
- 브랜드 색은 icon과 얕은 tint에만 쓰고, 분류명과 기술명은 중립 잉크색을 유지한다. 비동작 항목에는 pointer cursor, 링크, 버튼, `tabindex`를 추가하지 않는다.

## 2026-08-21 — About 대형 컬러 로고 wall override

이 항목은 바로 앞의 4/2/1 분류 catalogue와 58px icon 행을 대체한다. `jb-cheng.github.io`에서는 카드 없는 100px 로고의 3열 wall과 넓은 여백이라는 원리만 참고하고, 배경 패턴·자산·브랜딩·구체적인 화면 장식은 복제하지 않는다.

- 기술 스택은 분류 칸, 외곽선, 셀 배경이 없는 하나의 13개 semantic list로 표시한다. 각 브랜드 mark 자체가 주 시각 요소다.
- 901px 이상에서는 section title을 왼쪽에 두고 오른쪽 최대 560px 영역에 3열 logo wall을 정렬한다. Logo viewport는 약 100px이며 마지막 13번째 항목은 가운데 열에 둔다.
- 521–900px은 제목 아래 최대 620px의 3열 wall, 520px 이하는 page grid 안의 3열 wall을 사용한다. Mobile mark는 최대 70px이고 기술명은 최소 12px로 항상 표시한다.
- Desktop fine pointer에서는 기술명이 hover 때만 나타난다. Touch/coarse pointer에서는 동일 NVIDIA mark를 쓰는 Isaac Sim과 Isaac Lab도 구분되도록 이름을 정적으로 표시한다.
- 정확한 llama.cpp 브랜드 mark를 임의로 만들지 않고 `L.CPP` monogram을 유지한다. 비동작 list item에는 pointer cursor나 keyboard tab stop을 추가하지 않는다.

## 2026-08-21 — THING Prototype evidence layout override

이 항목은 정적 evidence를 동일 폭의 frame 안에 두던 앞선 결정을 THING Prototype의 두 사진에 한해 대체한다.

- 3:4 통합 로봇 핸드 사진과 4:3 Jetson 시험 사진은 원본 비율을 유지한다. Desktop과 tablet에서는 `9 / 16` 폭 비율로 나란히 배치해 서로 다른 가로폭 대신 같은 표시 높이와 같은 상·하단 축을 만든다.
- 두 사진 묶음은 최대 600px로 제한해 본문보다 과도하게 커지지 않게 한다. 세로 사진은 제작물, 가로 사진은 시험 환경이라는 읽기 순서에 따라 왼쪽에서 오른쪽으로 둔다.
- Figure의 외곽선, 채움 배경, 잘라내기, 강제 aspect ratio를 제거한다. Caption은 이미지 아래의 독립적인 label 행으로 두고, 이미지 폭 안에서 얇은 rule과 metadata typography만 사용한다.
- 600px 이하에서는 한 열로 쌓는다. 세로 사진은 `min(60%, 220px)`로 제한하고 가로 사진은 가용 본문 폭을 사용해 작은 화면에서도 두 증거의 시각 무게가 크게 벌어지지 않게 한다.

## 2026-08-21 — About compact tool matrix override

이 항목은 13개 기술을 분류 없이 100px급 mark의 3열 wall로 표시하던 앞선 결정을 대체한다. 브랜드 색, Simple Icons, llama.cpp monogram, 비상호작용 의미 구조는 유지한다.

- 기술 스택은 `Robotics / Code / AI · Agents / Systems`의 네 semantic group으로 다시 묶는다. 각 group은 얇은 가로 rule, 분류명, 네 칸의 도구 행만 사용하며 카드·셀 배경·외곽 box는 만들지 않는다.
- 기술명은 pointer 종류와 motion tier에 관계없이 항상 표시한다. 같은 NVIDIA mark를 공유하는 Isaac Sim과 Isaac Lab, 형태가 덜 익숙한 FastAPI와 LangChain도 hover 없이 구분되어야 한다.
- Desktop은 page-width 전체에서 44px mark와 네 도구 열을 사용한다. 900px 이하는 38px, 520px 이하는 32px mark로 줄이며 mobile group 내부 도구는 두 열로 쌓는다.
- 분류 순서와 도구 순서는 `Robotics: ROS 2 → NVIDIA Isaac Sim → Isaac Lab`, `Code: C++ → Python → FastAPI`, `AI / Agents: PyTorch → Ollama → llama.cpp → LangChain`, `Systems: Ubuntu → Git → Docker`로 유지한다.
- 개별 도구는 여전히 링크나 버튼이 아니다. 기술명은 12px 아래로 줄이지 않고, tooltip과 가짜 pointer cursor 또는 keyboard tab stop을 추가하지 않는다.

## 2026-08-21 — llama.cpp 공식 mark override

이 항목은 llama.cpp에 공개된 정확한 mark가 없어 `L.CPP` monogram을 사용한다는 앞선 결정을 대체한다.

- llama.cpp는 공식 저장소의 `llama1-icon-transparent.svg`를 로컬 SVG asset으로 사용한다. 첨부된 불투명 PNG의 흰 배경을 시각 효과로 감추지 않고, 같은 형태의 공식 투명 벡터를 사용한다.
- Mark의 공식 orange `#ff8236`은 아이콘과 hover shadow에만 사용한다. 크기, 정렬, 항상 보이는 기술명, 비상호작용 list 의미는 compact tool matrix의 공통 규칙을 그대로 따른다.

## 2026-08-21 — Home split-entry intro

- Home을 문서 상단에서 직접 열 때 warm-paper cover 중앙에 `SeMinKong`만 먼저 표시하고, 짧은 정지 뒤 이름과 좌우 cover가 양옆으로 갈라지며 기존 graphite Hero를 드러낸다.
- Intro는 별도의 fixed decorative overlay이며 실제 Hero h1, robotic hand, sticky scroll timeline의 transform을 소유하지 않는다. 중앙 이름은 `aria-hidden`이고 실제 문서 제목은 기존 h1 하나만 유지한다.
- Full motion은 약 1.7초, lite/mobile은 약 1초 안에 끝낸다. Hash 진입, back-forward 복귀, 복원된 scroll 위치, reduced motion에서는 건너뛰고 Hero를 즉시 표시한다.
- Warm paper, graphite, 기존 Manrope wordmark만 사용한다. 별도 logo, 진행 UI, HUD, blur, 번호는 추가하지 않는다.

## 2026-08-21 — Home intro-to-Hero FLIP handoff override

이 항목은 중앙 이름을 두 조각으로 흩어 없애고, Hero를 이름과 손만 보이는 scroll-zero 단계로 시작하던 앞선 Home intro 및 name-first opening 결정을 대체한다.

- 중앙 `SeMinKong`은 사라지지 않고 실제 Hero h1의 responsive 위치와 크기로 이동한다. 마지막 짧은 crossfade 뒤 overlay를 제거하며, 제거 직전과 직후 화면은 같아야 한다.
- 좌우 paper panel만 reveal mask로 움직인다. 실제 Hero copy와 hand wrapper의 transform은 계속 Hero scroll timeline이 소유하고 intro는 이를 직접 이동하지 않는다.
- Intro의 착지점은 이름, 인사말, CTA, 손이 모두 완성된 Hero reading state다. 따라서 intro가 끝난 뒤 두 번째 이름 entrance나 추가 조립 animation이 시작되지 않는다.
- Hero scroll은 이 reading state에서 앞으로만 진행해 cube flourish와 다음 섹션으로 이어진다. 첫 1–10px scroll에서 copy나 hand가 이전 pose로 되감기지 않는다.
- 이동 중 이름은 `difference` blending으로 paper 위에서는 dark ink, graphite 위에서는 off-white 대비를 유지한다. 의미가 있는 실제 h1은 하나만 두고 overlay word는 계속 `aria-hidden` 장식으로 취급한다.

## 2026-08-21 — Home handwritten word entrance override

- 중앙 `SeMinKong`은 단어 전체 fade가 아니라 왼쪽에서 오른쪽으로 아홉 글자가 차례로 채워지는 ink-wipe로 등장한다. Manrope live text와 실제 Hero h1은 유지하며 glyph를 임의의 SVG outline으로 바꾸지 않는다.
- 글자 reveal 가장자리에는 작은 vermilion nib 하나만 따라간다. 펜 그림, underline, particle, sound는 추가하지 않고 필기가 끝나면 nib도 panel opening 전에 사라진다.
- 필기 단계는 자식 글자의 clip과 opacity만 소유하고, 단어 부모의 transform은 이후 Hero h1으로 이동하는 FLIP에만 사용한다. 따라서 필기와 착지가 두 개의 독립된 entrance처럼 보이지 않아야 한다.
- Lite/mobile은 같은 방향과 순서를 더 짧게 유지하고, reduced motion·hash·BFCache·조기 입력 경로에서는 기존처럼 intro 전체를 생략하거나 즉시 완성한다.

## 2026-08-22 — Home intro reading-beat override

이 항목은 Home split-entry, FLIP handoff, handwritten word entrance의 시각 구조를 유지하면서 재생 시간만 대체한다. BeeToGreen의 브랜드 프리로더에서는 `브랜드 동작 → 완성 상태 hold → 커튼 퇴장 → Hero 조립`으로 장면을 분리하는 호흡만 참고하며 색, Lottie 그래픽, 로고 형태, 카피, 자산은 가져오지 않는다.

- Full motion은 약 `4.7초`, lite/mobile은 약 `3.1초`로 늘린다. 기존 `1.38초 / 1.02초` 타임라인은 더 이상 사용하지 않는다.
- 필기 자체를 무작정 늘이지 않고, 완성된 중앙 `SeMinKong`을 full 약 `1.25초`, lite 약 `0.74초` 읽을 수 있게 유지한 뒤 panel을 연다.
- Panel reveal은 full `2.0초`, lite `1.4초` 동안 진행하며, Hero copy와 navigation은 후반에 겹쳐 조립되어 마지막 프레임이 곧 완성된 Hero가 된다.
- 별도 Lottie, image, dependency, progress 또는 Skip 버튼은 추가하지 않는다. 기존 wheel·pointer·touch·keyboard 입력의 즉시 완료, reduced/hash/BFCache 생략, FLIP 정합도, Lenis 지연 시작을 그대로 유지한다.

## 2026-08-22 — Home intro stroke-order wordmark override

이 항목은 `Home handwritten word entrance`의 사선 ink-wipe와 nib, `Home intro reading-beat`의 필기 구간을 대체한다. 읽기 hold와 panel→Hero 순서는 유지한다.

- Intro 전용 `SeMinKong`은 일반 글자의 가로 clip reveal이 아니라, 라틴 손글씨의 자연스러운 쓰기 순서로 직접 설계한 12개 SVG 중심 획을 Anime.js `createDrawable()`로 순차 노출한다. `i`는 몸통 뒤 점, `K`는 세로 뒤 위·아래 대각선 순서로 쓴다.
- 별도 펜, nib, cursor, 진행선은 두지 않는다. SVG 전체는 `aria-hidden`이고, 의미 있는 제목은 기존 Hero h1 하나만 유지한다.
- 각 글자는 마지막 획이 끝날 때 full에서 최대 `scale 1.055 / y -7px`, lite에서 `scale 1.035 / y -4px`로 한 번 반동한 뒤 정착한다. 반복 흔들림이나 panel 단계까지 남는 탄성은 사용하지 않는다.
- 중앙 이름은 필기 중 full `1.16 → 1.32배`, lite `1.10 → 1.18배`로 부드럽게 커진다. 완성된 SVG를 정확한 Manrope live-text로 교대하고, 기존 responsive FLIP이 중앙의 큰 이름을 Hero h1 크기와 위치로 축소·이동한다.
- 새 asset이나 dependency를 추가하지 않는다. 획 렌더링에 실패하면 기존 원자적 `finish()` 경로로 완성된 Hero를 즉시 노출하며, reduced/hash/BFCache/입력 skip 규칙은 그대로 유지한다.

## 2026-08-22 — Spaced public name and persistent handwritten Hero override

이 항목은 공개 이름을 붙여 쓰던 규칙과 `Home intro stroke-order wordmark`의 SVG→Manrope 교대를 대체한다.

- 방문자에게 보이는 이름은 모든 route의 title, metadata, header, footer와 본문에서 `Se Min Kong`으로 띄어 쓴다. GitHub 계정·저장소 URL, resume asset 이름과 package 식별자는 바꾸지 않는다.
- Intro에서 완성된 12획 SVG를 Manrope 글자로 바꾸지 않는다. 같은 SVG geometry를 중앙 필기, FLIP 이동, 최종 Hero h1까지 유지해 서체가 바뀌는 순간을 없앤다.
- Hero h1의 초기 HTML에는 투명한 실문자 fallback과 정적 SVG를 함께 둔다. 실문자는 responsive 폭과 line box를 제공하고 SVG는 장식으로 숨기며, h1 자체의 접근 가능한 이름은 `Se Min Kong` 하나로 유지한다.
- Reduced motion, hash 진입, BFCache, 조기 skip에서도 Intro 유무와 관계없이 같은 정적 Hero wordmark를 보여 준다. 기존 header wordmark와 일반 UI의 Manrope 역할은 유지한다.

## 2026-08-22 — Professional softened typography override

이 항목은 앞선 typography의 보이는 Manrope, Noto Sans KR, JetBrains Mono 역할과 바로 위 항목의 일반 UI Manrope 유지를 대체한다. 손글씨 SVG의 형태와 획순은 대체하지 않는다.

- 보이는 display, heading, body, navigation은 `Asta Sans Variable`로 통일한다. 기술적인 직선과 완만한 곡선이 공존하는 인상을 사용하되, 둥근 장식체나 유아적인 손글씨체로 일반 UI를 바꾸지 않는다.
- 본문은 450, 보조 문구는 500, UI는 600, heading은 640, display는 680을 기본 축으로 사용해 진지한 위계를 유지하면서 이전의 과도하게 딱딱한 인상을 줄인다.
- 영문 metadata와 기술 label은 `Geist Mono Variable`을 사용한다. 한글 glyph는 Asta Sans로 fallback시켜 운영체제 고정폭 글꼴이 갑자기 섞이지 않게 한다.
- `Manrope Variable`은 화면에 보이는 글꼴로 사용하지 않는다. Intro와 Hero의 동일한 손글씨 SVG 폭·FLIP 착지점을 보존하는 투명 metric text 전용으로만 남긴다.
- 기존의 절제된 자간, warm-paper/graphite 대비, vermilion signal은 유지한다. 글꼴 교체를 이유로 제목을 더 장식적으로 만들거나 기술 정보의 밀도를 낮추지 않는다.

## 2026-08-22 — Dongle-led handwritten typography override

이 항목은 바로 앞의 Asta Sans/Geist Mono typography 결정을 대체한다. Intro와 Hero의 `Se Min Kong` 12획 SVG 서명은 대체하지 않는다.

- 큰 제목, section heading, navigation, wordmark와 주요 action은 `Dongle` 700을 사용한다. 탈네모꼴과 둥근 획의 리듬을 화면의 주된 인상으로 삼는다.
- 긴 본문, 설명, metadata와 기술 label은 `Gowun Dodum` 400을 사용한다. 별도의 mono face는 두지 않고 크기, 대문자, 색, rule과 여백으로 정보 위계를 구분한다.
- Dongle의 글자가 같은 point size에서 작게 보이는 특성을 보정하기 위해 navigation과 action 글자 크기를 키우되 44px 이상의 기존 hit area와 responsive header 구조는 유지한다.
- 큰 제목의 강한 음수 자간을 약 `-0.012em` 이내로 완화하고 한글 heading은 기본적으로 0에 가깝게 둔다. 둥근 획이 서로 뭉치지 않게 하면서 기존 warm-paper/graphite/vermilion의 진지한 편집 구조로 과도한 귀여움을 억제한다.
- 두 가시 서체는 Fontsource package의 Korean/Latin WOFF2를 self-host한다. `Manrope Variable`은 Intro와 Hero의 투명 metric text에만 남긴다.

## 2026-08-23 — Home 서명 연속성과 paper reveal override

- Home 첫 장면은 좌우로 갈라지는 커튼을 사용하지 않는다. 하나의 warm-paper 면이 전체 화면에서 잔잔하게 옅어지며 graphite Hero를 드러내고, 중앙 seam, 방향성 wipe 또는 두 장의 문처럼 보이는 경계를 만들지 않는다.
- Intro에서 획순으로 작성된 `Se Min Kong` SVG는 별도 Hero 복제본으로 바뀌지 않는다. 같은 노드가 중앙에서 Hero 왼쪽 위치까지 축소·이동한 뒤 그대로 h1의 시각 서명이 된다.
- Dongle, Gowun Dodum, 숨은 Manrope metric의 역할은 유지한다. Dongle UI는 point size보다 작아 보이는 optical size를 보정하되, 390px header의 세 그룹과 44px hit area, page-width 시작선, 긴 제목 줄바꿈을 우선한다.

## 2026-08-23 — Monotonic responsive typography override

- 반응형 글자 크기는 viewport가 넓어질 때 작아지지 않아야 한다. 구조를 바꾸는 media query에서는 grid·여백·줄바꿈만 바꾸고, 같은 역할의 제목 크기는 가능한 한 공통 `clamp()` 하나로 유지한다.
- 공통 본문은 16px을 기준으로 하고, 긴 보조 본문은 약 16.8–18.6px, 의미 있는 UI label·날짜·연락처·action은 14–14.7px, 짧은 metadata는 약 13.2–14.3px을 사용한다.
- Dongle의 큰 display는 작은 화면에서도 시각 몸집이 충분하도록 별도 fluid scale을 사용한다. About·Work·Legal·Case의 page title과 Home 문장은 `600 / 700 / 720 / 900px` 경계에서 연속이어야 한다.
- Home Intro와 Hero의 `Se Min Kong` 12획 SVG, Dongle display, Gowun Dodum 본문·metadata의 역할은 변경하지 않는다. 크기 정리를 이유로 새 font family나 별도 서명 fallback을 추가하지 않는다.

## 2026-08-23 — 150% global typography scale override

이 항목은 바로 위 항목의 font-size 수치만 대체한다. Font family, weight 역할, Home 서명과 motion 규칙은 그대로 유지한다.

- Root `font-size`는 `150%`이며 기본 본문 computed size는 `24px`이다. 현재 stylesheet의 `rem`은 모두 `font-size`에만 사용하므로 spacing이나 media geometry를 함께 확대하지 않는다.
- `vw`가 포함된 fluid type 식은 viewport 항도 1.5배로 올려 작은 화면, 중간 화면, 큰 화면에서 같은 확대 비율과 단조 증가를 유지한다.
- Dongle은 display·heading·navigation·action, Gowun Dodum은 본문·metadata, Manrope는 보이지 않는 Home 서명 측정용이라는 기존 역할을 유지한다.
- 720px 이하 header는 brand와 Resume를 첫 행, Work와 About을 둘째 행에 둔다. 960px 이하 Work project scene은 media 다음에 copy가 오는 1열, 820px 이하 Resume item은 날짜가 제목 다음 행, 700px 이하 About tool matrix는 분류별 2열을 사용한다.
- 390px Home 서명은 정확한 1.5배가 화면 폭을 넘으므로 동일 SVG와 글꼴 크기 연속성을 유지하면서 viewport-safe fluid size를 사용한다. Intro와 최종 Hero는 같은 값을 공유해 중간 font 변경을 만들지 않는다.

## 2026-08-23 — Balanced 120% typography and invariant signature override

이 항목은 바로 위 150% 수치와 720px 이하 2행 header 규칙을 대체한다. Font family, weight, 색, 페이지 구조와 Intro timing은 유지한다.

- Root `font-size`는 `120%`, 기본 Gowun Dodum 본문은 `19.2px`이다. 모든 `vw` 기반 `font-size`도 원래 정리값의 1.2배로 계산해 viewport가 커질 때 위계가 역행하지 않게 한다.
- 390px 기준 About h1은 약 `96px`, Work h1은 약 `90px`, case h1은 약 `68px`로 사용한다. 짧은 Dongle display는 충분히 크지만 19.2px 본문·16px 안팎 metadata와 경쟁하지 않아야 한다.
- Home 서명은 720px 이하에서 `clamp(2.05rem, 13.8vw, 3.6rem)`, 그보다 넓은 화면에서는 공통 Hero token을 사용한다. Intro와 Hero가 항상 같은 값을 공유한다.
- Home 서명의 12개 path는 `1000 × 190` viewBox 본래 비율을 보존한다. SVG viewport는 `xMidYMid meet`를 사용하며 container를 채우기 위해 획을 가로 또는 세로로 따로 늘리지 않는다.
- 360px 이상 header는 brand, Work/About, Resume를 한 행에 둔다. 359px 이하에서만 brand/Resume 첫 행과 Work/About 둘째 행을 사용한다. 기존 960px Work 1열, 820px Resume stack, 700px About tool 2열 fallback은 유지한다.

## 2026-08-23 — Mandatory Home intro completion override

이 항목은 앞선 Home Intro 규칙에 남아 있는 `입력 즉시 완료`와 `Escape/Tab skip` 동작을 대체한다. 시각 형태, 서명 비율과 timing은 바꾸지 않는다.

- 정상적인 Home top-entry Intro가 활성화되면 배경의 skip link, header, main, footer와 page transition surface는 일시적으로 비활성화한다. 화면에는 Intro status만 남고 보이지 않는 링크로 focus가 이동하지 않아야 한다.
- Wheel, single-pointer click/tap, touch pan, Tab, Escape, Enter, Space, Backspace, arrow, PageUp/PageDown, Home/End는 Intro의 완료 시점을 앞당기거나 페이지를 이동시키지 않는다. Entry scroll position은 완료까지 유지한다.
- 자연 완료 뒤에는 Intro DOM, pending/active/locked class, 임시 `inert`, `aria-busy`와 opacity style을 같은 cleanup에서 제거한다. 그다음 frame부터 navigation, focus, native scroll과 full-mode Lenis를 정상적으로 사용할 수 있다.
- Reduced motion과 hash/BFCache/restored entry는 처음부터 정적 Hero를 사용한다. Hidden, pagehide, motion→reduced, geometry/Anime 오류와 watchdog은 즉시 정적 Hero로 정리하는 안전 예외다. 브라우저 chrome, Back, Reload와 modifier shortcut은 잠그지 않는다.
- Full `2.38s`, lite/mobile `1.66s`, 마지막 획 뒤 `1s` 이내 handoff, `xMidYMid meet`, 단일 uniform scale과 동일 12-path SVG node 규칙은 그대로 유지한다.

## 2026-08-23 — Paper Current Home Hero override

이 항목은 기존 Home의 signature robotic hand, control cube와 좌우 Hero 구성을 대체한다. Intro의 동일 12-path 서명, 이름 표기, 인사말과 CTA 문구는 유지한다.

- Hero 정보는 화면 중앙의 `Se Min Kong → 인사말 → Projects / Contact` 순서로 정렬한다. 서명은 `xMidYMid meet`와 단일 scale만 사용하고 유체 또는 hover로 글자 자체를 변형하지 않는다.
- 배경은 warm bone paper 전체를 하나의 연속 표면으로 사용한다. 넓고 느린 graphite ink wash를 주재료로 두고 vermilion은 작은 pigment 영역 하나에만 제한한다. Glossy gel, rainbow gradient, particle spray, HUD, robot/hand/pen cursor 오브젝트는 사용하지 않는다.
- 유체는 카피 rect 주변의 둥근 quiet zone에서 밀려나며 이름과 CTA의 대비·클릭 영역을 항상 보존한다. 네이티브 커서는 유지하되 별도의 follower, nib 또는 interaction label은 추가하지 않는다.
- Intro veil과 Hero가 같은 paper material을 공유한다. 동일 SVG가 착지한 뒤 그 중심에서 한 번의 잔잔한 pressure wave로 유체가 깨어나며, 이 효과 때문에 Intro 완료 시간이 늘어나지 않는다.
- Desktop은 full interaction, tablet/mobile은 낮은 해상도와 절제된 tap response, reduced/WebGL 실패는 정적 marbling composition을 사용한다.

## 2026-08-23 — Pressure Ink interaction override

이 항목은 바로 위 Paper Current Hero의 색·중앙 정보 구조를 유지하면서 desktop 유체의 강도와 재료 동작을 대체한다.

- Full desktop은 포인터 자국이 즉시 사라지는 표면 왜곡이 아니라, 속도와 잉크가 남아 서로 밀고 말려 들어가는 Pressure Ink playground를 사용한다. 빠른 이동, drag와 급반전일수록 graphite wake와 서로 반대 방향의 vortex pair가 강해진다.
- Graphite가 주된 넓은 wash이며 vermilion은 빠른 입력과 일부 wake의 좁은 채널에만 나타난다. 과포화 색, 광택 gel, particle spray, cursor follower와 별도 조작 UI는 추가하지 않는다.
- 서명·인사말·CTA의 실측 rect를 하나의 둥근 obstacle로 보호한다. 유체는 그 앞에서 갈라지고 뒤에서 합쳐지되, Se Min Kong SVG와 content DOM에는 transform, filter, distortion을 적용하지 않는다.
- Full solver를 지원하지 않는 GPU와 tablet/mobile은 기존의 가벼운 procedural current를 사용한다. Reduced motion과 WebGL 실패는 정적 marbling을 사용하며 세 단계 모두 같은 paper/graphite/vermilion 재료를 공유한다.
- Canvas의 scroll fade는 Hero wrapper opacity 한 곳에서만 처리한다. Intro 직후 wake가 바로 읽히도록 canvas reveal은 짧게 유지하고, CTA hit area와 native touch scroll은 바꾸지 않는다.

## 2026-08-23 — Multi-page delivery architecture

- 이 구조 변경은 화면의 정보 위계, 시각 방향, 문구, route URL과 motion timing을 변경하지 않는다.
- Home, Work, case study, About, Resume, Copyright는 각각 명시적인 entry를 사용한다. Home/Work만 project presentation 공통 CSS를 공유하고 case study는 Home·Work page CSS를 로드하지 않는다.
- `tokens.css`, `base.css`, `motion.css`는 실제 전역 primitive와 shell/fallback만 소유한다. Hero, Work directory, case, About, Resume, Legal의 선택자와 responsive 규칙은 해당 route stylesheet가 소유한다.
- Home 전용 Intro·Fluid·Project Deck과 Work 전용 Story/GSAP는 다른 route의 초기 bundle이나 DOM 초기화 경로에 포함하지 않는다. Capability가 맞지 않는 optional enhancement는 native/static 결과를 유지한다.
- 큰 motion 구현은 public controller/facade를 유지한 채 wordmark data, shader source, WebGL resource, sizing helper로 분리한다. Shader 순서, 획순, uniform 이름, fallback 단계와 lifecycle 조건은 시각 사양으로 간주해 단순 리팩터링에서 바꾸지 않는다.

## 2026-08-23 — Site-wide Fluid background override

이 항목은 바로 위 Multi-page delivery architecture의 `Home 전용 Fluid` 범위를 대체한다. Intro와 Project Deck은 계속 Home 전용이며, Fluid의 시각 재료와 입력 엔진만 모든 route가 공유한다.

- 문서당 하나의 fixed full-viewport Fluid layer를 Home, Work, About, Resume, Copyright와 6개 case study 모두에 둔다. Canvas는 content, footer, navigation, media, page curtain과 focus surface 뒤에 있으며 `pointer-events: none`, `aria-hidden=true`를 유지한다.
- Home은 기존 Pressure Ink의 주 playground로 가장 강하게 유지한다. Work는 중간 강도, About은 그보다 차분하게, Resume와 Copyright는 거의 paper texture처럼, case study는 어두운 paper 위 restrained off-white wash와 vermilion signal로 표시한다.
- 각 route의 첫 reading block은 실측 quiet obstacle로 보호한다. 해당 block이 viewport 밖으로 나가면 obstacle을 비활성화해 화면 한가운데에 보이지 않는 장벽을 남기지 않는다.
- Light route는 warm paper / graphite / vermilion, case route는 charcoal paper / bone ink / vermilion을 사용한다. Shader는 palette uniform을 받아 route 배경을 불투명한 다른 색으로 덮지 않는다.
- Fluid는 배경의 빈 면에만 시각적 존재감을 주고, 카드·영상·문서 preview처럼 의미 있는 surface의 불투명도와 본문 대비는 유지한다. 이름 SVG와 타이포그래피에는 scale, warp, filter를 적용하지 않는다.
