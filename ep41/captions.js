// On-screen text layer for episode 41: the opening question, a re-ask before the payoff, and the end card. Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does metal feel colder than wood?", 0, at("hook", 1, -0.2), "q", "font-size:76px");
  cap("So what does your hand measure?", at("payoff", 0), at("payoff", 1, -0.3), "q", "font-size:76px");
  cap("That's why it does that.", at("payoff", 4, 0.6), TL.total, "endq");
  cap("Why It Does That", at("payoff", 4, 1.6), TL.total, "endb");
  cap("Sources are in the description", at("payoff", 4, 2.4), TL.total, "ends");
};
