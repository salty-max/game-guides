import { create } from "zustand";
import { brand, leanings } from "../guide";

/**
 * The leanings this device's reader ticked under Your build (Guide settings): the build the guide points toward. A key of its own,
 * beside the progress, like the theme: it is a lens over the checklist, never progress, so it isn't synced and isn't in backups, and
 * losing it costs a tap, not a tick. The picked ids, space-separated in the guide's order ("dex fth"), or nothing.
 */
export const BUILD_KEY = `${brand.storagePrefix}.build`;

/** The ids in `value` the guide still names, in the guide's order: a leaning a later build drops is dropped from the pick. */
export const normalizeBuild = (value: unknown): string[] => {
  const ids = new Set(typeof value === "string" ? value.split(" ") : []);
  return leanings.filter((leaning) => ids.has(leaning.id)).map((leaning) => leaning.id);
};

function read() {
  try {
    return normalizeBuild(localStorage.getItem(BUILD_KEY));
  } catch {
    return [];
  }
}

interface BuildStore {
  picked: string[];
  setPicked: (picked: string[]) => void;
  /** Re-read after another tab changed it. */
  sync: (value: unknown) => void;
}

/** The ids already saved that this build doesn't name: a tab on an older build that saves its settings keeps a leaning added since. */
function unknownSaved() {
  try {
    const known = new Set(leanings.map((leaning) => leaning.id));
    return (localStorage.getItem(BUILD_KEY) ?? "").split(" ").filter((id) => id && !known.has(id));
  } catch {
    return [];
  }
}

export const useBuild = create<BuildStore>((set, get) => ({
  picked: read(),
  setPicked: (next) => {
    const picked = normalizeBuild(next.join(" "));
    const saved = [...picked, ...unknownSaved()];
    try {
      if (saved.length) localStorage.setItem(BUILD_KEY, saved.join(" "));
      else localStorage.removeItem(BUILD_KEY);
    } catch {
      /* storage unavailable: the pick still applies for this session */
    }
    if (picked.join(" ") !== get().picked.join(" ")) set({ picked });
  },
  sync: (value) => {
    const picked = normalizeBuild(value);
    if (picked.join(" ") !== get().picked.join(" ")) set({ picked });
  },
}));
