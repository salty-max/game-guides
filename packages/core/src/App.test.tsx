import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { STORAGE_KEY, defaultState } from "./progress-state";
import { brand, chapters, config } from "./guide";
import { panels } from "virtual:guide/panels";
import { useProgress } from "./store/progress";
import { useUi } from "./store/ui";
import { allowSlowMounts } from "./test/slow";

allowSlowMounts();

const first = chapters[0];
const firstRow = first.groups[0].rows[0];
const saved = () => JSON.parse(localStorage.getItem(STORAGE_KEY)!).checks;
const contains = (id: string) => document.getElementById(id)!.contains(document.activeElement);

beforeEach(() => {
  localStorage.clear();
  useProgress.setState({ data: defaultState(), storageError: false });
  useUi.setState({ toast: null, openGroups: {} });
  history.replaceState(null, "", "/guide/1");
});

describe("App", () => {
  it("opens at chapter 1 and saves a ticked step", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(await screen.findByRole("heading", { level: 1, name: first.title })).toBeInTheDocument();
    const box = within(document.getElementById(`entry-${firstRow.id}`)!).getByRole("checkbox");
    await user.click(box);
    expect(box).toBeChecked();
    expect(saved()).toEqual({ [firstRow.id]: true });
  });

  it("names the guide <mark> Hundo and puts the copyright under the rail", async () => {
    render(<App />);
    expect(brand.name).toBe(`${brand.mark} Hundo`);
    expect(brand.title.startsWith(`${brand.name} · `)).toBe(true);
    expect(await screen.findByRole("link", { name: `${brand.name} home` })).toHaveTextContent(`${brand.mark}Hundo`);
    const rail = screen.getByRole("complementary", { name: "Chapters" });
    expect(within(rail).getByText("© 2026 Hundo")).toBeInTheDocument();
    expect(within(rail).getByText(`Unofficial fan guide, not affiliated with ${brand.publisher}.`)).toBeInTheDocument();
  });

  it("hides later chapters until revealed, then opens at the linked section", async () => {
    const user = userEvent.setup();
    history.replaceState(null, "", "/guide/3/section-3-1");
    render(<App />);
    expect(await screen.findByRole("heading", { level: 1, name: "Chapter 3 is hidden" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Reveal chapter" }));
    await user.click(screen.getByRole("button", { name: "Reveal and open" }));
    expect(await screen.findByRole("heading", { level: 1, name: chapters[2].title })).toBeInTheDocument();
    expect(useProgress.getState().data.ceiling).toBe(3);
    expect(contains("section-3-1")).toBe(true);
  });

  it("keeps a ticked Next up step in place, undoes it, and advances on request", async () => {
    const user = userEvent.setup();
    render(<App />);
    const list = () => within(screen.getByRole("region", { name: "Next up" }));
    expect(list().getAllByRole("link", { name: /^Jump to/ })).toHaveLength(3);
    const idsBefore = list().getAllByRole("checkbox").map((box) => box.id);
    await user.click(list().getAllByRole("checkbox")[0]);
    expect(list().getAllByRole("checkbox").map((box) => box.id)).toEqual(idsBefore);
    expect(list().getAllByRole("checkbox")[0]).toBeChecked();

    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(list().getAllByRole("checkbox")[0]).not.toBeChecked();
    expect(saved()).toEqual({});

    await user.click(list().getAllByRole("checkbox")[0]);
    await user.click(list().getByRole("button", { name: "Show next steps" }));
    expect(list().getAllByRole("checkbox").map((box) => box.id)).not.toContain(idsBefore[0]);
    expect(list().queryByRole("button", { name: "Show next steps" })).toBeNull();
  });

  it("checks a whole section at once and undoes it from the toast", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click((await screen.findAllByRole("button", { name: /^Check all \(/ }))[0]);
    expect(Object.keys(saved()).length).toBeGreaterThan(1);
    await user.click(screen.getByRole("button", { name: "Undo" }));
    expect(saved()).toEqual({});
  });

  it("shares checks with the checklist and links back to the entry in context", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(within(document.getElementById(`entry-${firstRow.id}`)!).getByRole("checkbox"));
    await user.click(screen.getByRole("link", { name: "Chapter checklist" }));
    await user.type(await screen.findByRole("searchbox"), firstRow.title);
    const box = screen.getByRole("checkbox", { name: firstRow.title });
    expect(box).toBeChecked();
    await user.click(box);
    await user.click(screen.getByRole("link", { name: `Open “${firstRow.title}” in chapter 1` }));
    expect(contains(`entry-${firstRow.id}`)).toBe(true);
    expect(within(document.getElementById(`entry-${firstRow.id}`)!).getByRole("checkbox")).not.toBeChecked();
  });

  it("shows progress, what's left and the guide's own panels", async () => {
    history.replaceState(null, "", "/dashboard");
    render(<App />);
    expect(await screen.findByRole("heading", { level: 1, name: "Your progress" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "What’s left" })).toBeInTheDocument();
    for (const panel of panels) expect(document.getElementById(panel.id)).toBeInTheDocument();
  });

  it("lists sources with names", async () => {
    history.replaceState(null, "", "/sources");
    render(<App />);
    expect(await screen.findByRole("heading", { level: 1, name: "Sources and maps" })).toBeInTheDocument();
    const links = screen.getAllByRole("link").filter((link) => link.getAttribute("href")?.startsWith("https://"));
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) expect(link).toHaveAccessibleName();
  });
});

describe.runIf(config.layout === "article")("article layout", () => {
  it("reads as sections with inline checks and jumps to the first section", async () => {
    const user = userEvent.setup();
    render(<App />);
    const article = await screen.findByRole("article", { name: `${first.title} walkthrough` });
    expect(within(article).getByRole("heading", { level: 2, name: first.groups[0].title })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Expand all" })).toBeNull();
    await user.click(screen.getByRole("link", { name: "Read walkthrough" }));
    expect(screen.getByRole("heading", { level: 2, name: first.groups[0].title })).toHaveFocus();
  });
});

describe.runIf(config.layout === "checklist")("checklist layout", () => {
  it("filters the route and resumes at the first unchecked step", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { level: 1, name: first.title });
    expect(screen.getByRole("button", { name: /Expand all|Collapse all/ })).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText("Route completion status"), "done");
    expect(screen.getByText("No steps match these filters.")).toBeInTheDocument();
    await user.click(screen.getByRole("link", { name: "Start walkthrough" }));
    expect(contains(`entry-${firstRow.id}`)).toBe(true);
  });
});
