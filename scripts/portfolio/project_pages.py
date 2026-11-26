"""Project summaries link to the retained engineering detail in each repository.

Describe code-supported decisions, personal ownership and validation limits;
do not infer historical incidents or measured improvements from current code.
"""
import json
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph

import visual_components as vc

W, H = landscape(A4)
M, CW = 40, W - 80
# Exact Golden Ratio split (Minor 278 : Major 449.89 = 1 : 1.6183, gutter 34pt)
LEFT_WIDTH = 278
RIGHT_X = M + LEFT_WIDTH + 34
RIGHT_WIDTH = W - M - RIGHT_X
BODY_SIZE, BODY_LEADING = 10.0, 15.0
CONTENT_TOP, CONTENT_BOTTOM = 128, 520
MUTED, LINE, ACCENT, TINT = map(HexColor, ['#625e56', '#d4d0c5', '#a73524', '#eeeae1'])

PROJECTS = [
 {'key': 'tac-touch',
  'name': 'Tac-Touch',
  'tagline': '손끝 촉각 신호를 실시간 진단하는 그리퍼 모니터링',
  'period': '2026.10 - 11',
  'role': '센서 수집 펌웨어 · PC 앱 MCP 연동',
  'team': '6인 팀',
  'stack': '촉각 센서 · MCU 펌웨어 · 3D 기구 편집 · MCP',
  'figure': ('tac-touch/dashboard.webp', (0, 0, 1, 1)),
  'caption': '테스트 센서 입력으로 손끝 움직임을 표시한 PC 앱 화면',
  'award_label': 'SSAFY 자율프로젝트 1등',
  'awards': [],
  'case': 'work/tac-touch/',
  'schematic': {
      'short_summary': '로봇 손끝의 미세 촉각 변화로 물체 미끄러짐을 감지하고, 3D 그리퍼와 함께 진단하는 PC 앱입니다.',
      'short_reflection': '하드웨어 연동은 단순 수집보다 ‘신뢰할 신호 판별’이 우선임을 체감했습니다. 실물 보드–PC 채널을 직접 검증했고(시연은 테스트 입력 기준), 오류에 강한 설계 기준을 세웠습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('cpu', False, '센서 · MCU', '상태·측정값 분리'),
                  ('arrow-left-right', True, '보드–PC 검증', '동시점 신호 대조'),
                  ('sliders-horizontal', False, 'MCP 편집', '지정 축 각도 제어'),
                  ('monitor', False, 'PC 3D 앱', '유효 채널·파일 반영'),
              ], 19.0, 12.0),
              ('checks', [
                  ('cpu', '촉각 수집 펌웨어', '채널별 읽기 상태와 직전 정상값을 분리 저장하고, 재시도·통계로 복구 후 재갱신을 검증'),
                  ('terminal', 'PC 앱 MCP 연동', 'AI 도구가 선택 기구를 읽어 지정 축 각도만 수정·별도 저장 후 3D 화면에 즉시 반영'),
              ], 106.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '원인 · 한계', '해결 전략 · 검증'), [
                  ('circle-x', '#a73524', '정지(0) vs 실패', '두 상태 모두 0 표시', '상태·수치 분리 및 동시점 대조로 <b>유효 채널만 반영</b>'),
                  ('file-check', '#171512', '수정·열기 검증', '거리 변형·실패 혼재', '재독으로 <b>장착 거리 유지 검증</b> · 저장/열기 응답 분리'),
              ], [116.0, 108.0, RIGHT_WIDTH - 224.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          '센서 · MCU', '보드–PC 검증', 'MCP 편집', 'PC 3D 앱',
          '촉각 수집 펌웨어', 'PC 앱 MCP 연동', '유효 채널만 반영', '장착 거리 유지 검증', '저장/열기 응답 분리',
      ],
  }},
 {'key': 'bondi',
  'name': 'Bondi',
  'tagline': 'AI 복원 유물을 직접 만지며 비교하는 VR 박물관',
  'period': '2026년 · 4주',
  'role': '토기 AI 복원 실험 · VR 전시장 · 손 추적',
  'team': '7인 팀',
  'stack': 'TRELLIS · AdaPoinTr · Blender · Unreal Engine · OpenXR',
  'figure': ('bondi/exhibit.webp', (0, 0, 1, 1)),
  'caption': '본디 VR 전시의 손 조작 안내와 빗살무늬토기 좌대',
  'award_label': 'SSAFY 특화프로젝트 2등',
  'awards': [],
  'case': 'work/bondi/',
  'schematic': {
      'short_summary': '파손된 빗살무늬토기를 3D 점군 모델로 복원하고, 관람자가 손으로 집어 원본과 전후 비교하는 VR 전시입니다.',
      'short_reflection': '단일 사진 기반 복원의 추정 한계를 숨기기보다, 원본 자료와 AI 추정 범위를 전시에 함께 드러내 관람자가 스스로 비교·판단할 수 있는 신뢰 중심 UX를 설계했습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('image', False, '단일 사진', '2D 원본 입력'),
                  ('box', False, 'TRELLIS', '초기 3D 메시 생성'),
                  ('sparkles', True, 'AdaPoinTr', '점군 정규화·결손 복원'),
                  ('boxes', False, 'Unreal VR', '전시실·OpenXR 조작'),
              ], 19.0, 12.0),
              ('checks', [
                  ('hand', 'OpenXR 손 조작', '검지 버튼으로 손상/복원 모델을 전환하고, 엄지·검지 파지·회전 및 원위치 복귀 구현'),
                  ('layers', '전시 공간·비교', 'Blender로 메인 홀·전시실과 좌대를 제작해 Unreal Engine 동일 위치 비교 구현'),
              ], 106.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '원인 · 한계', '해결 전략 · 성과'), [
                  ('rotate-cw', '#171512', '전후 정렬 오차', '손상·복원 축·배율 불일치', '전환 시 <b>회전·크기 동시 보정</b>으로 동일 위치 정합'),
                  ('move', '#a73524', '포털 이동 이탈', '실제 보행 좌표 누적', '암전 시 기준 재설정 · Quest 2 <b>369cm → 13cm</b>'),
              ], [116.0, 114.0, RIGHT_WIDTH - 230.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          'TRELLIS', 'AdaPoinTr', 'Unreal VR', 'OpenXR 손 조작', 'Blender',
          '회전·크기 동시 보정', 'Quest 2', '369cm → 13cm',
      ],
  }},
 {'key': 'thing',
  'name': 'THING',
  'tagline': '사람 손동작을 실시간 모방하는 7축 텐던 로봇 핸드',
  'period': '2026.07 - 08',
  'role': '모터 점검 · 기구 통합',
  'team': '6인 팀',
  'stack': 'DYNAMIXEL · U2D2 · Python<br/>ROS 2 · Raspberry Pi 5',
  'figure': ('@thing-video-can-0010.jpg', (0.08, 0.25, 0.95, 0.94)),
  'caption': '캔 파지 · 팀 시연',
  'awards': [0],
  'repo': 'https://github.com/SeMinKong/THING/',
  'detail': 'docs/engineering-notes.md',
  'case': 'work/thing/',
  'schematic': {
      'short_summary': '카메라로 추출한 21개 손 랜드마크를 7축 텐던 구동으로 연결해 실시간 모방과 물체 파지를 구현한 로봇 손입니다.',
      'short_reflection': '기구·모터·통신을 직접 맞물려 보며 소프트웨어만으로는 풀기 어려운 물리적 제약(장력·통신 주기)을 체득했습니다. 이를 바탕으로 시뮬레이션과 실제 제어를 잇는 역량을 키우고 있습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('hand', False, '관절 기구', 'Blender · 3D 프린팅'),
                  ('network', False, 'ROS 브릿지', '명령 변환 · Cyclone DDS'),
                  ('cable', True, 'U2D2 제어', '7축 동기 · 키보드 점검'),
                  ('cog', False, 'DYNAMIXEL', '7축 텐던 핸드 구동'),
              ], 19.0, 12.0),
              ('checks', [
                  ('box', '관절 기구 제작', 'Blender로 인체 손 관절 구조를 직접 설계·3D 프린팅하고 텐던 구동계를 조립 통합'),
                  ('cpu', '7축 동기·브릿지', 'DYNAMIXEL 7축 제어값·U2D2 통신을 구축해 ROS 명령을 실시간 구동으로 연결'),
              ], 106.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '원인 · 한계', '해결 전략 · 적용'), [
                  ('sliders-horizontal', '#171512', '모터 제어 한계', '기구별 허용 범위 차이', 'SDK <b>전류·토크·회전 범위·모드</b> 비교 후 맞춤 튜닝'),
                  ('git-branch', '#a73524', '복귀 동작 미흡', '굽힘 위주 구동 구조', '관절 힘 작용점 재계산 · <b>장력 기반 복귀</b> 구조 개선'),
                  ('radio', '#171512', '제어 주기 지연', '기본 통신 전달 지연', 'ROS 통신 설정 최적화 · <b>Cyclone DDS</b>로 응답성 확보'),
              ], [116.0, 108.0, RIGHT_WIDTH - 224.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          '관절 기구', 'ROS 브릿지', 'U2D2 제어', 'DYNAMIXEL',
          'Blender', '전류·토크·회전 범위·모드', '장력 기반 복귀', 'Cyclone DDS',
      ],
  }},
 {'key': 'aqis',
  'name': 'AQIS for Smart Factory',
  'tagline': '비전 검사·로봇 분류·자율주행 통합 스마트 팩토리',
  'period': '2026.05 - 06',
  'role': '팀장 · 서버 · 로봇 통합',
  'team': '2인 팀',
  'stack': 'ROS 2 · FastAPI · React<br/>RealSense · YOLOv5 · Dobot',
  'figure': ('@aqis-video-inspection-0010.jpg', (0, 0, 1, 1)),
  'caption': 'RealOps · 장비 관제',
  'awards': [],
  'repo': 'https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/',
  'detail': 'docs/engineering-notes.md',
  'case': 'work/aqis/',
  'schematic': {
      'short_summary': '불량 뚜껑 검출부터 Dobot 분류, TurtleBot3 자율주행, 실시간 웹 관제까지 하나의 ROS 공정으로 통합했습니다.',
      'short_reflection': '다중 장비 공정은 개별 기능보다 영상·통신·로봇 주기를 하나의 흐름으로 조율하는 설계가 핵심임을 배웠습니다. 향후 VLM 행동 계획과 직접 경로 제어로 확장할 계획입니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('camera', False, 'RealSense', '뚜껑 1,000장 (7:3)'),
                  ('scan-search', True, 'YOLO 검출', '불량 판별 · 좌표 갱신'),
                  ('bot', False, 'Dobot · TB3', '분류 · SLAM 자율주행'),
                  ('monitor', False, '웹 관제', '상태·MJPEG 경로 분리'),
              ], 19.0, 12.0),
              ('checks', [
                  ('database', '팀장 · ROS 통합', 'Dobot·RealSense·TB3·컨베이어 단일 ROS 통합 및 뚜껑 1,000장(7:3) YOLO 학습'),
                  ('navigation', '관제 · 자율주행', '영상·상태 분리 웹 관제를 구현하고, ROS 패키지 기반 SLAM 지정 위치 자율주행 구성'),
              ], 106.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '원인 · 한계', '해결 전략 · 성과'), [
                  ('gauge', '#a73524', '영상 전송 병목', 'WS 통합 전송 시 지연', '별도 포트 MJPEG 서버 분리 · <b>4 FPS → 30 FPS</b> 개선'),
                  ('layers', '#171512', '시뮬·실물 통합', '직접 동기화 결합 과다', '실행 환경 분리 · <b>공통 데이터·명령</b>으로 동일 공정'),
                  ('crosshair', '#171512', '이동 물체 집기', '고정 좌표 오차 발생', '검출 좌표 연동 · <b>1초 주기 추론</b>으로 시점 차 축소'),
              ], [116.0, 108.0, RIGHT_WIDTH - 224.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          'RealSense', 'YOLO 검출', 'Dobot · TB3', '웹 관제', '1,000장',
          'SLAM', '4 FPS → 30 FPS', '공통 데이터·명령', '1초 주기 추론',
      ],
  }},
 {'key': 'briefit',
  'name': 'Briefit',
  'tagline': '이슈별 뉴스 클러스터링·핵심 요약 서비스',
  'period': '2025.05 - 09',
  'role': '기사 수집 · KoBART 파이프라인',
  'team': '6인 팀 · AI 2인',
  'stack': 'Python · Crawl4AI<br/>BeautifulSoup · KoBART',
  'figure': ('briefit/cover.webp', (0, 0, 1, 1)),
  'caption': '뉴스 목록 · 팀 서비스',
  'awards': [1, 2, 3],
  'repo': 'https://github.com/capstone-btd/Briefit_AI/',
  'detail': 'docs/2025-kobart-implementation.md',
  'case': 'work/briefit/',
  'schematic': {
      'short_summary': '뉴스 수집·정제부터 요약 모델 파인튜닝, 정량 평가와 API 하이브리드 보완까지 요약 파이프라인 전반을 주도했습니다.',
      'short_reflection': '정량 점수(ROUGE)와 사용자 체감 품질의 간극을 확인했습니다. 모델 학습에 머물지 않고 서비스 기준에 맞춰 하이브리드 보완과 후처리로 품질을 끝까지 책임지는 관점을 익혔습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('globe', False, 'Crawl4AI', '네이버 뉴스 약 4,000건'),
                  ('funnel', False, '데이터 정제', '본문 선별 · 약 3,000건'),
                  ('sparkles', True, '요약 학습', 'KoBART · T5 비교'),
                  ('file-text', False, '서비스 요약', 'ROUGE · API 보완'),
              ], 19.0, 12.0),
              ('checks', [
                  ('funnel', '수집·정제 설계', 'Crawl4AI로 약 4,000건을 수집해 URL 분리·태그·단문 제거로 학습 데이터 정제'),
                  ('chart-column', '모델 학습·평가', '정제 약 3,000건으로 KoBART를 학습하고 T5와 <b>ROUGE-1 · ROUGE-2</b> 정량 비교'),
              ], 106.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '원인 · 한계', '해결 전략 · 판단'), [
                  ('sparkles', '#a73524', '체감 품질 한계', '소규모 학습 단독 제약', '서비스 완성도 기준 <b>Gemini API 하이브리드</b> 보완'),
                  ('scissors', '#171512', '장문 입력 초과', '모델 최대 토큰 제한', '문단 묶음 <b>분할 요약 → 재요약</b> (장문 절단 인지)'),
                  ('check', '#171512', '말미 반복 출력', '생성 모델 반복·초단문', '규칙 후처리로 <b>반복 제거 · 정상 단문 보존</b> 균형화'),
              ], [116.0, 114.0, RIGHT_WIDTH - 230.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          'Crawl4AI', '약 4,000건', '약 3,000건', 'KoBART', 'ROUGE-1 · ROUGE-2',
          'Gemini API 하이브리드', '분할 요약 → 재요약', '반복 제거 · 정상 단문 보존',
      ],
  }},
 {'key': 'mri',
  'name': 'Brain Tumor MRI',
  'tagline': '뇌 MRI 종양 분류·영역 분할 통합 추론 데모',
  'period': '2026.02 - 04',
  'role': '전처리 · 학습 · 추론 · 웹 데모',
  'team': '개인 프로젝트',
  'stack': 'Python · PyTorch<br/>Ultralytics YOLO11 · OpenCV',
  'figure': ('@mri-video-overlay-007733.png',
             (0.3606060606060606, 0.18895348837209303, 0.921969696969697, 0.7897286821705426)),
  'caption': '분류·분할 통합 추론',
  'awards': [],
  'repo': 'https://github.com/SeMinKong/BrainMRISegmentation_YOLO/',
  'detail': 'DETAILS.md',
  'case': 'work/brain-tumor-mri/',
  'schematic': {
      'short_summary': 'MRI 한 장의 종양 유형 분류와 영역 분할을 독립된 두 YOLO11 모델로 분석하고 나란히 시각화하는 웹 데모입니다.',
      'short_reflection': '모델 구조 못지않게 라벨 전처리 품질이 추론 신뢰도를 좌우함을 확인했습니다. 재현 가능한 독립 평가셋과 실행 로그의 중요성을 깨닫고 이후 프로젝트의 필수 검증 기준으로 삼고 있습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('image', False, 'MRI · 마스크', '픽셀 정답 데이터'),
                  ('scan-search', False, '폴리곤 변환', '이진화·형태학 윤곽'),
                  ('cpu', True, 'YOLO11 2종', '분류 · 분할 독립 학습'),
                  ('eye', False, '통합 시각화', '신뢰도·영역 동시 비교'),
              ], 19.0, 12.0),
              ('checks', [
                  ('layers', '분류·분할 학습', 'YOLO11 분류·분할 학습·가중치 경로를 각각 설계하고 마스크→폴리곤 변환 자동화'),
                  ('eye', '통합 추론 화면', '동일 MRI의 분류 신뢰도와 분할 영역을 한 화면에서 대조하는 통합 추론 데모 구현'),
              ], 106.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '원인 · 한계', '해결 전략 · 검증'), [
                  ('sliders-horizontal', '#a73524', '윤곽 노이즈 유입', '마스크 미세 틈·돌기', '<b>closing·opening</b> + 점 수·면적 필터 (전후 대조)'),
                  ('split', '#171512', '모델 결과 불일치', '독립 추론 간 괴리 가능', '동일 입력에 <b>분류 신뢰도·분할 영역</b> 동시 오버레이'),
              ], [116.0, 114.0, RIGHT_WIDTH - 230.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          'MRI · 마스크', '폴리곤 변환', 'YOLO11 2종', '통합 시각화',
          'closing·opening', '점 수·면적 필터', '분류 신뢰도·분할 영역',
      ],
  }}]

EXPERIENCES = json.loads(Path(__file__).with_name('project_experiences.json').read_text(encoding='utf-8'))
for project in PROJECTS:
    experience = EXPERIENCES['projects'][project['key']]
    project.update(experience['presentation'])
    project.update({field: experience[field] for field in ('built', 'troubleshooting', 'reflection')})


def text_height(text, width, size, leading, bold=False):
    """Measure the same word-preserving paragraphs that Book.para renders."""
    style = ParagraphStyle('measure', fontName='KoreanBold' if bold else 'Korean',
                           fontSize=size, leading=leading, splitLongWords=False)
    return Paragraph(text, style).wrap(width, H)[1]


def source_links(spec, web):
    if 'repo' not in spec:
        return [('공개 프로젝트 사례', web + spec['case'])]
    return [('README', spec['repo'] + 'blob/main/README.md'),
            ('기술 문서', spec['repo'] + 'blob/main/' + spec['detail']),
            ('프로젝트 시연', web + spec['case'])]


def project_page(b, spec, web, awards):
    b.start(spec['name'], key=spec['key'])
    metadata = f"{spec['period']} · {spec['team']} <font color='#d4d0c5'>|</font> <b>역할</b> {spec['role']}"
    b.para(metadata, M, 90, CW, 10, 15, MUTED, keep_words=True)
    b.rule(113)

    if 'schematic' in spec:
        schematic_project_body(b, spec)
        footer(b, spec, web, awards)
        return

    # The image adapts to the full approved copy, never the other way around.
    # Keep the source pixels and the previously approved display region intact.
    reflection_height = text_height(spec['reflection'], LEFT_WIDTH, 10, 15)
    summary_height = text_height(spec['summary'], LEFT_WIDTH, 10.5, 16)
    tagline_height = text_height(spec['tagline'], LEFT_WIDTH, 12.3, 18, bold=True)
    image_height = min(194, CONTENT_BOTTOM - CONTENT_TOP - reflection_height
                       - summary_height - tagline_height - 15 - 18 - 64)
    if image_height < 130:
        raise ValueError(f"{spec['key']}: full left-column copy leaves insufficient image space")
    figure, region = spec['figure']
    top = b.image(figure, M, CONTENT_TOP, LEFT_WIDTH, image_height,
                  region=region, caption=spec['caption'],
                  caption_size=9.8, caption_leading=15, caption_gap=10)
    top = b.para(spec['tagline'], M, top + 14, LEFT_WIDTH, 12.3, 18,
                 bold=True, keep_words=True)
    top = b.para(spec['summary'], M, top + 6, LEFT_WIDTH, 10.5, 16,
                 MUTED, keep_words=True)
    b.rule(top + 12, M, LEFT_WIDTH)
    top = b.para('회고', M, top + 24, LEFT_WIDTH, 12.3, 18, bold=True)
    left_end = b.para(spec['reflection'], M, top + 10, LEFT_WIDTH,
                      10, 15, MUTED, keep_words=True)
    if left_end > CONTENT_BOTTOM + .1:
        raise ValueError(f"{spec['key']}: left column exceeds available space ({left_end})")

    b.para('직접 맡은 구현', RIGHT_X, CONTENT_TOP, RIGHT_WIDTH, 12.3, 18, bold=True)
    top = CONTENT_TOP + 28
    for item in spec['built']:
        b.para('·', RIGHT_X, top, 8, BODY_SIZE, BODY_LEADING, color=ACCENT)
        top = b.para(item, RIGHT_X + 12, top, RIGHT_WIDTH - 12,
                     BODY_SIZE, BODY_LEADING, keep_words=True) + 6
    b.rule(top + 6, RIGHT_X, RIGHT_WIDTH)
    top = b.para('트러블슈팅', RIGHT_X, top + 17, RIGHT_WIDTH, 12.3, 18, bold=True) + 10
    for title, body in spec['troubleshooting']:
        top = b.para(f'<b>{title}</b> · {body}', RIGHT_X, top, RIGHT_WIDTH,
                     BODY_SIZE, BODY_LEADING, keep_words=True) + 8
    if top - 8 > CONTENT_BOTTOM:
        raise ValueError(f"{spec['key']}: right column exceeds available space ({top - 8})")
    footer(b, spec, web, awards)


def schematic_project_body(b, spec):
    """Pictogram-led project page on the golden grid (Minor 278 : Major 450) with exact section titles."""
    sc = spec['schematic']
    summary_text = sc['short_summary']
    reflection_text = sc['short_reflection']

    # Left minor column (38.2%): source figure, L2 tagline (12.4pt), L1 copy (10.0pt)
    reflection_height = text_height(reflection_text, LEFT_WIDTH, 10.0, 15.0)
    summary_height = text_height(summary_text, LEFT_WIDTH, 10.0, 15.0)
    tagline_height = text_height(spec['tagline'], LEFT_WIDTH, 12.4, 17.5, bold=True)
    image_height = min(194, CONTENT_BOTTOM - CONTENT_TOP - reflection_height
                       - summary_height - tagline_height - 15 - 18 - 64)
    if image_height < 130:
        raise ValueError(f"{spec['key']}: left-column copy leaves insufficient image space")
    figure, region = spec['figure']
    top = b.image(figure, M, CONTENT_TOP, LEFT_WIDTH, image_height,
                  region=region, caption=spec['caption'],
                  caption_size=9.2, caption_leading=13.5, caption_gap=10)
    top = b.para(spec['tagline'], M, top + 14, LEFT_WIDTH, 12.4, 17.5,
                 bold=True, keep_words=True)
    top = b.para(summary_text, M, top + 6, LEFT_WIDTH, 10.0, 15.0,
                 MUTED, keep_words=True)
    b.rule(top + 14, M, LEFT_WIDTH)
    top = b.para('회고', M, top + 26, LEFT_WIDTH, 12.4, 17.5, bold=True)
    left_end = b.para(reflection_text, M, top + 8, LEFT_WIDTH,
                      10.0, 15.0, MUTED, keep_words=True)
    if left_end > CONTENT_BOTTOM + .1:
        raise ValueError(f"{spec['key']}: left column exceeds available space ({left_end})")

    # Right major column (61.8%): preserved '직접 맡은 구현' & '트러블슈팅' headings
    y = CONTENT_TOP
    for s_idx, (title, blocks) in enumerate(sc['sections']):
        if s_idx > 0:
            b.rule(y + 18, RIGHT_X, RIGHT_WIDTH, LINE, 0.65)
            y += 30
        y = vc.section_title(b, title, RIGHT_X, y, RIGHT_WIDTH)
        for b_idx, block in enumerate(blocks):
            kind = block[0]
            if kind == 'flow':
                _, nodes, icon_size, gap = block
                y = vc.pictogram_flow(b, nodes, RIGHT_X, y + 14, RIGHT_WIDTH,
                                      icon_size=icon_size, gap=gap)
            elif kind == 'table':
                _, headers, rows, col_widths = block
                y = vc.truth_table(b, headers, rows, col_widths, RIGHT_X, y + 12)
            elif kind == 'checks':
                _, items, label_w = block
                if b_idx > 0:
                    b.rule(y + 12, RIGHT_X, RIGHT_WIDTH, LINE, 0.45)
                    y += 19
                else:
                    y += 12
                y = vc.check_rows(b, items, RIGHT_X, y, RIGHT_WIDTH, label_w=label_w)
    if y > CONTENT_BOTTOM + .1:
        raise ValueError(f"{spec['key']}: right column exceeds available space ({y})")


def footer(b, spec, web, awards):
    stack = spec['stack'].replace('<br/>', ' · ')
    b.para(stack, M, 534, CW, 9.2, 12, MUTED, keep_words=True, align='center', limit=H - 20)
    titles = ['SSAFY 공통프로젝트 1등 (우수상)', 'SW 공모전 금상',
              '캡스톤디자인 장려상', 'IT 프로젝트 프로리그 장려상']
    if spec['awards']:
        b.award_links([(titles[index], web + 'resume/' + awards[index][3])
                       for index in spec['awards']], 549, size=9.2, gap=26)
    if 'badge' in spec:
        b.gold_badge(spec['badge'], W / 2, 549)
    if 'award_label' in spec:
        b.para(spec['award_label'], M, 549, CW, 9.2, 12, MUTED, bold=True,
               align='center', limit=H - 20)
    b.rule(530)
    b.link_row(source_links(spec, web), 564, size=9.2, gap=30)
    b.end(rule_top=None)
