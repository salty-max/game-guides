import { changeChecks } from "./actions";
import { STORAGE_KEY, defaultState } from "./progress-state";
import { allRows } from "./guide";
import { useProgress } from "./store/progress";
import { useUi } from "./store/ui";

const [a, b, c] = allRows.map((row) => row.id);

beforeEach(() => {
  localStorage.clear();
  useProgress.setState({ data: defaultState(), storageError: false });
  useUi.setState({ toast: null });
});

describe("changeChecks", () => {
  it("checks in bulk and undo restores exactly the previous state", () => {
    useProgress.getState().setCheck(a, true);
    changeChecks([a, b, c], true, "Checked 2.");
    expect(Object.keys(useProgress.getState().data.checks).sort()).toEqual([a, b, c].sort());
    useUi.getState().toast?.undo?.();
    expect(useProgress.getState().data.checks).toEqual({ [a]: true });
  });

  it("unchecks and undoes", () => {
    useProgress.getState().setMany([a, b], true);
    changeChecks([a, b], false, "Unchecked 2.");
    expect(useProgress.getState().data.checks).toEqual({});
    useUi.getState().toast?.undo?.();
    expect(useProgress.getState().data.checks).toEqual({ [a]: true, [b]: true });
  });

  it("persists to storage", () => {
    changeChecks([a, b], true, "Checked 2.");
    expect(Object.keys(JSON.parse(localStorage.getItem(STORAGE_KEY)!).checks).sort()).toEqual([a, b].sort());
  });

  it("does nothing, and shows no toast, when nothing changes", () => {
    changeChecks([a], false, "x");
    expect(useUi.getState().toast).toBeNull();
  });
});

describe("undo toast", () => {
  it("is only closed by its own id, so an older timer never closes a newer toast", () => {
    useUi.getState().showToast("first");
    const first = useUi.getState().toast!.id;
    useUi.getState().showToast("second");
    useUi.getState().dismissToast(first);
    expect(useUi.getState().toast?.message).toBe("second");
    useUi.getState().dismissToast(useUi.getState().toast!.id);
    expect(useUi.getState().toast).toBeNull();
  });
});
