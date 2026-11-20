// On-screen text layer for episode 50: the opening question, a re-ask before the payoff, and the end card. Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why do lights flicker on camera?", 0, at("hook", 2, -0.2), "q", "font-size:76px");
  cap("That's why it does that.", at("payoff", 2, 2.6), TL.total, "endq");
  cap("Why It Does That", at("payoff", 2, 3.6), TL.total, "endb");
  cap("Sources are in the description", at("payoff", 2, 4.4), TL.total, "ends");
};
