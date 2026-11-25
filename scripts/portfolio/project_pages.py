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
M, CW = 38, W - 76
LEFT_WIDTH = 300
RIGHT_X = 368
RIGHT_WIDTH = W - M - RIGHT_X
BODY_SIZE, BODY_LEADING = 10.3, 15.5
CONTENT_TOP, CONTENT_BOTTOM = 128, 522
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
      'section1_title': '촉각 센서 펌웨어 · 보드–PC 검증',
      'sensor_flow': [
          ('cpu', False, '센서 · MCU', '상태·직전 정상값 분리'),
          ('arrow-left-right', True, '보드 ↔ PC 대조', '동시점 비교·재시도 복구'),
          ('monitor', False, 'PC 앱 수신', '유효 채널만 화면 반영'),
      ],
      'truth_headers': ('채널 상태', '기존 문제', '펌웨어 · PC 해결'),
      'truth_rows': [
          ('circle-check', '#171512', '정상 수신 (값 0)', '둘 다 0으로 표시', '<b>정지 상태</b>로 판별 · 정상 반영'),
          ('circle-x', '#a73524', '읽기 실패 (무응답)', '고장 채널 오인식', '<b>수집 제외</b> · 복구 시 재갱신'),
      ],
      'section2_title': 'PC 앱 3D 기구 편집 · MCP 연동',
      'mcp_flow': [
          ('terminal', False, 'AI 도구', 'MCP 호출'),
          ('box', False, '선택 기구', '현재 모델 읽기'),
          ('sliders-horizontal', True, '지정 축 수정', '장착 각도만 변경'),
          ('file-check', False, '별도 저장', '3D 화면 열기'),
      ],
      'mcp_checks': [
          ('check', '저장 파일 재검증', '수정 파일을 다시 읽어 <b>장착 각도만 변경 · 기존 장착 거리 유지</b>를 확인'),
          ('split', '실행 응답 분리', '<b>파일 저장 결과</b>와 <b>3D 화면 열기 결과</b>를 독립 반환해 실패 지점 구분'),
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
  'case': 'work/bondi/'},
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
  'case': 'work/thing/'},
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
  'case': 'work/aqis/'},
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
  'case': 'work/briefit/'},
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
  'case': 'work/brain-tumor-mri/'}]

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
    """Pictogram-led project page replacing verbose prose with visual schematics and truth tables."""
    sc = spec['schematic']
    summary_text = sc['short_summary']
    reflection_text = sc['short_reflection']

    # Left column: unchanged source figure, concise summary and reflection
    reflection_height = text_height(reflection_text, LEFT_WIDTH, 9.8, 14.8)
    summary_height = text_height(summary_text, LEFT_WIDTH, 10.2, 15.5)
    tagline_height = text_height(spec['tagline'], LEFT_WIDTH, 12.3, 18, bold=True)
    image_height = min(194, CONTENT_BOTTOM - CONTENT_TOP - reflection_height
                       - summary_height - tagline_height - 15 - 18 - 64)
    if image_height < 130:
        raise ValueError(f"{spec['key']}: left-column copy leaves insufficient image space")
    figure, region = spec['figure']
    top = b.image(figure, M, CONTENT_TOP, LEFT_WIDTH, image_height,
                  region=region, caption=spec['caption'],
                  caption_size=9.8, caption_leading=15, caption_gap=10)
    top = b.para(spec['tagline'], M, top + 14, LEFT_WIDTH, 12.3, 18,
                 bold=True, keep_words=True)
    top = b.para(summary_text, M, top + 6, LEFT_WIDTH, 10.2, 15.5,
                 MUTED, keep_words=True)
    b.rule(top + 14, M, LEFT_WIDTH)
    top = b.para('회고', M, top + 26, LEFT_WIDTH, 12.0, 17, bold=True)
    left_end = b.para(reflection_text, M, top + 9, LEFT_WIDTH,
                      9.8, 14.8, MUTED, keep_words=True)
    if left_end > CONTENT_BOTTOM + .1:
        raise ValueError(f"{spec['key']}: left column exceeds available space ({left_end})")

    # Right Column Section 01: Sensor Firmware & Board-PC Verification
    top = vc.numbered_heading(b, '01', sc['section1_title'], RIGHT_X, CONTENT_TOP, RIGHT_WIDTH)
    top = vc.pictogram_flow(b, sc['sensor_flow'], RIGHT_X, top + 14, RIGHT_WIDTH, icon_size=20.0, gap=18.0)
    top = vc.truth_table(b, sc['truth_headers'], sc['truth_rows'],
                         [144.0, 112.0, RIGHT_WIDTH - 256.0], RIGHT_X, top + 14)

    # Generous section separation between the two engineering domains
    b.rule(top + 20, RIGHT_X, RIGHT_WIDTH, LINE, 0.65)

    # Right Column Section 02: PC App 3D Fixture Editing & MCP Integration
    top = vc.numbered_heading(b, '02', sc['section2_title'], RIGHT_X, top + 34, RIGHT_WIDTH)
    top = vc.pictogram_flow(b, sc['mcp_flow'], RIGHT_X, top + 14, RIGHT_WIDTH, icon_size=19.0, gap=14.0)
    b.rule(top + 12, RIGHT_X, RIGHT_WIDTH, LINE, 0.45)
    right_end = vc.check_rows(b, sc['mcp_checks'], RIGHT_X, top + 20, RIGHT_WIDTH, label_w=108.0)
    if right_end > CONTENT_BOTTOM + .1:
        raise ValueError(f"{spec['key']}: right column exceeds available space ({right_end})")


def footer(b, spec, web, awards):
    stack = spec['stack'].replace('<br/>', ' · ')
    b.para(stack, M, 534, CW, 9.3, 12, MUTED, keep_words=True, align='center', limit=H - 20)
    titles = ['SSAFY 공통프로젝트 1등 (우수상)', 'SW 공모전 금상',
              '캡스톤디자인 장려상', 'IT 프로젝트 프로리그 장려상']
    if spec['awards']:
        b.award_links([(titles[index], web + 'resume/' + awards[index][3])
                       for index in spec['awards']], 549, size=9.3, gap=26)
    if 'badge' in spec:
        b.gold_badge(spec['badge'], W / 2, 549)
    if 'award_label' in spec:
        b.para(spec['award_label'], M, 549, CW, 9.3, 12, MUTED, bold=True,
               align='center', limit=H - 20)
    b.rule(530)
    b.link_row(source_links(spec, web), 564, size=9.3, gap=30)
    b.end(rule_top=None)
