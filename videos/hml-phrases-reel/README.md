# HML linking-words Reel (seven linking phrases, English and Mongolian)

The teacher says seven linking phrases to camera, each in English and then its Mongolian meaning (one take, 21.7 s). Batu asked for the
words on screen "with our hallmark style but similar to the second video format" (his reference: a list that builds up, English with
the Mongolian underneath), with soft music, and the video and audio quality unchanged.

**Final:** `renders/hml-phrases-reel.mp4`:
- 9:16, 21.7 s, 30 fps
- H.264 CRF 12, BT.709
- AAC 320k at 44.1 kHz
- -16.2 LUFS, the same as the original

## What was decided

- **Look C, "ABC blocks"**, chosen from three looks (`stills/board_0.jpg`). Each phrase is a numbered amber block with the English on an orange or navy plank and the Mongolian on a cream plank. The header is "LINKING WORDS · холбох үгс" (Claude's Mongolian, for Batu to check).
- **The reference's format, moved off her face.** Her face is central here, so the list is a two-column grid in the open space above her head.
  - Each number pops in and the English plank slides in as she starts the English.
  - The Mongolian plank slides in as she starts the Mongolian.
  - Every pair stays on to the end.
- **Words as said:** she says "In other words" (Batu's notes had "in another word"). Whisper confirms all seven (`tools/align.py`, `edit/align.json`). The timings are the speech onsets between her pauses.
- **Music:** soft and nice, nothing loud or distracting (`audio/score.py`).
  - A quiet bed of grand piano (Salamander) and a very low string pad in F major, with no drums.
  - The chord changes exactly as each new phrase starts, and a gentle kalimba note marks each phrase.
  - It sits at one constant level, 22 dB under her speech, with no ducking and no pumping.

## Quality (unchanged from the original)

- **The picture:** the take is never re-sampled, cut or zoomed.
  - `tools/overlay.mjs` renders only the graphics, losslessly with alpha.
  - `tools/composite.sh` lays them over the camera file in one encode.
  - `tools/fidelity.py`: untouched pixels average 47.8 dB PSNR against the original (minimum 46.1), all 651 frames in place, audio in sync to the sample.
- **The sound:** her voice is the take's own track, decoded and left exactly as it is.
  - No resampling, gain, EQ, compression or limiter.
  - The sum peaks at -2.8 dBFS, as the original does.
  - With the music taken back out, the final file's voice matches the original track to 44.7 dB, which is only the AAC 320k encode. That is about three times the original's 100 kbps.

## Rebuild (from the project folder; `src/take.mov` is not in git)

```sh
node $LIB/core/render/events.mjs "$PWD" --q 'view=edit' --size 1080x1920 --out "$PWD/edit/events.json"
$LIB/.venv/bin/python audio/score.py
node tools/overlay.mjs "$PWD" --fps 30 --workers 5 --q 'view=edit'
sh tools/composite.sh
$LIB/.venv/bin/python tools/fidelity.py
```
