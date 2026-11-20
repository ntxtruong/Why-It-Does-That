# Episode 50 — STORYBOARD

**Logline:** Many lights and dimmed screens pulse 100 or 120 times a second. Your eyes blend it; a phone camera reads its sensor row by row, so the pulses become dark stripes, and they roll when the light's rhythm and the frame rate are out of step.

**World:** brand kit v2 (navy). Recurring object: a phone on screen filming a desk lamp / monitor, its viewfinder showing bands. Chibi mascot bottom-left, reacting.

| Scene | Chapter | What the viewer must read (in order) | Out |
| --- | --- | --- | --- |
| hook | Stripes your eyes can't see | 0 s: phone viewfinder over a glowing lamp with dark bands rolling (payoff image) · split: "your eyes" steady lamp vs "camera" striped · question caption | zoom into the wall socket |
| ac | Alternating current | sine wave of voltage scrolling, 50 Hz / 60 Hz labels · second trace = light output = |sine|², two humps per swing · counter "100 / 120 pulses per second" | light trace slides into bulb row |
| lights | Bulbs, LEDs and dimming | three lamps with their brightness traces: filament (small ripple), good LED (flat), cheap LED (deep ripple) · PWM: square wave, duty cycle shrinking as a slider dims, phone screen dimming | trace fades into an eye |
| eyes | Why your eyes don't see it | pulses enter an eye, a running-average meter stays flat · frequency slider 20→100 Hz: visible flicker until ~80 Hz then steady · saccade: dotted trail ("some people notice") | eye → camera sensor |
| camera | Rolling shutter | sensor grid; read-out line sweeping top to bottom, each row sampling the light trace at its own time · rows painted bright/dark · stacked picture shows stripes | picture becomes a frame on a filmstrip |
| roll | Why the stripes roll | timeline: pulses 100/s with frame starts every 1/30 s; phase offset ⅓ → stripes shift each frame; filmstrip animates rolling · wheel callback (ep 3) · 120/s: 4 per frame, stripes freeze | shutter dial |
| fix | The fix | each row's exposure window widened to exactly 2 pulses (1/50 s) — every row equal, stripes fade · 50 Hz → 1/50, 1/100; 60 Hz → 1/60, 1/120 · phone menu "Anti-banding: Auto" | back to the hook shot |
| payoff | It's the light's real rhythm | hook shot again: viewfinder stripes + steady eye view; end card mascot left, right two thirds free | end |
