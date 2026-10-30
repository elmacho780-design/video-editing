"""Voice track: his original recording, untouched apart from the cuts (the cut list exported by src/edit.js), joined with 10 ms fades.
No EQ, no compression, no re-levelling: it should sound exactly like the original. The phone recorded the same signal on both
channels, so one channel is taken as it is (pan=mono|c0=c0; never -ac 1, which sums them 3 dB hotter).
Writes audio/out/voice.wav (48 kHz stereo). Run: $LIB/.venv/bin/python audio/voice.py"""
import os, sys, json, subprocess
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio.sfx import SR

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json')))
DUR = E['dur']; KEEP = next(e['keep'] for e in E['ev'] if e['type'] == 'keep')

raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'footage.mov'), '-af', 'pan=mono|c0=c0,aresample=48000:resampler=soxr:precision=28', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).astype(np.float64)
out = np.zeros(int(DUR * SR) + SR); pos = 0; f = int(0.01 * SR)
for s, e in KEEP:
    seg = x[int(round(s * SR)):int(round(e * SR))].copy()
    seg[:f] *= np.linspace(0, 1, f); seg[-f:] *= np.linspace(1, 0, f)
    out[pos:pos + len(seg)] += seg; pos += len(seg)
out = out[:int(DUR * SR)]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'voice.wav'), np.stack([out, out], 1).astype(np.float32), SR, subtype='PCM_24')
print('voice', round(len(out) / SR, 2), 's, speech ends at', round(pos / SR, 2), 's, peak', round(20 * np.log10(np.abs(out).max()), 1), 'dBFS')
