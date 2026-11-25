"""Editorial vector icons and visual keyword modules harmonized with the portfolio palette."""
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics

PAPER = HexColor('#f7f5ef')
SURFACE = HexColor('#f1ede4')
ACCENT_TINT = HexColor('#efe2dd')
ACCENT_BORDER = HexColor('#dec6be')
INK = HexColor('#171512')
MUTED = HexColor('#625e56')
LINE = HexColor('#d4d0c5')
ACCENT = HexColor('#a73524')


def draw_icon(b, name, x, top, size=12, color=ACCENT, line_width=1.65):
    """Draw a minimal 24x24 vector line icon on the PDF canvas."""
    b.track(f'icon:{name}', x, top, size, size, 'icon')
    c = b.c
    c.saveState()
    # Map SVG-like top-down 24x24 coordinates into PDF bottom-up space
    c.translate(x, b.c._pagesize[1] - top)
    c.scale(size / 24.0, -size / 24.0)
    c.setStrokeColor(color)
    c.setFillColor(color)
    c.setLineWidth(line_width)
    c.setLineCap(1)
    c.setLineJoin(1)

    if name == 'chip':
        c.roundRect(6, 6, 12, 12, 2, stroke=1, fill=0)
        c.rect(10, 10, 4, 4, stroke=1, fill=0)
        for p in (9, 15):
            c.line(p, 2.5, p, 6)
            c.line(p, 18, p, 21.5)
            c.line(2.5, p, 6, p)
            c.line(18, p, 21.5, p)
    elif name == 'compare':
        # Opposing sync / verification arrows
        c.line(4, 8.5, 19, 8.5)
        c.line(15.5, 5, 19, 8.5)
        c.line(15.5, 12, 19, 8.5)
        c.line(20, 15.5, 5, 15.5)
        c.line(8.5, 12, 5, 15.5)
        c.line(8.5, 19, 5, 15.5)
    elif name == 'sliders':
        # 3D geometry / MCP parameter control sliders
        c.line(3.5, 6.5, 20.5, 6.5)
        c.line(3.5, 12, 20.5, 12)
        c.line(3.5, 17.5, 20.5, 17.5)
        for cx, cy in ((9, 6.5), (15.5, 12), (10.5, 17.5)):
            c.circle(cx, cy, 2.0, stroke=0, fill=1)
    elif name == 'layers':
        p = c.beginPath()
        p.moveTo(12, 3)
        p.lineTo(21, 7.5)
        p.lineTo(12, 12)
        p.lineTo(3, 7.5)
        p.close()
        c.drawPath(p, stroke=1, fill=0)
        for dy in (4.5, 9):
            p = c.beginPath()
            p.moveTo(3, 7.5 + dy)
            p.lineTo(12, 12 + dy)
            p.lineTo(21, 7.5 + dy)
            c.drawPath(p, stroke=1, fill=0)
    elif name == 'wrench':
        # Diagnostic / troubleshooting check-shield
        p = c.beginPath()
        p.moveTo(12, 2.8)
        p.lineTo(19.5, 5.8)
        p.lineTo(19.5, 11.5)
        p.curveTo(19.5, 16.5, 16.2, 19.6, 12, 21.2)
        p.curveTo(7.8, 19.6, 4.5, 16.5, 4.5, 11.5)
        p.lineTo(4.5, 5.8)
        p.close()
        c.drawPath(p, stroke=1, fill=0)
        p = c.beginPath()
        p.moveTo(8.5, 12.2)
        p.lineTo(11, 14.7)
        p.lineTo(15.8, 9.6)
        c.drawPath(p, stroke=1, fill=0)
    elif name == 'insight':
        # Minimalist lightbulb (top dome at y=3..14, base at y=16.5..21.5)
        p = c.beginPath()
        p.moveTo(9.2, 16.4)
        p.lineTo(9.2, 14.2)
        p.curveTo(6.6, 12.8, 5.6, 10.6, 5.6, 8.6)
        p.curveTo(5.6, 5.0, 8.4, 2.6, 12.0, 2.6)
        p.curveTo(15.6, 2.6, 18.4, 5.0, 18.4, 8.6)
        p.curveTo(18.4, 10.6, 17.4, 12.8, 14.8, 14.2)
        p.lineTo(14.8, 16.4)
        p.close()
        c.drawPath(p, stroke=1, fill=0)
        c.line(9.4, 19.1, 14.6, 19.1)
        c.line(10.5, 21.4, 13.5, 21.4)

    c.restoreState()


def draw_rounded_box(b, x, top, width, height, radius=4, fill=SURFACE, stroke=LINE, stroke_width=0.6):
    """Draw a decorative editorial box (untracked background container)."""
    c = b.c
    H = c._pagesize[1]
    c.saveState()
    if fill is not None:
        c.setFillColor(fill)
    if stroke is not None:
        c.setStrokeColor(stroke)
        c.setLineWidth(stroke_width)
    c.roundRect(x, H - top - height, width, height, radius,
                stroke=1 if stroke is not None else 0,
                fill=1 if fill is not None else 0)
    c.restoreState()


def draw_flow_arrow(b, x1, x2, mid_y, color=ACCENT):
    """Crisp editorial flow connector arrow between pipeline cards."""
    c = b.c
    H = c._pagesize[1]
    y = H - mid_y
    c.saveState()
    c.setStrokeColor(color)
    c.setLineWidth(1.1)
    c.setLineCap(1)
    c.setLineJoin(1)
    c.line(x1, y, x2, y)
    c.line(x2 - 3.6, y + 2.8, x2, y)
    c.line(x2 - 3.6, y - 2.8, x2, y)
    c.restoreState()


def section_heading(b, icon_name, label, x, top, width):
    """Section heading with a small harmonized terracotta line icon."""
    icon_size = 12.5
    draw_icon(b, icon_name, x, top + 3.0, size=icon_size, color=ACCENT, line_width=1.7)
    return b.para(label, x + icon_size + 6.5, top, width - icon_size - 6.5, 12.2, 17, bold=True)


def flow_strip(b, steps, x, top, width, height=54, gap=18):
    """3-step horizontal architecture flow with minimal icons and concise descriptors."""
    n = len(steps)
    card_w = (width - gap * (n - 1)) / n
    for i, (icon_name, title, subtitle) in enumerate(steps):
        cx = x + i * (card_w + gap)
        draw_rounded_box(b, cx, top, card_w, height, radius=4, fill=SURFACE, stroke=LINE, stroke_width=0.6)
        # Subtle tinted icon badge
        draw_rounded_box(b, cx + 8, top + 8, 19, 19, radius=3, fill=ACCENT_TINT, stroke=None)
        draw_icon(b, icon_name, cx + 11.5, top + 11.5, size=12, color=ACCENT, line_width=1.65)
        b.text(title, cx + 33, top + 13.2, size=9.5, font='KoreanBold', color=INK)
        b.para(subtitle, cx + 8, top + 34.0, card_w - 16, 9.0, 12.5, MUTED, keep_words=True)
        if i + 1 < n:
            draw_flow_arrow(b, cx + card_w + 3.5, cx + card_w + gap - 3.5, top + height / 2, color=ACCENT)
    return top + height


def keyword_tag(b, icon_name, label, x, top, width=88, height=20):
    """Compact left-rail visual keyword chip aligned with a contribution row."""
    draw_rounded_box(b, x, top, width, height, radius=3, fill=ACCENT_TINT, stroke=ACCENT_BORDER, stroke_width=0.5)
    draw_icon(b, icon_name, x + 6, top + 4.5, size=11, color=ACCENT, line_width=1.6)
    b.text(label, x + 21, top + 6.0, size=9.0, font='KoreanBold', color=INK)


def inline_transition_strip(b, issue_tag, solution_tag, x, top, max_width):
    """Compact Problem -> Solution keyword chips inside a troubleshooting card."""
    pad_x, chip_h = 6, 17
    w1 = pdfmetrics.stringWidth(issue_tag, 'Korean', 9.0) + pad_x * 2
    w2 = pdfmetrics.stringWidth(solution_tag, 'KoreanBold', 9.0) + pad_x * 2
    arrow_w = 14
    if w1 + arrow_w + w2 > max_width:
        pad_x = 4.5
        w1 = pdfmetrics.stringWidth(issue_tag, 'Korean', 9.0) + pad_x * 2
        w2 = pdfmetrics.stringWidth(solution_tag, 'KoreanBold', 9.0) + pad_x * 2
        arrow_w = 12
    # Issue chip (quiet paper + hairline border)
    draw_rounded_box(b, x, top, w1, chip_h, radius=2.5, fill=PAPER, stroke=LINE, stroke_width=0.55)
    b.text(issue_tag, x + pad_x, top + 4.4, size=9.0, font='Korean', color=MUTED)
    # Arrow
    draw_flow_arrow(b, x + w1 + 2.5, x + w1 + arrow_w - 2.5, top + chip_h / 2, color=ACCENT)
    # Solution chip (warm terracotta tint)
    x2 = x + w1 + arrow_w
    draw_rounded_box(b, x2, top, w2, chip_h, radius=2.5, fill=ACCENT_TINT, stroke=ACCENT_BORDER, stroke_width=0.5)
    b.text(solution_tag, x2 + pad_x, top + 4.4, size=9.0, font='KoreanBold', color=ACCENT)
    return top + chip_h
