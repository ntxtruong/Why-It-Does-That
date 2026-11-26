"""Writes sfx.json from timeline.json (scene-relative event times). python3 make_sfx.py
Clock ticks fall on every whole second while the clock is the subject (hook, guess, end), matching the on-screen hand."""
import json
TL = json.load(open("timeline.json")); S = {s["id"]: s["start"] for s in TL["scenes"]}; D = TL["total"]
EV = {
 "hook":    [(1.3, "whoosh", -4), (1.35, "pop", -6)],
 "guess":   [(0.1, "pop", -7), (2.0, "chime", -7)],
 "blind":   [(0.3, "whoosh", -5), (1.5, "whoosh", -7), (1.52, "thud", -5), (2.7, "whoosh", -7), (2.72, "thud", -6)],
 "fill":    [(0.1, "pop", -7), (0.35, "pop", -7), (0.6, "pop", -7), (1.4, "whoosh", -4), (1.6, "chime", -6)],
 "stretch": [(0.15, "pop", -6), (0.5, "pop", -6), (1.0, "whoosh", -6), (1.9, "thud", -4), (2.8, "rise", -6), (3.7, "chime", -7)],
 "every":   [(0.2 + i / 3, "tick", -8) for i in range(9)],
 "end":     [(0.03, "whoosh", -7)],
}
out = [[round(S[k] + t, 3), kind, db] for k, v in EV.items() for t, kind, db in v]
for sec in range(1, int(D) + 1):
    if (sec < S["blind"] or sec >= S["end"]) and sec < D - 0.5: out.append([float(sec), "tick", -5])
out.append([round(D - 0.5, 3), "tick", -5])
json.dump(sorted(out), open("sfx.json", "w")); print(len(out), "events")
