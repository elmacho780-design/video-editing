#!/bin/sh
# The final file in ONE encode: the original camera file (flipped back, frame for frame, never re-sampled or re-coloured) with the
# lossless graphics layer (out/overlay.mkv) laid over it, and the mastered audio (audio/out/final.wav).
# - The footage stays in its own YUV 4:2:0, BT.709, limited range all the way: where there are no graphics its pixels pass straight
#   through to the encoder (the only lossy step after the camera's own).
# - The graphics are converted from RGB with the same BT.709 limited-range matrix, so their colours match.
# - x264 at CRF 14 (visually lossless), High profile, constant 30 fps, tagged BT.709 like the source.
# The end card runs past the take's last frame: the base holds that frame underneath (it is fully covered).
# Run from the project folder: sh tools/composite.sh
set -e
OUT=renders/hml-weekend-reel.mp4; mkdir -p renders
N=$(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 out/overlay.mkv)
ffmpeg -nostdin -hide_banner -loglevel error -y -i src/take.mov -i out/overlay.mkv -i audio/out/final.wav -filter_complex \
  "[0:v]hflip,tpad=stop_mode=clone:stop_duration=5,trim=end_frame=$N,setpts=N/30/TB[base];\
[1:v]setpts=N/30/TB,scale=out_color_matrix=bt709:out_range=tv:flags=accurate_rnd+full_chroma_int,format=yuva420p[ov];\
[base][ov]overlay=format=yuv420:alpha=straight:eof_action=pass,format=yuv420p[v]" \
  -map "[v]" -map 2:a -c:v libx264 -preset slow -crf 14 -tune film -profile:v high -level:v 4.2 -pix_fmt yuv420p -r 30 -g 60 \
  -colorspace bt709 -color_primaries bt709 -color_trc bt709 -color_range tv \
  -c:a aac -b:a 320k -ar 48000 -movflags +faststart -t "$(echo "$N/30" | bc -l)" "$OUT"
ffprobe -v error -show_entries format=duration,bit_rate:stream=codec_name,width,height,r_frame_rate,color_space,color_transfer,color_primaries,color_range -of compact "$OUT"
ffmpeg -nostdin -hide_banner -i "$OUT" -map 0:a -af ebur128=peak=true -f null - 2>&1 | grep -E "^ +(I|Peak):" | tail -2
echo "$OUT"
