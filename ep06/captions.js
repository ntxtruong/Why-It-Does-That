// On-screen text layer for episode 6 (Short): the opening question and the closing question. Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why do water drops dance on a hot pan?", 0, at("hook", 1, -0.1), "q");
  cap("What else could float on its own steam?", at("end", 2, -0.3), TL.total, "q");
};
