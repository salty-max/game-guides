import type { Panel } from "@game-guides/core/types";
import { Calibration } from "./Calibration";

/** Opt-in panels for the Progress page; /dashboard/calibration scrolls to the in-game check. */
export const panels: Panel[] = [{ id: "calibration", Component: Calibration }];
