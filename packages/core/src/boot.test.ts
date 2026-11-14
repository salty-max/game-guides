import { allRows, brand } from "./guide";
import { STORAGE_KEY, defaultState } from "./progress-state";
import { acceptHandoff, handoffTarget } from "./boot";

// Every guide tests the hand-off with the same old and new addresses, whatever its own brand says.
vi.mock("virtual:guide/config", async (importOriginal) => {
  const { default: real } = await importOriginal<typeof import("virtual:guide/config")>();
  return { default: { ...real, brand: { ...real.brand, home: "https://new.example", movedFrom: ["old.example"] } } };
});

const THEME_KEY = `${brand.storagePrefix}.theme`;
const [first, second] = allRows.map((row) => row.id);
const storage = (entries: Record<string, string> = {}) => {
  const map = new Map(Object.entries(entries));
  return { getItem: (key: string) => map.get(key) ?? null, setItem: (key: string, value: string) => void map.set(key, value), map };
};
const saved = (checks: Record<string, true>) => JSON.stringify({ ...defaultState(), checks });
const place = (hostname: string) => ({ hostname, pathname: "/guide/3", search: "?q=1" });

describe("hand-off from an old address", () => {
  it("sends the reader to the same page on the new address, carrying progress and theme", () => {
    const old = storage({ [STORAGE_KEY]: saved({ [first]: true }), [THEME_KEY]: "dark" });
    const target = handoffTarget(place("old.example"), old)!;
    expect(target.startsWith("https://new.example/guide/3?q=1#hand-off=")).toBe(true);
    const payload = JSON.parse(decodeURIComponent(target.split("#hand-off=")[1]));
    expect(payload).toEqual({ progress: saved({ [first]: true }), theme: "dark" });
  });

  it("redirects without a fragment when nothing is saved, and stays put on any other address", () => {
    expect(handoffTarget(place("old.example"), storage())).toBe("https://new.example/guide/3?q=1");
    expect(handoffTarget(place("new.example"), storage())).toBeNull();
    expect(handoffTarget(place("guide-git-preview.vercel.app"), storage())).toBeNull();
  });

  it("imports progress and theme where there are no checks yet", () => {
    const old = storage({ [STORAGE_KEY]: saved({ [first]: true }), [THEME_KEY]: "light" });
    const hash = "#" + handoffTarget(place("old.example"), old)!.split("#")[1];
    const fresh = storage({ [STORAGE_KEY]: saved({}) });
    expect(acceptHandoff(hash, "https://old.example/", fresh)).toBe("imported");
    expect(JSON.parse(fresh.map.get(STORAGE_KEY)!).checks).toEqual({ [first]: true });
    expect(fresh.map.get(THEME_KEY)).toBe("light");
  });

  it("never overwrites checks or a theme already set on the new address", () => {
    const hash = "#" + handoffTarget(place("old.example"), storage({ [STORAGE_KEY]: saved({ [first]: true }), [THEME_KEY]: "dark" }))!.split("#")[1];
    const used = storage({ [STORAGE_KEY]: saved({ [second]: true }), [THEME_KEY]: "light" });
    expect(acceptHandoff(hash, "https://old.example/", used)).toBe("kept");
    expect(JSON.parse(used.map.get(STORAGE_KEY)!).checks).toEqual({ [second]: true });
    expect(used.map.get(THEME_KEY)).toBe("light");
  });

  it("refuses a hand-off that didn't come from an old address, or isn't a valid save", () => {
    const hash = "#" + handoffTarget(place("old.example"), storage({ [STORAGE_KEY]: saved({ [first]: true }) }))!.split("#")[1];
    const fresh = storage();
    expect(acceptHandoff(hash, "https://elsewhere.example/", fresh)).toBe("refused");
    expect(acceptHandoff(hash, "", fresh)).toBe("refused");
    expect(acceptHandoff("#hand-off=" + encodeURIComponent(JSON.stringify({ progress: "{\"version\":3,\"guide\":\"other\"}" })), "https://old.example/", fresh)).toBe("refused");
    expect(fresh.map.size).toBe(0);
  });
});
