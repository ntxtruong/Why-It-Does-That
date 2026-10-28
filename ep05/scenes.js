// Episode 5 — How do headphones cancel noise with more noise?
// Pure functions of time. Waves are closed-form sines; nothing is integrated.
// Colours: noise = coral, anti-noise = blue, their sum = gold (a flat gold line = quiet).

// ---------- air as pressure dots ----------
// columns of dots between x0..x1; a wave travelling right with wavelength lam (px), phase ph (rad), amplitude amp (px of displacement)
const AIRD = Array.from({ length: 1400 }, (_, i) => ({ u: hash(i, 1), v: hash(i, 2), r: 3 + hash(i, 3) * 2.2 }));
function air(x0, x1, y0, y1, lam, ph, amp, col, a = 1, n = 1400) {
  if (a <= 0.01) return;
  for (let i = 0; i < n; i++) { const d = AIRD[i], bx = x0 + d.u * (x1 - x0), y = y0 + d.v * (y1 - y0); const x = bx - amp * Math.sin(TAU2 * bx / lam - ph); dot(x, y, d.r, col, a * 0.85); }
}
// pressure at x for a rightward wave (squeeze positive)
const pres = (x, lam, ph) => Math.cos(TAU2 * x / lam - ph);
// one oscilloscope trace: y = yc - A * f(x)
function trace(x0, x1, yc, A, f, col, a = 1, lw = 7) { if (a <= 0.01) return; const pts = []; for (let x = x0; x <= x1; x += 5) pts.push([x, yc - A * f(x)]); poly(pts, col, a, lw); }
// the three stacked traces: noise, anti-noise (with a delay in cycles), sum
function scope(t, x0, x1, y, o = {}) {
  const lam = o.lam || 420, sp = o.speed || 1.3, A = o.A || 60, del = o.delay || 0, ag = o.anti ?? 1, a = o.a ?? 1, gap = o.gap || 150;
  const ph = t * sp * TAU2;
  const n = x => Math.sin(TAU2 * x / lam - ph), m = x => -ag * Math.sin(TAU2 * x / lam - ph - TAU2 * del);
  rrect(x0 - 40, y - A - 50, x1 - x0 + 80, gap * 2 + 2 * A + 100, 24, PANELc, a * 0.85);
  line(x0, y, x1, y, QUIETc, a * 0.25, 2); line(x0, y + gap, x1, y + gap, QUIETc, a * 0.25, 2); line(x0, y + 2 * gap, x1, y + 2 * gap, QUIETc, a * 0.25, 2);
  trace(x0, x1, y, A, n, CORALc, a); trace(x0, x1, y + gap, A, m, BLUEc, a * clamp(ag * 3)); trace(x0, x1, y + 2 * gap, A, x => n(x) + m(x), GOLDc, a, 8);
  if (o.labels !== false) { text("noise", x0 - 60, y, 40, CORAL, "right", 700, a); text("anti-noise", x0 - 60, y + gap, 40, BLUE, "right", 700, a * clamp(ag * 3)); text("what you hear", x0 - 60, y + 2 * gap, 40, GOLD, "right", 700, a); }
}
// a head in profile facing left, with an over-ear headphone; cx, cy = centre of the ear
function head(cx, cy, s, a = 1, phones = 1) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s);
  g.fillStyle = "#f6e3d3"; g.beginPath(); g.ellipse(-60, -40, 230, 260, 0, 0, TAU2); g.fill();          // head
  g.fillStyle = "#15161d"; g.beginPath(); g.ellipse(-20, -150, 240, 170, 0.15, Math.PI, 2 * Math.PI); g.fill();   // hair
  g.fillStyle = "#f6e3d3"; g.beginPath(); g.moveTo(-285, -30); g.lineTo(-330, 40); g.lineTo(-280, 50); g.closePath(); g.fill();   // nose
  g.fillStyle = "#1b1e2c"; g.beginPath(); g.ellipse(-205, -20, 14, 20, 0, 0, TAU2); g.fill();                // eye
  g.strokeStyle = "#7a4a45"; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(-270, 110); g.quadraticCurveTo(-245, 125, -225, 110); g.stroke();   // mouth
  g.fillStyle = "#e9cdb9"; g.beginPath(); g.ellipse(20, 0, 34, 52, 0, 0, TAU2); g.fill();                // ear
  if (phones > 0.01) {
    g.globalAlpha = a * phones; g.strokeStyle = "#3a4056"; g.lineWidth = 34; g.lineCap = "round"; g.beginPath(); g.arc(-20, -40, 270, -2.6, -0.35); g.stroke();
    g.fillStyle = "#2a2f40"; g.strokeStyle = css(INKc); g.lineWidth = 8; g.beginPath(); g.roundRect(-40, -120, 130, 240, 50); g.fill(); g.stroke();
  }
  g.restore();
}
// cut-away ear cup (big, centred): outer mic, chip, speaker, inner mic; hi = which part is highlighted
function cup(cx, cy, s, a, hi, t) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s);
  g.fillStyle = css(PANELc); g.strokeStyle = css(QUIETc); g.lineWidth = 6; g.beginPath(); g.roundRect(-260, -300, 420, 600, 160); g.fill(); g.stroke();
  g.fillStyle = "#2a3a6e"; g.beginPath(); g.roundRect(120, -260, 90, 520, 45); g.fill();                  // padding
  const part = (k, x, y, w, h, lab, col) => { const on = hi === k; g.fillStyle = css(on ? col : QUIETc, on ? 1 : 0.6); g.beginPath(); g.roundRect(x, y, w, h, 14); g.fill(); g.restore(); text(lab, cx + (x + w / 2) * s, cy + (y - 34) * s, 40, on ? col : QUIET, "center", 700, a); g.save(); g.globalAlpha = a; g.translate(cx, cy); g.scale(s, s); };
  part(1, -300, -40, 60, 80, "outer mic", CORAL); part(2, -170, -60, 120, 120, "chip", GOLD); part(3, 10, -110, 70, 220, "speaker", BLUE); part(4, 100, 150, 50, 60, "inner mic", BLUE);
  g.restore();
  // signal path pulses
  if (hi >= 2) { const u = (t * 0.9) % 1; dot(cx + lerp(-240, -110, u) * s, cy, 10 * s, GOLDc, a); }
  if (hi >= 3) { const u = (t * 0.9 + 0.5) % 1; dot(cx + lerp(-50, 10, u) * s, cy, 10 * s, GOLDc, a); }
}
const MAS = (x, T, o = {}) => mascot(x, o.y ?? 900, o.s ?? 0.3, T, o);
// headphones on the mascot: drawn over it
function masPhones(x, yFeet, s, a = 1) { const bob = 0; const cx = x, cy = yFeet - 470 * s; g.save(); g.globalAlpha = a; g.strokeStyle = "#3a4056"; g.lineWidth = 28 * s; g.lineCap = "round"; g.beginPath(); g.arc(cx, cy, 225 * s, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); [-1, 1].forEach(sd => rrect(cx + sd * 215 * s - 32 * s, cy - 60 * s, 64 * s, 120 * s, 26 * s, [42, 47, 64], a)); g.restore(); }

const SCENES = {};

// 1 — hook: engine ripples reach a head, the button, quiet; "a wall?" crumbles
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette();
  const on = seg(t, B(1) + 2.2, B(1) + 3.2);
  // engine on the left, ripples to the right
  rrect(60, 380, 220, 120, 60, [58, 72, 120], 1); rrect(40, 420, 60, 40, 12, QUIETc, 1); text("engine", 170, 560, 40, QUIET, "center", 600, win(t, 1, B(3), 0.5));
  for (let q = 0; q < 9; q++) { const r = ((t * 220 + q * 180) % 1620); const fade = r > 1250 ? lerp(1, 1 - on * 0.9, seg(r, 1250, 1350)) : 1; g.save(); g.globalAlpha = 0.6 * (1 - r / 1700) * fade; g.strokeStyle = css(CORALc); g.lineWidth = 8; g.beginPath(); g.arc(170, 440, r, -0.6, 0.6); g.stroke(); g.restore(); }
  const hk = 1 - seg(t, B(3) - 0.3, B(3) + 0.5);
  head(1420, 540, 0.9, hk, 1);
  if (on > 0 && hk > 0) { for (let q = 0; q < 3; q++) { const r = ((t * 140 + q * 45) % 130); g.save(); g.globalAlpha = hk * on * (1 - r / 130) * 0.8; g.strokeStyle = css(BLUEc); g.lineWidth = 6; g.beginPath(); g.arc(1430, 540, 40 + r, Math.PI * 0.6, Math.PI * 1.4); g.stroke(); g.restore(); } }
  // button press
  const bp = win(t, B(1) + 1.2, B(2) + 3, 0.3); if (bp > 0) { const press = 1 - 0.12 * win(t, B(1) + 2.0, B(1) + 2.4, 0.1); rrect(1620 - 46 * press, 200 - 46 * press, 92 * press, 92 * press, 46, on > 0.5 ? GOLDc : QUIETc, bp); text("ANC", 1620, 200, 40, BG, "center", 800, bp); }
  plate("They started making sound", 1420, 820, 50, BLUE, "center", win(t, B(2) + 2, B(3), 0.4) * hk);
  // the wall idea, crumbling into dots
  const wl = win(t, B(3) - 0.2, B(5), 0.4), crum = seg(t, B(4), B(4) + 1.6);
  if (wl > 0) {
    for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) { const i = r * 4 + c, fall = crum * (200 + hash(i, 4) * 500); rrect(1240 + c * 90 + (r % 2) * 45 + (hash(i, 5) - 0.5) * crum * 200, 200 + r * 70 + fall, 84, 62, 8, CORALc, wl * (1 - crum * 0.9)); }
    plate("A wall?", 1440, 140, 64, CORAL, "center", wl * (1 - crum));
    plate("It fights sound with sound", 1440, 140, 60, GOLD, "center", win(t, B(4) + 1, B(5), 0.4));
  }
  // the promise: plane drone vs a voice
  const pr = win(t, B(5), dur, 0.4); if (pr > 0) { plate("plane drone: tamed", 1380, 300, 52, GOLD, "center", pr); plate("voice next to you: barely", 1380, 420, 52, CORAL, "center", win(t, B(5) + 3.2, dur, 0.4)); }
  MAS(1820, T, { s: 0.26, look: [-0.8, 0], mouth: on > 0.5 && t < B(3) ? "grin" : t > B(4) ? "o" : "smile" }); masPhones(1820, 900 + Math.sin(T * 2.1) * 4.3, 0.26, 1);
};

// 2 — what sound is: pressure dots, eardrum, then the trace
SCENES.wave = (t, T, B, E, dur) => {
  clear(); vignette();
  const lam = 480, ph = t * 1.2 * TAU2 * 0.5, toTrace = seg(t, B(3) - 0.3, B(3) + 1.2);
  air(140, 1500, 200, 760, lam, ph, 34, BLUEc, 1 - toTrace * 0.7);
  // eardrum on the right: a membrane pushed in and out by the pressure at x = 1560
  const p = pres(1560, lam, ph), ex = 1600 + 26 * p * seg(t, B(2) - 0.5, B(2) + 0.5);
  g.save(); g.strokeStyle = css(INKc); g.lineWidth = 10; g.beginPath(); g.moveTo(1600, 300); g.quadraticCurveTo(ex + 30, 480, 1600, 660); g.stroke(); g.restore();
  text("eardrum", 1640, 250, 42, INK, "left", 700, win(t, B(2), B(3) + 0.5, 0.4));
  // squeeze / stretch labels following the crests
  const lab = win(t, B(1) + 2.5, B(3), 0.4); if (lab > 0) { const xs = ((ph / TAU2) * lam) % lam; const xq = 140 + ((xs + 300) % lam) + lam; text("squeeze", xq, 170, 44, CORAL, "center", 800, lab); text("stretch", xq + lam / 2 > 1450 ? xq - lam / 2 : xq + lam / 2, 170, 44, BLUE, "center", 700, lab); }
  if (toTrace > 0) {
    trace(140, 1500, 480, 150 * toTrace, x => pres(x, lam, ph), CORALc, toTrace, 9);
    text("high = squeeze", 160, 300, 44, CORAL, "left", 700, win(t, B(3) + 1.5, B(4), 0.4)); text("low = stretch", 160, 680, 44, BLUE, "left", 700, win(t, B(3) + 2.5, B(4), 0.4));
    plate("height → loudness", 800, 120, 52, INK, "center", win(t, B(4), B(5), 0.4)); plate("repeats → pitch", 800, 820, 52, INK, "center", win(t, B(4) + 2.2, B(5), 0.4));
    plate("engine hum ≈ 100 per second · whistle: a few thousand", 840, 120, 48, GOLD, "center", win(t, B(5), dur, 0.4));
  }
  MAS(1800, T, { s: 0.26, look: [-0.7, 0], mouth: t > B(2) && t < B(3) ? "o" : "smile" }); masPhones(1800, 900 + Math.sin(T * 2.1) * 4.3, 0.26, 0.6);
};

// 3 — the mirror: anti-noise slides in, the sum flattens; dots at the ear stop; pond inset
SCENES.cancel = (t, T, B, E, dur) => {
  clear(); vignette();
  const ag = seg(t, B(1), B(2) + 0.4);
  scope(t, 560, 1700, 230, { anti: ag, a: 1 });
  plate("noise + mirror = almost nothing", 1130, 900 - 40, 48, GOLD, "center", win(t, B(3), B(4), 0.4));
  plate("destructive interference", 1130, 900 - 40, 52, INK, "center", win(t, B(4), B(5), 0.4));
  // pond inset: two ripple sets meeting
  const pa = win(t, B(5) - 0.3, B(6), 0.4); if (pa > 0) { rrect(1300, 560, 520, 280, 24, PANELc, pa); for (let q = 0; q < 4; q++) { const r = (t * 50 + q * 40) % 160; [1400, 1720].forEach(x => { g.save(); g.globalAlpha = pa * (1 - r / 160); g.strokeStyle = css(BLUEc); g.lineWidth = 4; g.beginPath(); g.arc(x, 700, r, 0, TAU2); g.stroke(); g.restore(); }); } rrect(1530, 680, 60, 40, 20, GOLDc, pa * 0.5); text("flat patch", 1560, 640, 40, GOLD, "center", 700, pa); }
  plate("tiny, very fast mirror makers", 1130, 900 - 40, 52, BLUE, "center", win(t, B(6), dur, 0.4));
  MAS(170, T, { s: 0.28, look: [0.8, -0.3], mouth: ag > 0.9 ? "grin" : "o" }); masPhones(170, 900 + Math.sin(T * 2.1) * 4.8, 0.28, 1);
};

// 4 — inside the ear cup, then the history timeline
SCENES.inside = (t, T, B, E, dur) => {
  clear(); vignette();
  const tl = seg(t, B(5) - 0.4, B(5) + 0.6), hi = t < B(1) ? 0 : t < B(2) ? 1 : t < B(3) ? 2 : t < B(4) ? 3 : 4;
  const ca = 1 - tl;
  cup(860, 480, 1.05, ca, hi, t);
  // incoming noise from the left, cancelled inside
  if (ca > 0) { for (let q = 0; q < 5; q++) { const x = 60 + ((t * 200 + q * 110) % 560); line(x, 300, x, 660, CORALc, ca * 0.5 * (1 - (x - 60) / 600), 6); } if (hi >= 3) trace(1100, 1500, 480, 60, x => 0.08 * Math.sin(x / 30 - t * 8), GOLDc, ca, 8); if (hi >= 3) text("near-flat at the ear", 1300, 380, 42, GOLD, "center", 700, ca * seg(t, B(3) + 1, B(3) + 2)); }
  if (tl > 0) {
    const x0 = 240, x1 = 1680, y = 480; line(x0, y, x0 + (x1 - x0) * seg(t, B(5), B(6) + 3), y, QUIETc, tl, 6);
    [["1930s", "Paul Lueg's patent", 0.0, B(5) + 1], ["late 1980s", "headsets for pilots", 0.62, B(6) + 3], ["today", "on your head", 1.0, B(6) + 6]].forEach(([d, l, u, tt]) => { const a = tl * seg(t, tt, tt + 0.6); dot(lerp(x0, x1, u), y, 16, GOLDc, a); text(d, lerp(x0, x1, u), y - 80, 56, GOLD, "center", 800, a); text(l, lerp(x0, x1, u), y + 80, 42, INK, "center", 600, a); });
    plate("the mirror must be almost perfect", 960, 800, 52, CORAL, "center", win(t, B(7), dur, 0.4));
  }
  MAS(1800, T, { s: 0.26, look: [-0.8, -0.2], mouth: hi === 4 ? "o" : "smile" }); masPhones(1800, 900 + Math.sin(T * 2.1) * 4.3, 0.26, 1);
};

// 5 — timing: the mirror arrives late; half a cycle doubles; the 1/60 dial; two clocks
SCENES.timing = (t, T, B, E, dur) => {
  clear(); vignette();
  const del = t < B(2) ? 0.12 * seg(t, B(0), B(1) + 1) : lerp(0.12, 0.5, seg(t, B(2), B(2) + 1.5)), sa = 1 - seg(t, B(3) - 0.4, B(3) + 0.4);
  scope(t * 0.6, 560, 1700, 220, { delay: del, a: sa });
  plate(del > 0.45 ? "half a cycle late: twice as tall" : "a little late: some leaks through", 1130, 860, 48, CORAL, "center", sa * win(t, B(1), B(3), 0.4));
  const da = seg(t, B(3) - 0.2, B(3) + 0.6);
  if (da > 0) {
    // dial with a 1/60 wedge
    const cx = 420, cy = 470, r = 230; g.save(); g.globalAlpha = da; g.strokeStyle = css(QUIETc); g.lineWidth = 8; g.beginPath(); g.arc(cx, cy, r, 0, TAU2); g.stroke();
    g.fillStyle = css(GOLDc); g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, r, -Math.PI / 2 - TAU2 / 120, -Math.PI / 2 + TAU2 / 120); g.closePath(); g.fill(); g.restore();
    const hand = -Math.PI / 2 + Math.sin(t * 2) * TAU2 / 140; line(cx, cy, cx + r * 0.95 * Math.cos(hand), cy + r * 0.95 * Math.sin(hand), INK, da, 6);
    text("one cycle", cx, cy + r + 60, 44, QUIET, "center", 700, da); text("≈ 1/60", cx, cy - r - 60, 56, GOLD, "center", 800, da);
    plate("99% of the energy gone", cx, 120, 46, GOLD, "center", da * win(t, B(3) + 0.5, dur, 0.4));
    // two clocks
    [[B(4), "100 Hz", "cycle 10 ms", "≈ 0.17 ms", BLUE, 960], [B(5), "2,000 Hz", "cycle 0.5 ms", "≈ 8 µs", CORAL, 1460]].forEach(([tt, f, c, e, col, x]) => {
      const a = da * seg(t, tt, tt + 0.6); rrect(x - 220, 240, 440, 470, 24, PANELc, a);
      text(f, x, 300, 56, col, "center", 800, a); const lam = col === BLUE ? 400 : 40; trace(x - 190, x + 190, 430, 60, xx => Math.sin(TAU2 * xx / lam - t * 3), col === BLUE ? BLUEc : CORALc, a, 5);
      text(c, x, 560, 44, INK, "center", 700, a); text("timing within " + e, x, 640, 40, GOLD, "center", 700, a);
    });
    plate("higher pitch → harder mirror", 1210, 840, 50, INK, "center", win(t, B(6), dur, 0.4));
  }
  MAS(1820, T, { s: 0.24, y: 230 + 220, look: [-0.6, 0.3], mouth: del > 0.45 && t < B(3) ? "o" : "smile", a: sa });
};

// 6 — the quiet bubble: interference map around a head; the bubble shrinks with pitch
SCENES.zone = (t, T, B, E, dur) => {
  clear(); vignette();
  const f = t < B(5) ? 100 : lerp(100, 3000, eio((t - B(5)) / 2.5)), lamM = 343 / f;            // metres
  const pxPerM = 900;                           // 1 m = 900 px: the head (~20 cm) is 180 px
  const hx = 1100, hy = 470, bub = lamM / 10 * pxPerM;                    // bubble diameter = λ/10
  // map: residual level around the cancellation point (closed-form sketch: grows with distance / λ)
  const ma = seg(t, B(1) - 0.3, B(1) + 0.6), step = 24;
  if (ma > 0) for (let y = 120; y < 840; y += step) for (let x = 520; x < 1700; x += step) {
    const d = Math.hypot(x - hx, y - hy) / pxPerM, kd = TAU2 * d / lamM, res = clamp(Math.sqrt(2 - 2 * Math.cos(kd)) / 1.4);
    rrect(x - step / 2 + 1, y - step / 2 + 1, step - 2, step - 2, 4, mix(GOLDc, CORALc, ss(res * 1.6)), ma * 0.7);
  }
  // the bubble
  const ba = seg(t, B(2), B(2) + 0.8); g.save(); g.globalAlpha = ba; g.strokeStyle = css(GOLDc); g.lineWidth = 6; g.setLineDash([16, 10]); g.beginPath(); g.arc(hx, hy, Math.max(5, bub / 2), 0, TAU2); g.stroke(); g.restore();
  // head silhouette (simplified, 20 cm wide)
  g.save(); g.globalAlpha = 0.9; g.fillStyle = "#f6e3d3"; g.beginPath(); g.ellipse(hx - 70, hy, 90, 115, 0, 0, TAU2); g.fill(); g.fillStyle = "#2a2f40"; g.beginPath(); g.roundRect(hx - 10, hy - 60, 46, 120, 20); g.fill(); g.restore();
  dot(hx + 6, hy, 9, BLUEc, 1);                                   // inner mic
  text(`${Math.round(f).toLocaleString("en-US")} Hz`, 300, 200, 64, f > 1000 ? CORAL : BLUE, "center", 800, ba);
  text(`wavelength ${lamM >= 1 ? lamM.toFixed(1) + " m" : Math.round(lamM * 100) + " cm"}`, 300, 290, 44, INK, "center", 700, ba);
  text(`bubble ≈ ${bub / pxPerM >= 0.1 ? Math.round(bub / pxPerM * 100) : (bub / pxPerM * 100).toFixed(1)} cm`, 300, 370, 44, GOLD, "center", 700, ba);
  plate("≈ a tenth of a wavelength across", 1100, 100, 46, INK, "center", win(t, B(2) + 1.5, B(3), 0.4));
  plate("bigger than your head", 1100, 100, 50, GOLD, "center", win(t, B(3) + 2.5, B(5), 0.4));
  plate("the mic is already outside it", 1100, 100, 50, CORAL, "center", win(t, B(6), B(7), 0.4));
  plate("higher pitch → smaller quiet zone", 1100, 100, 50, INK, "center", win(t, B(7), dur, 0.4));
  text("inner mic", hx + 30, hy + 150, 40, BLUE, "left", 700, win(t, B(6), dur, 0.4));
  MAS(240, T, { s: 0.28, look: [0.8, -0.2], mouth: f > 1000 ? "o" : "smile" }); masPhones(240, 900 + Math.sin(T * 2.1) * 4.8, 0.28, 1);
};

// 7 — why voices get through: lows cancelled vs voice leaking; padding takes the highs
SCENES.voices = (t, T, B, E, dur) => {
  clear(); vignette();
  const L = seg(t, B(1) - 0.3, B(1) + 0.5), R = seg(t, B(2) - 0.3, B(2) + 0.5), pad = seg(t, B(3), B(3) + 1);
  rrect(80, 160, 840, 640, 28, PANELc, L); rrect(1000, 160, 840, 640, 28, PANELc, R);
  text("engine · air con · train", 500, 230, 46, BLUE, "center", 800, L); text("low · steady · predictable", 500, 300, 40, QUIET, "center", 600, L);
  trace(160, 840, 450, 80, x => Math.sin(x / 70 - t * 3), CORALc, L, 6); trace(160, 840, 640, 80, x => 0.05 * Math.sin(x / 70 - t * 3), GOLDc, L, 8); text("cancelled", 500, 730, 44, GOLD, "center", 800, L);
  text("voices", 1420, 230, 46, CORAL, "center", 800, R); text("high · always changing", 1420, 300, 40, QUIET, "center", 600, R);
  const v = x => Math.sin(x / 9 - t * 9) * (0.5 + 0.5 * Math.sin(x / 60 + t * 2.3)) * (0.6 + 0.4 * Math.sin(t * 5.1 + x / 23));
  trace(1080, 1760, 450, 80, v, CORALc, R, 4); trace(1080, 1760, 640, 80, x => v(x) * lerp(0.8, 0.35, pad), GOLDc, R, 4);
  text(pad > 0.5 ? "padding blocks part of it" : "leaks through", 1420, 730, 44, pad > 0.5 ? BLUE : CORAL, "center", 800, R);
  if (pad > 0) rrect(1060, 520, 30, 240, 15, [42, 58, 110], R * pad);
  plate("Problem 1: timing  ·  Problem 2: space", 960, 500, 56, INK, "center", win(t, 0.2, B(1) - 0.2, 0.4));
  plate("active: the lows  ·  padding: the highs", 960, 100, 50, INK, "center", win(t, B(4), dur, 0.4));
  MAS(960, T, { s: 0.22, y: 900, look: [t > B(2) ? 0.8 : -0.8, -0.2], mouth: t > B(2) && t < B(3) ? "o" : "smile" }); masPhones(960, 900 + Math.sin(T * 2.1) * 3.7, 0.22, 1);
};

// 7b — the viewer's noisiest place: rumble or chatter
SCENES.angle = (t, T, B, E, dur) => {
  clear(); vignette();
  trace(120, 900, 460, 120, x => Math.sin(x / 90 - t * 2), BLUEc, 1, 8); text("low rumble", 510, 650, 52, BLUE, "center", 800, 1);
  trace(1020, 1800, 460, 120, x => Math.sin(x / 8 - t * 9) * (0.5 + 0.5 * Math.sin(x / 50 + t * 3)), CORALc, 1, 4); text("high chatter", 1410, 650, 52, CORAL, "center", 800, 1);
  plate("Your noisiest place every week?", 960, 160, 56, INK, "center", win(t, 0.3, dur, 0.4));
  plate("headphones win here", 510, 780, 44, GOLD, "center", win(t, B(1) + 1.5, dur, 0.4));
};

// 8 — payoff: the opening scene again with mirror ripples; then the end card
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette();
  const card = seg(t, B(4) - 0.6, B(4) + 0.2);
  if (card < 1) {
    const a = 1 - card;
    rrect(60, 380, 220, 120, 60, [58, 72, 120], a);
    for (let q = 0; q < 9; q++) { const r = ((t * 220 + q * 180) % 1620); g.save(); g.globalAlpha = a * 0.6 * (1 - r / 1700) * (r > 1250 ? 0.15 : 1); g.strokeStyle = css(CORALc); g.lineWidth = 8; g.beginPath(); g.arc(170, 440, r, -0.6, 0.6); g.stroke(); g.restore(); }
    head(1420, 540, 0.9, a, 1);
    scope(t, 520, 1100, 640, { a: a * win(t, B(1), B(3) + 2, 0.5), A: 40, gap: 80, labels: false, lam: 260 });
    plate("two waves, perfectly out of step", 1060, 160, 54, GOLD, "center", a * win(t, B(3), dur, 0.4));
  }
  if (card > 0) { trace(80, 560, 360, 0, () => 0, GOLDc, card, 8); MAS(330, T, { s: 0.3, y: 880, look: [0.6, -0.2], mouth: "smile", a: card }); masPhones(330, 880 + Math.sin(T * 2.1) * 5.2, 0.3, card); }
};
