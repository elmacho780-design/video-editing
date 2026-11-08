"""Quality check of the final file against the original camera file. Answers three questions:
1. Is the footage unchanged? PSNR (luma) of every output frame against the same source frame (flipped), measured only on the pixels the
   graphics layer leaves fully transparent. Over 45 dB is visually lossless; the camera's own HEVC is the reference.
2. Is every frame in its place? For every 5th frame, the source frame that matches best must be the same frame (no drops, no
   duplicates, no offset), and no two consecutive output frames of the take may be identical where the source frames differ.
3. Is the sound in sync? The cross-correlation of the final audio with the source audio must peak at 0 ms.
Optional: --compare other.mp4 [frames] measures another encode of the same take the same way (e.g. a simulation of the old pipeline).
Run from the project folder: $LIB/.venv/bin/python tools/fidelity.py [renders/hml-weekend-reel.mp4] [--compare file.mp4 N]"""
import sys, subprocess, numpy as np
W, H, NSRC = 1080, 1920, 979
FS = W * H
args = sys.argv[1:]; final = args[0] if args and not args[0].startswith('--') else 'renders/hml-weekend-reel.mp4'

def pipe(cmd):
    return subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, bufsize=FS * 4)
def frames(p):
    while True:
        b = p.stdout.read(FS)
        if len(b) < FS: return
        yield np.frombuffer(b, np.uint8).reshape(H, W)
gray = ['-f', 'rawvideo', '-pix_fmt', 'gray', '-']
psnr = lambda a, b, m: 10 * np.log10(255 ** 2 / max(((a[m].astype(np.float32) - b[m]) ** 2).mean(), 1e-6))

def measure(path, n, with_mask=True):
    src = frames(pipe(['ffmpeg', '-nostdin', '-i', 'src/take.mov', '-vf', 'hflip', '-frames:v', str(n)] + gray))
    out = frames(pipe(['ffmpeg', '-nostdin', '-i', path, '-frames:v', str(n)] + gray))
    ova = frames(pipe(['ffmpeg', '-nostdin', '-i', 'out/overlay.mkv', '-vf', 'alphaextract', '-frames:v', str(n)] + gray)) if with_mask else None
    res, prev_s, prev_o, align_bad, frozen = [], None, None, [], []
    hist = []
    for i, (s, o) in enumerate(zip(src, out)):
        a = next(ova) if ova else None
        m = (a == 0) if a is not None else np.ones_like(s, bool)
        cover = 1 - m.mean()
        if m.mean() > 0.2: res.append((i, psnr(o, s, m), cover))
        if prev_o is not None and np.array_equal(o, prev_o) and not np.array_equal(s, prev_s): frozen.append(i)
        hist.append(s); hist = hist[-3:]
        if i % 5 == 0 and i >= 2 and m.mean() > 0.5 and len(hist) == 3:
            e = [((o[m].astype(np.float32) - h[m]) ** 2).mean() for h in hist]   # s(i-2), s(i-1), s(i)
            if int(np.argmin(e)) != 2 and e[2] > 1.05 * min(e): align_bad.append((i, [round(x, 1) for x in e]))
        prev_s, prev_o = s, o
    return res, align_bad, frozen

if '--compare' in args:
    k = args.index('--compare'); other = args[k + 1]; n = int(args[k + 2]) if len(args) > k + 2 else 300
    res, _, _ = measure(other, n, with_mask=False)
    v = np.array([p for _, p, _ in res]); print(f'{other}: {len(v)} frames, PSNR vs the original: mean {v.mean():.1f} dB, min {v.min():.1f} dB')
    res, _, _ = measure(final, n, with_mask=True)
    v = np.array([p for _, p, _ in res]); print(f'{final}: same frames, PSNR vs the original (untouched pixels): mean {v.mean():.1f} dB, min {v.min():.1f} dB')
    sys.exit()

res, align_bad, frozen = measure(final, NSRC)
v = np.array([p for _, p, _ in res])
print(f'1. footage fidelity: {len(v)} of {NSRC} frames measured (the rest are mostly covered by the full-screen wall)')
print(f'   PSNR on untouched pixels: mean {v.mean():.1f} dB, min {v.min():.1f} dB (frame {res[int(v.argmin())][0]}), frames under 45 dB: {(v < 45).sum()}')
print(f'2. frame order: {len(align_bad)} misplaced frames {align_bad[:5]}; {len(frozen)} frozen frames {frozen[:10]}')
sr = 8000
def audio(path):
    b = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', path, '-af', 'pan=mono|c0=c0', '-ar', str(sr), '-t', '32', '-f', 'f32le', '-'], capture_output=True).stdout
    return np.frombuffer(b, np.float32)
x, y = audio('src/take.mov'), audio(final); L = min(len(x), len(y)); x, y = x[:L] - x[:L].mean(), y[:L] - y[:L].mean()
lag = np.argmax(np.correlate(y[sr * 2:sr * 30], x[sr * 2 - 400:sr * 30 + 400], 'valid')) - 400
print(f'3. audio sync: offset {lag * 1000 / sr:+.1f} ms')
n = subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames,r_frame_rate', '-of', 'csv=p=0', final], capture_output=True, text=True).stdout.strip()
print(f'   output frames, rate: {n}')
