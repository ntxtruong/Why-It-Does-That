// Episode 50 (long, 1920×1080): why lights and screens flicker on camera.
// Mechanism (claims.md): AC mains swings 50 or 60 times a second; light output follows power, which peaks on both
// halves of the swing, so poorly smoothed lights pulse 100 or 120 times a second; PWM dimming switches LEDs fully on
// and off. Eyes blend fast flicker (above ~80 Hz for most people). A rolling-shutter camera reads rows at different
// times, so the pulses become dark bands; the bands roll when the light's rhythm and the frame rate are out of step
// (100 Hz at 30 fps = 3⅓ pulses per frame) and stand still when in step (120 Hz at 30 fps = 4). Fix: an exposure of a
// whole number of pulses (1/50, 1/100 s on 50 Hz; 1/60, 1/120 s on 60 Hz); anti-banding does this automatically.
// Drawing note: every pulse on screen is slowed down a lot (about 1 pulse a second) and labelled "slowed down",
// both so it can be read and so nothing flashes in the 3–30 Hz band that matters for photosensitive viewers.
const M = (T, t, ev, o = {}) => MASR(T, t, { x: 190, y: 880, s: 0.36, look: [0.7, -0.4], mouth: "o", ev, ...o });
const LAMP = [255, 222, 160], DARK = [8, 11, 24];
const band = (v, ph, n = 3.3, d = 0.8) => 1 - d * (0.5 - 0.5 * Math.cos(TAU2 * (n * v - ph)));   // row brightness 0..1

// a desk lamp by a wall, drawn into the rect (x, y, w, h); bf(v) = brightness of the row at height v (0 top, 1 bottom)
function lampView(x, y, w, h, bf, glow = 1) {
  g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip();
  const gr = g.createLinearGradient(x, y, x, y + h); gr.addColorStop(0, "rgb(92,82,96)"); gr.addColorStop(1, "rgb(58,52,66)"); g.fillStyle = gr; g.fillRect(x, y, w, h);
  rrect(x, y + h * 0.78, w, h * 0.22, 0, [120, 92, 72], 1);                                     // desk
  const lx = x + w * 0.55, ly = y + h * 0.3, s = h / 400;
  soft(lx, ly + 60 * s, 300 * s, LAMP, 0.55 * glow);
  g.fillStyle = css(mix([90, 80, 70], [255, 236, 190], glow)); g.beginPath(); g.moveTo(lx - 120 * s, ly + 70 * s); g.lineTo(lx + 120 * s, ly + 70 * s); g.lineTo(lx + 230 * s, ly + 230 * s); g.lineTo(lx - 230 * s, ly + 230 * s); g.closePath(); g.globalAlpha = 0.25 * glow; g.fill(); g.globalAlpha = 1;   // light cone
  line(lx - 40 * s, ly, lx - 160 * s, y + h * 0.78, [60, 62, 74], 1, 14 * s); rrect(lx - 230 * s, y + h * 0.76, 140 * s, 20 * s, 6 * s, [60, 62, 74]);   // arm and base
  g.fillStyle = "#3a5a9a"; g.beginPath(); g.moveTo(lx - 70 * s, ly - 40 * s); g.lineTo(lx + 70 * s, ly - 40 * s); g.lineTo(lx + 120 * s, ly + 70 * s); g.lineTo(lx - 120 * s, ly + 70 * s); g.closePath(); g.fill();   // shade
  dot(lx, ly + 70 * s, 40 * s, mix([120, 110, 100], [255, 250, 230], glow), 1);
  rrect(x + w * 0.08, y + h * 0.2, w * 0.2, h * 0.3, 8, [150, 170, 200], 0.6, [40, 40, 50], 6);   // a picture frame
  if (bf) for (let r = 0; r < h; r += 6) { const k = 1 - bf(r / h); if (k > 0.01) { g.globalAlpha = 0.95 * k; g.fillStyle = css(DARK); g.fillRect(x, y + r, w, 6); } }
  g.globalAlpha = 1; g.restore();
}
// a landscape phone around the rect, with a red REC dot
function phoneL(x, y, w, h, fn, a = 1, T = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  g.fillStyle = "#0e1220"; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.roundRect(x - 30, y - 24, w + 60, h + 48, 40); g.fill(); g.stroke();
  g.beginPath(); g.roundRect(x, y, w, h, 18); g.clip(); fn(x, y, w, h);
  const rs = clamp(h / 300, 0.7, 1.4); dot(x + 40 * rs, y + 36 * rs, 14 * rs, CORALc, 0.6 + 0.4 * Math.abs(Math.sin(T * 2.4))); text("REC", x + 64 * rs, y + 37 * rs, 30 * rs, INK, "left", 800);
  g.restore();
}
// a light bulb icon with brightness b
function bulbIcon(x, y, s, b, a = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; soft(x, y, 170 * s, LAMP, 0.7 * b);
  g.fillStyle = css(mix([80, 84, 100], [255, 240, 200], b)); g.strokeStyle = INK; g.lineWidth = 5;
  g.beginPath(); g.arc(x, y, 60 * s, Math.PI * 0.8, Math.PI * 2.2); g.lineTo(x + 26 * s, y + 80 * s); g.lineTo(x - 26 * s, y + 80 * s); g.closePath(); g.fill(); g.stroke();
  rrect(x - 28 * s, y + 80 * s, 56 * s, 34 * s, 6, [170, 178, 196], 1);
  g.restore();
}
// a graph box: f(u) over u ∈ [0,1] → 0..1, drawn as a line inside (x, y, w, h)
function graph(x, y, w, h, f, col, a = 1, lw = 8, n = 220) {
  if (a <= 0.01) return; const P = [];
  for (let i = 0; i <= n; i++) { const u = i / n; P.push([x + u * w, y + h - h * clamp(f(u), -0.05, 1.05)]); }
  poly(P, col, a, lw);
}
function socket(x, y, s, a = 1) {
  if (a <= 0.01) return;
  rrect(x - 110 * s, y - 110 * s, 220 * s, 220 * s, 30 * s, [226, 230, 240], a, INK, 5);
  dot(x - 40 * s, y, 18 * s, [40, 44, 60], a); dot(x + 40 * s, y, 18 * s, [40, 44, 60], a);
}
const SCENES = {};

// 1 — hook. Frame one = the payoff image, full size: a phone filming a desk lamp, dark stripes rolling down its picture.
// Then the same lamp as your eyes see it (steady), the question, and a push toward the wall socket.
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const split = eio(seg(t, B(2) - 0.2, B(2) + 0.6));
  const px = lerp(400, 330, split), py = lerp(220, 250, split), pw = lerp(1160, 820, split), ph = lerp(640, 460, split);
  phoneL(px, py, pw, ph, (x, y, w, h) => lampView(x, y, w, h, v => band(v, T * 0.45)), 1, T);
  plate("camera", px + pw / 2, py + ph + 70, 52, CORAL, "center", seg(t, B(1), B(1) + 0.4), 900);
  if (split > 0.01) {
    g.save(); g.globalAlpha = split; g.beginPath(); g.roundRect(1270, 250, 560, 460, 24); g.clip(); lampView(1270, 250, 560, 460, null); g.restore();
    rrect(1270, 250, 560, 460, 24, null, split, INK, 5);
    plate("your eyes", 1550, 780, 52, INK, "center", seg(t, B(2), B(2) + 0.4), 900);
  }
  const sk = seg(t, B(4) + 1.0, dur);
  if (sk > 0.01) { g.globalAlpha = sk; g.fillStyle = BG; g.fillRect(0, 0, W, H); g.globalAlpha = 1; socket(1050, 480, lerp(0.6, 1.3, sk), sk); }
  M(T, t, [[B(1), "!"], [B(3), "?"], [B(4) + 0.6, "idea"]]);
};
// 2 — ac. The wall's voltage swings both ways; light output peaks on both halves: two humps per swing.
SCENES.ac = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  socket(450, 270, 0.85);
  text("voltage", 450, 420, 48, BLUE, "center", 800);
  const ph = t * 0.35;                                                   // slowed down: about one swing every 3 s
  const V = u => 0.5 + 0.45 * Math.sin(TAU2 * (2 * u - ph));
  const X0 = 640, X1 = 1800, wv = X1 - X0;
  line(X0, 280, X1, 280, QUIET, 0.35, 3, [10, 10]);
  graph(X0, 130, wv, 300, V, BLUE, 1, 10);
  for (let i = 0; i < 8; i++) dot(560 + i * 9 + 30 * Math.sin(TAU2 * ph), 270 + (i % 2) * 10 - 5, 6, BLUEc, 0.8);   // charges in the wire drift back and forth
  plate("slowed down", 1690, 60, 44, QUIET, "center", 0.95, 800);
  const ha = win(t, B(2), B(3) + 0.3, 0.4), fa = seg(t, B(1), B(1) + 0.5) * (1 - ha) * (1 - seg(t, B(4) - 0.3, B(4)));
  plate("50 Hz: Vietnam, Europe", 930, 500, 46, INK, "center", fa, 800);
  plate("60 Hz: United States", 1560, 500, 46, INK, "center", seg(t, B(1) + 2.6, B(1) + 3.0) * fa, 800);
  if (ha > 0.01) { plate("+ push one way", 930, 500, 46, BLUE, "center", ha, 800); plate("− push the other way", 1560, 500, 46, CORAL, "center", ha, 800); }
  // light output = power ∝ V², peaks on both halves of each swing
  const la = seg(t, B(3), B(3) + 0.6);
  if (la > 0.01) {
    rrect(X0 - 20, 580, wv + 40, 300, 18, PANELc, 0.85 * la);
    graph(X0, 600, wv, 260, u => Math.sin(TAU2 * (2 * u - ph)) ** 2, GOLD, la, 10);
    bulbIcon(450, 700, 1.1, Math.sin(TAU2 * (2 * 1 - ph)) ** 2, la);
    text("light", 450, 860, 48, GOLD, "center", 800, la);
  }
  plate("2 peaks per swing → 100 or 120 a second", 1220, 500, 50, GOLD, "center", seg(t, B(4), B(4) + 0.5), 900);
  M(T, t, [[B(1), "!"], [B(3) + 0.8, "idea"], [B(4) + 1.0, "ok"]]);
};
// 3 — lights. Filament (tiny ripple), LED + good driver (flat), LED + cheap driver (deep ripple); then PWM dimming.
SCENES.lights = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const ph = t * 0.4, P = u => Math.sin(TAU2 * (2 * u - ph)) ** 2;      // raw power, slowed down
  const pa = 1 - seg(t, B(4) - 0.3, B(4) + 0.2);
  if (pa > 0.01) {
    plate("slowed down", 1690, 60, 44, QUIET, "center", pa * 0.95, 800);
    const cols = [
      { x: 640, lab: "filament bulb", a: seg(t, 0.2, 0.7), f: u => 0.88 + 0.08 * P(u), raw: seg(t, B(0) + 1.2, B(0) + 1.8) },
      { x: 1120, lab: t < B(2) ? "bare LED" : "LED, good driver", a: seg(t, B(1), B(1) + 0.5), f: u => lerp(P(u), 0.9, seg(t, B(2) + 0.4, B(2) + 2.2)) },
      { x: 1600, lab: "LED, cheap driver", a: seg(t, B(3), B(3) + 0.5), f: u => 0.06 + 0.86 * (0.3 + 0.7 * P(u)) }
    ];
    cols.forEach(c => {
      const a = c.a * pa; if (a <= 0.01) return;
      bulbIcon(c.x, 220, 1.1, clamp(c.f(1)), a);
      rrect(c.x - 220, 400, 440, 300, 18, PANELc, 0.85 * a);
      line(c.x - 200, 680, c.x + 200, 680, QUIET, 0.3 * a, 2);
      if (c.raw) graph(c.x - 200, 420, 400, 260, P, QUIET, a * c.raw * 0.6, 4);
      graph(c.x - 200, 420, 400, 260, c.f, GOLD, a, 9);
      text(c.lab, c.x, 760, 48, INK, "center", 800, a);
    });
    plate("← power in (dashed)", 1130, 550, 46, QUIET, "center", seg(t, B(0) + 1.2, B(0) + 1.8) * (1 - seg(t, B(1) - 0.3, B(1))) * pa, 800);
    plate("barely dims", 640, 850, 48, GOLD, "center", seg(t, B(0) + 2.4, B(0) + 2.8) * pa, 900);
    plate("follows the power", 1120, 850, 48, CORAL, "center", seg(t, B(1) + 1.6, B(1) + 2.0) * (1 - seg(t, B(2) + 0.3, B(2) + 0.6)) * pa, 900);
    plate("steady", 1120, 850, 48, GOLD, "center", seg(t, B(2) + 2.0, B(2) + 2.4) * pa, 900);
    plate("almost to dark", 1600, 850, 48, CORAL, "center", seg(t, B(3) + 1.6, B(3) + 2.0) * pa, 900);
  }
  // PWM: a square wave whose on-time shrinks as the slider dims; the screen's average brightness follows
  const wa = seg(t, B(4), B(4) + 0.5);
  if (wa > 0.01) {
    const duty = lerp(0.85, 0.2, seg(t, B(5), B(5) + 4.0)), sq = u => ((u * 4 - t * 0.5) % 1 + 1) % 1 < duty ? 1 : 0;
    text("pulse width modulation", 380, 100, 60, GOLD, "left", 900, wa);
    rrect(360, 160, 980, 420, 18, PANELc, 0.85 * wa);
    graph(390, 200, 880, 340, sq, GOLD, wa, 9, 600);
    text("on", 1325, 210, 46, INK, "right", 800, wa * seg(t, B(5), B(5) + 0.4)); text("off", 1325, 530, 46, QUIET, "right", 800, wa * seg(t, B(5), B(5) + 0.4));
    const avA = wa * seg(t, B(5) + 1, B(5) + 1.5);
    line(390, 540 - 340 * duty, 1270, 540 - 340 * duty, BLUE, avA, 6, [16, 12]);
    plate("average = how bright it looks", 850, 650, 50, BLUE, "center", avA, 800);
    rrect(1460, 140, 300, 520, 40, "#0e1220", wa, INK, 6);
    rrect(1482, 168, 256, 464, 26, mix([30, 36, 60], [220, 230, 250], duty), wa);
    text("brightness", 1610, 710, 46, QUIET, "center", 700, wa);
    rrect(1480, 750, 260, 16, 8, [60, 70, 110], wa); dot(1480 + 260 * duty, 758, 20, INKc, wa);
    plate("many phone screens, some laptops, when dim", 900, 790, 48, INK, "center", seg(t, B(6), B(6) + 0.5), 800);
  }
  M(T, t, [[B(0) + 2.4, "ok"], [B(1) + 0.6, "!"], [B(2) + 2.0, "ok"], [B(3) + 1.6, "!", "wince"], [B(5) + 2, "idea"]]);
};
// 4 — eyes. Pulses go into an eye; what you see is one steady glow. Then a "visible flicker" curve against rate,
// falling to nothing near 80 a second. Then a darting eye sees a dotted trail (phantom array).
SCENES.eyes = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const eye = (x, y, s, a, dx = 0) => { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.fillStyle = INK; g.beginPath(); g.ellipse(x, y, 150 * s, 90 * s, 0, 0, TAU2); g.fill(); dot(x + dx, y, 60 * s, BLUEc, 1); dot(x + dx, y, 28 * s, DARK, 1); dot(x + dx - 12 * s, y - 14 * s, 9 * s, INKc, 1); g.restore(); };
  const a1 = 1 - seg(t, B(2) - 0.3, B(2) + 0.1);
  if (a1 > 0.01) {
    const ph = t * 0.6;
    text("light coming in", 1000, 170, 48, GOLD, "left", 800, a1);
    graph(1000, 220, 800, 320, u => Math.sin(TAU2 * (3 * u - ph)) ** 2, GOLD, a1, 9);
    arrow(980, 380, 860, 380, GOLD, a1 * 0.8, 7);
    eye(640, 380, 1.3, a1);
    const fa = seg(t, B(1) + 1.0, B(1) + 1.6) * a1;
    line(380, 660, 1780, 660, INK, fa, 12); text("what you see: one steady glow", 1080, 740, 50, INK, "center", 800, fa);
    soft(640, 380, 260, LAMP, 0.25 * fa);
  }
  const ga = seg(t, B(2) - 0.3, B(2) + 0.2) * (1 - seg(t, B(3) - 0.3, B(3) + 0.1));
  if (ga > 0.01) {
    const rate = lerp(10, 150, seg(t, B(2) + 0.3, B(2) + 4.5));
    rrect(380, 60, 1440, 800, 20, PANELc, 0.85 * ga);
    const X = r => 520 + 1200 * r / 150, Y = v => 700 - 480 * v, vis = r => clamp(1 - (r - 10) / 70) ** 1.6;
    line(X(0), 700, X(150), 700, QUIET, ga, 4); line(X(0), 700, X(0), 180, QUIET, ga, 4);
    text("flicker rate (times a second)", 1120, 820, 46, QUIET, "center", 700, ga);
    text("visible flicker", 540, 130, 46, QUIET, "left", 700, ga);
    const Pp = []; for (let r = 10; r <= 150; r += 1) Pp.push([X(r), Y(vis(r))]); poly(Pp, CORAL, ga, 9);
    [20, 50, 80, 120].forEach(r => text(r + "", X(r), 750, 44, QUIET, "center", 700, ga));
    line(X(80), 180, X(80), 700, GOLD, ga, 5, [12, 10]); text("about 80", X(80) + 16, 200, 50, GOLD, "left", 900, ga);
    dot(X(rate), Y(vis(rate)), 22, GOLDc, ga);
    plate(vis(rate) > 0.02 ? "you see it flicker" : "looks steady", X(Math.min(rate, 125)), Y(vis(rate)) - 80, 48, vis(rate) > 0.02 ? CORAL : INK, "center", ga, 800);
  }
  const sa = seg(t, B(3) - 0.1, B(3) + 0.4);
  if (sa > 0.01) {
    // a darting eye: a flickering lamp leaves a row of separate images instead of one smear
    const u = seg(t, B(3) + 0.6, B(3) + 2.0);
    eye(620, 450, 1.2, sa, lerp(-80, 80, u));
    for (let i = 0; i < 8; i++) { const ai = sa * seg(u, i / 8, i / 8 + 0.1); soft(980 + i * 105, 450, 70, LAMP, 0.5 * ai); dot(980 + i * 105, 450, 30, LAMP, ai); }
    plate("some people notice", 1350, 230, 56, INK, "center", sa, 900);
    plate("a dotted trail when your eyes dart", 1350, 660, 50, GOLD, "center", seg(t, B(3) + 0.8, B(3) + 1.0), 800);
  }
  M(T, t, [[B(0), "?"], [B(1) + 1.2, "ok"], [B(2) + 4.0, "!"], [B(3) + 1.6, "idea"]]);
};
// 5 — camera. A sensor read one row at a time; each row samples the light at its own moment; stacked rows = stripes.
SCENES.camera = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const R = 24, SX = 360, SY = 130, SW = 400, SH = 680, rh = SH / R;
  const NP = 3.3, f = v => 1 - 0.85 * (0.5 - 0.5 * Math.cos(TAU2 * NP * v));          // light vs read-out time (top→bottom)
  const WX = 880, WW = 220, wy = v => SY + v * SH, wx = v => WX + WW * f(v);
  const ea = 1 - seg(t, B(6) - 0.2, B(6) + 0.4);                                         // sensor and chart leave for the last beat
  const rowCol = b => mix([20, 22, 36], LAMP, b);
  if (ea > 0.01) {
    text("sensor", SX + SW / 2, SY - 40, 46, QUIET, "center", 800, ea);
    rrect(SX, SY, SW, SH, 12, [30, 40, 72], ea, INK, 4);
    // beat 0: the naive idea, the whole sensor exposed at once (rows all light up together)
    const all = seg(t, 0.8, 1.4) * (1 - seg(t, B(2) + 0.2, B(2) + 0.6));
    if (all > 0.01) rrect(SX + 4, SY + 4, SW - 8, SH - 8, 8, rowCol(0.75), all * ea);
    plate("all at once?", SX + SW / 2, SY + SH / 2 - 80, 50, INK, "center", seg(t, 1.0, 1.4) * (1 - seg(t, B(1), B(1) + 0.3)) * ea, 900);
    const xa = win(t, B(1), B(2) + 0.4, 0.3) * ea;
    if (xa > 0.01) { line(SX + 40, SY + 40, SX + SW - 40, SY + SH - 40, CORAL, xa, 14); plate("not all at once", SX + SW / 2, SY + SH / 2, 48, CORAL, "center", xa, 900); }
    // read-out sweeps down from beat 2, again and again: rows above the line show this sweep, below it the last one
    const rs = B(2) + 0.6, sweep = 3.6;
    if (t > rs) {
      const k = (t - rs) / sweep, v = k % 1, first = k < 1;
      for (let r = 0; r < R; r++) { const vr = (r + 0.5) / R; if (vr < v) rrect(SX + 4, SY + r * rh + 0.5, SW - 8, rh - 1, 2, rowCol(f(vr)), ea); else if (!first) rrect(SX + 4, SY + r * rh + 0.5, SW - 8, rh - 1, 2, rowCol(f(vr)), 0.55 * ea); }
      line(SX - 30, wy(v), SX + SW + 30, wy(v), BLUE, ea, 6);
      plate("one row at a time", SX + SW / 2, SY + SH + 55, 46, BLUE, "center", seg(t, rs, rs + 0.4) * (1 - seg(t, B(4) - 0.3, B(4))) * ea, 800);
      // the light over time, drawn downward beside the sensor, so each row lines up with the moment it was read
      const la = seg(t, B(3), B(3) + 0.5) * ea;
      if (la > 0.01) {
        text("light over time", WX, SY - 40, 46, GOLD, "left", 800, la);
        const Pp = []; for (let i = 0; i <= 200; i++) { const vv = i / 200; Pp.push([wx(vv), wy(vv)]); } poly(Pp, GOLD, la, 9);
        arrow(845, SY + 20, 845, SY + SH - 10, QUIET, la * 0.7, 4, 16);
        line(SX + SW, wy(v), wx(v), wy(v), BLUE, la * 0.7, 4, [10, 8]); dot(wx(v), wy(v), 14, BLUEc, la);   // this row's moment on the light curve
      }
    }
    // peak and dip rows tied to their point on the curve
    const ca = seg(t, B(4), B(4) + 0.5) * ea;
    if (ca > 0.01) {
      [[0.303, GOLD], [0.455, CORAL]].forEach(([vv, c], i) => { const a = ca * seg(t, B(4) + i * 1.6, B(4) + i * 1.6 + 0.4); line(SX + SW - 20, wy(vv), wx(vv), wy(vv), c, a, 6, [12, 8]); dot(wx(vv), wy(vv), 16, c, a); rrect(SX + 2, wy(vv) - rh / 2, SW - 4, rh, 3, null, a, c, 5); });
      plate("peak → bright row", 1450, 200, 50, GOLD, "center", ca, 900);
      plate("dip → dark row", 1450, 300, 50, CORAL, "center", seg(t, B(4) + 1.6, B(4) + 2.0) * ea, 900);
    }
    const pa2 = seg(t, B(5), B(5) + 0.6) * ea;
    if (pa2 > 0.01) { g.save(); g.globalAlpha = pa2; g.beginPath(); g.roundRect(1180, 400, 600, 360, 16); g.clip(); lampView(1180, 400, 600, 360, v => band(v, 0, NP, 0.85)); g.restore(); rrect(1180, 400, 600, 360, 16, null, pa2, INK, 4); text("the picture", 1480, 810, 46, INK, "center", 800, pa2); }
  }
  // last beat: the camera's picture next to what your eyes see
  const la2 = seg(t, B(6) - 0.2, B(6) + 0.4);
  if (la2 > 0.01) {
    phoneL(380, 230, 640, 400, (x, y, w, h) => lampView(x, y, w, h, v => band(v, T * 0.45)), la2, T);
    g.save(); g.globalAlpha = la2; g.beginPath(); g.roundRect(1160, 206, 620, 448, 24); g.clip(); lampView(1160, 206, 620, 448, null); g.restore(); rrect(1160, 206, 620, 448, 24, null, la2, INK, 5);
    plate("camera: row by row", 700, 740, 50, CORAL, "center", la2, 900); plate("your eyes: all at once", 1470, 740, 50, INK, "center", la2, 900);
  }
  M(T, t, [[B(1), "?"], [B(3) + 0.6, "!"], [B(5) + 0.8, "idea"], [B(6) + 0.6, "ok"]]);
};
// 6 — roll. Light pulses on a timeline, with a frame starting every 1/30 s. 100/s → 3⅓ pulses a frame: each frame
// starts a third of a pulse later, so the stripes shift down a third of a stripe per frame. 120/s → exactly 4: almost still.
SCENES.roll = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const is120 = seg(t, B(5) - 0.2, B(5) + 0.3), NP = lerp(10 / 3, 4, is120);
  // opening question: a big viewfinder with the stripes rolling (before the timeline)
  const qa = 1 - seg(t, B(1) - 0.3, B(1) + 0.2);
  if (qa > 0.01) { phoneL(460, 150, 1000, 560, (x, y, w, h) => lampView(x, y, w, h, v => band(v, T * 0.45)), qa, T); plate("why do they move?", 960, 800, 56, CORAL, "center", qa * seg(t, 0.4, 0.8), 900); }
  const X0 = 420, X1 = 1800, frames = 3, fw = (X1 - X0) / frames;
  const ta = seg(t, B(1) - 0.1, B(1) + 0.5);
  if (ta > 0.01) {
    text(is120 > 0.5 ? "120 pulses a second" : "100 pulses a second", X0, 80, 52, GOLD, "left", 900, ta);
    text("30 frames a second", X1, 80, 52, BLUE, "right", 900, ta);
    rrect(X0 - 20, 130, X1 - X0 + 40, 230, 16, PANELc, 0.85 * ta);
    const wave = u => 0.5 + 0.5 * Math.cos(TAU2 * u * frames * NP);                       // a pulse peak at the start of frame 1
    graph(X0, 150, X1 - X0, 190, wave, GOLD, ta, 7, 600);
    for (let k = 0; k <= frames; k++) {
      const x = X0 + k * fw; line(x, 120, x, 380, BLUE, ta, 7);
      if (k < frames) text("frame " + (k + 1), x + 18, 410, 46, BLUE, "left", 800, ta);
      // where in the pulse each frame starts: a dot on the curve, a third of a pulse later each time (100/s)
      if (k < frames) { const u = k / frames; dot(x, 150 + 190 * (1 - wave(u)), 16, k ? CORALc : GOLDc, ta * seg(t, B(3), B(3) + 0.4)); }
      if (k > 0 && k < frames) plate("+⅓ pulse later", x + 150, 480, 46, CORAL, "center", ta * (1 - is120) * seg(t, B(3) + 0.3 * k, B(3) + 0.3 * k + 0.4), 900);
    }
    plate(is120 > 0.5 ? "exactly 4 per frame" : "3⅓ pulses per frame", 1110, 480, 50, INK, "center", seg(t, B(2), B(2) + 0.5) * (1 - seg(t, B(3) - 0.3, B(3))) + is120, 900);
  }
  // three frames side by side, each with its stripes offset by its start phase
  const fa = seg(t, B(3), B(3) + 0.5) * (1 - seg(t, B(4) - 0.3, B(4)));
  for (let k = 0; k < frames; k++) {
    const ph = (k * NP) % 1, x = 420 + k * 470;
    if (fa > 0.01) { g.save(); g.globalAlpha = fa; g.beginPath(); g.roundRect(x, 560, 430, 250, 12); g.clip(); lampView(x, 560, 430, 250, v => band(v, ph, 3.3, 0.8)); g.restore(); rrect(x, 560, 430, 250, 12, null, fa, INK, 3); text("frame " + (k + 1), x + 215, 850, 46, BLUE, "center", 800, fa); }
  }
  // then one viewfinder: the stripes roll (100/s), or almost stand still (120/s); the drift is slowed down for reading
  const va = seg(t, B(4) - 0.2, B(4) + 0.3);
  if (va > 0.01) {
    const p100 = (t - B(4)) * 0.55, p0 = (B(5) - B(4)) * 0.55, ph = is120 > 0.5 ? p0 + (t - B(5)) * 0.03 : p100;
    phoneL(440, 580, 560, 290, (x, y, w, h) => lampView(x, y, w, h, v => band(v, ph)), va, T);
    const wa = va * (1 - is120), wx = 1480, wy = 700, ang = -ph * 2.1;                     // the wagon wheel from episode 3
    if (wa > 0.01) { g.save(); g.globalAlpha = wa; g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.arc(wx, wy, 95, 0, TAU2); g.stroke(); for (let i = 0; i < 6; i++) { const a = ang + i * Math.PI / 3; line(wx, wy, wx + 95 * Math.cos(a), wy + 95 * Math.sin(a), INK, wa, 6); } g.restore(); text("like the backwards wheel", wx, 855, 46, QUIET, "center", 800, wa); }
    plate(is120 > 0.5 ? "stripes almost still" : "stripes roll", 1480, 580, 54, is120 > 0.5 ? GOLD : CORAL, "center", va, 900);
  }
  M(T, t, [[B(0), "?"], [B(3) + 1.2, "!"], [B(4) + 1.0, "idea"], [B(5) + 2.0, "ok"]]);
};
// 7 — fix. The light wave with each row's exposure window. Short windows catch different amounts (bright/dark rows);
// a window exactly one pulse long holds the same amount for every row. Then the 50/60 Hz table and anti-banding.
SCENES.fix = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const ta = 1 - seg(t, B(1) - 0.3, B(1) + 0.2);
  const X0 = 420, X1 = 1420, pw = (X1 - X0) / 5, f = x => 0.5 - 0.5 * Math.cos(TAU2 * (x - X0) / pw);   // 5 pulses across
  if (ta > 0.01) {
    rrect(X0 - 20, 120, X1 - X0 + 40, 250, 16, PANELc, 0.85 * ta);
    graph(X0, 140, X1 - X0, 210, u => f(X0 + u * (X1 - X0)), GOLD, ta, 8, 400);
    text("light", X0, 80, 48, GOLD, "left", 800, ta);
    text("each row", 1680, 80, 48, QUIET, "center", 800, ta);
    const wk = eio(seg(t, B(0) + 0.5, E(0))), ww = lerp(pw * 0.12, pw, wk);   // window grows to one whole pulse
    for (let r = 0; r < 6; r++) {
      const x0 = X0 + r * pw * 0.55, y = 430 + r * 66;
      let s = 0; for (let i = 0; i < 40; i++) s += f(x0 + (i + 0.5) / 40 * ww); const b = s / 40;   // light collected = average over the window
      rrect(x0, y - 22, ww, 44, 8, BLUEc, 0.5 * ta); line(x0, 360, x0, y - 22, BLUE, 0.25 * ta, 2);
      line(x0 + ww + 8, y, 1550, y, QUIET, 0.5 * ta, 3, [8, 8]);                                  // this row's window → this row's brightness
      rrect(1560, y - 26, 240, 52, 8, mix([20, 22, 36], LAMP, b), ta, INK, 2);
    }
    plate(wk < 0.95 ? "short exposure: rows differ" : "whole pulses: every row equal", 980, 845, 50, wk < 0.95 ? CORAL : GOLD, "center", ta * seg(t, 0.4, 0.8), 900);
  }
  const tb = seg(t, B(1) - 0.2, B(1) + 0.3) * (1 - seg(t, B(4) - 0.3, B(4) + 0.2));
  if (tb > 0.01) {
    rrect(440, 120, 1340, 460, 22, PANELc, 0.9 * tb);
    text("power", 520, 200, 48, QUIET, "left", 800, tb); text("shutter (pro mode)", 1000, 200, 48, QUIET, "left", 800, tb);
    text("50 Hz", 520, 330, 72, INK, "left", 900, tb); text("1/50 s  or  1/100 s", 1000, 330, 72, GOLD, "left", 900, tb);
    const sa = seg(t, B(2), B(2) + 0.5) * tb;
    text("60 Hz", 520, 480, 72, INK, "left", 900, sa); text("1/60 s  or  1/120 s", 1000, 480, 72, GOLD, "left", 900, sa);
    const pa = seg(t, B(3), B(3) + 0.5) * tb;
    if (pa > 0.01) { phoneL(800, 640, 380, 210, (x, y, w, h) => lampView(x, y, w, h, v => band(v, T * 0.45, 3.3, 0.85 * (1 - seg(t, B(3) + 0.4, B(3) + 2.4)))), pa, T); plate("stripes fade", 1460, 745, 50, GOLD, "center", seg(t, B(3) + 1.6, B(3) + 2.0) * tb, 900); }
  }
  const ma = seg(t, B(4) - 0.1, B(4) + 0.4);
  if (ma > 0.01) {
    rrect(660, 90, 700, 760, 40, "#0e1220", ma, INK, 6);
    text("Camera settings", 1010, 180, 52, INK, "center", 900, ma);
    text("Anti-banding", 730, 300, 50, INK, "left", 800, ma);
    ["Auto", "50 Hz", "60 Hz", "Off"].forEach((s, i) => { const y = 410 + i * 100; text(s, 780, y, 48, i === 0 ? GOLD : QUIET, "left", 800, ma); dot(1270, y, i === 0 ? 20 : 16, i === 0 ? GOLDc : QUIETc, ma * (i === 0 ? 1 : 0.4)); });
  }
  M(T, t, [[E(0) - 0.4, "ok"], [B(3) + 2.0, "ok", "grin"], [B(4) + 0.6, "idea"]]);
};
// 8 — payoff. Back to the opening shot (bands + steady eyes view), then the end card on navy (right two thirds free).
SCENES.payoff = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const endK = seg(t, E(2) + 0.4, E(2) + 1.4);
  if (endK < 1) {
    const a = 1 - endK;
    phoneL(330, 250, 820, 460, (x, y, w, h) => lampView(x, y, w, h, v => band(v, T * 0.45)), a, T);
    g.save(); g.globalAlpha = a; g.beginPath(); g.roundRect(1270, 250, 560, 460, 24); g.clip(); lampView(1270, 250, 560, 460, null); g.restore();
    rrect(1270, 250, 560, 460, 24, null, a, INK, 5);
    plate("camera", 740, 800, 52, CORAL, "center", a, 900); plate("your eyes", 1550, 780, 52, INK, "center", a, 900);
    plate("the light's real rhythm", 1080, 130, 60, GOLD, "center", seg(t, B(1), B(1) + 0.5) * a, 900);
  }
  M(T, t, [[B(0) + 0.4, "idea"], [B(1) + 0.6, "ok", "grin"], [E(2) + 1.6, "!", "smile"]]);
};
