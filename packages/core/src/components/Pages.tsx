import { Activity, memo, useState, type ReactNode } from "react";
import { Routes, useLocation, type Location } from "react-router";
import { Arrival, Showing, useReturning } from "../store/place";

// The pages that are kept, one of each: the start address and any the guide doesn't know are the guide's (Home sends them to a chapter).
const views = ["guide", "checklist", "dashboard"] as const;
type View = (typeof views)[number];
const viewOf = (pathname: string): View => {
  const first = pathname.split("/").filter(Boolean)[0];
  return views.find((view) => view === first) ?? "guide";
};

interface Kept {
  /** The address the page was last shown at, which it goes on showing while it is hidden. */
  location: Location;
  /** Whether the reader was coming back to it then (store/place.ts). */
  returning: boolean;
  /** A new visit builds the page afresh: the history entry it began at. */
  since: string;
  /** How many times it has come on screen (store/place.ts's Showing). */
  showing: number;
}

interface Shown {
  pages: Partial<Record<View, Kept>>;
  /** The history entry and the page on screen. */
  key: string;
  view: View;
}

/**
 * The page the address shows, among the others the reader has been on, kept as they left them. Each of the three pages (Guide, Checklist,
 * Progress) stays drawn once it has been seen, hidden by React's Activity while another is on screen, so going back to it (a tab
 * of the bar, Back or Forward) shows it at once, scroll and state and all, the way a phone's tab bar does, instead of building it again. A
 * new visit to a page (a link to it from another page, not a tab: store/place.ts's useReturning) builds it afresh from the address, as it
 * always did; a move within the page on screen is the page's own business (its chapter or its address, which its parts are keyed by).
 * A hidden page keeps drawing its own address; it catches up with the progress as it comes back. `children` are the routes, the same
 * element every time, so a move redraws only the page it shows.
 */
export function Pages({ children }: { children: ReactNode }) {
  const location = useLocation();
  const returning = useReturning();
  const view = viewOf(location.pathname);
  const arrived = (before: Shown | null): Shown => {
    const kept = before?.pages[view];
    const fresh = !kept || (!returning && view !== before?.view);
    const showing = (kept?.showing ?? 0) + (view !== before?.view ? 1 : 0);
    return { pages: { ...before?.pages, [view]: { location, returning, since: fresh ? location.key : kept.since, showing } }, key: location.key, view };
  };
  const [shown, setShown] = useState<Shown>(() => arrived(null));
  // A move: this render draws the new address at once (React renders again with the state set here before it shows anything).
  const current = shown.key === location.key ? shown : arrived(shown);
  if (current !== shown) setShown(current);

  return views.map((id) => {
    const page = current.pages[id];
    return page ? <Page key={id} {...page} visible={id === view} routes={children} /> : null;
  });
}

/** One kept page: drawn again only when its own address, or whether it is on screen, changes. */
const Page = memo(function Page({ location, returning, since, showing, visible, routes }: Kept & { visible: boolean; routes: ReactNode }) {
  return (
    <Activity mode={visible ? "visible" : "hidden"}>
      <Showing value={visible ? showing : null}>
        <Arrival value={returning}>
          {/* One element, so Activity hides the page with one style, and the pages' own first and last children stay theirs. */}
          <div>
            <Routes key={since} location={location}>
              {routes}
            </Routes>
          </div>
        </Arrival>
      </Showing>
    </Activity>
  );
});
