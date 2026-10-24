# I'm sorry, Zaya — v2 spec

GOAL:    Zaya smiles: a tiny toy-like Clawd apologises with a giant, lovingly hand-made poster, then the
         whole world turns into a pink heart-filled hug.
OUTPUT:  HyperFrames, 1920 x 1080, 60 fps (render), 10.0 s = 600 frames.
TIME:    one continuous take in two worlds; the heart is the door between them.

LOOK
  medium:   a vinyl designer toy photographed in a seamless white studio (world 1), then a candy-pink
            dream set (world 2). Real 3D (Three.js r158) — light, gloss and contact shadows come from the
            medium, not from CSS effects.
  world 1:  ground #FFFFFF, edge falloff to #FFF1EE (radial, 1300 x 900 px). Key light warm #FFF2E8 from
            upper-left-front, rim #FFD6E6 from behind-right, hemisphere fill #FFF6F2 / #FFD9CF.
            Shadow catcher opacity 0.16 + soft contact blob 0.35.
  Clawd:    proportions from the official sprite (▐▛███▜▌ / ▝▜█████▛▘ / ▘▘ ▝▝): body 12 x 4 tall pixels
            -> 1.5 x 1.0 units, depth 0.95, bevel 0.16; eyes 1 x 1 px -> 0.13 x 0.27 at x ±0.44;
            arms row 2, 2 px long; four legs at columns 1, 3, 8, 10. Body #D77757 (rgb 215,119,87),
            roughness 0.42, clearcoat 0.35. Added only for acting: puppy eyes with two highlights,
            ^ ^ happy eyes, blush #FF8FAB, a tear #9FDCFF.
  poster:   4.6 x 2.6 units, 2300 x 1300 px canvas. Paper #FFEAF1 -> #FFF8FA with 2% fibre noise,
            scalloped hot-pink lace border #FF6FA0 with white dots, white dashed inner line,
            two washi tapes (butter #FFD95A / mint #9EE6CF, white stripes), hand-drawn doodles.
            "I’m sorry": Fredoka 700 290 px, fill #FF86B0 -> #F2397A, white keyline 16 px,
            berry outline #8A1E4D 30 px, 10 px drop, gloss band 30%.
            "Zaya": Fredoka 700 430 px, fill #FFE680 -> #FFB13D, same keylines, glitter + one shine sweep.
            A real 3D puffy heart #FF3F7F sits right of "Zaya".
  world 2:  radial #FFE6EF -> #FFB3CB, slow conic rays 22% white rotating 4°/s; ring of 3D stickers
            (hearts #FF4F8B #FF8FB5 #FFFFFF, stars #FFD95A, clouds white, candies, flowers #C7B3FF,
            balloons) framing the shot; falling 3D confetti hearts.
  type:     Fredoka 700 only. Finale title 150 px, white, 20 px stroke #E33F7A, stacked 3D extrude
            #C02D63 12 px; "Zaya" #FFE36E.

MOTION
  enter:   back.out 1.7–2.5 on scale (toys), expo.out on camera arrivals, power3.in on the dive.
  springs: playful, damping ~0.45 on position/scale; never on opacity or colour.
  acting:  anticipation -> action -> overshoot -> settle on every Clawd move; parts offset
           (body leads, arms follow 2–4 frames later); blinks 0.12 s.

SHOTS (seconds)
  0.00–0.98  Clawd's eyes peek over the bottom edge, dips, springs up into frame, lands with squash
             + dust puffs.            Camera: medium on landing spot.
  1.15–1.45  looks toward centre (turns 0.6 rad), blinks.
  1.45–3.45  8-step waddle to centre; camera trucks with it.
  3.45–4.05  stops, turns to camera with overshoot, shy fidget + blink.
  4.05–4.60  reaches behind, YANKS a giant rolled scroll with a satin bow over its head, arms stretch up.
  4.60–5.45  bow pops off (sparkles), scroll springs open upward; camera pulls back/up to reveal it.
  5.35–6.10  letters pop in ("I’m sorry", then "Zaya"), 3D heart springs on; Clawd: puppy eyes,
             blush, sad mouth, a tear, nervous tremble.
  6.10–6.85  hold to read; heart beats twice; shine sweeps "Zaya".
  6.85–7.42  heart squashes, leaps off the poster spinning, fills the lens.
  7.42–7.95  pink heart-shaped iris opens on world 2.
  7.42–8.60  camera pulls back from Clawd (hugging a heart, ^ ^ eyes) to reveal backdrop heart,
             sticker ring popping in, title word by word.
  8.60–10.0  happy hop, two squeezes with little hearts floating up; title holds 1.9 s+.

BANNED: dark void, glow/bloom, purple-blue gradients, cream-paper serif look, everything fading/sliding
        up, flat clip-art shapes standing in for objects, a flat unlit mascot, text that moves after it
        lands, the v1 poster (flat cream card with plain type), sideways-sliding unroll.

QA: 0.0 (peek thumbnail), 0.9 (landing), 2.4 (walk), 4.4 (yank), 5.1 (unroll), 6.4 (poster hold),
    7.2 (dive), 7.6 (iris), 8.6 (finale reveal), 9.9 (end frame).
