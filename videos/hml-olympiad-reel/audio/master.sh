#!/bin/sh
# Mux the rendered picture with the mix, two-pass loudnorm to -14 LUFS / -1.2 dBTP (Instagram). Run from the project folder.
set -e
V=out/video.mp4; A=audio/out/mix.wav; O=out/hml-olympiad-reel.mp4
J=$(ffmpeg -nostdin -hide_banner -i "$A" -af loudnorm=I=-14:TP=-1.2:LRA=11:print_format=json -f null - 2>&1 | sed -n '/^{/,/^}/p')
get() { echo "$J" | python3 -c "import json,sys;print(json.load(sys.stdin)['$1'])"; }
ffmpeg -nostdin -hide_banner -loglevel error -y -i "$V" -i "$A" -map 0:v -map 1:a -c:v copy \
  -af "loudnorm=I=-14:TP=-1.2:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
  -c:a aac -b:a 256k -movflags +faststart -shortest "$O"
ffmpeg -nostdin -hide_banner -i "$O" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^ +(I|LRA|Peak):" | tail -3
echo "$O"
