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
const MAS = (T, t, ev, o = {}) => MASR(T, t, { x: 150, y: 1585, s: 0.6, markX: 330, markY: 1190, ev, ...o });   // round 3: bubble in a fixed slot right of the mascot's head, off the cat

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

// light chip: cream box with dark text (readable on dark scenes; review 2026-11-26)
function chip(s, x, y, size, a, col = [40, 14, 30], bg = [255, 244, 228]) { if (a <= 0.01) return; g.save(); g.font = `900 ${size}px ${FONT}`; const w = g.measureText(s).width, px = size * 0.45, h = size * 1.5;
  g.globalAlpha = a; g.fillStyle = css(bg); g.beginPath(); g.roundRect(x - w / 2 - px, y - h / 2, w + 2 * px, h, h * 0.3); g.fill(); g.restore(); text(s, x, y + size * 0.03, size, col, "center", 900, a); }
const EX = 540 - 172 * 0.9, EY = 790 - 40 * 0.9, ERX = 116 * 0.9, ERY = 92 * 0.9;   // the cat's left eye (world)
const FACE = (o) => catFace(540, 790, 0.9, { lit: 0.38, glow: 1, gcol: HOOKCOL, dil: 1, ...o });
// the real cat face seen through a camera that pushes in on the left eye; open 0..1 cuts the eye open in place
function eyeView(S, open, T, k = 1, o = {}) {
  night(); const sx = lerp(EX, 540, k), sy = lerp(EY, 800, k);
  cam(S, EX, EY, sx, sy); FACE(o); if (o.torch) { beam(1060, 1240, EX, EY, 300, 0.7); torch(1060, 1240, Math.atan2(EY - 1240, EX - 1060)); }
  if (o.world) o.world(S);
  camReset();
  const cx = sx, cy = sy, rx = ERX * S, ry = ERY * S;
  if (open > 0.01) {
    g.save(); g.beginPath(); g.ellipse(cx, cy, rx * 0.97, ry * 0.97, -0.14, 0, TAU2); g.clip();
    g.beginPath(); g.arc(cx, cy, Math.max(1, open * rx * 1.3), 0, TAU2); g.clip();
    const C = [cx + 0.55 * rx, cy], R1 = 1.2 * rx, R2 = R1 + 52;
    g.fillStyle = "rgb(70,26,44)"; g.fillRect(cx - rx, cy - ry, 2 * rx, 2 * ry);
    // mirror ring: chrome with a moving specular highlight
    const gr = g.createLinearGradient(C[0] - R2, cy - ry, C[0] - R2 + 60, cy + ry); gr.addColorStop(0, "rgb(170,236,110)"); gr.addColorStop(0.45, "rgb(250,255,235)"); gr.addColorStop(0.55, "rgb(255,255,255)"); gr.addColorStop(1, "rgb(140,220,80)");
    g.strokeStyle = gr; g.lineWidth = 50; g.beginPath(); g.arc(C[0], C[1], R2, Math.PI * 0.55, Math.PI * 1.45); g.stroke();
    const sh = o.shine ?? 1; if (sh > 0.01) { g.save(); g.globalCompositeOperation = "lighter"; const an = Math.PI * (1 + 0.35 * Math.sin(T * 1.6)); soft(C[0] + Math.cos(an) * R2, C[1] + Math.sin(an) * R2, 130, [255, 255, 240], 0.9 * sh); g.restore(); }
    g.strokeStyle = "rgb(236,120,120)"; g.lineWidth = 40; g.beginPath(); g.arc(C[0], C[1], R1, Math.PI * 0.5, Math.PI * 1.5); g.stroke();
    if (o.rod) { g.save(); g.globalCompositeOperation = "lighter"; soft(o.rod[0], o.rod[1], 110, [255, 240, 140], o.rod[2]); g.restore(); }
    g.fillStyle = "rgb(40,16,34)"; g.beginPath(); g.arc(C[0], C[1], R1 - 20, 0, TAU2); g.fill();
    g.fillStyle = "rgba(210,236,250,0.85)"; g.beginPath(); g.ellipse(cx + 0.66 * rx, cy, 0.12 * rx, 0.5 * ry, 0, 0, TAU2); g.fill();
    g.restore();
    g.save(); g.globalAlpha = open; g.strokeStyle = "rgb(18,10,14)"; g.lineWidth = 16; g.beginPath(); g.ellipse(cx, cy, rx * 0.97, ry * 0.97, -0.14, 0, TAU2); g.stroke(); g.restore();
    return { cx, cy, rx, ry, C, R1, R2 };
  }
  return { cx, cy, rx, ry };
}
function photon(x, y, col, a = 1) { if (a <= 0.01) return; g.save(); g.globalCompositeOperation = "lighter"; soft(x, y, 110, col, 0.7 * a); g.restore(); dot(x, y, 40, col, a); dot(x - 10, y - 10, 14, [255, 255, 255], 0.9 * a); }

const SCENES = {};
// 1 — hook: the beam is on the cat from frame one (eyes blazing); the beam drifts, the eyes flare on "light up";
// hard cut to a person in the same beam: no glow.
function hookCat(t, T, beamOn, flare) {
  night(); cam(lerp(1.0, 1.04, clamp(t / 3)), 540, 860);
  const tx = 540 + 40 * Math.sin(t * 1.3), ty = 760 + 20 * Math.sin(t * 0.9);
  catFace(540, 790, 0.9, { lit: 0.08 + 0.3 * beamOn, glow: beamOn * (1 + 0.35 * flare), gcol: HOOKCOL, dil: 1 });
  beam(1060, 1240, tx, ty, 520, 0.9);
  camReset(); torch(1060, 1240, Math.atan2(ty - 1240, tx - 1060));
}
SCENES.hook = (t, T, B, E, dur) => {
  if (t < 3.1) {
    const flare = Math.exp(-Math.max(0, t - 2.05) * 2) * seg(t, 1.95, 2.1);
    hookCat(t, T, 1, flare);
    PL("eyes light up", 560, 1260, 58, SHINE, seg(t, 2.1, 2.3), 900);
    MAS(T, t, [[0.4, "!"], [2.1, "!"]]);
  } else {
    const u = t - 3.1; night(0.8); cam(lerp(1.06, 1.0, eout(u / 0.6)), 540, 860);
    humanFace(540, 800, 0.92, 0.9);
    beam(1060, 1240, 540, 760, 520, 0.9); camReset(); torch(1060, 1240, Math.atan2(760 - 1240, 540 - 1060));
    PL("your eyes: no glow", 560, 1260, 58, NOPE, seg(u, 0.25, 0.45), 900);
    MAS(T, t, [[3.3, "?", "wince"]]);
  }
};
// 2 — guess: close on the cat's eye; "makes its own light?" struck out; then the whole face with thick beams: in from the torch, back out
SCENES.guess = (t, T, B, E, dur) => {
  if (t < 1.5) {
    night(); cam(lerp(2.3, 2.45, t / 1.5), EX, EY, 540, 820); FACE({ lit: 0.3, glow: 0.9 }); camReset();
    const bx = 540, by = 820; g.save(); g.globalAlpha = seg(t, 0.15, 0.35); g.fillStyle = css(AMBER); g.beginPath(); g.arc(bx, by - 30, 90, 0, TAU2); g.fill(); g.fillRect(bx - 45, by + 50, 90, 70);
    g.strokeStyle = css(AMBER); g.lineWidth = 14; g.lineCap = "round"; for (let k = 0; k < 7; k++) { const an = -Math.PI + k * Math.PI / 6; g.beginPath(); g.moveTo(bx + Math.cos(an) * 120, by - 30 + Math.sin(an) * 120); g.lineTo(bx + Math.cos(an) * 165, by - 30 + Math.sin(an) * 165); g.stroke(); } g.restore();
    const x = spring(t, 1.0, 14, 0.5); if (x > 0.01) { g.save(); g.strokeStyle = css(NOPE); g.lineWidth = 46; g.lineCap = "round"; const r = 260 * Math.min(1.1, x); g.beginPath(); g.moveTo(bx - r, by - r); g.lineTo(bx + r, by + r); g.moveTo(bx + r, by - r); g.lineTo(bx - r, by + r); g.stroke(); g.restore(); }
    chip("makes its own light?", 540, 330, 58, seg(t, 0.1, 0.3));
    PL("NO", 540, 1240, 80, NOPE, seg(t, 1.0, 1.15), 900);
    MAS(T, t, [[1.05, "!", "wince"]], { nomark: true });
  } else {
    const u = t - 1.5; night(); FACE({ lit: 0.35, glow: 0.5 + 0.6 * seg(u, 0.45, 0.6) });
    const ax = 1040, ay = 1210, dx = EX - ax, dy = EY - ay, L = Math.hypot(dx, dy), nx = -dy / L * 26, ny = dx / L * 26;
    const pin = eout(u / 0.5), pout = eout((u - 0.5) / 0.6);
    line(ax + nx, ay + ny, lerp(ax, EX, pin) + nx, lerp(ay, EY, pin) + ny, [255, 226, 140], 1, 18);
    if (pin > 0.95) arrow(ax + nx, ay + ny, EX + nx * 1.6, EY + ny * 1.6, [255, 226, 140], 1, 18, 54);
    if (u > 0.5) arrow(EX - nx, EY - ny, lerp(EX, ax, pout) - nx, lerp(EY, ay, pout) - ny, SHINE, 1, 18, 54);
    if (u > 0.45) { g.save(); g.globalCompositeOperation = "lighter"; soft(EX, EY, 200, SHINE, 0.8 * Math.exp(-(u - 0.45) * 3)); g.restore(); }
    for (let i = 0; i < 4; i++) { const p = ((u * 1.2 + i / 4) % 1); photon(lerp(ax, EX, p) + nx, lerp(ay, EY, p) + ny, PHOT, 0.6 * seg(u, 0, 0.3)); }
    torch(1060, 1240, Math.atan2(EY - 1240, EX - 1060));
    chip("it bounces YOUR light back", 540, 330, 56, seg(u, 0.15, 0.35));
    MAS(T, t, [[1.7, "idea"]], { nomark: true });
  }
};
// 3 — mirror (reveal): push in on the real eye and cut it open in place: retina, and a chrome mirror behind it
SCENES.mirror = (t, T, B, E, dur) => {
  const S = lerp(1.0, 4.2, eio(t / 0.9)), open = seg(t, 0.85, 1.35);
  const v = eyeView(S, open, T, eio(t / 0.9), { shine: seg(t, 1.15, 1.4) * (0.65 + 0.35 * Math.sin(T * 5)) });
  chip("inside the eye", 540, 330, 56, seg(t, 0.9, 1.05) * (1 - seg(t, 1.18, 1.28)));
  chip("a MIRROR behind the retina", 540, 330, 56, seg(t, 1.32, 1.45));
  if (open > 0.5) { const mx = v.C[0] - v.R2, rxp = v.C[0] - v.R1;
    chip("mirror", mx + 40, v.cy - 200, 50, seg(t, 1.4, 1.6), [30, 60, 10], [210, 250, 160]);
    chip("retina", rxp + 120, v.cy + 200, 50, seg(t, 1.0, 1.2), [80, 20, 30], [255, 210, 210]); }
  chip("tapetum lucidum", 600, 1250, 58, seg(t, 2.35, 2.55), [30, 60, 10], [210, 250, 160]);
  MAS(T, t, [[1.3, "!"]], { nomark: true, s: 0.6 + 0.18 * win(t, 1.2, 2.8, 0.3) });
};
// 4 — second chance: one big photon slips past the retina, hits the mirror, comes back and lights a cell on the way out
SCENES.second = (t, T, B, E, dur) => {
  const py0 = -60, ti = 0.15, tm = 1.9, te = 3.9;
  // geometry at S 4.2, view centred
  const S = 4.2, rx = ERX * S, cx = 540, cy = 800, C0 = cx + 0.55 * rx, R1 = 1.2 * rx, R2 = R1 + 52;
  const x0 = cx + rx + 60, xm = C0 - Math.sqrt((R2 - 24) ** 2 - py0 * py0), xr = C0 - Math.sqrt(R1 * R1 - py0 * py0);
  const py = cy + py0;
  let x, col = PHOT; if (t < tm) x = lerp(x0, xm, clamp((t - ti) / (tm - ti))); else { x = lerp(xm, x0 + 200, clamp((t - tm) / (te - tm))); col = SHINE; }
  const tr = tm + (xr - xm) / (x0 + 200 - xm) * (te - tm), rodA = t > tr ? Math.exp(-(t - tr) * 0.5) : 0;
  const v = eyeView(S, 1, T, 1, { shine: 0.6 + 0.4 * Math.exp(-Math.max(0, t - tm) * 2), rod: [xr, py, rodA] });
  photon(x, py, col, t < ti ? 0 : 1);
  if (t > tm && t < tm + 0.5) { g.save(); g.globalCompositeOperation = "lighter"; soft(xm, py, 260, [255, 255, 230], 0.9 * (1 - (t - tm) / 0.5)); g.restore(); }
  chip("light slips past the retina", 540, 330, 54, seg(t, 0.3, 0.5) * (1 - seg(t, 1.75, 1.9)));
  chip("hits the mirror…", 540, 330, 58, seg(t, 1.9, 2.05) * (1 - seg(t, 2.45, 2.55)), [30, 60, 10], [210, 250, 160]);
  chip("2nd chance!", 540, 330, 72, seg(t, 2.5, 2.65), [30, 60, 10], [210, 250, 160]);
  chip("caught", xr + 40, py + 150, 50, rodA > 0.05 ? Math.min(1, rodA * 1.5) : 0, [80, 40, 0], [255, 230, 140]);
  MAS(T, t, [[1.95, "!"]], { nomark: true });
};
// 5 — leak: zoom back out; light that is not caught streams out of the eye to the torch; the whole face glows
SCENES.leak = (t, T, B, E, dur) => {
  const k = eio((t - 0.3) / 1.9), S = lerp(4.2, 1.0, k), open = 1 - seg(t, 0.8, 1.4);
  eyeView(S, open, T, 1 - k, { torch: true, lit: 0.38, glow: 1 + 0.4 * Math.exp(-Math.max(0, t - 2.45) * 2.5) * (t > 2.45 ? 1 : 0),
    world: () => { for (let i = 0; i < 8; i++) { const p = ((t * 0.8 + i / 8) % 1); const x = lerp(EX, 1040, p), y = lerp(EY, 1210, p); dot(x, y, 16, SHINE, seg(t, 0.4, 0.8)); soft(x, y, 40, SHINE, 0.5 * seg(t, 0.4, 0.8)); } } });
  chip("some escapes, back to your light", 540, 330, 50, seg(t, 0.3, 0.5) * (1 - seg(t, 2.3, 2.45)));
  PL("THAT's the glow", 560, 360, 72, SHINE, seg(t, 2.5, 2.7), 900);
  MAS(T, t, [[2.5, "ok", "smile"]], { nomark: t < 2.4, s: 0.6 + 0.18 * win(t, 2.45, 3.8, 0.3) });
};
// 6 — cost: light needed to see (you: six bulbs, cat: one), then the price: the same running mouse, sharp for you, blurry for the cat
function bulb(x, y, r, on) { g.save(); if (on > 0.01) { g.globalCompositeOperation = "lighter"; soft(x, y, r * 2.2, AMBER, 0.6 * on); g.globalCompositeOperation = "source-over"; }
  g.fillStyle = css(mix([90, 70, 80], [255, 222, 120], on)); g.beginPath(); g.arc(x, y, r, 0, TAU2); g.fill(); g.fillStyle = "rgb(150,140,150)"; g.fillRect(x - r * 0.45, y + r * 0.8, r * 0.9, r * 0.55); g.restore(); }
function toyMouse(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = "rgb(150,150,165)"; g.beginPath(); g.ellipse(0, 0, 200, 120, 0, 0, TAU2); g.fill(); g.beginPath(); g.moveTo(170, -40); g.quadraticCurveTo(320, 0, 170, 60); g.fill();
  g.fillStyle = "rgb(240,160,180)"; g.beginPath(); g.arc(150, -110, 60, 0, TAU2); g.fill(); g.beginPath(); g.arc(310, 6, 18, 0, TAU2); g.fill();
  g.fillStyle = "rgb(20,20,30)"; g.beginPath(); g.arc(230, -20, 16, 0, TAU2); g.fill();
  g.strokeStyle = "rgb(240,160,180)"; g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(-200, 10); g.bezierCurveTo(-330, 40, -300, 160, -420, 120); g.stroke();
  g.strokeStyle = "rgb(60,60,70)"; g.lineWidth = 8; [-20, 0, 20].forEach(d => { g.beginPath(); g.moveTo(300, 10 + d * 0.4); g.lineTo(400, -10 + d * 2); g.stroke(); });
  g.restore(); }
SCENES.cost = (t, T, B, E, dur) => {
  if (t < 3.15) {
    night(0.9);
    chip("light needed to see", 560, 330, 60, seg(t, 0.05, 0.25));
    humanFace(215, 500, 0.36, 0.9); catFace(215, 900, 0.3, { lit: 0.9, glow: 0.6, gcol: HOOKCOL }); chip("you", 215, 690, 44, seg(t, 0.1, 0.3)); chip("cat", 215, 1075, 44, seg(t, 0.1, 0.3), [30, 60, 10], [210, 250, 160]);
    for (let i = 0; i < 6; i++) bulb(420 + i * 108, 500, 44, seg(t, 0.35 + i * 0.3, 0.5 + i * 0.3));
    bulb(420, 900, 44, seg(t, 2.25, 2.4));
    PL("you need 6", 690, 620, 56, AMBER, seg(t, 2.0, 2.2), 900);
    PL("a cat needs 1", 720, 900, 60, SHINE, seg(t, 2.35, 2.55), 900);
    MAS(T, t, [[0.5, "?"], [2.4, "!"]]);
  } else {
    const u = t - 3.15; warmbg();
    const mx = 690 + 150 * Math.sin(u * 2.2), bl = 8 * seg(u, 0.9, 1.3);
    const panel = (y0, h, label, blur, col) => { g.save(); rrect(330, y0, 720, h, 30, [70, 30, 56], 1, [255, 244, 228], 8); g.beginPath(); g.roundRect(330, y0, 720, h, 30); g.clip();
      g.fillStyle = "rgb(120,60,70)"; g.fillRect(330, y0 + h * 0.72, 720, h); if (blur > 0.1) g.filter = `blur(${blur.toFixed(1)}px)`; toyMouse(mx, y0 + h * 0.52, 0.62); g.filter = "none"; g.restore(); chip(label, 450, y0 + 50, 48, 1, [40, 14, 30], col); };
    panel(420, 420, "you", 0, [255, 244, 228]); panel(880, 420, "cat", bl, [210, 250, 160]);
    chip("the price:", 690, 330, 58, seg(u, 0.05, 0.25) * (1 - seg(u, 0.8, 0.95)));
    chip("a slightly blurrier picture", 690, 330, 54, seg(u, 1.0, 1.2), [80, 40, 0], [255, 214, 150]);
    MAS(T, t, [[1.2, "!", "wince"]], { nomark: true });
  }
};
// end: the glowing cat; the eyeshine switches green ↔ gold; the last 0.6 s are frame one again (loop).
SCENES.end = (t, T, B, E, dur) => {
  const toGold = seg(t, 1.1, 1.3) * (1 - seg(t, 2.2, 2.4)), col = mix(SHINE, [255, 168, 40], toGold);
  if (t > dur - 0.6) { hookCat(0, T, 1, 0); MAS(T, t, [[dur - 0.5, "!"]]); return; }
  night(); cam(1.0, 540, 860); catFace(540, 790, 0.9, { lit: 0.38, glow: 1, gcol: col, dil: 1 });
  beam(1060, 1240, 540, 760, 520, 0.9); camReset(); torch(1060, 1240, Math.atan2(760 - 1240, 540 - 1060));
  PL(toGold > 0.5 ? "gold?" : "green?", 560, 1260, 64, col, seg(t, 0.3, 0.5), 900);
  MAS(T, t, [[0.3, "?", "grin"], [1.2, "!"], [2.3, "?"]]);
};
