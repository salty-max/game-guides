import "@hundo/core/app.css";
import type { Decorator, Preview } from "@storybook/react-vite";
import { guideCss, guides } from "./guides";
import { GUIDES, THEMES, type GuideId, type ThemeId } from "./ids";

/** Puts the chosen guide's palette, fonts and corners on the page, the way a guide's own page carries them. */
const withGuide: Decorator = (Story, { globals }) => {
  const guide = globals.guide as GuideId;
  const root = document.documentElement;
  root.dataset.theme = globals.theme as ThemeId;
  root.dataset.corners = guides[guide].brand.corners;
  let style = document.getElementById("story-guide") as HTMLStyleElement | null;
  if (!style) {
    style = document.createElement("style");
    style.id = "story-guide";
    document.head.append(style);
  }
  if (style.dataset.guide !== guide) {
    style.textContent = guideCss(guide);
    style.dataset.guide = guide;
  }
  return <Story />;
};

const preview: Preview = {
  decorators: [withGuide],
  initialGlobals: { guide: "koholint", theme: "light" },
  globalTypes: {
    guide: {
      description: "Which guide's palette, fonts and corners",
      toolbar: { title: "Guide", icon: "paintbrush", dynamicTitle: true, items: GUIDES.map((value) => ({ value, title: guides[value].brand.shortName })) },
    },
    theme: {
      description: "Light or dark",
      toolbar: { title: "Theme", icon: "circlehollow", dynamicTitle: true, items: THEMES.map((value) => ({ value, title: value === "dark" ? "Dark" : "Light" })) },
    },
  },
  parameters: {
    layout: "padded",
    // Every story is checked with axe, in every guide and theme, and a violation fails the test run.
    a11y: { test: "error" },
  },
};

export default preview;
