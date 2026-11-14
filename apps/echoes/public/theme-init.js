// Runs before first paint so the page never flashes the wrong theme. Kept external so the CSP can forbid inline scripts.
// The storage prefix comes from the guide-storage meta tag, which the build fills in from the guide's brand.
(() => {
  const prefix = document.querySelector('meta[name="guide-storage"]')?.content;
  let preference;
  try { preference = localStorage.getItem(`${prefix}.theme`); } catch {}
  const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  document.documentElement.dataset.theme = ["light", "dark"].includes(preference) ? preference : system;
})();
