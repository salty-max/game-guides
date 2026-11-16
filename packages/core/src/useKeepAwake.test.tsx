import { act, renderHook } from "@testing-library/react";
import { AWAKE_KEY, canKeepAwake, useAwake } from "./store/awake";
import { useKeepAwake } from "./useKeepAwake";

// Keep screen on (Guide settings): a stand-in Screen Wake Lock that counts what is held, and lets the system take a lock back, as a
// browser does when the page is hidden.

class Sentinel extends EventTarget {
  released = false;
  release = vi.fn(async () => {
    if (this.released) return;
    this.released = true;
    this.dispatchEvent(new Event("release"));
  });
}

let sentinels: Sentinel[] = [];
let answer: (() => Promise<Sentinel>) | undefined;
const request = vi.fn(async () => {
  if (answer) return answer();
  const sentinel = new Sentinel();
  sentinels.push(sentinel);
  return sentinel;
});
const held = () => sentinels.filter((sentinel) => !sentinel.released).length;

const showPage = async (state: "visible" | "hidden") => {
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => state });
  await act(async () => {
    document.dispatchEvent(new Event("visibilitychange"));
  });
};

beforeEach(() => {
  sentinels = [];
  answer = undefined;
  request.mockClear();
  localStorage.clear();
  Object.defineProperty(document, "visibilityState", { configurable: true, get: () => "visible" });
  Object.defineProperty(navigator, "wakeLock", { configurable: true, value: { request } });
  useAwake.setState({ on: false });
});

afterEach(() => {
  Reflect.deleteProperty(navigator, "wakeLock");
});

describe("the setting", () => {
  it("is stored under its own key, as \"on\" or nothing", () => {
    useAwake.getState().setOn(true);
    expect(localStorage.getItem(AWAKE_KEY)).toBe("on");
    useAwake.getState().setOn(false);
    expect(localStorage.getItem(AWAKE_KEY)).toBeNull();
  });

  it("follows another tab's change", () => {
    useAwake.getState().sync("on");
    expect(useAwake.getState().on).toBe(true);
    useAwake.getState().sync(null);
    expect(useAwake.getState().on).toBe(false);
  });

  it("is offered only where the browser has a wake lock", () => {
    expect(canKeepAwake()).toBe(true);
    Reflect.deleteProperty(navigator, "wakeLock");
    expect(canKeepAwake()).toBe(false);
  });
});

describe("holding the screen on", () => {
  it("holds nothing while the setting is off", async () => {
    renderHook(() => useKeepAwake());
    await act(async () => {});
    expect(request).not.toHaveBeenCalled();
  });

  it("holds the screen once it's on, and lets go when it's turned off", async () => {
    renderHook(() => useKeepAwake());
    await act(async () => useAwake.getState().setOn(true));
    expect(held()).toBe(1);
    await act(async () => useAwake.getState().setOn(false));
    expect(held()).toBe(0);
  });

  it("asks again each time the page comes back, after the system let go while it was hidden", async () => {
    useAwake.setState({ on: true });
    renderHook(() => useKeepAwake());
    await act(async () => {});
    expect(held()).toBe(1);
    await showPage("hidden");
    await act(async () => sentinels[0].release());
    expect(held()).toBe(0);
    await showPage("visible");
    expect(held()).toBe(1);
    expect(request).toHaveBeenCalledTimes(2);
  });

  it("doesn't ask twice while it holds the screen", async () => {
    useAwake.setState({ on: true });
    renderHook(() => useKeepAwake());
    await act(async () => {});
    await showPage("visible");
    await act(async () => {
      window.dispatchEvent(new Event("pointerdown"));
    });
    expect(request).toHaveBeenCalledTimes(1);
  });

  it("asks again on the next press after a refusal", async () => {
    useAwake.setState({ on: true });
    answer = () => Promise.reject(new DOMException("No", "NotAllowedError"));
    renderHook(() => useKeepAwake());
    await act(async () => {});
    expect(held()).toBe(0);
    answer = undefined;
    await act(async () => {
      window.dispatchEvent(new Event("pointerdown"));
    });
    expect(held()).toBe(1);
  });

  it("lets go of a lock that arrives after the setting was turned off", async () => {
    useAwake.setState({ on: true });
    let resolve: (sentinel: Sentinel) => void = () => {};
    const late = new Sentinel();
    answer = () => new Promise((done) => (resolve = done));
    renderHook(() => useKeepAwake());
    await act(async () => useAwake.getState().setOn(false));
    await act(async () => resolve(late));
    expect(late.release).toHaveBeenCalled();
  });

  it("lets go when the page is unmounted", async () => {
    useAwake.setState({ on: true });
    const { unmount } = renderHook(() => useKeepAwake());
    await act(async () => {});
    unmount();
    expect(held()).toBe(0);
  });
});
