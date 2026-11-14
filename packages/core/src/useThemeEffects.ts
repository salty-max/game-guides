import { useEffect, useSyncExternalStore } from "react";
import { THEME_KEY, useTheme } from "./store/theme";
import { STORAGE_KEY } from "./progress-state";
import { useProgress } from "./store/progress";

const query = () => matchMedia("(prefers-color-scheme: dark)");
const subscribeSystem = (callback: () => void) => {
  const media = query();
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
};

/** "light" or "dark" after resolving the "system" preference. */
export function useResolvedTheme() {
  const preference = useTheme((s) => s.preference);
  const systemDark = useSyncExternalStore(subscribeSystem, () => query().matches, () => false);
  return preference === "system" ? (systemDark ? "dark" : "light") : preference;
}

/** Mirror the theme to the document, and keep every tab in sync through storage events. */
export function useGlobalEffects() {
  const resolved = useResolvedTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    // The topbar is the surface colour, so the browser's own bar matches it.
    const surface = getComputedStyle(root).getPropertyValue("--surface").trim();
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", surface);
  }, [resolved]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_KEY || event.key === null) useTheme.getState().sync(event.newValue);
      if (event.key === STORAGE_KEY) useProgress.getState().reloadFromStorage();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
}
