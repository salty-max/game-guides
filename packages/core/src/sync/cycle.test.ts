import { CHAPTER_COUNT, allRows } from "../guide";
import { STORAGE_KEY, defaultState } from "../progress-state";
import { useProgress } from "../store/progress";
import { Browser, makeWorld, pair } from "../test/sync-world";
import { askAfterFirstTick } from "../persistence";
import { flushOnExit, syncOnce } from "./cycle";
import { readRecord, SYNC_KEY } from "./local";

const [r1, r2, r3, r4] = allRows.map((row) => row.id);
const checks = () => Object.keys(useProgress.getState().data.checks).sort();
const sorted = (...ids: string[]) => ids.sort();

let world: ReturnType<typeof makeWorld>;
let a: Browser;
let b: Browser;

beforeEach(() => {
  vi.useFakeTimers({ now: Date.UTC(2026, 10, 15, 12, 0, 0), toFake: ["Date"] });
  localStorage.clear();
  useProgress.setState({ data: defaultState(), storageError: false });
  world = makeWorld();
  a = new Browser(world);
  b = new Browser(world);
});

afterEach(() => {
  vi.useRealTimers();
});

const tick = (browser: Browser, ids: string[], checked = true) => browser.run(() => useProgress.getState().setMany(ids, checked));
const sync = (browser: Browser) => browser.run(() => syncOnce());
const checked = (browser: Browser) => browser.run(checks);
const later = (ms = 5000) => vi.setSystemTime(Date.now() + ms);

describe("a device that was never linked", () => {
  it("makes no request and writes nothing for sync, however much it changes", async () => {
    await tick(a, [r1, r2]);
    expect(await a.run(() => syncOnce())).toEqual({ kind: "off" });
    expect(a.calls).toEqual([]);
    expect(await a.run(() => localStorage.getItem(SYNC_KEY))).toBeNull();
  });
});

describe("linking two devices", () => {
  it("merges what each has, and unticks nothing", async () => {
    await tick(a, [r1, r2]);
    await tick(b, [r3]);
    await pair(a, b);
    expect(await sync(a)).toMatchObject({ kind: "ok", dirty: false });
    later();
    expect(await sync(b)).toMatchObject({ kind: "ok", dirty: false });
    later();
    await sync(a);
    expect(await checked(a)).toEqual(sorted(r1, r2, r3));
    expect(await checked(b)).toEqual(sorted(r1, r2, r3));
  });

  it("keeps a row ticked here that the group had unticked before", async () => {
    await tick(a, [r1]);
    await pair(a, b);
    await sync(a);
    later();
    await tick(a, [r1], false);
    await sync(a);
    // b ticked r1 before it ever linked: its tick is the newest thing there is, and joining must not undo it
    later();
    await tick(b, [r1]);
    later();
    await sync(b);
    expect(await checked(b)).toEqual([r1]);
    later();
    await sync(a);
    expect(await checked(a)).toEqual([r1]);
  });

  it("takes the higher ceiling of the two, and never hides what one of them has revealed", async () => {
    const [low, high] = [1 + Math.max(1, Math.floor(CHAPTER_COUNT / 3)), 1 + Math.max(2, Math.floor(CHAPTER_COUNT / 2))];
    await a.run(() => useProgress.getState().saveSettings({ spoilers: true, ceiling: low }));
    await b.run(() => useProgress.getState().saveSettings({ spoilers: true, ceiling: high }));
    await pair(a, b);
    await sync(a);
    later();
    await sync(b);
    later();
    await sync(a);
    const ceilings = [await a.run(() => useProgress.getState().data.ceiling), await b.run(() => useProgress.getState().data.ceiling)];
    expect(ceilings).toEqual([high, high]);
  });

  it("leaves a fresh device's defaults out, so it can't pull the group back to chapter 1", async () => {
    await a.run(() => useProgress.getState().saveSettings({ spoilers: true, ceiling: Math.min(3, CHAPTER_COUNT) }));
    await pair(a, b);
    await sync(a);
    later();
    await sync(b);
    expect(await b.run(() => useProgress.getState().data.ceiling)).toBe(Math.min(3, CHAPTER_COUNT));
  });
});

describe("a linked pair", () => {
  beforeEach(async () => {
    await tick(a, [r1]);
    await pair(a, b);
    await sync(a);
    later();
    await sync(b);
    later();
  });

  it("carries a tick one way and an untick back", async () => {
    await tick(a, [r2]);
    await sync(a);
    later();
    await sync(b);
    expect(await checked(b)).toEqual(sorted(r1, r2));
    later();
    await tick(b, [r1], false);
    await sync(b);
    later();
    await sync(a);
    expect(await checked(a)).toEqual([r2]);
  });

  it("keeps ticks made on both while apart", async () => {
    await tick(a, [r2]);
    await tick(b, [r3]);
    await sync(a);
    later();
    await sync(b);
    later();
    await sync(a);
    expect(await checked(a)).toEqual(sorted(r1, r2, r3));
    expect(await checked(b)).toEqual(sorted(r1, r2, r3));
  });

  it("lets the later change win when both touch the same row", async () => {
    await tick(a, [r1], false);
    later();
    await tick(b, [r1], false);
    later();
    await tick(b, [r1], true);
    await sync(b);
    later();
    await sync(a);
    expect(await checked(a)).toEqual([r1]);
  });

  it("applies what it pulls without sending it back", async () => {
    await tick(a, [r4]);
    await sync(a);
    later();
    b.calls = [];
    await sync(b);
    expect(await checked(b)).toContain(r4);
    expect((await b.run(() => readRecord()))?.dirty).toEqual([]);
    later();
    await sync(b);
    expect(b.calls.every((call) => Object.keys(call.body.entries as object).length === 0)).toBe(true);
  });

  it("sends a change made while a request is out in the same cycle, and loses nothing", async () => {
    await tick(a, [r2]);
    await a.run(async () => {
      const real = a.fetch;
      let first = true;
      vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
        // the page changes again while the first request is out
        if (first) useProgress.getState().setCheck(r3, true);
        first = false;
        return real(input, init);
      });
      expect(await syncOnce()).toMatchObject({ kind: "ok", dirty: false });
      expect(readRecord()?.dirty).toEqual([]);
    });
    later();
    await sync(b);
    expect(await checked(b)).toEqual(sorted(r1, r2, r3));
  });
});

describe("when the service is not there", () => {
  beforeEach(async () => {
    await tick(a, [r1]);
    await pair(a, b);
    await sync(a);
    later();
  });

  it("keeps the change and says what kind of trouble it is", async () => {
    await tick(a, [r2]);
    a.fail = () => new TypeError("fetch failed");
    expect(await sync(a)).toEqual({ kind: "retry", why: "offline" });
    a.fail = () => new Response(JSON.stringify({ error: "limit" }), { status: 429 });
    expect(await sync(a)).toEqual({ kind: "retry", why: "paused" });
    a.fail = () => new Response("oops", { status: 502 });
    expect(await sync(a)).toEqual({ kind: "retry", why: "error" });
    expect((await a.run(() => readRecord()))?.dirty).toEqual([`c:${r2}`]);
    expect(await checked(a)).toEqual(sorted(r1, r2));
    a.fail = null;
    expect(await sync(a)).toMatchObject({ kind: "ok", dirty: false });
    later();
    await sync(b);
    expect(await checked(b)).toEqual(sorted(r1, r2));
  });

  it("unlinks only on the server's own unlinked, and keeps progress when it does", async () => {
    a.fail = () => new Response(JSON.stringify({ error: "server" }), { status: 401 });
    expect(await sync(a)).toEqual({ kind: "retry", why: "error" });
    expect(await a.run(() => readRecord())).not.toBeNull();
    a.fail = () => new Response(JSON.stringify({ error: "unlinked" }), { status: 401 });
    expect(await sync(a)).toEqual({ kind: "unlinked" });
    expect(await a.run(() => readRecord())).toBeNull();
    expect(await checked(a)).toEqual([r1]);
  });

  it("drops its ledger when the link cookie is gone, and keeps progress", async () => {
    a.device.jar.delete("hundo_link");
    expect(await sync(a)).toEqual({ kind: "off" });
    expect(await a.run(() => readRecord())).toBeNull();
    expect(await checked(a)).toEqual([r1]);
  });

  it("is unlinked on the next sync of a device whose group was deleted", async () => {
    await b.run(async () => {
      const { forgetGroup } = await import("./pairing");
      expect(await forgetGroup()).toBe(true);
    });
    expect(await sync(a)).toEqual({ kind: "unlinked" });
    expect(await checked(a)).toEqual([r1]);
  });
});

describe("a device whose clock is far off", () => {
  it("still orders its changes after the ones it has seen", async () => {
    await tick(a, [r1]);
    await pair(a, b);
    await sync(a);
    later();
    await sync(b);
    // b's clock runs ten minutes slow: its untick is still after the tick it pulled
    vi.setSystemTime(Date.now() - 10 * 60_000);
    await tick(b, [r1], false);
    await sync(b);
    vi.setSystemTime(Date.now() + 10 * 60_000 + 5000);
    await sync(a);
    expect(await checked(a)).toEqual([]);
  });
});

describe("a device that moves to another group", () => {
  it("joins the new group afresh, so an untick from the old one can't untick what the new one has ticked", async () => {
    // the tablet ticked r1 in its group first; the phone ticked it and unticked it, later, in its own
    const tablet = new Browser(world);
    const tablet2 = new Browser(world);
    await tick(tablet, [r1]);
    await pair(tablet, tablet2);
    await sync(tablet);
    later(10_000);
    await tick(a, [r1]);
    await pair(a, b);
    await sync(a);
    later(10_000);
    await tick(a, [r1], false);
    await sync(a);
    later(10_000);
    // the phone types the tablet's code: the server moves it into the tablet's group
    const { startCode, claimCode } = await import("./pairing");
    const shown = await tablet.run(() => startCode());
    expect(shown.ok && shown.code).toBeTruthy();
    const claimed = await a.run(() => claimCode(shown.ok ? shown.code : ""));
    expect(claimed).toMatchObject({ ok: true, moved: true });
    later(5000);
    expect(await sync(a)).toMatchObject({ kind: "ok", dirty: false });
    later(5000);
    await sync(tablet);
    await sync(tablet2);
    expect(await checked(tablet)).toEqual([r1]);
    expect(await checked(tablet2)).toEqual([r1]);
    // the phone's own untick is gone from the new group's point of view, and it takes what the group has
    expect(await checked(a)).toEqual([r1]);
  });

  it("sends nothing as the page closes from a ledger of the old group", async () => {
    await tick(a, [r1]);
    await pair(a, b);
    await sync(a);
    await tick(a, [r2]);
    await a.run(() => {
      // the link cookie now names another group than the ledger does
      document.cookie = "hundo_link=another-group; path=/";
      a.calls = [];
      flushOnExit();
      expect(a.calls).toEqual([]);
    });
  });
});

describe("a first sync", () => {
  it("starts from what another tab has saved that this one hasn't heard of yet", async () => {
    await tick(a, [r1]);
    await pair(a, b);
    await a.run(async () => {
      // another tab ticked r2 and saved it; this tab's memory hasn't caught up
      const data = useProgress.getState().data;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, checks: { ...data.checks, [r2]: true } }));
      expect(await syncOnce()).toMatchObject({ kind: "ok" });
      expect(Object.keys(useProgress.getState().data.checks).sort()).toEqual(sorted(r1, r2));
    });
    later();
    await sync(b);
    expect(await checked(b)).toEqual(sorted(r1, r2));
  });

  it("applies nothing, and tries again afresh, when it can't save its ledger", async () => {
    await tick(b, [r3]);
    await pair(a, b);
    await sync(b);
    later();
    await a.run(async () => {
      const real = Storage.prototype.setItem;
      const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key: string, value: string) {
        if (key === SYNC_KEY) throw new Error("quota");
        return real.call(this, key, value);
      });
      expect(await syncOnce()).toEqual({ kind: "retry", why: "error" });
      expect(Object.keys(useProgress.getState().data.checks)).toEqual([]);
      setItem.mockRestore();
      expect(await syncOnce()).toMatchObject({ kind: "ok" });
      expect(Object.keys(useProgress.getState().data.checks)).toEqual([r3]);
    });
  });
});

describe("whether a round pulled anything", () => {
  it("says so when the group had something this device didn't, and not for a push or a quiet round", async () => {
    await tick(a, [r1]);
    await pair(a, b);
    // joining is a pull of everything the group has (here, for the first device, nothing)
    expect(await sync(a)).toMatchObject({ kind: "ok", pulled: true });
    later();
    expect(await sync(a)).toMatchObject({ kind: "ok", pulled: false });
    later();
    expect(await sync(b)).toMatchObject({ kind: "ok", pulled: true });
    later();
    expect(await sync(b)).toMatchObject({ kind: "ok", pulled: false });
    await tick(a, [r2]);
    later();
    expect(await sync(a)).toMatchObject({ kind: "ok", pulled: false });
    later();
    expect(await sync(b)).toMatchObject({ kind: "ok", pulled: true });
    later();
    expect(await sync(b)).toMatchObject({ kind: "ok", pulled: false });
  });
});

describe("what a pull must not do", () => {
  it("keeps progress this tab couldn't save, as storage that refused the save is behind it", async () => {
    await pair(a, b);
    await a.run(async () => {
      const data = useProgress.getState().data;
      // the last save failed: the tick is in memory only, and the warning shows
      useProgress.setState({ data: { ...data, checks: { [r2]: true } }, storageError: true });
      expect(await syncOnce()).toMatchObject({ kind: "ok" });
      expect(Object.keys(useProgress.getState().data.checks)).toEqual([r2]);
      expect(useProgress.getState().storageError).toBe(true);
    });
    later();
    await sync(b);
    expect(await checked(b)).toEqual([r2]);
  });

  it("is not a tick the reader made, so it doesn't start the request to keep storage", async () => {
    await tick(a, [r1]);
    await pair(a, b);
    await sync(a);
    later();
    const request = vi.fn();
    await b.run(async () => {
      const stop = askAfterFirstTick(request);
      expect(await syncOnce()).toMatchObject({ kind: "ok" });
      expect(Object.keys(useProgress.getState().data.checks)).toEqual([r1]);
      expect(request).not.toHaveBeenCalled();
      useProgress.getState().setCheck(r2, true);
      expect(request).toHaveBeenCalledTimes(1);
      stop();
    });
  });
});

