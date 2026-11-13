// On-screen text for episode 30 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("There's no blue pigment in blue eyes", 0, at("pigment", 0, -0.1), "q");
  cap("There's no blue pigment in blue eyes", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["melanin.", "brown", "none", "scatter", "blue", "green.", "brown.", "sky", "absorbs", "soaks"], skip: ["hook:0"] };
};
