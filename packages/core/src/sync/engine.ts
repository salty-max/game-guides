import { useEffect } from "react";
import { setSyncStatus, startingPhase, useSyncStatus } from "../store/sync";
import { flushOnExit, syncOnce, type Outcome } from "./cycle";
import { SYNC_KEY, onLocalChange, readHint, readRecord } from "./local";

/*
 * When sync runs. cycle.ts does a round; this decides when:
 *   - on opening the guide, if this browser is linked
 *   - 2 seconds after a change, and never more than 15 seconds after the first change not yet sent
 *   - as the page is hidden or closed, a push that survives the page (no answer is read)
 *   - on coming back to the page (visibilitychange, and focus and a bfcache pageshow where those fire instead), if the last round was
 *     over 10 seconds ago
 *   - while the page is showing, every 20 seconds, backing off by half again each time nothing changed here or there, to 2 minutes, and
 *     back to 20 seconds after a change on either side. Not while it is hidden.
 *   - when the browser comes back online
 * After a failure it waits 5 seconds, doubling to 5 minutes, with some jitter, and doesn't poll on top. Changes wait on the device
 * through all of it.
 *
 * What a poll costs: one request and 5 store commands, 7 when the device's last-seen is refreshed (the API does that at most once a
 * minute). An open guide that nobody touches asks about 33 times an hour, about 230 commands; one kept at the quick pace by changes on
 * either side, 180 times, about 1,000. The firewall's limit is 120 a minute for an address, so three devices polling at 20 seconds
 * (9 a minute) are far under it. The commands are what the store's free plan counts: docs/core.md has the monthly figures.
 */

export const DEBOUNCE = 2_000;
export const MAX_WAIT = 15_000;
export const POLL_FAST = 20_000;
export const POLL_SLOW = 120_000;
export const POLL_GROWTH = 1.5;
/** How far a poll's wait may be off either way, so devices that opened together don't ask together. */
const POLL_JITTER = 0.1;
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
  let pollTimer: ReturnType<typeof setTimeout> | undefined;
  let wait = POLL_FAST;
  let changedHere = false;
  /** The round now running or just ended was started by the poll timer. */
  let polled = false;
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

  const visible = () => document.visibilityState === "visible";
  const linked = () => Boolean(readHint() || readRecord());

  /** The next poll. Not while the page is hidden, nor unlinked, nor in the middle of a backoff, when the retry has the turn. */
  const armPoll = () => {
    clearTimeout(pollTimer);
    if (stopped || !visible() || !linked() || failures > 0) return;
    pollTimer = setTimeout(
      () => {
        // A round in progress arms the next poll itself when it ends.
        if (running) return;
        polled = true;
        void run();
      },
      wait * (1 - POLL_JITTER + Math.random() * 2 * POLL_JITTER),
    );
  };

  const settle = (outcome: Outcome) => {
    // Whatever kind of round it was, the next one starts from a clean slate.
    const wasPoll = polled;
    polled = false;
    if (outcome.kind === "off" || outcome.kind === "unlinked") {
      failures = 0;
      firstUnsent = 0;
      setSyncStatus({ phase: "off", devices: 0 });
    } else if (outcome.kind === "ok") {
      failures = 0;
      firstUnsent = outcome.dirty ? firstUnsent || Date.now() : 0;
      setSyncStatus({ phase: outcome.dirty ? "waiting" : "synced", devices: outcome.devices, lastSync: Date.now() });
      if (outcome.dirty) schedule(DEBOUNCE);
      // A poll that found nothing, with nothing changed here, makes the next wait longer. Any other round (opening, coming back, a push) or
      // any change on either side, and it is quick again.
      wait = wasPoll && !outcome.pulled && !changedHere ? Math.min(POLL_SLOW, wait * POLL_GROWTH) : POLL_FAST;
      changedHere = false;
    } else {
      failures++;
      setSyncStatus({ phase: outcome.why });
      schedule(backoff(failures));
    }
    armPoll();
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
        // Marked at the start too: a focus that follows a visibilitychange by a few milliseconds finds a round already under way.
        lastRun = Date.now();
        outcome = await syncOnce();
        lastRun = Date.now();
        if (stopped) return;
        settle(outcome);
      } while (again && outcome.kind === "ok" && !outcome.dirty);
    } finally {
      running = false;
    }
  }

  onLocalChange(() => {
    changedHere = true;
    firstUnsent ||= Date.now();
    if (useSyncStatus.getState().phase === "synced") setSyncStatus({ phase: "waiting" });
    // A retry already waiting its turn after a failure stays where it is.
    if (failures === 0) schedule(Math.min(DEBOUNCE, firstUnsent + MAX_WAIT - Date.now()));
  });

  // Coming back to the page: an installed iPhone app fires visibilitychange, and focus or a bfcache pageshow may come instead or as well.
  // Whichever comes first starts the round, and the others find it started.
  const onReturn = () => {
    if (!visible() || !linked()) return;
    wait = POLL_FAST;
    // Not in the middle of a round (it arms the next poll when it ends) and not over a retry that is waiting out a failure: a window
    // focus comes with every click back into the window, and a reader a rate limit has turned away mustn't ask again each time.
    if (running || failures > 0) return;
    if (Date.now() - lastRun > FOREGROUND_GAP) schedule(0);
    else armPoll();
  };
  const onVisibility = () => {
    if (visible()) return onReturn();
    clearTimeout(pollTimer);
    flushOnExit();
  };
  const onPageShow = (event: PageTransitionEvent) => {
    if (event.persisted) onReturn();
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

  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("focus", onReturn);
  window.addEventListener("pageshow", onPageShow);
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
    clearTimeout(pollTimer);
    document.removeEventListener("visibilitychange", onVisibility);
    window.removeEventListener("focus", onReturn);
    window.removeEventListener("pageshow", onPageShow);
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
