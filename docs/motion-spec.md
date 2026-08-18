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
- 한 시연이 재생되면 다른 THING 시연을 즉시 pause한다. 문서가 hidden 상태가 되거나 `pagehide`가 발생하면 모든 수동 시연을 pause한다.
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
