import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";
import { THEME_KEY, useTheme } from "./store/theme";
import { STORAGE_KEY } from "./progress-state";
import { askAfterFirstTick, checkPersistence, reloadFromAnotherTab } from "./persistence";

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

/** The colour of `surface` with the dialogs' backdrop over it, as `rgb(…)`, or null where a canvas can't tell. */
function dimmed(surface: string) {
  try {
    const probe = document.createElement("div");
    probe.style.background = "var(--backdrop)";
    document.body.append(probe);
    const backdrop = getComputedStyle(probe).backgroundColor;
    probe.remove();
    const context = document.createElement("canvas").getContext("2d");
    if (!context) return null;
    context.canvas.width = context.canvas.height = 1;
    context.fillStyle = surface;
    context.fillRect(0, 0, 1, 1);
    context.fillStyle = backdrop;
    context.fillRect(0, 0, 1, 1);
    const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
    return `rgb(${r}, ${g}, ${b})`;
  } catch {
    return null;
  }
}

/**
 * The colour of the strip the system draws above the page (a phone's status bar in the installed app, the browser's own bar in a tab):
 * the top bar's, so the two read as one. While a dialog has the page dimmed, the strip would stay bright above it, so it takes the dimmed
 * colour of the top bar then. (theme-init.js has set the right one before the first paint.) Whether the strip follows a change after the
 * page has loaded is the system's to decide, and not verified here for a browser tab or an installed iPhone app.
 */
export function useChromeColor(dim: boolean) {
  const resolved = useResolvedTheme();
  useEffect(() => {
    const surface = getComputedStyle(document.documentElement).getPropertyValue("--surface").trim();
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute("content", (dim && dimmed(surface)) || surface);
  }, [resolved, dim]);
}

/** Mirror the theme to the document, keep every tab in sync through storage events, and ask to keep storage. */
export function useGlobalEffects() {
  const resolved = useResolvedTheme();

  // A layout effect: every layout effect runs before any passive one, and useChromeColor (a passive effect in Layout, a child of the
  // component that calls this) reads the colours of the theme this sets.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = resolved;
  }, [resolved]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key === THEME_KEY || event.key === null) useTheme.getState().sync(event.newValue);
      if (event.key === STORAGE_KEY) reloadFromAnotherTab();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    void checkPersistence();
    return askAfterFirstTick();
  }, []);
}
