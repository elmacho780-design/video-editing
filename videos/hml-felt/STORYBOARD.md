# Words in boxes: storyboard

HML Academy Instagram Reel. 9:16, 24 s, needle-felt and paper. Audience: Mongolian parents.
Mongolian voiceover recorded by Batu; the animation is timed to the recording. Mongolian subtitles sit high, clear of the Reels UI.

Sheet: `stills/storyboard_0.jpg`. Key frames: `stills/board/s1_0.jpg` to `s8_0.jpg`.

**Colour arc:** grey and cold while the words sit in their boxes (shots 1 to 3). Colour arrives with the HML-orange yarn (shot 4), and the world blooms out of the words (shots 5 to 6).

| # | Time | Shot | Picture | Camera | Voiceover (MN) | English gloss | Sound |
|---|---|---|---|---|---|---|---|
| 1 | 0:00 to 0:02 | Hook | Extreme close-up: a grey drawer labelled "because" rattles, trying to get out. | Slow push-in, slight tilt. | Таны хүүхэд англи үгийг цээжилдэг үү, | Does your child memorise English words, | A lonely music box plays the tune in D minor. The drawer rattles. |
| 2 | 0:02 to 0:04 | The wall | Pull back: hundreds of grey drawers tower over her. A question card drops in: "Why was Saraa late?" She freezes. | Fast crane back and down. | эсвэл ойлгодог уу? | or understand them? | A low string swell; a deep harp and bell note as the card lands, then the music holds its breath. |
| 3 | 0:04 to 0:07 | The problem | She pulls out "late", "bus", "snowing". Each stays pinned in place, grey and alone. They will not join. | Medium shot, slow drift. | Тусад нь цээжилсэн үгс хоорондоо холбогддоггүй. | Words memorised one by one don't connect. | Three lonely plucks, one per word, out of time. A clarinet sighs. |
| 4 | 0:07 to 0:10 | The turn | An HML-orange yarn on a felting needle stitches the words into one sentence: "She was late for the bus because it was snowing." Each word it reaches fills with colour. | Follows the needle down the garland. | HML-д бид үг бүрийг утга, хэрэглээтэй нь холбож заадаг. | At HML we teach every word joined to its meaning and use. | Each stitch plays the next note of a rising line. On the third, the key turns to D major. |
| 5 | 0:10 to 0:12 | The burst | The yarn pulls tight. Every drawer flies open and hundreds of words pour out in full colour. | Fast push-in, words fly past the lens. | Үгс утгаа олоход | When words find their meaning, | Harp glissando and cymbal swell into a full orchestral bloom, with sleigh bells. |
| 6 | 0:12 to 0:16 | The world | The words build winter Ulaanbaatar: "snowing" becomes the snow, "bus" the bus, "late" the alarm clock. She catches "bus" and runs for it. | Whip pan into the street, settles on the hero frame. | англи хэл амилдаг. | English comes alive. | The theme on strings and flute, harp and sleigh bells underneath. Bus bell. |
| 7 | 0:16 to 0:20 | The proof | The bus ride ends in a paper London. She stands on a stage with a medal; felt confetti falls. | The bus drives out of frame, the camera rises to Big Ben. | Олимпиадын хоёрдугаар шатанд яг энэ чадвар хэрэгтэй. | This is exactly the skill the olympiad's second round needs. | Up a whole tone, horns join the theme, a timpani roll into the medal. |
| 8 | 0:20 to 0:24 | End card | The orange yarn stitches round the HML logo on navy felt, and felt flowers bloom from the logo's tree. Phone numbers and @hml_english. She waves. | Locked off, gentle settle. | HML Academy. Үгийг цээжлэх биш, ойлгох. | HML Academy. Don't memorise words, understand them. | The music box plays the opening tune again, now warm and in a major key. A soft chime. |

## Decisions

- Mongolian lines approved as written. Batu records the voiceover; no generated voice.
- The proof shot is the HIPPO World Finals in London, with a gold medal.

## Music

`audio/score.py` writes the score from the same timeline (24 s, 12/8 at 120, one bar = 2 s): `audio/out/music.wav`, mastered to -14 LUFS.
`sh audio/animatic.sh` cuts the storyboard frames to it: `renders/animatic.mp4`.

| Time | Music |
|---|---|
| 0 to 2 | A lonely music box plays the tune in D minor over a bowed vibraphone. |
| 2 to 4 | Low strings swell; a deep harp and bell note lands with the card at 3.0, then everything stops (the freeze). |
| 4 to 7 | Three lonely pizzicato plucks, one per pinned word, out of time. A clarinet sighs. The dominant waits. |
| 7 to 10 | Each of the seven stitches plays the next note of a rising line (7.0 to 10.0). At 8.0 the key turns from D minor to D major: the frame the colour arrives. Harp glissando and cymbal swell into 10.0. |
| 10 to 12 | The burst: full orchestra, timpani, bells, sleigh bells, a flute run as the words fly, then the "wonder" chord (E over D). |
| 12 to 16 | The theme on violins and flute, harp arpeggios and sleigh bells underneath, a horn countermelody. |
| 16 to 20 | Up a whole tone to E major, horns join the theme, a timpani roll into the medal at 18.0. |
| 20 to 24 | The music box plays the opening tune again, now in E major; a wistful borrowed chord, then home. Fades by 24.0. |

Instruments: VS Chamber Orchestra Community Edition and the Versilian Community Sample Library (both CC0), plus a modelled music box. No attribution is required.

## Rendering

Run from the Lemo-Opuscar library (`LIB`):

```sh
node core/render/still.mjs <project> 0 --size 1080x1920 --q 'view=board&s=1&ssaa=0.9&fq=0.7' --prefix s1_ --out <project>/stills/board
node core/render/still.mjs <project> 0 --size 2440x3460 --q 'view=storyboard' --prefix storyboard_ --out <project>/stills
```
