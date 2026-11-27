"""The music and the final audio for the second linking-words Reel. As for the first: "soft and nice, nothing too loud or distracting",
and the audio quality must stay the same.

The music: a soft bed of quiet grand piano (Salamander) and a very low string pad, original, on real CC0 samples only (no synthesised
sound, no noise, no drums). F major, a different progression from the first video's. It is written to her phrases: the chord changes
exactly as each new English phrase starts (the "bars" follow her own rhythm, 3 to 5 s each), and a gentle kalimba note, a step higher
each time, marks each phrase as it appears; a soft three-note kalimba fall turns the page (phrases 1-4 slide away, 5-7 begin).
  Fmaj7 · Dm7 · Bbmaj7 · C · Am7 · Gm7 · Csus4-C, resolving to F on her last word, "хэрэггүй", and fading with the picture.
It sits at one constant, quiet level under her voice (about 22 dB below her speech): no ducking, so nothing pumps.

Her voice: the take's own audio track, decoded and left exactly as it is (no resampling, no gain, no EQ, no compression, no limiter).
Only the music is resampled, from the sampler's 48 kHz to the take's 44.1 kHz. Writes audio/out/music.wav and audio/out/final.wav.
Run: $LIB/.venv/bin/python audio/score.py"""
import os, sys, json, subprocess
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from core.audio import sampler as S
from core.audio.sfx import SR

S.seed(17)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']
EN = [e['t'] for e in E['ev'] if e['type'] == 'en']
FLIP = [e['t'] for e in E['ev'] if e['type'] == 'flip'][0]
LAST = [e['t'] for e in E['ev'] if e['type'] == 'last'][0]           # the start of her last word, "хэрэггүй"
DOWN = [0.0] + EN[1:]                                                  # the chord changes: the start, then each new phrase
ENDS = DOWN[1:] + [DUR]
ev = []
def n(t, inst, p, d, v, pan=0.0): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan))

CH = [('F2', ['A3', 'C4', 'E4', 'F4']), ('D2', ['A3', 'C4', 'F4', 'A4']), ('Bb1', ['A3', 'D4', 'F4', 'Bb4']), ('C2', ['G3', 'C4', 'E4', 'G4']),
      ('A2', ['G3', 'C4', 'E4', 'A4']), ('G2', ['F3', 'Bb3', 'D4', 'G4']), ('C2', ['G3', 'C4', 'F4', 'G4'])]
END_F = LAST                                                           # the resolution to F, on her last word
for k, (a, b) in enumerate(zip(DOWN, ENDS)):
    root, ch = CH[k]
    if k == len(CH) - 1: b = END_F                                     # the last bar gives way to the final chord
    beat = (b - a) / 4
    # piano: the root and the chord on the downbeat, then two quiet notes of the chord drifting up
    n(a, 'piano', root, (b - a) + 0.6, 0.22, -0.1)
    for i, p in enumerate(ch): n(a + 0.025 * i, 'piano', p, (b - a) * 0.9, 0.17, -0.15 + 0.1 * i)
    n(a + 2 * beat, 'piano', ch[2], beat * 2, 0.13, 0.15); n(a + 3 * beat, 'piano', ch[3], beat * 1.6, 0.12, 0.2)
    # the string pad: the chord held, very low
    for p in ch[:3]: n(a, 'violas', p, (b - a) + 0.4, 0.09, 0.0)
    n(a, 'cellos', root.replace('1', '2'), (b - a) + 0.4, 0.1, -0.1)
# the last bar turns from Csus4 to C halfway, then resolves to F on her last word
last = DOWN[-1]; half = last + (END_F - last) / 2
for p in ['G3', 'C4', 'E4', 'G4']: n(half, 'piano', p, END_F - half, 0.12, 0.1)
n(END_F, 'piano', 'F2', 1.4, 0.2, -0.1)
for i, p in enumerate(['A3', 'C4', 'F4', 'A4']): n(END_F + 0.03 * i, 'piano', p, 1.2, 0.15, -0.1 + 0.08 * i)
for p in ['A3', 'C4', 'F4']: n(END_F, 'violas', p, 1.5, 0.08, 0.0)
# a gentle kalimba note as each phrase appears, a step up the F major scale each time; a soft fall turns the page
for i, t in enumerate(EN): n(t, 'kalimba', ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'C6'][i], 1.4, 0.2, 0.25)
for i, p in enumerate(['A5', 'F5', 'C5']): n(FLIP + 0.07 * i, 'kalimba', p, 0.9, 0.14, -0.25 + 0.2 * i)

L = int(round(DUR * SR))
music = S.render(ev, dur=DUR + 2, master=False)
music = S.room(music, 0.45, 0.2)[:L].astype(np.float64)
fi, fo = int(0.25 * SR), int(0.7 * SR)
music[:fi] *= np.linspace(0, 1, fi)[:, None]; music[L - fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5
music44 = soxr.resample(music, SR, 44100, quality='VHQ')               # only the music is resampled

# her voice: the take's own track, decoded and left exactly as it is
raw = subprocess.run(['ffmpeg', '-nostdin', '-loglevel', 'error', '-i', os.path.join(ROOT, 'src', 'take.mov'), '-map', '0:a', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
voice = np.frombuffer(raw, np.float32).reshape(-1, 2).astype(np.float64)
N = len(voice); music44 = np.vstack([music44, np.zeros((max(0, N - len(music44)), 2))])[:N]
rms = lambda x: np.sqrt((x ** 2).mean()) + 1e-12
env = np.sqrt(np.convolve(voice[:, 0] ** 2, np.ones(2205) / 2205, 'same')); speech = env > np.percentile(env, 60)
music44 *= rms(voice[speech, 0]) / rms(music44[:, 0]) * 10 ** (-22 / 20)      # one constant level, ~22 dB under her speech
final = voice + music44
vp, peak = 20 * np.log10(np.abs(voice).max()), 20 * np.log10(np.abs(final).max())
assert peak < -0.3, f'the sum peaks at {peak:.1f} dBFS: lower the music'     # her own peaks are at -0.9 dBFS, as recorded
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'music.wav'), music44.astype(np.float32), 44100, subtype='FLOAT')
sf.write(os.path.join(OUT, 'final.wav'), final.astype(np.float32), 44100, subtype='FLOAT')
print(f'final {N / 44100:.2f} s at 44.1 kHz | voice untouched (peak {vp:.1f} dBFS) | sum peak {peak:.1f} dBFS | END_F {END_F:.2f} | '
      f'music {20 * np.log10(rms(music44[:, 0]) / rms(voice[speech, 0])):.1f} dB under her speech | instruments:', ', '.join(sorted({e["inst"] for e in ev})))
