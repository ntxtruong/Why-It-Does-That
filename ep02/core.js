// Episode 2 — shared helpers: timing, colour physics, drawing primitives, the mascot.
// Everything is a pure function of the timeline time t (seconds): no clocks, no unseeded randomness.
const W = 1920, H = 1080, SAFE = 918;             // nothing important below SAFE (YouTube captions)
const cv = document.getElementById("sim"), g = cv.getContext("2d");
const TL = window.TL;
const BG = "#0a1020", INK = "#eef2f8", QUIET = "#8a97ad", ACC = "#ffd166";
const FONT = "Inter, sans-serif";
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, u) => a + (b - a) * u;
const ss = u => { u = clamp(u); return u * u * (3 - 2 * u); };
const seg = (t, a, b) => ss((t - a) / (b - a));                         // smooth 0 → 1 between a and b
const win = (t, a, b, f = 0.5) => seg(t, a, a + f) * (1 - seg(t, b - f, b)); // 1 inside [a, b], soft edges
const hash = (i, k = 0) => { const s = Math.sin(i * 127.1 + k * 311.7 + 17.3) * 43758.5453; return s - Math.floor(s); };
const TAU2 = Math.PI * 2;

// ---------- colour physics ----------
// Rayleigh optical depth of the whole atmosphere at sea level (fit used by Hansen & Travis; matches
// Bodhaine et al. 1999 to 1%: 0.221 at 450 nm, 0.036 at 700 nm). lam in nanometres.
const tauR = lam => { const u = lam / 1000; return 0.008569 * Math.pow(u, -4) * (1 + 0.0113 * Math.pow(u, -2) + 0.00013 * Math.pow(u, -4)); };
const TAU_BLUE = 0.2211, TAU_RED = 0.0364, AIRMASS_HORIZON = 38;   // Bodhaine 1999; Kasten & Young 1989
// CIE 1931 colour matching functions, analytic fit (Wyman, Sloan, Shirley 2013)
const gl = (l, mu, s1, s2) => { const d = (l - mu) / (l < mu ? s1 : s2); return Math.exp(-0.5 * d * d); };
const cmf = l => [1.056 * gl(l, 599.8, 37.9, 31.0) + 0.362 * gl(l, 442.0, 16.0, 26.7) - 0.065 * gl(l, 501.1, 20.4, 26.2),
  0.821 * gl(l, 568.8, 46.9, 40.5) + 0.286 * gl(l, 530.9, 16.3, 31.1),
  1.217 * gl(l, 437.0, 11.8, 36.0) + 0.681 * gl(l, 459.0, 26.0, 13.8)];
const planck = l => { const m = l * 1e-9; return 1 / (Math.pow(m, 5) * (Math.exp(0.0143878 / (m * 5778)) - 1)); };
const LAMS = []; for (let l = 380; l <= 720; l += 5) LAMS.push(l);
const SUN = LAMS.map(planck), CMF = LAMS.map(cmf);
function specRGB(wfn) { // linear sRGB of sunlight weighted by wfn(lambda)
  let X = 0, Y = 0, Z = 0;
  LAMS.forEach((l, i) => { const w = SUN[i] * wfn(l); X += w * CMF[i][0]; Y += w * CMF[i][1]; Z += w * CMF[i][2]; });
  return [3.2406 * X - 1.5372 * Y - 0.4986 * Z, -0.9689 * X + 1.8758 * Y + 0.0415 * Z, 0.0557 * X - 0.2040 * Y + 1.0570 * Z];
}
const WHITE = specRGB(() => 1);
const rel = c => c.map((v, i) => Math.max(0, v / WHITE[i]));
// colour of the direct sun after crossing m air masses, as [r,g,b] 0..255 (hue kept, brightness eased)
function sunRGB(m) {
  const c = rel(specRGB(l => Math.exp(-tauR(l) * m))), mx = Math.max(...c, 1e-9), k = 0.62 + 0.38 * Math.pow(mx, 0.25);
  return c.map(v => 255 * Math.pow(clamp(v / mx), 1 / 2.2) * k);
}
const SUNCOL = []; for (let m = 0; m <= 40; m++) SUNCOL.push(sunRGB(m));
const sunCol = m => { m = clamp(m, 0, 39.999); const i = Math.floor(m); return mix(SUNCOL[i], SUNCOL[i + 1], m - i); };
// the same hue at full brightness, for a sun drawn against a bright sky
const sunHue = m => { const c = sunCol(m), mx = Math.max(...c, 1); return c.map(v => v / mx * 255); };
// colour of singly scattered skylight (sunlight × λ⁻⁴), computed, used for the "what you see" swatches
const SKYBLUE = (() => { const c = rel(specRGB(l => Math.pow(550 / l, 4))), mx = Math.max(...c); return c.map(v => 255 * Math.pow(v / mx, 1 / 2.2)); })();
function mix(a, b, u) { return [lerp(a[0], b[0], u), lerp(a[1], b[1], u), lerp(a[2], b[2], u)]; }
const css = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
// the six display colours, with the wavelength each one stands for
const PH = [{ l: 700, c: [255, 75, 75] }, { l: 620, c: [255, 147, 64] }, { l: 580, c: [255, 224, 74] }, { l: 530, c: [88, 224, 122] }, { l: 450, c: [69, 150, 255] }, { l: 400, c: [165, 107, 255] }];
PH.forEach(p => { p.tau = tauR(p.l); p.css = css(p.c); });
const RED = PH[0], BLUE = PH[4], VIOLET = PH[5];

// ---------- drawing primitives ----------
function clear(col = BG) { g.globalAlpha = 1; g.globalCompositeOperation = "source-over"; g.fillStyle = col; g.fillRect(0, 0, W, H); }
function vgrad(stops, y0 = 0, y1 = H, a = 1) { const gr = g.createLinearGradient(0, y0, 0, y1); stops.forEach(([p, c]) => gr.addColorStop(p, css(c, a))); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }
function dot(x, y, r, c, a = 1) { if (a <= 0.01) return; g.globalAlpha = a; g.fillStyle = typeof c === "string" ? c : css(c); g.beginPath(); g.arc(x, y, r, 0, TAU2); g.fill(); g.globalAlpha = 1; }
function glow(x, y, r, c, a = 1) { if (a <= 0.01) return; const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, css(c, a)); gr.addColorStop(1, css(c, 0)); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
function photon(x, y, c, a = 1, r = 6) { if (a <= 0.01) return; glow(x, y, r * 3.2, c, 0.35 * a); dot(x, y, r, c, a); }
function line(x1, y1, x2, y2, col, a = 1, lw = 3, dash) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.strokeStyle = typeof col === "string" ? col : css(col); g.lineWidth = lw; g.lineCap = "round"; if (dash) g.setLineDash(dash); g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke(); g.restore(); }
function text(s, x, y, size, col = INK, align = "left", weight = 700, a = 1) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.font = `${weight} ${size}px ${FONT}`; g.textAlign = align; g.textBaseline = "middle"; g.fillStyle = typeof col === "string" ? col : css(col); g.fillText(s, x, y); g.restore(); }
// text on a dark rounded plate, for labels that sit over a bright sky
function plate(s, x, y, size, col = INK, align = "center", a = 1, weight = 700) {
  if (a <= 0.01) return; g.save(); g.font = `${weight} ${size}px ${FONT}`; const w = g.measureText(s).width, px = size * 0.42, h = size * 1.5;
  const x0 = align === "center" ? x - w / 2 : align === "right" ? x - w : x;
  g.globalAlpha = a * 0.82; g.fillStyle = "#0a1020"; g.beginPath(); g.roundRect(x0 - px, y - h / 2, w + 2 * px, h, h * 0.3); g.fill(); g.restore();
  text(s, x, y + size * 0.03, size, col, align, weight, a);
}
// travelling sine wave between x0 and x1; lam = wavelength in px, ph = phase shift in px (moves it right)
function wave(x0, x1, y, amp, lam, ph, col, a = 1, lw = 6) {
  if (a <= 0.01 || x1 <= x0) return; g.save(); g.globalAlpha = a; g.strokeStyle = typeof col === "string" ? col : css(col); g.lineWidth = lw; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath();
  for (let x = x0; x <= x1; x += 4) { const yy = y - amp * Math.cos(TAU2 * (x - ph) / lam); x === x0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); g.restore();
}
const STARS = Array.from({ length: 260 }, (_, i) => ({ x: hash(i, 1) * W, y: hash(i, 2) * H, r: 1.2 + hash(i, 3) * 2.2, f: 0.6 + hash(i, 4) * 1.8, p: hash(i, 5) * 6.28 }));
function stars(t, a = 1, yMax = H) { if (a <= 0.01) return; for (const s of STARS) { if (s.y > yMax) continue; dot(s.x, s.y, s.r, "#dfe8ff", a * (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.f + s.p)))); } }
function sunDisc(x, y, r, c, a = 1, halo = 5) { glow(x, y, r * halo, c, 0.5 * a); glow(x, y, r * 2.2, c, 0.6 * a); dot(x, y, r, c, a); }
// a diatomic molecule: two atoms, slowly tumbling
function molecule(x, y, r, rot, c, a = 1) { const dx = Math.cos(rot) * r * 0.85, dy = Math.sin(rot) * r * 0.85; dot(x - dx, y - dy, r, c, a); dot(x + dx, y + dy, r, c, a); dot(x - dx - r * 0.3, y - dy - r * 0.3, r * 0.3, "#ffffff", a * 0.35); dot(x + dx - r * 0.3, y + dy - r * 0.3, r * 0.3, "#ffffff", a * 0.35); }
const N2C = [150, 178, 226], O2C = [236, 128, 128];
function cloud(x, y, s, c, a = 1) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.fillStyle = css(c); g.beginPath(); [[0, 0, 70], [-75, 18, 52], [72, 20, 56], [-30, -34, 54], [38, -30, 48], [0, 26, 60]].forEach(([dx, dy, r]) => { g.moveTo(x + dx * s + r * s * 1.25, y + dy * s); g.ellipse(x + dx * s, y + dy * s, r * s * 1.25, r * s, 0, 0, TAU2); }); g.fill("nonzero"); g.restore(); }

// ---------- the mascot ----------
// x = centre, yFeet = bottom of the shoes, s = scale (1 = 714 px tall).
// o: a (alpha), look [lx, ly] in -1..1, blink 0..1, mouth "smile" | "o" | "grin", rot (radians, about the feet),
//    q (question mark), helmet (space helmet), balloon, hat / cuff colours
function chibi(x, yFeet, s, o = {}) {
  const a = o.a ?? 1; if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.globalCompositeOperation = "source-over"; g.translate(x, yFeet); if (o.rot) g.rotate(o.rot); g.translate(0, -890 * s); g.scale(s, s);
  const SKIN = "#f6e3d3", HAIR = "#15161d", CLOTH = "#1b1d27", shapes = [], S = (b, f) => shapes.push({ b, f });
  if (o.balloon) { g.strokeStyle = "#d7dcea"; g.lineWidth = 5; g.beginPath(); g.moveTo(40, 700); g.quadraticCurveTo(120, 300, 150, -80); g.stroke(); g.fillStyle = "#ff6b6b"; g.strokeStyle = "#ffffff"; g.lineWidth = 12; g.beginPath(); g.ellipse(160, -260, 150, 185, 0.08, 0, TAU2); g.stroke(); g.fill(); g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(110, -330, 34, 56, 0.4, 0, TAU2); g.fill(); }
  S(() => { g.beginPath(); g.roundRect(-70, 740, 58, 124, 22); }, "#2a2f40"); S(() => { g.beginPath(); g.roundRect(12, 740, 58, 124, 22); }, "#2a2f40");
  S(() => { g.beginPath(); g.ellipse(-46, 866, 46, 24, 0, 0, 7); }, "#eef2f8"); S(() => { g.beginPath(); g.ellipse(46, 866, 46, 24, 0, 0, 7); }, "#eef2f8");
  S(() => { g.beginPath(); g.moveTo(-122, 772); g.quadraticCurveTo(-156, 604, -74, 566); g.lineTo(74, 566); g.quadraticCurveTo(156, 604, 122, 772); g.quadraticCurveTo(0, 800, -122, 772); g.closePath(); }, CLOTH);
  S(() => { g.beginPath(); g.ellipse(0, 400, 200, 182, 0, 0, 7); }, HAIR); S(() => { g.beginPath(); g.ellipse(0, 424, 172, 156, 0, 0, 7); }, SKIN);
  S(() => { g.beginPath(); g.ellipse(0, 400, 200, 182, 0, Math.PI, 2 * Math.PI); g.lineTo(176, 430); g.quadraticCurveTo(120, 338, 92, 398); g.quadraticCurveTo(44, 338, 4, 394); g.quadraticCurveTo(-40, 338, -88, 398); g.quadraticCurveTo(-124, 338, -176, 430); g.closePath(); }, HAIR);
  S(() => { g.beginPath(); g.ellipse(0, 372, 204, 196, 0, Math.PI, 2 * Math.PI); g.closePath(); }, o.hat || "#22252f"); S(() => { g.beginPath(); g.roundRect(-212, 326, 424, 62, 28); }, o.cuff || "#3a4056");
  g.lineJoin = "round"; g.strokeStyle = "#ffffff"; g.lineWidth = 22; shapes.forEach(q => { q.b(); g.stroke(); }); shapes.forEach(q => { q.b(); g.fillStyle = q.f; g.fill(); });
  const [lx, ly] = o.look || [0, 0], bl = 1 - 0.92 * clamp(o.blink || 0);
  [-68, 68].forEach(ex => { const cx = ex + lx * 13, cy = 452 + ly * 13; g.fillStyle = "#1b1e2c"; g.beginPath(); g.ellipse(cx, cy, 27, 35 * bl, 0, 0, 7); g.fill(); if (bl > 0.5) { g.fillStyle = "#fff"; g.beginPath(); g.arc(cx - 9 + lx * 4, cy - 14 + ly * 4, 10, 0, 7); g.fill(); g.beginPath(); g.arc(cx + 10, cy + 12, 5, 0, 7); g.fill(); } });
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
  g.lineCap = "round"; g.lineJoin = "round"; g.strokeStyle = "#ffffff"; g.lineWidth = 84 * s + 16; path(); g.stroke(); g.fillStyle = "#ffffff"; g.beginPath(); g.arc(0, 368 * s, 50 * s + 8, 0, 7); g.fill();
  g.strokeStyle = c; g.lineWidth = 84 * s; path(); g.stroke(); g.fillStyle = SPEC[6]; g.beginPath(); g.arc(0, 368 * s, 50 * s, 0, 7); g.fill(); g.restore();
}
// mascot with idle life: a slow bob and a blink every few seconds. T = global time.
function mascot(x, yFeet, s, T, o = {}) {
  const bob = Math.sin(T * 2.1) * 5 * s / 0.3 + (o.hop ? -Math.abs(Math.sin(T * 7)) * 26 * o.hop : 0), ph = (T + 1.3) % 3.4, blink = ph < 0.16 ? 1 - Math.abs(ph - 0.08) / 0.08 : 0;
  chibi(x, yFeet + bob, s, { blink, ...o });
}
// eye position of a mascot drawn at (x, yFeet, s): used for sight lines
const eyeOf = (x, yFeet, s) => ({ x, y: yFeet - (890 - 452) * s });

// ---------- sky and landscape ----------
const NOON = { top: [26, 80, 186], mid: [66, 136, 232], bot: [168, 206, 250] };
const DUSK = { top: [20, 26, 74], mid: [150, 82, 112], bot: [255, 150, 70] };
const SPACE = [5, 8, 18];
// e: 1 = sun high, 0 = sun on the horizon. air: 1 = normal atmosphere, 0 = no air (black sky)
function sky(e, air = 1, y1 = H) {
  const u = ss(e), k = c => mix(SPACE, c, air);
  vgrad([[0, k(mix(DUSK.top, NOON.top, u))], [0.62, k(mix(DUSK.mid, NOON.mid, u))], [1, k(mix(DUSK.bot, NOON.bot, u))]], 0, y1);
}
const airMass = e => 1 / (Math.sin(clamp(e) * 1.05) + 1 / AIRMASS_HORIZON);   // 38 on the horizon, about 1 overhead
