// On-screen text layer for episode 10 (Short): the question at the start and again at the end (loop). Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why do traffic jams appear from nowhere?", 0, at("ring", 0, -0.1), "q");
  cap("Why do traffic jams appear from nowhere?", at("wave", 1, 1.8), TL.total, "q");
};
