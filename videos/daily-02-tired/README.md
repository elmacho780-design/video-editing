# Daily English · Day 2 · One Word, Three Levels · tired, exhausted, fatigued

The second video of the 30-day series (`videos/_handoff/DAILY_ENGLISH_SERIES.md`), in the approved **paper-cut** series look, paced like Day 1 version 2.

- `SCRIPT.md`: the animation-ready script, scene by scene. The Mongolian is Claude's, for Batu to check.
- `src/paper.js`: the series look, copied from Day 1. It has two small improvements, to carry back into Day 1 at its voiceover pass:
  - a subtitle that is too long wraps to two lines inside 780 px, so it stays clear of the right-hand buttons
  - a long tag shrinks its type to fit
- `src/levels.js`: **the "One Word, Three Levels" format, reused on Days 9, 16 and 23**:
  - the paper staircase (the hook and the recap)
  - the level card that slides in (a "LEVEL n · register" band with a three-bar meter, the word, the meaning, an icon, an example)
  - cut-paper icons: battery, clipboard, bookmark, "z"s
- `src/day.js` (`?view=day`): Day 2's timeline. The tables `T` (scene and pop times) and `SUBS` hold all the timing.
- `audio/score.py`: **the "One Word, Three Levels" theme**:
  - original, on real CC0 samples only
  - in the same family as the "Stop Saying This" theme (G major, 128 BPM, the same end-card landing)
  - the band builds level by level
  - level pops one step higher each time (G, B, D)

## Status

**Preview:** `renders/daily-02-tired.mp4`, 17.3 s, timed to the script on a 128 BPM grid, music only, no voice yet.

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
