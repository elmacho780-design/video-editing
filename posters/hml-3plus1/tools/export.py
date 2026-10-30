"""Print and share exports of the rendered poster PNG.
export.py <poster.png> <outdir>
  HML_3plus1_A3.pdf        A3 (297 x 420 mm), the full-resolution image placed edge to edge
  HML_3plus1_share.jpg     1600 px wide, for messages and social posts
"""
import sys, os
import pymupdf
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
mm = 72 / 25.4
doc = pymupdf.open()
page = doc.new_page(width=297 * mm, height=420 * mm)
page.insert_image(page.rect, filename=src)
doc.set_metadata({'title': 'HML 3+1 poster', 'author': 'HML Academy (Higher Mind Learning)'})
doc.save(os.path.join(out, 'HML_3plus1_A3.pdf'), deflate=True)
im = Image.open(src).convert('RGB')
im.resize((1600, round(1600 * im.height / im.width)), Image.LANCZOS).save(os.path.join(out, 'HML_3plus1_share.jpg'), quality=92, optimize=True)
for n in sorted(os.listdir(out)): print(n, os.path.getsize(os.path.join(out, n)) // 1024, 'KB')
