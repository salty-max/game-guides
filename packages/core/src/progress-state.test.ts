// @vitest-environment node
import { allRows, brand, CHAPTER_COUNT } from "./guide";
import { defaultState, validateState } from "./progress-state";

const base = { version: 3, guide: brand.id };
const [a, b] = allRows.map((row) => row.id);

describe("validateState", () => {
  it("round-trips a default state", () => {
    expect(validateState(JSON.parse(JSON.stringify(defaultState())))).toEqual(defaultState());
  });

  it("round-trips an export through import", () => {
    const state = { ...defaultState(), checks: { [a]: true as const }, ceiling: CHAPTER_COUNT, chapter: 2, spoilers: false };
    expect(validateState(JSON.parse(JSON.stringify(state)))).toEqual(state);
  });

  it("rejects things that are not backups of this guide", () => {
    for (const bad of [null, [], "x", {}, base, { ...base, checks: [] }, { ...base, version: 4, checks: {} }, { ...base, guide: "another-guide", checks: {} }]) {
      expect(() => validateState(bad)).toThrow();
    }
  });

  it("drops unknown ids and non-true checks", () => {
    const state = validateState({ ...base, checks: { [a]: true, nope: true, [b]: false } });
    expect(state.checks).toEqual({ [a]: true });
  });

  it("sanitises chapter numbers and the spoiler flag", () => {
    const state = validateState({ ...base, checks: {}, ceiling: 99, chapter: 2, spoilers: "no" });
    expect(state.ceiling).toBe(1);
    expect(state.chapter).toBe(2);
    expect(state.spoilers).toBe(true);
    expect(validateState({ ...base, checks: {}, spoilers: false }).spoilers).toBe(false);
  });

  it("always saves in the shared format", () => {
    expect(defaultState()).toMatchObject({ version: 3, guide: brand.id });
  });
});
