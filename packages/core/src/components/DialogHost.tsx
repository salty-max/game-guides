import { useEffect } from "react";
import { chunks, loadFailed } from "./chunks";
import "../lastInput";
import { useLoadable, whenIdle } from "../loadable";
import { useUi } from "../store/ui";

/**
 * The one dialog for the whole app. This is only its shell: the dialog and every screen it can show (DialogFrames.tsx) come in a chunk
 * of their own, fetched once the page has loaded and the browser is idle, so it's there before anyone asks. A dialog opened before then
 * loads it on the spot, and the dialog appears when it arrives (without the fade-in, which needs a dialog that was mounted closed).
 * If the chunk can't be fetched the dialog closes and a toast says so; the next try asks again.
 */
export function DialogHost() {
  const open = useUi((s) => s.dialog !== null);
  const loaded = useLoadable(chunks.dialog, open, () => {
    useUi.getState().closeDialog();
    loadFailed();
  });
  // The select's chunk too: the dialog's chunk brings its code anyway, and a page with a select (the checklist's filters) then shows the
  // real one from the start, not the stand-in until the next idle moment after it opens.
  useEffect(
    () =>
      whenIdle(() => {
        chunks.dialog.warm();
        chunks.select.warm();
      }),
    [],
  );
  return loaded ? <loaded.DialogFrames /> : null;
}
