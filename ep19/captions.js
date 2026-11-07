// On-screen text for episode 19 (Short): the question at the start and in the last second (loop), plus the
// burned-in phrase captions built by build.js (keys = words shown in gold; skip = beats already on screen as the question).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why is the sky blue, but sunsets red?", 0, at("hook", 1, -0.1), "q");
  cap("Why is the sky blue, but sunsets red?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["blue", "red", "six", "38", "thousandth", "quarter", "west", "path", "sideways"], skip: ["hook:0"] };
};
