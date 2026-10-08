#!/usr/bin/env python3
"""Picture checks on a rendered episode, measured from the video file itself.

  python3 tools/qc_video.py media/ep02-topic-1080p.mp4 ep02/timeline.json [--max-still 3] [--end-card 8]

Reports, and exits 1 when a limit is broken:
  * frozen stretches: runs where the picture does not change for longer than --max-still
    seconds (episode 1 had about 60 s of them, a fifth of the video). The last --end-card seconds
    are exempt, because the end card is meant to hold.
  * per scene: share of the frame that is lit (content against the dark background),
    how much the picture moves, and how much content sits in the bottom 15% of the
    frame, where YouTube draws captions.

Text size is not measured here. The rule is 40 px minimum at 1080p; `npx hyperframes
check` covers layout, overflow and contrast for HTML text.
"""
import argparse
import json
import subprocess
import sys

import numpy as np

W, H, FPS = 320, 180, 2


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("video")
    ap.add_argument("timeline", nargs="?")
    ap.add_argument("--max-still", type=float, default=3.0)
    ap.add_argument("--end-card", type=float, default=8.0)
    o = ap.parse_args()

    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", o.video, "-vf", f"fps={FPS},scale={W}:{H},format=gray", "-f", "rawvideo", "-"],
                         check=True, capture_output=True).stdout
    a = np.frombuffer(raw, dtype=np.uint8).reshape(-1, H, W).astype(np.int16)
    dur = len(a) / FPS
    motion = (np.abs(a[1:] - a[:-1]) > 12).mean(axis=(1, 2))  # share of pixels that changed in half a second
    still = motion < 0.0005

    runs, i = [], 0
    while i < len(still):
        if still[i]:
            j = i
            while j < len(still) and still[j]:
                j += 1
            s, e = i / FPS, j / FPS
            if e - s > o.max_still and s < dur - o.end_card:
                runs.append((s, min(e, dur - o.end_card)))
            i = j
        else:
            i += 1
    runs = [(s, e) for s, e in runs if e - s > o.max_still]
    frozen = sum(e - s for s, e in runs)
    fmt = lambda t: f"{int(t // 60)}:{t % 60:04.1f}"
    print(f"Length {fmt(dur)}. Frozen stretches longer than {o.max_still:g} s: {len(runs)}, total {frozen:.0f} s ({frozen / dur * 100:.0f}% of the video).")
    for s, e in runs:
        print(f"  {fmt(s)} to {fmt(e)}  ({e - s:.1f} s)")

    bg = np.median(a, axis=(1, 2))
    lit = (a - bg[:, None, None]) > 18
    if o.timeline:
        print("\nscene        lit area   moving px   still time   bottom 15% used")
        for sc in json.load(open(o.timeline))["scenes"]:
            i0, i1 = int(sc["start"] * FPS), int((sc["start"] + sc["dur"]) * FPS)
            m = motion[i0:min(i1, len(motion))]
            rows = lit[i0:i1].any(axis=2).mean(axis=0)
            print(f"{sc['id']:12s} {lit[i0:i1].mean() * 100:6.1f}%   {m.mean() * 100:7.2f}%   {(m < 0.0005).mean() * 100:8.0f}%   {rows[int(H * 0.85):].mean() * 100:10.0f}%")
    sys.exit(1 if runs else 0)


if __name__ == "__main__":
    main()
