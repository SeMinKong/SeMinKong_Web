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
  'tagline': '손끝 촉각 신호를 읽는 로봇 모니터링',
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
      'short_summary': '손끝 촉각 신호와 3D 그리퍼를 함께 확인해 물체 미끄러짐을 판단하는 PC 앱입니다.',
      'short_reflection': '센서값 자체보다 정상 측정 여부를 먼저 구분하는 설계가 핵심이었습니다. 실물 보드–PC 채널 동작을 검증했고, 시연은 테스트 입력 기준입니다.',
      'sections': [
          ('01', '촉각 센서 펌웨어 · 보드–PC 검증', [
              ('flow', [
                  ('cpu', False, '센서 · MCU', '상태·직전 정상값 분리'),
                  ('arrow-left-right', True, '보드 ↔ PC 대조', '동시점 비교·재시도 복구'),
                  ('monitor', False, 'PC 앱 수신', '유효 채널만 화면 반영'),
              ], 20.0, 18.0),
              ('table', ('채널 상태', '기존 문제', '펌웨어 · PC 해결'), [
                  ('circle-check', '#171512', '정상 수신 (값 0)', '둘 다 0으로 표시', '<b>정지 상태</b>로 판별 · 정상 반영'),
                  ('circle-x', '#a73524', '읽기 실패 (무응답)', '고장 채널 오인식', '<b>수집 제외</b> · 복구 시 재갱신'),
              ], [144.0, 112.0, RIGHT_WIDTH - 256.0]),
          ]),
          ('02', 'PC 앱 3D 기구 편집 · MCP 연동', [
              ('flow', [
                  ('terminal', False, 'AI 도구', 'MCP 호출'),
                  ('box', False, '선택 기구', '현재 모델 읽기'),
                  ('sliders-horizontal', True, '지정 축 수정', '장착 각도만 변경'),
                  ('file-check', False, '별도 저장', '3D 화면 열기'),
              ], 19.0, 14.0),
              ('checks', [
                  ('check', '저장 파일 재검증', '수정 파일을 다시 읽어 <b>장착 각도만 변경 · 기존 장착 거리 유지</b>를 확인'),
                  ('split', '실행 응답 분리', '<b>파일 저장 결과</b>와 <b>3D 화면 열기 결과</b>를 독립 반환해 실패 지점 구분'),
              ], 108.0),
          ]),
      ],
      'required_facts': [
          '센서 · MCU', '보드 ↔ PC 대조', 'PC 앱 수신',
          '정상 수신 (값 0)', '읽기 실패 (무응답)', '정지 상태', '수집 제외',
          'AI 도구', '지정 축 수정', '별도 저장', '장착 각도만 변경', '기존 장착 거리 유지', '실행 응답 분리',
      ],
  }},
 {'key': 'bondi',
  'name': 'Bondi',
  'tagline': '손으로 돌려보며 비교하는 유물 복원 VR 박물관',
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
      'short_summary': '손상된 유물을 AI로 3D 복원해 VR 전시장에서 직접 손으로 돌려보며 비교하는 박물관입니다.',
      'short_reflection': '단일 사진에 없는 안쪽·뒷면까지 모델이 추정해야 했기에, 전시 패널에 원본 자료와 AI 추정 범위를 함께 표기해 비교할 수 있게 했습니다.',
      'sections': [
          ('01', '3D 유물 복원 · VR 전시 공간 구현', [
              ('flow', [
                  ('image', False, '토기 사진', '단일 2D 입력'),
                  ('box', False, 'TRELLIS', '3D 메시 생성'),
                  ('sparkles', True, 'AdaPoinTr', '점군 정규화·결손 복원'),
                  ('boxes', False, 'Unreal VR', '메인 홀·전시실 배치'),
              ], 19.0, 12.0),
              ('checks', [
                  ('hand', 'OpenXR 손 추적', '검지로 좌대 버튼 전환 · 엄지·검지로 유물 파지·회전, 놓으면 원위치 복귀'),
                  ('layers', '전후 모델 전환', 'Blender로 모델링한 좌대에서 손상·복원 유물을 같은 자리에서 비교'),
              ], 106.0),
          ]),
          ('02', 'VR 전시 정합 · 이동 오차 해결', [
              ('table', ('트러블슈팅', '기존 문제', '해결 · 측정 결과'), [
                  ('rotate-cw', '#171512', '전후 비교 기준', '축·배율 불일치', '전환 시 <b>회전·크기 동시 보정</b> · 동일 위치 유지'),
                  ('move', '#a73524', '포털 이동 오차', '보행 후 도착 어긋남', '암전 시 기준 재설정 · Quest 2 <b>369cm → 13cm</b>'),
              ], [116.0, 102.0, RIGHT_WIDTH - 218.0]),
          ]),
      ],
      'required_facts': [
          'TRELLIS', 'AdaPoinTr', 'Unreal VR', 'OpenXR 손 추적', 'Blender',
          '회전·크기 동시 보정', 'Quest 2', '369cm → 13cm',
      ],
  }},
 {'key': 'thing',
  'name': 'THING',
  'tagline': '7축 텐던 로봇 핸드',
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
      'short_summary': '카메라로 인식한 21개 손 랜드마크를 7축 텐던 모터 제어로 연결한 로봇 핸드입니다.',
      'short_reflection': '시뮬레이션 학습 전 단계지만 기구·모터·통신 통합의 기초를 다졌습니다. 하드웨어 한계와 통신 오류를 겪으며 기구·제어 동시 설계의 중요성을 익혔습니다.',
      'sections': [
          ('01', '손 기구 제작 · 7축 ROS 2 제어 연동', [
              ('flow', [
                  ('hand', False, '기구 설계', 'Blender · 3D 프린팅'),
                  ('network', False, 'ROS 브릿지', '명령 변환 · Cyclone DDS'),
                  ('cable', True, 'U2D2 통신', '동기 구동 · 키보드 조작'),
                  ('cog', False, '7축 모터', 'DYNAMIXEL 제어'),
              ], 19.0, 12.0),
              ('checks', [
                  ('box', '관절 기구 제작', 'Blender로 인체 손의 관절 구조를 반영해 설계하고 3D 프린팅으로 제작'),
                  ('cpu', '7축 동기 구동', 'DYNAMIXEL 7개 제어값을 조정해 동기 구동과 U2D2 기반 ROS 브릿지 구현'),
              ], 102.0),
          ]),
          ('02', '구동 · 기구 · 통신 트러블슈팅', [
              ('table', ('항목', '발생 과제', '구조 · 파라미터 해결'), [
                  ('sliders-horizontal', '#171512', '모터 제어 범위', '기구 조건별 과부하 위험', 'SDK <b>전류·토크·회전 범위·모드</b> 비교 후 맞춤 조정'),
                  ('git-branch', '#a73524', '텐던 복귀 구조', '굽힘 후 원위치 복귀 필요', '관절 힘 작용점 계산 · <b>장력 기반 복귀</b> 구조로 변경'),
                  ('radio', '#171512', 'ROS 통신 주기', '실시간 제어 전달 지연', 'ROS 통신 설정 조정 · <b>Cyclone DDS</b> 적용 점검'),
              ], [122.0, 112.0, RIGHT_WIDTH - 234.0]),
          ]),
      ],
      'required_facts': [
          '기구 설계', 'ROS 브릿지', 'U2D2 통신', '7축 모터',
          'Blender', 'DYNAMIXEL', '전류·토크·회전 범위·모드', '장력 기반 복귀', 'Cyclone DDS',
      ],
  }},
 {'key': 'aqis',
  'name': 'AQIS for Smart Factory',
  'tagline': '비전 검사·로봇 분류·웹 관제',
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
      'short_summary': '불량 뚜껑 검출·로봇 분류·자율주행·웹 관제를 하나로 통합한 스마트 팩토리입니다.',
      'short_reflection': '여러 장비를 연결하며 영상·통신·로봇 주기를 함께 설계해야 함을 배웠습니다. 향후 VLM 행동 계획과 직접 경로 제어를 확장할 계획입니다.',
      'sections': [
          ('01', '통합 ROS 공정 · 비전·자율주행 구성', [
              ('flow', [
                  ('camera', False, 'RealSense', '뚜껑 약 1,000장 (7:3)'),
                  ('scan-search', True, 'YOLO 검출', '불량 판별 · 좌표 갱신'),
                  ('bot', False, 'Dobot · TB3', '분류 · SLAM 자율주행'),
                  ('monitor', False, '웹 관제', '상태 · MJPEG 분리'),
              ], 19.0, 12.0),
              ('checks', [
                  ('database', '비전·ROS 통합', 'Dobot·RealSense·TurtleBot3·컨베이어 통합 및 뚜껑 1,000장 7:3 YOLO 학습'),
                  ('navigation', 'SLAM 자율주행', 'ROS 내비게이션 패키지로 지도를 구성하고 지정 위치 자율주행 설정'),
              ], 102.0),
          ]),
          ('02', '병목 · 연동 · 좌표 트러블슈팅', [
              ('table', ('항목', '기존 문제', '해결 · 개선 결과'), [
                  ('gauge', '#a73524', '영상 전송 병목', 'WS 통합 전송 시 지연', '별도 포트 MJPEG 서버 분리 · <b>약 4 FPS → 30 FPS</b>'),
                  ('layers', '#171512', '시뮬·실물 연동', '직접 동기화 난도 상승', '실행 환경 분리 · <b>공통 데이터·명령</b>으로 동일 공정'),
                  ('crosshair', '#171512', '이동 물체 집기', '고정 좌표 위치 오차', '검출 좌표 반영 · <b>1초 주기 추론</b>으로 시점 차 축소'),
              ], [122.0, 108.0, RIGHT_WIDTH - 230.0]),
          ]),
      ],
      'required_facts': [
          'RealSense', 'YOLO 검출', 'Dobot · TB3', '웹 관제', '1,000장',
          'SLAM 자율주행', '약 4 FPS → 30 FPS', '공통 데이터·명령', '1초 주기 추론',
      ],
  }},
 {'key': 'briefit',
  'name': 'Briefit',
  'tagline': '뉴스 수집·요약 서비스',
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
      'short_summary': '여러 언론사 기사를 이슈별로 묶고 핵심을 요약해 주는 뉴스 서비스입니다.',
      'short_reflection': 'Transformer 요약 학습·생성 흐름을 익혔고 정량 점수(ROUGE)와 체감 품질의 차이를 배웠습니다. 실제 기사·사용자 기준으로 개선을 쌓고자 합니다.',
      'sections': [
          ('01', '뉴스 수집 · KoBART 요약 파이프라인', [
              ('flow', [
                  ('globe', False, 'Crawl4AI', '네이버 뉴스 약 4,000건'),
                  ('funnel', False, '데이터 정제', '본문 필터 · 약 3,000건'),
                  ('sparkles', True, '요약 학습', 'KoBART · T5 비교'),
                  ('file-text', False, '서비스 요약', 'ROUGE · Gemini 보완'),
              ], 19.0, 12.0),
              ('checks', [
                  ('funnel', '본문 정제 기준', '기사·댓글 URL을 분리하고 불필요한 태그와 지나치게 짧은 본문을 제외'),
                  ('chart-column', '정량 비교 평가', 'T5와 KoBART의 요약 출력을 <b>ROUGE-1 · ROUGE-2</b> 기준으로 비교 분석'),
              ], 102.0),
          ]),
          ('02', '요약 품질 · 장문·반복 후처리', [
              ('table', ('항목', '발생 한계', '보완 · 처리 방식'), [
                  ('sparkles', '#a73524', '학습 품질 한계', '3,000건 학습만으론 미흡', '서비스 운영을 위해 <b>Gemini API 추가 연동</b> 보완'),
                  ('scissors', '#171512', '장문 입력 초과', '모델 입력 길이 초과', '문단 묶음 <b>분할 요약 → 재요약</b> (장문 절단 한계)'),
                  ('check', '#171512', '반복 문장 정리', '끝부분 반복·초단문 생성', '규칙 후처리로 <b>반복 제거 · 정상 단문 보존</b>'),
              ], [112.0, 122.0, RIGHT_WIDTH - 234.0]),
          ]),
      ],
      'required_facts': [
          'Crawl4AI', '약 4,000건', '약 3,000건', 'KoBART', 'ROUGE-1 · ROUGE-2',
          'Gemini API 추가 연동', '분할 요약 → 재요약', '반복 제거 · 정상 단문 보존',
      ],
  }},
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
  'awards': [],
  'repo': 'https://github.com/SeMinKong/BrainMRISegmentation_YOLO/',
  'detail': 'DETAILS.md',
  'case': 'work/brain-tumor-mri/',
  'schematic': {
      'short_summary': 'MRI 한 장의 종양 유형과 영역을 독립된 두 모델로 분석하고 함께 시각화합니다.',
      'short_reflection': '모델 선택만큼 정답 라벨 변환 방식이 결과에 큰 영향을 미침을 배웠습니다. 다음엔 독립 최종 평가셋과 실행 로그를 남겨 정량 비교를 완성할 계획입니다.',
      'sections': [
          ('01', '전처리 · YOLO11 분류·분할 파이프라인', [
              ('flow', [
                  ('image', False, 'MRI · 마스크', '픽셀 마스크 입력'),
                  ('scan-search', False, '윤곽 변환', '이진화·형태학 → 폴리곤'),
                  ('cpu', True, 'YOLO11 2종', '분류 · 분할 독립 학습'),
                  ('eye', False, '통합 시각화', '클래스·신뢰도·영역'),
              ], 19.0, 12.0),
              ('checks', [
                  ('layers', '독립 모델 구성', '종양 유형 분류와 영역 분할 YOLO11 모델의 학습·가중치 경로를 각각 구현'),
                  ('eye', '통합 추론 화면', '동일 MRI에 두 모델을 적용해 분류 클래스·신뢰도와 분할 영역을 동시 표시'),
              ], 102.0),
          ]),
          ('02', '라벨 정제 · 출력 비교 트러블슈팅', [
              ('table', ('항목', '발생 과제', '해결 · 검증 방식'), [
                  ('sliders-horizontal', '#a73524', '마스크 윤곽 정제', '작은 틈·돌기 유입', '<b>closing·opening</b> + 점 수·면적 필터 (전후 대조)'),
                  ('split', '#171512', '모델 출력 비교', '독립 모델 간 결과 차이', '동일 입력에 <b>분류 신뢰도·분할 영역</b> 동시 표시'),
              ], [120.0, 108.0, RIGHT_WIDTH - 228.0]),
          ]),
      ],
      'required_facts': [
          'MRI · 마스크', '이진화·형태학 → 폴리곤', 'YOLO11 2종', '통합 시각화',
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
    """Pictogram-led project page on the golden grid (Minor 278 : Major 450) and sqrt(phi) type scale."""
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

    # Right major column (61.8%): modular numbered domains (flow / table / checks)
    y = CONTENT_TOP
    for s_idx, (ordinal, title, blocks) in enumerate(sc['sections']):
        if s_idx > 0:
            b.rule(y + 18, RIGHT_X, RIGHT_WIDTH, LINE, 0.65)
            y += 30
        y = vc.numbered_heading(b, ordinal, title, RIGHT_X, y, RIGHT_WIDTH)
        for b_idx, block in enumerate(blocks):
            kind = block[0]
            if kind == 'flow':
                _, nodes, icon_size, gap = block
                y = vc.pictogram_flow(b, nodes, RIGHT_X, y + 14, RIGHT_WIDTH,
                                      icon_size=icon_size, gap=gap)
            elif kind == 'table':
                _, headers, rows, col_widths = block
                y = vc.truth_table(b, headers, rows, col_widths, RIGHT_X, y + 14)
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
