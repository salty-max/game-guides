import "@testing-library/jest-dom/vitest";

// Files with `// @vitest-environment node` have no browser to shim, and skipping jsdom there is most of what they cost.
if (typeof window !== "undefined") {
  // jsdom lacks these browser APIs; the app only needs them to exist.
  window.matchMedia ??= ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
  Element.prototype.scrollIntoView ??= () => {};
  window.scrollTo = () => {};

  // The dialog and the select load on use (components/chunks.ts). Load them before any test renders, so that a test sees the real
  // components, not the stand-ins shown while they load. A test of the loading itself brings its own (loading.test.tsx). This waits for
  // beforeAll, not the top of the setup file: the dialog's chunk reads the guide, and a test file that mocks a module of the guide
  // (virtual:guide/config) has to have its mock in place first.
  beforeAll(async () => {
    const { chunks } = await import("../components/chunks");
    await Promise.all(Object.values(chunks).map((chunk) => chunk.load()));
  });
}
