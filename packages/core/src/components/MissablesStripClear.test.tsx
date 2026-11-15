import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
  it("says so and, opened, links the sources behind the claim, opening safely in a new tab", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <MissablesStrip chapter={chapters[0]} />
      </MemoryRouter>,
    );
    const region = screen.getByRole("complementary", { name: "Missable entries" });
    expect(within(region).getByText(/Nothing is flagged as permanently missable/)).toBeInTheDocument();
    expect(within(region).getByText(/Test reassurance/)).toBeInTheDocument();
    // Closed, the sources are in the page but hidden (until found, for find-in-page).
    expect(within(region).queryAllByRole("link")).toHaveLength(0);
    await user.click(within(region).getByRole("button", { name: /Nothing is flagged/ }));
    expect(within(region).getByRole("button", { name: /Nothing is flagged/ })).toHaveAttribute("aria-expanded", "true");
    const links = within(region).getAllByRole("link");
    expect(links).toHaveLength(2);
    for (const link of links) expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
