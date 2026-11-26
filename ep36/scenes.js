// Episode 36 (Short v3, 1080×1920): a sausage can work your touchscreen.
// Facts (claims.md): projected-capacitive touchscreens drive a grid of transparent electrodes under the glass and sense
// the change in capacitance (the electric field) when a conductive object comes close; they do not sense pressure
// (some phones add separate force sensors). A finger, or a sausage (salty, wet, conductive), registers; a wool glove
// (an insulator, thick) does not, unless it has conductive thread. Field lines below are schematic.

function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 800, 80, 540, 800, 980);
  gr.addColorStop(0, "rgb(112,128,196)"); gr.addColorStop(0.6, "rgb(70,90,160)"); gr.addColorStop(1, "rgb(28,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// a phone, front view; ripple at (rx, ry) with strength rp
function phone(x, y, w, h, T, a = 1, rx = 0, ry = 0, rp = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  rrect(x, y, w, h, 60, [30, 34, 48], 1, INK, 8);
  const sx = x + 24, sy = y + 24, sw = w - 48, sh = h - 48;
  const gr = g.createLinearGradient(sx, sy, sx, sy + sh); gr.addColorStop(0, "rgb(120,160,236)"); gr.addColorStop(1, "rgb(200,150,220)");
  g.fillStyle = gr; g.beginPath(); g.roundRect(sx, sy, sw, sh, 40); g.fill();
  for (let i = 0; i < 12; i++) { const c = i % 3, r = Math.floor(i / 3); rrect(sx + 40 + c * (sw - 80) / 3 + 10, sy + 100 + r * 150, (sw - 80) / 3 - 40, 100, 26, [242, 245, 251], 0.85); }
  if (rp > 0.01) { g.save(); g.beginPath(); g.roundRect(sx, sy, sw, sh, 40); g.clip(); for (let k = 0; k < 3; k++) { const u = ((T * 1.2 + k / 3) % 1); g.strokeStyle = `rgba(255,212,94,${rp * (1 - u)})`; g.lineWidth = 8; g.beginPath(); g.arc(rx, ry, 30 + 160 * u, 0, TAU2); g.stroke(); } g.restore(); }
  g.restore();
}
function sausage(x, y, ang, a = 1, s = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(ang); g.scale(s, s);
  g.fillStyle = "#C2564A"; g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.roundRect(-60, -420, 120, 440, 60); g.fill(); g.stroke();
  g.strokeStyle = "rgba(255,200,180,0.6)"; g.lineWidth = 6; g.beginPath(); g.moveTo(-25, -380); g.lineTo(-25, -40); g.stroke();
  g.restore();
}
function finger(x, y, a = 1, glove = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  g.fillStyle = glove ? "#8C93A8" : "#F0CDB4"; g.strokeStyle = INK; g.lineWidth = 8;
  const w = glove ? 78 : 62;
  g.beginPath(); g.moveTo(x - w, y - 460); g.lineTo(x - w, y - 60); g.quadraticCurveTo(x - w, y, x, y); g.quadraticCurveTo(x + w, y, x + w, y - 60); g.lineTo(x + w, y - 460); g.closePath(); g.fill(); g.stroke();
  if (glove) { g.strokeStyle = "rgba(220,224,236,0.6)"; g.lineWidth = 5; for (let i = 0; i < 9; i++) { const yy = y - 40 - i * 46; g.beginPath(); for (let k = -3; k <= 3; k++) { const xx = x + k * 22; g.lineTo(xx, yy + (k % 2 ? 10 : 0)); } g.stroke(); } }
  else { g.fillStyle = "#F8E1D2"; g.beginPath(); g.roundRect(x - 34, y - 120, 68, 84, 26); g.fill(); }
  g.restore();
}
// side view of the glass with electrodes underneath and field arcs above; bend = how much arcs are pulled to (bx) by a conductor
const GY = 1000;
function sideView(T, a, bx, bend) {
  if (a <= 0.01) return;
  rrect(80, GY, 920, 60, 12, [200, 230, 246], a * 0.95);
  for (let i = 0; i < 9; i++) rrect(110 + i * 102, GY + 74, 70, 26, 8, GOLDc, a);
  text("electrodes", 540, GY + 150, 44, QUIET, "center", 800, a);
  for (let i = 0; i < 8; i++) {
    const x1 = 160 + i * 98, x2 = x1 + 98, xm = (x1 + x2) / 2, near = Math.exp(-Math.pow((xm - bx) / 110, 2)) * bend;
    const h = 230 + 30 * Math.sin(T * 3 + i), py = GY - h - near * 260;
    g.save(); g.globalAlpha = a * (0.75 + 0.25 * near); g.strokeStyle = near > 0.3 ? GOLD : BLUE; g.lineWidth = 8; g.setLineDash([18, 12]); g.lineDashOffset = -T * 40;
    g.beginPath(); g.moveTo(x1, GY); g.quadraticCurveTo(lerp(xm, bx, near * 0.6), py, x2, GY); g.stroke(); g.restore();
  }
}
const look = [0.6, -0.5];
const SCENES = {};
const PX = 280, PY = 430, PW = 520, PH = 900;

// 1 — hook: frame one = a phone and a sausage tapping an app; a ripple where it touches
SCENES.hook = (t, T, B, E, dur) => {
  room();
  const tap = Math.abs(Math.sin(T * 2.6));
  phone(PX, PY, PW, PH, T, 1, 640, 830, 1 - tap * 0.6);
  sausage(640, 820 - 50 * tap, 0.35);
  MASR(T, t, { ev: [[0.5, "!"]], look, mouth: "o" });
};

// 2 — field: "no pressure" (a press does nothing to the field); then the glass in side view with field arcs
SCENES.field = (t, T, B, E, dur) => {
  room();
  const k = seg(t, B(1) - 0.3, B(1) + 0.3);
  phone(PX, PY, PW, PH, T, 1 - k);
  plate("pressure? not sensed", 540, 300, 50, CORAL, "center", seg(t, 0.4, 0.8) * (1 - k), 900);
  sideView(T, k, -999, 0);
  plate("a tiny electric field over the glass", 540, 300, 44, BLUE, "center", seg(t, B(1) + 0.4, B(1) + 0.8), 900);
  MASR(T, t, { ev: [[0.6, "?"], [B(1) + 0.6, "idea"]], look, mouth: "o" });
};

// 3 — conduct: a finger comes down and pulls the field; "touch!"; then a sausage does the same
SCENES.conduct = (t, T, B, E, dur) => {
  room();
  const sw = seg(t, 3.0, 3.4), bx = 540;
  const dn1 = eio(seg(t, 0.3, 1.2)) * (1 - sw), dn2 = eio(seg(t, 3.3, 4.2));
  sideView(T, 1, bx, Math.max(dn1, dn2));
  finger(bx, lerp(560, GY - 4, dn1), 1 - sw);
  sausage(bx, lerp(560, GY - 4, dn2), 0, sw, 1);
  plate("touch!", 820, 560, 50, GOLD, "center", Math.max(seg(t, 1.1, 1.4) * (1 - sw), seg(t, 4.1, 4.4)), 900);
  plate("conducts → disturbs the field", 540, 300, 44, GOLD, "center", seg(t, 1.4, 1.8), 900);
  MASR(T, t, { ev: [[1.2, "!"], [4.2, "!", "grin"]], look, mouth: "o" });
};

// 4 — glove: a wool glove presses; the field does not change; "no touch"
SCENES.glove = (t, T, B, E, dur) => {
  room();
  const dn = eio(seg(t, 0.2, 1.0));
  sideView(T, 1, 540, 0);
  finger(540, lerp(560, GY - 4, dn), 1, 1);
  plate("wool glove", 540, 300, 50, INK, "center", seg(t, 0.2, 0.6), 900);
  plate("no touch", 820, 560, 50, CORAL, "center", seg(t, 1.2, 1.6), 900);
  MASR(T, t, { ev: [[1.4, "?", "wince"]], look, mouth: "o" });
};

// 5 — end: phone + sausage again (frame one)
SCENES.end = (t, T, B, E, dur) => {
  room();
  const tap = Math.abs(Math.sin(T * 2.6));
  phone(PX, PY, PW, PH, T, 1, 640, 830, 1 - tap * 0.6);
  sausage(640, 820 - 50 * tap, 0.35);
  MASR(T, t, { ev: [[0.5, "ok", "grin"]], look, mouth: "o" });
};
