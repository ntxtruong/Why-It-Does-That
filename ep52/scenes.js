// Episode 52 (Short v4, 1080×1920): the floating finger ("finger sausage").
// Facts (claims.md): with the eyes aimed far, near fingers fall on non-corresponding points of the two retinas
// (crossed disparity): the left eye's image of the fingers is shifted right, the right eye's shifted left.
// The brain overlays both views; where the left finger of one view overlaps the right finger of the other, a short
// "finger" with two tips appears (Bach; Myers fig. 5.22; Sharp 1928). Parts seen by one eye only look faint (rivalry).
// Simulation: two offscreen copies of the hands, shifted ±d/2; each drawn faint, their intersection drawn solid.
window.NOPUSH = ["end"];
const CX = 520, FY = 930, FR = 62, HS = 1.2;  // fingertip meeting point, finger half-thickness (unscaled), hand scale
const DMAX = 440, GAPMAX = 140;             // full double-image shift and the pulled-apart gap (px)
const SKIN = "rgb(250,222,200)", SKIN2 = "rgb(232,190,166)", OUTL = "rgb(150,96,80)", NAIL = "rgb(255,238,232)";
const mk = () => { const c = document.createElement("canvas"); c.width = W; c.height = H; return c; };
const cA = mk(), cB = mk(), cI = mk(), cS = mk(), bgS = mk(), bgB = mk();
const gA = cA.getContext("2d"), gB = cB.getContext("2d"), gI = cI.getContext("2d"), gS = cS.getContext("2d");

// ---- the far room (drawn once, sharp and blurred) ----
(function room() {
  const c = bgS.getContext("2d");
  const gr = c.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "rgb(34,50,100)"); gr.addColorStop(1, "rgb(18,28,62)");
  c.fillStyle = gr; c.fillRect(0, 0, W, H);
  // a big night window with a skyline
  const wx = 120, wy = 300, ww = 840, wh = 980;
  const sky = c.createLinearGradient(0, wy, 0, wy + wh); sky.addColorStop(0, "rgb(52,78,150)"); sky.addColorStop(1, "rgb(96,108,170)");
  c.fillStyle = sky; c.fillRect(wx, wy, ww, wh);
  c.fillStyle = "rgb(236,240,250)"; c.beginPath(); c.arc(760, 470, 44, 0, TAU2); c.fill();                           // moon
  const bl = [[120, 160, 520], [270, 120, 380], [380, 200, 640], [570, 150, 460], [710, 110, 560], [810, 150, 420]];
  bl.forEach(([x, w, h], i) => { c.fillStyle = i % 2 ? "rgb(22,30,64)" : "rgb(30,40,80)"; c.fillRect(x, wy + wh - h, w, h);
    for (let r = 0; r < h / 60 - 1; r++) for (let q = 0; q < w / 46 - 1; q++) if (hash(i * 97 + r * 13 + q, 3) > 0.55) { c.fillStyle = hash(i + r, q) > 0.5 ? "rgb(255,214,120)" : "rgb(255,236,180)"; c.fillRect(x + 18 + q * 46, wy + wh - h + 30 + r * 60, 20, 28); } });
  c.strokeStyle = "rgb(200,208,228)"; c.lineWidth = 26; c.strokeRect(wx, wy, ww, wh);                               // frame
  c.lineWidth = 14; c.beginPath(); c.moveTo(wx + ww / 2, wy); c.lineTo(wx + ww / 2, wy + wh); c.stroke();
  // a shelf with a plant (lower left) and a lamp (lower right), far away
  c.fillStyle = "rgb(60,72,118)"; c.fillRect(0, 1380, W, 40);
  c.fillStyle = "rgb(90,170,120)"; [[160, 1290, 70], [210, 1250, 60], [120, 1260, 55]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r, 0, TAU2); c.fill(); });
  c.fillStyle = "rgb(200,120,90)"; c.fillRect(120, 1310, 110, 72);
  c.fillStyle = "rgb(255,220,140)"; c.beginPath(); c.moveTo(840, 1180); c.lineTo(960, 1180); c.lineTo(990, 1270); c.lineTo(810, 1270); c.closePath(); c.fill();
  c.fillStyle = "rgb(170,178,200)"; c.fillRect(893, 1270, 14, 110);
  const b = bgB.getContext("2d"); b.filter = "blur(26px)"; b.drawImage(bgS, 0, 0); b.filter = "none";
})();

// ---- one hand: the index finger points to +x, the tip at (0,0); mirrored for the right hand ----
function handPath(c, tipX, mirror) {
  c.save(); c.translate(tipX, FY); c.scale(mirror ? -HS : HS, HS);
  c.lineJoin = "round"; c.lineCap = "round";
  // forearm, down and out of frame
  c.fillStyle = SKIN2; c.beginPath(); c.moveTo(-560, 200); c.lineTo(-330, 230); c.lineTo(-420, 1150); c.lineTo(-760, 1150); c.closePath(); c.fill();
  // fist
  c.fillStyle = SKIN; c.strokeStyle = OUTL; c.lineWidth = 6;
  c.beginPath(); c.roundRect(-620, -90, 330, 360, 110); c.fill(); c.stroke();
  // curled fingers (three bumps under the index finger)
  for (let i = 0; i < 3; i++) { c.beginPath(); c.roundRect(-400, 70 + i * 66, 120, 70, 34); c.fill(); c.stroke(); }
  // thumb along the side, up toward the index finger
  c.beginPath(); c.roundRect(-470, 6, 170, 72, 36); c.fill(); c.stroke();
  // index finger
  c.beginPath(); c.roundRect(-430, -FR, 430, 2 * FR, FR); c.fill(); c.stroke();
  c.strokeStyle = "rgba(150,96,80,0.55)"; c.lineWidth = 5;
  [-150, -300].forEach(x => { c.beginPath(); c.moveTo(x, -FR + 22); c.quadraticCurveTo(x - 10, 0, x, FR - 22); c.stroke(); });
  c.fillStyle = NAIL; c.strokeStyle = "rgba(150,96,80,0.5)"; c.lineWidth = 4; c.beginPath(); c.roundRect(-92, -FR + 10, 78, 40, 18); c.fill(); c.stroke();
  c.restore();
}
// both hands into context c, fingertips `gap` apart, the whole picture shifted by dx
function hands(c, gap, dx) { c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, W, H); c.translate(dx, 0); handPath(c, CX - gap / 2, false); handPath(c, CX + gap / 2, true); c.setTransform(1, 0, 0, 1, 0, 0); }
function tint(c, col, a) { if (a <= 0.01) return; c.save(); c.globalCompositeOperation = "source-atop"; c.globalAlpha = a; c.fillStyle = col; c.fillRect(0, 0, W, H); c.restore(); }

// the view: bg focus f (0 blurred far room, 1 sharp), shift d, gap, finger blur (px),
// o.only = "A" / "B" (one eye's view), o.tA / o.tB tint, o.ghost alpha of single-eye parts, o.glow sausage outline
function view(f, d, gap, blur, o = {}) {
  g.drawImage(bgB, 0, 0); if (f > 0.01) { g.globalAlpha = f; g.drawImage(bgS, 0, 0); g.globalAlpha = 1; }
  g.fillStyle = "rgba(10,16,40,0.18)"; g.fillRect(0, 0, W, H);   // keep the room darker than the fingers
  const flt = blur > 0.3 ? `blur(${blur.toFixed(1)}px)` : "none";
  if (d < 0.5 && !o.only) { hands(gA, gap, 0); g.filter = flt; g.drawImage(cA, 0, 0); g.filter = "none"; return; }
  hands(gA, gap, d / 2); hands(gB, gap, -d / 2);
  tint(gA, "rgb(120,180,255)", o.tA || 0); tint(gB, "rgb(255,200,80)", o.tB || 0);
  g.filter = flt;
  if (o.only === "A") { g.drawImage(cA, 0, 0); g.filter = "none"; return; }
  if (o.only === "B") { g.drawImage(cB, 0, 0); g.filter = "none"; return; }
  const ga = o.ghost ?? 0.5;
  g.globalAlpha = ga; g.drawImage(cA, 0, 0); g.drawImage(cB, 0, 0); g.globalAlpha = 1;
  // seen by both eyes = solid
  gI.setTransform(1, 0, 0, 1, 0, 0); gI.globalCompositeOperation = "source-over"; gI.clearRect(0, 0, W, H); gI.drawImage(cA, 0, 0);
  gI.globalCompositeOperation = "destination-in"; gI.drawImage(cB, 0, 0); gI.globalCompositeOperation = "source-over";
  g.globalAlpha = o.solid ?? 1; g.drawImage(cI, 0, 0); g.globalAlpha = 1;
  g.filter = "none";
  if ((o.glow || 0) > 0.01) sausageGlow(d, gap, o.glow);
}
// the sausage: left finger of view A (tip at CX - gap/2 + d/2) over the right finger of view B (tip at CX + gap/2 - d/2)
function sausage(d, gap) { const x0 = CX + gap / 2 - d / 2, x1 = CX - gap / 2 + d / 2; return [x0, x1]; }
function sausageGlow(d, gap, a) {
  const [x0, x1] = sausage(d, gap); if (x1 - x0 < 10) return;
  g.save(); g.globalAlpha = a; g.strokeStyle = GOLD; g.lineWidth = 9; g.shadowColor = "rgba(255,212,94,0.9)"; g.shadowBlur = 26;
  const R = FR * HS; g.beginPath(); g.roundRect(x0 - 6, FY - R - 6, x1 - x0 + 12, 2 * R + 12, R + 6); g.stroke(); g.restore();
}
// label with an arrow down to a point
function callout(s, x, y, tx, ty, col, a, size = 50) { if (a <= 0.01) return; arrow(x, y + size * 0.85, tx, ty, col, a, 8, 26); plate(s, x, y, size, col, "center", a, 800); }

// a fixed dashed line through the middle of the frame: the reference the single-eye views are shifted from
function midline(a) { line(CX, 790, CX, 1120, INK, a * 0.85, 5, [14, 12]); text("middle", CX + 16, 1090, 40, INK, "left", 700, a); }
const SCENES = {};
// 1 — hook: the fingertips move in and touch over a blurred far room (the viewer looks at the fingers)
SCENES.hook = (t, T, B, E, dur) => {
  const gap = lerp(300, 0, eio(t / 1.5)) + (t > 1.5 ? 10 * Math.sin((t - 1.5) * 4.2) ** 2 : 0);
  view(0, 0, gap, 0);
  if (t > 1.45) { const u = t - 1.45; soft(CX, FY, 90 + 160 * u, [255, 240, 200], 0.5 * Math.max(0, 1 - u / 0.6)); }
};
// 2 — look past: the room comes into focus, the fingers blur and slide into two views
SCENES.look = (t, T, B, E, dur) => {
  const f = seg(t, 0.4, 1.8), d = DMAX * eio((t - 1.0) / 2.2), blur = 6 * seg(t, 0.4, 1.6);
  view(f, d, 0, blur, { ghost: 0.5 });
  // where to look: the moon, far away
  const a = win(t, 0.2, dur - 0.1, 0.35), p = 1 + 0.08 * Math.sin(t * 6);
  g.save(); g.globalAlpha = a; g.strokeStyle = GOLD; g.lineWidth = 8; g.beginPath(); g.arc(760, 470, 74 * p, 0, TAU2); g.stroke(); g.restore();
  plate("look far away", 520, 380, 56, GOLD, "center", a, 800);
};
// 3 — see it: the floating finger appears solid (reveal), then the tips pull apart and it floats
SCENES.see = (t, T, B, E, dur) => {
  const gap = GAPMAX * eio((t - B(1) - 0.3) / 1.4);
  const glow = seg(t, 0, 0.4) * (0.75 + 0.25 * Math.sin(t * 5));
  view(1, DMAX, gap, 6, { ghost: 0.42, glow });
  const [x0, x1] = sausage(DMAX, gap), mx = (x0 + x1) / 2;
  callout("floating finger", mx, 650, mx, FY - FR * HS - 20, GOLD, seg(t, 0.1, 0.5), 58);
  // "with two tips": a tick at each end of the floating finger
  const ta = win(t, E(0) - 0.8, B(1) + 0.4, 0.2);
  if (ta > 0.01) { [x0 + 10, x1 - 10].forEach(x => arrow(x, FY + 190, x, FY + FR * HS + 14, GOLD, ta, 8, 24)); plate("two tips", mx, FY + 230, 52, GOLD, "center", ta, 800); }
  // after the pull: the two gaps, marked
  const ga = seg(t, B(1) + 1.2, B(1) + 1.6);
  if (ga > 0.01) { [[x0 - gap / 2], [x1 + gap / 2]].forEach(([x]) => { line(x, FY - FR * HS - 6, x, FY + FR * HS + 6, BLUE, ga, 6, [10, 12]); }); plate("gaps on both sides", 520, 1120, 50, BLUE, "center", ga, 800); }
};
// 4 — why: a change at least every 2.5 s (H12). left eye view → right eye view → both laid over → the overlap.
SCENES.why = (t, T, B, E, dur) => {
  const gap = GAPMAX;
  const tR = 2.35, tBoth = B(1) - 0.1, tGlow = B(2) + 0.4;
  if (t < tR) {
    view(1, DMAX, gap, 0, { only: "A", tA: 0.25 }); midline(1);
    plate("LEFT eye sees", 520, 700, 58, BLUE, "center", seg(t, 0, 0.3), 900);
    const u = seg(t, 0.9, 1.2); arrow(380, 1190, 680, 1190, BLUE, u, 10, 30); plate("shifted right", 530, 1262, 46, BLUE, "center", u, 800);
  } else if (t < tBoth) {
    // the right eye's view slides in from where the left eye's was
    const s = eio((t - tR) / 0.6), dd = lerp(-DMAX, DMAX, s);
    view(1, dd, gap, 0, { only: "B", tB: 0.3 }); midline(1);
    plate("RIGHT eye sees", 520, 700, 58, GOLD, "center", 1, 900);
    if (t > tR + 0.7) { const u = seg(t, tR + 0.7, tR + 1.0); arrow(680, 1190, 380, 1190, GOLD, u, 10, 30); plate("shifted left", 530, 1262, 46, GOLD, "center", u, 800); }
  } else {
    const glow = seg(t, tGlow, tGlow + 0.4) * (0.75 + 0.25 * Math.sin(t * 5));
    const dB = lerp(DMAX * 2.2, DMAX, eio((t - tBoth) / 0.8));
    view(1, dB, gap, 0, { tA: 0.2, tB: 0.2, ghost: 0.5, glow });
    const a1 = seg(t, tBoth, tBoth + 0.3) * (1 - seg(t, tBoth + 1.8, tBoth + 2.0)), a2 = seg(t, tBoth + 1.9, tBoth + 2.1) * (1 - seg(t, tGlow - 0.3, tGlow));
    plate("LEFT + RIGHT views", 520, 700, 58, INK, "center", a1, 900);
    plate("laid on top", 520, 700, 58, INK, "center", a2, 900);
    const [x0, x1] = sausage(DMAX, gap), mx = (x0 + x1) / 2;
    callout("overlap = floating finger", 520, 650, mx, FY - FR * HS - 20, GOLD, seg(t, tGlow, tGlow + 0.3), 54);
    plate("seen by both eyes", 520, 1120, 48, INK, "center", seg(t, tGlow + 1.6, tGlow + 1.9), 800);
  }
  // inset: top view, two eyes aimed at the far moon, the fingertip near (first 4.6 s)
  const ia = win(t, 0.05, tBoth, 0.3);
  if (ia > 0.01) {
    g.save(); g.globalAlpha = ia;
    rrect(100, 200, 840, 430, 30, [16, 24, 54], 0.94, INK, 3);
    const E1 = [400, 570], E2 = [640, 570], far = [520, 250], tip = [520, 450];
    line(E1[0], E1[1], far[0], far[1], INK, ia, 4, [10, 10]); line(E2[0], E2[1], far[0], far[1], INK, ia, 4, [10, 10]);
    dot(far[0], far[1], 16, [236, 240, 250], ia);
    text("eyes aim far", 600, 262, 46, INK, "left", 800, ia);
    line(tip[0], tip[1], E1[0], E1[1], BLUE, ia * (t < tR ? 1 : 0.35), 8); line(tip[0], tip[1], E2[0], E2[1], GOLD, ia * (t >= tR ? 1 : 0.35), 8);
    dot(tip[0], tip[1], 24, [250, 222, 200], ia); text("fingers", 250, 450, 46, INK, "left", 800, ia);
    [E1, E2].forEach(([x, y], i) => { dot(x, y, 40, [244, 246, 251], ia); dot(x, y - 16, 18, i ? [255, 200, 80] : [120, 180, 255], ia); });
    g.restore();
  }
};
// 5 — end: look back at the fingers: the two views slide back into one, the room blurs, the tips open to frame one
SCENES.end = (t, T, B, E, dur) => {
  const m = eio((t - 0.3) / 1.5), d = DMAX * (1 - m), f = 1 - seg(t, 0.4, 1.6);
  const gap = lerp(GAPMAX, 300, eio((t - 2.0) / (dur - 2.0)));
  view(f, d, gap, 6 * (1 - m), { ghost: 0.5, solid: 1 });
  plate("gone", 520, 700, 72, GOLD, "center", win(t, 1.6, 3.1, 0.25), 900);
};
