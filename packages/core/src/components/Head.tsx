import { useEffect } from "react";
import { useLocation } from "react-router";
import { brand, chapters, config } from "../guide";
import { headFor } from "../search";
import { isOpen, useProgress } from "../store/progress";

const chapterTitles = chapters.map((chapter) => chapter.title);
const chips = config.chips.checklist.map(([, label]) => label);

/** The `<head>` element matching `selector`, made from `attributes` when the shell has none. */
const tag = (selector: string, name: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLElement>(selector);
  if (!element) {
    element = document.createElement(name);
    for (const [key, value] of Object.entries(attributes)) element.setAttribute(key, value);
    document.head.append(element);
  }
  return element;
};

/**
 * The page's title, description, canonical and robots rule, for the address shown and what is revealed (search.ts). One place in the
 * app rather than one per page, since the pages stay drawn while hidden (Pages). It edits the shell's own title and description, so
 * there is only ever one of each; the canonical and the noindex exist only here, never in the shell, so the two can't disagree.
 */
export function Head() {
  const { pathname } = useLocation();
  const data = useProgress((s) => s.data);

  useEffect(() => {
    const head = headFor(pathname, { brand, chapterTitles, chips, savedChapter: data.chapter, open: (n) => isOpen(data, n) });
    document.title = head.title;
    tag('meta[name="description"]', "meta", { name: "description" }).setAttribute("content", head.description);
    tag('link[rel="canonical"]', "link", { rel: "canonical" }).setAttribute("href", head.canonical);
    const robots = document.head.querySelector('meta[name="robots"]');
    if (head.noindex) tag('meta[name="robots"]', "meta", { name: "robots" }).setAttribute("content", "noindex");
    else robots?.remove();
  }, [pathname, data]);

  return null;
}
