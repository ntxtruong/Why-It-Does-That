"""Writes sfx.json from timeline.json (scene-relative event times, so SFX follow a re-voice). python3 make_sfx.py"""
import json
TL = json.load(open("timeline.json")); S = {s["id"]: s["start"] for s in TL["scenes"]}; D = TL["total"]
EV = {
 "hook":   [(0.08, "pop", -6), (0.9, "whoosh", -4), (1.9, "whoosh", -4), (2.05, "chime", -6), (3.1, "thud", -4), (3.4, "pop", -5)],
 "guess":  [(0.03, "whoosh", -5), (0.2, "pop", -6), (1.0, "crack", -8), (1.5, "whoosh", -5), (2.0, "pop", -6)],
 "mirror": [(0.03, "whoosh", -4), (0.9, "rise", -5), (1.15, "chime", -6), (2.35, "pop", -5)],
 "second": [(0.03, "whoosh", -6), (0.85, "tick", -4), (1.15, "tick", -4), (1.25, "drip", -6), (1.9, "tick", -4), (2.2, "tick", -4), (2.55, "chime", -7)],
 "leak":   [(0.03, "whoosh", -5), (0.5, "hiss", -9), (2.45, "pop", -4), (2.5, "chime", -6)],
 "cost":   [(0.03, "whoosh", -5)] + [(0.4 + i * 0.3, "tick", -3) for i in range(6)] + [(2.28, "pop", -3), (2.35, "chime", -7), (3.15, "whoosh", -5), (3.95, "hiss", -9)],
 "end":    [(0.03, "whoosh", -5), (1.15, "tick", -3), (2.25, "tick", -3)],
}
out = [[round(S[k] + t, 3), kind, db] for k, v in EV.items() for t, kind, db in v]
out.append([round(D - 0.6, 3), "whoosh", -6])
json.dump(sorted(out), open("sfx.json", "w")); print(len(out), "events")
