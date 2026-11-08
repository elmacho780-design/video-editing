# HML weekend-classes Reel (ABC and level-up classes)

An ad for the new weekend classes:
- an ABC class and an English level-up class
- starting 14 and 15 November (Saturday and Sunday)
- classes at 11:30 and 13:00

The teacher talks to camera in one take with two camera set-ups (32.6 s).

**Final:** `renders/hml-weekend-reel.mp4` (9:16, 35.0 s, 30 fps, H.264 at about 21 Mbps, BT.709, -14 LUFS). It uses Look A, "ABC blocks", which Batu chose from `stills/board_0.jpg`.

## Quality first (Batu's main feedback on earlier edits: "quality worsens after editing, glitches")

The footage never passes through the browser:
1. `tools/overlay.mjs` renders only the graphics, as PNG screenshots with a transparent background, stored losslessly (FFV1 BGRA) in `out/overlay.mkv`.
2. `tools/composite.sh` lays that over the original camera file, flipped back and frame for frame, in **one** x264 encode:
   - CRF 12, High profile, constant 30 fps
   - the graphics converted with the same BT.709 limited-range matrix as the footage
   - tagged BT.709 like the source
3. **No cuts and no punch-ins:** the take plays exactly as filmed, so there are no jump cuts. The camera change is covered by a full-screen wall of blocks.
4. `tools/fidelity.py` checks the result against the camera file:
   - PSNR on every untouched pixel: mean 47.8 dB, minimum 45.1 dB (visually lossless)
   - colour shift: about 0.05 of a level
   - 0 misplaced or frozen frames
   - audio sync: 0 ms

   A simulation of the old pipeline on the same frames scored 42.8 dB. That simulation omits the old browser JPEG screenshot and its colour-matrix shift, so the real old loss was worse.

## The footage

- `src/take.mov`: 1080x1920 HEVC, 30 fps, 32.6 s. It isn't in git; download it from the Drive link Batu sent.
- **Two set-ups with a camera cut at 12.93 s (frame 388).** In the second, she is turned sideways at first and faces the camera by about 13.4 s.
- **The take is mirrored** (front camera): "Oxford Discover" on the books read backwards. `frames/` holds every frame flipped back (`ffmpeg -i src/take.mov -fps_mode passthrough -vf hflip -q:v 2 -start_number 0 frames/%05d.jpg`).
- **Her face sits at about y 560 to 1000** in both set-ups. Keep graphics in the top band (y 230 to 560) and on her sweater (y 1050 to 1500). While she holds the books (about 6 to 11 s), use the top band only.

## What she says (Whisper large-v3, `tools/align.py`, `edit/align.json`)

Similarity to Batu's transcript is 0.94 to 1.00 per sentence. The Cyrillic is Claude's reading of Batu's transcript, for Batu to check.

| Source (s) | Line |
|---|---|
| 0.0 to 8.0 | 2-оос 3 сарын дотор таны хүүхдийг англиар уншиж сургаад, олон улсын хөтөлбөрийн 1 жил үздэг номыг 1 сарын дотор үзээд, |
| 8.0 to 12.7 | 2 дахь сард нь 2-р ангийн хөтөлбөрийг үзээд дуусгана гэвэл ямар сонсогдож байна? |
| 13.0 to 18.8 | Амралтын өдрүүдээр явагдах ABC болон англи хэлний түвшин ахиулах ангидаа шинээр элсэлт авч байна. |
| 19.1 to 22.1 | Хичээл нь 11 сарын 14, 15-нд эхэлнэ. |
| 22.45 to 26.3 | Хичээлийн хуваарийн хувьд бол 11:30, 1 цаг гэсэн ангиуд байгаа. (Whisper hears "11, 1 цаг": to confirm with Batu) |
| 26.3 to 32.4 | Хэрвээ та илүү их мэдээлэл авахыг хүсвэл доорх утасны дугаараар холбогдоод бүртгүүлээрэй. За, амжилт хүсье. |

## The storyboard (the same for any look)

1. **0 s, the hook:** "2-3 САРЫН ДОТОР АНГЛИАР УНШИНА" lands on frame one, with word-timed captions throughout.
2. **About 4 to 8 s, the books:** "1 жилийн ном → 1 сар" as she holds up Oxford Discover 1.
3. **8 to 12.7 s:** "2 дахь сар: 2-р анги ✓" as book 2 comes up.
4. **12.7 to 13.4 s:** a full-screen "ШИНЭЭР ЭЛСЭЛТ" wipe covers the camera cut and her turn.
5. **13.4 to 18.8 s:** the two classes ("ABC анги", "Түвшин ахиулах") and "Амралтын өдрүүдэд".
6. **19 to 22 s:** the start dates (11/14 Бямба, 11/15 Ням).
7. **22 to 26 s:** the times, 11:30 and 13:00.
8. **26 to 31 s:** the phone numbers (9930 4451, 8888 3351), staying on to the end.
9. **31 to 33 s:** "За, амжилт хүсье" into the end card (logo, numbers, @hml_english).

(Planned with trimmed pauses; the final keeps the take uncut, for quality.)

## The edit (`src/edit.js`, `src/blocks.js`)

- **0 s:** "2 - 3 САРЫН ДОТОР / АНГЛИАР УНШИНА" in toy blocks and planks, in place on frame one.
- **4 s:** "ОЛОН УЛСЫН ХӨТӨЛБӨР: 1 ЖИЛ → 1 САР ✓" as she shows Oxford Discover 1.
- **8 s:** "2 ДАХЬ САРД: 2-Р АНГИЙН ХӨТӨЛБӨР ✓" with book 2, then a "?" block on "ямар сонсогдож байна?".
- **12.45 s:** a wall of alphabet blocks with "ШИНЭЭР ЭЛСЭЛТ" covers the camera change at 12.93 s and falls away as she faces the camera again.
- **13.5 s:** "ШИНЭЭР ЭЛСЭЛТ", "АМРАЛТЫН ӨДРҮҮДЭД", "ABC анги", "Түвшин ахиулах".
- **19.7 s:** start days 11/14 Бямба and 11/15 Ням, then the times 11:30 and 13:00, as blocks over her sweater.
- **26 s:** "БҮРТГҮҮЛЭЭРЭЙ" with 9930 4451 and 8888 3351.
- **32.5 s:** the end card: logo, ШИНЭЭР ЭЛСЭЛТ, dates, times, ABC, both numbers, @hml_english.

Graphics above her face leave upwards; those below fall down, so nothing crosses her face. Word-timed captions carry every word she says. They sit on her sweater, and at the top while she holds the books.

**Audio:**
- `audio/voice.py`: her voice untouched (one channel; both are identical), resampled once to 48 kHz.
- `audio/score.py`: a toy-box score in C at 120 BPM (marimba, xylophone, glockenspiel, pizzicato, woodblock) with hits on the block cues. It ducks under her voice.
- `audio/final.py`: -14 LUFS.

## Rebuild (from the project folder)

```sh
node $LIB/core/render/events.mjs "$PWD" --q 'view=edit' --size 1080x1920 --out "$PWD/edit/events.json"
$LIB/.venv/bin/python audio/voice.py && $LIB/.venv/bin/python audio/score.py && $LIB/.venv/bin/python audio/final.py
node tools/overlay.mjs "$PWD" --fps 30 --workers 5 --q 'view=edit'
sh tools/composite.sh
$LIB/.venv/bin/python tools/fidelity.py
```

## Files

- `src/looks.js`: the three candidate looks (A ABC blocks, B Fast track, C Crayon) on four beats.
- `src/frames.js`: `?view=frames&look=a`, t = 0 to 3.
- `src/board.js`: the comparison sheet `stills/board_0.jpg`.
