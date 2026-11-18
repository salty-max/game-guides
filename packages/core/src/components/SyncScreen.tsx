import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";
import { CodeField } from "./controls";
import { DialogDescription, DialogFooter, DialogSeparator, DialogStatus, DialogText } from "./dialog";
import { ItemList, ItemRow } from "./list";
import { ScreenIntro, StorageWarning } from "./StorageWarning";
import { Button } from "./ui";
import { ago } from "../format";
import { installed } from "../persistence";
import { useProgress } from "../store/progress";
import { setSyncStatus, useSyncStatus, type SyncPhase } from "../store/sync";
import { useUi } from "../store/ui";
import { syncAfterLinking, syncSoon } from "../sync/engine";
import { browserOf, isApple } from "../sync/label";
import { afterLinked, checkStatus, claimCode, forgetGroup, removeDevice, startCode, unlinkDevice, type ClaimResult, type CodeResult, type Device } from "../sync/pairing";

/** How long a code works, which the server holds to as well. Counted from when it arrives, so a clock that's off can't shorten it. */
const CODE_LIFETIME = 10 * 60_000;
const POLL_EVERY = 3_000;
/**
 * A device's last-seen is refreshed by full syncs only (quiet polls leave it alone), every ten minutes or so, so a device that is open and
 * polling can show up to about twelve minutes old. Anything fresher than this says only that it was seen lately.
 */
const ACTIVE_WITHIN = 15 * 60_000;
/** About ten minutes of polling, the life of a code. */
const POLL_LIMIT = 200;

const clock = (ms: number) => {
  const seconds = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
};

const claimProblems: Record<Exclude<ClaimResult, { ok: true }>["why"], string> = {
  code: "That code didn’t work. Codes last 10 minutes and work once, so ask the other device for a new one.",
  limit: "Too many tries. Wait a few minutes and try again.",
  full: "This group already has 12 devices. Unlink one you no longer use, then try again.",
  offline: "Couldn’t reach the sync service. Check your connection and try again.",
  error: "Something went wrong on the sync service. Try again in a moment.",
};

const codeProblems: Record<Exclude<CodeResult, { ok: true }>["why"], string> = {
  offline: claimProblems.offline,
  limit: "Too many codes for now. Wait a while and try again.",
  error: claimProblems.error,
};

/** What a device row says about when it was last heard from. */
const deviceDetail = (device: Device, now: number) => (now - device.seen < ACTIVE_WITHIN ? "Seen in the last 15 minutes" : `Last synced ${ago(device.seen, now)}`);

const removeProblems = {
  gone: "That device is no longer in the group.",
  offline: claimProblems.offline,
  error: claimProblems.error,
};

const statusLine = (phase: SyncPhase, devices: number, lastSync: number | null): string => {
  switch (phase) {
    case "synced":
      return `Synced · ${devices} ${devices === 1 ? "device" : "devices"}${lastSync ? ` · ${ago(lastSync, Date.now())}` : ""}`;
    case "offline":
      return "Offline. Your changes are saved here and will sync when you’re back online.";
    case "paused":
      return "Sync is paused for now. Your changes are saved here and will go when it’s back.";
    case "error":
      return "Sync hit a problem. It will try again.";
    case "waiting":
      return "Waiting to sync…";
    default:
      return "Linking…";
  }
};

/**
 * One screen of the dialog. The dialog puts the focus on a screen's first field when it opens, but a screen that replaces another inside it
 * has to do that itself, or the focus goes with the button that was pressed and the reader types into nothing.
 */
function View({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => ref.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus(), []);
  return <div ref={ref}>{children}</div>;
}

/** What is stored, and what isn't. */
function PrivacyNote() {
  return (
    <DialogText small>
      No email or name. The server keeps a random id for each device, a label like “Safari · iPhone · Koholint app”, and your checks with the time you made them. It sees your IP
      address, as every website does, and keeps only a scrambled copy of it, for at most an hour, to limit tries at a code. Spoiler settings sync too. Delete synced
      progress erases it all, and anything not synced for 400 days goes by itself.
    </DialogText>
  );
}

/** What the screen last said about something that happened: a problem, or news ("Linked"). */
interface Said {
  text: string;
  error: boolean;
}

function Off({ onShow, onEnter, busy, said }: { onShow: () => void; onEnter: () => void; busy: boolean; said: Said | null }) {
  // Where the browser won't keep the progress, the warning above says it isn't saved, so this screen doesn't say it is.
  const unavailable = useProgress((s) => s.storageError);
  return (
    <View>
      <StorageWarning withExport />
      <ScreenIntro>Keep this guide’s progress the same on your other devices. No account needed.</ScreenIntro>
      <DialogText>
        {!unavailable && "Your progress is already saved on this device. "}To share it, show a code here and type it on your other device, or type the code that device
        shows. Linking works for every Hundo guide in this browser, and from then on changes follow by themselves.
      </DialogText>
      {isApple() && (
        <DialogText small>
          {installed()
            ? "This guide is an app on your Home Screen, and it keeps its own link: type a code here. Each other guide on your Home Screen needs a code of its own."
            : browserOf() === "Safari"
              ? "On an iPhone or iPad, each guide on your Home Screen keeps its own link. One you add after linking here in Safari should come up linked; one that is already there needs a code of its own."
              : "On an iPhone or iPad, each guide on your Home Screen keeps its own link, and needs a code of its own."}
        </DialogText>
      )}
      <DialogFooter>
        <Button look="" data-autofocus="" disabled={busy} focusableWhenDisabled onClick={onShow}>
          Show a code
        </Button>
        <Button disabled={busy} focusableWhenDisabled onClick={onEnter}>
          Enter a code
        </Button>
      </DialogFooter>
      <DialogStatus error={!busy && said?.error}>{busy ? "Getting a code…" : said?.text}</DialogStatus>
      <DialogSeparator />
      <PrivacyNote />
    </View>
  );
}

/** A code to type on the other device, until it is used or runs out. */
function ShowCode({ shown, onLinked, onNewCode, onBack, problem }: { shown: { code: string; at: number; linked: boolean }; onLinked: () => void; onNewCode: () => void; onBack: () => void; problem: string }) {
  const [now, setNow] = useState(() => Date.now());
  const left = shown.at + CODE_LIFETIME - now;
  const expired = left <= 0;
  // The poll below must not start over each time the screen redraws, which it does every second.
  const done = useEffectEvent(onLinked);

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // A device with no link yet is linked once the code is used. One that is linked already gains a device in the group.
  useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let baseline: number | null = null;
    let tries = 0;
    const poll = async () => {
      const result = await checkStatus();
      if (stopped) return;
      if (result.ok) {
        // The server has this device in a group but this browser doesn't know it yet (the code was typed while this screen was closed,
        // or on another device it joined): it is linked now. Otherwise a linked device waits for another to join its group.
        if (result.linked && useSyncStatus.getState().phase === "off") return done();
        if (shown.linked) {
          if (baseline === null) baseline = result.devices.length;
          else if (result.devices.length > baseline) return done();
        }
      }
      if (++tries < POLL_LIMIT && Date.now() < shown.at + CODE_LIFETIME) timer = setTimeout(() => void poll(), POLL_EVERY);
    };
    void poll();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [shown]);

  return (
    <View>
      <DialogDescription>Type this code on your other device, in any Hundo guide: Sync, then Enter a code.</DialogDescription>
      <p tabIndex={-1} data-autofocus="" className="my-4 text-center font-display text-44 leading-none font-bold tracking-[0.12em] tabular-nums outline-hidden">
        <span aria-hidden="true">
          {shown.code.slice(0, 3)}&nbsp;{shown.code.slice(3)}
        </span>
        <span className="sr-only">Your code is {shown.code.split("").join(" ")}</span>
      </p>
      <DialogText small>{expired ? "This code has expired." : `Expires in ${clock(left)}. It works once.`}</DialogText>
      <DialogStatus error={expired || Boolean(problem)}>{problem || (expired ? "This code has expired. Get a new one." : "")}</DialogStatus>
      <DialogFooter>
        {expired && (
          <Button look="" onClick={onNewCode}>
            Get a new code
          </Button>
        )}
        <Button onClick={onBack}>Back</Button>
      </DialogFooter>
    </View>
  );
}

function EnterCode({ onLinked, onBack }: { onLinked: () => void; onBack: () => void }) {
  const [value, setValue] = useState("");
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");
  const box = useRef<HTMLDivElement>(null);

  const submit = async (code: string) => {
    setBusy(true);
    setProblem("");
    const result = await claimCode(code);
    setBusy(false);
    if (result.ok) {
      afterLinked();
      return onLinked();
    }
    setProblem(claimProblems[result.why]);
    setValue("");
  };

  // A disabled field gives up the focus: once it is enabled again with a problem to show, the first box takes it back, ready for another try.
  useEffect(() => {
    if (!busy && problem) box.current?.querySelector("input")?.focus();
  }, [busy, problem]);

  return (
    <View>
      <DialogDescription>Type the six digits shown on your other device, in any Hundo guide: Sync, then Show a code.</DialogDescription>
      <div ref={box}>
        <CodeField
          id="sync-code"
          label="Code from your other device"
          value={value}
          onChange={setValue}
          onComplete={(code) => void submit(code)}
          invalid={problem !== ""}
          disabled={busy}
          autoFocus
        />
      </div>
      <DialogStatus error={!busy && problem !== ""}>{busy ? "Linking…" : problem}</DialogStatus>
      <DialogFooter>
        <Button disabled={busy} focusableWhenDisabled onClick={onBack}>
          Back
        </Button>
      </DialogFooter>
    </View>
  );
}

function Linked({
  onShow,
  busy,
  said,
  refresh,
  onUnlink,
  onForget,
  onRemove,
  focusId,
  onFocused,
}: {
  onShow: () => void;
  busy: boolean;
  said: Said | null;
  /** Counts what should make the list be read again, beyond a sync finishing: a device was removed. */
  refresh: number;
  onUnlink: () => void;
  onForget: () => void;
  onRemove: (device: Device, now: number) => void;
  /** The device whose Remove button opened the question the reader backed out of: the focus goes back to it once the list is there. */
  focusId: string | null;
  onFocused: () => void;
}) {
  const { phase, devices: count, lastSync } = useSyncStatus();
  const [devices, setDevices] = useState<{ list: Device[]; now: number } | "failed" | null>(null);
  const shown = devices === "failed" ? null : devices;

  // Who is in the group: read when the screen opens, and again whenever a sync finishes.
  useEffect(() => {
    let stopped = false;
    void checkStatus().then((result) => {
      if (stopped) return;
      // A refresh that fails keeps the list already shown.
      setDevices((shown) => (result.ok ? { list: result.devices, now: result.now } : (shown ?? "failed")));
      // The list is the count: after a device is removed, the sync's count (from its last full answer) would lag it.
      if (result.ok && useSyncStatus.getState().devices !== result.devices.length) setSyncStatus({ devices: result.devices.length });
      // This device was removed from the group by another: let the engine find out now, so this screen goes back to being unlinked.
      if (!result.ok && result.why === "unlinked") syncSoon();
    });
    return () => {
      stopped = true;
    };
  }, [lastSync, count, refresh]);

  useEffect(() => {
    if (!focusId || !shown) return;
    document.querySelector<HTMLElement>(`[data-remove="${focusId}"]`)?.focus();
    onFocused();
  }, [focusId, shown, onFocused]);

  return (
    <View>
      <StorageWarning withExport />
      <ScreenIntro>This device keeps its progress in step with your other devices, with no account.</ScreenIntro>
      <DialogStatus error={busy ? false : said ? said.error : phase === "error"}>{busy ? "Working…" : said ? said.text : statusLine(phase, count, lastSync)}</DialogStatus>
      <ItemList label="Linked devices" empty={devices === "failed" ? "Couldn’t load the list of devices. Check your connection." : "Loading the devices…"}>
        {shown?.list.map((device, index) => (
          // (by position: two devices can share a label, and a second)
          <ItemRow key={index} title={device.self ? `${device.label} (this device)` : device.label} detail={deviceDetail(device, shown.now)}>
            {/* Another device of the group can be taken out of it. This one leaves by unlinking, below. An older server's list has no ids to name one by. */}
            {!device.self && device.id && (
              <Button
                size="compact"
                data-remove={device.id}
                aria-label={`Remove ${device.label} (${deviceDetail(device, shown.now)})`}
                disabled={busy} focusableWhenDisabled
                onClick={() => onRemove(device, shown.now)}
              >
                Remove
              </Button>
            )}
          </ItemRow>
        ))}
      </ItemList>
      {isApple() && (
        <DialogText small>
          {installed()
            ? "This guide is an app on your Home Screen, and each guide you add there keeps its own link: open its Sync screen and type a code there."
            : browserOf() === "Safari"
              ? "On an iPhone or iPad, a guide you add to the Home Screen from now on should come up linked; one that is already there needs a code of its own: open its Sync screen and type one."
              : "On an iPhone or iPad, each guide on your Home Screen keeps its own link: open its Sync screen and type a code there."}
        </DialogText>
      )}
      <DialogFooter>
        <Button look="" data-autofocus="" disabled={busy} focusableWhenDisabled onClick={onShow}>
          Link another device
        </Button>
        <Button disabled={busy} focusableWhenDisabled onClick={onUnlink}>
          Unlink this device
        </Button>
        <Button look="danger" disabled={busy} focusableWhenDisabled onClick={onForget}>
          Delete synced progress…
        </Button>
      </DialogFooter>
      <DialogText small>Unlinking only stops this device from syncing: the progress on it stays. Importing a backup while linked replaces the progress on every linked device.</DialogText>
      <DialogSeparator />
      <PrivacyNote />
    </View>
  );
}

/** The question before everything synced is deleted, on the screen itself: the safe answer takes the focus. */
function Forget({ busy, onDelete, onBack }: { busy: boolean; onDelete: () => void; onBack: () => void }) {
  return (
    <View>
      <DialogDescription>Delete synced progress?</DialogDescription>
      <DialogText>
        This erases the synced copy of every Hundo guide’s progress and unlinks all your devices. The progress on each device stays, and each can be linked again.
      </DialogText>
      <DialogFooter>
        <Button look="danger" disabled={busy} focusableWhenDisabled onClick={onDelete}>
          Delete synced progress
        </Button>
        <Button data-autofocus="" disabled={busy} focusableWhenDisabled onClick={onBack}>
          Cancel
        </Button>
      </DialogFooter>
    </View>
  );
}

/** The question before a device is taken out of the group, on the screen itself: the safe answer takes the focus. */
function Remove({ device, detail, busy, onRemove, onBack }: { device: Device; detail: string; busy: boolean; onRemove: () => void; onBack: () => void }) {
  return (
    <View>
      <DialogDescription>Remove “{device.label}” from your synced devices?</DialogDescription>
      <DialogText>{detail}.</DialogText>
      <DialogText>
        It stops syncing, and is unlinked the next time it connects. Its own progress stays on it, and nothing is deleted from your other devices. It can be linked again with a code.
      </DialogText>
      <DialogFooter>
        <Button look="danger" disabled={busy} focusableWhenDisabled onClick={onRemove}>
          Remove
        </Button>
        <Button data-autofocus="" disabled={busy} focusableWhenDisabled onClick={onBack}>
          Cancel
        </Button>
      </DialogFooter>
    </View>
  );
}

type Screen = "home" | "show" | "enter" | "forget" | "remove";

/** Sync devices: link a device with a six-digit code, see the linked ones, and leave. */
export function SyncScreen() {
  const phase = useSyncStatus((s) => s.phase);
  const announce = useUi((s) => s.announce);
  const [view, setView] = useState<Screen>("home");
  const [shown, setShown] = useState<{ code: string; at: number; linked: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState<{ device: Device; detail: string } | null>(null);
  const [refresh, setRefresh] = useState(0);
  const [focusId, setFocusId] = useState<string | null>(null);
  const lastSync = useSyncStatus((s) => s.lastSync);
  // What just happened ("Linked", "This device is unlinked"). While linked, it gives way to the sync status once the next sync finishes.
  const [said, setSaid] = useState<(Said & { at: number | null }) | null>(null);
  const [problem, setProblem] = useState("");
  const news = said && (phase === "off" || said.at === lastSync) ? said : null;
  const status: Said | null = problem ? { text: problem, error: true } : news;
  const tell = (text: string, error = false) => setSaid({ text, error, at: lastSync });
  const linked = phase !== "off";

  const show = async () => {
    if (busy) return;
    setBusy(true);
    setProblem("");
    const result = await startCode();
    setBusy(false);
    if (!result.ok) return setProblem(codeProblems[result.why]);
    setShown({ code: result.code, at: Date.now(), linked: result.linked });
    setView("show");
  };

  const finished = (message: string) => {
    setView("home");
    setProblem("");
    tell(message);
    announce(message);
  };

  const unlink = async () => {
    if (busy) return;
    setBusy(true);
    const done = await unlinkDevice();
    setBusy(false);
    if (done) finished("This device is unlinked. Its progress stays here.");
    else tell("Couldn’t reach the sync service, so this device is still linked. Try again when you’re online.", true);
  };

  const remove = async () => {
    if (busy || !target?.device.id) return;
    const { device } = target;
    setBusy(true);
    const result = await removeDevice(device.id!);
    setBusy(false);
    setRefresh((count) => count + 1);
    if (result === "removed") return finished(`Removed “${device.label}”. Its progress stays on it, and it is unlinked the next time it connects.`);
    setView("home");
    tell(removeProblems[result], result !== "gone");
  };

  const forget = async () => {
    if (busy) return;
    setBusy(true);
    const done = await forgetGroup();
    setBusy(false);
    if (done) finished("Synced progress deleted. Progress on this device stays.");
    else {
      setView("home");
      tell("Couldn’t reach the sync service, so nothing was deleted. Try again when you’re online.", true);
    }
  };

  if (view === "show" && shown) {
    return (
      <ShowCode
        key={shown.at}
        shown={shown}
        problem={problem}
        onLinked={() => {
          const first = useSyncStatus.getState().phase === "off";
          if (first) afterLinked();
          else syncAfterLinking();
          finished(first ? "Linked. Syncing your progress." : "A device joined.");
        }}
        onNewCode={() => void show()}
        onBack={() => setView("home")}
      />
    );
  }
  if (view === "remove" && target) return <Remove device={target.device} detail={target.detail} busy={busy} onRemove={() => void remove()} onBack={() => {
          if (busy) return;
          setFocusId(target.device.id ?? null);
          setView("home");
        }} />;
  if (view === "forget") return <Forget busy={busy} onDelete={() => void forget()} onBack={() => !busy && setView("home")} />;
  if (view === "enter") {
    return (
      <EnterCode
        onLinked={() => finished("Linked. Syncing your progress.")}
        onBack={() => setView("home")}
      />
    );
  }
  return linked ? (
    <Linked
      onShow={() => void show()}
      busy={busy}
      said={status}
      refresh={refresh}
      focusId={focusId}
      onFocused={() => setFocusId(null)}
      onUnlink={() => void unlink()}
      onForget={() => !busy && setView("forget")}
      onRemove={(device, now) => {
        if (busy) return;
        setTarget({ device, detail: deviceDetail(device, now) });
        setView("remove");
      }}
    />
  ) : (
    <Off onShow={() => void show()} onEnter={() => !busy && setView("enter")} busy={busy} said={status} />
  );
}
