import { useState } from "react";
import { useLocation, useNavigationType } from "react-router";
import { brand, cats, hasMissables, readChapter, statusOptions } from "../guide";
import { isOpen, useProgress } from "./progress";
import type { ProgressState } from "../types";

/**
 * Where the reader was. Each page keeps its scroll offset and its filters while the guide is open, so a tab of the bar comes back to them
 * (Apple's tab bars keep each section's state), and so does Back. And the last place is saved under `<storagePrefix>.place` when the guide
 * goes into the background, so opening the app again (at its start address) goes back there, not to the chapter's top. A key of its own,
 * beside the progress: it is one device's, it never syncs, and losing it costs nothing but the place.
 */
export const PLACE_KEY = `${brand.storagePrefix}.place`;

/** What a page remembers: its scroll offset and the values its `useKept` calls hold. */
interface Memory {
  y: number;
  kept: Record<string, unknown>;
}

const memory = new Map<string, Memory>();
// Back and Forward return to a history entry, which knows exactly where it was left: the same page can be in the history twice (a
// chapter, then an entry in it), each at its own offset.
const entries = new Map<string, number>();

const remembered = (place: string) => {
  let entry = memory.get(place);
  if (!entry) memory.set(place, (entry = { y: 0, kept: {} }));
  return entry;
};

/**
 * The page an address shows, without what it only points at: a guide address's entry or section, a progress panel. The start address
 * (and any address the guide doesn't know) is the chapter Home sends the reader to.
 */
export function placeOf(pathname: string, chapter: number): string {
  const [view, first, second] = pathname.split("/").filter(Boolean);
  if (view === "guide") return `/guide/${readChapter(first, chapter)}`;
  if (view === "dashboard") return "/dashboard";
  if (view === "sources") return "/sources";
  if (view === "checklist") return ["/checklist", first, second].filter(Boolean).join("/");
  return `/guide/${chapter}`;
}

/** A chapter of this guide, written the way its addresses write it ("3", never "03" or "0"). */
const isChapter = (value: unknown): value is string => typeof value === "string" && String(readChapter(value, 0)) === value && value !== "0";

/**
 * A place, if the guide still shows it as it was: a page it has, a category it has, and no chapter the reader's settings now hide.
 * Otherwise null, and the reader goes to the start, the way a spoiler-safe link would send them.
 */
export function safePlace(path: unknown, data: ProgressState): string | null {
  if (typeof path !== "string") return null;
  const parts = path.split("/").filter(Boolean);
  const [view, first, second] = parts;
  const chapter = (value: string) => isChapter(value) && isOpen(data, Number(value));
  if (view === "guide") return parts.length === 2 && chapter(first) ? path : null;
  if (view === "dashboard" || view === "sources") return parts.length === 1 ? path : null;
  if (view !== "checklist" || parts.length > 3) return null;
  if (first !== undefined && !(Object.hasOwn(cats, first) || (hasMissables && first === "missable") || first === "all")) return null;
  if (second !== undefined && !chapter(second)) return null;
  return path;
}

/** A tab of the bar: the address that takes the reader back to its page as they left it (its last place, filters and all). */
export const tabPlaces = { checklist: "/checklist" };

/**
 * Called by Layout on every move: the place the reader is on now and its history entry, for the tabs and for the save. A new visit to a
 * page (not `returning`) starts from the address's filters, so what an earlier visit kept is forgotten: a tab back to it must not bring
 * back a filter the reader didn't have on the visit they left.
 */
let current = "";
let entry = "";
export function arrive(place: string, key: string, returning: boolean) {
  // A link to the page already on screen leaves it mounted, filters and all, so what it keeps stays too.
  if (!returning && place !== current) remembered(place).kept = {};
  current = place;
  entry = key;
  if (place.startsWith("/checklist")) tabPlaces.checklist = place;
}

/** The scroll offset of the place the reader is on, as it changes. */
export function scrolled(y: number) {
  if (current) remembered(current).y = y;
  if (entry) entries.set(entry, y);
}

/** Where a place was left, or undefined for one not seen yet in this visit. */
export const offsetOf = (place: string) => memory.get(place)?.y;

/** Where a history entry was left, or undefined. */
export const entryOffset = (key: string) => entries.get(key);

/**
 * Whether the page being shown is one the reader is coming back to: Back or Forward (the router's POP, which is also the first page of a
 * visit), or a tab of the bar. Anything else is a new visit to a page, which starts at its top with its filters as the address says.
 */
export function useReturning() {
  const type = useNavigationType();
  const { state } = useLocation();
  return type === "POP" || (state as { restore?: boolean } | null)?.restore === true;
}

/**
 * A page's state that outlives the page: like useState, but a reader coming back to the page (useReturning) finds the value they left,
 * if `valid` still accepts it. `name` is unique within the page. Off (plain useState) when `on` is false.
 */
export function useKept<T>(name: string, initial: T | (() => T), valid: (value: unknown) => value is T, on = true) {
  const { pathname } = useLocation();
  const chapter = useProgress((s) => s.data.chapter);
  const returning = useReturning();
  const place = placeOf(pathname, chapter);
  const [value, setValue] = useState<T>(() => {
    const kept = on && returning ? memory.get(place)?.kept[name] : undefined;
    if (kept !== undefined && valid(kept)) return kept;
    return typeof initial === "function" ? (initial as () => T)() : initial;
  });
  const set = (next: T) => {
    if (on) remembered(place).kept[name] = next;
    setValue(next);
  };
  return [value, set] as const;
}

/** What useKept accepts back for a list's filters: a category the guide has (or Missable, or all), a chapter, a status, a search. */
export const isFilter = (value: unknown): value is string =>
  value === "all" || (typeof value === "string" && (Object.hasOwn(cats, value) || (hasMissables && value === "missable")));
export const isChapterFilter = (value: unknown): value is string => value === "all" || isChapter(value);
export const isStatus = (value: unknown): value is string => statusOptions.some(([key]) => key === value);
export const isText = (value: unknown): value is string => typeof value === "string";

interface Saved {
  path: string;
  y: number;
  kept: Record<string, unknown>;
}

/** Saves the place the reader is on, as the guide goes into the background (it may never come back from there). */
export function savePlace() {
  if (!current) return;
  const { y, kept } = remembered(current);
  try {
    localStorage.setItem(PLACE_KEY, JSON.stringify({ path: current, y, kept } satisfies Saved));
  } catch {
    /* storage unavailable: the guide opens at the chapter, as it would anyway */
  }
}

/**
 * At launch: a guide opened at its start address goes back to the saved place, if the guide still shows it (safePlace). The address is
 * changed before the router reads it, and the place's offset and filters are remembered, so its first page is a reader coming back.
 * Any other address is a link, and a link wins. Returns the place, or null.
 */
export function restoreLaunch(data: ProgressState = useProgress.getState().data): string | null {
  if (window.location.pathname !== "/" || window.location.search || window.location.hash) return null;
  let saved: Partial<Saved>;
  try {
    saved = JSON.parse(localStorage.getItem(PLACE_KEY) ?? "null") ?? {};
  } catch {
    return null;
  }
  const path = safePlace(saved.path, data);
  if (!path) return null;
  const entry = remembered(path);
  if (typeof saved.y === "number" && Number.isFinite(saved.y) && saved.y >= 0) entry.y = saved.y;
  if (saved.kept && typeof saved.kept === "object" && !Array.isArray(saved.kept)) entry.kept = { ...saved.kept };
  window.history.replaceState(window.history.state, "", path);
  return path;
}

/** For tests: forget every place. */
export function forgetPlaces() {
  memory.clear();
  entries.clear();
  current = "";
  entry = "";
  tabPlaces.checklist = "/checklist";
}

