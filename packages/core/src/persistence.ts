import { create } from "zustand";
import { brand } from "./guide";
import { useProgress } from "./store/progress";

/*
 * Asks the browser to keep this guide's storage (navigator.storage.persist()), so it's less likely to clear progress
 * when space runs low or after a while away. Chromium and Safari grant or refuse it silently. Firefox asks the reader,
 * and a "Block" there lasts only a while unless they tick "remember", so the request waits for a tick in this tab,
 * never runs on load, and goes out at most once every 30 days. What each browser does, with sources: docs/core.md.
 */

/** When and where the guide last asked: "<ms since the epoch> tab" or "… app". */
export const PERSIST_KEY = `${brand.storagePrefix}.persist`;
export const ASK_GAP = 30 * 24 * 60 * 60 * 1000;

type Manager = Pick<StorageManager, "persist" | "persisted">;

/** Whether the browser has agreed to keep this guide's storage: null until it says, or where it can't. */
export const usePersistence = create<{ persisted: boolean | null }>(() => ({ persisted: null }));

// Typed as always there, but older browsers lack it.
const manager = (): Manager | null => {
  const storage = navigator.storage as Partial<Manager> | undefined;
  return typeof storage?.persist === "function" && typeof storage.persisted === "function" ? (storage as Manager) : null;
};

/** Opened from the home screen or as an installed app (the manifest's `display` is "standalone"). */
export const installed = () =>
  matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;

/** Reads whether storage is persistent. Never throws. */
export async function checkPersistence(storage = manager()) {
  if (!storage) return;
  try {
    usePersistence.setState({ persisted: await storage.persisted() });
  } catch {
    // The browser can't say: the dashboard says nothing either.
  }
}

/**
 * Asks for persistent storage, unless it's granted already or the guide asked in the last 30 days. An installed app
 * asks once more if the last ask came from a tab, since Chromium counts being installed in its favour. Never throws.
 */
export async function requestPersistence(storage = manager(), now = Date.now(), app = installed()) {
  if (!storage) return;
  try {
    const [at, where] = (localStorage.getItem(PERSIST_KEY) ?? "").split(" ");
    if (Math.abs(now - Number(at)) < ASK_GAP && (!app || where === "app")) return;
    // Noted before any wait, so another tab, or the next visit while a prompt is still open, doesn't ask again.
    localStorage.setItem(PERSIST_KEY, `${now} ${app ? "app" : "tab"}`);
    if (await storage.persisted()) {
      usePersistence.setState({ persisted: true });
      return;
    }
    usePersistence.setState({ persisted: await storage.persist() });
  } catch {
    // Storage blocked or the request refused outright: progress saves as before.
  }
}

let fromElsewhere = false;

/** Runs `change`, whose new checks aren't a tick the reader made in this tab (another tab's save, or what sync pulled): they don't start the request. */
export function notATick(change: () => void) {
  fromElsewhere = true;
  try {
    change();
  } finally {
    fromElsewhere = false;
  }
}

/** Loads what another tab saved. */
export const reloadFromAnotherTab = () => notATick(() => useProgress.getState().reloadFromStorage());

/** Requests persistence on the first tick of this visit in this tab, then stops listening. Returns the unsubscribe. */
export function askAfterFirstTick(request: () => unknown = requestPersistence) {
  const stop = useProgress.subscribe((state, prev) => {
    if (fromElsewhere || state.data.checks === prev.data.checks) return;
    if (!Object.keys(state.data.checks).some((id) => prev.data.checks[id] !== true)) return;
    stop();
    void request();
  });
  return stop;
}
