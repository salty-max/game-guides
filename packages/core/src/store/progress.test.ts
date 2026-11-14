import { allRows, CHAPTER_COUNT } from "../guide";
import { STORAGE_KEY, defaultState } from "../progress-state";
import { useProgress } from "./progress";

const [a, b, c] = allRows.map((row) => row.id);
const last = CHAPTER_COUNT;

beforeEach(() => {
  localStorage.clear();
  useProgress.setState({ data: defaultState(), storageError: false });
});

describe("progress store", () => {
  it("restores only the given ids to their earlier state", () => {
    useProgress.getState().setMany([a, b], true);
    const before = { ...useProgress.getState().data.checks };
    useProgress.getState().setMany([b, c], false);
    useProgress.getState().setCheck(c, true);
    useProgress.getState().restore([b, c], before);
    expect(useProgress.getState().data.checks).toEqual({ [a]: true, [b]: true });
  });

  it("reveals up to a chapter and never lowers the ceiling", () => {
    useProgress.getState().reveal(last);
    useProgress.getState().reveal(2);
    expect(useProgress.getState().data).toMatchObject({ ceiling: last, chapter: 2 });
  });

  it("moves back to the ceiling when spoiler protection hides the open chapter", () => {
    useProgress.getState().reveal(last);
    useProgress.getState().saveSettings({ spoilers: true, ceiling: 2 });
    expect(useProgress.getState().data).toMatchObject({ ceiling: 2, chapter: 2, spoilers: true });
    useProgress.getState().saveSettings({ spoilers: true, ceiling: 99 });
    expect(useProgress.getState().data.ceiling).toBe(1);
  });

  it("keeps working in memory and flags it when storage refuses to save", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    useProgress.getState().setCheck(a, true);
    expect(useProgress.getState()).toMatchObject({ storageError: true, data: { checks: { [a]: true } } });
    setItem.mockRestore();
  });

  it("falls back to a fresh state and flags it when the saved progress is unreadable", () => {
    localStorage.setItem(STORAGE_KEY, "{not json");
    useProgress.getState().reloadFromStorage();
    expect(useProgress.getState()).toMatchObject({ storageError: true, data: defaultState() });
  });
});
