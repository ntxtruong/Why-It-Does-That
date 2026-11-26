"""Writes sfx.json from timeline.json (scene-relative event times, so SFX follow a re-voice). python3 make_sfx.py"""
import json
TL = json.load(open("timeline.json")); S = {s["id"]: s["start"] for s in TL["scenes"]}; D = TL["total"]
EV = {
 "hook":   [(0.08, "pop", -6), (1.6, "rise", -7), (2.05, "chime", -6), (3.1, "thud", -4), (3.4, "pop", -5)],
 "guess":  [(0.03, "whoosh", -5), (0.2, "pop", -6), (1.0, "crack", -8), (1.5, "whoosh", -5), (2.0, "pop", -4)],
 "mirror": [(0.03, "whoosh", -4), (0.85, "whoosh", -5), (1.15, "chime", -6), (2.35, "pop", -5)],
 "second": [(0.2, "whoosh", -8), (1.9, "drip", -4), (1.95, "chime", -8), (2.5, "pop", -5), (2.6, "chime", -7)],
 "leak":   [(0.3, "whoosh", -5), (0.5, "hiss", -10), (2.45, "pop", -4), (2.5, "chime", -6)],
 "cost":   [(0.03, "whoosh", -5)] + [(0.4 + i * 0.3, "tick", -3) for i in range(6)] + [(2.28, "pop", -3), (2.35, "chime", -7), (3.15, "whoosh", -5), (4.1, "hiss", -10)],
 "end":    [(0.03, "whoosh", -5), (1.15, "tick", -3), (2.25, "tick", -3)],
}
out = [[round(S[k] + t, 3), kind, db] for k, v in EV.items() for t, kind, db in v]
out.append([round(D - 0.6, 3), "whoosh", -6])
json.dump(sorted(out), open("sfx.json", "w")); print(len(out), "events")
