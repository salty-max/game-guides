import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App";
import { defaultState } from "../progress-state";
import { chapters } from "../guide";
import { useProgress } from "../store/progress";
import { useTheme } from "../store/theme";
import { useUi } from "../store/ui";
import { allowSlowMounts } from "../test/slow";

allowSlowMounts();

const firstRow = chapters[0].groups[0].rows[0];

beforeEach(() => {
  localStorage.clear();
  useProgress.setState({ data: defaultState(), storageError: false });
  useUi.setState({ toast: null, openGroups: {}, dialog: null, afterClose: null, announcement: "" });
  useTheme.setState({ preference: "system" });
  history.replaceState(null, "", "/guide/1");
});

const openSettings = async (user: ReturnType<typeof userEvent.setup>) => {
  render(<App />);
  const opener = await screen.findByRole("button", { name: "Change settings" });
  await user.click(opener);
  return { opener, dialog: await screen.findByRole("dialog", { name: "Guide settings" }) };
};

/** A backup file; jsdom's File has no text(), which the import reads with. */
const backup = (content: string) => {
  const file = new File([content], "backup.json", { type: "application/json" });
  file.text = () => Promise.resolve(content);
  return file;
};

describe("settings dialog", () => {
  it("opens on the chosen appearance, saves what was changed, and announces it once the dialog has gone", async () => {
    const user = userEvent.setup();
    const { dialog } = await openSettings(user);
    expect(within(dialog).getByRole("radio", { name: "Use device setting" })).toHaveFocus();

    await user.click(within(dialog).getByRole("radio", { name: "Dark" }));
    await user.click(within(dialog).getByRole("checkbox", { name: "Hide later chapters" }));
    await user.click(within(dialog).getByRole("combobox", { name: "Reveal through" }));
    await user.click(await screen.findByRole("option", { name: "Chapter 2" }));
    await user.click(within(dialog).getByRole("button", { name: "Save settings" }));

    expect(useTheme.getState().preference).toBe("dark");
    expect(useProgress.getState().data).toMatchObject({ spoilers: false, ceiling: 2 });
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    await waitFor(() => expect(useUi.getState().announcement).toBe("Guide settings saved."));
  });

  it("opens on the chosen appearance, not the first one, when the saved theme isn't the first", async () => {
    // Each radio's hidden input is aria-hidden and sits before the next radio: it must not take the focus.
    useTheme.setState({ preference: "dark" });
    const { dialog } = await openSettings(userEvent.setup());
    expect(within(dialog).getByRole("radio", { name: "Dark" })).toHaveFocus();
    expect(within(dialog).getByRole("radio", { name: "Dark" })).toBeChecked();
  });

  it("starts afresh when it is opened again before the last one has finished closing", async () => {
    const user = userEvent.setup();
    const { dialog } = await openSettings(user);
    await user.click(within(dialog).getByRole("radio", { name: "Dark" }));
    act(() => {
      useUi.getState().closeDialog();
      useUi.getState().openDialog({ kind: "settings" });
    });
    expect(await screen.findByRole("radio", { name: "Use device setting" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Dark" })).not.toBeChecked();
  });

  it("closes on Escape without saving, and gives the focus back to what opened it", async () => {
    const user = userEvent.setup();
    const { opener, dialog } = await openSettings(user);
    await user.click(within(dialog).getByRole("radio", { name: "Dark" }));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(useTheme.getState().preference).toBe("system");
    expect(opener).toHaveFocus();
  });

  it("closes from the close button", async () => {
    const user = userEvent.setup();
    const { dialog } = await openSettings(user);
    await user.click(within(dialog).getByRole("button", { name: "Close dialog" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  it("reads a backup, offers to replace with it, and announces the load after the dialog has gone", async () => {
    const user = userEvent.setup();
    const { dialog } = await openSettings(user);
    const replace = within(dialog).getByRole("button", { name: "Replace with backup" });
    expect(replace).toBeDisabled();

    await user.upload(within(dialog).getByLabelText(/Import progress backup/), backup(JSON.stringify({ ...defaultState(), checks: { [firstRow.id]: true } })));
    expect(await within(dialog).findByText(/1 checked entry found/)).toBeInTheDocument();
    expect(within(dialog).getByText("backup.json")).toBeInTheDocument();
    expect(replace).toBeEnabled();

    await user.click(replace);
    expect(useProgress.getState().data.checks[firstRow.id]).toBe(true);
    await waitFor(() => expect(useUi.getState().announcement).toBe("Progress backup loaded."));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("refuses a file that isn't a backup, and says so where a screen reader will hear it", async () => {
    const user = userEvent.setup();
    const { dialog } = await openSettings(user);
    await user.upload(within(dialog).getByLabelText(/Import progress backup/), backup("not json"));
    expect((await within(dialog).findByRole("status")).textContent).toMatch(/Couldn’t read this .* progress backup/);
    expect(within(dialog).getByRole("button", { name: "Replace with backup" })).toBeDisabled();
  });
});

describe("confirm dialog", () => {
  const ask = (danger: boolean) => {
    const onConfirm = vi.fn();
    act(() => useUi.getState().openDialog({ kind: "confirm", title: "Uncheck 11 entries?", explanation: "This clears every entry.", label: "Uncheck all", danger, onConfirm }));
    return onConfirm;
  };

  it("is an alert dialog described by its explanation, and focuses Cancel when the action destroys something", async () => {
    render(<App />);
    ask(true);
    const dialog = await screen.findByRole("alertdialog", { name: "Uncheck 11 entries?" });
    expect(dialog).toHaveAccessibleDescription("This clears every entry.");
    expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus();
  });

  it("focuses the confirm button when nothing is destroyed", async () => {
    render(<App />);
    ask(false);
    const dialog = await screen.findByRole("alertdialog");
    expect(within(dialog).getByRole("button", { name: "Uncheck all" })).toHaveFocus();
  });

  it("isn't dismissed by a click outside it, and runs the action once, after it has closed", async () => {
    const user = userEvent.setup();
    render(<App />);
    const onConfirm = ask(true);
    const dialog = await screen.findByRole("alertdialog");
    await user.click(document.body);
    expect(screen.getByRole("alertdialog")).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();

    await user.click(within(dialog).getByRole("button", { name: "Uncheck all" }));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
  });

  it("runs the action only once the page behind has come back for screen readers", async () => {
    // A modal dialog hides the page from assistive technology, so whatever the action announces would otherwise go unheard.
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    let pageReachable: boolean | null = null;
    const onConfirm = vi.fn(() => {
      pageReachable = screen.queryByRole("heading", { level: 1 }) !== null;
    });
    act(() => useUi.getState().openDialog({ kind: "confirm", title: "Uncheck 11 entries?", explanation: "…", label: "Uncheck all", onConfirm }));
    const dialog = await screen.findByRole("alertdialog");
    expect(screen.queryByRole("heading", { level: 1 })).toBeNull();
    await user.click(within(dialog).getByRole("button", { name: "Uncheck all" }));
    await waitFor(() => expect(onConfirm).toHaveBeenCalledTimes(1));
    expect(pageReachable).toBe(true);
  });

  it("does nothing on Cancel", async () => {
    const user = userEvent.setup();
    render(<App />);
    const onConfirm = ask(true);
    await user.click(within(await screen.findByRole("alertdialog")).getByRole("button", { name: "Cancel" }));
    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe("an action waiting for a dialog to finish closing", () => {
  it("runs at once if another dialog opens first, so it is neither lost nor left for a later close", () => {
    const after = vi.fn();
    useUi.getState().closeDialogThen(after);
    expect(after).not.toHaveBeenCalled();
    act(() => useUi.getState().openDialog({ kind: "settings" }));
    expect(after).toHaveBeenCalledTimes(1);
    expect(useUi.getState().afterClose).toBeNull();
  });
});
