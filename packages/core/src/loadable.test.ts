import { loadable, whenIdle } from "./loadable";

describe("loadable", () => {
  it("imports once however many ask, and tells the listeners when the module is there", async () => {
    const importer = vi.fn(() => Promise.resolve({ name: "module" }));
    const chunk = loadable(importer);
    const listener = vi.fn();
    chunk.subscribe(listener);
    expect(chunk.get()).toBeUndefined();

    const [first, second] = await Promise.all([chunk.load(), chunk.load()]);
    expect(first).toBe(second);
    expect(chunk.get()).toBe(first);
    expect(importer).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledTimes(1);

    await chunk.load();
    expect(importer).toHaveBeenCalledTimes(1);
  });

  it("forgets a failure, so the next ask tries again", async () => {
    const importer = vi.fn<() => Promise<string>>().mockRejectedValueOnce(new Error("offline")).mockResolvedValue("module");
    const chunk = loadable(importer);
    await expect(chunk.load()).rejects.toThrow("offline");
    expect(chunk.get()).toBeUndefined();
    await expect(chunk.load()).resolves.toBe("module");
    expect(chunk.get()).toBe("module");
  });

  it("warms up without throwing when the import fails", async () => {
    const chunk = loadable(() => Promise.reject(new Error("offline")));
    expect(() => chunk.warm()).not.toThrow();
    await Promise.resolve();
  });

  it("stops telling a listener that has unsubscribed", async () => {
    const chunk = loadable(() => Promise.resolve(1));
    const listener = vi.fn();
    chunk.subscribe(listener)();
    await chunk.load();
    expect(listener).not.toHaveBeenCalled();
  });
});

describe("whenIdle", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("runs after a short wait where there is no requestIdleCallback, and not once undone", () => {
    vi.useFakeTimers();
    const run = vi.fn();
    whenIdle(run);
    expect(run).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(run).toHaveBeenCalledTimes(1);

    const undone = vi.fn();
    whenIdle(undone)();
    vi.advanceTimersByTime(5000);
    expect(undone).not.toHaveBeenCalled();
  });

  it("uses the browser's idle time when it has some", () => {
    const requestIdleCallback = vi.fn((run: () => void) => (run(), 1));
    vi.stubGlobal("requestIdleCallback", requestIdleCallback);
    const run = vi.fn();
    whenIdle(run);
    expect(requestIdleCallback).toHaveBeenCalledTimes(1);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("does nothing for a reader who asked to save data", () => {
    vi.useFakeTimers();
    vi.stubGlobal("navigator", { ...navigator, connection: { saveData: true } });
    const run = vi.fn();
    whenIdle(run);
    vi.advanceTimersByTime(10_000);
    expect(run).not.toHaveBeenCalled();
  });

  it("waits for the page to finish loading", () => {
    vi.useFakeTimers();
    vi.spyOn(document, "readyState", "get").mockReturnValue("loading");
    const run = vi.fn();
    whenIdle(run);
    vi.advanceTimersByTime(10_000);
    expect(run).not.toHaveBeenCalled();
    window.dispatchEvent(new Event("load"));
    vi.advanceTimersByTime(1000);
    expect(run).toHaveBeenCalledTimes(1);
    vi.restoreAllMocks();
  });
});
