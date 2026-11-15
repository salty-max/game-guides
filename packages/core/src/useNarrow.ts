import { useSyncExternalStore } from "react";

// The width under which the chapter rail is a drawer: the `drawer:` variant's, inclusive (app.css).
const query = "(max-width: 800px)";

const subscribe = (changed: () => void) => {
  const list = window.matchMedia(query);
  list.addEventListener("change", changed);
  return () => list.removeEventListener("change", changed);
};

/** Whether the screen is narrow enough for the chapter rail to be a drawer (800px and under), now. */
export const isNarrow = () => window.matchMedia(query).matches;

/** isNarrow, as state that follows the screen. */
export const useNarrow = () => useSyncExternalStore(subscribe, isNarrow);
