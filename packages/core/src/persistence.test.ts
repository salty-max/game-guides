import { chapters } from "./guide";
import { ASK_GAP, PERSIST_KEY, askAfterFirstTick, reloadFromAnotherTab, requestPersistence, usePersistence } from "./persistence";
import { STORAGE_KEY, defaultState } from "./progress-state";
import { useProgress } from "./store/progress";

const DAY = 24 * 60 * 60 * 1000;
const NOW = 1_800_000_000_000;
const firstRow = chapters[0].groups[0].rows[0];

/** A StorageManager that answers persisted() with `granted` and persist() with `grant`. */
function fakeStorage(granted: boolean, grant = false) {
  const storage = { persisted: vi.fn(async () => granted), persist: vi.fn(async () => grant) };
  Object.defineProperty(navigator, "storage", { value: storage, configurable: true });
  return storage;
}

beforeEach(() => {
  localStorage.clear();
  useProgress.setState({ data: defaultState(), storageError: false });
  usePersistence.setState({ persisted: null });
});

afterEach(() => {
  Reflect.deleteProperty(navigator, "storage");
});

describe("requestPersistence", () => {
  it("asks once, notes when, and keeps the answer", async () => {
    const storage = fakeStorage(false, true);
    await requestPersistence(storage, NOW);
    expect(storage.persist).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(PERSIST_KEY)).toBe(`${NOW} tab`);
    expect(usePersistence.getState().persisted).toBe(true);
  });

  it("doesn't ask when storage is persistent already", async () => {
    const storage = fakeStorage(true);
    await requestPersistence(storage, NOW);
    expect(storage.persist).not.toHaveBeenCalled();
    expect(usePersistence.getState().persisted).toBe(true);
  });

  it("asks again only after 30 days", async () => {
    const storage = fakeStorage(false);
    localStorage.setItem(PERSIST_KEY, `${NOW - 29 * DAY} tab`);
    await requestPersistence(storage, NOW);
    expect(storage.persist).not.toHaveBeenCalled();

    localStorage.setItem(PERSIST_KEY, `${NOW - ASK_GAP} tab`);
    await requestPersistence(storage, NOW);
    expect(storage.persist).toHaveBeenCalledTimes(1);
    expect(usePersistence.getState().persisted).toBe(false);
  });

  it("asks when the note is unreadable, and waits when it's in the future", async () => {
    const storage = fakeStorage(false);
    localStorage.setItem(PERSIST_KEY, "garbage");
    await requestPersistence(storage, NOW);
    expect(storage.persist).toHaveBeenCalledTimes(1);

    localStorage.setItem(PERSIST_KEY, `${NOW + DAY} tab`);
    await requestPersistence(storage, NOW);
    expect(storage.persist).toHaveBeenCalledTimes(1);
  });

  it("asks once more from an installed app if the last ask came from a tab", async () => {
    const storage = fakeStorage(false);
    localStorage.setItem(PERSIST_KEY, `${NOW - DAY} tab`);
    await requestPersistence(storage, NOW, true);
    expect(storage.persist).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem(PERSIST_KEY)).toBe(`${NOW} app`);

    await requestPersistence(storage, NOW + DAY, true);
    await requestPersistence(storage, NOW + DAY, false);
    expect(storage.persist).toHaveBeenCalledTimes(1);
  });

  it("stays quiet when the browser refuses or has no Storage API", async () => {
    const storage = fakeStorage(false);
    storage.persist.mockRejectedValueOnce(new Error("refused"));
    await expect(requestPersistence(storage, NOW)).resolves.toBeUndefined();
    expect(usePersistence.getState().persisted).toBeNull();

    localStorage.clear();
    storage.persisted.mockRejectedValueOnce(new Error("refused"));
    await expect(requestPersistence(storage, NOW)).resolves.toBeUndefined();

    Reflect.deleteProperty(navigator, "storage");
    await expect(requestPersistence()).resolves.toBeUndefined();
  });

  it("doesn't ask when storage is blocked", async () => {
    const storage = fakeStorage(false);
    const blocked = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    try {
      await expect(requestPersistence(storage, NOW)).resolves.toBeUndefined();
      expect(storage.persist).not.toHaveBeenCalled();
    } finally {
      blocked.mockRestore();
    }
  });
});

describe("askAfterFirstTick", () => {
  it("requests on the first tick only, not on other changes or unticks", () => {
    const request = vi.fn();
    const stop = askAfterFirstTick(request);
    const { setCheck, visitChapter } = useProgress.getState();
    visitChapter(2);
    expect(request).not.toHaveBeenCalled();

    setCheck(firstRow.id, true);
    setCheck(firstRow.id, false);
    setCheck(firstRow.id, true);
    expect(request).toHaveBeenCalledTimes(1);
    stop();
  });

  it("waits for a new tick when the visit starts with progress", () => {
    useProgress.setState({ data: { ...defaultState(), checks: { [firstRow.id]: true } } });
    const request = vi.fn();
    const stop = askAfterFirstTick(request);
    useProgress.getState().setCheck(firstRow.id, false);
    expect(request).not.toHaveBeenCalled();
    useProgress.getState().setCheck(firstRow.id, true);
    expect(request).toHaveBeenCalledTimes(1);
    stop();
  });

  it("doesn't count a tick another tab saved", () => {
    const request = vi.fn();
    const stop = askAfterFirstTick(request);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...defaultState(), checks: { [firstRow.id]: true } }));
    reloadFromAnotherTab();
    expect(useProgress.getState().data.checks).toEqual({ [firstRow.id]: true });
    expect(request).not.toHaveBeenCalled();

    useProgress.getState().setCheck(chapters[0].groups[0].rows[1].id, true);
    expect(request).toHaveBeenCalledTimes(1);
    stop();
  });
});
