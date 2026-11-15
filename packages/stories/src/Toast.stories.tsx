import { Toasts } from "@hundo/core/components/Toasts";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

// The toasts as the app shows them, bottom right (full width at phone sizes). ToastHost, which feeds them from the store and the service
// worker, needs the PWA plugin's virtual module, which Storybook doesn't have, so the stories give the chunk its props directly.
const meta = {
  title: "Core/Toast",
  component: Toasts,
  args: { toast: null, update: null, reload: fn(), dismissUpdate: fn() },
} satisfies Meta<typeof Toasts>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The toasts render in a portal on the page, outside the story's own element. */
const page = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);
const patient = { timeout: 15_000 };

const undo = fn();

/** After a bulk check: the message, Undo and Dismiss. Undo runs the action and closes the toast. */
export const Undo: Story = {
  args: { toast: { id: 1, message: "Checked 7 steps.", undo } },
  play: async ({ canvasElement }) => {
    const body = page(canvasElement);
    await userEvent.click(await body.findByRole("button", { name: "Undo" }, patient));
    await expect(undo).toHaveBeenCalledOnce();
    await waitFor(() => expect(body.queryByText("Checked 7 steps.")).toBeNull(), patient);
  },
};

/** A note with nothing to undo, like the one sync leaves: only Dismiss. */
export const Note: Story = { args: { toast: { id: 2, message: "Progress updated from your other device." } } };

/** A new version is waiting: Reload or Later, and it stays until the reader picks one. */
export const NewVersion: Story = {
  args: { update: "refresh" },
  play: async ({ canvasElement, args }) => {
    const body = page(canvasElement);
    await userEvent.click(await body.findByRole("button", { name: "Reload" }, patient));
    await expect(args.reload).toHaveBeenCalledOnce();
  },
};

/** The guide has just become usable offline. "Got it" is its only button, so it can't be hidden from a screen reader. */
export const Offline: Story = {
  args: { update: "offline" },
  play: async ({ canvasElement, args }) => {
    const body = page(canvasElement);
    await userEvent.click(await body.findByRole("button", { name: "Got it" }, patient));
    await waitFor(() => expect(args.dismissUpdate).toHaveBeenCalledOnce(), patient);
  },
};

/** Both at once, stacked. */
export const Both: Story = { args: { toast: { id: 3, message: "Checked 3 steps.", undo: fn() }, update: "refresh" } };
