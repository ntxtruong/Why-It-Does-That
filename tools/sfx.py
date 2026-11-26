"""Sound-design layer (channel v5, 2026-11-25): short synthesized SFX mixed under the narration.
  python3 ../tools/sfx.py            (in an episode folder: reads sfx.json + narration.wav, writes mix.wav)
sfx.json: [[time_s, kind, gain_db], ...]; kinds: whoosh, pop, tick, chime, drip, crack, hiss, thud, rise.
All sounds are generated here from noise and sine waves (no samples, no licence questions). Claude cannot hear the
result: list the timings in the run report so Trường can check one video."""
import json, numpy as np, soundfile as sf
SR = 48000
rng = np.random.default_rng(7)
def env(n, a=0.004, d=0.15):
    t = np.arange(n) / SR; return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)
def noise(n): return rng.standard_normal(n).astype(np.float32)
def lp(x, k):  # one-pole low-pass, k in (0,1): smaller = darker
    y = np.empty_like(x); s = 0.0
    for i, v in enumerate(x): s += k * (v - s); y[i] = s
    return y
def sweep(f0, f1, n):
    f = np.geomspace(f0, f1, n); return np.sin(2 * np.pi * np.cumsum(f) / SR)
def make(kind):
    if kind == "whoosh":
        n = int(0.45 * SR); x = noise(n); t = np.arange(n) / n
        hi = x - lp(x, 0.05); bell = np.sin(np.pi * t) ** 2
        return 0.5 * hi * bell * (0.3 + 0.7 * t)
    if kind == "pop":
        n = int(0.09 * SR); return 0.8 * sweep(900, 260, n) * env(n, 0.001, 0.025)
    if kind == "tick":
        n = int(0.03 * SR); return 0.6 * np.sin(2 * np.pi * 2400 * np.arange(n) / SR) * env(n, 0.0005, 0.006)
    if kind == "drip":
        n = int(0.12 * SR); return 0.7 * sweep(700, 1900, n) * env(n, 0.001, 0.04)
    if kind == "chime":
        n = int(1.2 * SR); t = np.arange(n) / SR
        return 0.35 * (np.sin(2 * np.pi * 880 * t) + 0.6 * np.sin(2 * np.pi * 1320 * t) + 0.3 * np.sin(2 * np.pi * 1760 * t)) * env(n, 0.005, 0.35)
    if kind == "rise":
        n = int(0.7 * SR); t = np.arange(n) / n; return 0.35 * sweep(300, 1200, n) * np.sin(np.pi * t) ** 1.5
    if kind == "crack":
        n = int(0.35 * SR); x = noise(n); return 0.9 * (x - lp(x, 0.3)) * env(n, 0.0005, 0.05) + 0.4 * lp(x, 0.02) * env(n, 0.001, 0.12) * 6
    if kind == "hiss":
        n = int(0.9 * SR); x = noise(n); t = np.arange(n) / n; return 0.25 * (x - lp(x, 0.2)) * np.sin(np.pi * t)
    if kind == "thud":
        n = int(0.3 * SR); return 0.9 * sweep(140, 45, n) * env(n, 0.002, 0.08)
    raise ValueError(kind)
nar, sr = sf.read("narration.wav", dtype="float32"); assert sr == SR
if nar.ndim > 1: nar = nar.mean(axis=1)
fx = np.zeros(len(nar) + SR, dtype=np.float32)
for t0, kind, gdb in json.load(open("sfx.json")):
    s = make(kind).astype(np.float32) * (10 ** (gdb / 20)) * 0.25; i = int(t0 * SR); fx[i:i + len(s)] += s[:len(fx) - i]
fx = fx[:len(nar)]
mix = nar + fx; peak = np.abs(mix).max()
if peak > 0.97: mix *= 0.97 / peak
sf.write("mix.wav", mix, SR); print("mix.wav", round(len(mix) / SR, 2), "s; sfx peak", round(float(np.abs(fx).max()), 3))
