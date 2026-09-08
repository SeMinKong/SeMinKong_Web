"""AQIS simulation and telemetry pages, separate from the real pick pipeline."""
from technical_pages import (section, chip, rect, line, dot, text, equation, para,
                             footer_note, connect, ACCENT, BLUE, MUTED, INK, TINT, PAPER)


def twin(b, ref):
    b.start('AQIS · RoboDK 디지털 트윈',
        'RoboDK 공정·Simulation Dashboard: 팀원 담당 / 본인: 서버·명령·이벤트 연결과 실제 장비 통합',key='aqis-twin')
    b.image('@aqis-simulation.png',38,137,432,243)
    para(b,'공개 시연 · Simulation Dashboard와 RoboDK 공장 장면',38,391,432,9.3,13,MUTED)
    section(b,'검사·집기·운반 시뮬레이션',137,x=500,w=303)
    para(b,'하드웨어 준비 전, 검사·집기·운반 순서와 웹 인터페이스를 먼저 연결했습니다.',500,174,303,10.5,15)
    conveyor=chip(b,'컨베이어','x += speed × dt / 이름·위치로 검출',500,218,303,54)
    robot=chip(b,'UR5 집기','Home → Pick → Mid → Place / MoveJ',500,295,303,54)
    connect(b,conveyor,robot,MUTED,vertical=True)
    para(b,'객체의 부모를 그리퍼에서 TurtleBot으로 바꿔 적재를 표현합니다. AGV는 nav1~nav6 프레임 사이를 보간해 이동합니다.',500,365,303,10,15)

    section(b,'명령 전달과 상태 반환',420)
    text(b,'명령 →',663,429,9.6,ACCENT); text(b,'← 상태',742,429,9.6,BLUE)
    for x,title,detail in [(38,'Simulation UI','start / pause / stop / reset'),(309,'FastAPI','명령 큐 · script_id 검사'),(580,'RoboDK script','HTTP polling · 공정 상태 반환')]:
        chip(b,title,detail,x,460,223,52)
    for left,right in [(261,309),(532,580)]:
        b.arrow([(left+6,476),(right-6,476)],ACCENT)
        b.arrow([(right-6,496),(left+6,496)],BLUE)
    footer_note(b,'공정·기구학 시뮬레이션입니다. 접촉력·파지 성공을 계산하거나 실제 Dobot 관절을 RoboDK에 동기화하지는 않습니다.',521)
    b.end([('공개 시연',ref+'docs/assets/portfolio/simulation-demo.gif'),('공정 스크립트',ref+'AQIS-sim/robodk/Main.py#L506'),('명령 큐',ref+'server/app/adapters/robodk.py#L41'),('실행 식별자',ref+'server/app/routers/simulation.py#L94'),('기여 구분',ref+'docs/07-roles-and-schedule.md')])


def telemetry(b, ref):
    b.start('AQIS · SLAM·로봇 상태 관제',
        '외부 ROS 패키지·SLAM 시연은 팀 결과 / 본인: ROS bridge·FastAPI·RealOps·Dobot 관절 뷰어',key='aqis-telemetry')
    b.image('@aqis-slam.png',38,137,432,243)
    para(b,'공개 시연 · 왼쪽 RealOps, 오른쪽 RViz 지도·실물 TurtleBot',38,391,432,9.3,13,MUTED)
    section(b,'지도와 로봇 위치 수집',137,x=500,w=303)
    para(b,'<b>/map → map_update</b><br/>OccupancyGrid → PNG·해상도·원점.<br/>지도 이벤트의 2초 이내 재발행 억제.',500,173,303,9.8,14)
    line(b,[(500,225),(803,225)])
    para(b,'<b>TF → AMCL → odom 대체 입력</b><br/>map→base_footprint/base_link를 0.1초 간격으로 조회. 수신 콜백은 최신 TF(0.8초)·AMCL(2.5초)를 우선합니다.',500,238,303,9.8,14)
    line(b,[(500,300),(803,300)])
    para(b,'<b>RealOps 화면</b><br/>카메라·위치·지도 갱신 시각을 표시하고 지도 PNG 자체는 그리지 않습니다. odom은 map 좌표로 재변환하지 않아 출처를 함께 표시합니다. Nav2 goal 자동 전송은 미구현입니다.',500,313,303,10,14.5)

    section(b,'관절값으로 URDF 자세 갱신',420)
    boxes=[chip(b,title,detail,38+i*265,460,235,52) for i,(title,detail) in enumerate([
        ('ROS JointState','관절 이름 · position (rad)'),('FastAPI / WebSocket','dobot_status → React 병합'),('URDF 관절 뷰어','부모·자식 링크 / origin / axis')])]
    for source,target in zip(boxes,boxes[1:]): connect(b,source,target)
    footer_note(b,'뷰어 각도 = position_rad × multiplier + offset (mimic). ROS_ENABLED 환경에서 실시간 상태를 반영합니다.',521)
    b.end([('SLAM 공개 시연',ref+'docs/assets/portfolio/slam-demo.gif'),('TF·상태 전달',ref+'server/app/services/ros_bridge.py#L126'),('지도·관절 변환',ref+'server/app/services/ros_converters.py#L39'),('RealOps 표시',ref+'AQIS-real/web/src/App.tsx#L430'),('URDF 관절',ref+'AQIS-real/web/src/DobotUrdfView.tsx#L305')])
