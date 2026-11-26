// Episode 27 (new Short, 1080×1920) — Why does mint feel cold?
// Physics/biology (claims.md; McKemy et al. 2002, Peier et al. 2002, Bautista et al. 2007, Caterina et al. 1997):
// cold nerve endings carry the channel TRPM8, which opens as temperature falls (roughly below 25 °C). Menthol binds it and
// shifts its opening to warmer temperatures, so it opens in a 37 °C mouth; the nerve fires; the brain reads "cold".
// Here the gate's open fraction is a smooth step in temperature, p = 1 / (1 + exp((T − T½)/2 °C)), with T½ = 25 °C alone
// and 39 °C with menthol (a picture of the shift, not a measured curve). The thermometer moves only when the real
// temperature changes. Chili: capsaicin does the same to the heat channel TRPV1 (opens near 43 °C alone).

const T_HALF = 25, T_HALF_MENTHOL = 39, T_HALF_HEAT = 43, T_HALF_CAPS = 33;
const pCold = (temp, menthol) => 1 / (1 + Math.exp((temp - (menthol ? lerp(T_HALF, T_HALF_MENTHOL, menthol) : T_HALF)) / 2));
const pHeat = (temp, caps) => 1 / (1 + Math.exp(-(temp - lerp(T_HALF_HEAT, T_HALF_CAPS, caps)) / 2));

const MINT = [150, 226, 170], MINT2 = [70, 170, 110], TONGUE = [242, 128, 140], TONGUE2 = [214, 96, 112], LIP = [226, 104, 112], MOUTH = [70, 22, 40];
const GATE = [176, 220, 255], GATE2 = [110, 160, 220], HEATC = [255, 120, 100];
function room() {
  clear(BG);
  const gr = g.createRadialGradient(560, 780, 80, 560, 780, 900);
  gr.addColorStop(0, "rgb(100,130,198)"); gr.addColorStop(0.65, "rgb(64,90,152)"); gr.addColorStop(1, "rgb(24,38,79)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// ---- the thermometer (left), reading temp in °C ----
function thermo(x, y, temp, a = 1, ring = 0) {
  if (a <= 0.01) return;
  const top = y - 300, bot = y + 120, f = clamp((temp - 0) / 45);
  g.save(); g.globalAlpha = a;
  g.fillStyle = "rgba(24,34,70,0.92)"; g.beginPath(); g.roundRect(x - 70, top - 40, 140, bot - top + 150, 60); g.fill();
  g.fillStyle = "rgba(242,245,251,0.9)"; g.beginPath(); g.roundRect(x - 18, top, 36, bot - top, 18); g.fill(); g.beginPath(); g.arc(x, bot + 20, 40, 0, TAU2); g.fill();
  const col = temp < 30 ? BLUEc : CORALc;
  g.fillStyle = css(col); g.beginPath(); g.arc(x, bot + 20, 30, 0, TAU2); g.fill();
  const yy = lerp(bot, top + 16, f); g.fillRect(x - 10, yy, 20, bot - yy + 10);
  g.strokeStyle = "rgba(24,38,79,0.8)"; g.lineWidth = 3; for (let c = 0; c <= 40; c += 10) { const ty = lerp(bot, top + 16, c / 45); g.beginPath(); g.moveTo(x + 18, ty); g.lineTo(x + 34, ty); g.stroke(); }
  g.restore();
  plate(Math.round(temp) + " °C", x, top - 90, 54, temp < 30 ? BLUE : INK, "center", a, 900);
  if (ring > 0.01) { g.save(); g.globalAlpha = ring; g.strokeStyle = css(GOLDc); g.lineWidth = 7; g.beginPath(); g.ellipse(x, top - 90, 120, 56, 0, 0, TAU2); g.stroke(); g.restore(); }
}
// ---- the mouth with a mint, and frosty breath ----
function mouth(cx, cy, s, T, frost = 1) {
  g.save(); g.translate(cx, cy); g.scale(s, s);
  // face skin around the mouth
  g.fillStyle = "#f6e3d3"; g.beginPath(); g.ellipse(0, 0, 400, 300, 0, 0, TAU2); g.fill();
  g.fillStyle = "rgba(255,120,130,0.28)"; g.beginPath(); g.ellipse(-300, -110, 70, 40, 0, 0, TAU2); g.fill(); g.beginPath(); g.ellipse(300, -110, 70, 40, 0, 0, TAU2); g.fill();
  // open mouth
  g.fillStyle = css(MOUTH); g.beginPath(); g.ellipse(0, 30, 250, 190, 0, 0, TAU2); g.fill();
  g.fillStyle = "#F7F7FA"; g.beginPath(); g.roundRect(-190, -150, 380, 60, 26); g.fill();
  g.strokeStyle = "rgba(180,180,200,0.7)"; g.lineWidth = 3; for (let i = -3; i <= 3; i++) { g.beginPath(); g.moveTo(i * 52, -150); g.lineTo(i * 52, -96); g.stroke(); }
  // tongue
  const tg = g.createLinearGradient(0, 40, 0, 220); tg.addColorStop(0, css(TONGUE)); tg.addColorStop(1, css(TONGUE2));
  g.fillStyle = tg; g.beginPath(); g.ellipse(0, 120, 210, 110, 0, Math.PI, 0); g.lineTo(210, 160); g.quadraticCurveTo(0, 240, -210, 160); g.closePath(); g.fill();
  g.strokeStyle = css(TONGUE2); g.lineWidth = 5; g.beginPath(); g.moveTo(0, 30); g.lineTo(0, 150); g.stroke();
  // lips
  g.strokeStyle = css(LIP); g.lineWidth = 34; g.beginPath(); g.ellipse(0, 30, 262, 202, 0, 0, TAU2); g.stroke();
  // the mint: a white sweet with green stripes, sitting on the tongue
  g.save(); g.translate(20, 80); g.rotate(-0.15); g.scale(1.45, 1.45);
  g.fillStyle = "#FBFDFC"; g.beginPath(); g.ellipse(0, 0, 92, 54, 0, 0, TAU2); g.fill();
  g.strokeStyle = css(MINT2); g.lineWidth = 13; for (let i = -2; i <= 2; i++) { g.beginPath(); g.ellipse(0, 0, 92, 54, 0, -1.25 + i * 0.6, -0.95 + i * 0.6); g.stroke(); }
  g.fillStyle = "rgba(255,255,255,0.9)"; g.beginPath(); g.ellipse(-30, -22, 30, 12, -0.2, 0, TAU2); g.fill();
  g.restore();
  // a mint leaf on the lip
  g.save(); g.translate(-220, -150); g.rotate(-0.6); g.fillStyle = css(MINT2); g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(60, -50, 130, 0); g.quadraticCurveTo(60, 50, 0, 0); g.fill();
  g.strokeStyle = css(MINT); g.lineWidth = 4; g.beginPath(); g.moveTo(6, 0); g.lineTo(122, 0); g.stroke(); g.restore();
  g.restore();
  // frosty breath: three curls rising from the mouth (pure functions of T)
  if (frost > 0.01) for (let i = 0; i < 3; i++) {
    const ph = ((T * 0.45 + i / 3) % 1), x0 = cx + (i - 1) * 90 * s, y0 = cy - 120 * s - ph * 330 * s, a = frost * Math.sin(Math.PI * ph) * 0.85;
    g.save(); g.globalAlpha = a; g.strokeStyle = "rgba(220,240,255,1)"; g.lineWidth = 16 * s + 6; g.lineCap = "round";
    g.beginPath(); g.moveTo(x0, y0); g.bezierCurveTo(x0 + 70 * s, y0 - 50 * s, x0 - 70 * s, y0 - 110 * s, x0 + 10 * s, y0 - 170 * s); g.stroke();
    g.lineWidth = 5; g.strokeStyle = "rgba(255,255,255,1)"; g.beginPath(); g.moveTo(x0 + 22 * s, y0 - 60 * s); g.lineTo(x0 + 36 * s, y0 - 74 * s); g.stroke();
    g.restore();
  }
}
// ---- the close-up: tongue surface, the nerve-ending wall with gates, the nerve to the brain ----
const WALL_Y = 760, NERVE = [[540, 840], [540, 960], [620, 1080], [860, 1080], [900, 960], [900, 620], [860, 520]];
function closeup(a = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  // tongue tissue above the wall
  const tg = g.createLinearGradient(0, 380, 0, WALL_Y); tg.addColorStop(0, "rgba(242,128,140,0.25)"); tg.addColorStop(1, "rgba(242,128,140,0.55)");
  g.fillStyle = tg; g.fillRect(0, 380, W, WALL_Y - 380);
  // the membrane wall (two lipid rows)
  g.fillStyle = "rgba(255,206,170,0.9)"; g.fillRect(0, WALL_Y - 26, W, 52);
  g.fillStyle = "rgba(220,150,120,0.9)"; for (let x = 10; x < W; x += 30) { g.beginPath(); g.arc(x, WALL_Y - 22, 11, 0, TAU2); g.fill(); g.beginPath(); g.arc(x, WALL_Y + 22, 11, 0, TAU2); g.fill(); }
  // the nerve fibre
  g.strokeStyle = "rgba(255,226,190,0.9)"; g.lineWidth = 46; g.lineJoin = "round"; g.lineCap = "round";
  g.beginPath(); NERVE.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke();
  g.strokeStyle = "rgba(200,150,120,0.9)"; g.lineWidth = 6; g.stroke();
  g.restore();
}
// a gate (ion channel) in the wall at x, open fraction p; col = its colour
function gate(x, p, a = 1, col = GATE, col2 = GATE2, label) {
  if (a <= 0.01) return;
  const gap = 8 + 54 * p, y = WALL_Y;
  g.save(); g.globalAlpha = a;
  [-1, 1].forEach(sd => {
    const x0 = x + sd * (gap / 2 + 40), tilt = sd * 0.35 * p;
    g.save(); g.translate(x0, y); g.rotate(tilt);
    g.fillStyle = css(col); g.strokeStyle = css(col2); g.lineWidth = 6;
    g.beginPath(); g.roundRect(-40, -78, 80, 156, 30); g.fill(); g.stroke();
    g.restore();
  });
  // ions flowing through when open
  if (p > 0.15) for (let i = 0; i < 3; i++) dot(x + (i - 1) * gap * 0.18, y - 60 + ((i * 47 + 0) % 120), 8, [255, 255, 255], a * p);
  g.restore();
  if (label) plate(label, x, y - 150, 48, INK, "center", a, 800);
}
// nerve signal pulses travelling from the gate to the brain; strength 0..1 sets their size and brightness
function pathPt(u) { // u in 0..1 along NERVE
  const seglen = []; let tot = 0; for (let i = 1; i < NERVE.length; i++) { const l = Math.hypot(NERVE[i][0] - NERVE[i - 1][0], NERVE[i][1] - NERVE[i - 1][1]); seglen.push(l); tot += l; }
  let s = u * tot; for (let i = 0; i < seglen.length; i++) { if (s <= seglen[i]) { const k = s / seglen[i]; return [lerp(NERVE[i][0], NERVE[i + 1][0], k), lerp(NERVE[i][1], NERVE[i + 1][1], k)]; } s -= seglen[i]; }
  return NERVE[NERVE.length - 1];
}
function signals(T, strength, col = GOLDc) {
  if (strength <= 0.02) return;
  for (let j = 0; j < 6; j++) { const u = ((T * 0.7 + j / 6) % 1); const [x, y] = pathPt(u); soft(x, y, 34 * strength + 10, col, 0.7 * strength); dot(x, y, 9 + 7 * strength, [255, 250, 230], strength); }
}
function brain(x, y, word, a, col = BLUE, k = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(k, k);
  g.fillStyle = "#F4C6D0"; g.strokeStyle = "#F2F5FB"; g.lineWidth = 6;
  g.beginPath(); [[-50, -10, 52], [10, -34, 56], [62, -4, 48], [30, 34, 48], [-30, 32, 46]].forEach(([bx, by, r]) => { g.moveTo(bx + r, by); g.arc(bx, by, r, 0, TAU2); }); g.fill();
  g.strokeStyle = "#D98EA0"; g.lineWidth = 6; g.lineCap = "round";
  [[-60, -20, -20, 0], [0, -50, 20, -10], [40, 10, 80, -10], [-20, 40, 20, 30]].forEach(([a1, b1, a2, b2]) => { g.beginPath(); g.moveTo(a1, b1); g.quadraticCurveTo((a1 + a2) / 2, b1 - 24, a2, b2); g.stroke(); });
  g.restore();
  if (word) plate(word, x - 180, y - 10, 60, col, "center", a, 900);
}
function menthol(x, y, a = 1, s = 1) {   // simplified menthol: a cyclohexane ring with OH, a methyl and an isopropyl group
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s);
  const R = 38, P = []; for (let i = 0; i < 6; i++) P.push([R * Math.cos(i * Math.PI / 3 + Math.PI / 6), R * Math.sin(i * Math.PI / 3 + Math.PI / 6)]);
  g.strokeStyle = css(MINT); g.lineWidth = 9; g.lineJoin = "round"; g.beginPath(); P.forEach(([px, py], i) => i ? g.lineTo(px, py) : g.moveTo(px, py)); g.closePath(); g.stroke();
  const arm = (i, len, ang) => { const [px, py] = P[i]; const ex = px + len * Math.cos(ang), ey = py + len * Math.sin(ang); g.beginPath(); g.moveTo(px, py); g.lineTo(ex, ey); g.stroke(); return [ex, ey]; };
  const o = arm(0, 30, 0.3); g.fillStyle = css(CORALc); g.beginPath(); g.arc(o[0] + 8, o[1] + 4, 14, 0, TAU2); g.fill();
  arm(3, 34, Math.PI);
  const ip = arm(4, 30, -Math.PI / 2 - 0.4); g.beginPath(); g.moveTo(ip[0], ip[1]); g.lineTo(ip[0] - 24, ip[1] - 18); g.moveTo(ip[0], ip[1]); g.lineTo(ip[0] + 20, ip[1] - 24); g.stroke();
  g.restore();
}
function chili(x, y, a = 1, s = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.rotate(-0.5);
  g.fillStyle = "#E8473A"; g.beginPath(); g.moveTo(-70, 0); g.quadraticCurveTo(-40, -36, 50, -20); g.quadraticCurveTo(90, -10, 96, 30); g.quadraticCurveTo(40, 10, -70, 0); g.fill();
  g.fillStyle = "rgba(255,255,255,0.35)"; g.beginPath(); g.ellipse(-10, -16, 34, 6, -0.1, 0, TAU2); g.fill();
  g.fillStyle = css(MINT2); g.beginPath(); g.roundRect(-92, -14, 30, 22, 8); g.fill(); g.strokeStyle = css(MINT2); g.lineWidth = 8; g.beginPath(); g.moveTo(-88, -4); g.quadraticCurveTo(-110, -20, -112, -44); g.stroke();
  g.restore();
}
function ice(x, y, a, s = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); g.rotate(0.2);
  g.fillStyle = "rgba(210,236,255,0.85)"; g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = 6;
  g.beginPath(); g.roundRect(-60, -60, 120, 120, 18); g.fill(); g.stroke();
  g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.roundRect(-40, -44, 40, 16, 8); g.fill();
  g.restore();
}
function glassOfWater(x, y, a, tilt = 0) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(tilt);
  g.fillStyle = "rgba(140,198,255,0.45)"; g.beginPath(); g.moveTo(-70, -40); g.lineTo(-58, 120); g.lineTo(58, 120); g.lineTo(70, -40); g.closePath(); g.fill();
  g.strokeStyle = "rgba(242,245,251,0.95)"; g.lineWidth = 8; g.beginPath(); g.moveTo(-80, -120); g.lineTo(-62, 126); g.lineTo(62, 126); g.lineTo(80, -120); g.stroke();
  g.restore();
}

const look = [0.6, -0.7];
const SCENES = {};

// 1 — hook: frame one = mouth with a mint, frosty breath, thermometer at 37 °C (circled). The temperature never moves.
SCENES.hook = (t, T, B, E, dur) => {
  room();
  mouth(560, 780, 1.0, T, 1);
  thermo(140, 880, 37, 1, win(t, B(1) + 0.2, dur, 0.3));
  plate("still 37 °C", 560, 1140, 50, GOLD, "center", seg(t, B(1) + 0.6, B(1) + 1.0), 900);
  MASR(T, t, { ev: [[0.4, "?"], [B(1) + 0.6, "!", "grin"]], look, mouth: "o" });
};

// 2 — sensor: push into the tongue. A nerve ending with a gate. Ice comes near: the temperature falls, the gate opens, signals run.
SCENES.sensor = (t, T, B, E, dur) => {
  room();
  const zin = seg(t, 0, 0.7);
  g.globalAlpha = 1 - seg(t, 0.35, 0.9); mouth(560, 780, lerp(1.0, 2.6, zin), T, 1 - zin); g.globalAlpha = 1;
  closeup(seg(t, 0.35, 0.9));
  const iceIn = win(t, 1.6, dur - 0.5, 0.6);
  const temp = lerp(37, 18, seg(t, 2.0, 3.4)) + (37 - 18) * seg(t, dur - 1.3, dur - 0.3);   // falls only while the ice is there, back to 37 °C when it leaves
  const p = pCold(temp, 0);
  ice(280, 560, iceIn, 1.1);
  gate(540, p, seg(t, 0.5, 1.0), GATE, GATE2, "cold sensor");
  signals(T, p * seg(t, 2.6, 3.0), BLUEc);
  brain(860, 470, p > 0.5 ? "cold" : null, seg(t, 0.8, 1.2), BLUE);
  thermo(140, 880, temp, seg(t, 0.4, 0.9));
  plate("a gate", 620, 1180, 50, GOLD, "center", win(t, 1.0, 2.4, 0.3), 900);
  plate("opens when it's cold", 620, 1180, 46, BLUE, "center", seg(t, 3.0, 3.4), 900);
  MASR(T, t, { ev: [[1.2, "?"], [3.2, "idea", "smile"]], look, mouth: "o" });
};

// 3 — menthol: back at 37 °C (ice gone). A menthol molecule docks on the gate; the gate opens anyway; the brain reads "cold".
SCENES.menthol = (t, T, B, E, dur) => {
  room(); closeup(1);
  const temp = 37;                                            // mouth temperature throughout
  const dock = seg(t, 0.6, 2.2);                              // molecule arrives and binds
  const m = seg(t, 1.9, 2.4);                                 // binding shifts the threshold
  const p = pCold(temp, m);
  menthol(lerp(240, 470, dock), lerp(460, WALL_Y - 92, dock), 1, 1.25);
  gate(540, p, 1, GATE, GATE2, null);
  signals(T, p * seg(t, B(1), B(1) + 0.5), BLUEc);
  brain(860, 470, p > 0.5 && t > B(2) ? "COLD!" : null, 1, BLUE, 1 + 0.12 * Math.max(0, spring(t, B(2) + 0.4, 12, 0.5) - 1) + 0.0);
  thermo(140, 880, temp, 1, win(t, B(1), B(2) + 0.5, 0.3));
  plate("menthol", 620, 1180, 50, MINT, "center", win(t, 0.6, B(1) + 0.2, 0.3), 900);
  plate("opens at 37 °C", 620, 1180, 50, GOLD, "center", win(t, B(1) + 0.5, B(2) + 0.2, 0.3), 900);
  MASR(T, t, { ev: [[B(1) + 0.6, "!"], [B(2) + 0.6, "idea", "grin"]], look, mouth: "o" });
};

// 4 — water: cool water after the mint. The primed gate opens wide; signals stronger: "icy!"
SCENES.water = (t, T, B, E, dur) => {
  room(); closeup(1);
  const temp = lerp(37, 22, seg(t, 0.9, 2.2));
  const p = pCold(temp, 1);
  menthol(470, WALL_Y - 92, 1, 1.25);
  glassOfWater(340, 560, seg(t, 0.2, 0.7) * (1 - seg(t, dur - 0.5, dur)), -0.5 * seg(t, 0.6, 1.3));
  plate("cool water", 340, 400, 48, BLUE, "center", seg(t, 0.4, 0.8) * (1 - seg(t, dur - 0.5, dur)), 900);
  gate(540, p, 1, GATE, GATE2, null);
  signals(T, lerp(0.6, 1, seg(t, 1.0, 2.0)), BLUEc);
  brain(860, 470, t > 2.0 ? "ICY!" : "COLD!", 1, BLUE, 1 + 0.15 * seg(t, 1.6, 2.2));
  thermo(140, 880, temp, 1);
  plate("primed", 620, 1180, 50, GOLD, "center", seg(t, 1.2, 1.6) * (1 - seg(t, dur - 0.4, dur)), 900);
  MASR(T, t, { ev: [[2.0, "!", "wince"]], look, mouth: "o" });
};

// 5 — chili: the neighbouring heat sensor; capsaicin from chili opens it at 37 °C; the brain reads "HOT"
SCENES.chili = (t, T, B, E, dur) => {
  room(); closeup(1);
  const pc = pCold(37, 1) * (1 - seg(t, 0.2, 0.8));          // the mint fades from this beat
  menthol(470, WALL_Y - 92, 1 - seg(t, 0.2, 0.8), 1.25);
  gate(540, pc, 1 - seg(t, 0.2, 0.7), GATE, GATE2, null);
  const dock = seg(t, 0.4, 1.6), caps = seg(t, 1.4, 1.9);
  chili(lerp(200, 420, dock), lerp(440, WALL_Y - 140, dock), 1, 1.8);
  const ph = pHeat(37, caps);
  gate(540, ph, seg(t, 0.3, 0.8), [255, 170, 150], [230, 100, 90], "heat sensor");
  signals(T, ph, CORALc);
  brain(860, 470, ph > 0.5 ? "HOT!" : null, 1, CORAL);
  thermo(140, 880, 37, 1);
  MASR(T, t, { ev: [[1.8, "!", "grin"]], look, mouth: "o" });
};

// 6 — end: back to the mouth with the mint, 37 °C; the closing line; the last second is frame one
SCENES.end = (t, T, B, E, dur) => {
  room();
  const zo = seg(t, 0, 0.8);
  closeup(1 - zo);
  mouth(560, 780, lerp(2.6, 1.0, zo), T, zo);
  thermo(140, 880, 37, 1, 0);
  plate("a cold alarm, not cold", 560, 1140, 54, GOLD, "center", win(t, 0.8, dur - 1.15, 0.35), 900);
  MASR(T, t, { ev: [[1.0, "ok", "grin"]], look, mouth: "o" });
};
