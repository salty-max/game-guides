import { allRows, chapters, overall, rowsByTag, tally, whatsLeft } from "@hundo/core/guide";
import { STORAGE_KEY, validateState } from "@hundo/core/progress-state";
import { THEME_KEY } from "@hundo/core/store/theme";
import { AWAKE_KEY } from "@hundo/core/store/awake";
import { PLACE_KEY } from "@hundo/core/store/place";
import { SYNC_KEY } from "@hundo/core/sync/local";
import { PERSIST_KEY } from "@hundo/core/persistence";
import { COUNTS_KEY } from "@hundo/core/counts";
import { flatten } from "@hundo/core/sync/fields";
import type { Checks, Row } from "@hundo/core/types";
import { targets } from "./config";

const [a] = allRows.map((row) => row.id);
const tick = (rows: Row[]): Checks => Object.fromEntries(rows.map((row) => [row.id, true]));
const counted = allRows.filter((row) => targets.some(({ tag }) => row.tags.includes(tag)));

describe("Silksong completion", () => {
  it("cites sources for every chapter", () => {
    for (const chapter of chapters) expect(chapter.sources.length, chapter.title).toBeGreaterThan(0);
  });

  it("gives every entry directions", () => {
    for (const row of allRows) expect(row.text.trim(), row.id).not.toBe("");
  });

  it("reaches every fixed total", () => {
    for (const { tag, goal } of targets) if (goal !== undefined) expect(tally(tag, {}).total, tag).toBe(goal);
  });

  it("counts the game's own 100 in its first eleven targets: 51 tools, the upgrades, 20 shards and 18 fragments", () => {
    const game = targets.slice(0, 11).map(({ tag, goal }) => [tag, goal]);
    expect(Object.fromEntries(game)).toEqual({ tool: 51, skill: 6, kit: 4, pouch: 4, "silk-heart": 3, crest: 6, ability: 7, "mask-shard": 20, "spool-fragment": 18, needle: 4, item: 1 });
    const per = { "mask-shard": 4, "spool-fragment": 2 } as Record<string, number>;
    expect(targets.slice(0, 11).reduce((sum, { tag, goal = 0 }) => sum + goal / (per[tag] ?? 1), 0)).toBe(100);
  });

  it("leaves nothing on the board optional", () => {
    for (const target of targets) expect(target.optional, target.tag).toBeFalsy();
  });

  // (core adds "missable" to the rows in missables.ts)
  it("counts every row but the route's own steps and pickups", () => {
    for (const row of allRows.filter((row) => !counted.includes(row))) expect(row.tags.every((tag) => ["route", "pickup", "missable"].includes(tag)), row.id).toBe(true);
  });

  // 100% is full completion: every tracked entry, one each, so it never shows while anything on the board is left.
  it("reads 100 only with everything ticked, and under 100 with any one entry left", () => {
    expect(overall({}).percent).toBe(0);
    expect(overall({}).label).toBe("complete");
    expect(overall(tick(allRows)).percent).toBe(100);
    expect(whatsLeft(tick(allRows))).toEqual([]);
    for (const row of counted) {
      const left = tick(allRows.filter((other) => other !== row));
      expect(overall(left).percent, row.id).toBeLessThan(100);
      expect(whatsLeft(left), row.id).not.toEqual([]);
    }
  });

  it("weighs a flea like a tool", () => {
    const [flea] = rowsByTag("flea");
    const [tool] = rowsByTag("tool");
    expect(overall(tick(allRows.filter((row) => row !== flea))).percent).toBe(overall(tick(allRows.filter((row) => row !== tool))).percent);
  });
});

describe("storage", () => {
  // Readers' progress, theme and sync ledger live under these keys on this domain: new keys start every reader from nothing.
  it("keeps its storage keys", () => {
    expect(STORAGE_KEY).toBe("hundo-pharloom.v1");
    expect(THEME_KEY).toBe("hundo-pharloom.theme");
    expect(AWAKE_KEY).toBe("hundo-pharloom.awake");
    expect(PLACE_KEY).toBe("hundo-pharloom.place");
    expect(SYNC_KEY).toBe("hundo-pharloom.sync");
    expect(PERSIST_KEY).toBe("hundo-pharloom.persist");
    expect(COUNTS_KEY).toBe("hundo-pharloom.counts");
  });
});

describe("Pharloom sync", () => {
  it("has no state of its own to sync beyond the shared fields", () => {
    expect(Object.keys(flatten(validateState({ version: 3, guide: "silksong", checks: { [a]: true }, ceiling: 2, chapter: 2, spoilers: true }))).sort()).toEqual([`c:${a}`, "ceiling", "chapter", "spoilers"].sort());
  });
});
