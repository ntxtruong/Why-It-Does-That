// Episode 57 (v5 Short, 1080×1920, Kitchen Science): why a wooden spoon across a pot stops it boiling over.
// Facts (claims.md): starch (and milk proteins) coat the bubbles so they last and stack up into foam that climbs out of
// the pot; a dry wooden spoon is cooler than the foam (wood conducts heat poorly) and porous, so bubbles that touch it
// burst, and bursts spread to neighbours; it only buys time: once the spoon is hot and wet it stops working
// (The Conversation / ScienceAlert 2025, CQUniversity; Mental Floss quoting M. Dickinson).
// v5 look: ep53 Kitchen palette (espresso + cream), subject fills the frame, own camera, hard cuts.
window.NOPUSH = ["hook", "guess", "pop", "starch", "chain", "fail", "end"];
window.NODIP = ["hook", "guess", "pop", "starch", "chain", "fail", "end"];
const K_BG1 = [64, 34, 24], K_BG2 = [30, 15, 11], CREAM = [255, 244, 222], GOLDK = [255, 200, 87], ORANGE = [238, 132, 52];
const STEEL1 = [196, 204, 214], STEEL2 = [120, 128, 140], STEEL3 = [78, 84, 96], WOOD = [206, 150, 90], WOODD = [150, 98, 54], WOODW = [120, 76, 42];
const FOAM = [255, 250, 236], FOAMS = [214, 192, 150], HOT = [255, 96, 70], COOL = [130, 196, 255], FLAME = [110, 170, 255];
const SAFE_MASCOT = (T, t, ev, o = {}) => MASR(T, t, { x: 150, y: 1585, s: 0.6, mx: 62, my: 1290, ev, ...o });
function cam(s, cx, cy, sx = W / 2, sy = 820) { g.setTransform(s, 0, 0, s, sx - cx * s, sy - cy * s); }
function camReset() { g.setTransform(1, 0, 0, 1, 0, 0); }
function kbg() {
  const gr = g.createRadialGradient(W / 2, 760, 80, W / 2, 900, 1300);
  gr.addColorStop(0, css(K_BG1)); gr.addColorStop(1, css(K_BG2)); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // stove top
  g.fillStyle = "rgb(36,30,30)"; g.fillRect(0, 1066, W, 300); g.fillStyle = "rgb(58,50,48)"; g.fillRect(0, 1060, W, 10);
}
// ---------- side view of the pot ----------
const PX = 540, RIM = 620, PW = 420, PB = 1040; // centre x, rim y, half width, bottom y
function flames(t, a = 1) {
  for (let i = 0; i < 11; i++) { const x = PX - 330 + i * 66, h = 34 + 14 * Math.sin(t * 13 + i * 1.7);
    g.save(); g.globalAlpha = 0.85 * a; g.fillStyle = css(FLAME); g.beginPath(); g.moveTo(x - 18, PB + 30); g.quadraticCurveTo(x, PB + 30 - h * 1.6, x + 18, PB + 30); g.closePath(); g.fill(); g.restore(); }
}
function potBack() { // inner back lip (seen above the rim line)
  g.fillStyle = css(STEEL3); g.beginPath(); g.ellipse(PX, RIM, PW, 34, 0, Math.PI, 0); g.fill();
}
function potFront() {
  const gr = g.createLinearGradient(PX - PW, 0, PX + PW, 0);
  gr.addColorStop(0, css(STEEL2)); gr.addColorStop(0.28, css(STEEL1)); gr.addColorStop(0.5, "rgb(226,232,238)"); gr.addColorStop(0.8, css(STEEL2)); gr.addColorStop(1, css(STEEL3));
  g.fillStyle = gr; g.beginPath(); g.moveTo(PX - PW, RIM); g.lineTo(PX - PW + 14, PB - 20); g.quadraticCurveTo(PX - PW + 18, PB, PX - PW + 50, PB); g.lineTo(PX + PW - 50, PB); g.quadraticCurveTo(PX + PW - 18, PB, PX + PW - 14, PB - 20); g.lineTo(PX + PW, RIM);
  g.ellipse(PX, RIM, PW, 34, 0, 0, Math.PI, false); g.closePath(); g.fill();
  // front lip
  g.strokeStyle = "rgb(236,240,244)"; g.lineWidth = 12; g.beginPath(); g.ellipse(PX, RIM, PW, 34, 0, 0.02, Math.PI - 0.02); g.stroke();
  // handles
  [-1, 1].forEach(s => { g.fillStyle = "rgb(40,34,34)"; g.beginPath(); g.roundRect(s < 0 ? PX - PW - 110 : PX + PW - 6, RIM + 70, 116, 50, 22); g.fill(); });
}
// foam bubbles: fixed set; L = dome height above the rim (px); popped(i) -> 0..1 burst progress
const FB = []; for (let i = 0; i < 170; i++) FB.push({ x: hash(i, 1) * 2 - 1, u: Math.pow(hash(i, 2), 0.8), r: 24 + 26 * hash(i, 3), ph: hash(i, 4) * 6.28, i });
FB.sort((a, b) => a.u - b.u);
function bubble(x, y, r, a = 1, skin = 0) {
  if (a <= 0.01 || r < 1) return; g.save(); g.globalAlpha = a;
  g.fillStyle = css(mix(FOAM, [255, 236, 190], skin * 0.5)); g.beginPath(); g.arc(x, y, r, 0, TAU2); g.fill();
  g.strokeStyle = css(mix(FOAMS, GOLDK, skin)); g.lineWidth = 2.5 + 3 * skin; g.stroke();
  g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = Math.max(2, r * 0.12); g.beginPath(); g.arc(x - r * 0.2, y - r * 0.2, r * 0.55, 3.5, 4.5); g.stroke();
  g.restore();
}
function burst(x, y, r, age, a = 1) { // bold pop: white flash (first ~3 frames), thick ring, gold rays, droplets; age 0..1
  if (age <= 0 || age >= 1) return; const u = eout(age), f = (1 - age) * a;
  if (age < 0.25) { soft(x, y, r * 2.2, [255, 255, 255], 0.9 * (1 - age / 0.25) * a); dot(x, y, r * 0.9 * (1 - age / 0.25), [255, 255, 255], a); }
  g.save(); g.globalAlpha = f; g.strokeStyle = css(CREAM); g.lineWidth = 12; g.beginPath(); g.arc(x, y, r * (0.8 + 1.0 * u), 0, TAU2); g.stroke();
  g.strokeStyle = css(GOLDK); g.lineWidth = 10; g.lineCap = "round"; for (let k = 0; k < 8; k++) { const an = k * Math.PI / 4 + 0.3, r0 = r * (0.6 + 1.0 * u), r1 = r * (1.1 + 1.5 * u); g.beginPath(); g.moveTo(x + Math.cos(an) * r0, y + Math.sin(an) * r0); g.lineTo(x + Math.cos(an) * r1, y + Math.sin(an) * r1); g.stroke(); }
  g.restore();
  for (let k = 0; k < 6; k++) { const an = -Math.PI / 2 + (k - 2.5) * 0.6; dot(x + Math.cos(an) * r * 2 * u, y + Math.sin(an) * r * 2 * u + 50 * u * u, 10, CREAM, f); }
}
function foamDome(t, L, cap = -1e9, popT = null) {
  if (L <= -10) return;
  FB.forEach(b => {
    const hx = Math.max(0, L) * (1 - 0.6 * b.x * b.x) + 10;
    let y = RIM + 18 - b.u * hx + Math.sin(t * 3 + b.ph) * 4;
    const x = PX + b.x * (PW - 30) + Math.sin(t * 2 + b.ph) * 3;
    let r = b.r * clamp(0.55 + hx / 220, 0.55, 1);
    if (y - r < cap) { // above the spoon line: the bubble has hit the wood and bursts at its own time
      const age = popT ? popT(b) : 1; if (age <= 0) { bubble(x, cap + r * 0.9, r); return; } if (age < 1) burst(x, Math.max(y, cap + r * 0.2), r * 0.6, age); return; }
    bubble(x, y, r);
  });
}
// spill: drips over the lip and down the front wall, s = 0..1
function spill(t, s) {
  if (s <= 0.01) return;
  for (let i = 0; i < 9; i++) { const x = PX - PW + 40 + i * (2 * PW - 80) / 8 + (hash(i, 7) - 0.5) * 40, len = s * (90 + 200 * hash(i, 8)) * (0.9 + 0.1 * Math.sin(t * 2 + i)), w = 20 + 16 * hash(i, 9);
    const y0 = RIM + 30 * Math.sqrt(1 - Math.pow((x - PX) / PW, 2));
    g.save(); g.fillStyle = css(FOAM); g.strokeStyle = css(FOAMS); g.lineWidth = 3; g.beginPath(); g.moveTo(x - w, y0 - 6); g.lineTo(x - w * 0.7, y0 + len - w * 0.6); g.arc(x, y0 + len - w * 0.6, w * 0.72, Math.PI, 0, true); g.lineTo(x + w, y0 - 6); g.closePath(); g.fill(); g.stroke(); g.restore();
    bubble(x - w * 0.2, y0 + len * 0.4, w * 0.45);
  }
  // side spill over the handles
  [-1, 1].forEach((sd, k) => { const x = PX + sd * (PW + 6), len = s * 260; g.save(); g.fillStyle = css(FOAM); g.beginPath(); g.roundRect(x - 22, RIM - 10, 44, len, 22); g.fill(); g.restore(); bubble(x, RIM + len * 0.5, 20); });
}
// wooden spoon lying across (side view): y = underside line, wet 0..1, lift = px above the rim
function spoon(y, wet = 0, a = 1, rot = 0) {
  if (a <= 0.01) return; g.save(); g.globalAlpha = a; g.translate(PX, y); g.rotate(rot);
  const col = mix(WOOD, WOODW, wet), dk = mix(WOODD, [86, 52, 28], wet);
  // bowl on the right
  g.fillStyle = css(dk); g.beginPath(); g.ellipse(415, -24, 100, 40, 0, 0, TAU2); g.fill();
  g.fillStyle = css(col); g.beginPath(); g.ellipse(415, -30, 92, 32, 0, 0, TAU2); g.fill();
  // handle
  g.fillStyle = css(dk); g.beginPath(); g.roundRect(-510, -36, 840, 36, 18); g.fill();
  g.fillStyle = css(col); g.beginPath(); g.roundRect(-510, -40, 840, 32, 16); g.fill();
  g.strokeStyle = css(dk, 0.7); g.lineWidth = 3; for (let k = 0; k < 3; k++) { g.beginPath(); g.moveTo(-500, -32 + k * 9); g.bezierCurveTo(-200, -28 + k * 9 + 3 * Math.sin(k), 100, -34 + k * 9, 360, -30 + k * 9); g.stroke(); }
  if (wet > 0.05) { g.globalAlpha = a * wet * 0.8; for (let k = 0; k < 7; k++) { g.fillStyle = "rgba(255,255,255,0.7)"; g.beginPath(); g.ellipse(-420 + k * 120, -30, 18, 5, 0, 0, TAU2); g.fill(); } }
  g.restore();
}
function steamWisps(t, y, a) { if (a <= 0.01) return; for (let i = 0; i < 6; i++) { const x = PX - 360 + i * 140, u = ((t * 0.7 + hash(i, 3)) % 1);
  g.save(); g.globalAlpha = a * 0.5 * Math.sin(u * Math.PI); g.strokeStyle = "rgb(240,240,240)"; g.lineWidth = 10; g.lineCap = "round"; g.beginPath();
  for (let k = 0; k <= 8; k++) { const yy = y - 20 - u * 160 - k * 12, xx = x + Math.sin(k * 0.8 + t * 3 + i) * 14; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); g.restore(); } }
function sideScene(t, L, spoonY, opt = {}) {
  kbg(); flames(t); potBack();
  const cap = opt.cap ?? -1e9;
  if (!opt.foamFront) { foamDome(t, L, cap, opt.popT); potFront(); spill(t, opt.spill || 0); spoon(spoonY, opt.wet || 0, 1, opt.rot || 0); }
  else { potFront(); spoon(spoonY, opt.wet || 0, 1, opt.rot || 0); foamDome(t, L, cap, opt.popT); spill(t, opt.spill || 0); }
}
// pop flashes along the spoon's underside, deterministic: n events in [t0, t1]
function popsAlong(t, t0, t1, n, y, seed = 1, scale = 1) {
  for (let k = 0; k < n; k++) { const tk = t0 + (t1 - t0) * hash(k, seed), x = PX - PW + 40 + hash(k, seed + 1) * (2 * PW - 80); burst(x, y + 6, 26 * scale * (0.7 + 0.6 * hash(k, seed + 2)), (t - tk) / 0.35); }
}
const SCENES = {};
const HOVER = 380; // spoon height in frame one / last frame (underside y)
// 1 — hook: foam at the rim and rising (spills at ~1 s); the spoon drops on at 3.0 s; the foam backs off and the camera
// pushes in on the spoon from 3.6 s so bubbles visibly burst on the wood (no still stretch before the 10 s wall)
const popCycle = (t, b, rate = 0.55) => { const a = (t * rate + hash(b.i, 6)) % 1; return a < 0.7 ? 0 : (a - 0.7) / 0.3; };
SCENES.hook = (t, T, B, E, dur) => {
  const land = 3.0, drop = eio((t - 2.65) / 0.35);
  const sy = lerp(HOVER + Math.sin(t * 2.2) * 8, RIM - 34, drop);
  const L = t < land ? lerp(60, 178, eio(t / 2.4)) : lerp(178, 62, eout((t - land) / 1.2)) + 14 * Math.sin((t - land) * 2.6) * seg(t, land + 0.8, land + 1.4);
  const sp = t < land ? 0.6 * seg(t, 2.0, 2.8) : 0.9 * (1 - eout((t - land) / 1.2));
  const zi = eio((t - 3.6) / 0.9);
  cam(lerp(1.0, 2.2, zi), lerp(PX, PX - 120, zi), lerp(RIM, RIM - 20, zi), W / 2, lerp(780, 720, zi));
  const cap = t < land ? -1e9 : RIM - 34;
  sideScene(t, L, sy, { spill: sp, cap, popT: b => t < land + 1.2 ? clamp((t - land - b.x * b.x * 0.4 - hash(b.i, 5) * 1.2) / 0.35, 0, 1) : popCycle(t, b) });
  popsAlong(t, land, land + 1.9, 12, RIM - 34, 3);
  popsAlong(t, 4.4, dur, 5, RIM - 34, 13, 0.9);
  camReset();
  SAFE_MASCOT(T, t, [[0.4, "!", "wince"], [land + 0.1, "!"], [4.6, "?"]]);
};
// 2 — guess: same close-up on the spoon (continuity); "pressing it down?" crossed out over it; bubbles keep bursting
SCENES.guess = (t, T, B, E, dur) => {
  if (t >= MACRO0) { macro(t - MACRO0);
    plate("the wood's underside", 540, 300, 58, CREAM, "center", seg(t, MACRO0 + 0.2, MACRO0 + 0.4), 900);
    SAFE_MASCOT(T, t, [[MACRO0 + 0.2, "!"]]); return; }
  cam(lerp(2.2, 2.6, t / dur), lerp(PX - 120, PX + 40, eio(t / dur)), RIM - 20, W / 2, 720);
  const L = 62 + 14 * Math.sin((t + 3) * 2.6), cap = RIM - 34;
  sideScene(t, L, RIM - 34, { cap, popT: b => popCycle(t + 6, b, 0.6) });
  popsAlong(t, 0, dur, 9, RIM - 34, 9, 0.9);
  camReset();
  const a1 = seg(t, 0.1, 0.3) * (1 - seg(t, 1.6, 1.8));
  plate("pressing it down?", 540, 330, 66, CREAM, "center", a1, 900);
  if (t > 0.8) { const u = eout((t - 0.8) / 0.25), f = 1 - seg(t, 1.6, 1.8); line(250, 290, lerp(250, 830, u), lerp(290, 370, u), [255, 90, 80], f, 14); line(830, 290, lerp(830, 250, u), lerp(290, 370, u), [255, 90, 80], f, 14); }
    SAFE_MASCOT(T, t, [[0.9, "?"], [2.0, "!"]]);
};
// 3 — macro: the spoon's underside as a big porous beam; bubbles rise and burst on it
const BEAMY = 640; // underside of the beam
const RB = []; for (let i = 0; i < 30; i++) RB.push({ x: 360 + hash(i, 11) * 620, r: 70 + 60 * hash(i, 12), t0: -0.4 + i * 0.18 + hash(i, 13) * 0.15 });
function beam(t, wet = 0) {
  const col = mix(WOOD, WOODW, wet);
  g.fillStyle = css(col); g.fillRect(0, 360, W, BEAMY - 360);
  g.strokeStyle = css(WOODD, 0.75); g.lineWidth = 5; for (let k = 0; k < 9; k++) { g.beginPath(); g.moveTo(0, 390 + k * 28); g.bezierCurveTo(300, 380 + k * 28 + 10 * Math.sin(k), 700, 400 + k * 28, W, 388 + k * 28); g.stroke(); }
  // pores (the wood is porous)
  for (let i = 0; i < 26; i++) { g.fillStyle = css([92, 56, 30], 0.85); g.beginPath(); g.ellipse(30 + hash(i, 21) * 1020, 380 + hash(i, 22) * 240, 10 + 6 * hash(i, 23), 4, 0, 0, TAU2); g.fill(); }
  g.fillStyle = css(WOODD); g.fillRect(0, BEAMY - 10, W, 10);
}
// macro under the spoon; tm = time since the cut to the macro (starts on the word "Watch" in the guess scene)
const MACRO0 = 1.85; // guess-scene time of the cut
function macro(tm) {
  clear(K_BG2);
  const gr = g.createLinearGradient(0, BEAMY, 0, 1400); gr.addColorStop(0, "rgba(255,240,210,0.08)"); gr.addColorStop(1, "rgba(255,240,210,0.22)"); g.fillStyle = gr; g.fillRect(0, BEAMY, W, 800);
  cam(lerp(1.12, 1.0, eout(tm / 0.5)), W / 2, 820, W / 2, 820);
  beam(tm);
  // the first, big bubble: already pressed on the wood at the cut, bursts at tm 0.15 (centre frame)
  if (tm < 0.15) bubble(600, BEAMY + 150, 150, 1, 0.6); else burst(600, BEAMY + 90, 150, (tm - 0.15) / 0.6);
  RB.forEach((b, i) => { const rise = 0.9, tt = tm - b.t0; if (tt < 0) return;
    const y = lerp(1300, BEAMY + b.r, eio(tt / rise)); if (tt < rise) bubble(b.x + Math.sin(tt * 4 + i) * 10, y, b.r, 1, 0.6); else burst(b.x, BEAMY + b.r * 0.5, b.r * 0.8, (tt - rise) / 0.45); });
  camReset();
}
SCENES.pop = (t, T, B, E, dur) => {
  const tm = t + (TL.scenes.find(s => s.id === "guess").dur - MACRO0);
  macro(tm);
  plate("DRY", 300, 300, 66, GOLDK, "center", seg(t, 1.0, 1.25), 900);
  plate("COOLER", 760, 300, 66, COOL, "center", seg(t, 1.45, 1.7), 900);
  SAFE_MASCOT(T, t, [[0.5, "!"], [1.6, "idea"]]);
};
// 4 — starch: one huge bubble gets a gold starch skin; then cut to the cutaway pot where coated bubbles stack into a tower
const CX = 540, CY = 820, CR = 300;
function bigBubble(t, coat) {
  // a translucent bubble: see-through body, bright rim, white highlight; the starch skin wraps around it as coat grows
  g.save(); g.fillStyle = "rgba(255,255,255,0.18)"; g.beginPath(); g.arc(CX, CY, CR, 0, TAU2); g.fill();
  g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = 10; g.stroke(); g.restore();
  g.strokeStyle = "rgba(255,255,255,0.95)"; g.lineWidth = 22; g.lineCap = "round"; g.beginPath(); g.arc(CX - 60, CY - 60, CR * 0.62, 3.5, 4.4); g.stroke();
  dot(CX + 150, CY + 140, 18, [255, 255, 255], 0.8);
  if (coat > 0.01) { const sweep = TAU2 * coat; g.save(); g.lineCap = "round"; g.strokeStyle = "rgba(255,196,60,0.85)"; g.lineWidth = 34; g.beginPath(); g.arc(CX, CY, CR + 6, -Math.PI / 2, -Math.PI / 2 + sweep); g.stroke();
    g.strokeStyle = "rgba(255,236,150,0.9)"; g.lineWidth = 8; g.beginPath(); g.arc(CX, CY, CR + 14, -Math.PI / 2, -Math.PI / 2 + sweep); g.stroke();
    for (let k = 0; k < 18 * coat; k++) { const a = -Math.PI / 2 + (k + 0.5) / 18 * TAU2; dot(CX + Math.cos(a) * (CR + 6), CY + Math.sin(a) * (CR + 6), 11, [214, 150, 30], 0.9); }
    g.restore(); }
}
function pasta(t, a) { // a few penne/strands drifting at the bottom, shedding starch dots
  for (let i = 0; i < 3; i++) { const x = 220 + i * 320, y = 1220 + Math.sin(t * 1.5 + i) * 10;
    g.save(); g.globalAlpha = a; g.translate(x, y); g.rotate(-0.3 + i * 0.3); g.fillStyle = "rgb(246,208,110)"; g.beginPath(); g.roundRect(-90, -22, 180, 44, 18); g.fill();
    g.strokeStyle = "rgb(214,170,70)"; g.lineWidth = 4; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(k * 32 - 8, -20); g.lineTo(k * 32 + 8, 20); g.stroke(); } g.restore();
    for (let k = 0; k < 6; k++) { const u = ((t * 0.5 + hash(i * 10 + k, 2)) % 1); dot(x + (hash(i * 10 + k, 3) - 0.5) * 160, y - 40 - u * 260, 7, GOLDK, a * (1 - u)); } }
}
// cutaway pot (front wall removed): interior x 110..970, water surface WS, rim CRIM
const CL = 110, CRt = 970, CRIM = 470, WS = 1010, CBOT = 1260;
function cutPot(t) {
  kbg();
  g.fillStyle = css(STEEL3); g.fillRect(CL, CRIM, CRt - CL, CBOT - CRIM); // inside back wall
  g.fillStyle = "rgba(255,236,196,0.55)"; g.fillRect(CL, WS, CRt - CL, CBOT - WS); // starchy water
  for (let i = 0; i < 16; i++) { const u = ((t * 0.9 + hash(i, 41)) % 1); bubble(CL + 40 + hash(i, 42) * (CRt - CL - 80), lerp(CBOT - 20, WS, u), 10 + 8 * hash(i, 43), 0.8); }
  g.fillStyle = css(STEEL2); g.fillRect(CL - 30, CRIM, 30, CBOT - CRIM + 20); g.fillRect(CRt, CRIM, 30, CBOT - CRIM + 20); g.fillRect(CL - 30, CBOT, CRt - CL + 60, 22);
  g.fillStyle = "rgb(236,240,244)"; g.fillRect(CL - 34, CRIM - 8, 38, 14); g.fillRect(CRt - 4, CRIM - 8, 38, 14);
}
// tower bubbles: hex-ish packing from the water surface up
const TB = []; (function () { let k = 0; for (let row = 0; row < 12; row++) for (let c = 0; c < 9; c++) { const r = 44 + 10 * hash(k, 51), x = CL + 56 + c * 98 + (row % 2 ? 49 : 0) + (hash(k, 52) - 0.5) * 16; if (x > CRt - 40) { k++; continue; } TB.push({ x, y: WS - 30 - row * 46, r, row, k }); k++; } })();
function tower(t, top, coat = 1, popAt = null) {
  TB.forEach(b => { if (b.y < top) return; const pa = popAt ? popAt(b) : -1; const yy = b.y + Math.sin(t * 3 + b.k) * 3;
    if (pa >= 1) return; if (pa > 0) { burst(b.x, yy, b.r * 0.7, pa); return; } bubble(b.x, yy, b.r, 1, coat); });
}
SCENES.starch = (t, T, B, E, dur) => {
  const cut = 2.6;
  if (t < cut) {
    const wg = g.createLinearGradient(0, 300, 0, 1500); wg.addColorStop(0, "rgb(214,186,140)"); wg.addColorStop(1, "rgb(150,112,74)"); g.fillStyle = wg; g.fillRect(0, 0, W, H);
    cam(lerp(1.0, 1.1, t / cut), CX, CY, CX, 820);
    for (let i = 0; i < 10; i++) { const u = ((t * 0.6 + hash(i, 61)) % 1); bubble(80 + hash(i, 62) * 920, lerp(1300, 420, u), 16 + 10 * hash(i, 63), 0.7); }
    pasta(t, 1); bigBubble(t, seg(t, 0.2, 2.2));
    g.fillStyle = css(WOODD); g.beginPath(); g.roundRect(-40, 330, W + 80, 46, 20); g.fill(); g.fillStyle = css(WOOD); g.beginPath(); g.roundRect(-40, 326, W + 80, 38, 18); g.fill();
    camReset();
    plate("starch", 270, 450, 62, GOLDK, "center", seg(t, 0.3, 0.55), 900);
    plate("sticky skin", 790, 450, 62, CREAM, "center", seg(t, 1.3, 1.55), 900);
    SAFE_MASCOT(T, t, [[0.5, "!"], [1.4, "idea"]]);
  } else {
    const u = t - cut, top = lerp(WS - 20, CRIM - 20, eio(u / 2.6));
    cam(lerp(1.0, 1.06, u / 3), W / 2, 860, W / 2, 860);
    cutPot(t); tower(t, top, 1);
    camReset();
    plate("they stack instead of popping", 540, 330, 54, CREAM, "center", seg(u, 0.2, 0.45), 900);
    SAFE_MASCOT(T, t, [[cut + 0.3, "!", "wince"]]);
  }
};
// 5 — chain: the spoon breaks the top bubbles; each burst pops its neighbours; the tower falls
SCENES.chain = (t, T, B, E, dur) => {
  const t1 = 1.75, sp = 0.045 * 0 + 1 / 520; // wave speed: 520 px per second
  cam(1.0, W / 2, 860, W / 2, 860);
  cutPot(t);
  const hitX = 540, hitY = CRIM;
  tower(t, CRIM - 20, 1, b => {
    if (b.y - b.r < CRIM + 30 && t > 0.35) return clamp((t - 0.35 - hash(b.k, 3) * 0.5) / 0.35, 0, 1);  // top row hits the spoon
    if (b.y > CRIM + 190) return -1;   // the spoon only keeps the foam below itself: the lower foam stays
    const d = Math.hypot(b.x - hitX, b.y - hitY); return clamp((t - t1 - d * sp * 2.2) / 0.3, 0, 1) || -1;
  });
  // the spoon on the rim, seen end-on across the cut
  g.fillStyle = css(WOODD); g.beginPath(); g.roundRect(CL - 60, CRIM - 46, CRt - CL + 120, 40, 18); g.fill();
  g.fillStyle = css(WOOD); g.beginPath(); g.roundRect(CL - 60, CRIM - 50, CRt - CL + 120, 34, 16); g.fill();
  // ripple ring showing the wave
  if (t > t1 && t < t1 + 1.6) { const rr = (t - t1) * 520; g.save(); g.globalAlpha = 0.5 * (1 - (t - t1) / 1.6); g.strokeStyle = css(GOLDK); g.lineWidth = 8; g.beginPath(); g.arc(hitX, hitY, rr, 0, Math.PI); g.stroke(); g.restore(); }
  camReset();
  plate("spoon breaks the top", 540, 330, 56, CREAM, "center", seg(t, 0.3, 0.55) * (1 - seg(t, t1 - 0.35, t1 - 0.1)), 900);
  plate("chain reaction", 540, 330, 66, GOLDK, "center", seg(t, t1 + 0.1, t1 + 0.35), 900);
  plate("foam stays below the spoon", 640, 1312, 46, CREAM, "center", seg(t, t1 + 1.2, t1 + 1.45), 900);
  SAFE_MASCOT(T, t, [[0.4, "!"], [t1 + 0.3, "ok", "grin"]]);
};
// 6 — fail: the spoon gets hot and soaked (darkens, steams, thermometer climbs), then the foam climbs over it and spills
function thermo(x, y, v, a) { if (a <= 0.01) return; rrect(x - 52, y - 170, 104, 300, 50, [40, 20, 14], 0.92 * a, CREAM, 4);
  rrect(x - 18, y - 140, 36, 210, 18, [70, 40, 30], a); const h = 210 * v; rrect(x - 18, y + 70 - h, 36, h, 18, mix(COOL, HOT, v), a); dot(x, y + 92, 30, mix(COOL, HOT, v), a); }
SCENES.fail = (t, T, B, E, dur) => {
  const wet = seg(t, 0.5, 2.4), heat = seg(t, 0.7, 2.6), rise = eio((t - 3.1) / 1.9);
  const L = lerp(24, 205, rise);
  cam(lerp(1.12, 1.0, eout(t / 0.5)), PX, RIM, W / 2, 780);
  sideScene(t, L, RIM - 34, { wet, foamFront: rise > 0.25, spill: seg(t, 4.0, 5.2), cap: rise > 0.2 ? -1e9 : RIM - 34 });
  steamWisps(t, RIM - 70, wet);
  camReset();
  thermo(900, 410, lerp(0.2, 0.95, heat), seg(t, 0.4, 0.7) * (1 - seg(t, 3.1, 3.4)));
  plate("hot", 420, 330, 66, HOT, "center", seg(t, 1.2, 1.45) * (1 - seg(t, 3.1, 3.4)), 900);
  plate("+ soaked", 420, 440, 62, COOL, "center", seg(t, 2.0, 2.25) * (1 - seg(t, 3.1, 3.4)), 900);
  plate("stops working", 540, 330, 66, CREAM, "center", seg(t, 3.25, 3.5), 900);
  SAFE_MASCOT(T, t, [[1.3, "?"], [3.6, "!", "wince"]]);
};
// 7 — end: the question; the soaked spoon lifts off and dries into frame one's hovering spoon, foam spilling (loops)
SCENES.end = (t, T, B, E, dur) => {
  const up = eio((t - 0.4) / 1.6), L = lerp(205, 60, eio(t / dur));
  const s = lerp(1.0, 1.0, up); cam(s, PX, RIM, W / 2, 780);
  sideScene(t, L, lerp(RIM - 34, HOVER + Math.sin((t - dur) * 2.2) * 8, up), { wet: 1 - up, foamFront: true, spill: 0.95 * (1 - eio((t - 0.6) / (dur - 0.7))) });
  camReset();
  SAFE_MASCOT(T, t, [[0.3, "?", "grin"]]);
};
