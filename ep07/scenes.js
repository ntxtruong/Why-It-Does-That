// Episode 7 — Why do your fingers wrinkle in water?
// Two scales: a hand in a bath (top view) and a giant fingertip cut-away. Pure functions of time.
// Wrinkling is a thin stiff layer buckling on a soft base: amplitude A = Am·sqrt(max(0, ε/εc − 1)),
// with the strain ε = swelling (top layer grows) + shrinking (pad loses volume). Valleys sit at fixed anchors.

const SKIN = [242, 210, 189], SKIN2 = [226, 186, 164], SC_COL = [238, 226, 206], TISSUE = [96, 74, 120];
const MAS = (T, o = {}) => mascot3(o.x ?? 190, o.y ?? 905, o.s ?? 0.34, T, o);
const EPSC = 0.55, AMAX = 38;
const ampOf = (swell, shrink) => AMAX * Math.sqrt(Math.max(0, (0.6 * swell + 0.6 * shrink) / EPSC - 1));

// ---------- bath water: caustic lines drifting over everything below them ----------
function caustics(x0, y0, w, h, t, a = 1) {
  if (a <= 0.01) return;
  g.save(); g.beginPath(); g.rect(x0, y0, w, h); g.clip();
  g.globalAlpha = a * 0.22; g.fillStyle = css(BLUEc); g.fillRect(x0, y0, w, h);
  g.strokeStyle = css(BLUEc); g.lineWidth = 3;
  for (let k = 0; k < 9; k++) {
    g.globalAlpha = a * 0.28; g.beginPath();
    for (let x = x0; x <= x0 + w; x += 16) { const y = y0 + (k + 0.5) * h / 9 + 18 * Math.sin(x * 0.011 + t * 0.9 + k * 1.7) + 10 * Math.sin(x * 0.027 - t * 0.6 + k); x === x0 ? g.moveTo(x, y) : g.lineTo(x, y); }
    g.stroke();
  }
  g.restore();
}

// ---------- a hand seen from above; wr = wrinkling 0..1; o.smooth = finger index kept smooth; o.cut marks it ----------
function hand(cx, cy, s, wr, a = 1, o = {}) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s); if (o.rot) g.rotate(o.rot);
  const F = [[-120, -250, 64, 250, -0.08], [-40, -300, 68, 300, -0.02], [42, -290, 66, 290, 0.03], [118, -240, 60, 240, 0.09]];
  const shape = () => { g.beginPath(); g.roundRect(-165, -40, 330, 360, 70); F.forEach(([x, y, w, h, r]) => { g.save(); g.translate(x, -20); g.rotate(r); g.roundRect(-w / 2, y + 20, w, h, w / 2); g.restore(); }); };
  g.lineJoin = "round"; g.strokeStyle = css(INKc); g.lineWidth = 14; shape(); g.stroke();
  // thumb
  g.save(); g.translate(-170, 120); g.rotate(-0.9); g.beginPath(); g.roundRect(-36, -190, 72, 200, 36); g.stroke(); g.fillStyle = css(SKIN); g.fill(); g.restore();
  g.fillStyle = css(SKIN); shape(); g.fill();
  // fingertip wrinkles (fixed pattern), drawn as short curved creases
  F.forEach(([x, y, w, h, r], i) => {
    const wi = o.smooth === i ? 0 : wr; if (wi <= 0.01) return;
    g.save(); g.translate(x, -20); g.rotate(r); g.strokeStyle = css(SKIN2.map(c => c - 50)); g.lineCap = "round"; g.lineWidth = 5; g.globalAlpha = a * wi;
    for (let k = 0; k < 6; k++) { const yy = y + 34 + k * 17, ww = w * 0.36; g.beginPath(); g.moveTo(-ww, yy + 4 * hash(i, k)); g.quadraticCurveTo(0, yy - 7 + 8 * hash(i, k + 9), ww, yy + 4 * hash(k, i)); g.stroke(); }
    g.restore();
  });
  if (o.cut !== undefined) { const [x, y] = F[o.cut]; g.globalAlpha = a * (o.cutA ?? 1); g.strokeStyle = CORAL; g.lineWidth = 9; g.beginPath(); g.moveTo(x - 26, -70); g.lineTo(x + 26, -20); g.moveTo(x + 26, -70); g.lineTo(x - 26, -20); g.stroke(); }
  g.restore();
}
// a smooth silhouette patch (arm / back) with a check that it stays smooth
function smoothPatch(x, y, w, h, label, a) { if (a <= 0.01) return; rrect(x, y, w, h, h / 2, SKIN, a, INKc, 8); text(label, x + w / 2, y + h + 46, 42, QUIET, "center", 700, a); text("smooth", x + w / 2, y + h / 2, 40, [120, 90, 80], "center", 800, a); }

// ---------- the fingertip cut-away ----------
// region x0..x0+w, surface baseline yb; st: swell, shrink, water, nerve, salt, pores, labels, t, anchorsHi
function cutaway(x0, yb, w, st, a = 1) {
  if (a <= 0.01) return;
  const t = st.t || 0, lam = st.lam || 170, xa = x0 + lam / 2, A = st.A ?? ampOf(st.swell || 0, st.shrink || 0);
  const th = 64 * (1 + 0.25 * (st.swell || 0)), drop = 26 * (st.shrink || 0), base = yb + drop;
  const bump = x => 0.5 * (1 + Math.cos(TAU2 * (x - xa) / lam));            // 1 at the anchors
  const top = x => base - th - A * (1 - bump(x)), bot = x => base - 0.35 * A * (1 - bump(x));
  g.save(); g.globalAlpha = a;
  // tissue (pad), redder with more blood
  const blood = 1 - 0.55 * (st.shrink || 0);
  g.fillStyle = css(mix(TISSUE, [150, 84, 104], blood * 0.6)); g.beginPath(); g.moveTo(x0, bot(x0)); for (let x = x0; x <= x0 + w; x += 6) g.lineTo(x, bot(x)); g.lineTo(x0 + w, 1080); g.lineTo(x0, 1080); g.closePath(); g.fill();
  // blood vessel along the bottom with branches up to the anchors
  const vy = base + 250, vr = 24 * (1 - 0.55 * (st.shrink || 0));
  g.strokeStyle = css(CORALc, 0.9); g.lineCap = "round"; g.lineWidth = vr * 2; g.beginPath(); g.moveTo(x0 - 20, vy); g.lineTo(x0 + w + 20, vy); g.stroke();
  for (let x = xa; x < x0 + w; x += lam * 2) { g.lineWidth = vr * 0.8; g.beginPath(); g.moveTo(x, vy); g.quadraticCurveTo(x + 30, vy - 120, x, base + 60); g.stroke(); }
  for (let i = 0; i < 40; i++) { const u = (hash(i, 3) + t * 0.25 * blood) % 1; if (hash(i, 4) > blood + 0.15) continue; dot(x0 + u * w, vy + (hash(i, 5) - 0.5) * vr, Math.max(3, vr * 0.28), [255, 190, 180], 0.9); }
  // nerve: a thin gold line with branches to the pores, pulses when active
  const ny = base + 330, nv = st.nerve || 0;
  if (ny < 1080) {
    line(x0 - 20, ny, x0 + w + 20, ny, GOLDc, 0.9, 6);
    for (let x = xa + lam / 2; x < x0 + w; x += lam * 2) { g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.moveTo(x, ny); g.quadraticCurveTo(x - 40, base + 160, x, base + 40); g.stroke(); dot(x, base + 40, 9, GOLDc, 1); }
    if (nv > 0.01) for (let k = 0; k < 6; k++) { const u = (k / 6 + t * 0.35) % 1; soft(x0 + u * w, ny, 28, GOLDc, nv * 0.9); dot(x0 + u * w, ny, 8, INKc, nv); }
  }
  // salt around the nerve endings: spreads out (diluted) as water arrives
  if (st.salt > 0.01) for (let x = xa + lam / 2; x < x0 + w; x += lam * 2) for (let k = 0; k < 10; k++) { const an = hash(k, x) * TAU2, r = lerp(14, 70, st.dilute || 0) * (0.4 + hash(k, 7)); dot(x + Math.cos(an) * r, base + 40 + Math.sin(an) * r * 0.6, 5, QUIETc, st.salt); }
  // stratum corneum: the dead-cell layer as a band of tiles
  g.beginPath(); for (let x = x0; x <= x0 + w; x += 6) g.lineTo(x, top(x)); for (let x = x0 + w; x >= x0; x -= 6) g.lineTo(x, bot(x)); g.closePath();
  g.fillStyle = css(mix(SC_COL, [206, 226, 246], 0.45 * (st.swell || 0))); g.fill();
  g.save(); g.clip(); g.strokeStyle = "rgba(150,130,120,0.55)"; g.lineWidth = 2;
  for (let r = 0; r < 6; r++) { g.beginPath(); for (let x = x0; x <= x0 + w; x += 6) { const y = lerp(top(x), bot(x), (r + 1) / 6); x === x0 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); for (let x = x0 + (r % 2) * 24; x < x0 + w; x += 48) { const y = lerp(top(x), bot(x), r / 6), y2 = lerp(top(x), bot(x), (r + 1) / 6); g.beginPath(); g.moveTo(x, y); g.lineTo(x, y2); g.stroke(); } }
  // sweat pores: ducts through the layer, water dots travelling down them
  if (st.pores > 0.01) for (let x = xa + lam / 2; x < x0 + w; x += lam * 2) {
    g.strokeStyle = css(BLUEc, st.pores); g.lineWidth = 9; g.beginPath(); g.moveTo(x, top(x) - 4); g.bezierCurveTo(x + 14, lerp(top(x), bot(x), 0.35), x - 14, lerp(top(x), bot(x), 0.7), x, bot(x) + 30); g.stroke();
    if (st.water > 0.01) for (let k = 0; k < 4; k++) { const u = (k / 4 + t * 0.5) % 1; dot(x, lerp(top(x) - 30, bot(x) + 34, u), 6, BLUEc, st.water * st.pores); }
  }
  g.restore();
  // anchors: gold pins where the layer is tied down
  for (let x = xa; x < x0 + w; x += lam) { line(x, bot(x) - 6, x, bot(x) + 46, GOLDc, st.anchors ?? 0.8, 5); dot(x, bot(x) + 46, 8, GOLDc, st.anchors ?? 0.8); }
  // the surface line (recurring motif)
  g.strokeStyle = GOLD; g.lineWidth = 6; g.beginPath(); for (let x = x0; x <= x0 + w; x += 4) x === x0 ? g.moveTo(x, top(x)) : g.lineTo(x, top(x)); g.stroke();
  // bath water above
  if (st.water > 0.01) caustics(x0, top(x0) - 260, w, 240 + A * 0, t, st.water * 0.8);
  // labels (right end, in local units; the caller's zoom makes them ≥ 40 px)
  const la = st.labels || 0;
  if (la > 0.01) { const xr = x0 + w - 12; plate("outer layer", xr, base - th / 2, 27, INK, "right", la); plate("blood vessel", xr, vy - 44, 27, CORAL, "right", la); if (ny < 1080) plate("nerve", xr, ny + 30, 27, GOLD, "right", la); }
  if ((st.poreLabel || 0) > 0.01) plate("sweat pore", xa + lam / 2 + 20, top(xa + lam / 2) - 40, 27, BLUE, "left", st.poreLabel);
  g.restore();
  return { top, bot, base, A };
}

// ---------- small props ----------
function basin(cx, cy, w, h, t, a) { if (a <= 0.01) return; rrect(cx - w / 2, cy - h / 2, w, h, 40, PANELc, a, QUIETc, 6); caustics(cx - w / 2 + 12, cy - h / 2 + 12, w - 24, h - 24, t, a); }
function bodyMap(cx, cy, s, glow, a) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s); g.strokeStyle = css(QUIETc); g.lineWidth = 8; g.fillStyle = css(PANELc); g.lineJoin = "round";
  const P = [() => { g.beginPath(); g.arc(0, -330, 70, 0, TAU2); }, () => { g.beginPath(); g.roundRect(-110, -250, 220, 330, 60); }, () => { g.beginPath(); g.roundRect(-190, -240, 60, 300, 30); }, () => { g.beginPath(); g.roundRect(130, -240, 60, 300, 30); }, () => { g.beginPath(); g.roundRect(-100, 70, 80, 330, 36); }, () => { g.beginPath(); g.roundRect(20, 70, 80, 330, 36); }];
  P.forEach(p => { p(); g.fill(); g.stroke(); });
  // palms and soles: dense dots
  [[-160, 95, 0], [160, 95, 1], [-60, 420, 2], [60, 420, 3]].forEach(([x, y, k]) => { for (let i = 0; i < 26; i++) { const an = hash(i, k) * TAU2, r = 46 * Math.sqrt(hash(i, k + 5)); dot(x + Math.cos(an) * r, y + Math.sin(an) * r * 0.8, 6, GOLDc, glow); } soft(x, y, 80, GOLDc, glow * 0.25); });
  for (let i = 0; i < 24; i++) dot(-80 + hash(i, 31) * 160, -220 + hash(i, 32) * 280, 4, GOLDc, glow * 0.4);   // sparse elsewhere
  g.restore();
}
function printPattern(cx, cy, s, col, a, shift = 0) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s);
  g.strokeStyle = css(col); g.lineWidth = 7; g.lineCap = "round";
  for (let k = 0; k < 9; k++) { const y = -160 + k * 40; g.beginPath(); for (let x = -150; x <= 150; x += 10) { const yy = y + 14 * Math.sin(x * 0.03 + hash(k, 2) * 6) + 6 * Math.sin(x * 0.08 + k); x === -150 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
  g.restore();
}
function tyre(cx, cy, s, t, wet, a) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s);
  rrect(-500, 120, 1000, 40, 8, [70, 78, 104], 1);                              // road
  g.fillStyle = css(BLUEc, 0.5 * wet); g.fillRect(-500, 96, 1000, 24);            // water film
  rrect(-360, -200, 720, 316, 60, [44, 48, 66], 1, INKc, 8);                      // tyre section
  for (let k = 0; k < 6; k++) { const x = -300 + k * 120; rrect(x, 40, 50, 80, 10, BGc, 1); if (wet > 0.01) { const u = (t * 0.8 + k * 0.17) % 1; dot(x + 25, lerp(100, 50, u), 9, BLUEc, wet * (1 - u)); } }
  g.restore();
}
function marbles(x0, y, t, speed, a, wr) {
  if (a <= 0.01) return;
  rrect(x0, y, 220, 140, 20, PANELc, a, QUIETc, 5); rrect(x0 + 520, y, 220, 140, 20, PANELc, a, QUIETc, 5); caustics(x0 + 8, y + 8, 204, 124, t, a);
  for (let i = 0; i < 5; i++) { const u = ((t * speed + i / 5) % 1), x = lerp(x0 + 110, x0 + 630, eio(u)), yy = y + 60 - Math.sin(Math.PI * u) * 160; dot(x, yy, 18, [200, 214, 240], a); dot(x - 5, yy - 5, 6, INKc, a); }
  text(wr ? "wrinkled fingers" : "smooth fingers", x0 + 370, y + 200, 40, wr ? GOLD : QUIET, "center", 700, a);
}
function bars(x, y, vals, labels, cols, a, title) {
  if (a <= 0.01) return; text(title, x + 200, y - 60, 46, INK, "center", 800, a);
  vals.forEach((v, i) => { rrect(x + i * 220, y + 300 - v * 300, 160, v * 300, 14, cols[i], a); text(labels[i], x + i * 220 + 80, y + 345, 40, QUIET, "center", 700, a); });
}

// the fingertip cut-away, zoomed so the layers read on a phone (local units × 1.55)
function cut(st, a) { g.save(); g.translate(330, 380); g.scale(1.55, 1.55); cutaway(0, 0, 1000, st, a); g.restore(); }

const SCENES = {};

// 1 — hook: hand in the bath prunes; arms and back stay smooth; the cut-nerve finger stays smooth
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const out = seg(t, B(6) + 0.3, dur - 0.2), zoomIn = 1 + 2.8 * eio((t - (B(6) + 0.6)) / (dur - B(6) - 0.6));
  g.save(); g.translate(960, 470); g.scale(zoomIn, zoomIn); g.translate(-960 + 0 * out, -470);
  const wr = seg(t, B(1), B(1) + 3.2);
  const wide = seg(t, B(4) + 0.2, B(5) - 0.2);
  basin(960, 520, lerp(900, 1300, wide), 760, t, 1);
  hand(960, 640, 1.0, wr, 1 - wide, {});
  // side-by-side: normal finger and the cut-nerve finger
  const sb = seg(t, B(5) - 0.4, B(5) + 0.4);
  if (sb > 0.01) { hand(700, 640, 0.85, 1, sb, {}); hand(1220, 640, 0.85, 1, sb, { smooth: 1, cut: 1 }); plate("nerve cut → stays smooth", 1220, 880, 42, CORAL, "center", seg(t, B(5) + 0.5, B(5) + 1.0) * (1 - out)); }
  g.restore();
  smoothPatch(1540, 300, 280, 120, "arm", win(t, B(2), B(3), 0.4)); smoothPatch(1540, 560, 280, 160, "back", win(t, B(2) + 0.4, B(3), 0.4));
  plate("SKIN SOAKS UP WATER?", 960, 160, 60, INK, "center", win(t, B(3), B(5) - 0.2, 0.4), 800);
  plate("only part of the story", 960, 255, 44, QUIET, "center", win(t, B(4), B(5) - 0.2, 0.4));
  MAS(T, { a: 1 - out, look: [0.6, -0.2], mouth: t > B(5) ? "o" : "smile" });
};

// 2 — soak: arrive in the cut-away; the layer swells; paper curls; the carpet buckles; swelling alone is weak
SCENES.soak = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const inA = seg(t, 0, 0.8), swell = seg(t, B(2), B(2) + 2.5);
  const ana = win(t, B(3) - 0.2, B(5) + 0.2, 0.5);           // analogies on screen
  cut({ swell, shrink: 0, water: seg(t, B(2) - 0.4, B(2) + 0.6), pores: 0, t, A: ampOf(swell, 0) * seg(t, B(5), B(5) + 1.2), labels: win(t, B(1), B(2) + 1, 0.4) }, inA * (1 - ana));
  plate("outer layer: dead, flat cells", 960, 300, 46, INK, "center", win(t, B(1), B(2) + 0.3, 0.4) * (1 - ana));
  plate("it takes in water and swells", 960, 300, 46, BLUE, "center", win(t, B(2) + 0.3, B(3) - 0.2, 0.4));
  // paper: wet side grows, the sheet curls
  const pA = win(t, B(3) - 0.2, B(4), 0.4), cur = seg(t, B(3) + 0.6, B(3) + 2.4);
  if (pA > 0.01) {
    const L = 900, k = Math.max(1e-6, cur * 2.4 / L), cx = 960, cy = 600; g.save(); g.globalAlpha = pA; g.lineCap = "round";
    for (const [off, col] of [[12, BLUEc], [-12, SC_COL]]) { g.strokeStyle = css(col); g.lineWidth = 24; g.beginPath();
      for (let i = 0; i <= 60; i++) { const an = (i / 60 - 0.5) * L * k, x = cx + Math.sin(an) / k + Math.sin(an) * off, y = cy + (1 - Math.cos(an)) / k - Math.cos(an) * off; i ? g.lineTo(x, y) : g.moveTo(x, y); }
      g.stroke(); }
    g.restore(); text("wet side grows", 960, 500, 42, BLUE, "center", 700, pA); text("dry side doesn't", 960, 780, 42, QUIET, "center", 700, pA); }
  // carpet: too long for its room, it buckles
  const cA = win(t, B(4) - 0.1, B(5) + 0.2, 0.4), ex = seg(t, B(4) + 0.3, B(4) + 2.0);
  if (cA > 0.01) { rrect(460, 380, 1000, 330, 10, null, cA, QUIETc, 8); const amp = 150 * Math.sqrt(ex); const pts = []; for (let x = 470; x <= 1450; x += 8) { const u = (x - 470) / 980; pts.push([x, 700 - amp * Math.exp(-Math.pow((u - 0.5) / 0.13, 2))]); } poly(pts, CORALc, cA, 22); text("too big to lie flat → it buckles", 960, 800, 44, CORAL, "center", 700, cA); }
  plate("swelling alone: barely a ripple", 960, 300, 46, CORAL, "center", seg(t, B(6) - 0.2, B(6) + 0.3));
  MAS(T, { a: 1, look: [0.8, -0.3], mouth: t > B(6) ? "o" : "smile", x: 150 });
};

// 3 — clue: two hands in basins, one with a damaged nerve in the arm; only the nerve differs
SCENES.clue = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const inA = seg(t, 0.2, 1.0), wr = seg(t, B(2), B(2) + 2.0), fol = seg(t, B(5) - 0.3, B(5) + 0.5);
  text("1930s", 960, 110, 60, GOLD, "center", 800, inA * (1 - fol) * (1 - seg(t, B(3) - 0.3, B(3))));
  plate("Thomas Lewis & George Pickering", 960, 190, 42, QUIET, "center", win(t, B(1), B(3), 0.4));
  [[620, false], [1300, true]].forEach(([x, bad]) => {
    const a = inA * (1 - fol);
    basin(x, 560, 520, 520, t, a);
    // forearm with its nerve (gold); the damaged one has a gap
    rrect(x - 70, 760, 140, 330, 60, SKIN, a, INKc, 10);
    line(x, 1080, x, 800, GOLDc, a, 8);
    if (bad) { rrect(x - 30, 900, 60, 50, 10, BGc, a); line(x - 34, 890, x + 34, 960, CORALc, a, 8); line(x + 34, 890, x - 34, 960, CORALc, a, 8); }
    hand(x, 560, 0.62, bad ? 0 : wr, a, {});
    text(bad ? "damaged nerve" : "healthy", x, 268, 44, bad ? CORAL : BLUE, "center", 800, a * seg(t, B(1) + 0.6, B(1) + 1.2) * (1 - seg(t, B(1) - 0.1, B(1)) * 0));
  });
  plate("SAME SKIN · SAME WATER · SAME TIME", 960, 120, 48, INK, "center", win(t, B(3), B(4), 0.4) * (1 - fol), 800);
  plate("the only difference: the nerve", 960, 120, 48, GOLD, "center", win(t, B(4), B(5) - 0.1, 0.3) * (1 - fol), 800);
  // follow the nerve into the cut-away: autopilot nerves (sweat, blood flow)
  if (fol > 0.01) { cut({ swell: 0, shrink: 0, nerve: 1, t, anchors: 0.5, labels: fol }, fol); plate("autopilot nerves: sweat · blood flow", 960, 120, 48, GOLD, "center", seg(t, B(5) + 0.4, B(5) + 1.0)); plate("your body does it", 960, 215, 44, INK, "center", seg(t, B(6), B(6) + 0.5)); }
  MAS(T, { a: 1, x: 150, look: [0.7, -0.2], mouth: t > B(4) ? "o" : "smile" });
};

// 4 — mechanism: water in through pores → salts shift → nerve fires → vessels narrow → pad shrinks → folds
SCENES.mechanism = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const water = seg(t, B(1), B(1) + 1.0), dil = seg(t, B(2), B(2) + 1.5), nerve = seg(t, B(2) + 0.6, B(2) + 1.4);
  const shrink = seg(t, B(3) + 0.4, B(4) + 1.5), swell = seg(t, B(1) + 0.5, B(2) + 2.0) * 0.7;
  const split = seg(t, B(8) - 0.2, B(8) + 0.6);
  const A = ampOf(swell, shrink) * seg(t, B(6), B(7) + 1.2);
  if (split < 0.99) cut({ swell, shrink, water, pores: seg(t, B(1) - 0.3, B(1) + 0.4), poreLabel: win(t, B(1), B(2) + 0.5, 0.4), labels: win(t, B(2) + 0.5, B(4) + 1, 0.4), nerve, salt: seg(t, B(2) - 0.4, B(2)), dilute: dil, t, A, anchors: lerp(0.6, 1, win(t, B(6), B(7) + 1.5, 0.5)) }, 1 - split);
  plate("water seeps in through sweat pores", 960, 120, 46, BLUE, "center", win(t, B(1), B(2), 0.4));
  plate("salt balance shifts · the nerve responds", 960, 120, 46, GOLD, "center", win(t, B(2), B(3), 0.4));
  plate("blood vessels narrow", 960, 120, 46, CORAL, "center", win(t, B(3), B(4), 0.4));
  plate("the pad loses a little volume", 960, 120, 46, INK, "center", win(t, B(4), B(5), 0.4));
  plate("several minutes in warm water", 960, 120, 46, QUIET, "center", win(t, B(5), B(6), 0.4));
  plate("anchored skin folds between its anchors", 960, 120, 46, GOLD, "center", win(t, B(6), B(8) - 0.2, 0.4));
  // three panels: swell only · shrink only · both
  if (split > 0.01) {
    [["swelling only", 1, 0], ["shrinking only", 0, 1], ["both together", 1, 1]].forEach(([lab, sw, sh], i) => {
      const x0 = 70 + i * 610, u = seg(t, B(8) + 0.6 + i * 0.5, B(8) + 2.2 + i * 0.5);
      g.save(); g.beginPath(); g.rect(x0, 200, 560, 700); g.clip(); cutaway(x0, 560, 560, { swell: sw * u, shrink: sh * u, t, lam: 140 }, split); g.restore();
      rrect(x0, 200, 560, 700, 24, null, split, QUIETc, 4);
      text(lab, x0 + 280, 250, 44, i === 2 ? GOLD : INK, "center", 800, split);
    });
  }
  MAS(T, { a: 1 - split, x: 150, look: [0.8, -0.4], mouth: t > B(7) ? "grin" : "o" });
};

// 5 — where: body map of sweat-pore density; toes; the clinic test; the repeat pattern; drying off
SCENES.where = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const mapA = win(t, 0.2, B(4) - 0.1, 0.5), glow = seg(t, B(1), B(1) + 1.2);
  bodyMap(960, 520, 0.95, glow, mapA);
  plate("most sweat pores: palms and soles", 960, 110, 46, GOLD, "center", win(t, B(1), B(3), 0.4) * mapA);
  plate("toes prune too", 960, 110, 46, INK, "center", win(t, B(3), B(4), 0.4) * mapA);
  // clinic: one finger stays smooth → its nerves may not be working
  const cl = win(t, B(4) - 0.1, B(5) - 0.1, 0.5);
  if (cl > 0.01) { basin(960, 520, 820, 640, t, cl); hand(960, 600, 0.9, 1, cl, { smooth: 2 }); plate("used as a nerve test", 960, 120, 48, INK, "center", cl); plate("no wrinkles here", 1000, 255, 40, CORAL, "center", cl * seg(t, B(4) + 1, B(4) + 1.6)); }
  // repeat: day 1 and day 2 patterns slide together and match
  const rp = win(t, B(5) - 0.1, B(6) - 0.1, 0.5), u = eio((t - B(5) - 0.4) / 2.2);
  if (rp > 0.01) { printPattern(lerp(620, 960, u), 540, 1.4, BLUEc, rp * 0.9); printPattern(lerp(1300, 960, u), 540, 1.4, GOLDc, rp * 0.8); text("day 1", lerp(620, 860, u), 800, 42, BLUE, "center", 700, rp); text("day 2", lerp(1300, 1060, u), 800, 42, GOLD, "center", 700, rp); plate("same finger, same pattern · n = 3", 960, 120, 46, INK, "center", rp); }
  // dry off: blood returns, the line flattens (~30 min)
  const dr = seg(t, B(6) - 0.1, B(6) + 0.4), back = seg(t, B(6) + 0.6, B(6) + 3.4);
  if (dr > 0.01) { cut({ swell: 0.7 * (1 - back), shrink: 1 - back, t }, dr); plate("dry off: gone in about half an hour", 960, 120, 46, BLUE, "center", seg(t, B(6) + 0.3, B(6) + 0.8)); }
  MAS(T, { a: 1, x: 150, look: [0.8, -0.3], mouth: "smile" });
};

// 6 — why: tyre treads; ancestors' wet grip; 2013 marbles faster; 2014 no difference; open question
SCENES.why = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  plate("what is it for?", 960, 110, 56, INK, "center", win(t, 0.2, B(1) + 0.4, 0.4), 800);
  const h0 = win(t, -1, B(1) + 0.2, 0.5); if (h0 > 0.01) { basin(960, 560, 900, 640, t, h0); hand(960, 660, 0.95, 1, h0, {}); qmarkBig(1420, 480, h0 * seg(t, 0.6, 1.2)); }
  const ty = win(t, B(1) - 0.1, B(5) - 0.1, 0.5);
  tyre(960, 560, 1.15, t, seg(t, B(3), B(3) + 0.8), ty * (1 - win(t, B(2), B(3) - 0.1, 0.4)));
  plate("rain treads? (a hypothesis)", 960, 160, 46, GOLD, "center", win(t, B(1) + 0.3, B(2), 0.4));
  // ancestors: wet rock, a branch, fruit (simple shapes)
  const an = win(t, B(2), B(3) - 0.1, 0.4);
  if (an > 0.01) { g.save(); g.globalAlpha = an; g.fillStyle = css([98, 108, 140]); g.beginPath(); g.ellipse(700, 650, 300, 120, 0, 0, TAU2); g.fill(); g.strokeStyle = css([150, 110, 80]); g.lineWidth = 34; g.lineCap = "round"; g.beginPath(); g.moveTo(1050, 380); g.quadraticCurveTo(1300, 300, 1550, 420); g.stroke(); g.restore(); caustics(400, 520, 600, 160, t, an); hand(1300, 520, 0.5, 1, an, { rot: 0.3 }); plate("wet rocks · wet branches · wet food", 960, 160, 44, INK, "center", an); }
  plate("grooves give water somewhere to go", 960, 160, 44, BLUE, "center", win(t, B(3) + 0.2, B(5) - 0.2, 0.4));
  const m13 = win(t, B(5) - 0.2, B(6) - 0.1, 0.4), m14 = seg(t, B(6) - 0.2, B(6) + 0.3);
  if (m13 > 0.01) { text("2013 · Newcastle University", 960, 120, 48, GOLD, "center", 800, m13); marbles(380, 300, t, 0.55, m13, false); marbles(380, 620, t, 0.75, m13, true); bars(1340, 330, [0.8, 0.6], ["smooth", "wrinkled"], [QUIETc, GOLDc], m13, "time taken"); }
  if (m14 > 0.01) { const q = seg(t, B(7), B(7) + 0.6); text("2014 · Berlin · 40 people", 960, 120, 48, BLUE, "center", 800, m14 * (1 - q)); bars(760, 330, [0.75, 0.77], ["smooth", "wrinkled"], [QUIETc, BLUEc], m14 * (1 - q), "time taken"); if (q > 0.01) { qmarkBig(960, 520, q); plate("how: fairly clear · why: still open", 960, 840, 48, INK, "center", q); } }
  MAS(T, { a: 1, x: 150, look: [0.8, -0.4], mouth: t > B(6) ? "o" : "smile", rot: -0.06 * seg(t, B(7), B(7) + 0.6) });
};
function qmarkBig(x, y, a) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; text("?", x, y, 300, GOLD, "center", 800, a); g.restore(); }

// 7 — the reflex is real: a short time-lapse of a fingertip wrinkling in warm water
SCENES.angle = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const u = seg(t, 0.4, dur - 0.6);
  basin(960, 520, 900, 760, t, 1); hand(960, 640, 1.0, u, 1, {});
  plate(`warm water · ${Math.round(u * 10)} min`, 960, 110, 46, BLUE, "center", seg(t, 0.2, 0.7));
  MAS(T, { a: 1, x: 150, look: [0.8, -0.2], mouth: "smile" });
};

// 8 — payoff: the chain in one line, then the hand lifts out of the bath (rhyme of the first shot); end card
SCENES.payoff = (t, T, B, E, dur) => {
  clear(); vignette(0.35);
  const h0 = win(t, -1, B(1), 0.5); if (h0 > 0.01) { basin(960, 560, 900, 700, t, h0); hand(960, 660, 1.0, 1, h0, {}); }
  const ch = win(t, B(1) - 0.2, B(4) + 0.6, 0.5), lift = seg(t, B(4), B(4) + 2.0), endc = seg(t, B(5) - 0.2, B(5) + 0.6);
  // chain: water → nerve → vessels → folds
  const steps = [["water in", BLUEc], ["nerve signal", GOLDc], ["vessels narrow", CORALc], ["skin folds", INKc]];
  steps.forEach(([lab, col], i) => { const a = ch * seg(t, B(1) + i * 0.9, B(1) + i * 0.9 + 0.5) * (1 - endc); rrect(150 + i * 430, 380, 360, 200, 30, PANELc, a, col, 6); text(lab, 330 + i * 430, 480, 44, col, "center", 800, a); if (i < 3) arrow(520 + i * 430, 480, 570 + i * 430, 480, QUIETc, a, 6, 18); });
  plate("cut the nerve → no wrinkles", 960, 720, 48, CORAL, "center", win(t, B(3), B(4) + 0.4, 0.4) * (1 - endc));
  // hand lifts out of the bath
  if (lift > 0.01 && endc < 1) { basin(960, 620 + lift * 200, 900, 400, t, lift * (1 - endc)); hand(960, lerp(760, 480, eio(lift)), 0.9, 1, lift * (1 - endc), {}); plate("your body making a change", 960, 120, 48, GOLD, "center", lift * (1 - endc)); }
  // end card: chibi left, right two thirds free for YouTube elements (captions carry the text)
  MAS(T, { a: 1, x: lerp(150, 330, endc), y: lerp(905, 930, endc), s: lerp(0.34, 0.62, endc), look: [0.6, -0.2], mouth: endc > 0.5 ? "grin" : "smile" });
};
