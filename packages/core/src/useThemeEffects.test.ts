import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyTheme } from "./useThemeEffects";

const root = document.documentElement;

describe("applyTheme", () => {
  beforeEach(() => {
    vi.useFakeTimers({ toFake: ["requestAnimationFrame", "cancelAnimationFrame"] });
    root.dataset.theme = "light";
    delete root.dataset.themeSwitch;
  });
  afterEach(() => vi.useRealTimers());

  it("says the theme is changing until a frame has been drawn with it", () => {
    applyTheme("dark");
    expect(root.dataset.theme).toBe("dark");
    expect(root.hasAttribute("data-theme-switch")).toBe(true);
    vi.advanceTimersToNextFrame();
    expect(root.hasAttribute("data-theme-switch")).toBe(true);
    vi.advanceTimersToNextFrame();
    expect(root.hasAttribute("data-theme-switch")).toBe(false);
  });

  it("does nothing when the theme is already there", () => {
    expect(applyTheme("light")).toBeUndefined();
    expect(root.hasAttribute("data-theme-switch")).toBe(false);
  });

  it("clears the flag at once when undone, and leaves no frame behind", () => {
    const undo = applyTheme("dark");
    undo?.();
    expect(root.hasAttribute("data-theme-switch")).toBe(false);
    applyTheme("light");
    vi.advanceTimersToNextFrame();
    vi.advanceTimersToNextFrame();
    expect(root.hasAttribute("data-theme-switch")).toBe(false);
    expect(vi.getTimerCount()).toBe(0);
  });
});
