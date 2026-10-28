#!/usr/bin/env bash
# Delivery file from the Hyperframes master: H.264 1080p30 + AAC at -14 LUFS, kept under GitHub's 100 MB limit.
#   bash encode.sh renders/master.mp4 ../media/epNN-topic-1080p.mp4
# Audio comes from narration.wav (not the master: Hyperframes doubles mono to both channels and reads 3 LU hot),
# brought to -14 LUFS integrated with a measured gain and a true-peak limiter, then measured again on the final file.
set -euo pipefail
IN=${1:-renders/master.mp4}; OUT=${2}; LIMIT_MB=${3:-95}; NAR=${4:-narration.wav}
L=$(ffmpeg -nostats -i "$NAR" -af ebur128 -f null - 2>&1 | grep -A1 "Integrated loudness" | grep -oE -- "I: +-?[0-9.]+" | tail -1 | grep -oE -- "-?[0-9.]+")
GAIN=$(python3 -c "print(round(-14-($L),2))"); echo "narration $L LUFS → gain ${GAIN} dB"
AF="aresample=48000,volume=${GAIN}dB,alimiter=limit=0.84:attack=5:release=60:level=false"
V="-c:v libx264 -preset slow -tune animation -pix_fmt yuv420p -profile:v high -movflags +faststart"
A="-map 0:v:0 -map 1:a:0 -af $AF -ac 2 -c:a aac -b:a 160k -ar 48000 -shortest"
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
ffmpeg -nostats -i "$OUT" -af ebur128=peak=true -f null - 2>&1 | grep -E "^ +I:|^ +Peak:" | tail -2
