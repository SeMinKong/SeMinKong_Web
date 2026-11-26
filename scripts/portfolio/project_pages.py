"""Project summaries link to the retained engineering detail in each repository.

Describe code-supported decisions, personal ownership and validation limits;
do not infer historical incidents or measured improvements from current code.
"""
import json
from pathlib import Path

from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph

import visual_components as vc

W, H = landscape(A4)
M, CW = 40, W - 80
# Exact Golden Ratio split (Minor 278 : Major 449.89 = 1 : 1.6183, gutter 34pt)
LEFT_WIDTH = 278
RIGHT_X = M + LEFT_WIDTH + 34
RIGHT_WIDTH = W - M - RIGHT_X
BODY_SIZE, BODY_LEADING = 10.0, 15.0
CONTENT_TOP, CONTENT_BOTTOM = 128, 520
MUTED, LINE, ACCENT, TINT = map(HexColor, ['#625e56', '#d4d0c5', '#a73524', '#eeeae1'])

PROJECTS = [
 {'key': 'tac-touch',
  'name': 'Tac-Touch',
  'tagline': '기업 택로봇과 함께한 반도체 촉각센서 데이터 연동 기반 실시간 미끄러짐 감지, 초고속 파지력 제어 및 멀티모달 센서 모니터링 GUI 개발',
  'period': '2026.10 - 11',
  'role': '센서 수집 펌웨어 · 보드–PC 검증 · MCP 연동',
  'team': '6인 팀',
  'stack': '촉각 센서 · MCU 펌웨어 · Nova 2 · AG-160-95 · MCP',
  'figure': ('tac-touch/dashboard.webp', (0, 0, 1, 1)),
  'caption': 'Nova 2 · AG-160-95 그리퍼 촉각 신호와 3D 진단 화면',
  'award_label': 'SSAFY 자율프로젝트 1등',
  'awards': [],
  'case': 'work/tac-touch/',
  'schematic': {
      'short_summary': 'Nova 2 로봇팔과 AG-160-95 그리퍼 양쪽 손끝의 촉각 신호를 수집해, 3D 모델과 실시간 진단하는 PC 앱입니다.',
      'short_reflection': '하드웨어 연동의 핵심은 단순 수집이 아니라 ‘신뢰 가능한 정상 신호를 끝까지 격리·보장하는 프로토콜 설계’임을 체감했습니다. MCU 펌웨어부터 PC 수신, MCP 3D 기구 편집까지 단계별 무결성 검증 기준을 세웠습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('cpu', False, 'MCU 펌웨어', '상태·정상값 분리'),
                  ('arrow-left-right', True, '보드–PC 대조', '동시점 채널 격리'),
                  ('sliders-horizontal', False, 'MCP 서버 연동', '지정 축 각도 제어'),
                  ('monitor', False, '3D 진단 앱', '오프셋·로드 검증'),
              ], 19.0, 12.0),
              ('checks', [
                  ('cpu', '펌웨어 채널 격리', '채널별 읽기 상태 플래그와 직전 정상값을 분리 저장하고, 재시도·채널 통계로 복구 직후의 신규 측정만 갱신'),
                  ('terminal', 'MCP 3D 기구 편집', 'PC 앱의 선택 기구(Nova 2 · AG-160-95) 정보를 MCP로 읽어 지정 축 각도만 수정한 별도 파일을 생성·3D 반영'),
              ], 108.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '기술적 원인', '해결 설계 · 검증'), [
                  ('circle-x', '#a73524', '정지(0) vs 무응답', '통신 끊김도 0 출력돼<br/>현장 상태 오판 발생', '읽기 상태·정상값 분리 저장 및 재시도 통계로 <b>유효 0값만 갱신</b>'),
                  ('arrow-left-right', '#171512', '보드–PC 채널 혼입', '제외 채널이 PC 수신<br/>파이프라인에 유입', '실물 보드 로그와 PC 수신값을 동시점 대조해 <b>실패 채널 격리</b>'),
                  ('file-check', '#171512', 'MCP 편집 무결성', '각도 수정 시 거리 변형<br/>및 저장·로드 오류 혼재', '저장 직후 재파싱으로 <b>장착 거리 보존 검증</b> · 저장/로드 응답 분리'),
              ], [116.0, 112.0, RIGHT_WIDTH - 228.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          'MCU 펌웨어', '보드–PC 대조', 'MCP 서버 연동', '3D 진단 앱',
          'Nova 2', 'AG-160-95', '유효 0값만 갱신', '실패 채널 격리', '장착 거리 보존 검증', '저장/로드 응답 분리',
      ],
  }},
 {'key': 'bondi',
  'name': 'Bondi',
  'tagline': 'AI 복원 유물을 직접 만지며 비교하는 VR 박물관',
  'period': '2026.08 - 09',
  'role': '3D 점군 복원 · VR 전시장 · OpenXR 손 추적',
  'team': '7인 팀',
  'stack': 'TRELLIS · AdaPoinTr · Blender · Unreal Engine · OpenXR',
  'figure': ('bondi/exhibit.webp', (0, 0, 1, 1)),
  'caption': '본디 VR 전시의 OpenXR 손 조작 안내와 빗살무늬토기 좌대',
  'award_label': 'SSAFY 특화프로젝트 2등',
  'awards': [],
  'case': 'work/bondi/',
  'schematic': {
      'short_summary': '파손된 빗살무늬토기·굽다리바리를 3D 점군 모델로 복원하고, 관람자가 손으로 집어 원본과 전후 비교하는 VR 전시입니다.',
      'short_reflection': '단일 2D 이미지의 비가시 영역까지 3D 점군으로 보완하며, 원본 점군과 AI 복원 영역을 중첩 검증하고 전시 패널에 복원 근거를 시각화해 학술 전시 신뢰도와 몰입감을 함께 확보했습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('image', False, '단일 2D 사진', '파손 유물 입력'),
                  ('box', False, 'TRELLIS', '초기 3D 메시 생성'),
                  ('sparkles', True, 'AdaPoinTr', '정규화 · 결손 복원'),
                  ('boxes', False, 'Unreal · OpenXR', '핸드 트래킹 전시'),
              ], 19.0, 12.0),
              ('checks', [
                  ('sparkles', '3D 점군 복원 흐름', '단일 토기 사진에서 TRELLIS로 3D 메시를 추출하고, 부분 점군의 중심·스케일 정규화 후 AdaPoinTr로 결손부 복원'),
                  ('hand', 'OpenXR 손 조작', 'Blender로 메인 홀·전시실을 구축해 Unreal에 배치하고, 검지 좌대 전환·엄지/검지 파지·회전·자동 원위치 복귀 구현'),
              ], 108.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '기술적 원인', '해결 설계 · 성과'), [
                  ('rotate-cw', '#171512', '전후 비교 축 이탈', '손상·복원 3D 메시 간<br/>좌표축·배율 불일치', '좌대 전환 시 <b>회전·스케일 변환 동시 보정</b>으로 동일 좌표계 정합'),
                  ('move', '#a73524', '보행 후 포털 이탈', '실보행으로 누적된 HMD<br/>위치·시선 오프셋 미반영', '암전 시 HMD 기준 재보정 · Quest 2 실측 <b>전시실 369→13cm · 홀 162→15cm</b>'),
                  ('eye', '#171512', '비가시 면 검증', '단일 사진의 뒷면·내부<br/>복원 범위 식별 필요', '원본 점군과 예측 형상 <b>중첩 검증</b> 및 전시 패널 복원 근거 표기'),
              ], [116.0, 114.0, RIGHT_WIDTH - 230.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          'TRELLIS', 'AdaPoinTr', 'Unreal · OpenXR', '3D 점군 복원 흐름', 'OpenXR 손 조작',
          '회전·스케일 변환 동시 보정', 'Quest 2', '전시실 369→13cm · 홀 162→15cm', '중첩 검증',
      ],
  }},
 {'key': 'thing',
  'name': 'THING',
  'tagline': '사람 손동작을 실시간 모방하는 7축 텐던 로봇 핸드',
  'period': '2026.07 - 08',
  'role': '모터 점검 · 기구 통합',
  'team': '6인 팀',
  'stack': 'DYNAMIXEL · U2D2 · Python<br/>ROS 2 · Raspberry Pi 5',
  'figure': ('@thing-video-can-0010.jpg', (0.08, 0.25, 0.95, 0.94)),
  'caption': '캔 파지 · 7축 텐던 시연',
  'awards': [0],
  'case': 'work/thing/',
  'schematic': {
      'short_summary': 'Jetson 비전이 추출한 21개 손 랜드마크를 7축 HandCommand로 변환해, Raspberry Pi 5와 DYNAMIXEL XL330 7개로 실시간 모방·파지하는 텐던 로봇 손입니다.',
      'short_reflection': '기구 설계·모터 튜닝·DDS 통신을 하나의 제어 루프로 통합하며, 장력 손실과 통신 주기처럼 코드만으로 풀 수 없는 물리적 제약 해결 역량을 체득했습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('hand', False, '관절 기구', 'Blender · 3D 프린팅'),
                  ('network', False, 'ROS 2 브릿지', '7축 명령 · Cyclone DDS'),
                  ('cable', True, 'U2D2 동기 제어', 'XL330 7축 · 점검 도구'),
                  ('cog', False, '텐던 핸드 구동', '원통·유연 물체 파지'),
              ], 19.0, 12.0),
              ('checks', [
                  ('box', '관절·텐던 기구', 'Blender로 인체 관절 가동 범위를 반영한 손 기구를 설계·3D 프린팅하고, 아크릴 마운트·스풀 기반 텐던 구동계를 통합'),
                  ('cpu', '7축 동기·브릿지', '엄지 3축·네 손가락 4축 명령을 U2D2·DYNAMIXEL XL330 7축 동기 구동으로 연결하고 키보드 단위 점검 도구 구현'),
              ], 108.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '기술적 원인', '해결 설계 · 적용'), [
                  ('sliders-horizontal', '#171512', '관절별 부하 편차', '과전류·가동 한계 등<br/>축별 기구 부하 차이', 'DYNAMIXEL SDK <b>전류 제한·토크·회전 범위·모드</b> 교차 튜닝'),
                  ('git-branch', '#a73524', '굽힘 후 복귀 지연', '당김 위주 텐던 경로로<br/>원위치 복원력 부족', '관절 힘 작용점 재계산 · 스풀 경로 재배치로 <b>장력 복귀 구조</b> 구현'),
                  ('radio', '#171512', '7축 제어 주기 지연', '다축 명령 전달 시<br/>기본 DDS 전송 지연', 'ROS 2 통신 설정 최적화 및 <b>Cyclone DDS</b> 적용으로 실시간 응답 확보'),
              ], [116.0, 112.0, RIGHT_WIDTH - 228.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          '관절 기구', 'ROS 2 브릿지', 'U2D2 동기 제어', '텐던 핸드 구동',
          'HandCommand', 'XL330', '전류 제한·토크·회전 범위·모드', '장력 복귀 구조', 'Cyclone DDS',
      ],
  }},
 {'key': 'aqis',
  'name': 'AQIS for Smart Factory',
  'tagline': '비전 검사·로봇 분류·자율주행 통합 스마트 팩토리',
  'period': '2026.05 - 06',
  'role': '팀장 · 서버 · 로봇 통합',
  'team': '2인 팀',
  'stack': 'ROS 2 · FastAPI · React<br/>RealSense · YOLOv5 · Dobot',
  'figure': ('@aqis-video-inspection-0010.jpg', (0, 0, 1, 1)),
  'caption': 'RealOps · Dobot 3D URDF 관절 자세 및 장비 관제',
  'awards': [],
  'repo': 'https://github.com/SSAFY-15th-HK/AQIS-for-SmartFactory/',
  'detail': 'docs/engineering-notes.md',
  'case': 'work/aqis/',
  'schematic': {
      'short_summary': 'RealSense RGB·Depth 비전 검사와 컨베이어 정지, Dobot 흡착 분류, TurtleBot3 SLAM 자율주행, 실시간 URDF 웹 관제를 단일 ROS 2 공정으로 통합했습니다.',
      'short_reflection': '이기종 로봇·비전·웹 관제가 맞물리는 공정에서는 개별 모델 정확도보다 스레드 격리, 타임스탬프 기반 좌표 정합, 스트림 분리 설계가 전체 신뢰도를 결정함을 체득했습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('camera', False, 'RealSense · YOLO', '뚜껑 1,000장 (7:3)'),
                  ('crosshair', True, '정지·좌표 재선택', 'timestamp · Depth 보정'),
                  ('bot', False, 'Dobot · TB3', '흡착 분류 · SLAM 주행'),
                  ('monitor', False, 'FastAPI · URDF', 'MJPEG · 관절 3D 관제'),
              ], 19.0, 12.0),
              ('checks', [
                  ('database', '비전·ROS 2 통합', '팀장으로 뚜껑 1,000장(7:3) YOLOv5 학습 및 Dobot·RealSense·TB3(SLAM)·컨베이어 제어와 FastAPI·ROS 2 브릿지 구축'),
                  ('monitor', 'URDF 3D 관제·TF', '/dobot_joint_states(rad)를 asyncio 루프에 안전 브릿지해 mimic 관절 포함 URDF 자세를 갱신하고, TF 우선 위치 폴백 구현'),
              ], 108.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '기술적 원인', '해결 설계 · 성과'), [
                  ('gauge', '#a73524', '관제 영상 병목', 'WebSocket에 영상·상태<br/>혼재 시 수신 주기 붕괴', '별도 포트 MJPEG 서버 분리 · <b>4→30 FPS</b> 달성 (추론 1초 주기 격리)'),
                  ('crosshair', '#171512', '이동 물체 집기 오차', '검출·집기 시점 차 및<br/>깊이 결측 시 좌표 이탈', '컨베이어 <b>stop() 후 timestamp 최신 프레임</b> 재선택 · 결측 폴백 적용'),
                  ('layers', '#171512', '가상·실물 세션 혼입', '시뮬·실장비 결합 과다 및<br/>이전 실행 이벤트 유입', '실행 환경 분리 · REST 명령 큐와 <b>script_id 태깅</b>으로 공정 무결성 격리'),
              ], [116.0, 114.0, RIGHT_WIDTH - 230.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          'RealSense · YOLO', '정지·좌표 재선택', 'Dobot · TB3', 'FastAPI · URDF',
          '1,000장', '/dobot_joint_states', '4→30 FPS', 'timestamp 최신 프레임', 'script_id 태깅',
      ],
  }},
 {'key': 'briefit',
  'name': 'Briefit',
  'tagline': '이슈별 뉴스 클러스터링·핵심 요약 서비스',
  'period': '2025.05 - 09',
  'role': '기사 수집 · KoBART 파이프라인',
  'team': '6인 팀 · AI 2인',
  'stack': 'Python · Crawl4AI<br/>BeautifulSoup · KoBART',
  'figure': ('briefit/cover.webp', (0, 0, 1, 1)),
  'caption': 'Briefit 이슈별 뉴스 목록 및 요약 서비스 화면',
  'awards': [1, 2, 3],
  'repo': 'https://github.com/capstone-btd/Briefit_AI/',
  'detail': 'docs/2025-kobart-implementation.md',
  'case': 'work/briefit/',
  'schematic': {
      'short_summary': '언론사 기사를 이슈별로 묶어 요약하는 서비스에서, 중복 차단 크롤러부터 KoBART 파인튜닝, 장문 2단계 요약과 하이브리드 파이프라인을 구축했습니다.',
      'short_reflection': 'ROUGE 정량 지표와 실사용 체감 품질의 간극을 확인하고, 토큰 분할·후처리·API 하이브리드로 서비스 완성도를 끝까지 책임지는 기준을 세웠습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('globe', False, 'Crawl4AI', '4,000건 · Set 중복차단'),
                  ('funnel', False, 'Seq2Seq 정제', '384/256토큰 · 3,000건'),
                  ('sparkles', True, 'KoBART · T5', '파인튜닝 · ROUGE 비교'),
                  ('file-text', False, '2단계·하이브리드', '분할 요약 · Gemini 연동'),
              ], 19.0, 12.0),
              ('checks', [
                  ('funnel', '중복 차단 크롤러', 'Crawl4AI로 약 4,000건 수집 시 기사/댓글 URL 필터·script/style 제거 및 저장 성공 URL 전역 Set 공유로 배치 중복 차단'),
                  ('chart-column', 'Seq2Seq 학습·평가', '정제 약 3,000건을 Encoder 384·Decoder 256토큰 학습 쌍으로 KoBART 파인튜닝하고 T5와 <b>ROUGE-1 · ROUGE-2</b> 정량 비교'),
              ], 108.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '기술적 원인', '해결 설계 · 적용'), [
                  ('scissors', '#171512', '1,024토큰 장문 초과', '단일 추론 입력 한계로<br/>긴 기사 핵심 문맥 누락', '문단 묶음 <b>2단계 분할→재요약</b> 설계 (beam=4 · length_penalty=1.2)'),
                  ('check', '#171512', '생성 말미 노이즈', '요약 끝 반복 문장 및<br/>비정상 초단문 혼입', '<b>_clean_tail 후처리</b>로 반복·단문 제거와 정상 단문 보존 기준 균형화'),
                  ('sparkles', '#a73524', '실서비스 품질 확보', 'ROUGE 수치와 실제<br/>체감 품질 간 간극 발생', '자체 학습 모델 분석 기반 <b>Gemini API 하이브리드</b> 연동으로 품질 고도화'),
              ], [116.0, 114.0, RIGHT_WIDTH - 230.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          'Crawl4AI', 'Seq2Seq 정제', 'KoBART · T5', '2단계·하이브리드',
          '4,000건', '3,000건', 'ROUGE-1 · ROUGE-2', '2단계 분할→재요약', '_clean_tail 후처리', 'Gemini API 하이브리드',
      ],
  }},
 {'key': 'mri',
  'name': 'Brain Tumor MRI',
  'tagline': '뇌 MRI 종양 분류·영역 분할 통합 추론 데모',
  'period': '2026.02 - 04',
  'role': '전처리 · 듀얼 모델 학습 · 통합 추론 · 웹 데모',
  'team': '개인 프로젝트',
  'stack': 'Python · PyTorch<br/>Ultralytics YOLO11 · OpenCV',
  'figure': ('@mri-video-overlay-007733.png',
             (0.3606060606060606, 0.18895348837209303, 0.921969696969697, 0.7897286821705426)),
  'caption': '분류·분할 통합 추론 오버레이',
  'awards': [],
  'repo': 'https://github.com/SeMinKong/BrainMRISegmentation_YOLO/',
  'detail': 'DETAILS.md',
  'case': 'work/brain-tumor-mri/',
  'schematic': {
      'short_summary': '단일 뇌 MRI에서 4-class 종양 유형 분류(yolo11m-cls)와 영역 분할(yolo11m-seg)을 병렬 실행해 신뢰도와 병변 위치를 동시에 검증하는 웹 데모입니다.',
      'short_reflection': '의료 영상 AI에서는 모델 구조 못지않게 모폴로지·면적 임계값 등 라벨 전처리 설계와 듀얼 모델 교차 검증이 위음성(FN) 리스크를 낮추는 핵심 기준임을 체득했습니다.',
      'sections': [
          ('직접 맡은 구현', [
              ('flow', [
                  ('image', False, 'MRI · 마스크', '4-class · 픽셀 정답'),
                  ('scan-search', False, '폴리곤 변환', '5×5 모폴로지 · 윤곽'),
                  ('cpu', True, 'YOLO11 듀얼', 'cls · seg 독립 학습'),
                  ('eye', False, '병렬 교차 검증', '신뢰도·마스크 오버레이'),
              ], 19.0, 12.0),
              ('checks', [
                  ('layers', '듀얼 모델 구축', '신경교종·수막종·뇌하수체·비종양 4종 yolo11m-cls와 종양 분할 yolo11m-seg의 학습·가중치 저장 파이프라인 분리 설계'),
                  ('scan-search', '라벨 변환·추론', 'mask_to_polygons 자동 정규화(x/W·y/H)를 구축하고, 분할 plot() 마스크 위에 Top-1 클래스·신뢰도를 OpenCV로 오버레이'),
              ], 108.0),
          ]),
          ('트러블슈팅', [
              ('table', ('문제 상황', '기술적 원인', '해결 설계 · 검증'), [
                  ('sliders-horizontal', '#a73524', '윤곽 노이즈·소실', '미세 틈·돌기 노이즈와<br/>소형 병변 유실 간 충돌', 'mask &gt; 1 이진화 · <b>5×5 closing→opening</b> · RETR_EXTERNAL · 점 3개·면적 <b>0.1%</b> 필터 교정'),
                  ('split', '#171512', '위음성(FN) 불일치', '독립 추론 간 비종양<br/>오판 및 영역 괴리 위험', '비종양 판정 시에도 <b>분할 모델 병렬 유지</b> · Top-1 신뢰도와 분할 마스크 동시 표시'),
              ], [116.0, 114.0, RIGHT_WIDTH - 230.0]),
          ]),
      ],
      'required_facts': [
          '직접 맡은 구현', '트러블슈팅', '회고',
          'MRI · 마스크', '폴리곤 변환', 'YOLO11 듀얼', '병렬 교차 검증',
          'yolo11m-cls', 'yolo11m-seg', 'mask_to_polygons', '5×5 closing→opening', '0.1%', '분할 모델 병렬 유지',
      ],
  }}]

EXPERIENCES = json.loads(Path(__file__).with_name('project_experiences.json').read_text(encoding='utf-8'))
for project in PROJECTS:
    experience = EXPERIENCES['projects'][project['key']]
    project.update(experience['presentation'])
    project.update({field: experience[field] for field in ('built', 'troubleshooting', 'reflection')})


def text_height(text, width, size, leading, bold=False):
    """Measure the same word-preserving paragraphs that Book.para renders."""
    style = ParagraphStyle('measure', fontName='KoreanBold' if bold else 'Korean',
                           fontSize=size, leading=leading, splitLongWords=False)
    return Paragraph(text, style).wrap(width, H)[1]


def source_links(spec, web):
    if 'repo' not in spec:
        return [('공개 프로젝트 사례', web + spec['case'])]
    return [('README', spec['repo'] + 'blob/main/README.md'),
            ('기술 문서', spec['repo'] + 'blob/main/' + spec['detail']),
            ('프로젝트 시연', web + spec['case'])]


def project_page(b, spec, web, awards):
    b.start(spec['name'], key=spec['key'])
    metadata = f"{spec['period']} · {spec['team']} <font color='#d4d0c5'>|</font> <b>역할</b> {spec['role']}"
    b.para(metadata, M, 90, CW, 10, 15, MUTED, keep_words=True)
    b.rule(113)

    if 'schematic' in spec:
        schematic_project_body(b, spec)
        footer(b, spec, web, awards)
        return

    # The image adapts to the full approved copy, never the other way around.
    # Keep the source pixels and the previously approved display region intact.
    reflection_height = text_height(spec['reflection'], LEFT_WIDTH, 10, 15)
    summary_height = text_height(spec['summary'], LEFT_WIDTH, 10.5, 16)
    tagline_height = text_height(spec['tagline'], LEFT_WIDTH, 12.3, 18, bold=True)
    image_height = min(194, CONTENT_BOTTOM - CONTENT_TOP - reflection_height
                       - summary_height - tagline_height - 15 - 18 - 64)
    if image_height < 130:
        raise ValueError(f"{spec['key']}: full left-column copy leaves insufficient image space")
    figure, region = spec['figure']
    top = b.image(figure, M, CONTENT_TOP, LEFT_WIDTH, image_height,
                  region=region, caption=spec['caption'],
                  caption_size=9.8, caption_leading=15, caption_gap=10)
    top = b.para(spec['tagline'], M, top + 14, LEFT_WIDTH, 12.3, 18,
                 bold=True, keep_words=True)
    top = b.para(spec['summary'], M, top + 6, LEFT_WIDTH, 10.5, 16,
                 MUTED, keep_words=True)
    b.rule(top + 12, M, LEFT_WIDTH)
    top = b.para('회고', M, top + 24, LEFT_WIDTH, 12.3, 18, bold=True)
    left_end = b.para(spec['reflection'], M, top + 10, LEFT_WIDTH,
                      10, 15, MUTED, keep_words=True)
    if left_end > CONTENT_BOTTOM + .1:
        raise ValueError(f"{spec['key']}: left column exceeds available space ({left_end})")

    b.para('직접 맡은 구현', RIGHT_X, CONTENT_TOP, RIGHT_WIDTH, 12.3, 18, bold=True)
    top = CONTENT_TOP + 28
    for item in spec['built']:
        b.para('·', RIGHT_X, top, 8, BODY_SIZE, BODY_LEADING, color=ACCENT)
        top = b.para(item, RIGHT_X + 12, top, RIGHT_WIDTH - 12,
                     BODY_SIZE, BODY_LEADING, keep_words=True) + 6
    b.rule(top + 6, RIGHT_X, RIGHT_WIDTH)
    top = b.para('트러블슈팅', RIGHT_X, top + 17, RIGHT_WIDTH, 12.3, 18, bold=True) + 10
    for title, body in spec['troubleshooting']:
        top = b.para(f'<b>{title}</b> · {body}', RIGHT_X, top, RIGHT_WIDTH,
                     BODY_SIZE, BODY_LEADING, keep_words=True) + 8
    if top - 8 > CONTENT_BOTTOM:
        raise ValueError(f"{spec['key']}: right column exceeds available space ({top - 8})")
    footer(b, spec, web, awards)


def schematic_project_body(b, spec):
    """Pictogram-led project page on the golden grid (Minor 278 : Major 450) with exact section titles."""
    sc = spec['schematic']
    summary_text = sc['short_summary']
    reflection_text = sc['short_reflection']

    # Left minor column (38.2%): source figure, L2 tagline (12.4pt), L1 copy (10.0pt)
    reflection_height = text_height(reflection_text, LEFT_WIDTH, 10.0, 15.0)
    summary_height = text_height(summary_text, LEFT_WIDTH, 10.0, 15.0)
    tagline_height = text_height(spec['tagline'], LEFT_WIDTH, 12.4, 17.5, bold=True)
    image_height = min(194, CONTENT_BOTTOM - CONTENT_TOP - reflection_height
                       - summary_height - tagline_height - 15 - 18 - 64)
    if image_height < 130:
        raise ValueError(f"{spec['key']}: left-column copy leaves insufficient image space")
    figure, region = spec['figure']
    top = b.image(figure, M, CONTENT_TOP, LEFT_WIDTH, image_height,
                  region=region, caption=spec['caption'],
                  caption_size=9.2, caption_leading=13.5, caption_gap=10)
    top = b.para(spec['tagline'], M, top + 14, LEFT_WIDTH, 12.4, 17.5,
                 bold=True, keep_words=True)
    top = b.para(summary_text, M, top + 6, LEFT_WIDTH, 10.0, 15.0,
                 MUTED, keep_words=True)
    b.rule(top + 14, M, LEFT_WIDTH)
    top = b.para('회고', M, top + 26, LEFT_WIDTH, 12.4, 17.5, bold=True)
    left_end = b.para(reflection_text, M, top + 8, LEFT_WIDTH,
                      10.0, 15.0, MUTED, keep_words=True)
    if left_end > CONTENT_BOTTOM + .1:
        raise ValueError(f"{spec['key']}: left column exceeds available space ({left_end})")

    # Right major column (61.8%): preserved '직접 맡은 구현' & '트러블슈팅' headings
    y = CONTENT_TOP
    for s_idx, (title, blocks) in enumerate(sc['sections']):
        if s_idx > 0:
            b.rule(y + 18, RIGHT_X, RIGHT_WIDTH, LINE, 0.65)
            y += 30
        y = vc.section_title(b, title, RIGHT_X, y, RIGHT_WIDTH)
        for b_idx, block in enumerate(blocks):
            kind = block[0]
            if kind == 'flow':
                _, nodes, icon_size, gap = block
                y = vc.pictogram_flow(b, nodes, RIGHT_X, y + 14, RIGHT_WIDTH,
                                      icon_size=icon_size, gap=gap)
            elif kind == 'table':
                _, headers, rows, col_widths = block
                y = vc.truth_table(b, headers, rows, col_widths, RIGHT_X, y + 12)
            elif kind == 'checks':
                _, items, label_w = block
                if b_idx > 0:
                    b.rule(y + 12, RIGHT_X, RIGHT_WIDTH, LINE, 0.45)
                    y += 19
                else:
                    y += 12
                y = vc.check_rows(b, items, RIGHT_X, y, RIGHT_WIDTH, label_w=label_w)
    if y > CONTENT_BOTTOM + .1:
        raise ValueError(f"{spec['key']}: right column exceeds available space ({y})")


def footer(b, spec, web, awards):
    stack = spec['stack'].replace('<br/>', ' · ')
    b.para(stack, M, 530, CW, 9.2, 12, MUTED, keep_words=True, align='center', limit=H - 20)
    titles = ['SSAFY 공통프로젝트 1등 (우수상)', 'SW 공모전 금상',
              '캡스톤디자인 장려상', 'IT 프로젝트 프로리그 장려상']
    if spec['awards']:
        b.award_links([(titles[index], web + 'resume/' + awards[index][3])
                       for index in spec['awards']], 545, size=9.2, gap=26)
    if 'badge' in spec:
        b.gold_badge(spec['badge'], W / 2, 545)
    if 'award_label' in spec:
        b.para(spec['award_label'], M, 545, CW, 9.2, 12, MUTED, bold=True,
               align='center', limit=H - 20)
    b.rule(526)
    b.button_row(source_links(spec, web), 564, size=9.2, gap=14, pad_x=8.5, pad_y=2.8)
    b.end(rule_top=None)
