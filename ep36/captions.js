// On-screen text for ep36 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("A sausage can work your touchscreen", 0, at("field", 0, -0.1), "q");
  cap("A sausage can work your touchscreen", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["pressure.", "electric", "conducts,", "sausage,", "conduct,", "electricity,"], skip: ["hook:0"] };
};
