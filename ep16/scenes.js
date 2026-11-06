// Episode 16 (Short, 1080×1920, cut from ep 1) — Why can't you ever reach a rainbow?
// Ray optics in a spherical drop, computed exactly (Snell's law in vector form, one internal reflection):
// the exit rays bunch up near the Descartes ray, about 42° from the line back along the incoming sunlight;
// red (n = 1.331) and violet (n = 1.343) bunch at slightly different angles. The side view then lights only the
// raindrops ~40.5–42.5° from the antisolar line seen from the eye, so the lit set changes when the eye moves.
// Safe zone (Shorts UI): key content above y = 1536 and left of x = 940.

const MAS = (T, o = {}) => mascot3(o.x ?? 150, o.y ?? 1560, o.s ?? 0.4, T, o);
const GROUND = 1330, BANDS = [[255, 120, 110], [255, 170, 90], [255, 220, 100], [130, 220, 140], [120, 180, 255], [160, 140, 255]];
const DEG = Math.PI / 180;
// ---- ray through a drop of radius 1 centred at 0; incoming direction (1,0) at height y = -b (above centre)
function refract(d, n, eta) { const c = -(d[0] * n[0] + d[1] * n[1]), k = 1 - eta * eta * (1 - c * c); if (k < 0) return null; const s = eta * c - Math.sqrt(k); return [eta * d[0] + s * n[0], eta * d[1] + s * n[1]]; }
function hit(p, d) { const b = p[0] * d[0] + p[1] * d[1], c = p[0] * p[0] + p[1] * p[1] - 1, tt = -b + Math.sqrt(Math.max(0, b * b - c)); return [p[0] + tt * d[0], p[1] + tt * d[1]]; }
function trace(b, n) {
  const P1 = [-Math.sqrt(1 - b * b), -b], d1 = refract([1, 0], P1, 1 / n);
  const P2 = hit(P1, d1), dot2 = d1[0] * P2[0] + d1[1] * P2[1], d2 = [d1[0] - 2 * dot2 * P2[0], d1[1] - 2 * dot2 * P2[1]];
  const P3 = hit(P2, d2), d3 = refract(d2, [-P3[0], -P3[1]], n) || d2;
  return { P1, P2, P3, d3, dev: Math.acos(clamp(-d3[0])) / DEG };   // angle from the line back toward the sun
}
// ---- outdoor scene: sky, ground, light rain
function outdoor(T, a = 1) {
  const gr = g.createLinearGradient(0, 0, 0, GROUND); gr.addColorStop(0, css(BGc)); gr.addColorStop(1, css([52, 74, 128]));
  g.fillStyle = gr; g.fillRect(0, 0, W, GROUND); rrect(0, GROUND, W, H - GROUND, 0, [30, 46, 92], 1);
  for (let i = 0; i < 90; i++) { const x = hash(i, 1) * W, y = ((hash(i, 2) * GROUND + T * 700 * (0.8 + 0.4 * hash(i, 3))) % GROUND); line(x, y, x - 6, y + 34, QUIETc, a * 0.35, 2); }
}
// the bow as seen in the picture: arcs around a point below the ground that moves with the walker
function bow(cx, R, a = 1, cy = GROUND + 60) {
  if (a <= 0.01) return; g.save(); g.beginPath(); g.rect(0, 0, W, GROUND); g.clip();
  BANDS.forEach((c, i) => { g.globalAlpha = a * 0.75; g.strokeStyle = css(c); g.lineWidth = 15; g.beginPath(); g.arc(cx, cy, R - i * 14, Math.PI, TAU2); g.stroke(); });
  g.restore();
}
const walkX = t => 150 + 0;   // the character stays put on screen; the world (ground marks) slides
function marks(off, a = 1) { for (let i = -2; i < 14; i++) { const x = ((i * 120 - off) % 1440 + 1440) % 1440 - 120; line(x, GROUND + 40, x + 50, GROUND + 40, QUIETc, a * 0.5, 4); } }
const SCENES = {};

// 1 — hook: first frame = the character walking toward a bright bow that keeps the same distance; then back sideways
SCENES.hook = (t, T, B, E, dur) => {
  clear(); outdoor(T);
  const fw = eio(t / Math.max(0.1, B(1) + 1.6)), back = eio((t - B(1) - 1.8) / 2.2);
  const px = 150 + 200 * fw - 200 * back;       // character position on screen
  marks(0); bow(px + 330, 300, 1);
  plate("it backs away", 600, 640, 50, INK, "center", win(t, B(1) + 0.2, B(1) + 1.8, 0.3), 800);
  plate("it follows you", 600, 640, 50, GOLD, "center", seg(t, B(1) + 2.0, B(1) + 2.4), 800);
  MAS(T, { x: px, look: [0.9, -0.7], mouth: "o" });
};

// 2 — angle: inside one raindrop: enter, bend, bounce off the back, exit; rays bunch near 42°; red and violet split
SCENES.angle = (t, T, B, E, dur) => {
  clear(); vignette();
  const C = [560, 860], R = 230;
  plate("not a thing · an angle", 540, 300, 52, GOLD, "center", win(t, 0.2, B(1) - 0.1, 0.3), 800);
  text("one raindrop", 560, 560, 46, BLUE, "center", 800, win(t, 0.2, B(2), 0.3));
  dot(C[0], C[1], R, [80, 120, 190], 0.35); g.save(); g.strokeStyle = css(BLUEc); g.lineWidth = 4; g.beginPath(); g.arc(C[0], C[1], R, 0, TAU2); g.stroke(); g.restore();
  const P = p => [C[0] + R * p[0], C[1] + R * p[1]];
  // one ray (Descartes ray, b ≈ 0.86): draws along its path over beat 1
  const show = seg(t, B(1), B(1) + 0.4), pr = clamp((t - B(1) - 0.2) / 3.2), r = trace(0.861, 1.333);
  const pts = [[C[0] - 520, C[1] - R * 0.861], P(r.P1), P(r.P2), P(r.P3), [P(r.P3)[0] + 600 * r.d3[0], P(r.P3)[1] + 600 * r.d3[1]]];
  const L = []; for (let i = 0; i < 4; i++) L.push(Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]));
  let left = pr * L.reduce((a, b) => a + b), path = [pts[0]];
  for (let i = 0; i < 4 && left > 0; i++) { const u = Math.min(1, left / L[i]); path.push([lerp(pts[i][0], pts[i + 1][0], u), lerp(pts[i][1], pts[i + 1][1], u)]); left -= L[i]; }
  poly(path, INKc, show * (1 - 0.6 * seg(t, B(2), B(2) + 0.5)), 6);
  text("sunlight", C[0] - 500, C[1] - R * 0.861 - 50, 44, INK, "left", 800, show);
  text("bends", P(r.P1)[0] - 40, P(r.P1)[1] - 50, 42, QUIET, "center", 700, seg(t, B(1) + 1.0, B(1) + 1.4) * (1 - seg(t, B(2), B(2) + 0.4)));
  text("bounces", P(r.P2)[0] + 40, P(r.P2)[1] + 60, 42, QUIET, "center", 700, seg(t, B(1) + 2.0, B(1) + 2.4) * (1 - seg(t, B(2), B(2) + 0.4)));
  // many rays: their exit directions bunch near the Descartes ray
  const many = seg(t, B(2), B(2) + 1.0);
  for (let i = 1; i <= 24; i++) { const b = i / 25, q = trace(b, 1.333), e = P(q.P3), near = Math.abs(q.dev - 42) < 1.2;
    line(e[0], e[1], e[0] + 520 * q.d3[0], e[1] + 520 * q.d3[1], near ? GOLDc : QUIETc, many * (near ? 0.9 : 0.25), near ? 4 : 2); }
  // the 42° arc between "back toward the sun" (dashed) and the bunched exit direction
  const ang = seg(t, B(2) + 1.4, B(2) + 2.2), O = P(r.P3);
  line(O[0], O[1], O[0] - 420, O[1], QUIETc, ang, 3, [12, 10]);
  g.save(); g.globalAlpha = ang; g.strokeStyle = css(GOLDc); g.lineWidth = 5; g.beginPath(); g.arc(O[0], O[1], 200, Math.atan2(r.d3[1], r.d3[0]), Math.PI); g.stroke(); g.restore();
  plate("≈ 42° from the sunlight's path", 540, 300, 46, GOLD, "center", win(t, B(2) + 2.0, B(3) - 0.1, 0.3), 800);
  // colours: red and violet bunch at slightly different angles
  const col = seg(t, B(3), B(3) + 0.8);
  [[1.331, BANDS[0], "red"], [1.343, BANDS[5], "violet"]].forEach(([n, c, nm], k) => { const q = trace(Math.sqrt((4 - n * n) / 3), n), e = P(q.P3);
    line(e[0], e[1], e[0] + 560 * q.d3[0], e[1] + 560 * q.d3[1], c, col, 6);
    text(nm, e[0] + 560 * q.d3[0] - 60, e[1] + 560 * q.d3[1] + (k ? 50 : -50), 42, c, "center", 800, col); });
  MAS(T, { look: [0.9, -0.7], mouth: "o" });
};

// 3 — you: side view; the sun behind the character; drops ≈42° from the shadow of the head (seen from the eye) light up
SCENES.you = (t, T, B, E, dur) => {
  clear(); outdoor(T, 0.5);
  const step = eio((t - B(1) - 0.4) / 1.6), px = 150 + 260 * step, eye = [px - 25, 1290], sunEl = 20 * DEG;
  const anti = [Math.cos(sunEl), Math.sin(sunEl)];   // direction from the eye to the shadow of the head (down-forward)
  // the antisolar line: from the sun (behind, up-left) through the head to the ground
  const al = seg(t, 0.3, 1.2);
  line(eye[0] - 400 * anti[0], eye[1] - 400 * anti[1], eye[0] + 120 * anti[0], eye[1] + 120 * anti[1], GOLDc, al * 0.7, 3, [14, 10]);
  text("sun behind you", 60, 1000, 40, GOLD, "left", 700, al);
  const sh = [eye[0] + (GROUND + 0 - eye[1]) / anti[1] * anti[0], GROUND]; dot(sh[0], sh[1], 18, [14, 22, 48], al); text("your head's shadow", sh[0] + 30, sh[1] + 70, 42, GOLD, "left", 800, al);
  // the 42° cone (upper edge drawn) and the raindrops
  const cn = seg(t, 1.0, 2.0), up = -42 * DEG + sunEl;
  line(eye[0], eye[1], eye[0] + 1100 * Math.cos(up), eye[1] + 1100 * Math.sin(up), GOLDc, cn * 0.5, 3);
  for (let i = 0; i < 520; i++) {
    const x = 120 + hash(i, 11) * 820, y = 380 + hash(i, 12) * (GROUND - 420), v = [x - eye[0], y - eye[1]], l = Math.hypot(v[0], v[1]);
    const a = Math.acos(clamp((v[0] * anti[0] + v[1] * anti[1]) / l, -1, 1)) / DEG;
    if (a >= 40.5 && a <= 42.5 && x > eye[0]) { const c = BANDS[Math.round((42.5 - a) / 2 * 5)]; dot(x, y, 12, c, cn); }
    else dot(x, y, 4, QUIETc, 0.35);
  }
  plate("≈ 42° from your head's shadow", 540, 300, 46, GOLD, "center", seg(t, 1.6, 2.1) * (1 - seg(t, B(1), B(1) + 0.3)), 800);
  plate("step → new drops light up", 540, 300, 48, INK, "center", seg(t, B(1) + 0.4, B(1) + 0.8), 800);
  MAS(T, { x: px, look: [0.9, -0.7], mouth: t > B(1) + 2 ? "grin" : "o" });
};

// 4 — end: walking again, the bow keeps its distance; ends at the opening frame (loop)
SCENES.end = (t, T, B, E, dur) => {
  clear(); outdoor(T);
  const fw = eio(t / (dur - 1.0)) * (1 - eio((t - dur + 1.0) / 0.95)), px = 150 + 200 * fw;
  marks(0); bow(px + 330, 300, 1);
  plate("always 42° away", 600, 640, 54, GOLD, "center", win(t, 0.4, dur - 1.0, 0.3), 800);
  MAS(T, { x: px, look: [0.9, -0.7], mouth: "smile" });
};
