// Renders thumb.html to ../media/ep02-thumbnail.png (1280×720).   . ../tools/env.sh && node thumb.js
const puppeteer = require("puppeteer-core"), path = require("path");
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.HYPERFRAMES_BROWSER_PATH, args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const pg = await b.newPage(); await pg.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 / 3 });
  await pg.goto("file://" + path.resolve("thumb.html")); await pg.evaluate(() => Promise.all([document.fonts.load("800 40px Inter"), document.fonts.ready]));
  await pg.evaluate(() => window.renderThumb()); await pg.screenshot({ path: "../media/ep02-thumbnail.png", type: "png" }); await b.close(); console.log("thumbnail written");
})();
