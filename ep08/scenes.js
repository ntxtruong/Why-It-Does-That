// Episode 8 — Why microwaves don't heat food from the inside.
// Three scales: the oven box, a cut-away slab of food, water molecules. Pure functions of time.
// Heating model (closed form, illustrative): energy is deposited as e^(−d/δ) from the nearest surface (δ ≈ 1 cm),
// then spreads by conduction; the spread length grows like sqrt(time). Standing waves: |E|² of two cavity modes.

const MAS = (T, o = {}) => mascot3(o.x ?? 190, o.y ?? 905, o.s ?? 0.34, T, o);
const PXCM = 26;                           // slab drawing scale: px per cm
const COLD = [120, 170, 235], WARM = [255, 138, 122], HOT = [255, 212, 94];
const heatCol = h => h < 0.5 ? mix(COLD, WARM, h * 2) : mix(WARM, HOT, (h - 0.5) * 2);

// temperature index 0..1 at depth d (cm) after heating time tau (0..1), penetration delta (cm)
const heatAt = (d, tau, delta = 1.0, diff = 1.2) => clamp(1.25 * tau * Math.exp(-d / (delta + diff * Math.sqrt(Math.max(0, tau) * 0.35))));

// ---------- the slab (lasagne) in cross-section: w×h cm, coloured by temperature ----------
function slab(x, y, wcm, hcm, tau, a = 1, o = {}) {
  if (a <= 0.01) return;
  const PX = o.px || PXCM, cell = o.cell || 10, W0 = wcm * PX, H0 = hcm * PX, delta = o.delta ?? 1.0;
  const oc = slabCanvas(W0, H0), og = oc.getContext("2d");
  for (let i = 0; i < W0; i += cell) for (let j = 0; j < H0; j += cell) {
    const xc = (i + cell / 2) / PX, yc = (j + cell / 2) / PX;
    const d = o.topOnly ? yc : Math.min(xc, wcm - xc, yc, hcm - yc);
    let h = heatAt(d, tau, delta, o.diff ?? 1.2);
    if (o.edge) h = clamp(h + o.edge * 0.25 * Math.exp(-Math.min(xc, wcm - xc) / 1.2) * tau);
    og.fillStyle = css(heatCol(h)); og.fillRect(i, j, cell + 1, cell + 1);
  }
  g.save(); g.globalAlpha = a; g.drawImage(oc, 0, 0, W0, H0, x, y, W0, H0);
  // layers: thin lines for pasta sheets
  if (o.layers !== false) for (let k = 1; k < 4; k++) line(x, y + H0 * k / 4, x + W0, y + H0 * k / 4, INKc, 0.35, 3);
  g.strokeStyle = css(INKc); g.lineWidth = 5; g.strokeRect(x, y, W0, H0);
  g.restore();
}
const SLABC = {};
function slabCanvas(w, h) { const k = Math.ceil(w) + 'x' + Math.ceil(h); if (!SLABC[k]) { const c = document.createElement('canvas'); c.width = Math.ceil(w) + 2; c.height = Math.ceil(h) + 2; SLABC[k] = c; } const c = SLABC[k]; c.getContext('2d').clearRect(0, 0, c.width, c.height); return c; }
// the microwave oven, front view, door open (cavity visible)
function oven(cx, cy, s, a = 1, o = {}) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s);
  rrect(-560, -330, 1120, 660, 40, [58, 66, 96], 1, INKc, 8);
  rrect(-520, -290, 820, 580, 20, [30, 44, 88], 1, QUIETc, 4);              // cavity
  rrect(340, -290, 180, 580, 20, [44, 52, 80], 1);                            // control panel
  for (let k = 0; k < 4; k++) rrect(380, -230 + k * 90, 100, 50, 12, PANELc, 1);
  if (o.magnetron) { rrect(130, -285, 150, 70, 10, GOLDc, o.magnetron); text("magnetron", 205, -175, 34, GOLD, "center", 700, o.magnetron); }
  ellipseFill(-110, 230, 330, 46, [70, 80, 116], 1);                          // turntable
  g.restore();
}
function ellipseFill(x, y, rx, ry, col, a) { g.save(); g.globalAlpha *= a; g.fillStyle = css(col); g.beginPath(); g.ellipse(x, y, rx, ry, 0, 0, TAU2); g.fill(); g.restore(); }
// a water molecule: O (blue, −) and two H (ink, +); angle th points the + side
function water(x, y, s, th, a = 1, signs = false) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(th); g.scale(s, s);
  const hx = 34 * Math.cos(0.91), hy = 34 * Math.sin(0.91);
  [[hx, hy], [hx, -hy]].forEach(([u, v]) => { g.strokeStyle = css(INKc); g.lineWidth = 8; g.beginPath(); g.moveTo(0, 0); g.lineTo(u, v); g.stroke(); dot(u, v, 14, INKc, 1); });
  dot(0, 0, 24, BLUEc, 1);
  if (signs) { text("−", -40, 0, 40, BLUE, "center", 800, 1); text("+", hx + 30, 0, 40, INK, "center", 800, 1); }
  g.restore();
}
// Debye loss curve of liquid water (25 °C), log frequency axis 1..100 GHz
function lossPlot(x, y, w, h, a, mark) {
  if (a <= 0.01) return; const fr = 19.3, X = f => x + w * Math.log10(f) / 2, Y = v => y + h - v * h;
  rrect(x - 40, y - 60, w + 80, h + 140, 24, PANELc, a * 0.85);
  line(x, y + h, x + w, y + h, QUIETc, a, 3); line(x, y, x, y + h, QUIETc, a, 3);
  const pts = []; for (let k = 0; k <= 200; k++) { const f = Math.pow(10, k / 100), v = 2 * (f / fr) / (1 + (f / fr) ** 2); pts.push([X(f), Y(v * 0.9)]); } poly(pts, BLUEc, a, 7);
  [1, 10, 100].forEach(f => text(f + " GHz", X(f), y + h + 40, 34, QUIET, "center", 600, a));
  text("how much the molecules lag", x + 10, y - 26, 36, QUIET, "left", 600, a);
  const m1 = mark ?? 1; line(X(2.45), y, X(2.45), y + h, GOLDc, a * m1, 4, [10, 8]); text("oven 2.45", X(2.45) + 12, y + 30, 36, GOLD, "left", 700, a * m1);
  line(X(fr), y, X(fr), y + h, CORALc, a * m1, 4, [10, 8]); text("≈ 20", X(fr) + 12, y + 30, 36, CORAL, "left", 700, a * m1);
}
// standing-wave intensity in a box (two modes), 0..1
const field = (u, v) => { const a = Math.sin(Math.PI * 4 * u) ** 2 * Math.sin(Math.PI * 3 * v) ** 2, b = Math.sin(Math.PI * 3 * u) ** 2 * Math.sin(Math.PI * 4 * v) ** 2; return 0.6 * a + 0.4 * b; };
function fieldMap(x, y, w, h, a, rot = 0, avg = 0) {
  if (a <= 0.01) return; const c = 14;
  for (let i = 0; i < w; i += c) for (let j = 0; j < h; j += c) {
    const u = (i + c / 2) / w, v = (j + c / 2) / h; let I;
    if (avg > 0) {                              // time-average over a turntable rotation about the centre
      const r = Math.hypot(u - 0.5, v - 0.5); let s = 0; for (let k = 0; k < 16; k++) { const an = k / 16 * TAU2; s += field(0.5 + r * Math.cos(an), 0.5 + r * Math.sin(an)); } I = lerp(field(u, v), s / 16 * (0.25 + 0.75 * clamp(r / 0.12)), avg);
    } else I = field(u, v);
    g.globalAlpha = a * (0.15 + 0.85 * I); g.fillStyle = css(mix([40, 56, 110], GOLDc, I)); g.fillRect(x + i, y + j, c + 0.5, c + 0.5);
  }
  g.globalAlpha = 1;
}

const SCENES = {};

// 1 — hook: a bite from the middle is cold; edges bubble; two myths stamped ✕
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const tau = seg(t, B(1), B(1) + 3.2), myth = seg(t, B(3) - 0.3, B(3) + 0.3), dive = seg(t, B(6), dur - 0.2);
  g.save(); const z = 1 + 1.6 * eio(dive); g.translate(960, 500); g.scale(z, z); g.translate(-960, -500);
  slab(960 - 13 * 40, 300, 26, 9, Math.max(tau, 0.02), 1 - myth * 0.75, { edge: 1, px: 40, cell: 12 });
  // the bite: a notch in the middle with a cold core showing
  const bite = seg(t, 0.4, 1.2); if (bite > 0.01) { rrect(960 - 80, 300 - 2, 160, 150 * bite, 40, BGc, 1); }
  g.restore();
  text(`${Math.floor(tau * 3)}:${String(Math.floor((tau * 180) % 60)).padStart(2, "0")}`, 960, 760 + 0, 56, INK, "center", 800, win(t, B(1), B(3), 0.4));
  plate("hot edges", 560, 200, 44, CORAL, "center", win(t, B(1) + 2.0, B(3), 0.4)); plate("cold middle", 1360, 200, 44, BLUE, "center", win(t, B(1) + 2.4, B(3), 0.4));
  const c1 = seg(t, B(3), B(3) + 0.4), c2 = seg(t, B(4), B(4) + 0.4), x1 = seg(t, B(5), B(5) + 0.3);
  [["INSIDE OUT?", 600, c1], ["WATER FREQUENCY?", 1320, c2]].forEach(([s, x, a]) => { plate(s, x, 480, 60, INK, "center", a * (1 - dive), 800); if (x1 > 0.01) { line(x - 220, 420, x + 220, 540, CORALc, x1 * (1 - dive), 14); line(x + 220, 420, x - 220, 540, CORALc, x1 * (1 - dive), 14); } });
  MAS(T, { a: 1 - dive, x: 170, look: [0.8, -0.2], mouth: t < B(2) ? "wince" : t > B(5) ? "grin" : "o" });
};

// 2 — wave: magnetron → 12 cm wave → field flips → water molecule turns, lags, jostles → heat
SCENES.wave = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const ov = 1 - seg(t, B(2) - 0.3, B(2) + 0.3), mol = seg(t, B(4) - 0.3, B(4) + 0.4), crowd = seg(t, B(6) - 0.2, B(6) + 0.6);
  oven(960, 520, 1.25, ov, { magnetron: seg(t, B(1), B(1) + 0.5) });
  if (ov > 0.01) { const an = t * 1.3; soft(960 - 110 * 1.25, 520, 380, GOLDc, 0.12 * ov); g.save(); g.globalAlpha = ov; g.translate(960 - 137, 520 + 287); g.scale(1, 0.14); g.fillStyle = css(INKc); g.beginPath(); g.arc(300 * Math.cos(an), 300 * Math.sin(an), 26, 0, TAU2); g.fill(); g.restore(); }
  // the wave leaving the magnetron, with a 12 cm ruler
  const wa = seg(t, B(1) + 0.4, B(1) + 1.2) * (1 - seg(t, B(4) - 0.4, B(4)));
  if (wa > 0.01) { const lam = 380, x0 = 260, x1 = 1660, y0 = 560, ph = t * 2.2; const pts = []; for (let x = x0; x <= x1; x += 6) pts.push([x, y0 - 90 * Math.sin(TAU2 * (x - x0) / lam - ph)]); poly(pts, GOLDc, wa, 7);
    if (ov < 0.5) { line(x0, 720, x0 + lam, 720, INKc, wa, 4); line(x0, 700, x0, 740, INKc, wa, 4); line(x0 + lam, 700, x0 + lam, 740, INKc, wa, 4); text("≈ 12 cm", x0 + lam / 2, 775, 44, INK, "center", 800, wa); }
    // field arrows along the wave
    for (let k = 0; k < 6; k++) { const x = x0 + 120 + k * 230, e = Math.sin(TAU2 * (x - x0) / lam - ph); arrow(x, y0, x, y0 - 120 * e, CORALc, wa * (1 - ov) * 0.9, 6, 18); } }
  plate("electric field: one way, then the other", 960, 150, 46, CORAL, "center", win(t, B(2), B(4), 0.4));
  plate("2.45 billion times a second", 960, 245, 46, GOLD, "center", win(t, B(3), B(4), 0.4));
  // one molecule, then a crowd
  const fl = Math.sin(t * 2.4);   // display rate, far slower than real
  if (mol > 0.01) {
    const one = mol * (1 - crowd); arrow(960, 880, 960 + 260 * fl, 880, CORALc, one * seg(t, B(5) - 0.2, B(5) + 0.3), 8, 24);
    water(960, 520, 3.2, (B(5) < t ? fl * 0.9 * Math.PI / 2 * seg(t, B(5), B(5) + 0.6) : 0) + Math.PI, one, true);
    plate("water: one end −, one end +", 960, 150, 46, BLUE, "center", one * win(t, B(4), B(6) - 0.1, 0.4));
    if (crowd > 0.01) { for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) { const k = i * 4 + j, lag = 0.5 + 0.4 * hash(k, 3), jit = 0.25 * Math.sin(t * 7 + k); water(260 + i * 175 + 12 * Math.sin(t * 5 + k), 330 + j * 150 + 10 * Math.cos(t * 6 + k * 2), 1.15, Math.PI + 1.1 * Math.sin(t * 2.4 - lag) + jit, crowd); }
      soft(960, 560, 520, CORALc, 0.35 * seg(t, B(7), B(7) + 1.0) * crowd);
      plate("it lags behind and bumps its neighbours", 960, 110, 46, INK, "center", win(t, B(6), B(7), 0.4) * crowd);
      plate("that jostling is heat", 960, 110, 50, CORAL, "center", win(t, B(7), B(8), 0.4) * crowd, 800);
      plate("fats and sugars a little · water most", 960, 110, 46, GOLD, "center", seg(t, B(8), B(8) + 0.4) * crowd); }
  }
  MAS(T, { a: 1, x: 150, look: [0.8, -0.3], mouth: t > B(7) ? "grin" : "smile" });
};

// 3 — resonance: broad loss curve with a peak near 20 GHz; too high → burns the surface; 2.45 is a compromise
SCENES.resonance = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const pl = win(t, 0.3, B(3) + 0.2, 0.5), sp = seg(t, B(3), B(3) + 0.6);
  plate("a special frequency of water?", 960, 110, 50, INK, "center", win(t, 0.2, B(1) + 0.3, 0.4), 800);
  lossPlot(420, 260, 1080, 460, pl, seg(t, B(2) - 0.2, B(2) + 0.4));
  plate("no sharp line · a broad hump", 960, 110, 46, BLUE, "center", win(t, B(1) + 0.3, B(2) - 0.1, 0.4));
  plate("peak ≈ 20 GHz · higher frequencies absorbed faster", 960, 110, 44, CORAL, "center", win(t, B(2), B(3) + 0.2, 0.4));
  if (sp > 0.01) {
    const tau = seg(t, B(4) - 0.2, B(4) + 3.0);
    slab(250, 380, 24, 10, tau, sp, { topOnly: true, delta: 0.15, diff: 0.25, layers: false }); text("≈ 20 GHz", 250 + 12 * PXCM, 330, 48, CORAL, "center", 800, sp);
    slab(1050, 380, 24, 10, tau, sp * seg(t, B(5) - 0.4, B(5) + 0.2), { topOnly: true, delta: 1.6, diff: 0.25, layers: false }); text("2.45 GHz", 1050 + 12 * PXCM, 330, 48, GOLD, "center", 800, sp * seg(t, B(5) - 0.4, B(5) + 0.2));
    plate("burnt top · raw inside", 250 + 12 * PXCM, 720, 42, CORAL, "center", seg(t, B(4) + 1.2, B(4) + 1.8) * sp);
    plate("reaches deeper", 1050 + 12 * PXCM, 720, 42, GOLD, "center", seg(t, B(5) + 0.3, B(5) + 0.8) * sp);
    plate("a compromise · and the ISM radio band (Wi-Fi shares it)", 960, 150, 44, INK, "center", seg(t, B(6), B(6) + 0.5) * sp);
  }
  MAS(T, { a: 1, x: 150, look: [0.8, -0.3], mouth: t > B(4) && t < B(5) ? "wince" : "smile" });
};

// 4 — depth: energy decays within 1–2 cm; the rest creeps in slowly; thin vs thick; stir and stand
SCENES.depth = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const tauA = lerp(0.3, 0.55, seg(t, B(3), B(4) + 2.0)), thin = win(t, B(5) - 0.2, B(6) + 0.1, 0.5), stir = seg(t, B(7) - 0.2, B(7) + 0.4);
  const main = 1 - thin;
  // energy deposited vs depth: bars that shrink as e^(−z/δ)
  const bA = win(t, 0.2, B(2) + 0.2, 0.5) * main;
  if (bA > 0.01) { for (let k = 0; k < 12; k++) { const z = k * 0.5, v = Math.exp(-z / 1.0); rrect(380 + k * 100, 700 - v * 420, 70, v * 420, 10, mix(COLD, HOT, v), bA * seg(t, 0.5 + k * 0.15, 0.8 + k * 0.15)); } line(360, 700, 1600, 700, QUIETc, bA, 3); text("depth into food →", 980, 760, 40, QUIET, "center", 700, bA); line(380, 230, 580, 230, GOLDc, bA, 6); text("1–2 cm: most of the power is gone", 610, 230, 44, GOLD, "left", 700, bA * seg(t, B(1) + 1.5, B(1) + 2.0)); }
  // the slab: outer layer hot, core slowly catching up
  const sA = seg(t, B(2) + 0.1, B(2) + 0.8) * main * (1 - stir);
  slab(960 - 13 * 38, 300, 26, 12, Math.max(0.02, tauA), sA, { px: 38, cell: 12 });
  plate("the cold middle", 960, 200, 48, BLUE, "center", win(t, B(2), B(4), 0.4) * main);
  plate("heat creeps inward · minutes", 960, 200, 46, CORAL, "center", win(t, B(4), B(5), 0.4) * main);
  plate("outside in · not inside out", 960, 200, 48, GOLD, "center", win(t, B(6) + 0.2, B(7), 0.4) * (1 - stir), 800);
  // thin pizza vs thick rice
  if (thin > 0.01) { const tau = seg(t, B(5), B(5) + 3.0) * 0.6; slab(220, 470, 22, 2, tau, thin, { layers: false }); text("thin slice", 220 + 11 * PXCM, 400, 46, INK, "center", 800, thin); slab(1080, 280, 22, 16, tau, thin, { layers: false }); text("thick lump", 1080 + 11 * PXCM, 230, 46, INK, "center", 800, thin); }
  // stir and stand: hot food moves into the middle
  if (stir > 0.01) { slab(960 - 13 * 38, 300, 26, 12, 0.55, stir * (1 - seg(t, B(7) + 1.4, B(7) + 2.2)), { px: 38, cell: 12 }); slab(960 - 13 * 38, 300, 26, 12, 0.9, stir * seg(t, B(7) + 1.4, B(7) + 2.2), { delta: 3, px: 38, cell: 12 }); arrow(300, 530, 560, 530, INKc, stir, 8, 24); arrow(1620, 530, 1360, 530, INKc, stir, 8, 24); plate("stir · let it stand", 960, 210, 48, INK, "center", stir, 800); }
  MAS(T, { a: 1, x: 150, look: [0.8, -0.2], mouth: t > B(2) && t < B(3) ? "wince" : "smile" });
};

// 5 — hot spots: waves bounce → standing pattern; marshmallows; speed of light; turntable averages, centre weak
SCENES.hotspots = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const X = 560, Y = 170, Wd = 800, Hd = 640, mapA = seg(t, B(2), B(3)), tt = seg(t, B(6) + 1.0, B(6) + 3.0), avg = seg(t, B(6) + 1.5, B(7));
  rrect(X - 20, Y - 20, Wd + 40, Hd + 40, 20, [30, 44, 88], 1, QUIETc, 5);
  // bouncing waves: two opposite travelling sines
  const ba = seg(t, B(1) - 0.2, B(1) + 0.4) * (1 - mapA);
  for (let k = 0; k < 5; k++) { const y = Y + 80 + k * 120; const p1 = [], p2 = []; for (let x = X; x <= X + Wd; x += 8) { p1.push([x, y - 30 * Math.sin((x - X) / 50 - t * 3)]); p2.push([x, y - 30 * Math.sin((x - X) / 50 + t * 3)]); } poly(p1, GOLDc, ba * 0.8, 4); poly(p2, BLUEc, ba * 0.8 * seg(t, B(1) + 1, B(1) + 1.6), 4); }
  fieldMap(X, Y, Wd, Hd, Math.max(mapA, 0.55 * win(t, -1, B(1) + 0.3, 0.5)) * (1 - seg(t, B(4) - 0.2, B(4) + 0.3) * 0.5), 0, avg);
  plate("uneven, even across the surface", 960, 90, 46, INK, "center", win(t, 0.2, B(1), 0.4));
  plate("they add · they cancel", 960, 90, 46, INK, "center", win(t, B(2), B(3), 0.4));
  // ruler between two spots
  const ru = win(t, B(3), B(4) + 0.2, 0.4); if (ru > 0.01) { const x1 = X + Wd * 0.125, x2 = X + Wd * 0.375, y = Y + Hd * 0.5; line(x1, y, x2, y, INKc, ru, 6); line(x1, y - 20, x1, y + 20, INKc, ru, 6); line(x2, y - 20, x2, y + 20, INKc, ru, 6); plate("≈ 6 cm = ½ wavelength", (x1 + x2) / 2 + 120, y - 70, 42, INK, "center", ru); }
  // marshmallows: melted where the field is strong
  const ma = win(t, B(4) - 0.1, B(6) + 0.6, 0.4);
  if (ma > 0.01) { for (let i = 0; i < 12; i++) for (let j = 0; j < 9; j++) { const u = (i + 0.5) / 12, v = (j + 0.5) / 9, I = field(u, v), melt = seg(t, B(4) + 0.6, B(4) + 2.5) * clamp(I * 1.6 - 0.4); rrect(X + u * Wd - 22 - melt * 8, Y + v * Hd - 18 - melt * 6, 44 + melt * 16, 36 + melt * 12, 12, mix([236, 236, 240], HOT, melt), ma); } }
  plate("6 cm × 2 × 2.45 GHz ≈ 300,000 km/s", 960, 90, 46, GOLD, "center", win(t, B(5), B(6), 0.4), 800);
  plate("= the speed of light", 1560, 300, 42, QUIET, "center", win(t, B(5) + 0.6, B(6), 0.4));
  plate("edges and corners catch extra energy", 960, 90, 44, CORAL, "center", win(t, B(6), B(6) + 2.6, 0.4));
  // turntable: a plate rotating over the map, then the averaged pattern with a weak centre
  if (tt > 0.01) { g.save(); g.globalAlpha = tt; g.translate(X + Wd / 2, Y + Hd / 2); g.rotate(t * 1.2); g.strokeStyle = css(INKc); g.lineWidth = 6; g.beginPath(); g.ellipse(0, 0, 290, 290, 0, 0, TAU2); g.stroke(); line(0, 0, 290, 0, INKc, 1, 4); g.restore(); plate("the turntable drags food through the spots", 960, 90, 44, INK, "center", win(t, B(6) + 2.4, B(7), 0.4)); }
  plate("but the centre barely moves", 960, 90, 46, BLUE, "center", seg(t, B(7), B(7) + 0.4)); if (t > B(7)) { g.strokeStyle = BLUE; g.lineWidth = 6; g.globalAlpha = seg(t, B(7), B(7) + 0.4); g.beginPath(); g.arc(X + Wd / 2, Y + Hd / 2, 60, 0, TAU2); g.stroke(); g.globalAlpha = 1; }
  MAS(T, { a: 1, x: 220, look: [0.8, -0.3], mouth: t > B(5) && t < B(6) ? "grin" : "smile" });
};

// 6 — ice: locked lattice, waves pass through; one corner melts and runs away; defrost pulses
SCENES.ice = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const N = 14, M = 8, x0 = 460, y0 = 230, d = 72, melt0 = B(2), run = B(3);
  // melt front: radius from the corner grows slowly, then faster (runaway), shown as liquid cells turning coral-hot
  const r = t < melt0 ? 0 : 1.2 * seg(t, melt0, melt0 + 1.0) + 5.5 * Math.pow(seg(t, run, run + 4.0), 2);
  const pulse = t > B(5) ? (Math.floor((t - B(5)) * 1.2) % 2 === 0 ? 1 : 0.15) : 1;
  for (let i = 0; i < N; i++) for (let j = 0; j < M; j++) {
    const x = x0 + i * d + (j % 2) * d / 2, y = y0 + j * d * 0.86, dist = Math.hypot(i - 0, j - 0), liq = clamp(r - dist + 1);
    const heat = clamp(liq * (0.4 + 0.6 * seg(t, run, run + 3)) * (t > B(5) ? 0.6 : 1));
    if (liq > 0.01) soft(x, y, 64, heatCol(heat), 0.6 * liq);
    water(x + liq * 6 * Math.sin(t * 6 + i + j), y + liq * 6 * Math.cos(t * 7 + i), 0.85, (i + j) % 3 * 2.1 + liq * Math.sin(t * 2.4 + i) * 1.2, 1);
    if (liq < 0.5 && i % 2 === 0 && j % 2 === 0) { line(x, y, x + d, y, QUIETc, 0.35, 3); line(x, y, x + d / 2, y + d * 0.86, QUIETc, 0.35, 3); }
  }
  // waves passing straight through the ice
  const wv = win(t, B(1) - 0.2, B(2) + 0.6, 0.5); for (let k = 0; k < 3; k++) { const y = y0 + 100 + k * 200, p = []; for (let x = 260; x <= 1700; x += 8) p.push([x, y - 26 * Math.sin((x - 260) / 60 - t * 3)]); poly(p, GOLDc, wv * 0.6, 4); }
  plate("ice: molecules locked · waves pass through", 960, 120, 44, BLUE, "center", win(t, B(1), B(2), 0.4));
  plate("one corner melts → absorbs → melts more", 960, 120, 44, CORAL, "center", win(t, B(2) + 0.2, B(4), 0.4));
  plate("cooked edge · frozen middle", 960, 120, 46, GOLD, "center", win(t, B(4), B(5), 0.4), 800);
  if (t > B(5)) { rrect(760, 900 - 110, 400, 60, 20, PANELc, 1); rrect(770, 900 - 100, 380 * pulse, 40, 14, CORALc, 1); text("defrost: power on · off", 960, 735, 44, INK, "center", 800, seg(t, B(5), B(5) + 0.4)); }
  MAS(T, { a: 1, x: 170, look: [0.8, -0.2], mouth: t > run && t < B(5) ? "wince" : "o" });
};

// 7 — payoff: the bite again, now with the explanation; end card
SCENES.payoff = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const endc = seg(t, B(4) - 0.2, B(4) + 0.6), sA = 1 - endc;
  slab(960 - 13 * 40, 300, 26, 9, 0.5, sA, { edge: 1, px: 40, cell: 12 });
  rrect(960 - 80, 298, 160, 150, 40, BGc, sA);
  plate("microwaves: mostly the outer 1–2 cm", 960, 180, 46, GOLD, "center", win(t, B(1), B(2), 0.4) * sA);
  plate("the middle waits for heat to creep in", 960, 180, 46, BLUE, "center", win(t, B(2), B(3), 0.4) * sA);
  plate("not inside out · not a magic frequency", 960, 180, 48, INK, "center", win(t, B(3), B(4), 0.4) * sA, 800);
  // ring-shaped plate hint
  const ring = seg(t, B(4) - 0.6, B(4)) * sA; if (ring > 0.01) { g.save(); g.globalAlpha = ring; g.strokeStyle = CORAL; g.lineWidth = 40; g.beginPath(); g.arc(1560, 820, 60, 0, TAU2); g.stroke(); g.restore(); }
  MAS(T, { a: 1, x: lerp(170, 330, endc), y: lerp(905, 930, endc), s: lerp(0.34, 0.62, endc), look: [0.6, -0.2], mouth: endc > 0.5 ? "grin" : "smile" });
};
