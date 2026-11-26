# ep64 retro (ruler drop / reaction time, am_michael, 23.4 s, DO + COUNTDOWN, hook=try len=short look=boil, no mascot)
- Applied from ep61/58: one stage (ruler + two hands) to 19.7 s, every step a change ON the ruler; one right-hand label slot, out-before-in; Catmull-Rom camera; events on the word (drop just after "drops", strike on "not slow", flip from "This ruler", timer lands on "fifth", stamps at true 0.1/0.2 s); `hyperframes check` before snapshots (passed first time).
- Fact-check: "Most people ... at twenty" -> "Many people catch it around twenty" (SciAm ~15 cm typical); description says the delay is "mostly" not muscles.
- ASR: "Wait three tenths" heard "weight three ten" -> "Three tenths of a second". Still "tenths" -> "ten" (listen at 17.5 s).
- Timing: the first cut had "clock" at 10.1 s; hook hold 1.4 -> 1.0 s and the flip starts on "This ruler" (8.4 s), flash on "clock" 9.45 s.
- Own critic pass: label chips ran off the right edge (slot moved / sizes 54-84 px); motion smear at 2.8 s read as two rulers -> smear only during the fall; gold stamps struck through the time cards -> stamps on the tick side only; frame 0 had an empty lower half -> camera starts at 1.12x on the ruler.
- Boil: outlines (hands, ruler body, chips) re-jitter 12/s; ticks and numbers fixed, so the scale stays readable.
- zh dub: misaki zh G2P crashes on Arabic numerals with decimals ("0.3 秒", "20 公分是...") -> Chinese numerals in those zh lines.
- Checks: QC exit 0; 2 s pixel windows 11-32 %; loop frame diff 1.4 %; dubs ja/zh speed 1.0.
- Still weak: the real-g drop is ~6 frames (the slow-motion fall in "speed" carries it); eye/brain icons are small and simple; 20.3-21.9 s the ruler is off screen (only the question and the hand).
- Prediction: stayed 55-62 %, avg view 12-14 s. Reason: on-screen countdown gives an instant DO, 23 s, flip at 8.4 s; risk: viewers want to try with a real ruler and leave.

## Round 2 (review1 7.0/10, agents/review1-62-64.md)
- Kara captions moved to the TOP (y 56) so they never sit on ruler numbers; label slot y 330, timer moved to a fixed screen spot (840, 1320).
- Ruler widened 300 -> 380 px, time cards 48 -> 56 px; camera pushes into the ruler 1.22-1.5x through reveal and why (8.5-15.5 s) instead of pulling out to 1.0.
- Eye -> brain -> fingers now sits beside the ruler under the same camera (eye/brain glow as the pulse passes, "brain" written inside the blob), the pulse ends in the fingertip; 0.20 card ring pulses 12-13.3 s.
- Wrong-guess label "slow hand?" -> "muscles?" (no shared words with "It's not slow fingers."). Frame 0 camera shifted so "Catch it!" and the ring clear the ruler; "0.3 s = 44 cm" moved beside the ruler.
- Narration unchanged, so subtitles, translations and dubs are unchanged. QC exit 0; pixel windows 0-16 s: 10-46 %; loop diff ~2 %.

## Round 3 (review2 6.5/10, agents/review2-62-64.md)
- 3-8 s motion: an orange "fallen distance" band grows down the ruler from the pinch (3.0-4.3 s), the caught ruler swings like a pendulum (slower decay), "20" swells and turns orange on "twenty" (5.75-6.6 s), plus the push-in; 0.5 s pixel diffs 6-21 % across 3-8 s.
- Caption gaps under 1.7 s are now bridged (build.js), so the top bar carries "the instant it drops." until "Many people catch" (no empty bar at 3 s).
- Reveal/why camera frames the whole caught ruler (1.2x, top >= y 250, 0.10 s card above y 1500): no label under the caption bar or at the bottom edge; the ghost ruler and the dashed 44 cm extension are clipped below y 215.
- Ruler 380 -> 460 px wide; "muscles?" 70 px at x 830 (margin), "seconds" 52 px beside the ruler, "= 44 cm" rides next to the 0.3 s ghost stamp; ruler returns at 20.6-21.4 s so the end is not empty; timer box no longer lingers as an empty pill.
- Narration, subtitles, translations and dubs unchanged. QC exit 0; 2 s windows 0-16 s: 10-47 %; loop diff 2.6 %.

## Round 4 (review3 7.5/10, agents/review3-63-64.md)
- "Centimetres?" moved to the empty caption band at the top (y 150), off the ruler's time labels.
- "and it's gone": after the fingers miss, the ruler keeps sliding slowly (tau +0.04/s) while the camera follows it down, with the 0.3 s / "= 44 cm" mark and the stamps in view; it flies back up from there at 20.6 s (no empty frame).
- Chips 50-72 px (eye, "seconds", timer), pulse line 14 px; "fingers" chip -> "move!" (no caption repeat).
- Not changed: the clean try-it stretch after the countdown is ~1.4 s; making it 3 s would push "clock" past 9 s (the 7.5-9 s event rule), so I kept the timing.
- Narration, subtitles, translations, dubs unchanged. QC exit 0; 2 s windows 0-22 s: 10-48 %; loop 2.6 %.
