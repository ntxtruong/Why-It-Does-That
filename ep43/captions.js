// On-screen text for ep43 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Your phone sees light your eyes can't", 0, at("try", 0, -0.1), "q");
  cap("Your phone sees light your eyes can't", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["infrared", "red.", "sensor", "selfie", "bluetooth", "glowing"], skip: ["hook:0"] };
};
