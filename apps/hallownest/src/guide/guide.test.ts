import { allRows, chapters, coreRows, overall, rowsByTag, tally, whatsLeft } from "@hundo/core/guide";
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
import { FULL, gamePoints } from "./points";

const [a] = allRows.map((row) => row.id);
const tick = (rows: Row[]): Checks => Object.fromEntries(rows.map((row) => [row.id, true]));
const without = (rows: Row[], left: Row) => tick(rows.filter((row) => row !== left));

describe("Hollow Knight completion", () => {
  it("cites sources for every chapter", () => {
    for (const chapter of chapters) expect(chapter.sources.length, chapter.title).toBeGreaterThan(0);
  });

  it("gives every entry directions", () => {
    for (const row of allRows) expect(row.text.trim(), row.id).not.toBe("");
  });

  it("reaches every target of the guide's completion list", () => {
    for (const { tag, goal } of targets) if (goal !== undefined) expect(tally(tag, {}).total, tag).toBe(goal);
  });

  it("adds up to the game's 112% with every row the game counts, and to nothing with the rest", () => {
    expect(gamePoints(tick(allRows), allRows)).toBe(FULL);
    expect(gamePoints(tick(coreRows), coreRows)).toBe(FULL);
    expect(gamePoints(tick(allRows.filter((row) => !coreRows.includes(row))), allRows)).toBe(0);
  });

  it("counts Mask Shards by the mask and Vessel Fragments by the vessel", () => {
    expect(gamePoints(tick(rowsByTag("mask-shard").slice(0, 3)), coreRows)).toBe(0);
    expect(gamePoints(tick(rowsByTag("mask-shard").slice(0, 4)), coreRows)).toBe(1);
    expect(gamePoints(tick(rowsByTag("mask-shard")), coreRows)).toBe(4);
    expect(gamePoints(tick(rowsByTag("vessel-fragment").slice(0, 2)), coreRows)).toBe(0);
    expect(gamePoints(tick(rowsByTag("vessel-fragment")), coreRows)).toBe(3);
    expect(gamePoints(tick(rowsByTag("equipment").slice(0, 1)), coreRows)).toBe(2);
  });

  // 100% is full completion: the game's 112 points scaled, rounded once, so it never shows while anything the game counts is left.
  it("reads 100 only with every row the game counts, and 99 with one Mask Shard left", () => {
    expect(overall(tick(coreRows)).percent).toBe(100);
    expect(whatsLeft(tick(coreRows))).toEqual([]);
    const [shard] = rowsByTag("mask-shard");
    expect(overall(without(coreRows, shard)).percent).toBe(99);
    for (const row of coreRows) expect(overall(without(coreRows, row)).percent, row.id).toBeLessThan(100);
  });

  it("scales the game's points to 100 and rounds down", () => {
    expect(overall({}).percent).toBe(0);
    expect(overall({}).label).toBe("complete");
    // 55 of 112 is 49.1%, and one point alone is under 1%.
    const halfway = coreRows.filter((row) => row.tags.includes("charm")).concat(rowsByTag("percent-boss"));
    expect(gamePoints(tick(halfway), coreRows)).toBe(55);
    expect(overall(tick(halfway)).percent).toBe(49);
    expect(overall(tick(rowsByTag("charm").slice(0, 1))).percent).toBe(0);
  });

  it("keeps the extra collections, the endings and the rematches out of the game's count", () => {
    for (const { tag, optional } of targets) {
      const rows = rowsByTag(tag);
      if (optional) expect(rows.some((row) => coreRows.includes(row)), tag).toBe(false);
      else expect(rows.every((row) => coreRows.includes(row)), tag).toBe(true);
    }
  });
});

describe("storage", () => {
  // Readers' progress, theme and sync ledger live under these keys on this domain: new keys start every reader from nothing.
  it("keeps its storage keys", () => {
    expect(STORAGE_KEY).toBe("hundo-hallownest.v1");
    expect(THEME_KEY).toBe("hundo-hallownest.theme");
    expect(AWAKE_KEY).toBe("hundo-hallownest.awake");
    expect(PLACE_KEY).toBe("hundo-hallownest.place");
    expect(SYNC_KEY).toBe("hundo-hallownest.sync");
    expect(PERSIST_KEY).toBe("hundo-hallownest.persist");
    expect(COUNTS_KEY).toBe("hundo-hallownest.counts");
  });
});

describe("Hallownest sync", () => {
  it("has no state of its own to sync beyond the shared fields", () => {
    expect(Object.keys(flatten(validateState({ version: 3, guide: "hollow-knight", checks: { [a]: true }, ceiling: 2, chapter: 2, spoilers: true }))).sort()).toEqual([`c:${a}`, "ceiling", "chapter", "spoilers"].sort());
  });
});
