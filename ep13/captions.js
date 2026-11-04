// On-screen text layer for episode 13 (Short): the question at the start and again at the end (loop). Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does the Moon look huge on the horizon?", 0, at("measure", 0, -0.1), "q");
  cap("Why does the Moon look huge on the horizon?", at("end", 1, 1.2), TL.total, "q");
};
