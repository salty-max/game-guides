import { useEffect, useRef, useSyncExternalStore } from "react";

// Code that loads when it's used, from a dynamic import. React.lazy needs a Suspense and an error boundary around it, and a lazy
// component whose import fails (an old tab asking for a chunk the newest deploy has replaced, or no connection) unmounts the whole app
// when nothing catches it. Here a failure is only a state: the module isn't there, and the next try asks again.

export interface Loadable<T> {
  /** Starts the load unless one is under way, and settles with the module. A failure is forgotten, so the next call tries again. */
  load: () => Promise<T>;
  /** The module once it has loaded, else undefined. */
  get: () => T | undefined;
  /** load() for when nobody waits on the answer: warming the module up before anything needs it. */
  warm: () => void;
  /** Tells `listener` when the module arrives. */
  subscribe: (listener: () => void) => () => void;
}

export function loadable<T>(importer: () => Promise<T>): Loadable<T> {
  let value: T | undefined;
  let pending: Promise<T> | undefined;
  const listeners = new Set<() => void>();
  const load = () =>
    (pending ??= importer().then(
      (module) => {
        value = module;
        listeners.forEach((listener) => listener());
        return module;
      },
      (error: unknown) => {
        pending = undefined;
        throw error;
      },
    ));
  return {
    load,
    get: () => value,
    warm: () => {
      load().catch(() => {});
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => void listeners.delete(listener);
    },
  };
}

/**
 * The loadable's module, or undefined until it has arrived. Re-renders when it does, whoever started the load. `start` begins the
 * load (it can be on from the first render, or wait for the reader to ask); `onError` hears of a load this component started failing.
 */
export function useLoadable<T>(source: Loadable<T>, start: boolean, onError?: () => void): T | undefined {
  const value = useSyncExternalStore(source.subscribe, source.get);
  const failed = useRef(onError);
  // Declared first, so it runs first: the load below calls whatever onError the latest render passed.
  useEffect(() => {
    failed.current = onError;
  });
  useEffect(() => {
    if (start && !value) source.load().catch(() => failed.current?.());
  }, [source, start, value]);
  return value;
}

/**
 * Runs `run` once the page has finished loading and the browser has a moment to spare, so fetching what the reader may want next never
 * competes with the page itself. Does nothing when the reader asked to save data. Returns what undoes it. Safari has no
 * requestIdleCallback, so a short timer stands in.
 */
export function whenIdle(run: () => void): () => void {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return () => {};
  let cancel = () => {};
  const go = () => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 5000 });
      cancel = () => window.cancelIdleCallback(id);
    } else {
      const id = window.setTimeout(run, 1000);
      cancel = () => window.clearTimeout(id);
    }
  };
  if (document.readyState === "complete") go();
  else {
    window.addEventListener("load", go, { once: true });
    cancel = () => window.removeEventListener("load", go);
  }
  return () => cancel();
}
