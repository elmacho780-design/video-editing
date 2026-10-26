# Handoff: "Words in boxes" (HML Academy Reel)

> **Not OpenStoryline.** The branch name is historical. This is a code-rendered 3D animation project (three.js, rendered with headless Chromium via the Lemo-Opuscar library). Do not install OpenStoryline.

## Start here (Batu's Windows PC)

1. Clone the repo and check out the branch (Git for Windows or GitHub Desktop; the repo is private, so sign in to GitHub when asked):
   `git clone https://github.com/elmacho780-design/video-editing.git` then `cd video-editing` and `git checkout claude/openstoryline-install-use-mj0u13`
2. Install Node 20+, Python 3.11+ and ffmpeg (`winget install OpenJS.NodeJS.LTS Python.Python.3.12 Gyan.FFmpeg`), or work inside WSL2 Ubuntu (recommended by the library).
3. Install the Lemo-Opuscar library (see "Set-up on a new machine" below), then render one still of `view=turn` and confirm the GPU is used (see the Windows notes).
4. Then: animate shot 4 (the stitching) as a test clip for Batu to approve.

Where the project stands, for a Claude Code session on Batu's own computer (Claude Desktop, or `claude remote-control` in this repo).
Branch: `claude/openstoryline-install-use-mj0u13`.

## Done and approved

- **Style:** needle-felt and paper miniature. The girl only (the felt beagle was scrapped: do not bring it back).
- **Storyboard:** `STORYBOARD.md`, sheet `stills/storyboard_0.jpg`, key frames `stills/board/s1_0.jpg` to `s8_0.jpg`. 8 shots, 24 s, 9:16.
- **Decisions:** Mongolian subtitle lines approved as written. Batu records the voiceover himself (no generated voice). The proof shot is the HIPPO World Finals in London, gold medal. Her name on the question card is Saraa.
- **Music:** `audio/score.py` (original score on CC0 samples), mastered `audio/out/music.wav` at -14 LUFS. Every hit is timed to a shot boundary (see the Music table in `STORYBOARD.md`).
- **Animatic:** `renders/animatic.mp4` (still frames cut to the music).
- **Shot 4 motion (test clip):** `src/shot4.js` (`?view=shot4`), rendered as `renders/shot4_test.mp4` (7.0 to 10.5 s, music muxed in). The needle stabs each eyelet on its stitch note, each tag floods with colour from its eyelet, warm light and her delight arrive at 8.0, the camera drifts down the garland onto the shot 4 key frame. Use it as the motion reference for the other shots.

## Next

1. Animate all eight shots as one film, `view=film`, exposing `window.DUR = 24` and a deterministic `window.render(t)` (fold `shot4.js` in as 7 to 10 s).
2. When his voiceover arrives: mix it over `music.wav` (duck the music under the voice), then mux and master to -14 LUFS.

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

### Batu's machine: Windows, RTX 5060, Core i5 13th gen

- The library is built for macOS and Linux and recommends **WSL2 (Ubuntu)** on Windows: its set-up and fetch scripts are POSIX `sh`, and the venv paths assume `.venv/bin`. Keep the NVIDIA Windows driver up to date: it also drives the GPU inside WSL.
- **First check the GPU is in use.** Render one still and read the output: the line `[note] WebGL runs on software rendering` means Chromium fell back to the CPU (this cloud machine took about 35 s per full-quality frame that way).
- If that note appears, choose the ANGLE backend with `LEMO_ANGLE`: in WSL try `LEMO_ANGLE=vulkan`, then `LEMO_ANGLE=gl`. Natively on Windows (Git Bash) try `LEMO_ANGLE=d3d11`. Re-render until the note is gone, and time a frame.
- If WSL cannot reach the GPU in headless Chromium, render natively on Windows with `LEMO_ANGLE=d3d11` and keep WSL for the Python music scripts.
- **As set up (October 2026):** native Windows, no WSL. Library at `C:\Users\user\lemo-opuscar`; its venv has a junction `.venv\bin` -> `.venv\Scripts` so the POSIX scripts find Python. Headless Chromium reports `ANGLE (NVIDIA GeForce RTX 5060 ... Direct3D11)` with no `LEMO_ANGLE` set; the turn still takes about 0.1 s, and the shot 4 clip (84 frames) 6 s. Run the `sh` scripts from Git Bash.

## House rules

British English, no em dashes. Mongolian subtitles placed high, clear of the Reels UI. Commit only to the branch above. Never commit third-party reference art.
