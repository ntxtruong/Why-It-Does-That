# Episode 8 — STORYBOARD

**Logline:** A microwave shakes water molecules, but only in the outer centimetre or two, inside a box full of fixed hot and dead spots; that is why the middle is cold and why the turntable exists.

**World:** Brand kit v2. The inside of a microwave oven drawn as a dark navy cavity with panel-coloured walls; food as a cut-away slab (lasagne layers) that can be seen in section. Field strength drawn as a 2-D heat map of soft gold contour bands (never neon); individual water molecules in close-ups as small V shapes (blue O, ink H) that rotate.
**Colour arc:** cold blue food in a dark box → gold energy bands → coral heat creeping inward → a blue "cold core" that shrinks only slowly → final balanced warm.
**Recurring motif:** the *thermal cross-section bar*: a vertical slice through the food appears at each chapter end, coloured by temperature, so the viewer watches the cold core shrink (or not).
**Character:** chibi3 (Trường-style chibi) in the kitchen at the left, fork in hand; reacts to the cold bite (hook) and the runaway thaw (ice chapter).
**Different from ep 1–7:** a 2-D wave-field heat map and a molecular close-up; the camera moves between three scales (oven → slab → molecules). Ep 5 used waves too, but as 1-D pressure dots; here the field is a standing-wave map plus heat diffusion.

**Simulation (deterministic, closed form / precomputed at load):**
- Field: standing-wave modes of a rectangular cavity, |E|² = Σ a_mnp sin²(mπx/a) sin²(nπy/b) with fixed mode amplitudes chosen so the spots are ~6 cm apart at the cavity scale; turntable = rotate food coordinates by ωt and sample |E|².
- Absorption: P(z) = P₀·e^(−z/δ), δ = 1 cm (labelled "~1–2 cm").
- Heat: 1-D/2-D diffusion precomputed once at load on a fixed grid with a fixed time step into a lookup table T(x, z, t); frames only interpolate the table (no per-frame integration).
- Molecules: angle θ(t) = θ₀ + A·sin(2πf′t − φ) with f′ a slowed display frequency and a lag φ; neighbours drawn with small coupled offsets (seeded hash, no Math.random).
- Thaw runaway: absorption coefficient switches from ice (δ = 11 m) to water (δ = 1 cm) per cell when T > 0 °C, precomputed with the same table.

## Chapters

| # | Chapter | Time (est.) |
| --- | --- | --- |
| 1 | Hook — the cold middle | 0:00–0:50 |
| 2 | What the waves do | 0:50–2:00 |
| 3 | Not a water frequency | 2:00–3:00 |
| 4 | Only skin-deep | 3:00–4:05 |
| 5 | Hot spots and the turntable | 4:05–5:20 |
| 6 | Frozen food | 5:20–6:15 |
| 7 | Trường's angle (optional) + payoff | 6:15–6:55 |
| 8 | End screen | 6:55–7:15 |

## Shots

| Shot | Time | In | Event | Reads | Out |
| --- | --- | --- | --- | --- | --- |
| 1.1 | 0:00–0:05 | cold open | A fork pulls a bite from the middle of lasagne; question on screen; blue "cold" tint in the bite | (1) the question | camera pulls back through the oven door |
| 1.2 | 0:05–0:25 | carry through door | Timer "3:00" spins down; edges bubble (coral), centre stays blue | (1) hot edges (2) cold middle | myth cards slide in |
| 1.3 | 0:25–0:50 | wipe by card | Two myth cards "INSIDE OUT?" "WATER FREQUENCY?" both stamped with a coral ✕; turntable spins | (1) two myths (2) promise: cold middle, hot spots, defrost, turntable | dive into the magnetron |
| 2.1 | 0:50–1:15 | dive | Magnetron emits a wave; ruler shows "≈ 12 cm" wavelength | (1) microwaves (2) 12 cm | wave arrow becomes a field arrow |
| 2.2 | 1:15–1:35 | match (arrow) | Field arrow flips; counter "2.45 billion / s" | (1) field flips back and forth | zoom into food |
| 2.3 | 1:35–2:00 | push into molecules | Water V-molecule with − and + ends turns with the field; in a crowd it lags and bumps; coral heat haze | (1) polar molecule (2) lags → jostling = heat | pull out to spectrum |
| 3.1 | 2:00–2:30 | morph molecules → absorption curve | Smooth broad absorption curve for water, peak at "≈ 20 GHz", oven marker at 2.45 GHz on the shoulder | (1) broad, no sharp line (2) peak 8× higher | slab enters at two frequencies |
| 3.2 | 2:30–3:00 | split screen | 20 GHz: energy gone in a thin skin, top burns; 2.45 GHz: deeper band; "ISM band" tag | (1) too high → surface only (2) 2.45 = compromise + allowed band | right half expands |
| 4.1 | 3:00–3:25 | expand | Energy decays into the slab: bar e^(−z/δ) with "~1–2 cm" bracket | (1) only outer layer | heat starts creeping |
| 4.2 | 3:25–3:50 | time-lapse | Coral heat diffuses inward slowly; cold core lingers; "3:00" ends with core still blue | (1) conduction is slow (2) the cold middle | thin vs thick |
| 4.3 | 3:50–4:05 | wipe | Thin pizza slice heats through; thick rice lump keeps core; stir/stand arrows | (1) thickness matters (2) stand time spreads heat | camera rises above the cavity |
| 5.1 | 4:05–4:30 | crane up | Waves bounce in the box; standing-wave heat map appears with fixed gold spots | (1) bounce (2) add/cancel → fixed pattern | ruler between spots |
| 5.2 | 4:30–4:50 | carry | Ruler "≈ 6 cm = ½ wavelength"; marshmallow plate with melted spots | (1) spot spacing (2) you can test it | equation slides on |
| 5.3 | 4:50–5:05 | — | "6 cm × 2 × 2.45 GHz ≈ 300,000 km/s" | (1) speed of light | turntable starts |
| 5.4 | 5:05–5:20 | cut on action | Turntable rotates food through the map; time-averaged map evens out except the centre | (1) turntable averages (2) centre still weak | freeze-frame frosts over |
| 6.1 | 5:20–5:45 | frost transition | Ice crystal lattice, molecules locked; waves pass straight through | (1) ice barely absorbs | one corner melts |
| 6.2 | 5:45–6:05 | push-in to corner | Melted corner glows, absorbs more, melts more: runaway; chibi winces | (1) runaway | power bar pulses |
| 6.3 | 6:05–6:15 | match to power bar | Defrost: power on/off, heat spreads between pulses | (1) defrost = pauses for conduction | back to lasagne |
| 7.1 | 6:15–6:30 | — | Trường's angle (optional) | — | — |
| 7.2 | 6:30–6:55 | callback to 1.1 | Same bite, now with the cross-section bar: outer heat, slow core; ring-shaped plate hint | (1) answer recap | end card |
| 8 | 6:55–7:15 | — | End card: chibi left, right two thirds free; closing question | (1) comment question | — |

**On-screen text:** opening question, "INSIDE OUT?", "WATER FREQUENCY?", "≈ 12 cm", "2.45 billion / s", "≈ 20 GHz", "2.45 GHz", "~1–2 cm", "≈ 6 cm = ½ wavelength", the speed-of-light line, labels (magnetron, ice, water).
**Promise:** cold middle explained at 3:25–3:50; turntable at 5:05.
