import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { create } from "zustand";
import { brand, CHAPTER_COUNT, chapterRows, chapters } from "./guide";
import { elsewhere, installed } from "./persistence";
import { isOpen, useProgress } from "./store/progress";
import { PROTOCOL } from "./sync/api";
import type { Checks, ProgressState } from "./types";

/*
 * Visit counts: anonymous totals that tell which guides and chapters get used, how far readers get, and how much of the reading happens
 * in the installed app. A visit's counts go to the guide's own /api/count (the sync API, services/sync) when the page goes to the
 * background, without cookies, so nothing in them names the device; the server adds them to the guide's totals for the day and keeps nothing
 * else. Only chapter numbers leave the device, never a title or a row. A reader turns it off in Guide settings, and a browser sending
 * Global Privacy Control or Do Not Track is never counted. The README's "Privacy" section says the same to readers, and must change with this.
 */

/** "off" when the reader turned counting off on this device, else nothing. Not synced and not in backups: it's this device's choice. */
export const COUNTS_KEY = `${brand.storagePrefix}.counts`;

/** What one POST may carry (the API refuses more), and the most one field may count in it. */
const MAX_FIELDS = 12;
const MAX_COUNT = 50;
/** Back after this long in the background, the guide counts a new visit; a quick switch to another app is the same visit. */
const NEW_VISIT_MS = 30 * 60_000;

const normalize = (value: unknown) => value !== "off";

function read() {
  try {
    return normalize(localStorage.getItem(COUNTS_KEY));
  } catch {
    return true;
  }
}

interface CountsStore {
  on: boolean;
  setOn: (on: boolean) => void;
  /** Re-read after another tab changed it. */
  sync: (value: unknown) => void;
}

export const useCounts = create<CountsStore>((set) => ({
  on: read(),
  setOn: (on) => {
    try {
      if (on) localStorage.removeItem(COUNTS_KEY);
      else localStorage.setItem(COUNTS_KEY, "off");
    } catch {
      /* storage unavailable: the choice still applies for this session */
    }
    if (!on) pending.clear();
    set({ on });
  },
  sync: (value) => {
    if (!normalize(value)) pending.clear();
    set({ on: normalize(value) });
  },
}));

interface PrivacySignals {
  globalPrivacyControl?: boolean;
  doNotTrack?: string | null;
}

/** Whether the browser asks sites not to track it: Global Privacy Control, or the older Do Not Track (some browsers put it on window). */
export function declined(nav: PrivacySignals = navigator, win: PrivacySignals = window as PrivacySignals) {
  return nav.globalPrivacyControl === true || nav.doNotTrack === "1" || win.doNotTrack === "1";
}

/** Whether this device may be counted: the switch on, and no GPC or DNT. The link count asks too (sync/pairing.ts). */
export const allowed = () => useCounts.getState().on && !declined();

const pending = new Map<string, number>();

export type Send = (counts: Record<string, number>) => void;

/** The POST, never with cookies: the sync cookie names the device, and a count must not. A failure is dropped, quietly. */
const post: Send = (counts) => {
  try {
    void fetch("/api/count", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ p: PROTOCOL, guide: brand.id, counts }),
      credentials: "omit",
      cache: "no-store",
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* no fetch, or a refused request: nothing is counted */
  }
};

let send: Send = post;

/** Swap how counts leave (tests). Returns what puts the real one back. */
export function sendWith(next: Send) {
  send = next;
  return () => {
    send = post;
  };
}

/** Send what this visit has counted so far, if anything and if allowed. */
export function flush() {
  if (pending.size === 0) return;
  const counts = Object.fromEntries(pending);
  pending.clear();
  if (allowed()) send(counts);
}

/** Count one more of `field`, sending at once when the POST is full. Nothing when counting is off. */
export function add(field: string) {
  if (!allowed()) return;
  const next = (pending.get(field) ?? 0) + 1;
  pending.set(field, next);
  if (pending.size >= MAX_FIELDS || next >= MAX_COUNT) flush();
}

const countVisit = () => add(installed() ? "v:app" : "v:tab");

const chapterOf = new Map(chapters.flatMap((chapter) => chapterRows(chapter).map((row): [string, number] => [row.id, chapter.id])));
const rowsOf = new Map(chapters.map((chapter) => [chapter.id, chapterRows(chapter).map((row) => row.id)]));

/** The chapters a change to the checks started (none checked before, some after) or finished (all checked after, not before), as fields. */
export function chapterCounts(prev: Checks, next: Checks): string[] {
  const touched = new Set<number>();
  for (const id of Object.keys(next)) {
    const chapter = chapterOf.get(id);
    if (next[id] === true && prev[id] !== true && chapter !== undefined) touched.add(chapter);
  }
  const out: string[] = [];
  for (const chapter of [...touched].sort((a, b) => a - b)) {
    const ids = rowsOf.get(chapter) ?? [];
    const before = ids.filter((id) => prev[id] === true).length;
    const after = ids.filter((id) => next[id] === true).length;
    if (before === 0 && after > 0) out.push(`s:${chapter}`);
    if (after === ids.length && before < ids.length) out.push(`f:${chapter}`);
  }
  return out;
}

let importing = false;

/** Runs `change`, a backup's progress replacing this device's: what it checks wasn't done here, so it starts and finishes nothing. */
export function uncounted(change: () => void) {
  importing = true;
  try {
    change();
  } finally {
    importing = false;
  }
}

const counted = new Set<string>();
let visitCounted = false;

/**
 * Start counting this page load: the visit, the reader's own ticks (a tap or a bulk check; not what sync pulled, another tab saved or a
 * backup brought), and the moment to send, which is the page going to the background. Each chapter starts or finishes once a page load,
 * so an undo and a redo count once. Returns what stops it.
 */
export function startCounting(now: () => number = Date.now) {
  if (!visitCounted) {
    visitCounted = true;
    countVisit();
  }
  let hiddenAt: number | null = null;
  const onVisibility = () => {
    if (document.visibilityState === "hidden") {
      hiddenAt = now();
      flush();
      return;
    }
    if (hiddenAt !== null && now() - hiddenAt >= NEW_VISIT_MS) countVisit();
    hiddenAt = null;
  };
  const stopTicks = useProgress.subscribe((state, prev) => {
    if (importing || elsewhere() || state.data.checks === prev.data.checks) return;
    for (const field of chapterCounts(prev.data.checks, state.data.checks)) {
      if (counted.has(field)) continue;
      counted.add(field);
      add(field);
    }
  });
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", flush);
  return () => {
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", flush);
    stopTicks();
  };
}

/**
 * The page an address shows, as a field: one of four, with a chapter by its number only, so a row's anchor or a checklist's filters
 * never leave the device. A hidden chapter isn't counted (the reader sees only that it's hidden), nor `/` and unknown addresses, which
 * move on to a chapter at once.
 */
export function pageOf(pathname: string, data: ProgressState): string | null {
  const [view, param] = pathname.split("/").filter(Boolean);
  if (view === "checklist" || view === "dashboard" || view === "sources") return `p:${view}`;
  if (view !== "guide") return null;
  const n = Number(param);
  const chapter = Number.isInteger(n) && n >= 1 && n <= CHAPTER_COUNT ? n : data.chapter;
  return isOpen(data, chapter) ? `p:guide/${chapter}` : null;
}

/** Counts each page as it is shown: a move within one (a row, a section, a filter) isn't a new one. */
export function useCountPages() {
  const { pathname } = useLocation();
  const page = useProgress((s) => pageOf(pathname, s.data));
  const last = useRef<string | null>(null);
  useEffect(() => {
    if (page === null || page === last.current) return;
    last.current = page;
    add(page);
  }, [page]);
}

/** Forget this page load's state (tests). */
export function resetCounts() {
  pending.clear();
  counted.clear();
  visitCounted = false;
  importing = false;
}
