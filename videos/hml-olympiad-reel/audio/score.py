"""Olympiad Reel: music, sound effects and the final mix, all driven by edit/events.json (exported from src/edit.js).

Music: an original bright groove in F major at 112 BPM. Marimba arpeggios, pizzicato bass, soft claps and shaker; a glockenspiel
line on the olympiad page with one rising note per tile; it stops dead for the off-camera shout and restarts on "Аан, тийм!"
with a ta-da; a sparkle on the free month; the end card resolves on a ringing F major chord at the loop point.
The music is ducked under the voice. Writes audio/out/music.wav, sfx.wav and mix.wav (48 kHz).
Run: $LIB/.venv/bin/python audio/score.py (after audio/voice.py)"""
import os, sys, json
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from scipy.signal import butter, sosfilt
from core.audio import sampler as S
from core.audio import sfx as X
from core.audio.sfx import SR, add, limit

S.seed(11)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']; EV = E['ev']
at = lambda typ: [e['t'] for e in EV if e['type'] == typ]
STOP, GO = at('musicStop')[0], at('musicGo')[0]
TILES = at('tile'); GIFT = at('tada')[0]; WIPES = at('whoosh'); END = at('chime')[0]
SCENE = (WIPES[0], WIPES[1] + 0.45)
N = int((DUR + 3) * SR)
B = 60 / 112                                   # one beat
CH = {'F': ('F2', ['F4', 'A4', 'C5']), 'C': ('C3', ['E4', 'G4', 'C5']), 'Dm': ('D3', ['D4', 'F4', 'A4']), 'Bb': ('Bb2', ['D4', 'F4', 'Bb4'])}
PROG = ['F', 'C', 'Dm', 'Bb']
nm = lambda p, k=0: S.name(S.midi(p) + k)

ev = []
def groove(t0, t1, intro=False, bright=False):
    """bars of the groove from t0 (a downbeat) until t1"""
    bar = 0
    while t0 + bar * 4 * B < t1 - 0.05:
        tb = t0 + bar * 4 * B; ch = PROG[bar % 4]; root, tones = CH[ch]
        arp = [tones[0], tones[1], tones[2], nm(tones[0], 12), tones[2], tones[1], tones[0], tones[2]]
        for i, p in enumerate(arp):
            t = tb + i * B / 2
            if t >= t1: break
            ev.append((t, 'marimba', p, 0.4, 0.42 if i % 2 == 0 else 0.3, 0.25 if i % 2 else -0.25))
        for i, p in enumerate([root, nm(root, 7)]):
            if tb + i * 2 * B < t1: ev.append((tb + i * 2 * B, 'contrabass_pizz', p, 0.5, 0.62, 0.1))
        if not (intro and bar == 0):
            for k in (1, 3):
                if tb + k * B < t1: ev.append((tb + k * B, 'claps', None, None, 0.22, 0.0))
            for k in range(8):
                if tb + k * B / 2 < t1: ev.append((tb + k * B / 2, 'shaker', 'down' if k % 2 == 0 else 'up', None, 0.16 if k % 2 else 0.24, 0.35))
        if bright:
            ev.append((tb, 'violins_pizz', nm(tones[2], 12), 0.4, 0.4, -0.4)); ev.append((tb + 2 * B, 'violins_pizz', nm(tones[1], 12), 0.4, 0.36, -0.4))
        bar += 1

groove(0.0, STOP, intro=True)
groove(GO + 0.55, END + 0.2, bright=True)
# the olympiad page: a glockenspiel line on top, and one rising bell per olympiad as its tile lands
for i, t in enumerate(TILES): ev.append((t, 'glockenspiel', ['F5', 'A5', 'C6', 'F6'][i], 1.2, 0.5, 0.2)); ev.append((t, 'vibraphone', ['F4', 'A4', 'C5', 'F5'][i], 1.2, 0.4, -0.2))
for t in WIPES[:2]: ev.append((t + 0.38, 'triangle', 'open', None, 0.25, -0.4))
# restart after the shout: "Аан, тийм!" lands on a bright ta-da
for p in ['F3', 'C4', 'F4', 'A4', 'C5', 'F5']: ev.append((GO, 'violins_pizz' if S.midi(p) > 60 else 'cellos_pizz', p, 0.6, 0.6, 0))
ev.append((GO, 'glockenspiel', 'F6', 1.5, 0.5, 0.3)); ev.append((GO, 'triangle', 'open', None, 0.3, -0.4))
# the free month: a sparkle run and a chime
for i, p in enumerate(['C6', 'F6', 'A6', 'C7', 'F7']): ev.append((GIFT + i * 0.05, 'glockenspiel', p, 1.2, 0.42, 0.3 - i * 0.12))
ev.append((GIFT, 'hand_chimes', 'F5', 2.0, 0.45, 0))
# the end card: everything resolves on F, ringing out to the loop point
ef = END + 0.2
for p, inst in [('F2', 'contrabass_pizz'), ('F3', 'cellos_pizz'), ('C4', 'marimba'), ('F4', 'marimba'), ('A4', 'marimba'), ('C5', 'marimba'), ('F5', 'glockenspiel'), ('A5', 'glockenspiel')]:
    ev.append((ef, inst, p, 2.5, 0.75, 0))
ev.append((ef, 'hand_chimes', 'C6', 2.5, 0.4, 0.2)); ev.append((ef, 'vibraphone', 'F4', 2.5, 0.4, -0.2))
music = S.render([dict(t=t, inst=i, pitch=p, dur=d, vel=v, pan=pn) for t, i, p, d, v, pn in ev], dur=DUR + 3, master=False)
music = S.room(music, 0.4, 0.16)[:N]
# hard stop for the shout (a tiny fade so it doesn't click)
gate = np.ones(N); a, b = int(STOP * SR), int((GO - 0.005) * SR); gate[a:b] = 0; gate[a - 240:a] = np.linspace(1, 0, 240)
music *= gate[:, None]

# ---------------------------------------------------------------- sound effects
def paper(v=1.0, bright=1.0):
    d = 0.09; n = X.noise(d) * X.env_exp(d, 0.014)
    return v * (0.7 * X.bp(n, 900 * bright, 5200, 2) + 0.35 * X.thump(1, 110)[:len(n)])
def pen(v=1.0):
    d = 0.22; t = X.t_(d); env = np.sin(np.pi * np.clip(t / d, 0, 1)) ** 0.6
    return v * X.bp(X.noise(d), 2600, 7000, 2) * env * (0.6 + 0.4 * np.sin(2 * np.pi * 26 * t))
def boing(v=1.0):
    d = 0.7; t = X.t_(d); f = 170 * (1 + 0.45 * np.exp(-t * 5) * np.sin(2 * np.pi * 11 * t)) * (1 + 0.6 * np.exp(-t * 9))
    ph = 2 * np.pi * np.cumsum(f) / SR; return v * (np.sin(ph) + 0.3 * np.sin(2 * ph)) * np.exp(-t * 4.5) * np.clip(t / 0.005, 0, 1)
def stamp(v=1.0):
    d = 0.18; n = X.noise(d) * X.env_exp(d, 0.02)
    return v * (X.thump(1, 62)[:len(n)] * 1.2 + 0.4 * X.bp(n, 300, 2500))
def flap(v=1.0):
    d = 0.035; n = X.noise(d) * X.env_exp(d, 0.004); return v * X.bp(n, 1800, 7000, 2)

fx = np.zeros((N, 2), np.float32)
for e in EV:
    t, k = e['t'], e['type']
    if k == 'whoosh': add(fx, X.whoosh(0.5, 1.0), t, 0.28, 0)
    elif k == 'slap': add(fx, paper(), t, 0.42, 0)
    elif k == 'tile': add(fx, paper(0.9, 0.8), t, 0.38, -0.1)
    elif k == 'tick': add(fx, pen(), t, 0.3, 0.3)
    elif k == 'flap': add(fx, flap(), t, 0.22, 0.15)
    elif k == 'stamp': add(fx, stamp(), t, 0.42, 0.25)
    elif k == 'boing': add(fx, boing(), t, 0.32, 0); add(fx, X.whoosh(0.25, 1.0), t - 0.12, 0.3, 0)
    elif k == 'comic': add(fx, X.pop(1.0), t, 0.28, 0); add(fx, X.thump(0.6, 90), t, 0.22, 0)
    elif k == 'ding': add(fx, X.ding(1.0), t, 0.32, 0.3)
    elif k == 'page': add(fx, paper(0.8, 1.2), t, 0.34, -0.2)
    elif k == 'pop': add(fx, X.pop(1.0), t, 0.3, 0)

# ---------------------------------------------------------------- mix: music ducked under the voice
voice, _ = sf.read(os.path.join(OUT, 'voice.wav'), dtype='float32')
voice = np.vstack([voice, np.zeros((N - len(voice), 2), np.float32)])[:N]
venv = np.sqrt(np.convolve(voice[:, 0] ** 2, np.ones(int(0.05 * SR)) / int(0.05 * SR), 'same'))
duck = np.where(20 * np.log10(venv + 1e-9) > -38, 10 ** (-5 / 20), 1.0)
duck = np.convolve(duck, np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')       # slow attack and release, no pumping
rms = lambda x: np.sqrt((x ** 2).mean()) + 1e-12
speech = venv > np.percentile(venv, 55)
v_rms = rms(voice[speech, 0])
m_gain = v_rms / rms(music[:int(STOP * SR), 0]) * 10 ** (-10 / 20)     # music sits about 10 dB under speech, then ducks 5 dB more
music *= m_gain
mix = voice + music * duck[:, None] + fx
L = int(DUR * SR); mix = mix[:L]; fo = int(0.12 * SR); mix[-fo:] *= np.linspace(1, 0.3, fo)[:, None]
mix = np.stack([limit(mix[:, 0], 0.95), limit(mix[:, 1], 0.95)], 1)
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'music.wav'), (music * duck[:, None])[:L], SR, subtype='PCM_24')
sf.write(os.path.join(OUT, 'sfx.wav'), fx[:L], SR, subtype='PCM_24')
sf.write(os.path.join(OUT, 'mix.wav'), mix, SR, subtype='PCM_24')
print('mix', L / SR, 's | instruments:', ', '.join(sorted({i for _, i, *_ in ev})))
