// On-screen text for episode 20 (Short): the question at the start and in the last second (loop); burned-in phrase captions from build.js.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does cutting an onion make you cry?", 0, at("hook", 1, -0.1), "q");
  cap("Why does cutting an onion make you cry?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["cut", "apart", "mix", "gas", "nerves", "tears", "chill", "slowly", "enzyme", "trap"], skip: ["hook:0"] };
};
