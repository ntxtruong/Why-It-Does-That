// On-screen text for episode 31 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Metal isn't colder than wood", 0, at("same", 0, -0.1), "q");
  cap("Metal isn't colder than wood", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["same", "warmer,", "34", "thousand", "1,000", "faster,", "more,", "cold.", "speed."], skip: ["hook:0"] };
};
