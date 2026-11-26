// Episode 42 (long, 1920×1080): why don't you see the hole in your vision?
// Facts (claims.md): Curcio et al. 1990 (J Comp Neurol 292: 497): ≈ 92 M rods, ≈ 4.6 M cones per eye; ≈ 1–1.2 M optic
// nerve fibres; inverted vertebrate retina, fibres exit at the optic disc (no photoreceptors); blind spot ≈ 12–15°
// temporal, ≈ 5.5° wide × 7.5° tall; Moon ≈ 0.52°; Mariotte, 1660s; cephalopod retina everted (no blind spot);
// filling-in (Ramachandran & Gregory 1991; Ramachandran 1992); ~3 saccades/s with saccadic suppression; fovea ≈ 2°.
// Drawings are schematic; the visual-field scene uses 1° = 40 px.

const M = (T, t, ev, o = {}) => MASR(T, t, { x: 190, y: 905, s: 0.36, look: [0.7, -0.4], mouth: "o", ev, ...o });
function roomBG() {
  clear(BG);
  const gr = g.createRadialGradient(1100, 480, 100, 1100, 480, 1200);
  gr.addColorStop(0, "rgb(112,128,196)"); gr.addColorStop(0.65, "rgb(66,86,152)"); gr.addColorStop(1, "rgb(28,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// the test card (light panel, cross left, dot right); dotA lets the dot fade
const CX = 560, DX = 1560, TY = 560;
function card(a = 1, dotA = 1) {
  if (a <= 0.01) return;
  rrect(420, 330, 1300, 460, 40, [242, 245, 251], 0.97 * a);
  g.save(); g.globalAlpha = a; g.strokeStyle = "#1C2440"; g.lineWidth = 18; g.lineCap = "round";
  g.beginPath(); g.moveTo(CX - 50, TY); g.lineTo(CX + 50, TY); g.moveTo(CX, TY - 50); g.lineTo(CX, TY + 50); g.stroke(); g.restore();
  dot(DX, TY, 52, [24, 32, 64], a * dotA);
}
// eye in side view looking left: cornea/lens at left, retina lining the back, optic nerve leaving to the right
function eyeSide(cx, cy, R, a = 1, T = 0, o = {}) {
  if (a <= 0.01) return;
  dot(cx, cy, R, [250, 250, 252], a);
  g.save(); g.globalAlpha = a; g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.arc(cx, cy, R, 0, TAU2); g.stroke(); g.restore();
  dot(cx - R + 30, cy, 80, [90, 150, 210], a); dot(cx - R + 30, cy, 38, [20, 22, 30], a);
  g.save(); g.globalAlpha = a; g.fillStyle = "rgba(220,236,250,0.9)"; g.beginPath(); g.ellipse(cx - R + 80, cy, 30, 70, 0, 0, TAU2); g.fill(); g.restore();
  const g0 = o.gap ?? 0.12;
  for (let i = 0; i < 90; i++) { const an = -1.9 + i * (3.8 / 89); if (o.hole !== false && Math.abs(an - 0.08) < g0) continue; const x1 = cx + (R - 6) * Math.cos(an), y1 = cy + (R - 6) * Math.sin(an), x2 = cx + (R - 34) * Math.cos(an), y2 = cy + (R - 34) * Math.sin(an); line(x1, y1, x2, y2, [214, 120, 146], a, 6); }
  if (o.nerve !== false) { g.save(); g.globalAlpha = a; g.fillStyle = "rgb(236,206,150)"; g.strokeStyle = INK; g.lineWidth = 6; const ny = cy + R * Math.sin(0.08); g.beginPath(); g.moveTo(cx + R - 8, ny - 46); g.lineTo(cx + R + 220, ny - 66); g.lineTo(cx + R + 220, ny + 66); g.lineTo(cx + R - 8, ny + 46); g.closePath(); g.fill(); g.stroke(); g.restore(); }
}
// a strip of retina (light from the top): fibre layer on top, photoreceptors at the bottom facing away; exit hole at hx
function retinaStrip(x, y, w, a, T, hx, everted = 0) {
  if (a <= 0.01) return;
  const recY = everted ? y + 40 : y + 260, fibY = everted ? y + 260 : y + 40;
  rrect(x, y, w, 320, 20, [60, 70, 120], a * 0.6);
  for (let i = 0; i < 40; i++) { const px = x + 20 + i * (w - 40) / 39; if (!everted && Math.abs(px - hx) < 70) continue; rrect(px - 8, recY - 40, 16, 80, 8, i % 5 === 0 ? [120, 200, 150] : [214, 120, 146], a); }
  // fibres: from each receptor up (or down) to the fibre layer, then along to the exit
  for (let i = 0; i < 14; i++) {
    const px = x + 40 + i * (w - 80) / 13; if (!everted && Math.abs(px - hx) < 70) continue;
    const pts = [[px, recY], [px, fibY + i * 3], [hx + (px < hx ? -20 : 20), fibY + i * 3], [hx + (px < hx ? -20 : 20), y + 380]];
    poly(pts, [250, 236, 150], a * 0.9, 4);
    const u = (T * 0.5 + i / 14) % 1; dot(lerp(px, hx, u), fibY + i * 3, 7, GOLDc, a * Math.sin(Math.PI * u));
  }
  if (!everted) { rrect(hx - 60, y + 360, 120, 140, 20, [236, 206, 150], a, INK, 5); }
}
// a stripe field with a hole being filled (k = 0 hole, 1 filled)
function stripes(x, y, w, h, k, a = 1, T = 0, hx = 0.62) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.beginPath(); g.rect(x, y, w, h); g.clip();
  for (let i = -12; i < 40; i++) { g.fillStyle = i % 2 ? "rgb(255,212,94)" : "rgb(120,170,236)"; const xx = x + i * 70 + (T * 20) % 140; g.beginPath(); g.moveTo(xx, y); g.lineTo(xx + 70, y); g.lineTo(xx + 70 - h * 0.5, y + h); g.lineTo(xx - h * 0.5, y + h); g.closePath(); g.fill(); }
  g.restore();
  dot(x + w * hx, y + h * 0.5, 120, [24, 32, 64], a * (1 - k));
}
// one eye's visual field: a soft disc with its blind spot ellipse at side s (+1 right, −1 left)
function field(cx, cy, r, side, col, a, holeA) {
  if (a <= 0.01) return;
  dot(cx, cy, r, col, a * 0.35);
  g.save(); g.globalAlpha = a; g.strokeStyle = css(col); g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, r, 0, TAU2); g.stroke(); g.restore();
  g.save(); g.globalAlpha = a * holeA; g.fillStyle = "#18264F"; g.beginPath(); g.ellipse(cx + side * 0.45 * r, cy, 0.09 * r, 0.12 * r, 0, 0, TAU2); g.fill(); g.restore();
}
function roomPic(a = 1) {
  g.save(); g.globalAlpha = a;   // a simple 'room': window, shelf, plant, lamp
    rrect(360, 160, 520, 380, 20, [170, 214, 246], a, INK, 6);
    rrect(980, 300, 600, 30, 8, [200, 146, 90], a); for (let i = 0; i < 6; i++) rrect(1000 + i * 90, 200, 60, 100, 8, [[255, 138, 122], [140, 198, 255], [255, 212, 94]][i % 3], a);
    rrect(1240, 560, 120, 200, 20, [200, 146, 90], a, INK, 5); dot(1300, 520, 110, [90, 190, 120], a);
    rrect(560, 640, 300, 40, 12, [240, 236, 220], a, INK, 5);
  g.restore();
}
const SCENES = {};

// 1 — hook: frame one = the test card; the instructions; the dot fades out, then the question
SCENES.hook = (t, T, B, E, dur) => {
  roomBG();
  const fade = win(t, B(2) + 0.2, B(3) + 0.5, 0.5);
  card(1, 1 - 0.95 * fade);
  plate("close your LEFT eye", 1070, 240, 52, INK, "center", seg(t, B(0), B(0) + 0.4) * (1 - seg(t, B(3) - 0.3, B(3))), 900);
  plate("stare at the +, move closer", 1070, 880, 46, GOLD, "center", seg(t, B(1), B(1) + 0.4) * (1 - seg(t, B(3) - 0.3, B(3))), 900);
  g.save(); g.globalAlpha = 0.6 * seg(t, B(1), B(1) + 0.4); g.strokeStyle = GOLD; g.lineWidth = 6; g.beginPath(); g.arc(CX, TY, 80 + 8 * Math.sin(T * 4), 0, TAU2); g.stroke(); g.restore();
  plate("a hole in your vision, in each eye", 1070, 880, 50, CORAL, "center", seg(t, B(3), B(3) + 0.4), 900);
  M(T, t, [[B(2) + 0.4, "!"], [B(4), "?"]]);
};

// 2 — retina: the eye in side view, light rays land on the back; an inset of rods and cones with the counts
SCENES.retina = (t, T, B, E, dur) => {
  roomBG();
  const a = seg(t, 0, 0.5);
  eyeSide(900, 520, 340, a, T, { hole: false, nerve: false });
  for (let i = 0; i < 3; i++) { const yy = 420 + i * 100; const u = (T * 0.7 + i / 3) % 1; line(260, yy, lerp(260, 1220, u), lerp(yy, 520 + (i - 1) * 40, u), GOLDc, a * 0.9, 6); }
  plate("retina: a sheet of light sensors", 900, 120, 52, [240, 170, 186], "center", seg(t, 0.8, 1.2), 900);
  const ins = seg(t, B(1), B(1) + 0.5);
  if (ins > 0.01) {
    rrect(1380, 200, 460, 560, 30, PANELc, ins, INK, 5);
    for (let i = 0; i < 9; i++) { const px = 1430 + i * 44; if (i % 3 === 1) { rrect(px - 14, 520, 28, 140, 14, [120, 200, 150], ins); poly([[px - 14, 520], [px + 14, 520], [px, 470]], null, ins, 1, true, [120, 200, 150]); } else rrect(px - 9, 360, 18, 300, 9, [214, 120, 146], ins); }
    text("rods: dim light", 1610, 260, 40, [240, 170, 186], "center", 900, ins); text("cones: colour", 1610, 720, 40, [150, 230, 180], "center", 900, ins);
  }
  plate("≈ 90 million rods · 4.5 million cones", 1100, 950 - 60, 46, GOLD, "center", seg(t, B(2), B(2) + 0.4), 900);
  M(T, t, [[B(2) + 0.4, "!"]]);
};

// 3 — wiring: the retina strip, light from the top; signals run along the front, then dive through one exit hole
SCENES.wiring = (t, T, B, E, dur) => {
  roomBG();
  const a = seg(t, 0, 0.5);
  for (let i = 0; i < 6; i++) arrow(520 + i * 220, 90, 520 + i * 220, 170, GOLDc, a, 7, 20);
  text("light", 400, 130, 44, GOLD, "center", 900, a);
  retinaStrip(420, 200, 1400, a, T * seg(t, B(1), B(1) + 1), 1120);
  plate("sensors face away from the light", 1120, 620, 44, [240, 170, 186], "center", seg(t, B(1), B(1) + 0.4) * (1 - seg(t, B(2) - 0.3, B(2))), 900);
  plate("≈ 1 million fibres → optic nerve", 1120, 820, 46, [236, 206, 150], "center", seg(t, B(2), B(2) + 0.4), 900);
  g.save(); g.globalAlpha = seg(t, B(4), B(4) + 0.4); g.strokeStyle = CORAL; g.lineWidth = 8; g.setLineDash([16, 10]); g.strokeRect(1040, 400, 160, 120); g.restore();
  plate("optic disc: no sensors", 1500, 620, 50, CORAL, "center", seg(t, B(4), B(4) + 0.4), 900);
  M(T, t, [[B(0) + 0.3, "?"], [B(4) + 0.4, "!"]]);
};

// 4 — size: a scene of the visual field (1° = 40 px), fixation cross, blind spot 5.5° × 7.5° at 15°; ten Moons; Mariotte
SCENES.size = (t, T, B, E, dur) => {
  roomBG();
  const fx = 600, fy = 520, D = 40;
  rrect(260, 160, 1600, 720, 30, [190, 210, 240], 1);
  for (let i = 0; i < 9; i++) line(260, 200 + i * 80, 1860, 200 + i * 80, [160, 184, 226], 1, 2);
  g.save(); g.strokeStyle = "#1C2440"; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.moveTo(fx - 36, fy); g.lineTo(fx + 36, fy); g.moveTo(fx, fy - 36); g.lineTo(fx, fy + 36); g.stroke(); g.restore();
  const bx = fx + 14 * D, a1 = seg(t, B(1), B(1) + 0.5);
  if (a1 > 0.01) { arrow(fx + 50, fy + 260, bx - 10, fy + 260, INKc, a1, 5, 18); text("12–15°", (fx + bx) / 2, fy + 220, 44, "#1C2440", "center", 900, a1); }
  const a2 = seg(t, B(2), B(2) + 0.6);
  g.save(); g.globalAlpha = a2; g.fillStyle = "rgba(24,32,64,0.92)"; g.beginPath(); g.ellipse(bx, fy, 5.5 * D / 2, 7.5 * D / 2, 0, 0, TAU2); g.fill(); g.restore();
  text("5.5° × 7.5°", bx + 200, fy - 120, 44, "#1C2440", "left", 900, a2);
  const a3 = seg(t, B(3), B(3) + 0.5);
  for (let i = 0; i < 10; i++) dot(bx - 5 * D / 2 + 0.52 * D / 2 + i * 0.52 * D * 0.96, fy, 0.52 * D / 2, [244, 240, 220], a3 * seg(t, B(3) + i * 0.08, B(3) + i * 0.08 + 0.2));
  plate("≥ 10 full Moons wide", bx + 330, fy + 120, 46, GOLD, "center", a3, 900);
  plate("first described: Edme Mariotte, 1660s", 1060, 960 - 70, 46, INK, "center", seg(t, B(4), B(4) + 0.4), 900);
  M(T, t, [[B(3) + 0.6, "!", "grin"]]);
};

// 5 — octopus: two retina strips side by side: ours (fibres in front, hole) vs octopus (fibres behind, no hole)
SCENES.octopus = (t, T, B, E, dur) => {
  roomBG();
  const a = seg(t, 0, 0.5), b = seg(t, B(1), B(1) + 0.6);
  retinaStrip(320, 260, 700, a, T, 670, 0);
  retinaStrip(1120, 260, 700, b, T, 1470, 1);
  text("human", 670, 210, 50, INK, "center", 900, a); text("octopus", 1470, 210, 50, INK, "center", 900, b);
  // a little octopus
  if (b > 0.01) { g.save(); g.globalAlpha = b; g.fillStyle = "rgb(236,130,140)"; g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.ellipse(1790, 150, 60, 50, 0, 0, TAU2); g.fill(); g.stroke(); for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(1750 + i * 20, 190); g.quadraticCurveTo(1740 + i * 22 + 10 * Math.sin(T * 3 + i), 240, 1756 + i * 20, 270); g.stroke(); } g.restore(); }
  plate("hole", 670, 820, 48, CORAL, "center", a, 900);
  plate("no blind spot", 1470, 820, 48, GOLD, "center", seg(t, B(2), B(2) + 0.4), 900);
  plate("a side effect of how our eye developed", 1070, 940 - 60, 42, INK, "center", seg(t, B(3), B(3) + 0.4), 800);
  M(T, t, [[B(2) + 0.4, "!"]]);
};

// 6 — two: two overlapping fields (left eye, right eye); each hole is covered by the other eye; then the striped fill-in
SCENES.two = (t, T, B, E, dur) => {
  roomBG();
  const k = seg(t, B(3) - 0.3, B(3) + 0.3);
  const a = seg(t, B(1), B(1) + 0.5) * (1 - k);
  const cover = seg(t, B(2) + 0.8, B(2) + 1.8);
  field(900, 520, 380, -1, BLUEc, a, 1 - cover); field(1300, 520, 380, 1, GOLDc, a, 1 - cover);
  text("left eye", 760, 100, 44, BLUE, "center", 900, a); text("right eye", 1440, 100, 44, GOLD, "center", 900, a);
  plate("each hole is covered by the other eye", 1100, 960 - 60, 46, INK, "center", seg(t, B(2) + 1.2, B(2) + 1.6) * (1 - k), 900);
  stripes(440, 200, 1360, 640, eio(seg(t, B(4), B(4) + 2.4)), k, T);
  plate("the brain fills the gap", 1120, 960 - 60, 50, GOLD, "center", seg(t, B(4) + 1.0, B(4) + 1.4), 900);
  M(T, t, [[B(0) + 0.3, "?"], [B(2) + 1.4, "ok"], [B(4) + 1.2, "idea"]]);
};

// 7 — ram: a line with a gap; the gap sits inside the blind-spot ellipse; the line is seen as unbroken
SCENES.ram = (t, T, B, E, dur) => {
  roomBG();
  rrect(300, 200, 1560, 620, 30, [190, 210, 240], 1);
  const ex = 1300, ey = 510, a = seg(t, 0.3, 0.8), gap = 1 - eio(seg(t, B(2) + 0.2, B(2) + 1.4));
  line(420, ey, ex - 70 * gap - 2, ey, [24, 32, 64], a, 16); line(ex + 70 * gap + 2, ey, 1760, ey, [24, 32, 64], a, 16);
  g.save(); g.globalAlpha = a * 0.5; g.strokeStyle = CORAL; g.lineWidth = 6; g.setLineDash([16, 12]); g.beginPath(); g.ellipse(ex, ey, 110, 150, 0, 0, TAU2); g.stroke(); g.restore();
  text("blind spot", ex, ey - 190, 44, CORAL, "center", 900, a);
  plate("what you see: one unbroken line", 1080, 940 - 60, 48, GOLD, "center", seg(t, B(2) + 1.0, B(2) + 1.4), 900);
  plate("V. S. Ramachandran", 1080, 140, 48, INK, "center", seg(t, 0.2, 0.6), 900);
  M(T, t, [[B(2) + 1.2, "!", "grin"]]);
};

// 8 — fovea: a room view; only a small circle in the middle is sharp and coloured; the rest is blurred and grey
SCENES.fovea = (t, T, B, E, dur) => {
  roomBG();
  roomPic();
  const k = seg(t, B(1), B(1) + 0.8), fx = 1060 + 220 * Math.sin(T * 0.8) * seg(t, B(4), B(4) + 0.5), fy = 480 + 120 * Math.cos(T * 1.1) * seg(t, B(4), B(4) + 0.5);
  // blur everything outside the fovea: draw a grey veil with a clear hole
  if (k > 0.01) { g.save(); g.globalAlpha = 0.75 * k * (1 - seg(t, B(4) + 1.6, B(4) + 3)); g.fillStyle = "rgb(110,118,140)"; g.beginPath(); g.rect(0, 0, W, H); g.arc(fx, fy, 90, 0, TAU2, true); g.fill("evenodd"); g.restore(); g.save(); g.globalAlpha = k; g.strokeStyle = GOLD; g.lineWidth = 6; g.beginPath(); g.arc(fx, fy, 90, 0, TAU2); g.stroke(); g.restore(); }
  plate("fovea: ≈ 2° of sharp vision", 1100, 120, 50, GOLD, "center", seg(t, B(2), B(2) + 0.4) * (1 - seg(t, B(4) - 0.3, B(4))), 900);
  plate("≈ your thumbnail at arm's length", 1100, 940 - 60, 44, INK, "center", seg(t, B(2) + 1.0, B(2) + 1.4) * (1 - seg(t, B(3) - 0.3, B(3))), 900);
  plate("blurry, poorer at colour", 1100, 940 - 60, 46, QUIET, "center", seg(t, B(3), B(3) + 0.4) * (1 - seg(t, B(4) - 0.3, B(4))), 900);
  plate("eyes jump, brain stitches", 1100, 120, 50, GOLD, "center", seg(t, B(4) + 0.6, B(4) + 1.0), 900);
  M(T, t, [[B(0) + 0.3, "!"], [B(4) + 1.6, "idea"]]);
};

// 9 — guess: a gaze dot jumps ~3×/s across a picture; a camera frame vs the brain's guess
SCENES.guess = (t, T, B, E, dur) => {
  roomBG();
  const a = seg(t, 0, 0.5) * (1 - seg(t, B(3) - 0.3, B(3)));
  rrect(300, 120, 1560, 760, 30, [190, 210, 240], a); roomPic(a);
  const j = Math.floor(T * 3), px = 520 + hash(j, 1) * 1200, py = 260 + hash(j, 2) * 500, pv = 520 + hash(j - 1, 1) * 1200, pw = 260 + hash(j - 1, 2) * 500, u = clamp((T * 3 - j) / 0.15);
  { const gx = lerp(pv, px, eout(u)), gy = lerp(pw, py, eout(u)), ga = a * seg(t, B(1), B(1) + 0.3); dot(gx, gy, 22, CORALc, ga); g.save(); g.globalAlpha = ga; g.strokeStyle = CORAL; g.lineWidth = 6; g.beginPath(); g.arc(gx, gy, 70, 0, TAU2); g.stroke(); g.restore(); }
  plate("≈ 3 jumps a second, the blur hidden", 1120, 940 - 60, 46, INK, "center", seg(t, B(1), B(1) + 0.4) * (1 - seg(t, B(2) - 0.3, B(2))), 900);
  plate("touch predicted before it lands", 1120, 940 - 60, 46, INK, "center", seg(t, B(2), B(2) + 0.4) * (1 - seg(t, B(3) - 0.3, B(3))), 900);
  const b = seg(t, B(3), B(3) + 0.5);
  if (b > 0.01) {
    rrect(440, 260, 560, 420, 20, [60, 70, 110], b, INK, 5); for (let i = 0; i < 30; i++) dot(470 + hash(i, 3) * 500, 290 + hash(i, 4) * 360, 10, [150, 160, 190], b);
    dot(800, 470, 70, [24, 32, 64], b); text("raw input: gaps, blur", 720, 220, 42, QUIET, "center", 900, b);
    arrow(1040, 470, 1180, 470, GOLDc, b, 8, 24);
    rrect(1220, 260, 560, 420, 20, [190, 210, 240], b, INK, 5); for (let i = 0; i < 6; i++) rrect(1250 + i * 85, 300, 60, 340, 10, [[255, 138, 122], [140, 198, 255], [255, 212, 94]][i % 3], b);
    text("what you see: best guess", 1500, 220, 42, GOLD, "center", 900, b);
  }
  M(T, t, [[B(1) + 0.4, "!"], [B(4), "idea", "grin"]]);
};

// 10 — payoff: back to the test card (frame one), then the end card on the right
SCENES.payoff = (t, T, B, E, dur) => {
  roomBG();
  const endK = seg(t, B(3) + 0.4, B(3) + 1.4);
  g.save(); g.translate(-500 * endK, 0); card(1 - 0.85 * endK, 1); g.restore();
  plate("the hole was always there", 1070, 240, 52, GOLD, "center", seg(t, 0.2, 0.6) * (1 - endK), 900);
  plate("at what distance did the dot vanish?", 1070, 880, 46, INK, "center", seg(t, B(2), B(2) + 0.4) * (1 - endK), 900);
  M(T, t, [[B(0) + 0.4, "ok"], [B(3) + 0.6, "?", "grin"]]);
};
