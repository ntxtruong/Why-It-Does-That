// On-screen text for ep39 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Every popcorn kernel is a tiny pressure cooker", 0, at("water", 0, -0.1), "q");
  cap("Every popcorn kernel is a tiny pressure cooker", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["water,", "180", "10", "bursts,", "foam.", "steam"], skip: ["hook:0"] };
};
