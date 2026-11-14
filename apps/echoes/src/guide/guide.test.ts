import { allRows, chapters, rowsByTag, tally } from "../core/guide";
import { validateState } from "../core/progress-state";
import { targets } from "./config";

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
