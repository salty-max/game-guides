import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select } from "./controls";
import { allowSlowMounts } from "../test/slow";

allowSlowMounts();

const chapters: [number, string][] = [
  [1, "Chapter 1"],
  [2, "Chapter 2"],
  [3, "Chapter 3"],
];

describe("Select", () => {
  it("is named by its label, shows the chosen choice's label, and reports the key as a string", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Select id="chapter" label="Chapter" choices={chapters} value={1} onChange={onChange} />);
    const trigger = screen.getByRole("combobox", { name: "Chapter" });
    expect(trigger).toHaveTextContent("Chapter 1");
    expect(trigger).toHaveAttribute("id", "chapter");
    await user.click(trigger);
    await user.click(await screen.findByRole("option", { name: "Chapter 2" }));
    expect(onChange).toHaveBeenCalledExactlyOnceWith("2");
  });

  it("keeps a bare label for screen readers", () => {
    render(<Select id="status" label="Route completion status" choices={chapters} value={1} onChange={() => {}} bare />);
    expect(screen.getByLabelText("Route completion status")).toBe(screen.getByRole("combobox"));
    expect(screen.getByText("Route completion status")).toHaveClass("sr-only");
  });

  it("does not open when disabled", async () => {
    const user = userEvent.setup();
    render(<Select id="status" label="Status" choices={chapters} value={1} onChange={() => {}} disabled />);
    expect(screen.getByRole("combobox")).toBeDisabled();
    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).toBeNull();
  });
});
