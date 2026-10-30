"""Face track for the round photo stickers: the face centre and width on every source frame (frames/%05d.jpg), so the stickers on the
full-screen pages can play the live footage with his face kept in the circle while he walks into frame.
OpenCV Haar frontal-face detector on half-size frames, largest face per frame, small gaps filled, then smoothed.
Writes edit/face.json: {"fps": 30, "face": [[cx, cy, w] or null per frame]} in 1080x1920 page pixels.
Run (needs opencv-python-headless 4.x on PYTHONPATH): $LIB/.venv/bin/python tools/facetrack.py"""
import os, json, glob
import numpy as np, cv2

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
files = sorted(glob.glob(os.path.join(ROOT, 'frames', '*.jpg')))
det = cv2.CascadeClassifier(os.path.join(cv2.data.haarcascades, 'haarcascade_frontalface_default.xml'))
raw = []
for f in files:
    g = cv2.cvtColor(cv2.resize(cv2.imread(f), (540, 960)), cv2.COLOR_BGR2GRAY)
    g = cv2.equalizeHist(g)
    faces = det.detectMultiScale(g, scaleFactor=1.08, minNeighbors=6, minSize=(70, 70))
    if len(faces):
        x, y, w, h = max(faces, key=lambda r: r[2] * r[3])
        raw.append([2 * (x + w / 2), 2 * (y + h / 2), 2 * w])
    else:
        raw.append(None)
n = len(raw)
# frames at the start of a take where he is not in shot yet and the detector finds shapes in the window or his hair: no face
BLANK = [(6.77, 7.45), (15.73, 16.05), (23.3, 23.95), (29.3, 30.42), (38.75, 41.95)]
for a, b in BLANK:
    for i in range(int(a * 30), min(n, int(b * 30) + 1)): raw[i] = None
# reject one-frame jumps (false detections): a face far from both neighbours' faces
for i in range(1, n - 1):
    a, b, c = raw[i - 1], raw[i], raw[i + 1]
    if b and a and c and np.hypot(b[0] - a[0], b[1] - a[1]) > 160 and np.hypot(b[0] - c[0], b[1] - c[1]) > 160: raw[i] = None
# fill gaps of up to 12 frames by interpolation; longer gaps stay empty (no face in frame)
arr = [None] * n
idx = [i for i in range(n) if raw[i]]
for i in range(n):
    if raw[i]: arr[i] = raw[i]; continue
    lo = max([j for j in idx if j < i], default=None); hi = min([j for j in idx if j > i], default=None)
    if lo is not None and hi is not None and hi - lo <= 12:
        u = (i - lo) / (hi - lo); arr[i] = [raw[lo][k] * (1 - u) + raw[hi][k] * u for k in range(3)]
# smooth each run of frames with a face (centred moving average, 7 frames)
out = [None] * n; i = 0
while i < n:
    if arr[i] is None: i += 1; continue
    j = i
    while j < n and arr[j] is not None: j += 1
    run = np.array(arr[i:j]); k = 7; pad = np.pad(run, ((k // 2, k // 2), (0, 0)), mode='edge')
    sm = np.stack([np.convolve(pad[:, c], np.ones(k) / k, 'valid') for c in range(3)], 1)
    for m in range(i, j): out[m] = [round(float(v), 1) for v in sm[m - i]]
    i = j
json.dump({'fps': 30, 'face': out}, open(os.path.join(ROOT, 'edit', 'face.json'), 'w'))
print('frames', n, '| detected', len(idx), '| with a face after filling', sum(o is not None for o in out))
for a, b in [(6.8, 9.9), (23.2, 25.0), (29.3, 32.0), (37.2, 41.9)]:
    seg = out[int(a * 30):int(b * 30)]
    first = next((int(a * 30) + m for m, o in enumerate(seg) if o), None)
    print(f'{a:5.1f}-{b:5.1f}: face from {first / 30 if first else None}, missing {sum(o is None for o in seg)} of {len(seg)} frames')
