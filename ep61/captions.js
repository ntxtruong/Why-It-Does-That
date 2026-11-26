// On-screen text for ep61: one text layer. Burned-in kara captions carry the sentences (top of the lower band, y ≈ 1390);
// the canvas draws only 1–2-word labels in one title slot (y 150), one at a time (timetable in scenes.js).
// The end question is drawn on the canvas, so its caption is skipped.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  return { keys: ["cross", "rub", "two?", "not", "brain", "uncrossed.", "outer", "two", "noses.", "aristotle"], skip: ["end:0"] };
};
