// On-screen text layer for episode 14 (Short): the question at the start and again in the last second (loop). Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("How can headphones make silence by adding sound?", 0, at("wave", 0, -0.1), "q");
  cap("How can headphones make silence by adding sound?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
};
