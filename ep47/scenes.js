// Episode 47 (Short v4, 1080×1920): lift an ice cube with a wet thread and a pinch of salt.
// Facts (claims.md): salt dissolves in the thin water film on the cube and melts a thin layer around the thread;
// melting absorbs heat, so the cube and film cool below 0 °C; as the salt spreads out (diluted by meltwater) the water
// around the thread is no longer salty enough to stay liquid and refreezes, trapping the thread. Wait 2–3 minutes
// (Science Buddies; Scientific American). Drawn far larger than life; the cross-section is a magnified sketch.
window.NOPUSH = ["end"];
const look = [0.5, -0.6];
const ICE = [214, 236, 255], ICE2 = [160, 200, 240], THREAD = [255, 246, 228], SALT = [255, 255, 255], SKIN = [240, 210, 190];
const CX = 540, CW = 560, CH = 520, PLATE_Y = 1290;   // cube centre x, size; plate top
function room() {
  const gr = g.createRadialGradient(540, 860, 80, 540, 860, 1050);
  gr.addColorStop(0, "rgb(120,142,198)"); gr.addColorStop(0.6, "rgb(70,92,156)"); gr.addColorStop(1, "rgb(30,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
function platter(a = 1) { g.save(); g.globalAlpha = a; g.fillStyle = "rgba(225,232,245,0.95)"; g.beginPath(); g.ellipse(CX, PLATE_Y + 18, 360, 52, 0, 0, TAU2); g.fill(); g.fillStyle = "rgba(180,192,215,1)"; g.beginPath(); g.ellipse(CX, PLATE_Y + 10, 300, 34, 0, 0, TAU2); g.fill(); g.restore(); }
// the ice cube: front face, top face (perspective), highlights. y = bottom of the cube; rot = small swing (rad)
function cube(x, y, rot = 0, a = 1, wet = 0) {
  g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(rot);
  const w = CW, h = CH, d = 110;
  g.fillStyle = css(ICE2); g.beginPath(); g.moveTo(-w / 2, -h); g.lineTo(-w / 2 + d * 0.6, -h - d * 0.55); g.lineTo(w / 2 + d * 0.6, -h - d * 0.55); g.lineTo(w / 2, -h); g.closePath(); g.fill();   // top
  g.fillStyle = "rgb(130,176,226)"; g.beginPath(); g.moveTo(w / 2, -h); g.lineTo(w / 2 + d * 0.6, -h - d * 0.55); g.lineTo(w / 2 + d * 0.6, -d * 0.55); g.lineTo(w / 2, 0); g.closePath(); g.fill();   // side
  const gr = g.createLinearGradient(-w / 2, -h, w / 2, 0); gr.addColorStop(0, "rgb(236,246,255)"); gr.addColorStop(1, "rgb(176,212,246)");
  g.fillStyle = gr; g.beginPath(); g.roundRect(-w / 2, -h, w, h, 26); g.fill();                         // front
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = 6; g.beginPath(); g.roundRect(-w / 2, -h, w, h, 26); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.55)"; g.beginPath(); g.roundRect(-w / 2 + 40, -h + 40, 60, h - 140, 30); g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.roundRect(-w / 2 + 120, -h + 40, 26, h * 0.45, 13); g.fill();
  // cloudy core
  soft(20, -h * 0.5, 170, [255, 255, 255], 0.35);
  if (wet > 0.01) { g.fillStyle = `rgba(120,180,255,${0.35 * wet})`; g.beginPath(); g.ellipse(d * 0.3, -h - d * 0.28, w * 0.42, 22, -0.1, 0, TAU2); g.fill(); }
  g.restore();
}
// the thread: lies over the top of the cube (along its depth), the two ends hang down the front-left and back-right.
// drop ∈ [0,1]: 0 = above, 1 = lying on the cube. lift ∈ px: how far the gathered ends are pulled up.
function thread(x, y, rot, drop, lift, a = 1, frozen = 0) {
  const top = y - CH - 30, yy = lerp(top - 260, top, eout(drop));
  g.save(); g.globalAlpha = a;
  const P = [];
  if (lift <= 0) {
    for (let i = 0; i <= 40; i++) { const u = i / 40, X = x - 330 + u * 660, sag = (X > x - 260 && X < x + 300) ? 0 : (Math.abs(X - x) - 270) * 1.9 * eout(drop); P.push([X, yy + Math.max(0, sag) + Math.sin(u * 9 + drop * 4) * 6 * (1 - drop)]); }
  } else {
    // ends gathered above the cube, the thread comes down to the cube top in a V
    const hx = x + Math.sin(rot) * 0, hy = top - 140 - lift;
    P.push([hx, hy]); P.push([x - 180, top + 4]); P.push([x + 220, top + 4]); P.push([hx + 6, hy]);
  }
  g.strokeStyle = "rgba(90,80,70,0.7)"; g.lineWidth = 22; g.lineJoin = "round"; g.lineCap = "round"; g.beginPath(); P.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); g.stroke();
  g.strokeStyle = css(THREAD); g.lineWidth = 14; g.stroke();
  if (frozen > 0.01) {   // a band of new ice over the part of the thread that lies on the cube: the thread is frozen in
    const x0 = lift > 0 ? x - 200 : x - 250, x1 = lift > 0 ? x + 240 : x + 290, yb = lift > 0 ? top + 4 : top;
    g.globalAlpha = a * frozen; g.fillStyle = "rgba(236,248,255,0.82)"; g.strokeStyle = css(BLUEc); g.lineWidth = 6;
    g.beginPath(); g.roundRect(x0, yb - 26, x1 - x0, 50, 25); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.roundRect(x0 + 30, yb - 18, (x1 - x0) * 0.4, 9, 5); g.fill();
  }
  g.restore();
  return P;
}
function hand(x, y, ang, a = 1, pinch = 0, sc = 1) {
  g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(ang); g.scale(sc, sc);
  g.fillStyle = css(SKIN); g.strokeStyle = INK; g.lineWidth = 7;
  g.beginPath(); g.roundRect(-60, -150, 120, 130, 44); g.fill(); g.stroke();
  g.beginPath(); g.roundRect(-22 - pinch * 6, -40, 30, 70, 15); g.fill(); g.stroke();   // index finger
  g.beginPath(); g.roundRect(10 + pinch * 6, -50, 30, 60, 15); g.fill(); g.stroke();     // thumb
  g.restore();
}
function shaker(x, y, tilt, a = 1) {
  g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(tilt);
  g.fillStyle = "rgb(236,240,248)"; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.roundRect(-70, -220, 140, 220, 30); g.fill(); g.stroke();
  g.fillStyle = "rgb(180,190,210)"; g.beginPath(); g.roundRect(-74, -10, 148, 54, 18); g.fill(); g.stroke();
  g.fillStyle = "#55607a"; [-30, 0, 30].forEach(dx => { g.beginPath(); g.arc(dx, 40, 6, 0, TAU2); g.fill(); });
  text("SALT", 0, -110, 44, "#3a4664", "center", 900);
  g.restore();
}
// salt grains falling between ts and te from the shaker mouth onto the thread line
function grains(t, ts, te, x0, y0, yLand, a = 1) {
  for (let i = 0; i < 46; i++) {
    const t0 = ts + hash(i, 1) * (te - ts), u = t - t0; if (u < 0) continue;
    const tx = x0 - 60 + hash(i, 2) * 220, fall = Math.min(1, u / 0.45), X = lerp(x0, tx, fall), Y = lerp(y0, yLand + hash(i, 3) * 26 - 13, fall * fall);
    dot(X, Y, 6 + hash(i, 4) * 3, SALT, a);
  }
}
function stopwatch(x, y, r, frac, label, a = 1) {
  if (a <= 0.01) return;
  dot(x, y, r + 14, PANELc, a); dot(x, y, r, [242, 245, 251], a);
  g.save(); g.globalAlpha = a; g.fillStyle = css(GOLDc); g.beginPath(); g.moveTo(x, y); g.arc(x, y, r - 10, -Math.PI / 2, -Math.PI / 2 + TAU2 * frac); g.closePath(); g.fill(); g.restore();
  line(x, y, x + Math.cos(-Math.PI / 2 + TAU2 * frac * 2) * (r - 16), y + Math.sin(-Math.PI / 2 + TAU2 * frac * 2) * (r - 16), [24, 38, 79], a, 8);
  rrect(x - 24, y - r - 46, 48, 30, 8, PANELc, a);
  text(label, x, y + r + 56, 64, GOLD, "center", 900, a);
}
const SCENES = {};

// 1 — hook: the thread drops onto a real cube in frame one (already moving)
SCENES.hook = (t, T, B, E, dur) => {
  room(); platter(); cube(CX, PLATE_Y, 0, 1, seg(t, 0.8, 1.6));
  const drop = clamp(0.08 + t / 1.5);
  thread(CX, PLATE_Y, 0, drop, 0);
  hand(CX + 330, lerp(PLATE_Y - CH - 300, PLATE_Y - CH - 40, eout(drop)) - 20, 0.25, 1 - seg(t, 1.7, 2.2), 1, 1.35);
  plate("wet thread", 290, 640, 50, INK, "center", seg(t, 1.0, 1.4), 900);
  MASR(T, t, { ev: [[0.5, "?"]], look, s: 0.42, x: 150, y: 1600 });
};
// 2 — salt: a pinch on the thread, then a quick cut to a stopwatch: about 2 minutes later
SCENES.salt = (t, T, B, E, dur) => {
  room(); platter();
  const melt = seg(t, 1.0, 2.2);
  cube(CX, PLATE_Y, 0, 1, 1); thread(CX, PLATE_Y, 0, 1, 0);
  const sa = 1 - seg(t, 1.9, 2.3);
  shaker(CX + 30 + Math.sin(t * 14) * 10 * sa, PLATE_Y - CH - 190 + Math.sin(t * 14) * 18 * sa, 0.12 * Math.sin(t * 14) * sa, sa);
  grains(t, 0.2, 1.7, CX + 30, PLATE_Y - CH - 150, PLATE_Y - CH - 30, 1 - 0.6 * melt);
  plate("pinch of salt", 290, 640, 50, INK, "center", win(t, 0.2, 2.2, 0.3), 900);
  // quick cut: the stopwatch spins two minutes in ~1.5 s
  const sw = seg(t, 2.1, 2.4), fr = eio((t - 2.3) / (dur - 2.6));
  if (sw > 0.01) {
    const s = Math.round(fr * 120);
    stopwatch(CX, 400, 140, fr, `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`, sw);
    plate("wait ~2 minutes", CX, 180, 58, INK, "center", sw, 900);
  }
  MASR(T, t, { ev: [[0.6, "!"]], look, s: 0.42, x: 150, y: 1600 });
};
// 3 — lift: the second visible event (~7–9 s). The hand gathers both ends and the cube comes up, swinging.
SCENES.lift = (t, T, B, E, dur) => {
  room(); platter();
  const up = eio((t - 0.25) / 1.1) * 330, sw = Math.sin((t - 1.2) * 3.4) * 0.06 * seg(t, 1.0, 1.5) * Math.exp(-Math.max(0, t - 1.5) * 0.6);
  // pivot at the hand: rotate the hanging cube about the hand position
  const hy = PLATE_Y - CH - 170 - Math.max(up, 0.001);
  g.save(); g.translate(CX, hy); g.rotate(sw); g.translate(-CX, -hy);
  cube(CX, PLATE_Y - up, 0, 1, 0.6); thread(CX, PLATE_Y - up, 0, 1, 0.001, 1, 1);
  g.restore();
  hand(CX + Math.sin(sw) * 0, hy + 20, 0, 1, 1);
  if (up > 200) soft(CX, PLATE_Y - CH - 30 - up, 110, [255, 255, 255], 0.25 * seg(t, 1.0, 1.5));
  MASR(T, t, { ev: [[1.2, "!", "grin"]], look, s: 0.42, x: 150, y: 1600 });
};
// 4 — why: magnified cross-section of the cube top with the thread (a circle). Salt makes a melt pocket,
// heat flows out of the ice into the melting (blue arrows), a thermometer drops below 0, then the salt spreads
// out and the water around the thread freezes again (crystal hatching closes over the thread).
SCENES.why = (t, T, B, E, dur) => {
  room();
  const X0 = 90, X1 = 990, SURF = 820, TX = 540, TR = 46;
  rrect(X0, SURF, X1 - X0, 320, 30, [206, 230, 252], 1);
  for (let i = 0; i < 9; i++) line(X0 + 40 + i * 100, SURF + 30, X0 + 90 + i * 100, SURF + 290, [180, 210, 240], 0.5, 4);
  text("ice cube (magnified)", 975, 1190, 44, INK, "right", 800);
  // stages: melt layer grows (whole first sentence and "colder than zero"), salt diluted, then new ice grips the thread
  const melt = seg(t, 0.2, B(1) + 2.0), spread = seg(t, B(1) + 2.0, B(1) + 4.0), refreeze = seg(t, B(1) + 3.6, B(1) + 5.6), pocket = melt * (1 - refreeze);
  const pr = 40 + 110 * pocket;
  if (pocket > 0.01) { g.save(); g.fillStyle = "rgba(90,160,240,0.9)"; g.beginPath(); g.ellipse(TX, SURF, pr * 1.9, pr * 0.9, 0, 0, Math.PI); g.fill(); g.restore(); }
  // the thread: sits on the surface, then the new ice closes round it and it ends up inside the ice
  const ty = SURF - TR + 4 + (TR + 18) * refreeze;
  // new ice band (bright, outlined) around the thread
  if (refreeze > 0.01) {
    g.save(); g.globalAlpha = refreeze; g.fillStyle = "rgb(240,250,255)"; g.strokeStyle = css(BLUEc); g.lineWidth = 8;
    g.beginPath(); g.ellipse(TX, SURF + 10, 230, 120, 0, Math.PI, TAU2); g.lineTo(TX + 230, SURF + 10); g.ellipse(TX, SURF + 10, 230, 110, 0, 0, Math.PI); g.closePath(); g.fill(); g.stroke(); g.restore();
  }
  dot(TX, ty, TR, THREAD); g.strokeStyle = "rgba(160,140,110,0.9)"; g.lineWidth = 6; g.beginPath(); g.arc(TX, ty, TR, 0, TAU2); g.stroke();
  if (refreeze > 0.01) { g.save(); g.globalAlpha = 0.45 * refreeze; g.fillStyle = "rgb(240,250,255)"; g.beginPath(); g.arc(TX, ty, TR + 2, 0, TAU2); g.fill(); g.restore(); }   // ice over the thread: it is inside
  plate("thread", TX - 250, SURF - 110, 48, INK, "center", 1 - seg(t, B(1) + 3.0, B(1) + 3.4), 900);
  if (refreeze > 0.01) { line(TX - 170, SURF - 70, TX - 240, SURF - 130, BLUEc, seg(t, B(1) + 4.6, B(1) + 5.0), 6); plate("new ice", TX - 290, SURF - 165, 56, BLUE, "center", seg(t, B(1) + 4.6, B(1) + 5.0), 900); }
  // salt ions in the melt layer, then spread thin by the meltwater
  for (let i = 0; i < 26; i++) {
    const a0 = hash(i, 5) * Math.PI, rr = hash(i, 6);
    const x = TX + Math.cos(a0) * (40 + 110 * melt) * 1.7 * rr * (1 + spread * 1.6) + Math.sin(T * 2 + i) * 5, y = SURF + Math.sin(a0) * (40 + 110 * melt) * 0.75 * rr + 8;
    dot(x, y, 9, GOLDc, melt * (1 - 0.75 * spread) * (1 - refreeze * 0.6));
  }
  // heat arrows: inside the ice, pointing at the melting layer
  const ha = win(t, B(0) + 1.4, B(1) + 3.8, 0.4);
  [[220, 1110], [540, 1120], [860, 1110]].forEach(([x, y], i) => { const ph = ((T * 0.9 + i * 0.33) % 1); arrow(x + (TX - x) * 0.1, y - ph * 40, x + (TX - x) * 0.35, y - 150 - ph * 40, CORALc, ha * (1 - ph * 0.5), 9, 28); });
  plate("salt melts a thin layer", 540, 290, 54, GOLD, "center", win(t, B(0), B(1) + 1.8, 0.3), 900);
  plate("melting pulls heat out", 540, 380, 54, CORAL, "center", win(t, B(0) + 1.4, B(1) + 1.8, 0.3), 900);
  plate("meltwater dilutes the salt", 540, 290, 54, GOLD, "center", win(t, B(1) + 1.9, E(1) + 0.4, 0.3), 900);
  plate("cold cube refreezes it", 540, 380, 54, BLUE, "center", seg(t, B(1) + 3.8, B(1) + 4.2), 900);
  // thermometer: 0 tick, the fill drifts below it while the layer melts
  const temp = -3 * seg(t, B(0) + 1.2, B(1) + 2.6), thx = 880, top = 470, tick = 560, k = 45;
  rrect(thx - 22, top, 44, 290, 22, [242, 245, 251], 1); dot(thx, top + 300, 40, [242, 245, 251]); dot(thx, top + 300, 30, BLUEc);
  rrect(thx - 12, tick - temp * k, 24, top + 300 - (tick - temp * k), 12, BLUEc, 1);
  line(thx - 36, tick, thx + 36, tick, INKc, 0.95, 5); text("0 °C", thx - 50, tick, 42, INK, "right", 800);
  if (temp < -1.4) text("below 0", thx - 50, tick - temp * k + 4, 42, BLUE, "right", 900, seg(-temp, 1.4, 1.8));
  MASR(T, t, { ev: [[B(1) + 4.8, "idea"]], look, s: 0.42, x: 150, y: 1600 });
};
// 5 — end: the cube hanging from the thread, lowered back onto the plate: loops into frame one
SCENES.end = (t, T, B, E, dur) => {
  room(); platter();
  const up = 220 * (1 - eio(t / (dur * 0.85)));
  cube(CX, PLATE_Y - up, 0, 1, 1); thread(CX, PLATE_Y - up, 0, 1, up > 1 ? 0.001 : 0, 1, 1);
  if (up > 1) hand(CX, PLATE_Y - CH - 170 - up + 20 + 0.001, 0, 1, 1);
  MASR(T, t, { ev: [[0.4, "ok", "smile"]], look, s: 0.42, x: 150, y: 1600 });
};
