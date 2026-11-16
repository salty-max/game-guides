import { useState, type FormEvent } from "react";
import { useLocation, useNavigate } from "react-router";
import { Checkbox, FileField, RadioGroup, Switch } from "./controls";
// The settings screen is in the dialog's chunk, so it uses the select itself: the shell's stand-in would flash while the select loaded.
import { SelectImpl as Select } from "./select-impl";
import { DialogDescription, DialogFooter, DialogSeparator, DialogStatus, DialogText } from "./dialog";
import { Button } from "./ui";
import { brand, chapters, readChapter, text } from "../guide";
import { exportProgress } from "../backup";
import { validateState } from "../progress-state";
import { isOpen, useProgress } from "../store/progress";
import { useSyncStatus } from "../store/sync";
import { canKeepAwake, useAwake } from "../store/awake";
import { normalizeTheme, themeOptions, useTheme } from "../store/theme";
import { useUi, type DialogState } from "../store/ui";
import type { ProgressState } from "../types";

type Screens = NonNullable<DialogState>;

/** A question that needs an answer. */
export function ConfirmScreen({ dialog }: { dialog: Extract<Screens, { kind: "confirm" }> }) {
  const closeDialog = useUi((s) => s.closeDialog);
  const closeDialogThen = useUi((s) => s.closeDialogThen);
  // The safe answer takes the focus when the action destroys something.
  return (
    <>
      <DialogDescription>{dialog.explanation}</DialogDescription>
      <DialogFooter>
        <Button look={dialog.danger ? "danger" : ""} data-autofocus={dialog.danger ? undefined : ""} onClick={() => closeDialogThen(dialog.onConfirm)}>
          {dialog.label}
        </Button>
        <Button data-autofocus={dialog.danger ? "" : undefined} onClick={closeDialog}>
          Cancel
        </Button>
      </DialogFooter>
    </>
  );
}

/** Theme, how far the guide reveals, keeping the screen on (where the browser can), and the progress backup. */
export function SettingsScreen() {
  const data = useProgress((s) => s.data);
  const storageError = useProgress((s) => s.storageError);
  const preference = useTheme((s) => s.preference);
  const keptAwake = useAwake((s) => s.on);
  const closeDialogThen = useUi((s) => s.closeDialogThen);
  const openDialog = useUi((s) => s.openDialog);
  const announce = useUi((s) => s.announce);
  const synced = useSyncStatus((s) => s.phase !== "off");
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [theme, setTheme] = useState(preference);
  const [awake, setAwake] = useState(keptAwake);
  const [spoilers, setSpoilers] = useState(data.spoilers);
  const [ceiling, setCeiling] = useState(data.ceiling);
  const [imported, setImported] = useState<ProgressState>();
  const [feedback, setFeedback] = useState<{ text: string; error: boolean }>({ text: "", error: false });

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    useTheme.getState().setPreference(theme);
    useAwake.getState().setOn(awake);
    useProgress.getState().saveSettings({ spoilers, ceiling });
    closeDialogThen(() => announce("Guide settings saved."));
    const next = useProgress.getState().data;
    const [view, param] = pathname.split("/").filter(Boolean);
    if (view === "guide" && !isOpen(next, readChapter(param, next.chapter))) navigate(`/guide/${next.chapter}`);
  };

  const pickFile = async (file: File | undefined) => {
    setImported(undefined);
    if (!file) return setFeedback({ text: "", error: false });
    try {
      if (file.size > 1_000_000) throw new Error("The backup is too large.");
      const parsed = validateState(JSON.parse(await file.text()));
      setImported(parsed);
      const count = Object.keys(parsed.checks).length;
      setFeedback({ text: `${count} checked ${count === 1 ? "entry" : "entries"} found. Select Replace with backup to load them.`, error: false });
    } catch {
      setFeedback({ text: `Couldn’t read this ${brand.name} progress backup.`, error: true });
    }
  };

  const replace = () => {
    if (!imported) return;
    useProgress.getState().replaceAll(imported);
    closeDialogThen(() => announce("Progress backup loaded."));
    const [view, param] = pathname.split("/").filter(Boolean);
    if (view === "guide") navigate(`/guide/${isOpen(imported, imported.chapter) ? imported.chapter : imported.ceiling}`);
    else if (!param) navigate(pathname);
  };

  return (
    <>
      <DialogText>Choose your theme and how far the guide can reveal.</DialogText>
      <form id="guide-settings" className="grid gap-2.25" onSubmit={submit}>
        <RadioGroup label="Appearance" choices={themeOptions} value={theme} onChange={(next) => setTheme(normalizeTheme(next))} />
        <Checkbox label="Hide later chapters" checked={spoilers} onChange={setSpoilers} />
        <Select
          id="ceiling"
          label="Reveal through"
          choices={chapters.map((chapter): [number, string] => [chapter.id, `Chapter ${chapter.id}`])}
          value={ceiling}
          onChange={(next) => setCeiling(readChapter(next))}
        />
        {canKeepAwake() && <Switch label="Keep screen on" checked={awake} onChange={setAwake} />}
        <DialogFooter>
          <Button type="submit" look="">
            Save settings
          </Button>
        </DialogFooter>
      </form>
      <DialogSeparator />
      <DialogText>
        {text.backupBlurb} Importing replaces the current progress{synced ? ", here and on every device you sync with" : ""}.
      </DialogText>
      <DialogText small>
        Installed on a phone or tablet? The installed app can keep its own separate storage. Export here first, then import in the installed app.
      </DialogText>
      {storageError && <DialogText error>Browser storage is unavailable. Export a backup before closing this tab.</DialogText>}
      <FileField id="import-file" label="Import progress backup" accept=".json,application/json" onChange={(file) => void pickFile(file)} />
      <DialogStatus error={feedback.error}>{feedback.text}</DialogStatus>
      <DialogFooter>
        <Button onClick={exportProgress}>Export progress</Button>
        <Button id="import-button" disabled={!imported} onClick={replace}>
          Replace with backup
        </Button>
        <Button onClick={() => openDialog({ kind: "sync" })}>Sync devices</Button>
      </DialogFooter>
    </>
  );
}
