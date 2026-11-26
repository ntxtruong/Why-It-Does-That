// Episode 63 (v5 Short, 1080×1920, Kitchen Science, hook=why len=short look=flat, NO mascot):
// raw vs boiled egg. Spin a raw egg, stop it for a moment with a finger, let go: it starts turning again,
// because the finger only stopped the shell; the liquid inside kept swirling and drags the shell back round.
// A hard-boiled egg is solid, so it all stops at once (Exploratorium "Spinning eggs"; Scientific American;
// NASA JPL "Planetary egg wobble"). Pictures are schematic (top view, egg lying on its side).
//
// STORYBOARD (one stage: the brown raw egg on a walnut board never leaves the frame)
//  hook   0.0–2.86 frame 0: raw egg turning, finger hovering; finger lands 0.45 (stop), lifts 1.55, egg restarts.
//  guess  2.86–7.55 "sloppy stop" struck; raw shrinks to the bottom slot, a white boiled egg slides in on top;
//                   both stopped on "stopped" (5.22), let go 6.0: the raw one restarts, the boiled one stays still.
//  reveal 7.55–10.67 boiled slides out, raw back to centre; on "Look" the shell splits and flies apart (burst
//                   7.72); push-in; finger pins the shell (8.9), rim goes coral, the inside keeps swirling.
//  why    10.67–15.86 gold swirl arrows on "swirling"; finger lifts on "let go"; on "drags" the rim turns gold and
//                   the shell turns again with the swirl.
//  boiled 15.86–19.14 raw to the bottom slot; the boiled egg slides in already cut (solid); stopped on "stops":
//                   white and yolk freeze together; the halves fly back onto the raw egg, finger presses it.
//  end    19.14–21.74 "Raw?"; finger lifts, the egg restarts; last 0.45 s = frame 0 (loop).
window.NOPUSH = ["hook", "guess", "reveal", "why", "boiled", "end"];
window.NODIP = window.NOPUSH;

// Kitchen Science palette: walnut board, warm dark room, cream/yolk accents
const E_BGT = [58, 28, 16], E_BGB = [24, 10, 6], E_WOOD = [104, 56, 30], E_WOOD_D = [84, 42, 22], E_WOOD_L = [128, 72, 40];
const E_RAW = [222, 164, 108], E_RAW_D = [178, 118, 70], E_RAW_L = [246, 204, 160];
const E_BOIL = [246, 242, 232], E_BOIL_D = [204, 196, 184], E_BOIL_L = [255, 255, 252];
const E_ALB = [238, 228, 196], E_YOLK = [255, 166, 34], E_YOLK_L = [255, 214, 120], E_YOLKB = [255, 206, 84];
const E_SKIN = [240, 190, 156], E_SKIN_D = [206, 148, 116], E_NAIL = [252, 222, 212];
const E_GOLD = [255, 194, 61], E_CORAL = [255, 112, 92], E_DARK = [44, 18, 8], E_CREAM = [252, 244, 228];
const EA = 380, EB = 270;     // egg half-length / half-width at scale 1
const TITLE_Y = 170;

// ---------- motion profiles (global time T) ----------
const RAMP = (T, a, b, v0, v1) => lerp(v0, v1, ss((T - a) / (b - a)));
// raw shell angular speed (rad/s)
function wShell(T) {
  // review 2: frame 0 = the egg just let go and creeping round again (the weird result), stop at 1.2, let go 1.9
  if (T < 1.2) return RAMP(T, 0, 0.9, 0.45, 2.2);
  if (T < 1.9) return RAMP(T, 1.2, 1.28, 2.2, 0);
  if (T < 5.22) return RAMP(T, 1.9, 2.8, 0, 2.2);
  if (T < 6.0) return RAMP(T, 5.22, 5.3, 2.2, 0);
  if (T < 8.9) return RAMP(T, 6.0, 6.9, 0, 2.0);
  if (T < 13.85) return RAMP(T, 8.9, 8.98, 2.0, 0);
  if (T < 18.9) return RAMP(T, 13.85, 14.9, 0, 1.6);
  if (T < 19.5) return RAMP(T, 18.9, 18.98, 1.6, 0);
  if (T < 20.75) return RAMP(T, 19.5, 20.3, 0, 2.2);
  if (T < 21.3) return RAMP(T, 20.75, 20.83, 2.2, 0);
  return RAMP(T, 21.3, TL.total, 0, 0.45);
}
// the raw egg's liquid: moves with the shell until the cut; after the finger pins the shell it keeps swirling
function wFluid(T) {
  if (T < 8.9) return Math.max(wShell(T), 2.0);
  if (T < 13.9) return lerp(2.0, 1.75, ss((T - 8.9) / 5));
  return RAMP(T, 13.9, 14.9, 1.75, 1.6);
}
// boiled egg (solid: shell and inside are one body)
function wBoil(T) {
  if (T < 10) return RAMP(T, 5.22, 5.3, 3.0, 0);
  return RAMP(T, 17.96, 18.04, 2.8, 0);
}
const DT = 1 / 240, NSTEP = Math.ceil((TL.total + 1) / DT);
function integ(fn) { const a = new Float64Array(NSTEP + 1); for (let i = 0; i < NSTEP; i++) a[i + 1] = a[i] + fn((i + 0.5) * DT) * DT; return a; }
const ANG_S = integ(wShell), ANG_F = integ(wFluid), ANG_B = integ(wBoil);
const angAt = (A, T) => { const x = clamp(T, 0, NSTEP * DT - DT) / DT, i = Math.floor(x); return lerp(A[i], A[i + 1], x - i); };
// loop: the shell angle at the last frame must equal frame 0; spread the small correction over 20.6 s → end
const LOOPC = (() => { const I = angAt(ANG_S, TL.total); let d = I % TAU2; if (d > Math.PI) d -= TAU2; return d; })();
const thShell = T => angAt(ANG_S, T) - LOOPC * ss((T - 19.6) / 1.0);
const thFluid = T => angAt(ANG_F, T) + 0.6;
const thBoil = T => angAt(ANG_B, T) + 1.1;

// layout (review 1): captions at the top (y 262), raw egg big in the middle; the second egg is a round inset
// (top left) or swaps places with it, so the raw egg never shrinks below ~0.98 while it is the subject
const S1 = { x: 540, y: 1060, s: 1.35 }, SZ = { x: 540, y: 1060, s: 1.4 };
// review 3: the egg in the sentence stays big (BIG, ~840 px long); the other egg is a round inset top left (INS)
const BIG = { x: 600, y: 1110, s: 1.1 }, INS = { x: 245, y: 640, s: 0.48 }, INSR = 205;
const PL = (a, b, u) => ({ x: lerp(a.x, b.x, u), y: lerp(a.y, b.y, u), s: lerp(a.s, b.s, u) });
function rawPlace(T) {
  if (T < 3.0) return S1;
  if (T < 7.0) return PL(S1, BIG, eio((T - 3.0) / 0.5));
  if (T < 8.0) return PL(BIG, S1, eio((T - 7.0) / 0.55));
  if (T < 15.0) return PL(S1, SZ, eio((T - 8.05) / 0.8));
  if (T < 18.4) return PL(SZ, INS, eio((T - 15.0) / 0.55));
  return PL(INS, S1, eio((T - 18.45) / 0.45));
}
function boilPlace(T) {
  if (T > 3.4 && T < 7.3) { const k = clamp(spring(T, 3.4, 12, 0.5), 0, 1.2) * (1 - eio((T - 6.95) / 0.3)); return { x: INS.x, y: INS.y, s: INS.s * k }; }
  if (T > 15.3 && T < 18.7) return { x: lerp(-520, BIG.x, eout((T - 15.3) / 0.55)) + 1200 * eio((T - 18.2) / 0.45), y: BIG.y, s: BIG.s };
  return null;
}
const insetA = T => Math.max(win(T, 3.35, 7.25, 0.2), win(T, 15.25, 18.5, 0.2));
function insetPlate(a) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.fillStyle = css([40, 18, 8], 0.94); g.beginPath(); g.arc(INS.x, INS.y, INSR, 0, TAU2); g.fill();
  g.strokeStyle = css(E_CREAM); g.lineWidth = 10; g.stroke(); g.restore(); }
// gold "turning again" arrows hugging both tips of the raw egg (frame 0, the restarts, the loop end)
function restartArcs(R, th, a) {
  if (a <= 0.01) return; const r = Math.min(EA * R.s + 66, 515);
  [0, Math.PI].forEach(o => { const a0 = th + o + 0.25, a1 = a0 + 0.95; g.save(); g.globalAlpha = a; g.strokeStyle = css(E_GOLD); g.lineWidth = 18; g.lineCap = "round";
    g.beginPath(); g.arc(R.x, R.y, r, a0, a1); g.stroke(); const ex = R.x + r * Math.cos(a1), ey = R.y + r * Math.sin(a1), an = a1 + Math.PI / 2;
    g.fillStyle = css(E_GOLD); g.beginPath(); g.moveTo(ex + 44 * Math.cos(an), ey + 44 * Math.sin(an)); g.lineTo(ex + 34 * Math.cos(an + 2.3), ey + 34 * Math.sin(an + 2.3)); g.lineTo(ex + 34 * Math.cos(an - 2.3), ey + 34 * Math.sin(an - 2.3)); g.closePath(); g.fill(); g.restore(); });
}
const restartA = T => Math.max(1 - seg(T, 0.95, 1.15), win(T, 2.0, 3.0, 0.2), win(T, 6.35, 7.0, 0.2), win(T, 19.6, 20.6, 0.2), seg(T, 21.3, 21.45));

// ---------- drawing ----------
function bg63() {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, css(E_BGT)); gr.addColorStop(1, css(E_BGB)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  soft(540, 1000, 820, [150, 80, 40], 0.35);
  // walnut board, full height (review 1: the bottom 28 % was empty)
  g.save(); g.beginPath(); g.roundRect(0, 470, 1080, 1470, 60); g.fillStyle = css(E_WOOD_D); g.fill();
  g.beginPath(); g.roundRect(0, 456, 1080, 1470, 60); g.fillStyle = css(E_WOOD); g.fill(); g.clip();
  for (let i = 0; i < 22; i++) { const y0 = 480 + i * 70 + hash(i) * 30; g.strokeStyle = css(i % 3 ? E_WOOD_D : E_WOOD_L, 0.55); g.lineWidth = 8 + 6 * hash(i, 2);
    g.beginPath(); g.moveTo(0, y0); for (let x = 0; x <= 1080; x += 60) g.lineTo(x, y0 + 14 * Math.sin(x / 170 + i * 1.7) + 8 * Math.sin(x / 61 + i)); g.stroke(); }
  soft(540, 1000, 640, [255, 220, 170], 0.12);
  g.restore();
}
// egg outline path in local coords (blunt end at +x)
function eggPath(a, b) { g.beginPath(); for (let i = 0; i <= 72; i++) { const u = i / 72 * TAU2; const x = a * Math.cos(u), y = b * Math.sin(u) * (1 + 0.09 * Math.cos(u)); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); }
function eggShadow(x, y, s) { g.save(); g.globalAlpha = 0.45; g.fillStyle = "rgba(20,6,0,1)"; g.beginPath(); g.ellipse(x + 26 * s, y + 40 * s, EA * s * 1.0, EA * s * 0.92, 0, 0, TAU2); g.filter = "none"; g.restore();
  const gr = g.createRadialGradient(x + 24 * s, y + 34 * s, 0, x + 24 * s, y + 34 * s, EA * s * 1.05); gr.addColorStop(0, "rgba(20,6,0,0.42)"); gr.addColorStop(0.7, "rgba(20,6,0,0.22)"); gr.addColorStop(1, "rgba(20,6,0,0)"); g.fillStyle = gr; g.fillRect(x - 2 * EA * s, y - 2 * EA * s, 4 * EA * s, 4 * EA * s); }
// shell surface (whole egg) in local coords; half: 0 whole, -1 / +1 = only the y<0 / y>0 half
function shellSurf(s, cols, specks, half = 0) {
  const a = EA * s, b = EB * s;
  g.save(); if (half) { g.beginPath(); g.rect(-a * 1.3, half < 0 ? -b * 1.4 : 0, a * 2.6, b * 1.4); g.clip(); }
  eggPath(a, b); g.fillStyle = css(cols[0]); g.fill(); g.strokeStyle = css(cols[1]); g.lineWidth = 10 * s + 4; g.stroke();
  g.save(); eggPath(a, b); g.clip();
  if (specks) for (let i = 0; i < 40; i++) { const u = hash(i, 1) * TAU2, r = Math.sqrt(hash(i, 2)) * 0.85; dot(a * r * Math.cos(u), b * r * Math.sin(u), (6 + 8 * hash(i, 3)) * s, cols[1], 0.55); }
  g.restore(); g.restore();
}
// fixed light on top of the shell (does not rotate)
function shellLight(s, th, half = 0) {
  const a = EA * s, b = EB * s;
  g.save(); eggPath(a, b); g.clip(); if (half) { g.beginPath(); g.rect(-a * 1.3, half < 0 ? -b * 1.4 : 0, a * 2.6, b * 1.4); g.clip(); }
  g.rotate(-th); const gr = g.createRadialGradient(-a * 0.3, -b * 0.55, 0, -a * 0.2, -b * 0.3, a * 1.2); gr.addColorStop(0, "rgba(255,252,240,0.55)"); gr.addColorStop(0.35, "rgba(255,250,235,0.12)"); gr.addColorStop(0.8, "rgba(60,20,0,0)"); gr.addColorStop(1, "rgba(60,20,0,0.35)");
  g.fillStyle = gr; g.fillRect(-a * 1.5, -a * 1.5, a * 3, a * 3); g.restore();
}
// motion arcs beside the two tips while turning
function motionArcs(x, y, s, th, w, a = 1) {
  const k = clamp(Math.abs(w) / 2.2) * a; if (k < 0.05) return;
  [0, Math.PI].forEach(o => { const r = (EA + (o ? 10 : 34)) * s + 26; g.save(); g.strokeStyle = css(E_CREAM, 0.75 * k); g.lineWidth = 10; g.lineCap = "round";
    g.beginPath(); g.arc(x, y, r, th + o - 0.75 * Math.sign(w), th + o - 0.18 * Math.sign(w), w < 0); g.stroke();
    g.strokeStyle = css(E_CREAM, 0.4 * k); g.beginPath(); g.arc(x, y, r + 34, th + o - 0.55 * Math.sign(w), th + o - 0.22 * Math.sign(w), w < 0); g.stroke(); g.restore(); });
}
// inside of the raw egg (cut open): thin rim, clear-cream white with swirl streaks, yolk riding the swirl
function rawInside(s, thS, thF, rimCol, rimGlow, T) {
  const a = EA * s, b = EB * s;
  eggPath(a, b); g.fillStyle = css(E_RAW); g.fill();
  g.save(); g.scale(0.93, 0.9); eggPath(a, b); g.restore(); g.fillStyle = css(E_ALB); g.fill();
  g.save(); g.scale(0.93, 0.9); eggPath(a, b); g.restore(); g.save(); g.clip();
  g.rotate(thF - thS);   // the fluid frame turns relative to the shell
  for (let i = 0; i < 12; i++) { const r = (60 + 22 * i) * s, ph = hash(i, 5) * TAU2, len = 0.55 + 0.5 * hash(i, 6);
    g.strokeStyle = css([255, 255, 250], 0.75); g.lineWidth = 9 * s + 3; g.lineCap = "round"; g.beginPath(); g.arc(0, 0, r, ph, ph + len); g.stroke();
    g.beginPath(); g.arc(0, 0, r, ph + Math.PI, ph + Math.PI + len * 0.7); g.stroke(); }
  for (let i = 0; i < 18; i++) { const r = (90 + 180 * hash(i, 7)) * s, u = hash(i, 8) * TAU2; dot(r * Math.cos(u), r * Math.sin(u), 7 * s + 2, [214, 196, 150], 0.8); }
  // yolk off-centre, so its turning is visible; a highlight that turns with it
  dot(70 * s, 18 * s, 128 * s, [230, 130, 20], 1); dot(70 * s, 18 * s, 118 * s, E_YOLK, 1); dot(40 * s, -20 * s, 44 * s, E_YOLK_L, 0.85);
  dot(130 * s, 50 * s, 16 * s, [255, 236, 190], 0.9);
  g.restore();
  // rim (the shell) — coral when pinned, gold when dragged
  g.save(); eggPath(a, b); g.strokeStyle = css(rimCol); g.lineWidth = 26 * s + 6; g.stroke();
  if (rimGlow > 0.01) { g.globalCompositeOperation = "lighter"; eggPath(a, b); g.strokeStyle = css(rimCol, 0.3 * rimGlow); g.lineWidth = 50 * s + 10; g.stroke(); }
  g.restore();
}
// inside of the boiled egg: solid white, firm yolk, a few grains so the turning shows
function boilInside(s) {
  const a = EA * s, b = EB * s;
  eggPath(a, b); g.fillStyle = css(E_BOIL_D); g.fill();
  g.save(); g.scale(0.93, 0.9); eggPath(a, b); g.restore(); g.fillStyle = css(E_BOIL_L); g.fill();
  dot(60 * s, 10 * s, 136 * s, [236, 200, 90], 1); dot(60 * s, 10 * s, 124 * s, E_YOLKB, 1); dot(36 * s, -24 * s, 40 * s, [255, 236, 160], 0.8);
  for (let i = 0; i < 9; i++) { const u = i / 9 * TAU2, r = 250 * s; dot(r * Math.cos(u) * 1.05, r * Math.sin(u) * 0.66, 9 * s + 2, [214, 206, 190], 0.9); }
  dot(-200 * s, 0, 14 * s + 2, [220, 208, 186], 1);
  g.save(); eggPath(a, b); g.strokeStyle = css(E_BOIL); g.lineWidth = 26 * s + 6; g.stroke(); g.restore();
}
// finger pressing from the top right (dir: angle the finger points along), lift 0 = touching .. 1 = hovering
function finger(tx, ty, lift, dir = 2.3, sc = 1, a = 1) {
  if (a <= 0.01) return; const ux = Math.cos(dir), uy = Math.sin(dir);
  const ox = 150 * lift * sc, oy = -170 * lift * sc, x = tx + ox, y = ty + oy;
  const bx = x - ux * 1400, by = y - uy * 1400, wd = 118 * sc;
  // the finger's own shadow: falls down-left, further away the higher the finger
  { const sx = -10 - 110 * lift, sy = 12 + 130 * lift; g.save(); g.globalAlpha = a * (0.3 - 0.08 * lift); g.strokeStyle = "rgb(30,10,0)"; g.lineCap = "round"; g.lineWidth = wd + 10;
    g.beginPath(); g.moveTo(bx + sx, by + sy); g.lineTo(x + sx * sc, y + sy * sc); g.stroke(); g.restore(); }
  g.save(); g.globalAlpha = a; g.lineCap = "round";
  g.strokeStyle = css(E_SKIN_D); g.lineWidth = wd + 18; g.beginPath(); g.moveTo(bx, by); g.lineTo(x, y); g.stroke();
  g.strokeStyle = css(E_SKIN); g.lineWidth = wd; g.beginPath(); g.moveTo(bx, by); g.lineTo(x, y); g.stroke();
  // knuckle creases and the nail
  [260, 420].forEach(d => { const cx = x - ux * d, cy = y - uy * d; g.strokeStyle = css(E_SKIN_D); g.lineWidth = 9; g.beginPath(); g.moveTo(cx - uy * wd * 0.3, cy + ux * wd * 0.3); g.lineTo(cx + uy * wd * 0.3, cy - ux * wd * 0.3); g.stroke(); });
  g.translate(x - ux * 48 * sc, y - uy * 48 * sc); g.rotate(dir); g.fillStyle = css(E_NAIL); g.beginPath(); g.roundRect(-34 * sc, -36 * sc, 70 * sc, 72 * sc, 26 * sc); g.fill();
  g.restore();
}
function chip63(s, x, y, size, a, fg, bgc, strike = 0) {
  if (a <= 0.01) return; g.save(); g.font = `900 ${size}px ${FONT}`; const w = g.measureText(s).width, px = size * 0.45, h = size * 1.45;
  g.globalAlpha = a; g.fillStyle = css(bgc); g.beginPath(); g.roundRect(x - w / 2 - px, y - h / 2, w + 2 * px, h, h * 0.3); g.fill(); g.restore();
  text(s, x, y + size * 0.03, size, fg, "center", 900, a);
  if (strike > 0) line(x - w / 2 - 12, y, lerp(x - w / 2 - 12, x + w / 2 + 12, eout(strike)), y, [200, 30, 20], a, 14);
}
function ripple(x, y, u, col, r0 = 40, r1 = 200) { if (u <= 0 || u >= 1) return; g.save(); g.strokeStyle = css(col, 1 - u); g.lineWidth = 12; g.beginPath(); g.arc(x, y, r0 + (r1 - r0) * eout(u), 0, TAU2); g.stroke(); g.restore(); }

// ---------- the stage ----------
// raw-egg finger timetable: [down at, up at]; tip lands on the egg's centre
const RAW_PRESS = [[1.2, 1.9], [5.22, 6.0], [8.9, 13.33], [18.9, 19.5], [20.75, 21.3]];
function rawLift(T) {
  for (const [d, u] of RAW_PRESS) { if (T >= d - 0.3 && T < u) return 1 - eout((T - (d - 0.3)) / 0.3); if (T >= u && T < u + 0.35) return eout((T - u) / 0.35); }
  return 1;
}
// finger visibility: hovering in hook / end, slides in for later presses
function rawFingerA(T) { if (T < 2.8) return 1 - seg(T, 2.3, 2.7); if (T > 19.0) return 1; let a = 0; for (const [d, u] of RAW_PRESS.slice(1)) a = Math.max(a, win(T, d - 0.6, u + 0.7, 0.3)); return a; }
// cut-open amount for the raw egg: halves fly apart at 7.72, fly back 18.55–19.0
const CUT0 = 7.72;
const rawFly = T => T < CUT0 ? 0 : T < 18.55 ? eout((T - CUT0) / 0.45) : 1 - eio((T - 18.55) / 0.45);

function drawRaw(T, R) {
  const thS = thShell(T), fly = rawFly(T);
  eggShadow(R.x, R.y, R.s);
  g.save(); g.translate(R.x, R.y); g.rotate(thS);
  if (fly > 0.001) {
    const pinned = T > 8.95 && T < 13.4, drag = seg(T, 13.9, 14.2) * (1 - seg(T, 15.2, 15.6));
    const rimCol = drag > 0 ? mix(E_CORAL, E_GOLD, drag) : pinned ? E_CORAL : E_RAW_D;
    rawInside(R.s, thS, thFluid(T), rimCol, pinned ? 0.6 + 0.4 * Math.sin(T * 8) : drag, T);
    if (fly < 0.999) [-1, 1].forEach(hf => { g.save(); g.translate(0, hf * fly * 520 * R.s); g.rotate(hf * fly * 0.6); g.globalAlpha = 1 - fly * 0.7; shellSurf(R.s, [E_RAW, E_RAW_D], true, hf); shellLight(R.s, thS, hf); g.restore(); });
  } else { shellSurf(R.s, [E_RAW, E_RAW_D], true); shellLight(R.s, thS); }
  g.restore();
  if (R.s > 0.6) motionArcs(R.x, R.y, R.s, thS, wShell(T));
}
function drawBoil(T, Bp) {
  if (!Bp || Bp.s < 0.01) return; const th = thBoil(T);
  if (Bp.s > 0.6) eggShadow(Bp.x, Bp.y, Bp.s);
  g.save(); g.translate(Bp.x, Bp.y); g.rotate(th); if (T > 15) boilInside(Bp.s); else shellSurf(Bp.s, [E_BOIL, E_BOIL_D], true); shellLight(Bp.s, th); g.restore();
  if (Bp.s > 0.6) motionArcs(Bp.x, Bp.y, Bp.s, th, wBoil(T));
}
function stage(T) {
  bg63();
  const R = rawPlace(T), thS = thShell(T), fly = rawFly(T), Bp = boilPlace(T);
  const rawInset = R.s < 0.6;
  if (!rawInset) drawRaw(T, R);
  if (Bp && Bp.s > 0.6) drawBoil(T, Bp);
  insetPlate(insetA(T));
  if (rawInset) drawRaw(T, R);
  if (Bp && Bp.s <= 0.6) drawBoil(T, Bp);
  if (!rawInset) restartArcs(R, thS, restartA(T));
  // crack flash on "Look"
  if (T > CUT0 - 0.06 && T < CUT0 + 0.6) { const u = (T - CUT0 + 0.06) / 0.66; g.save(); g.globalCompositeOperation = "lighter"; soft(R.x, R.y, 640 * R.s, [255, 240, 200], 0.9 * (1 - u)); g.restore();
    if (u < 0.25) { g.save(); g.translate(R.x, R.y); g.rotate(thS); const pts = []; for (let i = 0; i <= 12; i++) pts.push([lerp(-EA, EA, i / 12) * R.s, (i % 2 ? 22 : -22) * R.s]); poly(pts, [255, 252, 240], 1, 12); g.restore(); } }
  // gold swirl arrows inside (why)
  const sw = seg(T, 12.0, 12.3) * (1 - seg(T, 15.0, 15.3));
  if (sw > 0.01) { const thF = thFluid(T); for (let k = 0; k < 3; k++) { const a0 = thF + k * TAU2 / 3, r = 190 * R.s; g.save(); g.globalAlpha = sw; g.strokeStyle = css(E_GOLD); g.lineWidth = 16; g.lineCap = "round";
      g.beginPath(); g.arc(R.x, R.y, r, a0, a0 + 1.2); g.stroke(); const ex = R.x + r * Math.cos(a0 + 1.25), ey = R.y + r * Math.sin(a0 + 1.25), an = a0 + 1.25 + Math.PI / 2;
      g.fillStyle = css(E_GOLD); g.beginPath(); g.moveTo(ex + 34 * Math.cos(an), ey + 34 * Math.sin(an)); g.lineTo(ex + 26 * Math.cos(an + 2.3), ey + 26 * Math.sin(an + 2.3)); g.lineTo(ex + 26 * Math.cos(an - 2.3), ey + 26 * Math.sin(an - 2.3)); g.closePath(); g.fill(); g.restore(); } }
  ripple(R.x, R.y, (T - 13.93) / 0.7, E_GOLD, EA * R.s * 0.9, EA * R.s * 1.2);
  // boiled egg's finger: from the left in the inset, from the top right when it is big
  if (Bp) { const th = thBoil(T);
    if (T < 10) { const lf = T < 5.22 ? 1 - eout((T - 4.92) / 0.3) : T < 6.0 ? 0 : eout((T - 6.0) / 0.35); finger(Bp.x, Bp.y, lf, 0.5, 0.5, win(T, 4.6, 6.75, 0.25)); ripple(INS.x, INS.y, (T - 6.5) / 0.7, E_GOLD, 80, INSR + 30); }
    else { const [bx, by] = rimHit(Bp.x, Bp.y, Bp.s, th, 2.3); finger(bx, by, T < 17.96 ? 1 - eout((T - 17.66) / 0.3) : 0, 2.3, 1, win(T, 16.9, 18.2, 0.2)); ripple(Bp.x, Bp.y, (T - 17.98) / 0.6, E_CREAM, 150, 520); } }
  // finger on the raw egg
  if (!rawInset) { const split = false, lf = rawLift(T), fdir = 2.3, [fx, fy] = fly > 0.5 ? rimHit(R.x, R.y, R.s, thS, fdir) : [R.x, R.y];
    finger(fx, fy, lf, fdir, split ? 0.8 : 1, rawFingerA(T));
    RAW_PRESS.forEach(([d]) => ripple(fx, fy, (T - d) / 0.5, E_CREAM, 50, 190 * R.s)); }
  return R;
}

function rimTop(T, R) { const th = thShell(T), sg = Math.cos(th) >= 0 ? 1 : -1; return [R.x + sg * Math.sin(th) * EB * R.s, R.y - sg * Math.cos(th) * EB * R.s]; }
// where a finger coming along dir lands on the rim of an egg at (x, y, s) turned by th
function rimHit(x, y, s, th, dir) { const ba = dir + Math.PI, ph = ba - th, r = 1 / Math.sqrt(Math.cos(ph) ** 2 / (EA * EA) + Math.sin(ph) ** 2 / (EB * EB)) * 0.95 * s; return [x + r * Math.cos(ba), y + r * Math.sin(ba)]; }
const SCENES = {};
const DARK = E_DARK, CREAMBG = [252, 240, 214], GOLDBG = [255, 226, 150], CORALBG = [255, 214, 204];
// review 2: one text layer. No title in the hook (the caption carries the question); labels sit on the board,
// next to their egg (x 140 in the split) or above the big egg (y 490), never stacked on the caption band.
const LY = 490, TAGRAW = [246, 210, 168], BOILBG = [250, 248, 240];
const fadeIO = (T, a, b) => seg(T, a, a + 0.08) * (1 - seg(T, b - 0.06, b));
// review 3: labels never repeat a caption word (raw / cooked / frozen / pinned / still moving / turns again / one piece)
const TAG_BIG = [900, 620], TAG_INS = [560, 600];
SCENES.hook = (t, T) => { stage(T); chip63("again!", 830, 570, 60, 1 - seg(T, 0.95, 1.1), [80, 50, 0], GOLDBG); };
SCENES.guess = (t, T) => {
  stage(T);
  chip63("raw", TAG_BIG[0], TAG_BIG[1], 60, fadeIO(T, 3.45, 7.0), DARK, TAGRAW);
  chip63(T < 6.45 ? "cooked" : "frozen", TAG_INS[0], TAG_INS[1], 60, fadeIO(T, 4.4, 7.0), DARK, T < 6.45 ? BOILBG : GOLDBG);
};
SCENES.reveal = (t, T) => { stage(T); chip63("pinned", 540, LY, 64, fadeIO(T, 9.35, 12.0), [90, 20, 10], CORALBG); };
SCENES.why = (t, T) => {
  stage(T);
  chip63("pinned", 540, LY, 64, fadeIO(T, 9.35, 12.0), [90, 20, 10], CORALBG);
  chip63("still moving", 540, LY, 64, fadeIO(T, 12.07, 13.85), [80, 50, 0], GOLDBG);
  chip63("turns again", 540, LY, 64, fadeIO(T, 13.93, 15.0), [80, 50, 0], GOLDBG);
};
SCENES.boiled = (t, T) => {
  stage(T);
  chip63("raw", TAG_INS[0], TAG_INS[1], 60, fadeIO(T, 15.55, 18.4), DARK, TAGRAW);
  chip63("one piece", 300, 1470, 60, fadeIO(T, 16.9, 18.2), DARK, BOILBG);
};
SCENES.end = (t, T, B, E, dur) => {
  stage(T);
  chip63("Raw?", 540, 200, 150, fadeIO(T, 19.27, TL.total - 0.5), DARK, GOLDBG);
  chip63("again!", 830, 570, 60, seg(T, TL.total - 0.45, TL.total - 0.42), [80, 50, 0], GOLDBG);
};
