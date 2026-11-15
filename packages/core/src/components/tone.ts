import type { Tone } from "../types";

/** A category's tint: its background and its ink, from the tones in tokens.css. A category with no tone takes the guide's soft primary. */
export const tones: Record<Tone | "none", string> = {
  none: "bg-soft text-soft-ink",
  rose: "bg-rose-bg text-rose-ink",
  violet: "bg-violet-bg text-violet-ink",
  amber: "bg-amber-bg text-amber-ink",
  clay: "bg-clay-bg text-clay-ink",
  sky: "bg-sky-bg text-sky-ink",
  mint: "bg-mint-bg text-mint-ink",
};
