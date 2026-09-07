"""Code-reviewed architecture scenes shared by PDF, SVG and Excalidraw exports.

The four new scenes use transparent Simple Icons SVGs. Text and connectors remain
editable in Excalidraw and native vectors/searchable text in the portfolio PDF.
Install svglib>=2.2 for SVG icon rendering; no raster conversion is involved.
"""
from pathlib import Path
from io import BytesIO
import base64
import hashlib
import json
import math
from xml.sax.saxutils import escape

from reportlab.lib.colors import HexColor
from reportlab.graphics import renderPDF
from svglib.svglib import svg2rlg

ROOT = Path(__file__).resolve().parents[2]
ASSETS = Path(__file__).parent / 'assets/architecture'
INK = '#202124'
MUTED = '#55585b'


class Scene:
    def __init__(self, name, height):
        self.name, self.width, self.height = name, 766, height
        self.items = []

    def box(self, x, y, w, h, title=None):
        self.items.append(dict(type='box', x=x, y=y, w=w, h=h))
        if title:
            self.text(title, x+11, y+10, 11.5, mono=True)

    def text(self, text, x, y, size=10, mono=False, color=INK):
        self.items.append(dict(type='text', text=text, x=x, y=y,
                               size=size, mono=mono and text.isascii(), color=color))

    def icon(self, name, x, y, size=27, label=None):
        self.items.append(dict(type='icon', name=name, x=x, y=y, size=size))
        if label:
            self.text(label, x, y+size+5, 9)

    def arrow(self, *points):
        self.items.append(dict(type='arrow', points=points))


def scenes():
    s = Scene('mri', 270)
    s.box(2, 110, 132, 103, 'INPUT')
    s.icon('python', 17, 147, 26)
    s.text('MRI 이미지', 51, 147, 11)
    s.text('같은 로컬 파일', 17, 186, 9.5, color=MUTED)
    s.box(198, 2, 270, 260, 'LOCAL INFERENCE')
    for name, x, label in [('python', 215, 'Python'), ('pytorch', 296, 'PyTorch'), ('ultralytics', 378, 'YOLO11')]:
        s.icon(name, x, 36, 26, label)
    s.box(213, 102, 240, 64)
    s.text('종양 분류', 227, 113, 11.5)
    s.text('YOLO11 classifier / 독립 .pt 가중치', 227, 140, 9.4)
    s.box(213, 185, 240, 64)
    s.text('영역 분할', 227, 196, 11.5)
    s.text('YOLO11 segmenter / 독립 .pt 가중치', 227, 223, 9.4)
    s.arrow((134,161),(166,161),(166,134),(213,134))
    s.arrow((166,161),(166,217),(213,217))
    s.box(565, 104, 197, 141, 'RESULT COMPOSITOR')
    s.icon('opencv', 581, 139, 28, 'OpenCV')
    s.icon('ultralytics', 672, 139, 28, 'plot()')
    s.text('분류명 + 분할 영역 합성', 581, 194, 10.5)
    s.text('원본 위에 표시 · 이미지 저장', 581, 220, 9.4)
    s.arrow((453,134),(510,134),(510,148),(565,148))
    s.arrow((453,217),(535,217),(535,204),(565,204))
    s.text('범주·점수', 482, 113, 9.3, color=MUTED)
    s.text('마스크', 487, 224, 9.3, color=MUTED)
    result = {'mri': s}

    s = Scene('alkkagi', 249)
    for x, title in [(2, 'BROWSER A'), (605, 'BROWSER B')]:
        s.box(x, 21, 159, 220, title)
        s.icon('react', x+16, 60, 30, 'React')
        s.icon('typescript', x+93, 62, 27, 'TypeScript')
        s.text('DOM / SVG', x+16, 123, 11, mono=True)
        s.text('드래그 조준·발사', x+16, 155, 10)
        s.text('서버 상태로 화면 갱신', x+16, 186, 9.5)
        s.text('Vite build', x+16, 216, 9, mono=True, color=MUTED)
    s.box(268, 2, 254, 239, 'NODE SERVER :3001')
    for name,x,label in [('nodedotjs',282,'Node.js'),('express',361,'Express'),('socketdotio',440,'Socket.IO')]:
        s.icon(name,x,38,25,label)
    s.box(282, 94, 225, 66)
    s.text('INPUT GUARD / PHYSICS', 293, 106, 10, mono=True)
    s.text('60Hz 목표 루프 · 10 substeps',293,132,9.5)
    s.box(282, 189, 225, 39)
    s.text('IN-MEMORY GAME STATE',293,201,10,mono=True)
    s.arrow((395,160),(395,189))
    s.arrow((161,125),(282,125))
    s.arrow((605,125),(507,125))
    s.arrow((282,208),(161,208))
    s.arrow((507,208),(605,208))
    s.text('join / flick',175,103,9.2,mono=True)
    s.text('join / flick',525,103,9.2,mono=True)
    s.text('state update',171,183,9.2,mono=True)
    s.text('state update',522,183,9.2,mono=True)
    s.text('Socket.IO',181,143,9.2,mono=True,color=MUTED)
    s.text('Socket.IO',530,143,9.2,mono=True,color=MUTED)
    result['alkkagi'] = s

    s = Scene('prompt', 266)
    s.box(2, 42, 158, 211, 'BROWSER')
    for name,x,label in [('html5',15,'HTML'),('css',67,'CSS'),('javascript',119,'JS')]:
        s.icon(name,x,80,25,label)
    s.text('아이디어 입력',17,139,11)
    s.text('영역별 질문·답변',17,170,10)
    s.text('진행 상태·결과 표시',17,201,9.5)
    s.box(252, 2, 297, 257, 'PYTHON SERVER :8000')
    for name,x,label in [('python',267,'Python'),('fastapi',358,'FastAPI'),('langchain',450,'LangChain')]:
        s.icon(name,x,37,25,label)
    s.box(267, 98, 267, 47)
    s.text('MEMORY SESSION / Python dict',280,109,10,mono=True)
    s.text('대화 이력 · 상태 · 영역별 결과',280,128,9.2)
    s.box(267, 174, 267, 73)
    s.text('화면·사용성       시스템 구조',280,184,10)
    s.text('데이터 저장        API',280,205,10)
    s.text('배포                   테스트',280,226,10)
    s.arrow((400,145),(400,174))
    s.text('6개 영역',410,152,9,color=MUTED)
    s.box(623, 16, 140, 116, 'UPSTAGE API')
    s.text('Solar Pro',637,51,15,mono=True)
    s.text('질문·프롬프트 생성',637,86,9.5)
    s.text('외부 LLM 호출',637,108,9,color=MUTED)
    s.box(623, 176, 140, 77, 'OUTPUT')
    s.icon('markdown',635,209,23)
    s.text('통합 설계 문서',665,210,9.5)
    s.text('Markdown',665,231,9,mono=True)
    s.arrow((160,126),(267,126))
    s.text('REST + WS',168,105,9.4,mono=True)
    s.arrow((267,211),(160,211))
    s.text('질문·상태',179,190,9.5)
    s.arrow((549,65),(623,65))
    s.arrow((623,111),(549,111))
    s.text('LLM API',560,44,9.4,mono=True)
    s.arrow((549,216),(623,216))
    s.text('생성 결과',565,194,9.2)
    result['prompt'] = s

    s = Scene('briefit', 288)
    s.box(2, 2, 195, 119, 'NEWS COLLECTION')
    s.icon('python',16,39,27,'Python')
    s.text('Crawl4AI',65,43,12,mono=True)
    s.text('BeautifulSoup / lxml',65,68,9.3,mono=True)
    s.text('HTTP(S) · URL 중복·본문 필터',16,100,9.2)
    s.box(239, 26, 127, 70, 'LOCAL JSON')
    s.text('content 필드',253,65,10,mono=True)
    s.arrow((197,65),(239,65))
    s.box(406, 2, 356, 119, 'MODEL TRAINING / EVALUATION')
    s.icon('huggingface',420,39,26)
    s.icon('pytorch',455,39,26)
    s.text('KoBART',420,77,12,mono=True)
    s.text('JSONL → checkpoint',420,101,9.2,mono=True)
    s.text('Evaluate.py',623,43,10.2,mono=True)
    s.text('ROUGE-1 / 2 / L',623,67,9.4,mono=True)
    s.text('후처리 미적용',623,93,9.5)
    s.arrow((542,76),(608,76))
    s.text('model',559,58,9,mono=True)
    s.box(2, 185, 127, 81, 'ARTICLE JSON')
    s.text('body 필드',16,224,10,mono=True)
    s.box(195, 180, 248, 98, 'LOCAL INFERENCE')
    s.icon('huggingface',209,216,26)
    s.text('KoBART / Transformers',249,218,10.3,mono=True)
    s.text('체크포인트 로드 · 긴 본문 분할',209,253,9.3)
    s.box(494, 185, 132, 81, 'POSTPROCESS')
    s.text('_clean_tail()',508,222,9.7,mono=True)
    s.text('반복·짧은 끝문장 정리',504,246,9)
    s.box(674, 197, 88, 59, 'OUTPUT')
    s.text('콘솔 요약문',684,233,9.5)
    s.arrow((129,226),(195,226))
    s.arrow((443,226),(494,226))
    s.arrow((626,226),(674,226))
    s.arrow((491,121),(491,148),(319,148),(319,180))
    s.text('저장한 모델',373,129,9.4,color=MUTED)
    s.text('수집 파일과 추론 입력의 필드 매핑은 별도',5,149,9.4,color=MUTED)
    result['briefit'] = s
    return result


def icon_path(name):
    return ASSETS / 'icons' / f'{name}.svg'


def draw_architecture(book, name, x, top):
    """Native PDF borders/text/edges plus native vector SVG logo paths."""
    scene = scenes()[name]
    c = book.c
    page_height = c._pagesize[1]
    for item in scene.items:
        kind = item['type']
        if kind == 'box':
            c.setStrokeColor(HexColor(INK))
            c.setLineWidth(.85)
            c.roundRect(x+item['x'], page_height-top-item['y']-item['h'],
                        item['w'], item['h'], 9, stroke=1, fill=0)
        elif kind == 'text':
            font = 'Courier' if item['mono'] else 'Korean'
            book.text(item['text'], x+item['x'], top+item['y'], item['size'],
                      font, HexColor(item['color']))
        elif kind == 'icon':
            drawing = svg2rlg(BytesIO(icon_path(item['name']).read_bytes()))
            c.saveState()
            c.translate(x+item['x'], page_height-top-item['y']-item['size'])
            c.scale(item['size']/drawing.width, item['size']/drawing.height)
            renderPDF.draw(drawing, c, 0, 0)
            c.restoreState()
            book.track(item['name']+' SVG icon', x+item['x'], top+item['y'],
                       item['size'], item['size'], 'icon')
        else:
            points = [(x+a,top+b) for a,b in item['points']]
            c.saveState()
            c.setStrokeColor(HexColor(INK))
            c.setLineWidth(.95)
            path = c.beginPath()
            path.moveTo(points[0][0],page_height-points[0][1])
            for xx,yy in points[1:]:
                path.lineTo(xx,page_height-yy)
            xx,yy = points[-1]
            px,py = points[-2]
            angle = math.atan2(yy-py,xx-px)
            for sign in [-1,1]:
                path.moveTo(xx-5*math.cos(angle+sign*.5),page_height-(yy-5*math.sin(angle+sign*.5)))
                path.lineTo(xx,page_height-yy)
            c.drawPath(path)
            c.restoreState()


def export_scene(scene):
    """Self-contained SVG and Excalidraw v2 scene with embedded SVG files."""
    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{scene.width*2}" height="{scene.height*2}" viewBox="0 0 {scene.width} {scene.height}">',
           f'<title>{scene.name} software architecture</title>',
           '<defs><marker id="arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M1 1 L6 3.5 L1 6" fill="none" stroke="#202124"/></marker></defs>']
    elements, files = [], {}
    for i,item in enumerate(scene.items):
        kind = item['type']
        ident = f'{scene.name}-{i:03d}'
        e = dict(id=ident, type=kind, x=item.get('x',0)*2, y=item.get('y',0)*2,
                 width=0, height=0, angle=0, strokeColor=INK, backgroundColor='transparent',
                 fillStyle='solid', strokeWidth=1.7, strokeStyle='solid', roughness=.5,
                 opacity=100, groupIds=[], frameId=None, roundness=None, seed=1000+i,
                 version=1, versionNonce=1000+i, isDeleted=False, boundElements=None,
                 updated=0, link=None, locked=False)
        if kind == 'box':
            svg.append(f'<rect x="{item["x"]}" y="{item["y"]}" width="{item["w"]}" height="{item["h"]}" rx="9" fill="none" stroke="{INK}" stroke-width=".85"/>')
            e.update(type='rectangle',width=item['w']*2,height=item['h']*2,roundness={'type':3})
        elif kind == 'text':
            font = 'Courier New, monospace' if item['mono'] else 'NanumGothic, Arial, sans-serif'
            svg.append(f'<text x="{item["x"]}" y="{item["y"]+item["size"]}" font-family="{font}" font-size="{item["size"]}" fill="{item["color"]}">{escape(item["text"])}</text>')
            # Excalidraw recalculates text bounds on load. Supply stable initial bounds.
            units = sum(1 if ord(ch)>127 else .61 for ch in item['text'])
            e.update(type='text',text=item['text'],originalText=item['text'],fontSize=item['size']*2,
                     fontFamily=3 if item['mono'] else 2, textAlign='left',verticalAlign='top',
                     containerId=None,autoResize=True,lineHeight=1.25,
                     width=units*item['size']*2,height=item['size']*2*1.25,
                     strokeColor=item['color'],roughness=0)
        elif kind == 'icon':
            data = icon_path(item['name']).read_bytes()
            uri = 'data:image/svg+xml;base64,'+base64.b64encode(data).decode()
            svg.append(f'<image x="{item["x"]}" y="{item["y"]}" width="{item["size"]}" height="{item["size"]}" href="{uri}"/>')
            fid = hashlib.sha256(data).hexdigest()
            files[fid] = dict(id=fid,mimeType='image/svg+xml',dataURL=uri,created=0,lastRetrieved=0)
            e.update(type='image',width=item['size']*2,height=item['size']*2,
                     fileId=fid,status='saved',scale=[1,1],crop=None,strokeColor='transparent',roughness=0)
        else:
            points = item['points']
            data = 'M '+' L '.join(f'{a} {b}' for a,b in points)
            svg.append(f'<path d="{data}" fill="none" stroke="{INK}" stroke-width=".95" marker-end="url(#arrow)"/>')
            xx,yy = points[0]
            e.update(type='arrow',x=xx*2,y=yy*2,
                     width=(max(a for a,b in points)-min(a for a,b in points))*2,
                     height=(max(b for a,b in points)-min(b for a,b in points))*2,
                     points=[[(a-xx)*2,(b-yy)*2] for a,b in points],
                     startBinding=None,endBinding=None,startArrowhead=None,endArrowhead='arrow',elbowed=False)
        elements.append(e)
    svg.append('</svg>')
    ASSETS.mkdir(parents=True,exist_ok=True)
    (ASSETS/f'{scene.name}.svg').write_text('\n'.join(svg),encoding='utf-8')
    (ASSETS/f'{scene.name}.excalidraw').write_text(json.dumps(dict(
        type='excalidraw',version=2,source='https://excalidraw.com',elements=elements,
        appState={'viewBackgroundColor':'#ffffff','exportBackground':False,'gridSize':None},
        files=files),ensure_ascii=False,indent=2),encoding='utf-8')


if __name__ == '__main__':
    for scene in scenes().values():
        export_scene(scene)
    print('Exported 4 SVG + 4 editable Excalidraw architecture scenes.')
