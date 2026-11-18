import "@hundo/core/app.css";
import { chunks } from "@hundo/core/components/chunks";
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
  // The dialog and the select load on use. Load them before a story renders, so that axe and the interaction tests see the real
  // components, not the stand-ins shown while they load.
  loaders: [async () => void (await Promise.all(Object.values(chunks).map((chunk) => chunk.load())))],
  decorators: [withGuide],
  // A story that ends on a change (a segment chosen, a box ticked) leaves the control's colours easing for 150ms (press-style.ts). This
  // runs before axe's check, so axe reads the colours they end on, not one on the way.
  afterEach: async () => {
    const easing = document.getAnimations().filter((animation) => animation instanceof CSSTransition);
    await Promise.all(easing.map((animation) => animation.finished.catch(() => undefined)));
  },
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
    // A phone's screen, for the stories of what changes at 550px and under (a story asks for it with its viewport global). The test
    // runner sizes its page to it too (addon-vitest), so the media queries and usePhone see a phone.
    // The two in between are where the top bar is tightest: a small tablet's (the menu button and the pages, no rail), and just past
    // 800px (the rail beside the page). Their "large" twins are the same places for a reader whose default text is 20px: the widths are
    // em, so that reader reaches them at 1.25 times the width (700 and 1025px), and a story that sets a 20px root there sees what they
    // see. The wide one is past the frame's width (--frame-max), where the bar's contents sit on the frame.
    viewport: {
      options: {
        phone: { name: "Phone", styles: { width: "375px", height: "812px" }, type: "mobile" },
        smallTablet: { name: "Small tablet", styles: { width: "560px", height: "800px" }, type: "tablet" },
        narrowLaptop: { name: "Narrow laptop", styles: { width: "820px", height: "800px" }, type: "desktop" },
        smallTabletLarge: { name: "Small tablet, 20px text", styles: { width: "700px", height: "800px" }, type: "tablet" },
        narrowLaptopLarge: { name: "Narrow laptop, 20px text", styles: { width: "1025px", height: "800px" }, type: "desktop" },
        wide: { name: "Wide monitor", styles: { width: "2000px", height: "900px" }, type: "desktop" },
      },
    },
  },
};

export default preview;
