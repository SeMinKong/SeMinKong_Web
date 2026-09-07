# Design brief

현재 구현 기준: 2026-09-07. 이 문서는 현재 승인된 디자인만 설명한다. 이전 시안과 변경 과정은 [디자인 이력](history/design-brief.md)에 보관한다.

## 목적과 콘텐츠

공세민의 AI, Robotics, Computer Vision, Software 프로젝트를 실제 구현 근거와 함께 소개한다. 개인 역할, 팀의 성과, 검증 한계를 구분하고 확인되지 않은 수치·성과를 추가하지 않는다. 한국어 설명과 영어 프로젝트·기술명을 함께 사용한다.

- 공개 이름: Se Min Kong. 현재 거주지: Suwon.
- Home: Hero → Projects → Focus → About → Contact.
- Work: THING, AQIS, Brain Tumor MRI, Alkkagi, Briefit, Project Prompt Generator의 여섯 프로젝트. 실제 미디어·프로젝트명·한 문장 설명·상세 링크만 둔다.
- 각 Case study: 역할, 구현, 결과, 근거 링크를 읽을 수 있는 독립 문서.
- About: 소개, 현재 관심, 경험, 기술 도구.
- Resume: 원본 문서 미리보기·다운로드, 수상 증빙 모달, 포트폴리오 PDF 다운로드.
- Copyright: 사용한 자료와 라이선스 범위를 설명한다.

경로와 entry의 기준은 `config/site-routes.js`다. 프로젝트 사실과 자료 출처는 [포트폴리오 근거](portfolio-evidence.md), [시각자료 출처](portfolio-visual-sources.md)를 따른다.

## 시각 언어

따뜻한 종이색, 짙은 graphite, 제한적인 vermilion을 사용한다. 배경의 wash와 grain은 정적이며, 실제 프로젝트 이미지와 영상의 원래 비율을 보존한다. 과장된 HUD, 기술 점수, 장식용 상태 표시를 추가하지 않는다.

제목과 표시용 텍스트의 Latin·숫자는 Signika Variable, 한글은 Jua를 사용한다. 긴 본문은 `--font-body`의 시스템 sans-serif를 사용하며 세부 UI 적용은 토큰과 CSS를 따른다. Jua의 가짜 굵기는 만들지 않는다. Manrope는 Hero 서명의 투명한 크기 측정 텍스트에만 필요하다. 폰트는 npm 패키지의 파일을 자체 호스팅한다.

디자인 토큰은 `src/styles/tokens.css`, 공통 UI는 `base.css`, 전역 종이 표면은 `gallery-surface.css`가 소유한다. 실제 수치와 반응형 규칙은 해당 CSS가 기준이다.

## Home Hero

- 이름은 기존 12개 SVG 획의 서명을 사용한다.
- 인사말은 “안녕하세요!”와 “새로운 것을 배우고 직접 만드는 일이 즐겁습니다.”다.
- 주요 행동은 Work로 이어지는 “프로젝트”와 Home Contact로 이어지는 “Contact”다.
- 첫 화면은 100svh를 기본으로 하며 작은 화면에는 읽기에 필요한 최소 높이를 유지한다.
- 텍스트와 링크는 semantic HTML로 즉시 제공한다. 캔버스가 준비되지 않거나 모션이 줄어도 접근 가능해야 한다.
- 별도 인트로 overlay, 화면 잠금, 스크롤 안내, Motion/Depth 수동 스위치를 만들지 않는다.

## 연구용 로봇 키트

7종 SVG를 11개 조각에 재사용한다. 단일 센서 머리, 넓은 분할 흉곽, 골반, 내부가 열린 상완, 집게가 있는 전완, 넓은 대퇴, 발판이 있는 하퇴로 기능과 외곽선을 구분한다.

색은 shell `#DED6CA`, graphite `#24211D`, metal `#B8AFA2`, sparse vermilion `#A73524`다. 2~3단계 얕은 bevel, 얇은 이음선, 부품 내부의 bearing을 사용한다. 얼굴·두 눈·문자·HUD·neon·무작위 vent/볼트는 넣지 않는다.

`robot-kit.js`의 SVG 치수와 bearing 중심이 물리 관절과 정적 완성형의 기준이다. 그림자도 같은 SVG의 alpha 형태를 사용해 열린 프레임과 집게 틈을 보존한다.

- 데스크톱 약 2배, 태블릿 약 1.75배, 모바일 약 1.55배로 표시한다.
- 모바일·태블릿의 초기 배치는 이름·설명·CTA 주변을 비운다.
- 부품은 사용자가 움직일 수 있고 텍스트 위를 지나갈 수 있다. 읽기·클릭·키보드 접근은 DOM이 소유한다.
- 가까운 호환 연결부와 회전할 관절에만 얇은 ring을 표시한다.
- Reduced/forced-colors는 완성된 정적 로봇을 제공한다. 작은 화면에서는 이름 위 우측 여백에 둔다.

세부 동작은 [모션 명세](motion-spec.md)에 정의한다.

## 개인정보와 원본 자료

웹의 일반 markup에는 전화번호·생년월일·증명사진을 추가하지 않는다. 이미 승인된 원본 Resume 파일과 포트폴리오 PDF는 예외이며 기존 다운로드를 유지한다. PDF 전용 증명사진 원본은 `.private/`에 두고 별도 웹 자산으로 공개하지 않는다.

원본 사진·영상·상장과 실제 작업 자산을 임의로 삭제하거나 다시 그리지 않는다. 정적 PDF 변경은 재생성·렌더 검수·공개 사본과 용량/날짜/해시 동기화가 필요하다.
