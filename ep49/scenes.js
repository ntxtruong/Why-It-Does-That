// Episode 49 (long, 1920×1080): why does salt melt ice?
// Facts (claims.md): at 0 °C ice and water trade molecules at equal rates (dynamic equilibrium). Dissolved Na+ and Cl−
// ions stay in the liquid (excluded from the ice) and crowd the water next to the surface, so fewer water molecules are
// captured per second while melting goes on at the same rate: net melting until the mix is cooled to the new, lower
// freezing point (textbook kinetic picture, Frostburg FAQ). Seawater (~3.5 %) freezes at ~−1.9 °C (NOAA); NaCl brine
// stays liquid down to ~−21.1 °C (eutectic, ~23 % salt). Melting absorbs heat, so with no heat supplied the mix cools
// itself. Rock salt: ~46 kg ice per kg salt at −1 °C, ~9 at −7 °C (Cargill), practical limit ~−9 °C (15 °F, MN PCA).
// Molecule sizes and rates are a sketch, not to scale.
const M = (T, t, ev, o = {}) => MASR(T, t, { x: 150, y: 880, s: 0.32, look: [0.7, -0.4], mouth: "o", ev, ...o });
const ICEc = [214, 236, 255], ICE2c = [150, 196, 240], THREADc = [255, 246, 228], SKINc = [240, 210, 190];
const NAc = [201, 182, 255], CLc = [142, 230, 181];      // Na+ lavender, Cl− mint (both ≥ 7:1 on navy)
// NaCl solution freezing point (°C) vs mass % salt (CRC-style table values; eutectic 23.3 % → −21.1 °C)
const FPD = [[0, 0], [5, -2.9], [10, -6.6], [15, -10.9], [20, -16.5], [23.3, -21.1]];

// ---------- molecular panel ----------
// Region: x PX0..PX1, y PY0..PY1. Ice (hex lattice) below the front, liquid above. All pure functions of T.
const PX0 = 560, PX1 = 1600, PY0 = 110, PY1 = 870, SP = 56, NC = 18, R = 17;
const colX = c => PX0 + 34 + c * SP;
const rowY = r => PY1 - 30 - r * SP * 0.87;            // r = 0 bottom row
function panelBox(a = 1) { rrect(PX0 - 14, PY0 - 14, PX1 - PX0 + 28, PY1 - PY0 + 28, 30, [16, 26, 58], a, INKc, 4); }
// o: { rows: ice rows (float, front height), melt: rate scale, freeze: rate scale (fraction of arrivals that stick),
//      ions: 0..1 how many ions are in, hl: highlight events 0..1, T }
function molPanel(T, o) {
  const a = o.a ?? 1; if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  panelBox();
  g.beginPath(); g.roundRect(PX0 - 10, PY0 - 10, PX1 - PX0 + 20, PY1 - PY0 + 20, 26); g.clip();
  const rows = o.rows ?? 6, full = Math.floor(rows), part = rows - full, front = rowY(full) + SP * 0.4;
  // liquid tint above the front, ice tint below
  g.fillStyle = "rgba(60,110,190,0.28)"; g.fillRect(PX0, PY0, PX1 - PX0, front - PY0);
  g.fillStyle = "rgba(190,225,255,0.16)"; g.fillRect(PX0, front, PX1 - PX0, PY1 - front);
  // ice lattice with bonds
  for (let r = 0; r < full; r++) for (let c = 0; c < NC; c++) {
    const x = colX(c) + (r % 2) * SP / 2, y = rowY(r);
    if (c < NC - 1) line(x, y, x + SP, y, ICE2c, 0.6, 3);
    if (r < full - 1) { line(x, y, x + SP / 2, rowY(r + 1), ICE2c, 0.6, 3); line(x, y, x - SP / 2, rowY(r + 1), ICE2c, 0.6, 3); }
    dot(x, y, R, ICEc, 1);
  }
  // surface row (r = full): each site cycles leave → empty → (join | bounce). Rates set the cycle.
  const mr = o.melt ?? 1, fr = o.freeze ?? 1, hl = o.hl ?? 0, r = full;
  let leaving = 0, joining = 0;
  for (let c = 0; c < NC; c++) {
    const x = colX(c) + (r % 2) * SP / 2, y = rowY(r);
    const P = 3.2 + hash(c, 1) * 1.6, ph = ((T * mr + hash(c, 2) * P) % P) / P;   // melt rate speeds the whole cycle
    const cyc = Math.floor((T * mr + hash(c, 2) * P) / P), blocked = fr < 1 && ((hash(c, 3) + cyc * 0.37) % 1) > fr;
    let mx = x, my = y, col = ICEc, show = true, ring = null;
    if (ph < 0.18) { const u = ss(ph / 0.18); mx = x + (hash(c, 4) - 0.5) * 60 * u; my = y - 170 * u; col = mix(ICEc, BLUEc, u); ring = CORALc; leaving++; }
    else if (ph < 0.5) show = false;
    else if (ph < 0.68) { const u = ss((ph - 0.5) / 0.18); if (blocked) { const b = u < 0.5 ? u * 2 : 2 - u * 2; mx = x + (hash(c, 5) - 0.5) * 60; my = y - 150 + 90 * b; col = BLUEc; } else { mx = x + (hash(c, 5) - 0.5) * 60 * (1 - u); my = y - 150 * (1 - u); col = mix(BLUEc, ICEc, u); ring = GOLDc; joining++; } }
    else if (blocked) show = false;
    if (show) { if (ring && hl > 0.01) soft(mx, my, 48, ring, 0.55 * hl); dot(mx, my, R, col, 1); if (ring && hl > 0.01) { g.save(); g.globalAlpha = a * hl; g.strokeStyle = css(ring); g.lineWidth = 5; g.beginPath(); g.arc(mx, my, R + 7, 0, TAU2); g.stroke(); g.restore(); } }
  }
  // liquid molecules wandering above the front
  for (let i = 0; i < 70; i++) {
    const bx = PX0 + 20 + hash(i, 11) * (PX1 - PX0 - 40), by = PY0 + 20 + hash(i, 12) * (front - PY0 - 90);
    const x = bx + Math.sin(T * (0.6 + hash(i, 13)) + hash(i, 14) * 6) * 26, y = by + Math.cos(T * (0.5 + hash(i, 15)) + hash(i, 16) * 6) * 20;
    dot(x, y, R, BLUEc, 0.85);
  }
  // ions: drift in from the top, then crowd the water next to the surface
  const ni = Math.round(16 * (o.ions ?? 0));
  for (let i = 0; i < ni; i++) {
    const na = i % 2 === 0, bx = PX0 + 40 + hash(i, 21) * (PX1 - PX0 - 80), target = front - 40 - hash(i, 22) * 160;
    const enter = clamp((o.ionsT ?? 9) - hash(i, 23) * 1.5), y0 = lerp(PY0 - 40, target, ss(enter));
    const x = bx + Math.sin(T * 0.9 + i) * 18, y = y0 + Math.cos(T * 0.8 + i * 2) * 10;
    dot(x, y, na ? 13 : 19, na ? NAc : CLc, 1);
    text(na ? "+" : "−", x, y + 1, na ? 22 : 30, "#18264F", "center", 900);
  }
  g.restore();
  return { front };
}
// rate bars on the left: "leave" (melting) and "join" (freezing) per second
function rateBars(x, y, melt, freeze, a = 1) {
  if (a <= 0.01) return;
  rrect(x - 20, y - 70, 440, 330, 26, PANELc, a * 0.92);
  text("molecules per second", x + 200, y - 30, 40, QUIET, "center", 700, a);
  [["leave ice", melt, CORAL, y + 50], ["join ice", freeze, GOLD, y + 160]].forEach(([s, v, c, yy]) => {
    text(s, x + 10, yy - 28, 42, c, "left", 800, a);
    rrect(x + 10, yy + 4, 380, 40, 14, [16, 26, 58], a);
    rrect(x + 10, yy + 4, 380 * clamp(v / 1.6), 40, 14, c, a);
  });
}
function thermo(x, y, val, lo = -5, a = 1, label = true) {
  // vertical thermometer, 0 °C mark, range lo..+3
  if (a <= 0.01) return;
  const hh = 360, top = y - hh, yOf = v => y - (v - lo) / (3 - lo) * hh;
  rrect(x - 24, top - 10, 48, hh + 20, 24, [242, 245, 251], a); dot(x, y + 30, 44, [242, 245, 251], a); dot(x, y + 30, 34, BLUEc, a);
  rrect(x - 13, yOf(val), 26, y - yOf(val) + 20, 2, BLUEc, a);
  line(x - 44, yOf(0), x + 44, yOf(0), INKc, a, 4); text("0", x + 56, yOf(0), 40, INK, "left", 800, a);
  if (typeof label === "string") text(val < -0.05 ? label : val > 0.05 ? "above 0 °C" : "0 °C", x, top - 54, 48, val < -0.05 ? BLUE : val > 0.05 ? CORAL : INK, "center", 900, a);
  else if (label) text((val < -0.05 ? "−" : "") + Math.abs(val).toFixed(Math.abs(val) < 9.95 && Math.abs(val % 1) > 0.05 ? 1 : 0) + " °C", x, top - 54, 48, val < -0.05 ? BLUE : INK, "center", 900, a);
}
// ---------- objects ----------
function room() {
  const gr = g.createRadialGradient(960, 540, 60, 960, 540, 1150);
  gr.addColorStop(0, "rgb(70,92,156)"); gr.addColorStop(1, "rgb(24,38,79)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
function cube(x, y, s = 1, rot = 0, a = 1) {   // y = bottom centre
  g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(rot); g.scale(s, s);
  const w = 300, h = 280, d = 70;
  g.fillStyle = css(ICE2c); g.beginPath(); g.moveTo(-w / 2, -h); g.lineTo(-w / 2 + d * 0.6, -h - d * 0.55); g.lineTo(w / 2 + d * 0.6, -h - d * 0.55); g.lineTo(w / 2, -h); g.closePath(); g.fill();
  g.fillStyle = "rgb(130,176,226)"; g.beginPath(); g.moveTo(w / 2, -h); g.lineTo(w / 2 + d * 0.6, -h - d * 0.55); g.lineTo(w / 2 + d * 0.6, -d * 0.55); g.lineTo(w / 2, 0); g.closePath(); g.fill();
  const gr = g.createLinearGradient(-w / 2, -h, w / 2, 0); gr.addColorStop(0, "rgb(236,246,255)"); gr.addColorStop(1, "rgb(176,212,246)");
  g.fillStyle = gr; g.beginPath(); g.roundRect(-w / 2, -h, w, h, 18); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 5; g.stroke();
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.roundRect(-w / 2 + 26, -h + 26, 38, h - 90, 19); g.fill();
  soft(10, -h * 0.5, 110, [255, 255, 255], 0.35);
  g.restore();
}
// a cube hanging from a thread held at (hx, hy); swing angle rot about the hand
function hanging(hx, hy, s, rot, a = 1, withHand = true) {
  g.save(); g.translate(hx, hy); g.rotate(rot);
  const top = 150 * s, cy = top + (280 + 38) * s;
  g.globalAlpha = a; g.strokeStyle = css(THREADc); g.lineWidth = 7 * s; g.lineJoin = "round";
  g.beginPath(); g.moveTo(0, 0); g.lineTo(-110 * s, top + 10 * s); g.lineTo(140 * s, top + 10 * s); g.closePath(); g.stroke();
  g.restore(); g.save(); g.translate(hx, hy); g.rotate(rot); cube(0, cy, s, 0, a);
  // the frozen-in thread across the top
  line(-110 * s, top + 8 * s, 140 * s, top + 8 * s, THREADc, a, 8 * s);
  g.globalAlpha = a; g.fillStyle = "rgba(236,248,255,0.8)"; g.strokeStyle = css(BLUEc); g.lineWidth = 4 * s;
  g.beginPath(); g.roundRect(-130 * s, top - 6 * s, 290 * s, 30 * s, 15 * s); g.fill(); g.stroke();
  g.restore();
  if (withHand) handTop(hx, hy, s, a);
}
function handTop(x, y, s = 1, a = 1) {
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
  g.fillStyle = css(SKINc); g.strokeStyle = INK; g.lineWidth = 6;
  g.beginPath(); g.roundRect(-50, -130, 100, 110, 38); g.fill(); g.stroke();
  g.beginPath(); g.roundRect(-20, -34, 26, 56, 13); g.fill(); g.stroke(); g.beginPath(); g.roundRect(8, -42, 26, 50, 13); g.fill(); g.stroke();
  g.restore();
}
function glass(x, y, w, h, water, a = 1) {   // y = bottom; water ∈ [0,1] fill
  g.save(); g.globalAlpha = a;
  g.fillStyle = "rgba(120,170,240,0.45)"; g.fillRect(x - w / 2 + 8, y - h * water, w - 16, h * water - 8);
  g.strokeStyle = "rgba(242,245,251,0.9)"; g.lineWidth = 6; g.beginPath(); g.moveTo(x - w / 2, y - h); g.lineTo(x - w / 2 + 10, y); g.lineTo(x + w / 2 - 10, y); g.lineTo(x + w / 2, y - h); g.stroke();
  g.restore();
}
function iceChunks(x, y, w, n, k, a = 1) { for (let i = 0; i < n; i++) { const cx = x - w / 2 + 30 + hash(i, 31) * (w - 60), cy = y - 40 - hash(i, 32) * 120, s = 40 * (0.7 + hash(i, 33) * 0.5) * k; g.save(); g.globalAlpha = a; g.translate(cx, cy); g.rotate(hash(i, 34) * 2); g.fillStyle = "rgba(225,240,255,0.92)"; g.beginPath(); g.roundRect(-s / 2, -s / 2, s, s, 8); g.fill(); g.restore(); } }
function saltGrains(x, y, w, n, a = 1) { for (let i = 0; i < n; i++) dot(x - w / 2 + hash(i, 41) * w, y + (hash(i, 42) - 0.5) * 16, 5, [255, 255, 255], a); }
function bag(x, y, shake, t, a = 1) {
  const dx = Math.sin(t * 12) * 26 * shake, dr = Math.sin(t * 12 + 1) * 0.08 * shake;
  g.save(); g.globalAlpha = a; g.translate(x + dx, y); g.rotate(dr);
  g.fillStyle = "rgba(200,225,255,0.35)"; g.strokeStyle = "rgba(242,245,251,0.95)"; g.lineWidth = 6;
  g.beginPath(); g.roundRect(-210, -260, 420, 380, 40); g.fill(); g.stroke();
  rrect(-210, -268, 420, 26, 10, [255, 138, 122], 1);
  iceChunks(0, 110, 380, 16, 1, 1); saltGrains(0, -60, 340, 40, 1);
  // small inner bag of ice cream mix
  g.fillStyle = "rgba(255,240,215,0.95)"; g.beginPath(); g.roundRect(-110, -170, 220, 170, 30); g.fill();
  text("cream", 0, -86, 40, "#7a5a3a", "center", 900);
  g.restore();
}
function road(t, salted, a = 1) {
  g.fillStyle = "rgb(58,66,92)"; g.beginPath(); g.moveTo(560, 1080); g.lineTo(880, 380); g.lineTo(1040, 380); g.lineTo(1500, 1080); g.fill();
  for (let i = 0; i < 6; i++) { const u = ((i / 6 + t * 0.05) % 1), y = lerp(400, 1080, u * u); line(960, y, 960, y + 40 * u * u + 6, [242, 245, 251], 0.8, 4 + 10 * u); }
  // ice patches (white) that melt where salted
  for (let i = 0; i < 9; i++) { const u = 0.15 + hash(i, 51) * 0.8, y = lerp(400, 1000, u), half = lerp(80, 470, (y - 380) / 700), x = 960 + (hash(i, 52) - 0.5) * half * 1.3, s = lerp(20, 90, u); g.save(); g.globalAlpha = 0.85 * (1 - salted * 0.85); g.fillStyle = "rgb(225,238,252)"; g.beginPath(); g.ellipse(x, y, s * 1.6, s * 0.35, 0, 0, TAU2); g.fill(); g.restore(); }
}
// cross-section of the cube top with the thread (from the Short): melt pocket, heat arrows, ions spread, refreeze
function threadSection(t, T, melt, refreeze, spread, heat, a = 1) {
  const X0 = 560, X1 = 1500, SURF = 560, TX = 1030, TR = 44;
  rrect(X0, SURF, X1 - X0, 330, 26, [206, 230, 252], a);
  for (let i = 0; i < 9; i++) line(X0 + 40 + i * 100, SURF + 30, X0 + 90 + i * 100, SURF + 300, [180, 210, 240], 0.5 * a, 4);
  const pocket = melt * (1 - refreeze), pr = 40 + 110 * pocket;
  if (pocket > 0.01) { g.save(); g.globalAlpha = a; g.fillStyle = "rgba(90,160,240,0.9)"; g.beginPath(); g.ellipse(TX, SURF, pr * 1.9, pr * 0.9, 0, 0, Math.PI); g.fill(); g.restore(); }
  const ty = SURF - TR + 4 + (TR + 18) * refreeze;
  if (refreeze > 0.01) {   // new ice: a bright band that closes round the thread
    g.save(); g.globalAlpha = a * refreeze; g.fillStyle = "rgb(240,250,255)"; g.strokeStyle = css(BLUEc); g.lineWidth = 8;
    g.beginPath(); g.ellipse(TX, SURF + 10, 230, 120, 0, Math.PI, TAU2); g.lineTo(TX + 230, SURF + 10); g.ellipse(TX, SURF + 10, 230, 110, 0, 0, Math.PI); g.closePath(); g.fill(); g.stroke(); g.restore();
  }
  dot(TX, ty, TR, THREADc, a); g.save(); g.globalAlpha = a; g.strokeStyle = "rgba(160,140,110,0.9)"; g.lineWidth = 6; g.beginPath(); g.arc(TX, ty, TR, 0, TAU2); g.stroke(); g.restore();
  if (refreeze > 0.01) { g.save(); g.globalAlpha = 0.45 * refreeze * a; g.fillStyle = "rgb(240,250,255)"; g.beginPath(); g.arc(TX, ty, TR + 2, 0, TAU2); g.fill(); g.restore(); }
  for (let i = 0; i < 24; i++) {
    const a0 = hash(i, 5) * Math.PI, rr = hash(i, 6);
    const x = TX + Math.cos(a0) * (40 + 110 * melt) * 1.7 * rr * (1 + spread * 1.6) + Math.sin(T * 2 + i) * 4, y = SURF + Math.sin(a0) * (40 + 110 * melt) * 0.75 * rr + 8;
    dot(x, y, 9, GOLDc, a * melt * (1 - 0.75 * spread) * (1 - 0.6 * refreeze));
  }
  [[700, 860], [1030, 870], [1360, 860]].forEach(([x, y], i) => { const ph = ((T * 0.9 + i * 0.33) % 1); arrow(x + (TX - x) * 0.1, y - ph * 40, x + (TX - x) * 0.35, y - 150 - ph * 40, CORALc, a * heat * (1 - ph * 0.5), 9, 26); });
  return { TX, SURF };
}
const fpAt = p => { for (let i = 1; i < FPD.length; i++) if (p <= FPD[i][0]) { const [x0, y0] = FPD[i - 1], [x1, y1] = FPD[i]; return lerp(y0, y1, (p - x0) / (x1 - x0)); } return -21.1; };
function fpChart(x, y, w, h, upto, mark, a = 1) {
  // freezing point vs salt %, 0..25 % across, 0..−22 °C down
  if (a <= 0.01) return;
  rrect(x - 40, y - 90, w + 120, h + 180, 26, PANELc, a * 0.92);
  text("freezing point of salt water", x + w / 2, y - 50, 40, QUIET, "center", 700, a);
  const X = p => x + p / 25 * w, Y = v => y + (-v) / 22 * h;
  line(x, y, x + w, y, INKc, a * 0.7, 3); line(x, y, x, y + h, INKc, a * 0.7, 3);
  text("0 °C", x - 12, y, 40, QUIET, "right", 700, a); text("−20", x - 12, Y(-20), 40, QUIET, "right", 700, a);
  text("salt, % by mass", x + w, y + h + 50, 40, QUIET, "right", 700, a);
  const P = []; for (let p = 0; p <= Math.min(upto, 23.3); p += 0.25) P.push([X(p), Y(fpAt(p))]);
  poly(P, BLUEc, a, 7);
  (mark || []).forEach(([p, s, c, lx, ly]) => { dot(X(p), Y(fpAt(p)), 12, c, a); if (lx !== undefined) { line(X(p), Y(fpAt(p)) + 14, x + lx + 60, y + ly - 30, c, a, 4); text(s, x + lx, y + ly, 44, c, "left", 900, a); } else text(s, X(p) + 22, Y(fpAt(p)) - 30, 44, c, "left", 900, a); });
}
const SCENES = {};

// 1 — hook: the payoff image in frame one (a cube hanging from a thread), then the colder-than-ice glass
SCENES.hook = (t, T, B, E, dur) => {
  room();
  const k1 = 1 - seg(t, B(3) - 0.6, B(3)), sw = Math.sin(t * 2.2) * 0.07 * Math.exp(-t * 0.15);
  hanging(1150, 235 + Math.sin(t * 1.1) * 6, 1.45, sw, k1);
  plate("no knot · no glue", 540, 620, 52, GOLD, "center", k1 * seg(t, 0.4, 0.8), 900);
  if (t > B(1) && k1 > 0.01) { saltGrains(1180, 457, 330, Math.round(30 * seg(t, B(1), B(1) + 1)), k1); plate("a pinch of salt + 2 minutes", 540, 480, 46, INK, "center", k1 * seg(t, B(1), B(1) + 0.4), 800); }
  // salted ice water vs plain ice water: two thermometers
  const k2 = seg(t, B(3) - 0.4, B(3) + 0.2) * (1 - seg(t, B(4) + 1.2, B(4) + 1.8));
  if (k2 > 0.01) {
    glass(760, 760, 280, 340, 0.75, k2); iceChunks(760, 760, 260, 7, 1, k2); thermo(860, 640, 0, -12, k2 * 0.95);
    glass(1340, 760, 280, 340, 0.75, k2); iceChunks(1340, 760, 260, 7, 1, k2); saltGrains(1340, 500, 220, 30, k2);
    thermo(1440, 640, -9 * seg(t, B(3) + 0.4, B(3) + 4), -12, k2 * 0.95, "below 0 °C");
    plate("ice + water", 760, 900 - 30, 44, INK, "center", k2, 800); plate("ice + water + salt", 1340, 870, 44, GOLD, "center", k2, 800);
  }
  // zoom in: a circle opening onto the molecules
  const z = seg(t, B(4) + 0.8, dur);
  if (z > 0.01) { molPanel(T, { rows: 6, a: z, hl: 0 }); }
  M(T, t, [[0.6, "!"], [B(3) + 1, "?"]]);
};
// 2 — balance: molecules leave and join at equal rates at 0 °C; warm → more leave, cool → more join
SCENES.balance = (t, T, B, E, dur) => {
  room();
  // temperature offset for the warm/cool beat
  const warm = win(t, B(5), B(5) + 2.4, 0.4) - win(t, B(5) + 2.8, dur, 0.4);
  const melt = 1 + 0.45 * Math.max(0, warm), freeze = 1 + 0.45 * Math.max(0, -warm);
  const rows = 6 - 0.6 * Math.max(0, warm) * seg(t, B(5), B(5) + 2.4) + 0.6 * Math.max(0, -warm);
  molPanel(T, { rows, melt: 1, freeze: 1, hl: seg(t, 0.4, 1.0) });
  plate("water", PX0 + 90, PY0 + 50, 44, BLUE, "center", 1, 900); plate("ice", PX0 + 60, PY1 - 40, 44, INK, "center", 1, 900);
  rateBars(110, 200, melt, freeze, seg(t, 0.2, 0.8));
  thermo(1760, 760, warm * 1.2, -5, 1, "below 0 °C");
  plate("dynamic equilibrium", 330, 460, 46, GOLD, "center", seg(t, B(4), B(4) + 0.4) * (1 - seg(t, B(5) - 0.3, B(5))), 900);
  plate("warmer: more leave", 330, 460, 46, CORAL, "center", win(t, B(5), B(5) + 2.6, 0.3), 900);
  plate("colder: more join", 330, 460, 46, GOLD, "center", win(t, B(5) + 2.8, dur, 0.3), 900);
  M(T, t, [[B(1) + 1, "?"], [B(4) + 0.5, "idea"]]);
};
// 3 — salt: ions in, fewer join, melting wins, cool to the new freezing point, seawater, the curve
SCENES.salt = (t, T, B, E, dur) => {
  room();
  const ions = seg(t, 0.2, 1.2);
  const block = seg(t, B(3), B(3) + 1.2), cool = seg(t, B(5) + 0.6, B(5) + 3.2);
  const freeze = 1 - 0.4 * block, melt = 1 - 0.4 * cool;    // cooling slows melting until the two match again
  const rows = 6 - 1.6 * seg(t, B(4), B(5) + 0.6);
  const chart = seg(t, B(6) - 0.4, B(6) + 0.2);
  molPanel(T, { rows, melt: 1, freeze: 1 - 0.45 * block, ions, ionsT: (t - 0.2) / 1.0, hl: 1, a: 1 - chart });
  if (chart < 0.99) {
    plate("Na⁺", 400, 600, 52, NAc, "center", seg(t, B(0) + 1.5, B(0) + 2) * (1 - chart), 900);
    plate("Cl⁻", 520, 600, 52, CLc, "center", seg(t, B(0) + 1.8, B(0) + 2.3) * (1 - chart), 900);
    rateBars(110, 200, melt, Math.min(freeze, melt), (1 - chart));
    plate("melting wins", 330, 460, 50, CORAL, "center", win(t, B(4), B(5) + 0.4, 0.3) * (1 - chart), 900);
    plate("balanced below 0 °C", 330, 460, 44, GOLD, "center", seg(t, B(5) + 2.4, B(5) + 2.8) * (1 - chart), 900);
    plate("ions stay in the water", 1060, 80, 44, INK, "center", win(t, B(2), B(3), 0.3) * (1 - chart), 800);
    thermo(1760, 760, -3 * cool, -5, 1 - chart, "below 0 °C");
  }
  if (chart > 0.01) {
    const upto = lerp(3.5, 25, seg(t, B(7), B(7) + 3));
    fpChart(560, 260, 900, 520, upto, [[3.5, "seawater −1.9 °C", GOLDc, 40, 300]], chart);
    if (upto > 22) text("more salt → lower", 1300, 900, 44, BLUE, "center", 900, chart * seg(t, B(7) + 2.6, B(7) + 3));
  }
  M(T, t, [[B(1) + 0.5, "!"], [B(4) + 1, "!"], [B(7) + 0.5, "ok"]]);
};
// 4 — cold: melting takes heat, the mix cools itself; ice cream in a bag; down to about −21 °C
SCENES.cold = (t, T, B, E, dur) => {
  room();
  const k1 = 1 - seg(t, B(3) - 0.5, B(3));
  if (k1 > 0.01) {
    molPanel(T, { rows: 5.2 - 0.6 * seg(t, B(1), B(2) + 3), freeze: 0.7, ions: 1, ionsT: 9, hl: 0.4, a: k1 });
    // heat arrows from the water and the ice into the melting front
    const ha = seg(t, B(1), B(1) + 0.6) * k1;
    for (let i = 0; i < 5; i++) { const x = PX0 + 120 + i * 180, ph = (T * 0.8 + i * 0.27) % 1; arrow(x, PY0 + 200 + ph * 60, x, PY0 + 330 + ph * 60, CORALc, ha * (1 - ph * 0.6), 8, 24); arrow(x + 60, PY1 - 40 - ph * 60, x + 60, PY1 - 170 - ph * 60, CORALc, ha * (1 - ph * 0.6), 8, 24); }
    plate("melting takes heat", 330, 260, 50, CORAL, "center", seg(t, 0.3, 0.8) * k1, 900);
    plate("from the water", 330, 380, 44, INK, "center", seg(t, B(1) + 1, B(1) + 1.4) * k1, 800);
    plate("and from the ice", 330, 470, 44, INK, "center", seg(t, B(1) + 2.4, B(1) + 2.8) * k1, 800);
    thermo(1760, 760, -4 * seg(t, B(2), B(2) + 3.5), -5, k1, "below 0 °C");
  }
  const k2 = seg(t, B(3) - 0.4, B(3) + 0.2) * (1 - seg(t, B(4) - 0.4, B(4)));
  if (k2 > 0.01) { bag(980, 640, seg(t, B(3) + 1.6, B(3) + 2.2), t, k2); plate("ice cream in a bag", 980, 170, 56, GOLD, "center", k2, 900); thermo(1560, 760, -10 * seg(t, B(3) + 1.5, B(4)), -22, k2, "well below 0 °C"); }
  const k3 = seg(t, B(4) - 0.4, B(4) + 0.2);
  if (k3 > 0.01) { fpChart(560, 260, 900, 520, 25, [[23.3, "about −21 °C", BLUEc]], k3); plate("lowest point for salt water", 1010, 120, 44, INK, "center", seg(t, B(5), B(5) + 0.4) * k3, 800); }
  M(T, t, [[B(0) + 0.5, "?"], [B(3) + 1, "!", "grin"], [B(4) + 1, "!"]]);
};
// 5 — road: salt works at −3 °C; less ice per kilo as it gets colder; about −9 °C too slow; liquid de-icers
SCENES.road = (t, T, B, E, dur) => {
  room();
  const k1 = 1 - seg(t, B(3) - 0.5, B(3));
  if (k1 > 0.01) {
    g.save(); g.globalAlpha = k1; road(t, seg(t, B(1) + 0.5, B(2)) * (1 - seg(t, B(2) + 0.5, B(2) + 2) * 0.8)); g.restore();
    thermo(1760, 760, Math.round(lerp(-3, -8, seg(t, B(2), B(2) + 3))), -12, k1);
    plate("−3 °C: salt works", 330, 300, 48, GOLD, "center", win(t, B(1), B(2) + 0.2, 0.3) * k1, 900);
    plate("colder: slower", 330, 300, 48, CORAL, "center", seg(t, B(2) + 0.4, B(2) + 0.8) * k1, 900);
  }
  const k2 = seg(t, B(3) - 0.4, B(3) + 0.2);
  if (k2 > 0.01) {
    // ice melted per kilo of salt (Cargill: 46 at 30 °F ≈ −1 °C, 9 at 20 °F ≈ −7 °C)
    rrect(520, 170, 1000, 560, 30, PANELc, 0.92 * k2);
    text("kg of ice melted by 1 kg of salt", 1020, 230, 44, QUIET, "center", 700, k2);
    [[-1, 46, GOLD, 330], [-7, 9, CORAL, 470]].forEach(([c, v, col, y], i) => {
      const d0 = i ? 3.0 : 0; const u = seg(t, B(3) + d0, B(3) + d0 + 0.8);
      text(`${c === -1 ? "−1" : "−7"} °C`, 690, y, 52, INK, "right", 900, k2 * seg(t, B(3) + d0 - 0.2, B(3) + d0));
      rrect(720, y - 34, 720 * v / 46 * u, 68, 18, col, k2);
      if (u > 0.5) text(String(v), 720 + 720 * v / 46 + 20, y, 56, col, "left", 900, k2);
    });
    const lim = seg(t, B(4), B(4) + 0.5);
    plate("below about −9 °C: usually too slow", 1020, 620, 50, CORAL, "center", lim * k2, 900);
    plate("→ liquid de-icers, other chemicals", 1020, 820, 46, INK, "center", seg(t, B(5), B(5) + 0.5) * k2, 800);
  }
  M(T, t, [[B(1) + 0.8, "ok"], [B(3) + 3.4, "!"], [B(4) + 0.8, "?"]]);
};
// 6 — thread: no salt → nothing; salt → melt pocket, heat out, below 0, salt spreads, refreeze; lift
SCENES.thread = (t, T, B, E, dur) => {
  room();
  const k1 = 1 - seg(t, B(5) + 1.3, B(5) + 1.8);
  if (k1 > 0.01) {
    const melt = seg(t, B(2), B(2) + 2.4), heat = win(t, B(2) + 1.5, B(4) + 1.2, 0.4), spread = seg(t, B(4), B(4) + 2.4), refreeze = seg(t, B(4) + 2.4, E(4) + 0.4);
    threadSection(t, T, melt, refreeze, spread, heat, k1);
    // a pinch of salt falling onto the thread just before it starts to melt the ice
    for (let i = 0; i < 30; i++) { const t0 = B(2) - 1.2 + hash(i, 61) * 1.4, u = clamp((t - t0) / 0.6); if (t < t0 || u >= 1) continue; dot(1030 + (hash(i, 62) - 0.5) * 160, lerp(380, 560, u * u), 7, [255, 255, 255], k1); }
    plate("film of water", 1330, 470, 44, BLUE, "center", win(t, B(1), B(2) - 0.2, 0.3) * k1, 800);
    plate("no salt: all at 0 °C", 1030, 300, 48, INK, "center", win(t, B(1), B(2) - 0.1, 0.3) * k1, 900);
    plate("salt melts a thin layer", 1030, 300, 48, GOLD, "center", win(t, B(2), B(4) - 0.2, 0.3) * k1, 900);
    plate("meltwater dilutes the salt", 1030, 300, 48, GOLD, "center", win(t, B(4), B(4) + 2.6, 0.3) * k1, 900);
    plate("the cold cube refreezes the water", 1030, 300, 48, BLUE, "center", seg(t, B(4) + 2.6, B(4) + 3.0) * k1, 900);
    plate("thread", 760, 420, 48, INK, "center", (1 - seg(t, B(4) + 2.0, B(4) + 2.4)) * k1, 800);
    if (t > B(4) + 2.4) { line(840, 450, 900, 525, BLUEc, seg(t, B(4) + 3.2, B(4) + 3.6) * k1, 6); plate("new ice", 760, 420, 56, BLUE, "center", seg(t, B(4) + 3.2, B(4) + 3.6) * k1, 900); }
    thermo(1760, 760, -2.5 * seg(t, B(3) - 0.5, B(3) + 1.5), -5, k1, "below 0 °C");
  }
  const k2 = seg(t, B(5) + 1.3, B(5) + 1.8);
  if (k2 > 0.01) { const up = eio((t - B(5) - 1.8) / 1.4); hanging(1000, 420 - 260 * up, 1.1, Math.sin((t - B(5)) * 2.4) * 0.06 * up, k2); }
  M(T, t, [[B(2) + 1, "!"], [B(4) + 3.0, "idea"], [B(5) + 1.4, "ok", "grin"]]);
};
// 7 — payoff: the balance again (fewer join, same leave, heat paid by the ice), then the end card
SCENES.payoff = (t, T, B, E, dur) => {
  room();
  const endK = seg(t, B(2) + 2.6, B(2) + 3.6);
  const k1 = 1 - seg(t, B(2) - 0.5, B(2));
  if (k1 > 0.01) {
    molPanel(T, { rows: 5, freeze: 0.55, ions: 1, ionsT: 9, hl: 1, a: k1 });
    rateBars(110, 200, 1, 0.6, k1 * seg(t, B(1) - 0.2, B(1) + 0.3));
    plate("salt tips a balance", 330, 560, 50, GOLD, "center", seg(t, 0.4, 0.8) * k1, 900);
    plate("the ice pays with heat", 330, 460, 46, CORAL, "center", seg(t, B(1) + 2.6, B(1) + 3) * k1, 900);
  }
  const k2 = seg(t, B(2) - 0.4, B(2) + 0.2);
  if (k2 > 0.01) { const ax = lerp(0, -560, endK); hanging(1000 + ax, 260 - 40 * endK, 1.1 - 0.3 * endK, Math.sin(t * 2.2) * 0.06, k2 * (1 - 0.65 * endK)); }
  M(T, t, [[B(0) + 0.6, "idea"], [B(2) + 1, "ok", "grin"]]);
};
