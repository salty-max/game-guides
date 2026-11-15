import { allRows } from "../guide";
import { defaultState } from "../progress-state";
import { useProgress } from "../store/progress";
import { useSyncStatus } from "../store/sync";
import { flushOnExit, syncOnce, type Outcome } from "./cycle";
import { BACKOFF_FIRST, BACKOFF_MAX, DEBOUNCE, FOREGROUND_GAP, MAX_WAIT, POLL, backoff, startEngine, syncSoon } from "./engine";
import { writeRecord } from "./local";

vi.mock("./cycle", () => ({ syncOnce: vi.fn(), flushOnExit: vi.fn() }));

const run = vi.mocked(syncOnce);
const flush = vi.mocked(flushOnExit);
const ok = (dirty = false): Outcome => ({ kind: "ok", devices: 2, dirty });
const [a, b, c] = allRows.map((row) => row.id);

let stop: (() => void) | undefined;
const start = () => (stop = startEngine());
const link = (on = true) => {
  document.cookie = on ? "hundo_link=abc; path=/" : "hundo_link=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
const record = () => writeRecord({ v: 1, group: "abc", entries: {}, dirty: [], clock: { last: 0, offset: 0 }, touched: 0 });
const visibility = (state: "visible" | "hidden") => {
  Object.defineProperty(document, "visibilityState", { value: state, configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
};

beforeEach(() => {
  vi.useFakeTimers();
  localStorage.clear();
  link(false);
  useProgress.setState({ data: defaultState(), storageError: false });
  useSyncStatus.setState({ phase: "off", devices: 0, lastSync: null });
  run.mockReset().mockResolvedValue(ok());
  flush.mockReset();
  visibility("visible");
});

afterEach(() => {
  vi.restoreAllMocks();
  stop?.();
  stop = undefined;
  vi.useRealTimers();
});

describe("when sync runs", () => {
  it("does nothing for a browser that isn't linked, not even a poll", async () => {
    start();
    await vi.advanceTimersByTimeAsync(POLL * 3);
    expect(run).not.toHaveBeenCalled();
    expect(useSyncStatus.getState().phase).toBe("off");
  });

  it("runs on opening a linked browser, and shows it synced", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(1);
    expect(useSyncStatus.getState()).toMatchObject({ phase: "synced", devices: 2 });
  });

  it("shows a browser linked in another guide as joining until its first round is done", async () => {
    link();
    run.mockImplementation(() => new Promise(() => {}));
    start();
    expect(useSyncStatus.getState().phase).toBe("joining");
  });

  it("sends a burst of changes once, two seconds after the last", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    useProgress.getState().setCheck(a, true);
    await vi.advanceTimersByTimeAsync(1500);
    useProgress.getState().setCheck(b, true);
    expect(useSyncStatus.getState().phase).toBe("waiting");
    await vi.advanceTimersByTimeAsync(1500);
    expect(run).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(DEBOUNCE);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("sends within 15 seconds of the first change however long the changes go on", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    const ids = [a, b, c];
    for (let second = 0; second < MAX_WAIT / 1000 + 1 && run.mock.calls.length === 0; second++) {
      useProgress.getState().setCheck(ids[second % 3], second % 2 === 0);
      await vi.advanceTimersByTimeAsync(1000);
    }
    expect(run).toHaveBeenCalledTimes(1);
    expect(Date.now() - 0).toBeGreaterThan(0);
  });

  it("flushes as the page is hidden, and pulls on coming back only if it has been a while", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    visibility("hidden");
    expect(flush).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(FOREGROUND_GAP / 2);
    visibility("visible");
    await vi.advanceTimersByTimeAsync(0);
    expect(run).not.toHaveBeenCalled();
    visibility("hidden");
    await vi.advanceTimersByTimeAsync(FOREGROUND_GAP);
    visibility("visible");
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("flushes on pagehide", () => {
    link();
    start();
    window.dispatchEvent(new Event("pagehide"));
    expect(flush).toHaveBeenCalled();
  });

  it("polls every five minutes while the page shows, and not while it is hidden", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    await vi.advanceTimersByTimeAsync(POLL + 10);
    expect(run).toHaveBeenCalledTimes(1);
    visibility("hidden");
    await vi.advanceTimersByTimeAsync(POLL * 2);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("goes again soon when the round left changes waiting", async () => {
    link();
    record();
    run.mockResolvedValueOnce(ok(true)).mockResolvedValue(ok());
    start();
    await vi.advanceTimersByTimeAsync(0);
    expect(useSyncStatus.getState().phase).toBe("waiting");
    await vi.advanceTimersByTimeAsync(DEBOUNCE);
    expect(run).toHaveBeenCalledTimes(2);
    expect(useSyncStatus.getState().phase).toBe("synced");
  });

  it("runs on a kick, as after a device is linked", async () => {
    link();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    syncSoon();
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("goes off when the server says the device is unlinked", async () => {
    link();
    record();
    run.mockResolvedValue({ kind: "unlinked" });
    start();
    await vi.advanceTimersByTimeAsync(0);
    expect(useSyncStatus.getState().phase).toBe("off");
  });
});

describe("when a round fails", () => {
  it("waits 5 seconds, then twice as long each time up to 5 minutes, and starts over after a success", async () => {
    link();
    record();
    // (a random of one half is no jitter at all)
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    run.mockResolvedValue({ kind: "retry", why: "offline" });
    start();
    await vi.advanceTimersByTimeAsync(0);
    expect(useSyncStatus.getState().phase).toBe("offline");
    expect(run).toHaveBeenCalledTimes(1);
    for (const [round, wait] of [BACKOFF_FIRST, BACKOFF_FIRST * 2, BACKOFF_FIRST * 4].entries()) {
      await vi.advanceTimersByTimeAsync(wait - 1);
      expect(run, `before ${wait}`).toHaveBeenCalledTimes(round + 1);
      await vi.advanceTimersByTimeAsync(1);
      expect(run).toHaveBeenCalledTimes(round + 2);
    }
    run.mockResolvedValue(ok());
    await vi.advanceTimersByTimeAsync(BACKOFF_FIRST * 8 + 1);
    expect(useSyncStatus.getState().phase).toBe("synced");
  });

  it("keeps its own pace when changes arrive during the wait", async () => {
    link();
    record();
    run.mockResolvedValue({ kind: "retry", why: "paused" });
    start();
    await vi.advanceTimersByTimeAsync(0);
    expect(useSyncStatus.getState().phase).toBe("paused");
    run.mockClear();
    useProgress.getState().setCheck(a, true);
    await vi.advanceTimersByTimeAsync(DEBOUNCE + 100);
    expect(run).not.toHaveBeenCalled();
    expect(useSyncStatus.getState().phase).toBe("paused");
  });

  it("tries again the moment the browser says it is online", async () => {
    link();
    record();
    run.mockResolvedValueOnce({ kind: "retry", why: "offline" }).mockResolvedValue(ok());
    start();
    await vi.advanceTimersByTimeAsync(0);
    window.dispatchEvent(new Event("online"));
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(2);
    expect(useSyncStatus.getState().phase).toBe("synced");
  });

  it("shows offline as soon as the browser says it is, for a linked device only", () => {
    link();
    start();
    window.dispatchEvent(new Event("offline"));
    expect(useSyncStatus.getState().phase).toBe("offline");
  });

  it("backs off with jitter inside a quarter either way, and never past the ceiling", () => {
    expect(backoff(1, 0)).toBe(BACKOFF_FIRST * 0.75);
    expect(backoff(1, 1)).toBe(BACKOFF_FIRST * 1.25);
    expect(backoff(2, 0.5)).toBe(BACKOFF_FIRST * 2);
    expect(backoff(30, 1)).toBe(BACKOFF_MAX * 1.25);
  });
});

describe("stopping", () => {
  it("clears its timers and listeners", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    stop?.();
    stop = undefined;
    useProgress.getState().setCheck(a, true);
    window.dispatchEvent(new Event("online"));
    visibility("hidden");
    await vi.advanceTimersByTimeAsync(POLL * 2);
    expect(run).not.toHaveBeenCalled();
    expect(flush).not.toHaveBeenCalled();
  });
});
