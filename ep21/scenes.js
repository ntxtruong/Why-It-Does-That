// Episode 21 (new Short, 1080×1920) — Why does a cold can "sweat"?
// Numbers (Magnus formula, computed): air at 32 °C and 75 % humidity carries ≈25 g of water vapour per m³ (dew point ≈27 °C);
// at 4 °C no more than ≈6.4 g/m³ can stay vapour. The air touching the can cools toward the can's temperature, so the
// excess condenses on the metal. Droplet radii grow as √t from fixed hashed nucleation sites; vapour molecules move on
// closed-form paths. Shorts v2 layout: subject 380–1250 px, burned-in captions 1330–1500 right of the character.

const METAL = [176, 196, 214], METAL2 = [120, 140, 165], WARM = [70, 40, 60], VAP = [150, 205, 255];
function drop(x, y, r, a = 1) {
  if (a <= 0.01 || r < 1) return;
  g.save(); g.globalAlpha = a * 0.85; g.fillStyle = "rgba(215,238,255,0.75)"; g.beginPath(); g.arc(x, y, r, 0, TAU2); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.9)"; g.lineWidth = Math.max(1.5, r * 0.12); g.stroke();
  g.fillStyle = "#ffffff"; g.beginPath(); g.arc(x - r * 0.35, y - r * 0.35, r * 0.25, 0, TAU2); g.fill(); g.restore();
}
// a cold can with droplets; wet = 0..1 how far condensation has gone; run = a drop running down
function can(cx, cy, w, h, T, wet = 1, a = 1, label = true) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  const gr = g.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
  gr.addColorStop(0, css(METAL2)); gr.addColorStop(0.35, css([226, 236, 246])); gr.addColorStop(0.6, css(METAL)); gr.addColorStop(1, css(METAL2));
  g.fillStyle = gr; g.beginPath(); g.roundRect(cx - w / 2, cy - h / 2, w, h, 30); g.fill();
  g.fillStyle = css([40, 120, 200]); g.fillRect(cx - w / 2, cy - h * 0.18, w, h * 0.36);
  if (label) { g.font = `900 ${w * 0.2}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; g.fillStyle = "#F2F5FB"; g.fillText("COLD", cx, cy); }
  g.fillStyle = css([200, 212, 226]); g.beginPath(); g.ellipse(cx, cy - h / 2 + 4, w / 2 - 6, 22, 0, 0, TAU2); g.fill();
  g.strokeStyle = css(METAL2); g.lineWidth = 6; g.beginPath(); g.ellipse(cx, cy - h / 2 + 4, w / 2 - 6, 22, 0, 0, TAU2); g.stroke();
  g.restore();
  for (let i = 0; i < 90; i++) {
    const x = cx - w / 2 + 14 + hash(i, 1) * (w - 28), y = cy - h / 2 + 40 + hash(i, 2) * (h - 70), ti = hash(i, 3) * 0.8;
    drop(x, y, (4 + 13 * hash(i, 4)) * Math.sqrt(clamp((wet - ti) / (1 - ti + 0.01))), a);
  }
  const s = (T * 0.22) % 1, rx = cx + w * 0.22;   // one drop running down, leaving a trail
  if (wet > 0.8) { line(rx, cy - h / 2 + 80, rx, cy - h / 2 + 80 + s * (h - 120), [220, 240, 255], a * 0.5, 8); drop(rx, cy - h / 2 + 80 + s * (h - 120), 16, a); }
}
// vapour molecules: H2O as a blue dot with two small white H; positions are closed-form drifts
function h2o(x, y, s, a) { if (a <= 0.01) return; dot(x, y, 10 * s, VAP, a); dot(x - 8 * s, y - 7 * s, 5 * s, INKc, a); dot(x + 8 * s, y - 7 * s, 5 * s, INKc, a); }
const SCENES = {};

// 1 — hook: frame one = a cold can beaded with water, a drop running; then "sealed: nothing leaks"
SCENES.hook = (t, T, B, E, dur) => {
  clear(mix(BGc, WARM, 0.35)); vignette(0.25);
  can(560, 820, 380, 640, T, 1, 1);
  const s1 = seg(t, B(1), B(1) + 0.4), s2 = seg(t, B(1) + 1.3, B(1) + 1.7);
  plate("leaking out? no", 560, 440, 46, CORAL, "center", s1, 800);
  plate("sealed", 560, 1190, 46, GOLD, "center", s2, 800);
  MASR(T, t, { ev: [[0.3, "?"], [B(1) + 1.4, "!", "grin"]], look: [0.9, -0.8], mouth: "o" });
};

// 2 — air: the warm air is full of vapour; one cubic metre carries ≈25 g
SCENES.air = (t, T, B, E, dur) => {
  clear(mix(BGc, WARM, 0.35)); vignette(0.25);
  const rev = seg(t, 0.4, 1.4);
  for (let i = 0; i < 150; i++) {
    const x = (hash(i, 1) * 1180 + T * (20 + 30 * hash(i, 2)) + 40 * Math.sin(T * 0.9 + i)) % 1180 - 50, y = 400 + hash(i, 3) * 860 + 30 * Math.sin(T * 1.3 + i * 0.7);
    h2o(x, y, 1, rev * 0.9);
  }
  plate("water vapour: invisible gas", 560, 420, 46, BLUE, "center", win(t, 0.6, B(1) - 0.1, 0.3), 800);
  // one cubic metre (drawn as a cube) and its share of water
  const c = seg(t, B(1), B(1) + 0.6), X = 300, Y = 560, S = 420, d = 140;
  g.save(); g.globalAlpha = c; g.strokeStyle = css(GOLDc); g.lineWidth = 6; g.lineJoin = "round";
  g.strokeRect(X, Y, S, S); g.beginPath(); g.moveTo(X, Y); g.lineTo(X + d, Y - d); g.lineTo(X + S + d, Y - d); g.lineTo(X + S, Y); g.moveTo(X + S + d, Y - d); g.lineTo(X + S + d, Y + S - d); g.lineTo(X + S, Y + S); g.stroke(); g.restore();
  plate("1 m³ of air · 32 °C · 75% humid", 640, 1010, 42, GOLD, "center", c, 800);
  plate(`≈${roll(t, B(1) + 0.6, B(1) + 2.6, 25)} g of water`, 640, 1100, 54, INK, "center", seg(t, B(1) + 0.5, B(1) + 0.9), 900);
  MASR(T, t, { ev: [[0.8, "!"], [B(1) + 2.6, "idea", "smile"]], look: [0.9, -0.8], mouth: "o" });
};

// 3 — can: close-up of the can wall; the air next to it cools; that cold, ≈6 g/m³ can stay vapour; the rest condenses
SCENES.can = (t, T, B, E, dur) => {
  clear(mix(BGc, WARM, 0.35)); vignette(0.2);
  const WALL = 300, cool = seg(t, 0.3, 1.6);
  // the wall (metal) and the chilled layer of air beside it
  const gr = g.createLinearGradient(WALL, 0, WALL + 380, 0); gr.addColorStop(0, `rgba(120,190,255,${0.45 * cool})`); gr.addColorStop(1, "rgba(120,190,255,0)");
  g.fillStyle = gr; g.fillRect(WALL, 380, 380, 880);
  const mg = g.createLinearGradient(0, 0, WALL, 0); mg.addColorStop(0, css(METAL2)); mg.addColorStop(1, css([226, 236, 246])); g.fillStyle = mg; g.fillRect(0, 380, WALL, 880);
  text("can", 150, 420, 42, BG, "center", 900, 1);
  plate("≈4 °C", 400, 1215, 40, BLUE, "center", cool, 800); plate("32 °C", 840, 1215, 40, CORAL, "center", cool, 800);
  // molecules: far ones wander; those that reach the cold layer slow down and land on the wall (condense)
  const land = seg(t, B(2) - 0.5, B(2) + 2.5);
  for (let i = 0; i < 70; i++) {
    const y0 = 420 + hash(i, 3) * 800, ph = hash(i, 5), cyc = 4 + 3 * hash(i, 6), u = ((t + ph * cyc) % cyc) / cyc;
    let x = lerp(1060, WALL + 10, u), y = y0 + 40 * Math.sin(T * 2 + i), a = 0.9;
    if (x < WALL + 380) { const k = (x - WALL) / 380; x = WALL + 380 * Math.pow(k, 1.6); }   // slowing in the cold layer
    const sticks = hash(i, 7) < lerp(0.15, 0.75, land) && u > 0.85;
    if (sticks) a = 0;
    h2o(x, y, 1.1, a);
  }
  for (let i = 0; i < 26; i++) { const ti = 1.0 + hash(i, 8) * (dur - 3), r = (6 + 16 * hash(i, 9)) * Math.sqrt(clamp((t - ti) / 4)) * (0.4 + 0.6 * land);
    drop(WALL - 4, 430 + hash(i, 10) * 780, r, 1); }
  // the budget: in the air vs what can stay vapour at 4 °C
  const b = seg(t, B(1) - 0.2, B(1) + 0.6), bw = 440, X = 370;
  rrect(340, 400, 690, 330, 24, [24, 30, 60], b * 0.92);
  text("water per m³", X, 445, 38, INK, "left", 800, b);
  rrect(X, 480, bw, 46, 10, VAP, b); text("25 g", X + bw + 16, 503, 38, BLUE, "left", 900, b);
  rrect(X, 550, bw * 6.4 / 25, 46, 10, GOLDc, b); text("6 g", X + bw * 6.4 / 25 + 16, 573, 38, GOLD, "left", 900, b);
  text("max as vapour at 4 °C", X, 625, 34, GOLD, "left", 700, b);
  const ex = seg(t, B(2), B(2) + 0.6);
  rrect(X + bw * 6.4 / 25, 480, bw * (1 - 6.4 / 25), 46, 10, null, ex, CORALc, 6);
  text("the rest → liquid", X, 685, 38, CORAL, "left", 900, ex);
  MASR(T, t, { ev: [[1.4, "?"], [B(1) + 0.8, "!"], [B(2) + 1.0, "ok", "grin"]], look: [0.9, -0.8], mouth: "o" });
};

// 4 — dew: the same thing on grass at dawn and on glasses leaving an air-conditioned room
SCENES.dew = (t, T, B, E, dur) => {
  clear(mix(BGc, WARM, 0.3)); vignette(0.25);
  const p1 = seg(t, 0.1, 0.5), p2 = seg(t, B(0) + 2.6, B(0) + 3.2);
  rrect(40, 400, 1000, 400, 28, [40, 70, 80], p1);
  g.save(); g.globalAlpha = p1; g.strokeStyle = "#5fae5a"; g.lineCap = "round";
  for (let i = 0; i < 9; i++) { const bx = 120 + i * 100; g.lineWidth = 16; g.beginPath(); g.moveTo(bx, 790); g.quadraticCurveTo(bx + 30, 600, bx + 70 * Math.sin(i), 470 + 30 * hash(i, 1)); g.stroke(); }
  g.restore();
  for (let i = 0; i < 9; i++) drop(120 + i * 100 + 40 * Math.sin(i) * 0.6, 560 + 60 * hash(i, 2), 12 + 6 * hash(i, 3) * seg(t, 0.3, 2.3), p1);
  plate("morning dew", 860, 450, 42, INK, "center", p1, 800);
  rrect(40, 830, 1000, 400, 28, [50, 50, 70], p2);
  // glasses: the lenses fog over as they meet the warm, humid air
  const fog = seg(t, B(0) + 3.2, B(0) + 5.0);
  g.save(); g.globalAlpha = p2; g.strokeStyle = "#111421"; g.lineWidth = 16;
  [[340, 1040], [660, 1040]].forEach(([x, y]) => { g.fillStyle = `rgba(235,240,248,${0.15 + 0.7 * fog})`; g.beginPath(); g.roundRect(x - 130, y - 85, 260, 170, 40); g.fill(); g.stroke(); });
  g.beginPath(); g.moveTo(470, 1020); g.quadraticCurveTo(500, 1000, 530, 1020); g.stroke(); g.restore();
  for (let i = 0; i < 24; i++) drop(220 + (i % 12) * 20 + (i >= 12 ? 320 : 0), 980 + 110 * hash(i, 5), 5 * fog, p2 * fog);
  plate("A/C room → humid street", 540, 880, 40, INK, "center", p2, 800);
  MASR(T, t, { ev: [[0.6, "!"], [B(0) + 4.0, "idea", "grin"]], look: [0.9, -0.8], mouth: "o" });
};

// 5 — end: "the air is sweating"; the last second is the opening frame (loop)
SCENES.end = (t, T, B, E, dur) => {
  clear(mix(BGc, WARM, 0.35)); vignette(0.25);
  can(560, 820, 380, 640, T, 1, 1);
  for (let i = 0; i < 40; i++) { const s = ((T * 0.5 + hash(i, 1)) % 1), an = hash(i, 2) * TAU2, r = 520 - 300 * s;
    h2o(560 + r * Math.cos(an), 820 + r * Math.sin(an) * 1.2, 0.9, 0.8 * (1 - s) * (1 - seg(t, dur - 1.0, dur - 0.2))); }
  MASR(T, t, { ev: [[0.5, "ok", "grin"]], look: [0.9, -0.8], mouth: "smile" });
};
