// Shared helpers for episodes 6–8 (from ep05/core.js, brand kit v2), with the chibi v3 character.
// Everything is a pure function of the timeline time t (seconds): no clocks, no unseeded randomness.
const W = window.FRAME_W || 1920, H = window.FRAME_H || 1080, SAFE = Math.round(H * (window.FRAME_SAFE || 0.85));   // nothing important below SAFE (captions / Shorts UI)
const cv = document.getElementById("sim"), g = cv.getContext("2d");
const TL = window.TL;
// brand kit v2
const BG = "#18264F", PANEL = "#23356A", INK = "#F2F5FB", QUIET = "#AAB7D1", GOLD = "#FFD45E", BLUE = "#8CC6FF", CORAL = "#FF8A7A";
const BGc = [24, 38, 79], PANELc = [35, 53, 106], INKc = [242, 245, 251], QUIETc = [170, 183, 209], GOLDc = [255, 212, 94], BLUEc = [140, 198, 255], CORALc = [255, 138, 122];
const FONT = "Inter, sans-serif";
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, u) => a + (b - a) * u;
const ss = u => { u = clamp(u); return u * u * (3 - 2 * u); };
const eio = u => { u = clamp(u); return u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; };
const eout = u => 1 - Math.pow(1 - clamp(u), 3);
const seg = (t, a, b) => ss((t - a) / (b - a));
const win = (t, a, b, f = 0.5) => seg(t, a, a + f) * (1 - seg(t, b - f, b));
const hash = (i, k = 0) => { const s = Math.sin(i * 127.1 + k * 311.7 + 17.3) * 43758.5453; return s - Math.floor(s); };
const TAU2 = Math.PI * 2;
function mix(a, b, u) { return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; }
const css = (c, a = 1) => typeof c === "string" ? c : `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
// damped spring: 0 → 1 with a small overshoot, starting at t0 (ClaudeAnimationBase idea, pure function of t)
const spring = (t, t0, k = 9, z = 0.55) => { const u = t - t0; if (u <= 0) return 0; return 1 - Math.exp(-z * k * u) * Math.cos(k * Math.sqrt(1 - z * z) * u); };

function clear(col = BG) { g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; g.fillStyle = css(col); g.fillRect(0, 0, W, H); }
function vignette(a = 0.35) { const gr = g.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 1.05); gr.addColorStop(0, "rgba(14,22,48,0)"); gr.addColorStop(1, `rgba(14,22,48,${a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function dot(x, y, r, c, a = 1) { if (a <= 0.01 || r <= 0) return; g.globalAlpha = a; g.fillStyle = css(c); g.beginPath(); g.arc(x, y, r, 0, TAU2); g.fill(); g.globalAlpha = 1; }
function soft(x, y, r, c, a = 1) { if (a <= 0.01) return; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, css(c, a)); gr.addColorStop(1, css(c, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
function line(x1, y1, x2, y2, col, a = 1, lw = 3, dash) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.strokeStyle = css(col); g.lineWidth = lw; g.lineCap = "round"; if (dash) g.setLineDash(dash); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore(); }
function poly(pts, col, a = 1, lw = 4, close = false, fill) { if (a <= 0.01 || pts.length < 2) return; g.save(); g.globalAlpha = a; g.lineJoin = "round"; g.lineCap = "round"; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); if (close) g.closePath(); if (fill) { g.fillStyle = css(fill); g.fill(); } if (col) { g.strokeStyle = css(col); g.lineWidth = lw; g.stroke(); } g.restore(); }
function text(s, x, y, size, col = INK, align = "left", weight = 700, a = 1) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.font = `${weight} ${size}px ${FONT}`; g.textAlign = align; g.textBaseline = "middle"; g.fillStyle = css(col); g.fillText(s, x, y); g.restore(); }
function plate(s, x, y, size, col = INK, align = "center", a = 1, weight = 700) {
  if (a <= 0.01) return; g.save(); g.font = `${weight} ${size}px ${FONT}`; const w = g.measureText(s).width, px = size * 0.42, h = size * 1.5;
  const x0 = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
  g.globalAlpha = a * 0.9; g.fillStyle = PANEL; g.beginPath(); g.roundRect(x0 - px, y - h / 2, w + 2 * px, h, h * 0.3); g.fill(); g.restore();
  text(s, x, y + size * 0.03, size, col, align, weight, a);
}
function arrow(x1, y1, x2, y2, col, a = 1, lw = 6, head = 22) { if (a <= 0.01) return; line(x1, y1, x2, y2, col, a, lw); const an = Math.atan2(y2 - y1, x2 - x1); poly([[x2 - head * Math.cos(an - 0.45), y2 - head * Math.sin(an - 0.45)], [x2, y2], [x2 - head * Math.cos(an + 0.45), y2 - head * Math.sin(an + 0.45)]], col, a, lw); }
function rrect(x, y, w, h, r, fill, a = 1, stroke, lw = 3) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.beginPath(); g.roundRect(x, y, w, h, r); if (fill) { g.fillStyle = css(fill); g.fill(); } if (stroke) { g.strokeStyle = css(stroke); g.lineWidth = lw; g.stroke(); } g.restore(); }
// a counter that rolls up from 0 to v between t0 and t1
const roll = (t, t0, t1, v, dp = 0) => (v * eout((t - t0) / (t1 - t0))).toFixed(dp);

// chibi v3 (2026-10-30): three-quarter view turned to the left, looking up and away, hand at the chin.
// After Trường's photo: brown tousled hair swept forward, black rectangular glasses, white earbud, black blazer over a light-blue shirt.
function chibi3(x, yFeet, s, o = {}) {
  const AL = o.a ?? 1; if (AL <= 0.01) return;
  g.save(); g.globalAlpha = AL; g.translate(x, yFeet); if (o.rot) g.rotate(o.rot); g.translate(0, -890 * s); g.scale(s, s);
  const SKIN = "#f6e3d3", SKIN2 = "#ecd2bf", HAIR = "#6e4426", HAIR2 = "#a06a3c", BLAZER = "#22273a", LAPEL = "#2c3247", SEAM = "#454d68", SHIRT = "#bcd6f2", OUT = "#F2F5FB";
  const shapes = [], S = (b, f) => shapes.push({ b, f });
  // legs and shoes, a small step to the left
  S(() => { g.beginPath(); g.roundRect(-84, 740, 56, 120, 22); }, "#2a2f40"); S(() => { g.beginPath(); g.roundRect(4, 744, 56, 118, 22); }, "#2a2f40");
  S(() => { g.beginPath(); g.ellipse(-70, 864, 50, 23, 0, 0, 7); }, "#e6eaf2"); S(() => { g.beginPath(); g.ellipse(24, 866, 46, 22, 0, 0, 7); }, "#e6eaf2");
  // blazer body, turned: broad shoulders, the front edge on the left
  S(() => { g.beginPath(); g.moveTo(-150, 784); g.quadraticCurveTo(-186, 640, -120, 596); g.quadraticCurveTo(-40, 572, 60, 578); g.quadraticCurveTo(146, 590, 150, 660); g.lineTo(132, 786); g.quadraticCurveTo(-10, 812, -150, 784); g.closePath(); }, BLAZER);
  // back of the head (hair), then the face shifted left
  S(() => { g.beginPath(); g.ellipse(14, 410, 192, 178, 0, 0, 7); }, HAIR);
  S(() => { g.beginPath(); g.ellipse(-26, 446, 166, 150, 0, 0, 7); }, SKIN);
  // ear on the right with the earbud
  S(() => { g.beginPath(); g.ellipse(132, 462, 30, 40, 0.15, 0, 7); }, SKIN);
  // tousled crown, swept forward to the left, short at the side
  S(() => { g.beginPath();
    g.moveTo(178, 470); g.quadraticCurveTo(214, 300, 120, 236);
    g.quadraticCurveTo(60, 186, -40, 204); g.quadraticCurveTo(-150, 214, -196, 300);
    g.lineTo(-236, 336); g.lineTo(-176, 344); g.lineTo(-198, 404); g.lineTo(-132, 366);
    g.lineTo(-120, 414); g.lineTo(-80, 364); g.lineTo(-46, 410); g.lineTo(-26, 360);
    g.lineTo(18, 398); g.lineTo(30, 352); g.lineTo(78, 384); g.lineTo(84, 350);
    g.quadraticCurveTo(110, 400, 118, 440); g.quadraticCurveTo(150, 420, 178, 470); g.closePath(); }, HAIR);
  g.lineJoin = "round"; g.strokeStyle = OUT; g.lineWidth = 22; shapes.forEach(q => { q.b(); g.stroke(); }); shapes.forEach(q => { q.b(); g.fillStyle = q.f; g.fill(); });
  // inner ear and the earbud
  g.fillStyle = SKIN2; g.beginPath(); g.ellipse(134, 462, 14, 22, 0.15, 0, 7); g.fill();
  g.fillStyle = OUT; g.beginPath(); g.ellipse(128, 458, 17, 20, 0.2, 0, 7); g.fill(); g.beginPath(); g.roundRect(122, 470, 14, 44, 7); g.fill();
  // hair texture: strands sweeping forward
  g.strokeStyle = HAIR2; g.lineWidth = 9; g.lineCap = "round";
  [[150, 300, 40, 250, -60, 262], [120, 360, 30, 300, -110, 300], [170, 400, 120, 330, 40, 316], [-20, 230, -100, 236, -170, 290]].forEach(([a, b, c, d, e, f]) => { g.beginPath(); g.moveTo(a, b); g.quadraticCurveTo(c, d, e, f); g.stroke(); });
  // shirt V, collar points, notched lapels, button and breast pocket
  g.fillStyle = SHIRT; g.beginPath(); g.moveTo(-74, 592); g.lineTo(-22, 700); g.lineTo(34, 590); g.closePath(); g.fill();
  g.fillStyle = "#d6e6f8"; g.beginPath(); g.moveTo(-74, 592); g.lineTo(-40, 600); g.lineTo(-52, 636); g.closePath(); g.fill(); g.beginPath(); g.moveTo(34, 590); g.lineTo(4, 598); g.lineTo(18, 632); g.closePath(); g.fill();
  const lap = (pts) => { g.fillStyle = LAPEL; g.strokeStyle = SEAM; g.lineWidth = 5; g.beginPath(); pts.forEach(([a, b], i) => i ? g.lineTo(a, b) : g.moveTo(a, b)); g.closePath(); g.fill(); g.stroke(); };
  lap([[-80, 594], [-122, 646], [-104, 656], [-120, 676], [-36, 748], [-24, 704]]);
  lap([[38, 592], [80, 636], [62, 646], [76, 664], [-8, 748], [-20, 704]]);
  g.fillStyle = SEAM; g.beginPath(); g.arc(-22, 770, 8, 0, 7); g.fill();
  g.strokeStyle = SEAM; g.lineWidth = 5; g.beginPath(); g.moveTo(58, 700); g.lineTo(104, 694); g.stroke();
  // eyes looking up and to the left, behind the glasses (far lens narrower: foreshortened)
  const [lx, ly] = o.look || [-0.8, -0.6];
  [[-132, 0.72], [-8, 1]].forEach(([ex, k]) => { const cx = ex + lx * 15, cy = 462 + ly * 13; g.fillStyle = "#1b1e2c"; g.beginPath(); g.ellipse(cx, cy, 22 * k, 30 * (1 - 0.92 * clamp(o.blink || 0)), 0, 0, 7); g.fill(); if ((o.blink || 0) > 0.5) return; g.fillStyle = OUT; g.beginPath(); g.arc(cx - 7 * k, cy - 12, 8, 0, 7); g.fill(); g.beginPath(); g.arc(cx + 8 * k, cy + 10, 4, 0, 7); g.fill(); });
  g.strokeStyle = "#111421"; g.lineWidth = 11; g.lineJoin = "round";
  g.beginPath(); g.roundRect(-58, 424, 104, 76, 18); g.stroke();                 // near lens
  g.beginPath(); g.roundRect(-172, 428, 78, 72, 16); g.stroke();                 // far lens
  g.beginPath(); g.moveTo(-94, 452); g.lineTo(-58, 452); g.stroke();             // bridge
  g.beginPath(); g.moveTo(46, 446); g.lineTo(118, 436); g.stroke();              // temple arm to the ear
  // nose, blush, a small curious "o" mouth
  g.strokeStyle = "#d9b49c"; g.lineWidth = 6; g.beginPath(); g.moveTo(-96, 498); g.quadraticCurveTo(-106, 512, -92, 516); g.stroke();
  g.fillStyle = "rgba(255,120,130,0.4)"; g.beginPath(); g.ellipse(-150, 524, 22, 13, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(36, 526, 30, 15, 0, 0, 7); g.fill();
  g.fillStyle = "#7a4a45"; g.strokeStyle = "#7a4a45"; g.lineWidth = 7; g.lineCap = "round";
  if (o.mouth === "smile") { g.beginPath(); g.arc(-66, 538, 18, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }
  else if (o.mouth === "wince") { g.beginPath(); g.moveTo(-88, 550); g.lineTo(-74, 542); g.lineTo(-60, 550); g.lineTo(-46, 542); g.stroke(); }
  else if (o.mouth === "grin") { g.beginPath(); g.arc(-66, 532, 24, 0.08 * Math.PI, 0.92 * Math.PI); g.closePath(); g.fill(); }
  else { const m = o.mouthO ?? 1; g.beginPath(); g.ellipse(-70, 548, 11 * m, 13 * m, 0, 0, 7); g.fill(); }
  // arm raised to the chin: sleeve (upper arm down to the elbow, forearm back up), shirt cuff, hand
  const arm = () => { g.beginPath(); g.moveTo(-146, 640); g.quadraticCurveTo(-168, 720, -130, 742); g.quadraticCurveTo(-96, 740, -104, 632); };
  g.lineCap = "round"; g.lineJoin = "round";
  g.strokeStyle = OUT; g.lineWidth = 64; arm(); g.stroke();
  g.strokeStyle = BLAZER; g.lineWidth = 46; arm(); g.stroke();
  g.strokeStyle = SEAM; g.lineWidth = 4; g.beginPath(); g.moveTo(-128, 700); g.quadraticCurveTo(-118, 680, -118, 650); g.stroke();
  g.fillStyle = SHIRT; g.beginPath(); g.roundRect(-128, 610, 46, 22, 8); g.fill();
  g.fillStyle = SKIN; g.strokeStyle = OUT; g.lineWidth = 6; g.beginPath(); g.ellipse(-106, 588, 28, 26, 0, 0, 7); g.fill(); g.stroke();
  g.restore();
}

// chibi v3 with idle life: slow bob, a blink every few seconds, optional lean (rad) and hop. T = global time.
function mascot3(x, yFeet, s, T, o = {}) {
  const bob = Math.sin(T * 2.1) * 16 * s + (o.hop ? -Math.abs(Math.sin(T * 7)) * 80 * s * o.hop : 0), ph = (T + 1.3) % 3.6, blink = ph < 0.16 ? 1 - Math.abs(ph - 0.08) / 0.08 : 0;
  chibi3(x, yFeet + bob, s, { blink, ...o });
}

// ---- character reactions (2026-11-06, Trường asked for a livelier character) ----
// MASR(T, t, o): chibi v3 at lower left, larger (s 0.5), with reaction events o.ev = [[t0, kind], ...] in scene time t.
// Each event: a small hop with squash-free bounce, a lean toward the subject, and a pop mark over the head
// ("!" surprise, "?" puzzled, "idea" = a small lit bulb, "ok" = a check). Pure functions of time; no particles.
function popMark(x, y, kind, k, a) {
  if (a <= 0.01 || k <= 0.01) return;
  g.save(); g.translate(x, y); g.scale(1.45 * k, 1.45 * k); g.globalAlpha = a;
  g.fillStyle = css(PANELc); g.strokeStyle = css(INKc, 0.9); g.lineWidth = 4;
  g.beginPath(); g.arc(0, 0, 46, 0, TAU2); g.fill(); g.stroke();
  g.beginPath(); g.moveTo(-14, 40); g.lineTo(-30, 66); g.lineTo(4, 44); g.closePath(); g.fill();
  const F = s => { g.font = `900 ${s}px ${FONT}`; g.textAlign = "center"; g.textBaseline = "middle"; };
  if (kind === "!") { F(60); g.fillStyle = css(GOLDc); g.fillText("!", 0, 3); }
  else if (kind === "?") { F(58); g.fillStyle = css(BLUEc); g.fillText("?", 0, 3); }
  else if (kind === "ok") { g.strokeStyle = css(GOLDc); g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.moveTo(-18, 2); g.lineTo(-4, 16); g.lineTo(20, -14); g.stroke(); }
  else { // idea: a small bulb with three short rays
    g.fillStyle = css(GOLDc); g.beginPath(); g.arc(0, -6, 18, 0, TAU2); g.fill(); g.fillRect(-9, 10, 18, 12);
    g.strokeStyle = css(GOLDc); g.lineWidth = 5; g.lineCap = "round";
    [[-30, -22, -22, -16], [0, -36, 0, -28], [30, -22, 22, -16]].forEach(([a1, b1, a2, b2]) => { g.beginPath(); g.moveTo(a1, b1); g.lineTo(a2, b2); g.stroke(); });
  }
  g.restore();
}
function MASR(T, t, o = {}) {
  const x = o.x ?? 165, y = o.y ?? 1560, s = o.s ?? 0.55, ev = o.ev || [];
  let hop = 0, lean = 0, mark = null, mk = 0, ma = 0, mouth = o.mouth;
  ev.forEach(([t0, kind, mo]) => {
    const u = t - t0; if (u < 0 || u > 2.2) return;
    hop += 70 * s * Math.exp(-u * 5) * Math.abs(Math.sin(u * 11));
    lean += 0.07 * Math.exp(-u * 3) * Math.sin(u * 9 + 0.6);
    const k = clamp(spring(t, t0, 12, 0.45), 0, 1.25), fade = 1 - seg(u, 1.6, 2.2);
    if (fade > ma) { mark = kind; mk = k; ma = fade; }
    if (mo && u < 1.8) mouth = mo;
  });
  mascot3(x, y - hop, s, T, { ...o, mouth, rot: (o.rot || 0) + lean });
  if (mark) popMark(x + 230 * s, y - 950 * s - hop, mark, mk, ma);
}
