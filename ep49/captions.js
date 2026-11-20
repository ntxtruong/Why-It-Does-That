// On-screen text layer for episode 49: the opening question, a re-ask before the payoff, and the end card. Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why does salt melt ice?", 0, at("hook", 2, -0.2), "q", "font-size:76px");
  cap("So what does salt really do?", at("payoff", 0), at("payoff", 1, -0.3), "q", "font-size:72px; white-space:normal; width:500px; left:60px; top:110px");
  cap("That's why it does that.", at("payoff", 2, 3.0), TL.total, "endq");
  cap("Why It Does That", at("payoff", 2, 4.0), TL.total, "endb");
  cap("Sources are in the description", at("payoff", 2, 4.8), TL.total, "ends");
};
