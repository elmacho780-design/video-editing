#!/bin/sh
# "Ending first" version: no basketball hook, no banner opening (render with view=edit&start=0.95).
# ORDER lists the pieces of out/video_nobanner.mp4 in seconds (30 fps frame boundaries). At each join the outgoing piece's last
# frame is held for DIS frames and dissolved into the incoming piece, so the picture softens while the sound stays a clean cut
# and the length (and sync) is unchanged. Run from the project folder after: HOOK=0 ORDER="$ORDER" XF=0 $LIB/.venv/bin/python audio/final.py
set -e
ORDER=${ORDER:-33.1667-42.1,0-33.1333,42.1-end}; DIS=${DIS:-4}
V=out/video_nobanner.mp4; A=audio/out/final.wav; O=renders/hml-olympiad-reel-ending-first.mp4
FC=$(python3 - "$ORDER" "$DIS" <<'PY'
import sys
order, dis = sys.argv[1], int(sys.argv[2])
segs = []
for s in order.split(','):
    a, b = s.split('-'); segs.append((round(float(a) * 30), None if b == 'end' else round(float(b) * 30)))
n = len(segs); d = dis / 30
f = f'[0:v]split={n}' + ''.join(f'[s{i}]' for i in range(n)) + ';'
for i, (a, b) in enumerate(segs):
    f += f"[s{i}]trim=start_frame={a}" + (f":end_frame={b}" if b is not None else '') + ",setpts=PTS-STARTPTS"
    f += (f",tpad=stop_mode=clone:stop={dis}" if i < n - 1 and dis else '') + f"[p{i}];"
cur, length = 'p0', (segs[0][1] - segs[0][0]) / 30 + d
for i in range(1, n):
    out = f'x{i}'
    f += f"[{cur}][p{i}]" + (f"xfade=transition=fade:duration={d:.4f}:offset={length - d:.4f}" if dis else "concat=n=2:v=1:a=0") + f"[{out}];"
    if segs[i][1] is not None: length += (segs[i][1] - segs[i][0]) / 30   # the xfade eats the previous hold, this piece adds its own
    cur = out
print(f + f"[{cur}]format=yuv420p[v]")
PY
)
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$V" -i "$A" -filter_complex "$FC" \
  -map "[v]" -map 1:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest "$O"
ffmpeg -nostdin -hide_banner -i "$O" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^ +(I|LRA|Peak):" | tail -3
echo "$O"
