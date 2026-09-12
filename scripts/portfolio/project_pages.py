"""Project summaries link to the retained engineering detail in each repository.

Describe code-supported decisions, personal ownership and validation limits;
do not infer historical incidents or measured improvements from current code.
"""
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape

W, H = landscape(A4)
M, CW = 38, W - 76
MUTED, LINE, ACCENT, TINT = map(HexColor, ['#625e56', '#d4d0c5', '#a73524', '#eeeae1'])

PROJECTS = [{'key': 'thing',
  'name': 'THING',
  'tagline': '7축 텐던 로봇 핸드',
  'period': '2026.07 - 08',
  'role': '모터 점검 · 기구 통합',
  'team': '6인 팀',
  'stack': 'DYNAMIXEL · U2D2 · Python<br/>ROS 2 · Raspberry Pi 5',
  'figure': ('@thing-video-can-0010.jpg', (0.08, 0.25, 0.95, 0.94)),
  'caption': '캔 파지 · 팀 시연',
  'summary': '손의 21개 landmark를 7축 목표로 바꿔 로봇 손을 구동합니다. 모터 점검·기구 통합을 맡았고, 비전·명령 중재·운영 드라이버는 팀 구현입니다.',
  'built': ['U2D2 기반 다축 점검·제어 도구에 초기 목표 동기화와 위치 모드별 중앙각 복귀를 구현했습니다.',
            '아크릴 고정부·모터·스풀·텐던을 조립하고, 권취 방향과 텐던·케이블 경로를 구성했습니다.'],
  'awards': [0],
  'repo': 'https://github.com/SeMinKong/THING/',
  'detail': 'docs/engineering-notes.md',
  'case': 'work/thing/',
  'troubleshooting': [('초기 목표 동기화', '이전 목표로 갑자기 움직이지 않도록, 이동 함수는 현재 위치를 목표로 기록한 뒤 토크와 새 목표를 적용합니다.'),
                      ('다회전 복귀', '다회전 좌표를 2048로 바로 보내는 대신, 현재 위치에 가장 가까운 같은 중앙각을 선택해 불필요한 회전을 줄입니다.')],
  'reflection': '중앙각 복귀만으로 손가락의 가동 범위가 보정되지는 않습니다. 장력·축별 끝점·조립 조건을 고정하고 반복 파지와 재조립 편차를 검증해야 합니다.'},
 {'key': 'aqis',
  'name': 'AQIS for Smart Factory',
  'tagline': '비전 검사·로봇 분류·웹 관제',
  'period': '2026.05 - 06',
  'role': '팀장 · 서버 · 로봇 통합',
  'team': '2인 팀',
  'stack': 'ROS 2 · FastAPI · React<br/>RealSense · YOLOv5 · Dobot',
  'figure': ('@aqis-video-inspection-0010.jpg', (0, 0, 1, 1)),
  'caption': 'RealOps · 장비 관제',
  'summary': '검출·컨베이어·Dobot·웹 관제를 통합한 스마트팩토리입니다. 팀장으로 서버와 장비 연동을 맡았고, 모델 학습·RoboDK 공정과 화면은 팀원 담당입니다.',
  'built': ['ROS 2 이벤트·로봇 상태를 FastAPI·WebSocket으로 연결하고, RealOps 관제와 Mock·실장비 adapter를 구현했습니다.',
            '정지 요청 뒤 좌표 갱신·중복 처리·Dobot 집기를 연결하고, RoboDK 명령 큐와 상태 반환을 통합했습니다.'],
  'awards': [],
  'repo': 'https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/',
  'detail': 'docs/engineering-notes.md',
  'case': 'work/aqis/',
  'troubleshooting': [('집기 좌표 갱신', '이동 중 좌표는 집기 시점에 맞지 않을 수 있습니다. 정지 요청 뒤 후속 검출을 기다려 집기 목표를 갱신합니다.'),
                      ('검출 중복 처리', 'ID·상자 겹침·중심 거리로 반복 검출을 걸러냅니다. 집기에 쓸 새 좌표를 놓치지 않도록 갱신 대기를 먼저 처리합니다.')],
  'reflection': '대기 시간과 스크립트 종료 코드는 실제 정지·파지 성공을 보장하지 않습니다. 센서 확인과 실패 차단을 연결하고 반복 성공률·사이클 시간을 검증해야 합니다.'},
 {'key': 'briefit',
  'name': 'Briefit',
  'tagline': '뉴스 수집·요약 서비스',
  'period': '2025.05 - 09',
  'role': '기사 수집 · KoBART 파이프라인',
  'team': '6인 팀 · AI 2인',
  'stack': 'Python · Crawl4AI<br/>BeautifulSoup · KoBART',
  'figure': ('briefit/cover.webp', (0, 0, 1, 1)),
  'caption': '뉴스 목록 · 팀 서비스',
  'summary': '뉴스 수집·그룹화·요약을 제공하는 팀 서비스입니다. 2025년 KoBART 기반 AI 작업을 담당했으며, 현재 팀의 GPT-OSS 경로와 구분합니다.',
  'built': ['기사와 기준 요약의 역할을 나눠 학습 입력을 구성하고, 서비스 생성과 ROUGE 평가를 별도 경로로 구현했습니다.',
            '배치 간 성공 URL 집합을 공유해 중복 저장을 막고, 실패한 저장이 성공 이력에 남지 않도록 했습니다.'],
  'awards': [1, 2, 3],
  'repo': 'https://github.com/capstone-btd/Briefit_AI/',
  'detail': 'docs/2025-kobart-implementation.md',
  'case': 'work/briefit/',
  'troubleshooting': [('입력 길이 제한', '긴 입력은 문단 묶음의 부분 요약을 연결한 뒤 재요약합니다. 긴 단일 문단과 재요약 입력의 잘림은 남습니다.'),
                      ('불완전·반복 문장', '짧은 끝 문장과 직전 문장 반복을 규칙으로 제거합니다. 정상 문장도 삭제될 수 있어 정보 손실을 함께 확인해야 합니다.')],
  'reflection': '서비스 생성과 ROUGE 평가는 조건이 달라 점수만으로 최종 품질을 설명하기 어렵습니다. 같은 입력에서 후처리 전후의 반복·정보 손실을 비교해야 합니다.'},
 {'key': 'mri',
  'name': 'Brain Tumor MRI',
  'tagline': 'MRI 분류·종양 영역 시각화',
  'period': '2026.02 - 04',
  'role': '전처리 · 학습 · 추론 · 웹 데모',
  'team': '개인 프로젝트',
  'stack': 'Python · PyTorch<br/>Ultralytics YOLO11 · OpenCV',
  'figure': ('@mri-video-overlay-007733.png',
             (0.3606060606060606, 0.18895348837209303, 0.921969696969697, 0.7897286821705426)),
  'caption': '분류·분할 통합 추론',
  'summary': '독립된 분류·분할 모델의 결과를 한 화면에 표시하는 개인 프로젝트입니다. 데이터 전처리, 학습·추론 스크립트와 웹 데모를 구현했습니다.',
  'built': ['픽셀 마스크를 정제하고 외부 윤곽을 정규화된 다각형으로 변환해 YOLO 분할 학습에 연결했습니다.',
            '분류·분할의 학습과 가중치를 분리하고, 같은 이미지의 클래스·확률·분할 영역을 통합 추론에서 함께 표시했습니다.'],
  'awards': [],
  'repo': 'https://github.com/SeMinKong/BrainMRISegmentation_YOLO/',
  'detail': 'DETAILS.md',
  'case': 'work/brain-tumor-mri/',
  'troubleshooting': [('윤곽 정제', '형태학 연산과 면적·점 수 필터로 작은 윤곽을 거릅니다. 작은 영역과 내부 구멍이 손실될 수 있어 변환 전후 확인이 필요합니다.'),
                      ('모델 출력 불일치', '분류와 분할 결과를 함께 표시해 판단 차이를 드러냅니다. no_tumor여도 분할을 실행하며 불일치를 자동 보정하지 않습니다.')],
  'reflection': 'test가 학습 중 validation에도 사용되며 환자 단위 독립성은 미확인입니다. 별도 평가셋 분리와 가중치·로그 보존이 필요합니다. 임상 성능은 검증하지 않았습니다.'},
 {'key': 'prompt',
  'name': 'Project Prompt Generator',
  'tagline': '영역별 대화·설계 문서 생성',
  'period': '2026',
  'role': '대화 서버 · 상태 관리 · 웹 UI',
  'team': '개인 프로젝트',
  'stack': 'Python · FastAPI · WebSocket<br/>LangChain · Solar Pro',
  'figure': ('@prompt-design-flow.png', (0, 0, 1, 1)),
  'caption': '영역별 대화 · 초기 설계',
  'summary': 'UI·구조·DB·API·배포·테스트의 대화를 분리하고 결과를 Markdown 문서로 합성합니다. 서버·웹 UI·영역별 상태와 LLM 호출을 구현했습니다.',
  'built': ['프로젝트 설명을 공유하고 영역별 이력·라운드·결과를 분리해 호출 문맥과 수정 범위를 관리했습니다.',
            '초기 질문의 병렬 실행, 동기 LLM 호출의 별도 스레드 처리, 저장된 영역별 결과의 부분 합성을 구현했습니다.'],
  'awards': [],
  'repo': 'https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/',
  'detail': 'DETAILS.md',
  'case': 'work/project-prompt-generator/',
  'troubleshooting': [('완료 판정', '3라운드 이상과 생성 태그를 함께 확인합니다. 조건이 없는 정상 응답은 진행 상태를 유지하며, 3회가 대화 상한은 아닙니다.'),
                      ('실패 턴 복원', '처리 대상 오류에서 라운드를 되돌리고 pending으로 전환합니다. 이력은 성공 뒤 기록하며 이전 생성 결과는 남습니다.')],
  'reflection': '완료 조건만으로 결과 품질을 판단할 수는 없습니다. 세션은 연결 종료 시 삭제됩니다. 요구사항 반영률 평가와 세션·결과 복구 정책을 보완해야 합니다.'},
 {'key': 'alkkagi',
  'name': 'Alkkagi.io',
  'tagline': '실시간 멀티플레이 알까기',
  'period': '2026.03 - 04',
  'role': '웹 UI · 통신 · 서버 물리',
  'team': '개인 프로젝트',
  'stack': 'React · TypeScript · Node.js<br/>Express · Socket.IO',
  'figure': ('@alkkagi-video-aim-0007.png', (0, 0, 1, 1)),
  'caption': '드래그 조준 · 실제 플레이',
  'summary': '돌을 튕겨 상대를 보드 밖으로 밀어내는 웹 대전 게임입니다. 클라이언트는 입력·렌더링을 맡고 서버가 위치·속도·충돌·득점의 기준 상태를 계산합니다.',
  'built': ['서버에서 소유 관계·입력 간격·속도 상한·질량을 적용하고, 모든 플레이어에게 판정의 기준 상태를 전달했습니다.',
            '이동·충돌·마찰·득점과 반경·질량 성장, 보드 이탈 뒤 재배치를 서버의 단일 상태 갱신에 통합했습니다.'],
  'awards': [],
  'repo': 'https://github.com/SeMinKong/Alkkagi/',
  'detail': 'DETAILS.md',
  'case': 'work/alkkagi/',
  'troubleshooting': [('겹침·충격량 분리', '겹친 위치를 절반씩 나눠 보정한 뒤 접근하는 돌에만 충격량을 적용합니다. 이미 멀어지는 돌에는 추가 반응을 주지 않습니다.'),
                      ('소단계 감속 보정', '단계마다 0.8**0.1을 적용합니다. 충돌·정지·재배치가 없을 때 10회 후 0.8배를 유지해 과도한 감속을 피합니다.')],
  'reflection': '60Hz는 타이머 설정이며 지속 FPS·지연·동시 접속 성능은 미측정입니다. 물리 회귀·부하 시험이 필요하며, 재접속 상태 복구는 아직 구현하지 않았습니다.'}]


def project_page(b, spec, web, awards):
    b.start(spec['name'], spec['tagline'], key=spec['key'])
    for i, (label, body) in enumerate([('기간', spec['period']), ('역할', spec['role']),
                                     ('팀', spec['team']), ('기술 스택', spec['stack'])]):
        x = M + i * 192
        b.para(label, x, 118, 176, 9.5, 14, MUTED, bold=True)
        b.para(body, x, 138, 176, 10, 15, keep_words=True)
    b.rule(178)

    figure, region = spec['figure']
    b.image(figure, M, 193, 290, 178, region=region, caption=spec['caption'],
            caption_size=10.2, caption_leading=15, caption_gap=10, align_bottom=True)
    b.rule(415, M, 290, LINE, .7)
    b.para('회고', M, 429, 290, 13, 20, bold=True)
    b.para(spec['reflection'], M, 457, 290, 10.2, 16, MUTED, keep_words=True)

    b.para(spec['summary'], 354, 193, 449, 10.6, 17, keep_words=True)
    b.para('직접 맡은 구현', 354, 258, 449, 13, 20, bold=True)
    top = 287
    for item in spec['built']:
        top = b.para('· ' + item, 354, top, 449, 10.2, 15.5, keep_words=True) + 7
    if top > 363:
        raise ValueError(f"{spec['key']}: contribution copy needs editing ({top})")

    b.rule(372, 354, 449, LINE, .7)
    b.para('트러블슈팅', 354, 385, 449, 13, 20, bold=True)
    for i, (title, body) in enumerate(spec['troubleshooting']):
        x = 354 + i * 233
        b.para(title, x, 416, 216, 10.5, 16, bold=True)
        b.para(body, x, 439, 216, 10.2, 15.5, MUTED, keep_words=True)
    footer(b, spec, web, awards)


def footer(b, spec, web, awards):
    titles = ['SSAFY 공통 프로젝트 우수상', 'SW 공모전 금상',
              '캡스톤디자인 장려상', 'IT 프로젝트 프로리그 장려상']
    if spec['awards']:
        b.link_row([(titles[index], web + 'resume/' + awards[index][3])
                    for index in spec['awards']], 521, size=10, gap=30)
    b.rule(540)
    links = [('README', spec['repo'] + 'blob/main/README.md'),
             ('기술 문서', spec['repo'] + 'blob/main/' + spec['detail']),
             ('프로젝트 시연', web + spec['case'])]
    for i, (label, url) in enumerate(links):
        b.center_link(label, url, M + CW * (i + .5) / 3, 549, 10.2, limit=H - 20)
    b.end(rule_top=None)
