# Review — v2 (renders/im-sorry-zaya-v2.mp4, 1920x1080, 60 fps, 10.0 s)

## Creative calls
- Rebuilt from scratch in real 3D (Three.js r158 inside HyperFrames, drawn per frame from timeline time).
- Clawd's proportions are decoded from the official terminal sprite (12 x 4 px body, 1 px tall eyes,
  2 px arms on row 2, four legs at columns 1/3/8/10) and built as a glossy vinyl toy. Body #D46C4A,
  a touch deeper than the sprite's #D77757 to survive ACES tone mapping.
- One continuous take across two worlds; the poster's 3D heart is the door between them
  (leaps off the poster into the lens -> heart-shaped iris opens on the pink dream).
- Poster is a hand-lettered canvas texture: sticker type with berry outline, white keyline,
  per-letter gradients and gloss; lace border, washi tape, doodles, glitter, one shine sweep.
- Storylines not built: (a) a stop-motion paper-cutout version; (b) a vertical 9:16 phone version.

## Measured vs looked at
- `check`: passes. Contrast 3/3 pass.
- Snapshots looked at: 0.0, 0.6, 0.9, 1.2, 2.4, 3.6, 4.0–5.4 (9 frames), 5.5, 6.3, 6.8 (full res),
  6.85–7.95 (9 frames), 8.4, 9.0, 9.7, 9.95; plus 9 frames pulled from the final MP4.
- Audio measured (not heard): onsets at 0.41, 1.0, 4.2, 4.71, 5.87, 6.13, 7.47, 8.23, 9.04 s,
  each 1–6 frames after its picture.

## Kept on purpose
- `dead_stretch` 0–7 s: false positive — the checker reads DOM changes, the motion is on the WebGL canvas.
- `composition_file_too_large`: one 3D scene shares one renderer, rig and timeline; splitting it would
  duplicate the Three.js scene.
- three.min.js deprecation notice: r158 UMD build, vendored locally so renders never fetch.
- No music bed: no free music source was reachable (Freesound CDN refused downloads; HeyGen catalog
  needs a sign-in). Sound effects are HyperFrames' bundled library.

## Weakest moments / with more time
- 4.17 s: the reach-behind pose turns Clawd side-on for 3 frames and reads a little stiff.
- Finale backdrop heart is pale against the pink ground; a deeper rose would separate it more.
- A soft music-box or ukulele bed would lift the whole film.
