"""Restrained Swiss-editorial visual structure for project pages.

Follows Kill AI Slop principles: zero decorative icons, zero tinted pills,
zero nested cards; hierarchy comes from scale, weight, alignment, hairlines,
and purposeful whitespace using only the portfolio's existing palette tokens.
"""
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics

INK = HexColor('#171512')
MUTED = HexColor('#625e56')
LINE = HexColor('#d4d0c5')
ACCENT = HexColor('#a73524')


def _arrow(b, x1, x2, mid_y, color=LINE, head_color=MUTED):
    """Minimal directional line between genuinely ordered pipeline stages."""
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
    """Unboxed horizontal sequence for genuinely ordered system stages (01 -> 02 -> 03)."""
    n = len(steps)
    col_w = (width - col_gap * (n - 1)) / n
    num_size = 9.2
    line_y = top + 5.9

    for i, (title, subtitle) in enumerate(steps):
        cx = x + i * (col_w + col_gap)
        ordinal = f'{i + 1:02d}'
        ord_w = pdfmetrics.stringWidth(ordinal, 'Helvetica-Bold', num_size)
        b.text(ordinal, cx, top, size=num_size, font='Helvetica-Bold', color=ACCENT)
        if i + 1 < n:
            next_x = x + (i + 1) * (col_w + col_gap)
            _arrow(b, cx + ord_w + 8, next_x - 8, line_y, color=LINE, head_color=MUTED)
        else:
            b.rule(line_y, cx + ord_w + 8, col_w - ord_w - 8, LINE, 0.75)

        title_end = b.para(title, cx, top + 16, col_w, 10.6, 14.5, INK, bold=True, keep_words=True)
        b.para(subtitle, cx, title_end + 2.5, col_w, 9.2, 13, MUTED, keep_words=True)

    return top + 49


def transition_line(b, issue, solution, x, top, width):
    """Plain typographic Problem -> Solution line with exact baseline alignment."""
    size = 9.2
    w1 = pdfmetrics.stringWidth(issue, 'Korean', size)
    arrow_gap = 18
    b.text(issue, x, top, size=size, font='Korean', color=MUTED)
    _arrow(b, x + w1 + 4, x + w1 + arrow_gap - 4, top + 5.7, color=ACCENT, head_color=ACCENT)
    b.text(solution, x + w1 + arrow_gap, top, size=size, font='KoreanBold', color=INK)
    return top + size * 1.25
