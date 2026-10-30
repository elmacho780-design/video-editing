# Read this first: HML Academy video studio

You are working with **Batu (Battumur.D)** of **HML Academy** (Higher Mind Learning), an English learning centre in Ulaanbaatar.
This repo is where Batu and Claude make short videos for HML: Instagram Reels and ads, made in code (animation and edits).

> **This is not an OpenStoryline task.** The top level of this repo (`README.md`, `agent_fastapi.py`, `config.toml`, `web/`, `src/` …) is the
> FireRed-OpenStoryline app, installed early on and no longer used. The branch name `claude/openstoryline-install-use-mj0u13` is historical.
> **All the real work lives in `videos/`.** Do not install, configure or run OpenStoryline unless Batu asks for it.

> **Every project below is finished.** Do not continue, re-render or "improve" any of them unless Batu explicitly asks. Wait for his brief for the next video.

## 1. Who HML is

Read **`videos/_handoff/HML_ACADEMY_CONTEXT.md`** (Batu's own brief: classes, olympiads, books, brand, house rules). The essentials:

- **Audience for ads:** Mongolian parents. Fully Mongolian, a strong hook in the first second, simple, straight to the point.
- **Brand:**
  - Navy plus the logo's orange-to-amber, and a brain growing into a flowering tree. The logo is in `videos/hml-felt/assets/hml-logo.png`, and the tree emblem cut out is in `videos/hml-olympiad-reel/assets/hml-tree.png`.
  - Phone numbers: 9930 4451 and 8888 3351.
  - Instagram: `@hml_english`.
- **Mascot:** a beagle in a navy blazer. **Do not build the mascot in 3D or paste the PNG into animations**: both were rejected ("looks absolutely terrifying" / "copy pasted"). Use it only if Batu asks, and ask him how.
- **House rules:**
  - British English and no em dashes.
  - Mongolian text Claude writes is flagged for Batu to check.
  - Mongolian subtitles sit high or mid-frame, clear of the Reels UI. Nothing important goes in the bottom ~20% or the right-hand button column.

## 2. How Batu likes to work (learned the hard way)

1. **Quality bar is high.** "High quality", "wow". Research references on the web first, then make style frames. Never ship a first pass.
2. **Gates, in order:** story or storyboard → art-style frames → approval → animation or edit. **Don't start animating before he approves the style.**
3. **Show, don't describe:** render stills of the real thing (style frames, a storyboard sheet with frames), not text plans.
4. **Don't look like a copy:** when he sends reference videos, borrow the grammar (timing, rhythm), never the look. Change colours, materials, type, transitions and layout enough that nobody says "they copied that edit".
5. **Music matters a lot:** original, written to the picture, hits on the cuts.
6. **Audio must sound like the original recording:** no voice EQ, compression or re-levelling.
7. **Small fixes, fast:** reposition things off faces (eyes!), keep the opening shots he filmed, re-render quickly.

## 3. What's been made (all finished; `git log` has the detail)

| Folder | What | Look and technique |
|---|---|---|
| `videos/sorry-zaya/` | 10 s personal 3D film ("I'm sorry Zaya") | three.js |
| `videos/hml-style-samples/` | First art-style tests for "Words in boxes" (flat words, toy 3D, pop-up) | three.js / SVG, rejected in favour of felt |
| `videos/hml-felt/` | **"Words in boxes"** animated Reel (24 s): memorised words in drawers vs words in context. Animated on Batu's RTX 5060 PC; final `renders/film.mp4` | Needle-felt + paper in three.js (`src/felt.js` shell-fur wool shader), stop-motion character moves, `src/film.js` timeline, original orchestral score `audio/score.py` |
| `videos/reference-edits/` | Frame-by-frame study of 3 reference Reels (captions, cards, transitions, timings) | `REFERENCE.md`, `tools/strip.py` |
| `videos/hml-olympiad-reel/` | **Olympiad talking-head edit** (basketball hook → teacher on camera, captions, cards, comic shout, 3+1 offer, end card). Final: `renders/hml-olympiad-reel.mp4`; "ending first" cut (no hook, no banner, opens on the shout): `renders/hml-olympiad-reel-ending-first.mp4` | "HML notebook" look: paper, stickers, washi tape, stamps, sticker captions; HTML/CSS rendered per frame; Whisper word-timed captions |
| `videos/hml-online-reel/` | **Online course ad** (presenter on camera: coffee-price hook, why online, olympiad or level, schedule Tue/Thu/Sat 17:00, 3+1 offer, contact, end card). Final: `renders/hml-online-reel.mp4` | Look A "HML notebook, coffee edition" (chosen from 3 looks, `stills/board_0.jpg`): kraft cups, coffee rings, 3+1 as a café loyalty card, the steam-to-tree wipe; full-screen pages cover his walk-ins; original café score (nylon guitar, upright piano). See its `README.md` |

**Reusable parts worth stealing:**
- **`hml-olympiad-reel/src/ui.js` + `theme.css`:** sticker captions, notebook cards, the bloom-wipe transition from the HML tree, split-flap numbers, confetti, comic shout, end card.
- **`hml-olympiad-reel/src/edit.js`:** the cut list → output-time mapping, captions timed to Whisper word timestamps, footage punch-ins, cue export (`window.EV`).
- **`hml-olympiad-reel/audio/`:** `voice.py` (untouched voice + cuts), `score.py` (music and SFX from the cue list, ducked), `final.py` + `master.sh` (one gain to -14 LUFS, a gentle limiter, mux).
- **`hml-felt/src/felt.js`:** the needle-felt material. **`hml-felt/src/film.js`:** a whole 3D film on one music timeline (stop-motion posing, sub-frame motion blur). **`hml-felt/audio/score.py`:** an orchestral score timed to shots.
- **`reference-edits/tools/strip.py`:** frame-by-frame strips of any video.

## 4. Set up a new machine (do this first on a fresh PC)

Batu uses **Windows 11**. Run `videos/_handoff/setup-windows.ps1` in PowerShell (it explains each step and is safe to re-run), or follow the steps by hand:

1. **System tools:** Git for Windows, Node.js LTS (20+), Python 3.12, ffmpeg (`winget install Git.Git OpenJS.NodeJS.LTS Python.Python.3.12 Gyan.FFmpeg`). A work laptop may block winget or admin installs: ask Batu, or use portable or per-user installers.
2. **Claude Code plugins:**
   - `claude plugin marketplace add lemomo-ai/lemo-opuscar` then `claude plugin install lemo-opuscar@lemolab`. This is the film library: styles, renderer, sampler, TTS, mux.
   - `claude plugin marketplace add heygen-com/hyperframes` then `claude plugin install hyperframes@hyperframes`. This is HTML-to-video editing, ~450 blocks, captions and media tools.
3. **Skills:** `npx skills add LottieFiles/motion-design-skill` and `npx skills add cloudai-x/threejs-skills` (13 three.js skills).
4. **The Lemo-Opuscar library:** clone it to `~/lemo-opuscar` (the setup script does this) and install its tiers from Git Bash or WSL in that folder:
   - core: `sh plugin/skills/lemo-opuscar/scripts/setup.sh deps`
   - plucked strings: `… deps music`
   - TTS and Whisper (captions, word timing): `… deps voice`
   - CC0 orchestral samples: `sh tools/fetch.sh instruments vsco2ce` and `sh tools/fetch.sh instruments vcsl`
5. **Check the GPU:** render one still from any style or project with `node core/render/still.mjs <project> 0 --size 1080x1920`. If the output says `WebGL runs on software rendering`, set `LEMO_ANGLE=d3d11` (native Windows) or `vulkan` / `gl` (WSL) and retry. The library's own docs recommend WSL2 on Windows.

All render tools run **from the library folder** with the project's absolute path. See `$LIB/core/README.md` and `$LIB/TECHNIQUE.md`.

## 5. Styles available for the next video

Batu wants to try more looks (paper-cut, hand-painted and others). The Lemo-Opuscar library ships **~60 styles**, each with a `STYLE.md` style prompt and a demo. Start a new style the library's way: read `$LIB/AGENTS.md`, then the style's `STYLE.md`, then write the treatment.

| Batu's words | Library styles (`$LIB/styles/<slug>/`) |
|---|---|
| **Paper-cut** | `papercut-red` (red paper-cut), `paper-lantern` (paper-cut lightbox), `paper-popup` (pop-up book), `shadow-puppet` |
| **Hand-painted** | `watercolor` (watercolour brush), `impasto` (palette-knife oil), `ink-wash` (Chinese ink), `urban-sketch` (pen and wash), `crayon-book` (crayon picture book) |
| Printmaking | `risograph`, `woodcut`, `engraving`, `silkscreen-poster`, `ukiyoe`, `halftone-dossier`, `stained-glass` |
| Cartoon or 2D | `midcentury-toon`, `rubber-hose`, `cel-anime-80s`, `scifi-toon`, `one-line`, `whiteboard`, `pictogram-motion` |
| 3D or toy | `brick-toy`, `tilt-shift`, `lowpoly-island`, `white-model`, `glass-product`, `hd-2d`; also our own needle-felt (`videos/hml-felt`) |
| Explainers and type | `swiss-motion`, `iso-infographic`, `dataviz`, `game-show`, `art-deco`, `spy-titles`, `caption-news` |

**Which skill to load:**
- **New animated film in a style:** the `lemo-opuscar` skill (it walks through style → treatment → production → delivery).
- **Editing Batu's own footage** (captions, cards, cuts like the olympiad Reel): the `hyperframes` skill (plus `hyperframes:media-use` for music and SFX), or reuse `videos/hml-olympiad-reel/` as the template.
- **Custom 3D materials or shaders:** the `threejs-*` skills.
- **Motion feel** (easing, timing, stagger): the `motion-design` skill.

## 6. Hard-won technical notes

- **Phone audio:** iPhone footage is dual-mono. Never fold to mono with `-ac 1` (it sums L+R, +3 dB, and clips). Use `pan=mono|c0=c0`.
- **Loudness:** Instagram wants -14 LUFS. Use one linear gain plus a look-ahead limiter. Avoid ffmpeg `loudnorm` in dynamic mode on voice.
- **Captions:** align words with faster-whisper `large-v3` (`language='mn'`), passing the transcript as `initial_prompt` per sentence chunk. Compare against what is actually said and flag any differences to Batu.
- **Headless renders:**
  - The still tool times out at 30 s per screenshot. For heavy three.js stills, render inside `init()` and swap the canvas for an `<img>`.
  - An animated `render(t)` can be `async`. Await image decodes so every frame is complete.
- **Safe zones (1080×1920):**
  - keep the top ~220 px, the bottom ~380 px and the right ~140 px clear of key text
  - keep graphics off the face, especially the eyes
- **Commit to `claude/openstoryline-install-use-mj0u13`.** Large raw footage stays out of git (`src/*.mov`, `src/*.mp4` are ignored per project). Never commit third-party reference videos or art.
