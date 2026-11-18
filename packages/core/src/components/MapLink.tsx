import { Icon } from "./Icon";
import { rowLinkClasses } from "./TickItem";
import type { MapLink as Map } from "../types";

interface MapLinkProps {
  map: Map;
  /** What the map is for, in the accessible name: a group's or a row's title. */
  of: string;
  /** A group's link names its site; a row's says "Map" alone, beside its tags. */
  at: "group" | "row";
}

/**
 * A link out to a page that shows where things are. It opens in a new tab and says so, to a screen reader by its name, which starts
 * with the words on screen so a voice command that reads them finds it.
 */
export function MapLink({ map: [site, url], of, at }: MapLinkProps) {
  return (
    <a
      className={`${rowLinkClasses} inline-flex items-center gap-1 font-semibold [&_svg]:size-3.75`}
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={at === "group" ? `Map on ${site} for ${of} (opens in a new tab)` : `Map for ${of} on ${site} (opens in a new tab)`}
    >
      <Icon name="pin" />
      {at === "group" ? `Map on ${site}` : "Map"}
      <Icon name="out" />
    </a>
  );
}
