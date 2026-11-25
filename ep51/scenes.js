// Episode 51 (Short v4, 1080×1920): pinch your nose and try to hum.
// Facts (claims.md): a closed-lip hum sends its air out through the nose; pinched shut, the air collects above the
// vocal folds, the pressure there rises until it almost matches the lungs (voicing stops when the drop across the
// folds falls below ~1–2 cm H2O, Ohala / Hoole), and with no push across them the folds stop vibrating.
// The fade is drawn in slow motion (labelled); the head cutaway and the bars are a sketch, not to scale.
window.NOPUSH = ["hook", "try", "end"];
window.NODIP = ["try"];
const SKINc = [246, 227, 211], SKIN_OUT = "#c99a80", HAIRc = "#6e4426", HAIR2 = "#a06a3c", SHIRTc = "#bcd6f2";
const AIR_D = "#a8455a", AIR_L = "#f0a3a3", DOTc = [255, 255, 255];
const DY = 40;                     // the whole head is drawn 40 px lower than its design coordinates
const NOSE = [182, 885];           // nose tip (design coordinates)
// airway centre line, from the bottom of the windpipe up to the nostril (design coordinates)
const PATH = [[515, 1440], [515, 1300], [518, 1230], [522, 1100], [524, 990], [520, 905], [470, 868], [380, 858], [300, 876], [256, 894]];
const MOUTH = [[522, 990], [470, 990]];
const FOLDS_Y = 1235;
function along(P, s) {   // point at fraction s of a polyline
  const L = []; let tot = 0; for (let i = 1; i < P.length; i++) { const d = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); L.push(d); tot += d; }
  let r = clamp(s) * tot; for (let i = 0; i < L.length; i++) { if (r <= L[i]) { const u = r / L[i]; return [lerp(P[i][0], P[i + 1][0], u), lerp(P[i][1], P[i + 1][1], u)]; } r -= L[i]; }
  return P[P.length - 1];
}
function room() {
  const gr = g.createRadialGradient(540, 900, 80, 540, 900, 1100);
  gr.addColorStop(0, "rgb(120,142,198)"); gr.addColorStop(0.6, "rgb(70,92,156)"); gr.addColorStop(1, "rgb(30,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

// ---------- the state of the hum, as functions of global time T ----------
// A: loudness of the hum (0..1); P: pressure above the folds as a share of the lungs (0..1); pinch: 0 open .. 1 shut
function state(T) {
  const S = SC_(), hk = S.hook, tr = S.try, st = S.stop, wy = S.why, en = S.end;
  let A = 0, P = 0, pinch = 0, hand = 0, flow = 0;
  const b = i => wy.start + wy.beats[i].start;
  if (T < st.start) {                                   // hook + try: pinched, humming, fading (slow motion)
    hand = clamp(0.6 + T / 0.7 * 0.4); pinch = hand;
    A = seg(T, 1.1, 1.5) * lerp(1, 0.4, eio((T - 2.6) / (st.start - 2.6)));
    P = 0.82 * eio((T - 1.1) / (st.start - 1.1));
  } else if (T < wy.start) {                            // stop: the hum dies
    const u = T - st.start; hand = 1; pinch = 1;
    A = 0.4 * (1 - seg(u, 0.12, 0.35)); P = lerp(0.82, 0.95, seg(u, 0, 0.5));
  } else if (T < b(1) + 0.2) {                          // why 0: open nose, air flows out, a full hum
    A = seg(T, wy.start + 0.2, wy.start + 0.5); P = 0.12 * A; flow = 1;
  } else if (T < b(2) - 0.3) {                          // why 1: pinched, air piles up
    const u = T - (b(1) + 0.2); hand = clamp(0.4 + u / 0.3); pinch = hand;
    A = lerp(1, 0.35, eio(u / 3.6)); P = lerp(0.12, 0.72, eio(u / 3.6)); flow = 1 - seg(u, 0, 0.3);
  } else if (T < en.start) {                            // why 2–3 (zoom): pressure almost matches, folds stop
    hand = 1; pinch = 1;
    const u2 = T - b(2); P = lerp(0.72, 0.95, eio(u2 / 2.6));
    A = T < b(3) ? lerp(0.35, 0.22, seg(u2, 0, 3)) : 0.22 * (1 - seg(T, b(3) + 1.3, b(3) + 1.7));
  } else {                                              // end: let go (the air rushes out), then reach for the nose again
    const u = T - en.start;
    hand = u < 0.6 ? 1 - eio(u / 0.6) : 0.6 * eio((u - 1.6) / (en.dur - 1.6 - 0.02));
    pinch = u < 0.6 ? hand : hand; P = 0.95 * (1 - seg(u, 0.1, 0.7)); flow = u < 1.2 ? (1 - seg(u, 0.7, 1.2)) * 2.2 : 0;
  }
  return { A, P, pinch, hand, flow };
}
let _SC = null; function SC_() { if (!_SC) _SC = Object.fromEntries(TL.scenes.map(s => [s.id, s])); return _SC; }

// ---------- drawing ----------
function waveform(T, A, opt = {}) {   // the hum's sound wave across the top: it scrolls while there is a hum
  const y0 = 350, h = 130, x0 = 60, x1 = 920;
  rrect(x0, y0, x1 - x0, h, 26, PANELc, 0.95);
  text("your hum", x0 + 26, y0 + h / 2, 42, INK, "left", 800);
  const cy = y0 + h / 2, wx0 = 300, wx1 = x1 - 26, pts = [];
  for (let x = wx0; x <= wx1; x += 4) {
    const k = (x - wx0) / (wx1 - wx0), env = Math.sin(Math.PI * k) ** 0.3;
    const y = Math.sin(x * 0.11 - T * 14) * 0.65 + Math.sin(x * 0.23 - T * 21) * 0.25 + Math.sin(x * 0.047 - T * 6) * 0.1;
    pts.push([x, cy + y * 50 * A * env]);
  }
  const dead = A < 0.02 && (opt.silent || 0) > 0;
  poly(pts, dead ? CORAL : GOLD, 1, dead ? 7 : 6);
  if (opt.slow) plate("slow motion", 780, y0 - 34, 40, QUIET, "center", opt.slow, 800);
  if (opt.silent) plate("silence", 610, cy, 60, CORAL, "center", opt.silent, 900);
}
function bars(x, y, h, P, a = 1, big = false) {   // two pressure bars: lungs (fixed) and above the folds (P)
  if (a <= 0.01) return;
  const bw = big ? 84 : 64, gap = big ? 150 : 140, fs = big ? 42 : 40;
  if (!big) rrect(x - 70, y - 82, gap + 140, h + 150, 24, PANELc, 0.92 * a);
  [[x, 1, GOLDc, "lungs"], [x + gap, P, CORALc, "above"]].forEach(([bx, v, c, lab]) => {
    rrect(bx - bw / 2, y, bw, h, 16, [242, 245, 251], a);
    rrect(bx - bw / 2 + 8, y + 8 + (h - 16) * (1 - v), bw - 16, (h - 16) * v, 10, c, a);
    text(lab, bx, y + h + fs * 0.85, fs, c, "center", 900, a);
  });
  text("pressure", x + gap / 2, y - fs * 0.85, fs, INK, "center", 800, a);
}
function hand(h, pinch) {   // thumb and index clamp the nose from the front; h = how far the hand has come in
  if (h <= 0.01) return;
  const ox = -190 * (1 - h), oy = 170 * (1 - h), gp = 34 * (1 - pinch);
  const ix = NOSE[0] + 22 + ox, iy = NOSE[1] - 14 - gp + oy, tx = NOSE[0] + 30 + ox, ty = NOSE[1] + 30 + gp + oy;
  const fx = 70 + ox, fy = 975 + oy;
  const finger = (x1, y1, cx, cy, x2, y2) => {
    g.lineCap = "round"; g.lineJoin = "round";
    g.strokeStyle = SKIN_OUT; g.lineWidth = 56; g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo(cx, cy, x2, y2); g.stroke();
    g.strokeStyle = css(SKINc); g.lineWidth = 42; g.beginPath(); g.moveTo(x1, y1); g.quadraticCurveTo(cx, cy, x2, y2); g.stroke();
  };
  g.save();
  // fist (palm turned to us), then the two fingers
  g.fillStyle = css(SKINc); g.strokeStyle = SKIN_OUT; g.lineWidth = 8;
  g.beginPath(); g.roundRect(fx - 95, fy - 60, 150, 190, 60); g.fill(); g.stroke();
  [0, 1, 2].forEach(i => { g.beginPath(); g.roundRect(fx - 40 + i * 6, fy + 10 + i * 40, 90, 40, 20); g.fill(); g.stroke(); });   // curled fingers
  finger(fx + 10, fy - 30, ix - 70, iy - 70, ix, iy);          // index finger, over the nose
  finger(fx + 30, fy + 30, tx - 60, ty + 30, tx, ty);           // thumb, under the nose
  // nails
  dot(ix - 6, iy - 6, 9, [255, 240, 232]); dot(tx - 6, ty + 4, 9, [255, 240, 232]);
  g.restore();
  if (pinch > 0.95) [[-1], [1]].forEach(([s], i) => line(NOSE[0] - 14 - 18 * i + ox, NOSE[1] + 6 + s * 0 - 40 + 70 * i, NOSE[0] - 44 - 18 * i + ox, NOSE[1] - 4 - 40 + 70 * i + s * 10, INKc, 0.8, 6));
}
// the head in profile (facing left), with the airway cut away. o: {A, P, pinch, hand, flow, brow, look}
function profile(T, o) {
  g.save(); g.translate(0, DY);
  const puff = clamp((o.P - 0.35) / 0.55);
  // neck and collar
  g.fillStyle = css(SKINc); g.strokeStyle = SKIN_OUT; g.lineWidth = 8;
  g.beginPath(); g.moveTo(440, 1120); g.lineTo(440, 1420); g.lineTo(690, 1420); g.lineTo(690, 1040); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#22273a"; g.beginPath(); g.moveTo(340, 1460); g.quadraticCurveTo(380, 1380, 450, 1372); g.lineTo(690, 1372); g.quadraticCurveTo(780, 1380, 820, 1460); g.closePath(); g.fill();
  g.fillStyle = SHIRTc; g.beginPath(); g.moveTo(430, 1376); g.lineTo(470, 1340); g.lineTo(520, 1400); g.lineTo(560, 1340); g.lineTo(660, 1340); g.lineTo(700, 1376); g.lineTo(560, 1460); g.closePath(); g.fill();
  // hair (back), skull, face front
  g.fillStyle = HAIRc; g.beginPath(); g.ellipse(625, 760, 330, 312, 0, 0, TAU2); g.fill();
  g.fillStyle = css(SKINc); g.beginPath(); g.ellipse(590, 850, 312, 290, 0, 0, TAU2); g.fill();
  const F = [[360, 560], [300, 640], [272, 730], [258, 790], [240, 815], [205, 852], [NOSE[0], NOSE[1]], [188, 905], [218, 916], [240, 920], [248, 948], [240, 972], [246, 990], [238, 1010], [252, 1040], [264, 1078], [300, 1112], [380, 1138], [450, 1140], [520, 1110]];
  // cheek bulge when the mouth fills with air
  const cheek = [[264, 1078], [300 - 10 * puff, 1080 + 14 * puff], [360 - 6 * puff, 1060 + 18 * puff]];
  g.beginPath(); F.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.lineTo(600, 900); g.closePath(); g.fill();
  if (puff > 0.02) { g.beginPath(); g.ellipse(330, 1030, 70 + 26 * puff, 40 + 24 * puff, 0.3, 0, TAU2); g.fill(); }
  g.strokeStyle = SKIN_OUT; g.lineWidth = 7; g.lineJoin = "round"; g.beginPath(); F.slice(3, 18).forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
  if (puff > 0.05) { g.strokeStyle = `rgba(201,154,128,${puff})`; g.beginPath(); g.ellipse(330, 1030, 70 + 26 * puff, 40 + 24 * puff, 0.3, 1.9, 3.6); g.stroke(); }
  // fringe swept forward
  g.fillStyle = HAIRc; g.beginPath(); g.moveTo(640, 470); g.quadraticCurveTo(420, 440, 300, 560); g.lineTo(262, 640); g.lineTo(330, 610); g.lineTo(318, 680); g.lineTo(390, 620); g.lineTo(410, 690); g.lineTo(470, 620); g.lineTo(520, 660); g.lineTo(560, 600); g.closePath(); g.fill();
  g.strokeStyle = HAIR2; g.lineWidth = 9; g.lineCap = "round"; [[600, 500, 440, 500, 330, 580], [720, 520, 560, 520, 420, 600], [860, 640, 820, 540, 700, 500]].forEach(([a, b, c, d, e, f]) => { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo(c, d, e, f); g.stroke(); });
  // ear and earbud
  g.fillStyle = css(SKINc); g.strokeStyle = SKIN_OUT; g.lineWidth = 7; g.beginPath(); g.ellipse(690, 860, 40, 58, 0.1, 0, TAU2); g.fill(); g.stroke();
  g.fillStyle = "#F2F5FB"; g.beginPath(); g.ellipse(684, 858, 20, 24, 0, 0, TAU2); g.fill(); g.beginPath(); g.roundRect(678, 872, 14, 54, 7); g.fill();
  // eye, brow, glasses (side view)
  const ey = 792 - 6 * (o.brow || 0);
  g.fillStyle = "#1b1e2c"; g.beginPath(); g.ellipse(318, 800, 13, 22, 0, 0, TAU2); g.fill(); dot(314, 791, 5, [242, 245, 251]);
  g.strokeStyle = "#6e4426"; g.lineWidth = 9; g.beginPath(); g.moveTo(290, ey - 44); g.quadraticCurveTo(320, ey - 58 - 10 * (o.brow || 0), 360, ey - 46); g.stroke();
  g.strokeStyle = "#111421"; g.lineWidth = 10; g.beginPath(); g.roundRect(290, 762, 56, 78, 14); g.stroke();
  g.beginPath(); g.moveTo(346, 780); g.lineTo(664, 800); g.stroke();
  // lips (closed) and blush
  g.strokeStyle = "#b5615c"; g.lineWidth = 8; g.beginPath(); g.moveTo(244, 990); g.lineTo(270, 992); g.stroke();
  g.fillStyle = "rgba(255,120,130,0.35)"; g.beginPath(); g.ellipse(360 - 10 * puff, 960, 34, 18, 0, 0, TAU2); g.fill();
  // ---- airway cutaway ----
  const airPath = P => { g.beginPath(); P.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); };
  g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = AIR_D; g.lineWidth = 54; airPath(PATH); g.stroke();
  g.fillStyle = AIR_D; g.beginPath(); g.ellipse(410, 992, 118, 24 + 30 * puff, 0, 0, TAU2); g.fill();
  g.strokeStyle = AIR_L; g.lineWidth = 38; airPath(PATH); g.stroke();
  g.fillStyle = AIR_L; g.beginPath(); g.ellipse(410, 992, 106, 14 + 30 * puff, 0, 0, TAU2); g.fill();
  g.strokeStyle = AIR_L; g.lineWidth = 30; airPath(MOUTH.slice(0, 2)); g.stroke();
  // nostril: open (a gap to the outside) or shut (pinched)
  g.fillStyle = css(SKINc); if (o.pinch > 0.9) { g.beginPath(); g.ellipse(236, 898, 22, 22, 0, 0, TAU2); g.fill(); }
  // vocal folds: two small wedges in the windpipe; they buzz while there is a hum
  const vib = o.A > 0.03 ? Math.abs(Math.sin(T * 2 * Math.PI * 6)) * 9 * Math.min(1, o.A * 2) : 0;
  g.fillStyle = "#e46f6f"; g.strokeStyle = "#7a2c3c"; g.lineWidth = 4;
  [[-1], [1]].forEach(([s]) => { g.beginPath(); g.moveTo(518 + s * 27, FOLDS_Y - 14); g.lineTo(518 + s * (4 + vib), FOLDS_Y); g.lineTo(518 + s * 27, FOLDS_Y + 14); g.closePath(); g.fill(); g.stroke(); });
  if (o.A > 0.05) for (let i = 0; i < 3; i++) { const ph = (T * 2.2 + i / 3) % 1, r = 40 + ph * 70; g.save(); g.globalAlpha = (1 - ph) * Math.min(1, o.A * 1.6); g.strokeStyle = css(GOLDc); g.lineWidth = 6; g.beginPath(); g.arc(518, FOLDS_Y, r, -0.5, 0.5); g.stroke(); g.beginPath(); g.arc(518, FOLDS_Y, r, Math.PI - 0.5, Math.PI + 0.5); g.stroke(); g.restore(); }
  // air: dots flowing up the airway and out of the nose (open), or piling up (pinched)
  const N = 34;
  for (let i = 0; i < N; i++) {
    const ph = hash(i, 1);
    if (o.flow > 0.01) {
      const s = (ph + T * 0.32 * o.flow) % 1.25; let p;
      if (s <= 1) p = along(PATH, s); else { const k = (s - 1) / 0.25; p = [250 - 280 * k, 905 + 30 * k + (hash(i, 2) - 0.5) * 80 * k]; }
      dot(p[0], p[1], 9, DOTc, o.flow * (s > 1 ? 1 - (s - 1) / 0.25 : 1) * 0.95);
    }
  }
  const nTrap = Math.round(46 * o.P * (o.flow > 0.5 ? 0 : 1));
  for (let i = 0; i < nTrap; i++) {
    const r = hash(i, 3), jit = Math.sin(T * 9 + i) * 3;
    let p;
    if (r < 0.42) p = along(PATH, 0.42 + hash(i, 4) * 0.56);                 // throat and nose
    else if (r < 0.85) { const a = hash(i, 5) * TAU2, k = Math.sqrt(hash(i, 6)); p = [410 + Math.cos(a) * 100 * k, 992 + Math.sin(a) * (12 + 28 * puff) * k]; }   // mouth
    else p = along(PATH, 0.2 + hash(i, 4) * 0.22);
    dot(p[0] + jit, p[1] + (hash(i, 7) - 0.5) * 18, 8, [255, 255, 255], 0.95);
  }
  g.restore();
  // the hand, in screen space (drawn after the head so it sits in front of the nose)
  g.save(); g.translate(0, DY); hand(o.hand, o.pinch); g.restore();
}

// ---------- zoom: the vocal folds, close up (coronal cut through the windpipe) ----------
function zoom(T, t, o, dur, B, E, stage) {
  room();
  const L0 = 400, R0 = 800, cx = 600, FY = 1010, top = 560, bot = 1470;
  // windpipe walls
  rrect(L0 - 70, top, 70, bot - top, 30, SKINc, 1, SKIN_OUT, 6); rrect(R0, top, 70, bot - top, 30, SKINc, 1, SKIN_OUT, 6);
  g.fillStyle = "rgb(170,70,90)"; g.fillRect(L0, top, R0 - L0, bot - top);
  // above: coral air whose density follows P; below: gold air from the lungs, always dense
  for (let i = 0; i < 70; i++) {
    const x = L0 + 20 + hash(i, 1) * (R0 - L0 - 40), y = FY + 60 + hash(i, 2) * (bot - FY - 90) + Math.sin(T * 5 + i) * 4;
    dot(x, y, 10, GOLDc, 0.95);
  }
  const nA = Math.round(70 * o.P);
  for (let i = 0; i < nA; i++) {
    const x = L0 + 20 + hash(i, 3) * (R0 - L0 - 40), y = top + 20 + hash(i, 4) * (FY - top - 80) + Math.sin(T * 5 + i) * 4;
    dot(x, y, 10, CORALc, 0.95);
  }
  // the folds: two thick wedges; they flap while the push lasts, then stay shut
  const vib = o.A > 0.03 ? Math.abs(Math.sin(T * 2 * Math.PI * 3)) * 46 * Math.min(1, o.A * 4) : 0;
  g.fillStyle = "#f08f8f"; g.strokeStyle = "#7a2c3c"; g.lineWidth = 7;
  [[-1, L0], [1, R0]].forEach(([s, x]) => { g.beginPath(); g.moveTo(x, FY - 80); g.quadraticCurveTo(cx - s * 60, FY - 40, cx + s * (2 + vib), FY); g.quadraticCurveTo(cx - s * 60, FY + 40, x, FY + 80); g.closePath(); g.fill(); g.stroke(); });
  // the push across the folds: an arrow that shrinks as P climbs
  const push = clamp((1 - o.P) / 0.3);
  if (push > 0.05) arrow(cx, FY + 300, cx, FY + 300 - 230 * push, INKc, 1, 18, 50);
  const lab = stage.still > 0.5 ? "folds stop" : "vocal folds";
  plate(lab, cx, FY - 170, 54, stage.still > 0.5 ? GOLD : INK, "center", 1, 900); arrow(cx + 150, FY - 130, cx + 110, FY - 50, INKc, 1, 7, 22);
  bars(95, 760, 470, o.P, 1, true);
  plate("air above", cx, top + 90, 44, CORAL, "center", 1, 900);
  plate("air from lungs", cx, bot - 120, 44, GOLD, "center", 1, 900);
  if (stage.nopush > 0.01) plate("no push", cx, FY + 200, 60, CORAL, "center", stage.nopush, 900);
  waveform(T, o.A, { silent: stage.silent || 0 });
}

const SCENES = {};
// 1 — hook: the hand is already closing on the nose in frame one; the hum starts at ~1.1 s
SCENES.hook = (t, T, B, E, dur) => {
  room(); const o = state(T); profile(T, o); bars(730, 1170, 190, o.P); waveform(T, o.A);
};
// 2 — try: keep humming; the hum fades (slow motion) while the pressure above the folds climbs and the mouth fills
SCENES.try = (t, T, B, E, dur) => {
  room(); const o = state(T); profile(T, o); bars(730, 1170, 190, o.P); waveform(T, o.A, { slow: seg(t, 0.3, 0.7) });
  plate("air is trapped", 330, 1205, 46, INK, "center", seg(t, 1.6, 2.0), 900);
};
// 3 — stop: the second visible event. The waveform flatlines, the bars are almost level, the mouth is full of air.
SCENES.stop = (t, T, B, E, dur) => {
  room(); const o = state(T); o.brow = seg(t, 0.1, 0.4); profile(T, o); bars(730, 1170, 190, o.P);
  waveform(T, o.A, { silent: seg(t, 0.35, 0.6) });
  if (t > 0.15 && t < 0.6) soft(540, 415, 420, [255, 138, 122], 0.5 * (1 - seg(t, 0.15, 0.6)));
  plate("hum stopped", 540, 240, 60, CORAL, "center", seg(t, 0.25, 0.5) * (1 - seg(t, 1.3, 1.5)), 900);
  plate("air fills your mouth", 540, 240, 60, INK, "center", seg(t, 1.45, 1.7), 900);
  if (t > 1.6) arrow(400, 1205, 395, 1070, INKc, seg(t, 1.6, 1.9), 8, 26);
  plate("mouth full", 330, 1225, 46, INK, "center", seg(t, 1.6, 1.9), 900);
};
// 4 — why: open nose (air out) → pinched (air piles up above the folds) → cut to the folds close up
SCENES.why = (t, T, B, E, dur) => {
  const o = state(T);
  if (t < B(2) - 0.3) {
    room(); profile(T, o); bars(730, 1170, 190, o.P); waveform(T, o.A);
    plate("nose open", 540, 240, 60, GOLD, "center", seg(t, 0.15, 0.4) * (1 - seg(t, B(1), B(1) + 0.15)), 900);
    plate("air out the nose", 230, 1010 - 230, 46, INK, "center", seg(t, 1.2, 1.5) * (1 - seg(t, B(1), B(1) + 0.15)), 900);
    plate("nose shut", 540, 240, 60, CORAL, "center", seg(t, B(1) + 0.15, B(1) + 0.35), 900);
    const pa = seg(t, B(1) + 1.5, B(1) + 1.8);
    plate("air piles up", 300, 1200, 46, INK, "center", pa, 900);
    const fa = seg(t, B(1) + 2.6, B(1) + 2.9);
    if (fa > 0.01) { arrow(330, 1290, 482, FOLDS_Y + DY + 2, GOLDc, fa, 8, 26); plate("vocal folds", 250, 1320, 46, GOLD, "center", fa, 900); }
  } else {
    const u2 = t - B(2);
    zoom(T, t, o, dur, B, E, {
      almost: seg(t, B(2) + 2.4, B(2) + 2.7),
      nopush: seg(t, B(3) + 0.2, B(3) + 0.5),
      still: seg(t, B(3) + 1.6, B(3) + 1.9),
      silent: seg(t, B(3) + 2.6, B(3) + 2.9),
    });
    plate("inside your throat", 540, 240, 60, INK, "center", 1 - seg(u2, 0.85, 1.0), 900);
    plate("pressure climbs", 540, 240, 60, CORAL, "center", seg(u2, 1.0, 1.2) * (1 - seg(t, B(2) + 2.3, B(2) + 2.45)), 900);
    plate("almost equal", 540, 240, 60, CORAL, "center", seg(t, B(2) + 2.45, B(2) + 2.7) * (1 - seg(t, B(3) + 1.5, B(3) + 1.65)), 900);
    plate("no push, no hum", 540, 240, 60, GOLD, "center", seg(t, B(3) + 1.65, B(3) + 1.9), 900);
  }
};
// 5 — end: let go (the air rushes out), then the hand comes back to the nose: loops into frame one
SCENES.end = (t, T, B, E, dur) => {
  room(); const o = state(T); profile(T, o); bars(730, 1170, 190, o.P); waveform(T, o.A);
  plate("let go", 540, 240, 60, GOLD, "center", seg(t, 0.1, 0.3) * (1 - seg(t, 1.3, 1.5)), 900);
};
