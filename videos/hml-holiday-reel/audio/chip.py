"""A small, clean game-console synth for the Level Up score: pulse waves (12.5 / 25 / 50 % duty) for leads and arpeggios, a triangle
for the bass, pitch sweeps for jingles. Built additively from harmonics, so it is band-limited (no aliasing fizz) and rolled off above
~7 kHz, which keeps the classic chip colour but takes the harshness out. No noise channel: percussion comes from real drum samples.
All functions return mono float64 at 48 kHz."""
import numpy as np

SR = 48000
NAMES = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11}
def midi(p):
    """'C#5', 'Eb4', 'A3' or a number -> MIDI note (C4 = 60)"""
    if isinstance(p, (int, float)): return float(p)
    n = NAMES[p[0].upper()]; i = 1
    while i < len(p) and p[i] in '#b': n += 1 if p[i] == '#' else -1; i += 1
    return n + 12 * (int(p[i:]) + 1)
hz = lambda m: 440.0 * 2 ** ((midi(m) - 69) / 12)

def adsr(n_on, a=0.004, d=0.09, s=0.6, r=0.06):
    """envelope for a note held n_on samples, plus its release"""
    na, nd, nr = max(1, int(a * SR)), max(1, int(d * SR)), max(1, int(r * SR))
    e = np.full(n_on, s, float)
    e[:min(na, n_on)] = np.linspace(0, 1, na)[:min(na, n_on)]
    if n_on > na: k = min(nd, n_on - na); e[na:na + k] = np.linspace(1, s, nd)[:k]
    last = e[-1] if n_on else 0
    return np.concatenate([e, last * np.linspace(1, 0, nr) ** 1.5])

def _phase(freq):
    return 2 * np.pi * np.cumsum(freq) / SR

def _lp(f, fc=7000.0):
    return 1.0 / np.sqrt(1.0 + (f / fc) ** 4)            # a gentle 2nd-order roll-off, per harmonic

def pulse(freq, duty=0.25, fc=7000.0):
    """band-limited pulse wave following the instantaneous frequency array `freq`"""
    ph = _phase(freq); f0 = float(np.median(freq)); out = np.zeros_like(freq)
    for n in range(1, int(min(80, 9500 / max(f0, 20))) + 1):
        out += (2 / (n * np.pi)) * np.sin(n * np.pi * duty) * _lp(n * f0, fc) * np.cos(n * ph - n * np.pi * duty)
    return out

def triangle(freq, fc=6000.0):
    ph = _phase(freq); f0 = float(np.median(freq)); out = np.zeros_like(freq)
    for k in range(0, 40):
        n = 2 * k + 1
        if n * f0 > 9500: break
        out += (8 / np.pi ** 2) * ((-1) ** k) / n ** 2 * _lp(n * f0, fc) * np.sin(n * ph)
    return out

def tone(kind, pitch, dur, vel=0.8, duty=0.25, a=0.004, d=0.09, s=0.6, r=0.06, vib=0.0, vib_delay=0.14, vib_rate=5.8,
         slide=0.0, slide_time=0.0, glide_from=None, glide_time=0.03, fc=7000.0):
    """one note: kind 'pulse' or 'tri'. vib = vibrato depth in semitones (starts after vib_delay);
    slide = semitones the pitch bends over slide_time (for blips and drops); glide_from = start pitch for a quick scoop"""
    n_on = max(1, int(dur * SR)); env = adsr(n_on, a, d, s, r); n = len(env); t = np.arange(n) / SR
    m = np.full(n, float(midi(pitch)))
    if glide_from is not None: m += (midi(glide_from) - midi(pitch)) * np.clip(1 - t / glide_time, 0, 1)
    if slide: m += slide * np.clip(t / max(slide_time, 1e-3), 0, 1)
    if vib: m += vib * np.clip((t - vib_delay) / 0.12, 0, 1) * np.sin(2 * np.pi * vib_rate * t)
    f = 440.0 * 2 ** ((m - 69) / 12)
    x = pulse(f, duty, fc) if kind == 'pulse' else triangle(f, min(fc, 6000.0))
    return vel * x * env

def kick(vel=1.0):
    """a triangle-wave kick: a fast pitch drop, to sit under the real bass drum"""
    d = 0.16; t = np.arange(int(d * SR)) / SR
    f = 52 + 140 * np.exp(-t * 38)
    return vel * np.sin(_phase(f)) * np.exp(-t * 16)

def add(buf, x, t, gain=1.0, pan=0.0):
    """mix mono x into the stereo buffer at time t (equal-power pan)"""
    i = int(round(t * SR)); j = min(len(buf), i + len(x))
    if j <= i or i < 0: return
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    buf[i:j, 0] += gain * l * x[:j - i]; buf[i:j, 1] += gain * r * x[:j - i]

def echo(x, sr=SR, time=0.3, fb=0.32, mix=0.28, spread=0.012):
    """a stereo echo (feedback delay) for the lead: left and right slightly apart"""
    y = x.copy(); dl, dr = int(time * sr), int((time + spread) * sr)
    for ch, dd in ((0, dl), (1, dr)):
        e = np.zeros(len(x)); src = x[:, ch]
        k = 1
        while k * dd < len(x) and fb ** (k - 1) > 0.02:
            e[k * dd:] += (fb ** (k - 1)) * src[:len(x) - k * dd]; k += 1
        y[:, ch] += mix * e
    return y
