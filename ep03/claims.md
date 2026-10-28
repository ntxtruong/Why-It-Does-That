# Episode 3 — claims table (rebuilt 2026-10-28; the 2026-10-15 files were never pushed)

| # | Claim | Value | Source | Confidence |
| --- | --- | --- | --- | --- |
| 1 | Cameras record discrete still frames | — | Wikipedia "Frame rate"; "Wagon-wheel effect" | High |
| 2 | Cinema 24 fps; video commonly 25, 30, 60 | — | Wikipedia "Frame rate" / "24p" | High |
| 3 | Brain links frames by apparent (beta) motion, nearest match | — | Wikipedia "Wagon-wheel effect" (beta movement); Finlay & Dodwell 1987, Perception & Psychophysics | High |
| 4 | Rule: per-frame rotation vs spoke spacing; <½ forward, >½ backward, =1 frozen | — | Wikipedia "Wagon-wheel effect" (four-spoke example); temporal aliasing | High |
| 5 | 12 spokes → 30° gap; at 24 fps frozen at 2 rev/s | 30°×24 = 720°/s | Computed | High |
| 6 | Need more than two samples per repeat (sampling theorem) | Nyquist | Standard signal processing (Shannon/Nyquist) | High |
| 7 | 5-spoke wheel, 65 cm tyre, 24 fps → frozen ≈ 35 km/h | π·0.65 m × 4.8 rev/s = 9.8 m/s ≈ 35 km/h | Computed (tyre diameter assumed; typical passenger car) | High as arithmetic; "about" |
| 8 | Cycle repeats as speed increases (also at 2×, 3× …) | — | Aliasing (computed) | High |
| 9 | Helicopter rotors can look frozen on video | — | Wikipedia "Wagon-wheel effect" (rotors, propellers) | High |
| 10 | Shutter time: long blurs (weakens illusion), short sharpens (strengthens) | — | Standard photography; qualitative | Medium-high (qualitative, worded as such) |
| 11 | Fluorescent/some LED lamps flicker at 100/120 Hz (twice mains) | — | Wikipedia "Stroboscopic effect"; "Wagon-wheel effect" | High |
| 12 | Machinery can look stopped under flicker — lathe hazard | — | Wikipedia "Stroboscopic effect" | High |
| 13 | Turntable strobe dots look still at correct speed under mains light | — | Wikipedia "Wagon-wheel effect" | High |
| 14 | Reversal reported under continuous light | Schouten 1967; Purves et al. 1996 PNAS | Wikipedia; Purves, Paydarfar & Andrews 1996 | High that it is reported |
| 15 | Explanation debated: snapshots vs rivalry of motion detectors | Purves 1996 / VanRullen vs Kline, Holcombe & Eagleman 2004, 2006 | Wikipedia | High that it is open |
| 16 | (removed) "propellers bend" — rolling shutter, a different mechanism | — | Wikipedia "Rolling shutter" | Removed from hook |

Misconception corrected: the wheel really slows or reverses / it's a camera fault. It is sampling plus the brain's nearest-match guess.
