"""Pictogram schematics and editorial tables using official Lucide icons (ISC license).

Replaces verbose prose with scannable visual diagrams while strictly avoiding AI slop:
- Real professionally designed Lucide vector icons, rendered bare directly on paper
- Flat editorial tables with hairlines and one quiet neutral header band
- Zero nested cards, zero tinted icon squares, zero one-hue pill spam
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
NEUTRAL_BAND = HexColor('#ebe6dc')

_ICON_CACHE = {}


def lucide_icon(b, name, x, top, size=18, color_hex='#171512', stroke_width='1.75'):
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
    """Minimal directional engineering connector between pictogram nodes."""
    c = b.c
    H = c._pagesize[1]
    y = H - mid_y
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(0.85)
    c.setLineCap(1)
    c.line(x1, y, x2, y)
    c.setStrokeColor(head_color)
    c.setLineWidth(0.95)
    c.setLineJoin(1)
    c.line(x2 - 3.6, y + 2.8, x2, y)
    c.line(x2 - 3.6, y - 2.8, x2, y)
    c.restoreState()


def numbered_heading(b, ordinal, title, x, top, width):
    """Clean Swiss-editorial numbered section heading (01 / 02)."""
    b.text(ordinal, x, top + 1.4, size=10.2, font='Helvetica-Bold', color=ACCENT)
    return b.para(title, x + 21, top, width - 21, 12.2, 17, INK, bold=True, keep_words=True)


def pictogram_flow(b, nodes, x, top, width, icon_size=20.0, gap=18.0):
    """Centered bare Lucide pictograms connected by horizontal arrows with concise 2-line captions."""
    n = len(nodes)
    node_w = (width - gap * (n - 1)) / n
    icon_mid_y = top + icon_size / 2
    max_end = top + icon_size

    for i, (icon_name, accent, title, subtitle) in enumerate(nodes):
        nx = x + i * (node_w + gap)
        ix = nx + (node_w - icon_size) / 2
        color_hex = '#a73524' if accent else '#171512'
        lucide_icon(b, icon_name, ix, top, size=icon_size, color_hex=color_hex, stroke_width='1.7')

        t_end = b.para(title, nx, top + icon_size + 7, node_w, 9.8, 13.5, INK,
                       bold=True, align='center', keep_words=True)
        s_end = b.para(subtitle, nx, t_end + 1.5, node_w, 9.0, 12.4, MUTED,
                       align='center', keep_words=True)
        max_end = max(max_end, s_end)

        if i + 1 < n:
            next_ix = x + (i + 1) * (node_w + gap) + (node_w - icon_size) / 2
            _arrow(b, ix + icon_size + 9, next_ix - 9, icon_mid_y, color=LINE, head_color=MUTED)

    return max_end


def truth_table(b, headers, rows, col_widths, x, top):
    """Flat Swiss-editorial comparison table (neutral header band + hairlines, zero card chrome)."""
    total_w = sum(col_widths)
    header_h = 20.0
    row_h = 28.0
    c = b.c
    H = c._pagesize[1]

    # Neutral opaque header band
    c.saveState()
    c.setFillColor(NEUTRAL_BAND)
    c.rect(x, H - top - header_h, total_w, header_h, stroke=0, fill=1)
    c.restoreState()

    cx = x
    for label, w in zip(headers, col_widths):
        b.text(label, cx + 8, top + 5.2, size=9.0, font='KoreanBold', color=MUTED)
        cx += w

    y = top + header_h
    for idx, (icon_name, icon_color, state_label, problem, resolution) in enumerate(rows):
        row_text_y = y + 8.6
        lucide_icon(b, icon_name, x + 8, y + 8.2, size=11.5, color_hex=icon_color, stroke_width='1.85')
        b.para(state_label, x + 24, row_text_y, col_widths[0] - 28, 9.3, 13.0, INK, bold=True, keep_words=True)
        b.para(problem, x + col_widths[0] + 8, row_text_y, col_widths[1] - 12, 9.1, 13.0, MUTED, keep_words=True)
        b.para(resolution, x + col_widths[0] + col_widths[1] + 8, row_text_y,
               col_widths[2] - 14, 9.2, 13.0, INK, keep_words=True)
        y += row_h
        weight = 0.55 if idx + 1 == len(rows) else 0.4
        b.rule(y, x, total_w, LINE, weight)

    return y


def check_rows(b, items, x, top, width, label_w=108.0):
    """Concise pictogram-anchored verification takeaways replacing verbose troubleshooting prose."""
    y = top
    for idx, (icon_name, label, detail) in enumerate(items):
        lucide_icon(b, icon_name, x, y + 1.2, size=11.5, color_hex='#a73524', stroke_width='1.9')
        lbl_end = b.para(label, x + 17, y, label_w - 20, 9.4, 13.4, INK, bold=True, keep_words=True)
        end_y = b.para(detail, x + label_w, y, width - label_w, 9.2, 13.4, MUTED, keep_words=True)
        y = max(lbl_end, end_y) + 9
        if idx + 1 < len(items):
            b.rule(y - 4.5, x, width, LINE, 0.4)
    return y - 9
