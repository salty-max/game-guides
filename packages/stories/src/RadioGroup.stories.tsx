import { RadioGroup } from "@hundo/core/components/controls";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentProps } from "react";
import { expect, userEvent } from "storybook/test";

const appearance: [string, string][] = [
  ["system", "Use device setting"],
  ["light", "Light"],
  ["dark", "Dark"],
];

/** Holds the value, as a form does. */
function Holder(args: ComponentProps<typeof RadioGroup>) {
  const [value, setValue] = useState(args.value);
  return <RadioGroup {...args} value={value} onChange={setValue} />;
}

const meta = {
  title: "Core/RadioGroup",
  component: RadioGroup,
  args: { label: "Appearance", choices: appearance, value: "system", onChange: () => {} },
  render: (args) => <Holder {...args} />,
  decorators: [(Story) => <div style={{ maxWidth: 460 }}><Story /></div>],
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const OtherChoice: Story = { args: { value: "dark" } };

/** The group is named by its label, and each segment by its text. */
export const Named: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole("radiogroup", { name: "Appearance" })).toBeVisible();
    await expect(canvas.getAllByRole("radio")).toHaveLength(3);
    await expect(canvas.getByRole("radio", { name: "Use device setting" })).toBeChecked();
  },
};

/** Tab lands on the chosen segment once, the arrow keys move and choose, and the 3px focus ring follows. */
export const Keyboard: Story = {
  play: async ({ canvas }) => {
    await userEvent.tab();
    await expect(canvas.getByRole("radio", { name: "Use device setting" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}");
    await expect(canvas.getByRole("radio", { name: "Light" })).toBeChecked();
    await expect(canvas.getByRole("radio", { name: "Light" })).toHaveFocus();
    await userEvent.keyboard("{ArrowRight}{ArrowRight}");
    // From the last segment the arrow wraps to the first.
    await expect(canvas.getByRole("radio", { name: "Use device setting" })).toBeChecked();
    await expect(canvas.getByRole("radio", { name: "Use device setting" })).toHaveFocus();
  },
};

export const Click: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Dark"));
    await expect(canvas.getByRole("radio", { name: "Dark" })).toBeChecked();
  },
};

/** What an element's colours ease with: each property it transitions, and over how long. */
const clock = (element: Element) => {
  const style = getComputedStyle(element);
  const durations = style.transitionDuration.split(", ");
  return Object.fromEntries(style.transitionProperty.split(", ").map((property, i) => [property, durations[i % durations.length]]));
};

/**
 * Choosing a segment is one step: its fill, edge and words, and those of the segment it replaces, ease over the same 150ms as the press's
 * tint, so nothing jumps while the tint lets go.
 */
export const OneStep: Story = {
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByText("Dark"));
    for (const name of ["Dark", "Use device setting"]) {
      await expect(clock(canvas.getByText(name).closest("label")!)).toEqual({ color: "0.15s", "background-color": "0.15s", "border-color": "0.15s", "box-shadow": "0.15s" });
    }
  },
};

/** While the theme changes (the root says so for a frame, useThemeEffects), the segments take their new colours at once, with the page. */
export const ThemeChange: Story = {
  play: async ({ canvasElement }) => {
    const root = document.documentElement;
    const theme = root.dataset.theme;
    root.dataset.themeSwitch = "";
    try {
      root.dataset.theme = theme === "dark" ? "light" : "dark";
      await expect([...canvasElement.querySelectorAll("label")].flatMap((label) => label.getAnimations())).toEqual([]);
    } finally {
      if (theme) root.dataset.theme = theme;
      await new Promise(requestAnimationFrame);
      delete root.dataset.themeSwitch;
    }
  },
};
