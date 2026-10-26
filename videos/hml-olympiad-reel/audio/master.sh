#!/bin/sh
# Final file: the basketball hook (121 frames) cut straight into the rendered edit, muxed with audio/out/final.wav
# (already mastered to -14 LUFS by audio/final.py, so the audio is only encoded here, never re-levelled). Run from the project folder.
set -e
V=out/video.mp4; A=audio/out/final.wav; O=out/hml-olympiad-reel.mp4
ffmpeg -nostdin -hide_banner -loglevel error -y -i src/hook.mp4 -i "$V" -i "$A" -filter_complex \
  "[0:v]fps=30,scale=1080:1920,setsar=1,trim=end_frame=121,setpts=PTS-STARTPTS,format=yuv420p[h];[1:v]fps=30,setsar=1,format=yuv420p[e];[h][e]concat=n=2:v=1:a=0[v]" \
  -map "[v]" -map 2:a -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest "$O"
ffmpeg -nostdin -hide_banner -i "$O" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^ +(I|LRA|Peak):" | tail -3
echo "$O"
