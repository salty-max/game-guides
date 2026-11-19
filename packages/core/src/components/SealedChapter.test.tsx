import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it, vi } from "vitest";
import { chapters } from "../guide";
import { SealedChapter } from "./SealedChapter";

const sealed = (chapter: number, ceiling: number, onReveal = vi.fn()) =>
  render(
    <MemoryRouter>
      <SealedChapter chapter={chapter} ceiling={ceiling} onReveal={onReveal} />
    </MemoryRouter>,
  );

describe("a hidden chapter", () => {
  it("says which chapters revealing it also reveals, and nothing more when it is the next one", () => {
    const { unmount } = sealed(4, 1);
    expect(screen.getByText("Hidden to spare you spoilers until you reach it. Revealing it now also reveals chapters 2 to 3.")).toBeInTheDocument();
    unmount();
    sealed(3, 1);
    expect(screen.getByText("Hidden to spare you spoilers until you reach it. Revealing it now also reveals chapter 2.")).toBeInTheDocument();
  });

  it("names the chapter in its heading and its buttons, never by its title", () => {
    const onReveal = vi.fn();
    sealed(2, 1, onReveal);
    expect(screen.getByRole("heading", { level: 1, name: "Chapter 2: Not revealed yet" })).toBeInTheDocument();
    expect(screen.getByText(/^Hidden to spare you spoilers until you reach it\.\s*$/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to chapter 1" })).toHaveAttribute("href", "/guide/1");
    // (a teaser may be the title itself, as Echoes' "Gerudo Desert" is: the rail shows it to everyone anyway)
    expect(document.body.textContent.replace(chapters[1].teaser ?? "", "")).not.toContain(chapters[1].title);
    screen.getByRole("button", { name: "Reveal chapter 2" }).click();
    expect(onReveal).toHaveBeenCalledOnce();
  });
});
