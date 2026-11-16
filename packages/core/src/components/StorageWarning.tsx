import { useState, type ReactNode } from "react";
import { exportProgress } from "../backup";
import { DialogDescription, DialogFooter, DialogStatus, DialogText } from "./dialog";
import { Button } from "./ui";
import { useProgress } from "../store/progress";

/**
 * What a dialog screen says when the browser won't keep the progress: at the top of the Sync screen, and above the backup in the settings.
 * The status button in the title bar opens the Sync screen whatever state it is in, so both screens carry this one paragraph and the words
 * can't drift apart. It is what the dialog's aria-describedby points to, which a screen reader reads on opening (not tried with one); a
 * dialog has one description, so a screen that has its own (the Sync screen's) writes it with `ScreenIntro`, which steps aside for it. The
 * settings have an Export button of their own below; the Sync screen asks for one here (`withExport`).
 */
export function StorageWarning({ withExport = false }: { withExport?: boolean }) {
  const unavailable = useProgress((s) => s.storageError);
  if (!unavailable) return null;
  return (
    <>
      <DialogDescription error>Browser storage is unavailable. Export a backup before closing this tab.</DialogDescription>
      {withExport && <ExportBackup />}
    </>
  );
}

/** The paragraph that says what a screen is for: the dialog's description, unless the warning is (then it is a plain paragraph). */
export function ScreenIntro({ children }: { children: ReactNode }) {
  const unavailable = useProgress((s) => s.storageError);
  return unavailable ? <DialogText>{children}</DialogText> : <DialogDescription>{children}</DialogDescription>;
}

/** Export, and a line in the dialog that says it was done: the page's own announcement is behind the modal, where a screen reader can't hear it. */
function ExportBackup() {
  const [said, setSaid] = useState("");
  return (
    <>
      <DialogFooter>
        <Button
          onClick={() => {
            exportProgress();
            setSaid("Progress backup exported.");
          }}
        >
          Export progress
        </Button>
      </DialogFooter>
      <DialogStatus>{said}</DialogStatus>
    </>
  );
}
