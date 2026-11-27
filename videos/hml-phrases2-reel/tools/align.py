"""Word timings for the seven phrases: faster-whisper large-v3 on each speech segment of the take (found between her pauses with
silencedetect -38 dB, and identified by tools/segments.py), with word timestamps. No prompt, so what is heard is what was said.
Writes edit/align.json (source seconds). Run from the project folder: $LIB/.venv/bin/python tools/align.py"""
import os, json, subprocess, time
import numpy as np
from faster_whisper import WhisperModel
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# (start, end, language, the text as Batu wrote it; Mongolian is Claude's Cyrillic reading, for Batu to check)
SEGS = [
    (0.00, 1.59, 'en', 'Despite the fact that'), (2.11, 3.25, 'mn', 'үүнийг үл харгалзан'),
    (3.78, 5.75, 'mn', 'Ultimately, эцэст нь хэлэхэд'),                 # she runs the English and its Mongolian together
    (6.36, 8.36, 'en', 'From my perspective'), (8.85, 9.94, 'mn', 'миний бодлоор'),
    (10.55, 12.51, 'en', 'As far as I understand'), (12.83, 14.67, 'mn', 'миний ойлгож байгаагаар'),
    (15.75, 17.80, 'en', 'It is worth mentioning'), (18.12, 20.99, 'mn', 'үүнийг дурдах нь зүйтэй'),
    (21.39, 22.98, 'en', 'It is worth emphasizing'), (23.23, 25.22, 'mn', 'үүнийг цохон тэмдэглэх нь зүйтэй'),
    (26.06, 28.17, 'en', 'There is no doubt that'), (28.54, 30.65, 'mn', 'үүнд эргэлзэх хэрэггүй'),
]
SR = 16000
raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'take.mov'), '-af', 'pan=mono|c0=c0', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
t = time.time(); m = WhisperModel('large-v3', device='cpu', compute_type='int8'); out = []
for a, b, lang, text in SEGS:
    a0 = max(0.0, a - 0.15); seg = x[int(a0 * SR):int((b + 0.15) * SR)]
    segs, _ = m.transcribe(seg, language=lang, word_timestamps=True, beam_size=5, vad_filter=False)
    words = [{'w': w.word.strip(), 't0': round(w.start + a0, 2), 't1': round(w.end + a0, 2), 'p': round(w.probability, 2)} for s in segs for w in s.words]
    out.append({'take': [a, b], 'lang': lang, 'text': text, 'words': words})
    print(f'[{a:5.2f}-{b:5.2f}] {lang} heard: ' + ' '.join(f"{w['w']}@{w['t0']:.2f}-{w['t1']:.2f}" for w in words) + f'   (written: {text})', flush=True)
json.dump(out, open(os.path.join(ROOT, 'edit', 'align.json'), 'w'), ensure_ascii=False, indent=1)
print('took %.0f s' % (time.time() - t))
