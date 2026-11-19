import { Button } from "@hundo/core/components/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { guides, paletteOf } from "../.storybook/guides";
import type { GuideId, ThemeId } from "../.storybook/ids";

// Not a component: a guard on the setup. The axe checks only mean something if each of a test's renders really is the guide and theme
// it is counted as (.storybook/every-look.ts), with core's CSS processed. A page with no CSS, or the wrong palette, would otherwise pass on
// a blank look.
const meta = {
  title: "Foundation/Palette",
  component: Button,
  args: { look: "", children: "Primary" },
  render: (args) => (
    <div style={{ display: "flex", gap: 12 }}>
      <Button {...args} />
      <Button look="outline">Outline</Button>
    </div>
  ),
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const colourOf = (value: string) => {
  const probe = document.createElement("i");
  probe.style.color = value;
  document.body.append(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  return resolved;
};

export const GuideLook: Story = {
  play: async ({ canvas, globals }) => {
    const guide = globals.guide as GuideId;
    // In a test run, every-look.ts says which guide and theme this render is: the globals the story got have to agree. Unset, the stories
    // ran without it, under one look instead of ten.
    if (typeof __EVERY_LOOK__ !== "undefined") {
      await expect(globalThis.__STORY_LOOK__, "the look every-look.ts set for this render").toEqual({ guide, theme: globals.theme });
    }
    const palette = paletteOf(guide, globals.theme as ThemeId);
    const { brand } = guides[guide];
    const root = getComputedStyle(document.documentElement);
    const button = getComputedStyle(canvas.getByRole("button", { name: "Primary" }));
    const outline = getComputedStyle(canvas.getByRole("button", { name: "Outline" }));

    // The guide's palette is the one on the page, for this theme…
    await expect(root.getPropertyValue("--primary").trim().toLowerCase()).toBe(palette["--primary"].toLowerCase());
    // …core's CSS turned it into the button's fill and text…
    await expect(button.backgroundColor).toBe(colourOf(palette["--primary"]));
    await expect(button.color).toBe(colourOf(palette["--on-primary"]));
    // …a look's own border colour wins over any other (the outline button's edge is a visible line, not transparent)…
    await expect(outline.borderTopColor).toBe(colourOf("var(--control-line)"));
    await expect(outline.borderTopWidth).toBe("1px");
    // …the guide's corner preset reached the button…
    await expect(button.borderTopLeftRadius).toBe(brand.corners === "normal" ? "999px" : "8px");
    // …and its two font files are served and load (fonts.load() resolves with the faces it loaded, and rejects if a file 404s).
    await expect(getComputedStyle(document.body).fontFamily).toContain(brand.fonts.sans.family);
    for (const [font, weight] of [[brand.fonts.display, 700], [brand.fonts.sans, 400]] as const) {
      await expect((await document.fonts.load(`${weight} 16px "${font.family}"`)).length, `${font.family} loaded`).toBeGreaterThan(0);
    }
  },
};
