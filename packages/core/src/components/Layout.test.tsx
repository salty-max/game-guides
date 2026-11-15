import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    // The button had the focus when it went: the focus isn't left to fall to the page.
    expect(document.body).not.toHaveFocus();
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
