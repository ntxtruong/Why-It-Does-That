// Episode 4 — Why do traffic jams appear out of nowhere?
// Scenes are pure functions fn(t, T, B, E, dur): t = time in scene, T = global time,
// B(i) / E(i) = start / end of narration beat i. Physics: optimal-velocity car-following model
// (Bando et al. 1995) integrated ONCE at load time with a fixed step and a fixed perturbation,
// so every frame is a lookup (seekable, deterministic).

// ---------- traffic simulation (precomputed) ----------
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
const RING = simulate({});                                       // Sugiyama: 22 cars, 230 m
const AZ = simulate({ N: 21, L: 260, avOn: 120, noise: 0.5 });  // Arizona: one automated car from 120 s
const SPARSE = simulate({ N: 9, L: 230, pert: 3 });              // long gaps: wobble fades
const DENSE = simulate({ N: 22, L: 230, pert: 3 });              // short gaps: wobble grows
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
// space-time strip: position across (x0..x1), time down (y0..y1), last `span` seconds up to s
function spaceTime(sim, s, x0, x1, y0, y1, span, a = 1, gold = -1) {
  if (a <= 0.01) return; rrect(x0 - 20, y0 - 20, x1 - x0 + 40, y1 - y0 + 40, 18, PANELc, a * 0.9);
  for (let i = 0; i < sim.N; i++) for (let k = 0; k <= 90; k++) {
    const st = s - span * k / 90; if (st < 0) break; const c = carAt(sim, st, i);
    dot(x0 + c.x / sim.L * (x1 - x0), y0 + (y1 - y0) * k / 90, i === gold ? 4.5 : 3.2, i === gold ? GOLDc : speedCol(c.v, sim.v0), a * (1 - 0.5 * k / 90));
  }
  text("now", x1 + 36, y0, 40, QUIET, "left", 600, a); text(`${span | 0} s earlier`, x1 + 36, y1, 40, QUIET, "left", 600, a);
  text("position on the ring →", (x0 + x1) / 2, y1 + 56, 40, QUIET, "center", 600, a);
}
// small mascot helper (feet above the caption band)
const MAS = (x, T, o = {}) => mascot(x, o.y ?? 900, o.s ?? 0.3, T, o);

// ---------- straight motorway used in the hook and the ending ----------
// a stretch of a 3-lane road; the middle lane holds a queue whose cars are spaced by speed
function motorway(t, camX, o = {}) {
  const y0 = 330, lane = 120;
  rrect(-20, y0 - 20, W + 40, lane * 3 + 40, 0, PANELc, 1);
  for (let k = 1; k < 3; k++) for (let x = -((camX * 1) % 120); x < W; x += 120) line(x, y0 + k * lane, x + 60, y0 + k * lane, QUIETc, 0.45, 4);
  line(0, y0, W, y0, QUIETc, 0.7, 3); line(0, y0 + 3 * lane, W, y0 + 3 * lane, QUIETc, 0.7, 3);
  // queue occupies world x in [0, 2600]; front at 2600; beyond the front the road is empty
  const front = 2600;
  for (let j = 0; j < 40; j++) {
    const lanei = j % 3, idx = Math.floor(j / 3), xw = front - 40 - idx * 190 - lanei * 55 - (hash(j, 3) * 40);
    const move = o.release ? Math.max(0, o.release - idx * 0.25) : 0;
    const xs = xw - camX + move * move * 140;
    if (xs < -100 || xs > W + 100) continue;
    const crawl = Math.sin(t * 1.4 + j) * 6;
    car(xs + crawl, y0 + lane * lanei + lane / 2, 0, 120, move > 0.3 ? BLUEc : CORALc, { brake: move > 0.3 ? 0 : 0.8 });
  }
  return { y0, lane, front: front - camX };
}
function crossed(x, y, s, a, kind) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
  rrect(-70, -70, 140, 140, 28, PANELc, 1, QUIETc, 4);
  g.strokeStyle = css(INKc); g.fillStyle = css(INKc); g.lineWidth = 8; g.lineCap = "round"; g.lineJoin = "round";
  if (kind === "crash") { g.beginPath(); g.moveTo(-40, 20); g.lineTo(-10, 0); g.lineTo(-30, -25); g.moveTo(40, 20); g.lineTo(10, 0); g.lineTo(30, -25); g.stroke(); g.beginPath(); g.moveTo(0, -40); g.lineTo(6, -18); g.lineTo(-6, -18); g.closePath(); g.fill(); }
  if (kind === "cone") { g.beginPath(); g.moveTo(-30, 40); g.lineTo(0, -45); g.lineTo(30, 40); g.closePath(); g.stroke(); line(-18, 5, 18, 5, INKc, 1, 8); }
  if (kind === "lane") { line(-30, -45, -30, 45, INKc, 1, 8); line(30, -45, 30, 45, INKc, 1, 8, [14, 14]); line(-10, 10, 25, -30, INKc, 1, 8); }
  g.restore(); g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); line(-62, -62, 62, 62, CORALc, 1, 12); g.restore();
}

const SCENES = {};

// 1 — hook: a queue on a motorway, the front is empty, the usual suspects, then a circle
SCENES.hook = (t, T, B, E, dur) => {
  clear(); const pan = eio((t - 3) / (B(2) + 2 - 3)) * 1900;
  const r = motorway(t, 1200 + pan, { release: Math.max(0, t - B(2) + 0.5) * 1.2 });
  if (t > B(2)) { // empty road ahead + crossed icons
    const a = win(t, B(2) + 0.6, B(4) - 0.2, 0.5);
    crossed(1150, 820, 1.1, a * spring(t, B(2) + 0.6), "crash"); crossed(1400, 820, 1.1, a * spring(t, B(2) + 1.1), "cone"); crossed(1650, 820, 1.1, a * spring(t, B(2) + 1.6), "lane");
  }
  // the usual suspects, then "not always"
  const tags = [["Slow driver?", 380], ["Someone merging?", 900], ["A crash ahead?", 1440]];
  tags.forEach(([s, x], i) => { const a = win(t, B(4) + i * 0.9, B(6) - 0.2, 0.4); plate(s, x, 250 - 20 * spring(t, B(4) + i * 0.9), 52, CORAL, "center", a); });
  // blank ground and the circle being drawn
  const k = seg(t, B(6) - 0.4, B(6) + 0.6);
  if (k > 0) { g.globalAlpha = k; g.fillStyle = BG; g.fillRect(0, 0, W, H); g.globalAlpha = 1; ringRoad(960, 520, 300, 64, k, seg(t, B(6) + 0.3, B(7) + 0.5)); plate("2008", 960, 520, 72, GOLD, "center", seg(t, B(6) + 0.8, B(6) + 1.4)); }
  MAS(170, T, { s: 0.26, look: t < B(2) ? [1, 0] : [0.6, -0.4], mouth: t > B(2) && t < B(4) ? "o" : "smile", a: 1 - k });
  if (t > B(7)) MAS(170, T, { s: 0.26, look: [1, -0.2], mouth: "o", a: seg(t, B(7), B(7) + 0.6) });
};

// 2 — the ring: 22 cars drop in, flow, then a knot appears
const ringS = t => Math.max(0, (t - 4) * 1.15);      // sim seconds shown in the ring scene
SCENES.ring = (t, T, B, E, dur) => {
  clear(); vignette();
  const s = ringS(t);
  drawRing(RING, s, 960, 500, 360, { drop: (t - B(1) + 0.3) * 1.2, carA: seg(t, B(1) - 0.4, B(1) + 0.4) });
  ringRoad(960, 500, 360, 64, 1 - seg(t, 0, 1), 1);
  // measurements
  const m1 = win(t, B(0) + 1, B(3), 0.5); if (m1 > 0) { g.save(); g.globalAlpha = m1; g.strokeStyle = css(GOLDc); g.lineWidth = 5; g.setLineDash([2, 14]); g.lineCap = "round"; g.beginPath(); g.arc(960, 500, 405, -Math.PI / 2, -Math.PI / 2 + TAU2 * seg(t, B(0) + 1, B(0) + 3)); g.stroke(); g.restore(); plate("230 m around", 1560, 230, 56, GOLD, "center", m1); }
  plate("22 cars", 1560, 340, 56, INK, "center", win(t, B(1) + 0.8, B(3), 0.5));
  plate("≈ 30 km/h", 1560, 450, 56, BLUE, "center", win(t, B(1) + 2.4, B(3), 0.5));
  ["no lights", "no junctions", "no slow lorry"].forEach((w, i) => plate(w, 360, 300 + i * 110, 48, QUIET, "center", win(t, B(2) + 0.8 + i * 1.1, B(4), 0.4)));
  // the knot
  const j = jamCentre(RING, s); if (j && t > B(5) - 1) { const p = ringXY(960, 500, 360, j.x, RING.L); const a = seg(t, B(5), B(5) + 1); g.save(); g.globalAlpha = a; g.strokeStyle = css(CORALc); g.lineWidth = 6; g.beginPath(); g.arc(p.x, p.y, 120 + 8 * Math.sin(t * 3), 0, TAU2); g.stroke(); g.restore(); }
  MAS(240, T, { s: 0.3, look: t > B(5) ? [0.8, -0.3] : [0.6, 0], mouth: t > B(5) ? "o" : "smile", hop: t > B(5) && t < B(5) + 1 ? 0.6 : 0 });
};

// 3 — a jam is a wave: follow the knot, unroll to a strip, then the space-time picture
const waveS = t => 160 + t;
SCENES.wave = (t, T, B, E, dur) => {
  clear(); vignette(); const s = waveS(t);
  const j = jamCentre(RING, s), gold = 7;
  const k = seg(t, B(3) - 0.5, B(3) + 1.2);                 // ring → strip
  const ka = seg(t, B(5) - 0.5, B(5) + 0.8);                // strip → space-time
  if (k < 1) {
    // rotate the view so the knot stays at the top: we follow the jam, not the cars
    const rot = j ? -(j.x / RING.L) * TAU2 * seg(t, B(0), B(0) + 1.2) : 0;
    g.save(); g.translate(960, 520); g.rotate(rot); g.translate(-960, -520);
    drawRing(RING, s, 960, 520, 360, { gold, goldRing: t > B(1), a: 1 - k, carA: 1 - k });
    g.restore();
    if (t > B(1) && t < B(3)) {
      text("cars: forward", 1480, 260, 48, BLUE, "left", 700, win(t, B(1), B(3), 0.4));
      text("jam: backward", 1480, 340, 48, CORAL, "left", 700, win(t, B(2), B(3), 0.4));
      arrow(1440, 260, 1360, 220, BLUE, win(t, B(1), B(3), 0.4)); arrow(1440, 340, 1360, 380, CORAL, win(t, B(2), B(3), 0.4));
    }
  }
  if (k > 0 && ka < 1) {
    // the ring unrolled into a straight lane, centred on the jam; cars move right, the knot drifts left
    const yl = 470, x0 = 120, x1 = 1800, a = k * (1 - ka);
    rrect(x0 - 30, yl - 50, x1 - x0 + 60, 100, 20, PANELc, a);
    const cx = j ? j.x : 0;
    for (let i = 0; i < RING.N; i++) {
      const c = carAt(RING, s, i); let d = c.x - (cx + 60); d = ((d % RING.L) + RING.L * 1.5) % RING.L - RING.L / 2;   // jam sits left of centre
      const px = 960 + d * 7.2; if (px < x0 || px > x1) continue;
      car(px, yl, 0, CARLEN * 7.2 * 1.25, i === gold ? GOLDc : speedCol(c.v, RING.v0), { a, brake: -c.a / 2.5, ring: i === gold });
    }
    text("the front is eaten away", 1240, 330, 46, BLUE, "center", 700, a * win(t, B(3) + 0.4, B(5), 0.4));
    text("the back keeps growing", 600, 620, 46, CORAL, "center", 700, a * win(t, B(4), B(5), 0.4));
  }
  if (ka > 0) {
    spaceTime(RING, s, 300, 1500, 170, 800, 60, ka, gold);
    const m = win(t, B(5) + 1.2, dur, 0.5);
    arrow(1150, 360, 760, 650, CORAL, m, 8, 30); plate("jam ≈ 20 km/h backwards", 1180, 300, 48, CORAL, "center", m);
    plate("close to motorway waves", 1180, 300 + 90, 44, INK, "center", win(t, B(6), dur, 0.5));
    // ripple analogy: concentric rings in a corner
    const ra = win(t, B(7), dur, 0.5); for (let q = 0; q < 3; q++) { const rr = ((t * 60 + q * 50) % 150); g.save(); g.globalAlpha = ra * (1 - rr / 150); g.strokeStyle = css(BLUEc); g.lineWidth = 4; g.beginPath(); g.arc(1700, 760, rr, 0, TAU2); g.stroke(); g.restore(); }
  }
  MAS(150, T, { s: 0.26, look: [0.6, -0.2], mouth: t > B(2) && t < B(3) ? "o" : "smile", a: 1 - 0.0 });
};

// 4 — the chain: a lane of cars seen close, each reacts ~1 s late and a bit harder
const CH = (() => {   // speed of follower n (m/s) vs time: lead dips gently, each follower 1 s later and 1.45× deeper
  const n = 10, v0 = 12, dt = 0.02, Tm = 60, out = [];
  for (let i = 0; i < n; i++) { const xs = [], vs = []; out.push({ xs, vs }); }
  for (let i = 0; i < n; i++) { let x = -i * 16; for (let k = 0; k <= Tm / dt; k++) { const t = k * dt, tc = t - 6 - i * 1.15, dip = Math.min(v0, 1.6 * Math.pow(1.45, i)) * Math.exp(-tc * tc / (2 * (1.1 + 0.25 * i) ** 2)); const v = Math.max(0, v0 - dip); out[i].vs.push(v); out[i].xs.push(x); x += v * dt; } }
  return { n, v0, dt, out };
})();
const chX = (i, s) => { const k = clamp(Math.floor(s / CH.dt), 0, CH.out[i].xs.length - 1); return { x: CH.out[i].xs[k], v: CH.out[i].vs[k], dv: CH.out[i].vs[Math.min(k + 1, CH.out[i].vs.length - 1)] - CH.out[i].vs[k] }; };
SCENES.chain = (t, T, B, E, dur) => {
  clear(); vignette();
  const s = clamp(6 + (t - B(1) - 2) * 10.35 / Math.max(4, B(8) + 1 - B(1) - 2), 0, 59), camV = CH.v0;     // camera rides along at cruise speed
  const zoomOut = seg(t, B(7) - 0.3, B(8) + 0.5), scale = lerp(22, 9.5, zoomOut), y = 520;
  rrect(-20, y - 70, W + 40, 140, 0, PANELc, 1);
  const iF = clamp((s - 5.5) / 1.15, 0, 9), i0 = Math.floor(iF), uF = iF - i0, xF = lerp(chX(i0, s).x, chX(Math.min(9, i0 + 1), s).x, uF);   // camera follows the slowdown backwards
  const xFocus = lerp(xF, chX(9, s).x, zoomOut), sx = lerp(1100, 170, zoomOut);
  for (let x = -((xFocus * scale) % 140 + 140) % 140; x < W; x += 140) { line(x, y - 70, x + 70, y - 70, QUIETc, 0.5, 3); line(x, y + 70, x + 70, y + 70, QUIETc, 0.5, 3); }

  for (let i = 0; i < CH.n; i++) {
    const c = chX(i, s), px = sx + (c.x - xFocus) * scale; if (px < -200 || px > W + 200) continue;
    const brake = c.dv < -0.001 ? clamp(-c.dv / CH.dt / 2.5) : 0;
    car(px, y, 0, CARLEN * scale * 0.95, i === 2 ? GOLDc : speedCol(c.v, CH.v0), { brake, ring: i === 2 && zoomOut < 0.5 });
    // brake pressure bar above each car
    const dip = (CH.v0 - c.v) / CH.v0; if (dip > 0.02) rrect(px - 6, y - 110 - dip * 140, 12, dip * 140, 6, CORALc, 0.9);
  }
  // 1-second reaction clock
  const ca = win(t, B(2), B(4), 0.4); if (ca > 0) { const u = ((t - B(2)) % 1.6) / 1.6; g.save(); g.globalAlpha = ca; g.strokeStyle = css(GOLDc); g.lineWidth = 10; g.beginPath(); g.arc(1500, 250, 60, -Math.PI / 2, -Math.PI / 2 + TAU2 * u); g.stroke(); g.restore(); text("~1 s", 1500, 250, 44, GOLD, "center", 800, ca); text("reaction time", 1500, 345, 40, QUIET, "center", 600, ca); }
  plate("a bit harder each time", 760, 220, 52, CORAL, "center", win(t, B(4), B(7), 0.4));
  plate("string unstable", 760, 220, 56, GOLD, "center", win(t, B(7) + 0.3, dur, 0.4));
  plate("full stop", 300, 760, 52, CORAL, "center", win(t, B(8) + 1.2, dur, 0.4));
  MAS(1780, T, { s: 0.28, y: 880, look: [-0.8, -0.2], mouth: s > 8 && s < 16 ? "o" : "smile" });
};

// 4b — the viewer's own city: a grid of lanes with brake-light waves rolling backwards
SCENES.angle = (t, T, B, E, dur) => {
  clear();
  for (let r = 0; r < 6; r++) {
    const y = 140 + r * 125; rrect(-20, y - 40, W + 40, 80, 0, PANELc, 0.9);
    for (let c = 0; c < 18; c++) {
      const x = ((c * 120 + t * 70 * (r % 2 ? 1 : -1) + r * 40) % (W + 240) + W + 240) % (W + 240) - 120;
      const wave = 0.5 + 0.5 * Math.sin((x / 160) + t * 2.2 * (r % 2 ? 1 : -1) + r);   // a stop-and-go wave running against the traffic
      car(x, y, r % 2 ? 0 : Math.PI, 90, mix(BLUEc, CORALc, ss(wave)), { brake: wave });
    }
  }
  plate("You were one link in the chain", 960, 120, 56, INK, "center", win(t, 0.4, dur, 0.5));
  plate("Nobody did anything wrong", 960, 840 - 40, 52, GOLD, "center", win(t, B(1), dur, 0.5));
};

// 5 — why only when crowded: two lanes, long gaps vs short gaps, then a density dial
SCENES.density = (t, T, B, E, dur) => {
  clear(); vignette();
  const split = 1 - seg(t, B(4) - 0.4, B(4) + 0.6), s = t * 1.4;
  if (split > 0) {
    [[SPARSE, 300, "long gaps: the wobble fades", BLUE], [DENSE, 620, "short gaps: the wobble grows", CORAL]].forEach(([sim, y, lab, col], q) => {
      const a = split * (q === 0 ? seg(t, B(1) + 0.5, B(2)) : seg(t, B(3) - 0.3, B(3) + 0.4));
      rrect(80, y - 50, 1760, 100, 20, PANELc, a);
      for (let i = 0; i < sim.N; i++) { const c = carAt(sim, s, i); car(80 + c.x / sim.L * 1760, y, 0, CARLEN / sim.L * 1760 * 1.25, speedCol(c.v, sim.v0), { a, brake: -c.a / 2.5 }); }
      text(lab, 120, y - 100, 46, col, "left", 700, a);
    });
    plate("If wobbles always grow, why does traffic flow?", 960, 110, 50, INK, "center", win(t, 0.3, B(1) + 0.4, 0.4));
  }
  const d = seg(t, B(4) - 0.2, B(4) + 0.8);
  if (d > 0) {
    // density axis 0..60 cars/km per lane; threshold at ~25
    const x0 = 260, x1 = 1660, y = 520, X = v => x0 + (x1 - x0) * v / 60;
    rrect(x0, y - 18, X(25) - x0, 36, 18, BLUEc, d * 0.85); rrect(X(25), y - 18, x1 - X(25), 36, 18, CORALc, d * 0.85);
    [0, 10, 20, 30, 40, 50, 60].forEach(v => text(String(v), X(v), y + 60, 40, QUIET, "center", 600, d));
    text("cars per km, per lane", 960, y + 120, 40, QUIET, "center", 600, d);
    text("smooth flow is stable", (x0 + X(25)) / 2, y - 80, 44, BLUE, "center", 700, d);
    text("smooth flow can't last", (X(25) + x1) / 2, y - 80, 44, CORAL, "center", 700, d);
    const needle = lerp(5, 25, seg(t, B(4) + 1, B(5) + 1)) + (t > B(6) + 2 ? 8 * seg(t, B(7), B(7) + 2) : 0);
    line(X(needle), y - 50, X(needle), y + 30, INK, d, 8);
    plate("≈ 25 cars / km", X(25), y - 190, 52, GOLD, "center", win(t, B(5) + 0.6, dur, 0.4) * d);
    plate("≈ 1 car every 40 m", X(25), 300 - 220, 48, INK, "center", win(t, B(6), dur, 0.4) * d);
    plate("past it: jams only need time", 960, 868, 50, CORAL, "center", win(t, B(7), dur, 0.4) * d);
    // a live lane under the axis, at the density the needle points to
    const sim = needle < 25 ? SPARSE : DENSE, la = d * (1 - Math.abs(needle - 25) < 1 ? 0.6 : 1);
    rrect(260, 700, 1400, 70, 18, PANELc, d * 0.9);
    for (let i = 0; i < sim.N; i++) { const c = carAt(sim, s + 60, i); car(260 + c.x / sim.L * 1400, 735, 0, CARLEN / sim.L * 1400 * 1.25, speedCol(c.v, sim.v0), { a: la, brake: -c.a / 2.5 }); }
  }
  MAS(1780, T, { s: 0.26, look: [-0.7, 0], mouth: t > B(3) && t < B(4) ? "o" : "smile", a: split });
};

// 6 — one calm car (Arizona): waves return, a gold car takes over, the waves fade
const azS = t => 40 + t * 1.25;
SCENES.fix = (t, T, B, E, dur) => {
  clear(); vignette();
  const s = azS(t), sOn = 120;
  const shiftL = seg(t, B(4) - 0.5, B(4) + 0.5);
  const cx = lerp(960, 640, shiftL);
  drawRing(AZ, s, cx, 500, 330, { gold: s >= sOn - 6 ? 0 : -1, goldRing: s >= sOn - 6 });
  plate("Arizona: 260 m, ~20 cars", cx, 90, 48, INK, "center", win(t, B(1), B(3) + 2, 0.5));
  plate("one car → computer", cx, 90, 48, GOLD, "center", win(t, B(2) + 0.5, B(4), 0.4));
  // the rule
  const r = win(t, B(3), B(5), 0.4);
  if (r > 0) { plate("Don't chase the car in front", cx, 900 - 60, 46, INK, "center", r); }
  // speed-spread meter (std of speeds now)
  if (shiftL > 0) {
    let m = 0, m2 = 0; for (let i = 0; i < AZ.N; i++) { const v = carAt(AZ, s, i).v; m += v; m2 += v * v; } m /= AZ.N; const sd = Math.sqrt(Math.max(0, m2 / AZ.N - m * m));
    const x0 = 1180, y0 = 240; text("speed swings", x0, y0, 44, QUIET, "left", 700, shiftL);
    rrect(x0, y0 + 40, 560, 40, 20, PANELc, shiftL); rrect(x0, y0 + 40, 560 * clamp(sd / 7), 40, 20, mix(BLUEc, CORALc, clamp(sd / 5)), shiftL);
    [["−80% speed swings", B(5) + 0.2, CORAL], ["−40% fuel", B(5) + 2.0, GOLD], ["up to +14% throughput", B(6) + 0.6, BLUE]].forEach(([s2, tt, c], i) => plate(s2, x0 + 280, 420 + i * 110, 50, c, "center", win(t, tt, B(8), 0.4) * (0.5 + 0.5 * clamp(spring(t, tt)))));
    plate("best run", x0 + 280, 760, 40, QUIET, "center", win(t, B(5) + 0.2, B(8), 0.4));
  }
  // your version: a human driver leaving a gap
  const hv = seg(t, B(8) - 0.5, B(8) + 0.5);
  if (hv > 0) {
    g.globalAlpha = hv * 0.92; g.fillStyle = BG; g.fillRect(0, 0, W, H); g.globalAlpha = 1;
    const y = 520; rrect(-20, y - 70, W + 40, 140, 0, PANELc, hv);
    const gap = 330 + 140 * Math.sin((t - B(8)) * 0.9);
    car(1500, y, 0, 190, BLUEc, { a: hv }); car(1500 - gap, y, 0, 190, GOLDc, { a: hv, ring: true });
    for (let i = 1; i < 4; i++) car(1500 - gap - i * 250, y, 0, 190, BLUEc, { a: hv });
    plate("Leave a longer gap · ease off early · keep it steady", 960, 260, 46, INK, "center", hv * win(t, B(8) + 0.3, dur, 0.4));
    plate("the drivers behind you might get home sooner", 960, 790, 44, GOLD, "center", win(t, B(9), dur, 0.4));
  }
  MAS(1800, T, { s: 0.26, look: [-0.8, -0.2], mouth: t > B(5) && t < B(7) ? "grin" : "smile", a: 1 - hv * 0 });
};

// 7 — payoff: back to the motorway; we reach the front, look back, the knot is still there; end card
SCENES.end = (t, T, B, E, dur) => {
  clear();
  const endCard = seg(t, B(4) - 0.6, B(4) + 0.2);
  if (endCard < 1) {
    const pan = eio(t / (B(3) + 2)) * 2200;
    motorway(t, 600 + pan, { release: Math.max(0, t - B(3)) * 1.1 });
    plate("a wave of late, slightly-too-hard reactions", 960, 140, 50, INK, "center", win(t, B(1), B(3), 0.5));
    plate("the jam moved on to the drivers behind you", 960, 140, 50, CORAL, "center", win(t, B(3) + 0.3, B(4), 0.5));
    if (t > B(3)) arrow(900, 860 - 40, 300, 860 - 40, CORAL, seg(t, B(3) + 0.5, B(3) + 1.2), 10, 34);
  }
  if (endCard > 0) {
    g.globalAlpha = endCard; g.fillStyle = BG; g.fillRect(0, 0, W, H); g.globalAlpha = 1;
    // gentle ring loop on the left with the mascot; right two thirds left free for YouTube elements
    drawRing(RING, 900 + t, 330, 360, 170, { laneW: 34, a: endCard, carA: endCard });
    MAS(330, T, { s: 0.3, y: 900, look: [0.6, -0.2], mouth: "smile", a: endCard });
  }
};
