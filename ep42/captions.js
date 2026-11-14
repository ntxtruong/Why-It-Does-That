// On-screen text layer for episode 42: the opening question, a re-ask, and the end card. Labels are on the canvas.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why don't you see the hole in your vision?", 0, at("hook", 1, -0.2), "q", "font-size:72px");
  cap("Why don't you see the hole in your vision?", at("hook", 4, -0.1), at("retina", 0, -0.2), "q", "font-size:72px");
  cap("So why don't you see the hole?", at("two", 0), at("two", 1, -0.3), "q", "font-size:76px");
  cap("That's why it does that.", at("payoff", 3, 1.0), TL.total, "endq");
  cap("Why It Does That", at("payoff", 3, 2.0), TL.total, "endb");
  cap("Sources are in the description", at("payoff", 3, 2.8), TL.total, "ends");
};
