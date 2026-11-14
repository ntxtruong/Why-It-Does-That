// Episode 35 (Short v3, 1080×1920): you're taller in the morning.
// Facts (claims.md): intervertebral discs lose water under load during the day; stature falls by ~1 % of height
// (≈ 1–2 cm) from morning to evening and recovers lying down (Reilly, Tyrrell & Troup 1984, Spine; Tyrrell et al. 1985).
// In microgravity astronauts' spines lengthen, up to ~3 % of height (NASA). Disc squeeze below is exaggerated for visibility.

function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 800, 80, 540, 800, 980);
  gr.addColorStop(0, "rgb(114,130,196)"); gr.addColorStop(0.6, "rgb(70,90,160)"); gr.addColorStop(1, "rgb(28,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// height chart on a wall with a standing silhouette; h = height in px from the floor at yF
function chart(x, yF, h, a = 1, mark) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  rrect(x - 40, yF - 900, 80, 900, 10, [236, 230, 214], 1);
  for (let i = 0; i <= 30; i++) { const y = yF - i * 30; line(x - 40, y, x - (i % 5 ? 12 : 0), y, [80, 70, 60], 1, i % 5 ? 3 : 5); }
  // silhouette, head top at yF - h
  const sx = x + 200, top = yF - h;
  g.fillStyle = "rgb(160,180,236)"; g.strokeStyle = INK; g.lineWidth = 8;
  const parts = [() => g.arc(sx, top + 70, 70, 0, TAU2), () => g.roundRect(sx - 105, top + 150, 210, h * 0.42, 60), () => g.roundRect(sx - 90, top + 150 + h * 0.4, 80, yF - (top + 150 + h * 0.4), 36), () => g.roundRect(sx + 10, top + 150 + h * 0.4, 80, yF - (top + 150 + h * 0.4), 36)];
  parts.forEach(p => { g.beginPath(); p(); g.stroke(); }); parts.forEach(p => { g.beginPath(); p(); g.fill(); });
  line(x - 40, top, sx + 360, top, GOLDc, 1, 6);
  if (mark) plate(mark, x + 420, top, 42, GOLD, "center", 1, 900);
  g.restore();
}
// a column of vertebrae with discs; sq = 0 (full discs) .. 1 (squeezed); horizontal if lie = 1
function spine(cx, cy, sq, a = 1, lie = 0, T = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(cx, cy); g.rotate(lie * Math.PI / 2);
  const n = 6, vb = 92, d = lerp(40, 22, sq), tot = n * vb + (n - 1) * d; let y = -tot / 2;
  for (let i = 0; i < n; i++) {
    rrect(-120, y, 240, vb, 26, [232, 222, 200], 1, INK, 5);
    rrect(110, y + 20, 70, 50, 18, [214, 202, 178], 1);
    y += vb;
    if (i < n - 1) { rrect(-110, y + 3, 220, d - 6, (d - 6) / 2, [120, 190, 246], 1); y += d; }
  }
  g.restore();
}
const look = [0.6, -0.5];
const SCENES = {};

// 1 — hook: frame one = a height chart: the morning mark sits above the evening mark
SCENES.hook = (t, T, B, E, dur) => {
  room();
  chart(260, 1240, 760, 1); line(220, 1240 - 690, 820, 1240 - 690, CORALc, 0.95, 6, [16, 10]);
  plate("7 am", 880, 1240 - 775, 44, GOLD, "center", 1, 900); plate("10 pm", 880, 1240 - 680, 44, CORAL, "center", 1, 900); text("gap exaggerated", 880, 1240 - 610, 32, QUIET, "center", 700, 1);
  MASR(T, t, { ev: [[0.5, "!"]], look, mouth: "o" });
};

// 2 — discs: zoom into the spine; soft blue discs between the bones
SCENES.discs = (t, T, B, E, dur) => {
  room();
  const k = seg(t, 0.2, 0.9);
  chart(260, 1240, 760, 1 - k);
  spine(560, 800, 0, k);
  plate("discs: soft, full of water", 560, 300, 48, BLUE, "center", seg(t, 1.6, 2.0), 900);
  for (let i = 0; i < 5; i++) { const y = 800 - 330 + 92 + i * 132 + 20; dot(560 + 60 * Math.sin(T * 2 + i), y, 8, [230, 245, 255], 0.8 * k); }
  MASR(T, t, { ev: [[1.8, "idea"]], look, mouth: "o" });
};

// 3 — day: a sun; weight from above squeezes the discs; water drops leave; the top of the column sinks
SCENES.day = (t, T, B, E, dur) => {
  room();
  const sq = eio(seg(t, 0.5, 3.6));
  spine(560, 800 + 60 * sq, sq, 1);
  dot(900, 380, 60, GOLDc, 1); soft(900, 380, 160, GOLDc, 0.35);
  for (let i = 0; i < 3; i++) arrow(380 + i * 180, 300, 380 + i * 180, 380, CORALc, seg(t, 0.3, 0.7), 8, 22);
  for (let i = 0; i < 10; i++) { const u = (T * 0.9 + i / 10) % 1, side = i % 2 ? 1 : -1; dot(560 + side * (130 + 220 * u), 560 + (i % 5) * 120, 10, BLUEc, seg(t, 0.6, 1.0) * (1 - u) * (1 - seg(t, 3.6, 4.2))); }
  plate("−1 to 2 cm by evening", 560, 300, 50, CORAL, "center", seg(t, 2.8, 3.2), 900);
  MASR(T, t, { ev: [[3.0, "!", "wince"]], look, mouth: "o" });
};

// 4 — night: the spine lies down under a moon; discs refill. Then an astronaut floating: up to 3 %
SCENES.night = (t, T, B, E, dur) => {
  room();
  const a = 1 - seg(t, B(1) - 0.4, B(1));
  const sq = 1 - eio(seg(t, 0.6, 2.8));
  spine(560, 760, sq, a, 1);
  if (a > 0.01) { dot(880, 380, 54, [230, 236, 250], a); dot(905, 365, 50, [92, 106, 170], a); }
  for (let i = 0; i < 8; i++) { const u = (T * 0.8 + i / 8) % 1; dot(220 + i * 90, lerp(560, 740, u), 9, BLUEc, a * seg(t, 0.5, 0.9) * (1 - u)); }
  plate("discs soak water back", 560, 300, 50, BLUE, "center", seg(t, 1.6, 2.0) * a, 900);
  const b = seg(t, B(1) - 0.2, B(1) + 0.3);
  if (b > 0.01) {
    g.save(); g.globalAlpha = b; g.translate(560, 760 + 20 * Math.sin(T * 1.5)); g.rotate(0.15 * Math.sin(T * 0.8));
    rrect(-120, -260, 240, 420, 80, [236, 240, 246], 1, INK, 8); dot(0, -330, 110, [236, 240, 246], 1); rrect(-80, -380, 160, 100, 40, [60, 80, 130], 1);
    rrect(-150, -200, 50, 260, 25, [236, 240, 246], 1, INK, 6); rrect(100, -200, 50, 260, 25, [236, 240, 246], 1, INK, 6);
    rrect(-100, 140, 80, 230, 30, [236, 240, 246], 1, INK, 6); rrect(20, 140, 80, 230, 30, [236, 240, 246], 1, INK, 6);
    g.restore();
    for (let i = 0; i < 12; i++) dot(120 + hash(i, 3) * 840, 360 + hash(i, 4) * 900, 4, INKc, 0.7 * b);
    plate("in orbit: up to 3 % taller", 560, 300, 48, GOLD, "center", seg(t, B(1) + 1.2, B(1) + 1.6), 900);
  }
  MASR(T, t, { ev: [[1.8, "ok"], [B(1) + 1.4, "!", "grin"]], look, mouth: "o" });
};

// 5 — end: the morning chart again (frame one), with a 7 am clock
SCENES.end = (t, T, B, E, dur) => {
  room();
  chart(260, 1240, 760, 1); line(220, 1240 - 690, 820, 1240 - 690, CORALc, 0.95, 6, [16, 10]);
  plate("7 am", 880, 1240 - 775, 44, GOLD, "center", 1, 900); plate("10 pm", 880, 1240 - 680, 44, CORAL, "center", 1, 900); text("gap exaggerated", 880, 1240 - 610, 32, QUIET, "center", 700, 1);
  plate("measure before breakfast", 540, 300, 50, GOLD, "center", win(t, 0.3, dur - 1.15, 0.3), 900);
  MASR(T, t, { ev: [[0.5, "ok", "grin"]], look, mouth: "o" });
};
