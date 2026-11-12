/**
 * Entries that can be lost for good. An entry belongs here only when two independent sources say so.
 * Game8 and Console Pulse both state that nothing in Echoes of Wisdom is permanently missable, since every
 * collectible and quest can be revisited after the credits, so the list is empty. See docs/facts-to-verify.md.
 */
export interface Missable {
  id: string;
  /** One line shown in the "Don't miss" strip. */
  why: string;
  sources: string[];
}

export const missables: Missable[] = [];
