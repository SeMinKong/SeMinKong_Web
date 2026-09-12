"""Editable 9-page landscape portfolio: one page per project.

Each project page carries the introduction, personal implementation, design
decisions and validation limits; implementation detail lives in the repository READMEs
and the web case studies, which every page links to.

Run from the repository root. --sample makes a three-page layout check;
--publish copies the fully reviewed final bytes to the web download location.
Source visual content is preserved; sensitive metadata is removed from copies.
Owner-returned architecture PNGs retain their original pixels and alpha channels.
"""
from pathlib import Path
from io import BytesIO
import argparse
import hashlib
import json
import shutil
from urllib.parse import quote

import os

import project_pages
import technical_pages

from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Paragraph
from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderPDF

ROOT = Path(__file__).resolve().parents[2]
ASSETS = ROOT / 'src/assets/projects'
FIGURES = ROOT / 'scripts/portfolio/assets'
PAGE_COUNT = 9
PHOTO_IMAGES = {
    'thing/integrated-robot-hand-portrait.webp',
    'thing/jetson-mediapipe-hands-test-1600.webp',
    'thing/demos/can-grasp-poster.webp',
    '@thing-spool-tendon.jpg', '@thing-acrylic-mount.jpg',
}
WEB = 'https://seminkong.github.io/SeMinKong_Web/'
W, H = landscape(A4)
M, CW = 38, W - 76
BOTTOM = 535
INK, MUTED, PAPER, LINE, ACCENT, TINT = map(
    HexColor, ['#171512', '#625e56', '#f7f5ef', '#d4d0c5', '#a73524', '#eeeae1'])
VERSION = '2026.09.12'
FONT_FILES = {
    'Korean': ('NanumGothic-Regular.ttf', 'NanumGothic.ttf'),
    'KoreanBold': ('NanumGothic-Bold.ttf', 'NanumGothicBold.ttf'),
}
FONT_DIRS = [Path(p) for p in (
    os.environ.get('PORTFOLIO_FONT_DIR', ''),
    'C:/Windows/Fonts',
    Path.home() / 'AppData/Local/Microsoft/Windows/Fonts',
    '/usr/share/fonts/truetype/nanum',
) if p]


def register_font(name):
    """Published bytes use NanumGothic; PORTFOLIO_FONT_DIR allows a local check."""
    for directory in FONT_DIRS:
        for filename in FONT_FILES[name]:
            if (directory / filename).exists():
                pdfmetrics.registerFont(TTFont(name, str(directory / filename)))
                return
    raise SystemExit(f'{name}: NanumGothic not found in {[str(d) for d in FONT_DIRS]}')


register_font('Korean')
register_font('KoreanBold')
pdfmetrics.registerFontFamily('Korean', normal='Korean', bold='KoreanBold')

THING = 'https://github.com/SeMinKong/THING/'
AQIS = 'https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/'
MRI = 'https://github.com/SeMinKong/BrainMRISegmentation_YOLO/'
ALK = 'https://github.com/SeMinKong/Alkkagi/'
BRIEF = 'https://github.com/capstone-btd/Briefit_AI/'
PROMPT = 'https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/'
THING_REF = THING + 'blob/2381e8e3cb46c083be6ce024a3eb88bc75674f12/'
AQIS_REF = AQIS + 'blob/9f6530a2acffa0555f9df2eb628b40e4d01b6341/'
AQIS_EXPANDED_REF = AQIS + 'blob/60951747fac753eb521fd80efce3fbade0eda101/'
MRI_REF = MRI + 'blob/3c9a0694dde759390c5813b60b60b5911448d716/'
ALK_REF = ALK + 'blob/530229c524a432c0016a28376a5c6fccd8f8e5b5/'
PROMPT_REF = PROMPT + 'blob/1972aa05d5caca05869a6ba588bf4b7573a7f678/'
BRIEF_COLLECT = BRIEF + 'commit/a7b25dff1438940fea631d8ba597835435b7c32a'
BRIEF_TRAIN = BRIEF + 'commit/714502c017f0c57ebebd634b60ea77a102945d81'
BRIEF_POST = BRIEF + 'commit/da4ea1b09cfd44724facc19233d65c07e4301f3a'
BRIEF_GENERATE = BRIEF + 'blob/8c48def1e623a69fbb28e3b085a2d49dc1dc003c/Kobart/Scripts/GenerateJson.py'
STACK = [
    ('Robotics · Simulation', ['ROS 2', 'Isaac Sim', 'Isaac Lab']),
    ('Languages', ['C++', 'Python']),
    ('AI · Computer Vision', ['PyTorch', 'YOLO']),
    ('LLM · Backend', ['FastAPI', 'LangChain', 'Ollama', 'llama.cpp', 'vLLM']),
    ('Platform · Collaboration', ['Ubuntu', 'Docker', 'Git', 'Jira']),
]
CERTIFICATIONS = [
    ('정보처리기사', '국가기술자격 · 과학기술정보통신부', '2026.09.11 취득',
     'certificate-information-processing.webp'),
    ('OPIc English IH', 'ACTFL · Intermediate High', '2027.10.04까지 유효',
     'certificate-opic-english.webp'),
]
AWARDS = [
    ('THING', 'SSAFY 공통 프로젝트 우수상', '2026.08.10', 'award-ssafy-common-project.webp'),
    ('Briefit', '2025 IT대학 소프트웨어 공모전 금상', '2025.08.18', 'award-software-competition.webp'),
    ('Briefit', '제15회 숭실 캡스톤디자인 경진대회 장려상', '2025.10.01', 'award-capstone-design.webp'),
    ('Briefit', '2025 IT 프로젝트 프로리그 장려상', '2025.11.22', 'award-it-project-pro-league.webp'),
]


class Book:
    def __init__(self, target, sample=False):
        target.parent.mkdir(parents=True, exist_ok=True)
        self.c = canvas.Canvas(str(target), pagesize=(W, H), pageCompression=1, invariant=1)
        self.c.setTitle('공세민 | Software Developer Portfolio')
        self.c.setAuthor('공세민 / Se Min Kong')
        self.c.setSubject('Introduction, six project cases, implementation decisions and awards')
        self.c.setKeywords('공세민, Se Min Kong, Software, Robotics, Portfolio')
        self.c.setViewerPreference('DisplayDocTitle', 'true')
        self.sample, self.n = sample, 0
        self.checks, self.pages, self.images = [], [], {}
        self.arrows, self.connections = [], []

    def track(self, text, x, top, width, height, kind='text', limit=BOTTOM):
        if x < M - .1 or x + width > W - M + .1 or top < 0 or top + height > limit:
            raise ValueError(f'Page {self.n}: {kind} outside area: {text[:45]} / {x, top, width, height}')
        self.checks.append(dict(page=self.n, kind=kind, x=round(x, 2), top=round(top, 2),
                                width=round(width, 2), height=round(height, 2), text=text))

    def text(self, text, x, top, size=10, font='Korean', color=INK, limit=BOTTOM):
        width = pdfmetrics.stringWidth(text, font, size)
        self.track(text, x, top, width, size * 1.15, limit=limit)
        self.c.setFillColor(color)
        self.c.setFont(font, size)
        self.c.drawString(x, H - top - size, text)

    def para(self, text, x, top, width, size=10.4, leading=16.5, color=INK, bold=False,
             keep_words=False, align='left', limit=BOTTOM):
        style = ParagraphStyle('p', fontName='KoreanBold' if bold else 'Korean', fontSize=size,
                               leading=leading, textColor=color, wordWrap=None if keep_words else 'CJK',
                               splitLongWords=False, spaceAfter=0, alignment=1 if align == 'center' else 0)
        p = Paragraph(text, style)
        _, height = p.wrap(width, H)
        self.track(text, x, top, width, height, limit=limit)
        if align == 'center':
            self.checks[-1]['center_x'] = round(x + width / 2, 2)
        p.drawOn(self.c, x, H - top - height)
        return top + height

    def rule(self, top, x=M, width=CW, color=LINE, weight=.65):
        self.c.setStrokeColor(color)
        self.c.setLineWidth(weight)
        self.c.line(x, H - top, x + width, H - top)

    def label(self, text, x, top):
        self.text(text, x, top, 10, 'KoreanBold', MUTED)

    def link(self, title, url, x, top, size=9, internal=False, limit=BOTTOM):
        self.text(title, x, top, size, 'Korean', ACCENT, limit=limit)
        width = pdfmetrics.stringWidth(title, 'Korean', size)
        rect = (x, H - top - size - 3, x + width, H - top + 2)
        if internal:
            self.c.linkRect('', url, rect, relative=0, thickness=0)
        else:
            self.c.linkURL(quote(url, safe=':/#?=&%@'), rect, relative=0, thickness=0)
        return width

    def center_link(self, title, url, center, top, size=10, limit=BOTTOM):
        width = pdfmetrics.stringWidth(title, 'Korean', size)
        self.link(title, url, center - width / 2, top, size, limit=limit)
        self.checks[-1]['center_x'] = round(center, 2)

    def link_row(self, sources, top, size=10, center=W / 2, gap=30):
        widths = [pdfmetrics.stringWidth(title, 'Korean', size) for title, _ in sources]
        total = sum(widths) + gap * (len(widths) - 1)
        x = center - total / 2
        for (title, url), width in zip(sources, widths):
            self.center_link(title, url, x + width / 2, top, size, limit=H - 20)
            x += width + gap

    def image(self, name, x, top, width, height, region=(0, 0, 1, 1),
              caption=None, caption_size=9.5, caption_leading=15, caption_gap=10,
              align_bottom=False):
        """Place an unchanged source; optionally clip to an oriented display region."""
        if name not in self.images:
            # The owner approved this portrait inside the PDF only, not as a
            # standalone website/repository asset. Keep its source private.
            path = (ROOT / '.private/portfolio/se-min-kong-profile.png'
                    if name == '@se-min-kong-profile.png'
                    else FIGURES / name[1:] if name.startswith('@') else ASSETS / name)
            with Image.open(path) as im:
                orientation = im.getexif().get(274, 1)
                if name in PHOTO_IMAGES:
                    # PDF-only JPEG encoding strips metadata and controls download size.
                    # Source files, composition and image dimensions are preserved;
                    # EXIF orientation is applied by the PDF placement transform below.
                    encoded = BytesIO()
                    im.convert('RGB').save(encoded, format='JPEG', quality=88, optimize=True)
                    encoded.seek(0)
                    reader = ImageReader(encoded)
                else:
                    reader = ImageReader(str(path))
                self.images[name] = (reader, im.size, orientation)
        reader, (iw, ih), orientation = self.images[name]
        sw, sh = (ih, iw) if orientation in (6, 8) else (iw, ih)
        left, upper, right, lower = region
        if not (0 <= left < right <= 1 and 0 <= upper < lower <= 1):
            raise ValueError(f'Invalid display region: {region}')
        rw, rh = (right-left)*sw, (lower-upper)*sh
        scale = min(width / rw, height / rh)
        dw, dh = rw * scale, rh * scale
        ix = x + (width - dw) / 2
        if align_bottom:
            top += height - dh
        self.track(name, ix, top, dw, dh, 'image')
        self.c.saveState()
        clip = self.c.beginPath()
        clip.rect(ix, H-top-dh, dw, dh)
        self.c.clipPath(clip, stroke=0)
        self.c.translate(ix-left*sw*scale+sw*scale/2,
                         H-top+upper*sh*scale-sh*scale/2)
        self.c.rotate({3: 180, 6: -90, 8: 90}.get(orientation, 0))
        self.c.drawImage(reader, -iw * scale / 2, -ih * scale / 2,
                         width=iw * scale, height=ih * scale, mask='auto')
        self.c.restoreState()
        if caption:
            return self.para(caption, ix, top + dh + caption_gap, dw,
                             caption_size, caption_leading, MUTED, keep_words=True, align='center')
        return top + dh

    def badge(self, number, x, top, target=None):
        """Numbered editorial annotation, distinct from the source application UI."""
        self.c.saveState()
        if target:
            self.arrow([(x+9, top+9), target], ACCENT)
        self.c.setFillColor(ACCENT)
        self.c.setStrokeColor(PAPER)
        self.c.setLineWidth(1.2)
        self.c.circle(x+9, H-top-9, 9, fill=1, stroke=1)
        self.c.setFillColor(PAPER)
        self.c.setFont('Helvetica-Bold', 9)
        self.c.drawCentredString(x+9, H-top-12, str(number))
        self.c.restoreState()
        self.track(str(number), x, top, 18, 18, 'annotation')

    def svg(self, name, x, top, size):
        """Use the same transparent SVG source as the website, without rasterizing."""
        from svglib.svglib import svg2rlg  # optional at import time, required here
        drawing = svg2rlg(str(ROOT / 'src/assets/tech-stack' / f'{name}.svg'))
        scale = min(size / drawing.width, size / drawing.height)
        width, height = drawing.width * scale, drawing.height * scale
        drawing.scale(scale, scale)
        drawing.width, drawing.height = width, height
        self.track(name, x, top, width, height, 'svg')
        renderPDF.draw(drawing, self.c, x, H - top - height)

    def legend(self, number, title, detail, x, top, width):
        self.badge(number, x, top)
        self.para(title, x+28, top, width-28, 11, 16, bold=True)
        self.para(detail, x+28, top+23, width-28, 9.5, 15, MUTED, keep_words=True)

    def node(self, title, body, x, top, width, height=62, accent=False):
        self.c.setFillColor(TINT if not accent else HexColor('#f0ded6'))
        self.c.setStrokeColor(ACCENT if accent else LINE)
        self.c.setLineWidth(.75)
        self.c.rect(x, H-top-height, width, height, fill=1, stroke=1)
        self.para(title, x+10, top+8, width-20, 10.2, 14, bold=True)
        if body:
            self.para(body, x+10, top+28, width-20, 8.5, 12.2, MUTED)

    def arrow(self, points, color=ACCENT, dashed=False):
        if len(points) < 2 or points[-1] == points[-2]:
            raise ValueError('An arrow needs a nonzero final segment')
        self.arrows.append(dict(page=self.n, points=points))
        self.c.saveState()
        self.c.setStrokeColor(color)
        self.c.setFillColor(color)
        self.c.setLineWidth(.9)
        if dashed:
            self.c.setDash(3, 2)
        path = self.c.beginPath()
        path.moveTo(points[0][0], H-points[0][1])
        for x, y in points[1:]:
            path.lineTo(x, H-y)
        self.c.drawPath(path)
        x, y = points[-1]
        px, py = points[-2]
        import math
        angle = math.atan2(y-py, x-px)
        head = self.c.beginPath()
        head.moveTo(x, H-y)
        for sign in (-1, 1):
            a = angle + sign * .5
            head.lineTo(x-5*math.cos(a), H-(y-5*math.sin(a)))
        head.close()
        self.c.setDash()
        self.c.drawPath(head, fill=1, stroke=0)
        self.c.restoreState()

    def start(self, title, subtitle='', key=None, title_align='left'):
        self.n += 1
        self.c.setFillColor(PAPER)
        self.c.rect(0, 0, W, H, fill=1, stroke=0)
        self.para(title, M, 46, CW, 25, 33, bold=True, align=title_align)
        if subtitle:
            self.para(subtitle, M, 91, CW, 10.5, 16, MUTED, align=title_align)
        key = key or f'p{self.n}'
        self.c.bookmarkPage(key)
        self.c.addOutlineEntry(title, key, level=0, closed=False)
        self.pages.append(dict(page=self.n, key=key, title=title))

    def end(self, sources=None, rule_top=540):
        if rule_top is not None:
            self.rule(rule_top)
        if sources:
            self.link_row(sources, 549, size=9.5)
        page_number = f'{self.n:02d}'
        self.para(page_number, W / 2 - 24, 571, 48, 9.5, 12,
                  MUTED, align='center', limit=H - 10)
        self.checks[-1]['kind'] = 'page_number'
        self.c.showPage()

    def section(self, title, body, x, top, width, size=10.4, keep_words=True):
        self.para(title, x, top, width, 12.3, 18, bold=True)
        return self.para(body, x, top + 28, width, size, 16.5, keep_words=keep_words) + 18

    def technology(self, figure, sections, scope):
        """Source diagram with three readable implementation explanations."""
        self.image(figure, M, 137, 407, 300)
        self.rule(456, M, 407)
        self.para(scope, M, 470, 407, 9.6, 15.5, MUTED, keep_words=True)
        for top, (title, body) in zip((137, 267, 397), sections):
            self.para(title, 475, top, 328, 12.3, 18, bold=True)
            self.para(body, 475, top + 28, 328, 10.4, 16, keep_words=True)

    def note(self, heading, body, top, x=M, width=CW):
        self.rule(top, x, width, ACCENT, 1)
        self.para(heading, x, top + 12, width, 11, 17, bold=True)
        return self.para(body, x, top + 38, width, 9.7, 15.5, MUTED)

    def meta(self, rows, x=M, top=137, width=165):
        for label, body in rows:
            self.label(label, x, top)
            top = self.para(body, x, top + 18, width, 10, 16) + 21
        return top

    def flow(self, items, top, x=M, width=CW):
        gap = 28
        col = (width - gap * (len(items) - 1)) / len(items)
        for i, (title, detail) in enumerate(items):
            xx = x + i * (col + gap)
            self.rule(top, xx, col, ACCENT, 1.15)
            self.para(title, xx, top + 20, col, 11.4, 17, bold=True, align='center')
            self.para(detail.replace('\n', '<br/>'), xx, top + 50, col, 9.5, 15, MUTED, align='center')
            if i + 1 < len(items):
                technical_pages.connect(self,(xx,top,col,78),(xx+col+gap,top,col,78),MUTED)

    def award(self, index, x, top, width):
        project, title, date, asset = AWARDS[index]
        self.para(title, x, top, width, 11.3, 18, bold=True)
        lines = 2 if pdfmetrics.stringWidth(title, 'KoreanBold', 11.3) > width else 1
        self.para(f'{date} / {project}', x, top + 18 * lines + 5, width, 9.3, 15, MUTED)
        self.link('상장 보기', WEB + 'resume/' + asset, x, top + 18 * lines + 27, 9)

    def facts(self, items, top=405):
        """Small implementation notes between the main explanation and conclusion."""
        for i, (label, body) in enumerate(items):
            x = M + i * 262
            self.rule(top, x, 241)
            self.para(f'<b>{label}</b> {body}', x, top + 10, 241, 9.2, 14, MUTED)


def introduction(b):
    b.start('공세민', key='introduction')
    b.text('Se Min Kong', M, 108, 34, 'Helvetica-Bold')
    b.para('로봇·소프트웨어 개발', M, 162, 380, 18, 26, bold=True)
    b.para('센서 입력, 제어 명령, 실제 장비를 연결하는<br/>소프트웨어를 만듭니다.<br/><br/>숭실대학교 소프트웨어학부를 졸업하고<br/>SSAFY Robotics Track에서 공부하고 있습니다.',
           M, 204, 380, 11.6, 20, keep_words=True)
    b.image('@se-min-kong-profile.png', 448, 137, 180, 168)
    b.label('연락처', 650, 137)
    b.link('semin1224@gmail.com', 'mailto:semin1224@gmail.com', 650, 159, 10)
    b.link('github.com/SeMinKong', 'https://github.com/SeMinKong', 650, 183, 10)
    b.link('웹 포트폴리오', WEB, 650, 207, 10)
    b.label('교육', 650, 240)
    b.para('SSAFY Robotics Track<br/>2026.01 - 현재', 650, 258, 150, 10, 15)

    b.rule(322)
    b.para('자격', M, 334, 360, 13, 19, bold=True, align='center')
    for i, (title, issuer, valid, asset) in enumerate(CERTIFICATIONS):
        top = 359 + i * 64
        b.rule(top, M, 360, LINE, .7)
        b.center_link(title, WEB + 'resume/' + asset, M + 180, top + 10, 11.6)
        b.para(issuer, M, top + 29, 360, 9.3, 14, MUTED, align='center')
        b.para(valid, M, top + 44, 360, 9.3, 14, MUTED, align='center')

    b.para('수상', 430, 334, 373, 13, 19, bold=True, align='center')
    award_lines = [
        'SSAFY 공통 프로젝트<br/>우수상',
        'IT대학 소프트웨어 공모전<br/>금상',
        '숭실 캡스톤디자인 경진대회<br/>장려상',
        'IT 프로젝트 프로리그<br/>장려상',
    ]
    for index, (project, title, date, asset) in enumerate(AWARDS):
        top = 359 + (index // 2) * 64
        x = 430 + (index % 2) * 192
        b.rule(top, x, 176, LINE, .7)
        b.para(award_lines[index], x, top + 8, 176, 10.1, 14, bold=True, align='center')
        b.para(f'{date} · {project}', x, top + 43, 176, 9.3, 14, MUTED, align='center')

    b.rule(493)
    facts = [
        ('학력', '숭실대학교 소프트웨어학부 · 2020.03 - 2026.02'),
        ('관심 분야', 'Computer Vision · Robotics / Physical AI'),
        ('거주지', 'Suwon, Republic of Korea'),
    ]
    width = CW / 3
    for i, (label, body) in enumerate(facts):
        x = M + i * width
        b.para(label, x, 501, width, 9.3, 13, MUTED, bold=True, align='center')
        b.para(body, x, 518, width, 9.3, 14, MUTED, align='center', keep_words=True)
    b.end([('웹 포트폴리오', WEB), ('온라인 이력서', WEB + 'resume/'),
           ('프로젝트', WEB + 'work/')])


def capability(b):
    b.start('구현 경험', key='capability')
    titles = ['카메라 입력과 로봇 제어를 연결한 시스템 구현',
              'ROS 2와 웹 서버 간 비동기 데이터 연동',
              '다축 모터 제어와 텐던 구동계 통합',
              '학습·추론을 위한 데이터 변환 파이프라인 구축',
              '서버 기반 실시간 물리·게임 상태 관리',
              '영역별 LLM 대화와 설계 문서 생성']
    gap = 36
    width = (CW - gap) / 2
    for i, title in enumerate(titles):
        x = M + (i % 2) * (width + gap)
        top = 132 + (i // 2) * 64
        b.rule(top, x, width, ACCENT, .9)
        b.para(title, x, top + 19, width, 13.3, 20, bold=True, align='center', keep_words=True)

    b.rule(329)
    b.para('기술 스택', M, 345, CW, 14, 21, bold=True, align='center')
    column = CW / len(STACK)
    group_labels = ['Robotics · Simulation', 'Languages', 'AI · Vision',
                    'LLM · Backend', 'Platform · Collaboration']
    for i, (_, tools) in enumerate(STACK):
        x = M + i * column
        b.para(group_labels[i], x, 389, column, 10, 15, bold=True, align='center')
        for j, name in enumerate(tools):
            b.para(name, x, 418 + j * 19, column, 10.2, 15, align='center')
    b.end([('GitHub', 'https://github.com/SeMinKong'),
           ('학습 관심사', WEB + 'about/#questions-title')])


def closing(b):
    b.start('프로젝트 자료', 'README · 기술 문서 · 시연', key='closing', title_align='center')
    guide = [('README', '개요 · 역할 · 실행 방법'),
             ('기술 문서', '코드 · 계산식 · 검증 범위'),
             ('프로젝트 시연', '영상 · 실제 화면 · 결과 자료')]
    gap = 30
    width = (CW - gap * 2) / 3
    for i, (title, body) in enumerate(guide):
        x = M + i * (width + gap)
        b.rule(136, x, width, ACCENT, .9)
        b.para(title, x, 151, width, 12.5, 19, bold=True, align='center')
        b.para(body, x, 181, width, 10, 15, MUTED, align='center')

    b.rule(225)
    for i, spec in enumerate(project_pages.PROJECTS):
        x = M + (i % 3) * (width + gap)
        top = 250 + (i // 3) * 83
        b.para(spec['name'], x, top, width, 12, 18, bold=True, align='center')
        b.link_row([('README', spec['repo'] + 'blob/main/README.md'),
                    ('기술 문서', spec['repo'] + 'blob/main/' + spec['detail'])],
                   top + 31, size=10.2, center=x + width / 2, gap=25)

    b.rule(402)
    widget = qr.QrCodeWidget(WEB)
    x0, y0, x1, y1 = widget.getBounds()
    side = 70
    drawing = Drawing(side, side, transform=[side / (x1-x0), 0, 0, side / (y1-y0), 0, 0])
    drawing.add(widget)
    renderPDF.draw(drawing, b.c, (W - side) / 2, H - 418 - side)
    b.center_link('웹 포트폴리오', WEB, W / 2, 494, 10)
    b.link_row([('semin1224@gmail.com', 'mailto:semin1224@gmail.com'),
                ('github.com/SeMinKong', 'https://github.com/SeMinKong')], 520, size=10)
    b.end([('프로젝트', WEB + 'work/'), ('이력서 · 수상', WEB + 'resume/')])


PAGES = [introduction, capability,
         *[(lambda spec: lambda b: project_pages.project_page(b, spec, WEB, AWARDS))(spec)
           for spec in project_pages.PROJECTS],
         closing]
assert len(PAGES) == PAGE_COUNT


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--sample', action='store_true')
    parser.add_argument('--publish', action='store_true', help='Copy reviewed final output to public/')
    args = parser.parse_args()
    if args.sample and args.publish:
        parser.error('A sample cannot be published.')
    target = ROOT / ('tmp/pdfs/portfolio/revision-sample.pdf' if args.sample
                     else 'output/pdf/SeMinKong-Portfolio.pdf')
    b = Book(target, args.sample)
    for page in ([introduction, capability, PAGES[2]] if args.sample else PAGES):
        page(b)
    b.c.save()
    data = dict(version=VERSION, format='A4 landscape', pages=b.pages, elements=b.checks,
                arrows=b.arrows, connections=b.connections,
                awards=[dict(project=p, title=t, date=d, gallery=WEB+'resume/'+a) for p,t,d,a in AWARDS])
    target.with_suffix('.layout.json').write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding='utf-8')
    if args.publish:
        public = ROOT / 'public/portfolio/SeMinKong-Portfolio.pdf'
        shutil.copyfile(target, public)
    print(json.dumps(dict(file=str(target), pages=b.n, bytes=target.stat().st_size,
                         sha256=hashlib.sha256(target.read_bytes()).hexdigest().upper(),
                         sample=args.sample, published=args.publish), ensure_ascii=False))


if __name__ == '__main__':
    main()
