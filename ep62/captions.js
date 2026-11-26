// On-screen text for ep62: one text layer. Burned-in kara captions carry the sentences (y ≈ 1392);
// the canvas draws only 1–2-word labels (top slot or inside the ring's hole), one at a time (timetable in scenes.js).
// The end question is drawn on the canvas, so its caption is skipped.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  return { keys: ["half-twist", "cut", "two", "nope.", "one", "long", "twist", "other", "twice", "third", "linked."], skip: ["end:0"] };
};
