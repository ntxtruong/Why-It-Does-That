// On-screen text for ep48 (Short v4): the dare in frame one and again on the loop.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Film your lights in slow-mo", 0, at("reveal", "start", -0.1), "q");
  cap("Film your lights in slow-mo", at("end", "end", -1.3), TL.total, "q");
  return { keys: ["pulsing,", "100", "120", "twice", "steady", "dips.", "cheap", "dimmed"], skip: ["hook:0"] };
};
