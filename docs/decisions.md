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

## 2026-08-20 — 배포판 기준 레거시 코드 정리

- Decision: 렌더링에 관여하지 않는 코드를 저장소에서 제거한다. `max-width: 0px`로 보관하던 구세대 손 지오메트리와 정밀 디테일 실험 아카이브, featured-work·proofs·deck hint·frame-label 등 어떤 라우트도 참조하지 않는 선택자, 레거시 전용 custom property, WebP 전달본으로 대체된 THING 원본 사진 3장을 삭제하고, 네 곳에 중복 정의된 `clamp`와 두 곳의 `springStep`을 `src/motion/utils.js`로 통합한다.
- Reason: 비활성 아카이브와 죽은 선택자는 cascade에 영향을 주지 않으면서 파일 크기, 빌드 산출물, 코드 탐색 비용만 키우고, 과거 구현은 git 이력(v1.3.0 이전)으로 언제든 복원할 수 있기 때문이다.
- Impact: `site.css`가 4,272줄에서 2,659줄로, 배포 CSS 합계가 약 213KB에서 182KB로 줄어든다. 계산된 스타일, 모션 튜닝 값, 마크업, 접근성 트리는 변경하지 않는다. 검증은 빌드 산출물 규칙 비교(제거된 75개 규칙 전수 확인)와 라우트별 스크린샷 픽셀 비교로 수행한다.

## 2026-08-20 — 디자인 디테일 폴리시

- Decision: Hero 인사말에 `text-wrap: balance`를 적용해 마지막 줄 고아 단어를 없애고, 960px 이하에서 project deck 슬롯의 고정 높이를 `auto`로 풀어 카드가 콘텐츠에 맞게 접히도록 한다. 작은 mono 라벨 자간을 0.08em(디스플레이 숫자만 0.12em)으로 통일하고, 본문 타입을 `--type-body-sm/--type-body/--type-body-lg/--type-lead` 4단계 토큰으로 수렴하며, 장문 문단 최대 폭 `--measure: 640px`를 케이스·이력서·저작권 라우트에 적용한다. 케이스 미디어 레터박스의 구세대 그린 계열 검정(#050806, #07100d)과 카드 레터박스(#090b12)를 웜 차콜(#070605, #0e0d0b, var(--bg))로 교체하고, 이전 Hero 구성의 잔여 `.hero-identity__role` 스타일을 제거한다.
- Reason: 44개 라우트×뷰포트 계측과 확대 검수에서 나온 8건의 디테일 지적을 해소하기 위해서다. 한국어 본문 권장 글줄(≈45자)과 웜 팔레트 일관성, 라벨 트래킹 단일화가 목적이다.
- Impact: 모바일 홈 길이가 약 380px 줄고, 케이스·저작권 문단이 640px에서 줄바꿈된다. 내비/버튼의 mono·산세리프 병용과 페이지 h1 굵기(680)는 확인 결과 이미 일관적이라 유지한다. 검증은 전 라우트 스크린샷 회귀(변경 밴드가 의도 영역과 일치하는지 확인)와 콘솔 에러 0 기준으로 수행했다.

## 2026-08-20 — Lannino 융합 1단계와 GSAP 정책 완화

- Decision: `docs/lannino-design-reference.md`를 근거로 마이크로 인터랙션 1단계(줄 마스크 타이틀 리빌, 자석 CTA, 링크 언더라인 슬라이드)를 Anime.js + `src/motion/utils.js` spring으로 구현한다. 소유자 승인에 따라 `AGENTS.md`의 "Anime.js 유지" 규칙을 "기본은 Anime.js, GSAP은 명확히 우월한 패턴(스크럽 스크롤 초레오그래피, 핀 시퀀스, 반복 텍스트 분할)에 한해 패턴 단위 도입"으로 완화한다.
- Reason: 1단계 패턴은 GSAP 대비 표현력 차이가 없고 GSAP 코어+플러그인은 gzip 기준 약 35KB를 추가하며 모션 시스템을 이원화한다. 반면 lannino류 레퍼런스의 고급 스크롤 연출을 후속 단계에서 도입할 때는 ScrollTrigger가 자체 구현보다 명확히 유리하다.
- Impact: reduced 모드는 전 라우트 픽셀 패리티를 유지한다(11개 라우트 중 10개 0px, 1개는 영상 프레임 노이즈 1px). 분할된 제목은 애니메이션 종료 후 원본 텍스트로 복원된다. 2단계(커서 팔로워 라벨)와 3단계(강조어 점화)는 별도 브랜치로 진행하며, GSAP 도입 시 번들 크기 변화를 PR에 기록한다.

## 2026-08-20 — 이름 강조 레이어 (phase 1.5)

- Decision: Hero 이름의 글자별 마스크 등장과 이름·워드마크 hover 가변 weight 웨이브, Focus 키워드 점화 밑줄(`is-revealed` 상태 클래스 기반)을 추가한다. Hero 이름의 마스크는 상시 스타일이 아니라 등장 중 h1에만 임시 적용해 다른 모드의 레이아웃을 바꾸지 않는다.
- Reason: 사이트의 가장 큰 타이포 요소인 이름에 상호작용 정체성을 싣고, Focus 키워드를 lannino 레퍼런스의 강조어 원칙으로 번역하기 위해서다. Manrope가 가변 폰트라 weight 웨이브를 추가 자산 없이 구현할 수 있다.
- Impact: reduced 픽셀 패리티는 홈의 점화 밑줄 3개(정확히 204px, 의도된 신규 상태)를 제외하고 전 라우트 0px. hover wave는 종료 시 인라인 스타일을 완전히 제거하며, 이름은 aria-label과 원문 텍스트를 유지한다. 초기 구현에서 이름 span에 상시 `display: block`을 줬다가 히어로 레이아웃이 밀리는 회귀를 픽셀 패리티로 잡아 임시 마스크 방식으로 교정했다.

## 2026-08-20 — 마이크로 인터랙션 스위트 (phase 2)

- Decision: 커서 팔로워 라벨, hover 미디어 줌, `is-revealed` 기반 점화 컬러(케이스 라벨·About 번호), Contact 행 스태거, 버튼 press dip을 추가하고 마퀴는 보류를 유지한다. 점화는 밑줄 같은 신규 요소 대신 `html.js` + `:not(.is-revealed)` 사전 상태로 구현해 최종 상태와 reduced·no-JS 픽셀을 기존과 동일하게 유지한다.
- Reason: "전부 적용하되 부담스럽지 않게"라는 요청에 맞춰, 정적 상태를 바꾸지 않는 hover·진입 시점 모션만 추가했다. 케이스 증거 프레임 줌 제외와 마퀴 보류는 lannino 레퍼런스 문서의 절제 경계를 따른다.
- Impact: reduced 픽셀 패리티 전 라우트 0px(이번 단계는 신규 정적 요소가 없음). GSAP은 이번에도 불필요해 anime.js + 자체 spring을 유지했다. 커서 칩은 본문 텍스트를 가리지 않도록 pointer-events 없음 + 스크롤 시 숨김.

## 2026-08-20 — GSAP ScrollTrigger 도입: 시그널 스레드와 큐브 팔레트 정리

- Decision: "웹 전체 흐름을 담당하는" 스크롤 연출로 시그널 스레드(좌측 진행 레일 + 섹션 점화 노드)를 도입하고, 완화된 정책의 첫 GSAP 사용처로 ScrollTrigger scrub을 채택한다. Hero 큐브는 상시 red·paper 면 대비를 줄여 웜 차콜 5면 + 버밀리언 1면(top)으로 통일하고, 이제 렌더링에 관여하지 않게 된 구세대 그린 면 선언을 제거한다.
- Reason: 스레드는 motion-spec의 브랜드 의도(선=정보 흐름)를 사이트 전역에서 구현하는 연출이고, 문서 전체 진행도와 가역 점화는 scrub 기반 ScrollTrigger가 자체 구현보다 명확히 유리한 지점이다. 큐브는 회전 중 red·white 면이 상시 노출되어 손·배경과 부딪히는 문제를 소유자가 지적했다.
- Impact: GSAP 청크는 데스크톱 비 reduced에서만 지연 로드된다(총 gzip 약 67KB). 모바일·reduced 화면은 레일이 없고 기존과 동일하다. 큐브 색은 모든 티어에 적용되는 의도된 시각 변경이며, 피날레는 red 면으로 정착해 시그널 컬러의 서사(신호 수신)가 완성된다.

## 2026-08-20 — 챕터형 핀 스크롤 도입 (banhmivietnam 레퍼런스)

- Decision: 소유자가 지목한 banhmivietnam.xyz류 스크롤 스토리텔링을 THING 시연(핀 4장면)과 홈 Focus(핀 3챕터)에 도입하고, 증거 숫자 카운트업을 추가한다. 기존 마크업(figure 카드, focus 행)을 재사용해 콘텐츠 이중화 없이 데스크톱 full에서만 스테이지화한다.
- Reason: 이 장르의 핀+스크럽+스냅은 ScrollTrigger의 핵심 영역이고, THING 시연 4개와 Focus 3키워드는 챕터 구조를 이미 갖춘 콘텐츠다. 케이스 증거를 가리지 않는 선에서 "스크롤이 장면을 넘기는" 경험을 사이트 서사(시연·역량)에만 부여한다.
- Impact: 모바일·lite·reduced는 DOM·스타일 변화가 없다(클래스 미부착 구조 보장). Lenis와 ScrollTrigger는 gsap-loader에서 1회 연결한다. 프로브 과정에서 인스턴트 점프+snap 조합이 비단조로 보이는 계측 함정을 확인했고, 실제 휠 스크롤 기준 01→04 단조 진행과 12틱 연속 고정 유지를 검증했다.

## 2026-08-21 — 진행 UI 제거와 Work 중심 스크롤 연출

- Decision: 상단 page progress, 좌측 signal thread, Home Hero 하단 progress를 전부 제거한다. Home Focus와 THING Demos는 정적 구조로 복귀시키고, GSAP scrub 연출은 Work의 여섯 프로젝트 chapter에 집중한다.
- Reason: 진행 표시가 콘텐츠보다 먼저 보였고, Home Focus readout의 누락된 스타일과 breakpoint cleanup 결함, THING Demos의 viewport보다 큰 pin stage가 실제 레이아웃 파손과 불편한 숫자 UI를 만들었다. Work는 사용자가 명시적으로 프로젝트별 fancy scroll 소개를 원한 페이지다.
- Impact: Work desktop full은 sticky media + 좌우 교차 chapter와 가역 scrub을 사용하며 snap이나 입력 가로채기는 없다. tablet/mobile/reduced는 정적 목록이다. THING 영상은 다시 native controls 기반 2열/1열 gallery가 되고 Home Focus에는 세 키워드만 남는다. 사용하지 않는 signal-thread/scroll-story 모듈과 관련 CSS를 제거한다.

## 2026-08-21 — About을 현재의 질문으로 설명

- Decision: `개발 방식`의 추상적인 3단계 카드를 `요즘 붙잡고 있는 질문`의 Retargeting, Sim-to-real, Local AI 세 행으로 교체한다.
- Reason: 일반화된 명사와 동일한 높이의 번호 카드가 지원자 고유의 관심보다 템플릿을 먼저 떠올리게 했다. 현재 프로젝트와 학습 도구에서 실제로 이어지는 질문이 지원자의 방향을 더 자연스럽고 정직하게 설명한다.
- Impact: 문구는 달성한 성과가 아니라 `공부하고 있습니다`, `탐색하고 있습니다`의 현재형으로 제한한다. 시각 구조는 큰 빈 카드 대신 topic, 질문, 짧은 현재 note를 가진 horizontal editorial rows를 사용하고 모바일에서는 한 열로 쌓는다.

## 2026-08-21 — Work chapter 프레이밍과 접근성 폴리시

- Decision: Work chapter의 필수 copy는 항상 opacity 1로 유지하고, GSAP scrub은 미디어·번호·방향 화살표에만 적용한다. THING은 viewport 높이에 맞춘 9:16 frame, AQIS·MRI·Briefit·Prompt Generator는 전체 화면이 보이는 16:9 contain frame, Alkkagi는 native에 가까운 1:1 frame과 27KB poster를 사용한다.
- Reason: 이전 equal frame은 UI screenshot의 좌우를 잘랐고, THING은 짧은 desktop에서 viewport를 넘었으며, copy의 0.34–0.38 opacity는 링크가 활성인 상태에서 작은 텍스트 대비를 떨어뜨렸다. Alkkagi는 9.39MB video에 poster가 없어 첫 진입에서 빈 frame이 보일 수 있었다.
- Impact: 이전 chapter 미디어는 다음 chapter가 우세해지기 전에 6% opacity로 빠르게 handoff되지만 모든 제목·설명·기술·CTA는 계속 완전한 대비로 읽힌다. 1280×720에서도 THING frame이 viewport 안에 들어오고, 768px·390px·reduced는 기존 정적 fallback을 유지한다. Lenis가 resize/BFCache 뒤 재생성될 때 ScrollTrigger 구독도 새 instance로 교체한다.

## 2026-08-21 — 목록 의미 구조와 건너뛰기 대상 정리

- Decision: Home Focus를 `ol/li`로 표현하고 설명이 없는 현재 구성에 맞춰 desktop 행 높이를 204px 이하로 줄인다. Work 목록과 여섯 case-study main을 `tabindex="-1"` 건너뛰기 대상으로 만들고, 내부 Resume 이동 화살표는 `→`로 통일한다. About 질문은 701–900px에서 topic과 질문·note의 2열 구조를 사용한다.
- Reason: Focus의 과한 빈 높이와 `div` 나열을 정리하고, skip link가 해시만 바꾸고 focus를 `body`에 남기는 실제 keyboard 실패를 고치기 위해서다. About의 기존 3열은 tablet에서 질문과 note를 지나치게 좁게 만들었다.
- Impact: 시각적 정보량은 늘지 않으며 desktop·tablet·mobile의 읽기 리듬과 keyboard 이동만 개선된다. THING Demos의 source/license 문장은 gallery 뒤로 이동해 제목 앞의 중복 repository 정보를 줄인다.
## 2026-08-21 — Decorative numbering, Work scenes, and About tools

- Decision: Home 프로젝트와 Focus, Work, About 기술 그룹, THING Demos의 장식용 순번을 제거한다. Work는 미디어만 고정하는 구조 대신 미디어와 전체 설명을 하나의 semantic link에 담은 sticky scene으로 전환하고, About 질문에는 Retargeting·Sim-to-real·Edge inference 용어를 사용한다. 기술 스택에는 설치되어 있던 Simple Icons SVG와 브랜드 색상을 적용한다.
- Reason: 순번이 없는 콘텐츠에 `01` 같은 표식은 불필요한 진행감을 만들었고, 미디어만 따라오는 Work 모션은 프로젝트의 설명과 시각 증거를 분리했다. 제공된 Saffron과 Mathis Biabiany 레퍼런스에서 전체 장면 handoff, 비대칭 evidence 크기, 얕은 depth, 모바일 단순화 원칙만 가져왔다. 기술 용어와 색상 표식은 About의 개성과 스캔 가능성을 높인다.
- Impact: Work desktop full은 전체 scene이 함께 진입하고 물러나며 progress UI, snap, wheel interception을 사용하지 않는다. 높이 700px 미만 desktop과 tablet·mobile·lite·reduced에서는 완전한 정적 grid/list로 돌아간다. 날짜·기간·버전·측정 수치처럼 의미 있는 숫자는 유지하며, 새 의존성이나 비동작 요소의 tab stop은 추가하지 않는다.

## 2026-08-21 — 영상 프레임 제거와 원본 비율 보존

- Decision: Work의 THING·Alkkagi preview와 THING·AQIS·Alkkagi·MRI 상세 video에서 별도 frame을 제거하고 실제 source 비율을 사용한다. Video caption은 media box 밖의 독립 행으로 표시하며, 모든 MP4에 실제 `width`·`height` metadata를 기록한다.
- Reason: Alkkagi 1276×1270 영상을 16:9로 강제한 레터박스가 가장 큰 왜곡이었고, THING의 720×1280 영상도 border·padding·dark fill 때문에 영상보다 액자 구조가 먼저 보였다. Caption까지 같은 surface에 넣은 구성은 영상 설명의 위계를 약하게 만들었다.
- Impact: Work 영상 stage에는 GSAP clip mask와 hover crop을 적용하지 않고 composition handoff만 유지한다. 상세 video는 clip 없는 fade/translate reveal을 사용한다. 정적 screenshot·diagram의 기존 evidence frame은 변경하지 않으며, 1280·768·390px과 reduced motion에서 원본 비율과 native controls를 유지한다.

## 2026-08-21 — About 기술 스택 전체 폭 정렬

- Decision: About 기술 스택을 좁은 우측 열에서 page-width 전체로 옮기고, icon과 기술명을 58px icon 기반의 가로 행으로 확대한다. 반응형 분류는 desktop 4열, tablet 2열, mobile 1열로 전환한다.
- Reason: 1280px에서도 실제 도구 영역이 약 676px에 그쳐 열 너비가 mobile과 비슷했고, 3/3/4/3개 목록이 남은 높이를 서로 다르게 분배해 icon과 구분선의 시작점이 맞지 않았다.
- Impact: 공통 108px 행 리듬으로 첫 세 행이 모든 분류에서 정렬되고, 추가 LangChain 행은 AI / Agents에만 이어진다. 기존 Simple Icons 색, fine-pointer 미세 반응, reduced-motion 정적 상태, 비상호작용 의미 구조는 유지한다.

## 2026-08-21 — About 기술 스택을 로고 wall로 전환

- Decision: 4개 분류 표와 58px badge/name 행을 제거하고, 13개 도구를 카드 없는 3열 대형 컬러 로고 wall로 전환한다. Desktop은 약 100px, mobile은 최대 70px mark를 사용하며 마지막 Docker는 가운데 열에 둔다.
- Reason: 사용자가 제시한 JB Cheng 레퍼런스의 의도는 정렬된 catalogue 표가 아니라, 기술 mark 자체가 여백 속에서 크게 읽히는 시각적 wall이었다. 기존 수정은 위치와 크기를 개선했지만 여전히 표 UI의 인상이 강했다.
- Impact: 기존 Simple Icons와 llama.cpp monogram을 재사용해 새 asset·dependency를 추가하지 않는다. Desktop name은 hover로, touch/mobile name은 최소 12px로 항상 표시한다. Full motion hover만 lift/scale/drop-shadow를 사용하고 reduced에서는 즉시 정적 상태가 된다.

## 2026-08-21 — THING Prototype 사진을 동일 높이로 정렬

- Decision: THING Prototype의 3:4 제작 사진과 4:3 시험 사진을 최대 600px의 `9fr / 16fr` 비대칭 grid로 배치하고, frame 없이 원본 비율로 표시한다. Caption은 사진 아래 별도 rule 행으로 분리한다.
- Reason: 두 사진을 같은 폭의 늘어난 figure에 넣으면 세로 사진이 1.78배 높아지고, 가로 사진 아래에는 figure의 검은 배경이 빈 frame처럼 남았다. 서로 다른 원본 비율을 같은 표시 높이로 맞추는 편이 제작물과 시험 환경을 한 번에 비교하기 쉽다.
- Impact: 1280px 이상과 768px에서 두 사진의 상단·하단·caption 시작선이 맞는다. 600px 이하에서는 portrait를 최대 220px로 제한한 한 열 흐름으로 바뀌며, intrinsic `width`와 `height`가 layout shift를 줄인다.

## 2026-08-21 — About 기술 스택을 compact matrix로 재구성

- Decision: 분류 없는 3열 대형 logo wall을 네 개의 가로 분류 행으로 바꾸고, mark를 desktop 44px·tablet 38px·mobile 32px로 줄인다. 모든 기술명은 항상 표시한다.
- Reason: 기존 560×803px wall은 오른쪽에만 세로로 길게 쌓이면서 왼쪽 page-width를 비웠고, hover 전에는 이름이 없어 같은 NVIDIA mark와 익숙하지 않은 도구를 구분할 수 없었다. 분류와 이름이 사라진 것이 logo 크기보다 큰 스캔 문제였다.
- Impact: Desktop matrix는 page-width 전체의 약 349px 높이로 줄고, Robotics·Code·AI / Agents·Systems가 같은 네 도구 열을 공유한다. Mobile에서는 각 분류 안의 두 열로 바뀌며 의미 있는 텍스트는 12px 이상, 항목은 비상호작용 상태를 유지한다.

## 2026-08-21 — llama.cpp 공식 아이콘 적용

- Decision: About 기술 스택의 `L.CPP` 임시 monogram을 llama.cpp 공식 저장소의 투명 SVG mark로 교체한다.
- Reason: 설치된 Simple Icons에는 llama.cpp 항목이 없지만, 공식 프로젝트 저장소에는 사용자가 제시한 orange C++ 형태의 투명 벡터 asset이 공개되어 있다. 흰 배경이 포함된 첨부 PNG보다 이 asset이 paper 배경과 작은 matrix 칸에 자연스럽게 맞는다.
- Impact: 새 JavaScript dependency나 상호작용은 추가하지 않는다. 공식 `#ff8236` 색, 인접한 항상 보이는 `llama.cpp` 이름, 장식 이미지의 빈 대체 텍스트를 사용하며 기존 44/38/32px responsive 크기와 reduced-motion 동작을 유지한다.

## 2026-08-21 — Home 중앙 이름 split intro

- Decision: Home 첫 진입에 warm-paper 전체 화면 overlay를 두고, 중앙 `SeMinKong`을 보여 준 뒤 이름과 좌우 panel이 벌어지며 현재 Hero를 드러내는 Anime.js intro를 추가한다.
- Reason: 사용자가 페이지 접속 순간의 명확한 브랜드 장면과 Hero로 이어지는 좌우 전개를 요청했다. 기존 Hero 자체를 이동시키면 scroll-seek와 hand rig의 transform 소유권이 충돌하므로 별도 cover만 움직인다.
- Impact: 직접 진입/reload의 top 위치에서 full 약 1.7초, lite 약 1초만 실행한다. 조건부 prepaint cover가 느린 첫 로드에서도 Hero 선노출을 막고, user scroll·keyboard·pointer input은 즉시 skip한다. Reduced/hash/background tab/scroll restoration/BFCache는 정적 Hero로 진입한다. Lenis는 intro 뒤 시작하며 기존 page exit curtain과 Hero 모션은 유지한다.

## 2026-08-21 — Home intro를 완성된 Hero로 직접 연결

- Decision: 중앙 overlay 이름을 둘로 흩지 않고 실제 Hero h1으로 FLIP 이동시킨다. Hero scroll의 시작점은 greeting과 CTA까지 완성된 `4100 / 6800` reading state로 옮기고 이후 native scroll을 남은 timeline 구간에 단조 매핑한다.
- Reason: 별도 overlay 이름의 퇴장, 실제 이름의 두 번째 entrance, Hero copy/navigation fade가 연달아 실행되어 intro와 메인이 서로 다른 장면처럼 보였다.
- Impact: Panel reveal, 이름 이동, copy/navigation assembly가 한 timeline 안에서 끝나며 마지막 프레임이 곧 interactive main Hero다. Hand/copy transform ownership, reduced/hash/BFCache fallback, input skip, Lenis 지연 초기화는 유지한다.

## 2026-08-21 — Home 이름을 글자별 ink-wipe로 작성

- Decision: 중앙 `SeMinKong`의 단어 전체 fade를 아홉 글자의 사선 ink-wipe와 하나의 작은 vermilion nib으로 교체한다. 필기 완료 뒤에는 정확한 word layer로 짧게 교대하고 기존 Hero FLIP을 그대로 이어간다.
- Reason: 중앙 이름이 한 번에 나타나는 장면보다 한 글자씩 펜으로 쓰이는 인상을 원한다는 사용자 피드백을 반영하면서, 실제 font glyph와 responsive h1 착지 정합도는 보존해야 한다.
- Impact: Full 필기는 약 486ms, lite/mobile은 약 392ms다. SVG path·새 asset·dependency는 추가하지 않으며 reduced/hash/BFCache와 조기 입력은 writing layer와 body nib까지 원자적으로 정리한다.

## 2026-08-22 — About Hero를 개인의 태도로 시작

- Decision: About Hero의 `Computer Vision · ROS 2 · Robot Control` 기술 목록을 `배우고, 만들고, 검증하는 과정을 즐깁니다.`라는 개인 문장으로 교체한다. 역할과 위치를 담당하는 `Software Developer · Seoul`은 유지한다.
- Reason: About의 첫 문장은 지원자의 태도와 성향을 소개해야 하는데, 기존 목록은 기술 분류처럼 읽히고 바로 아래 Focus·본문·기술 스택과 중복됐다.
- Impact: 기술 전문성은 기존 About facts, narrative, questions, tool matrix에서 계속 확인할 수 있다. Hero의 구조·스타일·모션은 바꾸지 않으며 새 문장의 반응형 줄바꿈만 검증한다.

## 2026-08-22 — Home intro에 읽기 위한 정지 구간 추가

- Decision: Home 첫 진입은 기존 handwritten `SeMinKong`과 FLIP 구조를 유지하되 full `4.7초`, lite/mobile `3.1초`로 늘린다. 완성된 중앙 이름을 각각 약 `1.25초 / 0.74초` 유지한 뒤 좌우 paper panel을 연다.
- Reason: 기존에는 exact word 교대 후 약 `10ms` 만에 panel이 움직여 브랜드 이름을 읽는 장면이 성립하지 않았다. BeeToGreen 인트로의 긴 브랜드 동작에서 `등장 → hold → 커튼 퇴장 → 본문 조립`이라는 순서만 참고해 포트폴리오에 맞는 길이로 축약한다.
- Impact: 새 Lottie·asset·dependency는 추가하지 않는다. 입력 즉시 완료, reduced/hash/BFCache 생략, responsive FLIP, 완성된 Hero 착지, Lenis 지연 시작은 유지하며 watchdog과 head fallback만 새 timeline 길이에 맞춰 늘린다.

## 2026-08-22 — Home intro를 실제 획순 SVG로 교체

- Decision: 아홉 글자를 가로로 여는 clip-path와 별도 nib을 제거하고, `SeMinKong`을 12개 SVG 중심 획으로 직접 그린다. 글자 완료마다 한 번의 작은 위쪽 반동을 주고, 중앙 이름은 필기 중 full `1.16 → 1.32배`, lite `1.10 → 1.18배`로 커진 뒤 실제 Hero h1 크기로 축소한다.
- Reason: 기존 효과는 글씨를 쓰는 동작보다 오른쪽으로 mask가 열리고 포인터가 따라가는 UI처럼 보였다. 사용자가 펜 포인터 제거, 실제 획순, 큰 이름에서 작은 이름으로의 전환, 딱딱하지 않은 탄성을 명시적으로 요청했다.
- Impact: Anime.js에 이미 포함된 `createDrawable()`만 사용하며 새 asset·dependency는 없다. SVG는 intro 장식으로만 존재하고 최종 프레임은 정확한 Manrope live-text와 기존 semantic h1으로 교대한다. 입력 skip, resize, reduced/hash/BFCache, Hero transform ownership과 Lenis 지연 시작은 유지한다.

## 2026-08-22 — 공개 이름과 Hero 필기체를 하나의 서명으로 통일

- Decision: 공개 이름을 `Se Min Kong`으로 띄어 쓰고, Intro의 12획 손글씨 SVG를 Manrope로 교대하지 않은 채 최종 Hero h1에도 동일하게 유지한다. GitHub 계정·URL·resume asset 같은 기술 식별자 `SeMinKong`은 변경하지 않는다.
- Reason: 사용자가 Intro에서 완성되는 필기체를 메인에서도 그대로 보고 싶어 했고, 중간·최종 단계에서 폰트가 바뀌는 것이 장면의 연속성을 해쳤다.
- Impact: 중앙 필기부터 responsive FLIP, 최종 Hero까지 같은 SVG geometry를 사용한다. 초기 HTML부터 SVG와 실문자 fallback을 함께 두고 semantic h1에 `Se Min Kong` 접근성 이름을 직접 제공해 JS 지연과 reduced/hash/BFCache/skip도 동일한 정적 서명으로 끝난다. Header와 일반 UI의 기존 Manrope typography는 유지한다.

## 2026-08-22 — Asta Sans + Geist Mono visible type system

- Decision: 보이는 display, heading, body, navigation을 `Asta Sans Variable`로 통합하고 기술 metadata는 `Geist Mono Variable`로 바꾼다. 한글 metadata는 Asta Sans로 fallback한다.
- Reason: 손글씨 서명 주변의 기존 sans/mono 조합이 지나치게 딱딱하게 분리돼 보였다. Asta의 절제된 곡선으로 연결감을 만들되 450–680 weight hierarchy와 mono metadata로 전문성을 유지한다.
- Impact: `Manrope Variable`은 Intro와 Hero SVG의 responsive 폭을 제공하는 투명 metric text에만 남는다. 모든 font asset은 Fontsource npm package로 self-host하며 외부 CDN이나 runtime font request는 추가하지 않는다.

## 2026-08-22 — Dongle-led visible typography

- Decision: 보이는 display, heading, navigation과 주요 action은 `Dongle` 700/400으로 바꾸고, 긴 본문과 metadata는 `Gowun Dodum` 400으로 통일한다. Asta Sans와 Geist Mono는 제거한다.
- Reason: 사용자가 정돈된 고딕 계열은 여전히 딱딱하다고 판단했고, 원하는 방향이 Gowun Dodum 단독보다 Dongle의 둥근 획과 손글씨 리듬에 가깝다고 명확히 했다. 긴 문장까지 display face로 쓰지 않아 전문성과 가독성은 유지한다.
- Impact: 큰 제목의 음수 자간과 작은 Dongle UI 크기를 보정하고, header hover의 weight morph는 static 700 lift wave로 단순화한다. `Manrope Variable` 680은 화면에 보이지 않는 Intro/Hero geometry provider로만 유지하며 Fontsource Korean/Latin WOFF2는 외부 요청 없이 self-host한다.

## 2026-08-23 — 동일 서명 노드 handoff와 단일 paper reveal

- Decision: Home Intro의 좌우 paper panel과 복제 SVG crossfade를 제거한다. 필기를 마친 SVG 노드 하나를 Hero의 실제 SVG rect까지 이동한 뒤 그 노드 자체를 Hero h1에 옮기며, 배경은 단일 paper veil이 전체 화면에서 잔잔하게 옅어져 Hero를 드러낸다.
- Reason: 동일한 path를 사용해도 Intro와 Hero의 서로 다른 line box, `difference` 색, 두 SVG의 opacity 교대, intro 종료 때 바뀌는 scrollbar gutter 때문에 서체와 크기가 순간적으로 달라 보였다. 좌우 panel의 중앙 seam도 서명과 무관한 커튼처럼 읽혔다.
- Impact: Full은 약 4.75초, lite/mobile은 약 3.2초의 기존 읽기 호흡을 유지한다. 착지 직전과 직후에는 같은 DOM SVG, rect, font-size를 사용하고 global stable scrollbar gutter로 viewport 단위 재계산을 막는다. Reduced/hash/BFCache/입력 skip은 초기 HTML의 정적 Hero SVG를 계속 사용한다.

## 2026-08-23 — Dongle optical sizing과 정렬 보정

- Decision: 글꼴 family는 Dongle/Gowun Dodum/숨은 Manrope 구성을 유지한다. Dongle의 작은 실제 글자 몸집에 맞춰 header, Hero action, 짧은 화면의 Hero 문장, About 질문, 일반 Work 제목을 키우고 desktop header의 왼쪽 inset을 page-width의 40px과 맞춘다.
- Reason: 390·768·1280 실측에서 44–48px hit area는 충분했지만 내부 Dongle glyph가 작아 보였고, 1280px에서는 header가 x=32px, Hero가 x=40px으로 시작선이 달랐다. Work 일반 제목과 About의 긴 질문도 주변 제목보다 시각적 위계가 약했다.
- Impact: Font family와 본문 밀도는 바꾸지 않는다. Mobile header는 16px safe inset과 390px 폭 안에 유지하고, 긴 Work 제목은 block wrapping과 descender 여백을 사용한다. Metadata 크기와 tracking은 소폭만 보정한다.

## 2026-08-23 — 필기 완료 후 1초 이내 Hero 전환

- Decision: Home Intro의 획순과 필기 시간은 유지하되 마지막 획이 끝난 뒤 별도 hold를 제거하고, 단일 paper fade와 동일 SVG의 Hero 착지를 full `930ms`, lite/mobile `760ms` 안에 완료한다.
- Reason: 완성된 이름을 중앙에 오래 붙잡아 두는 구간 때문에 필기 이후의 진행이 느리게 느껴졌다. 마지막 글자의 bounce settle과 fade를 겹치면 손글씨의 생동감은 남기면서도 화면 전환은 즉시 이어진다.
- Impact: Full Intro 총 길이는 약 `2.38s`, lite/mobile은 약 `1.66s`가 된다. Font, 12개 path, 획순, bounce 크기, Hero의 동일 DOM SVG handoff와 reduced/input-skip 동작은 변경하지 않는다.

## 2026-08-23 — 전역 타이포 크기와 breakpoint 연속성 정리

- Decision: Dongle display, Gowun Dodum 본문·metadata, Home의 동일 SVG 서명은 유지한다. 공통 본문을 16px 기준으로 올리고 의미 있는 label·action은 최소 14px, 보조 metadata는 약 13.2–14.3px의 유동 범위로 분리한다. About·Work·Legal·Case 제목과 Home 문장은 폭이 넓어질수록 커지는 단일 `clamp()` 흐름을 사용한다.
- Reason: 기존에는 `600 / 700 / 720 / 900px` media query 직후 mobile 전용 큰 글자가 desktop base 값으로 교체되며 화면이 넓어졌는데 제목이 작아졌다. `body-lg`가 일반 본문과 같은 15.36px로 계산되고 Resume 연락처·날짜·action은 12.48px에 머물러 페이지 간 위계도 달랐다.
- Impact: About `700→701px`, Home·Work `720→721px`, Home 짧은 화면 `900→901px`, Legal·Case `600→601px`에서 크기가 역행하지 않는다. Resume와 Legal의 의미 있는 작은 글자는 14px 이상, Case 본문 소제목은 24–29.6px로 올라간다. Font family, Home 획순·handoff·timing, 구조와 상호작용은 바꾸지 않는다.

## 2026-08-23 — 전역 타이포 150% 확대와 반응형 재배치

- Decision: 바로 앞에서 정리한 타이포 비율을 유지한 채 root 글자 크기를 `150%`로 올리고, `vw`가 포함된 모든 `font-size` 식도 같은 비율로 확대한다. Dongle·Gowun Dodum과 Home의 12획 SVG 서명은 유지한다. 다만 720px 이하 서명은 viewport safe inset 안에 머물도록 별도 유동 상한을 둔다.
- Reason: 기존의 breakpoint 연속성은 해결됐지만 전체 화면에서 본문·metadata·action과 큰 제목의 시각 몸집이 여전히 작았다. 브라우저 `zoom`이나 transform은 layout과 접근성 측정을 왜곡하므로 실제 computed font-size를 키우는 방식이 필요했다.
- Impact: 기본 본문은 `24px`이 되고 고정 `rem` 및 유동 `clamp()`가 기존 대비 1.5배로 계산된다. 확대된 글자가 줄어들지 않도록 720px 이하 header는 2행, 960px 이하 Work는 1열, 820px 이하 Resume 날짜는 다음 행, 700px 이하 About tool matrix는 2열로 재배치한다. Motion timeline, SVG path, 색과 페이지 구조는 변경하지 않는다.

## 2026-08-23 — 균형형 120% 타이포와 서명 비율 고정

- Decision: 바로 앞의 150% 확대를 대체해 root와 모든 fluid type을 원래 정리값의 `120%`로 맞춘다. 기본 본문은 `19.2px`로 두고 Dongle·Gowun Dodum의 역할은 유지한다. Home의 정적·동적 SVG는 `xMidYMid meet`와 단일 `scale`만 사용해 어떤 viewport와 handoff 시점에도 가로·세로 비율을 바꾸지 않는다.
- Reason: 24px 본문과 150% display는 페이지 전체가 한 위계처럼 커져 본문 밀도와 제목 사이의 대비가 약해졌다. 또한 `preserveAspectRatio="none"`과 독립 `scaleX / scaleY`는 동일 path라도 컨테이너와 이동 상태에 따라 손글씨를 눌리거나 늘일 수 있었다.
- Impact: 390px 이상 header는 다시 64px 한 행으로 읽히고, 실제로 한 행이 들어가지 않는 359px 이하에서만 두 행을 사용한다. Work 960px 이하 1열, Resume 820px 이하 날짜 stack, About 700px 이하 tool 2열은 여유 있는 읽기 흐름으로 유지한다. Intro의 획순, bounce, 총 길이, 1초 이내 전환과 동일 SVG node handoff는 바꾸지 않는다.

## 2026-08-23 — Home Intro 자연 완료 게이트

- Decision: Home의 정상 Intro가 시작된 뒤에는 휠, 클릭, 터치, Tab, Escape, Enter, Space와 스크롤 키로 타임라인을 건너뛸 수 없게 한다. 배경 콘텐츠는 Intro 동안 `inert`와 `aria-busy` 상태로 잠그고, Anime.js의 자연 완료가 발생한 뒤에만 한 번에 해제한다.
- Reason: 기존에는 방문자의 첫 입력이 곧 `finish()`를 호출해 획순 필기와 Hero handoff를 보기도 전에 화면이 열렸다. 사용자가 첫 장면을 반드시 끝까지 재생한 뒤 본문으로 이어지길 명시적으로 요청했다.
- Impact: Full 약 `2.38s`, lite/mobile 약 `1.66s`의 기존 길이, 12개 path, bounce, 단일 비율 SVG handoff는 바꾸지 않는다. Head 단계부터 입력을 막아 module 초기화 전 틈도 닫는다. 다만 reduced motion, hash·BFCache·복원 진입, hidden/pagehide, 실행 오류와 watchdog은 사용자를 가두지 않는 fail-open 경로로 유지하며 브라우저 Back·Reload·modifier shortcut은 가로채지 않는다.

## 2026-08-23 — Home Hero를 Paper Current Playground로 교체

- Decision: Home Hero의 로봇 손과 cube flourish를 제거하고, 중앙 정렬된 동일 서명·인사말·CTA 뒤에 full-bleed `Paper Current` 유체장을 둔다. 유체는 warm paper 위 graphite wash와 제한된 vermilion pigment만 사용하며 이름과 CTA의 실제 rect를 확장한 quiet zone을 침범하지 않는다.
- Reason: Hero를 특정 로봇 프로젝트의 오브젝트보다 방문자가 직접 반응을 만들 수 있는 개인적인 Playground로 전환하고, 손글씨 Intro와 메인의 재료감을 하나의 종이·잉크 언어로 연결하기 위해서다.
- Impact: Hero scroll은 cube 전용 `175svh / 6800` timeline 대신 약 `118svh`의 짧은 exit-only 진행으로 바뀐다. Full은 포인터 속도와 pressure impulse에 반응하고 lite는 저해상도 30fps와 짧은 tap impulse를 사용한다. Reduced/WebGL 실패는 정적 CSS marbling으로 남으며 touch scroll, 동일 12-path SVG handoff, 균일 비율과 CTA 의미 구조는 유지한다.

## 2026-08-23 — Paper Current를 Pressure Ink solver로 강화

- Decision: Full desktop의 단일 fragment domain-warp를 저해상도 WebGL2 stable-fluid solver로 대체한다. Velocity·pressure·graphite/vermilion dye를 ping-pong target에 보존하고, 빠른 경로와 방향 전환을 batched splat과 vorticity로 증폭한다. Lite는 기존 procedural renderer, reduced와 실패 환경은 CSS marbling을 유지한다.
- Reason: 기존 current는 포인터 주변 픽셀을 즉시 굽히는 표현이라 강도를 높일수록 유체보다 rubber/lens처럼 보였다. 사용자가 원하는 격렬함에는 입력 뒤에도 이동량과 pigment가 남아 충돌하고 말리는 시간적 상태가 필요하다.
- Impact: Full renderer에 EXT_color_buffer_float, compact/RGBA half-float framebuffer 검증과 23-pass 내외의 GPU pipeline이 추가된다. 이름·문장·CTA union은 실제 obstacle로 보호하고 SVG는 변형하지 않는다. Active 60fps/idle 30fps, 192/512 target, 14 pressure iteration으로 범위를 고정하며 capability 실패 시 전체 renderer를 즉시 경량 모드로 교체한다.

## 2026-08-23 — Route-owned runtime과 CSS 아키텍처

- Decision: 11개 HTML route를 `home / work / case-study / about / resume / legal` 6개 entry에 명시적으로 연결하고, 공통 환경·navigation·page transition 초기화는 destroy 가능한 `createPageRuntime()`이 소유한다. 삭제된 `site.css` 대신 공통 `tokens / base / motion`, Home·Work 전용 `portfolio-shared`, 각 route stylesheet를 조합한다. Vite와 배포 검증은 `config/site-routes.js` 하나를 공유한다.
- Reason: Work와 case route가 사용하지 않는 Home Intro·Fluid·deck 코드와 CSS까지 가져오고, 큰 entry·stylesheet·renderer 안에 서로 다른 책임이 섞여 있어 작은 변경의 영향 범위와 cleanup 소유권을 읽기 어려웠다.
- Impact: 현재 시각·문구·URL·모션 timing은 바꾸지 않는다. Lenis는 full/interactive에서만 동적으로 로드하고 Work Story가 명시적으로 구독한다. Intro wordmark, lite shader, Pressure Ink shader/WebGL/size는 facade 뒤 내부 모듈로 나뉘며 public API와 Stable → Lite → Static fallback 순서는 유지한다. Source/build 검증은 route entry, CSS 경계, legacy selector, 배포 파일과 모든 로컬 참조를 함께 검사한다.

## 2026-08-23 — 전 route Fluid와 adaptive high-resolution

- Decision: Home 전용 Pressure Ink를 문서당 하나의 fixed `Site Fluid` controller로 일반화해 모든 route background에서 사용한다. Home은 최고 강도의 continuous playground, Work/About는 중간 강도, Resume/Copyright는 낮은 ambient, case study는 dark palette로 운용한다. Stable target은 high `256/768`, balanced `224/640`, baseline `192/512`로 두고 긴 축 1536px cap과 runtime downgrade를 적용한다.
- Reason: 동일한 물성의 배경을 페이지 전환 뒤에도 유지해 사이트 전체를 하나의 경험으로 묶되, 모든 페이지를 Home만큼 격렬하게 만들거나 저사양 장치에 고정 고해상도를 강제하면 읽기 집중도와 성능이 함께 나빠진다. 기존 독립 축 clamp는 세로 화면에서 texture 비율도 왜곡했다.
- Impact: 기존 Route-owned architecture의 Home-only Fluid bundle 결정은 이 요청에 한해 대체된다. Light/dark palette uniform, route별 intensity·quiet zone·ambient sleep이 추가된다. Allocation은 high→balanced→baseline→Lite→Static으로 fail-open하고, 실제 active frame이 지속적으로 느릴 때만 같은 session에서 한 방향으로 낮아진다. Intro SVG, 타이포그래피, URL, content 구조와 native touch scroll은 변경하지 않는다.

## 2026-08-24 — Paper와 Ink 합성 분리

- Decision: Site Fluid의 불투명 paper composite를 fixed paper base와 straight-alpha Ink overlay로 분리한다. Fine-pointer path는 interactive target 위에서도 계속 수집하고, activation impulse만 control 위에서 제외한다. 단일 union obstacle은 최대 6개의 soft quiet zone으로 대체한다.
- Reason: 기존 z0 opaque Canvas는 section/card가 Fluid를 완전히 가렸고, project 전체 link 위에서는 pointermove를 버렸으며, Home의 큰 copy union이 viewport 중앙 대부분을 비워 renderer가 실행되어도 정지 화면처럼 보였다.
- Impact: Dark structural surface에서도 Ink continuity가 보이되 핵심 copy·media·focus UI의 대비는 보호한다. Focus 이동과 Home deck transform은 quiet geometry를 즉시 다시 측정한다. Navigation/button/card/display text는 double-click selection을 막고 연락처·근거 링크·일반 본문과 Resume는 선택 가능하게 유지한다. 하나의 simulation, adaptive quality, native scroll, reduced/static fallback과 route entry 구조는 바꾸지 않는다.

## 2026-08-24 — 로컬 개발 서버 주소 고정

- Decision: `npm run dev`는 `127.0.0.1:5173`에만 바인딩하고 `strictPort`를 사용한다.
- Reason: Windows에서 `localhost`의 IPv6 `[::1]:5173`과 IPv4 `127.0.0.1:5173`에 서로 다른 Vite 프로세스가 동시에 살아 있을 수 있어, 새 서버를 실행한 뒤에도 기존 탭이 오래된 프로세스를 계속 표시했다.
- Impact: 개발 화면은 항상 `http://127.0.0.1:5173/`에서 확인한다. 같은 주소의 서버가 이미 실행 중이면 다른 포트로 조용히 이동하지 않고 명확한 오류를 내므로, 오래된 프로세스를 먼저 종료해야 한다. Production build와 Pages 배포 주소에는 영향이 없다.

## 2026-08-24 — Production Home Fluid cascade 격리

- Decision: Home의 이전 Hero fluid surface 규칙은 `.home-page .hero-story__sticky > .hero-fluid:not(.site-fluid)`에만 적용하고, body로 이동한 전역 Site Fluid wrapper에는 적용하지 않는다.
- Reason: Vite 개발 모드는 `home.css` 다음에 `site-fluid.css`를 주입하지만 production은 공통 Fluid CSS를 먼저 추출한다. 기존 `.home-page .hero-fluid`와 `.site-fluid.site-fluid`의 specificity가 같아 production에서만 legacy `absolute / z-index: 0`가 fixed overlay를 덮었다.
- Impact: Home도 CSS chunk 순서와 관계없이 viewport-fixed Ink layer와 `z-index: 2`를 유지한다. 초기 HTML의 pre-runtime placeholder, Intro handoff, reduced/static fallback, 다른 route와 단일 Fluid simulation 계약은 변경하지 않는다. Source verification은 broad legacy selector의 재도입을 거부한다.

## 2026-08-24 — 정적인 미술관 표면과 절제된 가시 서체로 전환

- Decision: 전 route의 Fluid/Pressure Ink, cursor follower, magnetic/name wave, pointer tilt와 별도 media scroll-kinetics를 제거한다. 배경은 CSS 기반의 고정 paper wash/grain으로 바꾸고, 보이는 서체는 Dongle/Gowun Dodum에서 `Asta Sans Variable + Geist Mono Variable`로 교체한다. Home의 12-path handwritten SVG는 Intro와 Hero의 작가 서명으로만 유지하며 page-level Lenis smooth scroll은 유지한다.
- Reason: Fluid 궤적과 둥근 Dongle/Gowun 조합이 작품을 보는 미술관형 포트폴리오보다 playful interaction demo를 먼저 인식시키고, 제목·navigation의 진지한 편집 위계를 약하게 만들었다. 배경의 움직임을 걷어내고 서체 대비를 단단하게 만들어 콘텐츠와 작품 자체가 움직임의 주체가 되게 한다.
- Impact: WebGL/Canvas와 관련 adaptive renderer·shader·obstacle code 및 테스트를 삭제하고 production bundle에서 재도입을 거부한다. Root 120%, warm-paper/charcoal palette, page 구조, Intro 서명 획순, Home/Work scroll story, reveal, page transition, keyboard focus와 native touch scroll은 유지한다. Project Deck은 pointer 좌표를 추적하지 않는 단발성 hover/focus catalogue gesture만 남긴다.

## 2026-08-24 — GSAP을 전시 동선에 집중

- Decision: ScrollTrigger를 Home Hero handoff, Work 여섯 chapter와 THING의 Demos·Prototype·Pipeline·Architecture에 route-scoped enhancement로 적용하고, 실제 GSAP core/ScrollTrigger runtime만 capability 통과 뒤 지연 로드한다. Home Intro, 공통 reveal/page curtain과 Project Deck은 Anime.js를 유지하고 GSAP Flip, SplitText, ScrollSmoother는 도입하지 않는다.
- Reason: GSAP은 가역 scrub, 동적 start/end와 breakpoint lifecycle에서 가장 큰 이점이 있다. 반면 cursor/background나 단발 entrance까지 전면 이관하면 정적인 미술관 방향과 어긋나고, Project Deck에 Flip을 섞으면 Anime/ResizeObserver와 transform 소유권이 충돌한다.
- Impact: Home은 Intro 완료 뒤에만 animation runtime을 요청하고, Work는 rotation/filter/큰 X 이동 대신 절제된 media handoff와 2px rail을 사용한다. 활성 Work는 background/pagehide 중 expanded geometry를 유지해 깊은 scroll position을 보호한다. THING owned section은 generic reveal과 그 prepaint heading tint에서 제외하고 native video는 직접 target하지 않는다. Build는 0.26 kB gzip loader facade를 관련 entry에 초기 공유하고, GSAP core 27.42 kB gzip + ScrollTrigger 17.54 kB gzip은 tablet/mobile/short/reduced 경로에서 요청하지 않는다.

## 2026-08-24 — GSAP 변화가 읽히는 전시 handoff

- Decision: 첫 구현이 실제 화면에서 거의 구분되지 않는다는 사용자 피드백에 따라 Home의 scroll travel과 순차 철수, Work의 mat entry/exit와 chapter label, THING의 sticky demo chapters와 Pipeline rail을 강화한다. 활성 최소 높이는 Home 620px, Work·THING 640px로 낮춘다.
- Reason: Home은 900px 화면에서도 약 162px만 scrub했고 Work의 1–2% scale 차이는 기존 reveal과 구분되지 않았다. 일반 노트북에서는 700px height gate 때문에 GSAP이 전혀 시작되지 않는 경우도 있었다.
- Impact: 배경·커서는 계속 정적이며 rotation/filter/snap/pin/input interception은 추가하지 않는다. Home은 55svh handoff와 2px progress hairline, Work는 `01 / 06`, THING은 `01 / 04`와 시스템 rail로 전환 상태를 명확히 보여준다. THING media transition은 video 바깥 decorative frame과 caption에만 적용해 native controls의 크기·위치·opacity를 유지한다. Static/reduced/touch fallback도 그대로 유지한다.

## 2026-08-25 — Work를 수평 전시 레일로 재구성

- Decision: Work desktop의 여섯 vertical sticky chapter를 하나의 pinned horizontal exhibition rail로 교체한다. 세로 스크롤은 GSAP ScrollTrigger가 작품 track의 X 진행으로 번역하며, card별 entrance는 같은 tween을 containerAnimation으로 읽는다. Home과 THING의 no-pin 규칙은 유지한다.
- Reason: 기존 구현은 각 프로젝트 사이의 빈 세로 travel과 작은 scale/opacity 변화가 일반 목록과 크게 다르지 않아, GSAP을 사용한 프로젝트 showcase라는 인상이 약했다. 한 전시 벽 안에서 서로 다른 원본 비율의 작품이 연속해서 지나가면 Work 자체가 대표적인 인터랙션 샘플이 되면서도 정적인 미술관 재료와 충돌하지 않는다.
- Impact: Work에만 `pin: true`와 큰 track X 이동을 허용하므로 2026-08-24 Work no-pin/large-X 금지 결정은 대체된다. 기존 GSAP/ScrollTrigger chunk를 재사용해 bundle dependency는 늘지 않는다. 여섯 semantic link, native vertical input, keyboard tab order, video 원본 비율과 961px/640px capability gate는 유지하며 tablet/mobile/reduced/short viewport는 완전한 세로 static list로 남는다.

## 2026-08-25 — Work를 연속 타이포그래피 contents ribbon으로 전환

- Decision: GSAP 공식 홈페이지 “That’s right, Anything” 구간의 `single pinned horizontal world + oversized type + independently moving objects` 원리를 Work에 적용한다. 기존 horizontal card rail의 visible 경계와 2-column 반복 구도를 없애고, project title·실제 media·metadata를 가변 폭 12-column scene 위에서 연속적으로 교차시킨다. Work에서만 SplitText를 capability gate 뒤 지연 로드한다.
- Reason: 첫 수평 구현은 움직임 자체는 분명해졌지만 여전히 큰 카드 여섯 장을 옆으로 넘기는 구조라 레퍼런스의 한 문장처럼 이어지는 리듬과 글자 단위 조립이 느껴지지 않았다. 프로젝트의 실제 산출물을 장식 레이어로 사용하면 레퍼런스의 에너지는 가져오면서 미술관형 포트폴리오의 독자성과 정보 밀도를 유지할 수 있다.
- Impact: 앞선 Work card width, border, small/no-rotation title reveal과 no-SplitText 결정은 대체된다. Work bundle에 `3.26 kB gzip` SplitText chunk가 하나 추가되지만 gate 밖의 Home·THING·tablet/mobile/reduced 경로에는 로드되지 않는다. 여섯 anchor와 DOM 순서, native input, focus scroll mapping, video 직접 비대상화, pin cleanup과 static vertical fallback은 유지한다.

## 2026-08-25 — 보이는 서체를 Jua와 Signika로 교체

- Decision: 한글은 `Jua` 400, Latin·숫자는 `Signika Variable` 300–700으로 전 route에서 교체한다. 두 폰트는 Fontsource package의 필요한 WOFF2만 self-host하고 `Signika → Jua → system Korean` 순서의 script fallback으로 사용한다. Home의 보이지 않는 서명 측정용 Manrope는 유지한다.
- Reason: 기존 Asta/Geist 조합보다 사용자가 직접 선택한 한글·영문 인상을 일관되게 적용하면서, Jua가 Latin도 포함한다는 특성 때문에 영문까지 Jua가 되는 문제를 피해야 했다. 또한 Jua는 실제 400 한 굵기뿐이므로 synthetic bold 없이 크기와 spacing으로 정보 위계를 유지해야 한다.
- Impact: Root 120%, 19.2px 본문, 최대 640px measure와 기존 페이지별 type scale은 유지한다. Signika 폭 변화로 넘치던 case heading 열은 desktop 최소 200px, 840px 이하 한 열로 보정하고 390px MRI metric만 작은 유동 크기를 사용한다. Asta Sans·Geist Mono dependency와 production font asset은 제거되며 Work SplitText는 `document.fonts.ready` 뒤 새 Signika geometry로 분할·refresh한다.

## 2026-08-25 — Work title의 optical scale 통합

- Decision: Enhanced Work의 여섯 title을 프로젝트별 네 가지 `vw` 크기 대신 일반 title과 featured THING 두 단계로 통합한다. 일반 scene 폭은 `102vw`로 조정하고 Work의 한글 설명 크기·행간을 줄이며 Hero는 840px 이하에서 한 열로 전환한다.
- Reason: Signika 적용 뒤 THING 183px과 Prompt 86px이 2.1배 이상 벌어졌고, AQIS·Alkkagi는 108vw scene을 중심 정렬할 때 첫 글자와 metadata가 viewport 왼쪽으로 12–15px 잘렸다. 768px Hero 설명은 300px 열에 갇혀 390px보다 한 줄 더 늘어나는 반응형 역전도 있었다.
- Impact: 1280px 기준 featured title은 약 133px, 나머지는 약 101px로 수렴하고 tracking/line-height는 Signika에 맞게 완화된다. Hero·rail summary는 약 18–19px와 1.58–1.62 leading을 사용한다. GSAP timing, SplitText char motion, semantic link, native input, metadata/CTA 크기와 reduced/static fallback은 변경하지 않는다.

## 2026-08-25 — Home 전시 진입 label과 진행선 제거

- Decision: Home Hero의 CSS pseudo label `SCROLL TO ENTER THE EXHIBITION · 01 / 06`과 하단 2px progress line, 이를 구동하던 `--hero-progress` tween을 제거한다.
- Reason: 이전에는 GSAP 변화가 잘 보이지 않는다는 피드백을 보완하기 위해 추가했지만, 현재 중앙 Hero와 미술관형 표면에서는 안내 문구와 긴 선이 별도 UI처럼 떠서 시각적 의미가 중복된다.
- Impact: Hero의 실제 scroll range, CTA·문장·서명 철수 timing, GSAP/ScrollTrigger loading, reverse/focus/reduced fallback은 유지된다. 장식용 progress custom property만 production CSS와 runtime에서 빠진다.

## 2026-08-25 — Work motion을 독서 중심의 고정 beat로 통합

- Decision: 여섯 Work scene을 동일한 1.0 normalized clock 위의 `artifact → title → placard → hold → handoff`로 통합한다. 활성 작품의 지속 counter-motion과 char index 기반 scatter를 제거하고 `.38–.70`을 정확한 identity hold로 만든다. Master/scene scrub은 `.62/.35`로 줄이고 readout은 rendered track progress를 따른다.
- Reason: 기존 장면은 media가 중앙에서도 최대 58px 이동하고 entrance/exit가 ±140–150px였으며, `stagger.each` 때문에 긴 Prompt title의 exit가 scene 끝을 넘었다. 빠른 스크롤에서는 번호가 실제 레일보다 먼저 바뀌어 작품을 읽기보다 움직임과 상태 불일치를 추적하게 했다.
- Impact: 첫 scene의 완성 시작과 마지막 scene의 완성 종료, 실제 media 비율, semantic anchor, focus-to-center mapping과 static fallback은 유지된다. Browse instruction은 시작 구간 뒤 사라지고 connector가 scene 정착을 표시한다. 새 dependency는 없으며 기존 GSAP core, ScrollTrigger와 Work 전용 SplitText chunk만 사용한다.

## 2026-08-25 — Work 정보를 한 문장으로 축소하고 전환 위상을 맞춤

- Decision: Work index에서 wall header·번호·메타·통계·기술 tag·media caption·중복 화살표를 제거하고 각 프로젝트를 `실제 미디어 + 제목 + 한 줄 소개 + 상세 보기`로 제한한다. Non-first scene은 완전 투명 상태로 준비하고 scene scrub 지연을 제거하며, 이전 exit와 다음 entry를 normalized clock `.52`에서 시작한다.
- Reason: 기존 `.22–.42` 초기 opacity와 늦은 beat 때문에 다음 프로젝트가 먼저 보인 뒤 움직여 전환이 끊겼다. 또한 상세 페이지에 이미 있는 역할·기술·수치를 인덱스에서도 반복해 프로젝트 자체보다 UI와 설명이 먼저 읽혔다.
- Impact: Master pin과 rail scrub, SplitText, 여섯 semantic link, 원본 미디어 비율, focus-to-center, native input과 static/reduced fallback은 유지한다. 마지막 scene은 viewport basis와 대칭 safe inset으로 끝점 clipping을 막고, focus settlement는 브라우저 기본 focus scroll 다음 두 frame까지 재동기화한다. Work index는 어떤 프로젝트인지 빠르게 훑고 상세 페이지에서 근거를 읽는 역할로 분리된다.

## 2026-08-31 — Evidence-first Home과 비차단 서명 모션

- Decision: Home의 첫 화면을 `역할 → 제공 가치 → 대표 근거 → 다음 행동` 순서로 재구성하고, THING 실제 산출물을 첫 viewport의 시각적 근거로 사용한다. 기존 Home Intro는 화면·입력·접근성 트리를 잠그는 gate가 아니라 780ms 이내의 SVG 서명 enhancement로 축소하며, 최초 wheel·pointer·touch·keyboard 입력은 소비하지 않고 애니메이션만 즉시 완료한다.
- Reason: 방문자가 인터랙션을 통과해야 정체성과 대표 작업을 알 수 있는 구조는 채용 담당자와 터치 사용자의 탐색 속도를 낮췄다. Apple식 완성도는 장식의 양보다 명확한 정보 위계, 실제 제품 근거, 사용자가 통제권을 잃지 않는 모션에서 나온다.
- Impact: 2026-08-18의 greeting-only, 역할 비노출 결정과 과거 blocking Intro 검증은 이 결정으로 대체된다. Anime.js는 서명·entrance·page-transition 기본 라이브러리로 남고, GSAP은 기존 Home scroll handoff·Work rail·THING에만 route-scoped로 유지한다. Home story는 1001px/620px 이상에서만 138svh로 활성화되며 1000px 이하, reduced motion, hash/BFCache 복귀, touch/coarse pointer는 즉시 정적 완성 상태를 사용한다.

## 2026-08-31 — 빠른 탐색, Case 맥락, HTML-first Resume

- Decision: Work 상단에 여섯 프로젝트로 바로 이동하는 Fast track을 두고, 960px 이하에서는 프로젝트 설명을 미디어보다 먼저 읽히게 하며 자동 preview는 poster 상태로 둔다. 모든 controls video는 동일한 offscreen/hidden/pagehide pause lifecycle을 사용한다. 여섯 Case에는 한 문장 lede와 sticky local navigation을 제공한다. Resume는 공개 HTML Profile을 원본으로 삼고, 전화번호·생년월일이 포함된 PDF·DOCX·미리보기 PNG는 `.private/resume/`에 보관해 배포 manifest에서 제외한다.
- Reason: 대표 작업을 발견하고 근거를 확인하는 경로를 줄이는 동시에, 작은 화면에서 시각 자료 때문에 핵심 설명이 밀리는 문제를 없애야 했다. 다운로드 원본은 공개 링크만 숨겨도 직접 URL에 남으므로 공개 범위 자체를 줄이는 편이 안전하다.
- Impact: 2026-07-14와 2026-08-18의 개인정보 포함 원본 Resume 공개 결정은 대체된다. 요청 시 이메일로 정제된 파일을 전달할 수 있지만, 현재 public/dist에는 원본 세 파일이 포함되지 않는다. Production build는 이전 `dist`를 비우고 Resume directory의 승인되지 않은 추가 파일을 검증 단계에서 거부한다. Case의 기존 사실·팀 기여 범위·MRI 내부 평가 한정 문구는 유지한다.

## 2026-08-31 — Progressive platform layer와 공유 품질

- Decision: 11개 route에 canonical, robots, Open Graph, Twitter Card를 정적으로 제공하고 sitemap과 1200×630 공용 소셜 이미지를 배포한다. Home/Work의 명시적 project link만 moderate prefetch하고 prerender는 사용하지 않는다. Cross-document View Transition은 desktop fine-pointer와 no-preference 조건에서만 활성화하며 미지원 브라우저는 기존 Anime transition으로 fail-open한다.
- Reason: 검색·공유 진입점도 제품 경험의 일부이며, speculative navigation과 전환 효과는 정확한 대상과 capability gate 안에서만 체감 속도를 높인다. 전역 prerender나 강제 전환은 데이터·배터리·접근성 비용을 키울 수 있다.
- Impact: 새 runtime dependency나 Three.js를 추가하지 않는다. 본문은 OS 한글 시스템 글꼴로 읽기 밀도를 높이고 display의 Signika/Jua 정체성은 유지한다. `prefers-contrast: more`, forced colors, 명시적 media geometry, `pagehide/pageshow` media 정리를 source contract로 검증한다.

## 2026-08-31 — Work 타이포 앵커, 안정적 첫 페인트와 Home Signal Lab

- Decision: Work 한 줄 설명과 CTA를 모노 메타가 아닌 본문용 system stack으로 전환하고, `500/600` weight, 약 `19–20px`, `1.6` leading과 얇은 signal rule로 하나의 읽기 단위로 묶는다. Enhanced title은 desktop에서 일반 약 `96px`, THING 약 `104px`를 상한으로 둔다. Home의 `Flagship system` 표시는 native radio 기반의 세 단계 `THING Signal Lab`으로 교체한다.
- Reason: 기존 Work는 1280px에서 설명이 약 17.9px SFMono/Consolas로 렌더링되고 제목·설명·CTA가 서로 먼 grid row에 흩어져, 실제 콘텐츠보다 임시 metadata처럼 보였다. Home의 정적 flagship label은 시스템의 핵심인 `21 landmarks → ROS 2 → 7-axis tendon` 흐름을 직접 탐색할 기회를 제공하지 못했다.
- Impact: Home Signal Lab은 HTML radio와 CSS sibling selector만으로 완전하게 작동하고 `:has()`와 typed `@property`는 시각적 enhancement로만 사용한다. 새 JavaScript와 runtime dependency는 없다. Work는 initial HTML이 완전한 static fallback이며, eligible desktop에서만 inline prepaint가 showcase를 최대 1500ms 가린다. GSAP/SplitText와 Signika title face가 그 안에 준비되면 첫 refresh 뒤 한 번에 공개하고, timeout·loader·font 실패 시에는 그 navigation 동안 늦게 horizontal layout으로 재전환하지 않는다.

## 2026-08-31 — Home greeting copy 원복

- Decision: Home Hero의 보이는 역할 라벨과 evidence-first support 문장을 제거하고 `안녕하세요! / 새로운 것을 배우고 직접 만드는 일이 즐겁습니다.`를 복원한다. CTA는 `프로젝트 → / Contact →`로 되돌린다.
- Reason: 첫 화면의 Kinetic 오브제 방향과 일반적인 개인 소개 사이에서 THING 한 프로젝트의 설명이 개인 정체성 전체를 대신하지 않게 하고, 기존의 더 자연스럽고 개인적인 첫 문장을 유지한다.
- Impact: 역할 라벨은 Hero story의 선택 요소가 되며, 없더라도 greeting·CTA·근거 영역의 static 및 enhanced 동작은 유지된다. 프로젝트 전문성은 바로 다음 Projects와 각 case study에서 증명한다.

## 2026-08-31 — Home 전용 GPU Kinetic sandbox

- Decision: Home 첫 viewport의 138svh GSAP story와 THING Signal Lab을 제거하고, 중앙 semantic 소개 뒤에 route-local Kinetic sandbox를 둔다. PixiJS 8 WebGL은 GPU 렌더링, Matter.js 0.20은 일곱 오브제의 충돌·drag·throw·sleeping을 담당한다. WebGPU·Three.js·Worker는 이번 범위에 포함하지 않는다.
- Reason: 첫 화면을 특정 프로젝트 설명으로 고정하기보다 방문자가 즉시 만져 볼 수 있는 개인적 공간으로 만들되, 중앙 문구와 이동 링크의 명료함은 잃지 않아야 했다. Pixi Graphics와 단순 convex body 일곱 개는 이미지 asset 없이 충분한 물성을 제공하고, full 3D stack이나 experimental WebGPU보다 호환성과 복구 경로가 명확하다.
- Impact: `Progressive platform layer`와 `Work 타이포 앵커…Signal Lab`의 “새 runtime dependency 없음” 결정은 Home sandbox에 한해 대체된다. PixiJS·Matter.js는 Home 초기 entry에 포함되지 않고 capability/intro/visibility 통과 뒤 `kinetic-sandbox-runtime` 한 청크로만 요청된다. 2026-08-31 최종 build 기준 청크는 `195.70 kB raw / 57.12 kB gzip`이다. Reduced/forced-colors/import/WebGL 실패는 초기 CSS 오브제를 유지하며, 다른 10개 route에는 canvas와 Kinetic runtime entry가 없다.
- Impact: 보이는 조작 UI를 두지 않는 대신 자율 motion은 초기 settle 뒤 sleeping으로 끝난다. 화면 이탈·hidden·pagehide에서 ticker가 정지하고 native touch scroll을 보존한다. 중앙 이름·문장·CTA와 navigation은 정적 collision boundary이자 별도 DOM layer라서 오브제가 콘텐츠를 가리거나 tab order에 들어가지 않는다.

## 2026-08-31 — Kinetic 보간·문자 충돌·고정 광원

- Decision: Home sandbox의 60Hz world step 안에서 8.33ms 물리 substep 두 번을 수행하고, 이전·현재 pose를 Pixi frame 사이에서 보간한다. 이름은 보이는 SVG letter별, 인사말은 공백을 제외한 word별, CTA는 button별 정적 body로 측정한다. 모든 재질은 화면 좌상단 바깥의 하나의 고정 점광원을 공유하고 그림자는 전역 shadow layer에서 합성한다.
- Reason: 고주사율 화면에서 Matter pose를 그대로 복사하면 같은 위치가 반복되어 미세한 끊김이 보였고, 큰 문장 사각형은 보이지 않는 공백까지 막았다. 오브제와 함께 회전하는 고정 offset 그림자는 각 물체가 서로 다른 광원을 가진 것처럼 보여 공간의 현실감을 약하게 만들었다.
- Impact: 던지기는 최근 입력 표본을 시간 가중 평균하고 전체 벡터 크기를 제한한다. 글자와 충돌하면 오브제별 탄성을 유지한 채 튕기지만 글자 사이 공간은 통과할 수 있다. 유리 ring은 compound segment로 실제 구멍을 가지며, 광원은 렌더링에만 관여하고 물리 결과는 바꾸지 않는다. WebGL fallback, reduced/forced-colors, native touch scroll, offscreen·hidden pause와 sleeping 계약은 유지한다.

## 2026-09-01 — Home 손글씨 서명 1.5초 호흡

- Decision: Home의 12-path `Se Min Kong` 필기 duration을 desktop과 compact 모두 총 `1500ms`로 늘린다. 기존 path 길이 비례 배분, 획순과 Anime.js easing은 유지한다.
- Reason: 기존 `780ms / 560ms`는 완성 속도가 빨라 실제로 이름을 쓰는 장면보다 짧은 reveal처럼 읽혔다. 약 1.5초의 호흡은 각 획을 인지할 시간을 주면서도 첫 화면을 오래 막지 않는다.
- Impact: 첫 wheel, pointer, touch와 keyboard 입력은 계속 이벤트를 소비하지 않고 서명만 즉시 완료한다. Reduced motion, hash/BFCache·복원 진입은 정적 완성 상태이며, Kinetic runtime은 자연 완료 또는 조기 완료 뒤에 기존대로 시작한다.

## 2026-09-02 — 기존 원본 Resume 프리뷰 재공개

- Decision: 사용자의 명시적 승인에 따라 전화번호와 생년월일이 포함된 기존 1-page Resume PNG, PDF와 DOCX를 원본 그대로 다시 공개한다. `/resume/` Hero 바로 다음에 원본 미리보기와 PDF 다운로드·새 탭 보기·DOCX 다운로드 행동을 복원한다.
- Reason: Resume 페이지에서 원본 문서의 실제 구성과 다운로드 경로를 즉시 확인할 수 있던 기존 경험을 되살려 달라는 요청을 반영한다.
- Impact: 이 결정은 2026-08-31 `HTML-first Resume`의 세 원본 파일 비공개 범위만 대체한다. 배포 manifest와 검증기는 승인된 세 파일명만 추가로 허용하고 다른 Resume 파일은 계속 거부한다. 반응형 HTML Resume, 연락 경로와 원본의 비공개 보관 사본은 유지한다.

## 2026-09-02 — Resume Hero 연락처의 균일한 행 리듬

- Decision: Resume Hero의 이메일·GitHub·위치를 desktop/fine pointer에서 `36px`의 동일한 세 행으로 묶고 행 사이 추가 gap을 제거한다. Coarse pointer에서는 두 링크만 `44px` 터치 목표를 유지한다.
- Reason: 링크에만 적용된 `44px` 최소 높이와 `7px` gap 때문에 첫 두 행은 약 `51px`, 위치 앞은 약 `41px`로 벌어져 연락처가 하나의 묶음으로 읽히지 않았다.
- Impact: 폰트 크기·굵기·색과 semantic 순서는 유지한다. 좁은 화면과 확대 환경에서 이메일·GitHub·위치가 컨테이너 밖으로 넘치지 않도록 각 행은 `overflow-wrap: anywhere`를 사용한다.

## 2026-09-02 — 원본 Resume 프리뷰의 페이지 기준 중앙 정렬

- Decision: `원본 이력서` 라벨은 section 시작점에 유지하되, 파일 행동과 1-page 프리뷰를 담은 `.resume-original__content`는 두 grid column 전체를 가로질러 최대 `808px` 폭으로 페이지 중앙에 배치한다.
- Reason: 공통 Resume block의 `150px 라벨 + 82px gap + 808px 본문` 구조를 그대로 사용하면 문서 중심이 1040px 본문 중심보다 `116px` 오른쪽으로 밀렸다.
- Impact: 데스크톱의 기존 문서 크기, intrinsic ratio, 파일 행동, focus와 hover는 유지한다. 808px보다 좁은 화면에서는 content가 가용 폭 100%로 줄어들어 768px과 390px에서도 같은 중앙축과 native vertical flow를 사용한다.

## 2026-09-03 — Home 인사말 타이포 통일

- Decision: Home Hero의 `안녕하세요! / 새로운 것을 배우고 직접 만드는 일이 즐겁습니다.` 전체를 `프로젝트` CTA와 같은 display font로 표시하고, `즐겁습니다.`의 별도 강조 markup·색·굵기를 제거한다.
- Reason: 첫 문장과 CTA가 서로 다른 글꼴 언어로 분리되고 문장 끝만 signal color로 강조되어, 사용자가 요청한 하나의 일관된 인사말보다 두 개의 시각적 메시지처럼 보였다.
- Impact: 문구, 두 줄 semantic 구조, 크기·행간, CTA와 Kinetic motion은 유지한다. 강조 제거 뒤에도 text contrast와 responsive fit은 기존 기준을 따른다.

## 2026-09-03 — 검증 가능한 Resume Awards와 개인정보 최소화 증빙

- Decision: 제공된 Drive의 네 수상 증서를 확인해 HTML Resume와 1-page DOCX/PDF/PNG를 동기화하고, Awards마다 공개용 세로 WebP를 여는 native modal 버튼을 제공한다. 공개 이미지는 공세민의 이름과 증명에 필요한 수상 사실을 남기되 다른 팀원의 이름과 모든 학번을 불투명하게 가린다.
- Reason: 수상 이력을 정확한 공식 명칭·등급·날짜로 갱신하면서 방문자가 같은 화면에서 근거를 확인할 수 있어야 하고, 팀 증서에 포함된 제3자의 개인정보는 공개 목적에 필요하지 않다.
- Impact: `public/resume/` allowlist는 업데이트한 Resume 세 파일과 네 개의 명시된 WebP만 추가 허용한다. 원본 Drive PDF는 저장소와 배포물에 포함하지 않는다. 하나의 native dialog가 네 버튼을 재사용하며 scroll lock, focus trap/복귀, Escape와 실제 백드롭 닫기, reduced-motion 정적 표시를 계약으로 검증한다.

## 2026-09-04 — Awards를 개인정보·일련번호를 가린 전시로 전환

- Decision: 사용자의 요청에 따라 공개 상장 이미지의 일련번호도 불투명하게 가리고, 버튼·modal·접근성 문구를 `상장 보기 / Award gallery / 전시용 이미지`로 통일한다. 공식 증명서 원본을 제공하는 UI가 아니라 수상 기록의 전시다.
- Scope: SSAFY `(884,208,226,40)`, 캡스톤 `(109,168,301,46)`, SW 공모전 `(214,169,249,63)`의 번호를 가렸다. 프로리그에는 별도 일련번호가 없으며, 공세민 다음 행의 타인 이름 획 잔여를 `(482,781,278,69)`로 보강했다. 좌표는 원본 이미지의 x/y/width/height다.
- Preservation: 공세민, 발급기관·발급자, 상명·등급·날짜·직인은 유지한다. SW 공모전의 기존 마스크가 덮었던 공세민 끝부분은 실제 원본 PDF의 150dpi raster에서 `(664,734,111,52)`만 가져와 복구했다. 문자 재생성은 사용하지 않았다. 원본 Drive 파일과 공유 권한은 변경하지 않는다.
- Verification: 이미지 편집 도구의 후보는 해상도·문자 보존 조건을 만족하지 않아 배포하지 않았다. 최종 lossless WebP는 지정된 영역 밖 변경 0픽셀, 새 마스크 안 비검정 0픽셀, 허용 이름 원본 불일치 0픽셀을 검사했다. 수상자·번호 경계를 두 차례 육안 확인하고 승인 파일 해시를 tests에 고정했다.

## 2026-09-04 — 웹과 연결된 14쪽 정적 포트폴리오

- Decision: 승인한 A4 세로 14쪽 구성으로 여섯 프로젝트의 문제·본인 역할·구현 판단·검증 범위를 정리한다. 표지, THING 본인 작업, Alkkagi의 세 쪽 시안을 먼저 렌더링한 뒤 전체를 제작했다. 실제 사진·관제 화면·추론 예시와 간단한 흐름도, 나눔고딕 본문·Helvetica 표제, 종이색·먹색·주홍 한 색의 편집 스타일을 사용한다.
- Evidence: `docs/portfolio-evidence.md`에 공개 코드·본인 커밋·작업 기록과 참고 포트폴리오를 연결했다. THING·AQIS·Briefit의 팀 결과를 개인 성과와 구분하고, 재현 근거가 없는 MRI 정확도와 실측되지 않은 60FPS·생산성 수치는 PDF에서 제외한다. Home MRI 카드의 잘못된 U-Net 표기는 확인한 YOLO11로 바로잡았다.
- Publication: `public/portfolio/SeMinKong-Portfolio.pdf` 한 파일만 공개한다. Resume의 별도 정적 포트폴리오 영역과 Home Contact에 다운로드 경로를 두고 PDF에는 읽을 수 있는 웹 URL, QR, 여섯 상세 페이지·공개 코드 링크와 책갈피를 제공한다. 기존 원본 이력서와 motion 동작은 유지한다. 사용자 지정 GitHub Pages 주소를 유지하며 새 호스팅 서비스로 이전하지 않는다.
- Privacy: PDF에는 전화번호·생년월일·타인 수상자·상장 일련번호·비공개 Drive 링크를 넣지 않는다. 상장은 텍스트 목록과 웹 전시 링크로 연결한다. 최종 파일은 사용자 지정 Drive의 비공개 `Portfolio` 하위 폴더에 저장하며 원본 증서나 공유 권한은 변경하지 않는다.
- Maintenance: 편집 원본은 `scripts/portfolio/build_portfolio.py`, 렌더링 결과와 검수 중간물은 ignored `output/pdf/`, `tmp/pdfs/portfolio/`에 둔다. 새 판은 전체 PDF를 다시 렌더링·검수한 뒤 public 사본과 승인 해시·byte size·표시 날짜를 함께 갱신한다. 배포 검증은 Portfolio 폴더의 비승인 파일을 거부한다.

## 2026-09-04 — Home 손글씨 조기 종료 시 SVG 상태 정리

- Decision: 서명 종료 시 timeline cancel 이후 drawable의 SVG 속성 네 개를 명시적으로 제거한다. 실제 scroll·hashchange와 setup 실패도 공통 종료 경로로 수렴시킨다.
- Reason: Anime.js 4.5의 drawable은 inline style뿐 아니라 SVG dash 속성을 직접 쓴다. 기존 종료 코드는 style만 제거하여 현재 획의 일부와 아직 시작하지 않은 획이 가려진 상태로 남았다. `revert()`는 시작 상태인 숨긴 획을 되돌릴 수 있으므로 원래의 solid SVG로 복구한다.
- Impact: 중단 시 `i`의 점을 포함한 이름 전체가 즉시 보인다. 입력 차단, 필기 시간·디자인 변경이나 새 의존성은 없다. 실제 controller를 실행하는 15개 회귀 테스트와 실제 Anime 브라우저 검사로 모든 종료 경로·정적 진입·native 입력을 확인한다.

## 2026-09-04 — 정적 포트폴리오 다음 개정판의 소개와 수상 배치

- Decision: 사용자는 밀도 높은 구성과 자기소개 중심의 도입부를 원한다. 소개와 About은 공세민 본인의 소개·학력·교육·관심 분야를 다루고, 프로젝트명이나 프로젝트 성과를 연결해 성향·강점을 설명하지 않는다. 제공되지 않은 개인적 동기나 성격은 임의로 만들지 않는다.
- Project narrative: 프로젝트 본문에서만 류병선 참고 자료의 문제·선택·구현·결과 흐름과 문철현 참고 자료의 조밀한 메타데이터 정리 원칙을 적용한다. 팀 결과와 개인 기여, 검증된 사실과 미측정 항목을 계속 구분한다.
- Awards: 사용자 확인으로 SSAFY 공통 프로젝트 우수상은 THING, 나머지 세 수상(IT대학 소프트웨어 공모전 금상, 숭실 캡스톤디자인 경진대회 장려상, IT 프로젝트 프로리그 장려상)은 Briefit에 연결한다. 다음 개정판에서는 해당 프로젝트 안에 수상 내역과 웹 전시 링크를 배치한다.
- Scope: 기획 기준의 수정이며 현재 공개된 14쪽 PDF와 웹은 변경하지 않는다. 앞서 제안한 가로 18쪽은 확정된 제작 사양이 아니다.

## 2026-09-04 — 소개 중심의 가로 18쪽 정적 포트폴리오 구현

- Decision: 기획 적용 요청에 따라 A4 가로 18쪽으로 제작한다. 1–2쪽은 프로젝트를 언급하지 않는 소개·About, 3쪽 프로젝트 목차, 4–6쪽 THING, 7–9쪽 AQIS, 10–12쪽 Briefit, 13–14쪽 MRI, 15–16쪽 Alkkagi, 17쪽 Prompt Generator, 18쪽 Contact다.
- Design: 류병선의 문제·선택·구현·결과 흐름과 문철현의 밀도 높은 역할·기간·기술 정리 원칙을 적용한다. 38pt 여백, 2–3단 조판, 얇은 구분선, 나눔고딕 본문·Helvetica 영문, 기존 종이색·먹색·주홍을 사용한다. 실제 미디어를 원본 비율로 쓰며 AI 이미지나 장식 터미널은 추가하지 않는다.
- Content: 소개는 확인된 학력·교육·관심 분야와 배우고 만드는 즐거움만 다룬다. 프로젝트는 개인·팀 범위와 구현값·측정 성능을 구분한다. 수상은 THING 1건과 Briefit 3건으로 배치하고 기존 마스킹 이미지만 연결한다.
- Verification: Python 검사로 18쪽·책갈피·텍스트 경계·조판 겹침·링크·소개 분리·수상 배치·민감정보 패턴을 확인한다. `--sample`은 공개할 수 없고 `--publish`는 검수한 최종 파일만 기존 public 경로에 복사한다. PDF는 invariant 출력으로 재현 가능하게 생성한다.
- Scope: 웹은 기존 다운로드 URL을 유지하면서 파일과 안내 정보만 갱신한다. 기존 Resume 문서·상장 원본·웹 모션은 변경하지 않는다. Drive는 기존 PDF ID와 비공개 공유 상태를 유지한다. 이번 제작 요청만으로 Git commit/push, GitHub Pages 배포 또는 Sites 재배포를 수행하지 않는다.

## 2026-09-04 — 원본 자료와 로컬 재현을 반영한 20쪽 개정

- Decision: 하드웨어 없는 재현과 시각자료 추가 요청을 반영해 THING 구성도와 MRI 전처리 재현 페이지를 추가한다. 1–2쪽 소개·About, 3쪽 목차, 4–7쪽 THING, 8–10쪽 AQIS, 11–13쪽 Briefit, 14–16쪽 MRI, 17–18쪽 Alkkagi, 19쪽 Prompt, 20쪽 Contact다.
- Visuals: THING 발표자료 28쪽 구성도와 본인 작업 일지 사진, Prompt README 설계 흐름도는 원본 구성을 사용한다. AQIS는 제공된 Canva 자료와 코드를 대조한 벡터 구성도로 정리한다. Briefit·MRI·Alkkagi·Prompt의 구현 구조도도 코드에서 확인한 연결만 그린다.
- Reproduction: Alkkagi 실제 두 클라이언트 플레이, AQIS 장치 차단 mock HTTP/WS, Prompt 빈 키 초기 화면을 캡처한다. Briefit 후처리와 MRI 마스크 변환은 원본 함수를 합성 입력으로 실행한 결과로 표시한다. 외부 LLM·학습·모델 추론·실물 장치 실행은 수행하지 않는다. AQIS 원본 테스트 2개 실패와 Alkkagi 기존 production TypeScript 오류는 숨기거나 임의 수정하지 않는다.
- Privacy: 작업용 사진의 GPS 등 EXIF와 Canva PNG의 XMP를 제거한다. 압축 픽셀은 재인코딩하지 않고 JPEG의 방향값만 유지하며 검증한다. 원본은 ignored clone에만 보존한다. 최종 PDF 사진은 내부에서만 JPEG 품질 88로 압축해 약 10MB로 맞추고, 캡처·도식과 이미지 비율은 유지한다.
- Provenance: 고정 commit, 원본/정제본 해시와 실행 범위는 `docs/portfolio-visual-sources.md`, 합성 결과는 `scripts/portfolio/assets/reproduction-evidence.json`에 남긴다. 공개 경로에는 검수한 PDF만 들어간다.
- Delivery scope: 기존 public 다운로드 파일·Resume 안내·기존 비공개 Drive PDF를 갱신한다. Git commit/push 및 공개 웹 배포는 이번 작업에 포함하지 않는다. 원본 Resume와 상장 마스킹, 홈 애니메이션은 그대로 유지한다.

## 2026-09-04 — README 시연 영상 프레임 활용

- Decision: 사용자가 README 동영상의 프레임 추출을 허용했다. 새 모델 결과를 생성하지 않고 기존 시연 영상의 대표 장면을 20쪽 PDF의 7·8·14·17쪽에 반영한다. 분량과 도입부·수상 배치는 유지한다.
- Selection: THING 캔 파지 웹 변환본 00:10, AQIS 원본 00:10 검출·실물 장비, MRI 기존 웹 데모 00:07.73 분류·분할 표시, Alkkagi 원본 00:07 조준선을 사용한다. AQIS·Alkkagi는 기존 로컬 재현 캡처를 작은 보조 이미지로 유지한다. 영상 프레임과 새 실행 결과를 혼동하지 않도록 각 출처·시간·범위를 구분한다.
- Privacy and fidelity: 얼굴 일부가 보이는 THING 모방 장면과 경로가 보이는 MRI 파일 선택 장면은 사용하지 않는다. 선정 프레임에는 환자 신원·실명·키가 없음을 확인했다. 영상에서 원래 크기로 디코딩하며 크롭·내용 보정·합성하지 않는다. THING은 기존 HEVC/HLG→H.264/SDR 웹 변환본임을 구분한다. MRI 화면의 소견은 로딩 상태이므로 완료된 기능으로 주장하지 않는다.
- Delivery: 최종 20쪽·8,469,645 bytes PDF와 기존 비공개 Drive 파일, 로컬 웹 다운로드 용량을 갱신한다. Git commit/push·공개 웹 배포는 하지 않는다.

## 2026-09-04 — 처음 보는 독자를 위한 시각자료 재구성

- Decision: 사용자의 후속 요청에 따라 영상 프레임과 로컬 실행 화면을 별도 출처 라벨로 나누지 않는다. PDF는 무엇을 보여주는지 설명하는 캡션과 번호를 사용하고, 출처·시점·실행 조건은 내부 `portfolio-visual-sources.md`에 보존한다. 합성 문장·마스크는 실제 모델 결과와 혼동하지 않도록 `예시`로 표시한다.
- Visuals: THING 로고 구성도를 한국어 기능 흐름도로 바꾸고 구동 사진에 부품 번호를 붙인다. 캔 파지, AQIS 관제, MRI 원본·영역 비교와 Alkkagi 조준 화면을 크게 쓴다. AQIS/Alkkagi의 작은 중복 이미지와 Prompt API 키 입력창을 제거한다. Prompt는 여섯 영역을 묶은 대화→영역별 프롬프트→통합 설계 문서로 설명한다.
- Accuracy: MRI 분류·분할은 독립 경로, Briefit 평가는 후처리 전 생성문 비교, AQIS 정지는 설정 시간 대기라는 조건을 유지한다. 새 모델 출력·하드웨어 실행·성능 수치를 주장하지 않는다. 팀 결과와 본인 범위, THING 1개/Briefit 3개 수상도 유지한다.
- Preservation: 원본 raster 파일은 수정하지 않는다. PDF 배치에서만 THING 파지와 MRI 비교 영역을 비율 유지 확대하고 번호/화살표를 겹쳐 놓는다. 적용 영역은 내부 문서에 기록한다. 웹 구조·CSS·모션·기존 Resume·상장은 변경하지 않는다.
- Delivery: 검수한 20쪽 PDF, 로컬 다운로드 파일·안내·검증 계약과 기존 비공개 Drive 파일을 동기화한다. Git commit/push와 공개 배포는 별도 요청 전까지 수행하지 않는다.

## 2026-09-04 — 최종 포트폴리오 웹 배포 승인

- Authorization: 사용자가 최종 PDF의 웹 연결, Drive 업로드와 웹 배포를 명시적으로 요청했다. 앞선 로컬 전용 범위를 해제하고 기존 GitHub Pages 배포 경로를 사용한다. 별도 Sites 주소로 이전하거나 공유 설정을 변경하지 않는다.
- Artifact: 검수한 20쪽 A4 가로 PDF 6,138,051 bytes, SHA-256 `D8CA46FCB84B5D0C9F08C2F8BCCBA7EB39C2A27D4BDEF639046D7091C4C13046`를 그대로 배포한다. Home·Resume의 기존 다운로드 URL, 상장 이미지와 모션을 유지한다.
- Scope: 최종 PDF·웹 안내·생성/검증 소스·정제된 작업 자산과 관련 문서만 포함한다. `tmp/`, 비공개 원본, 로컬 재현 clone과 렌더 초안은 포함하지 않는다. Drive는 기존 파일 ID와 비공개 Portfolio 폴더를 유지해 같은 바이트로 갱신한다.

## 2026-09-04 — 웹·정적 PDF 변경 후 배포를 기본 완료 조건으로 지정

- Authorization: 사용자가 웹 또는 정적 PDF에 변경이 있으면 항상 배포하도록 기억해 달라고 명시했다. 앞으로 승인된 변경 작업은 검증과 기존 GitHub Pages 배포까지 포함하며, 필요한 범위의 Git commit/push도 별도 배포 요청 없이 수행한다. 이전 결정의 별도 배포 요청 조건은 이 기본 지침으로 대체한다.
- Workflow: PDF 변경 시 최종 렌더 검수, public 다운로드 사본과 용량·날짜·해시 계약 동기화, production build를 수행한다. 웹 변경도 관련 검증을 통과시킨 뒤 기존 파이프라인으로 배포하고 실제 공개 페이지·다운로드 반영을 확인한다.
- Boundary: 요청 범위 밖 수정, 비공개 원본, 임시 파일과 검증하지 않은 초안은 배포하지 않는다. 검토·진단·기획만 요청한 경우 수정으로 확대하지 않으며, 이번처럼 지침만 기록한 경우 불필요한 웹 배포는 하지 않는다. 이후 사용자의 로컬 전용·배포 보류 지시가 있으면 우선한다. 실패나 권한 차단 시 미완료 범위를 명확히 보고한다.

## 2026-09-04 — 정적 PDF 타이포그래피 보정과 PDF 전용 프로필

- Decision: 승인된 검토 계획에 따라 4·6·7·8·11·14쪽의 짧은 문장 끝줄을 어절 보존과 의미 단위 줄바꿈으로 정리한다. 6·7·11·14쪽의 다섯 사진 캡션은 실제 사진 시작선·폭과 10pt 간격을 공유한다. 2쪽 하단 설명과 14쪽 본문 간격을 재분배한다. 글꼴·크기·원문 내용·20쪽 구성·도식은 유지한다.
- Portrait: 사용자가 지정한 `공세민_증명사진` 원본 PNG(1086×1448)를 첫 자기소개 페이지에 180×240pt로 배치하고 기존 개인 정보를 아래의 2×2 묶음으로 정렬한다. 인물·배경·사진 비율을 편집하지 않는다. 사용자의 최종 지시는 PDF 전용이므로 시도했던 웹 사진 markup·CSS를 제거했고 Home은 이전과 동일하다.
- Privacy: 사진 원본은 ignored `.private/portfolio/se-min-kong-profile.png`에 보관한다. 공개 저장소나 `src/assets`, `public`, `dist`에 별도 사진을 넣지 않고 승인한 PDF 안에만 포함한다. 해당 원본 없이 PDF를 재생성할 때는 소유자가 제공한 사진을 먼저 로컬 private 경로에 준비해야 한다. 웹 빌드는 이미 검수한 public PDF를 그대로 사용하므로 private 원본을 요구하지 않는다.
- Delivery: 기존 웹 다운로드와 비공개 Drive PDF를 같은 최종 파일로 갱신하고 기존 GitHub Pages에 배포한다. 새 사이트·공유 권한 변경·원본 Resume/상장/웹 모션 수정은 없다. 캡션 다섯 개와 문단 끝줄 열한 개를 PDF 검증 계약에 추가한다.

## 2026-09-04 — PDF 증명사진 중앙 정렬

- 사용자의 후속 요청에 따라 첫 페이지 사진을 오른쪽 255pt 소개 영역의 수평 중앙에 배치한다. 실제 사진은 180×240pt, top 113pt를 유지하고 x만 548pt에서 585.5pt로 이동한다. 하단 구분선과 개인 정보의 위치, 다른 페이지는 유지한다.
- PDF 전용 사진 원칙을 유지하며 웹에는 새 사진을 추가하지 않는다. 검수한 PDF의 기존 다운로드를 갱신·배포하고 Drive도 같은 파일 ID로 동기화한다. 실제 PDF 이미지 좌표와 레이아웃 기록의 중앙 정렬을 회귀 검사한다.

## 2026-09-04 — 정적 PDF의 문장형 제목·장식 정리

- Scope: 사용자가 지목한 `PORTFOLIO / 날짜` footer가 있는 정적 PDF를 기준으로 적용한다. 웹은 기존 다운로드 파일을 교체하고 화면·모션을 바꾸지 않는다.
- Editing: 문장형·수사형 제목을 프로젝트명과 구체적인 주제의 명사형으로 정리한다. 표지 인사말은 슬로건 크기/굵기에서 일반 본문으로 내리고 자기소개는 기존 About의 사실만 사용한다. 목차·연락처의 문서 구성 설명과 감사·작성 기준 등 중복 안내를 제거한다.
- Furniture: 반복 영문 머리말·프로젝트 장식 번호·Portfolio/날짜 footer를 없애고 단일 쪽수와 출처 링크를 남긴다. 사실 필드의 작은 영문 대문자 라벨은 10pt 중립색 한글로, 출처는 9pt로 표시한다. Alkkagi 소제목 번호와 Briefit의 독립 학습/생성/평가 앞 번호를 제거한다. 사진 대응 번호와 실제 순서 번호는 유지한다.
- Preservation: 20쪽·그림/사진 픽셀 및 배치·출처 URL·기술 수치·예시 표시·역할 및 수상 귀속·평가/구현 한계·중앙 정렬한 PDF 전용 사진은 유지한다. 원본 사진과 scratch는 공개하지 않는다. 변경 후 PDF 렌더와 구조를 검수하고 웹 및 기존 비공개 Drive 파일을 동기화한다.

## 2026-09-04 — 현재 거주지 Suwon 반영

- 사용자의 거주지 정정에 따라 Home Contact, About의 역할/위치 및 Based in, Resume의 현재 위치와 정적 PDF 표지를 Seoul에서 Suwon으로 통일한다. 국가 표기, 서체·배치·모션과 과거 이력은 유지한다.
- 웹·PDF의 현재 거주지 회귀 검사를 추가한다. 검수한 PDF를 기존 웹 다운로드와 Drive 파일에 동기화하고 GitHub Pages에 배포한다. 과거 결정/검수 기록의 Seoul은 당시 기록으로 남긴다.

## 2026-09-04 — 현재 배포본 v2.1.0 릴리스

- 사용자가 현재 버전을 다음 release에 반영하도록 요청했다. 최신 v2.0.1 이후 Kinetic Home, 상장 모달, 정적 PDF 다운로드가 추가됐으므로 호환 가능한 기능 추가의 minor 버전 v2.1.0으로 묶는다. Suwon을 반영한 c9f8fe1의 웹/PDF 콘텐츠를 그대로 유지하며 이번에는 버전·변경 이력·릴리스 노트만 추가한다.
- package와 lockfile 버전을 맞추고 누락된 누적 변경을 최종 상태 기준으로 정리한다. 기존 main 배포 경로를 이용해 검증한 정확한 커밋에 annotated tag를 붙이고 GitHub Release를 발행한다. PR이나 새 호스팅 경로는 만들지 않는다.
- 릴리스 첨부는 이미 공개·검수된 PDF 한 파일로 제한한다. PDF를 재생성하거나 Drive 파일/공유 권한을 변경하지 않으며 원본 사진·tmp·초안은 포함하지 않는다.
