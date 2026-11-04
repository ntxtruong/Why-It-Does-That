// On-screen text layer for episode 11 (Short): the question at the start and again at the end (loop). Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why do wheels spin backwards on camera?", 0, at("frames", 0, -0.1), "q");
  cap("Why do wheels spin backwards on camera?", at("end", 1, 3.6), TL.total, "q");
};
