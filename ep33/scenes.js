// Episode 33 (Short v3, 1080×1920): every banana is a little radioactive.
// Facts (claims.md): K-40 is 0.0117 % of natural potassium (≈ 1 atom in 8,500, "about one in ten thousand");
// a banana holds ≈ 0.4–0.5 g potassium ≈ 15 Bq; a 70 kg adult ≈ 4,000–5,000 Bq (≈ 300× a banana).
// Potassium is under homeostatic control: extra potassium is excreted, so a banana does not raise the body's K-40.
// Flashes are drawn at deterministic, hash-scheduled times; their rate is illustrative (a banana's 15 decays/s are not all shown).

function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 800, 80, 540, 800, 980);
  gr.addColorStop(0, "rgb(112,128,196)"); gr.addColorStop(0.6, "rgb(70,90,160)"); gr.addColorStop(1, "rgb(28,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// a banana: a thick crescent between two arcs, with a stem and a dark tip; s scale
function banana(x, y, s = 1, a = 1, rot = -0.25) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(rot); g.scale(s, s);
  const shape = () => { g.beginPath(); g.moveTo(-360, -40); g.quadraticCurveTo(0, 260, 360, -60); g.quadraticCurveTo(330, -20, 300, -10); g.quadraticCurveTo(0, 130, -330, -90); g.closePath(); };
  shape(); g.lineJoin = "round"; g.lineWidth = 18; g.strokeStyle = "#F2F5FB"; g.stroke();
  const gr = g.createLinearGradient(0, -60, 0, 200); gr.addColorStop(0, "#FFE680"); gr.addColorStop(0.6, "#F6CF3A"); gr.addColorStop(1, "#D9A622");
  shape(); g.fillStyle = gr; g.fill();
  g.strokeStyle = "rgba(170,120,20,0.55)"; g.lineWidth = 6; g.beginPath(); g.moveTo(-320, -60); g.quadraticCurveTo(0, 200, 320, -40); g.stroke();
  g.fillStyle = "#7a5a2a"; g.beginPath(); g.roundRect(330, -96, 60, 34, 10); g.fill();
  g.fillStyle = "#4a3418"; g.beginPath(); g.arc(-345, -62, 16, 0, TAU2); g.fill();
  g.restore();
}
// decay flashes: n sources inside a region, each fires at hashed times; a gold ring grows and a short ray leaves
function flashes(T, cx, cy, rx, ry, rate, a = 1, seed = 0) {
  if (a <= 0.01) return;
  const k = Math.floor(T * rate);
  for (let j = k - 3; j <= k; j++) {
    const t0 = (j + hash(j, seed + 1)) / rate, u = (T - t0) / 0.7; if (u < 0 || u > 1) continue;
    const px = cx + (hash(j, seed + 2) - 0.5) * 2 * rx, py = cy + (hash(j, seed + 3) - 0.5) * 2 * ry, an = hash(j, seed + 4) * TAU2;
    g.save(); g.globalAlpha = a * (1 - u); g.strokeStyle = GOLD; g.lineWidth = 6; g.beginPath(); g.arc(px, py, 10 + 50 * eout(u), 0, TAU2); g.stroke(); g.restore();
    dot(px, py, 10, GOLDc, a * (1 - u));
    line(px + Math.cos(an) * 30, py + Math.sin(an) * 30, px + Math.cos(an) * (40 + 200 * u), py + Math.sin(an) * (40 + 200 * u), GOLDc, a * (1 - u), 5);
  }
}
// a simple body silhouette (head + torso + limbs), height ~ s*900
function body(x, yFeet, s, a = 1, col = [150, 170, 230]) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, yFeet); g.scale(s, s); g.fillStyle = css(col); g.strokeStyle = INK; g.lineWidth = 10;
  const parts = [() => g.arc(0, -820, 80, 0, TAU2), () => g.roundRect(-120, -720, 240, 380, 70), () => g.roundRect(-105, -360, 90, 360, 40), () => g.roundRect(15, -360, 90, 360, 40), () => g.roundRect(-180, -700, 60, 330, 30), () => g.roundRect(120, -700, 60, 330, 30)];
  parts.forEach(p => { g.beginPath(); p(); g.stroke(); }); parts.forEach(p => { g.beginPath(); p(); g.fill(); });
  g.restore();
}
const look = [0.6, -0.5];
const SCENES = {};

// 1 — hook: frame one = a big banana; gold decay flashes pop out of it
SCENES.hook = (t, T, B, E, dur) => {
  room(); banana(540, 760, 1.35); flashes(T, 540, 760, 300, 80, 2.2);
  MASR(T, t, { ev: [[0.6, "!"]], look, mouth: "o" });
};

// 2 — k40: a grid of 10,000 potassium atoms; one is radioactive (gold) and flashes
SCENES.k40 = (t, T, B, E, dur) => {
  room();
  const ka = seg(t, 0.3, 1.0), x0 = 140, y0 = 440, n = 100, d = 8;
  banana(540, 760, 1.35, 1 - seg(t, 0.2, 0.8));
  g.globalAlpha = ka; g.fillStyle = "rgb(186,160,236)";
  const shown = Math.floor(n * n * eio(seg(t, 0.6, 2.6)));
  for (let i = 0; i < shown; i++) g.fillRect(x0 + (i % n) * d, y0 + Math.floor(i / n) * d, 5, 5);
  g.globalAlpha = 1;
  const gx = x0 + 63 * d, gy = y0 + 41 * d, ga = seg(t, 3.0, 3.4);
  soft(gx, gy, 90, GOLDc, 0.6 * ga); dot(gx, gy, 16, GOLDc, ga);
  if (ga > 0.5) flashes(T, gx, gy, 1, 1, 1.4, ga, 7);
  plate("potassium atoms", 540, 300, 50, [210, 190, 255], "center", seg(t, 1.0, 1.4) * (1 - seg(t, 3.0, 3.3)), 900);
  plate("radioactive: about 1 in 10,000", 540, 300, 46, GOLD, "center", seg(t, 3.4, 3.8), 900);
  MASR(T, t, { ev: [[3.3, "!"]], look, mouth: "o" });
};

// 3 — you: a body with far more flashes than the banana beside it
SCENES.you = (t, T, B, E, dur) => {
  room();
  const a = seg(t, 0.1, 0.6);
  body(640, 1230, 1.05, a); flashes(T, 640, 760, 110, 300, 14 * a, a, 3);
  banana(330, 520, 0.42, a, -0.35); flashes(T, 330, 520, 120, 30, 0.6 * a, a, 5);
  plate("a banana: ~15 decays/s", 330, 380, 40, INK, "center", seg(t, 1.0, 1.4), 800);
  plate("you: hundreds of times more", 640, 300, 46, GOLD, "center", seg(t, 2.0, 2.4), 900);
  MASR(T, t, { ev: [[2.2, "!", "wince"]], look, mouth: "o" });
};

// 4 — flush: a banana goes in, the extra potassium goes out; the body's potassium gauge stays level
SCENES.flush = (t, T, B, E, dur) => {
  room();
  body(560, 1230, 1.05); flashes(T, 560, 760, 110, 300, 14, 1, 3);
  const bi = eio(seg(t, 0.3, 1.6));
  banana(lerp(980, 640, bi), lerp(330, 470, bi), 0.36 * (1 - 0.8 * seg(t, 1.4, 1.8)), 1 - seg(t, 1.5, 1.8), -0.3);
  // outflow: drops leave at the bottom right
  for (let i = 0; i < 6; i++) { const u = ((T * 0.8 + i / 6) % 1); dot(lerp(640, 960, u), 1050 + 40 * Math.sin(u * 6), 12, [186, 160, 236], seg(t, 2.2, 2.8) * (1 - u)); }
  plate("extra potassium out", 860, 980, 40, [210, 190, 255], "center", seg(t, 2.6, 3.0), 800);
  // gauge
  const gx = 860, gy = 560; rrect(gx - 120, gy - 26, 240, 52, 26, [24, 34, 70], 1);
  rrect(gx - 120, gy - 26, 240 * (0.6 + 0.04 * Math.sin(T * 3) * seg(t, 1.4, 2.0) * (1 - seg(t, 2.6, 3.4))), 52, 26, [186, 160, 236], 1);
  text("body potassium", gx, gy - 66, 40, QUIET, "center", 800); plate("stays level", gx, gy + 80, 42, GOLD, "center", seg(t, 3.4, 3.8), 900);
  MASR(T, t, { ev: [[1.6, "?"], [3.6, "ok", "smile"]], look, mouth: "o" });
};

// 5 — end: the banana beside you, then frame one again
SCENES.end = (t, T, B, E, dur) => {
  room();
  const k = seg(t, dur - 1.5, dur - 1.1);
  body(700, 1230, 1.0, 1 - k); flashes(T, 700, 760, 105, 290, 14 * (1 - k), 1 - k, 3);
  banana(lerp(320, 540, k), lerp(560, 760, k), lerp(0.45, 1.35, k), 1, -0.3 + 0.05 * k); flashes(T, lerp(320, 540, k), lerp(560, 760, k), lerp(120, 300, k), 40, 1 + 1.2 * k, 1, 5);
  MASR(T, t, { ev: [[0.5, "ok", "grin"]], look, mouth: "o" });
};
