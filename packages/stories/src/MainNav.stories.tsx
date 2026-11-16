import { MainNav } from "@hundo/core/components/MainNav";
import { cats } from "@hundo/core/guide";
import { arrive, forgetPlaces } from "@hundo/core/store/place";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, within } from "storybook/test";

// Guide, Checklist and Progress. From 551px up they are links in the top bar (TopBar's stories show them there); on a phone, a tab bar
// across the bottom of the screen, each page's icon over its name, the current one tinted in the guide's own corners. Each link goes back
// to its page as the reader left it (store/place.ts).
const meta = {
  title: "Core/MainNav",
  component: MainNav,
  args: { chapter: 1, view: "checklist", place: "top" },
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/checklist"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
} satisfies Meta<typeof MainNav>;

export default meta;
type Story = StoryObj<typeof meta>;

/** In the top bar: the page the reader is on is marked, for a screen reader too. */
export const Top: Story = {
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "Main navigation" });
    await expect(within(nav).getByRole("link", { name: "Checklist" })).toHaveAttribute("aria-current", "page");
    await expect(within(nav).getByRole("link", { name: "Guide" })).toHaveAttribute("href", "/guide/1");
  },
};

/** The tab bar on a phone, at the bottom of the screen. */
export const Bottom: Story = {
  args: { place: "bottom" },
  globals: { viewport: { value: "phone", isRotated: false } },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "100dvh" }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "Main navigation" });
    await expect(nav).toBeVisible();
    await expect(within(nav).getByRole("link", { name: "Checklist" })).toHaveAttribute("aria-current", "page");
    await expect(within(nav).getAllByRole("link")).toHaveLength(3);
    // The rule that takes the bar away while a field you type in has the focus on a touch screen: a story's pointer isn't coarse, so
    // this checks the stylesheet has it, keyed on the body's focused input, rather than seeing it work.
    // (the utilities are inside a layer, so the walk goes into every grouping rule)
    const walk = (rules: CSSRuleList): CSSRule[] => [...rules].flatMap((rule) => (rule instanceof CSSGroupingRule ? [rule, ...walk(rule.cssRules)] : [rule]));
    const touchRules = [...document.styleSheets]
      .flatMap((sheet) => walk(sheet.cssRules))
      .filter((rule): rule is CSSMediaRule => rule instanceof CSSMediaRule && rule.conditionText.includes("pointer: coarse"))
      .flatMap((rule) => walk(rule.cssRules).map((inner) => inner.cssText));
    await expect(touchRules.some((text) => text.includes("body:has(input") && text.includes(":focus") && text.includes("display: none"))).toBe(true);
  },
};

const category = Object.keys(cats)[0];

/** Away from the checklist, its tab goes back to the last checklist address the reader was on: here, one category's. */
export const BackToTheChecklist: Story = {
  args: { place: "bottom", view: "guide" },
  globals: { viewport: { value: "phone", isRotated: false } },
  decorators: [
    (Story) => (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", minHeight: "100dvh" }}>
        <Story />
      </div>
    ),
  ],
  beforeEach: () => {
    arrive(`/checklist/${category}`, "story", false);
    return () => forgetPlaces();
  },
  play: async ({ canvas }) => {
    const nav = canvas.getByRole("navigation", { name: "Main navigation" });
    await expect(within(nav).getByRole("link", { name: "Guide" })).toHaveAttribute("aria-current", "page");
    await expect(within(nav).getByRole("link", { name: "Checklist" })).toHaveAttribute("href", `/checklist/${category}`);
  },
};
