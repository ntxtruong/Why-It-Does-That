"""Vietnamese narration track timed to the English subtitles (Piper vi_VN-vais1000-medium, CC BY 4.0 data).
  python3 vn_dub.py <episode dir> <out.wav> <lines.json>"""
import sys, json, re, wave, io, numpy as np, soundfile as sf
from piper import PiperVoice, SynthesisConfig
d, out, lines = sys.argv[1], sys.argv[2], json.load(open(sys.argv[3]))
V = PiperVoice.load("vits-piper-vi_VN-vais1000-medium/vi_VN-vais1000-medium.onnx")
SR = V.config.sample_rate
blocks = open(d + "/subtitles.srt").read().strip().split("\n\n")
def ts(s): h, m, x = s.split(":"); sec, ms = x.split(","); return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000
starts = [ts(b.split("\n")[1].split(" --> ")[0]) for b in blocks]
total = json.load(open(d + "/timeline.json"))["total"]
assert len(lines) == len(starts)
def synth(txt, ls):
    buf = io.BytesIO()
    with wave.open(buf, "wb") as w: V.synthesize_wav(txt, w, syn_config=SynthesisConfig(length_scale=ls))
    buf.seek(0); a, _ = sf.read(buf, dtype="float32"); return a
track = np.zeros(int((total + 0.5) * SR), dtype=np.float32); t = 0.0
for i, (st, txt) in enumerate(zip(starts, lines)):
    st = max(st, t)
    slot = (starts[i + 1] if i + 1 < len(starts) else total - 0.3) - st
    ls = 1.0; a = synth(txt, ls)
    while len(a) / SR > slot - 0.05 and ls > 0.72: ls -= 0.04; a = synth(txt, ls)
    n0 = int(st * SR); track[n0:n0 + len(a)] += a[:len(track) - n0]; t = st + len(a) / SR
    print(f"{st:5.2f}s ls={ls:.2f} {len(a)/SR:4.2f}/{slot:4.2f}s  {txt}")
sf.write(out, track / max(1e-6, np.abs(track).max()) * 0.89, SR)
