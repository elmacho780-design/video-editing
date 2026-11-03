"""Daily English · "Stop Saying This" series theme, Day 1 cut. Original, on real CC0 samples only (no synthesised sound, no noise):
ukulele, pizzicato double bass, glockenspiel, marimba, kalimba, hand chimes, a light shaker, claps and a soft bass drum.

G major, 128 BPM (bar = 1.875 s). Re-paced after the "too slow" feedback: the band starts on frame one, the kick plays on 1 and 3,
and the form is 9 bars (17.3 s) instead of 14:
  bars 0-3   A: the theme on glockenspiel over a ukulele strum (G Em C D)
  bars 4-6   A': the theme again with a marimba counter-line (G Em C)
  bar 7      the recap: Em, the drums drop out, then D7 on beat 3
  bar 8      a full G on the end card with a glockenspiel run and chimes; on beat 3 the tag, and the last G rings out
Scene changes get a small three-note harp lift; the pops land only on the reveals and answers, as the series style sheet says:
a soft falling marimba on the ✗, a bright rising glockenspiel on each ✓, a pizzicato snap on the cut.
All timing comes from edit/events.json (exported by src/day.js). When Batu's voiceover arrives, audio/voice.py writes
audio/out/voice.wav and this script ducks the music under it. Writes audio/out/music.wav and mix.wav.
Run: $LIB/.venv/bin/python audio/score.py"""
import os, sys, json
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, add, limit

S.seed(9)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']; EV = E['ev']
B = 60 / next(e['bpm'] for e in EV if e['type'] == 'clock'); BAR = 4 * B
bt = lambda bar, beat=0.0: bar * BAR + beat * B
N = int((DUR + 3) * SR)

ev, cue = [], []
def n(t, inst, p, d, v, pan=0.0): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan))

UKE = {'G': ['G3', 'D4', 'G4', 'B4'], 'Em': ['E3', 'B3', 'E4', 'G4'], 'C': ['C4', 'E4', 'G4', 'C5'], 'D': ['D4', 'F#4', 'A4', 'D5'],
       'Bm': ['B3', 'D4', 'F#4', 'B4'], 'D7': ['D4', 'F#4', 'A4', 'C5']}
ROOT_ = {'G': 'G2', 'Em': 'E2', 'C': 'C3', 'D': 'D3', 'Bm': 'B2', 'D7': 'D3'}
FIFTH = {'G': 'D3', 'Em': 'B2', 'C': 'G2', 'D': 'A2', 'Bm': 'F#2', 'D7': 'A2'}
PLAN = ['G', 'Em', 'C', 'D', 'G', 'Em', 'C', 'Em']                  # bars 0-7; bar 7 (the recap) turns to D7 on beat 3, bar 8 is the end card

def strum(t, chord, v=0.55, up=False, d=0.5):
    notes = UKE[chord][::-1] if up else UKE[chord]
    for i, p in enumerate(notes): n(t + 0.012 * i, 'ukulele', p, d, v * (0.8 if up else 1.0), -0.2 + 0.12 * i)

# ---------------------------------------------------------------- the band, bars 0-7
for bar, ch in enumerate(PLAN):
    recap = bar == 7
    for beat, up, v in [(0, False, 0.6), (1, False, 0.42), (1.5, True, 0.36), (2.5, True, 0.36), (3, False, 0.45), (3.5, True, 0.34)]:
        if recap and beat not in (0, 1.5): continue                     # the recap thins to two strums, then D7
        strum(bt(bar, beat), ch, v, up)
    n(bt(bar, 0), 'contrabass_pizz', ROOT_[ch], 0.8, 0.7, 0.05)
    if not recap: n(bt(bar, 2), 'contrabass_pizz', FIFTH[ch], 0.8, 0.55, 0.05)
    if not recap:                                                       # the groove runs from the very first beat
        for k in range(8): n(bt(bar, k / 2), 'shaker', 'down' if k % 2 == 0 else 'up', None, 0.16 if k % 2 == 0 else 0.1, 0.35)
        n(bt(bar, 1), 'claps', 'solo', None, 0.28, -0.1); n(bt(bar, 3), 'claps', 'solo', None, 0.3, 0.1)
        n(bt(bar, 0), 'bass_drum', None, None, 0.45 if bar == 0 else 0.4, 0); n(bt(bar, 2), 'bass_drum', None, None, 0.32, 0)

# ---------------------------------------------------------------- the theme (glockenspiel) and its counter-line (marimba)
THEME = {0: [(0, 'B5', .5), (.5, 'D6', .5), (1, 'G6', 1), (2.5, 'F#6', .5), (3, 'D6', 1)],
         1: [(0, 'E6', .5), (.5, 'G6', .5), (1, 'B5', 1.5), (3, 'G5', .5), (3.5, 'A5', .5)],
         2: [(0, 'C6', .5), (.5, 'E6', .5), (1, 'G6', 1), (2.5, 'E6', .5), (3, 'C6', 1)],
         3: [(0, 'D6', .5), (.5, 'F#6', .5), (1, 'A6', 1), (2, 'F#6', .5), (2.5, 'E6', .5), (3, 'D6', 1)]}
for rep in (0, 4):
    for bar, notes in THEME.items():
        if bar + rep > 6: continue                                      # bar 7 is the recap
        for beat, p, d in notes: n(bt(bar + rep, beat), 'glockenspiel', p, d * B * 1.6, 0.42 if rep == 0 else 0.38, 0.25)
COUNTER = {4: ['G4', 'B4', 'D5', 'B4'], 5: ['E4', 'G4', 'B4', 'G4'], 6: ['C5', 'E5', 'G5', 'E5']}
for bar, notes in COUNTER.items():
    for k, p in enumerate(notes): n(bt(bar, k), 'marimba', p, B * 0.9, 0.42, -0.25)
# the recap (bar 7): two quiet glockenspiel notes, room for the words
n(bt(7, 0), 'glockenspiel', 'B5', 0.9, 0.3, 0.25); n(bt(7, 1.5), 'glockenspiel', 'G5', 0.9, 0.28, 0.25)

# ---------------------------------------------------------------- bar 7 beat 3: D7, then everything lands on G with the end card (bar 8)
end = next(e['t'] for e in EV if e['type'] == 'scene' and e['name'] == 'end')
strum(bt(7, 2), 'D7', 0.5); n(bt(7, 2), 'contrabass_pizz', 'D3', 0.5, 0.65)
for i, p in enumerate(['D6', 'F#6', 'A6']): n(bt(7, 2.5) + i * B / 2, 'glockenspiel', p, 0.5, 0.36, 0.25)
strum(end, 'G', 0.75, d=2.0); n(end, 'contrabass_pizz', 'G2', 1.8, 0.85); n(end, 'bass_drum', None, None, 0.5, 0)
for i, p in enumerate(['G5', 'B5', 'D6', 'G6', 'B6', 'D7']): n(end + i * 0.05, 'glockenspiel', p, 1.4, 0.4, 0.3 - 0.1 * i)
n(end, 'hand_chimes', 'G5', 2.4, 0.42, 0); n(end, 'hand_chimes', 'D6', 2.4, 0.34, -0.2)
for i, p in enumerate(['G3', 'B3', 'D4', 'G4']): n(end + 0.1 + i * 0.08, 'kalimba', p, 1.3, 0.32, -0.2)
# bar 8 beat 3: the tag, as @hml_english settles
for i, p in enumerate(['G6', 'A6', 'B6', 'D7']): n(bt(8, 2) + i * 0.09, 'glockenspiel', p, 0.9, 0.3, 0.25)
strum(bt(8, 3), 'G', 0.45, d=1.2); n(bt(8, 3), 'contrabass_pizz', 'G2', 1.0, 0.6)

# ---------------------------------------------------------------- scene lifts and the pops
for e in EV:
    t = e['t']
    if e['type'] == 'scene' and e['name'] not in ('hook', 'end'):
        for i, p in enumerate(['D5', 'G5', 'B5']): n(t - 0.12 + i * 0.05, 'harp', p, 0.8, 0.32, -0.3 + 0.3 * i)
    elif e['type'] == 'pop':                                            # the pops go on their own layer, set above the music
        k = e['kind']; c = lambda *a: cue.append(dict(zip(('t', 'inst', 'pitch', 'dur', 'vel', 'pan'), a)))
        if k == 'x': c(t, 'marimba', 'E5', 0.5, 0.8, 0); c(t + 0.09, 'marimba', 'C5', 0.6, 0.75, 0)
        elif k == 'tick': c(t, 'hand_chimes', 'G6', 1.2, 0.7, 0.15); c(t, 'glockenspiel', 'B6', 0.8, 0.7, 0.2); c(t + 0.07, 'glockenspiel', 'D7', 1.0, 0.75, 0.2); c(t, 'violins_pizz', 'G5', 0.3, 0.7, -0.1)
        elif k == 'cut': c(t, 'violins_pizz', 'D6', 0.3, 0.8, 0.1); c(t, 'woodblock', None, None, 0.5, 0)
        elif k == 's': c(t, 'hand_chimes', 'B6', 0.9, 0.8, 0.2); c(t, 'glockenspiel', 'B6', 0.8, 0.8, 0.2); c(t, 'violins_pizz', 'B5', 0.3, 0.8, 0.1)

music = S.render(ev, dur=DUR + 3, master=False)
music = S.room(music, 0.4, 0.16)[:N]
pops = S.room(S.render(cue, dur=DUR + 3, master=False), 0.3, 0.12)[:N]
music = music + 1.7 * pops                                              # the pops sit clearly above the band
L = int(DUR * SR); fo = int(0.6 * SR)
music = music[:L].astype(np.float64); music[L - fo:] *= np.linspace(1, 0, fo)[:, None] ** 1.5

# ---------------------------------------------------------------- mix: under Batu's voice when it exists, ducked around his words
vpath = os.path.join(OUT, 'voice.wav')
if os.path.exists(vpath):
    voice, _ = sf.read(vpath, dtype='float64'); voice = np.vstack([voice, np.zeros((max(0, L - len(voice)), 2))])[:L]
    win = int(0.05 * SR); venv = np.sqrt(np.convolve(voice[:, 0] ** 2, np.ones(win) / win, 'same'))
    talk = np.convolve((20 * np.log10(venv + 1e-9) > -38).astype(float), np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')
    rms = lambda x: np.sqrt((x ** 2).mean()) + 1e-12; speech = venv > np.percentile(venv, 55)
    music *= rms(voice[speech, 0]) / rms(music[:, 0]) * 10 ** (-10 / 20)
    mix = voice + music * (10 ** (-5 * talk / 20))[:, None]
else:
    voice = None; mix = music.copy()                                   # preview: music only
mix = np.stack([limit(mix[:, 0], 0.95), limit(mix[:, 1], 0.95)], 1)
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'music.wav'), music.astype(np.float32), SR, subtype='PCM_24')
sf.write(os.path.join(OUT, 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
print(f'mix {L / SR:.2f} s | {60 / B:.0f} BPM | voice: {"yes" if voice is not None else "not yet (music-only preview)"} | instruments:', ', '.join(sorted({e["inst"] for e in ev + cue})))
