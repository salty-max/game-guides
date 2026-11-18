import { panels } from "virtual:guide/panels";
import { text } from "./guide";

/**
 * The Progress page's parts under its overall figure, in the page's order, each with the id its Panel carries and the title its
 * PanelTitle shows: its "On this page" list, and the parts `/dashboard/<id>` scrolls to (DashboardPage; Layout leaves the scroll to the
 * page for these, and sends any other `/dashboard/<x>` to the top). The ids are addresses readers keep, like row ids: they never change
 * once live. A guide's own panels (virtual:guide/panels) sit between the backup and what's left.
 */
export const dashboardSections: readonly { id: string; title: string }[] = [
  { id: "chapters", title: "Chapter progress" },
  { id: "backup", title: "Progress backup" },
  ...panels.map(({ id, title }) => ({ id, title })),
  { id: "whats-left", title: "What’s left" },
  { id: "categories", title: text.boardTitle },
];

/** Whether `/dashboard/<section>` names a part of the page to scroll to. */
export const isDashboardSection = (section: string | undefined) => dashboardSections.some(({ id }) => id === section);
