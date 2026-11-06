// On-screen text layer for episode 15 (Short): the question at the start and again in the last second (loop). Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why do only your fingers and toes wrinkle in water?", 0, at("clue", 0, -0.1), "q");
  cap("Why do only your fingers and toes wrinkle in water?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
};
