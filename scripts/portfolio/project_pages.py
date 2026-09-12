"""Project summaries link to the retained engineering detail in each repository.

Describe code-supported decisions, personal ownership and validation limits;
do not infer historical incidents or measured improvements from current code.
"""
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape

W, H = landscape(A4)
M, CW = 38, W - 76
MUTED, LINE, ACCENT, TINT = map(HexColor, ['#625e56', '#d4d0c5', '#a73524', '#eeeae1'])

PROJECTS = [
    dict(
        key='thing', name='THING', tagline='손동작을 따라 움직이는 7축 텐던 로봇 핸드',
        period='2026.07 - 08', role='모터 점검 · 기구 통합', team='6인 팀',
        stack='DYNAMIXEL · U2D2 · Python<br/>ROS 2 · Raspberry Pi 5',
        figure=('@thing-video-can-0010.jpg', (.08, .25, .95, .94)),
        caption='실물 캔 파지 시연 · 팀 결과물',
        summary='21개 손 landmark를 7축 목표값으로 바꿔 로봇 손을 구동합니다. 저는 모터 통신·점검 도구와 아크릴 마운트, 스풀·텐던 조립을 담당했습니다.',
        built=[
            'U2D2 통신 환경과 XL330 7개 모터의 개별·전체 점검, 키보드 조작 도구를 작성했습니다.',
            '이동 명령에 현재 위치 읽기 → 목표값 기록 → 토크 ON 순서, 가까운 중앙각 복귀와 Torque OFF를 구현했습니다.',
            '아크릴 전완부 마운트를 제작하고 스풀·텐던을 조립해 모터와 손가락 구동부를 연결했습니다.',
        ],
        decisions=[
            ('이동 명령의 목표 동기화', '이동 명령은 토크 ON 전에 현재 위치를 목표값으로 기록합니다. 중앙각 복귀와 축별 끝점 보정은 구분합니다.'),
            ('통신과 실제 자세를 따로 확인', '모터 응답 외에 장력·권취 방향·조립 상태를 확인합니다. 비전·명령 중재·운영 드라이버는 팀 구현입니다.'),
        ],
        scope='실물 모방·파지 시연을 남겼습니다. 반복 파지 성공률은 공개 기록에서 확인되지 않으며, 중앙각 복귀만으로 가동 범위가 보정되지는 않습니다. 축별 보정과 반복 시험이 후속 과제입니다.',
        awards=[0], repo='https://github.com/SeMinKong/THING/', detail='docs/engineering-notes.md', case='work/thing/',
    ),
    dict(
        key='aqis', name='AQIS for Smart Factory', tagline='품질 검사 · 로봇 분류 · 웹 관제를 연결한 스마트팩토리',
        period='2026.05 - 06', role='팀장 · 서버 · 로봇 통합', team='2인 팀',
        stack='ROS 2 · FastAPI · React<br/>RealSense · YOLOv5 · Dobot',
        figure=('@aqis-video-inspection-0010.jpg', (0, 0, 1, 1)), caption='RealOps 관제 화면 · 실제 장비 시연',
        summary='RealSense와 YOLO 검출을 컨베이어·Dobot 제어와 관제로 연결합니다. 팀장으로 RealOps, FastAPI, ROS bridge와 장비 연동을 담당했습니다.',
        built=[
            'ROS 콜백에서 만든 이벤트를 asyncio로 전달하고 검출·장비 상태를 REST와 WebSocket으로 웹에 연결했습니다.',
            '공통 API 아래 Mock·실장비 adapter, 정지 요청 뒤 검출 갱신·중복 처리·집기 좌표 변환을 구현했습니다.',
            'RoboDK 명령 큐·상태 반환, TurtleBot 위치·지도 갱신 시각, Dobot 관절 관제를 서버에 통합했습니다.',
        ],
        decisions=[
            ('집기 전에 검출 좌표 갱신', '이동 중 좌표를 그대로 쓰지 않도록 정지 요청 뒤 후속 검출을 기다립니다. 갱신 대기는 중복 판정보다 먼저 처리합니다.'),
            ('장비 연결과 공정 흐름 분리', '장비 접근이 제한된 초기 계획에 맞춰 Mock과 공통 API를 사용합니다. RoboDK 공정·화면과 모델 학습은 팀원 담당입니다.'),
        ],
        scope='실제 검사·분류, RoboDK 가상 공정, SLAM·관제 시연을 구분합니다. 정지·파지 성공을 센서로 확정하지 않으며, 반복 성공률·사이클 시간·Nav2 자동 임무는 추가 검증 대상입니다.',
        awards=[], repo='https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/', detail='docs/engineering-notes.md', case='work/aqis/',
    ),
    dict(
        key='briefit', name='Briefit', tagline='여러 매체의 뉴스를 수집하고 묶어 요약하는 서비스',
        period='2025.05 - 09', role='기사 수집 · KoBART 파이프라인', team='6인 팀 · AI 2인',
        stack='Python · Crawl4AI<br/>BeautifulSoup · KoBART',
        figure=('briefit/cover.webp', (0, 0, 1, 1)), caption='뉴스 목록과 요약 화면 · 팀 서비스',
        summary='뉴스를 수집하고 관련 기사를 묶어 핵심을 보여주는 팀 서비스입니다. 2025년 AI 작업에서 본문 정제, KoBART 학습·생성·평가 스크립트와 후처리를 담당했습니다.',
        built=[
            '기사 URL·본문 선택자를 적용하고 저장 성공 URL을 공유 집합에 모아 실행 내 배치 간 중복을 막았습니다.',
            '기사·정답 요약을 encoder 입력과 decoder labels로 바꾸고 학습·생성·ROUGE 평가 경로를 구성했습니다.',
            '긴 입력의 부분 요약 → 재요약과 생성문 끝의 짧은 문장·직전 문장 반복을 정리하는 후처리를 작성했습니다.',
        ],
        decisions=[
            ('긴 입력은 부분 요약 후 재요약', '문단 묶음을 나눠 처리합니다. 긴 단일 문단과 재요약에서도 입력 잘림이 남아 전체 문맥 보존을 보장하지 않습니다.'),
            ('생성과 평가 경로 구분', 'ROUGE 평가와 서비스 후처리는 별도 경로입니다. 규칙이 정상 문장도 지울 수 있어 평가 점수와 후처리 효과를 구분합니다.'),
        ],
        scope='수집·학습·요약 코드와 팀 서비스 화면을 제시합니다. 학습 완료·품질 향상 수치를 새로 주장하지 않습니다. 당시 KoBART 기여는 현재 팀 저장소의 GPT-OSS 경로와 구분합니다.',
        awards=[1, 2, 3], repo='https://github.com/capstone-btd/Briefit_AI/', detail='docs/2025-kobart-implementation.md', case='work/briefit/',
    ),
    dict(
        key='mri', name='Brain Tumor MRI', tagline='MRI 분류 결과와 종양 영역을 함께 보여주는 모델 데모',
        period='2026.02 - 04', role='전처리 · 학습 · 추론 · 웹 데모', team='개인 프로젝트',
        stack='Python · PyTorch<br/>Ultralytics YOLO11 · OpenCV',
        figure=('@mri-video-overlay-007733.png', (476/1320, 195/1032, 1217/1320, 815/1032)),
        caption='분류 문구와 segmentation overlay를 합성한 결과',
        summary='같은 MRI를 독립된 분류·분할 모델에 입력하고 4개 클래스 판정과 영역을 한 화면에 표시합니다. 전처리부터 학습·추론 스크립트와 웹 데모를 구현했습니다.',
        built=[
            '마스크를 이진화·형태학 처리한 뒤 외부 윤곽을 정규화된 YOLO polygon 라벨로 변환했습니다.',
            '분류·분할 학습 함수와 가중치를 분리하고 한 이미지를 두 모델에 순차 입력하는 통합 추론을 작성했습니다.',
            '분류 top-1 클래스·확률을 분할 overlay에 합성해 두 출력을 함께 대조할 수 있도록 구성했습니다.',
        ],
        decisions=[
            ('라벨 정제의 손실까지 설명', '5×5 closing·opening과 면적·점 수 필터를 적용합니다. 작은 병변·내부 구멍이 사라질 수 있고 해상도에도 영향을 받습니다.'),
            ('두 모델의 출력은 독립적으로', '분류가 no_tumor여도 분할을 실행합니다. 한쪽 결과로 다른 모델을 건너뛰거나 출력 불일치를 자동 보정하지 않습니다.'),
        ],
        scope='전처리 코드와 통합 추론 시연을 제시합니다. 학습 시 test를 validation으로 사용하며 환자 단위 독립성은 미확인입니다. 보고된 점수를 독립 테스트 성능으로 제시하지 않고, 임상 진단 검증은 수행하지 않았습니다.',
        awards=[], repo='https://github.com/SeMinKong/BrainMRISegmentation_YOLO/', detail='DETAILS.md', case='work/brain-tumor-mri/',
    ),
    dict(
        key='prompt', name='Project Prompt Generator', tagline='여섯 설계 영역의 대화를 하나의 프로젝트 문서로',
        period='2026', role='대화 서버 · 상태 관리 · 웹 UI', team='개인 프로젝트',
        stack='Python · FastAPI · WebSocket<br/>LangChain · Solar Pro',
        figure=('@prompt-design-flow.png', (0, 0, 1, 1)), caption='여섯 설계 영역의 대화 흐름 · 초기 설계 자료',
        summary='UI·구조·DB·API·배포·테스트의 질문과 답변을 따로 관리하고 저장된 결과를 Markdown 문서로 모읍니다. 서버·웹 UI·영역별 상태와 LLM 호출을 구현했습니다.',
        built=[
            '영역 지침·프로젝트 설명·해당 이력을 조립하고 초기 질문은 asyncio.gather로 병렬 생성합니다.',
            'LLM 호출을 to_thread로 분리하고 라운드·이력·결과와 pending/in_progress/completed 상태를 관리합니다.',
            '결과가 저장된 영역과 프로젝트 설명을 별도 호출로 합성하고 WebSocket으로 최종 문서를 전달합니다.',
        ],
        decisions=[
            ('라운드와 태그로 완료 판정', '3라운드 이상이며 [GENERATE_PROMPT] 태그가 있을 때 결과를 저장합니다. 3회는 대화 상한이나 생성 품질 기준이 아닙니다.'),
            ('성공 뒤 기록 · 일부 결과 합성', '처리 대상 오류는 라운드와 대기 상태를 복구합니다. 결과가 하나 이상이면 합성하며 모든 영역의 완료를 요구하지 않습니다.'),
        ],
        scope='영역별 대화·문서 생성 구조를 구현했습니다. 공개 실행 코드의 상태 관리는 직접 작성한 로직입니다. 세션은 연결 종료 시 삭제되며 재접속 복구·생성 품질·생산성 평가는 후속 과제입니다.',
        awards=[], repo='https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/', detail='DETAILS.md', case='work/project-prompt-generator/',
    ),
    dict(
        key='alkkagi', name='Alkkagi.io', tagline='서버에서 움직임과 충돌을 판정하는 실시간 알까기',
        period='2026.03 - 04', role='웹 UI · 통신 · 서버 물리', team='개인 프로젝트',
        stack='React · TypeScript · Node.js<br/>Express · Socket.IO',
        figure=('@alkkagi-video-aim-0007.png', (0, 0, 1, 1)), caption='드래그 조준 화면 · 실제 플레이',
        summary='돌을 튕겨 상대를 보드 밖으로 밀어내는 웹 대전 게임입니다. 클라이언트는 입력·렌더링을 맡고 서버가 위치·속도·충돌·득점의 기준 상태를 계산합니다.',
        built=[
            'React 조준 UI에서 flick 입력을 보내고 서버에서 소유자·500ms 간격·속도 상한을 검사합니다.',
            '서버 메모리의 상태를 10개 물리 소단계로 갱신하고 gameStateUpdate로 전체 상태를 전달합니다.',
            '겹침 보정·충격량·마찰·정지, 보드 이탈 득점·재배치, 반경·질량 성장 규칙을 TypeScript로 구현했습니다.',
        ],
        decisions=[
            ('위치 보정과 충격량 분리', '겹친 거리는 두 돌에 절반씩 나눠 보정합니다. 이미 멀어지면 충격량을 더하지 않고 접근 시 역질량·반발계수를 적용합니다.'),
            ('소단계의 감속 비율 유지', '각 단계에 0.8**0.1을 곱합니다. 충돌·정지·재배치가 없으면 10회 후 0.8배가 되어 분할에 따른 중복 감속을 피합니다.'),
        ],
        scope='입력·서버 물리·상태 공유를 실제 플레이로 보여줍니다. 60Hz는 타이머 설정이며 지속 FPS·지연·동시 접속 성능은 미측정입니다. 재접속 및 서버 재시작 뒤 상태 복구는 구현 범위 밖입니다.',
        awards=[], repo='https://github.com/SeMinKong/Alkkagi/', detail='DETAILS.md', case='work/alkkagi/',
    ),
]


def project_page(b, spec, web, awards):
    b.start(spec['name'], spec['tagline'], key=spec['key'])
    for i, (label, body) in enumerate([('기간', spec['period']), ('역할', spec['role']),
                                     ('팀', spec['team']), ('기술 스택', spec['stack'])]):
        x = M + i * 192
        b.label(label, x, 128)
        b.para(body, x, 147, 176, 9.4, 14, keep_words=True)
    b.rule(184)
    figure, region = spec['figure']
    b.image(figure, M, 198, 290, 180, region=region, caption=spec['caption'],
            caption_size=9, caption_leading=13.5, caption_gap=10)
    b.rule(410, M, 290, ACCENT, 1.1)
    b.para('결과와 검증 범위', M, 424, 290, 11.4, 17, bold=True)
    b.para(spec['scope'], M, 451, 290, 9.4, 14.5, MUTED, keep_words=True)
    b.para(spec['summary'], 354, 198, 449, 10.2, 16, keep_words=True)
    b.para('직접 맡은 구현', 354, 271, 449, 11.4, 17, bold=True)
    top = 296
    for item in spec['built']:
        top = b.para('· ' + item, 354, top, 449, 9.4, 14, keep_words=True) + 4
    if top > 399:
        raise ValueError(f"{spec['key']}: contribution copy needs editing ({top})")
    b.rule(408, 354, 449)
    for i, (title, body) in enumerate(spec['decisions']):
        x = 354 + i * 233
        end = b.para(title, x, 424, 216, 10.2, 15, bold=True) + 9
        b.para(body, x, end, 216, 9.3, 14, MUTED, keep_words=True)
    footer(b, spec, web, awards)


def footer(b, spec, web, awards):
    b.c.setFillColor(TINT)
    b.c.rect(M, H - 582, CW, 46, fill=1, stroke=0)
    b.c.setFillColor(ACCENT)
    b.c.rect(M, H - 582, 3, 46, fill=1, stroke=0)
    titles = ['SSAFY 공통 프로젝트 우수상', 'IT대학 SW 공모전 금상',
              '숭실 캡스톤디자인 경진대회 장려상', 'IT 프로젝트 프로리그 장려상']
    x = 54
    for i, index in enumerate(spec['awards']):
        if i:
            b.text('·', x, 540, 9, 'Korean', MUTED, limit=H)
            x += 10
        x += b.link(titles[index], web + 'resume/' + awards[index][3], x, 540, 9, limit=H) + 10
    links = [('GitHub · README →', spec['repo'] + 'blob/main/README.md'),
             ('구현 상세 · 계산과 흐름 →', spec['repo'] + 'blob/main/' + spec['detail']),
             ('웹 · 프로젝트 시연 →', web + spec['case'])]
    for x, (label, url) in zip([54, 291, 572], links):
        b.link(label, url, x, 561, 10, limit=H)
    b.end(rule_top=None)
