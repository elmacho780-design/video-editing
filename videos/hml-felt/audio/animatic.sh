#!/bin/sh
# Animatic: the eight storyboard frames cut to the score, each with a slow push-in. For judging the music against picture.
# Run from the project folder after audio/score.py:  sh audio/animatic.sh
set -e
cd "$(dirname "$0")/.."
T=$(mktemp -d)
# shot: start end (seconds), matching STORYBOARD.md
SHOTS="1 0 2
2 2 4
3 4 7
4 7 10
5 10 12
6 12 16
7 16 20
8 20 24"
echo "$SHOTS" | while read n a b; do
  F=$(( (b - a) * 30 ))
  ffmpeg -nostdin -hide_banner -loglevel error -y -loop 1 -i "stills/board/s${n}_0.jpg" \
    -vf "scale=2160:3840,zoompan=z='1+0.05*on/${F}':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=${F}:s=1080x1920:fps=30,format=yuv420p" \
    -frames:v "$F" -c:v libx264 -crf 18 -preset fast "$T/s$n.mp4"
  echo "file '$T/s$n.mp4'" >> "$T/list.txt"
done
mkdir -p renders
ffmpeg -hide_banner -loglevel error -y -f concat -safe 0 -i "$T/list.txt" -i audio/out/music.wav \
  -map 0:v -map 1:a -c:v copy -c:a aac -b:a 256k -shortest renders/animatic.mp4
rm -rf "$T"
echo renders/animatic.mp4
