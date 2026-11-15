import { useEffect, useEffectEvent, useRef, useState, type ReactNode } from "react";
import { CodeField } from "./controls";
import { DialogDescription, DialogFooter, DialogSeparator, DialogStatus, DialogText } from "./dialog";
import { ItemList, ItemRow } from "./list";
import { Button } from "./ui";
import { ago } from "../format";
import { installed } from "../persistence";
import { useSyncStatus, type SyncPhase } from "../store/sync";
import { useUi } from "../store/ui";
import { syncSoon } from "../sync/engine";
import { isApple } from "../sync/label";
import { afterLinked, checkStatus, claimCode, forgetGroup, startCode, unlinkDevice, type ClaimResult, type CodeResult, type Device } from "../sync/pairing";

/** How long a code works, which the server holds to as well. Counted from when it arrives, so a clock that's off can't shorten it. */
const CODE_LIFETIME = 10 * 60_000;
const POLL_EVERY = 3_000;
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
      No email or name. The server keeps a random id for each device, a label like “Safari · iPhone”, and your checks with the time you made them. It sees your IP
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
  return (
    <View>
      <DialogDescription>Keep this guide’s progress the same on your other devices. No account needed.</DialogDescription>
      <DialogText>
        Show a code on one device and type it on the other. Linking works for every Hundo guide in this browser, and from then on changes follow by themselves.
      </DialogText>
      {isApple() && (
        <DialogText small>
          {installed()
            ? "This guide is installed, so it keeps its own storage: type a code here once."
            : "On an iPhone or iPad, link here in Safari first, then add the guides to your Home Screen, and they should start linked. A guide already on your Home Screen takes a code once."}
        </DialogText>
      )}
      <DialogFooter>
        <Button look="" data-autofocus="" aria-disabled={busy || undefined} onClick={onShow}>
          Show a code
        </Button>
        <Button aria-disabled={busy || undefined} onClick={onEnter}>
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
      <p tabIndex={-1} data-autofocus="" className="my-4 text-center font-display text-[44px] leading-none font-bold tracking-[0.12em] tabular-nums outline-hidden">
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
        <Button aria-disabled={busy || undefined} onClick={() => !busy && onBack()}>
          Back
        </Button>
      </DialogFooter>
    </View>
  );
}

function Linked({ onShow, busy, said, onUnlink, onForget }: { onShow: () => void; busy: boolean; said: Said | null; onUnlink: () => void; onForget: () => void }) {
  const { phase, devices: count, lastSync } = useSyncStatus();
  const [devices, setDevices] = useState<{ list: Device[]; now: number } | "failed" | null>(null);
  const shown = devices === "failed" ? null : devices;

  // Who is in the group: read when the screen opens, and again whenever a sync finishes.
  useEffect(() => {
    let stopped = false;
    void checkStatus().then((result) => {
      // A refresh that fails keeps the list already shown.
      if (!stopped) setDevices((shown) => (result.ok ? { list: result.devices, now: result.now } : (shown ?? "failed")));
    });
    return () => {
      stopped = true;
    };
  }, [lastSync, count]);

  return (
    <View>
      <DialogDescription>This device keeps its progress in step with your other devices, with no account.</DialogDescription>
      <DialogStatus error={busy ? false : said ? said.error : phase === "error"}>{busy ? "Working…" : said ? said.text : statusLine(phase, count, lastSync)}</DialogStatus>
      <ItemList label="Linked devices" empty={devices === "failed" ? "Couldn’t load the list of devices. Check your connection." : "Loading the devices…"}>
        {shown?.list.map((device, index) => (
          // (by position: two devices can share a label, and a second)
          <ItemRow key={index} title={device.self ? `${device.label} (this device)` : device.label} detail={`Last synced ${ago(device.seen, shown.now)}`} />
        ))}
      </ItemList>
      <DialogFooter>
        <Button look="" data-autofocus="" aria-disabled={busy || undefined} onClick={onShow}>
          Link another device
        </Button>
        <Button aria-disabled={busy || undefined} onClick={onUnlink}>
          Unlink this device
        </Button>
        <Button look="danger" aria-disabled={busy || undefined} onClick={onForget}>
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
        <Button look="danger" aria-disabled={busy || undefined} onClick={onDelete}>
          Delete synced progress
        </Button>
        <Button data-autofocus="" aria-disabled={busy || undefined} onClick={onBack}>
          Cancel
        </Button>
      </DialogFooter>
    </View>
  );
}

type Screen = "home" | "show" | "enter" | "forget";

/** Sync devices: link a device with a six-digit code, see the linked ones, and leave. */
export function SyncScreen() {
  const phase = useSyncStatus((s) => s.phase);
  const announce = useUi((s) => s.announce);
  const [view, setView] = useState<Screen>("home");
  const [shown, setShown] = useState<{ code: string; at: number; linked: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
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
          else syncSoon();
          finished(first ? "Linked. Syncing your progress." : "A device joined.");
        }}
        onNewCode={() => void show()}
        onBack={() => setView("home")}
      />
    );
  }
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
    <Linked onShow={() => void show()} busy={busy} said={status} onUnlink={() => void unlink()} onForget={() => !busy && setView("forget")} />
  ) : (
    <Off onShow={() => void show()} onEnter={() => !busy && setView("enter")} busy={busy} said={status} />
  );
}
