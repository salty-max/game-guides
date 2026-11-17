import { GUIDES } from "./app";
import { toPairs, type Store } from "./store";

/*
 * What `pnpm stats` prints: each guide's visit counts summed over the last days, and a picture of the sync groups as they stand. It only
 * reads, and is meant for the database's read-only token. A group's devices are counted and their last sync read; their labels never
 * leave this file.
 */

const DAY_MS = 86_400_000;
const ACTIVE_MS = 30 * DAY_MS;

export interface GuideStats {
  guide: string;
  /** Every counted field summed over the days asked for (v:app, p:guide/3, s:3, pair…). */
  totals: Record<string, number>;
}

export interface GroupStats {
  /** How many groups hold each number of devices. */
  bySize: Record<number, number>;
  groups: number;
  /** Groups where at least two devices have synced in the last 30 days. */
  activePairs: number;
}

export interface Stats {
  ns: "prod" | "test";
  days: string[];
  guides: GuideStats[];
  groups: GroupStats;
  /** Commands counting has used this month, of its budget. */
  budget: number;
}

/** The UTC days ending today, oldest first. */
export const lastDays = (now: number, count: number) => Array.from({ length: count }, (_, i) => new Date(now - (count - 1 - i) * DAY_MS).toISOString().slice(0, 10));

export async function readStats(store: Store, { ns, now, days }: { ns: "prod" | "test"; now: number; days: number }): Promise<Stats> {
  const dates = lastDays(now, days);
  const reads = GUIDES.flatMap((guide) => dates.map((day) => ["HGETALL", `hs:${ns}:st:${guide}:${day}`] as const));
  const rows = await store.exec([...reads, ["GET", `hs:${ns}:st:budget:${dates.at(-1)!.slice(0, 7)}`]]);
  const guides = GUIDES.map((guide, g) => {
    const totals: Record<string, number> = {};
    for (const row of rows.slice(g * dates.length, (g + 1) * dates.length)) for (const [field, value] of toPairs(row)) totals[field] = (totals[field] ?? 0) + Number(value);
    return { guide, totals };
  });

  const names: string[] = [];
  let cursor = "0";
  do {
    const [page] = (await store.exec([["SCAN", cursor, "MATCH", `hs:${ns}:gd:*`, "COUNT", 1000]])) as [[string | number, string[]]];
    cursor = String(page[0]);
    names.push(...page[1]);
  } while (cursor !== "0");
  const groups: GroupStats = { bySize: {}, groups: 0, activePairs: 0 };
  for (let at = 0; at < names.length; at += 100) {
    for (const flat of await store.exec(names.slice(at, at + 100).map((name) => ["HGETALL", name]))) {
      // label<TAB>last synced: only the time is read
      const seen = toPairs(flat).map(([, value]) => Number(value.split("\t")[1]));
      if (seen.length === 0) continue;
      groups.groups++;
      groups.bySize[seen.length] = (groups.bySize[seen.length] ?? 0) + 1;
      if (seen.filter((at) => now - at <= ACTIVE_MS).length >= 2) groups.activePairs++;
    }
  }
  return { ns, days: dates, guides, groups, budget: Number(rows.at(-1) ?? 0) };
}

const share = (part: number, whole: number) => (whole ? `${Math.round((part / whole) * 100)}%` : "–");

/** The report as plain text, one block per guide, then the groups. */
export function formatStats(stats: Stats, budget: number): string {
  const lines = [`Visit counts, ${stats.ns}, ${stats.days[0]} to ${stats.days.at(-1)} (UTC), ${stats.days.length} days`, ""];
  for (const { guide, totals } of stats.guides) {
    const get = (field: string) => totals[field] ?? 0;
    const visits = get("v:app") + get("v:tab");
    lines.push(guide, `  visits ${visits}: installed app ${get("v:app")} (${share(get("v:app"), visits)}), tab ${get("v:tab")}`);
    lines.push(`  pages: checklist ${get("p:checklist")}, progress ${get("p:dashboard")}, questlines ${get("p:questlines")}, sources ${get("p:sources")}`);
    const chapters = Object.keys(totals)
      .map((field) => /^(?:p:guide\/|[sf]:)(\d+)$/.exec(field)?.[1])
      .filter((n): n is string => n !== undefined)
      .map(Number);
    for (const n of [...new Set(chapters)].sort((a, b) => a - b)) lines.push(`  chapter ${n}: shown ${get(`p:guide/${n}`)}, started ${get(`s:${n}`)}, finished ${get(`f:${n}`)}`);
    lines.push(`  devices linked ${get("pair")}`, "");
  }
  const sizes = Object.entries(stats.groups.bySize)
    .map(([size, count]) => `${count} of ${size}`)
    .join(", ");
  lines.push(`Sync groups now: ${stats.groups.groups}${sizes ? ` (${sizes} devices)` : ""}, ${stats.groups.activePairs} with two or more devices synced in the last 30 days`);
  lines.push(`Counting has used ${stats.budget} of its ${budget} commands this month`);
  return lines.join("\n");
}
