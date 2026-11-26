// On-screen text for ep64: one text layer. Burned-in kara captions carry the sentences (y 1400);
// the canvas draws only 1-2-word labels / numbers in one right-hand slot (y 300), one at a time (timetable in scenes.js).
// The end question is drawn on the canvas, so its caption is skipped.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  return { keys: ["pinch", "drops", "20", "not", "clock", "eye", "brain", "fingers", "faster", "03", "gone"], skip: ["end:0"] };
};
