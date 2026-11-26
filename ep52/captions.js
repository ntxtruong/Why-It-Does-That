// On-screen text for ep52 (Short v4): the dare in frame one and again on the loop.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Make a floating finger", 0, at("look", "start", -0.05), "q");
  cap("Make a floating finger", at("end", 0, 2.6), TL.total, "q");
  return { keys: ["fingertips,", "past", "far", "floating", "floats.", "both", "overlap,", "gone."], skip: [] };
};
