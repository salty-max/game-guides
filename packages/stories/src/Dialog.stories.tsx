import { DialogHost } from "@hundo/core/components/DialogHost";
import { Button } from "@hundo/core/components/ui";
import { useUi, type DialogState } from "@hundo/core/store/ui";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";

type Opened = NonNullable<DialogState>;

/** A page with a button that opens the dialog, the way the app does, and the dialog host. */
function Page({ dialog }: { dialog: Opened }) {
  const openDialog = useUi((s) => s.openDialog);
  return (
    <>
      <h1>The page behind</h1>
      <Button look="" onClick={() => openDialog(dialog)}>
        Open
      </Button>
      <DialogHost />
    </>
  );
}

/** The dialog renders in a portal on the page, outside the story's own element. */
const page = (canvasElement: HTMLElement) => within(canvasElement.ownerDocument.body);

// Waits for what a modal and its fade need on a busy machine; these only have to catch something that never happens.
const patient = { timeout: 15_000 };

const meta = {
  title: "Core/Dialog",
  component: Page,
  args: { dialog: { kind: "settings" } },
  decorators: [
    (Story) => {
      // Each story starts with no dialog open: the store is shared by every story.
      useUi.setState({ dialog: null, afterClose: null });
      return (
        <MemoryRouter initialEntries={["/guide/1"]}>
          <Story />
        </MemoryRouter>
      );
    },
  ],
} satisfies Meta<typeof Page>;

export default meta;
type Story = StoryObj<typeof meta>;

const confirm = (danger: boolean, onConfirm: () => void = fn()): Opened => ({
  kind: "confirm",
  title: "Uncheck 11 entries?",
  explanation: "This clears every entry in “Chapter route”. You can undo it right after.",
  label: "Uncheck all",
  danger,
  onConfirm,
});

/** The settings screen: a dialog with a form, a list of choices, and the backup. */
export const Settings: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await page(canvasElement).findByRole("dialog", { name: "Guide settings" }, patient);
    // The first field has the focus, not the close button.
    await waitFor(() => expect(within(dialog).getByRole("radio", { checked: true })).toHaveFocus(), patient);
  },
};

/** A question that destroys something: the safe answer has the focus. */
export const ConfirmDanger: Story = {
  args: { dialog: confirm(true) },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await page(canvasElement).findByRole("alertdialog", { name: "Uncheck 11 entries?" }, patient);
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus(), patient);
    await expect(dialog).toHaveAccessibleDescription(/clears every entry/);
  },
};

export const Confirm: Story = {
  args: { dialog: confirm(false) },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await page(canvasElement).findByRole("alertdialog", { name: "Uncheck 11 entries?" }, patient);
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Uncheck all" })).toHaveFocus(), patient);
  },
};

/** Escape closes it, and the focus goes back to the button that opened it. */
export const EscapeReturnsFocus: Story = {
  play: async ({ canvas, canvasElement }) => {
    const opener = canvas.getByRole("button", { name: "Open" });
    await userEvent.click(opener);
    await page(canvasElement).findByRole("dialog", { name: "Guide settings" }, patient);
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(page(canvasElement).queryByRole("dialog")).toBeNull(), patient);
    await waitFor(() => expect(opener).toHaveFocus(), patient);
  },
};

/**
 * The action of a question runs only once the dialog is gone and the page is back for screen readers: a modal hides the page behind it,
 * so a toast or announcement made earlier would not be heard. This story covers the animated close in a real browser; the no-animation
 * close, where the callback would come too early, is held by DialogHost.test.tsx.
 */
export const ActionRunsAfterThePageIsBack: Story = {
  args: {
    dialog: confirm(false, () => {
      ranWithPageReachable = within(document.body).queryByRole("heading", { name: "The page behind" }) !== null;
    }),
  },
  play: async ({ canvas, canvasElement }) => {
    ranWithPageReachable = null;
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await page(canvasElement).findByRole("alertdialog", { name: "Uncheck 11 entries?" }, patient);
    await expect(within(document.body).queryByRole("heading", { name: "The page behind" })).toBeNull();
    await userEvent.click(within(dialog).getByRole("button", { name: "Uncheck all" }));
    await waitFor(() => expect(ranWithPageReachable).not.toBeNull(), patient);
    await expect(ranWithPageReachable).toBe(true);
  },
};

let ranWithPageReachable: boolean | null = null;
