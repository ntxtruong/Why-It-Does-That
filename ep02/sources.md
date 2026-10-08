# Episode 2 — sources and checked numbers

Checked on 2026-10-08. "Computed" means arithmetic done here from the published figures named.

| Claim in the script | Value | Source |
| --- | --- | --- |
| Scattering by particles much smaller than the wavelength goes as 1/λ⁴ | halve λ → 16× | Wikipedia, Rayleigh scattering; Physics FAQ (Gibbs), Why is the sky blue? |
| Red and blue wavelengths | about 700 nm and 450 nm | NOAA NESDIS gives 750 nm (red) to 400 nm (blue/violet); 700 and 450 are within the red and blue bands |
| Blue scattered about six times more than red | (700/450)⁴ = 5.9; optical depths 0.2211 / 0.0364 = 6.1 | Computed; Bodhaine et al. 1999, table of Rayleigh optical depth at sea level |
| Violet scattered nearly ten times more than red | (700/400)⁴ = 9.4; optical depths 0.3602 / 0.0364 = 9.9 | Computed; Physics FAQ gives "a factor of (700/400)⁴ ≈ 10" |
| Air molecules more than a thousand times smaller than the wave | N₂ 0.364 nm, O₂ 0.346 nm; 450 / 0.364 = 1,236 | Wikipedia, Kinetic diameter; computed |
| Of 1,000 photons straight down: fewer than 40 red, about 200 blue scattered | 1 − e^−0.0364 = 3.6%; 1 − e^−0.2211 = 19.8% | Computed from Bodhaine et al. 1999 (Rayleigh scattering only, sea level, sun at the zenith) |
| About four fifths of the blue comes straight through with the sun overhead | e^−0.2211 = 0.80 | Same |
| Sunset path crosses about 38 times more air | relative air mass 38 at the horizon | Kasten and Young 1989, as given in Wikipedia, Air mass (astronomy) |
| Less than a thousandth of the blue left at sunset, about a quarter of the red | e^−(0.2211×38) = 0.0002; e^−(0.0364×38) = 0.25; green 550 nm: 0.025 | Computed (clean dry air, Rayleigh scattering only, sun on the horizon) |
| Lord Rayleigh, 1871 | | Wikipedia, Rayleigh scattering |
| Einstein showed molecules alone are enough | | Physics FAQ (Gibbs) |
| Not violet: less violet from the sun, absorption high up, eye less sensitive | | NOAA NESDIS; Physics FAQ |
| Sky near the horizon is paler | | NOAA NESDIS |
| Black sky on the Moon and in space | | Astronomy magazine, Ask Astro (Feb 2015) |
| Dust and haze redden sunsets | | NOAA NESDIS; Physics FAQ |
| Cloud droplets larger than the wavelength scatter all colours about equally | | Wikipedia, Diffuse sky radiation |
| Mars: orange or reddish daytime sky, blue around the setting sun, fine dust | | NASA Space Place; Curiosity Mastcam images of 2015-04-15 |

## Links

- https://en.wikipedia.org/wiki/Rayleigh_scattering
- https://en.wikipedia.org/wiki/Diffuse_sky_radiation
- https://en.wikipedia.org/wiki/Air_mass_(astronomy)
- https://en.wikipedia.org/wiki/Kinetic_diameter
- https://math.ucr.edu/home/baez/physics/General/BlueSky/blue_sky.html
- https://www.nesdis.noaa.gov/about/k-12-education/atmosphere/why-the-sky-blue
- https://spaceplace.nasa.gov/blue-sky/en/
- https://reef.atmos.colostate.edu/~odell/at721/resources/rayleighOpticalDepth.pdf (Bodhaine, Wood, Dutton, Slusser, "On Rayleigh optical depth calculations", J. Atmos. Oceanic Technol. 16, 1999)
- https://www.astronomy.com/observing/how-is-it-that-in-space-despite-the-suns-presence-the-surroundings-look-black-apollo-photos-show-a-black-sky-even-with-strong-sunlight-on-the-surface/
- https://www.livescience.com/50829-mars-blue-sunset-curiosity-rover-video.html
