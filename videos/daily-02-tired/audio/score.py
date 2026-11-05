"""Daily English · "One Word, Three Levels" series theme, Day 2 cut. Original, on real CC0 samples only (no synthesised sound, no noise):
ukulele, pizzicato double bass, marimba, glockenspiel, kalimba, harp, hand chimes, a light shaker, claps and a soft bass drum.
Same family as the "Stop Saying This" theme (G major, 128 BPM, the same end-card landing, so the series sounds like one brand),
with its own tune: every phrase starts with three rising steps, like climbing the levels.

The band climbs with the levels (bar = 1.875 s):
  hook       ukulele on two strums, bass, and the glockenspiel asking the three-step question (G A B ... D)
  level 1    the full strum, a shaker, and the tune on marimba
  level 2    the kick and claps come in
  level 3    the glockenspiel doubles the tune and a kalimba runs underneath: everything is playing
  recap      the drums drop out; G over D, then D7, and the three level notes ring out as each step is named
  end card   a full G with a glockenspiel run and chimes (the same landing as every series day), then the tag
Each level's word lands with a pop a step higher than the last (G, B, D: a G major chord built one level at a time); the recap plays
the same three notes; the ✗ and ✓ on the "very / absolutely" tip are the series' usual marimba and glockenspiel pops.
All timing comes from edit/events.json (exported by src/day.js). When Batu's voiceover arrives, audio/voice.py writes
audio/out/voice.wav and this script ducks the music under it. Writes audio/out/music.wav and mix.wav.
Run: $LIB/.venv/bin/python audio/score.py"""
import os, sys, json
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, add, limit

S.seed(12)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']; EV = E['ev']
B = 60 / next(e['bpm'] for e in EV if e['type'] == 'clock'); BAR = 4 * B
bt = lambda bar, beat=0.0: bar * BAR + beat * B
SC = {e['name']: e['t'] for e in EV if e['type'] == 'scene'}
N = int((DUR + 3) * SR)

ev, cue = [], []
def n(t, inst, p, d, v, pan=0.0): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan))

UKE = {'G': ['G3', 'D4', 'G4', 'B4'], 'Em': ['E3', 'B3', 'E4', 'G4'], 'C': ['C4', 'E4', 'G4', 'C5'], 'D': ['D4', 'F#4', 'A4', 'D5'],
       'D7': ['D4', 'F#4', 'A4', 'C5'], 'G/D': ['D4', 'G4', 'B4', 'D5']}
ROOT_ = {'G': 'G2', 'Em': 'E2', 'C': 'C3', 'D': 'D3', 'D7': 'D3', 'G/D': 'D3'}
FIFTH = {'G': 'D3', 'Em': 'B2', 'C': 'G2', 'D': 'A2', 'D7': 'A2', 'G/D': 'A2'}
PLAN = ['G', 'Em', 'C', 'D', 'G', 'Em', 'C']                         # bars 0-6; bar 7 is the recap cadence, bar 8 the end card
TIP = next(e['t'] for e in EV if e['type'] == 'pop' and e['kind'] == 'tick')
HOLE = {(round(TIP / BAR), 0), (round(TIP / BAR), 1)}                   # the band leaves the ✓'s downbeat (and the beat after) to the ✓

def strum(t, chord, v=0.55, up=False, d=0.5):
    notes = UKE[chord][::-1] if up else UKE[chord]
    for i, p in enumerate(notes): n(t + 0.012 * i, 'ukulele', p, d, v * (0.8 if up else 1.0), -0.2 + 0.12 * i)

# ---------------------------------------------------------------- the band, bars 0-6, growing with the levels
for bar, ch in enumerate(PLAN):
    for beat, up, v in [(0, False, 0.6), (1, False, 0.42), (1.5, True, 0.36), (2.5, True, 0.36), (3, False, 0.45), (3.5, True, 0.34)]:
        t = bt(bar, beat)
        if t >= SC['recap'] or (bar, beat) in HOLE: continue
        if t < SC['l1'] and beat not in (0, 2.5): continue             # the hook: two strums a bar, room for the question
        strum(t, ch, v, up)
    n(bt(bar, 0), 'contrabass_pizz', ROOT_[ch], 0.8, 0.7, 0.05)
    if bt(bar, 2) < SC['recap']: n(bt(bar, 2), 'contrabass_pizz', FIFTH[ch], 0.8, 0.55, 0.05)
    for k in range(8):                                                  # level 1 on: the shaker
        t = bt(bar, k / 2)
        if SC['l1'] <= t < SC['recap']: n(t, 'shaker', 'down' if k % 2 == 0 else 'up', None, 0.16 if k % 2 == 0 else 0.1, 0.35)
    for beat in range(4):                                               # level 2 on: kick on 1 and 3, claps on 2 and 4
        t = bt(bar, beat)
        if SC['l2'] <= t < SC['recap']:
            if (bar, beat) in HOLE: continue
            if beat in (0, 2): n(t, 'bass_drum', None, None, 0.42 if beat == 0 else 0.32, 0)
            else: n(t, 'claps', 'solo', None, 0.28, -0.1 if beat == 1 else 0.1)
n(0, 'bass_drum', None, None, 0.45, 0)                                  # one soft thump on the very first frame

# ---------------------------------------------------------------- the hook's question, then the tune (marimba; glockenspiel doubles from level 3)
for beat, p, d in [(1, 'G5', .5), (1.5, 'A5', .5), (2, 'B5', 1), (3, 'D6', 1.5)]: n(bt(0, beat), 'glockenspiel', p, d * B * 1.6, 0.42, 0.25)
TUNE = {1: [(0, 'E5', .5), (.5, 'F#5', .5), (1, 'G5', 1), (2.5, 'B5', .5), (3, 'G5', 1)],
        2: [(0, 'E5', .5), (.5, 'F#5', .5), (1, 'G5', .5), (1.5, 'A5', .5), (2, 'C6', 1), (3, 'B5', .5), (3.5, 'A5', .5)],
        3: [(0, 'F#5', .5), (.5, 'G5', .5), (1, 'A5', 1), (2.5, 'D6', .5), (3, 'A5', 1)],
        4: [(0, 'G5', .5), (.5, 'A5', .5), (1, 'B5', 1), (2.5, 'D6', .5), (3, 'B5', 1)],
        5: [(0, 'G5', .5), (.5, 'A5', .5), (1, 'B5', .5), (1.5, 'C6', .5), (2, 'E6', 1), (3, 'D6', .5), (3.5, 'B5', .5)],
        6: [(0, 'C6', .5), (.5, 'D6', .5), (1, 'E6', 1), (2, 'G6', 1)]}
for bar, notes in TUNE.items():
    for beat, p, d in notes:
        t = bt(bar, beat)
        if t < SC['l1'] or t >= SC['recap'] or (bar, beat) in HOLE or (bar, beat) == (round(TIP / BAR), 0.5): continue
        n(t, 'marimba', p, d * B * 1.2, 0.46, -0.2)
        if t >= SC['l3']: n(t, 'glockenspiel', p, d * B * 1.5, 0.3, 0.25)
KAL = {5: ['E4', 'G4', 'B4', 'E5'], 6: ['C4', 'E4', 'G4', 'C5']}        # level 3: kalimba eighths under the tune
for bar, notes in KAL.items():
    for k in range(8):
        t = bt(bar, k / 2)
        if SC['l3'] <= t < SC['recap']: n(t, 'kalimba', notes[k % 4], 0.45, 0.3, -0.3 + 0.08 * k)

# ---------------------------------------------------------------- the recap: G over D, then D7; the three level notes as each step is named
strum(bt(7, 0), 'G/D', 0.5, d=0.9); n(bt(7, 0), 'contrabass_pizz', 'D3', 0.9, 0.62)
strum(bt(7, 2), 'D7', 0.5, d=0.9); n(bt(7, 2), 'contrabass_pizz', 'D3', 0.6, 0.6)
STEP = ['G5', 'B5', 'D6']
for e in EV:
    if e['type'] == 'step':
        p = STEP[e['lv']]; lo = p.replace('5', '4').replace('6', '5')
        n(e['t'], 'glockenspiel', p, 0.9, 0.62, 0.2); n(e['t'], 'marimba', lo, 0.6, 0.6, -0.1); n(e['t'], 'harp', lo, 0.9, 0.4, -0.2)
for i, p in enumerate(['D6', 'F#6', 'A6']): n(bt(7, 2.5) + i * B / 2, 'glockenspiel', p, 0.5, 0.34, 0.25)

# ---------------------------------------------------------------- the end card: the series landing on G, then the tag
end = SC['end']
strum(end, 'G', 0.75, d=2.0); n(end, 'contrabass_pizz', 'G2', 1.8, 0.85); n(end, 'bass_drum', None, None, 0.5, 0)
for i, p in enumerate(['G5', 'B5', 'D6', 'G6', 'B6', 'D7']): n(end + i * 0.05, 'glockenspiel', p, 1.4, 0.4, 0.3 - 0.1 * i)
n(end, 'hand_chimes', 'G5', 2.4, 0.42, 0); n(end, 'hand_chimes', 'D6', 2.4, 0.34, -0.2)
for i, p in enumerate(['G3', 'B3', 'D4', 'G4']): n(end + 0.1 + i * 0.08, 'kalimba', p, 1.3, 0.32, -0.2)
for i, p in enumerate(['G6', 'A6', 'B6', 'D7']): n(bt(8, 2) + i * 0.09, 'glockenspiel', p, 0.9, 0.3, 0.25)
strum(bt(8, 3), 'G', 0.45, d=1.2); n(bt(8, 3), 'contrabass_pizz', 'G2', 1.0, 0.6)

# ---------------------------------------------------------------- each card slides in on a harp glide; the pops
GLIDE = {'l1': ['E4', 'G4', 'B4', 'E5'], 'l2': ['C4', 'E4', 'G4', 'C5'], 'l3': ['E4', 'G4', 'B4', 'E5']}
for name, notes in GLIDE.items():
    for i, p in enumerate(notes): n(SC[name] - 0.16 + i * 0.045, 'harp', p, 0.7, 0.3, -0.3 + 0.2 * i)
LVP = [('G5', 'G6'), ('B5', 'B6'), ('D6', 'D7')]
for e in EV:
    if e['type'] != 'pop': continue
    t, k = e['t'], e['kind']; c = lambda *a: cue.append(dict(zip(('t', 'inst', 'pitch', 'dur', 'vel', 'pan'), a)))
    if k == 'lvl':                                                      # a step higher each level
        lo, hi = LVP[e['lv']]; c(t, 'hand_chimes', lo, 1.1, 0.8, 0.1); c(t, 'glockenspiel', hi, 0.9, 0.8, 0.2); c(t, 'violins_pizz', lo, 0.3, 0.8, -0.1)
    elif k == 'x': c(t, 'marimba', 'E5', 0.5, 0.8, 0); c(t + 0.09, 'marimba', 'C5', 0.6, 0.75, 0)
    elif k == 'tick': c(t, 'hand_chimes', 'G6', 1.2, 0.7, 0.15); c(t, 'glockenspiel', 'B6', 0.8, 0.7, 0.2); c(t + 0.07, 'glockenspiel', 'D7', 1.0, 0.75, 0.2); c(t, 'violins_pizz', 'G5', 0.3, 0.7, -0.1)

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
