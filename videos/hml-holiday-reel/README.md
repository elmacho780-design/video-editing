# HML holiday-class Reel ("Level Up")

An ad for the student holiday class: 2 to 8 November, every day at 15:00. Final file: `renders/hml-holiday-reel.mp4` (9:16, 33.6 s, -14 LUFS).

## What was decided

- **Look 1, "Level Up"**, chosen from five candidate looks (`stills/board_0.jpg`). The Reel is a video game:
  1. A HUD, and a stats screen for the wasted holiday week.
  2. An RPG choice box ("ТИЙМ / ҮГҮЙ") and a "!" alert.
  3. NEW QUEST and the quest card.
  4. A 7-day level map with item pickups (+ДҮРЭМ, +ҮГ) and LEVEL UP.
  5. A boss bar for the progress test, with +10% and +20% hits and an achievement.
  6. A CONTINUE? screen with the phone numbers, then the end screen.
- **Captions** are an RPG dialogue box carrying every word of the script. The dates and time are on screen because he doesn't say them.
- **The cut:** the opening "За" and the long pauses come out. Each new sentence lands on the music's eighth-note grid (150 BPM).
- **Music** is an original game soundtrack written to the picture (`audio/score.py`). Batu asked for music that ties in with the style.

## How it's built

- `src/footage.mov`: his 34.5 s take (720x1280). It isn't in git; download it from the Drive link Batu sent.
- `frames/`: every frame upscaled to 1080x1920 (`ffmpeg -i src/footage.mov -fps_mode passthrough -vf scale=1080:1920:flags=lanczos -q:v 2 -start_number 0 frames/%05d.jpg`).
- `tools/align.py`: Whisper large-v3 word timings, written to `edit/align.json`.
- `src/edit.js` (`?view=edit`) is the whole edit as one deterministic `render(t)`:
  - `GAPS` decides how much of each pause is kept: `'snap'` keeps just enough that the next sentence starts on an eighth.
  - All game beats are written in source seconds and snapped to the grid.
  - The cue list is exported to `edit/events.json`.
- `src/game.js`: the look's components. They use **Press Start 2P**, which has the Mongolian Ү and Ө (Unbounded and Pixelify Sans don't).
- `src/lvl.js`, `phone.js`, `bold.js`, `doodle.js`, `poster.js` and `board.js`: the five candidate looks and the comparison sheet.
- Audio:
  - `audio/voice.py`: his voice untouched, one channel, cut with 10 ms fades.
  - `audio/chip.py`: a band-limited chip synth (pulse and triangle waves), rolled off above about 7 kHz. It has no noise channel.
  - `audio/score.py`: the score.
    - Form: overworld theme, quest fanfare on "Манай…", quest theme, adventure theme with item jingles, a charge into the LEVEL UP fanfare, boss music in C minor from the boss's entrance (on a bar line), impact hits on "10" and "20", a victory fanfare on "WIN!", the CONTINUE section with countdown beeps, and an end jingle into a final C major chord.
    - Drums are real samples; the glockenspiel and chimes are real too.
    - The lead ducks 9 dB under his voice; the band ducks 5 dB.
  - `audio/final.py` and `master.sh`: one gain to -14 LUFS, a look-ahead limiter, and the mux.

## Rebuild (from the project folder, library at `$LIB`)

```sh
node $LIB/core/render/events.mjs "$PWD" --q 'view=edit' --size 1080x1920 --out "$PWD/edit/events.json"
$LIB/.venv/bin/python audio/voice.py && $LIB/.venv/bin/python audio/score.py && $LIB/.venv/bin/python audio/final.py
node $LIB/core/render/video.mjs "$PWD" --fps 30 --workers 5 --size 1080x1920 --q 'view=edit' --out "$PWD/out/video.mp4"
sh audio/master.sh
```
