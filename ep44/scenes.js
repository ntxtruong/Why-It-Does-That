// Episode 44 (Short v3, 1080×1920): the cloud in your ice is mostly trapped air.
// Facts (claims.md): water holds dissolved air; ice takes up very little of it (partition coefficient of a few
// per cent); an ice-cube tray freezes from the outside in, and the freezing front rejects dissolved gas into the
// remaining liquid; the last water to freeze is supersaturated, so bubbles form and are locked into the centre;
// freezing from one side (e.g. an insulated cooler, top-down) pushes the gas into the last layer, which is cut off
// (UniSQ / The Conversation 2026; Journal of Fluid Mechanics 2024, arXiv 2402.06409). Dots are schematic, not to scale.

function kitchen() {
  const gr = g.createRadialGradient(540, 780, 80, 540, 780, 1050);
  gr.addColorStop(0, "rgb(126,160,214)"); gr.addColorStop(0.6, "rgb(72,100,166)"); gr.addColorStop(1, "rgb(30,44,90)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
const ICE = [214, 238, 255], ICE2 = [168, 208, 240], WATER = [96, 156, 226];
// a fixed set of "air" dots: positions in the unit square, deterministic
const AIR = Array.from({ length: 170 }, (_, i) => [hash(i, 1), hash(i, 2), hash(i, 3)]);
// a 3D ice cube (front face square side 2r) with a cloudy core of size `core` (0..1) and bubble density `cloud`
function cube(cx, cy, r, cloud, T, a = 1) {
  if (a <= 0.01) return;
  g.save(); g.globalAlpha = a;
  const d = r * 0.42;
  // top and side faces
  poly([[cx - r, cy - r], [cx - r + d, cy - r - d], [cx + r + d, cy - r - d], [cx + r, cy - r]], INK, 1, 8, true, [236, 247, 255]);
  poly([[cx + r, cy - r], [cx + r + d, cy - r - d], [cx + r + d, cy + r - d], [cx + r, cy + r]], INK, 1, 8, true, ICE2);
  // front face: clear ice, slightly blue
  const gr = g.createLinearGradient(cx - r, cy - r, cx + r, cy + r); gr.addColorStop(0, "rgb(206,234,255)"); gr.addColorStop(1, "rgb(150,196,236)");
  g.fillStyle = gr; g.strokeStyle = css(INKc); g.lineWidth = 8; g.beginPath(); g.roundRect(cx - r, cy - r, 2 * r, 2 * r, r * 0.08); g.fill(); g.stroke();
  // cloudy core: a soft white haze and many small bubbles, packed toward the centre
  if (cloud > 0.01) {
    soft(cx, cy, r * 0.75, [250, 252, 255], 0.85 * cloud);
    AIR.forEach(([u, v, k], i) => {
      const ang = u * TAU2, rad = Math.pow(v, 0.8) * r * 0.55, x = cx + Math.cos(ang) * rad, y = cy + Math.sin(ang) * rad * 1.05;
      dot(x, y, 3 + 7 * k, [255, 255, 255], cloud * 0.9);
    });
  }
  // a highlight streak
  line(cx - r * 0.75, cy - r * 0.55, cx - r * 0.45, cy - r * 0.8, [255, 255, 255], 0.7, 10);
  g.restore();
}
// a cross-section of one tray cell (square, side 2r): ice grows inward from all four walls; f = frozen fraction 0..1
// the remaining liquid is a square of half-side r*(1-f); every air dot stays inside it (pushed inward)
function trayCell(cx, cy, r, f, T, opt = {}) {
  const L = r * (1 - f);
  rrect(cx - r, cy - r, 2 * r, 2 * r, 18, ICE, 1, INK, 8);
  rrect(cx - L, cy - L, 2 * L, 2 * L, 12, WATER, 1);
  // freezing-front arrows pointing inward
  const aa = opt.arrows ?? 0;
  if (aa > 0.01) [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dy]) => arrow(cx - dx * (L + 90), cy - dy * (L + 90), cx - dx * (L + 26), cy - dy * (L + 26), GOLDc, aa, 8, 22));
  // air dots: start spread across the cell, squeezed into the liquid as the front closes in
  const n = opt.n ?? 120, B = opt.bub ?? 0;
  AIR.slice(0, n).forEach(([u, v, k], i) => {
    const ox = (u * 2 - 1) * r * 0.9, oy = (v * 2 - 1) * r * 0.9;
    const s = Math.max(L - 14, 4) / (r * 0.9), wob = Math.sin(T * 2 + i) * 4 * (1 - f);
    const x = cx + ox * Math.min(1, s) + wob, y = cy + oy * Math.min(1, s);
    dot(x, y, lerp(5, 5 + 9 * k, B), B > 0.5 ? [255, 255, 255] : [235, 245, 255], 0.95);
  });
}
const look = [0.6, -0.5];
const SCENES = {};

// 1 — hook: a big ice cube with a white cloudy middle
SCENES.hook = (t, T, B, E, dur) => {
  kitchen(); cube(600, 860, 280, 1, T);
  plate("trapped air", 600, 1250, 44, GOLD, "center", seg(t, 0.6, 1.0), 900);
  MASR(T, t, { ev: [[0.5, "?"]], look, mouth: "o" });
};

// 2 — dissolved: a glass of tap water full of tiny dissolved-air dots; a clear ice block with almost none
SCENES.dissolved = (t, T, B, E, dur) => {
  kitchen();
  const a = seg(t, 0, 0.4), b = seg(t, B(0) + 1.9, B(0) + 2.4);
  // glass of water
  poly([[220, 520], [500, 520], [470, 1000], [250, 1000]], INK, a, 8, true, WATER);
  AIR.slice(0, 90).forEach(([u, v, k], i) => { const y = lerp(560, 970, v), x = lerp(250 + (y - 520) * 0.06, 470 - (y - 520) * 0.06, u) + Math.sin(T * 1.5 + i) * 5; dot(x, y, 5, [235, 245, 255], a); });
  plate("water: dissolved air", 360, 1080, 40, INK, "center", a, 800);
  // ice block
  rrect(620, 600, 300, 380, 24, ICE, b, INK, 8);
  AIR.slice(0, 4).forEach(([u, v]) => dot(650 + 240 * u, 640 + 300 * v, 5, [255, 255, 255], b));
  plate("ice: very little", 770, 1080, 40, GOLD, "center", b, 800);
  MASR(T, t, { ev: [[B(0) + 2.5, "!"]], look, mouth: "o" });
};

// 3 — freeze: a tray cell, cut open; ice grows inward from every wall, pushing the air dots to the middle
SCENES.freeze = (t, T, B, E, dur) => {
  kitchen();
  const f = 0.62 * eio(seg(t, 0.6, dur - 0.2));
  trayCell(600, 780, 330, f, T, { arrows: seg(t, 0.4, 0.9) });
  plate("freezes from the outside in", 560, 300, 46, INK, "center", seg(t, 0.3, 0.7), 900);
  MASR(T, t, { ev: [[1.2, "!"]], look, mouth: "o" });
};

// 4 — core: the last water is packed with air; dots merge into bubbles, then the middle freezes around them
SCENES.core = (t, T, B, E, dur) => {
  kitchen();
  const f = lerp(0.62, 0.74, eio(seg(t, 0.2, 2.6))), bub = seg(t, 1.6, 3.0), lock = seg(t, 3.4, 4.6);
  trayCell(600, 780, 330, f, T, { bub });
  if (lock > 0.01) { const L = 330 * (1 - f); rrect(600 - L - 6, 780 - L - 6, 2 * L + 12, 2 * L + 12, 12, ICE, lock * 0.6); soft(600, 780, 190, [252, 254, 255], lock * 0.8);
    AIR.slice(0, 120).forEach(([u, v, k]) => dot(600 + (u * 2 - 1) * (L - 10), 780 + (v * 2 - 1) * (L - 10), 5 + 9 * k, [255, 255, 255], lock)); }
  plate("packed with air", 600, 1210, 42, INK, "center", win(t, 0.6, 3.3, 0.3), 800);
  plate("bubbles locked in", 560, 300, 48, GOLD, "center", seg(t, 3.4, 3.8), 900);
  MASR(T, t, { ev: [[2.6, "idea"]], look, mouth: "o" });
};

// 5 — clear: an insulated box freezes from the top only; the air is pushed down into the last layer, which is cut off
SCENES.clear = (t, T, B, E, dur) => {
  kitchen();
  const x0 = 360, x1 = 940, y0 = 470, y1 = 1150, f = 0.84 * eio(seg(t, 0.3, B(1) - 0.2)), yf = lerp(y0, y1, f);
  // the box walls (insulated: thick, warm grey)
  rrect(x0 - 40, y0 - 10, x1 - x0 + 80, y1 - y0 + 50, 26, [92, 100, 124], 1, INK, 6);
  const cut0 = seg(t, B(1) + 1.0, B(1) + 1.8);
  rrect(x0, y0, x1 - x0, yf - y0, 6, ICE, 1 - cut0);
  rrect(x0, yf, x1 - x0, y1 - yf, 6, WATER, 1);
  
  arrow((x0 + x1) / 2, y0 - 120, (x0 + x1) / 2, y0 - 30, GOLDc, seg(t, 0.2, 0.6) * (1 - cut0), 8, 22);
  text("cold from the top", (x0 + x1) / 2, y0 - 160, 40, GOLD, "center", 800, seg(t, 0.2, 0.6) * (1 - cut0));
  AIR.slice(0, 110).forEach(([u, v, k], i) => { const y = Math.max(yf + 10, lerp(y0 + 20, y1 - 14, v)), x = lerp(x0 + 18, x1 - 18, u); dot(x, Math.min(y, y1 - 10), 5 + 4 * k * f, [240, 248, 255], 0.95); });
  plate("insulated box", (x0 + x1) / 2, y1 + 100, 40, INK, "center", seg(t, 0.4, 0.8) * (1 - cut0), 800);
  // the cut: a dashed line at the front, then the clear block lifts away
  const cut = seg(t, B(1) + 0.2, B(1) + 0.8), lift = seg(t, B(1) + 1.0, B(1) + 1.8);
  if (cut > 0.01) line(x0 - 60, yf - 4, lerp(x0 - 60, x1 + 60, cut), yf - 4, CORALc, 1, 7, [22, 14]);
  if (lift > 0.01) { rrect(x0, y0 - 140 * lift, x1 - x0, yf - y0, 6, ICE, 1, INK, 8); text("clear", (x0 + x1) / 2, (y0 + yf) / 2 - 140 * lift, 64, BG, "center", 900, lift); }
  MASR(T, t, { ev: [[B(1) + 1.8, "ok", "smile"]], look, mouth: "o" });
};

// 6 — end: back to frame one — a normal cube, cloudy in the middle (loop)
SCENES.end = (t, T, B, E, dur) => {
  kitchen(); const k = eout(seg(t, 0, 0.7));
  cube(600, 860, lerp(230, 280, k), 1, T);
  plate("cloudy middle", 600, 1250, 44, GOLD, "center", win(t, 0.4, dur - 1.15, 0.3), 900);
  MASR(T, t, { ev: [[0.5, "ok", "grin"]], look, mouth: "o" });
};
