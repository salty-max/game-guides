import { allRows } from "./guide";
import { defaultState, validateState } from "./progress-state";

describe("validateState", () => {
  const id = allRows[0].id;
  const base = { version: 1, guide: "echoes-of-wisdom" };

  it("round-trips a default state", () => {
    expect(validateState(JSON.parse(JSON.stringify(defaultState())))).toEqual(defaultState());
  });

  it("rejects things that are not backups", () => {
    for (const bad of [null, {}, { version: 1, checks: {} }, { ...base, checks: [] }, base, { ...base, version: 2, checks: {} }, { version: 1, guide: "red-dead-redemption", checks: {} }]) {
      expect(() => validateState(bad)).toThrow();
    }
  });

  it("drops unknown ids and non-true checks", () => {
    const state = validateState({ ...base, checks: { [id]: true, nope: true, [allRows[1].id]: false } });
    expect(state.checks).toEqual({ [id]: true });
  });

  it("sanitises chapter numbers and the spoiler flag", () => {
    const state = validateState({ ...base, checks: {}, ceiling: 99, chapter: 4, spoilers: "no" });
    expect(state.ceiling).toBe(1);
    expect(state.chapter).toBe(4);
    expect(state.spoilers).toBe(true);
    expect(validateState({ ...base, checks: {}, spoilers: false }).spoilers).toBe(false);
  });
});
