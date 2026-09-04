"""Structural and editorial checks for the final portfolio; read-only by default."""
from pathlib import Path
import argparse
import hashlib
import json
import re
from urllib.parse import urlsplit

import pdfplumber
from pypdf import PdfReader

ROOT = Path(__file__).resolve().parents[2]


def verify(path):
    reader = PdfReader(path)
    assert len(reader.pages) == 20, 'Expected the full 20-page edition'
    assert len(reader.outline) == 20, 'One bookmark is required per page'
    root = reader.trailer['/Root']
    assert not any(key in root for key in ['/OpenAction', '/AA', '/AcroForm'])
    names = root.get('/Names', {})
    assert not any(key in names for key in ['/JavaScript', '/EmbeddedFiles'])
    texts, external, internal, sizes = [], [], 0, []
    with pdfplumber.open(path) as doc:
        for index, page in enumerate(doc.pages, 1):
            assert abs(page.width - 841.89) < .1 and abs(page.height - 595.28) < .1
            assert not page.rotation
            text = page.extract_text() or ''
            assert len(text) > 100 and '\ufffd' not in text
            assert f'{index:02d} / 20' in text, f'Page number missing: {index}'
            texts.append(text)
            for char in page.chars:
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
            else:
                action = annot['/A']
                assert action['/S'] == '/URI'
                uri = str(action['/URI'])
                assert uri.isascii() and urlsplit(uri).scheme in {'https', 'mailto'}
                assert 'drive.google.com' not in uri
                external.append(uri)
    intro = '\n'.join(texts[:2])
    assert not re.search(r'\b(THING|AQIS|Briefit|Alkkagi|KoBART)\b', intro)
    assert not any(value in intro for value in ['우수상', '장려상', '금상'])
    assert 'SSAFY 공통 프로젝트 우수상' in texts[6] and 'THING' in texts[6]
    for title in ['IT대학 소프트웨어 공모전 금상', '숭실 캡스톤디자인 경진대회 장려상', 'IT 프로젝트 프로리그 장려상']:
        assert title in texts[12], f'Missing Briefit award: {title}'
    assert 'Briefit' in texts[12]
    assert '예시' in texts[12] and '밝혔다. 밝혔다.' in texts[12]
    assert '예시' in texts[15] and '실제 MRI나 모델 예측은 아닙니다' in texts[15]
    assert all(label in texts[7] for label in ['검사 대상과 검출 영역', '판정과 작업 대기열', '로봇·컨베이어 동작'])
    assert '후처리 미적용' in texts[11]
    assert '어떤 종류인가요?' in texts[14] and '어디에 있나요?' in texts[14]
    assert all(label in texts[16] for label in ['내 돌', '방향·세기', '상대 돌'])
    assert '모터와 함께 돌며 텐던을 감습니다' in texts[5]
    assert '원통형 물체를 감싸 쥐는' in texts[6]
    assert '임상 진단을 위한 검증은 수행하지' in texts[13] and '않았습니다' in texts[13]
    assert all(label in texts[18] for label in ['아이디어 입력', '화면·사용성', '시스템 구조', '데이터 저장', '통합 설계 문서'])
    all_text = '\n'.join(texts)
    assert not re.search(r'010[- ]?\d{4}[- ]?\d{4}|\d{6}-[1-4]\d{6}', all_text)
    assert not any(value in all_text for value in ['99.4%', '92.7%', 'STYLE SAMPLE', 'PLACEHOLDER', 'TODO'])
    assert not any(value in all_text for value in ['LOCAL / MOCK', '로컬 재현', '이번 재현', '원본 시연 00:', '영상 00:', 'LangGraph'])
    assert len(set(u for u in external if '/resume/award-' in u)) == 4
    assert internal == 6
    assert 'https://seminkong.github.io/SeMinKong_Web/' in external
    assert 'mailto:semin1224@gmail.com' in external
    layout = json.loads(path.with_suffix('.layout.json').read_text(encoding='utf-8'))
    overlaps = []
    elements = layout['elements']
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
    return dict(pages=len(texts), page_characters=[len(t) for t in texts],
                external_links=len(external), internal_links=internal,
                min_font_pt=round(min(sizes), 2), max_font_pt=round(max(sizes), 2),
                layout_overlaps=len(overlaps), bytes=path.stat().st_size,
                sha256=hashlib.sha256(path.read_bytes()).hexdigest().upper())


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('path', nargs='?', default=str(ROOT / 'output/pdf/SeMinKong-Portfolio.pdf'))
    args = parser.parse_args()
    print(json.dumps(verify(Path(args.path)), ensure_ascii=False))
