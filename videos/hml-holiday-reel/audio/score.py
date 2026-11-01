"""Holiday-class Reel ("Level Up"): an original game soundtrack written to the picture, the cue sounds, and the mix.
All timing comes from edit/events.json (exported by src/edit.js): the edit and the score share one clock, 150 BPM, bar = 1.6 s.

Form (bars of 4 beats):
  0-4   overworld theme in C (C Am F G), a start-up blip on frame one; the quest fanfare picks up on beat 2.5 of bar 4
  5-8   quest theme (C F Dm G): the fanfare lands on bar 5
  9-11  adventure theme (C Am), item pickups, a rising charge in bar 11 into the LEVEL UP fanfare
  12-13 boss music in C minor (Cm Ab | Cm G), driving bass, impact hits on "10" and "20"
  14    victory fanfare on "WIN!" (it lands on the bar line), the achievement chime
  15    the theme returns (C G)
  16-19 CONTINUE?: calmer, half-time (F G | Em Am | Dm G), a countdown beep every two beats, a start chime
  19-20 the end jingle from the end screen into a final C major chord that rings to the last frame
Sound: a band-limited chip synth (audio/chip.py) for lead, harmony, arpeggio and bass; real sampled drums (bass drum, snare, hi-hat,
toms) and real glockenspiel and hand chimes for sparkle. No noise sweeps. The lead ducks well under his voice; the band ducks a little.
Writes audio/out/music.wav and mix.wav (48 kHz). Run: $LIB/.venv/bin/python audio/score.py (after audio/voice.py)"""
import os, sys, json
LIB = os.environ.get('LIB', '/root/lemo-opuscar'); sys.path.insert(0, LIB)
HERE = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, HERE)
import numpy as np, soundfile as sf
from core.audio import sampler as S
from core.audio.sfx import limit
import chip as C
from chip import SR, tone, add

S.seed(3)
ROOT = os.path.dirname(HERE); OUT = os.path.join(HERE, 'out')
E = json.load(open(os.path.join(ROOT, 'edit', 'events.json'))); DUR = E['dur']; EV = E['ev']
clock = next(e for e in EV if e['type'] == 'clock'); B = 60 / clock['bpm']; BAR = clock['bar']
at = lambda typ: [e['t'] for e in EV if e['type'] == typ]
one = lambda typ: at(typ)[0]
N = int((DUR + 2.5) * SR)
bt = lambda bar, beat=0.0: bar * BAR + beat * B

stems = {k: np.zeros((N, 2)) for k in ('lead', 'harm', 'arp', 'bass', 'drums', 'bells', 'cues')}
def L(bar, beat, p, beats, vel=0.8, **kw):             # lead: a round 50% pulse rolled off above 4 kHz (soft, flute-like), vibrato on long notes
    kw.setdefault('vib', 0.22 if beats >= 1 else 0.0); kw.setdefault('d', 0.12); kw.setdefault('s', 0.7); kw.setdefault('r', 0.08)
    kw.setdefault('duty', 0.5); kw.setdefault('fc', 4000.0)
    add(stems['lead'], tone('pulse', p, beats * B * 0.92, vel, **kw), bt(bar, beat))
FAN = dict(duty=0.25, fc=6000.0)                        # fanfares: the brighter 25% pulse (they mostly sound in his pauses)
def Hm(bar, beat, p, beats, vel=0.7, duty=0.5):        # harmony voice (fanfares): a rounder 50% pulse
    add(stems['harm'], tone('pulse', p, beats * B * 0.92, vel, duty=duty, d=0.1, s=0.65, r=0.08), bt(bar, beat), pan=0.15)
def Bs(bar, beat, p, beats, vel=0.9):                   # triangle bass
    add(stems['bass'], tone('tri', p, beats * B * 0.9, vel, a=0.002, d=0.05, s=0.85, r=0.03), bt(bar, beat))
def melody(bar, notes, vel=0.8, **kw):                  # notes: (beat, pitch, beats); pitch None = rest
    for beat, p, d in notes:
        if p: L(bar, beat, p, d, vel, **kw)

# ---------------------------------------------------------------- harmony plan
CH = {'C': ['C', 'E', 'G'], 'Am': ['A', 'C', 'E'], 'F': ['F', 'A', 'C'], 'G': ['G', 'B', 'D'], 'Dm': ['D', 'F', 'A'], 'Em': ['E', 'G', 'B'],
      'Cm': ['C', 'Eb', 'G'], 'Ab': ['Ab', 'C', 'Eb'], 'G7': ['G', 'B', 'D', 'F'], 'Dm7': ['D', 'F', 'A', 'C']}
PLAN = {0: ['C'], 1: ['Am'], 2: ['F'], 3: ['G'], 4: ['F', 'G'], 5: ['C'], 6: ['F'], 7: ['Dm'], 8: ['G'], 9: ['C'], 10: ['Am'], 11: ['F', 'G'],
        12: ['Cm', 'Ab'], 13: ['Cm', 'G'], 14: ['C'], 15: ['C', 'G'], 16: ['F'], 17: ['G'], 18: ['Em', 'Am'], 19: ['Dm7', 'G7'], 20: ['C']}
def chord_tones(name, octave): return [f'{n}{octave}' for n in CH[name]]
def chords(bar): ch = PLAN[bar]; return [(c, i * 4 / len(ch), 4 / len(ch)) for i, c in enumerate(ch)]   # (name, start beat, beats)

# ---------------------------------------------------------------- bass and arpeggio, section by section
for bar in range(0, 20):
    boss, cont = 12 <= bar <= 13, bar >= 16
    for name, b0, nb in chords(bar):
        root = CH[name][0]
        if boss:                                         # driving 8ths with an octave kick on the off-beats
            for k in range(int(nb * 2)):
                Bs(bar, b0 + k * 0.5, f'{root}2' if k % 2 == 0 else f'{root}3', 0.45, 0.95)
        elif cont:                                       # calmer: the root held, then the fifth on beat 3
            Bs(bar, b0, f'{root}2', min(nb, 2) - 0.1, 0.85)
            if nb == 4: Bs(bar, b0 + 2, f'{CH[name][2]}2', 1.9, 0.7)
        else:                                            # bouncy octave 8ths, the last one stepping to the next chord's fifth
            for k in range(int(nb * 2)):
                p = f'{root}2' if k % 2 == 0 else f'{root}3'
                Bs(bar, b0 + k * 0.5, p, 0.45, 0.9 if k % 2 == 0 else 0.7)
        # 12.5% pulse arpeggio: 16ths up and down the chord (8ths in the continue section)
        tones = chord_tones(name, 5)
        pattern = [tones[0], tones[1], tones[2], tones[1]]
        step = 0.5 if cont else 0.25
        for k in range(int(nb / step)):
            p = pattern[k % 4]
            add(stems['arp'], tone('pulse', p, step * B * 0.8, 0.55, duty=0.25, a=0.002, d=0.05, s=0.4, r=0.03, fc=3500.0), bt(bar, b0 + k * step), pan=-0.35 if k % 2 else 0.35)

# ---------------------------------------------------------------- the lead line
# 0-3 overworld theme
melody(0, [(0, 'E5', .5), (.5, 'G5', .5), (1, 'C6', 1), (2, 'B5', .5), (2.5, 'G5', .5), (3, 'E5', 1)])
melody(1, [(0, 'A5', .5), (.5, 'C6', .5), (1, 'E6', 1), (2, 'D6', .5), (2.5, 'C6', .5), (3, 'A5', 1)])
melody(2, [(0, 'F5', .5), (.5, 'A5', .5), (1, 'C6', .5), (1.5, 'A5', .5), (2, 'G5', 1), (3, 'F5', .5), (3.5, 'E5', .5)])
melody(3, [(0, 'D5', .5), (.5, 'G5', .5), (1, 'B5', 1), (2, 'D6', .5), (2.5, 'B5', .5), (3, 'G5', 1)])
melody(4, [(0, 'A5', .5), (.5, 'C6', .5), (1, 'A5', 1)])
# the quest fanfare: a pickup from beat 2.5 of bar 4 (on "Манай") into a C major landing on bar 5
for i, p in enumerate(['G5', 'B5', 'D6']): L(4, 2.5 + 0.5 * i, p, 0.5, 0.95, vib=0, **FAN)
for i, p in enumerate(['D5', 'G5', 'B5']): Hm(4, 2.5 + 0.5 * i, p, 0.5, 0.7)
# 5-8 quest theme
L(5, 0, 'C6', 1.5, 0.95, **FAN)
melody(5, [(1.5, 'G5', .5), (2, 'A5', .5), (2.5, 'G5', .5), (3, 'E5', 1)], vel=0.9)
Hm(5, 0, 'E5', 1.5, 0.75); Hm(5, 0, 'G5', 1.5, 0.6)
melody(6, [(0, 'A5', 1), (1, 'F5', .5), (1.5, 'G5', .5), (2, 'A5', .5), (2.5, 'C6', .5), (3, 'A5', 1)])
melody(7, [(0, 'F5', .5), (.5, 'E5', .5), (1, 'D5', .5), (1.5, 'F5', .5), (2, 'A5', 1), (3, 'D6', 1)])
melody(8, [(0, 'B5', .5), (.5, 'A5', .5), (1, 'G5', .5), (1.5, 'F5', .5), (2, 'D5', 1), (3, 'G5', .5), (3.5, 'B5', .5)])
# 9-10 adventure theme, leaving room for the item jingles (bar 10 beat 0 and beat 2.5)
melody(9, [(0, 'E6', .5), (.5, 'D6', .5), (1, 'C6', .5), (1.5, 'G5', .5), (2, 'A5', .5), (2.5, 'C6', .5), (3, 'E6', 1)])
melody(10, [(1, 'C6', .5), (1.5, 'E6', .5), (2, 'D6', .5), (3.25, 'C6', .25), (3.5, 'E6', .5)])
# 11: the charge-up (beats 0-2, while the XP bar fills) and the LEVEL UP fanfare (beats 2-4)
for i, p in enumerate(['G4', 'B4', 'D5', 'G5', 'B5', 'D6', 'F6', 'G6']): L(11, 0.25 * i, p, 0.25, 0.55 + 0.05 * i, vib=0)
for i, p in enumerate(['C6', 'E6', 'G6']): L(11, 2 + i / 6, p, 1 / 6, 1.0, vib=0, **FAN)
L(11, 2.5, 'C7', 1.4, 1.0, vib=0.3, **FAN); Hm(11, 2.5, 'G6', 1.4, 0.7); Hm(11, 2.5, 'E6', 1.4, 0.6)
# 12-13 boss: a low menacing line in C minor, gaps left for the two hits (bar 13 beats 0.5 and 2.5)
melody(12, [(0, 'C5', .5), (.5, 'D5', .5), (1, 'Eb5', .5), (1.5, 'G5', .5), (2, 'Ab5', 1), (3, 'G5', 1)], vel=0.85)
melody(13, [(0, 'Eb5', .5), (1, 'D5', .5), (1.5, 'C5', .5), (2, 'B4', .5), (3, 'D5', .5), (3.5, 'G5', .5)], vel=0.85)
# 14 victory fanfare on "WIN!": a triplet run up to a held C, then the achievement chime (beat 2.5) and a little tag
for i, p in enumerate(['C6', 'E6', 'G6']): L(14, i / 3, p, 1 / 3, 1.0, vib=0, **FAN)
for i, p in enumerate(['G5', 'C6', 'E6']): Hm(14, i / 3, p, 1 / 3, 0.7)
L(14, 1, 'C7', 1.4, 1.0, vib=0.3, **FAN); Hm(14, 1, 'G6', 1.4, 0.7); Hm(14, 1, 'E6', 1.4, 0.6)
melody(14, [(3, 'G6', .5), (3.5, 'E6', .5)], vel=0.8)
# 15 the theme returns, then makes way for CONTINUE? (beat 2.5)
melody(15, [(0, 'E5', .5), (.5, 'G5', .5), (1, 'C6', 1)])
# 16-19 continue: a gentle, sparse line
melody(16, [(0, 'A5', 1.5), (1.5, 'G5', .5), (2, 'F5', 1), (3, 'A5', 1)], vel=0.7)
melody(17, [(0, 'G5', 1.5), (1.5, 'B5', .5), (2, 'D6', 2)], vel=0.7)
melody(18, [(0, 'E6', 1), (1, 'D6', 1), (2, 'C6', 1), (3, 'E6', 1)], vel=0.7)
melody(19, [(0, 'F6', 1), (1, 'D6', 1)], vel=0.7)
# the end jingle (from the end screen, bar 19 beat 2) into the final chord on bar 20
for i, p in enumerate(['G5', 'C6', 'E6', 'G6']): L(19, 2 + 0.25 * i, p, 0.25, 0.9, vib=0, **FAN)
L(19, 3, 'E6', 0.5, 0.9, vib=0, **FAN); L(19, 3.5, 'G6', 0.5, 0.95, vib=0, **FAN)
L(20, 0, 'C7', 3.6, 1.0, vib=0.25, r=0.6, **FAN); Hm(20, 0, 'G6', 3.6, 0.65); Hm(20, 0, 'E6', 3.6, 0.55)
Bs(20, 0, 'C2', 1.0, 1.0); Bs(20, 1, 'C3', 2.6, 0.8)
for i, p in enumerate(['C5', 'E5', 'G5', 'C6']): add(stems['arp'], tone('pulse', p, 0.12, 0.6, duty=0.125, a=0.002, d=0.05, s=0.4, r=0.05), bt(20, 0.25 * i), pan=0.3 - 0.2 * i)

# ---------------------------------------------------------------- drums (real samples)
def hit(inst, var, t, vel, pan=0.0, g=1.0):
    x = S.hit(inst, var, vel); add(stems['drums'], np.asarray(x, float), t, g, pan)
for bar in range(0, 21):
    boss, cont, fill = 12 <= bar <= 13, 16 <= bar <= 19, bar == 11
    if bar == 20: hit('bass_drum', None, bt(20), 0.8); add(stems['drums'], C.kick(0.8), bt(20)); break
    for e8 in range(8):
        tb = bt(bar, e8 / 2)
        if fill and e8 >= 4: continue                    # the LEVEL UP fanfare stands alone
        if not (bar == 0 and e8 == 0): hit('hihat', 'closed', tb, 0.32 if e8 % 2 == 0 else 0.22, 0.3, 0.55 if cont else 0.8)
        if boss: hit('hihat', 'closed', tb + B / 4, 0.16, 0.3, 0.6)
    kicks = [0, 1, 2, 3] if boss else [0, 2] if cont else [0, 1.5, 2] if bar >= 5 else [0, 2]
    snares = [2] if cont else [1, 3]
    if fill: kicks, snares = [0], []
    for k in kicks:
        if bar == 19 and k >= 2 and cont: continue
        hit('bass_drum', None, bt(bar, k), 0.62 if k == 0 else 0.5); add(stems['drums'], C.kick(0.55), bt(bar, k))
    for s in snares: hit('snare', 'on', bt(bar, s), 0.42 if not cont else 0.3, -0.1)
    if fill:                                            # tom roll under the charge-up
        for i in range(8): hit('toms', 'high' if i < 4 else 'low', bt(11, 0.25 * i), 0.3 + 0.04 * i, 0.2 - 0.05 * i)
for b in (2, 3, 3.5):                                   # the end jingle's last kicks
    hit('bass_drum', None, bt(19, b), 0.55); add(stems['drums'], C.kick(0.5), bt(19, b))

# ---------------------------------------------------------------- bells: glockenspiel and chimes on the big moments
def bell(t, p, vel=0.5, inst='glockenspiel', d=1.2, pan=0.2): add(stems['bells'], np.asarray(S.note(inst, p, d, vel), float), t, 1.0, pan)
bell(bt(5), 'C7', 0.55); bell(bt(5), 'E6', 0.4, 'hand_chimes', 1.6, -0.2)            # quest landing
bell(one('levelup') + B / 2, 'C7', 0.6); bell(one('levelup') + B / 2, 'G6', 0.5, 'hand_chimes', 1.8)
bell(bt(14, 1), 'C7', 0.6); bell(bt(14, 1), 'E6', 0.5, 'hand_chimes', 1.8)           # victory
for i, p in enumerate(['C6', 'E6', 'G6', 'C7']): bell(one('achievement') + i * 0.06, p, 0.5)
bell(bt(20), 'C7', 0.55, d=2.4); bell(bt(20), 'G6', 0.5, 'hand_chimes', 2.4); bell(bt(20), 'E6', 0.45, 'hand_chimes', 2.4, -0.2)

# ---------------------------------------------------------------- cue sounds: chip blips placed exactly on the picture
def blip(t, p, d=0.06, vel=0.6, duty=0.125, **kw): add(stems['cues'], tone('pulse', p, d, vel, duty=duty, a=0.001, d=0.04, s=0.5, r=0.03, **kw), t)
for e in EV:
    t, k = e['t'], e['type']
    if k == 'boot': [blip(t + i * 0.05, p, 0.05, 0.7) for i, p in enumerate(['C6', 'G6', 'C7'])]
    elif k == 'row': blip(t, ['E6', 'G6', 'A6'][e['n']], 0.06, 0.45)
    elif k == 'alarm': [blip(t + i * 0.12, p, 0.09, 0.35, duty=0.5) for i, p in enumerate(['A5', 'F5', 'A5', 'F5'])]
    elif k == 'menu': blip(t, 'C6', 0.05, 0.5); blip(t + 0.06, 'E6', 0.06, 0.5)
    elif k == 'select': [blip(t + i * 0.045, p, 0.05, 0.6) for i, p in enumerate(['C6', 'E6', 'G6', 'C7'])]
    elif k == 'alert': blip(t, 'E6', 0.14, 0.55, duty=0.25, slide=5, slide_time=0.08)
    elif k == 'qrow': blip(t, 'G6', 0.05, 0.35)
    elif k == 'map': [blip(t + i * 0.05, p, 0.05, 0.45) for i, p in enumerate(['C5', 'E5', 'G5', 'C6'])]
    elif k == 'item': [blip(t + i * 0.045, p, 0.06, 0.65) for i, p in enumerate(['E6', 'G6', 'C7'] if e['n'] == 0 else ['G6', 'B6', 'D7'])]; bell(t + 0.1, 'C7' if e['n'] == 0 else 'D7', 0.4)
    elif k == 'boss': blip(t, 'C4', 0.3, 0.55, duty=0.5); blip(t + B / 2, 'C4', 0.3, 0.5, duty=0.5)
    elif k == 'hit':
        hit('toms', 'low', t, 0.7, 0, 1.2); hit('bass_drum', None, t, 0.8); add(stems['drums'], C.kick(0.9), t)
        for p in (['C3', 'Eb3', 'G3'] if e['n'] == 0 else ['Eb3', 'G3', 'Bb3']): add(stems['cues'], tone('pulse', p, 0.18, 0.4, duty=0.5, d=0.08, s=0.5), t)
        blip(t + 0.02, 'C6' if e['n'] == 0 else 'Eb6', 0.16, 0.5, duty=0.25, slide=-12, slide_time=0.15)
    elif k == 'continue':
        beeps = np.arange(t, one('end') - 0.05, 2 * B)
        for i, tb in enumerate(beeps): blip(tb, 'A5', 0.08, 0.32, duty=0.5)
    elif k == 'numbers': [blip(t + i * (1.0 / 8), 'C7', 0.025, 0.22) for i in range(8)]
    elif k == 'press': blip(t, 'C6', 0.07, 0.55); blip(t + 0.08, 'G6', 0.14, 0.55); bell(t + 0.08, 'G6', 0.35)

# ---------------------------------------------------------------- mix
lead = C.echo(stems['lead'], time=0.75 * B, fb=0.2, mix=0.18)                    # a light echo on the dotted eighth (0.3 s at 150 BPM)
voice, _ = sf.read(os.path.join(OUT, 'voice.wav'), dtype='float64')
voice = np.vstack([voice, np.zeros((N - len(voice), 2))])[:N]
win = int(0.05 * SR); venv = np.sqrt(np.convolve(voice[:, 0] ** 2, np.ones(win) / win, 'same'))
talk = (20 * np.log10(venv + 1e-9) > -38).astype(float)
smooth = lambda x, s: np.convolve(x, np.ones(int(s * SR)) / int(s * SR), 'same')
talk = smooth(talk, 0.25)
duck_band = 10 ** (-5 * talk / 20)                      # the band dips 5 dB under speech
duck_lead = 10 ** (-9 * talk / 20)                      # the melody steps well back while he talks, and sings in the gaps
G = {'lead': 0.34, 'harm': 0.16, 'arp': 0.17, 'bass': 0.26, 'drums': 1.0, 'bells': 0.30}
band = stems['arp'] * G['arp'] + stems['bass'] * G['bass'] + stems['drums'] * G['drums'] + stems['bells'] * G['bells'] + stems['harm'] * G['harm']
lead = lead * G['lead']
rms = lambda x: np.sqrt((x ** 2).mean()) + 1e-12
speech = venv > np.percentile(venv, 55)
v_rms = rms(voice[speech, 0]); end_i = int(one('end') * SR)
from scipy.signal import butter, sosfilt
hp = lambda x: sosfilt(butter(2, 150, 'high', fs=SR, output='sos'), x)
g = rms(hp(voice[speech, 0])) / rms(hp((band + lead)[:end_i, 0])) * 10 ** (-9 / 20)   # the score ~9 dB under his voice as a phone plays it, before ducking
music = (band * duck_band[:, None] + lead * duck_lead[:, None]) * g
music = S.room(music.astype(np.float32), 0.3, 0.1).astype(np.float64)
cues = stems['cues'] * 0.5 * g
L_ = int(DUR * SR)
fo = int(0.3 * SR); music[L_ - fo:L_] *= np.linspace(1, 0, fo)[:, None] ** 2
mix = (voice + music + cues)[:L_]
mix = np.stack([limit(mix[:, 0], 0.95), limit(mix[:, 1], 0.95)], 1)
os.makedirs(OUT, exist_ok=True)
sf.write(os.path.join(OUT, 'music.wav'), (music + cues)[:L_].astype(np.float32), SR, subtype='PCM_24')
for k in ('lead', 'arp', 'bass', 'drums'): sf.write(os.path.join(OUT, f'stem_{k}.wav'), stems[k][:L_].astype(np.float32), SR, subtype='PCM_24')
sf.write(os.path.join(OUT, 'mix.wav'), mix.astype(np.float32), SR, subtype='PCM_24')
print(f'mix {L_ / SR:.2f} s | {60 / B:.0f} BPM, {DUR / BAR:.1f} bars')
