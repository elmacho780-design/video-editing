# Daily English · Day 1 · Stop Saying This · "I am agree" vs "I agree"

The first video of the 30-day series (`videos/_handoff/DAILY_ENGLISH_SERIES.md`), in the approved **paper-cut** series look.

- `SCRIPT.md`: the animation-ready script, scene by scene. The Mongolian is Claude's, for Batu to check.
- `stills/board_0.jpg`: the three candidate looks. Batu chose paper-cut.
- `src/paper.js`: **the series look, reused on every animated day**:
  - the paper set (navy ground, orange and amber waves, the HML tree)
  - word tiles that drop in with a paper bounce, boil slightly once landed, and lift away between scenes
  - cut-paper ✗ and ✓ stamps, red strike strips, scissors, arrows and underlines
  - the subtitle line (English in orange) and the end card (logo, series name, @hml_english)
- `src/day.js` (`?view=day`): Day 1's timeline.
- `audio/score.py`: **the "Stop Saying This" series theme**:
  - original, G major at 120 BPM, on real CC0 samples only: ukulele, pizzicato bass, glockenspiel, marimba, kalimba, harp, chimes, shaker, claps
  - a harp lift on each scene change
  - pops only on reveals and answers, on their own layer above the music

## Status

**Preview:** `renders/daily-01-i-agree.mp4`, timed to the script on a 120 BPM grid, music only, no voice yet.

**When Batu's voiceover arrives:**
1. Run Whisper word timings on it (as `hml-online-reel/tools/align.py`).
2. Move each scene start and pop in `src/day.js` onto his words. `S`, `SUBS`, `PAIRS`, `AM_CUT` and the pop times hold all the timing.
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
