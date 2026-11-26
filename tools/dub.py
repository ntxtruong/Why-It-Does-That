"""Dubbed audio track for YouTube multi-language audio (2026-11-26, Trường: "thêm bản dịch âm thanh").
  python3 ../tools/dub.py ja      (in an episode folder; also: zh-Hant)
Reads subtitles.<lang>.srt (translated lines, English timings), voices each line with Kokoro,
places it at its cue start (pushed later if the previous line overruns), speeds the whole read up
(max 1.4x) until it ends before the video ends, matches the English narration's loudness, lays the
episode's SFX (sfx.json) under it, writes dub.<lang>.wav and dub.<lang>.mp3 for upload.
Kokoro has no Vietnamese, Thai, Korean, Indonesian or Filipino voice: those need another TTS."""
import sys, os, subprocess, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
HERE = os.path.dirname(os.path.abspath(__file__))
VOICE = {"ja": ("jf_alpha", "ja"), "zh-Hant": ("zf_xiaobei", "zh")}
lang = sys.argv[1]; voice, g2p_lang = VOICE[lang]
if g2p_lang == "ja":
    from misaki import ja; G = ja.JAG2P()
else:
    from misaki import zh; G = zh.ZHG2P()
def ph(t):
    r = G(t); return r[0] if isinstance(r, tuple) else r
def ts(s):
    h, m, rest = s.split(":"); sec, ms = rest.split(","); return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000
cues = []
for b in open(f"subtitles.{lang}.srt", encoding="utf-8").read().strip().split("\n\n"):
    L = b.strip().split("\n")
    if len(L) >= 3: a, z = L[1].split(" --> "); cues.append((ts(a), ts(z), " ".join(L[2:])))
SR = 48000
nar, _ = sf.read("narration.wav", dtype="float32")
if nar.ndim > 1: nar = nar.mean(axis=1)
total = len(nar) / SR
k = Kokoro(os.path.join(HERE, "../tts/kokoro-v1.0.onnx"), os.path.join(HERE, "../tts/voices-v1.0.bin"))
def synth(speed):
    clips = []
    for s0, s1, t in cues:
        a, sr = k.create(ph(t), voice=voice, speed=speed, is_phonemes=True)
        a = np.interp(np.arange(0, len(a), sr / SR), np.arange(len(a)), a).astype(np.float32)  # to 48 kHz
        clips.append((s0, a))
    out, pos = [], 0.0
    for s0, a in clips:
        st = max(s0, pos + 0.06); out.append((st, a)); pos = st + len(a) / SR
    return out, pos
speed = 1.0
while True:
    placed, end = synth(speed)
    if end <= total - 0.25 or speed >= 1.4: break
    speed = min(1.4, speed * end / (total - 0.25) + 0.02)
voice_track = np.zeros(int((max(end, total) + 0.5) * SR), dtype=np.float32)
for st, a in placed:
    i = int(st * SR); voice_track[i:i + len(a)] += a
if end > total - 0.05:  # still too long: compress the whole voice track in time
    f = (end + 0.1) / (total - 0.15)
    tmp_in, tmp_out = f"/tmp/dub_{lang}_in.wav", f"/tmp/dub_{lang}_out.wav"
    sf.write(tmp_in, voice_track[:int((end + 0.1) * SR)], SR)
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", tmp_in, "-filter:a", f"atempo={f:.4f}", tmp_out], check=True)
    voice_track, _ = sf.read(tmp_out, dtype="float32")
voice_track = np.pad(voice_track, (0, max(0, len(nar) - len(voice_track))))[:len(nar)]
def rms_active(x):
    w = int(0.05 * SR); e = np.sqrt(np.convolve(x ** 2, np.ones(w) / w, "same")); return float(np.sqrt(np.mean(x[e > 0.02] ** 2) + 1e-12))
voice_track *= rms_active(nar) / max(rms_active(voice_track), 1e-6)
src = open(os.path.join(HERE, "sfx.py")).read().split("nar, sr =")[0]
ns = {}; exec(src, ns)
import json
fx = np.zeros(len(nar) + SR, dtype=np.float32)
if os.path.exists("sfx.json"):
    for t0, kind, gdb in json.load(open("sfx.json")):
        s = ns["make"](kind).astype(np.float32) * (10 ** (gdb / 20)) * 0.25; i = int(t0 * SR); fx[i:i + len(s)] += s[:len(fx) - i]
mix = voice_track + fx[:len(nar)]
pk = np.abs(mix).max()
if pk > 0.97: mix *= 0.97 / pk
sf.write(f"dub.{lang}.wav", mix, SR)
subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", f"dub.{lang}.wav", "-ac", "2", "-b:a", "192k", f"dub.{lang}.mp3"], check=True)
print(lang, "speed", round(speed, 2), "voice ends", round(end, 2), "of", round(total, 2), "s")
