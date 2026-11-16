import { create } from "zustand";
import { brand } from "../guide";

/**
 * Whether this device keeps its screen on while the guide is showing (Guide settings). A key of its own, beside the progress: progress
 * syncs to the reader's other devices and goes into backups, and keeping a screen on is one device's choice. "on", or nothing.
 */
export const AWAKE_KEY = `${brand.storagePrefix}.awake`;

const normalize = (value: unknown) => value === "on";

function read() {
  try {
    return normalize(localStorage.getItem(AWAKE_KEY));
  } catch {
    return false;
  }
}

/** Whether this browser can hold the screen on at all (the Screen Wake Lock API). */
export const canKeepAwake = () => typeof navigator !== "undefined" && "wakeLock" in navigator;

interface AwakeStore {
  on: boolean;
  setOn: (on: boolean) => void;
  /** Re-read after another tab changed it. */
  sync: (value: unknown) => void;
}

export const useAwake = create<AwakeStore>((set) => ({
  on: read(),
  setOn: (on) => {
    try {
      if (on) localStorage.setItem(AWAKE_KEY, "on");
      else localStorage.removeItem(AWAKE_KEY);
    } catch {
      /* storage unavailable: the choice still applies for this session */
    }
    set({ on });
  },
  sync: (value) => set({ on: normalize(value) }),
}));
