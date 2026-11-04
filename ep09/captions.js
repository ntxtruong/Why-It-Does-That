// On-screen text layer for episode 9 (Short): the question at the start and again at the end (loop). Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why is the middle still cold?", 0, at("myth", 0, -0.1), "q");
  cap("Why is the middle still cold?", at("end", 0, 0.6), TL.total, "q");
};
