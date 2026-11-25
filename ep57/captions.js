// On-screen text for ep57 (v5 Kitchen Science): DO/WEIRD line in frame one, the one-word question at the end.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Watch what this spoon does", 0, at("guess", "start", -0.05), "q");
  cap("Have you tried it?", at("end", 0), TL.total, "q");
  return { keys: ["boil", "spoon", "foam", "pushing", "bubbles", "dry,", "cooler", "bursts.", "starch", "skin,", "tower", "neighbours.", "hot", "soaked,", "over."], skip: ["end:0"] };
};
