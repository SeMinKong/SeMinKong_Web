"""AQIS simulation and telemetry pages, separate from the real pick pipeline."""
from technical_pages import (section, chip, rect, line, dot, text, equation, para,
                             footer_note, ACCENT, BLUE, MUTED, INK, TINT, PAPER)


def twin(b, ref):
    b.start('AQIS · 가상 공정과 웹을 연결한 디지털 트윈',
        'RoboDK 공정·Simulation Dashboard: 팀원 담당 / 본인: 서버·명령·이벤트 연결과 실제 장비 통합',key='aqis-twin')
    b.image('@aqis-simulation.png',38,137,432,243)
    para(b,'공개 시연 · Simulation Dashboard와 RoboDK 공장 장면',38,391,432,9.3,13,MUTED)
    section(b,1,'공정 순서를 장면의 동작으로',137,x=500,w=303)
    para(b,'하드웨어 준비 전, 검사·집기·운반 순서와 웹 인터페이스를 먼저 연결했습니다.',500,174,303,10.5,15)
    chip(b,'컨베이어','x += speed × dt / 이름·위치로 검출',500,218,303,54)
    b.arrow([(651,277),(651,290)],MUTED)
    chip(b,'UR5 집기','Home → Pick → Mid → Place / MoveJ',500,295,303,54)
    para(b,'흡착·적재: 객체 부모를 그리퍼→TurtleBot으로 변경.<br/>운반: nav1~nav6 프레임 사이의 위치 보간.',500,363,303,9.5,14)

    section(b,2,'명령은 큐로 전달하고 실행 상태는 이벤트로 반환',420)
    chip(b,'Simulation UI','start / pause / stop / reset',38,457,210,52)
    chip(b,'FastAPI','명령 큐 · 실행 script_id',308,457,218,52)
    chip(b,'RoboDK script','HTTP polling → 공정 실행',586,457,217,52)
    b.arrow([(253,471),(303,471)],ACCENT)
    b.arrow([(531,471),(581,471)],ACCENT)
    b.arrow([(581,497),(531,497)],BLUE)
    b.arrow([(303,497),(253,497)],BLUE)
    text(b,'제어',265,454,9,ACCENT); text(b,'상태',265,503,9,BLUE)
    footer_note(b,'명령 소비·검출 이벤트의 script_id를 검사합니다. 공정·기구학 시뮬레이션이며 접촉력·실제 파지 성공이나 실장비 관절의 RoboDK 동기화를 검증한 결과는 아닙니다.',519)
    b.end([('공개 시연',ref+'docs/assets/portfolio/simulation-demo.gif'),('공정 스크립트',ref+'AQIS-sim/robodk/Main.py#L506'),('명령 큐',ref+'server/app/adapters/robodk.py#L41'),('실행 식별자',ref+'server/app/routers/simulation.py#L94'),('기여 구분',ref+'docs/07-roles-and-schedule.md')])


def telemetry(b, ref):
    b.start('AQIS · SLAM과 로봇 상태를 웹 관제로',
        '외부 ROS 패키지·SLAM 시연은 팀 결과 / 본인: ROS bridge·FastAPI·RealOps·Dobot 관절 뷰어',key='aqis-telemetry')
    b.image('@aqis-slam.png',38,137,432,243)
    para(b,'공개 시연 · 왼쪽 RealOps, 오른쪽 RViz 지도·실물 TurtleBot',38,391,432,9.3,13,MUTED)
    section(b,1,'위치의 출처와 지도 상태를 전달',137,x=500,w=303)
    para(b,'<b>/map → map_update</b><br/>OccupancyGrid → PNG·해상도·원점.<br/>지도 이벤트의 2초 이내 재발행 억제.',500,173,303,9.8,14)
    line(b,[(500,225),(803,225)])
    para(b,'<b>TF → AMCL → odom 대체 입력</b><br/>map→base_footprint/base_link를 0.1초 간격으로 조회. 수신 콜백은 최신 TF(0.8초)·AMCL(2.5초)를 우선합니다.',500,238,303,9.8,14)
    line(b,[(500,300),(803,300)])
    para(b,'<b>현재 RealOps 표시</b><br/>HTTP 카메라 + X·Y·yaw·source + 지도 갱신 시각. 지도 PNG 자체는 그리지 않습니다. odom을 map 좌표로 재변환하지 않아 출처를 함께 표시합니다.',500,313,303,9.8,14)

    section(b,2,'Dobot 관절값 → URDF의 링크 회전',420)
    chip(b,'ROS JointState','관절 이름 · position (rad)',38,458,202,52)
    chip(b,'FastAPI / WebSocket','dobot_status → React 병합',287,458,230,52)
    chip(b,'URDF 관절 뷰어','부모·자식 링크 / origin / axis',564,458,239,52)
    b.arrow([(245,483),(282,483)],BLUE); b.arrow([(522,483),(559,483)],BLUE)
    footer_note(b,'뷰어 각도 = position_rad × multiplier + offset (mimic). ROS_ENABLED 환경에서 상태를 반영합니다. 자체 SLAM 알고리즘·실제 Nav2 goal 자동 발행은 구현 범위에 포함하지 않습니다.',519)
    b.end([('SLAM 공개 시연',ref+'docs/assets/portfolio/slam-demo.gif'),('TF·상태 전달',ref+'server/app/services/ros_bridge.py#L126'),('지도·관절 변환',ref+'server/app/services/ros_converters.py#L39'),('RealOps 표시',ref+'AQIS-real/web/src/App.tsx#L430'),('URDF 관절',ref+'AQIS-real/web/src/DobotUrdfView.tsx#L305')])
