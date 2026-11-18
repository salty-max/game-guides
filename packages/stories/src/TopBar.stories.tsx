import { TopBar } from "@hundo/core/components/TopBar";
import { brand } from "@hundo/core/guide";
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

// The bar across the top of every page. From 800px down to 551px the menu button comes in. When the bar is tight the pages' icons go
// first, then the brand's name gives way; on a phone the bar is a title bar (the Phone story, at a phone's width): the pages move to the
// tab bar (MainNav), and the theme toggle stays.
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

/** Whether any of the box shows: it has a size, and the link around it (which clips a name with no room) doesn't cut it all away. */
const drawn = (part: HTMLElement) => {
  const box = part.getBoundingClientRect();
  const clip = part.closest("a")?.getBoundingClientRect();
  return box.width > 0 && box.height > 0 && (!clip || (box.top < clip.bottom && box.left < clip.right));
};

/** The top bar's parts left to right, as drawn: the menu button, the brand's tile and name, the pages and the buttons at the end. */
const barParts = (bar: HTMLElement) =>
  [...bar.querySelectorAll<HTMLElement>("button, img, strong, nav a")]
    .filter(drawn)
    .map((part) => part.getBoundingClientRect())
    .sort((a, b) => a.left - b.left);

/** Nothing in the bar over anything else, nothing past its edges, and the page doesn't scroll sideways. */
const nothingOverlaps = async (bar: HTMLElement) => {
  // (measured in the guide's own fonts: a fallback is narrower, and the brand's name in it can fit where the real one doesn't; a layout
  // first, so the fonts the bar uses have been asked for before waiting on them)
  bar.getBoundingClientRect();
  await document.fonts.ready;
  const parts = barParts(bar);
  for (let i = 1; i < parts.length; i++) await expect(parts[i - 1].right).toBeLessThanOrEqual(parts[i].left + 0.5);
  await expect(parts[0].left).toBeGreaterThanOrEqual(0);
  await expect(parts.at(-1)!.right).toBeLessThanOrEqual(bar.clientWidth + 0.5);
  await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(document.documentElement.clientWidth);
};

/**
 * A reader's larger default text (Chrome's "Large", a 20px root), which grows everything sized in rem around the bar's px words, with the
 * longest name a guide has (the stories draw Koholint's brand in every guide's look, and Echoes' name is twice as long).
 */
const largeTextLongName = () => {
  const { mark, name } = brand;
  Object.assign(brand, { mark: "Echoes of Wisdom", name: "Echoes of Wisdom Hundo" });
  document.documentElement.style.fontSize = "20px";
  return () => {
    Object.assign(brand, { mark, name });
    document.documentElement.style.fontSize = "";
  };
};

/** How many of the pages' icons show: one that wrapped away sits under its link, which clips it. */
const iconsShown = (nav: HTMLElement) =>
  [...nav.querySelectorAll("a")].filter((link) => {
    const box = link.getBoundingClientRect();
    const icon = link.querySelector("svg")!.getBoundingClientRect();
    return icon.width > 0 && icon.top >= box.top && icon.bottom <= box.bottom;
  }).length;

/**
 * A small tablet with large text, where the bar is tightest: the pages' icons go first, all four, then the brand gives way, its name
 * ellipsizing, and the pages keep their words and never cover it. (Echoes' name once ran under the Guide link here, and with large text
 * every guide's did.)
 */
export const SmallTabletLargeText: Story = {
  globals: { viewport: { value: "smallTablet", isRotated: false } },
  beforeEach: largeTextLongName,
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "Main navigation" });
    await expect(nav).toBeVisible();
    await nothingOverlaps(canvas.getByRole("banner"));
    await expect(iconsShown(nav)).toBe(0);
  },
};

/** A wide screen: room for the whole brand and the pages' icons, with no width named for them (they show wherever they fit). */
export const IconsWithRoom: Story = {
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("banner");
    bar.getBoundingClientRect();
    await document.fonts.ready;
    await expect(iconsShown(canvas.getByRole("navigation", { name: "Main navigation" }))).toBe(4);
    await nothingOverlaps(bar);
  },
};

/**
 * Just past 800px with large text, the rail beside the page: the brand's columns grow past the rail's width when the brand needs it, and
 * still give way before the pages do. The brand fills first, so while its name is cut short the pages show no icons.
 */
export const NarrowLaptopLargeText: Story = {
  globals: { viewport: { value: "narrowLaptop", isRotated: false } },
  beforeEach: largeTextLongName,
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole("button", { name: "Open chapters" })).toBeNull();
    const bar = canvas.getByRole("banner");
    await nothingOverlaps(bar);
    const name = bar.querySelector("strong")!;
    const clipped = name.scrollWidth > name.clientWidth || name.getBoundingClientRect().top >= name.closest("a")!.getBoundingClientRect().bottom;
    if (clipped) await expect(iconsShown(canvas.getByRole("navigation", { name: "Main navigation" }))).toBe(0);
  },
};

/**
 * Beside the rail on a small laptop: the brand's columns are as wide as the rail, so the pages start over the page. There isn't room to
 * centre the pages over the page's column with the buttons beside them, so they sit against the buttons' side (their margin apart).
 */
export const BesideTheRail: Story = {
  globals: { viewport: { value: "narrowLaptop", isRotated: false } },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("banner");
    bar.getBoundingClientRect();
    await document.fonts.ready;
    const brandCell = canvas.getByRole("link", { name: /home$/ }).parentElement!.getBoundingClientRect();
    const buttons = canvas.getByRole("button", { name: /Open sync devices$/ }).parentElement!.getBoundingClientRect();
    const nav = canvas.getByRole("navigation", { name: "Main navigation" });
    await expect(brandCell.width).toBeCloseTo(parseFloat(getComputedStyle(bar).getPropertyValue("--rail-w")), 0);
    await expect(nav.getBoundingClientRect().right + parseFloat(getComputedStyle(nav).marginRight)).toBeCloseTo(buttons.left, 0);
    await nothingOverlaps(bar);
  },
};

/**
 * A screen wider than the frame (--frame-max): the bar's contents sit on the frame the rail and the page share (Layout), centred, so the
 * brand's column starts where the rail does and is as wide, the buttons end the frame's width further on, less their margin, and the pages
 * are centred over the page's column.
 */
export const OnTheFrame: Story = {
  globals: { viewport: { value: "wide", isRotated: false } },
  play: async ({ canvas }) => {
    const bar = canvas.getByRole("banner");
    bar.getBoundingClientRect();
    await document.fonts.ready;
    const style = getComputedStyle(bar);
    const frame = parseFloat(style.getPropertyValue("--frame-max"));
    const railWidth = parseFloat(style.getPropertyValue("--rail-w"));
    const start = (bar.clientWidth - frame) / 2;
    await expect(start).toBeGreaterThan(0);
    const brandCell = canvas.getByRole("link", { name: /home$/ }).parentElement!.getBoundingClientRect();
    const buttons = canvas.getByRole("button", { name: /Open sync devices$/ }).parentElement!;
    await expect(brandCell.left).toBeCloseTo(start, 0);
    await expect(brandCell.width).toBeCloseTo(railWidth, 0);
    await expect(buttons.getBoundingClientRect().right + parseFloat(getComputedStyle(buttons).marginRight)).toBeCloseTo(start + frame, 0);
    const pages = canvas.getByRole("navigation", { name: "Main navigation" }).getBoundingClientRect();
    await expect(pages.left + pages.width / 2).toBeCloseTo((start + railWidth + start + frame) / 2, 0);
    await nothingOverlaps(bar);
  },
};
