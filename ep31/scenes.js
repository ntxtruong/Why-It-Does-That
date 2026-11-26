// Episode 31 (Short v3, 1080×1920): metal isn't colder than wood.
// Facts (claims.md): in one room both reach room temperature (APS example 24 °C); hand skin ≈ 34 °C (APS);
// aluminium conducts heat ≈ 237 W/m·K vs wood ≈ 0.1–0.2 (Incropera), over 1,000×. Touching them, the skin surface goes to
// the contact temperature Tc = (e_s·T_s + e_o·T_o)/(e_s + e_o) with effusivity e = √(kρc): illustrative e (skin 1,100,
// aluminium 24,000, wood 400) give Tc ≈ 24.4 °C on aluminium and ≈ 31.3 °C on wood. The finger bars below show that,
// without numbers. Heat spread inside each block is drawn with radius ∝ √(D·t) (diffusion), D much larger in metal.

const ROOM = 24, SKIN = 34, ES = 1100, EM = 24000, EW = 400;
const TCM = (ES * SKIN + EM * ROOM) / (ES + EM), TCW = (ES * SKIN + EW * ROOM) / (ES + EW);
const MB = { x: 90, y: 760, w: 420, h: 300 }, WB = { x: 570, y: 760, w: 420, h: 300 };
const MX = MB.x + MB.w / 2, WX = WB.x + WB.w / 2;
function room() {
  clear(BG);
  const gr = g.createRadialGradient(540, 820, 80, 540, 820, 950);
  gr.addColorStop(0, "rgb(92,118,182)"); gr.addColorStop(0.62, "rgb(58,82,146)"); gr.addColorStop(1, "rgb(24,38,79)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // table top
  g.fillStyle = "rgb(44,62,116)"; g.fillRect(0, MB.y + MB.h, W, 40); g.fillStyle = "rgb(34,50,98)"; g.fillRect(0, MB.y + MB.h + 40, W, 18);
}
// brushed aluminium block in perspective (top face + front face)
function metalBlock(b, a = 1) {
  g.save(); g.globalAlpha = a;
  g.fillStyle = "rgb(222,228,238)"; g.beginPath(); g.moveTo(b.x + 30, b.y - 60); g.lineTo(b.x + b.w + 30, b.y - 60); g.lineTo(b.x + b.w, b.y); g.lineTo(b.x, b.y); g.closePath(); g.fill();
  const gr = g.createLinearGradient(b.x, 0, b.x + b.w, 0); gr.addColorStop(0, "rgb(150,160,178)"); gr.addColorStop(0.35, "rgb(214,222,234)"); gr.addColorStop(0.6, "rgb(170,180,198)"); gr.addColorStop(1, "rgb(132,142,162)");
  g.fillStyle = gr; g.fillRect(b.x, b.y, b.w, b.h);
  g.fillStyle = "rgb(110,120,140)"; g.beginPath(); g.moveTo(b.x + b.w, b.y); g.lineTo(b.x + b.w + 30, b.y - 60); g.lineTo(b.x + b.w + 30, b.y + b.h - 60); g.lineTo(b.x + b.w, b.y + b.h); g.closePath(); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.25)"; g.lineWidth = 2; for (let i = 0; i < 14; i++) { const y = b.y + 14 + i * 20; g.beginPath(); g.moveTo(b.x + 6, y); g.lineTo(b.x + b.w - 6, y + 2); g.stroke(); }
  g.restore();
}
// wooden block with grain
function woodBlock(b, a = 1) {
  g.save(); g.globalAlpha = a;
  g.fillStyle = "rgb(214,160,98)"; g.beginPath(); g.moveTo(b.x + 30, b.y - 60); g.lineTo(b.x + b.w + 30, b.y - 60); g.lineTo(b.x + b.w, b.y); g.lineTo(b.x, b.y); g.closePath(); g.fill();
  g.fillStyle = "rgb(184,124,66)"; g.fillRect(b.x, b.y, b.w, b.h);
  g.fillStyle = "rgb(138,90,46)"; g.beginPath(); g.moveTo(b.x + b.w, b.y); g.lineTo(b.x + b.w + 30, b.y - 60); g.lineTo(b.x + b.w + 30, b.y + b.h - 60); g.lineTo(b.x + b.w, b.y + b.h); g.closePath(); g.fill();
  g.strokeStyle = "rgba(120,72,34,0.75)"; g.lineWidth = 4;
  for (let i = 0; i < 9; i++) { const y0 = b.y + 22 + i * 32; g.beginPath(); for (let x = b.x + 4; x <= b.x + b.w - 4; x += 12) { const y = y0 + 7 * Math.sin(x * 0.018 + i * 1.3) + 4 * Math.sin(x * 0.05 + i); x === b.x + 4 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); }
  g.restore();
}
// warmth spreading from a contact point: radius from diffusion, colour warm, clipped to the block's front face
function warmth(b, cx, r, a) {
  if (a <= 0.01 || r <= 1) return;
  g.save(); g.beginPath(); g.rect(b.x, b.y - 60, b.w + 30, b.h + 60); g.clip();
  const gr = g.createRadialGradient(cx, b.y - 20, 0, cx, b.y - 20, r);
  gr.addColorStop(0, `rgba(255,150,90,${0.85 * a})`); gr.addColorStop(0.6, `rgba(255,170,100,${0.4 * a})`); gr.addColorStop(1, "rgba(255,170,100,0)");
  g.fillStyle = gr; g.fillRect(cx - r, b.y - 20 - r, 2 * r, 2 * r); g.restore();
}
// a thermometer: tube with a liquid column for temperature T (scale 10–40 °C)
function thermo(x, y, T, a = 1, label = true) {
  if (a <= 0.01) return;
  const top = y - 240, bot = y, f = clamp((T - 10) / 30);
  rrect(x - 22, top, 44, bot - top, 22, [242, 245, 251], 0.95 * a);
  dot(x, bot + 8, 34, [242, 245, 251], 0.95 * a); dot(x, bot + 8, 25, CORALc, a);
  rrect(x - 11, lerp(bot, top + 14, f), 22, bot - lerp(bot, top + 14, f) + 10, 11, CORALc, a);
  if (label) plate(`${Math.round(T)} °C`, x, top - 46, 50, INK, "center", a, 900);
}
// a finger coming down from above; tip at (x, y)
function finger(x, y, a = 1, warm = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  if (warm > 0.01) soft(x, y - 40, 150, [255, 140, 90], 0.35 * warm);
  g.fillStyle = "#F0CDB4"; g.strokeStyle = "#F2F5FB"; g.lineWidth = 8;
  g.beginPath(); g.moveTo(x - 62, y - 420); g.lineTo(x - 62, y - 60); g.quadraticCurveTo(x - 62, y, x, y); g.quadraticCurveTo(x + 62, y, x + 62, y - 60); g.lineTo(x + 62, y - 420); g.closePath(); g.fill(); g.stroke();
  g.fillStyle = "#F8E1D2"; g.beginPath(); g.roundRect(x - 34, y - 120, 68, 84, 26); g.fill();
  g.strokeStyle = "rgba(170,120,100,0.6)"; g.lineWidth = 4; [y - 210, y - 230].forEach(yy => { g.beginPath(); g.moveTo(x - 40, yy); g.quadraticCurveTo(x, yy + 10, x + 40, yy); g.stroke(); });
  g.restore();
}
// skin-temperature bar beside a finger, from SKIN down toward the contact temperature
function skinBar(x, y, T, a = 1, word) {
  if (a <= 0.01) return;
  const h = 300, f = clamp((T - 20) / (SKIN - 20));
  rrect(x - 26, y - h, 52, h, 18, [24, 34, 70], a);
  const col = mix(BLUEc, CORALc, f);
  rrect(x - 26, y - h * f, 52, h * f, 18, col, a);
  text("skin", x, y + 40, 40, QUIET, "center", 800, a);
  if (word) plate(word, x, y - h - 50, 46, col, "center", a, 900);
}
const look = [0.7, -0.5];
const SCENES = {};

// 1 — hook: frame one = an aluminium block and a wooden block, each with a thermometer at 24 °C
SCENES.hook = (t, T, B, E, dur) => {
  room(); metalBlock(MB); woodBlock(WB);
  thermo(MX + 120, MB.y - 90, ROOM); thermo(WX + 120, WB.y - 90, ROOM);
  plate("aluminium", MX - 30, MB.y + 90, 46, INK, "center", 1, 900); plate("wood", WX - 30, WB.y + 90, 46, INK, "center", 1, 900);
  MASR(T, t, { ev: [[0.5, "?"]], look, mouth: "o" });
};

// 2 — same: one cold, one warm at first; both columns settle to room temperature
SCENES.same = (t, T, B, E, dur) => {
  room(); metalBlock(MB); woodBlock(WB);
  const u = eio(seg(t, 0.4, 2.8));
  thermo(MX + 120, MB.y - 90, lerp(10, ROOM, u)); thermo(WX + 120, WB.y - 90, lerp(10, ROOM, u));
  plate("aluminium", MX - 30, MB.y + 90, 46, INK, "center", 1, 900); plate("wood", WX - 30, WB.y + 90, 46, INK, "center", 1, 900);
  plate("same room = same temperature", 540, 250, 48, GOLD, "center", seg(t, 2.6, 3.0), 900);
  MASR(T, t, { ev: [[2.8, "ok"]], look, mouth: "o" });
};

// 3 — heat: a warm finger (34 °C); then the finger touches each block and heat runs into the metal far faster
SCENES.heat = (t, T, B, E, dur) => {
  room(); metalBlock(MB); woodBlock(WB);
  const dn = eio(seg(t, B(1) - 0.2, B(1) + 0.5));
  const yM = lerp(MB.y - 260, MB.y - 70, dn), yW = lerp(WB.y - 260, WB.y - 70, dn);
  // diffusion radius ∝ √(D·t): metal's reach grows fast, wood's barely
  const tc = Math.max(0, t - B(1) - 0.5);
  warmth(MB, MX - 60, 70 * Math.sqrt(tc * 30), 1); warmth(WB, WX - 60, 70 * Math.sqrt(tc * 0.4), 1);
  // heat dots leaving each fingertip: many and fast into metal, few and slow into wood
  if (tc > 0) for (let i = 0; i < 18; i++) {
    const u = (T * 1.4 + i / 18) % 1, an = (hash(i, 4) - 0.5) * 2.4 + Math.PI / 2;
    dot(MX - 60 + Math.cos(an) * u * 300, MB.y - 70 + Math.sin(an) * u * 250, 12, GOLDc, (1 - u) * 0.95);
    if (i % 5 === 0) { const v = (T * 0.25 + i / 18) % 1; dot(WX - 60 + Math.cos(an) * v * 40, WB.y - 70 + Math.sin(an) * v * 30, 12, GOLDc, (1 - v) * 0.95); }
  }
  finger(MX - 60, yM, 1, 1); finger(WX - 60, yW, 1, 1);
  plate("hand ≈ 34 °C", 490, 420, 44, CORAL, "center", seg(t, 0.4, 0.8) * (1 - seg(t, B(1) - 0.4, B(1))), 900);
  plate("aluminium", MX - 30, MB.y + 150, 46, INK, "center", 1, 900); plate("wood", WX - 30, WB.y + 150, 46, INK, "center", 1, 900);
  plate("conducts heat 1,000× better", 540, 250, 48, GOLD, "center", seg(t, B(1) + 1.0, B(1) + 1.4), 900);
  MASR(T, t, { ev: [[0.6, "!"], [B(1) + 1.2, "idea"]], look, mouth: "o" });
};

// 4 — feel: the same two touches; the skin bar beside each finger falls toward its contact temperature
SCENES.feel = (t, T, B, E, dur) => {
  room(); metalBlock(MB); woodBlock(WB);
  warmth(MB, MX - 60, 300, 0.7); warmth(WB, WX - 60, 26, 1);
  finger(MX - 60, MB.y - 70, 1); finger(WX - 60, WB.y - 70, 1);
  const u = Math.max(0, t - 0.4);
  const Tm = TCM + (SKIN - TCM) * Math.exp(-u / 0.35), Tw = TCW + (SKIN - TCW) * Math.exp(-u / 1.4);
  skinBar(MX + 140, 640, Tm, 1, u > 0.8 ? "cold!" : null); skinBar(WX + 140, 640, Tw, 1, u > 2.2 ? "warm" : null);
  plate("fast cooling = \"cold\"", 540, 190, 50, BLUE, "center", seg(t, B(1) + 0.2, B(1) + 0.6), 900);
  MASR(T, t, { ev: [[0.9, "!", "wince"], [B(1) + 0.4, "idea", "smile"]], look, mouth: "o" });
};

// 5 — end: back to frame one; the 24 °C pair, then the loop
SCENES.end = (t, T, B, E, dur) => {
  room(); metalBlock(MB); woodBlock(WB);
  thermo(MX + 120, MB.y - 90, ROOM); thermo(WX + 120, WB.y - 90, ROOM);
  plate("aluminium", MX - 30, MB.y + 90, 46, INK, "center", 1, 900); plate("wood", WX - 30, WB.y + 90, 46, INK, "center", 1, 900);
  plate("same °C, different speed", 540, 250, 50, GOLD, "center", win(t, 0.3, dur - 1.15, 0.3), 900);
  MASR(T, t, { ev: [[0.6, "ok", "grin"]], look, mouth: "o" });
};
