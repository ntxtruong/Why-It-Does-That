# Episode 8 — claims table

Checked 2026-11-02. "Computed" = arithmetic done here.

| # | Claim | Value | Source | Confidence |
| --- | --- | --- | --- | --- |
| 1 | Consumer ovens run at a nominal 2.45 GHz; wavelength ≈ 12.2 cm | 2.45 GHz, 12.2 cm | Wikipedia "Microwave oven" (citing Litton Industries 1965); HyperPhysics "Microwave ovens" | High |
| 2 | Field oscillates 2.45 × 10⁹ times per second ("about two and a half billion") | — | computed from #1 | High |
| 3 | Heating = dielectric heating: polar molecules (mainly water) try to align with the alternating field; hindered rotation in the liquid dissipates energy as heat | — | HyperPhysics (citing Chaplin, LSBU "Water and microwaves"); Wikipedia (citing Zitzewitz, *Handy Physics Answer Book* 2011) | High |
| 4 | Water molecule is polar (O end partially negative, H end partially positive) | — | standard chemistry | High |
| 5 | 2.45 GHz is not a resonance of water; heating happens over a wide frequency range; first resonant peaks lie above 1 THz | — | Baird, "Why are the microwaves in a microwave oven tuned to water?" WTAMU (2014), citing Schmitt, *Electromagnetics Explained*; Wikipedia (also citing Soltysiak, Celuch & Erle, IEEE MTT-S 2011; Bloomfield, *How Everything Works*) | High |
| 6 | Liquid water's dielectric loss peaks near 19 GHz at 25 °C (≈ 10 GHz at 0 °C) | 19.3 GHz; ×7.9 vs 2.45 GHz | Chaplin, LSBU water structure data (complex permittivity page, τ_D ≈ 8.2 ps); Wikipedia (citing Chaplin 2012 for 0 °C) | High → "near twenty gigahertz, about eight times higher" |
| 7 | Higher frequency → shallower penetration; lower → deeper | — | Wikipedia (citing USDA FSIS 2022) | High |
| 8 | 2.45 GHz is an ISM band available worldwide (915 MHz only in some countries); FCC allocated 2450 MHz in 1946 | — | Wikipedia (citing All About Circuits "ISM bands"; FCC history) | High |
| 9 | Penetration depth (power to 37 %) at 2.45 GHz: water 45 °C 1.4 cm; meat 0.9–1.2 cm; raw potato 0.9 cm; bread 2–5 cm | ~1 cm typical | Püschner GmbH, "Penetration depths" table; HyperPhysics (water 25 °C ≈ 1.4 cm, Chaplin) | High → "one or two centimetres into most foods, most power gone" (after 2 depths 86 % absorbed, computed) |
| 10 | Interior heated by conduction from outer layer | — | Wikipedia (citing Püschner, FDA) | High |
| 11 | "Inside out" is a misconception; in most cases microwaves are absorbed in the outer layers | — | Wikipedia "Microwave oven" (flagged [citation needed] there) + #9 physics | High on physics, medium on Wikipedia sentence; script relies on #9 |
| 12 | Standing time / stirring lets heat spread | — | USDA FSIS "Cooking with microwave ovens" | High |
| 13 | Standing-wave hot spots ≈ λ/2 ≈ 6 cm apart; marshmallow/chocolate test gives c (remove turntable) | 6 cm | Stauffer, "Finding the speed of light with marshmallows", The Physics Teacher / ICPE newsletter 34 | High |
| 14 | Turntable / stirrer reduces unevenness; centre can remain a cold spot | — | Wikipedia (citing Williams LBNL 2012; Chen et al. 2016) | High |
| 15 | Ice barely absorbs 2.45 GHz: penetration depth ≈ 11 m at −12 °C | 1100 cm | Püschner table | High |
| 16 | Thermal runaway during thawing: melted regions absorb more | — | Standard food engineering (Datta & Anantheswaran, *Handbook of Microwave Technology for Food Applications*, 2001) | High |
| 17 | Defrost setting uses low (cycled) power to let conduction spread heat | — | Wikipedia "Microwave oven"; USDA FSIS | High ("usually by switching on and off" — inverter ovens lower power continuously) |
| 18 | Fats and sugars also absorb, less than water | — | Wikipedia (dielectric heating "water molecules, fats, and many other substances") | High |

**Misconceptions corrected:** (a) "microwaves cook from the inside out"; (b) "2.45 GHz is water's resonant frequency".

**Not claimed:** any safety statement about radiation or nutrients.
