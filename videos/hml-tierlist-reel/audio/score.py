"""The music and the final audio for the tier-list promo. Soft and nice, nothing loud or distracting; the audio quality must not change.

The music: a quiet bed of grand piano (Salamander) and a very low string pad, original, on real CC0 samples only (no synthesised sound,
no noise, no drums). F major, 80 BPM (a bar = 3 s), an eight-bar progression that keeps turning under her voice:
  Fmaj7 · Am7 · Bbmaj7 · C · Dm7 · Am7 · Bbmaj7 · Csus4-C
Written to the board: a gentle kalimba note as each method's card appears, and a soft tuned landing as it drops into its tier:
S rises (a bright glockenspiel arpeggio), B is a calm marimba third, C falls softly. It sits at one constant level, about 22 dB under
her speech (no ducking, nothing pumps), resolves to F on "За, амжилт хүсье" and fades with the picture.

Her voice: the take's own audio track, decoded and left exactly as it is (no resampling, no gain, no EQ, no compression, no limiter).
Only the music is resampled, from the sampler's 48 kHz to the take's 44.1 kHz. Writes audio/out/music.wav and audio/out/final.wav.
Run: $LIB/.venv/bin/python audio/score.py"""
import os, sys, json, subprocess
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from core.audio import sampler as S
from core.audio.sfx import SR

S.seed(11)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']; EV = E['ev']
B = 60 / 80; BAR = 4 * B
ev = []
def n(t, inst, p, d, v, pan=0.0): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan))

CH = [('F2', ['A3', 'C4', 'E4', 'F4']), ('A2', ['G3', 'C4', 'E4', 'A4']), ('Bb1', ['A3', 'D4', 'F4', 'Bb4']), ('C2', ['G3', 'C4', 'E4', 'G4']),
      ('D2', ['A3', 'C4', 'F4', 'A4']), ('A2', ['G3', 'C4', 'E4', 'A4']), ('Bb1', ['A3', 'D4', 'F4', 'Bb4']), ('C2', ['G3', 'C4', 'F4', 'G4'])]
END_F = 99.15                                                          # "За, амжилт хүсье": everything settles on F
bar = 0
while bar * BAR < END_F - 0.5:
    a = bar * BAR; b = min(a + BAR, END_F); root, ch = CH[bar % 8]
    n(a, 'piano', root, (b - a) + 0.5, 0.2, -0.1)
    for i, p in enumerate(ch): n(a + 0.025 * i, 'piano', p, (b - a) * 0.9, 0.15, -0.15 + 0.1 * i)
    if a + 2 * B < END_F: n(a + 2 * B, 'piano', ch[2], 2 * B, 0.12, 0.15)
    if a + 3 * B < END_F: n(a + 3 * B, 'piano', ch[3], 1.6 * B, 0.11, 0.2)
    if bar % 8 == 7 and a + 2 * B < END_F: n(a + 2 * B, 'piano', 'E4', 1.5 * B, 0.1, 0.1)   # Csus4 turns to C
    for p in ch[:3]: n(a, 'violas', p, (b - a) + 0.3, 0.08, 0.0)
    n(a, 'cellos', root.replace('1', '2'), (b - a) + 0.3, 0.09, -0.1)
    bar += 1
n(END_F, 'piano', 'F2', 1.4, 0.2, -0.1)
for i, p in enumerate(['A3', 'C4', 'F4', 'A4']): n(END_F + 0.03 * i, 'piano', p, 1.2, 0.15, -0.1 + 0.08 * i)

# the board: a kalimba note as each card appears; a tuned landing as it drops into its tier
CARD = {'duo': 'C5', 'game': 'D5', 'song': 'E5', 'gt': 'F5', 'toon': 'G5', 'words': 'A5', 'hml': 'C6'}
for e in EV:
    t = e['t']
    if e['type'] == 'card': n(t, 'kalimba', CARD[e['id']], 1.2, 0.2, 0.25)
    elif e['type'] == 'tier':
        if e['tier'] == 'S':
            for i, p in enumerate(['F5', 'A5', 'C6', 'F6']): n(t + 0.06 * i, 'glockenspiel', p, 1.0, 0.18, 0.2)
        elif e['tier'] == 'B': n(t, 'marimba', 'A4', 0.8, 0.22, -0.1); n(t + 0.09, 'marimba', 'C5', 0.8, 0.2, -0.1)
        else: n(t, 'marimba', 'C5', 0.8, 0.2, -0.1); n(t + 0.12, 'marimba', 'G4', 0.9, 0.18, -0.1)

L = int(round(DUR * SR))
music = S.render(ev, dur=DUR + 2, master=False)
music = S.room(music, 0.45, 0.2)[:L].astype(np.float64)
fi, fo = int(0.3 * SR), int(0.8 * SR)
music[:fi] *= np.linspace(0, 1, fi)[:, None]; music[L - fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
music44 = soxr.resample(music, SR, 44100, quality='VHQ')               # only the music is resampled

raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'take.mov'), '-map', '0:a', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
voice = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
N = len(voice); music44 = np.vstack([music44, np.zeros((max(0, N - len(music44)), 2))])[:N]
rms = lambda x: np.sqrt((x ** 2).mean()) + 1e-12
env = np.sqrt(np.convolve(voice[:, 0] ** 2, np.ones(2205) / 2205, 'same')); speech = env > np.percentile(env, 60)
music44 *= rms(voice[speech, 0]) / rms(music44[:, 0]) * 10 ** (-22 / 20)
final = voice + music44
vp, fp = 20 * np.log10(np.abs(voice).max()), 20 * np.log10(np.abs(final).max())
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'music.wav'), music44.astype(np.float32), 44100, subtype='FLOAT')
sf.write(os.path.join(OUT, 'final.wav'), final.astype(np.float32), 44100, subtype='FLOAT')
print(f'final {N / 44100:.2f} s at 44.1 kHz | voice untouched (peak {vp:+.1f} dBFS, as recorded) | sum peak {fp:+.1f} dBFS | '
      f'music {20 * np.log10(rms(music44[:, 0]) / rms(voice[speech, 0])):.1f} dB under her speech | instruments:', ', '.join(sorted({e["inst"] for e in ev})))
