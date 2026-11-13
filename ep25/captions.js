// On-screen text for episode 25 (Short): the question at the start and in the last 1.1 s (loop); burned-in phrase captions from build.js.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does toast land butter-side down?", 0, at("hook", 1, -0.1), "q");
  cap("Why does toast land butter-side down?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["table", "height", "spin", "half", "pivots", "short", "down", "up", "full", "luck", "weight"], skip: ["hook:0"] };
};
