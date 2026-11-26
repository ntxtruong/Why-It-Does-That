// Episode 53 (v5 Short, 1080×1920, Kitchen Science): why one apple half goes brown.
// Facts (claims.md): cutting ruptures cells; polyphenol oxidase (PPO) and the fruit's phenolic compounds, kept apart in
// intact cells, meet; with oxygen PPO oxidises the phenols to o-quinones, which react/polymerise into brown pigments
// (melanins). Lemon juice: acid lowers pH below PPO's optimum (~6-7) and slows it; ascorbic acid (vitamin C) reduces
// o-quinones back to phenols (Sci. Am.; Britannica; food-browning reviews).
// v5 look: warm kitchen palette, subject fills the frame, own camera moves and hard cuts (no push-in/dip from build.js).
window.NOPUSH = ["hook", "guess", "burst", "brown", "lemon", "end"];
window.NODIP = ["hook", "guess", "burst", "brown", "lemon", "end"];
const K_BG1 = [58, 30, 22], K_BG2 = [30, 15, 11], CREAM = [255, 244, 222], FLESH = [250, 236, 196], BROWN = [150, 88, 42], DBROWN = [104, 58, 26];
const RED = [214, 52, 52], RED2 = [150, 28, 34], GREEN = [96, 206, 120], GOLDK = [255, 200, 87], O2C = [130, 196, 255], ORANGE = [238, 132, 52];
function kbg(t) {
  const gr = g.createRadialGradient(W / 2, 820, 80, W / 2, 900, 1300);
  gr.addColorStop(0, css(K_BG1)); gr.addColorStop(1, css(K_BG2)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // cutting board under the apple
  g.save(); g.fillStyle = "rgb(176,122,74)"; g.beginPath(); g.roundRect(40, 1060, W - 80, 260, 40); g.fill();
  g.strokeStyle = "rgba(120,76,40,0.55)"; g.lineWidth = 4; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(80, 1095 + i * 32); g.bezierCurveTo(400, 1085 + i * 32 + 8 * Math.sin(i), 700, 1105 + i * 32, W - 80, 1092 + i * 32); g.stroke(); }
  g.restore();
}
// camera: scale s around world point (cx, cy) which lands at screen (sx, sy)
function cam(s, cx, cy, sx = W / 2, sy = 820) { g.setTransform(s, 0, 0, s, sx - cx * s, sy - cy * s); }
function camReset() { g.setTransform(1, 0, 0, 1, 0, 0); }

// one apple half, cut face up, centre (x, y), radius r. b = browning 0..1, wet = lemon gloss 0..1, side = -1 left / +1 right
function half(x, y, r, b, wet = 0, side = -1, seed = 1) {
  g.save();
  // skin rim (seen as a thick red ring) and a little shadow
  soft(x, y + r * 0.95, r * 1.1, [0, 0, 0], 0.35);
  g.fillStyle = css(RED2); g.beginPath(); g.ellipse(x, y + 10, r * 1.02, r * 1.0, 0, 0, TAU2); g.fill();
  g.fillStyle = css(RED); g.beginPath(); g.ellipse(x, y, r * 1.0, r * 0.97, 0, 0, TAU2); g.fill();
  // flesh
  g.beginPath(); g.ellipse(x, y, r * 0.9, r * 0.87, 0, 0, TAU2); g.closePath(); g.save(); g.clip();
  g.fillStyle = css(FLESH); g.fillRect(x - r, y - r, 2 * r, 2 * r);
  // browning: mottled patches that grow from the rim inward
  if (b > 0.01) {
    for (let i = 0; i < 46; i++) {
      const a = hash(i, seed) * TAU2, rr = r * (0.25 + 0.7 * Math.sqrt(hash(i, seed + 3))), px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr * 0.97;
      const edge = rr / r, k = clamp(b * 1.5 - (1 - edge) * 0.6 - hash(i, seed + 7) * 0.25);
      if (k > 0.01) soft(px, py, r * (0.22 + 0.25 * hash(i, seed + 5)), mix(BROWN, DBROWN, hash(i, 9)), 0.85 * k);
    }
    g.globalAlpha = 0.55 * b; g.fillStyle = css(BROWN); g.fillRect(x - r, y - r, 2 * r, 2 * r); g.globalAlpha = 1;
  }
  // core: star outline and seeds
  const cs = r * 0.3; g.strokeStyle = css(mix([226, 206, 160], DBROWN, b * 0.7)); g.lineWidth = 5;
  g.beginPath(); for (let i = 0; i <= 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? cs * 0.45 : cs; const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke();
  for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * TAU2 / 5, px = x + Math.cos(a) * cs * 0.62, py = y + Math.sin(a) * cs * 0.62; g.save(); g.translate(px, py); g.rotate(a + Math.PI / 2); g.fillStyle = "rgb(70,40,22)"; g.beginPath(); g.ellipse(0, 0, 9, 16, 0, 0, TAU2); g.fill(); g.restore(); }
  // lemon gloss: highlights
  if (wet > 0.01) { g.globalAlpha = 0.5 * wet; for (let i = 0; i < 9; i++) { const px = x + (hash(i, 21) - 0.5) * r * 1.3, py = y + (hash(i, 22) - 0.5) * r * 1.2; g.fillStyle = "rgba(255,255,240,0.9)"; g.beginPath(); g.ellipse(px, py, 16 + 14 * hash(i, 4), 7, -0.5, 0, TAU2); g.fill(); } g.globalAlpha = 1; }
  g.restore();
  // stem notch on the rim (outside the clip)
  g.fillStyle = "rgb(92,58,30)"; g.beginPath(); g.roundRect(x - 7, y - r * 1.02 - 22, 14, 34, 6); g.fill();
  g.restore();
}
// whole apple (two halves together), parting by p 0..1
function apple(cx, cy, r, p, bL, bR, wetR = 0) {
  const off = lerp(0, r * 1.08, p);
  if (p < 0.02) { // closed: skin seen from the side
    g.fillStyle = css(RED); g.beginPath(); g.ellipse(cx, cy, r * 1.05, r * 0.98, 0, 0, TAU2); g.fill();
    soft(cx - r * 0.35, cy - r * 0.35, r * 0.45, [255, 200, 200], 0.4);
    g.fillStyle = "rgb(92,58,30)"; g.beginPath(); g.roundRect(cx - 7, cy - r - 30, 14, 40, 6); g.fill();
    g.fillStyle = "rgb(110,180,90)"; g.beginPath(); g.ellipse(cx + 36, cy - r - 20, 36, 14, -0.4, 0, TAU2); g.fill();
    return;
  }
  half(cx - off, cy, r, bL, 0, -1, 1); half(cx + off, cy, r, bR, wetR, 1, 2);
}
function knife(x, y, a) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y);
  g.fillStyle = "rgb(214,222,236)"; g.beginPath(); g.moveTo(-14, -420); g.lineTo(14, -420); g.lineTo(14, 40); g.lineTo(-14, 80); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.8)"; g.lineWidth = 3; g.beginPath(); g.moveTo(-8, -410); g.lineTo(-8, 60); g.stroke();
  g.fillStyle = "rgb(40,30,28)"; g.beginPath(); g.roundRect(-24, -640, 48, 230, 18); g.fill(); g.restore(); }
function clockBadge(x, y, t, a, label) { if (a <= 0.01) return; g.save(); g.globalAlpha = a;
  g.fillStyle = "rgba(40,20,14,0.9)"; g.beginPath(); g.arc(x, y, 64, 0, TAU2); g.fill(); g.strokeStyle = css(CREAM); g.lineWidth = 6; g.beginPath(); g.arc(x, y, 50, 0, TAU2); g.stroke();
  const an = t * 6; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an) * 38, y + Math.sin(an) * 38); g.stroke(); g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(an / 12) * 24, y + Math.sin(an / 12) * 24); g.stroke();
  g.restore(); text(label, x, y + 98, 44, CREAM, "center", 800, a); }
const SAFE_MASCOT = (T, t, ev, o = {}) => MASR(T, t, { x: 150, y: 1585, s: 0.6, ev, ...o });

const SCENES = {};
const AX = W / 2, AY = 800, AR = 250;
// 1 — hook: the knife is already cutting; the halves part; timelapse: the left half browns, the right stays white
SCENES.hook = (t, T, B, E, dur) => {
  kbg(t);
  const cut = eio(t / 0.55), p = spring(t, 0.5, 9, 0.6);
  const bL = 0.9 * seg(t, 0.9, 3.6);
  const s = lerp(1.06, 1.0, eio(t / dur)); cam(s, AX, AY);
  apple(AX, AY, AR, clamp(p, 0, 1.08), bL, 0, 0);
  knife(AX, lerp(AY - 420, AY + 40, cut), 1 - seg(t, 0.55, 0.85));
  camReset();
  clockBadge(910, 470, t, seg(t, 0.9, 1.2), "10 min");
  SAFE_MASCOT(T, t, [[1.4, "?"], [3.3, "!", "wince"]]);
};
// 2 — guess: push in on the brown half; "rot?" gets crossed out; "the apple does it"
SCENES.guess = (t, T, B, E, dur) => {
  kbg(t);
  const s = lerp(1.0, 1.55, eio(t / 1.0)); cam(s, AX - AR * 1.08, AY, W / 2, 820);
  apple(AX, AY, AR, 1.08, 0.9, 0, 0); camReset();
  const a1 = seg(t, 0.25, 0.5); plate("mould? rot?", 540, 470, 66, CREAM, "center", a1 * (1 - seg(t, 2.0, 2.3)), 900);
  if (t > 0.9) { const u = eout((t - 0.9) / 0.25); line(370, 420, lerp(370, 710, u), lerp(420, 520, u), [255, 90, 80], (1 - seg(t, 2.0, 2.3)), 14); line(710, 420, lerp(710, 370, u), lerp(420, 520, u), [255, 90, 80], (1 - seg(t, 2.0, 2.3)), 14); }
  plate("the apple does it to itself", 540, 470, 56, GOLDK, "center", seg(t, 2.05, 2.35), 900);
  SAFE_MASCOT(T, t, [[1.0, "!"], [2.2, "?"]]);
};
// microscope view: a big round lens filling the frame, plant cells as rounded hexagons
const LX = W / 2, LY = 860, LR = 470;
function lens(draw) {
  g.save(); g.fillStyle = "rgba(0,0,0,0.35)"; g.beginPath(); g.arc(LX, LY + 14, LR + 16, 0, TAU2); g.fill();
  g.beginPath(); g.arc(LX, LY, LR, 0, TAU2); g.clip(); g.fillStyle = "rgb(252,240,206)"; g.fillRect(LX - LR, LY - LR, 2 * LR, 2 * LR);
  draw(); g.restore();
  g.save(); g.strokeStyle = "rgb(60,40,32)"; g.lineWidth = 26; g.beginPath(); g.arc(LX, LY, LR, 0, TAU2); g.stroke(); g.strokeStyle = "rgba(255,244,222,0.5)"; g.lineWidth = 4; g.beginPath(); g.arc(LX, LY, LR - 16, 0, TAU2); g.stroke(); g.restore();
}
const CELLS = []; (function () { const sz = 118; for (let r = -5; r <= 5; r++) for (let c = -5; c <= 5; c++) { const x = LX + c * sz * 0.98 + (r % 2 ? sz * 0.49 : 0), y = LY + r * sz * 0.86; if (Math.hypot(x - LX, y - LY) < LR + 60) CELLS.push({ x, y, r: sz * 0.47, i: CELLS.length }); } })();
const CUTY = LY - 20; // the knife line across the lens
// burst(u) = how far a cell along the cut has burst (0 intact, 1 spilled)
function cellBurst(cell, tc) { const d = Math.abs(cell.y - CUTY); if (d > 150) return 0; const t0 = 0.15 + (cell.x - (LX - LR)) / (2 * LR) * 0.6 + d / 900; return eout((tc - t0) / 0.35); }
function drawCells(tc, opt = {}) {
  CELLS.forEach(c => {
    const bu = cellBurst(c, tc);
    g.save(); g.translate(c.x, c.y);
    // wall
    g.strokeStyle = "rgb(214,180,120)"; g.lineWidth = 6; g.fillStyle = "rgb(255,248,226)";
    g.beginPath(); for (let k = 0; k < 6; k++) { const a = Math.PI / 6 + k * Math.PI / 3, rr = c.r * (1 - 0.18 * bu * (k % 2)); const px = Math.cos(a) * rr, py = Math.sin(a) * rr; k ? g.lineTo(px, py) : g.moveTo(px, py); } g.closePath(); g.fill(); if (bu < 0.95) { g.globalAlpha = 1 - bu * 0.7; g.stroke(); g.globalAlpha = 1; }
    // inside an intact cell: polyphenols (gold) inside the vacuole, enzyme (green) in a separate sac
    const sep = 1 - bu;
    if (sep > 0.02) {
      g.globalAlpha = sep; g.strokeStyle = "rgba(200,160,80,0.7)"; g.lineWidth = 3; g.beginPath(); g.arc(-c.r * 0.12, 0, c.r * 0.45, 0, TAU2); g.stroke();
      for (let k = 0; k < 5; k++) dot(-c.r * 0.12 + Math.cos(k * 1.3 + c.i) * c.r * 0.25, Math.sin(k * 1.3 + c.i) * c.r * 0.25, 7, GOLDK, sep);
      g.strokeStyle = "rgba(80,160,90,0.7)"; g.beginPath(); g.ellipse(c.r * 0.5, c.r * 0.25, c.r * 0.2, c.r * 0.14, 0.5, 0, TAU2); g.stroke();
      dot(c.r * 0.5, c.r * 0.25, 8, GREEN, sep); g.globalAlpha = 1;
    }
    g.restore();
  });
}
// spilled molecules for the burst cells: positions are pure functions of time
function spill(tc, tBrown) {
  const out = [];
  CELLS.forEach(c => { const bu = cellBurst(c, tc); if (bu < 0.02) return;
    for (let k = 0; k < 4; k++) { const id = c.i * 10 + k, a = hash(id, 1) * TAU2, sp = 30 + 70 * hash(id, 2), w = 0.6 + hash(id, 3);
      const x = c.x + Math.cos(a) * sp * bu + Math.sin(tc * w + id) * 10, y = c.y + Math.sin(a) * sp * bu * 0.7 + Math.cos(tc * w * 0.8 + id) * 10;
      out.push({ x, y, kind: k === 3 ? "enz" : "phe", id, bu }); } });
  return out;
}
SCENES.burst = (t, T, B, E, dur) => {
  clear(K_BG2); vignette(0.4);
  const tc = t; const s = lerp(1.25, 1.0, eout(t / 0.5)); cam(s, LX, LY, LX, LY);
  lens(() => { drawCells(tc); spill(tc).forEach(m => dot(m.x, m.y, m.kind === "enz" ? 13 : 9, m.kind === "enz" ? GREEN : GOLDK, m.bu)); });
  // the knife edge sweeping along the cut
  const kx = lerp(LX - LR - 60, LX + LR + 60, eio((t - 0.1) / 0.9)); if (t < 1.2) { line(LX - LR, CUTY, kx, CUTY, [255, 255, 255], 0.9, 8); }
  camReset();
  plate("cut cells burst open", 540, 300, 60, CREAM, "center", seg(t, 0.2, 0.45) * (1 - seg(t, B(1) - 0.2, B(1))), 900);
  // labels at beat 1: enzyme (green) and polyphenols (gold)
  const la = seg(t, B(1) + 0.3, B(1) + 0.6);
  if (la > 0.01) { plate("enzyme (PPO)", 300, 300, 54, GREEN, "center", la, 900); plate("polyphenols", 790, 300, 54, GOLDK, "center", seg(t, B(1) + 1.2, B(1) + 1.5), 900);
    plate("kept apart until the cut", 620, 1270, 46, CREAM, "center", seg(t, B(1) + 2.2, B(1) + 2.5), 800); }
  SAFE_MASCOT(T, t, [[0.5, "!"], [B(1) + 1.0, "idea"]], { a: 1 });
};
SCENES.brown = (t, T, B, E, dur) => {
  clear(K_BG2); vignette(0.4);
  const tc = 3.6 + t * 0.3; cam(lerp(1.0, 1.12, eio(t / dur)), LX, CUTY, LX, LY);
  const ms = spill(10);
  lens(() => {
    drawCells(10);
    ms.forEach(m => {
      if (m.kind === "enz") { dot(m.x, m.y, 13, GREEN, 1); return; }
      // oxygen arrives, phenol turns to quinone (orange), quinones clump into brown pigment
      const tq = 0.8 + hash(m.id, 5) * 1.6, tb = 2.4 + hash(m.id, 6) * 1.8;
      const q = seg(t, tq, tq + 0.3), bp = seg(t, tb, tb + 0.6);
      const cx = lerp(m.x, LX + (hash(m.id, 8) - 0.5) * 600, bp * 0.5), cy = lerp(m.y, CUTY + (hash(m.id, 9) - 0.5) * 60, bp * 0.7);
      dot(cx, cy, lerp(9, 15, bp), mix(mix(GOLDK, ORANGE, q), DBROWN, bp), 1);
      if (q > 0.01 && q < 0.99) soft(cx, cy, 40, [255, 200, 120], 0.5 * Math.sin(q * Math.PI));
    });
    // oxygen molecules drifting in from the top (O=O pairs)
    for (let i = 0; i < 22; i++) { const x = LX - LR + hash(i, 31) * 2 * LR, y = lerp(LY - LR - 40, CUTY - 30 + hash(i, 33) * 80, eout((t - hash(i, 32) * 1.2) / 1.4)); const a = seg(t, 0.1, 0.5) * (1 - seg(t, 3.2, 3.8));
      dot(x - 9, y, 9, O2C, a); dot(x + 9, y, 9, O2C, a); }
  });
  camReset();
  plate("+ oxygen", 300, 300, 58, O2C, "center", seg(t, 0.2, 0.5), 900);
  plate("→ quinones", 760, 300, 58, ORANGE, "center", seg(t, 1.3, 1.6), 900);
  plate("→ brown pigment", 540, 1270, 60, [214, 150, 96], "center", seg(t, 2.9, 3.2), 900);
  SAFE_MASCOT(T, t, [[1.4, "!"], [3.0, "!", "wince"]]);
};
// lemon: back to the halves; lemon drips on the right half; then two causes side by side
function lemonWedge(x, y, sq, a = 1) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(-0.3 + 0.15 * sq);
  g.fillStyle = "rgb(250,214,40)"; g.beginPath(); g.arc(0, 0, 130, Math.PI, 0); g.closePath(); g.fill();
  g.fillStyle = "rgb(255,246,170)"; g.beginPath(); g.arc(0, 0, 112, Math.PI, 0); g.closePath(); g.fill();
  g.strokeStyle = "rgb(250,214,40)"; g.lineWidth = 6; for (let k = 1; k < 6; k++) { const an = Math.PI + k * Math.PI / 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(an) * 110, Math.sin(an) * 110); g.stroke(); }
  g.restore(); }
function phMeter(x, y, v, a) { // v: pH shown
  if (a <= 0.01) return; rrect(x - 70, y - 150, 140, 300, 30, [40, 20, 14], 0.92 * a, CREAM, 4);
  const u = clamp((7.5 - v) / 6); rrect(x - 26, y - 110, 52, 220, 20, [70, 40, 30], a);
  rrect(x - 26, y + 110 - 220 * u, 52, 220 * u, 20, mix([120, 200, 120], [250, 214, 40], u), a);
  text("pH " + v.toFixed(1), x, y + 185, 46, CREAM, "center", 900, a);
}
SCENES.lemon = (t, T, B, E, dur) => {
  kbg(t);
  const t2 = B(1), up = eio((t - t2 + 0.2) / 0.6);
  const s = lerp(1.0, 0.68, up), ay = lerp(AY, 520, up); cam(s, AX, AY, W / 2, ay);
  const wet = seg(t, 0.6, 1.6);
  apple(AX, AY, AR, 1.08, 0.95, 0.02, wet);
  // lemon wedge squeezing over the right half, drops falling
  const la = (1 - seg(t, t2 - 0.3, t2)) ;
  lemonWedge(AX + AR * 1.08, AY - AR - 160, Math.sin(t * 9) * seg(t, 0.2, 0.5), la);
  for (let i = 0; i < 6; i++) { const t0 = 0.3 + i * 0.22, u = (t - t0) / 0.5; if (u > 0 && u < 1) dot(AX + AR * 1.08 + (hash(i, 3) - 0.5) * 120, lerp(AY - AR - 120, AY - 40 + hash(i, 5) * 120, u * u), 12, [255, 240, 150], la); }
  camReset();
  plate("lemon juice", 790, 420, 58, [250, 214, 40], "center", seg(t, 0.3, 0.6) * (1 - seg(t, t2 - 0.2, t2)), 900);
  // two causes, side by side, after beat 1 starts
  const pa = seg(t, t2 + 0.2, t2 + 0.5);
  if (pa > 0.01) {
    rrect(50, 840, 470, 490, 34, [56, 28, 20], 0.95 * pa, CREAM, 4); rrect(560, 840, 470, 490, 34, [56, 28, 20], 0.95 * seg(t, t2 + 1.9, t2 + 2.2), CREAM, 4);
    text("ACID", 285, 895, 56, [250, 214, 40], "center", 900, pa);
    phMeter(170, 1080, lerp(6.5, 3.2, seg(t, t2 + 0.5, t2 + 1.4)), pa);
    // the enzyme: slows (its wobble calms and it dims)
    const slow = seg(t, t2 + 0.6, t2 + 1.6), ex = 390 + Math.sin(t * lerp(14, 2, slow)) * lerp(22, 4, slow);
    dot(ex, 1060, 34, GREEN, pa * lerp(1, 0.45, slow)); text(slow > 0.6 ? "slows" : "enzyme", 390, 1150, 46, GREEN, "center", 900, pa);
    const pb = seg(t, t2 + 1.9, t2 + 2.2);
    text("VITAMIN C", 795, 895, 56, [250, 214, 40], "center", 900, pb);
    const back = seg(t, t2 + 2.6, t2 + 3.4);
    dot(700, 1050, 30, mix(ORANGE, GOLDK, back), pb); text(back > 0.5 ? "phenol again" : "quinone", 795, 1150, 46, mix(ORANGE, GOLDK, back), "center", 900, pb);
    if (pb > 0.01) { g.save(); g.globalAlpha = pb; g.strokeStyle = css(GOLDK); g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.arc(860, 1050, 50, -0.3, -0.3 + 5.2 * back + 0.01); g.stroke(); g.restore(); }
    text("undoes step 1", 795, 1250, 44, CREAM, "center", 800, seg(t, t2 + 3.3, t2 + 3.6));
  }
  SAFE_MASCOT(T, t, [[0.6, "idea"]], { a: 1 - pa });
};
// end: the question; the halves close back into a whole apple (loops into frame one)
SCENES.end = (t, T, B, E, dur) => {
  kbg(t);
  const close = eio((t - (dur - 1.0)) / 0.8);
  cam(lerp(1.0, 1.06, close), AX, AY);
  apple(AX, AY, AR, 1.08 * (1 - close), 0.95, 0.02, 0.6 * (1 - close));
  camReset();
  SAFE_MASCOT(T, t, [[0.3, "?", "grin"]]);
};
