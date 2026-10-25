# Handoff: "Words in boxes" (HML Academy Reel)

Where the project stands, for a Claude Code session on Batu's own computer (Claude Desktop, or `claude remote-control` in this repo).
Branch: `claude/openstoryline-install-use-mj0u13`.

## Done and approved

- **Style:** needle-felt and paper miniature. The girl only (the felt beagle was scrapped: do not bring it back).
- **Storyboard:** `STORYBOARD.md`, sheet `stills/storyboard_0.jpg`, key frames `stills/board/s1_0.jpg` to `s8_0.jpg`. 8 shots, 24 s, 9:16.
- **Decisions:** Mongolian subtitle lines approved as written. Batu records the voiceover himself (no generated voice). The proof shot is the HIPPO World Finals in London, gold medal. Her name on the question card is Saraa.
- **Music:** `audio/score.py` (original score on CC0 samples), mastered `audio/out/music.wav` at -14 LUFS. Every hit is timed to a shot boundary (see the Music table in `STORYBOARD.md`).
- **Animatic:** `renders/animatic.mp4` (still frames cut to the music; nothing animated yet).

## Next

1. Animate one shot as a test clip: shot 4, the yarn stitching (7 to 10 s), timed to the stitch notes at 7.0, 7.5 ... 10.0.
2. Once Batu approves the motion, animate all eight shots as one film, `view=film`, exposing `window.DUR = 24` and a deterministic `window.render(t)`.
3. When his voiceover arrives: mix it over `music.wav` (duck the music under the voice), then mux and master to -14 LUFS.

## Code map

- `src/felt.js`: needle-felt material (shell fuzz, fibre bump). `globalThis.FELT_Q` scales fuzz layers.
- `src/girl.js`: the girl. Pose: `reach`, `look`, `mood`, `kick`, `medal`.
- `src/set.js`: the shared set (cabinet incl. the grey archive wall, word tags, bus, gers, hills, skyline, clock, `dawnWorld`, `finish`).
- `src/board.js`: the eight storyboard shots (`?view=board&s=N`). Reuse these scenes as the animation's start and end poses.
- `src/turn.js`: the hero frame (shot 6). `src/cast.js`: cast sheet. `src/storyboard.js`: the sheet.
- The still views render once inside `init()` and swap in an image, to dodge the 30 s screenshot timeout on a CPU-only machine. An animated view must draw per frame in `render(t)` instead.

## Set-up on a new machine

Needs Node 20+, ffmpeg, Python 3.11+ and git.

```sh
claude plugin marketplace add lemomo-ai/lemo-opuscar
claude plugin install lemo-opuscar@lemolab
# the plugin's setup script clones the library to ~/lemo-opuscar and prints LIB=<path>
sh <skill folder>/scripts/setup.sh && sh <skill folder>/scripts/setup.sh deps
cd ~/lemo-opuscar && sh tools/fetch.sh instruments vsco2ce && sh tools/fetch.sh instruments vcsl
sh <skill folder>/scripts/setup.sh deps music
```

Render a still (run from `$LIB`; on macOS WebGL uses the GPU through Metal by default):

```sh
node core/render/still.mjs <repo>/videos/hml-felt 0 --size 1080x1920 --q 'view=turn&ssaa=1.5&fq=1' --prefix turn_ --out <repo>/videos/hml-felt/stills
```

Rebuild the music and the animatic (from the project folder): `$LIB/.venv/bin/python audio/score.py` then `sh audio/animatic.sh`.

## House rules

British English, no em dashes. Mongolian subtitles placed high, clear of the Reels UI. Commit only to the branch above. Never commit third-party reference art.
