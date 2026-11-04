// On-screen text layer for episode 12 (Short): the question at the start and again at the end (loop). Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does ice float?", 0, at("liquid", 0, -0.1), "q");
  cap("Why does ice float?", at("end", 1, 0.9), TL.total, "q");
};
