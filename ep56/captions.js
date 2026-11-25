// On-screen text for ep56 (v5, Why Is It Designed Like That?): the dare in frame one, the one-word question at the end.
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Look at your pen cap.", 0, at("guess", "start", -0.05), "q");
  cap("Cap chewer: yes or no?", at("end", 0), TL.total, "q");
  return { keys: ["hole?", "ink.", "breathed", "windpipe,", "air", "doctor", "eight", "litres", "big"], skip: ["end:0"] };
};
