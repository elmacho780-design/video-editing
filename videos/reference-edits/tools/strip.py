"""strip.py video t0 seconds every_nth crop(w:h:x:y|full) cols out.jpg [thumb_w]
Consecutive 60 fps frames from t0, cropped and tiled with absolute time and frame number, for frame-by-frame study."""
import sys, subprocess, tempfile, glob, os
from PIL import Image, ImageDraw, ImageFont
v, t0, d, n, crop, cols, out = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]), int(sys.argv[4]), sys.argv[5], int(sys.argv[6]), sys.argv[7]
w = int(sys.argv[8]) if len(sys.argv) > 8 else 240
tmp = tempfile.mkdtemp()
vf = 'fps=60,' + ('' if crop == 'full' else f'crop={crop},') + f'scale={w}:-2'
subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-y', '-ss', str(t0), '-i', v, '-t', str(d), '-vf', vf, '-fps_mode', 'passthrough', f'{tmp}/%04d.png'], check=True)
fs = sorted(glob.glob(f'{tmp}/*.png'))[::n]
ims = [Image.open(f) for f in fs]
W, H = ims[0].size; rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * (W + 4), rows * (H + 4)), 'white')
font = ImageFont.load_default(size=14)
for i, im in enumerate(ims):
    x, y = (i % cols) * (W + 4), (i // cols) * (H + 4)
    sheet.paste(im, (x, y))
    k = i * n; t = t0 + k / 60
    ImageDraw.Draw(sheet).rectangle([x, y, x + 92, y + 17], fill='black')
    ImageDraw.Draw(sheet).text((x + 3, y + 1), f'{t:.3f} +{k}', fill='yellow', font=font)
sheet.save(out, quality=88)
for f in glob.glob(f'{tmp}/*'): os.remove(f)
os.rmdir(tmp)
print(out, len(ims), 'frames')
