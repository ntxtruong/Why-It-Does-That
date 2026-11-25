// On-screen text for ep54 (v5, Why Is It Designed Like That?): the dare in frame one, the one-word question at the end.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Count the corners on a plane window.", 0, at("stake", "start", -0.05), "q");
  cap("Window seat or aisle?", at("end", 0), TL.total, "q");
  return { keys: ["corners", "none.", "1954,", "breaking", "balloon,", "sharp", "corner,", "piles", "crack", "burst.", "round", "smoothly"], skip: ["end:0"] };
};
