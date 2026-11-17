import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { chapters } from "../guide";
import { MissablesStrip } from "./MissablesStrip";
import { allowSlowMounts } from "../test/slow";

allowSlowMounts();

// Nothing flagged, with a sourced reassurance, so every guide exercises that branch too.
vi.mock("virtual:guide/config", async (importOriginal) => {
  const { default: real } = await importOriginal<typeof import("virtual:guide/config")>();
  return {
    default: {
      ...real,
      missables: [],
      reassurance: { text: "Test reassurance.", sources: [["First source", "https://a.example/x"], ["Second source", "https://b.example/y"]] },
    },
  };
});

describe("missables strip with nothing flagged", () => {
  it("says so, and keeps the sources behind the claim out of the page", () => {
    render(
      <MemoryRouter>
        <MissablesStrip chapter={chapters[0]} />
      </MemoryRouter>,
    );
    const region = screen.getByRole("complementary", { name: "Missable entries" });
    expect(within(region).getByText(/Nothing is flagged as permanently missable/)).toBeInTheDocument();
    expect(within(region).getByText(/Test reassurance/)).toBeInTheDocument();
    // (sources are provenance for the data, never shown: no link, nothing to open, not even hidden until found)
    expect(within(region).queryAllByRole("link")).toHaveLength(0);
    expect(within(region).queryAllByRole("button")).toHaveLength(0);
    expect(region.innerHTML).not.toMatch(/First source|a\.example/);
  });
});
