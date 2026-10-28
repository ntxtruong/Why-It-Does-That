# Episode 5 — claims table

Checked 2026-10-28. "Computed" = arithmetic done here. Speed of sound taken as 343 m/s (dry air, 20 °C).

| # | Claim | Value | Source | Confidence |
| --- | --- | --- | --- | --- |
| 1 | ANC adds sound in anti-phase (destructive interference); it is not a barrier | — | Wikipedia "Noise-cancelling headphones" (citing Elliott 2001, *Signal Processing for Active Control*); Leventhall, IOA historical review | High |
| 2 | Sound = travelling compressions and rarefactions; amplitude ↔ loudness, frequency ↔ pitch | — | Standard acoustics (any physics textbook) | High |
| 3 | Engine hum ~100 Hz, whistle a few kHz | order of magnitude | Illustrative; jet cabin noise is broadband, dominant low-frequency content | Medium — used as "about"; skeptic to check |
| 4 | Feedforward mic outside, feedback mic inside, hybrid uses both | — | Wikipedia (citing Bose "How ANC works") | High |
| 5 | Paul Lueg patented the idea in the 1930s | filed DE 1933, US patent 1936 | Leventhall, IOA review; Wikipedia | High |
| 6 | Bose ANC aviation headsets late 1980s | 1986–1989 (dates disputed) | Wikipedia (citing Broadcast Bridge 2015; Cardinal Comms 2024) | High as "late 1980s" |
| 7 | Half a cycle late doubles the noise (peak meets peak) | amplitude ×2 | Computed (superposition) | High |
| 8 | ~0.1 rad phase accuracy needed for ~20 dB (99% energy) reduction | 0.1 rad ≈ 1/63 cycle | Leventhall, IOA review ("15 or 20 dB … phase error of about 0.1 radians"); computed |1−e^{i0.1}|² ≈ 0.01 | High |
| 9 | 100 Hz period 10 ms; 1/60 ≈ 0.17 ms | computed | High |
| 10 | 2 kHz period 0.5 ms; 1/60 ≈ 8 µs | computed | High |
| 11 | Zone of quiet (≥10 dB) ≈ 1/10 wavelength across, diffuse field | — | Elliott, Joseph & Nelson, IOA proceedings ("diameter of about one tenth of a wavelength") | High for diffuse field; inside a closed ear cup the geometry differs — used to explain the trend only |
| 12 | λ(100 Hz) ≈ 3.4 m → zone ≈ 34 cm; λ(3 kHz) ≈ 11 cm → zone ≈ 1 cm | computed | High |
| 13 | ANC works best on steady low-frequency noise; weak on voices and sudden sounds | — | Wikipedia (citing Elliott 2001); Cui et al., Canadian Acoustics 30(3) 2002 | High |
| 14 | Active attenuation dominates below ~500 Hz, passive (padding) above | ~500 Hz | Cui, Behar, Kunov & Wong 2002 | Medium-high (older headsets; modern ones extend somewhat higher — script gives no number) |

Misconception corrected: noise cancelling is a "wall" that blocks sound. It adds sound.
| 15 | Inner mic sits a few cm from the eardrum (ear canal ≈ 2.5 cm long) | ~2.5 cm canal | Standard anatomy (adult ear canal ≈ 2.5 cm) | Medium-high, said as "a few centimetres" |
