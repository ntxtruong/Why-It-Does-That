// On-screen text for episode 21 (Short): the question at the start and in the last second (loop); burned-in phrase captions from build.js.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does a cold can sweat?", 0, at("hook", 1, -0.1), "q");
  cap("Why does a cold can sweat?", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["sealed", "vapour", "25", "grams", "cold", "six", "liquid", "dew", "fog", "air"], skip: ["hook:0"] };
};
