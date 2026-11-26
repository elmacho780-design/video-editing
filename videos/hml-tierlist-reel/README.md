# HML tier-list promo ("АНГЛИ ХЭЛ СУРАХ ХИЧЭЭЛЭЭС ГАДНАХ АРГУУД · TIER LIST")

The teacher ranks ways to learn English outside class. It ends with HML's Saturday and Sunday kids' classes and the phone numbers.
Edited in the grammar of Batu's reference video (a split-screen tier list), in our ABC-blocks look.

**Final:** `renders/hml-tierlist-reel.mp4` (about 120 MB, over GitHub's 100 MB limit, so **not in git**; rebuild it with the commands below, or use the copy sent to Batu):
- 9:16 1080x1920, 100.4 s (the whole take, uncut), 30 fps
- H.264 CRF 12, BT.709
- AAC 320k at 44.1 kHz

## What was decided

- **Look A, "ABC blocks"**, chosen from three skins (`stills/board_0.jpg`). Batu gave the title: "АНГЛИ ХЭЛ СУРАХ ХИЧЭЭЛЭЭС ГАДНАХ АРГУУД · TIER LIST".
- **The layout:**
  - **Top 960 px:** the teacher. The landscape take (1920x1080) is a straight 1080x960 window of its own pixels (`crop=1080:960:320:0`), never scaled.
  - **Bottom:** the tier board (S A B C), with a tray of the methods still to come.
- **Each method:**
  1. Its big card (Batu's image) appears just before she names it, under a "ЯМАР TIER ВЭ?" tag.
  2. It flies down into its row on the tier word. It stays up at least 1.3 s and at most 2.4 s, so it is seen and never covers her for long.
  3. The tier letter pops beside her.
- **The rankings, as she says them:**
  - S: video games, cartoons, then the HML class ("зөв чиглүүлэгтэй анги")
  - B: Duolingo, songs
  - C: Google Translate, memorising words
- **Images:**
  - Batu's own images are used for Duolingo, video games, songs, Google Translate and cartoons. They are third-party pictures, kept in `assets/ext/` and **not in git**.
  - Memorising words uses our own drawing (flashcards).
  - The class uses the HML logo.
- **Captions:** every word, in Batu's transcript spelling with Whisper's timing (`tools/align.py`, `tools/pass1.py`, `tools/caps.py` → `edit/caps.json`).
- **Banners:**
  - the hook on frame one: "Аль нь үр дүнтэй, аль нь цагийн гарз вэ?"
  - the enrolment: "Хагас сайн, бүтэн сайнд хүүхдийн анги · ЭЛСЭЛТ"
  - the numbers: 9930 4451 · 8888 3351
- **Music** (`audio/score.py`): soft grand piano and a low string pad in F, 22 dB under her speech, with no drums and no ducking.
  - a kalimba note as each card appears
  - a tuned landing per tier: S rises, B is calm, C falls

## Quality

The pipeline is the same as the weekend and linking-words Reels:
- `tools/overlay.mjs`: the graphics only, lossless with alpha
- `tools/composite.sh`: one encode over the camera file
- `tools/fidelity.py`: the top window against the source window, the frame order and the audio sync

Her voice is the take's own track, untouched. The original already peaks at +1.2 dBFS, and that is kept as recorded.

Results:
- **Picture:** the top window against the source averages 48.2 dB PSNR (minimum 45.2).
- **Frames:** none misplaced or frozen.
- **Sound:** in sync to the sample. Her voice matches the original track to 42 dB (only the AAC 320k encode), with a level change of 0.00 dB.
- **Loudness:** -16.1 LUFS, the same as the original.

**Two cuts are already in the camera file** (the framing jumps at 78.0 s and 88.47 s; `tools/fidelity.py` and a frame-difference scan found them). Each is covered by a quick wall of ABC blocks over the top half (`WALLS` in `src/edit.js`); the second one carries "ЭЛСЭЛТ".

## For Batu to check

- **All the Mongolian on screen** (it's Claude's reading of the transcript).
- **"Өдөр бүр давтахад өгнө, бол хэрэгтэй"**: the transcript has "udur bur davtahad ugna bol heregtei".
- **"Хэрэгтэй үгээ цээжлэхгүй хараад л өнгөрнө"**: the transcript has "tseejleel".
- **"шинээр элсэлт"**: Whisper hears "шинээр", which the transcript doesn't have.

## Rebuild (from the project folder; `src/take.mov` and `assets/ext/` are not in git)

```sh
node $LIB/core/render/events.mjs "$PWD" --q 'view=edit' --size 1080x1920 --out "$PWD/edit/events.json"
$LIB/.venv/bin/python audio/score.py
node tools/overlay.mjs "$PWD" --fps 30 --workers 6 --q 'view=edit'
sh tools/composite.sh
$LIB/.venv/bin/python tools/fidelity.py
```
