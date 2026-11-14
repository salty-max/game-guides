// Puts two shoot.mjs folders side by side in one page: before on the left, after on the right, one row per shot.
// Open the page in a browser, or screenshot it whole with page.mjs.
//
//   node .claude/skills/guide-check/scripts/compare.mjs <before-dir> <after-dir> <out.html>
import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

const [before, after, out] = process.argv.slice(2).map((path) => path && resolve(path));
if (!out) {
  console.error("usage: compare.mjs <before-dir> <after-dir> <out.html>");
  process.exit(2);
}
// (a missing folder counts as empty: a new guide or a new page has no "before")
const pngs = (dir) => (existsSync(dir) ? readdirSync(dir).filter((file) => file.endsWith(".png")) : []);
const shots = [...new Set([...pngs(before), ...pngs(after)])].sort();
const cell = (dir, file) => (existsSync(`${dir}/${file}`) ? `<img src="${relative(dirname(out), `${dir}/${file}`)}" alt="" loading="lazy">` : `<p>none</p>`);
const html = `<!doctype html>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Before and after</title>
<style>
  body{margin:0;padding:16px;background:#f2f2f0;color:#1d1d1f;font:14px/1.4 system-ui,sans-serif}
  h1{font-size:20px;margin:0 0 12px} h2{font-size:14px;margin:24px 0 6px}
  .pair{display:grid;grid-template-columns:1fr 1fr;gap:12px;align-items:start}
  .pair p{margin:0 0 4px;color:#5d5d63} img{display:block;max-width:100%;border:1px solid #d8d8d4}
</style>
<h1>Before (left) and after (right)</h1>
${shots.map((file) => `<h2>${file}</h2>\n<div class="pair"><div><p>before</p>${cell(before, file)}</div><div><p>after</p>${cell(after, file)}</div></div>`).join("\n")}
`;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, html);
console.log(`${shots.length} shots compared in ${out}`);
