// On-screen text layer for episode 18 (Short): the question at the start and again in the last second (loop). Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why are floating bubbles always round?", 0, at("film", 0, -0.1), "q");
  cap("Why are floating bubbles always round?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
};
