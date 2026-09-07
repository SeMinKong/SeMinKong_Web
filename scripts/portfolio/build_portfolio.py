"""Editable 18-page landscape portfolio focused on implementation decisions.

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
PAGE_COUNT = 18
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
BRIEF_GENERATE = BRIEF + 'blob/8c48def1e623a69fbb28e3b085a2d49dc1dc003c/Kobart/Scripts/GenerateJson.py'
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


def project_index(b):
    b.start('프로젝트', '장비 연동과 실물 제어를 중심으로, 입력과 출력의 품질을 다룬 작업을 소개합니다.', key='projects')
    rows = [
        ('3 - 6', 'THING', '6인 팀 / 구동·기구 통합', '기구 편차 / 초기 목표와 토크 순서', 'thing'),
        ('7 - 9', 'AQIS', '2인 팀 / 팀장·서버·장비 통합', '장비 연결 분리 / 좌표 갱신과 집기', 'aqis'),
        ('10 - 11', 'Briefit', '6인 팀 / AI 담당', '입력 정제 / 요약과 정보 보존', 'briefit'),
        ('12 - 13', 'Brain MRI', '개인 / 전처리·학습·통합 추론', '라벨 변환 / 분류·분할 결합', 'mri'),
        ('14 - 15', 'Prompt Generator', '개인 / 대화 서버·상태 관리', '영역별 이력 / 수정 흐름', 'prompt'),
        ('16 - 17', 'Alkkagi.io', '개인 / 클라이언트·서버·물리', '충돌·겹침 보정 / 서버 입력 제한', 'alkkagi'),
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
    b.para('통합 조립', 233, 433, 215, 9.2, 14, MUTED)
    b.section('프로젝트 개요',
              '카메라로 읽은 사람의 손동작을 텐던 로봇손으로 재현합니다. 손동작 인식부터 ROS 2 제어, 모터 구동과 관제까지 연결한 팀 프로젝트입니다.',
              476, 137, 327)
    b.section('담당 작업',
              'U2D2 통신 환경과 개별·원위치·정지 제어 스크립트를 작성하고, 아크릴 모터 고정부를 제작해 스풀·텐던과 조립했습니다. 소프트웨어의 위치 명령이 실제 손가락 동작으로 이어지는 구동부를 맡았습니다.',
              476, 251, 327)
    b.section('협업 범위',
              '손동작 인식, ROS 2 명령 중재·guard, 관제와 데이터 기록은 팀의 협업 결과입니다. 본인 기여는 모터 제어와 기구 통합입니다.',
              476, 390, 327, keep_words=True)
    b.end([('팀 전체 구조', THING + 'blob/main/README.md'), ('실제 시연', WEB + 'work/thing/'),
           ('상장 전시', WEB + 'resume/' + AWARDS[0][3])])


def thing_architecture(b):
    b.start('THING · 시스템 구조',
            '인식·제어권 중재·구동을 연결한 팀 구조와 독립 점검 경로', key='thing-architecture')
    b.image('@thing-architecture-source.png', M, 135, 555, 380)
    b.section('제어권을 거치는 운영 경로', '모방·웹·키보드 입력을 선택한 뒤 guard를 거쳐 모터 명령을 전달합니다. 인식은 Jetson, 제어권 중재와 장치 제어는 Raspberry Pi가 담당합니다.', 617, 137, 186, 10, keep_words=True)
    b.section('구동부를 따로 점검', '본인 점검 스크립트는 통신 응답과 개별 구동을 확인하는 독립 도구입니다. 운영 경로의 명령 중재·guard와 구분해 조립 단계의 구동부를 점검했습니다.', 617, 323, 186, 10, keep_words=True)
    b.para('원본: 최종 발표자료 25쪽. DDS는 내부 ROS 2 통신이며, Jetson → EC2 기록 전송은 HTTPS입니다.', M, 520, CW, 9.1, 14, MUTED)
    b.end([('최종 발표자료 · 25쪽', THING + 'blob/main/output/THING_최종발표_진짜최종.pptx'),
           ('시스템 문서', THING + 'blob/main/docs/architecture.md')])


def thing_control(b):
    b.start('THING · 기구 편차와 제어 조건',
            '같은 모터 위치 명령도 텐던 장력과 권취 방향에 따라 실제 손가락 자세가 달라집니다.', key='thing-control')
    b.image('@thing-spool-tendon.jpg', M, 137, 305, 218,
            caption='구동부 내부: 모터·스풀·텐던 연결', caption_size=9.1, caption_leading=14)
    b.image('@thing-acrylic-mount.jpg', 365, 137, 157, 218,
            caption='전완부 모터 고정부', caption_size=9.1, caption_leading=14)
    b.section('위치 명령과 실제 굽힘', '통신 응답이 정상이어도 원하는 자세가 나오는지는 별도 확인이 필요합니다. 모터 점검과 실제 기구 동작을 나눠 확인했습니다.', 559, 137, 244, 10, keep_words=True)
    b.section('재장착 조건의 보존', '모터 고정부를 제작하고 스풀·텐던을 통합했습니다. 체결 방향과 텐던 경로를 사진·작업일지에 남겨 재장착 시 참고할 기준을 마련했습니다.', 559, 275, 244, 10, keep_words=True)
    b.rule(404)
    b.section('이동 명령의 토크 순서', '이동 명령에서는 현재 위치 읽기 → 목표값 기록 → 토크 ON 순서를 적용합니다. 이전 목표값으로 갑자기 이동하는 것을 막기 위한 점검 코드입니다.', M, 420, 241, 9.8, keep_words=True)
    b.section('원위치와 정지', '다회전 위치에서 가장 가까운 중앙각 좌표를 선택합니다. 키보드로 개별·전체 모터의 토크를 끄는 Torque OFF 경로도 마련했습니다.', 300, 420, 241, 9.8, keep_words=True)
    b.section('축별 보정의 경계', '중앙각 복귀만으로 손가락의 가동 범위가 보정되지는 않습니다. 당시 일지에서 축별 끝점 보정과 최대 가동 범위의 간섭 검증을 후속 과제로 남겼습니다.', 562, 420, 241, 9.8, keep_words=True)
    b.end([('본인 제어 일지', THING_REF + 'docs/daily-reports/2026-07-28/2026-07-28-공세민.md'),
           ('토크 인가 순서', THING_REF + 'tools/dynamixel/rpi/keyboard_control_7.py'),
           ('원위치 계산', THING_REF + 'tools/dynamixel/rpi/home_all_7.py'),
           ('기구 조립 기록', THING_REF + 'docs/daily-reports/2026-07-31/2026-07-31-공세민.md')])


def thing_result(b):
    b.start('THING · 실물 동작과 결과', key='thing-result')
    b.image('@thing-video-can-0010.jpg', M, 137, 302, 340, region=(.08,.25,.95,.94),
            caption='캔 파지 시연')
    b.label('수상', 380, 137)
    b.award(0, 380, 162, 423)
    b.rule(251, 380, 423)
    b.section('팀 시연', '손동작 모방과 손가락 순차 동작, 캔·부드러운 물체 파지를 시연했습니다. 인식과 제어 명령이 조립한 구동부를 거쳐 실제 손가락 동작으로 이어졌습니다.', 380, 269, 423)
    b.section('시연 이후의 판단', '동작 시연은 시스템 연결의 근거입니다. 물체별 파지 성공률과 재조립 후 반복성을 판단하려면 장력·가동 범위와 시험 조건을 고정한 반복 측정이 필요합니다.', 380, 377, 423)
    b.para('보정 전후 편차·반복 파지 성능의 정량 결과는 공개 기록에서 확인되지 않았습니다.', 380, 493, 423, 9.5, 15, MUTED, keep_words=True)
    b.end([('원본 파지 영상', THING + 'blob/main/media/videos/모방캔파지.mp4'), ('파지 시험 절차', THING + 'blob/main/tests/procedures/grasp-test.md'),
           ('팀 안전 구조', THING + 'blob/main/docs/safety_manager.md')])


def aqis_overview(b):
    b.start('AQIS · 스마트 팩토리',
            '검사, 컨베이어, Dobot과 RealOps 관제를 연결한 스마트 팩토리 시스템', key='aqis')
    b.image('@aqis-video-inspection-0010.jpg', M, 137, 508, 286)
    b.para('RealOps · 실제 장비 시연', M, 433, 508, 9.2, 15, MUTED)
    b.para('2026.05 기획 / 06 본 개발<br/><b>2인 팀 · 팀장</b><br/>Full-stack & Robot Integration', 576, 137, 227, 10.1, 18)
    b.rule(208,576,227)
    b.section('프로젝트 개요', '카메라의 검사 결과로 컨베이어를 제어하고 Dobot이 대상을 집어 분류합니다. RealOps에서 검사·작업 상태와 장비를 함께 관리합니다.', 576, 225, 227, 10, keep_words=True)
    b.section('직접 맡은 일', 'React 관제와 FastAPI·WebSocket 서버, ROS 2 연결, 장비 adapter와 집기 시퀀스를 구현했습니다. 서버에서 검출 이벤트를 장비 명령으로 연결했습니다.', 576, 369, 227, 10, keep_words=True)
    b.para('<b>협업</b> 팀원은 모델 학습·Roboflow·CAD·시뮬레이션을 담당했습니다.', M, 481, 508, 10, 16)
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
    b.start('AQIS · 좌표 갱신과 집기 제어',
            '이동 중의 최초 좌표를 계속 쓰지 않고, 정지 요청 뒤 후속 검출로 집기 위치를 갱신합니다.', key='aqis-coordinates')
    b.flow([('검출 수신', '대상·작업 상태 확인'), ('정지 요청·대기', '설정 시간 대기'), ('좌표 재취득', '후속 검출·깊이 좌표 우선'), ('집기·분류·재개', '스크립트 정상 종료 시 재개')], 145)
    b.section('검출과 실행의 중복 분리', '같은 대상이 여러 프레임에 나타나므로 객체 ID와 영역 겹침·중심 거리로 중복 집계를 억제합니다. 집기 작업 중에는 명령의 중복 실행도 막습니다.', M, 268, 359, 10.4, keep_words=True)
    b.section('상태와 시각에 따른 입력 선택', '관제가 정지되면 검출에 따른 통계 갱신과 집기를 시작하지 않습니다. timestamp가 있는 검출은 준비 시점 이전이거나 허용 연령을 넘으면 제외합니다.', 439, 268, 364, 10.4, keep_words=True)
    b.rule(396)
    b.section('실물 완료의 확인 조건', '설정 시간 대기와 스크립트 종료 코드는 실제 정지·파지 성공의 센서 확인이 아닙니다. 자동 흐름은 정지 명령의 실패 응답으로 다음 단계를 차단하지 않습니다.', M, 413, 359, 9.7, keep_words=True)
    b.section('누락 입력과 검증 범위', 'timestamp가 없으면 신선도 검사를 통과하고, 깊이가 없으면 고정 좌표를 사용합니다. 좌표 변환 기대값 불일치와 실물 반복 성능·통신 복구는 남은 검증 항목입니다.', 439, 413, 364, 9.7, keep_words=True)
    b.para('중복·정지 상태·시각 조건: 원본 테스트와 후속 Mock 재현으로 확인. 실물 성공률·사이클 시간의 측정 결과는 없습니다.', M, 520, CW, 9.1, 14, MUTED)
    b.end([('이벤트 처리', AQIS_REF + 'server/app/main.py'), ('관련 테스트', AQIS_REF + 'server/tests/test_real_monitoring.py'),
           ('Dobot 시퀀스', AQIS_REF + 'server/app/services/dobot_pick_place.py'),
           ('중복 판정', AQIS_REF + 'server/app/services/detection_deduper.py')])


def briefit_overview(b):
    b.start('Briefit · 뉴스 요약과 출력 품질',
            '여러 매체의 뉴스를 모아 요약을 제공하는 서비스 / 2025년 본인 AI 구현', key='briefit')
    b.meta([('기간', '2025.05 - 09'), ('팀·역할', '6인 팀 / AI 2인<br/>본인: AI 담당'),
            ('사용 기술', 'Python / Crawl4AI<br/>BeautifulSoup<br/>Transformers / KoBART')])
    b.image('briefit/cover.webp', 233, 137, 305, 170,
            caption='서비스 UI · 팀 결과',
            caption_size=9.2, caption_leading=14)
    b.section('직접 구현한 범위', '기사 본문 정제와 배치 간 URL 중복 방지, KoBART 학습·생성·평가 스크립트를 구현했습니다. 긴 기사의 부분 요약·재요약과 생성문 후처리를 맡았습니다.',
              233, 357, 305, 10.4, keep_words=True)
    b.section('구현을 나눈 기준', '수집 입력, 모델 생성, 출력 후처리를 분리해 기사 중복과 요약 누락·반복을 각각 점검할 수 있게 구성했습니다.', 233, 453, 305, 10, keep_words=True)
    b.label('프로젝트 수상', 570, 139)
    for index, top in [(1,169), (2,282), (3,413)]:
        b.award(index, 570, top, 233)
        if index < 3:
            b.rule(top+97 if index == 1 else top+115, 570, 233)
    b.end([('팀 소개', 'https://github.com/capstone-btd/.github/blob/main/profile/README.md'),
           ('당시 KoBART 작업', BRIEF_TRAIN), ('웹 상세', WEB + 'work/briefit/')])


def briefit_data(b):
    b.start('Briefit · 긴 기사와 요약 손실',
            '입력 중복, 모델의 길이 제한, 후처리의 정보 손실을 서로 다른 문제로 다뤘습니다.', key='briefit-data')
    b.image('@architecture/returned/briefit.png', M, 137, 485, 365)
    b.section('본문 정제와 중복 방지', '본문에서 스크립트·스타일을 제거하고 댓글 URL을 제외합니다. 같은 실행의 여러 배치가 URL 집합을 공유해 이미 수집한 기사의 재저장을 막습니다.', 555, 137, 248, 9.7, keep_words=True)
    b.section('부분 요약 뒤 재요약', '긴 입력은 문단을 묶어 부분 요약한 뒤 다시 요약합니다. 긴 문단이나 재요약 입력은 길이 제한으로 잘릴 수 있어 전체 문맥 보존을 보장하지는 않습니다.', 555, 263, 248, 9.7, keep_words=True)
    b.section('후처리와 평가의 분리', '반복·짧은 끝문장을 제거하는 규칙은 정상 문장도 지울 수 있습니다. ROUGE는 후처리 전 생성문을 평가하므로 반복 감소와 정보 손실은 별도 비교가 필요합니다.', 555, 389, 248, 9.7, keep_words=True)
    b.para('검증 범위: 생성·평가 코드 확인. ROUGE 점수 로그와 후처리 전후 품질 비교 결과는 확인되지 않았습니다.', M, 520, CW, 9.1, 14, MUTED)
    b.end([('수집 구현', BRIEF_COLLECT), ('부분 요약·재요약', BRIEF_GENERATE), ('학습·평가', BRIEF_TRAIN), ('출력 후처리', BRIEF_POST)])


def mri_overview(b):
    b.start('Brain MRI · 종양 분류와 영역 분할',
            '개인 프로젝트 / 2026.02 - 04 / Python · PyTorch · YOLO11 · OpenCV', key='mri')
    b.image('@mri-video-overlay-007733.png', M, 137, 452, 353,
            region=(476/1320,195/1032,1217/1320,815/1032),
            caption='분류·분할 통합 추론 · 원본 데모')
    b.section('프로젝트 개요', 'MRI의 종양 유형을 분류하고 영역을 분할하는 연구·학습용 프로젝트입니다. 분류 범주와 분할 위치를 같은 이미지에서 비교할 수 있도록 구성했습니다.',
              520, 137, 283)
    b.section('직접 구현한 범위', 'BRISC 이미지·마스크를 학습 형식으로 변환하고, 두 YOLO11 모델의 학습과 통합 추론 코드를 작성했습니다. 데이터 전처리부터 예측 시각화까지 연결했습니다.',
              520, 286, 283, keep_words=True)
    b.rule(426, 520, 283)
    b.para('학습 입력: 분류용 이미지 폴더 / 분할용 polygon label<br/>출력: 분류 범주와 분할 영역의 통합 시각화', 520, 445, 283, 10, 17, MUTED)
    b.end([('전처리·학습', MRI_REF + 'src/training/train.py'), ('통합 추론', MRI_REF + 'src/testing/test.py'),
           ('원본 데모 영상', 'https://github.com/user-attachments/assets/9994b0b3-187b-4c12-bfd3-170f6bb8dda5')])


def mri_method(b):
    b.start('Brain MRI · 분류·분할 모델 구조',
            '분류와 분할은 독립적으로 추론하고, 라벨 변환과 평가 데이터의 조건을 별도로 관리합니다.', key='mri-method')
    b.image('@architecture/returned/mri.png', M, 129, 485, 367)
    b.section('라벨 정제와 영역 손실', '마스크의 작은 영역을 제거하고 외부 윤곽을 polygon label로 변환합니다. 잡음을 줄이는 규칙이 작은 병변이나 내부 구멍도 지울 수 있어 원본 마스크와 대조가 필요합니다.', 555, 137, 248, 9.7, keep_words=True)
    b.section('분류가 분할을 차단하지 않도록', '같은 MRI를 두 모델에 각각 입력합니다. 비종양으로 분류해도 분할 추론을 실행하며, 두 결과를 함께 표시합니다. 결과 불일치를 자동으로 보정하는 구조는 아닙니다.', 555, 263, 248, 9.7, keep_words=True)
    b.section('평가 데이터의 독립성', '학습 코드는 test를 검증용 val에 연결합니다. 학습·검증에 쓰지 않은 별도 평가가 필요하며, BRISC에는 환자 식별자가 없어 환자 단위 독립성도 확인할 수 없습니다.', 555, 389, 248, 9.7, keep_words=True)
    b.para('연구용 데이터의 비종양 범주에도 병변이 포함될 수 있습니다. 임상 진단 검증과 독립 성능 평가는 완료하지 않았습니다.', M, 520, CW, 9.1, 14, MUTED)
    b.end([('전처리·학습', MRI_REF+'src/training/train.py'), ('통합 추론', MRI_REF+'src/testing/test.py'),
           ('BRISC 원문', 'https://arxiv.org/html/2506.14318v5')])

def alkkagi_overview(b):
    b.start('Alkkagi.io · 실시간 알까기',
            '여러 플레이어가 같은 보드에서 돌을 밀어내며 대전하는 웹 게임', key='alkkagi')
    b.meta([('기간', '2026.03 - 04'), ('팀·역할', '개인 프로젝트<br/>웹 UI·서버·물리 계산'),
            ('사용 기술', 'React / TypeScript<br/>Node.js / Socket.IO')])
    b.image('@alkkagi-video-aim-0007.png', 233, 137, 320, 320,
            caption='실제 플레이',
            caption_size=9.2, caption_leading=14)
    b.section('프로젝트 개요', '같은 보드에 접속한 플레이어가 돌을 밀어내며 대전하는 웹 게임입니다. 돌의 움직임과 충돌 결과를 실시간으로 공유합니다.', 583, 137, 220, 10, keep_words=True)
    b.section('직접 맡은 일', 'React 조준 UI와 Socket.IO 통신, 서버의 게임 상태·물리 계산을 구현했습니다. 충돌·마찰·겹침 보정은 TypeScript로 작성했습니다.', 583, 270, 220, 10, keep_words=True)
    b.section('게임 규칙의 실행 위치', '클라이언트는 발사 입력을 보내고 서버가 기준 상태를 계산합니다. 입력 제한과 물리 규칙을 모든 플레이어에게 같은 기준으로 적용합니다.', 583, 403, 220, 10, keep_words=True)
    b.end([('프로젝트 코드', ALK_REF + 'server/index.ts'),
           ('실제 플레이 영상', 'https://github.com/user-attachments/assets/20bc9007-97ea-4cc4-948a-e1d901ea8f4b'),
           ('웹 상세', WEB + 'work/alkkagi/')])


def alkkagi_physics(b):
    b.start('Alkkagi.io · 서버 물리와 상태 동기화',
            '입력 제한, 겹침 보정과 충돌 반응을 분리하고 계산이 끝난 상태를 전송합니다.', key='alkkagi-physics')
    b.image('@architecture/returned/alkkagi.png', M, 129, 500, 366)
    b.section('겹침과 충격량의 분리', '겹친 거리는 두 돌에 절반씩 나눠 위치를 보정합니다. 이미 서로 멀어지면 충격량을 더하지 않고, 접근 중인 충돌에는 질량을 반영해 속도를 갱신합니다.', 570, 137, 233, 9.7, keep_words=True)
    b.section('계산 간격과 마찰', '한 번의 갱신을 소단계로 나눠 이동·충돌을 계산합니다. 마찰 계수에도 소단계 비율을 지수로 적용해 계산을 나눌 때 감속이 과도하게 누적되지 않도록 했습니다.', 570, 263, 233, 9.7, keep_words=True)
    b.section('서버에서 입력 검증', '발사 간격과 속도를 서버에서 제한합니다. 기준 상태는 서버 메모리에 두고 연결 종료 시 플레이어를 정리합니다. 재접속·서버 재시작 후 복구는 구현하지 않았습니다.', 570, 389, 233, 9.7, keep_words=True)
    b.para('구조도의 60Hz는 갱신 설정입니다. 동시접속 부하·네트워크 지연·지속 프레임률의 측정 결과는 없습니다.',M,520,CW,9.1,14,MUTED)
    b.end([('서버·입력 제한', ALK_REF+'server/index.ts'), ('물리 구현', ALK_REF+'server/physics.ts'),
           ('실제 플레이 영상', 'https://github.com/user-attachments/assets/20bc9007-97ea-4cc4-948a-e1d901ea8f4b')])

def prompt_overview(b):
    b.start('Prompt Generator · 프로젝트 설계 도우미',
            '아이디어를 영역별 질문으로 구체화하고 결과를 하나의 문서로 모으는 도구', key='prompt')
    b.meta([('기간', '2026'), ('팀·역할', '개인 프로젝트<br/>대화 서버·상태 관리<br/>웹 UI'),
            ('사용 기술', 'Python / FastAPI<br/>WebSocket / LangChain<br/>Solar Pro')])
    b.image('@prompt-design-flow.png', 233, 137, 570, 256,
            caption='초기 설계 흐름 · 원본',
            caption_size=9.2, caption_leading=14)
    b.section('프로젝트 개요', '프로젝트 아이디어를 입력하면 화면·API·데이터 등 영역별 질문으로 요구사항을 구체화합니다. 각 영역의 결과를 하나의 설계 문서로 모읍니다.', 233, 438, 275, 9.8, keep_words=True)
    b.section('직접 맡은 일', '대화 서버와 웹 UI를 연결하고, 질문·답변에서 결과 문서 생성까지 진행 상태를 관리했습니다. 완료된 영역을 추가 대화로 수정하는 흐름도 구현했습니다.', 533, 438, 270, 9.8, keep_words=True)
    b.end([('원본 설계 흐름', PROMPT_REF + 'README.md'), ('대화 서버', PROMPT_REF + 'server/app.py'),
           ('영역별 상태', PROMPT_REF + 'state.py')])


def prompt_generator(b):
    b.start('Prompt Generator · 영역별 설계 대화',
            '대화 문맥, 완료 조건과 호출 오류를 각각의 상태 전환으로 다룹니다.', key='prompt-architecture')
    b.image('@architecture/returned/prompt.png', M, 129, 490, 372)
    b.section('영역별 문맥 분리', '여섯 영역의 첫 질문을 병렬로 시작하고, 각 영역의 대화 이력·진행 상태·결과를 따로 유지합니다. 한 영역의 답변을 다른 영역의 대화에 섞지 않는 구조입니다.', 560, 137, 243, 9.7, keep_words=True)
    b.section('질문과 완료 결과의 구분', '처리 라운드 조건과 결과 생성 태그를 함께 확인해 완료로 전환합니다. 조건이 맞지 않으면 질문을 이어가며, 이 조건이 생성 품질을 판정하는 것은 아닙니다.', 560, 263, 243, 9.7, keep_words=True)
    b.section('호출 오류 시 상태 처리', '처리 대상 LLM 오류가 나면 라운드를 되돌리고 해당 영역을 대기 상태로 바꿉니다. 입력·응답은 호출 성공 뒤 이력에 추가하며 자동 재시도는 하지 않습니다.', 560, 389, 243, 9.7, keep_words=True)
    b.para('세션은 연결 종료 시 삭제되며 재접속 복구는 없습니다. 요구사항 반영률·생성 품질의 평가 결과는 확인되지 않았습니다.', M, 520, CW, 9.1, 14, MUTED)
    b.end([('영역별 상태', PROMPT_REF+'state.py'), ('완료 조건', PROMPT_REF+'dimensions/runner.py'),
           ('오류 처리', PROMPT_REF+'server/graph_runner.py'), ('대화 서버', PROMPT_REF+'server/app.py')])

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


PAGES = [introduction, project_index, thing_overview, thing_architecture, thing_control, thing_result,
         aqis_overview, aqis_mock, aqis_coordinates, briefit_overview, briefit_data,
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
