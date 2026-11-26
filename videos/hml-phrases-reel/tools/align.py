"""Word timings for the seven phrases: faster-whisper large-v3 on each chunk of the take (Batu's timestamps, moved to real pauses),
English first, then the Mongolian. Each chunk gets its own prompt. Writes edit/align.json (source seconds).
Run from the project folder: $LIB/.venv/bin/python tools/align.py"""
import os, json, subprocess, time
import numpy as np
from faster_whisper import WhisperModel
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# (start, end, English as written on screen, Mongolian: Claude's Cyrillic reading of Batu's transcript, for Batu to check)
LINES = [
    (0.0, 1.95, 'Nevertheless', 'гэсэн хэдий ч'),
    (1.95, 3.30, 'As a result', 'үүний үр дүнд'),
    (3.30, 6.20, 'In fact', 'яг үнэндээ'),
    (6.20, 9.10, 'Moreover', 'түүнчлэн'),
    (9.10, 12.40, 'Furthermore', 'үүнээс гадна'),
    (12.40, 15.30, 'In other words', 'өөрөөр хэлбэл'),
    (15.30, 21.70, 'In this regard', 'үүнтэй холбоотойгоор'),
]
SR = 16000
raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'take.mov'), '-af', 'pan=mono|c0=c0', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
t = time.time(); m = WhisperModel('large-v3', device='cpu', compute_type='int8'); out = []
for i, (a, b, en, mn) in enumerate(LINES):
    seg = x[int(a * SR):int(b * SR)]; res = {'id': i + 1, 'take': [a, b], 'en': en, 'mn': mn}
    for lang, prompt in (('en', f'{en}.'), ('mn', f'{en} гэвэл {mn}.')):
        segs, _ = m.transcribe(seg, language=lang, word_timestamps=True, beam_size=5, initial_prompt=prompt, vad_filter=False)
        res[lang] = [{'w': w.word.strip(), 't0': round(w.start + a, 2), 't1': round(w.end + a, 2), 'p': round(w.probability, 2)} for s in segs for w in s.words]
    out.append(res)
    print(f'--- {i + 1} [{a}-{b}] {en} / {mn}\n  en: ' + ' '.join(f"{w['w']}@{w['t0']:.2f}" for w in res['en']) + '\n  mn: ' + ' '.join(f"{w['w']}@{w['t0']:.2f}" for w in res['mn']))
json.dump(out, open(os.path.join(ROOT, 'edit', 'align.json'), 'w'), ensure_ascii=False, indent=1)
print('took %.0f s' % (time.time() - t))
