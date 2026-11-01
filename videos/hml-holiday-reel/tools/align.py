"""Word timings for the captions: faster-whisper large-v3 (Mongolian) on each chunk of the take, with the script line as the initial prompt.
Writes edit/align.json: per line the script text, what Whisper heard, a similarity score and word timestamps (source seconds).
Run from the project folder: $LIB/.venv/bin/python tools/align.py"""
import os, json, subprocess, difflib, time
import numpy as np
from faster_whisper import WhisperModel

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# one continuous take, chunked at his pauses, and the script line for each (Claude's Cyrillic reading of Batu's transcript: Batu to check)
LINES = [
    (0.0, 6.6, 'За, сурагчдын амралтын долоо хоногоо ямар ч үр дүнгүй утсаа ширтээд өдөржингөө өнгөрөөмөөргүй байгаа хүмүүс байна уу?'),
    (6.6, 8.4, 'Хэрвээ тийм бол наашаа анхаарлаа хандуулаарай.'),
    (8.4, 16.6, 'Манай сургалтан дээр долоо хоногийн хугацаатай сурагчдын амралтанд зориулаад эрчимжүүлсэн өдөр болгон хичээллэх түвшин ахиулах анги зарлагдаж байна.'),
    (16.6, 27.4, 'Сургалтан дээрээ хүрч ирээд шинэ дүрэм сураад, шинэ үг сураад, түвшингөө ахиулаад, хичээл эхлэхэд явцын шалгалт авахад дүнгээ 10, 20 хувиар нь сайжруулсан бүгдийг нь гайхшруулъя л даа, тийм биз дээ?'),
    (27.4, 34.5, 'Хэрвээ тэгэхийг хүсэж байгаа, илүү их мэдээллийг сонирхож байгаа хүмүүс байвал доорх дугаараар холбогдоод сургалтан дээрээ ирээрэй. Баярлалаа.'),
]
SR = 16000
raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'footage.mov'), '-af', 'pan=mono|c0=c0', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
t = time.time()
m = WhisperModel('large-v3', device='cpu', compute_type='int8')
out = []
for i, (a, b, text) in enumerate(LINES):
    seg = x[int(a * SR):int(b * SR)]
    segs, _ = m.transcribe(seg, language='mn', word_timestamps=True, beam_size=5, initial_prompt=text, vad_filter=False)
    words = [{'w': w.word.strip(), 't0': round(w.start + a, 3), 't1': round(w.end + a, 3), 'p': round(w.probability, 2)} for s in segs for w in s.words]
    heard = ' '.join(w['w'] for w in words)
    sim = difflib.SequenceMatcher(None, heard.lower(), text.lower()).ratio()
    out.append({'id': f's{i + 1}', 'take': [a, b], 'text': text, 'heard': heard, 'sim': round(sim, 3), 'words': words})
    print(f'--- s{i + 1} [{a}-{b}] sim {sim:.2f}\n  said : {text}\n  heard: {heard}\n  ' + ' '.join(f"{w['w']}@{w['t0']:.2f}-{w['t1']:.2f}" for w in words))
json.dump(out, open(os.path.join(ROOT, 'edit', 'align.json'), 'w'), ensure_ascii=False, indent=1)
print('took %.0f s' % (time.time() - t))
