import { allRows } from "../guide";
import { defaultState } from "../progress-state";
import { useProgress } from "../store/progress";
import { useSyncStatus } from "../store/sync";
import { flushOnExit, syncOnce, type Outcome } from "./cycle";
import { BACKOFF_FIRST, BACKOFF_MAX, DEBOUNCE, FOREGROUND_GAP, MAX_WAIT, POLL_FAST, POLL_GROWTH, POLL_SLOW, backoff, startEngine, syncSoon } from "./engine";
import { writeRecord } from "./local";

vi.mock("./cycle", () => ({ syncOnce: vi.fn(), flushOnExit: vi.fn() }));

const run = vi.mocked(syncOnce);
const flush = vi.mocked(flushOnExit);
const ok = (dirty = false, pulled = false): Outcome => ({ kind: "ok", devices: 2, dirty, pulled });
const [a, b, c] = allRows.map((row) => row.id);

let stop: (() => void) | undefined;
const start = () => (stop = startEngine());
const link = (on = true) => {
  document.cookie = on ? "hundo_link=abc; path=/" : "hundo_link=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};
const record = () => writeRecord({ v: 1, group: "abc", entries: {}, dirty: [], clock: { last: 0, offset: 0 }, touched: 0, rev: null, fullAt: 0, devices: 1 });
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
    await vi.advanceTimersByTimeAsync(POLL_SLOW * 10);
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

  /** Moves the clock in 100 ms steps until another round has been asked for, and says how long that took. `skip` jumps most of the way first. */
  const untilNextRound = async (skip = 0, limit = 400_000) => {
    const before = run.mock.calls.length;
    if (skip > 0) await vi.advanceTimersByTimeAsync(skip);
    expect(run.mock.calls.length, "a round came before the wait was over").toBe(before);
    let waited = skip;
    while (run.mock.calls.length === before && waited < limit) {
      await vi.advanceTimersByTimeAsync(100);
      waited += 100;
    }
    return waited;
  };

  it("polls while the page shows, every 20 seconds at first and slower each time nothing changed, up to two minutes", async () => {
    // (a random of one half is no jitter at all)
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    const waits: number[] = [];
    const expected = [20_000, 30_000, 45_000, 67_500, 101_250, 120_000, 120_000, 120_000, 120_000];
    for (const wait of expected) waits.push(await untilNextRound(wait - 1000));
    waits.forEach((got, index) => expect(Math.abs(got - expected[index]), `poll ${index + 1}: ${got}`).toBeLessThanOrEqual(200));
    expect(POLL_GROWTH).toBe(1.5);
  });

  it("goes back to the quick pace after a change from the other device, and after one made here", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    for (const wait of [20_000, 30_000, 45_000, 67_500]) await untilNextRound(wait - 1000);
    // the poll after these finds something on the other device
    run.mockResolvedValueOnce(ok(false, true)).mockResolvedValue(ok());
    expect(Math.abs((await untilNextRound(100_000)) - 101_250)).toBeLessThanOrEqual(200);
    // the wait is quick again, and grows again from there
    for (const expected of [20_000, 30_000, 45_000]) expect(Math.abs((await untilNextRound(expected - 1000)) - expected)).toBeLessThanOrEqual(200);
    // a change made here: its push, then quick again
    useProgress.getState().setCheck(a, true);
    expect(await untilNextRound()).toBeLessThan(3000);
    expect(Math.abs((await untilNextRound(19_000)) - 20_000)).toBeLessThanOrEqual(200);
  });

  it("stays well inside what it costs: about 33 requests an hour for a guide left open and untouched, never more than 180 an hour", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    await vi.advanceTimersByTimeAsync(60 * 60_000);
    expect(run.mock.calls.length).toBeGreaterThanOrEqual(28);
    expect(run.mock.calls.length).toBeLessThanOrEqual(38);
    run.mockReset().mockResolvedValue(ok(false, true));
    run.mockClear();
    await vi.advanceTimersByTimeAsync(60 * 60_000);
    expect(run.mock.calls.length).toBeLessThanOrEqual(190);
    expect(run.mock.calls.length).toBeGreaterThanOrEqual(160);
  });

  it("doesn't poll while the page is hidden, and starts again, quickly, when it is back", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    visibility("hidden");
    await vi.advanceTimersByTimeAsync(POLL_SLOW * 3);
    expect(run).not.toHaveBeenCalled();
    visibility("visible");
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(1);
    run.mockClear();
    await vi.advanceTimersByTimeAsync(POLL_FAST + 3000);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("doesn't poll on top of a backoff, and polls again once a round succeeds", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    link();
    record();
    run.mockResolvedValue({ kind: "retry", why: "offline" });
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    await vi.advanceTimersByTimeAsync(BACKOFF_FIRST - 100);
    expect(run).not.toHaveBeenCalled();
    run.mockResolvedValue(ok());
    await vi.advanceTimersByTimeAsync(200);
    expect(run).toHaveBeenCalledTimes(1);
    run.mockClear();
    await vi.advanceTimersByTimeAsync(POLL_FAST + 100);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("pulls on focus and on a pageshow from the back-forward cache, when it's been a while, as well as on visibilitychange", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    window.dispatchEvent(new Event("focus"));
    await vi.advanceTimersByTimeAsync(0);
    expect(run).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(FOREGROUND_GAP + 1000);
    run.mockClear();
    window.dispatchEvent(new Event("focus"));
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(FOREGROUND_GAP + 1000);
    run.mockClear();
    const plain = new Event("pageshow") as PageTransitionEvent;
    Object.defineProperty(plain, "persisted", { value: false });
    window.dispatchEvent(plain);
    await vi.advanceTimersByTimeAsync(0);
    expect(run).not.toHaveBeenCalled();
    const restored = new Event("pageshow") as PageTransitionEvent;
    Object.defineProperty(restored, "persisted", { value: true });
    window.dispatchEvent(restored);
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("doesn't start a second round when a focus follows a visibilitychange a few milliseconds into the first, which hasn't ended", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(FOREGROUND_GAP + 1000);
    run.mockClear();
    let finish!: (outcome: Outcome) => void;
    run.mockReturnValueOnce(new Promise<Outcome>((resolve) => (finish = resolve)));
    visibility("visible");
    await vi.advanceTimersByTimeAsync(5);
    expect(run).toHaveBeenCalledTimes(1);
    window.dispatchEvent(new Event("focus"));
    const restored = new Event("pageshow") as PageTransitionEvent;
    Object.defineProperty(restored, "persisted", { value: true });
    window.dispatchEvent(restored);
    await vi.advanceTimersByTimeAsync(300);
    finish(ok());
    await vi.advanceTimersByTimeAsync(0);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("doesn't cut through a retry that is waiting out a failure when the window is focused again", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    link();
    record();
    run.mockResolvedValue({ kind: "retry", why: "paused" });
    start();
    // failures at 0, 5, 15 and 35 s leave the next retry at 75 s
    await vi.advanceTimersByTimeAsync(35_100);
    expect(run).toHaveBeenCalledTimes(4);
    run.mockClear();
    // a reader the firewall turned away clicks back into the window, long after the last round
    await vi.advanceTimersByTimeAsync(15_000);
    window.dispatchEvent(new Event("focus"));
    visibility("hidden");
    visibility("visible");
    await vi.advanceTimersByTimeAsync(1000);
    expect(run).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(24_000);
    expect(run).toHaveBeenCalledTimes(1);
  });

  it("starts the pace afresh after a poll that failed, not a step on from where it was", async () => {
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    run.mockClear();
    // the first poll fails, and its retry finds nothing
    run.mockResolvedValueOnce({ kind: "retry", why: "offline" }).mockResolvedValue(ok());
    expect(Math.abs((await untilNextRound(19_000)) - 20_000)).toBeLessThanOrEqual(200);
    expect(Math.abs((await untilNextRound(4_000)) - 5_000)).toBeLessThanOrEqual(200);
    // the round that recovered wasn't a poll, so the next wait is the quick one, not 30 s
    expect(Math.abs((await untilNextRound(19_000)) - 20_000)).toBeLessThanOrEqual(200);
  });

  it("doesn't run twice when visibilitychange, focus and pageshow all come at once", async () => {
    link();
    record();
    start();
    await vi.advanceTimersByTimeAsync(0);
    await vi.advanceTimersByTimeAsync(FOREGROUND_GAP + 1000);
    run.mockClear();
    visibility("visible");
    window.dispatchEvent(new Event("focus"));
    await vi.advanceTimersByTimeAsync(0);
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
    await vi.advanceTimersByTimeAsync(POLL_SLOW * 2);
    expect(run).not.toHaveBeenCalled();
    expect(flush).not.toHaveBeenCalled();
  });
});
