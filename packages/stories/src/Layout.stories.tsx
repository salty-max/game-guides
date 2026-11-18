import { Layout } from "@hundo/core/components/Layout";
import { defaultState } from "@hundo/core/progress-state";
import { useProgress } from "@hundo/core/store/progress";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect } from "storybook/test";

// The frame of every page: the top bar, the rail and the page. The page here is a stand-in; what matters is where the frame puts things.
const meta = {
  title: "Core/Layout",
  component: Layout,
  args: { children: <p>The page.</p> },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => {
      useProgress.setState({ data: defaultState() });
      return (
        <MemoryRouter initialEntries={["/guide/1"]}>
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
    const root = getComputedStyle(document.documentElement);
    const frame = parseFloat(root.getPropertyValue("--frame-max"));
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
