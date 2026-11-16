// Whether an open filter sheet shows on the way back to the checklist: Red Dead at phone size in Chrome (and WebKit), the Filters sheet
// opened, Back to the Progress page, Forward again; then, frame by frame for half a second from the first frame that shows the
// checklist, whether a dialog is drawn (in the page and not fully transparent) and where the focus is. It serves the checkout's built
// Red Dead (`vite build` in apps/rdr first).
//   node .claude/skills/guide-check/scripts/sheet-probe.mjs <checkout>
import { spawn } from "node:child_process";
import { chromium, webkit } from "playwright-core";
const [root] = process.argv.slice(2);
const port = 4995;
const server = spawn("pnpm", ["-C", "apps/rdr", "exec", "vite", "preview", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore", detached: true });
await new Promise((r) => setTimeout(r, 2500));
try {
// (Chrome twice: as an Android phone, where Base UI also arms the browser's CloseWatcher on the open sheet, and with a desktop's agent)
for (const [name, engine, mobile] of [["chromium android", chromium, true], ["chromium", chromium, false], ["webkit", webkit, false]]) {
  const browser = await engine.launch(engine === chromium ? { channel: "chrome" } : {});
  const context = await browser.newContext({ viewport: { width: 375, height: 812 }, hasTouch: true, ...(mobile ? { isMobile: true } : {}), serviceWorkers: "block" });
  await context.addInitScript(() => {
    localStorage.setItem("red-dead-field-guide.v1", JSON.stringify({ version: 3, guide: "red-dead-redemption", checks: {}, ceiling: 1, spoilers: false, chapter: 1 }));
    Object.defineProperty(Navigator.prototype, "standalone", { get: () => true });
  });
  const page = await context.newPage();
  await page.goto(`http://localhost:${port}/dashboard`, { waitUntil: "networkidle" });
  await page.locator('nav[aria-label="Main navigation"] a', { hasText: "Checklist" }).click();
  await page.getByRole("button", { name: "Filters" }).click();
  await page.getByRole("dialog", { name: "Filters" }).waitFor();
  await page.waitForTimeout(500);
  await page.evaluate(() => history.back());
  await page.getByRole("heading", { name: "Your progress" }).waitFor();
  const frames = await page.evaluate(async () => {
    const shown = () => [...document.querySelectorAll("main h1")].some((h1) => !h1.closest('[style*="display: none"]') && h1.textContent.includes("Completion checklist"));
    history.forward();
    for (const end = performance.now() + 5000; !shown(); await new Promise((r) => requestAnimationFrame(r)))
      if (performance.now() > end) throw new Error("the checklist never came back");
    const out = [];
    const start = performance.now();
    while (performance.now() - start < 500) {
      const dialog = document.querySelector('[role="dialog"]');
      const drawn = dialog && dialog.getBoundingClientRect().height > 0 && getComputedStyle(dialog).opacity !== "0" && !dialog.closest('[style*="display: none"]');
      out.push({ t: Math.round(performance.now() - start), dialog: Boolean(drawn), focus: document.activeElement?.id || document.activeElement?.tagName });
      await new Promise((r) => requestAnimationFrame(r));
    }
    return out;
  });
  const drawn = frames.filter((f) => f.dialog);
  console.log(`${name}: ${frames.length} frames, sheet drawn in ${drawn.length}${drawn.length ? ` (${drawn[0].t}–${drawn.at(-1).t} ms)` : ""}; focus first ${frames[0].focus}, last ${frames.at(-1).focus}`);
  await browser.close();
}
} finally {
  process.kill(-server.pid, "SIGTERM");
}
