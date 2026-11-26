// On-screen text for ep44 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("The cloud in ice is mostly trapped air", 0, at("dissolved", 0, -0.1), "q");
  cap("The cloud in ice is mostly trapped air", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["dissolved", "outside", "middle.", "middle,", "bubbles", "one", "clear."], skip: ["hook:0"] };
};
