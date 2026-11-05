# Daily English · Day 3 · Say It Like a Local · ordering coffee

The third video of the 30-day series (`videos/_handoff/DAILY_ENGLISH_SERIES.md`), in the approved **paper-cut** series look, paced like Days 1 and 2.

- `SCRIPT.md`: the animation-ready script, scene by scene. The Mongolian is Claude's, for Batu to check.
- `src/paper.js`: the series look, copied from Day 2. It adds balanced line breaks in two-line subtitles.
- `src/local.js`: **the "Say It Like a Local" format, reused on Days 10, 17 and 24**:
  - cut-paper speech bubbles that pop out of their tails: them on the left, you on the right, a wrong line in pink with a strip and ✗
  - Day 3's HML paper cup, which builds with the order
  - the café menu card with hand-cut orange circles
  - the recap receipt that prints line by line, with a red ink stamp
- `src/day.js` (`?view=day`): Day 3's timeline. The tables `T` (scene and pop times), `EX` (the four exchanges) and `SUBS` hold all the timing and text.
- `audio/score.py`: **the "Say It Like a Local" theme**:
  - original, on real CC0 samples only
  - in the same family as the other series themes (G major, 128 BPM, the same end-card landing)
  - a café feel: swung rhythm, seventh chords, a walking bass, vibraphone questions and marimba answers
  - the band leaves a gap at every ✓

## Status

**Preview:** `renders/daily-03-coffee.mp4`, 17.3 s, timed to the script on a 128 BPM grid, music only, no voice yet.

**When Batu's voiceover arrives:**
1. Run Whisper word timings on it (as `hml-online-reel/tools/align.py`).
2. Move each scene start and pop in `src/day.js` onto his words.
3. Write `audio/voice.py` (his voice untouched, `pan=mono|c0=c0`).
4. Re-run `audio/score.py`. It ducks the music under the voice when `audio/out/voice.wav` exists.
5. Run `audio/final.py`, render and mux.

## Rebuild

```sh
node $LIB/core/render/events.mjs "$PWD" --q 'view=day' --size 1080x1920 --out "$PWD/edit/events.json"
$LIB/.venv/bin/python audio/score.py && $LIB/.venv/bin/python audio/final.py
node $LIB/core/render/video.mjs "$PWD" --fps 30 --workers 5 --size 1080x1920 --q 'view=day' --out "$PWD/out/video.mp4"
sh audio/master.sh
```
