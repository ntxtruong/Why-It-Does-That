// Episode 17 (new Short, 1080×1920) — Why does your voice sound weird on recordings?
// A head in profile: the air path (blue wavefronts from the mouth around to the ear) and the bone path
// (gold vibration through the skull to the inner ear). A microphone only gets the blue path. The tone bars are
// labelled "illustration": they show "a different mix", not a measured spectrum, and do NOT put the bone part in
// the bass (Reinfeldt et al. 2010 found bone conduction dominating at 1–2 kHz). Pure functions of time.
// Safe zone (Shorts UI): key content above y = 1536 and left of x = 940.

const MAS = (T, o = {}) => mascot3(o.x ?? 150, o.y ?? 1560, o.s ?? 0.4, T, o);
const HC = [560, 820], MOUTH = [318, 960], EAR = [672, 860], COCH = [620, 862], VOX = [520, 1090];
function headPath() {
  g.beginPath();
  g.moveTo(640, 1200); g.lineTo(640, 1080);                         // back of the neck
  g.bezierCurveTo(820, 1010, 840, 620, 640, 560);                   // back of the skull
  g.bezierCurveTo(470, 510, 330, 600, 320, 760);                    // crown to forehead
  g.lineTo(270, 870); g.lineTo(318, 892);                           // nose
  g.lineTo(310, 950); g.lineTo(330, 975); g.lineTo(326, 1010);     // lips and chin
  g.quadraticCurveTo(340, 1060, 440, 1070);                         // jaw
  g.lineTo(450, 1200); g.closePath();
}
function head(a = 1) {
  g.save(); g.globalAlpha = a; headPath(); g.fillStyle = css(PANELc); g.fill(); g.strokeStyle = css(QUIETc); g.lineWidth = 5; g.stroke();
  // ear
  g.strokeStyle = css(QUIETc); g.lineWidth = 6; g.beginPath(); g.ellipse(EAR[0], EAR[1], 34, 58, 0.1, -1.3, 1.6); g.stroke();
  // inner ear (cochlea): a small spiral
  g.strokeStyle = css(INKc, 0.8); g.lineWidth = 4; g.beginPath();
  for (let k = 0; k <= 60; k++) { const th = k / 60 * 5 * Math.PI, r = 4 + k * 0.45; const x = COCH[0] - 40 + r * Math.cos(th), y = COCH[1] + r * Math.sin(th); k ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke(); g.restore();
}
// air path: wavefronts expanding from the mouth (outside the head) and a dotted route round to the ear
function airPath(T, a = 1) {
  if (a <= 0.01) return;
  g.save(); g.beginPath(); g.rect(0, 0, W, H); headPath(); g.clip("evenodd");
  for (let k = 0; k < 4; k++) { const r = ((T * 160 + k * 90) % 360) + 30; g.globalAlpha = a * (1 - r / 400); g.strokeStyle = css(BLUEc); g.lineWidth = 6; g.beginPath(); g.arc(MOUTH[0], MOUTH[1], r, 0.2 * Math.PI, 1.8 * Math.PI, true); g.stroke(); }
  g.restore();
  const q = u => [ (1 - u) * (1 - u) * MOUTH[0] + 2 * u * (1 - u) * 470 + u * u * (EAR[0] + 50), (1 - u) * (1 - u) * MOUTH[1] + 2 * u * (1 - u) * 1290 + u * u * (EAR[1] + 40) ];
  const pts = []; for (let i = 0; i <= 40; i++) pts.push(q(i / 40)); poly(pts, BLUEc, a * 0.5, 4, false);
  for (let k = 0; k < 4; k++) { const u = (T * 0.45 + k / 4) % 1; const p = q(u); dot(p[0], p[1], 11, BLUEc, a); }
}
// bone path: gold ripples spreading inside the skull from the voice box to the inner ear
function bonePath(T, a = 1) {
  if (a <= 0.01) return;
  g.save(); headPath(); g.clip();
  for (let k = 0; k < 4; k++) { const r = ((T * 140 + k * 80) % 320) + 20; g.globalAlpha = a * 0.8 * (1 - r / 360); g.strokeStyle = css(GOLDc); g.lineWidth = 6; g.beginPath(); g.arc(VOX[0], VOX[1], r, 0, TAU2); g.stroke(); }
  g.restore();
  for (let k = 0; k < 3; k++) { const u = (T * 0.6 + k / 3) % 1; dot(lerp(VOX[0], COCH[0] - 40, u), lerp(VOX[1], COCH[1], u) - 30 * Math.sin(u * Math.PI), 11, GOLDc, a); }
}
function phone(x, y, T, a = 1, play = 1, sc = 1.7) {
  if (a <= 0.01) return; g.save(); g.translate(x, y); g.scale(sc, sc); g.translate(-x, -y);
  rrect(x - 75, y - 135, 150, 270, 24, [34, 39, 58], a, QUIETc, 5); rrect(x - 60, y - 112, 120, 210, 10, PANELc, a);
  for (let k = 0; k < 3; k++) { const r = 30 + ((T * 90 + k * 30) % 90); g.save(); g.globalAlpha = a * play * (1 - r / 130); g.strokeStyle = css(BLUEc); g.lineWidth = 5; g.beginPath(); g.arc(x, y - 10, r, -0.9, 0.9); g.stroke(); g.restore(); }
  text("▶", x - 8, y - 10, 46, INK, "center", 800, a); g.restore();
}
function mic(x, y, a = 1) { if (a <= 0.01) return; rrect(x - 26, y - 46, 52, 82, 26, QUIETc, a); line(x, y + 36, x, y + 80, QUIETc, a, 7); line(x - 30, y + 80, x + 30, y + 80, QUIETc, a, 7); }
// tone bars: an illustration of "a different mix" (blue = through the air, gold = through bone)
const BAR_A = [0.55, 0.8, 0.95, 0.85, 0.7, 0.5, 0.35], BAR_B = [0.08, 0.15, 0.3, 0.35, 0.25, 0.1, 0.05];
function bars(x0, y0, gold, a = 1, label = "") {
  if (a <= 0.01) return;
  BAR_A.forEach((v, i) => { const x = x0 + i * 40, hb = 190 * v, hg = 190 * BAR_B[i] * gold;
    rrect(x, y0 - hb, 34, hb, 6, BLUEc, a); if (hg > 1) rrect(x, y0 - hb - hg, 34, hg, 6, GOLDc, a); });
  text(label, x0 + 137, y0 + 48, 46, INK, "center", 800, a);
}
const SCENES = {};

// 1 — hook: first frame = the phone plays your voice back; the character recoils ("a stranger?")
SCENES.hook = (t, T, B, E, dur) => {
  clear(); vignette();
  phone(620, 900, T, 1, 1);
  plate("…is that me?", 620, 560, 54, CORAL, "center", seg(t, 0.4, 0.9), 800);
  plate("sounds like a stranger", 560, 1250, 48, INK, "center", seg(t, B(1) + 0.4, B(1) + 0.9), 800);
  MASR(T, t, { ev: [[0.5, "!", "wince"], [B(1) + 0.4, "?"]],  look: [0.9, -0.4], mouth: "wince", lean: -0.05 });
};

// 2 — paths: two ways to your ears: through the air (blue), through your head (gold)
SCENES.paths = (t, T, B, E, dur) => {
  clear(); vignette();
  head(seg(t, 0, 0.4));
  plate("two ways to your ears", 540, 420, 50, INK, "center", win(t, 0.2, B(1), 0.3), 800);
  const ai = seg(t, B(1), B(1) + 0.6), bo = seg(t, B(2) + 0.4, B(2) + 1.0);
  airPath(T, ai); bonePath(T, bo);
  plate("through the air", 560, 1300, 46, BLUE, "center", ai * (1 - 0.0), 800);
  plate("through your head", 560, 420, 46, GOLD, "center", bo, 800);
  plate("inner ear", COCH[0] - 40, COCH[1] - 110, 40, INK, "center", seg(t, B(2) + 2.5, B(2) + 3.0), 800);
  MASR(T, t, { ev: [[0.4, "?"], [B(1) + 0.6, "ok"], [B(2) + 1.0, "!", "grin"]],  look: [0.9, -0.6], mouth: "o" });
};

// 3 — mix: the bone path changes the mix; a microphone gets only the air path; the recording ≈ what others hear
SCENES.mix = (t, T, B, E, dur) => {
  clear(); vignette();
  const sh = eio((t - B(1)) / 0.8);                     // head slides up to make room for the bars
  g.save(); g.translate(0, -200 * sh - 40); g.scale(1, 1);
  head(1); airPath(T, 1); bonePath(T, 1 - 0.0); mic(200, 900, seg(t, B(1), B(1) + 0.5));
  g.restore();
  bars(330, 1330, 1, seg(t, 0.4, 1.0), "you hear");
  bars(640, 1330, 0, seg(t, B(1) + 0.4, B(1) + 1.0), "mic / others");
  text("sketch, not measured", 930, 1440, 40, QUIET, "right", 600, seg(t, 0.4, 1.0));
  plate("a different mix", 540, 420, 50, INK, "center", win(t, 0.6, B(1) - 0.1, 0.3), 800);
  plate("mic: air only", 540, 420, 50, BLUE, "center", win(t, B(1) + 0.2, B(2) - 0.1, 0.3), 800);
  plate("recording ≈ what others hear", 540, 420, 46, GOLD, "center", win(t, B(2) + 0.2, dur - 0.2, 0.3), 800);
  MASR(T, t, { ev: [[0.6, "idea"], [B(1) + 0.4, "!"], [B(2) + 0.6, "ok", "smile"]],  look: [0.9, -0.6], mouth: t > B(2) ? "smile" : "o" });
};

// 4 — end: the phone plays again; "That's you." — then back to the opening frame (loop)
SCENES.end = (t, T, B, E, dur) => {
  clear(); vignette();
  phone(620, 900, T, 1, 1);
  plate("that's you", 620, 560, 60, GOLD, "center", win(t, 0.4, dur - 0.9, 0.3), 800);
  MASR(T, t, { ev: [[0.3, "ok", "smile"]],  look: [0.9, -0.4], mouth: t < dur - 1.0 ? "smile" : "wince" });
};
