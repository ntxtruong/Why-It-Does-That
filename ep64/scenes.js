// Episode 64 (v5 Short, 1080x1920, "Your Brain Is Tricking You", hook=try len=short look=boil, NO mascot):
// the ruler drop test. A ruler released from rest falls d = g t^2 / 2, so the mark where you pinch it is a clock:
// 5 cm = 0.10 s, 20 cm = 0.20 s, 30 cm = 0.25 s; 0.3 s = 44 cm, past the end of a 30 cm ruler (claims.md, factcheck.md).
//
// STORYBOARD (one stage: the ruler and both hands never leave the frame until "gone"; every step is a change ON it)
//  hook   0-3.8   ruler sways in the dropper's fingers, catcher's C open below; "Catch it!" + countdown 3-2-1 ring.
//                 Drop at 2.55 (just after "drops"), real g at the drawn scale, catch on the 20 mark at 2.75.   -> glow on 20
//  guess  3.8-8.2 push into the pinch; "muscles?" struck on "not slow"; the fingers flex (they are quick).      -> pull-back
//  reveal 8.2-10.3 the cm numbers flip like split-flap cards into seconds (8.4-9.05), flash + "seconds" on "clock". -> 0.20 card
//  why    10.3-15.5 ghost replay of the fall with a timer rolling 0.00 -> 0.20 s (lands on "fifth");
//                 a pulse runs eye -> brain -> fingers (13.3-14.7); the fingers flash.                          -> release
//  speed  15.5-20.3 the ruler rewinds up, then falls again in slow motion through the open fingers: gold stamps at
//                 0.1 / 0.2 s widen apart, dashed ghost to 44 cm = 0.3 s; the fingers snap shut on air on "gone".
//  end    20.3-23.4 "Centimetres?"; the ruler flies back up into the top hand; the last 0.5 s run into frame 0 (loop).
window.NOPUSH = ["hook", "guess", "reveal", "why", "speed", "end"];
window.NODIP = window.NOPUSH;

// palette: "Your Brain" violet, ink-blue variant (ep 61 was plum); yellow wood ruler is the brightest thing
const BGT = [52, 30, 112], BGB = [16, 10, 44], WOOD = [255, 208, 74], WOOD_D = [222, 160, 40], INKR = [44, 26, 22];
const SKINc = [244, 198, 166], SKIN_Dc = [216, 156, 124], LINE = [58, 24, 58], CYAN = [86, 232, 226], GOLDC = [255, 214, 80], PINK = [255, 92, 160];
const DARKV = [36, 14, 60], CREAMBG = [250, 244, 230], CYANBG = [204, 250, 246], GOLDBG = [255, 238, 170];
const PX = 34, YC = 1200, RX = 440, RW = 460, RL = 210, RR = 670;    // 34 px per cm; catcher's fingers on y = 1200
const TOP0 = YC - 30 * PX - 22;                                      // ruler top at rest (y 158)
const G = 9.81, DROP = 2.55, TC = Math.sqrt(2 * 0.20 / G), CATCH = DROP + TC;   // catch exactly on the 20 mark
const SLOW0 = 15.9, SLOW1 = 19.65;                                   // slow-motion replay: 0 -> 0.3 s of fall
const fallCm = tau => 50 * G * tau * tau;                            // cm fallen after tau seconds
const TSEC = { 5: "0.10 s", 10: "0.14 s", 15: "0.17 s", 20: "0.20 s", 25: "0.23 s", 30: "0.25 s" };

// ---- boil (look=boil, Animation rules item 8): outlines re-jitter 12 times a second; numbers and ticks stay put ----
const BF = T => Math.floor(T * 12);
function wob(pts, seed, T, amp = 2.6) { const f = BF(T); return pts.map(([x, y], j) => [x + amp * (hash(seed * 31 + j, f) - 0.5) * 2, y + amp * (hash(seed * 17 + j + 400, f) - 0.5) * 2]); }
function blob(pts, fill, stroke, lw = 8, a = 1) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.beginPath(); const n = pts.length;
  const mid = i => [(pts[i % n][0] + pts[(i + 1) % n][0]) / 2, (pts[i % n][1] + pts[(i + 1) % n][1]) / 2];
  let m = mid(n - 1); g.moveTo(m[0], m[1]);
  for (let i = 0; i < n; i++) { m = mid(i); g.quadraticCurveTo(pts[i][0], pts[i][1], m[0], m[1]); }
  g.closePath(); if (fill) { g.fillStyle = css(fill); g.fill(); } if (stroke) { g.strokeStyle = css(stroke); g.lineWidth = lw; g.lineJoin = "round"; g.stroke(); } g.restore();
}
function capsule(x1, y1, x2, y2, r, n = 20) {
  const an = Math.atan2(y2 - y1, x2 - x1), pts = [];
  for (let i = 0; i <= n / 2; i++) { const a = an - Math.PI / 2 + Math.PI * i / (n / 2); pts.push([x2 + r * Math.cos(a), y2 + r * Math.sin(a)]); }
  for (let i = 0; i <= n / 2; i++) { const a = an + Math.PI / 2 + Math.PI * i / (n / 2); pts.push([x1 + r * Math.cos(a), y1 + r * Math.sin(a)]); }
  return pts;
}
const ell = (cx, cy, rx, ry, n = 22) => Array.from({ length: n }, (_, i) => [cx + rx * Math.cos(TAU2 * i / n), cy + ry * Math.sin(TAU2 * i / n)]);
function rectPts(x0, y0, x1, y1, step = 46) {
  const pts = [], side = (ax, ay, bx, by) => { const n = Math.max(1, Math.round(Math.hypot(bx - ax, by - ay) / step)); for (let i = 0; i < n; i++) pts.push([lerp(ax, bx, i / n), lerp(ay, by, i / n)]); };
  side(x0, y0, x1, y0); side(x1, y0, x1, y1); side(x1, y1, x0, y1); side(x0, y1, x0, y0); return pts;
}
function bwline(x1, y1, x2, y2, col, T, seed, lw = 8, a = 1) {   // boiled straight line
  const p = wob([[x1, y1], [lerp(x1, x2, 0.5), lerp(y1, y2, 0.5)], [x2, y2]], seed, T, 2.4);
  poly(p, col, a, lw);
}

function bg64() {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, css(BGT)); gr.addColorStop(1, css(BGB)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  soft(470, 820, 780, [150, 90, 230], 0.42);
}
// camera [time, scale, cx, cy] through a Catmull-Rom curve (continuous velocity, ep 61 lesson)
const CAM = [[-2, 1.12, 520, 760], [-1, 1.12, 520, 760], [0, 1.12, 520, 760], [2.55, 1.12, 520, 772], [3.3, 1.2, 480, 1010], [4.9, 1.34, 460, 1110], [7.7, 1.4, 462, 1110],
  [8.6, 1.2, 470, 1380], [10.3, 1.2, 470, 1380], [12.4, 1.23, 470, 1360], [14.8, 1.24, 475, 1350], [15.6, 1.12, 520, 780], [17.5, 1.12, 520, 840], [19.6, 1.12, 520, 1080],
  [20.5, 1.1, 520, 1260], [21.5, 1.12, 520, 760], [22.7, 1.12, 520, 760], [30, 1.12, 520, 760], [31, 1.12, 520, 760]];
function camAt(T) {
  let i = 1; while (i < CAM.length - 2 && T >= CAM[i + 1][0]) i++;
  const p0 = CAM[i - 1], p1 = CAM[i], p2 = CAM[i + 1], p3 = CAM[i + 2], u = clamp((T - p1[0]) / (p2[0] - p1[0]));
  const cr = k => { const m1 = (p2[k] - p0[k]) / (p2[0] - p0[0]) * (p2[0] - p1[0]), m2 = (p3[k] - p1[k]) / (p3[0] - p1[0]) * (p2[0] - p1[0]);
    const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * p1[k] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[k] + (u3 - u2) * m2; };
  return [cr(1), cr(2), cr(3)];
}
function camSet(T) { const [s, cx, cy] = camAt(T); g.setTransform(s, 0, 0, s, 540 - cx * s, 900 - cy * s); }

// ---- state as pure functions of global time T ----
function rulerOff(T) {   // px the ruler has dropped below its rest position
  if (T < DROP) return 0;
  if (T < 15.2) { const u = T - DROP; if (u < TC) return fallCm(u) * PX; return 20 * PX; }
  if (T < SLOW0) return 20 * PX * (1 - eio((T - 15.25) / 0.5));
  if (T < 20.6) { const tau = T < SLOW1 ? 0.3 * (T - SLOW0) / (SLOW1 - SLOW0) : 0.3 + (T - SLOW1) * 0.04; return fallCm(tau) * PX; }
  return fallCm(0.3 + (20.6 - SLOW1) * 0.04) * PX * (1 - eout((T - 20.6) / 0.8));
}
const slowTau = T => clamp(0.3 * (T - SLOW0) / (SLOW1 - SLOW0), 0, 0.3);
function rulerRot(T) {   // radians, pivot = top pinch before the drop, catcher's fingers after the catch
  if (T < DROP) return 0.022 * Math.sin(T * 2.6 + 0.0) * (1 - seg(T, DROP - 0.3, DROP));
  if (T >= CATCH && T < 15.2) { const u = T - CATCH; return 0.075 * Math.exp(-u * 0.42) * Math.sin(u * 4.2) + 0.008 * Math.sin(T * 1.7); }
  return 0;
}
function catcherClose(T) {
  if (T < CATCH - 0.05) return 0.06 * (0.5 + 0.5 * Math.sin(T * 9));
  if (T < 15.2) { let c = seg(T, CATCH - 0.05, CATCH); c -= 0.45 * win(T, 7.0, 7.4, 0.18); c -= 0.25 * win(T, 14.65, 14.95, 0.12); return c; }
  if (T < 19.6) return 1 - seg(T, 15.2, 15.32);
  if (T < 21.0) return seg(T, 19.62, 19.7) * (1 - seg(T, 20.6, 21.0));    // snaps shut on air at "gone"
  return 0.06 * (0.5 + 0.5 * Math.sin(T * 9)) * seg(T, 22.0, 22.6);
}
function dropperOpen(T) {
  if (T < DROP) return 0;
  if (T < 15.6) return seg(T, DROP, DROP + 0.07);
  if (T < SLOW0) return 1 - seg(T, 15.62, 15.78);
  if (T < 21.2) return seg(T, SLOW0, SLOW0 + 0.1);
  return 1 - seg(T, 21.3, 21.45);
}
function flipK(T) {   // 0 = cm numbers, 1 = seconds; cards flip bottom to top
  return m => {
    const i = m / 5 - 1;
    if (T < 21.0) return seg(T, 8.4 + 0.13 * i, 8.4 + 0.13 * i + 0.16);
    return 1 - seg(T, 22.25 + 0.06 * i, 22.25 + 0.06 * i + 0.14);
  };
}

// ---- drawing ----
function rulerAt(T, off, rot, a = 1, ghost = false) {
  const y0 = YC + off, top = y0 - 30 * PX - 22, bot = y0 + 22;
  g.save(); g.globalAlpha = a;
  const piv = T < DROP ? [RX, TOP0 + 40] : [RX, YC]; g.translate(piv[0], piv[1]); g.rotate(rot); g.translate(-piv[0], -piv[1]);
  const body = wob(rectPts(RL, top, RR, bot), 5, T, ghost ? 0 : 2.4);
  if (ghost) { blob(body, null, [255, 240, 200], 8, 0.5); g.restore(); return; }
  blob(body, WOOD, LINE, 9);
  g.fillStyle = css(WOOD_D, 0.55); g.fillRect(RL + 8, top + 10, 20, bot - top - 20);   // wood edge shade
  const fk = flipK(T);
  for (let m = 0; m <= 30; m++) {
    const y = y0 - m * PX, L = m % 10 === 0 ? 120 : m % 5 === 0 ? 86 : 44;
    line(RL + 26, y, RL + 26 + L, y, INKR, 1, 8);
    if (m % 5 === 0 && m > 0) {
      const f = fk(m), sy = Math.abs(Math.cos(Math.PI * f)), sec = f > 0.5;
      g.save(); g.translate(RR - 14, y); g.scale(1, Math.max(0.04, sy));
      if (sec) { g.font = `900 56px ${FONT}`; const w = g.measureText(TSEC[m]).width; rrect(-w - 16, -36, w + 26, 72, 14, CYANBG, 1, DARKV, 4); text(TSEC[m], -6, 2, 56, DARKV, "right", 900); }
      else { const k20 = m === 20 ? 1 + 0.45 * (win(T, 5.75, 6.6, 0.2)) : 1; g.scale(k20, k20); text(String(m), -10, 2, 60, m === 20 && k20 > 1.01 ? [150, 60, 0] : INKR, "right", 900); }
      g.restore();
    }
  }
  g.restore();
}
// dashed ghost extension 30 -> 46 cm with the 0.3 s stamp at 44 cm (speed scene)
function ghostExt(T, off, a) {
  if (a <= 0.01) return; const y0 = YC + off, y30 = y0 - 30 * PX - 22, y46 = y0 - 46 * PX;
  g.save(); g.globalAlpha = a; g.setLineDash([26, 18]); g.strokeStyle = css([255, 236, 190]); g.lineWidth = 8;
  g.strokeRect(RL, y46, RW, y30 - y46); g.restore();
  const y44 = y0 - 44.1 * PX; line(RL + 10, y44, RR - 10, y44, GOLDC, a, 12);
  plate44(y44, a); chip("= 44 cm", RR + 150, y44 - 42, 56, a * seg(T, 18.3, 18.45), [70, 50, 0], GOLDBG);
}
function plate44(y, a) { g.save(); g.font = `900 52px ${FONT}`; const w = g.measureText("0.3 s").width; rrect(RX - w / 2 - 20, y - 40 - 36, w + 40, 64, 16, GOLDBG, a, DARKV, 4); g.restore(); text("0.3 s", RX, y - 42, 52, DARKV, "center", 900, a); }

function dropperHand(T, o) {
  // forearm from the top edge, palm above the ruler top; thumb and index pinch the top corners, spread when open
  const sw = T < DROP ? 30 * Math.sin(T * 2.6) * 0.3 : 0;
  blob(wob(capsule(470 + sw, -120, 455 + sw, 60, 92), 11, T), SKINc, LINE, 8);
  blob(wob(ell(445 + sw, 120, 138, 92), 12, T), SKINc, LINE, 8);
  const tx = lerp(332, 250, o), ty = lerp(208, 262, o), ix = lerp(560, 650, o), iy = lerp(208, 262, o);
  blob(wob(capsule(360 + sw, 150, tx + sw, ty, 36), 13, T), SKINc, LINE, 8);
  blob(wob(capsule(525 + sw, 150, ix + sw, iy, 34), 14, T), SKINc, LINE, 8);
}
function catcherBack(T, c) {   // thumb behind the ruler
  const ty = lerp(YC + 96, YC + 26, c), tx = lerp(392, 404, c);
  blob(wob(capsule(190, YC + 40, 300, ty + 10, 38), 21, T), SKIN_Dc, LINE, 8);
  blob(wob(capsule(300, ty + 10, tx, ty, 36), 22, T), SKIN_Dc, LINE, 8);
}
function catcherFront(T, c, flash = 0) {
  blob(wob(capsule(-160, YC + 170, 120, YC + 60, 100), 23, T), SKINc, LINE, 8);
  blob(wob(ell(170, YC + 20, 120, 112), 24, T), SKINc, LINE, 8);
  const iy = lerp(YC - 104, YC - 26, c), mid = lerp(YC - 118, YC - 48, c);
  blob(wob(capsule(230, YC - 50, 310, mid, 36), 25, T), SKINc, LINE, 8);
  blob(wob(capsule(310, mid, 384, iy, 33), 26, T), SKINc, LINE, 8);
  if (flash > 0.01) soft(370, YC, 190, CYAN, 0.7 * flash);
}
function glowRing(x, y, T, a) { if (a <= 0.01) return; const p = 0.5 + 0.5 * Math.sin(T * 7); soft(x, y, 150 + 30 * p, GOLDC, 0.5 * a); g.save(); g.globalAlpha = a; g.strokeStyle = css(GOLDC); g.lineWidth = 10; g.beginPath(); g.ellipse(x, y, 205 + 10 * p, 70 + 4 * p, 0, 0, TAU2); g.stroke(); g.restore(); }

// the whole world (under the camera) for time T
function stage(T, o = {}) {
  bg64(); camSet(T);
  const off = rulerOff(T), rot = rulerRot(T), c = catcherClose(T);
  catcherBack(T, c);
  if (o.ghostRuler) { g.save(); const tr = g.getTransform(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.rect(0, 215, W, H); g.clip(); g.setTransform(tr); rulerAt(T, o.ghostRuler, 0, 0.9, true); g.restore(); }
  if (T > DROP && T < CATCH) [0.03, 0.06, 0.09].forEach((d, i) => { const u = Math.max(0, T - DROP - d); rulerAt(T, Math.min(20 * PX, fallCm(u) * PX), 0, 0.22 - 0.06 * i); });   // motion smear
  if (o.speedLines > 0.01) { const v = o.speedLines, top = YC + off - 30 * PX - 22; for (let i = 0; i < 4; i++) bwline(RL + 40 + i * 70, top - 30 - 40 * (i % 2), RL + 40 + i * 70, top - 30 - 40 * (i % 2) - 220 * v, [255, 240, 210], T, 60 + i, 8, 0.75); }
  if (o.ext > 0.01) { g.save(); const tr = g.getTransform(); g.setTransform(1, 0, 0, 1, 0, 0); g.beginPath(); g.rect(0, 215, W, H); g.clip(); g.setTransform(tr); ghostExt(T, off, o.ext); g.restore(); }
  rulerAt(T, off, rot);
  if (o.band > 0.01) { const y0 = YC + off, h = 20 * PX * eout(o.band); g.save(); g.translate(RX, YC); g.rotate(rot); g.translate(-RX, -YC); rrect(RL + 8, YC, 200, h, 12, [255, 110, 60], 0.62 * (o.bandA ?? 1)); line(RL + 8, YC + h, RL + 208, YC + h, [200, 40, 40], o.bandA ?? 1, 14); g.restore(); }
  (o.stamps || []).forEach(([m, a]) => { const y = YC + off - m * PX; line(RL + 6, y, RL + 150, y, GOLDC, a, 14); });
  dropperHand(T, dropperOpen(T));
  catcherFront(T, c, o.fflash || 0);
  glowRing(RX + 60, YC, T, o.ring || 0);
  if (o.nodes > 0) pulsePath(T, o.path || 0, o.nodes, o.lab);
  g.setTransform(1, 0, 0, 1, 0, 0);
  if (o.timer != null) { const s = o.timer.toFixed(2) + " s", a = o.timerA ?? 1; g.save(); if (a <= 0.02) { g.restore(); } else { g.font = `900 72px ${FONT}`; const w = g.measureText("0.00 s").width; rrect(TX - w / 2 - 20, TY - 52, w + 40, 104, 24, CREAMBG, a * 0.95, DARKV, 8); g.restore(); text(s, TX, TY + 3, 72, DARKV, "center", 900, a); if (o.timerFlash) soft(TX, TY, 200, CYAN, 0.6 * o.timerFlash); } }
  g.setTransform(1, 0, 0, 1, 0, 0);
}
// eye -> brain -> fingers: the signal path (screen-fixed column on the right, ends at the pinch)
const PP = [[800, 1000], [800, 1150], [740, 1250], [560, 1262], [396, 1210]];
function pathPt(u) { const n = PP.length - 1, f = clamp(u) * n, i = Math.min(n - 1, Math.floor(f)), k = f - i; return [lerp(PP[i][0], PP[i + 1][0], k), lerp(PP[i][1], PP[i + 1][1], k)]; }
function pulsePath(T, u, nodes, lab) {
  // eye
  const ea = nodes, lit = (u0) => u >= u0 ? Math.exp(-(u - u0) * 6) : 0;
  const pts = []; for (let i = 0; i <= 40; i++) pts.push(pathPt(i / 40 * u));
  if (u > 0.001) { poly(pts, CYAN, 0.35, 30); poly(pts, CYAN, 1, 14); }
  soft(800, 1000, 120, CYAN, 0.8 * lit(0)); blob(wob(ell(800, 1000, 84, 50), 41, T), [250, 248, 240], LINE, 8, ea); dot(780, 1000, 32, [70, 120, 200], ea); dot(772, 1000, 15, [20, 14, 30], ea);
  // brain: a pink blob with a squiggle
  soft(800, 1150, 130, CYAN, 0.8 * lit(0.3)); blob(wob(ell(800, 1150, 88, 66), 42, T), [255, 170, 205], LINE, 8, ea); bwline(800, 1098, 800, 1202, LINE, T, 43, 8, ea * 0.6);
  if (u > 0.001) { const [hx, hy] = pathPt(u); soft(hx, hy, 80, CYAN, 0.9); dot(hx, hy, 20, [235, 255, 255]); }
  const la = lab || [0, 0, 0];
  chip("eye", 800, 915, 50, la[0], DARKV, CREAMBG); text("brain", 800, 1152, 46, DARKV, "center", 900, la[1]); chip("move!", 300, 1335, 50, la[2], [10, 70, 70], CYANBG);
}

// screen-space text (outside the camera)
function chip(s, x, y, size, a, fg, bgc, strike = 0) {
  if (a <= 0.01) return; g.save(); g.font = `900 ${size}px ${FONT}`; const w = g.measureText(s).width, px = size * 0.42, h = size * 1.42;
  const p = wob(rectPts(x - w / 2 - px, y - h / 2, x + w / 2 + px, y + h / 2, 60), 71 + s.length, BFt, 1.8);
  g.restore(); blob(p, bgc, DARKV, 8, a);
  text(s, x, y + size * 0.03, size, fg, "center", 900, a);
  if (strike > 0) line(x - w / 2 - 14, y, lerp(x - w / 2 - 14, x + w / 2 + 14, eout(strike)), y, [210, 20, 70], a, 14);
}
let BFt = 0;
const SLOT_X = 900, SLOT_Y = 330, TY = 1320, TX = 916;
function countdown(T, a) {   // "Catch it!" and a 3-2-1 ring; T can be negative in the loop tail
  if (a <= 0.01) return;
  chip("Catch it!", SLOT_X, SLOT_Y, 56, a, DARKV, CREAMBG);
  const n = T < 0.8 ? 3 : T < 1.6 ? 2 : 1, k = spring(Math.max(0, T), n === 3 ? -0.2 : n === 2 ? 0.8 : 1.6, 14, 0.5), u = T < 0 ? 0 : (T % 0.8) / 0.8;
  g.save(); g.globalAlpha = a; g.strokeStyle = css([255, 255, 255, 0.2]); g.lineWidth = 16; g.beginPath(); g.arc(SLOT_X, 620, 128, 0, TAU2); g.stroke();
  g.strokeStyle = css(GOLDC); g.lineCap = "round"; g.beginPath(); g.arc(SLOT_X, 620, 128, -Math.PI / 2, -Math.PI / 2 + TAU2 * (1 - u)); g.stroke(); g.restore();
  g.save(); g.translate(SLOT_X, 628); const s = lerp(1.4, 1, clamp(k)); g.scale(s, s); text(String(n), 0, 0, 190, GOLDC, "center", 900, a); g.restore();
}

const SCENES = {};
// 1 hook (0-3.8): countdown, drop just after "drops", catch on 20; only the ruler and hands move after "1"
SCENES.hook = (t, T) => {
  BFt = T; stage(T, { ring: seg(T, CATCH + 0.05, CATCH + 0.25), band: seg(T, 3.0, 4.3) });
  countdown(T, 1 - seg(T, DROP - 0.02, DROP + 0.1));
};
// 2 guess (3.8-8.2): push into the pinch; "slow hand?" in on "It's", struck on "not slow"; the fingers flex
SCENES.guess = (t, T) => {
  BFt = T; stage(T, { ring: 1 - 0.5 * seg(T, 7.8, 8.2), band: seg(T, 3.0, 4.3), bandA: 1 - seg(T, 8.0, 8.4) });
  chip("muscles?", 830, SLOT_Y, 70, seg(T, 5.95, 6.05) * (1 - seg(T, 8.1, 8.22)), DARKV, CREAMBG, seg(T, 6.72, 7.0));
};
// 3 reveal (8.2-10.3): the numbers flip into seconds (8.4-9.05); flash + "seconds" on "clock" (9.45)
SCENES.reveal = (t, T) => {
  BFt = T; const fl = T > 9.42 ? Math.exp(-(T - 9.42) * 2.4) : 0;
  stage(T, { ring: 0.5 * (1 - seg(T, 8.3, 8.6)), band: 1, bandA: 1 - seg(T, 8.0, 8.4) });
  if (fl > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; const y = lerp(150, 1500, eout((T - 9.42) / 0.5)); soft(470, y, 420, CYAN, 0.55 * fl); g.restore(); }
  chip("seconds", 918, 380, 58, seg(T, 9.42, 9.52), [10, 70, 70], CYANBG);
};
// 4 why (10.3-15.5): ghost replay with a timer to 0.20 s (lands on "fifth", 12.07), then the eye -> brain -> fingers pulse
SCENES.why = (t, T) => {
  BFt = T; const rp = clamp((T - 10.5) / (12.07 - 10.5)), tf = T > 12.07 ? Math.exp(-(T - 12.07) * 2.5) : 0;
  const pu = seg(T, 13.3, 14.7) * 0, u = T < 13.3 ? 0 : T < 13.95 ? 0.32 * (T - 13.3) / 0.65 : T < 14.7 ? 0.32 + 0.68 * (T - 13.95) / 0.75 : 1;
  const gr = T < 12.3 ? fallCm(TC * rp) * PX : 0;
  const la = (t0) => seg(T, t0, t0 + 0.1) * (1 - seg(T, 15.3, 15.45));
  stage(T, { ghostRuler: T > 10.5 && T < 12.3 ? Math.max(1, gr) : 0, timer: TC * rp > 0.2 ? 0.2 : TC * rp, timerA: seg(T, 10.4, 10.55) * (1 - seg(T, 13.0, 13.2)), timerFlash: tf,
    ring: win(T, 11.95, 13.3, 0.2), path: u, nodes: seg(T, 13.1, 13.35) * (1 - seg(T, 15.3, 15.5)), lab: [la(13.3), la(13.95), la(14.7)], fflash: T > 14.7 ? Math.exp(-(T - 14.7) * 3) : 0 });
  chip("seconds", 918, 380, 58, 1 - seg(T, 12.95, 13.1), [10, 70, 70], CYANBG);
};
function PINKBG() { return [255, 216, 234]; }
// 5 speed (15.5-20.3): rewind, then slow-motion fall through open fingers; stamps at 0.1 / 0.2 s; ghost to 44 cm = 0.3 s
SCENES.speed = (t, T) => {
  BFt = T; const tau = slowTau(T), fallen = T > SLOW0 && T < 21;
  const st = [[fallCm(0.1), seg(T, SLOW0 + 1.25, SLOW0 + 1.32)], [fallCm(0.2), seg(T, SLOW0 + 2.5, SLOW0 + 2.57)]];
  const v = T > SLOW0 && T < SLOW1 ? tau / 0.3 : 0;
  stage(T, { stamps: st, ext: seg(T, 17.4, 17.6), speedLines: v * seg(T, 16.1, 16.3), timer: fallen ? tau : 0, timerA: seg(T, SLOW0 - 0.06, SLOW0) * (1 - seg(T, 20.0, 20.12)),
    timerFlash: [SLOW0 + 1.25, SLOW0 + 2.5, SLOW1].reduce((s, t0) => s + (T > t0 ? Math.exp(-(T - t0) * 4) : 0), 0) });
};
// end (20.3-23.4): the question; the ruler flies back up into the top hand; the last 0.5 s run into frame 0
SCENES.end = (t, T, B, E, dur) => {
  BFt = T; const tail = T - TL.total;
  if (tail > -0.5) { BFt = tail; stage(tail); countdown(tail, 1); return; }
  stage(T, { ext: 1 - seg(T, 20.55, 20.7), stamps: [[fallCm(0.1), 1 - seg(T, 20.55, 20.7)], [fallCm(0.2), 1 - seg(T, 20.55, 20.7)]] });
  chip("Centimetres?", 540, 150, 100, seg(t, 0.1, 0.2) * (1 - seg(T, TL.total - 0.65, TL.total - 0.55)), DARKV, CREAMBG);
  countdown(-1, seg(T, TL.total - 0.6, TL.total - 0.5));
};
