# HML linking-words Reel 2 (seven more linking phrases, English and Mongolian)

The teacher says seven linking phrases to camera, each in English and then its Mongolian meaning (one take, 31.1 s). Batu asked for it
"the same way we did with the first linking words video", with one fix: in the first video the boxes sat so close that their borders
touched the boxes above, so "space it out a bit and make it look easy to look at".

**Final:** `renders/hml-phrases2-reel.mp4`:
- 9:16 1080x1920, 31.1 s (the whole take, uncut), 30 fps
- H.264 CRF 12, BT.709
- AAC 320k at 44.1 kHz
- -17.9 LUFS, the same as the original (-17.8)

## What was decided

- **The first video's look and format:** "ABC blocks", a numbered amber block on each phrase, orange and navy planks, the list building up in the open space above her head, and the header "LINKING WORDS · холбох үгс".
- **The spacing fix:**
  - **One plank per phrase.** The bold English sits on top and its Mongolian underneath, in the same box (as in Batu's reference), so a pair can never touch the next pair.
  - **Clear gaps.** The planks are about 30 px apart, shadows included, in one column with nothing side by side.
  - **Bigger type.** The English is 40 px Montserrat and the Mongolian 28 px Manrope.
- **Two pages.** These phrases are long, and the free space above her head is only about 560 px (y 230 to 800). Seven planks at a readable size would not fit without touching each other or her head.
  - **Page 1/2:** phrases 1 to 4.
  - **The change, at 15.1 s:** once she has finished phrase 4's Mongolian, page one slides off to the left, top row first, so the planks never cross each other. The header turns to 2/2.
  - **Page 2/2:** phrases 5 to 7 build up, and they stay on to the end.
- **Timing:**
  - Each number pops in and the plank slides in as she starts the English. Its Mongolian line fades in as she starts the Mongolian.
  - The onsets are the speech onsets after her pauses. Whisper confirms which words each segment holds (`tools/segments.py`, `tools/align.py`, `edit/align.json`).
- **Words as said:**
  - She says "There's no doubt that". The screen keeps Batu's "There is no doubt that".
  - She runs "Ultimately" straight into "эцэст нь хэлэхэд".
- **Music** (`audio/score.py`): soft and nice, nothing loud or distracting, as in the first video.
  - A quiet bed of grand piano (Salamander) and a very low string pad in F major, with no drums. It uses a new progression: Fmaj7 · Dm7 · Bbmaj7 · C · Am7 · Gm7 · Csus4-C.
  - The chord changes exactly as each new phrase starts.
  - A gentle kalimba note, a step higher each time, marks each phrase, and a soft three-note fall turns the page.
  - It resolves to F on her last word, "хэрэггүй".
  - It sits at one constant level, 22 dB under her speech, with no ducking.

## Quality (unchanged from the original)

- **The picture:** the take is never re-sampled, cut or zoomed.
  - `tools/overlay.mjs` renders only the graphics, losslessly with alpha.
  - `tools/composite.sh` lays them over the camera file in one encode.
  - `tools/fidelity.py`: untouched pixels average 47.8 dB PSNR against the original (minimum 46.5). All 934 frames are in place, with none frozen, and the audio is in sync to the sample.
- **The sound:** her voice is the take's own track, decoded and left exactly as it is.
  - No resampling, gain, EQ, compression or limiter.
  - The sum peaks at -1.0 dBFS, as her own recording does.
  - With the music taken back out, the final file's voice matches the original track to 47.0 dB (only the AAC 320k encode), with a level change of 0.00 dB.

## For Batu to check

- **All the Mongolian on screen.** It is Claude's reading of the transcript:
  - үүнийг үл харгалзан
  - эцэст нь хэлэхэд
  - миний бодлоор
  - миний ойлгож байгаагаар
  - үүнийг дурдах нь зүйтэй
  - үүнийг цохон тэмдэглэх нь зүйтэй
  - үүнд эргэлзэх хэрэггүй
  - the header "холбох үгс"

## Rebuild (from the project folder; `src/take.mov` is not in git)

```sh
node $LIB/core/render/events.mjs "$PWD" --q 'view=edit' --size 1080x1920 --out "$PWD/edit/events.json"
$LIB/.venv/bin/python audio/score.py
node tools/overlay.mjs "$PWD" --fps 30 --workers 4 --q 'view=edit'
sh tools/composite.sh
$LIB/.venv/bin/python tools/fidelity.py
```
