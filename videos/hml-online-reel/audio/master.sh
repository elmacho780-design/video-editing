#!/bin/sh
# Final file: the rendered edit (out/video.mp4) muxed with audio/out/final.wav (already mastered to -14 LUFS by audio/final.py,
# so the audio is only encoded here, never re-levelled). Run from the project folder.
set -e
V=out/video.mp4; A=audio/out/final.wav; O=renders/hml-online-reel.mp4
mkdir -p renders
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$V" -i "$A" -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -c:a aac -b:a 320k -ar 48000 -movflags +faststart -shortest "$O"
ffmpeg -nostdin -hide_banner -i "$O" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^ +(I|LRA|Peak):" | tail -3
echo "$O"
