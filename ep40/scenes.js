// Episode 40 (Short v3, 1080×1920): that's not the ocean in a seashell.
// Facts (claims.md): the "ocean" is ambient noise filtered by the shell's cavity, which resonates and boosts some
// frequencies (a Helmholtz-like resonator); any cavity, e.g. a cup, does the same (Library of Congress, Everyday
// Mysteries; acoustics texts). Louder surroundings → louder "ocean"; in a very quiet room it fades to a faint hush.
// The spectrum bars are schematic, not measurements.

function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 800, 80, 540, 800, 980);
  gr.addColorStop(0, "rgb(108,134,196)"); gr.addColorStop(0.6, "rgb(66,94,160)"); gr.addColorStop(1, "rgb(28,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// a conch shell: a spiral cone with ridges and a pink opening
function shell(cx, cy, s, a = 1, T = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(cx, cy); g.rotate(-0.3); g.scale(s, s);
  // body: a cone that narrows to a spire tip on the left, wide lip on the right
  const out = () => { g.beginPath(); g.moveTo(-400, -60); g.quadraticCurveTo(-200, -200, 60, -210); g.quadraticCurveTo(320, -200, 370, 10); g.quadraticCurveTo(330, 210, 80, 230); g.quadraticCurveTo(-140, 200, -250, 60); g.quadraticCurveTo(-330, 0, -400, -60); g.closePath(); };
  out(); g.lineWidth = 14; g.lineJoin = "round"; g.strokeStyle = INK; g.stroke();
  const gr = g.createLinearGradient(-300, -200, 300, 200); gr.addColorStop(0, "#F8E7CF"); gr.addColorStop(1, "#D9A576"); out(); g.fillStyle = gr; g.fill();
  // whorls of the spire: arcs that get smaller toward the tip
  g.strokeStyle = "rgba(140,90,50,0.7)"; g.lineWidth = 8;
  [[-80, 150], [-190, 110], [-280, 75], [-350, 45]].forEach(([x, r]) => { g.beginPath(); g.ellipse(x, -40, r * 0.45, r, 0.15, -1.2, 1.4); g.stroke(); });
  // short knobs along the top whorl
  for (let i = 0; i < 5; i++) { g.fillStyle = "#EED7B6"; g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.arc(-150 + i * 80, -196 + Math.abs(i - 2) * 6, 22, Math.PI, 0); g.fill(); g.stroke(); }
  // pink opening (the lip) on the right
  g.fillStyle = "#F4A6B0"; g.beginPath(); g.ellipse(255, 30, 100, 165, -0.15, 0, TAU2); g.fill();
  g.fillStyle = "#C8707E"; g.beginPath(); g.ellipse(275, 40, 50, 110, -0.15, 0, TAU2); g.fill();
  g.restore();
}
// sound squiggles flowing from (x0,y0) to (x1,y1)
function waves(T, x0, y0, x1, y1, col, a, n = 4, amp = 18) {
  if (a <= 0.01) return;
  for (let i = 0; i < n; i++) {
    const u = (T * 0.5 + i / n) % 1, px = lerp(x0, x1, u), py = lerp(y0, y1, u), an = Math.atan2(y1 - y0, x1 - x0), nx = -Math.sin(an), ny = Math.cos(an);
    const pts = []; for (let k = -6; k <= 6; k++) { const d = k * 9; pts.push([px + Math.cos(an) * d + nx * amp * Math.sin(k * 1.2), py + Math.sin(an) * d + ny * amp * Math.sin(k * 1.2)]); }
    poly(pts, col, a * Math.sin(Math.PI * u), 6);
  }
}
// spectrum: bars; res = how strongly a resonance peak shows (0..1); lvl = overall level
function spectrum(x0, y0, w, h, lvl, res, a, T, col) {
  if (a <= 0.01) return;
  const n = 18;
  for (let i = 0; i < n; i++) {
    const f = i / (n - 1), base = 0.35 + 0.08 * Math.sin(T * 5 + i * 1.7), peak = Math.exp(-Math.pow((f - 0.45) / 0.09, 2));
    const v = clamp(lvl * (base * (1 - 0.5 * res) + res * peak * 0.95));
    rrect(x0 + i * (w / n) + 4, y0 + h - h * v, w / n - 8, h * v, 6, col, a);
  }
  line(x0, y0 + h + 6, x0 + w, y0 + h + 6, QUIETc, a, 4);
  text("low pitch", x0, y0 + h + 44, 34, QUIET, "left", 700, a); text("high", x0 + w, y0 + h + 44, 34, QUIET, "right", 700, a);
}
const look = [0.6, -0.5];
const SCENES = {};

// 1 — hook: frame one = a big conch shell with "ocean" squiggles coming out of its mouth
SCENES.hook = (t, T, B, E, dur) => {
  room(); shell(560, 800, 1.05, 1, T);
  waves(T, 760, 760, 940, 520, BLUEc, 1, 4, 22);
  MASR(T, t, { ev: [[0.5, "?"]], look, mouth: "o" });
};

// 2 — room: noise from all around (a fan, people talking) flows into the shell
SCENES.room = (t, T, B, E, dur) => {
  room(); shell(540, 820, 1.0, 1, T);
  const a = seg(t, 0.1, 0.5);
  waves(T, 160, 420, 440, 720, QUIETc, a); waves(T, 920, 420, 650, 720, QUIETc, a); waves(T, 160, 1180, 440, 900, QUIETc, a);
  plate("room noise", 540, 300, 50, INK, "center", seg(t, 0.3, 0.7), 900);
  MASR(T, t, { ev: [[0.8, "!"]], look, mouth: "o" });
};

// 3 — ring: flat room-noise spectrum in, peaked spectrum out (some pitches ring louder); a bottle beside for the analogy
SCENES.ring = (t, T, B, E, dur) => {
  room();
  shell(300, 640, 0.55, 1, T);
  spectrum(360, 820, 580, 300, 0.9, eio(seg(t, 0.8, 2.2)), seg(t, 0.2, 0.6), T, GOLDc);
  plate("some pitches ring louder", 540, 300, 48, GOLD, "center", seg(t, 1.6, 2.0), 900);
  const b = seg(t, 2.8, 3.2);
  if (b > 0.01) { rrect(780, 460, 90, 240, 30, [150, 210, 190], b, INK, 6); rrect(800, 380, 50, 100, 16, [150, 210, 190], b, INK, 6); arrow(700, 360, 790, 380, BLUEc, b, 6, 18); text("like a bottle", 820, 760, 38, INK, "center", 800, b); }
  MASR(T, t, { ev: [[2.0, "idea"]], look, mouth: "o" });
};

// 4 — quiet: a noisy cafe → loud output; a quiet room → a faint hush
SCENES.quiet = (t, T, B, E, dur) => {
  room();
  shell(300, 640, 0.55, 1, T);
  const q = seg(t, B(1) - 0.2, B(1) + 0.6), lvl = lerp(1.0, 0.18, q);
  waves(T, 120, 380, 240, 560, QUIETc, lerp(1, 0.15, q));
  spectrum(360, 820, 580, 300, lvl, 1, 1, T, mix(GOLDc, BLUEc, q));
  plate(q < 0.5 ? "noisy cafe: louder" : "quiet room: faint hush", 640, 300, 48, q < 0.5 ? GOLD : BLUE, "center", 1, 900);
  MASR(T, t, { ev: [[0.6, "!"], [B(1) + 0.8, "ok", "smile"]], look, mouth: "o" });
};

// 5 — end: an empty cup beside the shell, both with the same squiggles; then frame one
SCENES.end = (t, T, B, E, dur) => {
  room();
  const k = seg(t, dur - 1.5, dur - 1.1);
  shell(lerp(340, 560, k), lerp(760, 800, k), lerp(0.7, 1.05, k), 1, T);
  waves(T, lerp(500, 760, k), lerp(720, 760, k), lerp(640, 940, k), lerp(520, 520, k), BLUEc, 1, 4, 22);
  const ca = 1 - k;
  if (ca > 0.01) { g.save(); g.globalAlpha = ca; g.fillStyle = "#F2F5FB"; g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.moveTo(690, 640); g.lineTo(930, 640); g.lineTo(890, 960); g.lineTo(730, 960); g.closePath(); g.fill(); g.stroke(); g.restore(); waves(T, 810, 640, 860, 470, BLUEc, ca, 3, 16); }
  plate("any cup does it too", 540, 300, 50, GOLD, "center", win(t, 0.3, dur - 1.15, 0.3), 900);
  MASR(T, t, { ev: [[0.5, "ok", "grin"]], look, mouth: "o" });
};
