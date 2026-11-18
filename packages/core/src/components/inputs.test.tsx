import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { CodeField } from "./controls";
import { SearchField } from "./SearchField";
import { TextField } from "./TextField";
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

describe("text fields on a touch screen", () => {
  // iOS zooms the page when a field under 16px takes the focus. app.css sizes every field 16px on touch, in the `components` layer, which a
  // text size on the field itself (a utility, so a later layer) beats whatever its specificity: a field that sets its own size under 16px
  // has to carry a `pointer-coarse:text-16` of its own. jsdom has no layout to measure, so this reads the classes the fields really render
  // with, and only for the fields rendered below: a field added to one of the files the last test lists has to be rendered here too.
  // (Base UI's hidden input beside the code's boxes is aria-hidden and takes no focus.)
  const TEXT_ENTRY =
    "input:not([type=checkbox], [type=radio], [type=file], [type=hidden], [type=range], [type=button], [type=submit], [aria-hidden=true]), textarea:not([aria-hidden=true])";

  /** A class that sets a font size: the variants before it, whether it is `!important`, and its size in px (0 when the class names one that can't be read). */
  const sizeClass = (token: string) => {
    // The variants end at the last colon outside brackets (`text-[length:14px]` has one inside).
    let depth = 0;
    let cut = -1;
    for (const [at, char] of [...token].entries()) {
      if (char === "[" || char === "(") depth++;
      else if (char === "]" || char === ")") depth--;
      else if (char === ":" && depth === 0) cut = at;
    }
    const variants = token.slice(0, cut + 1);
    const important = /^!|!$/.test(token.slice(cut + 1));
    const utility = token.slice(cut + 1).replace(/^!|!$/g, "");
    const step = /^text-(\d+(?:\.\d+)?)(?:\/.+)?$/.exec(utility);
    if (step) return { variants, important, px: Number(step[1]) };
    const arbitrary = /^text-\[(?:length:)?(\d*\.?\d+)(px|rem|em)\](?:\/.+)?$/.exec(utility);
    if (arbitrary) return { variants, important, px: Number(arbitrary[1]) * (arbitrary[2] === "px" ? 1 : 16) };
    if (/^text-\(length:[^)]+\)(?:\/.+)?$/.test(utility) || /^text-\[length:[^\]]+\](?:\/.+)?$/.test(utility)) return { variants, important, px: 0 };
    return null;
  };

  /**
   * Whether a field would be under 16px on a touch screen: any size under 16 that the touch size doesn't beat. Only a plain size is beaten
   * by `pointer-coarse:text-16` (the variant sorts after it); one behind another variant (`phone:text-13`, which sorts after the touch
   * one) or marked `!` isn't, and nor is a touch size that is itself under 16.
   */
  const zoomsOnFocus = (field: Element) => {
    const sizes = field.className.split(/\s+/).map(sizeClass).filter((size) => size !== null);
    const touch = sizes.some((size) => size.variants === "pointer-coarse:" && !size.important && size.px >= 16);
    return sizes.some((size) => size.px < 16 && !(size.variants === "" && !size.important && touch));
  };

  const rendered = () => {
    const { container } = render(
      <>
        <TextField id="a" label="Full" value="" onChange={() => {}} />
        <TextField id="b" label="Short" width="short" value="" onChange={() => {}} />
        <SearchField id="c" label="Search" value="" onChange={() => {}} />
        <Code />
      </>,
    );
    return [...container.querySelectorAll(TEXT_ENTRY)];
  };

  it("holds every text field core renders to 16px, or leaves its size to app.css", () => {
    const fields = rendered();
    // TextField's two widths, the search box and the code's six boxes.
    expect(fields).toHaveLength(9);
    expect(fields.filter(zoomsOnFocus).map((field) => field.id || field.getAttribute("aria-label"))).toEqual([]);
  });

  it("knows a field that would zoom", () => {
    const zooms = (classes: string) => {
      const field = document.createElement("input");
      field.className = classes;
      return zoomsOnFocus(field);
    };
    // Its own size under 16px, with no touch size, or one under 16.
    expect(zooms("px-2 text-14/sm font-bold")).toBe(true);
    expect(zooms("text-[15px] pointer-coarse:text-14")).toBe(true);
    expect(zooms("text-[0.875rem]/5")).toBe(true);
    expect(zooms("text-[length:14px]")).toBe(true);
    expect(zooms("text-(length:--size)")).toBe(true);
    // A touch size that a later one beats: a size behind another variant, or an important one.
    expect(zooms("text-14/sm pointer-coarse:text-16/normal phone:text-13")).toBe(true);
    expect(zooms("text-14! pointer-coarse:text-16/normal")).toBe(true);
    expect(zooms("!text-14 pointer-coarse:text-16/normal")).toBe(true);
    expect(zooms("text-14/sm pointer-coarse:text-16/normal")).toBe(false);
    expect(zooms("text-14/sm pointer-coarse:text-16 pointer-coarse:leading-normal")).toBe(false);
    expect(zooms("text-14/sm pointer-coarse:text-18/lg")).toBe(false);
    expect(zooms("text-18/lg font-bold")).toBe(false);
    expect(zooms("text-[1rem] tiny:text-[1.125rem]")).toBe(false);
    expect(zooms("border-0 p-0.5 text-muted placeholder:text-muted")).toBe(false);
  });

  it("is told of a new file that draws a field, so it renders it above", () => {
    const sources = import.meta.glob("../**/*.tsx", { query: "?raw", import: "default", eager: true });
    // A text input, a textarea, or any of Base UI's: its parts (`Field.Control`, `OTPField.Input`) or a field imported under another name.
    const drawsAField = /<(?:input|textarea)\b|<\w*Input\b|\.(?:Input|Control)\b|@base-ui\/react\/(?:input|field|otp-field|number-field|combobox|autocomplete)\b/;
    const files = Object.entries(sources)
      .filter(([file, source]) => !/\.(?:test|stories)\.tsx$/.test(file) && drawsAField.test(source as string))
      .map(([file]) => file.replace(/^.*\//, ""))
      .sort();
    expect(files).toEqual(["SearchField.tsx", "TextField.tsx", "controls.tsx"]);
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
