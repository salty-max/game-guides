import { TopBar } from "@hundo/core/components/TopBar";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, waitFor } from "storybook/test";

// The bar across the top of every page. From 800px down to 551px the menu button comes in and the pages shrink to icons over words; on a
// phone the bar is a title bar (the Phone story, at a phone's width): the pages move to the tab bar (MainNav), and the theme toggle stays.
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
 * guide's painting, as its home-screen icon, at the screen's density, each size at a URL that carries its file's version; the link around it
 * carries the name. */
export const Guide: Story = {
  play: async ({ canvas }) => {
    const tile = canvas.getByRole("link", { name: /home$/ }).querySelector("img")!;
    await expect(tile).toHaveAttribute("alt", "");
    await expect(tile.getAttribute("src")).toMatch(/^\/icons\/tile-40\.png\?v=[0-9a-f]{8}$/);
    await expect(tile.getAttribute("srcset")!.split(", ").every((entry) => /\?v=[0-9a-f]{8} \dx$/.test(entry))).toBe(true);
    await waitFor(() => expect(tile.naturalWidth).toBeGreaterThanOrEqual(40));
    await expect(canvas.getByRole("button", { name: "Progress saved. Open progress settings" })).toBeEnabled();
  },
};

export const Checklist: Story = { args: { view: "checklist" } };

export const Progress: Story = { args: { view: "dashboard" } };

/** On a phone: the menu, the guide's tile and name, the theme toggle and the save status, every button 44px. No pages: they are in the tab bar. */
export const Phone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Open chapters" })).toBeVisible();
    await expect(canvas.queryByRole("navigation", { name: "Main navigation" })).toBeNull();
    const toggle = canvas.getByRole("button", { name: /Switch to (dark|light) mode/ });
    await expect(toggle).toBeVisible();
    await expect(toggle.getBoundingClientRect().width).toBe(44);
    await expect(toggle.getBoundingClientRect().height).toBe(44);
    await expect(canvas.getByRole("link", { name: /home$/ })).toBeVisible();
    // Side by side, nothing over anything else, and nothing pushed past the bar's edge.
    const save = canvas.getByRole("button", { name: /^Progress saved/ }).getBoundingClientRect();
    await expect(canvas.getByRole("link", { name: /home$/ }).getBoundingClientRect().right).toBeLessThanOrEqual(toggle.getBoundingClientRect().left);
    await expect(toggle.getBoundingClientRect().right).toBeLessThanOrEqual(save.left);
    const bar = canvas.getByRole("banner");
    await expect(bar.scrollWidth).toBeLessThanOrEqual(bar.clientWidth);
    await expect(canvas.getByRole("link", { name: /home$/ }).querySelector("img")!.getBoundingClientRect().width).toBe(34);
    await expect(canvas.getByRole("button", { name: "Open chapters" }).getBoundingClientRect().height).toBe(44);
  },
};
