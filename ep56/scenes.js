// Episode 56 (v5 Short, 1080×1920, "Why Is It Designed Like That?"): why pen caps have a hole.
// Facts (claims.md): ISO 11540 (writing and marking instruments likely to be used by children up to 14): a cap must
// either be too large to inhale (does not pass a 16 mm ring gauge) or let at least 8 L/min of air through at a
// pressure drop of 1.33 kPa. Pen caps are 3–8 % of foreign-body aspiration cases in some series; the hole keeps a
// lodged cap from sealing the airway until it is removed (bronchoscopy). Pictures are schematic, not to scale.
window.NOPUSH = ["hook", "guess", "stake", "air", "rule", "big", "end"];
window.NODIP = window.NOPUSH;
const D_BG1 = [20, 72, 84], D_BG2 = [8, 30, 36];
const CAP = [40, 104, 226], CAPD = [20, 58, 150], CAPL = [140, 190, 255], LIGHT = [255, 236, 170], HOT = [255, 84, 64], WARM = [255, 170, 70], COOL = [110, 220, 235];
const SKIN = [244, 196, 166], SKIND = [214, 156, 124], FLESH = [196, 86, 96], FLESHD = [150, 52, 66], INKW = [234, 246, 248];
function dbg() { const gr = g.createRadialGradient(W / 2, 820, 60, W / 2, 900, 1300); gr.addColorStop(0, css(D_BG1)); gr.addColorStop(1, css(D_BG2)); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function cam(s, cx, cy, sx = W / 2, sy = 840) { g.setTransform(s, 0, 0, s, sx - cx * s, sy - cy * s); }
function camReset() { g.setTransform(1, 0, 0, 1, 0, 0); }
const MAS = (T, t, ev, o = {}) => MASR(T, t, { x: 150, y: 1585, s: 0.6, ev, ...o });
// a pen cap, drawn in local units: closed tip at y = -L/2 (with the hole), open end at y = +L/2. w = width at the open end.
// o.glow 0..1 lights the hole from behind; o.alpha body alpha (see-through for the airway scenes); o.bite draws chew marks.
function penCap(x, y, L, w, rot = 0, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot);
  const wt = w * 0.78, top = -L / 2, bot = L / 2, a = o.alpha ?? 1;
  g.globalAlpha = a;
  // body: a slightly tapered tube with a rounded tip
  g.beginPath(); g.moveTo(-w / 2, bot); g.lineTo(-wt / 2, top + wt / 2); g.quadraticCurveTo(-wt / 2, top, 0, top); g.quadraticCurveTo(wt / 2, top, wt / 2, top + wt / 2); g.lineTo(w / 2, bot); g.closePath();
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0); gr.addColorStop(0, css(CAPD)); gr.addColorStop(0.35, css(CAP)); gr.addColorStop(0.55, css(CAPL)); gr.addColorStop(0.75, css(CAP)); gr.addColorStop(1, css(CAPD));
  g.fillStyle = gr; g.fill(); g.lineWidth = w * 0.03; g.strokeStyle = "rgba(10,30,80,0.8)"; g.stroke();
  // ribs near the tip and a band at the open end
  g.strokeStyle = "rgba(10,30,80,0.45)"; g.lineWidth = w * 0.025;
  for (let i = 0; i < 3; i++) { const yy = top + wt * 0.75 + i * w * 0.12; g.beginPath(); g.moveTo(-wt / 2 + 2, yy); g.lineTo(wt / 2 - 2, yy); g.stroke(); }
  g.fillStyle = css(CAPD); g.fillRect(-w / 2, bot - w * 0.16, w, w * 0.16);
  if (o.bite) { g.fillStyle = "rgba(10,30,80,0.55)"; for (let i = -2; i <= 2; i++) { g.beginPath(); g.ellipse(i * w * 0.18, bot - w * 0.24, w * 0.05, w * 0.025, 0, 0, TAU2); g.fill(); } }
  // clip on the side
  if (!o.noClip) { g.fillStyle = css(CAPD); g.beginPath(); g.roundRect(wt / 2 - w * 0.02, top + wt * 0.55, w * 0.16, L * 0.66, w * 0.08); g.fill();
    g.fillStyle = css(CAPL, 0.6); g.fillRect(wt / 2 + w * 0.03, top + wt * 0.65, w * 0.04, L * 0.5); }
  // the hole through the tip
  const hr = w * 0.11, hy = top + wt * 0.32;
  g.globalAlpha = 1; if (o.noHole) { g.restore(); return; } g.fillStyle = "rgb(6,14,28)"; g.beginPath(); g.ellipse(0, hy, hr, hr * 0.9, 0, 0, TAU2); g.fill();
  const gl = o.glow || 0;
  if (gl > 0.01) { soft(0, hy, hr * 9 * (0.7 + 0.3 * gl), LIGHT, 0.55 * gl); dot(0, hy, hr * 0.95, [255, 250, 225], gl);
    g.save(); g.globalAlpha = 0.5 * gl; g.strokeStyle = css(LIGHT); g.lineCap = "round";
    for (let i = 0; i < 12; i++) { const an = i * TAU2 / 12 + (o.spin || 0), r1 = hr * 1.6, r2 = hr * (4 + 2.5 * hash(i, 3)) * (0.6 + 0.4 * gl); g.lineWidth = hr * 0.35; g.beginPath(); g.moveTo(Math.cos(an) * r1, hy + Math.sin(an) * r1); g.lineTo(Math.cos(an) * r2, hy + Math.sin(an) * r2); g.stroke(); }
    g.restore(); }
  g.restore();
}
// thumb and index finger pinching something at (x, y), scale s
function fingers(x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  const fing = (dx, dy, w, h, r) => { g.save(); g.translate(dx, dy); g.rotate(r); g.fillStyle = css(SKIN); g.strokeStyle = css(SKIND); g.lineWidth = 6; g.beginPath(); g.roundRect(-w / 2, 0, w, h, w / 2); g.fill(); g.stroke();
    g.fillStyle = "rgba(255,240,230,0.8)"; g.beginPath(); g.ellipse(0, w * 0.45, w * 0.3, w * 0.22, 0, 0, TAU2); g.fill(); g.restore(); };
  fing(-200, 0, 130, 420, 1.27); fing(200, 0, 130, 420, -1.27);
  g.restore();
}
// warm lamp glow behind the subject
function lamp(x, y, r, a) { soft(x, y, r, LIGHT, 0.55 * a); soft(x, y, r * 0.45, [255, 250, 230], 0.6 * a); }
const HX = 560, HY = 840;   // hook / end framing: cap centre
function hookFrame(t, T, zoom, glow) {
  dbg(); lamp(HX, 430, 700, 0.6 + 0.15 * Math.sin(T * 3));
  cam(zoom, HX, lerp(HY, 540, (zoom - 1) / 1.1));
  penCap(HX, HY, 900, 380, 0.04 * Math.sin(T * 1.7), { glow, spin: T * 0.4, bite: true });
  fingers(HX, 980, 1.0);
  camReset();
}
const SCENES = {};
// 1 — hook: a huge pen cap held up to a lamp; the hole lights up and the camera pushes in on it
SCENES.hook = (t, T, B, E, dur) => {
  const z = lerp(1, 2.1, eio((t - 1.3) / 1.2)), gl = 0.8 + 0.2 * seg(t, 1.2, 1.8);
  hookFrame(t, T, z, gl);
  if (t > 2.5) plate("a hole. on purpose?", 560, 1240, 54, [255, 212, 94], "center", seg(t, 2.5, 2.8), 900);
  MAS(T, t, [[0.4, "?"], [1.8, "!"]]);
};
// pen with a see-through barrel, cap on
function pen(x, y, s, a = 1) {
  g.save(); g.translate(x, y); g.scale(s, s); g.globalAlpha = a;
  // barrel (horizontal, tip to the left)
  g.fillStyle = "rgba(220,236,244,0.35)"; g.strokeStyle = "rgba(220,236,244,0.9)"; g.lineWidth = 5;
  g.beginPath(); g.roundRect(-250, -50, 640, 100, 20); g.fill(); g.stroke();
  g.fillStyle = css(CAP); g.fillRect(-160, -10, 520, 20);   // ink tube
  g.fillStyle = "rgb(200,200,210)"; g.beginPath(); g.moveTo(-250, -30); g.lineTo(-330, 0); g.lineTo(-250, 30); g.fill();
  g.fillStyle = css(CAPD); g.beginPath(); g.roundRect(380, -36, 40, 72, 12); g.fill();
  g.restore();
  penCap(x - 260 * s, y, 330 * s, 130 * s, -Math.PI / 2, { noClip: false });
}
// 2 — guess: "for the ink?" — a red X stamps it out
SCENES.guess = (t, T, B, E, dur) => {
  dbg(); cam(lerp(1.08, 1.0, eout(t / 0.5)), 560, 820);
  pen(560, 800, 1.2);
  // little ink drops near the hole that fade
  for (let i = 0; i < 4; i++) { const u = ((t * 0.8 + i / 4) % 1); dot(200 - u * 40, 700 - u * 160 + i * 30, 14 * (1 - u), CAP, 0.8 * (1 - u) * (1 - seg(t, 1.1, 1.3))); }
  camReset();
  plate("to help the ink flow?", 560, 470, 62, INKW, "center", seg(t, 0.05, 0.3), 900);
  const k = spring(t, 1.15, 14, 0.45);
  if (k > 0.01) { g.save(); g.translate(560, 820); g.scale(k, k); g.rotate(-0.08); g.strokeStyle = css(HOT); g.lineCap = "round"; g.lineWidth = 60; g.globalAlpha = 0.92;
    g.beginPath(); g.moveTo(-300, -300); g.lineTo(300, 300); g.moveTo(300, -300); g.lineTo(-300, 300); g.stroke(); g.restore();
    plate("nope", 560, 1220, 80, HOT, "center", seg(t, 1.2, 1.35), 900); }
  MAS(T, t, [[0.3, "?"], [1.2, "!", "wince"]]);
};
// side profile of a head and neck with the airway cut open (schematic, facing right)
const PROF = [[700, 430], [745, 520], [760, 585], [820, 640], [770, 690], [765, 715], [742, 725], [768, 748], [760, 768], [748, 830], [712, 880], [650, 905], [632, 960], [632, 1340], [400, 1340], [400, 960], [330, 880], [270, 760], [262, 620], [300, 470], [400, 380], [560, 360]];
function head(T, chew) {
  g.save(); g.beginPath(); PROF.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
  g.fillStyle = css(SKIN); g.fill(); g.lineWidth = 8; g.strokeStyle = css(SKIND); g.stroke(); g.clip();
  // hair
  g.fillStyle = "rgb(112,72,46)"; g.beginPath(); g.moveTo(250, 760); g.quadraticCurveTo(220, 420, 420, 350); g.quadraticCurveTo(640, 320, 720, 470); g.quadraticCurveTo(560, 430, 470, 520); g.quadraticCurveTo(380, 600, 360, 760); g.closePath(); g.fill();
  // airway: nose / mouth cavity, throat, windpipe with rings (cut open)
  g.fillStyle = css(FLESH); g.strokeStyle = css(FLESHD); g.lineWidth = 6;
  g.beginPath(); g.moveTo(760, 730 + chew * 8); g.quadraticCurveTo(650, 690, 560, 700); g.quadraticCurveTo(520, 720, 520, 800); g.lineTo(520, 1340); g.lineTo(600, 1340); g.lineTo(600, 860); g.quadraticCurveTo(600, 770, 650, 755); g.quadraticCurveTo(700, 748, 760, 742 + chew * 8); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = "rgba(255,220,220,0.55)"; g.lineWidth = 7; for (let yy = 960; yy < 1340; yy += 46) { g.beginPath(); g.moveTo(522, yy); g.lineTo(598, yy); g.stroke(); }
  g.restore();
  // eye and ear
  dot(680, 560, 14, [40, 30, 30]); g.fillStyle = css(SKIND); g.beginPath(); g.ellipse(420, 640, 34, 52, 0, 0, TAU2); g.fill();
  plate("windpipe", 820, 1120, 46, INKW, "center", 1, 800); line(740, 1120, 610, 1120, INKW, 0.9, 5);
}
// 3 — stake: a kid chews a cap; it is breathed in and lodges in the windpipe
SCENES.stake = (t, T, B, E, dur) => {
  dbg(); const z = lerp(1.0, 1.22, eio((t - 2.6) / 1.0)); cam(z, lerp(560, 560, 0), lerp(860, 1010, eio((t - 2.6) / 1.0)));
  const chew = t < 2.6 ? Math.abs(Math.sin(t * 7)) : 0;
  head(T, chew);
  // cap path: out of the lips (horizontal) → back of the mouth → down the windpipe, rotating to vertical
  const u = eio((t - 2.75) / 0.8);
  let cx, cy, rot;
  if (u < 0.5) { const v = u / 0.5; cx = lerp(800, 560, v); cy = lerp(736, 760, v); rot = lerp(Math.PI / 2, Math.PI * 0.85, v); }
  else { const v = (u - 0.5) / 0.5; cx = lerp(560, 560, v); cy = lerp(760, 1070, v); rot = lerp(Math.PI * 0.85, Math.PI, v); }
  penCap(cx + (t < 2.6 ? chew * 18 - 9 : 0), cy + (t < 2.6 ? 6 * Math.sin(t * 5) : 0), 200, 76, rot + (t < 2.6 ? 0.12 * Math.sin(t * 7) : 0), { bite: true, noClip: true });
  if (t > 3.55) soft(560, 1070, 160, HOT, 0.5 * seg(t, 3.55, 3.7) * (0.7 + 0.3 * Math.sin(T * 9)));
  camReset();
  plate("chew, chew…", 560, 300, 58, INKW, "center", seg(t, 0.1, 0.3) * (1 - seg(t, 2.5, 2.7)), 900);
  plate("breathed in!", 560, 300, 66, HOT, "center", seg(t, 2.8, 3.0), 900);
  MAS(T, t, [[0.4, "?"], [3.0, "!", "wince"]]);
};
// 4 — air: close-up of the windpipe; the cap is stuck, but air streams through its hole; then forceps pull it out
SCENES.air = (t, T, B, E, dur) => {
  dbg(); const z = lerp(1.15, 1.0, eout(t / 0.6)); cam(z, 615, 820);
  const X0 = 400, X1 = 830, mid = (X0 + X1) / 2;
  // windpipe walls with cartilage rings
  g.fillStyle = css(FLESH); g.fillRect(X0 - 70, 200, 70, 1200); g.fillRect(X1, 200, 70, 1200);
  g.fillStyle = "rgb(70,26,34)"; g.fillRect(X0, 200, X1 - X0, 1200);
  for (let yy = 230; yy < 1380; yy += 90) { g.fillStyle = "rgba(255,226,226,0.75)"; g.beginPath(); g.roundRect(X0 - 64, yy, 58, 40, 14); g.fill(); g.beginPath(); g.roundRect(X1 + 6, yy, 58, 40, 14); g.fill(); }
  // breathing: in/out every ~2.4 s; dots flow up (out) or down (in), squeezed through the hole
  const pull = eio((t - 4.15) / 0.9), capY = lerp(800, -300, pull), L = 560, w = X1 - X0 - 10, holeY = capY - L / 2 + w * 0.78 * 0.32;
  const ph = Math.sin(T * TAU2 / 2.4), dir = ph >= 0 ? -1 : 1, sp = Math.abs(ph);
  for (let i = 0; i < 70; i++) {
    const s0 = hash(i, 1), lane = (hash(i, 2) - 0.5);
    let yy = (s0 * 1200 + dir * T * 260 * (0.6 + 0.4 * hash(i, 3))) % 1200; if (yy < 0) yy += 1200; yy += 200;
    // above the cap: dots converge on the hole; inside / below: spread over the pipe
    let xx;
    if (pull > 0.5) xx = mid + lane * (w - 40);
    else if (yy < holeY) { const k = clamp((holeY - yy) / 260); xx = mid + lane * lerp(20, w - 40, k); }
    else xx = mid + lane * (w - 60);
    dot(xx, yy, 9, [210, 245, 255], 0.35 + 0.6 * sp);
  }
  penCap(mid, capY, L, w, 0, { alpha: 0.82, bite: true, noClip: true, glow: 0.35 * sp * (1 - pull) });
  // jet arrows at the hole
  if (pull < 0.3) { const a = sp * (1 - pull * 3); arrow(mid, holeY - 30, mid, holeY - 30 - 170 * (dir < 0 ? 1 : 0.0001), COOL, dir < 0 ? a : 0, 12, 34); arrow(mid, holeY - 200, mid, holeY - 40, COOL, dir > 0 ? a : 0, 12, 34); }
  // forceps from the top
  const fin = eio((t - 3.3) / 0.8), fy = lerp(-700, capY - L / 2 - 30, fin);
  if (fin > 0.01) { g.save(); g.strokeStyle = "rgb(196,206,218)"; g.lineWidth = 26; g.lineCap = "round"; const open = 60 * (1 - seg(t, 3.95, 4.15));
    g.beginPath(); g.moveTo(mid - 30, fy - 900); g.lineTo(mid - 60 - open, fy + 40); g.moveTo(mid + 30, fy - 900); g.lineTo(mid + 60 + open, fy + 40); g.stroke(); g.restore(); }
  camReset();
  plate("air still gets through", 560, 300, 58, COOL, "center", seg(t, 0.6, 0.9) * (1 - seg(t, 3.1, 3.3)), 900);
  plate("until a doctor gets it out", 560, 300, 56, INKW, "center", seg(t, 3.3, 3.6), 900);
  MAS(T, t, [[0.8, "idea"], [4.3, "ok", "smile"]]);
};
// a balloon of 1 litre inflating (k 0..1)
function balloon(x, y, k, col) {
  if (k <= 0.01) { dot(x, y + 90, 10, col, 0.6); return; }
  const r = 36 + 70 * k; g.save(); g.fillStyle = css(col); g.beginPath(); g.ellipse(x, y + 90 - r * 1.15, r, r * 1.15, 0, 0, TAU2); g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(x - r * 0.35, y + 90 - r * 1.5, r * 0.22, r * 0.32, -0.4, 0, TAU2); g.fill();
  g.beginPath(); g.moveTo(x - 10, y + 100); g.lineTo(x + 10, y + 100); g.lineTo(x, y + 86); g.fill(); g.restore();
  if (k > 0.6) text("1 L", x, y + 90 - r * 1.15, 40, [8, 30, 36], "center", 900, seg(k, 0.6, 1));
}
// 5 — rule: the standard: at least 8 litres a minute through the cap — eight 1-litre balloons fill one after another
SCENES.rule = (t, T, B, E, dur) => {
  dbg(); cam(1.0, 560, 840);
  const cols = [[255, 212, 94], [110, 220, 235], [255, 138, 122], [160, 230, 150]];
  const pos = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) pos.push([450 + c * 168, 650 + r * 280]);
  const step = 0.5, t0 = 0.5;
  pos.forEach(([x, y], i) => balloon(x, y, eout((t - t0 - i * step) / 0.42), cols[i % 4]));
  // the cap at the top, horizontal, blowing into the current balloon
  penCap(600, 420, 340, 130, Math.PI / 2, { noClip: true, glow: 0.6 });
  const cur = clamp(Math.floor((t - t0) / step), 0, 7), [bx, by] = pos[cur];
  if (t > t0 && t < t0 + 8 * step) for (let j = 0; j < 6; j++) { const u = ((t * 3 + j / 6) % 1); dot(lerp(600 + 190, bx, u), lerp(420, by - 20, u), 8, COOL, 0.8 * (1 - u)); }
  camReset();
  plate("safety standard ISO 11540", 560, 260, 50, INKW, "center", seg(t, 0.05, 0.3), 900);
  plate("≥ 8 litres of air per minute", 640, 1250, 50, [255, 212, 94], "center", seg(t, 2.6, 2.9), 900);
  MAS(T, t, [[0.6, "?"], [2.7, "idea"], [4.6, "ok"]]);
};
// 6 — big: a fat cap that cannot pass the 16 mm test ring
SCENES.big = (t, T, B, E, dur) => {
  dbg(); cam(lerp(1.05, 1.0, eout(t / 0.5)), 560, 840);
  const RX = 600, RY = 1050;
  // ring gauge (back half)
  g.lineWidth = 46; g.strokeStyle = "rgb(150,162,178)"; g.beginPath(); g.ellipse(RX, RY, 200, 64, 0, Math.PI, TAU2); g.stroke();
  const drop = eio(t / 0.9), bounce = Math.exp(-(t - 0.9) * 6) * Math.abs(Math.sin((t - 0.9) * 18)) * (t > 0.9 ? 40 : 0);
  penCap(RX, lerp(250, 790, drop) - bounce, 600, 480, 0.04 * Math.sin(T * 2), { noClip: false, noHole: true });
  // ring gauge (front half, over the cap)
  g.strokeStyle = "rgb(196,206,218)"; g.beginPath(); g.ellipse(RX, RY, 200, 64, 0, 0, Math.PI); g.stroke();
  camReset();
  plate("16 mm test ring", 600, 1200, 50, INKW, "center", seg(t, 0.2, 0.5), 900);
  plate("too big to breathe in", 600, 300, 60, [160, 230, 150], "center", seg(t, 1.1, 1.4), 900);
  MAS(T, t, [[0.95, "!"], [2.0, "ok", "smile"]]);
};
// end: back to the hook framing; in the last 0.7 s the hole goes back to its frame-one glow (loops into frame one)
SCENES.end = (t, T, B, E, dur) => {
  const z = lerp(1.25, 1.0, eout(t / 0.7));
  hookFrame(t, T, z, lerp(1, 0.8, seg(t, dur - 0.8, dur - 0.1)));
  MAS(T, t, [[0.3, "?", "grin"]]);
};
