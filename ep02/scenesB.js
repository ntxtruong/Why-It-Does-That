// Scenes 4–6: the 1/λ⁴ rule, the blue sky, why not violet.
function ground(col = "#0c1426", a = 1) {
  g.save(); g.globalAlpha = a; g.fillStyle = col; g.beginPath(); g.moveTo(0, H); g.lineTo(0, 898); g.quadraticCurveTo(W / 2, 866, W, 898); g.lineTo(W, H); g.closePath(); g.fill();
  g.strokeStyle = "rgba(160,190,240,0.35)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 898); g.quadraticCurveTo(W / 2, 866, W, 898); g.stroke(); g.restore();
}
// a molecule being shaken by a passing wave and sending rings back out. str = strength of the rings (0..1)
function shaken(t, mx, my, col, lam, str, a, half = 440, tStop = 1e9) {
  if (a <= 0.01) return; const v = 300, P = lam / v / 2, push = -Math.cos(TAU2 * (mx - v * t) / lam);
  g.save(); g.beginPath(); g.rect(mx - half, 120, 2 * half, 760); g.clip();
  g.globalCompositeOperation = "lighter"; wave(mx - half, mx + half, my, 110, lam, v * t, col, a * 0.85, 8); g.globalCompositeOperation = "source-over";
  for (let k = Math.max(0, Math.ceil((t - 3.2) / P)); k * P < Math.min(t, tStop); k++) { const R = (t - k * P) * 250, ra = str * (1 - R / 620); if (ra <= 0.01) continue; g.globalAlpha = a * ra; g.strokeStyle = css(col); g.lineWidth = 4 + 6 * str; g.beginPath(); g.arc(mx, my, R, 0, TAU2); g.stroke(); }
  g.globalAlpha = 1; glow(mx, my + push * 54, 210, [130, 175, 255], 0.55 * a); molecule(mx, my, 48, 0, N2C, a); g.restore();
}
// monochromatic colour for the spectrum strip
const SPECTRUM = (() => { const o = []; for (let l = 400; l <= 700; l += 4) { const c = cmf(l), r = [3.2406 * c[0] - 1.5372 * c[1] - 0.4986 * c[2], -0.9689 * c[0] + 1.8758 * c[1] + 0.0415 * c[2], 0.0557 * c[0] - 0.2040 * c[1] + 1.0570 * c[2]].map(v => Math.max(0, v)), m = Math.max(...r, 1e-6), k = 0.45 + 0.55 * Math.min(1, m / 0.9); o.push([l, r.map(v => 255 * Math.pow(v / m, 1 / 2.2) * k)]); } return o; })();

SCENES.law = (t, T, B, E, dur) => {
  vgrad([[0, [8, 12, 28]], [1, [12, 20, 44]]]);
  const A = 1 - seg(t, B(2) - 0.6, B(2) - 0.1), C = win(t, B(2) - 0.3, B(4) - 0.1, 0.5), R = win(t, B(4) - 0.3, B(7) - 0.3, 0.5), Z = seg(t, B(7) - 0.5, B(7));
  // --- A: the same molecule under a long wave and a short wave
  if (A > 0) {
    shaken(t, 500, 500, RED.c, 420, 0.16, A); shaken(t, 1420, 500, BLUE.c, 270, 0.95, A);
    line(960, 150, 960, 850, "#ffffff", 0.18 * A, 3);
    const la = seg(t, B(1) - 0.1, B(1) + 0.6) * A, lb = seg(t, B(1) + 3.0, B(1) + 3.6) * A;
    plate("long wave, slow shake", 500, 700, 46, RED.c, "center", la); plate("short wave, fast shake", 1420, 700, 46, BLUE.c, "center", la);
    plate("a little light sent out", 500, 780, 44, INK, "center", lb); plate("far more light sent out", 1420, 780, 44, INK, "center", lb);
    mascot(960, 905, 0.26, T, { look: [Math.sin(t * 1.3) * 0.9, -0.6], a: A, mouth: t > B(1) + 3 ? "o" : "smile" });
  }
  // --- C: the curve
  if (C > 0) {
    const X = l => lerp(330, 1590, (l - 350) / 350), Y = v => lerp(820, 290, v / 16), f = l => Math.pow(700 / l, 4);
    g.save(); g.globalAlpha = C;
    SPECTRUM.forEach(([l, c]) => { g.fillStyle = css(c); g.fillRect(X(l), 828, X(l + 4) - X(l) + 1, 30); });
    g.fillStyle = "rgba(120,110,160,0.35)"; g.fillRect(X(350), 828, X(400) - X(350), 30); g.restore();
    line(X(350), 822, X(700) + 40, 822, QUIET, C, 3); line(X(350), 822, X(350), 250, QUIET, C, 3);
    text("350 nm", X(350), 890, 40, INK, "center", 600, C); text("450", X(450), 890, 40, BLUE.c, "center", 700, C * seg(t, B(3) - 0.2, B(3) + 0.4)); text("700 nm", X(700), 890, 40, RED.c, "center", 600, C);
    plate("ultraviolet", X(375) + 4, 770, 40, [190, 180, 230], "center", C * seg(t, B(2) + 2.2, B(2) + 2.8));
    const pc = seg(t, B(2) - 0.1, B(2) + 2.6), lEnd = lerp(700, 350, pc);
    g.save(); g.globalAlpha = C; g.strokeStyle = ACC; g.lineWidth = 8; g.lineCap = "round"; g.lineJoin = "round"; g.beginPath(); for (let l = 700; l >= lEnd; l -= 2) l === 700 ? g.moveTo(X(l), Y(f(l))) : g.lineTo(X(l), Y(f(l))); g.stroke(); g.restore();
    photon(X(lEnd), Y(f(lEnd)), [255, 209, 102], C, 9 + 3 * Math.sin(T * 6));
    const mark = (l, col, label, a, dx, dy, al) => { if (a <= 0.01) return; const x = X(l), y = Y(f(l)); line(x, 822, x, y, col, a * 0.8, 4, [12, 12]); g.save(); g.globalAlpha = a * 0.55; g.fillStyle = css(col); g.fillRect(x - 26, lerp(822, y, a), 52, 822 - lerp(822, y, a)); g.restore(); dot(x, y, 14, col, a); plate(label, x + dx, y + dy, 50, col, al, a, 800); };
    mark(700, RED.c, "red ×1", C * seg(t, B(2) + 0.3, B(2) + 0.9), -44, -62, "right");
    mark(350, [200, 185, 255], "half the wavelength: ×16", C * seg(t, B(2) + 2.5, B(2) + 3.1), 46, 6, "left");
    mark(450, BLUE.c, "blue: about ×6", C * seg(t, B(3) + 0.3, B(3) + 0.9), 50, -48, "left");
    mascot(1740, 905, 0.26, T, { look: [-0.9, -0.7], a: C, mouth: t > B(3) + 0.5 ? "o" : "smile" });
  }
  // --- R: a thousand photons of each colour, straight down through the whole atmosphere
  if (R > 0) {
    const top = 340, bot = 880, v = 520, t0 = B(4) + 2.6, span = B(7) - 2.2 - t0;
    [{ cx: 500, p: RED, n: 36, k: 1, name: "1,000 red photons" }, { cx: 1420, p: BLUE, n: 198, k: 2, name: "1,000 blue photons" }].forEach(c => {
      const x0 = c.cx - 380, gr = g.createLinearGradient(0, top, 0, bot); gr.addColorStop(0, "rgba(60,110,200,0.04)"); gr.addColorStop(1, "rgba(60,110,200,0.30)");
      g.save(); g.globalAlpha = R; g.fillStyle = gr; g.fillRect(x0, top, 760, bot - top); g.restore();
      line(x0, top, x0, bot, QUIET, 0.5 * R, 3); line(x0 + 760, top, x0 + 760, bot, QUIET, 0.5 * R, 3); line(x0 - 8, bot, x0 + 768, bot, INK, 0.8 * R, 5);
      for (let i = 0; i < 60; i++) molecule(x0 + 20 + hash(i, 50 + c.k) * 720 + Math.sin(T * 0.6 + i) * 8, top + 20 + Math.sqrt(hash(i, 53 + c.k)) * 510, 7, T * 0.5 + i, N2C, 0.4 * R);
      let scat = 0, sent = 0;
      for (let i = 0; i < 1000; i++) {
        const ti = t0 + hash(i, 60 + c.k) * span, dt = t - ti; if (dt < 0) continue; sent++;
        const isS = i < c.n, ys = top + 30 + Math.sqrt(hash(i, 63 + c.k)) * 480, tsc = (ys - top + 60) / v, x = x0 + 24 + hash(i, 66 + c.k) * 712;
        if (isS && dt > tsc) { scat++; const d = dt - tsc; if (d < 1.1) { const sgn = hash(i, 69 + c.k) < 0.5 ? -1 : 1, ang = 0.1 + hash(i, 72 + c.k) * 1.0, vs = hash(i, 75) < 0.5 ? -1 : 1; photon(x + sgn * Math.cos(ang) * v * d, ys + vs * Math.sin(ang) * v * d * 0.6, c.p.c, R * (1 - d / 1.1), 7); if (d < 0.35) { g.save(); g.globalAlpha = R * (1 - d / 0.35); g.strokeStyle = "#ffffff"; g.lineWidth = 4; g.beginPath(); g.arc(x, ys, 10 + d * 110, 0, TAU2); g.stroke(); g.restore(); } } continue; }
        const y = top - 60 + v * dt; if (y < bot) photon(x, y, c.p.c, R * clamp((y - top + 60) / 40), 6);
        else if (y < bot + 140) dot(x, bot, 5 + (y - bot) * 0.1, c.p.c, R * 0.5 * (1 - (y - bot) / 140));
      }
      const ha = R * seg(t, B(4) + 1.6, B(4) + 2.3);
      text(c.name, c.cx, 222, 48, c.p.c, "center", 800, ha);
      text("scattered: " + scat, c.cx, 290, 54, INK, "center", 800, ha * seg(t, t0 + 0.4, t0 + 1.0));
    });
    const side = t > B(6) - 0.2 ? 0.9 : t > B(5) - 0.2 ? -0.9 : Math.sin(t * 1.4) * 0.8;
    mascot(960, 905, 0.26, T, { look: [side, -0.55], a: R, mouth: t > B(6) + 1 ? "o" : "smile" });
  }
  // --- Z: Rayleigh, and molecules rather than dust
  if (Z > 0) {
    shaken(t, 640, 520, BLUE.c, 270, 0.9, Z, 600);
    const da = Z * seg(t, B(8) - 0.2, B(8) + 0.5), cross = seg(t, B(8) + 3.3, B(8) + 4.0), dim = 1 - 0.65 * cross;
    for (let i = 0; i < 9; i++) { const x = 1300 + (i % 3) * 150 + Math.sin(T * 0.7 + i * 2) * 18, y = 360 + Math.floor(i / 3) * 130 + Math.cos(T * 0.6 + i) * 18, r = 26 + hash(i, 80) * 16; g.save(); g.globalAlpha = da * dim; g.fillStyle = "#a8845c"; g.beginPath(); for (let k = 0; k < 9; k++) { const a = k / 9 * TAU2 + T * 0.2 * (i % 2 ? 1 : -1), rr = r * (0.75 + 0.35 * hash(i * 9 + k, 81)); g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fill(); g.restore(); }
    plate("dust?", 1450, 250, 52, [220, 190, 150], "center", da * (1 - cross));
    if (cross > 0) { line(1230, 300, lerp(1230, 1670, cross), lerp(300, 700, cross), [255, 90, 90], da, 14); line(1670, 300, lerp(1670, 1230, cross), lerp(300, 700, cross), [255, 90, 90], da * seg(cross, 0.3, 1), 14); }
    mascot(1750, 905, 0.26, T, { look: [-0.9, -0.5], a: Z, mouth: cross > 0.5 ? "grin" : "smile", hop: cross > 0.5 && t < B(8) + 5.4 ? 0.5 : 0 });
  }
};

// ---------- the blue sky ----------
const SKY = (() => {
  const S = { x: 1690, y: 170 }, d = { x: -0.9, y: 0.436 }, n = { x: 0.436, y: 0.9 }, M = { x: 1250 }, P = { x: 700, y: 330 };
  M.y = 898 - 32 * (1 - Math.pow((M.x - 960) / 960, 2)) + 2; const Ey = M.y - 438 * 0.34, Eye = { x: M.x, y: Ey };
  const at = (k, s) => ({ x: S.x + n.x * k * 130 + d.x * s, y: S.y + n.y * k * 130 + d.y * s });
  const ev = [], near = [];
  for (let i = 0; i < 900 && ev.length < 70; i++) { const k = Math.floor(hash(i, 90) * 11) - 4, q = at(k, hash(i, 91) * 2700 - 900); if (q.x < 60 || q.x > 1860 || q.y < 110 || q.y > 800 || Math.hypot(q.x - Eye.x, q.y - Eye.y) < 230) continue; q.i = i; ev.push(q); if (Math.hypot(q.x - P.x, q.y - P.y) < 300 && near.length < 9) near.push(q); }
  return { S, d, n, M, P, Eye, at, ev, near, Q0: at(0, 900) };
})();

SCENES.sky = (t, T, B, E, dur) => {
  const { S, d, M, P, Eye, at, ev, near, Q0 } = SKY;
  const rise = seg(t, B(11) - 0.2, dur - 0.6);
  let air = 1 - seg(t, B(1) + 0.2, B(1) + 1.8); air = Math.max(air, 0.16 * seg(t, B(2) - 0.4, B(2) + 0.6)); air = Math.max(air, lerp(0.16, 0.85, seg(t, B(4), E(5) + 0.6))); air = Math.max(air, seg(t, E(5), B(7))) * (1 - ss(rise));
  const gy = rise * rise * 1500;                                  // the ground drops away as we climb
  sky(1, air, H); stars(T, 1 - air);
  // paler sky toward the horizon
  const pale = seg(t, B(9) - 0.3, B(9) + 1.2) * (1 - rise); if (pale > 0) { const gr = g.createLinearGradient(0, 520, 0, 900); gr.addColorStop(0, "rgba(235,242,255,0)"); gr.addColorStop(1, `rgba(235,242,255,${0.62 * pale})`); g.fillStyle = gr; g.fillRect(0, 520, W, 380); }
  { const ca = seg(air, 0.9, 1) * (1 - seg(rise, 0, 0.05)); [[0, 330, 1.1], [900, 420, 0.8]].forEach(([bx, by, s], i) => cloud(((bx + T * (26 + i * 9)) % (W + 500)) - 250, by, s, [255, 255, 255], 0.9 * ca)); }
  sunDisc(S.x, S.y + gy * 0.15, 62, [255, 252, 244], 1, 3 + 2 * air);
  // sunlight streaming through the air
  const ra = seg(t, B(2) - 0.2, B(2) + 0.9) * (1 - seg(t, B(11) - 0.6, B(11)));
  if (ra > 0) for (let k = -4; k <= 6; k++) {
    const a0 = at(k, -900), a1 = at(k, 2200); line(a0.x, a0.y, a1.x, a1.y, "#fff6dc", 0.13 * ra, 5);
    for (let j = 0; j < 9; j++) { const s = ((t * 380 + j * 345 + (k + 4) * 77) % 3100) - 900, q = at(k, s); if (q.y > 880 || q.x < -20 || q.x > W + 20 || q.y < -20) continue; photon(q.x, q.y, [255, 250, 232], ra * 0.9, 6); }
  }
  // scattering events: a photon leaves a sunbeam and travels to the eye
  const ea = seg(t, B(3) - 0.2, B(3) + 0.5) * (1 - seg(t, B(7) - 0.8, B(7) - 0.1)), all = seg(t, B(5) - 0.3, B(5) + 1.5);
  if (ea > 0) ev.forEach((q, j) => {
    const isNear = near.includes(q); if (!isNear && hash(q.i, 95) > all) return;
    const per = isNear ? 2.0 : 2.6, ph = ((t + hash(q.i, 92) * per) % per), L = Math.hypot(Eye.x - q.x, Eye.y - q.y), tt = L / 620, col = q.i % 9 === 0 ? PH[3].c : q.i % 7 === 0 ? VIOLET.c : BLUE.c;
    molecule(q.x, q.y, 8, T + j, N2C, 0.75 * ea);
    if (ph < 0.3) { g.save(); g.globalAlpha = ea * (1 - ph / 0.3); g.strokeStyle = css(col); g.lineWidth = 4; g.beginPath(); g.arc(q.x, q.y, 10 + ph * 120, 0, TAU2); g.stroke(); g.restore(); }
    if (ph < tt) { const u = ph / tt; photon(lerp(q.x, Eye.x, u), lerp(q.y, Eye.y, u), col, ea * clamp((1 - u) * 8), 8); }
  });
  // sight lines
  const s0 = win(t, B(0) + 1.4, B(5) - 0.2, 0.5); line(Eye.x, Eye.y, P.x, P.y, INK, 0.75 * s0, 4, [16, 14]);
  const fan = win(t, B(5) - 0.2, B(6) + 2.6, 0.7); if (fan > 0) for (let a = 12; a <= 168; a += 19.5) { const r = a * Math.PI / 180, L = Math.min(980, (Eye.y - 110) / Math.max(0.12, Math.sin(r))); line(Eye.x, Eye.y, Eye.x - Math.cos(r) * L, Eye.y - Math.sin(r) * L, INK, 0.4 * fan, 3, [14, 14]); }
  // "sunlight that took a detour": one path picked out
  const det = win(t, B(6) - 0.2, B(7) - 0.4, 0.5); if (det > 0) { const p = seg(t, B(6) - 0.1, B(6) + 1.6), L1 = Math.hypot(Q0.x - S.x, Q0.y - S.y), L2 = Math.hypot(Eye.x - Q0.x, Eye.y - Q0.y), s = p * (L1 + L2); line(S.x, S.y, lerp(S.x, Q0.x, clamp(s / L1)), lerp(S.y, Q0.y, clamp(s / L1)), "#fff3c4", det, 10); if (s > L1) { const u = (s - L1) / L2; line(Q0.x, Q0.y, lerp(Q0.x, Eye.x, u), lerp(Q0.y, Eye.y, u), BLUE.c, det, 10); } molecule(Q0.x, Q0.y, 15, T, N2C, det); const lp = (t * 0.55) % 1, ls = lp * (L1 + L2); if (p >= 1) { ls < L1 ? photon(lerp(S.x, Q0.x, ls / L1), lerp(S.y, Q0.y, ls / L1), [255, 250, 232], det, 11) : photon(lerp(Q0.x, Eye.x, (ls - L1) / L2), lerp(Q0.y, Eye.y, (ls - L1) / L2), BLUE.c, det, 11); } }
  // looking straight at the sun: most of the blue is still in the direct beam
  const dir = win(t, B(7) - 0.2, B(9) - 0.2, 0.6); if (dir > 0) {
    line(Eye.x, Eye.y, S.x, S.y, INK, 0.7 * dir, 4, [16, 14]);
    for (let j = 0; j < 7; j++) { const u = ((t * 0.9 + j / 7) % 1); photon(lerp(S.x, Eye.x, u), lerp(S.y, Eye.y, u), [255, 250, 236], dir, 8); }
    const ba = dir * seg(t, B(8) + 2.0, B(8) + 2.8), cut = seg(t, B(8) + 3.2, B(8) + 4.4), x0 = 240, y0 = 490, bw = 760, bh = 86;
    if (ba > 0) { g.save(); g.globalAlpha = ba * 0.85; g.fillStyle = "#0a1020"; g.beginPath(); g.roundRect(x0 - 16, y0 - 16, bw + 32, bh + 32, 22); g.fill(); g.globalAlpha = ba; g.fillStyle = BLUE.css; g.fillRect(x0, y0, bw * 0.8, bh); g.globalAlpha = ba * (1 - cut); g.fillRect(x0 + bw * 0.8, y0, bw * 0.2, bh); g.restore();
      g.save(); g.globalAlpha = ba; g.strokeStyle = INK; g.lineWidth = 4; g.strokeRect(x0, y0, bw, bh); g.restore();
      for (let i = 0; i < 20; i++) { const u = cut * (0.4 + hash(i, 97)), a = hash(i, 98) * TAU2; photon(x0 + bw * 0.8 + hash(i, 99) * bw * 0.2 + Math.cos(a) * u * 260, y0 + hash(i, 96) * bh + Math.sin(a) * u * 200 - u * 60, BLUE.c, ba * cut * (1 - cut) * 4 * (cut < 1 ? 1 : 0), 7); }
      text("4 out of 5", x0 + bw * 0.4, y0 + bh / 2 + 3, 54, "#07102a", "center", 800, ba * cut); }
  }
  // near the horizon: scattered again and again
  const zz = win(t, B(10) - 0.3, B(11) - 0.3, 0.6); if (zz > 0) for (let k = 0; k < 3; k++) {
    const pts = [{ x: 40, y: 640 + k * 70 }]; for (let j = 1; j <= 8; j++) pts.push({ x: lerp(40, Eye.x, j / 9) + (hash(j, 110 + k) - 0.5) * 90, y: 720 + k * 24 + (j % 2 ? -1 : 1) * (50 + hash(j, 113 + k) * 55) + Math.sin(T * 1.4 + j + k) * 8 }); pts.push(Eye);
    const u = ((t - B(10)) * 0.22 + k * 0.33) % 1, f = u * (pts.length - 1), i = Math.floor(f);
    g.save(); g.globalAlpha = zz * 0.75; g.lineWidth = 5; g.lineJoin = "round"; g.lineCap = "round"; for (let j = 0; j < pts.length - 1; j++) { if (j > f) break; g.strokeStyle = PH[(j + k * 2) % 6].css; g.beginPath(); g.moveTo(pts[j].x, pts[j].y); const e2 = j === i ? { x: lerp(pts[j].x, pts[j + 1].x, f - i), y: lerp(pts[j].y, pts[j + 1].y, f - i) } : pts[j + 1]; g.lineTo(e2.x, e2.y); g.stroke(); } g.restore();
    photon(lerp(pts[i].x, pts[i + 1].x, f - i), lerp(pts[i].y, pts[i + 1].y, f - i), PH[(i + k * 2) % 6].c, zz, 10);
  }
  // climbing: parallax clouds, the ground falling away, then the curve of the Earth
  if (rise > 0) { [[300, 420, 1.2], [900, 260, 0.9], [1500, 520, 1.4], [600, -200, 1.1], [1300, -520, 1.5]].forEach(([x, y, s], i) => cloud(x + Math.sin(T * 0.3 + i) * 30, y + rise * 1900 * (0.5 + 0.12 * i), s, [255, 255, 255], 0.75 * seg(rise, 0.02, 0.2))); }
  g.save(); g.translate(0, gy); ground(css(mix([12, 20, 38], [74, 78, 90], 1 - Math.max(air, rise)))); g.restore();
  if (rise > 0.45) { const ty = lerp(1420, 850, seg(rise, 0.5, 1)), Rr = 4200; g.save(); g.strokeStyle = "rgba(110,170,255,0.9)"; g.lineWidth = 16; g.shadowColor = "rgba(90,160,255,0.9)"; g.shadowBlur = 50; g.fillStyle = "#0a1730"; g.beginPath(); g.arc(W / 2, ty + Rr, Rr, 0, TAU2); g.fill(); g.stroke(); g.restore(); }
  let look = [-0.75, -0.75], mouth = "smile";
  if (t > B(1) + 0.3 && t < B(2)) mouth = "o";
  if (t > B(5) - 0.2) { look = [Math.sin(t * 1.1) * 0.9, -0.8]; mouth = t < B(6) ? "o" : "smile"; }
  if (t > B(6)) look = [-0.8, -0.6];
  if (t > B(7) - 0.2) look = [0.8, -0.8];
  if (t > B(9) - 0.2) { look = [-0.95, 0.05]; }
  if (rise > 0) { look = [Math.sin(t * 0.9) * 0.6, lerp(0.6, -0.6, seg(rise, 0.3, 0.8))]; mouth = rise > 0.5 ? "o" : "grin"; }
  const my = lerp(M.y, 700, seg(rise, 0, 0.25)) + (rise > 0 ? Math.sin(T * 1.3) * 10 : 0);
  mascot(M.x + (rise > 0 ? Math.sin(T * 0.8) * 14 : 0), my, 0.34, T, { look, mouth, balloon: rise > 0.001 });
};

// ---------- why not violet ----------
SCENES.violet = (t, T, B, E, dur) => {
  vgrad([[0, [8, 12, 28]], [1, [12, 20, 44]]]);
  const L = 1560, v = 250, GX = [520, 860, 1200], TA = [B(2) + 1.6, B(3) + 0.4, B(4) + 0.4];
  const lanes = [{ p: VIOLET, y: 480, n: 176, pass: [0.72, 0.8, 0.36], k: 1 }, { p: BLUE, y: 720, n: 110, pass: [1, 1, 1], k: 2 }];
  const arrived = [0, 0];
  lanes.forEach((ln, li) => {
    g.save(); g.globalAlpha = 0.10; g.fillStyle = ln.p.css; g.beginPath(); g.roundRect(0, ln.y - 92, L, 184, 30); g.fill(); g.restore();
    for (let i = 0; i < ln.n; i++) {
      const s = hash(i, 120 + ln.k) * L + v * t, x = s % L, c = Math.floor(s / L), y = ln.y + (hash(i, 123 + ln.k) - 0.5) * 150; let a = clamp(x / 60), dead = false;
      for (let gi = 0; gi < 3 && !dead; gi++) if (x > GX[gi]) { const tc = t - (x - GX[gi]) / v; if (tc > TA[gi] && hash(i * 13 + c * 7, 126 + gi + ln.k) > ln.pass[gi]) { dead = true; const dd = (x - GX[gi]) / 110; if (dd < 1) photon(GX[gi] + dd * 30, y - dd * 70 * (i % 2 ? 1 : -1), ln.p.c, (1 - dd) * 0.9, 6); } }
      if (dead) continue; a *= clamp((L - x) / 80); if (x > GX[2] + 40) arrived[li]++;
      photon(x, y, ln.p.c, a, 8);
    }
  });
  // the three gates
  const icons = [(x, y, a) => { sunDisc(x, y, 34, [255, 244, 214], a, 2.6); },
    (x, y, a) => { g.save(); g.globalAlpha = a; g.lineCap = "round"; [0, 1, 2].forEach(k => { g.strokeStyle = `rgba(150,200,255,${0.9 - k * 0.25})`; g.lineWidth = 9; g.beginPath(); g.arc(x, y + 150, 130 + k * 22, -2.0, -1.14); g.stroke(); }); g.restore(); },
    (x, y, a) => { g.save(); g.globalAlpha = a; g.fillStyle = "#eef2f8"; g.beginPath(); g.moveTo(x - 62, y); g.quadraticCurveTo(x, y - 52, x + 62, y); g.quadraticCurveTo(x, y + 52, x - 62, y); g.fill(); g.fillStyle = "#3d7be0"; g.beginPath(); g.arc(x, y, 24, 0, TAU2); g.fill(); g.fillStyle = "#0a1020"; g.beginPath(); g.arc(x, y, 11, 0, TAU2); g.fill(); g.restore(); }];
  GX.forEach((x, gi) => { const on = seg(t, TA[gi] - 1.0, TA[gi] - 0.3), a = 0.28 + 0.72 * on; g.save(); g.globalAlpha = a * 0.9; const gr = g.createLinearGradient(x - 14, 0, x + 14, 0); gr.addColorStop(0, "rgba(255,209,102,0)"); gr.addColorStop(0.5, "rgba(255,209,102,0.95)"); gr.addColorStop(1, "rgba(255,209,102,0)"); g.fillStyle = gr; g.fillRect(x - 14, 372, 28, 456); g.restore(); icons[gi](x, 310, a); if (on > 0 && on < 1) { g.save(); g.globalAlpha = 1 - on; g.strokeStyle = ACC; g.lineWidth = 5; g.beginPath(); g.arc(x, 310, 60 + on * 60, 0, TAU2); g.stroke(); g.restore(); } });
  plate("violet", 120, 480, 48, VIOLET.c, "center", seg(t, 0.3, 0.9)); plate("blue", 120, 720, 48, BLUE.c, "center", seg(t, 0.3, 0.9));
  // what reaches the eye, as a colour
  const fr = clamp(arrived[0] / Math.max(1, arrived[0] + arrived[1])), sw = mix(SKYBLUE, VIOLET.c, clamp((fr - 0.2) * 1.6)), fin = seg(t, B(5) - 0.2, B(5) + 1.2);
  const sx = 1720, sy = 470, sr = 92 + 16 * fin + 4 * Math.sin(T * 3);
  glow(sx, sy, sr * 2.4, sw, 0.45); dot(sx, sy, sr, sw); g.save(); g.strokeStyle = "#ffffff"; g.lineWidth = 6; g.beginPath(); g.arc(sx, sy, sr, 0, TAU2); g.stroke(); g.restore();
  [[1652, 590, 20], [1634, 640, 12]].forEach(([x, y, r]) => { dot(x, y, r, sw); });
  plate("what you see", sx, 322, 44, INK, "center", seg(t, B(1), B(1) + 0.8));
  mascot(1640, 905, 0.3, T, { look: [-0.7, -0.2], mouth: fin > 0.5 ? "grin" : t > B(1) && t < B(2) ? "o" : "smile", hop: fin > 0.5 && t < B(5) + 2.4 ? 0.5 : 0 });
};
