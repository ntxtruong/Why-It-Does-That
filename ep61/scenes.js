// Episode 61 (v5 Short, 1080×1920, "Your Brain Is Tricking You", hook=try len=short look=flat, NO mascot):
// Aristotle's illusion. Cross two fingers and rub the tip of your nose: it can feel like two noses.
// Facts (claims.md): crossed, the index and middle fingers touch one object with their outer sides, which
// in the normal (uncrossed) hand face away from each other and can only be touched by two separate objects at
// once, so the brain reports two (Hanover ISLE; Illusions Index; Benedetti 1985/1986). Aristotle described the
// crossed-finger doubling (On Dreams 460b; Metaphysics IV). Pictures are schematic.
//
// STORYBOARD (one stage: the face + the crossed hand never leave the frame; every scene is a change ON it)
//  hook   0.0–4.4  face fills the frame, crossed fingers rub the nose tip; two pink "felt" noses pulse with each
//                  rub (frame 0 = the weird result). Title "Try this right now" → "Two noses?" at 2.8 s.
//                  Only the rubbing hand moves → 3+ clean seconds for the viewer's own test.   → hands over: push-in
//  guess  4.4–7.05 camera pushes into the fingertips, felt noses fade to the one real nose; "numb fingers?" is
//                  struck out on "not your fingers".                                         → hands over: pull-back
//  reveal 7.05–9.3 pull back; cyan ghost fingers (the brain's map) uncross out of the real ones, and on
//                  "uncrossed" the nose SPLITS into two with a flash (strongest event, 8.5 s).  → hands over: push-in
//  why    9.3–14.4 push-in 1.7× on the fingertips: the two outer sides glow pink, ghost map shows the same sides
//                  facing away, arrows carry them to two noses; on "feels two noses" pull out, both noses flash.
//  old    14.4–18.1 the face turns to a marble bust with a laurel; "350 BC" stamps in; the hand keeps rubbing.
//  end    18.1–21.3 marble melts back to skin, "One nose or two?"; the last 0.5 s are frame 0 exactly (loop).
window.NOPUSH = ["hook", "guess", "reveal", "why", "old", "end"];
window.NODIP = window.NOPUSH;

// "Your Brain" palette, v61 variant: plum-violet floor light instead of ep58's radial violet; pink = felt, cyan = brain map
const BGT = [58, 26, 104], BGB = [18, 8, 38], PINK = [255, 92, 160], CYAN = [86, 232, 226], GOLDC = [255, 210, 90];
const SKIN = [242, 192, 160], SKIN_D = [214, 152, 120], SKIN_L = [252, 214, 188], HAIRC = [70, 40, 30], LINEC = [92, 46, 40];
const MARBLE = [226, 224, 236], MARBLE_D = [178, 176, 196], MARBLE_L = [244, 243, 250], LAUREL = [120, 186, 96];

function bg61() {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, css(BGT)); gr.addColorStop(1, css(BGB)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  soft(540, 760, 760, [120, 60, 190], 0.45);
}
function cam61(s, cx, cy) { g.setTransform(s, 0, 0, s, 540 - cx * s, 760 - cy * s); }
// camera keyframes: [time, scale, cx, cy]; eased between keys
// review 61 P1-3: no holds + eased jumps any more. A Catmull-Rom curve through the keys keeps the camera velocity
// continuous (each push starts from the drift already under way), and zoom stays <= 1.2 so the head is never clipped.
const CAM = [[-1, 1, 760], [0, 1, 760], [4.3, 1.03, 770], [5.2, 1.19, 805], [6.9, 1.2, 810], [7.6, 1, 770], [9.3, 1.02, 775], [10.1, 1.19, 805],
  [12.6, 1.2, 810], [13.3, 1, 770], [14.4, 1.02, 765], [18.0, 1.08, 750], [18.7, 1, 760], [30, 1, 760], [31, 1, 760]];
function camAt(T) {
  let i = 1; while (i < CAM.length - 2 && T >= CAM[i + 1][0]) i++;
  const p0 = CAM[i - 1], p1 = CAM[i], p2 = CAM[i + 1], p3 = CAM[i + 2], u = clamp((T - p1[0]) / (p2[0] - p1[0]));
  const cr = k => { const m1 = (p2[k] - p0[k]) / (p2[0] - p0[0]) * (p2[0] - p1[0]), m2 = (p3[k] - p1[k]) / (p3[0] - p1[0]) * (p2[0] - p1[0]);
    const u2 = u * u, u3 = u2 * u; return (2 * u3 - 3 * u2 + 1) * p1[k] + (u3 - 2 * u2 + u) * m1 + (-2 * u3 + 3 * u2) * p2[k] + (u3 - u2) * m2; };
  return [cr(1), 540, cr(2)];
}

// rubbing: fingers move up/down 2.2 times a second (the viewer rubs along)
const rubY = T => 13 * Math.sin(T * TAU2 * 2.2);
const NOSE = [540, 868];
const IB = [512, 1140], MB = [652, 1128];               // finger bases (index left, middle right, in the fist)
const ITX = [604, 470], MTX = [478, 612], TY = 968;      // tip x: [crossed, uncrossed]
const FW61 = 82;                                         // finger width
const feltPos = u => [[lerp(NOSE[0], 392, u), lerp(NOSE[1], 878, u)], [lerp(NOSE[0], 690, u), lerp(NOSE[1], 878, u)]];

function capsule(a, b, w, fill, out, lw = 10, alpha = 1) {
  g.save(); g.globalAlpha = alpha; g.lineCap = "round";
  if (out) { g.strokeStyle = css(out); g.lineWidth = w + lw * 2; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
  if (fill) { g.strokeStyle = css(fill); g.lineWidth = w; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.stroke(); }
  g.restore();
}
function nail(a, b, col, alpha = 1) {
  const an = Math.atan2(b[1] - a[1], b[0] - a[0]); g.save(); g.globalAlpha = alpha; g.translate(b[0] - Math.cos(an) * 30, b[1] - Math.sin(an) * 30); g.rotate(an);
  g.fillStyle = css(col); g.beginPath(); g.roundRect(-22, -22, 44, 44, 18); g.fill(); g.restore();
}
// glow on one side of a finger near its tip; side = -1 (left, −x) or +1 (right, +x)
function sideGlow(a, b, side, col, alpha) {
  if (alpha <= 0.01) return; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  let nx = -uy, ny = ux; if (Math.sign(nx) !== side) { nx = -nx; ny = -ny; }
  const off = FW61 / 2 + 4, p1 = [b[0] - ux * 75 + nx * off, b[1] - uy * 75 + ny * off], p2 = [b[0] - ux * 8 + nx * off, b[1] - uy * 8 + ny * off];
  g.save(); g.globalCompositeOperation = "lighter"; line(p1[0], p1[1], p2[0], p2[1], col, 0.5 * alpha, 40); g.restore();
  line(p1[0], p1[1], p2[0], p2[1], col, alpha, 14);
  return [(p1[0] + p2[0]) / 2 + nx * 10, (p1[1] + p2[1]) / 2 + ny * 10];
}

// the face (front view); m = marble amount 0..1
function face(T, m) {
  const sk = mix(SKIN, MARBLE, m), skd = mix(SKIN_D, MARBLE_D, m), skl = mix(SKIN_L, MARBLE_L, m), hair = mix(HAIRC, MARBLE_D, m), ln = mix(LINEC, [110, 106, 140], m);
  // torso + shirt (fills the bottom of the frame; becomes the bust in the Aristotle beat)
  const sh = mix([46, 150, 146], MARBLE_D, m), shd = mix([30, 110, 108], [150, 148, 170], m);
  g.fillStyle = css(sh); g.beginPath(); g.moveTo(40, 1960); g.lineTo(60, 1520); g.quadraticCurveTo(80, 1340, 300, 1300); g.lineTo(780, 1300); g.quadraticCurveTo(1000, 1340, 1020, 1520); g.lineTo(1040, 1960); g.closePath(); g.fill();
  g.strokeStyle = css(shd); g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(250, 1560); g.lineTo(250, 1960); g.moveTo(830, 1560); g.lineTo(830, 1960); g.stroke();
  // neck + collar
  rrect(410, 1060, 260, 300, 60, skd, 1);
  g.fillStyle = css(shd); g.beginPath(); g.moveTo(380, 1300); g.quadraticCurveTo(540, 1420, 700, 1300); g.lineTo(660, 1300); g.quadraticCurveTo(540, 1380, 420, 1300); g.closePath(); g.fill();
  // ears
  dot(208, 760, 70, skd, 1); dot(872, 760, 70, skd, 1);
  // head
  g.fillStyle = css(sk); g.beginPath(); g.ellipse(540, 720, 335, 430, 0, 0, TAU2); g.fill();
  // hair cap
  g.save(); g.beginPath(); g.ellipse(540, 720, 345, 440, 0, 0, TAU2); g.clip();
  g.fillStyle = css(hair); g.beginPath(); g.moveTo(180, 640); g.quadraticCurveTo(200, 240, 540, 250); g.quadraticCurveTo(880, 240, 900, 640);
  g.quadraticCurveTo(860, 470, 720, 430); g.quadraticCurveTo(600, 480, 470, 420); g.quadraticCurveTo(300, 450, 180, 640); g.closePath(); g.fill(); g.restore();
  g.fillStyle = css(hair); g.beginPath(); g.ellipse(540, 330, 300, 130, 0, Math.PI, TAU2); g.fill();
  // cheeks
  soft(360, 900, 90, [255, 140, 140], 0.28 * (1 - m)); soft(720, 900, 90, [255, 140, 140], 0.28 * (1 - m));
  // brows + closed eyes (concentrating)
  g.save(); g.strokeStyle = css(ln); g.lineCap = "round"; g.lineWidth = 16;
  g.beginPath(); g.moveTo(340, 590); g.quadraticCurveTo(400, 560, 460, 585); g.stroke(); g.beginPath(); g.moveTo(620, 585); g.quadraticCurveTo(680, 560, 740, 590); g.stroke();
  g.lineWidth = 12; g.beginPath(); g.moveTo(350, 668); g.quadraticCurveTo(400, 700, 452, 668); g.stroke(); g.beginPath(); g.moveTo(628, 668); g.quadraticCurveTo(680, 700, 730, 668); g.stroke();
  // nose bridge
  g.lineWidth = 10; g.strokeStyle = css(skd); g.beginPath(); g.moveTo(512, 650); g.quadraticCurveTo(496, 760, 492, 830); g.stroke();
  g.restore();
  // mouth (under the hand mostly)
  g.save(); g.strokeStyle = css(ln); g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(470, 1020); g.quadraticCurveTo(540, 1046, 610, 1020); g.stroke(); g.restore();
  return { sk, skd, skl, ln };
}
// one nose tip (ball + wings + nostrils) at x, y, scale k; squish from the rub
function noseTip(x, y, k, cols, sq = 0, a = 1) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a;
  g.fillStyle = css(cols.skd); g.beginPath(); g.ellipse(x - 58 * k, y + 14 * k, 36 * k, 30 * k, 0, 0, TAU2); g.fill(); g.beginPath(); g.ellipse(x + 58 * k, y + 14 * k, 36 * k, 30 * k, 0, 0, TAU2); g.fill();
  g.fillStyle = css(cols.sk); g.beginPath(); g.ellipse(x, y, 64 * k * (1 + sq), 56 * k * (1 - sq), 0, 0, TAU2); g.fill();
  soft(x - 14 * k, y - 18 * k, 34 * k, cols.skl, 0.9);
  g.fillStyle = css(cols.ln); g.beginPath(); g.ellipse(x - 26 * k, y + 42 * k, 16 * k, 9 * k, 0.3, 0, TAU2); g.fill(); g.beginPath(); g.ellipse(x + 26 * k, y + 42 * k, 16 * k, 9 * k, -0.3, 0, TAU2); g.fill();
  g.restore();
}
// a "felt" nose: pink, glowing outline
function feltNose(x, y, a, pulse = 0) {
  if (a <= 0.01) return; g.save(); g.globalCompositeOperation = "lighter"; soft(x, y + 10, 150, PINK, 0.5 * a * (0.6 + 0.4 * pulse)); g.restore();
  g.save(); g.globalAlpha = a; g.fillStyle = css([255, 160, 200], 0.55); g.strokeStyle = css(PINK); g.lineWidth = 10;
  [[x - 56, y + 14, 34, 28], [x + 56, y + 14, 34, 28]].forEach(([ex, ey, rx, ry]) => { g.beginPath(); g.ellipse(ex, ey, rx, ry, 0, 0, TAU2); g.fill(); g.stroke(); });
  g.beginPath(); g.ellipse(x, y, 62 * (1 + 0.06 * pulse), 54 * (1 + 0.06 * pulse), 0, 0, TAU2); g.fill(); g.stroke();
  g.fillStyle = css([150, 30, 90]); g.beginPath(); g.ellipse(x - 25, y + 40, 15, 8, 0.3, 0, TAU2); g.fill(); g.beginPath(); g.ellipse(x + 25, y + 40, 15, 8, -0.3, 0, TAU2); g.fill();
  g.restore();
}
// the real hand: fist + crossed index (under) and middle (over) finger; dy = rub offset
function hand(T, dy, cols, fa = 1) {
  const ib = [IB[0], IB[1] + dy], mb = [MB[0], MB[1] + dy], it = [ITX[0], TY + dy], mt = [MTX[0], TY + dy];
  const hs = cols.hs, hd = cols.hd;
  // forearm/sleeve and fist
  rrect(470, 1300, 250, 700, 70, [64, 120, 190], 1); rrect(470, 1300, 250, 46, 20, [48, 96, 160], 1);
  g.save(); g.translate(0, dy); rrect(440, 1110, 320, 240, 90, hd, 1); rrect(452, 1120, 296, 220, 84, hs, 1);
  // knuckle lines and thumb across the front
  g.strokeStyle = css(hd); g.lineWidth = 9; g.lineCap = "round"; [[540, 1180, 560, 1230], [620, 1176, 636, 1226], [692, 1184, 702, 1230]].forEach(([a, b, c, d]) => { g.beginPath(); g.moveTo(a, b); g.lineTo(c, d); g.stroke(); });
  g.restore();
  capsule([486, 1262 + dy], [612, 1238 + dy], 70, hs, hd, 9);
  // index under, middle over (fa < 1 while the brain-map ghost is shown)
  capsule(ib, it, FW61, hs, hd, 9, fa); nail(ib, it, cols.nail, fa);
  capsule(mb, mt, FW61, hs, hd, 9, fa); nail(mb, mt, cols.nail, fa);
  return { ib, mb, it, mt };
}
// ghost fingers (the brain's map), u = 0 crossed → 1 uncrossed
function ghostFingers(u, dy, a) {
  if (a <= 0.01) return null; const ib = [IB[0], IB[1] + dy], mb = [MB[0], MB[1] + dy], it = [lerp(ITX[0], ITX[1], u), TY + dy - 10 * Math.sin(u * Math.PI)], mt = [lerp(MTX[0], MTX[1], u), TY + dy - 10 * Math.sin(u * Math.PI)];
  g.save(); g.globalAlpha = a; g.lineCap = "round";
  [[ib, it], [mb, mt]].forEach(([p, q]) => { g.strokeStyle = css(CYAN); g.lineWidth = FW61 + 20; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke();
    g.strokeStyle = css([200, 250, 248]); g.lineWidth = FW61; g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); });
  g.restore(); return { ib, mb, it, mt };
}
function chip61(s, x, y, size, a, fg, bgc, strike = 0) {
  if (a <= 0.01) return; g.save(); g.font = `900 ${size}px ${FONT}`; const w = g.measureText(s).width, px = size * 0.45, h = size * 1.45;
  g.globalAlpha = a; g.fillStyle = css(bgc); g.beginPath(); g.roundRect(x - w / 2 - px, y - h / 2, w + 2 * px, h, h * 0.3); g.fill(); g.restore();
  text(s, x, y + size * 0.03, size, fg, "center", 900, a);
  if (strike > 0) line(x - w / 2 - 10, y, lerp(x - w / 2 - 10, x + w / 2 + 10, eout(strike)), y, [200, 20, 70], a, 12);
}
const TITLE_Y = 150;
const DARKV = [36, 14, 60], PINKBG = [255, 216, 234], CYANBG = [204, 250, 246], CREAMBG = [250, 244, 230];

// the whole stage at global time T; o: felt (two pink noses 0..1), split (0 at the nose, 1 apart), ghost (map alpha),
// uncross (map pose), sides (outer-side glow), arrows, marble, flash
function stage(T, o = {}) {
  bg61();
  const [s, cx, cy] = camAt(T); cam61(s, cx, cy);
  const wy = lerp(160, 1980, clamp(o.marble || 0)), m = 0;
  let cols = face(T, 0);
  if ((o.marble || 0) > 0.001) { g.save(); g.beginPath(); g.rect(-200, -200, 1480, wy + 200); g.clip(); const c1 = face(T, 1); g.restore();
    if (wy > 868) cols = c1;
    if (o.marble < 0.999) { g.save(); g.globalCompositeOperation = "lighter"; const gr = g.createLinearGradient(0, wy - 60, 0, wy + 20); gr.addColorStop(0, "rgba(255,255,255,0)"); gr.addColorStop(0.75, "rgba(255,250,235,0.75)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.fillRect(-200, wy - 60, 1480, 80); g.restore(); } }
  const dy = (o.still ? 0 : rubY(T)) + (o.lift || 0);
  cols.hs = SKIN; cols.hd = SKIN_D; cols.nail = [255, 222, 214];
  const sq = 0.06 * Math.max(0, Math.sin(T * TAU2 * 2.2));
  if (o.laurel) laurel(o.laurel);
  const h = hand(T, dy, cols, o.realF ?? 1);
  noseTip(NOSE[0], NOSE[1] + dy * 0.25, 1.15, cols, sq);
  const gf = ghostFingers(o.uncross || 0, dy, o.ghost || 0);
  // the two felt noses
  const fp = feltPos(o.split ?? 1), pulse = Math.max(0, Math.sin(T * TAU2 * 2.2));
  fp.forEach(p => feltNose(p[0], p[1] + dy * 0.25, o.felt || 0, pulse));
  // outer sides: index left side (−x), middle right side (+x)
  if (o.sides) {
    const a1 = sideGlow(h.ib, h.it, -1, PINK, o.sides), a2 = sideGlow(h.mb, h.mt, +1, PINK, o.sides);
    if (gf && o.ghostSides) { const b1 = sideGlow(gf.ib, gf.it, -1, PINK, o.ghostSides), b2 = sideGlow(gf.mb, gf.mt, +1, PINK, o.ghostSides);
      if (o.arrows) { const ar = o.arrows; arrow(b1[0], b1[1], lerp(b1[0], fp[0][0] + 50, ar), lerp(b1[1], fp[0][1], ar), PINK, ar, 12, 34); arrow(b2[0], b2[1], lerp(b2[0], fp[1][0] - 50, ar), lerp(b2[1], fp[1][1], ar), PINK, ar, 12, 34); } }
  }
  if (o.ripple > 0 && o.ripple < 1) { const r = o.ripple; [[h.it[0] - 24, NOSE[1] + 50], [h.mt[0] + 24, NOSE[1] + 50]].forEach(([x, y]) => { line; g.save(); g.strokeStyle = css(PINK, 1 - r); g.lineWidth = 14; g.beginPath(); g.arc(x, y, 30 + 150 * eout(r), 0, TAU2); g.stroke(); g.restore(); }); }
  if (o.touch > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; soft(NOSE[0], NOSE[1] + 40, 150, PINK, 0.7 * o.touch * (0.7 + 0.3 * Math.sin(T * 9))); g.restore(); }
  if (o.flash > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; fp.forEach(p => { g.strokeStyle = css(PINK, o.flash); g.lineWidth = 16; g.beginPath(); g.arc(p[0], p[1], 90 + 160 * (1 - o.flash), 0, TAU2); g.stroke(); }); g.restore(); }
  g.setTransform(1, 0, 0, 1, 0, 0);
}
function laurel(u) {
  for (let side of [-1, 1]) for (let i = 0; i < 7; i++) { const k = clamp(u * 7 - i); if (k <= 0) continue;
    const an = Math.PI * (0.95 - i * 0.085), x = 540 + side * Math.cos(an) * -330, y = 560 - Math.sin(an) * 300;
    g.save(); g.translate(x, y); g.rotate(side * (0.6 - i * 0.18)); g.scale(k, k); g.fillStyle = css(LAUREL); g.beginPath(); g.ellipse(0, 0, 22, 46, 0, 0, TAU2); g.fill(); g.restore(); }
}

const SCENES = {};
const LIFT0 = 120;   // frame 0: crossed fingers just below the nose; they land on it at 0.5 s with a pink touch ripple
const liftAt = t => LIFT0 * (1 - eout(t / 0.5));
function frame0Title(a) { chip61("Try this right now", 540, TITLE_Y, 84, a, DARKV, CREAMBG); }
// 1 — hook (0–4.4 s): the test. One nose (the "two" is kept for the reveal); the hand lands at 0.5 s, then rubs.
SCENES.hook = (t, T) => {
  stage(T, { lift: liftAt(t), ripple: (t - 0.45) / 0.7, felt: 0 });
  frame0Title(1 - seg(t, 2.7, 2.8));
  chip61("Feel it?", 540, TITLE_Y, 96, seg(t, 2.85, 2.95), [120, 10, 60], PINKBG);
};
// 2 — guess (4.4–7.05): push into the fingertips, the felt noses fade; "numb fingers?" struck out on "not your fingers"
SCENES.guess = (t, T) => {
  stage(T, { felt: 0, touch: 0.6 * win(t, 0.2, 1.4, 0.3) });
  chip61("Feel it?", 540, TITLE_Y, 96, 1 - seg(t, 0.0, 0.1), [120, 10, 60], PINKBG);
  numbChip(T);
};
// 3 — reveal (7.05–9.3): pull back; the brain's map (cyan ghost fingers) uncrosses; on "uncrossed" the nose splits in two
const SPLIT0 = 8.42;   // global time of the split (word "uncrossed" ≈ 8.5 s)
function numbChip(T) { chip61("numb fingers?", 540, TITLE_Y, 84, seg(T, 4.6, 4.7) * (1 - seg(T, 7.12, 7.24)), DARKV, CREAMBG, seg(T, 5.45, 5.75)); }
SCENES.reveal = (t, T) => {
  numbChip(T);
  const unc = seg(T, 7.55, 8.45), sp = eout((T - SPLIT0) / 0.42), fl = T > SPLIT0 ? Math.exp(-(T - SPLIT0) * 2.5) : 0;
  const gh = seg(T, 7.25, 7.5);
  stage(T, { ghost: gh, realF: 1 - 0.65 * gh, uncross: unc, felt: seg(T, SPLIT0 - 0.05, SPLIT0 + 0.1), split: sp, flash: fl });
  chip61("brain map", 540, TITLE_Y, 88, seg(T, 7.26, 7.36) * (1 - seg(T, 9.15, 9.3)), [10, 70, 70], CYANBG);
};
// 4 — why (9.3–14.4): push-in on the tips, outer sides glow, map shows the same sides facing away → arrows to two noses
SCENES.why = (t, T) => {
  const zoomOut = seg(T, 12.75, 13.15), fl = T > 12.95 ? Math.exp(-(T - 12.95) * 2.2) : 0;
  // 9.4–9.8 the map fades so the REAL crossed fingers show their outer sides on the one nose (10.0); at 10.9 the map
  // comes back and uncrosses again, carrying the glowing sides outwards; arrows to the two noses at 11.6
  const gh = Math.max(1 - seg(T, 9.4, 9.8), seg(T, 10.85, 11.05));
  stage(T, { ghost: gh, realF: 1 - 0.65 * gh, uncross: T < 10.5 ? 1 : seg(T, 10.95, 11.55), felt: Math.max(1 - seg(T, 9.4, 9.8), seg(T, 11.5, 11.8)), split: 1,
    touch: seg(T, 10.0, 10.25) * (1 - seg(T, 10.85, 11.05)), sides: seg(T, 10.0, 10.25) * (1 - 0.6 * seg(T, 10.85, 11.05)), ghostSides: seg(T, 11.4, 11.6), arrows: seg(T, 11.6, 12.0), flash: fl });
  chip61("outer sides", 540, TITLE_Y, 88, seg(T, 9.95, 10.05) * (1 - seg(T, 12.55, 12.65)), [120, 10, 60], PINKBG);
  chip61("= 2 noses", 540, TITLE_Y, 96, seg(T, 12.8, 12.9) * (1 - seg(T, 14.25, 14.38)), [120, 10, 60], PINKBG);
};
// 5 — old (14.4–18.1): a light band wipes the figure into a marble bust (top → bottom), laurel grows,
// "2,000+ years" stamps in on "two thousand years ago"
SCENES.old = (t, T) => {
  const mb = seg(T, 14.45, 15.45), st = T > 16.45 ? spring(T, 16.45, 14, 0.5) : 0;
  const gh = 1 - seg(T, 14.4, 14.8);
  stage(T, { ghost: gh, realF: 1 - 0.65 * gh, uncross: 1, felt: 0.75, split: 1, marble: mb, laurel: seg(T, 15.0, 15.8) });
  if (st > 0) { g.save(); g.translate(540, TITLE_Y); const k = lerp(1.6, 1, clamp(st)); g.scale(k, k); chip61("2,000+ years", 0, 0, 96, clamp(st * 2) * (1 - seg(T, 17.95, 18.08)), [70, 50, 0], [255, 236, 170]); g.restore(); }
};
// end (18.1–20.7): the band wipes back up to skin, the one-word question; the two noses merge into one and the hand
// drops to its frame-0 spot, so the last 0.5 s are frame 0 exactly (loop)
SCENES.end = (t, T, B, E, dur) => {
  if (t > dur - 0.5) { stage(0, { lift: LIFT0, felt: 0 }); frame0Title(1); return; }
  const mg = seg(t, 0.9, 1.6), dn = seg(t, 1.5, dur - 0.55);
  stage(T, { felt: 0.85 * (1 - mg), split: 1 - mg, marble: 1 - seg(T, 18.15, 18.75), laurel: 1 - seg(T, 18.15, 18.5), lift: LIFT0 * dn });
  chip61("Two?", 540, TITLE_Y, 150, seg(t, 0.1, 0.2) * (1 - seg(t, dur - 0.62, dur - 0.52)), DARKV, CREAMBG);
};
