// Renders channel.html to channel-banner.png (2560×1440) and channel-avatar.png (800×800).   . ../tools/env.sh && node channel.js
const puppeteer = require("puppeteer-core"), path = require("path");
(async () => {
  const b = await puppeteer.launch({ executablePath: process.env.HYPERFRAMES_BROWSER_PATH, args: ["--no-sandbox", "--allow-file-access-from-files"] });
  const pg = await b.newPage(); await pg.goto("file://" + path.resolve("channel.html")); await pg.evaluate(() => Promise.all([document.fonts.load("800 40px Inter"), document.fonts.ready]));
  await pg.setViewport({ width: 2560, height: 1440 }); await pg.evaluate(() => window.renderBanner()); await pg.screenshot({ path: "channel-banner.png", clip: { x: 0, y: 0, width: 2560, height: 1440 } });
  await pg.setViewport({ width: 800, height: 800 }); await pg.evaluate(() => window.renderAvatar()); await pg.screenshot({ path: "channel-avatar.png", clip: { x: 0, y: 0, width: 800, height: 800 } });
  await b.close(); console.log("channel art written");
})();
