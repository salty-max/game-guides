import { act, render } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router";
import { COUNTS_KEY, add, chapterCounts, declined, flush, pageOf, resetCounts, sendWith, startCounting, uncounted, useCountPages, useCounts } from "./counts";
import { claimCode } from "./sync/pairing";
import { brand, chapterRows, chapters } from "./guide";
import { notATick } from "./persistence";
import { defaultState } from "./progress-state";
import { useProgress } from "./store/progress";
import type { Checks } from "./types";

const [one, two] = chapters;
const ids = (chapter = one) => chapterRows(chapter).map((row) => row.id);
const all = (list: string[]): Checks => Object.fromEntries(list.map((id) => [id, true]));

let sent: Record<string, number>[];
let restore: () => void;
let stop: (() => void) | undefined;

const hide = () => {
  Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
};
const show = () => {
  Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
};

beforeEach(() => {
  localStorage.clear();
  resetCounts();
  useCounts.setState({ on: true });
  useProgress.setState({ data: defaultState(), storageError: false });
  sent = [];
  restore = sendWith((counts) => sent.push(counts));
});

afterEach(() => {
  stop?.();
  stop = undefined;
  restore();
  Reflect.deleteProperty(navigator, "globalPrivacyControl");
  Reflect.deleteProperty(document, "visibilityState");
});

describe("the key", () => {
  it("is the guide's prefix and .counts, holds \"off\" only when turned off, and is never synced or backed up", () => {
    expect(COUNTS_KEY).toBe(`${brand.storagePrefix}.counts`);
    useCounts.getState().setOn(false);
    expect(localStorage.getItem(COUNTS_KEY)).toBe("off");
    useCounts.getState().setOn(true);
    expect(localStorage.getItem(COUNTS_KEY)).toBeNull();
    expect(JSON.stringify(defaultState())).not.toContain("count");
  });
});

describe("a visit", () => {
  it("counts the visit once a page load, by where the guide runs, and sends it when the page goes to the background", () => {
    stop = startCounting();
    stop();
    // (React's strict mode starts effects twice: still one visit)
    stop = startCounting();
    expect(sent).toEqual([]);
    hide();
    expect(sent).toEqual([{ "v:tab": 1 }]);
    hide();
    expect(sent).toHaveLength(1);
  });

  it("counts a new visit only after half an hour in the background", () => {
    let now = 0;
    stop = startCounting(() => now);
    hide();
    now = 29 * 60_000;
    show();
    hide();
    now += 30 * 60_000;
    show();
    hide();
    expect(sent).toEqual([{ "v:tab": 1 }, { "v:tab": 1 }]);
  });

  it("sends nothing at all with counting turned off, or with Global Privacy Control or Do Not Track", () => {
    useCounts.getState().setOn(false);
    stop = startCounting();
    hide();
    expect(sent).toEqual([]);

    expect(declined({ globalPrivacyControl: true }, {})).toBe(true);
    expect(declined({ doNotTrack: "1" }, {})).toBe(true);
    expect(declined({ doNotTrack: "0" }, { doNotTrack: "1" })).toBe(true);
    expect(declined({ doNotTrack: null, globalPrivacyControl: false }, {})).toBe(false);

    stop();
    resetCounts();
    useCounts.getState().setOn(true);
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true, configurable: true });
    stop = startCounting();
    hide();
    expect(sent).toEqual([]);
  });

  it("drops what was waiting when counting is turned off before it went", () => {
    stop = startCounting();
    useCounts.getState().setOn(false);
    useCounts.getState().setOn(true);
    hide();
    expect(sent).toEqual([]);
  });
});

describe("chapters started and finished", () => {
  it("names a chapter started when its first row is checked, and finished when its last one is", () => {
    const rows = ids();
    expect(chapterCounts({}, { [rows[0]]: true })).toEqual([`s:${one.id}`]);
    expect(chapterCounts({ [rows[0]]: true }, { [rows[0]]: true, [rows[1]]: true })).toEqual([]);
    expect(chapterCounts(all(rows.slice(1)), all(rows))).toEqual([`f:${one.id}`]);
    expect(chapterCounts({}, all([...rows, ...ids(two)]))).toEqual([`s:${one.id}`, `f:${one.id}`, `s:${two.id}`, `f:${two.id}`]);
    expect(chapterCounts(all(rows), {})).toEqual([]);
  });

  it("counts the reader's own ticks and bulk checks, each chapter once a page load, so an undo and a redo count once", () => {
    stop = startCounting();
    const rows = ids();
    act(() => useProgress.getState().setMany([rows[0]], true));
    act(() => useProgress.getState().restore([rows[0]], {}));
    act(() => useProgress.getState().setMany([rows[0]], true));
    act(() => useProgress.getState().setMany(rows, true));
    hide();
    expect(sent).toEqual([{ "v:tab": 1, [`s:${one.id}`]: 1, [`f:${one.id}`]: 1 }]);
  });

  it("doesn't count what sync pulled, another tab saved, or a backup brought", () => {
    stop = startCounting();
    const rows = ids();
    act(() => notATick(() => useProgress.getState().applySynced({ ...defaultState(), checks: all(rows) })));
    act(() => useProgress.setState({ data: defaultState() }));
    act(() => uncounted(() => useProgress.getState().replaceAll({ ...defaultState(), checks: all(ids(two)) })));
    hide();
    expect(sent).toEqual([{ "v:tab": 1 }]);
  });
});

describe("pages", () => {
  it("are one of four, with a chapter by its number: no row, filter or section, and never a hidden chapter", () => {
    const data = { ...defaultState(), spoilers: true, ceiling: 1, chapter: 1 };
    expect(pageOf("/guide/1/some-row", data)).toBe("p:guide/1");
    expect(pageOf("/guide", data)).toBe("p:guide/1");
    expect(pageOf("/guide/2", data)).toBeNull();
    expect(pageOf("/guide/2", { ...data, spoilers: false })).toBe("p:guide/2");
    expect(pageOf("/checklist/heart/1", data)).toBe("p:checklist");
    expect(pageOf("/dashboard/what-is-left", data)).toBe("p:dashboard");
    // A line's id never leaves the device: every line is the one page.
    expect(pageOf("/questlines", data)).toBe("p:questlines");
    expect(pageOf("/questlines/some-line", data)).toBe("p:questlines");
    expect(pageOf("/sources", data)).toBeNull();
    expect(pageOf("/", data)).toBeNull();
    expect(pageOf("/nowhere", data)).toBeNull();
  });

  it("counts a page as it is shown, not a move within it, and a hidden chapter once it is revealed", () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: true, ceiling: 1 } });
    let go: (to: string) => void = () => {};
    function Probe() {
      useCountPages();
      const navigate = useNavigate();
      go = (to) => void navigate(to);
      return null;
    }
    render(
      <MemoryRouter initialEntries={["/guide/1"]}>
        <Probe />
      </MemoryRouter>,
    );
    act(() => go("/guide/1/a-row"));
    act(() => go("/checklist"));
    act(() => go("/checklist/heart"));
    act(() => go("/guide/2"));
    act(() => useProgress.getState().reveal(2));
    act(() => go("/guide/1"));
    flush();
    expect(sent).toEqual([{ "p:guide/1": 2, "p:checklist": 1, "p:guide/2": 1 }]);
  });

  it("sends at once when a POST is full: twelve fields, or fifty of one", () => {
    let go: (to: string) => void = () => {};
    useProgress.setState({ data: { ...defaultState(), spoilers: false } });
    function Probe() {
      useCountPages();
      const navigate = useNavigate();
      go = (to) => void navigate(to);
      return null;
    }
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Probe />
      </MemoryRouter>,
    );
    for (let i = 0; i < 50; i++) {
      act(() => go("/checklist"));
      act(() => go("/dashboard"));
    }
    expect(sent[0]).toEqual({ "p:dashboard": 50, "p:checklist": 49 });
  });

  it("never builds a POST of more than twelve fields, which the API would refuse", () => {
    for (let n = 1; n <= 13; n++) add(`p:guide/${n}`);
    expect(sent).toEqual([Object.fromEntries(Array.from({ length: 12 }, (_, i) => [`p:guide/${i + 1}`, 1]))]);
    flush();
    expect(sent[1]).toEqual({ "p:guide/13": 1 });
  });
});

describe("a link", () => {
  const claims = async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ linked: true }), { status: 200 }));
    try {
      await claimCode("123456");
      return JSON.parse(String(fetchSpy.mock.calls[0][1]?.body)) as Record<string, unknown>;
    } finally {
      fetchSpy.mockRestore();
    }
  };

  it("names the guide, for the server's link count, only while this device may be counted", async () => {
    expect((await claims()).guide).toBe(brand.id);
    useCounts.getState().setOn(false);
    expect((await claims()).guide).toBeUndefined();
    useCounts.getState().setOn(true);
    Object.defineProperty(navigator, "globalPrivacyControl", { value: true, configurable: true });
    expect((await claims()).guide).toBeUndefined();
  });
});
