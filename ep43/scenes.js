// Episode 43 (Short v3, 1080×1920): your phone camera can see your TV remote's infrared light.
// Facts (claims.md): IR remotes send pulsed near-infrared light from an LED at the tip; human vision fades out at the
// red end; a phone's silicon sensor still responds to near infrared; phones carry IR-cut filters, often stronger on the
// rear camera, so the selfie camera often shows the glow better; Bluetooth/RF remotes show nothing (UCL Engage).
// The spectrum strip is schematic (no numbers on screen).

function room() {
  const gr = g.createRadialGradient(540, 780, 80, 540, 780, 1000);
  gr.addColorStop(0, "rgb(120,140,196)"); gr.addColorStop(0.6, "rgb(70,92,156)"); gr.addColorStop(1, "rgb(30,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// a TV remote seen from above, tip pointing at angle `rot` (0 = right). glow = 0..1 shows the IR LED as a camera sees it.
function remote(cx, cy, s, rot, glow = 0, press = 0, a = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(cx, cy); g.rotate(rot); g.scale(s, s);
  g.fillStyle = "#2B3040"; g.strokeStyle = INK; g.lineWidth = 8;
  g.beginPath(); g.roundRect(-260, -70, 520, 140, 60); g.fill(); g.stroke();
  // tip LED window
  g.fillStyle = "#3F2A3A"; g.beginPath(); g.roundRect(222, -30, 34, 60, 14); g.fill();
  // buttons: power (coral), a d-pad ring, number keys
  g.fillStyle = CORAL; g.beginPath(); g.arc(170, 0, 24, 0, TAU2); g.fill();
  g.strokeStyle = "#8A93AE"; g.lineWidth = 10; g.beginPath(); g.arc(40, 0, 44, 0, TAU2); g.stroke();
  g.fillStyle = "#8A93AE"; g.beginPath(); g.arc(40, 0, 16, 0, TAU2); g.fill();
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { g.beginPath(); g.roundRect(-210 + i * 52, -44 + j * 32, 36, 20, 8); g.fill(); }
  // a thumb pressing the power button
  if (press > 0.01) { g.globalAlpha = a * press; g.fillStyle = "#F0D2BE"; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.ellipse(170, 6 - 30 * (1 - press), 46, 58, 0.2, 0, TAU2); g.fill(); g.stroke(); g.globalAlpha = a; }
  if (glow > 0.01) { soft(250, 0, 360, [196, 150, 255], glow * 0.95); soft(250, 0, 150, [255, 250, 255], glow); dot(244, 0, 34, [255, 255, 255], glow); }
  g.restore();
}
// a phone, upright, showing its camera view: the remote pointing at the viewer, tip glowing by `glow`
function phone(cx, cy, w, h, glow, T, a = 1, label) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  g.fillStyle = "#11162A"; g.strokeStyle = INK; g.lineWidth = 10; g.beginPath(); g.roundRect(cx - w / 2, cy - h / 2, w, h, w * 0.12); g.fill(); g.stroke();
  const m = w * 0.05, x0 = cx - w / 2 + m, y0 = cy - h / 2 + m * 1.6, sw = w - 2 * m, sh = h - m * 3.2;
  // screen: a dim living room as the camera sees it
  const gr = g.createLinearGradient(0, y0, 0, y0 + sh); gr.addColorStop(0, "#A3AED4"); gr.addColorStop(1, "#7783AE");
  g.fillStyle = gr; g.beginPath(); g.roundRect(x0, y0, sw, sh, w * 0.07); g.fill();
  g.save(); g.beginPath(); g.roundRect(x0, y0, sw, sh, w * 0.07); g.clip();
  // the same remote in the camera view; its tip glows only here
  remote(cx - 20 * w / 440, y0 + sh * 0.52, 0.74 * w / 440, -0.5, glow, 0);
  g.restore();
  // camera UI: a shutter ring and a small "REC"-free frame marker
  g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.arc(cx, y0 + sh - 60 * (w / 460), 34 * (w / 460), 0, TAU2); g.stroke();
  g.restore();
  if (label) plate(label, cx, cy + h / 2 + 52, 40, INK, "center", a, 800);
}
// the remote's light as the camera records it: a steady glow while the button is held, with a slight shimmer
const ir = (t, on, off) => win(t, on, off, 0.15) * (0.88 + 0.12 * Math.sin(t * 31));
const look = [0.6, -0.5];
const SCENES = {};

// 1 — hook: a phone screen with the remote's tip glowing, and the real remote beside it, tip dark
SCENES.hook = (t, T, B, E, dur) => {
  room();
  phone(650, 840, 440, 780, ir(t, -1, 99), T);
  remote(230, 800, 0.5, -0.5, 0, 0);
  plate("to your eyes", 230, 620, 40, QUIET, "center", 1, 800);
  plate("on camera", 650, 1275, 40, GOLD, "center", 1, 800);
  MASR(T, t, { ev: [[0.6, "?"]], look, mouth: "o" });
};

// 2 — try: the remote turns to face the phone; a thumb presses the power button
SCENES.try = (t, T, B, E, dur) => {
  room();
  const turn = eio(seg(t, 0.1, 1.0)), press = seg(t, 1.8, 2.2);
  phone(700, 800, 400, 760, ir(t, 2.2, 99), T, 1);
  remote(lerp(230, 300, turn), lerp(800, 840, turn), 0.55, lerp(-0.5, 0, turn), 0, press);
  plate("press any button", 540, 300, 50, INK, "center", seg(t, 0.4, 0.8), 900);
  MASR(T, t, { ev: [[2.3, "!"]], look, mouth: "o" });
};

// 3 — flash: close on the phone screen, the tip glowing; the real tip still dark
SCENES.flash = (t, T, B, E, dur) => {
  room();
  const z = eio(seg(t, 0, 0.8));
  phone(lerp(700, 600, z), lerp(800, 790, z), lerp(400, 500, z), lerp(760, 920, z), ir(t, -1, 99), T);
  plate("infrared light", 540, 250, 52, GOLD, "center", seg(t, B(0) + 1.4, B(0) + 1.8), 900);
  MASR(T, t, { ev: [[1.0, "idea"]], look, mouth: "o" });
};

// 4 — why: a spectrum strip. Eyes cover violet to red; the camera's sensor goes on into infrared, where the remote is.
SCENES.why = (t, T, B, E, dur) => {
  room();
  const x0 = 120, x1 = 960, xr = 640, y = 700, h = 120, a = seg(t, 0, 0.4);
  // visible part: a rainbow gradient; infrared part: a dark band
  const gr = g.createLinearGradient(x0, 0, xr, 0);
  [[0, "#7B4DFF"], [0.2, "#3D7BFF"], [0.4, "#3FD0C9"], [0.6, "#7EE070"], [0.78, "#FFD45E"], [1, "#FF5A4E"]].forEach(([u, c]) => gr.addColorStop(u, c));
  g.globalAlpha = a; g.fillStyle = gr; g.fillRect(x0, y, xr - x0, h);
  const g2 = g.createLinearGradient(xr, 0, x1, 0); g2.addColorStop(0, "#7A2730"); g2.addColorStop(1, "#2A1E36"); g.fillStyle = g2; g.fillRect(xr, y, x1 - xr, h); g.globalAlpha = 1;
  rrect(x0, y, x1 - x0, h, 4, null, a, INK, 5);
  text("visible", (x0 + xr) / 2, y + h + 50, 40, INK, "center", 800, a); text("infrared", (xr + x1) / 2, y + h + 50, 40, GOLD, "center", 800, a);
  // the remote's light sits in the infrared band
  const rm = seg(t, 0.5, 0.9); soft(860, y + h / 2, 70, [236, 214, 255], rm); dot(860, y + h / 2, 14, [255, 255, 255], rm);
  text("remote", 860, y - 40, 36, INK, "center", 800, rm);
  // eye range bracket stops at red; camera bracket keeps going
  const e = seg(t, 0.6, 1.4), c = seg(t, B(0) + 1.8, B(0) + 2.8);
  const br = (xa, xb, yy, col, label, u) => { if (u <= 0.01) return; const xe = lerp(xa, xb, eio(u)); line(xa, yy, xe, yy, col, 1, 10); line(xa, yy - 18, xa, yy + 18, col, 1, 8); line(xe, yy - 18, xe, yy + 18, col, 1, 8); text(label, xa, yy - 46, 42, col, "left", 900, seg(u, 0, 0.3)); };
  br(x0, xr, 560, BLUEc, "your eyes", e);
  br(x0, x1, 1000, GOLDc, "camera sensor", c);
  MASR(T, t, { ev: [[B(0) + 2.4, "!"]], look, mouth: "o" });
};

// 5 — tip: two phones. The rear camera's infrared filter dims the glow; the selfie camera shows it.
SCENES.tip = (t, T, B, E, dur) => {
  room();
  const a2 = seg(t, 0.2, 0.7);
  phone(460, 760, 300, 600, 0.05 * ir(t, -1, 99), T, a2, "rear camera");
  phone(790, 760, 300, 600, ir(t, -1, 99), T, seg(t, 1.0, 1.5), "selfie camera");
  plate("rear: often filtered", 600, 300, 46, GOLD, "center", seg(t, B(0) + 2.6, B(0) + 3.0), 900);
  MASR(T, t, { ev: [[1.4, "idea"]], look, mouth: "o" });
};

// 6 — end: a Bluetooth remote shows nothing; then back to frame one (loop)
SCENES.end = (t, T, B, E, dur) => {
  room();
  const k = seg(t, B(1) - 0.3, B(1) + 0.5);
  if (k < 1) { const a = 1 - k; phone(650, 840, 440, 780, 0, T, a); plate("Bluetooth remote: no glow", 600, 300, 46, QUIET, "center", a * seg(t, 0.2, 0.5), 900); }
  if (k > 0) { phone(650, 840, 440, 780, ir(t, B(1), 99), T, k); remote(230, 800, 0.5, -0.5, 0, 0, k); plate("to your eyes", 230, 620, 40, QUIET, "center", k, 800); plate("on camera", 650, 1275, 40, GOLD, "center", k * (1 - seg(t, dur - 1.1, dur - 0.9)) + k * seg(t, dur - 1.1, dur - 0.9), 800); }
  MASR(T, t, { ev: [[0.5, "?"], [B(1) + 0.6, "ok", "grin"]], look, mouth: "o" });
};
