"""Online-course Reel: the score, the cue sounds and the mix, all driven by edit/events.json (exported from src/edit.js).

One continuous piece in F major, a warm "morning café" bossa feel at about 103 BPM, played on sampled instruments only:
nylon guitar, upright piano, pizzicato double bass, a light shaker and cajon, with vibraphone, harp, glockenspiel and kalimba on top.
The tempo is set from the picture so the scene changes fall on bar lines (the schedule page lands on bar 8, the end card on bar 14,
where everything resolves on Fmaj9). Form: a two-bar intro under the hook, an A section (F, Dm, Gm, C twice), a lifted B section
(Bb, Am, Gm, C) for the schedule and the offer, then Dm, Gm, C into the end.
Cue sounds are musical notes in the key, never noise: a harp glissando into each steam wipe and page change, a harp note when a card
appears, kalimba notes as the reasons are crossed out, a marimba note per class day, a cajon thump and a piano chord on the stamps,
a glockenspiel sparkle on the free month. Writes audio/out/music.wav, cues.wav and mix.wav (48 kHz).
Run: $LIB/.venv/bin/python audio/score.py (after audio/voice.py)"""
import os, sys, json
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import SR, limit

S.seed(5)
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']; EV = E['ev']
at = lambda typ: [e['t'] for e in EV if e['type'] == typ]
SECTIONS = sorted(set(at('section'))); END = at('end')[0]
N = int((DUR + 3) * SR)

# ---------------------------------------------------------------- the grid: bar 8 on the schedule page, bar 14 on the end card
BAR = (END - SECTIONS[3]) / 6; B = BAR / 4; D0 = END - 14 * BAR
bt = lambda bar, beat=0: D0 + bar * BAR + beat * B
nm = lambda p, k=0: S.name(S.midi(p) + k)
V = {  # voicings: bass root, guitar (low to high), piano / pad (upper structure)
    'F': ('F2', ['F3', 'C4', 'E4', 'A4'], ['A4', 'C5', 'E5']), 'Dm': ('D2', ['D3', 'A3', 'C4', 'F4'], ['F4', 'A4', 'C5']),
    'Gm': ('G2', ['G3', 'D4', 'F4', 'Bb4'], ['F4', 'Bb4', 'D5']), 'C': ('C2', ['C3', 'G3', 'Bb3', 'E4'], ['E4', 'G4', 'Bb4']),
    'Bb': ('Bb1', ['Bb2', 'F3', 'A3', 'D4'], ['D5', 'F5', 'A5']), 'Am': ('A1', ['A2', 'E3', 'G3', 'C4'], ['C5', 'E5', 'G5']),
}
FORM = ['F', 'Dm', 'Gm', 'C', 'F', 'Dm', 'Gm', 'C', 'Bb', 'Am', 'Gm', 'C', 'Dm', ('Gm', 'C')]   # bars 0..13; bar 14 is the end chord
chord_at = lambda t: (lambda k: (FORM[k] if isinstance(FORM[k], str) else FORM[k][0 if (t - bt(k)) < 2 * B else 1]))(int(np.clip((t - D0) // BAR, 0, 13)))

F_MAJOR = {5, 7, 9, 10, 0, 2, 4}                                   # pitch classes of F major
step_above = lambda p: next(S.name(S.midi(p) + k) for k in (1, 2) if (S.midi(p) + k) % 12 in F_MAJOR)   # the next scale note up
ev = []
def note(t, inst, p, d, v, pan=0.0): ev.append((t, inst, p, d, v, pan))

# ---------------------------------------------------------------- the band
for k, ch in enumerate(FORM):
    halves = [(ch, 0, 4)] if isinstance(ch, str) else [(ch[0], 0, 2), (ch[1], 2, 2)]
    intro, bsec = k < 2, 8 <= k < 12
    for c, b0, nb in halves:
        root, gtr, pno = V[c]
        # nylon guitar: a soft bossa comp, bass note on the beat and the chord on the "and"s (three per bar)
        for b, v in [(0, 0.42), (1.5, 0.34), (2.5, 0.36), (3.5, 0.3)]:
            if b0 <= b < b0 + nb:
                pitches = gtr if b == 0 else gtr[1:]                            # full chord on the downbeat, the upper three after
                for i, p in enumerate(pitches): note(bt(k, b) + 0.012 * i, 'guitar_nylon', p, 0.8 if b else 1.0, v * (1.05 - 0.06 * i), -0.25 + 0.1 * i)
        # double bass (from bar 1): root and fifth, a diatonic step on the way into the next bar
        if k >= 1:
            note(bt(k, b0), 'contrabass_pizz', root, 0.7, 0.66, 0.05)
            if nb == 4:
                note(bt(k, 2), 'contrabass_pizz', nm(root, 7), 0.6, 0.5, 0.05)
                if k < 13: note(bt(k, 3.5), 'contrabass_pizz', step_above(V[FORM[k + 1] if isinstance(FORM[k + 1], str) else FORM[k + 1][0]][0]), 0.3, 0.4, 0.05)
        # vibraphone pad in the B section: the chord held softly
        if bsec:
            for p in pno: note(bt(k, b0), 'vibraphone', p, nb * B * 0.95, 0.24, 0.3)
    # light percussion from bar 2 (the first scene change): shaker eighths, cajon on 1 and the "and" of 3
    if k >= 2:
        for e8 in range(8): note(bt(k, e8 / 2), 'shaker', 'down' if e8 % 2 == 0 else 'up', None, 0.17 if e8 % 2 == 0 else 0.11, 0.35)
        note(bt(k, 0), 'cajon', 'bass', None, 0.34, 0); note(bt(k, 2.5), 'cajon', 'bass', None, 0.22, 0); note(bt(k, 2), 'cajon', 'tone', None, 0.13, -0.1)
        if k >= 12: note(bt(k, 3.5), 'cajon', 'slap', None, 0.12, -0.1)

# piano: a short pickup into bar 0, then answering phrases in the gaps of the A section, a higher line in the B section
note(max(0.0, bt(0, -1)), 'upright', 'C4', 0.4, 0.4, 0.2); note(bt(0, -0.5), 'upright', 'D4', 0.4, 0.38, 0.2)
PHRASES = {  # bar: [(beat, pitch, beats)]
    0: [(0, 'E4', 1.5), (1.5, 'F4', 0.5), (2, 'A4', 2)], 2: [(0, 'Bb4', 1), (1, 'A4', 0.5), (1.5, 'G4', 0.5), (2, 'F4', 1)], 3: [(0, 'E4', 2), (2.5, 'G4', 0.5), (3, 'Bb4', 1)],
    4: [(0, 'A4', 1.5), (1.5, 'C5', 0.5), (2, 'A4', 1)], 5: [(0, 'F4', 2)], 6: [(0, 'D5', 1), (1, 'C5', 0.5), (1.5, 'Bb4', 0.5), (2, 'A4', 1)], 7: [(0, 'G4', 1.5), (2, 'E4', 1), (3, 'G4', 1)],
    8: [(0, 'F5', 1.5), (1.5, 'D5', 0.5), (2, 'C5', 2)], 9: [(0, 'E5', 1.5), (1.5, 'C5', 0.5), (2, 'A4', 2)], 10: [(0, 'Bb4', 1), (1, 'D5', 1), (2, 'F5', 2)], 11: [(0, 'E5', 2), (2, 'G5', 1), (3, 'Bb4', 1)],
    12: [(0, 'A4', 1), (1, 'F4', 1), (2, 'A4', 1), (3, 'C5', 1)], 13: [(0, 'Bb4', 1), (1, 'D5', 1), (2, 'C5', 1), (3, 'E5', 1)],
}
for k, ph in PHRASES.items():
    for b, p, d in ph: note(bt(k, b), 'upright', p, d * B * 0.95, 0.3 if k < 8 else 0.33, 0.2)
# the end card: everything resolves on Fmaj9 and rings out
for i, p in enumerate(['F3', 'C4', 'E4', 'G4', 'A4']): note(END + 0.014 * i, 'guitar_nylon', p, 2.4, 0.5, -0.25 + 0.1 * i)
for p in ['A4', 'C5', 'E5', 'G5']: note(END, 'upright', p, 2.4, 0.4, 0.2)
note(END, 'contrabass_pizz', 'F2', 2.0, 0.7); note(END, 'vibraphone', 'F5', 2.4, 0.3, 0.3); note(END, 'glockenspiel', 'C6', 2.4, 0.26, 0.3)
note(END, 'harp', 'F2', 2.4, 0.5, -0.2); note(END, 'cajon', 'bass', None, 0.36)

music = S.render([dict(t=t, inst=i, pitch=p, dur=d, vel=v, pan=pn) for t, i, p, d, v, pn in ev], dur=DUR + 3, master=False)
music = S.room(music, 0.42, 0.17)[:N]

# ---------------------------------------------------------------- cue sounds: notes in the key, placed exactly on the picture
cue = []
def c(t, inst, p, d, v, pan=0.0): cue.append((t, inst, p, d, v, pan))
PENTA = ['C4', 'D4', 'F4', 'G4', 'A4', 'C5', 'D5', 'F5', 'G5', 'A5', 'C6']
def gliss(t0, length, up=True, v=0.36, span=8, top=10):
    notes = PENTA[top - span + 1:top + 1]
    if not up: notes = notes[::-1]
    for i, p in enumerate(notes): c(t0 + i * length / len(notes), 'harp', p, 1.2, v * (0.75 + 0.35 * i / len(notes)), -0.35 + 0.7 * i / len(notes))
tone = lambda t, octave=5: {'F': 'A', 'Dm': 'F', 'Gm': 'Bb', 'C': 'E', 'Bb': 'D', 'Am': 'C'}[chord_at(t)] + str(octave)   # a chord tone for card notes
strike_n = 0
for e in EV:
    t, k = e['t'], e['type']
    if k == 'clink': c(t, 'glockenspiel', 'A6', 1.0, 0.28, 0.25)                                    # the cup lands: a small ting
    elif k == 'draw' and t < 3: c(t + 0.1, 'harp', 'C5', 1.0, 0.36, 0.2)                            # "=" draws on
    elif k == 'pop' and t < 3: c(t, 'glockenspiel', 'F6', 1.0, 0.3, 0.25)                           # the notebook pops on
    elif k == 'ding': c(t, 'vibraphone', 'C6', 1.4, 0.34, 0.25)                                     # the question
    elif k == 'swell': gliss(t, e['len'], True, 0.38)                                                # steam wipes: a rising harp glissando
    elif k == 'flip': gliss(t, 0.28, True, 0.3, span=5, top=9)                                       # a page flips up: a short rising run
    elif k == 'drop': gliss(t, 0.26, False, 0.3, span=5, top=9)                                      # a page drops in: a short falling run
    elif k == 'slap': c(t, 'harp', tone(t, 5), 1.0, 0.34, 0.15)                                      # a card or row appears: one harp note
    elif k == 'draw' and 3 < t < 15:                                                                 # the reasons crossed out: falling kalimba
        c(t, 'kalimba', ['C5', 'A4', 'F4'][strike_n % 3], 0.8, 0.5, -0.1); strike_n += 1
    elif k == 'tick': c(t, 'glockenspiel', 'C6' if t < 15 else 'F6', 0.9, 0.26, 0.25)
    elif k == 'day': c(t, 'marimba', ['F4', 'A4', 'C5'][e['n']], 1.0, 0.55, -0.15); c(t, 'glockenspiel', ['F6', 'A6', 'C7'][e['n']], 0.8, 0.2, 0.25)
    elif k == 'stamp' and e.get('soft'): c(t, 'cajon', 'bass', None, 0.42, 0); c(t, 'harp', ['F3', 'A3', 'C4'][e.get('n', 0)], 1.0, 0.45, 0)
    elif k == 'stamp':
        r, _, pno = V[chord_at(t)]; c(t, 'cajon', 'bass', None, 0.55, 0); c(t, 'contrabass_pizz', r, 0.5, 0.7, 0)
        for p in pno: c(t + 0.01, 'upright', nm(p, -12), 0.5, 0.42, 0.1)
    elif k == 'kaching':
        for i, p in enumerate(['C6', 'F6', 'A6', 'C7', 'F7']): c(t + i * 0.05, 'glockenspiel', p, 1.2, 0.34, 0.3 - i * 0.12)
        c(t, 'hand_chimes', 'F5', 2.0, 0.4, 0)
    elif k == 'pop': c(t, 'glockenspiel', 'C7' if t > 25 else 'A6', 0.9, 0.26, 0.2)
flaps = [e['t'] for e in EV if e['type'] == 'flap']
for i, t in enumerate(flaps[::2]): c(t, 'kalimba', ['F3', 'A3', 'C4', 'F4', 'A4', 'C5', 'D5', 'F4'][i % 8], 0.6, 0.36, -0.2 + 0.05 * i)   # numbers flipping in: a kalimba run
cues = S.render([dict(t=t, inst=i, pitch=p, dur=d, vel=v, pan=pn) for t, i, p, d, v, pn in cue], dur=DUR + 3, master=False)
cues = S.room(cues, 0.35, 0.14)[:N]

# ---------------------------------------------------------------- mix: the music ducked under the voice, the cues just under it
voice, _ = sf.read(os.path.join(OUT, 'voice.wav'), dtype='float32')
voice = np.vstack([voice, np.zeros((N - len(voice), 2), np.float32)])[:N]
venv = np.sqrt(np.convolve(voice[:, 0] ** 2, np.ones(int(0.05 * SR)) / int(0.05 * SR), 'same'))
duck = np.where(20 * np.log10(venv + 1e-9) > -38, 10 ** (-5 / 20), 1.0)
duck = np.convolve(duck, np.ones(int(0.25 * SR)) / int(0.25 * SR), 'same')       # slow attack and release, no pumping
rms = lambda x: np.sqrt((x ** 2).mean()) + 1e-12
speech = venv > np.percentile(venv, 55)
v_rms = rms(voice[speech, 0])
music *= v_rms / rms(music[:int(END * SR), 0]) * 10 ** (-10.5 / 20)            # the band about 10 dB under his voice, ducking 5 dB more
cue_on = np.abs(cues[:, 0]) > 1e-4
cues *= v_rms / rms(cues[cue_on, 0]) * 10 ** (-12 / 20) if cue_on.any() else 1  # each cue sits gently under his voice
L = int(DUR * SR)
music = music * duck[:, None]
fo = int(0.35 * SR); music[L - fo:L] *= np.linspace(1, 0, fo)[:, None] ** 1.5; cues[L - fo:L] *= np.linspace(1, 0, fo)[:, None] ** 1.5
mix = (voice + music + cues)[:L]
mix = np.stack([limit(mix[:, 0], 0.95), limit(mix[:, 1], 0.95)], 1)
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'music.wav'), music[:L], SR, subtype='PCM_24')
sf.write(os.path.join(OUT, 'cues.wav'), cues[:L], SR, subtype='PCM_24')
sf.write(os.path.join(OUT, 'mix.wav'), mix, SR, subtype='PCM_24')
print(f'mix {L / SR:.2f} s | {60 / B:.1f} BPM, bar 0 at {D0:.2f} s, end chord at {END:.2f} s | instruments:', ', '.join(sorted({i for _, i, *_ in ev + cue})))
