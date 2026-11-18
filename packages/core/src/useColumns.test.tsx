import { act, render } from "@testing-library/react";
import { useColumns } from "./useColumns";

// jsdom lays nothing out, so each test says what the browser resolved the grid's columns to, and holds the ResizeObserver's callback to
// call it as a browser would. A real grid in a real browser: Stacks.stories.tsx.
let resolved = "";
let observed: (() => void) | undefined;

beforeEach(() => {
  resolved = "";
  vi.spyOn(window, "getComputedStyle").mockImplementation(() => ({ gridTemplateColumns: resolved }) as CSSStyleDeclaration);
  vi.stubGlobal(
    "ResizeObserver",
    class {
      constructor(changed: () => void) {
        observed = changed;
      }
      observe() {}
      disconnect() {
        observed = undefined;
      }
    },
  );
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function Grid() {
  const [columns, ref] = useColumns();
  return <div ref={ref} data-columns={columns ?? "unread"} />;
}
const count = (container: HTMLElement) => container.firstElementChild!.getAttribute("data-columns");

describe("useColumns", () => {
  it("reads the columns the grid laid out as it mounts, counting those auto-fit collapsed", () => {
    resolved = "900px 0px";
    const { container } = render(<Grid />);
    expect(count(container)).toBe("2");
  });

  it("reads them again as the window resizes, and as the grid narrows without a resize", () => {
    resolved = "444px 444px";
    const { container } = render(<Grid />);
    resolved = "600px";
    act(() => void window.dispatchEvent(new Event("resize")));
    expect(count(container)).toBe("1");
    resolved = "360px 360px";
    act(() => observed!());
    expect(count(container)).toBe("2");
  });

  it("keeps the count while the grid is out of the page, and stops listening once the grid is gone", () => {
    resolved = "444px 444px";
    const { container, unmount } = render(<Grid />);
    resolved = "repeat(auto-fit, minmax(min(100%, 352px), 1fr))";
    act(() => void window.dispatchEvent(new Event("resize")));
    expect(count(container)).toBe("2");
    unmount();
    expect(observed).toBeUndefined();
    expect(() => window.dispatchEvent(new Event("resize"))).not.toThrow();
  });

  it("is one where nothing is laid out", () => {
    resolved = "repeat(auto-fit, minmax(min(100%, 352px), 1fr))";
    const { container } = render(<Grid />);
    expect(count(container)).toBe("1");
  });
});
