// Episode 19 (Short cut from ep 2, 1080×1920) — Why is the sky blue but sunsets red?
// Colours are computed, not picked: Rayleigh optical depth at sea level τ(λ) = 0.0364·(700/λ)^4 (Bodhaine et al. 1999,
// red 0.0364 at 700 nm, blue 0.2211 at 450 nm). Sun colour = e^{−τ m}; scattered sky colour ∝ τ·e^{−τ m}. m = air mass
// (1 at noon, 38 at the horizon, Kasten & Young 1989). Shorts v2 layout: subject 380–1250 px, burned-in captions
// 1330–1500 right of the character, nothing important below 1536 or right of 940. Pure functions of time.

const LAM = [680, 550, 450], TAU = LAM.map(l => 0.0364 * Math.pow(700 / l, 4));
const gam = v => 255 * Math.pow(clamp(v), 1 / 2.2);
function sunCol(m) { const c = TAU.map(t => Math.exp(-t * m)), k = Math.max(...c); return c.map(v => gam(v / k)); }
function skyCol(m, bright = 1) { const c = TAU.map(t => t * Math.exp(-t * m)), k = Math.max(...c); return c.map(v => gam(v / k) * bright); }
const NOON = skyCol(1), DUSK = skyCol(38, 0.92), SUNW = sunCol(1), SUNR = sunCol(38);

function skyPanel(x, y, w, h, m, sunX, sunY, a = 1, ground = true) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.beginPath(); g.roundRect(x, y, w, h, 28); g.clip();
  const top = m > 5 ? mix(DUSK, [40, 30, 70], 0.55) : mix(NOON, [30, 70, 160], 0.35), low = m > 5 ? skyCol(38, 1) : mix(NOON, INKc, 0.45);
  const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, css(top)); gr.addColorStop(1, css(low)); g.fillStyle = gr; g.fillRect(x, y, w, h);
  const sc = sunCol(m); soft(sunX, sunY, 150, sc, 0.55); dot(sunX, sunY, 46, sc, 1);
  if (ground) { g.fillStyle = m > 5 ? "#2a1f33" : "#1d3a35"; g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, y + h - 70);
    for (let i = 0; i <= 12; i++) g.lineTo(x + w * i / 12, y + h - 70 - 18 * Math.sin(i * 1.7) - 10 * Math.sin(i * 0.6)); g.lineTo(x + w, y + h); g.closePath(); g.fill(); }
  g.restore();
}
const SCENES = {};

// 1 — hook: the payoff at full size on frame one: the same sky at noon (blue) and at sunset (red); then the two paths
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette(0.25);
  const drift = 6 * Math.sin(T * 0.8);
  skyPanel(40, 400, 1000, 400, 1, 760, 500 + drift, 1);
  skyPanel(40, 830, 1000, 400, 38, 220, 1140 + drift * 0.5, 1);
  plate("noon", 130, 450, 44, INK, "center", 1, 800); plate("sunset", 150, 880, 44, GOLD, "center", 1, 800);
  // beat 1: the path through the air: short at noon, long and flat at sunset
  const p = seg(t, B(1), B(1) + 1.2), q = seg(t, B(1) + 1.0, B(1) + 2.6);
  arrow(760, 560, 760, 560 + 150 * p, GOLDc, p, 9, 26); plate("short path", 880, 650, 40, GOLD, "center", p, 800);
  arrow(260, 1130, 260 + 640 * q, 1150, CORALc, q, 9, 26); plate("long path", 700, 1080, 40, CORAL, "center", q, 800);
  MASR(T, t, { ev: [[0.3, "?"], [B(1) + 2.4, "!", "grin"]], look: [0.9, -0.8], mouth: "o" });
};

// 2 — scatter: a beam of sunlight (red, green, blue photons) crosses air; each photon flies on until its scattering point,
// drawn from an exponential law with mean free path ∝ λ^4, so blue leaves the beam about six times sooner than red.
const PH = [];
for (let j = 0; j < 210; j++) PH.push({ c: j % 3, e: (j / 3 | 0) * 0.16 + hash(j, 1) * 0.12, y: 800 + (hash(j, 2) - 0.5) * 110, th: hash(j, 3) * TAU2, u: hash(j, 4) });
const PCOL = [[255, 96, 86], [120, 230, 130], [96, 160, 255]];
SCENES.scatter = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const dome = seg(t, B(2) - 0.2, B(2) + 0.6);
  // air band and molecules
  g.globalAlpha = 1 - dome; g.fillStyle = "rgba(140,198,255,0.10)"; g.fillRect(200, 420, 880, 780); g.globalAlpha = 1;
  for (let i = 0; i < 120; i++) dot(220 + hash(i, 7) * 850, 440 + hash(i, 8) * 740, 6, QUIETc, 0.55 * (1 - dome));
  text("air", 1000, 1160, 40, QUIET, "right", 800, 0.9 * (1 - dome));
  soft(40, 800, 200, [255, 240, 200], 0.8 * (1 - dome)); dot(40, 800, 80, [255, 244, 214], 1 - dome);
  const MFP = [3000, 1350, 500], V = 520, cnt = [0, 0, 0];
  PH.forEach((p, j) => {
    const age = t - p.e; if (age < 0) return;
    const xs = 200 - Math.log(1 - p.u * 0.999) * MFP[p.c], d = age * V, x0 = 100;
    let x, y, a = 1;
    if (x0 + d < xs) { x = x0 + d; y = p.y; } else { const r = x0 + d - xs; x = xs + r * Math.cos(p.th); y = p.y + r * Math.sin(p.th); a = 1 - clamp(r / 650); cnt[p.c]++; }
    if (x > 1080 || a <= 0) return;
    dot(x, y, 11, PCOL[p.c], a * (1 - dome));
  });
  plate("sunlight = all colours", 540, 420, 46, INK, "center", win(t, 0.3, B(1) - 0.1, 0.3) * (1 - dome), 800);
  // the ratio: scattering ∝ 1/λ^4 → blue (450 nm) vs red (700 nm) = 5.9
  const bar = seg(t, B(1) + 1.6, B(1) + 2.6) * (1 - dome);
  text("knocked sideways", 330, 470, 42, INK, "left", 800, bar);
  rrect(330, 505, 92, 50, 10, PCOL[0], bar); text("red  1×", 440, 531, 42, PCOL[0], "left", 800, bar);
  rrect(330, 575, 92 * 5.9 * eout((t - B(1) - 1.6) / 1.2), 50, 10, PCOL[2], bar); text("blue  ≈6×", 330, 650, 46, PCOL[2], "left", 900, bar);
  // beat 2: the view from the ground: blue arriving at your eye from every direction
  if (dome > 0.01) {
    skyPanel(40, 400, 1000, 840, 1, 820, 520, dome, true);
    const eye = [230, 1080];
    for (let i = 0; i < 9; i++) { const ang = -Math.PI * (0.12 + 0.76 * i / 8), L = 520, s = (T * 0.9 + i * 0.37) % 1;
      const sx = eye[0] + 330 * Math.cos(ang) + 260, sy = eye[1] + L * Math.sin(ang) * 0.95;
      line(sx, sy, eye[0] + 40, eye[1] - 80, PCOL[2], 0.35 * dome, 4, [10, 14]);
      dot(lerp(sx, eye[0] + 40, s), lerp(sy, eye[1] - 80, s), 9, PCOL[2], dome * (1 - s * 0.4)); }
    plate("blue sky = scattered sunlight", 560, 460, 46, INK, "center", seg(t, B(2) + 0.8, B(2) + 1.3) * dome, 800);
  }
  MASR(T, t, { ev: [[B(1) + 2.0, "!"], [B(2) + 1.0, "idea", "smile"]], look: [0.9, -0.8], mouth: "o" });
};

// 3 — sunset: noon light crosses a thin layer, sunset light skims along it (38× the air); the beam is coloured by what is
// left after each stretch, e^{−τ·38·f}: white → yellow → orange → red. Picture not to scale (atmosphere drawn thick).
SCENES.sunset = (t, T, B, E, dur) => {
  const glow = seg(t, B(2) - 0.2, B(2) + 1.0);
  clear(mix(BGc, [70, 30, 50], glow)); vignette(0.3);
  const R = 1500, C = [540, 2400], Hs = 210, obs = [540, C[1] - R];
  // the sky over the observer, coloured by the model: noon blue, drifting to the sunset mix as the beam drains
  const skyM = lerp(1, 38, seg(t, B(1) - 0.3, B(2) + 0.8)), skyTop = mix(skyCol(skyM, skyM > 5 ? 0.85 : 1), [30, 40, 90], 0.45), skyLow = skyCol(skyM, 1);
  const sg = g.createLinearGradient(0, 380, 0, 900); sg.addColorStop(0, css(skyTop)); sg.addColorStop(1, css(skyLow)); g.fillStyle = sg; g.fillRect(0, 380, W, 560);
  g.fillStyle = css(mix([140, 198, 255], [255, 150, 90], glow), 0.16); g.beginPath(); g.arc(C[0], C[1], R + Hs, 0, TAU2); g.fill();
  g.fillStyle = mix([40, 70, 60], [50, 35, 55], glow) && css(mix([40, 70, 60], [50, 35, 55], glow)); g.beginPath(); g.arc(C[0], C[1], R, 0, TAU2); g.fill();
  text("atmosphere (not to scale)", 1000, 1260, 34, QUIET, "right", 700, 0.8);
  // noon path (short, vertical)
  const n = seg(t, 0.2, 1.0) * (1 - seg(t, B(1) - 0.4, B(1)));
  arrow(obs[0], obs[1] - Hs - 60, obs[0], obs[1] - 20, sunCol(1), n, 10, 26); plate("noon: thin layer", 760, obs[1] - Hs - 40, 38, INK, "center", n, 800);
  // sunset path (long, tangent from the west), coloured by transmission along the way
  const L = 2 * Math.sqrt((R + Hs) ** 2 - R ** 2) / 2, x0 = obs[0] - L * 1.05, y0 = obs[1] - 6, grow = seg(t, 1.2, 2.6), drain = seg(t, B(1) - 0.3, B(1) + 2.5);
  const NSEG = 60;
  for (let i = 0; i < NSEG; i++) { const f0 = i / NSEG, f1 = (i + 1) / NSEG; if (f0 > grow) break;
    const col = drain > 0 ? sunCol(38 * Math.min(f0, drain) + 0.01) : sunCol(0.01);
    line(lerp(x0, obs[0] - 30, f0), y0, lerp(x0, obs[0] - 30, Math.min(f1, grow)), y0, col, 1, 26); }
  plate("sunset: ≈38× more air", 540, 450, 50, GOLD, "center", seg(t, 2.0, 2.6), 800);
  soft(30, y0, 120, sunCol(1), 0.6 * seg(t, 1.0, 1.4)); dot(30, y0, 50, sunCol(1), seg(t, 1.0, 1.4));
  // what survives the trip (clean air, Rayleigh only): blue e^{−0.2211·38} < 0.1 %, red e^{−0.0364·38} ≈ 25 %
  const b = seg(t, B(1) + 0.8, B(1) + 1.6);
  text("left after the trip", 330, 1000, 42, INK, "left", 800, b);
  rrect(330, 1040, 560, 46, 10, null, b, QUIETc, 3); rrect(330, 1040, 560 * 0.25 * eout((t - B(1) - 0.8) / 1.5), 46, 10, PCOL[0], b);
  text("red  ≈25%", 900, 1063, 40, PCOL[0], "right", 800, b);
  rrect(330, 1110, 560, 46, 10, null, b, QUIETc, 3); rrect(330, 1110, 3, 46, 1, PCOL[2], b);
  text("blue  <0.1%", 900, 1133, 40, PCOL[2], "right", 800, b);
  // the sun you see: low and red
  soft(120, obs[1] - 20, 240, SUNR, 0.7 * glow); dot(120, obs[1] - 20, 70, SUNR, glow);
  MASR(T, t, { ev: [[2.2, "!"], [B(1) + 1.6, "?"], [B(2) + 0.5, "ok", "smile"]], look: [-0.9, -0.5], mouth: "o" });
};

// 4 — end: the blue that left your sunset beam lights someone else's afternoon to the west; last second returns to frame one
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette(0.25);
  const back = eio((t - (dur - 1.0)) / 0.9);
  skyPanel(40, 400, 480, 840, 1, 300, 520, 1 - back, true);
  skyPanel(560, 400, 480, 840, 38, 900, 1100, 1 - back, true);
  plate("west: afternoon", 280, 450, 40, INK, "center", (1 - back) * seg(t, 0.4, 0.8), 800); plate("you: sunset", 800, 450, 40, GOLD, "center", (1 - back) * seg(t, 0.4, 0.8), 800);
  // blue photons leave the beam on its way and fall into the western sky
  for (let i = 0; i < 18; i++) { const s = ((T * 0.7 + i / 18) % 1), x = lerp(1000, 300, (i % 6) / 6 + s * 0.1), y = lerp(1000, 640, s);
    dot(x - s * 260, y, 9, PCOL[2], (1 - back) * seg(t, 0.6, 1.2) * (1 - s * 0.6)); }
  line(1000, 1060, 540, 1000, SUNR, (1 - back) * 0.9, 12);
  if (back > 0.01) { skyPanel(40, 400, 1000, 400, 1, 760, 500, back); skyPanel(40, 830, 1000, 400, 38, 220, 1140, back); }
  MASR(T, t, { ev: [[1.2, "idea", "grin"]], look: [0.9, -0.8], mouth: "smile" });
};
