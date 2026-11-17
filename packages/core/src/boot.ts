import { brand } from "./guide";
import { STORAGE_KEY, validateState } from "./progress-state";

/*
 * Runs before any store reads storage. Storage belongs to one address, so a guide that moved (brand.home and
 * brand.movedFrom) hands each reader's progress over: the old address redirects to the new one with its saved progress
 * and theme in the URL fragment, which never reaches a server, and the new address imports them when the visit came
 * from an old address and it has no checks of its own yet.
 */

const THEME_KEY = `${brand.storagePrefix}.theme`;
const MARK = "#hand-off=";

type Place = Pick<Location, "hostname" | "pathname" | "search">;
type Store = Pick<Storage, "getItem" | "setItem">;

/** Where to send this reader, or null to stay: only an old address of a guide that moved redirects. */
export function handoffTarget(place: Place, storage: Pick<Storage, "getItem">): string | null {
  if (!brand.movedFrom?.includes(place.hostname)) return null;
  const progress = storage.getItem(STORAGE_KEY);
  const theme = storage.getItem(THEME_KEY);
  const fragment = progress || theme ? MARK + encodeURIComponent(JSON.stringify({ progress, theme })) : "";
  return brand.home + place.pathname + place.search + fragment;
}

const hasChecks = (raw: string | null) => {
  try {
    return raw !== null && Object.keys(validateState(JSON.parse(raw)).checks).length > 0;
  } catch {
    return false;
  }
};

/** Imports a hand-off. Progress lands only where there are no checks yet, the theme only where none is set. */
export function acceptHandoff(hash: string, referrer: string, storage: Store): "imported" | "kept" | "refused" {
  if (!hash.startsWith(MARK)) return "refused";
  try {
    if (!brand.movedFrom?.includes(new URL(referrer).hostname)) return "refused";
    const { progress, theme } = JSON.parse(decodeURIComponent(hash.slice(MARK.length)));
    if ((theme === "light" || theme === "dark") && storage.getItem(THEME_KEY) === null) storage.setItem(THEME_KEY, theme);
    if (typeof progress !== "string" || hasChecks(storage.getItem(STORAGE_KEY))) return "kept";
    storage.setItem(STORAGE_KEY, JSON.stringify(validateState(JSON.parse(progress))));
    return "imported";
  } catch {
    return "refused";
  }
}

// Links and bookmarks from the pre-React guides used hash routes (#guide/3/heart-well).
const legacyRoute = /^#((?:guide|checklist|dashboard)(?:\/.*)?)$/.exec(location.hash);
if (legacyRoute) history.replaceState(null, "", `/${legacyRoute[1]}`);

let target: string | null = null;
try {
  target = handoffTarget(location, localStorage);
} catch {
  // Storage blocked: stay here rather than send the reader on without their progress.
}

/** True while the page is redirecting to the guide's new address, so nothing renders. */
export const leaving = target !== null;
if (target) location.replace(target);
else if (location.hash.startsWith(MARK)) {
  try {
    acceptHandoff(location.hash, document.referrer, localStorage);
  } catch {
    // Storage blocked: the reader starts here as on any first visit.
  } finally {
    history.replaceState(null, "", location.pathname + location.search);
  }
}
