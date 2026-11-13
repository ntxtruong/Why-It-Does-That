// On-screen text for episode 29 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("You've never seen your own eyes move", 0, at("mirror", 0, -0.1), "q");
  cap("You've never seen your own eyes move", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["never", "move.", "jump,", "blur", "stitches", "late.", "moving.", "mirror", "left", "right."], skip: ["hook:0"] };
};
