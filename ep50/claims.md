# Ep 50 claims table (long: why screens and lights flicker on camera)

| Claim | Value | Source URL | Confidence |
| --- | --- | --- | --- |
| Mains frequency | Vietnam and Europe 50 Hz; United States 60 Hz | https://en.wikipedia.org/wiki/Mains_electricity_by_country ; https://www.worldstandards.eu/electricity/plug-voltage-by-country/vietnam/ | high |
| Light output follows power, which peaks at both halves of the AC cycle → ripple at twice mains frequency | 100 / 120 Hz ("rectified mains would be 100 Hz in Europe or 120 Hz in the US") | https://my.avnet.com/abacus/resources/article/what-is-led-flicker-and-how-to-prevent-it/ ; https://www.provideocoalition.com/rolling-shutter-and-flickering-hmis/amp/ (≈120 pulses/s on 60 Hz) ; https://www.energy.gov/cmei/ssl/flicker-basics (fluorescent ~120 Hz) | high |
| Filament bulb barely dims (thermal persistence) | "small amount of flicker", usually too small to notice | https://www.energy.gov/cmei/ssl/flicker-basics | high |
| LED has no persistence; without a suitable driver it can flicker up to 100 % | "as much as 100 percent, from on to full off" | https://www.energy.gov/cmei/ssl/flicker-basics | high |
| Cheap drivers smooth less (small capacitors) | "30% flicker … not uncommon" | https://my.avnet.com/abacus/resources/article/what-is-led-flicker-and-how-to-prevent-it/ | high (worded "sometimes almost to dark") |
| PWM dimming: full on/off, off longer = dimmer | duty cycle | https://www.dxomark.com/flicker-the-display-affliction/ ; https://my.avnet.com/abacus/resources/article/what-is-led-flicker-and-how-to-prevent-it/ | high |
| Many phone (OLED) and some laptop screens use PWM at low brightness | OLED ~50–500 Hz, tested phones 240–483 Hz; LCD often ≥ 1 kHz | https://www.dxomark.com/flicker-the-display-affliction/ ; https://www.androidcentral.com/phones/what-is-pwm-display-flicker-tips-and-tricks | medium-high (hedged "many"; laptops = some LCD/OLED models) |
| Flicker above ~80 Hz looks steady to most people | DOE: visible flicker up to 80 Hz; fusion threshold 48–60 Hz for moving images | https://www.energy.gov/cmei/ssl/flicker-basics ; https://en.wikipedia.org/wiki/Flicker_fusion_threshold | high (hedged "about", "most people") |
| Some people notice it (dimmed screens, during eye movements / phantom array) | flicker seen up to ~2 kHz during saccades; ~500 Hz with sharp edges; PWM discomfort in a minority | https://en.wikipedia.org/wiki/Flicker_fusion_threshold ; https://pubmed.ncbi.nlm.nih.gov/25644611/ ; https://www.androidcentral.com/phones/what-is-pwm-display-flicker-tips-and-tricks | high |
| Most phone cameras use a rolling shutter: rows exposed at slightly different times, top to bottom | — | https://support.enttec.com/pixel/pixel-general-knowledge/why-do-leds-flicker-on-camera ; https://www.sony.co.th/en/electronics/support/articles/00122281 | high |
| Rows at a peak bright, rows in a dip dark → horizontal bands | — | same two | high |
| Bands roll when camera timing and light cycle are out of step; stand still when in step | 24p stationary vs 23.98p rolling on 60 Hz mains | https://www.provideocoalition.com/rolling-shutter-and-flickering-hmis/amp/ ; https://support.swann.com/hc/en-us/articles/39992440507929 | high |
| Worked example: 100 Hz at 30 fps = 3⅓ pulses/frame (drift ⅓ pulse/frame, rolls); 120 Hz at 30 fps = 4 (still) | arithmetic | (arithmetic from the above) | high (idealised: real frame rate 29.97 makes 120 Hz bands creep very slowly) |
| Same aliasing idea as the wagon-wheel effect | channel ep 3 | https://youtu.be/SxjS9sdc_Ek | high |
| Fix: exposure = whole number of flicker cycles | 1/50 or 1/100 s (50 Hz); 1/60 or 1/120 s (60 Hz) | https://www.sony.co.th/en/electronics/support/articles/00122281 ; https://support.enttec.com/pixel/pixel-general-knowledge/why-do-leds-flicker-on-camera | high |
| Phones have an anti-banding setting that adjusts exposure for 50/60 Hz light | Android Camera2 CONTROL_AE_ANTIBANDING_MODE (OFF/50HZ/60HZ/AUTO): "adjust exposure duration to avoid banding problems" | https://developer.android.com/reference/android/hardware/camera2/CaptureRequest | high (hedged "try to") |

Open question for the fact-check: "Most phone cameras" use rolling shutter (enttec says most phone/mirrorless/cinema CMOS cameras do).
