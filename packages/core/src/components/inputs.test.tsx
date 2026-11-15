import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { CodeField, TextField } from "./controls";
import { ItemList, ItemRow } from "./list";
import { Button } from "./ui";
import { allowSlowMounts } from "../test/slow";

allowSlowMounts();

/** Holds the value, as a screen does. */
function Code({ onComplete, ...rest }: { onComplete?: (value: string) => void; invalid?: boolean; disabled?: boolean; description?: string; alphanumeric?: boolean }) {
  const [value, setValue] = useState("");
  return <CodeField id="code" label="Pairing code" value={value} onChange={setValue} onComplete={onComplete} {...rest} />;
}

describe("CodeField", () => {
  it("names the first box by the label and the others by their place, and describes the group", () => {
    render(<Code description="Six digits, shown on the other device." />);
    const boxes = screen.getAllByRole("textbox");
    expect(boxes).toHaveLength(6);
    expect(screen.getByRole("textbox", { name: "Pairing code" })).toBe(boxes[0]);
    expect(boxes[1]).toHaveAccessibleName("Character 2 of 6");
    expect(boxes[5]).toHaveAccessibleName("Character 6 of 6");
    // Tab lands on one box only (the next free one), so every box carries the description, not just the first.
    for (const box of boxes) expect(box).toHaveAccessibleDescription("Six digits, shown on the other device.");
  });

  it("doesn't call a disabled box invalid", () => {
    render(<Code invalid disabled />);
    for (const box of screen.getAllByRole("textbox")) expect(box).toBeValid();
  });

  it("moves on by itself while typing, takes digits only, and completes once on the sixth", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Code onComplete={onComplete} />);
    await user.click(screen.getAllByRole("textbox")[0]);
    await user.keyboard("12a34");
    expect(screen.getAllByRole("textbox").map((box) => (box as HTMLInputElement).value)).toEqual(["1", "2", "3", "4", "", ""]);
    expect(onComplete).not.toHaveBeenCalled();
    await user.keyboard("56");
    expect(onComplete).toHaveBeenCalledExactlyOnceWith("123456");
  });

  it("fills every box from a pasted code", async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    render(<Code onComplete={onComplete} />);
    await user.click(screen.getAllByRole("textbox")[0]);
    await user.paste("654321");
    expect(screen.getAllByRole("textbox").map((box) => (box as HTMLInputElement).value).join("")).toBe("654321");
    expect(onComplete).toHaveBeenCalledExactlyOnceWith("654321");
  });

  it("goes back a box on Backspace", async () => {
    const user = userEvent.setup();
    render(<Code />);
    const boxes = screen.getAllByRole("textbox");
    await user.click(boxes[0]);
    await user.keyboard("12");
    await user.keyboard("{Backspace}");
    expect((boxes[1] as HTMLInputElement).value).toBe("");
    expect(boxes[1]).toHaveFocus();
  });

  it("marks every box invalid", () => {
    render(<Code invalid />);
    for (const box of screen.getAllByRole("textbox")) expect(box).toBeInvalid();
  });

  it("takes letters too when it is an alphanumeric code", async () => {
    const user = userEvent.setup();
    render(<Code alphanumeric />);
    await user.click(screen.getAllByRole("textbox")[0]);
    await user.keyboard("a7C");
    expect(screen.getAllByRole("textbox").map((box) => (box as HTMLInputElement).value).join("")).toBe("a7C");
  });
});

function Text(props: Partial<Parameters<typeof TextField>[0]>) {
  const [value, setValue] = useState("");
  return <TextField id="reported" label="In-game completion (%)" value={value} onChange={setValue} {...props} />;
}

describe("TextField", () => {
  it("is named by its label and takes what is typed", async () => {
    const user = userEvent.setup();
    render(<Text />);
    await user.type(screen.getByRole("textbox", { name: "In-game completion (%)" }), "42.5");
    expect(screen.getByRole("textbox")).toHaveValue("42.5");
  });

  it("reads its description and its error with the field, and is invalid only with an error", () => {
    const { rerender } = render(<Text description="From Stats, then General." />);
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription("From Stats, then General.");
    expect(screen.getByRole("textbox")).toBeValid();
    rerender(<Text description="From Stats, then General." error="Enter a number from 0 to 100." />);
    expect(screen.getByRole("textbox")).toBeInvalid();
    expect(screen.getByRole("textbox")).toHaveAccessibleDescription(/Enter a number from 0 to 100\./);
  });

  it("isn't invalid with an empty error", () => {
    render(<Text error="" />);
    expect(screen.getByRole("textbox")).toBeValid();
  });

  it("passes the keyboard and input hints on", () => {
    render(<Text inputMode="decimal" autoComplete="off" maxLength={5} name="reported" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("inputmode", "decimal");
    expect(screen.getByRole("textbox")).toHaveAttribute("autocomplete", "off");
    expect(screen.getByRole("textbox")).toHaveAttribute("maxlength", "5");
    expect(screen.getByRole("textbox")).toHaveAttribute("name", "reported");
  });
});

describe("ItemList", () => {
  it("is a named list of rows, each with its own actions", async () => {
    const user = userEvent.setup();
    const unlink = vi.fn();
    render(
      <ItemList label="Linked devices">
        <ItemRow title="Max's iPhone" detail="Linked 15 Nov">
          <Button size="compact" aria-label="Unlink Max's iPhone" onClick={() => unlink("iphone")}>
            Unlink
          </Button>
        </ItemRow>
        <ItemRow title="Brave on the Mac" />
      </ItemList>,
    );
    const list = screen.getByRole("list", { name: "Linked devices" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(within(list).getByText("Linked 15 Nov")).toBeInTheDocument();
    await user.click(within(list).getByRole("button", { name: "Unlink Max's iPhone" }));
    expect(unlink).toHaveBeenCalledWith("iphone");
  });

  it("says so when every child renders nothing, as with a row that is only sometimes there", () => {
    const other: string | undefined = undefined;
    render(
      <ItemList label="Linked devices" empty="No devices linked yet.">
        {other && <ItemRow title={other} />}
        {[].map(() => null)}
      </ItemList>,
    );
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("No devices linked yet.")).toBeInTheDocument();
  });

  it("says so when there are no rows, instead of an empty list", () => {
    render(<ItemList label="Linked devices" empty="No devices linked yet." />);
    expect(screen.queryByRole("list")).toBeNull();
    expect(screen.getByText("No devices linked yet.")).toBeInTheDocument();
  });
});
