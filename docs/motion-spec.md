# Motion specification

현재 구현 기준: 2026-09-07. 과거에 폐기·대체된 연출은 [모션 이력](history/motion-spec.md)에 보관한다.

## 공통 원칙과 소유권

모션은 자동으로 환경에 맞춘다. `environment.js`가 fine pointer·viewport·OS reduced motion으로 full/interactive, lite/static, reduced/flat을 결정한다. localhost의 `?motion=full|lite|reduced`는 검수용이며 공개 사이트에서 사용자 설정을 덮어쓰지 않는다.

- Anime.js: 서명, 공통 entrance/reveal, page curtain, Home project deck, 관절 hint.
- PixiJS + Matter.js: Home 로봇 렌더와 물리.
- GSAP/ScrollTrigger: Work 수평 전시와 THING 증거 구간. SplitText는 Work만 사용한다.
- Lenis: full desktop의 page scroll. Touch는 native vertical pan과 pinch를 유지한다.
- 같은 요소의 transform/opacity를 두 모션 시스템이 동시에 소유하지 않는다.
- Hidden/offscreen에서는 연속 모션과 미디어를 멈춘다. 기능 실패 시 읽을 수 있는 정적 콘텐츠로 돌아간다.
- 수동 Motion/Depth 버튼, 커서 follower, magnetic effect, 전역 fluid, Three.js는 사용하지 않는다.

About·Resume 학습 스택은 고정된 위치에서 읽을 수 있도록 대상 reveal을 적용하지 않는다. 최초 `#now-title`·`#skills-title` 진입만 상단 intro를 생략하고, load 이후 폰트 준비와 다음 프레임을 기다려 `scroll-padding-top` 기준으로 한 번 위치를 맞춘다. 기존 `smoothScrollAfter`로 이 정렬 뒤 Lenis를 시작한다. 사용자 조작·다른 해시·페이지 이탈 시 취소하고, 뒤로/앞으로 복원에는 적용하지 않는다.

## Home 서명과 project deck

현재 Hero의 12개 SVG 획을 약 1.5초에 걸쳐 그린다. 별도 overlay나 입력 잠금을 만들지 않는다. 사용자 wheel·pointer·touch·keyboard·scroll, 페이지 이탈, 감소 모션 전환은 입력을 소비하지 않고 서명을 완성한다.

취소 시 Anime drawable의 draw/pathLength/dash 속성과 inline style을 제거한다. Reduced, hash 진입, BFCache, 이미 스크롤된 페이지는 즉시 완성 상태다. Ready Promise가 로봇과 smooth scroll의 시작을 연결한다.

Home project deck은 hover/focus에서 단발성으로 펼쳐진다. 포인터 좌표를 계속 추적하지 않는다. 포커스가 있는 내용은 항상 읽을 수 있어야 한다.

## 로봇 lifecycle

서명 ready, viewport intersection, page visibility를 확인한 뒤 idle 시점에 Home 전용 runtime을 지연 로드한다. 캔버스는 Hero 내부 absolute 위치이며 decorative/aria-hidden이고 tabindex가 없다. 첫 pointer 의도는 mount 이후 짧은 impulse로 전달한다.

Full/lite 전환에서는 로딩 중이거나 이미 생성된 controller를 유지한다. Resolution과 pointer 기준만 갱신하고 antialias는 최초 WebGL context 설정을 유지한다. Reduced/forced-colors에서는 runtime을 만들지 않고 정적 fallback을 사용한다.

캔버스의 touch-action은 `pan-y pinch-zoom`이다. Native passive pointer listener를 사용하고 pointer capture나 gesture preventDefault를 추가하지 않는다. Pixi의 사용하지 않는 document-level hit-testing은 분리한다.

그림자는 viewport 기준 좌상단의 고정 광원을 따른다. 부품이 회전해도 광원 방향은 함께 회전하지 않으며 그림자와 재질 표현은 물리에 영향을 주지 않는다.

## 조립과 포즈

11개 body와 10개 관절을 유지한다. SVG bearing과 물리 port가 같은 좌표를 사용한다. 서로 다른 component의 미사용 plug/socket은 family·거리·마주 보는 각도가 맞을 때만 결합한다.

- 고정 60Hz 물리 step마다 2개 substep을 사용하고 화면은 pose를 보간한다.
- 크기 변화 시 body, component 내부 거리, port, constraint anchor, renderer scale을 같은 비율로 보정한다. 질량은 scale²에 반비례하는 density로 유지한다.
- Component 내부 충돌만 해제하며 독립 부품·벽의 충돌은 유지한다.
- Body grip은 연결 묶음을 이동한다. 말단 grip은 해당 부품의 parent 관절을 pivot으로 child branch를 회전시킨다.
- 다른 관절은 drag 시작 시의 각도를 유지한다. Release는 선택 관절을 15도 detent 또는 neck/waist endpoint로 저장한다.
- 결합 시 baseAngle은 hard limit 중심이며 poseAngle은 저장한 자세다. Hard limit를 넘어가면 child branch 전체를 보정하고 anchor를 다시 정렬한다.
- 짧은 click/tap은 component를 30도 회전시킨다. 연결부를 바깥으로 당기면 분리하며 같은 gesture의 즉시 재결합을 막는다.
- Touch의 8px 이내 움직임은 pending이고 세로 우세 입력은 native scroll에 맡긴다. Cancel/scroll은 새 포즈를 저장하지 않는다.
- 조작 전 resize는 화면별 초기 배치를 적용한다. 조작 후에는 사용자의 pose와 연결을 유지하고 component 단위로 viewport 안에 맞춘다.

정확한 튜닝 값과 초기 배치는 `robot-config.js`, 계산은 `kinetic-math.js`가 기준이다.

## 연결 hint와 완성 연출

가장 가까운 호환 pair만 접근 hint를 표시한다. Fine/coarse hint 반경은 52/58 × interactionScale, 실제 snap은 30/34 × interactionScale이다. 허용 각도·family·polarity·occupied/component 제외 조건은 실제 snap과 공유한다.

말단 hover는 분리 grip을 먼저 제외한 뒤 실제 parent 관절 ring과 crosshair를 표시한다. Body grip은 grab이다. Hint opacity만 Anime.js로 140ms 보간하며 sleeping 물리는 깨우지 않는다. Release, cancel, leave, stop, resize, 완성 시작과 destroy에서 hint를 지운다.

마지막 snap 이후 pointer release/cancel에서 graph를 확인하고 1.78초 완성 연출을 한 번 실행한다. 로봇을 정렬하고 고개와 오른팔을 들며 작은 ring/particle을 표시한다. 문구·소리·반복 pulse는 없다.

연출 중 pointerdown·hover·nudge만 무시하며 scroll·navigation·CTA·keyboard는 유지한다. 각 frame의 chest-rooted tree를 정렬해 모든 anchor가 붙어 있도록 한다. 종료 시 raised pose를 저장하고 body를 sleep시킨다.

## Work와 THING

Work는 full/interactive, 961px 이상 폭, 640px 이상 높이에서 단일 pinned 수평 rail을 사용한다. 여섯 프로젝트의 단일 semantic link와 DOM 순서를 유지한다. 실제 미디어 요소가 아닌 wrapper와 제목/설명/CTA만 움직인다. Keyboard focus가 이동한 프로젝트는 화면에 즉시 맞추며 Tab을 가로채지 않는다.

Work는 필요한 Signika face와 GSAP이 준비된 후 강화한다. 초기 준비가 1500ms 안에 끝나지 않으면 정적 세로 목록을 보여주고 해당 진입의 늦은 전환을 막는다. Reduced·touch·좁거나 낮은 viewport·실패도 같은 정적 목록이다.

THING은 full/interactive, 1021px 이상 폭, 640px 이상 높이에서 Demos, Prototype, Pipeline, Architecture만 강화한다. Video와 native controls 자체의 transform/opacity를 바꾸지 않는다. 해당 outer section은 generic reveal과 중복 등록하지 않는다.

Hidden/pagehide에서는 기존 story geometry를 보존해 깊은 스크롤 복귀를 막지 않는다. Capability 해제와 destroy는 GSAP context, SplitText와 해당 inline style을 정리한다.

## 미디어와 접근성

자동 preview는 full motion과 viewport visibility를 모두 만족할 때만 재생한다. 수동 demo 하나를 재생하면 나머지를 멈춘다. Offscreen/hidden/pagehide에서 pause하며 복귀 시 수동 demo를 자동 재생하지 않는다.

상장 모달은 명시적인 click/keyboard로 연다. ESC·backdrop·닫기를 지원하고 닫으면 원래 trigger로 포커스를 돌린다. 필수 콘텐츠, native media controls, skip link와 navigation은 모션 상태에 의존하지 않는다.
