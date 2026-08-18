# Decision log

## 2026-08-10 — Home Hero hand restoration

- Decision: Restore the dexterous-hand graphic as the Home Hero's primary visual and keep the real THING video in the first Selected Work card directly after it.
- Reason: The hand is a distinctive part of the portfolio's identity; the Featured card still gives visitors immediate access to project evidence and details.
- Impact: The existing Hero copy, two project actions, hand animation, pointer depth, lifecycle, touch, reduced-motion behavior, and low-height compact layout remain. The About teaser stays after project evidence.

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

## 2026-07-14 — Hero 로봇 손의 아래팔 제거와 직접 조작 확대

- Decision: Hero의 긴 forearm shell은 제거하고 다섯 손가락, 손바닥, 짧은 wrist coupler만 남긴다. 남은 손을 확대·재중심화하고 큐브를 손바닥 전면 위로 옮긴다. fine pointer에서는 넓은 hover 반응과 제한된 직접 drag를 제공한다.
- Reason: 아래팔이 시각적 비중을 과도하게 차지했고, 큐브가 손바닥보다 뒤에 떨어져 보였다. 기존 거리 수식은 명목 범위보다 실제 이동량이 훨씬 작아 상호작용이 억압적으로 느껴졌다.
- Impact: desktop hover는 X `±18px`, Y `±14px`, drag는 X `±32px`, Y `±24px` 범위에서 동작한다. 큐브의 수직 기준점은 rig 상단 `35%`로 두어 손바닥 위에 명확한 공중 간격을 유지한다. Anime.js master timeline, reduced motion, touch/coarse-pointer fallback, native vertical scroll, visibility lifecycle은 유지한다.

## 2026-07-14 — 별도 About와 Contact 정보 패널

- Decision: 상단 내비게이션은 `Work · About · Resume`로 단순화하고 Email 항목을 제거한다. Home의 짧은 소개는 `/about/`로 연결하며, 상세 소개는 별도 About 페이지에서 제공한다. 연락처는 Home의 `#contact` 정보 패널 한 곳에 이메일, GitHub, Resume, 위치를 모은다.
- Reason: 소개와 연락 경로를 각각 독립적인 목적지로 만들고, 반복되는 “이메일로 연락” 문구 없이 사용자가 필요한 정보를 직접 선택하게 하기 위해서다.
- Impact: 모든 route의 About 링크는 `/about/`를 가리키고, case study와 Work의 기존 Email 링크는 Contact 패널 링크로 바뀐다. backend 없는 장식용 form은 만들지 않는다.

## 2026-07-14 — 데스크톱 wheel 관성 transport

- Decision: 이전의 `Lenis 같은 scroll hijacking 계층을 추가하지 않는다` 결정을 대체한다. fine pointer와 961px 이상인 full 환경에 한해 Lenis를 wheel 관성 transport로 사용하고, Anime.js를 Hero·reveal·object·page transition의 주 모션 엔진으로 유지한다.
- Reason: 참고 사이트에서 확인한 약 0.6초의 실제 문서 scroll 감쇠를 미디어 후행 효과만으로는 재현할 수 없었다.
- Impact: `lerp 0.115`, `wheelMultiplier 0.9`, `syncTouch false`를 사용한다. 768px 이하, touch/coarse pointer, reduced motion, keyboard scroll은 native 동작을 유지하며 hidden 상태에서는 Lenis를 정지한다. 기존 미디어 관성 강도는 중복감을 줄이기 위해 절반 이하로 낮춘다.

## 2026-07-14 — 저채도 page transition

- Decision: signal green 전체 화면 curtain을 제거하고, 210ms 동안 나타나는 반투명 graphite curtain 하나만 사용한다.
- Reason: 밝은 초록색 flash가 페이지 이동보다 강조되어 부담스럽고 콘텐츠 간 연결을 끊었다.
- Impact: full desktop의 same-origin 이동에만 적용하며 hash, mail, download, 새 탭, modifier click과 reduced/lite 환경은 기본 탐색을 사용한다.

## 2026-07-14 — 웹 Resume와 원본 Resume 병행

- Decision: 기존 HTML Resume를 유지하고, 제공받은 DOCX를 변환한 1-page PDF, DOCX 원본, 렌더된 page image를 `/resume/`에서 함께 제공한다.
- Reason: 빠르게 훑는 웹 이력서와 원문 확인·다운로드 요구를 동시에 만족시키기 위해서다.
- Impact: 기존 `전화번호와 생년월일이 공개 빌드에 포함되지 않는다` 기준은 원본 문서에 한해 사용자 요청으로 예외 처리한다. 원본에는 전화번호와 생년월일이 포함되어 있으므로 실제 배포 전에 공개 범위를 다시 확인해야 한다.

## 2026-07-14 — Hero 엄지의 전면 접촉 레이어

- Decision: 로봇 손의 엄지는 큐브와 겹치는 모든 자세에서 큐브 앞면보다 위에 렌더링한다.
- Reason: 엄지가 큐브 내부로 관통해 보이면 손바닥 위에서 물체를 조작한다는 접촉 관계가 깨진다.
- Impact: 엄지의 위치와 관절 동작은 유지하고, 엄지의 3D 깊이만 `72px`로 올려 큐브 회전·hover·drag 중에도 전면 레이어를 유지한다.

## 2026-07-14 — Hero 로봇 손 2.5D 깊이 강화

- Decision: 손 전용 `880px` perspective와 절제된 3/4 자세를 사용하고, 손바닥·손가락 링크의 side wall, 손가락별 yaw/depth band, 큐브의 투영 그림자를 CSS 3D로 추가한다.
- Reason: 기존 실루엣과 관절 구조는 명확했지만 금속 면이 한 평면에 겹쳐 보여 실제 부피와 큐브의 공중 높이가 약하게 읽혔다.
- Impact: 기존 depth root의 강도만 `1.45`로 높이고 비어 있던 tilt wrapper를 parallax layer로 재사용한다. 새 런타임이나 listener는 추가하지 않으며 Anime.js 소유권, touch/native scroll, reduced motion, lifecycle을 유지한다. 엄지는 `72px`, 큐브는 `29px` 깊이를 유지해 전면 접촉 관계를 보존한다.

## 2026-07-14 — Hero 손바닥의 테이퍼 섀시화

- Decision: 손바닥을 손가락 쪽에서 펼쳐지고 손목 쪽에서 좁아지는 polygon으로 다시 만들고, 모서리 곡률·측면 오프셋·중복 그림자를 줄인다. 데스크톱에서는 중앙 graphite recess와 rail 대비로 밝은 앞판을 분할한다.
- Reason: 동일한 둥근 실루엣의 앞·뒤·측면 판이 겹치면서 손바닥이 하나의 두꺼운 쿠션이나 뭉툭한 덩어리처럼 보였다.
- Impact: 손가락, 손목, Anime.js transform은 바꾸지 않는다. 큐브 `z-index: 8 / 29px`, 엄지 `z-index: 11 / 72px`, 큐브 높이 `35%`를 유지해 기존 접촉과 조작 관계를 보존한다.

## 2026-08-10 — THING을 최우선 대표 프로젝트로 승격

- Decision: `THING`을 Home의 가장 큰 featured project와 Work index의 `01 / 06`으로 배치하고, 별도 `/work/thing/` case study를 제공한다. AQIS와 기존 프로젝트는 한 단계씩 뒤로 이동한다.
- Reason: THING은 손동작 인식, ROS 2 명령 중재, 안전 제어, 7축 텐던 구동, 관제, 실험 데이터 기록까지 현재 포지셔닝을 가장 넓게 증명하는 최신 robotics 사례다.
- Impact: Home, Work, About, HTML Resume와 프로젝트 previous/next 순서를 THING 중심으로 맞춘다. 공개 저장소에 개인별 역할 근거가 없으므로 구체적인 개인 직책은 주장하지 않는다. 공개된 실제 프로젝트 asset과 문서를 근거로 사용한다.

## 2026-08-10 — 상시 보이는 탐색 경로와 전체 카드 링크

- Decision: Hero의 행동을 `THING 프로젝트 보기`와 `전체 프로젝트`로 바꾸고, Home project card와 Work row 전체를 하나의 primary link로 만든다. 고정 내비게이션은 아래 방향 스크롤에서도 숨기지 않는다.
- Reason: 기존 Hero는 About·Resume를 중복 강조했고, 카드에서는 작은 제목과 화살표만 링크로 읽혀 touch와 빠른 훑기에서 다음 행동이 잘 보이지 않았다.
- Impact: 프로젝트 링크는 한 카드당 keyboard tab stop 하나를 유지하면서 시각적 hit area를 카드 전체로 넓힌다. `프로젝트 살펴보기 →` 라벨을 항상 노출하고, 내비게이션 링크의 대비와 최소 높이를 높인다. Anime.js reveal, page transition, depth, reduced-motion과 native touch scroll 기준은 유지한다.

## 2026-08-10 — 공개 THING 실제 미디어 우선

- Decision: 공개 전환된 THING 저장소의 최종 시연 영상은 Home featured card, Work row, THING case hero에 사용하고, 통합 텐던 핸드 사진과 Jetson·MediaPipe 시험 사진은 case evidence로 추가한다.
- Reason: 직접 만든 system visual보다 실제 시제품과 동작 증거가 프로젝트의 신뢰도와 완성 범위를 더 빠르게 전달한다.
- Impact: 영상은 muted, playsinline, viewport·visibility·reduced-motion에 따라 자동 재생을 멈추는 기존 lifecycle을 사용한다. 아래 2026-08-11 결정이 system visual 유지 방식과 preview 비율을 대체한다.

## 2026-08-11 — THING 세로 시연을 원본 비율로 편집

- Decision: Home과 Work의 THING preview를 실제 영상의 `9:16` 비율로 보여주고, 영상 내부의 depth 이동과 `cover` crop을 제거한다. Home은 세로 영상과 넓은 설명·세 가지 proof를 나란히 두며, 모바일에서는 최대 280px 폭으로 가운데 배치한다. 기존 `system-flow.svg` preview는 제거하고 동일한 흐름은 텍스트 행으로 보존한다.
- Reason: 1080×1920 시연을 16:9/16:10 프레임에 넣으면서 실제 로봇 핸드 대부분이 잘렸고, 합성 그래픽보다 실제 시제품과 동작 증거가 프로젝트를 더 빠르고 정확하게 설명한다.
- Impact: 자동 preview는 `preload="none"`과 기존 visibility/reduced-motion lifecycle을 사용한다. Hero 손 그래픽은 유지하되 track을 desktop 118svh, tablet 108–112svh, mobile 106svh로 줄여 프로젝트가 더 빨리 보이게 한다. THING 상세 Hero에는 시연, GitHub, 시스템 흐름으로 이동하는 명시적 링크를 둔다.

## 2026-08-11 — 모바일·태블릿 Hero 손의 시각 중심 보정

- Decision: 한 열 Hero가 되는 900px 이하에서는 손 rig를 컨테이너 중심에서 오른쪽으로 `44–56px` 보정하고, 화면 높이가 짧을 때는 축소된 rig에 맞춰 보정량도 줄인다.
- Reason: 외곽 컨테이너는 화면 중앙에 있었지만, 비대칭 손가락 실루엣의 실제 렌더링 픽셀 중심은 390px 화면에서 약 50px 왼쪽에 놓였다. 요소의 bounding box는 overflow된 손가락 실루엣을 온전히 반영하지 않아 캡처 픽셀 범위로 재확인했다.
- Impact: Anime.js가 제어하는 tilt·idle·finger transform은 유지하고, 정적 rig의 `left` 기준만 한 열 구도에서 조정한다. 두 열 desktop 구도는 바뀌지 않는다.

## 2026-08-11 — Home Hero 설명 문구 축약

- Decision: Hero에서 THING의 시스템 범위를 반복하던 본문을 제거하고 역할, 이름, 핵심 문장, 두 프로젝트 CTA만 남긴다.
- Reason: 동일한 내용이 바로 이어지는 Featured THING 카드와 상세 페이지에서 더 구체적으로 설명되어 첫 화면의 정보 위계만 복잡하게 만들었다.
- Impact: 프로젝트 근거와 상세 설명은 Selected Work와 `/work/thing/`에서 유지한다. Hero scroll timeline과 손 그래픽 모션은 바꾸지 않는다.

## 2026-08-11 — 모바일 Hero 손을 하단 중심 영역에 고정

- Decision: 720px 이하에서는 Hero copy를 위쪽 흐름에 유지하고, 손 wrapper를 frame 기준 절대 배치해 `65svh` 지점에서 시작한다. 내부 rig의 기존 가로 시각 중심 보정은 유지한다.
- Reason: 사용자가 표시한 목표 영역은 현재 로컬 렌더링보다 세로 약 176px 아래였으며, 단순 margin은 화면 높이에 따라 copy와 손을 함께 움직여 목표가 흔들렸다.
- Impact: 390×844에서 밝은 손 실루엣 중심은 표시 영역과 가로 0.4px, 세로 2.7px 이내로 일치한다. 721px 이상 tablet과 desktop 흐름, Anime.js transform 소유권, reduced motion은 바뀌지 않는다.

## 2026-08-11 — 증거 중심 editorial portfolio system

- Decision: Home을 01 Selected Work → 02 Focus → 03 Current → 04 Contact로 읽히는 번호 체계로 재정렬하고, Hero는 큰 이름과 두 줄 선언, 하나의 filled action, signature hand에 집중한다. Work는 큰 archive title과 line-separated project evidence rows로 구성하며, 일반 프로젝트 미디어에는 자체 metadata rail을 둔다.
- Reason: 기존 화면은 개별 요소는 완성되어 있었지만 이름, 프로젝트, 구현 범위, 다음 행동이 같은 강도로 보여 빠르게 훑을 때 핵심이 한눈에 잡히지 않았다.
- Impact: THING은 Home과 Work에서 9:16 실제 시연과 수치 근거를 함께 보여 주고, 상세 Hero에서는 제목·행동·검증 수치와 세로 시연을 첫 구간에 병치한다. case 본문은 공개 근거 aside를 두되 확인되지 않은 개인 역할은 추가하지 않는다. Contact는 signal color의 full-width editorial ending으로 전환한다. stretched link 한 개, 44px target, fixed navigation, Anime.js, touch/native scroll, depth lifecycle은 유지한다.

## 2026-08-11 — THING portrait poster와 upright evidence

- Decision: 가로로 저장된 통합 핸드 사진을 세로 방향으로 바로잡은 evidence asset과 720×1280 전용 poster를 만든다. Home, Work, THING case video는 이 poster를 사용하고 controlled video는 계속 원본 1080×1920을 contain으로 표시한다.
- Reason: 9:16 영상에 4:3 가로 사진을 그대로 poster로 사용하면 재생 전에는 큰 letterbox와 옆으로 누운 시제품이 보여, 영상 비율을 고친 뒤에도 첫 인상이 불완전했다.
- Impact: poster와 video가 동일한 9:16 frame을 공유하며 로딩 전후 crop이나 비율 jump가 없다. Built prototype evidence는 upright 3:4 사진을 사용한다.

## 2026-08-11 — THING visible-first demonstration archive

- Decision: THING case Hero는 사람 손과 로봇 손이 한 화면에 보이는 실시간 모방 시연을 사용하고, Context 뒤에는 동작 범위·손가락 웨이브·캔 파지·유연 물체 파지의 네 장면을 9:16 gallery로 제공한다. 설명은 기술 구성보다 사용자의 행동과 화면에서 확인되는 결과를 먼저 쓴다.
- Reason: 단일 최종 영상과 시스템 설명만으로는 로봇 손이 어떤 동작을 하고 서로 다른 물체를 어떻게 잡는지 한눈에 비교하기 어려웠다. 공개 저장소의 실제 시연을 순서대로 보여 주는 편이 프로젝트의 완성 범위를 더 빠르게 전달한다.
- Impact: 공개 HEVC·HLG 원본은 720×1280 H.264·SDR·faststart로 변환해 여러 브라우저에서 재생되도록 하고, 모든 수동 시연은 `preload="none"`과 장면별 poster를 사용한다. 동시에 한 영상만 재생하며 hidden·pagehide에서는 모두 멈춘다. 영상 controls에는 depth나 autoplay motion을 적용하지 않는다.

## 2026-08-11 — 저작권 범위와 별도 라이선스 우선 원칙

- Decision: 모든 페이지 footer에서 `/copyright/`로 연결하고, 개인의 비영리적 교육·참고를 위한 웹 열람과 원본 링크 공유만 기본 허용한다. 관련 법령이 허용하는 경우를 제외한 복제·재게시·수정·AI 학습·상업적 이용에는 사전 서면 허락을 요구한다.
- Reason: 짧은 저작권 표지만으로는 사용자가 허용 범위와 금지 범위를 구분하기 어렵고, 단순히 `교육용`이라고 쓰면 학교 수업·개인 학습·유료 교육을 동일하게 오해할 수 있다.
- Impact: SeMinKong이 저작권을 보유하고 별도 라이선스가 없는 사이트 콘텐츠에만 기본 고지를 적용한다. 공개 저장소의 `LICENSE`·`NOTICE`, 팀 공동 산출물과 제3자 권리는 각 조건과 권리자가 우선한다. THING 시연에는 C103 Team 귀속과 저장소의 라이선스 안내 링크를 가까이 표시한다.

## 2026-08-11 — Home Hero 탐색 CTA 단순화

- Decision: Home Hero의 첫 버튼은 전체 프로젝트 목록으로 연결되는 `프로젝트`, 두 번째 버튼은 소개 페이지로 연결되는 `About`으로 구성한다.
- Reason: 기존 두 버튼이 모두 프로젝트 경로를 가리켜 선택지가 중복되어 보였다. 첫 화면에서는 사이트의 두 핵심 탐색 축을 명확히 제시한다.
- Impact: THING 상세 페이지로 바로 이동하는 Hero 링크는 제거하지만, 바로 다음 Selected Work에서 THING을 최우선 대표 프로젝트로 계속 노출한다.

## 2026-08-11 — 이름 중심의 단계형 Hero 스크롤

- Decision: Home Hero의 초기 텍스트는 `SeMinKong` 이름만 보이게 하고, 스크롤 진행에 따라 역할, 핵심 문장 첫 줄, 두 번째 줄, 프로젝트·About 버튼을 순서대로 누적 노출한다. 손 그래픽은 정체성을 유지하기 위해 처음부터 보인다.
- Reason: 기존 Hero는 모든 문구가 동시에 나타나 첫 인상이 정적이고 정보 우선순위가 약했다. 이름을 기준점으로 고정하고 문장을 한 줄씩 읽게 하면 첫 화면의 집중도와 스크롤 서사가 모두 선명해진다.
- Impact: Home Hero track은 화면 크기별 약 142–158svh로 확장한다. 애니메이션은 opacity·translate·clip만 사용하며 역스크롤에 반응한다. Tab 키 또는 CTA focus가 감지되면 즉시 완성 상태로 전환하고, reduced motion이나 스크립트 실패 시 전체 콘텐츠를 기본 상태로 표시한다. Hero CTA 글자는 약 14–15px, 굵기 650으로 제한해 다른 버튼 체계에는 영향을 주지 않는다.

## 2026-08-11 — 초기 Hero 이름·손 중심 구도와 상향 이동

- Decision: 스크롤 0에서는 공유 page grid 안에 `SeMinKong`과 기존 손 그래픽만 남겨 두 요소의 합성 시각 중심을 맞춘다. 스크롤 중에는 identity 바깥 wrapper를 최대 32px, 손 바깥 wrapper를 최대 24px 위로 이동하면서 역할·문장·버튼을 누적 표시한다.
- Reason: 숨겨진 단계 문구가 레이아웃 공간을 유지하더라도 이름과 손의 두 열 구도는 안정적으로 중앙에 남고, 새 문구가 등장할 때 정적인 fade보다 자연스러운 공간 변화가 필요했다.
- Impact: 손 내부 DOM, responsive rig 중심 보정, Anime.js manipulation, depth transform은 변경하지 않는다. enhanced CSS가 아직 시작하지 않은 문구를 계속 숨겨 초기 상태의 flash를 막고, keyboard·reduced motion·스크립트 실패 시에는 기존처럼 전체 정보를 즉시 표시한다.

## 2026-08-14 — Midnight evidence deck visual system

- Decision: 전역 팔레트를 green-black에서 midnight ink, electric cobalt, icy cyan으로 전환하고 Home의 대표 프로젝트 세 개를 `System deck`으로 구성한다. 포켓몬 브랜드나 카드 그래픽을 복제하지 않고 프로젝트 결과, 역할, 실제 미디어, 검증 가능한 근거를 카드의 정보 위계로 사용한다.
- Reason: 기존 구성과 signature hand는 강하지만 lime 중심의 terminal 인상이 컸고, 대표 프로젝트 간 비교와 기억 지점이 약했다. 중성 표면과 한 번의 명확한 deck interaction이 기술 포트폴리오의 전문성과 개성을 함께 유지한다.
- Impact: Home에서만 961px 이상 fine-pointer·full-motion 환경에 Anime.js stack/spread를 적용한다. tablet, mobile, coarse pointer, reduced motion은 처음부터 2열 또는 1열의 정적 카드로 읽힌다. Work archive는 기존 editorial row를 유지한다. Hero의 단계형 공개와 로봇 손은 보존하며 두 번째 Hero CTA는 직접 연락 경로인 `Contact`로 바꾼다.

## 2026-08-14 — Project deck transform ownership

- Decision: `.project-deck__slot`만 stack/spread transform을 소유하고, 내부 `.project-card`는 hover/focus lift, media는 정적 evidence framing을 소유한다. reveal은 deck wrapper 한 번에만 적용한다.
- Reason: 기존 reveal, stretched link, media depth와 같은 노드에서 transform을 공유하면 inline style이 서로 덮이거나 겹친 카드의 focus 영역이 불안정해진다.
- Impact: 펼침 거리는 stage의 실제 폭과 카드 폭으로 계산해 마지막 카드가 container 안에 머문다. keyboard focus는 즉시 펼침 상태를 만들고, resize·offscreen·hidden·pagehide에서는 진행 중 motion을 정리한다. 960px 이하에는 inline transform을 무효화하는 CSS fallback도 둔다.

## 2026-08-14 — 디지털 현대미술관 시각 언어

- Decision: 기존 midnight SaaS 표면을 museum black, warm plaster, graphite, tonal ultramarine 기반의 전시 카탈로그 시스템으로 교체한다. Home은 전시실의 명암 전환을 사용하고 Work·About·Resume·Copyright는 paper archive, case study는 dark gallery로 구분한다.
- Reason: 기존 cobalt·cyan glow, 큰 radius, glass gradient는 완성도는 높지만 AI SaaS 제품 페이지에 가까웠다. 포트폴리오에서는 프로젝트 미디어와 검증 가능한 결과가 장식보다 먼저 보이고, 지원자의 취향은 타이포·여백·캡션 체계에서 드러나는 편이 더 설득력 있다.
- Impact: 카드 덱과 Hero의 Anime.js transform ownership, stretched link, keyboard focus, touch/native scroll, reduced-motion fallback은 변경하지 않는다. 실제 미디어 로딩 정책도 유지한다. 색상은 dark/light surface별 ultramarine tone을 사용해 작은 링크와 metadata가 4.5:1 이상의 대비를 갖도록 한다.

## 2026-08-14 — Neutral field with vermilion wayfinding

- Decision: Replace the large ultramarine Contact field and remaining blue/cyan accents with charcoal, bone paper, and two contrast-safe vermilion tones. Vermilion acts as wayfinding, never as the dominant surface.
- Reason: The prior blue field occupied about 15% of the opening-page colour area and competed with the project media. A mostly neutral field lets evidence remain the visual subject while preserving a distinctive museum signal.
- Impact: Contact becomes graphite with a thin signal rule; deck metadata, focus rings, hand tendons, cube faces, and favicons share the same signal family. Theme metadata follows the new dark/paper bases. Motion, layout, touch, and reduced-motion behaviour are unchanged.

## 2026-08-14 — Stable deck entry and visible-first information

- Decision: A collapsed deck spreads before any rear slot can become active, and essential Hero copy is visible and clickable from the initial viewport instead of being gated by scroll progress.
- Reason: Entering the stack through its exposed lower edge could hit the third card first, raise it above the front card, and send it across the deck after its stagger. Separately, opacity-zero Hero copy made the role, value statement, and navigation actions appear missing to a first-time reviewer.
- Impact: Pointer activation is deferred until deck motion settles while keyboard focus remains immediate. Hero scroll motion now uses restrained translation without hiding content; reduced-motion and static responsive fallbacks are unchanged.

## 2026-08-14 — About tool catalogue with progressive logo enhancement

- Decision: Replace the small text-pill tool list with four monochrome catalogue groups and always-visible technology names. Use Simple Icons for ten supported technologies and `RS`/`DB` monograms for RealSense and Dobot rather than substituting unrelated brands.
- Reason: Recognizable marks improve scanning, but a logo-only wall would reduce accessibility and make uncommon tools ambiguous. The catalogue grouping also explains how the tools relate to the candidate's work.
- Impact: The About entry bundles only the selected icon paths, preserves text and monogram fallbacks when JavaScript fails, and keeps marks decorative to assistive technology. Technology names and marks remain the property of their respective owners and are used only for identification.

## 2026-08-14 — Current stack content refresh

- Decision: Replace the previous twelve-item About catalogue with the requested thirteen-item stack, ordered as Robotics, Code, AI / Agents, and Systems. Lead with ROS 2, NVIDIA Isaac Sim, and Isaac Lab, then show C++, Python, FastAPI, PyTorch, Ollama, llama.cpp, LangChain, Ubuntu, Git, and Docker.
- Reason: The new list reflects the tools the portfolio owner wants recruiters to associate with current simulation, robotics, local-AI, and delivery work while preserving the established gallery index instead of copying a multicolour badge wall.
- Impact: Isaac Sim and Isaac Lab share the monochrome NVIDIA identification mark, while their visible names disambiguate the products. `llama.cpp` keeps an `L.CPP` monogram because the bundled icon set has no exact project mark. The catalogue remains four columns on desktop/tablet, two columns on small screens, and readable without JavaScript. Variable item counts stretch within equal-height rails so every column finishes on one baseline instead of leaving a blank final row.

## 2026-08-14 — Direct, noun-led interface copy

- Decision: Remove exhibition-style framing labels and sentence-form display copy across Home, Work, About, Resume, Copyright, and all six case studies. Use short noun headings, factual metadata, and dot-separated project summaries instead.
- Reason: Labels such as `Exhibit`, `Exhibition deck`, and `Selected` described the visual concept rather than the candidate's work. They added a synthetic curatorial voice and slowed portfolio scanning.
- Impact: The gallery visual system and project-deck interaction remain intact, while visible hierarchy now prioritizes project names, roles, technologies, outcomes, and actions. Body explanations and accessibility text remain descriptive; media frames collapse their label rail when no factual label is present.

## 2026-08-14 — Uninterrupted opening fields

- Decision: Remove the full-height 64% Home guide and 58% About guide from their Hero backgrounds.
- Reason: The 1px decorative rules read as accidental panel seams instead of useful hierarchy, cutting through the opening compositions on both dark and paper surfaces.
- Impact: Home and About now use uninterrupted opening fields. Section rules, catalogue rails, card borders, layout, motion, and responsive positioning remain unchanged.

## 2026-08-14 — Static portfolio deployment adapter

- Decision: Keep Vite as the production builder and ship a minimal Cloudflare Workers-compatible entry that forwards every request to the generated static asset binding.
- Reason: The portfolio is a pre-rendered multi-page site and does not need application-server rendering, while the hosting contract still requires a worker entry point.
- Impact: The existing HTML routes, relative asset URLs, navigation, motion, and browser behavior remain unchanged. Distribution verification now requires the worker entry alongside the fifteen user-facing deployment files.

## 2026-08-14 — Web-ready MRI demonstration

- Decision: Re-encode the Brain Tumor MRI screen recording as H.264 High Profile with AAC audio and fast-start metadata while preserving its 1320×1032 frame and 51.53-second duration.
- Reason: The original 37.38 MB encode delayed case-study evidence and exceeded the practical source-upload envelope despite containing mostly compressible screen content.
- Impact: The deployed asset is 3.64 MB and measures 0.9962 full-frame SSIM against the original. The case-study markup, controls, aspect ratio, and visible content are unchanged.

## 2026-08-14 — Single-link project previews

- Decision: Keep one semantic detail link per Home card and Work row, and let pointer events pass through decorative preview media to that existing stretched link.
- Reason: A separate anchor around each image or silent preview video would duplicate navigation for assistive technology and add a second keyboard stop. The Work copy wrapper also must remain transform-free after reveal so its absolute link overlay uses the positioned row, rather than the smaller copy column, as its containing block.
- Impact: All nine project previews respond to pointer clicks, right-click, and touch through the same route as their project title. Deck spreading, depth tracking, autoplay previews, focus outlines, and the one-tab-stop-per-project model remain unchanged.

## 2026-08-18 — Stronger type hierarchy and unified Resume artifacts

- Decision: Raise the shared display, heading, interface, metadata, and body weights while keeping the existing Manrope, Noto Sans KR, and JetBrains Mono roles. Synchronize THING across the browser Resume, DOCX source, one-page PDF, and preview image.
- Reason: The previous 420–520 weight range made major headings and small factual labels feel visually weak across the gallery system. The downloadable Resume also lagged behind the site and omitted the current flagship robotics project.
- Impact: Large headings use heavier but less compressed tracking and line height, Korean titles retain readable spacing, and responsive long titles receive safer clamps. THING now leads the downloadable Resume using team-scoped, verifiable system facts; DOCX, PDF, and preview are generated from the same content and remain a single A4 page.

## 2026-08-18 — Detail cleanup and reduced-motion fit

- Decision: Remove the last CSS-generated Home subtitle and center the internal robotic-hand rig only when mobile reduced-motion mode returns the hand to document flow.
- Reason: `SELECTED / 2026` contradicted the direct noun-led copy rule, while the normal mobile hand offset produced a 35px document overflow after reduced motion changed its containing layout.
- Impact: The visible Home hierarchy begins directly with `Projects`. Full and lite motion retain their existing hand position; the reduced static hand fits within 390px with no horizontal scroll.

## 2026-08-18 — Home Hero 인사말 전환

- Decision: Home Hero에서 직무·지역 라벨을 제거하고 `Vision · Robotics / Systems`를 `안녕하세요! 새로운 것을 배우고 직접 만드는 일이 즐겁습니다.`로 교체한다.
- Reason: 첫 화면을 기술 키워드 나열보다 지원자의 태도와 성향이 바로 느껴지는 자연스러운 자기소개로 시작하기 위해서다.
- Impact: 기존 두 줄 reveal과 Hero motion은 유지한다. 직무 적합성은 프로젝트, About, Resume에서 계속 증명하며 새 한글 문구는 390px·768px·1280px에서 잘림 없이 보여야 한다.

## 2026-08-18 — 개인 중심 Profile과 SK 모노그램

- Decision: Resume Profile은 특정 프로젝트 요약이 아니라 전공, 기술 범위, 학습 태도, 구현 방식을 설명한다. THING의 상세 시스템 설명은 Projects와 case study에만 두고 개발 기간은 `Jul 2026 - Aug 2026`으로 통일한다.
- Reason: 일반 자기소개가 THING의 기능 목록으로 시작하면 지원자의 전체 역량과 확장성이 한 프로젝트에 가려진다. 기존 작은 사각 신호 마크와 `AI & Robotics Software Developer` 문구도 새 Home 인사말과 넓어진 정체성을 충분히 반영하지 못했다.
- Impact: Home, About, Resume, Work, THING case, DOCX, PDF, preview PNG가 같은 기간과 개인 중심 소개를 사용한다. 헤더와 favicon은 동일한 `SK` 모노그램을 사용하고, 프로젝트 증거와 기술 스택은 그대로 유지한다.

## 2026-08-18 — 저작권 페이지의 단순한 읽기 흐름

- Decision: Copyright 섹션의 `01–04` 장식 번호를 제거하고, 도입 문장은 의미 단위로 두 줄 배치하며, 목록에는 하나의 원형 표식만 사용한다.
- Reason: 장식 번호가 정보 탐색에 기여하지 않았고 브라우저 기본 목록 점과 CSS 표식이 겹쳐 Markdown이 깨진 것처럼 보였다.
- Impact: 섹션 제목과 의미 구조는 유지한다. 작은 화면에서는 도입 문장이 고정 줄바꿈에 얽매이지 않고 자연스럽게 감긴다.
## 2026-08-18 — 탭 크기에 맞춘 SK 파비콘

- Decision: 브라우저 탭 파비콘은 테두리 장식을 제거한 고대비 `SK` 타일로 단순화하고, 모든 route가 동일한 versioned favicon URL을 사용한다.
- Reason: 16px 탭 크기에서는 기존 세부 형태가 구형 사각 신호 마크처럼 보였고, 브라우저 캐시 때문에 새 자산이 즉시 반영되지 않았다.
- Impact: 페이지 헤더의 SK 정체성과 색 체계는 유지하면서 탭에서는 획과 색면을 크게 사용한다. 파비콘을 다시 바꿀 때 URL 버전도 함께 갱신한다.

## 2026-08-18 — Hero 지연 구간의 위치 연속성

- Decision: Home Hero의 인사말과 CTA는 각 Anime.js segment가 시작되기 전에도 해당 segment의 시작 Y 위치를 유지한다.
- Reason: 콘텐츠를 처음부터 보이도록 바꾼 뒤에도 지연된 tween은 시작 시점에만 translate 값을 적용해, 스크롤 경계를 지날 때 문구와 버튼이 아래로 튀었다가 올라왔다.
- Impact: 타임라인 순서와 스크롤 거리는 유지하면서 정방향·역방향 스크롤의 위치 변화가 연속적으로 이어진다. reduced-motion에서는 기존처럼 transform을 제거한다.

## 2026-08-18 — 이름 중심 Hero와 경계 없는 손 조명

- Decision: full/lite Home Hero는 이름과 손만 보이는 상태로 시작하고, 스크롤에 따라 인사말과 CTA를 누적 노출하면서 기존 완성 배열로 이동한다. 손 뒤 조명은 장면 사각형 안쪽에서 완전히 투명해지는 타원형으로 제한한다.
- Reason: 모든 문구가 처음부터 보이면 이름 중심의 스크롤 서사가 사라지고, 손 장면의 넓은 그림자가 3D 합성 경계를 따라 사각 이미지처럼 보였다.
- Impact: 이름·손의 외곽 wrapper와 문구만 Hero timeline이 제어한다. 반응형 breakpoint를 넘는 resize에서는 현재 scroll progress를 보존한 채 offset을 다시 읽는다. 손 내부 manipulation, depth, native scroll은 유지하며 keyboard, reduced motion, 실패 fallback에서는 전체 정보를 즉시 표시한다.

## 2026-08-18 — Hero 읽기 구간과 cube finale

- Decision: Home Hero를 `6000` 단위 scroll timeline으로 확장하고, CTA가 완성되는 `4100`부터 `4920`까지 읽기 구간을 둔 뒤 `4920–5820`에 cube finale를 실행하고 `5820–6000`을 정착 상태로 유지한다. Full은 Y축 네 바퀴와 중간에 `180deg`까지 갔다 돌아오는 X축 tumble, lite/mobile은 Y축 두 바퀴, reduced motion은 정지 상태를 사용한다.
- Reason: 인사말과 행동을 읽을 여유를 보존하면서 Hero 끝에는 더 분명하고 기억에 남는 움직임을 주기 위해서다.
- Impact: Hero timeline은 새 cube flourish wrapper만 추가로 소유한다. Finale와 final hold 동안 기존 manipulation과 pointer transient는 잠시 멈추고 역스크롤로 구간을 벗어나면 다시 시작한다. 반응형 track은 desktop부터 `175 / 170 / 165 / 160svh`를 사용하고, 짧은 mobile은 최소 `1020px`을 확보한다. Keyboard·reduced-motion·실패 fallback은 완성된 정적 상태로 바로 이동한다.

## 2026-08-18 — Cube finale 회전 수 절제

- Decision: Hero cube finale의 Y축 회전을 full `4 → 1.5`바퀴, lite/mobile `2 → 1`바퀴로 줄이고, full X축 tumble peak를 `180 → 90deg`로 낮춘다. 읽기 hold, 피날레 길이, lift와 easing은 유지한다.
- Reason: 네 바퀴는 프로젝트 진입보다 큐브 자체에 시선을 과도하게 머물게 했고, 사용자가 선호한 원래의 약 한 바퀴 반보다 장식성이 강했다.
- Impact: 같은 스크롤 거리에서 회전 속도가 낮아지고 피날레가 Hero의 마침표로 보인다. Full scroll은 `540deg`의 반대 면을 final hold에 유지하고 lite/mobile은 `360deg`로 원래 면에 정착한다. Keyboard settlement는 장식 회전을 건너뛰고 중립 면을 유지하며, reduced-motion과 기존 transform ownership은 바뀌지 않는다.

## 2026-08-18 — Cube finale 속도 곡선 완화

- Decision: full `1.5`회전과 lite/mobile `1`회전은 유지하되, Y축의 빠른 3단 회전을 `5000–6600`의 단일 `inOut(2)` tween으로 바꾼다. 전체 timeline은 `6800`, reading hold는 `4100–5000`, final hold는 `6600–6800`으로 확장한다.
- Reason: 중간 경계에서 속도가 급변하는 느낌을 줄이고 같은 회전 수를 더 자연스럽게 보여 주기 위해서다.
- Impact: X/Z/lift만 `5000–5500–6200–6600`의 보조 구간을 유지한다. 회전 수, X축 `90deg` peak, lift 제한, 손의 안정성, keyboard/reduced-motion fallback과 반응형 track 높이는 바뀌지 않는다.

## 2026-08-18 — Cube finale와 기본 loop의 겹침 인계

- Decision: Hero cube finale에서는 기존 manipulation master를 `5000–6400`에만 멈추고, `6400`부터 보존된 phase에서 다시 실행한다. `6400–6600`에는 scroll flourish의 감속과 기본 loop를 겹치며 pointer interaction은 계속 잠근다.
- Reason: `6600`까지 완전히 정지한 뒤 loop를 다시 켜면 미세한 재출발감이 생긴다. 마지막 `200` 단위에서 두 wrapper의 움직임을 겹치면 추가 회전 없이 기존의 느린 동작으로 자연스럽게 이어진다.
- Impact: Full `540deg`, lite/mobile `360deg`, `6800` timeline, 축 제한과 반응형 geometry는 유지한다. 역스크롤은 `6400` 아래에서 다시 pause하고 `5000` 아래에서 resume한다. Full/lite master를 다시 만들 때는 기존 iteration progress를 이관하며, keyboard·reduced-motion·실패 fallback과 hidden/offscreen pause가 항상 우선한다.

## 2026-08-18 — Copyright source-only AI easter egg

- Decision: Copyright HTML에 승인된 `AI VISITOR NOTE`를 렌더링되지 않는 `<template>`으로 보관한다.
- Reason: 화면의 읽기 흐름과 접근성을 바꾸지 않으면서 소스 안에 포트폴리오 성격에 맞는 유머를 남기기 위해서다.
- Impact: 이 문구는 보안·저작권 집행·크롤러 차단 수단으로 간주하지 않는다. visible DOM, 접근성 트리, motion, SEO 본문은 변경하지 않으며 공격적인 prompt override나 개인정보 관련 지시는 넣지 않는다.
