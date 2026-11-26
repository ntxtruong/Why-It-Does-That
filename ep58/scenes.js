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
const CX = 720, CY = 470, CR = 300, DX = 150, DY = 1600;   // round 3: eye jump ≈ 1,260 px (review 2: ≥ 1,000 px)
// big target dot (review 2026-11-26: >= 100 px, far corner, the brightest thing on screen)
function targetDot(x, y, t, a = 1) { if (a <= 0.01) return; const p = 0.5 + 0.5 * Math.sin(t * 6); soft(x, y, 170, PINK, 0.55 * a); dot(x, y, 64 + 8 * p, PINK, a); dot(x, y, 24, [255, 255, 255], a);
  g.save(); g.globalAlpha = a * (1 - (t * 1.2 % 1)); g.strokeStyle = css(PINK); g.lineWidth = 10; g.beginPath(); g.arc(x, y, 76 + 90 * (t * 1.2 % 1), 0, TAU2); g.stroke(); g.restore(); }
function handGlow(sec, a) { if (a <= 0.01) return; const an = TAU2 * sec / 60; g.save(); g.globalCompositeOperation = "lighter"; g.globalAlpha = a; g.strokeStyle = css(PINK, 0.5); g.lineWidth = 34; g.lineCap = "round";
  g.beginPath(); g.moveTo(CX, CY); g.lineTo(CX + Math.sin(an) * CR * 0.86, CY - Math.cos(an) * CR * 0.86); g.stroke(); g.restore(); }
function chip(s, x, y, size, a, col = [30, 12, 50], bg = [246, 240, 255]) { if (a <= 0.01) return; g.save(); g.font = `900 ${size}px ${FONT}`; const w = g.measureText(s).width, px = size * 0.45, h = size * 1.5;
  g.globalAlpha = a; g.fillStyle = css(bg); g.beginPath(); g.roundRect(x - w / 2 - px, y - h / 2, w + 2 * px, h, h * 0.3); g.fill(); g.restore(); text(s, x, y + size * 0.03, size, col, "center", 900, a); }
const PINKBG = [255, 214, 232], CYANBG = [200, 248, 244];
function clockPic(T, o = {}) { vbg(); targetDot(DX, DY, T, o.dot ?? 0.25); wallClock(CX, CY, CR, o.sec ?? secAt(T)); handGlow(o.sec ?? secAt(T), o.glow ?? 0); }
function hookPic(t, T) { clockPic(T, { dot: 1, glow: 0.6 }); }
const MASB = () => {};   // no mascot in ep58 (it sat on the dot)

const SCENES = {};
const BAND = 880;   // the one label slot, between the clock (bottom ≈ 794) and the strips below
function frame0Text(a) { chip("Stare at the dot.", 470, 1460, 64, a, [80, 10, 40], PINKBG); }
// 1 — hook: stare at the big dot (bottom left). On "Now" the title swaps to "Now: the clock!", an arrow points up, then the dot,
// arrow and title all fade out by 1.8 s: from 1.8 s to the next caption (4.86 s) only the second hand moves.
SCENES.hook = (t, T, B, E, dur) => {
  const out = 1 - seg(t, 1.45, 1.8);
  vbg(); targetDot(DX, DY, T, t < 1.3 ? 1 : out); wallClock(CX, CY, CR, secAt(T)); handGlow(secAt(T), 0.6 * (t < 1.3 ? 1 : out));
  frame0Text(1 - seg(t, 1.25, 1.35));
  chip("Now: the clock!", CX, BAND, 64, seg(t, 1.3, 1.4) * (1 - seg(t, 1.6, 1.8)), [10, 60, 60], CYANBG);
  const k = eout((t - 1.3) / 0.3); if (t > 1.3) arrow(DX + 50, DY - 70, lerp(DX + 50, CX - 160, k), lerp(DY - 70, CY + 280, k), CYAN, out, 16, 56);
};
// 2 — guess: "first tick felt longer?", then the 1-s tick ruler proves the video did not lag
SCENES.guess = (t, T, B, E, dur) => {
  vbg(); wallClock(CX, CY, CR, secAt(T)); targetDot(DX, DY, T, 0.2);
  chip("first tick felt longer?", CX - 120, BAND, 58, seg(t, 0.3, 0.45) * (1 - seg(t, 1.8, 1.95)), [80, 10, 40], PINKBG);
  chip("the video didn't lag", CX - 120, BAND, 60, seg(t, 2.0, 2.15), [10, 60, 60], CYANBG);
  for (let i = 0; i < 9; i++) { const on = seg(T, i + 0.98, i + 1.05); rrect(300 + i * 78, 990, 68, 40, 10, on > 0.5 ? CYAN : [90, 70, 130], seg(t, 0.35, 0.55)); }
  chip("every tick = 1.00 s", 640, 1090, 50, seg(t, 0.5, 0.7));
};
// 3 — blind (reveal): the eyes jump dot → clock again; first a smear, then OFF mid-jump
const JUMPS = [0.3, 1.5, 2.7];
SCENES.blind = (t, T, B, E, dur) => {
  let dotA = 0.2; JUMPS.forEach(s => { dotA = Math.max(dotA, win(t, s - 0.7, s + 0.05, 0.15)); });
  vbg(); targetDot(DX, DY, T, dotA); wallClock(CX, CY, CR, secAt(T));
  JUMPS.forEach((s, i) => { const u = (t - s) / 0.22; if (u < 0 || u > 1) return;
    if (i === 0) { g.save(); g.strokeStyle = "rgba(230,220,255,0.35)"; g.lineWidth = 200; g.lineCap = "round"; g.beginPath(); g.moveTo(DX, DY); g.lineTo(lerp(DX, CX, u), lerp(DY, CY, u)); g.stroke(); g.restore(); }
    else { g.fillStyle = "rgba(6,3,12,0.94)"; g.fillRect(0, 0, W, H); text("OFF", CX, CY, 170, PINK, "center", 900, 1); } });
  chip("eye jump = a blur", CX - 120, BAND, 58, seg(t, 0.35, 0.5) * (1 - seg(t, 1.3, 1.45)));
  chip("brain: vision OFF mid-jump", 540, BAND, 56, seg(t, 1.45, 1.6), [80, 10, 40], PINKBG);
};
// 4 — fill: dot | gap | clock strip under the clock; the clock segment slides back over the gap and the clock face flashes
SCENES.fill = (t, T, B, E, dur) => {
  const fl = t > 1.6 ? Math.exp(-(t - 1.6) * 1.4) : 0;
  vbg(); targetDot(DX, DY, T, 0.2); wallClock(CX, CY, CR, secAt(T)); handGlow(secAt(T), 0.4 * fl);
  if (fl > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; g.strokeStyle = css(CYAN, 0.9 * fl); g.lineWidth = 30; g.beginPath(); g.arc(CX, CY, CR + 40, 0, TAU2); g.stroke(); g.restore(); }
  const y = 970, h = 100, X0 = 300, wd = 170, wg = 190, wc = 320, fillK = eio((t - 1.4) / 0.6);
  g.save(); g.globalAlpha = seg(t, 0.1, 0.3); rrect(X0, y, wd, h, 16, PINK, 1); text("dot", X0 + wd / 2, y + h / 2, 48, [40, 10, 30], "center", 900, 1); g.restore();
  g.save(); g.globalAlpha = seg(t, 0.35, 0.55); rrect(X0 + wd + 8, y, wg, h, 16, [8, 4, 14], 1, PINK, 8); text("?", X0 + wd + 8 + wg / 2, y + h / 2, 68, PINK, "center", 900, 1 - fillK); g.restore();
  const cx0 = X0 + wd + wg + 16, cl = lerp(cx0, X0 + wd + 8, fillK);
  g.save(); g.globalAlpha = seg(t, 0.6, 0.8); rrect(cl, y, cx0 + wc - cl, h, 16, CREAM, 1, fillK > 0.02 ? CYAN : null, 8); text("clock", cx0 + wc / 2, y + h / 2, 48, [40, 26, 60], "center", 900, 1); g.restore();
  if (t > 1.4) arrow(cx0 + 60, y + h + 50, X0 + wd + 40, y + h + 50, CYAN, 1 - seg(t, 2.6, 2.9), 12, 40);
  text("time →", 900, y + h + 60, 50, CREAM, "center", 800, 0.85 * seg(t, 0.2, 0.4) * (1 - seg(t, 1.3, 1.4)));
  chip("the gap: you saw nothing", 540, BAND, 56, seg(t, 0.4, 0.55) * (1 - seg(t, 1.35, 1.5)), [80, 10, 40], PINKBG);
  chip("brain pastes the clock in", 540, BAND, 58, seg(t, 1.5, 1.65), [10, 60, 60], CYANBG);
  chip("as if you'd been looking all along", 620, 1235, 44, seg(t, 2.5, 2.7));
};
// 5 — stretch: REAL 1.0 s vs FELT rolling to 1.5 s, the borrowed piece flies into FELT, the hand glows
SCENES.stretch = (t, T, B, E, dur) => {
  const roll = eio((t - 2.8) / 0.9), felt = 1.0 + 0.5 * roll, gl = seg(t, 2.7, 3.0) * (0.6 + 0.4 * Math.sin(T * 6));
  vbg(); targetDot(DX, DY, T, 0.2); wallClock(CX, CY, CR, secAt(T)); handGlow(secAt(T), gl);
  const a1 = seg(t, 0.15, 0.35), a2 = seg(t, 0.5, 0.7);
  rrect(300, 960, 330, 180, 26, [40, 26, 70], a1, CREAM, 8); text("REAL", 465, 1005, 48, CREAM, "center", 900, a1); text("1.0 s", 465, 1085, 72, CREAM, "center", 900, a1);
  rrect(670, 960, 330, 180, 26, [70, 20, 50], a2, PINK, 8); text("FELT", 835, 1005, 48, PINK, "center", 900, a2); text(felt.toFixed(1) + " s", 835, 1085, 72, PINK, "center", 900, a2);
  if (t > 1.0 && t < 2.9) { const u = eio((t - 1.0) / 0.9); chip("+ borrowed", lerp(540, 835, u), lerp(BAND, 1180, u), 52, 1 - seg(t, 2.6, 2.9), [80, 10, 40], PINKBG); }
  chip("borrowed time → tick 1", 540, BAND, 56, seg(t, 0.15, 0.3) * (1 - seg(t, 0.95, 1.05)));
  chip("up to ½ second longer", 540, BAND, 62, seg(t, 2.65, 2.8), [80, 10, 40], PINKBG);
};
// 6 — every: the gaze ring hops round the clock (12, 3, 6, 9, the dot) about 3 times a second, with a counter
const SPOTS = [[CX, CY - CR * 0.68], [CX + CR * 0.68, CY], [CX, CY + CR * 0.68], [CX - CR * 0.68, CY], [DX, DY], [CX + CR * 0.5, CY - CR * 0.5], [CX, CY], [CX - CR * 0.5, CY + CR * 0.5], [CX + CR * 0.68, CY], [CX, CY - CR * 0.68]];
SCENES.every = (t, T, B, E, dur) => {
  vbg(); targetDot(DX, DY, T, 0.6); wallClock(CX, CY, CR, secAt(T));
  const n = Math.min(SPOTS.length - 1, Math.floor(Math.max(0, t - 0.2) * 3)), u = clamp(((t - 0.2) * 3) % 1 / 0.25);
  const p0 = SPOTS[Math.max(0, n - 1)], p1 = SPOTS[n], gp = t < 0.2 ? SPOTS[0] : [lerp(p0[0], p1[0], n ? u : 1), lerp(p0[1], p1[1], n ? u : 1)];
  for (let i = 1; i <= n; i++) line(SPOTS[i - 1][0], SPOTS[i - 1][1], SPOTS[i][0], SPOTS[i][1], CYAN, 0.35, 8);
  g.save(); g.strokeStyle = css(CYAN); g.lineWidth = 14; g.beginPath(); g.arc(gp[0], gp[1], 62, 0, TAU2); g.stroke(); g.restore(); dot(gp[0], gp[1], 14, CYAN, 1);
  chip("eye jumps: " + (n + 1), CX - 80, BAND, 64, 1, [10, 60, 60], CYANBG);
  chip("about 3 every second", 640, 1180, 52, seg(t, 1.0, 1.2));
};
// end: the question drawn on the canvas under the clock; the last 0.5 s are frame one exactly (loop)
SCENES.end = (t, T, B, E, dur) => {
  if (t > dur - 0.5) { vbg(); targetDot(DX, DY, 0, 1); wallClock(CX, CY, CR, 0); handGlow(0, 0.6); frame0Text(1); return; }
  vbg(); targetDot(DX, DY, T, 0.6); wallClock(CX, CY, CR, secAt(T)); handGlow(secAt(T), 0.6);
  chip("Did your clock freeze?", 540, BAND + 20, 72, seg(t, 0.05, 0.2), [30, 12, 50], [246, 240, 255]);
  chip("yes or no?", 540, BAND + 140, 60, seg(t, 0.4, 0.6), [10, 60, 60], CYANBG);
};
