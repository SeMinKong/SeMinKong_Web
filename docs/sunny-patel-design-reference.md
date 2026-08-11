# Sunny Patel design reference → SeMinKong adaptation brief

> 작성일: 2026-08-11
>
> 상태: 참고 분석 / 구현 전 명세
>
> 기준 화면: [Sunny Patel Portfolio](https://www.sunnypatel.net/)
>
> 공개 소스: [sunnypatell/Portfolio](https://github.com/sunnypatell/Portfolio)

## 0. 사용 범위와 라이선스 경계

이 문서에서 `재현`은 Sunny Patel 사이트를 복제한다는 뜻이 아니다. 관찰 가능한 시각 원칙, 치수, 상호작용 패턴을 분석한 뒤 SeMinKong 포트폴리오의 콘텐츠와 정체성에 맞게 다시 설계한다는 뜻이다.

공개 저장소의 [LICENSE](https://github.com/sunnypatell/Portfolio/blob/main/LICENSE)는 소스 학습과 작은 범용 기법의 참고는 허용하지만, 다음 항목의 재사용은 허용하지 않는다.

- 사이트 전체 또는 상당 부분의 복제·재배포
- 문구, 디자인, 레이아웃, 이미지, 개인 브랜딩의 재사용
- 초상, 3D CRT 에셋, 프로젝트 설명 등 개인 자산의 재사용

따라서 구현 시 아래 원칙을 지킨다.

1. Sunny의 문구, 프로젝트 구성, CRT 모델, 초상, 일러스트를 사용하지 않는다.
2. 정확한 색상 조합과 화면 배열을 그대로 복제하지 않는다.
3. 컨테이너 규칙, 정보 위계, 작은 상태 신호, 접근성·성능 기법처럼 범용적인 원칙만 번역한다.
4. SeMinKong의 손 그래픽, THING 실제 영상, signal lime, 한국어 콘텐츠를 시각 정체성의 중심으로 유지한다.
5. 참고 사실을 인용할 때는 이 문서 하단의 원본 링크를 남긴다.

## 1. 한눈에 보는 핵심

Sunny 사이트가 정돈되어 보이는 이유는 화려한 효과보다 다음 다섯 가지 규칙이 일관되기 때문이다.

1. 큰 제목, 짧은 설명, 하나의 주요 행동을 명확히 구분한다.
2. 카드 배경을 남발하지 않고 여백과 1px 선으로 섹션을 나눈다.
3. 디스플레이·본문·메타데이터에 서로 다른 서체 역할을 부여한다.
4. 프로젝트 미디어를 동일한 프레임 언어로 묶되, 상세 설명은 별도 페이지로 넘긴다.
5. 포인트색은 넓은 면이 아니라 점·숫자·키워드·밑줄·CTA 경계에 제한적으로 사용한다.

SeMinKong 사이트에서 우선 가져올 것은 다음이다.

- 투명 → 반투명으로 변하는 고정 헤더
- 작은 mono eyebrow와 짧은 hairline
- 제목 속 핵심 단어 한 곳만 signal lime으로 강조하는 규칙
- 16:10 일반 프로젝트 프레임과 THING 전용 9:16 프레임의 공존
- 카드 전체 클릭, 명시적 CTA, 제목·연도·상태의 반복 구조
- Work/Focus를 카드가 아닌 번호형 에디토리얼 행으로 정리하는 방식
- 상세 페이지 상단의 GitHub·데모·핵심 수치 즉시 노출
- 절제된 line reveal, 18px reveal, 2px 화살표 이동

그대로 가져오지 않을 것은 다음이다.

- CRT 컴퓨터 3D 오브젝트
- graphite + ember의 정확한 색 조합
- Sunny의 영문 카피와 동일한 줄바꿈
- Home의 긴 모바일 Hero 높이
- 768px부터 데스크톱 내비게이션을 강제하는 규칙
- 모든 프로젝트를 16:10으로 자르는 규칙
- 새 GSAP/Motion/Three.js 스택

## 2. 정보 구조

### 2.1 참고 사이트의 구조

| 경로 | 역할 | 주요 표현 |
|---|---|---|
| `/` | 빠른 포지셔닝과 대표 작업 | 상태 → 대형 문장 → CTA → 시그니처 오브젝트 → Selected Work |
| `/projects` | 대표 작업과 나머지 작업 분리 | 대표 2열 에디토리얼 블록 + 작은 카드 그리드 |
| `/projects/[slug]` | 프로젝트 근거 제시 | 상단 행동·수치 → 큰 미디어 → 본문/하이라이트 2열 |
| `/work` | 경력 시간축 | 날짜·장소와 역할·성과의 2열 행 |
| `/about` | 사람과 작업 방식 | 인물 이미지·facts + 긴 자기소개·tools |
| `/resume` | 채용 자료 | 다운로드/미리보기 중심 |
| `/contact` | 연락 전환 | 연락 정보 + 폼의 2열 구성 |

참고: [Home source](https://github.com/sunnypatell/Portfolio/blob/main/src/app/page.tsx), [Projects source](https://github.com/sunnypatell/Portfolio/blob/main/src/app/projects/page.tsx), [Case study source](https://github.com/sunnypatell/Portfolio/blob/main/src/app/projects/%5Bslug%5D/page.tsx)

### 2.2 SeMinKong 번역

현재 멀티페이지 구조는 유지한다.

| 현재 경로 | 적용할 원칙 | 유지할 고유 요소 |
|---|---|---|
| `/` | 짧은 Hero, 대표 작업, 번호형 Focus, Current, Contact | SeMinKong 이름, 로봇 손 그래픽, signal lime |
| `/work/` | THING 대형 대표 블록 + 나머지 프로젝트 행 | 프로젝트 우선순위와 실제 미디어 |
| `/work/thing/` | 상단 근거·행동 → 세로 영상 → 결정/근거/결과 | 9:16 실제 시연, 21 landmarks, 7 axes, ROS 2 |
| 다른 case | 공통 case shell과 개별 프로젝트 컬러 | 실제 화면·영상, 공개 가능한 근거 |
| `/about/` | 짧은 포지셔닝 + working principles + tools | 한국어 자기소개와 현재 학습 범위 |
| `/resume/` | 채용 담당자가 바로 읽는 HTML 이력서 | 기존 공개 범위와 개인정보 정책 |

별도 Contact 페이지와 command palette는 즉시 필수 항목이 아니다. 현재 프로젝트 수와 사용 흐름을 기준으로 2차 개선으로 둔다.

## 3. 시각 토큰

### 3.1 참고 사이트에서 관찰한 값

아래 값은 분석 기록이며 그대로 복사할 팔레트가 아니다. 원본 정의는 [globals.css](https://github.com/sunnypatell/Portfolio/blob/main/src/app/globals.css)에 있다.

| 역할 | 참고 값 | 용도 |
|---|---:|---|
| base | `#0b0d0f` | 전체 배경 |
| raised base | `#0e1113` | 구분된 밴드 |
| surface | `#121518` | 패널과 필드 |
| raised surface | `#191d21` | 더 높은 패널 |
| hairline | `#262b30` | 장식용 1px 선 |
| primary text | `#ede8dc` | 따뜻한 주 텍스트 |
| secondary text | `#c7c3ba` | 본문 |
| muted | `#8a929b` | 라벨·연도·보조 링크 |
| accent | `#d9663d` | 점·번호·강조·CTA 경계 |
| accent hover | `#e8794e` | hover와 광원 |
| field border | `#5a646d` | 입력 컨트롤 경계 |
| base radius | `10px` | 작은 패널 |
| floating radius | `12px` | 미디어·팔레트 |

### 3.2 SeMinKong용 토큰 번역

기존 `src/styles/tokens.css` 값을 유지하고 역할만 더 엄격히 한다.

```css
/* 새 팔레트가 아니라 기존 값의 역할 명세 */
:root {
  --bg: #090d0b;
  --bg-raised: #0f1511;
  --surface: #141b16;
  --surface-strong: #1a231c;
  --text: #f1f2e9;
  --text-soft: #bec5bc;
  --line: rgba(241, 242, 233, 0.12);
  --line-strong: rgba(241, 242, 233, 0.24);
  --signal: #c8ff63;
  --signal-deep: #8fca36;
}
```

적용 규칙:

- `--signal`은 한 화면의 8–12% 이하에서만 강하게 보이게 한다.
- 대형 배경을 lime으로 채우지 않는다.
- primary CTA, 상태 점, 번호, 제목의 한 단어, focus ring에만 반복한다.
- 본문은 `--text-soft`, 핵심 제목은 `--text`, 메타는 더 낮은 대비로 분리한다.
- 카드 구분은 큰 그림자보다 `--line`과 여백을 우선한다.
- 표면 질감이 필요하면 SVG noise를 `opacity: 0.02–0.025`로 제한한다.

권장 그림자:

```css
--shadow-panel:
  inset 0 1px 0 rgba(255, 255, 255, 0.03),
  0 24px 60px -30px rgba(0, 0, 0, 0.7);

--shadow-float:
  0 40px 90px -40px rgba(0, 0, 0, 0.82);
```

## 4. 타이포그래피

### 4.1 참고 사이트의 역할 분리

| 역할 | 참고 서체 | 성격 |
|---|---|---|
| Display | Geist 600 | 제목과 프로젝트명 |
| Body | Hanken Grotesk 400 | 읽기 긴 문장 |
| UI / Meta | Geist Mono | 내비게이션, 번호, 상태, 버튼 |

SeMinKong은 기존 서체를 유지한다.

| 역할 | SeMinKong 서체 | 사용처 |
|---|---|---|
| Latin display | Manrope Variable | 이름, 큰 영문 제목 |
| Korean body/display | Noto Sans KR Variable | 한국어 제목과 본문 |
| UI / Meta | JetBrains Mono Variable | 번호, 영문 라벨, 기술, CTA 보조 |

### 4.2 권장 크기

| 요소 | 390px | 768px | 1280px | 비고 |
|---|---:|---:|---:|---|
| Hero name | `clamp(3.1rem, 12.5vw, 4.75rem)` | 약 `65px` | 약 `76px` | 현재 이름 우선 구조 유지 |
| Hero statement | `34–38px` | `46–52px` | `58–64px` | 한국어는 line-height `1.04–1.12` |
| Section H2 | `32px` | `40–44px` | `44–48px` | `line-height: 1.04–1.12` |
| Project title | `24–30px` | `30–36px` | `36–48px` | 대표/일반 계층 분리 |
| Case H1 | `44–48px` | `54–60px` | `60–64px` | 짧은 제목 우선 |
| Lead | `16.3px / 1.62` | `18px / 1.62` | `18–20px / 1.62` | 폭 `42rem` 이하 |
| Body | `16px / 1.7` | `16–17px / 1.68` | `16.8–18px / 1.65` | 한국어 긴 문장 |
| UI/meta | `12–14px` | `12–14px` | `12–14px` | 11px 미만 금지 |

큰 제목은 자간을 줄이되 한국어에 영문과 같은 `-3.5%`를 일괄 적용하지 않는다.

- 영문 display: `letter-spacing: -0.03em`까지 허용
- 한국어 display: `-0.015em` 안쪽
- mono eyebrow: `letter-spacing: 0.16–0.22em`
- 본문: 기본 자간 또는 한국어 `-0.005em` 이내

## 5. 그리드와 여백

### 5.1 공통 셸

| 항목 | 기준 |
|---|---:|
| 최대 컨테이너 | `1152px` |
| 실제 콘텐츠 최대 폭 | `1072px` |
| 모바일 좌우 여백 | `24px` |
| 640px 이상 좌우 여백 | `40px` |
| 헤더 높이 | `64px` |
| 모바일 섹션 여백 | `96px` |
| 640px 이상 섹션 여백 | `112–128px` |
| 섹션 경계 | `1px solid var(--line)` |
| 기본 열 간격 | `32–40px` |
| 대표 2열 간격 | `56–64px` |

### 5.2 브레이크포인트

참고 사이트는 `640 / 768 / 1024px`에서 크게 변한다. SeMinKong은 한국어 길이와 터치 태블릿을 고려해 다음처럼 번역한다.

| 구간 | 동작 |
|---|---|
| `≤ 639px` | 1열, 24px inset, 모바일 메뉴, 정적/간소화 motion |
| `640–899px` | 2열 가능한 카드만 2열, 40px inset, 모바일 메뉴 유지 |
| `900–1023px` | 내비게이션 공간이 충분할 때만 desktop nav, 복잡한 행은 2열 |
| `≥ 1024px` | Hero/대표 프로젝트/상세 본문 2열, full motion 가능 |

`768px`에서 바로 3열 역량 구조로 바꾸지 않는다. 한국어 제목이 2–3줄로 찢어질 가능성이 높다.

## 6. 컴포넌트 상세

### 6.1 고정 헤더

관찰된 규칙:

- 높이 `64px`
- 최상단에서는 투명 배경과 투명 하단선
- `scrollY > 24px`에서 어두운 배경 80%, `backdrop-filter: blur(12px)`, 1px 하단선
- 상태 전환 `500ms`
- 활성 메뉴는 signal색 번호 + 1px 밑줄
- 검색 트리거, Résumé, Contact의 시각 강도가 서로 다름
- 모바일 토글은 `44 × 44px`
- 모바일 메뉴는 1열 dropdown, 행 높이 최소 `44px`

SeMinKong 적용:

- 현재 항상 보이는 nav 정책을 유지한다.
- `Projects`를 가장 눈에 띄는 일반 메뉴로 유지하고 Resume은 outline action으로 둔다.
- Contact는 데스크톱 헤더에만 간결하게 추가할 수 있다.
- 모바일 메뉴가 닫혔을 때 링크는 `hidden`, `inert`, 또는 조건부 렌더링으로 탭 순서에서 제거한다.
- 메뉴가 열리면 첫 링크로 focus를 옮기고, Escape/닫기 후 토글로 돌려보낸다.
- 태블릿의 터치 타깃도 최소 44px을 지킨다.

참고: [nav.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/layout/nav.tsx)

### 6.2 Hero

참고 사이트의 데스크톱 Hero는 대략 다음 비율이다.

```text
content 546px  |  gap 32px  |  visual 494px
        1.05fr |            | 0.95fr
```

정보 순서:

1. 8px status dot + 짧은 상태 문구
2. 3–5줄 대형 제목
3. 핵심 표현 2–3개만 강조한 lead
4. primary CTA 1개 + text CTA 1개
5. 작은 시스템/상태 패널
6. 오른쪽 시그니처 오브젝트

참고 수치:

- desktop visual: `height: 80vh`
- mobile visual: `height: 40vh`, `min-height: 300px`
- 오른쪽 glow: `672 × 672px`, `blur(140px)`, accent 약 12%
- primary CTA: 높이 약 `46px`, `padding: 12px 20px`, radius `6px`
- terminal/status panel: desktop 약 `384 × 163px`, radius `10px`

SeMinKong 적용:

- 오른쪽 CRT 대신 현재 CSS/DOM dexterous hand를 유지한다.
- 별도 가짜 터미널은 추가하지 않는다. THING proof chip이나 짧은 시스템 상태를 사용해야 한다면 실제 정보만 쓴다.
- 반복되던 THING 설명 문구는 Hero에서 제거된 현 상태를 유지한다.
- Hero가 모바일에서 약 1,320px까지 늘어나는 참고 사이트의 구조는 따라가지 않는다.
- 390px에서 손 그래픽과 다음 섹션의 시작을 1–1.1 화면 안에서 예측할 수 있게 한다.
- 이름, 핵심 statement, 2개 CTA, 손 그래픽만으로 첫 화면 위계를 만든다.

참고: [hero.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/home/hero.tsx)

### 6.3 Eyebrow

```text
[28px hairline]  SECTION LABEL
```

- font: mono
- size: `11.2–12px`
- uppercase 영문 또는 짧은 기술 라벨
- tracking: `0.18–0.22em`
- gap: `12px`
- 색: muted
- 선택적 index만 signal

한국어가 길면 uppercase 장식 대신 짧은 영문 라벨을 유지한다. 예: `SELECTED WORK`, `FOCUS`, `CURRENT`, `EVIDENCE`.

참고: [primitives.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/ui/primitives.tsx)

### 6.4 CTA와 텍스트 링크

Primary:

- `inline-flex`, 높이 최소 46px
- border signal 45–55%
- background signal 8–12%
- mono 14px
- hover에서 border 100%, background 16–20%
- 화살표는 X축 `2px`만 이동

Secondary:

- 배경 없음
- muted → text
- 수평 padding은 작게, 수직 hit area는 44px 이상
- 외부 링크 화살표는 X `+2px`, Y `-2px`

SeMinKong의 메인 primary는 현재처럼 채운 signal lime을 쓸 수 있지만, 한 화면에 하나로 제한한다. 같은 화면의 두 번째 행동은 outline 또는 text action으로 낮춘다.

### 6.5 프로젝트 미디어 프레임

참고 사이트의 `ProjectWindow`는 [project-window.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/ui/project-window.tsx)에 정의되어 있다.

일반 프로젝트 규칙:

- frame radius `12px`
- 1px hairline
- surface 배경
- header padding `10px 14px`
- 10px muted dot 3개, gap 6px
- 선택적 URL: mono `10.4–11px`
- media `aspect-ratio: 16 / 10`
- `object-fit: cover`, UI screenshot은 `object-position: top`
- hover scale `1 → 1.04`
- duration `800ms`
- easing `cubic-bezier(0.22, 1, 0.36, 1)`
- 그림자는 아래로 넓고 흐리게, glow는 선택적으로만 사용

SeMinKong 변형:

| 미디어 유형 | 프레임 |
|---|---|
| Web/UI screenshot | browser evidence frame, `16:10`, cover/top |
| 가로 시연 영상 | neutral media frame, 원본 비율 우선 |
| THING 세로 영상 | featured portrait frame, `9:16`, contain/center |
| 로봇·하드웨어 사진 | evidence photo frame, `4:3` 또는 원본 비율 |
| 다이어그램 | flat document frame, 불필요한 browser chrome 없음 |

THING을 16:10으로 강제 크롭하지 않는다. 프레임의 border·radius·meta 언어만 공유한다.

### 6.6 Home 프로젝트 카드

참고 구성:

- 390px: 1열, 약 332px 폭
- 768px: 2열, 약 319px 폭, 40px gap
- 1024px 이상: 3열
- 카드 전체가 하나의 링크
- 미디어 → 제목/연도 → one-line summary → 상태
- hover 시 제목만 accent, 미디어만 미세 확대

SeMinKong 적용:

- THING은 동일 크기의 카드 중 하나가 아니라 별도 featured composition으로 유지한다.
- 나머지 프로젝트만 같은 evidence card 시스템으로 묶는다.
- 카드당 키보드 tab stop은 하나로 유지한다.
- visible CTA 문구와 accessible name이 일치하도록 `aria-label`을 보완한다.
- focus-visible은 카드 전체에 2px signal ring을 표시한다.

### 6.7 번호형 역량 행

desktop 기준:

```text
01  Capability title    |    Result-oriented one sentence
```

- 행 위·아래 1px line
- 왼쪽 `1fr`, 오른쪽 `1.8fr`
- 열 gap 약 `40px`
- row padding `28px 0`
- 번호 mono 12px signal
- 제목 18px semibold
- 설명 15.5–16px, relaxed line-height

SeMinKong의 Focus 영역은 다음처럼 번역한다.

1. `Perception & Vision`
2. `Robot & System Integration`
3. `Full-stack Delivery`

각 문장은 기술 나열보다 결과·연결 범위·검증 방식을 먼저 말한다.

### 6.8 Projects / Work index

대표 프로젝트 desktop:

```text
media 504px  |  gap 64px  |  copy 504px
```

- 항목 간 `112–144px`
- 대표 프로젝트는 이미지/설명 순서를 번갈아 배치 가능
- copy 순서: 번호·연도·상태 → 제목 → 한 줄 정의 → 요약 → 기술 → 수치 → 링크
- `Case study`만 강한 색, Live/Source/Docs는 보조색
- 나머지는 2–3열의 간결한 카드 또는 행

SeMinKong 적용:

- THING을 `01` 대형 블록으로 둔다.
- portrait video와 copy를 desktop에서 병렬 배치하되 영상 폭은 약 `360–420px`로 제한한다.
- 영상의 빈 옆 공간을 억지로 채우지 않고 proof metrics와 GitHub/상세 CTA를 copy 열에 둔다.
- AQIS 이하 프로젝트는 일정한 행 높이와 명시적 `프로젝트 살펴보기 →`를 유지한다.

참고: [projects/page.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/app/projects/page.tsx)

### 6.9 Case study

참고 구조:

1. Back link
2. 연도·tagline·status
3. 60px 안팎의 H1
4. 최대 672px lead
5. Live / Source / Docs
6. 정량 지표
7. 최대 980px hero media
8. 본문 `1.55fr` + highlights `1fr`
9. built-with chips
10. next project

desktop 수치:

- page top padding `112px`
- media top margin `56px`
- body top margin `64px`
- 본문 열 약 `613px`
- aside 약 `395px`
- column gap `64px`
- aside 왼쪽에 1px line + `48px` padding

SeMinKong 적용:

- THING case의 상단에 `최종 시연`, `GitHub`, `시스템 경로` 행동을 즉시 노출한다.
- 영상은 원본 9:16을 유지한다.
- 본문은 `Context → Role → Decisions → Evidence → Outcome`을 유지한다.
- 개인 역할이 확인되지 않은 팀 프로젝트에서 리드·담당 범위를 추정하지 않는다.
- 프로젝트별 실제 근거를 우선하고 시각 장식용 가짜 수치를 만들지 않는다.

참고: [case page](https://github.com/sunnypatell/Portfolio/blob/main/src/app/projects/%5Bslug%5D/page.tsx)

### 6.10 Work timeline

참고 사이트의 Work는 카드 대신 연속된 행을 쓴다.

- 상단 큰 statement + 짧은 lead
- 각 행은 날짜·장소 meta / 역할·설명·bullet의 2열
- 행 사이 1px line
- 현재 항목만 작은 signal dot
- hover가 없어도 모든 정보가 읽힘

SeMinKong에서는 별도 경력 timeline을 과도하게 늘리기보다 Resume과 About에 중복되지 않게 사용한다.

### 6.11 About

참고 desktop은 약 `0.85fr / 1.15fr`의 2열이다.

- 왼쪽: portrait + facts table
- 오른쪽: 큰 positioning statement + 2–3개 긴 문단 + now + tools
- facts는 term/value 2열과 1px row line
- tools는 작은 카테고리와 chips

SeMinKong 적용:

- portrait가 없다면 억지로 만들지 않는다.
- 왼쪽을 `Working principles / Facts` 패널로 쓰고 오른쪽을 자기소개로 구성할 수 있다.
- Hero 손 그래픽을 About에서 반복하지 않는다.
- 프로젝트에서 이미 증명한 기술 나열을 중복하지 않는다.

### 6.12 Contact

참고 desktop은 정보와 폼의 2열이다.

- 왼쪽: 큰 제목, 짧은 문장, email, social/location, 개인 일러스트
- 오른쪽: name/email 2열, message full width, submit
- field는 surface 배경, field-grade border, 6px radius
- submit은 primary CTA 체계와 동일

현재 SeMinKong은 Home의 Contact block으로 충분하다. 별도 Contact 페이지를 만들 때만 위 구조를 참고하고, Sunny의 일러스트 대신 기존 손 그래픽이나 별도 개인 자산을 새로 제작한다.

### 6.13 Command palette

참고 동작:

- header search와 `Ctrl/⌘ K`로 열림
- dialog width `512px`
- viewport top `16vh`
- radius `12px`
- surface 배경 + 1px line + float shadow
- background: dark 약 70% + `blur(8px)`
- 입력 높이 약 `50px`
- 결과 영역 `max-height: 50vh`
- selected row: accent 15% 배경, 높이 약 36px
- 그룹: pages / projects / links / actions
- ArrowUp/Down, Enter, Escape 지원
- open 시 scroll lock, close 시 이전 focus 복귀

프로젝트가 6개인 현재 단계에서는 우선순위가 낮다. 추가할 경우 메뉴 복제가 아니라 `프로젝트·기술·페이지 검색`이라는 실제 탐색 문제를 해결해야 한다.

참고: [command-palette.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/ui/command-palette.tsx)

### 6.14 Footer

- 한 줄 브랜드 설명
- primary routes
- GitHub / email
- copyright
- 1px top border

모바일에서는 보조 링크도 높이 44px의 inline-flex hit area를 갖게 한다. 참고 사이트의 일부 footer 링크처럼 14–20px 높이에 머물지 않는다.

## 7. 모션과 상호작용

### 7.1 참고 수치

| 효과 | 시작 | 종료 | 시간 / easing |
|---|---|---|---|
| page enter | opacity 0, Y 14px | opacity 1, Y 0 | 600ms, premium ease |
| generic reveal | opacity 0, Y 18px | opacity 1, Y 0 | 700ms, `[0.16,1,0.3,1]` |
| title line reveal | Y 110%, opacity 0 | Y 0, opacity 1 | 900ms, 80ms stagger |
| image hover | scale 1 | scale 1.04 | 800ms, `(0.22,1,0.36,1)` |
| arrow hover | X 0, Y 0 | X 2px, Y -2px | 300ms |
| magnetic CTA | pointer offset × 0.35 | spring return | 600ms elastic |
| header state | transparent | dark/blur/line | 500ms |
| cursor ring | 38px | 68.4px | scale 1.8, 300ms |
| terminal typing | empty reserved rows | all text | 34ms/char + 2.8s hold |

참고: [reveal-text.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/motion/reveal-text.tsx), [reveal.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/ui/reveal.tsx), [magnetic.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/motion/magnetic.tsx), [boot-sequence.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/ui/boot-sequence.tsx)

### 7.2 SeMinKong 구현 규칙

- Anime.js를 primary motion engine으로 유지한다.
- Sunny와 같은 효과를 위해 GSAP, Motion, Three.js를 추가하지 않는다.
- 기존 Lenis는 지원되는 desktop full mode에서만 유지한다.
- title line reveal은 Anime.js로 `translateY(105–110%) → 0`, opacity `0 → 1`로 번역한다.
- 일반 reveal은 최대 Y `18px`, 한 번만 실행한다.
- 카드 hover는 media 내부에만 적용하고 전체 카드가 들썩이지 않게 한다.
- 손 그래픽은 기존 Anime.js timeline과 transform ownership을 유지한다.
- 커스텀 커서를 유지한다면 `(hover: hover) and (pointer: fine)`와 reduced-motion에서만 활성화한다.
- 모바일에서는 native scroll, 정적 depth, 1회 reveal만 유지한다.
- offscreen, hidden, pagehide에서 continuous loop와 video를 멈춘다.

### 7.3 3D 오브젝트에서 가져올 것은 성능 원칙뿐

참고 사이트는 React Three Fiber를 쓰며 [lazy-device.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/three/lazy-device.tsx)와 [pc-scene.tsx](https://github.com/sunnypatell/Portfolio/blob/main/src/components/three/pc-scene.tsx)에서 다음을 처리한다.

- dynamic import
- 화면 200px 전 로드
- 저사양 장치 poster fallback
- offscreen/hidden render pause
- DPR `1–1.6`
- touch에서 orbit 제거
- `touch-action: pan-y`
- 약한 idle sway와 제한된 camera control

SeMinKong은 Three.js를 추가하지 않고 같은 생명주기 원칙을 현재 DOM/CSS 손 그래픽과 video에 적용한다.

## 8. 반응형 명세

### 8.1 390 × 844

- header 64px
- 콘텐츠 inset 24px
- H1이 5줄 이상으로 깨지지 않도록 한국어/영문 각각 line-break 검증
- Hero CTA 44–46px
- 손 그래픽은 사용자 승인 위치의 중앙 lower field 유지
- Selected Work가 과도하게 늦지 않게 Hero 전체 높이를 현재 단축 방향으로 유지
- THING video는 9:16, `object-fit: contain`
- 일반 card 1열
- footer/secondary link hit area 44px
- 수평 overflow 0

### 8.2 768 × 1024

- inset 40px
- 모바일 메뉴 유지 권장
- 일반 card만 2열
- THING featured는 portrait media + copy 2열이 답답하면 세로 stack
- Focus는 1열 행 또는 2열, 3열 금지
- touch hit area 44px
- pointer depth 비활성, motion lite

### 8.3 1280 × 800

- 컨테이너 최대 1152px
- Hero copy/hand 2열
- 손 graphic area가 제목보다 시각적으로 너무 작아지지 않게 균형 조정
- THING featured portrait media와 proof copy 병렬
- Work featured 2열, 나머지 행
- case body/aside `1.55fr / 1fr`
- nav는 항상 보이고 스크롤 후 surface/blur/line 전환

## 9. 접근성·성능 기준

### 9.1 접근성

- skip link 제공
- route마다 하나의 H1
- 카드 전체 링크의 accessible name에 프로젝트명과 목적 포함
- focus-visible: 2px signal + background와 구분되는 halo
- mobile menu close 상태에서 링크를 탭 순서에서 제거
- open dialog/menu에서 focus containment 또는 명시적 focus 복귀
- Escape 지원
- decorative terminal/graphic은 `aria-hidden`
- 영상에는 controls, poster, descriptive label 제공
- `<br>` 전후 accessible text의 단어 경계 유지
- 색상만으로 상태를 전달하지 않음

### 9.2 성능

- Home/Work의 below-fold video는 `preload="none"`
- poster는 WebP/AVIF와 responsive size 사용
- 일반 이미지는 `loading="lazy" decoding="async"`
- 10MB 이상 영상의 eager buffering 금지
- continuous loop는 viewport 밖·hidden 상태에서 pause
- hover animation은 transform/opacity 중심
- DOM hand와 video에 동시에 무거운 filter animation을 적용하지 않음
- layout shift를 막기 위해 media aspect-ratio와 height를 사전 예약

### 9.3 reduced motion

- page entrance, line reveal, cursor tracking, depth tilt, magnetic pull을 제거 또는 즉시 완료 상태로 표시
- continuous hand loop는 정적 3/4 pose로 대체
- 콘텐츠는 모션 없이도 처음부터 모두 읽혀야 함
- video autoplay를 멈추고 사용자가 controls로 재생 가능해야 함

## 10. SeMinKong 적용 청사진

### Phase 1 — 시각 위계

1. header를 top transparent / scrolled surface 상태로 정리
2. eyebrow를 hairline + mono label 한 체계로 통일
3. 제목의 signal 사용량을 한 섹션 한 지점으로 제한
4. section padding과 border rhythm 통일
5. secondary link hit area를 44px로 확대

### Phase 2 — Home과 Work

1. THING portrait feature는 유지
2. 일반 프로젝트만 evidence window frame으로 통일
3. Focus를 번호형 행으로 정리
4. Work에서 THING을 대형 2열 대표 블록으로 유지
5. 카드/행 전체를 하나의 명확한 링크로 유지

### Phase 3 — Case study

1. 상단 행동과 핵심 수치를 즉시 노출
2. hero media의 프로젝트별 원본 비율 유지
3. 본문/근거 aside를 2열로 통일
4. next project 탐색 추가 또는 강화
5. GitHub·demo·evidence 링크 상태 검증

### Phase 4 — Motion과 탐색

1. Anime.js line reveal과 18px reveal 통일
2. media hover scale 1.04 제한
3. header state transition 구현
4. 필요성이 확인될 때만 command palette 도입
5. mobile menu focus 및 reduced-motion QA

## 11. 구현 우선순위

| 우선순위 | 항목 | 이유 |
|---|---|---|
| P0 | 모바일 Hero 높이와 손 위치 유지 | 현재 사용자가 직접 승인한 핵심 시각 |
| P0 | THING 9:16 원본 비율 유지 | 대표 증거의 크롭 방지 |
| P1 | typography/spacing/eyebrow 통일 | 한눈에 읽히는 효과가 가장 큼 |
| P1 | 일반 프로젝트 media frame 통일 | 프로젝트 비교와 탐색 개선 |
| P1 | scrolled header surface | 탐색 위치를 잃지 않음 |
| P1 | Focus 번호형 행 | 카드 과밀도를 줄임 |
| P2 | case 상단 행동·수치 | 상세 페이지 전환율 개선 |
| P2 | title/reveal 모션 통일 | 완성도 향상 |
| P3 | command palette | 프로젝트 수가 늘 때 가치 증가 |
| 제외 | CRT/Three.js 복제 | 라이선스·정체성·성능 모두 부적합 |

## 12. 완료 조건

- [ ] Sunny의 카피, 이미지, 3D CRT, 초상, 일러스트를 사용하지 않는다.
- [ ] 현재 signal lime과 손 그래픽을 유지한다.
- [ ] THING Home/Work preview는 9:16을 보존하고 크롭되지 않는다.
- [ ] 일반 프로젝트 media frame만 16:10을 사용한다.
- [ ] 390px, 768px, 1280px에서 수평 overflow가 없다.
- [ ] 390px 첫 화면에서 이름, statement, CTA가 잘리지 않는다.
- [ ] 프로젝트 CTA와 다음 탐색 경로가 항상 눈에 보인다.
- [ ] 모든 touch target은 최소 44px이다.
- [ ] 모바일 메뉴 close 상태의 링크가 탭 순서에 남지 않는다.
- [ ] 키보드만으로 nav, 카드, case CTA, footer를 탐색할 수 있다.
- [ ] reduced-motion에서 모든 콘텐츠가 완성 상태로 보인다.
- [ ] video와 continuous animation이 offscreen/hidden에서 정지한다.
- [ ] Anime.js가 primary motion engine으로 남는다.
- [ ] build와 verify가 통과한다.

## 13. 원본 근거

### Live pages

- [Home](https://www.sunnypatel.net/)
- [Projects](https://www.sunnypatel.net/projects)
- [Project detail](https://www.sunnypatel.net/projects/ats-screener)
- [Work](https://www.sunnypatel.net/work)
- [About](https://www.sunnypatel.net/about)
- [Contact](https://www.sunnypatel.net/contact)

### Source files

- [License](https://github.com/sunnypatell/Portfolio/blob/main/LICENSE)
- [Global tokens and base styles](https://github.com/sunnypatell/Portfolio/blob/main/src/app/globals.css)
- [Layout primitives](https://github.com/sunnypatell/Portfolio/blob/main/src/components/ui/primitives.tsx)
- [Navigation](https://github.com/sunnypatell/Portfolio/blob/main/src/components/layout/nav.tsx)
- [Hero](https://github.com/sunnypatell/Portfolio/blob/main/src/components/home/hero.tsx)
- [Home composition](https://github.com/sunnypatell/Portfolio/blob/main/src/app/page.tsx)
- [Project window](https://github.com/sunnypatell/Portfolio/blob/main/src/components/ui/project-window.tsx)
- [Projects composition](https://github.com/sunnypatell/Portfolio/blob/main/src/app/projects/page.tsx)
- [Case study composition](https://github.com/sunnypatell/Portfolio/blob/main/src/app/projects/%5Bslug%5D/page.tsx)
- [Command palette](https://github.com/sunnypatell/Portfolio/blob/main/src/components/ui/command-palette.tsx)
- [Generic reveal](https://github.com/sunnypatell/Portfolio/blob/main/src/components/ui/reveal.tsx)
- [Line reveal](https://github.com/sunnypatell/Portfolio/blob/main/src/components/motion/reveal-text.tsx)
- [Magnetic CTA](https://github.com/sunnypatell/Portfolio/blob/main/src/components/motion/magnetic.tsx)
- [Custom cursor](https://github.com/sunnypatell/Portfolio/blob/main/src/components/motion/custom-cursor.tsx)
- [Boot sequence](https://github.com/sunnypatell/Portfolio/blob/main/src/components/ui/boot-sequence.tsx)
- [Smooth scroll](https://github.com/sunnypatell/Portfolio/blob/main/src/components/providers/smooth-scroll.tsx)
- [Lazy 3D lifecycle](https://github.com/sunnypatell/Portfolio/blob/main/src/components/three/lazy-device.tsx)
- [3D scene](https://github.com/sunnypatell/Portfolio/blob/main/src/components/three/pc-scene.tsx)

---

이 문서는 구현 시 수치와 판단 근거를 빠르게 찾기 위한 참고 명세다. 실제 시각 결정은 `docs/design-brief.md`, 모션 결정은 `docs/motion-spec.md`, 승인된 변경은 `docs/decisions.md`를 최종 기준으로 한다.
