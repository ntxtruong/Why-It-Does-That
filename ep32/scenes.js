// Episode 32 (Short v3, 1080×1920): you can't really tickle yourself.
// Facts (claims.md): a self-produced touch is rated less tickly than the same touch from outside (Weiskrantz 1971;
// Blakemore, Wolpert & Frith 1998). The brain predicts the sensory result of its own movement and turns it down
// (Blakemore, Wolpert & Frith 2000). Blakemore, Frith & Wolpert 1999: people moved one hand; a robot stroked their other
// palm with soft foam; delays of 0, 100, 200, 300 ms; rated tickliness rose progressively from 0 to 200 ms.
// The tickle meter is an illustration of "less" and "more", not the study's rating scale.

const PX = 560, PY = 850;   // palm centre
function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 860, 80, 540, 860, 950);
  gr.addColorStop(0, "rgb(104,112,186)"); gr.addColorStop(0.62, "rgb(64,80,150)"); gr.addColorStop(1, "rgb(24,38,79)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// an open hand, palm up, fingers pointing up; s scales; twitch = small finger curl (reaction)
function palm(x, y, s = 1, twitch = 0, a = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
  const SK = "#F0CDB4", OUT = "#F2F5FB";
  const F = [[-120, -40, 300, -0.1], [-40, -70, 340, -0.03], [40, -70, 330, 0.03], [115, -45, 280, 0.1]];
  const shape = () => {
    g.beginPath(); g.ellipse(0, 60, 190, 200, 0, 0, TAU2);
    F.forEach(([fx, fy, L, r], i) => { const c = twitch * (0.1 + 0.05 * i); g.save(); g.translate(fx, fy); g.rotate(r + (i < 2 ? -c : c)); g.roundRect(-36, -L, 72, L + 40, 36); g.restore(); });
    g.save(); g.translate(-170, 110); g.rotate(-0.9 - twitch * 0.15); g.roundRect(-38, -230, 76, 240, 38); g.restore();
  };
  // outline first (stroke each part), then fill
  g.lineJoin = "round"; g.strokeStyle = OUT; g.lineWidth = 14;
  g.beginPath(); g.ellipse(0, 60, 190, 200, 0, 0, TAU2); g.stroke();
  F.forEach(([fx, fy, L, r], i) => { const c = twitch * (0.1 + 0.05 * i); g.save(); g.translate(fx, fy); g.rotate(r + (i < 2 ? -c : c)); g.beginPath(); g.roundRect(-36, -L, 72, L + 40, 36); g.stroke(); g.restore(); });
  g.save(); g.translate(-170, 110); g.rotate(-0.9 - twitch * 0.15); g.beginPath(); g.roundRect(-38, -230, 76, 240, 38); g.stroke(); g.restore();
  g.fillStyle = SK;
  g.beginPath(); g.ellipse(0, 60, 190, 200, 0, 0, TAU2); g.fill();
  F.forEach(([fx, fy, L, r], i) => { const c = twitch * (0.1 + 0.05 * i); g.save(); g.translate(fx, fy); g.rotate(r + (i < 2 ? -c : c)); g.beginPath(); g.roundRect(-36, -L, 72, L + 40, 36); g.fill(); g.strokeStyle = "rgba(170,120,100,0.5)"; g.lineWidth = 4; [-L * 0.33, -L * 0.66].forEach(yy => { g.beginPath(); g.moveTo(-22, yy + 20); g.lineTo(22, yy + 20); g.stroke(); }); g.restore(); });
  g.save(); g.translate(-170, 110); g.rotate(-0.9 - twitch * 0.15); g.beginPath(); g.roundRect(-38, -230, 76, 240, 38); g.fill(); g.restore();
  // palm creases
  g.strokeStyle = "rgba(170,120,100,0.55)"; g.lineWidth = 6; g.lineCap = "round";
  g.beginPath(); g.moveTo(-150, 20); g.quadraticCurveTo(-20, 60, 150, -10); g.stroke();
  g.beginPath(); g.moveTo(-140, 90); g.quadraticCurveTo(0, 110, 120, 60); g.stroke();
  g.beginPath(); g.moveTo(-110, 200); g.quadraticCurveTo(-120, 100, -60, 0); g.stroke();
  g.restore();
  void shape;
}
// a feather whose tip sweeps across (tx, ty); ang in radians
function feather(tx, ty, ang, a = 1, s = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(tx, ty); g.rotate(ang); g.scale(s, s);
  for (let i = 0; i < 26; i++) {
    const u = i / 25, y = -20 - u * 460, w = 70 * Math.sin(Math.PI * Math.min(1, u * 1.05 + 0.04)) + 10;
    g.strokeStyle = `rgba(242,245,251,${0.85 - 0.2 * hash(i, 2)})`; g.lineWidth = 9; g.lineCap = "round";
    g.beginPath(); g.moveTo(0, y); g.quadraticCurveTo(-w * 0.6, y - 10, -w, y - 46); g.stroke();
    g.beginPath(); g.moveTo(0, y); g.quadraticCurveTo(w * 0.6, y - 10, w, y - 46); g.stroke();
  }
  g.strokeStyle = "rgb(214,196,160)"; g.lineWidth = 8; g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -560); g.stroke();
  g.restore();
}
// the tickle meter: a horizontal bar, v in 0..1
function meter(v, a = 1, label = "tickle") {
  if (a <= 0.01) return;
  const x0 = 380, x1 = 920, y = 1272;
  text(label, x0, y - 54, 44, label === "tickle" ? QUIET : GOLD, "left", 900, a);
  rrect(x0, y - 18, x1 - x0, 36, 18, [24, 34, 70], a);
  const col = mix(BLUEc, GOLDc, clamp(v));
  rrect(x0, y - 18, Math.max(36, (x1 - x0) * clamp(v)), 36, 18, col, a);
}
// a small brain icon
function brain(x, y, s, a = 1, glow = 0) {
  if (a <= 0.01) return;
  if (glow > 0.01) soft(x, y, 180 * s, GOLDc, 0.4 * glow * a);
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
  g.fillStyle = "#F4A6B8"; g.strokeStyle = "#F2F5FB"; g.lineWidth = 8;
  g.beginPath(); g.ellipse(-48, 0, 70, 80, 0, 0, TAU2); g.ellipse(48, 0, 70, 80, 0, 0, TAU2); g.fill();
  g.beginPath(); g.ellipse(-48, 0, 70, 80, 0, 0, TAU2); g.stroke(); g.beginPath(); g.ellipse(48, 0, 70, 80, 0, 0, TAU2); g.stroke();
  g.fillStyle = "#F4A6B8"; g.fillRect(-60, -60, 120, 120);
  g.strokeStyle = "#C86E86"; g.lineWidth = 7; g.lineCap = "round";
  [[-80, -30, -30, -50, -10, -20], [-90, 20, -50, 0, -20, 30], [10, -40, 50, -60, 90, -30], [20, 20, 60, 0, 90, 30], [0, -70, 0, 0, 0, 70]].forEach(([a1, b1, c1, d1, e1, f1]) => { g.beginPath(); g.moveTo(a1, b1); g.quadraticCurveTo(c1, d1, e1, f1); g.stroke(); });
  g.restore();
}
const look = [0.6, -0.4];
const SCENES = {};
const sweep = T => 0.5 + 0.5 * Math.sin(T * 6.5);

// 1 — hook: frame one = an open palm and a feather brushing it, tagged "your own hand"; the meter stays low
SCENES.hook = (t, T, B, E, dur) => {
  room();
  palm(PX, PY, 1.15, 0.15 * Math.sin(T * 9) ** 2);
  feather(lerp(PX - 90, PX + 90, sweep(T)), PY + 20, 0.7 + 0.12 * Math.sin(T * 6.5));
  plate("your own touch", 700, 470, 48, GOLD, "center", 1, 900);
  meter(0.18 + 0.03 * Math.sin(T * 5));
  MASR(T, t, { ev: [[0.5, "?"]], look, mouth: "o" });
};

// 2 — predict: a prediction leaves the brain and reaches the palm before the feather does; then touch − prediction = little left
SCENES.predict = (t, T, B, E, dur) => {
  room();
  const k = seg(t, B(1) - 0.2, B(1) + 0.4);   // second beat: shrink the hand, show the subtraction
  palm(PX + 60 * k, PY + 210 * k, 1.15 - 0.4 * k, 0.05);
  const fx = lerp(PX + 380, PX, eio(seg(t, 0.6, 2.6)));   // the feather arrives late
  feather(lerp(fx - 60, fx + 60, sweep(T) * seg(t, 2.4, 2.8)) + 60 * k, PY + 20 + 140 * k, 0.7, 1 - k, 1 - 0.3 * k);
  brain(300, 470, 1, 1 - k, win(t, 0.3, 2.0, 0.4) * (1 - k));
  const pu = eio(seg(t, 0.5, 1.6)) * (1 - k);
  if (pu > 0.01) { line(370, 520, lerp(370, PX, pu), lerp(520, PY - 60, pu), BLUE, 1 - k, 8, [18, 16]); dot(lerp(370, PX, pu), lerp(520, PY - 60, pu), 18, BLUEc, 1 - k); }
  plate("prediction", 680, 520, 46, BLUE, "center", seg(t, 0.9, 1.3) * (1 - k), 900);
  // subtraction panel (beat 2)
  if (k > 0.01) {
    const y0 = 380, wave = (amp, y, col, a) => { const pts = []; for (let x = 120; x <= 960; x += 12) pts.push([x, y + amp * Math.sin(x * 0.045 + T * 6) * Math.exp(-Math.pow((x - 540) / 260, 2))]); poly(pts, col, a, 8); };
    text("touch", 120, y0 - 70, 42, GOLD, "left", 800, k); wave(60, y0, GOLD, k);
    text("− prediction", 120, y0 + 90, 42, BLUE, "left", 800, k); wave(52, y0 + 160, BLUE, k * seg(t, B(1) + 0.4, B(1) + 0.9));
    const left = 60 - 52 * seg(t, B(1) + 0.9, B(1) + 1.6);
    text("= what you feel", 120, y0 + 250, 42, CORAL, "left", 800, k * seg(t, B(1) + 0.9, B(1) + 1.2)); wave(left, y0 + 320, CORAL, k * seg(t, B(1) + 0.9, B(1) + 1.2));
  }
  meter(0.18 - 0.08 * seg(t, B(1) + 0.9, B(1) + 1.8) + 0.03 * Math.sin(T * 5));
  MASR(T, t, { ev: [[1.2, "!"], [B(1) + 1.4, "idea"]], look, mouth: "o" });
};

// 3 — robot: one hand pushes a handle; the robot strokes the other palm with foam; a delay dial turns to 0.2 s, the meter climbs
SCENES.robot = (t, T, B, E, dur) => {
  room();
  const d = eio(seg(t, B(1) + 0.3, B(1) + 2.0));          // 0 → 200 ms
  const delayS = 0.2 * d, ph = Math.sin((T) * 4.2), phR = Math.sin((T - delayS) * 4.2);
  // robot body
  rrect(300, 420, 480, 170, 34, [70, 86, 140], 1, INK, 6);
  text("robot", 540, 505, 50, INK, "center", 900);
  // left: the user's hand on a handle, moving left-right
  const hx = 230 + 40 * ph;
  line(300, 505, hx + 30, 505, QUIETc, 1, 14);
  dot(hx, 505, 62, [240, 205, 180], 1); g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.arc(hx, 505, 62, 0, TAU2); g.stroke();
  plate("your hand pushes", 250, 380, 44, INK, "center", seg(t, 0.4, 0.8), 800);
  // right: an arm down to the palm, foam tip stroking with the delayed phase
  palm(PX + 60, PY + 150, 0.85, 0.1 * Math.max(0, Math.sin(T * 9)) * (0.3 + d));
  const fx = PX + 60 + 90 * phR, fy = PY + 120;
  line(700, 590, fx, fy - 70, QUIETc, 1, 16);
  rrect(fx - 50, fy - 80, 100, 70, 24, [255, 236, 170], 1, INK, 4);
  plate("foam", fx + 130, fy - 50, 44, INK, "center", seg(t, 1.0, 1.4) * (1 - seg(t, B(1) - 0.3, B(1))), 800);
  plate("your other palm", 300, 800, 44, INK, "center", seg(t, 1.6, 2.0) * (1 - seg(t, B(1) - 0.3, B(1))), 800);
  // delay dial
  const da = seg(t, B(1) - 0.2, B(1) + 0.2);
  if (da > 0.01) {
    const cx = 860, cy = 720; dot(cx, cy, 80, PANELc, da); g.save(); g.globalAlpha = da; g.strokeStyle = GOLD; g.lineWidth = 12; g.lineCap = "round"; g.beginPath(); g.arc(cx, cy, 64, -Math.PI / 2, -Math.PI / 2 + TAU2 * d * 0.9); g.stroke(); g.restore();
    text(`${(delayS).toFixed(1)} s`, cx, cy, 44, INK, "center", 900, da); text("delay", cx, cy + 112, 40, QUIET, "center", 800, da);
  }
  meter(0.1 + 0.55 * d + 0.03 * Math.sin(T * 5), 1, d > 0.5 ? "tickle: more!" : "tickle");
  MASR(T, t, { ev: [[0.6, "?"], [B(1) + 1.8, "!", "grin"]], look, mouth: "o" });
};

// 4 — end: back to frame one (palm + feather); the prediction arrow returns, then the loop
SCENES.end = (t, T, B, E, dur) => {
  room();
  palm(PX, PY, 1.15, 0.15 * Math.sin(T * 9) ** 2);
  feather(lerp(PX - 90, PX + 90, sweep(T)), PY + 20, 0.7 + 0.12 * Math.sin(T * 6.5));
  const a = win(t, 0.2, dur - 1.15, 0.3);
  brain(250, 330, 1, a, a);
  plate("predicted = turned down", 650, 330, 46, BLUE, "center", a, 900);
  meter(0.18 + 0.03 * Math.sin(T * 5));
  MASR(T, t, { ev: [[0.6, "ok", "smile"]], look, mouth: "o" });
};
