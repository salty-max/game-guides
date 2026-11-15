import { brand } from "../guide";
import type { ProgressState } from "../types";
import { changes } from "./fields";
import { isKey, stamp, validValue, type Clock, type Entries } from "./ledger";

/*
 * What a device keeps about sync, in `<storagePrefix>.sync`: the ledger (every key with its stamp, so a later sync can tell a new
 * change from an old one), the keys not yet sent, and its clock. Progress itself stays in `<storagePrefix>.v1`; this is what lets
 * the two devices agree on who changed what last. Nothing is written here until the device is linked.
 */

/** Like the progress and theme keys, this one never changes: the ledger is what keeps a device's changes from being lost. */
export const SYNC_KEY = `${brand.storagePrefix}.sync`;
/** The cookie the API sets once a device is linked, readable by script. Its value only names the group; it opens nothing. */
export const LINK_COOKIE = "hundo_link";

export interface SyncRecord {
  v: 1;
  /** The link cookie's value when this ledger was made: a different one means the device moved to another group. */
  group: string;
  entries: Entries;
  /** Keys changed here and not yet sent. */
  dirty: string[];
  clock: Clock;
  /** When the server was last told this device is still here, which pushes its expiry out. */
  touched: number;
}

/** Keep what the ledger accepts, and drop the rest, so one bad entry can't make the server refuse every push. */
export function cleanEntries(raw: unknown): Entries {
  const out: Entries = {};
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) return out;
  for (const [key, entry] of Object.entries(raw)) {
    if (!isKey(key) || !Array.isArray(entry) || entry.length !== 2) continue;
    const [at, value] = entry as [unknown, unknown];
    if (typeof at === "number" && Number.isSafeInteger(at) && at >= 0 && validValue(key, value)) out[key] = [at, value];
  }
  return out;
}

const finite = (value: unknown, fallback: number) => (typeof value === "number" && Number.isFinite(value) ? value : fallback);

/** The saved ledger, or null when this device isn't linked here (or its record can't be read, which starts it over). */
export function readRecord(): SyncRecord | null {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(SYNC_KEY) ?? "null");
    if (raw === null || typeof raw !== "object") return null;
    const r = raw as Record<string, unknown>;
    if (r.v !== 1 || typeof r.group !== "string") return null;
    const entries = cleanEntries(r.entries);
    const clock = (r.clock ?? {}) as Record<string, unknown>;
    return {
      v: 1,
      group: r.group,
      entries,
      dirty: Array.isArray(r.dirty) ? r.dirty.filter((key): key is string => typeof key === "string" && key in entries) : [],
      clock: { last: finite(clock.last, 0), offset: finite(clock.offset, 0) },
      touched: finite(r.touched, 0),
    };
  } catch {
    return null;
  }
}

/** Saves the ledger. False when storage refuses, which leaves the device with what it had. */
export function writeRecord(record: SyncRecord): boolean {
  try {
    localStorage.setItem(SYNC_KEY, JSON.stringify(record));
    return true;
  } catch {
    return false;
  }
}

export function dropRecord() {
  try {
    localStorage.removeItem(SYNC_KEY);
  } catch {
    // Storage is blocked: there was no record to drop.
  }
}

/** The link cookie's value, or "" when this browser isn't linked. */
export function readHint(): string {
  try {
    const found = document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${LINK_COOKIE}=`));
    return /^[A-Za-z0-9_-]{1,32}$/.test(found?.slice(LINK_COOKIE.length + 1) ?? "") ? found!.slice(LINK_COOKIE.length + 1) : "";
  } catch {
    return "";
  }
}

let wake: (() => void) | null = null;
/** The engine asks to hear when a change has been recorded here, to schedule a push. */
export function onLocalChange(listener: (() => void) | null) {
  wake = listener;
}

/**
 * Called after progress is saved by a change made here: stamps every key it changed and marks it to send. Does nothing unless this
 * device is linked, so a reader who never links pays for none of it. Changes pulled from the group don't come through here.
 */
export function recordLocalChange(prev: ProgressState, next: ProgressState) {
  const record = readRecord();
  if (!record) return;
  const changed = changes(prev, next);
  const keys = Object.keys(changed);
  if (keys.length === 0) return;
  const now = Date.now();
  for (const key of keys) record.entries[key] = [stamp(record.clock, now), changed[key]];
  record.dirty = [...new Set([...record.dirty, ...keys])];
  if (writeRecord(record)) wake?.();
}
