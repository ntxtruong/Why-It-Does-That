// Episode 14 (Short, 1080×1920, cut from ep 5) — How can noise cancel noise?
// Waves are closed-form: noise = A·sin(kx − ωt), anti-noise = −A·sin(kx − ωt + δ) (flipped, δ = delay as a phase).
// Their sum is drawn exactly, so δ = 0 gives a flat line and δ = π (half a cycle late) gives twice the height.
// Safe zone (Shorts UI): key content above y = 1536 and left of x = 940. Character at lower left.

const MAS = (T, o = {}) => mascot3(o.x ?? 150, o.y ?? 1560, o.s ?? 0.4, T, o);
const X0 = 70, X1 = 830, A = 95, OM = TAU2 * 0.45;
const kOf = lam => TAU2 / lam;
// draw a wave row: f(x) gives the height in px (positive up)
function wave(y, f, col, a = 1, lw = 7) {
  if (a <= 0.01) return; const pts = [];
  for (let x = X0; x <= X1; x += 6) pts.push([x, y - f(x)]);
  poly(pts, col, a, lw);
}
const noiseF = (t, lam = 360) => x => A * Math.sin(kOf(lam) * x - OM * t);
const antiF = (t, d = 0, lam = 360) => x => -A * Math.sin(kOf(lam) * x - OM * t + d);
// the ear cup at the right end of a row (where the sum arrives)
function ear(y, a = 1, calm = 1) {
  if (a <= 0.01) return;
  rrect(845, y - 70, 60, 140, 28, PANELc, a, mix(CORALc, GOLDc, calm), 5);
  text("ear", 875, y + 108, 40, QUIET, "center", 700, a);
}
// air dots pushed along the wave: displacement = D·cos(kx − ωt) gives squeezes where the pressure peaks
function air(y, t, a = 1) {
  if (a <= 0.01) return; const k = kOf(360);
  for (let r = 0; r < 4; r++) for (let i = 0; i < 70; i++) {
    const x0 = X0 + i * 12 + (r % 2) * 6, x = x0 - 22 * Math.cos(k * x0 - OM * t);
    dot(x, y - 45 + r * 30, 5, INKc, a * 0.7);
  }
}
const SCENES = {};

// 1 — hook: first frame = two big waves (noise coral, copy blue) sliding together into a flat gold line at the ear
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette();
  const u = eio((t - 0.15) / 1.5), yc = 900;
  const yN = lerp(700, yc, u), yA = lerp(1080, yc, u);
  wave(yN, noiseF(T), CORALc, 1 - 0.75 * u); wave(yA, antiF(T), BLUEc, 1 - 0.75 * u);
  wave(yc, x => noiseF(T)(x) + antiF(T)(x), GOLDc, u, 9);
  ear(yc, 1, u);
  text("noise", X0, yN - 130, 44, CORAL, "left", 800, 1 - u);
  text("copy", X0, yA - 130, 44, BLUE, "left", 800, 1 - u);
  plate("silence", 520, yc - 150, 50, GOLD, "center", seg(t, 1.5, 1.9) * (1 - seg(t, B(1) - 0.2, B(1) + 0.2)), 800);
  plate("not a wall: it adds sound", 580, 1130, 50, INK, "center", seg(t, B(1) + 0.2, B(1) + 0.6), 800);
  MASR(T, t, { ev: [[1.5, "!", "smile"], [B(1) + 0.3, "ok"]],  look: [0.9, -0.5], mouth: u < 0.5 ? "wince" : "smile" });
};

// 2 — wave: squeezed / stretched air; a microphone listens; a flipped copy; the sum is almost nothing
SCENES.wave = (t, T, B, E, dur) => {
  clear(); vignette();
  const yN = 640, yA = 900, yS = 1130;
  air(yN, T, seg(t, 0, 0.5) * (1 - 0.6 * seg(t, B(1), B(1) + 0.6)));
  wave(yN, noiseF(T), CORALc, seg(t, 0.3, 0.9));
  // labels at a squeeze (dense dots) and a stretch: positions follow the travelling wave
  const k = kOf(360), xs = ((OM * T / k) % 360 + 360) % 360 + X0 + 60, xp = xs + 180;
  const lab = win(t, 0.8, B(1) - 0.1, 0.3);
  text("squeeze", xs, yN - 140, 48, INK, "center", 800, lab);
  text("stretch", xp, yN - 140, 48, QUIET, "center", 800, lab);
  // the microphone listens, then the flipped copy is drawn
  const mic = seg(t, B(1), B(1) + 0.5), cp = seg(t, B(1) + 1.6, B(1) + 2.6);
  rrect(X0 + 10, yN + 120, 46, 70, 22, QUIETc, mic); line(X0 + 33, yN + 190, X0 + 33, yN + 225, QUIETc, mic, 6);
  text("mic", X0 + 80, yN + 155, 42, QUIET, "left", 700, mic);
  wave(yA, antiF(T), BLUEc, cp);
  text("flipped copy", X0, yA + 140, 44, BLUE, "left", 800, cp);
  // sum at the ear
  const sm = seg(t, B(2) + 0.6, B(2) + 1.4);
  wave(yS, x => noiseF(T)(x) + antiF(T)(x), GOLDc, sm, 9);
  ear(yS, sm, 1);
  plate("together ≈ 0", 520, yS - 110, 48, GOLD, "center", seg(t, B(2) + 1.8, B(2) + 2.2), 800);
  MASR(T, t, { ev: [[0.3, "?"], [B(1) + 1.8, "!"], [B(2) + 1.8, "ok", "grin"]],  look: [0.9, -0.6], mouth: "o" });
};

// 3 — catch: half a cycle late → twice the height; higher sounds have shorter cycles; works best on low hums
SCENES.catch = (t, T, B, E, dur) => {
  clear(); vignette();
  const yN = 640, yA = 860, yS = 1100;
  const d = Math.PI * eio((t - B(0) - 1.6) / 1.4) * (1 - eio((t - B(1) + 0.2) / 1.0));   // half a cycle late, then back
  const lam = lerp(360, 120, eio((t - B(1) - 0.3) / 1.5)) ;
  const lamB = t > B(2) - 0.2 ? lerp(120, 360, eio((t - B(2) + 0.2) / 1.2)) : lam;
  wave(yN, noiseF(T, lamB), CORALc, 1); wave(yA, antiF(T, d, lamB), BLUEc, 1);
  const s = x => noiseF(T, lamB)(x) + antiF(T, d, lamB)(x), big = Math.sin(d / 2);
  wave(yS, s, mix(GOLDc, CORALc, big), 1, 9);
  ear(yS, 1, 1 - big);
  plate("timing is everything", 520, 500, 50, INK, "center", win(t, 0.2, B(0) + 1.7, 0.3), 800);
  plate("half a cycle late → ×2", 520, 500, 50, CORAL, "center", win(t, B(0) + 1.9, B(1) - 0.1, 0.3), 800);
  plate("low hum: a few ms per cycle", 520, 500, 46, GOLD, "center", win(t, B(1) + 0.1, B(1) + 2.2, 0.3), 800);
  plate("higher: faster → harder", 520, 500, 48, CORAL, "center", win(t, B(1) + 2.4, B(2) - 0.1, 0.3), 800);
  const ok = seg(t, B(2) + 0.4, B(2) + 0.9), vo = seg(t, B(2) + 1.6, B(2) + 2.1);
  plate("steady low hum ✓", 330, 500, 46, GOLD, "center", ok, 800);
  plate("voices: less", 720, 500, 46, QUIET, "center", vo, 800);
  MASR(T, t, { ev: [[B(0) + 2.0, "!", "wince"], [B(1) + 2.4, "?"], [B(2) + 0.5, "idea", "grin"]],  look: [0.9, -0.5], mouth: big > 0.5 ? "wince" : "o" });
};

// 4 — end: back to the pair and the flat line; in the last second the waves part again (loops to frame 1)
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette();
  const u = 1 - eio((t - (dur - 1.0)) / 0.95), yc = 900;
  const yN = lerp(700, yc, u), yA = lerp(1080, yc, u);
  wave(yN, noiseF(T), CORALc, 1 - 0.75 * u); wave(yA, antiF(T), BLUEc, 1 - 0.75 * u);
  wave(yc, x => noiseF(T)(x) + antiF(T)(x), GOLDc, u, 9);
  ear(yc, 1, u);
  plate("two loud waves", 580, 1130, 52, INK, "center", win(t, 0.2, dur - 1.0, 0.3), 800);
  plate("one quiet ear", 580, 1230, 52, GOLD, "center", win(t, 0.9, dur - 1.0, 0.3), 800);
  MASR(T, t, { ev: [[0.4, "ok", "smile"]],  look: [0.9, -0.5], mouth: "smile" });
};
