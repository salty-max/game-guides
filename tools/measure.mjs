// Runs a command and measures what it costs the machine, for comparing a check or a browser job before and after a change:
//
//   node tools/measure.mjs [--out file.json] [--label name] -- <command...>
//
// Every second it reads the machine's load average and swap, and the command's own process tree: the RSS of all of it summed, and how
// many of its processes are Chrome. At the end one line gives the wall time, the exit code and the peaks (the 1-minute load at its
// highest, the tree's RSS at its highest, the most Chrome processes at once, how far the swap grew), and --out writes them with the samples as JSON. The exit
// code is the command's. Run it through q's queue (`bun harness/q.ts --queue measure -- node tools/measure.mjs -- …`) so that nothing
// else of yours or another session's runs beside it, and read the starting load: a run that starts on a busy machine measures that too.
import { spawn, spawnSync } from "node:child_process";
import { writeFileSync } from "node:fs";

const argv = process.argv.slice(2);
const split = argv.indexOf("--");
if (split < 0 || split === argv.length - 1) {
  console.error("usage: node tools/measure.mjs [--out file.json] [--label name] -- <command...>");
  process.exit(2);
}
const flags = argv.slice(0, split);
const command = argv.slice(split + 1);
const flag = (name) => (flags.includes(name) ? flags[flags.indexOf(name) + 1] : undefined);
const out = flag("--out");
const label = flag("--label") ?? command.join(" ");

const sysctl = (name) => spawnSync("/usr/sbin/sysctl", ["-n", name], { encoding: "utf8" }).stdout.trim();
const load = () => Number(sysctl("vm.loadavg").replace(/[{}]/g, "").trim().split(/\s+/)[0]);
const swapMb = () => Number(/used = ([\d.]+)M/.exec(sysctl("vm.swapusage"))?.[1] ?? 0);

/** The command's process tree: its RSS in KB summed, and how many of its processes are Chrome. */
const tree = (root) => {
  const ps = spawnSync("/bin/ps", ["-axo", "pid=,ppid=,rss=,comm="], { encoding: "utf8", maxBuffer: 1 << 24 }).stdout;
  const rows = ps
    .split("\n")
    .map((line) => /^\s*(\d+)\s+(\d+)\s+(\d+)\s+(.*)$/.exec(line))
    .filter(Boolean)
    .map(([, pid, ppid, rss, comm]) => ({ pid: Number(pid), ppid: Number(ppid), rss: Number(rss), comm }));
  const children = new Map();
  for (const row of rows) children.set(row.ppid, [...(children.get(row.ppid) ?? []), row]);
  let rss = 0;
  let chrome = 0;
  let processes = 0;
  const stack = [...(children.get(root) ?? [])];
  while (stack.length) {
    const row = stack.pop();
    rss += row.rss;
    processes += 1;
    if (/chrom/i.test(row.comm)) chrome += 1;
    stack.push(...(children.get(row.pid) ?? []));
  }
  return { rss, chrome, processes };
};

const started = Date.now();
const startLoad = load();
const startSwap = swapMb();
const child = spawn(command[0], command.slice(1), { stdio: "inherit" });
const samples = [];
const sample = () => {
  const { rss, chrome, processes } = tree(child.pid);
  samples.push({ t: Math.round((Date.now() - started) / 1000), load: load(), rssMb: Math.round(rss / 1024), chrome, processes, swapMb: swapMb() });
};
const timer = setInterval(sample, 1000);
for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"]) process.on(signal, () => child.kill(signal));

child.on("exit", (code, signal) => {
  clearInterval(timer);
  const seconds = Math.round((Date.now() - started) / 1000);
  const peak = (key) => Math.max(0, ...samples.map((s) => s[key]));
  const result = {
    label,
    exit: code ?? signal,
    seconds,
    startLoad,
    peakLoad: peak("load"),
    peakRssGb: Number((peak("rssMb") / 1024).toFixed(2)),
    peakChrome: peak("chrome"),
    peakProcesses: peak("processes"),
    swapGrowthGb: Number((Math.max(0, peak("swapMb") - startSwap) / 1024).toFixed(2)),
  };
  console.log(
    `measure: ${label}: exit ${result.exit}, ${seconds}s, load ${startLoad} at start, peak load ${result.peakLoad}, peak RSS ${result.peakRssGb} GB, ` +
      `peak Chrome ${result.peakChrome}, swap grew ${result.swapGrowthGb} GB`,
  );
  if (out) writeFileSync(out, JSON.stringify({ ...result, samples }, null, 1) + "\n");
  process.exit(typeof code === "number" ? code : 1);
});
