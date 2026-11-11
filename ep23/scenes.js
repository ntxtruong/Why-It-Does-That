// Episode 23 (new Short, 1080×1920) — Why does a spinning coin speed up before it stops?
// Physics (closed form, Moffatt 2000): a thin disk (radius a = 12 mm) rolling without slipping on a table, tilt α.
//   contact-point lap rate Ω:   Ω² sin α = 4 g / a     (≈22 laps/s at 10°, ≈49 at 2°)
//   tilt decay (finite time):   α³ ∝ (t0 − t)
//   the face's own turning:     Ω (1 − cos α)  → nearly still
// Phases are integrated with a fixed step from scene start (pure function of t). The picture is slowed ×SLOW so the
// laps can be seen; every number on screen is the real (unslowed) value. Shorts v2 layout: subject 380–1250 px,
// burned-in captions 1330–1500 right of the character, nothing important right of x 940.

const G9 = 9.81, AC = 0.012, SLOW = 12, D2R = Math.PI / 180;
const lapHz = aDeg => Math.sqrt(4 * G9 / (AC * Math.sin(Math.max(aDeg, 1.2) * D2R))) / TAU2;   // real laps per second
const faceHz = aDeg => lapHz(aDeg) * (1 - Math.cos(aDeg * D2R));                                  // real face turns per second
const moffatt = (u, a0, a1) => Math.cbrt(a0 * a0 * a0 * (1 - clamp(u)) + a1 * a1 * a1 * clamp(u)); // α³ linear in time

// integrate the contact azimuth φ and the face azimuth A from scene time 0 to t (screen time, slowed ×SLOW)
function track(alphaFn, t, phi0 = 0, A0 = 0) {
  const h = 1 / 240; let phi = phi0, A = A0; const laps = [];
  for (let s0 = 0; s0 < t; s0 += h) {
    const s1 = Math.min(t, s0 + h), a = alphaFn((s0 + s1) / 2); if (a <= 0.05) continue;
    const w = TAU2 * lapHz(a) / SLOW * (s1 - s0), k = Math.floor(phi / TAU2);
    phi += w; A += w * (1 - Math.cos(a * D2R));
    if (Math.floor(phi / TAU2) > k) laps.push(s1);
  }
  return { phi, A, laps };
}

// ---- camera and table ----
const S = 290, CX = 600, CY = 930;     // a = 290 px; world origin (centre of the rolling circle) on screen
let CB = Math.cos(35 * D2R), SB = Math.sin(35 * D2R);
const setCam = deg => { CB = Math.cos(deg * D2R); SB = Math.sin(deg * D2R); };
const P3 = (x, y, z) => [CX + S * x, CY - S * (z * CB + y * SB)];
const WOOD = [176, 118, 72], WOOD2 = [120, 78, 46], WOOD3 = [92, 56, 34];

function table() {
  const y0 = 640, y1 = 1500;
  g.save(); g.beginPath(); g.moveTo(60, y0); g.lineTo(1020, y0); g.lineTo(1140, y1); g.lineTo(-60, y1); g.closePath();
  const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, css(WOOD2)); gr.addColorStop(0.45, css([190, 130, 80])); gr.addColorStop(1, css([158, 102, 60]));
  g.fillStyle = gr; g.fill(); g.clip();
  // planks (perspective spacing) and grain
  for (let i = 1; i < 7; i++) { const y = y0 + (y1 - y0) * Math.pow(i / 7, 1.25); line(-60, y, 1140, y, [80, 48, 28], 0.35, 3); }
  for (let i = 0; i < 34; i++) {
    const yb = y0 + (y1 - y0) * hash(i, 1), amp = 4 + 8 * hash(i, 2), f = 0.004 + 0.006 * hash(i, 3), pts = [];
    for (let x = -60; x <= 1140; x += 40) pts.push([x, yb + amp * Math.sin(x * f + 6 * hash(i, 4))]);
    poly(pts, [110, 66, 38], 0.16 + 0.12 * hash(i, 5), 2 + 2 * hash(i, 6));
  }
  soft(CX, CY, 620, [255, 226, 180], 0.22);   // warm light pool under the coin
  g.restore();
  g.fillStyle = css(WOOD3); g.beginPath(); g.moveTo(-60, y1); g.lineTo(1140, y1); g.lineTo(1140, y1 + 56); g.lineTo(-60, y1 + 56); g.closePath(); g.fill();
}
function stage() { clear(BGc); vignette(0.3); table(); }

// ---- the coin: tilt α (deg), contact azimuth φ, face azimuth A (where the star points) ----
function frame(aDeg, phi) {
  const al = aDeg * D2R, ca = Math.cos(al), sa = Math.sin(al), cp = Math.cos(phi), sp = Math.sin(phi);
  return { al, ca, sa, d: [ca * cp, ca * sp, -sa], e: [-sp, cp, 0], n: [sa * cp, sa * sp, ca], C: [0, 0, sa] };
}
function rimPt(F, th, r = 1, off = 0) {
  const c = Math.cos(th) * r, s = Math.sin(th) * r;
  return P3(F.C[0] + c * F.d[0] + s * F.e[0] + off * F.n[0], F.C[1] + c * F.d[1] + s * F.e[1] + off * F.n[1], F.C[2] + c * F.d[2] + s * F.e[2] + off * F.n[2]);
}
function ring(F, r = 1, off = 0, N = 72) { const p = []; for (let i = 0; i < N; i++) p.push(rimPt(F, i / N * TAU2, r, off)); return p; }
function fillPts(p, col, a = 1) { g.save(); g.globalAlpha = a; g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fillStyle = col; g.fill(); g.restore(); }

function shadow(aDeg, a = 1) {
  const [x, y] = P3(0.06, 0.05, 0);
  g.save(); g.globalAlpha = 0.42 * a; g.translate(x, y); g.scale(1, SB + 0.02);
  const gr = g.createRadialGradient(0, 0, S * 0.5, 0, 0, S * 1.12); gr.addColorStop(0, "rgba(50,24,10,0.9)"); gr.addColorStop(1, "rgba(50,24,10,0)");
  g.fillStyle = gr; g.beginPath(); g.arc(0, 0, S * 1.12, 0, TAU2); g.fill(); g.restore();
}
// gold trail of the contact point on the table (last `len` radians) and the dot itself
function trail(aDeg, phi, len = 5, a = 1) {
  const r = Math.cos(aDeg * D2R), pts = [];
  for (let i = 0; i <= 64; i++) { const p = phi - len + len * i / 64; pts.push(P3(r * Math.cos(p), r * Math.sin(p), 0)); }
  for (let i = 1; i < pts.length; i++) { const k = i / pts.length; line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], BGc, a * 0.55 * k, 16); }
  for (let i = 1; i < pts.length; i++) { const k = i / pts.length; line(pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], GOLDc, a * k, 9); }
}
function contactDot(aDeg, phi, a = 1, big = 1) {
  const r = Math.cos(aDeg * D2R), [x, y] = P3(r * Math.cos(phi), r * Math.sin(phi), 0);
  dot(x, y, 24 * big, BGc, a); dot(x, y, 17 * big, GOLDc, a);
  return [x, y];
}
function star(F, th0, R) {
  const p = []; for (let k = 0; k < 10; k++) p.push(rimPt(F, th0 + k * Math.PI / 5, k % 2 ? R * 0.42 : R, 0.004));
  g.save(); g.beginPath(); p.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath();
  g.fillStyle = css(GOLDc); g.fill(); g.lineJoin = "round"; g.strokeStyle = css([168, 118, 34]); g.lineWidth = 6; g.stroke(); g.restore();
}
// ghost = motion smear of the rim (previous contact azimuths); a = alpha
function coin(aDeg, phi, A, o = {}) {
  const F = frame(aDeg, phi), TH = 0.1;
  const vis = F.n[1] * -CB + F.n[2] * SB;   // facing the camera?
  if (o.ghost) for (let k = 1; k <= 3; k++) { const G = frame(aDeg, phi - k * o.ghost); poly(ring(G), [226, 232, 242], 0.22 / k, 8, true); }
  for (let k = 6; k >= 0; k--) fillPts(ring(F, 1, -TH * k / 6), css(mix([88, 96, 114], [150, 158, 172], k === 0 ? 1 : 0.25 + 0.1 * (6 - k))));
  // top face: silver, lit from the upper left; the highlight band turns with the lap (a moving glint)
  const off = vis >= 0 ? 0 : -TH, face = ring(F, 1, off), [cx, cy] = rimPt(F, 0, 0, off), ga = -0.9 + 0.5 * Math.sin(phi);
  const gr = g.createLinearGradient(cx - S * Math.cos(ga), cy - S * Math.sin(ga), cx + S * Math.cos(ga), cy + S * Math.sin(ga));
  gr.addColorStop(0, css([214, 222, 234])); gr.addColorStop(0.42, css([236, 240, 246])); gr.addColorStop(0.55, css([186, 196, 212])); gr.addColorStop(1, css([132, 142, 162]));
  fillPts(face, gr);
  poly(ring(F, 0.86, off + 0.002), [112, 122, 142], 0.75, 5, true);
  poly(ring(F, 1, off), [96, 106, 126], 0.9, 4, true);
  if (vis >= 0) star(F, A - phi, 0.6);
  return F;
}

// ---- small UI pieces ----
function panel(a, y = 405, h = 205) { rrect(80, y, 840, h, 26, [16, 24, 52], a * 0.9); }
// tap strip: one gold tick per lap in the last `win` seconds of screen time, scrolling left
function strip(t, laps, a, flat = 0, x0 = 120, x1 = 900, y = 480, winS = 2.6) {
  if (a <= 0.01) return;
  line(x0, y, x1, y, QUIETc, a * 0.5, 3);
  laps.forEach(tl => { const u = 1 - (t - tl) / winS; if (u < 0 || u > 1) return; const x = lerp(x0, x1, u); line(x, y - 42, x, y + 42, GOLDc, a * (0.35 + 0.65 * u), 9); });
  if (flat > 0) { line(lerp(x0, x1, 1 - flat * 0.35), y, x1, y, INKc, a * flat, 6); }
}
function slowTag(a) { plate("slowed ×12", 905, 1262, 40, QUIET, "right", a, 700); }
function tapRings(t, laps, aDeg) {
  laps.forEach(tl => { const u = (t - tl) / 0.45; if (u < 0 || u > 1) return; const r = Math.cos(aDeg * D2R), [x, y] = P3(r, 0, 0);
    g.save(); g.globalAlpha = 0.8 * (1 - u); g.strokeStyle = css(GOLDc); g.lineWidth = 6; g.beginPath(); g.ellipse(x, y, 20 + 60 * u, (20 + 60 * u) * SB, 0, 0, TAU2); g.stroke(); g.restore(); });
}
function rewindIcon(x, y, a) { poly([[x, y], [x + 40, y - 26], [x + 40, y + 26]], null, a, 0, true, INKc); poly([[x + 40, y], [x + 80, y - 26], [x + 80, y + 26]], null, a, 0, true, INKc); }

const SCENES = {};

// ---- 1 hook: frame one = a big silver coin mid-wobble, gold trail; the tilt collapses (α³ ∝ t0 − t), laps speed up,
//      the tap strip crowds, it slaps flat ("silence"), then a quick rewind ----
const HOOK_A0 = 28, HOOK_TF = 6.9;
const hookAlpha = t => t >= HOOK_TF ? 0 : HOOK_A0 * Math.cbrt((HOOK_TF - t) / HOOK_TF);
let _soundEnd = null;   // face azimuth at the end of the sound scene (the coin lies flat there): the loop shares it
function soundEndA() { if (_soundEnd === null) { const sc = TL.scenes.find(s => s.id === "sound"); _soundEnd = track(soundAlpha(sc), sc.dur, 0, 0).A; } return _soundEnd; }
const HOOK_PHI0 = -0.5;
SCENES.hook = (t, T, B, E, dur) => {
  stage(); setCam(35);
  const tR = dur - 0.75, A0 = soundEndA();
  let aDeg = hookAlpha(Math.min(t, tR)), st = track(hookAlpha, Math.min(t, tR), HOOK_PHI0, A0), phi = st.phi, A = st.A;
  if (t > tR) { const u = eio((t - tR) / 0.75); aDeg = 12 * u; phi = st.phi - 7 * u; A = st.A - 0.6 * u; }   // rewind to "late in the spin"
  shadow(aDeg); trail(aDeg, phi, aDeg > 0.3 ? 5 : 5 * seg(t, HOOK_TF + 0.4, HOOK_TF), aDeg > 0 || t > tR ? 1 : 1 - seg(t, HOOK_TF, HOOK_TF + 0.3));
  coin(aDeg, phi, A, { ghost: aDeg > 0.5 ? 0.16 : 0 });
  if (aDeg > 0.3) contactDot(aDeg, phi);
  // the rattle: one tick per lap, crowding together; then a flat line
  const sA = win(t, B(1) - 0.1, tR, 0.3);
  panel(sA, 410, 150); text("rattle", 120, 432, 40, QUIET, "left", 800, sA);
  strip(t, st.laps, sA, seg(t, HOOK_TF, HOOK_TF + 0.4), 120, 900, 500, 2.2);
  slowTag(win(t, 0.6, tR, 0.3));
  if (t > tR) { const ra = win(t, tR, dur + 0.2, 0.15); rewindIcon(190, 520, ra); text("replay, slowed ×12", 300, 520, 46, INK, "left", 800, ra); }
  MASR(T, t, { ev: [[HOOK_TF + 0.1, "!", "o"]], look: [0.9, -0.8], mouth: "smile" });
};

// ---- 2 face: camera rises to look down; the gold dot laps fast while the star on the face barely turns ----
const FACE_A = t => 12 - 1.2 * clamp(t / 4.2);
SCENES.face = (t, T, B, E, dur) => {
  stage(); const cam = lerp(35, 78, eio(t / 0.9)); setCam(cam);
  const st = track(FACE_A, t, -0.5 - 7, 0), a = FACE_A(t), A0 = 0;
  shadow(a); trail(a, st.phi, 5);
  const F = coin(a, st.phi, st.A, { ghost: 0.14 });
  contactDot(a, st.phi);
  // reference line: where the star pointed at the start, and the small arc it has turned since
  const ra = seg(t, 1.2, 1.7), R = 0.72, c0 = P3(0, 0, Math.sin(a * D2R));
  const ref = P3(R * Math.cos(A0), R * Math.sin(A0), Math.sin(a * D2R));
  line(c0[0], c0[1], ref[0], ref[1], BGc, ra * 0.9, 12); line(c0[0], c0[1], ref[0], ref[1], INKc, ra, 6, [16, 14]);
  const arc = []; for (let i = 0; i <= 24; i++) { const p = A0 + (st.A - A0) * i / 24; arc.push(P3(0.8 * Math.cos(p), 0.8 * Math.sin(p), Math.sin(a * D2R))); }
  poly(arc, BGc, ra * 0.8, 18); poly(arc, BLUEc, ra, 11);
  plate("star: barely turns", 640, 690, 42, BLUE, "center", seg(t, B(0) + 2.0, B(0) + 2.5), 800);
  // numbers (real speeds)
  const p1 = seg(t, 0.5, 0.9), p2 = seg(t, B(0) + 2.0, B(0) + 2.5);
  panel(Math.max(p1, p2), 405, 205);
  text("touching point", 120, 450, 42, GOLD, "left", 800, p1); text("racing around", 880, 450, 44, GOLD, "right", 900, p1);
  text("coin's face", 120, 545, 42, BLUE, "left", 800, p2); text(`${faceHz(a).toFixed(1)} turns/s`, 880, 545, 48, BLUE, "right", 900, p2);
  slowTag(seg(t, 0.4, 0.8));
  MASR(T, t, { ev: [[B(0) + 2.4, "?", "o"]], look: [0.9, -0.8], mouth: "smile" });
};

// ---- 3 point: back to the side; the touching point lights up; tilt gauge falls, laps/s counter climbs ----
function pointAlpha(B, E) { return t => t < B(1) ? 24 - 2 * t / B(1) : moffatt((t - B(1)) / (E(2) - 0.6 - B(1)), 22, 5); }
SCENES.point = (t, T, B, E, dur) => {
  stage(); setCam(lerp(78, 35, eio(t / 0.9)));
  const AL = pointAlpha(B, E), a = AL(t), st = track(AL, t, 1.2, 0.4);
  shadow(a); trail(a, st.phi, 5.5);
  coin(a, st.phi, st.A, { ghost: 0.12 });
  const [dx, dy] = contactDot(a, st.phi, 1, 1 + 0.25 * win(t, B(0) + 0.3, B(0) + 3.4, 0.4));
  // pulse rings on the touching point while it is introduced
  for (let k = 0; k < 2; k++) { const u = ((t - B(0) - 0.4) / 1.1 + k * 0.5) % 1, on = win(t, B(0) + 0.4, B(1) - 0.2, 0.3);
    if (t > B(0) + 0.4) { g.save(); g.globalAlpha = on * (1 - u); g.strokeStyle = css(GOLDc); g.lineWidth = 6; g.beginPath(); g.ellipse(dx, dy, 30 + 70 * u, (30 + 70 * u) * SB, 0, 0, TAU2); g.stroke(); g.restore(); } }
  const p0 = seg(t, B(0) + 0.3, B(0) + 0.8), pg = seg(t, B(1) - 0.3, B(1) + 0.3), pc = seg(t, B(1) + 0.2, B(1) + 0.7);
  panel(Math.max(p0, pg), 405, 215);
  text("touching point", 500, 445, 42, GOLD, "center", 800, p0 * (1 - pg));
  text("races around the circle", 500, 540, 42, INK, "center", 700, p0 * (1 - pg));
  // tilt gauge (left): table line, coin line at α, arc, value
  const gx = 130, gy = 580, L = 300, ang = a * D2R;
  line(gx, gy, gx + L, gy, WOOD, pg, 8);
  line(gx, gy, gx + L * Math.cos(ang), gy - L * Math.sin(ang), [214, 222, 234], pg, 14);
  const arc = []; for (let i = 0; i <= 20; i++) { const q = ang * i / 20; arc.push([gx + 190 * Math.cos(q), gy - 190 * Math.sin(q)]); } poly(arc, GOLDc, pg, 5);
  text("tilt", gx, 445, 42, QUIET, "left", 800, pg); text(`${a.toFixed(0)}°`, gx + 110, 445, 52, INK, "left", 900, pg);
  // laps/s counter (right): the real value from Ω² sin α = 4g/a
  line(500, 425, 500, 600, QUIETc, pg * 0.4, 3);
  text("touching point", 540, 445, 40, GOLD, "left", 800, pc);
  text(`${lapHz(a).toFixed(0)}`, 540, 535, 96, GOLD, "left", 900, pc); text("laps/s", 700, 548, 42, INK, "left", 800, pc);
  slowTag(1);
  MASR(T, t, { ev: [[B(1) + 1.5, "idea"], [B(2) + 2.6, "!", "grin"]], look: [0.9, -0.8], mouth: "smile" });
};

// ---- 4 sound: one tap per lap on the strip; the ticks crowd; the counter reaches the forties; it slaps flat ----
function soundAlpha(sc) { const tf = sc.beats[1].end - 0.7; return t => t >= tf ? 0 : 5 * Math.cbrt((tf - t) / tf); }
SCENES.sound = (t, T, B, E, dur) => {
  stage(); setCam(35);
  const sc = TL.scenes.find(s => s.id === "sound"), AL = soundAlpha(sc), tf = E(1) - 0.7, a = AL(t), st = track(AL, t, 2.0, 0);
  shadow(a); if (a > 0.3) trail(a, st.phi, 5);
  tapRings(t, st.laps, a);
  coin(a, st.phi, st.A, { ghost: a > 0.5 ? 0.14 : 0 });
  if (a > 0.3) contactDot(a, st.phi);
  const pa = seg(t, 0.1, 0.5);
  panel(pa, 405, 230);
  text("1 lap = 1 tap", 120, 440, 42, GOLD, "left", 800, pa);
  strip(t, st.laps, pa, seg(t, tf, tf + 0.4), 120, 900, 515, 2.2);
  const shown = a > 2 ? lapHz(a).toFixed(0) : a > 0 ? "49+" : "0";
  text(`${shown} laps/s`, 880, 440, 52, a > 0 ? INK : QUIET, "right", 900, seg(t, B(1) - 0.3, B(1) + 0.2));
  text("ticks crowd → pitch rises", 500, 590, 40, INK, "center", 700, win(t, B(0) + 1.8, B(1) - 0.1, 0.3));
  text("then: flat", 500, 590, 40, CORAL, "center", 800, seg(t, tf - 0.1, tf + 0.3));
  slowTag(1 - seg(t, tf, tf + 0.4));
  MASR(T, t, { ev: [[B(0) + 2.2, "!"], [tf + 0.1, "!", "o"]], look: [0.9, -0.8], mouth: "smile" });
};

// ---- 5 end: the payoff (energy falls, the touching point's laps rise), then the coin lifts back into frame one ----
SCENES.end = (t, T, B, E, dur) => {
  stage(); setCam(35);
  const tL = dur - 1.1, A = soundEndA(), u = eout((t - tL) / 1.1);
  let aDeg = 0, phi = HOOK_PHI0;
  if (t > tL) { aDeg = HOOK_A0 * u; phi = HOOK_PHI0 - TAU2 * lapHz(HOOK_A0) / SLOW * (dur - t) * 0.6; }
  shadow(aDeg);
  if (t > tL) trail(aDeg, phi, 5 * u, u);
  coin(aDeg, phi, A, { ghost: aDeg > 0.5 ? 0.16 * u : 0 });
  if (aDeg > 0.3) contactDot(aDeg, phi, u);
  // payoff graph over one spin (α³ ∝ t0 − t): energy ∝ α falls, laps/s ∝ (sin α)^-1/2 rises
  const pa = win(t, 0.2, tL, 0.35), draw = seg(t, 0.4, 3.2);
  panel(pa, 400, 260);
  const gx = 130, gw = 360, gy = 590, gh = 140, N = 60, eP = [], lP = [];
  for (let i = 0; i <= N * draw; i++) { const v = i / N, al = moffatt(v * 0.995, 28, 1.5);
    eP.push([gx + gw * v, gy - gh * al / 28]); lP.push([gx + gw * v, gy - gh * (lapHz(al) - lapHz(28)) / (lapHz(1.5) - lapHz(28))]); }
  line(gx, gy, gx + gw, gy, QUIETc, pa * 0.5, 3);
  poly(eP, CORALc, pa, 8); poly(lP, GOLDc, pa, 8);
  line(gx, gy, gx, gy - gh - 10, QUIETc, pa * 0.5, 3);
  text("time →", gx, 630, 36, QUIET, "left", 700, pa);
  text("energy falls", 515, 580, 42, CORAL, "left", 800, pa * seg(t, 1.0, 1.4));
  text("laps/s rise", 515, 455, 42, GOLD, "left", 800, pa * seg(t, 2.4, 2.8));
  MASR(T, t, { ev: [[B(0) + 3.0, "ok", "grin"]], look: [0.9, -0.8], mouth: "smile" });
};
