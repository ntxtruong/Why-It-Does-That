// Episode 55 (v5 Short, 1080×1920, "Animals Explained"): why cats' eyes glow in the dark.
// Facts (claims.md): the tapetum lucidum is a reflective layer directly behind the retina; light that passes the
// photoreceptors is sent back through them (a second pass); some of it leaves the eye back toward the light = eyeshine.
// Humans have no tapetum. Cats see with about one sixth of the light humans need; the reflection scatters light and
// slightly lowers acuity. Cat eyeshine is usually yellow-green to yellow-orange. Pictures are schematic, not to scale.
window.NOPUSH = ["hook", "guess", "mirror", "second", "leak", "cost", "end"];
window.NODIP = window.NOPUSH;
// Animals palette: night plum, berry panel, amber, eyeshine green-gold
const N1 = [58, 22, 48], N2 = [16, 6, 14], FUR_D = [44, 28, 34], FUR_L = [226, 152, 86], STRIPE = [150, 82, 40];
const AMBER = [255, 181, 71], SHINE = [150, 236, 80], SHINE2 = [255, 206, 74], BEAM = [255, 238, 196], NOPE = [255, 110, 100];
const PHOT = [255, 226, 120];
function night(k = 1) { const gr = g.createRadialGradient(W / 2, 760, 80, W / 2, 900, 1300); gr.addColorStop(0, css(mix(N2, N1, k))); gr.addColorStop(1, css(N2)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function warmbg() { const gr = g.createRadialGradient(W / 2, 820, 60, W / 2, 900, 1250); gr.addColorStop(0, "rgb(96,40,70)"); gr.addColorStop(1, "rgb(34,12,30)"); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function cam(s, cx, cy, sx = W / 2, sy = 820) { g.setTransform(s, 0, 0, s, sx - cx * s, sy - cy * s); }
function camReset() { g.setTransform(1, 0, 0, 1, 0, 0); }
const MAS = (T, t, ev, o = {}) => MASR(T, t, { x: 150, y: 1585, s: 0.6, ev, ...o });

// flashlight beam: a cone from (fx,fy) toward (tx,ty), additive warm light
function beam(fx, fy, tx, ty, wid, a) {
  if (a <= 0.01) return;
  const an = Math.atan2(ty - fy, tx - fx), L = Math.hypot(tx - fx, ty - fy) * 1.6, nx = -Math.sin(an), ny = Math.cos(an);
  g.save(); g.globalCompositeOperation = "lighter";
  const gr = g.createLinearGradient(fx, fy, fx + Math.cos(an) * L, fy + Math.sin(an) * L);
  gr.addColorStop(0, css(BEAM, 0.34 * a)); gr.addColorStop(1, css(BEAM, 0.04 * a));
  g.fillStyle = gr; g.beginPath(); g.moveTo(fx + nx * 30, fy + ny * 30); g.lineTo(fx - nx * 30, fy - ny * 30);
  const ex = fx + Math.cos(an) * L, ey = fy + Math.sin(an) * L; g.lineTo(ex - nx * wid, ey - ny * wid); g.lineTo(ex + nx * wid, ey + ny * wid); g.closePath(); g.fill();
  soft(tx, ty, wid * 0.75, BEAM, 0.22 * a);
  g.restore();
}
function torch(x, y, an, a = 1) { // a hand-held flashlight, lens toward angle an
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(an);
  g.fillStyle = "rgb(60,64,78)"; g.beginPath(); g.roundRect(-260, -44, 220, 88, 20); g.fill();
  g.fillStyle = "rgb(84,90,108)"; g.beginPath(); g.moveTo(-50, -48); g.lineTo(30, -76); g.lineTo(30, 76); g.lineTo(-50, 48); g.closePath(); g.fill();
  g.fillStyle = "rgb(255,246,214)"; g.beginPath(); g.ellipse(30, 0, 16, 74, 0, 0, TAU2); g.fill();
  g.fillStyle = "rgb(230,120,60)"; g.fillRect(-200, -50, 26, 12);
  g.restore(); soft(x + Math.cos(an) * 40, y + Math.sin(an) * 40, 120, BEAM, 0.6 * a);
}

// cat head, front view, centre (cx,cy), scale s. o.lit 0..1 (fur lit by the beam), o.glow 0..1, o.gcol eyeshine colour,
// o.dil pupil dilation 0..1 (1 = wide in the dark)
function catFace(cx, cy, s, o = {}) {
  const lit = o.lit ?? 1, glow = o.glow ?? 0, gc = o.gcol || SHINE, dil = o.dil ?? 1;
  const fur = mix(FUR_D, FUR_L, lit), fur2 = mix([30, 18, 24], [196, 118, 60], lit), inner = mix([60, 30, 40], [240, 150, 150], lit);
  g.save(); g.translate(cx, cy); g.scale(s, s);
  // ears
  [-1, 1].forEach(sx => { g.fillStyle = css(fur2); g.beginPath(); g.moveTo(sx * 390, -90); g.quadraticCurveTo(sx * 380, -380, sx * 330, -520); g.quadraticCurveTo(sx * 220, -400, sx * 90, -280); g.closePath(); g.fill();
    g.fillStyle = css(inner); g.beginPath(); g.moveTo(sx * 340, -150); g.quadraticCurveTo(sx * 330, -360, sx * 312, -440); g.quadraticCurveTo(sx * 230, -350, sx * 150, -270); g.closePath(); g.fill(); });
  // head + cheeks
  g.fillStyle = css(fur); g.beginPath(); g.ellipse(0, -30, 410, 330, 0, 0, TAU2); g.fill();
  g.beginPath(); g.ellipse(0, 110, 450, 240, 0, 0, TAU2); g.fill();
  // tabby stripes
  g.save(); g.globalAlpha = 0.25 + 0.5 * lit; g.strokeStyle = css(mix(FUR_D, STRIPE, lit)); g.lineCap = "round"; g.lineWidth = 26;
  [[-70, -300, -40, -170], [0, -320, 0, -180], [70, -300, 40, -170], [-400, 40, -300, 30], [-410, 110, -310, 90], [400, 40, 300, 30], [410, 110, 310, 90]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); });
  g.restore();
  // muzzle
  const muz = mix([70, 50, 56], [252, 236, 220], lit);
  g.fillStyle = css(muz); g.beginPath(); g.ellipse(-78, 170, 110, 84, 0, 0, TAU2); g.fill(); g.beginPath(); g.ellipse(78, 170, 110, 84, 0, 0, TAU2); g.fill();
  g.fillStyle = css(mix([90, 40, 54], [240, 120, 140], lit)); g.beginPath(); g.moveTo(-42, 96); g.lineTo(42, 96); g.lineTo(0, 140); g.closePath(); g.fill();
  g.strokeStyle = css(mix([20, 10, 16], [80, 40, 40], lit)); g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 140); g.lineTo(0, 175); g.moveTo(0, 175); g.quadraticCurveTo(-40, 215, -76, 190); g.moveTo(0, 175); g.quadraticCurveTo(40, 215, 76, 190); g.stroke();
  // whiskers
  g.strokeStyle = css([255, 246, 236], 0.35 + 0.5 * lit); g.lineWidth = 5;
  [-1, 1].forEach(sx => [[-30, 0], [0, 10], [30, 22]].forEach(([dy, dd]) => { g.beginPath(); g.moveTo(sx * 150, 170 + dy * 0.5); g.quadraticCurveTo(sx * 330, 150 + dy, sx * (480 + dd), 130 + dy * 2.2); g.stroke(); }));
  // eyes
  [-1, 1].forEach(sx => {
    const ex = sx * 172, ey = -40;
    g.save(); g.beginPath(); g.ellipse(ex, ey, 116, 92, sx * 0.14, 0, TAU2); g.clip();
    const iris = mix([60, 46, 20], [214, 170, 60], lit); g.fillStyle = css(iris); g.fillRect(ex - 130, ey - 100, 260, 200);
    const pw = lerp(16, 78, dil), ph = lerp(88, 86, dil);
    g.fillStyle = "rgb(10,6,8)"; g.beginPath(); g.ellipse(ex, ey, pw, ph, 0, 0, TAU2); g.fill();
    if (glow > 0.01) { // eyeshine: the whole pupil lights, the iris catches some
      const gr = g.createRadialGradient(ex, ey, 4, ex, ey, 120); gr.addColorStop(0, css(mix(gc, [255, 255, 235], 0.3), glow)); gr.addColorStop(0.3, css(gc, glow)); gr.addColorStop(1, css(mix(gc, [40, 60, 10], 0.5), glow * 0.85));
      g.fillStyle = gr; g.beginPath(); g.ellipse(ex, ey, pw * 1.02, ph * 1.02, 0, 0, TAU2); g.fill();
      g.globalAlpha = glow * 0.35; g.fillStyle = css(gc); g.fillRect(ex - 130, ey - 100, 260, 200); g.globalAlpha = 1;
    }
    g.fillStyle = "rgba(255,255,255,0.85)"; g.beginPath(); g.ellipse(ex + 30, ey - 34, 16, 12, 0, 0, TAU2); g.fill();
    g.restore();
    g.strokeStyle = "rgb(18,10,14)"; g.lineWidth = 10; g.beginPath(); g.ellipse(ex, ey, 116, 92, sx * 0.14, 0, TAU2); g.stroke();
  });
  g.restore();
  if (glow > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; [-1, 1].forEach(sx => soft(cx + sx * 172 * s, cy - 40 * s, 230 * s, gc, 0.4 * glow)); g.restore(); }
}
// a person's face, front view: lit by the beam, pupils dark (no eyeshine)
function humanFace(cx, cy, s, lit = 1) {
  const skin = mix([50, 34, 34], [244, 204, 172], lit), hair = mix([22, 14, 14], [70, 44, 30], lit);
  g.save(); g.translate(cx, cy); g.scale(s, s);
  g.fillStyle = css(hair); g.beginPath(); g.ellipse(0, -90, 380, 400, 0, 0, TAU2); g.fill();
  g.fillStyle = css(skin); g.beginPath(); g.ellipse(-360, 20, 50, 80, 0, 0, TAU2); g.fill(); g.beginPath(); g.ellipse(360, 20, 50, 80, 0, 0, TAU2); g.fill();
  g.beginPath(); g.ellipse(0, 20, 340, 400, 0, 0, TAU2); g.fill();
  g.fillStyle = css(hair); g.beginPath(); g.moveTo(-360, -60); g.quadraticCurveTo(-300, -420, 0, -420); g.quadraticCurveTo(300, -420, 360, -60); g.quadraticCurveTo(200, -260, 0, -250); g.quadraticCurveTo(-220, -250, -360, -60); g.fill();
  [-1, 1].forEach(sx => { const ex = sx * 140, ey = -20;
    g.strokeStyle = css(hair); g.lineWidth = 18; g.lineCap = "round"; g.beginPath(); g.moveTo(ex - 70, ey - 90); g.quadraticCurveTo(ex, ey - 120, ex + 70, ey - 92); g.stroke();
    g.fillStyle = css(mix([60, 50, 50], [250, 248, 244], lit)); g.beginPath(); g.ellipse(ex, ey, 92, 56, 0, 0, TAU2); g.fill();
    g.fillStyle = css(mix([30, 20, 16], [110, 70, 40], lit)); g.beginPath(); g.arc(ex, ey, 46, 0, TAU2); g.fill();
    g.fillStyle = "rgb(8,6,8)"; g.beginPath(); g.arc(ex, ey, 30, 0, TAU2); g.fill();
    g.fillStyle = "rgba(255,255,255,0.8)"; g.beginPath(); g.arc(ex + 14, ey - 14, 9, 0, TAU2); g.fill(); });
  g.strokeStyle = css(mix([40, 24, 24], [200, 140, 116], lit)); g.lineWidth = 10; g.lineCap = "round"; g.beginPath(); g.moveTo(0, 30); g.quadraticCurveTo(-30, 130, 10, 150); g.stroke();
  g.strokeStyle = css(mix([50, 24, 30], [190, 90, 90], lit)); g.lineWidth = 14; g.beginPath(); g.moveTo(-90, 250); g.quadraticCurveTo(0, 280, 90, 250); g.stroke();
  g.restore();
}
// eye cross-section, light enters from the right. o.tap = mirror layer visible 0..1, o.shine = its sparkle
function eyeSection(cx, cy, R, o = {}) {
  const tap = o.tap ?? 1;
  g.save();
  g.fillStyle = "rgb(248,236,232)"; g.beginPath(); g.arc(cx, cy, R, 0, TAU2); g.fill();                       // sclera
  g.fillStyle = "rgb(70,30,44)"; g.beginPath(); g.arc(cx, cy, R - 24, 0, TAU2); g.fill();                       // choroid
  // mirror layer: a shiny band on the back wall (left), between choroid and retina
  if (tap > 0.01) { g.save(); g.globalAlpha = tap; const gr = g.createLinearGradient(cx - R, cy - R, cx - R * 0.4, cy + R); gr.addColorStop(0, css(SHINE)); gr.addColorStop(0.5, css(SHINE2)); gr.addColorStop(1, css(SHINE));
    g.strokeStyle = gr; g.lineWidth = 38; g.beginPath(); g.arc(cx, cy, R - 46, Math.PI * 0.62, Math.PI * 1.38); g.stroke();
    if (o.shine) { g.globalCompositeOperation = "lighter"; for (let i = 0; i < 7; i++) { const an = Math.PI * (0.68 + 0.64 * i / 6), k = 0.5 + 0.5 * Math.sin(o.shine * 6 + i * 1.7); soft(cx + Math.cos(an) * (R - 46), cy + Math.sin(an) * (R - 46), 60, [255, 255, 220], 0.5 * k * tap); } }
    g.restore(); }
  g.fillStyle = "rgb(232,120,110)"; g.beginPath(); g.arc(cx, cy, R - 66, 0, TAU2); g.fill();                     // retina
  g.fillStyle = "rgb(40,18,34)"; g.beginPath(); g.arc(cx, cy, R - 92, 0, TAU2); g.fill();                       // inside (vitreous)
  // front: cornea bulge, iris, lens
  g.fillStyle = "rgba(190,230,250,0.55)"; g.beginPath(); g.ellipse(cx + R * 0.88, cy, R * 0.26, R * 0.5, 0, -Math.PI / 2, Math.PI / 2); g.fill();
  g.fillStyle = "rgb(214,160,60)"; g.fillRect(cx + R * 0.74, cy - R * 0.62, 26, R * 0.36); g.fillRect(cx + R * 0.74, cy + R * 0.26, 26, R * 0.36);
  g.fillStyle = "rgba(230,240,250,0.9)"; g.beginPath(); g.ellipse(cx + R * 0.62, cy, R * 0.14, R * 0.3, 0, 0, TAU2); g.fill();
  g.restore();
}
const PL = (s, x, y, size, col, a, w = 900) => plate(s, x, y, size, col, "center", a, w);
const HOOKCOL = SHINE;

const SCENES = {};
// 1 — hook: the beam is on the cat, the eyes blaze (frame one); the beam swings off (eyes go dark), comes back (flare);
// hard cut to a person in the same beam: no glow.
function hookCat(t, T, beamOn, flare) {
  night(); cam(lerp(1.0, 1.04, clamp(t / 3)), 540, 860);
  const tx = lerp(540, 1500, 1 - beamOn), ty = lerp(760, 300, 1 - beamOn);
  catFace(540, 790, 0.9, { lit: 0.08 + 0.3 * beamOn, glow: beamOn * (1 + 0.25 * flare), gcol: HOOKCOL, dil: 1 });
  beam(1060, 1240, tx, ty, 520, 0.9);
  camReset(); torch(1060, 1240, Math.atan2(ty - 1240, tx - 1060) );
}
SCENES.hook = (t, T, B, E, dur) => {
  if (t < 3.1) {
    const off = seg(t, 0.85, 1.05) * (1 - seg(t, 1.85, 2.05)), on = 1 - off, flare = Math.exp(-Math.max(0, t - 2.05) * 2) * seg(t, 1.95, 2.1);
    hookCat(t, T, on, flare);
    PL("eyes light up", 560, 1260, 58, SHINE, seg(t, 2.1, 2.3), 900);
    MAS(T, t, [[0.4, "!"], [1.1, "?"], [2.1, "!"]]);
  } else {
    const u = t - 3.1; night(0.8); cam(lerp(1.06, 1.0, eout(u / 0.6)), 540, 860);
    humanFace(540, 800, 0.92, 0.9);
    beam(1060, 1240, 540, 760, 520, 0.9); camReset(); torch(1060, 1240, Math.atan2(760 - 1240, 540 - 1060));
    PL("your eyes: no glow", 560, 1260, 58, NOPE, seg(u, 0.25, 0.45), 900);
    MAS(T, t, [[3.3, "?", "wince"]]);
  }
};
// 2 — guess: close on one cat eye. "Makes its own light?" gets struck out, then photons fly in from the torch and bounce back.
SCENES.guess = (t, T, B, E, dur) => {
  night(); const z = t < 1.5 ? 2.3 : 1.25;
  if (t < 1.5) { cam(lerp(2.3, 2.45, t / 1.5), 540 - 172, 840 - 40); catFace(540, 840, 1, { lit: 0.35, glow: 0.9, gcol: HOOKCOL }); camReset();
    // a bulb inside the eye, then a big X
    const bx = 540, by = 820; g.save(); g.globalAlpha = seg(t, 0.15, 0.35); g.fillStyle = css(AMBER); g.beginPath(); g.arc(bx, by - 30, 90, 0, TAU2); g.fill(); g.fillRect(bx - 45, by + 50, 90, 70); g.strokeStyle = css(AMBER); g.lineWidth = 14; g.lineCap = "round"; for (let k = 0; k < 7; k++) { const an = -Math.PI + k * Math.PI / 6; g.beginPath(); g.moveTo(bx + Math.cos(an) * 120, by - 30 + Math.sin(an) * 120); g.lineTo(bx + Math.cos(an) * 165, by - 30 + Math.sin(an) * 165); g.stroke(); } g.restore();
    const x = spring(t, 1.0, 14, 0.5); if (x > 0.01) { g.save(); g.strokeStyle = css(NOPE); g.lineWidth = 46; g.lineCap = "round"; const r = 260 * Math.min(1.1, x); g.beginPath(); g.moveTo(bx - r, by - r); g.lineTo(bx + r, by + r); g.moveTo(bx + r, by - r); g.lineTo(bx - r, by + r); g.stroke(); g.restore(); }
    PL("makes its own light?", 540, 420, 60, [255, 240, 244], seg(t, 0.1, 0.3), 900);
    PL("NO", 540, 1240, 80, NOPE, seg(t, 1.0, 1.15), 900);
  } else {
    const u = t - 1.5; cam(z, 540, 840); catFace(540, 840, 1, { lit: 0.35, glow: 0.4 + 0.6 * seg(u, 0.35, 0.6), gcol: HOOKCOL });
    camReset(); torch(1030, 1180, Math.atan2(680 - 1180, 260 - 1030));
    // photons: in along the beam to the left eye, then back out toward the torch
    for (let i = 0; i < 10; i++) { const p = ((u * 1.4 + i / 10) % 1), back = p > 0.5, q = back ? (p - 0.5) * 2 : p * 2;
      const ax = 990, ay = 1150, ex = 325, ey = 790; const x = back ? lerp(ex, ax, q) : lerp(ax, ex, q), y = back ? lerp(ey, ay, q) : lerp(ay, ey, q);
      dot(x + (back ? 12 : -12), y + (back ? 0 : 10), 16, back ? SHINE : PHOT, seg(u, 0, 0.2)); }
    arrow(900, 1100, 430, 820, PHOT, seg(u, 0.05, 0.3) * 0.8, 10, 34); arrow(400, 760, 870, 1040, SHINE, seg(u, 0.4, 0.6) * 0.9, 10, 34);
    PL("it bounces YOUR light back", 560, 420, 58, SHINE, seg(u, 0.15, 0.35), 900);
    MAS(T, t, [[1.7, "idea"]]);
  }
  if (t < 1.5) MAS(T, t, [[0.3, "?"], [1.05, "!", "wince"]]);
};
// 3 — mirror (reveal): cut to an eye cross-section; the mirror layer behind the retina lights up and is named.
SCENES.mirror = (t, T, B, E, dur) => {
  warmbg(); const z = eio((t - 1.0) / 2.6); cam(lerp(1.0, 1.12, z), lerp(630, 560, z), 760, W / 2, 760);
  const tap = seg(t, 1.0, 1.5); eyeSection(630, 760, 410, { tap, shine: tap > 0 ? T : 0 });
  if (tap > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; soft(260, 760, 300, SHINE, 0.35 * tap * (0.6 + 0.4 * Math.sin(T * 5))); g.restore(); }
  camReset();
  PL("retina: light sensors", 600, 300, 52, [255, 200, 190], seg(t, 0.2, 0.4) * (1 - seg(t, 1.0, 1.15)), 900);
  PL("behind it: a MIRROR", 560, 300, 64, SHINE, seg(t, 1.1, 1.3), 900);
  PL("tapetum lucidum", 640, 1250, 60, SHINE2, seg(t, 2.3, 2.5), 900);
  // pointer to the layer
  arrow(470, 420, 320, 560, SHINE, seg(t, 1.2, 1.4), 9, 30);
  MAS(T, t, [[0.3, "?"], [1.2, "!"], [2.5, "idea"]]);
};
// 4 — second chance: close-up of the back wall. Photons cross the retina (some caught), the rest hit the mirror and
// come back through the retina for a second try; some still leave.
const RX0 = 500, RX1 = 740, MX = 420;
function photonState(i, tt) { // returns {x, y, dir, alive, hit} for photon i at local time tt
  const t0 = 0.1 + i * 0.16, y = 520 + ((i * 7) % 13) * 52, v = 720, catch1 = hash(i, 3) < 0.35, catch2 = !catch1 && hash(i, 4) < 0.5;
  const u = tt - t0; if (u < 0) return null;
  const xin = 1120 - v * u, hx1 = (RX0 + RX1) / 2 + (hash(i, 5) - 0.5) * 140;
  if (catch1) { if (xin > hx1) return { x: xin, y, back: false }; return { x: hx1, y, hit: 1, ht: t0 + (1120 - hx1) / v, gone: true }; }
  if (xin > MX) return { x: xin, y, back: false };
  const tr = t0 + (1120 - MX) / v, ub = tt - tr, xb = MX + v * ub;
  if (catch2 && xb > hx1) return { x: hx1, y, hit: 2, ht: tr + (hx1 - MX) / v, gone: true };
  return { x: xb, y, back: true };
}
SCENES.second = (t, T, B, E, dur) => {
  warmbg(); cam(lerp(1.0, 1.06, t / dur), 600, 820);
  // mirror band
  const gr = g.createLinearGradient(MX - 90, 0, MX, 0); gr.addColorStop(0, css(SHINE)); gr.addColorStop(1, css(SHINE2)); g.fillStyle = gr; g.fillRect(MX - 90, 380, 90, 900);
  g.save(); g.globalCompositeOperation = "lighter"; for (let k = 0; k < 6; k++) soft(MX - 40, 430 + k * 160, 70, [255, 255, 220], 0.25 + 0.2 * Math.sin(T * 4 + k)); g.restore();
  // retina band with rod cells (horizontal capsules)
  g.fillStyle = "rgba(232,120,110,0.35)"; g.fillRect(RX0, 380, RX1 - RX0, 900);
  const hits = [];
  for (let i = 0; i < 26; i++) { const s = photonState(i, t); if (s && s.hit) hits.push(s); }
  for (let r = 0; r < 17; r++) { const y = 400 + r * 52;
    let fl = 0, col = SHINE2; hits.forEach(h => { if (Math.abs(h.y - y) < 27) { const k = Math.exp(-Math.max(0, t - h.ht) * 2.2); if (k > fl) { fl = k; col = h.hit === 1 ? [255, 236, 140] : SHINE; } } });
    rrect(RX0 + 20, y - 18, RX1 - RX0 - 40, 36, 18, css(mix([214, 96, 96], col, fl)), 1); }
  for (let i = 0; i < 26; i++) { const s = photonState(i, t); if (!s || s.gone) continue; dot(s.x, s.y, 15, s.back ? SHINE : PHOT, 1); dot(s.x + (s.back ? -26 : 26), s.y, 9, s.back ? SHINE : PHOT, 0.4); }
  camReset();
  PL("light in", 920, 420, 56, PHOT, seg(t, 0.1, 0.3), 900);
  PL("retina", 620, 300, 52, [255, 200, 190], seg(t, 0.3, 0.5) * (1 - seg(t, 2.4, 2.6)), 900);
  PL("1st try", 880, 1240, 54, [255, 236, 140], seg(t, 0.8, 1.0), 900);
  PL("mirror", 330, 300, 52, SHINE2, seg(t, 1.2, 1.4) * (1 - seg(t, 2.3, 2.5)), 900);
  PL("2nd chance!", 600, 300, 66, SHINE, seg(t, 2.5, 2.7), 900);
  MAS(T, t, [[0.4, "?"], [1.4, "!"], [2.7, "idea"]]);
};
// 5 — leak: back to the cross-section; light that was not caught leaves through the pupil, straight back to the torch.
// Then cut to the cat's face: that's the glow.
SCENES.leak = (t, T, B, E, dur) => {
  if (t < 2.45) {
    warmbg(); eyeSection(560, 760, 380, { tap: 1, shine: T });
    for (let i = 0; i < 12; i++) { const p = ((t * 0.9 + i / 12) % 1), an = (hash(i, 2) - 0.5) * 0.5;
      // from a point on the mirror out through the pupil to the right
      const sx = 560 - 320, sy = 760 + Math.sin(an) * 280, mx = 560 + 290, my = 760 + (hash(i, 6) - 0.5) * 60, ex = 1010, ey = 760 + (hash(i, 7) - 0.5) * 80;
      const x = p < 0.6 ? lerp(sx, mx, p / 0.6) : lerp(mx, ex, (p - 0.6) / 0.4), y = p < 0.6 ? lerp(sy, my, p / 0.6) : lerp(my, ey, (p - 0.6) / 0.4);
      dot(x, y, 15, SHINE, 1); }
    torch(1090, 760, Math.PI);
    arrow(760, 1210, 1000, 1210, SHINE, seg(t, 0.5, 0.8), 10, 34);
    PL("some escapes, back to your light", 560, 300, 52, SHINE, seg(t, 0.2, 0.4), 900);
    MAS(T, t, [[0.5, "?"], [1.6, "!"]]);
  } else {
    const u = t - 2.45; night(); cam(lerp(1.12, 1.04, eout(u / 0.5)), 540, 860);
    catFace(540, 790, 0.9, { lit: 0.38, glow: 1 + 0.4 * Math.exp(-u * 2.5), gcol: HOOKCOL }); beam(1060, 1240, 540, 760, 520, 0.9); camReset(); torch(1060, 1240, Math.atan2(760 - 1240, 540 - 1060));
    PL("THAT's the glow", 560, 360, 72, SHINE, seg(u, 0.05, 0.25), 900);
    MAS(T, t, [[2.5, "ok", "smile"]]);
  }
};
// 6 — cost: light needed to see (you: six bulbs, cat: one), then the price: the same picture, a little blurred.
function bulb(x, y, r, on) { g.save(); if (on > 0.01) { g.globalCompositeOperation = "lighter"; soft(x, y, r * 2.2, AMBER, 0.6 * on); g.globalCompositeOperation = "source-over"; }
  g.fillStyle = css(mix([90, 70, 80], [255, 222, 120], on)); g.beginPath(); g.arc(x, y, r, 0, TAU2); g.fill(); g.fillStyle = "rgb(150,140,150)"; g.fillRect(x - r * 0.45, y + r * 0.8, r * 0.9, r * 0.55); g.restore(); }
function toyMouse(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = "rgb(150,150,165)"; g.beginPath(); g.ellipse(0, 0, 200, 120, 0, 0, TAU2); g.fill(); g.beginPath(); g.moveTo(170, -40); g.quadraticCurveTo(320, 0, 170, 60); g.fill();
  g.fillStyle = "rgb(240,160,180)"; g.beginPath(); g.arc(150, -110, 60, 0, TAU2); g.fill(); g.beginPath(); g.arc(310, 6, 18, 0, TAU2); g.fill();
  g.fillStyle = "rgb(20,20,30)"; g.beginPath(); g.arc(230, -20, 16, 0, TAU2); g.fill();
  g.strokeStyle = "rgb(240,160,180)"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(-200, 10); g.bezierCurveTo(-330, 40, -300, 160, -420, 120); g.stroke();
  g.strokeStyle = "rgb(60,60,70)"; g.lineWidth = 5; [-20, 0, 20].forEach(d => { g.beginPath(); g.moveTo(300, 10 + d * 0.4); g.lineTo(400, -10 + d * 2); g.stroke(); });
  g.restore(); }
SCENES.cost = (t, T, B, E, dur) => {
  if (t < 3.15) {
    night(0.9);
    PL("light needed to see", 560, 290, 62, [255, 240, 244], seg(t, 0.05, 0.25), 900);
    humanFace(225, 540, 0.4, 0.9); catFace(235, 805, 0.3, { lit: 0.9, glow: 0.6, gcol: HOOKCOL });
    for (let i = 0; i < 6; i++) bulb(420 + i * 108, 540, 44, seg(t, 0.35 + i * 0.3, 0.5 + i * 0.3));
    bulb(420, 805, 44, seg(t, 2.25, 2.4));
    PL("you need 6", 690, 660, 56, AMBER, seg(t, 2.0, 2.2), 900);
    PL("a cat needs 1", 720, 805, 60, SHINE, seg(t, 2.35, 2.55), 900);
    MAS(T, t, [[0.5, "?"], [2.4, "!"]]);
  } else {
    const u = t - 3.15; warmbg(); const bl = 9 * seg(u, 0.8, 1.6);
    g.fillStyle = "rgb(120,60,70)"; g.fillRect(0, 1040, W, 300);
    g.save(); if (bl > 0.1) g.filter = `blur(${bl.toFixed(1)}px)`; cam(lerp(1.0, 1.08, u / 3), 560, 860); toyMouse(600, 900, 1.25); camReset(); g.restore();
    PL("the price:", 560, 360, 60, [255, 240, 244], seg(u, 0.05, 0.25) * (1 - seg(u, 0.8, 0.95)), 900);
    PL("a slightly blurrier picture", 560, 360, 56, AMBER, seg(u, 1.0, 1.2), 900);
    MAS(T, t, [[3.4, "?"], [4.6, "!", "wince"]]);
  }
};
// end: the glowing cat; the eyeshine switches green ↔ gold; the last 0.6 s are frame one again (loop).
SCENES.end = (t, T, B, E, dur) => {
  const toGold = seg(t, 1.1, 1.3) * (1 - seg(t, 2.2, 2.4)), col = mix(SHINE, [255, 168, 40], toGold);
  if (t > dur - 0.6) { hookCat(dur - t < 0.6 ? 0 : 0, T, 1, 0); MAS(T, t, [[dur - 0.5, "!"]]); return; }
  night(); cam(1.0, 540, 860); catFace(540, 790, 0.9, { lit: 0.38, glow: 1, gcol: col, dil: 1 });
  beam(1060, 1240, 540, 760, 520, 0.9); camReset(); torch(1060, 1240, Math.atan2(760 - 1240, 540 - 1060));
  PL(toGold > 0.5 ? "gold?" : "green?", 560, 1260, 64, col, seg(t, 0.3, 0.5), 900);
  MAS(T, t, [[0.3, "?", "grin"], [1.2, "!"], [2.3, "?"]]);
};
