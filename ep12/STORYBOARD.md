# Episode 12 (new Short, 1080×1920) — STORYBOARD

**Logline:** Ice floats because freezing locks water molecules into an open six-sided pattern that takes up about 9% more room.
**World:** Brand kit v2. Two tall glass cylinders side by side in the top half (left: a generic grey "most solids" block sinking in its melt; right: ice cube floating in water). Molecular world below: blue V molecules (O blue, H ink), hydrogen bonds as thin gold dashes.
**Colour arc:** grey/blue → gold bonds snapping into a lattice → cold blue lake with ice on top.
**Recurring motif:** a "room" bar: the same number of molecules in a box that grows 9% when frozen.
**Character:** chibi3 holding a glass, watches the cube bob.
**Different from ep 1–11:** molecular lattice assembly and a lake cross-section; nothing like it on the channel yet (first video in "Nature's Weird Rules").

**Simulation (deterministic):** molecules in liquid = positions from a fixed jittered grid plus closed-form wandering (sums of sines with seeded phases); bonds drawn between pairs closer than a threshold, flickering via hash(t-bucket). Freezing = interpolate each molecule from its liquid position to its ice-Ih lattice site (2-D projection of the hexagonal net) with ease-in-out; box width grows 1.09×. Floating = buoyancy equilibrium (ice 0.917 → 91.7% submerged) with a small damped bob, closed form.

| Shot | Scene | Event | Reads | Out |
| --- | --- | --- | --- | --- |
| 1 | hook | First frame: two glasses; left block sinks, right ice cube floats; question | (1) question (2) most solids sink, ice floats | zoom into the water |
| 2 | liquid | Close-up of V molecules jostling, gold bonds flicker on/off, molecules packed close | (1) V shapes + bonds (2) bonds break and re-form | temperature drops |
| 3 | ice | Molecules snap into hexagonal rings, each with 4 bonds; empty ring centres glow; box widens, "+9% room" | (1) four neighbours (2) open pattern (3) more room → floats | pull back to a lake |
| 4 | end | Lake cross-section: ice layer on top, fish below, "≈4 °C" at bottom; back to the floating cube | (1) ice shields the water (2) roomier pattern | loops to shot 1 |
