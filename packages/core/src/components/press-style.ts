// What a control does under a finger or a pressed mouse button: it takes a tint of the guide's ink (--press, tokens.css) at once, and lets go of
// it over 150ms when released. A phone has no hover, and the tap flash is off, so without this a tap shows nothing until its result renders.
// iOS applies the pressed state on touch only because main.tsx listens for touchstart. A disabled control shows nothing.

/**
 * A control with a box (a button, a chip, a card, a menu's item): the tint is laid over its fill, inside its edge and corners, under its content.
 * It is an inner shadow, clear at rest, so the two states blend on release and a drop shadow the control may have stays.
 */
export const press =
  "inset-shadow-[0_0_0_100vmax_transparent] transition-shadow duration-150 ease-out active:duration-0 not-disabled:not-aria-disabled:active:inset-shadow-[0_0_0_100vmax_var(--press)]";

/** Words with no box (a text link, a link-look button): they fade while pressed. */
export const pressText = "transition-opacity duration-150 ease-out active:duration-0 not-disabled:not-aria-disabled:active:opacity-60";

/** A row whose label stretches over it (its pseudo-element covers the row): the whole row takes the tint, as a list cell does. The box and the row's links sit above it and press on their own. */
export const pressRow = "after:transition-colors after:duration-150 after:ease-out active:after:duration-0 active:after:bg-press";
