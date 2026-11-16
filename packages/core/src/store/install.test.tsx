import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { App } from "../App";
import { defaultState } from "../progress-state";
import { useProgress } from "./progress";
import { useUi } from "./ui";
import { install, listenForInstall, safariTab, useInstall, type InstallOffer } from "./install";
import { allowSlowMounts } from "../test/slow";

allowSlowMounts();

const agents = {
  iphoneSafari: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Safari/604.1",
  ipadSafari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Safari/605.1.15",
  iphoneChrome: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/140.0.0.0 Mobile/15E148 Safari/604.1",
  iphoneDuckDuckGo: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Mobile/15E148 Ddg/18.7 Safari/604.1",
  iphoneGoogleApp: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/380.0.0 Mobile/15E148 Safari/604.1",
  macSafari: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.7 Safari/605.1.15",
  androidChrome: "Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36",
};

/** A stand-in for Chromium's beforeinstallprompt. */
const offer = () => {
  const event = new Event("beforeinstallprompt", { cancelable: true }) as InstallOffer;
  event.prompt = vi.fn(() => Promise.resolve());
  return event;
};

beforeEach(() => {
  localStorage.clear();
  useInstall.setState({ offer: null, safari: false });
  useProgress.setState({ data: defaultState(), storageError: false });
  useUi.setState({ toast: null, openGroups: {}, dialog: null, afterClose: null, announcement: "" });
  history.replaceState(null, "", "/guide/1");
});

describe("which browsers get the Home Screen line", () => {
  it("Safari on an iPhone or an iPad, in a tab", () => {
    expect(safariTab(agents.iphoneSafari, 5, false)).toBe(true);
    expect(safariTab(agents.ipadSafari, 5, false)).toBe(true);
  });

  it("not once the guide runs installed", () => {
    expect(safariTab(agents.iphoneSafari, 5, true)).toBe(false);
  });

  it("not another iPhone browser, an in-app view, a Mac, or Android", () => {
    expect(safariTab(agents.iphoneChrome, 5, false)).toBe(false);
    expect(safariTab(agents.iphoneGoogleApp, 5, false)).toBe(false);
    expect(safariTab(agents.iphoneDuckDuckGo, 5, false)).toBe(false);
    expect(safariTab(agents.macSafari, 0, false)).toBe(false);
    expect(safariTab(agents.androidChrome, 5, false)).toBe(false);
  });
});

describe("Chromium's offer to install", () => {
  it("is kept, with the browser's own banner held back, and goes once the guide is installed", () => {
    const stop = listenForInstall();
    const event = offer();
    window.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(useInstall.getState().offer).toBe(event);
    window.dispatchEvent(new Event("appinstalled"));
    expect(useInstall.getState().offer).toBeNull();
    stop();
  });

  it("is used once: the browser's dialog, and the offer gone whatever the answer", () => {
    const event = offer();
    useInstall.setState({ offer: event });
    install();
    expect(event.prompt).toHaveBeenCalledTimes(1);
    expect(useInstall.getState().offer).toBeNull();
    install();
    expect(event.prompt).toHaveBeenCalledTimes(1);
  });
});

const openSettings = async (user: ReturnType<typeof userEvent.setup>) => {
  render(<App />);
  await user.click(await screen.findByRole("button", { name: "Change settings" }));
  return screen.findByRole("dialog", { name: "Guide settings" });
};

describe("Guide settings", () => {
  it("says nothing about installing where the browser hasn't offered and isn't Safari on an iPhone", async () => {
    const dialog = await openSettings(userEvent.setup());
    expect(within(dialog).queryByRole("button", { name: "Install app" })).toBeNull();
    expect(within(dialog).queryByText(/Add to Home Screen/)).toBeNull();
    expect(within(dialog).getByText(/Installed on a phone or tablet\?/)).toBeInTheDocument();
  });

  it("offers Install app once Chromium has offered, and the press shows the browser's dialog", async () => {
    const user = userEvent.setup();
    const dialog = await openSettings(user);
    const event = offer();
    act(() => void useInstall.setState({ offer: event }));
    await user.click(within(dialog).getByRole("button", { name: "Install app" }));
    expect(event.prompt).toHaveBeenCalledTimes(1);
    expect(within(dialog).queryByRole("button", { name: "Install app" })).toBeNull();
  });

  it("in Safari on an iPhone, says how to add the guide and that the app starts without this tab's progress", async () => {
    useInstall.setState({ safari: true });
    const dialog = await openSettings(userEvent.setup());
    expect(within(dialog).getByText(/open Safari’s Share menu and choose Add to Home Screen/)).toBeInTheDocument();
    expect(within(dialog).getByText(/starts with none of this tab’s progress/)).toBeInTheDocument();
    // (the general line about installed apps would say it twice)
    expect(within(dialog).queryByText(/Installed on a phone or tablet\?/)).toBeNull();
  });
});
