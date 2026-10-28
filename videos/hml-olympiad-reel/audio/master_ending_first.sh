#!/bin/sh
# "Ending first" version: no basketball hook, no banner opening (render with view=edit&start=0.95),
# the edit from ROTATE seconds (the off-camera shout) moved to the front. Run from the project folder after:
#   HOOK=0 ROTATE=33.1667 $LIB/.venv/bin/python audio/final.py
set -e
R=${ROTATE:-33.1667}; V=out/video_nobanner.mp4; A=audio/out/final.wav; O=renders/hml-olympiad-reel-ending-first.mp4
F=$(python3 -c "print(round($R*30))")
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$V" -i "$A" -filter_complex \
  "[0:v]split[x][y];[x]trim=start_frame=$F,setpts=PTS-STARTPTS[a];[y]trim=end_frame=$F,setpts=PTS-STARTPTS[b];[a][b]concat=n=2:v=1:a=0,format=yuv420p[v]" \
  -map "[v]" -map 1:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest "$O"
ffmpeg -nostdin -hide_banner -i "$O" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^ +(I|LRA|Peak):" | tail -3
echo "$O"
