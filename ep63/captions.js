// On-screen text for ep63: one text layer. Burned-in kara captions carry the sentences (y ≈ 1400);
// the canvas draws only 1–2-word labels (title slot y 170, side slot x 150 when two eggs are stacked).
// The end question is drawn on the canvas, so its caption is skipped.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  return { keys: ["why", "sloppy", "boiled", "still", "inside", "shell", "swirling", "drags", "solid", "once"], skip: ["end:0"], loop: 0.45 };
};
