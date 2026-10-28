// On-screen text layer for episode 3: the opening question and the end card (labels are on the canvas).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Why do wheels spin backwards on camera?", 0, at("hook", 1, 2.5), "q", "font-size:80px");
  cap("So why do wheels spin backwards on camera?", at("end", 0), at("end", 1, -0.4), "q", "font-size:70px");
  cap("That's why it does that.", at("end", 3, 0.1), TL.total, "endq");
  cap("Why It Does That", at("end", 3, 1.3), TL.total, "endb");
  cap("Sources are in the description", at("end", 3, 2.2), TL.total, "ends");
};
