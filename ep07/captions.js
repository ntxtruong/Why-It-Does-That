// On-screen text layer for episode 7: the opening question and the end card. Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why do your fingers wrinkle in water?", 0, at("hook", 1, 1.5), "q", "font-size:84px");
  cap("So why do your fingers wrinkle?", at("payoff", 0), at("payoff", 1, -0.4), "q", "font-size:80px");
  cap("That's why it does that.", at("payoff", 5, 0.1), TL.total, "endq");
  cap("Why It Does That", at("payoff", 5, 1.3), TL.total, "endb");
  cap("Sources are in the description", at("payoff", 5, 2.2), TL.total, "ends");
};
