import type { ComponentType } from "react";
import type { IconName } from "./components/Icon";

/**
 * A page the data was written from: provenance for checking it (the tests, docs/chapter-data.md), never shown to readers. Every
 * `sources` and `reference` below is kept for that alone.
 */
export type SourceLink = [label: string, url: string];
/**
 * A page that shows readers where something is, named by its site ("Map on iRedDead"): a map image or an interactive map, opened in a
 * new tab. Kept apart from `sources` and `reference`, which are never shown, so a citation can't come back into view as a map.
 */
export type MapLink = [site: string, url: string];
export type Checks = Record<string, true>;

/** Optional per-row details: an amount that counts toward a category, the page this one row was written from, or its own map. */
export interface RowExtra {
  quantity?: number;
  reference?: string;
  /** Only when it differs from the group's map (data.test.ts refuses a repeat). */
  map?: MapLink;
}

/** [id, tags (the first one is the primary label), title, text, extra] */
export type RawRow = [id: string, tags: string[], title: string, text: string, extra?: RowExtra];

export interface RawGroup {
  title: string;
  location?: string;
  icon?: IconName;
  note?: string;
  sources?: SourceLink[];
  /** One map for every row in the group. */
  map?: MapLink;
  /** A catalogue list: the article layout renders its rows as a compact checklist instead of prose. */
  compact?: boolean;
  rows: RawRow[];
}

export interface RawChapter {
  id: number;
  title: string;
  region: string;
  intro: string;
  /** What the rail shows while the chapter is hidden: a place name, never story. Defaults to "Chapter 03". */
  teaser?: string;
  sources?: SourceLink[];
  groups: RawGroup[];
}

export interface Row {
  id: string;
  title: string;
  text: string;
  chapter: number;
  group: string;
  location?: string;
  /** Every category the entry counts toward; the first is its primary label. */
  tags: string[];
  quantity: number;
  reference?: string;
  map?: MapLink;
}

export interface Group {
  key: string;
  title: string;
  location?: string;
  icon?: IconName;
  note?: string;
  sources: SourceLink[];
  map?: MapLink;
  compact: boolean;
  rows: Row[];
}

export interface Chapter extends Omit<RawChapter, "sources" | "groups"> {
  sources: SourceLink[];
  groups: Group[];
}

export interface Missable {
  /** A row id from the guide data. */
  id: string;
  /** One line for the "Don't miss" strip: the exact condition for losing it. */
  why: string;
  /** At least two independent https sources that agree. */
  sources: string[];
}

/** A chained side quest: one character's arc, or one task in parts, as existing rows. Progress stays per row. */
export interface Questline {
  /** Stable once live: it's the line's address, `/questlines/<id>`. Never shown. */
  id: string;
  /** Only what the line's first step already says: the character as first met (docs/chapter-data.md). */
  name: string;
  /** Row ids in route order (data.test.ts holds them to it), so the steps a reader has revealed are always the line's first ones. A row may be in two lines. */
  steps: string[];
}

/** The Questlines page: its tab and title, and its lines. */
export interface Questlines {
  /** The tab's word in the navigation ("Quests", "Strangers"). */
  tab: string;
  title: string;
  intro: string;
  /** Every row carrying one of these tags is in a line (data.test.ts). */
  cover?: string[];
  lines: Questline[];
}

/**
 * Per-guide state saved beside the shared fields. A guide that keeps some declares its type here through
 * declaration merging: `declare module "@hundo/core/types" { interface Register { extra: MyExtra } }`.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- filled in by a guide through declaration merging
export interface Register {}
export type Extra = Register extends { extra: infer E } ? E : undefined;

export interface ProgressState {
  version: 3;
  guide: string;
  checks: Checks;
  ceiling: number;
  spoilers: boolean;
  chapter: number;
  extra: Extra;
}

/** A chapter banner: the original, and in a build the smaller copies beside it as a `srcset` (banners.ts). */
export interface Banner {
  src: string;
  srcSet?: string;
}

export interface FontFace {
  family: string;
  /** File name in public/fonts. */
  file: string;
  weight: string;
  fallback: string;
}

export interface Brand {
  /** Written into every backup as `guide`, so a backup from another guide is refused. */
  id: string;
  name: string;
  shortName: string;
  /** Document and social title. */
  title: string;
  description: string;
  /** Storage keys are `<prefix>.v1` (progress), `<prefix>.theme`, `<prefix>.sync` (a synced device's ledger), `<prefix>.awake` (Keep screen on) and `<prefix>.place` (the last place read). */
  storagePrefix: string;
  backupFile: string;
  /** The word in the header brand, above "HUNDO". */
  mark: string;
  /** The game's full name. No page shows it on its own: the title and the description name it, for search (data.test.ts holds them to it). */
  game: string;
  /** The game's publisher, named in the rail's fan disclaimer ("not affiliated with …"). */
  publisher: string;
  /** "narrow": soft square corners. "normal": round buttons, chips and tags. */
  corners: "narrow" | "normal";
  /** The guide's own address, such as "https://koholint.hundo.quest": every canonical, the sitemap and the link preview are on it. */
  home: string;
  /** Hostnames the guide used to live on. They hand readers and their progress over to `home`. */
  movedFrom?: string[];
  fonts: { display: FontFace; sans: FontFace };
}

export type Tone = "rose" | "violet" | "amber" | "clay" | "sky" | "mint";
/** [plural name, singular label, icon, colour] */
export type Category = readonly [plural: string, singular: string, icon: IconName, tone?: Tone];

export interface BoardItem {
  tag: string;
  /** A fixed total from the game's own list; otherwise the count of tagged rows. */
  goal?: number;
  /** Shown on the board but left out of "What's left". */
  optional?: boolean;
}

export interface LeftItem {
  tag: string;
  left: number;
  total: number;
}

export interface Completion {
  /** Rows that count toward the overall figure. Default: every row. */
  isCore?: (row: Row) => boolean;
  /**
   * The overall percentage and the words after it ("complete", "estimated in-game completion"). The default
   * percentage is the share of core rows checked. Leave it out for a game with no overall figure: counts show instead.
   */
  overall?: { label: string; percent?: (checks: Checks, rows: Row[]) => number };
  board: BoardItem[];
  /** A custom "What's left". Default: each board total minus what is checked. */
  left?: (checks: Checks, rows: Row[]) => LeftItem[];
  /** "points" shows What's left to one decimal. */
  unit?: "count" | "points";
}

export interface GuideText {
  checklistIntro: string;
  searchPlaceholder: string;
  dashboardIntro: string;
  boardTitle: string;
  boardNote: string;
  nextUpDone: string;
  /** What an export holds, in the settings dialog. */
  backupBlurb: string;
}

export interface GuideConfig {
  brand: Brand;
  /** "article": prose sections with their checks in the text. "checklist": collapsible route groups with filters. */
  layout: "article" | "checklist";
  chapters: RawChapter[];
  /** Guide-wide sources; each chapter can carry its own. */
  sources: SourceLink[];
  categories: Record<string, Category>;
  /** Category chips on the checklist page and, in the checklist layout, above the route. */
  chips: { checklist: [id: string, label: string][]; route?: [id: string, label: string][] };
  /** Secondary tags that get a badge beside the primary one in route rows. */
  badges?: string[];
  /** The category a row's `quantity` counts toward (Might Crystals by amount). */
  quantity?: string;
  missables: Missable[];
  /** Chained side quests, on the Questlines page. */
  questlines: Questlines;
  /** Shown while nothing is flagged as missable: why that is safe. Its sources back the claim and aren't shown. */
  reassurance?: { text: string; sources: SourceLink[] };
  /** Chapter id → banner, imported with `?banner` (core's banners.ts). */
  banners: Record<number, Banner>;
  /** Rows "Next up" holds back until nothing else is left in the revealed chapters. */
  defer?: (row: Row) => boolean;
  completion: Completion;
  state: {
    /** Reads a backup saved before the shared format; returns its extra fields, or null if it is not one. */
    legacy?: (value: Record<string, unknown>) => { extra?: unknown } | null;
    extra?: { initial: () => Extra; read: (value: unknown) => Extra };
  };
  text: GuideText;
}

/** An opt-in panel on the Progress page; `/dashboard/<id>` scrolls to it. */
export interface Panel {
  id: string;
  Component: ComponentType;
}
