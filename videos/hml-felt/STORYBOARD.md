# Words in boxes: storyboard

HML Academy Instagram Reel. 9:16, 24 s, needle-felt and paper. Audience: Mongolian parents.
Mongolian voiceover recorded by Batu; the animation is timed to the recording. Mongolian subtitles sit high, clear of the Reels UI.

Sheet: `stills/storyboard_0.jpg`. Key frames: `stills/board/s1_0.jpg` to `s8_0.jpg`.

**Colour arc:** grey and cold while the words sit in their boxes (shots 1 to 3). Colour arrives with the HML-orange yarn (shot 4), and the world blooms out of the words (shots 5 to 6).

| # | Time | Shot | Picture | Camera | Voiceover (MN) | English gloss | Sound |
|---|---|---|---|---|---|---|---|
| 1 | 0:00 to 0:02 | Hook | Extreme close-up: a grey drawer labelled "because" rattles, trying to get out. | Slow push-in, slight tilt. | Таны хүүхэд англи үгийг цээжилдэг үү, | Does your child memorise English words, | Low room hum, the drawer rattles. |
| 2 | 0:02 to 0:04 | The wall | Pull back: hundreds of grey drawers tower over her. A question card drops in: "Why was Saraa late?" She freezes. | Fast crane back and down. | эсвэл ойлгодог уу? | or understand them? | Card flutters in, one low piano note. |
| 3 | 0:04 to 0:07 | The problem | She pulls out "late", "bus", "snowing". Each stays pinned in place, grey and alone. They will not join. | Medium shot, slow drift. | Тусад нь цээжилсэн үгс хоорондоо холбогддоггүй. | Words memorised one by one don't connect. | Pins tink, drawers thud shut. |
| 4 | 0:07 to 0:10 | The turn | An HML-orange yarn on a felting needle stitches the words into one sentence: "She was late for the bus because it was snowing." Each word it reaches fills with colour. | Follows the needle down the garland. | HML-д бид үг бүрийг утга, хэрэглээтэй нь холбож заадаг. | At HML we teach every word joined to its meaning and use. | A soft stitch sound per word; the music starts (pizzicato). |
| 5 | 0:10 to 0:12 | The burst | The yarn pulls tight. Every drawer flies open and hundreds of words pour out in full colour. | Fast push-in, words fly past the lens. | Үгс утгаа олоход | When words find their meaning, | Big whoosh, the music swells. |
| 6 | 0:12 to 0:16 | The world | The words build winter Ulaanbaatar: "snowing" becomes the snow, "bus" the bus, "late" the alarm clock. She catches "bus" and runs for it. | Whip pan into the street, settles on the hero frame. | англи хэл амилдаг. | English comes alive. | Bus bell, alarm clock ring. |
| 7 | 0:16 to 0:20 | The proof | The bus ride ends in a paper London. She stands on a stage with a medal; felt confetti falls. | The bus drives out of frame, the camera rises to Big Ben. | Олимпиадын хоёрдугаар шатанд яг энэ чадвар хэрэгтэй. | This is exactly the skill the olympiad's second round needs. | Soft cheer, the music peaks. |
| 8 | 0:20 to 0:24 | End card | The orange yarn stitches round the HML logo on navy felt, and felt flowers bloom from the logo's tree. Phone numbers and @hml_english. She waves. | Locked off, gentle settle. | HML Academy. Үгийг цээжлэх биш, ойлгох. | HML Academy. Don't memorise words, understand them. | The music resolves, a soft chime. |

## To confirm before animation

1. **Mongolian lines:** all eight are Claude's drafts, for Batu to check and reword before recording.
2. **The proof shot:** London stands for the HIPPO World Finals. Confirm HML can show this, and whether the medal should be gold or silver (the real result on record is a C1 silver).
3. **Her name:** "Saraa" on the question card.
4. **Music:** one track that starts muted and blooms at shot 4.

## Rendering

Run from the Lemo-Opuscar library (`LIB`):

```sh
node core/render/still.mjs <project> 0 --size 1080x1920 --q 'view=board&s=1&ssaa=0.9&fq=0.7' --prefix s1_ --out <project>/stills/board
node core/render/still.mjs <project> 0 --size 2440x3460 --q 'view=storyboard' --prefix storyboard_ --out <project>/stills
```
