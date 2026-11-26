// Writes index.html (the Hyperframes composition) from timeline.json and captions.js (generic, from ep02/build.js).
//   node build.js
// The canvas simulation lives in core.js / scenes.js. Everything here is the layer around it:
// on-screen captions as HTML clips animated with GSAP, and the narration audio clip.
const fs = require("fs");
const TL = JSON.parse(fs.readFileSync("timeline.json", "utf8"));
const SC = Object.fromEntries(TL.scenes.map(s => [s.id, s]));
// time helpers: at("sky", 3) = start of beat 3; at("sky", 3, 1.5) = 1.5 s after it; at("sky", "end") = end of scene
const at = (id, b, off = 0) => +(SC[id].start + (b === "end" ? SC[id].dur : b === "start" ? 0 : SC[id].beats[b].start) + off).toFixed(3);
const frac = (id, b, f) => +(SC[id].start + SC[id].beats[b].start + f * (SC[id].beats[b].end - SC[id].beats[b].start)).toFixed(3);

const L = []; // { cls, text, from, to, style }
const cap = (text, from, to, cls = "cap", style = "") => L.push({ cls, text, from, to, style });
// a run of captions for one scene: each one lasts until the next begins
function run(id, items) { items.forEach(([b, text, off = 0], i) => { const from = at(id, b, off), nx = items[i + 1]; cap(text, from, nx ? at(id, nx[0], (nx[2] || 0) - 0.25) : at(id, "end", -0.35)); }); }

const CAPS = require("./captions.js")({ TL, SC, at, frac, cap, run }) || {};
// Burned-in phrase captions (2026-11-07, Shorts v2): every beat split into phrases of <= ~24 characters,
// timed by each phrase's share of the beat's characters; words in CAPS.keys are shown in gold.
const SCRIPT = JSON.parse(fs.readFileSync("script.json", "utf8"));
const KEYS = (CAPS.keys || []).map(k => k.toLowerCase());
const NUMS = fs.existsSync("nums.json") ? JSON.parse(fs.readFileSync("nums.json", "utf8")) : [];
const K = [];
SCRIPT.scenes.forEach(sc => sc.beats.forEach((txt, bi) => {
  if (CAPS.skip && CAPS.skip.includes(sc.id + ":" + bi)) return;
  NUMS.forEach(([a, b]) => { txt = txt.split(a).join(b); });
  const words = txt.split(/\s+/), ph = []; let cur = [];
  // never end a phrase on a function word ("by the", "a tap on"): carry it to the next phrase (cold read, 2026-11-11)
  const STOP = /^(the|a|an|of|on|in|to|by|so|is|with|from|and|its|that|at|as|it|than|for)$/i;
  words.forEach(w => { const c = [...cur, w].join(" "); if (cur.length && (c.length > 24 || /[.?!:,]$/.test(cur[cur.length - 1]))) {
    const carry = []; if (!/[.?!:,]$/.test(cur[cur.length - 1])) while (cur.length > 1 && STOP.test(cur[cur.length - 1])) carry.unshift(cur.pop());
    ph.push(cur); cur = [...carry, w]; } else cur.push(w); });
  if (cur.length) ph.push(cur);
  // a short tail ("and red.") joins the phrase before it
  if (ph.length > 1 && ph[ph.length - 1].join(" ").length < 11 && [...ph[ph.length - 2], ...ph[ph.length - 1]].join(" ").length <= 34) { const tail = ph.pop(); ph[ph.length - 1].push(...tail); }
  const b = SC[sc.id].beats[bi], a0 = SC[sc.id].start + b.start, d = b.end - b.start, n = ph.reduce((s, p) => s + p.join(" ").length, 0);
  let u = a0;
  ph.forEach(p => { const dd = d * p.join(" ").length / n; K.push({ from: +u.toFixed(3), to: +(u + dd).toFixed(3), words: p }); u += dd; });
}));
// hold each phrase until the next one starts (no flicker inside a beat; gaps under 0.7 s are bridged)
K.forEach((k, i) => { const nx = K[i + 1]; if (nx && nx.from - k.to < 0.7) k.to = nx.from; else k.to = +(k.to + 0.35).toFixed(3); });
const kword = w => { const bare = w.toLowerCase().replace(/[^a-z0-9%°-]/g, ""); return KEYS.some(k => bare === k || bare.startsWith(k)) ? `<b>${w}</b>` : w; };

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const kclips = K.map((k, i) => `      <div id="k${i}" class="clip kara" data-start="${k.from}" data-duration="${(k.to - k.from).toFixed(3)}" data-track-index="${40 + (i % 2)}">${k.words.map(w => kword(esc(w))).join(" ")}</div>`).join("\n");
const kanims = K.map((k, i) => `tl.fromTo("#k${i}",{opacity:0,scale:0.92},{opacity:1,scale:1,duration:0.16,ease:"power2.out"},${k.from});`).join("\n      ");
const clips = L.map((l, i) => `      <div id="c${i}" class="clip ${l.cls}" data-start="${l.from}" data-duration="${(l.to - l.from).toFixed(3)}" data-track-index="${2 + TL.scenes.findIndex(s => l.from < s.start + s.dur) * 2 + (l.cls === "cap" || l.cls === "q" ? 0 : 1)}"${l.style ? ` style="${l.style}"` : ""}>${esc(l.text)}</div>`).join("\n");
const anims = L.map((l, i) => {
  const end = l.to >= TL.total ? "" : `tl.to("#c${i}",{opacity:0,duration:0.25,ease:"power1.in"},${(l.to - 0.25).toFixed(3)});`;
  if (i === 0) return `tl.fromTo("#c0",{scale:0.94},{scale:1,duration:0.6,ease:"power3.out"},0);${end}`;   // the question is readable on the very first frame
  return `tl.fromTo("#c${i}",{opacity:0,y:26},{opacity:1,y:0,duration:0.4,ease:"power3.out"},${l.from});${end}`;
}).join("\n      ");

const D = TL.total;
const FW = +(process.env.FW || 1920), FH = +(process.env.FH || 1080);
const CSS = fs.existsSync("captions.css") ? fs.readFileSync("captions.css", "utf8") : "";
fs.writeFileSync("index.html", `<!doctype html>
<!-- Generated by build.js from timeline.json. Edit build.js (captions) or core.js / scenes*.js (simulation), not this file. -->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=${FW}, height=${FH}" />
    <script src="./gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: ${FW}px; height: ${FH}px; overflow: hidden; background: #18264F; }
      #root { position: relative; width: ${FW}px; height: ${FH}px; font-family: Inter, sans-serif; color: #F2F5FB; }
      canvas { position: absolute; inset: 0; }
      /* Rules from the episode 1 review: no text under 40 px, nothing in the bottom 15% (YouTube captions). */
      .cap, .sub, .q { position: absolute; left: 96px; white-space: nowrap; background: rgba(35, 53, 106, 0.92); border-radius: 20px; transform-origin: left center; }
      .cap { top: 64px; font-size: 60px; font-weight: 800; letter-spacing: -0.01em; padding: 10px 28px 12px; }
      .sub { top: 168px; font-size: 46px; font-weight: 600; color: #FFD45E; padding: 8px 26px 10px; }
      .q { top: 60px; font-size: 104px; font-weight: 800; letter-spacing: -0.02em; padding: 8px 36px 14px; }
      .q2 { top: 212px; font-size: 76px; color: #FF8A7A; }
      .endq { position: absolute; left: 640px; top: 250px; font-size: 104px; font-weight: 800; letter-spacing: -0.02em; white-space: nowrap; }
      .endb { position: absolute; left: 646px; top: 400px; font-size: 56px; font-weight: 700; color: #FFD45E; white-space: nowrap; }
      .ends { position: absolute; left: 646px; top: 486px; font-size: 42px; font-weight: 500; color: #AAB7D1; white-space: nowrap; }
${CSS}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${D}" data-width="${FW}" data-height="${FH}">
      <canvas id="sim" width="${FW}" height="${FH}" class="clip" data-start="0" data-duration="${D}" data-track-index="0" data-layout-allow-overflow></canvas>
      <audio id="narration" class="clip" src="./narration.wav" data-start="0" data-duration="${D}" data-track-index="1" data-volume="1"></audio>
${clips}
${kclips}
    </div>
    <script>window.FRAME_W = ${FW}; window.FRAME_H = ${FH}; window.FRAME_SAFE = ${FH > FW ? 0.8 : 0.85};</script>
    <script src="./timeline.js"></script>
    <script src="./core.js"></script>
    <script src="./scenes.js"></script>
    <script>
      // The whole picture for global time T (seconds): find the scene, draw it, fade at scene edges.
      function renderFrame(T) {
        T = Math.max(0, Math.min(TL.total - 0.001, T));
        const sc = TL.scenes.find(s => T < s.start + s.dur) || TL.scenes[TL.scenes.length - 1], t = T - sc.start;
        const B = i => sc.beats[i].start, E = i => sc.beats[i].end;
        g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
        const k = 1 + 0.045 * eio(t / sc.dur), cx = W / 2, cy = 820;   // slow push-in, anchored on the subject zone
        g.setTransform(k, 0, 0, k, cx * (1 - k), cy * (1 - k));
        SCENES[sc.id](t, T, B, E, sc.dur);
        g.setTransform(1, 0, 0, 1, 0, 0);
        g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
        const first = sc === TL.scenes[0], last = sc === TL.scenes[TL.scenes.length - 1];
        const f = 0.45 * Math.max(first ? 0 : 1 - t / 0.18, last ? 0 : 1 - (sc.dur - t) / 0.12);
        if (f > 0) { g.globalAlpha = Math.min(1, f); g.fillStyle = "#18264F"; g.fillRect(0, 0, ${FW}, ${FH}); g.globalAlpha = 1; }
      }
      window.renderFrame = renderFrame;
      const clock = { t: 0 };
      const tl = gsap.timeline({ paused: true });
      tl.to(clock, { t: ${D}, duration: ${D}, ease: "none", onUpdate: () => renderFrame(clock.t) }, 0);
      ${anims}
      ${kanims}
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
      renderFrame(0); tl.seek(0);
    </script>
  </body>
</html>
`);
console.log("index.html written:", L.length, "captions,", D, "s");
