// Episode 41 (long, 1920×1080): why does metal feel colder than wood?
// Facts (claims.md): objects in one room reach the same temperature; hand skin ≈ 34 °C (APS); thermal conductivity
// aluminium ≈ 237 W/m·K, pine ≈ 0.12 (across grain) – 0.25 (along), air ≈ 0.026 (Incropera tables).
// Contact temperature of two semi-infinite bodies: Tc = (e1·T1 + e2·T2)/(e1 + e2), e = √(kρc) (effusivity):
// skin ≈ 1,200, aluminium ≈ 24,000, pine ≈ 400 → skin at 34 °C touching 20 °C objects: ≈ 20.7 °C (Al), ≈ 30.5 °C (pine).
// Temperature profiles drawn with the erf solution: T = Tc + (Ti − Tc)·erf(x / 2√(αt)).
// TRPM8: cold-activated channel, also opened by menthol (McKemy et al. 2002 Nature; Peier et al. 2002 Cell).

const ES = 1200, EAL = 24000, EPN = 400, SKIN = 34;
const tc = (eo, To) => (ES * SKIN + eo * To) / (ES + eo);
const erf = x => { const s = Math.sign(x); x = Math.abs(x); const t = 1 / (1 + 0.3275911 * x); const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return s * y; };
const tempCol = T => T < 22 ? mix([110, 160, 236], [150, 190, 240], clamp((T - 10) / 12)) : T < 30 ? mix([150, 190, 240], [255, 190, 150], (T - 22) / 8) : mix([255, 190, 150], [255, 120, 100], clamp((T - 30) / 30));
const M = (T, t, ev, o = {}) => MASR(T, t, { x: 190, y: 905, s: 0.36, look: [0.7, -0.4], mouth: "o", ev, ...o });

function sky(cold = 1) {
  clear(BG);
  const gr = g.createLinearGradient(0, 0, 0, H);
  if (cold) { gr.addColorStop(0, "rgb(120,150,206)"); gr.addColorStop(0.7, "rgb(176,196,228)"); gr.addColorStop(1, "rgb(120,140,190)"); }
  else { gr.addColorStop(0, "rgb(96,160,236)"); gr.addColorStop(0.7, "rgb(170,214,246)"); gr.addColorStop(1, "rgb(220,200,150)"); }
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
function roomBG() {
  clear(BG);
  const gr = g.createRadialGradient(1100, 480, 100, 1100, 480, 1200);
  gr.addColorStop(0, "rgb(108,124,190)"); gr.addColorStop(0.65, "rgb(64,84,150)"); gr.addColorStop(1, "rgb(28,42,86)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// a metal railing segment: two posts and a round bar with highlights
function railing(x, y, w, a = 1, hot = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  const col = hot ? [210, 200, 196] : [196, 206, 222];
  [x + 40, x + w - 40].forEach(px => rrect(px - 18, y, 36, 330, 10, mix(col, [120, 130, 150], 0.3), 1, INK, 5));
  const gr = g.createLinearGradient(0, y - 34, 0, y + 34); gr.addColorStop(0, "rgb(240,244,250)"); gr.addColorStop(0.5, css(col)); gr.addColorStop(1, "rgb(110,120,140)");
  g.fillStyle = gr; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.roundRect(x, y - 34, w, 68, 34); g.fill(); g.stroke();
  g.restore();
}
function bench(x, y, w, a = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  [x + 50, x + w - 70].forEach(px => rrect(px, y + 40, 26, 250, 8, [120, 84, 50], 1, INK, 4));
  for (let i = 0; i < 3; i++) {
    rrect(x, y + i * 34 - 60, w, 30, 8, [196, 140, 86], 1, INK, 4);
    g.strokeStyle = "rgba(120,72,34,0.6)"; g.lineWidth = 3; g.beginPath(); for (let k = 0; k <= 30; k++) { const xx = x + 10 + k * (w - 20) / 30, yy = y + i * 34 - 45 + 4 * Math.sin(k * 0.8 + i); k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke();
  }
  g.restore();
}
// a hand from above, flat, palm down: fingers pointing down toward (x, y)
function hand(x, y, s = 1, a = 1, glow = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
  if (glow > 0.01) soft(0, -60, 180, [255, 140, 90], 0.4 * glow);
  g.fillStyle = "#F0CDB4"; g.strokeStyle = INK; g.lineWidth = 7;
  const fing = [[-66, -150, 150], [-22, -170, 170], [22, -165, 165], [64, -140, 140]];
  g.beginPath(); g.roundRect(-95, -400, 190, 260, 60); g.fill(); g.stroke();
  fing.forEach(([fx, fy, L]) => { g.beginPath(); g.roundRect(fx - 20, fy, 40, L, 20); g.fill(); g.stroke(); });
  g.beginPath(); g.roundRect(-150, -300, 44, 150, 22); g.fill(); g.stroke();
  g.restore();
}
function thermo(x, y, T, a = 1, lab = true, s = 1) {   // 0..100 °C scale on a 260 px tube
  if (a <= 0.01) return;
  const h = 260 * s, top = y - h, f = clamp(T / 100);
  rrect(x - 20 * s, top, 40 * s, h, 20 * s, [242, 245, 251], 0.95 * a); dot(x, y + 8 * s, 30 * s, [242, 245, 251], 0.95 * a); dot(x, y + 8 * s, 22 * s, CORALc, a);
  rrect(x - 10 * s, lerp(y, top + 12 * s, f), 20 * s, y - lerp(y, top + 12 * s, f) + 8 * s, 10 * s, CORALc, a);
  if (lab) plate(`${Math.round(T)} °C`, x, top - 44, 44, INK, "center", a, 900);
}
// cross-section strip of skin over an object: temperature profile after contact time tt (s), colours by T
function contactStrip(x, y, w, h, eo, To, ao, tt, a = 1, label) {
  if (a <= 0.01) return;
  const Tc = tc(eo, To), as = 1e-7, scale = 1.2e-3 / (h / 2);   // the strip shows ±1.2 mm around the interface
  for (let j = 0; j < h; j += 6) {
    const z = (j - h / 2) * scale;   // z < 0 skin, z > 0 object
    const T = tt <= 0 ? (z < 0 ? SKIN : To) : z < 0 ? Tc + (SKIN - Tc) * erf(-z / (2 * Math.sqrt(as * tt))) : Tc + (To - Tc) * erf(z / (2 * Math.sqrt(ao * tt)));
    g.globalAlpha = a; g.fillStyle = css(tempCol(T)); g.fillRect(x, y + j, w, 7);
  }
  g.globalAlpha = 1;
  line(x, y + h / 2, x + w, y + h / 2, INKc, a, 4);
  g.save(); g.globalAlpha = a; g.strokeStyle = INK; g.lineWidth = 5; g.strokeRect(x, y, w, h); g.restore();
  text("skin", x + 20, y + 40, 40, [60, 40, 40], "left", 900, a); text(label, x + 20, y + h - 40, 40, [30, 40, 70], "left", 900, a);
  return Tc;
}
const SCENES = {};

// 1 — hook: frame one = a frosty railing and a wooden bench, a hand on each; both thermometers read 5 °C
SCENES.hook = (t, T, B, E, dur) => {
  sky(1);
  for (let i = 0; i < 24; i++) dot((hash(i, 1) * W + T * 20 * (0.5 + hash(i, 2))) % W, (hash(i, 3) * 900 + T * 40) % 900, 5, INKc, 0.6);
  rrect(0, 900, W, 180, 0, [200, 210, 228], 1);
  railing(520, 520, 560); bench(1220, 600, 560);
  const d = eio(seg(t, 0.4, 1.3));
  hand(800, lerp(250, 486, d), 0.9); hand(1500, lerp(250, 520, d), 0.9);
  plate("FREEZING", 800, 190, 60, BLUE, "center", seg(t, B(1), B(1) + 0.4) * (1 - seg(t, B(2) - 0.3, B(2))), 900);
  plate("almost warm", 1500, 190, 60, CORAL, "center", seg(t, B(1) + 0.9, B(1) + 1.3) * (1 - seg(t, B(2) - 0.3, B(2))), 900);
  const th = seg(t, B(2), B(2) + 0.6);
  thermo(1050, 830, 5, th); thermo(1760, 830, 5, th);
  plate("same temperature", 1300, 190, 60, GOLD, "center", seg(t, B(2) + 1.4, B(2) + 1.8) * (1 - seg(t, B(4) - 0.3, B(4))), 900);
  const p = seg(t, B(4), B(4) + 0.5);
  if (p > 0.01) [["sauna", 760, CORAL], ["hot slide", 1160, GOLD], ["mint", 1560, BLUE]].forEach(([s, x, c], i) => plate(s, x, 330, 52, c, "center", seg(t, B(4) + 0.5 * i, B(4) + 0.5 * i + 0.4), 900));
  M(T, t, [[B(1), "!", "wince"], [B(2) + 1.0, "?"], [B(4), "idea"]]);
};

// 2 — same: a room of objects, each with a thermometer; all columns settle to 20 °C
SCENES.same = (t, T, B, E, dur) => {
  roomBG();
  rrect(0, 760, W, 320, 0, [44, 62, 116], 1);
  const items = [["metal pan", 620], ["wooden spoon", 960], ["plastic cup", 1300], ["the air", 1640]];
  items.forEach(([n, x], i) => {
    if (i === 0) { rrect(x - 130, 640, 260, 110, 30, [200, 208, 222], 1, INK, 6); rrect(x + 120, 670, 160, 30, 12, [80, 80, 90], 1); }
    if (i === 1) { g.save(); g.translate(x, 700); g.rotate(-0.3); rrect(-20, -60, 40, 200, 18, [200, 146, 90], 1, INK, 5); dot(0, -90, 50, [200, 146, 90], 1); g.restore(); }
    if (i === 2) { poly([[x - 70, 610], [x + 70, 610], [x + 55, 750], [x - 55, 750]], INK, 1, 6, true, [150, 214, 200]); }
    if (i === 3) for (let k = 0; k < 14; k++) dot(x - 120 + hash(k, 5) * 240 + 20 * Math.sin(T * 2 + k), 560 + hash(k, 6) * 200 + 20 * Math.cos(T * 1.7 + k), 9, BLUEc, 0.9);
    const T0 = [8, 30, 14, 26][i], u = eio(seg(t, 0.5 + 0.2 * i, 3.0 + 0.2 * i));
    thermo(x, 520, lerp(T0, 20, u), 1, true, 0.85);
    text(n, x, 820, 44, INK, "center", 800, seg(t, 0.3, 0.8));
  });
  plate("all at room temperature", 1130, 160, 60, GOLD, "center", seg(t, B(2), B(2) + 0.5), 900);
  M(T, t, [[B(2) + 0.4, "ok"]]);
};

// 3 — skin: a cross-section of skin with nerve endings; TRPM8 gates open when the skin cools; pulses run to "brain: cold"
SCENES.skin = (t, T, B, E, dur) => {
  roomBG();
  const x0 = 480, y0 = 240, w = 1300;
  rrect(x0, y0, w, 120, 20, [240, 206, 186], 1, INK, 5); rrect(x0, y0 + 120, w, 420, 20, [226, 176, 160], 1, INK, 5);
  text("outer skin", x0 + 30, y0 + 60, 42, [90, 50, 40], "left", 900, 1); text("deeper skin", x0 + 30, y0 + 500, 42, [90, 50, 40], "left", 900, 1);
  const cool = seg(t, B(3) - 0.2, B(3) + 1.2), rate = cool * (1 - 0.5 * seg(t, B(3) + 2.5, B(3) + 4));
  const xs = [760, 1080, 1400];
  xs.forEach((x, i) => {
    poly([[x, y0 + 540], [x - 20, y0 + 380], [x + 10, y0 + 250], [x, y0 + 140]], [250, 236, 150], 1, 8);
    const gx = x, gy = y0 + 130, open = cool * seg(t, B(2), B(2) + 0.5);
    rrect(gx - 34, gy - 18, 28, 36, 8, GOLDc, seg(t, B(2), B(2) + 0.4), INK, 3); rrect(gx + 6 + 16 * open, gy - 18, 28, 36, 8, GOLDc, seg(t, B(2), B(2) + 0.4), INK, 3);
    for (let k = 0; k < 4; k++) { const u = (T * 1.6 * (0.5 + rate) + k / 4 + i * 0.2) % 1; if (rate > 0.05) dot(lerp(x, x, u), lerp(y0 + 160, y0 + 540, u), 10, BLUEc, rate * Math.sin(Math.PI * u)); }
  });
  plate("TRPM8: a cold sensor", 1080, 170, 56, GOLD, "center", seg(t, B(2) + 0.4, B(2) + 0.8), 900);
  if (cool > 0.01) { for (let i = 0; i < 6; i++) arrow(560 + i * 220, 140, 560 + i * 220, 210, BLUEc, cool, 6, 18); plate("brain: COLD", 1080, 900 - 40, 56, BLUE, "center", seg(t, B(3) + 1.0, B(3) + 1.4), 900); }
  plate("reacts to its own temperature and how fast it changes", 1130, 960 - 140, 40, INK, "center", seg(t, B(1), B(1) + 0.4) * (1 - seg(t, B(2) - 0.3, B(2))), 800);
  M(T, t, [[B(0) + 0.2, "?"], [B(3) + 1.2, "!", "wince"]]);
};

// 4 — flow: a warm fingertip (34 °C); heat arrows out; then conductivity bars on a log scale
SCENES.flow = (t, T, B, E, dur) => {
  roomBG();
  const k = seg(t, B(2) + 0.6, B(3));
  hand(820, lerp(560, 520, eio(seg(t, 0.2, 1))), 1.15, 1 - k, 1);
  plate("hand ≈ 34 °C", 1180, 300, 56, CORAL, "center", seg(t, 0.6, 1.0) * (1 - k), 900);
  if (t > B(1) - 0.5) for (let i = 0; i < 7; i++) { const u = (T * 0.9 + i / 7) % 1, an = Math.PI / 2 + (i - 3) * 0.25; arrow(820 + Math.cos(an) * (60 + 200 * u), 580 + Math.sin(an) * (40 + 200 * u), 820 + Math.cos(an) * (90 + 200 * u), 580 + Math.sin(an) * (70 + 200 * u), CORALc, seg(t, B(1) - 0.5, B(1)) * (1 - k) * Math.sin(Math.PI * u), 6, 16); }
  if (k > 0.01) {
    const L = v => (Math.log10(v) + 2) / 5 * 1100, x0 = 640;   // log scale from 0.01 to 1000
    const rows = [["aluminium", 237, [200, 210, 228], B(3)], ["pine wood", 0.12, [200, 146, 90], B(3)], ["air", 0.026, BLUEc, B(4)]];
    rows.forEach(([n, v, c, tb], i) => { const y = 300 + i * 190, ra = seg(t, tb, tb + 0.4), gw = eio(seg(t, tb, tb + 1.2));
      text(n, x0 - 30, y + 35, 46, INK, "right", 900, ra * k); rrect(x0, y, Math.max(10, L(v) * gw), 70, 18, c, ra * k); text(`${v} W/m·K`, x0 + L(v) * gw + 24, y + 35, 40, QUIET, "left", 800, ra * k); });
    plate("log scale: each step is 10×", 1180, 900 - 60, 40, QUIET, "center", k, 700);
    plate("1,000–2,000× better", 1400, 220, 50, GOLD, "center", seg(t, B(3) + 1.6, B(3) + 2.0), 900);
  }
  M(T, t, [[0.8, "!"], [B(3) + 1.8, "!", "grin"]]);
};

// 5 — contact: two cross-sections side by side, fingertip on aluminium and on pine (both 20 °C); the interface settles
SCENES.contact = (t, T, B, E, dur) => {
  roomBG();
  const tt = 3 * clamp((t - B(0) - 0.6) / 4);   // seconds after contact in the model
  const ra = seg(t, 0.2, 0.7);
  const tcA = contactStrip(560, 220, 560, 560, EAL, 20, 9.7e-5, tt, ra, "aluminium, 20 °C");
  const tcP = contactStrip(1240, 220, 560, 560, EPN, 20, 1.3e-7, tt, ra, "pine, 20 °C");
  const sa = seg(t, B(2), B(2) + 0.5), sb = seg(t, B(3), B(3) + 0.5);
  plate(`skin surface ≈ ${Math.round(tcA)} °C`, 840, 160, 50, BLUE, "center", sa, 900);
  plate(`skin surface ≈ ${Math.round(tcP)} °C`, 1520, 160, 50, CORAL, "center", sb, 900);
  plate("the meeting point sits closer to the better heat mover", 1180, 860, 40, INK, "center", seg(t, B(1), B(1) + 0.4) * (1 - seg(t, B(2) - 0.3, B(2))), 800);
  plate("same object, different skin temperature", 1180, 860, 44, GOLD, "center", seg(t, B(4), B(4) + 0.4), 900);
  M(T, t, [[B(2) + 0.4, "!", "wince"], [B(3) + 0.4, "ok", "smile"], [B(5), "idea"]]);
};

// 6 — slide: a hot sunny day; a metal slide and a wooden bench; heat arrows reverse (into the hand)
SCENES.slide = (t, T, B, E, dur) => {
  sky(0);
  dot(1700, 150, 70, GOLDc, 1); soft(1700, 150, 220, GOLDc, 0.4);
  rrect(0, 880, W, 200, 0, [214, 196, 150], 1);
  // slide: ladder + sloped chute
  g.save(); g.strokeStyle = INK; g.lineWidth = 8; g.beginPath(); g.moveTo(540, 880); g.lineTo(560, 380); g.moveTo(640, 880); g.lineTo(660, 380); g.stroke(); g.restore();
  for (let i = 0; i < 6; i++) line(548 + i * 3, 820 - i * 80, 648 + i * 3, 820 - i * 80, INKc, 1, 6);
  poly([[600, 380], [700, 380], [1100, 820], [1180, 860], [1080, 880], [980, 840]], INK, 1, 6, true, [214, 214, 226]);
  soft(880, 620, 200, CORALc, 0.35 * seg(t, B(1), B(1) + 0.6));
  bench(1300, 760, 420);
  const d = eio(seg(t, B(1) + 0.4, B(1) + 1.2));
  hand(880, lerp(380, 600, d), 0.75); hand(1510, lerp(500, 690, d), 0.75);
  plate("hot enough to burn", 880, 200, 56, CORAL, "center", seg(t, B(1) + 1.2, B(1) + 1.6), 900);
  plate("warm, rarely dangerous", 1510, 300, 50, GOLD, "center", seg(t, B(2), B(2) + 0.4), 900);
  const r = seg(t, B(3), B(3) + 0.5);
  if (r > 0.01) for (let i = 0; i < 5; i++) { const u = (T * 1.2 + i / 5) % 1; arrow(840 + i * 20, 680 - 110 * u, 840 + i * 20, 650 - 110 * u, CORALc, r * Math.sin(Math.PI * u), 7, 18); if (i < 2) arrow(1490 + i * 30, 740 - 50 * u, 1490 + i * 30, 724 - 50 * u, CORALc, 0.6 * r * Math.sin(Math.PI * u), 6, 14); }
  plate("same physics, reversed", 1200, 110, 50, INK, "center", r * (1 - seg(t, dur - 0.6, dur)), 900);
  M(T, t, [[B(1) + 1.3, "!", "wince"], [B(3) + 0.3, "idea"]]);
};

// 7 — sauna: a wooden room, 90 °C air (sparse, slow molecules), wooden benches; a bare nail glows
SCENES.sauna = (t, T, B, E, dur) => {
  clear(BG);
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, "rgb(206,150,96)"); gr.addColorStop(1, "rgb(150,98,58)"); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 14; i++) line(0, 60 + i * 64, W, 60 + i * 64, [140, 92, 52], 0.5, 3);
  bench(520, 640, 1200); bench(720, 420, 1000);
  thermo(1760, 520, 90, seg(t, B(1), B(1) + 0.5), false);
  for (let i = 0; i < 26; i++) { const x = (hash(i, 7) * 1400 + 480 + T * 60 * (hash(i, 8) - 0.5)) % 1500 + 420, y = (hash(i, 9) * 700 + 80 + T * 40 * (hash(i, 10) - 0.5)) % 760 + 60; dot(x, y, 10, [255, 236, 210], 0.75 * seg(t, B(2), B(2) + 0.5)); }
  plate("air: few molecules, little heat", 1180, 140, 50, INK, "center", seg(t, B(2) + 0.4, B(2) + 0.8) * (1 - seg(t, B(3) - 0.3, B(3))), 900);
  plate("benches: wood", 1180, 140, 50, GOLD, "center", seg(t, B(3), B(3) + 0.4) * (1 - seg(t, B(4) - 0.3, B(4))), 900);
  const n = seg(t, B(4), B(4) + 0.4);
  dot(1240, 610, 18, [200, 200, 210], 1); soft(1240, 610, 90, CORALc, 0.8 * n);
  plate("bare metal nail: ouch", 1240, 140, 52, CORAL, "center", n, 900);
  plate("80–100 °C", 1760, 200, 52, CORAL, "center", seg(t, B(1) + 0.4, B(1) + 0.8), 900);
  M(T, t, [[B(1) + 0.6, "!"], [B(4) + 0.6, "!", "wince"]]);
};

// 8 — mint: a mint leaf; menthol molecules dock on a TRPM8 gate; the gate opens while the thermometer stays at 34 °C
SCENES.mint = (t, T, B, E, dur) => {
  roomBG();
  g.save(); g.translate(700, 520); g.rotate(-0.4); g.fillStyle = "rgb(90,190,120)"; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(0, -260); g.quadraticCurveTo(200, -60, 0, 260); g.quadraticCurveTo(-200, -60, 0, -260); g.fill(); g.stroke(); line(0, -240, 0, 240, [40, 120, 70], 1, 5); g.restore();
  const gx = 1300, gy = 520, open = seg(t, B(1) + 1.6, B(1) + 2.4);
  rrect(gx - 140 - 40 * open, gy - 160, 120, 320, 30, GOLDc, 1, INK, 6); rrect(gx + 20 + 40 * open, gy - 160, 120, 320, 30, GOLDc, 1, INK, 6);
  text("TRPM8", gx, gy + 210, 48, GOLD, "center", 900, 1);
  for (let i = 0; i < 6; i++) { const u = eio(seg(t, B(1) + 0.2 * i, B(1) + 0.2 * i + 1.4)); dot(lerp(820, gx - 10 + (i % 2 ? 30 : -30), u), lerp(420 + i * 30, gy - 120 + i * 40, u), 16, [150, 236, 180], seg(t, B(1) + 0.2 * i, B(1) + 0.2 * i + 0.2)); }
  plate("menthol", 1000, 260, 48, [150, 236, 180], "center", seg(t, B(1), B(1) + 0.4), 900);
  if (open > 0.3) for (let k = 0; k < 4; k++) { const u = (T * 1.8 + k / 4) % 1; dot(gx, lerp(gy + 160, 900, u), 12, BLUEc, Math.sin(Math.PI * u)); }
  plate("brain: COLD", 1300, 140, 56, BLUE, "center", seg(t, B(2), B(2) + 0.4), 900);
  thermo(1700, 760, 34, 1);
  plate("nothing got colder", 1600, 860, 46, GOLD, "center", seg(t, B(3), B(3) + 0.4), 900);
  M(T, t, [[B(2) + 0.2, "!"], [B(3) + 0.4, "idea", "grin"]]);
};

// 9 — payoff: back to the railing and bench; heat leaves the hand into the metal; then the end card (right side free)
SCENES.payoff = (t, T, B, E, dur) => {
  sky(1);
  rrect(0, 900, W, 180, 0, [200, 210, 228], 1);
  const endK = seg(t, B(4) + 0.2, B(4) + 1.2);
  const ax = lerp(0, -380, endK);
  railing(520 + ax, 520, 560, 1 - 0.8 * endK); bench(1220 + ax * 3, 600, 560, 1 - endK);
  hand(800 + ax, 486, 0.9, 1 - 0.8 * endK, 1); hand(1500 + ax * 3, 520, 0.9, 1 - endK, 0.6);
  for (let i = 0; i < 6; i++) { const u = (T * 1.1 + i / 6) % 1; arrow(760 + ax + i * 16, 520 + 70 * u, 760 + ax + i * 16, 550 + 70 * u, CORALc, seg(t, B(2), B(2) + 0.5) * (1 - endK) * Math.sin(Math.PI * u), 6, 16); }
  plate("you feel your heat leaving", 1180, 300, 56, GOLD, "center", seg(t, B(3), B(3) + 0.4) * (1 - endK), 900);
  plate("your hand ≠ a thermometer", 1180, 300, 56, INK, "center", seg(t, 0.2, 0.6) * (1 - seg(t, B(3) - 0.3, B(3))), 900);
  if (endK > 0.01) { g.globalAlpha = 0.92 * endK; g.fillStyle = "#18264F"; g.fillRect(0, 0, W, H); g.globalAlpha = 1; railing(520 + ax, 520, 560, 0.35 * endK); }   // the end card sits on navy (contrast)
  M(T, t, [[B(0) + 0.4, "idea"], [B(3) + 0.6, "ok", "grin"]]);
};
