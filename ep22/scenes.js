// Episode 22 (new Short, 1080×1920) — Why does a spoon look broken in water?
// Physics (claims.md): n_water = 1.333, so light in water moves at c/1.333 ≈ 0.75 c. Seen from above the rim at a slant,
// light from an underwater point P leaves the surface at S, bending away from the normal (Snell: n sin θw = sin θa), and
// reaches the eye E. The brain traces the air ray E→S straight back; the image of P is where that line meets the vertical
// through P (sagittal image, for two eyes side by side): apparent depth d' = d · tan θw / tan θa (→ d / n near the vertical).
// The surface point S is solved from Snell's law by bisection (monotonic, deterministic); every ghost point is computed,
// none hand-placed. View is a cross-section from the side; the eye looks across the open top, not through the glass wall.

const NW = 1.333, SY = 630;                                  // water index, water surface (px)
const GX0 = 270, GX1 = 850, GTOP = 600, GBOT = 1200, TAPER = 14; // glass
const EYE = [900, 505];
// the spoon: bowl end B0, axis at 30° from vertical, length L; it crosses the surface at x = 620
const SA = 30 * Math.PI / 180, UX = Math.sin(SA), UY = -Math.cos(SA), NX = Math.cos(SA), NY = Math.sin(SA);
const B0 = [620 - 600 * UX, SY + 600 * Math.cos(SA)], SL = 802;
const STEEL = [204, 214, 228], STEEL2 = [120, 134, 158], STEEL3 = [158, 172, 196];

// ---- refraction ----
// surface point S for an underwater point P and the eye E (n sin θw = sin θa)
function surfX(P, E = EYE) {
  const d = P[1] - SY, h = SY - E[1];
  let a = P[0], b = E[0];
  for (let i = 0; i < 44; i++) {
    const m = (a + b) / 2, sw = (m - P[0]) / Math.hypot(m - P[0], d), sa = (E[0] - m) / Math.hypot(E[0] - m, h);
    if (NW * sw - sa < 0) a = m; else b = m;
  }
  return (a + b) / 2;
}
// apparent (seen) position of a point: unchanged in air; under water, back-traced to the vertical through it
function appar(P) {
  if (P[1] <= SY + 0.01) return P;
  const xs = surfX(P), d2 = (xs - P[0]) * (SY - EYE[1]) / (EYE[0] - xs);
  return [P[0], SY + d2];
}
function rayOf(P) { const xs = surfX(P), S = [xs, SY], A = appar(P);
  const tw = Math.atan2(xs - P[0], P[1] - SY), ta = Math.atan2(EYE[0] - xs, SY - EYE[1]);
  return { P, S, A, E: EYE, tw, ta, Lw: Math.hypot(xs - P[0], P[1] - SY), La: Math.hypot(EYE[0] - xs, SY - EYE[1]) }; }

// ---- spoon geometry (local u along the axis from the bowl end, v across) ----
function sw(u) {
  const bowl = u < 176 ? 56 * Math.sqrt(Math.max(0, 1 - ((u - 88) / 88) ** 2)) : 0;
  let hd = u < 168 ? 0 : lerp(12, 24, (u - 168) / (SL - 168));
  if (u > SL - 20) hd *= Math.sqrt(Math.max(0, 1 - ((u - (SL - 20)) / 20) ** 2));
  return Math.max(bowl, hd);
}
function sp(u, v, pose) { const [bx, by] = pose.b; return [bx + u * UX + v * NX, by + u * UY + v * NY]; }
const US = []; for (let i = 0; i <= 160; i++) { const k = i / 160; US.push(k < 0.3 ? SL * 0.25 * (k / 0.3) : SL * (0.25 + 0.75 * (k - 0.3) / 0.7)); }
function outline(pose, wf = sw, m = 1, uMax = SL) {
  const us = US.filter(u => u <= uMax).concat(uMax < SL ? [uMax] : []);
  const L = us.map(u => sp(u, wf(u), pose)), R = us.slice().reverse().map(u => sp(u, -wf(u), pose));
  return L.concat(R).map(P => { if (m <= 0) return P; const A = appar(P); return [lerp(P[0], A[0], m), lerp(P[1], A[1], m)]; });
}
function path(pts) { g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); }
// draw the spoon. m = 0 real position, 1 as seen; style: "steel" | "ghost" | "outline"
function spoon(pose, m, style = "steel", a = 1, uMax = SL) {
  if (a <= 0.01) return;
  const o = outline(pose, sw, m, uMax);
  g.save(); g.globalAlpha = a; g.lineJoin = "round";
  if (style === "steel") {
    const p1 = sp(SL * 0.5, -40, pose), p2 = sp(SL * 0.5, 40, pose), gr = g.createLinearGradient(p1[0], p1[1], p2[0], p2[1]);
    gr.addColorStop(0, css(STEEL3)); gr.addColorStop(0.45, css([238, 244, 251])); gr.addColorStop(1, css(STEEL));
    path(o); g.fillStyle = gr; g.fill(); g.strokeStyle = "rgb(70,84,112)"; g.lineWidth = 6; g.stroke();
    // the bowl's hollow and a highlight along the handle
    const inner = outline({ b: sp(14, 4, pose) }, u => u < 150 ? 0.66 * 56 * Math.sqrt(Math.max(0, 1 - ((u - 74) / 74) ** 2)) : 0, m, 150);
    path(inner); g.fillStyle = css(STEEL3); g.fill();
    const hl = []; for (let u = 230; u < SL - 30; u += 12) { const P = sp(u, -4, pose); const A = appar(P); hl.push([lerp(P[0], A[0], m), lerp(P[1], A[1], m)]); }
    g.globalAlpha = a * 0.85; g.strokeStyle = "#F7FAFF"; g.lineWidth = 5; g.lineCap = "round";
    g.beginPath(); hl.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
  } else if (style === "ghost") {
    path(o); g.fillStyle = css(GOLDc, 0.3); g.fill(); g.setLineDash([16, 12]); g.strokeStyle = css(GOLDc); g.lineWidth = 5; g.stroke();
  } else {
    path(o); g.setLineDash([12, 12]); g.strokeStyle = css(INKc, 0.85); g.lineWidth = 4; g.stroke();
  }
  g.restore();
}
const REST = { b: B0 };

// ---- scene pieces ----
const xl = y => GX0 + TAPER * (y - GTOP) / (GBOT - GTOP), xr = y => GX1 - TAPER * (y - GTOP) / (GBOT - GTOP);
function room() {
  clear(BG);
  const gr = g.createRadialGradient(560, 820, 60, 560, 820, 700);   // soft light on the wall behind the glass
  gr.addColorStop(0, "rgb(70,98,166)"); gr.addColorStop(0.6, "rgb(50,74,134)"); gr.addColorStop(1, "rgb(24,38,79)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // the table
  const tg = g.createLinearGradient(0, GBOT, 0, 1320); tg.addColorStop(0, "rgb(96,118,176)"); tg.addColorStop(1, "rgb(44,62,112)");
  g.fillStyle = tg; g.fillRect(0, GBOT - 4, W, 120);
  g.fillStyle = "rgba(14,22,48,0.35)"; g.beginPath(); g.ellipse(560, GBOT + 6, 330, 18, 0, 0, TAU2); g.fill();
}
function glassBack() {
  g.save(); g.fillStyle = "rgba(210,232,255,0.10)";
  g.beginPath(); g.moveTo(GX0, GTOP); g.lineTo(xl(GBOT), GBOT); g.lineTo(xr(GBOT), GBOT); g.lineTo(GX1, GTOP); g.closePath(); g.fill(); g.restore();
}
function water() {
  const y1 = GBOT - 30;
  const gr = g.createLinearGradient(0, SY, 0, y1); gr.addColorStop(0, "rgba(160,212,255,0.34)"); gr.addColorStop(1, "rgba(110,175,240,0.46)");
  g.fillStyle = gr; g.beginPath(); g.moveTo(xl(SY), SY); g.lineTo(xl(y1), y1); g.lineTo(xr(y1), y1); g.lineTo(xr(SY), SY); g.closePath(); g.fill();
  // the surface, seen slightly from above
  const cx = (GX0 + GX1) / 2, rx = (xr(SY) - xl(SY)) / 2;
  g.fillStyle = "rgba(205,234,255,0.30)"; g.beginPath(); g.ellipse(cx, SY, rx, 20, 0, 0, TAU2); g.fill();
  g.strokeStyle = "rgba(236,247,255,0.95)"; g.lineWidth = 4; g.beginPath(); g.ellipse(cx, SY, rx, 20, 0, 0, Math.PI); g.stroke();
  g.strokeStyle = "rgba(236,247,255,0.5)"; g.beginPath(); g.ellipse(cx, SY, rx, 20, 0, Math.PI, TAU2); g.stroke();
}
function glassFront() {
  g.save(); g.lineJoin = "round"; g.lineCap = "round";
  g.fillStyle = "rgba(205,228,255,0.55)"; g.beginPath(); g.roundRect(xl(GBOT - 30), GBOT - 30, xr(GBOT - 30) - xl(GBOT - 30), 32, 10); g.fill();
  g.strokeStyle = "rgba(232,244,255,0.92)"; g.lineWidth = 10;
  g.beginPath(); g.moveTo(GX0, GTOP); g.lineTo(xl(GBOT), GBOT - 10); g.quadraticCurveTo(xl(GBOT), GBOT, xl(GBOT) + 14, GBOT); g.lineTo(xr(GBOT) - 14, GBOT); g.quadraticCurveTo(xr(GBOT), GBOT, xr(GBOT), GBOT - 10); g.lineTo(GX1, GTOP); g.stroke();
  g.lineWidth = 6; g.strokeStyle = "rgba(232,244,255,0.85)"; g.beginPath(); g.ellipse((GX0 + GX1) / 2, GTOP, (GX1 - GX0) / 2, 22, 0, 0, TAU2); g.stroke();
  // highlights on the glass
  g.fillStyle = "rgba(255,255,255,0.22)"; g.beginPath(); g.moveTo(GX0 + 30, GTOP + 40); g.lineTo(GX0 + 62, GTOP + 40); g.lineTo(xl(GBOT) + 66, GBOT - 60); g.lineTo(xl(GBOT) + 36, GBOT - 60); g.closePath(); g.fill();
  g.fillStyle = "rgba(255,255,255,0.12)"; g.beginPath(); g.moveTo(GX1 - 40, GTOP + 60); g.lineTo(GX1 - 28, GTOP + 60); g.lineTo(xr(GBOT) - 26, GBOT - 80); g.lineTo(xr(GBOT) - 38, GBOT - 80); g.closePath(); g.fill();
  g.restore();
}
// the whole glass with a spoon pose; m = 0 real, 1 as seen
function glassScene(pose, m, a = 1) { glassBack(); spoon(pose, m, "steel", a); water(); glassFront(); }

function eye(a) {
  if (a <= 0.01) return;
  const [x, y] = EYE, an = Math.atan2(SY - y, 700 - x);
  g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(an + Math.PI); g.scale(1.35, 1.35);
  g.fillStyle = "#F2F5FB"; g.strokeStyle = "#111421"; g.lineWidth = 6;
  g.beginPath(); g.moveTo(-40, 0); g.quadraticCurveTo(0, -30, 40, 0); g.quadraticCurveTo(0, 30, -40, 0); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#3a6db0"; g.beginPath(); g.arc(-14, 0, 15, 0, TAU2); g.fill(); g.fillStyle = "#111421"; g.beginPath(); g.arc(-17, 0, 7, 0, TAU2); g.fill();
  g.restore();
}
// a gold ray P→S→E drawn up to fraction p of its length; dim = alpha of the underwater part
function ray(R, p = 1, a = 1, lw = 7, wa = 1) {
  if (a <= 0.01 || p <= 0) return;
  const tot = R.Lw + R.La, s = p * tot;
  const k1 = Math.min(1, s / R.Lw), q = [lerp(R.P[0], R.S[0], k1), lerp(R.P[1], R.S[1], k1)];
  line(R.P[0], R.P[1], q[0], q[1], GOLDc, a * wa, lw);
  if (s > R.Lw) { const k2 = Math.min(1, (s - R.Lw) / R.La); line(R.S[0], R.S[1], lerp(R.S[0], R.E[0], k2), lerp(R.S[1], R.E[1], k2), GOLDc, a, lw); }
  dot(R.P[0], R.P[1], 11, GOLDc, a);
}
// light pulses moving along the ray: speed v in air, v/1.333 in water (so they bunch up under water)
function pulses(R, t, t0, a = 1) {
  if (a <= 0.01 || t < t0) return;
  const v = 300, Tw = R.Lw / (v / NW), Ta = R.La / v, gap = 0.3;
  for (let j = 0; j * gap < Tw + Ta + gap; j++) {
    const tau = ((t - t0) % gap) + j * gap; if (tau > Tw + Ta || tau > t - t0) continue;
    let x, y;
    if (tau < Tw) { const k = tau / Tw; x = lerp(R.P[0], R.S[0], k); y = lerp(R.P[1], R.S[1], k); }
    else { const k = (tau - Tw) / Ta; x = lerp(R.S[0], R.E[0], k); y = lerp(R.S[1], R.E[1], k); }
    soft(x, y, 26, [255, 236, 170], a * 0.8); dot(x, y, 8, [255, 248, 220], a);
  }
}
// dashed straight-back line from the eye through S into the water, to fraction p of the way to A
function backTrace(R, p, a = 1) {
  if (a <= 0.01 || p <= 0) return;
  const x = lerp(R.S[0], R.A[0], p), y = lerp(R.S[1], R.A[1], p);
  line(R.E[0], R.E[1], R.S[0], R.S[1], GOLDc, a * 0.9, 5, [14, 12]);
  line(R.S[0], R.S[1], x, y, GOLDc, a, 5, [14, 12]);
  if (p >= 0.98) { dot(R.A[0], R.A[1], 12, GOLDc, a); }
}
const RB = rayOf(sp(88, 0, REST));    // the ray from the middle of the bowl
const deg = r => Math.round(r * 180 / Math.PI);
const look = [0.9, -0.8];

const SCENES = {};

// 1 — hook: frame one = the glass with the spoon kinked at the surface; a hand pulls it out (straight), puts it back
SCENES.hook = (t, T, B, E, dur) => {
  room();
  const up = seg(t, B(1) + 0.15, B(1) + 0.85) * (1 - seg(t, B(1) + 1.55, B(1) + 2.2)), lift = 570 * up;
  const pose = { b: [B0[0], B0[1] - lift] };
  glassScene(pose, 1);
  // the hand: comes down to the handle, lifts, puts back, leaves
  const h = seg(t, B(1) - 0.35, B(1) + 0.1) * (1 - seg(t, B(1) + 2.2, dur));
  if (h > 0.01) {
    const G = sp(SL * 0.87, 0, pose), off = (1 - h) * 260, x = G[0] + off * 0.55, y = G[1] - off;
    g.save(); g.translate(x, y); g.rotate(SA);
    g.lineCap = "round"; g.strokeStyle = "#F2F5FB"; g.lineWidth = 92; g.beginPath(); g.moveTo(0, -20); g.lineTo(0, -420); g.stroke();
    g.strokeStyle = "#22273a"; g.lineWidth = 72; g.beginPath(); g.moveTo(0, -60); g.lineTo(0, -420); g.stroke();
    g.fillStyle = "#f6e3d3"; g.strokeStyle = "#F2F5FB"; g.lineWidth = 6; g.beginPath(); g.roundRect(-44, -56, 88, 96, 30); g.fill(); g.stroke();
    g.strokeStyle = "#d9b49c"; g.lineWidth = 4; [-12, 6, 24].forEach(yy => { g.beginPath(); g.moveTo(-6, yy); g.lineTo(38, yy); g.stroke(); });
    g.restore();
  }
  const k = win(t, 0.9, B(1) - 0.1, 0.3);
  if (k > 0.01) { g.save(); g.globalAlpha = k; g.strokeStyle = css(CORALc); g.lineWidth = 7; g.setLineDash([16, 10]); g.beginPath(); g.arc(620, SY + 20, 96, 0, TAU2); g.stroke(); g.restore(); }
  plate("broken?", 430, 520, 48, CORAL, "center", k, 900);
  MASR(T, t, { ev: [[0.4, "?"], [B(1) + 0.9, "!", "grin"]], look, mouth: "o" });
};

// 2 — ray: the spoon where it really is; light leaves the bowl and reaches the eye; slower in water
SCENES.ray = (t, T, B, E, dur) => {
  room();
  const m = 1 - seg(t, 0.2, 1.3);
  glassScene(REST, m);
  plate("where the spoon really is", 640, 1160, 42, INK, "center", win(t, 1.0, B(1) - 0.2, 0.35), 800);
  eye(seg(t, 0.4, 1.0)); plate("your eye", 860, 420, 40, INK, "center", win(t, 0.6, B(1), 0.3), 800);
  ray(RB, seg(t, 1.2, 3.6), 1);
  pulses(RB, t, 3.6, seg(t, 3.6, 4.0));
  // the speed panel
  const p = seg(t, B(1) - 0.1, B(1) + 0.5), X = 90, bw = 330;
  rrect(60, 380, 640, 200, 24, [24, 34, 70], p * 0.92);
  text("air", X, 430, 42, INK, "left", 800, p); rrect(X + 160, 410, bw * p, 40, 10, GOLDc, p); text("c", X + 160 + bw + 14, 430, 42, GOLD, "left", 900, p);
  const p2 = seg(t, B(1) + 0.6, B(1) + 1.6);
  text("water", X, 520, 42, INK, "left", 800, p); rrect(X + 160, 500, bw * 0.75 * p2, 40, 10, BLUEc, p); text("0.75 c", X + 160 + bw * 0.75 + 14, 520, 42, BLUE, "left", 900, p2);
  MASR(T, t, { ev: [[1.0, "?"], [B(1) + 1.6, "idea", "smile"]], look, mouth: "o" });
};

// 3 — bend: the ray bends at the surface; the brain traces it straight back and "sees" the bowl higher
SCENES.bend = (t, T, B, E, dur) => {
  room();
  glassScene(REST, 0);
  eye(1);
  const tb = B(0) + 2.5;     // "bends"
  const nA = seg(t, B(0) + 0.6, B(0) + 1.2);
  const S = RB.S;
  line(S[0], S[1] - 150, S[0], S[1] + 170, INKc, nA * 0.75, 4, [10, 10]);
  ray(RB, 1, 1, 7, 1 - 0.45 * seg(t, B(1) + 0.4, B(1) + 1.4));
  pulses(RB, t, -10, 1 - seg(t, B(1), B(1) + 0.8));
  // angles from the normal (computed from Snell's law)
  const aA = seg(t, B(0) + 1.3, B(0) + 2.1) * (1 - 0.6 * seg(t, B(1), B(1) + 0.6));
  if (aA > 0.01) {
    g.save(); g.globalAlpha = aA; g.lineWidth = 5;
    g.strokeStyle = css(BLUEc); g.beginPath(); g.arc(S[0], S[1], 92, Math.PI / 2, Math.atan2(RB.P[1] - S[1], RB.P[0] - S[0])); g.stroke();
    g.strokeStyle = css(GOLDc); g.beginPath(); g.arc(S[0], S[1], 92, -Math.PI / 2, Math.atan2(EYE[1] - S[1], EYE[0] - S[0])); g.stroke();
    g.restore();
    const aL = seg(t, B(0) + 1.3, B(0) + 2.1);
    plate(`${deg(RB.tw)}°`, S[0] + 10, S[1] + 215, 46, BLUE, "center", aL, 900);
    plate(`${deg(RB.ta)}°`, S[0] + 82, S[1] - 120, 46, GOLD, "center", aL, 900);
  }
  const kb = spring(t, tb, 10, 0.6);
  if (t > tb) { g.save(); g.globalAlpha = 1 - seg(t, B(1), B(1) + 0.6); g.strokeStyle = css(GOLDc); g.lineWidth = 6; g.beginPath(); g.arc(S[0], S[1], 34 * clamp(kb, 0, 1.2), 0, TAU2); g.stroke(); g.restore(); }
  plate("bends here", 470, 530, 46, GOLD, "center", win(t, tb, B(1) + 0.2, 0.3), 900);
  // the brain's straight line back
  const bt = seg(t, B(1) + 0.2, B(2) + 1.2);
  backTrace(RB, bt, 1);
  plate("brain: “light goes straight”", 540, 450, 42, INK, "center", win(t, B(1) + 0.3, B(2) + 0.3, 0.3), 800);
  // the bowl seen higher: ghost of the bowl at the back-traced spot
  const gh = seg(t, B(2) + 1.1, B(2) + 1.9);
  spoon(REST, 1, "ghost", gh, 200);
  const ar = seg(t, B(2) + 1.8, B(2) + 2.6), P = RB.P, A = RB.A;
  if (ar > 0.01) arrow(P[0] - 70, P[1], P[0] - 70, lerp(P[1], A[1] + 24, ar), CORALc, ar, 7, 24);
  plate("seen higher", 470, 530, 46, CORAL, "center", seg(t, B(2) + 2.4, B(2) + 2.9), 900);
  MASR(T, t, { ev: [[tb, "!", "grin"], [B(1) + 0.4, "?"]], look, mouth: "o" });
};

// 4 — snap: rays from all along the underwater part, each traced back; the seen spoon builds up lifted and kinks at the surface
const UW = [88, 260, 420, 560], RS = UW.map(u => rayOf(sp(u, 0, REST)));
SCENES.snap = (t, T, B, E, dur) => {
  room();
  const sw2 = seg(t, B(1) + 0.2, B(1) + 1.4);      // real spoon → outline, seen spoon → solid
  glassBack(); spoon(REST, 0, "steel", 1 - sw2); water(); glassFront();
  spoon(REST, 0, "outline", sw2 * (1 - seg(t, dur - 1.6, dur - 0.6)));
  eye(1 - seg(t, B(1) + 1.4, B(1) + 2.2));
  const fadeR = 1 - seg(t, B(1) + 0.4, B(1) + 1.6);
  RS.forEach((R, i) => {
    const t0 = i ? 0.5 + i * 0.75 : -1;
    ray(R, i ? seg(t, t0, t0 + 0.5) : 1, fadeR * (i ? 0.45 : 0.95), i ? 3 : 5, 0.85);
    backTrace(R, i ? seg(t, t0 + 0.4, t0 + 0.9) : 1, fadeR * (i ? 0.55 : 1));
  });
  // the seen spoon builds up from the bowl as the rays land
  const reach = lerp(200, 600, seg(t, 0.9, 3.9));   // the seen part ends at the surface (above it, seen = real)
  spoon(REST, 1, "ghost", 1 - sw2, reach);
  spoon(REST, 1, "steel", sw2);
  plate("in air: true", 800, 410, 44, INK, "center", win(t, B(0) + 0.2, B(1) + 0.3, 0.3), 800);
  plate("under water: lifted", 390, 540, 44, GOLD, "center", win(t, B(0) + 2.6, B(1) + 0.3, 0.3), 900);
  const kk = seg(t, B(1) + 0.8, B(1) + 1.3) * (1 - seg(t, dur - 1.2, dur - 0.4));
  if (kk > 0.01) { g.save(); g.globalAlpha = kk; g.strokeStyle = css(GOLDc); g.lineWidth = 7; g.beginPath(); g.arc(620, SY + 20, 96, 0, TAU2); g.stroke(); g.restore(); }
  plate("snaps at the surface", 380, 520, 46, GOLD, "center", kk, 900);
  MASR(T, t, { ev: [[B(0) + 2.8, "idea"], [B(1) + 1.0, "!", "grin"]], look, mouth: "o" });
};

// 5 — end: the payoff; the last second is the opening frame (loop)
SCENES.end = (t, T, B, E, dur) => {
  room();
  glassScene(REST, 1);
  // a faint reminder of the light path, gone before the loop frame
  const r = win(t, 0.2, dur - 1.3, 0.5);
  plate("straight spoon, bent light", 620, 1262, 44, GOLD, "center", win(t, 0.5, dur - 1.15, 0.35), 900);
  eye(r); ray(RB, 1, r * 0.8, 5); pulses(RB, t, -10, r);
  MASR(T, t, { ev: [[1.6, "ok", "grin"]], look, mouth: "o" });
};
