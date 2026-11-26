"""Captions and cues from edit/align.json. Whisper's Mongolian spelling is unreliable, so the caption words are Batu's transcript
(tools/align.py LINES) and only their TIMES come from Whisper: the two token lists are matched (difflib on a loose spelling key);
matched words take Whisper's times, the rest are spread evenly between their matched neighbours.
Writes edit/caps.json: phrases of at most ~26 characters with their start times (item names and "X tier" marked as keywords),
and the cue times for each method: when its name is said (its big card appears) and when its tier is said (it flies into the board).
Run from the project folder: python3 tools/caps.py"""
import os, json, re, difflib
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
A = json.load(open(os.path.join(ROOT, 'edit', 'align.json')))
key = lambda w: re.sub(r'[^a-zа-яөү]', '', w.lower()).translate(str.maketrans('өүэ', 'оуе'))[:5]
NAMES = {'duo': ['duolingo'], 'game': ['видео', 'тоглоом'], 'song': ['дуу', 'сонсох'], 'gt': ['google', 'translate'], 'toon': ['хүүхэлдэйн', 'кино'],
         'words': ['үг', 'цээжлэх'], 'hml': ['зөв']}
LINE_ITEM = {2: 'duo', 3: 'game', 4: 'song', 5: 'gt', 6: 'toon', 7: 'words', 8: 'hml'}
KW = {'duolingo', 'видео', 'тоглоом', 'дуу', 'сонсох', 'google', 'translate', 'хүүхэлдэйн', 'кино', 'үг', 'цээжлэх', 'элсэлт', 'утасны', 'дугаараар'}

phrases, cues = [], {}
for L in A:
    toks = L['text'].split(); ww = L['words']
    sm = difflib.SequenceMatcher(None, [key(t) for t in toks], [key(w['w']) for w in ww], autojunk=False)
    times = [None] * len(toks)
    for blk in sm.get_matching_blocks():
        for k in range(blk.size): times[blk.a + k] = ww[blk.b + k]['t0']
    # first and last fall back to the sentence's own first/last word
    if times[0] is None: times[0] = ww[0]['t0'] if ww else L['take'][0]
    end = ww[-1]['t1'] if ww else L['take'][1]
    # fill the gaps evenly
    i = 0
    while i < len(toks):
        if times[i] is None:
            j = i
            while j < len(toks) and times[j] is None: j += 1
            a = times[i - 1]; b = times[j] if j < len(toks) else end
            for k in range(i, j): times[k] = round(a + (b - a) * (k - i + 1) / (j - i + 1), 2)
            i = j
        else: i += 1
    for k in range(1, len(times)): times[k] = max(times[k], times[k - 1])
    # the cues: the method's name and the word "tier"
    it = LINE_ITEM.get(L['id'])
    if it:
        low = [t.lower().strip('.,?!') for t in toks]
        nm = next((k for k, t in enumerate(low) if t in NAMES[it]), 0)
        tr = next((k for k, t in enumerate(low) if t == 'tier'), None)
        if it == 'hml': tr = next((k for k, t in enumerate(low) if t.startswith('өндөр')), None); tr = tr + 1 if tr is not None else None   # "...үр дүн өндөртэй": S
        cues[it] = {'name': times[nm], 'tier': times[tr - 1] if tr else None}
    # phrases: break after punctuation, or before 27 characters
    cur, start = [], None
    for k, t in enumerate(toks):
        bare = t.lower().strip('.,?!')
        w = f'*{t}*' if bare in KW or bare == 'tier' or re.fullmatch(r'[sabc]', bare) and k + 1 < len(toks) and toks[k + 1].lower().startswith('tier') else t
        if cur and len(' '.join(cur).replace('*', '')) + len(t) + 1 > 26: phrases.append([start, ' '.join(cur)]); cur, start = [], None
        if start is None: start = times[k]
        cur.append(w)
        if t[-1] in '.,?!' and len(' '.join(cur)) > 10: phrases.append([start, ' '.join(cur)]); cur, start = [], None
    if cur: phrases.append([start, ' '.join(cur)])
    phrases.append([round(end + 0.15, 2), None])
# merge neighbouring keyword marks (*B* *tier* -> *B tier*); keep a blank only where the next phrase is more than 0.4 s away
phrases = [[t, s.replace('* *', ' ') if s else s] for t, s in phrases]
phrases = [p for i, p in enumerate(phrases) if p[1] is not None or i == len(phrases) - 1 or phrases[i + 1][0] - p[0] > 0.4]
json.dump({'phrases': phrases, 'cues': cues}, open(os.path.join(ROOT, 'edit', 'caps.json'), 'w'), ensure_ascii=False, indent=1)
for t, s in phrases: print(f'{t:6.2f}  {s}')
print(json.dumps(cues, ensure_ascii=False))
