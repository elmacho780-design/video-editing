"""Online-course Reel: music, sound effects and the mix, all driven by edit/events.json (exported from src/edit.js).

Music: an original warm "morning café" groove in F major at 100 BPM. Nylon guitar comping a soft 3-3-2 pattern, upright piano,
pizzicato bass, cajon and shaker, through Fmaj7, Dm7, Gm7, C7. Each scene change lands on a downbeat: the groove restarts at every
section mark in the cue list, and the steam wipes get a rising vibraphone swell into them. A piano stab on each stamp, a rising
marimba note for each class day, a glockenspiel sparkle and a till "ka-ching" on the free month, and the end card resolves on Fmaj9.
The music sits well under his voice and ducks around words. Writes audio/out/music.wav, sfx.wav and mix.wav (48 kHz).
Run: $LIB/.venv/bin/python audio/score.py (after audio/voice.py)"""
import os, sys, json
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio import sfx as X
from core.audio.sfx import SR, add, limit

S.seed(7)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']; EV = E['ev']
at = lambda typ: [e['t'] for e in EV if e['type'] == typ]
SECTIONS = sorted(set(at('section'))); END = at('end')[0]
SWELLS = [(e['t'], e['len']) for e in EV if e['type'] == 'swell']
PAGES = at('page'); STAMPS = [e for e in EV if e['type'] == 'stamp']
N = int((DUR + 3) * SR)
B = 60 / 100                                   # one beat
CH = {  # chord: bass root, guitar voicing, piano voicing
    'Fmaj7': ('F2', ['F3', 'A3', 'C4', 'E4'], ['E4', 'A4', 'C5']),
    'Dm7': ('D2', ['D3', 'F3', 'A3', 'C4'], ['F4', 'A4', 'C5']),
    'Gm7': ('G2', ['G3', 'Bb3', 'D4', 'F4'], ['F4', 'Bb4', 'D5']),
    'C7': ('C3', ['C3', 'E3', 'G3', 'Bb3'], ['E4', 'G4', 'Bb4']),
}
PROG = ['Fmaj7', 'Dm7', 'Gm7', 'C7']
nm = lambda p, k=0: S.name(S.midi(p) + k)
# a short piano line, one phrase per two bars (scale degrees of F major over the progression)
MOTIF = [[(0, 'C5', 1.0), (1.5, 'A4', 0.5), (2, 'G4', 0.5), (2.5, 'A4', 1.2)], [(0, 'F4', 0.6), (1, 'A4', 0.5), (1.5, 'C5', 0.5), (2, 'D5', 1.4)],
         [(0, 'D5', 0.5), (0.5, 'C5', 0.5), (1, 'Bb4', 0.5), (2, 'A4', 1.2)], [(0, 'G4', 0.6), (1, 'E4', 0.5), (2, 'G4', 0.5), (3, 'Bb4', 0.8)]]

ev = []
def chord_at(t):
    """the chord sounding at output time t (each section restarts the progression on its downbeat)"""
    s0 = max([s for s in SECTIONS if s <= t + 1e-6], default=0)
    return PROG[int((t - s0) / (4 * B)) % 4]

def groove(t0, t1, full=True, piano=True, drums=True):
    bar = 0
    while t0 + bar * 4 * B < t1 - 0.05:
        tb = t0 + bar * 4 * B; ch = PROG[bar % 4]; root, gtr, pno = CH[ch]
        nxt = CH[PROG[(bar + 1) % 4]][0]
        # pizzicato bass: root, fifth, root, a step towards the next chord
        for b, p, d, v in [(0, root, 0.55, 0.62), (1.5, nm(root, 7), 0.3, 0.45), (2, root, 0.5, 0.55), (3.5, nm(nxt, -1 if S.midi(nxt) > S.midi(root) else 1), 0.3, 0.42)]:
            if tb + b * B < t1: ev.append((tb + b * B, 'contrabass_pizz', p, d, v, 0.05))
        # nylon guitar: soft strums in a 3-3-2 pattern (eighths 0, 3, 6), plus a light upbeat on the last eighth
        for e8, v in [(0, 0.5), (3, 0.38), (6, 0.42), (7, 0.24)]:
            t = tb + e8 * B / 2
            if t >= t1: break
            for k, p in enumerate(gtr if e8 != 7 else gtr[1:]):
                ev.append((t + k * 0.011, 'guitar_nylon', p, 0.9 if e8 != 7 else 0.3, v * (0.9 + 0.1 * (k % 2)), -0.3 + 0.12 * k))
        if drums and full:
            for k in range(8):
                t = tb + k * B / 2
                if t < t1: ev.append((t, 'shaker', 'down' if k % 2 == 0 else 'up', None, 0.2 if k % 2 == 0 else 0.13, 0.35))
            for b, var, v in [(0, 'bass', 0.42), (1.5, 'tone', 0.16), (2, 'slap', 0.26), (3.5, 'bass', 0.28)]:
                if tb + b * B < t1: ev.append((tb + b * B, 'cajon', var, None, v, -0.05))
        elif drums:
            for k in range(0, 8, 2):
                t = tb + k * B / 2
                if t < t1: ev.append((t, 'shaker', 'down', None, 0.15, 0.35))
        if piano and full:
            for b, p, d in MOTIF[bar % 4]:
                t = tb + b * B
                if t < t1 - 0.1: ev.append((t, 'upright', p, d, 0.36, 0.2))
        bar += 1

# sections: the intro is lighter (no drums in the first bar, then shaker only); each later scene lands on a downbeat
bounds = SECTIONS + [END]
for i, (a, b) in enumerate(zip(bounds[:-1], bounds[1:])):
    stop = min([s for s, _ in SWELLS if a < s <= b] + [p for p in PAGES if a + 1 < p <= b and p > b - 0.5] + [b])
    if i == 0:
        groove(a, a + 4 * B, full=False, piano=False, drums=False)
        groove(a + 4 * B, stop, full=False, piano=False)
    else:
        groove(a, stop, full=True, piano=i != 3)
    # a downbeat lift on each new scene: vibraphone chord and a soft triangle
    if i > 0:
        _, _, pno = CH['Fmaj7']
        for p in pno: ev.append((a, 'vibraphone', nm(p, 12) if S.midi(p) < 65 else p, 1.6, 0.34, 0.25))
        ev.append((a, 'triangle', 'open', None, 0.16, -0.4))
# the opening: a two-note café piano pickup on frame one
ev += [(0.0, 'upright', 'C5', 0.4, 0.5, 0.2), (0.3, 'upright', 'F5', 0.9, 0.46, 0.2), (0.3, 'upright', 'A4', 0.9, 0.36, 0.2)]
# swells into each steam wipe: a rising vibraphone arpeggio
for s, ln in SWELLS:
    notes = ['F4', 'A4', 'C5', 'E5', 'F5', 'A5', 'C6']
    for k, p in enumerate(notes): ev.append((s + k * ln / len(notes), 'vibraphone', p, 0.9, 0.28 + 0.04 * k, -0.3 + 0.1 * k))
# stamps: a short piano stab on the chord of the moment (the loyalty card's three stamps get a soft bass thump instead)
for e in STAMPS:
    if e.get('soft'): ev.append((e['t'], 'contrabass_pizz', ['F2', 'A2', 'C3'][e.get('n', 0)], 0.3, 0.55, 0)); continue
    _, gtr, pno = CH[chord_at(e['t'])]
    for p in pno: ev.append((e['t'] + 0.01, 'upright', p, 0.35, 0.5, 0.15))
    ev.append((e['t'], 'contrabass_pizz', CH[chord_at(e['t'])][0], 0.4, 0.7, 0))
# the "=" and the notebook in the hook, the question
for e in EV:
    if e['type'] == 'draw' and e['t'] < 3: ev.append((e['t'] + 0.12, 'glockenspiel', 'C6', 1.0, 0.36, 0.2))
    if e['type'] == 'pop' and e['t'] < 3: ev.append((e['t'], 'glockenspiel', 'F6', 1.0, 0.4, 0.25))
    if e['type'] == 'day': ev.append((e['t'], 'marimba', ['F4', 'A4', 'C5'][e['n']], 0.9, 0.55, -0.2)); ev.append((e['t'], 'glockenspiel', ['F5', 'A5', 'C6'][e['n']], 0.9, 0.3, 0.2))
    if e['type'] == 'kaching':
        for i, p in enumerate(['C6', 'F6', 'A6', 'C7', 'F7']): ev.append((e['t'] + 0.08 + i * 0.045, 'glockenspiel', p, 1.2, 0.4, 0.3 - i * 0.12))
        ev.append((e['t'] + 0.08, 'hand_chimes', 'F5', 2.0, 0.42, 0))
# the end card: everything resolves on Fmaj9 and rings out
ef = END
for p, inst, v in [('F2', 'contrabass_pizz', 0.7), ('F3', 'guitar_nylon', 0.55), ('C4', 'guitar_nylon', 0.5), ('E4', 'guitar_nylon', 0.5), ('G4', 'guitar_nylon', 0.48), ('A4', 'guitar_nylon', 0.48),
                   ('A4', 'upright', 0.45), ('C5', 'upright', 0.42), ('E5', 'upright', 0.4), ('G5', 'upright', 0.4), ('F5', 'vibraphone', 0.36), ('C6', 'glockenspiel', 0.34), ('F6', 'glockenspiel', 0.3)]:
    k = len([x for x in ev if x[0] >= ef and x[1] == inst])
    ev.append((ef + (0.014 * k if inst == 'guitar_nylon' else 0), inst, p, 2.4, v, 0))
ev.append((ef, 'hand_chimes', 'C6', 2.4, 0.36, 0.2)); ev.append((ef, 'cajon', 'bass', None, 0.4, 0))
music = S.render([dict(t=t, inst=i, pitch=p, dur=d, vel=v, pan=pn) for t, i, p, d, v, pn in ev], dur=DUR + 3, master=False)
music = S.room(music, 0.42, 0.18)[:N]

# ---------------------------------------------------------------- sound effects
def paper(v=1.0, bright=1.0, d=0.09):
    n = X.noise(d) * X.env_exp(d, 0.014)
    return v * (0.7 * X.bp(n, 900 * bright, 5200, 2) + 0.35 * X.thump(1, 110)[:len(n)])
def page(v=1.0):
    d = 0.26; t = X.t_(d); env = np.clip(t / 0.03, 0, 1) * np.exp(-t * 11)
    return v * X.bp(X.noise(d), 1200, 7000, 2) * env + 0.3 * v * X.thump(1, 95)[:int(d * SR)]
def pen(v=1.0, d=0.22):
    t = X.t_(d); env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 0.6
    return v * X.bp(X.noise(d), 2600, 7000, 2) * env * (0.6 + 0.4 * np.sin(2 * np.pi * 26 * t))
def stamp(v=1.0):
    d = 0.18; n = X.noise(d) * X.env_exp(d, 0.02)
    return v * (X.thump(1, 62)[:len(n)] * 1.2 + 0.4 * X.bp(n, 300, 2500))
def flap(v=1.0):
    d = 0.035; n = X.noise(d) * X.env_exp(d, 0.004); return v * X.bp(n, 1800, 7000, 2)
def clink(v=1.0):
    d = 0.6; t = X.t_(d)                                            # a ceramic cup: a few inharmonic partials, a quick decay
    return v * sum(a * np.sin(2 * np.pi * f * t) * np.exp(-t * k) for f, a, k in [(2140, 1, 9), (3310, 0.6, 12), (5230, 0.35, 16), (7400, 0.2, 22)]) * np.clip(t / 0.001, 0, 1)
def swell(ln, v=1.0):
    d = ln + 0.15; t = X.t_(d); env = np.clip(t / ln, 0, 1) ** 2 * np.exp(-np.clip(t - ln, 0, None) * 25)
    return v * X.bp(X.noise(d), 1500, 9000, 2) * env
def kaching(v=1.0):
    d = 0.06; n = X.noise(d) * X.env_exp(d, 0.008)
    return v * (X.bp(n, 2500, 9000, 2) + 0.5 * X.thump(1, 180)[:len(n)])

fx = np.zeros((N, 2), np.float32)
for e in EV:
    t, k = e['t'], e['type']
    if k == 'clink': add(fx, clink(), t, 0.22, 0.2)
    elif k == 'whoosh': add(fx, X.whoosh(0.5, 1.0), t, 0.16 if e.get('soft') else 0.26, 0)
    elif k == 'swell': add(fx, swell(e['len']), t, 0.2, 0)
    elif k == 'slap': add(fx, paper(), t, 0.4, 0)
    elif k == 'page': add(fx, page(), t, 0.36, -0.15)
    elif k == 'draw': add(fx, pen(1.0, 0.2), t, 0.24, 0.3)
    elif k == 'tick': add(fx, pen(1.0, 0.16), t, 0.28, 0.3)
    elif k == 'stamp': add(fx, stamp(0.75 if e.get('soft') else 1.0), t, 0.42, 0.2)
    elif k == 'flap': add(fx, flap(), t, 0.22, 0.15)
    elif k == 'ding': add(fx, X.ding(1.0), t, 0.26, 0.3)
    elif k == 'pop': add(fx, X.pop(1.0), t, 0.28, 0)
    elif k == 'kaching': add(fx, kaching(), t, 0.4, 0.2)

# ---------------------------------------------------------------- mix: music ducked under the voice
voice, _ = sf.read(os.path.join(OUT, 'voice.wav'), dtype='float32')
voice = np.vstack([voice, np.zeros((N - len(voice), 2), np.float32)])[:N]
venv = np.sqrt(np.convolve(voice[:, 0] ** 2, np.ones(int(0.05 * SR)) / int(0.05 * SR), 'same'))
duck = np.where(20 * np.log10(venv + 1e-9) > -38, 10 ** (-5 / 20), 1.0)
duck = np.convolve(duck, np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')       # slow attack and release, no pumping
rms = lambda x: np.sqrt((x ** 2).mean()) + 1e-12
speech = venv > np.percentile(venv, 55)
v_rms = rms(voice[speech, 0])
m_gain = v_rms / rms(music[:int(END * SR), 0]) * 10 ** (-10.5 / 20)   # music about 10 dB under speech, then ducks 5 dB more
music *= m_gain
L = int(DUR * SR)
music = music * duck[:, None]
fo = int(0.35 * SR); music[L - fo:L] *= np.linspace(1, 0, fo)[:, None] ** 1.5     # the last chord fades into the loop point
fx *= 10 ** (-2.5 / 20)
mix = voice + music + fx
mix = mix[:L]
mix = np.stack([limit(mix[:, 0], 0.95), limit(mix[:, 1], 0.95)], 1)
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'music.wav'), music[:L], SR, subtype='PCM_24')
sf.write(os.path.join(OUT, 'sfx.wav'), fx[:L], SR, subtype='PCM_24')
sf.write(os.path.join(OUT, 'mix.wav'), mix, SR, subtype='PCM_24')
print('mix', L / SR, 's | sections', [round(s, 2) for s in SECTIONS], '| instruments:', ', '.join(sorted({i for _, i, *_ in ev})))
