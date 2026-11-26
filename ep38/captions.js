// On-screen text for ep38 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("There's a hole in what you see", 0, at("nerve", 0, -0.1), "q");
  cap("There's a hole in what you see", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["no", "fills", "left", "cross.", "vanishes.", "hole."], skip: ["hook:0"] };
};
