# Episode 19 (Short) — claims table
Checked 2026-11-07. "Computed" = arithmetic done here.

| # | Claim | Value | Source | Confidence |
| --- | --- | --- | --- | --- |
| 1 | Sunlight is a mix of all colours | — | NOAA NESDIS | High |
| 2 | Air molecules scatter blue about 6× more than red | (700/450)^4 = 5.9; optical depths 0.2211/0.0364 = 6.1 | Bodhaine et al. 1999 (as ep 2) | High |
| 3 | Sunset path crosses about 38× more air | relative air mass ≈38 at the horizon | Kasten & Young 1989 | High |
| 4 | Clean air: < 1/1000 of blue survives, ≈ 1/4 of red | e^(−0.2211·38) = 0.0002; e^(−0.0364·38) = 0.25 | Computed (Rayleigh only, sun on the horizon) | High (said "even in clean air": dust lowers both) |
| 5 | The scattered blue lights the sky to the west, where it is still afternoon | — | Ep 2 sources; geometry | High (scattered along the whole path; "to the west" = toward the sun) |
Picture colours are computed from the same τ(λ) at 680/550/450 nm (sun e^(−τm), sky ∝ τ·e^(−τm)); the atmosphere is drawn far too thick (labelled "not to scale").
