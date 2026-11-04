// Episode 12 (Short, 1080×1920) — Why does ice float?
// Two glasses (a generic solid sinks in its own melt; ice floats 91.7 % submerged), then the molecules:
// liquid = a jumble that wanders in closed form (sums of sines with seeded phases), hydrogen bonds flicker on and off;
// freezing = each molecule eases to a site of a honeycomb (ice Ih seen along its c-axis: three bonds in the screen,
// the fourth to the layer above/below), and the box it fills grows. Everything is a pure function of time.
// Safe zone (Shorts UI): key content above y = 1536 and left of x = 940.

const MAS = (T, o = {}) => mascot3(o.x ?? 150, o.y ?? 1560, o.s ?? 0.4, T, o);
const ICEc = [222, 238, 252], WATc = [92, 150, 225], MELTc = [120, 130, 160], SOLc = [150, 160, 190];

// ---------- glasses ----------
const GL = [{ x: 110, w: 360 }, { x: 590, w: 340 }], GY0 = 600, GY1 = 1240, SURF = 760;
function glass(k, liq, a = 1) {
  const G = GL[k]; g.save(); g.globalAlpha = a;
  g.fillStyle = css(liq, 0.55); g.fillRect(G.x, SURF, G.w, GY1 - SURF);
  line(G.x, SURF, G.x + G.w, SURF, INKc, 0.6, 3);
  g.strokeStyle = css(INKc); g.lineWidth = 6; g.lineJoin = "round"; g.beginPath(); g.moveTo(G.x, GY0); g.lineTo(G.x, GY1); g.lineTo(G.x + G.w, GY1); g.lineTo(G.x + G.w, GY0); g.stroke();
  g.restore();
}
// a block falling into glass k at time t0 (or resting if t0 < 0); float = submerged fraction (null = sinks)
function block(k, t, t0, size, col, sub, a = 1) {
  const G = GL[k], cx = G.x + G.w / 2, top0 = GY0 - 220;
  const rest = sub == null ? GY1 - size - 4 : SURF - size * (1 - sub);
  let y;
  if (t0 < 0 || t > t0 + 3) y = rest + (sub != null ? 6 * Math.sin(t * 2.2) : 0);
  else {
    const u = t - t0, fall = top0 + 0.5 * 2600 * u * u;                       // free fall until it meets the surface
    const hit = Math.sqrt(2 * (SURF - size - top0) / 2600);
    if (u < hit) y = fall;
    else if (sub == null) y = lerp(SURF - size, rest, eout((u - hit) / 1.4));     // sinks, slowed by the liquid
    else { const v = u - hit; y = rest + (SURF - size - rest) * Math.exp(-2.2 * v) * Math.cos(5 * v); }   // bobs, damped
  }
  rrect(cx - size / 2, y, size, size, size * 0.14, col, a, INKc, 4);
  if (sub != null) { line(cx - size * 0.3, y + size * 0.25, cx - size * 0.05, y + size * 0.12, INKc, a * 0.7, 6); }
  return y;
}

// ---------- molecules ----------
const PNL = { x: 100, y: 440, w: 830, h: 760 };
const HEXA = 78;                                   // honeycomb bond length (px)
const SITES = (() => {                             // honeycomb sites inside the panel, with their in-plane neighbours
  const s = [], dx = HEXA * Math.sqrt(3), cx = PNL.x + PNL.w / 2, cy = PNL.y + PNL.h / 2;
  for (let r = -6; r <= 6; r++) for (let c = -4; c <= 4; c++) {
    const x0 = cx + c * dx + (r & 1 ? dx / 2 : 0), y0 = cy + r * HEXA * 1.5;
    [[x0, y0 - HEXA / 2], [x0, y0 + HEXA / 2]].forEach(([x, y], k) => { if (x > PNL.x + 50 && x < PNL.x + PNL.w - 50 && y > PNL.y + 50 && y < PNL.y + PNL.h - 50) s.push({ x, y, up: k }); });
  }
  s.forEach(p => { p.nb = []; s.forEach((q, j) => { const d = Math.hypot(p.x - q.x, p.y - q.y); if (d > 1 && d < HEXA * 1.05) p.nb.push(j); }); });
  return s;
})();
const NM = SITES.length;
const LQ = 0.958;                                  // liquid box scale: area 1/1.09 of the ice box (9 % less room)
// liquid position of molecule i at time t: compact, wandering
function liqPos(i, t) {
  const p = SITES[i], cx = PNL.x + PNL.w / 2, cy = PNL.y + PNL.h / 2;
  const bx = cx + (p.x - cx) * LQ + (hash(i, 1) - 0.5) * 46, by = cy + (p.y - cy) * LQ + (hash(i, 2) - 0.5) * 46;
  return [bx + 18 * Math.sin(t * (1.3 + hash(i, 3)) + 6 * hash(i, 4)) + 9 * Math.sin(t * 2.9 + 5 * hash(i, 5)),
          by + 18 * Math.cos(t * (1.1 + hash(i, 6)) + 6 * hash(i, 7)) + 9 * Math.cos(t * 3.3 + 5 * hash(i, 8))];
}
// a water molecule: O (blue) with two H (ink); th = direction of the bisector of the two O–H arms
function mol(x, y, s, th, a = 1, open = 0.91) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(th); g.scale(s, s);
  [[Math.cos(open), Math.sin(open)], [Math.cos(open), -Math.sin(open)]].forEach(([u, v]) => { g.strokeStyle = css(INKc); g.lineWidth = 8; g.beginPath(); g.moveTo(0, 0); g.lineTo(34 * u, 34 * v); g.stroke(); dot(34 * u, 34 * v, 13, INKc, 1); });
  dot(0, 0, 23, BLUEc, 1); g.restore();
}
// draw all molecules; fr = freezing progress 0..1; bonds shown with alpha ba
function molecules(t, fr, ba = 1, a = 1, o = {}) {
  const P = [];
  for (let i = 0; i < NM; i++) { const [lx, ly] = liqPos(i, t), p = SITES[i], u = eio(clamp(fr * 1.25 - hash(i, 9) * 0.25)); P.push([lerp(lx, p.x, u), lerp(ly, p.y, u), u]); }
  // bonds: in the liquid, short-lived links between close pairs; in ice, the fixed honeycomb links
  g.save(); g.globalAlpha = a * ba; g.strokeStyle = css(GOLDc); g.lineWidth = 4; g.setLineDash([7, 9]); g.lineCap = "round";
  for (let i = 0; i < NM; i++) for (let j = i + 1; j < NM; j++) {
    const d = Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]), isNb = SITES[i].nb.includes(j), u = Math.min(P[i][2], P[j][2]);
    const liqOn = d < 98 && hash(i * 97 + j, Math.floor(t * 2.5 + hash(i, j) * 3)) > 0.45;
    const on = u > 0.95 ? isNb : (liqOn && u < 0.5) || (isNb && u > 0.5);
    if (on) { g.beginPath(); g.moveTo(P[i][0], P[i][1]); g.lineTo(P[j][0], P[j][1]); g.stroke(); }
  }
  g.restore();
  // the fourth bond, to the layer above/below the screen (ice only): a short stub with a ring
  if (fr > 0.6) for (let i = 0; i < NM; i++) { const s = SITES[i], aa = a * ba * seg(fr, 0.8, 1); line(P[i][0], P[i][1], P[i][0] + 16, P[i][1] + (s.up ? -16 : 16), GOLDc, aa * 0.8, 4); }
  for (let i = 0; i < NM; i++) {
    const s = SITES[i], u = P[i][2];
    // in ice the two H point along two of the in-plane bonds; in the liquid they tumble
    let thI = 0; if (s.nb.length >= 2) { const n1 = SITES[s.nb[0]], n2 = SITES[s.nb[1]]; const a1 = Math.atan2(n1.y - s.y, n1.x - s.x), a2 = Math.atan2(n2.y - s.y, n2.x - s.x); thI = Math.atan2(Math.sin(a1) + Math.sin(a2), Math.cos(a1) + Math.cos(a2)); }
    const thL = TAU2 * hash(i, 11) + 0.9 * Math.sin(t * (1.5 + hash(i, 12)) + 4 * hash(i, 13));
    mol(P[i][0], P[i][1], o.s || 0.75, lerp(thL, thI, u), a, lerp(0.91, 0.95, u));
  }
  return P;
}
// the "room" box around the molecules: scale 1 = ice
function roomBox(scale, a, col = QUIETc) {
  if (a <= 0.01) return; const cx = PNL.x + PNL.w / 2, cy = PNL.y + PNL.h / 2, w = (PNL.w - 40) * scale, h = (PNL.h - 40) * scale;
  g.save(); g.globalAlpha = a; g.strokeStyle = css(col); g.lineWidth = 5; g.setLineDash([16, 12]); g.strokeRect(cx - w / 2, cy - h / 2, w, h); g.restore();
}
const SCENES = {};

// 1 — hook: first frame = a solid lying at the bottom of its melt, and ice floating; then both drop in again
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const drop = B(1) + 0.4;
  glass(0, MELTc); glass(1, WATc);
  block(0, t, t < drop ? -1 : drop, 150, SOLc, null);
  block(1, t, t < drop ? -1 : drop + 0.5, 160, ICEc, 0.917);
  plate("most solids: sink", GL[0].x + GL[0].w / 2, 520, 46, QUIET, "center", seg(t, B(1), B(1) + 0.4), 800);
  plate("ice: floats", GL[1].x + GL[1].w / 2, 520, 46, BLUE, "center", seg(t, B(1) + 1.2, B(1) + 1.6), 800);
  MAS(T, { look: [0.8, -0.5], mouth: t > drop + 1 ? "o" : "smile" });
};

// 2 — liquid: V-shaped molecules, hydrogen bonds that break and re-form; they crowd close
SCENES.liquid = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  rrect(PNL.x, PNL.y, PNL.w, PNL.h, 30, PANELc, 0.7);
  const z = lerp(2.0, 1, eio((t - B(1) + 0.6) / 1.4)), cx = PNL.x + PNL.w / 2, cy = PNL.y + PNL.h / 2;
  g.save(); g.beginPath(); g.roundRect(PNL.x, PNL.y, PNL.w, PNL.h, 30); g.clip();
  g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  molecules(t, 0, seg(t, 1.6, 2.4));
  g.restore();
  roomBox(LQ, seg(t, B(1) + 2.0, B(1) + 2.8));
  plate("water: a tiny V", 515, 1270, 50, BLUE, "center", win(t, 0.4, 2.6, 0.3), 800);
  plate("gold dashes: hydrogen bonds", 560, 1270, 48, GOLD, "center", win(t, 2.6, B(1), 0.3), 800);
  plate("bonds break and re-form", 560, 1270, 48, GOLD, "center", win(t, B(1) + 0.2, B(1) + 3.8, 0.3), 800);
  plate("crowded close", 560, 1270, 50, INK, "center", seg(t, B(1) + 4.0, B(1) + 4.4), 800);
  MAS(T, { look: [0.8, -0.6], mouth: "o" });
};

// 3 — ice: each molecule locks onto four neighbours in a six-sided pattern; more empty space; 9 % more room
SCENES.ice = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const fr = seg(t, 0.3, 4.2), grow = seg(t, B(1) + 1.6, B(1) + 3.2);
  rrect(PNL.x, PNL.y, PNL.w, PNL.h, 30, mix(PANELc, [40, 66, 120], fr), 0.7);
  g.save(); g.beginPath(); g.roundRect(PNL.x, PNL.y, PNL.w, PNL.h, 30); g.clip();
  // the empty middles of the hexagons glow once the pattern holds
  const hole = seg(t, B(1), B(1) + 0.8);
  if (hole > 0.01) SITES.forEach((p, i) => { if (!p.up) return; const q = [p.x, p.y - HEXA]; if (q[1] > PNL.y + 40) soft(q[0], q[1], 52, BLUEc, 0.35 * hole); });
  const P = molecules(t, fr, 1);
  // one molecule, its four neighbours counted
  const cnt = win(t, 4.4, B(1), 0.3), k = SITES.findIndex(p => Math.hypot(p.x - 515, p.y - 820) < 60);
  if (cnt > 0.01 && k >= 0) {
    const s = SITES[k]; g.save(); g.globalAlpha = cnt; g.strokeStyle = css(GOLDc); g.lineWidth = 5; g.beginPath(); g.arc(s.x, s.y, 46, 0, TAU2); g.stroke(); g.restore();
    s.nb.slice(0, 3).forEach((j, n) => { const q = SITES[j]; text(String(n + 1), q.x + 34, q.y - 34, 38, GOLD, "center", 800, cnt * seg(t, 4.6 + n * 0.3, 4.9 + n * 0.3)); });
    text("4", s.x + 40, s.y + (s.up ? -48 : 48), 38, GOLD, "center", 800, cnt * seg(t, 5.5, 5.8));
  }
  g.restore();
  roomBox(lerp(LQ, 1, grow), seg(t, B(1) + 1.2, B(1) + 1.8), GOLDc);
  plate("four neighbours · six-sided", 540, 1270, 48, GOLD, "center", win(t, 1.0, B(1), 0.3), 800);
  plate("more empty space", 540, 1270, 50, BLUE, "center", win(t, B(1), B(1) + 2.6, 0.3), 800);
  plate("+9% room → it floats", 560, 1270, 54, INK, "center", seg(t, B(1) + 2.8, B(1) + 3.2), 800);
  MAS(T, { look: [0.8, -0.6], mouth: t > B(1) + 3 ? "smile" : "o" });
};

// 4 — end: a lake freezes from the top; the ice shields the water below; back to the floating cube (loop)
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const back = seg(t, B(1) + 0.2, B(1) + 0.9);
  if (back < 1) {
    const a = 1 - back, top = 560, iceH = 70 * seg(t, 0.3, 2.0);
    g.save(); g.globalAlpha = a;
    const gr = g.createLinearGradient(0, top, 0, 1330); gr.addColorStop(0, css(WATc, 0.75)); gr.addColorStop(1, css([46, 80, 150], 0.9));
    g.fillStyle = gr; g.beginPath(); g.moveTo(60, top); g.lineTo(1020, top); g.lineTo(940, 1250); g.quadraticCurveTo(540, 1380, 140, 1250); g.closePath(); g.fill();
    if (iceH > 1) { g.fillStyle = css(ICEc, 0.95); g.fillRect(60, top - 6, 960, iceH); }
    g.restore();
    // fish, swimming slow loops under the ice
    for (let i = 0; i < 4; i++) { const ph = t * (0.35 + 0.1 * i) + i * 1.7, x = 540 + 300 * Math.sin(ph), y = 850 + i * 85 + 20 * Math.sin(ph * 2), dir = Math.cos(ph) > 0 ? 1 : -1;
      g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(dir, 1); g.fillStyle = css(GOLDc); g.beginPath(); g.ellipse(0, 0, 44, 20, 0, 0, TAU2); g.fill(); g.beginPath(); g.moveTo(-40, 0); g.lineTo(-70, -20); g.lineTo(-70, 20); g.closePath(); g.fill(); dot(22, -5, 4, BGc, 1); g.restore(); }
    plate("ice on top", 540, top - 70, 48, INK, "center", a * seg(t, 1.0, 1.4), 800);
    plate("liquid water below · ≈ 4 °C at the bottom", 540, 1190, 40, INK, "center", a * seg(t, 2.6, 3.0), 700);
  }
  if (back > 0) { g.globalAlpha = back; glass(0, MELTc); glass(1, WATc); block(0, t, -1, 150, SOLc, null); block(1, t, -1, 160, ICEc, 0.917); g.globalAlpha = 1;
    plate("a roomier pattern", 540, 520, 50, BLUE, "center", back * seg(t, B(1) + 1.0, B(1) + 1.4), 800); }
  MAS(T, { look: [0.8, -0.5], mouth: "smile" });
};
