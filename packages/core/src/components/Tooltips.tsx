import { Tooltip } from "@base-ui/react/tooltip";
import { tooltip } from "./tooltip-handle";

/**
 * The icon buttons' tooltip: the button's own label in a small box under it, for a pointer that rests on it or a keyboard that
 * reaches it. It is visual only, as Base UI means its tooltips: it shows what the button's aria-label already tells a screen reader, and
 * touch never opens it. Loaded by TooltipHost; nothing else imports this.
 */
export function Tooltips() {
  return (
    <Tooltip.Root handle={tooltip}>
      {({ payload }) => (
        <Tooltip.Portal>
          <Tooltip.Positioner sideOffset={6} className="z-50">
            <Tooltip.Popup className="origin-(--transform-origin) rounded-small bg-ink px-2 py-1 text-12 leading-[1.3] font-bold text-paper shadow-[0_6px_20px_var(--shadow)] transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-instant:transition-none data-starting-style:scale-95 data-starting-style:opacity-0 motion-reduce:transition-none">
              {payload}
            </Tooltip.Popup>
          </Tooltip.Positioner>
        </Tooltip.Portal>
      )}
    </Tooltip.Root>
  );
}
