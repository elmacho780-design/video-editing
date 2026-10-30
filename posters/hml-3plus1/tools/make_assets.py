"""Poster assets from the book PDF and the HML logo.
make_assets.py <book.pdf> <logo.png> <outdir>
  cover.png / back.png   page 1 and the last page at 350 dpi (the book's printed faces)
  logo.png               the logo without the "Daily English" line, white keyed out to true alpha
  brain.png              the brain-tree mark alone, same keying
"""
import sys, os
import numpy as np
import pymupdf
from PIL import Image

pdf, logo_path, out = sys.argv[1:4]
os.makedirs(out, exist_ok=True)
d = pymupdf.open(pdf)
for name, i in (('cover', 0), ('back', d.page_count - 1)):
    pm = d[i].get_pixmap(dpi=350)
    pm.save(os.path.join(out, name + '.png'))
    print(name, pm.width, pm.height)


def unwhite(rgb):
    """colour-to-alpha against white: the least alpha that rebuilds each pixel over white, colour un-mixed to match"""
    f = rgb.astype(np.float64) / 255.0
    a = np.clip((1.0 - f).max(axis=2), 0, 1)
    a[a < 0.025] = 0                                   # the JPEG-ish noise in the white field
    safe = np.where(a > 0, a, 1)[..., None]
    c = np.clip((f - (1 - a[..., None])) / safe, 0, 1)
    return np.dstack([c, a]) * 255


src = np.asarray(Image.open(logo_path).convert('RGB'))
rgba = unwhite(src)
ink = rgba[..., 3] > 40
rows = np.where(ink.any(axis=1))[0]
# the rows with ink fall into bands (brain + wordmark, LEARNING, Daily English): keep everything above the last gap
bands, start = [], rows[0]
for a, b in zip(rows[:-1], rows[1:]):
    if b - a > 12: bands.append((start, a)); start = b
bands.append((start, rows[-1]))
print('ink bands (rows):', bands)
assert len(bands) >= 3, 'expected the logo, LEARNING and Daily English as separate bands'
keep_to = bands[-2][1]                                  # the bottom of LEARNING


def crop(img, y0, y1, pad=14):
    a = img[y0:y1 + 1, :, 3] > 20
    ys, xs = np.where(a)
    box = (max(0, xs.min() - pad), max(0, y0 + ys.min() - pad), min(img.shape[1], xs.max() + pad + 1), min(img.shape[0], y0 + ys.max() + pad + 1))
    part = img[box[1]:box[3], box[0]:box[2]].copy()
    part[y1 + 1 - box[1]:, :, 3] = 0                    # nothing below the cut line, even inside the padding
    return Image.fromarray(part.astype(np.uint8), 'RGBA'), box


logo, box = crop(rgba, 0, keep_to)
logo.save(os.path.join(out, 'logo.png')); print('logo', logo.size, box)
# the mark: everything above the wordmark's cap line, i.e. the first band's top part (the brain stops where the letters start)
side = np.ones(rgba.shape[1], bool); side[370:880] = False      # columns clear of the brain: the ascenders of h, d and the caps
wm_top = next(y for y in range(bands[0][0], bands[0][1]) if (rgba[y, side, 3] > 40).any())
brain, box = crop(rgba, bands[0][0], wm_top - 6)
brain.save(os.path.join(out, 'brain.png')); print('brain', brain.size, box)
