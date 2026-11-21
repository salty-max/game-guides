// Runs before the first paint, so a reader who picked light or dark on hundo.quest never sees the other one flash first. Kept external so
// the CSP can forbid inline scripts. With no choice kept the page follows the device in CSS alone, and this does nothing. A choice puts
// its scheme on the root and its colour in both theme-color tags, each tag's own colour kept beside it for theme.ts, which makes and
// forgets the choice. The key is theme.ts's THEME_KEY (deploy.test.ts holds the two to one name).
(() => {
  let theme;
  try {
    theme = localStorage.getItem("hundo.theme");
  } catch {}
  if (theme !== "light" && theme !== "dark") return;
  document.documentElement.dataset.theme = theme;
  const tags = [...document.querySelectorAll('meta[name="theme-color"]')];
  const colour = tags.find((tag) => tag.getAttribute("media")?.includes(theme))?.content;
  for (const tag of tags) {
    tag.dataset.colour = tag.content;
    if (colour) tag.content = colour;
  }
})();
