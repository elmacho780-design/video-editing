"""The music and the final audio. Batu: "soft and nice, nothing too loud or distracting", and the audio quality must stay the same.

The music: a soft bed of felt-quiet piano and a very low string pad, original, on real CC0 samples only (no synthesised sound, no noise,
no drums). F major. It is written to her phrases: the chord changes exactly as each new English phrase starts (the "bars" follow her
own rhythm, about 3 s each), and a gentle kalimba note, a step higher each time, marks each phrase as it appears.
  Fmaj7 · Am7 · Bbmaj7 · C · Dm7 · Bbmaj7 · Csus4-C, resolving to F after her last word, and fading with the picture.
It sits at one constant, quiet level under her voice (about 22 dB below her speech): no ducking, so nothing pumps.

Her voice: the take's own audio track, decoded and left exactly as it is (both channels are identical; no resampling, no gain, no
EQ, no compression, no limiter). Only the music is resampled, from the sampler's 48 kHz to the take's 44.1 kHz. The sum stays well
below full scale (her peaks are at -2.8 dBFS), so nothing is limited. Writes audio/out/music.wav and audio/out/final.wav (44.1 kHz).
Run: $LIB/.venv/bin/python audio/score.py"""
import os, sys, json, subprocess
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf, soxr
from core.audio import sampler as S
from core.audio.sfx import SR

S.seed(7)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']
EN = [e['t'] for e in E['ev'] if e['type'] == 'en']
DOWN = [0.0] + EN[1:]                                                  # the chord changes: the start, then each new phrase
ENDS = DOWN[1:] + [DUR]
ev = []
def n(t, inst, p, d, v, pan=0.0): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan))

CH = [('F2', ['A3', 'C4', 'E4', 'F4']), ('A2', ['G3', 'C4', 'E4', 'A4']), ('Bb1', ['A3', 'D4', 'F4', 'Bb4']), ('C2', ['G3', 'C4', 'E4', 'G4']),
      ('D2', ['A3', 'C4', 'F4', 'A4']), ('Bb1', ['A3', 'D4', 'F4', 'Bb4']), ('C2', ['G3', 'C4', 'F4', 'G4'])]
END_F = 21.05                                                          # the resolution to F, just after her last word (21.0)
for k, (a, b) in enumerate(zip(DOWN, ENDS)):
    root, ch = CH[k]; beat = (b - a) / 4
    if k == len(CH) - 1: b = END_F; beat = 1.3 / 4                     # the last bar gives way to the final chord
    # piano: the root and the chord on the downbeat, then two quiet notes of the chord drifting up
    n(a, 'piano', root, (b - a) + 0.6, 0.22, -0.1)
    for i, p in enumerate(ch): n(a + 0.025 * i, 'piano', p, (b - a) * 0.9, 0.17, -0.15 + 0.1 * i)
    n(a + 2 * beat, 'piano', ch[2], beat * 2, 0.13, 0.15); n(a + 3 * beat, 'piano', ch[3], beat * 1.6, 0.12, 0.2)
    # the string pad: the chord held, very low
    for p in ch[:3]: n(a, 'violas', p, (b - a) + 0.4, 0.09, 0.0)
    n(a, 'cellos', root.replace('1', '2'), (b - a) + 0.4, 0.1, -0.1)
# the last bar turns from Csus4 to C, then resolves to F just after her last word
last = DOWN[-1]
for p in ['G3', 'C4', 'E4', 'G4']: n(last + 1.3, 'piano', p, 1.0, 0.12, 0.1)
n(END_F, 'piano', 'F2', 1.2, 0.2, -0.1)
for i, p in enumerate(['A3', 'C4', 'F4', 'A4']): n(END_F + 0.03 * i, 'piano', p, 1.0, 0.15, -0.1 + 0.08 * i)
# a gentle kalimba note as each phrase appears, a step up the F major scale each time
for i, t in enumerate(EN): n(t, 'kalimba', ['C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'C6'][i], 1.4, 0.2, 0.25)

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
peak = 20 * np.log10(np.abs(final).max())
assert peak < -1.0, f'the sum peaks at {peak:.1f} dBFS: lower the music'
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'music.wav'), music44.astype(np.float32), 44100, subtype='FLOAT')
sf.write(os.path.join(OUT, 'final.wav'), final.astype(np.float32), 44100, subtype='FLOAT')
print(f'final {N / 44100:.2f} s at 44.1 kHz | voice untouched (peak {20 * np.log10(np.abs(voice).max()):.1f} dBFS) | sum peak {peak:.1f} dBFS | '
      f'music {20 * np.log10(rms(music44[:, 0]) / rms(voice[speech, 0])):.1f} dB under her speech | instruments:', ', '.join(sorted({e["inst"] for e in ev})))
