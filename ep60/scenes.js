// Episode 60 (v5 Short, 1080×1920, Your Body, Explained): why ice cream gives you brain freeze.
// Facts (claims.md): cold on the palate makes its blood vessels constrict, then rebound-dilate; the trigeminal nerve
// carries the pain, and because its branches also serve the forehead the brain refers the pain there (Johns Hopkins;
// Cleveland Clinic; Serrador 2012 for the vessel widening). Kaczorowski & Kaczorowski, BMJ 2002: fast eating 27 % vs
// slow 13 % (RR 2.2, 145 pupils). Tongue/thumb on the palate to warm it: advice from Hopkins and Cleveland Clinic, no
// trial, so the narration says "doctors suggest".
// v5 look: new Body palette (berry/plum + mint + ice blue, not navy), subject fills the frame, own camera, hard cuts.
window.NOPUSH = ["hook", "guess", "vessels", "nerve", "fast", "fix", "end"];
window.NODIP = ["hook", "guess", "vessels", "nerve", "fast", "fix", "end"];
const B_BG1 = [84, 30, 66], B_BG2 = [36, 10, 32], CREAM = [255, 244, 236], PINK = [255, 128, 176], MINT = [120, 230, 200], ICE = [170, 222, 255];
const REDV = [226, 52, 76], SKIN = [250, 206, 172], SKIN2 = [224, 168, 136], HAIR = [96, 58, 38], GOLDB = [255, 206, 92], WARM = [255, 150, 70], BRAIN = [246, 160, 182];
const SAFE_MASCOT = (T, t, ev, o = {}) => MASR(T, t, { x: 150, y: 1585, s: 0.6, ev, ...o });
function cam(s, cx, cy, sx = W / 2, sy = 820) { g.setTransform(s, 0, 0, s, sx - cx * s, sy - cy * s); }
function camReset() { g.setTransform(1, 0, 0, 1, 0, 0); }
function bbg() { const gr = g.createRadialGradient(W / 2, 760, 80, W / 2, 900, 1300); gr.addColorStop(0, css(B_BG1)); gr.addColorStop(1, css(B_BG2)); g.fillStyle = gr; g.fillRect(-2000, -2000, W + 4000, H + 4000); }
// ---------- head in profile, facing right ----------
const HX = 55;
function headPath() {
  g.beginPath(); g.moveTo(450 + HX, 1700); g.lineTo(450 + HX, 1340); g.bezierCurveTo(330 + HX, 1150, 200 + HX, 1000, 220 + HX, 760); g.bezierCurveTo(240 + HX, 470, 520 + HX, 360, 700 + HX, 420);
  g.bezierCurveTo(820 + HX, 460, 870 + HX, 560, 880 + HX, 650); g.lineTo(870 + HX, 705); g.bezierCurveTo(930 + HX, 760, 990 + HX, 800, 990 + HX, 830); g.lineTo(930 + HX, 862);
  g.lineTo(948 + HX, 900); g.lineTo(890 + HX, 935); g.lineTo(944 + HX, 972); g.bezierCurveTo(950 + HX, 1030, 930 + HX, 1070, 880 + HX, 1095);
  g.bezierCurveTo(820 + HX, 1120, 760 + HX, 1130, 720 + HX, 1160); g.lineTo(700 + HX, 1700); g.closePath();
}
const FOREHEAD = [840 + HX, 560], PALATE = [780 + HX, 905], MOUTH = [925 + HX, 935];
function headOutside(t, wince = 0, mouthOpen = 1) {
  g.save(); headPath(); g.fillStyle = css(SKIN); g.fill(); g.strokeStyle = css(SKIN2); g.lineWidth = 6; g.stroke(); g.restore();
  // hair cap on top and back
  g.save(); headPath(); g.clip(); g.fillStyle = css(HAIR); g.beginPath(); g.moveTo(150, 980); g.bezierCurveTo(180 + HX, 520, 420 + HX, 330, 760 + HX, 430); g.bezierCurveTo(700 + HX, 470, 600 + HX, 470, 560 + HX, 520); g.bezierCurveTo(470 + HX, 600, 440 + HX, 720, 420 + HX, 960); g.closePath(); g.fill();
  g.beginPath(); g.ellipse(560 + HX, 430, 360, 105, -0.12, 0, TAU2); g.fill(); g.restore();
  // ear
  g.fillStyle = css(SKIN2); g.beginPath(); g.ellipse(520 + HX, 830, 48, 70, 0.1, 0, TAU2); g.fill(); g.fillStyle = css(SKIN); g.beginPath(); g.ellipse(526 + HX, 830, 30, 50, 0.1, 0, TAU2); g.fill();
  // eye: open or squeezed
  const ex = 830 + HX, ey = 700;
  if (wince < 0.5) { g.fillStyle = "white"; g.beginPath(); g.ellipse(ex, ey, 30, 22, 0, 0, TAU2); g.fill(); dot(ex + 12, ey + 2, 13, [50, 30, 30]); dot(ex + 16, ey - 3, 4, [255, 255, 255]); }
  else { line(ex - 30, ey - 8, ex + 8, ey + 4, [80, 40, 40], 1, 7); line(ex - 30, ey + 14, ex + 8, ey + 4, [80, 40, 40], 1, 7); }
  // brow: drops and tilts with the wince
  line(ex - 36, ey - 46 + 14 * wince, ex + 34, ey - 52 + 26 * wince, HAIR, 1, 12);
  // mouth gap
  if (mouthOpen > 0.05) { g.fillStyle = "rgb(110,30,46)"; g.beginPath(); g.moveTo(946 + HX, 902); g.lineTo(890 + HX, 935); g.lineTo(942 + HX, 970); g.closePath(); g.fill(); }
}
// cutaway (x-ray) view inside the head: brain, palate, tongue, nerve
function headInside(t, o = {}) {
  g.save(); headPath(); g.fillStyle = css(mix(SKIN, B_BG2, 0.55)); g.fill(); g.strokeStyle = css(SKIN); g.lineWidth = 8; g.stroke(); g.clip();
  // brain
  const bc = [520 + HX, 650];
  g.fillStyle = css(BRAIN); g.beginPath(); g.ellipse(bc[0], bc[1], 270, 190, -0.08, 0, TAU2); g.fill();
  g.strokeStyle = css([214, 112, 140]); g.lineWidth = 7; for (let k = 0; k < 7; k++) { g.beginPath(); const y = bc[1] - 130 + k * 40; g.moveTo(bc[0] - 230 + 15 * (k % 2), y); for (let x = 0; x <= 440; x += 40) g.lineTo(bc[0] - 230 + x + 15 * (k % 2), y + 12 * Math.sin(x * 0.05 + k)); g.stroke(); }
  if (o.frostBrain) { g.globalAlpha = o.frostBrain; g.fillStyle = css(ICE, 0.75); g.beginPath(); g.ellipse(bc[0], bc[1], 270, 190, -0.08, 0, TAU2); g.fill();
    g.strokeStyle = "white"; g.lineWidth = 5; for (let k = 0; k < 9; k++) { const x = bc[0] - 200 + k * 50, y = bc[1] - 60 + 80 * hash(k, 3); for (let a = 0; a < 3; a++) { const an = a * Math.PI / 3; g.beginPath(); g.moveTo(x - 22 * Math.cos(an), y - 22 * Math.sin(an)); g.lineTo(x + 22 * Math.cos(an), y + 22 * Math.sin(an)); g.stroke(); } } g.globalAlpha = 1; }
  // nasal/sinus space and mouth cavity
  g.fillStyle = "rgb(70,20,40)"; g.beginPath(); g.moveTo(640 + HX, 935); g.lineTo(948 + HX, 900); g.lineTo(890 + HX, 935); g.lineTo(944 + HX, 972); g.lineTo(640 + HX, 990); g.closePath(); g.fill();
  // palate (roof of the mouth): a band, cold-tinted by o.cold, warm-tinted by o.warm
  const pc = mix(mix([238, 120, 140], ICE, o.cold || 0), WARM, o.warm || 0);
  g.fillStyle = css(pc); g.beginPath(); g.moveTo(620 + HX, 890); g.quadraticCurveTo(780 + HX, 870, 950 + HX, 892); g.lineTo(946 + HX, 910); g.quadraticCurveTo(780 + HX, 925, 620 + HX, 932); g.closePath(); g.fill();
  // tongue (rises by o.tongue 0..1)
  const ty = lerp(0, -32, o.tongue || 0);
  g.fillStyle = "rgb(232,96,120)"; g.beginPath(); g.moveTo(640 + HX, 1000); g.bezierCurveTo(700 + HX, 955 + ty, 860 + HX, 950 + ty * 1.2, 900 + HX, 968 + ty * 0.6); g.bezierCurveTo(880 + HX, 1000, 760 + HX, 1010, 640 + HX, 1010); g.closePath(); g.fill();
  // nerve: palate -> up -> forehead (gold), and a branch to the brain stem area
  if (o.nerve) {
    const N = nervePts(); poly(N, GOLDB, o.nerve, 10); poly([[700 + HX, 790], [640 + HX, 760], [560 + HX, 790]], GOLDB, o.nerve, 8);
  }
  g.restore();
  // outline again on top
  g.save(); headPath(); g.strokeStyle = css(SKIN); g.lineWidth = 8; g.stroke(); g.restore();
}
function nervePts() { return [[800 + HX, 895], [760 + HX, 860], [720 + HX, 800], [730 + HX, 700], [780 + HX, 620], [840 + HX, 560]]; }
function along(pts, u) { // point at fraction u of the polyline
  const L = []; let tot = 0; for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); tot += d; }
  let s = clamp(u) * tot; for (let i = 0; i < L.length; i++) { if (s <= L[i]) { const k = s / L[i]; return [lerp(pts[i][0], pts[i + 1][0], k), lerp(pts[i][1], pts[i + 1][1], k)]; } s -= L[i]; } return pts[pts.length - 1];
}
function pain(x, y, k, t) { // red jagged starburst
  if (k <= 0.01) return; const p = 1 + 0.12 * Math.sin(t * 16);
  soft(x, y, 170 * k * p, [255, 60, 70], 0.55 * k);
  g.save(); g.globalAlpha = k; g.fillStyle = "rgb(255,70,80)"; g.beginPath();
  for (let i = 0; i <= 20; i++) { const a = i * Math.PI / 10, r = (i % 2 ? 40 : 96) * k * p; i ? g.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : g.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r); }
  g.closePath(); g.fill(); g.fillStyle = "rgb(255,220,120)"; g.beginPath(); g.arc(x, y, 22 * k * p, 0, TAU2); g.fill(); g.restore();
}
function cone(x, y, a = 1, bite = 0) { // scoop at the left (towards the mouth), cone to the right
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(x, y);
  g.fillStyle = "rgb(222,164,92)"; g.beginPath(); g.moveTo(40, -62); g.lineTo(330, -6); g.lineTo(330, 6); g.lineTo(40, 62); g.closePath(); g.fill();
  g.strokeStyle = "rgb(178,120,60)"; g.lineWidth = 5; for (let k = 1; k < 6; k++) { g.beginPath(); g.moveTo(40 + k * 50, -62 + k * 11); g.lineTo(40 + k * 50 + 40, 62 - k * 11 - 8); g.stroke(); }
  g.fillStyle = css(PINK); g.beginPath(); g.arc(0, 0, 80 - 14 * bite, 0, TAU2); g.fill();
  g.fillStyle = "rgba(255,255,255,0.5)"; g.beginPath(); g.arc(-20, -30, 22, 0, TAU2); g.fill();
  g.restore();
}
function frost(x, y, r, k, t) { if (k <= 0.01) return; for (let i = 0; i < 14; i++) { const a = hash(i, 5) * TAU2, d = r * Math.sqrt(hash(i, 6)) * k, u = (t * 0.8 + hash(i, 7)) % 1;
  dot(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.4 - u * 30, 7, ICE, k * (1 - u)); } }
const SCENES = {};
const CONE_Y = 935;
// 1 — hook: the cone is already going in; a bite; the forehead lights up with pain
SCENES.hook = (t, T, B, E, dur) => {
  bbg();
  const cx = t < 0.6 ? lerp(1010, 975, eio(t / 0.6)) : lerp(975, 1060, eio((t - 0.6) / 0.6));
  const pk = seg(t, 1.5, 1.8), w = seg(t, 1.4, 1.6);
  cam(lerp(1.0, 1.06, eio(t / dur)), 640, 800, W / 2, 800);
  headOutside(t, w); cone(cx + HX, CONE_Y, 1, seg(t, 0.55, 0.7));
  frost(MOUTH[0] - 40, MOUTH[1], 120, seg(t, 0.6, 1.0), t);
  pain(FOREHEAD[0], FOREHEAD[1], pk, t);
  camReset();
  SAFE_MASCOT(T, t, [[0.7, "!"], [1.8, "!", "wince"]]);
};
// 2 — guess: x-ray in; the brain frosts over ("brain freezing?") and gets crossed out; push in on the roof of the mouth
SCENES.guess = (t, T, B, E, dur) => {
  bbg();
  const zi = eio((t - 1.6) / 0.45);
  cam(lerp(1.0, 2.1, zi), lerp(600, PALATE[0], zi), lerp(780, PALATE[1], zi), W / 2, lerp(820, 760, zi));
  headInside(t, { frostBrain: seg(t, 0.1, 0.5) * (1 - seg(t, 1.3, 1.6)), cold: seg(t, 1.6, 2.3) });
  frost(PALATE[0], PALATE[1] + 30, 140, seg(t, 1.7, 2.2), t);
  camReset();
  const a1 = seg(t, 0.15, 0.4) * (1 - seg(t, 1.45, 1.65));
  plate("brain freezing?", 540, 330, 70, ICE, "center", a1, 900);
  if (t > 0.8) { const u = eout((t - 0.8) / 0.25), f = 1 - seg(t, 1.45, 1.65); line(270, 290, lerp(270, 810, u), lerp(290, 380, u), [255, 90, 100], f, 14); line(810, 290, lerp(810, 270, u), lerp(290, 380, u), [255, 90, 100], f, 14); }
  plate("roof of your mouth", 540, 330, 66, CREAM, "center", seg(t, 2.0, 2.25), 900);
  if (zi > 0.9) arrow(540, 410, 540, 560, CREAM, seg(t, 2.1, 2.3), 10, 30);
  SAFE_MASCOT(T, t, [[0.9, "?"], [2.1, "!"]]);
};
// 3 — vessels (the reveal): macro of the palate; cold ice cream underneath; the vessels clamp, then flood open
SCENES.vessels = (t, T, B, E, dur) => {
  clear(B_BG2);
  cam(lerp(1.12, 1.0, eout(t / 0.4)), W / 2, 820, W / 2, 820);
  const clampU = seg(t, 1.5, 2.2) * (1 - seg(t, 2.6, 2.9)), flood = seg(t, 2.7, 3.2);
  // tissue band
  g.fillStyle = css(mix([238, 130, 150], ICE, 0.35 * clampU)); g.fillRect(0, 380, W, 700);
  g.fillStyle = css([210, 100, 124]); g.fillRect(0, 1060, W, 20);
  // three vessels
  [520, 700, 880].forEach((y, k) => { const base = 46, wv = base * (1 - 0.72 * clampU) + 50 * flood + 8 * flood * Math.sin(t * 10 + k);
    g.fillStyle = css(mix(REDV, [150, 60, 140], clampU)); g.beginPath(); g.roundRect(-20, y - wv / 2, W + 40, wv, wv / 2); g.fill();
    for (let i = 0; i < 9; i++) { const x = ((t * (60 + 200 * flood) * (1 - 0.8 * clampU) + i * 130 + k * 40) % (W + 100)) - 50; dot(x, y, wv * 0.22, [255, 170, 180], 0.9); } });
  // the cold scoop pressed under the palate
  g.fillStyle = css(PINK); g.beginPath(); g.ellipse(W / 2, 1230, 520, 170, 0, Math.PI, 0); g.fill(); g.fillStyle = "rgba(255,255,255,0.45)"; g.beginPath(); g.ellipse(W / 2 - 160, 1150, 90, 30, -0.2, 0, TAU2); g.fill();
  frost(W / 2, 1080, 480, 1 - flood * 0.5, t);
  if (flood > 0.3) { pain(300, 700, seg(t, 3.0, 3.3) * 0.8, t); pain(800, 560, seg(t, 3.2, 3.5) * 0.7, t); }
  camReset();
  plate("blood vessels", 540, 300, 60, CREAM, "center", seg(t, 0.1, 0.35) * (1 - seg(t, 1.35, 1.5)), 900);
  plate("clamp shut", 540, 300, 72, ICE, "center", seg(t, 1.6, 1.8) * (1 - seg(t, 2.5, 2.65)), 900);
  plate("flood open", 540, 300, 72, [255, 110, 120], "center", seg(t, 2.75, 2.95), 900);
  SAFE_MASCOT(T, t, [[1.7, "!"], [3.0, "!", "wince"]]);
};
// 4 — nerve: back to the x-ray head; pain pulses run up the nerve; "starts here" vs "felt here"
SCENES.nerve = (t, T, B, E, dur) => {
  bbg();
  cam(lerp(1.08, 1.0, eout(t / 0.5)), 620, 780, W / 2, 800);
  headInside(t, { cold: 0.6, nerve: seg(t, 0.2, 0.6) });
  const N = nervePts();
  for (let i = 0; i < 4; i++) { const u = ((t - 0.6) * 0.9 - i * 0.25); if (u > 0 && u < 1) { const [x, y] = along(N, u); dot(x, y, 18, [255, 240, 180], 1); soft(x, y, 50, GOLDB, 0.6); } }
  pain(PALATE[0], PALATE[1] - 5, 0.5 * seg(t, 0.3, 0.6), t);
  pain(FOREHEAD[0], FOREHEAD[1], seg(t, 2.6, 2.9), t);
  camReset();
  plate("one nerve", 540, 300, 64, GOLDB, "center", seg(t, 0.3, 0.55) * (1 - seg(t, 2.25, 2.45)), 900);
  plate("starts here", 760, 1260, 52, ICE, "center", seg(t, 1.0, 1.25), 900);
  plate("felt here", 540, 300, 70, [255, 110, 120], "center", seg(t, 2.6, 2.85), 900);
  if (t > 2.7) arrow(640, 350, FOREHEAD[0] - 40, FOREHEAD[1] - 50, [255, 110, 120], seg(t, 2.7, 2.9), 9, 28);
  SAFE_MASCOT(T, t, [[0.6, "!"], [2.8, "idea"]]);
};
// 5 — fast: one trial, 145 pupils: under 5 s vs over 30 s; bars 13 % vs 27 %
SCENES.fast = (t, T, B, E, dur) => {
  bbg();
  cam(1.0, W / 2, 820);
  const base = 1100, top = 640, hmax = base - top, gu = seg(t, 0.5, 1.5);
  [[490, 13, "slow", "over 30 s", MINT], [830, 27, "gulped", "under 5 s", [255, 110, 120]]].forEach(([x, v, lab, sub, col], k) => {
    const h = hmax * (v / 30) * (k ? seg(t, 1.0, 2.0) : gu);
    rrect(x - 120, base - h, 240, h, 26, col, 1);
    text(Math.round(v * (k ? seg(t, 1.0, 2.0) : gu)) + "%", x, base - h - 55, 84, CREAM, "center", 900, seg(t, 0.4, 0.7) * (k ? seg(t, 1.0, 1.2) : 1));
    text(lab, x, base + 55, 60, col, "center", 900, 1); text(sub, x, base + 112, 44, CREAM, "center", 700, 0.9);
    cone(x - 70, 430 + (k ? Math.sin(t * 14) * 10 * seg(t, 0.8, 1.0) : 0), 0.95 * (k ? 1 : 1), 0);
  });
  line(340, base, 980, base, CREAM, 0.6, 5);
  plate("×2.2", 830, 290, 76, GOLDB, "center", seg(t, 2.2, 2.45), 900);
  plate("one trial, 145 kids", 420, 290, 46, CREAM, "center", seg(t, 0.2, 0.45), 800);
  SAFE_MASCOT(T, t, [[1.0, "?"], [2.3, "!"]]);
};
// 6 — fix: tongue presses up, warmth spreads, the vessels calm; zoom out: the forehead pain fades
SCENES.fix = (t, T, B, E, dur) => {
  bbg();
  const out = eio((t - 2.8) / 0.5);
  cam(lerp(2.0, 1.0, out), lerp(PALATE[0], 640, out), lerp(PALATE[1], 800, out), W / 2, lerp(780, 800, out));
  const tu = seg(t, 0.9, 1.6), warm = seg(t, 1.6, 3.0);
  headInside(t, { cold: 0.7 * (1 - warm), warm: warm * 0.8, tongue: tu });
  if (warm > 0.01) soft(PALATE[0], PALATE[1], 220, WARM, 0.5 * warm);
  pain(FOREHEAD[0], FOREHEAD[1], 1 - seg(t, 3.0, 3.8), t);
  camReset();
  plate("tongue up", 540, 300, 70, PINK, "center", seg(t, 0.9, 1.15) * (1 - seg(t, 2.6, 2.8)), 900);
  plate("warms the roof", 540, 400, 58, WARM, "center", seg(t, 1.8, 2.05) * (1 - seg(t, 2.6, 2.8)), 900);
  plate("pain fades", 540, 300, 70, MINT, "center", seg(t, 3.2, 3.45), 900);
  SAFE_MASCOT(T, t, [[1.0, "idea"], [3.3, "ok", "grin"]]);
};
// 7 — end: the question; a fresh cone comes back to the mouth (loops into frame one)
SCENES.end = (t, T, B, E, dur) => {
  bbg();
  const cx = lerp(1250, 1010, eio((t - 0.6) / (dur - 0.6)));
  cam(lerp(1.06, 1.0, eio(t / dur)), 640, 800, W / 2, 800);
  headOutside(t, 0); cone(cx + HX, CONE_Y, 1, 0);
  camReset();
  SAFE_MASCOT(T, t, [[0.3, "?", "grin"]]);
};
