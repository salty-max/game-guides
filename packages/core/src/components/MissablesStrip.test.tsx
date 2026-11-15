import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import { chapters } from "../guide";
import { defaultState } from "../progress-state";
import { useProgress } from "../store/progress";
import { MissablesStrip } from "./MissablesStrip";
import { allowSlowMounts } from "../test/slow";

allowSlowMounts();

// Flag the guide's first row, whatever the guide, so every guide exercises the list.
vi.mock("virtual:guide/config", async (importOriginal) => {
  const { default: real } = await importOriginal<typeof import("virtual:guide/config")>();
  const id = real.chapters[0].groups[0].rows[0][0];
  return { default: { ...real, missables: [{ id, why: "Test condition for losing it.", sources: ["https://a.example/x", "https://b.example/y"] }] } };
});

const flagged = chapters[0].groups[0].rows[0];
const strip = () =>
  render(
    <MemoryRouter>
      <MissablesStrip chapter={chapters[0]} />
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
  useProgress.setState({ data: defaultState(), storageError: false });
});

describe("missables strip with a flagged entry", () => {
  it("lists it with its condition, and holds it in place once ticked", async () => {
    const user = userEvent.setup();
    strip();
    const region = screen.getByRole("complementary", { name: "Missable entries" });
    expect(within(region).getByText("Test condition for losing it.")).toBeInTheDocument();
    expect(within(region).getByText("1 left")).toBeInTheDocument();
    await user.click(within(region).getByRole("checkbox", { name: (name) => name.includes(flagged.title) }));
    expect(useProgress.getState().data.checks[flagged.id]).toBe(true);
    expect(within(region).getByRole("checkbox", { name: (name) => name.includes(flagged.title) })).toBeChecked();
    expect(within(region).getByText("0 left")).toBeInTheDocument();
  });

  it("renders nothing once every flagged entry in the chapter is checked", () => {
    useProgress.setState({ data: { ...defaultState(), checks: { [flagged.id]: true } } });
    const { container } = strip();
    expect(container).toBeEmptyDOMElement();
  });
});
