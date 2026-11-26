// On-screen text for ep33 (Short v3): the claim in frame one and in the last 1.1 s (loop).
module.exports = ({ TL, SC, at, frac, cap, run }) => {
  cap("Every banana is a little radioactive", 0, at("k40", 0, -0.1), "q");
  cap("Every banana is a little radioactive", +(TL.total - 1.1).toFixed(3), TL.total, "q");
  return { keys: ["potassium,", "radioactive.", "ten", "hundreds", "flushes", "you're", "more"], skip: ["hook:0"] };
};
