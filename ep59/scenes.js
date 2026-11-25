// Episode 59 (v5 Short, 1080×1920, "Animals Explained"): how a falling cat turns to land on its feet.
// Facts (claims.md): Marey's chronophotographs (1894, Comptes Rendus) showed a cat dropped with no spin still turned
// over; physicists suspected it pushed off the hand. A rigid body cannot do that, but a cat is not rigid: it bends at
// the middle so front and back halves turn about different axes (Kane & Scher 1969 model), tucks its front legs so the
// front half turns a lot (up to ~90° per step) while the stretched back half turns back only a little (~10°), then
// swaps. The reflex appears at 3–4 weeks and is perfected at 6–9 weeks; from below ~0.3–0.6 m there is not enough time.
// Pictures are schematic, not to scale; the roll of each half is drawn as a cylinder seen from the side.
window.NOPUSH = ["hook", "guess", "bend", "front", "back", "low", "end"];
window.NODIP = window.NOPUSH;
// Animals palette (shared with ep55): night plum, berry panel, amber; tabby orange cat
const FUR = [240, 150, 62], FURD = [196, 104, 36], STRIPE = [150, 72, 26], BELLY = [255, 238, 214], NOSE = [236, 120, 130];
const AMBER = [255, 181, 71], NOPE = [255, 110, 100], COOLC = [150, 236, 180], SEPIA = [236, 214, 176], SEPD = [120, 92, 60], INKW = [255, 240, 244];
function warmbg() { const gr = g.createRadialGradient(W / 2, 820, 60, W / 2, 900, 1250); gr.addColorStop(0, "rgb(96,40,70)"); gr.addColorStop(1, "rgb(34,12,30)"); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function cam(s, cx, cy, sx = W / 2, sy = 820) { g.setTransform(s, 0, 0, s, sx - cx * s, sy - cy * s); }
function camReset() { g.setTransform(1, 0, 0, 1, 0, 0); }
const MAS = (T, t, ev, o = {}) => MASR(T, t, { x: 150, y: 1585, s: 0.6, ev, ...o });
// falling: speed streaks and wall marks that slide upward (fall speed v px/s)
function fallBg(T, v = 900, a = 1) {
  warmbg();
  for (let i = 0; i < 26; i++) { const x = 60 + hash(i, 1) * 960, y = ((hash(i, 2) * 2200 - T * v * (0.7 + 0.6 * hash(i, 3))) % 2200 + 2200) % 2200 - 140, L = 60 + 160 * hash(i, 4);
    line(x, y, x, y + L, [255, 220, 236], 0.16 * a, 5); }
  for (let i = 0; i < 4; i++) { const y = ((i * 560 - T * v * 0.5) % 2240 + 2240) % 2240 - 160; rrect(900, y, 150, 220, 18, [120, 56, 92], 0.5 * a, [160, 86, 126], 6); }   // window frames on the wall
}
// one half of the cat, drawn in a frame whose origin is the waist; side +1 front (head), -1 back (tail).
// ph = roll angle of that half about its own long axis (0 = feet down, PI = feet up); leg = leg length (tucked short)
function catHalf(side, len, rad, ph, leg, T, o = {}) {
  const c = Math.cos(ph), s = Math.sin(ph), col = o.sep ? SEPIA : FUR, cold = o.sep ? SEPD : FURD, bel = o.sep ? [250, 240, 222] : BELLY, str = o.sep ? SEPD : STRIPE;
  const legs = (front) => [-1, 1].forEach(k => {
    const lx = side * (len * 0.72 + k * rad * 0.28), dz = s + k * 0.25; if ((dz > 0) !== front) return;
    const y0 = rad * 0.55 * c, y1 = (rad * 0.55 + leg) * c, w = rad * 0.36;
    g.save(); g.strokeStyle = css(k > 0 ? col : cold); g.lineCap = "round"; g.lineWidth = w; g.beginPath(); g.moveTo(lx, y0); g.lineTo(lx + side * leg * 0.08, y1); g.stroke();
    dot(lx + side * leg * 0.08, y1, w * 0.62 * (1 + 0.25 * Math.abs(s)), bel, 1); g.restore();
  });
  legs(false);
  // body capsule
  g.save(); g.beginPath(); const x0 = side > 0 ? -rad * 0.2 : -len, x1 = side > 0 ? len : rad * 0.2; g.roundRect(x0, -rad, x1 - x0, 2 * rad, rad); g.fillStyle = css(col); g.fill();
  g.lineWidth = 6; g.strokeStyle = css(cold); g.stroke(); g.clip();
  // belly band and back stripes move with the roll
  g.fillStyle = css(bel); g.beginPath(); g.ellipse((x0 + x1) / 2, rad * 0.95 * c, (x1 - x0) * 0.55, rad * (0.35 + 0.4 * Math.abs(s)), 0, 0, TAU2); g.fill();
  g.strokeStyle = css(str); g.lineWidth = rad * 0.16; g.lineCap = "round";
  for (let i = 0; i < 4; i++) { const xx = x0 + (x1 - x0) * (0.18 + i * 0.2), yb = -rad * 0.95 * c; g.beginPath(); g.moveTo(xx - 10, yb - rad * 0.4 * Math.abs(s) - 10); g.lineTo(xx + 10, yb + rad * 0.4 * Math.abs(s) + 10); g.globalAlpha = 0.85; g.stroke(); }
  g.restore();
  if (side > 0) { // head
    const hx = len + rad * 0.55, hr = rad * 1.02;
    [-1, 1].forEach(k => { const ex = hx + k * hr * 0.42 * (0.4 + 0.6 * Math.abs(c)), ey = -hr * 0.78 * c, dz = k * s; if (dz > 0.2) return;   // ears point away from the feet
      g.fillStyle = css(k > 0 ? col : cold); g.beginPath(); g.moveTo(ex - hr * 0.3, -hr * 0.35 * c); g.lineTo(ex, ey - hr * 0.55 * c); g.lineTo(ex + hr * 0.3, -hr * 0.35 * c); g.closePath(); g.fill(); });
    dot(hx, 0, hr, col, 1); g.lineWidth = 6; g.strokeStyle = css(cold); g.beginPath(); g.arc(hx, 0, hr, 0, TAU2); g.stroke();
    // muzzle and face turn with the roll
    dot(hx + hr * 0.55, hr * 0.28 * c, hr * 0.42, bel, 1); dot(hx + hr * 0.9, hr * 0.12 * c, hr * 0.12, NOSE, 1);
    const eo = o.eyes ?? 1; dot(hx + hr * 0.3, -hr * 0.18 * c, hr * 0.17, [40, 120, 60], eo); dot(hx + hr * 0.34, -hr * 0.18 * c, hr * 0.08, [10, 10, 14], eo);
    [-1, 1].forEach(k => { const ex = hx + k * hr * 0.42 * (0.4 + 0.6 * Math.abs(c)), ey = -hr * 0.78 * c; if (k * s <= 0.2) return;
      g.fillStyle = css(col); g.beginPath(); g.moveTo(ex - hr * 0.3, -hr * 0.35 * c); g.lineTo(ex, ey - hr * 0.55 * c); g.lineTo(ex + hr * 0.3, -hr * 0.35 * c); g.closePath(); g.fill(); });
  } else { // tail: curls on the back side
    g.save(); g.strokeStyle = css(col); g.lineWidth = rad * 0.34; g.lineCap = "round"; g.beginPath(); g.moveTo(-len, -rad * 0.3 * c);
    const wag = 0.35 * Math.sin(T * 4.5);
    g.bezierCurveTo(-len - rad * 1.2, -rad * (0.6 + wag) * c, -len - rad * 1.6, -rad * (1.6 + wag) * c, -len - rad * 0.9, -rad * (2.3 + wag) * c); g.stroke();
    g.strokeStyle = css(str); g.lineWidth = rad * 0.34; g.beginPath(); g.moveTo(-len - rad * 1.05, -rad * (2.0 + wag) * c); g.lineTo(-len - rad * 0.9, -rad * (2.3 + wag) * c); g.stroke(); g.restore();
  }
  legs(true);
}
// whole cat: waist at (x, y), bend b (rad, V with the waist low), roll of front and back halves, leg lengths
function cat(x, y, sc, st, T, o = {}) {
  const len = 300, rad = 92;
  g.save(); g.translate(x, y); g.scale(sc, sc);
  g.save(); g.rotate(st.b); catHalf(-1, len, rad, st.pb, st.lb, T, o); g.restore();
  g.save(); g.rotate(-st.b); catHalf(1, len, rad, st.pf, st.lf, T, o); g.restore();
  g.restore();
}
// roll arrow around a half's axis (a little ellipse arc with a head), drawn in screen space
function rollArrow(x, y, r, dir, a, col, rot = 0) {
  if (a <= 0.01) return; g.save(); g.translate(x, y); g.rotate(rot); g.globalAlpha = a; g.strokeStyle = css(col); g.lineWidth = 14; g.lineCap = "round";
  const rx = r * 0.36, a0 = -1.3, a1 = 1.3; g.beginPath(); g.ellipse(0, 0, rx, r, 0, a0, a1); g.stroke();
  const at = dir > 0 ? a1 : a0, ex = rx * Math.cos(at), ey = r * Math.sin(at), tx = -rx * Math.sin(at) * dir, ty = r * Math.cos(at) * dir, n = Math.hypot(tx, ty), ux = tx / n, uy = ty / n;
  g.fillStyle = css(col); g.beginPath(); g.moveTo(ex + ux * 34, ey + uy * 34); g.lineTo(ex - uy * 26, ey + ux * 26); g.lineTo(ex + uy * 26, ey - ux * 26); g.closePath(); g.fill();
  g.restore();
}
const ringF = (b, a, col = AMBER) => rollArrow(CX + 150 * Math.cos(b), CY - 150 * Math.sin(b), 165, 1, a, col, -b);
const ringB = (b, a, col = COOLC) => rollArrow(CX - 150 * Math.cos(b), CY - 150 * Math.sin(b), 165, -1, a, col, b);
const CX = 560, CY = 770;
const UP = { b: 0, pf: Math.PI, pb: Math.PI, lf: 150, lb: 150 };
const SCENES = {};
// 1 — hook: a cat falls upside down past the wall; from 1.6 s its front half flips over (the weird result first)
SCENES.hook = (t, T, B, E, dur) => {
  fallBg(T); cam(lerp(1.0, 1.08, t / dur), CX, CY);
  const k = eio((t - 1.6) / 1.6), b = 0.32 * eio((t - 1.1) / 0.6) * (1 - 0.3 * k);
  cat(CX, CY + 10 * Math.sin(T * 2), 1.0, { b, pf: Math.PI * (1 - 0.95 * k), pb: Math.PI * (1 + 0.12 * k), lf: lerp(150, 70, eio((t - 1.1) / 0.5)), lb: 150 }, T);
  camReset();
  MAS(T, t, [[0.3, "?"], [2.2, "!"]]);
};
// small stylised hand that lets go (screen space)
function hand(x, y, open, sep) {
  const c = sep ? SEPIA : [244, 196, 166], d = sep ? SEPD : [214, 156, 124];
  g.save(); g.translate(x, y); g.fillStyle = css(c); g.strokeStyle = css(d); g.lineWidth = 5;
  g.beginPath(); g.roundRect(-70, -150, 140, 120, 40); g.fill(); g.stroke();
  [-45, -15, 15, 45].forEach((dx, i) => { g.save(); g.translate(dx, -40); g.rotate((i < 2 ? -1 : 1) * 0.5 * open); g.beginPath(); g.roundRect(-13, 0, 26, 70, 13); g.fill(); g.stroke(); g.restore(); });
  g.restore();
}
// 2 — guess: 1894 sepia photo strip; a hand lets go; frames show the cat turning; "pushed off the hand?"
SCENES.guess = (t, T, B, E, dur) => {
  warmbg(); const zf = eio((t - 3.9) / 0.8); cam(lerp(lerp(1.06, 1.0, eout(t / 0.5)), 2.3, zf), lerp(540, 390, zf), lerp(840, 540, zf), W / 2, lerp(840, 800, zf));
  const fw = 260, fh = 300, xs = [390, 660, 930], ys = [540, 860];
  for (let i = 0; i < 6; i++) {
    const x = xs[i % 3], y = ys[Math.floor(i / 3)], ap = seg(t, 0.3 + i * 0.5, 0.55 + i * 0.5);
    rrect(x - fw / 2, y - fh / 2, fw, fh, 10, [62, 46, 32], 1, [30, 20, 14], 8);
    if (ap > 0.01) { g.save(); g.globalAlpha = ap; g.beginPath(); g.rect(x - fw / 2 + 12, y - fh / 2 + 12, fw - 24, fh - 24); g.fillStyle = "rgb(196,170,128)"; g.fill(); g.clip();
      const u = i / 5; cat(x, y + 30 + i * 4, 0.32, { b: 0.35 * Math.sin(Math.PI * u), pf: Math.PI * (1 - Math.min(1, u * 1.6)), pb: Math.PI * (1 + 0.1 * Math.min(1, u * 2)) - Math.PI * Math.max(0, (u - 0.5) * 2), lf: 120, lb: 120 }, T, { sep: true, eyes: 0.6 });
      if (i === 0) hand(x - 40, y - 40 - 30 * seg(t, 4.6, 5.4), seg(t, 0.4, 0.8), true);
      g.restore(); }
    text(String(i + 1), x - fw / 2 + 26, y + fh / 2 - 30, 34, [230, 210, 170], "left", 800, 1);
  }
  camReset();
  plate("1894: photos of a falling cat", 560, 290, 52, INKW, "center", seg(t, 0.05, 0.3), 900);
  plate("it pushed off the hand?", 650, 1250, 52, NOPE, "center", seg(t, 2.2, 2.5), 900);
  if (t > 4.0) { const k = spring(t, 4.0, 12, 0.5); g.save(); g.translate(820, 700); g.scale(k, k); text("?", 0, 0, 260, NOPE, "center", 900, 0.95); g.restore(); }
  MAS(T, t, [[0.5, "?"], [2.3, "?"], [4.6, "!"]]);
};
// 3 — bend (reveal): big cat, upside down; it bends at the waist; each half gets its own spin axis
SCENES.bend = (t, T, B, E, dur) => {
  fallBg(T, 700); cam(lerp(1.15, 1.05, eout(t / 0.6)), CX, CY);
  const b = 0.42 * eio((t - 0.2) / 0.7);
  cat(CX, CY, 1.0, { b, pf: Math.PI, pb: Math.PI, lf: 150, lb: 150 }, T);
  // axis lines through each half
  const ax = seg(t, 1.3, 1.7);
  if (ax > 0.01) { [[-1, b], [1, -b]].forEach(([sd, r]) => { const ex = CX + sd * Math.cos(r) * 420, ey = CY + Math.sin(r) * 420 * sd; line(CX, CY, ex, ey, INKW, 0.75 * ax, 6, [16, 14]); }); }
  ringF(b, seg(t, 2.0, 2.3)); ringB(b, seg(t, 2.3, 2.6));
  camReset();
  plate("it bends in the middle", 560, 300, 60, AMBER, "center", seg(t, 0.25, 0.5) * (1 - seg(t, 1.9, 2.1)), 900);
  plate("two halves, two spins", 560, 300, 60, INKW, "center", seg(t, 2.15, 2.4), 900);
  MAS(T, t, [[0.3, "!"], [2.1, "idea"]]);
};
// 4 — front: front legs tucked, the front half spins right over; the stretched back half turns back a little
SCENES.front = (t, T, B, E, dur) => {
  fallBg(T, 700); cam(1.05, CX, CY);
  const k = eio((t - 0.9) / 2.4), b = 0.42;
  cat(CX, CY, 1.0, { b, pf: Math.PI * (1 - k), pb: Math.PI * (1 + 0.14 * k), lf: lerp(150, 60, eio((t - 0.2) / 0.5)), lb: lerp(150, 200, eio((t - 0.2) / 0.5)) }, T);
  ringF(b, seg(t, 0.9, 1.1) * (1 - seg(t, 3.4, 3.7)));
  camReset();
  plate("front legs in: spins fast", 560, 300, 54, AMBER, "center", seg(t, 0.2, 0.5), 900);
  plate("back legs out: barely turns", 650, 1250, 46, COOLC, "center", seg(t, 2.4, 2.7), 900);
  MAS(T, t, [[0.4, "?"], [2.0, "!"], [3.8, "idea"]]);
};
// 5 — back: swap; the back half catches up; unbend; feet down onto the floor
SCENES.back = (t, T, B, E, dur) => {
  const land = eio((t - 2.3) / 0.6), floorY = lerp(1500, 990, land);
  fallBg(T, 700 * (1 - land), 1);
  cam(1.05, CX, CY);
  const k = eio((t - 0.3) / 1.6), ub = 1 - eio((t - 1.9) / 0.5);
  cat(CX, CY, 1.0, { b: 0.42 * ub, pf: 0, pb: Math.PI * (1.14 + 0.86 * k), lf: lerp(60, 160, eio((t - 0.2) / 0.5)), lb: lerp(200, 60, eio((t - 0.2) / 0.4)) + 100 * eio((t - 1.9) / 0.5) }, T);
  ringB(0.42 * ub, seg(t, 0.3, 0.5) * (1 - seg(t, 1.8, 2.0)));
  // the floor comes up to meet the feet
  if (land > 0.01) { g.fillStyle = "rgb(84,46,40)"; g.fillRect(-200, floorY, 1500, 900); g.fillStyle = "rgb(120,70,58)"; g.fillRect(-200, floorY, 1500, 16); }
  camReset();
  plate("swap: the back half catches up", 560, 300, 52, COOLC, "center", seg(t, 0.2, 0.5) * (1 - seg(t, 2.4, 2.6)), 900);
  plate("feet down", 560, 300, 70, AMBER, "center", seg(t, 2.6, 2.8), 900);
  MAS(T, t, [[0.4, "?"], [2.9, "ok", "smile"]]);
};
// 6 — low: dropped from very low, the floor arrives before the turn is done; a timer bar runs out
SCENES.low = (t, T, B, E, dur) => {
  warmbg(); cam(1.0, CX, 840);
  const fall = clamp((t - 0.5) / 1.1), y = lerp(560, 950, fall * fall), floorY = 1090;
  g.fillStyle = "rgb(84,46,40)"; g.fillRect(-200, floorY, 1500, 900); g.fillStyle = "rgb(120,70,58)"; g.fillRect(-200, floorY, 1500, 16);
  // a low shelf it slipped off
  rrect(80, 420, 300, 40, 10, [150, 96, 70], 1);
  const k = eio(fall / 1.0) * 0.5;   // only half way round when the floor arrives
  const sit = seg(t, 1.6, 2.0);
  cat(CX + 40, y + 30 * sit, 0.8, { b: 0.35 * (1 - sit), pf: Math.PI * (1 - k), pb: Math.PI * (1 + 0.1 * k), lf: 70, lb: 160 }, T);
  if (t > 1.6) soft(CX + 40, floorY - 10, 260, NOPE, 0.35 * (1 - seg(t, 1.8, 2.6)));
  // time bar
  const tb = 1 - fall; rrect(260, 300, 560, 44, 22, [60, 26, 50], 1, [255, 220, 236], 4); rrect(264, 304, 552 * tb, 36, 18, tb > 0.3 ? AMBER : NOPE, 1);
  text("time to turn", 540, 250, 48, INKW, "center", 900, 1);
  camReset();
  plate("too low: no time to turn", 600, 1240, 52, NOPE, "center", seg(t, 1.6, 1.9), 900);
  MAS(T, t, [[0.5, "?"], [1.7, "!", "wince"]]);
};
// end: back to the hook picture: upside-down cat falling; the last 0.7 s match frame one
SCENES.end = (t, T, B, E, dur) => {
  fallBg(T); cam(1.0, CX, CY);
  cat(CX, CY + 10 * Math.sin(T * 2), 1.0, UP, T);
  camReset();
  MAS(T, t, [[0.3, "?", "grin"]]);
};
