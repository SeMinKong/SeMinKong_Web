"""Vector technical plates added after the existing project explanations.

Equations and pseudocode are source-derived; diagrams are explanatory, not
measurements, model predictions or new experiment results.
"""
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape

W, H = landscape(A4)
INK, MUTED, LINE, ACCENT, TINT, PAPER = map(
    HexColor, ['#171512', '#625e56', '#d4d0c5', '#a73524', '#eeeae1', '#f7f5ef'])


def box(b, x, y, w, h, accent=False):
    b.c.setFillColor(HexColor('#f1e1da') if accent else TINT)
    b.c.setStrokeColor(ACCENT if accent else LINE)
    b.c.setLineWidth(.75)
    b.c.roundRect(x, H-y-h, w, h, 5, fill=1, stroke=1)


def node(b, title, detail, x, y, w, h=58, accent=False):
    box(b, x, y, w, h, accent)
    b.para(title, x+12, y+10, w-24, 11, 15, bold=True)
    if detail:
        b.para(detail, x+12, y+33, w-24, 9.2, 14, MUTED)


def heading(b, label, x, y, w):
    b.rule(y, x, w, ACCENT, 1)
    b.para(label, x, y+10, w, 11, 16, bold=True)


def code(b, title, lines, x, y, w, size=10):
    """Explicitly labeled equivalent pseudocode, preserving readable ASCII."""
    h = 49 + 17 * len(lines)
    box(b, x, y, w, h)
    b.para(title, x+14, y+12, w-28, 10, 15, bold=True)
    for i, line in enumerate(lines):
        if line:
            b.text(line, x+14, y+38+i*17, size, 'Courier', INK)
    return y+h


def formula(b, expression, caption, x, y, w, size=13):
    b.text(expression, x, y, size, 'Courier-Bold', ACCENT)
    if caption:
        b.para(caption, x, y+25, w, 9.3, 14, MUTED)


def notes(b, left, right):
    b.rule(487)
    b.para(left, 38, 500, 370, 9.3, 14.5, MUTED, keep_words=True)
    b.para(right, 438, 500, 365, 9.3, 14.5, MUTED, keep_words=True)


def sequence(b, items, y, x=38, w=765, h=58):
    gap = 22
    col = (w-gap*(len(items)-1))/len(items)
    for i, (title, detail) in enumerate(items):
        xx = x+i*(col+gap)
        node(b, title, detail, xx, y, col, h, i == len(items)-1)
        if i:
            b.arrow([(xx-gap+3, y+h/2), (xx-4, y+h/2)])


def thing(b, ref):
    b.start('THING · 자세 변환과 모터 구동',
            '기술 도식 / 팀의 자세 변환과 본인 모터 점검 경로를 구분해 읽는 제어 과정', key='thing-mechanism')
    heading(b, '손 landmark → 정규화된 7축 목표 · 팀 구현', 38, 131, 493)
    # A schematic 21-node MediaPipe hand topology, not captured landmarks.
    pts = [(114,316),(84,294),(67,269),(51,247),(45,222),
           (96,262),(91,229),(89,198),(87,174),
           (119,257),(122,220),(124,189),(126,167),
           (140,263),(151,231),(157,204),(161,183),
           (157,280),(176,259),(189,240),(199,221)]
    edges = [(0,1),(1,2),(2,3),(3,4),(0,5),(5,6),(6,7),(7,8),
             (5,9),(9,10),(10,11),(11,12),(9,13),(13,14),(14,15),(15,16),
             (13,17),(0,17),(17,18),(18,19),(19,20)]
    b.c.setStrokeColor(MUTED)
    b.c.setLineWidth(1.3)
    for a,z in edges:
        b.c.line(pts[a][0], H-pts[a][1], pts[z][0], H-pts[z][1])
    for i,(x,y) in enumerate(pts):
        b.c.setFillColor(ACCENT if i in (4,8,12,16,20) else INK)
        b.c.circle(x,H-y,2.8,fill=1,stroke=0)
    b.para('21개 점 · 손 구조 개념도', 38, 330, 190, 9.3, 14, MUTED)
    b.arrow([(215,248),(242,248)])
    node(b, '굴곡 5축', '엄지·검지·중지·약지·소지', 252, 176, 279, 59)
    node(b, '엄지 대립 + 외전 2축', '손바닥 폭 대비 거리 / 평면 투영 각도', 252, 250, 279, 68)
    sequence(b, [('deadband', '미세 변화 억제'), ('low-pass', '변화 평활화'), ('slew limit', '프레임별 제한')], 357, x=38, w=493, h=57)
    heading(b, '모터 점검 · 본인 move 경로', 561, 131, 242)
    code(b, '호출 순서 · 의사코드', [
        'p = read_present_position()',
        'write_goal_position(p)',
        'torque_on()',
        'write_goal_position(target)',
    ], 561, 172, 242, 9.4)
    formula(b, 'p_goal = p_now', '토크를 켜기 전에 현재 위치를 초기 목표로 기록', 575, 303, 214, 12)
    node(b, '통신 응답 → 실제 기구 동작', 'U2D2 → 모터 → 스풀·텐던', 561, 377, 242, 64, True)
    b.para('goal 생성 → ROS 2 manager·guard → 운영 드라이버 → DYNAMIXEL', 38, 438, 493, 9.4, 15, MUTED)
    notes(b, '<b>설계 의도</b> 자세 입력의 흔들림과 모터 토크 인가 시 이전 목표로 움직이는 문제를 서로 다른 단계에서 다룹니다.',
          '<b>범위</b> 오른쪽은 독립 점검 도구의 이동 명령입니다. 운영 guard·전체 토크 인가 경로를 대신하지 않습니다.')
    b.end([('자세 계산·필터', ref+'thing_ws/src/thing_vision/thing_vision/hand_target_node.py#L183'),
           ('본인 move 순서', ref+'tools/dynamixel/rpi/keyboard_control_7.py#L139'),
           ('운영 드라이버', ref+'thing_ws/src/thing_hardware/src/motor_driver_node.cpp#L908')])


def aqis(b, ref):
    b.start('AQIS · 검출 좌표와 집기 시점',
            '기술 도식 / 픽셀·깊이를 장비 좌표로 바꾸는 과정과 정지 요청 이후의 좌표 선택', key='aqis-transform')
    heading(b, '좌표 변환 경로', 38, 131, 765)
    node(b, '깊이 격자 (u, v)', '영상→깊이 크기 비율로 환산', 38, 176, 201, 58)
    node(b, '카메라 좌표 (X, Y, Z)', '유효 깊이 중앙값 d + 내부 파라미터', 274, 176, 242, 58)
    node(b, 'Dobot 목표 (x, y, z)', 'affine 변환 + 높이 모드·오프셋', 552, 176, 251, 58, True)
    b.arrow([(242,205),(269,205)])
    b.arrow([(520,205),(547,205)])
    formula(b, 'X = (u-cx) d / fx', 'u,v: 깊이 격자 중심 / d: 미터 단위 깊이', 38, 258, 360)
    formula(b, 'Y = (v-cy) d / fy;  Z = d', 'fx,fy: 초점거리 / cx,cy: 주점', 38, 313, 360, 12)
    code(b, '변환식 · m → mm / 반올림 생략', [
        'x_mm = 1000*(a11*X+a12*Y+tx)+ox',
        'y_mm = 1000*(a21*X+a22*Y+ty)+oy',
        'z_m = affine_z(X,Y) if enabled else z0/1000',
        'z_mm = 1000*z_m + oz',
    ], 438, 251, 365, 10.5)
    heading(b, '공정 상태 → 다음 입력의 사용 조건', 38, 373, 765)
    sequence(b, [('불량 검출', 'RUNNING 상태'), ('정지 요청', '준비 시점까지 대기'), ('후속 검출 선택', '깊이·timestamp 조건'), ('집기 프로세스', '정상 종료 시 재개')], 414, h=59)
    notes(b, '<b>담당</b> 비전·깊이 역투영은 팀 구현, 검출 정규화·좌표 연결·집기 시퀀스·관제는 본인 구현입니다.',
          '<b>한계</b> 자동 경로의 정지 실패 차단·물리 파지 확인은 없습니다. timestamp·깊이 누락 조건은 다음 쪽에 기록했습니다.')
    b.end([('깊이·역투영', ref+'aqis_ws/src/integrate_prac/integrate_prac/realsense_yolo_node.py#L285'),
           ('좌표 변환', ref+'server/app/services/dobot_pick_place.py#L142'),
           ('정지 후 검출 선택', ref+'server/app/main.py#L212')])


def briefit(b, ref):
    b.start('Briefit · 학습과 생성 경로의 분리',
            '기술 도식 / KoBART의 입력·정답 관계와 긴 기사에 적용한 부분 요약·재요약', key='briefit-seq2seq')
    heading(b, '학습 · 기사와 기준 요약의 쌍', 38, 131, 493)
    node(b, '기사 text', 'tokenizer → input_ids', 38, 175, 211)
    node(b, '기준 summary', 'tokenizer → labels', 320, 175, 211)
    node(b, 'Encoder → Decoder', 'Seq2SeqTrainer / 정답 토큰에 맞춰 학습', 118, 272, 335, 66, True)
    b.arrow([(144,236),(144,255),(202,255),(202,267)])
    b.arrow([(425,236),(425,255),(369,255),(369,267)])
    heading(b, '학습과 생성의 입력 차이', 561, 131, 242)
    code(b, '토큰화 · 의사코드', [
        'inputs = tokenize(text)',
        'labels = tokenize(summary)',
        'train(inputs, labels)',
        '',
        'ids = model.generate(inputs)',
        'summary = decode(ids)',
    ], 561, 173, 242, 9.2)
    heading(b, '생성 · 1024 tokens 초과 경로 / 이하 입력은 한 번 생성·후처리', 38, 365, 765)
    sequence(b, [('문단 묶기', '토큰 길이 기준'), ('부분 요약·후처리', '각 묶음을 생성·정리'), ('부분 결과 합치기', '생성된 문자열 연결'), ('재요약·후처리', '합친 결과를 다시 생성·정리')], 407, h=64)
    notes(b, '<b>길이 제한</b> 문단을 더한 뒤 길이를 확인합니다. 긴 문단·재요약 입력의 truncation 가능성은 남아 있습니다.',
          '<b>평가</b> ROUGE는 후처리 전 생성문과 기준 요약을 비교합니다. 학습 완료·후처리 품질 향상의 실측 주장은 아닙니다.')
    b.end([('입력·labels', ref+'blob/714502c017f0c57ebebd634b60ea77a102945d81/Kobart/Scripts/Train.py#L25'),
           ('smart_summarize', ref+'blob/da4ea1b09cfd44724facc19233d65c07e4301f3a/Kobart/Scripts/GenerateJson.py#L45'),
           ('후처리', ref+'blob/da4ea1b09cfd44724facc19233d65c07e4301f3a/Kobart/Scripts/GenerateJson.py#L16')])


def mri(b, ref):
    b.start('Brain MRI · 마스크에서 학습 라벨로',
            '기술 도식 / 픽셀 마스크의 표현 변환과 독립적인 분류·분할 추론', key='mri-polygons')
    heading(b, '전처리 · mask_to_polygons', 38, 131, 493)
    sequence(b, [('이진화', 'mask > 1'), ('형태학 처리', '5×5 close → open'), ('외부 윤곽', '면적·점 수 필터')], 172, x=38, w=493, h=63)
    # A contour illustrates representation, not an MRI prediction or test result.
    contour = [(83,285),(137,269),(188,293),(175,339),(112,348),(72,321)]
    b.c.setFillColor(HexColor('#f1e1da'))
    b.c.setStrokeColor(ACCENT)
    path = b.c.beginPath()
    path.moveTo(contour[0][0],H-contour[0][1])
    for x,y in contour[1:]:
        path.lineTo(x,H-y)
    path.close()
    b.c.drawPath(path,fill=1,stroke=1)
    for x,y in contour:
        b.c.circle(x,H-y,2.5,fill=1,stroke=0)
    b.para('윤곽점 표현 도식', 60, 360, 155, 9.3, 14, MUTED)
    b.arrow([(207,309),(242,309)])
    formula(b, 'x_norm = x / width', '픽셀 크기에 독립적인 좌표 표현', 252, 279, 279, 11.8)
    formula(b, 'y_norm = y / height', 'class + x1 y1 x2 y2 ...', 252, 326, 279, 11.8)
    code(b, '전처리 · 의사코드', [
        'mask = binary(mask, >1)',
        'mask = close(mask, 5x5)',
        'mask = open(mask, 5x5)',
        'contours = external(mask)',
        'keep(area >= W*H*0.001)',
        'keep(vertex_count >= 3)',
        'save(class_id, xy / [W,H])',
    ], 561, 131, 242, 9.3)
    heading(b, '추론 · 같은 MRI, 별도 모델과 가중치', 38, 390, 765)
    node(b, '분류 모델', '전체 이미지 → 범주·점수', 38, 430, 211, 49)
    node(b, '분할 모델', '전체 이미지 → mask', 320, 430, 211, 49)
    node(b, '통합 시각화', '분류 문구 + 분할 overlay', 600, 430, 203, 49, True)
    b.arrow([(251,454),(281,454),(281,416),(585,416),(585,454),(596,454)])
    b.arrow([(534,454),(595,454)])
    notes(b, '<b>변환의 손실</b> 외부 윤곽과 정제 규칙은 작은 병변·내부 구멍을 지울 수 있습니다. 원본 마스크와 대조해야 합니다.',
          '<b>모델 관계</b> 분류 결과로 분할을 차단하지 않습니다. 출력 불일치의 자동 보정과 독립·임상 평가는 완료하지 않았습니다.')
    b.end([('mask_to_polygons', ref+'src/training/train.py#L25'),
           ('모델별 학습', ref+'src/training/train.py#L136'),
           ('독립 추론·시각화', ref+'src/testing/test.py#L76')])


def prompt(b, ref):
    b.start('Prompt Generator · 대화 상태 전이',
            '기술 도식 / 영역마다 보관하는 문맥과 LLM 호출 성공·완료·오류의 분기', key='prompt-state-machine')
    heading(b, '영역별 상태 · 여섯 영역에 같은 전이 적용', 38, 131, 493)
    node(b, 'pending', '다음 입력 대기', 38, 176, 137)
    node(b, 'in_progress', 'round + 1 / LLM 호출', 205, 176, 157)
    node(b, '응답 확인', '호출 성공 뒤 이력 기록', 394, 176, 137)
    b.arrow([(179,205),(200,205)])
    b.arrow([(366,205),(389,205)])
    node(b, 'completed', '결과 저장 / 추가 대화 가능', 328, 334, 203, 64, True)
    b.arrow([(462,237),(462,329)])
    b.para('round ≥ 3 + 생성 태그', 340, 273, 191, 10, 15, ACCENT, bold=True)
    b.arrow([(407,238),(407,251),(307,251),(307,238)], MUTED)
    b.para('미완료 → in_progress 유지', 300, 306, 231, 9.3, 14, MUTED)
    b.arrow([(283,238),(283,317),(106,317),(106,238)], ACCENT, dashed=True)
    b.para('처리 오류 → round - 1', 38, 333, 238, 9.6, 15, ACCENT)
    b.para('입력·응답을 이력에 추가하지 않고 대기', 38, 355, 260, 9.3, 14, MUTED)
    code(b, '완료 분기 · 의사코드', [
        'reply = run(domain_history)',
        'done = round >= 3 and',
        '  "[GENERATE_PROMPT]" in reply',
        'if done:',
        '  save(extract_prompt(reply))',
        'else:',
        '  continue_questions(reply)',
    ], 561, 131, 242, 9.3)
    heading(b, '최종 합성 · 결과가 있는 영역을 수집', 38, 409, 765)
    b.para('프로젝트 설명 + 생성 결과가 있는 영역(1개 이상)', 38, 448, 355, 10.2, 16, bold=True)
    b.arrow([(402,457),(436,457)])
    b.para('별도 LLM 호출 → Markdown 설계 문서', 449, 448, 354, 10.2, 16, bold=True)
    notes(b, '<b>문맥</b> 영역 지침 + 프로젝트 설명 + 해당 영역 이력 + 새 입력으로 메시지를 구성합니다. 첫 질문은 병렬 실행합니다.',
          '<b>경계</b> 완료는 품질 점수가 아닙니다. 세션은 연결 종료 시 삭제되며, 일부 영역 결과만으로도 문서를 합성할 수 있습니다.')
    b.end([('영역별 문맥·완료 조건', ref+'dimensions/runner.py#L14'),
           ('상태·오류 처리', ref+'server/graph_runner.py#L22'),
           ('결과 수집·합성', ref+'server/graph_runner.py#L93')])


def collision_pair(b, x, y, separated=False):
    a, z = (x+58, x+138) if separated else (x+68, x+128)
    r=40
    b.c.setLineWidth(1)
    for cx, color in [(a,INK),(z,ACCENT)]:
        b.c.setFillColor(TINT if color == INK else HexColor('#f1e1da'))
        b.c.setStrokeColor(color)
        b.c.circle(cx,H-y,r,fill=1,stroke=1)
        b.c.setFillColor(color)
        b.c.circle(cx,H-y,2.5,fill=1,stroke=0)
    if separated:
        b.arrow([(a,y-51),(a-20,y-51)], MUTED)
        b.arrow([(z,y-51),(z+20,y-51)], ACCENT)
        b.text('-delta n', a-32, y-80, 10, 'Courier', MUTED)
        b.text('+delta n', z-19, y-80, 10, 'Courier', ACCENT)
    else:
        b.arrow([(a,y),(z,y)], ACCENT)
        b.text('n', a+26, y-22, 12, 'Helvetica-Bold', ACCENT)


def alkkagi(b, ref):
    b.start('Alkkagi.io · 충돌의 위치·속도 계산',
            '기술 도식 / 겹침은 위치로 보정하고 접근 중인 충돌의 반응은 충격량으로 계산', key='alkkagi-collision')
    heading(b, '위치 보정 · n은 두 중심을 잇는 단위 벡터', 38, 131, 493)
    collision_pair(b, 47, 254)
    collision_pair(b, 303, 254, separated=True)
    b.para('겹침 발생', 63, 306, 192, 10, 15, bold=True)
    b.para('양쪽에 overlap / 2 적용', 306, 306, 225, 10, 15, bold=True)
    b.arrow([(248,254),(293,254)])
    formula(b, 'overlap = r1 + r2 - distance', '위치 보정은 질량과 무관하게 절반씩 적용', 38, 344, 493, 12.5)
    formula(b, 'j = -(1+e)*vn / (1/m1+1/m2)', 'vn: 법선 상대 속도 / e: 반발계수 / m: 질량', 38, 407, 493, 12.5)
    code(b, '겹침 발생 시 · 의사코드', [
        'p1 -= n * overlap/2',
        'p2 += n * overlap/2',
        'vn = dot(v2-v1, n)',
        'if vn > 0: continue',
        'j = -(1+e)*vn/(1/m1+1/m2)',
        'v1 -= (j/m1)*n',
        'v2 += (j/m2)*n',
    ], 561, 131, 242, 9.4)
    heading(b, '소단계 마찰 → 상태 전송', 561, 319, 242)
    formula(b, 'v *= FRICTION ** step', 'step = 1 / 10 / 한 갱신을 10회로 분할', 561, 359, 242, 10.5)
    node(b, 'gameStateUpdate', '서버 계산 후 모든 클라이언트로 전송', 561, 415, 242, 59, True)
    notes(b, '<b>분기</b> 중심 거리 D &gt; 0인 일반 경우입니다. 이미 멀어지는 돌에는 충격량을 더하지 않고 위치만 보정합니다.',
          '<b>범위</b> 벡터 그림은 개념도입니다. 60Hz는 설정이며 지속 프레임률·동시접속 성능 측정값은 없습니다.')
    b.end([('겹침·충격량', ref+'server/physics.ts#L31'),
           ('소단계 마찰', ref+'server/physics.ts#L79'),
           ('갱신·상태 배포', ref+'server/index.ts#L50')])
