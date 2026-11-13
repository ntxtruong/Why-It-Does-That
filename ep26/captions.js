// On-screen text for episode 26 (Short): the question at the start and in the last 1.1 s (loop); burned-in phrase captions from build.js.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does your phone go dark through sunglasses?", 0, at("hook", 1, -0.1), "q");
  cap("Why does your phone go dark through sunglasses?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["tilt", "wave", "one", "filter", "up-and-down", "glare", "line", "cross", "quarter", "nothing", "blocked", "never"], skip: ["hook:0"] };
};
