// On-screen text for ep53 (v5 Kitchen Science): the weird result in frame one, the one-word question at the end.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Same apple. Only one half goes brown.", 0, at("guess", "start", -0.05), "q");
  cap("Would you still eat it?", at("end", 0), TL.total, "q");
  return { keys: ["brown?", "rot.", "itself.", "bursts", "enzyme", "polyphenols.", "oxygen,", "quinones", "brown", "lemon", "acid", "vitamin"], skip: ["end:0"] };
};
