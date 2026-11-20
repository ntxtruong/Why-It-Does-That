// On-screen text for ep45 (Short v4): the instruction in frame one and again on the loop.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Stare at the dot. Keep your eyes still.", 0, at("now", "start"), "q");
  cap("What colour is it?", at("now", "start"), at("why", "start", -0.1), "q");
  cap("Stare at the dot. Keep your eyes still.", at("end", "start"), TL.total, "q");
  return { keys: ["yellow", "blue", "white", "blue.", "staring", "again."], skip: ["stare:0", "stare:1", "stare:2", "stare:3", "now:0", "end:0"] };
};
