// On-screen text layer for episode 5: the opening question and the end card (labels are on the canvas).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("How can headphones cancel noise with more noise?", 0, at("hook", 1, 2.0), "q", "font-size:72px");
  cap("So how do they cancel noise with noise?", at("end", 0), at("end", 1, -0.4), "q", "font-size:70px");
  cap("That's why it does that.", at("end", 4, 0.1), TL.total, "endq");
  cap("Why It Does That", at("end", 4, 1.3), TL.total, "endb");
  cap("Sources are in the description", at("end", 4, 2.2), TL.total, "ends");
};
