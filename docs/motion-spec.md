# Motion specification

## 2026-08-10 — Home Hero hand restoration

The dexterous hand remains the Hero's signature 2.5D motion. Its existing Anime.js, pointer, lifecycle, touch, and reduced-motion safeguards remain intact. The real THING preview follows in Featured Selected Work at its native portrait ratio, without inner depth translation or crop, and retains its muted, playsinline, visibility-aware, and reduced-motion lifecycle.

Status: Approved for implementation — 2026-07-14

## Confirmed preference

- 사이트는 정적인 작품 목록보다 살아 있는 시스템처럼 느껴져야 한다.
- 스크롤 액션은 현재보다 역동적이어도 된다.
- 기본 화면은 깔끔하게 유지하고, 모션은 콘텐츠를 읽을 때 구조와 역할을 설명해야 한다.
- 강한 움직임은 섹션 전환과 대표 case study에 집중하고 ambient motion은 절제한다.
- Motion과 Depth는 지원 환경에서 기본 적용하고 사용자에게 별도 on/off 버튼을 노출하지 않는다.
- `prefers-reduced-motion`, 터치, coarse pointer, 작은 화면에서는 자동으로 안전한 표현으로 줄인다.

## Brand intent

모션은 AI 시스템이 입력을 감지하고, 상태를 해석하고, 물리적 행동으로 반응하는 과정을 표현한다.

- Scroll / pointer: 사용자의 탐색 입력
- Line / path: 시스템 내부의 정보 흐름
- Layer movement: 판단과 반응의 깊이
- Project transition: 서로 다른 문제 해결 구조를 탐색하는 흐름
- Status feedback: 사용자의 행동에 대한 명확한 응답

로봇 팔, 회로, 뇌 모양 같은 상징을 무조건 추가하지 않는다. 실제 프로젝트 내용과 연결할 수 있는 데이터, 경로, 좌표, 센서 반응을 우선한다.

## Confirmed signature interaction — Name to Action Scroll

Hero는 이름을 첫 상태로 고정하고, 사용자의 기본 세로 스크롤 진행도에 맞춰 핵심 문장을 누적한다.

1. `Name` — `SeMinKong`이 화면의 가장 큰 정보로 즉시 보인다.
2. `Perception` — `AI가 인식한 것을`이 등장한다.
3. `Decision` — `소프트웨어의 판단으로,`가 앞 문장 아래 누적된다.
4. `Action` — `현실의 움직임으로.`가 완성되고 영문 system path가 나타난다.
5. `Release` — sticky 구간이 끝나며 일반 문서 흐름으로 AQIS chapter가 올라온다.

- 외곽 hero track과 `100svh` sticky viewport를 사용하며 wheel, touch, key 입력을 가로채지 않는다.
- Anime.js timeline 하나를 `autoplay: false`로 만들고 스크롤 progress로 seek한다.
- desktop은 약 `118svh`, tablet은 약 `108–112svh`, mobile은 약 `106svh`의 짧은 track을 사용한다. 최소 travel은 유지해 scroll-seek가 즉시 끝나지 않게 한다.
- timeline은 track의 첫 90% 안에서 완성하고 마지막 10%는 완성된 문장을 읽는 hold로 남긴다.
- 큰 페이지 점프나 빠른 플링은 감쇠를 생략하고 현재 scroll progress에 즉시 동기화한다.
- CTA와 skip link는 모션 진행도와 무관하게 사용할 수 있어야 한다.
- reduced-motion에서는 긴 track과 sticky를 제거하고 이름, 전체 문장, CTA를 정적으로 모두 표시한다.

Hero가 release된 뒤에는 추상 시스템 모션을 반복하지 않는다. Home은 실제 프로젝트 화면 preview로 전환하고, 구현 설명은 독립 상세 페이지에서 읽는다.

- 실제 화면 이미지에는 낮은 각도의 pointer depth만 적용한다.
- 실제 데모 영상은 `preload="none"`으로 두고 화면 안에 있을 때만 재생하며, 화면 밖·숨겨진 탭·reduced-motion에서는 정지한다.
- 상세 페이지 진입은 제목과 핵심 문장에 짧은 Anime.js sequence를 사용한다.
- 본문은 1회성 clip·translate reveal만 사용하고 긴 sticky 구간을 추가하지 않는다.

## Section choreography

### Hero

- 이름, 역할, 한 줄 소개와 CTA는 첫 화면에 즉시 보인다.
- 첫 진입 시 역할 → 이름 → 소개 → CTA가 짧은 Anime.js sequence로 조립되고, 낮은 강도의 geometric mark가 천천히 움직인다.
- 스크롤 초반에 이름은 작아지고 흐려지지만 완전히 사라지지 않으며, 핵심 문장 세 줄은 이전 줄을 유지한 채 누적된다.
- 문장 완성 뒤 system path가 나타나고 sticky가 release되며 AQIS case study로 이어진다.
- 별도 hero canvas, 무작위 field, wheel·touch interception은 사용하지 않는다.

### Flagship case study

- 실제 AQIS 구동 영상과 RealOps 화면이 추상 HUD보다 먼저 보인다.
- 영상은 visibility와 motion capability에 맞춰 재생·정지한다.
- 시스템 흐름은 합성 preview 대신 정적인 텍스트 본문 구조로 설명하고 읽기 속도를 모션이 지배하지 않게 한다.

### Selected projects

- Home과 Work index의 실제 media preview에 1회성 reveal과 제한적인 depth response를 사용한다.
- 카드마다 별도 장식 애니메이션을 만들지 않고 실제 이미지·영상 자체를 우선한다.
- 상세 페이지마다 색조는 달라도 intro와 reveal의 속도·거리·easing은 공유한다.
- 결과 수치와 역할이 장식 요소보다 먼저 읽힌다.

### About and contact

- About은 Home의 두 문단으로 압축하고 상세 경력은 `/resume/`로 보낸다.
- Contact에서는 움직임이 차분하게 수렴해 명확한 CTA에 집중한다.

## Motion intensity

현재 추천값은 `medium-high transitional / low ambient`다.

- 강하게 움직이는 구간: Hero → AQIS 전환, AQIS 네 단계, 프로젝트 전환
- 중간 강도: 제목 reveal, project visual의 제한적인 depth response
- 낮은 강도: 작은 상태 pulse와 선형 diagram 변화
- 제거: 상시 ticker, 무작위 파티클, contact trail, 큰 각도의 카드 tilt

한 화면에서 강한 모션은 하나만 동작하게 한다.

## Motion hierarchy

### Ambient

- status pulse와 diagram 변화처럼 오래 지속되는 낮은 강도의 움직임
- 시선을 빼앗지 않도록 느리고 작은 범위를 유지한다.
- 화면 밖, 비활성 탭, reduced-motion 환경에서는 정지한다.

### Transitional

- 제목, 섹션, diagram state 진입
- opacity만 반복하지 않고 clip, line draw, depth shift를 콘텐츠 성격에 맞게 사용한다.
- 한 화면에서 너무 많은 요소가 동시에 시작하지 않도록 stagger한다.

### Interactive

- 버튼, CTA, 프로젝트 선택, 정밀 포인터용 project depth response
- 포인터 위치를 목표값으로 저장하고 하나의 requestAnimationFrame 루프로 감쇠한다.
- pointermove마다 새 Anime.js 인스턴스를 만들지 않는다.

### Feedback

- 링크, CTA, 프로젝트 상태가 포인터·키보드·터치 입력에 즉시 반응한다.
- 자동으로 모션이 축소되더라도 모든 중간 상태가 읽을 수 있는 최종 상태로 정리된다.

## Timing ranges

- Micro feedback: 180–320ms
- Hover and magnetic return: 420–700ms
- Section reveal: 760–1100ms
- Diagram state transition: 700–1200ms
- Ambient loops: 8–30s
- Stagger: 40–100ms

스크롤 연동 상태는 고정 duration 애니메이션을 반복 생성하지 않고 progress 또는 목표 상태를 단일 루프에서 보간한다.

## Reduced motion

- `prefers-reduced-motion: reduce`에서는 반복 루프, 커서 추적, 카드 기울기, 스크롤 시차를 자동으로 멈춘다.
- 사용자가 별도 설정을 조작하지 않아도 OS 선호가 즉시 반영된다.
- Hero의 긴 sticky track은 일반 문서 높이로 줄이고 누적 문장을 처음부터 완성된 상태로 표시한다.
- sticky diagram은 정적인 단계 요약 또는 세로 인라인 다이어그램으로 대체한다.
- 콘텐츠와 기능은 모션이 없어도 처음부터 모두 표시되어야 한다.

## Touch and mobile working strategy

- 세로 페이지 스크롤을 방해하지 않는다.
- 정밀 포인터 전용 효과와 2.5D tilt는 비활성화한다.
- Hero sticky travel은 desktop보다 약 절반으로 줄이되 native 세로 스크롤과 문장 누적은 유지한다.
- AQIS sticky diagram은 제거하고 각 단계를 1열 또는 2열 inline summary로 보여준다.
- reveal은 짧은 1회성 transition으로 축소한다.
- 프로젝트 탐색에 가로 스크롤을 사용하더라도 기본 touch 관성을 유지하고 세로 스크롤을 가두지 않는다.
- 모바일에서는 `lite / static` 상태를 기본으로 사용하고 Hero travel을 `200svh`로 제한한다.

## Performance budget

- 기본 모션 엔진은 Anime.js를 유지한다.
- 하나의 시각 요소를 여러 시스템이 동시에 transform하지 않도록 소유권을 분리한다.
- 동일 이벤트에서 다수의 애니메이션 인스턴스를 반복 생성하지 않는다.
- 연속 모션 모듈은 각자 `visibilitychange`와 관찰 영역 상태에 맞춰 pause/resume한다.
- `IntersectionObserver`와 `visibilitychange`로 화면 밖 또는 숨겨진 loop를 정지한다.
- 새 대형 3D 런타임은 별도 승인 없이 추가하지 않는다.
- 2.5D visual은 DOM / SVG / CSS transform과 필요 시 Canvas 한 개 범위에서 해결한다.

## Content dependency

- 모션 수치와 상태 문구는 의미 없는 임의 값 대신 실제 프로젝트 정보와 연결한다.
- AQIS 시스템 단계와 각 구성요소는 공개 가능한 범위를 확인한 후 구현한다.
- Brain Tumor 결과 수치는 평가 맥락을 함께 표시할 수 있을 때만 강조한다.
- 실제 콘텐츠가 없는 영역은 과장된 성과 대신 `Experiment`, `Prototype`, `Learning`으로 정직하게 표시한다.

## Verification

- 기본 환경에서 Motion과 Depth가 자연스럽게 적용되는지 확인한다.
- OS reduced-motion에서 자동 축소되는지 확인한다.
- touch / coarse pointer에서 포인터 추적과 tilt가 자동 비활성화되는지 확인한다.
- 빠른 스크롤과 역방향 스크롤에서도 diagram state가 튀거나 역전되지 않는지 확인한다.
- 탭 visibility 변경 후 OS 설정과 현재 capability에 맞는 자동 상태로 안전하게 재개되는지 확인한다.
- 390px, 768px, 1280px에서 sticky 구간, overflow, 텍스트 가독성을 확인한다.
- 키보드만으로 모든 CTA와 프로젝트 링크에 도달할 수 있는지 확인한다.
- 모바일 touch에서 세로 스크롤이 가로 제스처나 visual layer에 막히지 않는지 확인한다.

## Confirmed automatic behavior

- Desktop: `medium-high transitional / low ambient`
- Mobile: 짧은 reveal과 정적 snapshot 중심의 단순화된 모션
- Motion / Depth control: 사용자에게 on/off 버튼을 노출하지 않음
- Motion default: 지원 환경에서 자동 활성화
- Depth default: fine pointer와 충분한 viewport에서 자동 활성화
- Reduced motion: OS 설정에 따라 자동 비활성화 또는 축소
- AQIS 시각화: 현재 공개된 이력서 사실 범위 안에서 추상화하고 확인되지 않은 수치를 만들지 않음

## 2026-07-14 — Editorial inertia refinement

이 항목은 앞서 정한 긴 Hero travel과 반복 reveal 강도를 대체한다. 레퍼런스가 Lenis와 GSAP를 사용하는 것은 확인했지만, 이 프로젝트는 Anime.js를 주 모션 엔진으로 유지하고 스크롤 자체를 가로채는 라이브러리는 추가하지 않는다.

### Native scroll and visual inertia

- 브라우저의 wheel, touch, keyboard 스크롤은 그대로 유지한다.
- 화면 안의 실제 프로젝트 미디어에만 스크롤 속도를 저역 통과시킨 `8–16px` 범위의 후행 이동을 적용한다.
- 상세 화면처럼 글자가 포함된 이미지는 최대 `8px`, Home과 Work preview는 최대 `14px`로 제한한다.
- 텍스트 본문에는 parallax를 적용하지 않는다.
- 관찰 영역 밖, 숨겨진 탭, reduced motion, coarse pointer, 작은 화면에서는 즉시 정적 상태로 정리한다.

### Hero

- Hero는 실제 AQIS 미디어가 함께 보이는 짧은 sticky composition으로 바꾼다.
- 전체 track은 desktop `160svh`, tablet `135svh`, mobile `115svh`를 기준으로 한다.
- 이름과 핵심 문장은 처음부터 읽을 수 있고, 스크롤은 문장 두 줄의 명암·위치와 AQIS 미디어의 position·saturation, 짧은 proof caption을 진행시킨다.
- 무한 회전 mark, 반복 ambient pulse, 세 줄의 추상 슬로건 누적은 제거한다.
- 일반 스크롤 중 snap을 사용하지 않고 시간 기반 감쇠 `1 - exp(-12 * dt)`로 진행률을 따라간다.

### Reveal and transition

- 페이지 진입: 480–560ms, `cubic-bezier(0.22, 1, 0.36, 1)`
- Eyebrow/meta: 420ms, y 12–14px
- Title line: 820–900ms masked vertical reveal
- Lead/body: 650–720ms, y 20–24px
- Project media: 900–1000ms clip reveal. depth transform과 충돌하지 않는 wrapper에서만 짧은 내부 이동을 사용한다.
- Facts and rows: 45–60ms stagger
- 같은 origin의 페이지 이동에는 최대 320ms의 짧은 Anime.js exit transition을 사용하고, hash·mailto·외부 링크·modifier click은 가로채지 않는다.

### Pointer depth

- 회전은 최대 X `1.5deg`, Y `2deg`, scale `1.006`으로 제한한다.
- 내부 이미지 이동은 최대 `6–8px`로 하고 transform의 CSS transition과 rAF spring을 중복 적용하지 않는다.
- 영상 controls가 있는 상세 미디어에는 tilt를 적용하지 않는다.

### Reduced and constrained modes

- `prefers-reduced-motion`에서는 Hero sticky, visual inertia, pointer depth, page exit delay를 제거한다.
- mobile/coarse pointer에서는 짧은 1회 reveal만 남기고 native scroll과 video controls를 우선한다.
- 콘텐츠는 모션이 없어도 처음부터 완전한 읽기 순서와 최종 상태를 가진다.

## 2026-07-14 — Perception Core motion override

이 항목은 위의 `Hero에 AQIS 미디어를 배치`하는 연출을 대체한다. 스크롤을 가로채지 않는 native sticky narrative와 Anime.js 주 모션 엔진은 유지한다.

### Scroll-linked Hero

- Hero track은 desktop `160svh`, tablet `135svh`, mobile `122svh`를 기준으로 한다.
- 높이 `780px` 이하에서는 폭과 별개로 Core, 문장 크기, frame padding을 함께 줄여 sticky viewport 안에서 내용이 잘리지 않게 한다.
- 이름과 역할, CTA는 처음부터 접근할 수 있다. 스크롤은 문장 각 행의 opacity / y, Core의 opacity, iris scale / rotation, ring opacity, progress line만 진행시킨다.
- 이름 영역은 최대 `8px`만 위로 이동하고 완전히 사라지지 않는다.
- 스크롤 진행은 기존 시간 기반 감쇠를 사용하며 wheel, touch, keyboard 입력을 가로채지 않는다.

### Ambient Core

- desktop full: outer `42s`, middle `52s` 역회전, inner `32s`의 선형 무한 회전.
- tablet lite (`721px` 이상): outer ring 하나만 `58s`로 회전.
- mobile `720px` 이하와 reduced-motion: 읽기 좋은 3/4 정적 자세.
- 반복 회전은 Core가 화면 밖이거나 문서가 hidden / pagehide 상태이면 pause하고 다시 보이거나 pageshow될 때 resume한다.
- filter, blur, background-position은 반복 애니메이션하지 않고 compositor transform을 사용하는 세 ring으로 제한한다.

### Depth and transform ownership

- desktop fine pointer에서만 Core 전체에 spring tilt를 적용한다. Core 전용 최대값은 X `3.15deg`, Y `4.2deg`, scale `1.006`이다.
- `data-depth-root`가 전체 tilt, 바깥 `data-depth-layer`가 작은 위치 차, 내부 `data-core-spin`이 회전을 각각 소유한다.
- 한 노드에 scroll timeline, pointer depth, ambient spin의 transform을 중복 적용하지 않는다.
- touch, coarse pointer, tablet 이하에서는 pointer tilt를 자동 제거하고 native vertical scroll을 유지한다.

### Reduced and static result

- `prefers-reduced-motion` 또는 local `?motion=reduced`에서는 Hero sticky track을 일반 문서 높이로 바꾸고 문장·Core·progress를 완성 상태로 표시한다.
- Core의 모든 loop와 pointer depth는 정지하지만 lens, ring, 의미 범례는 그대로 보인다.
- Core는 포커스 대상이나 조작 UI가 아니며 키보드 순서에 추가하지 않는다.

## 2026-07-14 — Dexterous manipulation motion override

이 항목은 위의 `Perception Core motion override` 중 Core에 관한 내용을 대체한다. Hero 스크롤 타임라인은 문장 행과 진행선만 제어하고, 손과 큐브의 transform에는 관여하지 않는다.

### Continuous object motion

- 큐브의 독립 X/Y 무한 회전과 손가락별 비동기 idle을 사용하지 않는다. 큐브 pose, 손목 보정, 다섯 손가락 관절, 접촉 케이블의 tension을 하나의 master manipulation timeline이 소유한다.
- full 환경은 `9.6s` 동안 `grip → thumb push → contact transfer → index pull → grip` 순서로 진행한다. 마지막 큐브 X/Y 각도는 첫 자세에서 정확히 `+360deg`가 되어 loop 경계가 보이지 않는다.
- lite 환경은 같은 접촉 순서를 `14.4s`로 늦춰 유지한다. pointer tracking과 세부 반응은 제거되지만 큐브와 관절의 협응은 계속 보인다.
- 큐브 이동은 손 안에서 X `±8px`, Y `2–8px` 범위로 제한하고 scale은 애니메이션하지 않는다.
- 반복 모션은 Hero 스크롤 진행률과 독립적이며 객체가 보이는 동안 계속된다.

### Pointer and press response

- fine pointer + interactive depth에서만 pointermove에 반응한다. 실제 큐브와 각 손가락의 bounding rect를 기준으로 큐브 이동은 최대 X `8px`, Y `6px`, 가까운 손가락 보정은 약 `6.5deg`로 제한한다.
- pointermove마다 Anime.js 인스턴스를 만들지 않고 하나의 rAF spring이 CSS 변수 목표값을 따라간다.
- 큐브 근처에서는 manipulation 속도를 `0.78×`로 늦춰 제어기가 안정화하는 느낌을 만들고, 큐브를 누르면 scale 없이 `560ms`의 작은 이동·회전 impulse를 실행한다.
- 손가락을 누르면 손 전체를 튕기지 않고 가장 가까운 관절 chain만 짧게 수축한다. touch/coarse pointer에서는 이 반응을 끈다.
- `preventDefault`, pointer capture, wheel/touchmove listener를 사용하지 않는다. 장면은 `touch-action: pan-y`로 native vertical scroll을 유지한다.

### Transform ownership and lifecycle

- `data-depth-root`는 장면 전체 tilt, static rig는 3/4 pose와 responsive scale, master timeline은 cube float/axis와 각 digit의 inherited joint variable을 각각 소유한다.
- `data-cube-interactive`는 pointer offset, `data-cube-impulse`는 press feedback, `data-hand-finger`는 pointer whole-chain flex를 소유한다. 한 노드에 두 애니메이션이 transform을 동시에 쓰지 않는다.
- IntersectionObserver 밖, hidden, pagehide에서는 현재 각도를 보존한 채 loop를 pause하고, 다시 보이거나 pageshow일 때 resume한다.
- 환경 모드가 변경될 때만 기존 loop를 revert하고 새 강도로 재구성한다.

### Reduced motion

- `prefers-reduced-motion` 또는 `?motion=reduced`에서는 모든 loop, pointer tracking, press feedback을 정지한다.
- 큐브 면과 링크·피벗 구조의 CSS 3D transform은 제거하지 않고 첫 grip의 정적 3/4 자세를 유지한다.
- 장식 객체는 포커스 순서에 들어가지 않으며, 모션이 없어도 Hero의 텍스트 정보는 동일하게 전달된다.

## 2026-07-14 - Refined hand pose geometry

- The 9.6s Anime.js manipulation timeline, cube path, pointer spring, pause/resume lifecycle, and reduced-motion behavior remain unchanged.
- Static digit roots and base angles were recalibrated for the smaller tapered palm so the index, middle, ring, and little fingertips keep separate silhouettes throughout the loop.
- Joint-cycle offsets stay deliberately small; motion should suggest tendon-driven correction rather than folding the fingers into a bolt chain.
- The thumb remains the primary opposing contact below the cube, while the index supplies the clearest upper contact. The other three digits support the hand silhouette and should not collide visually with the cube.
- Surface-channel opacity may follow the existing structural tension bus, but it must remain subordinate to the solid palm shell.

## 2026-07-14 — Freer palm manipulation override

This interaction range replaces the earlier cube pointer limit of X `±8px` and Y `±6px`.

- Fine-pointer hover follows the pointer across a broad hand-scene radius instead of multiplying distance by a second falloff. Local cube offset is limited to X `±18px` and Y `±14px`, with a faster critically damped return.
- Pressing the cube starts a mouse-only direct drag. Drag offset is limited to X `±32px` and Y `±24px` in rig coordinates so the cube stays over the palm after responsive scaling.
- The master Anime.js manipulation timeline pauses while dragging and resumes from its preserved progress on release. The interactive offset then springs back to the autonomous palm path.
- Cube press feedback uses a stronger translation and rotation impulse without scale. Finger proximity and press flex are widened so individual chains respond before the pointer reaches the exact fingertip center.
- Dragging uses window-level passive pointer listeners without pointer capture or `preventDefault`. Touch and coarse-pointer environments keep native `pan-y` scrolling and do not enable hover, press, or drag interaction.
- Reduced motion, offscreen, hidden, `pagehide`, `pointercancel`, and window blur all cancel transient interaction and preserve the existing static or paused lifecycle behavior.

## 2026-07-14 — Desktop smooth-scroll transport override

이 항목은 위의 `스크롤 자체를 가로채는 라이브러리는 추가하지 않는다` 결정을 대체한다. Anime.js가 계속 Hero, reveal, dexterous-hand, page transition의 primary motion library다.

### Page scroll

- `motion=full`과 `depth=interactive`인 961px 이상 fine-pointer 환경에만 Lenis를 생성한다.
- `autoRaf: true`, `lerp: 0.115`, `wheelMultiplier: 0.9`, `smoothWheel: true`, `stopInertiaOnNavigate: true`를 사용한다.
- `syncTouch: false`로 두어 touch와 coarse-pointer 환경에서 vertical scrolling을 흉내 내거나 가로채지 않는다.
- 768px, 390px, `prefers-reduced-motion`, local `?motion=lite|reduced`에서는 Lenis를 생성하지 않는다.
- hidden 상태에서는 stop하고 visible 상태에서 resume한다. `pagehide`에서는 instance를 destroy한다.
- scroll transport와 중복되는 media-only 후행 이동은 gain `0.34`, 전체 clamp `±12px`로 낮춘다.

### Page transition

- same-origin full-mode link는 `rgba(8, 12, 10, 0.94)` graphite curtain을 opacity `0 → 1`, scale `1.012 → 1`로 210ms 동안 표시한다.
- signal lime full-screen curtain은 사용하지 않는다.
- lite/reduced, hash, mail, tel, download, target, external, modifier click은 지연시키지 않는다.

## 2026-07-14 — Hand 2.5D depth motion refinement

- The existing hand scene remains the only `data-depth-root`; its desktop strength is `1.45` and its hand-specific perspective is `880px`.
- The previously transform-free `.dexterous-hand__tilt` wrapper is the only new parallax layer, using `data-depth-layer="4"`. Anime.js-owned rig, cube, impulse, and digit transforms remain untouched.
- Desktop pointer movement adds a small whole-hand parallax offset on top of the fixed 3/4 pose. No new pointer listener, rAF loop, or Anime.js instance is added.
- Static depth uses relaxed `1080px` perspective at tablet widths and `1200px` on mobile. Reduced motion keeps the layered CSS geometry but zeros root tilt and parallax.
- Existing offscreen, hidden, page lifecycle, coarse-pointer, and native `pan-y` behavior continues to own activation and cleanup.

## 2026-08-10 — Persistent exploration navigation override

- 이 항목은 아래 방향 스크롤에서 `.site-nav`를 화면 위로 숨기던 동작을 대체한다. 모든 route의 고정 내비게이션은 항상 viewport 안에 남고, 18px 이상 스크롤했을 때 배경과 hairline만 전환한다.
- Home project card와 Work row는 하나의 stretched primary link를 사용한다. hover·focus에서는 제목 색과 CTA 화살표만 짧게 이동하며 카드 자체를 과하게 scale하거나 tilt하지 않는다.
- 카드마다 keyboard tab stop은 하나만 유지하고, focus-visible은 카드 전체 outline과 기존 링크 outline으로 확인할 수 있어야 한다.
- 이 변경은 Hero, reveal, depth, Lenis, page curtain timeline을 바꾸지 않는다. touch의 native vertical scroll과 `prefers-reduced-motion` 동작도 그대로 유지한다.

## 2026-08-11 — Editorial redesign motion ownership

- Hero statement는 두 개의 data-hero-line으로 구성하고 기존 scroll-seek Anime.js timeline을 그대로 사용한다. 두 줄 사이에는 초기 line translate가 겹치지 않을 만큼의 layout gap을 확보한다.
- 버튼과 case-next hover는 control 전체를 들어 올리지 않고 화살표만 X축 3px 이내로 이동한다.
- project evidence rail은 media wrapper의 pseudo-element이며 data-depth-card transform을 소유하지 않는다. 실제 media child의 기존 depth/inertia만 유지하고 THING portrait video에는 depth layer를 추가하지 않는다.
- mobile reduced mode에서는 absolute Hero hand를 document flow로 되돌려 다음 section과 겹치지 않게 하고, 내부 rig를 정중앙에 고정해 3D 외곽이 viewport를 넘지 않게 한다. hand animation, pointer response, video autoplay는 계속 정지한다.
- scrolled navigation은 24px 이후 12px blur와 hairline으로 전환하되 viewport 밖으로 숨지 않는다.

## 2026-08-11 — THING manual demonstration lifecycle

- `video[data-demo-video]`는 사용자 controls로만 재생하며 autoplay와 `data-depth-card`를 사용하지 않는다.
- 한 시연이 재생되면 다른 THING 시연을 즉시 pause한다. 시연이 viewport를 벗어나거나 문서가 hidden 상태가 되거나 `pagehide`가 발생하면 pause하고, viewport 재진입 때 자동 resume하지 않는다.
- Hero와 gallery 영상은 `preload="none"`과 로컬 WebP poster를 사용해 화면에 보이기 전 원본 영상 다운로드를 시작하지 않는다.
- gallery 전체에 reveal을 한 번만 적용하고 각 video·card에는 transform 소유권을 추가하지 않는다. touch와 native controls 동작은 그대로 유지한다.

## 2026-08-11 — Sequential Home Hero copy reveal

- Anime.js owns one reversible scroll-seek timeline for the role, two statement lines, CTA group, progress line, and the free outer identity/hand wrappers. The name glyph and every dexterous-hand scene, depth, rig, cube, and finger transform remain outside this timeline.
- Normalized timing is role `5–22%`, first statement `18–45%`, second statement `45–72%`, and actions `78–98%`, followed by a final hold.
- During the first `73%` of the track, the identity wrapper moves from `0` to `-32px` and the hand wrapper from `0` to `-24px`. This is a layout-level lift only; it does not change the hand graphic or its manipulation loop.
- Full motion uses damping `8`; lite motion uses damping `12`. Scroll input stays passive and target geometry is read at most once per requested animation frame.
- CTA pointer interaction is disabled before its reveal threshold. A Tab key or CTA focus immediately settles the timeline at 100% so a keyboard user never lands on an invisible control.
- A head-time pending class masks the staged copy before the module initializes. The enhanced state continues that mask until each Anime.js segment begins, preventing delayed segments from flashing at scroll position zero; a two-second watchdog restores the full copy if enhancement fails.
- Reduced motion removes the staged timeline and sticky travel, clears inline stage styles, and shows the role, statement, actions, and static hand from the start.
- The short mobile layout compresses copy spacing and places the hand at `70svh`, retaining at least a visible gap after the final CTA at 390×568.

## 2026-08-14 — Home project deck motion

- `src/motion/project-deck.js`가 Home deck의 유일한 stack/spread controller다. `motion=full`이면서 `depth=interactive`인 961px 이상 fine-pointer 환경에서만 enhancement를 활성화한다.
- 닫힌 상태는 카드당 X `20–26px`, Y `8px`, 회전 약 `-1.35° / 0.65° / 1.15°`를 사용한다. 열린 상태는 `stage width - card width`를 카드 수로 나눠 세 장을 container 안에 균등 배치하고 회전을 0으로 만든다.
- 펼침은 620ms, 카드별 54ms 지연, `out(4)`를 사용한다. 접힘은 500ms, 역순 30ms 지연, `inOut(3)`를 사용하며 새 상태는 진행 중 Anime.js animation을 cancel한 뒤 현재 값에서 이어진다.
- 실제 카드의 pointer over는 펼치고 deck pointer leave 후 110ms에 접는다. `focusin`은 animation 없이 즉시 펼치고 focused slot의 stacking order를 올리며, focus가 deck 밖으로 나가면 즉시 정적 닫힘 상태로 복귀한다.
- `.project-deck__slot`은 deck transform, `.project-card`는 CSS hover/focus lift를 각각 소유한다. reveal은 wrapper에만 적용하며 deck media에는 pointer depth를 적용하지 않는다.
- tablet, mobile, coarse pointer, reduced motion은 Anime.js deck transform 없이 정적 Grid를 사용한다. ResizeObserver는 현재 상태의 배치를 다시 계산하고, offscreen·hidden·pagehide는 실행 중 animation과 `will-change`를 정리한다. touch drag, pointer capture, horizontal carousel, scroll interception은 추가하지 않는다.

## 2026-08-14 — Deck entry and Hero visibility stabilization

- A pointer entering a collapsed deck opens the stack without first promoting the rear card that happened to receive the hit. Slot activation and elevated stacking order are allowed only after the spread animation has finished.
- Card hover lift is suppressed while the slot animation is running, preventing a rear card from lifting, losing hover, and crossing in front of the deck during its stagger.
- Pointer movement across an already-open, settled deck still activates the hovered slot. Keyboard focus still expands immediately and promotes the focused slot; touch, coarse-pointer, tablet, mobile, and reduced-motion fallbacks are unchanged.
- The Home Hero role, statement, and actions are visible and interactive at scroll position zero. Anime.js retains ownership of their small Y-axis settling motion and of the outer copy/hand lift, but no longer animates essential copy opacity or clip-path.

## 2026-08-14 — Work row link and reveal ownership

- The outer `.work-row` owns the row-level reveal translation and opacity. Index and arrow children may keep their short stagger.
- `.work-row__copy` remains transform-free so the title link's absolute stretched overlay resolves against the positioned row and covers the preview media as well as the copy.
- Preview images and silent videos remain non-interactive evidence surfaces; pointer and touch navigation uses the same single semantic title link. Depth tracking continues to read the media bounds from the row-level pointer target.

## 2026-08-18 — Hero delayed-stage continuity

- The visible role, statement lines, and action group hold their Anime.js starting Y positions during each delayed segment's pre-roll.
- Crossing a segment boundary must not introduce a fresh translate value or make a visible line or button jump downward before settling upward.
- The existing scroll timing, parent copy/hand lift, progress line, keyboard settlement, reduced-motion fallback, and native scroll behavior remain unchanged.

## 2026-08-18 — Name-first Hero scroll rearrangement

- This choreography supersedes the scroll-zero visibility statement in `Deck entry and Hero visibility stabilization`. The full semantic copy remains present, but full/lite enhancement shows only the name and hand at zero progress.
- Anime.js owns the outer identity and hand wrapper rearrangement plus the two greeting lines, actions, and progress line. The hand scene, depth root, rig, cube, and finger transforms retain their existing owners.
- The identity wrapper settles from its responsive start offset to `0` over the first `3000ms` of a `4400ms` timeline. The hand uses only a small responsive outer X/Y correction and also ends at `0`, matching the established completed layout.
- When a resize or orientation change crosses a responsive start-offset breakpoint, rebuild the timeline with the new offsets and immediately seek it to the current scroll progress; stale desktop transforms must never survive into a tablet or mobile composition.
- Greeting line one reveals at `900–1900ms`, line two at `1950–3100ms`, and actions at `3300–4100ms`; all use matching hidden pre-roll poses so forward and reverse scroll remain continuous.
- Actions ignore pointer input before `75%` progress. Any Tab entry or action focus settles the Hero to its complete state. Reduced motion and enhancement failure show the complete static Hero without sticky staging.
- The hand's local ambient glow and shadow use bounded ellipses that reach zero alpha inside the scene on every side; no rectangular compositor boundary may remain visible.

## 2026-08-18 — Hero reading hold and cube flourish

This section supersedes the `4400ms` timing in `Name-first Hero scroll rearrangement` and narrows the earlier cube-independence rule only for a dedicated flourish wrapper. The autonomous manipulation timeline continues to own the inner cube axes, float, fingers, tendons, pointer response, and lifecycle.

- The scroll-seek timeline uses `6000` units. Existing copy timing remains: the outer wrappers settle by `3000`, greeting lines finish by `3100`, and actions run from `3300–4100`.
- `4100–4920` is a transform-free reading hold for the completed greeting and actions.
- Full motion rotates the flourish wrapper four Y-axis turns: `4920–5280` adds one turn with `in(3)`, `5280–5640` adds `2.5` turns linearly, and `5640–5820` adds the final `0.5` turn with `out(4)`.
- Lite/mobile uses the same phase boundaries and easing with two total turns: `0.5 + 1.25 + 0.25`.
- Full motion adds a secondary X tumble that peaks at `180deg`, a brief Z-axis whip, and no more than `10px` of lift, then returns X/Z/lift to zero; lite/mobile omits the X tumble. Neither mode scales or materially moves the hand.
- Pause the autonomous manipulation timeline and clear pointer transients from flourish entry through the final hold, so the visible result is exactly four or two turns. Reverse scrolling below flourish entry resumes the existing autonomous loop.
- `5820–6000` is the final settled hold. Forward and reverse seeking remain continuous at every boundary.
- Actions become pointer-interactive at `4100 / 6000`. Keyboard settlement seeks directly to the completed static state; reduced motion removes the sticky travel and applies no flourish transform.
- Normal-mode track heights are `175svh`, `170svh` at `≤960px`, `165svh` at `≤900px`, and `160svh` at `≤720px`; `≤720px × ≤760px` layouts use a `1020px` minimum track height so the reading hold and lite flourish retain usable scroll distance.

## 2026-08-18 — Cube-finale rotation-count correction

This section supersedes the full/lite Y-axis turn counts, intermediate Y keyframes, full-mode X tumble peak, and keyboard endpoint behavior in `Hero reading hold and cube flourish`.

- Full motion rotates Y by `135deg` at `5280`, `472.5deg` at `5640`, and `540deg` at `5820`; it holds the deliberate half-turned endpoint through `6000` without a release snap.
- Lite/mobile rotates Y by `90deg` at `5280`, `315deg` at `5640`, and `360deg` at `5820`, finishing at its identity orientation.
- Reduce the full-mode X tumble peak to `90deg`. Keep the `4920–5820` timing, easing, `10px` maximum lift, autonomous-loop pause, and reverse behavior unchanged.
- Keyboard settlement completes the copy/actions but overrides the flourish wrapper to its identity pose, preventing a decorative half-turn jump at scroll position zero. Reduced motion and failed enhancement remain neutral and static.

## 2026-08-18 — Continuous cube-finale pacing override

This section supersedes the `6000`-unit duration, `4920–5820` flourish timing, and intermediate Y keyframes/easing in `Hero reading hold and cube flourish` and `Cube-finale rotation-count correction`.

- The timeline duration is `6800`. Copy timing remains unchanged through action completion at `4100`; `4100–5000` is the completed-copy reading hold.
- Y uses one tween from `5000–6600` with `inOut(2)`: full moves from `0deg` to `540deg`, while lite/mobile moves from `0deg` to `360deg`. Do not add Y keyframes at the auxiliary phase boundaries.
- X/Z/lift retain their existing limits and use three auxiliary segments: `5000–5500`, `5500–6200`, and `6200–6600`. They return to zero at `6600`.
- `6600–6800` is the final hold. Full retains its `540deg` Y endpoint and lite/mobile retains `360deg`, without normalization or release snapping.
- Pause autonomous manipulation and clear pointer transients at `5000`; reverse scrolling below `5000` resumes the existing loop. Actions become interactive at `4100 / 6800`.
- Keyboard settlement continues to bypass the flourish and keep the neutral cube pose. Reduced motion and failed enhancement remain static; responsive track geometry remains unchanged.

## 2026-08-18 — Cube-finale inertial handoff override

This section supersedes only the autonomous-loop active range and static composed-cube interpretation in the preceding cube-finale overrides. All scroll timings, outer transforms, turn counts, easing, and transform ownership remain unchanged.

- Treat `[5000, 6400)` as the flourish-exclusive pause window. Clear pointer transients at entry and preserve the autonomous master playhead.
- At `6400`, resume the existing full `9.6s` or lite `14.4s` coordinated manipulation timeline at its normal configured speed and preserved phase. The `6400–6600` overlap with the decelerating outer flourish is the inertial handoff; no extra turn, speed ramp, or second rotation owner is added.
- Keep pointer spring, press, and drag responses blocked through `6600` even though the inner master is running. The Hero event therefore distinguishes an active flourish from permission to run the base master.
- At `6600`, X/Z/lift are zero and outer Y remains at full `540deg` or lite/mobile `360deg`. The inner manipulation loop continues through `6800` and after scroll input stops while the scene remains visible.
- On reverse travel, crossing below `6400` pauses the master without resetting it; crossing below `5000` resumes normal autonomous manipulation.
- If a responsive environment change rebuilds the full/lite master, transfer its normalized iteration progress to the new timeline before applying the current pause/resume state; a breakpoint change must not return the cube to the first grip pose.
- Keyboard settlement takes precedence over the handoff branch and keeps the neutral static pose. Reduced motion, failed enhancement, hidden, offscreen, and page lifecycle behavior remain unchanged.


## 2026-08-20 — Lannino-inspired micro-interaction layer (phase 1)

`docs/lannino-design-reference.md`의 1단계 승인 범위. 기존 environment 티어와 Anime.js 체계 안에 다음 세 패턴을 추가한다.

- Line-masked title reveal: `[data-intro]`가 붙은 순수 텍스트 `h1`과 `data-reveal="title"` 섹션 제목은 full motion에서 단어를 줄 단위로 재구성해 `overflow: hidden` 마스크 안에서 `translateY(118% → 0)`으로 상승시킨다. 줄당 stagger `90ms`, `out(4)`, 제목당 `780–860ms`. 분할 중에는 요소에 원문 `aria-label`을 달고 완료·settle 시 원본 텍스트 노드로 복원해 선택·검색·리사이즈에 흔적을 남기지 않는다. lite는 기존 요소 단위 fade, reduced는 정적이다. `<br>`나 자식 요소가 있는 제목은 자동으로 기존 동작으로 폴백한다.
- Magnetic CTA: `.button`, `.nav-resume`, `.resume-back`이 full motion + fine pointer에서 커서 방향으로 최대 `8px(x) / 6px(y)` 끌려오고 `springStep(190, 22)`으로 복귀한다. rAF는 상호작용 중에만 돌고, 정착하면 transform을 제거하며, hidden·environment 변경 시 즉시 해제한다.
- Underline slide: `.text-link`, `.source-link`에 `currentColor` 1px 언더라인이 왼쪽에서 `scaleX(0 → 1)`로 채워진다(CSS 전용, `340ms var(--ease-out)`). reduced에서는 전환 없이 즉시 상태만 반영한다.

라이브러리 정책: 소유자 결정(2026-08-20)으로 GSAP 도입이 허용되었다. 단, 이 단계의 패턴은 Anime.js + 자체 spring으로 충분해 번들 증가 없이 유지하고, GSAP(ScrollTrigger·SplitText)은 스크럽 초레오그래피·핀 시퀀스·반복 텍스트 분할이 필요한 패턴부터 패턴 단위로 도입한다.


## 2026-08-20 — Name emphasis layer (phase 1.5)

이름과 키워드에 정체성을 싣는 강조 모션. 전부 full motion 전용이며 lite/reduced는 기존 표현을 그대로 쓴다.

- Hero name letter entrance: `.hero-identity__name`을 full motion에서 글자 span으로 분할하고, h1에 임시 `name-mask`(overflow hidden, px 단위 상쇄 패딩)를 씌운 채 글자를 `translateY(114% → 0)`, stagger `34ms`, `out(4)`, `880ms`로 올린다. 등장 후 마스크를 제거하고 글자 span은 hover wave를 위해 유지한다(요소에 원문 `aria-label`, 글자는 `aria-hidden`).
- Name hover wave: Hero 이름(h1 hover)과 내비 워드마크 텍스트에 글자 단위 웨이브 — `y 0 → -6 → 0`(워드마크 -3), Manrope 가변 weight `680 → 800 → 680`(워드마크 650 → 780), `inOut(2)`, 글자당 36/30ms 지연. 실행 중 재트리거를 막고 종료 시 인라인 스타일을 제거한다.
- Focus keyword ignition: reveal이 완료되면 요소에 `is-revealed` 상태 클래스가 붙고, `.focus-list h3`의 34×2px vermilion 밑줄이 `scaleX(0 → 1)`로 점화된다(CSS 전용, `480ms var(--ease-out) 260ms`). 밑줄은 모든 티어에서 최종 상태로 존재하는 디자인 요소이며 reduced에서는 즉시 표시된다.
- `is-revealed`는 이후 단계에서 재사용할 수 있는 범용 reveal 상태 클래스다.


## 2026-08-20 — Micro-interaction suite (phase 2)

lannino 레퍼런스 로드맵의 잔여 패턴. 절제 원칙: hover·리빌 시점에만 동작하고, 케이스 증거 프레임은 확대하지 않으며, 마퀴는 계속 보류한다.

- Cursor follower label: Work 행과 Home deck 카드 hover 시 `VIEW ↗` mono 칩이 커서를 `springStep(210, 24)`로 따라온다(`data-cursor-label`로 문구 교체 가능). full motion + fine pointer 전용, 스크롤·pointerdown·hidden 시 즉시 숨고 reduced에서는 `display: none`.
- Hover media zoom: Home deck 카드와 Work 행의 미디어 내부 `img/video`만 `scale(1.03)`(`720ms var(--ease-soft)`, `:hover`/`:focus-within`). depth 틸트는 컨테이너, 줌은 자식이라 합성된다. 케이스 스터디 증거 미디어는 제외.
- Ignition color: reveal 완료 시 붙는 `is-revealed`를 이용해 케이스 섹션 라벨(h2)과 About 방식 번호가 `--muted → 액센트`로 점화된다(`640ms`, `html.js`의 `:not(.is-revealed)` 사전 상태라 최종 상태·no-JS·reduced 픽셀이 기존과 동일).
- Contact row stagger: Home Contact 패널의 연락처 행들이 기존 `row` 리빌로 순차 등장한다(마크업 속성 추가만).
- Button press dip: magnetic 대상의 pointerdown 시 `scale 0.97`로 눌렸다 복귀한다(spring, full motion 전용).


## 2026-08-20 — Signal thread scroll spine + Hero cube harmonization (phase 3)

- Signal thread: 데스크톱(≥961px)·비 reduced에서 `main` 왼쪽 여백에 1px 레일이 생기고, 버밀리언 fill이 GSAP ScrollTrigger `scrub(0.6)`으로 문서 진행도에 맞춰 차오른다. 최상위 섹션마다 노드가 놓이고 `top 62%` 통과 시 점화, 역스크롤 시 소등된다(가역). 케이스 페이지처럼 단일 래퍼(article) 구조는 내부 섹션으로 자동 드릴다운한다. 모바일·reduced에서는 생성하지 않으며 리사이즈로 조건을 벗어나면 트리거를 kill하고 레일을 제거한다.
- GSAP 도입 범위: gsap 코어와 ScrollTrigger는 이 모듈에서만 동적 import되어 데스크톱 비 reduced 세션에서만 로드된다(gzip: gsap 27.4KB + ScrollTrigger 17.4KB + 모듈 청크 22.5KB). 기존 Anime.js 모듈은 그대로다.
- Hero cube: 면 팔레트를 웜 세트로 통일 — front `--surface-strong`, right `--surface`, left `--bg-raised`, back `#14120f`, bottom `--bg`, top만 `--signal`. 유휴 사이클에서는 차분한 차콜 큐브로 읽히다 버밀리언 면이 한 번씩 스치고, 스크롤 피날레는 red 면으로 정착한다. 케스케이드에 남아 있던 구세대 그린·시안 면 색 선언은 완전히 제거했다.


## 2026-08-20 — Pinned scroll scenes (phase 3.5)

banhmivietnam.xyz류의 챕터형 스크롤 스토리텔링을 두 곳에 도입한다. 데스크톱(≥961px) + full motion 전용이며, lite·mobile·reduced는 기존 정적 레이아웃을 그대로 쓴다(스테이지 클래스와 readout은 JS가 조건 충족 시에만 부착).

- THING demo scenes: `.thing-demo-section`이 ScrollTrigger `pin(fixed)`으로 고정되고 270% 스크롤 동안 시연 4장면이 `scrub(0.5)` + 챕터 `snap`으로 교체된다. 우하단 `scene-readout`(01/04 + 틱)이 진행을 표시하고, 활성 챕터의 영상은 muted 자동재생·비활성은 일시정지(기존 media-playback의 상호 배타 규칙과 협동). 섹션을 벗어나면 전부 정지한다.
- Focus chapters: 홈 `.focus-section`이 170% 동안 핀되어 Vision→Robotics→Systems가 디스플레이 타이포(최대 6.6rem)로 전환된다. 행의 소형 번호는 readout과 중복되어 핀 모드에서 숨긴다.
- Proof count-up: `.project-card__facts strong`, `.work-row__proofs dt`, `.case-facts dd` 중 숫자로 시작하는 값이 진입 시 0부터 1.1s 카운트업(1회, 접미사·소수점 보존). 비숫자 값은 건드리지 않는다.
- Lenis 연동: gsap-loader가 Lenis 인스턴스에 `ScrollTrigger.update`를 구독시킨다. 핀은 `pinType: fixed`로 고정하며, 계측상 약 22px의 고정 오프셋이 있으나 88px 상단 패딩 안에서 시각적으로 무해함을 확인했다.
- 검증 노트: 헤드리스 Chromium은 H.264 미탑재라 자동재생 경로는 호출·포스터 폴백까지 확인했고 실제 재생은 실브라우저 확인 항목으로 남긴다.

## 2026-08-21 — Work-only editorial scroll chapters override

이 항목은 `Signal thread scroll spine`의 전역 rail과 `Pinned scroll scenes`의 Home Focus·THING Demos pin을 대체한다. Proof count-up도 제거한다.

- 모든 진행 UI와 readout을 제거하고, GSAP ScrollTrigger는 Work index의 프로젝트 소개에만 사용한다.
- 데스크톱 full + fine pointer + 961px 이상에서 각 `.work-row`를 최소 `108svh` chapter로 확장한다. 미디어 바깥 wrapper는 CSS sticky로 잠시 고정하고, ScrollTrigger `scrub: 0.55`가 clip, scale, 작은 rotation, opacity를 가역적으로 진행한다.
- 홀수·짝수 chapter는 미디어와 copy의 좌우 위치를 교차한다. 제목 링크의 stretched hit area를 지키기 위해 `.work-row__copy`와 제목에는 transform을 적용하지 않고 opacity만 변화시킨다.
- snap, wheel/touch interception, 별도 progress bar, counter, tick을 사용하지 않는다. 기존 `01–06` 프로젝트 번호가 유일한 위치 표식이다.
- 960px 이하, coarse pointer, lite, reduced motion에서는 GSAP chapter class를 붙이지 않고 완전한 정적 목록과 native vertical scroll을 사용한다.
- environment 또는 viewport가 바뀌면 context와 trigger를 revert하고 class·inline style을 정리한다. 다시 desktop full로 돌아오면 현재 문서 흐름에서 새 geometry로 재구성한다.
- Home Focus는 짧은 row reveal만, THING Demos는 수동 영상 재생과 정적 gallery만 유지한다.

## 2026-08-21 — Work chapter readability and handoff override

- 이 항목은 앞 항목의 `.work-row__copy` opacity 변화 규칙을 대체한다. title link, metadata, summary, proof, stack, CTA는 scroll 전체에서 opacity 1을 유지하며 transform 대상이 아니다.
- media는 18% opacity와 작은 clip/rotation에서 진입해 30% 지점까지 완성되고, 다음 chapter가 들어올 때 58–76% 구간에서 6% opacity로 빠르게 이탈한다. 마지막 index/arrow tween을 100%에 끝내 timeline의 상대 구간을 명시적으로 유지한다.
- THING media는 `min(68svh, 604px)` 높이로 제한하고 별도 portrait sticky top을 사용한다. screen frame은 16:9 contain, Alkkagi는 1:1 cover를 사용한다.
- GSAP 비동기 setup은 generation token으로 pagehide·environment 변경 뒤의 stale completion을 폐기한다. `loadGsap()`을 다시 호출할 때 현재 Lenis instance와 기존 instance를 비교해 `off/on` 구독을 교체한다.
- hover zoom은 `transform` 대신 CSS individual `scale` property를 사용해 depth layer의 translate transform을 덮지 않는다.

## 2026-08-21 — Stacked Project Scenes override

이 항목은 미디어만 sticky로 두고 `01–06` index와 arrow를 별도로 움직이던 Work chapter 규칙을 대체한다.

- 각 Work article은 미디어·copy·proof·stack·CTA를 하나의 실제 semantic link인 `.work-row__composition`에 넣고, 바깥 `.work-row__scene` 전체를 sticky stage로 사용한다.
- GSAP scrub은 composition의 작은 X/Y 이동·scale·rotation·filter, 미디어 mask, 제목 line mask, supporting copy stagger를 한 timeline에서 동기화한다. 활성 장면은 완전한 대비와 identity transform에서 충분히 머문다.
- 다음 장면으로 넘어갈 때 이전 composition 전체가 `scale .975`, 최대 `-4vh`, 작은 rotation과 brightness/saturation 감소로 물러난다. 미디어만 0에 가깝게 사라지는 전환은 사용하지 않는다.
- snap, wheel/touch interception, progress, counter, tick은 사용하지 않는다. 스크롤 transport는 계속 native/Lenis 정책을 따르고 역스크롤에서도 같은 timeline을 가역적으로 seek한다.
- full motion + interactive depth + `min-width: 961px` + `min-height: 700px`에서만 sticky scene을 활성화한다. 짧은 desktop, tablet, mobile, coarse pointer, lite, reduced, GSAP 실패는 inline transform이 없는 정적 editorial grid로 복귀한다.
- focus가 장면 link에 들어오면 composition, title, supporting copy, media mask를 즉시 완성 상태로 정리한다. 프로젝트당 focusable link는 하나다.
- viewport 조건 변경 시 GSAP context를 revert하고 빈 style attribute까지 정리한 뒤, 조건을 다시 만족할 때 현재 geometry로 재구성한다.

## 2026-08-21 — About tool icon interaction

- Simple Icons의 `hex`를 CSS custom property로 전달해 SVG mark에 실제 브랜드 색을 적용한다. 별도 icon runtime이나 image request를 추가하지 않는다.
- full motion + fine pointer hover에서만 icon을 최대 `-3px`, `1.05` scale, `±2deg`로 반응시키고 배경 tint를 강화한다. list item 자체는 interactive control로 가장하지 않는다.
- lite, reduced, touch, coarse pointer에서는 모든 기술명과 색 표식을 정적으로 표시한다.

## 2026-08-21 — About logo wall interaction override

- 이 항목은 앞선 58px badge hover를 대체한다. full motion + fine pointer에서만 100px급 mark를 최대 `translateY(-4px) scale(1.1) rotate(±1deg)`로 반응시키고 브랜드색 기반의 얕은 drop shadow를 더한다.
- Hover한 항목의 기술명은 220–260ms에 나타난다. 자동 순환 spotlight나 상시 움직임은 추가하지 않는다.
- lite에서는 transform 없이 hover label만 제공한다. Touch/coarse pointer와 520px 이하에서는 label을 항상 표시한다.
- reduced motion에서는 icon의 transform·filter와 icon/name transition을 모두 제거한다. 목록은 link나 button이 아니므로 focus target과 pointer cursor를 만들지 않는다.

## 2026-08-21 — Native-ratio video motion override

- Work의 frame-free THING·Alkkagi stage는 rectangular `clip-path`를 사용하지 않는다. 전체 composition의 opacity·translate·scale handoff는 유지하되 영상 자체를 inset mask나 hover crop 안에 넣지 않는다.
- Case-study video는 `data-reveal="video"`를 사용한다. 이 타입은 `14px → 0`의 작은 Y 이동과 opacity만 840ms 동안 적용하며 border radius 또는 clip-path를 만들지 않는다.
- Video와 `figcaption`은 별도 reveal target이다. Caption은 영상이 보이기 시작했다는 이유로 강제 표시하지 않고 자신의 정상 흐름 위치에 진입할 때 text reveal을 수행한다.
- Reduced motion에서는 Work video stage와 case video·caption 모두 transform, clip, opacity 잔여 상태 없이 즉시 완성된 정적 레이아웃을 사용한다.

## 2026-08-21 — About compact tool interaction override

이 항목은 100px급 logo wall의 hover label과 `translateY(-4px) scale(1.1) rotate(±1deg)` 반응을 대체한다.

- 기술명은 모든 motion tier와 pointer 환경에서 처음부터 opacity 1의 정적 최종 상태로 표시한다. Hover는 essential label을 reveal하는 조건이 아니다.
- Full motion + fine pointer에서만 44px 이하 mark를 `translateY(-2px) scale(1.04)`로 반응시키고 작은 브랜드색 drop shadow를 더한다. Rotation은 사용하지 않는다.
- Lite, touch, coarse pointer에는 transform을 추가하지 않는다. Reduced motion은 icon과 name의 transition, transform, filter를 모두 제거한다.
- 개별 도구는 click·focus·pointer cursor를 받지 않으며, CSS micro feedback은 레이아웃이나 인접 기술명의 위치를 바꾸지 않는다.

## 2026-08-21 — Home split-entry intro

- Home direct navigation/reload의 scroll top에서만 별도 overlay timeline을 실행한다. `SeMinKong`은 full에서 640ms 동안 `y 14px → 0`, `scale .985 → 1`, opacity 0→1로 들어오고 260ms 읽기 beat 뒤 split을 시작한다.
- Full split은 780ms 동안 두 paper panel을 X `±100.5%`로 보내고 이름의 두 절반을 X `±18vw`와 opacity 0으로 정리한다. Hero frame에는 transform을 추가하지 않고 opacity `.72 → 1`만 사용한다. 실제 Hero copy는 분할 이름의 fade가 끝나는 split 56% 지점부터 나타나 mobile에서도 두 이름이 겹치지 않게 한다. 총 길이는 약 1.68초다.
- Lite/mobile은 360ms name entrance, 120ms hold, 560ms panel split로 축소하고 name scale을 사용하지 않는다. Reduced motion은 overlay를 생성 상태에서 즉시 제거한다.
- Intro는 기존 page exit curtain, Hero copy/hand scroll timeline, name hover wave, hand rig와 transform ownership을 공유하지 않는다. Lenis는 intro 완료 후 시작한다.
- Wheel, pointer, touch, 실제 scroll, Tab, Escape, Enter, Space, 모든 방향키, PageUp/PageDown, Home/End는 preventDefault 없이 즉시 intro를 완료한다. Hidden, pagehide, nonzero-scroll pageshow, BFCache pageshow, environment→reduced, 2.3초 watchdog도 모든 inline style과 overlay를 정리한다.
- Head의 조건부 prepaint cover는 CSS/module이 준비되기 전 Hero가 먼저 번쩍이는 것을 막는다. Overlay가 활성화되면 이 임시 cover는 즉시 사라져 split 사이로 Hero가 보이며, reduced/hash/back-forward/background-tab에서는 처음부터 만들지 않는다. Intro 동안 stable scrollbar gutter를 유지해 종료 프레임에서 Hero의 가로축이 움직이지 않게 한다.

## 2026-08-21 — Home FLIP handoff override

- Overlay 이름의 typography를 실제 Hero 이름과 맞추고, font 준비 뒤 두 rect의 중심·폭 차이를 측정한다. Full에서는 중앙 이름이 `440ms`에 들어오고 `560ms`부터 panel이 열리며, `610–1320ms`에 실제 h1 위치로 이동한 뒤 `1320–1380ms`에 실제 h1로 crossfade한다.
- Lite/mobile은 `280ms` entrance, `350–920ms` panel split, `385–870ms` FLIP, `870–920ms` crossfade를 사용한다. 고정 좌표 없이 현재 viewport의 실제 h1 rect를 사용한다.
- Intro 재생 중 Hero 이름의 letter entrance와 generic `data-intro` animation은 실행하지 않는다. Name emphasis는 착지 후 hover wave만 제공한다.
- Hero의 초기 normalized progress는 `4100 / 6800` reading state다. Native scroll progress는 `landing + raw × (1 - landing)`으로 매핑해 완료된 copy·hand·CTA를 유지하면서 cube flourish로만 전진한다.
- Anime timeline에는 `6600–6800`의 명시적 final hold를 두어 normalized progress와 실제 timeline duration을 일치시킨다.
- Supporting copy와 navigation은 FLIP의 마지막 구간에 panel opening과 동기화해 조립하고, 조기 입력·resize·pagehide에서는 모든 임시 opacity와 overlay를 한 번에 제거해 완성된 Hero를 즉시 노출한다.

## 2026-08-21 — Home handwritten word entrance override

- Overlay word를 아홉 개의 intro 전용 글자로 분할하고, 각 글자에 10–12° 사선 edge의 `clip-path`와 opacity `.48 → 1`을 적용한다. 글자 자식에는 translate·scale·weight 변화를 주지 않으며, writing layer의 전체 폭만 exact word rect에 맞춰 lite의 kerning 차이를 흡수한다.
- Full은 글자당 `150ms`, `42ms` stagger로 약 `486ms` 동안 쓴다. `500–550ms`에 정확한 FLIP용 word로 crossfade하고, panel은 `560ms`, 부모 FLIP은 `610ms`에 시작한다.
- Lite/mobile은 글자당 `120ms`, `34ms` stagger로 약 `392ms` 동안 쓴다. `400–440ms` word crossfade, `450ms` panel opening, `485ms` FLIP으로 이어져 전체를 약 `1.02s` 안에 끝낸다.
- 하나의 3×10px nib만 글자 진행 방향으로 움직이며 opening 전 opacity 0이 된다. Nib은 body의 fixed 장식 요소라 word rect에 포함되지 않고, 완료·취소·scroll·resize·pagehide 모든 경로에서 overlay와 함께 제거한다.
- Reduced motion, hash entry, BFCache는 writing DOM을 만들지 않는다. 실제 Hero h1과 name hover wave의 소유권은 기존 모듈에 남긴다.

## 2026-08-22 — Home intro editorial pacing override

이 항목은 바로 앞 세 Home intro 규칙의 타이밍만 대체한다. Reference에서 가져오는 것은 브랜드 모션을 완성 상태로 읽힌 뒤 커튼을 여는 순서이며, 기존 warm-paper, live `SeMinKong` text, nib, split panels, responsive FLIP을 그대로 사용한다.

- Full: ink wipe `120–1346ms`, exact-word swap `1350–1450ms`, centered-name hold `1450–2700ms`, panel split `2700–4700ms`, FLIP `2800–4450ms`, h1 crossfade `4450–4700ms`, copy assembly `3600–4450ms`, navigation assembly `3800–4700ms`.
- Lite/mobile: ink wipe `80–880ms`, exact-word swap `880–960ms`, centered-name hold `960–1700ms`, panel split `1700–3100ms`, FLIP `1780–2940ms`, h1 crossfade `2940–3100ms`, copy assembly `2400–2940ms`, navigation assembly `2500–3100ms`.
- Intro watchdog는 timeline end 뒤 `1300ms` 여유를 두어 full `6000ms`, lite `4400ms`에 정리한다. Head prepaint fallback은 font race와 module start를 포함해 `6500ms`에 모든 pending class를 제거한다.
- Wheel, pointerdown, touchstart, scroll, resize, keyboard, hidden, pagehide, BFCache, environment 변경은 이전처럼 즉시 complete한다. 어떤 경로에서도 입력을 prevent하거나 실제 Hero/hand transform 소유권을 가져오지 않는다.
- Reduced motion, hash entry, restored scroll, background entry는 intro DOM을 만들지 않고 완성된 Hero를 즉시 노출한다.

## 2026-08-22 — Home intro stroke-order and bounce override

이 항목은 `Home handwritten word entrance`의 clip-path·nib 모션과 `Home intro editorial pacing`의 ink 구간을 대체한다.

- Full path drawing은 `100–1450ms`, 마지막 글자 settle은 약 `1725ms`까지 겹친다. SVG→exact word crossfade는 `1700–1800ms`, centered hold는 `1800–2850ms`, panel split은 `2850–4850ms`다.
- Full 필기 동안 중앙 부모 scale은 `1.16 → 1.32`, FLIP `2930–4580ms`에는 `1.32 → measured targetScale`이다. Overlay→실제 h1 handoff는 `4580–4830ms`, copy는 `3750–4580ms`, navigation은 `3950–4850ms`에 조립한다.
- Lite/mobile path drawing은 `80–900ms`, 마지막 settle은 약 `1106ms`까지 겹친다. SVG→exact word는 `1070–1150ms`, hold는 `1150–1850ms`, panel split은 `1850–3250ms`다.
- Lite/mobile 필기 동안 중앙 부모 scale은 `1.10 → 1.18`, FLIP `1930–3090ms`에는 `1.18 → measured targetScale`이다. H1 handoff는 `3090–3250ms`, copy는 `2550–3090ms`, navigation은 `2650–3250ms`에 조립한다.
- 획 길이 대신 수동 weight로 전체 drawing window를 나누어 `S → e → M → i stem → i dot → n → K stem → K upper → K lower → o → n → g` 순서를 고정한다. 각 글자 완료 시 full `1 → 1.055 → 1`, lite `1 → 1.035 → 1` scale과 `0 → -7/-4px → 0` Y 반동을 한 번만 실행한다.
- 기존 `6500ms` head fallback과 timeline end 뒤 `1300ms` watchdog은 새 full `4850ms` / lite `3250ms` 길이를 수용한다. 모든 입력·resize·visibility·page lifecycle·reduced-motion 정리 경로는 유지한다.

## 2026-08-22 — Persistent handwritten Hero handoff override

이 항목은 바로 앞 stroke-order 규칙의 `SVG→exact word` 교대와 실제 Hero Manrope crossfade를 대체한다. 획순, bounce, scale, hold, panel 및 FLIP timing은 유지한다.

- Intro SVG는 path drawing이 끝난 뒤 opacity 1로 유지되어 centered hold와 FLIP을 그대로 수행한다. 중간 Manrope word layer는 geometry 측정용으로만 숨겨 두며 화면에는 나타나지 않는다.
- Full `4580–4830ms`, lite/mobile `3090–3250ms` handoff는 서로 다른 서체가 아니라 동일한 12획 geometry를 가진 Intro SVG와 정적 Hero SVG 사이의 crossfade다.
- 정적 Hero SVG는 초기 HTML에 포함하고 intro 재생 여부를 결정하기 전에 존재 여부를 확인한다. 따라서 JS가 늦게 시작하거나 reduced motion, hash, BFCache, scroll restoration, input skip 경로여도 다른 서체를 먼저 그리지 않는다.
- Hero h1 자체가 `aria-label="Se Min Kong"`으로 의미를 제공하고 SVG 및 폭 측정용 fallback은 접근성 트리에서 제외한다. Name emphasis 모듈은 이 Hero를 글자 span으로 다시 분해하지 않는다.

## 2026-08-22 — Visible typography and signature metric separation

- 보이는 UI 글꼴을 Asta Sans와 Geist Mono로 바꾸더라도 Intro의 12개 SVG path, stroke draw 순서, bounce, reading hold, panel reveal과 FLIP duration은 변경하지 않는다.
- `.home-intro__word`와 `.hero-identity__name-text`는 투명한 geometry provider이므로 계속 `Manrope Variable` 680을 사용한다. `fontsReady()`도 이 metric font를 기다린 뒤 중앙/착지 rect를 계산한다.
- Header wordmark의 full-motion weight wave는 Asta heading 기준값 640에서 시작해 기존 peak 780까지 움직인다. Hero의 손글씨 SVG에는 variable-font wave를 적용하지 않는다.
- Reduced, hash, BFCache와 입력 skip 경로는 이전과 동일하게 Intro를 생략하거나 원자적으로 종료하고, 보이는 정적 SVG와 Asta Sans 본문을 즉시 표시한다.

## 2026-08-22 — Dongle static-weight motion compatibility override

- 보이는 display/UI가 static `Dongle` 400/700으로 바뀌어도 Intro의 12개 SVG path, 획순, 글자별 settle bounce, scale, reading hold, panel reveal과 responsive FLIP timing은 변경하지 않는다.
- `.home-intro__word`와 `.hero-identity__name-text`는 `Manrope Variable` 680과 `-0.055em` tracking을 명시적으로 고정한다. `fontsReady()`도 계속 이 metric font를 기다린다.
- Header wordmark hover는 Dongle 700을 유지한 채 글자별 `y 0 → -3px → 0` lift wave만 수행한다. 존재하지 않는 중간 weight를 합성하거나 700/400 사이에서 튀게 바꾸지 않는다.

## 2026-08-23 — Shared SVG paper-reveal override

이 항목은 앞선 좌우 panel reveal과 Intro SVG→Hero SVG crossfade 규칙을 대체한다. 획순, 글자별 bounce, 중앙 hold, 입력 skip과 reduced-motion 규칙은 유지한다.

- Intro cover는 두 half panel이 아니라 warm-paper 단일 veil 하나다. Full `2850–4750ms`, lite `1850–3200ms`에 opacity `1 → 0`으로 옅어지며 실제 Hero 전체를 한 면으로 드러낸다. 별도 방향성 wipe, seam, blur 또는 두 장의 panel 이동은 사용하지 않는다.
- 서명은 translucent 중간색에서 사라지는 `difference` blending을 쓰지 않는다. Paper가 절반 이상 옅어진 후 stroke color를 `paper-ink → var(--text)`로 짧게 전환해 밝은 배경과 어두운 Hero 모두에서 대비를 유지한다.
- Hero copy, robotic hand와 navigation은 veil 후반에 opacity로 조립한다. Paper가 아직 밝을 때 hand가 서명 뒤에 유령처럼 겹치지 않으며, 종료 시점에는 모두 opacity 1이다.
- 필기 SVG는 full `2930–4580ms`, lite `1930–3090ms`에 숨은 Manrope text가 아니라 Hero의 실제 정적 SVG rect를 목표로 X/Y/scaleX/scaleY를 계산한다. 착지 rect의 x/y/width/height는 네 축 모두 target과 같아야 한다.
- 자연 종료에서는 Intro의 animated SVG 노드를 Hero wrapper로 직접 reparent하고 초기 정적 SVG만 제거한다. opacity crossfade나 새 SVG 생성은 없으며, 완료된 drawable·letter inline style을 정리한 뒤 최종 Hero class만 남긴다.
- `scrollbar-gutter: stable`을 문서 전체에 유지해 Intro의 body overflow 변경 전후 `vw` 기반 Hero 크기가 바뀌지 않게 한다. 390·768·1280에서 완료 직전과 직후 font-size 및 SVG rect 변화는 0을 목표로 한다.
- Pointer, wheel, touch, keyboard, resize, visibility, BFCache, watchdog 종료는 animated SVG를 commit하지 않고 초기 HTML의 정적 Hero SVG를 즉시 표시한다. Reduced motion과 hash 진입도 Intro DOM을 활성화하지 않는다.
- Reduced, hash, BFCache와 input skip에서는 이전과 같이 동일한 정적 Hero SVG와 최종 typography를 즉시 표시한다.

## 2026-08-23 — One-second post-writing handoff override

이 항목은 `Shared SVG paper-reveal`의 중앙 hold와 전환 timing만 대체한다. 획순, 필기 속도, 글자별 bounce, 동일 SVG node handoff와 단일 paper veil은 유지한다.

- Full path drawing은 기존처럼 `100–1450ms`다. 마지막 획 뒤 `50ms`만 두고 veil을 `1500–2380ms`에 fade하며, 마지막 글자 settle이 끝나는 `1725ms`부터 SVG를 `1725–2295ms`에 Hero rect로 옮긴다. 필기 완료부터 Intro 종료까지 `930ms`다.
- Lite/mobile path drawing은 기존처럼 `80–900ms`다. Veil은 `940–1660ms`, SVG 이동은 마지막 settle과 맞춘 `1105–1595ms`이며 필기 완료부터 Intro 종료까지 `760ms`다.
- Hero copy와 hand는 full `1720–2380ms`, lite `1090–1660ms`에 조립한다. Navigation은 각각 `1810–2380ms`, `1160–1660ms`로 짧게 뒤따른다.
- 중앙에서 완성된 이름을 별도로 정지해 읽히는 hold는 두지 않는다. 마지막 글자의 탄성 settle과 veil fade를 겹쳐 필기의 생동감은 유지하면서 다음 화면으로 연속적으로 연결한다.
- Timeline watchdog은 계산된 종료 뒤 기존 `1300ms` 여유를 유지한다. Head prepaint fallback은 새 full timeline과 font/module startup 여유를 포함해 `4000ms`로 줄인다.

## 2026-08-23 — Aspect-ratio invariant signature handoff override

이 항목은 `Shared SVG paper-reveal`의 `scaleX / scaleY` 착지 계산과 SVG stretch 규칙을 대체한다. 획순, 글자별 bounce, veil, copy assembly와 full/lite timing은 유지한다.

- 초기 HTML의 Hero SVG와 Intro에서 생성하는 SVG는 모두 `preserveAspectRatio="xMidYMid meet"`를 사용한다. 정적 fallback, reduced/hash/BFCache, 조기 종료, 자연 완료 뒤 reparent된 SVG가 같은 비율 정책을 공유한다.
- 필기 중 확대는 `entryScale → introScale`의 단일 `scale`만 사용한다. Hero 이동도 `introScale → targetScale` 단일 값으로만 보간하며 같은 노드에 독립 `scaleX`와 `scaleY`를 적용하지 않는다.
- `targetScale`은 target/writing rect의 폭·높이 비율 중 작은 값으로 구한다. X/Y 착지 중심 계산에도 같은 scale을 사용해 container 비율이 달라도 letterbox로 흡수하고 path 자체는 찌그러뜨리지 않는다.
- 390·768·1280px에서 정적 path bounds 비율, full/lite 필기·이동·착지 path bounds 비율은 동일해야 한다. 미세 sub-pixel 반올림을 제외한 X/Y scale 차이는 허용하지 않는다.

## 2026-08-23 — Mandatory natural-completion gate override

이 항목은 이전 Home Intro 명세의 `wheel / pointer / touch / keyboard / resize 입력이 즉시 complete` 규칙을 대체한다. 획순, bounce, veil, copy assembly, uniform-scale handoff와 full/lite timing은 유지한다.

- 정상 top-entry에서 Intro가 시작되면 head bootstrap capture gate가 module 초기화 전부터 wheel, pointerdown, touchstart/move, click과 페이지 이동·스크롤 키를 취소한다. Module 활성화 뒤에는 Intro를 제외한 body의 실제 콘텐츠를 원래 상태를 보존한 채 임시 `inert`로 만들고 body를 `aria-busy`로 표시한다.
- Escape, Tab, Enter, Space, Backspace, 방향키, PageUp/PageDown, Home/End는 Intro를 skip하지 않는다. Scroll position은 entry 좌표에 고정하며 overlay는 touch pan과 click-through를 허용하지 않는다.
- Anime.js `onComplete`가 유일한 정상 unlock 경로다. 자연 완료 시 animated 12-path SVG를 Hero에 commit하고, lock class·임시 inert/busy·capture listeners·inline opacity·overlay를 원자적으로 정리한 뒤 `portfolio:home-intro-complete`를 한 번 보낸다.
- `prefers-reduced-motion`, local reduced, hash, restored scroll, BFCache와 background entry는 gate/Intro를 만들지 않거나 module 초기화 즉시 해제한다. Hidden, pagehide, motion→reduced, geometry/font/Anime 실패와 module/head watchdog은 정적 Hero로 fail-open하며 영구 lock을 남기지 않는다.
- Resize와 full↔lite capability 변화는 user skip으로 취급하지 않는다. 진행 중 timeline을 끝까지 실행하고 최종 commit에서 현재 responsive Hero geometry를 사용한다. Browser Back, Reload, 주소창과 Ctrl/Meta/Alt modifier shortcut은 가로채지 않는다.
- Head fallback은 `4000ms`에 gate, module lock marker와 prepaint class를 모두 제거하고 늦게 도착한 module이 Intro를 다시 시작하지 못하게 한다. Full/lite module watchdog과 `finish()`의 finally cleanup은 별도의 이중 안전장치다.

## 2026-08-23 — Paper Current Hero motion override

이 항목은 `Hero scroll story`, robotic hand pose loop와 cube flourish를 대체한다.

- Renderer는 dependency 없는 WebGL2 full-screen triangle과 단일 fragment pass를 사용한다. CPU는 최대 6개의 느린 pigment body만 갱신하고 shader가 domain warp, 합쳐짐, quiet-zone mask, graphite/vermilion 혼합과 static paper grain을 처리한다. FBO, ping-pong fluid solver, Three.js와 CSS blur는 추가하지 않는다.
- Full motion은 최대 60fps, 내부 DPR `1.4 × 0.76` 이하에서 pointer velocity를 국소 curl과 displacement로 전달한다. Pointer press는 한 번의 감쇠 pressure wave를 만든다. 별도 cursor follower는 없다.
- Lite/coarse pointer는 최대 30fps, 내부 DPR `1.15 × 0.68`, 4개 body를 사용한다. Touch move는 입력으로 사용하지 않고 짧은 tap의 pointerup만 impulse로 받아 native `pan-y`를 가로채지 않는다.
- Reduced motion, WebGL2 미지원과 context loss는 animated canvas를 숨기고 동일 palette의 정적 CSS marbling을 사용한다.
- `homeIntro` Promise가 완료되기 전에는 rAF를 시작하지 않는다. 완료 후 실제 Hero copy rect를 다시 측정하고 서명 중심 wake impulse를 한 번 실행한다. Event-only 연결은 skip/hash/BFCache에서 완료 신호를 놓칠 수 있으므로 사용하지 않는다.
- `ResizeObserver`는 canvas buffer와 quiet zone만 재측정한다. `IntersectionObserver`, `visibilitychange`, `pagehide/pageshow`, `webglcontextlost/restored`가 연속 motion lifecycle을 소유한다. 매 frame DOM rect read, `readPixels`, pointer capture와 `preventDefault()`는 금지한다.
- Hero story는 약 `118svh`의 native scroll에 `0→1`을 단조 매핑한다. 카피는 scale 없이 최대 `-30px` 이동과 절제된 opacity 감소만 사용하고 유체 에너지는 가라앉는다. Reduced에서는 exit transform을 적용하지 않는다.

## 2026-08-23 — Pressure Ink stable-fluid override

이 항목은 바로 위 Paper Current Hero motion의 full desktop 단일-pass 및 FBO 금지 규칙을 대체한다. Lite와 static fallback 계약은 유지한다.

- motion=full과 depth=interactive에서는 dependency 없는 WebGL2 stable-fluid renderer를 사용한다. 순서는 batched splat → velocity advection → curl → vorticity confinement → divergence → pressure decay/Jacobi 14회 → gradient subtraction → dye advection → paper composite다.
- Simulation은 짧은 변 192px, dye는 512px을 16px bucket으로 할당한다. EXT_color_buffer_float와 실제 framebuffer completeness를 검사하고 RG16F/R16F를 먼저 시도한 뒤 RGBA16F로 재시도한다. 둘 다 실패하면 기존 procedural renderer로 원자적으로 내려간다.
- Float texture는 NEAREST를 사용하고 advection/display shader가 수동 bilinear sampling을 수행한다. read/write texture는 모든 state pass에서 분리하고 resize, tier 변경, context restore 시 target과 program을 다시 만든다.
- Pointer coalesced sample을 경로 반경의 약 0.35배 간격으로 재표본화해 frame당 최대 12 splat으로 제한한다. 반응 강도는 정규화 속도의 약 1.55승이며 press는 힘을 키우고 급반전은 counter-rotating pair를 더한다. 빠른 입력만 작은 vermilion dye를 주입한다.
- Click은 원형 ripple 대신 한쪽으로 흐르는 6-splat plume이다. Touch move는 계속 무시하고 동일 pointer id의 짧은 tap만 축약 impulse로 처리하며 preventDefault, pointer capture와 scroll trap은 사용하지 않는다.
- Copy와 action의 실측 union을 확장한 rounded-box obstacle을 splat, advection, divergence, pressure, gradient와 최종 composite에 공통 적용한다. 서명 SVG와 content layer는 solver가 소유하지 않는다.
- Full은 active 60fps, idle 30fps; lite는 30fps다. dt는 최대 1/30s로 제한하고 hidden/offscreen/pagehide에서 rAF를 멈춘다. 5초가 넘는 pause 뒤에는 stale field를 clear/reseed하고 짧은 pause는 상태를 보존한다.
- Intro Promise 전에는 WebGL setup과 rAF를 시작하지 않는다. 완료 뒤 quiet rect를 재측정해 obstacle 가장자리에서 비대칭 wake를 시작한다. Canvas reveal은 320ms이며 scroll 시각 fade는 wrapper opacity만 소유한다.
- Reduced는 WebGL context를 만들지 않는다. WebGL2/context/capability 실패는 canvas를 숨기고 CSS paper marbling을 표시하며, context restore에서는 capability 검증부터 다시 실행한다.

## 2026-08-23 — Route-owned motion runtime and lifecycle

- 각 entry는 `createPageRuntime()` 하나를 만들고, 환경·navigation·magnetic·name emphasis·page transition과 route controller를 등록한다. Controller는 `{ destroy() }` 계약을 사용하며 HMR에서는 등록의 역순으로 모두 정리한다. 하나의 cleanup 오류가 나머지 teardown을 막지 않는다.
- Home은 Intro를 가장 먼저 만들고 runtime에 등록한다. Smooth Scroll은 Intro Promise가 자연 완료하거나 fail-open한 뒤 시작하며, Fluid는 Hero Story보다 먼저 등록해 첫 progress event를 놓치지 않는다. Work는 Work Story를 generic reveal보다 먼저 초기화한다.
- Lenis JS/CSS는 `motion=full`과 `depth=interactive`일 때만 동적으로 요청한다. 동시에 발생한 reconcile은 하나의 loading Promise를 공유하고 generation token으로 stale completion을 버린다. import/constructor 실패는 dataset을 지우고 native scroll로 fail-open한다.
- Work Story만 `smoothScroll.onScroll()`을 통해 ScrollTrigger update를 구독한다. GSAP loader는 GSAP/ScrollTrigger 등록만 소유하며 Lenis를 역으로 import하거나 전역 singleton으로 결합하지 않는다.
- Continuous motion은 hidden/offscreen/pagehide에서 멈추고 pageshow/environment change에서 현재 capability를 다시 평가한다. Intro가 pagehide로 완료된 microtask에서는 Fluid가 WebGL을 새로 할당하지 않으며, 활성 pageshow에서만 graphics를 준비한다. 5초 초과 pause의 Stable clear/reseed, context-loss resource 규칙과 Stable → Lite → Static fallback은 유지한다.
- Intro Promise, async imports, observers, listeners, rAF, timers와 transient DOM은 각 controller의 cleanup 범위에 포함한다. BFCache는 문서를 파기하지 않으므로 pagehide stop과 explicit destroy를 구분한다.

## 2026-08-23 — Site Fluid and adaptive-resolution override

이 항목은 앞선 Pressure Ink의 Home-only, `192 / 512` 고정 target과 항상 실행되는 idle 30fps 규칙을 대체한다.

- `initSiteFluid()`은 route마다 하나만 생성되며 fixed viewport 좌표로 pointer/tap을 해석한다. Home의 `initHeroFluid()`는 Intro 이후 Hero progress와 copy obstacle만 공통 controller에 전달하는 얇은 adapter다.
- Stable target은 `high 256 / 768`, `balanced 224 / 640`, `baseline 192 / 512`의 simulation/dye short side를 사용한다. 긴 축은 최대 1536px이고 cap에 닿을 때 양 축을 함께 축소한 뒤 16px bucket으로 반올림해 viewport 비율을 보존한다.
- Full/interactive desktop은 viewport와 `deviceMemory`, `hardwareConcurrency`로 초기 tier를 고른다. 최근 60개 active render interval에서 평균 36ms 초과와 38ms 초과 frame 15개가 함께 누적되거나 70ms 초과 frame이 20개에 도달할 때만 `high → balanced → baseline`으로 한 단계 내린다. 30Hz display는 downgrade하지 않으며 같은 session에서는 자동 승급하지 않고 12초 cooldown으로 출렁임을 막는다.
- Target allocation은 현재 tier부터 baseline까지 순차 재시도한다. Half-float compact/RGBA target이 모두 실패하면 Lite, Lite program도 실패하면 Static으로 내려가며 이전 target과 program은 controller teardown에서 정리한다.
- Home은 active 60fps와 calm 30fps current를 계속 유지한다. 다른 route는 초기 seed·pointer·tap·scheduled ambient burst 뒤 field가 안정되면 rAF를 완전히 멈추고 route별 delay 후 짧게 wake한다. `data-fluid-state=active|idle|suspended|static`을 노출한다.
- Document scroll progress는 solver damping에 최대 35%만 전달해 긴 페이지 하단에서도 ink field가 사라지지 않게 하며, content 자체의 opacity나 transform은 Fluid가 소유하지 않는다.
- Hidden과 pagehide는 frame과 ambient timer를 모두 멈춘다. pageshow, pointer, 짧은 tap과 ambient wake는 첫 dt를 초기화한 뒤 재개한다. 5초가 넘는 document suspension만 clear/reseed하며 단순 idle은 field를 초기화하지 않는다.
- Scroll 중 quiet-zone geometry는 별도 rAF에서 프레임당 한 번만 측정한다. Sleeping route는 변경된 obstacle composite를 한 frame 즉시 그린 뒤 다시 idle로 돌아간다.
- Tablet/mobile은 higher backing scale의 Lite 30fps를 사용하되 touch move를 받지 않는다. Reduced는 WebGL context와 rAF를 만들지 않고 route palette의 정적 background만 표시한다.

## 2026-08-24 — Transparent Ink composite and continuous pointer override

- Stable과 Lite의 final display는 opaque paper color가 아니라 straight-alpha Ink를 출력한다. WebGL context는 alpha를 지원하고 paper gradient/grain은 별도 fixed base가 담당한다. Simulation/FBO는 하나만 유지하며 overlay를 위해 solver를 복제하지 않는다.
- Site Fluid Ink는 structural page surfaces 위, navigation·curtain·focus UI 아래에 합성한다. Canvas는 passive observation만 수행하며 hit testing을 소유하지 않는다.
- `uQuiet` 단일 rect는 `uQuietRects[6]`, `uQuietCount`와 core/halo attenuation으로 대체한다. Stable solver obstacle은 각 rect의 hard core를 사용하고 final composite는 soft halo를 사용한다. Lite도 같은 rect count와 attenuation 의미를 공유한다.
- Non-touch `pointermove`는 event target 종류와 관계없이 coalesced path를 수집한다. Pointer down과 short-tap impulse만 activation selector에서 차단하고, touch move·preventDefault·pointer capture는 계속 사용하지 않는다.
- Full Home은 Intro 완료 직후 seed가 quiet halo 바깥에서 명확히 보이고 계속 active다. Ambient route는 card/control 위 pointer path에도 wake한 뒤 안정되면 기존 delay와 lifecycle에 따라 idle로 돌아간다.
- `focusin`/`focusout`과 Project Deck의 transform update는 obstacle 재측정을 rAF당 한 번 요청한다. Focus control은 최우선 rect로 보호하고, deck의 이동 중·완료 geometry가 stale rect를 남기지 않게 한다.
- Reduced와 WebGL failure는 Canvas 없이 paper base와 정적 marbling을 표시한다. Hidden/pagehide/context-loss cleanup, adaptive quality와 Stable → Lite → Static fail-open 순서는 유지한다.

## 2026-08-24 — Quiet Gallery motion override

이 항목은 `Pressure Ink`, `Site Fluid`, transparent Ink composite와 전역 pointer-driven motion 규칙을 대체한다. Intro·page transition·section reveal·Home Hero story·Work Story의 서사적 timing은 유지한다.

- 모든 route에서 Fluid Canvas, WebGL renderer, pointer splat, ambient wake, quiet obstacle과 quality tier를 제거한다. Background는 CSS fixed paper wash/grain이며 pointer event, observer, rAF 또는 runtime controller를 갖지 않는다.
- 공통 runtime은 environment, navigation, page transition과 route controller를 소유하고 full desktop의 page-level Lenis smooth scroll을 계속 예약한다. Magnetic button, name emphasis, cursor follower, depth tilt와 별도 media `scroll-kinetics` controller를 등록하지 않는다.
- Home Intro는 정적 `.hero-surface`를 paper reveal 대상으로 사용한다. 동일 12-path SVG 작성, 자연 완료, fail-open, focus/inert cleanup과 Intro 완료 뒤 smooth-scroll 시작 순서는 유지한다.
- Home Hero Story는 CSS scroll progress와 Projects handoff만 갱신한다. Fluid event를 dispatch하지 않으며 name, copy와 CTA에는 pointer transform을 적용하지 않는다.
- Project Deck은 `pointerover` 또는 `focusin`에서 catalogue를 한 번 펼치고 active card를 바꾸며, `pointerleave` 또는 focus가 deck 밖으로 이동할 때 접는다. `pointermove` 좌표 추적과 Fluid geometry notification은 사용하지 않는다.
- Work Story의 pinned/scrubbed choreography, generic entrance/reveal, media playback과 page curtain은 유지한다. Work media와 case evidence에는 pointer tilt와 별도 `[data-inertia]` transform을 중첩하지 않는다.
- Reduced motion은 Intro 생략, reveal 즉시 완료와 기존 native/static layout을 유지한다. Touch/coarse pointer는 추가 포인터 제스처 없이 native vertical scroll과 링크·video controls를 그대로 사용한다.

## 2026-08-24 — Route-scoped GSAP curatorial choreography override

이 항목은 Quiet Gallery motion의 Home Hero와 Work Story timing을 대체하고 THING evidence choreography를 추가한다. Anime.js의 Intro, one-shot reveal, page transition과 Project Deck 소유권은 유지한다.

### Shared loading and lifecycle

- 초기 entry에는 0.26 kB gzip loader facade가 포함된다. `loadGsap()`이 호출될 때만 core와 ScrollTrigger를 정적 import literal의 dynamic import로 한 번 요청하고 plugin을 등록한다. 실패한 Promise는 cache를 비워 다음 정상 page lifecycle에서 재시도할 수 있어야 한다.
- 각 route controller는 capability 검사 뒤에만 loader를 호출한다. `setupVersion`, `pageActive`, `gsap.context()`와 route root scope로 stale import, pagehide, visibility, breakpoint 변경과 destroy를 정리한다. Background tab에서는 pending setup을 취소하고 새 runtime을 만들지 않는다. 이미 활성인 Home·Work·THING은 깊은 스크롤 위치가 clamp되지 않도록 expanded story geometry를 유지하고, visible 복귀 시 현재 capability를 다시 평가한다.
- Context는 setup 전에 확보한다. Stop 순서는 pending refresh 취소 → Lenis 구독 해제 → context revert → active class 제거 → controller가 소유한 `opacity / visibility / transform / clip-path / pointer-events`와 route CSS custom property 제거다. Hidden/pagehide에서는 global refresh를 실행하지 않는다. 활성 context를 보존한 Home·Work·THING은 visible/pageshow의 capability 재평가 뒤 한 번 refresh하고, pending setup만 있던 route는 이를 취소한 뒤 다음 visible lifecycle에서 새로 setup한다.
- ScrollTrigger는 CSS sticky layout을 진행 좌표로만 읽는다. `pin`, `snap`, ScrollSmoother와 touch input interception은 사용하지 않는다. Lenis가 즉시 생성되는 Work/case route는 `ScrollTrigger.update`를 route당 한 번 구독한다.

### Home Hero

- Home entry는 `homeIntro` Promise를 `ready`로 전달한다. Promise 해결 전에는 GSAP import, set 또는 timeline 생성이 없어야 하며 reduced/hash/BFCache로 Intro가 생략된 경로도 같은 Promise 계약으로 reconcile한다.
- 활성 조건은 `full + interactive + min-width 961px + min-height 620px`이다. Trigger는 `[data-hero-story]`, range는 `top top → 155svh track - 100svh sticky`, scrub은 `0.4`다. CSS sticky가 layout을 소유하고 GSAP pin은 추가하지 않는다. Static/lite/import-failure에서는 track이 100svh에 머물고, 활성 context가 있는 hidden/pagehide 동안에는 복귀 scroll position을 위해 155svh geometry를 보존한다.
- `--hero-progress 0→1`은 sticky bottom의 2px vermilion hairline을 채운다. 첫 화면의 mono wall label은 progress에 따라 조용히 사라진다.
- CTA는 `0.14–0.34`에 `opacity 1→0 / y -18`로 철수하고 완전히 투명해진 뒤 pointer hit만 끈다. Keyboard tab order는 유지하며 focus-within은 pointer와 시각 상태를 함께 복구한다. 두 문장은 `0.24`부터 `0.06` stagger로 `autoAlpha 0 / y -26`에 도달하고, 서명은 `0.42–0.82`에 `scale .92 / y -64 / autoAlpha .08`로 철수한다. Paper surface는 같은 색 위에서 무의미하게 fade하지 않는다.
- Intro가 넘긴 12-path SVG 자체를 분해하거나 다시 쓰지 않는다. Focus-within은 이름·문장·action을 즉시 완성 상태로 복구하며 reverse scroll은 모든 값을 원래 reading state로 되돌린다.

### Work chapters

- 활성 조건은 `full + interactive + min-width 961px + min-height 640px`이다. 각 `.work-row`는 `top 90% → bottom 10%`, scrub `0.8`로 실행하고 CSS row height는 `max(780px, 118svh)`다.
- Composition은 `y 36 / scale .97 → identity`, stage는 `opacity .08 / y 44 / scale .94 → identity`로 들어온다. Static image stage만 10%/7% clip을 사용하고 native video stage에는 clip을 적용하지 않는다.
- Title은 기존 mask 안에서 `opacity .25 / yPercent 120→1 / 0`, details는 `opacity .30 / y 18→1 / 0`, arrow는 `.30→.75`의 작은 대각 이동을 사용한다. 모두 첫 약 45% 안에 완성되고 중간 reading beat 동안 identity를 유지한다. Exit는 composition `y -36 / scale .97`, stage `opacity .18 / scale .96 / y -18`, arrow `.28`로 다음 chapter에 넘긴다.
- Rotation, brightness/saturation filter와 viewport 기반 좌우 이동은 금지한다. List 전체에는 sticky 2px rail 하나를 두고 `--work-progress 0→1`을 scrub하며 각 sticky scene 좌상단에 `01 / 06` wall label을 표시한다.
- 활성 Work를 hidden/pagehide에서 즉시 static layout으로 revert하지 않는다. `work-story-enabled`와 118svh geometry를 보존해 깊은 scroll position을 유지하고, visible/pageshow에서 breakpoint와 motion capability가 달라졌을 때만 정리하거나 refresh한다.

### THING evidence

- 공용 case entry 안에서 `.case-page--thing`이 있고 `full + interactive + min-width 1021px + min-height 640px`일 때만 활성화한다. 다른 다섯 case route는 loader를 호출하지 않는다.
- Demos는 enhanced desktop에서 2열 gallery 대신 네 개의 최소 `108svh`, `760px` floor chapter와 sticky artwork/caption 2열 구성을 사용한다. 각 item은 `top 86% → bottom 14%`, scrub `.6`이며 `01 / 04` wall label을 표시한다. Video 바깥 decorative frame은 progress `0→1→.18`로 열리고, caption은 `.15 / y 28→identity→.35 / y -12`로 handoff한다. `video`와 native controls를 직접 또는 ancestor transform/opacity로 변형하지 않는다.
- Prototype figure는 `top 84% → bottom 38%`에서 작은 opacity/y/scale stagger로, Architecture는 `top 78% → bottom 38%`에서 opacity/y stagger로 조립한다. Pipeline은 `top 72% → bottom 32%`, scrub `.5`에서 `--flow-progress`로 2px vertical rail을 채우고 네 행과 label을 순서대로 완성한다. 네 owned section은 `data-thing-story`로 표시하고 바깥 `data-reveal`을 두지 않아 Anime과 GSAP의 parent/child 이중 변형을 막는다. Generic reveal의 prepaint heading selector에서도 이 marker를 제외해 제목이 muted 상태에 남지 않게 한다.
- Tablet/mobile/lite/reduced와 short viewport에서는 core/ScrollTrigger를 요청하지 않고 owned section을 완전한 static content로 사용한다. 나머지 case section만 generic reveal을 유지한다. Runtime full→static→full 왕복마다 모든 descendant inline motion style과 active class가 제거·재생성되어야 한다. 활성 document가 hidden/pagehide 된 동안에는 네 개의 expanded chapter geometry를 보존하고 visible 복귀 시 capability 평가와 refresh를 수행해 deep scroll clamp를 막는다.

### Bundle boundary

- 2026-08-24 production 기준 초기 loader facade는 `0.26 kB gzip`이며 Home, Work와 여섯 case entry가 공유한다. Capability 통과 뒤에만 GSAP core `27.42 kB gzip`와 ScrollTrigger `17.54 kB gzip` dynamic chunk를 요청하고 browser cache를 공유한다. THING controller code는 공용 case entry에 포함되지만 다른 다섯 case에서는 DOM guard에서 즉시 종료한다.
- Flip은 source gzip 약 13.7 kB의 추가 plugin이며 Project Deck 전체 transform 소유권 이관 없이 혼용할 수 없으므로 포함하지 않는다. SplitText와 ScrollSmoother도 이번 narrative에 필요하지 않아 포함하지 않는다.

## 2026-08-25 — Work pinned horizontal exhibition rail override

이 항목은 `Shared loading and lifecycle`의 Work no-pin 예외, `Work chapters`의 118svh vertical sticky rows와 viewport X 이동 금지를 대체한다. Home Hero와 THING은 계속 CSS sticky/no-pin 계약을 사용한다.

- 활성 조건은 기존과 같은 `full + interactive + min-width 961px + min-height 640px`이다. `[data-work-viewport]`는 `calc(100svh - var(--nav-height))` 높이이며, `[data-work-track]`은 max-content horizontal flex가 된다. 비활성 조건에서는 이 class와 geometry가 없어야 한다.
- 하나의 master ScrollTrigger가 viewport를 `pin: true`, `pinSpacing: true`, `scrub: 0.7`로 고정한다. Start는 viewport top이 navigation bottom에 닿는 지점이고, end travel은 `track.scrollWidth - viewport.clientWidth`다. Track은 같은 거리만큼 `x` 음수 방향으로 `ease: none` 이동한다.
- Pin은 Work route의 이 단일 showcase에만 허용한다. `snap`, ScrollSmoother, SplitText, Flip, wheel/touch listener와 `preventDefault()`는 사용하지 않으며 세로 입력을 직접 가로채지 않는다. 기존 GSAP core/ScrollTrigger dynamic chunk를 재사용해 새 dependency 또는 plugin chunk를 추가하지 않는다.
- 각 project timeline은 master tween을 `containerAnimation`으로 읽어 `left 94% → right 6%`, scrub `0.5`로 실행한다. Static image stage는 `opacity .18 / y 30 / scale .94 / inset 9% 7%`에서 identity로 들어오고 native preview stage에는 clip을 적용하지 않는다. Title과 details는 짧은 opacity/y reveal 뒤 reading beat에서 identity를 유지한다. 첫 작품은 초기 identity, 마지막 작품은 exit fade가 없는 완성 상태다.
- Wall header의 `--work-progress`와 `01 / 06` readout은 장식용이며 aria-live를 사용하지 않는다. Active chapter는 각 card center와 viewport center의 실제 offset 거리로 계산해 가변 폭 카드에서도 맞아야 한다.
- 여섯 project link는 모두 tabbable 상태로 유지한다. Track `focusin`에서 offscreen card가 선택되면 그 card center를 master start/end에 매핑하고 smooth-scroll controller의 immediate `scrollTo`로 보이게 한 뒤 ScrollTrigger를 갱신한다. Lenis가 아직 없거나 실패한 경우는 native `window.scrollTo(... behavior: auto)`를 사용한다. `inert`, inactive `aria-hidden`, focus 강제 이동과 tab interception은 금지한다.
- Stop은 focus/Lenis 구독 해제 → `gsap.context().revert()`로 pin spacer 복원 → enhanced class, active class, progress와 owned inline motion property 제거 순서다. 활성 document가 hidden/pagehide 되면 pin spacer와 horizontal geometry를 보존하고, visible/pageshow에서 capability를 재평가한 뒤 refresh한다.

## 2026-08-25 — Work continuous contents choreography override

이 항목은 바로 위 rail의 card 폭, `scrub 0.7`, 작은 title mask reveal과 no-SplitText 결정을 Work에 한해 대체한다. Home과 THING의 loader·motion 계약은 바꾸지 않는다.

- Master viewport pin과 동적 `track.scrollWidth - viewport.clientWidth` travel은 유지한다. Borderless scene은 `104–122vw` 범위의 가변 폭으로 이어지고 master X tween은 `ease: none`, `scrub: 0.9`로 약 0.8–1.1초의 따라오는 감각을 만든다.
- 각 project는 master tween을 `containerAnimation`으로 읽는 `left 96% → right 4%`, `scrub 0.65` timeline을 가진다. Title char, real-media stage, metadata, proof/stack과 arrow가 서로 다른 X/Y/scale/opacity timing으로 교차하고, media는 main track과 반대 방향으로 일부 counter-translate되어 잠시 독립적으로 떠 있는 인상을 준다.
- Work capability gate를 통과한 뒤에만 `SplitText`를 별도 dynamic import한다. Semantic title 하나를 `words,chars`로 split하고 `aria: auto`로 원래 문장을 부모의 accessible name에 보존한다. 글자는 `rotateX / rotation / x / yPercent / opacity`로 조립되고 exit에서 약하게 흩어지며, split된 시각 glyph는 assistive technology에서 중복되지 않는다.
- 실제 `img`와 `video`는 target하지 않는다. `[data-work-artifact]` wrapper만 움직이고 native-video stage에는 clip-path를 적용하지 않는다. Metadata와 설명 같은 semantic copy는 `visibility`를 바꾸는 autoAlpha 대신 opacity만 사용한다.
- Focus-in은 기존 card-center → master scroll mapping을 유지한다. `:focus-within`은 모든 title char, artifact와 placard를 opacity 1 / transform none / clip inset 0으로 복구하며 project anchor 하나에만 2px outline을 표시한다.
- Stop은 context revert 뒤 모든 SplitText instance를 `revert()`하고 data hook의 owned inline style, aria split state, enhanced class와 progress를 제거한다. Hidden/pagehide의 활성 pin 보존, generation guard, fonts-ready refresh와 native scroll fail-open은 이전 계약을 유지한다.
- 2026-08-25 production build에서 Work에만 추가되는 SplitText chunk는 `7.06 kB raw / 3.26 kB gzip`이다. GSAP core `27.42 kB gzip`와 ScrollTrigger `17.54 kB gzip`은 기존 shared dynamic chunks를 재사용하며 Home·THING은 SplitText를 요청하지 않는다.

### Typography geometry compatibility

- Visible Latin은 Signika Variable, 한글은 Jua로 교체되지만 motion timing과 target ownership은 바꾸지 않는다. Home handwritten SVG와 투명 Manrope metric text는 동일 geometry를 유지한다.
- Work enhanced rail은 `document.fonts.ready`가 해결된 뒤 title을 SplitText로 분할하고 ScrollTrigger를 refresh한다. 따라서 fallback font 폭으로 계산한 pin travel이나 글자 위치가 production font load 뒤 남아서는 안 된다.
- Font load 실패, tablet/mobile, reduced와 capability gate 밖에서는 SplitText를 만들지 않고 semantic title과 static vertical layout을 그대로 사용한다.

## 2026-08-25 — Work optical title geometry override

이 항목은 Work continuous choreography의 scene별 title size와 일반 row 폭을 대체한다. Master pin, scroll travel 계산, SplitText timing과 cleanup 순서는 유지한다.

- 일반 enhanced title은 `clamp(4.75rem, 8vw, 7rem)`, featured THING은 `clamp(5.75rem, 10.5vw, 8.25rem)`이다. Brain MRI와 Prompt에 별도 작은 size를 적용하지 않으며 title mask는 balanced wrapping을 허용한다.
- 일반 row flex basis는 `clamp(1000px, 102vw, 1420px)`다. First, Brain/Prompt의 기존 가변 폭은 유지하되 active focus settlement에서 모든 semantic copy가 viewport safe inset 안에 있어야 한다.
- Title char의 `rotateX / rotation / x / yPercent / opacity` timing은 바꾸지 않는다. 새 geometry는 fonts-ready 뒤 SplitText와 ScrollTrigger refresh가 계산하며 focus-in은 동일하게 완성 상태를 복구한다.

## 2026-08-25 — Home cue-free handoff override

- Home enhanced story는 더 이상 `--hero-progress`를 만들거나 tween하지 않는다. Sticky bottom progress line과 frame의 exhibition label도 없다.
- Timeline은 `0.14`의 CTA 철수부터 시작하며 기존 CTA, 두 문장, 서명 timing과 155svh geometry를 그대로 사용한다. Reverse scroll과 focus-within 복구 동작도 유지한다.

## 2026-08-25 — Work fixed reading-beat choreography override

이 항목은 Work continuous contents의 `scrub 0.9 / 0.65`, counter-translate, 무작위 char scatter와 fonts-ready refresh-only 계약을 대체한다.

- Master X tween은 `ease: none`, `scrub: 0.62`이며 scene timeline은 `left 96% → right 4%`, `scrub: 0.35`다. Progress rail과 active chapter는 ScrollTrigger raw progress가 아니라 master tween의 실제 rendered `progress()`로 갱신한다. Focus mapping은 해당 progress를 즉시 적용한 뒤 native/Lenis scroll과 ScrollTrigger를 동기화한다.
- 각 scene은 0–1의 고정 clock을 가진다. Artifact `0–.22`, title `.08–.32`, context `.16–.34`, evidence `.22–.38`, CTA·arrow `.28–.38`, exact identity hold `.38–.70`, handoff `.70–.94` 순서다. 첫 scene은 entry를 생략하고 마지막 scene은 exit을 생략한다.
- Artifact는 `opacity .28 / scale .94 / x ≤72 / y 16–24 / inset 8% 6%`에서 identity로 들어오고 `opacity .42 / scale .965 / x ≤64 / y 14–20 / inset 6% 4%`로 나간다. Native-video stage에는 두 inset을 모두 적용하지 않는다.
- Title char는 `opacity .22 / yPercent 44 / rotateX -28 / x 10`에서 들어와 duration `.16`, stagger `amount .08` 안에 완성된다. Exit는 `opacity .38 / yPercent -18 / rotateX 14 / x -18`, duration `.16`, reverse stagger `amount .06`이다. Character index 기반 rotation·거리와 `stagger.each`는 사용하지 않는다.
- Placard는 역할별로 context, evidence, action을 분리하되 같은 작은 X/Y vector로 이동한다. Connector custom property는 scene 정착 중 `.12 → 1`로 그려지고 initial browse instruction은 rendered progress `.06`까지 opacity/Y로 퇴장한다.
- `loadGsapWithSplitText()`와 `document.fonts.ready`가 모두 해결된 뒤에만 enhanced class와 SplitText를 만든다. Stop은 label tween을 kill하고 context/split을 revert한 뒤 progress, connector, clip/opacity/transform과 GSAP의 `translate / rotate / scale / visibility` inline property를 제거한다.
- Enhanced `:focus-within`은 artifact, title char, placard, arrow와 chapter를 즉시 identity로 만들고 transition을 제거한다. Semantic project anchor, tab order, native video와 wheel/touch input은 motion target이나 interception 대상이 아니다.

## 2026-08-25 — Work hidden-entry crossfade override

이 항목은 Work fixed reading beat의 non-zero preview, `.35` scene scrub, `.38–.70` hold와 `.70` handoff를 대체한다. Master rail의 `scrub: 0.62`, pin, SplitText와 static fallback은 유지한다.

- Non-first scene은 trigger 전 stage `autoAlpha 0`, title char·summary·CTA `opacity 0`으로 prepaint한다. 다음 프로젝트가 보인 채 기다리는 상태를 허용하지 않는다.
- Scene range는 `left 102% → right 4%`이고 scene ScrollTrigger는 `scrub: true`로 master rail의 이미 완화된 rendered progress를 직접 따른다. 별도의 time-based scrub 지연을 중첩하지 않는다.
- Stage는 `0–.20`, title은 `.02–.26`, summary는 `.08–.24`, CTA는 `.14–.28`에 들어와 `.30–.52`에 identity로 머문다. 이전 scene은 `.52`부터 완전히 투명한 exit를 시작해 다음 scene의 entry와 같은 경계에서 교차한다.
- Exit 완료 상태는 stage `autoAlpha 0`, title·summary·CTA `opacity 0`이다. 실제 `img`·`video`는 target하지 않고 native video stage에는 clip-path를 적용하지 않는다.
- 번호, progress rail, browse instruction, connector, chapter label과 별도 arrow가 사라져 관련 tween과 custom property도 만들지 않는다. Active class는 focus mapping과 제한적인 `will-change` 소유권에만 사용한다.
- Focus settlement는 stage, title, summary와 CTA를 즉시 identity로 복구한다. 첫 scene entry 생략, 마지막 scene exit 생략, semantic link·tab order·native input과 reduced/static cleanup 계약은 유지한다.
- Enhanced track의 양쪽 padding은 동일한 safe inset을 사용하고 마지막 scene은 `100vw` basis로 끝난다. Master progress 1에서 마지막 title·summary·CTA와 stage가 모두 viewport 안에 있어야 한다.
- Focus mapping은 현재 active 여부와 관계없이 실행한다. Immediate scroll 뒤 numeric scrub tween을 목표 progress로 완료하고, native focus scroll이 발생한 다음 두 animation frame에도 같은 위치를 재적용한다. Tab을 막거나 focus를 옮기지는 않는다.

## 2026-08-31 — Non-blocking signature and evidence Hero override

이 항목은 mandatory Home Intro completion, Home의 961px/155svh 조건과 자동 preview의 lite 재생 계약을 대체한다. Work 961px/640px과 THING 1021px/640px story gate는 유지한다.

- Home top-entry는 별도 overlay를 만들지 않는다. 기존 Hero의 12-path SVG에 Anime.js drawable을 780ms desktop / 560ms compact 안에서 실행하고 `ready` Promise만 Home story에 전달한다. Reduced motion, hash entry, BFCache/static entry는 즉시 완성 상태다.
- Wheel, pointer, touchstart와 keyboard listener는 passive/capture 또는 비취소 listener이며 `preventDefault`, `stopPropagation`, focus 이동, `inert`, `aria-busy`를 사용하지 않는다. 첫 입력은 원래 navigation/scroll/activation을 그대로 수행하면서 animation finish만 호출한다.
- Home story capability는 `full + interactive + min-width 1001px + min-height 620px`이다. Track은 `138svh`, sticky는 `100svh`이고 GSAP pin은 사용하지 않는다. Role, name, value/support lines, CTA와 evidence card가 같은 reversible handoff에 참여하며 focus-within은 모든 action/role을 완성 상태로 복구한다.
- 1000px 이하, lite/reduced와 loader failure에서는 story class와 owned inline style을 제거하고 한 열의 static layout을 유지한다. Hidden/pagehide 시 아직 시작하지 않은 setup은 정리하되 이미 활성인 story context와 확장 geometry는 깊은 scroll 복원을 위해 보존하고 pageshow에서 refresh한다. Work가 capability resize로 SplitText story를 종료할 때는 cleanup/revert 뒤 현재 project link에 `preventScroll` focus를 복구한다.
- `data-auto-video`는 full motion에서만 viewport visibility에 따라 재생한다. Lite/coarse/reduced에서는 poster 상태를 유지한다. 모든 native controls video는 `data-demo-video`이며 하나를 재생하면 나머지를 멈추고, offscreen/hidden/pagehide에서는 pause한다. Pageshow는 auto preview만 재동기화하고 사용자가 시작한 demo는 자동 재생하지 않는다.
- Cross-document View Transition은 no-preference, desktop fine-pointer 조건에서만 짧은 root fade/scale로 활성화한다. Level 2를 지원하지 않는 브라우저는 기존 Anime page curtain으로 이동하고, Home/Work project link의 Speculation Rules는 `moderate` prefetch만 허용한다.

## 2026-08-31 — Work first-paint readiness와 Signal Lab motion override

이 항목은 Work가 모든 document font를 기다린 뒤 visible static list를 horizontal story로 바꾸던 계약을 대체한다. GSAP rail timing과 961px/640px gate 자체는 유지한다.

- Work head는 `full candidate + fine pointer + min-width 961px + min-height 640px + no-reduce`에서만 `work-story-pending`을 prepaint한다. Showcase는 보이지 않지만 document flow의 static fallback은 유지하며, 1500ms watchdog이 만료되면 즉시 static list를 공개하고 `data-work-story-expired`로 그 navigation의 late upgrade를 금지한다.
- Runtime은 전체 `document.fonts.ready`가 아니라 SplitText geometry에 필요한 `700 1em "Signika Variable"` face만 기다린다. GSAP/SplitText setup, class 적용과 ScrollTrigger refresh가 완료된 다음 animation frame에 pending을 제거한다. Above-fold Work H1에는 JS after-paint hide를 적용하지 않는다.
- Loader/font/setup 실패는 expired static fallback으로 settle한다. Capability가 setup 중 사라지거나 destroy되면 pending, scheduled refresh/reveal과 owned inline style을 정리한다. 성공한 story는 `data-work-story-ready`를 가져 viewport resize 뒤에만 기존 reconcile 동작을 허용한다.
- Signal Lab의 radio change는 trace path와 6px 이하 panel entrance만 움직인다. Fine pointer hover는 label을 최대 2px 올리고, touch에는 hover transform을 적용하지 않는다. `prefers-reduced-motion: reduce` 또는 runtime reduced에서는 path, node, label transition과 panel entrance를 모두 제거하되 현재 단계의 상태 차이는 즉시 표시한다.

## 2026-08-31 — Home greeting motion compatibility override

- Home Hero story는 보이는 역할 라벨이 없는 복원된 greeting 구성을 지원해야 한다. `[data-hero-role]`은 enhancement의 필수 조건이 아니다.
- `안녕하세요!`, 두 번째 greeting line, `프로젝트`와 `Contact`는 기존 reversible handoff에 참여하되 static·reduced·loader failure에서는 처음부터 완성 상태로 표시한다.
- 역할 라벨 제거 때문에 전체 Hero choreography가 비활성화되거나 `hero-pending` 상태가 남아서는 안 된다.

## 2026-08-31 — Home Kinetic runtime override

이 항목은 Home의 GSAP 138svh reversible handoff와 Signal Lab motion을 대체한다. Work rail과 THING case choreography의 GSAP 사용은 변경하지 않는다.

- Home entry는 작은 `initKineticSandbox` facade만 동기 로드한다. Signature `ready`, 첫 viewport intersection과 idle budget이 모두 준비된 뒤에만 PixiJS·Matter.js runtime을 dynamic import한다. Signature 중 발생한 첫 pointer intent는 좌표를 보존하고 mount 뒤 가장 가까운 오브제의 짧은 impulse로 재생한다.
- PixiJS 8은 운영 기본 WebGL renderer다. DPR은 fine/full 최대 `1.5`, lite/coarse 최대 `1`이고 기존 canvas에 첫 유효 frame을 렌더한 뒤에만 CSS 폴백을 교체한다. WebGL/context/import/setup 실패는 정적 오브제로 fail-open한다.
- Matter.js world는 중력 0의 2D 자유 공간, 60Hz fixed step과 최대 세 번의 catch-up을 사용한다. 별도 Runner·Render·GSAP·Anime timeline을 물리 loop와 혼용하지 않는다. Air friction과 sleeping으로 초기 이동이 스스로 끝나며 반복 ambient force는 없다.
- Fine pointer는 오브제를 직접 잡고 최근 약 90ms의 이동 속도로 던진다. Touch는 `touch-action: pan-y pinch-zoom`, passive pointer listener와 `pointercancel` 정리를 유지하며 pointer capture나 `preventDefault()`를 사용하지 않는다. 짧은 tap은 작은 impulse만 준다.
- Hero intersection 8% 미만, hidden, pagehide에서는 ticker를 즉시 멈추고 accumulator를 비운다. Visible/pageshow 복귀에서만 start하며 ResizeObserver는 renderer, viewport wall과 중앙 콘텐츠 collision body를 다시 계산한다. Sleeping 상태에서는 ticker가 자동 정지하고 다음 interaction이 다시 깨운다.
- Reduced motion과 forced colors에서는 runtime module, WebGL context와 ticker를 만들지 않는다. Canvas는 `aria-hidden`, `tabindex=-1`이고 모든 navigation·copy·CTA는 별도 DOM 레이어가 소유한다.

## 2026-08-31 — Home Kinetic 정밀도와 조명 override

이 항목은 위 Home Kinetic runtime의 fixed-step 렌더링, 중앙 콘텐츠 collision과 재질 조명을 구체화한다.

- World clock은 바깥쪽 `60Hz` fixed step과 그 안의 `2 × 8.33ms` substep을 사용한다. 한 frame의 catch-up은 3 step, frame delta는 50ms로 제한한다. Renderer는 마지막 두 simulation pose를 accumulator 비율로 보간하며 start, stop, resize와 lifecycle 복귀 때 pose history를 현재 body 값으로 다시 맞춘다.
- Drag target은 substep 시간 기준 exponential response로 따라간다. Release velocity는 최근 100ms 표본의 실제 시간 간격과 recency를 반영하고 이전 body velocity와 혼합한 뒤 전체 magnitude를 최대 `14.5`로 제한한다. 대각선 입력도 축별 cap으로 더 빠르게 만들지 않는다.
- 이름 collision은 `.handwritten-wordmark__letter`의 실제 보이는 group별 rect, 인사말은 비공백 word Range별 rect, 행동 영역은 각 `.button` rect를 사용한다. 측정은 mount, font ready와 resize에서만 다시 만들고 frame loop에서는 DOM layout을 읽지 않는다. 낮은 content restitution은 stone, signal, glass 등 각 오브제의 고유 restitution을 덮지 않는다.
- Glass ring은 12개의 chamfered compound segment로 구성해 중앙 구멍이 실제 hit-test와 충돌에서 열린다. Pointer hit-test도 parent bounds가 아니라 compound part vertices를 사용한다.
- 고정 점광원은 viewport 기준 `(-0.12w, -0.18h, 0.72 × diagonal)`에 둔다. Highlight, shade와 두 단계 그림자는 보간된 world pose에서 계산하며 광원 방향은 오브제 회전에 종속되지 않는다. 모든 그림자는 하나의 하단 shadow layer, 표면은 상단 object layer에 배치해 뒤에 생성된 그림자가 다른 오브제를 덮지 않는다.
- 광원은 render-only다. Matter force, restitution과 drag에는 영향을 주지 않는다. CSS static fallback도 같은 좌상단 광원과 material별 lower-right shadow를 사용하고, reduced motion에서는 정지 조명을 유지하되 forced colors에서는 제거한다.

## 2026-09-01 — Home handwritten signature timing override

이 항목은 `Non-blocking signature and evidence Hero override`의 `780ms desktop / 560ms compact` timing만 대체한다.

- Full과 compact 모두 12개 path의 전체 timeline을 `1500ms`로 사용한다. 기존 `45ms / 25ms` entry delay를 제외한 시간이 path 실제 길이 비율로 분배되므로 보이는 필기는 약 `1.46초`다.
- 획순, `inOut(2)` drawable easing, 이름의 짧은 opacity/Y settle과 동일 SVG geometry는 변경하지 않는다.
- 첫 wheel, pointerdown, touchstart와 keydown은 passive/capture listener에서 원래 입력을 통과시키면서 서명만 즉시 완료한다. Reduced motion, hash, hidden, nonzero scroll과 BFCache 진입은 계속 정적 완성 상태다.
- Kinetic sandbox의 `ready` gate는 자연 완료 약 1.5초 또는 조기 입력 완료 중 먼저 발생한 시점에 해제한다. Watchdog은 timeline 뒤 `700ms` fail-open 여유를 유지한다.

## 2026-09-03 — Resume Awards 증빙 모달 motion

- Native dialog와 dimmed backdrop은 각각 `220ms`, `180ms`의 짧은 opacity/최대 8px entrance만 사용한다. 증서 자체에는 pan, zoom, parallax나 반복 animation을 적용하지 않는다.
- `prefers-reduced-motion: reduce` 또는 `html[data-motion="reduced"]`에서는 dialog, panel과 backdrop을 즉시 최종 상태로 표시하고 모든 modal animation을 `none`으로 만든다.
- Modal open/close는 motion 완료에 의존하지 않는다. 열리자마자 닫기 버튼이 focus를 받고, Escape·백드롭·pagehide 정리는 animation 여부와 무관하게 동작한다.

## 2026-09-04 — Home 서명 중단의 완성 상태 복구

- 자연 완료와 모든 조기 종료는 timeline을 먼저 cancel한 뒤 12개 path의 Anime drawable 속성 `draw`, `pathLength`, `stroke-dasharray`, `stroke-dashoffset`과 소유 inline style을 제거한다. 원래의 solid stroke와 round linecap으로 복구하여 아직 시작하지 않은 획과 `i`의 점도 전부 표시한다.
- 기존 wheel·pointerdown·touchstart·keydown에 실제 `scroll`과 `hashchange`를 추가한다. 모든 입력은 소비하지 않으며, 완료 알림과 ready Promise는 한 번만 처리한다. Pagehide의 smooth-scroll 초기화 지연 계약은 유지한다.
- Hidden, BFCache 복귀, reduced 전환, watchdog, destroy, 정적 진입과 일부 drawable/timeline setup 실패도 동일한 복구 경로를 사용한다. 늦은 callback이 미완성 상태를 다시 적용해서는 안 된다.
- 기존 총 1500ms, 길이 비례 획순·easing, SVG geometry, Kinetic ready gate와 레이아웃은 변경하지 않는다.
