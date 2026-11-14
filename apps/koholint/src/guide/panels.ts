import type { Panel } from "../core/types";
import { DeathlessRun } from "./DeathlessRun";

/** Opt-in panels for the Progress page; /dashboard/deathless scrolls to the run log. */
export const panels: Panel[] = [{ id: "deathless", Component: DeathlessRun }];
