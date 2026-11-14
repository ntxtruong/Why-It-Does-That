// On-screen text for episode 32 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("You can't really tickle yourself", 0, at("predict", 0, -0.1), "q");
  cap("You can't really tickle yourself", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["predicts", "down,", "fades.", "robot", "delay", "fifth", "more.", "sees"], skip: ["hook:0"] };
};
