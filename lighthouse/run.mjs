// Runs Lighthouse, through Lighthouse CI, on each guide's production build served by `vite preview`, as the pull request's lighthouse
// job does: `pnpm lighthouse [koholint,rdr]`, with `--no-build` to audit the dist already there. Each guide's pages are audited three
// times on a phone (Lighthouse's default), and the checklist three times more on a desktop, then held to lighthouserc.mjs's
// assertions. The reports land in .cache/lighthouse/<guide>/report, a table of each page's numbers as the assertions read them is
// printed (and added to the job's summary on GitHub), and the exit code is 1 when an assertion fails. Nothing runs it in `pnpm check`.
import { spawn, spawnSync } from "node:child_process";
import { appendFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createServer } from "node:net";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { queueSelf } from "../tools/queued.mjs";

// A heavy job: on a machine shared by several sessions it takes its turn in the queue (tools/queued.mjs; not in CI), and its table is in the log q names.
await queueSelf("lighthouse");

const root = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const build = !args.includes("--no-build");
const named = args.find((arg) => !arg.startsWith("--"));
const apps = named ? named.split(",") : readdirSync(join(root, "apps")).filter((app) => existsSync(join(root, "apps", app, "vercel.json")));
const config = `--config=${join(root, "lighthouse", "lighthouserc.mjs")}`;
const lhci = join(root, "node_modules", ".bin", "lhci");
const out = join(root, ".cache", "lighthouse");

// The pages audited on a phone, and the one audited on a desktop. Lighthouse CI keeps a requested URL's hash in the URL it groups
// runs by, which is what tells the desktop runs apart from the phone's in lighthouserc.mjs's assertMatrix. The app ignores the hash.
const phonePages = ["/guide/1", "/checklist", "/dashboard"];
const desktopPage = "/checklist#desktop";
// GitHub's Ubuntu runners don't give an unprivileged user the namespaces Chrome's sandbox needs; on a Mac the sandbox stays on.
const chromeFlags = process.env.CI ? ["--settings.chromeFlags=--no-sandbox"] : [];

const freePort = () =>
  new Promise((done) => {
    const server = createServer().listen(0, () => {
      const { port } = server.address();
      server.close(() => done(port));
    });
  });
const answers = async (url, ms) => {
  for (const end = Date.now() + ms; Date.now() < end; await new Promise((r) => setTimeout(r, 300))) {
    try {
      if ((await fetch(url)).ok) return true;
    } catch {}
  }
  return false;
};

// The preview server runs in a process group of its own, which a Ctrl-C in the terminal doesn't reach: stop it on the way out.
let server;
const stop = () => {
  try {
    if (server?.pid) process.kill(-server.pid, "SIGTERM");
  } catch {
    /* already gone */
  }
  server = undefined;
};
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => (stop(), process.exit(130)));

// A Ctrl-C reaches the child too, and Node can't run the signal handler while spawnSync waits: stop here when the child was stopped
// by it, or exited with the shell's code for it.
const interrupted = ({ status, signal }) => {
  if (signal === "SIGINT" || signal === "SIGTERM" || status === 130) (stop(), process.exit(130));
};
const lhciIn = (cwd, command) => {
  const result = spawnSync(lhci, [...command, config], { cwd, stdio: "inherit" });
  interrupted(result);
  return result.status;
};
const readJson = (file) => JSON.parse(readFileSync(file, "utf8"));
const where = (url) => new URL(url).pathname + new URL(url).hash;
const number = (value, digits = 0) => (typeof value === "number" ? value.toFixed(digits) : "–");
/** The median as Lighthouse CI's `aggregationMethod: "median"` takes it: the middle value, or the mean of the middle two. */
const median = (values) => {
  if (!values.length) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor((sorted.length - 1) / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle] + sorted[middle + 1]) / 2;
};

const rows = [];
const failures = [];
const browsers = new Set();

/** One guide: build, serve, collect, assert, report. Anything that goes wrong throws, and the next guide still runs. */
const audit = async (app) => {
  const name = readJson(join(root, "apps", app, "package.json")).name;
  if (build) {
    const built = spawnSync("pnpm", ["--filter", name, "build"], { cwd: root, stdio: "inherit" });
    interrupted(built);
    if (built.status !== 0) throw new Error("the build failed");
  }
  const port = await freePort();
  const origin = `http://localhost:${port}`;
  const dir = join(out, app);
  mkdirSync(dir, { recursive: true });
  server = spawn("pnpm", ["--filter", name, "preview", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore", detached: true });
  try {
    if (!(await answers(`${origin}/`, 30000))) throw new Error(`vite preview never answered on ${port}`);
    if (lhciIn(dir, ["collect", ...phonePages.map((page) => `--url=${origin}${page}`), ...chromeFlags]) !== 0) throw new Error("Lighthouse didn't finish the phone runs");
    if (lhciIn(dir, ["collect", "--additive", "--settings.preset=desktop", `--url=${origin}${desktopPage}`, ...chromeFlags]) !== 0)
      throw new Error("Lighthouse didn't finish the desktop runs");
  } finally {
    stop();
  }
  // assert exits 1 when an assertion fails, which assertion-results.json says in detail; any other trouble shows as a missing file.
  lhciIn(dir, ["assert"]);
  const uploaded = lhciIn(dir, ["upload"]) === 0;
  const results = join(dir, ".lighthouseci", "assertion-results.json");
  if (!existsSync(results)) throw new Error("lhci assert wrote no results (is lighthouserc.mjs valid?)");
  for (const result of readJson(results).filter((r) => !r.passed && r.level === "error")) {
    const id = result.auditProperty ? `${result.auditId}.${result.auditProperty}` : result.auditId;
    failures.push({ app, page: where(result.url), what: `${id}: ${result.name} ${result.operator} ${result.expected}, was ${number(result.actual, 3)}` });
  }
  if (!uploaded) throw new Error("Lighthouse CI couldn't write the reports");
  // Each page's runs, read as lighthouserc.mjs asserts them: speed and `cpu` as the median of the runs, the other scores as the worst.
  const runsByUrl = new Map();
  for (const entry of readJson(join(dir, "report", "manifest.json"))) {
    const lhr = readJson(entry.jsonPath);
    browsers.add(`Lighthouse ${lhr.lighthouseVersion}, ${/Chrome\/\d+/.exec(lhr.environment.hostUserAgent)?.[0] ?? "Chrome"}`);
    runsByUrl.set(entry.url, [...(runsByUrl.get(entry.url) ?? []), lhr]);
  }
  for (const [url, lhrs] of runsByUrl) {
    const values = (read) => lhrs.map(read).filter((value) => typeof value === "number");
    const metric = (id) => median(values((lhr) => lhr.audits[id]?.numericValue));
    const score = (id) => values((lhr) => lhr.categories[id]?.score);
    const percent = (value) => number(typeof value === "number" ? value * 100 : undefined);
    // Like Lighthouse CI's "pessimistic", which fails when any run has no score: a run without one shows as "–", not as the others' worst.
    const worst = (id) => percent(score(id).length === lhrs.length ? Math.min(...score(id)) : undefined);
    rows.push([
      app,
      where(url),
      percent(median(score("performance"))),
      worst("accessibility"),
      worst("best-practices"),
      worst("seo"),
      number(metric("largest-contentful-paint")),
      number(metric("total-blocking-time")),
      number(metric("cumulative-layout-shift"), 3),
      number(median(values((lhr) => lhr.environment.benchmarkIndex))),
    ]);
  }
};

rmSync(out, { recursive: true, force: true });
for (const app of apps) {
  const started = Date.now();
  try {
    await audit(app);
  } catch (error) {
    failures.push({ app, page: "(all)", what: error.message });
  }
  console.log(`${app}: ${Math.round((Date.now() - started) / 1000)} s`);
}

// "cpu" is Lighthouse's benchmark of the machine: a slow runner shows there before it shows in the timings.
const header = ["guide", "page", "perf", "a11y", "best", "seo", "LCP ms", "TBT ms", "CLS", "cpu"];
const widths = header.map((h, i) => Math.max(h.length, ...rows.map((row) => row[i].length)));
const line = (cells) => cells.map((cell, i) => cell.padEnd(widths[i])).join("  ");
const verdict = failures.length
  ? `${failures.length} failed:\n${failures.map((f) => `- ${f.app} ${f.page}: ${f.what}`).join("\n")}`
  : "Every assertion passed.";
const reading = "speed and cpu are the median of each page's runs; accessibility, best practices and SEO the worst run";
console.log(`\n${[...browsers].join("; ")}: ${reading}:\n\n${[line(header), ...rows.map(line)].join("\n")}\n\n${verdict}`);

if (process.env.GITHUB_STEP_SUMMARY) {
  const md = (cells) => `| ${cells.join(" | ")} |`;
  const table = [md(header), md(header.map(() => "---")), ...rows.map(md)].join("\n");
  appendFileSync(process.env.GITHUB_STEP_SUMMARY, `### Lighthouse: ${apps.join(", ")}\n\n${[...browsers].join("; ")}: ${reading}.\n\n${table}\n\n${verdict}\n`);
}
process.exit(failures.length ? 1 : 0);
