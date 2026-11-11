// Episode 24 (new Short, 1080×1920) — Why do soda bubbles rise from the same spots?
// Physics (Liger-Belair 2002, 2003, 2005; Jones, Evans & Galvin 1999), drawn in closed form:
//  * bubble trains leave fixed sites at a fixed period; each bubble grows as it rises and speeds up
//    (buoyancy grows with size), so the spacing in a train widens upward: y = y0 − (v0·a + α·a³), r = r0 + k·a.
//  * a brand-new bubble smaller than the critical radius is squeezed back into the liquid by surface tension (Laplace pressure).
//  * a hollow cellulose fibre stuck to the glass holds a gas pocket; CO₂ diffuses in, the pocket grows to the tip,
//    a bubble pinches off, the pocket shrinks back, and the cycle repeats at a fixed period.
// Everything is a pure function of time (hash() for scatter). Shorts v2 layout: subject 380–1250 px,
// burned-in captions 1330–1500 right of the character, nothing important below 1536 or right of 940.

const COLA_T = [214, 128, 48], COLA_B = [142, 64, 24], FOAM = [240, 222, 190], WARMBG = [70, 42, 40];
const GLASS_T = 430, GLASS_B = 1235, HW_T = 300, HW_B = 235, CX = 540, LV = 520;
const WALLc = [214, 228, 244], FIBc = [214, 178, 124], FIBe = [118, 82, 46], LUMc = [168, 124, 80];

const hwAt = y => lerp(HW_B, HW_T, (GLASS_B - y) / (GLASS_B - GLASS_T));
// one bubble: translucent fill, bright rim, a highlight; edge colour for pale backgrounds
function bub(x, y, r, a = 1, edge = [255, 255, 255], fill = [255, 248, 236]) {
  if (a <= 0.01 || r < 0.8) return;
  g.save(); g.globalAlpha = a;
  g.fillStyle = css(fill, 0.32); g.beginPath(); g.arc(x, y, r, 0, TAU2); g.fill();
  g.strokeStyle = css(edge, 0.95); g.lineWidth = Math.max(2, r * 0.18); g.stroke();
  g.fillStyle = css(edge); g.beginPath(); g.arc(x - r * 0.38, y - r * 0.38, Math.max(1.2, r * 0.22), 0, TAU2); g.fill();
  g.restore();
}
// CO₂: one carbon dot between two oxygen dots
function co2(x, y, s, a, ang = 0, O = INKc, C = [40, 44, 60]) {
  if (a <= 0.01) return; const dx = Math.cos(ang) * 13 * s, dy = Math.sin(ang) * 13 * s;
  dot(x - dx, y - dy, 7.5 * s, O, a); dot(x + dx, y + dy, 7.5 * s, O, a); dot(x, y, 9 * s, C, a);
}

// a label on a solid (fully opaque) plate, for text over busy molecule fields
function splate(s, x, y, size, col, a, weight = 900) {
  if (a <= 0.01) return; g.save(); g.font = `${weight} ${size}px ${FONT}`; const w = g.measureText(s).width, px = size * 0.45, h = size * 1.5;
  g.globalAlpha = a; g.fillStyle = "#16224A"; g.strokeStyle = css(INKc, 0.55); g.lineWidth = 3; g.beginPath(); g.roundRect(x - w / 2 - px, y - h / 2, w + 2 * px, h, h * 0.3); g.fill(); g.stroke(); g.restore();
  text(s, x, y + size * 0.03, size, col, "center", weight, a);
}
// ---- the glass of cola (frame one) ----
const SITES = [
  { x: 335, y: 1110, P: 0.28, ph: 0.00 },
  { x: 592, y: 1206, P: 0.19, ph: 0.07 },
  { x: 762, y: 930, P: 0.36, ph: 0.11 },
];
function glass(a = 1) {
  if (a <= 0.01) return;
  const L = [[CX - HW_T, GLASS_T], [CX + HW_T, GLASS_T], [CX + HW_B, GLASS_B], [CX - HW_B, GLASS_B]];
  // soft warm light behind the glass (no glow on the glass itself)
  soft(CX, 840, 620, [120, 70, 60], 0.35 * a);
  // cola
  g.save(); g.globalAlpha = a;
  const gr = g.createLinearGradient(0, LV, 0, GLASS_B); gr.addColorStop(0, css(COLA_T)); gr.addColorStop(1, css(COLA_B));
  g.fillStyle = gr; g.beginPath(); g.moveTo(CX - hwAt(LV) + 10, LV); g.lineTo(CX + hwAt(LV) - 10, LV); g.lineTo(CX + HW_B - 10, GLASS_B - 12); g.lineTo(CX - HW_B + 10, GLASS_B - 12); g.closePath(); g.fill();
  // empty part of the glass above the drink
  g.fillStyle = "rgba(200,220,245,0.10)"; g.beginPath(); g.moveTo(CX - HW_T + 10, GLASS_T); g.lineTo(CX + HW_T - 10, GLASS_T); g.lineTo(CX + hwAt(LV) - 10, LV); g.lineTo(CX - hwAt(LV) + 10, LV); g.closePath(); g.fill();
  // thick glass base
  g.fillStyle = "rgba(210,228,248,0.35)"; g.beginPath(); g.moveTo(CX - HW_B, GLASS_B - 34); g.lineTo(CX + HW_B, GLASS_B - 34); g.lineTo(CX + HW_B, GLASS_B); g.lineTo(CX - HW_B, GLASS_B); g.closePath(); g.fill();
  g.restore();
  // foam line at the surface
  g.save(); g.globalAlpha = a; g.fillStyle = css(FOAM, 0.9); g.beginPath(); g.ellipse(CX, LV, hwAt(LV) - 10, 13, 0, 0, TAU2); g.fill(); g.restore();
  for (let i = 0; i < 26; i++) { const u = hash(i, 41), x = CX - hwAt(LV) + 26 + u * (2 * hwAt(LV) - 52); dot(x, LV + 6 + 6 * hash(i, 42), 3 + 4 * hash(i, 43), [255, 246, 228], 0.8 * a); }
  // glass walls and rim, with a vertical highlight
  poly(L, [222, 236, 252], 0.75 * a, 10, true);
  line(CX - HW_T + 40, GLASS_T + 40, CX - HW_B + 34, GLASS_B - 60, [255, 255, 255], 0.35 * a, 14);
  line(CX + HW_T - 60, GLASS_T + 60, CX + HW_B - 50, GLASS_B - 120, [255, 255, 255], 0.12 * a, 8);
  g.save(); g.globalAlpha = 0.8 * a; g.strokeStyle = "rgba(230,240,255,0.9)"; g.lineWidth = 6; g.beginPath(); g.ellipse(CX, GLASS_T, HW_T, 16, 0, 0, TAU2); g.stroke(); g.restore();
}
// bubble trains at time tau (any real tau; trains are periodic, so the last frame can equal the first)
function trains(tau, a = 1) {
  const v0 = 60, al = 40;
  SITES.forEach((s, k) => {
    dot(s.x, s.y, 5, [255, 246, 228], 0.9 * a);
    const j1 = Math.floor((tau - s.ph) / s.P), j0 = j1 - Math.ceil(3.2 / s.P);
    for (let j = j0; j <= j1; j++) {
      const age = tau - (s.ph + j * s.P); if (age < 0) continue;
      const y = s.y - (v0 * age + al * age * age * age); if (y < LV + 14) continue;
      const r = 5 + 7 * age, x = s.x + 5 * Math.sin(j * 1.7 + age * 3) * Math.min(1, age);
      bub(x, y, r, a * (1 - seg(y, LV + 40, LV + 14)));
    }
  });
}
// a gold ring on a start point
function ring(x, y, k, a) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.strokeStyle = GOLD; g.lineWidth = 6; g.beginPath(); g.arc(x, y, 28 * k, 0, TAU2); g.stroke(); g.restore(); }

// ---- a hollow fibre with its gas pocket (used in the hook's magnifier and in the fibre scene) ----
// base (x0,y0) on the glass, open tip (x1,y1); w = outer width; t = time; P = period; returns nothing, draws everything.
function fibre(x0, y0, x1, y1, w, t, P, a = 1, rise = 520, sc = 1) {
  if (a <= 0.01) return;
  const u = (((t / P) % 1) + 1) % 1, cyc = Math.floor(t / P);
  // pocket front along the lumen (0 = base, 1 = tip): grows, sits at the tip while the cap swells, shrinks back after pinch-off
  const front = u < 0.5 ? lerp(0.42, 1, ss(u / 0.5)) : u < 0.9 ? 1 : lerp(1, 0.42, ss((u - 0.9) / 0.1));
  const capR = u < 0.5 ? 0 : u < 0.9 ? w * 0.62 * Math.sqrt(ss((u - 0.5) / 0.4)) : w * 0.62 * (1 - ss((u - 0.9) / 0.04));
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len;
  g.save(); g.globalAlpha = a; g.lineCap = "round";
  g.strokeStyle = css(FIBe); g.lineWidth = w + 8; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  g.strokeStyle = css(FIBc); g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke();
  g.lineCap = "butt"; g.strokeStyle = css(LUMc); g.lineWidth = w * 0.5; g.beginPath(); g.moveTo(x0 + ux * w * 0.3, y0 + uy * w * 0.3); g.lineTo(x1 + ux * 4, y1 + uy * 4); g.stroke();
  // gas pocket inside the lumen
  const p0 = 0.08, px0 = x0 + dx * p0, py0 = y0 + dy * p0, px1 = x0 + dx * front, py1 = y0 + dy * front;
  g.lineCap = "round"; g.strokeStyle = "rgba(250,252,255,0.97)"; g.lineWidth = w * 0.4; g.beginPath(); g.moveTo(px0, py0); g.lineTo(px1, py1); g.stroke();
  g.restore();
  // the cap swelling out of the open tip, then the released bubbles rising (bigger and faster as they go)
  if (capR > 1) bub(x1 + ux * capR * 0.8, y1 + uy * capR * 0.8, capR, a, [70, 120, 190], [255, 255, 255]);
  for (let k = 0; k < 4; k++) {
    const td = (cyc - k) * P + 0.93 * P, age = t - td; if (age < 0) continue;
    const r0 = w * 0.62, sx = x1 + ux * r0 * 0.8, sy = y1 + uy * r0 * 0.8, h = (20 * age + 40 * age * age) * sc;
    if (h > rise) continue;
    bub(sx + 8 * Math.sin(age * 4 + k), sy - h, r0 * (1 + 0.25 * age), a * (1 - seg(h, rise - 60, rise)), [70, 120, 190], [255, 255, 255]);
  }
}

const SCENES = {};

// 1 — hook: frame one = a glass of cola with three bubble trains; rings mark the start points; a magnifier shows lint
SCENES.hook = (t, T, B, E, dur) => {
  clear(mix(BGc, WARMBG, 0.35)); vignette(0.25);
  glass(1); trains(T, 1);
  const s0 = SITES[0];
  SITES.forEach((s, i) => { const k = seg(t, 2.0 + 0.3 * i, 2.4 + 0.3 * i); ring(s.x, s.y, 0.6 + 0.4 * k + 0.06 * Math.sin(T * 4 + i), k); });
  // the magnifier over the left start point, joined to it by two lines
  const LX = 300, LY = 760, LR = 150, m = eout((t - (B(1) + 1.1)) / 0.45);
  if (m > 0.01) {
    const r = LR * m;
    line(s0.x - 22, s0.y - 12, LX - r * 0.9, LY + r * 0.42, GOLDc, m, 4);
    line(s0.x + 22, s0.y - 12, LX + r * 0.9, LY + r * 0.42, GOLDc, m, 4);
    g.save(); g.beginPath(); g.arc(LX, LY, r, 0, TAU2); g.clip();
    g.fillStyle = css(WALLc); g.fillRect(LX - r, LY - r, 2 * r, 2 * r);
    fibre(LX - 0.62 * r, LY + 0.62 * r, LX + 0.05 * r, LY + 0.05 * r, 0.30 * r, T, 0.9, 1, 1.2 * r, r / 150);
    g.restore();
    g.save(); g.strokeStyle = INK; g.lineWidth = 10; g.beginPath(); g.arc(LX, LY, r, 0, TAU2); g.stroke(); g.restore();
  }
  plate("lint", LX, LY - LR - 44, 54, GOLD, "center", seg(t, B(1) + 2.3, B(1) + 2.7), 900);
  MASR(T, t, { ev: [[0.4, "?"], [B(1) + 2.6, "!"]], look: [0.9, -0.8], mouth: "o" });
};

// 2 — gas: CO₂ packed into the drink under pressure; the cap comes off and the gas wants out — but a bubble won't start
const MOL = 64;
SCENES.gas = (t, T, B, E, dur) => {
  clear(mix(BGc, WARMBG, 0.35)); vignette(0.25);
  const X0 = 90, X1 = 990, Y0 = 520, Y1 = 1250, open = eout((t - B(1)) / 0.7);
  // the liquid inside a sealed bottle
  const gr = g.createLinearGradient(0, Y0, 0, Y1); gr.addColorStop(0, css(COLA_T)); gr.addColorStop(1, css(COLA_B));
  rrect(X0, Y0, X1 - X0, Y1 - Y0, 30, null, 1, [222, 236, 252], 8);
  g.save(); g.fillStyle = gr; g.beginPath(); g.roundRect(X0 + 6, Y0 + 6, X1 - X0 - 12, Y1 - Y0 - 12, 26); g.fill(); g.restore();
  // the cap: pressed down while sealed, lifted away on "open it"
  const capY = 470 - 260 * open, capA = 1 - seg(t, B(1) + 0.4, B(1) + 1.0);
  rrect(380, capY, 320, 60, 14, [196, 54, 50], capA, [242, 245, 251], 4);
  text("sealed", 540, capY + 31, 38, INK, "center", 900, capA * (1 - open));
  // pressure pushing the gas in: solid arrows onto the drink, labelled
  const pr = win(t, B(0) + 1.4, B(1) + 0.2, 0.35) * (1 - open);
  [200, 880].forEach(x => arrow(x, 400 + 10 * Math.sin(T * 6), x, 510 + 10 * Math.sin(T * 6), GOLDc, pr, 12, 30));
  splate("pressure", 540, 400, 48, GOLD, pr);
  // CO₂ molecules: packed, jiggling; after opening they drift up and the top ones leave
  const go = seg(t, B(1) + 0.3, dur);
  for (let i = 0; i < MOL; i++) {
    const bx = X0 + 50 + hash(i, 1) * (X1 - X0 - 100), by = Y0 + 50 + hash(i, 2) * (Y1 - Y0 - 100);
    const up = go * (120 + 260 * hash(i, 5)) * (1 + 0.6 * (1 - (by - Y0) / (Y1 - Y0)));
    const y = by - up + 6 * Math.sin(T * 5 + i * 2.1), x = bx + 6 * Math.cos(T * 4.3 + i * 1.3);
    const a = seg(t, 0.1 + 0.6 * hash(i, 3), 0.5 + 0.6 * hash(i, 3)) * (y < Y0 + 20 ? 1 - seg(Y0 + 20 - y, 0, 120) : 1);
    co2(x, Math.max(y, Y0 - 120), 1.25, a, T * 0.8 + i);
  }
  // legend
  splate("CO₂ = carbon dioxide", 640, 1180, 46, INK, win(t, 0.8, B(1) + 0.4, 0.3));
  // gas wants out
  const wo = win(t, B(1) + 0.6, dur - 0.2, 0.4);
  [300, 540, 780].forEach((x, i) => arrow(x, 760 - 40 * Math.sin(T * 3 + i), x, 600 - 40 * Math.sin(T * 3 + i), INKc, wo * 0.85, 9, 26));
  // but a bubble will not start: a tiny ring flickers and closes
  const hd = seg(t, B(1) + 2.3, B(1) + 2.7);
  const ph = ((t - (B(1) + 2.3)) % 1.1 + 1.1) % 1.1, rr = 22 * Math.sin(Math.PI * clamp(ph / 0.9));
  bub(540, 930, rr, hd);
  splate("a new bubble? hard", 660, 1080, 50, CORAL, hd);
  MASR(T, t, { ev: [[0.6, "!"], [B(1) + 2.5, "?", "wince"]], look: [0.9, -0.8], mouth: "o" });
};

// 3 — squeeze: below the critical size, surface tension pushes the gas back; a pocket that is already big enough grows
function attempt(cx, cy, t, t0, Rc, a) {
  // grows to 0.6·Rc, then is squeezed back to nothing
  const g1 = seg(t, t0, t0 + 1.0), sq = seg(t, t0 + 1.4, t0 + 2.6), r = 0.6 * Rc * eout(g1) * (1 - sq);
  bub(cx, cy, r, a);
  // its gas: six CO₂ inside, sent back out into the drink as it shrinks
  for (let i = 0; i < 6; i++) { const an = i / 6 * TAU2 + 0.4, d = lerp(r * 0.45, 170 + 60 * hash(i, 9), sq);
    co2(cx + d * Math.cos(an), cy + d * Math.sin(an), 1.1, a * seg(t, t0 + 0.3, t0 + 0.8), an); }
  const ar = win(t, t0 + 1.1, t0 + 2.7, 0.3);
  for (let i = 0; i < 8; i++) { const an = i / 8 * TAU2, r1 = Math.max(r, 10) + 90, r2 = Math.max(r, 10) + 22;
    arrow(cx + r1 * Math.cos(an), cy + r1 * Math.sin(an), cx + r2 * Math.cos(an), cy + r2 * Math.sin(an), INKc, a * ar, 7, 20); }
  return { sq, ar };
}
SCENES.squeeze = (t, T, B, E, dur) => {
  clear(mix(BGc, WARMBG, 0.35)); vignette(0.25);
  const X0 = 70, X1 = 1010, Y0 = 400, Y1 = 1250;
  const gr = g.createLinearGradient(0, Y0, 0, Y1); gr.addColorStop(0, css([222, 144, 66])); gr.addColorStop(1, css([168, 82, 32]));
  g.save(); g.fillStyle = gr; g.beginPath(); g.roundRect(X0, Y0, X1 - X0, Y1 - Y0, 34); g.fill(); g.restore();
  rrect(X0, Y0, X1 - X0, Y1 - Y0, 34, null, 1, [222, 236, 252], 6);
  // background CO₂, drifting slowly
  for (let i = 0; i < 26; i++) { const x = X0 + 60 + hash(i, 11) * (X1 - X0 - 120), y = Y0 + 60 + hash(i, 12) * (Y1 - Y0 - 120);
    co2(x + 10 * Math.sin(T * 1.3 + i), y + 10 * Math.cos(T * 1.1 + i * 0.7), 1.0, 0.75, T * 0.5 + i); }
  const Rc = 110, cx = 540, cy = 760;
  // critical size: a dashed gold circle
  const dsh = seg(t, 0.3, 0.8) * (1 - seg(t, B(1) + 1.2, B(1) + 1.8));
  g.save(); g.globalAlpha = dsh; g.strokeStyle = GOLD; g.lineWidth = 5; g.setLineDash([16, 12]); g.beginPath(); g.arc(cx, cy, Rc, 0, TAU2); g.stroke(); g.restore();
  plate("big enough to grow", cx, cy - Rc - 50, 40, GOLD, "center", dsh, 800);
  // two attempts during beat 0, each squeezed back
  const A1 = attempt(cx, cy, t, 0.6, Rc, 1 - seg(t, 3.3, 3.5)), A2 = attempt(cx, cy, t, 3.4, Rc, 1 - seg(t, B(1) - 0.1, B(1) + 0.2));
  splate("surface tension squeezes", 540, 470, 46, INK, win(t, 1.6, B(1) - 0.1, 0.3));
  splate("too small to grow", 600, 1180, 50, CORAL, win(t, 2.6, B(1) - 0.05, 0.35));
  // beat 1: a pocket that is already there, bigger than critical: gas flows in and it grows
  const hs = seg(t, B(1) + 0.2, B(1) + 0.8), gw = seg(t, B(1) + 0.8, dur), pr = lerp(Rc * 1.15, Rc * 1.65, gw);
  bub(cx, cy + 40 * (1 - hs), pr * hs, hs);
  for (let i = 0; i < 10; i++) { const an = i / 10 * TAU2 + 0.2, u = ((t * 0.6 + hash(i, 21)) % 1), d = lerp(pr + 150, pr + 10, u);
    co2(cx + d * Math.cos(an), cy + d * Math.sin(an), 1.1, hs * win(u, 0, 1, 0.2), an); }
  splate("pocket already there: grows", 610, 1190, 44, GOLD, seg(t, B(1) + 1.0, B(1) + 1.4) * (1 - seg(t, dur - 0.3, dur)));
  MASR(T, t, { ev: [[1.6, "!", "wince"], [4.4, "?"], [B(1) + 1.2, "idea", "smile"]], look: [0.9, -0.8], mouth: "o" });
};

// 4 — fibre: a hollow fibre (towel lint) stuck on the glass; its pocket fills, lets go of a bubble, again and again
SCENES.fibre = (t, T, B, E, dur) => {
  clear(mix(BGc, WARMBG, 0.35)); vignette(0.25);
  const X0 = 70, X1 = 1010, Y0 = 400, Y1 = 1250, P = 1.85;
  const gr = g.createLinearGradient(0, Y0, 0, Y1); gr.addColorStop(0, css([226, 236, 248])); gr.addColorStop(1, css([196, 212, 234]));
  g.save(); g.fillStyle = gr; g.beginPath(); g.roundRect(X0, Y0, X1 - X0, Y1 - Y0, 34); g.fill(); g.restore();
  // the glass wall (left) the fibre sticks to
  rrect(X0, Y0, 120, Y1 - Y0, 34, [244, 248, 253], 1);
  line(X0 + 120, Y0 + 20, X0 + 120, Y1 - 20, [150, 180, 215], 1, 6);
  text("glass", X0 + 60, Y1 - 50, 38, [60, 80, 120], "center", 900, 1);
  // CO₂ diffusing toward the tube from the drink
  const fx0 = 200, fy0 = 1150, fx1 = 620, fy1 = 790;
  for (let i = 0; i < 14; i++) { const u = ((t * 0.45 + hash(i, 31)) % 1), sx = 300 + hash(i, 32) * 600, sy = 560 + hash(i, 33) * 620;
    const tx = lerp(fx0, fx1, 0.3 + 0.6 * hash(i, 34)), ty = lerp(fy0, fy1, 0.3 + 0.6 * hash(i, 34));
    co2(lerp(sx, tx, ss(u)), lerp(sy, ty, ss(u)), 1.1, 0.9 * win(u, 0, 1, 0.15), i + T * 0.6, [255, 120, 104], [40, 44, 60]); }
  fibre(fx0, fy0, fx1, fy1, 92, t, P, 1, 310, 1.3);
  plate("towel lint: a hollow fibre", 560, 455, 46, INK, "center", seg(t, 0.2, 0.6), 900);
  // gas pocket callout
  const gp = win(t, B(0) + 1.2, B(1) + 0.3, 0.35);
  arrow(330, 1010, 360, 1050, [40, 50, 90], gp, 6, 20);
  plate("gas pocket", 300, 975, 42, INK, "center", gp, 900);
  // bubbles let go so far
  const n = Math.max(0, Math.floor((t - 0.93 * P) / P) + 1);
  const t1 = 0.93 * P, ca = seg(t, t1, t1 + 0.3), cs = 0.85 + 0.15 * eout((t - t1) / 0.3);
  g.save(); g.translate(800, 1150); g.scale(cs, cs); splate(`bubbles: ${n}`, 0, 0, 52, GOLD, ca); g.restore();
  MASR(T, t, { ev: [[B(0) + 0.4, "!", "grin"], [B(1) + 1.5, "idea"]], look: [0.9, -0.8], mouth: "o" });
};

// 5 — end: back to the glass; each train traced to a gold fibre; the last second is the opening frame (loop)
SCENES.end = (t, T, B, E, dur) => {
  // undo build.js's push-in over the last second so the final frame matches frame one exactly
  const k0 = 1 + 0.045 * eio(t / dur), kk = lerp(k0, 1, seg(t, dur - 1.6, dur - 0.2));
  g.setTransform(kk, 0, 0, kk, 540 * (1 - kk), 820 * (1 - kk));
  clear(mix(BGc, WARMBG, 0.35)); vignette(0.25);
  const tau = T - TL.total;   // trains are periodic: at the last frame tau ≈ 0, the same as frame one
  glass(1); trains(tau, 1);
  const off = 1 - seg(t, dur - 1.5, dur - 0.5);
  // "the gas comes from the drink": CO₂ drifting into the trains
  const gd = win(t, 0.2, 2.9, 0.4) * off;
  for (let i = 0; i < 12; i++) { const s = SITES[i % 3], u = ((t * 0.5 + hash(i, 51)) % 1), an = hash(i, 52) * TAU2, d = lerp(150, 12, ss(u));
    co2(s.x + d * Math.cos(an) * 0.8, s.y - 140 * hash(i, 53) + d * Math.sin(an) * 0.6, 1.0, gd * win(u, 0, 1, 0.2), an); }
  plate("gas: from the drink", 540, 470, 46, INK, "center", gd, 900);
  // "the starting points are bits of lint": a gold fibre at each site
  const lt = 2.6;
  SITES.forEach((s, i) => { const k = seg(t, lt + 0.25 * i, lt + 0.25 * i + 0.4) * off;
    ring(s.x, s.y, 1, k * 0.9);
    line(s.x - 20, s.y + 10, s.x + 4, s.y - 4, GOLDc, k, 9); line(s.x + 4, s.y - 4, s.x + 14, s.y - 20, GOLDc, k, 9); });
  plate("start: lint on the glass", 540, 470, 46, GOLD, "center", seg(t, lt, lt + 0.4) * off, 900);
  MASR(tau, t, { ev: [[lt + 1.2, "ok", "grin"]], look: [0.9, -0.8], mouth: t > dur - 1.5 ? "o" : "smile" });   // tau: bob and blink match frame one
};
