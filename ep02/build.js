// Writes index.html (the Hyperframes composition) from timeline.json and the label list below.
//   node build.js
// The canvas simulation lives in core.js / scenesA-C.js. Everything here is the layer around it:
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

// hook
cap("Why is the sky blue?", 0, at("hook", 2, -0.3), "q");
cap("…and red at sunset?", at("hook", 1), at("hook", 2, -0.3), "q q2");
run("hook", [[2, "Not a reflection of the sea"], [3, "Not the colour of space: space is black"], [4, "Same sunlight. Same air."]]);
cap("What changes is how much air it crosses", at("hook", 4, 4.2), at("hook", "end", -0.35), "sub");
run("white", [[0, "Sunlight is every colour mixed"], [1, "Each colour has its own wavelength"], [2, "Red: long waves"], [3, "Blue: shorter waves"], [4, "In space they travel together"]]);
run("air", [[0, "Then the light reaches the air"], [1, "Air: nitrogen and oxygen molecules"], [2, "Over 1,000 times smaller than the wave"], [3, "The wave shakes the electrons"], [4, "The molecule sends light back out"], [5, "This is scattering"]]);
cap("The light is not absorbed", frac("air", 5, 0.22), frac("air", 5, 0.56) - 0.2, "sub");
cap("It keeps its colour", frac("air", 5, 0.56), frac("air", 5, 0.8) - 0.2, "sub");
cap("It only changes direction", frac("air", 5, 0.8), at("air", "end", -0.35), "sub");
run("law", [[0, "Not every colour scatters equally"], [1, "Shorter wave, faster shake, more light"], [2, "Half the wavelength: 16× the scattering"], [3, "Blue scatters about 6× more than red"], [4, "Straight down through the atmosphere"], [7, "Rayleigh scattering", -0.2]]);
cap("Lord Rayleigh, 1871", at("law", 7, 1.4), at("law", 8, 3.2), "sub");
cap("Air molecules alone are enough (Einstein)", at("law", 8, 3.6), at("law", "end", -0.35), "sub");
run("sky", [[0, "Midday. Look away from the sun"], [1, "No air: a black sky, like the Moon's"], [2, "Sunlight streams through the air"], [3, "Molecules scatter a little toward you"], [4, "Mostly blue"], [5, "From every direction: a blue sky"],
  [6, "Sunlight that took a detour"], [7, "The sun still looks almost white"], [8, "Most of the blue comes straight through"], [9, "Near the horizon the blue turns pale"], [10, "Scattered again and again: colours remix"], [11, "Less air above you: a darker sky"]]);
cap("In space it is black", at("sky", 11, 4.6), at("sky", "end", -0.35), "sub");
run("violet", [[0, "Violet waves are even shorter"], [1, "So why isn't the sky violet?"], [2, "1. The sun gives off less violet"], [3, "2. Some is absorbed high up"], [4, "3. Eyes are less sensitive to violet"], [5, "The mix reads as blue"]]);
cap("Violet scatters nearly 10× more than red", at("violet", 1), at("violet", 2, -0.25), "sub");
run("sunset", [[0, "Now let the sun go down"], [1, "Midday: the short way through the air"], [2, "Sunset: the light skims the ground"], [3, "About 38 times more air"], [4, "Every molecule knocks blue out", -0.2], [5, "Follow the beam: it starts white"], [6, "Then yellow, then orange"],
  [7, "Blue: almost none left"], [8, "Red: about a quarter survives"], [9, "What's left over: orange and red"], [10, "It paints the clouds and the low sky", -0.3], [11, "Dust and haze deepen the colour"], [12, "Sunrise: the same, from the east"]]);
run("west", [[0, "Where did the blue go?"], [1, "Scattered light never vanishes"], [2, "It left the beam far to the west"], [3, "Somebody else's blue sky"], [4, "Two halves of the same sunlight"]]);
run("clouds", [[0, "A cloud droplet dwarfs a wave of light"], [1, "Every colour scattered equally: white"], [2, "On Mars it's the other way round", -0.3], [3, "Fine dust: an orange daytime sky"], [4, "And a blue glow at sunset"]]);
cap("The sky has no colour of its own", at("outro", 0), at("outro", 1, -0.6));
cap("The blue that was scattered", at("outro", 1, 2.4), at("outro", 3, -0.6), "cap", "left:70px;top:70px;font-size:52px");
cap("The red that wasn't", at("outro", 2), at("outro", 3, -0.6), "cap", "left:1030px;top:70px;font-size:52px");
cap("Someone to the west gets your blue", at("outro", 3), at("outro", 4, -0.5));
cap("That's why it does that.", at("outro", 4, 0.1), TL.total, "endq");
cap("Why It Does That", at("outro", 4, 1.3), TL.total, "endb");
cap("Sources are in the description", at("outro", 4, 2.2), TL.total, "ends");

const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const clips = L.map((l, i) => `      <div id="c${i}" class="clip ${l.cls}" data-start="${l.from}" data-duration="${(l.to - l.from).toFixed(3)}" data-track-index="${2 + TL.scenes.findIndex(s => l.from < s.start + s.dur) * 2 + (l.cls === "cap" || l.cls === "q" ? 0 : 1)}"${l.style ? ` style="${l.style}"` : ""}>${esc(l.text)}</div>`).join("\n");
const anims = L.map((l, i) => {
  const end = l.to >= TL.total ? "" : `tl.to("#c${i}",{opacity:0,duration:0.25,ease:"power1.in"},${(l.to - 0.25).toFixed(3)});`;
  if (i === 0) return `tl.fromTo("#c0",{scale:0.94},{scale:1,duration:0.6,ease:"power3.out"},0);${end}`;   // the question is readable on the very first frame
  return `tl.fromTo("#c${i}",{opacity:0,y:26},{opacity:1,y:0,duration:0.4,ease:"power3.out"},${l.from});${end}`;
}).join("\n      ");

const D = TL.total;
fs.writeFileSync("index.html", `<!doctype html>
<!-- Generated by build.js from timeline.json. Edit build.js (captions) or core.js / scenes*.js (simulation), not this file. -->
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="./gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1920px; height: 1080px; overflow: hidden; background: #0a1020; }
      #root { position: relative; width: 1920px; height: 1080px; font-family: Inter, sans-serif; color: #f4f6ff; }
      canvas { position: absolute; inset: 0; }
      /* Rules from the episode 1 review: no text under 40 px, nothing in the bottom 15% (YouTube captions). */
      .cap, .sub, .q { position: absolute; left: 96px; white-space: nowrap; background: rgba(10, 16, 32, 0.80); border-radius: 20px; transform-origin: left center; }
      .cap { top: 64px; font-size: 60px; font-weight: 800; letter-spacing: -0.01em; padding: 10px 28px 12px; }
      .sub { top: 168px; font-size: 46px; font-weight: 600; color: #ffd166; padding: 8px 26px 10px; }
      .q { top: 60px; font-size: 104px; font-weight: 800; letter-spacing: -0.02em; padding: 8px 36px 14px; }
      .q2 { top: 212px; font-size: 76px; color: #ffb37a; }
      .endq { position: absolute; left: 640px; top: 250px; font-size: 104px; font-weight: 800; letter-spacing: -0.02em; white-space: nowrap; }
      .endb { position: absolute; left: 646px; top: 400px; font-size: 56px; font-weight: 700; color: #ffd166; white-space: nowrap; }
      .ends { position: absolute; left: 646px; top: 486px; font-size: 42px; font-weight: 500; color: #b8c4dc; white-space: nowrap; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${D}" data-width="1920" data-height="1080">
      <canvas id="sim" width="1920" height="1080" class="clip" data-start="0" data-duration="${D}" data-track-index="0" data-layout-allow-overflow></canvas>
      <audio id="narration" class="clip" src="./narration.wav" data-start="0" data-duration="${D}" data-track-index="1" data-volume="1"></audio>
${clips}
    </div>
    <script src="./timeline.js"></script>
    <script src="./core.js"></script>
    <script src="./scenesA.js"></script>
    <script src="./scenesB.js"></script>
    <script src="./scenesC.js"></script>
    <script>
      // The whole picture for global time T (seconds): find the scene, draw it, fade at scene edges.
      function renderFrame(T) {
        T = Math.max(0, Math.min(TL.total - 0.001, T));
        const sc = TL.scenes.find(s => T < s.start + s.dur) || TL.scenes[TL.scenes.length - 1], t = T - sc.start;
        const B = i => sc.beats[i].start, E = i => sc.beats[i].end;
        g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
        SCENES[sc.id](t, T, B, E, sc.dur);
        g.globalAlpha = 1; g.globalCompositeOperation = "source-over";
        const first = sc === TL.scenes[0], last = sc === TL.scenes[TL.scenes.length - 1];
        const f = Math.max(first ? 0 : 1 - t / 0.35, last ? 0 : 1 - (sc.dur - t) / 0.3);
        if (f > 0) { g.globalAlpha = Math.min(1, f); g.fillStyle = "#0a1020"; g.fillRect(0, 0, 1920, 1080); g.globalAlpha = 1; }
      }
      window.renderFrame = renderFrame;
      const clock = { t: 0 };
      const tl = gsap.timeline({ paused: true });
      tl.to(clock, { t: ${D}, duration: ${D}, ease: "none", onUpdate: () => renderFrame(clock.t) }, 0);
      ${anims}
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
      renderFrame(0); tl.seek(0);
    </script>
  </body>
</html>
`);
console.log("index.html written:", L.length, "captions,", D, "s");
