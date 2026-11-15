import { SourceLinks } from "@hundo/core/components/SourceLinks";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, userEvent } from "storybook/test";

// "Sources and maps" under a chapter: Base UI's collapsible, closed by default, its list hidden until found while closed.
const meta = {
  title: "Core/SourceLinks",
  component: SourceLinks,
  args: {
    items: [
      ["Zelda Wiki · Tail Cave", "https://zeldawiki.wiki/wiki/Tail_Cave"],
      ["The full sources page", "/sources"],
    ],
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof SourceLinks>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Closed, as a chapter shows it: only the button. */
export const Closed: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("button", { name: "Sources and maps" })).toHaveAttribute("aria-expanded", "false");
    // Still in the page, but not rendered: hidden until found.
    for (const link of canvas.getAllByRole("link")) await expect(link.closest("[hidden]")).toHaveAttribute("hidden", "until-found");
  },
};

/** Opened: the links, one to another site and one inside the guide. */
export const Opened: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Sources and maps" }));
    await expect(canvas.getByRole("button", { name: "Sources and maps" })).toHaveAttribute("aria-expanded", "true");
    const links = canvas.getAllByRole("link");
    await expect(links).toHaveLength(2);
    for (const link of links) await expect(link.closest("[hidden]")).toBeNull();
  },
};
