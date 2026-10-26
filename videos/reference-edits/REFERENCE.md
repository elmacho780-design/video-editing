# Edit reference: captions, cards, transitions, motion

Phase one of the next edit: a frame-by-frame study of the three reference Reels Batu sent (five links, two pairs were duplicates).
All timings are measured at 60 fps (1 frame = 16.7 ms). Source files, frame strips and spectrograms stay local (third-party content, not committed).

| # | Reel | Length | What it is |
|---|---|---|---|
| 1 | Winner's Course, ЭЕШ prep (male presenter) | 35.6 s | Talking head, then a full-screen "lesson UI" built card by card, then talking head with word captions, censor gags, a light leak and a crash-zoom ending |
| 2 | edita.visuals showcase ("Opus 5.5" storyboard edit) | 27.4 s | A talking head inside a phone mock-up, edited with big kinetic captions, UI pills, pop-in images and blur transitions |
| 3 | Winner's Course, course launch (female presenter) | 18.9 s | Talking head with info cards (timeline, calendar, location, checklist, time), a yellow "focus frame", and a gradient end card with a typed URL |

---

## 1. The shared system

All three are built the same way:
1. **One idea per beat.** Every 1 to 2 seconds a new graphic answers the exact word being spoken. Nothing sits on screen unchanged for long.
2. **Frosted glass UI.** Cards and pills are translucent white with a background blur, large corner radius, a faint inner highlight and a soft drop shadow. They look like iOS widgets, so they feel native on a phone.
3. **Blur is the main motion device.** Text and cards enter by going from blurred to sharp and leave by blurring out. Very little sliding.
4. **One accent colour does the emphasis.** Winner's Course uses a warm yellow pill behind the key word. Reel 2 uses electric blue italic.
5. **Everything is fast.** Most entrances take 4 to 10 frames (70 to 170 ms); transitions take 18 to 25 frames (0.3 to 0.4 s).
6. **The loop is seamless.** The last frame cuts straight back to the first, so the Reel replays without a visible restart.

## 2. Captions and subtitles

### 2a. Word caption in a glass pill (Reel 1, talking-head parts)
- One phrase per pill, 1 to 3 words, centred at about 47% of the frame height (chest level). It always stays clear of the face and the Reels UI.
- **Changing words:** the old text blurs and fades out in 2 frames. The pill's width animates to fit the new phrase over about 4 to 6 frames, and the new text fades in grey to black in 2 to 3 frames. The pill itself stays put, so it reads as one continuous object.
- **Keyword:** the key word sits on a yellow rounded pill inside the caption (e.g. "Өөр **ЭЕШ**", "**дагаараай!**").
- **After a hard cut:** the empty pill appears first (2 frames), then the text.

### 2b. Two-tier caption (Reel 3)
- A small white glass pill carries the lead-in words ("Суудлын тоо", "та амжиж").
- Below it, the punchline sits in a big yellow pill with black heavy text ("**хязгаартай**", "**бүртгүүлээрэй!**"). It enters with scale and blur over 9 frames, the colour settling from orange to yellow.

### 2c. Kinetic caption (Reel 2)
- A small white italic lead-in ("they think", "you don't want", "especially when"), then the key phrase in **huge heavy italic electric blue** with a soft glow ("NO INSURANCE", "A LAWSUIT", "PAID OFF").
- Builds word by word, each word de-blurring in 3 to 4 frames. A trailing small line sometimes follows below ("coming in the mail").

### 2d. Typed text (Reels 1 and 3)
- **Explanations:** these appear word by word, each word de-blurring in about 4 frames, timed to the voice. Example: "хүний иддэг юм".
- **Search bars and URLs:** these are typed letter by letter with a blinking caret, one character every 2 to 4 frames. A yellow underline then draws under the finished URL in about 5 frames.

### 2e. Highlighter (Reel 1)
- After a full-screen headline de-blurs in (6 frames), a yellow marker pill wipes left to right behind the first line, taking about 16 frames.
- The second line then de-blurs in under it.

## 3. Cards and graphics catalogue

| Graphic | Where | How it moves |
|---|---|---|
| Brand header: logo coin + yellow "Winner's Course" pill | Reels 1 and 3, top left, always on | Static. On the end card it fades in at the top, then glides down to centre (about 15 frames) |
| Quiz card: question + A/B/C/D option chips | Reel 1 | Card fades in (4 frames). Options appear one at a time, 4 frames apart. The chosen option fills yellow (5 frames). When the answer moves on, the old highlight fades out while the new one fades in (3 frame crossfade) |
| Answer rows: yellow label pill + explanation + example chips | Reel 1 | New row fades in under the last (4 frames), label de-blurs, the explanation types word by word, then the example chips pop in one by one |
| Picture-in-picture face tile | Reel 1 | Rounded square of the presenter, bottom left. Pops in with blur (about 5 frames) and leaves the same way |
| Timeline: start pill, dotted line, end pill | Reel 3 | Start pill fades in, then the line draws left to right, revealing dots (about 15 frames). The end pill fades in, the line fills orange dot by dot (about 15 frames), and the end pill turns yellow |
| Calendar card (yellow header, two binder rings) | Reel 3 | Grows from small and blurred to full size (10 frames). The date de-blurs, then the suffix "-нд" types on |
| Location card (red map pin, two lines) | Reel 3 | Scale and blur in (8 frames) |
| Checklist panel | Reel 3 | The previous pill morphs and expands into the panel (4 frames). Items fade in, then each round checkbox fills yellow with a small pop, timed to the speech |
| Time card (clock icon, "12:00 to 17:00", hour ruler) | Reel 3 | Blur and scale in (4 frames) |
| "censored" pill | Reel 1 | Hard on and off over the mouth, frame-locked to a 1 kHz bleep |
| Glass pills with check or cross icons, a hand-tap cursor | Reel 2 | Slide in from the left with an ease-out (about 9 frames). Leave by blurring out |
| Shield pills (blue shield icon) | Reel 2 | Enter with a short white glow flash, then settle |
| Speech-bubble emoji pills ("😰 Slips", "😣 Falls") | Reel 2 | Pop in with an overshoot, about 6 frames |
| Polaroid photo with a red "NOT CARRY" tag | Reel 2 | Flies in small, rotated and motion-blurred from lower right. Overshoots larger, then settles (about 20 frames, back-out ease). The handwritten caption writes on underneath |
| Viewfinder brackets around a photo | Reel 2 | Photo pops in with a glow, brackets tighten to fit, then emoji particles burst outward |
| Progress card ("Their Homes", "$ Paying 10% to 100%") | Reel 2 | The bar fills while the percentage counts up, with flying money and emoji particles |
| Yellow "focus frame" | Reel 3 | For the key message the whole video shrinks to about 90% inside a glowing yellow rounded border on black (8 frames). It holds about 3 s, then expands back to full screen (12 frames) |

## 4. Transitions catalogue

| Transition | Where | Frame by frame |
|---|---|---|
| **Glass-pane wipe** | Reel 1, talking head to UI and back | A diagonal frosted pane sweeps across (left to right, about 4 frames), blurring everything behind it. The blurred shot dissolves into the pastel gradient (about 6 frames), then a second pane sweeps as the new content de-blurs. About 22 frames in all |
| **Blur cut** | Reel 2 (and Reel 1 into the face-palm) | Hard cut to the next shot fully blurred, de-blurring over 4 to 14 frames, often with a slight zoom-out settle |
| **Shrink to avatar and back** | Reel 2 | The video scales down into a small rounded tile over about 10 frames (feathered edges) on a white to blue gradient. The chat-style text builds beside it. Then the tile grows back to full screen over about 18 frames |
| **Torn-paper reveal** | Reel 2 | Hard cut to a new image framed by torn-paper edges, with a slight zoom settle |
| **Flash cut** | Reel 2 | One overexposed, blurred white frame on the cut, then the new shot |
| **Pill-morph to end card** | Reel 3 | The yellow keyword pill drops its text and morphs: narrower, then taller, then it expands to fill the screen and becomes the pastel end card. About 20 frames |
| **Element swap** | All | Outgoing graphics blur out in 2 to 4 frames while the next ones blur in. They overlap rather than cut |
| **Seamless loop** | All | Hard cut from the end card back to frame one |

## 5. Camera moves

- **Punch-in:** a hard scale jump (about 1.0 to 1.3 to 1.5) on an emphasised word, then a slow push. Reel 2 at 0.37 s and 23.63 s.
- **Crash zoom:** a radial zoom blur for 1 to 2 frames into a tight close-up, ending the Reel on a laugh (Reel 1 at 35.0 s).
- **Slow push:** a gentle continuous zoom inside long holds, so a static shot never feels frozen.
- **Light leak:** a warm orange-red leak with drifting bokeh for about 2.5 s on the comedic face-palm (Reel 1, 30.1 to 32.6 s), with its own music sting.

## 6. Timing and easing cheat sheet

| Action | Frames at 60 fps | ms | Ease |
|---|---|---|---|
| Text blur in or out | 3 to 6 | 50 to 100 | ease-out |
| Pill or card blur and scale in | 4 to 10 | 70 to 170 | ease-out (quart) |
| Caption pill width change | 4 to 6 | 70 to 100 | ease-in-out |
| Staggered items (options, chips) | 4 apart | 70 apart | ease-out |
| Highlighter wipe | about 16 | about 270 | ease-in-out |
| Pop with overshoot (emoji, photo) | 6 to 20 | 100 to 330 | back-out |
| Typing | 2 to 4 per character | 35 to 70 | linear |
| Glass-pane or morph transition | 18 to 25 | 300 to 420 | ease-in-out |
| Focus-frame shrink / grow | 8 / 12 | 130 / 200 | ease-out |

## 7. Colour and type

- **Winner's Course yellow:** about `#FFC920` (calendar header `#FDB80E`, arrow button `#FEC439`). Text on yellow is near-black.
- **Pastel gradient** (UI scenes and end card): blurred blobs of cream `#FDF0D8`, butter `#F3E6C5`, periwinkle `#C5D5F4` and peach `#F7E1D3` on off-white.
- **Glass:** white at about 75 to 90% with a background blur and a soft shadow. Over dark clothes the caption pills read light grey (`#D5D6D8`).
- **Reel 2 accent:** electric blue (`#1E90FF` range) italic with a glow, red for warnings, green checks.
- **Type:**
  - Reels 1 and 3 use a heavy geometric sans with Cyrillic (Gilroy or Montserrat ExtraBold style), black on light glass.
  - Reel 2 uses a heavy italic sans for keywords and a light italic for lead-ins.

## 8. Sound design

- **Voice first.** The voiceover dominates; a quiet music bed sits underneath and comes forward only when the voice stops (Reel 3 end card: bass hits and a rising sweep into the URL).
- **Gags get sounds:**
  - 1 kHz censor bleeps, frame-locked to the pill.
  - A musical sting under the light leak.
  - A low boom on the crash zoom.
- **UI moves are mostly silent or very soft.** The rhythm comes from the cuts landing on words, not from a whoosh on every element.

## 9. Rules to carry into our edit

1. A graphic for every spoken idea, entering on the word, gone when the idea ends.
2. Mongolian captions in glass pills, 1 to 3 words, with the keyword on an HML-coloured pill (our accent instead of Winner's yellow).
3. Blur-in, blur-out, overlap the swaps. Keep entrances under 170 ms.
4. Use full-screen "UI scenes" (gradient background plus building cards) to explain, and cut back to the face to persuade.
5. One big transition style used consistently (glass-pane wipe or pill-morph), not a mix of many.
6. Punch-ins on emphasis words, a focus frame for the key offer, and a typed URL or phone end card that loops cleanly.
7. Keep everything clear of the Reels UI: nothing important in the bottom 20% or the right-hand button column.

## Tools

- `tools/strip.py video t0 seconds every_nth crop cols out.jpg [thumb_w]`: consecutive frames (resampled to constant 60 fps), cropped and tiled with time and frame number.
- Local only (git-ignored): `src/` (the downloaded Reels), `sheets/` (2 fps overviews), `strips/` (frame-by-frame strips), `frames/`, `audio/` (WAV and marked spectrograms).
