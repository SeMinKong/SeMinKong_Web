"""Read-only checks for the nine-page portfolio and its retained-source links."""
from pathlib import Path
import argparse
import hashlib
import json
import re
from urllib.parse import urlsplit

import pdfplumber
from PIL import Image
from pypdf import PdfReader

from project_pages import PROJECTS, M, LEFT_WIDTH, RIGHT_X, RIGHT_WIDTH

ROOT = Path(__file__).resolve().parents[2]
WEB = 'https://seminkong.github.io/SeMinKong_Web/'
PAGE_KEYS = ['introduction', 'capability', 'thing', 'aqis', 'briefit', 'mri', 'prompt', 'alkkagi', 'closing']


def verify(path):
    reader = PdfReader(path)
    assert len(reader.pages) == 9 and len(reader.outline) == 9, 'Nine pages and bookmarks required'
    catalog = reader.trailer['/Root']
    assert not any(k in catalog for k in ['/OpenAction', '/AA', '/AcroForm'])
    assert not any(k in catalog.get('/Names', {}) for k in ['/JavaScript', '/EmbeddedFiles'])
    layout = json.loads(path.with_suffix('.layout.json').read_text(encoding='utf-8'))
    assert [p['key'] for p in layout['pages']] == PAGE_KEYS
    assert layout['version'] == '2026.09.12'
    texts, links_by_page, sizes = [], [], []
    with pdfplumber.open(path) as doc:
        for n, page in enumerate(doc.pages, 1):
            assert abs(page.width-841.89) < .1 and abs(page.height-595.28) < .1
            assert not page.rotation
            text = page.extract_text() or ''
            assert len(text) > 150 and '\ufffd' not in text, f'Page {n}: missing text'
            footer = page.crop((0, 580, page.width, page.height)).extract_text()
            assert not footer.strip(), f'Page {n}: unexpected bottom text'
            texts.append(reader.pages[n-1].extract_text() or '')
            for char in page.chars:
                assert char['x0'] >= 0 and char['x1'] <= page.width + .1
                assert char['top'] >= 0 and char['bottom'] <= page.height + .1
                assert 'ZapfDingbats' not in char.get('fontname', '')
                sizes.append(char['size'])
    assert min(sizes) >= 8.99, 'Text must remain at least 9pt'
    for page in reader.pages:
        assert page.cropbox == page.mediabox
        links = []
        for entry in page.get('/Annots', []):
            a = entry.get_object()
            assert a['/Subtype'] == '/Link'
            x0, y0, x1, y1 = map(float, a['/Rect'])
            assert 0 <= x0 <= x1 <= 841.9 and 0 <= y0 <= y1 <= 595.3
            action = a['/A']
            assert action['/S'] == '/URI'
            uri = str(action['/URI'])
            assert uri.isascii() and urlsplit(uri).scheme in {'https', 'mailto'}
            assert all(part not in uri for part in ['drive.google.com', 'canva.com', '.private', 'localhost'])
            links.append(uri)
        links_by_page.append(links)
    all_text = '\n'.join(texts)
    assert all(x not in all_text for x in ['PLACEHOLDER', 'TODO', '\ufffd', '27쪽', '99.4%', '92.7%', '기준을 정하는 중'])
    assert not re.search(r'010[- ]?\d{4}[- ]?\d{4}|\d{6}-[1-4]\d{6}', all_text)
    for label in ['공세민', 'Se Min Kong', '정보처리기사', 'OPIc English IH', 'Suwon']:
        assert label in texts[0], f'Cover missing {label}'
    assert not any(label in texts[0] for label in ['이 문서', '2026.09.12', '9쪽', 'A4 가로'])
    assert '구현 경험' in texts[1]
    assert not any(label in all_text for label in ['Torque OFF', '구현을 더 자세히 읽기', '프로젝트의 입구'])
    assert not any(e['page'] == 2 and e['kind'] == 'annotation' for e in layout['elements'])
    assert not any(label in texts[1] for label in ['(AQIS)', '(THING)', '(Brain MRI', '(Alkkagi', '(Prompt)']), \
        'Experience headings must not repeat project-specific explanation'
    assert all(x in texts[1] for x in ['C++', 'Python', 'Isaac Sim', 'Isaac Lab', 'LangChain', 'vLLM', 'Jira'])
    all_links = [u for links in links_by_page for u in links]
    assert len({u for u in all_links if '/resume/award-' in u}) == 4
    assert len({u for u in all_links if '/resume/certificate-' in u}) == 2
    assert WEB in all_links and 'mailto:semin1224@gmail.com' in all_links
    elements = layout['elements']
    assert not any(e['kind'] == 'page_number' for e in elements)
    assert sum(e['kind'] == 'trophy' for e in elements) == 5
    overlaps = []
    for i, a in enumerate(elements):
        for b in elements[i+1:]:
            if a['page'] != b['page']:
                continue
            dx = min(a['x']+a['width'], b['x']+b['width']) - max(a['x'], b['x'])
            dy = min(a['top']+a['height'], b['top']+b['height']) - max(a['top'], b['top'])
            if dx > .5 and dy > .5:
                overlaps.append((a['page'], a['text'][:30], b['text'][:30]))
    assert not overlaps, f'Overlapping elements: {overlaps}'
    for n, spec in enumerate(PROJECTS, 3):
        for label in [spec['name'], '직접 맡은 구현', '트러블슈팅', '회고']:
            assert label in texts[n-1], f'Page {n}: missing {label}'
        # Compare every approved sentence, ignoring extraction-only line wraps.
        compact = lambda value: re.sub(r'\s+', '', value)
        page_text = compact(texts[n-1])
        for sentence in [*spec['built'], spec['reflection'],
                         *[part for pair in spec['troubleshooting'] for part in pair]]:
            assert compact(sentence) in page_text, f'Page {n}: approved text omitted or shortened: {sentence}'
        page_elements = [e for e in elements if e['page'] == n]
        for label, top in [('직접 맡은 구현', 106), ('트러블슈팅', 260), ('회고', 438)]:
            headings = [e for e in page_elements if e['text'] == label]
            assert len(headings) == 1
            assert abs(headings[0]['x'] - RIGHT_X) < .02 and headings[0]['top'] == top
            assert abs(headings[0]['width'] - RIGHT_WIDTH) < .02
        reflection = next(e for e in page_elements if e['text'] == spec['reflection'])
        first_issue = next(e for e in page_elements if e['text'].startswith('<b>' + spec['troubleshooting'][0][0]))
        first_built = next(e for e in page_elements if e['text'] == spec['built'][0])
        for e, x, top in [(first_built, RIGHT_X + 12, 130), (first_issue, RIGHT_X, 284),
                          (reflection, RIGHT_X, 462)]:
            assert abs(e['x'] - x) < .02 and e['top'] == top
        for label, top in [(f"<b>기간</b> {spec['period']} · {spec['team']}", 106),
                           (f"<b>역할</b> {spec['role']}", 129), (spec['stack'], 152),
                           (spec['tagline'], 438), (spec['summary'], 462)]:
            e = next(e for e in page_elements if e['text'] == label)
            assert e['x'] == M and e['width'] == LEFT_WIDTH and e['top'] == top
        links = [next(e for e in page_elements if e['text'] == label)
                 for label in ['README', '기술 문서', '프로젝트 시연']]
        assert all(e['top'] == 563 for e in links)
        assert abs((links[0]['x'] + links[-1]['x'] + links[-1]['width']) / 2 - 841.89 / 2) < .02
        assert sum(e['kind'] == 'trophy' for e in page_elements) == len(spec['awards'])
        award_items = [e for e in page_elements if 545 <= e['top'] <= 546]
        if award_items:
            left = min(e['x'] for e in award_items)
            right = max(e['x'] + e['width'] for e in award_items)
            assert abs((left + right) / 2 - 841.89 / 2) < .02
        expected = [spec['repo']+'blob/main/README.md', spec['repo']+'blob/main/'+spec['detail'], WEB+spec['case']]
        assert all(url in links_by_page[n-1] for url in expected), f'Page {n}: missing direct detail links'
        assert all(url in links_by_page[8] for url in expected[:2]), f'Index missing project {spec["key"]}'
        figure = next(e for e in elements if e['page'] == n and e['kind'] == 'image')
        caption = next(e for e in elements if e['page'] == n and e['text'] == spec['caption'])
        assert figure['text'] == spec['figure'][0]
        assert abs(caption['x']-figure['x']) < .02 and abs(caption['width']-figure['width']) < .02
        assert abs(caption['top']-figure['top']-figure['height']-10) < .02
        assert abs(caption['center_x']-figure['x']-figure['width']/2) < .02
        assert abs(caption['top']-405) < .02, f'Page {n}: inconsistent caption baseline'
        assert abs(caption['center_x']-M-LEFT_WIDTH/2) < .02
        name = spec['figure'][0]
        source = ROOT/'scripts/portfolio/assets'/name[1:] if name.startswith('@') else ROOT/'src/assets/projects'/name
        with Image.open(source) as image:
            left, top, right, bottom = spec['figure'][1]
            expected_ratio = image.width*(right-left)/(image.height*(bottom-top))
            assert abs(figure['width']/figure['height']-expected_ratio) < .0002
            embedded = reader.pages[n-1].images
            assert len(embedded) == 1
            obj = next(iter(reader.pages[n-1]['/Resources']['/XObject'].values())).get_object()
            filters = obj.get('/Filter', [])
            if '/DCTDecode' in filters:
                # pypdf's image export can re-encode JPEG; compare the embedded
                # original DCT stream instead of its exported preview pixels.
                assert obj.get_data() == source.read_bytes(), f'Page {n}: JPEG bytes changed'
            else:
                assert embedded[0].image.convert('RGBA').tobytes() == image.convert('RGBA').tobytes(), f'Page {n}: source pixels changed'
    portrait = next(e for e in elements if e['text'] == '@se-min-kong-profile.png')
    assert portrait['page'] == 1 and abs(portrait['width']/portrait['height']-.75) < .001
    assert len(reader.pages[0].images) == 1
    assert reader.pages[0].images[0].image.size == (1086, 1448)
    with Image.open(ROOT/'.private/portfolio/se-min-kong-profile.png') as source:
        assert reader.pages[0].images[0].image.convert('RGBA').tobytes() == source.convert('RGBA').tobytes()
    centered = [e for e in elements if 'center_x' in e]
    with pdfplumber.open(path) as doc:
        for e in centered:
            chars = [c for c in doc.pages[e['page']-1].chars
                     if e['x']-.1 <= c['x0'] and c['x1'] <= e['x']+e['width']+.1
                     and e['top']-.1 <= c['top'] and c['bottom'] <= e['top']+e['height']+2]
            rows = {}
            for c in chars:
                rows.setdefault(round(c['top'], 1), []).append(c)
            assert rows, f'No centered text extracted: {e}'
            for row in rows.values():
                center = (min(c['x0'] for c in row)+max(c['x1'] for c in row))/2
                assert abs(center-e['center_x']) < .35, f'Off-center text: {e["text"]}'
    for n, bookmark in enumerate(reader.outline):
        assert reader.get_destination_page_number(bookmark) == n
    return dict(pages=9, bookmarks=9, external_links=len(all_links),
                direct_project_links=18, repository_index_links=12,
                min_font_pt=round(min(sizes), 2), layout_overlaps=0,
                aligned_captions=6, centered_text_blocks=len(centered), unchanged_source_images=6,
                complete_project_texts=6, aligned_project_grids=6,
                page_numbers=0, trophy_icons=5,
                bytes=path.stat().st_size, sha256=hashlib.sha256(path.read_bytes()).hexdigest().upper())


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('path', nargs='?', default=str(ROOT/'output/pdf/SeMinKong-Portfolio.pdf'))
    print(json.dumps(verify(Path(parser.parse_args().path)), ensure_ascii=False))
