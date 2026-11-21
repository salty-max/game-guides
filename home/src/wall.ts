// Which guides the page's hero and its link preview's picture (og.ts) show as a wall of chapter 1 banners: the same six in both.

/** How many banners the wall holds: three across and two down on the page, two across and three down on a phone and in the picture. */
export const WALL = 6;

/**
 * The guides on the wall: every one up to six, and past six, six spread evenly across the A-to-Z list, the middle of each sixth of it. The
 * same list always gives the same six; a new guide can move some of them.
 */
export const wallGuides = <T>(guides: T[]): T[] =>
  guides.length <= WALL ? guides : Array.from({ length: WALL }, (_, i) => guides[Math.floor(((i + 0.5) * guides.length) / WALL)]);

/** The wall's six tiles: the guides on it, starting again from the first when there are fewer than six. */
export const wallTiles = <T>(guides: T[]): T[] => {
  const shown = wallGuides(guides);
  return Array.from({ length: WALL }, (_, i) => shown[i % shown.length]);
};
