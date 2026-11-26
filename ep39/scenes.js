// Episode 39 (Short v3, 1080×1920): every popcorn kernel is a tiny pressure cooker.
// Facts (claims.md): Virot & Ponomarenko 2015 (J R Soc Interface 12: 20141247): kernels hold ~14 % water; most pop near
// 180 °C (34 % at 170 °C, 96 % at 180 °C); the hull bursts at ~10 bar (about 10× atmospheric pressure); the starch
// expands into a foam; the "pop" sound is most likely from the sudden release of water vapour (their hypothesis).
// Gauge and thermometer values are drawn to those numbers; droplet sizes are schematic.

function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 800, 80, 540, 800, 980);
  gr.addColorStop(0, "rgb(126,120,186)"); gr.addColorStop(0.6, "rgb(78,86,154)"); gr.addColorStop(1, "rgb(28,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// a kernel (teardrop) with a hull; cut = 0 outside view, 1 cross-section; jig = droplet agitation
function kernel(cx, cy, s, a = 1, cut = 0, T = 0, jig = 0, crack = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s);
  const shp = () => { g.beginPath(); g.moveTo(0, -300); g.bezierCurveTo(230, -300, 260, 80, 0, 300); g.bezierCurveTo(-260, 80, -230, -300, 0, -300); g.closePath(); };
  shp(); g.lineWidth = 14; g.strokeStyle = INK; g.stroke();
  const gr = g.createLinearGradient(-200, -300, 200, 300); gr.addColorStop(0, "#FFC845"); gr.addColorStop(0.7, "#E8902C"); gr.addColorStop(1, "#B9661E");
  shp(); g.fillStyle = gr; g.fill();
  if (cut > 0.01) {
    g.globalAlpha = a * cut; g.save(); g.scale(0.82, 0.86); shp(); g.fillStyle = "#FFF1C8"; g.fill(); g.restore();
    for (let i = 0; i < 26; i++) { const u = hash(i, 1), v = hash(i, 2), x = (u - 0.5) * 260 + jig * 12 * Math.sin(T * 30 + i * 2.1), y = (v - 0.5) * 380 + jig * 12 * Math.cos(T * 27 + i); dot(x, y, 13, BLUEc, a * cut); }
  }
  g.globalAlpha = a;
  if (crack > 0.01) { g.strokeStyle = "#3a2410"; g.lineWidth = 8; g.beginPath(); g.moveTo(-40, -280); g.lineTo(10, -200 + 40 * crack); g.lineTo(-30, -120); g.lineTo(30, -40 * crack); g.stroke(); }
  g.fillStyle = "#F7E7B8"; g.beginPath(); g.ellipse(0, 270, 40, 30, 0, 0, TAU2); g.fill();   // tip
  g.restore();
}
// popped corn: lumpy white foam with the hull flap
function popped(cx, cy, s, a = 1, T = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s);
  const P = [[0, 0, 200], [-170, -60, 150], [160, -90, 160], [-90, 140, 150], [130, 120, 150], [0, -190, 140]];
  P.forEach(([x, y, r]) => { g.fillStyle = INK; g.beginPath(); g.arc(x, y, r + 10, 0, TAU2); g.fill(); });
  P.forEach(([x, y, r], i) => { const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, 10, x, y, r); gr.addColorStop(0, "#FFFDF5"); gr.addColorStop(1, "#F2E6C6"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * (1 + 0.015 * Math.sin(T * 2 + i)), 0, TAU2); g.fill(); });
  g.fillStyle = "#E8902C"; g.beginPath(); g.ellipse(40, 260, 90, 40, 0.3, 0, TAU2); g.fill();
  g.restore();
}
function gauge(cx, cy, v, label, a = 1) {   // v: 0..1 over 0..10× atmospheric
  if (a <= 0.01) return;
  dot(cx, cy, 120, PANELc, a); g.save(); g.globalAlpha = a; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, 120, 0, TAU2); g.stroke();
  g.strokeStyle = CORAL; g.lineWidth = 14; g.beginPath(); g.arc(cx, cy, 96, Math.PI * 0.75, Math.PI * 0.75 + Math.PI * 1.5 * v); g.stroke();
  const an = Math.PI * 0.75 + Math.PI * 1.5 * v; g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + 80 * Math.cos(an), cy + 80 * Math.sin(an)); g.stroke(); g.restore();
  text(label, cx, cy + 60, 40, INK, "center", 900, a);
}
function thermo(x, y, T, a = 1) {   // 20..200 °C
  if (a <= 0.01) return;
  const top = y - 360, f = clamp((T - 20) / 180);
  rrect(x - 26, top, 52, 360, 26, [242, 245, 251], 0.95 * a); dot(x, y + 10, 40, [242, 245, 251], 0.95 * a); dot(x, y + 10, 30, CORALc, a);
  rrect(x - 13, lerp(y, top + 16, f), 26, y - lerp(y, top + 16, f) + 10, 13, CORALc, a);
  plate(`${Math.round(T)} °C`, x, top - 50, 46, INK, "center", a, 900);
}
const look = [0.6, -0.5];
const SCENES = {};

// 1 — hook: frame one = a big kernel shivering on a hot pan, a pressure gauge beside it
SCENES.hook = (t, T, B, E, dur) => {
  room();
  rrect(140, 1120, 800, 40, 20, [60, 64, 80], 1); soft(540, 1140, 260, CORALc, 0.35);
  kernel(500 + 4 * Math.sin(T * 40), 810, 0.95, 1, 0, T);
  gauge(820, 600, 0.55 + 0.05 * Math.sin(T * 6), "pressure");
  MASR(T, t, { ev: [[0.6, "!"]], look, mouth: "o" });
};

// 2 — water: the kernel opens into a cross-section: starch inside, water drops, a hard hull around
SCENES.water = (t, T, B, E, dur) => {
  room();
  const c = seg(t, 0.3, 1.0);
  kernel(560, 800, 1.3, 1, c, T, 0.2);
  plate("water, about 14 %", 540, 300, 48, BLUE, "center", seg(t, 1.2, 1.6), 900);
  plate("hard shell", 860, 500, 44, [255, 200, 120], "center", seg(t, 2.0, 2.4), 900);
  MASR(T, t, { ev: [[1.4, "idea"]], look, mouth: "o" });
};

// 3 — heat: thermometer to 180 °C, the drops shake faster, the gauge climbs to 10×
SCENES.heat = (t, T, B, E, dur) => {
  room();
  const u = eio(seg(t, 0.4, 5.6));
  kernel(580, 820, 1.2, 1, 1, T, 0.2 + 1.2 * u, seg(t, 5.8, 6.6));
  thermo(150, 1060, lerp(20, 180, u));
  gauge(820, 470, u, u > 0.95 ? "≈ 10×" : "pressure");
  plate("about 10× the air outside", 600, 1240, 44, CORAL, "center", seg(t, 5.0, 5.4), 900);
  MASR(T, t, { ev: [[5.4, "!", "wince"]], look, mouth: "o" });
};

// 4 — burst: the hull splits; the starch puffs out into foam
SCENES.burst = (t, T, B, E, dur) => {
  room();
  const p = eout(seg(t, 0.25, 0.8));
  kernel(560, 820, 0.95 * (1 - 0.3 * p), 1 - p, 1, T, 1.4, 1);
  popped(560, 800, lerp(0.3, 1.25, p), seg(t, 0.25, 0.4), T);
  for (let i = 0; i < 8; i++) { const an = i / 8 * TAU2, r = 260 + 260 * eout(seg(t, 0.3, 1.4)); soft(560 + r * Math.cos(an), 800 + r * Math.sin(an), 80, [242, 245, 251], 0.5 * (1 - seg(t, 0.8, 1.8))); }
  plate("starch → foam", 540, 300, 50, INK, "center", seg(t, 1.2, 1.6), 900);
  MASR(T, t, { ev: [[0.4, "!", "grin"]], look, mouth: "o" });
};

// 5 — end: the popped corn with a steam puff ("the pop"), then back to a new kernel (frame one) for the loop
SCENES.end = (t, T, B, E, dur) => {
  room();
  const k = seg(t, dur - 1.5, dur - 1.1);
  rrect(140, 1120, 800, 40, 20, [60, 64, 80], k); soft(540, 1140, 260, CORALc, 0.35 * k);
  popped(560, 800, 1.25, 1 - k, T);
  for (let i = 0; i < 3; i++) { const u = (T * 0.6 + i / 3) % 1; soft(560 + 60 * Math.sin(u * 5 + i), 520 - 200 * u, 70 + 50 * u, [242, 245, 251], 0.6 * (1 - u) * (1 - k)); }
  plate("pop = steam escaping (most likely)", 540, 300, 44, BLUE, "center", seg(t, 0.4, 0.8) * (1 - k), 900);
  kernel(500 + 4 * Math.sin(T * 40), 810, 0.95, k, 0, T);
  gauge(820, 600, 0.55, "pressure", k);
  MASR(T, t, { ev: [[0.6, "ok", "grin"]], look, mouth: "o" });
};
