import { useEffect } from "react";
import { setSyncStatus, startingPhase, useSyncStatus } from "../store/sync";
import { flushOnExit, syncOnce, type Outcome } from "./cycle";
import { SYNC_KEY, onLocalChange, readHint, readRecord } from "./local";

/*
 * When sync runs. cycle.ts does a round; this decides when:
 *   - on opening the guide, if this browser is linked
 *   - 2 seconds after a change, and never more than 15 seconds after the first change not yet sent
 *   - as the page is hidden or closed, a push that survives the page (no answer is read)
 *   - on coming back to the page, if the last round was over 10 seconds ago
 *   - every 5 minutes while the page is showing
 *   - when the browser comes back online
 * After a failure it waits 5 seconds, doubling to 5 minutes, with some jitter. Changes wait on the device through all of it.
 */

export const DEBOUNCE = 2_000;
export const MAX_WAIT = 15_000;
export const POLL = 5 * 60_000;
export const FOREGROUND_GAP = 10_000;
export const BACKOFF_FIRST = 5_000;
export const BACKOFF_MAX = 5 * 60_000;

export const backoff = (failures: number, random = Math.random()) =>
  Math.min(BACKOFF_MAX, BACKOFF_FIRST * 2 ** Math.max(0, failures - 1)) * (0.75 + random * 0.5);

interface Engine {
  kick: () => void;
}

let active: Engine | null = null;

/** Run a round soon, for when something just changed what sync should do (a device was linked). */
export function syncSoon() {
  active?.kick();
}

/** Starts sync for this page and returns the function that stops it. */
export function startEngine(): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let running = false;
  let again = false;
  let failures = 0;
  let firstUnsent = 0;
  let lastRun = 0;
  let stopped = false;

  const schedule = (delay: number) => {
    clearTimeout(timer);
    timer = setTimeout(() => void run(), Math.max(0, delay));
  };

  const settle = (outcome: Outcome) => {
    if (outcome.kind === "off" || outcome.kind === "unlinked") {
      failures = 0;
      firstUnsent = 0;
      setSyncStatus({ phase: "off", devices: 0 });
    } else if (outcome.kind === "ok") {
      failures = 0;
      firstUnsent = outcome.dirty ? firstUnsent || Date.now() : 0;
      setSyncStatus({ phase: outcome.dirty ? "waiting" : "synced", devices: outcome.devices, lastSync: Date.now() });
      if (outcome.dirty) schedule(DEBOUNCE);
    } else {
      failures++;
      setSyncStatus({ phase: outcome.why });
      schedule(backoff(failures));
    }
  };

  async function run() {
    if (stopped) return;
    if (running) {
      again = true;
      return;
    }
    running = true;
    try {
      let outcome: Outcome;
      do {
        again = false;
        outcome = await syncOnce();
        lastRun = Date.now();
        if (stopped) return;
        settle(outcome);
      } while (again && outcome.kind === "ok" && !outcome.dirty);
    } finally {
      running = false;
    }
  }

  const linked = () => Boolean(readHint() || readRecord());

  onLocalChange(() => {
    firstUnsent ||= Date.now();
    if (useSyncStatus.getState().phase === "synced") setSyncStatus({ phase: "waiting" });
    // A retry already waiting its turn after a failure stays where it is.
    if (failures === 0) schedule(Math.min(DEBOUNCE, firstUnsent + MAX_WAIT - Date.now()));
  });

  const onVisibility = () => {
    if (document.visibilityState === "hidden") return flushOnExit();
    if (linked() && Date.now() - lastRun > FOREGROUND_GAP) schedule(0);
  };
  const onOnline = () => {
    if (!linked()) return;
    failures = 0;
    schedule(0);
  };
  const onOffline = () => {
    if (linked()) setSyncStatus({ phase: "offline" });
  };
  // Another tab of this guide, or this guide in another tab after an unlink, changed the ledger: the status follows.
  const onStorage = (event: StorageEvent) => {
    if (event.key !== SYNC_KEY) return;
    if (event.newValue === null) setSyncStatus({ phase: "off", devices: 0 });
    else if (useSyncStatus.getState().phase === "off") setSyncStatus({ phase: startingPhase() });
  };
  const poll = setInterval(() => {
    if (document.visibilityState === "visible" && linked()) schedule(0);
  }, POLL);

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", flushOnExit);
  window.addEventListener("online", onOnline);
  window.addEventListener("offline", onOffline);
  window.addEventListener("storage", onStorage);

  active = { kick: () => schedule(0) };
  setSyncStatus({ phase: startingPhase() });
  if (linked()) schedule(0);

  return () => {
    stopped = true;
    clearTimeout(timer);
    clearInterval(poll);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("pagehide", flushOnExit);
    window.removeEventListener("online", onOnline);
    window.removeEventListener("offline", onOffline);
    window.removeEventListener("storage", onStorage);
    onLocalChange(null);
    active = null;
  };
}

/** Keeps this guide's progress in step with the group it is linked to. Does nothing, and costs nothing, until a device is linked. */
export function useSync() {
  useEffect(() => startEngine(), []);
}
