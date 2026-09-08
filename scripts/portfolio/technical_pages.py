"""Source-backed vector explanations: geometry, scales, timelines and states.

All examples are diagrammatic calculations, not measured experiments.
"""
import math
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.pdfbase import pdfmetrics

W, H = landscape(A4)
INK, MUTED, LINE, ACCENT, TINT, PAPER, BLUE = map(HexColor,
    ['#171512', '#625e56', '#d4d0c5', '#a73524', '#eeeae1', '#f7f5ef', '#486b77'])


def rect(b, x, y, w, h, fill=TINT, stroke=None, radius=3):
    b.c.saveState()
    b.c.setFillColor(fill)
    b.c.setStrokeColor(stroke or fill)
    b.c.setLineWidth(.7)
    b.c.roundRect(x, H-y-h, w, h, radius, fill=1, stroke=bool(stroke))
    b.c.restoreState()


def line(b, points, color=LINE, width=1, dashed=False):
    b.c.saveState()
    b.c.setStrokeColor(color)
    b.c.setLineWidth(width)
    if dashed:
        b.c.setDash(3, 3)
    p=b.c.beginPath()
    p.moveTo(points[0][0], H-points[0][1])
    for x,y in points[1:]: p.lineTo(x,H-y)
    b.c.drawPath(p)
    b.c.restoreState()


def dot(b,x,y,r=3,color=ACCENT):
    b.c.saveState()
    b.c.setFillColor(color)
    b.c.circle(x,H-y,r,fill=1,stroke=0)
    b.c.restoreState()


def circle(b,x,y,r=30,color=INK,fill=TINT):
    b.c.saveState()
    b.c.setStrokeColor(color)
    b.c.setFillColor(fill)
    b.c.setLineWidth(1.2)
    b.c.circle(x,H-y,r,fill=1,stroke=1)
    b.c.restoreState()


def text(b,s,x,y,size=10,color=INK,bold=False):
    b.text(s,x,y,size,'KoreanBold' if bold else 'Korean',color)


def equation(b,s,x,y,size=11,color=INK):
    b.text(s,x,y,size,'Courier',color)


def para(b,s,x,y,w,size=10,leading=14.5,color=INK):
    return b.para(s,x,y,w,size,leading,color,keep_words=True)


def section(b,n,s,y,x=38,w=765):
    b.rule(y,x,w)
    text(b,f'{n:02}',x,y+10,9.5,MUTED)
    text(b,s,x+27,y+8,12,bold=True)


def chip(b,title,detail,x,y,w,h=57,color=INK):
    rect(b,x,y,w,h,stroke=LINE)
    text(b,title,x+12,y+10,10.7,color,True)
    if detail: para(b,detail,x+12,y+31,w-24,9.6,14,MUTED)
    return (x,y,w,h)


def centered(b,s,cx,y,size=10,color=INK,bold=False):
    font='KoreanBold' if bold else 'Korean'
    text(b,s,cx-pdfmetrics.stringWidth(s,font,size)/2,y,size,color,bold)


def connect(b,source,target,color=BLUE,vertical=False):
    """Connect facing box centres with equal endpoint clearance."""
    sx,sy,sw,sh=source; tx,ty,tw,th=target
    if vertical:
        points=[(sx+sw/2,sy+sh+6),(tx+tw/2,ty-6)]
        assert abs(points[0][0]-points[1][0]) < .01
    else:
        points=[(sx+sw+6,sy+sh/2),(tx-6,ty+th/2)]
        assert abs(points[0][1]-points[1][1]) < .01
    b.connections.append(dict(page=b.n,source=source,target=target,vertical=vertical,points=points))
    b.arrow(points,color)


def tokens(b,x,y,w,label,color=BLUE):
    rect(b,x,y,w,24,fill=color)
    for i in range(1,12): line(b,[(x+w*i/12,y+4),(x+w*i/12,y+20)],PAPER,.55)
    text(b,label,x,y-20,10,bold=True)


def footer_note(b,s,y=512):
    para(b,s,38,y,765,9.2,13.2,MUTED)


def thing(b,ref):
    b.start('THING · 관절각 계산과 모터 구동',
        '관절 계산·ROS 제어: 팀 구현 / 본인: 모터 점검·기구 통합 / 수치는 설정값과 계산 예시',key='thing-mechanism')
    section(b,1,'손의 세 점으로 굽힘량 계산',131)
    # Two rays meet at the joint; the smaller included angle is theta.
    joint=(131,213); a=(66,240); z=(196,239)
    b.arrow([joint,a],INK); b.arrow([joint,z],ACCENT)
    dot(b,*joint,4,INK); dot(b,*a,3,INK); dot(b,*z,3,ACCENT)
    angles=[math.radians(23+i*134/30) for i in range(31)]
    line(b,[(131+25*math.cos(t),213+25*math.sin(t)) for t in angles],ACCENT)
    text(b,'θ',127,238,11,ACCENT,True)
    text(b,'a',87,210,10,INK,True); text(b,'b',169,211,10,ACCENT,True)
    text(b,'PIP / MCP',96,183,9.5)
    text(b,'앞 관절',41,247,9.3,MUTED); text(b,'뒤 관절',176,247,9.3,MUTED)
    equation(b,'theta = acos(a.b / (|a||b|))',241,170,10.6)
    equation(b,'bend = clip((180-theta)/125)',241,193,10.6)
    equation(b,'flex = 0.65*near + 0.35*far',241,216,10.6)
    para(b,'clip: 0~1 / 위 식의 각도는 도 단위\nPIP·DIP, 엄지는 MCP·IP를 가중 합산',241,239,284,9.3,13,MUTED)
    para(b,'<b>엄지 대립</b> 손끝-손바닥 중심 거리/손바닥 폭을 0.20~1.25에서 역정규화.<br/><b>엄지 외전</b> CMC→엄지 끝·검지 MCP를 손바닥 평면에 투영한 각도 10~65°.<br/>21개 영상 landmark 기반 추정값입니다.',557,168,246,9.6,14)

    section(b,2,'굽힘량을 모터의 보정 범위로 변환',277)
    # Encoder calibration graph: true linear placement at q=0, .5, 1.
    gx,gy,gw,gh=99,390,180,70
    b.arrow([(gx,gy),(gx,309)],MUTED); b.arrow([(gx,gy),(290,gy)],MUTED)
    line(b,[(gx,gy),(gx+gw,gy-gh)],ACCENT,2)
    px,py=gx+gw/2,gy-gh/2
    line(b,[(gx,py),(px,py),(px,gy)],MUTED,.7,True)
    dot(b,px,py,4)
    text(b,'4300',57,310,9.4); text(b,'1740',57,378,9.4)
    text(b,'0',96,396,9); text(b,'0.5',178,396,9); text(b,'1',274,396,9)
    text(b,'pulse',46,334,9.2,MUTED)
    text(b,'3020 pulse',313,311,19,ACCENT,True)
    equation(b,'1740 + 0.5*(4300-1740)',313,342,10.2)
    para(b,'검지 q=0.5의 최종 목표.<br/>실제 송신값은 이동량 제한을 거쳐 접근.',313,365,220,9.5,13.5)
    para(b,'<b>입력 필터</b> 첫 보정 표본으로 초기화.<br/>이후 deadband 0.02 → alpha 0.25 → 표본당 변화 ±0.08.<br/><b>엄지</b> 네 기능 자세 중 선택. MIMIC 후보는 명령 수신 3회·거리 margin 0.1을 만족해야 전환합니다.',557,310,246,9.6,14)

    section(b,3,'추론과 모터 통신의 주기 분리',420)
    left,right=174,522
    lanes=[('추론 도착',459,[0,.17,.49,.82]),('발행 20Hz',485,[0,.25,.50,.75,1]),('쓰기 50Hz',511,[i/10 for i in range(11)])]
    for label,y,marks in lanes:
        text(b,label,38,y-7,10,bold=True)
        line(b,[(left,y),(right,y)],LINE)
        for f in marks: dot(b,left+(right-left)*f,y,2.3,ACCENT if label=='추론 도착' else BLUE)
    para(b,'설정 주기 개념도 · 추론 사이에도 최신 목표 반복',174,532-13,348,9.1,12,MUTED)
    equation(b,'pps=profile_velocity*.229*4096/60',557,455,9.3)
    equation(b,'step=max(1,floor(pps*speed*dt))',557,474,9.5)
    para(b,'dt≤0.25s / 버스별 Sync Write·읽기 20Hz.<br/>유효 표본 250ms 부재 → 폐기.<br/>300ms 초과 명령 거부 / 실측 주기 보장 없음.',557,489,246,9.4,13.5)
    b.end([('기하·필터',ref+'thing_ws/src/thing_vision/thing_vision/hand_target_node.py#L183'),('비전 설정',ref+'thing_ws/src/thing_bringup/config/vision.yaml#L21'),('모터·주기',ref+'thing_ws/src/thing_hardware/src/motor_driver_node.cpp#L542'),('보정값',ref+'thing_ws/src/thing_bringup/config/motors.yaml#L31')])


def aqis(b,ref):
    b.start('AQIS · 중복 검출과 집기 좌표 처리',
        '중복 집계와 집기 좌표 갱신을 분리 / 좌표 연결·서버·관제: 본인 구현 / 비전 역투영: 팀 구현',key='aqis-transform')
    section(b,1,'반복 검출은 한 번만 집계',131)
    line(b,[(72,207),(517,207)],MUTED)
    for x,label,detail,color in [(95,'첫 검출','집계 +1',ACCENT),(260,'중복','위치·시각 갱신',BLUE),(425,'중복','다시 갱신',BLUE)]:
        dot(b,x,207,4,color)
        centered(b,label,x,178,10,color,True)
        centered(b,detail,x,223,9.7)
    line(b,[(95,246),(425,246),(425,240)],ACCENT)
    text(b,'최근 기록과 비교하는 8초 창 · 관측 중에는 계속 갱신',72,255,9.5,MUTED)
    para(b,'<b>같은 key</b>: label·result·is_defect<br/><b>중복 조건</b>: 명시적 ID 일치 / IoU≥0.5 / 중심 거리≤70px 중 하나.<br/>같은 불량에서 양쪽 bbox·center가 모두 없어도 중복입니다.',557,172,246,10,14.5)

    section(b,2,'집기 대기(pending)는 중복 판정보다 먼저 처리',285)
    rect(b,72,335,207,22,fill=HexColor('#ead7d0'))
    rect(b,279,335,238,22,fill=HexColor('#dde6e6'))
    line(b,[(72,346),(517,346)],MUTED)
    for x,label in [(72,'정지 요청'),(279,'ready_at'),(444,'후속 후보')]:
        dot(b,x,346,4,ACCENT if x<279 else BLUE)
        centered(b,label,x+9 if x==72 else x,366,9.8,bold=True)
    text(b,'대기 0.6초',126,313,10,ACCENT,True)
    text(b,'timestamp ≥ ready_at',318,313,10,BLUE,True)
    para(b,'대기 중 항상 반환 → 집계 dedupe로 내려가지 않음',72,392,445,9.5,13,MUTED)
    para(b,'<b>RUNNING + pending</b><br/>준비 시각 이후·이벤트 나이≤3초의 불량 중 깊이 있는 후보 우선.<br/>후보가 있을 때 집기 요청·pending 해제.<br/>timestamp 누락은 허용하며 최초 물체 ID를 고정하지 않습니다.',557,320,246,9.8,14)

    section(b,3,'카메라 좌표를 Dobot 작업 좌표로 변환',422)
    equation(b,'X=(u-cx)*d/fx; Y=(v-cy)*d/fy',38,460,10.4)
    equation(b,'x_mm=1000*(a11*X+a12*Y+tx)+ox',38,483,10.4)
    para(b,'검출 상자 중심 → 깊이 격자 → 유효 깊이 중앙값 d(m).<br/>로봇 y도 affine, z는 고정 높이 또는 X/Y affine. 깊이 누락은 고정 좌표.',38,507,486,9.3,13)
    para(b,'<b>재개 조건</b> 재개 설정 ON + 종료 코드 0.<br/>정지 응답 실패 시에도 자동 차단하지 않습니다. 실제 파지 성공은 센서로 확인하지 않습니다.',557,459,246,9.8,14.5)
    b.end([('중복 창',ref+'server/app/services/detection_deduper.py#L26'),('pending·입력 선택',ref+'server/app/main.py#L212'),('실제 설정',ref+'server/app/config.py#L46'),('좌표·집기',ref+'server/app/services/dobot_pick_place.py#L142')])


def briefit(b,ref):
    b.start('Briefit · 학습 입력과 긴 기사 요약',
        '기사·정답을 학습 쌍으로 구성하고 긴 기사는 부분 요약을 거쳐 재요약 / 본인 2025년 KoBART 소스',key='briefit-seq2seq')
    section(b,1,'기사와 정답을 따로 토큰화',131)
    tokens(b,38,187,300,'기사 text · 최대 384 tokens')
    tokens(b,38,259,200,'정답 summary · 최대 256 tokens',ACCENT)
    encoder=chip(b,'KoBART Encoder','input_ids · attention_mask',406,173,172,52)
    decoder=chip(b,'KoBART Decoder','학습 정답 labels',406,245,172,52)
    b.arrow([(348,199),(396,199)],BLUE)
    b.arrow([(248,271),(396,271)],ACCENT)
    connect(b,encoder,decoder,BLUE,vertical=True)
    para(b,'최대 길이에 맞춰 자르고 패딩한 뒤 Seq2SeqTrainer에 전달합니다.<br/><br/>띠의 길이는 384:256의 설정 비율입니다. 실제 기사 길이를 나타내지는 않습니다.',610,180,193,10.2,15.5)

    section(b,2,'긴 기사는 나눠 요약하고 다시 연결',311)
    chip(b,'입력 ≤1024','단일 생성·후처리',38,350,165,57)
    boxes=[chip(b,title,detail,38+i*200,421,165,57) for i,(title,detail) in enumerate([
        ('입력 >1024','문단 누적·분할'),('부분 요약','출력 상한 512'),('결과 연결','요약문이 새 입력'),('재요약','출력 상한 512')])]
    for source,target in zip(boxes,boxes[1:]): connect(b,source,target)
    equation(b,'beam=4 / length_penalty=1.2',238,351,11)
    para(b,'단일 생성 출력 상한 1024 / 매 생성 입력은 1024토큰에서 잘림.<br/>문단을 더한 뒤 길이 검사 → 긴 문단·재요약 입력은 잘릴 수 있음.',238,376,565,10,14.5)
    text(b,'각 생성의 clean_tail: 짧은 끝문장·직전 반복 제거',238,488,9.7,MUTED)
    footer_note(b,'평가 경로: 기사 1024 → raw 생성 128 → ROUGE(reference). 부분·재요약/후처리를 거치지 않습니다.<br/>후처리는 각 부분 요약에도 적용돼 정상 정보를 지울 수 있으며, 학습 완료·실측 점수는 확인되지 않았습니다.',506)
    b.end([('학습 텐서',ref+'blob/714502c017f0c57ebebd634b60ea77a102945d81/Kobart/Scripts/Train.py#L25'),('긴 입력 분기',ref+'blob/da4ea1b09cfd44724facc19233d65c07e4301f3a/Kobart/Scripts/GenerateJson.py#L61'),('clean_tail',ref+'blob/da4ea1b09cfd44724facc19233d65c07e4301f3a/Kobart/Scripts/GenerateJson.py#L16'),('ROUGE',ref+'blob/714502c017f0c57ebebd634b60ea77a102945d81/Kobart/Scripts/Evaluate.py#L12')])


def mri(b,ref):
    b.start('Brain MRI · 마스크의 YOLO 라벨 변환',
        'mask > 1 → 5×5 closing·opening → 외부 윤곽 → 정규화 좌표 / 아래 도형은 표현 변환 개념도',key='mri-polygons')
    section(b,1,'마스크 정제와 윤곽 추출',131)
    # Explanatory binary mask, not medical image data or a model prediction.
    mask=['0000000000','0000110000','0011111000','0111111100','0111111100','0011111000','0001110000','0000000000']
    x0,y0,s=43,181,12
    for j,row in enumerate(mask):
        for i,val in enumerate(row): rect(b,x0+i*s,y0+j*s,s-1,s-1,ACCENT if val=='1' else TINT,radius=0)
    text(b,'이진 마스크',44,291,10,bold=True)
    b.arrow([(178,231),(219,231)])
    pts=[(254,221),(280,187),(325,189),(352,225),(329,267),(279,273),(250,249)]
    line(b,pts+[pts[0]],ACCENT,1.6)
    for x,y in pts: dot(b,x,y,3)
    text(b,'외부 윤곽점',251,291,10,bold=True)
    b.arrow([(370,231),(411,231)])
    equation(b,'points >= 3',442,190,12)
    equation(b,'area >= 0.001*W*H',442,215,12)
    para(b,'RETR_EXTERNAL / CHAIN_APPROX_SIMPLE<br/>직선의 중간 점을 줄이고 작은 윤곽을 제거.',442,244,361,10,14.5)
    para(b,'고정 5×5 커널: 해상도에 따라 상대 정제 범위 변화. 외부 윤곽·면적 필터는 내부 구멍·작은 실제 병변을 지울 수 있음.',38,320,765,9.5,14,MUTED)

    section(b,2,'정규화 라벨 저장과 두 모델의 추론',353)
    equation(b,'x_norm=x/W    y_norm=y/H',38,392,12)
    rect(b,38,424,355,52)
    equation(b,'class_id x1 y1 x2 y2 ...',52,435,11.3)
    text(b,'YOLO polygon label',52,456,9.5,MUTED)
    para(b,'class_id는 파일명의 종양 코드입니다.<br/>같은 basename의 txt에 소수점 여섯 자리로 저장합니다.',38,492,355,10.3,15.5)

    centered(b,'같은 MRI · 독립 모델 순차 호출',629,391,10.5,bold=True)
    chip(b,'분류 top1·확률','',455,433,156,42)
    chip(b,'분할 mask','',647,433,156,42)
    b.arrow([(629,410),(629,418),(533,418),(533,427)],BLUE)
    b.arrow([(629,410),(629,418),(725,418),(725,427)],BLUE)
    line(b,[(533,481),(533,489),(725,489),(725,481)],BLUE)
    b.arrow([(629,489),(629,501)],BLUE)
    centered(b,'문구 + overlay',629,507,10.4,bold=True)
    centered(b,'비종양에도 분할 · 불일치 자동 보정 없음',629,524,9.2,MUTED)
    b.end([('마스크 정제',ref+'src/training/train.py#L25'),('면적·좌표·라벨',ref+'src/training/train.py#L40'),('별도 학습',ref+'src/training/train.py#L136'),('통합 추론',ref+'src/testing/test.py#L117')])


def prompt(b,ref):
    b.start('Prompt Generator · 문맥 분리와 상태 전이',
        '영역별 대화 이력을 따로 관리하고, 저장된 결과를 모아 설계 문서 작성',key='prompt-state-machine')
    section(b,1,'영역별 LLM 호출에 넣는 메시지',131)
    for i,(title,detail) in enumerate([('영역·라운드 지침','이번 호출의 질문 목적'),('프로젝트 설명','여섯 영역의 공통 맥락'),('해당 영역 history','다른 영역 이력 제외'),('새 사용자 입력','있을 때만 추가')]):
        x=38+i*198
        chip(b,title,detail,x,172,171,57)
        if i: centered(b,'+',x-13.5,193,12,MUTED)
    para(b,'첫 질문: asyncio.gather 병렬 시작 / 동기 LLM invoke: to_thread로 이벤트 루프와 분리',38,243,765,10,14.5)

    section(b,2,'응답에 따른 상태 변경',280)
    boxes=[chip(b,title,detail,38+i*200,320,165,57) for i,(title,detail) in enumerate([
        ('pending','다음 입력 대기'),('in_progress','round + 1 → LLM'),('응답 성공','성공한 턴을 이력에 기록'),('completed','태그 뒤 결과 저장')])]
    for source,target in zip(boxes,boxes[1:]): connect(b,source,target)
    text(b,'round ≥ 3 + [GENERATE_PROMPT]',563,295,9.5,MUTED)
    b.arrow([(320.5,383),(320.5,405),(120.5,405),(120.5,383)],ACCENT,True)
    text(b,'처리 오류: round - 1 · 이력 추가 없음',38,418,10.1,ACCENT)
    text(b,'미완료 응답: in_progress 유지',438,392,10.1,MUTED)
    para(b,'첫 질문도 라운드 1 / RuntimeError·ValueError·OSError 복원 / 자동 재시도 없음',438,414,365,9.4,13.5,MUTED)

    section(b,3,'결과가 있는 영역으로 문서 작성',451)
    labels=['UI/UX','구조','DB','API','배포','테스트']
    for i,s in enumerate(labels):
        x=38+i*62
        rect(b,x,486,53,25,fill=HexColor('#dde6e6') if i in (0,2,4) else TINT)
        text(b,s,x+6,492,9.3,BLUE if i in(0,2,4) else MUTED,True)
    b.arrow([(414,499),(487,499)])
    text(b,'생성 결과 1개 이상 + 프로젝트 → Markdown',504,491,10.2,bold=True)
    footer_note(b,'색은 결과가 있는 영역의 예시입니다. 수정이 실패해도 이전 generated_prompt는 남습니다. 세션은 연결 종료 시 삭제됩니다.',520)
    b.end([('메시지·완료 조건',ref+'dimensions/runner.py#L29'),('상태·오류',ref+'server/graph_runner.py#L40'),('최종 합성',ref+'server/graph_runner.py#L93'),('초기 병렬 호출',ref+'server/app.py#L121')])


def alkkagi(b,ref):
    b.start('Alkkagi.io · 입력 제한과 충돌 반응',
        '서버가 입력을 제한하고 위치·마찰·충격량을 계산한 뒤 전체 상태 배포 / 도형과 수치는 계산 예시',key='alkkagi-collision')
    section(b,1,'입력 크기를 제한하고 질량으로 나누기',131)
    # All vectors share a direction; lengths encode 500, 270, 180.
    for x,length,head,tail,color in [(38,72,'입력 (300,400)','크기 500',MUTED),(213,72*.54,'상한 (162,216)','0.45 × 보드 600 = 270',BLUE),(388,72*.36,'속도 (108,144)','질량 1.5로 나눔',ACCENT)]:
        b.arrow([(x+34,247),(x+34+length*.6,247-length*.8)],color)
        centered(b,head,x+70,166,10.3,bold=True)
        centered(b,tail,x+70,260,9.6,color)
    para(b,'<b>서버 입력 조건</b><br/>접속자의 돌 확인 · 500ms 재입력 거절<br/>질량 = 1 + 0.05 × kills<br/>속도 단위는 서버 갱신 기준',581,174,222,10.2,16)

    section(b,2,'10개 소단계에서 감속 비율 유지',290)
    for i in range(11):
        h=48*(.8**(i/10))
        rect(b,40+i*25,378-h,16,h,fill=BLUE if i<10 else ACCENT,radius=0)
    text(b,'v',38,384,10.2,BLUE,True); text(b,'0.8v',274,384,10.2,ACCENT,True)
    equation(b,'p += 0.1*v; v *= 0.8**0.1',350,331,11.5)
    para(b,'매 단계: 축 속도 |v|<0.1 → 0 / 충돌 / 득점 후 재배치.<br/>10회 뒤 상태 전송. 충돌·정지 절삭이 없으면 총 0.8배 감쇠.<br/>타이머는 1000/60ms이며 실제 경과 시간으로 보정하지 않습니다.',350,356,453,10,14.5)

    section(b,3,'겹침을 보정한 뒤 충격량 계산',416)
    circle(b,83,487,26,INK); circle(b,122,487,26,ACCENT,HexColor('#ecdcd5'))
    b.arrow([(83,487),(122,487)],ACCENT)
    text(b,'n',99,465,10,ACCENT,True)
    b.arrow([(55,487),(43,487)],MUTED); b.arrow([(151,487),(163,487)],MUTED)
    equation(b,'overlap/2',189,457,11)
    para(b,'양쪽 위치를 절반씩 보정<br/>일반 경우: 0&lt;D&lt;r1+r2',189,482,158,9.8,14.5)
    equation(b,'vn=dot(v2-v1,n); vn>0: skip impulse',379,454,10.5)
    equation(b,'j=-(1+0.7)*vn/(1/m1+1/m2)',379,480,11.5)
    equation(b,'v1-=(j/m1)*n; v2+=(j/m2)*n',379,507,11.5)
    b.end([('입력·쿨다운',ref+'server/index.ts#L139'),('질량·충돌',ref+'server/physics.ts#L26'),('마찰·정지',ref+'server/physics.ts#L79'),('갱신·배포',ref+'server/index.ts#L99')])
