# Lannino design reference → SeMinKong adaptation brief

> 작성일: 2026-08-20
>
> 상태: 참고 분석 / 1단계 구현과 함께 승인 대기
>
> 기준 화면: [Lorenzo Lannino Portfolio](https://lannino.com/)

## 0. 사용 범위와 라이선스 경계

이 문서의 `융합`은 lannino.com을 복제한다는 뜻이 아니다. 공개 화면에서 관찰 가능한 상호작용 원칙과 정보 위계를 분석한 뒤, SeMinKong 포트폴리오의 콘텐츠·팔레트·모션 아키텍처에 맞게 다시 설계한다는 뜻이다.

Sunny Patel 참조 때와 달리 이 사이트는 공개 소스 저장소가 확인되지 않았다. 따라서 경계를 더 엄격하게 잡는다.

1. Lorenzo의 문구, 사진, 프로젝트 설명, 개인 브랜딩을 사용하지 않는다.
2. 크림 배경(#FFF2E0 계열)의 정확한 값과 화면 배열을 복제하지 않는다. SeMinKong의 bone paper(#f1eee6)와 charcoal(#11100e)을 유지한다.
3. GSAP 스택을 도입하지 않는다. `AGENTS.md`의 결정대로 Anime.js를 유일한 모션 라이브러리로 유지하고, 관찰된 패턴은 Anime.js + 자체 spring 유틸로 재구현한다.
4. 관찰 가능한 "범용 기법"(줄 단위 리빌, 자석 CTA, 언더라인 슬라이드, 커서 라벨, 강조어 타이포)만 번역한다.
5. 참고 사실을 인용할 때는 이 문서의 원본 링크를 남긴다.

## 1. 관찰 요약

- 개인 브랜드: Venice 기반 크리에이티브 개발자 / UX·UI 디자이너. 모션 자체가 상품인 사이트다.
- 팔레트: 웜 크림(#FFF2E0) 단일 배경 + 잉크 텍스트. 미니멀, 큰 여백.
- 카피 구조: `Interactive · Immersive · Impactful` 같은 형용사 강조어 3개로 역량을 요약한다.
- Work Index: `01/04` 형식의 번호 목록, 프로젝트명 + 연도 + 기술 태그 + `View project ↗` CTA.
- 기술 태그에 GSAP·React·Next.js가 노출되어 있어 텍스트 리빌·마이크로 인터랙션은 GSAP 계열로 추정된다.
- 언어 토글(EN/IT), "Let's work together ↗" 대형 컨택트 CTA.

## 2. 이미 겹치는 것 (융합이 자연스러운 근거)

SeMinKong 사이트는 v1.3 개편에서 같은 장르 문법을 이미 채택했다. 웜 페이퍼 팔레트, 번호형 에디토리얼 인덱스(`01/06`), ↗/→ 화살표 링크 규약, Lenis 스무스 스크롤, 커튼 페이지 전환, 대형 Contact 마무리. 따라서 이 융합은 리디자인이 아니라 **마이크로 인터랙션 레이어 추가**다.

## 3. 지켜야 할 SeMinKong의 축 (희석 금지)

- CSS 로봇 손(그래픽) ↔ THING 실물 손(증거)으로 이어지는 서사와 name-first Hero.
- vermilion 시그널, mono 라벨 시스템, 증거 중심(수치·영상) 케이스 구조.
- `environment` 3단계(full/lite/reduced) 모션 티어링과 hidden/offscreen 정지 규칙.
- 장식 모션은 증거 열람을 가리지 않는다: hover·진입 시점에만, 스크롤 필수 경로에는 두지 않는다.

## 4. 번역해서 가져올 원칙

| 단계 | 패턴 | SeMinKong 번역 |
| --- | --- | --- |
| 1 | 줄 단위 마스크 텍스트 리빌 | 페이지 `h1`(intro)과 Home 섹션 `h2`(`data-reveal="title"`)가 마스크 안에서 줄별로 상승. Anime.js `out(4)`, 줄당 90ms 스태거, 완료 후 원본 텍스트로 복원(접근성·리사이즈 안전) |
| 1 | 자석 CTA | `.button`, `.nav-resume`, `.resume-back`에 spring 기반 자석 hover(최대 8px). full motion + fine pointer에서만 |
| 1 | 언더라인 슬라이드 | `.text-link`, `.source-link`에 왼→오 1px 언더라인. CSS 전용, reduced에서는 전환 없음 |
| 2 | 커서 팔로워 라벨 | Work 행 hover 시 mono 라벨("상세 보기")이 커서를 따라오는 패턴 |
| 3 | 강조어 점화 | Focus의 Vision·Robotics·Systems 키워드를 스크롤 진입 시 순차 강조(vermilion) |
| 보류 | 마퀴 밴드 | 증거 중심 톤과 충돌 여부를 2단계 후 재평가 |

## 5. 가져오지 않을 것

- Lorenzo의 카피, 인물 사진, 프로젝트 프리뷰, 크림 값 그대로의 배경.
- GSAP/Next.js 스택 전환, 커스텀 커서 전면 교체(케이스 증거 열람을 방해), EN/IT 토글 구조.
- Hero 재구성: name-first + 로봇 손 구성이 이미 더 강한 시그니처다.

## 6. 검증 기준 (모든 단계 공통)

1. `?motion=reduced`에서 기존 빌드와 전 라우트 픽셀 패리티(신규 모션은 reduced에서 완전 정적).
2. 콘솔·페이지 에러 0, 390/768/1280 레이아웃 확인.
3. 분할된 텍스트는 애니메이션 종료 후 원본 텍스트 노드로 복원되어 선택·검색·스크린리더에 영향이 없어야 한다.
4. `AGENTS.md` 모션 규칙 준수: hidden/offscreen 정지, 터치 스크롤 비간섭, on/off 버튼 미노출.
