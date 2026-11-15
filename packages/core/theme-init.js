// Runs before first paint so the page never flashes the wrong theme or the wrong frame. Kept external so the CSP can forbid inline scripts.
// The storage prefix comes from the guide-storage meta tag, which the build fills in from the guide's brand.
(() => {
  const root = document.documentElement;
  const prefix = document.querySelector('meta[name="guide-storage"]')?.content;
  let preference;
  try { preference = localStorage.getItem(`${prefix}.theme`); } catch {}
  const system = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const theme = ["light", "dark"].includes(preference) ? preference : system;
  root.dataset.theme = theme;

  // The browser's bar (and the status area of an installed app) is the topbar's colour. The light colour is in the page; the dark one
  // rides along on the tag, so the right one is there from the first paint (the app keeps it right after that, in useThemeEffects).
  const color = document.querySelector('meta[name="theme-color"]');
  if (theme === "dark" && color?.dataset.dark) color.content = color.dataset.dark;

  // Opened from the home screen or an install button, not in a browser tab: app.css and the components turn the page into an app's frame. Safari on
  // the iPhone says so with navigator.standalone, other browsers with the display-mode media feature.
  if (navigator.standalone === true || matchMedia("(display-mode: standalone)").matches) root.dataset.standalone = "";
})();
