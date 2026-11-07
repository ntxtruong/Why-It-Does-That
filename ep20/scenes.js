// Episode 20 (new Short, 1080×1920) — Why do onions make you cry?
// Mechanism (Imai et al. 2002, Nature; Eady et al. 2008, Plant Physiology): the sulfur precursor (isoalliin) and the
// enzyme alliinase sit in separate compartments; a cut mixes them; alliinase makes a sulfenic acid; a second enzyme,
// lachrymatory factor synthase (LFS), turns it into the volatile tear gas (syn-propanethial-S-oxide), which irritates
// nerve endings in the cornea; tears flush it. Every dot below is placed by hash() and moves as a closed-form function of t.
// Shorts v2 layout: subject 380–1250 px, burned-in captions 1330–1500 right of the character.

const SKIN = [176, 112, 70], FLESH = [248, 236, 246], RING = [168, 78, 142], GAS = [205, 240, 120], ENZ = [140, 198, 255], ENZ2 = [120, 220, 170];
// a red onion cut in half: rings, a knife resting in the cut, gas wisps rising
function onionHalf(cx, cy, R, T, gas = 1, a = 1, knife = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  g.fillStyle = css(SKIN); g.beginPath(); g.ellipse(cx, cy, R * 1.03, R * 0.95, 0, 0, TAU2); g.fill();
  for (let i = 0; i < 7; i++) { const r = R * (1 - i * 0.13); g.fillStyle = css(i % 2 ? FLESH : mix(FLESH, RING, 0.75)); g.beginPath(); g.ellipse(cx, cy + i * 6, r, r * 0.9, 0, 0, TAU2); g.fill(); }
  g.restore();
  if (knife > 0.01) { g.save(); g.globalAlpha = a * knife; g.translate(cx + R * 0.15, cy - R * 0.55); g.rotate(-0.5);
    g.fillStyle = "#cfd6e4"; g.beginPath(); g.moveTo(-40, 0); g.lineTo(R * 1.25, -10); g.lineTo(R * 1.25, 60); g.quadraticCurveTo(R * 0.4, 70, -40, 60); g.closePath(); g.fill();
    g.fillStyle = "#3b2a22"; g.beginPath(); g.roundRect(-230, 4, 200, 52, 18); g.fill(); g.restore(); }
  for (let i = 0; i < 26 * gas; i++) { const s = (T * 0.35 + hash(i, 5)) % 1, x = cx + (hash(i, 6) - 0.5) * R * 1.4 + 40 * Math.sin(T * 1.3 + i), y = cy - R * 0.5 - s * 460;
    dot(x, y, 10 + 8 * s, GAS, a * 0.75 * (1 - s) * Math.min(1, gas)); }
}
function tear(x, y, k, a = 1) { if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.fillStyle = css(BLUEc); g.beginPath(); g.moveTo(x, y - 30 * k); g.quadraticCurveTo(x + 20 * k, y, x, y + 16 * k); g.quadraticCurveTo(x - 20 * k, y, x, y - 30 * k); g.fill(); g.restore(); }
function cryTears(T, t, a = 1) { for (let i = 0; i < 2; i++) { const s = (T * 0.8 + i * 0.5) % 1; { g.save(); g.globalAlpha = a * (1 - s); g.fillStyle = "#F2F5FB"; g.beginPath(); g.arc(148 + i * 26, 1342 + s * 150, 17, 0, TAU2); g.fill(); g.restore(); tear(148 + i * 26, 1342 + s * 150, 1.7, a * (1 - s)); }; } }
const SCENES = {};

// 1 — hook: frame one = a cut red onion, the knife in it, gas rising, and a tear on the character's face
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette(0.25);
  const split = seg(t, B(1), B(1) + 0.6);
  onionHalf(lerp(560, 740, split), 820, lerp(300, 200, split), T, 1, 1, 1 - split * 0.4);
  // beat 1: a whole onion beside it, no gas at all
  if (split > 0.01) { g.save(); g.globalAlpha = split; g.fillStyle = css(SKIN); g.beginPath(); g.ellipse(270, 860, 170, 160, 0, 0, TAU2); g.fill();
    g.strokeStyle = "rgba(90,50,30,0.6)"; g.lineWidth = 5; for (let k = -2; k <= 2; k++) { g.beginPath(); g.ellipse(270, 860, 170 - Math.abs(k) * 40, 160, 0, -1.4, 1.4); g.stroke(); }
    g.fillStyle = "#6b8f3a"; g.beginPath(); g.moveTo(262, 700); g.lineTo(278, 700); g.lineTo(290, 620); g.lineTo(256, 640); g.closePath(); g.fill(); g.restore(); }
  plate("whole: no gas", 270, 1100, 42, INK, "center", seg(t, B(1) + 0.5, B(1) + 0.9), 800);
  plate("cut: gas", 740, 1100, 42, GOLD, "center", seg(t, B(1) + 1.3, B(1) + 1.7), 800);
  MASR(T, t, { ev: [[0.3, "!", "wince"], [B(1) + 1.4, "?"]], look: [0.9, -0.8], mouth: "wince" });
  cryTears(T, t, 1 - split * 0.6);
};

// 2 — trap: a grid of onion cells; precursor (gold) in the cytoplasm, enzyme (blue) behind the vacuole wall;
// the knife cuts a column, the walls break, the two meet; the second enzyme (green) makes the gas, which rises
const COLS = 4, ROWS = 4, CW = 230, CH = 190, GX = 80, GY = 430;
function cell(ci, ri) { return [GX + ci * CW, GY + ri * CH]; }
const CUTX = GX + 2 * CW;   // the knife runs down the seam between columns 1 and 2
SCENES.trap = (t, T, B, E, dur) => {
  clear(); vignette(0.25);
  const kt = B(1), kn = seg(t, kt, kt + 1.2), ky = lerp(330, GY + ROWS * CH + 80, kn);
  for (let ci = 0; ci < COLS; ci++) for (let ri = 0; ri < ROWS; ri++) {
    const [x, y] = cell(ci, ri), cx = x + CW / 2, cy = y + CH / 2, near = ci === 1 || ci === 2, tb = kt + (y + CH / 2 - 330) / (GY + ROWS * CH - 250) * 1.2;
    const broken = near ? seg(t, tb, tb + 0.4) : 0;
    rrect(x + 6, y + 6, CW - 12, CH - 12, 26, mix([60, 40, 70], [90, 50, 80], broken), 1, mix(FLESH, CORALc, broken), 5);
    // vacuole (enzyme store): its wall opens when the cell breaks
    g.save(); g.globalAlpha = 1 - 0.85 * broken; g.strokeStyle = css(ENZ); g.lineWidth = 4; g.setLineDash(broken > 0.1 ? [10, 12] : []);
    g.beginPath(); g.ellipse(cx + 40, cy, 58, 52, 0, 0, TAU2); g.stroke(); g.restore();
    for (let k = 0; k < 3; k++) {   // enzymes: inside the vacuole, then drifting toward the precursor
      const h1 = hash(ci * 31 + ri * 7 + k, 1), h2 = hash(ci * 31 + ri * 7 + k, 2), u = broken * seg(t, tb + 0.2, tb + 1.4);
      const ex = lerp(cx + 40 + (h1 - 0.5) * 60, cx - 60 + (h1 - 0.5) * 70, u), ey = lerp(cy + (h2 - 0.5) * 50, cy + (h2 - 0.5) * 110, u);
      g.save(); g.fillStyle = css(ENZ); g.beginPath(); g.moveTo(ex, ey); g.arc(ex, ey, 13, 0.5, TAU2 - 0.5); g.closePath(); g.fill(); g.restore(); }
    for (let k = 0; k < 4; k++) {   // precursor → acid (coral) → gas (pale green), rising out of the grid
      const px = x + 30 + hash(ci * 13 + ri * 5 + k, 3) * 80, py = y + 30 + hash(ci * 13 + ri * 5 + k, 4) * (CH - 60);
      const ta = tb + 1.0 + 0.25 * k, tg = Math.max(B(2) + 0.2 + 0.3 * k + 0.4 * hash(ci + ri * 4, 9), ta + 0.6);
      const acid = near ? seg(t, ta, ta + 0.3) : 0, gas = near ? seg(t, tg, tg + 0.3) : 0, rise = Math.max(0, t - tg);
      if (gas > 0.01) { dot(px + 30 * Math.sin(rise * 2 + k), py - rise * 230, 12, GAS, gas * (1 - clamp(rise / 3))); dot(px, py, 10, CORALc, 1 - gas); }
      else dot(px, py, 10, acid > 0 ? mix(GOLDc, CORALc, acid) : GOLDc, 1);
      if (acid > 0 && acid < 1) { g.save(); g.globalAlpha = 1 - acid; g.strokeStyle = css(CORALc); g.lineWidth = 3; g.beginPath(); g.arc(px, py, 10 + 30 * acid, 0, TAU2); g.stroke(); g.restore(); }
    }
    // second enzyme (LFS) in the broken cells
    if (near) { const ex = cx + 10 + 30 * Math.sin(T * 1.5 + ci + ri), ey = cy + 40 * Math.cos(T * 1.2 + ri), a2 = seg(t, B(2) - 0.2, B(2) + 0.3);
      g.save(); g.globalAlpha = a2; g.fillStyle = css(ENZ2); g.beginPath(); g.moveTo(ex, ey); g.arc(ex, ey, 15, 0.6, TAU2 - 0.6); g.closePath(); g.fill(); g.restore(); }
  }
  // the knife edge
  if (kn > 0 && kn < 1) { g.save(); g.fillStyle = "#dfe5ef"; g.beginPath(); g.moveTo(CUTX - 8, ky - 260); g.lineTo(CUTX + 8, ky - 260); g.lineTo(CUTX + 2, ky); g.lineTo(CUTX - 2, ky); g.closePath(); g.fill(); g.restore(); }
  // legend
  const lg = seg(t, 0.4, 0.9);
  dot(350, 1250, 12, GOLDc, lg); text("sulfur compound", 372, 1250, 36, GOLD, "left", 800, lg);
  g.save(); g.globalAlpha = lg; g.fillStyle = css(ENZ); g.beginPath(); g.moveTo(720, 1250); g.arc(720, 1250, 14, 0.5, TAU2 - 0.5); g.closePath(); g.fill(); g.restore(); text("enzyme", 745, 1250, 36, BLUE, "left", 800, lg);
  plate("kept apart", 540, 380, 48, INK, "center", win(t, 1.4, B(1) - 0.1, 0.3), 800);
  plate("cut: they mix", 540, 380, 48, CORAL, "center", win(t, B(1) + 0.4, B(2) - 0.1, 0.3), 800);
  plate("2nd enzyme → stinging gas", 540, 380, 46, GAS, "center", seg(t, B(2) + 0.4, B(2) + 0.9), 800);
  const lg2 = seg(t, B(2), B(2) + 0.5);
  g.save(); g.globalAlpha = lg2; g.fillStyle = css(ENZ2); g.beginPath(); g.moveTo(720, 1294); g.arc(720, 1294, 14, 0.6, TAU2 - 0.6); g.closePath(); g.fill(); g.restore(); text("enzyme 2", 745, 1294, 36, ENZ2, "left", 800, lg2);
  MASR(T, t, { ev: [[B(1) + 0.6, "!"], [B(2) + 0.8, "?", "wince"]], look: [0.9, -0.8], mouth: "o" });
};

// 3 — eye: gas reaches the cornea, its nerve endings fire, the tear gland floods the surface and washes the gas away
SCENES.eye = (t, T, B, E, dur) => {
  clear(); vignette(0.25);
  const C = [600, 800], R = 300;
  g.fillStyle = "#f4f1ee"; g.beginPath(); g.arc(C[0], C[1], R, 0, TAU2); g.fill();
  g.strokeStyle = css(QUIETc); g.lineWidth = 4; g.beginPath(); g.arc(C[0], C[1], R, 0, TAU2); g.stroke();
  // cornea: the clear bulge on the left; iris and pupil behind it
  g.fillStyle = "rgba(170,220,255,0.35)"; g.beginPath(); g.arc(C[0] - R + 40, C[1], 150, Math.PI * 0.55, Math.PI * 1.45); g.fill();
  g.strokeStyle = css(BLUEc); g.lineWidth = 6; g.beginPath(); g.arc(C[0] - R + 40, C[1], 150, Math.PI * 0.55, Math.PI * 1.45); g.stroke();
  g.fillStyle = "#6a4a2e"; g.fillRect(C[0] - R + 46, C[1] - 120, 26, 240); g.fillStyle = "#14161f"; g.fillRect(C[0] - R + 46, C[1] - 50, 26, 100);
  text("cornea", C[0] - R - 100, C[1] - 200, 40, BLUE, "center", 800, seg(t, 0.3, 0.8));
  plate("your eye, from the side", 560, 400, 44, INK, "center", win(t, 0.2, B(1) - 0.3, 0.3), 800);
  g.strokeStyle = "#e7b9a0"; g.lineWidth = 26; g.lineCap = "round"; g.beginPath(); g.arc(C[0] - 20, C[1] + 10, R + 30, Math.PI * 0.72, Math.PI * 0.95); g.stroke(); g.beginPath(); g.arc(C[0] - 20, C[1] - 10, R + 30, Math.PI * 1.05, Math.PI * 1.28); g.stroke();
  // nerve endings in the cornea: branches that light up when the gas lands
  const hit = seg(t, 1.6, 2.2) * (1 - 0.7 * seg(t, B(1) + 1.6, B(1) + 2.6));
  for (let i = 0; i < 7; i++) { const an = Math.PI * (0.65 + 0.7 * i / 6), x1 = C[0] - R + 40 + 150 * Math.cos(an), y1 = C[1] + 150 * Math.sin(an), x2 = x1 + 50 * Math.cos(an + 3.14) * -1, y2 = y1 + 50 * Math.sin(an);
    line(x1, y1, (x1 + x2) / 2 + 30, (y1 + y2) / 2, mix(QUIETc, GOLDc, hit), 0.6 + 0.4 * hit, 4 + 3 * hit * (0.6 + 0.4 * Math.sin(T * 12 + i))); }
  plate("nerve endings fire", 560, 1180, 44, GOLD, "center", seg(t, 2.0, 2.4) * (1 - seg(t, B(1) - 0.3, B(1))), 800);
  // gas arriving from the lower left
  const wash = seg(t, B(1) + 0.8, B(1) + 2.6);
  for (let i = 0; i < 22; i++) { const s = clamp((t - 0.2 - hash(i, 2) * 1.4) / 1.6), x = lerp(60, C[0] - R - 80 + 120 * Math.cos(Math.PI * (0.65 + 0.7 * hash(i, 3))), s), y = lerp(1250, C[1] + 150 * Math.sin(Math.PI * (0.65 + 0.7 * hash(i, 3))), s);
    dot(x + 6 * Math.sin(T * 3 + i), y + wash * 220 * hash(i, 4), 11, GAS, (s > 0 ? 0.85 : 0) * (1 - wash)); }
  // tear gland above, tears sweeping down over the cornea
  const gl = seg(t, B(1) - 0.3, B(1) + 0.3);
  g.save(); g.globalAlpha = gl; g.fillStyle = "rgba(255,170,180,0.9)"; g.beginPath(); g.ellipse(C[0] - 60, C[1] - R - 40, 90, 46, -0.3, 0, TAU2); g.fill(); g.restore();
  text("tear gland", C[0] + 60, C[1] - R - 100, 40, [255, 170, 180], "left", 800, gl);
  for (let i = 0; i < 10; i++) { const s = ((t - B(1) - 0.4) * 0.9 + i / 10) % 1; if (t < B(1) + 0.4) break;
    const an = Math.PI * (1.45 - 0.9 * s), x = C[0] - R + 40 + 165 * Math.cos(an), y = C[1] + 165 * Math.sin(an); tear(x, y, 1.2, gl * (1 - s * 0.5)); }
  plate("tears wash it away", 560, 1180, 44, BLUE, "center", seg(t, B(1) + 1.2, B(1) + 1.6), 800);
  MASR(T, t, { ev: [[1.9, "!", "wince"], [B(1) + 1.4, "ok", "smile"]], look: [0.9, -0.8], mouth: "wince" });
  cryTears(T, t, seg(t, B(1), B(1) + 0.5));
};

// 4 — fix: a chilled onion lets off less gas, more slowly; an onion with almost no enzyme 2 lets off almost none
SCENES.fix = (t, T, B, E, dur) => {
  clear(); vignette(0.25);
  const p1 = seg(t, 0.1, 0.5), p2 = seg(t, B(1) - 0.2, B(1) + 0.4);
  // panel 1: chilled (the gas rises slower and thinner)
  rrect(40, 400, 1000, 400, 28, [30, 50, 95], p1);
  g.save(); g.beginPath(); g.roundRect(40, 400, 1000, 400, 28); g.clip();
  onionHalf(330, 690, 150, T * 0.45, 0.35, p1, 0);
  g.restore();
  // a snowflake and a thermometer
  g.save(); g.globalAlpha = p1; g.strokeStyle = css(BLUEc); g.lineWidth = 7; g.lineCap = "round";
  for (let k = 0; k < 6; k++) { const an = k * Math.PI / 3 + 0.2 * Math.sin(T); g.beginPath(); g.moveTo(640, 560); g.lineTo(640 + 60 * Math.cos(an), 560 + 60 * Math.sin(an)); g.stroke(); } g.restore();
  plate("chilled: enzymes slower", 760, 700, 44, BLUE, "center", seg(t, 0.6, 1.0), 800);
  // panel 2: almost none of enzyme 2
  rrect(40, 830, 1000, 400, 28, [40, 60, 70], p2);
  g.save(); g.beginPath(); g.roundRect(40, 830, 1000, 400, 28); g.clip();
  onionHalf(330, 1120, 150, T, 0.08, p2, 0);
  g.restore();
  g.save(); g.globalAlpha = p2; g.fillStyle = css(ENZ2); g.beginPath(); g.moveTo(640, 960); g.arc(640, 960, 34, 0.6, TAU2 - 0.6); g.closePath(); g.fill(); g.restore();
  line(600, 920, 680, 1000, CORALc, p2, 9); line(680, 920, 600, 1000, CORALc, p2, 9);
  text("enzyme 2", 720, 962, 38, ENZ2, "left", 800, p2);
  plate("almost no gas", 760, 1110, 44, GAS, "center", seg(t, B(1) + 1.2, B(1) + 1.6), 800);
  MASR(T, t, { ev: [[0.8, "idea"], [B(1) + 1.5, "ok", "grin"]], look: [0.9, -0.8], mouth: t > B(1) + 1.5 ? "grin" : "smile" });
};

// 5 — end: the trap springs again; the last second is the opening frame (loop)
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette(0.25);
  const snap = seg(t, 0.2, 0.5), back = eio((t - (dur - 1.0)) / 0.9);
  onionHalf(560, 820, 300, T, 0.6 + 0.4 * snap, 1, 1);
  for (let k = 0; k < 2; k++) { const r = 80 + 300 * seg(t, 0.2 + k * 0.25, 1.2 + k * 0.25); g.save(); g.globalAlpha = (1 - seg(t, 0.6 + k * 0.25, 1.2 + k * 0.25)) * (1 - back); g.strokeStyle = css(GOLDc); g.lineWidth = 6; g.beginPath(); g.arc(560, 820, r, 0, TAU2); g.stroke(); g.restore(); }
  plate("a chemical trap", 560, 420, 52, GOLD, "center", seg(t, 0.6, 1.0) * (1 - back), 800);
  MASR(T, t, { ev: [[0.4, "!", "wince"]], look: [0.9, -0.8], mouth: "wince" });
  cryTears(T, t, back);
};
