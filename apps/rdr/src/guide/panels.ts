import type { Panel } from "@hundo/core/types";
import { Calibration } from "./Calibration";

/** Opt-in panels for the Progress page; /dashboard/calibration scrolls to the in-game check. */
export const panels: Panel[] = [{ id: "calibration", title: "Check against the game", Component: Calibration }];
