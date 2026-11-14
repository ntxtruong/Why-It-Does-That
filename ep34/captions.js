// On-screen text for ep34 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Old windows aren't melting", 0, at("myth", 0, -0.1), "q");
  cap("Old windows aren't melting", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["thicker", "flows.", "universe", "uneven.", "thick", "uneven"], skip: ["hook:0"] };
};
