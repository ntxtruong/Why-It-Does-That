// Shared helpers (from ep61/core.js, brand kit v2), ep62: cutting-mat green panel, no mascot.
// Everything is a pure function of the timeline time t (seconds): no clocks, no unseeded randomness.
const W = window.FRAME_W || 1920, H = window.FRAME_H || 1080, SAFE = Math.round(H * (window.FRAME_SAFE || 0.85));   // nothing important below SAFE (captions / Shorts UI)
const cv = document.getElementById("sim"), g = cv.getContext("2d");
const TL = window.TL;
// brand kit v2
const BG = "#18264F", PANEL = "#17382C", INK = "#F2F5FB", QUIET = "#AAB7D1", GOLD = "#FFD45E", BLUE = "#8CC6FF", CORAL = "#FF8A7A";
const BGc = [24, 38, 79], PANELc = [23, 56, 44], INKc = [242, 245, 251], QUIETc = [170, 183, 209], GOLDc = [255, 212, 94], BLUEc = [140, 198, 255], CORALc = [255, 138, 122];
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

