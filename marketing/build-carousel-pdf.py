"""Assemble the LinkedIn carousel PDF from the rendered slide PNGs.

Each slide PNG (2160x2160 px, rendered at 2x) becomes one square PDF page,
drawn full-bleed. This keeps the PDF pixel-identical to the verified slides.
"""
import glob
import os

from reportlab.pdfgen import canvas
from pypdf import PdfReader

DIR = os.path.dirname(os.path.abspath(__file__))
SLIDES = sorted(glob.glob(os.path.join(DIR, "linkedin-carousel-slides", "slide-*.png")))
OUT = os.path.join(DIR, "challenge-tre3-linkedin-carousel.pdf")

PAGE = 1080  # points; square pages, LinkedIn only cares about aspect ratio

assert SLIDES, "no slide PNGs found"

c = canvas.Canvas(OUT, pagesize=(PAGE, PAGE))
c.setTitle("Challenge Tre3, three small things a day")
c.setAuthor("Casuarina Consulting")
for png in SLIDES:
    c.drawImage(png, 0, 0, width=PAGE, height=PAGE)
    c.showPage()
c.save()

reader = PdfReader(OUT)
box = reader.pages[0].mediabox
print(f"OK: {len(reader.pages)} pages, {box.width}x{box.height} pt, "
      f"{os.path.getsize(OUT) / 1024 / 1024:.1f} MB")
print(OUT)
