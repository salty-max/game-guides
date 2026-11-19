// What makes revealing a kept page slow in WebKit: Red Dead's Checklist shown again from the Guide, in Playwright's WebKit at phone size in
// the app's frame, timed from the click to two frames after the page commits, with one suspect taken away at a time:
//   none      as built,
//   has       every style rule with :has( removed from the stylesheets,
//   inputs    every row's hidden checkbox input removed from the page (Base UI's stand-in input),
//   moving    no CSS transitions anywhere (the press feedback's),
//   overlays  no label overlay (the pseudo-element that stretches a row's label over the row),
//   shadows   no box shadows (the press feedback's inset ones),
//   rows      each checklist row `content-visibility: auto`, so rows off screen skip layout and paint (what it would buy),
// Prints the median of 8 reveals for each.
//   node .claude/skills/guide-check/scripts/reveal-probe.mjs <checkout> [suspects,…]
import { spawn } from "node:child_process";
import { webkit } from "playwright-core";
import { queueSelf } from "../../../../tools/queued.mjs";

// (a heavy browser job: it takes its turn in the machine's queue and runs in the background, see tools/queued.mjs)
await queueSelf("reveal-probe");

const [root, list = "none,has,inputs,moving,overlays,shadows,rows"] = process.argv.slice(2);
const port = 4993;
const server = spawn("pnpm", ["-C", "apps/rdr", "exec", "vite", "preview", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore", detached: true });
await new Promise((r) => setTimeout(r, 2500));
const browser = await webkit.launch();
for (const suspect of list.split(",")) {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 3, hasTouch: true, serviceWorkers: "block" });
  await context.addInitScript(() => {
    localStorage.setItem("red-dead-field-guide.v1", JSON.stringify({ version: 3, guide: "red-dead-redemption", checks: {}, ceiling: 1, spoilers: false, chapter: 1 }));
    Object.defineProperty(Navigator.prototype, "standalone", { get: () => true });
  });
  const page = await context.newPage();
  await page.goto(`http://localhost:${port}/guide/1`, { waitUntil: "networkidle" });
  const tab = (name) => page.evaluate(async (name) => {
    const link = [...document.querySelectorAll('nav[aria-label="Main navigation"] a')].find((a) => a.textContent.includes(name));
    const heading = () => [...document.querySelectorAll("main h1")].find((h1) => !h1.closest('[style*="display: none"]'))?.textContent;
    const before = heading();
    const t0 = performance.now();
    link.click();
    while (heading() === before) await new Promise((r) => setTimeout(r, 0));
    const commit = performance.now() - t0;
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    return { commit, painted: performance.now() - t0 };
  }, name);
  await tab("Checklist");
  await tab("Guide");
  await page.evaluate((suspect) => {
    if (suspect === "has")
      for (const sheet of document.styleSheets) {
        const strip = (rules) => { for (let i = rules.length - 1; i >= 0; i--) { const rule = rules[i]; if (rule.cssRules) strip(rule.cssRules); if (rule.selectorText?.includes(":has(")) rule.parentRule ? rule.parentRule.deleteRule(i) : rule.parentStyleSheet.deleteRule(i); } };
        strip(sheet.cssRules);
      }
    const css = {
      moving: "*, *::before, *::after { transition: none !important }",
      overlays: "label::after { content: none !important }",
      shadows: "*, *::before, *::after { box-shadow: none !important }",
      rows: "#checklist-results .scroll-mt-4 { content-visibility: auto; contain-intrinsic-size: auto 110px }",
    }[suspect];
    if (css) document.head.append(Object.assign(document.createElement("style"), { textContent: css }));
    if (suspect === "inputs") document.querySelectorAll('main input[type="checkbox"]').forEach((input) => input.remove());
  }, suspect);
  const times = [];
  for (let i = 0; i < 8; i++) {
    times.push(await tab("Checklist"));
    await page.waitForTimeout(300);
    await tab("Guide");
    await page.waitForTimeout(300);
  }
  const med = (k) => times.map((t) => t[k]).sort((a, b) => a - b)[4].toFixed(0);
  console.log(`${suspect}: commit ${med("commit")} ms, painted ${med("painted")} ms`);
  await context.close();
}
await browser.close();
process.kill(-server.pid, "SIGTERM");
