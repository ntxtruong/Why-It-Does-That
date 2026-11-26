# ep61 retro (Aristotle illusion / two noses, bella_sarah, 20.7 s, DO hook, hook=try len=short look=flat, no mascot)
- Applied from ep58/60: one stage (face + crossed hand) for all 21 s, every step a change ON it; one label slot (y 150), out-before-in; events on the spoken word (split 8.42 s on "uncrossed"); `hyperframes check` before snapshots.
- Pass 1 (own critic): fingertips hid the real nose -> tips below it, nose drawn over the hand; dark ghost fingers hid the real ones -> light cyan ghost, real fingers dimmed; frame-0 title shared 4 words with the caption -> "Try this right now".
- Review 1 (7.0/10): ending "One nose or two?" was 4 words -> "Two?" everywhere (TTS, canvas, 7 subtitles, dubs); doubled noses in frame 0 spoiled the reveal -> frame 0 shows ONE nose, fingers land at 0.5 s with a pink ripple, two noses appear first at 8.42 s.
- Review 1 cont.: hard zoom jumps -> Catmull-Rom camera (continuous velocity, zoom <= 1.2, head never clipped); marble fade -> light band wipe down/up; "350 BC" -> "2,000+ years"; strike visible 1.7 s; teal torso fills the bottom.
- Bug: camera spline ran past its last key and threw (blank 18.8-20.2 s); caught by snapshot -> padded keys. Snapshot every scene after a camera change.
- Checks: ASR 0/49; QC exit 0; 2 s pixel windows 12-54 %, 0-1 s 10 %; loop frame diff 2.5 %; dubs speed 1.0 (ja: 3 lines shortened, zh: 2).
- Still weak: felt noses read a little like pig snouts; 11-12 s (ghost over real fingers + arrows) is busy; hand drawing is simple.
- Do better next time: start with a one-word ending and an unspoiled frame 0 in the storyboard; draw ghost/real overlays side by side, not stacked.
- Prediction: stayed 58-64 %, avg view 12-14 s. Reason: instant self-test (like ep 52/58), 21 s, split at 8.4 s; risk: viewers who stop to try it swipe away.
