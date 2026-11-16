// How a new build reaches the reader (sw-updates.ts): a fake registration, fake timers, and a fresh copy of the module per test, since
// the launch's start and whether the page has been touched are the module's own.

type Module = typeof import("./sw-updates");

/** Web Locks as the page sees them: what this page asked to hold, and what the browser says is held across the guide's pages. */
let held: { name: string }[] = [];
const requested: string[] = [];

const fresh = async () => {
  // The last test's copy still listens for the reader's first action: one now retires it, so it neither counts nor asks for the lock later.
  window.dispatchEvent(new Event("pointerdown"));
  requested.length = 0;
  vi.resetModules();
  const updates: Module = await import("./sw-updates");
  const { useUi } = await import("./store/ui");
  const engine = await import("./sync/engine");
  return { ...updates, useUi, engine };
};

const registration = (installing = false) => ({ installing: installing ? {} : null, update: vi.fn(() => Promise.resolve()) }) as unknown as ServiceWorkerRegistration & { update: ReturnType<typeof vi.fn> };

const showPage = (state: "visible" | "hidden") => {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
  document.dispatchEvent(new Event("visibilitychange"));
};

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-11-16T10:00:00Z"));
  held = [];
  requested.length = 0;
  // A page the worker controls, as every page loaded through it is.
  Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: { controller: {} } });
  Object.defineProperty(navigator, "locks", {
    configurable: true,
    value: {
      query: () => Promise.resolve({ held }),
      request: (name: string) => {
        requested.push(name);
        return new Promise(() => {});
      },
    },
  });
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("looking for a new build while the guide stays open", () => {
  it("looks on the timer once an hour has passed, and not before", async () => {
    const { watchForUpdates, TICK, CHECK_EVERY } = await fresh();
    const reg = registration();
    const stop = watchForUpdates(reg);
    vi.advanceTimersByTime(CHECK_EVERY - TICK);
    expect(reg.update).not.toHaveBeenCalled();
    vi.advanceTimersByTime(TICK);
    expect(reg.update).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(CHECK_EVERY - TICK);
    expect(reg.update).toHaveBeenCalledTimes(1);
    stop();
  });

  it("looks when the guide comes back to the screen, at most once an hour", async () => {
    const { watchForUpdates, CHECK_EVERY } = await fresh();
    const reg = registration();
    const stop = watchForUpdates(reg);
    showPage("hidden");
    vi.setSystemTime(Date.now() + 20 * 60_000);
    showPage("visible");
    expect(reg.update).not.toHaveBeenCalled();
    showPage("hidden");
    vi.setSystemTime(Date.now() + CHECK_EVERY);
    expect(reg.update).not.toHaveBeenCalled();
    showPage("visible");
    expect(reg.update).toHaveBeenCalledTimes(1);
    showPage("visible");
    expect(reg.update).toHaveBeenCalledTimes(1);
    stop();
  });

  it("doesn't look while a new worker is installing, or offline", async () => {
    const { watchForUpdates, CHECK_EVERY } = await fresh();
    const installing = registration(true);
    let stop = watchForUpdates(installing);
    vi.setSystemTime(Date.now() + CHECK_EVERY);
    showPage("visible");
    expect(installing.update).not.toHaveBeenCalled();
    stop();

    vi.spyOn(navigator, "onLine", "get").mockReturnValue(false);
    const offline = registration();
    stop = watchForUpdates(offline);
    vi.setSystemTime(Date.now() + CHECK_EVERY);
    showPage("visible");
    expect(offline.update).not.toHaveBeenCalled();
    stop();
  });

  it("keeps one watch: a second registration replaces the first", async () => {
    const { watchForUpdates, CHECK_EVERY } = await fresh();
    const first = registration();
    watchForUpdates(first);
    const second = registration();
    const stop = watchForUpdates(second);
    vi.setSystemTime(Date.now() + CHECK_EVERY);
    showPage("visible");
    expect(first.update).not.toHaveBeenCalled();
    expect(second.update).toHaveBeenCalledTimes(1);
    stop();
  });

  it("shrugs off a look that fails", async () => {
    const { watchForUpdates, CHECK_EVERY } = await fresh();
    const reg = registration();
    reg.update.mockReturnValue(Promise.reject(new Error("offline")));
    const stop = watchForUpdates(reg);
    vi.setSystemTime(Date.now() + CHECK_EVERY);
    showPage("visible");
    await vi.runOnlyPendingTimersAsync();
    expect(reg.update).toHaveBeenCalledTimes(1);
    stop();
  });
});

describe("a new build that is waiting", () => {
  it("takes over at once while the guide is only just starting, untouched", async () => {
    const { settleUpdate } = await fresh();
    const apply = vi.fn();
    const prompt = vi.fn();
    settleUpdate(apply, prompt);
    await vi.advanceTimersByTimeAsync(0);
    expect(apply).toHaveBeenCalledTimes(1);
    expect(prompt).not.toHaveBeenCalled();
  });

  it("does nothing on a page no worker controls: a hard reload already runs the newest build, and a takeover wouldn't reload it", async () => {
    const { settleUpdate, FALLBACK } = await fresh();
    Object.defineProperty(navigator, "serviceWorker", { configurable: true, value: { controller: null } });
    const apply = vi.fn();
    const prompt = vi.fn();
    settleUpdate(apply, prompt);
    await vi.advanceTimersByTimeAsync(FALLBACK);
    expect(apply).not.toHaveBeenCalled();
    expect(prompt).not.toHaveBeenCalled();
  });

  it("asks after all if the page hasn't reloaded", async () => {
    const { settleUpdate, FALLBACK } = await fresh();
    const prompt = vi.fn();
    settleUpdate(vi.fn(), prompt);
    await vi.advanceTimersByTimeAsync(FALLBACK);
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it("lets go of the same build reported again while it is taking over", async () => {
    const { settleUpdate } = await fresh();
    const apply = vi.fn();
    settleUpdate(apply, vi.fn());
    settleUpdate(apply, vi.fn());
    await vi.advanceTimersByTimeAsync(0);
    settleUpdate(apply, vi.fn());
    await vi.advanceTimersByTimeAsync(0);
    expect(apply).toHaveBeenCalledTimes(1);
  });

  it("asks again for a later build once the reader was asked", async () => {
    const { settleUpdate } = await fresh();
    window.dispatchEvent(new Event("pointerdown"));
    const prompt = vi.fn();
    settleUpdate(vi.fn(), prompt);
    await vi.advanceTimersByTimeAsync(0);
    settleUpdate(vi.fn(), prompt);
    await vi.advanceTimersByTimeAsync(0);
    expect(prompt).toHaveBeenCalledTimes(2);
  });

  it("asks while another page of the guide is in use, since taking over would reload it too", async () => {
    const { settleUpdate, IN_USE } = await fresh();
    held = [{ name: IN_USE }];
    const apply = vi.fn();
    const prompt = vi.fn();
    settleUpdate(apply, prompt);
    await vi.advanceTimersByTimeAsync(0);
    expect(apply).not.toHaveBeenCalled();
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it("asks where the browser can't say whether another page is in use", async () => {
    const { settleUpdate } = await fresh();
    Object.defineProperty(navigator, "locks", { configurable: true, value: undefined });
    const apply = vi.fn();
    const prompt = vi.fn();
    settleUpdate(apply, prompt);
    await vi.advanceTimersByTimeAsync(0);
    expect(apply).not.toHaveBeenCalled();
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it("marks a page in use from the reader's first action, for the guide's other pages to see", async () => {
    const { IN_USE } = await fresh();
    expect(requested).toEqual([]);
    window.dispatchEvent(new Event("pointerdown"));
    window.dispatchEvent(new Event("keydown"));
    expect(requested).toEqual([IN_USE]);
  });

  it.each([
    ["pointerdown", () => window.dispatchEvent(new Event("pointerdown"))],
    ["keydown", () => document.body.dispatchEvent(new KeyboardEvent("keydown", { bubbles: true }))],
    ["wheel", () => window.dispatchEvent(new Event("wheel"))],
    ["touchstart", () => window.dispatchEvent(new Event("touchstart"))],
  ])("asks once the reader has done something (%s)", async (_kind, act) => {
    const { settleUpdate } = await fresh();
    act();
    const apply = vi.fn();
    const prompt = vi.fn();
    settleUpdate(apply, prompt);
    await vi.advanceTimersByTimeAsync(0);
    expect(apply).not.toHaveBeenCalled();
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it("asks once the launch is over, touched or not", async () => {
    const { settleUpdate, LAUNCH_WINDOW } = await fresh();
    vi.setSystemTime(Date.now() + LAUNCH_WINDOW + 1);
    const apply = vi.fn();
    const prompt = vi.fn();
    settleUpdate(apply, prompt);
    await vi.advanceTimersByTimeAsync(0);
    expect(apply).not.toHaveBeenCalled();
    expect(prompt).toHaveBeenCalledTimes(1);
  });

  it("asks while a dialog is open", async () => {
    const { settleUpdate, useUi } = await fresh();
    useUi.getState().openDialog({ kind: "settings" });
    const apply = vi.fn();
    const prompt = vi.fn();
    settleUpdate(apply, prompt);
    await vi.advanceTimersByTimeAsync(0);
    expect(apply).not.toHaveBeenCalled();
    expect(prompt).toHaveBeenCalledTimes(1);
    useUi.getState().closeDialog();
  });

  it("waits for a sync round under way to finish, then takes over", async () => {
    const { settleUpdate, engine, RETRY } = await fresh();
    let busy = true;
    vi.spyOn(engine, "syncing").mockImplementation(() => busy);
    const apply = vi.fn();
    const prompt = vi.fn();
    settleUpdate(apply, prompt);
    await vi.advanceTimersByTimeAsync(RETRY * 3);
    expect(apply).not.toHaveBeenCalled();
    busy = false;
    await vi.advanceTimersByTimeAsync(RETRY);
    expect(apply).toHaveBeenCalledTimes(1);
    expect(prompt).not.toHaveBeenCalled();
  });

  it("asks instead if the reader acts while it waits for the sync round", async () => {
    const { settleUpdate, engine, RETRY } = await fresh();
    vi.spyOn(engine, "syncing").mockReturnValue(true);
    const apply = vi.fn();
    const prompt = vi.fn();
    settleUpdate(apply, prompt);
    await vi.advanceTimersByTimeAsync(0);
    window.dispatchEvent(new Event("pointerdown"));
    await vi.advanceTimersByTimeAsync(RETRY);
    expect(apply).not.toHaveBeenCalled();
    expect(prompt).toHaveBeenCalledTimes(1);
  });
});
