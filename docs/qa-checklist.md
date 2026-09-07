# QA checklist

이 체크리스트는 현재 사이트와 이후 변경 검증에 사용한다. 이전 전체 검수·배포 결과는 [QA 이력](history/qa-checklist.md)에 보관한다.

## 자동 검증

- `npm.cmd run verify`: 동작 테스트 → 소스 route/import graph/CSS 경계 → production build → 배포 산출물과 링크 검사.
- `git diff --check`: 공백 오류 확인.
- Runtime 수학, snap/anchor, 정적 완성형, SVG bearing, lifecycle 모드 변경 테스트를 유지한다.
- Public Resume/PDF의 승인된 파일·크기·해시 계약과 내부 링크, metadata를 확인한다.

## 실제 브라우저

- 390px, 768px, 1280px에서 Home·변경 route를 확인한다.
- 수평 overflow, 이름·설명·CTA 가독성, console warning/error를 확인한다.
- Skip link, Tab 순서, focus outline, 링크/모달/native media controls를 확인한다.
- 기본 full/lite, resize 전환, localhost reduced override와 정적 fallback을 확인한다.
- Robot drag/rotation/snap/분리·pose hold·완성 잠금, offscreen/hidden 정지를 변경 범위에 맞게 확인한다.
- Touch의 native pan과 reduced/forced-color 계약을 보존한다. 실제 하드웨어/OS 설정을 확인하지 못했다면 검증 범위를 분명히 기록한다.
- Work/THING 수정 시 긴 스크롤과 키보드 탐색, mobile/reduced 정적 목록·증거 구간을 확인한다.

## 배포

- 요청 범위의 검증된 파일만 commit/push한다.
- 기존 GitHub Actions Pages 실행이 성공할 때까지 기다린다.
- 공개 페이지의 새 asset, 오류, 관련 다운로드를 확인한다.
- PDF 수정이 없으면 공개 PDF를 재생성하거나 교체하지 않는다.

## 2026-09-07 저장소 리팩토링

- [x] `npm.cmd run verify`: 테스트 49개, route 11개·도달 가능한 JS module 28개·stylesheet 12개, production build와 배포 entry 22개 검증 통과. `git diff --check` 통과. Import parser는 주석·문자열·template·정규식의 가짜 import, 순환 참조, lazy import, CSS 순서와 누락 파일을 검증한다.
- [x] Home CSS는 합계 2717→1549줄로 줄였으며 실제 Chromium 390×844·768×1024·1280×900에서 이전 공개 페이지와 192개 main 요소의 display·크기·폰트·margin·padding·grid 열이 모두 일치한다. 세 크기 모두 수평 overflow 0, 기본 lite/static 및 full/interactive, 11부품과 서명·CTA 가독성을 확인했다. Desktop/mobile Contact 하단도 정상이다.
- [x] 390px localhost reduced override에서 depth flat, canvas none, 정적 완성형 11부품, 서명 12획을 확인했다. Skip link는 Tab으로 focus outline이 표시되고 Enter로 main-content에 진입한다. 검수 페이지의 warning/error는 0이다. Touch-action은 pan-y pinch-zoom을 유지한다.
- [x] 배포 제외 개발 fixture에서 10관절 완성, 완료 중 입력 잠금, 오른팔 올리기를 검증했다. 연출 전체 최대 anchor 오차는 2.28e-13px 미만이다. 실제 말단 drag 후 포즈와 연결 유지, sleeping 상태의 관절 hint 1개, 접근 hint 2개, cancel 시 intent none을 확인했다. 수치 테스트는 연결 순서·방향을 바꾼 조립, 반응형 질량 유지와 회전된 초기 배치 경계도 검증한다.
- [ ] 배포 성공과 공개 페이지 확인

이전 로봇 디자인 검수는 이력 첫 항목에 기록되어 있다. 이번 작업은 동일 동작의 구조 정리이며 실물 터치 기기와 OS forced-colors 전환은 별도 검증 대상이다.
