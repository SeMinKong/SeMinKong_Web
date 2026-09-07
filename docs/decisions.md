# Current decisions

현재 유효한 결정과 새 변경만 기록한다. 2026-09-07까지의 전체 승인·변경 기록은 [결정 이력](history/decisions.md)에 보관한다.

## 구현과 배포 기준

- Vite 다중 페이지와 npm을 유지한다. 11개 route는 `config/site-routes.js`가 관리한다.
- 페이지별 entry와 CSS를 유지하고 공통 lifecycle은 `create-page-runtime.js`에 등록한다. 새 프레임워크나 모션 라이브러리 전면 이관은 하지 않는다.
- Anime.js를 기본으로 사용하고 Work/THING의 scrubbed story만 GSAP으로 구현한다. Three.js 대신 현재 Pixi/Matter와 얕은 SVG/그림자를 유지한다.
- 현재 디자인과 기능은 [디자인 명세](design-brief.md), [모션 명세](motion-spec.md)를 따른다.
- 2026-09-04 상시 사용자 지침: 승인된 웹·정적 PDF 변경은 검증 후 기존 GitHub Pages에 배포한다. 필요한 범위의 commit/push를 포함한다. 로컬 전용·배포 보류 등 이후 명시 지시가 우선한다.
- 공개 대상은 검수한 변경뿐이다. 별도 작업 중인 수정, 비공개 원본, 임시 생성물, scratch는 포함하지 않는다. 배포 파이프라인 성공과 실제 페이지 확인 전에는 완료로 보고하지 않는다.
- PDF 변경은 원본 재생성·렌더 검수·public 사본 및 용량/날짜/해시 동기화를 함께 수행한다. 웹 빌드만 할 때는 이미 검수한 public PDF를 그대로 사용한다.
- PDF용 사진 원본은 `.private/`에 둔다. 공개 Resume와 포트폴리오에 대한 기존 승인 범위는 유지한다.

## 2026-09-07 — 핵심 구현 중심 저장소 정리

사용자가 불필요한 파일을 제거하고 핵심 구현을 읽기 쉽게 리팩토링하도록 요청했다. 시각 결과·입력·접근성·라우팅·공개 다운로드를 보존한다.

- 사용 경로가 없는 Hero scroll module과 중복 clamp utility, 폐기된 overlay wordmark builder를 삭제한다.
- Home의 서명/Hero/로봇 스타일은 `kinetic-home.css`, Projects 이하와 Home 전용 navigation은 `home.css`가 소유한다. 주석 처리된 Signal Lab 시안과 실제로 덮어쓰이는 옛 규칙을 제거한다.
- 로봇 설정, artwork/hint, 완성 pose/effect를 명시적인 모듈로 나눈다. Gesture와 joint physics는 공유 상태가 밀접하므로 runtime 안에 유지한다. 기존 facade와 lazy import 경로는 유지한다.
- 변수명·선언 위치를 반복 검사하던 source 검증 대신 entry→module import graph의 도달 가능성과 route/CSS 경계를 검사한다. 수학·관절 정렬·lifecycle 동작 테스트와 public artifact 검증은 유지한다.
- 현재 연결된 Sites 프로젝트는 조회 결과 NOT_FOUND였고 기존 배포는 GitHub Pages만 사용한다. 미사용 `.openai/hosting.json`과 public Worker adapter를 제거한다. 사이트나 공유 설정을 새로 만들거나 변경하지 않는다.
- 모든 선언된 npm dependency는 실제로 사용되어 유지한다. 실제 이미지·영상·문서·PDF 제작 소스도 보존한다.
- 오래된 승인/검수 기록은 `docs/history/`에 보관하고 현재 명세는 짧고 일관되게 다시 정리한다. `tmp/`는 Git에서 제외한다.
