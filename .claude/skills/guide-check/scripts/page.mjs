// Screenshots one page whole with the system Chrome, such as the page compare.mjs writes.
//
//   node .claude/skills/guide-check/scripts/page.mjs <url> <out.png> [width]
import { chromium } from "playwright-core";

const [url, out, width = "1360"] = process.argv.slice(2);
if (!out) {
  console.error("usage: page.mjs <url> <out.png> [width]");
  process.exit(2);
}
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: Number(width), height: 900 } });
await page.goto(url, { waitUntil: "networkidle" });
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: out, fullPage: true });
await browser.close();
