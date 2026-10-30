"""Word timings for the captions: faster-whisper large-v3 (Mongolian) on each take, with the script line as the initial prompt.
Writes edit/align.json: per line the script text, what Whisper heard, a similarity score and word timestamps (source seconds).
Run from the project folder: $LIB/.venv/bin/python tools/align.py"""
import os, json, subprocess, difflib, time
import numpy as np
from faster_whisper import WhisperModel

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# the five takes (between the camera cuts) and the script line spoken in each (Claude's Cyrillic reading: Batu to check)
LINES = [
    (0.0, 6.77, 'Таны өглөө болгон уух кофены мөнгөөр хүүхэд чинь англи хэл сурах боломжтой гэвэл ямар сонсогдож байна?'),
    (6.77, 15.73, 'Хүүхдээ хүргэж өгөх боломжгүй, хичээлээ орой тардаг, эсвэл зүгээр л танхимаар суух боломжгүй хүүхдүүдэд зориулаад манайх онлайн сургалт зарлаж байна.'),
    (15.73, 23.3, 'Олимпиадад бэлдмээр байна уу, эсвэл түвшингөө ахиулмаар байна уу, хамаагүй, онлайн сургалтанд маань бүгд багтсан байгаа.'),
    (23.3, 29.3, 'Хуваарийн хувьд гэх юм бол хоёрдох, дөрөвдөх, хагас сайн өдрүүдэд хичээл маань орж байгаа.'),
    (29.3, 41.93, 'Энэн дээр мөн адил манай 3+1 урамшуулал хэрэгжиж байгаа бөгөөд илүү их мэдээллийг та хүсэж байвал доорх дугаараар холбогдоорой. Баярлалаа.'),
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
