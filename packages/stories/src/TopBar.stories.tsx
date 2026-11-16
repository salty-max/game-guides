import { TopBar } from "@hundo/core/components/TopBar";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, waitFor } from "storybook/test";

// The bar across the top of every page. From 800px down to 551px the menu button comes in and the pages shrink to icons over words; on a
// phone the bar is a title bar (the Phone story, at a phone's width): the pages move to the tab bar (MainNav) and the theme to the settings.
const meta = {
  title: "Core/TopBar",
  component: TopBar,
  args: { chapter: 1, view: "guide", menuOpen: false, onToggleMenu: () => {}, menuToggle: { current: null } },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/guide/1"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof TopBar>;

export default meta;
type Story = StoryObj<typeof meta>;

/** On the guide: the page the reader is on is marked. The save status at the end is a button, named for where it leads. The brand tile is the
 * guide's painting, as its home-screen icon, at the screen's density; the link around it carries the name. */
export const Guide: Story = {
  play: async ({ canvas }) => {
    const tile = canvas.getByRole("link", { name: /home$/ }).querySelector("img")!;
    await expect(tile).toHaveAttribute("alt", "");
    await waitFor(() => expect(tile.naturalWidth).toBeGreaterThanOrEqual(40));
    await expect(canvas.getByRole("button", { name: "Progress saved. Open progress settings" })).toBeEnabled();
  },
};

export const Checklist: Story = { args: { view: "checklist" } };

export const Progress: Story = { args: { view: "dashboard" } };

/** On a phone: the menu, the guide's name and the save status. No pages and no theme button, which are in the tab bar and the settings. */
export const Phone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Open chapters" })).toBeVisible();
    await expect(canvas.queryByRole("navigation", { name: "Main navigation" })).toBeNull();
    await expect(canvas.queryByRole("button", { name: /Switch to (dark|light) mode/ })).toBeNull();
    await expect(canvas.getByRole("link", { name: /home$/ })).toBeVisible();
    await expect(canvas.getByRole("link", { name: /home$/ }).querySelector("img")!.getBoundingClientRect().width).toBe(34);
    await expect(canvas.getByRole("button", { name: "Open chapters" }).getBoundingClientRect().height).toBe(44);
  },
};
