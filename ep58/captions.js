// On-screen text for ep58 (v5, Your Brain Is Tricking You): the dare in frame one, the one-word question at the end,
// and the frame-one text again for the last 0.5 s so the loop seam matches.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Stare at the pink dot.", 0, at("guess", "start", -0.05), "q");
  cap("Did your clock freeze?", at("end", 0), +(TL.total - 0.5).toFixed(3), "q");
  cap("Stare at the pink dot.", +(TL.total - 0.5).toFixed(3), TL.total, "q");
  return { keys: ["dot.", "jump", "clock.", "hang.", "lag.", "switches", "off", "blurry", "fills", "gap", "borrowed", "first", "half", "three"], skip: ["end:0"] };
};
