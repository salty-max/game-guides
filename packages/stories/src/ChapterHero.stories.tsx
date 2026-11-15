import { ChapterHero } from "@hundo/core/components/ChapterHero";
import { LinkButton } from "@hundo/core/components/ui";
import { chapters, config } from "@hundo/core/guide";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect } from "storybook/test";

// The top of a chapter: the palette's tint with the chapter's banner fading in on the right (above the words up to 1050px wide), its
// number, region, title and intro, and the two buttons under them.
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
