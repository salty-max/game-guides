import { brand, CHAPTER_COUNT, cats } from "../guide";
import { defaultState } from "../progress-state";
import { arrive, forgetPlaces, offsetOf, PLACE_KEY, placeOf, restoreLaunch, safePlace, savePlace, scrolled } from "./place";

const category = Object.keys(cats)[0];
// Spoiler protection on, only chapter 1 revealed: what a new reader has.
const fresh = defaultState();
const everything = { ...defaultState(), spoilers: false };
const later = CHAPTER_COUNT > 1 ? it : it.skip;

beforeEach(() => {
  localStorage.clear();
  forgetPlaces();
  history.replaceState(null, "", "/");
});

describe("a place", () => {
  it("is the page an address shows, without the entry, section or panel it points at", () => {
    expect(placeOf("/guide/1/some-entry", 3)).toBe("/guide/1");
    expect(placeOf("/guide", 3)).toBe("/guide/3");
    expect(placeOf("/dashboard/a-panel", 3)).toBe("/dashboard");
    expect(placeOf(`/checklist/${category}/1`, 3)).toBe(`/checklist/${category}/1`);
    expect(placeOf("/sources", 3)).toBe("/sources");
    // The start address, and one the guide doesn't know, are the chapter Home goes to.
    expect(placeOf("/", 3)).toBe("/guide/3");
    expect(placeOf("/nowhere", 3)).toBe("/guide/3");
  });

  it("is kept only while the guide still shows it: a page it has, and nothing the reader's settings hide", () => {
    expect(safePlace("/guide/1", fresh)).toBe("/guide/1");
    expect(safePlace("/dashboard", fresh)).toBe("/dashboard");
    expect(safePlace("/sources", fresh)).toBe("/sources");
    expect(safePlace(`/checklist/${category}/1`, fresh)).toBe(`/checklist/${category}/1`);
    for (const bad of ["/guide/01", "/guide/0", "/checklist/all/0", "/guide/1/entry", "/dashboard/panel", "/checklist/no-such-category", "/nowhere", "/", 42, null]) {
      expect(safePlace(bad, everything), String(bad)).toBeNull();
    }
  });

  later("never goes into a chapter spoiler protection hides", () => {
    expect(safePlace("/guide/2", fresh)).toBeNull();
    expect(safePlace(`/checklist/${category}/2`, fresh)).toBeNull();
    expect(safePlace("/guide/2", everything)).toBe("/guide/2");
  });
});

describe("the place across launches", () => {
  const save = (value: unknown) => localStorage.setItem(PLACE_KEY, JSON.stringify(value));

  it("is a key of its own beside the progress", () => {
    expect(PLACE_KEY).toBe(`${brand.storagePrefix}.place`);
  });

  it("is saved as the guide goes into the background: the page, its offset and its filters", () => {
    arrive("/checklist", "a", false);
    scrolled(640);
    savePlace();
    expect(JSON.parse(localStorage.getItem(PLACE_KEY)!)).toEqual({ path: "/checklist", y: 640, kept: {} });
  });

  it("reopens at the start address, before the router reads it", () => {
    save({ path: "/dashboard", y: 300, kept: {} });
    expect(restoreLaunch(fresh)).toBe("/dashboard");
    expect(location.pathname).toBe("/dashboard");
    expect(offsetOf("/dashboard")).toBe(300);
  });

  it("leaves a link alone: any other address wins", () => {
    save({ path: "/dashboard", y: 300 });
    history.replaceState(null, "", "/checklist");
    expect(restoreLaunch(fresh)).toBeNull();
    expect(location.pathname).toBe("/checklist");
    history.replaceState(null, "", "/?from=somewhere");
    expect(restoreLaunch(fresh)).toBeNull();
  });

  later("sends the reader to the start instead of a chapter that is hidden now", () => {
    save({ path: "/guide/2", y: 300 });
    expect(restoreLaunch(fresh)).toBeNull();
    expect(location.pathname).toBe("/");
  });

  it("ignores a saved place it can't read, and an offset that isn't one", () => {
    localStorage.setItem(PLACE_KEY, "{not json");
    expect(restoreLaunch(fresh)).toBeNull();
    save({ path: "/sources", y: "far", kept: ["no"] });
    expect(restoreLaunch(fresh)).toBe("/sources");
    expect(offsetOf("/sources")).toBe(0);
  });
});
