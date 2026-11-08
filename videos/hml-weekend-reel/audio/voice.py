"""Voice track: the teacher's original recording, untouched. No cuts (the take plays exactly as filmed), no EQ, no compression,
no re-levelling. The phone recorded the same signal on both channels (they are identical), so one channel is taken as it is
(pan=mono|c0=c0; never -ac 1, which sums them 3 dB hotter), resampled once from 44.1 to 48 kHz with SoX's high-precision resampler,
and padded with silence to the end of the end card. Writes audio/out/voice.wav (48 kHz stereo, 24-bit).
Run: $LIB/.venv/bin/python audio/voice.py"""
import os, sys, json, subprocess
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio.sfx import SR

HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
DUR = json.load(open(os.path.join(ROOT, 'edit', 'events.json')))['dur']
raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'take.mov'), '-af', 'pan=mono|c0=c0,aresample=48000:resampler=soxr:precision=28', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32).astype(np.float64)
out = np.zeros(int(round(DUR * SR))); out[:min(len(x), len(out))] = x[:len(out)]
os.makedirs(os.path.join(HERE, 'out'), exist_ok=True)
sf.write(os.path.join(HERE, 'out', 'voice.wav'), np.stack([out, out], 1).astype(np.float32), SR, subtype='PCM_24')
print('voice', round(len(out) / SR, 2), 's (take', round(len(x) / SR, 2), 's), peak', round(20 * np.log10(np.abs(out).max()), 1), 'dBFS')
