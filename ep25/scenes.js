// Episode 25 (new Short, 1080×1920) — Why does toast land butter-side down?
// Physics (claims.md; Matthews 1995, Bacon et al. 2001): the slice pivots on the table rim, leaves with a spin ω set at the
// edge, then falls freely. Fall from h = 0.75 m: t = √(2h/g) ≈ 0.39 s. With the spin of a nudged slice it turns about half a
// turn in that time: butter up → butter down. Same ω from h = 3 m: the fall takes ≈ 0.78 s, about a full turn: butter up.
// Everything below is closed form in the world frame (metres, y up, table rim at x = 0) and drawn through a camera.
// Toast is drawn larger than life (0.2 m wide) so it reads on a phone; heights and times are the real ones.

const G = 9.81, HT = 0.75, HT3 = 3.0;           // table heights (m)
const TW = 0.2, TH = 0.028;                     // toast width and thickness (m)
const D0 = 0.035;                               // overhang of the toast centre past the rim when it starts to tip (m)
const TH1 = 28 * Math.PI / 180;                 // angle when it leaves the rim
const TIP = 0.22;                               // real time of the tipping phase (s)
const V0 = [0.32, -0.12];                       // velocity of the centre when it leaves the rim (m/s)
// centre when it leaves the rim (rotated about the rim point by TH1, clockwise)
function tipCentre(th, h) { const x = D0, y = TH / 2; return [x * Math.cos(th) + y * Math.sin(th), h - x * Math.sin(th) + y * Math.cos(th)]; }
function landTime(h) { const c = tipCentre(TH1, h), y0 = c[1] - TH / 2 - 0.004; // centre falls to about half a thickness above the floor
  return (V0[1] + Math.sqrt(V0[1] * V0[1] + 2 * G * y0)) / G; }
const TL75 = landTime(HT), TL3 = landTime(HT3);
const OMEGA = (Math.PI - TH1) / TL75;            // spin chosen so the 0.75 m fall ends at half a turn (Matthews: "about half")
const TURN3 = (TH1 + OMEGA * TL3) / TAU2;         // turns at landing from 3 m (computed, ≈ 0.94)
// toast state at real time tau (s) after it leaves the rim; tau < 0 = tipping (from -TIP), h = table height
function toast(tau, h) {
  if (tau <= 0) { const th = TH1 * ss(1 + tau / TIP) ** 1.2; const c = tipCentre(th, h); return { x: c[0], y: c[1], th, landed: 0 }; }
  const tl = landTime(h), c0 = tipCentre(TH1, h);
  const tf = Math.min(tau, tl);
  let x = c0[0] + V0[0] * tf, y = c0[1] + V0[1] * tf - 0.5 * G * tf * tf, th = TH1 + OMEGA * tf;
  let landed = 0;
  if (tau > tl) {   // after touchdown: settle flat on the nearest face within 0.12 s, slide a little
    const u = clamp((tau - tl) / 0.12), flat = Math.round(th / Math.PI) * Math.PI;
    th = lerp(th, flat, eout(u)); y = lerp(y, TH / 2, eout(u)); x += 0.08 * eout(clamp((tau - tl) / 0.3)); landed = u;
  }
  return { x, y, th, landed };
}
const butterDown = th => Math.cos(th) < 0;       // butter on the local top face

// ---- camera: world (m) → screen (px); keyframes are [scale px/m, world focus x, y, screen x, y]
let CAM = { s: 900, fx: 0, fy: 0, px: 600, py: 1250 };
const camAt = (s, fx, fy, px = 600, py = 1250) => ({ s, fx, fy, px, py });
const camMix = (a, b, u) => ({ s: Math.exp(lerp(Math.log(a.s), Math.log(b.s), u)), fx: lerp(a.fx, b.fx, u), fy: lerp(a.fy, b.fy, u), px: lerp(a.px, b.px, u), py: lerp(a.py, b.py, u) });
const X = x => CAM.px + (x - CAM.fx) * CAM.s, Y = y => CAM.py - (y - CAM.fy) * CAM.s;
const FULL = camAt(900, 0, 0, 600, 1250);                    // whole table, floor at 1250
const CLOSE = camAt(2600, 0.03, HT, 560, 900);        // frame one: the rim and the slice, big

// ---- drawing ----
const WOOD = [168, 112, 70], WOOD2 = [128, 80, 48], WOOD3 = [196, 140, 92];
const CRUST = [150, 92, 40], CRUMB = [232, 178, 104], CRUMB2 = [214, 152, 78], BUTTER = [255, 222, 92], BUTTER2 = [255, 238, 160];
function kitchen() {
  clear(BG);
  const gr = g.createRadialGradient(560, 760, 80, 560, 760, 900);
  gr.addColorStop(0, "rgb(74,102,170)"); gr.addColorStop(0.65, "rgb(46,68,126)"); gr.addColorStop(1, "rgb(24,38,79)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
function floor() {
  const y = Y(0);
  if (y > H) return;
  const fg = g.createLinearGradient(0, y, 0, y + 260); fg.addColorStop(0, "rgb(206,214,232)"); fg.addColorStop(1, "rgb(150,164,198)");
  g.fillStyle = fg; g.fillRect(0, y, W, H - y);
  // tiles, seen at a slant
  g.strokeStyle = "rgba(110,124,160,0.55)"; g.lineWidth = 3;
  for (let i = -12; i <= 12; i++) { const x0 = X(i * 0.3); g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + (x0 - 540) * 0.6, y + 300); g.stroke(); }
  [0.32, 0.75].forEach(k => { g.beginPath(); g.moveTo(0, y + 300 * k * k); g.lineTo(W, y + 300 * k * k); g.stroke(); });
  g.fillStyle = "rgba(240,244,252,0.9)"; g.fillRect(0, y - 3, W, 6);
}
function table(h) {
  const top = Y(h), th = Math.max(10, 0.04 * CAM.s), lx = X(-0.07);
  // leg near the rim and the far end beyond the left edge of the frame
  const lw = Math.max(10, 0.05 * CAM.s);
  const lg = g.createLinearGradient(lx - lw, 0, lx, 0); lg.addColorStop(0, css(WOOD2)); lg.addColorStop(1, css(WOOD));
  g.fillStyle = lg; g.fillRect(lx - lw, top, lw, Y(0) - top);
  g.fillStyle = "rgba(14,22,48,0.35)"; g.beginPath(); g.ellipse(lx - lw / 2, Y(0) + 4, lw * 1.4, 7, 0, 0, TAU2); g.fill();
  // apron and top
  g.fillStyle = css(WOOD2); g.fillRect(-20, top + th, X(-0.02) + 20, Math.max(8, 0.06 * CAM.s));
  const tg = g.createLinearGradient(0, top, 0, top + th); tg.addColorStop(0, css(WOOD3)); tg.addColorStop(1, css(WOOD));
  g.fillStyle = tg; g.beginPath(); g.roundRect(-40, top, X(0) + 40, th, [0, th * 0.35, th * 0.35, 0]); g.fill();
  g.strokeStyle = css([240, 220, 190], 0.8); g.lineWidth = Math.max(2, th * 0.12); g.beginPath(); g.moveTo(-40, top + 1); g.lineTo(X(0) - th * 0.3, top + 1); g.stroke();
  // a plate sitting on the table, for scale
  const px = X(-0.32), pw = 0.24 * CAM.s;
  g.fillStyle = "rgba(240,244,252,0.95)"; g.beginPath(); g.ellipse(px, top - 0.006 * CAM.s, pw / 2, Math.max(3, 0.012 * CAM.s), 0, 0, TAU2); g.fill();
}
// the slice at state S (world). a = alpha. Butter on the local top: a spread layer plus a melting pat.
function slice(S, a = 1, big = 1) {
  if (a <= 0.01) return;
  const cx = X(S.x), cy = Y(S.y), k = CAM.s * big, w = TW * k, t = TH * k;
  g.save(); g.globalAlpha = a; g.translate(cx, cy); g.rotate(S.th);    // screen y is down, so +th turns clockwise
  // shadow-side crust, crumb, then butter
  g.fillStyle = css(CRUST); g.beginPath(); g.roundRect(-w / 2, -t / 2, w, t, t * 0.45); g.fill();
  g.fillStyle = css(CRUMB); g.beginPath(); g.roundRect(-w / 2 + t * 0.18, -t / 2 + t * 0.16, w - t * 0.36, t * 0.62, t * 0.3); g.fill();
  g.fillStyle = css(CRUMB2); for (let i = 0; i < 7; i++) { const u = -0.42 + i * 0.14; g.beginPath(); g.arc(u * w, t * 0.02, t * 0.08, 0, TAU2); g.fill(); }
  g.fillStyle = css(BUTTER); g.beginPath(); g.roundRect(-w / 2 + t * 0.15, -t / 2 - t * 0.2, w - t * 0.3, t * 0.34, t * 0.17); g.fill();
  // the pat, slightly melted, and a highlight
  g.beginPath(); g.moveTo(-w * 0.17, -t / 2 - t * 0.1); g.quadraticCurveTo(-w * 0.17, -t / 2 - t * 1.05, -w * 0.05, -t / 2 - t * 1.1);
  g.lineTo(w * 0.12, -t / 2 - t * 1.1); g.quadraticCurveTo(w * 0.2, -t / 2 - t * 1.0, w * 0.21, -t / 2 - t * 0.1); g.closePath(); g.fill();
  g.fillStyle = css(BUTTER2); g.beginPath(); g.roundRect(-w * 0.1, -t / 2 - t * 0.95, w * 0.17, t * 0.22, t * 0.1); g.fill();
  g.strokeStyle = css([120, 70, 30], 0.6); g.lineWidth = Math.max(2, t * 0.08); g.beginPath(); g.roundRect(-w / 2, -t / 2, w, t, t * 0.45); g.stroke();
  g.restore();
}
// faint copies of the slice at earlier times (a strobe trail: what the eye would see in a long exposure)
function strobe(tau, h, n, dt, a, big = 1) {
  for (let i = n; i >= 1; i--) { const tt = tau - i * dt; if (tt < -TIP) continue; slice(toast(tt, h), a * (1 - i / (n + 1)) * 0.5, big); }
}
function splat(S, a) {
  if (a <= 0.01 || !butterDown(S.th)) return;
  const x = X(S.x), y = Y(0) + 4, w = TW * CAM.s;
  g.save(); g.globalAlpha = a; g.fillStyle = css(BUTTER, 0.9);
  g.beginPath(); g.ellipse(x, y, w * 0.62 * eout(a), Math.max(6, w * 0.06), 0, 0, TAU2); g.fill();
  [-0.55, 0.62].forEach((u, i) => { g.beginPath(); g.ellipse(x + u * w * eout(a), y + 3, w * 0.06, w * 0.03, 0, 0, TAU2); g.fill(); });
  g.restore();
}
// the turn dial: fraction of a turn, with a small slice icon that turns with it
function dial(cx, cy, r, turns, a, label) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  g.fillStyle = "rgba(24,34,70,0.92)"; g.beginPath(); g.arc(cx, cy, r + 18, 0, TAU2); g.fill();
  g.strokeStyle = "rgba(170,183,209,0.45)"; g.lineWidth = 16; g.beginPath(); g.arc(cx, cy, r, 0, TAU2); g.stroke();
  g.strokeStyle = css(GOLDc); g.lineCap = "round"; g.beginPath(); g.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + TAU2 * Math.max(0.001, turns)); g.stroke();
  [0, 0.25, 0.5, 0.75].forEach(f => { const an = -Math.PI / 2 + f * TAU2; line(cx + Math.cos(an) * (r - 22), cy + Math.sin(an) * (r - 22), cx + Math.cos(an) * (r + 22), cy + Math.sin(an) * (r + 22), INKc, 0.7, 4); });
  // icon: slice turned by the same angle (butter yellow on top at 0)
  const w = r * 0.95, t = r * 0.16;
  g.translate(cx, cy); g.rotate(turns * TAU2);
  g.fillStyle = css(CRUST); g.beginPath(); g.roundRect(-w / 2, -t / 2, w, t, t * 0.4); g.fill();
  g.fillStyle = css(BUTTER); g.beginPath(); g.roundRect(-w / 2 + 4, -t / 2 - t * 0.45, w - 8, t * 0.5, t * 0.25); g.fill();
  g.restore();
  if (label) plate(label, cx, cy + r + 66, 52, GOLD, "center", a, 900);
}
function stopwatch(cx, cy, secs, a) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  g.fillStyle = "rgba(24,34,70,0.92)"; g.beginPath(); g.roundRect(cx - 150, cy - 56, 300, 112, 26); g.fill();
  g.strokeStyle = css(INKc, 0.9); g.lineWidth = 6; g.beginPath(); g.arc(cx - 92, cy, 30, 0, TAU2); g.stroke();
  g.beginPath(); g.moveTo(cx - 92, cy); g.lineTo(cx - 92 + 24 * Math.sin(secs * TAU2 * 2), cy - 24 * Math.cos(secs * TAU2 * 2)); g.stroke();
  g.fillRect(cx - 98, cy - 44, 12, 8);
  g.restore();
  text(secs.toFixed(2) + " s", cx + 38, cy + 3, 56, GOLD, "center", 900, a);
}
// a measuring tape along the leg, from the floor to the table top, with its value
function tape(h, a, label, x = -0.17) {
  if (a <= 0.01) return;
  const x0 = X(x), y0 = Y(0), y1 = Y(h);
  g.save(); g.globalAlpha = a;
  g.fillStyle = css(GOLDc); g.fillRect(x0 - 9, y1, 18, y0 - y1);
  g.strokeStyle = "rgba(24,38,79,0.85)"; g.lineWidth = 3;
  const step = h > 1.5 ? 0.25 : 0.05;
  for (let m = 0; m <= h + 1e-6; m += step) { const yy = Y(m), big = Math.abs(m / (h > 1.5 ? 1 : 0.25) - Math.round(m / (h > 1.5 ? 1 : 0.25))) < 1e-6; g.beginPath(); g.moveTo(x0 - 9, yy); g.lineTo(x0 - 9 + (big ? 18 : 9), yy); g.stroke(); }
  g.restore();
  if (label) plate(label, x0 - 24, lerp(y0, y1, 0.5), 52, GOLD, "right", a, 900);
}
function strike(x, y, w, a) { if (a <= 0.01) return; line(x - w / 2 - 10, y + 8, x - w / 2 - 10 + (w + 20) * eout(a), y - 8, CORALc, 1, 9); }

const look = [0.9, -0.5];
const SCENES = {};

// 1 — hook: frame one = the slice tipping off the rim, close and big. It falls (slowed 4×), the camera follows it down,
// it lands butter down. Then "bad luck" and "heavy butter" are crossed out.
const SLOW = 4;
SCENES.hook = (t, T, B, E, dur) => {
  const tau = (t - 0.05) / SLOW - TIP * 0.55;           // frame one: already part-way through the tip
  const S = toast(tau, HT);
  const follow = seg(t, 0.35, 0.35 + (TL75 + TIP * 0.55) * SLOW + 0.1);
  CAM = camMix(CLOSE, camAt(1150, 0.12, 0.25, 600, 1060), follow);
  kitchen(); table(HT); floor();
  strobe(tau, HT, 4, 0.045, seg(t, 0.4, 0.9) * (1 - seg(t, B(1) - 0.4, B(1) + 0.4)));
  splat(S, S.landed > 0 ? seg(tau, TL75, TL75 + 0.15) : 0);
  slice(S);
  const k = seg(t, B(1) + 0.1, B(1) + 0.5), k2 = seg(t, B(1) + 1.0, B(1) + 1.4);
  plate("bad luck", 720, 760, 58, INK, "center", k, 900); strike(720, 760, 250, seg(t, B(1) + 0.6, B(1) + 0.95));
  plate("heavy butter", 720, 900, 58, INK, "center", k2, 900); strike(720, 900, 370, seg(t, E(1) - 1.1, E(1) - 0.75));
  if (S.landed > 0.5) plate("butter down", X(S.x) + 10, Y(0) - 120, 48, CORAL, "center", seg(t, 2.2, 2.6) * (1 - seg(t, B(1), B(1) + 0.3)), 900);
  MASR(T, t, { ev: [[0.5, "!"], [B(1) + 0.7, "?"]], look, mouth: "o" });
};

// 2 — answer: pull back to the whole table; the slice flies back up onto the rim (rewind); a tape measures 75 cm
SCENES.answer = (t, T, B, E, dur) => {
  CAM = camMix(camAt(1150, 0.12, 0.25, 600, 1060), FULL, seg(t, 0, 1.0));
  kitchen(); table(HT); floor();
  const rw = seg(t, 0.0, 1.1);                          // rewind: real time runs backwards from the landing to the start of the tip
  const tau = lerp(TL75 + 0.3, -TIP, eio(rw));
  slice(toast(tau, HT));
  tape(HT, seg(t, 0.8, 1.3), "75 cm");
  const kk = spring(t, B(0) + 1.1, 10, 0.6);
  plate("table height", 600, 470, 64, GOLD, "center", clamp(kk, 0, 1), 900);
  MASR(T, t, { ev: [[B(0) + 1.1, "idea", "smile"]], look, mouth: "o" });
};

// 3 — tip: slow motion at the rim; a curved arrow shows the spin; then the fall with the stopwatch running in real time
const SLOW3 = 6;
SCENES.tip = (t, T, B, E, dur) => {
  // beat 0: the tip itself, very slow, camera close on the rim; beat 1: the fall, stopwatch 0 → 0.39 s
  const t1 = B(1);
  let tau;
  if (t < t1) tau = lerp(-TIP, 0, ss((t - 0.2) / (t1 - 0.4)));
  else tau = Math.min(TL75 + 0.25, (t - t1 - 0.2) / SLOW3 * 1.0);
  tau = Math.max(-TIP, tau);
  const zoom = 1 - seg(t, t1 - 0.3, t1 + 0.6);
  CAM = camMix(FULL, camAt(1700, 0.03, HT - 0.03, 600, 760), zoom * seg(t, 0, 0.8) + (t < 0.8 ? 0 : 0));
  kitchen(); table(HT); floor();
  const S = toast(tau, HT);
  if (t > t1) strobe(tau, HT, 5, 0.04, 0.9 * (1 - seg(t, dur - 1.0, dur - 0.4)));
  splat(S, S.landed > 0 ? seg(tau, TL75, TL75 + 0.15) : 0);
  slice(S);
  // pivot mark and the spin arrow
  const pa = win(t, 0.5, t1 + 0.2, 0.3);
  if (pa > 0.01) { dot(X(0), Y(HT), 12, GOLDc, pa); g.save(); g.globalAlpha = pa; g.strokeStyle = css(GOLDc); g.lineWidth = 9; g.lineCap = "round";
    const r = 0.13 * CAM.s, a0 = -2.2, a1 = lerp(a0, -0.35, seg(t, 0.9, 2.2)); g.beginPath(); g.arc(X(0.02), Y(HT + 0.01), r, a0, a1); g.stroke();
    const ex = X(0.02) + r * Math.cos(a1), ey = Y(HT + 0.01) + r * Math.sin(a1); poly([[ex - 22, ey - 18], [ex, ey], [ex - 26, ey + 10]], GOLDc, 1, 9); g.restore(); }
  plate("pivots on the rim", 560, 470, 54, GOLD, "center", win(t, 0.6, t1, 0.3), 900);
  plate("spin", X(0.02) + 0.17 * CAM.s, Y(HT + 0.12), 50, GOLD, "center", win(t, 1.6, t1, 0.3), 900);
  // real time of the fall
  const secs = clamp(tau, 0, TL75) * Math.sqrt(2 * HT / G) / TL75;   // shown as the textbook fall time, 0.39 s at landing
  stopwatch(770, 480, secs, seg(t, t1, t1 + 0.4) * (1 - seg(t, dur - 0.5, dur)));
  plate("short fall", 770, 600, 46, INK, "center", seg(t, t1 + 2.2, t1 + 2.6) * (1 - seg(t, dur - 0.5, dur)), 800);
  MASR(T, t, { ev: [[0.7, "?"], [E(1) - 0.3, "!", "grin"]], look, mouth: "o" });
};

// 4 — half: replay of the fall with the turn dial; the butter face goes from up to down; landing, splat
SCENES.half = (t, T, B, E, dur) => {
  CAM = FULL;
  kitchen(); table(HT); floor();
  const tau = clamp((t - 0.3) / 5.2, 0, 1) * (TL75 + TIP + 0.25) - TIP;
  const S = toast(tau, HT);
  strobe(tau, HT, 6, 0.045, 0.85);
  splat(S, S.landed > 0 ? seg(tau, TL75, TL75 + 0.15) : 0);
  slice(S);
  const turns = clamp(S.th / TAU2, 0, 0.5);
  dial(770, 580, 150, turns, seg(t, 0.1, 0.5), turns > 0.49 ? "½ turn" : null);
  const up = win(t, 0.3, B(1) + 0.6, 0.3), dn = seg(t, B(1) + 0.9, B(1) + 1.4);
  plate("butter up", 330, 470, 58, GOLD, "center", up, 900);
  plate("butter down", 330, 470, 58, CORAL, "center", dn * (1 - seg(t, dur - 0.4, dur)), 900);
  MASR(T, t, { ev: [[B(1) + 1.2, "!", "wince"]], look, mouth: "o" });
};

// 5 — tall: the table stretches to 3 m while the camera pulls back; the same spin now has time for almost a full turn
SCENES.tall = (t, T, B, E, dur) => {
  const st = seg(t, 0.1, 1.4);                          // stretch 0.75 m → 3 m
  const h = lerp(HT, HT3, st);
  CAM = camMix(FULL, camAt(268, 0, 0, 600, 1250), st);
  kitchen(); table(h); floor();
  const ft0 = 1.6, tau = t < ft0 ? -TIP : Math.min(TL3 + 0.3, (t - ft0) / (dur - ft0 - 0.9) * (TL3 + TIP + 0.2) - TIP);
  const S = toast(tau, h);
  const BIG = lerp(1, 2.4, st);                        // the slice is drawn 2.4× larger here so it stays readable at this zoom
  if (t > ft0) strobe(tau, h, 7, 0.06, 0.8, BIG);
  slice({ ...S, y: S.y + TH / 2 * (BIG - 1) * S.landed }, 1, BIG);
  tape(h, seg(t, 0.2, 0.7), st > 0.98 ? "3 m" : (h * 100).toFixed(0) + " cm");
  const turns = clamp(S.th / TAU2, 0, TURN3);
  dial(770, 580, 150, turns, seg(t, ft0, ft0 + 0.4), turns > TURN3 - 0.01 ? "≈ 1 turn" : null);
  if (S.landed > 0.5) plate("butter up", X(S.x), Y(0) - 90, 48, GOLD, "center", seg(t, dur - 1.0, dur - 0.6), 900);
  MASR(T, t, { ev: [[0.5, "?"], [dur - 0.8, "ok", "grin"]], look, mouth: "o" });
};

// 6 — end: back to the normal table; the closing line; the last second is frame one again (close on the rim, tipping)
SCENES.end = (t, T, B, E, dur) => {
  const back = seg(t, dur - 2.0, dur - 1.1);
  CAM = camMix(FULL, CLOSE, back);
  kitchen(); table(HT); floor();
  // the slice rests on the table, then starts to tip as the camera arrives (matches hook t = 0)
  const tau0 = -TIP * 0.55 - 0.05 / SLOW;
  const tau = lerp(-TIP, tau0, seg(t, dur - 1.9, dur - 1.1));
  slice(toast(tau, HT));
  plate("blame the table", 560, 470, 60, GOLD, "center", win(t, 0.4, dur - 1.2, 0.35), 900);
  MASR(T, t, { ev: [[0.8, "ok", "grin"]], look, mouth: "o" });
};
