"""Final audio: the basketball hook (its own sound, lifted, plus a whoosh on the camera whip and an impact as the ball hits the lens)
followed by the edit's mix, mastered to -14 LUFS with one plain gain and a gentle look-ahead peak limiter (no dynamic loudness processing).
Writes audio/out/final.wav (48 kHz). Run after audio/score.py: $LIB/.venv/bin/python audio/final.py
"Ending first" version: HOOK=0 ROTATE=33.1667 (no basketball hook; the mix from frame 995 = 33.17 s, the crash zoom, moves to the front, then 0 to 33.13 s)."""
import os, sys, re, subprocess
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sfx as X
from core.audio.sfx import SR, add, limit

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
HOOK_FRAMES = 121                                   # the hook clip is 121 frames at 30 fps
HOOK = HOOK_FRAMES / 30

raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'hook.mp4'), '-ac', '2', '-af', 'aresample=48000:resampler=soxr:precision=28', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
hook = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
n = int(round(HOOK * SR)); hook = np.vstack([hook, np.zeros((max(0, n - len(hook)), 2))])[:n] * 10 ** (10 / 20)   # the clip was recorded very quietly
add(hook, X.whoosh(0.45, 1.0), 2.52, 0.35, 0.2)                                      # the camera whips up to the sky
add(hook, X.whoosh(0.35, 1.0), 3.62, 0.4, 0)                                          # the ball flies at the lens
add(hook, X.thump(1.0, 70), 3.97, 0.45, 0); add(hook, X.pop(1.0), 3.97, 0.22, 0)        # and hits it
hook[-int(0.004 * SR):] *= np.linspace(1, 0, int(0.004 * SR))[:, None]; hook[:int(0.02 * SR)] *= np.linspace(0, 1, int(0.02 * SR))[:, None]

mix, _ = sf.read(os.path.join(OUT, 'mix.wav'), dtype='float64')
ROT = float(os.environ.get('ROTATE', 0))
if ROT:
    k = int(round(ROT * SR)); f = int(0.005 * SR)
    a, b = mix[k:].copy(), mix[:k].copy()
    for seg in (a, b): seg[:f] *= np.linspace(0, 1, f)[:, None]; seg[-f:] *= np.linspace(1, 0, f)[:, None]
    mix = np.vstack([a, b])
full = np.vstack([hook, mix]) if os.environ.get('HOOK', '1') != '0' else mix
sf.write(os.path.join(OUT, 'final_raw.wav'), full.astype(np.float32), SR, subtype='FLOAT')
meas = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-i', os.path.join(OUT, 'final_raw.wav'), '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', meas)[-1])
g = 10 ** ((-14.0 - I) / 20)
ceil = 10 ** (-1.3 / 20)
y = np.stack([limit(full[:, 0] * g, ceil), limit(full[:, 1] * g, ceil)], 1)
red = 20 * np.log10(np.maximum(np.abs(y).max(1), 1e-9) / np.maximum(np.abs(full * g).max(1), 1e-9))
sf.write(os.path.join(OUT, 'final.wav'), y.astype(np.float32), SR, subtype='PCM_24')
print(f'final {len(y) / SR:.2f} s | raw {I:.1f} LUFS, gain {20 * np.log10(g):+.1f} dB | limiter touched {100 * (red < -0.1).mean():.2f}% of samples, max {red.min():.1f} dB')
