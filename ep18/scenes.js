// Episode 18 (new Short, 1080×1920) — Why are bubbles always round?
// Bubble outline r(θ, t) = R·(shape blend from the square wand to a circle) + damped wobble modes
// Σ a_n e^{−t/τ} cos(nθ + φ_n) cos(ω_n t) (n = 2–4), the way a real film relaxes. The cube/sphere comparison uses
// the exact areas for equal volume: sphere (36π)^(1/3) ≈ 4.84, cube 6.00 → +24%. Pure functions of time.
// Safe zone (Shorts UI): key content above y = 1536 and left of x = 940.

const MAS = (T, o = {}) => mascot3(o.x ?? 150, o.y ?? 1560, o.s ?? 0.4, T, o);
const WAND = [330, 1130], WS = 210;
// superellipse-ish square radius at angle th for half-side h
const sq = (th, h) => h / Math.max(Math.abs(Math.cos(th)), Math.abs(Math.sin(th)));
function bubble(cx, cy, R, round, wob, T, a = 1, tint = 1) {
  if (a <= 0.01) return; const pts = [];
  for (let k = 0; k <= 120; k++) {
    const th = k / 120 * TAU2;
    let r = lerp(sq(th, R * 0.886), R, round);    // the square with the same area as the circle (side √π·R)
    r *= 1 + wob * (0.07 * Math.cos(2 * th + 0.4) * Math.cos(T * 9) + 0.05 * Math.cos(3 * th + 1.1) * Math.cos(T * 13 + 1) + 0.03 * Math.cos(4 * th) * Math.cos(T * 17));
    pts.push([cx + r * Math.cos(th), cy + r * Math.sin(th)]);
  }
  poly(pts, null, a * 0.18, 0, true, BLUEc);
  // soft thin-film tint bands (no glare): two arcs inside the rim
  poly(pts, INKc, a * 0.85, 5, true);
  g.save(); g.globalAlpha = a * 0.5 * tint; g.lineWidth = 10; g.lineCap = "round";
  g.strokeStyle = css(GOLDc); g.beginPath(); g.arc(cx, cy, R * 0.82, -2.6, -1.9); g.stroke();
  g.strokeStyle = css(BLUEc); g.beginPath(); g.arc(cx, cy, R * 0.82, 0.5, 1.2); g.stroke(); g.restore();
}
function wand(x, y, a = 1, film = 0) {
  if (a <= 0.01) return;
  line(x - WS / 2 - 10, y + WS / 2 + 10, 150, 1440, [180, 150, 110], a, 14);   // handle toward the character's hand
  if (film > 0.01) rrect(x - WS / 2, y - WS / 2, WS, WS, 10, BLUEc, a * 0.25 * film);
  rrect(x - WS / 2, y - WS / 2, WS, WS, 10, null, a, [200, 170, 120], 12);
}
const SCENES = {};

// 1 — hook: first frame = a square film leaving the square wand, wobbling, rounding as it floats up
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette();
  wand(WAND[0], WAND[1], 1, 1 - seg(t, 0, 0.3));
  const u = eout(t / 3.0), cx = lerp(WAND[0], 600, u), cy = lerp(WAND[1], 720, u), R = lerp(118, 170, u);
  bubble(cx, cy, R, eio((t - 0.2) / 1.6), Math.exp(-t / 1.6) * 1.2, T);
  plate("square wand", 560, 1300, 44, INK, "center", seg(t, B(1), B(1) + 0.4), 800);
  plate("round bubble", 640, 1000, 44, GOLD, "center", seg(t, B(1) + 1.4, B(1) + 1.8), 800);
  MAS(T, { look: [0.9, -0.8], mouth: "o" });
};

// 2 — film: surface tension pulls the film in; the air inside pushes back; the least surface for that air
SCENES.film = (t, T, B, E, dur) => {
  clear(); vignette();
  const C = [540, 860], R = 250, srch = win(t, B(2) - 0.4, B(2) + 2.4, 0.6);
  bubble(C[0], C[1], R, 1, 0.25 + 0.9 * srch, T);
  const pull = seg(t, 0.8, 1.6), push = seg(t, B(1), B(1) + 0.8);
  for (let k = 0; k < 8; k++) { const th = k / 8 * TAU2 + 0.2, o = [C[0] + (R + 70) * Math.cos(th), C[1] + (R + 70) * Math.sin(th)], i = [C[0] + (R + 10) * Math.cos(th), C[1] + (R + 10) * Math.sin(th)];
    arrow(o[0], o[1], i[0], i[1], GOLDc, pull, 7, 20);
    const p0 = [C[0] + (R - 120) * Math.cos(th + 0.39), C[1] + (R - 120) * Math.sin(th + 0.39)], p1 = [C[0] + (R - 30) * Math.cos(th + 0.39), C[1] + (R - 30) * Math.sin(th + 0.39)];
    arrow(p0[0], p0[1], p1[0], p1[1], BLUEc, push, 7, 20); }
  plate("surface tension pulls in", 540, 420, 48, GOLD, "center", win(t, 0.8, B(1) - 0.1, 0.3), 800);
  plate("the air inside pushes back", 540, 420, 48, BLUE, "center", win(t, B(1) + 0.2, B(2) - 0.1, 0.3), 800);
  plate("least surface for that air", 540, 420, 48, INK, "center", seg(t, B(2) + 0.3, B(2) + 0.8), 800);
  MAS(T, { look: [0.9, -0.7], mouth: "o" });
};

// 3 — sphere: cube vs sphere with the same air; +24% film for the cube; a bulge is pulled back and the wobble fades
function cube(cx, cy, s, a = 1) {   // simple oblique cube
  if (a <= 0.01) return; const d = s * 0.35;
  poly([[cx - s / 2, cy - s / 2], [cx + s / 2, cy - s / 2], [cx + s / 2, cy + s / 2], [cx - s / 2, cy + s / 2]], INKc, a, 5, true, [80, 120, 190]);
  poly([[cx - s / 2, cy - s / 2], [cx - s / 2 + d, cy - s / 2 - d], [cx + s / 2 + d, cy - s / 2 - d], [cx + s / 2, cy - s / 2]], INKc, a, 5, true, [110, 150, 215]);
  poly([[cx + s / 2, cy - s / 2], [cx + s / 2 + d, cy - s / 2 - d], [cx + s / 2 + d, cy + s / 2 - d], [cx + s / 2, cy + s / 2]], INKc, a, 5, true, [60, 95, 160]);
}
SCENES.sphere = (t, T, B, E, dur) => {
  clear(); vignette();
  const cmp = win(t, 0.2, B(1) - 0.2, 0.4), s = 230, Rs = s * Math.cbrt(3 / (4 * Math.PI));   // same volume
  cube(280, 760, s, cmp); bubble(720, 740, Rs * 1.0, 1, 0.1, T, cmp);
  text("same air", 500, 930, 44, QUIET, "center", 700, cmp);
  // area bars for equal volume: sphere 4.84, cube 6.00
  const ba = seg(t, B(0) + 2.2, B(0) + 3.0) * cmp, bw = 330;
  text("film needed for the same air", 380, 990, 42, INK, "left", 800, ba);
  rrect(380, 1040, bw * 6.0 / 6, 56, 12, CORALc, ba); text("cube  6.00", 390, 1140, 42, CORAL, "left", 800, ba);
  rrect(380, 1200, bw * 4.84 / 6, 56, 12, GOLDc, ba); text("sphere  4.84", 390, 1300, 42, GOLD, "left", 800, ba);
  plate("cube: +24% film", 600, 1400, 50, CORAL, "center", seg(t, B(0) + 3.2, B(0) + 3.7) * cmp, 800);
  plate("sphere = least film", 540, 420, 48, GOLD, "center", win(t, 0.6, B(1) - 0.2, 0.3), 800);
  // the bulge: an n = 3 mode kicked at t0, pulled back, the wobble fading
  const bb = seg(t, B(1) - 0.2, B(1) + 0.3), t0 = B(1) + 0.5, u = Math.max(0, t - t0);
  if (bb > 0.01) {
    const C = [540, 860], R = 240, amp = t < t0 ? 0.25 * seg(t, B(1), t0) : 0.25 * Math.exp(-u / 0.9) * Math.cos(u * 8);
    const pts = []; for (let k = 0; k <= 120; k++) { const th = k / 120 * TAU2, r = R * (1 + amp * Math.exp(-Math.pow((th - 5.5) / 0.45, 2))); pts.push([C[0] + r * Math.cos(th), C[1] + r * Math.sin(th)]); }
    poly(pts, null, bb * 0.18, 0, true, BLUEc); poly(pts, INKc, bb * 0.85, 5, true);
    plate("bulge = extra film", 540, 420, 48, CORAL, "center", win(t, B(1) + 0.2, B(1) + 2.6, 0.3) * bb, 800);
    plate("pulled back · wobbles fade", 540, 420, 46, GOLD, "center", seg(t, B(1) + 2.8, B(1) + 3.2) * bb, 800);
  }
  MAS(T, { look: [0.9, -0.7], mouth: t > B(1) + 3 ? "grin" : "o" });
};

// 4 — end: the wand shapes the start, physics shapes the bubble; returns to the opening frame (loop)
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette();
  const back = eio((t - (dur - 1.0)) / 0.95);
  wand(WAND[0], WAND[1], 1, back);
  const cx = lerp(600, WAND[0], back), cy = lerp(720 - 30 * Math.sin(t * 1.2), WAND[1], back), R = lerp(170, 118, back);
  bubble(cx, cy, R, 1 - back, 0.15 * (1 - back), T);
  plate("wand: the start", 600, 420, 48, INK, "center", win(t, 0.3, dur - 1.0, 0.3), 800);
  plate("physics: the bubble", 600, 520, 48, GOLD, "center", win(t, 1.6, dur - 1.0, 0.3), 800);
  MAS(T, { look: [0.9, -0.8], mouth: "smile" });
};
