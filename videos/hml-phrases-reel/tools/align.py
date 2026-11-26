"""Word timings for the seven phrases: faster-whisper large-v3 on each chunk of the take (Batu's timestamps, moved to real pauses),
English first, then the Mongolian. No prompt, so what is heard is what was said. Writes edit/align.json (source seconds).
Run from the project folder: $LIB/.venv/bin/python tools/align.py"""
import os, json, subprocess, time
import numpy as np
from faster_whisper import WhisperModel
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# speech segments found between the take's pauses (silencedetect -38 dB): each English phrase, a pause, then its Mongolian.
# (start, end, language, the text as Batu wrote it; Mongolian is Claude's Cyrillic reading, for Batu to check)
SEGS = [
    (0.40, 1.60, 'en', 'Nevertheless'), (1.95, 3.05, 'mn', 'гэсэн хэдий ч'),
    (3.50, 4.50, 'en', 'As a result'), (4.70, 5.85, 'mn', 'үүний үр дүнд'),
    (6.65, 7.60, 'en', 'In fact'), (7.85, 8.95, 'mn', 'яг үнэндээ'),
    (9.70, 10.85, 'en', 'Moreover'), (11.10, 11.95, 'mn', 'түүнчлэн'),
    (12.50, 13.45, 'en', 'Furthermore'), (13.90, 14.95, 'mn', 'үүнээс гадна'),
    (15.65, 18.10, 'en', 'In other words, өөрөөр хэлбэл'),
    (18.65, 19.75, 'en', 'In this regard'), (19.95, 21.30, 'mn', 'үүнтэй холбоотойгоор'),
]
SR = 16000
raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'take.mov'), '-af', 'pan=mono|c0=c0', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
t = time.time(); m = WhisperModel('large-v3', device='cpu', compute_type='int8'); out = []
for a, b, lang, text in SEGS:
    seg = x[int(a * SR):int(b * SR)]
    res = {'take': [a, b], 'lang': lang, 'text': text}
    for lg in ([lang] if lang == 'mn' else ['en', 'mn']):
        segs, _ = m.transcribe(seg, language=lg, word_timestamps=True, beam_size=5, vad_filter=False)
        res[lg] = [{'w': w.word.strip(), 't0': round(w.start + a, 2), 't1': round(w.end + a, 2), 'p': round(w.probability, 2)} for s in segs for w in s.words]
        print(f'[{a:5.2f}-{b:5.2f}] {lg} heard: ' + ' '.join(f"{w['w']}@{w['t0']:.2f}" for w in res[lg]) + f'   (written: {text})')
    out.append(res)
json.dump(out, open(os.path.join(ROOT, 'edit', 'align.json'), 'w'), ensure_ascii=False, indent=1)
print('took %.0f s' % (time.time() - t))
