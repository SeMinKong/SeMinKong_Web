"""Editable, evidence-led A4 portfolio. Requires ReportLab and Pillow.

Run from repository root. --sample renders the three initial style-check pages.
The publication PDF contains only public project material and contact channels.
"""
from pathlib import Path
import argparse
import json
from urllib.parse import quote

from PIL import Image
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
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
WEB = 'https://seminkong.github.io/SeMinKong_Web/'
W, H = A4
M, CW = 46, W - 92
INK, MUTED, PAPER, LINE, ACCENT = map(HexColor, ['#171512', '#625e56', '#f7f5ef', '#d4d0c5', '#a73524'])
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


class Book:
    def __init__(self, target, sample=False):
        target.parent.mkdir(parents=True, exist_ok=True)
        self.c = canvas.Canvas(str(target), pagesize=A4, pageCompression=1)
        self.c.setTitle('공세민 | Software & Robotics Portfolio')
        self.c.setAuthor('공세민 / Se Min Kong')
        self.c.setSubject('Selected projects, personal contributions, implementation decisions and verification scope')
        self.c.setKeywords('공세민, Se Min Kong, Robotics, Software, Portfolio')
        self.c.setViewerPreference('DisplayDocTitle', 'true')
        self.sample, self.n = sample, 0
        self.checks = []

    def text(self, text, x, top, size=11, font='Korean', color=INK):
        self.c.setFillColor(color)
        self.c.setFont(font, size)
        self.c.drawString(x, H-top-size, text)

    def para(self, text, x, top, width=CW, size=11, leading=18, color=INK, bold=False):
        style = ParagraphStyle('p', fontName='KoreanBold' if bold else 'Korean', fontSize=size,
                               leading=leading, textColor=color, wordWrap='CJK', splitLongWords=False)
        p = Paragraph(text, style)
        _, height = p.wrap(width, H)
        if top + height > 771:
            raise ValueError(f'Page {self.n}: text exceeds content area: {text[:60]} at {top+height}')
        p.drawOn(self.c, x, H-top-height)
        self.checks.append({'page':self.n, 'bottom':round(top+height,2), 'text':text[:80]})
        return top+height

    def rule(self, top, x=M, width=CW, color=LINE, weight=.6):
        self.c.setStrokeColor(color)
        self.c.setLineWidth(weight)
        self.c.line(x,H-top,x+width,H-top)

    def label(self, text, x, top):
        self.text(text, x, top, 9, 'Helvetica-Bold', ACCENT)

    def link(self, title, url, x, top, size=9):
        self.text(title,x,top,size,'Korean',ACCENT)
        width=pdfmetrics.stringWidth(title,'Korean',size)
        self.c.linkURL(quote(url,safe=':/#?=&%@'),(x,H-top-size-3,x+width,H-top+2),relative=0,thickness=0)

    def image(self, name, x, top, width, height):
        with Image.open(ASSETS/name) as im:
            iw,ih=im.size
            scale=min(width/iw,height/ih)
            dw,dh=iw*scale,ih*scale
            # Preserve the source artifact and its aspect ratio; no generative image edits.
            self.c.drawImage(ImageReader(im.convert('RGB')),x+(width-dw)/2,H-top-dh,width=dw,height=dh)
        return top+dh

    def start(self, section, title, subtitle='', key=None):
        self.n+=1
        self.c.setFillColor(PAPER)
        self.c.rect(0,0,W,H,fill=1,stroke=0)
        self.text('SE MIN KONG',M,28,8.5,'Helvetica-Bold')
        self.text(section.upper(),W-215,28,8.5,'Helvetica',MUTED)
        self.rule(49)
        self.text(title,M,73,27,'KoreanBold')
        if subtitle:
            self.para(subtitle,M,117,CW,10,16,MUTED)
        self.c.bookmarkPage(key or f'p{self.n}')
        self.c.addOutlineEntry(title,key or f'p{self.n}',level=0,closed=False)

    def end(self, sources=None):
        if sources:
            self.rule(779)
            x=M
            for title,url in sources:
                self.link(title,url,x,787,8.5)
                x+=pdfmetrics.stringWidth(title,'Korean',8.5)+20
                if x>W-M+20:
                    raise ValueError(f'Page {self.n}: source links overflow')
        self.text('PORTFOLIO  /  '+VERSION+('  /  STYLE SAMPLE' if self.sample else ''),M,817,7.5,'Helvetica',MUTED)
        self.text(f'{self.n:02d}',W-M-12,814,10,'Helvetica-Bold')
        self.c.showPage()

    def block(self, number, title, body, top, x=M, width=CW):
        self.label(number,x,top)
        self.para(title,x+32,top-2,width-32,13,19,bold=True)
        return self.para(body,x+32,top+29,width-32,11,18)+17

    def flow(self, items, top, x=M, width=CW):
        col=width/len(items)
        for i,(label,detail) in enumerate(items):
            xx=x+i*col
            self.rule(top,xx,col-13,ACCENT,1.1)
            self.label(f'{i+1:02d}',xx,top+12)
            self.para(label,xx,top+32,col-17,11,16,bold=True)
            self.para(detail.replace('\n','<br/>'),xx,top+77,col-17,9,14,MUTED)
            if i<len(items)-1:
                self.text('>',xx+col-15,top+35,11,'Helvetica',MUTED)


def cover(b):
    b.start('Selected work / 2025 - 2026','공세민','',key='cover')
    b.text('Se Min Kong',M,119,44,'Helvetica-Bold')
    b.text('SOFTWARE  /  ROBOTICS',M,184,10,'Helvetica-Bold',ACCENT)
    b.para('인식한 것을,<br/>움직이는 시스템으로.',M,242,228,23,34,bold=True)
    b.para('모델의 출력이 장비의 동작과<br/>화면의 상태로 이어지는 과정을 만듭니다.',M,338,220,11,19)
    b.image('thing/integrated-robot-hand-portrait.webp',303,239,246,328)
    b.para('THING / 텐던 로봇 핸드 통합 조립',303,576,246,8.5,13,MUTED)
    b.rule(632)
    b.para('여섯 프로젝트의 문제, 직접 맡은 일,<br/>구현 판단과 확인한 범위를 정리했습니다.',M,656,340,12,20)
    b.link('seminkong.github.io/SeMinKong_Web/',WEB,M,722,10)
    b.link('semin1224@gmail.com','mailto:semin1224@gmail.com',M,746,10)
    b.end()


def profile(b):
    b.start('Profile','하는 일과 해 온 일','AI & Robotics Software Developer',key='profile')
    b.para('모델을 연결하고, 장비를 움직이고,<br/>그 상태를 사람이 읽을 수 있게 만듭니다.',M,167,CW,21,32,bold=True)
    b.rule(264)
    rows=[('01','실물 구동과 통합','THING에서 7축 모터 점검·제어 스크립트, 전완부 고정부 제작, 스풀·텐던 조립을 맡았습니다.'),
          ('02','운영 흐름을 다루는 소프트웨어','AQIS 2인 팀의 팀장으로 RealOps, REST·WebSocket, ROS 2 bridge와 장비 연동을 담당했습니다.'),
          ('03','모델 실험을 실행 흐름으로','MRI 마스크 전처리와 통합 추론, Briefit의 KoBART 학습·생성 및 후처리 코드를 작성했습니다.')]
    t=286
    for n,title,body in rows:
        t=b.block(n,title,body,t)
    b.rule(612)
    b.label('EDUCATION & TRAINING',M,634)
    b.para('<b>삼성청년SW·AI아카데미</b> / Robotics Track<br/>2026.01 - 현재',M,661,235,10.5,18)
    b.para('<b>숭실대학교 소프트웨어학부</b><br/>2020.03 - 2026.02',314,661,235,10.5,18)
    b.para('사용 기술은 프로젝트 안에서 역할과 함께 설명합니다. 본인 작업과 팀 전체 결과를 구분해 표기했습니다.',M,723,CW,9.5,16,MUTED)
    b.end([('프로필·이력',WEB+'resume/'),('GitHub','https://github.com/SeMinKong')])


def contents(b):
    b.start('Project map','프로젝트를 읽는 순서','실물 시스템부터 모델·실시간 인터랙션·언어 처리까지',key='contents')
    projects=[('04 - 06','THING','7축 구동 환경과 기구 통합','thing'),('07 - 08','AQIS','검출 이벤트를 장비 동작과 관제로 연결','aqis'),('09 - 10','Brain MRI','분류·분할 전처리와 통합 추론','brain-tumor-mri'),('11','Alkkagi.io','서버 기준 상태와 직접 구현한 물리','alkkagi'),('12','Briefit','기사 수집·KoBART 실험·생성 후처리','briefit'),('13','Prompt Generator','설계 영역별 대화 상태 관리','project-prompt-generator')]
    for i,(pages,title,desc,route) in enumerate(projects):
        top=168+i*82
        b.rule(top)
        b.text(pages,M,top+19,11,'Helvetica-Bold',ACCENT)
        b.text(title,M+96,top+13,18,'Helvetica-Bold')
        b.para(desc,M+96,top+43,340,10.5,17,MUTED)
        b.c.linkURL(WEB+'work/'+route+'/',(M,H-top-72,W-M,H-top),relative=0,thickness=0)
    b.rule(676)
    b.para('관심 있는 프로젝트 제목을 누르면 웹의 상세 페이지로 이동합니다. PDF에는 읽는 데 필요한 핵심을 담고, 영상과 코드는 각 페이지의 링크로 연결했습니다.',M,702,CW,11,18)
    b.end([('전체 프로젝트',WEB+'work/'),('수상·연락처: 14쪽',WEB+'resume/')])


def thing_overview(b):
    b.start('01 / THING','손의 움직임을 7축 구동으로','6인 팀 프로젝트 / 2026.07 - 08 / Motor control & mechanical integration',key='thing')
    b.image('thing/integrated-robot-hand-portrait.webp',M,172,183,244)
    b.label('PROJECT CONTEXT',253,172)
    b.para('카메라가 읽은 손동작으로<br/>텐던 로봇 핸드를 움직이는 시스템',253,197,296,15,23,bold=True)
    b.para('팀은 손동작 인식, 7축 명령 변환, ROS 2 제어, 로봇손 구동과 관제를 연결했습니다. 엄지는 3축, 나머지 네 손가락은 각각 1축으로 다뤘습니다.',253,263,296,11,18)
    b.label('MY SCOPE',253,350)
    b.para('모터 점검·제어 스크립트와 실물 조립을 담당했습니다. 비전·ROS 2 안전 제어·웹 관제는 팀 전체 결과이며, 이 문서에서는 구동·기구 작업을 중심으로 설명합니다.',253,375,296,10.5,18)
    b.flow([('손동작 인식','카메라 / MediaPipe\n21 landmarks'),('명령 변환','7개 논리축\nHandCommand'),('제어·안전','명령 중재 / guard\n로컬 정지 경로'),('실물 동작','DYNAMIXEL\n스풀 / 텐던')],471)
    b.rule(630)
    b.para('<b>팀 구조에서 본인 작업이 놓인 곳</b><br/>영상 인식 결과가 실제 움직임이 되려면 모터 ID·배선·동작 범위와 텐던 경로가 맞아야 합니다. 구동 환경을 먼저 점검하고 기구와 모터를 통합한 작업을 다음 페이지에서 설명합니다.',M,654,CW,11,19)
    b.end([('팀 전체 구조',THING+'blob/main/README.md'),('실제 시연',WEB+'work/thing/')])


def thing_personal(b):
    b.start('01 / THING / Personal work','7개의 모터를 실제 손에 연결하기','공세민 명의 작업 기록을 기준으로 정리한 담당 범위',key='thing-personal')
    b.label('COMMUNICATION  /  CONTROL  /  ASSEMBLY',M,167)
    b.para('통신 확인에서 끝내지 않고,<br/>스풀과 텐던이 움직이는 상태까지.',M,196,CW,20,30,bold=True)
    b.rule(281)
    t=305
    t=b.block('01','먼저, 구동 환경을 분리해 점검','모터 제어·통신 환경을 구성하고 7개 모터의 통신을 확인했습니다. 전체 장치를 한 번에 움직이기 전에 모터별 상태를 확인할 수 있도록 점검 경로를 나눴습니다.',t,width=321)
    t=b.block('02','개별 동작을 반복 가능한 명령으로','모터 스캔, 단일 모터, 키보드 제어, 원위치 복귀 스크립트를 작성했습니다. 개별·전체 정지 기능을 두어 조립 중에도 동작을 구분해 확인할 수 있게 했습니다.',t,width=321)
    t=b.block('03','제어 축과 물리적 경로를 함께 정리','전완부 아크릴 고정부를 설계·가공·조립하고, 모터·스풀·텐던의 연결 경로를 구성했습니다. 감김 방향, 장력, 프레임 간섭은 실제 조립에서 확인해야 하는 조건이었습니다.',t,width=321)
    b.image('thing/integrated-robot-hand-portrait.webp',389,306,160,214)
    b.para('통합 조립 상태<br/>팀 공유 작업 사진',389,532,160,8.5,14,MUTED)
    b.rule(724)
    b.para('확인된 결과: 7개 모터 통신, 제어 스크립트 작성, 모터 고정부와 텐던 통합 조립.',M,739,CW,9.5,15,MUTED)
    b.end([('7/28 제어 기록',THING+'blob/main/docs/daily-reports/2026-07-28/2026-07-28-공세민.md'),('7/29 제작 기록',THING+'blob/main/docs/daily-reports/2026-07-29/2026-07-29-공세민.md'),('7/31 조립 기록',THING+'blob/main/docs/daily-reports/2026-07-31/2026-07-31-공세민.md')])


def thing_verify(b):
    b.start('01 / THING / Verification','동작 시연과 다음 검증','공개 시연에서 확인한 동작과 반복 시험 과제',key='thing-verification')
    b.image('thing/jetson-mediapipe-hands-test-1600.webp',M,166,244,182)
    b.image('thing/demos/can-grasp-poster.webp',305,166,244,182)
    b.para('손동작 인식 시험',M,356,244,9,14,MUTED)
    b.para('물체 파지 시연',376,356,173,9,14,MUTED)
    b.rule(394)
    b.block('01','팀의 제어 구조','웹이 모터를 직접 제어하지 않고 명령 중재와 guard를 통과하도록 구성했습니다. GPIO E-Stop과 로컬 안전 상태는 웹·외부 연결과 구분해 다룹니다. 이는 팀 전체의 구조입니다.',417)
    b.block('02','확인할 수 있는 결과','공개 영상에서 손동작 모방과 파지 동작을 볼 수 있습니다. 본인 작업 기록에는 7개 모터의 통신 확인과 모터 고정부·텐던 조립 과정이 남아 있습니다.',535)
    b.block('03','다음에 더 검증할 것','파지 절차에는 10회 반복·3초 유지 기준이 있지만 결과표가 비어 있습니다. 반복 성공률, 제어 지연, 장력 변화와 내구성은 별도 시험 기록이 필요합니다.',653)
    b.end([('시연 영상',WEB+'work/thing/'),('안전 구조',THING+'blob/main/docs/safety_manager.md'),('파지 시험 절차',THING+'blob/main/tests/procedures/grasp-test.md')])


def aqis_overview(b):
    b.start('02 / AQIS','검출 결과를 공정의 다음 동작으로','2인 팀 / 팀장·Full-stack & Robot Integration / 2026.05 기획, 06 본 개발',key='aqis')
    b.image('aqis/real-ops.png',M,163,CW,283)
    b.para('RealOps 관제 화면 / 장비 상태·검출 결과·명령을 한 흐름에서 확인',M,452,CW,8.5,14,MUTED)
    b.rule(483)
    b.label('MY SCOPE',M,504)
    b.para('관제와 서버,<br/>장비 사이의 연결을 담당했습니다.',M,529,227,16,25,bold=True)
    b.para('RealOps Dashboard, FastAPI REST·WebSocket, ROS 2 bridge와 장비 adapter를 구현했습니다. 불량 검출 뒤 컨베이어 정지, Dobot 분류, 공정 재개로 이어지는 연동을 맡았습니다.',302,503,247,11,18)
    b.para('협업 범위: 팀원은 YOLO 학습, Roboflow, CAD와 시뮬레이션을 맡았고, 저는 관제·서버·장비 통합을 맡았습니다.',302,620,247,10,17,MUTED)
    b.rule(703)
    b.para('핵심 판단: 하드웨어 사용을 기다리는 동안 mock adapter로 공통 REST·WebSocket 경로를 먼저 개발했습니다.',M,724,CW,10.5,18)
    b.end([('역할·일정',AQIS+'blob/main/docs/07-roles-and-schedule.md'),('Mock-first 결정',AQIS+'blob/main/docs/day1-decisions.md'),('웹·영상',WEB+'work/aqis/')])


def aqis_decision(b):
    b.start('02 / AQIS / Integration decision','움직이는 대상의 좌표는 오래되지 않게','컨베이어 정지 이후의 검출을 사용하는 장비 연동 흐름',key='aqis-decision')
    b.label('PROBLEM',M,163)
    b.para('검출한 순간의 좌표로 집으면,<br/>로봇이 도착할 때 대상은 이미 이동해 있습니다.',M,190,CW,19,29,bold=True)
    b.flow([('불량 검출','ROS 2 이벤트\n서버 수신'),('컨베이어 정지','정지 요청\n설정 시간 대기'),('좌표 갱신','정지 후 검출\npick pose 계산'),('분류·재개','Dobot 동작\n정상 종료 후 재개')],290)
    b.rule(454)
    b.block('01','한 번의 검출을 한 번의 작업으로','검출 ID, bbox 겹침, 중심 거리와 시간 창을 사용해 중복 이벤트를 줄입니다. Dobot 동작 중에는 중복 실행을 막고 정상 종료와 실패 종료를 구분합니다.',477)
    b.block('02','실패와 예외를 테스트 대상으로','정지 전 좌표 거부, 좌표 보정, 중복 검출, 명령 실패 등을 다루는 테스트 코드가 있습니다. 배속 구간이 있는 시연 영상과 별개로, 반복 분류 성공률과 사이클 시간은 추가 측정이 필요합니다.',594)
    b.para('<b>현재 범위</b> 정지 요청 뒤 설정 시간만큼 기다리며, 물리 센서로 정지를 확인하지는 않습니다. 깊이값이 없으면 고정 pose를 쓰는 경로가 있어 산업용 적용 전 추가 안전 검증이 필요합니다.',M+32,718,CW-32,9.5,16,MUTED)
    b.end([('이벤트 처리 코드',AQIS+'blob/main/server/app/main.py'),('통합 테스트',AQIS+'blob/main/server/tests/test_real_monitoring.py'),('Dobot 서비스',AQIS+'blob/main/server/app/services/dobot_pick_place.py')])


def mri_pipeline(b):
    b.start('03 / Brain MRI','마스크 데이터에서 두 모델의 추론까지','개인 프로젝트 / Python·PyTorch·YOLO11·OpenCV / 2026.02 - 04',key='mri')
    b.image('brain-mri/classification-demo.png',M,164,CW,280)
    b.para('공개 데모의 예측 예시 / healthy는 당시 비종양 클래스 표기입니다. 괄호는 해당 이미지의 모델 점수이며, 전체 평가 정확도가 아닙니다.',M,442,CW,8.5,14,MUTED)
    b.rule(480)
    b.label('DATA PREPARATION',M,503)
    b.para('기존 마스크를<br/>YOLO polygon label로',M,529,235,17,26,bold=True)
    b.para('마스크 이진화, closing·opening, 외곽선 추출과 작은 영역 제외를 거쳐 좌표를 정규화했습니다. 분할 학습이 요구하는 label 형식으로 변환하는 전처리 경로를 구성했습니다.',303,501,246,11,18)
    b.rule(651)
    b.para('<b>분류와 분할은 별도 모델입니다.</b><br/>YOLO11 분류 모델과 분할 모델을 각각 학습하도록 구성하고 두 추론 결과를 하나의 이미지로 합쳤습니다. 분류 결과의 범주와 분할 결과의 위치를 함께 확인할 수 있습니다.',M,675,CW,11,18)
    b.end([('전처리·학습',MRI+'blob/3c9a0694dde759390c5813b60b60b5911448d716/src/training/train.py'),('통합 추론',MRI+'blob/3c9a0694dde759390c5813b60b60b5911448d716/src/testing/test.py'),('데모',WEB+'work/brain-tumor-mri/')])


def mri_evaluation(b):
    b.start('03 / Brain MRI / Evaluation scope','평가 범위와 다음 실험','분류와 분할의 평가 조건을 분리하고 실행 기록을 남기기',key='mri-evaluation')
    b.label('EVALUATION PLAN',M,166)
    b.para('두 추론 경로를 구성했습니다.<br/>다음은 독립 평가 집합에서의 비교입니다.',M,196,CW,19,30,bold=True)
    b.rule(285)
    b.block('01','학습용 검증과 최종 테스트 분리','현재 학습 코드는 test 경로를 val로 연결합니다. 기존 보고값은 독립 최종 평가와 구분해야 합니다. 다음 실험에서는 데이터 분할과 실행 설정을 고정한 뒤, 별도 평가 집합을 사용하려 합니다.',309)
    b.block('02','데이터의 단위와 클래스 의미','BRISC 원문은 환자 식별 정보가 없어 환자 단위 독립성을 보장하기 어렵다고 설명합니다. 비종양 클래스는 비종양성 병변도 포함하므로 모두 건강한 뇌로 해석하지 않습니다.',433)
    b.block('03','실행 기록과 결과를 함께 남기기','실제 사용 파일 목록, 분할 manifest, 학습 설정과 가중치를 결과 로그와 함께 보관하는 것이 다음 과제입니다. 분류별 confusion matrix와 분할 지표를 각각 확인해 오류 유형을 비교하려 합니다.',557)
    b.rule(698)
    b.para('연구·학습용 프로젝트입니다. 환자 단위 독립성과 임상 진단 성능은 검증되지 않았습니다.',M,720,CW,11,19,MUTED)
    b.end([('현재 학습 설정',MRI+'blob/3c9a0694dde759390c5813b60b60b5911448d716/src/training/train.py'),('원천 데이터 논문', 'https://arxiv.org/html/2506.14318v5')])


def alkkagi(b):
    b.start('04 / Alkkagi.io','서버를 기준 상태로 둔 물리 게임','개인 프로젝트 / React·TypeScript·Node.js·Socket.IO / 2026.03 - 04',key='alkkagi')
    b.image('alkkagi/demo-poster.png',M,165,207,207)
    b.label('ONE AUTHORITATIVE STATE',281,166)
    b.para('여러 화면이 같은 충돌 결과를<br/>공유하도록 서버에서 계산합니다.',281,193,268,16,25,bold=True)
    b.para('클라이언트는 입력을 보내고, 서버는 메모리의 gameState를 갱신해 전체 상태를 전송합니다. 충돌·마찰·질량과 반경 변화는 외부 물리 엔진 없이 구현했습니다.',281,272,268,11,18)
    b.flow([('입력','방향·세기\n쿨다운 / 속도 제한'),('물리 갱신','60Hz 목표 주기\n10개 substep'),('동기화','서버 gameState\n전체 상태 broadcast')],418)
    b.rule(579)
    b.para('<b>설계에서 중요했던 부분</b><br/>충돌 임펄스 계산과 겹친 위치 보정을 분리했습니다. 입력 빈도와 최대 속도를 제한하고, 서버가 판정한 위치·질량·반경을 기준으로 화면을 갱신합니다.',M,602,CW,11,19)
    b.para('<b>현재 범위</b> 60Hz는 목표 갱신 주기입니다. 동시접속 부하와 RTT는 추가 측정 항목이며, 지연 상황의 클라이언트 예측·보정은 후속 과제입니다.',M,703,CW,10,17,MUTED)
    b.end([('서버 루프',ALK+'blob/530229c524a432c0016a28376a5c6fccd8f8e5b5/server/index.ts'),('물리 구현',ALK+'blob/530229c524a432c0016a28376a5c6fccd8f8e5b5/server/physics.ts'),('플레이 영상',WEB+'work/alkkagi/')])


def briefit(b):
    b.start('05 / Briefit','요약 결과가 읽히기까지의 데이터 작업','6인 팀·AI 2인 / 본인: AI / 2025.05 - 09',key='briefit')
    b.image('briefit/cover.webp',M,164,CW,225)
    b.para('Briefit 팀 제품 화면 / 담당: AI·데이터 파이프라인',M,397,CW,8.5,14,MUTED)
    b.rule(433)
    b.block('01','수집 단계의 중복과 범위 조정','기사 수집 배치화, URL 필터와 중복 URL 제외를 수정했습니다. 데이터 분할·KoBART 학습·생성·ROUGE 평가 스크립트를 추가했습니다.',456)
    b.block('02','생성 후 읽기 품질을 다루기','짧은 종결문이 반복되는 결과를 처리하는 후처리를 추가했습니다. 긴 입력을 단계적으로 요약하는 경로도 구현해, 수집·학습뿐 아니라 생성 이후의 텍스트를 다뤘습니다.',563)
    b.para('<b>기여 시점과 현재 버전</b> 위 내용은 본인 커밋에 남은 KoBART 작업입니다. 현재 팀 main의 실행 경로는 GPT-OSS로 변경되어, 당시 작업 근거를 별도로 연결했습니다.',M+32,700,CW-32,10,17,MUTED)
    b.end([('기사 수집 커밋',BRIEF+'commit/a7b25dff1438940fea631d8ba597835435b7c32a'),('KoBART 커밋',BRIEF+'commit/714502c017f0c57ebebd634b60ea77a102945d81'),('후처리 커밋',BRIEF+'commit/da4ea1b09cfd44724facc19233d65c07e4301f3a')])


def prompt_generator(b):
    b.start('06 / Prompt Generator','설계 질문을 여섯 영역으로 나누기','개인 프로젝트 / FastAPI·WebSocket·LangChain·Solar Pro / 2026',key='prompt')
    b.para('하나의 긴 대화 대신,<br/>영역마다 질문과 진행 상태를 남깁니다.',M,165,CW,20,31,bold=True)
    labels=[('UI / UX','화면과 사용자 흐름'),('ARCHITECTURE','구조와 책임'),('DATABASE','데이터 모델'),('API','입출력 계약'),('DEPLOYMENT','실행·배포 환경'),('TEST','검증 조건')]
    for i,(label,detail) in enumerate(labels):
        col,row=i%3,i//3
        xx,tt=M+col*173,272+row*85
        b.rule(tt,xx,155)
        b.label(label,xx,tt+15)
        b.para(detail,xx,tt+40,155,10,16,MUTED)
    b.rule(462)
    b.block('01','진행 상태를 영역별로 관리','첫 질문은 asyncio.gather로 병렬 시작합니다. 각 영역의 대화 이력, round, status와 생성 결과를 분리해 관리하고 WebSocket으로 상태를 전달합니다.',486)
    b.block('02','생성 뒤에도 수정 대화를 허용','3라운드부터 생성 태그를 완료 조건으로 검사하며 이후 수정할 수 있습니다. 세션은 메모리에 저장되고 연결 종료 시 삭제됩니다.',600)
    b.para('<b>후속 과제</b> 대화 상태의 영속 저장과 재접속 복구, 영역 간 설계 충돌 점검을 추가하면 긴 설계 작업을 이어가기 쉬워집니다.',M+32,719,CW-32,9.5,16,MUTED)
    b.end([('영역별 상태',PROMPT+'blob/1972aa05d5caca05869a6ba588bf4b7573a7f678/state.py'),('서버 구현',PROMPT+'blob/1972aa05d5caca05869a6ba588bf4b7573a7f678/server/app.py'),('웹 상세',WEB+'work/project-prompt-generator/')])


def contact(b):
    b.start('Awards & Contact','더 자세한 기록은 웹에 있습니다.','수상 이력 / 프로젝트 영상 / 소스 코드 / 연락처',key='contact')
    b.label('SELECTED AWARDS',M,165)
    awards=[('2026.08.10','SSAFY 공통 프로젝트','우수상'),('2025.11.22','IT 프로젝트 프로리그','장려상'),('2025.10.01','제15회 숭실 캡스톤디자인 경진대회','장려상'),('2025.08.18','IT대학 소프트웨어 공모전','금상')]
    for i,(date,title,prize) in enumerate(awards):
        top=203+i*62
        b.text(date,M,top,10,'Helvetica',MUTED)
        b.para(title,M+103,top-2,315,11,17,bold=True)
        b.text(prize,W-M-32,top,10,'Korean',ACCENT)
        b.rule(top+40)
    b.link('개인정보·일련번호를 가린 상장 전시 보기',WEB+'resume/',M,469,10)
    b.rule(517)
    b.text('LET\'S BUILD',M,546,31,'Helvetica-Bold')
    b.text('SOMETHING THAT WORKS.',M,585,23,'Helvetica-Bold')
    b.link('semin1224@gmail.com','mailto:semin1224@gmail.com',M,644,12)
    b.link('github.com/SeMinKong','https://github.com/SeMinKong',M,674,10)
    b.link('seminkong.github.io/SeMinKong_Web/',WEB,M,702,10)
    widget=qr.QrCodeWidget(WEB)
    x0,y0,x1,y1=widget.getBounds()
    side=78
    d=Drawing(side,side,transform=[side/(x1-x0),0,0,side/(y1-y0),0,0])
    d.add(widget)
    renderPDF.draw(d,b.c,W-M-side,H-645-side)
    b.para('이 문서는 2026.09.04 기준 공개 자료와 작업 기록으로 작성했습니다. 링크는 추가 열람용이며, 핵심 역할과 구현 설명은 PDF 본문에 포함했습니다.',M,738,CW,9,14,MUTED)
    b.end()


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--sample',action='store_true')
    args=parser.parse_args()
    target=ROOT/('tmp/pdfs/portfolio/style-sample.pdf' if args.sample else 'output/pdf/SeMinKong-Portfolio.pdf')
    b=Book(target,args.sample)
    pages=[cover,thing_personal,alkkagi] if args.sample else [cover,profile,contents,thing_overview,thing_personal,thing_verify,aqis_overview,aqis_decision,mri_pipeline,mri_evaluation,alkkagi,briefit,prompt_generator,contact]
    for page in pages:
        page(b)
    b.c.save()
    target.with_suffix('.layout.json').write_text(json.dumps(b.checks,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps({'file':str(target),'pages':b.n,'bytes':target.stat().st_size,'sample':args.sample},ensure_ascii=False))


if __name__=='__main__':
    main()
