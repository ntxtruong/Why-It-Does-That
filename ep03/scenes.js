// Episode 3 — Why do wheels spin backwards on camera?
// Pure functions of time. The teaching camera runs slowly (CAMFPS frames a second) so the real wheel,
// drawn at the video's own frame rate, stays smooth while the camera's view shows the aliasing.
// Colours: real motion = blue, what the brain sees = coral arrows, the marked spoke = gold.

const CAMFPS = 4;                                   // the teaching camera
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
function roadDashes(y, off, a = 1) { line(0, y, W, y, QUIETc, a * 0.7, 4); for (let x = -((off % 160) + 160) % 160; x < W; x += 160) line(x, y + 40, x + 80, y + 40, QUIETc, a * 0.5, 5); }
// film strip of held camera frames: frames k = floor(t*fps); each card shows the wheel at that frame
function strip(t, x0, y, cardW, n, fps, angFn, nSp, a = 1, gold = false) {
  if (a <= 0.01) return; const k = Math.floor(t * fps), slide = (t * fps - k);
  rrect(x0 - 20, y - cardW * 0.62, n * (cardW + 16) + 24, cardW * 1.24, 14, [14, 22, 48], a);
  for (let j = 0; j < n; j++) { const kk = k - j, cx = x0 + (cardW + 16) * (j + slide * 0) + cardW / 2; if (kk < 0) continue; rrect(cx - cardW / 2, y - cardW / 2, cardW, cardW, 10, PANELc, a * (1 - j / (n + 1))); wheel(cx, y, cardW * 0.42, angFn(kk / fps), nSp, { a: a * (1 - j / (n + 1)), gold }); }
}
// one trace: y = yc - A * f(x)
function trace(x0, x1, yc, A, f, col, a = 1, lw = 7) { if (a <= 0.01) return; const pts = []; for (let x = x0; x <= x1; x += 5) pts.push([x, yc - A * f(x)]); poly(pts, col, a, lw); }
const MAS = (x, T, o = {}) => mascot(x, o.y ?? 900, o.s ?? 0.28, T, o);
function clapper(x, yFeet, s, a = 1) { const cx = x + 120 * s, cy = yFeet - 300 * s; rrect(cx - 60 * s, cy - 40 * s, 120 * s, 80 * s, 8 * s, [42, 47, 64], a); for (let i = 0; i < 4; i++) rrect(cx - 60 * s + i * 32 * s, cy - 62 * s, 22 * s, 18 * s, 3 * s, INKc, a * 0.9); }

// the hook / ending car: accelerating; its wheels as a 24 fps camera would show them
const carTrue = t => 0.9 * t * t;                    // wheel angle (rev) under steady acceleration
function carApparent(t) {                           // what the 24 fps footage shows (5 spokes): integrate the aliased step
  const fps = 24, gap = TAU2 / 5, k = Math.floor(t * fps); let ang = 0;
  for (let i = 0; i < k; i++) ang += alias((carTrue((i + 1) / fps) - carTrue(i / fps)) * TAU2, gap);
  return ang;
}
const APP = []; for (let i = 0; i <= 24 * 30; i++) APP.push(carApparent(i / 24));   // precomputed, 30 s
const appAt = t => APP[clamp(Math.floor(t * 24), 0, APP.length - 1)];

const SCENES = {};

// 1 — hook: the car whose wheels turn the wrong way; a frozen rotor
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette();
  const tc = Math.min(t, 28), sp = 0.9 * 2 * tc;     // rev/s
  roadDashes(700, carTrue(tc) * 2 * Math.PI * 72 * 1.3);
  carSide(860, 600, 1.3, appAt(tc), 1 - seg(t, B(2) - 0.4, B(2) + 0.2));
  if (t < B(2)) { const d = alias((carTrue(tc + 1 / 24) - carTrue(tc)) * TAU2, TAU2 / 5); spinArrow(860 - 240, 626, 140, Math.abs(d) < 0.02 ? 0 : Math.sign(d), d < 0 ? CORALc : BLUEc, win(t, B(1), B(2), 0.3)); text(Math.abs(d) < 0.02 ? "stopped?" : d < 0 ? "backwards?" : "forwards", 860 - 240, 400, 48, d < 0 ? CORAL : INK, "center", 800, win(t, B(1), B(2), 0.3)); arrow(1300, 300, 1600, 300, BLUE, win(t, B(1), B(2), 0.3), 8, 30); text("car: forwards", 1450, 240, 44, BLUE, "center", 700, win(t, B(1), B(2), 0.3)); }
  // helicopter with frozen blades
  const hA = seg(t, B(2) - 0.2, B(2) + 0.6) * (1 - seg(t, B(3) - 0.3, B(3) + 0.3));
  if (hA > 0) { const hx = 960 + 120 * Math.sin(t * 0.6), hy = 430 + 20 * Math.sin(t * 1.1); g.save(); g.globalAlpha = hA; g.fillStyle = css(BLUEc); g.beginPath(); g.ellipse(hx, hy, 170, 90, 0, 0, TAU2); g.fill(); g.fillRect(hx + 120, hy - 20, 260, 30); g.restore(); line(hx - 360, hy - 120, hx + 360, hy - 120, INK, hA, 14); line(hx, hy - 120, hx, hy - 80, INK, hA, 12); text("blades frozen, helicopter flying", 960, 800, 48, GOLD, "center", 700, hA); }
  // "nothing wrong with the wheel or the camera": a frame card with a question mark between
  const nA = win(t, B(3) - 0.1, dur, 0.4);
  if (nA > 0) { [700, 1220].forEach((x, i) => { rrect(x - 160, 280, 320, 320, 20, PANELc, nA); wheel(x, 440, 120, i * 0.5, 12, { a: nA }); }); text("?", 960, 440, 120, GOLD, "center", 800, nA * (0.6 + 0.4 * Math.sin(t * 3))); plate("the trick happens between the pictures", 960, 160, 50, INK, "center", nA); plate("…and your eyes can be fooled too", 960, 760, 46, CORAL, "center", win(t, B(4), dur, 0.4)); }
  MAS(170, T, { look: [0.8, -0.1], mouth: t > B(1) + 2 && t < B(2) ? "o" : "smile" }); clapper(170, 900, 0.28);
};

// 2 — frames: stills, fps, gaps, the brain's guess
SCENES.frames = (t, T, B, E, dur) => {
  clear(); vignette();
  const cards = 7, cw = 200, x0 = 960 - (cards * (cw + 30)) / 2;
  const slide = (t * 0.8) % 1;
  for (let j = -1; j < cards; j++) {
    const x = x0 + (j + slide) * (cw + 30), a = seg(t, B(1) - 0.3 + j * 0.15, B(1) + 0.3 + j * 0.15);
    rrect(x, 330, cw, cw * 1.2, 14, PANELc, a); const ph = (Math.floor(t * 0.8) - j) * 0.55;
    // a ball bouncing across the frames: each card shows one moment
    dot(x + cw / 2 + 40 * Math.sin(ph), 330 + cw * 0.6 - 60 * Math.abs(Math.cos(ph)), 22, GOLDc, a);
    if (t > B(3) && j < cards - 1) rrect(x + cw + 4, 330, 22, cw * 1.2, 6, CORALc, win(t, B(3), B(4), 0.3) * 0.8);
  }
  plate("24 frames a second (cinema)", 960, 170, 52, INK, "center", win(t, B(2), B(3), 0.4));
  plate("video: 25 · 30 · 60", 960, 760, 48, QUIET, "center", win(t, B(2) + 2.5, B(3), 0.4));
  plate("between pictures: little or nothing", 960, 170, 52, CORAL, "center", win(t, B(3), B(4), 0.4));
  if (t > B(4)) { const pa = win(t, B(4), dur, 0.4); for (let j = 0; j < cards - 1; j++) { const x = x0 + (j + slide) * (cw + 30) + cw / 2; line(x, 290, x + cw + 30, 290, GOLD, pa, 5, [6, 12]); } plate(t > B(5) ? "apparent motion" : "the brain fills the gap", 960, 170, 52, GOLD, "center", pa); }
  plate("with a wheel it can go wrong", 960, 800, 50, CORAL, "center", win(t, B(6) + 1.2, dur, 0.4));
  MAS(1800, T, { look: [-0.8, -0.2], mouth: t > B(6) ? "o" : "smile" }); clapper(1800, 900, 0.28);
};

// 3 — spokes: real wheel (gold spoke) vs what the camera + brain see, at three speeds
// per-camera-frame step as a fraction of the 30° gap: slow 0.17, fast 0.83, freeze 1.0
const spokeFrac = (t, B) => t < B(3) ? 0.17 : t < B(6) ? lerp(0.17, 0.83, seg(t, B(3), B(3) + 2)) : lerp(0.83, 1.0, seg(t, B(6), B(6) + 1.5));
function spokesView(t, frac, gold, a, xL, xR, y, R, label = true) {
  const gap = TAU2 / 12;
  // real angle: integrate the step rate (frac changes slowly; use cumulative sampling at 0.05 s)
  let ang = 0; for (let u = 0; u < t; u += 0.05) ang += SFR(u) * gap * CAMFPS * 0.05;
  wheel(xL, y, R, ang, 12, { gold, a });
  const k = Math.floor(t * CAMFPS);
  let angC = 0; for (let i = 0; i < k; i++) { let st = 0; for (let u = i / CAMFPS; u < (i + 1) / CAMFPS; u += 0.05) st += SFR(u) * gap * CAMFPS * 0.05; angC += alias(st, gap); }
  const nextStep = alias(SFR(t) * gap, gap), u = t * CAMFPS - k;
  const brain = angC + nextStep * u;                 // the brain's smooth guess between frames
  wheel(xR, y, R, brain, 12, { a });
  const dir = Math.abs(nextStep) < gap * 0.03 ? 0 : Math.sign(nextStep);
  spinArrow(xL, y, R * 1.12, 1, BLUEc, a); spinArrow(xR, y, R * 1.12, dir, dir < 0 ? CORALc : BLUEc, a);
  if (label) { text("what really happens", xL, y - R - 90, 46, BLUE, "center", 800, a); text("what you see on camera", xR, y - R - 90, 46, dir < 0 ? CORAL : INK, "center", 800, a); text(dir === 0 ? "frozen" : dir < 0 ? "backwards" : "forwards", xR, y + R + 50, 52, dir < 0 ? CORAL : dir === 0 ? GOLD : BLUE, "center", 800, a); }
}
let SFR = () => 0.17;
SCENES.spokes = (t, T, B, E, dur) => {
  clear(); vignette(); SFR = u => spokeFrac(u, B);
  const a = seg(t, 0.2, 1.0);
  spokesView(t, spokeFrac(t, B), t > B(1), a, 560, 1360, 500, 230);
  plate("12 identical spokes", 960, 880, 46, INK, "center", win(t, B(0) + 0.5, B(1), 0.4));
  plate("gold mark: only for us", 960, 880, 46, GOLD, "center", win(t, B(1), B(2), 0.4));
  plate(`each camera frame: the wheel turns ${Math.round(spokeFrac(t, B) * 30)}°`, 960, 880, 46, INK, "center", win(t, B(2), dur, 0.4));
  MAS(1800, T, { s: 0.24, look: [-0.8, -0.2], mouth: t > B(4) && t < B(6) ? "o" : t > B(7) ? "grin" : "smile" });
};

// 4 — the rule: the spoke clock; aliasing on a sampled sine
SCENES.rule = (t, T, B, E, dur) => {
  clear(); vignette();
  const sw = 1 - seg(t, B(5) - 0.4, B(5) + 0.4);
  if (sw > 0) {
    // dial: one gap = one full turn of the dial; forward half (blue) and backward half (coral)
    const cx = 620, cy = 500, r = 260;
    g.save(); g.globalAlpha = sw; g.lineWidth = 46; g.strokeStyle = css(BLUEc); g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2); g.stroke(); g.strokeStyle = css(CORALc); g.beginPath(); g.arc(cx, cy, r, Math.PI / 2, Math.PI * 1.5); g.stroke(); g.restore();
    dot(cx, cy - r, 30, GOLDc, sw);
    text("½ gap", cx, cy + r + 70, 42, QUIET, "center", 700, sw); text("0 = 1 gap = 2 gaps …", cx, cy - r - 70, 42, GOLD, "center", 700, sw);
    const f = t < B(1) ? 0.1 + 0.05 * Math.sin(t) : t < B(2) ? lerp(0.1, 0.3, seg(t, B(1), B(1) + 3)) : t < B(3) ? lerp(0.3, 0.8, seg(t, B(2), B(2) + 3)) : t < B(4) ? lerp(0.8, 1.0, seg(t, B(3), B(3) + 1.5)) : 1.0 + 0.02 * Math.sin(t * 2);
    const an = -Math.PI / 2 + TAU2 * f; line(cx, cy, cx + (r - 60) * Math.cos(an), cy + (r - 60) * Math.sin(an), INK, sw, 12); dot(cx, cy, 18, INK, sw);
    text("step per frame (leftover after whole gaps)", cx, 120, 44, INK, "center", 700, sw);
    const ff = ((f % 1) + 1) % 1, zone = Math.abs(ff) < 0.03 || ff > 0.97 ? "freezes" : ff < 0.5 ? "looks forwards" : "looks backwards";
    plate(zone, 1350, 360, 64, zone === "freezes" ? GOLD : zone === "looks forwards" ? BLUE : CORAL, "center", sw);
    plate("12 spokes · 24 fps → 30° gap", 1350, 560, 48, INK, "center", win(t, B(4), dur, 0.4) * sw);
    plate("2 turns a second → frozen", 1350, 660, 48, GOLD, "center", win(t, B(4) + 3.5, dur, 0.4) * sw);
  }
  const al = seg(t, B(5) - 0.2, B(5) + 0.6);
  if (al > 0) {
    // a fast sine sampled too slowly: the dots trace a slow false wave
    const x0 = 200, x1 = 1720, y = 480, fr = 11, sr = 12;         // signal 11 cycles across, sampled 12 times → alias of 1 cycle
    trace(x0, x1, y, 140, x => Math.sin(TAU2 * fr * (x - x0) / (x1 - x0) - t * 2), QUIETc, al * 0.6, 3);
    const pts = []; for (let i = 0; i <= sr; i++) { const x = x0 + (x1 - x0) * i / sr, v = Math.sin(TAU2 * fr * i / sr - t * 2); pts.push([x, y - 140 * v]); }
    poly(pts.map(p => p), CORALc, al * seg(t, B(5) + 1.5, B(5) + 3), 6); pts.forEach(([x, yy]) => dot(x, yy, 14, GOLDc, al));
    plate("aliasing: a fast pattern pretends to be slow", 960, 150, 50, CORAL, "center", al);
    plate("need more than 2 samples per repeat", 960, 820, 50, GOLD, "center", win(t, B(6), dur, 0.4));
  }
  MAS(1800, T, { s: 0.24, look: [-0.8, 0], mouth: t > B(2) && t < B(3) ? "o" : "smile" });
};

// 5 — a real car: 5 spokes, 65 cm tyre, 24 fps; frozen near 35 km/h, bands repeat
const kmhOfTurn = (rps) => rps * Math.PI * 0.65 * 3.6;    // rev/s → km/h for a 65 cm tyre
SCENES.car = (t, T, B, E, dur) => {
  clear(); vignette();
  const vOf = u => u < B(1) ? lerp(10, 35, seg(u, 0.5, B(1) + 2)) : u < B(2) ? 35 : u < B(3) ? 35 + 4 * Math.sin((u - B(2)) * 0.9) : lerp(35, 105, seg(u, B(3), B(4) + 3));
  const gap = TAU2 / 5, stepOf = vv => alias(vv / (Math.PI * 0.65 * 3.6) / 24 * TAU2, gap);
  const v = vOf(t), step = stepOf(v);
  // apparent angle: the 24 fps step, shown at a quarter of real time so it stays readable, integrated over the scene
  let ang = 0; for (let u = 0; u < t; u += 0.05) ang += stepOf(vOf(u)) * 24 * 0.25 * 0.05;
  roadDashes(640, t * v * 30);
  carSide(760, 540, 1.15, ang, 1);
  const dir = Math.abs(step) < gap * 0.03 ? 0 : Math.sign(step);
  spinArrow(760 - 213, 563, 125, dir, dir < 0 ? CORALc : BLUEc, 1);
  // speedometer
  text(`${Math.round(v)} km/h`, 1520, 220, 72, INK, "center", 800, 1);
  text(dir === 0 ? "wheel looks frozen" : dir < 0 ? "wheel looks backwards" : "wheel looks forwards", 1520, 310, 46, dir < 0 ? CORAL : dir === 0 ? GOLD : BLUE, "center", 800, 1);
  // band bar: apparent direction across 0..110 km/h
  const bx0 = 260, bx1 = 1660, by = 800 - 40;
  for (let x = bx0; x < bx1; x += 6) { const vv = (x - bx0) / (bx1 - bx0) * 110, st = alias(vv / (Math.PI * 0.65 * 3.6) / 24 * TAU2, gap), c = Math.abs(st) < gap * 0.04 ? GOLDc : st < 0 ? CORALc : BLUEc; rrect(x, by, 6, 34, 0, c, seg(t, B(3) - 0.3, B(3) + 0.6)); }
  line(bx0 + (bx1 - bx0) * v / 110, by - 20, bx0 + (bx1 - bx0) * v / 110, by + 54, INK, seg(t, B(3) - 0.3, B(3) + 0.6), 6);
  [0, 35, 70, 105].forEach(k => text(String(k), bx0 + (bx1 - bx0) * k / 110, by - 46, 40, k ? GOLD : QUIET, "center", 700, seg(t, B(3), B(3) + 0.6)));
  plate("5 spokes · 65 cm tyre · 24 fps", 760, 150, 48, INK, "center", win(t, 0.5, B(2), 0.4));
  plate("screen speed ≠ real speed", 760, 150, 50, CORAL, "center", win(t, B(4), B(5), 0.4));
  const hA = win(t, B(5), dur, 0.4); if (hA > 0) { g.globalAlpha = hA * 0.9; g.fillStyle = BG; g.fillRect(0, 0, W, H); g.globalAlpha = 1; const hx = 960, hy = 470 + 14 * Math.sin(t); g.save(); g.globalAlpha = hA; g.fillStyle = css(BLUEc); g.beginPath(); g.ellipse(hx, hy, 190, 100, 0, 0, TAU2); g.fill(); g.fillRect(hx + 140, hy - 22, 300, 34); g.restore(); line(hx - 420, hy - 135, hx + 420, hy - 135, INK, hA, 16); line(hx, hy - 135, hx, hy - 95, INK, hA, 12); plate("blades line up with the frames → frozen", 960, 780, 48, GOLD, "center", hA); }
  MAS(1800, T, { s: 0.24, look: [-0.8, -0.2], mouth: dir === 0 ? "o" : "smile", a: 1 - hA * 0.5 });
};

// 6 — shutter: long exposure blurs, short exposure sharpens
SCENES.shutter = (t, T, B, E, dur) => {
  clear(); vignette();
  const gap = TAU2 / 12, ang = t * 0.6 * gap * CAMFPS, k = Math.floor(t * CAMFPS), held = Math.floor(t * CAMFPS) / CAMFPS * 0.6 * gap * CAMFPS;
  const one = 1 - seg(t, B(1) - 0.3, B(1) + 0.3);
  if (one > 0) { wheel(960, 480, 240, held, 12, { a: one, blur: lerp(0.02, 0.35, 0.5 + 0.5 * Math.sin(t * 1.2)) }); text("shutter open for a short time → anything moving smears", 960, 820, 46, INK, "center", 700, one); }
  const two = seg(t, B(1) - 0.3, B(1) + 0.3);
  if (two > 0) {
    wheel(560, 480, 220, held, 12, { a: two, blur: 0.42 }); text("slow shutter: soft disc", 560, 170, 48, BLUE, "center", 800, two); text("illusion fades", 560, 780, 44, QUIET, "center", 700, two);
    const tw = seg(t, B(2) - 0.3, B(2) + 0.3); wheel(1360, 480, 220, held, 12, { a: tw, blur: 0 }); text("fast shutter: crisp spokes", 1360, 170, 48, CORAL, "center", 800, tw); text("illusion stronger", 1360, 780, 44, CORAL, "center", 700, tw);
    plate("very short exposures show it most", 960, 880 - 40, 48, GOLD, "center", win(t, B(3), dur, 0.4));
  }
  MAS(1800, T, { s: 0.22, look: [-0.8, -0.2], mouth: "smile" });
};

// 6b — try it with your phone
SCENES.angle = (t, T, B, E, dur) => {
  clear(); vignette();
  rrect(700, 120, 520, 760 - 40, 60, [42, 47, 64], 1, QUIETc, 6);
  const fps = t < B(1) + 1 ? 30 : 60, gap = TAU2 / 3, step = alias(TAU2 * 19.5 / fps, gap), ang = step * fps * t * 0.2;
  wheel(960, 460, 200, ang, 3, { col: BLUEc });
  rrect(860, 720, 200, 60, 30, PANELc, 1); text(`${fps} fps`, 960, 750, 42, GOLD, "center", 800, 1);
  spinArrow(960, 460, 240, Math.sign(step), step < 0 ? CORALc : BLUEc, 1);
  plate("film a fan, a bike, a car", 400, 300, 46, INK, "center", win(t, 0.3, dur, 0.4));
  plate("change the frame rate", 1520, 300, 46, GOLD, "center", win(t, B(1), dur, 0.4));
};

// 7 — your own eyes: flickering lamps act as frames; lathe; turntable dots; the open question
SCENES.eyes = (t, T, B, E, dur) => {
  clear(); vignette();
  const lampA = win(t, B(1) - 0.3, B(5), 0.4);
  if (lampA > 0) {
    // the lamp's light shown as a gentle pulse graph (no screen flashing)
    rrect(120, 140, 560, 200, 20, PANELc, lampA); trace(150, 650, 260, 60, x => Math.abs(Math.sin((x - 150) / 30 - t * 2)), GOLDc, lampA, 6);
    text("100 or 120 pulses a second", 400, 380, 42, GOLD, "center", 700, lampA);
    const gap = TAU2 / 8, held = Math.floor(t * CAMFPS) * alias(0.98 * gap, gap);
    wheel(1240, 470, 230, held + 0 * t, 8, { a: lampA * (t < B(4) ? 1 : 1 - seg(t, B(4), B(4) + 0.5)) });
    plate(t > B(3) ? "a lathe that looks stopped may be spinning" : "lit in flashes, like frames", 1240, 820 - 30, 46, t > B(3) ? CORAL : INK, "center", lampA * win(t, B(2), B(4) + 0.2, 0.4));
    // turntable strobe dots
    const tt = seg(t, B(4) - 0.2, B(4) + 0.5) * (1 - seg(t, B(5) - 0.4, B(5)));
    if (tt > 0) { g.save(); g.globalAlpha = tt; g.fillStyle = "#1d1f2b"; g.beginPath(); g.arc(1240, 470, 250, 0, TAU2); g.fill(); g.restore(); for (let i = 0; i < 90; i++) { const an = i / 90 * TAU2 - Math.PI / 2 + 0.002 * Math.sin(t); dot(1240 + 228 * Math.cos(an), 470 + 228 * Math.sin(an), 6, INKc, tt); } dot(1240, 470, 30, CORALc, tt); plate("strobe dots look still at the right speed", 1240, 820 - 30, 44, GOLD, "center", tt); }
  }
  const qa = seg(t, B(5) - 0.3, B(5) + 0.4);
  if (qa > 0) {
    text("steady light", 960, 150, 56, INK, "center", 800, qa);
    wheel(960, 460, 170, t * 1.2, 12, { a: qa, blur: 0.25 });
    const ca = win(t, B(6), dur, 0.4);
    rrect(140, 330, 520, 260, 24, PANELc, ca); text("snapshots in vision?", 400, 420, 44, BLUE, "center", 800, ca); text("Purves et al. 1996", 400, 500, 40, QUIET, "center", 600, ca);
    rrect(1260, 330, 520, 260, 24, PANELc, ca); text("rival motion detectors?", 1520, 420, 44, CORAL, "center", 800, ca); text("Kline et al. 2004", 1520, 500, 40, QUIET, "center", 600, ca);
    plate("still an open question", 960, 760, 50, GOLD, "center", ca);
  }
  if (t < B(1)) { plate("no camera at all", 960, 480, 64, CORAL, "center", win(t, 0.3, B(1), 0.4)); }
  MAS(170, T, { s: 0.24, look: [0.8, -0.2], mouth: t > B(3) && t < B(4) ? "o" : "smile" });
};

// 8 — payoff: the opening car again with both views; then the end card
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette();
  const card = seg(t, B(3) - 0.6, B(3) + 0.2);
  if (card < 1) {
    const a = 1 - card, tc = 6 + t * 0.5;
    roadDashes(760, carTrue(tc) * TAU2 * 72 * 1.1, a);
    carSide(960, 660, 1.1, appAt(tc), a);
    plate("the wheel goes forward", 560, 200, 52, BLUE, "center", a * win(t, B(2), dur, 0.4));
    plate("the pictures go backwards", 1360, 200, 52, CORAL, "center", a * win(t, B(2) + 1.2, dur, 0.4));
    plate("leftover step > half a gap → wrong spoke", 960, 330, 46, GOLD, "center", a * win(t, B(1) + 1, B(2), 0.4));
  }
  if (card > 0) { wheel(330, 380, 150, t * 0.5, 12, { a: card }); MAS(330, T, { s: 0.28, y: 880, look: [0.6, -0.2], a: card }); clapper(330, 880, 0.28, card); }
};
