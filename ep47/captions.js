// On-screen text for ep47 (Short v4): the dare in frame one and again on the loop.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Lift ice with a thread", 0, at("salt", 0, -0.05), "q");
  cap("Lift ice with a thread", at("end", "start"), TL.total, "q");
  return { keys: ["salt", "pull.", "knot,", "glue.", "melts", "heat", "colder", "zero.", "freezes", "inside."], skip: ["hook:0"] };
};
