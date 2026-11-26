// On-screen text for ep55 (v5, Animals Explained): the weird result in frame one, the one-word question at the end,
// and the frame-one text again for the last 0.5 s so the loop seam matches.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Cat eyes glow. Yours don't.", 0, at("guess", "start", -0.05), "q");
  cap("Green or gold?", at("end", 0), +(TL.total - 0.5).toFixed(3), "q");
  cap("Cat eyes glow. Yours don't.", +(TL.total - 0.5).toFixed(3), TL.total, "q");
  return { keys: ["light", "glow", "don't.", "bounce", "mirror", "tapetum", "lucidum.", "second", "chance.", "escapes,", "sixth", "blurrier"], skip: ["end:0"] };
};
