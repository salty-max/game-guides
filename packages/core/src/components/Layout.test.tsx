import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { panels } from "virtual:guide/panels";
import { App } from "../App";
import { defaultState } from "../progress-state";
import { useProgress } from "../store/progress";
import { useTheme } from "../store/theme";
import { useUi } from "../store/ui";
import { allowSlowMounts } from "../test/slow";

allowSlowMounts();

beforeEach(() => {
  localStorage.clear();
  useProgress.setState({ data: defaultState(), storageError: false });
  useUi.setState({ toast: null, openGroups: {}, dialog: null, afterClose: null, announcement: "" });
  useTheme.setState({ preference: "system" });
  history.replaceState(null, "", "/guide/1");
});

afterEach(() => {
  delete document.documentElement.dataset.standalone;
  vi.restoreAllMocks();
});

const installed = () => {
  document.documentElement.dataset.standalone = "";
};

describe("a way back in the installed app", () => {
  it("is there once the reader has moved, takes them back, and goes when they are where they began", async () => {
    installed();
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();

    await user.click(screen.getByRole("link", { name: /Checklist/ }));
    expect(await screen.findByRole("heading", { name: "Completion checklist" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Back" }));
    await waitFor(() => expect(location.pathname).toBe("/guide/1"));
    await waitFor(() => expect(screen.queryByRole("button", { name: "Back" })).toBeNull());
    // The button had the focus when it went, and the focus isn't left to fall to the page. (Here Layout's own page-change effect takes it
    // for <main>; the hand-off to the brand is the next test, at an address where the page takes none.)
    expect(document.body).not.toHaveFocus();
  });

  // A dashboard panel's address only scrolls to the panel: Layout leaves the focus alone for an address that points at something, and the
  // page takes none, so the hand-off from the Back button that goes while pressed is all that keeps it off the document. (Echoes has no panel.)
  const atAPanel = panels.length > 0 ? it : it.skip;
  atAPanel("hands the focus to the brand when it goes while pressed and the page it returns to takes none", async () => {
    installed();
    const address = `/dashboard/${panels[0]?.id}`;
    history.replaceState(null, "", address);
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    await user.click(screen.getByRole("link", { name: /Checklist/ }));
    await screen.findByRole("heading", { name: "Completion checklist" });
    await user.click(screen.getByRole("button", { name: "Back" }));
    await waitFor(() => expect(location.pathname).toBe(address));
    await waitFor(() => expect(screen.queryByRole("button", { name: "Back" })).toBeNull());
    await waitFor(() => expect(screen.getByRole("link", { name: /home$/ })).toHaveFocus());
  });

  it("is not in a browser tab, which has its own", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("link", { name: /Checklist/ }));
    await screen.findByRole("heading", { name: "Completion checklist" });
    expect(screen.queryByRole("button", { name: "Back" })).toBeNull();
  });
});

describe("the colour of the strip above the page", () => {
  const strip = () => document.querySelector('meta[name="theme-color"]')?.getAttribute("content");

  beforeEach(() => {
    document.head.insertAdjacentHTML("beforeend", '<meta name="theme-color" content="#fffef9">');
    document.documentElement.style.setProperty("--surface", "#fffef9");
  });

  afterEach(() => {
    document.querySelector('meta[name="theme-color"]')?.remove();
    document.documentElement.style.removeProperty("--surface");
  });

  it("is the top bar's, and the top bar's with the backdrop over it while a dialog has the page dimmed", async () => {
    // a canvas that blends the two colours into a known one
    const filled: string[] = [];
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      canvas: { width: 0, height: 0 },
      set fillStyle(color: string) {
        filled.push(color);
      },
      fillRect: () => {},
      getImageData: () => ({ data: [10, 20, 30, 255] }),
    } as unknown as CanvasRenderingContext2D);
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    expect(strip()).toBe("#fffef9");

    act(() => useUi.getState().openDialog({ kind: "settings" }));
    await waitFor(() => expect(strip()).toBe("rgb(10, 20, 30)"));
    expect(filled[0]).toBe("#fffef9");

    act(() => useUi.getState().closeDialog());
    await waitFor(() => expect(strip()).toBe("#fffef9"));
  });

  it("follows the theme when it changes, not one change behind", async () => {
    // Each theme has its own surface colour, as the guides' theme.css give them; the one the strip takes must be the new theme's.
    document.documentElement.style.removeProperty("--surface");
    const sheet = document.createElement("style");
    sheet.textContent = ':root{--surface:#fffef9}:root[data-theme="dark"]{--surface:#192720}';
    document.head.append(sheet);
    try {
      const user = userEvent.setup();
      useTheme.setState({ preference: "light" });
      render(<App />);
      await user.click(await screen.findByRole("button", { name: "Switch to dark mode" }));
      await waitFor(() => expect(strip()).toBe("#192720"));
      await user.click(screen.getByRole("button", { name: "Switch to light mode" }));
      await waitFor(() => expect(strip()).toBe("#fffef9"));
    } finally {
      sheet.remove();
    }
  });

  it("stays the top bar's where a canvas can't blend them", async () => {
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    act(() => useUi.getState().openDialog({ kind: "settings" }));
    await screen.findByRole("dialog");
    expect(strip()).toBe("#fffef9");
  });
});

describe("moving to another page", () => {
  it("takes the content area back to the top as well as the window: in the installed app it is what scrolls", async () => {
    const scrolled = vi.spyOn(HTMLElement.prototype, "scrollTo");
    const user = userEvent.setup();
    render(<App />);
    await user.click(await screen.findByRole("link", { name: /Checklist/ }));
    await screen.findByRole("heading", { name: "Completion checklist" });
    expect(scrolled).toHaveBeenCalledWith(0, 0);
    expect(scrolled.mock.contexts.some((element) => (element as HTMLElement).id === "main")).toBe(true);
  });
});

describe("the chapter drawer under 800px", () => {
  let narrow = true;
  let changed: (() => void) | undefined;
  beforeEach(() => {
    narrow = true;
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          get matches() {
            return query.includes("800px") ? narrow : false;
          },
          media: query,
          addEventListener: (_: string, listener: () => void) => {
            if (query.includes("800px")) changed = listener;
          },
          removeEventListener() {},
        }) as unknown as MediaQueryList,
    );
  });

  // While the drawer is open the page behind it, the menu button included, is hidden from screen readers: keep hold of the button.
  let button: HTMLElement;
  const toggle = () => (button ??= screen.getByRole("button", { name: "Open chapters" }));
  afterEach(() => {
    button = undefined as unknown as HTMLElement;
  });

  it("opens from the menu button as a modal with the chapters, and Escape gives the focus back to the button", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    expect(screen.queryByRole("complementary", { name: "Chapters" })).toBeNull();
    await user.click(toggle());
    const drawer = await screen.findByRole("dialog", { name: "Chapters" });
    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    expect(toggle()).toHaveAttribute("aria-controls", drawer.id);
    await waitFor(() => expect(within(drawer).getByRole("link", { current: "page" })).toHaveFocus());
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
    await waitFor(() => expect(toggle()).toHaveFocus());
  });

  it("closes when a chapter is followed, and the focus goes to the page, not back to the button", async () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false, ceiling: 9 } });
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    await user.click(toggle());
    const drawer = await screen.findByRole("dialog", { name: "Chapters" });
    await user.click(within(drawer).getAllByRole("link")[1]);
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(location.pathname).toBe("/guide/2");
    await waitFor(() => expect(document.getElementById("main")).toHaveFocus());
  });

  it("doesn't come back when the reader goes back to the page it was opened on", async () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false, ceiling: 9 } });
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    await user.click(toggle());
    await user.click(within(await screen.findByRole("dialog", { name: "Chapters" })).getAllByRole("link")[1]);
    await waitFor(() => expect(location.pathname).toBe("/guide/2"));
    act(() => history.back());
    await waitFor(() => expect(location.pathname).toBe("/guide/1"));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(toggle()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes on the current chapter's link too, whose address doesn't change", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    await user.click(toggle());
    await user.click(within(await screen.findByRole("dialog", { name: "Chapters" })).getByRole("link", { current: "page" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(location.pathname).toBe("/guide/1");
    // A followed link puts the reader in the page, as any other chapter's does.
    await waitFor(() => expect(document.getElementById("main")).toContainElement(document.activeElement as HTMLElement));
  });

  it("stays open when a chapter is opened in a new tab with a modifier key", async () => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false, ceiling: 9 } });
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    await user.click(toggle());
    const drawer = await screen.findByRole("dialog", { name: "Chapters" });
    const link = within(drawer).getAllByRole("link")[1];
    // jsdom has no new tab to open; keep it from trying.
    link.addEventListener("click", (event) => event.preventDefault());
    await user.keyboard("{Meta>}");
    await user.click(link);
    await user.keyboard("{/Meta}");
    // Layout's own state: it would flip at once if the drawer had asked to close, whatever its exit animation does.
    expect(toggle()).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("dialog", { name: "Chapters" })).toBeInTheDocument();
  });

  it("stays open under the settings dialog opened from it, and Escape closes only the dialog", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    await user.click(toggle());
    const drawer = await screen.findByRole("dialog", { name: "Chapters" });
    await user.click(within(drawer).getByRole("button", { name: "Change settings" }));
    const settings = await screen.findByRole("dialog", { name: "Guide settings" });
    // The key goes to whatever has the focus: wait until the settings have it, as a reader's Escape would.
    await waitFor(() => expect(settings).toContainElement(document.activeElement as HTMLElement));
    await user.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Guide settings" })).toBeNull());
    expect(screen.getByRole("dialog", { name: "Chapters" })).toBeInTheDocument();
  });

  it("goes when the screen widens past 800px, and the rail is a column again", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    await user.click(toggle());
    await screen.findByRole("dialog", { name: "Chapters" });
    narrow = false;
    act(() => changed?.());
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
    expect(screen.getByRole("complementary", { name: "Chapters" })).toBeInTheDocument();
    // The menu button the drawer would give the focus back to is hidden at this width: the focus goes into the page instead.
    await waitFor(() => expect(document.getElementById("main")).toContainElement(document.activeElement as HTMLElement));
  });
});
