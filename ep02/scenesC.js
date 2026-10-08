// Scenes 7–10: sunset, where the blue went, clouds and Mars, outro.

SCENES.sunset = (t, T, B, E, dur) => {
  const G = 1 - seg(t, B(4) - 0.6, B(4) - 0.1), Bt = win(t, B(4) - 0.4, B(10) - 0.1, 0.5), Ls = seg(t, B(10) - 0.6, B(10) - 0.1);
  // --- A: the atmosphere as a thin shell; the short way and the long way through it
  if (G > 0) {
    clear("#070b18"); stars(T, 0.9);
    const C = { x: 960, y: 2300 }, R = 1500, SH = 150, M = { x: 960, y: 800 };
    const th = (lerp(6, 22, seg(t, 0, B(2) - 0.4)) + 68 * seg(t, B(2) - 0.3, B(2) + 2.6)) * Math.PI / 180, low = seg(th, 0.6, 1.5);
    const gr = g.createRadialGradient(C.x, C.y, R, C.x, C.y, R + SH); gr.addColorStop(0, "rgba(80,150,245,0.75)"); gr.addColorStop(1, "rgba(80,150,245,0.05)"); g.fillStyle = gr; g.beginPath(); g.arc(C.x, C.y, R + SH, 0, TAU2); g.fill();
    glow(M.x - 120 * low, M.y - 40, 420, DUSK.bot, 0.6 * low);
    g.save(); g.strokeStyle = "rgba(170,205,255,0.5)"; g.lineWidth = 3; g.setLineDash([10, 14]); g.beginPath(); g.arc(C.x, C.y, R + SH, 0, TAU2); g.stroke(); g.restore();
    g.fillStyle = "#0b1730"; g.beginPath(); g.arc(C.x, C.y, R, 0, TAU2); g.fill(); g.strokeStyle = "rgba(160,190,240,0.6)"; g.lineWidth = 4; g.stroke();
    const u = { x: -Math.sin(th), y: -Math.cos(th) }, Ds = lerp(540, 900, seg(th, 0.2, 1.5)), sun = { x: M.x + u.x * Ds, y: M.y - 6 + u.y * Ds };
    const sIn = -R * Math.cos(th) + Math.sqrt(R * R * Math.cos(th) * Math.cos(th) + (R + SH) * (R + SH) - R * R);
    const X = { x: M.x + u.x * sIn, y: M.y - 6 + u.y * sIn }, pa = seg(t, B(1) + 1.6, B(1) + 2.6);
    line(sun.x, sun.y, X.x, X.y, "#fff6dc", 0.85 * pa, 6); line(X.x, X.y, M.x, M.y - 6, ACC, pa, 16);
    for (let j = 0; j < 5; j++) { const s = ((t * 0.5 + j / 5) % 1), L = Math.hypot(M.x - sun.x, M.y - sun.y); photon(sun.x + (M.x - sun.x) * s, sun.y + (M.y - 6 - sun.y) * s, sunCol(clamp((s * L - (L - sIn)) / sIn) * (1 + 30 * low)), pa, 8); }
    dot(X.x, X.y, 9, "#ffffff", pa);
    plate(low > 0.5 ? "the long way" : "the short way", lerp(X.x, M.x, 0.5) + (low > 0.5 ? 0 : 300), lerp(X.y, M.y, 0.5) - (low > 0.5 ? 70 : 40), 46, ACC, "center", pa * (1 - win(t, B(2) - 0.3, B(2) + 2.4, 0.3)));
    sunDisc(sun.x, sun.y, 48, [255, 250, 236], 1, 3.2);
    // to scale: 1 against 38
    const ba = seg(t, B(3) - 0.5, B(3)) , n = lerp(1, 38, seg(t, B(3) - 0.1, B(3) + 2.4)), U = 30, bx = 520;
    if (ba > 0) { text("midday", bx - 30, 262, 46, INK, "right", 700, ba * G); g.save(); g.globalAlpha = ba * G; g.fillStyle = "#cfe2ff"; g.fillRect(bx, 240, U, 44); g.fillStyle = css(sunCol(n)); g.fillRect(bx, 322, U * n, 44); g.restore(); text("sunset", bx - 30, 344, 46, INK, "right", 700, ba * G); text("×" + Math.round(n), bx + U * n + 22, 344, 52, ACC, "left", 800, ba * G); text("×1", bx + U + 22, 262, 46, INK, "left", 800, ba * G); }
    mascot(M.x, M.y + 2, 0.2, T, { look: [-Math.sin(th) * 0.95, -Math.cos(th) * 0.9 - 0.05], mouth: low > 0.5 ? "o" : "smile" });
    if (G < 1) { g.save(); g.globalAlpha = 1 - G; g.fillStyle = BG; g.fillRect(0, 0, W, H); g.restore(); }
  }
  // --- B: follow one beam through 38 atmospheres of air
  if (Bt > 0 && G <= 0 && Ls < 1) {
    vgrad([[0, [7, 11, 24]], [1, [12, 20, 44]]]); stars(T, 0.5, 300);
    const x0 = 270, x1 = 1500, L = x1 - x0, yc = 500, hh = 104, v = 330;
    g.fillStyle = "#0b1730"; g.beginPath(); g.ellipse(960, 1900, 2600, 1040, 0, 0, TAU2); g.fill(); g.beginPath(); g.ellipse(1740, 1010, 330, 372, 0, 0, TAU2); g.fill();
    g.strokeStyle = "rgba(160,190,240,0.4)"; g.lineWidth = 3; g.beginPath(); g.ellipse(1740, 1010, 330, 372, 0, Math.PI * 1.05, Math.PI * 1.95); g.stroke();
    sunDisc(120, yc, 72, [255, 250, 236], 1, 3);
    for (let i = 0; i < 48; i++) { g.fillStyle = css(sunCol(38 * (i + 0.5) / 48), 0.30); g.fillRect(x0 + L * i / 48, yc - hh, L / 48 + 1, 2 * hh); }
    line(x0, yc - hh, x1, yc - hh, [170, 205, 255], 0.5, 3); line(x0, yc + hh, x1, yc + hh, [170, 205, 255], 0.5, 3);
    for (let i = 0; i < 90; i++) molecule(x0 + hash(i, 130) * L, yc + (hash(i, 131) - 0.5) * 2 * hh * 0.9 + Math.sin(T * 0.7 + i) * 5, 6, T * 0.5 + i, N2C, 0.35);
    [0, 10, 20, 30, 38].forEach(m => { const x = x0 + L * m / 38; line(x, yc - hh - 22, x, yc - hh, QUIET, 0.9, 3); text("×" + m, x, yc - hh - 52, 40, m === 38 ? ACC : QUIET, "center", 700, 1); });
    const Lc = L + 220;
    for (let i = 0; i < 1100; i++) {
      const p = PH[i % 6], s = hash(i, 133) * Lc + v * t, x = x0 - 110 + (s % Lc), c = Math.floor(s / Lc), y = yc + (hash(i, 134) - 0.5) * 2 * hh * 0.86;
      const xs = x0 - Math.log(1 - hash(i * 3 + c * 11, 135) * 0.9999) * L / (p.tau * 38);
      if (x < xs) { photon(x, y, p.c, clamp((x - 150) / 60) * clamp((x1 + 110 - x) / 70), 6); continue; }
      const d = (x - xs) / v; if (d > 0.75) continue; const sg = hash(i + c, 136) < 0.5 ? -1 : 1, ang = 0.6 + hash(i + c, 137) * 0.8;
      photon(xs + Math.cos(ang) * v * d * 0.5, y + sg * Math.sin(ang) * v * d * 0.9, p.c, 1 - d / 0.75, 6);
    }
    // the probe that rides along with the light
    const pr = seg(t, B(5) - 0.1, E(6) + 0.3), pa = win(t, B(5) - 0.4, B(7) - 0.2, 0.4);
    if (pa > 0) { const x = lerp(x0, x1, pr), c = sunCol(38 * pr); line(x, yc - hh - 6, x, yc + hh + 40, "#ffffff", 0.9 * pa, 4); glow(x, yc + hh + 120, 170, c, 0.5 * pa); dot(x, yc + hh + 120, 70, c, pa); g.save(); g.globalAlpha = pa; g.strokeStyle = "#ffffff"; g.lineWidth = 6; g.beginPath(); g.arc(x, yc + hh + 120, 70, 0, TAU2); g.stroke(); g.restore(); }
    // what is left at the far end
    const ga = seg(t, B(7) + 1.4, B(7) + 2.2) * (1 - seg(t, B(9) + 2.2, B(9) + 2.8)), gb = seg(t, B(8) - 0.1, B(8) + 0.7), bx = 620, bw = 560;
    if (ga > 0) { [[BLUE, 0.0002, "blue left: less than 1 in 1,000", 690, 1], [RED, 0.25, "red left: about 1 in 4", 790, gb]].forEach(([p, f, label, y, a]) => { g.save(); g.globalAlpha = ga * a * 0.85; g.fillStyle = "#0a1020"; g.beginPath(); g.roundRect(bx - 16, y - 34, bw + 32, 68, 16); g.fill(); g.globalAlpha = ga * a; g.fillStyle = p.css; g.fillRect(bx, y - 22, Math.max(4, bw * f * seg(t, (p === BLUE ? B(7) + 1.6 : B(8)) , (p === BLUE ? B(7) + 2.4 : B(8) + 1.2))), 44); g.strokeStyle = INK; g.lineWidth = 3; g.strokeRect(bx, y - 22, bw, 44); g.restore(); text(label, bx + bw + 40, y + 2, 42, p.c, "left", 700, ga * a); }); }
    const sa = seg(t, B(9) - 0.2, B(9) + 0.8); if (sa > 0) { sunDisc(1700, 250, 84, sunCol(38), sa, 3.4); }
    mascot(1740, 640, 0.3, T, { look: [-0.95, sa > 0.5 ? -0.85 : -0.1], mouth: sa > 0.5 ? "o" : "smile" });
    if (Bt < 1) { g.save(); g.globalAlpha = 1 - Bt; g.fillStyle = BG; g.fillRect(0, 0, W, H); g.restore(); }
  }
  // --- C: the sunset itself, then the same thing at sunrise
  if (Ls > 0) {
    const mr = seg(t, B(12) - 0.7, B(12) + 0.5), haze = seg(t, B(11) - 0.3, B(11) + 1.2);
    const scene = () => {
      landscape(T, { e: 0.03, sunX: 330, clouds: false });
      [[520, 330, 1.5], [1040, 250, 1.2], [1520, 400, 1.6], [200, 470, 1.0], [820, 520, 0.9]].forEach(([bx, by, s], i) => { const x = ((bx + T * (9 + i * 3)) % (W + 600)) - 300, k = clamp(1 - Math.abs(x - 330) / 1900); cloud(x, by + 12 * s, s, mix([120, 60, 96], [255, 120, 70], k), 0.9); cloud(x, by, s * 0.96, mix([170, 96, 128], [255, 190, 130], k), 0.92); });
      if (haze > 0) { g.fillStyle = `rgba(210,50,24,${0.20 * haze})`; g.fillRect(0, 0, W, 806); for (let i = 0; i < 130; i++) dot((hash(i, 140) * W + T * (12 + hash(i, 141) * 20)) % W, 120 + hash(i, 142) * 660 + Math.sin(T + i) * 8, 2.5 + hash(i, 143) * 3, [255, 200, 150], 0.4 * haze); }
    };
    g.save(); g.globalAlpha = 1; scene(); g.restore();
    if (mr > 0) { g.save(); g.beginPath(); g.rect(W * (1 - mr), 0, W * mr, H); g.clip(); g.translate(W, 0); g.scale(-1, 1); scene(); g.restore(); if (mr < 1) line(W * (1 - mr), 0, W * (1 - mr), 870, "#ffffff", 0.7, 4); }
    const mx = 1180 - 420 * mr;
    mascot(mx, beachY(mx), 0.34, T, { look: [mr > 0.5 ? 0.95 : -0.95, -0.15], mouth: haze > 0.5 && mr < 0.5 ? "o" : "smile" });
    if (Ls < 1) { g.save(); g.globalAlpha = 1 - Ls; g.fillStyle = BG; g.fillRect(0, 0, W, H); g.restore(); }
  }
};

// ---------- the same beam seen from far away ----------
const GLOBE = (() => {
  const C = { x: 960, y: 3300 }, R = 2500, SH = 260, rad = Math.PI / 180, on = (a, h = 0) => ({ x: C.x + (R + h) * Math.sin(a * rad), y: C.y - (R + h) * Math.cos(a * rad) });
  const F = on(14), eye = on(14, 74), dir = { x: Math.cos(14 * rad), y: Math.sin(14 * rad) }, sun = { x: eye.x - dir.x * 1560, y: eye.y - dir.y * 1560 };
  let sEnter = 0; for (let s = 0; s < 1560; s += 2) { const p = { x: sun.x + dir.x * s, y: sun.y + dir.y * s }; if (Math.hypot(p.x - C.x, p.y - C.y) < R + SH) { sEnter = s; break; } }
  return { C, R, SH, on, F, eye, dir, sun, sEnter, Lb: 1560, PB: on(-6) };
})();
// o: blue (scattered photons), a1 / a2 (label sets), q (question mark on the mascot)
function drawGlobe(t, T, o) {
  const { C, R, SH, on, F, eye, dir, sun, sEnter, Lb, PB } = GLOBE, rad = Math.PI / 180;
  clear("#060a16"); stars(T, 0.9, 760);
  { const sg = g.createLinearGradient(on(-26).x, 0, on(27).x, 0); for (let a = -26; a <= 27; a += 1) { const u = seg(a, 2, 15), nt = seg(a, 15, 24), c = mix(mix([70, 140, 235], [255, 140, 70], u), [8, 12, 30], nt); sg.addColorStop(clamp((on(a).x - on(-26).x) / (on(27).x - on(-26).x)), css(c, 0.55 * (1 - 0.8 * nt))); }
    g.save(); g.strokeStyle = sg; g.lineWidth = SH; g.lineCap = "butt"; g.beginPath(); g.arc(C.x, C.y, R + SH / 2, -116 * rad, -63 * rad); g.stroke(); g.strokeStyle = "rgba(170,205,255,0.45)"; g.lineWidth = 3; g.setLineDash([10, 14]); g.beginPath(); g.arc(C.x, C.y, R + SH, -116 * rad, -63 * rad); g.stroke(); g.restore(); }
  const eg = g.createLinearGradient(0, 0, W, 0); eg.addColorStop(0, "#12305c"); eg.addColorStop(0.75, "#0b1730"); eg.addColorStop(1, "#060a16"); g.fillStyle = eg; g.beginPath(); g.arc(C.x, C.y, R, 0, TAU2); g.fill(); g.strokeStyle = "rgba(160,190,240,0.55)"; g.lineWidth = 4; g.stroke();
  sunDisc(sun.x, sun.y, 54, [255, 250, 236], 1, 3.2);
  const bg = g.createLinearGradient(sun.x, sun.y, eye.x, eye.y); bg.addColorStop(0, "rgba(255,250,236,0.9)"); bg.addColorStop(sEnter / Lb, "rgba(255,250,236,0.9)"); for (let k = 1; k <= 6; k++) bg.addColorStop(lerp(sEnter / Lb, 1, k / 6), css(sunCol(38 * k / 6), 0.9));
  g.save(); g.strokeStyle = bg; g.lineWidth = 30; g.lineCap = "round"; g.beginPath(); g.moveTo(sun.x, sun.y); g.lineTo(eye.x, eye.y); g.stroke(); g.restore();
  for (let j = 0; j < 12; j++) { const s = ((t * 0.16 + j / 12) % 1) * Lb, m = 38 * clamp((s - sEnter) / (Lb - sEnter)); photon(sun.x + dir.x * s, sun.y + dir.y * s + (j % 3 - 1) * 9, mix(sunCol(m), [255, 255, 255], 0.35), 0.95, 7); }
  if (o.blue > 0) for (let i = 0; i < 110; i++) {
    const u = -Math.log(1 - hash(i, 150) * (1 - Math.exp(-3))) / 3, s = lerp(sEnter, Lb, u), per = 2.6, ph = ((t + hash(i, 151) * per) % per) / per, ang = hash(i, 152) * TAU2, d = ph * 300;
    const x = sun.x + dir.x * s + Math.cos(ang) * d, y = sun.y + dir.y * s + Math.sin(ang) * d; if (Math.hypot(x - C.x, y - C.y) < R + 4) continue;
    photon(x, y, i % 8 === 0 ? VIOLET.c : u > 0.45 && i % 3 === 0 ? PH[3].c : BLUE.c, o.blue * clamp(ph * 8) * (1 - ph), 6);
  }
  chibi(PB.x, PB.y + 2 + Math.sin(T * 2.1) * 2, 0.15, { rot: -6 * rad, hat: "#2f7a5a", cuff: "#3f9a74", look: [0.5, -0.9], mouth: o.blue > 0.5 ? "grin" : "smile" });
  chibi(F.x, F.y + 2 + Math.sin(T * 2.1 + 1) * 2, 0.17, { rot: 14 * rad, look: [-0.95, -0.2], mouth: o.q ? "o" : "smile", q: o.q });
  plate("still afternoon: a blue sky", PB.x - 40, 458, 46, [140, 190, 255], "center", o.a1 ?? 0);
  plate("your sunset", F.x + 20, 630, 46, [255, 170, 110], "center", o.a1s ?? 0);
  plate("west", 210, 590, 44, QUIET, "center", o.a1 ?? 0);
  plate("the blue half, scattered on the way", 760, 458, 46, [140, 190, 255], "center", o.a2 ?? 0);
  plate("the red half, still in the beam", 1480, 630, 46, [255, 170, 110], "center", o.a2 ?? 0);
}
SCENES.west = (t, T, B, E, dur) => {
  const a2 = seg(t, B(4) - 0.2, B(4) + 0.6);
  drawGlobe(t, T, { blue: seg(t, B(1) + 0.3, B(1) + 2.0), q: t < B(1), a1: seg(t, B(3) - 0.2, B(3) + 0.6) * (1 - a2), a1s: seg(t, 0.4, 1.1) * (1 - a2), a2 });
};

// ---------- clouds, and Mars ----------
SCENES.clouds = (t, T, B, E, dur) => {
  const Ma = seg(t, B(2) - 0.6, B(2) - 0.1);
  if (Ma < 1) {
    sky(1, 1, H); ground();
    const D = { x: 590, y: 500 }, r = 205, wh = seg(t, B(1) - 0.2, B(1) + 1.6);
    cloud(1380, 390, 2.3, mix([150, 164, 190], [255, 255, 255], wh), 0.97); cloud(1560, 450, 1.5, mix([140, 154, 180], [246, 248, 255], wh), 0.95);
    glow(1400, 400, 420, [255, 255, 255], 0.35 * wh);
    for (let i = 0; i < 40; i++) { const a = hash(i, 160) * TAU2 + T * (0.5 + hash(i, 161)), rr = 60 + hash(i, 162) * 150; photon(1400 + Math.cos(a) * rr * 1.5, 400 + Math.sin(a) * rr * 0.6, PH[i % 6].c, 0.55 * (1 - wh * 0.7), 5); }
    glow(D.x, D.y, r * 1.5, [190, 225, 255], 0.25); g.save(); g.fillStyle = "rgba(190,225,255,0.30)"; g.strokeStyle = "#ffffff"; g.lineWidth = 6; g.beginPath(); g.arc(D.x, D.y, r, 0, TAU2); g.fill(); g.stroke(); g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.ellipse(D.x - 80, D.y - 96, 46, 24, -0.6, 0, TAU2); g.fill(); g.restore();
    for (let i = 0; i < 60; i++) {
      const per = 3.3, ph = (t + hash(i, 163) * per) % per, dy = (hash(i, 164) - 0.5) * 2 * r * 0.92, xh = D.x - Math.sqrt(r * r - dy * dy), v = 430, th = (xh + 40) / v, c = PH[i % 6].c;
      if (ph < th) photon(-40 + v * ph, D.y + dy, c, 1, 8);
      else { const d = ph - th, ang = hash(i, 165) * TAU2; photon(xh + Math.cos(ang) * v * d, D.y + dy + Math.sin(ang) * v * d, c, clamp(1 - d / 1.3), 8); }
    }
    const sa = seg(t, B(0) + 2.6, B(0) + 3.4); wave(D.x - 28, D.x + 28, 772, 6, 14, T * 20, "#ffffff", sa, 4); plate("one wave of light, to scale", D.x, 826, 44, INK, "center", sa);
    mascot(1400, beachY(1400), 0.32, T, { look: [-0.2, -0.95], mouth: wh > 0.5 ? "grin" : "smile" });
  }
  if (Ma > 0) {
    g.save(); g.globalAlpha = Ma;
    const u = seg(t, B(4) - 2.2, B(4) + 1.4), HZ = 770;
    const gr = g.createLinearGradient(0, 0, 0, HZ); gr.addColorStop(0, css(mix([150, 104, 60], [46, 44, 56], u))); gr.addColorStop(1, css(mix([226, 172, 112], [104, 96, 104], u))); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    const sx = 560, sy = lerp(250, 712, u);
    g.globalAlpha = 1; glow(sx, sy, 620, [96, 160, 255], 0.85 * u * Ma); glow(sx, sy, 300, [150, 200, 255], 0.7 * u * Ma); glow(sx, sy, 240, [255, 236, 200], 0.6 * (1 - u) * Ma); sunDisc(sx, sy, 27, [255, 252, 244], Ma, 2.4);
    g.globalAlpha = Ma;
    for (let i = 0; i < 150; i++) dot((hash(i, 170) * W + T * (16 + hash(i, 171) * 30)) % W, 100 + hash(i, 172) * 640 + Math.sin(T * 0.8 + i) * 10, 2 + hash(i, 173) * 3.5, [240, 200, 150], 0.35 * Ma);
    g.fillStyle = css(mix([120, 58, 34], [42, 26, 28], u)); g.beginPath(); g.moveTo(0, H); g.lineTo(0, HZ); for (let x = 0; x <= W; x += 40) g.lineTo(x, HZ - 26 * Math.sin(x * 0.004 + 1) - 12 * Math.sin(x * 0.011)); g.lineTo(W, H); g.closePath(); g.fill();
    g.fillStyle = css(mix([86, 40, 24], [26, 16, 20], u)); g.beginPath(); g.moveTo(0, H); g.lineTo(0, 880); g.quadraticCurveTo(W / 2, 840, W, 880); g.lineTo(W, H); g.closePath(); g.fill();
    [[240, 868, 60], [760, 850, 34], [1020, 862, 46], [1720, 866, 70]].forEach(([x, y, r]) => { g.beginPath(); g.ellipse(x, y, r, r * 0.5, 0, 0, TAU2); g.fill(); });
    g.restore();
    mascot(1380, 868, 0.32, T, { a: Ma, helmet: true, look: [-0.95, lerp(-0.7, -0.1, u)], mouth: u > 0.6 ? "o" : "smile" });
  }
};

// ---------- outro ----------
SCENES.outro = (t, T, B, E, dur) => {
  const Gl = win(t, B(3) - 0.5, B(4) - 0.1, 0.5), End = seg(t, B(4) - 0.4, B(4) + 0.3);
  if (t < B(3) && Gl < 1) {
    const sp = seg(t, B(1) - 0.5, B(1) + 0.6), eR = lerp(0.5 + 0.5 * Math.cos(t * 1.5), 0, sp);
    landscape(T, { e: eR, sunX: lerp(1380, 1790, sp) });
    if (sp > 0) { g.save(); g.beginPath(); g.rect(0, 0, 960 * sp, H); g.clip(); landscape(T, { e: 1, sunX: 690, sunTop: 300 }); g.restore(); line(960 * sp, 0, 960 * sp, 870, "#ffffff", 0.75, 4); }
    const L = { x: 520, y: beachY(520) }, Rm = { x: lerp(960, 1400, sp), y: beachY(lerp(960, 1400, sp)) }, eL = eyeOf(L.x, L.y, 0.32), eRt = eyeOf(Rm.x, Rm.y, 0.32);
    const ba = sp * seg(t, B(1) + 2.4, B(1) + 3.2);
    for (let i = 0; i < 64; i++) { const q = { x: 60 + hash(i, 180) * 850, y: 130 + hash(i, 181) * 480 }, per = 2.2, ph = ((t + hash(i, 182) * per) % per) / 1.3; if (ph > 1 || Math.hypot(q.x - eL.x, q.y - eL.y) < 170) continue; photon(lerp(q.x, eL.x, ph), lerp(q.y, eL.y, ph), BLUE.c, ba * clamp(ph * 6) * clamp((1 - ph) * 6), 10); }
    const ra = seg(t, B(2) - 0.2, B(2) + 0.6), sy = 770;
    for (let i = 0; i < 9; i++) { const ph = ((t * 0.6 + i / 9) % 1); photon(lerp(1790, eRt.x + 30, ph), lerp(sy, eRt.y, ph) + (i % 3 - 1) * 8, i % 3 ? RED.c : PH[1].c, ra * clamp((1 - ph) * 6), 8); }
    if (sp > 0) mascot(L.x, L.y, 0.32, T, { look: [-0.3, -0.95], a: sp, mouth: "smile" });
    mascot(Rm.x, Rm.y, 0.32, T, { look: [0.95, sp > 0.5 ? -0.1 : -0.7], mouth: ra > 0.5 ? "o" : "smile" });
  }
  if (Gl > 0 && End < 1) { g.save(); drawGlobe(t, T, { blue: 1, a1: seg(t, B(3) + 2.2, B(3) + 3.0), a1s: seg(t, B(3) + 0.2, B(3) + 1.0) }); g.restore(); if (Gl < 1) { g.save(); g.globalAlpha = 1 - Gl; g.fillStyle = BG; g.fillRect(0, 0, W, H); g.restore(); } }
  if (End > 0) {
    g.save(); g.globalAlpha = End; vgrad([[0, [8, 14, 34]], [0.7, [14, 30, 70]], [1, [60, 40, 60]]]); g.restore();
    stars(T, 0.5 * End, 600);
    for (let i = 0; i < 70; i++) { const s = (hash(i, 190) * 1400 + t * (50 + hash(i, 191) * 60)) % 1400, x = hash(i, 192) * W - s * 0.25, y = -60 + s * 0.8; photon(x, y, i % 6 === 0 ? PH[1].c : i % 9 === 0 ? RED.c : BLUE.c, End * 0.75 * clamp((1100 - y) / 300), 6); }
    ground("#0c1426", End);
    mascot(330, 902, 0.46, T, { a: End, look: [0.5, -0.3], mouth: "grin", hop: t < B(4) + 2.2 ? 0.6 : 0, q: true });
  }
};
