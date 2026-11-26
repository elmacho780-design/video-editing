"""Word timings for the captions and the cues: faster-whisper large-v3 (Mongolian) per sentence (found by tools/pass1.py), with
Batu's transcript line as the initial prompt. Writes edit/align.json (source seconds).
The Cyrillic is Claude's reading of Batu's Latin transcript, for Batu to check (two words especially: see README).
Run from the project folder: $LIB/.venv/bin/python tools/align.py"""
import os, json, subprocess, difflib, time
import numpy as np
from faster_whisper import WhisperModel
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LINES = [
    (0.0, 8.2, 'Хичээлээс гадуур англи хэл суралцахад ямар аргууд үр дүнтэй вэ, ямар арга нь цагийн гарз вэ, түвшингээр нь ярилцъя.'),
    (8.2, 19.28, 'За, Duolingo. Duolingo B tier. Өдөр бүр давтахад өгнө, бол хэрэгтэй. Гэхдээ хүүхэд ганцаараа одоо хайнга хандсанаасаа болоод тууштай байж чаддаггүй.'),
    (19.28, 32.12, 'За, видео тоглоом S tier. Үр дүн айхтар өндөртэй. Тоглож байхдаа хүүхдүүд шинээр үг хэллэг сурангуутаа шууд бодитоор ашиглаад сурдаг.'),
    (32.12, 42.78, 'За, дуу сонсох B tier. Дуу сонсох нь тийм ч их үр дүнтэй биш. Гэхдээ яахав, цээжлээд дагаад дуулвал илүү үр дүнтэй.'),
    (42.78, 51.95, 'Google Translate C tier. Энэ нь туслах хэрэгсэл болохоос биш яг суралцах хэрэгсэл биш. Хэрэгтэй үгээ цээжлэхгүй хараад л өнгөрнө.'),
    (51.95, 65.42, 'Аан, хүүхэлдэйн кино үзэх нь S tier, үр дүн өндөртэй. Ялангуяа хүүхдүүдэд маш гоё. Үйл явдлыг сонсоод хараад, аан, сонсгол сайжраад, тэгээд ойлголт, англи хэлний ойлголт маш сайжирдаг.'),
    (65.42, 78.98, 'За, үг цээжлэх C tier. Үгийг дангаар нь цээжлэх нь тийм үр дүн өндөр биш гэж би бодож байна. Харин өгүүлбэрт оруулаад ашиглаад сурсан нь илүү дээр байдаг.'),
    (78.98, 88.22, 'За, мэдээж зөв чиглүүлэгтэйгээр, сонирхолтойгоор, урам зоригтой орчинд англи хэл заалгах нь үр дүн өндөртэй.'),
    (88.22, 92.6, 'Манайх хагас сайн, бүтэн сайны хүүхдийн ангиуддаа шинээр элсэлт авч байна.'),
    (92.6, 98.3, 'Хэрэв сургалтын талаар мэдээлэл авахыг хүсвэл доорх утасны дугаараар холбогдоорой.'),
    (98.3, 100.36, 'За, амжилт хүсье.'),
]
SR = 16000
raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'take.mov'), '-af', 'pan=mono|c0=c0', '-ar', str(SR), '-f', 'f32le', '-'], capture_output=True, check=True).stdout
x = np.frombuffer(raw, np.float32)
t = time.time(); m = WhisperModel('large-v3', device='cpu', compute_type='int8'); out = []
for i, (a, b, text) in enumerate(LINES):
    segs, _ = m.transcribe(x[int(a * SR):int(b * SR)], language='mn', word_timestamps=True, beam_size=5, initial_prompt=text, vad_filter=False)
    words = [{'w': w.word.strip(), 't0': round(w.start + a, 2), 't1': round(w.end + a, 2)} for s in segs for w in s.words]
    heard = ' '.join(w['w'] for w in words); sim = difflib.SequenceMatcher(None, heard.lower(), text.lower()).ratio()
    out.append({'id': i + 1, 'take': [a, b], 'text': text, 'heard': heard, 'sim': round(sim, 3), 'words': words})
    print(f'--- {i + 1} [{a}-{b}] sim {sim:.2f}\n  said : {text}\n  heard: {heard}\n  ' + ' '.join(f"{w['w']}@{w['t0']:.2f}" for w in words), flush=True)
json.dump(out, open(os.path.join(ROOT, 'edit', 'align.json'), 'w'), ensure_ascii=False, indent=1)
print('took %.0f s' % (time.time() - t))
