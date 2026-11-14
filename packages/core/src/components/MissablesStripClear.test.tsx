import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { chapters } from "../guide";
import { MissablesStrip } from "./MissablesStrip";

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
  it("says so and links the sources behind the claim, opening safely in a new tab", () => {
    render(
      <MemoryRouter>
        <MissablesStrip chapter={chapters[0]} />
      </MemoryRouter>,
    );
    const region = screen.getByRole("complementary", { name: "Missable entries" });
    expect(within(region).getByText(/Nothing is flagged as permanently missable/)).toBeInTheDocument();
    expect(within(region).getByText(/Test reassurance/)).toBeInTheDocument();
    const links = within(region).getAllByRole("link");
    expect(links).toHaveLength(2);
    for (const link of links) expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
  });
});
