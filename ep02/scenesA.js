// Scenes 1–3: hook, white light, air.  Each scene is drawn by fn(t, T, B, E, dur):
// t = seconds since the scene began, T = global time, B(i) / E(i) = start / end of narration beat i.
const SCENES = {};

// ---------- shared landscape: sky, sun, drifting clouds, sea and beach ----------
// o: e (sun height 0..1), air (0 = black sky), sunX, sunTop, hz, shimmer, clouds
function landscape(T, o) {
  const hz = o.hz ?? 800, e = o.e, air = o.air ?? 1, u = ss(e);
  sky(e, air, hz + 6); stars(T, 1 - air, hz);
  const sy = lerp(hz - 30, o.sunTop ?? 190, u), sc = mix([255, 250, 240], mix(sunHue(airMass(e) * 0.75), [255, 240, 190], 0.3), air);
  glow(o.sunX, sy, 950, DUSK.bot, 0.5 * (1 - u) * air);
  sunDisc(o.sunX, sy, 60, sc, 1, 3.5 + 2.5 * (1 - u) * air);
  const cc = mix([255, 176, 136], [255, 255, 255], u);
  if (o.clouds !== false) [[0, 250, 1.3], [640, 380, 0.9], [1280, 300, 1.1]].forEach(([bx, by, s], i) => { const x = ((bx + T * (10 + i * 4)) % (W + 500)) - 250; cloud(x, by, s, cc, 0.8 * air); });
  // sea
  const sea = mix([6, 16, 40], mix(DUSK.mid, NOON.mid, u), 0.45 * air);
  vgrad([[0, mix(sea, mix(DUSK.bot, NOON.bot, u), 0.35 * air)], [1, mix(sea, [4, 10, 26], 0.5)]], hz, H);
  const sh = o.shimmer ?? 1;
  for (let i = 0; i < 70; i++) { const y = hz + 6 + hash(i, 7) * 92, x = (hash(i, 8) * W + T * (8 + hash(i, 9) * 14)) % W, a = (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(T * (1.2 + hash(i, 10) * 2) + i))) * 0.5 * sh; line(x, y, x + 30 + hash(i, 11) * 60, y, "#dfeaff", a * (0.3 + 0.7 * air), 3); }
  for (let i = 0; i < 22; i++) { const y = hz + 5 + i * 4.4, w = (18 + i * 5.5) * (0.6 + 0.4 * Math.sin(T * 2.3 + i * 1.7)); line(o.sunX - w, y, o.sunX + w, y, sc, 0.55 * (1 - i / 26), 3); }
  // beach
  g.fillStyle = "#0c1426"; g.beginPath(); g.moveTo(0, H); g.lineTo(0, 898); g.quadraticCurveTo(W / 2, 866, W, 898); g.lineTo(W, H); g.closePath(); g.fill();
  g.strokeStyle = "rgba(160,190,240,0.35)"; g.lineWidth = 3; g.beginPath(); g.moveTo(0, 898); g.quadraticCurveTo(W / 2, 866, W, 898); g.stroke();
}
const beachY = x => 898 - 32 * (1 - Math.pow((x - W / 2) / (W / 2), 2)) + 2;   // top of the sand at x

SCENES.hook = (t, T, B, E, dur) => {
  const e = 1 - seg(t, B(1) + 0.2, E(1) - 0.4), air = 1 - win(t, B(3) - 0.2, B(4) - 0.1, 0.9);
  landscape(T, { e, air, sunX: 1380, shimmer: 1 + 1.2 * win(t, B(2), E(2) + 0.3) });
  const sp = seg(t, B(4) - 0.3, B(4) + 1.0);
  if (sp > 0) {
    g.save(); g.beginPath(); g.rect(960 - 960 * sp, 0, 960 * sp, H); g.clip(); landscape(T, { e: 1, sunX: 400, sunTop: 230 }); g.restore();
    g.save(); g.beginPath(); g.rect(960, 0, 960 * sp, H); g.clip(); landscape(T, { e: 0, sunX: 1520 }); g.restore();
    line(960, 0, 960, 870, "#ffffff", 0.75 * sp, 4);
    // the same beam, a short way through the air at midday, a long way at sunset
    const pa = seg(t, B(4) + 4.2, B(4) + 5.6);
    plate("midday", 400, 420, 48, INK, "center", seg(t, B(4) + 0.8, B(4) + 1.4));
    plate("sunset", 1520, 420, 48, INK, "center", seg(t, B(4) + 1.2, B(4) + 1.8));
    plate("a little air", 400, 500, 44, ACC, "center", pa); plate("a lot of air", 1520, 500, 44, ACC, "center", pa);
  }
  const mx = lerp(330, 960, seg(t, B(4) - 0.3, B(4) + 1.3));
  let look = [0.25, -0.9], mouth = "smile";
  if (t > B(1)) { look = [0.85, lerp(-0.7, 0.05, seg(t, B(1), E(1)))]; mouth = t > B(1) + 2 ? "o" : "smile"; }
  if (t > B(2) - 0.2) { look = [0.8, 0.45]; mouth = "smile"; }
  if (t > B(3) - 0.2) { look = [0.1, -0.95]; mouth = "o"; }
  if (t > B(4) - 0.3) { look = [Math.sin((t - B(4)) * 1.5) * 0.9, -0.5]; mouth = "smile"; }
  mascot(mx, beachY(mx), 0.34, T, { look, mouth, q: t < B(2) - 0.4 });
};

SCENES.white = (t, T, B, E, dur) => {
  clear("#070b18"); stars(T, 0.9);
  const K = 0.36, V = 75, YC = 505, XF = 540, XL = 840, LY = i => 300 + i * 82;
  const mg = seg(t, B(4) - 0.3, B(4) + 1.6), amp = 26 * seg(t, B(1) - 0.2, B(1) + 1.2) * (1 - mg);
  const hlR = win(t, B(2) - 0.2, E(2) + 0.5), hlB = win(t, B(3) - 0.2, E(3) + 0.6);
  sunDisc(-130, YC, 300, [255, 248, 230], 1, 2.1);
  const p0 = seg(t, 0.1, 1.3), p1 = seg(t, B(0) + 1.6, B(0) + 3.0), p2 = seg(t, B(0) + 2.6, B(0) + 4.2);
  g.globalCompositeOperation = "lighter";
  line(165, YC, lerp(165, XF, p0), YC, [255, 250, 238], 0.95, 44); glow(lerp(165, XF, p0), YC, 90, [255, 250, 238], 0.5 * (1 - p1));
  PH.forEach((p, i) => {
    const y = lerp(LY(i), YC, mg), a = 1 - 0.78 * Math.max(i !== 0 ? hlR : 0, i !== 4 ? hlB : 0);
    if (p1 > 0) { g.save(); g.globalAlpha = a; g.strokeStyle = p.css; g.lineWidth = 7; g.lineCap = "round"; g.beginPath(); g.moveTo(XF, YC); const n = Math.ceil(30 * p1); for (let k = 1; k <= n; k++) { const u = k / 30, s2 = ss(u); g.lineTo(lerp(XF, XL, u), lerp(YC, y, s2)); } g.stroke(); g.restore(); }
    if (p2 > 0) wave(XL, lerp(XL, W + 40, p2), y, amp, p.l * K, V * t, p.c, a, 7);
  });
  g.globalCompositeOperation = "source-over";
  // crest-to-crest brackets that travel with the wave
  const bracket = (i, a, t0, label) => {
    if (a <= 0.01) return; const lam = PH[i].l * K, k = Math.round((900 - V * t0) / lam), x = V * t + k * lam, y = LY(i) - 62;
    line(x, y, x + lam, y, INK, a, 4); line(x, y - 14, x, y + 30, INK, a, 4); line(x + lam, y - 14, x + lam, y + 30, INK, a, 4);
    plate(label, x + lam + 34, y - 4, 52, PH[i].c, "left", a, 800);
  };
  bracket(0, hlR, B(2), "700 nm"); bracket(4, hlB, B(3), "450 nm");
  // all colours travelling together
  if (mg > 0) { g.globalCompositeOperation = "lighter"; line(XF, YC, W + 40, YC, [255, 250, 238], 0.5 * mg, 40); g.globalCompositeOperation = "source-over"; for (let i = 0; i < 110; i++) { const x = ((hash(i, 21) * (W + 300) + t * 430) % (W + 300)) - 100; if (x < XF) continue; photon(x, YC + (hash(i, 22) - 0.5) * 70, PH[i % 6].c, mg * 0.95, 10); } }
  // a rock to stand on
  g.fillStyle = "#18223a"; g.beginPath(); g.ellipse(1655, 938, 230, 54, 0, 0, TAU2); g.fill(); g.strokeStyle = "rgba(160,190,240,0.4)"; g.lineWidth = 3; g.beginPath(); g.ellipse(1655, 938, 230, 54, 0, Math.PI, TAU2); g.stroke();
  let look = [-0.85, -0.55]; if (hlR > 0.5) look = [-0.7, -0.95]; if (hlB > 0.5) look = [-0.9, -0.35];
  mascot(1655, 912, 0.3, T, { look, helmet: true, mouth: mg > 0.5 ? "grin" : hlR + hlB > 0.5 ? "o" : "smile" });
};

SCENES.air = (t, T, B, E, dur) => {
  vgrad([[0, [8, 12, 28]], [1, [12, 22, 48]]]);
  const zin = seg(t, B(2) - 0.5, B(2) + 0.2);            // wide view → size comparison
  // --- wide view: light arriving in a box of air
  if (zin < 1) {
    g.save(); g.globalAlpha = 1 - zin;
    const gr = g.createLinearGradient(560, 0, 760, 0); gr.addColorStop(0, "rgba(46,96,180,0)"); gr.addColorStop(1, "rgba(46,96,180,0.30)"); g.fillStyle = gr; g.fillRect(560, 0, W - 560, H);
    g.restore();
    for (let i = 0; i < 80; i++) { const x = 680 + hash(i, 31) * 1200 + Math.sin(T * 0.5 + i) * 16, y = 150 + hash(i, 32) * 740 + Math.cos(T * 0.43 + i * 2) * 16; molecule(x, y, 11, T * (0.3 + hash(i, 33)) + i, i % 5 === 3 ? O2C : N2C, (1 - zin) * 0.9); }
    const xf = lerp(-20, W + 40, seg(t, 0.1, 2.9));
    g.globalCompositeOperation = "lighter";
    [0, 3, 4].forEach((ci, k) => wave(0, xf, 440 + k * 84, 22, PH[ci].l * 0.27, 150 * t, PH[ci].c, (1 - zin) * 0.95, 7));
    g.globalCompositeOperation = "source-over";
    const la = win(t, B(1) - 0.1, B(2) - 0.5, 0.5);
    molecule(1090, 262, 34, T * 0.5, N2C, la); plate("nitrogen", 1090, 352, 46, N2C, "center", la);
    molecule(1500, 262, 34, T * 0.6 + 1, O2C, la); plate("oxygen", 1500, 352, 46, O2C, "center", la);
  }
  // --- size comparison, then a zoom into one molecule
  const MX = 960, MY = 520;
  if (zin > 0) {
    const z = Math.exp(Math.log(300) * seg(t, B(2) + 2.0, B(3) - 0.2)), wa = zin * (1 - seg(z, 6, 40));
    const lam = 900 * z, amp = 120 * Math.min(z, 6);
    g.globalCompositeOperation = "lighter"; wave(0, W, MY, amp, lam, MX - lam / 4 + 90 * t / z, BLUE.c, wa, 8); g.globalCompositeOperation = "source-over";
    const ba = zin * (1 - seg(t, B(2) + 1.8, B(2) + 2.3));
    if (ba > 0.01) { const c = MX - 225 + 90 * t, c0 = c + 900 * Math.round((420 - (MX - 225 + 90 * B(2))) / 900), y = MY - 170; line(c0, y, c0 + 900, y, INK, ba, 4); line(c0, y - 16, c0, y + 34, INK, ba, 4); line(c0 + 900, y - 16, c0 + 900, y + 34, INK, ba, 4); plate("one wave of blue light", c0 + 450, y - 58, 46, BLUE.c, "center", ba); }
    // the molecule: under a pixel wide at first
    const r = Math.max(1.6, 0.27 * z), big = seg(z, 30, 300);
    const pulse = 26 + 10 * Math.sin(T * 5); g.save(); g.globalAlpha = zin * (1 - seg(z, 2, 8)); g.strokeStyle = ACC; g.lineWidth = 4; g.beginPath(); g.arc(MX, MY, pulse, 0, TAU2); g.stroke(); g.restore();
    plate("one molecule", MX, MY + 96, 46, ACC, "center", zin * (1 - seg(z, 1.5, 5)));
    // electron cloud, pushed up and down by the passing wave
    const scat = seg(t, B(5) - 0.4, B(5) + 0.9), msc = lerp(1, 0.8, scat);
    const LW = 760, VW = 480, wA = win(t, B(3) - 0.5, B(5) + 0.4, 0.8), push = -Math.cos(TAU2 * (MX - VW * t) / LW);
    g.globalCompositeOperation = "lighter"; wave(0, W, MY, 150, LW, VW * t, BLUE.c, wA * 0.75, 8); g.globalCompositeOperation = "source-over";
    const cy = MY + push * 62 * wA;
    // light sent back out: one ring per swing of the electrons
    if (t > B(4) - 0.4) { const P = LW / VW / 2; for (let k = Math.ceil((B(4) - 0.4) / P); k * P < Math.min(t, B(5)); k++) { const R = (t - k * P) * 340, a = 0.75 * (1 - R / 1000); if (a <= 0) continue; g.save(); g.globalAlpha = a; g.strokeStyle = BLUE.css; g.lineWidth = 7; g.beginPath(); g.arc(MX, MY, R, 0, TAU2); g.stroke(); g.restore(); } }
    glow(MX, cy, 340 * big * msc, [120, 170, 255], 0.6 * big);
    molecule(MX, MY, r * msc, big > 0.5 ? 0 : T * 0.4, N2C, zin);
    // scattering: most photons pass, some leave in a new direction, colour unchanged
    if (t > B(5) - 0.4) { const bg = g.createLinearGradient(0, MY - 300, 0, MY + 300); bg.addColorStop(0, "rgba(207,224,255,0)"); bg.addColorStop(0.3, `rgba(207,224,255,${0.11 * scat})`); bg.addColorStop(0.7, `rgba(207,224,255,${0.11 * scat})`); bg.addColorStop(1, "rgba(207,224,255,0)"); g.fillStyle = bg; g.fillRect(0, MY - 300, W, 600); }
    if (t > B(5) - 0.4) for (let i = 0; i < 130; i++) {
      const t0 = B(5) - 0.3 + i * 0.075, dt = t - t0; if (dt < 0 || dt > 6) continue; const hit = i % 4 === 1, y0 = hit ? MY + (hash(i, 41) - 0.5) * 50 : MY + (hash(i, 41) < 0.5 ? -1 : 1) * (95 + hash(i, 42) * 140), v = 540, ts = (MX + 60) / v, c = PH[i % 6].c;
      if (!hit || dt < ts) photon(-60 + v * dt, y0, c, 1, 11);
      else { const ang = (hash(i, 43) * 2 - 1) * 2.7 + (hash(i, 43) < 0.5 ? -0.4 : 0.4), d = dt - ts; photon(MX + Math.cos(ang) * v * d, y0 + Math.sin(ang) * v * d, c, 1, 11); if (d < 0.5) { g.save(); g.globalAlpha = 1 - d / 0.5; g.strokeStyle = css(c); g.lineWidth = 5; g.beginPath(); g.arc(MX, MY, 60 + d * 220, 0, TAU2); g.stroke(); g.restore(); } }
    }
  }
  const ringing = t > B(4) && t < B(5);
  mascot(250, 905, 0.3, T, { look: [0.9, zin > 0.5 ? -0.75 : -0.6], mouth: ringing || (t > B(2) + 2 && t < B(3)) ? "o" : "smile" });
};
