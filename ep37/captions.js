// On-screen text for ep37 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("The water in this cloud weighs 500 tonnes", 0, at("gram", 0, -0.1), "q");
  cap("The water in this cloud weighs 500 tonnes", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["500", "0.5", "billion", "tiny,", "slowly,", "rising", "heavy,"], skip: ["hook:0"] };
};
