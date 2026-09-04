"""Editable 20-page landscape portfolio with source and reproduction visuals.

Run from the repository root. --sample makes a three-page layout check;
--publish copies the fully reviewed final bytes to the web download location.
Source visual content is preserved; sensitive metadata is removed from copies.
Diagrams are native PDF vectors based on code.
"""
from pathlib import Path
from io import BytesIO
import argparse
import hashlib
import json
import shutil
from urllib.parse import quote

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
PAGE_COUNT = 20
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
VERSION = '2026.09.04'
pdfmetrics.registerFont(TTFont('Korean', 'C:/Windows/Fonts/NanumGothic-Regular.ttf'))
pdfmetrics.registerFont(TTFont('KoreanBold', 'C:/Windows/Fonts/NanumGothic-Bold.ttf'))
pdfmetrics.registerFontFamily('Korean', normal='Korean', bold='KoreanBold')

THING = 'https://github.com/SeMinKong/THING/'
AQIS = 'https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/'
MRI = 'https://github.com/SeMinKong/BrainMRISegmentation_YOLO/'
ALK = 'https://github.com/SeMinKong/Alkkagi/'
BRIEF = 'https://github.com/capstone-btd/Briefit_AI/'
PROMPT = 'https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/'
MRI_REF = MRI + 'blob/3c9a0694dde759390c5813b60b60b5911448d716/'
ALK_REF = ALK + 'blob/530229c524a432c0016a28376a5c6fccd8f8e5b5/'
PROMPT_REF = PROMPT + 'blob/1972aa05d5caca05869a6ba588bf4b7573a7f678/'
BRIEF_COLLECT = BRIEF + 'commit/a7b25dff1438940fea631d8ba597835435b7c32a'
BRIEF_TRAIN = BRIEF + 'commit/714502c017f0c57ebebd634b60ea77a102945d81'
BRIEF_POST = BRIEF + 'commit/da4ea1b09cfd44724facc19233d65c07e4301f3a'
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
        self.c.setSubject('Introduction, About, six project cases and project awards')
        self.c.setKeywords('공세민, Se Min Kong, Software, Robotics, Portfolio')
        self.c.setViewerPreference('DisplayDocTitle', 'true')
        self.sample, self.n = sample, 0
        self.checks, self.pages, self.images = [], [], {}

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
             keep_words=False):
        style = ParagraphStyle('p', fontName='KoreanBold' if bold else 'Korean', fontSize=size,
                               leading=leading, textColor=color, wordWrap=None if keep_words else 'CJK',
                               splitLongWords=False, spaceAfter=0)
        p = Paragraph(text, style)
        _, height = p.wrap(width, H)
        self.track(text, x, top, width, height)
        p.drawOn(self.c, x, H - top - height)
        return top + height

    def rule(self, top, x=M, width=CW, color=LINE, weight=.65):
        self.c.setStrokeColor(color)
        self.c.setLineWidth(weight)
        self.c.line(x, H - top, x + width, H - top)

    def label(self, text, x, top):
        self.text(text, x, top, 8.7, 'Helvetica-Bold', ACCENT)

    def link(self, title, url, x, top, size=9, internal=False, limit=BOTTOM):
        self.text(title, x, top, size, 'Korean', ACCENT, limit=limit)
        width = pdfmetrics.stringWidth(title, 'Korean', size)
        rect = (x, H - top - size - 3, x + width, H - top + 2)
        if internal:
            self.c.linkRect('', url, rect, relative=0, thickness=0)
        else:
            self.c.linkURL(quote(url, safe=':/#?=&%@'), rect, relative=0, thickness=0)
        return width

    def image(self, name, x, top, width, height, region=(0, 0, 1, 1),
              caption=None, caption_size=9.5, caption_leading=15, caption_gap=10):
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
                             caption_size, caption_leading, MUTED, keep_words=True)
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

    def start(self, section, title, subtitle='', key=None):
        self.n += 1
        self.c.setFillColor(PAPER)
        self.c.rect(0, 0, W, H, fill=1, stroke=0)
        self.text('SE MIN KONG', M, 20, 8.5, 'Helvetica-Bold')
        self.text(section.upper(), 523, 20, 8.5, 'Helvetica', MUTED)
        self.rule(40)
        self.para(title, M, 57, CW, 25, 31, bold=True)
        if subtitle:
            self.para(subtitle, M, 97, CW, 9.5, 15, MUTED)
        key = key or f'p{self.n}'
        self.c.bookmarkPage(key)
        self.c.addOutlineEntry(title, key, level=0, closed=False)
        self.pages.append(dict(page=self.n, key=key, title=title))

    def end(self, sources=None):
        self.rule(548)
        x = M
        for title, url in sources or []:
            x += self.link(title, url, x, 557, 8.5, limit=H - 20) + 23
            if x > W - M + 23:
                raise ValueError(f'Page {self.n}: source row overflow')
        self.text('PORTFOLIO / ' + VERSION + (' / SAMPLE' if self.sample else ''),
                  M, 579, 7.3, 'Helvetica', MUTED, limit=H)
        self.text(f'{self.n:02d} / {"03" if self.sample else str(PAGE_COUNT)}',
                  W - M - 38, 577, 9, 'Helvetica-Bold', limit=H)
        self.c.showPage()

    def section(self, title, body, x, top, width, size=10.4, keep_words=False):
        self.para(title, x, top, width, 12.3, 18, bold=True)
        return self.para(body, x, top + 28, width, size, 16.5, keep_words=keep_words) + 18

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
        gap = 18
        col = (width - gap * (len(items) - 1)) / len(items)
        for i, (title, detail) in enumerate(items):
            xx = x + i * (col + gap)
            self.rule(top, xx, col, ACCENT, 1.15)
            self.label(f'{i + 1:02d}', xx, top + 11)
            self.para(title, xx, top + 31, col, 11.4, 17, bold=True)
            self.para(detail.replace('\n', '<br/>'), xx, top + 61, col, 9.5, 15, MUTED)
            if i + 1 < len(items):
                self.text('>', xx + col + 5, top + 33, 10, 'Helvetica', MUTED)

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
    b.start('Introduction', '공세민', key='introduction')
    b.text('Se Min Kong', M, 113, 57, 'Helvetica-Bold')
    b.text('SOFTWARE DEVELOPER', M, 185, 11, 'Helvetica-Bold', ACCENT)
    b.para('안녕하세요.<br/>새로운 것을 배우고<br/>직접 만드는 일이 즐겁습니다.', M, 239, 475, 24, 37, bold=True)
    b.para('숭실대학교에서 소프트웨어를 전공했고,<br/>현재 SSAFY Robotics Track에서 배움을 이어가고 있습니다.<br/>소프트웨어를 바탕으로 AI와 로보틱스에 관심을 넓혀가고 있습니다.',
           M, 373, 475, 11.2, 20)
    b.rule(476, M, 475)
    b.link('semin1224@gmail.com', 'mailto:semin1224@gmail.com', M, 494, 10)
    b.link('github.com/SeMinKong', 'https://github.com/SeMinKong', M, 515, 9.5)
    b.image('@se-min-kong-profile.png', 548, 113, 255, 240)
    b.rule(367, 548, 255, ACCENT, 1.5)
    b.meta([('NOW', 'SSAFY Robotics Track<br/>2026.01 - 현재')], 548, 383, 121)
    b.meta([('EDUCATION', '숭실대학교<br/>소프트웨어학부<br/>2020.03 - 2026.02')], 682, 383, 121)
    b.meta([('INTERESTS', 'Computer Vision<br/>Robotics / Physical AI')], 548, 471, 121)
    b.meta([('BASED IN', 'Seoul,<br/>Republic of Korea')], 682, 471, 121)
    b.end([('웹 포트폴리오', WEB), ('온라인 이력서', WEB + 'resume/')])


def about(b):
    b.start('About', '배우고 있는 것, 관심을 두고 있는 것',
            'Software Developer / Seoul', key='about')
    left, right = M, 330
    b.label('EDUCATION & EXPERIENCE', left, 139)
    b.section('숭실대학교 소프트웨어학부',
              '2020.03 - 2026.02<br/>소프트웨어 공학사<br/>인공지능·빅데이터 전공<br/>빅데이터 융합전공', left, 164, 250)
    b.rule(294, left, 250)
    b.section('SSAFY Robotics Track',
              '2026.01 - 현재<br/>삼성청년SW·AI아카데미 교육생<br/>로보틱스, Computer Vision, ROS 2와<br/>하드웨어·소프트웨어 통합을 공부합니다.', left, 311, 250)
    b.rule(433, left, 250)
    b.para('<b>병역</b> 2021.05 - 2022.11<br/>육군 전술 통신 장비 운용·정비 / 병장 전역<br/><br/><b>어학</b> OPIc IH / 2027.10까지 유효',
           left, 447, 250, 9.5, 16)
    b.label('CURRENT INTERESTS', right, 139)
    y = 164
    y = b.section('Computer Vision & Robotics',
                  '지금은 Computer Vision과 ROS 2, 로봇 제어를 중심으로 배우고 있습니다. 소프트웨어가 실제 장치와 만나는 로보틱스와 Physical AI에 관심이 있습니다.',
                  right, y, 473)
    b.rule(y - 5, right, 473)
    y = b.section('Simulation',
                  'Isaac Sim과 Isaac Lab은 현재 학습 중인 도구입니다. 센서 오차, 통신 지연, 접촉과 마찰처럼 시뮬레이션과 실제 환경 사이에서 달라지는 조건에 관심을 두고 있습니다.',
                  right, y + 12, 473)
    b.rule(y - 5, right, 473)
    y = b.section('Local AI & Software',
              'Ollama와 llama.cpp 등 로컬 AI 도구를 살펴보고 있습니다. Python과 C++를 사용하며, Ubuntu, Git, Docker와 같은 개발 환경도 함께 다룹니다.',
              right, y + 12, 473)
    b.rule(y - 5, right, 473)
    b.para('학습 중인 분야와 실제 구현 경험은 구분해 소개합니다.<br/>특정 분야에 한정하지 않고 소프트웨어 개발 직무 전반을 열어 두고 있습니다.',
           right, y + 12, 473, 9.7, 16, MUTED, keep_words=True)
    b.end([('About', WEB + 'about/'), ('학력·교육·어학', WEB + 'resume/')])


def project_index(b):
    b.start('Projects / Index', '프로젝트',
            '역할과 구현 범위를 먼저 보고, 관심 있는 사례를 자세히 읽을 수 있도록 정리했습니다.', key='projects')
    rows = [
        ('04 - 07', 'THING', '6인 팀 / 구동·기구 통합', 'DYNAMIXEL · U2D2 · 제어 스크립트', 'thing'),
        ('08 - 10', 'AQIS', '2인 팀 / 팀장·서버·장비 통합', 'FastAPI · WebSocket · ROS 2 · Dobot', 'aqis'),
        ('11 - 13', 'Briefit', '6인 팀 / AI 담당', 'Python · 비동기 수집 · KoBART', 'briefit'),
        ('14 - 16', 'Brain MRI', '개인 / 전처리·학습·통합 추론', 'YOLO11 · PyTorch · OpenCV', 'mri'),
        ('17 - 18', 'Alkkagi.io', '개인 / 클라이언트·서버·물리', 'TypeScript · React · Socket.IO', 'alkkagi'),
        ('19', 'Prompt Generator', '개인 / 대화 서버·상태 관리', 'FastAPI · WebSocket · LangChain', 'prompt'),
    ]
    b.label('PAGE', M, 139)
    b.label('PROJECT', 112, 139)
    b.label('ROLE', 337, 139)
    b.label('IMPLEMENTATION', 559, 139)
    for i, (pages, name, role, stack, key) in enumerate(rows):
        y = 162 + i * 47
        b.rule(y)
        b.text(pages, M, y + 15, 9, 'Helvetica-Bold', ACCENT)
        b.text(name, 112, y + 11, 15, 'Helvetica-Bold')
        b.para(role, 337, y + 14, 207, 9.5, 15)
        b.para(stack, 559, y + 14, 244, 9.1, 15, MUTED)
        if not b.sample:
            b.c.linkRect('', key, (M, H - y - 45, W - M, H - y), relative=0, thickness=0)
    b.note('프로젝트마다 같은 질문에 답합니다.',
           '무엇을 만들었는가 / 내가 맡은 범위는 어디인가 / 어떤 문제가 있었는가 / 왜 이 방식을 선택했는가 / 무엇을 확인했고 무엇이 남았는가',
           463)
    b.end([('프로젝트 전체 보기', WEB + 'work/'), ('공개 코드', 'https://github.com/SeMinKong')])


def thing_overview(b):
    b.start('01 / THING / Overview', 'THING - 손동작을 따라 움직이는 텐던 로봇 핸드',
            '카메라 입력부터 실제 손가락 구동, 관제와 기록까지 연결한 팀 프로젝트', key='thing')
    b.meta([('PERIOD', '2026.07 - 08'), ('TEAM / ROLE', '6인 팀<br/>모터 제어·기구 통합'),
            ('MY TOOLS', 'DYNAMIXEL / U2D2<br/>모터 점검·제어 스크립트'),
            ('TEAM STACK', 'ROS 2 / MediaPipe<br/>OpenCV / Jetson<br/>Raspberry Pi 5')])
    b.image('thing/integrated-robot-hand-portrait.webp', 233, 137, 215, 286)
    b.para('모터 고정부·스풀·텐던을 연결한 통합 조립 상태', 233, 433, 215, 8.8, 14, MUTED)
    b.section('무엇을 만들었나',
              '카메라에서 읽은 손동작을 7개 논리축 명령으로 바꾸고 텐던 로봇손을 구동합니다. 엄지는 3축, 나머지 네 손가락은 각각 1축으로 다룹니다. 팀 시스템은 21개 손 landmark를 인식하고, 명령 중재와 guard를 거쳐 모터를 구동하도록 구성했습니다.',
              476, 137, 327)
    b.section('내가 맡은 범위',
              '모터 통신 환경과 U2D2 연결, 7개 모터 점검·제어 스크립트, 전완부 아크릴 고정부 제작과 스풀·텐던 통합을 맡았습니다. 통신 확인, 개별 제어, 실제 조립을 각각 점검할 수 있도록 작업을 나눴습니다.',
              476, 265, 327)
    b.section('협업 범위',
              '손동작 인식, ROS 2 명령 중재·guard, 관제와 데이터 기록은<br/>팀 전체의 결과입니다. 이 사례에서는 직접 수행한<br/>구동·기구 작업을 중심으로 설명합니다.',
              476, 384, 327, keep_words=True)
    b.para('<b>SSAFY 공통 프로젝트 우수상</b> / 2026.08.10', 233, 492, 570, 10.5, 17, ACCENT)
    b.end([('팀 전체 구조', THING + 'blob/main/README.md'), ('실제 시연', WEB + 'work/thing/'),
           ('상장 전시', WEB + 'resume/' + AWARDS[0][3])])


def thing_architecture(b):
    b.start('01 / THING / Architecture', '사람의 손동작이 로봇의 손가락을 움직이기까지',
            '인식 → 명령 선택·안전 확인 → 모터 구동 / 아래 붉은 구동부가 직접 맡은 범위입니다.', key='thing-architecture')
    nodes = [
        ('손동작 촬영', '카메라\n사람의 손을 입력', 132),
        ('손동작 인식', 'Jetson / MediaPipe\n21개 손 관절점 추출', 146),
        ('명령·안전 확인', 'Raspberry Pi / ROS 2\n명령 중재·guard', 158),
        ('모터 제어', 'U2D2 / DYNAMIXEL\n7개 모터 구동', 132),
        ('손가락 구동', '스풀·텐던\n회전을 당기는 힘으로', 118),
    ]
    x = M
    for i, (title, detail, width) in enumerate(nodes):
        b.node(title, detail.replace('\n', '<br/>'), x, 169, width, 80, i >= 3)
        if i < 4:
            b.arrow([(x+width,209),(x+width+20,209)])
        x += width+20
    b.text('영상', 174, 148, 8.6, color=MUTED)
    b.text('관절 좌표·목표값', 312, 148, 8.6, color=MUTED)
    b.text('구동 명령', 490, 148, 8.6, color=MUTED)
    b.text('텐던 당김', 643, 148, 8.6, color=MUTED)
    b.node('관제 화면', '손 인식 영상·상태 확인<br/>WebSocket / MJPEG', 190, 306, 230, 70)
    b.node('데이터 기록', 'Jetson에서 기록·정리<br/>EC2에 저장', 463, 306, 230, 70)
    b.arrow([(263,249),(263,306)], MUTED)
    b.arrow([(292,249),(292,279),(577,279),(577,306)], MUTED)
    b.para('인식 결과는 관제에도 사용하며, 제어·모터 상태와 함께 기록합니다.', 38, 397, CW, 10, 16, MUTED)
    b.section('팀 시스템의 연결', '인식 장치에서 손의 움직임을 읽고, 명령 중재와 안전 확인을 거쳐 모터로 전달합니다. 관제 화면은 영상과 상태를 받아 사람이 동작을 확인할 수 있게 합니다.', M, 434, 359, 10)
    b.section('직접 맡은 연결', '모터 통신 환경, 점검·제어 스크립트, 아크릴 고정부와 스풀·텐던 조립을 맡았습니다. 손 인식·관제·안전 로직은 팀의 협업 결과입니다.', 439, 434, 364, 10)
    b.end([('제출 발표자료', THING + 'blob/2381e8e3cb46c083be6ce024a3eb88bc75674f12/output/15기_공통PJT_발표자료_C103.pptx'),
           ('시스템 문서', THING + 'blob/main/docs/architecture.md')])


def thing_control(b):
    b.start('01 / THING / Implementation', '모터의 회전을 손가락을 당기는 힘으로 바꾸기',
            '모터가 스풀을 돌리면 텐던이 감기고, 연결된 손가락이 굽혀집니다.', key='thing-control')
    b.image('@thing-spool-tendon.jpg', M, 137, 305, 229,
            caption='구동부 내부: 모터·스풀·텐던 연결', caption_size=9.1, caption_leading=14)
    b.image('@thing-acrylic-mount.jpg', 365, 137, 157, 229,
            caption='전완부 모터 고정부', caption_size=9.1, caption_leading=14)
    b.badge(1, 63, 223, (87,253))
    b.badge(2, 125, 186, (144,209))
    b.badge(3, 226, 219, (213,251))
    b.badge(4, 483, 274, (475,292))
    b.legend(1, '모터', '명령을 받아 회전을 만듭니다.', 559, 137, 244)
    b.legend(2, '스풀', '모터와 함께 돌며 텐던을 감습니다.', 559, 195, 244)
    b.legend(3, '텐던', '주황색 줄이 손가락을 당깁니다.', 559, 253, 244)
    b.legend(4, '아크릴 고정부', '모터의 위치를 고정하는 틀입니다.', 559, 311, 244)
    b.rule(411)
    b.section('통신부터 분리해 점검', '7개 모터 ID 응답을 확인한 뒤 개별 모터를<br/>움직였습니다. 연결 문제와 조립 문제를 구분해<br/>확인하는 순서를 만들었습니다.', M, 429, 241, 9.8, keep_words=True)
    b.section('필요한 동작을 명령으로', '단일·키보드 제어, 원위치 복귀와 정지<br/>스크립트를 작성했습니다. 조립 중 필요한 동작을<br/>나눠 실행하도록 했습니다.', 300, 429, 241, 9.8, keep_words=True)
    b.section('조립 상태까지 확인', '아크릴 고정부를 제작하고 스풀·텐던을<br/>통합했습니다. 감김 방향, 장력과 프레임 간섭을<br/>실제 조립 상태에서 점검했습니다.', 562, 429, 241, 9.8, keep_words=True)
    b.end([('7/28 제어 기록', THING + 'blob/main/docs/daily-reports/2026-07-28/2026-07-28-공세민.md'),
           ('7/29 제작 기록', THING + 'blob/main/docs/daily-reports/2026-07-29/2026-07-29-공세민.md'),
           ('7/31 조립 기록', THING + 'blob/main/docs/daily-reports/2026-07-31/2026-07-31-공세민.md')])


def thing_result(b):
    b.start('01 / THING / Result', '시연 결과와 수상',
            '손동작 인식과 모터·텐던 구동을 연결해 손가락 동작과 물체 파지를 구현했습니다.', key='thing-result')
    b.image('@thing-video-can-0010.jpg', M, 137, 302, 340, region=(.08,.25,.95,.94),
            caption='엄지와 손가락으로 원통형 물체를 감싸 쥐는 동작')
    b.label('PROJECT AWARD', 380, 137)
    b.award(0, 380, 162, 423)
    b.rule(251, 380, 423)
    b.section('시연한 동작', '사람의 손동작 모방, 손가락 순차 동작, 캔과 부드러운 물체 파지를 시연했습니다. 모터 명령이 기구를 거쳐 실제 손가락 동작으로 이어지는 것을 확인했습니다.', 380, 269, 423)
    b.section('이 작업에서 배운 점', '통신 성공과 원하는 동작의 완성은 다른 문제였습니다. 개별 모터 제어와 조립 상태를 나눠 확인하면서, 소프트웨어 명령과 물리적인 연결을 함께 다루는 경험을 했습니다.', 380, 367, 423)
    b.para('<b>다음 과제</b> 반복 파지 성공률, 지연과 장력 변화를 같은 조건으로 측정해<br/>동작의 재현성을 기록하는 것입니다.', 380, 461, 423, 9.7, 16, MUTED, keep_words=True)
    b.end([('원본 파지 영상', THING + 'blob/main/media/videos/모방캔파지.mp4'), ('파지 시험 절차', THING + 'blob/main/tests/procedures/grasp-test.md'),
           ('팀 안전 구조', THING + 'blob/main/docs/safety_manager.md')])


def aqis_overview(b):
    b.start('02 / AQIS / Overview', 'AQIS - 검출 결과를 공정의 다음 동작으로',
            '검사, 컨베이어, Dobot과 RealOps 관제를 연결한 스마트 팩토리 시스템', key='aqis')
    b.image('@aqis-video-inspection-0010.jpg', M, 137, 508, 286)
    b.badge(1, 246, 247, (219,275))
    b.badge(2, 427, 222, (400,248))
    b.badge(3, 485, 358, (463,378))
    b.para('검출 영역, 작업 대기열과 실제 장비의 동작을 함께 보는 RealOps 관제 화면', M, 433, 508, 9.2, 15, MUTED)
    b.para('2026.05 기획 / 06 본 개발<br/><b>2인 팀 · 팀장</b><br/>Full-stack & Robot Integration', 576, 137, 227, 10.1, 18)
    b.rule(208,576,227)
    b.legend(1, '검사 대상과 검출 영역', '카메라에서 인식한 대상의 위치와<br/>집기 영역을 확인합니다.', 576, 225, 227)
    b.legend(2, '판정과 작업 대기열', '검사 결과와 처리할 작업을<br/>관제 화면에서 확인합니다.', 576, 310, 227)
    b.legend(3, '로봇·컨베이어 동작', '물체를 옮기는 장비의 동작을<br/>검사 화면과 함께 봅니다.', 576, 395, 227)
    b.para('<b>직접 맡은 일</b> React 관제, FastAPI·WebSocket, ROS 2 연결, 장비 adapter와 Dobot 집기 시퀀스를 담당했습니다. LLM 명령과 키워드 fallback도 연결했습니다.<br/><b>협업</b> 팀원은 모델 학습·Roboflow·CAD·시뮬레이션을 맡았습니다.', M, 474, 508, 9.7, 15.5)
    b.end([('역할·일정', AQIS + 'blob/main/docs/07-roles-and-schedule.md'), ('전체 구조', AQIS + 'blob/main/README.md'),
           ('원본 장비 시연', 'https://github.com/user-attachments/assets/70017e3e-594d-43b2-bcef-59bb4a8f0c32')])

def aqis_mock(b):
    b.start('02 / AQIS / Architecture', '공통 서버 아래에 장비별 연결을 분리하기',
            '화면은 공통 API만 사용하고, 서버가 검출 정보와 장비별 명령을 연결합니다.', key='aqis-mock')
    b.node('작업자가 보는 관제 화면', 'React / RealOps<br/>명령 전송·작업 상태 확인', M, 139, 241, 66)
    b.node('공정을 확인하는 시뮬레이션', 'RoboDK<br/>동일한 REST API 사용', 300, 139, 241, 66)
    b.node('문장으로 내리는 명령', 'LLM 연결은 선택 사항<br/>미연결 시 키워드 규칙 사용', 562, 139, 241, 66)
    b.node('공통 서버 · 명령과 상태를 한곳에서 관리', 'FastAPI / REST / WebSocket · 공정 상태·검출 이벤트 관리 · 장비 연결 경로 선택', M, 251, CW, 66, True)
    b.arrow([(112,205),(112,251)])
    b.arrow([(215,251),(215,205)], MUTED)
    b.arrow([(420,205),(420,251)])
    b.arrow([(682,251),(682,205)], dashed=True)
    b.text('명령', 78, 219, 8.6, color=MUTED)
    b.text('상태', 227, 219, 8.6, color=MUTED)
    b.text('공정 요청', 435, 219, 8.6, color=MUTED)
    b.text('해석 요청', 699, 219, 8.6, color=MUTED)
    b.node('컨베이어 제어', '정지·재개·분류기 명령<br/>Conveyor adapter / HTTP', M, 364, 241, 70)
    b.node('카메라·로봇 상태 수집', '검출 위치·깊이·장비 상태<br/>Vision / ROS 2 bridge', 300, 364, 241, 70)
    b.node('로봇의 집기·놓기', '대상 좌표로 이동·분류<br/>Dobot sequence', 562, 364, 241, 70)
    for x in [158,682]:
        b.arrow([(x,317),(x,364)])
    b.arrow([(420,364),(420,317)], MUTED)
    b.text('제어 명령 ↓', M, 337, 9.1, color=MUTED)
    b.text('검출·상태 ↑', 439, 337, 9.1, color=MUTED)
    b.text('집기 명령 ↓', 700, 337, 9.1, color=MUTED)
    b.para('<b>구현 선택</b> 장비를 사용할 수 없는 동안 가상 장비 응답(Mock)으로 관제와 공통 API를 먼저 개발했습니다. 같은 인터페이스 아래 실제 장비 연결을 교체하도록 했습니다.', M, 461, 359, 9.7, 15.5)
    b.para('<b>분리한 이유</b> UI에서 장비별 통신을 직접 다루지 않게 했습니다. 관제 화면을 유지한 채 서버의 장비 연결부와 집기 시퀀스를 각각 점검할 수 있습니다.', 439, 461, 364, 9.7, 15.5)
    b.end([('Mock-first 결정', AQIS + 'blob/main/docs/day1-decisions.md'), ('서버 구현', AQIS + 'blob/main/server/app/main.py'),
           ('좌표 테스트', AQIS + 'blob/main/server/tests/test_real_monitoring.py')])

def aqis_coordinates(b):
    b.start('02 / AQIS / Troubleshooting', '검출한 순간의 좌표로 바로 집지 않기',
            '문제: 컨베이어 위 대상이 이동하면, 로봇이 도착할 때 최초 검출 좌표는 이미 오래된 정보입니다.', key='aqis-coordinates')
    b.para('같은 물체라도 시간이 지나면 위치가 달라집니다.', M, 135, CW, 11.3, 18, bold=True)
    b.c.setFillColor(TINT)
    b.c.roundRect(M, H-238, 490, 58, 5, fill=1, stroke=0)
    for x, color in [(137, MUTED),(391,ACCENT)]:
        b.c.setFillColor(color)
        b.c.circle(x,H-209,13,fill=1,stroke=0)
    b.arrow([(163,209),(363,209)],MUTED)
    b.text('컨베이어 이동',225,187,9.4,color=MUTED)
    b.para('처음 검출한 위치 X1',60,249,205,10.1,16,MUTED)
    b.para('대기 후 다시 검출한 위치 X2',306,249,223,10.1,16,ACCENT,True)
    b.section('로봇에는 갱신한 좌표 전달', 'X1을 계속 사용하지 않고, 정지 요청 후 준비 시점이 지난 검출에서 집기 좌표를 다시 계산합니다.', 570, 176, 233, 10)
    b.flow([('검출 수신', '작업 조건 확인'), ('정지 요청·대기', '기본 대기 0.6초'), ('새 검출 선택', '시각·깊이 정보 확인'), ('집기·분류·재개', '성공·실패에 따라 분기')], 296)
    b.section('같은 대상을 두 번 집지 않기', '객체 ID, 검출 영역 겹침과 중심 거리로 중복 여부를 판단합니다. 작업 중에는 집기 명령의 중복 실행도 막습니다.', M, 413, 359, 9.7)
    b.section('현재 구현의 한계', '설정 시간 대기이며 센서로 정지를 확인하지는 않습니다. 시간 정보 없는 검출과 깊이 없는 고정 좌표 경로도 있어, 실물 적용 전 정지·좌표 검증을 보강해야 합니다.', 439, 413, 364, 9.7)
    b.end([('이벤트 처리', AQIS + 'blob/main/server/app/main.py'), ('관련 테스트', AQIS + 'blob/main/server/tests/test_real_monitoring.py'),
           ('Dobot 시퀀스', AQIS + 'blob/main/server/app/services/dobot_pick_place.py'),
           ('중복 판정', AQIS + 'blob/main/server/app/services/detection_deduper.py'),
           ('기본 설정', AQIS + 'blob/main/server/app/config.py')])


def briefit_overview(b):
    b.start('03 / Briefit / Overview', 'Briefit - 여러 기사를 짧은 요약으로 읽는 뉴스 서비스',
            '기사 수집, 요약 모델 학습과 생성된 문장의 후처리 등 AI·데이터 작업을 담당했습니다.', key='briefit')
    b.meta([('PERIOD', '2025.05 - 09'), ('TEAM / ROLE', '6인 팀 / AI 2인<br/>본인: AI 담당'),
            ('MY STACK', 'Python / aiohttp<br/>BeautifulSoup<br/>Transformers / KoBART')])
    b.image('briefit/cover.webp', 233, 137, 570, 246,
            caption='뉴스를 모아 읽고 요약을 확인하는 서비스 / 제품 UI는 팀의 협업 결과입니다.',
            caption_size=9.2, caption_leading=14)
    b.section('직접 구현한 범위', '기사 수집 배치화, URL 필터·중복 제거,<br/>KoBART 데이터 분할·학습·생성·ROUGE 평가<br/>스크립트와 반복 종결문 후처리를 작성했습니다.',
              233, 428, 275, keep_words=True)
    b.section('프로젝트 수상', 'IT대학 소프트웨어 공모전 금상<br/>숭실 캡스톤디자인 경진대회 장려상<br/>IT 프로젝트 프로리그 장려상<br/>수상 날짜와 상장은 13쪽에 정리했습니다.',
              533, 428, 270, 9.8)
    b.end([('팀 소개', 'https://github.com/capstone-btd/.github/blob/main/profile/README.md'),
           ('당시 KoBART 작업', BRIEF_TRAIN), ('웹 상세', WEB + 'work/briefit/')])


def briefit_data(b):
    b.start('03 / Briefit / Data architecture', '요약을 배우는 과정과 사용하는 과정을 분리하기',
            '직접 구현한 2025년 KoBART 작업 / 학습·기사 요약·평가를 별도 스크립트로 구성했습니다.', key='briefit-data')
    for top, number, heading, nodes in [
        (137,1,'요약 방법 학습', [('기사·기준 요약','학습 / 검증 / 평가로 분할'),('KoBART 학습','기사 → 요약을 학습'),('학습한 모델 저장','요약과 평가에서 불러오기')]),
        (260,2,'새로운 기사 요약', [('기사 수집·정리','URL 중복 제거·본문 추출'),('요약문 생성','저장한 KoBART 모델 사용'),('반복 문장 정리','후처리 후 요약문 출력')]),
        (383,3,'요약 결과 평가', [('별도 평가 데이터','기사와 기준 요약 입력'),('후처리 전 요약 생성','후처리 미적용'),('기준 요약과 비교','ROUGE-1 / 2 / L 평가')]),
    ]:
        b.badge(number,M,top)
        b.para(heading,M+28,top,505,12,18,bold=True)
        for i,(title,detail) in enumerate(nodes):
            x=M+i*186
            b.node(title,detail,x,top+33,155,64,i==1)
            if i<2:
                b.arrow([(x+155,top+65),(x+186,top+65)])
    b.label('DATA / 3,524 RECORDS',604,139)
    b.para('데이터를 약 8 : 1 : 1로 분리',604,166,199,11,17,bold=True)
    x=604
    for value,color in [(2819,ACCENT),(352,MUTED),(353,LINE)]:
        width=199*value/3524
        b.c.setFillColor(color)
        b.c.rect(x,H-216,width,16,fill=1,stroke=0)
        x+=width
    for i,(title,count,detail) in enumerate([('학습용','2,819','모델의 가중치를 학습'),('검증용','352','학습 중 결과를 확인'),('평가용','353','기준 요약과 최종 비교')]):
        top=235+i*63
        b.para(f'<b>{title} {count}건</b><br/>{detail}',604,top,199,10,17)
    b.rule(433,604,199)
    b.para('<b>수집 단계의 선택</b><br/>실행 전체에서 URL 중복을 제거하고, 댓글 URL과 짧은 본문을 제외했습니다.',604,448,199,9.6,16,MUTED)
    b.para('평가는 후처리 전 생성문을 비교하므로, 후처리의 효과는 별도로 확인해야 합니다.',M,503,527,9.5,15,MUTED)
    b.end([('수집 변경', BRIEF_COLLECT), ('학습·평가 구현', BRIEF_TRAIN), ('분할·후처리 근거', BRIEF_POST)])

def briefit_result(b):
    b.start('03 / Briefit / Result & Awards', '요약 끝에 반복되는 문장을 정리했습니다',
            '문자열 규칙을 적용하는 후처리 / 아래 문장은 동작 설명을 위한 예시입니다.', key='briefit-result')
    b.para('정리 전 · 예시', M, 137, 359, 12, 18, bold=True)
    b.rule(162, M, 359)
    b.para('지역 도서관은 다음 주부터 주말 운영 시간을 늘린다. 이용자는 토요일 저녁에도 자료를 열람할 수 있다. <font color="#a73524"><b>밝혔다. 밝혔다.</b></font>', M, 177, 359, 12.2, 21)
    b.arrow([(55,254),(55,282)])
    b.para('반복되거나 짧은 끝 문장을 규칙으로 제거',82,256,315,9.7,16,ACCENT)
    b.para('정리 후', M, 292, 359, 12, 18, bold=True)
    b.rule(315, M, 359)
    b.para('지역 도서관은 다음 주부터 주말 운영 시간을 늘린다. 이용자는 토요일 저녁에도 자료를 열람할 수 있다.', M, 330, 359, 12.2, 21)
    b.para('<b>구현 선택</b> 모델을 다시 학습하지 않고 생성 뒤 반복 표현을 정리하는 단계를 추가했습니다. 의미나 사실을 검증하는 기능은 아닙니다.', M, 410, 359, 9.7, 15.5)
    b.note('경계 조건도 함께 확인', '«비가 온다.»처럼 유효하지만 짧은 문장도 빈 문자열이 됩니다. 반복 표현 감소와 함께 정보 누락을 비교해야 합니다.', 463, M, 359)
    b.label('PROJECT AWARDS / BRIEFIT', 439, 139)
    for index, top in [(1,170),(2,287),(3,405)]:
        b.award(index,439,top,364)
        if index<3:
            b.rule(top+98,439,364)
    b.para('상장 링크는 타인 수상자·학번·일련번호를 가린 전시용 이미지입니다.',439,513,364,8.5,14,MUTED)
    b.end([('원본 후처리 함수', BRIEF_POST), ('학습·생성 커밋', BRIEF_TRAIN),
           ('웹 수상 전시', WEB+'resume/#awards-title')])

def mri_overview(b):
    b.start('04 / Brain MRI / Overview', 'Brain MRI - 종양의 종류와 위치를 함께 보기',
            '개인 프로젝트 / 2026.02 - 04 / Python · PyTorch · YOLO11 · OpenCV', key='mri')
    b.image('@mri-video-overlay-007733.png', M, 137, 452, 353,
            region=(476/1320,195/1032,1217/1320,815/1032),
            caption='① 왼쪽: 예측 영역 표시　② 오른쪽: 원본<br/>분류 결과는 수막종(Meningioma)으로 표시됩니다.')
    b.badge(1,82,230,(197,250))
    b.badge(2,411,230,(320,285))
    b.section('무엇을 구현했나', '분류와 분할을 각각 수행하는 두 YOLO11 모델의 학습·추론 경로를 구성했습니다. 분류 범주와 분할 위치를 하나의 이미지에서 함께 볼 수 있게 했습니다.',
              520, 137, 283)
    b.section('입력 형식의 문제', '원본 마스크를 그대로 쓰는 대신 분할 학습에 필요한 polygon label로 바꿔야 했습니다. 이진화, 형태학 처리, 외곽선 추출과 좌표 정규화를 연결했습니다.',
              520, 255, 283)
    b.section('본인 범위', '데이터 변환, 학습 설정과 통합 추론 코드를<br/>작성했습니다. 두 모델을 독립적으로 학습하고,<br/>결과를 한 화면에서 비교하도록 구성했습니다.',
              520, 373, 283, keep_words=True)
    b.rule(470, 520, 283)
    b.para('<b>사용 목적</b> 연구·학습용 프로젝트이며<br/>임상 진단을 위한 검증은 수행하지 않았습니다.',
           520, 483, 283, 9.2, 14, MUTED, keep_words=True)
    b.end([('전처리·학습', MRI_REF + 'src/training/train.py'), ('통합 추론', MRI_REF + 'src/testing/test.py'),
           ('원본 데모 영상', 'https://github.com/user-attachments/assets/9994b0b3-187b-4c12-bfd3-170f6bb8dda5')])


def mri_method(b):
    b.start('04 / Brain MRI / Architecture', '두 모델을 독립적으로 학습하고 추론 결과를 합치기',
            '같은 MRI를 두 모델에 각각 입력합니다. 한 모델의 결과를 다른 모델의 입력으로 사용하지 않습니다.', key='mri-method')
    b.node('MRI 이미지', '같은 이미지 입력', M, 211, 153, 66)
    b.node('어떤 종류인가요?', 'YOLO11 분류 모델<br/>이미지의 범주 예측', 241, 143, 210, 72, True)
    b.node('어디에 있나요?', 'YOLO11 분할 모델<br/>위치·영역 예측', 241, 266, 210, 72, True)
    b.node('종류', '분류명·점수', 500, 149, 134, 60)
    b.node('영역', '영역·경계 표시', 500, 272, 134, 60)
    b.node('한 화면에서 비교', '분류 이름과<br/>영역을 원본<br/>이미지 위에 표시', 677, 203, 126, 85)
    b.arrow([(191,244),(215,244),(215,179),(241,179)])
    b.arrow([(215,244),(215,302),(241,302)])
    b.arrow([(451,179),(500,179)])
    b.arrow([(451,302),(500,302)])
    b.arrow([(634,179),(656,179),(656,224),(677,224)])
    b.arrow([(634,302),(656,302),(656,267),(677,267)])
    b.para('학습 입력은 작업에 맞게 나눕니다. 분류는 폴더별 이미지, 분할은 마스크를 변환한 polygon label을 사용합니다.', M, 360, CW, 9.5, 15, MUTED)
    b.section('학습 데이터 준비', '영역을 채운 마스크에서 테두리를 추출해 분할 모델의 학습 좌표로 바꿉니다. 다음 쪽에서는 이 변환 과정을 예시로 설명합니다.', M, 400, 241, 9.7)
    b.section('현재 평가 조건', '학습 코드는 test 경로를 검증용 val에 연결합니다. 최종 성능을 판단하려면 학습·검증에서 사용하지 않은 별도 데이터로 평가해야 합니다.', 300, 400, 241, 9.7)
    b.section('데이터 해석', 'BRISC는 환자 식별 정보가 없어 환자 단위 독립성을 보장하기 어렵습니다. 비종양에도 병변이 포함될 수 있습니다. 임상 진단 검증은 수행하지 않았습니다.', 562, 400, 241, 9.7)
    b.end([('전처리·학습', MRI_REF+'src/training/train.py'), ('통합 추론', MRI_REF+'src/testing/test.py'),
           ('BRISC 원문', 'https://arxiv.org/html/2506.14318v5')])

def mri_preprocessing(b):
    b.start('04 / Brain MRI / Preprocessing', '영역을 채운 이미지에서 학습용 테두리 좌표로',
            '변환 과정 설명용 예시 / 검정은 영역, 흰색은 배경이며 실제 MRI나 모델 예측은 아닙니다.', key='mri-preprocessing')
    evidence = json.loads((FIGURES/'reproduction-evidence.json').read_text(encoding='utf-8'))['mri']
    stages = evidence['numeric_stage_matrices_rle']
    labels = [('threshold','예시 입력'), ('close','구멍 메우기'),
              ('open','작은 잡음 제거'), ('polygon','테두리 좌표로 저장')]
    for i, (key, title) in enumerate(labels):
        x = M + i * 194
        b.badge(i+1,x,139)
        b.para(title,x+25,139,154,11.4,17,bold=True)
        side, top, cell = 146, 180, 146/64
        gx = x + 14
        b.c.setFillColor(HexColor('#ffffff'))
        b.c.setStrokeColor(LINE)
        b.c.rect(gx,H-top-side,side,side,fill=1,stroke=1)
        if key != 'polygon':
            for row in stages[key]['rows']:
                for start, end, value in row['runs']:
                    b.c.setFillColor(INK if value > 1 else LINE)
                    b.c.rect(gx+start*cell,H-top-(row['row']+1)*cell,
                             (end-start)*cell,cell,fill=1,stroke=0)
        else:
            points=[(16,16),(16,47),(47,47),(47,16)]
            b.c.setStrokeColor(ACCENT)
            b.c.setLineWidth(1.6)
            outline=b.c.beginPath()
            outline.moveTo(gx+points[0][0]*cell,H-top-points[0][1]*cell)
            for xx,yy in points[1:]:
                outline.lineTo(gx+xx*cell,H-top-yy*cell)
            outline.close()
            b.c.drawPath(outline)
            b.c.setFillColor(ACCENT)
            for xx,yy in points:
                b.c.circle(gx+xx*cell,H-top-yy*cell,3,fill=1,stroke=0)
        b.track(key+' synthetic numeric matrix', gx, top, side, side, 'diagram')
        details = {'threshold':'영역 안의 작은 구멍과<br/>바깥의 잡음이 남아 있습니다.',
                   'close':'영역 안에 비어 있던<br/>작은 구멍을 메웁니다.',
                   'open':'영역 바깥에 떨어진<br/>작은 점을 제거합니다.',
                   'polygon':'테두리의 네 꼭짓점을<br/>정규화한 좌표로 저장합니다.'}
        b.para(details[key],x,343,177,10,16,MUTED)
        if i < 3:
            b.arrow([(x+166,253),(x+187,253)],MUTED)
    b.rule(406)
    b.section('왜 변환했나', '원본은 영역 내부를 채운 마스크 이미지입니다. YOLO 분할 학습에는 테두리 좌표가 필요하므로, 작은 구멍과 잡음을 정리한 뒤 외곽선을 추출했습니다.', M, 427, 359, 10)
    b.section('학습 파일에는 무엇을 저장하나', '종류를 나타내는 클래스 번호와 테두리의 꼭짓점을 저장합니다. 좌표를 이미지 너비·높이로 나눠 0~1 범위로 바꾸면 이미지 크기와 무관하게 위치를 표현할 수 있습니다.', 439, 427, 364, 10)
    b.end([('원본 변환 함수', MRI_REF+'src/training/train.py'), ('프로젝트 설명', WEB+'work/brain-tumor-mri/')])


def alkkagi_overview(b):
    b.start('05 / Alkkagi.io / Overview', 'Alkkagi.io - 돌을 튕겨 상대를 밀어내는 실시간 알까기',
            '개인 프로젝트 / 2026.03 - 04 / React · TypeScript · Node.js · Socket.IO', key='alkkagi')
    b.image('@alkkagi-video-aim-0007.png', M, 137, 364, 362)
    b.badge(1,169,279,(194,312))
    b.badge(2,225,345,(238,320))
    b.badge(3,292,291,(269,326))
    b.para('드래그로 조준하고 놓으면 내 돌이 발사됩니다.', M, 511, 364, 9.5, 15, MUTED)
    b.para('상대 돌을 보드 밖으로 밀어내면<br/>점수가 오르고 내 돌이 성장합니다.', 439, 137, 364, 14, 22, bold=True)
    b.legend(1,'내 돌','드래그를 시작하는 플레이어의 돌입니다.',439,201,364)
    b.legend(2,'방향·세기','노란 조준선으로 발사 방향과 세기를 표시합니다.',439,264,364)
    b.legend(3,'상대 돌','충돌로 상대를 보드 밖으로 밀어내는 것이 목표입니다.',439,327,364)
    b.rule(399,439,364)
    b.section('직접 구현한 범위', '조준 UI, 실시간 통신과 서버 물리를 구현했습니다. 서버가 위치·충돌·마찰을 계산하고 모든 플레이어에게 같은 상태를 전달합니다. 외부 물리 엔진 없이 TypeScript로 작성했습니다.',439,418,364,10.1)
    b.end([('서버 루프', ALK_REF + 'server/index.ts'), ('물리 계산', ALK_REF + 'server/physics.ts'),
           ('원본 플레이 영상', 'https://github.com/user-attachments/assets/20bc9007-97ea-4cc4-948a-e1d901ea8f4b')])


def alkkagi_physics(b):
    b.start('05 / Alkkagi.io / Architecture & Physics', '서버에서 물리를 확정하고, 브라우저는 결과를 표시',
            '내 입력 → 서버의 충돌 계산 → 두 플레이어에게 같은 결과 / 상태는 서버 메모리에 유지합니다.', key='alkkagi-physics')
    b.node('내 브라우저의 입력', '드래그 방향·세기 전송<br/>React / Socket.IO', M, 177, 190, 75)
    b.node('서버에서 결과 확정', '입력 검증 → 이동·충돌·마찰 계산<br/>모든 돌의 위치와 점수 갱신<br/>60Hz 목표 루프 / 10 substeps', 285, 177, 246, 86, True)
    b.node('내 브라우저', '같은 상태로 돌의 위치 표시', 588, 143, 215, 63)
    b.node('상대 브라우저', '같은 상태로 돌의 위치 표시', 588, 235, 215, 63)
    b.arrow([(228,214),(285,214)])
    b.arrow([(531,219),(558,219),(558,175),(588,175)])
    b.arrow([(558,219),(558,267),(588,267)])
    b.para('서버가 유일한 기준 상태를 가지므로, 브라우저마다 다른 충돌 결과를 확정하지 않습니다.',M,322,CW,10.4,17,bold=True)
    b.section('01. 겹친 돌을 분리', '충돌 순간 두 돌이 겹치면 겹친 거리의 절반씩 위치를 옮깁니다. 이미 서로 멀어지는 중이면 추가 충돌 힘을 적용하지 않습니다.', M, 366, 241, 10)
    b.section('02. 질량에 따른 충돌', '반발계수, 상대 속도와 질량으로 속도를 갱신합니다. 점수가 오를수록 반경과 질량이 함께 증가해 돌의 충돌 특성이 달라집니다.', 300, 366, 241, 10)
    b.section('03. 입력 제한과 마찰', '입력 간격을 500ms로 제한하고 발사 속도에 상한을 둡니다. 이동하는 동안 마찰을 적용해 속도가 점차 줄어들도록 했습니다.', 562, 366, 241, 10)
    b.para('<b>후속 검증</b> 동시접속자가 늘어날 때의 지연과 지속 프레임률은 별도로 측정해야 합니다. 서버 재시작 시 상태 복구도 추가 과제입니다.',M,495,CW,9.6,16,MUTED)
    b.end([('서버·입력 제한', ALK_REF+'server/index.ts'), ('물리 구현', ALK_REF+'server/physics.ts')])

def prompt_generator(b):
    b.start('06 / Prompt Generator / Architecture', '설계 질문을 여섯 영역의 대화로 나누기',
            '개인 프로젝트 / 2026 / FastAPI · WebSocket · LangChain · Solar Pro', key='prompt')
    b.node('아이디어 입력', '만들고 싶은 프로젝트 설명', M, 187, 161, 65)
    b.para('여섯 영역의 질문·답변',244,137,280,12,18,bold=True)
    b.c.setStrokeColor(MUTED)
    b.c.setLineWidth(.8)
    b.c.rect(237,H-314,295,151,fill=0,stroke=1)
    for i,title in enumerate(['화면·사용성','시스템 구조','데이터 저장','API','배포','테스트']):
        x=244+(i%2)*148
        top=171+(i//2)*48
        b.node(title,'',x,top,133,36)
    b.node('영역별 프롬프트', '각 영역의 대화 이력으로 생성<br/>완료 후에도 수정 가능', 574, 157, 229, 72, True)
    b.node('통합 설계 문서', '완료된 영역별 결과를 정리<br/>Markdown 문서로 생성', 574, 276, 229, 64)
    b.arrow([(199,220),(219,220),(219,237),(237,237)])
    b.arrow([(532,237),(551,237),(551,193),(574,193)])
    b.arrow([(688,229),(688,276)])
    b.para('하나의 긴 대화에 섞이지 않도록, 영역마다 대화 이력·진행 상태·결과를 따로 유지합니다.', M, 361, CW, 10.6, 17, bold=True)
    b.rule(401)
    b.section('문제와 선택', '화면, 데이터와 배포 질문이 뒤섞이면 필요한 조건을 빠뜨리기 쉽습니다. 기본 여섯 영역의 첫 질문을 병렬로 시작하고, 각 영역의 답변을 따로 누적하게 했습니다.',M,420,241,9.8)
    b.section('구현 구조', '브라우저는 WebSocket으로 질문과 상태를 받습니다. FastAPI는 세션별 대화를 관리하고 LangChain·Solar Pro 호출로 질문과 프롬프트를 생성하도록 구성했습니다.',300,420,241,9.8)
    b.section('수정 흐름과 다음 과제', '생성이 끝난 영역도 추가 대화로 수정할 수 있습니다. 세션은 메모리에만 있고 연결 종료 시 삭제되므로, 대화 저장과 재접속 복구가 다음 과제입니다.',562,420,241,9.8)
    b.end([('영역별 상태', PROMPT_REF+'state.py'), ('대화 서버', PROMPT_REF+'server/app.py'),
           ('원본 설계도', PROMPT_REF+'README.md')])

def contact(b):
    b.start('Contact / Links', '공세민', 'Software Developer', key='contact')
    b.text('Se Min Kong', M, 139, 42, 'Helvetica-Bold')
    b.para('읽어주셔서 감사합니다.<br/>더 자세한 영상과 코드는 웹에서 확인하실 수 있습니다.',
           M, 213, 463, 18, 29, bold=True)
    b.rule(303, M, 463)
    b.label('EMAIL', M, 325)
    b.link('semin1224@gmail.com', 'mailto:semin1224@gmail.com', M, 349, 14)
    b.label('GITHUB', M, 397)
    b.link('github.com/SeMinKong', 'https://github.com/SeMinKong', M, 421, 12)
    b.para('2026.09.04 기준으로 작성했습니다.<br/>본인 작업과 팀 결과, 구현된 기능과 후속 검증을 구분해 정리했습니다.',
           M, 482, 463, 9.5, 16, MUTED)
    b.label('WEB PORTFOLIO', 547, 139)
    widget = qr.QrCodeWidget(WEB)
    x0, y0, x1, y1 = widget.getBounds()
    side = 146
    drawing = Drawing(side, side, transform=[side / (x1-x0), 0, 0, side / (y1-y0), 0, 0])
    drawing.add(widget)
    renderPDF.draw(drawing, b.c, 590, H - 174 - side)
    b.link('seminkong.github.io/SeMinKong_Web/', WEB, 547, 339, 10)
    b.rule(380, 547, 256)
    b.link('프로젝트 영상과 상세 설명', WEB + 'work/', 547, 400, 10)
    b.link('이력서와 상장 전시', WEB + 'resume/', 547, 432, 10)
    b.para('PDF에서 웹으로, 웹에서 PDF로<br/>같은 공개 주소를 통해 이어집니다.<br/>상장은 개인정보를 가린 전시용 이미지로 연결합니다.',
           547, 474, 256, 9.5, 16, MUTED)
    b.end()


PAGES = [introduction, about, project_index, thing_overview, thing_architecture, thing_control, thing_result,
         aqis_overview, aqis_mock, aqis_coordinates, briefit_overview, briefit_data,
         briefit_result, mri_overview, mri_method, mri_preprocessing, alkkagi_overview, alkkagi_physics,
         prompt_generator, contact]


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
    for page in ([introduction, thing_control, briefit_result] if args.sample else PAGES):
        page(b)
    b.c.save()
    data = dict(version=VERSION, format='A4 landscape', pages=b.pages, elements=b.checks,
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
