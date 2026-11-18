// The guides and themes the stories run under. Kept apart from guides.ts, which pulls in CSS text a Node-side config can't load.
export const GUIDES = ["koholint", "rdr", "echoes", "lordran", "hallownest"] as const;
export const THEMES = ["light", "dark"] as const;
export type GuideId = (typeof GUIDES)[number];
export type ThemeId = (typeof THEMES)[number];
