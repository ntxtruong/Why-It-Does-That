// Episode 37 (Short v3, 1080×1920): the water in this cloud weighs 500 tonnes.
// Facts (claims.md): USGS Water Science School: a cumulus cloud ~1 km³ with ~0.5 g of liquid water per m³ holds
// 1e9 m³ × 0.5 g = 500,000 kg (500 t) of droplets. Cloud droplets (~10 µm) fall only ~1 cm/s, so gentle updrafts keep
// them aloft. The air in that volume weighs far more (~1e9 kg); it is not counted here.

function sky() {
  clear(BG);
  const gr = g.createLinearGradient(0, 0, 0, H);
  gr.addColorStop(0, "rgb(70,120,206)"); gr.addColorStop(0.55, "rgb(128,178,236)"); gr.addColorStop(1, "rgb(60,96,170)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// a cumulus: overlapping puffs with a flat, shaded base; bob with time
function cloud(cx, cy, s, T, a = 1) {
  if (a <= 0.01) return;
  const P = [[-260, 40, 170], [-120, -60, 210], [60, -110, 240], [230, -30, 200], [330, 60, 150], [-360, 110, 120], [0, 60, 230], [180, 90, 180], [-180, 100, 170]];
  g.save(); g.globalAlpha = a; g.translate(cx, cy + 6 * Math.sin(T * 0.9)); g.scale(s, s);
  P.forEach(([x, y, r], i) => { const rr = r * (1 + 0.02 * Math.sin(T * 1.3 + i)); g.fillStyle = "rgb(214,224,240)"; g.beginPath(); g.arc(x, y + 14, rr, 0, TAU2); g.fill(); });
  P.forEach(([x, y, r], i) => { const rr = r * (1 + 0.02 * Math.sin(T * 1.3 + i)); const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.4, r * 0.1, x, y, rr); gr.addColorStop(0, "rgb(255,255,255)"); gr.addColorStop(1, "rgb(226,234,246)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, TAU2); g.fill(); });
  g.fillStyle = "rgba(150,168,200,0.55)"; g.fillRect(-440, 150, 880, 60);
  g.restore();
}
// a weight tag hanging from the cloud
function tag(x, y, s, a) {
  if (a <= 0.01) return;
  line(x, y - 150, x, y - 40, INKc, a, 5);
  g.save(); g.globalAlpha = a; g.fillStyle = "#3a4466"; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(x - 150, y + 120); g.lineTo(x - 110, y - 40); g.lineTo(x + 110, y - 40); g.lineTo(x + 150, y + 120); g.closePath(); g.fill(); g.stroke(); g.restore();
  text(s, x, y + 45, 60, GOLD, "center", 900, a);
}
const look = [0.6, -0.6];
const SCENES = {};

// 1 — hook: frame one = a big cumulus with a "500 t" weight tag hanging from it
SCENES.hook = (t, T, B, E, dur) => {
  sky(); cloud(540, 700, 1.0, T); tag(540, 1060, "500 t", 1);
  MASR(T, t, { ev: [[0.6, "!"]], look, mouth: "o" });
};

// 2 — gram: a 1 m cube inside the cloud full of tiny droplets; all its water = one small 0.5 g drop
SCENES.gram = (t, T, B, E, dur) => {
  sky();
  const k = seg(t, 0.2, 0.9);
  cloud(540, 700, 1.0 + 1.4 * k, T, 1 - 0.6 * k);
  const a = seg(t, 0.6, 1.2), x0 = 300, y0 = 520, s = 480;
  rrect(x0, y0, s, s, 12, [240, 246, 252], 0.35 * a, INK, 6);
  g.globalAlpha = a; for (let i = 0; i < 700; i++) { dot(x0 + 10 + hash(i, 1) * (s - 20) + 6 * Math.sin(T + i), y0 + 10 + ((hash(i, 2) * (s - 20) + T * 8) % (s - 20)), 3, [120, 170, 236], 0.9); } g.globalAlpha = 1;
  plate("1 m³ of cloud", 540, 300, 50, INK, "center", seg(t, 0.8, 1.2), 900);
  const d = seg(t, 3.0, 3.6);
  dot(700, 1090, 22 * d, BLUEc, d); plate("all its water: ≈ 0.5 g", 700, 1180, 46, GOLD, "center", seg(t, 3.4, 3.8), 900);
  MASR(T, t, { ev: [[3.6, "?"]], look, mouth: "o" });
};

// 3 — sum: the cloud seen as a 1 km cube of a billion m³; the total rolls once, then holds 500 t
SCENES.sum = (t, T, B, E, dur) => {
  sky();
  cloud(540, 700, 1.0, T, 0.5);
  const a = seg(t, 0.1, 0.6), x0 = 240, y0 = 400, s = 600;
  g.save(); g.globalAlpha = a; g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(x0, y0, s, s);
  g.strokeStyle = "rgba(242,245,251,0.35)"; g.lineWidth = 2; for (let i = 1; i < 10; i++) { g.beginPath(); g.moveTo(x0 + i * s / 10, y0); g.lineTo(x0 + i * s / 10, y0 + s); g.stroke(); g.beginPath(); g.moveTo(x0, y0 + i * s / 10); g.lineTo(x0 + s, y0 + i * s / 10); g.stroke(); }
  g.restore();
  plate("1 km × 1 km × 1 km = 1 billion m³", 540, 300, 42, INK, "center", seg(t, 0.4, 0.8), 900);
  plate("× 0.5 g each", 540, 1080, 46, BLUE, "center", seg(t, 1.6, 2.0), 900);
  tag(540, 1240, "500 t", seg(t, 3.0, 3.4));
  MASR(T, t, { ev: [[3.2, "!"]], look, mouth: "o" });
};

// 4 — float: one droplet up close drifts down slowly; updraft arrows push up; it hangs
SCENES.float = (t, T, B, E, dur) => {
  sky();
  cloud(540, 600, 1.0, T, 0.35);
  const a = seg(t, 0.2, 0.7), y = 760 + 40 * Math.sin(T * 0.7);
  dot(540, y, 70, [150, 200, 250], a); dot(520, y - 20, 20, [255, 255, 255], 0.8 * a);
  plate("droplet ~ 0.01 mm (shown huge)", 540, 300, 42, INK, "center", seg(t, 0.6, 1.0), 900);
  arrow(540, y + 90, 540, y + 170, CORALc, seg(t, 1.6, 2.0), 7, 20); plate("falls very slowly", 760, y + 140, 42, CORAL, "center", seg(t, 1.6, 2.0), 900);
  for (let i = 0; i < 4; i++) { const u = (T * 0.7 + i / 4) % 1; arrow(260 + i * 180 - (i > 1 ? 0 : 0), 1200 - 300 * u, 260 + i * 180, 1120 - 300 * u, GOLDc, seg(t, 3.4, 4.0) * Math.sin(Math.PI * u), 8, 22); }
  plate("rising air holds it up", 640, 1200, 46, GOLD, "center", seg(t, 4.0, 4.4), 900);
  MASR(T, t, { ev: [[2.0, "?"], [4.2, "idea"]], look, mouth: "o" });
};

// 5 — end: the cloud with its tag again (frame one)
SCENES.end = (t, T, B, E, dur) => {
  sky(); cloud(540, 700, 1.0, T); tag(540, 1060, "500 t", 1);
  plate("heavy, but spread thin", 540, 300, 50, GOLD, "center", win(t, 0.3, dur - 1.15, 0.3), 900);
  MASR(T, t, { ev: [[0.5, "ok", "grin"]], look, mouth: "o" });
};
