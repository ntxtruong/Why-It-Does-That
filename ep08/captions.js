// On-screen text layer for episode 8: the opening question and the end card. Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why is the middle of your leftovers still cold?", 0, at("hook", 1, 1.0), "q", "font-size:76px");
  cap("So why is the middle still cold?", at("payoff", 0), at("payoff", 1, -0.4), "q", "font-size:80px");
  cap("That's why it does that.", at("payoff", 4, 0.1), TL.total, "endq");
  cap("Why It Does That", at("payoff", 4, 1.3), TL.total, "endb");
  cap("Sources are in the description", at("payoff", 4, 2.2), TL.total, "ends");
};
