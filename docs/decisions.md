# Decision log

## 2026-08-10 — Home portfolio overview

- Layout: On desktop windows 820px high or shorter, compact the Hero copy, gaps, and real-media panel so both columns remain fully inside the initial viewport.

- Decision: Replace the Home Hero's decorative hand-first composition with a real THING demo panel, a visible project-scope summary, and an immediate Selected Work section.
- Reason: Visitors should be able to identify the developer, representative proof, technical range, and the next browsing path without interpreting a long visual sequence.
- Impact: The existing Hero copy, two project actions, media lifecycle, and reduced-motion behavior remain; the decorative hand is hidden on Home and the About teaser follows project evidence.

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
- Impact: Home, Work, About, HTML Resume와 프로젝트 previous/next 순서를 THING 중심으로 맞춘다. 저장소가 현재 private이고 개인별 역할 근거가 없으므로 접근 제한을 명시하고 구체적인 개인 직책은 주장하지 않는다. 실제 비공개 asset을 hotlink하지 않고 저장소 문서에 근거한 독립적인 system visual을 사용한다.

## 2026-08-10 — 상시 보이는 탐색 경로와 전체 카드 링크

- Decision: Hero의 행동을 `THING 프로젝트 보기`와 `전체 프로젝트`로 바꾸고, Home project card와 Work row 전체를 하나의 primary link로 만든다. 고정 내비게이션은 아래 방향 스크롤에서도 숨기지 않는다.
- Reason: 기존 Hero는 About·Resume를 중복 강조했고, 카드에서는 작은 제목과 화살표만 링크로 읽혀 touch와 빠른 훑기에서 다음 행동이 잘 보이지 않았다.
- Impact: 프로젝트 링크는 한 카드당 keyboard tab stop 하나를 유지하면서 시각적 hit area를 카드 전체로 넓힌다. `프로젝트 살펴보기 →` 라벨을 항상 노출하고, 내비게이션 링크의 대비와 최소 높이를 높인다. Anime.js reveal, page transition, depth, reduced-motion과 native touch scroll 기준은 유지한다.

## 2026-08-10 — 공개 THING 실제 미디어 우선

- Decision: 공개 전환된 THING 저장소의 최종 시연 영상은 Home featured card, Work row, THING case hero에 사용하고, 통합 텐던 핸드 사진과 Jetson·MediaPipe 시험 사진은 case evidence로 추가한다.
- Reason: 직접 만든 system visual보다 실제 시제품과 동작 증거가 프로젝트의 신뢰도와 완성 범위를 더 빠르게 전달한다.
- Impact: system visual은 제어 구조를 설명하는 보조 자료로 유지한다. 영상은 muted, playsinline, viewport·visibility·reduced-motion에 따라 자동 재생을 멈추는 기존 lifecycle을 사용한다.
