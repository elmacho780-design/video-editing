# Cut the HML beagle out of its baked-in checkerboard background.
# The checkerboard squares are neutral light greys; the beagle's cream fur is warm, so a flood fill
# from the image border over neutral pixels removes the background without eating the fur.
import sys
from collections import deque

import numpy as np
from PIL import Image, ImageFilter

src, out = sys.argv[1], sys.argv[2]
rgb = Image.open(src).convert('RGB')
im = np.asarray(rgb).astype(int)
h, w, _ = im.shape
neutral = (im.max(2) - im.min(2) <= 7) & (im.min(2) >= 228)

mask = np.zeros((h, w), bool)
q = deque()
for x in range(w):
    for y in (0, h - 1):
        if neutral[y, x]:
            mask[y, x] = True
            q.append((y, x))
for y in range(h):
    for x in (0, w - 1):
        if neutral[y, x] and not mask[y, x]:
            mask[y, x] = True
            q.append((y, x))
while q:
    y, x = q.popleft()
    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        ny, nx = y + dy, x + dx
        if 0 <= ny < h and 0 <= nx < w and not mask[ny, nx] and neutral[ny, nx]:
            mask[ny, nx] = True
            q.append((ny, nx))

alpha = Image.fromarray(np.where(mask, 0, 255).astype(np.uint8))
alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.1))
rgba = rgb.convert('RGBA')
rgba.putalpha(alpha)
rgba = rgba.crop(rgba.getbbox())
rgba.save(out)
print('saved', out, rgba.size, 'background fraction', round(float(mask.mean()), 3))
