"""Voice track: the kept source ranges (same cut list as src/edit.js) joined with 10 ms fades, the off-camera shout lifted,
then high-passed, lightly compressed and levelled. Writes audio/out/voice.wav (48 kHz stereo).
Run: $LIB/.venv/bin/python audio/voice.py"""
import os, sys, json, subprocess
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
from core.audio.sfx import SR

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
KEEP = [[0.95, 9.27], [9.53, 13.55], [13.95, 26.0], [26.3, 28.58], [28.82, 46.0]]
SHOUT = (35.28, 36.74)
DUR = json.load(open(os.path.join(ROOT, 'edit', 'events.json')))['dur']

raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'footage.mov'), '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
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

out = sosfilt(butter(2, 85, 'high', fs=SR, output='sos'), out)
# presence: a gentle 3 kHz lift for clarity on phone speakers
pres = sosfilt(butter(2, [2200, 5000], 'band', fs=SR, output='sos'), out); out = out + 0.25 * pres
# smooth RMS compressor (3:1 above -24 dBFS), then level to -20 dBFS RMS on speech
env = np.sqrt(np.convolve(out ** 2, np.ones(int(0.03 * SR)) / int(0.03 * SR), 'same')) + 1e-9
lv = 20 * np.log10(env); gr = np.where(lv > -24, (-24 - lv) * (1 - 1 / 3), 0)
gr = np.convolve(gr, np.ones(int(0.01 * SR)) / int(0.01 * SR), 'same')
out = out * 10 ** (gr / 20)
speech = env > np.percentile(env, 60)
out *= 10 ** ((-20 - 20 * np.log10(np.sqrt((out[speech] ** 2).mean()))) / 20)
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'voice.wav'), np.stack([out, out], 1).astype(np.float32), SR, subtype='PCM_24')
print('voice', len(out) / SR, 's, peak', round(20 * np.log10(np.abs(out).max()), 1), 'dBFS')
