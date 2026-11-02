# Episode 6 (Short, 1080×1920) — STORYBOARD

**Logline:** A hotter pan makes a water drop last longer, because the drop's own steam lifts it off the metal and insulates it.

**World:** Brand kit v2 (navy `#18264F`, gold accents). Vertical frame, one giant side-on cross-section of a single drop on a pan surface, filling the upper 70 % of the frame. Pan metal drawn as warm layered strata whose colour encodes temperature (quiet blue-grey → coral → gold glow edge, no neon). Steam drawn as thin `blue` flow lines (≈ 300 tracer dots on analytic streamlines, lubrication-flow profile).
**Colour arc:** cool grey pan / quick coral hiss → gold-hot pan with calm blue cushion → back to coral collapse at the end.
**Recurring motif:** a vertical "thermometer bar" on the left edge that drives the whole film; every state change is triggered by its level crossing a gold tick labelled "≈ 200 °C".
**Character:** the new chibi (`chibi3()`, from `brand/channel.html`) appears only at the bottom-left of shots 1 and 5, holding a spatula, reacting (lean-in at the float, wince at the collapse). Kept out of the bottom 20 % and right edge (Shorts UI safe zone) — chibi sits at 62–78 % height.
**Different from ep 1–5:** single macro cross-section with a live temperature control (ep 1–5: ray diagrams, sky panorama, strobe wheel, top-down road, pressure dots + oscilloscope).

**Simulation (deterministic, closed form):** drop shape = static Leidenfrost puddle profile precomputed once at load (Young–Laplace integration with fixed step, capillary length 2.5 mm); vapour gap h(r) from the Burton 2012 neck/pocket shape (parametric fit); streamlines are a radial Poiseuille profile u(r,z) ∝ z(h−z)·r; tracers advected analytically by phase = (t·speed) mod length. Below-threshold: contact boiling shown as nucleating bubbles at fixed seeded positions (hash of index, no Math.random), drop radius shrinking as r(t)=r0·(1−t/τ)^½ with τ = 0.8 s. Above: radius shrinks with the Biance 2003 lifetime law, sped up and labelled "time ×30".

## Shots

| Shot | Time | In | Event | Reads | Out |
| --- | --- | --- | --- | --- | --- |
| 1 | 0:00–0:05 | cold open on a falling drop | Drop falls into frame onto a pan; question text top third | (1) the question | splash spray freezes into the cross-section |
| 2 | 0:05–0:11 | match cut (splash → section) | Thermometer at ~130 °C: drop flattens, bubbles nucleate, gone in 0.8 s; "≈ 1 s" timer | (1) warm pan: vanishes fast | timer resets; thermometer climbs |
| 3 | 0:11–0:18 | carry: thermometer rises past gold tick | New drop lands, rounds up, skates sideways; timer runs "1:00+" (time ×30 label) | (1) hotter pan (2) lasts much longer | camera dives under the drop |
| 4 | 0:18–0:30 | push-in under the drop | Gap opens: blue steam lines stream out from beneath; scale bar "≈ hair's width" with a hair silhouette for scale | (1) steam under the drop (2) gap is tiny (3) no contact | pull back |
| 5 | 0:30–0:40 | pull-back carry | Heat arrows from pan stop at the blue layer (dimmed); drop glides with zero-drag trail; chibi leans in | (1) steam insulates (2) no friction → glides | text "LEIDENFROST EFFECT · 1756" slides on with the drop |
| 6 | 0:40–0:50 | cut on action (drop exits frame, re-enters) | Thermometer drops below tick: gap thins to zero, bubbles burst, drop gone; chibi winces | (1) cooler → cushion collapses (2) boils away | drop silhouette returns to frame top = first shot rhyme |
| 7 | 0:50–0:55 | match to shot 1 | New drop hovering, question "What else floats on its own steam?" | (1) closing question | loop point back to shot 1 |

On-screen text: question (shot 1), "≈ 1 s" vs "1:00+" timers, "≈ 200 °C" tick, "≈ hair's width", "LEIDENFROST EFFECT · 1756", closing question. Nothing else.

**Trường's angle (optional):** shot 6 can be replaced by his own cooking clip of drops dancing on his pan, if he wants.
