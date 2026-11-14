"""Writes subtitles.<lang>.srt from tr_output.json, reusing the English timings in subtitles.srt.
  python3 compose_tr.py"""
import json
O = json.load(open("tr_output.json")); blocks = open("subtitles.srt").read().strip().split("\n\n")
for lang, v in O.items():
    if lang == "new_terms": continue
    assert len(v["subtitles"]) == len(blocks), (lang, len(v["subtitles"]), len(blocks))
    out = []
    for b, s in zip(blocks, v["subtitles"]):
        n, tm = b.split("\n")[:2]; out.append(f"{n}\n{tm}\n{s}\n")
    open(f"subtitles.{lang}.srt", "w").write("\n".join(out)); print(lang, len(out))
