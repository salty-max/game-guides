import { allRows, chapters, rowsByTag, tally } from "@hundo/core/guide";
import { STORAGE_KEY, validateState } from "@hundo/core/progress-state";
import { targets } from "./config";
import { THEME_KEY } from "@hundo/core/store/theme";
import { AWAKE_KEY } from "@hundo/core/store/awake";
import { PLACE_KEY } from "@hundo/core/store/place";
import { SYNC_KEY } from "@hundo/core/sync/local";
import { PERSIST_KEY } from "@hundo/core/persistence";
import { COUNTS_KEY } from "@hundo/core/counts";
import { flatten } from "@hundo/core/sync/fields";

const [a] = allRows.map((row) => row.id);

describe("Echoes of Wisdom completion", () => {
  it("cites sources for every chapter", () => {
    for (const chapter of chapters) expect(chapter.sources.length, chapter.title).toBeGreaterThan(0);
  });

  it("gives every entry directions", () => {
    for (const row of allRows) expect(row.text.trim(), row.id).not.toBe("");
  });

  it("reaches every target of the guide's completion list", () => {
    for (const { tag, goal } of targets) expect(tally(tag, {}).total, tag).toBe(goal);
  });

  it("counts Might Crystals by what each entry awards", () => {
    const all = Object.fromEntries(allRows.map((row) => [row.id, true as const]));
    expect(tally("might-crystal", all)).toEqual({ done: 150, total: 150 });
    expect(rowsByTag("might-crystal").some((row) => row.quantity > 1)).toBe(true);
  });

  it("splits chests into dungeon, mini-dungeon and overworld ones", () => {
    expect(rowsByTag("chest").length).toBeGreaterThan(rowsByTag("dungeon-chest").length + rowsByTag("mini-dungeon-chest").length);
    for (const row of rowsByTag("dungeon-chest")) expect(row.tags).toContain("chest");
  });
});

describe("Echoes of Wisdom saves from before the shared format", () => {
  const v1 = { version: 1, guide: "echoes-of-wisdom", checks: { [a]: true }, ceiling: 4, chapter: 3, spoilers: false };

  it("loads a version 1 save as is", () => {
    expect(validateState(v1)).toEqual({ version: 3, guide: "echoes-of-wisdom", checks: { [a]: true }, ceiling: 4, chapter: 3, spoilers: false, extra: undefined });
  });

  it("refuses other guides' and unknown versions", () => {
    for (const bad of [{ ...v1, version: 2 }, { ...v1, guide: "red-dead-redemption" }, { ...v1, guide: undefined }]) expect(() => validateState(bad)).toThrow();
  });
});

describe("storage", () => {
  // Readers' progress and theme live under these keys on this domain: new keys start every reader from nothing.
  it("keeps its storage keys", () => {
    expect(STORAGE_KEY).toBe("echoes-of-wisdom-field-guide.v1");
    expect(THEME_KEY).toBe("echoes-of-wisdom-field-guide.theme");
    expect(AWAKE_KEY).toBe("echoes-of-wisdom-field-guide.awake");
    expect(PLACE_KEY).toBe("echoes-of-wisdom-field-guide.place");
    expect(SYNC_KEY).toBe("echoes-of-wisdom-field-guide.sync");
    expect(PERSIST_KEY).toBe("echoes-of-wisdom-field-guide.persist");
    expect(COUNTS_KEY).toBe("echoes-of-wisdom-field-guide.counts");
  });
});

describe("Echoes sync", () => {
  it("has no state of its own to sync beyond the shared fields", () => {
    expect(Object.keys(flatten(validateState({ version: 3, guide: "echoes-of-wisdom", checks: { [a]: true }, ceiling: 2, chapter: 2, spoilers: true }))).sort()).toEqual([`c:${a}`, "ceiling", "chapter", "spoilers"].sort());
  });
});
