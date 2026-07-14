# Decision log

중요한 선택은 날짜, 결정, 이유, 영향으로 기록한다.

## 2026-07-13 — npm 사용

- Decision: 패키지 매니저는 npm만 사용한다.
- Reason: 현재 환경에 Node와 npm이 설치되어 있고 package-lock.json이 존재한다.
- Impact: PowerShell 예시는 실행 정책 문제를 피하기 위해 `npm.cmd`를 사용한다.

## 2026-07-13 — Anime.js와 2.5D 유지

- Decision: 기본 모션 엔진은 Anime.js이며 실제 Three.js는 추가하지 않는다.
- Reason: 현재 브랜드 언어는 레이어, 궤도, 신호 기반 2.5D로 충분히 표현할 수 있다.
- Impact: 대형 3D 번들 없이 성능과 모바일 접근성을 우선한다.

## 2026-07-13 — 레퍼런스는 원칙만 사용

- Decision: Sunny Patel 사이트의 카피, 자산, 구체적 레이아웃은 복제하지 않는다.
- Reason: 독창적인 결과와 프로젝트 정체성을 유지해야 한다.
- Impact: 메시지-인터랙션 연결, 제한된 컬러, 작은 모션 강도 같은 원칙만 참고한다.

## 2026-07-13 — 메인 에이전트가 통합 소유

- Decision: 메인 에이전트가 요구사항, 통합, 최종 파일 수정과 QA를 소유한다.
- Reason: 서브에이전트 병렬 작업으로 인한 컨텍스트 오염과 파일 충돌을 줄인다.
- Impact: 동일 파일을 여러 에이전트가 동시에 수정하지 않으며 병렬 코드 작업은 Worktree를 사용한다.

## 2026-07-13 — 브라우저 QA 필수

- Decision: 빌드만으로 완료 처리하지 않는다.
- Reason: 이 프로젝트의 품질은 실제 화면, 포인터, 스크롤, 반응형 동작에 의존한다.
- Impact: 390px, 768px, 1280px과 콘솔, 키보드, 모션 상태를 확인한다.

## 2026-07-14 — 역할과 대표 메시지 확정

- Decision: `AI & Robotics Software Developer`를 대표 역할로 사용하고, “AI가 인식한 것을 실제 시스템의 움직임으로 연결하는 개발자”를 핵심 메시지로 사용한다.
- Reason: AQIS의 Computer Vision, ROS 2, backend, hardware, dashboard 통합 경험을 가장 정확하게 설명하면서 일반 Software / IT 직무 확장성도 유지한다.
- Impact: AQIS를 대표 case study로 두고 Brain Tumor MRI, Alkkagi.io, Briefit 순으로 역량의 폭을 보여준다.

## 2026-07-14 — 내부 Resume 페이지 제공

- Decision: 이력서는 다운로드 CTA보다 `/resume/` 내부 HTML 페이지에서 바로 읽도록 제공한다.
- Reason: 데스크톱과 모바일에서 별도 앱이나 문서 다운로드 없이 접근할 수 있고, 포트폴리오의 시각 언어와 접근성을 유지할 수 있다.
- Impact: Hero와 Contact에 Resume 링크를 두고 Resume 페이지에는 포트폴리오 복귀, 이메일, GitHub 링크를 제공한다.

## 2026-07-14 — 모션과 깊이 자동 적용

- Decision: 사용자에게 Motion / Depth on/off 버튼을 노출하지 않는다. 지원 환경에서는 기본 활성화하고 `prefers-reduced-motion`, touch, coarse pointer, 작은 화면에서는 자동으로 단순화한다.
- Reason: 인터페이스 설정이 아닌 콘텐츠 경험으로 모션을 자연스럽게 제공하되 접근성과 기기 적합성을 보장한다.
- Impact: 수동 토글 상태 저장 코드를 제거하고 media query와 capability detection을 검증한다.

## 2026-07-14 — 완료 검증 기준 확정

- Decision: 390px, 768px, 1280px 실제 브라우저 검사와 console, horizontal overflow, keyboard, default Motion/Depth, touch/capability fallback, reduced-motion 검사를 완료 기준으로 사용한다.
- Reason: 빌드 성공만으로는 스크롤, 반응형, 접근성, 모션 품질을 증명할 수 없다.
- Impact: 브라우저에서 정확성과 부드러움을 확인하고 발견한 문제를 수정한 뒤 완료 처리한다.

## 2026-07-14 — 첫 화면 행동 경로 정리

- Decision: Hero의 주 행동은 `Selected work`와 `Contact`로 두고, 고정 내비게이션의 `Resume` 버튼과 Contact 섹션의 Resume 링크를 항상 유지한다.
- Reason: 첫 화면에서 프로젝트 탐색, 채용 연락, 이력서 열람 세 경로를 동시에 명확하게 제공하면서 Hero의 버튼 수는 두 개로 제한한다.
- Impact: 모바일에서도 상단 Resume 버튼과 Hero Contact CTA가 모두 보이며, 이력서는 별도 `/resume/` 페이지에서 읽는다.

## 2026-07-14 — 이름 중심의 scroll narrative

- Decision: Hero는 거대한 `SeMinKong` 이름으로 시작하고, native 세로 스크롤 동안 핵심 문장 세 줄이 sticky viewport 안에서 누적된 뒤 AQIS로 release되도록 구성한다.
- Reason: 기존 system HUD 중심의 첫 화면보다 포트폴리오 주인과 메시지를 빠르게 각인하면서도 사용자가 원한 역동적인 스크롤 경험을 제공한다.
- Impact: Hero canvas와 복잡한 HUD를 제거하고 Anime.js 단일 timeline을 scroll progress로 seek한다. wheel·touch 이벤트를 가로채지 않으며 reduced-motion에서는 정적인 완성 상태를 제공한다.

## 2026-07-14 — 프로젝트별 chapter identity

- Decision: AQIS, Brain Tumor MRI, Alkkagi.io, Briefit을 반복 카드가 아닌 서로 다른 full-width chapter로 구성한다.
- Reason: 프로젝트 성격과 핵심 증거를 한눈에 구분하고, 복잡한 대시보드가 아니라 선별된 작업을 보여주는 포트폴리오로 읽히게 한다.
- Impact: AQIS는 dark industrial, MRI는 icy clinical, Alkkagi는 cobalt kinetic, Briefit은 warm editorial 언어를 사용한다. 별도 Capabilities·Journey·Awards 섹션은 프로젝트와 압축된 About으로 통합한다.

## 2026-07-14 — 타이포 위계와 모션 가시성 보정

- Decision: 이름을 제외한 display typography를 20–35% 축소하고, 첫 진입·section reveal·프로젝트 visual에 목적이 구분되는 Anime.js 모션을 추가한다.
- Reason: 모든 제목이 Hero급 크기로 반복되어 포트폴리오 위계가 약했고, 기존 모션은 스크롤 seek와 30px fade 중심이라 실제 사용자가 애니메이션을 인지하기 어려웠다.
- Impact: 이름은 최대 128px, AQIS는 최대 152px, 일반 section은 최대 96px로 제한한다. Hero intro, clip reveal, MRI plate, Alkkagi impulse, Briefit flow를 기본·lite 환경에서 실행하고 reduced-motion에서는 완성된 정적 상태를 유지한다.

## 2026-07-14 — 실제 작업물 중심의 멀티페이지 전환

- Decision: Home, Work index, 프로젝트별 상세 페이지, Resume로 나뉜 Vite 정적 멀티페이지 구조를 사용한다.
- Reason: 한 페이지의 반복 chapter와 추상 시각물이 실제 작업의 증거를 가리고, 상태 번호와 짧은 시스템 문구가 템플릿처럼 보였다.
- Impact: Home은 이름·대표 preview·짧은 소개·연락만 남긴다. AQIS, MRI, Alkkagi, Briefit, Project Prompt Generator는 독립 상세 페이지에서 실제 공개 이미지·영상·저장소와 함께 설명한다. 기존 `프로젝트별 chapter identity`와 장식용 project visual 결정은 이 결정으로 대체한다.

## 2026-07-14 — 팀 프로젝트 저작 범위 표시

- Decision: AQIS와 Briefit의 공식 팀 제품 이미지를 사용하되, 각 상세 페이지에 본인 역할과 팀 저장소를 명시한다.
- Reason: 실제 결과물을 보여주면서도 제품 전체를 혼자 설계·구현한 것처럼 보이는 오해를 막아야 한다.
- Impact: AQIS는 `Team Lead · Full-Stack & Robot Integration`, Briefit은 `Team AI Engineer`로 표기하고 Briefit 화면 디자인은 담당 범위가 아님을 본문에 밝힌다.

## 2026-07-14 — 레퍼런스 원칙을 적용한 에디토리얼 재설계

- Decision: 과대형 제목과 긴 추상 Hero 대신 76px 이하의 의도적인 타이포그래피, 실제 AQIS 화면이 함께 보이는 짧은 Hero, 편집형 Work 목록, 압축된 case study와 Resume를 사용한다.
- Reason: 레퍼런스와의 가장 큰 차이는 장식의 양이 아니라 타이포그래피 비율, 정보 우선순위, 페이지 간 연결감이었다. 기존 사이트는 제목과 작은 메타의 대비가 지나치고 실제 작업이 늦게 등장했다.
- Impact: Manrope, Noto Sans KR, JetBrains Mono를 로컬 폰트로 사용한다. Home은 실제 작업을 첫 화면부터 노출하고, Work와 상세 페이지는 역할·결정·증거·결과 순서로 읽히게 한다.

## 2026-07-14 — 네이티브 스크롤 위의 시각적 관성

- Decision: Lenis 같은 scroll hijacking 계층을 추가하지 않고, Anime.js reveal과 시간 기반 rAF를 조합해 보이는 미디어에만 제한적인 후행 이동을 적용한다.
- Reason: 사용자가 느낀 관성은 전체 페이지를 강제로 이동시키는 것보다 일관된 easing, 이미지 후행, 페이지 진입·이탈 연결로 만들 수 있다. touch와 keyboard의 기본 스크롤도 보존해야 한다.
- Impact: 미디어 관성은 desktop fine pointer에서만 동작하고, reduced motion·coarse pointer·작은 화면·숨겨진 탭에서는 정지한다. 페이지 전환은 320ms 이하로 제한한다.

## 2026-07-14 — 단일 페이지 전환과 프로젝트별 한 번의 탭 정지

- Decision: 같은 origin 이동은 full 환경에서 Anime.js exit curtain 하나만 사용하고, 브라우저 cross-document View Transition은 함께 실행하지 않는다. Work 목록의 키보드 이동은 프로젝트 제목 링크 한 개를 대표 진입점으로 사용한다.
- Reason: 두 전환을 겹치면 페이지 이동이 약 700ms로 늘어나며, 같은 프로젝트의 미디어·제목·화살표를 모두 탭 정지로 두면 목록 탐색이 불필요하게 길어진다.
- Impact: reduced/lite 환경은 즉시 기본 탐색을 사용하고, full 환경의 exit는 300ms로 끝난다. 포인터 사용자는 미디어와 화살표를 계속 클릭할 수 있지만 키보드는 프로젝트마다 한 번만 멈춘다.

## 2026-07-14 — Identity-first Hero와 상징적 2.5D 객체

- Decision: Home 첫 화면의 AQIS preview를 제거하고 이름·역할·핵심 문장을 우선한 뒤, 인식·software·물리적 행동의 연결을 상징하는 `Perception Core`를 배치한다. Home 순서는 `Hero → About → Selected Work → Focus → Contact`로 변경한다.
- Reason: 프로젝트를 보기 전에 어떤 사람인지 이해하게 하고, 특정 작업 화면보다 오래 유지할 수 있는 개인 정체성을 첫 장면에 만들기 위해서다.
- Impact: AQIS는 `Selected Work`의 대표 프로젝트로 유지한다. Core는 CSS 3D와 Anime.js만 사용하고 Three.js를 추가하지 않으며, mobile / reduced-motion에서는 정적 자세로 축소된다.

## 2026-07-14 — Perception Core를 다관절 로봇 손과 불투명 큐브로 교체

- Decision: Hero 오른쪽의 추상 `Perception Core`를 열린 palm frame, 금속 링크, 원형 피벗, 노출 케이블, 짧은 actuator housing을 가진 다관절 로봇 손으로 교체한다. 불투명 큐브는 손 안에서 접촉을 교대하며 계속 재지향한다.
- Reason: 사용자의 Robotics와 Physical AI 관심을 일반적인 궤도형 장식보다 더 구체적이고 기억에 남는 개인 시각 언어로 표현하기 위해서다.
- Impact: OpenAI Dactyl / Shadow Dexterous Hand 레퍼런스는 dexterous manipulation 원리만 참고하고 제품 외형·브랜딩·문자 큐브는 복제하지 않는다. Three.js 없이 DOM/CSS 3D와 Anime.js를 유지하며 Hero scroll timeline은 텍스트와 진행선만 담당한다.

## 2026-07-14 - Silhouette-first dexterous-hand exterior

- Decision: use a tapered solid palm, five separated digit silhouettes, one bearing per joint boundary, restrained metacarpal channels, and a single aluminum/graphite lighting system.
- Reason: adding small parts made the previous object read as an insect-like linkage and a pile of bolts rather than a dexterous robotic hand.
- Impact: palm dimensions and joint hardware are reduced, digit roots are fanned along the palm edge, the rig is enlarged and tilted for a 3/4 product-render composition, and secondary details disappear on constrained layouts. Anime.js remains the motion engine and no Three.js dependency is added.
