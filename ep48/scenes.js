// Episode 48 (Short v4, 1080×1920): many mains-powered lights (cheap or dimmed LEDs, old fluorescents) pulse at twice
// the mains frequency, 100 or 120 times a second. Your eyes blend it; a phone's slow-motion video (short exposures,
// many frames) catches the dips. Facts and sources: claims.md.
// Drawing note: the pulse on the phone screen is drawn at about 1.6 pulses per second, slower than a real 240 fps
// slow-motion clip shows it (100 Hz at 240 fps played at 30 fps ≈ 12 pulses per second). Slower reads at a glance, and
// keeps any brightness change well below the 3–30 Hz band that matters for photosensitive viewers.
const SKIN = [240, 210, 190];
const look = [0.5, -0.8];
const PX = 250, PY = 360, PW = 580, PH = 880;                 // the phone (frame one); its screen is inset 26 px
const SLOW = 1.6;                                            // drawn pulses per second in "slow motion"

// the room behind the phone: a dark evening ceiling lit by the bulb above, off-frame
function room(glow = 1) {
  const gr = g.createRadialGradient(540, -120, 60, 540, -120, 1500);
  gr.addColorStop(0, `rgb(${lerp(60, 132, glow) | 0},${lerp(80, 150, glow) | 0},${lerp(130, 196, glow) | 0})`); gr.addColorStop(0.55, "rgb(40,58,112)"); gr.addColorStop(1, "rgb(20,30,66)");
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// a ceiling LED bulb in a round fitting, as the phone sees it. b = brightness 0..1
function bulb(x, y, s, b) {
  g.save(); g.translate(x, y); g.scale(s, s);
  rrect(-260, -330, 520, 40, 12, [210, 216, 230], 1);                     // ceiling plate
  rrect(-34, -292, 68, 90, 10, [170, 178, 196], 1);                       // socket
  const warm = mix([70, 70, 80], [255, 236, 190], b);
  soft(0, 0, 420, [255, 226, 160], 0.75 * b);                              // halo
  g.fillStyle = css(warm); g.strokeStyle = css(mix([120, 120, 130], [255, 250, 230], b)); g.lineWidth = 8;
  g.beginPath(); g.moveTo(-120, -200); g.bezierCurveTo(-210, -60, -170, 150, 0, 160); g.bezierCurveTo(170, 150, 210, -60, 120, -200); g.closePath(); g.fill(); g.stroke();
  soft(0, -10, 130, [255, 252, 235], b);                                   // hot core
  g.restore();
}
// the phone: dark body, rounded screen, contents drawn by fn in screen coordinates (clipped)
function phone(x, y, w, h, rot, fn, a = 1) {
  g.save(); g.globalAlpha = a; g.translate(x + w / 2, y + h / 2); g.rotate(rot); g.translate(-w / 2, -h / 2);
  g.fillStyle = "#0e1220"; g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.roundRect(0, 0, w, h, 56); g.fill(); g.stroke();
  g.beginPath(); g.roundRect(26, 26, w - 52, h - 52, 36); g.clip();
  fn(26, 26, w - 52, h - 52);
  g.restore();
}
// a hand gripping the phone: palm and fingers behind it (fingertips show at the right edge), thumb across the left edge
function handBack(dy = 0, a = 1) {
  g.save(); g.globalAlpha = a; g.fillStyle = css(SKIN); g.strokeStyle = INK; g.lineWidth = 7;
  g.beginPath(); g.roundRect(PX + 60, PY + PH - 170 + dy, PW - 60, 280, 90); g.fill(); g.stroke();                       // palm under the phone
  [0, 1, 2, 3].forEach(i => { g.beginPath(); g.roundRect(PX + PW - 40, PY + PH - 470 + i * 80 + dy, 90, 66, 32); g.fill(); g.stroke(); });   // fingertips at the right edge
  g.restore();
}
function handFront(dy = 0, a = 1) {
  g.save(); g.globalAlpha = a; g.fillStyle = css(SKIN); g.strokeStyle = INK; g.lineWidth = 7;
  g.translate(PX + 20, PY + PH - 210 + dy); g.rotate(-0.5); g.beginPath(); g.roundRect(-50, -40, 190, 80, 40); g.fill(); g.stroke();   // thumb over the left edge
  g.restore();
}
// camera app UI on the screen: mode strip and a red record dot
function camUI(sx, sy, sw, sh, slowK, t) {
  g.fillStyle = "rgba(10,14,28,0.72)"; g.fillRect(sx, sy + sh - 150, sw, 150);
  const xs = sx + sw / 2, modes = [["VIDEO", 0], ["SLO-MO", 1]], off = lerp(0, -160, slowK);
  modes.forEach(([m, i]) => { const on = i ? slowK : 1 - slowK; text(m, xs + off + i * 160, sy + sh - 100, 40, mix(QUIETc, GOLDc, on), "center", 900); });
  dot(xs, sy + sh - 40, 28, CORALc, 0.6 + 0.4 * Math.abs(Math.sin(t * 2.4)));
  if (slowK > 0.5) plate("240 fps · slowed down", sx + sw / 2, sy + 60, 40, GOLD, "center", seg(slowK, 0.5, 1), 900);
}
// brightness of a cheap or dimmed LED in the drawn slow motion: dips nearly to dark
const pulse = (t, depth = 0.85) => 1 - depth * (0.5 - 0.5 * Math.cos(TAU2 * SLOW * t));
// a scrolling brightness trace: y = brightness, newest point at the right
function trace(x, y, w, h, t, f, col, a = 1, lab) {
  if (a <= 0.01) return;
  rrect(x - 20, y - h - 30, w + 40, h + 60, 18, PANELc, 0.9 * a);
  const P = []; for (let i = 0; i <= 120; i++) { const u = i / 120; P.push([x + u * w, y - h * f(t - (1 - u) * 2.2)]); }
  poly(P, col, a, 9);
  if (lab) text(lab, x, y - h - 64, 48, QUIET, "left", 800, a);
}
const SCENES = {};

// 1 — hook: frame one = a hand holding a phone in slow-motion mode, its picture of a ceiling bulb already pulsing (≈1.6 Hz drawn)
SCENES.hook = (t, T, B, E, dur) => {
  room();
  const sway = Math.sin(T * 1.7) * 0.02, dy = Math.sin(T * 1.3) * 10;
  handBack(dy);
  phone(PX, PY + dy, PW, PH, sway, (sx, sy, sw, sh) => {
    g.fillStyle = "#151b30"; g.fillRect(sx, sy, sw, sh);
    bulb(sx + sw / 2, sy + 400, 0.85, pulse(T));
    camUI(sx, sy, sw, sh, 1, T);
  });
  handFront(dy);
  MASR(T, t, { ev: [[E(0) - 0.6, "?"]], look, s: 0.42, x: 150, y: 1600 });
};
// 2 — reveal: push in on the pulsing picture; at "a hundred or a hundred and twenty times a second" the brightness
// trace and the rate appear (the 7–10 s event)
SCENES.reveal = (t, T, B, E, dur) => {
  room(0.8);
  const zk = eio(seg(t, 0.1, B(1) - 0.3)), k = lerp(1, 1.08, zk), P0 = B(1) + 1.0;
  g.save(); g.translate(540, 830); g.scale(k, k); g.translate(-540, -830);
  handBack(); phone(PX, PY, PW, PH, 0, (sx, sy, sw, sh) => {
    g.fillStyle = "#151b30"; g.fillRect(sx, sy, sw, sh);
    bulb(sx + sw / 2, sy + 400, 0.85, pulse(T));
    camUI(sx, sy, sw, sh, 1, T);
  }); handFront();
  g.restore();
  plate("on · dim · on · dim", 540, 250, 60, GOLD, "center", seg(t, 0.4, 0.8) * (1 - seg(t, P0 + 0.9, P0 + 1.3)), 900);
  const ta = seg(t, P0 + 1.3, P0 + 1.8);
  trace(140, 290, 800, 130, T, u => pulse(u) * 0.9 + 0.05, GOLD, ta, "brightness, slowed down");
  plate("100–120 times a second", 540, 990, 64, GOLD, "center", seg(t, P0 + 1.3, P0 + 1.8), 900);
  MASR(T, t, { ev: [[0.5, "!", "wince"], [P0 + 1.4, "idea"]], look, s: 0.42, x: 150, y: 1600 });
};
// 3 — why: wall power (one swing) → light peaks twice per swing; then eye (smooth) vs camera (snapshots catch dips)
SCENES.why = (t, T, B, E, dur) => {
  clear(); vignette(0.3);
  const s1 = 1 - seg(t, B(1) - 0.3, B(1) + 0.1), s2 = seg(t, B(1) - 0.1, B(1) + 0.4), X0 = 100, X1 = 980;
  if (s1 > 0.01) {
    // top: mains voltage (two swings shown); bottom: light output = power, two humps per swing
    const cyc = 2, ph = t * 0.6;
    text("power in the wall", X0, 420, 52, BLUE, "left", 800, s1);
    const V = [], Lp = []; for (let i = 0; i <= 200; i++) { const u = i / 200, x = lerp(X0, X1, u), th = TAU2 * (cyc * u + ph); V.push([x, 590 - 120 * Math.sin(th)]); Lp.push([x, 1120 - 300 * Math.sin(th) ** 2]); }
    line(X0, 590, X1, 590, QUIET, 0.4 * s1, 3, [10, 10]); poly(V, BLUE, s1, 11);
    const la = seg(t, 0.8, 1.4) * s1;
    text("light", X0, 780, 52, GOLD, "left", 800, la); poly(Lp, GOLD, la, 11);
    plate("2 peaks per swing = ×2", 540, 290, 64, GOLD, "center", seg(t, 1.6, 2.0) * s1, 900);
  }
  if (s2 > 0.01) {
    // the same light seen two ways: the eye blends it (flat line), the camera's short snapshots land on peaks and dips
    const f = u => 0.5 - 0.5 * Math.cos(TAU2 * 3 * u + t * 1.2), Y = u => 1110 - 460 * f(u);
    const Lp = []; for (let i = 0; i <= 200; i++) { const u = i / 200; Lp.push([lerp(X0, X1, u), Y(u)]); }
    poly(Lp, GOLD, s2 * 0.55, 8);
    const ea = seg(t, B(1), B(1) + 0.5) * s2;
    line(X0, 880, X1, 880, INK, ea, 12); plate("your eyes: steady", 540, 300, 60, INK, "center", ea, 900);
    const ca = seg(t, B(1) + 2.4, B(1) + 2.9) * s2;
    for (let i = 0; i < 9; i++) { const u = (i + 0.5) / 9, x = lerp(X0, X1, u); line(x, 600, x, 1130, BLUE, ca * 0.35, 4); dot(x, Y(u), 22, f(u) < 0.35 ? CORALc : BLUEc, ca); }
    plate("camera: catches the dips", 540, 420, 58, BLUE, "center", ca, 900);
  }
  MASR(T, t, { ev: [[1.6, "idea"], [B(1) + 2.6, "!"]], look, s: 0.42, x: 150, y: 1600 });
};
// 4 — end: good LED (flat) vs cheap or dimmed (deep ripple) in one chart; then back to the frame-one shot for the loop
SCENES.end = (t, T, B, E, dur) => {
  const back = seg(t, dur - 2.0, dur - 1.3);
  if (back < 1) {
    clear(); vignette(0.3);
    const a = (1 - back) * seg(t, 0, 0.3), X0 = 120, X1 = 960;
    rrect(X0 - 30, 470, X1 - X0 + 60, 650, 22, PANELc, 0.9 * a);
    const G = [], C = []; for (let i = 0; i <= 160; i++) { const u = i / 160, x = lerp(X0, X1, u); G.push([x, 560]); C.push([x, 1080 - 440 * (pulse(T - (1 - u) * 2.2) * 0.9 + 0.05)]); }
    poly(G, INK, a, 11); poly(C, GOLD, a, 11);
    text("good LED: steady", X0, 340, 54, INK, "left", 900, a);
    text("cheap or dimmed: pulses", X0, 410, 54, GOLD, "left", 900, a);
  }
  if (back > 0) {
    g.globalAlpha = back; room();
    const dy = Math.sin(T * 1.3) * 10;
    handBack(dy, back); phone(PX, PY + dy, PW, PH, Math.sin(T * 1.7) * 0.02, (sx, sy, sw, sh) => { g.fillStyle = "#151b30"; g.fillRect(sx, sy, sw, sh); bulb(sx + sw / 2, sy + 400, 0.85, pulse(T)); camUI(sx, sy, sw, sh, 1, T); }, back); handFront(dy, back);
    g.globalAlpha = 1;
  }
  MASR(T, t, { ev: [[B(0) + 2.4, "idea", "smile"]], look, s: 0.42, x: 150, y: 1600 });
};
