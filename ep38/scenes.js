// Episode 38 (Short v3, 1080×1920): there's a hole in what you see.
// Facts (claims.md): the optic disc, where the optic nerve and blood vessels leave the eye, has no photoreceptors;
// it sits ~15° to the temple side of fixation, so each eye has a blind spot you don't notice because the brain fills it
// in from its surroundings (Ramachandran 1992, Sci Am; standard physiology texts). Test: left eye closed, the right eye
// fixates a cross on the LEFT; a dot on the RIGHT disappears at a certain distance (here ~18–25 cm on a phone).

function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 800, 80, 540, 800, 980);
  gr.addColorStop(0, "rgb(112,128,196)"); gr.addColorStop(0.6, "rgb(70,90,160)"); gr.addColorStop(1, "rgb(28,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// the test card: a light panel with a cross on the left and a dot on the right
const CX = 140, DX = 920, TY = 820;
function card(a = 1, dotA = 1) {
  if (a <= 0.01) return;
  rrect(40, 620, 1000, 400, 40, [242, 245, 251], 0.96 * a);
  g.save(); g.globalAlpha = a; g.strokeStyle = "#1C2440"; g.lineWidth = 16; g.lineCap = "round";
  g.beginPath(); g.moveTo(CX - 44, TY); g.lineTo(CX + 44, TY); g.moveTo(CX, TY - 44); g.lineTo(CX, TY + 44); g.stroke(); g.restore();
  dot(DX, TY, 46, [24, 32, 64], a * dotA);
}
// eye in cross-section (side view, looking left): retina lining with receptor ticks, and a gap where the nerve leaves
function eyeSection(cx, cy, R, a = 1, T = 0, hi = 0) {
  if (a <= 0.01) return;
  dot(cx, cy, R, [250, 250, 252], a);
  g.save(); g.globalAlpha = a; g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.arc(cx, cy, R, 0, TAU2); g.stroke(); g.restore();
  dot(cx - R + 20, cy, 70, [90, 150, 210], a); dot(cx - R + 20, cy, 34, [20, 22, 30], a);   // iris + pupil at the front (left)
  const gap0 = -0.12, gap1 = 0.12;   // the disc, at the back (right), slightly off-axis
  for (let i = 0; i < 70; i++) { const an = -1.9 + i * (3.8 / 69); if (an > gap0 && an < gap1) continue; const x1 = cx + (R - 6) * Math.cos(an), y1 = cy + (R - 6) * Math.sin(an), x2 = cx + (R - 34) * Math.cos(an), y2 = cy + (R - 34) * Math.sin(an); line(x1, y1, x2, y2, [210, 120, 140], a, 6); }
  // optic nerve leaving to the right
  g.save(); g.globalAlpha = a; g.fillStyle = "rgb(236,206,150)"; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(cx + R - 10, cy - 50); g.lineTo(cx + R + 140, cy - 70); g.lineTo(cx + R + 140, cy + 70); g.lineTo(cx + R - 10, cy + 50); g.closePath(); g.fill(); g.stroke(); g.restore();
  if (hi > 0.01) { g.save(); g.globalAlpha = hi; g.strokeStyle = CORAL; g.lineWidth = 8; g.beginPath(); g.arc(cx + R - 10, cy, 60, 0, TAU2); g.stroke(); g.restore(); }
}
// a striped field with a hole that gets filled
function stripes(x, y, w, h, fillK, a = 1, T = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.beginPath(); g.rect(x, y, w, h); g.clip();
  for (let i = -10; i < 30; i++) { g.fillStyle = i % 2 ? "rgb(255,212,94)" : "rgb(120,170,236)"; g.beginPath(); const xx = x + i * 60 + (T * 20) % 120; g.moveTo(xx, y); g.lineTo(xx + 60, y); g.lineTo(xx + 60 - h * 0.5, y + h); g.lineTo(xx - h * 0.5, y + h); g.closePath(); g.fill(); }
  g.restore();
  const hx = x + w * 0.62, hy = y + h * 0.5;
  dot(hx, hy, 90, [24, 32, 64], a * (1 - fillK));
}
const look = [0.6, -0.5];
const SCENES = {};

// 1 — hook: frame one = the test card (a cross and a dot); the dot blinks out once, a hint of the hole
SCENES.hook = (t, T, B, E, dur) => {
  room(); card(1, 1 - 0.85 * win(t, 0.9, 1.9, 0.25));
  MASR(T, t, { ev: [[1.0, "?"]], look, mouth: "o" });
};

// 2 — nerve: the eye in cross-section; light lands everywhere, but the gap where the nerve leaves has no sensors
SCENES.nerve = (t, T, B, E, dur) => {
  room();
  card(1 - seg(t, 0, 0.4));
  const a = seg(t, 0.2, 0.7);
  eyeSection(500, 820, 300, a, T, seg(t, 2.0, 2.4));
  for (let i = 0; i < 3; i++) { const u = (T * 0.8 + i / 3) % 1, ty = 820 + (i - 1) * 90; line(120, ty, lerp(120, 790, u), lerp(ty, 820 + (i - 1) * 8, u), GOLDc, a * 0.9, 6); }
  plate("light sensors", 330, 470, 42, [240, 160, 175], "center", seg(t, 0.8, 1.2), 800);
  plate("no sensors here", 820, 560, 44, CORAL, "center", seg(t, 2.2, 2.6), 900);
  plate("optic nerve", 870, 1000, 40, [236, 206, 150], "center", seg(t, 1.2, 1.6), 800);
  MASR(T, t, { ev: [[2.4, "!"]], look, mouth: "o" });
};

// 3 — fill: a striped view with a dark hole; the stripes grow into the hole
SCENES.fill = (t, T, B, E, dur) => {
  room();
  stripes(60, 560, 960, 520, eio(seg(t, 1.0, 2.6)), seg(t, 0, 0.4), T);
  plate("your brain fills it in", 540, 300, 50, GOLD, "center", seg(t, 1.4, 1.8), 900);
  MASR(T, t, { ev: [[2.4, "idea"]], look, mouth: "o" });
};

// 4 — try: the test card; instructions in the top band; the card does not move (no zoom on this scene)
SCENES.try = (t, T, B, E, dur) => {
  room(); card(seg(t, 0, 0.3));
  plate("close your LEFT eye", 540, 300, 50, INK, "center", seg(t, 0.3, 0.7) * (1 - seg(t, B(1) - 0.3, B(1))), 900);
  plate("stare at the +", 540, 420, 50, GOLD, "center", seg(t, 1.4, 1.8) * (1 - seg(t, B(1) - 0.3, B(1))), 900);
  plate("move closer slowly…", 540, 300, 50, INK, "center", seg(t, B(1), B(1) + 0.4), 900);
  // a pulsing ring around the cross draws the eye to it
  g.save(); g.globalAlpha = 0.6 * seg(t, 1.4, 1.8); g.strokeStyle = GOLD; g.lineWidth = 6; g.beginPath(); g.arc(CX, TY, 70 + 8 * Math.sin(T * 4), 0, TAU2); g.stroke(); g.restore();
  MASR(T, t, { ev: [[0.5, "!"], [B(1) + 1.6, "!", "grin"]], look, mouth: "o" });
};

// 5 — end: the card again (frame one)
SCENES.end = (t, T, B, E, dur) => {
  room(); card(1);
  plate("you never notice the hole", 540, 300, 48, GOLD, "center", win(t, 0.3, dur - 1.15, 0.3), 900);
  MASR(T, t, { ev: [[0.5, "ok", "grin"]], look, mouth: "o" });
};
