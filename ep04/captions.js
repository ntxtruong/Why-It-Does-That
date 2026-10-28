// On-screen text layer for episode 4 (HTML clips). Numbers and labels the physics needs are drawn
// on the canvas in scenes.js; here only the opening question and the end card.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why do traffic jams appear out of nowhere?", 0, at("hook", 2, -0.3), "q", "font-size:78px");
  cap("So why do jams appear out of nowhere?", at("end", 0), at("end", 1, -0.4), "q", "font-size:70px");
  cap("That's why it does that.", at("end", 4, 0.1), TL.total, "endq");
  cap("Why It Does That", at("end", 4, 1.3), TL.total, "endb");
  cap("Sources are in the description", at("end", 4, 2.2), TL.total, "ends");
};
