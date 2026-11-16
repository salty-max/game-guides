import { DialogHost } from "@hundo/core/components/DialogHost";
import { Button, PageHeading } from "@hundo/core/components/ui";
import { useInstall, type InstallOffer } from "@hundo/core/store/install";
import { useProgress } from "@hundo/core/store/progress";
import { useSyncStatus } from "@hundo/core/store/sync";
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
      <PageHeading title="The page behind" />
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
      // Nor any install line: Chromium hasn't offered, and the story isn't Safari on an iPhone.
      useInstall.setState({ offer: null, safari: false });
      // Storage that works and a device that isn't linked: a story that needs otherwise says so.
      useProgress.setState({ storageError: false });
      useSyncStatus.setState({ phase: "off", devices: 0, lastSync: null });
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

/** The settings screen: a dialog with a form, a list of choices, Keep screen on (Chrome has a wake lock), and the backup. */
export const Settings: Story = {
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await page(canvasElement).findByRole("dialog", { name: "Guide settings" }, patient);
    // The first field has the focus, not the close button.
    await waitFor(() => expect(within(dialog).getByRole("radio", { checked: true })).toHaveFocus(), patient);
    await expect(within(dialog).getByRole("switch", { name: "Keep screen on" })).not.toBeChecked();
  },
};

/** The browser won't keep the progress: the settings say so just above the backup, in the words the Sync screen uses at its top. */
export const SettingsStorageUnavailable: Story = {
  args: { dialog: { kind: "settings" } },
  play: async ({ canvas, canvasElement }) => {
    useProgress.setState({ storageError: true });
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await page(canvasElement).findByRole("dialog", { name: "Guide settings" }, patient);
    // (visible once the dialog has faded in)
    await waitFor(() => expect(within(dialog).getByText("Browser storage is unavailable. Export a backup before closing this tab.")).toBeVisible(), patient);
  },
};

/** The Sync screen of a device that isn't linked, which is where the status button in the title bar leads: what syncing is, and how to link. */
export const Sync: Story = {
  args: { dialog: { kind: "sync" } },
  play: async ({ canvas, canvasElement }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await page(canvasElement).findByRole("dialog", { name: "Sync devices" }, patient);
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Show a code" })).toHaveFocus(), patient);
    // (visible once the dialog has faded in)
    await waitFor(() => expect(within(dialog).getByRole("button", { name: "Enter a code" })).toBeVisible(), patient);
    await expect(dialog).toHaveAccessibleDescription(/same on your other devices/);
    await expect(within(dialog).getByText(/Your progress is already saved on this device. To share it, show a code here/)).toBeVisible();
    await expect(within(dialog).queryByText(/Browser storage is unavailable/)).toBeNull();
  },
};

/** The Sync screen when the browser won't keep the progress: the warning is the first thing in it, above what the screen is for, with an Export progress button under it. */
export const SyncStorageUnavailable: Story = {
  args: { dialog: { kind: "sync" } },
  play: async ({ canvas, canvasElement }) => {
    useProgress.setState({ storageError: true });
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await page(canvasElement).findByRole("dialog", { name: "Sync devices" }, patient);
    const warning = within(dialog).getByText("Browser storage is unavailable. Export a backup before closing this tab.");
    // (visible once the dialog has faded in)
    await waitFor(() => expect(warning).toBeVisible(), patient);
    const description = within(dialog).getByText(/same on your other devices/);
    await expect(warning.compareDocumentPosition(description) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // the backup it asks for is right under it, and the screen doesn't say the progress is saved
    await expect(within(dialog).getByRole("button", { name: "Export progress" })).toBeVisible();
    await expect(within(dialog).queryByText(/already saved on this device/)).toBeNull();
  },
};

/** Settings once Chromium has offered to install the guide: Install app, whose press shows the browser's own dialog. */
export const SettingsInstall: Story = {
  play: async ({ canvas, canvasElement }) => {
    const offer = Object.assign(new Event("beforeinstallprompt"), { prompt: fn(() => Promise.resolve()) }) as unknown as InstallOffer;
    useInstall.setState({ offer });
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await page(canvasElement).findByRole("dialog", { name: "Guide settings" }, patient);
    await userEvent.click(within(dialog).getByRole("button", { name: "Install app" }));
    await expect(offer.prompt).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(within(dialog).queryByRole("button", { name: "Install app" })).toBeNull(), patient);
  },
};

/** Settings in Safari on an iPhone or iPad: the way to the Home Screen, and what the app starts with. */
export const SettingsSafari: Story = {
  play: async ({ canvas, canvasElement }) => {
    useInstall.setState({ safari: true });
    await userEvent.click(canvas.getByRole("button", { name: "Open" }));
    const dialog = await page(canvasElement).findByRole("dialog", { name: "Guide settings" }, patient);
    // (visible once the dialog has faded in)
    await waitFor(() => expect(within(dialog).getByText(/Add to Home Screen/)).toBeVisible(), patient);
    await expect(within(dialog).getByText(/none of this tab’s progress/)).toBeVisible();
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
