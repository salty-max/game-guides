import { exportProgress } from "../backup";
import { DialogFooter, DialogText } from "./dialog";
import { Button } from "./ui";
import { useProgress } from "../store/progress";

/**
 * What a dialog screen says when the browser won't keep the progress: at the top of the Sync screen, and above the backup in the settings.
 * The status button in the title bar opens the Sync screen whatever state it is in, so both screens carry this one paragraph and the words
 * can't drift apart. The settings have an Export button of their own just below; the Sync screen has none, so it asks for one here.
 */
export function StorageWarning({ withExport = false }: { withExport?: boolean }) {
  const unavailable = useProgress((s) => s.storageError);
  if (!unavailable) return null;
  return (
    <>
      <DialogText error>Browser storage is unavailable. Export a backup before closing this tab.</DialogText>
      {withExport && (
        <DialogFooter>
          <Button onClick={exportProgress}>Export progress</Button>
        </DialogFooter>
      )}
    </>
  );
}
