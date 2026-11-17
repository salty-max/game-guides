import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App";
import { defaultState } from "../progress-state";
import { CHAPTER_COUNT, cats } from "../guide";
import { arrive, forgetPlaces, restoreLaunch } from "../store/place";
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
  vi.restoreAllMocks();
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

describe("coming back to a page", () => {
  // jsdom doesn't scroll: the window's offset is set by hand, and a scroll event tells Layout, as the browser would.
  const scrollWindowTo = (y: number) => {
    Object.defineProperty(window, "scrollY", { value: y, configurable: true });
    act(() => void document.dispatchEvent(new Event("scroll")));
  };
  const tab = (name: RegExp) => within(screen.getByRole("navigation", { name: "Main navigation" })).getByRole("link", { name });

  beforeEach(() => forgetPlaces());
  afterEach(() => Object.defineProperty(window, "scrollY", { value: 0, configurable: true }));

  it("finds each tab's page where the reader left it, and a page reached by a link at its top", async () => {
    history.replaceState(null, "", "/checklist");
    const scrolled = vi.spyOn(window, "scrollTo");
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Completion checklist" });
    scrollWindowTo(900);

    await user.click(tab(/Progress/));
    await screen.findByRole("heading", { name: "Your progress" });
    expect(scrolled).toHaveBeenLastCalledWith(0, 0);
    scrollWindowTo(250);

    await user.click(tab(/Checklist/));
    await screen.findByRole("heading", { name: "Completion checklist" });
    expect(scrolled).toHaveBeenLastCalledWith(0, 900);
    // The focus goes into the page, as it does for any page change.
    expect(screen.getByRole("main")).toHaveFocus();

    await user.click(tab(/Progress/));
    await screen.findByRole("heading", { name: "Your progress" });
    expect(scrolled).toHaveBeenLastCalledWith(0, 250);

    // A chapter's link on the progress page is a new visit: its top.
    await user.click(screen.getAllByRole("link", { name: /Chapter|01/ }).find((link) => link.getAttribute("href") === "/guide/1")!);
    await screen.findByRole("heading", { level: 1 });
    expect(scrolled).toHaveBeenLastCalledWith(0, 0);
  });

  it("goes Back to where that very entry of the history was left, when the page is in the history twice", async () => {
    history.replaceState(null, "", "/checklist");
    const scrolled = vi.spyOn(window, "scrollTo");
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Completion checklist" });
    scrollWindowTo(700);
    await user.click(tab(/Progress/));
    await screen.findByRole("heading", { name: "Your progress" });
    // The checklist again, a second entry in the history, left further up.
    await user.click(tab(/Checklist/));
    await screen.findByRole("heading", { name: "Completion checklist" });
    scrollWindowTo(300);
    act(() => history.back());
    await screen.findByRole("heading", { name: "Your progress" });
    act(() => history.back());
    await screen.findByRole("heading", { name: "Completion checklist" });
    await waitFor(() => expect(scrolled).toHaveBeenLastCalledWith(0, 700));
  });

  const later = CHAPTER_COUNT > 1 ? it : it.skip;
  later("sends the Checklist tab to the plain list when its last address names a chapter that is hidden now", async () => {
    const category = Object.keys(cats)[0];
    arrive(`/checklist/${category}/2`, "earlier", false);
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    expect(tab(/Checklist/)).toHaveAttribute("href", "/checklist");
  });

  it("brings back no filter from an earlier visit to a page the reader went to afresh", async () => {
    history.replaceState(null, "", "/dashboard");
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Your progress" });
    // A category's link on the progress page (the Checklist tab, which goes back to the last checklist address, is in the top bar).
    const category = () => within(screen.getByRole("main")).getAllByRole("link").find((link) => link.getAttribute("href")?.startsWith("/checklist/"))!;
    const search = () => screen.findByRole("searchbox", { name: "Search entries" });
    await user.click(category());
    await user.type(await search(), "sword");
    await user.click(tab(/Progress/));
    await waitFor(() => expect(screen.queryByRole("searchbox")).toBeNull());
    // The same link again is a new visit: the search is empty, and stays so after a tab away and back.
    await user.click(category());
    expect(await search()).toHaveValue("");
    await user.click(tab(/Guide/));
    await screen.findByRole("heading", { level: 1 });
    await user.click(tab(/Checklist/));
    expect(await search()).toHaveValue("");
  });

  it("opens at the place saved when the guide went into the background, filters and all, without taking the focus", async () => {
    history.replaceState(null, "", "/checklist");
    const user = userEvent.setup();
    const { unmount } = render(<App />);
    await user.type(await screen.findByRole("searchbox", { name: "Search entries" }), "sword");
    scrollWindowTo(480);
    act(() => void window.dispatchEvent(new Event("pagehide")));
    unmount();
    forgetPlaces();

    // The next launch, at the start address.
    history.replaceState(null, "", "/");
    const scrolled = vi.spyOn(window, "scrollTo");
    expect(restoreLaunch()).toBe("/checklist");
    render(<App />);
    expect(await screen.findByRole("searchbox", { name: "Search entries" })).toHaveValue("sword");
    expect(scrolled).toHaveBeenLastCalledWith(0, 480);
    expect(screen.getByRole("main")).not.toHaveFocus();
  });

  it("shows a tab's page as it was left, not one built again, and a link to it builds it afresh", async () => {
    history.replaceState(null, "", "/checklist");
    const user = userEvent.setup();
    render(<App />);
    const search = await screen.findByRole("searchbox", { name: "Search entries" });
    await user.click(tab(/Progress/));
    await screen.findByRole("heading", { name: "Your progress" });
    // Kept, out of sight: not in the accessibility tree while another page is on screen.
    expect(screen.queryByRole("searchbox")).toBeNull();
    expect(search.isConnected).toBe(true);
    await user.click(tab(/Checklist/));
    expect(await screen.findByRole("searchbox", { name: "Search entries" })).toBe(search);

    await user.click(tab(/Progress/));
    const link = within(screen.getByRole("main")).getAllByRole("link").find((each) => each.getAttribute("href") === "/guide/1")!;
    await user.click(tab(/Guide/));
    const heading = await screen.findByRole("heading", { level: 1 });
    await user.click(tab(/Progress/));
    await user.click(link);
    expect(await screen.findByRole("heading", { level: 1 })).not.toBe(heading);
  });

  for (const width of ["wide", "phone"] as const) {
    it(`never has two of an id in the page while pages are kept (${width})`, async () => {
      if (width === "phone")
        vi.spyOn(window, "matchMedia").mockImplementation(
          (query: string) => ({ matches: /max-width: (550|800)px/.test(query), media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
        );
      history.replaceState(null, "", "/dashboard");
      const user = userEvent.setup();
      render(<App />);
      await screen.findByRole("heading", { level: 1 });
      for (const [name, heading] of [[/Checklist/, "Completion checklist"], [/Guide/, undefined], [/Progress/, "Your progress"]] as const) {
        await user.click(tab(name));
        await screen.findByRole("heading", { level: 1, ...(heading ? { name: heading } : {}) });
      }
      const ids = [...document.querySelectorAll("[id]")].map((element) => element.id);
      expect(ids.filter((id, i) => ids.indexOf(id) !== i)).toEqual([]);
    });
  }

  it("comes back without an open select: it closes as the focus moves into the next page", async () => {
    history.replaceState(null, "", "/dashboard");
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Your progress" });
    await user.click(tab(/Checklist/));
    await user.click(await screen.findByRole("combobox", { name: "Status" }));
    await screen.findByRole("listbox");
    act(() => history.back());
    await screen.findByRole("heading", { name: "Your progress" });
    act(() => history.forward());
    await screen.findByRole("heading", { name: "Completion checklist" });
    expect(screen.queryByRole("listbox")).toBeNull();
  });

  it("keeps the checklist's filters for a reader coming back from another tab", async () => {
    history.replaceState(null, "", "/checklist");
    const user = userEvent.setup();
    render(<App />);
    await user.type(await screen.findByRole("searchbox", { name: "Search entries" }), "sword");
    await user.click(tab(/Guide/));
    await screen.findByRole("heading", { level: 1 });
    await user.click(tab(/Checklist/));
    expect(await screen.findByRole("searchbox", { name: "Search entries" })).toHaveValue("sword");
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

describe("on a phone", () => {
  // The widths the layout reads in JavaScript (useNarrow.ts): a phone is under both.
  // The top bar: the first header (a page's own heading block is a header too, which jsdom also counts as a banner).
  const topBar = () => screen.getAllByRole("banner")[0];
  const phone = () =>
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) => ({ matches: /max-width: (550|800)px/.test(query), media: query, addEventListener() {}, removeEventListener() {} }) as unknown as MediaQueryList,
    );

  it("has the pages in one bar after the page, and the theme button in the top bar", async () => {
    phone();
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    const navs = screen.getAllByRole("navigation", { name: "Main navigation" });
    expect(navs).toHaveLength(1);
    // After the main area, as a phone's tab bar is, and not in the top bar.
    expect(screen.getByRole("main").compareDocumentPosition(navs[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(within(topBar()).queryByRole("link", { name: /Checklist/ })).toBeNull();
    expect(within(topBar()).getByRole("button", { name: /Switch to (dark|light) mode/ })).toBeInTheDocument();
    expect(within(navs[0]).getByRole("link", { name: /Guide/ })).toHaveAttribute("aria-current", "page");
  });

  it("takes a page back to its top when its tab is pressed again, and leaves a modified click to the browser", async () => {
    phone();
    history.replaceState(null, "", "/checklist");
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Completion checklist" });
    const scrolled = vi.spyOn(window, "scrollTo");
    const tab = within(screen.getByRole("navigation", { name: "Main navigation" })).getByRole("link", { name: /Checklist/ });
    await user.click(tab);
    expect(scrolled).toHaveBeenCalledWith(expect.objectContaining({ top: 0 }));
    expect(location.pathname).toBe("/checklist");

    scrolled.mockClear();
    const click = new MouseEvent("click", { bubbles: true, cancelable: true, ctrlKey: true });
    act(() => void tab.dispatchEvent(click));
    expect(scrolled).not.toHaveBeenCalled();
  });

  it("is a top bar of links on a wider screen, with the theme button", async () => {
    render(<App />);
    await screen.findByRole("heading", { level: 1 });
    expect(within(topBar()).getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getAllByRole("navigation", { name: "Main navigation" })).toHaveLength(1);
    expect(screen.getByRole("button", { name: /Switch to (dark|light) mode/ })).toBeInTheDocument();
  });

  it("puts the checklist's category, chapter and status in a sheet, and shows what's on as chips that turn it off", async () => {
    phone();
    history.replaceState(null, "", "/checklist");
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Completion checklist" });
    // The chips and the search stay on the page; the selects don't.
    expect(screen.getByRole("group", { name: "Checklist categories" })).toBeInTheDocument();
    expect(screen.getByRole("searchbox")).toBeInTheDocument();
    expect(screen.queryByRole("combobox", { name: "Status" })).toBeNull();

    const filters = screen.getByRole("button", { name: "Filters" });
    await user.click(filters);
    const sheet = await screen.findByRole("dialog", { name: "Filters" });
    await user.click(within(sheet).getByRole("combobox", { name: "Status" }));
    await user.click(await screen.findByRole("option", { name: "Completed" }));
    expect(document.querySelectorAll("#collection-status")).toHaveLength(1);
    await user.click(within(sheet).getByRole("button", { name: /^Show \d+ match/ }));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Filters" })).toBeNull());
    await waitFor(() => expect(filters).toHaveFocus());

    expect(filters).toHaveTextContent("Filters · 1");
    expect(filters).toHaveAccessibleName("Filters, 1 on");
    await user.click(screen.getByRole("button", { name: "Remove filter: Completed" }));
    expect(screen.queryByRole("button", { name: /Remove filter/ })).toBeNull();
    expect(filters.textContent).toBe("Filters");
    // The chip went with the focus on it: the focus is on the button that still says what's on, not on the document.
    expect(filters).toHaveFocus();
  });

  it("closes the sheet as its page goes out of sight, so the page comes back without it", async () => {
    phone();
    history.replaceState(null, "", "/dashboard");
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Your progress" });
    await user.click(within(screen.getByRole("navigation", { name: "Main navigation" })).getByRole("link", { name: /Checklist/ }));
    await user.click(await screen.findByRole("button", { name: "Filters" }));
    await screen.findByRole("dialog", { name: "Filters" });
    // Back, which the sheet doesn't stop, and Forward, whenever React gets round to drawing the hidden page.
    act(() => history.back());
    await screen.findByRole("heading", { name: "Your progress" });
    act(() => history.forward());
    await screen.findByRole("heading", { name: "Completion checklist" });
    expect(screen.queryByRole("dialog", { name: "Filters" })).toBeNull();
  });

  it("closes the sheet when the window widens past a phone's, with the focus on the search field and one of each field", async () => {
    // A stand-in that can change its mind, and tells its listeners when it does.
    let wide = false;
    const listeners = new Set<() => void>();
    vi.spyOn(window, "matchMedia").mockImplementation(
      (query: string) =>
        ({
          get matches() {
            return !wide && /max-width: (550|800)px/.test(query);
          },
          media: query,
          addEventListener: (_: string, listener: () => void) => listeners.add(listener),
          removeEventListener: (_: string, listener: () => void) => listeners.delete(listener),
        }) as unknown as MediaQueryList,
    );
    history.replaceState(null, "", "/checklist");
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: "Completion checklist" });
    await user.click(screen.getByRole("button", { name: "Filters" }));
    await screen.findByRole("dialog", { name: "Filters" });

    wide = true;
    act(() => listeners.forEach((listener) => listener()));
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Filters" })).toBeNull());
    await waitFor(() => expect(screen.getByRole("searchbox")).toHaveFocus());
    expect(document.querySelectorAll("#collection-status")).toHaveLength(1);
    expect(screen.getAllByRole("navigation", { name: "Main navigation" })).toHaveLength(1);
  });
});
