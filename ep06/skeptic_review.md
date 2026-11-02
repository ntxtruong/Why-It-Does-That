# Ep06 Leidenfrost: skeptic review

Reviewed 2026-11-02 against claims.md and script.json beats.

## Errors

1. **"This is the Leidenfrost effect, first described in 1756."**
   The attribution is wrong. Herman Boerhaave reported the phenomenon in 1732. Leidenfrost's 1756 tract gave the effect its name and is the classic description, but it was not the first. Claims row 9 only supports "described by Leidenfrost in 1756", not "first".
   Severity: **error**.
   Suggested: "This is the Leidenfrost effect, named for a doctor who wrote about it in 1756."

2. **"Above roughly two hundred degrees, the bottom of the drop boils the instant it lands."**
   (a) No unit is given. A US viewer will hear 200 °F, which is below the boiling point of water, so the line is false as they hear it. (b) Claims row 2 says the script hedges with "depending on the pan", but the narration does not. Without that hedge "two hundred" sounds like one fixed threshold, when the real range is about 160–280 °C depending on the surface.
   Severity: **error** (missing unit) and **misleading** (dropped hedge).
   Suggested: "Above roughly two hundred degrees Celsius, depending on the pan, the bottom of the drop boils the instant it lands."

## Misleading

3. **"On a warm pan, a drop of water hisses and is gone in a moment."**
   A *warm* pan (say 60–90 °C) does not make a drop hiss and vanish. The drop just slowly evaporates. Fastest evaporation happens on a pan that is already very hot but just below the Leidenfrost point (about 150–170 °C; claims row 5 cites 168 °C). Viewers will try this on a warm pan and it won't work.
   Suggested: "On a hot pan, a drop of water hisses and is gone in a moment."

4. **"On a much hotter pan, it skates around for more than a minute."** together with **"A hotter pan, and the water lasts longer."**
   (a) "Much hotter" overstates the gap. The cited contrast is 168 °C against 202 °C, only about 35 °C apart. (b) As written, the rule sounds monotonic, as if hotter always means longer. Lifetime peaks near the Leidenfrost point and then falls again as the plate gets hotter (Incropera, claims row 5). Viewers will repeat "hotter pan = water lasts longer". (c) "More than a minute" holds for a few-mm drop (claims row 6) but not for small droplets.
   Suggested: "On a pan only a little hotter, a big drop skates around for more than a minute." / "Hotter pan, longer-lived drop, at least around this threshold. How?"

## Caveats

5. **"That steam gets trapped underneath and becomes a cushion, about as thin as a hair."**
   The vapour is not trapped. It escapes from the edges all the time and is replaced by evaporation, and that flow is what holds the drop up. "Thin as a hair" is fine for the typical 50–100 µm thickness, but at the neck the layer can be about 10 µm, thinner than a hair.
   Suggested: "That steam keeps streaming out from underneath, forming a cushion about as thin as a hair."

6. **"The drop floats on it. It never touches the metal."**
   "Never" is true only well above the Leidenfrost point. Near the transition, and on rough surfaces, brief contacts happen.
   Suggested: "The drop floats on it, barely touching the metal, if at all."

7. **"Steam carries heat poorly, so the cushion shields the drop from the pan."**
   It slows heat transfer but doesn't block it. Some heat (by conduction and radiation) must still get through, or no vapour would form.
   Suggested: "Steam carries heat poorly, so the cushion slows the heat reaching the drop."

8. **"Cool the pan, the cushion collapses, and the drop boils away."**
   Correct qualitatively. Note the hysteresis: once formed, the layer can survive down to about 140 °C (claims row 3). The pan has to cool well below where the effect started. No change needed for a Short. Flag it only if an on-screen number is added.

9. **Title/hook "dance"**: the script explains floating and gliding, not the dancing or hopping, which comes from vapour-flow instabilities and drop oscillations. Not wrong, but the title promises something the narration never explains.
