import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import type { MockInstance } from "vitest";
import { brand, chapterRows, chapters, overall } from "./guide";
import { defaultState } from "./progress-state";
import { useProgress } from "./store/progress";
import { SUMMARY_COOKIE, SUMMARY_WAIT, readSummary, startSummary, summaryOf, summaryText } from "./summary";

const [one, two] = chapters;
const ids = chapterRows(one).map((row) => row.id);

// The test plays the server: a cookie set here is one the API's answer would have set.
const setCookie = (value: string) => (document.cookie = `${SUMMARY_COOKIE}=${value}; Path=/`);
const clearCookie = () => (document.cookie = `${SUMMARY_COOKIE}=; Path=/; Max-Age=0`);

let fetchSpy: MockInstance<typeof fetch>;
let stop: (() => void) | undefined;
/** What each call to /api/summary sent, and with what options. */
const calls = () =>
  fetchSpy.mock.calls.map(([url, init]) => ({ url: String(url), body: JSON.parse(String((init as RequestInit).body)) as Record<string, unknown>, init: init as RequestInit }));
const hide = () => {
  Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
  document.dispatchEvent(new Event("visibilitychange"));
};

beforeEach(() => {
  vi.useFakeTimers();
  clearCookie();
  useProgress.setState({ data: defaultState(), storageError: false });
  // The API answers as it does: it sets the cookie from what it was sent.
  fetchSpy = vi.spyOn(globalThis, "fetch").mockImplementation(async (_url, init) => {
    const { summary } = JSON.parse(String(init?.body)) as { summary: { percent: number; chapter: number } | null };
    if (summary) setCookie(summaryText(summary));
    else clearCookie();
    return new Response('{"ok":true}', { status: 200 });
  });
});

afterEach(() => {
  stop?.();
  stop = undefined;
  fetchSpy.mockRestore();
  vi.useRealTimers();
  Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
  clearCookie();
});

describe("what the cookie holds", () => {
  it("is the Progress page's figure and the reader's chapter, and nothing while nothing is checked", () => {
    expect(summaryOf({ checks: {}, chapter: 3 })).toBeNull();
    const checks = { [ids[0]]: true as const, [ids[1]]: true as const };
    expect(summaryOf({ checks, chapter: 2 })).toEqual({ percent: overall(checks).percent, chapter: 2 });
    expect(summaryText({ percent: 57, chapter: 6 })).toBe("1.57.6");
    expect(summaryText(null)).toBe("");
  });

  it("is named by the guide's brand id", () => {
    expect(SUMMARY_COOKIE).toBe(`hundo_p_${brand.id}`);
  });

  it("is read by its whole name, never another cookie's", () => {
    expect(readSummary()).toBe("");
    document.cookie = `${SUMMARY_COOKIE}x=1.9.9; Path=/`;
    document.cookie = "hundo_link=abc; Path=/";
    expect(readSummary()).toBe("");
    setCookie("1.12.3");
    expect(readSummary()).toBe("1.12.3");
    document.cookie = `${SUMMARY_COOKIE}x=; Path=/; Max-Age=0`;
    document.cookie = "hundo_link=; Path=/; Max-Age=0";
  });
});

describe("keeping it in step", () => {
  it("asks the API a moment after the guide opens, when the cookie is behind, with its cookies so the answer's can be kept", async () => {
    useProgress.getState().setMany(ids.slice(0, 2), true);
    stop = startSummary();
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT - 1);
    expect(fetchSpy).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    const [sent] = calls();
    expect(calls()).toHaveLength(1);
    expect(sent.url).toBe("/api/summary");
    expect(sent.body).toEqual({ p: 1, guide: brand.id, summary: summaryOf(useProgress.getState().data) });
    expect(sent.init.credentials).toBe("same-origin");
    expect(readSummary()).toBe(summaryText(summaryOf(useProgress.getState().data)));
  });

  it("asks nothing when the cookie already says it, or when there's nothing to say and no cookie", async () => {
    stop = startSummary();
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    stop();
    useProgress.getState().setCheck(ids[0], true);
    setCookie(summaryText(summaryOf(useProgress.getState().data)));
    stop = startSummary();
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("makes one call for the visit's first look and a run of ticks, sync's and another tab's included", async () => {
    stop = startSummary();
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT - 1000);
    useProgress.getState().setCheck(ids[0], true);
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT - 1000);
    useProgress.getState().applySynced({ ...useProgress.getState().data, checks: { ...useProgress.getState().data.checks, [ids[1]]: true } });
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT - 1000);
    useProgress.getState().visitChapter(two.id);
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    expect(calls()).toHaveLength(1);
    expect(calls()[0].body.summary).toEqual({ percent: overall(useProgress.getState().data.checks).percent, chapter: two.id });
  });

  it("looks again when the call goes out, so what another tab already sent isn't sent twice", async () => {
    stop = startSummary();
    useProgress.getState().setCheck(ids[0], true);
    // the other tab's call landed first
    setCookie(summaryText(summaryOf(useProgress.getState().data)));
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("tries again what failed once the cookie has moved on, as another tab's call moves it", async () => {
    stop = startSummary();
    useProgress.getState().setCheck(ids[0], true);
    const first = summaryText(summaryOf(useProgress.getState().data));
    fetchSpy.mockImplementationOnce(async () => new Response("The page could not be found", { status: 404 }));
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    expect(calls()).toHaveLength(1);
    // another tab moves on to chapter 2, and its call lands
    useProgress.getState().visitChapter(two.id);
    setCookie(summaryText(summaryOf(useProgress.getState().data)));
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    expect(calls()).toHaveLength(1);
    // back here, back to chapter 1: the text that failed before is due again
    useProgress.getState().visitChapter(one.id);
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    expect(calls()).toHaveLength(2);
    expect(readSummary()).toBe(first);
  });

  it("clears it when the last check goes", async () => {
    setCookie("1.4.1");
    stop = startSummary();
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    expect(calls().map((call) => call.body.summary)).toEqual([null]);
    expect(readSummary()).toBe("");
  });

  it("sends a waiting call at once, kept alive, when the page is hidden, and nothing when none waits", async () => {
    stop = startSummary();
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    hide();
    expect(fetchSpy).not.toHaveBeenCalled();
    useProgress.getState().setCheck(ids[0], true);
    hide();
    await vi.advanceTimersByTimeAsync(0);
    expect(calls()).toHaveLength(1);
    expect(calls()[0].init.keepalive).toBe(true);
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    expect(calls()).toHaveLength(1);
  });

  it("drops a failed call quietly, and tries again only for something new", async () => {
    fetchSpy.mockImplementation(async () => new Response("The page could not be found", { status: 404 }));
    stop = startSummary();
    useProgress.getState().setCheck(ids[0], true);
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    useProgress.getState().setCheck(ids[0], true);
    useProgress.getState().visitChapter(one.id);
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    expect(calls()).toHaveLength(1);
    fetchSpy.mockRejectedValue(new TypeError("offline"));
    // (a second check may leave the rounded-down figure where it was: a new chapter is something new for sure)
    useProgress.getState().visitChapter(two.id);
    await vi.advanceTimersByTimeAsync(SUMMARY_WAIT);
    expect(calls()).toHaveLength(2);
    expect(readSummary()).toBe("");
  });
});

describe("core's code", () => {
  // Safari has kept a cookie set by script for as little as a week, so one write from here could cut the API's 400 days short. (Tests and
  // their helpers in src/test may play the server.)
  it("never writes a cookie from script", () => {
    const files = (dir: string): string[] =>
      readdirSync(dir).flatMap((name) => {
        const path = join(dir, name);
        if (name === "test") return [];
        return statSync(path).isDirectory() ? files(path) : /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
      });
    const writers = files(import.meta.dirname).filter((path) => /document\.cookie\s*=(?!=)|cookieStore\.set/.test(readFileSync(path, "utf8")));
    expect(writers).toEqual([]);
  });
});
