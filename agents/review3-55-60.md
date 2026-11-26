# Review round 3: Shorts 55–60 (independent, judged only on what a viewer sees)

Reviewer: a fresh agent that did not see the build. I scored all six before I read rounds 1 and 2.
Method: frames every 0.5 s for 0–15 s and every 1.5 s after (`/tmp/rev3/sheetA_NN.png`, `sheetB_NN.png`). I checked frame 0 at thumbnail size, and checked full-res frames against a 40 px red bar (`/tmp/rev3/full/m1-3.png`). I measured motion as the pixel change at 10 fps in the subject area, with the caption and mascot band left out (`/tmp/rev3/motion.py`). I timed the push-in after look/watch/see to 0.1 s, and the ep 58 second-hand ticks and clean window to 0.1 s. Narration came from `subtitles.srt`; I could not hear the audio. Sheet B times are ±0.75 s.

## Scores

| Ep | Topic | Score | Upload-ready? | Reason |
|---|---|---|---|---|
| 55 | Cat eyes glow | **7.5** | yes | Strong frame 0, wrong guess and reveal at 8 s. The cross-section sits still for 2 s right after the reveal, and labels repeat the captions |
| 56 | Pen cap hole | **7.5** | yes | The push-in lands before "See the hole?". The stake (windpipe) arrives at 8.5 s. The "test ring" still does not read as a ring |
| 57 | Wooden spoon | **7** | yes | Fixed since round 2: it cuts to the macro on "Watch" (7.7 s) and the foam is at the rim at 0 s. Frame 0 shows no oddity yet, the spoon leaves the screen at 13.5–15.5 s, and the ending question is vague |
| 58 | Stopped clock | **7** | yes | Fixed since round 2: the eye jump is now about 1,240 px with 3.0 clean seconds. It is the emptiest frame of the six (the clock fills about 20 % of the area) and the labels repeat almost every caption |
| 59 | Falling cat | **7.5** | yes | Clear story and the best frame fill. The 1894 photo inset is small and slow (4.5–7 s), and the reveal comes at 9.5 s |
| 60 | Brain freeze | **7.5** | yes | Strong frame 0, and the clamp then flood lands at 7–11 s. The push-in comes 0.4 s after "Look" and the chart scene is sparse |

**No P0 in any video.**

## Checklist

| Check | 55 | 56 | 57 | 58 | 59 | 60 |
|---|---|---|---|---|---|---|
| Frame 0 at 120 px: object + oddity | pass | pass (arrow on the hole) | partial (pot and foam at the rim, spoon floating; nothing odd yet) | partial (try-it instruction, no oddity; fine for a try-it hook) | pass | pass |
| 0–3 s narration matches screen | pass | pass | pass (spills at 2.5 s on "boil over") | pass | pass | pass |
| Hook object on screen 7–15 s | pass (eye cut open) | pass (cap in windpipe) | partial (no spoon at 13.5–15.5 s) | pass | pass | pass (head/palate; the cone is gone) |
| Motion on the object in every 2 s window, 0–15 s | **fail at 9.4–11.4 s** (10.5–11.0 near zero) | pass (9.0–10.0 still, 1 s only) | pass | pass (the second hand ticks every 1.00 s, on purpose) | weak at 4.5–7.0 s | weak at 6.0–7.0 and 12–14 s |
| look/watch/see → ≥ 60 % within 0.3 s | n/a | pass (push-in done by 2.4 s, "See" at 2.39 s) | pass (cut at 7.7 s, "Watch" at 7.82 s) | n/a (illusion) | n/a | borderline (push 5.1–5.6 s, "Look" at 5.20 s → 0.4 s) |
| Reveal at 7–9 s | pass (8.0 s) | pass (8.5 s) | pass (7.7 s) | partial (7.0 s is a text label; the "OFF" blackout comes at 11 s) | late (9.5 s) | pass (7–9 s clamp) |
| Text ≥ 40 px, lines ≥ 8 px | pass | pass | borderline ("foam stays below the spoon", about 21 s) | fail: "time →" about 35 px and grey; the eye-path line at 1.5 s and 24 s is about 3 px | pass ("frame 2 / 6" about 40 px); dashed body axes thin | fail: "over 30 s / under 5 s" about 35 px |
| Labels don't repeat captions | fail (several) | partial | partial | **fail (most scenes)** | partial | partial |
| Mascot / pop marks off the subject | mostly | "!" touches the cap edge at 2.0–3.0 s | mascot next to the macro bubbles at 10–10.5 s | n/a | pass | pass |
| Ending question on topic, clear alone | pass ("Green or gold?") | pass ("Cap chewer: yes or no?") | weak ("Wooden spoon or metal spoon?": which you use? which works?) | pass | pass | pass (weaker without "ice cream") |
| Loop | pass | pass | pass | pass ("Stare at the dot" returns) | pass | pass |
| Illusion: jump ≥ 1,000 px, then ≥ 3 clean s | — | — | — | **pass** (dot about (157, 1577) → clock about (718, 470) ≈ 1,240 px; screen clean 1.8–4.8 s) | — | — |

## Findings

### 55 Cat eyes glow (7.5)
- **P1 · 9.4–11.4 s**: the eye cross-section does not move (pixel change near zero at 10.5–11.0 s) while the voice names "tapetum lucidum". This is the weakest 2 s window in the batch, and it sits right at the 10 s wall. **Fix:** start the light dot entering through the lens at 9.5 s instead of 11.5 s, or make the mirror layer shimmer from 9.5 s.
- **P1 · 9.0–16.5 s**: the labels repeat the captions. "a MIRROR behind the retina" sits over "a mirror layer", "tapetum lucidum" (green chip) sits over "the tapetum lucidum.", "light slips past the retina" over "Light that slips past", and "some escapes, back to your light" over "Some of it escapes". **Fix:** keep only the short part labels on the drawing ("mirror", "retina", "caught") and delete the top-band labels that restate the caption.
- **P2 · 7.5 s**: the caption is still fading in while it is spoken ("Behind the retina sits" shows at about 30 % opacity). **Fix:** show it at full opacity on the first syllable.
- **P2 · 21–22.5 s**: the "you need 6 / a cat needs 1" bulbs are fine, but the cat icon is stacked under the human face. **Fix:** put them side by side.

### 56 Pen cap hole (7.5)
- **P2 · 3.5–5.5 s**: the diagonal pen is about 35 % of the frame and the top half is empty. **Fix:** scale the pen ×1.6, crossing the frame corner to corner.
- **P2 · 6.0–8.0 s**: "chomp, chomp…" but the cap barely moves. **Fix:** make it bob twice in time with the text.
- **P2 · 10.5–13 s**: the label "air squeezes through the hole" repeats the caption "the hole still lets air through". **Fix:** replace it with an arrow and a single word, "air".
- **P2 · 21–22.5 s**: "won't fit through 16 mm" and "test ring" sit over a grey arc under the cap, so no ring is visible. **Fix:** draw a full 16 mm ring and drop the cap onto it so it visibly sticks.
- **P2 · 2.0–3.0 s**: the "!" mark touches the left edge of the cap in the close-up. **Fix:** move it into the slot beside the mascot.

### 57 Wooden spoon (7)
- **P1 · 0.0 s**: at 120 px, frame 0 shows a pot with foam at the rim and a spoon floating above it. Nothing is odd yet, and the title "Watch what this spoon does" is a tease. **Fix:** at frame 0, show the foam already climbing over one side, with the spoon mid-drop and its shadow on the foam. That is the moment just before the trick.
- **P2 · 13.5–15.5 s**: a starch bubble fills the frame and the spoon is gone. **Fix:** keep a strip of wood at the top of the starch close-up, as in the 8–13 s macro.
- **P2 · 18 s**: the label "spoon breaks the top" repeats the caption "The spoon breaks the top". **Fix:** drop the label; the bursting row already shows it.
- **P2 · ~21 s**: "foam stays below the spoon" is small (about 40 px or less) and touches the mascot. **Fix:** set it at 44 px or more under the box.
- **P2 · 28.5 s ending**: "Wooden spoon or metal spoon?" does not say what is being chosen. **Fix:** "Which spoon do you stir with: wood or metal?"

### 58 Stopped clock (7)
- **P1 · whole video**: the clock is about 520 px wide on a 1080×1920 frame, roughly 20 % of the area, and the rest is plain purple. It is the least-filled video of the six and goes against v5 rule 4. **Fix:** after the clean test window (from 4.8 s), push in until the clock fills 80–90 % of the width, and place the labels inside the purple border band.
- **P1 · 5–24 s**: almost every label repeats its caption: "the video didn't lag" / "The video didn't lag.", "as if you'd been looking all along" (label and caption at the same moment), "up to ½ second longer" / "It can feel up to half a second longer", "about 3 every second" / "three times a second". **Fix:** use the label slot for the visual proof only (tick bar, REAL/FELT boxes, jump counter) and drop the restated sentences.
- **P1 · 7–9 s**: the "second event" at the wall is only a text label ("the video didn't lag"). The strong event, the "OFF" blackout, comes at 11 s. **Fix:** move the blackout to 8.5 s ("While your eyes jump" starts at 8.56 s) and shorten the tick-bar beat.
- **P2 · 13 s**: "time →" is about 35 px and grey on purple. **Fix:** 44 px, ink colour.
- **P2 · 1.5 s, 24 s**: the eye-path guide line is about 3 px. **Fix:** 8 px or more.
- **P2 · ~18 s**: the "+ borrowed" chip slides over the REAL/FELT boxes during its transition. **Fix:** bring it in from above, clear of the boxes.

### 59 Falling cat (7.5)
- **P2 · 3.5–9.0 s**: the sepia photo panel is about 45 % of the width, and motion inside it is low at 4.5–7.0 s. **Fix:** scale the panel to 75 % of the width and flip frames every 0.5 s.
- **P2 · 9.5 s**: "It did not." and "the photos proved them wrong" land at 9.5 s. **Fix:** shorten "In 1894, scientists thought it cheated, pushing off the hand" by about 0.7 s so the reveal lands at 8.8 s or earlier.
- **P2 · 10–12.5 s**: "bend at the waist" restates "It bends in the middle". The dashed body axes are thin (about 4 px). **Fix:** remove the label and make the axes 8 px.

### 60 Brain freeze (7.5)
- **P2 · 5.1–5.6 s**: the push-in to the palate finishes 0.4 s after "Look" (5.20 s). **Fix:** hard-cut on the word.
- **P2 · 6.0–7.0 s and 12–14 s**: low motion (the palate hold; the nerve diagram). **Fix:** run a pulse along the nerve once a second, and add a cold shimmer on the palate at 6 s.
- **P2 · 16.5–19.5 s**: the chart scene is sparse (two small cones, bars about 25 % of the frame), and "over 30 s / under 5 s" is about 35 px. "twice as often" repeats "more than doubled". **Fix:** make the bars twice as tall, set the sub-labels at 44 px and drop "twice as often".
- **P2 · 21–22.5 s**: the "tongue up / heat in" chips sit on the red pain burst. **Fix:** move them to the palate, where the action is.
- **P2 · ending**: "Fast eater or slow?" works with the cone on screen. "Ice cream: fast or slow?" would read on its own.

## Score table across rounds

| Ep | Round 1 | Round 2 | Round 3 (this) |
|---|---|---|---|
| 55 Cat eyes | 6 | 8 | 7.5 |
| 56 Pen cap | 6 | 7 | 7.5 |
| 57 Wooden spoon | 5 | 6 | 7 |
| 58 Stopped clock | 6 | 6 | 7 |
| 59 Falling cat | 6 | 8 | 7.5 |
| 60 Brain freeze | 5 | 7.5 | 7.5 |
| P0 count | 5 | 0 | 0 |

**Confirmed fixed since round 2:**
- 58: the jump is now about 1,240 px (was about 700), and the screen stays clean for 3.0 s after it.
- 57: it cuts to the macro on "Watch", and the foam sits at the rim before it spills.
- 59: the photo-reveal caption is in.
- Pop marks: mostly moved off the subjects.

**Still there:**
- Labels repeating captions in every video.
- The small static mascot.
- No real footage.

## What still limits all six (the ceiling of this drawn template)

1. **Same frame grammar in every video.** Each one has a title box top-left, a caption box at mid-low, a 13 %-wide mascot bottom-left that reacts only through a small bubble, a dark gradient, and flat vector shapes. A viewer who has seen one has seen the layout of all six. Fixes inside this template move a video from 6 to about 7.5. Getting past roughly 8 needs a change of template, not a fix round.
2. **Two text layers saying the same thing.** Every scene has a top label plus a burned-in caption, and they often say the same words. Eye time goes to reading twice instead of watching the object.
3. **The explanation is a diagram, never the thing.** Cross-sections, windpipes, timelines and charts are honest but abstract. No video shows a real cat's eye, a real pot or a real cap; v5 rule 3 (a phone clip in 0–3 s) has not been used once.
4. **Motion inside explanation scenes is "slide-like".** Scenes change at cuts, then hold. The 2 s windows that fail or come close (55 at 9.4–11.4 s, 60 at 12–14 s, 59 at 4.5–7 s) are all holds inside a diagram.
5. **Frame fill is good on objects and poor on data.** Clock, chart and photo-inset scenes fall to 20–45 % fill.
6. **Unverifiable here:** sound effects and voice. Each video has many "pop" moments that only work if the audio lands them.

## Top 3 for ep 61+

1. **Shoot the hook for real.** Ask Trường for a 3–5 s vertical phone clip of the object (cat eyes in torchlight, a pot boiling over, a cap against a window) for 0–3 s, then match-cut into the drawing. This is the one v5 rule not yet tried, and the only lever above the template's ceiling.
2. **One text layer.** Burned-in captions carry the sentence. On-screen labels are only 1–2-word part names, numbers or a struck-out guess, and the build fails when a label shares 3 or more words with the caption shown at the same time.
3. **Explain inside a filled, moving object.** Every explanation scene keeps the hook object at 60 % fill or more (this includes clocks, charts and photo panels) and has continuous micro-motion: a travelling particle, a pulse or a counter. Check it with a pixel-change test that fails any 2 s window under a set threshold, not by eye. Put the strongest visual event (blackout, burst, flip) at 7.5–9 s, not a text label.
