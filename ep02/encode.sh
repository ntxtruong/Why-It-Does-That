#!/usr/bin/env bash
# Delivery file from the Hyperframes master: H.264 1080p30 + AAC, kept under GitHub's 100 MB file limit
# (the upload to YouTube fetches the file from this repo).  bash encode.sh renders/master.mp4 ../media/ep02-sky-1080p.mp4
# Audio is taken from narration.wav, not from the master: Hyperframes copies the mono narration to both
# stereo channels at full level, which measures 3 LU louder (-13 LUFS). ffmpeg's own mono-to-stereo
# upmix keeps the loudness of the mono file, about -16 LUFS.
set -euo pipefail
IN=${1:-renders/master.mp4}; OUT=${2:-../media/ep02-sky-1080p.mp4}; LIMIT_MB=${3:-95}
V="-c:v libx264 -preset slow -tune animation -pix_fmt yuv420p -profile:v high -movflags +faststart"
A="-map 0:v:0 -map 1:a:0 -ac 2 -c:a aac -b:a 160k -ar 48000 -shortest"
NAR=${4:-narration.wav}
ffmpeg -v error -y -i "$IN" -i "$NAR" $V -crf 19 $A "$OUT"
MB=$(( $(stat -c %s "$OUT") / 1048576 ))
if [ "$MB" -ge "$LIMIT_MB" ]; then
  DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
  KB=$(python3 -c "print(int($LIMIT_MB*8*1024/$DUR - 160 - 12))")
  echo "CRF 19 gives ${MB} MB; two-pass at ${KB} kb/s instead"
  ffmpeg -v error -y -i "$IN" $V -b:v ${KB}k -pass 1 -passlogfile renders/x264 -an -f null /dev/null
  ffmpeg -v error -y -i "$IN" -i "$NAR" $V -b:v ${KB}k -pass 2 -passlogfile renders/x264 $A "$OUT"
fi
ls -la "$OUT"
