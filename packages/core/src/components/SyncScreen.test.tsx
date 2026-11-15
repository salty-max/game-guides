import { act, cleanup, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App";
import { defaultState } from "../progress-state";
import { useProgress } from "../store/progress";
import { useSyncStatus } from "../store/sync";
import { useUi } from "../store/ui";
import { afterLinked, checkStatus, claimCode, forgetGroup, startCode, unlinkDevice } from "../sync/pairing";
import { allowSlowMounts } from "../test/slow";
import { ago } from "../format";

allowSlowMounts();

vi.mock("../sync/pairing", () => ({
  startCode: vi.fn(),
  checkStatus: vi.fn(),
  claimCode: vi.fn(),
  afterLinked: vi.fn(),
  unlinkDevice: vi.fn(),
  forgetGroup: vi.fn(),
}));

const pairing = { startCode: vi.mocked(startCode), checkStatus: vi.mocked(checkStatus), claimCode: vi.mocked(claimCode), afterLinked: vi.mocked(afterLinked), unlinkDevice: vi.mocked(unlinkDevice), forgetGroup: vi.mocked(forgetGroup) };

const NOW = Date.UTC(2026, 10, 15, 12, 0, 0);
const group = (now = NOW) => ({ ok: true as const, linked: true, now, devices: [{ label: "Safari · iPhone", seen: now - 30_000, self: true }, { label: "Chrome · Windows", seen: now - 3 * 3_600_000, self: false }] });

beforeEach(() => {
  localStorage.clear();
  useProgress.setState({ data: defaultState(), storageError: false });
  useUi.setState({ toast: null, openGroups: {}, dialog: null, afterClose: null, announcement: "" });
  useSyncStatus.setState({ phase: "off", devices: 0, lastSync: null });
  history.replaceState(null, "", "/guide/1");
  for (const mock of Object.values(pairing)) mock.mockReset();
  pairing.checkStatus.mockResolvedValue({ ok: true, linked: false, devices: [], now: NOW });
});

/** Opens the dialog. The engine sets the status from what it finds in the browser on starting, so a status a test wants is set after. */
const open = async (status?: Partial<ReturnType<typeof useSyncStatus.getState>>) => {
  render(<App />);
  act(() => {
    if (status) useSyncStatus.setState(status);
    useUi.getState().openDialog({ kind: "sync" });
  });
  return screen.findByRole("dialog", { name: "Sync devices" });
};

describe("the sync screen, before a device is linked", () => {
  it("offers a code to show or to enter, says what is kept, and starts on the first", async () => {
    const dialog = await open();
    expect(within(dialog).getByRole("button", { name: "Show a code" })).toHaveFocus();
    expect(within(dialog).getByRole("button", { name: "Enter a code" })).toBeInTheDocument();
    expect(dialog).toHaveAccessibleDescription(/same on your other devices/);
    expect(within(dialog).getByText(/No email or name/)).toBeInTheDocument();
    expect(within(dialog).getByText(/Spoiler settings sync too/)).toBeInTheDocument();
  });

  it("shows the code in groups of three, and moves on when another device types it", async () => {
    const user = userEvent.setup();
    pairing.startCode.mockResolvedValue({ ok: true, code: "482913", linked: false });
    const dialog = await open();
    await user.click(within(dialog).getByRole("button", { name: "Show a code" }));
    const spoken = await within(dialog).findByText("Your code is 4 8 2 9 1 3");
    // the code takes the focus, so a screen reader reads it out as the screen opens
    expect(spoken.parentElement).toHaveFocus();
    expect(within(dialog).getByText(/482\s913/)).toBeInTheDocument();
    expect(within(dialog).getByText(/Expires in 10:00/)).toBeInTheDocument();
    expect(pairing.afterLinked).not.toHaveBeenCalled();

    pairing.checkStatus.mockResolvedValue({ ...group(), devices: group().devices });
    await waitFor(() => expect(pairing.afterLinked).toHaveBeenCalledTimes(1), { timeout: 5000 });
    expect(await within(dialog).findByRole("status")).toHaveTextContent("Linked. Syncing your progress.");
    expect(useUi.getState().announcement).toBe("Linked. Syncing your progress.");
  });

  it("links itself when the server already has it in a group, as after a code was typed while this screen was closed", async () => {
    const user = userEvent.setup();
    pairing.startCode.mockResolvedValue({ ok: true, code: "314159", linked: true });
    pairing.checkStatus.mockResolvedValue(group());
    const dialog = await open();
    await user.click(within(dialog).getByRole("button", { name: "Show a code" }));
    await waitFor(() => expect(pairing.afterLinked).toHaveBeenCalledTimes(1));
    expect(await within(dialog).findByRole("status")).toHaveTextContent("Linked. Syncing your progress.");
  });

  it("ignores a second button while the first one's request is out", async () => {
    const user = userEvent.setup();
    let answer!: (code: Awaited<ReturnType<typeof startCode>>) => void;
    pairing.startCode.mockReturnValue(new Promise((resolve) => (answer = resolve)));
    const dialog = await open();
    await user.click(within(dialog).getByRole("button", { name: "Show a code" }));
    expect(within(dialog).getByRole("status")).toHaveTextContent("Getting a code…");
    await user.click(within(dialog).getByRole("button", { name: "Enter a code" }));
    await user.click(within(dialog).getByRole("button", { name: "Show a code" }));
    expect(within(dialog).queryByText(/Type the six digits/)).not.toBeInTheDocument();
    expect(pairing.startCode).toHaveBeenCalledTimes(1);
    await act(async () => answer({ ok: true, code: "112233", linked: false }));
    expect(await within(dialog).findByText("Your code is 1 1 2 2 3 3")).toBeInTheDocument();
  });

  it("says when the code couldn't be made", async () => {
    const user = userEvent.setup();
    pairing.startCode.mockResolvedValue({ ok: false, why: "limit" });
    const dialog = await open();
    await user.click(within(dialog).getByRole("button", { name: "Show a code" }));
    expect(await within(dialog).findByText(/Too many codes for now/)).toBeInTheDocument();
    pairing.startCode.mockResolvedValue({ ok: false, why: "offline" });
    await user.click(within(dialog).getByRole("button", { name: "Show a code" }));
    expect(await within(dialog).findByText(/Couldn’t reach the sync service/)).toBeInTheDocument();
  });

  it("takes a code typed in, links on the sixth digit, and says so", async () => {
    const user = userEvent.setup();
    pairing.claimCode.mockResolvedValue({ ok: true, already: false, moved: false });
    const dialog = await open();
    await user.click(within(dialog).getByRole("button", { name: "Enter a code" }));
    await within(dialog).findByText(/Type the six digits/);
    await user.keyboard("482913");
    await waitFor(() => expect(pairing.claimCode).toHaveBeenCalledWith("482913"));
    await waitFor(() => expect(pairing.afterLinked).toHaveBeenCalledTimes(1));
    expect(await within(dialog).findByRole("status")).toHaveTextContent("Linked. Syncing your progress.");
  });

  it("explains a code that didn't work, clears the boxes and lets the reader try again", async () => {
    const user = userEvent.setup();
    pairing.claimCode.mockResolvedValueOnce({ ok: false, why: "code" }).mockResolvedValue({ ok: true, already: false, moved: false });
    const dialog = await open();
    await user.click(within(dialog).getByRole("button", { name: "Enter a code" }));
    await within(dialog).findByText(/Type the six digits/);
    await user.keyboard("111111");
    expect(await within(dialog).findByText(/That code didn’t work. Codes last 10 minutes and work once/)).toBeInTheDocument();
    await waitFor(() => expect(within(dialog).getAllByRole("textbox")[0]).toHaveValue(""));
    await waitFor(() => expect(within(dialog).getAllByRole("textbox")[0]).toHaveFocus());
    await user.keyboard("222222");
    await waitFor(() => expect(pairing.claimCode).toHaveBeenLastCalledWith("222222"));
    expect(pairing.afterLinked).toHaveBeenCalledTimes(1);
  });

  it("goes back from either screen", async () => {
    const user = userEvent.setup();
    const dialog = await open();
    await user.click(within(dialog).getByRole("button", { name: "Enter a code" }));
    await user.click(await within(dialog).findByRole("button", { name: "Back" }));
    expect(await within(dialog).findByRole("button", { name: "Show a code" })).toBeInTheDocument();
  });
});

describe("a code that runs out", () => {
  it("says so after ten minutes, and gives a new one", async () => {
    vi.useFakeTimers({ toFake: ["Date", "setInterval", "clearInterval"] });
    try {
      const user = userEvent.setup();
      pairing.startCode.mockResolvedValue({ ok: true, code: "135790", linked: false });
      const dialog = await open();
      await user.click(within(dialog).getByRole("button", { name: "Show a code" }));
      await within(dialog).findByText(/Expires in 10:00/);
      act(() => {
        vi.advanceTimersByTime(10 * 60_000 + 1000);
      });
      expect(await within(dialog).findByText("This code has expired.")).toBeInTheDocument();
      pairing.startCode.mockResolvedValue({ ok: true, code: "246802", linked: false });
      await user.click(within(dialog).getByRole("button", { name: "Get a new code" }));
      const spoken = await within(dialog).findByText("Your code is 2 4 6 8 0 2");
      // the new code takes the focus, which the pressed button gave up when it went
      expect(spoken.parentElement).toHaveFocus();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("a linked device", () => {
  const synced = () => ({ phase: "synced" as const, devices: 2, lastSync: Date.now() });
  beforeEach(() => {
    pairing.checkStatus.mockResolvedValue(group(Date.now()));
  });

  it("lists the devices and how long ago each synced, and offers what can be done", async () => {
    const dialog = await open(synced());
    expect(await within(dialog).findByText("Safari · iPhone (this device)")).toBeInTheDocument();
    expect(within(dialog).getByText("Chrome · Windows")).toBeInTheDocument();
    expect(within(dialog).getByText("Last synced 3 hours ago")).toBeInTheDocument();
    // (a device seen half a minute ago is only said to have been seen lately: last-seen is refreshed by full syncs, every ten minutes or so)
    expect(within(dialog).getByText("Seen in the last 15 minutes")).toBeInTheDocument();
    expect(within(dialog).getByRole("status")).toHaveTextContent("Synced · 2 devices · just now");
    for (const name of ["Link another device", "Unlink this device", "Delete synced progress…"]) expect(within(dialog).getByRole("button", { name })).toBeInTheDocument();
    expect(within(dialog).getByRole("list", { name: "Linked devices" })).toBeInTheDocument();
  });

  it("says what the state is when it isn't synced", async () => {
    const dialog = await open({ phase: "offline", devices: 2, lastSync: Date.now() });
    expect(within(dialog).getByRole("status")).toHaveTextContent("Offline. Your changes are saved here and will sync when you’re back online.");
  });

  it("unlinks only this device, and says its progress stays", async () => {
    const user = userEvent.setup();
    pairing.unlinkDevice.mockImplementation(async () => {
      useSyncStatus.setState({ phase: "off", devices: 0 });
      return true;
    });
    const dialog = await open(synced());
    await user.click(await within(dialog).findByRole("button", { name: "Unlink this device" }));
    expect(await within(dialog).findByText("This device is unlinked. Its progress stays here.")).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Show a code" })).toBeInTheDocument();
  });

  it("stays linked and says why when the service can't be reached, with the focus where it was", async () => {
    const user = userEvent.setup();
    pairing.unlinkDevice.mockResolvedValue(false);
    const dialog = await open(synced());
    const unlink = await within(dialog).findByRole("button", { name: "Unlink this device" });
    await user.click(unlink);
    expect(await within(dialog).findByText(/this device is still linked/)).toBeInTheDocument();
    expect(unlink).toHaveFocus();
    expect(unlink).not.toHaveAttribute("aria-disabled");
  });

  it("says when it can't load the devices, and keeps the list it has when a later look fails", async () => {
    pairing.checkStatus.mockResolvedValue({ ok: false, why: "offline" });
    const dialog = await open(synced());
    expect(await within(dialog).findByText(/Couldn’t load the list of devices/)).toBeInTheDocument();
    pairing.checkStatus.mockResolvedValue(group(Date.now()));
    act(() => useSyncStatus.setState({ devices: 3, lastSync: Date.now() + 1 }));
    expect(await within(dialog).findByText("Safari · iPhone (this device)")).toBeInTheDocument();
    pairing.checkStatus.mockResolvedValue({ ok: false, why: "offline" });
    act(() => useSyncStatus.setState({ devices: 4, lastSync: Date.now() + 2 }));
    await waitFor(() => expect(pairing.checkStatus).toHaveBeenCalledTimes(3));
    expect(within(dialog).getByText("Safari · iPhone (this device)")).toBeInTheDocument();
  });

  it("asks before it deletes, with the cancel button focused, and deletes only on the second press", async () => {
    const user = userEvent.setup();
    pairing.forgetGroup.mockImplementation(async () => {
      useSyncStatus.setState({ phase: "off", devices: 0 });
      return true;
    });
    const dialog = await open(synced());
    await user.click(await within(dialog).findByRole("button", { name: "Delete synced progress…" }));
    expect(await within(dialog).findByText(/progress on each device stays/)).toBeInTheDocument();
    expect(within(dialog).getByRole("button", { name: "Cancel" })).toHaveFocus();
    expect(pairing.forgetGroup).not.toHaveBeenCalled();
    await user.click(within(dialog).getByRole("button", { name: "Cancel" }));
    expect(await within(dialog).findByRole("button", { name: "Delete synced progress…" })).toBeInTheDocument();
    await user.click(within(dialog).getByRole("button", { name: "Delete synced progress…" }));
    await user.click(await within(dialog).findByRole("button", { name: "Delete synced progress" }));
    await waitFor(() => expect(pairing.forgetGroup).toHaveBeenCalledTimes(1));
    expect(await within(dialog).findByText("Synced progress deleted. Progress on this device stays.")).toBeInTheDocument();
    expect(useUi.getState().announcement).toBe("Synced progress deleted. Progress on this device stays.");
  });

  it("says so, and deletes nothing, when the service can't be reached", async () => {
    const user = userEvent.setup();
    pairing.forgetGroup.mockResolvedValue(false);
    const dialog = await open(synced());
    await user.click(await within(dialog).findByRole("button", { name: "Delete synced progress…" }));
    await user.click(await within(dialog).findByRole("button", { name: "Delete synced progress" }));
    expect(await within(dialog).findByText(/nothing was deleted/)).toBeInTheDocument();
  });

  it("shows a code to link another device, and tells when one has joined", async () => {
    const user = userEvent.setup();
    pairing.startCode.mockResolvedValue({ ok: true, code: "970531", linked: true });
    const dialog = await open(synced());
    await user.click(await within(dialog).findByRole("button", { name: "Link another device" }));
    await within(dialog).findByText("Your code is 9 7 0 5 3 1");
    // the first look at the group is the baseline: nothing has joined yet
    expect(pairing.afterLinked).not.toHaveBeenCalled();
    pairing.checkStatus.mockResolvedValue({ ...group(Date.now()), devices: [...group().devices, { label: "Edge · Windows", seen: Date.now(), self: false }] });
    await waitFor(() => expect(within(dialog).getByRole("status")).toHaveTextContent("A device joined."), { timeout: 6000 });
    expect(pairing.afterLinked).not.toHaveBeenCalled();
  });
});

describe("on an iPhone, where each guide on the Home Screen keeps its own link", () => {
  const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1";
  const IPHONE_CHROME = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.0.0 Mobile/15E148 Safari/604.1";
  const apple = (installed: boolean, ua = IPHONE) => {
    vi.spyOn(navigator, "userAgent", "get").mockReturnValue(ua);
    vi.spyOn(window, "matchMedia").mockImplementation(((query: string) => ({ matches: installed && query.includes("standalone"), media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia);
  };
  afterEach(() => vi.restoreAllMocks());

  it("tells an installed app on the linked screen that every other guide on the Home Screen needs a code of its own", async () => {
    apple(true);
    pairing.checkStatus.mockResolvedValue(group(Date.now()));
    const dialog = await open({ phase: "synced", devices: 2, lastSync: Date.now() });
    expect(await within(dialog).findByText(/This guide is an app on your Home Screen, and each guide you add there keeps its own link/)).toBeInTheDocument();
  });

  it("tells a reader in Safari, already linked, that a guide added from now on should come up linked and one already there needs a code", async () => {
    apple(false);
    pairing.checkStatus.mockResolvedValue(group(Date.now()));
    const dialog = await open({ phase: "synced", devices: 2, lastSync: Date.now() });
    expect(await within(dialog).findByText(/a guide you add to the Home Screen from now on should come up linked; one that is already there needs a code of its own/)).toBeInTheDocument();
  });

  it("promises nothing about the Home Screen to a reader in another iPhone browser, whose apps' cookies aren't known", async () => {
    apple(false, IPHONE_CHROME);
    pairing.checkStatus.mockResolvedValue(group(Date.now()));
    const linked = await open({ phase: "synced", devices: 2, lastSync: Date.now() });
    expect(await within(linked).findByText(/each guide on your Home Screen keeps its own link: open its Sync screen and type a code there/)).toBeInTheDocument();
    expect(within(linked).queryByText(/should come up linked/)).not.toBeInTheDocument();
    cleanup();
    act(() => useSyncStatus.setState({ phase: "off", devices: 0, lastSync: null }));
    const off = await open();
    expect(within(off).getByText("On an iPhone or iPad, each guide on your Home Screen keeps its own link, and needs a code of its own.")).toBeInTheDocument();
    expect(within(off).queryByText(/after linking here in Safari/)).not.toBeInTheDocument();
  });

  it("says it before linking too, in the words that fit where the reader is", async () => {
    apple(true);
    const installedDialog = await open();
    expect(within(installedDialog).getByText(/each other guide on your Home Screen needs a code of its own/i)).toBeInTheDocument();
    cleanup();
    apple(false);
    const dialog = await open();
    expect(within(dialog).getByText(/each guide on your Home Screen keeps its own link. One you add after linking here in Safari should come up linked; one that is already there needs a code of its own/)).toBeInTheDocument();
  });

  it("says nothing of it elsewhere", async () => {
    pairing.checkStatus.mockResolvedValue(group(Date.now()));
    const dialog = await open({ phase: "synced", devices: 2, lastSync: Date.now() });
    expect(within(dialog).queryByText(/Home Screen/)).not.toBeInTheDocument();
  });
});

describe("where it is opened from", () => {
  it("is the topbar's status for a linked device, which says how sync stands, and the settings' otherwise", async () => {
    const user = userEvent.setup();
    render(<App />);
    act(() => useSyncStatus.setState({ phase: "synced", devices: 2, lastSync: Date.now() }));
    const status = await screen.findByRole("button", { name: "Progress saved. Synced. Open sync" });
    expect(status).toHaveTextContent("Progress saved · Synced");
    act(() => useSyncStatus.setState({ phase: "offline" }));
    expect(status).toHaveAttribute("data-error");
    act(() => useSyncStatus.setState({ phase: "off" }));
    await user.click(await screen.findByRole("button", { name: "Progress saved. Open progress settings" }));
    expect(await screen.findByRole("dialog", { name: "Guide settings" })).toBeInTheDocument();
  });

  it("is a button in the settings, which also says that an import follows to the other devices", async () => {
    const user = userEvent.setup();
    pairing.checkStatus.mockResolvedValue(group(Date.now()));
    render(<App />);
    act(() => {
      useSyncStatus.setState({ phase: "synced", devices: 2, lastSync: Date.now() });
      useUi.getState().openDialog({ kind: "settings" });
    });
    const settings = await screen.findByRole("dialog", { name: "Guide settings" });
    expect(within(settings).getByText(/Importing replaces the current progress, here and on every device you sync with/)).toBeInTheDocument();
    await user.click(within(settings).getByRole("button", { name: "Sync devices" }));
    expect(await screen.findByRole("dialog", { name: "Sync devices" })).toBeInTheDocument();
  });
});

describe("ago", () => {
  it("counts in minutes, hours and days, and says just now for the last minute", () => {
    const now = 10 * 86_400_000;
    expect(ago(now - 20_000, now)).toBe("just now");
    expect(ago(now - 60_000, now)).toBe("1 minute ago");
    expect(ago(now - 5 * 60_000, now)).toBe("5 minutes ago");
    expect(ago(now - 3_600_000, now)).toBe("1 hour ago");
    expect(ago(now - 5 * 3_600_000, now)).toBe("5 hours ago");
    expect(ago(now - 3 * 86_400_000, now)).toBe("3 days ago");
    expect(ago(now + 5000, now)).toBe("just now");
  });
});
