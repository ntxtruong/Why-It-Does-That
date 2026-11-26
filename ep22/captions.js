// On-screen text for episode 22 (Short): the question at the start and in the last 1.1 s (loop); burned-in phrase captions from build.js.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does a spoon look broken in water?", 0, at("hook", 1, -0.1), "q");
  cap("Why does a spoon look broken in water?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["broken", "straight", "quarter", "slower", "bends", "flatter", "higher", "lifted", "snap", "light"], skip: ["hook:0"] };
};
