"""First look at the take: transcribe each speech segment between the pauses (silencedetect -38 dB) in English and in Mongolian,
with no prompt, to see which segment holds which phrase. Run: $LIB/.venv/bin/python tools/segments.py"""
import os, subprocess, numpy as np
from faster_whisper import WhisperModel
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SEG = [(0.0, 1.59), (2.11, 3.25), (3.78, 5.75), (6.36, 8.36), (8.85, 9.94), (10.55, 12.51), (12.83, 14.67), (15.75, 17.80),
       (18.12, 18.63), (18.95, 20.04), (20.60, 20.99), (21.39, 22.98), (23.23, 25.22), (26.06, 27.45), (27.70, 28.17), (28.54, 29.61), (30.14, 30.65)]
SR = 16000
x = np.frombuffer(subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'take.mov'), '-af', 'pan=mono|c0=c0', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout, np.float32)
m = WhisperModel('large-v3', device='cpu', compute_type='int8')
for a, b in SEG:
    seg = x[int(max(0, a - 0.1) * SR):int((b + 0.1) * SR)]
    out = []
    for lg in ('en', 'mn'):
        segs, info = m.transcribe(seg, language=lg, beam_size=5, vad_filter=False)
        out.append(lg + ': ' + ' '.join(s.text.strip() for s in segs))
    print(f'[{a:5.2f}-{b:5.2f}]  ' + '  |  '.join(out), flush=True)
