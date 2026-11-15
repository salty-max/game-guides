import { Tooltip } from "@base-ui/react/tooltip";

/**
 * The one tooltip every icon button shares. A button with `tooltip` is a detached Base UI trigger tied to this handle, carrying its
 * label as the payload; the tooltip itself (Tooltips.tsx, with floating-ui's positioning under it) is a chunk of its own that
 * TooltipHost mounts once the page is idle. Until it arrives a trigger works as a plain button and shows nothing; once it has, the
 * trigger joins it without being drawn again, so a button that has the focus keeps it.
 */
export const tooltip = Tooltip.createHandle<string>();
