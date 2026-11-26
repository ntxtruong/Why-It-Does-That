#!/usr/bin/env python3
"""First-pass check of the narration: transcribe each beat with a speech-recognition
model and compare it with the script.

Claude cannot hear. This does not judge tone or naturalness; it only finds beats where
the recognised words differ from the script (a dropped word, a mispronunciation, a
homograph read the wrong way). Trường still listens before publishing.

  python3 tools/asr_check.py ep02/narration.wav ep02/script.json ep02/timeline.json

The audio may be a .wav or the finished .mp4 (narration only, before music).
Model: sherpa-onnx whisper base.en in asr/ (installed by tools/setup.sh).
"""
import difflib
import json
import os
import re
import subprocess
import sys
import tempfile

import numpy as np
import soundfile as sf
import sherpa_onnx

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL = os.path.join(ROOT, "asr", "sherpa-onnx-whisper-base.en")

ONES = "zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen".split()
TENS = "_ _ twenty thirty forty fifty sixty seventy eighty ninety".split()
# British spelling in the script, American spelling from the recogniser: not a difference in sound.
SPELL = {"colour": "color", "colours": "colors", "coloured": "colored", "centre": "center", "centres": "centers",
         "metre": "meter", "metres": "meters", "kilometre": "kilometer", "kilometres": "kilometers",
         "grey": "gray", "aeroplane": "airplane", "travelled": "traveled", "travelling": "traveling",
         "fibre": "fiber", "litre": "liter", "litres": "liters", "vapour": "vapor", "behaviour": "behavior"}


def number_words(n):
    if n < 20:
        return ONES[n]
    if n < 100:
        return TENS[n // 10] + ("" if n % 10 == 0 else " " + ONES[n % 10])
    if n < 1000:
        return ONES[n // 100] + " hundred" + ("" if n % 100 == 0 else " " + number_words(n % 100))
    if n < 1000000:
        return number_words(n // 1000) + " thousand" + ("" if n % 1000 == 0 else " " + number_words(n % 1000))
    return str(n)


def norm(s):
    s = s.lower().replace("°", " degrees ").replace("%", " percent ")
    s = re.sub(r"(\d),(\d{3})", r"\1\2", s)
    s = re.sub(r"(\d+)\.(\d+)", lambda m: number_words(int(m.group(1))) + " point " + " ".join(ONES[int(c)] for c in m.group(2)), s)
    s = re.sub(r"\d+", lambda m: number_words(int(m.group(0))), s)
    s = s.replace("-", " ")
    s = re.sub(r"[^a-z' ]", " ", s)
    return [SPELL.get(w, w) for w in s.split()]


def load_audio(path):
    if not path.lower().endswith(".wav"):
        tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False).name
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", path, "-vn", "-ac", "1", "-ar", "16000", tmp], check=True)
        path = tmp
    a, sr = sf.read(path, dtype="float32")
    if a.ndim > 1:
        a = a.mean(axis=1)
    if sr != 16000:  # linear resample is enough for recognition
        n = int(len(a) * 16000 / sr)
        a = np.interp(np.linspace(0, len(a) - 1, n), np.arange(len(a)), a).astype("float32")
    return a, 16000


def main():
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    audio, script, timeline = sys.argv[1:4]
    if not os.path.isdir(MODEL):
        sys.exit("Model missing: run bash tools/setup.sh")
    rec = sherpa_onnx.OfflineRecognizer.from_whisper(
        encoder=os.path.join(MODEL, "base.en-encoder.int8.onnx"),
        decoder=os.path.join(MODEL, "base.en-decoder.int8.onnx"),
        tokens=os.path.join(MODEL, "base.en-tokens.txt"), num_threads=2)
    a, sr = load_audio(audio)
    S = json.load(open(script))
    T = json.load(open(timeline))
    total = differing = flagged = 0
    for sc, tsc in zip(S["scenes"], T["scenes"]):
        for txt, b in zip(sc["beats"], tsc["beats"]):
            t0 = max(0.0, tsc["start"] + b["start"] - 0.15)
            t1 = tsc["start"] + b["end"] + 0.2
            st = rec.create_stream()
            st.accept_waveform(sr, a[int(t0 * sr):int(t1 * sr)])
            rec.decode_stream(st)
            ref, hyp = norm(txt), norm(st.result.text)
            ops = [(" ".join(ref[i1:i2]), " ".join(hyp[j1:j2]))
                   for tag, i1, i2, j1, j2 in difflib.SequenceMatcher(a=ref, b=hyp, autojunk=False).get_opcodes() if tag != "equal"]
            total += len(ref)
            differing += sum(max(len(x.split()), len(y.split())) for x, y in ops)
            if ops:
                flagged += 1
                m, s = divmod(t0, 60)
                print(f"{int(m)}:{s:04.1f}  {sc['id']}: " + "; ".join(f"script '{x}' / heard '{y}'" for x, y in ops))
    print(f"\n{flagged} beat(s) to listen to; {differing} of {total} words differ ({differing / max(total, 1) * 100:.1f}%).")
    print("A difference is a place to listen, not proof of an error: homophones ('a ray' / 'array') are expected.")


if __name__ == "__main__":
    main()
