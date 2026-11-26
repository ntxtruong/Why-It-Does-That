// Shared helpers for episodes 3–5 (from ep02/core.js, brand kit v2 colours).
// Everything is a pure function of the timeline time t (seconds): no clocks, no unseeded randomness.
const W = 1920, H = 1080, SAFE = 918;             // nothing important below SAFE (YouTube captions)
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

// ---------- the mascot ----------
// x = centre, yFeet = bottom of the shoes, s = scale (1 = 714 px tall).
// o: a (alpha), look [lx, ly] in -1..1, blink 0..1, mouth "smile" | "o" | "grin", rot (radians, about the feet),
//    q (question mark), helmet (space helmet), balloon, hat / cuff colours
function chibi(x, yFeet, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.globalCompositeOperation = "source-over"; g.translate(x, yFeet); if (o.rot) g.rotate(o.rot); g.translate(0, -890 * s); g.scale(s, s);
  const SKIN = "#f6e3d3", HAIR = "#15161d", CLOTH = "#1b1d27", shapes = [], S = (b, f) => shapes.push({ b, f });
  if (o.balloon) { g.strokeStyle = "#d7dcea"; g.lineWidth = 5; g.beginPath(); g.moveTo(40, 700); g.quadraticCurveTo(120, 300, 150, -80); g.stroke(); g.fillStyle = "#ff6b6b"; g.strokeStyle = "#F2F5FB"; g.lineWidth = 12; g.beginPath(); g.ellipse(160, -260, 150, 185, 0.08, 0, TAU2); g.stroke(); g.fill(); g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(110, -330, 34, 56, 0.4, 0, TAU2); g.fill(); }
  S(() => { g.beginPath(); g.roundRect(-70, 740, 58, 124, 22); }, "#2a2f40"); S(() => { g.beginPath(); g.roundRect(12, 740, 58, 124, 22); }, "#2a2f40");
  S(() => { g.beginPath(); g.ellipse(-46, 866, 46, 24, 0, 0, 7); }, "#eef2f8"); S(() => { g.beginPath(); g.ellipse(46, 866, 46, 24, 0, 0, 7); }, "#eef2f8");
  S(() => { g.beginPath(); g.moveTo(-122, 772); g.quadraticCurveTo(-156, 604, -74, 566); g.lineTo(74, 566); g.quadraticCurveTo(156, 604, 122, 772); g.quadraticCurveTo(0, 800, -122, 772); g.closePath(); }, CLOTH);
  S(() => { g.beginPath(); g.ellipse(0, 400, 200, 182, 0, 0, 7); }, HAIR); S(() => { g.beginPath(); g.ellipse(0, 424, 172, 156, 0, 0, 7); }, SKIN);
  S(() => { g.beginPath(); g.ellipse(0, 400, 200, 182, 0, Math.PI, 2 * Math.PI); g.lineTo(176, 430); g.quadraticCurveTo(120, 338, 92, 398); g.quadraticCurveTo(44, 338, 4, 394); g.quadraticCurveTo(-40, 338, -88, 398); g.quadraticCurveTo(-124, 338, -176, 430); g.closePath(); }, HAIR);
  S(() => { g.beginPath(); g.ellipse(0, 372, 204, 196, 0, Math.PI, 2 * Math.PI); g.closePath(); }, o.hat || "#22252f"); S(() => { g.beginPath(); g.roundRect(-212, 326, 424, 62, 28); }, o.cuff || "#3a4056");
  g.lineJoin = "round"; g.strokeStyle = "#F2F5FB"; g.lineWidth = 22; shapes.forEach(q => { q.b(); g.stroke(); }); shapes.forEach(q => { q.b(); g.fillStyle = q.f; g.fill(); });
  const [lx, ly] = o.look || [0, 0], bl = 1 - 0.92 * clamp(o.blink || 0);
  [-68, 68].forEach(ex => { const cx = ex + lx * 13, cy = 452 + ly * 13; g.fillStyle = "#1b1e2c"; g.beginPath(); g.ellipse(cx, cy, 27, 35 * bl, 0, 0, 7); g.fill(); if (bl > 0.5) { g.fillStyle = "#F2F5FB"; g.beginPath(); g.arc(cx - 9 + lx * 4, cy - 14 + ly * 4, 10, 0, 7); g.fill(); g.beginPath(); g.arc(cx + 10, cy + 12, 5, 0, 7); g.fill(); } });
  g.fillStyle = "rgba(255,120,130,0.45)"; g.beginPath(); g.ellipse(-112, 494, 30, 17, 0, 0, 7); g.fill(); g.beginPath(); g.ellipse(112, 494, 30, 17, 0, 0, 7); g.fill();
  g.strokeStyle = "#7a4a45"; g.fillStyle = "#7a4a45"; g.lineWidth = 7; g.lineCap = "round";
  if (o.mouth === "o") { g.beginPath(); g.ellipse(lx * 6, 508, 13, 16, 0, 0, 7); g.fill(); }
  else if (o.mouth === "grin") { g.beginPath(); g.arc(lx * 6, 494, 24, 0.08 * Math.PI, 0.92 * Math.PI); g.closePath(); g.fill(); }
  else { g.beginPath(); g.arc(lx * 6, 496, 17, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); }
  g.strokeStyle = "#30364a"; g.lineWidth = 9; g.beginPath(); g.moveTo(-70, 580); g.quadraticCurveTo(0, 650, 70, 580); g.stroke();
  g.fillStyle = SKIN; g.strokeStyle = CLOTH; g.lineWidth = 5; const hands = o.balloon ? [[-21, 712], [44, 690]] : [[-21, 712], [21, 712]]; hands.forEach(([hx, hy]) => { g.beginPath(); g.arc(hx, hy, 24, 0, 7); g.fill(); g.stroke(); });
  if (o.helmet) { g.strokeStyle = "rgba(200,225,255,0.9)"; g.lineWidth = 12; g.fillStyle = "rgba(160,200,255,0.10)"; g.beginPath(); g.ellipse(0, 395, 250, 240, 0, 0, TAU2); g.fill(); g.stroke(); g.strokeStyle = "rgba(255,255,255,0.5)"; g.lineWidth = 9; g.beginPath(); g.arc(0, 395, 215, -2.5, -1.9); g.stroke(); }
  if (o.q) { qmark(255, 212, 0.31, 12); }
  g.restore();
}
function qmark(cx, cy, s, rot) {
  const RAD = Math.PI / 180, SPEC = ["#ff4b4b", "#ff9340", "#ffe04a", "#58e07a", "#45a8ff", "#6470ff", "#a56bff"];
  g.save(); g.translate(cx, cy); g.rotate(rot * RAD); const c = g.createConicGradient(170 * RAD, 0, 0); [0, .105, .21, .32, .43, .535, .64].forEach((p, i) => c.addColorStop(p, SPEC[i])); c.addColorStop(.9, SPEC[6]); c.addColorStop(.97, SPEC[0]); c.addColorStop(1, SPEC[0]);
  const path = () => { const r = 135 * s, ex = r * Math.cos(40 * RAD), ey = r * Math.sin(40 * RAD); g.beginPath(); g.arc(0, 0, r, 170 * RAD, 400 * RAD); g.bezierCurveTo(ex - 0.64 * 78 * s, ey + 0.77 * 78 * s, 0, 150 * s, 0, 238 * s); };
  g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#F2F5FB"; g.lineWidth = 84 * s + 16; path(); g.stroke(); g.fillStyle = "#F2F5FB"; g.beginPath(); g.arc(0, 368 * s, 50 * s + 8, 0, 7); g.fill();
  g.strokeStyle = c; g.lineWidth = 84 * s; path(); g.stroke(); g.fillStyle = SPEC[6]; g.beginPath(); g.arc(0, 368 * s, 50 * s, 0, 7); g.fill(); g.restore();
}
// mascot with idle life: a slow bob and a blink every few seconds. T = global time.
function mascot(x, yFeet, s, T, o = {}) {
  const bob = Math.sin(T * 2.1) * 5 * s / 0.3 + (o.hop ? -Math.abs(Math.sin(T * 7)) * 26 * o.hop : 0), ph = (T + 1.3) % 3.4, blink = ph < 0.16 ? 1 - Math.abs(ph - 0.08) / 0.08 : 0;
  chibi(x, yFeet + bob, s, { blink, ...o });
}
// eye position of a mascot drawn at (x, yFeet, s): used for sight lines
const eyeOf = (x, yFeet, s) => ({ x, y: yFeet - (890 - 452) * s });

