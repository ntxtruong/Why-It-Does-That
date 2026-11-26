# Ep08 Microwaves: skeptic review

Reviewed 2026-11-02 against claims.md and script.json beats.

## Errors

None found at error level. No sentence is plainly false as a viewer would hear it. Items 1–2 below come closest.

## Misleading

1. **"At room temperature, it absorbs most strongly near twenty gigahertz, about eight times higher."**
   What peaks near 19 GHz is the dielectric *loss factor* ε'' (claims row 6). The absorption *per centimetre*, which is what "absorbs most strongly" means to a viewer, keeps rising with frequency through the microwave range into the THz (α ∝ f·ε''/√ε'). The next beat ("water would absorb it too well") actually relies on higher frequency absorbing more. A physicist viewer will call this out.
   Suggested: "At room temperature, the molecules' lag, and the heating per wiggle, peaks near twenty gigahertz, about eight times higher."

2. **"But in liquid water, every molecule is held by its neighbours. It can't keep up. It lags, it bumps, it drags."**
   At 2.45 GHz, roughly 8× below water's relaxation frequency (τ ≈ 8 ps), the molecules *mostly do* keep up. Heating comes from a small phase lag. If they truly "couldn't keep up", you'd be describing the far-above-relaxation regime, where heating is weak again. This contradicts the resonance scene.
   Suggested: "But in liquid water, every molecule is held by its neighbours. It follows, but a little late. It lags, it bumps, it drags."

3. **"The microwaves only heat the outer layer."** (and payoff: **"...but only in the outer one or two centimetres of your food."**)
   "Only" is too strong. Absorption decays exponentially, about 37 % of the power is left after one penetration depth, and in bread it's 2–5 cm (claims row 9). Also, a lasagne portion is heated from the top, sides and corners at once. The bubbling edges come largely from edge and corner concentration of the field, not only from depth.
   Suggested: "The microwaves mostly heat the outer layer." / "...but mostly in the outer centimetre or two of your food."

4. **"Two point four five gigahertz is a compromise, and also a radio band that governments around the world set aside for heating machines."**
   The ISM band is set aside for industrial, scientific and medical uses of RF energy other than communications, not specifically "heating machines". Wi-Fi and Bluetooth now share it. Also, "compromise" implies the frequency was optimised for penetration. The choice was at least as much about regulation and magnetron engineering and cost (claims row 8). 915 MHz is used where allowed.
   Suggested: "Two point four five gigahertz is a compromise, and also a radio band set aside worldwide for machines that use radio waves for something other than talking."

## Caveats

5. **"That creeping takes minutes. Your three minutes in the oven weren't enough."** / **"...let the food stand for a minute. They are giving the heat time to spread."**
   Conduction is slower than "minutes" suggests. With food diffusivity of about 1.4×10⁻⁷ m²/s, heat spreads about 3 mm in one minute and about 1 cm in roughly 10 minutes (t ~ L²/α). A one-minute stand only smooths small gradients. Stirring does most of the work.
   Suggested: "That creeping is slow, roughly a centimetre in ten minutes." / "...stir, or let it stand. Stirring does most of the work."

6. **"So a microwave doesn't cook from the inside out. It cooks from the outside in, like an oven, just with a thicker hot layer."** (and hook: **"Both are wrong."**)
   Missing caveat: evaporative cooling often leaves the surface cooler than the layer just beneath it (which is why there's no browning and bread goes soggy). In small or rounded items about 2–6 cm across (potatoes, eggs), field focusing can make the centre hottest, which is the grain of truth behind "inside out". As stated it is acceptable, but "both are wrong" is absolute.
   Suggested: "...It heats a thick outer layer, and the rest cooks from the outside in."

7. **"The oven barely heats the air, or a microwave-safe plate. It is shaking the water in your food."**
   Missing contributor: dissolved salts heat by ionic conduction, which is significant in salty food like lasagne and also shortens penetration depth. Not in the claims table.
   Suggested (scene end): "Fats, sugars and salts join in too. But in most food, water does most of the work."

8. **"The result is a pattern that stays in place, with strong spots and dead spots, about six centimetres apart. Half a wavelength."** / **"...multiply by two, and by the oven's frequency, and you get the speed of light."**
   In a real 3D multimode cavity, the hot-spot spacing is only roughly λ/2 along a line. The pattern also shifts with the load, and the magnetron frequency is nominal (±~50 MHz). The marshmallow method typically lands within about 10 %. Say "roughly".
   Suggested: "...and you get roughly the speed of light."

9. **"And now you know what the turntable is for."**
   Many ovens (built-in, commercial, flatbed) use a mode stirrer instead of a turntable. Minor.

10. **"Ice is almost invisible to microwaves. ... The waves pass straight through and barely heat it."**
    True for pure ice (claims row 15). Frozen *food*, though, holds pockets of unfrozen salty water that do absorb, which is how defrosting starts at all. Worth a clause.
    Suggested: "Pure ice is almost invisible to microwaves..."

11. **"Because water would absorb it too well. Almost all the energy would be used up in the outer skin of the food."**
    Fine physically (penetration depth well under 1 mm near 20 GHz). Add that number with its source to the claims table, since the script implies it.
