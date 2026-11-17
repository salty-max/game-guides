import { MainNav } from "@hundo/core/components/MainNav";
import { cats } from "@hundo/core/guide";
import { arrive, forgetPlaces } from "@hundo/core/store/place";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { use } from "react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { expect, within } from "storybook/test";

// Guide, Checklist, the guide's Questlines page and Progress. From 551px up they are links in the top bar (TopBar's stories show them there); on a phone, a tab bar
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
    await expect(within(nav).getAllByRole("link")).toHaveLength(4);
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

// A page that never finishes drawing: the move to it stays pending, the way a slow page's does.
const never = new Promise<never>(() => {});
function Pending() {
  use(never);
  return null;
}

function Bar() {
  const view = useLocation().pathname.split("/")[1] || "guide";
  return (
    <>
      <MainNav chapter={1} view={view} place="bottom" />
      <Routes>
        <Route path="/checklist" element={<p>The checklist</p>} />
        <Route path="/dashboard" element={<Pending />} />
      </Routes>
    </>
  );
}

/** A tab pressed is marked at once, before its page is drawn (the router moves in a transition, which keeps the old page meanwhile). */
export const PressedBeforeItsPage: Story = {
  args: { place: "bottom" },
  globals: { viewport: { value: "phone", isRotated: false } },
  render: () => <Bar />,
  play: async ({ canvas, userEvent }) => {
    const nav = canvas.getByRole("navigation", { name: "Main navigation" });
    await userEvent.click(within(nav).getByRole("link", { name: "Progress" }));
    await expect(within(nav).getByRole("link", { name: "Progress" })).toHaveAttribute("aria-current", "page");
    await expect(within(nav).getByRole("link", { name: "Checklist" })).not.toHaveAttribute("aria-current");
    // The old page is still the one on screen.
    await expect(canvas.getByText("The checklist")).toBeVisible();
  },
};
