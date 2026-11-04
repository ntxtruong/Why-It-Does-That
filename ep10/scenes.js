// ---- from ep04/scenes.js (unchanged): OV traffic model, car, ring, jam finder, chain precompute ----
const CARLEN = 4.0;
function simulate({ N = 22, L = 230, a = 2.35, Vmax = 16.7, w = 3.5, Tsim = 900, pert = 0.2, avOn = -1, noise = 0 }) {
  const hc = L / N - CARLEN, th = Math.tanh(hc / w);
  const V = h => Vmax * (Math.tanh((h - CARLEN - hc) / w) + th) / (1 + th);
  const dt = 0.01, every = 10, steps = Math.round(Tsim / dt);
  const x = new Float64Array(N), v = new Float64Array(N), acc = new Float64Array(N);
  for (let i = 0; i < N; i++) { x[i] = i * L / N; v[i] = V(L / N); }
  x[1] += pert;
  const P = [], S = [], A = [], hist = []; let histSum = 0;
  for (let k = 0; k <= steps; k++) {
    const t = k * dt;
    if (k % every === 0) { P.push(Float32Array.from(x)); S.push(Float32Array.from(v)); A.push(Float32Array.from(acc)); }
    for (let i = 0; i < N; i++) {
      const hd = ((x[(i + 1) % N] - x[i]) % L + L) % L;
      acc[i] = a * (V(hd) - v[i]);
      if (noise) acc[i] += noise * (hash(i, Math.floor(t * 0.7)) - 0.5);
    }
    hist.push(v[0]); histSum += v[0]; if (hist.length > 3000) histSum -= hist.shift();
    if (avOn >= 0 && t >= avOn) {               // one automated car: hold the average speed, let the gap breathe
      const U = histSum / hist.length, hd0 = ((x[1] - x[0]) % L + L) % L;
      acc[0] = 0.6 * (U - v[0]); if (hd0 < CARLEN + 4) acc[0] = Math.min(acc[0], -3);
    }
    for (let i = 0; i < N; i++) { v[i] = Math.max(0, v[i] + acc[i] * dt); x[i] = (x[i] + v[i] * dt) % L; }
  }
  return { N, L, P, S, A, v0: V(L / N) };
}
const RING = simulate({ Tsim: 420 });                                       // Sugiyama: 22 cars, 230 m
function carAt(sim, s, i) {        // position (m) and speed at sim time s, interpolated
  s = clamp(s, 0, (sim.P.length - 1) / 10 - 0.001); const k = Math.floor(s * 10), u = s * 10 - k;
  let x0 = sim.P[k][i], x1 = sim.P[k + 1][i]; if (x1 < x0 - sim.L / 2) x1 += sim.L;
  return { x: (x0 + (x1 - x0) * u) % sim.L, v: lerp(sim.S[k][i], sim.S[k + 1][i], u), a: lerp(sim.A[k][i], sim.A[k + 1][i], u) };
}
// colour by speed: stopped → coral, cruising → blue
const speedCol = (v, v0) => mix(CORALc, BLUEc, ss(v / (v0 * 0.9)));

// a car seen from above, centred at (x, y), heading angle an, length len px
function car(x, y, an, len, col, o = {}) {
  const wd = len * 0.48, a = o.a ?? 1; if (a <= 0.01) return;
  g.save(); g.translate(x, y); g.rotate(an); g.globalAlpha = a;
  g.fillStyle = css(col); g.beginPath(); g.roundRect(-len / 2, -wd / 2, len, wd, wd * 0.38); g.fill();
  g.fillStyle = "rgba(24,38,79,0.55)"; g.beginPath(); g.roundRect(-len * 0.12, -wd * 0.36, len * 0.34, wd * 0.72, wd * 0.18); g.fill();   // windscreen/roof
  if (o.brake > 0.05) { g.fillStyle = css(CORALc, clamp(o.brake) * a); g.beginPath(); g.arc(-len / 2 + 2, -wd * 0.3, wd * 0.16, 0, TAU2); g.arc(-len / 2 + 2, wd * 0.3, wd * 0.16, 0, TAU2); g.fill(); }
  if (o.ring) { g.strokeStyle = css(GOLDc); g.lineWidth = 4; g.beginPath(); g.roundRect(-len / 2 - 6, -wd / 2 - 6, len + 12, wd + 12, wd * 0.5); g.stroke(); }
  g.restore();
}
// ring road: centre (cx, cy), radius r px; x metres along a road of length L
function ringXY(cx, cy, r, x, L) { const an = -Math.PI / 2 + x / L * TAU2; return { x: cx + r * Math.cos(an), y: cy + r * Math.sin(an), an: an + Math.PI / 2 }; }
function ringRoad(cx, cy, r, laneW, a = 1, draw = 1) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a;
  g.strokeStyle = css(PANELc); g.lineWidth = laneW; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU2 * draw); g.stroke();
  g.strokeStyle = css(QUIETc, 0.5); g.lineWidth = 2; [-1, 1].forEach(sd => { g.beginPath(); g.arc(cx, cy, r + sd * laneW / 2, -Math.PI / 2, -Math.PI / 2 + TAU2 * draw); g.stroke(); });
  g.restore();
}
function drawRing(sim, s, cx, cy, r, o = {}) {
  ringRoad(cx, cy, r, o.laneW || 64, o.a ?? 1, o.draw ?? 1);
  const lenPx = CARLEN / sim.L * TAU2 * r * 1.3 * (o.cs || 1);
  for (let i = 0; i < sim.N; i++) {
    const c = carAt(sim, s, i), p = ringXY(cx, cy, r, c.x, sim.L);
    const gold = o.gold === i;
    car(p.x, p.y, p.an, lenPx, gold ? GOLDc : speedCol(c.v, sim.v0), { a: (o.carA ?? 1) * (o.drop ? clamp((o.drop - i * 0.08)) : 1), brake: -c.a / 2.5, ring: gold && o.goldRing });
  }
}
// the jam: centre of the cars slower than 30% of cruise, as an angle (null if none)
function jamCentre(sim, s) {
  let sx = 0, sy = 0, n = 0; for (let i = 0; i < sim.N; i++) { const c = carAt(sim, s, i); if (c.v < 0.3 * sim.v0) { const an = c.x / sim.L * TAU2; sx += Math.cos(an); sy += Math.sin(an); n++; } }
  return n ? { x: ((Math.atan2(sy, sx) / TAU2 * sim.L) % sim.L + sim.L) % sim.L, n } : null;
}

const CH = (() => {   // speed of follower n (m/s) vs time: lead dips gently, each follower 1 s later and 1.45× deeper
  const n = 10, v0 = 12, dt = 0.02, Tm = 60, out = [];
  for (let i = 0; i < n; i++) { const xs = [], vs = []; out.push({ xs, vs }); }
  for (let i = 0; i < n; i++) { let x = -i * 16; for (let k = 0; k <= Tm / dt; k++) { const t = k * dt, tc = t - 6 - i * 1.15, dip = Math.min(v0, 1.6 * Math.pow(1.45, i)) * Math.exp(-tc * tc / (2 * (1.1 + 0.25 * i) ** 2)); const v = Math.max(0, v0 - dip); out[i].vs.push(v); out[i].xs.push(x); x += v * dt; } }
  return { n, v0, dt, out };
})();
const chX = (i, s) => { const k = clamp(Math.floor(s / CH.dt), 0, CH.out[i].xs.length - 1); return { x: CH.out[i].xs[k], v: CH.out[i].vs[k], dv: CH.out[i].vs[Math.min(k + 1, CH.out[i].vs.length - 1)] - CH.out[i].vs[k] }; };

// ======================= Episode 10 (Short, 1080×1920) — Why do traffic jams appear from nowhere? =======================
// Vertical frame. Safe zone (Shorts UI): key content above y = 1536 and left of x = 940.
const MAS = (T, o = {}) => mascot3(o.x ?? 150, o.y ?? 1560, o.s ?? 0.4, T, o);
const RX = 540, RY = 840, RR = 360;
// a vertical road: cars head up; a queue from the bottom up to `front` (screen y); release = how far the front has started moving
function road(t, o = {}) {
  const x0 = 300, x1 = 780, lane = (x1 - x0) / 3;
  rrect(x0, -20, x1 - x0, H + 40, 0, PANELc, 1);
  for (let k = 1; k < 3; k++) for (let y = ((t * (o.scroll || 0)) % 120) - 120; y < H; y += 120) line(x0 + k * lane, y, x0 + k * lane, y + 60, QUIETc, 0.45, 4);
  line(x0, 0, x0, H, QUIETc, 0.7, 3); line(x1, 0, x1, H, QUIETc, 0.7, 3);
  const front = o.front ?? 900;
  for (let j = 0; j < 30; j++) {
    const ln = j % 3, idx = Math.floor(j / 3), yw = front + 60 + idx * 150 + ln * 40 + hash(j, 3) * 30;
    const mv = o.release ? Math.max(0, o.release - idx * 0.3) : 0, y = yw - mv * mv * 160;
    if (y < -100 || y > H + 100) continue;
    car(x0 + lane * (ln + 0.5), y + Math.sin(t * 1.4 + j) * 4, -Math.PI / 2, 104, mv > 0.3 ? BLUEc : CORALc, { brake: mv > 0.3 ? 0 : 0.8 });
  }
}
// crossed-out icon (crash, cone)
function crossed(x, y, s, a, kind) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
  rrect(-70, -70, 140, 140, 28, PANELc, 1, QUIETc, 4);
  g.strokeStyle = css(INKc); g.fillStyle = css(INKc); g.lineWidth = 8; g.lineCap = "round"; g.lineJoin = "round";
  if (kind === "crash") { g.beginPath(); g.moveTo(-40, 20); g.lineTo(-10, 0); g.lineTo(-30, -25); g.moveTo(40, 20); g.lineTo(10, 0); g.lineTo(30, -25); g.stroke(); }
  if (kind === "cone") { g.beginPath(); g.moveTo(-30, 40); g.lineTo(0, -45); g.lineTo(30, 40); g.closePath(); g.stroke(); line(-18, 5, 18, 5, INKc, 1, 8); }
  line(-62, -62, 62, 62, CORALc, 1, 12); g.restore();
}
// space-time strip (portrait): position across, time down; labels inside the safe zone
function strip(sim, s, x0, x1, y0, y1, span, a, gold) {
  if (a <= 0.01) return; rrect(x0 - 20, y0 - 20, x1 - x0 + 40, y1 - y0 + 40, 18, PANELc, a * 0.9);
  for (let i = 0; i < sim.N; i++) for (let k = 0; k <= 70; k++) {
    const st = s - span * k / 70; if (st < 0) break; const c = carAt(sim, st, i);
    dot(x0 + c.x / sim.L * (x1 - x0), y0 + (y1 - y0) * k / 70, i === gold ? 5 : 3.6, i === gold ? GOLDc : speedCol(c.v, sim.v0), a * (1 - 0.45 * k / 70));
  }
  text("time ↓", x0, y1 + 60, 38, QUIET, "left", 600, a); text("position on the ring →", x1, y1 + 60, 38, QUIET, "right", 600, a);
}
const SCENES = {};

// 1 — hook: first frame = a queue of stopped cars, empty road ahead; no crash, no cones
SCENES.hook = (t, T, B, E, dur) => {
  clear();
  road(t, { front: 860 });
  const a = seg(t, B(1), B(1) + 0.4);
  crossed(160, 560, 1.15, a * spring(t, B(1)), "crash"); crossed(900, 560, 1.15, a * spring(t, B(1) + 0.8), "cone");
  plate("nothing up ahead", 540, 700, 52, INK, "center", seg(t, B(1) + 1.6, B(1) + 2.0), 800);
  text("no crash", 160, 670, 36, QUIET, "center", 700, a * spring(t, B(1))); text("no roadworks", 860, 670, 36, QUIET, "center", 700, a * spring(t, B(1) + 0.8));
  const k = seg(t, dur - 0.9, dur); if (k > 0) { g.globalAlpha = k; g.fillStyle = BG; g.fillRect(0, 0, W, H); g.globalAlpha = 1; }
  MAS(T, { look: [0.8, -0.6], mouth: t > B(1) ? "o" : "wince" });
};

// 2 — the ring: 22 cars at ~30 km/h on a 230 m circle; within minutes a knot appears
const ringS = t => Math.max(0, (t - 0.3) * 2.6);
SCENES.ring = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const s = ringS(t);
  ringRoad(RX, RY, RR, 60, seg(t, 0, 0.6), seg(t, 0, 1.2));
  drawRing(RING, s, RX, RY, RR, { laneW: 60, cs: 1.5, drop: (t - 0.6) * 1.4, carA: seg(t, 0.4, 1.0) });
  plate("2008 · Japan", RX, RY - 60, 60, GOLD, "center", win(t, 0.4, B(1), 0.4), 800);
  const m = win(t, 2.2, B(2) + 0.2, 0.5);
  if (m > 0) { g.save(); g.globalAlpha = m; g.strokeStyle = css(GOLDc); g.lineWidth = 5; g.setLineDash([2, 14]); g.lineCap = "round"; g.beginPath(); g.arc(RX, RY, RR + 50, -Math.PI / 2, -Math.PI / 2 + TAU2 * seg(t, 3.2, 5.2)); g.stroke(); g.restore(); }
  plate("22 cars", RX, RY + 20, 56, INK, "center", win(t, 1.6, B(2) - 0.2, 0.4));
  plate("230 m around", RX, RY + 110, 50, GOLD, "center", win(t, 4.0, B(2) - 0.2, 0.4));
  plate("≈ 30 km/h", RX, RY - 90, 54, BLUE, "center", win(t, B(1), B(2) - 0.2, 0.4));
  plate("crowded but clear", RX, RY - 180, 46, QUIET, "center", win(t, B(1) + 2.6, B(2) - 0.2, 0.4));
  const j = jamCentre(RING, s);
  if (j && t > B(2) - 0.6) { const p = ringXY(RX, RY, RR, j.x, RING.L), a = seg(t, B(2) - 0.4, B(2) + 0.6);
    g.save(); g.globalAlpha = a; g.strokeStyle = css(CORALc); g.lineWidth = 6; g.beginPath(); g.arc(p.x, p.y, 110 + 8 * Math.sin(t * 3), 0, TAU2); g.stroke(); g.restore();
    plate("a jam, from nothing", RX, RY, 56, CORAL, "center", a, 800); }
  MAS(T, { look: t > B(2) ? [0.8, -0.5] : [0.7, -0.3], mouth: t > B(2) ? "o" : "smile", hop: t > B(2) && t < B(2) + 1 ? 0.5 : 0 });
};

// 3 — the chain: a column of cars heading up; each reacts ~1 s late and brakes a little harder
SCENES.chain = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const s = clamp(5 + t * 1.35, 0, 59), sc = 17, x = 450;
  const iF = clamp((s - 5.5) / 1.15, 0, 9), i0 = Math.floor(iF), uF = iF - i0;
  const yF = lerp(chX(i0, s).x, chX(Math.min(9, i0 + 1), s).x, uF), sy = lerp(560, 760, seg(t, 0, dur));     // camera follows the slowdown backwards
  rrect(x - 90, -20, 180, H + 40, 0, PANELc, 1);
  for (let y = -((yF * sc) % 140 + 140) % 140; y < H; y += 140) { line(x - 90, y, x - 90, y + 70, QUIETc, 0.5, 3); line(x + 90, y, x + 90, y + 70, QUIETc, 0.5, 3); }
  for (let i = 0; i < CH.n; i++) {
    const c = chX(i, s), py = sy - (c.x - yF) * sc; if (py < -150 || py > SAFE + 100) continue;
    const brake = c.dv < -0.001 ? clamp(-c.dv / CH.dt / 2.5) : 0;
    car(x, py, -Math.PI / 2, CARLEN * sc * 1.5, i === 0 ? GOLDc : speedCol(c.v, CH.v0), { brake });
    const dip = (CH.v0 - c.v) / CH.v0; if (dip > 0.02) rrect(x + 140, py - 30, dip * 300, 30, 10, CORALc, 0.95);   // how hard it brakes
  }
  plate("how hard each brakes →", 540, 400, 44, CORAL, "center", seg(t, 1.0, 1.5));
  const ca = win(t, 1.6, B(1), 0.4); if (ca > 0) { const u = ((t - 1.6) % 1.4) / 1.4; g.save(); g.globalAlpha = ca; g.strokeStyle = css(GOLDc); g.lineWidth = 10; g.beginPath(); g.arc(790, 1250, 54, -Math.PI / 2, -Math.PI / 2 + TAU2 * u); g.stroke(); g.restore(); text("late", 790, 1250, 40, GOLD, "center", 800, ca); }
  plate("a bit harder each time", 540, 1400, 52, CORAL, "center", seg(t, B(1), B(1) + 0.4), 800);
  MAS(T, { x: 150, look: [0.8, -0.6], mouth: s > 10 ? "o" : "smile" });
};

// 4 — the wave: cars go forward, the knot slides backwards (~20 km/h); then back to the queue with nothing ahead
const waveS = t => 160 + t;
SCENES.wave = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const s = waveS(t), gold = 7, back = seg(t, B(1) - 0.5, B(1) + 0.3);
  if (back < 1) {
    const a = 1 - back, j = jamCentre(RING, s);
    const rot = j ? -(j.x / RING.L) * TAU2 : 0;     // follow the jam, not the cars: keep it at the top
    g.save(); g.globalAlpha = a; g.translate(RX, 640); g.rotate(rot); g.translate(-RX, -640);
    drawRing(RING, s, RX, 640, 270, { laneW: 48, cs: 1.5, gold, goldRing: true, a, carA: a });
    g.restore();
    text("cars: forward →", 120, 250 + 120, 44, BLUE, "left", 700, a * win(t, 0.6, B(1), 0.4));
    text("← jam: backward", 960, 250 + 120, 44, CORAL, "right", 700, a * win(t, 1.8, B(1), 0.4));
    strip(RING, s, 340, 910, 1040, 1420, 60, a * seg(t, 2.6, 3.4), gold);
    const m = a * win(t, 4.2, B(1), 0.5);
    arrow(860, 1080, 420, 1380, CORAL, m, 8, 30); plate("≈ 20 km/h backwards", 540, 960, 50, CORAL, "center", m, 800);
  }
  if (back > 0) {
    g.globalAlpha = back; road(t, { front: 860, release: Math.max(0, t - B(1)) * 1.1, scroll: 0 }); g.globalAlpha = 1;
    plate("…and nothing there", 540, 700, 52, INK, "center", back * seg(t, B(1) + 1.2, B(1) + 1.6), 800);
  }
  MAS(T, { look: [0.8, -0.5], mouth: back > 0.5 ? "smile" : "o" });
};
