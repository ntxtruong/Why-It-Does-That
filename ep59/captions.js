// On-screen text for ep59 (v5, Animals Explained): the weird fact in frame one, the one-word question at the end.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Upside down. Nothing to push on.", 0, at("guess", "start", -0.05), "q");
  cap("Seen your cat do this?", at("end", 0), TL.total, "q");
  return { keys: ["upside", "nothing", "1894,", "cheated,", "bends", "middle,", "tucked", "spins", "swaps,", "feet", "low,", "time", "seen"], skip: ["end:0"] };
};
