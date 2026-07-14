# Design brief

Status: Approved for implementation — 2026-07-14

## Confirmed identity

- Site name: `SeMinKong`
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

SeMinKong이 진행해 온 프로젝트와 경험을 설득력 있게 보여주고, 개발자를 찾는 방문자가 역량과 관심 분야를 이해한 뒤 협업 또는 채용 연락을 보내도록 만든다.

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

- 이름: SeMinKong
- 역할: AI & Robotics Software Developer
- 범위: Perception → Decision → Physical Action → Interface, 이후 AQIS에서 Computer Vision·ROS 2·Backend·Hardware Integration을 증명
- 행동: 대표 프로젝트 보기 또는 연락하기

`Physical AI`는 이미 확립된 전문 자격처럼 과장하지 않고, 실제 AQIS 경험에서 출발한 관심과 다음 성장 방향으로 표현한다.

## Evidence from resume

### 1. AQIS for Smart Factory — flagship

- Role: Team Lead, Full-Stack & Robot Integration, 2인 팀
- Stack: ROS 2, FastAPI, WebSocket, React, RealSense, Dobot, YOLOv5
- Story: RealSense와 YOLOv5 검사 결과가 컨베이어 정지와 Dobot 진공 pick-and-place로 이어지는 스마트 팩토리 시스템
- Contribution: RealOps dashboard, REST/WebSocket 서비스, ROS 2 bridge, device adapters, LLM command integration
- Portfolio value: AI 인식부터 물리적 행동과 운영 UI까지 연결한 가장 강한 대표 사례

### 2. Brain Tumor MRI Classification & Segmentation

- Role: Personal project
- Stack: Python, PyTorch, YOLO11, OpenCV, NumPy
- Result in resume: Top-1 99.4%, Mask mAP50 92.7%
- Portfolio value: Computer Vision 모델링, 데이터 변환, 정량 결과를 보여주는 사례
- Verification needed: dataset, split, evaluation method, leakage control, reproducible result context

### 3. Alkkagi.io

- Role: Personal project
- Stack: React 19, TypeScript, Node.js, Express, Socket.io
- Contribution: server-authoritative 60 FPS physics, collision, friction, momentum, correction, dynamic mass/radius
- Portfolio value: Robotics 밖에서도 실시간 시스템과 full-stack 구현이 가능함을 보여주는 사례

### 4. Briefit

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

이 흐름은 AQIS의 실제 구조를 기반으로 하고, 다른 프로젝트에서는 각 단계가 어떻게 달라지는지 보여준다.

## Confirmed content structure

사이트는 한 문서에 모든 설명을 쌓지 않고 정적 멀티페이지로 구성한다.

1. `/` — Home
   - 이름, 역할, 한 문장, Name-first scroll Hero
   - 대표 작업 3개는 실제 화면을 사용한 preview로만 보여준다.
   - 짧은 소개 teaser와 이메일·GitHub·Resume를 모은 Contact 정보 패널을 둔다.
2. `/work/` — Work index
   - 공개 근거가 있는 프로젝트 전체를 이미지 중심으로 비교한다.
   - 역할과 한 문장 외의 구현 설명은 상세 페이지로 이동한다.
3. `/work/aqis/` — 실제 로봇 구동 영상, RealOps 화면, 역할, 구현 범위, 결과, 팀 저장소
4. `/work/brain-tumor-mri/` — 실제 분류 화면과 통합 데모 영상, 내부 평가 수치와 검증 범위, 저장소
5. `/work/alkkagi/` — 실제 플레이 영상, server-authoritative 60 FPS 구현, 저장소
6. `/work/briefit/` — 공식 팀 제품 이미지와 AI 담당 범위를 분리해 표시하고 팀 저장소에 연결
7. `/work/project-prompt-generator/` — 실제 LangGraph 흐름도, 구현 구조, 라이브 데모와 저장소
8. `/about/` — 프로필 사실, 개발 관점, 작업 방식, 현재 학습 범위와 기술
9. `/resume/` — 경력, 교육, 기술, 수상, 프로젝트 링크와 원본 Resume 미리보기·다운로드

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
- 공개 표기는 `SeMinKong`으로 붙여 쓰고, 문서 내부 영문 이름만 `Se Min Kong`으로 사용할 것인가?

확인된 공개 자료:

- AQIS 팀 저장소와 실제 구동 영상·RealOps 화면
- Brain MRI classification·segmentation 개인 저장소와 실제 웹 데모
- Alkkagi 개인 저장소와 실제 플레이 영상
- Briefit 공식 팀 프로필·AI 저장소·제품 이미지
- Project Prompt Generator 저장소·흐름도·라이브 데모

## Acceptance criteria

- 첫 화면에서 5초 안에 이름, 선호 직무, AI·Robotics 중심 역량을 이해할 수 있다.
- 기본 스크롤이 가로채지지 않은 채 hero 문장이 순차적으로 누적되고, 완성 후 AQIS로 자연스럽게 이동한다.
- AQIS를 통해 `인식 → 소프트웨어 → 물리적 행동 → 인터페이스` 역량을 확인할 수 있다.
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
