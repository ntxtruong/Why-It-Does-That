// Episode 62 (v5 Short, 1080×1920, "Why Is It Designed Like That?" / Everyday Physics, hook=try len=short look=flat, NO mascot):
// cut a Möbius strip (paper loop with one half twist) down the middle: you get ONE ring, twice as long (4 half twists).
// A cut a third in gives two linked rings: a thin Möbius strip (original length) and a long ring with two half twists.
// Facts: factcheck.md (Wikipedia "Möbius strip", MathWorld, Brilliant, Gardner/Scientific American 1957).
//
// One stage: a paper ribbon on a green cutting mat, seen from above. The ribbon is a parametric strip drawn as flat
// shaded quads sorted by depth (overlap gives the depth). The centre-cut strip is parametrised as ONE lane that goes
// round the loop twice (phi in [0, 4π)): the half twist hands lap 1's outer half to lap 2's inner half, which is
// exactly the "follow one half" explanation. Morphs between states are vertex lerps (pure functions of time).
//
// STORYBOARD (storyboard.md):
//  hook   0–4.64   loop with a half twist, scissors already cutting along the dashed centre line; "One cut. Two rings?"
//  guess  4.64–6.91 two ghost rings slide out on "Two rings?", struck out on "Nope" (5.98); scissors pass the twist
//  reveal 6.91–10.1 cut closes on "falls" (7.30): snap flash, the paper springs open into ONE long ring ("ONE ring")
//  why    10.1–17.6 folds back; blue paint runs along one half, the twist hands it to the other half (13.1 "swapped!"),
//                   second lap paints both halves, springs open again on "one strip" (15.6), "2× length", dot runs round
//  third  17.6–21.6 a fresh loop springs in, scissors go round TWICE on the 1/3 line, two rings separate (20.0), linked
//  end    21.6–24.5 "Two?"; the linked pair folds back into the frame-0 loop; the last 0.5 s are frame 0 exactly
window.NOPUSH = ["hook", "guess", "reveal", "why", "third", "end"];
window.NODIP = window.NOPUSH;

const MAT = [31, 74, 58], MAT_L = [46, 107, 84], PAPER = [255, 212, 94], PAPER_B = [226, 136, 40], EDGE = [92, 60, 18], INKD = [42, 47, 69];
const PAINT = [79, 195, 255], PAINT_B = [46, 142, 214], STEEL = [207, 216, 227], STEEL_D = [120, 132, 150], HANDLE = [255, 110, 92];
const CREAM = [250, 244, 222], DKG = [16, 44, 34], MARKER = [28, 120, 230];
const CX = 540, CY = 950, RX = 330, RY = 540, W0 = 180, GAP = 14, DT = 0.9, TS = Math.PI, PHT = (4 / 3) * Math.PI, TAU = TAU2;
const SNAP = 7.30, C0 = 0.10 * TAU, OPEN2 = 15.62, SEP = 20.0, BACK0 = 22.7, BACK1 = 23.85;
const LR = { cx: CX, cy: CY, A: 700, B: 1050, psi0: Math.PI, zones: [0.25, 0.75, 1.25, 1.75].map(k => k * Math.PI) };   // centre-cut result: 4 half twists
const L2 = { cx: CX, cy: 480, A: 600, B: 820, psi0: Math.PI, zones: [0.5, 1.5].map(k => k * Math.PI) };                // 1/3 cut long ring: 2 half twists
const MY = 1300;                                                                                                                  // 1/3 cut thin Möbius centre (world y)

// ---------- geometry ----------
function alphaQ(phi) { const lap = Math.floor(phi / TAU), r = phi - lap * TAU; return Math.PI * (lap + ss((r - (PHT - DT)) / (2 * DT))); }
function Qp(phi, s, o = {}) {   // the Möbius loop (two-lap parameter), offset o = {x, y, zc}
  const th = TS + phi, a = alphaQ(phi), ex = Math.cos(th), ey = Math.sin(th), ca = Math.cos(a);   // an oval loop (fills the tall frame)
  let nx = ex / RX, ny = ey / RY; const nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
  return [(o.x ?? CX) + RX * ex + s * ca * nx, (o.y ?? CY) + RY * ey + s * ca * ny, s * Math.sin(a) + (o.zc ? o.zc * Math.cos(th) : 0)];
}
function Lp(phi, s, sp) {       // an opened ring (ellipse), one lap over phi in [0, 4π)
  const pr = phi / 2, ps = sp.psi0 + pr, ex = Math.cos(ps), ey = Math.sin(ps);
  let nx = ex / sp.A, ny = ey / sp.B; const nl = Math.hypot(nx, ny); nx /= nl; ny /= nl;
  let a = 0; sp.zones.forEach(z => { a += Math.PI * ss((pr - z + DT) / (2 * DT)); });
  const ca = Math.cos(a);
  return [sp.cx + sp.A * ex + s * ca * nx, sp.cy + sp.B * ey + s * ca * ny, s * Math.sin(a)];
}
const BETA = 0.60, CB = Math.cos(BETA), SB = Math.sin(BETA);   // view tilt: the mat is seen at an angle, so the twist reads as a twist
const V = p => [p[0], CY + (p[1] - CY) * CB - p[2] * SB, (p[1] - CY) * SB + p[2] * CB];
const Qs = (...a) => V(Qp(...a)), Ls = (...a) => V(Lp(...a));
const L3 = (a, b, u) => [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)];

// ---------- ribbon renderer: quads from all ribbons sorted by depth, then drawn ----------
let QUADS = [];
function ribbon(n, p0, p1, vert, style) {
  const P = []; for (let k = 0; k <= n; k++) { const ph = lerp(p0, p1, k / n); P.push([V(vert(ph, 0)), V(vert(ph, 1))]); }
  for (let k = 0; k < n; k++) { const a = P[k][0], b = P[k + 1][0], c = P[k + 1][1], d = P[k][1], ph = lerp(p0, p1, (k + 0.5) / n);
    QUADS.push({ p: [a, b, c, d], z: (a[2] + b[2] + c[2] + d[2]) / 4, st: style(ph, k), k }); }
}
function edgeStroke(type, p, q, k) {
  if (!type) return;
  if (type === "dash") { if (k % 4 >= 2) return; g.strokeStyle = css(INKD); g.lineWidth = 10; }
  else { g.strokeStyle = css(EDGE); g.lineWidth = 8; }
  g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
}
function flush() {
  QUADS.sort((q1, q2) => q1.z - q2.z);
  g.lineCap = "round"; g.lineJoin = "round";
  for (const q of QUADS) {
    const [a, b, c, d] = q.p, ux = b[0] - a[0], uy = b[1] - a[1], vx = d[0] - a[0], vy = d[1] - a[1];
    const cr = ux * vy - uy * vx, lt = 0.66 + 0.34 * Math.min(1, Math.abs(cr) / (Math.hypot(ux, uy) * Math.hypot(vx, vy) + 1e-6));
    const front = (q.st.flip ? -cr : cr) > 0, base = front ? PAPER : PAPER_B;
    const col = [base[0] * lt, base[1] * lt, base[2] * lt];
    g.globalAlpha = q.st.a ?? 1;
    g.fillStyle = css(col); g.strokeStyle = css(col); g.lineWidth = 2;
    g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.closePath(); g.fill(); g.stroke();
    edgeStroke(q.st.outer, d, c, q.k); edgeStroke(q.st.inner, a, b, q.k);
    if (q.st.paint) { g.strokeStyle = css(MARKER); g.lineWidth = 30; g.beginPath(); g.moveTo((a[0] + d[0]) / 2, (a[1] + d[1]) / 2); g.lineTo((b[0] + c[0]) / 2, (b[1] + c[1]) / 2); g.stroke(); }
  }
  g.globalAlpha = 1; QUADS = [];
}

// state A: the Möbius loop cut down the middle. c = cut progress (0..2π), gap, m = morph to the long ring LR,
// paint = painted up to phi, oy = world y offset, a = alpha
function stripA(o) {
  const c = o.c ?? 0, gap = o.gap ?? GAP, m = o.m ?? 0, paint = o.paint ?? -1, oy = o.oy ?? 0;
  const cutAt = ph => (ph % TAU) < c;
  const hw = (W0 / 2 - gap / 2) / 2;
  const vert = (ph, u) => {
    const gp = cutAt(ph) ? gap / 2 : 0;
    const q = Qp(ph, lerp(gp, W0 / 2, u), { y: CY + oy }), l = Lp(ph, lerp(-hw, hw, u), LR);
    const v = m === 0 ? q : L3(q, l, m); v[1] += m === 0 ? 0 : oy * m; v[2] += 480 * clamp(m) * (1 - clamp(m)) * Math.sin(ph / 4) ** 2; return v;
  };
  ribbon(360, 0, 2 * TAU, vert, (ph) => ({ paint: ph < paint, flip: ph >= TAU, inner: cutAt(ph) ? "cut" : "dash", outer: "edge", a: o.a }));
  return vert;
}
// state B: the same loop with the 1/3 cut. pc = cut progress along the cut line (0..4π: it goes round twice), m = separation
function stripB(o) {
  const pc = o.pc ?? 0, gap = o.gap ?? GAP, m = o.m ?? 0, oy = o.oy ?? 0, w3 = W0 / 6;
  const hw2 = (W0 / 2 - w3 - gap / 2) / 2;
  // outer lane: two laps, s in [w3, W0/2]; its inner edge is the cut line at parameter ph
  ribbon(360, 0, 2 * TAU, (ph, u) => {
    const gp = ph < pc ? gap / 2 : 0, q = Qp(ph, lerp(w3 + gp, W0 / 2, u), { y: CY + oy });
    if (m === 0) return q; const v = L3(q, Lp(ph, lerp(-hw2, hw2, u), L2), m); v[2] += 400 * clamp(m) * (1 - clamp(m)) * Math.sin(ph / 4) ** 2; return v;
  }, ph => ({ flip: ph >= TAU, inner: ph < pc ? "cut" : "dash", outer: "edge" }));
  // middle lane: one lap, s in [-w3, w3]; edge +w3 = cut line at ph, edge -w3 = cut line at ph + 2π
  ribbon(180, 0, TAU, (ph, u) => {
    const gp = ph < pc ? gap / 2 : 0, gm = ph + TAU < pc ? gap / 2 : 0, s = lerp(-w3 + gm, w3 - gp, u);
    const q = Qp(ph, s, { y: CY + oy }); if (m === 0) return q;
    return L3(q, Qp(ph, s, { y: MY, zc: 80 }), m);
  }, ph => ({ inner: ph + TAU < pc ? "cut" : "dash", outer: ph < pc ? "cut" : "dash" }));
}

// ---------- props ----------
function scissors(x, y, ang, open, a = 1, sc = 1) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(ang); g.scale(sc, sc);
  g.lineJoin = "round"; g.lineCap = "round";
  // pivot sits ~40 px behind the cut point; blades point forward (+x), handles back (−x)
  [[-1, open], [1, -open]].forEach(([sgn, an]) => {
    g.save(); g.translate(-40, 0); g.rotate(an);
    g.fillStyle = css(sgn < 0 ? STEEL : [186, 196, 210]); g.strokeStyle = css(STEEL_D); g.lineWidth = 8;
    g.beginPath(); g.moveTo(0, -12 * sgn); g.lineTo(200, -3 * sgn); g.lineTo(206, 0); g.lineTo(0, 14 * sgn); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = css(HANDLE); g.lineWidth = 22; g.beginPath(); g.moveTo(0, 0); g.lineTo(-70, 26 * sgn); g.stroke();
    g.beginPath(); g.ellipse(-120, 44 * sgn, 52, 36, 0.35 * sgn, 0, TAU); g.stroke();
    g.restore();
  });
  dot(-40, 0, 13, STEEL_D); dot(-40, 0, 6, STEEL);
  g.restore();
}
const snipOpen = (T, f = 3) => 0.07 + 0.2 * (0.5 + 0.5 * Math.cos(T * TAU * f));
function scissorsAtA(c, T, a = 1, fly = 0) {
  const p = Qs(c, 0), q = Qs(c + 0.03, 0), an = Math.atan2(q[1] - p[1], q[0] - p[0]);
  const fx = lerp(p[0], 1350, eio(fly)), fy = lerp(p[1], -260, eio(fly));
  scissors(fx, fy, an + fly * 2.2, snipOpen(T), a);
}
function scissorsAtB(pc, T, oy, a = 1, fly = 0) {
  const s = W0 / 6, p = Qs(pc, s, { y: CY + oy }), q = Qs(pc + 0.03, s, { y: CY + oy }), an = Math.atan2(q[1] - p[1], q[0] - p[0]);
  scissors(lerp(p[0], 1350, eio(fly)), lerp(p[1], -260, eio(fly)), an + fly * 2.2, snipOpen(T, 5), a);
}

// ---------- camera (Catmull-Rom through keys [time, scale]; centre fixed on the ring) ----------
const CAM = [[-1, 1.1], [0, 1.1], [4.6, 1.13], [7.2, 1.13], [7.7, 0.65], [9.3, 0.66], [10.1, 0.7], [10.65, 1.1], [15.3, 1.13], [15.95, 0.65], [17.5, 0.66],
  [18.1, 1.1], [19.95, 1.12], [20.35, 0.7], [22.7, 0.7], [23.85, 1.1], [30, 1.1], [31, 1.1]];
function camAt(T) {
  let i = 1; while (i < CAM.length - 2 && T >= CAM[i + 1][0]) i++;
  const p0 = CAM[i - 1], p1 = CAM[i], p2 = CAM[i + 1], p3 = CAM[i + 2], u = clamp((T - p1[0]) / (p2[0] - p1[0]));
  const m1 = (p2[1] - p0[1]) / (p2[0] - p0[0]) * (p2[0] - p1[0]), m2 = (p3[1] - p1[1]) / (p3[0] - p1[0]) * (p2[0] - p1[0]);
  const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * p1[1] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[1] + (u3 - u2) * m2;
}
const camSet = s => g.setTransform(s, 0, 0, s, CX * (1 - s), CY * (1 - s));
const toScreen = (p, s) => [CX + (p[0] - CX) * s, CY + (p[1] - CY) * s];

function mat(s) {
  camSet(s); g.fillStyle = css(MAT); g.fillRect(-600, -900, W + 1200, H + 1800);
  g.strokeStyle = css(MAT_L, 0.6); g.lineWidth = 8;
  for (let x = -600; x <= W + 600; x += 120) { g.beginPath(); g.moveTo(x, -900); g.lineTo(x, H + 900); g.stroke(); }
  for (let y = -900; y <= H + 900; y += 120 * CB) { g.beginPath(); g.moveTo(-600, y); g.lineTo(W + 600, y); g.stroke(); }
  g.setTransform(1, 0, 0, 1, 0, 0); vignette(0.45);
}
function chip(s, x, y, size, a, fg = DKG, bgc = CREAM) {
  if (a <= 0.01) return; g.save(); g.font = `900 ${size}px ${FONT}`; const w = g.measureText(s).width, px = size * 0.45, h = size * 1.45;
  g.globalAlpha = a; g.fillStyle = css(bgc); g.beginPath(); g.roundRect(x - w / 2 - px, y - h / 2, w + 2 * px, h, h * 0.3); g.fill(); g.restore();
  text(s, x, y + size * 0.03, size, fg, "center", 900, a);
}
const TOP_Y = 225;
function tape(oy = 0, a = 1) {   // the tape that joins the ends (where the yellow face meets the orange face)
  if (a <= 0.01) return; const p = V(Qp(0, -W0 / 2 - 22, { y: CY + oy })), q = V(Qp(0, W0 / 2 + 22, { y: CY + oy }));
  const an = Math.atan2(q[1] - p[1], q[0] - p[0]), L = Math.hypot(q[0] - p[0], q[1] - p[1]);
  g.save(); g.globalAlpha = 0.55 * a; g.translate((p[0] + q[0]) / 2, (p[1] + q[1]) / 2); g.rotate(an); g.fillStyle = css([236, 240, 246]);
  g.fillRect(-L / 2, -28, L, 56); g.restore();
}
function title2(a) { chip("One cut.", CX, CY - 70, 96, a); chip("Two rings?", CX, CY + 70, 96, a); }   // frame-0 title inside the loop's hole
function pen(x, y, a = 1) {   // a blue marker drawing at (x, y)
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(-0.9);
  g.fillStyle = css([90, 96, 110]); g.beginPath(); g.moveTo(0, 0); g.lineTo(34, -20); g.lineTo(34, 20); g.closePath(); g.fill();
  g.fillStyle = css([235, 240, 248]); g.strokeStyle = css([60, 70, 90]); g.lineWidth = 8; g.beginPath(); g.roundRect(34, -26, 190, 52, 14); g.fill(); g.stroke();
  g.fillStyle = css(MARKER); g.beginPath(); g.roundRect(180, -30, 70, 60, 14); g.fill(); g.stroke(); g.restore();
}
const paintAt = T => T < 9.3 ? -1 : T < 13.1 ? TAU * (T - 9.3) / 3.8 : T < 15.5 ? TAU + TAU * (T - 13.1) / 2.4 : 99;
function glowAt(x, y, r, col, a) { if (a <= 0.01) return; g.save(); g.globalCompositeOperation = "lighter"; soft(x, y, r, col, a); g.restore(); }

// ---------- the film: one function of global time ----------
function frame0() {
  const s = camAt(0); mat(s); camSet(s);
  stripA({ c: C0 }); flush(); tape(); scissorsAtA(C0, 0);
  g.setTransform(1, 0, 0, 1, 0, 0); title2(1);
}
function film(T) {
  if (T >= TL.total - 0.5) { frame0(); return; }
  const s = camAt(T); mat(s); camSet(s);
  if (T < 10.12) {                                                   // hook, guess, reveal
    const c = T < SNAP ? lerp(C0, TAU, T / SNAP) : TAU;
    const m = T < SNAP ? 0 : clamp(spring(T, SNAP, 5.5, 0.75), 0, 1.04);
    const pt = paintAt(T), vert = stripA({ c, m, paint: pt }); flush(); tape(0, 1 - seg(T, SNAP, SNAP + 0.15));
    if (pt >= 0) { const h = V(vert(pt, 0.5)); glowAt(h[0], h[1], 120, [150, 210, 255], 0.7); pen(h[0], h[1], seg(T, 9.15, 9.35)); }
    const tw = Qs(PHT, 0); glowAt(tw[0], tw[1], 170, [255, 236, 150], 0.75 * win(T, 0.1, 1.1, 0.25));   // "Half-twist": the twist glows
    if (T < SNAP + 0.5) scissorsAtA(Math.min(c, TAU - 0.001), T, 1, seg(T, SNAP, SNAP + 0.45));
    if (T >= SNAP) { const f = Math.exp(-(T - SNAP) * 3); const p = Qs(0, 0); glowAt(p[0], p[1], 520 * (1.2 - f), [255, 240, 170], 0.9 * f); }
    g.setTransform(1, 0, 0, 1, 0, 0);
    title2(1 - seg(T, 4.45, 4.6));
    // guess: two ghost rings slide out on "Two rings?" (4.79), struck out on "Nope" (5.98), pop away
    const gi = seg(T, 4.78, 5.2), go = seg(T, 6.25, 6.6);
    if (gi > 0 && go < 1) {
      const sc = 1 - 0.6 * go;
      [-1, 1].forEach(k => { const x = CX + k * lerp(120, 250, eout(gi)), y = CY;
        g.save(); g.globalAlpha = gi * (1 - go); g.strokeStyle = css(DKG, 0.6); g.lineWidth = 26; g.beginPath(); g.arc(x, y, 175 * sc, 0, TAU); g.stroke();
        g.strokeStyle = css(CREAM); g.lineWidth = 16; g.beginPath(); g.arc(x, y, 175 * sc, 0, TAU); g.stroke(); g.restore(); });
      const st = seg(T, 5.98, 6.18);
      if (st > 0) line(150, CY + 260, lerp(150, 930, st), lerp(CY + 260, CY - 260, st), [235, 70, 60], 1 - go, 22);
    }
    chip("ONE", CX, CY, 150, seg(T, 8.62, 8.75) * (1 - seg(T, 9.9, 10.05)));
    return;
  }
  if (T < 17.6) {                                                    // why
    const fold = 1 - seg(T, 10.12, 10.6), op = T < OPEN2 ? 0 : clamp(spring(T, OPEN2, 8, 0.68), 0, 1.06);
    const paint = paintAt(T), vert = stripA({ c: TAU, m: Math.max(fold, op), paint }); flush();
    if (T < 15.55) { const h = V(vert(Math.min(paint, 2 * TAU - 0.001), 0.5)); glowAt(h[0], h[1], 120, [150, 210, 255], 0.7); pen(h[0], h[1], 1 - seg(T, 15.4, 15.55)); }
    if (T > 13.05) { const j = V(vert(0.02, 0.5)), f = Math.exp(-(T - 13.1) * 2.5) * (T < 13.1 ? 0 : 1); glowAt(j[0], j[1], 260, [150, 210, 255], 0.9 * f); }
    if (T >= 16.25) { // a bright dot runs once round the long ring: it is one strip
      for (let i = 0; i < 9; i++) { const u = clamp((T - 16.25) / 1.15) * 2 * TAU - i * 0.09; if (u < 0) continue; const p = Ls(Math.min(u, 2 * TAU), 0, LR); dot(p[0], p[1], 22 - i * 2, [255, 250, 230], (1 - i / 9) * (1 - seg(T, 17.3, 17.5))); }
    }
    g.setTransform(1, 0, 0, 1, 0, 0);
    chip("Möbius strip", CX, CY, 84, seg(T, 10.45, 10.58) * (1 - seg(T, 11.42, 11.55)));
    const ta = seg(T, 11.6, 11.72) * (1 - seg(T, 12.92, 13.05));
    chip("twist", CX, CY - 60, 92, ta);
    if (ta > 0.01) { const tw = toScreen(Qs(PHT, 0), s); arrow(CX + 60, CY + 10, tw[0] - 10, tw[1] - 90, CREAM, ta, 12, 34); }
    chip("swapped!", CX, CY, 92, seg(T, 13.1, 13.22) * (1 - seg(T, 14.8, 14.95)));
    chip("2× length", CX, CY, 110, seg(T, 16.28, 16.4) * (1 - seg(T, 17.42, 17.56)));
    return;
  }
  // third + end
  const enter = seg(T, 17.6, 17.98), oyB = 1100 * (1 - eout((T - 17.6) / 0.4));
  if (T < 17.98) { stripA({ c: TAU, m: 1, paint: 99, oy: -4200 * eio((T - 17.6) / 0.36) }); }
  const pc = clamp((T - 17.98) / (19.95 - 17.98)) * 2 * TAU;
  const back = seg(T, BACK0, BACK1);
  const m3 = T < SEP ? 0 : clamp(spring(T, SEP, 6, 0.75), 0, 1.04) * (1 - back);
  if (T >= BACK1) stripA({ c: 0, gap: 0 });
  else stripB({ pc, m: m3, oy: oyB, gap: GAP * (1 - seg(T, 22.9, 23.8)) });
  flush(); if (T < SEP) tape(oyB, 1 - seg(T, SEP, SEP + 0.15)); else if (T > BACK1 - 0.3) tape(0, seg(T, BACK1 - 0.3, BACK1));
  if (T >= 17.9 && T < 20.4) scissorsAtB(Math.min(pc, 2 * TAU - 0.001), T, oyB, seg(T, 17.9, 18.0), seg(T, 19.95, 20.4));
  if (T >= 23.45) { const u = seg(T, 23.45, 23.95); const p = Qs(C0, 0), q = Qs(C0 + 0.03, 0), an = Math.atan2(q[1] - p[1], q[0] - p[0]);
    scissors(lerp(1350, p[0], eio(u)), lerp(-260, p[1], eio(u)), an + (1 - u) * 2.2, snipOpen(T), u); }
  if (T >= 20.8 && T < 22.2) { const f = Math.exp(-(T - 20.82) * 2.2) * (T < 20.82 ? 0 : 1);   // "linked": the two crossings flash
    CROSS.forEach(p => glowAt(p[0], p[1], 170, [255, 240, 170], f)); }
  if (T >= SEP) { const f = Math.exp(-(T - SEP) * 3); glowAt(CX, CY, 480 * (1.2 - f), [255, 240, 170], 0.8 * f); }
  g.setTransform(1, 0, 0, 1, 0, 0);
  chip("1/3 cut", CX, CY, 100, seg(T, 18.1, 18.22) * (1 - seg(T, 19.85, 20.0)) * enter);
  const l2c = toScreen(V([CX, L2.cy, 0]), s);
  chip("Two?", CX, l2c[1], 180, seg(T, 21.7, 21.8) * (1 - seg(T, 23.2, 23.35)));
  title2(seg(T, 23.45, 23.7));
}
const CROSS = (() => { const out = []; [[0, TAU], [TAU, 2 * TAU]].forEach(([a, b]) => { let best = 1e9, bp = a;
  for (let k = 0; k <= 400; k++) { const ph = lerp(a, b, k / 400), p = Lp(ph, 0, L2), d = Math.abs(Math.hypot((p[0] - CX) / RX, (p[1] - MY) / RY) - 1); if (p[1] > MY - 600 && d < best) { best = d; bp = ph; } }
  out.push(Ls(bp, 0, L2)); }); return out; })();
const SCENES = {};
["hook", "guess", "reveal", "why", "third", "end"].forEach(id => { SCENES[id] = (t, T) => film(T); });
