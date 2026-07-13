# Codex 장기 작업 튜토리얼

이 문서는 이 프로젝트에서 Codex, 서브에이전트, Goal, Worktree를 안전하게 사용하는 순서를 설명한다.

## 1. 기본 원칙

메인 에이전트는 제품 책임자이자 통합 담당자다. 서브에이전트는 독립적으로 끝낼 수 있는 조사, 분석, 테스트를 맡는다. 여러 에이전트가 같은 파일을 동시에 수정하지 않는다.

권장 흐름:

`/plan → 문서 승인 → /goal → 병렬 조사 → 소유권이 분리된 구현 → 브라우저 QA → 메인 통합`

## 2. 최초 준비

PowerShell에서 다음 명령으로 환경을 확인한다.

```powershell
node --version
npm.cmd --version
git status
npm.cmd run build
```

이 프로젝트는 npm을 사용한다. PowerShell에서 `npm`이 실행 정책 오류를 내면 정책을 바꾸지 말고 `npm.cmd`를 사용한다.

## 3. `/plan` 사용법

디자인이나 코드 작업을 시작하기 전에 `/plan`으로 요구사항을 확정한다. 아직 답이 없는 질문은 `docs/design-brief.md`의 Open questions에 기록한다.

좋은 Plan 요청 예시:

```text
/plan
현재 사이트를 독창적인 인터랙티브 포트폴리오로 재설계하려고 한다.
나를 인터뷰해서 핵심 메시지, 타깃 방문자, 섹션, 시각 방향,
모션 강도, 모바일 전략, 완료 기준을 확정해줘.
결정된 내용은 docs/design-brief.md와 docs/motion-spec.md에 반영해줘.
```

Plan 단계에서는 큰 코드를 작성하지 않는다. 디자인 방향, 제약, 완료 조건이 합의되면 Goal로 전환한다.

## 4. `/goal` 사용법

Goal에는 세 요소가 필요하다.

1. Outcome: 최종 결과
2. Constraints: 도구, 금지사항, 호환성
3. Verification: 완료를 증명할 테스트

예시:

```text
/goal
이 저장소를 독창적인 Anime.js 포트폴리오로 완성해줘.
실제 Three.js는 추가하지 않고 npm만 사용한다.
390px, 768px, 1280px에서 가로 넘침이 없어야 한다.
Motion/Depth 토글과 reduced-motion을 지원하고 npm.cmd run build가 통과해야 한다.
브라우저 콘솔 오류가 없어야 완료다.
```

Goal 실행 중에도 같은 작업에서 조건을 추가하거나 상태 요약을 요청할 수 있다. 작업 방향이 달라지는 결정을 제외하면 에이전트가 계속 진행하도록 한다.

## 5. 서브에이전트 역할

### design_researcher

- 목적: 레퍼런스 원칙과 차별화 방향 분석
- 권한: 읽기 전용
- 결과: 적용할 원칙, 피할 복제 요소, 위험

### content_architect

- 목적: 메시지, 섹션, 제목, 프로젝트 정보 구조 설계
- 권한: `docs/design-brief.md` 또는 별도 제안서만 작성
- 결과: 최종 카피 후보와 섹션 흐름

### motion_engineer

- 목적: Anime.js 모션 시스템 구현
- 권한: 할당된 `src/motion/` 및 모션 스타일 파일만 수정
- 결과: 구현, 빌드 결과, reduced-motion 검증

### visual_qa

- 목적: 실제 브라우저 품질 검사
- 권한: 기본 읽기 전용
- 결과: 화면 크기별 결과, 콘솔 오류, 접근성 및 성능 문제

## 6. 에이전트 요청 템플릿

```text
역할:
목표:
입력 자료:
허용된 파일:
수정 금지 파일:
반드시 지킬 제약:
결과물:
검증 방법:
종료 조건:
```

작업 범위가 애매하면 병렬화하지 않는다. 특히 현재 `src/main.js`와 `src/style.css`는 크기 때문에 모듈 분리 전에는 한 명만 수정한다.

## 7. Worktree 사용법

Worktree는 서로 독립적인 코드 작업이 동시에 필요할 때만 사용한다. Git 저장소와 기준 커밋이 먼저 필요하다.

권장 구조:

- Local: 메인 통합과 최종 브라우저 검증
- Worktree A: 레이아웃 리팩터링
- Worktree B: 모션 모듈화
- Worktree C: 독립 UI 프로토타입

같은 브랜치를 두 Worktree에서 동시에 사용하지 않는다. `.env` 같은 무시된 파일이 Worktree에도 필요하면 나중에 `.worktreeinclude`를 추가한다.

## 8. 단계별 승인 지점

사용자 결정은 다음 네 시점에 집중한다.

1. 디자인 방향 승인
2. 와이어프레임과 콘텐츠 구조 승인
3. 첫 모션 프로토타입 승인
4. 최종 브라우저 QA 승인

각 승인 사이에서는 메인 에이전트가 서브에이전트를 관리하고 계속 진행한다.

## 9. 반복 작업을 Skill로 만들 시점

동일한 QA나 리뷰 절차가 두세 번 반복된 뒤 Skill로 만든다. 처음부터 Skill을 만들면 아직 확정되지 않은 절차가 굳어질 수 있다.

이 프로젝트의 후보:

- `portfolio-visual-qa`
- `anime-motion-review`
- `responsive-browser-check`

## 10. 완료 보고 형식

```text
완료 결과:
변경 파일:
검증한 명령:
브라우저 확인 크기:
남은 위험:
사용자 결정이 필요한 항목:
```
