# HML online course Reel

A talking-head ad for HML's online classes. Final file: `renders/hml-online-reel.mp4` (9:16, about 35 s, -14 LUFS).

## What was decided

- **Look A, "HML notebook, coffee edition"** (chosen from three looks: `stills/board_0.jpg`). It's the olympiad Reel's paper, stickers and hard shadows, with kraft-paper cups and tape, coffee rings, and the 3+1 offer as a café loyalty card.
- **Storyboard:** `stills/storyboard_0.jpg`, 11 beats. The full-size frames are in `stills/board/`.
- **Subtitles** carry every word of the script. Batu confirmed he said "Таны", "байна", "бүгд багтсан" and "Энэн", which Whisper missed.
- **Schedule:** Tuesday, Thursday and Saturday at 17:00, online.
- **No price** on screen, **no name tag**, and **no hook clip**: it opens straight on his question.

## How it's built

- `src/footage.mov`: his 42 s CapCut export. It isn't in git; download it from the Drive link Batu sent.
- `frames/`: every source frame as a JPEG (`ffmpeg -i src/footage.mov -fps_mode passthrough -q:v 2 -start_number 0 frames/%05d.jpg`).
- `tools/align.py`: Whisper large-v3 word timings per take, written to `edit/align.json`.
- `src/edit.js` (`?view=edit`) is the whole edit as one deterministic `render(t)`:
  - The cut list (`KEEP` in `src/common.js`) drops his walks in and out of frame.
  - Where he talks while still walking in (output 0:05, 0:19 and 0:24), a full-screen notebook page covers the picture and his voice carries on. The page then flips up to reveal him with the card.
  - The signature transition is `steamParts` in `src/a.js`: the coffee steam grows into the HML tree.
  - Every caption and card is placed in source seconds.
- `src/a.js`: the look's components. `src/b.js` and `src/c.js` are the two looks that weren't chosen.
- Audio:
  - `audio/voice.py`: his voice untouched, one channel, cut with 10 ms fades.
  - `audio/score.py`: the original café score and effects from `edit/events.json`, ducked under the voice. Uses CC0 samples from VSCO 2 CE, VCSL and FreePats.
  - `audio/final.py`: one gain to -14 LUFS and a look-ahead limiter.
  - `audio/master.sh`: the mux.

## Rebuild (from the project folder, library at `$LIB`)

```sh
node $LIB/core/render/events.mjs "$PWD" --q 'view=edit' --size 1080x1920 --out "$PWD/edit/events.json"
$LIB/.venv/bin/python audio/voice.py && $LIB/.venv/bin/python audio/score.py && $LIB/.venv/bin/python audio/final.py
node $LIB/core/render/video.mjs "$PWD" --fps 30 --workers 5 --size 1080x1920 --q 'view=edit' --out "$PWD/out/video.mp4"
sh audio/master.sh
```

The score needs `sh tools/fetch.sh instruments freepats` (nylon guitar) on top of `vsco2ce` and `vcsl`.
