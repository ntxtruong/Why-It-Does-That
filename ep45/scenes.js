// Episode 45 (Short v4, 1080×1920): stare at a blue banana, then white → a faint yellow banana (negative afterimage).
// Facts (claims.md): staring at a saturated colour lowers the response of the cone cells driven by it (with opponent
// colour channels downstream); on white the blue signal is weak relative to the others, so the afterimage of blue is
// yellow (Illusions Index, BrainFacts). Strength varies; ~10 s gives a faint afterimage for most people.
// No push-in and no dips in "stare" and "now": the picture must stay still on the retina.
window.NOPUSH = ["stare", "now", "end"]; window.NODIP = ["stare", "now"];
const CX = 540, CY = 880;            // the fixation dot, same place in every still scene
const BLUEB = [30, 84, 255];
const look = [0.7, -0.6];

// banana: a crescent around the fixation point, tips up; s = scale
function bananaPath(cx, cy, s) {
  g.beginPath();
  g.moveTo(cx - 400 * s, cy - 170 * s);                                   // left tip
  g.bezierCurveTo(cx - 330 * s, cy + 230 * s, cx + 300 * s, cy + 250 * s, cx + 420 * s, cy - 210 * s);   // outer (bottom) edge
  g.lineTo(cx + 380 * s, cy - 250 * s);                                   // right tip
  g.bezierCurveTo(cx + 210 * s, cy - 10 * s, cx - 220 * s, cy - 30 * s, cx - 360 * s, cy - 200 * s);    // inner (top) edge
  g.closePath();
}
function banana(cx, cy, s, fill, edge, lw = 10, a = 1, rot = -0.42) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.lineJoin = "round"; g.translate(cx, cy); g.rotate(rot); g.translate(-cx, -cy);
  bananaPath(cx, cy, s);
  if (fill) { g.fillStyle = css(fill); g.fill(); }
  if (edge) { g.strokeStyle = css(edge); g.lineWidth = lw; g.stroke(); }
  // stem at the right tip and a dark nub at the left tip
  if (fill) { g.fillStyle = css(edge || fill); g.beginPath(); g.roundRect(cx + 378 * s, cy - 300 * s, 34 * s, 70 * s, 10 * s); g.fill();
    g.beginPath(); g.arc(cx - 384 * s, cy - 186 * s, 16 * s, 0, TAU2); g.fill(); }
  else if (edge) { g.strokeStyle = css(edge); g.lineWidth = lw; g.beginPath(); g.roundRect(cx + 378 * s, cy - 300 * s, 34 * s, 70 * s, 10 * s); g.stroke(); }
  g.restore();
}
// the stimulus frame: light grey card, blue banana, black dot, a ring around the dot that drains over `p` (1 → 0)
function stimulus(p, T, t) {
  g.fillStyle = "#DDE1EA"; g.fillRect(0, 0, W, H);
  banana(CX, CY - 35, 1.12, BLUEB, [18, 50, 170], 12);
  dot(CX, CY, 16, [10, 12, 20]);
  if (p > 0.001) { g.save(); g.strokeStyle = "rgba(10,12,20,0.55)"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.arc(CX, CY, 46, -Math.PI / 2, -Math.PI / 2 + TAU2 * p); g.stroke(); g.restore(); }
}
const SCENES = {};

// 1 — stare: frame one is already moving (the ring drains), the instruction is on screen
SCENES.stare = (t, T, B, E, dur) => {
  stimulus(1 - t / dur, T, t);
  // a small seconds counter far from the dot (top band, under the caption)
  const left = Math.max(0, Math.ceil(dur - t));
  plate(left + " s", 900, 1500, 52, INK, "center", 1, 800);
  MASR(T, t, { ev: [[0.4, "!"]], look, s: 0.42, x: 150, y: 1600 });
};
// 2 — now: plain white, only a grey outline and the same dot. Nothing else moves for the first 2 s.
SCENES.now = (t, T, B, E, dur) => {
  g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, W, H);
  banana(CX, CY - 35, 1.12, null, [150, 154, 166], 6);
  dot(CX, CY, 16, [10, 12, 20]);
  const a = seg(t, B(1) - 0.1, B(1) + 0.3);
  // "nothing here is yellow": a colour picker swatch read off the screen, white
  if (a > 0.01) {  }
};
// 3 — why: brand scene. Three cone signals; the blue one is worn down by staring, so white reads as yellow.
SCENES.why = (t, T, B, E, dur) => {
  const gr = g.createRadialGradient(540, 860, 60, 540, 860, 1100);
  gr.addColorStop(0, "rgb(112,132,190)"); gr.addColorStop(0.6, "rgb(64,86,150)"); gr.addColorStop(1, "rgb(28,40,84)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // an eye on the left of the panel
  const ex = 300, ey = 560;
  g.save(); g.fillStyle = "#F4F6FB"; g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.ellipse(ex, ey, 190, 116, 0, 0, TAU2); g.fill(); g.stroke();
  dot(ex + 40, ey, 78, [70, 110, 170]); dot(ex + 40, ey, 38, [16, 18, 30]); dot(ex + 26, ey - 18, 12, [255, 255, 255]); g.restore();
  // light arriving: blue during beat 0, white during beat 1
  const w1 = seg(t, B(1) - 0.2, B(1) + 0.4);
  const lc = mix(BLUEB.map(v => v), [255, 255, 255], w1);
  for (let i = 0; i < 3; i++) { const yy = ey - 60 + i * 60, ph = ((t * 1.6 + i * 0.33) % 1); arrow(1010, yy, 530 + 40 * (1 - ph), yy, lc, 0.9, 14, 34); }
  plate(w1 < 0.5 ? "blue light" : "white light", 780, 700, 44, w1 < 0.5 ? BLUE : INK, "center", 1, 800);
  // three signal bars (cone types) under the eye
  const blueLvl = lerp(1, 0.32, seg(t, B(0) + 0.6, E(0))), x0 = 190, y0 = 1180, bw = 190, hmax = 360;
  const bars = [["red", [255, 96, 80], w1 > 0 ? lerp(0.2, 1, w1) : 0.2], ["green", [80, 210, 110], w1 > 0 ? lerp(0.2, 1, w1) : 0.2], ["blue", [70, 120, 255], w1 > 0.01 ? blueLvl * lerp(1, 1, w1) : blueLvl]];
  bars.forEach(([nm, c, v], i) => { const x = x0 + i * 240;
    rrect(x, y0 - hmax, bw, hmax, 18, [24, 34, 70], 0.9, INK, 4);
    rrect(x + 8, y0 - 8 - (hmax - 16) * v, bw - 16, (hmax - 16) * v, 12, c, 1);
    text(nm, x + bw / 2, y0 + 44, 42, INK, "center", 800); });
  plate("colour cells in your eye", 540, 1060 - 360 - 0, 0.01, QUIET, "center", 0, 800); plate("colour cells in your eye", 545, 1290, 40, INK, "center", 1, 800);
  // "tired" tag on the blue bar during beat 0
  const ta = win(t, B(0) + 1.2, E(1) + 1, 0.3);
  if (ta > 0.01) plate("worn down", 765, y0 - hmax - 50, 40, CORAL, "center", ta, 800);
  // result: the mix on white = yellow, filling the banana outline
  const ya = seg(t, B(1) + 1.4, B(1) + 2.2);
  if (ya > 0.01) { banana(700, 330, 0.36, [255, 222, 70], [200, 160, 30], 6, ya); plate("you see yellow", 700, 420, 52, GOLD, "center", ya, 900); }
  MASR(T, t, { ev: [], mouth: t > B(1) + 1.6 ? "grin" : undefined, look: [0.8, -0.4], s: 0.42, x: 150, y: 1600 });
};
// 4 — end: back to the stimulus (frame one), the loop
SCENES.end = (t, T, B, E, dur) => {
  stimulus(Math.min(1, t / 0.8), T, t);
  plate("try again", 900, 1500, 52, GOLD, "center", 1, 800);
  MASR(T, t, { ev: [[0.3, "ok", "smile"]], look, s: 0.42, x: 150, y: 1600 });
};
