import { ChapterHero } from "@hundo/core/components/ChapterHero";
import { LinkButton } from "@hundo/core/components/ui";
import { chapters, config } from "@hundo/core/guide";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect } from "storybook/test";

// The top of a chapter: the palette's tint with the chapter's banner fading in on the right (above the words when the hero is narrower
// than 40rem, whatever the screen, fading into the card at its foot), its number, region, title and intro, and the two buttons under them.
const meta = {
  title: "Core/ChapterHero",
  component: ChapterHero,
  args: {
    chapter: chapters[0],
    banner: config.banners[1],
    children: (
      <>
        <LinkButton to="/guide/1/start" look="accent" icon="down">
          Read walkthrough
        </LinkButton>
        <LinkButton to="/checklist/all/1" icon="checkList">
          Chapter checklist
        </LinkButton>
      </>
    ),
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof ChapterHero>;

export default meta;
type Story = StoryObj<typeof meta>;

/** With the chapter's banner. */
export const WithBanner: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("heading", { level: 1, name: chapters[0].title })).toBeVisible();
  },
};

/** A chapter with no banner yet: the tint alone. */
export const NoBanner: Story = { args: { banner: undefined } };

/** On a phone: the banner above the words, fading downwards into the card as it fades towards the words on a wide screen. */
export const Phone: Story = {
  globals: { viewport: { value: "phone", isRotated: false } },
  play: async ({ canvasElement }) => {
    const banner = canvasElement.querySelector("img");
    await expect(banner).not.toBeNull();
    const mask = getComputedStyle(banner!).maskImage;
    await expect(mask).toContain("linear-gradient");
    await expect(mask).toContain("to top");
  },
};

const inWidth = (width: number): Story["decorators"] => [
  (Story) => (
    <div style={{ width }}>
      <Story />
    </div>
  ),
];

/** Whether the banner stands beside the words (drawn over the hero's right part) rather than above them. */
const besideTheWords = (hero: HTMLElement) => {
  const banner = hero.querySelector("img")!.getBoundingClientRect();
  const words = hero.querySelector("h1")!.getBoundingClientRect();
  return banner.top <= words.top && banner.bottom >= words.bottom;
};

/** A tablet's column, 720px: the hero is wider than 40rem, so the banner stands beside the words, as on a wide screen. */
export const SideBySideInATabletColumn: Story = {
  decorators: inWidth(720),
  play: async ({ canvasElement }) => {
    await expect(besideTheWords(canvasElement.querySelector("section")!)).toBe(true);
  },
};

/** A column under 40rem on a wide screen: the hero follows its own width, not the screen's, and stacks. */
export const StackedInANarrowColumn: Story = {
  decorators: inWidth(560),
  play: async ({ canvasElement }) => {
    const hero = canvasElement.querySelector("section")!;
    await expect(besideTheWords(hero)).toBe(false);
    await expect(hero.querySelector("img")!.getBoundingClientRect().width).toBeCloseTo(hero.clientWidth, 0);
  },
};
