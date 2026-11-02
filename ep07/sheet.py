"""Contact sheet of the snapshot PNGs, 3 per row, for looking at many frames at once.
  python3 sheet.py [snapshots] [out.jpg] [columns]"""
import sys, glob, subprocess, os
d = sys.argv[1] if len(sys.argv) > 1 else "snapshots"; out = sys.argv[2] if len(sys.argv) > 2 else d + "/sheet.jpg"; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 3
fs = sorted(glob.glob(d + "/frame-*.png")); rows = -(-len(fs) // cols)
args = ["ffmpeg", "-v", "error", "-y"]
for f in fs: args += ["-i", f]
lab = "".join(f"[{i}:v]scale=640:360,drawtext=text='{os.path.basename(f)[12:-4]}':x=8:y=330:fontsize=22:fontcolor=white:box=1:boxcolor=black@0.6[v{i}];" for i, f in enumerate(fs))
lay = "|".join(f"{(i % cols) * 640}_{(i // cols) * 360}" for i in range(len(fs)))
args += ["-filter_complex", lab + "".join(f"[v{i}]" for i in range(len(fs))) + f"xstack=inputs={len(fs)}:layout={lay}:fill=black", "-frames:v", "1", "-q:v", "3", out]
subprocess.run(args, check=True); print(out, len(fs), "frames")
