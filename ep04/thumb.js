// Renders thumb.html variants 1–3 to ../media/<ep>-thumb-<v>.png (1280×720).   . ../tools/env.sh && node thumb.js ep04
const puppeteer = require("puppeteer-core"), path = require("path"), ep = process.argv[2];
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.HYPERFRAMES_BROWSER_PATH, args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const pg = await b.newPage(); await pg.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 / 3 });
  await pg.goto("file://" + path.resolve("thumb.html")); await pg.evaluate(() => Promise.all([document.fonts.load("800 40px Inter"), document.fonts.ready]));
  for (const v of [1, 2, 3]) { await pg.evaluate(v => window.renderThumb(v), v); await pg.screenshot({ path: `../media/${ep}-thumb-${v}.png`, type: "png" }); }
  await b.close(); console.log("thumbnails written");
})();
