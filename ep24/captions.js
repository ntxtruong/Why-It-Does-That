// On-screen text for episode 24 (Short): the question at the start and in the last ~1.1 s (loop); burned-in phrase captions from build.js.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why do soda bubbles rise from the same spots?", 0, at("hook", 1, -0.1), "q");
  cap("Why do soda bubbles rise from the same spots?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["lint", "carbon", "pressure", "hard", "surface", "squeezes", "head", "fibres", "again", "drink"], skip: ["hook:0"] };
};
