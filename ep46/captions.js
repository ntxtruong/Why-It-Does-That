// On-screen text for ep46 (Short v4): the dare in frame one and again on the loop.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Try to snap it in two", 0, at("fail", "start", -0.1), "q");
  cap("Try to snap it in two", at("end", "start"), TL.total, "q");
  return { keys: ["three", "slow", "wave", "again.", "twist", "two.", "turn"], skip: ["hook:0"] };
};
