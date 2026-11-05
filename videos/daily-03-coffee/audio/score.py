"""Daily English · "Say It Like a Local" series theme, Day 3 cut (ordering coffee). Original, on real CC0 samples only (no synthesised
sound, no noise): ukulele, pizzicato double bass (walking), vibraphone, marimba, kalimba, hand chimes, cajón, soft snare taps, a shaker.
Same family as the other series themes (G major, 128 BPM, the same end-card landing), with a café feel of its own: swung eighths,
jazzy seventh chords (Gmaj7 Em7 Am7 D7) and a walking bass.

Written to the conversation:
  - the shop-door chime on the first frame
  - the barista's question: the vibraphone asks (three notes rising); your answer: the marimba answers (two notes falling), and the ✓
    chime is the note that lands it home
  - the awkward "..." after "I want coffee.": the whole band stops for a beat
  - the band leaves a gap at every ✓ so it is heard; it grows with the order (walking bass from the first exchange, cajón from the second)
  - the recap: the drums drop out; the receipt prints one kalimba note a line; the ink stamp lands on D7; the end card lands on G
All timing comes from edit/events.json (exported by src/day.js). When Batu's voiceover arrives, audio/voice.py writes
audio/out/voice.wav and this script ducks the music under it. Writes audio/out/music.wav and mix.wav.
Run: $LIB/.venv/bin/python audio/score.py"""
import os, sys, json
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, add, limit

S.seed(21)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']; EV = E['ev']
B = 60 / next(e['bpm'] for e in EV if e['type'] == 'clock'); BAR = 4 * B
SW = 0.64                                                               # swing: the off-beat eighth sits at 64% of the beat
def bt(bar, beat=0.0):
    whole = int(beat); frac = beat - whole
    return bar * BAR + (whole + (SW if abs(frac - 0.5) < 1e-6 else frac)) * B
SC = {e['name']: e['t'] for e in EV if e['type'] == 'scene'}
TICKS = [e['t'] for e in EV if e['type'] == 'pop']
DOTS = next(e['t'] for e in EV if e['type'] == 'dots')
N = int((DUR + 3) * SR)
def clear(t):                                                           # gaps the band leaves: every pop, and the awkward "..."
    return any(p - 0.14 <= t < p + 0.2 for p in TICKS) or DOTS <= t < DOTS + B

ev, cue = [], []
def n(t, inst, p, d, v, pan=0.0, force=False):
    if force or not clear(t): ev.append(dict(t=t, inst=inst, pitch=p, dur=d, vel=v, pan=pan))

UKE = {'Gmaj7': ['G3', 'B3', 'D4', 'F#4'], 'Em7': ['E3', 'B3', 'D4', 'G4'], 'Am7': ['A3', 'C4', 'E4', 'G4'], 'D7': ['D4', 'F#4', 'A4', 'C5'],
       'G': ['G3', 'D4', 'G4', 'B4']}
TONES = {'Gmaj7': ['G', 'B', 'D', 'F#'], 'Em7': ['E', 'G', 'B', 'D'], 'Am7': ['A', 'C', 'E', 'G'], 'D7': ['D', 'F#', 'A', 'C']}
WALK = {'Gmaj7': ['G2', 'B2', 'D3', 'D#3'], 'Em7': ['E2', 'G2', 'B2', 'G#2'], 'Am7': ['A2', 'C3', 'E3', 'C#3'], 'D7': ['D2', 'F#2', 'A2', 'F#2']}
PLAN = ['Gmaj7', 'Em7', 'Am7', 'D7', 'Gmaj7', 'Em7', 'Am7']          # bars 0-6; bar 7 is the recap (Am7, then D7 on the stamp), bar 8 the end card

def strum(t, chord, v=0.5, up=False, d=0.45, force=False):
    notes = UKE[chord][::-1] if up else UKE[chord]
    for i, p in enumerate(notes): n(t + 0.011 * i, 'ukulele', p, d, v * (0.8 if up else 1.0), -0.2 + 0.12 * i, force)
def chord_at(t):
    bar = int(t // BAR); return PLAN[bar] if bar < len(PLAN) else ('Am7' if t < SC['end'] - 2 * B else 'D7')

# ---------------------------------------------------------------- the band, bars 0-6
for bar, ch in enumerate(PLAN):
    for beat, up, v, d in [(0, False, 0.52, 0.6), (1, False, 0.34, 0.12), (1.5, True, 0.3, 0.3), (2.5, True, 0.32, 0.3), (3, False, 0.36, 0.12)]:
        t = bt(bar, beat)
        if t >= SC['recap']: continue
        if t < SC['ex1'] and beat not in (0, 2.5): continue           # the hook: just two strums a bar
        if any(p - 0.3 <= t < p for p in TICKS): continue               # and no strum just before a ✓
        strum(t, ch, v, up, d)
    for k, p in enumerate(WALK[ch]):                                    # the bass walks from the first exchange; half notes before
        t = bt(bar, k)
        if t >= SC['recap']: continue
        if t < SC['ex1'] and k % 2: continue
        n(t, 'contrabass_pizz', p, 0.55, 0.72 if k == 0 else 0.6, 0.05)
    for k in range(8):
        t = bt(bar, k / 2)
        if SC['ex1'] <= t < SC['recap']: n(t, 'shaker', 'down' if k % 2 == 0 else 'up', None, 0.15 if k % 2 == 0 else 0.1, 0.35)
    for beat in range(4):
        t = bt(bar, beat)
        if SC['ex2'] <= t < SC['recap']:
            if beat in (0, 2): n(t, 'cajon', 'bass', None, 0.5 if beat == 0 else 0.38, 0)
            else: n(t, 'snare2', 'taps', None, 0.22, 0.1)
            if beat == 3: n(bt(bar, 3.5), 'cajon', 'tone', None, 0.22, -0.1)

# ---------------------------------------------------------------- the first frame: the shop door's chime
n(0.0, 'hand_chimes', 'B5', 1.4, 0.5, -0.15, True); n(0.16, 'hand_chimes', 'G5', 1.6, 0.46, 0.15, True)

# ---------------------------------------------------------------- the conversation: the vibraphone asks, the marimba answers
PC = {'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'B': 11}
NM = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
def line(names, start, up=True):                                       # chord tones as a strictly rising (or falling) line from a start midi note
    out, prev = [], None
    for x in names:
        m = PC[x] + 12 * ((start // 12) + 1)
        while m > (start if prev is None else prev) + (11 if up else 0): m -= 12
        while m <= (start - 1 if prev is None else prev) and up: m += 12
        while not up and prev is not None and m >= prev: m -= 12
        out.append(m); prev = m
    return [f'{NM[m % 12]}{m // 12 - 1}' for m in out]
for e in EV:
    if e['type'] != 'say': continue
    t = e['t']; tn = TONES[chord_at(t)]
    if e['who'] == 'them':                                              # 3rd, 5th, 7th rising from around G4: a question
        for i, p in enumerate(line([tn[1], tn[2], tn[3]], 67)): n(t + i * B / 2 + (SW - 0.5) * B * (i % 2), 'vibraphone', p, 0.7, 0.44, 0.25)
    else:                                                               # 5th, 3rd falling... and the ✓ chime is the note home
        for i, p in enumerate(line([tn[2], tn[1]], 79, up=False)): n(t + i * B / 2, 'marimba', p, 0.3, 0.46, -0.2)

# ---------------------------------------------------------------- the recap: Am7, the receipt prints, the stamp lands on D7
strum(bt(7, 0), 'Am7', 0.45, d=0.9, force=True); n(bt(7, 0), 'contrabass_pizz', 'A2', 0.9, 0.62, force=True)
PRINT = ['E5', 'G5', 'A5', 'C6']
for e in EV:
    if e['type'] == 'line': n(e['t'], 'kalimba', PRINT[e['i']], 0.6, 0.5, -0.2 + 0.12 * e['i'], True); n(e['t'], 'vibraphone', PRINT[e['i']], 0.5, 0.28, 0.2, True)
    if e['type'] == 'stamp':
        t = e['t']; strum(t, 'D7', 0.55, d=0.9, force=True); n(t, 'contrabass_pizz', 'D2', 0.8, 0.75, force=True); n(t, 'cajon', 'bass', None, 0.55, 0, True)
        for i, p in enumerate(['D6', 'F#6', 'A6']): n(t + B / 2 + i * B / 2, 'glockenspiel', p, 0.5, 0.34, 0.25, True)

# ---------------------------------------------------------------- the end card: the series landing on G, then the tag
end = SC['end']
strum(end, 'G', 0.75, d=2.0, force=True); n(end, 'contrabass_pizz', 'G2', 1.8, 0.85, force=True); n(end, 'bass_drum', None, None, 0.5, 0, True)
for i, p in enumerate(['G5', 'B5', 'D6', 'G6', 'B6', 'D7']): n(end + i * 0.05, 'glockenspiel', p, 1.4, 0.4, 0.3 - 0.1 * i, True)
n(end, 'hand_chimes', 'G5', 2.4, 0.42, 0, True); n(end, 'hand_chimes', 'D6', 2.4, 0.34, -0.2, True)
for i, p in enumerate(['G3', 'B3', 'D4', 'G4']): n(end + 0.1 + i * 0.08, 'kalimba', p, 1.3, 0.32, -0.2, True)
for i, p in enumerate(['G6', 'A6', 'B6', 'D7']): n(bt(8, 2) + i * 0.09, 'glockenspiel', p, 0.9, 0.3, 0.25, True)
strum(bt(8, 3), 'G', 0.45, d=1.2, force=True); n(bt(8, 3), 'contrabass_pizz', 'G2', 1.0, 0.6, force=True)

# ---------------------------------------------------------------- the pops (the series' usual ✗ and ✓)
for e in EV:
    if e['type'] != 'pop': continue
    t, k = e['t'], e['kind']; c = lambda *a: cue.append(dict(zip(('t', 'inst', 'pitch', 'dur', 'vel', 'pan'), a)))
    if k == 'x': c(t, 'marimba', 'E5', 0.5, 0.8, 0); c(t + 0.09, 'marimba', 'C5', 0.6, 0.75, 0)
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
