import { useSyncExternalStore } from "react";

const watch = (query: string) => ({
  subscribe: (changed: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", changed);
    return () => list.removeEventListener("change", changed);
  },
  now: () => window.matchMedia(query).matches,
});

// The width under which the chapter rail is a drawer: the `drawer:` variant's, inclusive (app.css).
const narrow = watch("(max-width: 800px)");
// The width under which the pages are a tab bar at the bottom and the checklist's filters are in a sheet: the `phone:` variant's.
const phone = watch("(max-width: 550px)");

/** Whether the screen is narrow enough for the chapter rail to be a drawer (800px and under), now. */
export const isNarrow = narrow.now;

/** isNarrow, as state that follows the screen. */
export const useNarrow = () => useSyncExternalStore(narrow.subscribe, narrow.now);

/** Whether the screen is a phone's (550px and under), now. */
export const isPhone = phone.now;

/** isPhone, as state that follows the screen. */
export const usePhone = () => useSyncExternalStore(phone.subscribe, phone.now);
