import "@testing-library/jest-dom/vitest";

// Files with `// @vitest-environment node` have no browser to shim, and skipping jsdom there is most of what they cost.
if (typeof window !== "undefined") {
  // jsdom lacks these browser APIs; the app only needs them to exist.
  window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  Element.prototype.scrollIntoView ??= () => {};
  window.scrollTo = () => {};
}
