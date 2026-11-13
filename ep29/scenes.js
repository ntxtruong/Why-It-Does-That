// Episode 29 (Short v3, 1080×1920): you can't see your own eyes move in a mirror.
// Facts (sources.md): saccades are quick jumps of the eyes, several a second, each lasting a few tens of milliseconds.
// Visual sensitivity is suppressed just before and during each saccade (saccadic suppression, first described by
// Erdmann & Dodge 1898), so in a mirror you never catch your own eyes in motion. A phone's front camera shows its
// picture with a short delay, so the movement appears on screen after the jump (and the suppression) is over.
// On screen: a jump takes 0.05 s (real saccades between the two eyes in a mirror take roughly 30–60 ms); the phone
// demonstration is slowed down and says so; the camera delay is drawn as "a little late", without a number.

const SKIN = "#f3d9c4", SKIN2 = "#e2bfa6", HAIRC = "#4a3326", IRIS = [120, 82, 48];
function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 760, 80, 540, 760, 950);
  gr.addColorStop(0, "rgb(96,124,190)"); gr.addColorStop(0.62, "rgb(60,86,150)"); gr.addColorStop(1, "rgb(24,38,79)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// saccade schedule: fixations alternate between two targets (-1 / +1) every `per` s; each jump takes `jd` s
const PER = 0.36;
function sacc(T, per = PER, jd = 0.05, off = 0) {
  const u = T - off, k = Math.floor(u / per), ph = u - k * per, tgt = i => (i % 2 === 0 ? -1 : 1);
  return lerp(tgt(k - 1 + 1000), tgt(k + 1000), ss(ph / jd));
}
const moving = (T, per = PER, jd = 0.05, off = 0) => { const u = T - off, ph = u - Math.floor(u / per) * per; return ph < jd; };
// a face looking straight out, gaze gx in -1..1 (pupils move horizontally), ring = which eye is circled (-1 / 1 / 0)
function face(cx, cy, s, gx, o = {}) {
  g.save(); g.translate(cx, cy); g.scale(s, s);
  g.fillStyle = HAIRC; g.beginPath(); g.ellipse(0, -60, 300, 300, 0, Math.PI, 0); g.fill();
  g.fillStyle = SKIN; g.beginPath(); g.ellipse(0, 40, 270, 320, 0, 0, TAU2); g.fill();
  g.fillStyle = HAIRC; g.beginPath(); g.moveTo(-290, -40); g.quadraticCurveTo(-200, -260, 40, -250); g.quadraticCurveTo(220, -240, 290, -40); g.quadraticCurveTo(160, -170, 0, -150); g.quadraticCurveTo(-170, -150, -290, -40); g.fill();
  [-1, 1].forEach(side => {
    const ex = side * 120, ey = 0;
    g.fillStyle = "#FFFFFF"; g.beginPath(); g.ellipse(ex, ey, 86, 52, 0, 0, TAU2); g.fill();
    g.save(); g.beginPath(); g.ellipse(ex, ey, 86, 52, 0, 0, TAU2); g.clip();
    const ix = ex + gx * 36;
    g.fillStyle = css(IRIS); g.beginPath(); g.arc(ix, ey, 44, 0, TAU2); g.fill();
    g.fillStyle = "#151515"; g.beginPath(); g.arc(ix, ey, 19, 0, TAU2); g.fill();
    g.fillStyle = "#FFFFFF"; g.beginPath(); g.arc(ix - 12, ey - 14, 8, 0, TAU2); g.fill();
    if (o.blur) { g.globalAlpha = o.blur; g.fillStyle = css(IRIS); g.fillRect(ex - 36, ey - 40, 72, 80); g.globalAlpha = 1; }
    g.restore();
    g.strokeStyle = "#3a2a20"; g.lineWidth = 9; g.lineCap = "round"; g.beginPath(); g.ellipse(ex, ey, 86, 52, 0, Math.PI * 1.08, Math.PI * 1.92); g.stroke();
    g.lineWidth = 14; g.beginPath(); g.moveTo(ex - 70, ey - 96); g.quadraticCurveTo(ex, ey - 122, ex + 70, ey - 98); g.stroke();
  });
  g.strokeStyle = SKIN2; g.lineWidth = 9; g.beginPath(); g.moveTo(0, 30); g.quadraticCurveTo(-24, 120, 6, 132); g.stroke();
  g.strokeStyle = "#b5615a"; g.lineWidth = 11; g.beginPath(); g.arc(0, 170, 60, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
  g.restore();
  if (o.ring) { const rx = cx + o.ring * 120 * s; g.save(); g.globalAlpha = o.ringA ?? 1; g.strokeStyle = css(GOLDc); g.lineWidth = 8; g.beginPath(); g.ellipse(rx, cy, 120 * s, 86 * s, 0, 0, TAU2); g.stroke(); g.restore(); }
}
// the bathroom mirror: frame, glass, a diagonal sheen, the face inside (clipped)
function mirror(x, y, w, h, gx, a = 1, o = {}) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  rrect(x - 18, y - 18, w + 36, h + 36, 40, [200, 210, 228]);
  g.beginPath(); g.roundRect(x, y, w, h, 28); g.clip();
  const gl = g.createLinearGradient(x, y, x + w, y + h); gl.addColorStop(0, "#cfe3f2"); gl.addColorStop(1, "#9fbcd6"); g.fillStyle = gl; g.fillRect(x, y, w, h);
  face(x + w / 2, y + h * 0.56, w / 760, gx, o);
  g.globalAlpha = 0.18 * a; g.fillStyle = "#FFFFFF"; g.beginPath(); g.moveTo(x + w * 0.62, y); g.lineTo(x + w * 0.8, y); g.lineTo(x + w * 0.35, y + h); g.lineTo(x + w * 0.17, y + h); g.closePath(); g.fill();
  g.restore();
  if (o.label) plate(o.label, x + w / 2, y + h + 58, 46, o.labelCol || INK, "center", a, 900);
}
// a phone showing the front camera picture
function phone(x, y, w, h, gx, a = 1, o = {}) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  rrect(x - 16, y - 16, w + 32, h + 32, 46, [30, 32, 44], 1, [200, 210, 228], 5);
  g.beginPath(); g.roundRect(x, y, w, h, 34); g.clip();
  g.fillStyle = "#3c5068"; g.fillRect(x, y, w, h);
  face(x + w / 2, y + h * 0.55, w / 700, gx, o);
  g.restore();
  dot(x + w / 2, y + 2, 9, [15, 15, 20], a);
  if (o.label) plate(o.label, x + w / 2, y + h + 58, 46, o.labelCol || INK, "center", a, 900);
}
// strip chart of eye position against time: the last `span` seconds up to T
function chart(T, a, o = {}) {
  if (a <= 0.01) return;
  const x0 = 360, x1 = 1010, yT = 1125, yB = 1255, span = 2.4;
  g.save(); g.globalAlpha = a;
  rrect(x0 - 20, yT - 64, x1 - x0 + 40, yB - yT + 90, 22, [24, 34, 70], 0.9);
  text(o.title || "eye position", x0, yT - 34, 40, QUIET, "left", 700);
  const X = tt => lerp(x0, x1, (tt - (T - span)) / span), Y = v => lerp(yB - 10, yT + 10, (v + 1) / 2);
  if (o.bands) for (let k = Math.floor((T - span) / PER) - 1; k <= Math.floor(T / PER); k++) {
    const t0 = k * PER, xa = X(t0 - 0.02), xb = X(t0 + 0.07);
    if (xb < x0 || xa > x1) continue;
    g.fillStyle = "rgba(255,138,122,0.35)"; g.fillRect(Math.max(x0, xa), yT, Math.min(x1, xb) - Math.max(x0, xa), yB - yT);
  }
  const trace = (off, col, lw) => { g.strokeStyle = css(col); g.lineWidth = lw; g.lineJoin = "round"; g.beginPath(); for (let i = 0; i <= 260; i++) { const tt = T - span + span * i / 260; const v = sacc(tt, PER, 0.05, off); i ? g.lineTo(X(tt), Y(v)) : g.moveTo(X(tt), Y(v)); } g.stroke(); };
  trace(0, GOLDc, 6);
  if (o.late) trace(0.12, [120, 230, 150], 6);
  g.restore();
}
const MX = 160, MY = 480, MW = 760, MH = 540;
const look = [0.6, -0.6];
const SCENES = {};

// 1 — hook: frame one = your face in a mirror; the eyes keep switching targets but you never see a sweep
SCENES.hook = (t, T, B, E, dur) => {
  room();
  mirror(MX, MY, MW, MH, sacc(T), 1, { label: "in a mirror", labelCol: QUIET });
  MASR(T, t, { ev: [[0.6, "?"]], look, mouth: "o" });
};

// 2 — mirror: look at your left eye, then your right (rings follow the instruction)
SCENES.mirror = (t, T, B, E, dur) => {
  room();
  const half = (B(0) + E(0)) / 2, gx = t < half ? -1 : 1;
  mirror(MX, MY, MW, MH, sacc(T), 1, { ring: t < half ? -1 : 1, ringA: seg(t, 0.4, 0.8), label: t < half ? "your left eye" : "your right eye", labelCol: GOLD });
  MASR(T, t, { ev: [[0.5, "?"]], look, mouth: "o" });
};

// 3 — jump: the chart shows what the eyes really do: sharp jumps, several a second
SCENES.jump = (t, T, B, E, dur) => {
  room();
  mirror(MX, MY - 20, MW, MH - 40, sacc(T), 1);
  chart(T, seg(t, 1.6, 2.2));
  plate("each jump ≈ 0.05 s", 690, 1028, 46, GOLD, "center", seg(t, 2.6, 3.0), 900);
  MASR(T, t, { ev: [[0.8, "!"], [3.0, "idea"]], look, mouth: "o" });
};

// 4 — brain: the jumps are blanked out (red bands); the picture you get is stitched across the gap
SCENES.brain = (t, T, B, E, dur) => {
  room();
  mirror(MX, MY - 20, MW, MH - 40, sacc(T), 1);
  chart(T, 1, { bands: seg(t, 0.3, 0.8) > 0.5 });
  plate("hidden by your brain", 690, 1028, 48, CORAL, "center", seg(t, 0.5, 1.0), 900);
  MASR(T, t, { ev: [[0.8, "!"], [2.6, "idea", "smile"]], look, mouth: "o" });
};

// 5 — phone: the front camera shows the same face a little late, so the move lands after the blank (slowed down)
SCENES.phone = (t, T, B, E, dur) => {
  room();
  const k = eio(seg(t, 0, 0.8));
  const mw = lerp(MW, 400, k), mh = lerp(MH - 40, 330, k);
  mirror(lerp(MX, 120, k), lerp(MY - 20, 520, k), mw, mh, sacc(T), 1, { label: k > 0.9 ? "mirror: still" : null, labelCol: QUIET });
  const slow = T / 6;                                  // slowed down six times so the sweep is visible
  phone(610, 480, 350, 470, sacc(slow, PER, 0.05, 0.12), seg(t, 0.5, 1.1), { label: "phone: moving", labelCol: [120, 230, 150] });
  plate("slowed down", 785, 520, 40, QUIET, "center", seg(t, 1.0, 1.4), 800);
  chart(T, seg(t, 1.2, 1.8), { bands: true, late: true, title: "green: phone screen, a little late" });
  MASR(T, t, { ev: [[1.4, "?"], [B(1) + 0.4, "!", "grin"]], look, mouth: "o" });
};

// 6 — end: the mirror again, as in frame one; "try it now"
SCENES.end = (t, T, B, E, dur) => {
  room();
  mirror(MX, MY, MW, MH, sacc(T), 1, { label: "try it now", labelCol: GOLD });
  MASR(T, t, { ev: [[0.5, "ok", "grin"]], look, mouth: "o" });
};
