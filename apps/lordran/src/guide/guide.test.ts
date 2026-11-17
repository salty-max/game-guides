import { allRows, chapters, rowsByTag, tally } from "@hundo/core/guide";
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

const [a] = allRows.map((row) => row.id);

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
