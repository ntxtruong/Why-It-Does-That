# Episode 23 (Short) — claims table
Checked 2026-11-11. "Computed" = arithmetic done here.

| # | Claim | Value | Source | Confidence |
| --- | --- | --- | --- | --- |
| 1 | A coin spun on a table rattles faster and faster, then stops abruptly | — | Moffatt (2000) Nature 404:833; Euler's Disk (Bendik toy) | High |
| 2 | The coin's own rotation (the face) gets slower, almost stops turning | face rotation ≈ Ω(1 − cos α) → 0 as α → 0 | Moffatt 2000; Petrie, Hunt & Gray (2002) Am. J. Phys. 70:1025 | High |
| 3 | What speeds up is the contact point running around (precession of the line of contact) | rolling without slipping, small α: Ω² sin α ≈ 4g/a | Moffatt 2000 | High |
| 4 | It leans lower as it loses energy | — | Moffatt 2000; Petrie et al. 2002 | High (cause of the loss is debated: air drag vs rolling friction/slipping; script says only "loses energy") |
| 5 | Lower lean → faster contact point | Ω ∝ (sin α)^-1/2 | Moffatt 2000 | High |
| 6 | Near the end, dozens of laps per second | coin radius 12 mm: α = 10° → ~22 laps/s; α = 2° → ~49 laps/s | Computed from claim 3 (ideal model) | Medium-high ("dozens" kept vague) |
| 7 | The rattle comes from the edge tapping the table as the contact point laps, so its pitch rises | — | Moffatt 2000 (frequency of the sound follows the precession rate); Euler's Disk docs | Medium-high |
| 8 | Then it drops flat suddenly | finite-time singularity in the model; in reality ends in a few ms | Moffatt 2000; Leine (2009) Arch. Appl. Mech. 79:1063 | High |

Misconception to avoid: "the coin spins faster" (it doesn't) and naming a single cause of the energy loss (still debated).
