// Episode 34 (Short v3, 1080×1920): old windows aren't melting.
// Facts (claims.md): Zanotto 1998 (Am J Phys 66: 392): at room temperature the relaxation time of cathedral glass is far
// beyond the age of the universe (~1.4 × 10^10 years), so no visible flow; uneven panes come from crown (spun) and
// cylinder (blown) glass making; glaziers often set the thick edge down (DoITPoMS, Univ. of Cambridge). Old panes with
// the thick edge at the top or side also exist. The bars below are schematic, not to scale (the true ratio is too large to draw).

function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 800, 80, 540, 800, 980);
  gr.addColorStop(0, "rgb(118,128,190)"); gr.addColorStop(0.6, "rgb(72,88,156)"); gr.addColorStop(1, "rgb(28,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// an old leaded window: stone frame, 2×3 small panes of wavy glass; light through it; thickness shown as darker bottom bands
function windowPanes(x, y, w, h, T, a = 1, thickBottom = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  rrect(x - 30, y - 30, w + 60, h + 60, 20, [150, 136, 118], 1);
  rrect(x, y, w, h, 6, [200, 226, 240], 1);
  const cols = 2, rows = 3, pw = w / cols, ph = h / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const px = x + c * pw, py = y + r * ph;
    const gr = g.createLinearGradient(0, py, 0, py + ph);
    gr.addColorStop(0, "rgba(220,240,250,0.9)"); gr.addColorStop(1, `rgba(120,170,190,${0.5 + 0.4 * thickBottom})`);
    g.fillStyle = gr; g.fillRect(px + 6, py + 6, pw - 12, ph - 12);
    g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = 4;
    for (let k = 0; k < 4; k++) { g.beginPath(); for (let s = 0; s <= 20; s++) { const xx = px + 14 + s * (pw - 28) / 20, yy = py + 30 + k * (ph - 60) / 3 + 8 * Math.sin(s * 0.9 + k * 2 + T * 0.6 + r + c); s ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
    dot(px + pw * (0.3 + 0.4 * hash(r * 3 + c, 1)), py + ph * (0.3 + 0.4 * hash(r * 3 + c, 2)), 7, [255, 255, 255], 0.7);   // a bubble
  }
  g.strokeStyle = "#3a3d48"; g.lineWidth = 12;
  for (let c = 0; c <= cols; c++) { g.beginPath(); g.moveTo(x + c * pw, y); g.lineTo(x + c * pw, y + h); g.stroke(); }
  for (let r = 0; r <= rows; r++) { g.beginPath(); g.moveTo(x, y + r * ph); g.lineTo(x + w, y + r * ph); g.stroke(); }
  g.restore();
}
// side view of one pane: a wedge, thin at top, thick at bottom (k = 0 flat, 1 wedge)
function wedge(cx, top, bot, k, a = 1, flip = 0) {
  if (a <= 0.01) return;
  const thin = 18, thick = 18 + 60 * k, tT = lerp(thin, thick, flip), tB = lerp(thick, thin, flip);
  poly([[cx - tT / 2, top], [cx + tT / 2, top], [cx + tB / 2, bot], [cx - tB / 2, bot]], INK, a, 5, true, [170, 215, 235]);
}
const look = [0.6, -0.5];
const SCENES = {};

// 1 — hook: frame one = an old leaded window with wavy, bubbly glass
SCENES.hook = (t, T, B, E, dur) => {
  room(); windowPanes(250, 420, 580, 820, T);
  MASR(T, t, { ev: [[0.5, "?"]], look, mouth: "o" });
};

// 2 — myth: the window turns to a side view; the pane is thicker at the bottom; a coral "flowing down?"
SCENES.myth = (t, T, B, E, dur) => {
  room();
  const k = seg(t, 0.4, 1.2);
  windowPanes(250, 420, 580, 820, T, 1 - k);
  wedge(540, 440, 1220, 1, k);
  plate("top: thin", 760, 470, 42, INK, "left", seg(t, 1.4, 1.8), 800); plate("bottom: thick", 760, 1180, 42, INK, "left", seg(t, 1.4, 1.8), 800);
  const fa = seg(t, 2.6, 3.0);
  for (let i = 0; i < 3; i++) { const u = (T * 0.6 + i / 3) % 1; arrow(420, 520 + u * 500, 420, 580 + u * 500, CORALc, fa * (1 - u), 7, 20); }
  plate("glass flows down?", 540, 300, 52, CORAL, "center", fa, 900);
  MASR(T, t, { ev: [[2.8, "?"]], look, mouth: "o" });
};

// 3 — time: two bars from one start line; the age of the universe is a short gold bar, the time glass needs runs off the frame
SCENES.time = (t, T, B, E, dur) => {
  room();
  wedge(540, 440, 1220, 1, 1 - seg(t, 0.1, 0.6));
  const a = seg(t, 0.5, 1.0), x0 = 120;
  plate("room temperature", 540, 300, 50, INK, "center", a, 900);
  rrect(x0, 600, 150 * eio(seg(t, 1.0, 2.0)), 120, 24, GOLDc, a);
  text("age of the universe", x0, 545, 54, GOLD, "left", 900, a);
  const L = 1600 * eio(seg(t, 2.2, 4.6));
  rrect(x0, 880, Math.min(L, 980), 120, 24, BLUEc, a);
  text("time for glass to sag", x0, 825, 54, BLUE, "left", 900, a);
  if (L > 900) for (let i = 0; i < 3; i++) arrow(1000 + i * 22, 940, 1016 + i * 22, 940, INKc, a, 6, 14);
  plate("far, far longer", 600, 1110, 54, BLUE, "center", seg(t, 4.2, 4.6), 900);
  plate("not to scale", 820, 1210, 40, QUIET, "center", seg(t, 4.4, 4.8), 700);
  MASR(T, t, { ev: [[3.6, "!"]], look, mouth: "o" });
};

// 4 — made: a crown-glass disc spins and thickens toward the bullseye; a pane cut from it is a wedge; it is set thick edge down
SCENES.made = (t, T, B, E, dur) => {
  room();
  const a = seg(t, 0.1, 0.6) * (1 - seg(t, B(1) - 0.4, B(1)));
  if (a > 0.01) {
    const cx = 540, cy = 780, R = 360, sp = T * 2.5;
    for (let i = 8; i >= 0; i--) { const r = R * (i + 1) / 9; dot(cx, cy, r, mix([110, 170, 196], [214, 238, 246], i / 8), a); }
    g.save(); g.globalAlpha = a; g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 5; for (let k = 0; k < 6; k++) { g.beginPath(); g.arc(cx, cy, 80 + k * 50, sp + k, sp + k + 1.6); g.stroke(); } g.restore();
    dot(cx, cy, 40, [90, 140, 170], a);
    g.save(); g.globalAlpha = a * seg(t, 2.0, 2.4); g.strokeStyle = GOLD; g.lineWidth = 7; g.setLineDash([16, 12]); g.strokeRect(cx + 70, cy - 120, 220, 240); g.restore();
    plate("spun by hand: thick in the middle", 540, 300, 44, INK, "center", seg(t, 0.6, 1.0) * a, 900);
  }
  const b = seg(t, B(1) - 0.3, B(1) + 0.3), rot = Math.PI / 2 * (1 - eio(seg(t, B(1) + 0.4, B(1) + 1.6)));
  if (b > 0.01) {
    windowPanes(250, 420, 580, 820, T, b * 0.35);
    g.save(); g.translate(540, 830); g.rotate(rot); wedge(0, -390, 390, 1, b); g.restore();
    plate("thick edge down", 540, 300, 50, GOLD, "center", seg(t, B(1) + 1.4, B(1) + 1.8), 900);
  }
  MASR(T, t, { ev: [[2.2, "idea"], [B(1) + 1.6, "ok"]], look, mouth: "o" });
};

// 5 — end: back to the window (frame one)
SCENES.end = (t, T, B, E, dur) => {
  room(); windowPanes(250, 420, 580, 820, T);
  plate("uneven from the start", 540, 300, 50, GOLD, "center", win(t, 0.3, dur - 1.15, 0.3), 900);
  MASR(T, t, { ev: [[0.5, "ok", "grin"]], look, mouth: "o" });
};
