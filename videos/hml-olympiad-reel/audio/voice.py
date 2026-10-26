"""Voice track: her original recording, untouched apart from the cuts (same cut list as src/edit.js, joined with 10 ms fades)
and a lift on the off-camera shout. No EQ, no compression, no re-levelling: it should sound exactly like the original.
Writes audio/out/voice.wav (48 kHz stereo). Run: $LIB/.venv/bin/python audio/voice.py"""
import os, sys, json, subprocess
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
from core.audio.sfx import SR

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
KEEP = [[0.0, 9.27], [9.53, 13.55], [13.95, 26.0], [26.3, 28.58], [28.82, 46.0]]
SHOUT = (35.28, 36.74)
DUR = json.load(open(os.path.join(ROOT, 'edit', 'events.json')))['dur']

raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'footage.mov'), '-af', 'pan=mono|c0=c0,aresample=48000:resampler=soxr:precision=28', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).astype(np.float64)
# lift the shout from behind the camera (it was recorded far from the mic)
a, b = int(SHOUT[0] * SR), int(SHOUT[1] * SR); g = np.ones_like(x)
ramp = int(0.03 * SR); g[a:b] = 10 ** (7 / 20); g[a - ramp:a] = np.linspace(1, g[a], ramp); g[b:b + ramp] = np.linspace(g[a], 1, ramp)
x = x * g

out = np.zeros(int(DUR * SR) + SR)
pos = 0; f = int(0.01 * SR)
for s, e in KEEP:
    seg = x[int(s * SR):int(e * SR)].copy()
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    out[pos:pos + len(seg)] += seg; pos += len(seg)
out = out[:int(DUR * SR)]

os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'voice.wav'), np.stack([out, out], 1).astype(np.float32), SR, subtype='PCM_24')
print('voice', len(out) / SR, 's, peak', round(20 * np.log10(np.abs(out).max()), 1), 'dBFS')
