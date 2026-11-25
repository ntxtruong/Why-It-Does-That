// Episode 58 (v5 Short, 1080×1920, "Your Brain Is Tricking You"): the stopped-clock illusion (chronostasis).
// Facts (claims.md): after a saccade to a ticking clock the first tick seems longer (Yarrow et al. 2001, Nature 414:302);
// vision is suppressed during the saccade (saccadic masking) and the brain extends the new image backwards in time to
// about the start of the eye movement; the overestimate can reach about half a second (Wikipedia "Chronostasis");
// people make about 3 saccades a second (MIT Schiller lab). Pictures are schematic. The on-screen clock ticks exactly
// once per second of video time, so the viewer can try the illusion on the video itself.
window.NOPUSH = ["hook", "guess", "blind", "fill", "stretch", "every", "end"];
window.NODIP = window.NOPUSH;
// Brain palette: deep violet, clock cream, cyan, hot pink
const V1 = [62, 26, 108], V2 = [16, 8, 34], CREAM = [250, 244, 232], CYAN = [94, 230, 224], PINK = [255, 95, 162], INKD = [40, 26, 60];
function vbg() { const gr = g.createRadialGradient(W / 2, 820, 60, W / 2, 900, 1300); gr.addColorStop(0, css(V1)); gr.addColorStop(1, css(V2)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function cam(s, cx, cy, sx = W / 2, sy = 840) { g.setTransform(s, 0, 0, s, sx - cx * s, sy - cy * s); }
function camReset() { g.setTransform(1, 0, 0, 1, 0, 0); }
const MAS = (T, t, ev, o = {}) => MASR(T, t, { x: 150, y: 1585, s: 0.6, ev, ...o });
const PL = (s, x, y, size, col, a, w = 900) => plate(s, x, y, size, col, "center", a, w);

// analogue wall clock; sec = shown second (may carry a small overshoot), sharpness 0..1 (blur when < 1)
function wallClock(x, y, r, sec, o = {}) {
  g.save(); g.translate(x, y);
  g.fillStyle = "rgb(36,22,58)"; g.beginPath(); g.arc(8, 14, r + 26, 0, TAU2); g.fill();
  g.fillStyle = "rgb(120,84,200)"; g.beginPath(); g.arc(0, 0, r + 24, 0, TAU2); g.fill();
  g.fillStyle = css(CREAM); g.beginPath(); g.arc(0, 0, r, 0, TAU2); g.fill();
  for (let i = 0; i < 60; i++) { const an = i / 60 * TAU2, big = i % 5 === 0, r1 = r * (big ? 0.84 : 0.9), r2 = r * 0.95;
    g.strokeStyle = css(INKD); g.lineWidth = big ? r * 0.03 : r * 0.012; g.beginPath(); g.moveTo(Math.sin(an) * r1, -Math.cos(an) * r1); g.lineTo(Math.sin(an) * r2, -Math.cos(an) * r2); g.stroke(); }
  g.fillStyle = css(INKD); g.font = `800 ${Math.round(r * 0.17)}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle";
  [[12, 0], [3, 3], [6, 6], [9, 9]].forEach(([n, h]) => { const an = h / 12 * TAU2; g.fillText(String(n), Math.sin(an) * r * 0.68, -Math.cos(an) * r * 0.68); });
  const hand = (an, len, w, col) => { g.save(); g.rotate(an); g.strokeStyle = css(col); g.lineWidth = w; g.lineCap = "round"; g.beginPath(); g.moveTo(0, len * 0.18); g.lineTo(0, -len); g.stroke(); g.restore(); };
  hand(TAU2 * 10.17 / 12, r * 0.5, r * 0.06, INKD); hand(TAU2 * 10 / 60, r * 0.75, r * 0.04, INKD);
  hand(TAU2 * sec / 60, r * 0.86, r * 0.022, PINK); dot(0, 0, r * 0.05, PINK, 1);
  g.restore();
}
const secAt = T => { const n = Math.floor(T), u = T - n; return n + 0.12 * Math.exp(-u * 18) * Math.sin(u * 40); };
const CX = 665, CY = 850, CR = 340, DX = 190, DY = 480;
function targetDot(x, y, t, a = 1) { const p = 0.5 + 0.5 * Math.sin(t * 6); soft(x, y, 110, PINK, 0.45 * a); dot(x, y, 40 + 6 * p, PINK, a); dot(x, y, 16, [255, 255, 255], a);
  g.save(); g.globalAlpha = a * (1 - (t * 1.2 % 1)); g.strokeStyle = css(PINK); g.lineWidth = 6; g.beginPath(); g.arc(x, y, 50 + 70 * (t * 1.2 % 1), 0, TAU2); g.stroke(); g.restore(); }
function hookPic(t, T) { vbg(); targetDot(DX, DY, t, 1 - 0.6 * seg(t, 1.6, 2.0)); wallClock(CX, CY, CR, secAt(T)); }

const SCENES = {};
// 1 — hook: look at the pulsing dot; at "Now" an arrow sends the eyes to the ticking clock
SCENES.hook = (t, T, B, E, dur) => {
  hookPic(t, T);
  PL("1. look here", 430, DY, 52, PINK, seg(t, 0.05, 0.2) * (1 - seg(t, 1.25, 1.4)), 900);
  PL("2. jump!", 400, DY, 60, CYAN, seg(t, 1.3, 1.45), 900);
  arrow(250, 520, 400, 640, CYAN, seg(t, 1.3, 1.5), 12, 40);
  MAS(T, t, [[0.3, "?"], [1.4, "!"], [2.6, "?"]]);
};
// 2 — guess: same clock. "First tick felt longer?" then a ruler of equal one-second blocks: the video did not lag
SCENES.guess = (t, T, B, E, dur) => {
  vbg(); targetDot(DX, DY, t + 4.4, 0.25); wallClock(CX, CY, CR, secAt(T));
  PL("first tick felt longer?", 560, 360, 58, PINK, seg(t, 0.1, 0.3) * (1 - seg(t, 1.8, 1.95)), 900);
  PL("the video didn't lag", 560, 360, 60, CYAN, seg(t, 2.0, 2.2), 900);
  PL("every tick = 1 s", 680, 1245, 48, CREAM, seg(t, 2.3, 2.5), 900);
  for (let i = 0; i < 8; i++) { const on = seg(T, i + 0.98, i + 1.05); rrect(380 + i * 80, 1180, 70, 20, 8, on > 0.5 ? CYAN : [90, 70, 130], 0.4 + 0.6 * seg(t, 2.3, 2.5)); }
  MAS(T, t, [[0.3, "?"], [2.1, "!"]]);
};
// 3 — blind (reveal): a big eye jumps; your view pans: first as a blur, then switched OFF (black) during each jump
function bigEye(x, y, w, gx) { // gx -1..1 gaze
  g.save(); g.beginPath(); g.moveTo(x - w / 2, y); g.quadraticCurveTo(x, y - w * 0.42, x + w / 2, y); g.quadraticCurveTo(x, y + w * 0.42, x - w / 2, y); g.closePath();
  g.fillStyle = "rgb(250,248,246)"; g.fill(); g.clip();
  const ix = x + gx * w * 0.26; g.fillStyle = "rgb(70,120,200)"; g.beginPath(); g.arc(ix, y, w * 0.17, 0, TAU2); g.fill();
  g.fillStyle = "rgb(110,170,230)"; g.beginPath(); g.arc(ix, y, w * 0.12, 0, TAU2); g.fill();
  g.fillStyle = "rgb(12,8,20)"; g.beginPath(); g.arc(ix, y, w * 0.075, 0, TAU2); g.fill(); dot(ix + w * 0.04, y - w * 0.05, w * 0.025, [255, 255, 255], 0.9);
  g.restore();
  g.strokeStyle = "rgb(40,20,60)"; g.lineWidth = 12; g.beginPath(); g.moveTo(x - w / 2, y); g.quadraticCurveTo(x, y - w * 0.42, x + w / 2, y); g.quadraticCurveTo(x, y + w * 0.42, x - w / 2, y); g.stroke();
  for (let i = 0; i < 7; i++) { const u = (i + 0.5) / 7, lx = lerp(x - w * 0.36, x + w * 0.36, u), ly = y - w * 0.21 * (1 - Math.pow(2 * u - 1, 2)) * 1.0 - 4; line(lx, ly, lx + (u - 0.5) * 30, ly - 46, [40, 20, 60], 1, 9); }
}
const JUMPS = [[0.3, 1], [1.5, -1], [2.7, 1], [3.6, -1]];   // [start, direction] each jump lasts 0.18 s
function gazeAt(t) { let g0 = -1; for (const [s, d] of JUMPS) { if (t >= s + 0.18) g0 = d; else if (t >= s) return lerp(-d, d, eio((t - s) / 0.18)); } return g0; }
SCENES.blind = (t, T, B, E, dur) => {
  vbg(); const gx = gazeAt(t);
  bigEye(600, 600, 760, gx);
  // "your view" panel: the scene seen through the eye; pans with the gaze
  const px = 380, py = 880, pw = 640, ph = 380; g.save(); rrect(px - 10, py - 10, pw + 20, ph + 20, 30, [120, 84, 200], 1); g.beginPath(); g.roundRect(px, py, pw, ph, 24); g.clip();
  g.fillStyle = "rgb(44,22,74)"; g.fillRect(px, py, pw, ph);
  const off = (gx + 1) / 2, sh = -off * 520; let moving = false, mi = -1; JUMPS.forEach(([s], i) => { if (t >= s && t < s + 0.18) { moving = true; mi = i; } });
  const drawScene = dx => { targetDot(px + 200 + dx, py + ph / 2, T, 1); wallClock(px + 720 + dx, py + ph / 2, 150, secAt(T)); };
  if (moving && mi === 0) { g.globalAlpha = 0.25; for (let k = -4; k <= 4; k++) drawScene(sh + k * 40); g.globalAlpha = 1; }
  else drawScene(sh);
  // vision OFF: from the second jump on, the panel goes black for the jump plus a short margin
  const offA = JUMPS.slice(1).reduce((m, [s]) => Math.max(m, win(t, s - 0.04, s + 0.34, 0.03)), 0);
  if (offA > 0.01) { g.globalAlpha = offA; g.fillStyle = "rgb(6,4,10)"; g.fillRect(px, py, pw, ph); g.globalAlpha = 1; text("OFF", px + pw / 2, py + ph / 2, 120, PINK, "center", 900, offA); }
  g.restore();
  PL("your view", px + pw / 2, py - 50, 46, CREAM, seg(t, 0.1, 0.3), 900);
  PL(t < 1.35 ? "eye jump = a blur" : "brain: vision OFF mid-jump", 560, 330, 54, t < 1.35 ? CREAM : PINK, seg(t, 0.35, 0.5) * (t < 1.35 ? 1 - seg(t, 1.2, 1.35) : 1) + (t >= 1.35 ? seg(t, 1.4, 1.55) : 0), 900);
  MAS(T, t, [[0.4, "?"], [1.6, "!"], [3.0, "idea"]]);
};
// 4 — fill: a film strip of what you "saw": dot, dot, GAP, clock, clock; the clock frame is copied back into the gap
const FW5 = 180, FG = 12, FX0 = 72, FY = 450, FH5 = 430;
function frameBox(i, kind, a, t, T, glow = 0) {
  if (a <= 0.01) return; const x = FX0 + i * (FW5 + FG);
  g.save(); g.globalAlpha = a; rrect(x, FY, FW5, FH5, 18, kind === "gap" ? [8, 4, 12] : [44, 22, 74], 1, kind === "gap" ? PINK : [120, 84, 200], 6);
  if (kind === "dot") { dot(x + FW5 / 2, FY + FH5 / 2, 40, PINK, 1); dot(x + FW5 / 2, FY + FH5 / 2, 15, [255, 255, 255], 1); }
  if (kind === "clock") wallClock(x + FW5 / 2, FY + FH5 / 2, 62, secAt(T));
  if (kind === "gap") text("?", x + FW5 / 2, FY + FH5 / 2, 120, PINK, "center", 900, 1);
  if (glow > 0.01) { g.globalCompositeOperation = "lighter"; soft(x + FW5 / 2, FY + FH5 / 2, 170, CYAN, 0.5 * glow); }
  g.restore();
}
SCENES.fill = (t, T, B, E, dur) => {
  vbg();
  const kinds = ["dot", "dot", "gap", "clock", "clock"];
  kinds.forEach((k, i) => { if (i === 2 && t > 1.9) return; frameBox(i, k, seg(t, 0.1 + i * 0.2, 0.25 + i * 0.2), t, T); });
  // copy slides from frame 3 into the gap
  const mv = eio((t - 1.6) / 0.4); if (t > 1.6) { const x = lerp(3, 2, mv); g.save(); g.translate((x - 2) * (FW5 + FG), 0); frameBox(2, "clock", 1, t, T, t > 2.0 ? Math.exp(-(t - 2.0) * 1.5) + 0.25 : 0); g.restore(); }
  arrow(FX0 + 3.5 * (FW5 + FG) - 20, FY - 40, FX0 + 2.5 * (FW5 + FG) + 20, FY - 40, CYAN, seg(t, 1.6, 1.8), 10, 34);
  text("time →", 880, FY + FH5 + 50, 42, CREAM, "center", 800, 0.8 * seg(t, 0.2, 0.4));
  PL("what you saw", 560, 330, 56, CREAM, seg(t, 0.1, 0.3) * (1 - seg(t, 1.0, 1.15)), 900);
  PL("a gap, during the jump", 560, 330, 54, PINK, seg(t, 1.05, 1.2) * (1 - seg(t, 2.1, 2.25)), 900);
  PL("brain fills it with the clock", 560, 330, 54, CYAN, seg(t, 2.2, 2.35), 900);
  PL("as if you'd been looking all along", 665, 1112, 42, CREAM, seg(t, 2.6, 2.8), 900);
  MAS(T, t, [[0.3, "?"], [1.2, "!"], [2.1, "idea"]]);
};
// 5 — stretch: tick bars of one second each; the borrowed piece is added to the first tick (up to about half a second)
const BX = 120, BS = 520, RH = 130;
function bar(y, len, label, a, col = [120, 84, 200]) { if (a <= 0.01) return; rrect(BX, y - RH / 2, len, RH, 22, col, a); text(label, BX + 30, y, 46, CREAM, "left", 800, a); }
SCENES.stretch = (t, T, B, E, dur) => {
  vbg(); const rows = [520, 690, 860];
  const grow = eio((t - 1.3) / 0.7) * 0.5 * BS;
  // borrowed piece flies in from the gap (top right) and docks at the end of tick 1
  bar(rows[0], BS, "tick 1", seg(t, 0.1, 0.25)); bar(rows[1], BS, "tick 2", seg(t, 0.3, 0.45)); bar(rows[2], BS, "tick 3", seg(t, 0.5, 0.65));
  if (t > 1.0) { const u = eio((t - 1.0) / 0.8), x = lerp(1100, BX + BS + 6, u), y = rows[0], w = 0.5 * BS - 6;
    g.save(); g.globalAlpha = seg(t, 1.0, 1.15); g.fillStyle = css(PINK); g.beginPath(); g.roundRect(x, y - RH / 2, w, RH, 22); g.fill();
    g.strokeStyle = "rgba(255,255,255,0.35)"; g.lineWidth = 10; g.save(); g.beginPath(); g.roundRect(x, y - RH / 2, w, RH, 22); g.clip(); for (let k = -6; k < 14; k++) { g.beginPath(); g.moveTo(x + k * 40, y + RH); g.lineTo(x + k * 40 + 110, y - RH); g.stroke(); } g.restore();
    text("borrowed", x + w / 2, y, 40, [255, 255, 255], "center", 900, 1); g.restore(); }
  // brackets: real 1 s and felt up to 1.5 s
  const bA = seg(t, 2.9, 3.1); line(BX, rows[0] - 90, BX + BS, rows[0] - 90, CREAM, bA, 5); text("real: 1 s", BX + BS / 2, rows[0] - 120, 40, CREAM, "center", 800, bA);
  const fA = seg(t, 3.6, 3.8); line(BX, rows[2] + 100, BX + 1.5 * BS, rows[2] + 100, PINK, fA, 5); text("felt: up to 1.5 s", BX + 0.75 * BS + 120, rows[2] + 140, 44, PINK, "center", 900, fA);
  if (fA > 0.01) { line(BX + 1.5 * BS, rows[0], BX + 1.5 * BS, rows[2] + 100, PINK, fA * 0.6, 4, [12, 12]); }
  PL("that borrowed time…", 560, 330, 56, CREAM, seg(t, 0.15, 0.35) * (1 - seg(t, 2.4, 2.55)), 900);
  PL("…up to ½ second longer", 560, 330, 60, PINK, seg(t, 2.6, 2.8), 900);
  MAS(T, t, [[0.4, "?"], [1.8, "!"], [3.7, "!", "wince"]]);
};
// 6 — every: a gaze point hops around a desk scene about three times a second; a counter runs
const SPOTS = [[300, 560], [820, 520], [560, 860], [900, 1040], [420, 1180], [760, 760], [980, 620], [520, 600], [850, 1180], [640, 1000]];
SCENES.every = (t, T, B, E, dur) => {
  vbg();
  // desk scene: the clock, a phone, a mug, a window
  wallClock(820, 520, 150, secAt(T)); rrect(330, 470, 200, 170, 16, [120, 190, 240], 1, [200, 220, 255], 8); text("window", 430, 680, 36, CREAM, "center", 700, 0.7);
  rrect(800, 940, 160, 280, 26, [30, 20, 44], 1, [180, 160, 220], 8); rrect(818, 966, 124, 228, 14, [94, 230, 224], 0.5);
  rrect(380, 1080, 150, 150, 24, [255, 180, 80], 1); g.strokeStyle = "rgb(255,180,80)"; g.lineWidth = 22; g.beginPath(); g.arc(540, 1155, 44, -1.2, 1.2); g.stroke();
  rrect(470, 780, 220, 140, 20, [255, 95, 162], 0.85); text("book", 580, 850, 40, [255, 255, 255], "center", 900, 1);
  // gaze path
  const n = Math.min(SPOTS.length - 1, Math.floor(Math.max(0, t - 0.2) * 3)), u = clamp(((t - 0.2) * 3) % 1 / 0.25);
  for (let i = 1; i <= n; i++) line(SPOTS[i - 1][0], SPOTS[i - 1][1], SPOTS[i][0], SPOTS[i][1], CYAN, 0.35, 6);
  const p0 = SPOTS[Math.max(0, n - 1)], p1 = SPOTS[n], gp = t < 0.2 ? SPOTS[0] : [lerp(p0[0], p1[0], n ? u : 1), lerp(p0[1], p1[1], n ? u : 1)];
  g.save(); g.strokeStyle = css(CYAN); g.lineWidth = 12; g.beginPath(); g.arc(gp[0], gp[1], 54, 0, TAU2); g.stroke(); g.restore(); dot(gp[0], gp[1], 12, CYAN, 1);
  plate("eye jumps: " + (n + 1), 560, 330, 60, CYAN, 1, 900);
  PL("about 3 every second", 640, 1290, 48, CREAM, seg(t, 1.0, 1.2), 900);
  MAS(T, t, [[0.4, "!"], [1.8, "idea"]]);
};
// end: the hook picture again with the question; the last 0.5 s are frame one exactly (loop)
SCENES.end = (t, T, B, E, dur) => {
  if (t > dur - 0.5) { vbg(); targetDot(DX, DY, 0, 1); wallClock(CX, CY, CR, 0); MAS(T, t, [[dur - 0.45, "?"]]); return; }
  vbg(); targetDot(DX, DY, t, 0.5); wallClock(CX, CY, CR, secAt(T));
  PL("yes or no?", 640, 1245, 52, CYAN, seg(t, 0.4, 0.6), 900);
  MAS(T, t, [[0.3, "?", "grin"], [1.6, "!"]]);
};
