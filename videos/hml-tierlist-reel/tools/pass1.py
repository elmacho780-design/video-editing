"""First pass: faster-whisper large-v3 (Mongolian) over the whole take, no prompt, to find where each sentence sits.
Writes edit/pass1.json. Run from the project folder: $LIB/.venv/bin/python tools/pass1.py"""
import os, json, subprocess
import numpy as np
from faster_whisper import WhisperModel
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 16000
raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'take.mov'), '-af', 'pan=mono|c0=c0', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
m = WhisperModel('large-v3', device='cpu', compute_type='int8')
segs, _ = m.transcribe(x, language='mn', word_timestamps=True, beam_size=5, vad_filter=True)
out = []
for s in segs:
    out.append({'t0': round(s.start, 2), 't1': round(s.end, 2), 'text': s.text.strip(),
                'words': [{'w': w.word.strip(), 't0': round(w.start, 2), 't1': round(w.end, 2)} for w in s.words]})
    print(f'{s.start:6.2f}-{s.end:6.2f}  {s.text.strip()}', flush=True)
os.makedirs(os.path.join(ROOT, 'edit'), exist_ok=True)
json.dump(out, open(os.path.join(ROOT, 'edit', 'pass1.json'), 'w'), ensure_ascii=False, indent=1)
