#!/usr/bin/env bash
# Fresh-session setup for the Why It Does That pipeline. Safe to run again.
#   bash tools/setup.sh
set -euo pipefail
cd "$(dirname "$0")/.."

echo "== Python packages (voice, speech check)"
pip install --break-system-packages -q kokoro-onnx soundfile sherpa-onnx numpy

echo "== Kokoro voice model (tts/, about 350 MB, git-ignored)"
mkdir -p tts asr
K=https://github.com/thewh1teagle/kokoro-onnx/releases/download/model-files-v1.0
[ -s tts/kokoro-v1.0.onnx ] || curl -fsSL -o tts/kokoro-v1.0.onnx "$K/kokoro-v1.0.onnx"
[ -s tts/voices-v1.0.bin ]  || curl -fsSL -o tts/voices-v1.0.bin  "$K/voices-v1.0.bin"

echo "== Speech-recognition model for the narration check (asr/, about 450 MB unpacked, git-ignored)"
if [ ! -s asr/sherpa-onnx-whisper-base.en/base.en-encoder.int8.onnx ]; then
  curl -fsSL -o asr/m.tar.bz2 https://github.com/k2-fsa/sherpa-onnx/releases/download/asr-models/sherpa-onnx-whisper-base.en.tar.bz2
  tar xjf asr/m.tar.bz2 -C asr && rm asr/m.tar.bz2
fi

echo "== Node render tools (Hyperframes, Remotion, GSAP)"
if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; else npm install --no-audit --no-fund; fi

echo "== Checks"
if [ "$(fc-list : family | grep -ci '^Inter' || true)" -gt 0 ]; then echo "Inter font: ok"; else echo "WARNING: Inter font missing (apt package fonts-inter)"; fi
. tools/env.sh
[ -x "$HYPERFRAMES_BROWSER_PATH" ] && echo "headless shell: $HYPERFRAMES_BROWSER_PATH" || echo "WARNING: no Chromium headless shell under /opt/pw-browsers"
ffmpeg -version | head -1
npx hyperframes --version 2>/dev/null | head -1 || true
npx remotion versions 2>/dev/null | grep -m1 -i "remotion" || true
echo "Setup done. Run '. tools/env.sh' before rendering."
