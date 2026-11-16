import { TopBar } from "@hundo/core/components/TopBar";
import { useProgress } from "@hundo/core/store/progress";
import { useSyncStatus } from "@hundo/core/store/sync";
import { useUi } from "@hundo/core/store/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, type ComponentProps } from "react";
import { MemoryRouter } from "react-router";
import { expect, userEvent, waitFor } from "storybook/test";

/**
 * The bar with a ref of its own. A ref in the story's args is one object shared by every story, and React writes the menu button into it, so
 * a story's args held the last story's element (Storybook warned of a cycle in that arg, and with eight stories in this file the last one,
 * Phone, failed with "Maximum call stack size exceeded" until each render had a ref of its own). The meta's own `menuToggle` arg is only there
 * for the type: this wrapper replaces it.
 */
function Bar(props: ComponentProps<typeof TopBar>) {
  const menuToggle = useRef<HTMLButtonElement>(null);
  return <TopBar {...props} menuToggle={menuToggle} />;
}

// The bar across the top of every page. From 800px down to 551px the menu button comes in and the pages shrink to icons over words; on a
// phone the bar is a title bar (the Phone story, at a phone's width): the pages move to the tab bar (MainNav), and the theme toggle stays.
const meta = {
  title: "Core/TopBar",
  component: TopBar,
  render: (args) => <Bar {...args} />,
  args: { chapter: 1, view: "guide", menuOpen: false, onToggleMenu: () => {}, menuToggle: { current: null } },
  parameters: { layout: "fullscreen" },
  // The stores are shared by every story: each starts with a device that isn't linked, storage that works and no dialog open.
  beforeEach: () => {
    useSyncStatus.setState({ phase: "off", devices: 0, lastSync: null });
    useProgress.setState({ storageError: false });
    useUi.setState({ dialog: null, afterClose: null });
  },
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

/** On the guide: the page the reader is on is marked. The save status at the end is a button, named for where it leads: Sync devices. The brand tile is the
 * guide's painting, as its home-screen icon, at the screen's density, each size at a URL that carries its file's version; the link around it
 * carries the name. */
export const Guide: Story = {
  play: async ({ canvas }) => {
    const tile = canvas.getByRole("link", { name: /home$/ }).querySelector("img")!;
    await expect(tile).toHaveAttribute("alt", "");
    await expect(tile.getAttribute("src")).toMatch(/^\/icons\/tile-40\.png\?v=[0-9a-f]{8}$/);
    await expect(tile.getAttribute("srcset")!.split(", ").every((entry) => /\?v=[0-9a-f]{8} \dx$/.test(entry))).toBe(true);
    await waitFor(() => expect(tile.naturalWidth).toBeGreaterThanOrEqual(40));
    await expect(canvas.getByRole("button", { name: "Progress saved. Open sync devices" })).toBeEnabled();
  },
};

/** Not linked: the status says the progress is saved, and a press opens the Sync screen, where a code links the device. */
export const SaveStatusPress: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Progress saved. Open sync devices" }));
    await expect(useUi.getState().dialog).toEqual({ kind: "sync" });
  },
};

/** Linked and in step: the same button says how sync stands, and opens the same screen. */
export const SaveStatusSynced: Story = {
  beforeEach: () => {
    useSyncStatus.setState({ phase: "synced", devices: 2, lastSync: Date.now() });
  },
  play: async ({ canvas }) => {
    const status = canvas.getByRole("button", { name: "Progress saved. Synced. Open sync devices" });
    await expect(status).toHaveTextContent("Progress saved · Synced");
    await userEvent.click(status);
    await expect(useUi.getState().dialog).toEqual({ kind: "sync" });
  },
};

/** Sync can't be reached: the dot turns to the warning colour, the words say so, and the button still opens the Sync screen. */
export const SaveStatusOffline: Story = {
  beforeEach: () => {
    useSyncStatus.setState({ phase: "offline", devices: 2, lastSync: Date.now() });
  },
  play: async ({ canvas }) => {
    const status = canvas.getByRole("button", { name: "Progress saved. Offline. Open sync devices" });
    await expect(status).toHaveAttribute("data-error");
    await userEvent.click(status);
    await expect(useUi.getState().dialog).toEqual({ kind: "sync" });
  },
};

/** The browser won't keep the progress: the button says so, and opens the Sync screen, which carries the warning at its top. */
export const StorageUnavailable: Story = {
  beforeEach: () => {
    useProgress.setState({ storageError: true });
  },
  play: async ({ canvas }) => {
    const status = canvas.getByRole("button", { name: "Storage unavailable. Open sync devices" });
    await expect(status).toHaveTextContent("Storage unavailable");
    await expect(status).toHaveAttribute("data-error");
    await userEvent.click(status);
    await expect(useUi.getState().dialog).toEqual({ kind: "sync" });
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
