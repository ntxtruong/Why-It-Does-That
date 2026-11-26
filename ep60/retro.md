# ep60 retro (brain freeze, bella_heart, 29.2 s, WEIRD hook)
- Applied from ep55/56/57 retros: label slots checked for crossfades, pop-mark zone (x 220-360, y 950-1080) kept off the chart, no 1e9 sentinels, reveal planned inside 7-10 s (lands at 7.2 s, clamp at ~8.9 s).
- Critic pass 1 (snapshots): head looked bald and the neck ended in a flat cut mid-frame -> hairline ellipse, neck runs under the captions; head sat on the mascot -> head shifted right 25 px; "over 30 s / under 5 s" hid under the kara box and the "?" mark sat on the slow bar -> chart raised and moved right; the cone covered "27%" -> bars shortened.
- Pass 2 (encoded file): picture ran AHEAD of the voice: vessels clamped at 7.7 s and flooded at 9.2 s while the caption still said "clamp shut" -> re-timed to the spoken words (clamp 8.7 s, flood 9.9 s); "blood vessels"/"clamp shut" and "one nerve"/"felt here" shared a slot while crossfading -> out-before-in.
- Fact check: added the person-sized stake from a real trial (BMJ 2002: 27 % vs 13 %, RR 2.2, 145 pupils) instead of the artery detail; the tongue fix is advice without a trial, so "Doctors suggest". ASR: 0/86 differences.
- Still weak: the nerve scene (11.5-17 s) changes only by small pulses (moving px 5 %); the fast/slow chart is a diagram.
- Do better next time: time every visual event from the word's position in the beat (char share of the beat), not from round numbers, BEFORE the first snapshot; a 2-frame check at each event's word is cheaper than a re-render.
- Prediction: stayed 55-60 %, avg view 12-14 s. Reason: everyone has had brain freeze (Body pillar holds best), frame 0 is a face + cone and the pain flash lands at 1.5 s, the 27 % vs 13 % stake and a fix the viewer can use carry past 14 s; risk: the topic is common and the middle is diagrammatic.

## Round 2 (cold review 5/10 -> self-score 7/10 against the review checklist)
- P0 fixed: frame 0 is now the weird result at its peak: wincing face, a waffle cone with a scalloped, dripping scoop half inside the open mouth (scoop drawn outside the face and darker through the mouth gap), pain burst already on the forehead; the scoop stays in the mouth while the voice says "in your mouth".
- P1 fixed: the 7-11 s reveal now happens inside the head: push-in to x2.2-2.7 on the roof of the mouth (lips, tongue, brain edge in frame), ONE big vessel in the palate squeezes shut then bulges open with blood cells speeding up, the scoop pressed under it; the x-ray head keeps a skin tone instead of the sudden brown silhouette; nerve 16 px with a 30 px glow; "starts here" 56 px.
- P2 fixed: "x2.2" -> "more than 2x"; bar values no longer roll (a gulped bar passing "12 %" read as smaller than slow); "blood vessel" label on screen from the first frame of the scene; the end scene brings the cone back into the mouth and the wince + burst in the last 0.4 s, so the loop is exact; pop marks moved off the head (mx 80, my 880).
- Checklist: frame 0 at 120 px reads as "ice cream + pain"; head on screen 0-17 s; motion every 2 s yes (lick, frost, vessel, pulses); text >= 44 px, lines >= 8 px; ASR 0 diffs; QC exit 0.
- Still weak: the fast/slow chart (17-21 s) is the one scene without the head (lit 18 %); the long neck column.
- Lesson: draw frame 0 as the RESULT (wince + burst + scoop in mouth), not the moment before it; and explain inside the object (zoom into the head) instead of cutting to an abstract strip.

## Round 3 (review2 7.5/10 -> self-score 8/10)
- Pop marks moved to a fixed slot beside the mascot's head (mx 62, my 1290), so they are off the head and the vessel in every scene.
- Labels no longer repeat the caption. "roof of your mouth" and "roof of the mouth" are dropped (the arrow stays); "blood vessel / clamps shut / floods open" became "cold / narrows / rebounds"; "one nerve" became "trigeminal nerve"; "more than 2×" became "twice as often"; "warms the roof" became "heat in".
- Cheap P2: the nerve now runs 3 bright pulses that repeat every second (the 12-14 s window was the stillest in the batch).
- Lesson: give pop marks a home slot in the layout constants on day one. Anchoring them to the mascot's head put them on the subject in every scene where the subject is large.
