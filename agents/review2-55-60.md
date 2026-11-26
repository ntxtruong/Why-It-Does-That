# Review round 2 — Shorts 55–60 (independent, viewer-eye only)

Reviewer: fresh agent, did not see the build or the round-1 review before scoring.
Method: frames every 0.5 s for 0–15 s and every 1.5 s after (`/tmp/rev2/epNN/s1-3.png` contact sheets), frame 0 at 120 px wide, full-res frames with a 40 px / 8 px reference bar for text and line size, and a pixel-change measure of the subject area (top 5–62 % of the frame) at 10 fps per 2 s window. Narration timing from `epNN/subtitles.srt` (audio not heard). Timestamps are ±0.5 s.

## Scores

| Ep | Topic | Score | Upload now? |
|---|---|---|---|
| 55 | Cat eyes glow | **8** | yes |
| 56 | Pen cap hole | **7** | yes (P2 fixes optional) |
| 57 | Wooden spoon | **6** | no — the 7–10 s beat is not on screen |
| 58 | Stopped clock | **6** | no — the illusion setup is weaker than it needs to be |
| 59 | Falling cat | **8** | yes |
| 60 | Brain freeze | **7.5** | yes |

No P0 in any video.

## Checklist summary

| Check | 55 | 56 | 57 | 58 | 59 | 60 |
|---|---|---|---|---|---|---|
| Frame 0 at 120 px: object + oddity | pass | partial (hole is small, a hole is not odd by itself; title carries it) | partial (pot + foam clear; the spoon trick is not yet visible) | partial (DO hook, no oddity on screen) | pass | pass |
| 0–3 s narration matches screen | pass | pass | partial ("about to boil over" while foam already runs down the pot) | pass | pass | pass |
| Hook object on screen 7–15 s | pass (zoomed cat eye) | pass (cap in windpipe) | pass (spoon/wood band) | pass | pass | partial (head yes, ice cream gone 3.5–16.5 s) |
| Motion on the object in every 2 s window 0–15 s | pass (weak 10.2–11.3 s) | pass (weak 6–8 s) | pass | pass, but only the second hand moves 0–8 s | pass | weak 12–14 s (max 1.7 % change) |
| Text ≥ 40 px, lines ≥ 8 px | pass | mostly ("1L" balloon labels ~32 px) | pass | fail on "time →", "REAL/FELT" (~30–35 px) | pass | pass (chart sub-labels borderline ~40 px) |
| Captions visible by first syllable | pass | pass | pass | pass | pass (11.0 s chunk still fading in) | pass |
| Mascot / pop marks off the subject | fail (marks on the cat's cheek) | fail (marks on cap, pen, windpipe; mascot over pen/windpipe) | partial (mascot covers macro bubbles) | n/a (no mascot) | mostly | fail (marks on the head and the vessel) |
| Ending question about the topic | pass | pass | partial ("Wood or metal?" is unclear) | pass | pass | pass |
| Loop | pass | pass | pass | pass (second hand jumps back to 12) | pass | pass |
| Illusion: jump > half screen, then ≥ 3 clean s | — | — | — | **fail** (see 58) | — | — |

## Findings per video

### 55 — Why cats' eyes glow (8/10)
Strong: glowing eyes at frame 0 readable at 120 px; human face "Yours don't" at 3.0 s; wrong guess (bulb in eye, crossed out) 4.5–5.5 s; reveal by zoom into the eye at 8.0 s and "a MIRROR behind the retina" at 9.0 s; gold/green ending loops onto frame 0.

- **P1 · 0.5–2.5 s and 27–28.5 s** — the mascot's "!" / "?" bubble sits on the cat's left cheek and whiskers, right under the glowing eye, at the exact moment the viewer is deciding whether to stay. **Fix:** anchor the bubble beside the mascot's head (x < 200 px, y > 1150 px) or above the mascot, never inside the cat's bounding box.
- **P2 · 9.0–11.3 s** — the eye cross-section is static for ~1.1 s (10.2–11.3 s) while the narration names "tapetum lucidum". **Fix:** shimmer the mirror layer or start the light dot entering from the lens at 10.2 s instead of 11.5 s.
- **P2 · 21.0–22.5 s** — the human face and the cat head are stacked on top of each other (cat head pasted on the chin), reads as a glitch. **Fix:** put "you" and "cat" side by side, each with its own row of bulbs (6 vs 1).
- **P2 · whole video** — mascot is ~13 % of frame width and only reacts through bubbles; v5 asks for a large mascot with a visible reaction per beat. **Fix:** scale mascot to ~25 % width on the reveal beats (8 s, 19.5 s) with a pose change.

### 56 — Why pen caps have a hole (7/10)
Strong: real-object DO hook with a light through the hole; "to help the ink flow?" crossed out at 5.0 s; "breathed in!" with red glow at 8.5–9.5 s is a clear second event before the wall; windpipe close-up with air particles and tweezers; balloons count to 8 L; loop back to the cap in the light.

- **P1 · 2.0–5.5 s, 11–12.5 s, 21 s** — pop marks land on the subject: "!" on the cap body in the 2.0–3.0 s close-up, "?" on the pen barrel 4.0–5.5 s, lightbulb on the cap's lower edge inside the windpipe 11–12.5 s, "!" on the cap rim 21 s. The mascot itself overlaps the pen at 3.5–5.5 s and the windpipe wall at 10–14.5 s. **Fix:** same anchor rule as 55; shift the windpipe scene right by ~120 px so the mascot sits on empty background.
- **P2 · frame 0** — at 120 px the cap reads as a blue tube; the hole is a small grey dot. **Fix:** push in so the hole is ≥ 15 % of frame width at 0 s (the 2.0 s framing), keep the arrow.
- **P2 · 6.0–8.0 s** — "chomp, chomp…" but the cap does not move in the mouth (max 6 % change in the window). **Fix:** bob the cap 2–3 times with the chomp text.
- **P2 · 15–20 s** — "1L" balloon labels ~32 px; the "8 litres of air a minute" label duplicates the caption word for word. **Fix:** labels ≥ 44 px; replace the duplicate label with a counter "1…8 L" that ticks with each balloon.
- **P2 · 21–23 s** — "16 mm test ring" is a grey arc under the cap; a viewer cannot tell it is a ring the cap fails to pass through. **Fix:** show the ring as a full circle and drop the cap onto it so it visibly sticks.

### 57 — Why a wooden spoon stops a boil-over (6/10)
Strong: "Watch what this spoon does" plus foam at the rim; spoon lands ~3.0 s and the foam drops by 3.5 s (payoff seen early); wrong guess "pressing it down?" struck through at 7.0 s; macro of bubbles bursting on the wood at 10–13 s; hot-spoon failure and a loop to the overflowing pot.

- **P1 · 4.0–9.5 s** — the push-in centres on the pot wall: ~50 % of the frame is plain grey metal, and the spoon/foam contact is a thin strip (~10 % of frame height). During 7.8–9.6 s the narration says "Watch where the bubbles touch it", but the bursts are tiny sparkles in that strip; the macro (the actual reveal) only arrives at 10.0 s, past the 9–10 s exit point. **Fix:** cut to the underside macro at 7.8 s (on "Watch"), or push in on the spoon–foam line so it fills ≥ 60 % of the frame; make the first burst large and centred at ~8 s.
- **P2 · 0.5–2.5 s** — narration "is about to boil over" while foam already pours down the pot sides. **Fix:** keep the foam at the rim, first drips only at 2.0 s, then the spoon.
- **P2 · 10–12.5 s** — macro bubbles pass behind the mascot head; "!"/bulb marks sit among the bubbles. **Fix:** keep bubbles in x > 300 px or move mascot out for the macro.
- **P2 · 21 s** — "foam stays below the spoon" label touches the mascot's head. **Fix:** place it under the cross-section box.
- **P2 · 28–30 s** — "Wood or metal?" does not say what is being chosen. **Fix:** "Your spoon: wood or metal?"

### 58 — The first tick lasts too long (6/10)
Strong: clear instruction "Look at the dot. Now jump your eyes to the clock" with a "JUMP!" arrow at 1.5 s; the tick bar "every tick = 1.00 s" proves the video did not lag; "OFF" blackout at 9.5 s is a good second event; dot/?/clock timeline and REAL 1.0 s vs FELT 1.5 s make the idea visual; question "Did your clock freeze? yes or no?" tests the effect.

- **P1 · 0–1.5 s (illusion geometry)** — the dot is at about (180, 1130) and the clock centre at (620, 580): a jump of ~700 px, about 37 % of the screen height, so it does not span half the screen. **Fix:** dot at bottom-left (~150, 1600), clock top-right (~700, 450) → ~1 250 px jump.
- **P1 · 1.5–4.4 s (clean seconds)** — after the jump the screen is not clean: the top title still says "Stare at the dot." (contradicts the instruction just given), the dot keeps pulsing and draws the eye back, and the caption changes twice. The clean window is under 3 s before "first tick felt longer?" arrives at 4.5 s. **Fix:** at the "jump" word, swap the title to "Now: the clock" or remove it, fade the dot out, hide captions, and hold 3 s of only the ticking clock before any label.
- **P2 · 0–8 s** — only the second hand moves; subject-area change stays under 3 % until 8 s. Needed for the illusion, but after 4.5 s motion can return. **Fix:** after the clean 3 s, animate the tick bar from 4.5 s instead of 6.5 s.
- **P2 · 13–21 s** — "time →" (~30 px), "REAL"/"FELT" (~32 px), "+ borrowed" small. **Fix:** ≥ 44 px.
- **P2 · loop** — the second hand snaps from ~6 o'clock back to 12. **Fix:** end with the hand at 12 or start frame 0 at the end position.

### 59 — How a falling cat lands on its feet (8/10)
Strong: upside-down falling cat already turning at frame 0 with speed streaks; 1894 photo frames with the hand and "it pushed off the hand?"; "the photos proved them wrong" at 9.5 s and the bend line at 10–12 s land on the wall; two-halves arrows, swap, "feet down" at 21 s; "too low: no time to turn" consequence; clean loop.

- **P2 · 3.5–9.0 s** — 5.5 s on small sepia frames (the cat is ~35 % of frame width); at 8.0–9.0 s the zoom crops the cat's head off the panel edge. **Fix:** make the panel ≥ 70 % width and zoom on the hand without cropping the cat.
- **P2 · frame 0** — title wraps to three lines with an orphan "on." **Fix:** "Upside down. / Nothing to push on." on two lines (smaller size or shorter: "Upside down, nothing to push").
- **P2 · 10–12.5 s, 24 s** — "!"/bulb marks just under the cat's belly and touching the tail at 24 s. **Fix:** anchor rule as in 55.

### 60 — Why ice cream gives you brain freeze (7.5/10)
Strong: cone in the mouth and a red burst on the forehead at frame 0, readable at 120 px; "brain freezing?" with frost, struck out at 4.5 s; push-in to the roof of the mouth; vessel clamps (blue) at 9 s then floods (red) at 10 s — good event before the wall; nerve path "starts here" → "felt here"; 13 % vs 27 % chart; loop to the cone.

- **P1 · 0.5–3.0 s, 9.0–11.0 s** — pop marks sit on the subject: "!"/"?" on the back of the head during the hook, and "!" on the left end of the roof/vessel line during the clamp-and-flood reveal. **Fix:** anchor rule as in 55.
- **P2 · 12–14 s** — the nerve diagram barely moves (max 1.7 % change, the weakest 2 s window of the six videos). **Fix:** run a bright pulse along the nerve from mouth to forehead once per second.
- **P2 · 3.5–16.5 s** — the ice cream, the hook object, is gone for 13 s. **Fix:** keep a small cone on the lips in the mouth close-ups.
- **P2 · 5.5–9.5 s** — label "roof of the mouth" duplicates the caption. **Fix:** drop the label or turn it into an arrow only.

## Cross-video patterns
1. **Pop marks are anchored to the subject, not to the mascot** (55, 56, 57, 59, 60). This is the single most repeated defect.
2. **Mascot is still small and static** (~13 % width, reacts only through bubbles) — v5 item 4 not yet met.
3. **Labels repeat the caption** word for word in several scenes (56, 60): two copies of the same words compete for the eye.
4. **Hooks are good.** Every video has a visible oddity or a DO instruction at 0 s, a struck-out wrong guess at 4–7 s and a loop. The 7–10 s event is on time in 55, 56, 59, 60 and late or thin in 57.

## Compared with round 1

Round 1 (`agents/review-55-60.md`) scored 5–6/10 with five P0s. Round 2 scores 6–8/10 with no P0, so the fix round worked. Note that round 1 saw different cuts (ep 57 was 32.1 s and is now 30.8 s, ep 59 ended on "Cat person or dog person?"), so the videos have been rebuilt since then.

**Fixed**
- 55: the abstract 7.5–15 s stretch (P0). The cat's eye is now pushed into and cut open in place, the bar scene is gone, and the mirror label is a light chip. The glow no longer flickers off at 1–2 s, the bounce rays are thick beams, and the mouse is a "you / cat" split.
- 56: the hole is now drawn as a dark hole with an arrow and a beam. The pen is a large diagonal with an ink-drop icon. There is one labelled flow direction ("breathing in"), the tweezers are visible, ISO 11540 is off the screen, "16 mm test ring" is about 40 px, and the first balloon appears at 15 s.
- 57: the bursts are bright flashes, the starch bubble is translucent with a yellow skin, the chain reaction stops at the spoon line ("foam stays below the spoon"), the ending question changed, and the video is about 1.3 s shorter.
- 58: the 8–21 s diagram run (P0) is fixed. The same big clock stays on screen with OFF, the dot/?/clock strip, REAL vs FELT, and eye jumps counted on the clock. The mascot is removed, so nothing sits on the clock face. Frame 0 has a big "stare here" dot and a JUMP arrow.
- 59: frame 0 no longer reads as a dead cat: there are speed lines, a shelf above, open eyes and the title "Upside down. Nothing to push on.". The photos are one large flip-book panel. "The photos proved them wrong" clears up the cause and effect. The ending question is about the topic, the arrows are thicker, and "oof!" was added.
- 60: the calm frame 0 (P0) is fixed: the forehead burst and the cone in the mouth are there at 0 s. The vessels sit inside a head outline, the skin colour stays the same, the nerve is thick and glowing with labels of 40 px or more, the chart says "more than 2×", and the cone returns before the loop.

**Remain (partly or fully)**
- Pop marks on the subject: round 1 flagged them in 55, 57 and 58. They are now off the clock (58), but they moved onto the cat's cheek in the 55 hook and still land on the subject in 56, 57, 59 and 60. This is the most persistent defect.
- 57, 0–2.5 s: foam already pours down the sides while the voice says "about to boil over" (round 1 P1, not fixed).
- 57, 3.5–9.5 s: the push-in now starts at about 4 s (round 1 P0 → my P1), but it frames mostly the pot wall. The macro reveal still arrives only at 10 s.
- 56, 6–8 s: the "chomp" head barely moves (round 1 P1). It is improved by "breathed in!" at 8.5 s, but the cap does not bite.
- 58: the eye jump is still under half the screen (about 700 px), and the 3 clean seconds after it are not clean. REAL/FELT went from about 22 px to about 32 px, still under 40.
- Mascot small and static in all six (round 1 pattern 5, v5 item 4): unchanged. No real phone clip in any Short (v5 item 3).

**New regressions or new issues**
- 58: the top title "Stare at the dot." now stays on screen after "Now jump your eyes", which contradicts the instruction during the test window.
- 55, 21–22.5 s: the "you / cat" light comparison stacks the cat head onto the human chin.
- 56, 15–20 s: the "1L" balloon labels are about 32 px. The "8 litres of air a minute" label repeats the caption word for word (the same duplication appears in 60 with "roof of the mouth").
- 57: the fix for the round-1 P0 created the thin-strip push-in described above.
- 57: "Wood or metal?" (round 1's own suggestion) reads as ambiguous without "spoon".
- 60, 12–14 s: the nerve scene is the stillest 2 s window of the batch (pixel change of 1.7 % at most). It is not a regression in the strict sense, but no other 2 s window in the six videos is this still.

## Top 3 rules for the next episodes

1. **Pop marks have a home, and it is not the subject.** Place every "!", "?", bulb and check mark in a fixed slot beside the mascot's head (for example x 40–220, y 1150–1260). Fail the build if a mark's box overlaps the bounding box of the subject drawn in that scene. The same applies to the mascot body: shift the scene, not the mascot.
2. **When the voice says "look / watch / see", the thing is big within 0.3 s.** On those verbs the camera must already be on the detail, and the detail must fill 60 % or more of the frame. In practice, cut to the macro on the word instead of pushing in slowly on the whole object. Put the reveal inside 7–9 s, never at 10 s.
3. **Try-it tests get a clean stage.** Make the eye jump at least 1 000 px (dot at the bottom-left, target at the top-right). The title changes with the instruction ("Now: the clock"), the cue dot fades out, and captions and labels are hidden for 3 full seconds after the jump. Only the tested thing moves. Smaller items ride along with this rule: labels must never repeat the caption, and all on-screen numbers and units are 44 px or larger.
