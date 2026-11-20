# Ep 48 claims table (Short: film your lights in slow motion)

Hook type: DO. Three hook lines (on-screen text / first spoken line):
1. **"Film your lights in slow-mo"** / "Point your phone at a ceiling light. Switch to slow motion." ← picked: an action the viewer can do in 10 s, and the phone + bulb are moving in frame one.
2. "Is this light on or off?" / "Is this light on, or off? Look again in slow motion." (GUESS; weaker, the answer "both" needs explaining first)
3. "Your lights blink 100× a second" (a claim opener; rejected by playbook rule 1)

| Claim | Value | Source URL | Confidence |
| --- | --- | --- | --- |
| Many mains-powered lights (cheap/dimmed LEDs, magnetic-ballast fluorescents) pulse at twice the mains frequency | 100 Hz (50 Hz mains) / 120 Hz (60 Hz mains) | https://my.avnet.com/abacus/resources/article/what-is-led-flicker-and-how-to-prevent-it/ ; https://www.energy.gov/cmei/ssl/flicker-basics ; https://www.provideocoalition.com/rolling-shutter-and-flickering-hmis/amp/ | high (hedged "many") |
| Slow-motion phone video shows the flicker | frames far faster than the light's cycle catch on/dim phases | https://consumer.huawei.com/en/support/content/en-us00415417 ; https://www.ulanzi.com/blogs/knowledges/why-led-panels-flicker-120fps-240fps | high |
| Eyes blend it into a steady glow | changes above ~80 Hz look steady for most people | https://www.energy.gov/cmei/ssl/flicker-basics ; https://en.wikipedia.org/wiki/Flicker_fusion_threshold | high |
| Camera's short exposures catch the dips | short exposure per frame/row samples a slice of the cycle | https://support.enttec.com/pixel/pixel-general-knowledge/why-do-leds-flicker-on-camera | high |
| Good LEDs barely flicker; cheap or dimmed ones often do | driver smoothing; PWM dimmers < 200 Hz a common culprit; LEDs can flicker up to 100 % without a suitable driver | https://www.energy.gov/cmei/ssl/flicker-basics ; https://my.avnet.com/abacus/resources/article/what-is-led-flicker-and-how-to-prevent-it/ | high (hedged "barely", "often") |

Visual note: the slow-motion view is drawn as a 240 fps clip played back slowly: at 100 Hz that is 2.4 frames per pulse, so the bulb visibly alternates bright/dim (drawn as a smooth brightness wave so it reads at thumbnail size).
