// On-screen text for ep58 (round 3): no HTML title cards at all. The hook text, "Now: the clock!" and the end question
// are drawn on the canvas (scenes.js) so they can change exactly on the spoken word and stay off the clock;
// the hook beat has no burned-in caption, so the 3 s after the jump are clean (only the second hand moves).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  return { keys: ["dot.", "jump", "clock.", "hang.", "lag.", "switches", "off", "blurry", "fills", "gap", "borrowed", "first", "half", "three"], skip: ["hook:0", "end:0"] };
};
