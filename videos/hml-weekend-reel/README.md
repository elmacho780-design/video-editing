# HML weekend-classes Reel (ABC and level-up classes)

An ad for the new weekend classes:
- an ABC class and an English level-up class
- starting 14 and 15 November (Saturday and Sunday)
- classes at 11:30 and 13:00

The teacher talks to camera in one take with two camera set-ups (32.6 s). Status: **style frames sent; waiting for Batu to choose a look** (`stills/board_0.jpg`).

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

Pauses are trimmed, which gives about 31 s. The music is original and written to the picture, with hits on the cuts.

## Files

- `src/looks.js`: the three candidate looks (A ABC blocks, B Fast track, C Crayon) on four beats.
- `src/frames.js`: `?view=frames&look=a`, t = 0 to 3.
- `src/board.js`: the comparison sheet `stills/board_0.jpg`.
