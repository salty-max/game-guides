import { allRows, chapters, overall, rowsByTag, tally, whatsLeft } from "@hundo/core/guide";
import { STORAGE_KEY, validateState } from "@hundo/core/progress-state";
import { targets } from "./config";
import { missables } from "./data/missables";
import { THEME_KEY } from "@hundo/core/store/theme";
import { AWAKE_KEY } from "@hundo/core/store/awake";
import { PLACE_KEY } from "@hundo/core/store/place";
import { SYNC_KEY } from "@hundo/core/sync/local";
import { PERSIST_KEY } from "@hundo/core/persistence";
import { COUNTS_KEY } from "@hundo/core/counts";
import { flatten } from "@hundo/core/sync/fields";
import type { Checks, Row } from "@hundo/core/types";

const [a] = allRows.map((row) => row.id);
const tick = (rows: Row[]): Checks => Object.fromEntries(rows.map((row) => [row.id, true]));
const without = (rows: Row[], left: Row) => tick(rows.filter((row) => row !== left));
// What each target counts: its goal, or its rows when it has none (the expansion's gear).
const goalOf = (target: (typeof targets)[number]) => ("goal" in target && target.goal !== undefined ? target.goal : tally(target.tag, {}).total);
const goals = targets.reduce((sum, target) => sum + goalOf(target), 0);
// The rows of a one-way choice, tagged `choice` and counted by no target until the choice block lands.
const choices = ["quest-lautrec-invasion", "quest-anastacia-return", "quest-frampt", "quest-patches-forgive", "quest-ciaran", "quest-sieg-ash", "quest-solaire-shortcut", "quest-solaire-saved"];

describe("Dark Souls Remastered completion", () => {
  it("cites sources for every chapter", () => {
    for (const chapter of chapters) expect(chapter.sources.length, chapter.title).toBeGreaterThan(0);
  });

  it("gives every entry directions", () => {
    for (const row of allRows) expect(row.text.trim(), row.id).not.toBe("");
  });

  it("reaches every target of the guide's completion list", () => {
    for (const { tag, goal } of targets) if (goal !== undefined) expect(tally(tag, {}).total, tag).toBe(goal);
  });

  it("counts every target: none is optional, and What's left starts with all of them and their goals", () => {
    expect(targets.some((target) => "optional" in target && target.optional)).toBe(false);
    expect(whatsLeft({}).map((item) => item.tag).sort()).toEqual(targets.map((target) => target.tag).sort());
    expect(whatsLeft({}).reduce((sum, item) => sum + item.total, 0)).toBe(goals);
  });

  // 100% is every target, each item once: it never shows while anything on the board is left, and What's left says what.
  it("reads 100 only with everything ticked, and under 100 with any one item left", () => {
    expect(overall({}).percent).toBe(0);
    expect(overall({}).label).toBe("complete");
    expect(overall(tick(allRows)).percent).toBe(100);
    expect(whatsLeft(tick(allRows))).toEqual([]);
    for (const { tag } of targets) {
      const [row] = rowsByTag(tag);
      expect(overall(without(allRows, row)).percent, tag).toBeLessThan(100);
      expect(whatsLeft(without(allRows, row)).map((item) => item.tag), tag).toContain(tag);
    }
  });

  it("counts the NPC quest steps by their rows, goal and all, and the trades, souls, slabs, invasions, cycles, extras and pickups", () => {
    for (const tag of ["quest", "trade", "estus", "forge", "invasion", "cycle", "extra", "pickup"]) {
      const target = targets.find((item) => item.tag === tag);
      expect(target, tag).toBeDefined();
      expect("goal" in target! && target.goal, tag).toBe(rowsByTag(tag).length);
    }
    // (Snuggly's trades without the how-to row, and without the two that count as their own kind; the five slabs the guide sends you to, not a farming row)
    for (const [id, tag] of [["sorcery-pursuers", "dlc-spell"], ["forge-snuggly-red-slab", "forge"], ["extra-laurentius-goodbye", "quest"]] as const) {
      expect(targets.filter((target) => rowsByTag(target.tag).some((row) => row.id === id)).map((target) => target.tag), id).toEqual([tag]);
    }
    expect(rowsByTag("trade").some((row) => row.id === "trade-snuggly-how")).toBe(false);
    expect(rowsByTag("forge").some((row) => row.id === "forge-kiln-farm")).toBe(false);
  });

  it("leaves the rows of a one-way choice off every target, and every other tag the guide tracks is a target or a route step", () => {
    expect(rowsByTag("choice").map((row) => row.id).sort()).toEqual([...choices].sort());
    for (const row of rowsByTag("choice")) expect(row.tags.some((tag) => targets.some((target) => target.tag === tag)), row.id).toBe(false);
    expect(overall(tick(rowsByTag("choice"))).percent).toBe(0);
    const off = allRows.filter((row) => !row.tags.some((tag) => targets.some((target) => target.tag === tag)));
    expect(off.every((row) => row.tags[0] === "route" || row.tags[0] === "choice" || row.tags.every((tag) => tag === "route" || tag === "dlc"))).toBe(true);
  });

  it("counts the base game's spells apart from the expansion's, as the achievements do", () => {
    for (const row of rowsByTag("base-sorcery")) expect(row.tags, row.id).toContain("sorcery");
    for (const row of rowsByTag("base-pyromancy")) expect(row.tags, row.id).toContain("pyromancy");
    for (const row of rowsByTag("dlc-spell")) {
      expect(row.tags.some((tag) => tag.startsWith("base-")), row.id).toBe(false);
      expect(row.tags.some((tag) => tag === "sorcery" || tag === "pyromancy" || tag === "miracle"), row.id).toBe(true);
    }
  });

  // The README and the Don't miss strip are written for these 19.
  it("keeps the 19 missables the route was checked with", () => {
    expect(missables).toHaveLength(19);
  });
});

describe("storage", () => {
  // Readers' progress, theme and sync ledger live under these keys on this domain: new keys start every reader from nothing.
  it("keeps its storage keys", () => {
    expect(STORAGE_KEY).toBe("hundo-lordran.v1");
    expect(THEME_KEY).toBe("hundo-lordran.theme");
    expect(AWAKE_KEY).toBe("hundo-lordran.awake");
    expect(PLACE_KEY).toBe("hundo-lordran.place");
    expect(SYNC_KEY).toBe("hundo-lordran.sync");
    expect(PERSIST_KEY).toBe("hundo-lordran.persist");
    expect(COUNTS_KEY).toBe("hundo-lordran.counts");
  });
});

describe("Lordran sync", () => {
  it("has no state of its own to sync beyond the shared fields", () => {
    expect(Object.keys(flatten(validateState({ version: 3, guide: "dark-souls-remastered", checks: { [a]: true }, ceiling: 2, chapter: 2, spoilers: true }))).sort()).toEqual([`c:${a}`, "ceiling", "chapter", "spoilers"].sort());
  });
});
