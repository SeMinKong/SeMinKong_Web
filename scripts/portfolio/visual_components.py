"""Swiss-editorial visual components using official Lucide icons (ISC license).

Follows Kill AI Slop principles:
- Real professionally designed vector icons (no AI-sketched SVGs)
- Bare icons inheriting ink/accent color directly on paper (no tinted icon tiles)
- No nested cards, no one-hue status pills, no colored border callouts
- Visual keywords carry scannable meaning through alignment, weight, and neutral surface strips
"""
from io import BytesIO
from pathlib import Path

from reportlab.graphics import renderPDF
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from svglib.svglib import svg2rlg

ICONS_DIR = Path(__file__).resolve().parent / 'assets' / 'icons'

INK = HexColor('#171512')
MUTED = HexColor('#625e56')
LINE = HexColor('#d4d0c5')
ACCENT = HexColor('#a73524')
NEUTRAL_STRIP = HexColor('#ebe6dc')

_ICON_CACHE = {}


def lucide_icon(b, name, x, top, size=12, color_hex='#a73524', stroke_width='1.85'):
    """Render an official Lucide SVG icon directly onto the PDF canvas (bare, no container)."""
    key = (name, color_hex, stroke_width)
    svg_bytes = _ICON_CACHE.get(key)
    if svg_bytes is None:
        raw = (ICONS_DIR / f'{name}.svg').read_text(encoding='utf-8')
        raw = (raw
               .replace('stroke="currentColor"', f'stroke="{color_hex}"')
               .replace('stroke-width="2"', f'stroke-width="{stroke_width}"'))
        svg_bytes = raw.encode('utf-8')
        _ICON_CACHE[key] = svg_bytes

    drawing = svg2rlg(BytesIO(svg_bytes))
    scale = min(size / drawing.width, size / drawing.height)
    w, h = drawing.width * scale, drawing.height * scale
    drawing.scale(scale, scale)
    drawing.width, drawing.height = w, h
    b.track(f'lucide:{name}', x, top, w, h, 'icon')
    H = b.c._pagesize[1]
    renderPDF.draw(drawing, b.c, x, H - top - h)
    return w


def _arrow(b, x1, x2, mid_y, color=LINE, head_color=MUTED):
    """Minimal directional line between ordered stages or Problem -> Solution keywords."""
    c = b.c
    H = c._pagesize[1]
    y = H - mid_y
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(0.75)
    c.setLineCap(1)
    c.line(x1, y, x2, y)
    c.setStrokeColor(head_color)
    c.setLineWidth(0.85)
    c.setLineJoin(1)
    c.line(x2 - 3.2, y + 2.4, x2, y)
    c.line(x2 - 3.2, y - 2.4, x2, y)
    c.restoreState()


def sequence_flow(b, steps, x, top, width, col_gap=18):
    """Unboxed horizontal sequence pairing bare Lucide icons with ordered 01 -> 02 -> 03 stages."""
    n = len(steps)
    col_w = (width - col_gap * (n - 1)) / n
    icon_size = 13.0
    num_size = 9.2
    line_y = top + 6.5

    for i, (icon_name, title, subtitle) in enumerate(steps):
        cx = x + i * (col_w + col_gap)
        lucide_icon(b, icon_name, cx, top, size=icon_size, color_hex='#171512', stroke_width='1.85')
        ord_x = cx + icon_size + 5.5
        ordinal = f'{i + 1:02d}'
        ord_w = pdfmetrics.stringWidth(ordinal, 'Helvetica-Bold', num_size)
        b.text(ordinal, ord_x, top + 0.8, size=num_size, font='Helvetica-Bold', color=ACCENT)

        arrow_start = ord_x + ord_w + 7
        if i + 1 < n:
            next_x = x + (i + 1) * (col_w + col_gap)
            _arrow(b, arrow_start, next_x - 8, line_y, color=LINE, head_color=MUTED)
        else:
            b.rule(line_y, arrow_start, max(0, cx + col_w - arrow_start), LINE, 0.75)

        title_end = b.para(title, cx, top + 18, col_w, 10.5, 14.2, INK, bold=True, keep_words=True)
        b.para(subtitle, cx, title_end + 2.0, col_w, 9.1, 12.8, MUTED, keep_words=True)

    return top + 50


def keyword_rail_item(b, icon_name, keyword, sub_keyword, x, top, width):
    """Bare Lucide icon + bold visual keyword + muted sub-keyword on the left rail."""
    icon_size = 12.0
    lucide_icon(b, icon_name, x, top + 1.0, size=icon_size, color_hex='#a73524', stroke_width='1.85')
    tx = x + icon_size + 6.0
    tw = width - icon_size - 6.0
    kw_end = b.para(keyword, tx, top, tw, 9.6, 13.5, INK, bold=True, keep_words=True)
    sub_end = b.para(sub_keyword, tx, kw_end + 2.0, tw, 9.0, 12.2, MUTED, keep_words=True)
    return sub_end


def neutral_transition_strip(b, issue, solution, x, top, width):
    """Flat neutral opaque surface strip (no border, no nested card, no one-hue tint)."""
    size = 9.1
    pad_x = 7.0
    strip_h = 18.0
    c = b.c
    H = c._pagesize[1]
    c.saveState()
    c.setFillColor(NEUTRAL_STRIP)
    c.roundRect(x, H - top - strip_h, width, strip_h, 2.0, stroke=0, fill=1)
    c.restoreState()

    text_y = top + 3.6
    w1 = pdfmetrics.stringWidth(issue, 'Korean', size)
    arrow_gap = 17.0
    b.text(issue, x + pad_x, text_y, size=size, font='Korean', color=MUTED)
    _arrow(b, x + pad_x + w1 + 3.5, x + pad_x + w1 + arrow_gap - 3.5,
           top + strip_h / 2, color=ACCENT, head_color=ACCENT)
    b.text(solution, x + pad_x + w1 + arrow_gap, text_y, size=size, font='KoreanBold', color=INK)
    return top + strip_h
