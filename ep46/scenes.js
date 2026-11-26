// Episode 46 (Short v4, 1080×1920): dry spaghetti bent until it breaks almost always gives three or more pieces.
// Facts (claims.md): Audoly & Neukirch 2005 (PRL 95, 095505): when the first break releases the curvature, the
// pieces snap back and send flexural (bending) waves that locally raise the curvature, causing more breaks.
// Heisser et al. 2018 (PNAS, MIT): twisting the strand (about a full turn in their experiments) and then bending
// slowly gives two pieces; done by hand it works only sometimes. The strand is drawn far thicker than 1.4 mm.
const L = 860, YM = 820, SPAG = [246, 214, 138], SPAG2 = [196, 150, 62], SKIN = [240, 210, 190];
const KMAX = 1.9 / L;                                    // curvature at the first break (total turning ≈ 1.9 rad)
const UB = 0.53;                                         // first break, fraction of the length from the left hand
const look = [0.4, -0.7];

// integrate a curve: start point, start angle, length, curvature function k(s) → points
function curve(x0, y0, a0, len, kf, n = 70) {
  const P = [[x0, y0]]; let x = x0, y = y0, a = a0; const ds = len / n;
  for (let i = 0; i < n; i++) { const s = (i + 0.5) * ds; a += kf(s) * ds; x += Math.cos(a) * ds; y += Math.sin(a) * ds; P.push([x, y]); }
  return P;
}
// the whole strand bent with uniform curvature k, centred on x = 540 with its middle at YM: returns left end, angle
function frame(k) {
  const P = curve(0, 0, -k * L / 2, L, () => k), m = P[35];
  return { x: 540 - m[0], y: YM - m[1], a: -k * L / 2 };
}
function strand(P, a = 1, glowAt = -1, n = 0) {
  if (a <= 0.01) return;
  poly(P, SPAG2, a, 38); poly(P, SPAG, a, 27);
  // twist stripes: short darker ticks whose phase follows the twist n (turns)
  if (n > 0.001) for (let i = 2; i < P.length - 2; i += 3) { const [x, y] = P[i], [x2, y2] = P[i + 1], an = Math.atan2(y2 - y, x2 - x) + Math.PI / 2, ph = Math.sin((i / P.length) * 18 + n * TAU2 * 2.2); line(x - 9 * Math.cos(an) + ph * 6 * Math.cos(an - 1.2), y - 9 * Math.sin(an), x + 9 * Math.cos(an), y + 9 * Math.sin(an) + ph * 4, SPAG2, a * 0.8 * Math.min(1, n * 3), 4); }
  if (glowAt >= 0 && glowAt < P.length) { const [x, y] = P[Math.round(glowAt)]; soft(x, y, 90, GOLDc, 0.85); dot(x, y, 12, [255, 250, 220], 0.9); }
}
function hand(x, y, ang, a = 1) {
  g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(ang);
  g.fillStyle = css(SKIN); g.strokeStyle = INK; g.lineWidth = 7;
  g.beginPath(); g.roundRect(-58, -46, 116, 120, 40); g.fill(); g.stroke();          // fist
  g.beginPath(); g.ellipse(0, -44, 46, 22, 0, 0, TAU2); g.fill(); g.stroke();         // thumb on top
  g.strokeStyle = "rgba(150,100,80,0.8)"; g.lineWidth = 5; [-24, 6, 36].forEach(y => { g.beginPath(); g.moveTo(-50, y); g.lineTo(-18, y); g.stroke(); });   // finger creases
  g.restore();
}
function room() {
  const gr = g.createRadialGradient(540, 820, 80, 540, 820, 1050);
  gr.addColorStop(0, "rgb(126,146,200)"); gr.addColorStop(0.6, "rgb(72,94,158)"); gr.addColorStop(1, "rgb(30,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// the snap event. bend ∈ [0,1] before the break; tau = time since the first break in "event seconds"
// (one event second = the wave crossing a piece). twistFix = no second break.
function snap(bend, tau, o = {}) {
  const k = KMAX * bend, F = frame(k), n = o.twist || 0;
  if (tau < 0) {   // still whole
    const P = curve(F.x, F.y, F.a, L, () => k);
    strand(P, 1, -1, n);
    hand(P[0][0] - 20, P[0][1] + 30, F.a * 0.8); hand(P[P.length - 1][0] + 20, P[P.length - 1][1] + 30, -F.a * 0.8);
    return { pieces: 1 };
  }
  // after the break: hands stay where they were. Each piece relaxes from its free end inward: behind the wave
  // front the curvature is gone, at the front a bump of extra curvature (the bending wave) travels to the hand.
  const Ll = UB * L, Lr = (1 - UB) * L, front = s0 => s0 - tau * s0, wbump = 70;
  const relax = o.calm ? 0 : 1.15;                         // bump height in units of k (no bump when the twist calmed it)
  const kf = (len) => s => { const f = len * (1 - Math.min(1, tau)); return (s < f ? k : 0) + k * relax * Math.exp(-(((s - f) / wbump) ** 2)) * (1 - seg(tau, 0.9, 1.2)); };
  const left = curve(F.x, F.y, F.a, Ll, kf(Ll));
  const S2 = 0.5 * Lr, tau2 = 1 - S2 / Lr;                 // the right piece breaks again where the bump peaks
  let right = curve(1080 - F.x, F.y, Math.PI - F.a, Lr, s => -kf(Lr)(s)), frag = null;
  if (!o.calm && tau >= tau2) {
    const at2 = tau2, kf2 = s => { const f = Lr * (1 - at2); return (s < f ? k : 0) + k * relax * Math.exp(-(((s - f) / wbump) ** 2)); };
    const shape = curve(1080 - F.x, F.y, Math.PI - F.a, Lr, s => -kf2(s)), idx = Math.round(S2 / Lr * 70);
    right = right.slice(0, idx + 1);
    frag = shape.slice(idx); const u = (tau - tau2) * (o.fly || 1), cx = frag.reduce((q, p) => q + p[0], 0) / frag.length, cy = frag.reduce((q, p) => q + p[1], 0) / frag.length;
    const dx = -260 * u, dy = -900 * u + 1400 * u * u, rot = -5 * u;
    frag = frag.map(([x, y]) => { const X = x - cx, Y = y - cy; return [cx + dx + X * Math.cos(rot) - Y * Math.sin(rot), cy + dy + X * Math.sin(rot) + Y * Math.cos(rot)]; });
  }
  const glow = o.glow && tau < 1 ? 70 * (1 - tau) : -1;   // index of the wave front, free end (70) → hand (0)
  strand(left, 1, glow, n); strand(right, 1, o.glow && tau < tau2 ? glow : -1, n); if (frag) strand(frag, 1, -1, n);
  hand(F.x - 20, F.y + 30, F.a * 0.8); hand(1080 - F.x + 20, F.y + 30, -F.a * 0.8);
  return { pieces: frag ? 3 : 2, tau2, frag };
}
const SCENES = {};

// 1 — hook: already bending at frame one; snaps into three at ~1.4 s
SCENES.hook = (t, T, B, E, dur) => {
  room();
  const tb = 1.35, r = snap(0.45 + 0.55 * clamp(t / tb), (t - tb) / 0.16, { fly: 0.16 });
  if (t > tb + 0.3) plate("3 pieces", 540, 1130, 60, GOLD, "center", seg(t, tb + 0.3, tb + 0.6), 900);
  MASR(T, t, { ev: [[tb + 0.1, "!"]], look, s: 0.42, x: 150, y: 1600 });
};
// 2 — fail: replay at normal speed, a count of tries; most give 3+
SCENES.fail = (t, T, B, E, dur) => {
  room();
  const tb = 1.0; snap(clamp(0.3 + t / tb * 0.7), (t - tb) / 0.16, { fly: 0.16 });
  const tries = [[3], [4], [5], [2], [3]];
  tries.forEach(([p], i) => { const a = seg(t, 1.6 + i * 0.35, 1.9 + i * 0.35); plate(p + "", 220 + i * 160, 500, 62, p >= 3 ? CORAL : GOLD, "center", a, 900); });
  plate("pieces, each try", 540, 400, 44, QUIET, "center", seg(t, 1.5, 1.8), 800);
  MASR(T, t, { ev: [[B(0) + 1.5, "?"]], look, s: 0.42, x: 150, y: 1600 });
};
// 3 — slow: the second visible event. The break replayed slowly; the bending wave glows gold as it runs.
SCENES.slow = (t, T, B, E, dur) => {
  room();
  const t0 = 0.6, SL = 10, tau = (t - t0) / SL;
  const r = snap(1, tau, { glow: 1, fly: 0.35 });
  plate("SLOW MOTION", 540, 380, 58, INK, "center", 1, 900);
  const wa = win(t, B(1), E(1) + 0.6, 0.3);
  if (wa > 0.01) plate("bending wave", 820, 600, 48, GOLD, "center", wa, 900);
  if (r.pieces === 3) plate("breaks again", 640, 1190, 56, CORAL, "center", seg(t, t0 + SL * r.tau2, t0 + SL * r.tau2 + 0.3), 900);
  else if (tau > 0.12) plate("snap back", 540, 1190, 56, INK, "center", seg(t, t0 + SL * 0.12, t0 + SL * 0.12 + 0.4), 900);
  else if (tau > 0) plate("first break", 540, 1190, 56, INK, "center", seg(t, t0, t0 + 0.3), 900);
  MASR(T, t, { ev: [[t0 + SL * 0.5 + 0.1, "!"]], look, s: 0.42, x: 150, y: 1600 });
};
// 4 — fix: twist about a full turn (stripes roll), then bend slowly: two pieces, no wave
SCENES.fix = (t, T, B, E, dur) => {
  room();
  const tw = seg(t, 2.6, B(0) + 4.6), bendT = seg(t, B(1), B(1) + 2.0), tb = B(1) + 2.0;
  const r = snap(0.05 + 0.95 * bendT, (t - tb) / 0.5, { twist: tw, calm: 1 });
  // twist arrows around the hands
  const ta = win(t, 2.4, B(1) + 0.3, 0.3);
  if (ta > 0.01) { [[150, -1], [930, 1]].forEach(([x, sgn]) => { g.save(); g.globalAlpha = ta; g.strokeStyle = GOLD; g.lineWidth = 10; g.lineCap = "round"; const a0 = -1.2 + sgn * tw * 2; g.beginPath(); g.arc(x, YM + 40, 95, a0, a0 + 2.6); g.stroke(); g.restore(); }); plate("twist ≈ 1 turn", 540, 380, 58, GOLD, "center", ta, 900); }
  plate("MIT, 2018", 540, 480, 44, INK, "center", win(t, 0.3, B(1), 0.3), 800);
  if (t > tb + 0.3) plate("2 pieces", 540, 1130, 60, GOLD, "center", seg(t, tb + 0.3, tb + 0.6), 900);
  MASR(T, t, { ev: [[tb + 0.5, "ok", "grin"]], look, s: 0.42, x: 150, y: 1600 });
};
// 5 — end: a fresh strand in the hands, bending again: loops into frame one
SCENES.end = (t, T, B, E, dur) => {
  room();
  snap(0.45 * seg(t, 0.3, dur), -1);
  MASR(T, t, { ev: [[0.4, "idea", "smile"]], look, s: 0.42, x: 150, y: 1600 });
};
