"""Editable 20-page landscape portfolio with an introduction for each project.

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
VERSION = '2026.09.07'
pdfmetrics.registerFont(TTFont('Korean', 'C:/Windows/Fonts/NanumGothic-Regular.ttf'))
pdfmetrics.registerFont(TTFont('KoreanBold', 'C:/Windows/Fonts/NanumGothic-Bold.ttf'))
pdfmetrics.registerFontFamily('Korean', normal='Korean', bold='KoreanBold')

THING = 'https://github.com/SeMinKong/THING/'
AQIS = 'https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/'
MRI = 'https://github.com/SeMinKong/BrainMRISegmentation_YOLO/'
ALK = 'https://github.com/SeMinKong/Alkkagi/'
BRIEF = 'https://github.com/capstone-btd/Briefit_AI/'
PROMPT = 'https://github.com/SeMinKong/ProjectPromptGenerator_LangGraph/'
THING_REF = THING + 'blob/2381e8e3cb46c083be6ce024a3eb88bc75674f12/'
AQIS_REF = AQIS + 'blob/9f6530a2acffa0555f9df2eb628b40e4d01b6341/'
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

    def start(self, title, subtitle='', key=None):
        self.n += 1
        self.c.setFillColor(PAPER)
        self.c.rect(0, 0, W, H, fill=1, stroke=0)
        self.para(title, M, 57, CW, 25, 31, bold=True)
        if subtitle:
            self.para(subtitle, M, 97, CW, 10.4, 16, MUTED)
        key = key or f'p{self.n}'
        self.c.bookmarkPage(key)
        self.c.addOutlineEntry(title, key, level=0, closed=False)
        self.pages.append(dict(page=self.n, key=key, title=title))

    def end(self, sources=None):
        self.rule(548)
        x = M
        for title, url in sources or []:
            x += self.link(title, url, x, 557, 9, limit=H - 20) + 23
            if x > W - M - 10:
                raise ValueError(f'Page {self.n}: source row overflow')
        page_number = str(self.n)
        self.text(page_number, W - M - pdfmetrics.stringWidth(page_number, 'Helvetica', 9),
                  557, 9, 'Helvetica', MUTED, limit=H)
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
            self.label(str(i + 1), xx, top + 11)
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
    b.start('공세민', key='introduction')
    b.text('Se Min Kong', M, 113, 57, 'Helvetica-Bold')
    b.para('로봇과 소프트웨어를 연결하는 개발자', M, 190, 475, 18, 26, bold=True)
    b.para('안녕하세요. 공세민입니다.', M, 260, 475, 14, 23)
    b.para('숭실대학교에서 소프트웨어를 전공했습니다.<br/>현재 SSAFY Robotics Track에서 공부하고 있습니다.<br/><br/>센서 입력부터 제어 명령과 실제 동작까지 연결하며,<br/>동작 조건과 실패 경계를 함께 살펴봅니다.',
           M, 303, 475, 12.5, 23, keep_words=True)
    b.rule(476, M, 475)
    b.link('semin1224@gmail.com', 'mailto:semin1224@gmail.com', M, 494, 10)
    b.link('github.com/SeMinKong', 'https://github.com/SeMinKong', M, 515, 9.5)
    b.image('@se-min-kong-profile.png', 548, 113, 255, 240)
    b.rule(367, 548, 255, ACCENT, 1.5)
    b.meta([('현재', 'SSAFY Robotics Track<br/>2026.01 - 현재')], 548, 383, 121)
    b.meta([('학력', '숭실대학교<br/>소프트웨어학부<br/>2020.03 - 2026.02')], 682, 383, 121)
    b.meta([('관심 분야', 'Computer Vision<br/>Robotics / Physical AI')], 548, 471, 121)
    b.meta([('거주지', 'Suwon,<br/>Republic of Korea')], 682, 471, 121)
    b.end([('웹 포트폴리오', WEB), ('온라인 이력서', WEB + 'resume/')])


def about(b):
    b.start('학력과 관심 분야', key='about')
    left, right = M, 330
    b.label('학력·교육', left, 139)
    b.section('숭실대학교 소프트웨어학부',
              '2020.03 - 2026.02<br/>소프트웨어 공학사<br/>인공지능·빅데이터 전공<br/>빅데이터 융합전공', left, 164, 250)
    b.rule(294, left, 250)
    b.section('SSAFY Robotics Track',
              '2026.01 - 현재<br/>삼성청년SW·AI아카데미 교육생<br/>로보틱스, Computer Vision, ROS 2와<br/>하드웨어·소프트웨어 통합을 공부합니다.', left, 311, 250)
    b.rule(433, left, 250)
    b.para('<b>병역</b> 2021.05 - 2022.11<br/>육군 전술 통신 장비 운용·정비 / 병장 전역<br/><br/><b>어학</b> OPIc IH / 2027.10까지 유효',
           left, 447, 250, 9.5, 16)
    b.label('관심 분야', right, 139)
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
    b.end([('About', WEB + 'about/'), ('학력·교육·어학', WEB + 'resume/')])


def project_index(b):
    b.start('프로젝트', '장비 연동과 실물 제어를 중심으로, 입력과 출력의 품질을 다룬 작업을 소개합니다.', key='projects')
    rows = [
        ('4 - 7', 'THING', '6인 팀 / 구동·기구 통합', '장력·권취 방향 / 초기 위치와 정지', 'thing'),
        ('8 - 11', 'AQIS', '2인 팀 / 팀장·서버·장비 통합', '검출 시점과 집기 순서 / 예외 입력', 'aqis'),
        ('12 - 13', 'Briefit', '6인 팀 / AI 담당', '입력 정제 / 반복 제거와 정보 보존', 'briefit'),
        ('14 - 15', 'Brain MRI', '개인 / 전처리·학습·통합 추론', '학습 형식 변환 / 평가 데이터 분리', 'mri'),
        ('16 - 17', 'Prompt Generator', '개인 / 대화 서버·상태 관리', '영역별 대화 상태 / 수정 흐름', 'prompt'),
        ('18 - 19', 'Alkkagi.io', '개인 / 클라이언트·서버·물리', '서버 기준 상태 / 입력 검증', 'alkkagi'),
    ]
    b.label('쪽', M, 139)
    b.label('프로젝트', 112, 139)
    b.label('역할', 337, 139)
    b.label('핵심 판단', 559, 139)
    for i, (pages, name, role, stack, key) in enumerate(rows):
        y = 162 + i * 47
        b.rule(y)
        b.text(pages, M, y + 15, 9, 'Helvetica-Bold', ACCENT)
        b.text(name, 112, y + 11, 15, 'Helvetica-Bold')
        b.para(role, 337, y + 14, 207, 9.5, 15)
        b.para(stack, 559, y + 14, 244, 9.1, 15, MUTED)
        if not b.sample:
            b.c.linkRect('', key, (M, H - y - 45, W - M, H - y), relative=0, thickness=0)
    b.end([('프로젝트 전체 보기', WEB + 'work/'), ('공개 코드', 'https://github.com/SeMinKong')])


def thing_overview(b):
    b.start('THING · 텐던 로봇 핸드', key='thing')
    b.meta([('기간', '2026.07 - 08'), ('팀·역할', '6인 팀<br/>모터 제어·기구 통합'),
            ('사용 도구', 'DYNAMIXEL / U2D2<br/>모터 점검·제어 스크립트'),
            ('팀 기술', 'ROS 2 / MediaPipe<br/>OpenCV / Jetson<br/>Raspberry Pi 5')])
    b.image('thing/integrated-robot-hand-portrait.webp', 233, 137, 215, 286)
    b.para('모터 고정부·스풀·텐던을 연결한 통합 조립 상태', 233, 433, 215, 8.8, 14, MUTED)
    b.section('프로젝트 개요',
              '카메라에서 읽은 손동작을 7개 논리축 명령으로 바꾸고 텐던 로봇손을 구동합니다. 엄지는 3축, 나머지 네 손가락은 각각 1축으로 다룹니다. 팀 시스템은 21개 손 landmark를 인식하고, 명령 중재와 guard를 거쳐 모터를 구동하도록 구성했습니다.',
              476, 137, 327)
    b.section('담당 작업',
              '모터 통신 환경과 U2D2 연결, 7개 모터 점검·제어 스크립트, 전완부 아크릴 고정부 제작과 스풀·텐던 통합을 맡았습니다. 통신 확인, 개별 제어, 실제 조립을 각각 점검할 수 있도록 작업을 나눴습니다.',
              476, 265, 327)
    b.section('협업 범위',
              '손동작 인식, ROS 2 명령 중재·guard, 관제와 데이터 기록은<br/>팀 전체의 결과입니다. 이 사례에서는 직접 수행한<br/>구동·기구 작업을 중심으로 설명합니다.',
              476, 384, 327, keep_words=True)
    b.para('<b>SSAFY 공통 프로젝트 우수상</b> / 2026.08.10', 233, 492, 570, 10.5, 17, ACCENT)
    b.end([('팀 전체 구조', THING + 'blob/main/README.md'), ('실제 시연', WEB + 'work/thing/'),
           ('상장 전시', WEB + 'resume/' + AWARDS[0][3])])


def thing_architecture(b):
    b.start('THING · 시스템 구조',
            '최종 발표자료의 원본 아키텍처 / 장치별 실행 환경과 통신 연결', key='thing-architecture')
    b.image('@thing-architecture-source.png', M, 135, 555, 380)
    b.section('팀 시스템의 연결', 'Jetson에서 손동작을 인식하고 Raspberry Pi의 ROS 2 제어 경로를 거쳐 로봇손을 구동합니다. 관제 화면은 영상과 상태를 받습니다.', 617, 137, 186, 10, keep_words=True)
    b.section('직접 맡은 연결', '모터 통신 환경, 점검·제어 스크립트, 아크릴 고정부와 스풀·텐던 조립을 맡았습니다. 인식·관제·안전 로직은 팀의 협업 결과입니다.', 617, 278, 186, 10, keep_words=True)
    b.section('기록 경로', 'Cyclone DDS는 내부 ROS 2 통신에 사용합니다. Jetson에서 EC2로 보내는 기록은 HTTPS 업로드입니다.', 617, 434, 186, 9.7, keep_words=True)
    b.end([('최종 발표자료 · 25쪽', THING + 'blob/main/output/THING_최종발표_진짜최종.pptx'),
           ('시스템 문서', THING + 'blob/main/docs/architecture.md')])


def thing_control(b):
    b.start('THING · 기구 편차와 제어 조건',
            '같은 모터 위치 명령도 텐던 장력과 권취 방향에 따라 실제 손가락 자세가 달라집니다.', key='thing-control')
    b.image('@thing-spool-tendon.jpg', M, 137, 305, 218,
            caption='구동부 내부: 모터·스풀·텐던 연결', caption_size=9.1, caption_leading=14)
    b.image('@thing-acrylic-mount.jpg', 365, 137, 157, 218,
            caption='전완부 모터 고정부', caption_size=9.1, caption_leading=14)
    b.badge(1, 63, 223, (87,253))
    b.badge(2, 125, 186, (144,209))
    b.badge(3, 226, 219, (213,251))
    b.badge(4, 483, 274, (475,292))
    b.legend(1, '모터 위치와 손 자세', '위치 명령과 실제 굽힘을 구분합니다.', 559, 137, 244)
    b.legend(2, '스풀 권취 방향', '감기는 방향이 텐던의 당김을 바꿉니다.', 559, 195, 244)
    b.legend(3, '축별 텐던 장력', '동일 목표값만으로 자세를 보장하지 않습니다.', 559, 253, 244)
    b.legend(4, '고정·재장착 조건', '체결 방향과 텐던 경로를 사진으로 남겼습니다.', 559, 311, 244)
    b.rule(404)
    b.section('이동 명령의 토크 순서', '이동 명령에서는 현재 위치 읽기 → 목표값 기록 → 토크 ON 순서를 적용합니다. 이전 목표값으로 갑자기 이동하는 것을 막기 위한 점검 코드입니다.', M, 420, 241, 9.8, keep_words=True)
    b.section('원위치와 정지', '다회전 위치에서 가장 가까운 중앙각 좌표를 선택합니다. 키보드로 개별·전체 모터의 토크를 끄는 Torque OFF 경로도 마련했습니다.', 300, 420, 241, 9.8, keep_words=True)
    b.section('기구 통합의 확인 범위', '아크릴 고정부를 제작하고 모터·스풀·텐던을 통합했습니다. 축별 끝점 보정과 최대 가동 범위의 간섭 검증은 남은 과제로 정리했습니다.', 562, 420, 241, 9.8, keep_words=True)
    b.end([('본인 제어 일지', THING_REF + 'docs/daily-reports/2026-07-28/2026-07-28-공세민.md'),
           ('토크 인가 순서', THING_REF + 'tools/dynamixel/rpi/keyboard_control_7.py'),
           ('원위치 계산', THING_REF + 'tools/dynamixel/rpi/home_all_7.py'),
           ('기구 조립 기록', THING_REF + 'docs/daily-reports/2026-07-31/2026-07-31-공세민.md')])


def thing_result(b):
    b.start('THING · 실물 시연과 재현성', key='thing-result')
    b.image('@thing-video-can-0010.jpg', M, 137, 302, 340, region=(.08,.25,.95,.94),
            caption='엄지와 손가락으로 원통형 물체를 감싸 쥐는 동작')
    b.label('수상', 380, 137)
    b.award(0, 380, 162, 423)
    b.rule(251, 380, 423)
    b.section('시연한 동작', '사람의 손동작 모방, 손가락 순차 동작, 캔과 부드러운 물체 파지를 시연했습니다. 모터 명령이 기구를 거쳐 실제 손가락 동작으로 이어지는 것을 확인했습니다.', 380, 269, 423)
    b.section('재장착을 위한 기록', '스풀·텐던 경로를 사진으로 남겨 정비·재장착 시 참고하도록 했습니다. 작업일지는 체결 방향 확인과 축별 장력·가동 범위의 추가 검증을 구분합니다.', 380, 367, 423)
    b.para('<b>검증 범위</b> 영상은 개별 동작의 시연 근거입니다. 보정 전후 편차와<br/>재조립 후 반복성, 물체별 파지 성공률은 정량 결과가 없습니다.', 380, 461, 423, 9.7, 16, MUTED, keep_words=True)
    b.end([('원본 파지 영상', THING + 'blob/main/media/videos/모방캔파지.mp4'), ('파지 시험 절차', THING + 'blob/main/tests/procedures/grasp-test.md'),
           ('팀 안전 구조', THING + 'blob/main/docs/safety_manager.md')])


def aqis_overview(b):
    b.start('AQIS · 스마트 팩토리',
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
    b.start('AQIS · 장비 사용 전 통합 경로 확보',
            '초기 일정의 제약을 Mock/Real adapter와 공통 관제 인터페이스로 다뤘습니다.', key='aqis-mock')
    b.image('@architecture/returned/aqis.png', M, 129, 543, 395)
    b.section('제약: 마지막 3일', '초기 계획에서 실물 장비 사용은 마지막 3일로 제한됐습니다. 앞선 기간에 관제·API·WebSocket 흐름을 먼저 연결하는 전략을 정했습니다.', 613, 133, 190, 9.7, keep_words=True)
    b.section('선택: 연결부 분리', 'Mock 응답으로 개발한 관제 아래에 실제 장비 adapter를 연결했습니다. 서버의 공통 API와 상태 이벤트를 유지하면서 장비별 연결을 분리했습니다.', 613, 278, 190, 9.7, keep_words=True)
    b.section('통합 범위', '컨베이어·Dobot·검사 관제를 연결했습니다. 그림의 TurtleBot 자동 임무는 확장 설계이며, 구현은 SLAM·카메라·상태 관제까지입니다.', 613, 423, 190, 9.5, keep_words=True)
    b.end([('시스템 문서', AQIS_REF + 'README.md'),
           ('일정 제약과 결정', AQIS_REF + 'docs/day1-decisions.md'),
           ('서버 구현', AQIS_REF + 'server/app/main.py')])


def aqis_coordinates(b):
    b.start('AQIS · 집기 좌표 갱신',
            '문제: 컨베이어 위 대상이 이동하면, 로봇이 도착할 때 최초 검출 좌표는 이미 오래된 정보입니다.', key='aqis-coordinates')
    b.para('검출 시점에 따른 위치 변화', M, 135, CW, 11.3, 18, bold=True)
    b.c.setFillColor(TINT)
    b.c.roundRect(M, H-238, 490, 58, 5, fill=1, stroke=0)
    for x, color in [(137, MUTED),(391,ACCENT)]:
        b.c.setFillColor(color)
        b.c.circle(x,H-209,13,fill=1,stroke=0)
    b.arrow([(163,209),(363,209)],MUTED)
    b.text('컨베이어 이동',225,187,9.4,color=MUTED)
    b.para('처음 검출한 위치 X1',60,249,205,10.1,16,MUTED)
    b.para('대기 후 다시 검출한 위치 X2',306,249,223,10.1,16,ACCENT,True)
    b.section('좌표 재취득', '정지 명령 뒤 대기 상태로 전환합니다. 이후 검출에서 깊이 좌표를 우선 사용해 집기 명령을 구성합니다.', 570, 176, 233, 10)
    b.flow([('검출 수신', '작업 조건 확인'), ('정지 요청·대기', '설정 시간 대기'), ('좌표 재취득', '후속 검출·깊이 좌표 우선'), ('집기·분류·재개', '스크립트 정상 종료 시 재개')], 296)
    b.section('중복 집기 방지', '객체 ID, 검출 영역 겹침과 중심 거리로 중복 여부를 판단합니다. 작업 중에는 집기 명령의 중복 실행도 막습니다.', M, 413, 359, 9.7)
    b.section('물리 완료와 구분', '대기 시간은 실제 정지 확인을 대신하지 못합니다. 재개 조건도 스크립트 종료 코드이며 물체의 파지 성공을 센서로 확인한 결과는 아닙니다.', 439, 413, 364, 9.7)
    b.end([('이벤트 처리', AQIS_REF + 'server/app/main.py'), ('관련 테스트', AQIS_REF + 'server/tests/test_real_monitoring.py'),
           ('Dobot 시퀀스', AQIS_REF + 'server/app/services/dobot_pick_place.py'),
           ('중복 판정', AQIS_REF + 'server/app/services/detection_deduper.py')])


def aqis_verification(b):
    b.start('AQIS · 예외 입력과 검증 범위',
            '소프트웨어의 제어 조건과 실물 공정의 완료 여부를 나눠 확인합니다.', key='aqis-verification')
    b.label('입력 조건', M, 137)
    b.label('구현한 제어', 258, 137)
    b.label('확인 범위', 585, 137)
    rows = [
        ('같은 대상의 반복 검출', '객체 ID 또는 영역·중심 거리로 중복 집계를 억제합니다.', '원본 Mock 테스트와\n후속 재현에서 동작 확인'),
        ('관제가 정지된 상태', '검출을 받아도 통계를 갱신하거나 집기 명령을 보내지 않습니다.', '원본 Mock 테스트와\n후속 재현에서 동작 확인'),
        ('timestamp가 있는 오래된 검출', '준비 시점 이전 또는 허용 연령을 넘은 검출을 걸러냅니다.', '정지 전 시각을 넣은\nMock 사례에서 차단 확인'),
    ]
    for i, (condition, behavior, scope) in enumerate(rows):
        y = 164 + i * 69
        b.rule(y)
        b.para(condition, M, y+13, 196, 10.2, 16, bold=True)
        b.para(behavior, 258, y+13, 295, 10.2, 16)
        b.para(scope.replace('\n', '<br/>'), 585, y+13, 218, 9.3, 15, MUTED)
    b.rule(371)
    b.section('아직 보강할 실패 경로', 'timestamp가 없으면 신선도 검사를 통과하고, 깊이가 없으면 고정 좌표를 사용합니다. 자동 흐름은 정지 명령의 실패 응답으로 다음 단계를 차단하지 않습니다.', M, 389, 359, 9.7, keep_words=True)
    b.section('공정 성능의 확인 범위', '장비 시연은 검사·집기·분류의 연결을 보여줍니다. 반복 성공률과 사이클 시간, 통신 단절 후 복구는 정량 검증 자료가 없습니다. 좌표 변환의 기대값 불일치도 남아 있습니다.', 439, 389, 364, 9.7, keep_words=True)
    b.para('검증 출처: 원본 테스트 + 후속 Mock 재현. 실물 분류 성능이나 당시 팀의 반복 시험 결과로 해석하지 않습니다.', M, 513, CW, 9.1, 14, MUTED)
    b.end([('검증 코드', AQIS_REF + 'server/tests/test_real_monitoring.py'),
           ('실제 제어 분기', AQIS_REF + 'server/app/main.py'),
           ('재현 범위 기록', 'https://github.com/SeMinKong/SeMinKong_Web/blob/main/docs/portfolio-visual-sources.md')])


def briefit_overview(b):
    b.start('Briefit · 뉴스 요약과 출력 품질',
            '2025년 본인 KoBART 작업 / 입력 정제와 생성문 후처리를 분리해 구현했습니다.', key='briefit')
    b.meta([('기간', '2025.05 - 09'), ('팀·역할', '6인 팀 / AI 2인<br/>본인: AI 담당'),
            ('사용 기술', 'Python / aiohttp<br/>BeautifulSoup<br/>Transformers / KoBART')])
    b.image('briefit/cover.webp', 233, 137, 305, 170,
            caption='뉴스를 모아 읽고 요약을 확인하는 서비스<br/>제품 UI는 팀의 협업 결과입니다.',
            caption_size=9.2, caption_leading=14)
    b.section('직접 구현한 범위', '기사 수집 필터·중복 제거와 KoBART 데이터 분할·학습·생성·ROUGE 평가 스크립트를 작성했습니다. 생성 뒤에는 반복 종결문을 정리하는 규칙을 추가했습니다.',
              233, 365, 305, 10, keep_words=True)
    b.para('<b>품질 판단</b> 반복 제거만으로 요약 품질을 보장할 수는 없습니다. 정상 문장의 삭제와 핵심 정보 누락을 함께 평가해야 합니다.', 233, 478, 305, 9.7, 16, MUTED, keep_words=True)
    b.label('프로젝트 수상', 570, 139)
    for index, top in [(1,169), (2,282), (3,413)]:
        b.award(index, 570, top, 233)
        if index < 3:
            b.rule(top+97 if index == 1 else top+115, 570, 233)
    b.end([('팀 소개', 'https://github.com/capstone-btd/.github/blob/main/profile/README.md'),
           ('당시 KoBART 작업', BRIEF_TRAIN), ('웹 상세', WEB + 'work/briefit/')])


def briefit_data(b):
    b.start('Briefit · 반복 제거와 정보 보존',
            '수집 필터 → 모델 생성 → 출력 후처리 / 각 단계의 오류와 평가 범위를 구분합니다.', key='briefit-data')
    b.image('@architecture/returned/briefit.png', M, 137, 485, 365)
    b.section('입력 정제', '중복 URL·댓글 URL·짧은 본문을 수집 단계에서 제외합니다. 수집 파일의 content와 추론 입력의 body는 필드 매핑이 필요합니다.', 555, 137, 248, 9.7, keep_words=True)
    b.section('출력 후처리의 선택', '반복되거나 짧은 끝문장을 규칙으로 제거합니다. 짧지만 유효한 문장도 삭제될 수 있어 반복 감소와 정보 손실을 함께 살펴야 합니다.', 555, 260, 248, 9.7, keep_words=True)
    b.section('평가 범위', 'ROUGE 코드는 후처리 전 생성문을 평가합니다. 실제 점수 로그와 후처리 전후 품질 결과는 확인되지 않아, 정보 보존 효과를 성과로 제시하지 않습니다.', 555, 383, 248, 9.7, keep_words=True)
    b.para('데이터 구성: 학습 2,819건 / 검증 352건 / 테스트 353건. 저장된 분할이며 모델 성능 수치가 아닙니다.', M, 513, CW, 9.1, 14, MUTED)
    b.end([('수집 변경', BRIEF_COLLECT), ('학습·평가 구현', BRIEF_TRAIN), ('분할·후처리 근거', BRIEF_POST)])


def mri_overview(b):
    b.start('Brain MRI · 종양 분류와 영역 분할',
            '개인 프로젝트 / 2026.02 - 04 / Python · PyTorch · YOLO11 · OpenCV', key='mri')
    b.image('@mri-video-overlay-007733.png', M, 137, 452, 353,
            region=(476/1320,195/1032,1217/1320,815/1032),
            caption='① 왼쪽: 예측 영역 표시　② 오른쪽: 원본<br/>분류 결과는 수막종(Meningioma)으로 표시됩니다.')
    b.badge(1,82,230,(197,250))
    b.badge(2,411,230,(320,285))
    b.section('구현 범위', '분류와 분할을 각각 수행하는 두 YOLO11 모델의 학습·추론 경로를 구성했습니다. 분류 범주와 분할 위치를 하나의 이미지에서 함께 볼 수 있게 했습니다.',
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
    b.start('Brain MRI · 분류·분할 모델 구조',
            '같은 MRI를 두 모델에 각각 입력합니다. 한 모델의 결과를 다른 모델의 입력으로 사용하지 않습니다.', key='mri-method')
    b.image('@architecture/returned/mri.png', M, 129, 485, 367)
    b.para('학습 입력은 작업에 맞게 나눕니다. 분류는 폴더별 이미지, 분할은 마스크를 변환한 polygon label을 사용합니다.', M, 504, 485, 9.5, 15, MUTED)
    b.section('학습 형식 변환', '이진화·형태학 처리·외곽선 추출로 마스크를 polygon label로 바꿉니다. 작은 영역 보존과 누락 여부는 실제 라벨로 확인할 대상입니다.', 555, 137, 248, 9.7, keep_words=True)
    b.section('현재 평가 조건', '학습 코드는 test 경로를 검증용 val에 연결합니다. 최종 성능을 판단하려면 학습·검증에서 사용하지 않은 별도 데이터로 평가해야 합니다.', 555, 268, 248, 9.7, keep_words=True)
    b.section('데이터 해석', 'BRISC는 환자 식별 정보가 없어 환자 단위 독립성을 보장하기 어렵습니다. 비종양에도 병변이 포함될 수 있습니다. 임상 진단 검증은 수행하지 않았습니다.', 555, 399, 248, 9.7, keep_words=True)
    b.end([('전처리·학습', MRI_REF+'src/training/train.py'), ('통합 추론', MRI_REF+'src/testing/test.py'),
           ('BRISC 원문', 'https://arxiv.org/html/2506.14318v5')])

def alkkagi_overview(b):
    b.start('Alkkagi.io · 실시간 알까기',
            '여러 플레이어가 같은 보드에서 돌을 밀어내며 대전하는 웹 게임', key='alkkagi')
    b.meta([('기간', '2026.03 - 04'), ('팀·역할', '개인 프로젝트<br/>웹 UI·서버·물리 계산'),
            ('사용 기술', 'React / TypeScript<br/>Node.js / Socket.IO')])
    b.image('@alkkagi-video-aim-0007.png', 233, 137, 320, 320,
            caption='실제 플레이 영상의 한 장면 / 돌을 조준하는 화면',
            caption_size=9.2, caption_leading=14)
    b.section('프로젝트 개요', '돌을 드래그해 방향과 세기를 정하고 상대의 돌을 보드 밖으로 밀어냅니다. 점수가 오르면 돌의 크기와 질량도 변합니다.', 583, 137, 220, 10, keep_words=True)
    b.section('직접 맡은 일', '조준 UI, 실시간 통신과 서버 물리를 구현했습니다. 충돌·마찰·위치 보정을 TypeScript로 작성했습니다.', 583, 270, 220, 10, keep_words=True)
    b.section('핵심 구현', '서버가 게임의 기준 상태와 입력 제한을 관리하고, 모든 플레이어에게 같은 계산 결과를 전달하도록 구성했습니다.', 583, 403, 220, 10, keep_words=True)
    b.end([('프로젝트 코드', ALK_REF + 'server/index.ts'),
           ('실제 플레이 영상', 'https://github.com/user-attachments/assets/20bc9007-97ea-4cc4-948a-e1d901ea8f4b'),
           ('웹 상세', WEB + 'work/alkkagi/')])


def alkkagi_physics(b):
    b.start('Alkkagi.io · 서버 물리와 상태 동기화',
            '개인 프로젝트 / React · TypeScript · Socket.IO / 기준 상태는 서버 메모리에 유지합니다.', key='alkkagi-physics')
    b.image('@architecture/returned/alkkagi.png', M, 129, 500, 366)
    b.para('서버가 유일한 기준 상태를 가지므로, 브라우저마다 다른 충돌 결과를 확정하지 않습니다.', M, 498, 500, 9.5, 15)
    b.section('기준 상태의 소유', '클라이언트는 발사 입력을 보내고 서버가 위치·충돌·마찰을 계산합니다. 같은 계산 결과를 모든 플레이어에게 전달하도록 책임을 모았습니다.', 570, 137, 233, 9.5, keep_words=True)
    b.section('서버에서 입력 검증', '입력 간격과 발사 속도를 서버에서 제한합니다. 브라우저 UI의 제한만으로 게임 규칙을 유지하지 않도록 했습니다.', 570, 262, 233, 9.5, keep_words=True)
    b.section('동기화와 지속성', '메모리의 상태를 공유하고 연결 종료 시 플레이어를 정리합니다. 네트워크 지연·재접속과 서버 재시작 후 복구는 별도 설계가 필요합니다.', 570, 387, 233, 9.5, keep_words=True)
    b.para('<b>후속 검증</b> 동시접속자가 늘어날 때의 지연과 지속 프레임률은 별도로 측정해야 합니다. 서버 재시작 시 상태 복구도 추가 과제입니다.',M,520,CW,9.2,14,MUTED)
    b.end([('서버·입력 제한', ALK_REF+'server/index.ts'), ('물리 구현', ALK_REF+'server/physics.ts'),
           ('실제 플레이 영상', 'https://github.com/user-attachments/assets/20bc9007-97ea-4cc4-948a-e1d901ea8f4b')])

def prompt_overview(b):
    b.start('Prompt Generator · 프로젝트 설계 도우미',
            '아이디어를 영역별 질문으로 구체화하고 결과를 하나의 문서로 모으는 도구', key='prompt')
    b.meta([('기간', '2026'), ('팀·역할', '개인 프로젝트<br/>대화 서버·상태 관리<br/>웹 UI'),
            ('사용 기술', 'Python / FastAPI<br/>WebSocket / LangChain<br/>Solar Pro')])
    b.image('@prompt-design-flow.png', 233, 137, 570, 256,
            caption='프로젝트 아이디어를 여섯 설계 영역으로 나누는 원본 흐름도',
            caption_size=9.2, caption_leading=14)
    b.section('프로젝트 개요', '프로젝트 아이디어를 입력하고 화면·API·데이터 등 영역별 질문에 답하며 설계를 구체화합니다. 완료된 영역도 추가 대화로 수정할 수 있습니다.', 233, 438, 275, 9.8, keep_words=True)
    b.section('직접 맡은 일', '영역별 대화 이력과 진행 상태를 분리하고, 질문·상태를 웹 화면에 전달하는 서버와 결과를 문서로 모으는 흐름을 구현했습니다.', 533, 438, 270, 9.8, keep_words=True)
    b.end([('원본 설계 흐름', PROMPT_REF + 'README.md'), ('대화 서버', PROMPT_REF + 'server/app.py'),
           ('영역별 상태', PROMPT_REF + 'state.py')])


def prompt_generator(b):
    b.start('Prompt Generator · 영역별 설계 대화',
            '개인 프로젝트 / 2026 / FastAPI · WebSocket · LangChain · Solar Pro', key='prompt-architecture')
    b.image('@architecture/returned/prompt.png', M, 129, 490, 372)
    b.para('영역마다 대화 이력·진행 상태·결과를 따로 유지합니다.', M, 515, 490, 9.5, 15)
    b.section('문제와 선택', '화면, 데이터와 배포 질문이 뒤섞이면 필요한 조건을 빠뜨리기 쉽습니다. 기본 여섯 영역의 첫 질문을 병렬로 시작하고, 각 영역의 답변을 따로 누적하게 했습니다.', 560, 137, 243, 9.5, keep_words=True)
    b.section('구현 구조', '브라우저는 WebSocket으로 질문과 상태를 받습니다. FastAPI는 세션별 대화를 관리하고 LangChain·Solar Pro 호출로 질문과 프롬프트를 생성하도록 구성했습니다.', 560, 268, 243, 9.5, keep_words=True)
    b.section('수정과 복구의 경계', '완료된 영역도 대화로 수정합니다. 세션은 연결 종료 시 삭제되며 재접속 복구는 없습니다. 요구사항 반영률이나 생성 품질의 평가 결과는 확인되지 않았습니다.', 560, 399, 243, 9.5, keep_words=True)
    b.end([('영역별 상태', PROMPT_REF+'state.py'), ('대화 서버', PROMPT_REF+'server/app.py'),
           ('원본 설계도', PROMPT_REF+'README.md')])

def contact(b):
    b.start('연락처', key='contact')
    b.text('Se Min Kong', M, 139, 42, 'Helvetica-Bold')
    b.para('공세민 · 소프트웨어 개발자', M, 213, 463, 15, 24)
    b.rule(303, M, 463)
    b.label('이메일', M, 325)
    b.link('semin1224@gmail.com', 'mailto:semin1224@gmail.com', M, 349, 14)
    b.label('GitHub', M, 397)
    b.link('github.com/SeMinKong', 'https://github.com/SeMinKong', M, 421, 12)
    b.label('웹 포트폴리오', 547, 139)
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
    b.end()


PAGES = [introduction, about, project_index, thing_overview, thing_architecture, thing_control, thing_result,
         aqis_overview, aqis_mock, aqis_coordinates, aqis_verification, briefit_overview, briefit_data,
         mri_overview, mri_method, prompt_overview, prompt_generator, alkkagi_overview, alkkagi_physics, contact]
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
    for page in ([introduction, thing_control, briefit_overview] if args.sample else PAGES):
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
