# HML Daily English: the 30-day video series

Taken from Batu's "HML animation handoff" spreadsheet (Curated by Battumur.D). **Only the parts that don't conflict with `CLAUDE.md` are adopted here.** Where the sheet and `CLAUDE.md` disagree, `CLAUDE.md` wins.

Not adopted from the sheet:
- **"Navy / soft blue, no brand colours on file":** the brand colours are navy plus the logo's orange-to-amber.
- **"Logo not on file":** it is in the repo (`videos/hml-felt/assets/hml-logo.png`, the poster's `hml-logo-plain.png`, and the tree emblem).
- **"Text in the middle third" for filmed videos:** it would cover the face. It is kept for animations only (below).
- **The sheet's safe-zone variant:** our safe zones stay as they are.

## How each video is made

1. **An animation-ready script per video.** Scene by scene:
   - the on-screen text, and when it appears and leaves
   - what moves
   - the voiceover line, with rough timings
   - where the sound effects go

   No camera or lighting notes. Claude drafts it from the topic if Batu hasn't written one. The Mongolian is flagged for Batu to check.
2. **One style sheet, reused.** The look is approved once on the first video, then reused so every video looks like the same brand. Each new day only needs its script approved. This is our usual gate order (story, then style frames, then approval, then animation), with the style gate done once for the series.
3. **Batu records the voiceover** on his mic (no text-to-speech: Mongolian TTS sounds robotic). The animation is timed to his recording, word by word. His voice stays untouched, as in `CLAUDE.md`.
4. **One style sheet plus one day's spec per session.** Small sessions are easier to check.
5. **Approve Day 1 before making Days 2 to 6.** Style problems get caught once, not six times.
6. **Run the QC checklist** from the Content Operations doc on every finished video, once Batu shares that doc. Same standard as filmed videos.

## Style sheet (adopted items)

| Item | Value |
|---|---|
| Format | 9:16 vertical, 1080 × 1920, 30 fps |
| Font | Must have the Mongolian Cyrillic letters (ө, ү, Ө, Ү). Fonts that do: Montserrat, Manrope, Caveat, Press Start 2P. Fonts that don't: Unbounded, Pixelify Sans |
| Text placement (animations) | Key text in the middle third of the screen. Filmed videos keep `CLAUDE.md`'s rule (off the face) |
| Keyword colour | English keywords in a different colour from the Mongolian text |
| Minimum read time | Each example stays on screen at least 2 seconds |
| Pacing (animations) | From Batu's feedback on Day 1's first preview ("too slow, people will scroll away"): about 15 to 20 s in total. The hook is on screen from the first frame and pays off within the first second; something new happens roughly every 2 s; no scene only holds. Short VO lines, said back to back |
| Sound effects | A pop only on reveals and answers; a tick for countdowns; no effects on trust videos. Effects are soft and musical (real samples or tuned notes), never noise whooshes |
| End card | The series name plus a follow CTA (@hml_english) |
| Colours, logo, safe zones, music, voice | As in `CLAUDE.md` |

## The 30-day plan

Batu's sheet recommends animating teaching and quiz videos and filming trust and sales videos. It has a "Your call" column for him to change any day.

| Day | Series | Topic | Recommended |
|---|---|---|---|
| 1 | Stop Saying This | "I am agree" vs "I agree" | Animate |
| 2 | One Word, Three Levels | Tired, exhausted, fatigued | Animate |
| 3 | Say It Like a Local | Ordering coffee | Either |
| 4 | Guess or Fail | 5 idioms | Animate |
| 5 | Mouth Gym | The th sound | Film |
| 6 | Behind the Board | Why we don't use word lists | Animate (same message as the finished felt film "Words in boxes") |
| 7 | Behind the Board | 60-second teaching demo | Film |
| 8 | Stop Saying This | Much vs many | Animate |
| 9 | One Word, Three Levels | Good, great, outstanding | Animate |
| 10 | Say It Like a Local | 5 answers better than "I'm fine" | Animate |
| 11 | Guess or Fail | Tier list: common mistakes | Animate |
| 12 | Native or Not? | 4 sentences | Animate (Reels have no polls: "comment A or B") |
| 13 | Behind the Board | Understand but can't speak? | Film |
| 14 | Parent Questions | My child understands but won't speak | Film |
| 15 | Mongolian Brain, English Mouth | Present perfect vs past simple | Animate |
| 16 | One Word, Three Levels | Important, significant, pivotal | Animate |
| 17 | Say It Like a Local | Texting slang | Animate |
| 18 | Guess or Fail | Myth: learn all grammar first | Animate |
| 19 | Native or Not? | a / an / the | Animate |
| 20 | Behind the Board | 3 ways to learn from Netflix | Either (no real Netflix footage) |
| 21 | Parent Questions | The in-person placement test | Film |
| 22 | Stop Saying This | Since vs for | Animate |
| 23 | One Word, Three Levels | Replacing "get" | Animate |
| 24 | Say It Like a Local | Fillers: well, actually, you know | Animate |
| 25 | Guess or Fail | Beat the Teacher: 10 words | Either |
| 26 | Mouth Gym | Silent letters | Either |
| 27 | Behind the Board | Who I am and why I teach | Film |
| 28 | Parent Questions | Why HML is different | Film |
| 29 | Native or Not? | I'm boring vs I'm bored | Animate |
| 30 | Behind the Board | 30-day recap | Film |

Totals: 18 animate, 8 film, 4 either.

## Progress

- **Series look approved: paper-cut** (`videos/daily-01-i-agree/src/paper.js`), with its music theme (`videos/daily-01-i-agree/audio/score.py`). Reuse both for every animated day.
- **Day 1** (`videos/daily-01-i-agree/`): preview version 2 (re-paced to 17.3 s after "too slow" feedback on the 27.5 s version 1), music only. Waiting for Batu's Mongolian check and his voiceover recording; then everything is re-timed to his words (see that folder's README).
- **"One Word, Three Levels" format** (Days 2, 9, 16, 23): `videos/daily-02-tired/src/levels.js` holds the paper staircase (hook and recap) and the level cards that slide in. Its music theme is `videos/daily-02-tired/audio/score.py`: the same family as the "Stop Saying This" theme, with the same end-card landing.
- **Day 2** (`videos/daily-02-tired/`): preview rendered (17.3 s, music only). Waiting for Batu's script and Mongolian check and his voiceover.
