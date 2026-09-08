"""Structural and editorial checks for the final portfolio; read-only by default."""
from pathlib import Path
import argparse
import hashlib
import json
import re
from urllib.parse import urlsplit

import pdfplumber
from PIL import Image
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]


def crosses_text(start, end, element, clearance=1):
    """Clip a line segment against a text rectangle, including a small gutter."""
    low, high = 0.0, 1.0
    for origin, delta, minimum, maximum in [
        (start[0], end[0]-start[0], element['x']-clearance, element['x']+element['width']+clearance),
        (start[1], end[1]-start[1], element['top']-clearance, element['top']+element['height']+clearance),
    ]:
        if abs(delta) < 1e-9:
            if not minimum <= origin <= maximum:
                return False
        else:
            entry, leave = sorted(((minimum-origin)/delta, (maximum-origin)/delta))
            low, high = max(low, entry), min(high, leave)
            if low > high:
                return False
    return True


def verify(path):
    reader = PdfReader(path)
    assert len(reader.pages) == 26, 'Expected the full 26-page edition'
    assert len(reader.outline) == 26, 'One bookmark is required per page'
    root = reader.trailer['/Root']
    assert not any(key in root for key in ['/OpenAction', '/AA', '/AcroForm'])
    names = root.get('/Names', {})
    assert not any(key in names for key in ['/JavaScript', '/EmbeddedFiles'])
    texts, external, internal, sizes = [], [], 0, []
    internal_destinations = []
    page_refs = {page.indirect_reference.idnum: n for n, page in enumerate(reader.pages, 1)}
    with pdfplumber.open(path) as doc:
        for index, page in enumerate(doc.pages, 1):
            assert abs(page.width - 841.89) < .1 and abs(page.height - 595.28) < .1
            assert not page.rotation
            text = page.extract_text() or ''
            assert len(text) > 100 and '\ufffd' not in text
            footer = page.crop((page.width - 60, 550, page.width - 37, 578)).extract_text()
            assert footer.strip() == str(index), f'Page number missing: {index}'
            # Preserve authored paragraph order for editorial checks; spatial
            # extraction interleaves unrelated columns across wrapped lines.
            texts.append(reader.pages[index-1].extract_text() or '')
            for char in page.chars:
                assert 'ZapfDingbats' not in char.get('fontname', ''), f'Unsupported glyph on page {index}'
                assert char['x0'] >= 0 and char['x1'] <= page.width + .1
                assert char['top'] >= 0 and char['bottom'] <= page.height + .1
                sizes.append(char['size'])
    for index, page in enumerate(reader.pages, 1):
        assert page.cropbox == page.mediabox
        for item in page.get('/Annots', []):
            annot = item.get_object()
            assert annot.get('/Subtype') == '/Link', f'Unexpected annotation on page {index}'
            x0, y0, x1, y1 = map(float, annot['/Rect'])
            assert 0 <= x0 <= x1 <= 841.9 and 0 <= y0 <= y1 <= 595.3
            if '/Dest' in annot:
                internal += 1
                internal_destinations.append(page_refs[annot['/Dest'][0].idnum])
            else:
                action = annot['/A']
                assert action['/S'] == '/URI'
                uri = str(action['/URI'])
                assert uri.isascii() and urlsplit(uri).scheme in {'https', 'mailto'}
                assert 'drive.google.com' not in uri
                assert 'canva.com' not in uri, 'Do not publish a Canva editing/share token'
                external.append(uri)
    intro = texts[0]
    assert 'Suwon,' in texts[0] and 'Republic of Korea' in texts[0]
    assert 'Seoul' not in intro
    assert not re.search(r'\b(THING|AQIS|Briefit|Alkkagi|KoBART)\b', intro)
    assert not any(value in intro for value in ['우수상', '장려상', '금상'])
    assert 'SSAFY 공통 프로젝트 우수상' in texts[6] and 'THING' in texts[6]
    for title in ['IT대학 소프트웨어 공모전 금상', '숭실 캡스톤디자인 경진대회 장려상', 'IT 프로젝트 프로리그 장려상']:
        assert title in texts[13], f'Missing Briefit award: {title}'
    assert 'Briefit' in texts[13]
    assert all(label in texts[7] for label in ['프로젝트 개요', '직접 맡은 일', '협업'])
    # Architecture labels now live in the owner's unchanged PNGs. Check the
    # searchable explanation here and verify all image/alpha bytes below.
    for page, labels in {
        4: ['21개 landmark', '굴곡 5축', '대립·외전 2축', '저역통과 필터', 'Sync Write', '팀 구현', '본인은 모터 점검'],
        9: ['마지막 3일', '초기 계획', 'Mock', '공통 API', '자동 임무'],
        11: ['스크립트 정상 종료 시 재개', '파지 성공', '센서', 'timestamp', '정지 명령의 실패 응답', 'Mock', '기대값 불일치', '고정 좌표'],
        6: ['현재 위치 읽기', '토크 ON', '가까운 중앙각', '끝점 보정', '후속 과제'],
        15: ['URL 집합', '부분 요약', '재요약', '잘릴 수', 'ROUGE', '후처리 전 생성문', '정보 손실'],
        18: ['같은 MRI를 두 모델에 각각', 'polygon label', 'closing·opening', '너비/높이', 'test', 'val', '환자 단위 독립성', '임상 진단 검증', '작은 병변', '내부 구멍'],
        20: ['프로젝트 개요', '직접 맡은 일', '개인 프로젝트', '초기 설계 흐름'],
        23: ['프로젝트 개요', '직접 맡은 일', '개인 프로젝트', '실제 플레이'],
        24: ['서버 메모리', '서버에서 입력 검증', '마찰', '지속 프레임률', '서버 재시작', '절반씩', '소단계'],
        21: ['여섯 영역', '병렬', '연결 종료 시 삭제', '평가 결과', '호출 성공 뒤', '라운드를 되돌리고'],
    }.items():
        normalized = re.sub(r'\s+', '', texts[page-1])
        assert all(re.sub(r'\s+', '', label) in normalized for label in labels), f'Incomplete explanation on page {page}'
    assert '캔 파지 시연' in texts[6]
    assert '임상 진단 검증은 완료하지 않았습니다' in texts[17]
    all_text = '\n'.join(texts)
    assert not any(value in all_text for value in [
        'PORTFOLIO /', 'SE MIN KONG', 'PROJECT AWARD', 'TEAM / ROLE',
        '프로젝트마다 같은 질문', 'PDF에서 웹으로, 웹에서 PDF로',
        '01. 겹친 돌', '02. 질량', '03. 입력', '기준으로 작성했습니다',
        '밝혔다. 밝혔다.', '비가 온다.', '64×64',
    ])
    assert not re.search(r'010[- ]?\d{4}[- ]?\d{4}|\d{6}-[1-4]\d{6}', all_text)
    assert not any(value in all_text for value in ['99.4%', '92.7%', 'STYLE SAMPLE', 'PLACEHOLDER', 'TODO'])
    assert not any(value in all_text for value in ['LOCAL / MOCK', '로컬 재현', '이번 재현', '원본 시연 00:', '영상 00:', 'LangGraph'])
    assert len(set(u for u in external if '/resume/award-' in u)) == 4
    assert internal == 6
    assert internal_destinations == [3, 8, 14, 17, 20, 23], 'Index must open each project introduction in owner order'
    assert 'https://seminkong.github.io/SeMinKong_Web/' in external
    assert 'mailto:semin1224@gmail.com' in external
    layout = json.loads(path.with_suffix('.layout.json').read_text(encoding='utf-8'))
    overlaps = []
    elements = layout['elements']
    figure_root = ROOT / 'scripts/portfolio/assets/architecture/returned'
    figures = json.loads((figure_root / 'manifest.json').read_text(encoding='utf-8'))['figures']
    assert {f['page'] for f in figures} == {9, 15, 18, 21, 24}
    for figure in figures:
        source = figure_root / figure['file']
        assert hashlib.sha256(source.read_bytes()).hexdigest() == figure['sha256']
        with Image.open(source) as image:
            assert image.mode == 'RGBA' and list(image.size) == figure['size']
            assert image.getchannel('A').getextrema() == (0, 255)
            objects = reader.pages[figure['page']-1]['/Resources']['/XObject']
            embedded = [obj.get_object() for obj in objects.values()
                        if obj.get_object().get('/Subtype') == '/Image']
            assert len(embedded) == 1, f"Unexpected figure count on page {figure['page']}"
            rgb = embedded[0]
            assert (rgb['/Width'], rgb['/Height']) == image.size
            assert rgb['/ColorSpace'] == '/DeviceRGB' and rgb['/BitsPerComponent'] == 8
            assert rgb.get_data() == image.convert('RGB').tobytes(), f"RGB changed: {source.name}"
            alpha = rgb['/SMask']
            assert (alpha['/Width'], alpha['/Height']) == image.size
            assert alpha['/ColorSpace'] == '/DeviceGray' and alpha['/BitsPerComponent'] == 8
            assert alpha.get_data() == image.getchannel('A').tobytes(), f"Alpha changed: {source.name}"
        placements = [e for e in elements if e['page'] == figure['page'] and e['kind'] == 'image']
        assert len(placements) == 1
        placed = placements[0]
        assert placed['text'] == '@architecture/returned/' + source.name
        assert abs(placed['width'] / placed['height'] - figure['size'][0] / figure['size'][1]) < .0001
    assert all(e['top'] >= 57 for e in elements), 'Decorative running header returned'
    assert not any(e['kind'] == 'annotation' for e in elements), 'Image-guide markers returned'
    assert [entry['key'] for entry in layout['pages']] == [
        'introduction', 'projects', 'thing', 'thing-architecture', 'thing-mechanism', 'thing-control', 'thing-result',
        'aqis', 'aqis-mock', 'aqis-transform', 'aqis-coordinates', 'aqis-twin', 'aqis-telemetry', 'briefit', 'briefit-data', 'briefit-seq2seq',
        'mri', 'mri-method', 'mri-polygons', 'prompt', 'prompt-architecture', 'prompt-state-machine', 'alkkagi', 'alkkagi-physics', 'alkkagi-collision', 'contact',
    ]
    # Each introduction is followed by one source-backed technical explanation.
    technical_pages = [4, 9, 15, 18, 21, 24]
    for page in technical_pages:
        page_elements = [e for e in elements if e['page'] == page]
        assert any('→' in e['text'] and e['top'] == 97 for e in page_elements)
        sources = [str(a.get_object()['/A']['/URI']) for a in reader.pages[page-1].get('/Annots', [])
                   if '/A' in a.get_object()]
        assert sum(bool(re.search(r'/blob/[0-9a-f]{40}/', u)) for u in sources) >= 3, f'Page {page}: source pins missing'
        assert len([e for e in page_elements if e['x'] == 475 and e['height'] >= 45]) == 3
    # Added pages explain source conditions and calculations as searchable vectors.
    plate_labels = {
        5: ['acos', '180-theta', '0.65', '0.35', '0.08', '3020', '20Hz', '50Hz', '250ms', '실측 주기 보장 없음', '팀 구현'],
        10: ['8초', '0.5', '70px', '위치·시각', '중복 판정보다 먼저', '0.6', '3초', '후보가 있을 때 집기 요청', '정지 응답 실패', 'x_mm', '종료 코드 0'],
        16: ['384', '256', '1024', '512', '128', 'length_penalty', 'labels', '각 부분 요약에도', 'ROUGE', '거치지 않습니다'],
        19: ['mask > 1', '외부 윤곽', '0.001', 'x_norm', 'y_norm', '독립'],
        22: ['in_progress 유지', '[GENERATE_PROMPT]', 'round - 1', '1개 이상', '연결 종료 시 삭제', '이전 generated_prompt는 남습니다'],
        25: ['overlap/2', 'vn>0', '1/m1+1/m2', '0<D<r1+r2', '500ms', '0.45', '0.8**0.1', '계산 예시'],
    }
    for page, labels in plate_labels.items():
        normalized = re.sub(r'\s+', '', texts[page-1])
        assert all(re.sub(r'\s+', '', label) in normalized for label in labels), f'Plate {page}: missing mechanism or boundary'
        assert not [e for e in elements if e['page'] == page and e['kind'] == 'image']
        sources = [str(a.get_object()['/A']['/URI']) for a in reader.pages[page-1].get('/Annots', [])]
        assert len(sources) >= 3 and all(re.search(r'/blob/[0-9a-f]{40}/', u) for u in sources)
    for page, labels in {
        12: ['RoboDK', '팀원 담당', '명령 큐', 'HTTP polling', 'script_id', '기구학'],
        13: ['SLAM', 'RViz', '지도 PNG 자체는 그리지 않습니다', 'odom', 'JointState', 'URDF', 'Nav2 goal'],
    }.items():
        normalized = re.sub(r'\s+', '', texts[page-1])
        assert all(re.sub(r'\s+', '', label) in normalized for label in labels), f'AQIS page {page}: missing scope'
        assert len([e for e in elements if e['page'] == page and e['kind'] == 'image']) == 1
        sources = [str(a.get_object()['/A']['/URI']) for a in reader.pages[page-1].get('/Annots', [])]
        assert len(sources) >= 3 and all(re.search(r'/blob/[0-9a-f]{40}/', u) for u in sources)
    with pdfplumber.open(path) as doc:
        for page in plate_labels:
            assert len(doc.pages[page-1].curves) >= 6, f'Page {page}: vector visualization missing'
    assert min(sizes) >= 8.99, 'Smallest authored text must remain at least 9pt'
    for entry in layout['pages']:
        assert not re.search(r'(하기|까지|했습니다|합니다|인가요\?)$', entry['title'])
    for i, a in enumerate(elements):
        for b in elements[i+1:]:
            if a['page'] != b['page']:
                continue
            # Editorial number markers intentionally overlay a photograph.
            # Other text / image intersections remain errors.
            if {a['kind'], b['kind']} == {'annotation', 'image'}:
                continue
            dx = min(a['x']+a['width'], b['x']+b['width']) - max(a['x'], b['x'])
            dy = min(a['top']+a['height'], b['top']+b['height']) - max(a['top'], b['top'])
            if dx > .5 and dy > .5:
                overlaps.append((a['page'], a['text'][:40], b['text'][:40]))
    assert not overlaps, f'Layout rectangle overlaps: {overlaps}'
    arrow_collisions = []
    for arrow in layout['arrows']:
        for start, end in zip(arrow['points'], arrow['points'][1:]):
            assert start != end, f"Zero-length arrow on page {arrow['page']}"
            for element in elements:
                if element['page'] == arrow['page'] and element['kind'] == 'text' and crosses_text(start,end,element):
                    arrow_collisions.append((arrow['page'], element['text'][:45]))
    assert not arrow_collisions, f'Arrow/text clearance: {arrow_collisions}'
    for connection in layout['connections']:
        (sx,sy,sw,sh),(tx,ty,tw,th)=connection['source'],connection['target']
        start,end=connection['points']
        if connection['vertical']:
            assert abs(start[0]-(sx+sw/2)) < .01 and abs(end[0]-(tx+tw/2)) < .01
            assert abs(start[1]-(sy+sh)-6) < .01 and abs(ty-end[1]-6) < .01
            assert end[1] > start[1]
        else:
            assert abs(start[1]-(sy+sh/2)) < .01 and abs(end[1]-(ty+th/2)) < .01
            assert abs(start[0]-(sx+sw)-6) < .01 and abs(tx-end[0]-6) < .01
            assert end[0] > start[0]
    figure_captions = [
        (6, '@thing-spool-tendon.jpg', '구동부 내부:'),
        (6, '@thing-acrylic-mount.jpg', '전완부 모터 고정부'),
        (7, '@thing-video-can-0010.jpg', '캔 파지 시연'),
        (14, 'briefit/cover.webp', '서비스 UI'),
        (17, '@mri-video-overlay-007733.png', '분류·분할 통합 추론'),
        (20, '@prompt-design-flow.png', '초기 설계 흐름'),
        (23, '@alkkagi-video-aim-0007.png', '실제 플레이'),
    ]
    for page, image_name, caption_prefix in figure_captions:
        figure = next(e for e in elements if e['page'] == page and e['text'] == image_name)
        caption = next(e for e in elements if e['page'] == page and e['text'].startswith(caption_prefix))
        assert abs(figure['x'] - caption['x']) < .02, f'Page {page}: caption left alignment'
        assert abs(figure['width'] - caption['width']) < .02, f'Page {page}: caption width'
        gap = caption['top'] - figure['top'] - figure['height']
        assert abs(gap - 10) < .02, f'Page {page}: caption gap is {gap}'
    portrait = [e for e in elements if e['text'] == '@se-min-kong-profile.png']
    assert len(portrait) == 1 and portrait[0]['page'] == 1
    assert abs(portrait[0]['width'] / portrait[0]['height'] - 1086 / 1448) < .001
    assert abs(portrait[0]['x'] + portrait[0]['width'] / 2 - (548 + 255 / 2)) < .01
    assert portrait[0]['width'] == 180 and portrait[0]['height'] == 240
    with pdfplumber.open(path) as doc:
        cover_images = doc.pages[0].images
        assert len(cover_images) == 1
        actual = cover_images[0]
        assert abs((actual['x0'] + actual['x1']) / 2 - (548 + 255 / 2)) < .01
    edited_paragraphs = [
        (3, '손동작 인식, ROS 2'), (6, '이동 명령에서는'),
        (6, '다회전 위치에서'), (6, '중앙각 복귀만으로'),
        (11, '같은 대상이'), (11, '관제가 정지되면'),
        (11, '설정 시간 대기와'), (11, 'timestamp가 없으면'),
        (15, '생성 시에는'), (18, '마스크를 이진화하고'),
        (21, '영역별 라운드'), (24, '중심 거리와'),
    ]
    with pdfplumber.open(path) as doc:
        for page, prefix in edited_paragraphs:
            e = next(e for e in elements if e['page'] == page and e['text'].startswith(prefix))
            bounds = (e['x']-.1, e['top']-.1, e['x']+e['width']+.1, e['top']+e['height']+1)
            block = doc.pages[page-1].crop(bounds)
            lines = block.extract_text().splitlines()
            assert len(lines[-1].strip()) >= 6, f'Page {page}: short paragraph tail {lines[-1]!r}'
            words = block.extract_words()
            last_top = max(w['top'] for w in words)
            last_words = [w for w in words if abs(w['top']-last_top) < 2]
            last_width = max(w['x1'] for w in last_words) - min(w['x0'] for w in last_words)
            assert last_width >= e['width'] * .25, f'Page {page}: unbalanced paragraph tail'
    return dict(pages=len(texts), page_characters=[len(t) for t in texts],
                external_links=len(external), internal_links=internal,
                min_font_pt=round(min(sizes), 2), max_font_pt=round(max(sizes), 2),
                layout_overlaps=len(overlaps), aligned_captions=len(figure_captions),
                checked_paragraph_tails=len(edited_paragraphs), bytes=path.stat().st_size,
                exact_rgba_architectures=len(figures),
                vector_technical_plates=len(plate_labels), checked_arrows=len(layout['arrows']),
                centered_connections=len(layout['connections']),
                sha256=hashlib.sha256(path.read_bytes()).hexdigest().upper())


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('path', nargs='?', default=str(ROOT / 'output/pdf/SeMinKong-Portfolio.pdf'))
    args = parser.parse_args()
    print(json.dumps(verify(Path(args.path)), ensure_ascii=False))
