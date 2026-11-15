// @vitest-environment node
import { runInNewContext } from "node:vm";
import app from "./app.css?raw";
import styles from "./styles.css?raw";
import tokens from "./tokens.css?raw";
import page from "../index.html?raw";
import themeInit from "../theme-init.js?raw";

// How the page knows it is an installed app (theme-init.js), what app.css makes of that, and the template's part in it. What it looks
// like is for the browser (docs/testing.md); what these hold is the rules that keep a browser tab an ordinary website.

interface Page {
  /** What the reader saved as the theme, if anything. */
  preference?: string;
  /** The system's appearance. */
  dark?: boolean;
  /** navigator.standalone, which only iOS Safari has. */
  navigatorStandalone?: boolean;
  /** Whether (display-mode: standalone) matches. */
  displayMode?: boolean;
  /** The dark colour the theme-color tag carries, if the build gave it one. */
  darkColor?: string;
  storageThrows?: boolean;
}

/** Runs theme-init.js against a stand-in page, and returns what it left on the root element and the theme-color tag. */
const open = ({ preference, dark = false, navigatorStandalone, displayMode = false, darkColor = "#192720", storageThrows = false }: Page = {}) => {
  const root = { dataset: {} as Record<string, string> };
  const color = { content: "#fffef9", dataset: { dark: darkColor } as Record<string, string> };
  runInNewContext(themeInit, {
    document: {
      documentElement: root,
      querySelector: (selector: string) => (selector.includes("guide-storage") ? { content: "guide" } : selector.includes("theme-color") ? color : null),
    },
    localStorage: {
      getItem: (key: string) => {
        if (storageThrows) throw new Error("blocked");
        return key === "guide.theme" ? (preference ?? null) : null;
      },
    },
    matchMedia: (query: string) => ({ matches: query.includes("prefers-color-scheme") ? dark : query.includes("display-mode") ? displayMode : false }),
    navigator: { standalone: navigatorStandalone },
  });
  return { root: root.dataset, color: color.content };
};

describe("theme-init.js", () => {
  it("sets the theme from the reader's choice, else from the system, and the colour of the browser's bar to match", () => {
    expect(open()).toEqual({ root: { theme: "light" }, color: "#fffef9" });
    expect(open({ dark: true })).toEqual({ root: { theme: "dark" }, color: "#192720" });
    expect(open({ dark: true, preference: "light" })).toEqual({ root: { theme: "light" }, color: "#fffef9" });
    expect(open({ preference: "dark" })).toEqual({ root: { theme: "dark" }, color: "#192720" });
  });

  it("leaves the colour as the page has it when the build gave no dark one", () => {
    expect(open({ preference: "dark", darkColor: "" }).color).toBe("#fffef9");
  });

  it("still sets the theme when storage is blocked", () => {
    expect(open({ storageThrows: true, dark: true }).root.theme).toBe("dark");
  });

  it("marks the page as an app when iOS Safari or the display mode says it was opened as one, and only then", () => {
    expect(open().root).not.toHaveProperty("standalone");
    expect(open({ navigatorStandalone: false }).root).not.toHaveProperty("standalone");
    expect(open({ navigatorStandalone: true }).root).toHaveProperty("standalone", "");
    expect(open({ displayMode: true }).root).toHaveProperty("standalone", "");
  });
});

describe("the installed app in app.css", () => {
  it("has a `standalone:` variant that is the mark theme-init.js sets, on the root element and everything in it", () => {
    expect(app).toContain("@custom-variant standalone (&:where([data-standalone], [data-standalone] *));");
  });

  it("changes nothing in a browser tab: every rule that makes the page a frame is behind the variant or the mark", () => {
    // The base layer's global rules are the only hand-written ones; each either sets something every page has (the scroll padding
    // under the top bar) or is keyed on the mark.
    const base = /@layer base \{([\s\S]*?)\n\}\n/.exec(app)?.[1] ?? "";
    const rules = base.replace(/\/\*[\s\S]*?\*\//g, "").split("}").map((rule) => rule.trim()).filter(Boolean);
    expect(rules.length).toBeGreaterThan(4);
    for (const rule of rules) {
      const [selector, body] = rule.split("{").map((part) => part.trim());
      const everyPage = selector === "html" && /^@apply scroll-pt-\[calc\(var\(--bar\)\+24px\)\];$/.test(body);
      const onlyApp = /standalone:/.test(body.replace(/@apply /, "")) && !body.split(/\s+/).some((cls) => cls !== "@apply" && !cls.startsWith("standalone:"));
      const marked = selector.startsWith("[data-standalone]");
      expect(everyPage || onlyApp || marked, `"${selector}" would apply in a browser tab`).toBe(true);
    }
  });

  it("makes every text field 16px on a touch screen, above the legacy rules they got their size from", () => {
    expect(/@layer components \{[\s\S]*pointer-coarse:text-base/.test(app)).toBe(true);
  });

  it("never turns zoom off: pinch zoom stays", () => {
    expect(app).not.toMatch(/user-scalable|maximum-scale/);
    expect(app).toContain("touch-manipulation");
  });
});

describe("the legacy styles", () => {
  it("have none of the page's frame left: the top bar, rail, main area, scrim, skip link and toasts are Tailwind in their components", () => {
    for (const name of ["topbar", "rail", "brand", "top-nav", "icon-button", "save-status", "chapter-link", "scrim", "mobile-menu", "skip", "toast-stack", "layout", "main"]) {
      expect(styles, `.${name} is back in styles.css`).not.toMatch(new RegExp(`\\.${name}(?![\\w-])`));
    }
  });
});

describe("the safe areas", () => {
  it("are four tokens read from the device, with the top bar and the rail column derived from them", () => {
    for (const side of ["top", "right", "bottom", "left"]) expect(tokens).toContain(`--safe-${side}:env(safe-area-inset-${side},0px)`);
    // --bar is what everything under the top bar is offset by, so it includes the notch; --bar-h is the bar itself.
    expect(tokens).toContain("--bar:calc(var(--bar-h) + var(--safe-top))");
    expect(tokens).toContain("--rail-col:calc(var(--rail-w) + var(--safe-left))");
  });
});

describe("the page template", () => {
  const meta = (name: string) => new RegExp(`<meta name="${name}"[^>]*>`).exec(page)?.[0] ?? "";

  it("reaches under the notch, and still lets a reader zoom", () => {
    const viewport = meta("viewport");
    expect(viewport).toContain("viewport-fit=cover");
    expect(viewport).not.toMatch(/user-scalable|maximum-scale|minimum-scale/);
  });

  it("asks iOS for the standard status bar, which is legible whatever the theme is", () => {
    // black-translucent would put the status bar's white text over the top bar, which is cream in a light theme.
    expect(meta("apple-mobile-web-app-status-bar-style")).toContain('content="default"');
  });

  it("carries both theme colours, the light one as its content and the dark one for theme-init.js", () => {
    expect(meta("theme-color")).toContain('content="%GUIDE_THEME_COLOR%"');
    expect(meta("theme-color")).toContain('data-dark="%GUIDE_THEME_COLOR_DARK%"');
  });
});
