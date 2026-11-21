import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "./App";
import { allRows, buildGroups, buildKinds, byId, config, forBuild, hasBuilds, leaningName, leanings } from "./guide";
import { defaultState } from "./progress-state";
import { BUILD_KEY, normalizeBuild, useBuild } from "./store/build";
import { forgetPlaces } from "./store/place";
import { useProgress } from "./store/progress";
import { useUi } from "./store/ui";
import { allowSlowMounts } from "./test/slow";

allowSlowMounts();

beforeEach(() => {
  localStorage.clear();
  forgetPlaces();
  useBuild.setState({ picked: [] });
  useProgress.setState({ data: defaultState(), storageError: false });
  useUi.setState({ toast: null, openGroups: {}, dialog: null, afterClose: null, announcement: "" });
});

const open = async (path: string, heading?: string) => {
  history.replaceState(null, "", path);
  render(<App />);
  return heading ? screen.findByRole("heading", { level: 1, name: heading }) : screen.findByRole("heading", { level: 1 });
};

const openSettings = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.click(screen.getByRole("button", { name: "Import progress" }));
  return screen.findByRole("dialog", { name: "Guide settings" });
};

describe.runIf(!hasBuilds)("a guide without builds", () => {
  it("shows nothing of builds: no Your build in the settings and no Next for your build, even with a pick saved under the key", async () => {
    localStorage.setItem(BUILD_KEY, "dex fth");
    useBuild.setState({ picked: normalizeBuild(localStorage.getItem(BUILD_KEY)) });
    expect(useBuild.getState().picked).toEqual([]);
    const user = userEvent.setup();
    await open("/dashboard", "Your progress");
    expect(screen.queryByRole("heading", { name: "Next for your build" })).toBeNull();
    const dialog = await openSettings(user);
    expect(within(dialog).queryByRole("group", { name: "Your build" })).toBeNull();
    expect(within(dialog).getByText("Choose your theme and how far the guide can reveal.")).toBeInTheDocument();
    expect(allRows.some((row) => forBuild(row.id, ["dex", "fth"]).length > 0)).toBe(false);
  });
});

describe.runIf(hasBuilds)("a guide with builds", () => {
  // (the suite's body runs in every guide, skipped or not, so nothing here reads builds a guide may not have)
  const entry = config.builds?.entries[0] ?? { row: "", serves: [""], kind: "weapon" as const, note: "", sources: [] };
  const row = byId.get(entry.row) ?? allRows[0];
  const leaning = entry.serves[0];
  const reveal = () => useProgress.setState({ data: { ...defaultState(), ceiling: row.chapter, chapter: row.chapter } });

  it("keeps the pick under its key in the guide's order, drops what it doesn't name, and keeps a leaning a later build added", () => {
    const ids = leanings.map((item) => item.id);
    act(() => useBuild.getState().setPicked([...ids].reverse()));
    expect(localStorage.getItem(BUILD_KEY)).toBe(ids.join(" "));
    expect(normalizeBuild(`${ids[0]} not-a-leaning`)).toEqual([ids[0]]);
    // A tab on an older build saving its settings doesn't erase a leaning only a newer build names.
    localStorage.setItem(BUILD_KEY, `${ids[0]} added-later`);
    act(() => useBuild.getState().setPicked([ids[1]]));
    expect(localStorage.getItem(BUILD_KEY)).toBe(`${ids[1]} added-later`);
    expect(useBuild.getState().picked).toEqual([ids[1]]);
    localStorage.removeItem(BUILD_KEY);
    act(() => useBuild.getState().setPicked([]));
    expect(localStorage.getItem(BUILD_KEY)).toBeNull();
  });

  it("tags a row that serves the pick with the leaning and shows its note under it, and nothing without a pick", async () => {
    reveal();
    await open(`/guide/${row.chapter}`);
    const step = document.getElementById(`entry-${row.id}`)!;
    expect(within(step).queryByText(entry.note)).toBeNull();
    act(() => useBuild.getState().setPicked([leaning]));
    expect(await within(step).findByText(entry.note)).toBeInTheDocument();
    // The tag reads "For your build: Dexterity" to a screen reader, the first words hidden from sight.
    expect(within(step).getByText(leaningName(leaning))).toHaveTextContent(`For your build: ${leaningName(leaning)}`);
    // Another leaning that no entry of this row serves leaves it bare.
    const other = leanings.find((item) => forBuild(row.id, [item.id]).length === 0);
    if (other) {
      act(() => useBuild.getState().setPicked([other.id]));
      await waitFor(() => expect(within(step).queryByText(entry.note)).toBeNull());
    }
  });

  it("lists what serves the pick on the Progress page under its kind, and Change build opens Guide settings on the first box", async () => {
    reveal();
    act(() => useBuild.getState().setPicked([leaning]));
    const user = userEvent.setup();
    await open("/dashboard", "Your progress");
    const panel = screen.getByRole("region", { name: "Next for your build" });
    const heading = buildKinds.find(([kind]) => kind === entry.kind)![1];
    const group = within(panel).getByRole("region", { name: heading });
    expect(within(group).getByText(row.title)).toBeInTheDocument();
    expect(within(group).getByText(new RegExp(entry.note.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))).toBeInTheDocument();
    await user.click(within(panel).getByRole("button", { name: "Change build" }));
    const dialog = await screen.findByRole("dialog", { name: "Guide settings" });
    const yours = within(dialog).getByRole("group", { name: "Your build" });
    await waitFor(() => expect(within(yours).getByRole("checkbox", { name: leanings[0].label })).toHaveFocus());
  });

  it("holds the list still when a row is ticked in it, a kind's only row included, until Show next ones", async () => {
    // An entry that is its kind's only row for its leaning in the chapters up to its own: ticking it would empty that section.
    const lone = (config.builds?.entries ?? []).find((item) => {
      const at = byId.get(item.row)!.chapter;
      const group = buildGroups({}, (n) => n <= at, [item.serves[0]]).find((candidate) => candidate.kind === item.kind);
      return group?.rows.length === 1 && group.rows[0].id === item.row;
    });
    expect(lone, "a guide with builds has an entry alone in its kind somewhere").toBeDefined();
    const step = byId.get(lone!.row)!;
    useProgress.setState({ data: { ...defaultState(), ceiling: step.chapter, chapter: step.chapter } });
    act(() => useBuild.getState().setPicked([lone!.serves[0]]));
    const user = userEvent.setup();
    await open("/dashboard", "Your progress");
    const panel = screen.getByRole("region", { name: "Next for your build" });
    const heading = buildKinds.find(([kind]) => kind === lone!.kind)![1];
    const group = within(panel).getByRole("region", { name: heading });
    const box = within(group).getByRole("checkbox", { name: new RegExp(step.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")) });
    await user.click(box);
    expect(useProgress.getState().data.checks[step.id]).toBe(true);
    // The section and its box stay, ticked and focused, and the panel offers to move on.
    expect(within(panel).getByRole("region", { name: heading })).toContainElement(box);
    expect(box).toBeChecked();
    expect(box).toHaveFocus();
    await user.click(within(panel).getByRole("button", { name: "Show next ones" }));
    expect(within(panel).queryByRole("region", { name: heading })).toBeNull();
  });

  it("says how to make a pick while there is none, and saves Your build with Save settings", async () => {
    const user = userEvent.setup();
    await open("/dashboard", "Your progress");
    const panel = screen.getByRole("region", { name: "Next for your build" });
    expect(within(panel).getByText(/^Choose what you level in Guide settings/)).toBeInTheDocument();
    await user.click(within(panel).getByRole("button", { name: "Choose your build" }));
    const dialog = await screen.findByRole("dialog", { name: "Guide settings" });
    await user.click(within(dialog).getByRole("checkbox", { name: leaningName(leaning) }));
    // Nothing is kept until the settings are saved.
    expect(localStorage.getItem(BUILD_KEY)).toBeNull();
    await user.click(within(dialog).getByRole("button", { name: "Save settings" }));
    expect(localStorage.getItem(BUILD_KEY)).toBe(leaning);
    expect(useBuild.getState().picked).toEqual([leaning]);
  });
});
