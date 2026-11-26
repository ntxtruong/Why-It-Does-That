# ep57 retro (wooden spoon vs boil-over, bella_sarah, 32.1 s, WEIRD + DO hook)
- Critic pass 1 failed: (a) end scene showed NO foam: `cap` default 1e9 marked every bubble "above the spoon" and hid it -> default -1e9 (a sentinel bug only a frame check finds); (b) spoon bowl ran off the right edge -> shorter handle; (c) pot bottom sat under the mascot -> pot raised 40-50 px; (d) bursts were thin white rings, invisible at phone size -> 8 px ring + gold rays.
- Pass 2: the 7-10 s reveal zoom was gold confetti (every bubble bursting every frame) and bubbles drawn ABOVE the spoon (contradicted the point) -> bursts staggered (30 % of the time), touching bubbles squashed under the wood, zoom 2.7 -> 2.2.
- Pass 3 (after re-voicing): "spoon breaks the top" crossfaded over "chain reaction" (two labels at once) -> first label leaves before the second; the big starch bubble read as a dark hole -> light inner gradient.
- ASR caught "Lay a wooden" -> "leia wouldn't" and "pasta starch" -> "postastarch": reworded to "Put a wooden spoon" / "Starch from the pasta"; only neighbours/neighbors remains (spelling).
- Fact check changed wording: no "hydrophobic" (no source), no temperatures or times; "cooler + porous/dry" and "buys time" are what the sources say.
- Still weak: the guess-scene push-in is ~60 % steel pot wall; the macro "pop" scene is the real reveal but lands at 9.9 s (edge of the window).
- Do better next time: keep the reveal visual inside the guess scene's second sentence (it worked: push-in at 7.8 s), and budget the hook sentence to <= 4.5 s so the macro lands by 9 s; grep scenes for 1e9/-1e9 sentinels before the first snapshot.
- Prediction: stayed 52-58 %, avg view 11-13 s. Reason: overflowing pot + hovering spoon at 0 s is a familiar kitchen moment with an open "does it work?" loop, and the payoff (foam backs off) is shown at 3-5 s; risk: the trick is widely known, and 32 s is long.

## Round 2 (cold review 5/10 -> self-score 7/10 against the review checklist)
- P0 fixed: 3.5-8 s no longer sits still: the camera pushes into the spoon from 3.6 s and stays there through the guess scene; bubbles touching the wood burst every ~0.5 s (pop SFX on each); "pressing it down?" is crossed out over the close-up instead of a flat pot.
- P1 fixed: frame 0 = foam at the rim and rising, it spills at ~1 s (matches "about to boil over"); bursts are now a white 3-frame flash + 12 px ring + gold rays + droplets; the starch bubble is see-through on a light starchy-water background with a yellow skin that wraps round it (no more "meatball"), with the spoon bar on top for context; the chain reaction now stops at the spoon line (lower foam stays, label "foam stays below the spoon"); ending "Wood or metal?" (sourced: wood outlasts metal); starch line shortened, 32.1 -> 30.8 s.
- P2: pop marks moved off the pot (mx 75, my 900 via new MASR override); captions now appear at 60 % opacity at the first syllable (0.06 s tween instead of 0.16 s from 0).
- Checklist: frame 0 object + odd thing visible at 120 px yes; hook object (spoon/pot) on screen 0-15 s yes (macro beam = the spoon, starch scene keeps the spoon bar); motion every 2 s yes; text >= 46 px; ASR 1 diff (neighbours spelling).
- Still weak: the close-up at 4.5-9.9 s is ~55 % steel pot wall; template look (dark maroon, small mascot) unchanged.
- Lesson: a reviewer finds "still" stretches that my critic missed because I checked scene starts, not every 2 s window; and "visible" effects (pops) must be bold enough for a 200 px contact sheet, not just for the 1080 px frame.

## Round 3 (review2 6/10 -> self-score 7.5/10)
- The 7-10 s beat is now on screen: a hard cut on the word "Watch" (7.8 s) goes to the spoon's underside macro (the wood band and the bubbles fill about 70 % of the frame), and a big centred bubble bursts at 8.0 s (white flash, pop and thud). The macro carries on into the "dry, cooler wood" scene, so the reveal starts at 7.8 s, not 9.9 s. Macro bubbles are kept at x > 360, clear of the mascot.
- Frame 0 now matches "about to boil over": the foam rises to the rim, the first drips come at ~2 s, and the loop ends on the same state (no spill).
- The ending question is clear on its own: "Wooden spoon or metal spoon?" (re-voiced, ASR ok; updated in the subtitles, 7 translations, metadata and pinned comment). It is 31.5 s.
- Pop marks now sit in a fixed slot beside the mascot (mx 62, my 1290), never on the pot. The "foam stays below the spoon" label sits under the cross-section box.
- Lesson: when the voice says "watch", cut to the detail on that word. A slow push-in on the whole object leaves the payoff in a 10 % strip.
