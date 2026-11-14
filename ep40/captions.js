// On-screen text for ep40 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("That's not the ocean in a seashell", 0, at("room", 0, -0.1), "q");
  cap("That's not the ocean in a seashell", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["noise", "louder,", "louder.", "quiet", "hush.", "cup"], skip: ["hook:0"] };
};
