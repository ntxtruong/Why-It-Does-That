// On-screen text for episode 28 (Short v3): the claim (not a question) in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Earth is closest to the Sun in January", 0, at("hook", 1, -0.1), "q");
  cap("Earth is closest to the Sun in January", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["closest", "january.", "january", "july.", "147", "152", "cold", "tilted.", "away,", "low", "weak,", "spread", "distance"], skip: ["hook:0"] };
};
