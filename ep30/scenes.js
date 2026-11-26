// Episode 30 (Short v3, 1080×1920): there's no blue pigment in blue eyes.
// Facts (sources.md; American Academy of Ophthalmology; Sturm & Larsson 2009): the iris has a back layer (pigment
// epithelium) that is dark brown in almost everyone, and a front layer (stroma) of fine fibres. Brown eyes have a lot of
// melanin in the stroma; blue eyes have very little. Light entering a pale stroma is scattered by the fibres, short
// (blue) wavelengths far more than long ones, so blue comes back out; the rest passes through and is absorbed by the
// dark back layer. A little melanin in the stroma makes the eye look green or hazel; more makes it brown.
// The iris colours below are an illustration of that order (blue → green → hazel → brown), not measured spectra.

const IR = [[0, [70, 136, 214]], [0.35, [92, 150, 98]], [0.65, [150, 118, 58]], [1, [96, 56, 30]]];
function irisCol(m) { for (let i = 1; i < IR.length; i++) if (m <= IR[i][0]) { const u = (m - IR[i - 1][0]) / (IR[i][0] - IR[i - 1][0]); return mix(IR[i - 1][1], IR[i][1], u); } return IR[IR.length - 1][1]; }
function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 780, 80, 540, 780, 950);
  gr.addColorStop(0, "rgb(96,124,190)"); gr.addColorStop(0.62, "rgb(60,86,150)"); gr.addColorStop(1, "rgb(24,38,79)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// a big eye, front view: almond sclera, iris with radial fibres (colour from melanin m), pupil, highlight
function eye(cx, cy, s, m, T, a = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s);
  g.fillStyle = "#F3D9C4"; g.beginPath(); g.ellipse(0, 0, 520, 330, 0, 0, TAU2); g.fill();
  const alm = () => { g.beginPath(); g.moveTo(-440, 0); g.quadraticCurveTo(0, -330, 440, 0); g.quadraticCurveTo(0, 300, -440, 0); g.closePath(); };
  alm(); g.fillStyle = "#FBFBFD"; g.fill();
  g.save(); alm(); g.clip();
  const c = irisCol(m), ir = 210;
  const gr = g.createRadialGradient(0, 0, 60, 0, 0, ir); gr.addColorStop(0, css(mix(c, [40, 30, 20], 0.35))); gr.addColorStop(0.55, css(c)); gr.addColorStop(1, css(mix(c, [20, 24, 40], 0.45)));
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, ir, 0, TAU2); g.fill();
  g.lineWidth = 3; for (let i = 0; i < 90; i++) { const an = i / 90 * TAU2 + 0.03 * Math.sin(i * 7.3), r0 = 80 + 10 * hash(i, 2), r1 = ir - 8 - 20 * hash(i, 3); g.strokeStyle = css(mix(c, [255, 255, 255], 0.25 + 0.2 * hash(i, 1)), 0.55); g.beginPath(); g.moveTo(r0 * Math.cos(an), r0 * Math.sin(an)); g.lineTo(r1 * Math.cos(an + 0.04), r1 * Math.sin(an + 0.04)); g.stroke(); }
  g.strokeStyle = css(mix(c, [20, 24, 40], 0.6)); g.lineWidth = 10; g.beginPath(); g.arc(0, 0, ir - 4, 0, TAU2); g.stroke();
  const pr = 78 + 4 * Math.sin(T * 1.3); g.fillStyle = "#0E0E12"; g.beginPath(); g.arc(0, 0, pr, 0, TAU2); g.fill();
  g.fillStyle = "rgba(255,255,255,0.92)"; g.beginPath(); g.ellipse(-70, -80, 40, 28, -0.5, 0, TAU2); g.fill();
  g.restore();
  g.strokeStyle = "#3a2a20"; g.lineWidth = 14; g.lineCap = "round"; g.beginPath(); g.moveTo(-440, 0); g.quadraticCurveTo(0, -330, 440, 0); g.stroke();
  for (let i = 0; i < 9; i++) { const u = 0.15 + i * 0.087, x = lerp(-440, 440, u), y = -330 * 2 * u * (1 - u) * 1.0; g.beginPath(); g.moveTo(x, y); g.lineTo(x + (u - 0.5) * 50, y - 50); g.stroke(); }
  g.restore();
}
// the iris in cross-section: front layer (stroma: pale fibres, melanin granules ~ m) above a dark back layer
const SX0 = 140, SX1 = 1000, STOP = 560, SBOT = 860, BBOT = 960;
function section(m, a = 1, T = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  rrect(SX0, STOP, SX1 - SX0, SBOT - STOP, 26, [205, 222, 238], 0.9);
  for (let i = 0; i < 26; i++) { const y = STOP + 20 + i * 11.5; g.strokeStyle = "rgba(150,175,205,0.75)"; g.lineWidth = 3; g.beginPath(); for (let x = SX0 + 20; x <= SX1 - 20; x += 20) { const yy = y + 6 * Math.sin(x * 0.02 + i * 1.7); x === SX0 + 20 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
  const n = Math.round(160 * m); for (let i = 0; i < n; i++) dot(SX0 + 30 + hash(i, 5) * (SX1 - SX0 - 60), STOP + 20 + hash(i, 6) * (SBOT - STOP - 40), 7, [110, 64, 30], 0.95);
  rrect(SX0, SBOT, SX1 - SX0, BBOT - SBOT, 18, [70, 40, 26], 1);
  g.restore();
  plate("front layer", SX1 - 170, STOP - 44, 44, INK, "center", a, 900);
  plate("back layer: dark brown", 640, BBOT + 50, 44, [230, 180, 140], "center", a, 900);
}
// light rays (dots moving along paths): white light from the top left; blue turns back up, red and green go on and stop
function rays(T, a, phase) {
  if (a <= 0.01) return;
  const RAYS = [[[255, 120, 110], 0], [[130, 230, 140], 1], [[120, 170, 255], 2]];
  RAYS.forEach(([col, k]) => {
    const x0 = 230 + k * 60, y0 = 300, xe = x0 + 230, ye = STOP + 120 + k * 20;   // in through the top of the stroma
    const blue = k === 2, bx = xe, by = ye, ox = bx + 420, oy = 300;               // blue: scattered back out to the upper right
    const xs = blue ? bx : x0 + 360, ys = blue ? by : SBOT + 10;                     // red/green: on to the back layer
    line(x0, y0, xe, ye, col, a * 0.5, 6);
    if (blue) line(bx, by, ox, oy, col, a * phase, 7); else line(xe, ye, xs, ys, col, a * 0.5, 6);
    for (let j = 0; j < 4; j++) {
      const u = ((T * 0.7 + j / 4 + k * 0.13) % 1);
      if (u < 0.5) { const v = u / 0.5; dot(lerp(x0, xe, v), lerp(y0, ye, v), 11, col, a); }
      else if (blue) { const v = (u - 0.5) / 0.5; dot(lerp(bx, ox, v), lerp(by, oy, v), 12, col, a * phase); }
      else { const v = (u - 0.5) / 0.5; dot(lerp(xe, xs, v), lerp(ye, ys, v), 11, col, a * (1 - v)); }
    }
  });
  soft(SX0 + 470, SBOT + 20, 120, [255, 120, 80], 0.25 * a);
}
const look = [0.6, -0.6];
const SCENES = {};
const EY = 830;

// 1 — hook: frame one = a big blue eye; a scan finds no blue pigment
SCENES.hook = (t, T, B, E, dur) => {
  room();
  eye(540, EY, 0.95, 0, T);
  const sx = lerp(400, 680, 0.5 + 0.5 * Math.sin(T * 1.6));
  g.save(); g.strokeStyle = "rgba(242,245,251,0.95)"; g.lineWidth = 10; g.beginPath(); g.arc(sx, EY - 20, 76, 0, TAU2); g.stroke(); g.lineWidth = 16; g.lineCap = "round"; g.beginPath(); g.moveTo(sx + 58, EY + 38); g.lineTo(sx + 120, EY + 100); g.stroke(); g.restore();
  plate("blue pigment: 0", 640, 1180, 54, GOLD, "center", seg(t, 0.8, 1.2), 900);
  MASR(T, t, { ev: [[0.5, "!"]], look, mouth: "o" });
};

// 2 — pigment: one brown pigment, melanin; then the iris in cross-section: almost none in the front layer
SCENES.pigment = (t, T, B, E, dur) => {
  room();
  const k = seg(t, B(1) - 0.1, B(1) + 0.35), ko = seg(t, B(1) - 0.45, B(1) - 0.1);
  eye(540, EY, 0.95, 0, T, 1 - ko);
  const ga = seg(t, 0.3, 0.8) * (1 - ko);
  for (let i = 0; i < 14; i++) { const an = i / 14 * TAU2 + T * 0.4, r = 300 + 30 * Math.sin(T * 2 + i); dot(540 + r * Math.cos(an), EY + r * 0.62 * Math.sin(an), 16, [110, 64, 30], ga); }
  plate("melanin: brown", 640, 1180, 54, [230, 180, 140], "center", ga, 900);
  section(0.04, k, T);
  plate("almost no melanin", 640, 1180, 50, GOLD, "center", seg(t, B(1) + 1.0, B(1) + 1.5), 900);
  MASR(T, t, { ev: [[0.8, "idea"], [B(1) + 1.2, "!"]], look, mouth: "o" });
};

// 3 — scatter: white light enters; the fibres send blue back out; red and green reach the dark back layer and are absorbed
SCENES.scatter = (t, T, B, E, dur) => {
  room();
  section(0.04, 1, T);
  rays(T, seg(t, 0.2, 0.7), seg(t, 1.6, 2.2));
  plate("blue scatters back", 790, 380, 48, BLUE, "center", seg(t, 1.8, 2.3), 900);
  plate("the rest is absorbed", 640, 1180, 48, CORAL, "center", seg(t, B(1) + 0.2, B(1) + 0.7), 900);
  MASR(T, t, { ev: [[2.0, "!"], [B(1) + 0.5, "idea", "smile"]], look, mouth: "o" });
};

// 4 — more: back to the front view; a melanin slider runs up and the eye goes blue → green → brown
SCENES.more = (t, T, B, E, dur) => {
  room();
  const m = lerp(0, 0.35, eio(seg(t, 0.3, 1.2))) + 0.65 * eio(seg(t, 2.8, 3.8));
  eye(540, EY - 40, 0.92, m, T);
  const x0 = 380, x1 = 980, y = 1160;
  rrect(x0, y - 14, x1 - x0, 28, 14, [24, 34, 70], 1);
  const gr = g.createLinearGradient(x0, 0, x1, 0); gr.addColorStop(0, css(irisCol(0))); gr.addColorStop(0.35, css(irisCol(0.35))); gr.addColorStop(0.65, css(irisCol(0.65))); gr.addColorStop(1, css(irisCol(1)));
  g.fillStyle = gr; g.beginPath(); g.roundRect(x0, y - 14, (x1 - x0) * m + 1, 28, 14); g.fill();
  dot(lerp(x0, x1, m), y, 26, INKc, 1);
  text("melanin in the front layer", 680, y - 60, 42, QUIET, "center", 700);
  plate(m < 0.2 ? "blue" : m < 0.5 ? "green" : m < 0.8 ? "hazel" : "brown", 680, y + 80, 50, irisCol(Math.max(m, 0.15)).map(v => Math.min(255, v * 1.5)), "center", 1, 900);
  MASR(T, t, { ev: [[1.4, "!"], [3.4, "!", "grin"]], look, mouth: "o" });
};

// 5 — end: the blue eye of frame one, with the sky's colour beside it
SCENES.end = (t, T, B, E, dur) => {
  room();
  eye(540, EY, 0.95, 0, T);
  plate("same physics as a blue sky", 640, 1180, 50, BLUE, "center", win(t, 0.3, dur - 1.15, 0.3), 900);
  MASR(T, t, { ev: [[0.6, "ok", "grin"]], look, mouth: "o" });
};
