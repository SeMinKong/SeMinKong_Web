"""Source-backed engineering explanations added to the original 18 pages.

Each row connects a concrete problem to a calculation or runtime branch.
Code panels are condensed pseudocode, never measured results.
"""
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape

W, H = landscape(A4)
INK, MUTED, LINE, ACCENT, TINT = map(
    HexColor, ['#171512', '#625e56', '#d4d0c5', '#a73524', '#eeeae1'])


def method(b, index, title, body, label, lines, *, size=10.2):
    """Three aligned method rows; fail on overflow instead of shrinking text."""
    y = 130 + (index - 1) * 135
    b.rule(y, color=LINE)
    b.text(f'0{index}', 38, y+9, 11.5, 'Helvetica-Bold', ACCENT)
    b.para(title, 66, y+8, 737, 12, 17, bold=True)
    bottom = b.para(body, 38, y+35, 386, 10.2, 14.1, keep_words=True)
    if bottom > y+134:
        raise ValueError(f'Method {index} prose overflow: {bottom-y:.1f}pt / {title}')
    b.c.setFillColor(TINT)
    b.c.roundRect(450, H-y-133, 353, 100, 4, fill=1, stroke=0)
    b.para(label, 462, y+41, 329, 9.4, 13, MUTED, bold=True)
    if len(lines) > 5:
        raise ValueError('A method panel supports at most five code lines')
    for n, line in enumerate(lines):
        b.text(line, 462, y+61+n*14, size, 'Courier', INK)


def thing(b, ref):
    b.start('THING · 관절 기하에서 모터 제어 주기로',
            '구현 원리 / 7축 자세 계산·ROS 운영 제어는 팀 구현 · 본인 기여는 모터 점검 도구와 기구 통합', key='thing-mechanism')
    method(b, 1, '관절 사이의 각도와 손바닥 기준으로 7축 목표 계산',
           '21개 landmark에서 관절을 중심으로 두 벡터를 만들고 내적의 acos로 각도를 구합니다. '
           '굽힘량(180°-관절각)을 125°로 나눠 0~1로 제한하고 PIP·DIP(엄지 MCP·IP)를 65%·35%로 합쳐 굴곡 5축을 만듭니다. '
           '엄지 대립은 손끝-손바닥 중심 거리/손바닥 폭을 0.20~1.25로 역정규화합니다. '
           '외전은 CMC→엄지 끝·검지 MCP 방향을 손바닥 평면에 투영한 각도 10~65°로 계산해 대립 성분의 혼입을 줄입니다. '
           '입력은 영상 정규화 좌표이므로 정밀한 실제 관절각 측정값은 아닙니다.',
           '굴곡·평면 투영 / clip: 0~1, n: 손바닥 법선', [
               'a=P_before-P_joint; b=P_after-P_joint',
               'theta=acos(clamp(dot(a,b)/(|a|*|b|),-1,1))',
               'bend=clip((pi-theta)/radians(125))',
               'flex=clip(0.65*bend_near+0.35*bend_far)',
               'v_plane=v-dot(v,n)/dot(n,n)*n',
           ])
    method(b, 2, '입력 흔들림을 제한하고 모터별 엔코더 목표로 변환',
           '보정 구간을 0~1로 맞춘 첫 유효 표본을 필터 시작값으로 쓰고, 이후 deadband 0.02·저역통과 계수 0.25·프레임별 변화 상한 0.08을 적용합니다. '
           '검지 입력 q=0.5이면 home 1740~closed 4300을 보간해 최종 목표 3020 pulse를 얻습니다. '
           '엄지는 대립·외전의 네 기준 자세 중 가장 가까운 후보를 선택합니다. MIMIC은 후보가 명령 수신 3회 유지되고 '
           '거리 margin 0.1을 만족해야 바꿔 잦은 전환을 억제합니다. 자세 변경은 굴곡 여유 확보→필요한 중간 목표→대립·외전→굴곡 순서이며 '
           '위치 피드백으로 다음 단계를 결정합니다.',
           '이후 표본의 필터·네 손가락 변환 · 의사코드', [
               'q=clip((raw-min)/(max-min))',
               'if abs(q-prev)>0.02:',
               '    q=prev+clamp(0.25*(q-prev),-0.08,0.08)',
               'else: q=prev',
               'goal=round(1740+q*(4300-1740))  # index',
           ])
    method(b, 3, '추론 도착 간격과 모터 쓰기 주기를 분리해 최신 목표 추종',
           '영상·landmark는 BEST_EFFORT·KEEP_LAST(1)로 과거 프레임 누적을 억제합니다. '
           '콜백의 최신 목표를 20Hz 타이머가 새 stamp·sequence로 발행하고, 250ms 이상 유효 표본이 없으면 캐시를 폐기합니다. '
           'manager·guard는 수신 즉시 제어권·순서·300ms 노후 명령·변화율을 검사합니다. '
           '드라이버는 실제 경과 시간으로 이동량을 계산해 50Hz 쓰기에서 버스별 Sync Write, 20Hz 읽기를 수행합니다. '
           '단일 spin의 직렬 I/O가 지연될 수 있어 설정 주기가 실측 보장은 아닙니다.',
           '주기별 이동량 · dt는 초 / 실측 지터 결과 없음', [
               'dt=clamp(steady_now-last_update,0,0.25)',
               'pps=profile_velocity*0.229*4096/60',
               'step=max(1,floor(pps*speed_limit*dt))',
               'cmd+=clamp(goal-cmd,-step,step)',
               '# latest target: publish 20Hz / write 50Hz',
           ])
    b.end([('관절 기하·필터', ref+'thing_ws/src/thing_vision/thing_vision/hand_target_node.py#L183'),
           ('비전 설정', ref+'thing_ws/src/thing_bringup/config/vision.yaml#L21'),
           ('모터 변환·주기', ref+'thing_ws/src/thing_hardware/src/motor_driver_node.cpp#L542'),
           ('모터 설정', ref+'thing_ws/src/thing_bringup/config/motors.yaml#L31'),
           ('엄지 전이', ref+'thing_ws/src/thing_hardware/src/thumb_motion_controller.cpp#L198')])


def aqis(b, ref):
    b.start('AQIS · 중복 집계와 집기 좌표 갱신의 분리',
            '구현 원리 / 연속 검출을 수량으로 집계하는 조건과 정지 후 로봇에 전달할 좌표의 조건', key='aqis-transform')
    method(b, 1, '움직이는 동일 검출을 중복 집계하지 않는 시간 창',
           '연속 프레임의 검출을 모두 수량에 더하면 같은 물체가 반복 집계됩니다. '
           '서버는 최근 8초 기록 중 label·result·is_defect가 같은 후보를 비교합니다. '
           '명시적 ID 일치, IoU 0.5 이상, 중심 거리 70px 이하 중 하나라도 맞으면 중복으로 거절합니다. '
           '이때 기록의 시각·위치를 갱신해 물체가 계속 관측되는 동안 최초 시각에서 8초가 지났다고 다시 집계하지 않게 합니다. '
           '같은 불량에 양쪽 bbox·center가 모두 없어도 중복으로 봅니다. 객체 ID 추적기는 아닙니다.',
           'ID·기하정보가 있는 경우 · 실제 설정 / 의사코드', [
               'key = (label, result, is_defect)',
               'recent = records_within(now - 8.0)',
               'duplicate = same_key and (same_explicit_id',
               '    or IoU >= 0.5 or center_distance <= 70)',
               'if duplicate: refresh(time, bbox, center)',
           ])
    method(b, 2, '중복 판정보다 먼저 정지 후 좌표를 선택하는 분기',
           'RUNNING 중 첫 불량이 승인되면 컨베이어 정지를 요청하고 ready_at을 현재 시각+0.6초로 잡습니다. '
           '이후 pending 분기를 중복 판정보다 먼저 실행해 집계에서 제외될 검출도 새 집기 좌표로 사용할 수 있게 합니다. '
           '이벤트 timestamp가 준비 시점 이후이고 3초보다 오래되지 않은 불량 중 깊이가 있는 후보를 우선합니다. '
           'timestamp가 없으면 허용하고 최초 물체의 ID를 고정하지 않습니다. '
           '정지 응답 실패를 자동 차단하지 않아 실제 정지 확인까지 보장하지는 않습니다.',
           'pending 우선 경로 · stamp가 있는 경우 / 의사코드', [
               'if pending:',
               '    xs = fresh_defects(ready_at, max_age=3)',
               '    if now>=ready_at and xs:',
               '        trigger(prefer_depth(xs)); clear_pending()',
               '    return  # before dedupe',
           ])
    method(b, 3, '카메라 좌표를 장비 좌표로 연결하고 실행 결과를 분리',
           '팀 비전 노드는 검출 상자 중심을 깊이 격자로 환산하고 유효 깊이의 중앙값을 내부 파라미터로 역투영합니다. '
           '본인 집기 서비스는 카메라 X·Y(m)에 보정 계수와 평행 이동을 적용하고 1000배 및 mm 오프셋으로 장비 목표를 만듭니다. '
           'Z는 고정 높이 또는 X·Y의 별도 affine 식을 사용하며 깊이 누락 시 고정 좌표 경로가 있습니다. '
           '통신은 start/stop/status adapter, 집기는 별도 프로세스로 분리합니다. '
           '재개 설정이 켜져 있고 정상 종료 코드 0일 때 재개하며 센서로 파지 성공을 확인하는 구조는 아닙니다.',
           '깊이 역투영 → m/mm 변환 · 식 축약', [
               'X=(u-cx)*d/fx; Y=(v-cy)*d/fy; Z=d',
               'x_mm = 1000*(a11*X+a12*Y+tx) + ox',
               'y_mm = 1000*(a21*X+a22*Y+ty) + oy',
               'z_mm = 1000*affine_z(X,Y)+oz  # enabled',
               'if exit_code==0 and resume_enabled: resume()',
           ])
    b.end([('중복 창·갱신', ref+'server/app/services/detection_deduper.py#L26'),
           ('정지 후 분기', ref+'server/app/main.py#L212'),
           ('실제 설정', ref+'server/app/config.py#L46'),
           ('좌표 변환', ref+'server/app/services/dobot_pick_place.py#L142'),
           ('팀 깊이 처리', ref+'aqis_ws/src/integrate_prac/integrate_prac/realsense_yolo_node.py#L285')])


def briefit(b, ref):
    b.start('Briefit · 학습 텐서와 긴 기사 생성 경로',
            '구현 원리 / 본인 2025년 KoBART 소스 기준 · 학습·서비스 생성·평가의 입력과 출력 조건', key='briefit-seq2seq')
    method(b, 1, '기사 입력과 기준 요약을 다른 길이의 학습 텐서로 구성',
           '기사와 정답 요약은 역할과 길이가 달라 별도로 토큰화합니다. preprocess_fn은 기사 text를 384토큰, '
           'summary를 256토큰 한도로 자르고 각 max_length까지 패딩합니다. 기사 input_ids·attention_mask를 입력으로, '
           '요약 토큰 ID를 labels로 Seq2SeqTrainer에 전달합니다. 사전학습 KoBART의 인코더가 기사 문맥을 표현하고 '
           '디코더가 기준 요약에 맞춰 생성하도록 학습 경로를 구성한 것입니다. 새 모델 구조나 손실함수를 직접 구현한 것은 아니며 '
           '학습 완료 로그·실측 점수는 확인되지 않았습니다.',
           '학습 쌍 · 원본 동작을 줄인 의사코드', [
               'x = tokenize(text, max_length=384,',
               '             truncation=True, padding=max)',
               'y = tokenize(summary, max_length=256,',
               '             truncation=True, padding=max)',
               'Seq2SeqTrainer(input_ids=x, labels=y)',
           ])
    method(b, 2, '부분 요약을 중간 입력으로 만들어 긴 기사 재요약',
           '긴 기사를 한 번에 자르면 뒤 문단이 생성 입력에서 빠집니다. smart_summarize는 1024토큰 이하이면 한 번 생성하고, '
           '초과하면 문단을 누적해 부분 요약한 뒤 결과를 연결해 재요약합니다. 모든 생성은 beam 4·length_penalty 1.2를 사용합니다. '
           '부분·최종 재요약의 출력 상한은 512토큰, 단일 생성 상한은 1024입니다. '
           '다만 문단을 더한 뒤 길이를 검사하고 매 생성 입력도 1024토큰에서 잘리므로 문단 누적만으로 정보 손실을 모두 해결하지는 못합니다.',
           '긴 입력 분기 · 괄호는 출력 max_length 설정', [
               'N <= 1024: generate(1024) -> clean_tail',
               'N > 1024: paragraph_chunks(article)',
               '    each -> generate(512) -> clean_tail',
               '    join -> generate(512) -> clean_tail',
               'generate: num_beams=4, length_penalty=1.2',
           ])
    method(b, 3, '문장 끝 정리 규칙과 ROUGE가 측정하는 대상을 구분',
           '_clean_tail은 끝의 짧은 문장과 바로 앞 문장과 같은 반복을 while 조건으로 연속 제거합니다. '
           '최종 출력뿐 아니라 각 부분 요약에도 적용돼 재요약에 들어가는 입력 자체가 바뀝니다. 규칙에 맞는 정상 문장도 지워질 수 있습니다. '
           '별도 Evaluate.py는 기사 1024토큰에서 최대 128토큰을 beam 4로 직접 생성하고 디코딩 결과와 기준 summary의 ROUGE를 계산합니다. '
           '이 경로는 긴 기사 재요약·후처리를 거치지 않으므로 서비스 출력의 정보 보존을 검증한 평가로 해석할 수 없습니다.',
           '서비스 출력과 평가 대상 · 원본 경로 축약', [
               'while short_tail or repeated_previous:',
               '    remove_last_sentence()',
               'token_ids = tokenize(article).input_ids',
               'eval = generate(token_ids[:1024], max_length=128)',
               'score = ROUGE(decode(eval), reference)',
           ])
    b.end([('학습 텐서', ref+'blob/714502c017f0c57ebebd634b60ea77a102945d81/Kobart/Scripts/Train.py#L25'),
           ('긴 입력 분기', ref+'blob/da4ea1b09cfd44724facc19233d65c07e4301f3a/Kobart/Scripts/GenerateJson.py#L61'),
           ('후처리 조건', ref+'blob/da4ea1b09cfd44724facc19233d65c07e4301f3a/Kobart/Scripts/GenerateJson.py#L16'),
           ('ROUGE 경로', ref+'blob/714502c017f0c57ebebd634b60ea77a102945d81/Kobart/Scripts/Evaluate.py#L12')])


def mri(b, ref):
    b.start('Brain MRI · 픽셀 마스크를 분할 학습 라벨로',
            '구현 원리 / 경계 정제·상대 면적 필터·좌표 정규화와 분류/분할 출력 결합', key='mri-polygons')
    method(b, 1, '작은 틈과 잡음을 정제한 뒤 저장할 외부 경계 추출',
           '픽셀 마스크를 YOLO가 읽는 polygon label로 바꾸려면 저장할 객체 경계를 정해야 합니다. '
           'mask_to_polygons는 회색조 값이 1보다 큰 픽셀만 전경으로 이진화하고 5×5 커널로 closing 다음 opening을 적용합니다. '
           'RETR_EXTERNAL로 외부 윤곽을 찾고 CHAIN_APPROX_SIMPLE로 직선 구간의 중간 점을 줄입니다. '
           '작은 틈·돌출·잡음을 정리하는 방식이지만 내부 구멍은 표현되지 않습니다. '
           '고정 5×5 커널은 이미지 해상도에 따라 상대적으로 다른 크기의 영역을 정리합니다.',
           '마스크 → 윤곽 · 원본 계산 축약', [
               'B = 255 * (mask > 1)',
               'K = ones(5, 5)',
               'Q = opening(closing(B, K), K)',
               'C = findContours(Q, RETR_EXTERNAL,',
               '                 CHAIN_APPROX_SIMPLE)',
           ])
    method(b, 2, '상대 면적과 점 수로 걸러 비율 좌표의 polygon label 저장',
           '윤곽마다 점이 3개 이상이고 면적이 이미지 전체의 0.1% 이상인 경우만 남깁니다. '
           '점의 x는 너비 W, y는 높이 H로 나눠 class_id 뒤에 소수점 여섯 자리 좌표쌍을 기록합니다. '
           '클래스는 마스크 파일명의 종양 코드에서 읽고 같은 basename의 txt로 저장합니다. '
           '크기가 다른 영상의 위치를 비율로 통일하면서 작은 조각·다각형을 만들 수 없는 윤곽을 거르는 방식입니다. '
           '면적은 윤곽 면적이며 작은 실제 병변도 제거될 수 있어 원본 마스크와 대조가 필요합니다.',
           '라벨 채택 조건·표현 변환 · 의사코드', [
               'keep = len(contour) >= 3 and',
               '       contourArea(contour) >= 0.001*W*H',
               'x_norm = x / W; y_norm = y / H',
               'label = class_id x1_norm y1_norm ...',
               'write(basename + ".txt", precision=6)',
           ])
    method(b, 3, '유형과 영역을 독립 추론하고 한 이미지에 결합',
           '분류에는 클래스별 이미지 폴더, 분할에는 이미지·polygon label 쌍을 사용해 yolo11m-cls와 yolo11m-seg를 따로 학습하도록 구성했습니다. '
           '추론 함수는 같은 원본을 분류 다음 분할 모델에 각각 입력합니다. 분류 top1 범주·확률을 구하고 분할 plot 위에 문구를 그려 '
           '유형 판단과 영역 예측을 함께 비교할 수 있게 합니다. 비종양 분류도 분할을 실행하며 불일치를 자동 보정하지 않습니다. '
           'test를 val에 연결한 구성으로 독립 평가나 임상 검증이 완료됐다고 주장할 수 없습니다.',
           '통합 추론 · 순차 호출 / 의사코드', [
               'p = cls_model.predict(image).probs',
               'category, score = top1(p)',
               'seg = seg_model.predict(image)',
               'output = putText(seg.plot(),',
               '                 category, score)',
           ])
    b.end([('마스크 정제', ref+'src/training/train.py#L25'),
           ('면적·좌표·라벨', ref+'src/training/train.py#L40'),
           ('모델별 학습', ref+'src/training/train.py#L136'),
           ('통합 추론', ref+'src/testing/test.py#L117')])


def prompt(b, ref):
    b.start('Prompt Generator · 문맥 구성과 완료 판정',
            '구현 원리 / 영역별 질문 문맥을 서버에서 구성하고 호출 성공·완료·최종 합성을 따로 처리', key='prompt-state-machine')
    method(b, 1, '영역별 문맥을 매 호출에서 재구성해 대화 혼입 방지',
           'UI/UX·아키텍처·DB·API·배포·테스트 여섯 영역은 history·round·status를 각각 보관합니다. '
           '매 호출에서 영역·라운드 지침, 프로젝트 설명, 해당 영역의 이전 대화, 새 입력 순으로 LangChain 메시지를 구성합니다. '
           '공통 프로젝트 맥락은 전달하면서 다른 영역의 대화는 섞지 않는 방식입니다. '
           '첫 질문은 asyncio.gather로 병렬 시작하고 동기식 ChatUpstage(solar-pro).invoke는 to_thread로 실행해 '
           'LLM 응답을 기다리는 동안 이벤트 루프를 막지 않도록 했습니다.',
           '입력 메시지·호출 경계 / 새 사용자 입력은 있을 때만', [
               'messages = [domain_system(round),',
               '    project_description, *domain.history,',
               '    *optional_user_message]',
               'reply = await to_thread(llm.invoke, messages)',
               'initial = await gather(*domain_questions)',
           ])
    method(b, 2, '모델 응답의 형식과 서버 상태 변경 조건을 분리',
           '첫 질문도 라운드 1로 세고 호출 전에 round를 올립니다. 3라운드 이상이며 응답에 [GENERATE_PROMPT]가 있어야 완료로 인정하고 '
           '첫 태그 뒤 문자열을 generated_prompt로 저장합니다. 입력·응답은 호출 성공 뒤에만 이력에 추가합니다. '
           'RuntimeError·ValueError·OSError가 나면 round를 되돌리고 pending으로 복귀해 실패한 입력을 성공 이력에 섞지 않습니다. '
           '미완료 성공은 in_progress를 유지하고 자동 재시도는 없습니다. 완료 태그는 문서의 품질 점수가 아닙니다.',
           '성공·완료·처리 오류 · 의사코드', [
               'round += 1; status = "in_progress"',
               'on_success: append_turn(user_if_present,reply)',
               'done = round >= 3 and',
               '       "[GENERATE_PROMPT]" in reply',
               'on_handled_error: round -= 1; pending()',
           ])
    method(b, 3, '저장된 영역 결과를 수집해 별도 모델 호출로 최종 합성',
           '최종 문서는 질문 이력을 단순 연결하지 않습니다. 비어 있지 않은 generated_prompt를 영역명 아래 모아 프로젝트 설명과 함께 '
           '별도 LLM 호출에 전달하고, 영역별 결정과 연결 관계를 담은 한국어 Markdown을 요청합니다. '
           '저장 결과가 1개 이상이면 합성할 수 있고 완료 후 수정 대화도 허용합니다. 수정 중 실패해도 이전 generated_prompt는 남으므로 '
           '최종 수집 기준은 현재 status가 아니라 결과 존재 여부입니다. 세션은 연결 종료 시 삭제되며 문서 정합성을 자동 평가하는 단계는 없습니다.',
           '결과 수집·합성 · 의사코드', [
               'sections = [(d.name, d.generated_prompt)',
               '    for d in dimensions if d.generated_prompt]',
               'if sections:',
               '    final = synthesize(project, sections)',
               '# existing result can survive a failed edit',
           ])
    b.end([('영역별 메시지', ref+'dimensions/runner.py#L29'),
           ('상태·실패 복원', ref+'server/graph_runner.py#L40'),
           ('최종 합성', ref+'server/graph_runner.py#L93'),
           ('병렬 초기 질문', ref+'server/app.py#L121')])


def alkkagi(b, ref):
    b.start('Alkkagi.io · 입력 제한과 충돌 계산의 실행 순서',
            '구현 원리 / 서버가 입력을 속도로 변환하고 10개 소단계의 위치·마찰·충돌 계산 후 상태 전송', key='alkkagi-collision')
    method(b, 1, '입력 벡터를 제한하고 질량으로 나눠 서버 속도 생성',
           '클라이언트 flick를 곧바로 돌의 속도로 사용하지 않습니다. 접속자의 돌을 찾고 500ms 이내 재입력을 거절한 뒤 '
           '벡터 크기를 보드 폭의 45%로 제한하고 질량으로 나눕니다. 질량은 1+0.05×킬 수입니다. '
           '보드 600·입력 (300,400)·질량 1.5를 대입하면 크기 500을 270으로 줄인 (162,216)에서 최종 속도 (108,144)를 얻습니다. '
           '이는 소스 식의 계산 예시이며 실험값은 아닙니다. 속도는 실제 초 단위가 아니라 서버 갱신 단계에서 사용하는 값입니다.',
           '입력 크기 상한·질량 반영 · 원본 식 축약', [
               'cap = 0.45 * boardSize; q = length(input)',
               'limited = input * min(1, cap/q)  # q > 0',
               'mass = 1 + 0.05 * kills',
               'v = limited / mass',
               '(300,400) -> (162,216) -> (108,144)',
           ])
    method(b, 2, '10개 소단계에서 전체 감쇠량을 유지하며 충돌 검사',
           '서버 갱신 한 번을 10회로 나누고 매 단계에서 p+=0.1v, v*=0.8의 0.1제곱을 적용한 다음 충돌을 검사합니다. '
           '각 소단계에 0.8을 그대로 곱하면 전체 감쇠가 0.8의 10제곱이 되므로 지수에 단계 비율을 넣습니다. '
           '충돌·정지 절삭이 없으면 10회 후 속도는 시작의 0.8배입니다. 각 축 속도의 절댓값이 0.1 미만이면 0으로 만들어 잔류 이동을 끊습니다. '
           '10회가 끝난 뒤 전체 상태를 gameStateUpdate로 전송합니다. 1000/60ms는 타이머 설정이며 실측 유지 프레임률은 아닙니다.',
           '한 서버 갱신의 순서 · 의사코드 / dt 보정 없음', [
               'repeat 10:',
               '    p += 0.1*v; v *= 0.8**0.1',
               '    zero_small_components(threshold=0.1)',
               '    collide(); score_and_respawn_outside()',
               'broadcast("gameStateUpdate", gameState)',
           ])
    method(b, 3, '겹침은 위치로, 접근 중인 충돌 반응은 충격량으로 보정',
           '중심 거리 D가 두 반지름 합보다 작으면 겹침의 절반을 양쪽 위치에 반영합니다. '
           '법선 n은 두 중심을 잇는 단위 벡터이고 vn=(v2-v1)·n은 법선 상대 속도입니다. '
           'vn이 양수이면 이미 멀어지는 중이므로 위치만 보정하고 충격량은 생략합니다. 접근 중에는 반발계수 0.7과 역질량 합으로 j를 구해 '
           '각 속도에 질량별로 반영합니다. 같은 겹침 보정량을 적용해도 속도 변화는 질량에 따라 달라집니다. '
           '오른쪽 식은 0&lt;D&lt;r1+r2인 일반 충돌의 계산입니다.',
           '일반 충돌의 위치·속도 계산 · 원본 식 축약', [
               'n=(p2-p1)/D; overlap=r1+r2-D',
               'p1-=n*overlap/2; p2+=n*overlap/2',
               'vn=dot(v2-v1,n); if vn > 0: continue',
               'j=-(1+0.7)*vn/(1/m1+1/m2)',
               'v1-=(j/m1)*n; v2+=(j/m2)*n',
           ])
    b.end([('입력·쿨다운', ref+'server/index.ts#L139'),
           ('질량·충돌', ref+'server/physics.ts#L26'),
           ('마찰·정지', ref+'server/physics.ts#L79'),
           ('10회 갱신·배포', ref+'server/index.ts#L99')])
