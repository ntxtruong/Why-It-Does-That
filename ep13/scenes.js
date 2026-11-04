// Episode 13 (Short, 1080×1920) — Why does the Moon look huge on the horizon?
// A night skyline. The Moon's true angular size is the same high or low (a pebble at arm's length covers both);
// the "huge" horizon Moon is drawn as what it feels like, then shrinks to its true size under the pebble.
// Diagrams (not to scale, labelled): Earth + observer for "a little farther"; the flattened sky dome for the
// apparent-distance idea (same angle × felt-farther distance → felt bigger). Pure functions of time.
// Safe zone (Shorts UI): key content above y = 1536 and left of x = 940.

const MAS = (T, o = {}) => mascot3(o.x ?? 150, o.y ?? 1560, o.s ?? 0.4, T, o);
const MOONc = [236, 232, 214], PEBc = [128, 136, 158], SKY = 1180;   // skyline base
const HM = { x: 640, y: 1070 }, ZM = { x: 470, y: 560 }, TRUE_R = 62, FEEL_R = 150;

function sky(t, a = 1) {
  const gr = g.createLinearGradient(0, 0, 0, SKY); gr.addColorStop(0, css(BGc)); gr.addColorStop(1, css([44, 62, 116]));
  g.globalAlpha = a; g.fillStyle = gr; g.fillRect(0, 0, W, SKY);
  for (let i = 0; i < 70; i++) dot(hash(i, 1) * W, hash(i, 2) * (SKY - 120), 1.5 + 2 * hash(i, 3), INKc, a * (0.35 + 0.4 * hash(i, 4)) * (0.8 + 0.2 * Math.sin(t * (1 + hash(i, 5)) + i)));
  g.globalAlpha = 1;
}
function skyline(a = 1) {
  g.save(); g.globalAlpha = a; g.fillStyle = css(PANELc);
  const B = [[0, 120], [90, 210], [170, 150], [250, 260], [330, 180], [420, 90], [470, 130], [560, 70], [760, 110], [820, 230], [900, 160], [980, 280]];
  g.beginPath(); g.moveTo(0, H); B.forEach(([x, h], i) => { const x1 = i + 1 < B.length ? B[i + 1][0] : W; g.lineTo(x, SKY - h); g.lineTo(x1, SKY - h); }); g.lineTo(W, H); g.closePath(); g.fill();
  // trees: round tops between the buildings
  [[520, 60], [610, 74], [690, 58]].forEach(([x, r]) => { g.beginPath(); g.arc(x, SKY - 70, r, 0, TAU2); g.fill(); });
  g.fillStyle = css([28, 44, 90]); g.fillRect(0, SKY, W, H - SKY);
  // lit windows
  for (let i = 0; i < 40; i++) { const x = 20 + hash(i, 7) * 1040, y = SKY - 20 - hash(i, 8) * 200; if (y > SKY - 30) continue; rrect(x, y, 14, 18, 2, GOLDc, a * 0.5 * (hash(i, 9) > 0.5 ? 1 : 0)); }
  g.restore();
}
function moon(x, y, r, a = 1, warm = 0) {
  if (a <= 0.01) return; const c = mix(MOONc, [255, 214, 160], warm);
  g.save(); g.globalAlpha = a; g.fillStyle = css(c); g.beginPath(); g.arc(x, y, r, 0, TAU2); g.fill();
  g.fillStyle = css([200, 196, 180], 0.55); [[-0.3, -0.2, 0.22], [0.25, 0.1, 0.16], [-0.05, 0.35, 0.12], [0.35, -0.35, 0.1]].forEach(([u, v, s]) => { g.beginPath(); g.arc(x + u * r, y + v * r, s * r, 0, TAU2); g.fill(); });
  g.restore();
}
// the pebble held at arm's length over (x, y): a hand below it and the arm back to the character
function pebble(x, y, a = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.lineCap = "round";
  g.strokeStyle = css([34, 39, 58]); g.lineWidth = 46; g.beginPath(); g.moveTo(230, 1330); g.quadraticCurveTo((x + 230) / 2, y + 220, x - 10, y + 70); g.stroke();
  g.fillStyle = "#f6e3d3"; g.beginPath(); g.ellipse(x - 6, y + 62, 34, 26, -0.4, 0, TAU2); g.fill();
  g.restore();
  g.save(); g.globalAlpha = a; g.fillStyle = css(PEBc); g.beginPath(); g.ellipse(x, y, TRUE_R + 4, TRUE_R + 2, 0.2, 0, TAU2); g.fill();
  g.strokeStyle = css(INKc, 0.7); g.lineWidth = 3; g.stroke(); g.restore();
}
const SCENES = {};

// 1 — hook: first frame = a huge-looking Moon on the skyline; the pebble covers it, then the high Moon too
SCENES.hook = (t, T, B, E, dur) => {
  clear(); sky(t);
  const shrink = seg(t, B(1) + 1.8, B(1) + 2.6);
  const r = lerp(FEEL_R, TRUE_R, shrink), rise = seg(t, B(1) + 3.2, B(1) + 4.4);
  moon(HM.x, SKY - 150 - r * 0.7 + 0, r, 1 - rise * 0.0, 0.6 * (1 - shrink));
  moon(ZM.x, ZM.y, TRUE_R, rise);
  skyline();
  // the pebble: comes up over the horizon Moon, then moves to the high Moon
  const p1 = seg(t, B(1) + 0.8, B(1) + 1.6), hmY = SKY - 150 - TRUE_R * 0.7;
  const px = lerp(HM.x, ZM.x, rise), py = lerp(hmY, ZM.y, rise);
  pebble(lerp(px - 260, px, p1), lerp(py + 260, py, p1), p1 * (1 - seg(t, dur - 0.6, dur)));
  if (shrink > 0.01) { g.save(); g.globalAlpha = (1 - shrink) * 0.8; g.strokeStyle = css(CORALc); g.lineWidth = 4; g.setLineDash([12, 10]); g.beginPath(); g.arc(HM.x, hmY, FEEL_R, 0, TAU2); g.stroke(); g.restore(); }
  plate("it isn't bigger", 540, 480, 54, INK, "center", win(t, B(1), B(1) + 1.2, 0.3), 800);
  plate("a pebble at arm's length", 540, 480, 48, INK, "center", win(t, B(1) + 1.2, B(1) + 2.1, 0.3), 800);
  plate("same pebble covers it · low", 540, 480, 46, GOLD, "center", win(t, B(1) + 2.2, B(1) + 3.3, 0.3), 800);
  plate("· and high", 760, 680, 46, GOLD, "center", seg(t, B(1) + 4.2, B(1) + 4.6), 800);
  MAS(T, { look: [0.8, -0.7], mouth: t < B(1) ? "o" : "smile" });
};

// 2 — measure: about half a degree, high or low; at the horizon it is slightly farther (diagram, not to scale)
SCENES.measure = (t, T, B, E, dur) => {
  clear(); sky(t);
  const hmY = SKY - 150 - TRUE_R * 0.7, dg = seg(t, B(1) - 0.3, B(1) + 0.5);
  moon(HM.x, hmY, TRUE_R, 1 - dg); moon(ZM.x, ZM.y, TRUE_R, 1 - dg);
  skyline(1 - dg * 0.6);
  // angle wedges from the eye to both Moons
  const eye = [200, 1260], wa = seg(t, 0.4, 1.2) * (1 - dg);
  [[HM.x, hmY], [ZM.x, ZM.y]].forEach(([x, y]) => { const an = Math.atan2(y - eye[1], x - eye[0]), d = Math.hypot(x - eye[0], y - eye[1]), da = Math.asin(TRUE_R / d);
    [an - da, an + da].forEach(b => line(eye[0], eye[1], eye[0] + d * Math.cos(b), eye[1] + d * Math.sin(b), GOLDc, wa * 0.9, 3)); });
  plate("≈ 0.5° · low", HM.x + 40, hmY - 120, 46, GOLD, "center", wa * seg(t, 1.0, 1.4), 800);
  plate("≈ 0.5° · high", ZM.x + 230, ZM.y, 46, GOLD, "center", wa * seg(t, 1.6, 2.0), 800);
  // Earth + observer: the horizon Moon is about one Earth radius farther away
  if (dg > 0.01) {
    const C = [330, 900], R = 120, O = [C[0], C[1] - R], D = 430, M1 = [C[0], C[1] - D], M2 = [C[0] + Math.sqrt(D * D - R * R), O[1]];
    rrect(80, 380, 860, 760, 30, PANELc, dg * 0.85);
    g.save(); g.globalAlpha = dg; g.fillStyle = css([70, 110, 180]); g.beginPath(); g.arc(C[0], C[1], R, 0, TAU2); g.fill();
    g.strokeStyle = css(QUIETc, 0.5); g.lineWidth = 3; g.setLineDash([6, 10]); g.beginPath(); g.arc(C[0], C[1], D, -Math.PI / 2 - 0.15, 0.08); g.stroke(); g.restore();
    dot(O[0], O[1], 10, GOLDc, dg); moon(M1[0], M1[1], 34, dg); moon(M2[0], M2[1], 34, dg);
    const l1 = seg(t, B(1) + 0.6, B(1) + 1.4), l2 = seg(t, B(1) + 1.4, B(1) + 2.2);
    line(O[0], O[1], M1[0], M1[1] + 34, BLUEc, dg * l1, 5); line(O[0], O[1], M2[0] - 34, M2[1], CORALc, dg * l2, 5);
    text("overhead", M1[0] + 50, M1[1], 40, BLUE, "left", 700, dg * l1);
    text("horizon: +1 Earth radius", M2[0] - 10, M2[1] + 70, 38, CORAL, "center", 700, dg * l2);
    text("≈ 1.5% farther → a touch smaller", 510, 1080, 44, INK, "center", 800, dg * seg(t, B(1) + 2.6, B(1) + 3.0));
    text("not to scale", 900, 420, 32, QUIET, "right", 600, dg);
  }
  MAS(T, { look: [0.8, -0.6], mouth: "o" });
};

// 3 — brain: the sky feels like a flattened dome; same angle + felt farther → felt bigger (one leading idea)
SCENES.brain = (t, T, B, E, dur) => {
  clear(); sky(t, 0.6);
  const O = [540, 1180], A = 440, Bv = 220, dm = seg(t, B(1), B(1) + 1.2);
  rrect(0, SKY, W, H - SKY, 0, [28, 44, 90], 1); line(0, SKY, W, SKY, QUIETc, 0.6, 3);
  plate("in your brain", 540, 520, 60, INK, "center", win(t, 0.2, B(1) + 0.6, 0.3), 800);
  // the dome (felt sky): an arc, wider than tall
  if (dm > 0.01) { g.save(); g.globalAlpha = dm; g.strokeStyle = css(BLUEc); g.lineWidth = 6; g.setLineDash([18, 12]); g.beginPath(); g.ellipse(O[0], O[1], A, Bv * 1.2, 0, Math.PI, Math.PI + Math.PI * seg(t, B(1), B(1) + 1.2)); g.stroke(); g.restore(); }
  dot(O[0], O[1] - 10, 12, GOLDc, 1);
  const lb = seg(t, B(1) + 3.0, B(1) + 3.5);
  plate("overhead: feels near", 540, O[1] - Bv * 1.2 - 70, 42, BLUE, "center", lb * (1 - seg(t, B(2) + 4, B(2) + 4.5)), 800);
  plate("horizon: feels far", 300, 1250, 42, CORAL, "center", seg(t, B(1) + 4.2, B(1) + 4.7) * (1 - seg(t, B(2) + 4, B(2) + 4.5)), 800);
  // same angle wedge (exaggerated, ~12°) to the overhead and the horizon point of the dome
  const wg = seg(t, B(2), B(2) + 0.8), half = 9 * Math.PI / 180;
  [[-Math.PI / 2, Bv * 1.2, BLUEc], [-Math.PI + 0.2, A * 0.98, CORALc]].forEach(([an, dist, col], k) => {
    const a = wg * (k ? seg(t, B(2) + 1.2, B(2) + 2.0) : 1), r = dist * Math.tan(half);
    line(O[0], O[1] - 10, O[0] + dist * Math.cos(an - half), O[1] - 10 + dist * Math.sin(an - half), GOLDc, a * 0.9, 3);
    line(O[0], O[1] - 10, O[0] + dist * Math.cos(an + half), O[1] - 10 + dist * Math.sin(an + half), GOLDc, a * 0.9, 3);
    moon(O[0] + dist * Math.cos(an), O[1] - 10 + dist * Math.sin(an), r * lerp(1, 1.0, 0), a, k ? 0.5 : 0);
  });
  plate("same angle · farther → bigger", 540, 520, 50, GOLD, "center", seg(t, B(2) + 2.6, B(2) + 3.1), 800);
  plate("one leading idea", 540, 610, 40, QUIET, "center", seg(t, B(1) + 0.4, B(1) + 0.9), 700);
  MAS(T, { look: [0.8, -0.7], mouth: t > B(2) + 3 ? "grin" : "o" });
};

// 4 — end: still debated; the pebble stays the same; the pebble lowers and the Moon looks huge again (loop)
SCENES.end = (t, T, B, E, dur) => {
  clear(); sky(t);
  const hmY = SKY - 150 - TRUE_R * 0.7, away = seg(t, B(1) + 1.2, dur - 0.4), r = lerp(TRUE_R, FEEL_R, away);
  moon(HM.x, SKY - 150 - r * 0.7, r, 1, 0.6 * away);
  skyline();
  pebble(HM.x - 260 * away, hmY + 260 * away, 1 - away);
  plate("still debated", 540, 480, 54, INK, "center", win(t, 0.3, B(1), 0.3), 800);
  plate("the pebble: the same", 540, 480, 50, GOLD, "center", win(t, B(1), B(1) + 1.6, 0.3), 800);
  MAS(T, { look: [0.8, -0.7], mouth: "smile" });
};
