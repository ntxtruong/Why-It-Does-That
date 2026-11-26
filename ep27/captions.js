// On-screen text for episode 27 (Short): the question at the start and in the last 1.1 s (loop); burned-in phrase captions from build.js.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does mint feel cold?", 0, at("hook", 1, -0.1), "q");
  cap("Why does mint feel cold?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["cold", "sensor", "gate", "menthol", "warmer", "fires", "icy", "primed", "chili", "burning-heat", "alarm", "isn't"], skip: ["hook:0"] };
};
