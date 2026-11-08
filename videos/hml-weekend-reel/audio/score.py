"""The score: a toy-box tune for the ABC blocks look, written to the picture. Original, on real CC0 samples only (no synthesised sound,
no noise, no whooshes): marimba, xylophone, glockenspiel, pizzicato strings and bass, hand chimes, a woodblock, a shaker, claps and a
soft bass drum. C major, 120 BPM (a bar = 2 s); every graphic cue in src/edit.js sits on this eighth-note grid.

  0 - 3.75     the hook: pizzicato chords and a xylophone run up as the promise lands
  4 - 12.4     the books: the marimba tune; a wooden knock as each block lands, a two-note glockenspiel "ding" on each tick,
               and a little rising question on "?"
  12.45 - 13.3 the wall of blocks: a xylophone cascade as they tumble in, a held chord while it covers the camera change, a bright
               chord as it falls away
  13.5 - 26    the enrolment: the band comes in (bass drum, claps, shaker); the date and time blocks knock on a rising C-E-G-C
  26 - 32.4    the contact: the numbers land on glockenspiel hits, the band builds
  32.25 - 35   the end card: a cascade, then the final C major chord and a sparkle as the logo lands
The music sits under her voice (it ducks while she speaks); the voice itself is untouched (audio/voice.py).
Run: $LIB/.venv/bin/python audio/score.py (after audio/voice.py)"""
import os, sys, json
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, limit

S.seed(31)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']; EV = E['ev']
B = 60 / next(e['bpm'] for e in EV if e['type'] == 'clock'); BAR = 4 * B
bt = lambda bar, beat=0.0: bar * BAR + beat * B
HITS = [e for e in EV if e['type'] == 'hit']; at = lambda kind: [e['t'] for e in HITS if e['kind'] == kind]
WALL, WALL_OUT, END = at('wall')[0], at('wallOut')[0], at('end')[0]
ENROL = 13.5
N = int((DUR + 3) * SR)
ev, cue = [], []
def n(t, inst, p, d, v, pan=0.0): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan))
def c(t, inst, p, d, v, pan=0.0): cue.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan))
EW = at('wall')[-1]                                                   # the end card's wall
quiet = lambda t: WALL - 0.05 <= t < WALL_OUT + 0.1 or t >= EW - 0.05

# ---------------------------------------------------------------- harmony: C Am F G, a bar each (G7 before the end)
PLAN = ['C', 'Am', 'F', 'G'] * 4 + ['C']
CH = {'C': ['C4', 'E4', 'G4'], 'Am': ['A3', 'C4', 'E4'], 'F': ['F3', 'A3', 'C4'], 'G': ['G3', 'B3', 'D4'], 'G7': ['G3', 'B3', 'F4']}
BASS = {'C': ['C2', 'G2'], 'Am': ['A1', 'E2'], 'F': ['F1', 'C2'], 'G': ['G1', 'D2'], 'G7': ['G1', 'D2']}
TONES = {'C': ['C', 'E', 'G'], 'Am': ['A', 'C', 'E'], 'F': ['F', 'A', 'C'], 'G': ['G', 'B', 'D']}
chord_at = lambda t: PLAN[min(int(t // BAR), len(PLAN) - 1)]

for bar, ch in enumerate(PLAN):
    t0 = bt(bar)
    if t0 >= END - 0.01: break
    for beat in range(4):                                               # pizzicato chords on the off-beats, a bouncy toy-box comp
        t = bt(bar, beat + 0.5)
        if quiet(t) or t >= END: continue
        for i, p in enumerate(CH[ch]): n(t + 0.008 * i, 'violins_pizz', p.replace('3', '4'), 0.25, 0.3, -0.25 + 0.15 * i)
    for beat, k in [(0, 0), (2, 1)]:                                    # the bass on 1 and 3
        t = bt(bar, beat)
        if not quiet(t) and t < END: n(t, 'contrabass_pizz', BASS[ch][k], 0.6, 0.62, 0.05)
    if t0 >= ENROL - 0.6:                                               # from the enrolment: the band comes in
        for beat in range(4):
            t = bt(bar, beat)
            if quiet(t) or t >= END: continue
            if beat in (0, 2): n(t, 'bass_drum', None, None, 0.38 if beat == 0 else 0.28, 0)
            else: n(t, 'claps', 'solo', None, 0.22, 0.1 if beat == 3 else -0.1)
        for k in range(8):
            t = bt(bar, k / 2)
            if not quiet(t) and t < END: n(t, 'shaker', 'down' if k % 2 == 0 else 'up', None, 0.13 if k % 2 == 0 else 0.08, 0.35)

# ---------------------------------------------------------------- the tune (marimba), from the books to the contact; it rests while she says the key numbers
TUNE = [(0, 'E5', .5), (.5, 'G5', .5), (1, 'C6', 1), (2.5, 'B5', .5), (3, 'G5', 1)]
for bar in range(2, 16):
    t0 = bt(bar)
    if t0 < 4.0 or t0 >= END - 0.5: continue
    ch = chord_at(t0); shift = {'C': 0, 'Am': -3, 'F': 5, 'G': 7}[ch]
    for beat, p, d in TUNE:
        t = bt(bar, beat)
        if quiet(t) or t >= END: continue
        m = S.midi(p) + (shift if shift <= 0 else shift - 12)
        n(t, 'marimba', m, d * B * 1.2, 0.34, -0.2)

# ---------------------------------------------------------------- the hook: a xylophone run up as the promise lands
for i, p in enumerate(['C5', 'D5', 'E5', 'G5', 'A5', 'C6']): n(0.0 + i * 0.045, 'xylophone', p, 0.4, 0.4, -0.2 + 0.08 * i)
n(0.0, 'hand_chimes', 'C6', 1.6, 0.36, 0.1)

# ---------------------------------------------------------------- the wall: a cascade in, a held chord, a bright chord out
for i in range(14):
    p = ['C7', 'A6', 'G6', 'E6', 'D6', 'C6', 'A5', 'G5', 'E5', 'D5', 'C5', 'A4', 'G4', 'E4'][i]
    n(WALL + i * 0.025, 'xylophone', p, 0.3, 0.32, -0.4 + 0.06 * i)
for p in ['C4', 'E4', 'G4', 'C5']: n(WALL + 0.35, 'marimba', p, 0.9, 0.32, 0)
n(WALL + 0.35, 'contrabass_pizz', 'C2', 0.8, 0.6)
for i, p in enumerate(['G4', 'C5', 'E5', 'G5', 'C6']): n(WALL_OUT + i * 0.04, 'glockenspiel', p, 0.6, 0.34, 0.2)
n(WALL_OUT, 'contrabass_pizz', 'C2', 0.6, 0.62); n(WALL_OUT, 'bass_drum', None, None, 0.4, 0)

# ---------------------------------------------------------------- the end card: cascade, then C major and a sparkle
for i in range(14):
    p = ['C7', 'A6', 'G6', 'E6', 'D6', 'C6', 'A5', 'G5', 'E5', 'D5', 'C5', 'A4', 'G4', 'E4'][i]
    n(EW + i * 0.025, 'xylophone', p, 0.3, 0.3, -0.4 + 0.06 * i)
for p in ['G3', 'B3', 'F4']: n(EW + 0.05, 'violins_pizz', p, 0.3, 0.3)
n(EW + 0.05, 'contrabass_pizz', 'G1', 0.3, 0.55)
for i, p in enumerate(['C4', 'E4', 'G4', 'C5']): n(END + 0.012 * i, 'marimba', p, 2.2, 0.48, -0.2 + 0.12 * i)
n(END, 'contrabass_pizz', 'C2', 2.0, 0.8); n(END, 'bass_drum', None, None, 0.45, 0)
for i, p in enumerate(['C5', 'E5', 'G5', 'C6', 'E6', 'G6']): n(END + 0.25 + i * 0.05, 'glockenspiel', p, 1.4, 0.36, 0.3 - 0.1 * i)
n(END + 0.25, 'hand_chimes', 'C6', 2.4, 0.4, 0); n(END + 0.25, 'hand_chimes', 'G5', 2.4, 0.32, -0.2)
for i, p in enumerate(['C6', 'D6', 'E6', 'G6']): n(END + 1.2 + i * 0.09, 'glockenspiel', p, 0.9, 0.26, 0.25)

# ---------------------------------------------------------------- the graphic hits: knocks, dings and the question, on their own layer
for e in HITS:
    t, k = e['t'], e['kind']
    if k == 'block':                                                    # a wooden knock, pitched on a rising C-E-G-C
        c(t, 'woodblock', None, None, 0.5, 0.1); c(t, 'xylophone', ['C6', 'E6', 'G6', 'C7'][min(3, e.get('n', 1) - 1)], 0.35, 0.55, 0.15)
    elif k == 'plank': c(t, 'marimba', 'G5', 0.35, 0.5, -0.1); c(t + 0.06, 'marimba', 'C6', 0.4, 0.5, -0.1)
    elif k == 'tag': c(t, 'xylophone', 'E6', 0.3, 0.42, 0.2)
    elif k == 'tick': c(t, 'glockenspiel', 'E6', 0.6, 0.6, 0.2); c(t + 0.08, 'glockenspiel', 'C7', 0.9, 0.62, 0.2); c(t, 'hand_chimes', 'C6', 1.0, 0.5, 0)
    elif k == 'question': c(t, 'xylophone', 'G5', 0.25, 0.5, 0); c(t + 0.12, 'xylophone', 'D6', 0.4, 0.55, 0)

music = S.render(ev, dur=DUR + 3, master=False)
music = S.room(music, 0.35, 0.14)[:N]
hits = S.room(S.render(cue, dur=DUR + 3, master=False), 0.3, 0.12)[:N]
music = music + 1.4 * hits
L = int(round(DUR * SR)); fo = int(0.8 * SR)
music = music[:L].astype(np.float64); music[L - fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5

# ---------------------------------------------------------------- mix: under her voice, ducked while she speaks; her voice is untouched
voice, _ = sf.read(os.path.join(OUT, 'voice.wav'), dtype='float64'); voice = np.vstack([voice, np.zeros((max(0, L - len(voice)), 2))])[:L]
win = int(0.05 * SR); venv = np.sqrt(np.convolve(voice[:, 0] ** 2, np.ones(win) / win, 'same'))
talk = np.convolve((20 * np.log10(venv + 1e-9) > -38).astype(float), np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')
rms = lambda x: np.sqrt((x ** 2).mean()) + 1e-12; speech = venv > np.percentile(venv, 55)
music *= rms(voice[speech, 0]) / rms(music[:, 0]) * 10 ** (-11 / 20)
mix = voice + music * (10 ** (-5 * talk / 20))[:, None]
mix = np.stack([limit(mix[:, 0], 0.95), limit(mix[:, 1], 0.95)], 1)
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'music.wav'), music.astype(np.float32), SR, subtype='PCM_24')
sf.write(os.path.join(OUT, 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
print(f'mix {L / SR:.2f} s | {60 / B:.0f} BPM | instruments:', ', '.join(sorted({e["inst"] for e in ev + cue})))
