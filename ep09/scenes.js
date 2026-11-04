// Episode 9 (Short, 1080×1920, cut from episode 8) — Why is the middle still cold?
// One giant cut-away block of lasagne. Heat model from ep 8 (closed form): energy deposited as e^(−d/δ) from the
// nearest surface (δ ≈ 1 cm), spread by conduction with a length growing like sqrt(time). Pure functions of time.
// Safe zone (Shorts UI): key content above y = 1536 and left of x = 940.

const COLD = [120, 170, 235], WARM = [255, 138, 122], HOT = [255, 212, 94];
const heatCol = h => h < 0.5 ? mix(COLD, WARM, h * 2) : mix(WARM, HOT, (h - 0.5) * 2);
const heatAt = (d, tau, delta = 1.0, diff = 1.2) => clamp(1.25 * tau * Math.exp(-d / (delta + diff * Math.sqrt(Math.max(0, tau) * 0.35))));
const PX = 70, WCM = 10, HCM = 9, SX = 240, SY = 600, SW = WCM * PX, SH = HCM * PX;   // slab: 700×525 px
const BITE = { x: SX + SW / 2 - 70, y: SY + SH / 2 - 70, w: 140, h: 140 };                // the chunk the fork pulls out

const SLABC = document.createElement("canvas"); SLABC.width = SW + 2; SLABC.height = SH + 2;
// draw the slab: tau = heating progress, mixU = 0..1 how much stirring has evened it out, diff = conduction spread
function slab(tau, a = 1, o = {}) {
  if (a <= 0.01) return;
  const og = SLABC.getContext("2d"), cell = 10, diff = o.diff ?? 1.2, mixU = o.mixU || 0;
  og.clearRect(0, 0, SLABC.width, SLABC.height);
  let mean = 0, n = 0;
  if (mixU > 0) for (let i = 0; i < SW; i += 20) for (let j = 0; j < SH; j += 20) { const xc = (i + 10) / PX, yc = (j + 10) / PX; mean += heatAt(Math.min(xc, WCM - xc, yc, HCM - yc), tau, 1, diff); n++; }
  mean = n ? mean / n : 0;
  for (let i = 0; i < SW; i += cell) for (let j = 0; j < SH; j += cell) {
    const xc = (i + cell / 2) / PX, yc = (j + cell / 2) / PX, d = Math.min(xc, WCM - xc, yc, HCM - yc);
    let h = heatAt(d, tau, 1, diff); h = lerp(h, mean + 0.08, mixU);
    og.fillStyle = css(heatCol(h)); og.fillRect(i, j, cell + 1, cell + 1);
  }
  g.save(); g.globalAlpha = a; g.drawImage(SLABC, 0, 0, SW, SH, SX, SY, SW, SH);
  for (let k = 1; k < 4; k++) line(SX, SY + SH * k / 4, SX + SW, SY + SH * k / 4, INKc, 0.3, 3);     // pasta sheets
  g.strokeStyle = css(INKc); g.lineWidth = 5; g.strokeRect(SX, SY, SW, SH); g.restore();
}
// bubbles at the rim (fixed seeds), strength b
function bubbles(t, b) {
  if (b <= 0.01) return;
  for (let i = 0; i < 26; i++) {
    const side = i % 4, u = hash(i, 3), ph = (hash(i, 4) + t * (0.8 + hash(i, 5))) % 1, r = 6 + 12 * ph;
    const [x, y] = side === 0 ? [SX + u * SW, SY + 14] : side === 1 ? [SX + u * SW, SY + SH - 14] : side === 2 ? [SX + 14, SY + u * SH] : [SX + SW - 14, SY + u * SH];
    g.save(); g.globalAlpha = b * (1 - ph); g.strokeStyle = css(HOT); g.lineWidth = 3; g.beginPath(); g.arc(x, y, r, 0, TAU2); g.stroke(); g.restore();
  }
}
// the fork and the cold bite lifted out of the middle (lift 0..1)
function bite(lift, a = 1, coldCol = COLD) {
  if (a <= 0.01) return;
  rrect(BITE.x, BITE.y, BITE.w, BITE.h, 18, BGc, a * clamp(lift * 4));                           // the hole it leaves
  const y = BITE.y - lift * 300, x = BITE.x;
  rrect(x, y, BITE.w, BITE.h, 18, coldCol, a, INKc, 5);
  for (let k = 1; k < 3; k++) line(x + 8, y + BITE.h * k / 3, x + BITE.w - 8, y + BITE.h * k / 3, INKc, a * 0.3, 3);
  // fork: handle up to the top right, four tines into the chunk
  const fx = x + BITE.w / 2, fy = y + 30;
  g.save(); g.globalAlpha = a; g.strokeStyle = css(QUIETc); g.lineCap = "round";
  g.lineWidth = 14; g.beginPath(); g.moveTo(fx, fy - 40); g.lineTo(fx + 90, fy - 230); g.stroke();
  g.lineWidth = 7; for (let k = -1.5; k <= 1.5; k++) { g.beginPath(); g.moveTo(fx + k * 16, fy + 50); g.lineTo(fx + k * 16, fy - 40); g.stroke(); }
  g.lineWidth = 9; g.beginPath(); g.moveTo(fx - 26, fy - 40); g.lineTo(fx + 26, fy - 40); g.stroke(); g.restore();
}
// incoming wave arrows from the four sides; their wiggle fades as they go in (delta ≈ 1 cm)
function waves(t, a) {
  if (a <= 0.01) return;
  const segs = [[SX + SW * 0.3, SY - 150, 0, 1], [SX + SW * 0.7, SY - 150, 0, 1], [SX + SW * 0.5, SY + SH + 150, 0, -1], [SX - 150, SY + SH / 2, 1, 0], [SX + SW + 150, SY + SH / 2, -1, 0]];
  segs.forEach(([x0, y0, dx, dy], k) => {
    const L = 150 + 2.4 * PX, pts = [];
    for (let s = 0; s <= L; s += 5) { const inside = Math.max(0, s - 150) / PX, amp = 26 * Math.exp(-inside / 1.0), w = amp * Math.sin(s / 22 - t * 6 + k); pts.push([x0 + dx * s - dy * w, y0 + dy * s + dx * w]); }
    poly(pts, GOLDc, a, 6);
  });
}
const MAS = (T, o = {}) => mascot3(o.x ?? 160, o.y ?? 1560, o.s ?? 0.44, T, o);
const SCENES = {};

// 1 — hook: first frame = the cold bite lifted out; then the 3:00 replay with bubbling edges
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const replay = seg(t, B(1) - 0.2, B(1) + 0.3), tau = 0.55 * seg(t, B(1) + 0.3, B(1) + 3.6);
  const lift = t < B(1) ? 1 : seg(t, B(1) + 4.0, B(1) + 5.2);
  slab(t < B(1) ? 0.55 : tau, 1);
  bubbles(t, seg(t, B(1) + 1.5, B(1) + 2.5));
  bite(lift, 1);
  const tm = 180 * (1 - seg(t, B(1) + 0.3, B(1) + 3.6));
  text(`${Math.floor(tm / 60)}:${String(Math.floor(tm % 60)).padStart(2, "0")}`, 640, 1320, 96, INK, "center", 800, replay * (1 - seg(t, B(1) + 4.0, B(1) + 4.4)));
  plate("hot edges", 640, 1320, 50, CORAL, "center", seg(t, B(1) + 4.2, B(1) + 4.6));
  plate("a bite: cold middle", 760, BITE.y - 300 * lift + 70, 46, BLUE, "center", lift * (t < B(1) ? seg(t, 0.6, 1.0) : seg(t, B(1) + 4.6, B(1) + 5.0)));
  MAS(T, { look: [0.8, -0.6], mouth: lift > 0.6 ? "wince" : "o" });
};

// 2 — myth: "inside out?" ✕; microwaves come in from every side and shake the water at the rim
SCENES.myth = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const tau = 0.12 * seg(t, B(1), dur);
  slab(tau, 1);
  const card = win(t, 0.1, B(1) + 0.4, 0.3), x = seg(t, 1.2, 1.5);
  plate("INSIDE OUT?", 540, 470, 80, INK, "center", card, 800);
  if (x > 0.01) { line(300, 410, 780, 530, CORALc, x * card, 16); line(780, 410, 300, 530, CORALc, x * card, 16); }
  waves(t, seg(t, B(1) - 0.2, B(1) + 0.5));
  plate("microwaves", 540, 470, 56, GOLD, "center", win(t, B(1) + 0.2, B(1) + 1.6, 0.3), 800);
  // close-up circle on the top rim: water molecules turning back and forth
  const cu = seg(t, B(1) + 1.6, B(1) + 2.3), cx = SX + 230, cy = 1360;
  if (cu > 0.01) {
    line(cx, SY + 10, cx, cy - 125, INKc, cu * 0.6, 3, [10, 10]);
    g.save(); g.globalAlpha = cu; g.beginPath(); g.arc(cx, cy, 125, 0, TAU2); g.fillStyle = css(PANELc); g.fill(); g.strokeStyle = css(INKc); g.lineWidth = 4; g.stroke(); g.clip();
    for (let i = 0; i < 7; i++) { const mx = cx - 95 + (i % 4) * 62 + (i > 3 ? 31 : 0), my = cy - 45 + (i > 3 ? 90 : 0) + 6 * Math.sin(t * 5 + i);
      const th = 0.9 * Math.sin(t * 7 - 0.6 + hash(i, 2) * 2), cxx = mx, sc = 0.75;
      g.save(); g.translate(cxx, my); g.rotate(th); g.scale(sc, sc);
      const hx = 34 * Math.cos(0.91), hy = 34 * Math.sin(0.91);
      [[hx, hy], [hx, -hy]].forEach(([u, v]) => { g.strokeStyle = css(INKc); g.lineWidth = 8; g.beginPath(); g.moveTo(0, 0); g.lineTo(u, v); g.stroke(); dot(u, v, 14, INKc, 1); });
      dot(0, 0, 24, BLUEc, 1); g.restore(); }
    g.restore();
    plate("water, shaken", cx + 145, cy, 44, BLUE, "left", cu);
  }
  MAS(T, { look: [0.8, -0.4], mouth: t < B(1) ? "o" : "smile", a: 1 - seg(t, B(1) + 1.4, B(1) + 1.8) });
};

// 3 — depth: power falls off as e^(−z/δ): most is gone 1–2 cm in; only a thin shell heats
SCENES.depth = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const tau = lerp(0.18, 0.5, seg(t, 0, dur));
  slab(tau, 1, { diff: 0.25 });
  waves(t + 3, 0.6 * (1 - seg(t, B(1), B(1) + 0.6)));
  // power curve along the left of the slab, from the top surface down (bar length ∝ power)
  const pc = seg(t, 0.2, 1.4);
  for (let k = 0; k < 22; k++) {
    const z = k * 0.17, y = SY + z * PX, p = Math.exp(-z / 1.0), sh = clamp(pc * 22 - k);
    if (sh > 0) line(SX - 18, y, SX - 18 - 150 * p, y, GOLDc, sh * 0.95, 9);
  }
  text("power", SX - 100, SY - 40, 40, GOLD, "center", 700, pc);
  // bracket: the outer 1–2 cm
  const br = seg(t, 1.6, 2.2);
  line(SX + SW - 40, SY, SX + SW - 40, SY + 2 * PX, INKc, br, 5); line(SX + SW - 60, SY, SX + SW - 20, SY, INKc, br, 5); line(SX + SW - 60, SY + 2 * PX, SX + SW - 20, SY + 2 * PX, INKc, br, 5);
  plate("1–2 cm", SX + SW - 150, SY + PX, 54, INK, "center", br, 800);
  // the shell outline
  const sl = seg(t, B(1), B(1) + 0.6), m = 1.3 * PX;
  if (sl > 0.01) { g.save(); g.globalAlpha = sl; g.strokeStyle = css(GOLDc); g.lineWidth = 5; g.setLineDash([16, 12]); g.strokeRect(SX + m, SY + m, SW - 2 * m, SH - 2 * m); g.restore(); }
  plate("only a thin layer heats", 620, 1330, 56, CORAL, "center", sl, 800);
  plate("most power gone", 540, 470, 56, GOLD, "center", win(t, 1.0, B(1) - 0.1, 0.4), 800);
  MAS(T, { look: [0.8, -0.5], mouth: "o" });
};

// 4 — creep: heat creeps in slowly (many minutes); then a spoon stirs it and the colours even out
SCENES.creep = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const tau = lerp(0.3, 0.75, seg(t, 0.3, B(1))), mixU = 0.75 * seg(t, B(1) + 0.6, B(1) + 2.6);
  slab(tau, 1, { diff: lerp(0.25, 1.2, seg(t, 0.3, B(1))), mixU });
  // arrows creeping inward
  const cr = win(t, 0.4, B(1), 0.5), r = 1.2 * PX + 1.0 * PX * seg(t, 0.4, B(1));
  [[0, 1], [0, -1], [1, 0], [-1, 0]].forEach(([dx, dy]) => { const cx = SX + SW / 2, cy = SY + SH / 2;
    const x0 = dx ? (dx > 0 ? SX : SX + SW) : cx, y0 = dy ? (dy > 0 ? SY : SY + SH) : cy;
    arrow(x0 + dx * 40, y0 + dy * 40, x0 + dx * r, y0 + dy * r, CORALc, cr, 8, 24); });
  // a clock face: many minutes
  const ck = win(t, 0.6, B(1), 0.4), cx = 660, cy = 1330, an = t * 2.4;
  if (ck > 0.01) { g.save(); g.globalAlpha = ck; g.beginPath(); g.arc(cx - 200, cy, 70, 0, TAU2); g.fillStyle = css(PANELc); g.fill(); g.strokeStyle = css(INKc); g.lineWidth = 5; g.stroke(); g.restore();
    line(cx - 200, cy, cx - 200 + 52 * Math.sin(an), cy - 52 * Math.cos(an), GOLDc, ck, 6); line(cx - 200, cy, cx - 200 + 34 * Math.sin(an / 12), cy - 34 * Math.cos(an / 12), INKc, ck, 6);
    plate("many minutes", cx + 80, cy, 54, INK, "center", ck, 800); }
  // the spoon stirring through the middle
  const sp = win(t, B(1) + 0.2, dur - 0.1, 0.4);
  if (sp > 0.01) { const a = (t - B(1)) * 3.2, x = SX + SW / 2 + 180 * Math.cos(a), y = SY + SH / 2 + 110 * Math.sin(a);
    g.save(); g.globalAlpha = sp; g.strokeStyle = css(QUIETc); g.lineCap = "round"; g.lineWidth = 16; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 140, y - 380); g.stroke();
    g.fillStyle = css(QUIETc); g.beginPath(); g.ellipse(x, y, 34, 50, -0.35, 0, TAU2); g.fill(); g.restore();
    plate("stir it · let it stand", 620, 1330, 56, GOLD, "center", seg(t, B(1) + 0.4, B(1) + 0.9), 800); }
  MAS(T, { look: [0.8, -0.4], mouth: t > B(1) + 1 ? "smile" : "o" });
};

// 5 — end: skip that, and you're back at the cold bite (loops to the first frame)
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  slab(0.55, 1); bubbles(t, 0.5);
  bite(seg(t, 0.3, 1.6), 1);
  plate("cold middle", 800, BITE.y - 300 * seg(t, 0.3, 1.6) + 70, 50, BLUE, "center", seg(t, 1.4, 1.8));
  MAS(T, { look: [0.8, -0.6], mouth: t > 1.2 ? "wince" : "o" });
};
