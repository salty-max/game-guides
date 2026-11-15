import "@testing-library/jest-dom/vitest";

// Files with `// @vitest-environment node` have no browser to shim, and skipping jsdom there is most of what they cost.
if (typeof window !== "undefined") {
  // jsdom lacks these browser APIs; the app only needs them to exist.
  window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
  Element.prototype.scrollIntoView ??= () => {};
  window.scrollTo = () => {};
}
