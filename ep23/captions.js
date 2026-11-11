// On-screen text for episode 23 (Short): the question at the start and in the last 1.1 s (loop); burned-in phrase captions from build.js.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does a spinning coin speed up before it stops?", 0, at("hook", 1, -0.1), "q");
  cap("Why does a spinning coin speed up before it stops?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["faster", "silence", "barely", "touches", "leans", "lower", "races", "tap", "tens", "energy"], skip: ["hook:0"] };
};
