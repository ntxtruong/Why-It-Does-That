"""Resolve a voice preset from tools/voices.json into a Kokoro style vector and speed.
script.json "voice" may be a preset name, a plain Kokoro voice id, or "auto" (rotation by episode number)."""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(HERE, "voices.json")))
def pick(name, ep_dir=None):
    if name == "auto":
        m = re.search(r"ep(\d+)", os.path.basename(os.path.abspath(ep_dir or os.getcwd())))
        n = int(m.group(1)) if m else 0
        name = CFG["rotation"][n % len(CFG["rotation"])]
    return name
def resolve(k, name, speed=None, ep_dir=None):
    name = pick(name, ep_dir)
    p = CFG["presets"].get(name)
    if not p: return name, (speed or 1.0), name, ("en-gb" if name[:1] == "b" else "en-us")
    st = sum(k.get_voice_style(v) * w for v, w in p["mix"].items())
    return st, (speed or p["speed"]), name, p.get("lang", "en-us")
