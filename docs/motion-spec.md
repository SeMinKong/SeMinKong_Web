# Motion specification

Status: Draft

## Motion hierarchy

### Ambient

- 배경 신호, 궤도, 티커처럼 오래 지속되는 낮은 강도의 움직임
- 시선을 빼앗지 않도록 느리고 작은 범위를 유지한다.
- 화면 밖이나 탭이 숨겨지면 정지한다.

### Transitional

- 제목과 섹션 진입 리빌
- 큰 이동보다 짧은 거리와 opacity 변화를 사용한다.
- 한 화면에서 너무 많은 요소가 동시에 시작하지 않도록 stagger한다.

### Interactive

- 카드 기울기, 마그네틱 CTA, 커서 반응
- 포인터 위치를 목표값으로 저장하고 하나의 requestAnimationFrame 루프로 감쇠한다.
- pointermove마다 새 Anime.js 인스턴스를 만들지 않는다.

### Feedback

- Motion, Depth, Field 버튼 상태
- 버튼의 라벨, `aria-pressed`, 실제 애니메이션 상태가 항상 일치해야 한다.

## Timing ranges

- Micro feedback: 180–360ms
- Hover and magnetic return: 420–800ms
- Section reveal: 650–950ms
- Ambient loops: 6–30s
- Stagger: 40–120ms

숫자는 출발점이며 브라우저에서 체감으로 조정한다.

## Reduced motion

- `prefers-reduced-motion: reduce`는 최초 Motion 상태를 off로 만든다.
- 사용자가 명시적으로 Motion을 켜면 허용된 효과를 다시 시작할 수 있다.
- Motion off에서는 반복 루프, 커서 추적, 파티클, 카드 기울기, 스크롤 시차를 멈추고 중립 상태로 되돌린다.
- 콘텐츠와 기능은 모션이 없어도 모두 표시되어야 한다.

## Touch

- 세로 페이지 스크롤을 방해하지 않는다.
- 카드 탐색은 네이티브 가로 스크롤을 유지한다.
- 정밀 포인터 전용 hover 효과는 터치에서 비활성화한다.

## Performance budget

- 하나의 시각 요소를 여러 시스템이 동시에 transform하지 않도록 소유권을 분리한다.
- 동일 이벤트에서 다수의 애니메이션 인스턴스를 반복 생성하지 않는다.
- 연속 루프는 중앙 레지스트리에서 pause/resume한다.
- 새 대형 3D 런타임은 별도 승인 없이 추가하지 않는다.

## Verification

- Motion on/off 상태를 각각 확인한다.
- OS reduced-motion과 사용자의 수동 override를 확인한다.
- 빠른 포인터 이동 후 카드가 떨리거나 튀지 않는지 확인한다.
- 탭 visibility 변경 후 사용자가 꺼둔 상태가 유지되는지 확인한다.
