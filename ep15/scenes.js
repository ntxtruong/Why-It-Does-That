// Episode 15 (Short, 1080×1920, cut from ep 7) — Why do only your fingers wrinkle?
// Two fingertips hang into bath water: the one with a working nerve wrinkles, the one with a damaged nerve stays smooth
// (Lewis & Pickering 1936). A cross-section shows the proposed chain, hedged in the narration: nerve signal →
// fingertip blood vessels narrow → the pad loses a little volume → the skin on top folds. Pure functions of time.
// Safe zone (Shorts UI): key content above y = 1536 and left of x = 940.

const MAS = (T, o = {}) => mascot3(o.x ?? 150, o.y ?? 1560, o.s ?? 0.4, T, o);
const SKINc = [240, 205, 180], SKIN2c = [186, 128, 104], WATER = 820;
// a finger hanging down, tip at the bottom; w = wrinkle amount 0..1; nerve: 0 hidden, 1 intact, -1 damaged
function finger(cx, top, bot, w, a = 1, nerve = 0, pulse = -1) {
  if (a <= 0.01) return; const hw = 82;
  g.save(); g.globalAlpha = a;
  g.fillStyle = css(SKINc); g.strokeStyle = css(INKc, 0.85); g.lineWidth = 5;
  g.beginPath(); g.moveTo(cx - hw, top); g.lineTo(cx - hw, bot - hw); g.arc(cx, bot - hw, hw, Math.PI, 0, true); g.lineTo(cx + hw, top); g.fill(); g.stroke();
  // knuckle creases
  g.strokeStyle = css(SKIN2c); g.lineWidth = 4; [top + 120, top + 132].forEach(y => { g.beginPath(); g.moveTo(cx - 40, y); g.quadraticCurveTo(cx, y + 8, cx + 40, y); g.stroke(); });
  // wrinkles on the pad: wavy ridges that deepen with w
  if (w > 0.01) {
    g.save(); g.beginPath(); g.moveTo(cx - hw, top); g.lineTo(cx - hw, bot - hw); g.arc(cx, bot - hw, hw, Math.PI, 0, true); g.lineTo(cx + hw, top); g.clip();
    g.strokeStyle = css(SKIN2c, clamp(w * 1.4)); g.lineWidth = 4 + 5 * w;
    for (let j = 0; j < 8; j++) {
      const y0 = bot - 250 + j * 30; g.beginPath();
      for (let x = cx - hw; x <= cx + hw; x += 6) { const y = y0 + w * 13 * Math.sin(x * 0.11 + j * 1.7 + hash(j, 3) * 3); x === cx - hw ? g.moveTo(x, y) : g.lineTo(x, y); }
      g.stroke();
    }
    g.restore();
  }
  // the nerve inside the finger (drawn when asked): gold line, with a coral break when damaged
  if (nerve !== 0) {
    const na = Math.abs(nerve) > 0 ? 1 : 0;
    if (nerve > 0) line(cx, top, cx, bot - 110, GOLDc, 0.95 * na, 7);
    else { line(cx, top, cx, top + 230, GOLDc, 0.6, 7); line(cx, top + 330, cx, bot - 110, QUIETc, 0.5, 7, [10, 12]);
      line(cx - 26, top + 256, cx + 26, top + 304, CORALc, 1, 8); line(cx + 26, top + 256, cx - 26, top + 304, CORALc, 1, 8); }
    if (nerve > 0 && pulse >= 0) dot(cx, lerp(top, bot - 110, pulse % 1), 14, GOLDc, 1);
  }
  g.restore();
}
function water(t, a = 1) {
  if (a <= 0.01) return;
  const pts = [[0, H]]; for (let x = 0; x <= W; x += 12) pts.push([x, WATER + 8 * Math.sin(x * 0.02 - t * 1.6)]); pts.push([W, H]);
  poly(pts, null, a * 0.22, 0, true, BLUEc);
  const top = []; for (let x = 0; x <= W; x += 12) top.push([x, WATER + 8 * Math.sin(x * 0.02 - t * 1.6)]); poly(top, BLUEc, a * 0.9, 4);
}
// both fingers in the bath: left intact (wrinkles with wL), right damaged nerve (smooth)
function pair(t, wL, nerve = 0, a = 1) {
  finger(420, 380, 1150, wL, a, nerve ? 1 : 0); finger(720, 380, 1150, 0, a, nerve ? -1 : 0);
}
const SCENES = {};

// 1 — hook: first frame = two fingertips in water; one wrinkles, the other stays smooth
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette();
  pair(T, lerp(0.55, 1, seg(t, 0, 3))); water(T);
  plate("arms · back: smooth", 640, 1270, 46, INK, "center", win(t, B(1), B(1) + 2.2, 0.3), 800);
  plate("fingertips · toes: prunes", 640, 1270, 46, GOLD, "center", seg(t, B(1) + 2.3, B(1) + 2.7), 800);
  plate("wrinkly", 420, 720, 42, GOLD, "center", seg(t, 0.4, 0.8), 800); plate("smooth", 720, 720, 42, INK, "center", seg(t, 0.4, 0.8), 800);
  MASR(T, t, { ev: [[0.6, "?"], [B(1) + 2.4, "!"]],  look: [0.9, -0.7], mouth: "o" });
};

// 2 — clue: "soaks up water?" crossed out; 1930s: the finger with a damaged nerve did not wrinkle
SCENES.clue = (t, T, B, E, dur) => {
  clear(); vignette();
  const nv = seg(t, B(1) + 1.6, B(1) + 2.4);
  pair(T, 1, nv > 0.01 ? 1 : 0, 1); water(T);
  // the soaking idea, struck through
  const sk = win(t, 0.2, B(1) - 0.1, 0.3), st = seg(t, B(0) + 2.2, B(0) + 2.8);
  plate("just soaking up water?", 490, 300, 50, INK, "center", sk, 800);
  line(490 - 290 * st, 302, 490 + 290 * st, 298, CORALc, sk * st, 8);
  plate("1930s · Lewis & Pickering", 490, 300, 48, INK, "center", win(t, B(1), B(2) + 0.2, 0.3), 800);
  plate("wrinkly", 420, 720, 42, GOLD, "center", 1 - nv, 800); plate("smooth", 720, 720, 42, INK, "center", 1 - nv, 800);
  text("nerve OK", 420, 1240, 44, GOLD, "center", 800, nv);
  text("damaged nerve", 720, 1240, 44, CORAL, "center", 800, nv);
  plate("no nerve signal → no wrinkles", 490, 300, 46, GOLD, "center", seg(t, B(2) + 0.3, B(2) + 0.8), 800);
  MASR(T, t, { ev: [[B(0) + 2.4, "?"], [B(1) + 1.9, "!", "o"], [B(2) + 0.4, "idea", "grin"]],  look: [0.9, -0.6], mouth: t > B(2) ? "grin" : "o" });
};

// 3 — how: cross-section of a fingertip; nerve pulses, the blood vessel narrows, the pad shrinks, the skin folds
SCENES.how = (t, T, B, E, dur) => {
  clear(); vignette();
  const C = [500, 860], R = 330, nar = seg(t, B(0) + 2.0, B(0) + 3.6), fold = seg(t, B(1) + 0.6, B(1) + 2.6);
  // the pad (a big round fingertip seen in cross-section): skin outline with folds on the outside
  const pr = R * (1 - 0.06 * fold), pts = [];
  for (let k = 0; k <= 180; k++) { const th = k / 180 * TAU2; const rr = pr + fold * 16 * Math.sin(th * 18) * (th > Math.PI ? 1 : 0.35); pts.push([C[0] + rr * Math.cos(th), C[1] + rr * Math.sin(th)]); }
  poly(pts, INKc, 1, 5, true, SKINc);
  // the outer skin layer as a darker band
  const inner = []; for (let k = 0; k <= 180; k++) { const th = k / 180 * TAU2; inner.push([C[0] + (pr - 40) * Math.cos(th), C[1] + (pr - 40) * Math.sin(th)]); }
  poly(inner, SKIN2c, 0.8, 4, true);
  // bone, blood vessel, nerve
  dot(C[0], C[1] - 40, 90, [236, 228, 214], 1);
  const vr = lerp(30, 12, nar);
  rrect(C[0] - 230, C[1] + 120 - vr, 460, 2 * vr, vr, CORALc, 1);
  line(C[0] - 230, C[1] + 200, C[0] + 230, C[1] + 200, GOLDc, 0.95, 8);
  const pu = seg(t, 0.4, 2.2); if (pu > 0 && pu < 1) dot(lerp(C[0] - 230, C[0] + 230, pu), C[1] + 200, 16, GOLDc, 1);
  text("fingertip, cut across", 500, 470, 44, QUIET, "center", 700, 1);
  plate("seems to work like this", 500, 300, 46, INK, "center", win(t, 0.2, B(0) + 1.6, 0.3), 700);
  plate("nerve signal", 640, 1270, 46, GOLD, "center", win(t, 0.6, B(0) + 2.0, 0.3), 800);
  plate("blood vessel narrows", 640, 1270, 46, CORAL, "center", win(t, B(0) + 2.2, dur - 0.2, 0.3), 800);
  plate("pad loses a little volume → skin folds", 500, 300, 42, INK, "center", seg(t, B(1) + 0.8, B(1) + 1.3), 800);
  MASR(T, t, { ev: [[0.8, "!"], [B(1) + 1.2, "idea", "grin"]],  look: [0.9, -0.6], mouth: "o" });
};

// 4 — end: your nervous system; purpose still debated; back to the pair (loops to frame 1)
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette();
  pair(T, lerp(1, 0.55, seg(t, dur - 1.0, dur))); water(T);
  plate("your nervous system", 640, 1270, 50, GOLD, "center", win(t, 0.3, B(1), 0.3), 800);
  plate("why? still debated", 640, 1270, 48, INK, "center", win(t, B(1), dur - 1.0, 0.3), 800);
  MASR(T, t, { ev: [[0.4, "ok", "smile"], [B(1), "?"]],  look: [0.9, -0.7], mouth: "smile" });
};
