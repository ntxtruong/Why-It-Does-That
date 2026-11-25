// Episode 54 (v5 Short, 1080×1920, "Why Is It Designed Like That?"): why plane windows have no corners.
// Facts (claims.md): de Havilland Comet 1, first jet airliner (BOAC service from 2 May 1952); in-flight breakups in
// 1954 (BOAC 781, 10 Jan; SAA 201, 8 Apr). The cabin is pressurised every flight, a load cycle for the skin; fatigue
// cracks started at the corner of a square cutout (the roof ADF window; rivet hole near the corner) where stress
// concentrates; the water-tank test burst after ~3,000 cycles; later airliners use rounded window openings
// (FAA Lessons Learned G-ALYP / G-ALYV; Comet inquiry report). Picture is a schematic, not to scale.
window.NOPUSH = ["hook", "stake", "pump", "corner", "crack", "fix", "end"];
window.NODIP = window.NOPUSH;
const D_BG1 = [20, 72, 84], D_BG2 = [8, 30, 36], ALU = [206, 214, 222], ALU2 = [170, 180, 192], RIV = [140, 150, 164];
const HOT = [255, 84, 64], WARM = [255, 170, 70], COOL = [110, 220, 235], SKY1 = [120, 186, 240], SKY2 = [214, 236, 252];
function dbg() { const gr = g.createRadialGradient(W / 2, 820, 60, W / 2, 900, 1300); gr.addColorStop(0, css(D_BG1)); gr.addColorStop(1, css(D_BG2)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function cam(s, cx, cy, sx = W / 2, sy = 840) { g.setTransform(s, 0, 0, s, sx - cx * s, sy - cy * s); }
function camReset() { g.setTransform(1, 0, 0, 1, 0, 0); }
// rounded-rect path, half sizes a×b, corner radius rc
function rr(x, y, a, b, rc) { g.beginPath(); g.roundRect(x - a, y - b, 2 * a, 2 * b, Math.max(0.5, Math.min(rc, a, b))); }
// aluminium skin panel with rivet rows
function skin(x0, y0, w, h) {
  const gr = g.createLinearGradient(x0, y0, x0 + w, y0 + h); gr.addColorStop(0, css(ALU)); gr.addColorStop(1, css(ALU2));
  g.fillStyle = gr; g.fillRect(x0, y0, w, h);
  for (let yy = y0 + 40; yy < y0 + h; yy += 160) for (let xx = x0 + 30; xx < x0 + w; xx += 44) dot(xx, yy, 5, RIV, 0.9);
  for (let xx = x0 + 120; xx < x0 + w; xx += 300) for (let yy = y0 + 20; yy < y0 + h; yy += 44) dot(xx, yy, 5, RIV, 0.9);
}
// window: glass with sky and clouds inside a rounded rect
function windowGlass(x, y, a, b, rc, T) {
  g.save(); rr(x, y, a + 26, b + 26, rc + 26); g.fillStyle = "rgb(236,240,246)"; g.fill(); g.strokeStyle = "rgb(150,160,174)"; g.lineWidth = 6; g.stroke();
  rr(x, y, a, b, rc); g.clip();
  const gr = g.createLinearGradient(0, y - b, 0, y + b); gr.addColorStop(0, css(SKY1)); gr.addColorStop(1, css(SKY2)); g.fillStyle = gr; g.fillRect(x - a, y - b, 2 * a, 2 * b);
  for (let i = 0; i < 5; i++) { const cx = x - a + ((hash(i, 2) * 2 * a + T * 60 * (0.6 + hash(i, 3))) % (2 * a + 200)) - 100, cy = y - b * 0.4 + hash(i, 4) * b * 1.2;
    [[0, 0, 60], [50, 10, 46], [-50, 12, 42]].forEach(([dx, dy, r]) => dot(cx + dx, cy + dy, r * (0.8 + hash(i, 5)), [255, 255, 255], 0.9)); }
  g.restore();
}
// stress flow lines around a hole (half sizes a×b, corner rc): each line is displaced by the hole profile; lines bunch where the profile turns sharply
function holeProfile(x, a, b, rc) { const ax = Math.abs(x); if (ax < a - rc) return b; if (ax < a) return b - rc + Math.sqrt(Math.max(0, rc * rc - (ax - (a - rc)) ** 2)); return 0; }
function flowLines(x, y, a, b, rc, L, alpha, col = [16, 96, 116]) {
  if (alpha <= 0.01) return; g.save(); g.lineWidth = 4; g.lineCap = "round";
  for (let k = -9; k <= 9; k++) { if (k === 0) continue; const y0 = k * 34, sgn = Math.sign(y0);
    g.beginPath(); for (let i = 0; i <= 120; i++) { const xx = -L + 2 * L * i / 120; let hp = 0; for (let j = -3; j <= 3; j++) hp += holeProfile(xx + j * 6, a, b, rc) / 7; const yy = sgn * (Math.abs(y0) + (hp + 10) * Math.exp(-Math.abs(y0) / 150));
      i ? g.lineTo(x + xx, y + yy) : g.moveTo(x + xx, y + yy); }
    g.strokeStyle = css(col, alpha * (0.55 + 0.45 * Math.exp(-Math.abs(y0) / 160))); g.stroke(); }
  g.restore();
}
function cornerHeat(x, y, a, b, rc, k, a0 = 1) { // k 0..1 load; sharp corners glow hot, round corners glow faintly all round
  const sharp = clamp(1 - rc / (0.7 * Math.min(a, b))); const r0 = 30 + 90 * k;
  if (sharp > 0.05) [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { const cx = x + sx * (a - rc * 0.3), cy = y + sy * (b - rc * 0.3); soft(cx, cy, r0 * (0.8 + sharp), HOT, a0 * k * sharp * 0.95); soft(cx, cy, r0 * 0.45, [255, 230, 160], a0 * k * sharp * 0.8); });
  const even = 1 - sharp; if (even > 0.05) { g.save(); g.globalAlpha = a0 * k * even * 0.55; g.strokeStyle = css(WARM); g.lineWidth = 18; g.shadowColor = css(WARM); g.shadowBlur = 30; rr(x, y, a + 18, b + 18, rc + 18); g.stroke(); g.restore(); }
}
function counter(label, v, x, y, a, col = [234, 246, 248]) { plate(label + " " + v, x, y, 54, col, "center", a, 900); }
const MAS = (T, t, ev, o = {}) => MASR(T, t, { x: 150, y: 1585, s: 0.6, ev, ...o });
const SCENES = {};
const WX = 560, WY = 820;
// 1 — hook: a big square window; the corners are marked and counted; it morphs round, the count drops to 0
SCENES.hook = (t, T, B, E, dur) => {
  dbg(); cam(lerp(1.05, 1.0, eio(t / dur)), WX, WY);
  skin(-700, -400, 2500, 2700);
  const m = eio((t - 1.6) / 1.4), a = 300, b = 360, rc = lerp(8, 290, m);
  windowGlass(WX, WY, a, b, rc, T);
  // corner markers while square
  const ca = 1 - seg(t, 1.8, 2.6);
  [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(([sx, sy], i) => { const k = spring(t, 0.15 + i * 0.3, 12, 0.5); if (k > 0.01) { g.save(); g.globalAlpha = ca; g.strokeStyle = css(HOT); g.lineWidth = 12; g.beginPath(); g.arc(WX + sx * (a + 26), WY + sy * (b + 26), 52 * k, 0, TAU2); g.stroke(); g.restore(); } });
  camReset();
  const n = t < 0.3 ? 1 : t < 0.6 ? 2 : t < 0.9 ? 3 : 4; counter("corners:", t > 2.4 ? "0" : String(n), 780, 1250, seg(t, 0.1, 0.3), t > 2.4 ? [110, 220, 235] : [255, 120, 100]);
  MAS(T, t, [[1.2, "?"], [2.6, "!"]]);
};
// Comet silhouette (schematic), facing right; split s 0..1 tears it apart behind the wing
function comet(x, y, sc, split, T) {
  g.save(); g.translate(x, y); g.scale(sc, sc);
  const body = (from, to) => { g.fillStyle = "rgb(236,240,246)"; g.beginPath(); g.roundRect(from, -38, to - from, 76, 38); g.fill(); g.fillStyle = "rgb(40,70,120)"; g.fillRect(from + 10, -6, to - from - 20, 10);
    for (let xx = from + 40; xx < to - 40; xx += 46) { g.fillStyle = "rgb(60,90,130)"; g.fillRect(xx, -26, 22, 20); } };
  // rear part (moves back and tilts when split)
  g.save(); g.translate(-60 * split, 40 * split * split); g.rotate(0.35 * split);
  body(-420, -20); g.fillStyle = "rgb(220,226,236)"; g.beginPath(); g.moveTo(-400, -30); g.lineTo(-450, -150); g.lineTo(-380, -150); g.lineTo(-330, -30); g.fill(); // fin
  g.beginPath(); g.moveTo(-380, 10); g.lineTo(-460, 60); g.lineTo(-420, 60); g.lineTo(-330, 20); g.fill(); // tailplane
  g.restore();
  // front part with wings
  g.save(); g.translate(40 * split, -20 * split); g.rotate(-0.15 * split);
  body(-20, 360); g.fillStyle = "rgb(236,240,246)"; g.beginPath(); g.ellipse(360, 0, 60, 38, 0, -Math.PI / 2, Math.PI / 2); g.fill();
  g.fillStyle = "rgb(40,60,90)"; g.beginPath(); g.ellipse(390, -14, 22, 12, 0, 0, TAU2); g.fill();
  g.fillStyle = "rgb(210,218,230)"; g.beginPath(); g.moveTo(80, 20); g.lineTo(-80, 190); g.lineTo(-10, 190); g.lineTo(200, 28); g.fill();
  g.restore();
  if (split > 0.01) { for (let i = 0; i < 14; i++) { const u = split, an = hash(i, 1) * TAU2, d = 60 + 220 * hash(i, 2); g.save(); g.globalAlpha = 1 - u * 0.6; g.translate(-30 + Math.cos(an) * d * u, Math.sin(an) * d * u + 80 * u * u); g.rotate(an + T * 3); g.fillStyle = "rgb(200,208,220)"; g.fillRect(-12, -6, 24, 12); g.restore(); } soft(-30, 0, 220 * split + 40, [255, 220, 160], 0.7 * (1 - split)); }
  g.restore();
}
SCENES.stake = (t, T, B, E, dur) => {
  // sky, the jet crossing; at ~2.6 s the cabin bursts behind the wing
  const gr = g.createLinearGradient(0, 300, 0, 1500); gr.addColorStop(0, "rgb(70,130,190)"); gr.addColorStop(1, "rgb(170,210,240)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 6; i++) { const cx = ((hash(i, 7) * 1400 - t * 120 * (0.5 + hash(i, 8))) % 1500 + 1500) % 1500 - 200, cy = 500 + hash(i, 9) * 800; [[0, 0, 80], [70, 14, 60], [-70, 18, 56]].forEach(([dx, dy, r]) => dot(cx + dx, cy + dy, r, [255, 255, 255], 0.85)); }
  const split = seg(t, 2.6, 3.6);
  comet(lerp(360, 600, eio(t / dur)), 820 + 20 * Math.sin(t * 1.3), 1.15, split, T);
  plate("1954 · de Havilland Comet", 540, 470, 58, [234, 246, 248], "center", seg(t, 0.2, 0.5), 900);
  plate("the first jet airliner", 540, 560, 48, [255, 212, 94], "center", seg(t, 0.9, 1.2) * (1 - seg(t, 2.4, 2.6)), 800);
  plate("broke up in midair, twice", 540, 560, 50, HOT, "center", seg(t, 2.7, 3.0), 900);
  MAS(T, t, [[0.8, "?"], [2.7, "!", "wince"]]);
};
// 3 — pump: the cabin cross-section inflates and deflates every flight; a flight counter runs
SCENES.pump = (t, T, B, E, dur) => {
  dbg(); const cx = 560, cy = 820;
  const ph = (t * 1.25) % 1, k = Math.sin(Math.PI * clamp(ph / 0.8)) ** 2, R = 360 * (1 + 0.06 * k);
  // outside air (thin) dots, inside air (dense) dots
  for (let i = 0; i < 60; i++) { const an = hash(i, 1) * TAU2, d = 420 + hash(i, 2) * 260; dot(cx + Math.cos(an) * d, cy + Math.sin(an) * d * 0.95, 6, [180, 220, 230], 0.5); }
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, TAU2); g.fillStyle = "rgb(36,96,110)"; g.fill(); g.lineWidth = 26; g.strokeStyle = css(ALU); g.stroke(); g.clip();
  for (let i = 0; i < 160; i++) { const an = hash(i, 4) * TAU2, d = Math.sqrt(hash(i, 5)) * (R - 30); dot(cx + Math.cos(an) * d + Math.sin(T * 3 + i) * 6, cy + Math.sin(an) * d + Math.cos(T * 3 + i) * 6, 7, [200, 240, 248], 0.75); }
  // floor and seats
  g.fillStyle = "rgb(24,64,74)"; g.fillRect(cx - R, cy + 120, 2 * R, R); for (let s = -2; s <= 2; s++) { g.fillStyle = "rgb(250,210,90)"; g.beginPath(); g.roundRect(cx + s * 120 - 36, cy + 30, 72, 90, 14); g.fill(); }
  g.restore();
  // outward arrows on every pump
  for (let i = 0; i < 8; i++) { const an = i * TAU2 / 8 + 0.2, r1 = R + 30, r2 = R + 30 + 90 * k; arrow(cx + Math.cos(an) * r1, cy + Math.sin(an) * r1, cx + Math.cos(an) * r2, cy + Math.sin(an) * r2, WARM, k, 9, 24); }
  const flights = Math.floor(1 + Math.pow(t / dur, 2.2) * 1200);
  counter("flight", flights.toLocaleString("en-US"), 560, 380, seg(t, 0.1, 0.3));
  plate(k > 0.5 ? "pumped up" : "let down", 560, 1290, 52, k > 0.5 ? WARM : COOL, "center", seg(t, 0.3, 0.6), 900);
  MAS(T, t, [[0.6, "idea"], [3.0, "!"]]);
};
// 4 — corner: flat skin with a square window; stress lines crowd at the corners, which glow with every pump
SCENES.corner = (t, T, B, E, dur) => {
  dbg(); const z = eio((t - 2.2) / 1.2); cam(lerp(1.0, 1.6, z), lerp(WX, WX + 236, z), lerp(WY, WY - 276, z), W / 2, 840);
  skin(-700, -400, 2500, 2700);
  const a = 210, b = 250, rc = 8; windowGlass(WX, WY, a, b, rc, T);
  const ph = (t * 1.25) % 1, k = Math.sin(Math.PI * clamp(ph / 0.8)) ** 2;
  flowLines(WX, WY, a + 26, b + 26, rc + 6, 520, seg(t, 0.2, 0.7));
  cornerHeat(WX, WY, a + 26, b + 26, rc, 0.4 + 0.6 * k, seg(t, 0.6, 1.0));
  camReset();
  plate("stretch flows around the hole", 560, 380, 50, COOL, "center", seg(t, 0.2, 0.5) * (1 - seg(t, 2.0, 2.3)), 900);
  plate("…and piles up at the corner", 560, 380, 54, HOT, "center", seg(t, 2.1, 2.4), 900);
  MAS(T, t, [[1.0, "?"], [2.4, "!", "wince"]]);
};
// 5 — crack: zoomed on the corner, a fatigue crack grows a little every flight, then the skin tears open
SCENES.crack = (t, T, B, E, dur) => {
  dbg(); const s = 1.6; cam(s, WX + 236, WY - 276, W / 2, 840);
  skin(-700, -400, 2500, 2700);
  const a = 210, b = 250, rc = 8; windowGlass(WX, WY, a, b, rc, T);
  const ph = (t * 1.6) % 1, k = Math.sin(Math.PI * clamp(ph / 0.8)) ** 2;
  cornerHeat(WX, WY, a + 26, b + 26, rc, 0.5 + 0.5 * k, 1);
  // crack: a zigzag from the corner outward, its length grows in steps (one step per flight cycle)
  const grow = Math.floor(t * 1.6) / (dur * 1.6), len = 30 + 300 * Math.pow(grow, 1.6), tear = seg(t, dur - 1.3, dur - 0.7);
  const x0 = WX + a + 26, y0 = WY - b - 26; g.save(); g.strokeStyle = "rgb(30,30,36)"; g.lineWidth = 7 + 30 * tear; g.lineJoin = "round"; g.beginPath(); g.moveTo(x0, y0);
  for (let i = 1; i <= 12; i++) { const u = i / 12 * len; g.lineTo(x0 + u * 0.8 + (i % 2 ? 9 : -9), y0 - u * 0.6 + (i % 3 ? -7 : 7)); } g.stroke(); g.restore();
  if (tear > 0.01) { soft(x0 + 120, y0 - 90, 300 * tear + 60, [255, 240, 200], 0.9 * (1 - tear * 0.4));  }
  camReset();
  counter("flight", Math.floor(1200 + t * 260).toLocaleString("en-US"), 540, 380, 1);
  plate("tiny crack, longer every flight", 560, 480, 48, [234, 246, 248], "center", seg(t, 0.4, 0.7) * (1 - tear), 900);
  plate("the cabin bursts", 560, 480, 56, HOT, "center", tear, 900);
  MAS(T, t, [[0.6, "?"], [dur - 1.1, "!", "wince"]]);
};
// 6 — fix: the same panel with a rounded window; the lines flow smoothly, the load spreads out
SCENES.fix = (t, T, B, E, dur) => {
  dbg(); cam(lerp(1.15, 1.0, eout(t / 0.8)), WX, WY);
  skin(-700, -400, 2500, 2700);
  const m = eio(t / 0.9), a = 210, b = 250, rc = lerp(8, 200, m); windowGlass(WX, WY, a, b, rc, T);
  const ph = (t * 1.25) % 1, k = Math.sin(Math.PI * clamp(ph / 0.8)) ** 2;
  flowLines(WX, WY, a + 26, b + 26, rc + 6, 520, seg(t, 0.3, 0.8));
  cornerHeat(WX, WY, a + 26, b + 26, rc, 0.35 + 0.4 * k, 1);
  camReset();
  plate("round corners: stress spreads out", 560, 380, 48, COOL, "center", seg(t, 0.9, 1.2) * (1 - seg(t, 2.3, 2.5)), 900);
  plate("on airliners ever since", 560, 380, 50, [234, 246, 248], "center", seg(t, 2.45, 2.7), 900);
  MAS(T, t, [[1.0, "idea"], [2.6, "ok", "smile"]]);
};
// end: the round window with clouds; the question; in the last 0.6 s the window goes square again (loops into frame one)
SCENES.end = (t, T, B, E, dur) => {
  dbg(); cam(1.0, WX, WY); skin(-700, -400, 2500, 2700);
  const back = eio((t - (dur - 0.7)) / 0.6), a = lerp(210, 300, eio(t / 0.6)), b = lerp(250, 360, eio(t / 0.6));
  windowGlass(WX, WY, a, b, lerp(200, 8, back), T); camReset();
  MAS(T, t, [[0.3, "?", "grin"]]);
};
