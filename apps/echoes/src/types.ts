/** [id, categories (space separated, first one is the primary), title, text, Might Crystals the entry awards] */
export type RawRow = [id: string, categories: string, title: string, text: string, quantity?: number];

export type SourceLink = [label: string, url: string];

export interface RawGroup {
  title: string;
  note?: string;
  sources?: SourceLink[];
  rows: RawRow[];
}

export interface RawChapter {
  id: number;
  title: string;
  region: string;
  intro: string;
  /** What the rail shows while the chapter is hidden: a place name, never story. */
  teaser: string;
  sources: SourceLink[];
  groups: RawGroup[];
}

export interface Row {
  id: string;
  title: string;
  text: string;
  chapter: number;
  group: string;
  /** Every category the entry counts toward. The first one is its primary label. */
  tags: string[];
  /** Might Crystals this entry awards. */
  quantity: number;
}

export interface Group {
  key: string;
  title: string;
  note?: string;
  sources: SourceLink[];
  rows: Row[];
}

export interface Chapter extends Omit<RawChapter, "groups"> {
  groups: Group[];
}

export interface ProgressState {
  version: 1;
  guide: "echoes-of-wisdom";
  checks: Record<string, true>;
  ceiling: number;
  spoilers: boolean;
  chapter: number;
}
