import { SealedChapter } from "@hundo/core/components/SealedChapter";
import { CHAPTER_COUNT, chapters } from "@hundo/core/guide";
import type { Decorator, Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, fn } from "storybook/test";

// A chapter past the ones the reader has revealed: its number and teaser over a veil in the guide's palette, never its title or art,
// centred in what is left of the page's height. Layout's tracks give it that height; here a column of a set height stands in for them.
// A story sets the track's height with the `track` parameter (720px unless it says).
const inTrack: Decorator = (Story, { parameters }) => (
  <MemoryRouter>
    <div data-track="" style={{ display: "flex", flexDirection: "column", height: (parameters.track as number | undefined) ?? 720, overflow: "auto" }}>
      <Story />
    </div>
  </MemoryRouter>
);

const meta = {
  title: "Core/SealedChapter",
  component: SealedChapter,
  args: { chapter: CHAPTER_COUNT, ceiling: 1, onReveal: fn() },
  decorators: [inTrack],
} satisfies Meta<typeof SealedChapter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The block's distance from the top and from the bottom of the track it sits in. */
const gaps = (canvasElement: HTMLElement) => {
  const track = canvasElement.querySelector<HTMLElement>("[data-track]")!.getBoundingClientRect();
  const block = canvasElement.querySelector("h1")!.closest<HTMLElement>(".isolate")!.getBoundingClientRect();
  return { above: block.top - track.top, below: track.bottom - block.bottom };
};

/** The guide's last chapter with only the first revealed: revealing it opens every chapter between. */
export const LastChapter: Story = {
  play: async ({ canvas, canvasElement, args }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: `Chapter ${CHAPTER_COUNT}: Not revealed yet` })).toBeVisible();
    await expect(canvas.getByText(`Revealing it now also reveals chapters 2 to ${CHAPTER_COUNT - 1}.`, { exact: false })).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Back to chapter 1" })).toHaveAttribute("href", "/guide/1");
    // Its title stays hidden: the page names it by number and by the rail's teaser only (which may be the title itself, as the rail shows it).
    const { title, teaser } = chapters[CHAPTER_COUNT - 1];
    await expect(canvasElement.textContent!.replace(teaser ?? "", "")).not.toContain(title);
    canvas.getByRole("button", { name: `Reveal chapter ${CHAPTER_COUNT}` }).click();
    await expect(args.onReveal).toHaveBeenCalledOnce();
    // In the middle of the room it is given, over the veil.
    const { above, below } = gaps(canvasElement);
    await expect(Math.abs(above - below)).toBeLessThan(2);
    const veil = canvasElement.querySelector<HTMLElement>('[aria-hidden="true"].absolute')!;
    await expect(getComputedStyle(veil).maskImage).toContain("radial-gradient");
  },
};

/** The chapter after the last one revealed: there is nothing between to mention. */
export const NextChapter: Story = {
  args: { chapter: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByText(/^Hidden to spare you spoilers until you reach it\.\s*$/)).toBeVisible();
  },
};

/** On a phone. */
export const Phone: Story = { globals: { viewport: { value: "phone", isRotated: false } } };

/** Less room than it needs (a short window): it starts at the top of the track and the track scrolls, nothing cut off above. */
export const TallerThanTheRoom: Story = {
  parameters: { track: 240 },
  play: async ({ canvasElement }) => {
    await expect(gaps(canvasElement).above).toBeGreaterThanOrEqual(0);
  },
};
