// On-screen text for ep60 (v5 Your Body, Explained): the weird result in frame one, the one-word question at the end.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Cold mouth. Why the forehead?", 0, at("guess", "start", -0.05), "q");
  cap("Fast eater or slow?", at("end", 0), TL.total, "q");
  return { keys: ["forehead", "hurt?", "not", "roof", "clamp", "flood", "nerve", "forehead,", "wrong", "doubled", "tongue", "warm"], skip: ["end:0"] };
};
