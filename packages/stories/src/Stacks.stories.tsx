import { Panel, PanelHead, PanelText, PanelTitle, Stacks } from "@hundo/core/components/ui";
import { useColumns } from "@hundo/core/useColumns";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";

// Cards in their order, laid out by Stacks with the column count useColumns reads from its grid, as the Questlines page lays out its
// lines. Each card is a few lines long; the second is the tallest, so a grid of rows would leave a hole between the first and the third.
const lengths = [1, 4, 1, 2, 1];

function Cards() {
  const [columns, grid] = useColumns();
  return (
    <Stacks ref={grid} columns={columns}>
      {lengths.map((length, at) => (
        <Panel key={at} aria-labelledby={`card-${at + 1}`}>
          <PanelHead>
            <PanelTitle id={`card-${at + 1}`}>Card {at + 1}</PanelTitle>
          </PanelHead>
          {Array.from({ length }, (_, line) => (
            <PanelText key={line}>
              Line {line + 1} of card {at + 1}.
            </PanelText>
          ))}
        </Panel>
      ))}
    </Stacks>
  );
}

const meta = {
  title: "Core/Stacks",
  component: Cards,
} satisfies Meta<typeof Cards>;

export default meta;
type Story = StoryObj<typeof meta>;

const box = (element: HTMLElement) => element.getBoundingClientRect();
const room = (stack: HTMLElement) => parseFloat(getComputedStyle(stack).rowGap);

/**
 * Where two columns of 22rem fit: the first, third and fifth cards down the left, the second and fourth down the right, each column as
 * tall as its own cards. The third card sits right under the first, though the second beside them is taller.
 */
export const TwoColumns: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 900 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const [one, two, three, four, five] = [1, 2, 3, 4, 5].map((n) => canvas.getByRole("region", { name: `Card ${n}` }));
    const [left, right] = [one.parentElement!, two.parentElement!];
    await expect([...left.children]).toEqual([one, three, five]);
    await expect([...right.children]).toEqual([two, four]);
    await expect(box(two).top).toBe(box(one).top);
    await expect(box(two).left).toBeGreaterThan(box(one).right);
    await expect(box(two).bottom).toBeGreaterThan(box(three).top);
    await expect(box(three).top).toBeCloseTo(box(one).bottom + room(left), 1);
    await expect(box(four).top).toBeCloseTo(box(two).bottom + room(right), 1);
  },
};

/** Where they don't: one list in the cards' order, in the page as on screen, each card under the one before it. */
export const OneColumn: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
  play: async ({ canvas }) => {
    const cards = canvas.getAllByRole("region");
    await expect(cards.map((card) => card.getAttribute("aria-labelledby"))).toEqual(["card-1", "card-2", "card-3", "card-4", "card-5"]);
    await expect(new Set(cards.map((card) => card.parentElement)).size).toBe(1);
    for (const [before, card] of cards.slice(1).map((card, at) => [cards[at], card])) {
      await expect(box(card).left).toBe(box(before).left);
      await expect(box(card).top).toBeCloseTo(box(before).bottom + room(card.parentElement!), 1);
    }
  },
};
