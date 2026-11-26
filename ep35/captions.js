// On-screen text for ep35 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("You're taller in the morning", 0, at("discs", 0, -0.1), "q");
  cap("You're taller in the morning", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["discs,", "water.", "centimetre", "soak", "three", "3", "breakfast."], skip: ["hook:0"] };
};
