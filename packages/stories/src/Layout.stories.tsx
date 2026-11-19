import { Layout } from "@hundo/core/components/Layout";
import { Pages } from "@hundo/core/components/Pages";
import { GuidePage } from "@hundo/core/pages/GuidePage";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter, Route } from "react-router";
import { expect } from "storybook/test";

// The frame of every page: the top bar, the rail and the page. The page here is a stand-in; what matters is where the frame puts things.
const meta = {
  title: "Core/Layout",
  component: Layout,
  args: { children: <p>The page.</p> },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story, { parameters }) => {
      useProgress.setState({ data: defaultState() });
      return (
        <MemoryRouter initialEntries={[(parameters.at as string | undefined) ?? "/guide/1"]}>
          <Story />
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof Layout>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * A screen wider than the frame (--frame-max): the rail and the page are centred together, the top bar's contents on the same frame, the
 * band left of the rail in the rail's tint, and <main> running on to the screen's right edge (what scrolls in the installed app).
 */
export const WideFrame: Story = {
  globals: { viewport: { value: "wide", isRotated: false } },
  play: async ({ canvasElement }) => {
    await document.fonts.ready;
    // (the token is rem, tokens.css: the root's font size turns it into px)
    const root = getComputedStyle(document.documentElement);
    const frame = parseFloat(root.getPropertyValue("--frame-max")) * parseFloat(root.fontSize);
    const width = document.documentElement.clientWidth;
    const start = (width - frame) / 2;
    await expect(start).toBeGreaterThan(0);
    const rail = canvasElement.querySelector<HTMLElement>("aside[aria-label=Chapters]")!.getBoundingClientRect();
    const bar = canvasElement.querySelector("header")!.firstElementChild!.getBoundingClientRect();
    const main = canvasElement.querySelector<HTMLElement>("main")!;
    const page = main.firstElementChild!.getBoundingClientRect();
    await expect(rail.left).toBeCloseTo(start, 0);
    await expect(bar.left).toBeCloseTo(start, 0);
    await expect(bar.right).toBeCloseTo(start + frame, 0);
    await expect(page.left).toBeCloseTo(rail.right, 0);
    await expect(page.right).toBeCloseTo(start + frame, 0);
    await expect(main.getBoundingClientRect().right).toBeCloseTo(width, 0);
    const band = getComputedStyle(main.parentElement!, "::before");
    await expect(band.backgroundColor).toBe(getComputedStyle(canvasElement.querySelector("aside[aria-label=Chapters]")!).backgroundColor);
    await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(width);
  },
};

/** How far the hidden chapter's block is from the top and from the bottom of the room <main> gives a page (its content box). */
const roomAround = (canvasElement: HTMLElement) => {
  const main = canvasElement.querySelector("main")!;
  const box = main.getBoundingClientRect();
  const style = getComputedStyle(main);
  const block = canvasElement.querySelector("h1")!.closest(".isolate")!.getBoundingClientRect();
  return { above: block.top - (box.top + parseFloat(style.paddingTop)), below: box.bottom - parseFloat(style.paddingBottom) - block.bottom };
};

/**
 * A hidden chapter, through the real page (Pages, GuidePage): the frame, <main>, the page and the kept page's element each fill what is left
 * of the screen's height, so the block sits in the middle of it, with no height worked out for it.
 */
export const HiddenChapterInTheMiddle: Story = {
  args: {
    children: (
      <Pages>
        <Route path="/guide/:chapter?/:entry?" element={<GuidePage />} />
      </Pages>
    ),
  },
  parameters: { at: "/guide/3" },
  play: async ({ canvasElement }) => {
    const { above, below } = roomAround(canvasElement);
    await expect(above).toBeGreaterThan(40);
    await expect(Math.abs(above - below)).toBeLessThan(2);
  },
};

/** The same on a phone, between the title bar and the tab bar. */
export const HiddenChapterInTheMiddleOnAPhone: Story = {
  ...HiddenChapterInTheMiddle,
  globals: { viewport: { value: "phone", isRotated: false } },
};
