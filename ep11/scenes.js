// ---- from ep03/scenes.js (unchanged): alias rule, spoked wheel, spin arrow, side-view car ----
const DEG = Math.PI / 180;
// wrap a per-frame step (radians) into (-gap/2, gap/2]: the brain's nearest match
const alias = (step, gap) => { let r = ((step % gap) + gap) % gap; if (r > gap / 2) r -= gap; return r; };

// a spoked wheel; ang = rotation (rad, clockwise positive); o.gold = draw the marked spoke; o.blur = exposure (rad) to smear over
function wheel(cx, cy, r, ang, n, o = {}) {
  const a = o.a ?? 1; if (a <= 0.01) return;
  const col = o.col || INKc, samples = o.blur ? 10 : 1;
  g.save(); g.globalAlpha = a;
  g.strokeStyle = css([58, 72, 120]); g.lineWidth = r * 0.16; g.beginPath(); g.arc(cx, cy, r * 0.92, 0, TAU2); g.stroke();   // tyre
  g.strokeStyle = css(col); g.lineWidth = r * 0.05; g.beginPath(); g.arc(cx, cy, r * 0.82, 0, TAU2); g.stroke();             // rim
  for (let sIdx = 0; sIdx < samples; sIdx++) {
    const an0 = ang + (o.blur ? o.blur * (sIdx / (samples - 1) - 0.5) : 0);
    g.globalAlpha = a * (o.blur ? 1.6 / samples : 1);
    for (let k = 0; k < n; k++) { const an = an0 + k * TAU2 / n - Math.PI / 2; g.strokeStyle = css(o.gold && k === 0 ? GOLDc : col); g.lineWidth = r * (n > 8 ? 0.045 : 0.09); g.beginPath(); g.moveTo(cx + r * 0.12 * Math.cos(an), cy + r * 0.12 * Math.sin(an)); g.lineTo(cx + r * 0.8 * Math.cos(an), cy + r * 0.8 * Math.sin(an)); g.stroke(); }
  }
  g.globalAlpha = a; g.fillStyle = css(col); g.beginPath(); g.arc(cx, cy, r * 0.13, 0, TAU2); g.fill();
  g.restore();
}
// curved arrow around a wheel showing a direction (+1 clockwise / -1 counter), strength 0..1
function spinArrow(cx, cy, r, dir, col, a = 1) {
  if (a <= 0.01 || !dir) return; const a0 = -Math.PI * 0.85, a1 = -Math.PI * 0.35, [s, e] = dir > 0 ? [a0, a1] : [a1, a0];
  g.save(); g.globalAlpha = a; g.strokeStyle = css(col); g.lineWidth = 10; g.lineCap = "round"; g.beginPath(); g.arc(cx, cy, r, Math.min(s, e), Math.max(s, e)); g.stroke(); g.restore();
  const hx = cx + r * Math.cos(e), hy = cy + r * Math.sin(e), tan = e + (dir > 0 ? Math.PI / 2 : -Math.PI / 2);
  poly([[hx - 26 * Math.cos(tan - 0.5), hy - 26 * Math.sin(tan - 0.5)], [hx, hy], [hx - 26 * Math.cos(tan + 0.5), hy - 26 * Math.sin(tan + 0.5)]], col, a, 10);
}
// a side-view car; wheels drawn by the caller-provided angle
function carSide(x, y, s, wAng, a = 1, nSp = 5) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
  g.fillStyle = css(BLUEc); g.beginPath(); g.moveTo(-300, 20); g.lineTo(-290, -60); g.quadraticCurveTo(-180, -80, -120, -90); g.lineTo(-60, -160); g.lineTo(120, -160); g.lineTo(200, -90); g.quadraticCurveTo(290, -80, 300, -40); g.lineTo(300, 20); g.closePath(); g.fill();
  g.fillStyle = css(BGc, 0.6); g.beginPath(); g.moveTo(-40, -145); g.lineTo(40, -145); g.lineTo(40, -95); g.lineTo(-95, -95); g.closePath(); g.fill(); g.beginPath(); g.moveTo(60, -145); g.lineTo(115, -145); g.lineTo(170, -95); g.lineTo(60, -95); g.closePath(); g.fill();
  g.restore();
  wheel(x - 185 * s, y + 20 * s, 72 * s, wAng, nSp, { a }); wheel(x + 185 * s, y + 20 * s, 72 * s, wAng, nSp, { a });
}

// ======================= Episode 11 (Short, 1080×1920) — Why do wheels spin backwards on camera? =======================
// The video itself runs at 30 fps, so in the hook the car's wheel is drawn exactly as a 30 fps camera samples it
// (angle quantised to frame times): turning 3.6 → 6 rev/s, the 5-spoke wheel steps 0.6 → 1.0 spoke gaps a frame,
// so it appears to spin backwards, slow down and freeze. The teaching scenes use a slow camera (4 frames a second) so
// the real wheel stays smooth while the camera's view shows the steps. Wheel angles are precomputed at load (fixed step).
// Safe zone (Shorts UI): key content above y = 1536 and left of x = 940.
const MAS = (T, o = {}) => mascot3(o.x ?? 150, o.y ?? 1560, o.s ?? 0.4, T, o);
const VFPS = 30, CAM = 4;
// integrate a rev/s profile into an angle table (rad), 1/240 s resolution
function angleTable(omega, Tmax) { const dt = 1 / 240, A = [0]; let a = 0; for (let k = 1; k <= Tmax / dt; k++) { a += omega((k - 0.5) * dt) * TAU2 * dt; A.push(a); } return t => A[clamp(Math.round(t / dt), 0, A.length - 1)]; }
// hook / ending car: 3.6 → 6 rev/s over the hook, then held
const carOm = t => 3.6 + 2.4 * ss((t - 0.4) / 6.6);
const carAng = angleTable(carOm, 60);
const carFrame = t => carAng(Math.floor(t * VFPS + 1e-6) / VFPS);          // what the 30 fps camera records
// teaching wheel (12 spokes, gap 30°): turn per camera frame as a fraction of the gap = 3·ω at 4 fps
function lanes(t, ang, camAng, step, o = {}) {
  const gap = TAU2 / 12, a = o.a ?? 1, X = 450;
  // top lane: the real wheel, smooth, gold spoke
  rrect(80, 420, 800, 440, 26, PANELc, a * 0.6); text("the real wheel", 860, 820, 40, QUIET, "right", 700, a);
  wheel(X, 640, 175, ang, 12, { gold: true, a });
  spinArrow(X, 640, 205, 1, BLUEc, a * (o.fwd ?? 1));
  // bottom lane: the camera's pictures (held frames), no mark
  rrect(80, 890, 800, 440, 26, PANELc, a * 0.6); text("what the camera shows", 860, 1290, 40, QUIET, "right", 700, a);
  wheel(X, 1110, 175, camAng, 12, { a });
  const app = alias(step * gap, gap) / gap;                                   // apparent step, in gaps (−½..½)
  if (Math.abs(app) > 0.02) spinArrow(X, 1110, 205, Math.sign(app), app < 0 ? CORALc : BLUEc, a * (o.arrow ?? 1));
  // the dial: turn per frame against half a gap
  const dx = 770, dy = 1110, R = 84, u = clamp(step / 1.0);
  g.save(); g.globalAlpha = a; g.lineWidth = 18; g.lineCap = "butt";
  g.strokeStyle = css(BLUEc); g.beginPath(); g.arc(dx, dy, R, Math.PI, Math.PI * 1.5); g.stroke();
  g.strokeStyle = css(CORALc); g.beginPath(); g.arc(dx, dy, R, Math.PI * 1.5, Math.PI * 2); g.stroke(); g.restore();
  line(dx, dy, dx + (R + 14) * Math.cos(Math.PI * (1 + u)), dy + (R + 14) * Math.sin(Math.PI * (1 + u)), GOLDc, a, 7); dot(dx, dy, 10, GOLDc, a);
  text("½ gap", dx, dy - R - 34, 34, INK, "center", 700, a); text("0", dx - R - 4, dy + 34, 32, BLUE, "center", 700, a); text("1", dx + R + 4, dy + 34, 32, CORAL, "center", 700, a);
}
const SCENES = {};

// 1 — hook: first frame = the car speeding up, its wheels spinning backwards; the backward spin slows and freezes
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const y = 900, off = (carAng(t) / TAU2) * 2 * Math.PI * 94 * 0.25;             // background posts move with the car (period 420 px: no aliasing)
  for (let x = -((off % 420) + 420) % 420; x < W + 420; x += 420) { rrect(x, 560, 22, 300, 8, PANELc, 1); }
  line(0, 1010, W, 1010, QUIETc, 0.7, 4);
  carSide(500, y, 1.3, carFrame(t), 1, 5);
  // speedometer (rising)
  const v = carOm(t) / 6, cx = 540, cy = 1250;
  g.save(); g.lineWidth = 16; g.strokeStyle = css(PANELc); g.beginPath(); g.arc(cx, cy, 110, Math.PI * 0.8, Math.PI * 2.2); g.stroke();
  g.strokeStyle = css(GOLDc); g.beginPath(); g.arc(cx, cy, 110, Math.PI * 0.8, Math.PI * (0.8 + 1.4 * v)); g.stroke(); g.restore();
  text("the car: speeding up", cx, cy + 90, 44, GOLD, "center", 800, 1);
  plate("spins backwards", 540, 470, 50, CORAL, "center", win(t, B(1) + 0.6, B(1) + 2.8, 0.3), 800);
  plate("backwards, slower…", 540, 470, 50, CORAL, "center", win(t, B(1) + 2.9, B(1) + 3.9, 0.3), 800);
  plate("freezes", 540, 470, 50, INK, "center", seg(t, B(1) + 4.0, B(1) + 4.3), 800);
  MAS(T, { look: [0.9, -0.4], mouth: t > B(1) + 3.5 ? "wince" : "o" });
};

// 2 — frames: the camera takes still pictures (30 a second); the brain joins them by the shortest move
SCENES.frames = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const om = 0.05, ang = t * om * TAU2 + 0.3;
  wheel(540, 660, 220, ang, 12, { gold: true });
  // cards: the last 4 pictures, sliding to the right as each new one is taken
  const k = Math.floor(t * 2), n = 4, cw = 190, y0 = 1110, cards = seg(t, 0.8, 1.4);
  for (let j = 0; j < n; j++) {
    const kk = k - j; if (kk < 0) continue; const cx = 160 + j * (cw + 24) + cw / 2, fa = cards * (1 - j * 0.18);
    rrect(cx - cw / 2, y0 - cw / 2, cw, cw, 12, PANELc, fa, QUIETc, 3);
    wheel(cx, y0, cw * 0.4, (kk / 2) * om * TAU2 + 0.3, 12, { a: fa });
  }
  text("still pictures · often 30 a second", 540, 930, 46, INK, "center", 800, seg(t, 1.4, 1.9));
  // the brain's guess: dotted shortest-path arcs between cards
  const br = seg(t, B(1) - 0.2, B(1) + 0.4);
  for (let j = 0; j < n - 1; j++) { const x1 = 160 + j * (cw + 24) + cw / 2, x2 = x1 + cw + 24; g.save(); g.globalAlpha = br; g.strokeStyle = css(GOLDc); g.lineWidth = 5; g.setLineDash([4, 12]); g.lineCap = "round"; g.beginPath(); g.moveTo(x2 - 20, y0 + cw / 2 + 20); g.quadraticCurveTo((x1 + x2) / 2, y0 + cw / 2 + 90, x1 + 20, y0 + cw / 2 + 20); g.stroke(); g.restore(); }
  plate("your brain: the shortest move", 600, 1350, 50, GOLD, "center", br, 800);
  MAS(T, { look: [0.8, -0.6], mouth: "o" });
};

// 3 — spokes: slow → forward; faster → each spoke lands just short of the next → shortest match is backwards
const SPK = { slow: 0.05, fast: 0.85 / 3 };
const spOm = (t, B) => lerp(SPK.slow, SPK.fast, ss((t - B(1) + 0.2) / 1.2));
let spAng = null;
SCENES.spokes = (t, T, B, E, dur) => {
  if (!spAng) spAng = angleTable(u => spOm(u, B), 20);
  clear(); vignette(0.3);
  const ang = spAng(t), camAng = spAng(Math.floor(t * CAM) / CAM), step = spOm(t, B) * 3;
  lanes(t, ang, camAng, step, { arrow: seg(t, 0.8, 1.2) });
  plate("slow: forward", 540, 380, 50, BLUE, "center", win(t, 0.6, B(1), 0.3), 800);
  plate("lands just short of the next spoke", 540, 380, 46, INK, "center", win(t, B(1) + 1.0, B(2), 0.3), 800);
  plate("shortest match: backwards", 540, 380, 50, CORAL, "center", seg(t, B(2), B(2) + 0.4), 800);
  MAS(T, { s: 0.3, x: 130, look: [0.8, -0.6], mouth: t > B(2) ? "o" : "smile" });
};

// 4 — end: exactly one gap → frozen; "forward, but the pictures say backwards"; back to the car (loop)
const ENOm = (t, B) => t < B(1) - 0.3 ? 1 / 3 : SPK.fast;
let enAng = null;
SCENES.end = (t, T, B, E, dur) => {
  if (!enAng) enAng = angleTable(u => ENOm(u, B), 20);
  clear(); vignette(0.3);
  const back = seg(t, B(1) + 3.5, B(1) + 4.0);
  if (back < 1) {
    const ang = enAng(t), camAng = enAng(Math.floor(t * CAM) / CAM), step = ENOm(t, B) * 3;
    g.globalAlpha = 1; lanes(t, ang, camAng, step, { a: 1 - back });
    plate("exactly one gap: frozen", 540, 380, 50, INK, "center", win(t, 0.6, B(1) - 0.3, 0.3) * (1 - back), 800);
    plate("forward · the pictures say backwards", 540, 380, 44, CORAL, "center", win(t, B(1), B(1) + 3.6, 0.3) * (1 - back), 800);
  }
  if (back > 0) {   // the hook's car, again (same frozen look as the end of the hook)
    g.globalAlpha = back; const off = 0; for (let x = 0; x < W + 420; x += 420) rrect(x, 560, 22, 300, 8, PANELc, 1);
    line(0, 1010, W, 1010, QUIETc, 0.7, 4); carSide(500, 900, 1.3, carFrame(0), 1, 5); g.globalAlpha = 1;
  }
  MAS(T, { s: lerp(0.3, 0.4, back), x: lerp(130, 150, back), look: [0.8, -0.3], mouth: "o" });
};
