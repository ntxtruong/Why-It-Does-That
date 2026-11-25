// On-screen text for ep51 (Short v4): the instruction in frame one and again on the loop.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Pinch your nose and hum", 0, at("try", 0, -0.05), "q");
  cap("Pinch your nose and hum", at("end", "start", 1.7), TL.total, "q");
  return { keys: ["pinch", "hum.", "stops.", "gone.", "nose.", "piles", "pressure", "lungs.", "vibrating.", "again."], skip: ["hook:0"] };
};
