"""Words in boxes: the score. 24 s, 12/8 at 120 dotted-crotchet beats per minute (one bar = 2 s), timed to STORYBOARD.md.

One tune carries the story. It opens as a cold D minor music box (the words in their boxes), the stitches of the
orange yarn play it upward note by note, it turns to D major on the frame the colour arrives, blooms into the full
orchestra at the burst, lifts a whole tone for London, and comes home on the music box in E major for the end card.

Run with the Lemo-Opuscar venv:  $LIB/.venv/bin/python audio/score.py
Writes audio/out/music.wav (full mix) and audio/out/stem_*.wav (melody, strings, sparkle, perc) at 48 kHz.
"""
import os, sys
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
import numpy as np, soundfile as sf
from core.audio import sampler as S, pluck as P
from core.audio.sfx import SR, add, limit

S.seed(7)
DUR = 24.0
BEAT = 0.5            # a dotted crotchet
T3 = BEAT / 3         # a triplet quaver
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'out')


def at(bar, beat=1, trip=0): return (bar - 1) * 2.0 + (beat - 1) * BEAT + trip * T3


EV = {k: [] for k in ('melody', 'strings', 'sparkle', 'perc')}
RAW = {k: np.zeros((int((DUR + 4) * SR), 2), np.float32) for k in EV}   # hand-placed buffers (music box, swells)


def ev(stem, t, inst, pitch, dur, vel, pan=0.0, gain=1.0, **kw):
    EV[stem].append(dict(t=t, inst=inst, pitch=pitch, dur=dur, vel=vel, pan=pan, gain=gain, **kw))


def pad(t, dur, voices, vel, attack=.2, release=.35):
    """strings chord: voices = [(inst, pitch), ...]; violas and violins spread slightly left, cellos and basses right"""
    pans = {'violins': -.35, 'violas': -.1, 'cellos': .25, 'contrabass': .35, 'horn': .15, 'vibraphone_bowed': 0}
    for inst, p in voices: ev('strings', t, inst, p, dur, vel, pans.get(inst, 0), attack=attack, release=release)


def arp(t0, notes, vel, pan=.3, step=T3, inst='harp', stem='sparkle'):
    for i, p in enumerate(notes): ev(stem, t0 + i * step, inst, p, 1.2, vel, pan)


def music_box(t, pitch, vel=.7, pan=-.15, gain=1.0):
    add(RAW['sparkle'], P.pluck('music_box', pitch, None, vel), t, gain, pan)


def line(stem, inst, notes, vel, pan=0.0, legato=.04, **kw):
    for t, p, d in notes: ev(stem, t, inst, p, d + legato, vel, pan, **kw)


def up(notes, semis):   # transpose a melody by octaves for doubling
    return [(t, S.name(S.midi(p) + semis), d) for t, p, d in notes]


# ======================================================================= 1  Hook (0 to 2 s): a lonely music box in D minor
MOTIF_MIN = [(at(1, 1), 'A5', 2 * T3), (at(1, 1, 2), 'Bb5', T3), (at(1, 2), 'F6', BEAT), (at(1, 3), 'E6', 2 * T3), (at(1, 3, 2), 'D6', T3), (at(1, 4), 'E6', BEAT)]
for t, p, d in MOTIF_MIN: music_box(t, p, .72)
music_box(at(1, 1), 'D4', .5, .1); music_box(at(1, 3), 'A4', .42, .1)
pad(0.0, 3.4, [('vibraphone_bowed', 'D4'), ('vibraphone_bowed', 'F4'), ('vibraphone_bowed', 'A4')], .32, attack=.6, release=.5)
pad(0.0, 3.4, [('contrabass', 'D2')], .28, attack=.9, release=.4)

# ======================================================================= 2  The wall (2 to 4 s): the drawers loom, the card lands, she freezes
pad(2.0, 1.5, [('cellos', 'Bb2'), ('cellos', 'F3'), ('violas', 'A3'), ('violas', 'D4'), ('violins', 'F4')], .44, attack=1.2, release=.22)
pad(2.0, 1.5, [('contrabass', 'Bb1')], .42, attack=.9, release=.22)
ev('sparkle', 3.0, 'harp', 'A2', 2.0, .78, -.1)
ev('perc', 3.0, 'tubular_bells', 'A4', 2.5, .42, .1)
ev('perc', 3.0, 'timpani', 'A2', 1.5, .4, 0)
ev('strings', 3.5, 'violins_trem', 'A5', 3.5, .17, -.3, attack=.35, release=.3)        # the held breath

# ======================================================================= 3  The problem (4 to 7 s): three words, three lonely plucks, out of time
pad(4.0, 2.0, [('violas', 'G3'), ('violas', 'Bb3'), ('violas', 'D4')], .3, attack=.8, release=.4)
for t, p, g, pn in [(4.35, 'D5', 'D7', -.45), (5.05, 'A4', 'A6', .5), (5.8, 'F5', 'F6', -.1)]:
    ev('sparkle', t, 'violins_pizz', p, .8, .6, pn)
    ev('sparkle', t + .015, 'glockenspiel', g, 1.5, .24, pn)
line('melody', 'clarinet', [(4.8, 'Bb3', .85), (5.7, 'A3', 1.1)], .4, .2, attack=.08, release=.4)   # a small sigh
# 6 to 7 s: the dominant waits, suspended
pad(6.0, 2.0, [('cellos', 'A2'), ('violins', 'G4'), ('violins', 'E4')], .38, attack=.5, release=.3)
pad(6.0, 2.0, [('contrabass', 'A1')], .32, attack=.6)
pad(6.0, 1.0, [('violas', 'D4')], .34, attack=.5, release=.15)
pad(7.0, 1.0, [('violas', 'C#4')], .38, attack=.05, release=.3)

# ======================================================================= 4  The turn (7 to 10 s): every stitch plays the next note, and D minor turns to D major
STITCH = [(7.0, 'A4'), (7.5, 'C#5'), (8.0, 'D5'), (8.5, 'F#5'), (9.0, 'A5'), (9.5, 'B5'), (10.0, 'D6')]
for i, (t, p) in enumerate(STITCH):
    k, pn = i / (len(STITCH) - 1), (-.3 if i % 2 else .3)      # the needle goes in and out, left and right
    ev('sparkle', t, 'harp', p, 1.5, .5 + .3 * k, pn)
    ev('sparkle', t, 'glockenspiel', S.name(S.midi(p) + 12), 1.8, .3 + .2 * k, pn)
    ev('sparkle', t, 'violins_pizz', p, .6, .45 + .2 * k, -pn * .5)
pad(8.0, 1.0, [('cellos', 'D3'), ('violas', 'A3'), ('violas', 'F#4'), ('violins', 'A4'), ('violins', 'D5')], .42, attack=.25, release=.3)
pad(9.0, .5, [('cellos', 'B2'), ('violas', 'G3'), ('violas', 'D4'), ('violins', 'B4')], .46, attack=.1, release=.2)
pad(9.5, .5, [('cellos', 'A2'), ('violas', 'C#4'), ('violas', 'E4'), ('violins', 'A4'), ('violins', 'E5')], .52, attack=.1, release=.15)
pad(8.0, 2.0, [('vibraphone_bowed', 'D5'), ('vibraphone_bowed', 'F#5'), ('vibraphone_bowed', 'A5')], .24, attack=.35, release=.3)
for t, p, v in [(8.0, 'D2', .55), (8.5, 'A2', .45), (9.0, 'B1', .5), (9.5, 'A1', .5)]: ev('strings', t, 'contrabass_pizz', p, .6, v, .35)
arp(8.0, ['D4', 'F#4', 'A4', 'D5', 'F#5', 'A5'], .42)
arp(9.0, ['G4', 'B4', 'D5'], .44)
GLISS = ['D5', 'E5', 'F#5', 'G5', 'A5', 'B5', 'C#6', 'D6', 'E6', 'F#6', 'G6', 'A6', 'B6', 'C#7', 'D7']
arp(9.5, GLISS, .4, pan=.1, step=.5 / len(GLISS))            # harp glissando into the burst

# the cymbal swell and a reversed glockenspiel shimmer, both peaking on the burst at 10.0
cym = S.hit('sus_cymbal', 'cresc', .75)
e = np.convolve(np.abs(cym), np.ones(2400) / 2400, 'same'); pk = int(e.argmax())
sw = cym[max(0, pk - int(2.2 * SR)):pk].copy(); sw *= np.linspace(0, 1, len(sw)) ** 1.5
add(RAW['perc'], sw, 10.0 - len(sw) / SR, .9, .1)
g = S.note('glockenspiel', 'D7', 2.5, .5); g = S.room(g, .8, .6)[:, 0]; g = g[::-1].copy()
add(RAW['sparkle'], g, 10.0 - len(g) / SR, .55, -.2)

# ======================================================================= 5  The burst (10 to 12 s): the drawers fly open, the orchestra blooms
pad(10.0, 1.0, [('contrabass', 'D2'), ('cellos', 'D3'), ('cellos', 'A3'), ('violas', 'F#4'), ('violas', 'A4'), ('violins', 'D5'), ('violins', 'F#5')], .64, attack=.04, release=.3)
pad(10.0, 1.0, [('horn', 'A3'), ('horn', 'D4'), ('horn', 'F#4')], .52, attack=.08, release=.3)
# E over D: the raised fourth, the "wonder" chord
pad(11.0, .5, [('contrabass', 'D2'), ('cellos', 'D3'), ('violas', 'B3'), ('violas', 'E4'), ('violins', 'E5'), ('violins', 'G#5')], .58, attack=.06, release=.2)
pad(11.0, .5, [('horn', 'B3'), ('horn', 'E4'), ('horn', 'G#4')], .45, attack=.06, release=.2)
pad(11.5, .5, [('contrabass', 'A1'), ('cellos', 'A2'), ('cellos', 'E3'), ('violas', 'G4'), ('violas', 'C#4'), ('violins', 'C#5'), ('violins', 'E5')], .56, attack=.06, release=.2)
pad(11.5, .5, [('horn', 'A3'), ('horn', 'C#4'), ('horn', 'E4')], .42, attack=.06, release=.2)
ev('perc', 10.0, 'timpani', 'D3', 1.5, .75, 0)
ev('perc', 10.0, 'bass_drum', None, None, .4, 0)
ev('perc', 10.0, 'crash', None, None, .42, .05)
ev('perc', 10.0, 'tubular_bells', 'D5', 3.0, .5, -.15)
ev('perc', 10.0, 'triangle', 'open', None, .38, -.45)
for t, v in [(10.0, .62), (10.5, .35), (11.0, .45), (11.5, .4)]: ev('perc', t, 'sleighbells', None, .45, v, .45)
arp(10.0, ['D7', 'C#7', 'A6', 'F#6', 'E6', 'D6'], .38, pan=.35, step=T3 / 2, inst='glockenspiel')     # words scattering
line('melody', 'flute_stac', [(10.5 + i / 12, p, 1 / 12) for i, p in enumerate(['D5', 'E5', 'F#5', 'G5', 'A5', 'B5'])], .5, -.2, legato=0)
line('melody', 'flute', [(11.0, 'B5', .5), (11.5, 'A5', .5)], .45, -.2, attack=.04, release=.2)
ev('sparkle', 11.0, 'glockenspiel', 'G#6', 1.5, .34, .3)
arp(10.0, ['D5', 'F#5', 'A5', 'D6', 'F#6', 'A6'], .48)
arp(11.0, ['E5', 'G#5', 'B5'], .46)
arp(11.5, ['A4', 'C#5', 'E5'], .46)

# ======================================================================= 6  The world (12 to 16 s): the theme, in D major
THEME_D = [(at(7, 1), 'A4', 2 * T3), (at(7, 1, 2), 'B4', T3), (at(7, 2), 'F#5', BEAT), (at(7, 3), 'E5', 2 * T3), (at(7, 3, 2), 'D5', T3), (at(7, 4), 'E5', BEAT),
           (at(8, 1), 'A4', 2 * T3), (at(8, 1, 2), 'B4', T3), (at(8, 2), 'G5', BEAT), (at(8, 3), 'F#5', 2 * T3), (at(8, 3, 2), 'E5', T3),
           (at(8, 4), 'D#5', T3), (at(8, 4, 1), 'E5', T3), (at(8, 4, 2), 'F#5', T3)]
line('melody', 'violins', THEME_D, .56, -.15, attack=.03, release=.2)
line('melody', 'flute', up(THEME_D, 12), .42, .2, attack=.03, release=.2)
for t, p in [(at(7, 2), 'F#6'), (at(7, 4), 'E6'), (at(8, 2), 'G6')]: ev('sparkle', t, 'glockenspiel', p, 1.5, .28, .3)
HARM_D = [(12.0, 1.0, ['D3'], ['A3', 'F#4'], 'D2'), (13.0, .5, ['G2'], ['B3', 'D4'], 'G1'), (13.5, .5, ['A2'], ['C#4', 'E4'], 'A1'),
          (14.0, 1.0, ['G2'], ['B3', 'D4'], 'G1'), (15.0, .5, ['F#2'], ['A3', 'D4'], 'F#1'), (15.5, .5, ['B2'], ['A3', 'D#4'], 'B1')]
for t, d, ce, va, cb in HARM_D:
    pad(t, d, [('cellos', p) for p in ce] + [('violas', p) for p in va], .36, attack=.12, release=.25)
    ev('strings', t, 'contrabass_pizz', cb, .6, .5, .35)
line('strings', 'horn', [(12.0, 'D4', 1.0), (13.0, 'D4', .5), (13.5, 'C#4', .5), (14.0, 'B3', 1.0), (15.0, 'A3', .5), (15.5, 'A3', .5)], .36, .15, attack=.1, release=.25)
for t, notes in [(12.0, ['D4', 'F#4', 'A4', 'D5', 'F#5', 'A5']), (13.0, ['G4', 'B4', 'D5']), (13.5, ['A4', 'C#5', 'E5']),
                 (14.0, ['G4', 'B4', 'D5', 'G5', 'B5', 'D6']), (15.0, ['F#4', 'A4', 'D5']), (15.5, ['B4', 'D#5', 'F#5'])]:
    arp(t, notes, .38)
for i in range(8): ev('perc', 12.0 + i * BEAT, 'sleighbells', None, .35, .3 + (.06 if i % 2 == 0 else 0), .45)
for t in (12.0, 14.0): ev('perc', t, 'triangle', 'open', None, .24, -.45)

# ======================================================================= 7  The proof (16 to 20 s): up a whole tone to E major, horns in, the medal
THEME_E = [(at(9, 1), 'B4', 2 * T3), (at(9, 1, 2), 'C#5', T3), (at(9, 2), 'G#5', BEAT), (at(9, 3), 'F#5', 2 * T3), (at(9, 3, 2), 'E5', T3), (at(9, 4), 'F#5', BEAT)]
CLIMAX = [(at(10, 1), 'C#6', 2 * T3), (at(10, 1, 2), 'B5', T3), (at(10, 2), 'A5', BEAT), (at(10, 3), 'G#5', 2 * T3), (at(10, 3, 2), 'F#5', T3), (at(10, 4), 'F#5', BEAT)]
line('melody', 'violins', THEME_E, .62, -.15, attack=.03, release=.2)
line('melody', 'violins', CLIMAX, .7, -.15, attack=.03, release=.2)
line('melody', 'flute', up(THEME_E, 12), .46, .2, attack=.03, release=.2)
line('melody', 'flute', CLIMAX, .5, .2, attack=.03, release=.2)
line('melody', 'horn', up(THEME_E, -12), .46, .1, attack=.05, release=.2)
line('melody', 'horn', up(CLIMAX, -12), .54, .1, attack=.05, release=.2)
HARM_E = [(16.0, 1.0, ['E2', 'B2'], ['G#3', 'E4'], 'E2'), (17.0, .5, ['A2', 'E3'], ['A3', 'C#4'], 'A1'), (17.5, .5, ['B2', 'F#3'], ['B3', 'D#4'], 'B1'),
          (18.0, .5, ['A2', 'E3'], ['C#4', 'E4', 'G#4'], 'A1'), (18.5, .5, ['F#2', 'C#3'], ['A3', 'E4'], 'F#1'),
          (19.0, .5, ['B2', 'E3'], ['G#3', 'B3'], 'B1'), (19.5, .5, ['B2', 'F#3'], ['A3', 'D#4'], 'B1')]
for t, d, ce, va, cb in HARM_E:
    pad(t, d, [('cellos', p) for p in ce] + [('violas', p) for p in va], .46 if t < 18 else .52, attack=.08, release=.2)
    ev('strings', t, 'contrabass', cb, d, .38, .35, attack=.05, release=.2)
for t, notes in [(16.0, ['E4', 'G#4', 'B4', 'E5', 'G#5', 'B5']), (17.0, ['A4', 'C#5', 'E5']), (17.5, ['B4', 'D#5', 'F#5']),
                 (18.0, ['A4', 'C#5', 'E5']), (18.5, ['F#4', 'A4', 'C#5']), (19.0, ['G#4', 'B4', 'E5']), (19.5, ['A4', 'B4', 'D#5'])]:
    arp(t, notes, .42)
for i in range(12): ev('perc', 17.0 + i / 12, 'timpani', 'B2', .3, .22 + .4 * i / 11, 0)       # roll into the medal
ev('perc', 18.0, 'timpani', 'A2', 1.5, .66, 0)
ev('perc', 18.0, 'bass_drum', None, None, .45, 0)
ev('perc', 18.0, 'crash', None, None, .4, -.05)
ev('perc', 18.0, 'tubular_bells', 'C#5', 3.0, .45, .15)
arp(18.0, ['C#7', 'B6', 'A6', 'G#6', 'E6', 'C#6'], .38, pan=.35, step=T3 / 2, inst='glockenspiel')
for i in range(8): ev('perc', 16.0 + i * BEAT, 'sleighbells', None, .35, .36 + (.06 if i % 2 == 0 else 0), .45)
ev('perc', 16.0, 'triangle', 'open', None, .28, -.45)

# ======================================================================= 8  End card (20 to 24 s): home, on the music box, now in E major
pad(20.0, 2.0, [('contrabass', 'E2'), ('cellos', 'E3'), ('cellos', 'B3'), ('violas', 'G#4'), ('violas', 'B4'), ('violins', 'E5')], .46, attack=.05, release=.6)
pad(20.0, 1.6, [('horn', 'E4'), ('horn', 'G#4')], .32, attack=.06, release=.5)
for i, p in enumerate(['E3', 'B3', 'E4', 'G#4', 'B4', 'E5']): ev('sparkle', 20.0 + i * .04, 'harp', p, 2.5, .55, .2)
ev('perc', 20.0, 'tubular_bells', 'E5', 3.0, .34, -.15)
ev('perc', 20.0, 'timpani', 'E3', 1.5, .36, 0)
ev('perc', 20.0, 'sleighbells', None, .5, .35, .45)
ev('perc', 20.0, 'triangle', 'open', None, .26, -.45)
MOTIF_MAJ = [(at(11, 2), 'B5', 2 * T3), (at(11, 2, 2), 'C#6', T3), (at(11, 3), 'G#6', BEAT), (at(11, 4), 'F#6', 2 * T3), (at(11, 4, 2), 'E6', T3), (at(12, 1), 'F#6', BEAT), (at(12, 2), 'E6', 2.0)]
for t, p, d in MOTIF_MAJ: music_box(t, p, .7, -.1, 1.1)
pad(21.0, .5, [('cellos', 'C#3'), ('cellos', 'G#3'), ('violas', 'E4'), ('violas', 'B4')], .36, attack=.15, release=.3)
pad(21.5, .5, [('cellos', 'A2'), ('cellos', 'E3'), ('violas', 'C#4'), ('violas', 'E4')], .36, attack=.15, release=.3)
# A minor with F sharp over E's home: the borrowed, wistful chord before the last one
pad(22.0, .5, [('cellos', 'A2'), ('cellos', 'E3'), ('violas', 'C4'), ('violas', 'F#4')], .38, attack=.15, release=.3)
pad(22.5, 1.5, [('contrabass', 'E2'), ('cellos', 'E3'), ('cellos', 'B3'), ('violas', 'G#4'), ('violas', 'B4'), ('violins', 'E5'), ('violins', 'G#5')], .4, attack=.2, release=1.0)
pad(22.5, 1.5, [('vibraphone_bowed', 'E5'), ('vibraphone_bowed', 'G#5'), ('vibraphone_bowed', 'B5')], .26, attack=.3, release=1.0)
arp(22.5, ['E4', 'G#4', 'B4', 'E5', 'G#5', 'B5', 'E6'], .42, pan=.2)
ev('sparkle', 22.5, 'hand_chimes', 'E6', 2.0, .34, -.25)
ev('sparkle', 23.0, 'glockenspiel', 'E7', 1.5, .26, .3)
ev('sparkle', 23.15, 'glockenspiel', 'B6', 1.5, .22, -.3)
ev('perc', 22.5, 'sleighbells', None, .6, .3, .45)
ev('perc', 22.5, 'triangle', 'open', None, .22, -.45)

# ======================================================================= render, room, mix, master
from scipy.signal import lfilter


def shelf(x, f0, gain_db, kind='high', q=.7):
    """RBJ shelving biquad on a mono or (N,2) signal"""
    A = 10 ** (gain_db / 40); w = 2 * np.pi * f0 / SR; al = np.sin(w) / (2 * q); c = np.cos(w); sq = 2 * np.sqrt(A) * al
    if kind == 'high':
        b = [A * ((A + 1) + (A - 1) * c + sq), -2 * A * ((A - 1) + (A + 1) * c), A * ((A + 1) + (A - 1) * c - sq)]
        a = [(A + 1) - (A - 1) * c + sq, 2 * ((A - 1) - (A + 1) * c), (A + 1) - (A - 1) * c - sq]
    else:
        b = [A * ((A + 1) - (A - 1) * c + sq), 2 * A * ((A - 1) - (A + 1) * c), A * ((A + 1) - (A - 1) * c - sq)]
        a = [(A + 1) + (A - 1) * c + sq, -2 * ((A - 1) + (A + 1) * c), (A + 1) + (A - 1) * c - sq]
    return lfilter(np.array(b) / a[0], np.array(a) / a[0], x, axis=0).astype(np.float32)


def compress(x, thr_db=-21, ratio=1.7, tau=.12):
    """gentle RMS compressor (linked stereo), so the quiet opening still speaks on a phone"""
    p = lfilter([1 - np.exp(-1 / (tau * SR))], [1, -np.exp(-1 / (tau * SR))], (x ** 2).mean(1))
    lvl = 10 * np.log10(p + 1e-12)
    g = np.where(lvl > thr_db, (thr_db - lvl) * (1 - 1 / ratio), 0.0)
    return (x * (10 ** (g / 20))[:, None]).astype(np.float32)


def env(points):
    """gain automation in dB: [(t, dB), ...] linearly interpolated"""
    t = np.arange(N) / SR; ts, ds = zip(*points)
    return (10 ** (np.interp(t, ts, ds) / 20)).astype(np.float32)[:, None]


ROOM = {'melody': (.55, .22), 'strings': (.6, .25), 'sparkle': (.78, .33), 'perc': (.55, .2)}
GAIN = {'melody': .95, 'strings': 1.0, 'sparkle': .9, 'perc': .75}
EQ = {'sparkle': [(6000, 6.5, 'high')], 'perc': [(6000, 4.0, 'high')], 'melody': [(7000, 2.5, 'high')], 'strings': [(90, 2.0, 'low'), (7000, 2.0, 'high')]}
os.makedirs(OUT, exist_ok=True)
N = int(DUR * SR)
fade = np.ones(N, np.float32); f0 = int(23.1 * SR); fade[f0:] = np.linspace(1, 0, N - f0) ** 1.5
# lift the quiet opening, hold back the wall's swell so it never outshouts the theme
AUTO = env([(0, 5.0), (2.0, 5.0), (2.6, .5), (3.4, .5), (3.6, 6.0), (5.8, 6.0), (6.4, 3.5), (7.4, 3.0), (8.2, 1.0), (9.9, 0.0), (10.0, 2.0), (11.8, 1.0), (12.2, -.5), (17.9, -.5), (18.0, 1.5), (19.8, .5), (20.2, 0.0), (24, 0.0)])
stems = {}
for k in EV:
    x = S.render(EV[k], dur=DUR + 4, master=False) + RAW[k]
    for f, gdb, kind in EQ.get(k, []): x = shelf(x, f, gdb, kind)
    size, mix = ROOM[k]
    x = S.room(x, size, mix)[:N] * GAIN[k]
    stems[k] = (x * fade[:, None] * AUTO).astype(np.float32)
mixed = compress(sum(stems.values()))
mixed = shelf(mixed, 9000, 3.5, 'high')          # a little air on the whole mix
pk = np.abs(mixed).max()
scale = .89 / pk if pk > .89 else 1.0
for k, x in stems.items(): sf.write(os.path.join(OUT, f'stem_{k}.wav'), x * scale, SR, subtype='PCM_24')
m = np.stack([limit(mixed[:, 0] * scale, .95), limit(mixed[:, 1] * scale, .95)], 1)
sf.write(os.path.join(OUT, 'music_raw.wav'), m, SR, subtype='PCM_24')
# master to Instagram's -14 LUFS with a plain gain and a look-ahead limiter (ffmpeg's loudnorm would turn dynamic and flatten the burst)
import re, subprocess
meas = subprocess.run(['ffmpeg', '-hide_banner', '-i', os.path.join(OUT, 'music_raw.wav'), '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', meas)[-1])
g = 10 ** ((-14.0 - I + .3) / 20)
sf.write(os.path.join(OUT, 'music.wav'), np.stack([limit(m[:, 0] * g, .85), limit(m[:, 1] * g, .85)], 1), SR, subtype='PCM_24')
print(f'music.wav: {I:.1f} LUFS raw, +{20 * np.log10(g):.1f} dB to -14')
used = sorted({e['inst'] for v in EV.values() for e in v})
print('instruments:', ', '.join(used))
print('\n'.join(S.credits(used)))
