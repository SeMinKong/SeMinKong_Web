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

W, H = landscape(A4)
M, CW = 38, W - 76
LEFT_WIDTH = 300
RIGHT_X = 368
RIGHT_WIDTH = W - M - RIGHT_X
BODY_SIZE, BODY_LEADING = 10.3, 15.5
CONTENT_TOP, CONTENT_BOTTOM = 128, 522
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
  'case': 'work/brain-tumor-mri/'},
 {'key': 'prompt',
  'name': 'Project Prompt Generator',
  'tagline': '영역별 대화·설계 문서 생성',
  'period': '2026',
  'role': '대화 서버 · 상태 관리 · 웹 UI',
  'team': '개인 프로젝트',
  'stack': 'Python · FastAPI · WebSocket<br/>LangChain · Solar Pro',
  'figure': ('@prompt-design-flow.png', (0, 0, 1, 1)),
  'caption': '영역별 대화 · 초기 설계',
  'awards': [],
  'repo': 'https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/',
  'detail': 'DETAILS.md',
  'case': 'work/project-prompt-generator/'},
 {'key': 'alkkagi',
  'name': 'Alkkagi.io',
  'tagline': '실시간 멀티플레이 알까기',
  'period': '2026.03 - 04',
  'role': '웹 UI · 통신 · 서버 물리',
  'team': '개인 프로젝트',
  'stack': 'React · TypeScript · Node.js<br/>Express · Socket.IO',
  'figure': ('@alkkagi-video-aim-0007.png', (0, 0, 1, 1)),
  'caption': '드래그 조준 · 실제 플레이',
  'awards': [],
  'repo': 'https://github.com/SeMinKong/Alkkagi/',
  'detail': 'DETAILS.md',
  'case': 'work/alkkagi/'}]

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


def project_page(b, spec, web, awards):
    b.start(spec['name'], key=spec['key'])
    metadata = f"{spec['period']} · {spec['team']} <font color='#d4d0c5'>|</font> <b>역할</b> {spec['role']}"
    b.para(metadata, M, 90, CW, 10, 15, MUTED, keep_words=True)
    b.rule(113)

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


def footer(b, spec, web, awards):
    stack = spec['stack'].replace('<br/>', ' · ')
    b.para(stack, M, 534, CW, 9.3, 12, MUTED, keep_words=True, align='center', limit=H - 20)
    titles = ['SSAFY 공통 프로젝트 우수상', 'SW 공모전 금상',
              '캡스톤디자인 장려상', 'IT 프로젝트 프로리그 장려상']
    if spec['awards']:
        b.award_links([(titles[index], web + 'resume/' + awards[index][3])
                       for index in spec['awards']], 549, size=9.3, gap=26)
    b.rule(530)
    links = [('README', spec['repo'] + 'blob/main/README.md'),
             ('기술 문서', spec['repo'] + 'blob/main/' + spec['detail']),
             ('프로젝트 시연', web + spec['case'])]
    b.link_row(links, 564, size=9.3, gap=30)
    b.end(rule_top=None)
