import { useEffect } from "react";
import { chunks } from "./chunks";
import { useLoadable, whenIdle } from "../loadable";

/** The tooltip's shell, on every page: fetches the tooltip (Tooltips.tsx) once the page is idle and mounts it. Until then, no tooltips. */
export function TooltipHost() {
  const loaded = useLoadable(chunks.tooltips, false);
  useEffect(() => whenIdle(chunks.tooltips.warm), []);
  return loaded ? <loaded.Tooltips /> : null;
}
