"""Master: the mix (audio/out/mix.wav) to -14 LUFS with one plain gain and a gentle look-ahead peak limiter (ceiling -1.3 dBFS),
no dynamic loudness processing, so his voice keeps its original dynamics. Writes audio/out/final.wav (48 kHz, 24-bit).
Run: $LIB/.venv/bin/python audio/final.py (after audio/score.py)"""
import os, sys, re, subprocess
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio.sfx import SR, limit

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')
mix, _ = sf.read(os.path.join(OUT, 'mix.wav'), dtype='float64')
meas = subprocess.run(['ffmpeg', '-nostdin', '-hide_banner', '-i', os.path.join(OUT, 'mix.wav'), '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', meas)[-1])
g = 10 ** ((-14.0 - I) / 20); ceil = 10 ** (-1.3 / 20)
y = np.stack([limit(mix[:, 0] * g, ceil), limit(mix[:, 1] * g, ceil)], 1)
red = 20 * np.log10(np.maximum(np.abs(y).max(1), 1e-9) / np.maximum(np.abs(mix * g).max(1), 1e-9))
sf.write(os.path.join(OUT, 'final.wav'), y.astype(np.float32), SR, subtype='PCM_24')
print(f'final {len(y) / SR:.2f} s | mix {I:.1f} LUFS, gain {20 * np.log10(g):+.1f} dB | limiter touched {100 * (red < -0.1).mean():.2f}% of samples, max {red.min():.1f} dB')
