import { useUi } from "./store/ui";
import { syncing } from "./sync/engine";

// How a new build reaches a reader without a nag in the middle of a session. The browser looks for a new service worker when the page
// is loaded, and a guide that stays open for days (an installed app most of all) loads once: so the page looks for one itself, on coming back
// to the screen and on a timer. A new build found while the guide is only just starting takes over at once, before the reader has touched
// anything; one found later waits for the reader's yes in a toast (ToastHost), so a reload never lands mid-checklist.

/** At most one look for a new build an hour. */
export const CHECK_EVERY = 60 * 60_000;
/** How often the timer asks whether the hour is up. */
export const TICK = 10 * 60_000;
/** How long after the start a new build may still take over untouched. */
export const LAUNCH_WINDOW = 20_000;
/** How often to look again while a sync round is under way. */
export const RETRY = 500;
/** If the page hasn't reloaded this long after a build was told to take over, the reader is asked after all. */
export const FALLBACK = 10_000;

/**
 * Held, shared, by every page of this guide the reader has done something in. A build that takes over reloads every page of the guide
 * that is open (the worker's change of control reloads each one that saw it waiting), so a page that is only just starting lets a new build
 * take over only when no other page holds this.
 */
export const IN_USE = "hundo-in-use";

const started = Date.now();
let touched = false;
const kinds = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
const touch = () => {
  touched = true;
  for (const kind of kinds) window.removeEventListener(kind, touch, true);
  // Held until the page goes: the callback's promise never settles.
  void navigator.locks?.request(IN_USE, { mode: "shared" }, () => new Promise<never>(() => {})).catch(() => {});
};
for (const kind of kinds) window.addEventListener(kind, touch, { capture: true, passive: true });

/** Whether another page of this guide is in use. Where the browser can't say, it is taken to be. */
async function inUseElsewhere() {
  try {
    if (!navigator.locks) return true;
    const { held = [] } = await navigator.locks.query();
    return held.some((lock) => lock.name === IN_USE);
  } catch {
    return true;
  }
}

let stopWatching: (() => void) | undefined;

/**
 * Looks for a new build while the guide stays open: when it comes back to the screen and on a timer, never more than once an hour (the
 * first hour counts from now: the browser has just looked, on registering). Not while a new worker is already installing, nor offline.
 */
export function watchForUpdates(registration: ServiceWorkerRegistration) {
  stopWatching?.();
  let last = Date.now();
  const check = () => {
    if (Date.now() - last < CHECK_EVERY || registration.installing || !navigator.onLine) return;
    last = Date.now();
    void (async () => {
      try {
        await registration.update();
      } catch {
        /* offline after all, or the server is down: the next look tries again */
      }
    })();
  };
  const onVisible = () => {
    if (document.visibilityState === "visible") check();
  };
  const timer = setInterval(check, TICK);
  document.addEventListener("visibilitychange", onVisible);
  stopWatching = () => {
    clearInterval(timer);
    document.removeEventListener("visibilitychange", onVisible);
  };
  return stopWatching;
}

let settling: "idle" | "deciding" | "applied" = "idle";

/**
 * A new build is waiting. While the guide is only just starting (nothing pressed, typed or scrolled, within LAUNCH_WINDOW, no dialog open,
 * no other page of the guide in use) it takes over now (`apply`: the worker skips waiting and the page reloads), after any sync round under
 * way has finished. Otherwise the reader is asked (`prompt`). If the reload doesn't come, the reader is asked after FALLBACK. The worker can
 * report the same build more than once (vite-plugin-pwa answers both its "installed" and its "waiting"): a report while one is being decided,
 * or after a build was told to take over, is let go. So is one on a page no worker controls.
 */
export function settleUpdate(apply: () => void, prompt: () => void) {
  // A page no worker controls (a hard reload, which skips the worker) already runs the newest build from the network, and a worker that
  // takes over would never reload it: there is nothing to apply and nothing to ask.
  if (!navigator.serviceWorker?.controller) return;
  if (settling !== "idle") return;
  settling = "deciding";
  const ask = () => {
    settling = "idle";
    prompt();
  };
  const launching = () => !touched && Date.now() - started <= LAUNCH_WINDOW && !useUi.getState().dialog;
  const attempt = async () => {
    if (!launching() || (await inUseElsewhere()) || !launching()) {
      ask();
    } else if (syncing()) {
      setTimeout(() => void attempt(), RETRY);
    } else {
      settling = "applied";
      apply();
      setTimeout(ask, FALLBACK);
    }
  };
  void attempt();
}
