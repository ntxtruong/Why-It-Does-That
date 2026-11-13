// Episode 26 (new Short, 1080×1920) — Why does your phone go dark through sunglasses?
// Physics (claims.md; OpenStax UP3 1.7, Hecht ch. 8): the screen emits linearly polarized light (drawn here as a sideways
// wiggle); polarized sunglasses worn upright pass up-and-down wiggles. Through two linear polarizers at angle θ the
// intensity is I = I₀ cos²θ (Malus). Every brightness seen through a lens below comes from that formula, plus a small
// leak (real filters pass a little when crossed) and the lens's own grey tint for unpolarized room light.

const LEAK = 0.02, TINT = 0.45;                       // crossed leak; transmission of the tinted lens for unpolarized light
const malus = th => LEAK + (1 - LEAK) * Math.cos(th) ** 2;
const SCREEN_POL = 0;                                 // the screen's wiggle: sideways (0 rad = horizontal)
const LENS_POL = Math.PI / 2;                         // upright lens passes up-and-down (vertical)
// what fraction of the screen light reaches the eye through a lens tilted by alpha (head tilt)
const thru = alpha => malus(LENS_POL + alpha - SCREEN_POL);

// ---- the phone, the hand and the lens ----
const PH = { x: 540, y: 905, w: 390, h: 760 };
const APPS = [[255, 138, 122], [255, 212, 94], [140, 198, 255], [150, 226, 170], [200, 160, 255], [255, 170, 90]];
function room() {
  clear(BG);
  const gr = g.createRadialGradient(560, 760, 80, 560, 760, 900);
  gr.addColorStop(0, "rgb(104,134,200)"); gr.addColorStop(0.6, "rgb(66,92,154)"); gr.addColorStop(1, "rgb(24,38,79)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // a window frame behind, so the lens's grey tint on ordinary light is visible
  g.fillStyle = "rgba(200,226,255,0.16)"; g.fillRect(600, 420, 400, 480);
  g.strokeStyle = "rgba(220,236,255,0.35)"; g.lineWidth = 10; g.strokeRect(600, 420, 400, 480); g.beginPath(); g.moveTo(800, 420); g.lineTo(800, 900); g.moveTo(600, 660); g.lineTo(1000, 660); g.stroke();
}
function screenFace(T, k = 1) {
  const { x, y, w, h } = PH, x0 = x - w / 2 + 22, y0 = y - h / 2 + 22, sw = w - 44, sh = h - 44;
  const gr = g.createLinearGradient(x0, y0, x0 + sw, y0 + sh);
  gr.addColorStop(0, "rgb(255,150,120)"); gr.addColorStop(0.5, "rgb(255,214,120)"); gr.addColorStop(1, "rgb(130,196,255)");
  g.fillStyle = gr; g.beginPath(); g.roundRect(x0, y0, sw, sh, 34); g.fill();
  // clock and invented app tiles; one tile pulses gently so the screen is visibly "on"
  text("9:41", x, y0 + 110, 92, "#22305e", "center", 800, 0.9);
  for (let i = 0; i < 12; i++) { const c = i % 3, r = (i / 3) | 0, bx = x0 + 40 + c * 116, by = y0 + 230 + r * 128;
    const p = i === 4 ? 0.12 * (0.5 + 0.5 * Math.sin(T * 3)) : 0;
    rrect(bx - p * 20, by - p * 20, 84 + p * 40, 84 + p * 40, 22, APPS[i % 6], 1, "rgba(255,255,255,0.85)", 4); }
  rrect(x0 + 30, y0 + sh - 120, sw - 60, 90, 30, [255, 255, 255], 0.35);
}
function phone(T) {
  const { x, y, w, h } = PH;
  g.fillStyle = "#151a2c"; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, 56); g.fill();
  g.strokeStyle = "rgba(242,245,251,0.85)"; g.lineWidth = 6; g.stroke();
  screenFace(T);
  g.fillStyle = "#151a2c"; g.beginPath(); g.roundRect(x - 60, y - h / 2 + 34, 120, 30, 15); g.fill();
}
function hand() {
  const { x, y, w, h } = PH;
  g.save(); g.fillStyle = "#f6e3d3"; g.strokeStyle = "#F2F5FB"; g.lineWidth = 6;
  g.beginPath(); g.moveTo(x + w / 2 + 120, y + h / 2 + 300); g.quadraticCurveTo(x + w / 2 + 40, y + h / 2 - 40, x + w / 2 - 10, y + h / 2 - 170);
  g.quadraticCurveTo(x + w / 2 + 24, y + h / 2 - 200, x + w / 2 + 50, y + h / 2 - 150); g.quadraticCurveTo(x + w / 2 + 110, y + h / 2 + 10, x + w / 2 + 220, y + h / 2 + 300); g.closePath(); g.fill(); g.stroke();
  // thumb over the lower left edge
  g.beginPath(); g.moveTo(x - w / 2 - 70, y + h / 2 + 260); g.quadraticCurveTo(x - w / 2 - 40, y + h / 2 - 60, x - w / 2 + 40, y + h / 2 - 120);
  g.quadraticCurveTo(x - w / 2 + 80, y + h / 2 - 100, x - w / 2 + 50, y + h / 2 - 60); g.quadraticCurveTo(x - w / 2 + 10, y + h / 2 + 60, x - w / 2 + 40, y + h / 2 + 260); g.closePath(); g.fill(); g.stroke();
  g.restore();
}
// the lens: centre, radii, tilt alpha. Inside it the world is darkened: room light by TINT, screen light by thru(alpha).
const LENS = { x: 480, y: 790, rx: 320, ry: 240 };
function lensPath(alpha, s = 1) { g.beginPath(); g.ellipse(LENS.x, LENS.y, LENS.rx * s, LENS.ry * s, alpha, 0, TAU2); }
function lens(alpha, T, a = 1) {
  if (a <= 0.01) return;
  const { x, y, w, h } = PH;
  g.save(); lensPath(alpha); g.clip();
  // room light (unpolarized): the lens's grey tint, everywhere except the screen
  g.beginPath(); g.rect(0, 0, W, H); g.roundRect(x - w / 2 + 22, y - h / 2 + 22, w - 44, h - 44, 34);
  g.fillStyle = `rgba(10,14,28,${a * (1 - TINT)})`; g.fill("evenodd");
  // screen light (polarized): Malus. Lined up it is brighter than the room through the lens; crossed it is near black.
  const F = 0.88 * thru(alpha);
  g.beginPath(); g.roundRect(x - w / 2 + 22, y - h / 2 + 22, w - 44, h - 44, 34);
  g.fillStyle = `rgba(4,6,14,${a * (1 - F)})`; g.fill();
  g.restore();
  // the phone's edge still shows through the lens, so the object reads as a phone
  g.save(); lensPath(alpha); g.clip(); g.strokeStyle = "rgba(242,245,251,0.55)"; g.lineWidth = 5; g.beginPath(); g.roundRect(x - w / 2, y - h / 2, w, h, 56); g.stroke(); g.restore();
  // frame and a soft reflection
  g.save(); g.globalAlpha = a; g.lineWidth = 26; g.strokeStyle = "#0d1020"; lensPath(alpha); g.stroke();
  g.lineWidth = 6; g.strokeStyle = "rgba(242,245,251,0.75)"; lensPath(alpha, 1.045); g.stroke();
  g.translate(LENS.x, LENS.y); g.rotate(alpha);
  g.strokeStyle = "rgba(255,255,255,0.22)"; g.lineWidth = 18; g.lineCap = "round"; g.beginPath(); g.ellipse(0, 0, LENS.rx * 0.78, LENS.ry * 0.72, 0, 3.6, 4.4); g.stroke();
  // the bridge and the start of the other lens, off to the left
  g.lineWidth = 22; g.strokeStyle = "#0d1020"; g.beginPath(); g.moveTo(-LENS.rx - 4, -LENS.ry * 0.25); g.quadraticCurveTo(-LENS.rx - 60, -LENS.ry * 0.55, -LENS.rx - 130, -LENS.ry * 0.3); g.stroke();
  g.restore();
}
function tiltArrow(alpha, a) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.strokeStyle = css(GOLDc); g.lineWidth = 10; g.lineCap = "round";
  const r = 380, a0 = -Math.PI / 2 - 0.15, a1 = -Math.PI / 2 + alpha + 0.05;
  g.beginPath(); g.arc(LENS.x, LENS.y, r, a0, Math.max(a0 + 0.05, a1)); g.stroke();
  const ex = LENS.x + r * Math.cos(a1), ey = LENS.y + r * Math.sin(a1), an = a1 + Math.PI / 2;
  poly([[ex - 26 * Math.cos(an - 0.5), ey - 26 * Math.sin(an - 0.5)], [ex, ey], [ex - 26 * Math.cos(an + 0.5), ey - 26 * Math.sin(an + 0.5)]], GOLDc, 1, 10);
  g.restore();
}
function meterBar(x, y, v, a, label) {   // brightness reaching the eye, 0..1
  if (a <= 0.01) return;
  rrect(x - 30, y - 34, 380, 68, 20, [24, 34, 70], a * 0.92);
  rrect(x, y - 14, 240, 28, 10, [70, 84, 120], a);
  rrect(x, y - 14, 240 * clamp(v), 28, 10, GOLDc, a);
  text(label ?? Math.round(v * 100) + "%", x + 300, y + 2, 40, GOLD, "center", 900, a);
}

// ---- waves (pseudo-3D): a beam along a path; wiggle direction phi: 0 = sideways (drawn as a slanted, depth wiggle),
// π/2 = up-and-down in the picture plane. The glyph at the front shows the direction head-on.
function wave(x0, y0, x1, y1, phi, t, a = 1, col = GOLDc, amp = 46, lw = 7, head = 1) {
  if (a <= 0.01) return;
  const L = Math.hypot(x1 - x0, y1 - y0); if (L < 2) return;
  const ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux;
  const dx = 0.62, dy = -0.42;                                  // the depth axis drawn as a slant
  const ox = nx * Math.sin(phi) + dx * Math.cos(phi), oy = ny * Math.sin(phi) + dy * Math.cos(phi);
  const pts = [];
  for (let s = 0; s <= L; s += 6) { const e = Math.min(1, s / 30, (L - s) / 30 + 0.2), w = Math.sin(s / 34 - t * 9) * amp * e; pts.push([x0 + ux * s + ox * w, y0 + uy * s + oy * w]); }
  line(x0, y0, x1, y1, col, a * 0.25, 3);
  poly(pts, col, a, lw);
  if (head) glyph(x1 + ux * 46, y1 + uy * 46, phi, a, col);
}
function glyph(x, y, phi, a, col = GOLDc) {     // double arrow seen head-on
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.fillStyle = "rgba(24,34,70,0.9)"; g.beginPath(); g.arc(x, y, 40, 0, TAU2); g.fill(); g.restore();
  const c = Math.cos(phi + Math.PI), s = -Math.sin(phi + Math.PI), r = 26;
  // phi measured from horizontal, counter-clockwise; screen y down
  const ax = Math.cos(phi) * r, ay = -Math.sin(phi) * r;
  arrow(x, y, x + ax, y + ay, col, a, 6, 13); arrow(x, y, x - ax, y - ay, col, a, 6, 13);
}
// a polarizing filter seen head-on: a lens shape with slats along the direction it passes
function fence(x, y, r, passAng, a, label) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, y);
  g.fillStyle = "rgba(12,16,32,0.72)"; g.beginPath(); g.ellipse(0, 0, r, r * 0.86, 0, 0, TAU2); g.fill();
  g.save(); g.beginPath(); g.ellipse(0, 0, r, r * 0.86, 0, 0, TAU2); g.clip();
  g.rotate(-passAng); g.fillStyle = "rgba(170,183,209,0.85)";
  // slats perpendicular to the gaps: gaps run along the pass direction
  for (let i = -8; i <= 8; i++) g.fillRect(-r * 1.2, i * r / 4.2 - r / 20, r * 2.4, r / 10);
  g.restore();
  g.lineWidth = 12; g.strokeStyle = "#0d1020"; g.beginPath(); g.ellipse(0, 0, r, r * 0.86, 0, 0, TAU2); g.stroke();
  g.lineWidth = 4; g.strokeStyle = "rgba(242,245,251,0.8)"; g.beginPath(); g.ellipse(0, 0, r + 9, r * 0.86 + 9, 0, 0, TAU2); g.stroke();
  g.restore();
  if (label) plate(label, x, y + r * 0.86 + 60, 42, INK, "center", a, 800);
}
function lamp(x, y, a) {
  if (a <= 0.01) return;
  soft(x, y, 140, [255, 236, 170], a * 0.6); dot(x, y, 46, [255, 240, 190], a);
  g.save(); g.globalAlpha = a; g.fillStyle = "#3a4466"; g.beginPath(); g.roundRect(x - 22, y + 40, 44, 50, 8); g.fill(); g.restore();
}
function phoneIcon(x, y, a) {
  if (a <= 0.01) return;
  rrect(x - 60, y - 110, 120, 220, 22, "#151a2c", a, "rgba(242,245,251,0.9)", 5);
  g.save(); g.globalAlpha = a; const gr = g.createLinearGradient(x - 50, y - 100, x + 50, y + 100); gr.addColorStop(0, "rgb(255,150,120)"); gr.addColorStop(1, "rgb(130,196,255)");
  g.fillStyle = gr; g.beginPath(); g.roundRect(x - 50, y - 100, 100, 200, 16); g.fill(); g.restore();
}

const look = [0.9, -0.6];
const SCENES = {};

// 1 — hook: frame one = phone behind the lens, near black through it; the lens tilts (head tilt) and the screen returns
SCENES.hook = (t, T, B, E, dur) => {
  room(); hand(); phone(T);
  const tilt = seg(t, B(1) + 0.3, B(1) + 1.6) * (1 - seg(t, dur - 0.9, dur - 0.1) * 0.0);
  const alpha = 0.85 * tilt;                                // up to about 49°
  lens(alpha, T);
  tiltArrow(alpha, win(t, B(1) + 0.2, dur, 0.3));
  plate("dark?", 480, 1110, 56, CORAL, "center", win(t, 0.6, B(1) + 0.3, 0.3), 900);
  plate("tilt", 880, 520, 50, GOLD, "center", win(t, B(1) + 0.4, dur, 0.3), 900);
  MASR(T, t, { ev: [[0.5, "?"], [B(1) + 1.5, "!", "grin"]], look, mouth: "o" });
};

// 2 — light: push into the screen idea. A lamp sends waves wiggling every way; the phone sends one way only (sideways).
SCENES.light = (t, T, B, E, dur) => {
  room();
  const a1 = win(t, 0.1, B(1) + 0.2, 0.35);
  lamp(200, 640, a1);
  const dirs = [0, 0.6, 1.2, 1.9, 2.5];
  dirs.forEach((phi, i) => { const y = 470 + i * 85, L = seg(t, 0.2 + i * 0.25, 1.4 + i * 0.25);
    wave(260, 640, lerp(260, 740, L), y, phi + 0.25 * Math.sin(T * 0.8 + i), T + i, a1 * 0.9, i % 2 ? BLUEc : GOLDc, 26, 5, L > 0.9 ? 1 : 0); });
  plate("any direction", 540, 420, 50, INK, "center", win(t, 0.8, B(1) + 0.1, 0.3), 800);
  const a2 = seg(t, B(1) - 0.1, B(1) + 0.4);
  phoneIcon(200, 1000, a2);
  const L2 = seg(t, B(1) + 0.2, B(1) + 1.4);
  wave(270, 1000, lerp(270, 760, L2), 1000, SCREEN_POL, T, a2, GOLDc, 46, 7, L2 > 0.9 ? 1 : 0);
  plate("one way only", 540, 1180, 50, GOLD, "center", seg(t, B(1) + 1.2, B(1) + 1.6), 900);
  MASR(T, t, { ev: [[0.6, "?"], [B(1) + 1.4, "idea", "smile"]], look, mouth: "o" });
};

// 3 — glasses: the lens is a filter (slats along the up-down direction). Glare off the road wiggles sideways: blocked.
SCENES.glasses = (t, T, B, E, dur) => {
  room();
  const fx = 620, fy = 760;
  fence(fx, fy, 210, Math.PI / 2, seg(t, 0.1, 0.6), null);
  plate("sunglasses = filter", 560, 460, 52, GOLD, "center", win(t, 0.3, B(1) + 0.4, 0.3), 900);
  // road with glare, below
  const ra = seg(t, B(1) - 0.2, B(1) + 0.4);
  g.save(); g.globalAlpha = ra; g.fillStyle = "rgb(60,70,96)"; g.beginPath(); g.moveTo(0, 1250); g.lineTo(W, 1250); g.lineTo(W, 1080); g.lineTo(0, 1180); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,240,200,0.9)"; g.lineWidth = 8; g.setLineDash([60, 40]); g.beginPath(); g.moveTo(0, 1215); g.lineTo(W, 1165); g.stroke(); g.restore();
  soft(500, 1160, 120, [255, 244, 200], ra * 0.8);
  // glare: sideways wiggle travels up to the lens and stops at it
  const Lg = seg(t, B(1) + 0.3, B(1) + 1.4);
  wave(500, 1140, lerp(500, fx - 40, Lg), lerp(1140, fy + 70, Lg), 0, T, ra, CORALc, 40, 7, 0);
  const stop = seg(t, B(1) + 1.3, B(1) + 1.7);
  if (stop > 0.01) { line(fx - 70, fy + 20, fx - 10, fy + 100, CORALc, stop, 12); line(fx - 70, fy + 100, fx - 10, fy + 20, CORALc, stop, 12); }
  plate("glare: blocked", 780, 1020, 46, CORAL, "center", stop, 900);
  // an up-and-down wave goes straight through
  const Lv = seg(t, B(1) + 2.0, B(1) + 3.2);
  wave(140, 700, lerp(140, 860, Lv), 700, Math.PI / 2, T, seg(t, B(1) + 1.9, B(1) + 2.2) * (1 - seg(t, dur - 0.5, dur)), GOLDc, 46, 7, Lv > 0.95 ? 1 : 0);
  plate("up-down: passes", 800, 470, 46, GOLD, "center", seg(t, B(1) + 2.8, B(1) + 3.2), 900);
  MASR(T, t, { ev: [[B(1) + 1.5, "!"], [B(1) + 3.0, "ok", "smile"]], look, mouth: "o" });
};

// 4 — cross: screen filter + lens filter in a row. Aligned → through (100 %); the lens turns a quarter turn → almost nothing.
SCENES.cross = (t, T, B, E, dur) => {
  room();
  const f1 = 330, f2 = 720, fy = 700;
  const rot = seg(t, B(1) + 0.6, B(1) + 2.2);                 // 0 → quarter turn
  const lensAng = SCREEN_POL + rot * Math.PI / 2;
  const k = malus(lensAng - SCREEN_POL);
  phoneIcon(110, fy, 1);
  fence(f1, fy, 150, SCREEN_POL, 1, "screen");
  fence(f2, fy, 150, lensAng, 1, rot < 0.5 ? "glasses, head tilted" : "glasses, upright");
  const L1 = seg(t, 0.2, 1.0);
  wave(170, fy, lerp(170, f1 + 150, L1), fy, SCREEN_POL, T, 1, GOLDc, 40, 7, 0);
  wave(f1 + 150, fy, f2 - 150, fy, SCREEN_POL, T, L1 > 0.99 ? 1 : 0, GOLDc, 40, 7, 0);
  const L2 = seg(t, 1.0, 1.8);
  wave(f2 + 150, fy, lerp(f2 + 150, 960, L2), fy, SCREEN_POL, T, L2 > 0.01 ? k : 0, GOLDc, 40 * Math.sqrt(k), 7, 0);
  // the quarter-turn arrow over the lens
  const ra = win(t, B(1) + 0.3, dur - 0.2, 0.3);
  if (ra > 0.01) { g.save(); g.globalAlpha = ra; g.strokeStyle = css(GOLDc); g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.arc(f2, fy, 205, -2.6, -2.6 + 1.57 * Math.max(0.05, rot)); g.stroke(); g.restore(); }
  meterBar(420, 1010, k, seg(t, 0.8, 1.3), (k < 0.03 ? "~" : "") + Math.max(1, Math.round(k * 100)) + "%");
  text("reaches your eye", 600, 1080, 38, QUIET, "center", 700, seg(t, 0.8, 1.3));
  plate("lined up", 540, 470, 54, GOLD, "center", win(t, 0.6, B(1) + 0.4, 0.3), 900);
  plate("crossed", 540, 470, 54, CORAL, "center", seg(t, B(1) + 2.0, B(1) + 2.4), 900);
  MASR(T, t, { ev: [[1.4, "ok", "smile"], [B(1) + 2.2, "!", "grin"]], look, mouth: "o" });
};

// 5 — end: back to the phone behind the lens; the closing line; the last second is frame one (lens upright, screen dark)
SCENES.end = (t, T, B, E, dur) => {
  room(); hand(); phone(T);
  const alpha = 1.0 * (1 - seg(t, 0.3, 1.6));                 // starts tilted (bright), turns upright (dark)
  lens(alpha, T);
  plate("screen still on", 540, 1110, 54, GOLD, "center", win(t, 1.4, dur - 1.15, 0.35), 900);
  MASR(T, t, { ev: [[1.7, "ok", "grin"]], look, mouth: "o" });
};
