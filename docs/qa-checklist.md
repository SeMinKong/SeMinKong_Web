# QA checklist

이 체크리스트는 현재 사이트와 이후 변경 검증에 사용한다. 이전 전체 검수·배포 결과는 [QA 이력](history/qa-checklist.md)에 보관한다.

## 2026-09-08 10쪽·22쪽 지정 구간 중앙정렬

- [x] 120dpi 전체 비교에서 10·22쪽에만 변화가 있으며 나머지 24쪽은 픽셀이 동일하다. 배치 데이터도 10쪽 두 수식·보조 설명과 22쪽 오류 문구만 달라졌다. 두 페이지 전체 육안 검수에서 잘림·겹침이 없고 중심축이 맞는다.
- [x] PDF 검사 통과: 중앙정렬 문구 96개, 화살표 36개·중심 연결 13개, 겹침 0. 26쪽·북마크 26개·외부 링크 103개·목차 6개·최소 9pt·원본 구조도 5개 RGBA 일치를 유지한다.
- [x] 최종 PDF·공개 사본: 15,851,272 bytes, SHA-256 `B5BE2E74BF8B996954417E1C4E4A391D5D5DCB89DD7534128B4E167D917663B5`. 다운로드 26쪽·15.9MB·2026.09.08 표시와 파일 계약을 확인했다.
- [x] `npm.cmd run verify` 통과: 49개 테스트·소스 경계·production build·11개 route·22개 배포 entry. 실제 Chromium Resume 390/768/1280 기본 및 1280 reduced에서 오류·가로 넘침 0, Tab/Enter 포커스 정상, 실제 다운로드 크기·SHA 일치. 웹 HTML·CSS·JS는 변경하지 않았다.

## 2026-09-08 도식 중앙정렬·단계 번호 정리

- [x] 26쪽 전체 렌더와 p5·10·11·12·13·16·19·22·25를 확대 검수했다. 도식 상자·토큰 띠·그림 라벨의 중앙정렬, MRI 빈 설명 상자의 세로 정렬, Alkkagi 벡터 중심을 확인했다. 숫자를 제거한 자리의 간격도 정상이다.
- [x] PDF 실제 글자 좌표로 중앙정렬 문구 92개의 각 줄이 중심축에서 0.3pt 이내인지 검증했다. 본문 겹침 0, 화살표 36개와 중심 연결 13개 정상. 26쪽·북마크 26개·외부 링크 103개·내부 목차 6개·최소 9pt·원본 PNG 5개 RGBA 일치를 유지한다.
- [x] 최종 PDF·공개 사본: 15,851,214 bytes, SHA-256 `DEB472A33BA70C5BF47EB47697B631F8615FDBF343A3343110F41FFE9E34E73E`. 26쪽·15.9MB·2026.09.08 표시와 바이트/해시 계약을 동기화했다.
- [x] `npm.cmd run verify` 통과: 49개 테스트, 소스 경계, production build, 11개 route·22개 배포 entry. 웹 HTML·CSS·JS 동작은 변경하지 않았다.
- [x] 실제 Chromium에서 Home·Resume의 390/768/1280px 기본·reduced 12개 조합을 확인했다. 오류·가로 넘침 0, 실제 Tab/Enter 포커스와 capability 정상. Resume 실제 다운로드의 크기·SHA가 최종 PDF와 일치한다. Reduced는 브라우저 에뮬레이션이며 실물 touch·OS 설정 전환은 미검증이다.

## 2026-09-08 편안한 비율·정렬과 웹 기술 설명

- [x] 최종 PDF 26쪽을 105dpi로 렌더링해 전체와 도식 8쪽·아키텍처 6쪽을 검수했다. 제목 23pt, 넓어진 설명 열, 한국어 단어 단위 줄바꿈과 하단 여백을 확인했다. 기존 소개·프로젝트 순서·원본 자료·수상 링크를 유지했다.
- [x] PDF 검사: 외부 링크 103개·목차 링크 6개·북마크 26개, 겹침 0, 화살표 36개와 중심 연결 13개 정상, 최소 9pt, 캡션 정렬 7개·문단 끝줄 12개, 원본 구조도 5개 RGBA 일치.
- [x] 최종 PDF·공개 사본은 15,851,027 bytes, SHA-256 `CD0A46D2661D40897916B219400184A7744FBFAC9FA9FBF72CC56116B0EFE933`로 일치한다. Resume 26쪽·15.9MB·2026.09.08과 바이트/해시 계약을 확인했다.
- [x] Briefit·MRI·Prompt·Alkkagi의 구현 설명을 고정 commit과 대조했다. URL 저장 조건, 실제 클래스명, 처리 대상 예외와 미완료 상태, 조건부 마찰 비율을 확인했다. 새 WebP 구조도 네 개는 원본 PNG와 RGBA가 일치한다.
- [x] `npm.cmd run verify`: 49개 테스트·11개 route·28개 module·12개 stylesheet 경계·production build·22개 배포 entry 통과. 마지막 제목 줄바꿈 조정 후 build·verify:dist도 통과했다. Vite의 자산 처리 대상에 `/src/assets/`로 시작하는 anchor href만 추가해 원본 이미지 링크도 상대 배포 경로로 변환한다.
- [x] 실제 Chromium 390·768·1280px에서 Home·Resume·6개 프로젝트의 기본/reduced 표시와 전체 스크롤을 확인했다. 콘솔 오류·경고·가로 넘침·누락 이미지·누락 내부 링크·스크롤 뒤 숨은 reveal이 없으며, 실제 Tab과 skip 링크의 2px focus·본문 진입이 정상이다. Root는 Briefit 데스크톱/모바일의 본문 비율과 균형 잡힌 제목 줄바꿈을 추가 확인했다.

모션 동작 코드는 변경하지 않았다. reduced/coarse는 브라우저 에뮬레이션이며 실물 touch·OS forced-colors·실제 탭 숨김은 이번 검증 대상이 아니다. 새 하드웨어·모델·부하 실험은 하지 않았다.

## 2026-09-08 기술 도식 시각화·AQIS 디지털 트윈/관제 확장

- [x] PDF 26쪽 전체 렌더와 변경된 기술 6쪽·AQIS 2쪽을 육안 검수했다. 최종 관절 필드 표기도 재렌더했다. 원래 본문 16쪽의 배치와 105dpi 본문 픽셀은 이전 공개본과 동일하다(목차·AQIS 소개·기술 도식 6쪽 제외, footer 쪽번호 제외).
- [x] 관절 벡터·보간 그래프·주기, 중복/pending 시간축, 학습 입력/labels 분리, MRI 동일 입력의 두 모델, Prompt 상태 복원, Alkkagi 입력/충돌을 소스와 교차 검토했다. RoboDK 팀 담당, RViz 지도, ROS position→서버 position_rad, 실제/가상 로봇 경계도 확인했다.
- [x] PDF: 26쪽·북마크 26개, 외부 링크 103개·내부 목차 6개, 겹침 0, 최소 9pt, 캡션 정렬 7개·문단 끝줄 12개, 원본 구조도 5개 RGBA 일치, 벡터 기술 페이지 6개.
- [x] 최종 PDF·공개 사본: 15,856,271 bytes, SHA-256 `9A54C9D93866A161D431A0923EDF2AC3907B2AFB438694B21155A0805676D5E4`. Resume 26쪽·15.9MB·2026.09.08과 바이트/해시 계약을 동기화했다.
- [x] 최종 `npm.cmd run verify`: 49 tests, 11 routes·28 reachable modules·12 stylesheet boundaries, production build·22 deployment entries 통과. Resume skip link의 2px 포커스와 Enter 본문 이동, PDF 경로/메타를 실제 브라우저에서 확인했다.
- [x] AQIS 실제 Chromium 390·768·1280px에서 본문/도식/영상과 가로 overflow 0을 확인했다. 영상 3개 native controls·preload none·자동재생 없음. 공개 GIF에서 변환한 두 MP4의 전체 디코딩과 720×406 비율을 확인했다. 프로덕션 폰트 번들링 정상.
- [x] 개발 prebundle에서 발견한 Anime 값 파싱 오류는 `npm.cmd run dev -- --force` 재최적화 후 독립 Chrome 자연 스크롤에서 재현되지 않았다. 동일 소스의 프로덕션 preview에서도 새 오류 0·정상 reveal을 확인했다. 모션 소스 변경 없음.
- [x] Home/Resume 390·768·1280px: 오류·가로 넘침·숨은 reveal 0, 기본 full/interactive·lite/static과 키보드 포커스 정상. AQIS localhost reduced/flat 및 OS reduced motion도 세 폭에서 정상이다. 영상 3개 재생·시간 진행·실제 화면 밖 정지 확인. 숨김 정지는 visibilitychange 이벤트 주입으로 확인했으며 실제 탭 숨김은 headless 제약으로 미검증이다.

## 2026-09-08 계산·실행 조건 중심의 기술 6쪽 심화

- [x] 5·10·14·17·20·23쪽을 최종 렌더로 육안 검수했다. 문제·방법 설명과 식/의사코드를 세 행으로 대응시키고 본문 10.2pt를 유지한다. 기존 18쪽의 배치 데이터와 105dpi 전체 페이지 픽셀은 직전 공개본과 정확히 일치한다.
- [x] 세 명의 소스 검토 결과를 반영했다. THING 굽힘량/관절각·필터 초기값·조건부 엄지 전이, AQIS 이벤트 timestamp·빈 후보·중복 fallback·재개 설정, Briefit 토큰/문자 구분, Prompt 선택적 입력·목록 합성, Alkkagi 득점 후 재배치를 확인했다.
- [x] PDF: 24쪽·북마크 24개, 외부 링크 95개·소개로 연결되는 목차 6개, 겹침 0, 최소 9pt, 캡션 정렬 7개·문단 끝줄 12개, 원본 구조도 5개 RGBA 일치. 새 기술 페이지의 계산·설정·예외 조건도 검증한다.
- [x] 최종 PDF·공개 사본: 15,309,850 bytes, SHA-256 `03B8BE46002F6210D459AEF24452B7A186B46720E6534649B779EC6546B6511E`. Resume 24쪽·15.3MB·2026.09.08과 바이트/해시 계약을 동기화했다.
- [x] `npm.cmd run verify` 통과: 테스트 49개, route 11개·module 28개·stylesheet 12개, production build·배포 entry 22개.
- [x] 실제 Chromium Resume 390×844·768×1024·1280×900에서 새 설명·메타·다운로드 링크·가로 overflow 없음. Skip link·다운로드 링크의 2px focus와 Enter 본문 이동 확인. Home 세 크기의 full/interactive·lite/static, localhost reduced/flat·canvas 숨김, console warning/error 0 확인.

모션 코드는 변경하지 않았다. 실물 터치·OS forced-colors 전환과 새 하드웨어·모델·부하 실험은 수행하지 않았다. 별도 아키텍처 SVG·아이콘 변경은 이번 릴리스에 포함하지 않는다.

## 2026-09-08 기존 내용 보존·기술 도식 6쪽 추가

- [x] 기존 18쪽을 보존하고 기술 도식 6쪽을 추가한 24쪽 PDF를 렌더링했다. 새 5·10·14·17·20·23쪽과 변경된 목차를 육안 검수했다. 목차를 제외한 기존 17쪽의 본문·배치와 105dpi 본문 렌더가 이전 공개본과 모두 동일하며 쪽번호만 변경됐다.
- [x] 손 landmark/모터 순서, 깊이 격자·미터/밀리미터 좌표 변환, Briefit 짧은 입력 분기·매 생성 호출 후처리, MRI 윤곽 필터, Prompt in_progress 유지·오류 복원, Alkkagi 위치 보정 벡터·역질량 충격량을 소스와 대조했다. 새 그림과 코드는 개념도·의사코드로 표시했다.
- [x] PDF 검사 통과: 24쪽·북마크 24개, 외부 링크 87개·내부 목차 6개, 벡터 기술 페이지 6개, 겹침 0, 캡션 정렬 7개, 문단 끝줄 12개, 최소 9pt. 목차는 소개 페이지 3·8·12·15·18·21쪽을 가리킨다. 원본 구조도 5개의 RGB·alpha·해시가 일치한다.
- [x] 최종 PDF·공개 사본: 15,282,857 bytes, SHA-256 `C431EE04298F87DAB20E6C27952FDEE7ADBCA3D2FB367C68DFDFE2216B2621F9`. Resume의 24쪽·15.3MB·2026.09.08과 바이트/해시 계약을 동기화했다.
- [x] `npm.cmd run verify`: 49개 테스트, 11개 route·28개 module·12개 stylesheet, production build·22개 배포 entry 통과. `git diff --check` 통과.
- [x] 실제 Chromium Resume 390×844·768×1024·1280×900에서 설명·메타데이터·다운로드 링크·가로 overflow 0을 확인했다. Skip link·PDF 링크의 2px focus와 Enter 본문 이동, warning/error 0을 확인했다. Home도 세 크기 overflow 0, 기본 full/interactive·lite/static, localhost reduced/flat·canvas 숨김을 확인했다.

모션 코드는 변경하지 않았다. 실물 터치·OS forced-colors 전환과 새 하드웨어·모델·부하 실험은 수행하지 않았다. 별도 아키텍처 SVG·아이콘 변경은 이 배포에서 제외한다.

## 2026-09-07 프로젝트별 핵심 기술 페이지

- [x] 4·8·11·13·15·17쪽을 소스 기반 기술 해설로 편집하고 최종 렌더를 육안 검수했다. 나머지 12쪽은 이전 공개 PDF의 105dpi 렌더와 픽셀 단위로 동일하다. 총 18쪽·프로젝트 소개 시작·지정 순서·수상 자료를 유지한다.
- [x] GitHub의 고정 commit 파일/함수와 여섯 페이지 문구를 재대조했다. THING 명령 종류·엄지 제어, AQIS 동일 이벤트 cooldown, Briefit 학습/평가 범위, MRI 독립 추론, Prompt 일부 영역 합성과 라운드 조건, Alkkagi 위치/속도 보정의 차이를 확인했다.
- [x] PDF 검사 통과: 북마크 18개, 외부 링크 69개·소개로 연결되는 내부 링크 6개, 겹침 0, 캡션 7개, 문단 끝줄 12개, 최소 글자 9pt. 기술 페이지마다 입력/출력 흐름과 고정 commit 소스 3개 이상을 확인했다. 원본 구조도 PNG 5개의 RGB·alpha·해시는 동일하다.
- [x] 공개 사본과 최종 PDF는 15,241,011 bytes, SHA-256 `042CBEFD1D296D4470C6D1F814535D9783EE7C45A124F6E5DDC8F7EF959B1345`로 일치한다. Resume의 18쪽·15.2MB·2026.09.07 표기와 바이트/해시 계약을 확인했다.
- [x] `npm.cmd run verify`: 테스트 49개, route 11개·module 28개·stylesheet 12개, production build·배포 entry 22개 검증 통과. `git diff --check` 통과.
- [x] 실제 Chromium Home·Resume 390×844·768×1024·1280×900에서 레이아웃과 가로 overflow 0, 다운로드 설명·링크를 확인했다. Skip link와 PDF 링크의 2px focus, Enter 본문 이동, warning/error 0을 확인했다. 기본 lite/static·full/interactive와 localhost reduced/flat·canvas 숨김도 확인했다.

새 실물·모델·부하 시험은 하지 않았다. 모션 코드는 변경하지 않았고, 실물 touch 기기·OS forced-colors 전환은 별도로 검증하지 않았다. 검증된 PDF·웹 설명·제작/검증 스크립트·문서만 기존 Pages pipeline으로 배포하며 별도 아키텍처 SVG·아이콘 작업은 포함하지 않는다.

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
- [x] 구현 커밋 `f02199a`의 GitHub Pages run `34088579312`에서 build·deploy 모두 성공했다. 공개 Home에서 새 `portfolio-CjyuSrh-.js`와 `portfolio-CVdpmLl9.css`, full/interactive, 11부품 sleeping, overflow 0, warning/error 0을 확인했다. 캐시 구분 query로 새 배포를 확인한 뒤 기본 주소로 복귀했다. Work는 1280px의 6개 프로젝트와 390px의 정적 목록·overflow 0을 확인했다.

이전 로봇 디자인 검수는 이력 첫 항목에 기록되어 있다. 이번 작업은 동일 동작의 구조 정리이며 실물 터치 기기와 OS forced-colors 전환은 별도 검증 대상이다.

## 2026-09-07 실무 판단 중심 정적 포트폴리오

- [x] 최종 PDF 18쪽을 렌더링해 전체 구성과 변경 페이지를 검수했다. 본문·이미지 겹침 0, 링크 60개·내부 목차 링크 6개, 수상 4건, 북마크 18개, 캡션 정렬 5개, 문단 끝줄 11개를 확인했다. 원본 구조도 PNG 5개의 RGB·alpha·해시가 모두 일치한다. 최소 글자 크기 8.8pt.
- [x] THING 이동 명령의 토크 순서, 개인/팀 기여, AQIS 정지·timestamp·고정 좌표·스크립트 종료 조건, Briefit 정보 손실과 평가 범위를 원본과 대조했다. 새 실물·모델·부하 실험 결과나 미확인 성능 수치는 추가하지 않았다.
- [x] 공개 사본과 최종 PDF: 15,053,868 bytes, SHA-256 `4E57CC1F514FD4B70AD578F307A1E057565A072F30CC039310D0DE9A85E6C661`. 다운로드 설명·18쪽·15.1MB·2026.09.07 및 바이트/해시 계약을 동기화했다.
- [x] `npm.cmd run verify`: 49개 테스트, 11개 route·28개 module·12개 stylesheet 경계, production build·22개 배포 entry 검증 통과. `git diff --check` 통과.
- [x] 실제 Chromium의 Resume 390×844·768×1024·1280×900에서 다운로드 설명·크기·링크·가로 overflow 0을 확인했다. Skip link의 focus와 Enter 본문 이동, PDF 링크의 2px focus outline, console warning/error 0을 확인했다.
- [x] Home의 기본 390/768 lite·static, 1280 full·interactive 및 가로 overflow 0을 확인했다. localhost reduced override에서 flat·canvas 숨김과 모바일 완성형 로봇을 확인했다. 로봇 동작 코드는 이번 변경 대상이 아니며 실물 touch 기기·OS forced-colors 전환은 별도로 검증하지 않았다.

배포는 이 검증 파일만 선별해 기존 Pages workflow로 수행한다. 별도 진행 중인 아키텍처 SVG·아이콘 변경과 임시 렌더 파일은 포함하지 않는다.

## 2026-09-07 프로젝트 순서와 소개 페이지

- [x] PDF 20쪽 전체를 렌더 검수했다. 순서는 THING → AQIS → Briefit → MRI → Prompt → Alkkagi이며 목차 링크 6개가 소개 페이지 4·8·12·14·16·18쪽을 가리킨다. 북마크 20개, 외부 링크 66개, 겹침 0, 캡션 정렬 7개, 문단 끝줄 11개, 최소 글자 크기 8.8pt를 확인했다.
- [x] Prompt 소개는 원본 설계 흐름도, Alkkagi 소개는 실제 게임 영상 프레임을 사용한다. 기존 17개 비목차 페이지는 쪽번호 외 본문·외부 링크·이미지 데이터를 이전 공개본과 대조했고 모두 동일하다. 원본 구조도 5개의 RGB·alpha·해시도 일치한다.
- [x] 최종 PDF와 공개 사본은 15,243,761 bytes, SHA-256 `FF19E6A3660DFE595D96DA4B3D5885CCCFDF808C54E0FC0D04DF725A10586838`로 일치한다. Resume의 20쪽·15.2MB·2026.09.07 표시와 바이트/해시 계약을 동기화했다.
- [x] `npm.cmd run verify` 통과: 49개 테스트, 11개 route·28개 module·12개 stylesheet 경계, production build·22개 배포 entry. `git diff --check` 통과.
- [x] 실제 Chromium에서 Home·Resume의 390×844·768×1024·1280×900 레이아웃과 가로 overflow 0을 확인했다. Resume 다운로드/미리보기 링크, Skip link의 2px focus와 Enter 본문 이동, PDF 링크의 2px focus outline, console warning/error 0을 확인했다.
- [x] Home의 기본 lite/static·full/interactive와 localhost reduced override의 flat·canvas 숨김을 확인했다. 모션 코드는 변경하지 않았으며 실물 touch 기기·OS forced-colors 전환은 별도로 검증하지 않았다.

## 2026-09-07 간결한 구현 중심 18쪽 편집

- [x] 18쪽 전체 렌더와 마지막 수정 쪽의 재렌더를 검수했다. 소개 → THING → AQIS → Briefit → MRI → Prompt → Alkkagi → 연락처 순서이며 목차의 여섯 링크는 소개 페이지 3·7·10·12·14·16쪽으로 연결된다.
- [x] 겹침 0, 외부 링크 63개·목차 링크 6개, 북마크 18개, 캡션 정렬 7개, 문단 끝줄 12개, 최소 글자 크기 9pt를 확인했다. 사진 번호 안내를 제거했고 원본 구조도 PNG 5개의 RGB·alpha·해시는 모두 일치한다. 수상 4건의 연결도 유지했다.
- [x] 독립 검토에서 THING의 개인/팀 기여·토크 순서, AQIS 정지·누락 입력 조건, Briefit 원본 부분 요약·재요약, MRI 라벨 손실·분리 평가, Prompt 오류 시 상태 변경, Alkkagi 위치·충격량·마찰 계산을 확인했다. 새 실물·모델·부하 성능을 주장하지 않는다.
- [x] 최종 PDF와 공개 사본: 15,226,870 bytes, SHA-256 `86505E93CB6408DA3859613007B888F5A79AB887188DAEA2EB84FC7005404C8A`. Resume의 18쪽·15.2MB·2026.09.07 및 바이트/해시 계약을 동기화했다.
- [x] `npm.cmd run verify` 통과: 49개 테스트, 11개 route·28개 module·12개 stylesheet 경계, production build·22개 배포 entry.
- [x] 실제 Chromium의 Resume 390×844·768×1024·1280×900에서 설명·메타정보·PDF 링크·가로 overflow 0을 확인했다. Skip link의 2px focus·Enter 본문 이동, PDF 링크의 2px focus outline과 console warning/error 0을 확인했다.
- [x] Home의 세 화면 크기에서 기본 lite/static·full/interactive와 가로 overflow 0을 확인했다. localhost reduced override는 flat·canvas 숨김이며 경고·오류는 0이다. 이번 변경은 문서·다운로드 설명이며 실물 touch·OS forced-colors는 별도 검증하지 않았다.
