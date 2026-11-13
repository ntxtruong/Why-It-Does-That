// Episode 28 (Short v3, 1080×1920): Earth is closest to the Sun in January.
// Facts (sources.md): perihelion early January, about 147.1 million km; aphelion early July, about 152.1 million km
// (eccentricity 0.0167, about 7 % more sunlight at perihelion). Seasons come from the 23.5° axial tilt, not distance.
// The orbit on screen is exaggerated (the real one is almost a circle) and says so. The tilt panel is a side view:
// sunlight from the left, axis 23.5° from vertical with the north end leaning away from the Sun (January).
// At 45° N the sunlight meets the ground at cos i = cos(45°+23.5°) ≈ 0.37; at 45° S cos i = cos(45°−23.5°) ≈ 0.93,
// so the same beam spreads over about 2.5× more ground in the north.

const TILT = 23.5 * Math.PI / 180;
const OCX = 540, OCY = 800, ORX = 400, ORY = 300, SUNX = 590, SUNY = 800;   // Sun offset toward January (right end)
const opos = th => [OCX + ORX * Math.cos(th), OCY + ORY * Math.sin(th)];
const SKY1 = [70, 100, 168];
function room() {
  clear(BG);
  const gr = g.createRadialGradient(560, 760, 80, 560, 760, 950);
  gr.addColorStop(0, "rgb(78,104,170)"); gr.addColorStop(0.6, "rgb(48,70,130)"); gr.addColorStop(1, "rgb(24,38,79)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) { const x = hash(i, 1) * W, y = 380 + hash(i, 2) * 900; dot(x, y, 1.5 + hash(i, 3) * 2.2, INKc, 0.25 + 0.25 * hash(i, 4)); }
}
function sun(x, y, r, T, a = 1) {
  if (a <= 0.01) return;
  soft(x, y, r * 3.2, [255, 210, 110], 0.55 * a);
  g.save(); g.globalAlpha = a;
  for (let i = 0; i < 12; i++) { const an = i / 12 * TAU2 + T * 0.25, r1 = r * 1.18, r2 = r * (1.45 + 0.08 * Math.sin(T * 3 + i)); g.strokeStyle = "rgba(255,212,94,0.9)"; g.lineWidth = 8; g.lineCap = "round"; g.beginPath(); g.moveTo(x + r1 * Math.cos(an), y + r1 * Math.sin(an)); g.lineTo(x + r2 * Math.cos(an), y + r2 * Math.sin(an)); g.stroke(); }
  const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); gr.addColorStop(0, "#FFF6C8"); gr.addColorStop(1, "#FFC23A");
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, TAU2); g.fill(); g.restore();
}
// Earth: ocean disc, two simple land shapes, axis (north up-right by 23.5°), night side away from the light at (lx, ly)
function earth(x, y, r, lx, ly, a = 1, o = {}) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  const ax = Math.sin(TILT), ay = -Math.cos(TILT);
  g.strokeStyle = "rgba(242,245,251,0.95)"; g.lineWidth = Math.max(4, r * 0.06); g.lineCap = "round";
  g.beginPath(); g.moveTo(x - ax * r * 1.35, y - ay * r * 1.35); g.lineTo(x + ax * r * 1.35, y + ay * r * 1.35); g.stroke();
  g.save(); g.beginPath(); g.arc(x, y, r, 0, TAU2); g.clip();
  g.fillStyle = "#2F7FD8"; g.fillRect(x - r, y - r, 2 * r, 2 * r);
  g.translate(x, y); g.rotate(TILT); g.fillStyle = "#59B56A";
  g.beginPath(); g.ellipse(-r * 0.25, -r * 0.45, r * 0.42, r * 0.3, 0.4, 0, TAU2); g.fill();
  g.beginPath(); g.ellipse(r * 0.3, r * 0.35, r * 0.28, r * 0.4, -0.3, 0, TAU2); g.fill();
  g.fillStyle = "rgba(255,255,255,0.92)"; g.beginPath(); g.ellipse(0, -r * 0.93, r * 0.5, r * 0.16, 0, 0, TAU2); g.fill(); g.beginPath(); g.ellipse(0, r * 0.93, r * 0.5, r * 0.16, 0, 0, TAU2); g.fill();
  if (o.equator) { g.strokeStyle = "rgba(255,255,255,0.55)"; g.lineWidth = Math.max(2, r * 0.015); g.setLineDash([r * 0.06, r * 0.05]); g.beginPath(); g.moveTo(-r, 0); g.lineTo(r, 0); g.stroke(); g.setLineDash([]); }
  g.rotate(-TILT); g.translate(-x, -y);
  // night half: the side facing away from the light
  const an = Math.atan2(ly - y, lx - x);
  g.fillStyle = "rgba(8,14,34,0.62)"; g.beginPath(); g.arc(x, y, r + 1, an + Math.PI / 2, an + Math.PI * 1.5); g.closePath(); g.fill();
  g.restore();
  g.strokeStyle = "rgba(242,245,251,0.95)"; g.lineWidth = Math.max(3, r * 0.04); g.beginPath(); g.arc(x, y, r, 0, TAU2); g.stroke();
  // the north end of the axis on top of the disc, labelled
  g.beginPath(); g.moveTo(x + ax * r * 0.98, y + ay * r * 0.98); g.lineTo(x + ax * r * 1.35, y + ay * r * 1.35); g.stroke();
  g.restore();
  if (o.N) text("N", x + ax * r * 1.6, y + ay * r * 1.6, Math.max(40, r * 0.24), INK, "center", 900, a);
}
function orbitPath(a = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = 0.75 * a; g.strokeStyle = "rgba(242,245,251,0.85)"; g.lineWidth = 4; g.setLineDash([16, 14]);
  g.beginPath(); g.ellipse(OCX, OCY, ORX, ORY, 0, 0, TAU2); g.stroke(); g.restore();
}
function months(hi, a = 1) {   // month labels just outside the orbit; hi = {JAN:k, JUL:k}
  [["JAN", 0], ["APR", Math.PI / 2], ["JUL", Math.PI], ["OCT", Math.PI * 1.5]].forEach(([m, th]) => {
    const side = Math.abs(Math.cos(th)) > 0.5, [x, y] = side ? [OCX + ORX * Math.cos(th), OCY + 110] : [OCX, OCY + (ORY + 62) * Math.sin(th)], k = (hi && hi[m]) || 0;
    plate(m, x, y, 44 + 10 * k, k > 0.5 ? GOLD : QUIET, "center", a, 900);
  });
}
function distBar(th, label, a, col = GOLD) {
  if (a <= 0.01) return;
  const [x, y] = opos(th), dx = x - SUNX, dy = y - SUNY, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L;
  const x1 = SUNX + ux * 130, y1 = SUNY + uy * 130, x2 = x - ux * 66, y2 = y - uy * 66, p = seg(a, 0, 1);
  line(x1, y1, lerp(x1, x2, p), lerp(y1, y2, p), col, 1, 7);
  arrow(lerp(x1, x2, p) - ux * 2, lerp(y1, y2, p) - uy * 2, lerp(x1, x2, p), lerp(y1, y2, p), col, p, 7, 20);
  plate(label, (x1 + x2) / 2, (y1 + y2) / 2 - 70, 50, col, "center", p, 900);
}
function orbitView(th, T, o = {}) {
  orbitPath(1);
  months(o.hi, 1);
  sun(SUNX, SUNY, 110, T, 1);
  const [ex, ey] = opos(th);
  earth(ex, ey, 58, SUNX, SUNY, 1, { N: o.N });
}
const tag = a => text("orbit shape exaggerated", 560, 1035, 40, QUIET, "center", 600, a);
const look = [0.7, -0.6];
const SCENES = {};

// 1 — hook: frame one = Earth arriving at January, the closest point; JUL marked as not the answer
SCENES.hook = (t, T, B, E, dur) => {
  room();
  const th = lerp(-0.55, 0, eout(t / 2.2));
  orbitView(th, T, { hi: { JAN: seg(t, 1.6, 2.2) }, N: false });
  distBar(0, "closest", seg(t, 1.9, 2.7) * 1.0001, GOLD);
  const [jx, jy] = [OCX - ORX, OCY + 110];
  const x = seg(t, B(1), B(1) + 0.4);
  if (x > 0.01) { line(jx - 50, jy - 36, lerp(jx - 50, jx + 50, x), lerp(jy - 36, jy + 36, x), CORAL, 1, 9); line(jx + 50, jy - 36, lerp(jx + 50, jx - 50, x), lerp(jy - 36, jy + 36, x), CORAL, x, 9); }
  tag(0.9);
  MASR(T, t, { ev: [[0.5, "!"], [B(1) + 0.3, "?", "o"]], look, mouth: "o" });
};

// 2 — dist: 147 million km in January; Earth travels to July, 152 million km
SCENES.dist = (t, T, B, E, dur) => {
  room();
  const th = lerp(0, Math.PI, eio(seg(t, B(1) - 0.9, B(1) + 0.5)));
  orbitView(th, T, { hi: { JAN: 1 - seg(t, B(1) - 0.9, B(1) - 0.4), JUL: seg(t, B(1), B(1) + 0.4) } });
  distBar(0, "147 million km", seg(t, 0.3, 1.0) * (1 - seg(t, B(1) - 1.0, B(1) - 0.6)), GOLD);
  distBar(Math.PI, "152 million km", seg(t, B(1) + 0.3, B(1) + 1.0), BLUE);
  tag(0.9);
  MASR(T, t, { ev: [[1.0, "idea"], [B(1) + 0.8, "!", "o"]], look, mouth: "o" });
};

// 3 — why: back to January; the north is in winter; "distance isn't the reason" crosses out the distance; push toward Earth
SCENES.why = (t, T, B, E, dur) => {
  room();
  const th = lerp(Math.PI, TAU2, eio(seg(t, 0.1, 1.6))), [ex, ey] = opos(th);
  orbitView(th, T, { hi: { JAN: seg(t, 1.4, 1.8) }, N: true });
  // winter in the north: a snowflake badge above-left of Earth
  const sx = ex - 120, sy = ey - 130, snowA = seg(t, 1.0, 1.4) * (1 - seg(t, B(1) - 0.3, B(1)));
  if (snowA > 0.01) { g.save(); g.globalAlpha = snowA; g.strokeStyle = "#DDF0FF"; g.lineWidth = 8; g.lineCap = "round"; for (let i = 0; i < 6; i++) { const an = i * Math.PI / 3; g.beginPath(); g.moveTo(sx, sy); g.lineTo(sx + 50 * Math.cos(an), sy + 50 * Math.sin(an)); g.stroke(); } g.restore(); }
  plate("winter up north", 640, 1250, 50, BLUE, "center", seg(t, 1.0, 1.4) * (1 - seg(t, B(1) - 0.3, B(1))), 900);
  const crossA = seg(t, B(1) + 0.1, B(1) + 0.5) * (1 - seg(t, B(1) + 1.4, B(1) + 1.8));
  if (crossA > 0.01) { distBar(0, "distance?", 1, GOLD); const mx = (SUNX + ex) / 2; line(mx - 70, ey - 60, mx + 70, ey + 60, CORAL, crossA, 12); line(mx + 70, ey - 60, mx - 70, ey + 60, CORAL, crossA, 12); }
  plate("not the reason", 640, 1250, 50, CORAL, "center", crossA, 900);
  plate("tilted 23.5°", 640, 1250, 54, GOLD, "center", seg(t, B(1) + 1.8, B(1) + 2.3), 900);
  MASR(T, t, { ev: [[B(0) + 0.6, "?"], [B(1) + 1.9, "idea", "smile"]], look, mouth: "o" });
};

// 4 — tilt: side view, sunlight from the left. Same beam: low and spread in the north, direct and tight in the south.
const ER = 250, EX = 640, EY = 780;
function beamOn(lat, a, col, label, ly) {   // a bundle of sunlight 90 px tall hitting the sunlit meridian at latitude lat
  if (a <= 0.01) return;
  const ex = -Math.cos(TILT), ey = -Math.sin(TILT), axx = Math.sin(TILT), axy = -Math.cos(TILT);
  const nx = Math.cos(lat) * ex + Math.sin(lat) * axx, ny = Math.cos(lat) * ey + Math.sin(lat) * axy;
  const px = EX + ER * nx, py = EY + ER * ny, cosi = clamp(-nx, 0.05, 1);   // sunlight travels +x, so cos(incidence) = −n·x
  const h = 90, L = h / cosi, dAng = L / ER / 2, base = Math.atan2(ny, nx);
  const p = seg(a, 0, 1);
  // rays from the left edge to the surface
  g.save(); g.globalAlpha = p * 0.95;
  for (let j = -2; j <= 2; j++) {
    const ang = base + j / 2 * dAng, sx = EX + ER * Math.cos(ang), sy = EY + ER * Math.sin(ang);
    line(Math.max(40, sx - 600), sy, sx, sy, col, 1, 6);
  }
  g.restore();
  // the patch of ground it lights
  g.save(); g.globalAlpha = p; g.strokeStyle = css(col); g.lineWidth = 18; g.lineCap = "round"; g.beginPath(); g.arc(EX, EY, ER, base - dAng, base + dAng); g.stroke(); g.restore();
  plate(label, 640, ly, 46, col, "center", seg(a, 0.5, 1), 900);
}
SCENES.tilt = (t, T, B, E, dur) => {
  room();
  // the Sun far to the left, off frame: a warm glow on the left edge
  soft(-80, EY, 520, [255, 210, 110], 0.7);
  earth(EX, EY, ER, -2000, EY, 1, { N: true, equator: true });
  // 23.5° angle mark against the vertical
  const ax = Math.sin(TILT), ay = -Math.cos(TILT), ta = seg(t, 0.2, 0.8) * (1 - seg(t, 2.0, 2.6));
  line(EX, EY - ER * 1.1, EX, EY - ER * 1.55, QUIET, ta, 4, [10, 10]);
  g.save(); g.globalAlpha = ta; g.strokeStyle = css(GOLDc); g.lineWidth = 5; g.beginPath(); g.arc(EX, EY, ER * 1.45, -Math.PI / 2, -Math.PI / 2 + TILT); g.stroke(); g.restore();
  plate("23.5°", EX - 120, EY - ER * 1.42, 50, GOLD, "center", ta, 900);
  plate("north leans away", 640, 400, 50, INK, "center", seg(t, 2.2, 2.7), 900);
  beamOn(45 * Math.PI / 180, seg(t, 1.6, 2.6), GOLDc, "north: low, spread out", 1150);
  beamOn(-45 * Math.PI / 180, seg(t, 3.4, 4.4), [255, 236, 170], "south: high, concentrated", 1240);
  text("same sunlight", 230, EY - 20, 44, GOLD, "center", 800, seg(t, 1.2, 1.8) * (1 - seg(t, 3.0, 3.4)));
  MASR(T, t, { ev: [[0.8, "?"], [2.6, "!"], [4.6, "idea", "grin"]], look: [0.6, -0.5], mouth: "o" });
};

// 5 — end: back to frame one (orbit, Earth at January, closest) for the loop
SCENES.end = (t, T, B, E, dur) => {
  room();
  orbitView(0, T, { hi: { JAN: 1 } });
  distBar(0, "closest", 1, GOLD);
  tag(0.9);
  MASR(T, t, { ev: [[0.6, "ok", "grin"]], look, mouth: "o" });
};
