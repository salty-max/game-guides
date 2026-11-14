import { create } from "zustand";
import type { Checks, Extra, ProgressState } from "../types";
import { STORAGE_KEY, defaultState, validateState } from "../progress-state";
import { readChapter } from "../guide";

interface Loaded {
  data: ProgressState;
  error: boolean;
}

function load(): Loaded {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return { data: raw ? validateState(JSON.parse(raw)) : defaultState(), error: false };
  } catch {
    return { data: defaultState(), error: true };
  }
}

interface ProgressStore {
  data: ProgressState;
  storageError: boolean;
  setCheck: (id: string, checked: boolean) => void;
  setMany: (ids: string[], checked: boolean) => void;
  /** Put entries back to an earlier state (undo): ids in `prev` become checked, the rest unchecked. */
  restore: (ids: string[], prev: Checks) => void;
  /** Change the guide's own extra state (run log, in-game percentage…). */
  setExtra: (recipe: (extra: Extra) => Extra) => void;
  visitChapter: (chapter: number) => void;
  reveal: (chapter: number) => void;
  saveSettings: (settings: { spoilers: boolean; ceiling: number }) => void;
  replaceAll: (next: ProgressState) => void;
  reloadFromStorage: () => void;
}

const initial = load();

export const useProgress = create<ProgressStore>((set, get) => {
  const commit = (recipe: (draft: ProgressState) => ProgressState) => {
    const next = recipe(get().data);
    let storageError = false;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      storageError = true;
    }
    set({ data: next, storageError });
  };
  const applyChecks = (ids: string[], isChecked: (id: string) => boolean) =>
    commit((s) => {
      const checks = { ...s.checks };
      for (const id of ids) {
        if (isChecked(id)) checks[id] = true;
        else delete checks[id];
      }
      return { ...s, checks };
    });

  return {
    data: initial.data,
    storageError: initial.error,
    setCheck: (id, checked) => applyChecks([id], () => checked),
    setMany: (ids, checked) => applyChecks(ids, () => checked),
    restore: (ids, prev) => applyChecks(ids, (id) => prev[id] === true),
    setExtra: (recipe) => commit((s) => ({ ...s, extra: recipe(s.extra) })),
    visitChapter: (chapter) => {
      if (get().data.chapter !== chapter) commit((s) => ({ ...s, chapter }));
    },
    reveal: (chapter) => commit((s) => ({ ...s, ceiling: Math.max(chapter, s.ceiling), chapter })),
    saveSettings: ({ spoilers, ceiling }) =>
      commit((s) => {
        const safe = readChapter(ceiling);
        const open = !spoilers || s.chapter <= safe;
        return { ...s, spoilers, ceiling: safe, chapter: open ? s.chapter : safe };
      }),
    replaceAll: (next) => commit(() => next),
    reloadFromStorage: () => {
      const { data, error } = load();
      set({ data, storageError: error });
    },
  };
});

export const isOpen = (state: ProgressState, chapter: number) => !state.spoilers || chapter <= state.ceiling;
