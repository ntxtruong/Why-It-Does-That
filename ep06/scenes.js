// Episode 6 (Short, 1080×1920) — Why do water drops dance on a hot pan?
// One macro cross-section of a drop on a pan, driven by a thermometer on the left.
// Pure functions of time: drop shapes are closed-form, steam tracers move on fixed paths (seeded hash), no integration.
// Safe zone (Shorts UI): key content stays above y = 1536 and left of x = 940.

const PY = 1010, PX0 = 70, PX1 = 1010, CX = 540;          // pan top, pan extent, drop home
const T_TICK = 200, T_MIN = 100, T_MAX = 300;               // thermometer scale (°C)
const TH = { x: 70, y0: 430, y1: 900 };                     // thermometer tube (screen space)
const tempY = c => lerp(TH.y1, TH.y0, clamp((c - T_MIN) / (T_MAX - T_MIN)));

// ---------- camera: world → screen, keeps world point (fx, fy) at screen (sx, sy) ----------
function cam(s, fx, fy, sx, sy) { g.setTransform(s, 0, 0, s, sx - fx * s, sy - fy * s); }
function uncam() { g.setTransform(1, 0, 0, 1, 0, 0); }

// ---------- pan ----------
function pan(temp, a = 1) {
  const u = clamp((temp - 100) / 180), metal = mix([86, 96, 127], [150, 92, 96], u);
  rrect(PX0 - 400, PY, PX1 - PX0 + 800, 66, 6, metal, a);
  rrect(PX0 - 400, PY + 66, PX1 - PX0 + 800, 18, 0, mix([60, 68, 96], [110, 70, 80], u), a);
  // strata lines inside the metal
  for (let i = 1; i < 3; i++) line(PX0 - 400, PY + i * 22, PX1 + 400, PY + i * 22, mix([110, 120, 150], [190, 120, 110], u), a * 0.35, 2);
  line(PX0 - 400, PY + 1, PX1 + 400, PY + 1, mix(QUIETc, GOLDc, u), a * (0.5 + 0.5 * u), 4);   // hot top edge (thin, not a glow)
}

// ---------- the drop ----------
// cx = centre x, R = size, gap = vapour gap under it (world px), flat = 0 (round Leidenfrost) .. 1 (spread, touching)
function dropPath(cx, R, gap, flat, pocket) {
  const rx = R * lerp(1.12, 1.55, flat), ryT = R * lerp(0.86, 0.5, flat), ryB = R * lerp(0.46, 0.12, flat);
  const base = PY - gap, cy = base - ryB * 0.9, pts = [];
  for (let k = 0; k <= 72; k++) {
    const f = k / 72 * TAU2, c = Math.cos(f), s = Math.sin(f);
    let x = cx + rx * c, y = s < 0 ? cy + ryT * s : cy + ryB * s;
    if (y > base) y = base;
    if (s > 0) y -= pocket * Math.pow(Math.max(0, 1 - Math.pow((x - cx) / (rx * 0.8), 2)), 2);   // vapour pocket: the drop's belly is lifted in the middle
    pts.push([x, y]);
  }
  return { pts, rx, cy, base, ryT };
}
function drop(cx, R, gap, flat, a = 1, o = {}) {
  if (a <= 0.01 || R < 1) return null;
  const P = dropPath(cx, R, gap, flat, o.pocket ?? (1 - flat) * gap * 0.8);
  g.save(); g.globalAlpha = a; g.beginPath(); P.pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
  const gr = g.createLinearGradient(0, P.cy - P.ryT, 0, P.base); gr.addColorStop(0, "rgb(186,222,255)"); gr.addColorStop(1, "rgb(108,170,236)");
  g.fillStyle = gr; g.fill(); g.strokeStyle = css(INKc, 0.85); g.lineWidth = Math.max(2, R * 0.03); g.stroke();
  g.clip();
  // highlight
  g.fillStyle = "rgba(242,245,251,0.55)"; g.beginPath(); g.ellipse(cx - P.rx * 0.38, P.cy - P.ryT * 0.5, P.rx * 0.18, P.ryT * 0.16, -0.5, 0, TAU2); g.fill();
  // contact boiling: bubbles nucleate at the bottom and rise (fixed seeds)
  if (o.boil > 0.01) for (let i = 0; i < 26; i++) {
    const ph = (hash(i, 4) + (o.t || 0) * (1.1 + hash(i, 5))) % 1, bx = cx + (hash(i, 6) - 0.5) * P.rx * 1.6, by = lerp(P.base - 4, P.cy - P.ryT * 0.6, ph);
    const r = R * (0.03 + 0.07 * ph);
    g.globalAlpha = a * o.boil * (1 - ph * 0.6); g.strokeStyle = css(INKc, 0.9); g.lineWidth = Math.max(1.5, R * 0.015); g.beginPath(); g.arc(bx, by, r, 0, TAU2); g.stroke();
  }
  g.restore();
  return P;
}
// steam rising above a boiling drop: soft wisps (thin curved strokes, no particles)
function wisps(cx, top, R, t, a) {
  if (a <= 0.01) return;
  for (let i = 0; i < 6; i++) {
    const ph = (hash(i, 9) + t * 0.7) % 1, x = cx + (i - 2.5) * R * 0.32, y = top - ph * R * 1.6;
    g.save(); g.globalAlpha = a * (1 - ph) * 0.7; g.strokeStyle = css(QUIETc); g.lineWidth = Math.max(3, R * 0.04); g.lineCap = "round";
    g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + R * 0.18, y - R * 0.2, x - R * 0.18, y - R * 0.4, x, y - R * 0.6); g.stroke(); g.restore();
  }
}
// the vapour cushion: a pale layer and tracers streaming outward from under the drop, curling up at the rim
function cushion(P, cx, gap, t, a, lw = 3) {
  if (!P || a <= 0.01 || gap < 0.3) return;
  g.save(); g.globalAlpha = a * 0.35; g.fillStyle = css(BLUEc); g.fillRect(cx - P.rx * 0.95, PY - gap, P.rx * 1.9, gap); g.restore();
  for (let i = 0; i < 90; i++) {
    const side = i % 2 ? 1 : -1, u = (hash(i, 11) + t * 0.55) % 1, h = hash(i, 12);
    let x = cx + side * u * P.rx * 1.05, y = PY - gap * (0.2 + 0.6 * h);
    if (u > 0.82) { const k = (u - 0.82) / 0.18; x += side * k * P.rx * 0.08; y -= k * k * gap * 6; }
    dot(x, y, lw, BLUEc, a * (u > 0.82 ? 1 - (u - 0.82) / 0.18 : 0.95));
  }
}
// heat arrows from the pan; blocked = 0..1 (they stop at the cushion and fade)
function heatArrows(cx, rx, gap, blocked, a) {
  if (a <= 0.01) return;
  for (let i = 0; i < 5; i++) {
    const x = cx + (i - 2) * rx * 0.36, y0 = PY + 56, y1 = lerp(PY - rx * 0.5, PY - gap * 0.2, blocked);
    arrow(x, y0, x, y1, CORALc, a * lerp(1, 0.75, blocked), 8, 24);
  }
}

// ---------- UI (screen space) ----------
function thermo(temp, a = 1, hot = 0) {
  if (a <= 0.01) return;
  rrect(TH.x - 22, TH.y0 - 30, 44, TH.y1 - TH.y0 + 60, 22, PANELc, a, QUIETc, 4);
  dot(TH.x, TH.y1 + 46, 40, mix(QUIETc, CORALc, clamp((temp - 100) / 150)), a);
  const yy = tempY(temp); rrect(TH.x - 10, yy, 20, TH.y1 + 30 - yy, 10, mix(QUIETc, CORALc, clamp((temp - 100) / 150)), a);
  const ty = tempY(T_TICK); line(TH.x - 30, ty, TH.x + 30, ty, GOLDc, a, 6);
  text("≈ 200 °C", TH.x + 44, ty, 42, GOLD, "left", 800, a);
  text(`${Math.round(temp)} °C`, TH.x + 44, yy, 40, QUIET, "left", 700, a * (1 - hot) * clamp(Math.abs(yy - ty) / 30 - 1));
}
function timerPlate(s, x, y, col, a) { plate(s, x, y, 54, col, "center", a, 800); }
// the falling drop entry (rhyme of the first and last shots): returns y offset of the drop's base above the pan
const fall = (t, t0, d = 0.9) => { const u = clamp((t - t0) / d); return u < 1 ? (1 - u * u) * 1100 : 0; };
const landSquash = (t, t0) => { const u = t - t0; return u <= 0 ? 0 : Math.exp(-6 * u) * Math.sin(16 * u) * 0.25; };
const MAS = (T, o = {}) => mascot3(o.x ?? 220, o.y ?? 1525, o.s ?? 0.36, T, o);
// the opening drop drifts down under the question (visible from the first frame) and lands at tl
const fallSlow = (t, tl) => { const u = clamp(t / tl); return (1 - u * u) * 450; };

const SCENES = {};

// 1–3 — hook: a drop falls, a hot pan makes it vanish in about a second; hotter pan, it skates for over a minute
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette(0.4);
  // first drop: drifts down under the question, lands, boils away in ~1 s (display time)
  const land1 = Math.max(0.9, B(1) - 0.2), gone1 = land1 + 1.6;
  const tUp0 = gone1 + 0.3, tUp1 = B(2) + 0.2, drop2 = B(2) - 0.1;
  const temp = lerp(160, 240, seg(t, tUp0, tUp1));
  cam(1.25, CX, PY, 560, 1080);
  pan(temp);
  if (t < gone1 + 0.2) {
    const y = fallSlow(t, land1), u = clamp((t - land1) / (gone1 - land1)), R = 105 * Math.sqrt(1 - u), flat = y > 0 ? 0 : seg(t, land1, land1 + 0.25);
    g.save(); g.translate(0, -y); const P = drop(CX, R, 0, flat, 1, { boil: flat, t }); g.restore();
    if (P) wisps(CX, P.cy - P.ryT, 105, t, flat * (1 - u * 0.5));
    if (y === 0) heatArrows(CX, 140, 0, 0, 0.6 * (1 - u));
  }
  uncam();
  timerPlate("gone in ≈ 1 s", 560, 300, CORAL, win(t, land1 + 0.2, B(2) - 0.1, 0.35));
  cam(1.25, CX, PY, 560, 1080);
  // second drop: hotter pan, it lands, rounds up and skates; a clock runs at ×30
  if (t > drop2 - 0.9) {
    const y = fall(t, drop2 - 0.9), sk = Math.sin((t - drop2) * 0.9) * 110 * seg(t, drop2 + 0.3, drop2 + 1.2);
    const R = 100 * (1 + landSquash(t, drop2) * 0.3), gap = 3;
    g.save(); g.translate(0, -y); const P = drop(CX + sk, R, gap, 0, 1, {}); g.restore();
    if (y === 0) cushion(P, CX + sk, gap, t, 0.7, 2.2);
    const secs = Math.max(0, (t - drop2) * 30), mm = Math.floor(secs / 60), sS = Math.floor(secs % 60);
    uncam();
    timerPlate(`still here: ${mm}:${String(sS).padStart(2, "0")}`, 560, 300, GOLD, seg(t, drop2 + 0.2, drop2 + 0.6));
    text("clock ×30", 560, 392, 40, QUIET, "center", 600, seg(t, drop2 + 0.2, drop2 + 0.6));
  }
  uncam();
  thermo(temp, seg(t, 0.4, 1.0));
  MAS(T, { a: seg(t, B(1), B(1) + 0.6), look: t > drop2 ? [0.6, 0.2] : [0.5, 0.4], mouth: t > B(3) ? "o" : "smile" });
};

// 4 — cushion: dive under the drop; the bottom boils instantly; the steam is trapped; the drop floats
SCENES.cushion = (t, T, B, E, dur) => {
  clear(); vignette(0.4);
  const temp = 240, zoom = lerp(1.25, 3.0, eio((t - 0.1) / 2.2)), sk = Math.sin((t + 6) * 0.9) * 110 * (1 - eio(t / 1.6));
  const gapW = lerp(3, 13, seg(t, 0.4, 2.4));
  const sy = lerp(1080, 1000, eio((t - 0.1) / 2.2));
  cam(zoom, CX + sk, PY, 580, sy);
  pan(temp); heatArrows(CX + sk, 120, gapW, 1, 0.55 * seg(t, 0.6, 1.2));
  const P = drop(CX + sk, 100, gapW, 0, 1, {});
  // the instant boiling at the underside: small vapour pulses leaving the belly
  for (let i = 0; i < 14; i++) { const ph = (hash(i, 21) + t * 1.4) % 1, x = CX + sk + (hash(i, 22) - 0.5) * 150; dot(x, PY - gapW * (1 - ph * 0.8), 1.4, INKc, (1 - ph) * win(t, 0.2, B(1) + 0.5, 0.4)); }
  cushion(P, CX + sk, gapW, t, seg(t, B(1) - 0.3, B(1) + 0.5), 1.1);
  // a hair, same scale as the gap, beside the drop
  const ha = seg(t, B(1) + 0.6, B(1) + 1.2);
  uncam();
  const gy = sy - gapW * zoom; // screen y of the gap top
  plate("past ≈ 200 °C (depends on the pan)", 580, 300, 48, GOLD, "center", win(t, 0.4, B(1) - 0.1, 0.4));
  plate("steam cushion", 580, 300, 56, BLUE, "center", seg(t, B(1) + 0.2, B(1) + 0.7) * (1 - seg(t, B(2) - 0.2, B(2) + 0.2)));
  // a hair drawn at the same scale as the gap, with its label
  if (ha > 0.01) { rrect(250, 395 - gapW * zoom / 2, 180, gapW * zoom, gapW * zoom / 2, [176, 120, 72], ha); text("≈ a hair's width", 460, 395, 44, QUIET, "left", 700, ha); }
  // "no contact" bracket in the last beat
  const nc = seg(t, B(2), B(2) + 0.5);
  if (nc > 0.01) { line(150, sy, 930, sy, GOLDc, nc, 4, [14, 12]); line(150, gy, 930, gy, GOLDc, nc, 4, [14, 12]); plate("never touches", 580, 300, 60, GOLD, "center", nc, 800); }
  thermo(temp, 1, 0);
};

// 5 — why: pull back; heat is blocked by the cushion; with no friction the drop glides
SCENES.why = (t, T, B, E, dur) => {
  clear(); vignette(0.4);
  const temp = 240, zoom = lerp(3.0, 1.6, eio(t / 1.6)), glide = Math.sin(t * 1.1) * 150 * seg(t, B(1) - 0.3, B(1) + 0.6);
  const gapW = lerp(13, 6, seg(t, 0, 1.6));
  cam(zoom, CX, PY, 560, lerp(1000, 1080, eio(t / 1.6)));
  pan(temp);
  heatArrows(CX + glide, 120, gapW, 1, 0.8 * (1 - seg(t, B(1) - 0.2, B(1) + 0.3)));
  // a faint trail behind the gliding drop (no streaks: three ghost copies at lagged times)
  [0.36, 0.24, 0.12].forEach((lag, k) => { const gx = Math.sin((t - lag) * 1.1) * 150 * seg(t - lag, B(1) - 0.3, B(1) + 0.6); drop(CX + gx, 100, gapW, 0, 0.12 + k * 0.08, {}); });
  const P = drop(CX + glide, 100, gapW, 0, 1, {});
  cushion(P, CX + glide, gapW, t, 0.9, 1.6);
  uncam();
  plate("steam blocks the heat", 560, 300, 56, BLUE, "center", win(t, B(0) + 0.6, B(1) - 0.1, 0.4));
  plate("no friction → it glides", 560, 300, 56, GOLD, "center", seg(t, B(1) + 0.3, B(1) + 0.8));
  thermo(temp, 1);
  MAS(T, { a: 1, rot: -0.08 * seg(t, B(1), B(1) + 0.8), look: [0.7 * Math.sign(glide || 1), 0.3], mouth: "smile" });
};

// 6–7 — end: the name; cool the pan, the cushion collapses, the drop boils away; a new drop falls (rhyme of shot 1)
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette(0.4);
  const cool0 = B(1) + 0.2, cool1 = cool0 + 1.4, temp = lerp(240, 150, seg(t, cool0, cool1));
  const coll = seg(t, cool1 - 0.5, cool1), gone = cool1 + 1.2;
  const zoom = 1.6 * (1 - seg(t, cool0, cool0 + 1.0)) + 1 * seg(t, cool0, cool0 + 1.0);
  const kz = seg(t, cool0, cool0 + 1.0); cam(lerp(1.6, 1.25, kz), CX, PY, 560, 1080);
  pan(temp);
  if (t < gone + 0.1) {
    const u = clamp((t - cool1) / (gone - cool1)), R = 100 * Math.sqrt(1 - u), gap = lerp(6, 0, coll);
    const glide = Math.sin((t + 3) * 1.1) * 120 * (1 - coll);
    const P = drop(CX + glide, R, gap, coll * 0.8, 1, { boil: coll, t });
    cushion(P, CX + glide, gap, t, 0.9 * (1 - coll), 1.6);
    if (P) wisps(CX + glide, P.cy - P.ryT, 100, t, coll * (1 - u * 0.4));
  }
  // closing: a new drop falls into frame and hovers (the question stays open)
  const t3 = B(2) - 0.6;
  if (t > t3) { const y = fall(t, t3, 1.0) * 0.6; g.save(); g.translate(0, -y); drop(CX, 95, 3, 0, 1, {}); g.restore(); }
  uncam();
  plate("THE LEIDENFROST EFFECT", 560, 290, 62, GOLD, "center", win(t, 0.2, B(1) + 0.4, 0.4), 800);
  plate("named after J. G. Leidenfrost · 1756", 560, 385, 42, QUIET, "center", win(t, 0.6, B(1) + 0.4, 0.4), 600);
  plate("cooler pan → cushion collapses", 560, 300, 54, CORAL, "center", win(t, cool0 + 0.4, B(2) - 0.4, 0.4));
  thermo(temp, 1 - seg(t, B(2) - 0.8, B(2) - 0.3));
  MAS(T, { a: 1, look: [0.6, 0.3], mouth: t > cool1 - 0.3 && t < gone + 0.4 ? "wince" : "o" });
};
