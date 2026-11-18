import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router";
import { App } from "./App";
import { CHAPTER_COUNT, config } from "./guide";
import { defaultState } from "./progress-state";
import { lines } from "./questlines";
import { QuestlinesPage } from "./pages/QuestlinesPage";
import { forgetPlaces } from "./store/place";
import { useProgress } from "./store/progress";
import { useUi } from "./store/ui";
import { allowSlowMounts } from "./test/slow";

allowSlowMounts();

beforeEach(() => {
  forgetPlaces();
  localStorage.clear();
  useUi.setState({ toast: null, openGroups: {}, dialog: null, afterClose: null, announcement: "" });
});

afterEach(() => {
  vi.restoreAllMocks();
});

// On the guide's own lines (core's tests run once in each guide), where questlines.test.tsx makes up three: at every chapter spoiler
// protection can stop at, On this page names exactly the lines whose cards the page shows, in their order, and those are the lines whose
// first step is in a revealed chapter. Worked out here from the lines' first rows, not from viewLine, which draws the cards. With one line
// met, or none, there is no list: it would only name the card beside it.
describe("the Questlines page's On this page, on the guide's own lines", () => {
  for (let ceiling = 1; ceiling <= CHAPTER_COUNT; ceiling++) {
    it(`names only the lines met by chapter ${ceiling}, as the cards do`, async () => {
      const met = lines.filter((line) => line.rows[0].chapter <= ceiling);
      useProgress.setState({ data: { ...defaultState(), spoilers: true, ceiling }, storageError: false });
      render(
        <MemoryRouter initialEntries={["/questlines"]}>
          <Routes>
            <Route path="/questlines/:line?" element={<QuestlinesPage />} />
          </Routes>
        </MemoryRouter>,
      );
      const cards = [...document.querySelectorAll("section[id^='line-']")].map((card) => card.id.replace(/^line-/, ""));
      expect(cards).toEqual(met.map((line) => line.id));
      if (met.length < 2) {
        expect(screen.queryByRole("navigation", { name: "On this page" })).toBeNull();
        expect(screen.queryByRole("button", { name: "On this page" })).toBeNull();
        return;
      }
      // Both lists: the one beside the cards, and the one folded above them, opened by its toggle (CSS shows one of the two by width).
      await userEvent.click(screen.getByRole("button", { name: "On this page" }));
      const lists = screen.getAllByRole("navigation", { name: "On this page" });
      expect(lists).toHaveLength(2);
      for (const list of lists) {
        const links = within(list).getAllByRole("link");
        expect(links.map((link) => link.textContent)).toEqual(met.map((line) => line.name));
        expect(links.map((link) => link.getAttribute("href"))).toEqual(met.map((line) => `/questlines/${line.id}`));
      }
    });
  }
});

// In the whole app, as the Progress page's parts are (dashboard.test.tsx): Layout leaves a line's address to the page, except on Back.
const twoLines = lines.length > 1 ? describe : describe.skip;
twoLines("a line's link in the app", () => {
  const open = async (path: string) => {
    useProgress.setState({ data: { ...defaultState(), spoilers: false }, storageError: false });
    history.replaceState(null, "", path);
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: config.questlines.title });
  };
  const card = (at: number) => document.getElementById(`line-${lines[at].id}`)!;
  const toggle = (at: number) => card(at).querySelector<HTMLElement>(":scope > button")!;

  it("lands the line's card with the button holding its name focused", async () => {
    const scrolled = vi.spyOn(Element.prototype, "scrollIntoView");
    await open("/questlines");
    const [list] = screen.getAllByRole("navigation", { name: "On this page" });
    await userEvent.click(within(list).getByRole("link", { name: lines[1].name }));
    await waitFor(() => expect(toggle(1)).toHaveFocus());
    expect(scrolled.mock.contexts.at(-1)).toBe(card(1));
    expect(window.location.pathname).toBe(`/questlines/${lines[1].id}`);
  });

  it("comes Back to a line's address where it was left, with the focus in the page, not on the line screens away", async () => {
    // jsdom doesn't scroll: the window's offset is set by hand, and a scroll event tells Layout, as the browser would.
    const scrollWindowTo = (y: number) => {
      Object.defineProperty(window, "scrollY", { value: y, configurable: true });
      act(() => void document.dispatchEvent(new Event("scroll")));
    };
    try {
      const scrolled = vi.spyOn(window, "scrollTo");
      await open("/questlines");
      const [list] = screen.getAllByRole("navigation", { name: "On this page" });
      await userEvent.click(within(list).getByRole("link", { name: lines[1].name }));
      await waitFor(() => expect(toggle(1)).toHaveFocus());
      // Down the page, and away by a step's link to its chapter.
      scrollWindowTo(900);
      await userEvent.click(within(card(1)).getAllByRole("link", { name: /^Ch \d/ })[0]);
      await waitFor(() => expect(window.location.pathname).toMatch(/^\/guide\//));
      act(() => history.back());
      await screen.findByRole("heading", { level: 1, name: config.questlines.title });
      await waitFor(() => expect(scrolled).toHaveBeenLastCalledWith(0, 900));
      expect(screen.getByRole("main")).toHaveFocus();
    } finally {
      Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
    }
  });
});
