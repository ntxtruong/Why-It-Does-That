"""Narration for episode 2: narration.wav, timeline.json / timeline.js, subtitles.srt.
Same voice as episode 1 (Kokoro am_michael, speed 0.9). New here: a beat listed in the
scene's "long" array is followed by a 1.5 s pause, so the picture can play on its own.
  python3 tts.py
"""
import json, re, numpy as np, soundfile as sf
from kokoro_onnx import Kokoro
S = json.load(open('script.json')); k = Kokoro("../tts/kokoro-v1.0.onnx", "../tts/voices-v1.0.bin"); SR = 24000
PRE, GAP, LONG, POST, TAIL = 0.6, 0.5, 1.5, 1.2, 9.0   # TAIL = end card held after the last word
def trim(a, th=0.004):
    idx = np.where(np.abs(a) > th)[0]
    return a if len(idx) == 0 else a[max(0, idx[0] - int(.03 * SR)):min(len(a), idx[-1] + int(.06 * SR))]
sil = lambda s: np.zeros(int(s * SR), dtype=np.float32)
out = []; t = 0.0; TL = {"scenes": []}; srt = []
for sc in S["scenes"]:
    s0 = t; beats = []; out.append(sil(PRE)); t += PRE
    for i, txt in enumerate(sc["beats"]):
        a, sr = k.create(txt, voice=S["voice"], speed=S.get("speed", 0.9), lang="en-us"); assert sr == SR
        a = trim(a.astype(np.float32)); d = len(a) / SR
        beats.append({"start": round(t - s0, 3), "end": round(t - s0 + d, 3)}); srt.append((t, t + d, txt))
        out.append(a); t += d
        last = i == len(sc["beats"]) - 1
        g = max(POST if last else GAP, LONG if i in sc.get("long", []) else 0)
        out.append(sil(g)); t += g
    TL["scenes"].append({"id": sc["id"], "start": round(s0, 3), "dur": round(t - s0, 3), "beats": beats}); print(sc["id"], round(t - s0, 1), flush=True)
out.append(sil(TAIL)); t += TAIL; TL["total"] = round(t, 3); TL["scenes"][-1]["dur"] = round(TL["scenes"][-1]["dur"] + TAIL, 3)
audio = np.concatenate(out); audio = audio / np.abs(audio).max() * 0.89
sf.write("narration_raw.wav", audio, SR)
# loudness: about -16 LUFS for YouTube, true peak about -1.3 dBFS (resample first, then limit, or the peaks overshoot)
import subprocess
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", "narration_raw.wav", "-af", "aresample=48000,volume=10dB,alimiter=limit=0.8:attack=5:release=60:level=false", "narration.wav"], check=True)
json.dump(TL, open("timeline.json", "w")); open("timeline.js", "w").write("window.TL=" + json.dumps(TL) + ";")
def ts(x):
    ms = int(round(x * 1000)); return f"{ms // 3600000:02d}:{ms // 60000 % 60:02d}:{ms // 1000 % 60:02d},{ms % 1000:03d}"
NUM = [("seven hundred nanometres", "700 nanometres"), ("four hundred and fifty", "450"), ("thirty-eight times", "38 times"),
       ("eighteen seventy-one", "1871"), ("a thousand red photons and a thousand blue ones", "1,000 red photons and 1,000 blue ones")]
def cap(s):
    for a, b in NUM: s = s.replace(a, b)
    return s
# one subtitle per sentence, timed by its share of the beat's characters
rows = []
for a, b, txt in srt:
    parts = re.split(r'(?<=[.?!])\s+', txt); n = sum(len(p) for p in parts); u = a
    for p in parts:
        d = (b - a) * len(p) / n; rows.append((u, u + d, cap(p))); u += d
open("subtitles.srt", "w").write("\n".join(f"{i + 1}\n{ts(a)} --> {ts(b)}\n{s}\n" for i, (a, b, s) in enumerate(rows)))
dur = [b - a for a, b, _ in srt]
print("total", round(t, 1), "s; words", sum(len(b.split()) for sc in S["scenes"] for b in sc["beats"]), "; longest beat", round(max(dur), 1), "s; subtitles", len(rows))
