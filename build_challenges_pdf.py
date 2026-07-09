"""Generate a review PDF of all Challenge Tre3 challenges, grouped by category,
with every editable field shown. Source: challenges.json (from seed.ts)."""
import json
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether,
    Table, TableStyle, ListFlowable, ListItem,
)

GREEN = colors.HexColor('#1b4332')
GREEN_MID = colors.HexColor('#2d6a4f')
GOLD = colors.HexColor('#c8952a')
GREY = colors.HexColor('#6b7280')
LIGHT = colors.HexColor('#f3f3f1')

CAT_ORDER = ['WATER','FOOD','ENERGY','TRANSPORT','WASTE','CONSUMPTION',
             'BIODIVERSITY','CIRCULAR_ECONOMY','COMMUNITY','SOCIAL_EQUITY',
             'CLIMATE_ADVOCACY','WELLBEING']
CAT_NAME = {
    'WATER':'Water','FOOD':'Food','ENERGY':'Energy','TRANSPORT':'Transport',
    'WASTE':'Waste','CONSUMPTION':'Consumption','BIODIVERSITY':'Biodiversity',
    'CIRCULAR_ECONOMY':'Circular Economy','COMMUNITY':'Community',
    'SOCIAL_EQUITY':'Social Equity','CLIMATE_ADVOCACY':'Climate Advocacy',
    'WELLBEING':'Wellbeing',
}

def rt(text):
    """Escape XML and fix the CO2 subscript (reportlab fonts lack the glyph)."""
    if text is None:
        text = ''
    s = str(text).replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    s = s.replace('CO₂', 'CO<sub>2</sub>')
    return s

challenges = json.load(open('challenges.json', encoding='utf-8'))

styles = getSampleStyleSheet()
h_title = ParagraphStyle('TT', parent=styles['Title'], textColor=GREEN, fontSize=26, spaceAfter=12)
h_sub   = ParagraphStyle('TS', parent=styles['Normal'], textColor=GREY, fontSize=11, alignment=1, spaceAfter=2)
h_cat   = ParagraphStyle('CAT', parent=styles['Heading1'], textColor=colors.white, fontSize=15,
                         backColor=GREEN, borderPadding=(6,8,6,8), spaceBefore=10, spaceAfter=10, leading=20)
s_title = ParagraphStyle('CTITLE', parent=styles['Heading2'], textColor=GREEN, fontSize=12.5,
                         spaceBefore=2, spaceAfter=2, leading=15)
s_meta  = ParagraphStyle('META', parent=styles['Normal'], textColor=GOLD, fontSize=8.5,
                         spaceAfter=4, leading=11)
s_body  = ParagraphStyle('BODY', parent=styles['Normal'], fontSize=9.5, leading=13, spaceAfter=3)
s_label = ParagraphStyle('LBL', parent=styles['Normal'], fontSize=8.5, leading=12,
                         textColor=GREEN_MID, spaceBefore=2)
s_li    = ParagraphStyle('LI', parent=styles['Normal'], fontSize=9, leading=12)
s_foot  = ParagraphStyle('FT', parent=styles['Normal'], fontSize=8, textColor=GREY, alignment=1)

def bullets(items):
    lis = [ListItem(Paragraph(rt(i), s_li), leftIndent=10) for i in (items or [])]
    return ListFlowable(lis, bulletType='bullet', start='•', leftIndent=12,
                        bulletColor=GOLD, bulletFontSize=7)

def label_line(label, text):
    return Paragraph(f'<font color="#2d6a4f"><b>{label}:</b></font> {rt(text)}', s_body)

story = []

# ---- Title page ----
story.append(Spacer(1, 60*mm))
story.append(Paragraph('Challenge Tre3', h_title))
story.append(Paragraph('Challenge Library, full review copy', h_sub))
story.append(Spacer(1, 6))
story.append(Paragraph(f'{len(challenges)} challenges across {len(CAT_ORDER)} categories', h_sub))
story.append(Spacer(1, 2))
story.append(Paragraph('Casuarina Consulting', h_sub))

# ---- Category summary table ----
counts = {}
for c in challenges:
    counts[c['category']] = counts.get(c['category'], 0) + 1
rows = [[Paragraph('<b>Category</b>', s_li), Paragraph('<b>Challenges</b>', s_li)]]
for cat in CAT_ORDER:
    rows.append([Paragraph(CAT_NAME.get(cat, cat), s_li), Paragraph(str(counts.get(cat, 0)), s_li)])
summary = Table(rows, colWidths=[90*mm, 40*mm])
summary.setStyle(TableStyle([
    ('BACKGROUND', (0,0), (-1,0), GREEN),
    ('TEXTCOLOR', (0,0), (-1,0), colors.white),
    ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#d9d9d6')),
    ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, LIGHT]),
    ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ('LEFTPADDING', (0,0), (-1,-1), 8), ('TOPPADDING', (0,0), (-1,-1), 4),
    ('BOTTOMPADDING', (0,0), (-1,-1), 4),
]))
story.append(Spacer(1, 16))
story.append(summary)
story.append(PageBreak())

# ---- Challenges by category ----
for cat in CAT_ORDER:
    items = [c for c in challenges if c['category'] == cat]
    if not items:
        continue
    story.append(Paragraph(f'{CAT_NAME.get(cat, cat)} &nbsp;({len(items)})', h_cat))
    for n, c in enumerate(items, 1):
        block = []
        block.append(Paragraph(f'{n}. {rt(c["title"])}', s_title))
        meta = f'Difficulty {c.get("difficulty","-")} &nbsp;|&nbsp; {c.get("timeEstimate","-")} min &nbsp;|&nbsp; {rt(c.get("costLevel","-"))} &nbsp;|&nbsp; {rt(c.get("region","-"))}'
        block.append(Paragraph(meta, s_meta))
        block.append(Paragraph(rt(c.get('description','')), s_body))
        if c.get('instructions'):
            block.append(Paragraph('<font color="#2d6a4f"><b>Instructions</b></font>', s_label))
            block.append(bullets(c['instructions']))
        if c.get('educationalText'):
            block.append(label_line('Why it matters', c['educationalText']))
        if c.get('tips'):
            block.append(Paragraph('<font color="#2d6a4f"><b>Tips</b></font>', s_label))
            block.append(bullets(c['tips']))
        if c.get('barriers'):
            block.append(label_line('Barriers', ', '.join(c['barriers'])))
        ie = c.get('impactEstimate', {}) or {}
        impact = f'CO<sub>2</sub> {ie.get("co2",0)} kg &nbsp;|&nbsp; Water {ie.get("water",0)} L &nbsp;|&nbsp; Waste {ie.get("waste",0)} kg'
        block.append(label_line('Impact (per completion)', '') )
        block.append(Paragraph(impact, s_body))
        block.append(Spacer(1, 8))
        story.append(KeepTogether(block))
    story.append(PageBreak())

def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(GREY)
    canvas.drawCentredString(A4[0]/2, 12*mm, f'Challenge Tre3  ·  Casuarina Consulting  ·  page {doc.page}')
    canvas.restoreState()

doc = SimpleDocTemplate('challenges.pdf', pagesize=A4,
                        leftMargin=18*mm, rightMargin=18*mm,
                        topMargin=16*mm, bottomMargin=20*mm,
                        title='Challenge Tre3 Challenge Library')
doc.build(story, onFirstPage=footer, onLaterPages=footer)
print('built challenges.pdf')
